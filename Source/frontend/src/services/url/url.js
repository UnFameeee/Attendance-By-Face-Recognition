import { useQuery } from "react-query";
import axiosFaceBase, { baseURL } from "../../Utils/AxiosFaceInstance";

const endPoint = baseURL + "/url-generate";

const validateURL = async (url) => {
  const dataURL = {
    URL: url,
  }
  const response = await axiosFaceBase.post(`${endPoint}/qr/validate`, dataURL);
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

const generateURL = async (urlType, employeeId, urlImage) => {
  var response;
  if (employeeId) {
    response = await axiosFaceBase.get(`${endPoint}/qr?type=${urlType}&id=${employeeId}`);
  } else if (urlImage) {
    response = await axiosFaceBase.get(`${endPoint}/qr?type=${urlType}&url=${urlImage}`);
  }
  return response.data;
}

const useGenerateURL = ({ urlType, employeeId, urlImage }) => {
  return useQuery({
    queryKey: ['URL', 'generate', urlType, employeeId, urlImage],
    queryFn: async () => {
      var response;
      // if (employeeId != null) {
      //   console.log(urlImage);
      //   response = await generateURL(urlType, employeeId, null);
      // } else if (urlImage != null) {
      //   console.log(urlImage);
      // }
      if (employeeId) {
        response = await axiosFaceBase.get(`${endPoint}/qr?type=${urlType}&id=${employeeId}`);
      } else if (urlImage) {
        response = await axiosFaceBase.get(`${endPoint}/qr?type=${urlType}&url=${urlImage}`);
      }
      response = await generateURL(urlType, employeeId, urlImage);
      return response;
    },
    enabled: false,
  })
}

const changeURLtoExpire = async (url) => {
  const response = await axiosFaceBase.post(`${endPoint}/qr/changeURLtoExpire`, { URL: url });
  return response.data;
}

export const urlService = {
  useValidateURL,
  useGenerateURL,
  changeURLtoExpire,
};