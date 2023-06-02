// Import the 'crypto' module for encryption and decryption
import CryptoJS from 'crypto-js';
import moment from 'moment-timezone';

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
  var formatTime = moment(time, "HH:mm");

  if (date) {
    const dataArr = date.split("-");
    const formatDate = new Date();
    formatDate.setUTCDate(Number.parseInt(dataArr[2]));
    formatDate.setUTCMonth(Number.parseInt(dataArr[1]) - 1);
    formatDate.setUTCFullYear(Number.parseInt(dataArr[0]));
    formatDate.setUTCHours(formatTime.hours())
    formatDate.setUTCMinutes(formatTime.minutes())
    result = formatDate;
  } else {
    //Fix the date to 1970-01-01, we only use the time. The time seperate from the date by T
    const formatDate = new Date("1970-01-01");
    formatDate.setUTCHours(formatTime.hours())
    formatDate.setUTCMinutes(formatTime.minutes())
    result = formatDate;
  }
  return result
}

const MinusDate = (bigDate: Date, smallDate: Date): string => {
  const millisecondDif = moment.utc(new Date(bigDate.getTime()), "HH:mm").diff(moment.utc(new Date(smallDate.getTime()), "HH:mm"));

  let formattedTimeDiff = new Date(millisecondDif).toISOString().split("T")[1].slice(0, 5);

  return formattedTimeDiff;
};

// const PlusDate = (firstDate: Date, secondDate: Date): string => {
//   // Parse the time values into moment objects
//   const momentTime1 = moment.utc(firstDate, 'HH:mm');
//   const momentTime2 = moment.utc(secondDate, 'HH:mm');

//   // Calculate the total duration by adding the durations of both times
//   const duration1 = moment.duration(momentTime1.format('HH:mm'));
//   const duration2 = moment.duration(momentTime2.format('HH:mm'));
//   const totalDuration = duration1.add(duration2);

//   let formattedTimeDiff = new Date(totalDuration).toISOString().split("T")[1].slice(0, 5);

//   if (format) {
//     return moment.tz(moment(totalDuration.asMilliseconds(), "HH:mm").format("HH:mm"), "HH:mm", timezoneConfig).format('HH:mm');
//   } else {
//     return moment.tz(moment(totalDuration.asMilliseconds(), "HH:mm").format("HH:mm"), "HH:mm", timezoneConfig);
//   }
// };

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
  // PlusDate: Function,
  CountDaysFromStartDate: Function,
  EncodeWithCipher: Function,
  DecodeWithCipher: Function,
}

export const Helper: IHelper = {
  UppercaseFirstLetter,
  ConvertDoubleSlashURL,
  ConfigStaticDateTime,
  MinusDate,
  // PlusDate,
  CountDaysFromStartDate,
  EncodeWithCipher,
  DecodeWithCipher,
}