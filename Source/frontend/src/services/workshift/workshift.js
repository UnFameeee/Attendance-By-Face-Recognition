import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import { pagingInstance } from "../../Utils/PagingInstance";
import { Helper } from "../../Utils/Helper";

const endPoint = baseURL + "/shifttype";
export const getListShiftType = async () => {
  const response = await axiosBase.get(`${endPoint}/getListShiftType`);
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

export const getWorkShiftOfEmployee = async (employeeId, monthIndex) => {
  const month = {
    month: monthIndex + 1,
    year: 2023,
  };
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
