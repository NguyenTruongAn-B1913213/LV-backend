const { response } = require("express");
const { PromiseProvider } = require("mongoose");
const TinTuc = require("../models/tintuc");
const bacsi = require("../models/bacsi");
const lamviec = require("../models/ngayLamViec");
class APIBacSi {
  async getBacSi(req, res) {
    try {
      const getBS = await bacsi.find();

      res.status(201).json(getBS);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async getIDBacSi(req, res) {
    try {
      const id = req.params.id;
      const idDoctor = await bacsi.findById({ _id: id });
      res.status(201).json(idDoctor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateLichLamViec(req, res) {
    try {
      const { id } = req.params;
      const { idLamViec } = req.body;
      const bacSi = await bacsi.findById(id);
      if (!bacSi) {
        return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
      }
      bacSi.ngayLamViec = [];
      // Kiểm tra và thêm buổi làm việc
      idLamViec.forEach((lichLamViec) => {
        bacSi.ngayLamViec.push(lichLamViec);
      });
      console.log(bacSi.ngayLamViec);
      // // Lưu lại thông tin bác sĩ đã được cập nhật
      await bacSi.save();

      return res.status(201).json({
        message: "Thêm lịch làm việc thành công",
        ngayLamViec: bacSi.ngayLamViec,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }
  async createdNgayLamViec(req, res) {
    try {
      const ngayLamViec = [
        // Ca sáng từ thứ 2 đến Chủ Nhật
        {
          thu: "Thứ Hai",
          ca: "Sáng",
          gioBatDau: "07:00",
          gioKetThuc: "11:00",
        },
        {
          thu: "Thứ Ba",
          ca: "Sáng",
          gioBatDau: "07:00",
          gioKetThuc: "11:00",
        },
        {
          thu: "Thứ Tư",
          ca: "Sáng",
          gioBatDau: "07:00",
          gioKetThuc: "11:00",
        },
        {
          thu: "Thứ Năm",
          ca: "Sáng",
          gioBatDau: "07:00",
          gioKetThuc: "11:00",
        },
        {
          thu: "Thứ Sáu",
          ca: "Sáng",
          gioBatDau: "07:00",
          gioKetThuc: "11:00",
        },
        {
          thu: "Thứ Bảy",
          ca: "Sáng",
          gioBatDau: "07:00",
          gioKetThuc: "11:00",
        },
        {
          thu: "Chủ Nhật",
          ca: "Sáng",
          gioBatDau: "07:00",
          gioKetThuc: "11:00",
        },
        // Ca chiều từ thứ 2 đến Chủ Nhật
        {
          thu: "Thứ Hai",
          ca: "Chiều",
          gioBatDau: "13:00",
          gioKetThuc: "17:00",
        },
        {
          thu: "Thứ Ba",
          ca: "Chiều",
          gioBatDau: "13:00",
          gioKetThuc: "17:00",
        },
        {
          thu: "Thứ Tư",
          ca: "Chiều",
          gioBatDau: "13:00",
          gioKetThuc: "17:00",
        },
        {
          thu: "Thứ Năm",
          ca: "Chiều",
          gioBatDau: "13:00",
          gioKetThuc: "17:00",
        },
        {
          thu: "Thứ Sáu",
          ca: "Chiều",
          gioBatDau: "13:00",
          gioKetThuc: "17:00",
        },
        {
          thu: "Thứ Bảy",
          ca: "Chiều",
          gioBatDau: "13:00",
          gioKetThuc: "17:00",
        },
        {
          thu: "Chủ Nhật",
          ca: "Chiều",
          gioBatDau: "13:00",
          gioKetThuc: "17:00",
        },
      ];
      const promises = ngayLamViec.map(async (ngayLamViec) => {
        const newNgayLamViec = new lamviec(ngayLamViec);
        await newNgayLamViec.save();
      });
      await Promise.all(promises);

      res.status(201).json(result);
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while adding the medicine" });
    }
  }
  async getNgayLamViec(req, res) {
    try {
      const Date = await lamviec.find();
      res.status(201).json(Date);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async updateinforBS(req, res) {
    try {
      const updatedBacSi = await bacsi.findByIdAndUpdate(
        req.params.id,
        req.body, // req.body chứa dữ liệu mới cần sửa
        { new: true } // Trả về bản ghi đã cập nhật
      );
      res.status(200).json(updatedBacSi);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Đã xảy ra lỗi khi cập nhật thông tin bác sĩ." });
    }
  }
}
module.exports = new APIBacSi();
