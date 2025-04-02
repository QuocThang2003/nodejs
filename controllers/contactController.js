const contactService = require("../services/contactService");

// 📩 Người dùng gửi liên hệ
const sendContact = async (req, res) => {
    try {
        const contact = await contactService.sendContact(req.body);
        res.status(201).json({ message: "Gửi liên hệ thành công!", contact });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 🔍 Quản trị viên lấy danh sách tất cả liên hệ
const getAllContacts = async (req, res) => {
    try {
        const contacts = await contactService.getAllContacts();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách liên hệ!" });
    }
};

// 🔍 Quản trị viên lấy chi tiết liên hệ theo ID
const getContactById = async (req, res) => {
    try {
        const contact = await contactService.getContactById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: "Không tìm thấy liên hệ!" });
        }
        res.status(200).json(contact);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy chi tiết liên hệ!" });
    }
};

module.exports = { sendContact, getAllContacts, getContactById };
