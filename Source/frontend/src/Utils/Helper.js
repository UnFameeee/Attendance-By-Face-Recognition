import jwtDecode from "jwt-decode";
import dayjs from "dayjs";
import moment from "moment";
import CryptoJS from "crypto-js";
import { SideBarData } from "../data/SideBarData";

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
const isFirstTimeLogin = () => {
  const isFirstTime = localStorage.getItem("isFirstTimeLogin");
  return JSON.parse(isFirstTime);
};
const getMomentDateFormat = (dateInput) => {
  const date = new Date(new Date(dateInput).toISOString());
  const formatDate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
  return formatDate;
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

const getUserRole = () => {
  const userPermission_JSON = localStorage.getItem("userPermission");
  const userPermission = JSON.parse(userPermission_JSON);
  var result = {};
  if (userPermission) {
    result["role"] = userPermission[0].role;
  } else {
    result["role"] = "employee";
  }
  return result;
};

const getScreenAuthorization = (userRole, pathname) => {
  let authorizeArray = [];
  SideBarData.map((parentItem) => {
    if (parentItem?.children) {
      parentItem?.children.map((childrenItem) => {
        if (childrenItem?.roleCanAccess) {
          if (childrenItem?.roleCanAccess.includes(userRole)) {
            authorizeArray.push({
              path: `/${parentItem.url}/${childrenItem.url}`,
              auth: true,
            });
          } else {
            authorizeArray.push({
              path: `/${parentItem.url}/${childrenItem.url}`,
              auth: false,
            });
          }
        } else {
          authorizeArray.push({
            path: `/${parentItem.url}/${childrenItem.url}`,
            auth: true,
          });
        }
      });
    } else {
      if (parentItem?.roleCanAccess) {
        if (parentItem?.roleCanAccess.includes(userRole)) {
          authorizeArray.push({ path: `/${parentItem.url}`, auth: true });
        } else {
          authorizeArray.push({ path: `/${parentItem.url}`, auth: false });
        }
      } else {
        authorizeArray.push({ path: `/${parentItem.url}`, auth: true });
      }
    }
  });
  const result = authorizeArray.find((item) => item.path == pathname);
  return result;
};

const splitUrlPath = (path) => {
  const pathArr = path.split("/");
  pathArr.shift();
  return pathArr;
};

const splitUnderscoreStringToArray = (string) => {
  const parts = string.split("_");
  return parts;
};

const matchingCodeColor = (value, codeColorObj) => {
  return codeColorObj.find(
    (item) => Object.keys(item)[0].toLowerCase() === value.toLowerCase()
  );
};

// Function to decode a message using Cipher
const decodeWithCipher = (encodedMessage) => {
  console.log(encodedMessage)
  var decodedData = (CryptoJS.enc.Base64.parse(encodedMessage)).toString(CryptoJS.enc.Utf8);
  console.log(decodedData);
  return decodedData;
}

export const Helper = {
  isTokenExpired,
  isOdd,
  getMonth,
  findMostDuplicatedValue,
  convertDateISOToDDMMYYY,
  getUseDecodeInfor,
  isFirstTimeLogin,
  getMomentDateFormat,
  getUserRole,
  getScreenAuthorization,
  splitUrlPath,
  splitUnderscoreStringToArray,
  matchingCodeColor,
  decodeWithCipher,
};
