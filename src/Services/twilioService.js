import axiosInstance from "../Utils/axiosInstance";

const suburl = "/twilio";

export const getToken = () => axiosInstance.post(`${suburl}/token`);