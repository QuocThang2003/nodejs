const Booking = require("../models/Booking");
const Tour = require("../models/tour");
const Payment = require("../models/payment");
const vnPayService = require("./vnpayService");
exports.getAllBookings = async () => {
    try {
        let bookings = await Booking.find()
            .populate({ path: "userId", select: "fullName" }) // Lấy tên đầy đủ từ User
            .populate({ path: "tourId", select: "tourName price" }) // Lấy tourName từ Tour
            .lean(); // Chuyển dữ liệu thành object thuần túy

        // Định dạng dữ liệu trả về
        bookings = bookings.map(booking => ({
            _id: booking._id,
            fullname: booking.userId?.fullName || "Unknown", // Lấy fullName
            tourName: booking.tourId?.tourName || "Unknown", // Lấy tourName
            price: booking.tourId?.price || 0, // Lấy giá tour
            total: booking.total,
            status: booking.status,
            bookingDate: booking.bookingDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }));

        return { status: 200, data: { message: "Lấy danh sách đặt tour thành công!", bookings } };
    } catch (error) {
        return { status: 500, data: { error: "Lỗi khi lấy danh sách đặt tour!" } };
    }
};


exports.getBookingById = async (bookingId) => {
    try {
        let booking = await Booking.findById(bookingId)
            .populate({ path: "userId", select: "fullName" }) // Lấy fullName từ User
            .populate({ path: "tourId", select: "tourName price" }) // Lấy tourName từ Tour
            .lean(); // Chuyển thành object thuần

        if (!booking) {
            return { status: 404, data: { error: "Không tìm thấy đơn đặt tour!" } };
        }

        // Định dạng lại dữ liệu
        booking = {
            _id: booking._id,
            fullname: booking.userId?.fullName || "Unknown", 
            tourName: booking.tourId?.tourName || "Unknown", 
            price: booking.tourId?.price || 0, // Lấy giá tour
            total: booking.total,
            status: booking.status,
            bookingDate: booking.bookingDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        };

        return { status: 200, data: { message: "Lấy thông tin đơn đặt tour thành công!", booking } };
    } catch (error) {
        return { status: 500, data: { error: "Lỗi khi lấy đơn đặt tour!" } };
    }
};

exports.createBooking = async (userId, tourId, quantity) => {
    if (!tourId || !quantity || quantity <= 0) {
        return { status: 400, data: { error: "Thông tin không hợp lệ!" } };
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
        return { status: 404, data: { error: "Tour không tồn tại!" } };
    }

    const total = tour.price * quantity;
    
    const newBooking = new Booking({
        userId,
        tourId,
        total
    });

    try {
        const savedBooking = await newBooking.save();

        // Tạo orderId duy nhất
        const orderId = `VN${Date.now()}`;

        // Tạo Payment record
        const newPayment = new Payment({
            bookingId: savedBooking._id,
            orderId,
            amount: total
        });

        await newPayment.save();

        // Gọi service để tạo URL thanh toán
        const paymentUrl = await vnPayService.createPaymentUrl({ orderId, amount: total });

        return { status: 201, data: { message: "Vui lòng thanh toán!", paymentUrl, bookingId: savedBooking._id } };
    } catch (error) {
        console.error("🔥 Lỗi khi đặt tour:", error.message);
        return { status: 500, data: { error: "Lỗi server khi đặt tour!" } };
    }
};


exports.cancelBooking = async (bookingId, userId) => {
    try {
        const booking = await Booking.findOne({ _id: bookingId, userId });

        if (!booking) {
            throw new Error("Không tìm thấy đơn đặt tour!");
        }

        if (booking.status !== "Pending") {
            throw new Error("Chỉ có thể hủy đơn đang chờ xử lý!");
        }

        booking.status = "Cancelled"; // Đánh dấu đơn đã bị hủy
        await booking.save();

        return { success: true, message: "Hủy đơn đặt tour thành công!" };
    } catch (error) {
        throw new Error(error.message);
    }
};
// Thêm hàm tính tổng total theo tháng (chỉ tính status: "Paid")
exports.getMonthlyTotal = async (year) => {
    try {
        // Sử dụng aggregation pipeline để nhóm theo tháng và tính tổng
        const monthlyData = await Booking.aggregate([
            {
                // Lọc các booking trong năm được chọn và có status "Paid"
                $match: {
                    bookingDate: {
                        $gte: new Date(year, 0, 1), // Ngày đầu tiên của năm
                        $lte: new Date(year, 11, 31) // Ngày cuối cùng của năm
                    },
                    status: "Paid" // Chỉ lấy booking đã thanh toán
                }
            },
            {
                // Nhóm theo tháng
                $group: {
                    _id: { $month: "$bookingDate" }, // Lấy tháng từ bookingDate
                    totalAmount: { $sum: "$total" } // Tính tổng total
                }
            },
            {
                // Sắp xếp theo tháng
                $sort: { "_id": 1 }
            }
        ]);

        // Tạo mảng 12 tháng với giá trị mặc định là 0
        const monthlyTotals = Array(12).fill(0);
        
        // Điền dữ liệu tổng vào các tháng tương ứng
        monthlyData.forEach(item => {
            monthlyTotals[item._id - 1] = item.totalAmount; // item._id là tháng (1-12), chuyển về index (0-11)
        });

        return { 
            status: 200, 
            data: { 
                message: "Lấy tổng doanh thu theo tháng thành công!", 
                year: year, 
                monthlyTotals: monthlyTotals 
            } 
        };
    } catch (error) {
        return { status: 500, data: { error: "Lỗi khi tính tổng doanh thu theo tháng!" } };
    }
};