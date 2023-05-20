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
    const time = new Date();
    const response = await axiosBase.post(
      `${endPointAttendance}/getEmployeeDetailById/${id}`, {
      date: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
    }
    );
    return response.data;
  }
};

const useGetEmployeeDetailById = (id) => {
  return useQuery({
    queryKey: ["employeeDetail", id],
    queryFn: async () => {
      if (id) {
        const data = await getEmployeeDetailById(id);
        return data.result;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
    enabled: false,
  });
};

const getThisMonthAttendance = async (id) => {
  let thisMonthAttendanceObj = {
    month: parseInt(moment(new Date().toISOString()).format("M")),
    year: parseInt(moment(new Date().toISOString()).format("yyyy")),
  };
  const response = await axiosBase.post(
    `${endPointAttendance}/getThisMonthAttendance/${id}`,
    thisMonthAttendanceObj
  );
  return response.data;
};
const getAttendanceStatistic = async (employeeId) => {
  const response = await axiosBase.post(
    `${endPointAttendance}/getAttendanceStatistic/${employeeId}`,
    {}
  );
  return response.data;
};
const useGetAttendanceStatistic = (id) => {
  return useQuery({
    queryKey: ["employeeAttendanceStatistic", id],
    queryFn: async () => {
      if (id) {
        const data = await getAttendanceStatistic(id);
        return data.result;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
const getYearlyAttendanceStatistic = async (employeeId) => {
  let year = new Date().getFullYear();
  const response = await axiosBase.post(
    `${endPointAttendance}/getYearlyAttendanceStatistic/${employeeId}`,
    { year: year }
  );
  return response.data;
};
const useGetYearlyAttendanceStatistic = (id) => {
  return useQuery({
    queryKey: ["employeeYearlyAttendanceStatistic", id],
    queryFn: async () => {
      const data = await getYearlyAttendanceStatistic(id);
      return data.result;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
const useGetThisMonthAttendance = (id) => {
  return useQuery({
    queryKey: ["thisMonthAttendanceData", id],
    queryFn: async () => {
      if (id) {
        const data = await getThisMonthAttendance(id);
        return data.result;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

const getTodayAttendance = async (id) => {
  let todayAttendanceObj = {
    date: parseInt(moment(new Date().toISOString()).format("D")),
    month: parseInt(moment(new Date().toISOString()).format("M")),
    year: parseInt(moment(new Date().toISOString()).format("yyyy")),
  };
  const response = await axiosBase.post(
    `${endPointAttendance}/getTodayAttendance/${id}`,
    todayAttendanceObj
  );
  return response.data;
};

const useGetTodayAttendance = (id) => {
  return useQuery({
    queryKey: ["todayAttendanceData", id],
    queryFn: async () => {
      if (id) {
        const data = await getTodayAttendance(id);
        return data.result;
      }
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

const getAttendanceHistory = async (data) => {
  const { month, year, id, isValid } = data;
  let attendanceHistoryObj = {
    month: month,
    year: year,
    isValid: isValid ?? true,
  };
  const response = await axiosBase.post(
    `${endPointAttendance}/getAttendanceHistory/${id}`,
    attendanceHistoryObj
  );
  return response.data;
};

const useGetAttendanceHistory = (attendanceHistoryObj) => {
  return useQuery({
    queryKey: ["attendanceHistoryData", attendanceHistoryObj.id],
    queryFn: async () => {
      if (attendanceHistoryObj.id) {
        const data = await getAttendanceHistory(attendanceHistoryObj);
        return data.result;
      }
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
  getYearlyAttendanceStatistic,
  getAttendanceStatistic,
  useGetAttendanceHistory,
  useGetThisMonthAttendance,
  useGetTodayAttendance,
  useGetAttendanceDetail,
  useGetAttendanceStatistic,
  useGetYearlyAttendanceStatistic,
  saveImageOfAnonymousAttendance,
};
