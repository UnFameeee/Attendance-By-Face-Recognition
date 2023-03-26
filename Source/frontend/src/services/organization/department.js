import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
import { pagingInstance } from "../../Utils/PagingInstance";

const endPoint = baseURL + "/department";
export const getListDepartment = async ({paging}) => {
  var pagingObj;
  if (paging) pagingObj = paging;
  else pagingObj = pagingInstance;
  const response = await axiosBase.post(`${endPoint}/listDepartment`, pagingObj);
  return response.data;
};
export const useGetListDepartment = () => {
  return useQuery("listDepartment", getListDepartment, {
    refetchOnWindowFocus: false,
    retry: 1,
  });
};