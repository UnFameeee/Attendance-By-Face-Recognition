import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import { pagingInstance } from "../../Utils/PagingInstance";

const endPoint = baseURL + "/department";
const getListDepartment = async ({ paging }) => {
  var pagingObj;
  if (paging) pagingObj = paging;
  else pagingObj = pagingInstance;
  const response = await axiosBase.post(
    `${endPoint}/listDepartment`,
    pagingObj
  );
  return response.data;
};
export const useGetListDepartment = () => {
  return useQuery("listDepartment", getListDepartment, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
const createDepartmentService = async (departmentObj) => {
  const response = await axiosBase.post(
    `${endPoint}/createDepartment`,
    departmentObj
  );
  return response.data;
};

const saveDepartmentService = async ({ id, departmentObj }) => {
  const response = await axiosBase.post(
    `${endPoint}/updateDepartmentDetail/${id}`,
    departmentObj
  );
  return response.data;
};

const deleteDepartment = async ( id ) => {
  const response = await axiosBase.delete(
    `${endPoint}/deleteDepartment/${id}`
  );
  return response.data;
};

export const departmentService = {
  getListDepartment,
  createDepartmentService,
  saveDepartmentService,
  deleteDepartment,
};
