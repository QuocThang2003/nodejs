require("dotenv").config();
const querystring = require("qs");
const crypto = require("crypto");
const moment = require("moment-timezone");


exports.createPaymentUrl = async (amount, req) => {
    const tmnCode = process.env.VNP_TMNCODE;
    const secretKey = process.env.VNP_HASHSECRET;
    const returnUrl = process.env.VNP_RETURNURL;

    // Lấy thời gian theo đúng format VNPay yêu cầu (YYYYMMDDHHmmss)
    const createDate = moment().tz("Asia/Ho_Chi_Minh").format("YYYYMMDDHHmmss");
    const orderId = createDate + Math.floor(Math.random() * 10000); // Tạo ID đơn hàng duy nhất

    let params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Amount: amount * 100, // VNPay yêu cầu đơn vị VND * 100
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toán đặt tour ID: ${orderId}`,
        vnp_OrderType: "other",
        vnp_Locale: "vn",
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: req.ip || "127.0.0.1",
        vnp_CreateDate: createDate
    };

    // 👉 Sắp xếp tham số theo thứ tự ASCII
    const sortedParams = Object.fromEntries(Object.entries(params).sort());

    // 👉 Tạo chuỗi ký (KHÔNG encode giá trị trước khi ký)
    const signData = querystring.stringify(sortedParams, { encode: false });

    // 👉 Debug: Kiểm tra dữ liệu trước khi hash
    console.log("🔹 Sign Data Before Hash:", signData);
    console.log("🔹 Secret Key:", secretKey);

    // 👉 Mã hóa SHA512
    const hmac = crypto.createHmac("sha512", Buffer.from(secretKey, "utf-8"));
    const signed = hmac.update(signData).digest("hex");

    // 👉 Gán hash vào params
    params.vnp_SecureHash = signed;

    // 👉 Tạo URL thanh toán
    const paymentUrl = process.env.VNP_URL + "?" + querystring.stringify(params, { encode: false });

    return paymentUrl;
};
