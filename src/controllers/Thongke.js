const { response } = require("express");
const { PromiseProvider } = require("mongoose");
const LichKham = require("../models/lichkham");
const BacSi = require("../models/bacsi");
const BenhNhan = require("../models/benhnhan");
class APIThongKe {
  async getThongKeBS(req, res) {
    try {
      // Giả sử bạn đã xác định thông tin bác sĩ qua middleware đăng nhập
      const { day, month, year, idBacSi } = req.query;
      console.log(req.query); // Lấy thông tin từ người dùng qua query parameters
      let ngayBatDau, ngayKetThuc, lichkhamTrongKhoangThoiGian;
      if (day && month && year) {
        console.log(1);
        ngayBatDau = new Date(Date.UTC(year, month - 1, day));
        ngayKetThuc = new Date(Date.UTC(year, month - 1, day, 23, 59, 59)); // 23:59:59 cuối ngày
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            { maBacSi: idBacSi },
            { "ngaygioKham.ngay": ngayBatDau.toISOString().split("T")[0] },
            { trangThai: "Đã Khám" },
          ],
        });
        // Ngày, tháng và năm đều được cung cấp
      } else if (month && year) {
        ngayBatDau = new Date(Date.UTC(year, month - 1, 0));
        const nextMonth = new Date(ngayBatDau);
        nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        ngayKetThuc = new Date(nextMonth);
        ngayKetThuc.setUTCHours(23, 59, 59);
        console.log(ngayBatDau.toISOString());
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            { maBacSi: idBacSi },
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
          ],
        });
      } else if (year) {
        // Chỉ năm được cung cấp
        ngayBatDau = new Date(Date.UTC(year, 0, 1));
        ngayKetThuc = new Date(Date.UTC(year, 11, 31, 23, 59, 59)); // 23:59:59 cuối ngày 31/12
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            { maBacSi: idBacSi },
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
          ],
        });
      } else {
        // Trường hợp không có thông tin cụ thể, thống kê toàn bộ lịch khám
        ngayBatDau = new Date(0); // Bắt đầu từ "ngày 0" (01/01/1970)
        ngayKetThuc = new Date(); // Hiện tại
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            { maBacSi: idBacSi },
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
          ],
        });
      }

      // Truy vấn cơ sở dữ liệu để lấy danh sách lịch khám trong khoảng thời gian từ ngày bắt đầu đến ngày kết thú
      const soLuongLichKham = lichkhamTrongKhoangThoiGian.length;

      res.json({ soLuongLichKham });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi khi thực hiện thống kê lịch khám" });
    }
  }
  async getThongKeBSReport(req, res) {
    try {
      // Giả sử bạn đã xác định thông tin bác sĩ qua middleware đăng nhập
      const { day, month, year, idBacSi } = req.query;
      console.log(req.query); // Lấy thông tin từ người dùng qua query parameters
      const bsID = await BacSi.findOne({ _id: idBacSi });
      if (!bsID) {
        console.log(1);
        return res.status(400).json({ error: "Bạn Không Phải Bác Sĩ" });
      }
      let ngayBatDau, ngayKetThuc, lichkhamTrongKhoangThoiGian;
      if (day && month && year) {
        console.log(1);
        ngayBatDau = new Date(Date.UTC(year, month - 1, day));
        ngayKetThuc = new Date(Date.UTC(year, month - 1, day, 23, 59, 59)); // 23:59:59 cuối ngày
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            { maBacSi: idBacSi },
            { "ngaygioKham.ngay": ngayBatDau.toISOString().split("T")[0] },
            { trangThai: "Đã Khám" },
          ],
        });
        // Ngày, tháng và năm đều được cung cấp
      } else if (month && year) {
        ngayBatDau = new Date(Date.UTC(year, month - 1, 0));
        const nextMonth = new Date(ngayBatDau);
        nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        ngayKetThuc = new Date(nextMonth);
        ngayKetThuc.setUTCHours(23, 59, 59);
        console.log(ngayBatDau.toISOString());
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            { maBacSi: idBacSi },
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
          ],
        });
      } else if (year) {
        // Chỉ năm được cung cấp
        ngayBatDau = new Date(Date.UTC(year, 0, 1));
        ngayKetThuc = new Date(Date.UTC(year, 11, 31, 23, 59, 59)); // 23:59:59 cuối ngày 31/12
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            { maBacSi: idBacSi },
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
          ],
        });
      } else {
        // Trường hợp không có thông tin cụ thể, thống kê toàn bộ lịch khám
        ngayBatDau = new Date(0); // Bắt đầu từ "ngày 0" (01/01/1970)
        ngayKetThuc = new Date(); // Hiện tại
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            { maBacSi: idBacSi },
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
          ],
        });
      }

      // Truy vấn cơ sở dữ liệu để lấy danh sách lịch khám trong khoảng thời gian từ ngày bắt đầu đến ngày kết thú
      const soLuongLichKham = lichkhamTrongKhoangThoiGian;
      const lichKhamWithBenhNhan = [];
      for (const lich of soLuongLichKham) {
        const benhNhan = await BenhNhan.findOne({
          _id: lich.maBenhNhan,
        });
        if (benhNhan) {
          lichKhamWithBenhNhan.push({
            lichKham: lich,
            benhNhan: benhNhan,
            BacSi: bsID,
          });
        }
      }
      res.json({ lichKhamWithBenhNhan, bsID });
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
        console.log(1);
        // Ngày, tháng và năm đều được cung cấp
        ngayBatDau = new Date(Date.UTC(year, month - 1, day));
        ngayKetThuc = new Date(Date.UTC(year, month - 1, day, 23, 59, 59)); // 23:59:59 cuối ngày
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            {
              "ngaygioKham.ngay": ngayBatDau.toISOString().split("T")[0],
            },
            { trangThai: "Đã Khám" },
          ],
        });
      } else if (month && year) {
        // Chỉ tháng và năm được cung cấp
        ngayBatDau = new Date(Date.UTC(year, month - 1, 0));
        const nextMonth = new Date(ngayBatDau);
        nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        ngayKetThuc = new Date(nextMonth);
        ngayKetThuc.setUTCHours(23, 59, 59);
        console.log(ngayBatDau.toISOString());
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
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
            { trangThai: "Đã Khám" },
          ],
        });
      } else {
        // Trường hợp không có thông tin cụ thể, thống kê toàn bộ lịch khám
        ngayBatDau = new Date(0); // Bắt đầu từ "ngày 0" (01/01/1970)
        ngayKetThuc = new Date(); // Hiện tại
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
          ],
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
  async getThongKeReport(req, res) {
    try {
      const { day, month, year } = req.query; // Lấy thông tin từ người dùng qua query parameters
      // Tạo các biến để lưu trữ ngày bắt đầu và ngày kết thúc
      console.log(req.query);
      let ngayBatDau, ngayKetThuc, lichkhamTrongKhoangThoiGian;
      if (day && month && year) {
        console.log(1);
        // Ngày, tháng và năm đều được cung cấp
        ngayBatDau = new Date(Date.UTC(year, month - 1, day));
        ngayKetThuc = new Date(Date.UTC(year, month - 1, day, 23, 59, 59)); // 23:59:59 cuối ngày
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            {
              "ngaygioKham.ngay": ngayBatDau.toISOString().split("T")[0],
            },
            { trangThai: "Đã Khám" },
          ],
        });
      } else if (month && year) {
        // Chỉ tháng và năm được cung cấp
        ngayBatDau = new Date(Date.UTC(year, month - 1, 0));
        const nextMonth = new Date(ngayBatDau);
        nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        ngayKetThuc = new Date(nextMonth);
        ngayKetThuc.setUTCHours(23, 59, 59);
        console.log(ngayBatDau.toISOString());
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
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
            { trangThai: "Đã Khám" },
          ],
        });
      } else {
        // Trường hợp không có thông tin cụ thể, thống kê toàn bộ lịch khám
        ngayBatDau = new Date(0); // Bắt đầu từ "ngày 0" (01/01/1970)
        ngayKetThuc = new Date(); // Hiện tại
        lichkhamTrongKhoangThoiGian = await LichKham.find({
          $and: [
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
          ],
        });
      }
      // Truy vấn cơ sở dữ liệu để lấy danh sách lịch khám trong khoảng thời gian từ ngày bắt đầu đến ngày kết thúc
      const soLuongLichKham = lichkhamTrongKhoangThoiGian;
      const lichKhamWithBenhNhan = [];
      for (const lich of soLuongLichKham) {
        const benhNhan = await BenhNhan.findOne({
          _id: lich.maBenhNhan,
        });
        const bacsi = await BacSi.findOne({ _id: lich.maBacSi });
        if (benhNhan) {
          lichKhamWithBenhNhan.push({
            lichKham: lich,
            benhNhan: benhNhan,
            bacsi: bacsi,
          });
        }
      }
      res.json({ lichKhamWithBenhNhan });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Lỗi khi thực hiện thống kê lịch khám" });
    }
  }
}
module.exports = new APIThongKe();
