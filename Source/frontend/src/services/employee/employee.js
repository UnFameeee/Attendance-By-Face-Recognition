import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import { pagingInstance } from "../../Utils/PagingInstance";

const endPoint = baseURL + "/employee";
export const getListEmployee = async ({paging}) => {
  var pagingObj;
  if (paging) pagingObj = paging;
  else pagingObj = pagingInstance;
  const response = await axiosBase.post(`${endPoint}/listEmployee`, pagingObj);
  return response.data;
};
export const useGetListEmployee = () => {
  return useQuery("listEmployee", getListEmployee, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const getListRoleOfEmployee = async () => {
  const response = await axiosBase.get(`${endPoint}/getListRoleOfEmployee`);
  return response.data;
};
export const useGetListRoleOfEmployee = () => {
  return useQuery("listRoleOfEmployee", getListRoleOfEmployee, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const createEmployeeService = async (employeeObj) => {
  const response = await axiosBase.post(
    `${endPoint}/createEmployee`,
    employeeObj
  );
  return response.data;
};

export const saveEmployeeService = async ({ id, employeeObj }) => {
  const response = await axiosBase.post(
    `${endPoint}/updateEmployeeDetail/${id}`,
    employeeObj
  );
  return response.data;
};

export const assignEmployeeToDepartmentService = async (assignObj) => {
  const response = await axiosBase.post(
    `${endPoint}/assignEmployeeToDepartment`,
    assignObj
  );
  return response.data;
};
export const assignManagerToDepartmentService = async (assignObj) => {
  const response = await axiosBase.post(
    `${endPoint}/assignManagerToDepartment`,
    assignObj
  );
  return response.data;
};
// export const deleteEmployeeService = async (employeeId) => {
//   const response = await axiosBase.post(
//     `${endPoint}/createEmployee`,
//     employeeObj
//   );
//   return response.data;
// };