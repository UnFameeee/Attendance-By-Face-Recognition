import { PrismaClient } from "@prisma/client";
import { Page, Paging, paginate } from '../config/paginate.config';
import { ResponseData } from "../config/responseData.config";
import { EmployeeModel, EmployeeRole } from "../model/view-model/employee.model";
import { UpdateEmployeeDTO, AssignEmployeeDepartmentDTO, AssignManagerDepartmentDTO, ChangeRoleDTO, CreateEmployeeDTO } from '../model/dtos/employee.dto';
import * as bcrypt from 'bcrypt';
import { ROLE } from "../constant/database.constant";
const prisma = new PrismaClient();

export class EmployeeService {

  public getListEmployee = async (page: Page): Promise<ResponseData<Paging<EmployeeModel[]>>> => {
    const response = new ResponseData<Paging<EmployeeModel[]>>;
    const pageResponse = new Paging<EmployeeModel[]>

    const queryData = await prisma.employee.findMany({
      where: {
        deleted: false,
        role: {
          roleName: {
            not: ROLE.ADMIN
          }
        }
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        description: true,
        role: {
          select: {
            displayName: true,
          }
        },
        department: {
          select: {
            departmentName: true,
            departmentId: true,
          }
        },
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true
          },
        },
      },
      orderBy: {
        createdAt: "desc"
      },
      ...paginate(page)
    })

    const totalElement = await prisma.employee.count({
      where: {
        deleted: false,
        role: {
          roleName: {
            not: ROLE.ADMIN
          }
        }
      },
    })
    pageResponse.data = queryData;
    pageResponse.page = page;
    pageResponse.page.totalElement = totalElement;
    response.result = pageResponse;
    return response;
  }

  public getEmpListInDepartment = async (departmentId: string, page: Page): Promise<ResponseData<Paging<EmployeeModel[]>>> => {
    const response = new ResponseData<Paging<EmployeeModel[]>>;
    const pageResponse = new Paging<EmployeeModel[]>

    const queryData = await prisma.employee.findMany({
      where: {
        departmentId: departmentId,
        deleted: false
      },
      select: {
        id: true,
        fullname: true,
        image: true,
        role: {
          select: {
            displayName: true,
          }
        },
        email: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        description: true,
        department: {
          select: {
            departmentName: true,
          }
        },
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true
          },
        },
      },
      orderBy: {
        createdAt: "desc"
      },
      ...paginate(page)
    })

    const totalElement = await prisma.employee.count({
      where: {
        departmentId: departmentId,
        deleted: false
      },
    })
    pageResponse.data = queryData;
    pageResponse.page = page;
    pageResponse.page.totalElement = totalElement;
    response.result = pageResponse;
    return response;
  }

  public getEmployeeById = async (employeeId: string): Promise<ResponseData<EmployeeModel>> => {
    const response = new ResponseData<EmployeeModel>;
    const queryData = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        deleted: false
      },
      select: {
        id: true,
        fullname: true,
        image: true,
        role: {
          select: {
            displayName: true,
          }
        },
        email: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        description: true,
        department: {
          select: {
            departmentName: true,
          }
        },
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true
          },
        },
      },
    })
    if (queryData) {
      response.result = queryData;
    } else {
      response.message = "Employee isn't exist";
    }
    return response;
  }

  public createEmployee = async (data: CreateEmployeeDTO): Promise<ResponseData<string>> => {
    const response = new ResponseData<string>;
    const findEmployee = await prisma.employee.findUnique({
      where: {
        email: data.email
      }
    })

    if (findEmployee) {
      response.message = `This email ${data.email} already exists`;
      return response;
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const role = await prisma.role.findUnique({
      where: {
        displayName: data.displayName
      }
    })

    const queryOrganizationData = await prisma.organization.findFirst({
      select: {
        yearlyAnnualLeave: true,
      }
    })

    const createEmployeeData = await prisma.employee.create({
      data: {
        fullname: data.fullname,
        annualLeaveDays: queryOrganizationData.yearlyAnnualLeave,
        email: data.email,
        password: hashedPassword,
        role: {
          connect: {
            roleId: role.roleId,
          }
        },
        gender: data?.gender,
        dateOfBirth: data?.dateOfBirth,
        phoneNumber: data?.phoneNumber,
        description: data?.description,
        location: {
          create: {
            address: data?.location?.address ? data.location.address : null,
            city: data?.location?.city ? data.location.city : null,
            country: data.location.country ? data.location.country : null,
            state: data?.location?.state ? data.location.state : null,
          }
        }
      }
    });

    if (createEmployeeData) {
      response.result = "Create employeee successfully"
    } else {
      response.message = "Create employee failed, try again!"
    }
    return response;
  }

  public updateEmployeeDetail = async (employeeId: string, data: UpdateEmployeeDTO): Promise<ResponseData<EmployeeModel>> => {
    const response = new ResponseData<EmployeeModel>;

    const isValidEmployee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        deleted: false,
      }
    })

    if (!isValidEmployee) {
      response.message = `Employee isn't exist`;
      return response;
    }

    const queryData = await prisma.employee.update({
      where: {
        id: employeeId,
      },
      data: {
        fullname: data.fullname,
        email: data.email,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        description: data.description,
        location: {
          upsert: {
            update: {
              address: data.location.address,
              city: data.location.city,
              country: data.location.country,
              state: data.location.state
            },
            create: {
              address: data.location.address,
              city: data.location.city,
              country: data.location.country,
              state: data.location.state
            },
          }
        }
      },
      select: {
        id: true,
        fullname: true,
        image: true,
        email: true,
        role: {
          select: {
            displayName: true,
          }
        },
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        description: true,
        department: {
          select: {
            departmentName: true,
          }
        },
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true
          },
        },
      },
    })

    response.result = queryData;
    return response;
  }

  public assignEmployeeToDepartment = async (data: AssignEmployeeDepartmentDTO): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;

    const isValidDepartment = await prisma.department.findFirst({
      where: {
        departmentId: data.departmentId,
        deleted: false,
      }
    })

    if (!isValidDepartment) {
      response.message = `The department isn't exist`;
      return response;
    }

    const isValidEmployee = await prisma.employee.findFirst({
      where: {
        id: data.employeeId,
        deleted: false,
      }
    })

    if (!isValidEmployee) {
      response.message = `Employee isn't exist`;
      return response;
    }

    const queryData = await prisma.employee.update({
      where: {
        id: data.employeeId,
      },
      data: {
        departmentId: data.departmentId,
      }
    })

    if (queryData) {
      response.result = "Assign Employee to Department successfully";
    } else {
      response.result = "Assign unsuccessfully"
    }
    return response;
  }

  public assignManagerToDepartment = async (data: AssignManagerDepartmentDTO): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;
    const isValidDepartment = await prisma.department.findFirst({
      where: {
        departmentId: data.departmentId,
        deleted: false,
      }
    })
    if (!isValidDepartment) {
      response.message = `The department isn't exist`;
      return response;
    }

    const isValidEmployee = await prisma.employee.findFirst({
      where: {
        id: data.employeeId,
        deleted: false,
      }
    })
    if (!isValidEmployee) {
      response.message = `Employee isn't exist`;
      return response;
    }

    const previousManagerOfDepartment = await prisma.departmentManager.findFirst({
      where: {
        departmentId: data.departmentId,
        managerId: data.employeeId
      }
    });

    //the previous manager is exsit
    if (previousManagerOfDepartment) {
      await prisma.departmentManager.update({
        where: {
          managerId_departmentId: {
            departmentId: data.departmentId,
            managerId: data.employeeId
          }
        },
        data: {
          deleted: false,
          deletedAt: new Date(new Date().toISOString())
        }
      });
    }

    await prisma.departmentManager.create({
      data: {
        managerId: data.employeeId,
        departmentId: data.departmentId,
      }
    })

    await prisma.employee.update({
      where: {
        id: data.employeeId,
      },
      data: {
        departmentId: data.departmentId,
      }
    })

    response.result = "Assign Manager to Department successfully";
    return response;
  }

  public changeRoleOfEmployee = async (data: ChangeRoleDTO): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;
    const isValidEmployee = await prisma.employee.findFirst({
      where: {
        id: data.employeeId,
        deleted: false,
      }
    })

    if (!isValidEmployee) {
      response.message = `Employee isn't exist`;
      return response;
    }

    const role = await prisma.role.findFirst({
      where: {
        displayName: {
          equals: data.displayName,
          not: "Admin"
        },
      }
    })

    if (!role) {
      response.message = `Role isn't exist`;
      return response;
    }

    await prisma.employee.update({
      where: {
        id: data.employeeId,
      },
      data: {
        roleId: role.roleId,
      }
    })

    response.result = "Change Employee Role successfully";
    return response;
  }

  public getListRoleOfEmployee = async (): Promise<ResponseData<EmployeeRole[]>> => {
    const response = new ResponseData<EmployeeRole[]>;
    const queryData = await prisma.role.findMany({
      where: {
        displayName: {
          not: ROLE.ADMIN
        },
        deleted: false
      },
      select: {
        roleId: true,
        roleName: true,
        displayName: true,
      },
    })
    response.result = queryData;
    return response;
  }
}