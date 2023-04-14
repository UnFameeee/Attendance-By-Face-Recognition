import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import { pagingInstance } from "../../Utils/PagingInstance";

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

export const getWorkShiftOfEmployee = async (employeeId) => {
  const month = {
    month: 4,
    year: 2023,
  };
  const response = await axiosBase.post(
    `${baseURL}/workshift/getWorkshiftOfEmployee/1444d65a-2462-4559-9a08-abadc553b028`,
    month
  );
  return response.data;
};

export const useGetWorkShiftOfEmployee = () => {
  return useQuery("listWorkShiftOfEmployee", getWorkShiftOfEmployee, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
