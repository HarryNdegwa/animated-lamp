import jwtDecode from "jwt-decode";

export const isAuthenticated = (token) => {
  if (!token) {
    return false;
  }
  let decoded = jwtDecode(token);
  let expireTime = decoded.exp;
  if (expireTime) {
    let epochNow = Math.floor(new Date().getTime() / 1000.0);
    if (epochNow < expireTime) {
      return true;
    }
  }
  return false;
};
