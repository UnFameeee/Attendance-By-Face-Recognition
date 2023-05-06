import moment from 'moment';
import { Page, Paging, paginate } from '../config/paginate.config';
import { ResponseData } from "../config/responseData.config";
import { prisma } from "../database/prisma.singleton";
import { ModifyShifttypeDTO } from '../model/dtos/shifttype.dto';
import { DropdownShifttypeModel, ShifttypeModel } from '../model/view-model/shifttype.model';
import { Helper } from '../utils/helper';

export class ShifttypeService {
  public getAllShiftType = async (page: Page): Promise<ResponseData<Paging<ShifttypeModel[]>>> => {
    const response = new ResponseData<Paging<ShifttypeModel[]>>;
    const pageResponse = new Paging<ShifttypeModel[]>;

    const queryData = await prisma.shiftType.findMany({
      where: {
        deleted: false,
      },
      select: {
        shiftTypeId: true,
        shiftName: true,
        startTime: true,
        endTime: true,
      },
      orderBy: {
        createdAt: "desc"
      },
      ...paginate(page)
    })

    const totalElement = await prisma.shiftType.count({
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

  public getListShiftType = async (): Promise<ResponseData<DropdownShifttypeModel[]>> => {
    const response = new ResponseData<DropdownShifttypeModel[]>;

    const queryData = await prisma.shiftType.findMany({
      where: {
        deleted: false,
      },
      select: {
        shiftTypeId: true,
        shiftName: true,
      }
    })

    response.result = queryData;
    return response;
  }

  public modifyShiftType = async (data: ModifyShifttypeDTO): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;

    if (Math.sign(moment(Helper.ConfigStaticDateTime(data.endTime)).diff(Helper.ConfigStaticDateTime(data.startTime))) === -1) {
      response.message = "The EndTime must be after the StartTime";
      return response;
    };

    if (!data.shiftTypeId) {
      const queryData = await prisma.shiftType.create({
        data: {
          shiftName: data.shiftName,
          startTime: Helper.ConfigStaticDateTime(data.startTime),
          endTime: Helper.ConfigStaticDateTime(data.endTime),
        }
      })
    } else {
      const queryCheckShiftType = await prisma.shiftType.findFirst({
        where: {
          shiftTypeId: data.shiftTypeId,
          deleted: false
        }
      })
      if (!queryCheckShiftType) {
        response.message = "Shift Type not exist, please try again";
        return response;
      }

      const queryData = await prisma.shiftType.update({
        data: {
          shiftName: data.shiftName,
          startTime: Helper.ConfigStaticDateTime(data.startTime),
          endTime: Helper.ConfigStaticDateTime(data.endTime),
        },
        where: {
          shiftTypeId: data.shiftTypeId,
        }
      })
    }
    response.result = "Modify shifttype successfully";
    return response;
  }

  public deleteShiftType = async (shiftTypeId: string): Promise<ResponseData<String>> => {
    const response = new ResponseData<String>;

    const queryData = await prisma.shiftType.update({
      data: {
        deleted: true,
      },
      where: {
        shiftTypeId: shiftTypeId,
      }
    })
    if (queryData) {
      response.result = "Delete shifttype successfully";
    } else {
      response.message = "Delete shifttype error";
    }
    return response;
  }
}