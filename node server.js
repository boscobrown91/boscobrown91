require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
async function getAccessToken() {
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString("base64");

    try {
        const response = await axios.get(url, {
            headers: { Authorization: `Basic ${auth}` }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting M-Pesa token:", error);
        return null;
    }
}


app.post("/mpesa/pay", async (req, res) => {
    const { phoneNumber, amount } = req.body;
    const token = await getAccessToken();

    if (!token) return res.status(500).json({ error: "Failed to authenticate M-Pesa API" });

    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const { SHORTCODE, PASSKEY, CALLBACK_URL } = process.env;
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
    const password = Buffer.from(SHORTCODE + PASSKEY + timestamp).toString("base64");

    const payload = {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: CALLBACK_URL,
        AccountReference: "Rent Payment",
        TransactionDesc: "Rent payment via M-Pesa"
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("STK Push Error:", error);
        res.status(500).json({ error: "Failed to initiate payment" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

