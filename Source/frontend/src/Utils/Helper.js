import jwtDecode from "jwt-decode";

export const isTokenExpired = (token) => {
  if (token) {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  }
  return true;
};
export const isOdd = (value) => {
  return value % 2 === 0
}
export const Helper = {
  isTokenExpired,isOdd
 }
