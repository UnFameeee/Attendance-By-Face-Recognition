import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import { pagingInstance } from "../../Utils/PagingInstance";

const endPoint = baseURL + "/employee";
const getListEmployee = async ({ paging }) => {
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
const getListEmployeeOfDepartment = async ({ departmentId, paging }) => {
  var pagingObj;
  if (paging) pagingObj = paging;
  else pagingObj = pagingInstance;
  const response = await axiosBase.post(
    `${endPoint}/listEmpInDepartment/${departmentId}`,
    pagingObj
  );
  return response.data;
};

const getListRoleOfEmployee = async () => {
  const response = await axiosBase.get(`${endPoint}/getListRoleOfEmployee`);
  return response.data;
};
export const useGetListRoleOfEmployee = () => {
  return useQuery("listRoleOfEmployee", getListRoleOfEmployee, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

const createEmployeeService = async (employeeObj) => {
  const response = await axiosBase.post(
    `${endPoint}/createEmployee`,
    employeeObj
  );
  return response.data;
};

 const saveEmployeeService = async ({ id, employeeObj }) => {
  const response = await axiosBase.post(
    `${endPoint}/updateEmployeeDetail/${id}`,
    employeeObj
  );
  return response.data;
};

const assignEmployeeToDepartmentService = async (assignObj) => {
  const response = await axiosBase.post(
    `${endPoint}/assignEmployeeToDepartment`,
    assignObj
  );
  return response.data;
};
 const assignManagerToDepartmentService = async (assignObj) => {
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

export const employeeService = {
  getListEmployee,
  getListRoleOfEmployee,
  assignManagerToDepartmentService,
  assignEmployeeToDepartmentService,
  saveEmployeeService,
  createEmployeeService,
  getListEmployeeOfDepartment,
};
