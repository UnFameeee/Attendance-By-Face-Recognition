import { env } from "../config/env.config";
import { Page, Paging } from "../config/paginate.config";
import { ResponseData } from "../config/responseData.config"
import { attendance, attendanceExceptionStatus } from "../constant/attendance-exception.constant";
import { ROLE } from "../constant/database.constant";
import { prisma } from "../database/prisma.singleton";
import { GetAttendanceExceptionDataDTO, SubmitAttendanceExceptionDTO } from "../model/dtos/attendance-exception.dto";
import { Helper } from "../utils/helper";

export class AttendanceExceptionService {
  public submitAttendanceException = async (data: SubmitAttendanceExceptionDTO) => {
    const response = new ResponseData<string>();
    //Validate Email - if the email wasn't right, go to the image and remove it.
    const validateEmail = await prisma.employee.findFirst({
      where: {
        email: data.email,
        deleted: false,
      }
    })
    if (!validateEmail) {
      //delete the image
      response.message = "Email isn't exist, please check again!";
      return response;
    }

    let attendanceType: string;
    if (data.attendanceType == "CHECKIN") {
      attendanceType = attendance.checkin;
    } else if (data.attendanceType == "CHECKOUT") {
      attendanceType = attendance.checkout;
    }
    const queryData = await prisma.attendanceException.create({
      data: {
        name: data.name,
        departmentId: data.departmentId,
        email: data.email,
        image: data.image,
        attendanceType: attendanceType,
        datetime: new Date(),
        status: attendanceExceptionStatus.waiting,
      }
    })
    if (!queryData) {
      response.message = "Server Error";
      return response;
    }
    response.result = "Attendance submits successfully!";
    return response;
  }


  public saveImage = async (email: string, files: { [fieldname: string]: Express.Multer.File[] }) => {
    const response = new ResponseData<any>;
    let link = `${env.SERVER_URL}/public${(files.images[0].destination).split("public")[1]}/${files.images[0].filename}`

    const queryValidateData = await prisma.employee.findFirst({
      where: {
        email: email,
        deleted: false,
      }
    })

    if (!queryValidateData) {
      response.message = "The email isn't exist";
      return response;
    }

    //If there isn't any image in the database 
    const queryData = await prisma.employeeImage.create({
      data: {
        employeeId: queryValidateData.id,
        link: Helper.ConvertDoubleSlashURL(link),
      },
    })

    response.result = Helper.ConvertDoubleSlashURL(link);
    return response;
  }

  public getListAttendanceException = async (page: Page): Promise<ResponseData<Paging<any[]>>> => {
    //Chia theo checkin / checkout
    //Chia theo role, nếu role là manager thì coi dc trong phòng ban của mình, admin thì coi được tất cả
    //Filter theo ngày/tháng/năm trên param
    //ApproverId -> Approver Name

    const response = new ResponseData<Paging<any[]>>;
    const pageResponse = new Paging<any[]>
    const data: GetAttendanceExceptionDataDTO = page.extendData;

    let attendanceType: string;
    if (data.attendanceType == "CHECKIN") {
      attendanceType = attendance.checkin;
    } else if (data.attendanceType == "CHECKOUT") {
      attendanceType = attendance.checkout;
    }

    let queryData: any;
    let totalElement: number;

    //Nếu Role là Admin -> lấy hết data
    if (data.roleName == ROLE.ADMIN) {
      queryData = await prisma.attendanceException.findMany({
        where: {
          attendanceType: attendanceType,
          departmentId: data.departmentId,
        },
        select: {
          attendanceExceptionId: true,
          name: true,
          department: {
            select: {
              departmentName: true,
            }
          },
          datetime: true,
          approver: {
            select: {
              fullname: true,
            }
          },
          status: true,
        }
      })

      totalElement = await prisma.attendanceException.count({
        where: {
          attendanceType: attendanceType,
          departmentId: data.departmentId,
        },
      })
    } else if (data.roleName == ROLE.MANAGER) {
      queryData = await prisma.attendanceException.findMany({
        where: {
          attendanceType: attendanceType,
        },
        select: {
          attendanceExceptionId: true,
          name: true,
          department: {
            select: {
              departmentName: true,
            }
          },
          datetime: true,
          approver: {
            select: {
              fullname: true,
            }
          },
          status: true,
        }
      })
      totalElement = await prisma.attendanceException.count({
        where: {
          attendanceType: attendanceType,
        },
      })
    }
    return;
  }

  public getAttendanceExceptionData = async (attendanceExceptionId: string) => {
    //Lấy data ở cả 2 bên là system và employee nhập vào

  }

  public verifyAttendanceException = async (attendanceExceptionId: string, status: string) => {
    //nhận đầu vào là reject hoặc là approve
    //Update approver
  }
}