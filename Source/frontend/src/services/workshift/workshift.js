import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import { pagingInstance } from "../../Utils/PagingInstance";
import { Helper } from "../../Utils/Helper";
import dayjs from "dayjs";

const endPointShiftType = baseURL + "/shifttype";
const endPointWorkShift = baseURL + "/workshift";
const calculateRealMonth = (monthIndex) => {
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
  return month;
};
const getListShiftType = async () => {
  const paging = pagingInstance;
  const response = await axiosBase.post(
    `${endPointShiftType}/getAllShiftType`,
    paging
  );
  return response.data;
};
export const useGetListShiftType = () => {
  return useQuery("listShiftType", getListShiftType, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
const modifyWorkShiftService = async (workShiftObj) => {
  const response = await axiosBase.post(
    `${endPointWorkShift}/modifyWorkshift`,
    workShiftObj
  );
  return response.data;
};
const getWorkShiftOfEmployee = async (data) => {
  const { employeeId, monthIndex, workShiftType } = data;
  let monthAndYear = calculateRealMonth(monthIndex);
  let getWorkShiftObj = {
    ...monthAndYear,
    selection: {
      work: workShiftType.work,
      leave: workShiftType.leave,
    },
  };
  const response = await axiosBase.post(
    `${endPointWorkShift}/getWorkshiftOfEmployee/${employeeId}`,
    getWorkShiftObj
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
const getWorkShiftOfDepartment = async (data) => {
  const { departmentId, monthIndex, workShiftType } = data;
  let monthAndYear = calculateRealMonth(monthIndex);
  let getWorkShiftObj = {
    ...monthAndYear,
    selection: {
      work: workShiftType.work,
      leave: workShiftType.leave,
    },
  };
  const response = await axiosBase.post(
    `${endPointWorkShift}/getWorkshiftOfDepartment/${departmentId}`,
    getWorkShiftObj
  );
  return response.data;
};
const deleteWorkShiftService = async (shiftId) => {
  const response = await axiosBase.delete(
    `${endPointWorkShift}/deleteWorkshift/${shiftId}`
  );
  return response.data;
};
const modifyShiftTypeService = async (data) => {
  const response = await axiosBase.post(
    `${endPointShiftType}/modifyShiftType`,
    data
  );
  return response.data;
};
const deleteShiftTypeService = async (id) => {
  const response = await axiosBase.delete(
    `${endPointShiftType}/deleteShiftType/${id}`
  );
  return response.data;
};

export const workShiftService = {
  modifyWorkShiftService,
  getWorkShiftOfEmployee,
  getWorkShiftOfDepartment,
  deleteWorkShiftService,
};
export const shiftTypeService = {
  getListShiftType,
  modifyShiftTypeService,
  deleteShiftTypeService,
};
