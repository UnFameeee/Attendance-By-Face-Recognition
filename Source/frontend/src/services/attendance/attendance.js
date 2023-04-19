import axiosBase from "../../Utils/AxiosInstance";
import { baseURL } from './../../Utils/AxiosInstance';
import { useQuery } from 'react-query';

const endPoint = baseURL + "/attendance";
const takeAttendance = async (employeeId, attendanceType) => {
  const postObj = {
    employeeId: employeeId,
    attendanceType: attendanceType
  }
  const response = await axiosBase.post(`${endPoint}/takeAttendance`, postObj);
  return response.data;
}

const getEmployeeDetailById = async (id) => {
  const response = await axiosBase.get(`${endPoint}/getEmployeeDetailById/${id}`);
  return response.data;
};

const useGetEmployeeDetailById = (id) => {
  return useQuery(["employeeDetail", id], () => getEmployeeDetailById(id), {
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export const attendanceService = {
  takeAttendance,
  useGetEmployeeDetailById
}