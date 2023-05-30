import axios from "axios";

export const baseURL = "http://localhost:8081/api";
// export const baseURL = "https://unfame.tech:8081/api";

const axiosFaceBase = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL || baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosFaceBase;