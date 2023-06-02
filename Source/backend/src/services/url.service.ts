import { v4 } from "uuid";
import { env } from "../config/env.config";
import { ResponseData } from "../config/responseData.config";
import { prisma } from "../database/prisma.singleton";
import moment from "moment";
import { Helper } from "../utils/helper";
import { timezoneConfig } from "../constant/moment-timezone.constant";

export class URLService {
  public generateURL = async (URLtype: string, employeeId: string, urlImage: string) => {
    const response = new ResponseData<string>();

    const momentNow = moment(new Date()).tz(timezoneConfig);
    let threshHoldNow = Helper.ConfigStaticDateTime(momentNow.format("HH:mm"), momentNow.format("YYYY-MM-DD"));

    let baseStartTime = moment.utc(momentNow.format("HH:mm"), 'HH:mm');
    let baseThreshold = moment.utc("00:30", 'HH:mm');
    let resultHour = moment.utc(baseStartTime.clone().add(baseThreshold.hour(), 'hours').add(baseThreshold.minute(), 'minutes')).format("HH:mm");

    let thresholdLimit = Helper.ConfigStaticDateTime(resultHour, momentNow.format("YYYY-MM-DD"));

    let URL: string;

    if (URLtype == "AttendanceException") {
      URL = `${env.CLIENT_URL}/report-attendance-exception?token=${Helper.EncodeWithCipher(urlImage)}&session=${v4()}`
    } else if (URLtype == "TrainingFace") {
      URL = `${env.CLIENT_URL}/training-face?id=${Helper.EncodeWithCipher(employeeId)}&session=${v4()}`;
    }

    const queryData = await prisma.urlmanagement.create({
      data: {
        URL: URL,
        expiredTime: thresholdLimit,
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
    const queryData = await prisma.urlmanagement.findFirst({
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

      const momentNow = moment(new Date()).tz(timezoneConfig);
      let threshHoldNow = Helper.ConfigStaticDateTime(momentNow.format("HH:mm"), momentNow.format("YYYY-MM-DD"))

      //Expire by not submiting for too long
      if (moment(new Date(queryData.expiredTime.getTime()), "HH:mm:ss").diff(moment(new Date(threshHoldNow.getTime()), "HH:mm:ss")) < 0) {
        response.result = false;
        return response;
      }

      response.result = true;
      return response;
    }
  }

  public changeURLtoExpire = async (URL: string) => {
    const response = new ResponseData<boolean>();
    const queryData = await prisma.urlmanagement.findFirst({
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
        urlId: queryData.urlId,
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