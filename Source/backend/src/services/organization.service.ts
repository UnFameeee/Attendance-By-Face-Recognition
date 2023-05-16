import { ResponseData } from "../config/responseData.config";
import { prisma } from "../database/prisma.singleton";
import { CreateOrganizationDTO, UpdateOrganizationDTO } from "../model/dtos/organization.dto";
import { OrganizationListModel, OrganizationModel } from "../model/view-model/organization.model";

export class OrganizationService {
  public getOrganizationDetail = async (): Promise<ResponseData<OrganizationModel>> => {
    const response = new ResponseData<OrganizationModel>;
    const queryData = await prisma.organization.findFirst({
      where: {
        deleted: false
      },
      select: {
        organizationId: true,
        organizationName: true,
        limitEarlyLeave: true,
        limitLateArrival: true,
        yearlyAnnualLeave: true,
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

  public getOrganizationList = async (): Promise<ResponseData<OrganizationListModel[]>> => {
    const response = new ResponseData<OrganizationListModel[]>;
    const queryData = await prisma.organization.findMany({
      where: {
        deleted: false
      },
      select: {
        organizationId: true,
        organizationName: true,
        limitEarlyLeave: true,
        limitLateArrival: true,
        yearlyAnnualLeave: true,
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
        limitEarlyLeave: data.limitEarlyLeave,
        limitLateArrival: data.limitLateArrival,
        yearlyAnnualLeave: data.yearlyAnnualLeave,
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

  public updateOrganizationDetail = async (organizationId: string, data: UpdateOrganizationDTO): Promise<ResponseData<OrganizationModel>> => {
    const response = new ResponseData<OrganizationModel>;

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
        limitEarlyLeave: data.limitEarlyLeave,
        limitLateArrival: data.limitLateArrival,
        yearlyAnnualLeave: data.yearlyAnnualLeave,
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
        limitEarlyLeave: true,
        limitLateArrival: true,
        yearlyAnnualLeave: true,
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