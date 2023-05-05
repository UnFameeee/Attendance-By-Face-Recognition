import axiosBase from "../../Utils/AxiosInstance";

const getPermission = async () => {
  const response = await axiosBase.get(`auth/getPerms`);
  return response.data;
};

export const permissionService = {
  getPermission,
};
