import service from "./request";

export const getUserInfo = (params: string) => {
  return service.get(`/userinfo/${params}`);
};

export const userLogin = (params?: Object) => {
  return service.post("/login", params);
};

export const userRegister = (params: Object) => {
  return service.post("/register", params);
};
