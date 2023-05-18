import moment from "moment";
import axiosBase from "../../Utils/AxiosInstance";
import { baseURL } from "./../../Utils/AxiosInstance";
import { useQuery } from "react-query";

const endPointAttendance = baseURL + "/attendance";
const endPointAttendanceException = baseURL + "/attendance-exception";

const takeAttendance = async (data) => {
  const { employeeId, attendanceType, image } = data;

  const response = await axiosBase.post(
    `${endPointAttendance}/takeAttendance`,
    {
      employeeId: employeeId,
      attendanceType: attendanceType,
      image: image,
    }
  );
  return response.data;
};

const getEmployeeDetailById = async (id) => {
  if (id) {
    const response = await axiosBase.get(
      `${endPointAttendance}/getEmployeeDetailById/${id}`
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

const getThisMonthAttendance = async (data) => {
  const { currentDate } = data;
  let thisMonthAttendanceObj = {
    month: parseInt(moment(currentDate).format("M")),
    year: parseInt(moment(currentDate).format("yyyy")),
  };
  const response = await axiosBase.post(
    `${endPointAttendance}/getThisMonthAttendance`,
    thisMonthAttendanceObj
  );
  return response.data;
};

const useGetThisMonthAttendance = (thisMonthAttendanceObj) => {
  return useQuery({
    queryKey: "thisMonthAttendanceData",
    queryFn: async () => {
      const data = await getThisMonthAttendance(thisMonthAttendanceObj);
      return data.result;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

const getTodayAttendance = async (data) => {
  const { currentDate } = data;
  let todayAttendanceObj = {
    date: parseInt(moment(currentDate).format("D")),
    month: parseInt(moment(currentDate).format("M")),
    year: parseInt(moment(currentDate).format("yyyy")),
  };
  const response = await axiosBase.post(
    `${endPointAttendance}/getTodayAttendance`,
    todayAttendanceObj
  );
  return response.data;
};

const useGetTodayAttendance = (todayAttendanceObj) => {
  return useQuery({
    queryKey: "todayAttendanceData",
    queryFn: async () => {
      const data = await getTodayAttendance(todayAttendanceObj);
      return data.result;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

const getAttendanceHistory = async (data) => {
  const { currentDate, userInfo } = data;
  let attendanceHistoryObj = {
    month: parseInt(moment(currentDate).format("M")),
    year: parseInt(moment(currentDate).format("yyyy")),
  };
  const response = await axiosBase.post(
    `${endPointAttendance}/getAttendanceHistory/${userInfo.id}`,
    attendanceHistoryObj
  );
  return response.data;
};

const useGetAttendanceHistory = (attendanceHistoryObj) => {
  return useQuery({
    queryKey: "attendanceHistoryData",
    queryFn: async () => {
      const data = await getAttendanceHistory(attendanceHistoryObj);
      return data.result;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

const getAttendanceDetail = async (attendanceId) => {
  const response = await axiosBase.get(
    `${endPointAttendance}/getAttendanceDetail/${attendanceId}`
  );
  return response.data;
};

const useGetAttendanceDetail = (attendanceId) => {
  return useQuery({
    queryKey: ["attendanceDetail", attendanceId],
    queryFn: async () => {
      const data = await getAttendanceDetail(attendanceId);
      return data.result;
    },
    refetchOnWindowFocus: false,
    retry: 1,
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

const saveImageOfAnonymousAttendance = async (formData) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const response = await axiosBase.post(
    `${endPointAttendanceException}/saveAnonymousImage`,
    formData,
    {
      headers,
    }
  );
  return response.data;
};

const submissionOfExceptionAttendance = async (submissionData) => {
  console.log(submissionData);

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
    { status: status }
  );
  return response.data;
};

const saveImageOfAttendance = async (employeeId, formData) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  const response = await axiosBase.post(
    `${endPointAttendance}/saveImage?employeeId=${employeeId}`,
    formData,
    { headers }
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
  saveImageOfAttendance,
  getAttendanceDetail,
  getAttendanceHistory,
  getTodayAttendance,
  getThisMonthAttendance,
  useGetAttendanceHistory,
  useGetThisMonthAttendance,
  useGetTodayAttendance,
  useGetAttendanceDetail,
  saveImageOfAnonymousAttendance,
};
