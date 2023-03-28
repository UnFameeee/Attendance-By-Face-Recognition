import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
const endPoint = baseURL + "/profile";
export const getProfileDetail = async (id) => {
  const response = await axiosBase.get(`${endPoint}/getProfileDetail/${id}`);
  return response.data;
};
export const useGetProfileDetail = (id) => {
  return useQuery(["profileDetail", id], () => getProfileDetail(id), {
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
export const saveProfileDetail = async ({ id, profileDetail }) => {
  const response = await axiosBase.post(
    `${endPoint}/updateProfileDetail/${id}`,
    profileDetail
  );
  return response.data;
};
