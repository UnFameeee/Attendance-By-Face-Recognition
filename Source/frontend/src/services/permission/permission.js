import axiosBase from "../../Utils/AxiosInstance";

const getPermission = async () => {
  const response = await axiosBase.get(`auth/getPerms`);
  localStorage.setItem("userPermission", JSON.stringify(response.data.result));
};

export const permissionService = {
  getPermission,
};
