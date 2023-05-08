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

const MinusDate = (bigDate: Date, smallDate: Date, format?: boolean) => {
  const millisecondDif = moment(new Date(bigDate.getTime()), "HH:mm").diff(moment(new Date(smallDate.getTime()), "HH:mm"));
  if (format) {
    return moment.utc(millisecondDif).format('HH:mm');
  } else {
    return moment.utc(millisecondDif);
  }
};

const PlusDate = (firstDate: Date, secondDate: Date, format?: boolean) => {
  // Parse the time values into moment objects
  const momentTime1 = moment(firstDate, 'HH:mm');
  const momentTime2 = moment(secondDate, 'HH:mm');

  // Calculate the total duration by adding the durations of both times
  const duration1 = moment.duration(momentTime1.format('HH:mm'));
  const duration2 = moment.duration(momentTime2.format('HH:mm'));
  const totalDuration = duration1.add(duration2);

  if (format) {
    return moment.utc(totalDuration.asMilliseconds()).format('HH:mm');
  } else {
    return moment.utc(totalDuration.asMilliseconds());
  }
};

interface IHelper {
  UppercaseFirstLetter: Function,
  ConvertDoubleSlashURL: Function,
  ConfigStaticDateTime: Function,
  MinusDate: Function,
  PlusDate: Function,
}

export const Helper: IHelper = {
  UppercaseFirstLetter,
  ConvertDoubleSlashURL,
  ConfigStaticDateTime,
  MinusDate,
  PlusDate,
}