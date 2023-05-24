import { Employee } from "@prisma/client";
import { HttpException } from '../config/httpException';
import { LoginDTO } from '../model/dtos/login.dto';
import { TokenData, DataStoredInAccessToken, DataStoredInRefreshToken } from '../interfaces/auth.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { ResponseData } from "../config/responseData.config";
import { prisma } from '../database/prisma.singleton';
import { CreateEmployeeDTO } from '../model/dtos/employee.dto';
import { env } from "../config/env.config";
import { application_permission } from "../config/permission.config";
import { ResponseToken } from "../config/ResponseToken.config";

class AuthenticationService {
  public async createAccessToken(employeeData: Employee): Promise<TokenData> {
    const expiresIn: number = Number.parseInt(env.SECRET_EXPRIED);
    const secret = env.SECRET_KEY;

    const queryRoleData = await prisma.role.findFirst({
      where: {
        roleId: employeeData.roleId,
        deleted: false,
      }
    })

    const dataStoredInToken: DataStoredInAccessToken = {
      id: employeeData.id,
      email: employeeData.email,
      image: employeeData.image,
      departmentId: employeeData.departmentId,
      roleName: queryRoleData.roleName,
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public async createRefreshToken(employeeData: Employee): Promise<TokenData> {
    const expiresIn: number = Number.parseInt(env.REFRESH_EXPIRED);
    const secret = env.REFRESH_KEY;
    const dataStoredInToken: DataStoredInRefreshToken = {
      id: employeeData.id,
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public async registration(employeeData: CreateEmployeeDTO): Promise<ResponseData<String>> {
    const response = new ResponseData<String>;
    const findEmployee: Employee = await prisma.employee.findUnique({
      where: {
        email: employeeData.email
      }
    })
    if (findEmployee) throw new HttpException(409, `This email ${employeeData.email} already exists`);
    const hashedPassword = await bcrypt.hash(employeeData.password, 10);
    const role = await prisma.role.findUnique({
      where: {
        displayName: employeeData.displayName
      }
    })
    const createEmployeeData = await prisma.employee.create({
      data: {
        fullname: employeeData.fullname,
        email: employeeData.email,
        password: hashedPassword,
        roleId: role.roleId,
      }
    });
    if (createEmployeeData) {
      response.result = "Register successfully"
    } else {
      response.message = "Register failed, try again!"
    }
    return response;
  }

  public async generateToken(employeeData: Employee): Promise<ResponseToken> {
    const response = new ResponseToken();
    const accessTokenData = await this.createAccessToken(employeeData);
    const refreshTokenData = await this.createRefreshToken(employeeData);
    //update the refresh token in database
    await prisma.employee.update({
      where: {
        id: employeeData.id,
      },
      data: {
        refreshToken: await argon2.hash(refreshTokenData.token),
      }
    })

    response.access = accessTokenData.token;
    response.refresh = refreshTokenData.token;
    return response;
  }

  public async login(loginData: LoginDTO): Promise<ResponseToken> {
    const findEmployee: Employee = await prisma.employee.findFirst({
      where: {
        email: loginData.email,
        deleted: false,
      }
    })
    if (!findEmployee) throw new HttpException(409, `This email ${loginData.email} was not found`);
    const isPasswordMatching = await bcrypt.compare(loginData.password, findEmployee.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");
    findEmployee.password = undefined;
    return await this.generateToken(findEmployee);
  }

  public async logout(employee_id: string): Promise<ResponseData<boolean>> {
    const response = new ResponseData<boolean>();
    //delete refresh token
    const queryData = await prisma.employee.update({
      where: {
        id: employee_id,
      },
      data: {
        refreshToken: null,
      }
    })
    response.result = queryData && true;
    return response;
  }

  public async refreshToken(employee_id: string, refreshToken: string): Promise<ResponseToken> {
    //Get the token from database and compare refresh
    const findEmployee = await prisma.employee.findUnique({
      where: {
        id: employee_id
      }
    })
    if (!findEmployee)
      throw new HttpException(401, "Access denied");

    const refreshTokenMatches = await argon2.verify(findEmployee.refreshToken, refreshToken);
    if (!refreshTokenMatches)
      throw new HttpException(404, "Token invalid");

    const tokens: ResponseToken = await this.generateToken(findEmployee);
    return tokens;
  }

  public async getPerms(employeeId: string): Promise<ResponseData<any>> {
    const response = new ResponseData<any>;

    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId
      },
    })

    const queryData = await prisma.rolePermission.findMany({
      where: {
        roleId: employee.roleId,
      },
      select: {
        role: {
          select: {
            roleName: true,
          }
        },
        permission: {
          select: {
            permissionName: true,
          }
        },
        resource: {
          select: {
            resourceName: true,
          }
        },
      }
    })

    var result: Array<any> = [];
    for (const rolePerm of queryData) {
      const tempObj = {
        role: rolePerm.role.roleName,
        permission: rolePerm.permission.permissionName,
        resource: rolePerm.resource.resourceName,
      }
      result.push(tempObj);
    }

    response.result = result;
    return response;
  }
}

export default AuthenticationService;