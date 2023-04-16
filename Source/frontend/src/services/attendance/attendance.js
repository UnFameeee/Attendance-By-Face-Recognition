import axiosBase from "../../Utils/AxiosInstance";
import { baseURL } from './../../Utils/AxiosInstance';

const endPoint = baseURL + "/attendance";
const takeAttendance = async (employeeId, attendanceType) => {
  const postObj = {
    employeeId: employeeId,
    attendanceType: attendanceType
  }
  const response = await axiosBase.post(`${endPoint}/takeAttendance`, postObj);
  return response.data;
}

export const attendanceService = {
  takeAttendance
}