import { ResponseData } from "../config/responseData.config";
import { prisma } from "../database/prisma.singleton";
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "../model/dtos/organization.dto";
import { OrganizationList, OrganizationWithLocation } from "../model/view-model/organization.model";

export class OrganizationService {
  public getOrganizationDetail = async (): Promise<ResponseData<OrganizationWithLocation>> => {
    const response = new ResponseData<OrganizationWithLocation>;
    const queryData = await prisma.organization.findFirst({
      where: {
        deleted: false
      },
      select: {
        organizationId: true,
        organizationName: true,
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true
          },
        },
      }
    })

    if (queryData) {
      response.result = queryData
    } else {
      response.message = "The Organization isn't exist";
    }
    return response;
  }

  public getOrganizationList = async (): Promise<ResponseData<OrganizationList[]>> => {
    const response = new ResponseData<OrganizationList[]>;
    const queryData = await prisma.organization.findMany({
      where: {
        deleted: false
      },
      select: {
        organizationId: true,
        organizationName: true,
      }
    })

    if (queryData) {
      response.result = queryData
    }
    
    return response;
  }

  public createOrganization = async (data: CreateOrganizationDTO): Promise<ResponseData<Boolean>> => {
    const response = new ResponseData<Boolean>;
    const queryData = await prisma.organization.create({
      data: {
        organizationName: data.organizationName,
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

  public updateOrganizationDetail = async (organizationId: string, data: UpdateOrganizationDTO): Promise<ResponseData<OrganizationWithLocation>> => {
    const response = new ResponseData<OrganizationWithLocation>;

    const isValidOrganization = await prisma.organization.findFirst({
      where: {
        organizationId: organizationId,
        deleted: false,
      }
    })

    if (!isValidOrganization) {
      response.message = `The organization isn't exist`;
      return response;
    }

    const queryData = await prisma.organization.update({
      where: {
        organizationId: organizationId,
      },
      data: {
        organizationName: data.organizationName,
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
        organizationId: true,
        organizationName: true,
        location: {
          select: {
            address: true,
            city: true,
            country: true,
            state: true
          },
        },
      }
    })

    response.result = queryData;
    return response;
  }
}