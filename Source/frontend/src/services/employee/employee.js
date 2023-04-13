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

// export const saveOrganizationDetail = async ({ id, organizationDetail }) => {
//   const response = await axiosBase.post(
//     `${endPoint}/updateOrganizationDetail/${id}`,
//     organizationDetail
//   );
//   return response.data;
// };
