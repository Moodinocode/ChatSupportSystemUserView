import axiosInstance from "../Utils/axiosInstance";
import { quickReplyContent } from "../fixtures/quickReplyContent";

const suburl = "/twilio";

export const getToken = () => axiosInstance.get(`${suburl}/token`);

export const getQuickReplyContent = () => quickReplyContent;
