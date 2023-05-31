// Import the 'crypto' module for encryption and decryption
import CryptoJS from 'crypto-js';
import moment from "moment";
import { env } from '../config/env.config';

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

  const formatDate = moment.utc(date, 'YYYY-MM-DD').format("YYYY-MM-DD");
  if (date) {
    const temp = new Date(`${formatDate}T00:00:00.000Z`);
    temp.setHours(parseInt(timeSplitArr[0], 10));
    temp.setMinutes(parseInt(timeSplitArr[1], 10));
    const record = new Date(temp).toISOString();
    result = new Date(record);
  } else {
    //Fix the date to 1970-01-01, we only use the time. The time seperate from the date by T
    // const temp = new Date(`1970-01-01T00:00:00.000Z`);
    // temp.setHours(parseInt(timeSplitArr[0], 10));
    // temp.setMinutes(parseInt(timeSplitArr[1], 10));
    const temp = new Date();

    temp.setDate(1);
    temp.setMonth(0);
    temp.setFullYear(1970);
    temp.setHours(parseInt(timeSplitArr[0], 10));
    temp.setMinutes(parseInt(timeSplitArr[1], 10));

    const record = new Date(temp).toISOString();
    result = new Date(record);
  }
  return result
}

const MinusDate = (bigDate: Date, smallDate: Date, format?: boolean) => {
  const millisecondDif = moment.utc(new Date(bigDate.getTime()), "HH:mm").diff(moment.utc(new Date(smallDate.getTime()), "HH:mm"));
  if (format) {
    return moment.utc(millisecondDif).format('HH:mm');
  } else {
    return moment.utc(millisecondDif);
  }
};

const PlusDate = (firstDate: Date, secondDate: Date, format?: boolean) => {
  // Parse the time values into moment objects
  const momentTime1 = moment.utc(firstDate, 'HH:mm');
  const momentTime2 = moment.utc(secondDate, 'HH:mm');

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

function CountDaysFromStartDate(startDate: string, endDate: string) {
  // Convert the date strings to Date objects
  var start = new Date(startDate);
  var end = new Date(endDate);

  // Set the time for both dates to midnight
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  // Calculate the time difference in milliseconds
  var timeDiff = Math.abs(end.getTime() - start.getTime());

  // Convert the time difference from milliseconds to days
  var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDiff + 1; // Add 1 to include the start date
}


// Function to encode a message using Cipher
const EncodeWithCipher = (message: string) => {
  var encodedData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(message));
  return encodedData;
}

// Function to decode a message using Cipher
const DecodeWithCipher = (encodedMessage: string) => {
  var decodedData = CryptoJS.enc.Base64.parse(encodedMessage).toString(CryptoJS.enc.Utf8);
  return decodedData;
}

interface IHelper {
  UppercaseFirstLetter: Function,
  ConvertDoubleSlashURL: Function,
  ConfigStaticDateTime: Function,
  MinusDate: Function,
  PlusDate: Function,
  CountDaysFromStartDate: Function,
  EncodeWithCipher: Function,
  DecodeWithCipher: Function,
}

export const Helper: IHelper = {
  UppercaseFirstLetter,
  ConvertDoubleSlashURL,
  ConfigStaticDateTime,
  MinusDate,
  PlusDate,
  CountDaysFromStartDate,
  EncodeWithCipher,
  DecodeWithCipher,
}