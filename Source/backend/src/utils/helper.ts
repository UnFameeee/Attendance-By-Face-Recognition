import moment from "moment";

const UppercaseFirstLetter = (prop: string): string => {
  return prop.charAt(0).toUpperCase() + prop.slice(1);
}

const ConvertDoubleSlashURL = (url: string): string => {
  //replace "\\" to "/"
  return url.replace(/\\/g, "/");
}

const ConfigStaticDateTime = (time: string, date?: string): Date => {
  let result: Date;
  const formatDate = moment(date, 'YYYY-MM-DD').format("YYYY-MM-DD");
  if (date) {
    result = new Date(`${formatDate}T${time}:00.000Z`);
  } else {
    //Fix the date to 1970-01-01, we only use the time. The time seperate from the date by T
    result = new Date(`1970-01-01T${time}:00.000Z`);
  }
  return result
}

const GetTimeFromDate = (time: Date): string => {
  let result: string;
  const stringDate = time.toString();
  console.log(stringDate);
  result = (stringDate.split("T")[1]).substring(0, 5); 
  return result;
}

interface IHelper {
  UppercaseFirstLetter: Function,
  ConvertDoubleSlashURL: Function,
  ConfigStaticDateTime: Function,
  GetTimeFromDate: Function,
}

export const Helper: IHelper = {
  UppercaseFirstLetter,
  ConvertDoubleSlashURL,
  ConfigStaticDateTime,
  GetTimeFromDate
}