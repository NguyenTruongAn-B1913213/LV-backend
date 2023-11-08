const { response } = require("express");
const { PromiseProvider } = require("mongoose");
const LichKham = require("../models/lichkham");
class APIThongKe {
  async getThongKeBS(req, res) {
    try {
      const idBacSi = "64fadd97d12b9319995a8a59"; // Giả sử bạn đã xác định thông tin bác sĩ qua middleware đăng nhập
      const { day, month, year } = req.query; // Lấy thông tin từ người dùng qua query parameters
      console.log(req.query);
      // Tạo các biến để lưu trữ ngày bắt đầu và ngày kết thúc
      let ngayBatDau, ngayKetThuc;

      if (day && month && year) {
        // Ngày, tháng và năm đều được cung cấp
        ngayBatDau = new Date(Date.UTC(year, month - 1, day));
        ngayKetThuc = new Date(Date.UTC(year, month - 1, day, 23, 59, 59)); // 23:59:59 cuối ngày
      } else if (month && year) {
        // Chỉ tháng và năm được cung cấp
        ngayBatDau = new Date(Date.UTC(year, month - 1, 1));
        const nextMonth = new Date(ngayBatDau);
        nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        ngayKetThuc = new Date(nextMonth - 1); // Ngày cuối cùng của tháng trước đó
        ngayKetThuc.setUTCHours(23, 59, 59); // 23:59:59 cuối ngày
      } else if (year) {
        // Chỉ năm được cung cấp
        ngayBatDau = new Date(Date.UTC(year, 0, 1));
        ngayKetThuc = new Date(Date.UTC(year, 11, 31, 23, 59, 59)); // 23:59:59 cuối ngày 31/12
      } else {
        // Trường hợp không có thông tin cụ thể, thống kê toàn bộ lịch khám
        ngayBatDau = new Date(0); // Bắt đầu từ "ngày 0" (01/01/1970)
        ngayKetThuc = new Date(); // Hiện tại
      }
      console.log(ngayBatDau);
      console.log(ngayKetThuc);

      // Truy vấn cơ sở dữ liệu để lấy danh sách lịch khám trong khoảng thời gian từ ngày bắt đầu đến ngày kết thúc
      const lichkhamTrongKhoangThoiGian = await LichKham.find({
        maBacSi: idBacSi,
        "ngaygioKham.ngay": {
          $gte: ngayBatDau.toISOString(),
          $lte: ngayKetThuc.toISOString(),
        },
      });

      const soLuongLichKham = lichkhamTrongKhoangThoiGian.length;

      res.json({ soLuongLichKham });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi khi thực hiện thống kê lịch khám" });
    }
  }
  async getThongKe(req, res) {
    try {
      const { day, month, year } = req.query; // Lấy thông tin từ người dùng qua query parameters
      // Tạo các biến để lưu trữ ngày bắt đầu và ngày kết thúc
      console.log(req.query);
      let ngayBatDau, ngayKetThuc, lichkhamTrongKhoangThoiGian;
      if (day && month && year) {
        // Ngày, tháng và năm đều được cung cấp
        ngayBatDau = new Date(Date.UTC(year, month - 1, day));
        ngayKetThuc = new Date(Date.UTC(year, month - 1, day, 23, 59, 59)); // 23:59:59 cuối ngày
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            {
              "ngaygioKham.ngay": ngayBatDau.toISOString().split("T")[0],
            },
            { trangThai: "Xác Nhận" },
          ],
        });
      } else if (month && year) {
        // Chỉ tháng và năm được cung cấp
        ngayBatDau = new Date(Date.UTC(year, month - 1, 1));
        const nextMonth = new Date(ngayBatDau);
        nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        ngayKetThuc = new Date(nextMonth - 1); // Ngày cuối cùng của tháng trước đó
        ngayKetThuc.setUTCHours(23, 59, 59); // 23:59:59 cuối ngày
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Xác Nhận" }, // Điều kiện trạng thái xác nhận
          ],
        });
      } else if (year) {
        // Chỉ năm được cung cấp
        ngayBatDau = new Date(Date.UTC(year, 0, 1));
        ngayKetThuc = new Date(Date.UTC(year, 11, 31, 23, 59, 59)); // 23:59:59 cuối ngày 31/12
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Xác nhận" }, // Điều kiện trạng thái xác nhận
          ],
        });
      } else {
        // Trường hợp không có thông tin cụ thể, thống kê toàn bộ lịch khám
        ngayBatDau = new Date(0); // Bắt đầu từ "ngày 0" (01/01/1970)
        ngayKetThuc = new Date(); // Hiện tại
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          "ngaygioKham.ngay": {
            $gte: ngayBatDau.toISOString(),
            $lte: ngayKetThuc.toISOString(),
          },
        });
      }

      // Truy vấn cơ sở dữ liệu để lấy danh sách lịch khám trong khoảng thời gian từ ngày bắt đầu đến ngày kết thúc

      const soLuongLichKham = lichkhamTrongKhoangThoiGian.length;

      res.json({ soLuongLichKham });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi khi thực hiện thống kê lịch khám" });
    }
  }
}
module.exports = new APIThongKe();
