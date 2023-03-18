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
    retry: 3,
  });
};
