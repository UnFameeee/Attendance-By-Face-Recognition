import moment from "moment";

const UppercaseFirstLetter = (prop: string): string => {
  return prop.charAt(0).toUpperCase() + prop.slice(1);
}

const ConvertDoubleSlashURL = (url: string): string => {
  //replace "\\" to "/"
  return url.replace(/\\/g, "/");
}

const ConfigStaticDateTime = (time: string, date?: string): Date => {
  //time -> "HH:mm"
  //date -> "YYYY-MM-DD"
  let result: Date;
  const timeSplitArr = time.split(":");

  const formatDate = moment(date, 'YYYY-MM-DD').format("YYYY-MM-DD");
  if (date) {
    const temp = new Date(`${formatDate}T00:00:00.000Z`);
    temp.setHours(parseInt(timeSplitArr[0], 10));
    temp.setMinutes(parseInt(timeSplitArr[1], 10));
    result = temp;
  } else {
    //Fix the date to 1970-01-01, we only use the time. The time seperate from the date by T
    const temp = new Date(`1970-01-01T00:00:00.000Z`);
    temp.setHours(parseInt(timeSplitArr[0], 10));
    temp.setMinutes(parseInt(timeSplitArr[1], 10));
    result = temp;
  }
  return result
}

interface IHelper {
  UppercaseFirstLetter: Function,
  ConvertDoubleSlashURL: Function,
  ConfigStaticDateTime: Function,
}

export const Helper: IHelper = {
  UppercaseFirstLetter,
  ConvertDoubleSlashURL,
  ConfigStaticDateTime,
}