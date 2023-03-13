import { prisma } from "../database/prisma.singleton"
import { DepartmentWithLocation } from "../model/view-model/department.model";
import { CreateDepartmentDTO, UpdateDepartmentDTO } from '../model/dtos/department.dto';
import { ResponseData } from "../config/responseData.config";
import { Page, Paging, paginate } from '../config/paginate.config';

export class DepartmentService {
  public getAllDepartment = async (page: Page): Promise<ResponseData<Paging<DepartmentWithLocation[]>>> => {
    const response = new ResponseData<Paging<DepartmentWithLocation[]>>;
    const pageResponse = new Paging<DepartmentWithLocation[]>

    const queryData = await prisma.department.findMany({
      where: {
        deleted: false
      },
      select: {
        departmentId: true,
        departmentName: true,
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true
          },
        },
        organization: {
          select: {
            organizationId: true,
            organizationName: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      ...paginate(page)
    })
    
    const totalElement = await prisma.department.count({
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


  public getDepartmentById = async (departmentId: string): Promise<ResponseData<DepartmentWithLocation>> => {
    const response = new ResponseData<DepartmentWithLocation>;
    const queryData = await prisma.department.findFirst({
      where: {
        departmentId: departmentId,
        deleted: false
      },
      select: {
        departmentId: true,
        departmentName: true,
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true
          },
        },
        organization: {
          select: {
            organizationId: true,
            organizationName: true,
          }
        }
      }
    })

    if(queryData){
      response.result = queryData
    } else {
      response.message = "The department isn't exist";
    }
    return response;
  }

  public createDepartment = async (data: CreateDepartmentDTO): Promise<ResponseData<Boolean>> => {
    const response = new ResponseData<Boolean>;
    const queryData = await prisma.department.create({
      data: {
        departmentName: data.departmentName,
        organization: {
          connect: { organizationId: data.organization.organizationId }
        },
        location: {
          create: {
            address: data.location.address,
            city: data.location.city,
            country: data.location.country,
            state: data.location.state
          },
        }
      }
    })
    response.result = queryData ? true : false;
    return response;
  }

  public updateDepartmentDetail = async (departmentId: string, data: UpdateDepartmentDTO): Promise<ResponseData<DepartmentWithLocation>> => {
    const response = new ResponseData<DepartmentWithLocation>;

    const isValidDepartment = await prisma.department.findFirst({
      where: {
        departmentId: departmentId,
        deleted: false,
      }
    })

    if (!isValidDepartment) {
      response.message = `The department isn't exist`;
      return response;
    }

    const queryData = await prisma.department.update({
      where: {
        departmentId: departmentId,
      },
      data: {
        departmentName: data.departmentName,
        organization: {
          connect: { organizationId: data.organization.organizationId }
        },
        location: {
          update: {
            address: data.location.address,
            city: data.location.city,
            country: data.location.country,
            state: data.location.state
          },
        }
      },
      select: {
        departmentId: true,
        departmentName: true,
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true
          },
        },
        organization: {
          select: {
            organizationId: true,
            organizationName: true,
          }
        }
      }
    })

    response.result = queryData;
    return response;
  }

  public deleteDepartment = async (departmentId: string): Promise<ResponseData<Boolean>> => {
    const response = new ResponseData<Boolean>;

    const isValidDepartment = await prisma.department.findFirst({
      where: {
        departmentId: departmentId,
        deleted: false,
      }
    })

    if (!isValidDepartment) {
      response.message = `The department isn't exist`;
      return response;
    }

    const queryData = await prisma.department.update({
      where: {
        departmentId: departmentId,
      },
      data: {
        deleted: true,
        deletedAt: new Date(new Date().toISOString()),
        location: {
          update: {
            deleted: true,
            deletedAt: new Date(new Date().toISOString()),
          },
        }
      }
    })

    if (queryData) {
      response.result = true;
    } else {
      response.message = "Server Error - Delete unsuccessfully";
    }
    return response;
  }

  public deleteDepartments = async (departmentIds: string[]): Promise<ResponseData<Boolean>> => {
    const response = new ResponseData<Boolean>;

    const isValidDepartments = await prisma.department.count({
      where: {
        departmentId: {
          in: departmentIds
        },
        deleted: false,
      }, 
    })

    if (isValidDepartments != departmentIds.length) {
      response.message = `At least 1 of the department isn't exist`;
      return response;
    }
    for(const departmentId of departmentIds){
      await prisma.department.update({
        where: {
          departmentId: departmentId
        },
        data: {
          deleted: true,
          deletedAt: new Date(new Date().toISOString()),
          location: {
            update: {
              deleted: true,
              deletedAt: new Date(new Date().toISOString()),
            },
          }
        },
        
      })
    }

    const checkDeleted = await prisma.department.count({
      where: {
        departmentId: {
          in: departmentIds
        },
        deleted: false,
      }, 
    })

    if (checkDeleted == 0) {
      response.result = true;
    } else {
      response.message = "Server Error - delete unsuccessfully";
    }
    return response;
  }
}