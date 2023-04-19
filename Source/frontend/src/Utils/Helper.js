import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import moment from "moment";

const isTokenExpired = (token) => {
  if (token) {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  }
  return true;
};
const isOdd = (value) => {
  return value % 2 === 0;
};
const getMonth = (month = dayjs().month()) => {
  month = Math.floor(month);
  const year = dayjs().year();
  const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).day();
  let currentMonthCount = 0 - firstDayOfTheMonth;
  const daysMatrix = new Array(5).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      currentMonthCount++;
      return dayjs(new Date(year, month, currentMonthCount));
    });
  });
  return daysMatrix;
};

const convertDateISOToDDMMYYY = (dateISO) => {
  const dateObj = new Date(dateISO);
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear().toString().substring(2);
  return `${day}-${month}-${year}`;
};
const getUseDecodeInfor = () => {
  const accessTokenJSON = localStorage.getItem("accessToken");
  const accessToken = JSON.parse(accessTokenJSON);
  var decoded = jwtDecode(accessToken);
  return decoded;
};

const getMomentDateFormat = (dateInput) => {
  const date = new Date(new Date(dateInput).toISOString());
  const formatDate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
  return formatDate;
};

export const Helper = {
  isTokenExpired,
  isOdd,
  getMonth,
  convertDateISOToDDMMYYY,
  getUseDecodeInfor,
  getMomentDateFormat,
};
