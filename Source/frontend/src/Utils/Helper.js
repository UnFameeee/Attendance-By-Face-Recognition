import jwtDecode from "jwt-decode";
import dayjs from "dayjs";

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

function findMostDuplicatedValue(array) {
  let counts = {};
  let maxCount = 0;
  let mostDuplicatedValue;
  for (let i = 0, length = array.length; i < length; ++i) {
    let value = array[i];
    counts[value] = (counts[value] || 0) + 1;
    if (counts[value] > maxCount) {
      maxCount = counts[value];
      mostDuplicatedValue = value;
    }
  }
  return maxCount > 1 ? mostDuplicatedValue : "unknown";
}

export const Helper = {
  isTokenExpired,
  isOdd,
  getMonth,
  findMostDuplicatedValue
};
