import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import { pagingInstance } from "../../Utils/PagingInstance";
import { Helper } from "../../Utils/Helper";
import dayjs from "dayjs";

const endPoint = baseURL + "/shifttype";
export const getListShiftType = async () => {
  const paging = {
    page: 0,
    pageSize: 20,
  };
  const response = await axiosBase.post(`${endPoint}/getAllShiftType`,paging);
  return response.data;
};

export const useGetListShiftType = () => {
  return useQuery("listShiftType", getListShiftType, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
export const modifyWorkShiftService = async (workShiftObj) => {
  const response = await axiosBase.post(
    `${baseURL}/workshift/modifyWorkshift`,
    workShiftObj
  );
  return response.data;
};

export const getWorkShiftOfEmployee = async (data) => {
  const { employeeId, monthIndex } = data;
  let month;
  if (monthIndex >= 0) {
    let realMonth = Math.floor(monthIndex) + 1;
    let yearDif = Math.floor(Math.floor(monthIndex + 1) / 12);
    if (realMonth > 12) {
      realMonth = realMonth - 12 * yearDif > 0 ? realMonth - 12 * yearDif : 12;
    }
    if (realMonth == 12) {
      yearDif -= 1;
    }
    month = {
      month: {
        previousMonth: realMonth - 1 < 1 ? 12 : realMonth - 1,
        nextMonth: realMonth + 1 > 12 ? 1 : realMonth + 1,
      },
      year: Math.floor(parseInt(dayjs().format("YYYY")) + yearDif),
    };
  } else {
    let yearDif = Math.ceil(Math.abs(monthIndex) / 12);
    let realMonth = Math.floor(monthIndex) + yearDif * 12 + 1;
    month = {
      month: {
        previousMonth: realMonth - 1 < 1 ? 12 : realMonth - 1,
        nextMonth: realMonth + 1 > 12 ? 1 : realMonth + 1,
      },
      year: Math.floor(parseInt(dayjs().format("YYYY")) - yearDif),
    };
  }
  const response = await axiosBase.post(
    `${baseURL}/workshift/getWorkshiftOfEmployee/${employeeId}`,
    month
  );
  return response.data;
};

export const useGetWorkShiftEmployee = (monthIndex) => {
  const userData = Helper.getUseDecodeInfor();
  return useQuery(
    "listWorkShiftOfEmployee",
    () => getWorkShiftOfEmployee(userData.id, monthIndex),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export const getWorkShiftOfDepartment = async (data) => {
  const { departmentId, monthIndex } = data;
  let month;
  if (monthIndex >= 0) {
    let realMonth = Math.floor(monthIndex) + 1;
    let yearDif = Math.floor(Math.floor(monthIndex + 1) / 12);
    if (realMonth > 12) {
      realMonth = realMonth - 12 * yearDif > 0 ? realMonth - 12 * yearDif : 12;
    }
    if (realMonth == 12) {
      yearDif -= 1;
    }
    month = {
      month: {
        previousMonth: realMonth - 1 < 1 ? 12 : realMonth - 1,
        nextMonth: realMonth + 1 > 12 ? 1 : realMonth + 1,
      },
      year: Math.floor(parseInt(dayjs().format("YYYY")) + yearDif),
    };
  } else {
    let yearDif = Math.ceil(Math.abs(monthIndex) / 12);
    let realMonth = Math.floor(monthIndex) + yearDif * 12 + 1;
    month = {
      month: {
        previousMonth: realMonth - 1 < 1 ? 12 : realMonth - 1,
        nextMonth: realMonth + 1 > 12 ? 1 : realMonth + 1,
      },
      year: Math.floor(parseInt(dayjs().format("YYYY")) - yearDif),
    };
  }
  const response = await axiosBase.post(
    `${baseURL}/workshift/getWorkshiftOfDepartment/${departmentId}`,
    month
  );
  return response.data;
};
export const deleteWorkShiftService = async (shiftId) => {
  const response = await axiosBase.delete(
    `${baseURL}/workshift/deleteWorkshift/${shiftId}`
  );
  return response.data;
};
