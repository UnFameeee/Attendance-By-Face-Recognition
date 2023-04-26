import { env } from "../config/env.config";
import { ResponseData } from "../config/responseData.config"
import { attendance, attendanceExceptionStatus } from "../constant/attendance-exception.constant";
import { prisma } from "../database/prisma.singleton";
import { SubmitAttendanceExceptionDTO } from "../model/dtos/attendance-exception.dto";
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
        department: data.department,
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

    const query

    //If there isn't any image in the database 
    const queryData = await prisma.employeeImage.create({
      data: {
        employeeId: employeeId,
        link: Helper.ConvertDoubleSlashURL(link),
      },
    })

    response.result = Helper.ConvertDoubleSlashURL(link);
    return response;
  }
}