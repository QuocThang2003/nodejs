const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
};

const sendConfirmationEmail = async (email, fullName) => {
    const htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <div style="background: #007bff; color: white; padding: 15px; text-align: center;">
                <h2 style="margin: 0;">🎉 Chào mừng, ${fullName}!</h2>
            </div>
            <div style="padding: 20px; color: #333;">
                <p style="font-size: 16px;">Bạn đã đăng ký tài khoản thành công!</p>
                <p style="font-size: 16px;">Cảm ơn bạn đã tham gia cùng chúng tôi. Hãy đăng nhập và khám phá ngay!</p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${process.env.CLIENT_URL}/login" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Đăng nhập ngay</a>
                </div>
            </div>
            <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 14px; color: #666;">
                <p style="margin: 0;">&copy; 2025 Công ty Du Lịch ABC. Mọi quyền được bảo lưu.</p>
            </div>
        </div>
    `;

    await sendEmail(email, "🎉 Xác nhận đăng ký tài khoản", htmlContent);
};


const sendResetPasswordEmail = async (email, token) => {
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    
    const htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <div style="background: #dc3545; color: white; padding: 15px; text-align: center;">
                <h2 style="margin: 0;">🔐 Đặt lại mật khẩu</h2>
            </div>
            <div style="padding: 20px; color: #333;">
                <p style="font-size: 16px;">Chúng tôi nhận được yêu cầu đặt lại mật khẩu của bạn.</p>
                <p style="font-size: 16px;">Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
                <div style="text-align: center; margin-top: 20px;">
                    <a href="${resetLink}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Đặt lại mật khẩu</a>
                </div>
                <p style="margin-top: 20px; font-size: 14px; color: #666;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            </div>
            <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 14px; color: #666;">
                <p style="margin: 0;">&copy; 2025 Công ty Du Lịch ABC. Mọi quyền được bảo lưu.</p>
            </div>
        </div>
    `;

    await sendEmail(email, "🔐 Yêu cầu đặt lại mật khẩu", htmlContent);
};

// Gửi email thông báo thanh toán
const sendPaymentNotificationEmail = async (email, bookingId, bookingDate, total, status) => {
    const formattedDate = new Date(bookingDate).toLocaleString();
    const formattedTotal = total.toLocaleString() + " VND";
    
    const htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
            <div style="background: #007bff; color: white; padding: 15px; text-align: center;">
                <h2 style="margin: 0;">Thông Báo Thanh Toán</h2>
            </div>
            <div style="padding: 20px; color: #333;">
                <p style="font-size: 16px;">Xin chào,</p>
                <p style="font-size: 16px;">Đơn đặt chỗ của bạn đã được cập nhật trạng thái thanh toán.</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Mã đặt chỗ:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${bookingId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Ngày đặt:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${formattedDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Tổng tiền:</strong></td>
                        <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #28a745; font-weight: bold;">${formattedTotal}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px;"><strong>Trạng thái:</strong></td>
                        <td style="padding: 10px; color: ${status === "Paid" ? "#28a745" : "#dc3545"}; font-weight: bold;">${status}</td>
                    </tr>
                </table>
                <p style="margin-top: 20px; font-size: 16px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
            </div>
            <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 14px; color: #666;">
                <p style="margin: 0;">&copy; 2025 Công ty Du Lịch Quốc Thắng. Mọi quyền được bảo lưu.</p>
            </div>
        </div>
    `;

    await sendEmail(email, "Cập nhật trạng thái thanh toán", htmlContent);
};


module.exports = { sendConfirmationEmail, sendResetPasswordEmail, sendPaymentNotificationEmail };
