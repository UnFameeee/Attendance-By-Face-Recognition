import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";

const endPoint = baseURL + "/organization";
export const getOrganizationDetail = async () => {
  const response = await axiosBase.get(`${endPoint}/detail`);
  return response.data;
};
export const useGetOrganizationDetail = () => {
  return useQuery("organizationDetail", getOrganizationDetail, {
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
export const getListOrganization = async () => {
  const response = await axiosBase.get(`${endPoint}/list`);
  return response.data;
};
export const useGetListOrganization = () => {
  return useQuery("listOrganization", getListOrganization, {
    refetchOnWindowFocus: false,
    retry: 3,
  });
};
export const createOrganizationDetail = async (organizationDetail) => {
  const response = await axiosBase.post(
    `${endPoint}/createOrganization`,
    organizationDetail
  );
  return response.data;
};

export const saveOrganizationDetail = async ({ id, organizationDetail }) => {
  const response = await axiosBase.post(
    `${endPoint}/updateOrganizationDetail/${id}`,
    organizationDetail
  );
  return response.data;
};
