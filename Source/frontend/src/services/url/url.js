import { useQuery } from "react-query";
import axiosBase, { baseURL } from "../../Utils/AxiosInstance";

const endPoint = baseURL + "/url-generate";

const validateURL = async (url) => {
  const dataURL = {
    URL: url,
  }
  const response = await axiosBase.post(`${endPoint}/qr/validate`, dataURL);
  return response.data;
}

const useValidateURL = ({ url }) => {
  return useQuery({
    queryKey: ['URL', 'validation', `${url}`],
    queryFn: async () => {
      console.log(url);
      const response = await validateURL(url);
      return response;
    },
  })
}

const generateURL = async ({ urlType, employeeId }) => {
  var response;
  if (employeeId) {
    response = await axiosBase.get(`${endPoint}/qr?type=${urlType}&id=${employeeId}`);
  } else {
    response = await axiosBase.get(`${endPoint}/qr?type=${urlType}`);
  }
  return response.data;
}

const useGenerateURL = ({ urlType, employeeId }) => {
  console.log(employeeId);
  return useQuery({
    queryKey: ['URL', 'generate', `${urlType}`, employeeId],
    queryFn: async () => {
      var response;
      if (employeeId) {
        response = await generateURL({ urlType, employeeId });
      } else {
        response = await generateURL({ urlType });
      }
      return response;
    },
    enabled: false,
  })
}

export const urlService = {
  useValidateURL,
  useGenerateURL,
};