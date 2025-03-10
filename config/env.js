module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET,
    VNP_TMNCODE: process.env.VNP_TMNCODE,
    VNP_HASHSECRET: process.env.VNP_HASHSECRET,
    VNP_URL: process.env.VNP_URL,
    VNP_RETURNURL: process.env.VNP_RETURNURL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS
};
