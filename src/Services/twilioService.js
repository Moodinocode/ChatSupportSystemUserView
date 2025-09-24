import axiosInstance from "../Utils/axiosInstance";

const suburl = "/twilio";

export const getToken = () => axiosInstance.post(`${suburl}/token`);

export const getQuickReplyContent = () => qrp;

const qrp = {
    "account_sid": "ACe1fdea14abd3da9ce935055a542bde6b",
    "date_created": "2025-09-24T08:08:26Z",
    "date_updated": "2025-09-24T08:08:26Z",
    "friendly_name": "customer_satisfaction",
    "language": "en",
    "links": {
        "approval_create": "https://content.twilio.com/v1/Content/HXc8b73d1ab2d8fdf2f6e403a4610602af/ApprovalRequests/whatsapp",
        "approval_fetch": "https://content.twilio.com/v1/Content/HXc8b73d1ab2d8fdf2f6e403a4610602af/ApprovalRequests"
    },
    "sid": "HXc8b73d1ab2d8fdf2f6e403a4610602af",
    "types": {
        "twilio/quick-reply": {
            "actions": [
                {
                    "id": "unsatisfied",
                    "title": "Unsatisfied"
                },
                {
                    "id": "neutral",
                    "title": "Neutral"
                },
                {
                    "id": "satisfied",
                    "title": "Satisfied"
                }
            ],
            "body": "Hi {{1}}, thank you for contacting support. How satisfied are you with our service?"
        }
    },
    "url": "https://content.twilio.com/v1/Content/HXc8b73d1ab2d8fdf2f6e403a4610602af",
    "variables": {
        "1": "username"
    }
}