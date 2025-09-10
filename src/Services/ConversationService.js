import axiosInstance from "../Utils/axiosInstance";

const suburl = "/v1/message/init";

export const initiateConversation = (message) =>  axiosInstance.post(`${suburl}`,  {message} )
