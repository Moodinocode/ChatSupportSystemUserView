import axiosInstance from "../Utils/axiosInstance";

const suburl = "/auth";

export const login = (credentials) => axiosInstance.post(`${suburl}/login`, credentials );

export const register = (userInfo) => axiosInstance.post(`${suburl}/register`, userInfo);
