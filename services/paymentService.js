const moment = require("moment");
const crypto = require("crypto");
const qs = require("qs");
const { v4: uuidv4 } = require("uuid");
const Payment = require("../models/payment");
const { VNP_TMNCODE, VNP_HASHSECRET, VNP_URL, VNP_RETURNURL } = require("../config/env");

const createPayment = async (userId, amount) => {
    const transactionId = uuidv4();
    await Payment.create({ userId, amount, transactionId, status: "Pending" });

    const vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: VNP_TMNCODE,
        vnp_Amount: amount * 100,
        vnp_CurrCode: "VND",
        vnp_TxnRef: transactionId,
        vnp_OrderInfo: `Thanh toán đơn hàng ${transactionId}`,
        vnp_OrderType: "billpayment",
        vnp_Locale: "vn",
        vnp_ReturnUrl: VNP_RETURNURL,
        vnp_CreateDate: moment().format("YYYYMMDDHHmmss")
    };

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", VNP_HASHSECRET);
    vnp_Params["vnp_SecureHash"] = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    return `${VNP_URL}?${qs.stringify(vnp_Params)}`;
};

module.exports = { createPayment };
