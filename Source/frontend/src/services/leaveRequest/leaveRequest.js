import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import { pagingInstance } from "../../Utils/PagingInstance";
import moment from "moment";
const endPointLeaveRequest = baseURL + "/leaverequest";
const endPointLeaveType = baseURL + "/leavetype";

const getLeaveRequestOfDepartment = async (data) => {
  const { departmentId, currentDate } = data;
  let extendData = {
    month: parseInt(moment(currentDate).format("M")),
    year: parseInt(moment(currentDate).format("yyyy")),
  };
  let getLROfDepartmentObj = {
    page: 0,
    pageSize: 1000,
    extendData,
  };
  const response = await axiosBase.post(
    `${endPointLeaveRequest}/getLeaveRequestOfDepartment/${departmentId}`,
    getLROfDepartmentObj
  );
  return response.data;
};
const useGetLeaveRequestOfDepartment = (data) => {
  return useQuery(
    "listLeaveRequestOfDepartment",
    () => getLeaveRequestOfDepartment(data),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};
const getLeaveRequestOfAnEmployee = async (data) => {
  const { userInfo, currentDate } = data;
  let extendData = {
    month: parseInt(moment(currentDate).format("M")),
    year: parseInt(moment(currentDate).format("yyyy")),
  };
  let getLROfAnEmployeeObj = {
    page: 0,
    pageSize: 1000,
    extendData,
  };
  const response = await axiosBase.post(
    `${endPointLeaveRequest}/getLeaveRequestOfEmployee/${userInfo.id}`,
    getLROfAnEmployeeObj
  );
  return response.data;
};

const useGetLeaveRequestOfAnEmployee = (data) => {
  return useQuery(
    "listLeaveRequestOfAnEmployee",
    () => getLeaveRequestOfAnEmployee(data),
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

const createLeaveRequest = async (createLRObj) => {
  const response = await axiosBase.post(
    `${endPointLeaveRequest}/createLeaveRequest`,
    createLRObj
  );
  return response.data;
};

const verifyLeaveRequest = async (data) => {
  const { leaveRequestId, status } = data;
  const response = await axiosBase.post(
    `${endPointLeaveRequest}/verifyLeaveRequest/${leaveRequestId}`,
    { status: status }
  );
  return response.data;
};
const deleteLeaveRequest = async (leaveRequestId) => {
  const response = await axiosBase.delete(
    `${endPointLeaveRequest}/deleteLeaveRequest/${leaveRequestId}`
  );
  return response.data;
};
const getAnnualDetail = async (annualDetailObj) => {
  const response = await axiosBase.get(
    `${endPointLeaveRequest}/getAnnualDetail`,
    annualDetailObj
  );
  return response.data;
};
const useGetAnnualDetail = () => {
  return useQuery("AnnualLeaveRequestData", getAnnualDetail, {
    refetchIntervalInBackground: false,
    retry: 1,
  });
};
const getAllLeaveType = async () => {
  let paging = pagingInstance;
  const response = await axiosBase.post(
    `${endPointLeaveType}/getAllLeaveType`,
    paging
  );
  return response.data;
};
const useGetAllLeaveType = () => {
  return useQuery("listLeaveType", getAllLeaveType, {
    refetchIntervalInBackground: false,
    retry: 1,
  });
};
const modifyLeaveType = async (data) => {
  const response = await axiosBase.post(
    `${endPointLeaveType}/modifyLeaveType`,
    data
  );
  return response.data;
};
const deleteLeaveType = async (id) => {
  const response = await axiosBase.delete(
    `${endPointLeaveType}/deleteLeaveType/${id}`
  );
  return response.data;
};
export const leaveRequestService = {
  getLeaveRequestOfDepartment,
  getLeaveRequestOfAnEmployee,
  createLeaveRequest,
  verifyLeaveRequest,
  deleteLeaveRequest,
  getAnnualDetail,
  modifyLeaveType,
  deleteLeaveType,
  useGetLeaveRequestOfAnEmployee,
  useGetLeaveRequestOfDepartment,
  useGetAllLeaveType,
  useGetAnnualDetail,
};
