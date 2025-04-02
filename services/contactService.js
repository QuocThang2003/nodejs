const Contact = require("../models/contact");

// Người dùng gửi liên hệ
const sendContact = async (data) => {
    return await Contact.create(data);
};

// Quản trị viên lấy danh sách tất cả liên hệ
const getAllContacts = async () => {
    return await Contact.find().sort({ createdAt: -1 });
};

// Quản trị viên lấy chi tiết liên hệ theo ID
const getContactById = async (id) => {
    return await Contact.findByIdAndUpdate(id, { status: "read" }, { new: true });
};

module.exports = { sendContact, getAllContacts, getContactById };
