import { v4 } from "uuid";
import { env } from "../config/env.config";
import { ResponseData } from "../config/responseData.config";
import { prisma } from "../database/prisma.singleton";
import moment from "moment";

export class URLService {
  public generateURL = async (URLtype: string) => {
    const response = new ResponseData<string>();
    // Get the current date and time
    let datetime = new Date();
    // Add 30 minutes to the current time
    datetime.setMinutes(datetime.getMinutes() + 5);
    let URL: string;

    if (URLtype == "AttendanceException") {
      URL = `${env.CLIENT_URL}/report-attendance-exception?session=${v4()}`
    }

    const queryData = await prisma.urlmanagement.create({
      data: {
        URL: URL,
        expiredTime: datetime,
        isExpired: false,
      }
    })
    if (!queryData) {
      response.message = "Server Error";
      return response;
    }
    response.result = URL;
    return response;
  }

  public validateURL = async (URL: string) => {
    const response = new ResponseData<boolean>();
    const now = new Date();
    const queryData = await prisma.urlmanagement.findUnique({
      where: {
        URL: URL,
      }
    })

    if (!queryData) {
      response.result = false;
      return response;
    } else {
      //Expire by submiting
      if (queryData.isExpired) {
        response.result = false;
        return response;
      }

      //Expire by not submiting for too long
      if (moment(new Date(queryData.expiredTime.getTime()), "HH:mm:ss").diff(moment(new Date(now.getTime()), "HH:mm:ss")) < 0) {
        response.result = false;
        return response;
      }

      response.result = true;
      return response;
    }
  }

  public changeURLtoExpire = async (URL: string) => {
    const response = new ResponseData<boolean>();
    const queryData = await prisma.urlmanagement.findUnique({
      where: {
        URL: URL,
      }
    })
    if (!queryData) {
      response.message = "URL not exist";
      return response;
    }
    const queryUpdateData = await prisma.urlmanagement.update({
      where: {
        URL: URL,
      },
      data: {
        isExpired: true,
      }
    })

    if (!queryUpdateData) {
      response.message = "Server Error";
      return response;
    }
    response.result = true;
    return response;
  }
}