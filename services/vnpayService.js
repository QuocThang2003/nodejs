const crypto = require("crypto");
const querystring = require("qs");
require("dotenv").config();

const config = {
    vnp_TmnCode: process.env.VNP_TMNCODE,
    vnp_HashSecret: process.env.VNP_HASHSECRET,
    vnp_Url: process.env.VNP_URL,
    vnp_ReturnUrl: process.env.VNP_RETURNURL
};

if (!config.vnp_TmnCode || !config.vnp_HashSecret || !config.vnp_Url || !config.vnp_ReturnUrl) {
    throw new Error("Thiếu cấu hình VNPAY! Vui lòng kiểm tra .env");
}

exports.createPaymentUrl = async (paymentData) => {
    try {
        if (!paymentData || !paymentData.amount || !paymentData.orderId) {
            throw new Error("Thiếu dữ liệu thanh toán!");
        }

        const date = new Date();
        const createDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getMinutes().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;

        const params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: config.vnp_TmnCode,
            vnp_Amount: Math.round(paymentData.amount * 100), 
            vnp_CurrCode: "VND",
            vnp_TxnRef: paymentData.orderId,
            vnp_OrderInfo: `Thanh toán đơn hàng #${paymentData.orderId}`,
            vnp_OrderType: "other",
            vnp_Locale: "vn",
            vnp_ReturnUrl: config.vnp_ReturnUrl,
            vnp_IpAddr: "127.0.0.1",
            vnp_CreateDate: createDate
        };

        const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
            acc[key] = params[key];
            return acc;
        }, {});

        const signData = new URLSearchParams(sortedParams).toString();
        const hmac = crypto.createHmac("sha512", Buffer.from(config.vnp_HashSecret, "utf-8"));
        const signed = hmac.update(signData).digest("hex");

        return `${config.vnp_Url}?${signData}&vnp_SecureHash=${signed}`;
    } catch (error) {
        throw error;
    }
};