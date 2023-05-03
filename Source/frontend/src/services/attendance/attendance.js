import axiosBase from "../../Utils/AxiosInstance";
import { baseURL } from "./../../Utils/AxiosInstance";
import { useQuery } from "react-query";

const endPoint = baseURL + "/attendance";
const endPointAttendanceException = baseURL + "/attendance-exception";
const takeAttendance = async (employeeId, attendanceType) => {
  const postObj = {
    employeeId: employeeId,
    attendanceType: attendanceType,
  };
  const response = await axiosBase.post(`${endPoint}/takeAttendance`, postObj);
  return response.data;
};

const getEmployeeDetailById = async (id) => {
  // debugger;
  if (id) {
    const response = await axiosBase.get(
      `${endPoint}/getEmployeeDetailById/${id}`
    );
    return response.data;
  }
};

const useGetEmployeeDetailById = (id) => {
  return useQuery({
    queryKey: ["employeeDetail", id],
    queryFn: async () => {
      const data = await getEmployeeDetailById(id);
      return data.result;
    },
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

const saveImageOfExceptionAttendance = async (data) => {
  const { email, checkType, image } = data;
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const response = await axiosBase.post(
    `${endPointAttendanceException}/saveImage?email=${email}&type=${checkType}`,
    image,
    {
      headers,
    }
  );
  return response.data;
};

const submissionOfExceptionAttendance = async (submissionData) => {
  const response = await axiosBase.post(
    `${endPointAttendanceException}/submission?`,
    submissionData
  );
  return response.data;
};
const getListAttendanceException = async (data) => {
  let pagingData = {};
  pagingData = { page: 0, pageSize: 1000, extendData: { ...data } };
  const response = await axiosBase.post(
    `${endPointAttendanceException}/getListAttendanceException?`,
    pagingData
  );
  return response.data;
};
const getAttendanceExceptionData = async (id) => {
  const response = await axiosBase.get(
    `${endPointAttendanceException}/getAttendanceExceptionData/${id}`
  );
  return response.data;
};
const verifyExceptionAttendance = async (data) => {
  const { id, status } = data;
  const response = await axiosBase.post(
    `${endPointAttendanceException}/verifyAttendanceException/${id}`,
    status
  );
  return response.data;
};
export const attendanceService = {
  takeAttendance,
  useGetEmployeeDetailById,
  saveImageOfExceptionAttendance,
  submissionOfExceptionAttendance,
  getListAttendanceException,
  getAttendanceExceptionData,
  verifyExceptionAttendance,
};
