import { Page, Paging, paginate } from "../config/paginate.config";
import { ResponseData } from "../config/responseData.config";
import { prisma } from "../database/prisma.singleton";
import { DropdownLeavetypeModel, LeavetypeModel } from "../model/view-model/leavetype.model";
import { ModifyLeavetypeDTO } from "../model/dtos/leavetype.dto";

export class LeavetypeService {
  public getAllLeaveType = async (page: Page): Promise<ResponseData<Paging<LeavetypeModel[]>>> => {
    const response = new ResponseData<Paging<LeavetypeModel[]>>;
    const pageResponse = new Paging<LeavetypeModel[]>;

    const queryData = await prisma.leaveType.findMany({
      where: {
        deleted: false,
      },
      select: {
        leaveTypeId: true,
        name: true,
        annualLeave: true,
      },
      orderBy: {
        createdAt: "desc"
      },
      ...paginate(page)
    });

    const totalElement = await prisma.leaveType.count({
      where: {
        deleted: false
      },
    });

    pageResponse.data = queryData;
    pageResponse.page = page;
    pageResponse.page.totalElement = totalElement;
    response.result = pageResponse;
    return response;
  };

  public getListLeaveType = async (): Promise<ResponseData<DropdownLeavetypeModel[]>> => {
    const response = new ResponseData<DropdownLeavetypeModel[]>;

    const queryData = await prisma.leaveType.findMany({
      where: {
        deleted: false,
      },
      select: {
        leaveTypeId: true,
        name: true,
        annualLeave: true,
      }
    })

    response.result = queryData;
    return response;
  }

  public modifyLeaveType = async (data: ModifyLeavetypeDTO): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;

    if (!data.leaveTypeId) {
      const queryData = await prisma.leaveType.create({
        data: {
          name: data.name,
          annualLeave: data.annualLeave,
        }
      })
    } else {
      const queryCheckShiftType = await prisma.leaveType.findFirst({
        where: {
          leaveTypeId: data.leaveTypeId,
          deleted: false
        }
      })
      if (!queryCheckShiftType) {
        response.message = "Leave Type not exist, please try again";
        return response;
      }

      const queryData = await prisma.leaveType.update({
        data: {
          name: data.name,
          annualLeave: data.annualLeave, 
        },
        where: {
          leaveTypeId: data.leaveTypeId,
        }
      })
    }
    response.result = "Modify leavetype successfully";
    return response;
  }

  public deleteLeaveType = async (leaveTypeId: string): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;

    const queryData = await prisma.leaveType.update({
      data: {
        deleted: true,
      },
      where: {
        leaveTypeId: leaveTypeId,
      }
    })
    
    if (queryData) {
      response.result = "Delete leavetype successfully";
    } else {
      response.message = "Delete leavetype error";
    }
    return response;
  }
}