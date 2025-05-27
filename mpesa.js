const axios = require("axios");
require("dotenv").config();

async function getAccessToken() {
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    
    const { CONSUMER_KEY, CONSUMER_SECRET } = process.env;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });

        return response.data.access_token;
    } catch (error) {
        console.error("Error getting M-Pesa token:", error);
        return null;
    }
}

module.exports = { getAccessToken };
