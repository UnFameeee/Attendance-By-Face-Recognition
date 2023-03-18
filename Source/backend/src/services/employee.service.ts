import { PrismaClient } from "@prisma/client";
import { Page, Paging, paginate } from '../config/paginate.config';
import { ResponseData } from "../config/responseData.config";
import { EmployeeModel } from "../model/view-model/employee.model";
import { UpdateEmployeeDTO, AssignEmployeeDepartmentDTO, AssignManagerDepartmentDTO, ChangeRoleDTO } from '../model/dtos/employee.dto';
const prisma = new PrismaClient();

export class EmployeeService {

  public getListEmployee = async (page: Page): Promise<ResponseData<Paging<EmployeeModel[]>>> => {
    const response = new ResponseData<Paging<EmployeeModel[]>>;
    const pageResponse = new Paging<EmployeeModel[]>

    const queryData = await prisma.employee.findMany({
      where: {
        deleted: false
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        joiningDate: true,
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
        deleted: false
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
        email: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        joiningDate: true,
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
        email: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        joiningDate: true,
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
        email: true,
        gender: true,
        dateOfBirth: true,
        phoneNumber: true,
        joiningDate: true,
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
}