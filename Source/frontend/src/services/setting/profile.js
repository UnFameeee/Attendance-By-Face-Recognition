import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";
const endPoint = baseURL + "/profile";
const getProfileDetail = async (id) => {
  const response = await axiosBase.get(`${endPoint}/getProfileDetail/${id}`);
  return response.data;
};
export const useGetProfileDetail = (id) => {
  return useQuery(["profileDetail", id], () => getProfileDetail(id), {
    refetchOnWindowFocus: false,
    retry: 1,
  });
};
const saveProfileDetail = async ({ id, profileDetail }) => {
  const response = await axiosBase.post(
    `${endPoint}/updateProfileDetail/${id}`,
    profileDetail
  );
  return response.data;
};

const uploadProfileImages = async (uploadImages) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const response = await axiosBase.post(
    `${endPoint}/uploadImages`,
    uploadImages,
    {
      headers,
    }
  );
  return response.data;
};
const validateFirstTimeLogin = async () => {
  const response = await axiosBase.get(`${endPoint}/validateFirstTimeLogin`);
  return response.data;
};
export const profileService = {
  getProfileDetail,
  saveProfileDetail,
  uploadProfileImages,
  validateFirstTimeLogin,
};
