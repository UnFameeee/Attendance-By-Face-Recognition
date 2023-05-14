import axiosBase, { baseURL } from "../../Utils/AxiosInstance";

const endPointAttendance = baseURL + "/facialRecognition";

const saveImageOfTraining = async (employeeId, formData) => {
  console.log(employeeId);
  console.log(formData);

  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const response = await axiosBase.post(
    `${endPointAttendance}/uploadingImagesAndTraining?employeeId=${employeeId}`,
    formData,
    { headers }
  );
  return response.data;
};

export const trainingService = {
  saveImageOfTraining,
}