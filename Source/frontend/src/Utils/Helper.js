import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

export const isTokenExpired = (token) => {
  if (token) {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  }
  return true;
};
export const isOdd = (value) => {
  return value % 2 === 0;
};
export const getMonth = (month = dayjs().month()) => {
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
export const convertTimestampToISO = (timestamp) => {
  const date = new Date(timestamp);
  return date.toISOString();
};
export const Helper = {
  isTokenExpired,
  isOdd,
  getMonth,
  convertTimestampToISO,
};
