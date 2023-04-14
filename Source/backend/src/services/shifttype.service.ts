import { Page, Paging, paginate } from '../config/paginate.config';
import { ResponseData } from "../config/responseData.config";
import { prisma } from "../database/prisma.singleton";
import { ModifyShifttypeDTO } from '../model/dtos/shifttype.dto';
import { DropdownShifttypeModel, ShifttypeModel } from '../model/view-model/shifttype.model';

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
    if (data.shiftTypeId) {
      const queryData = await prisma.shiftType.create({
        data: {
          shiftName: data.shiftName,
          startTime: data.startTime,
          endTime: data.endTime,
        }
      })
    } else {
      // check valid shiftTypeId ?

      const queryData = await prisma.shiftType.update({
        data: {
          shiftName: data.shiftName,
          startTime: data.startTime,
          endTime: data.endTime,
        },
        where: {
          shiftTypeId: data.shiftTypeId,
        }
      })
    }
    response.result = "Modify shifttype sucessfully";
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
      response.result = "Delete shifttype sucessfully";
    } else {
      response.message = "Delete shifttype error";
    }
    return response;
  }

  // public createShiftType = async() {

  // }
}