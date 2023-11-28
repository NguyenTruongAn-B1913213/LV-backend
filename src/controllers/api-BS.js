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
  async getnameBacSi(req, res) {
    try {
      const id = req.params.name;
      console.log(id);
      const doctor = await bacsi.findOne({
        name: new RegExp(req.params.name, "i"),
      });
      res.status(200).json(doctor);
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
          thu: "Thứ 2",
          ca: "Sáng",
          gioBatDau: "06:00",
          gioKetThuc: "07:",
        },
        {
          thu: "Thứ 3",
          ca: "Sáng",
          gioBatDau: "06:00",
          gioKetThuc: "07:",
        },
        {
          thu: "Thứ 4",
          ca: "Sáng",
          gioBatDau: "06:00",
          gioKetThuc: "07:",
        },
        {
          thu: "Thứ 5",
          ca: "Sáng",
          gioBatDau: "06:00",
          gioKetThuc: "07:",
        },
        {
          thu: "Thứ 6",
          ca: "Sáng",
          gioBatDau: "06:00",
          gioKetThuc: "07:",
        },
        {
          thu: "Thứ 7",
          ca: "Sáng",
          gioBatDau: "06:00",
          gioKetThuc: "07:",
        },
        {
          thu: "Chủ Nhật",
          ca: "Sáng",
          gioBatDau: "06:00",
          gioKetThuc: "07:",
        },
        // Ca Trưa từ thứ 2 đến Chủ Nhật
        {
          thu: "Thứ 2",
          ca: "Trưa",
          gioBatDau: "11:00",
          gioKetThuc: "12:30",
        },
        {
          thu: "Thứ 3",
          ca: "Trưa",
          gioBatDau: "11:00",
          gioKetThuc: "12:30",
        },
        {
          thu: "Thứ 4",
          ca: "Trưa",
          gioBatDau: "11:00",
          gioKetThuc: "12:30",
        },
        {
          thu: "Thứ 5",
          ca: "Trưa",
          gioBatDau: "11:00",
          gioKetThuc: "12:30",
        },
        {
          thu: "Thứ 6",
          ca: "Trưa",
          gioBatDau: "11:00",
          gioKetThuc: "12:30",
        },
        {
          thu: "Thứ 7",
          ca: "Trưa",
          gioBatDau: "11:00",
          gioKetThuc: "12:30",
        },
        {
          thu: "Chủ Nhật",
          ca: "Trưa",
          gioBatDau: "11:00",
          gioKetThuc: "12:30",
        },
        {
          thu: "Thứ 2",
          ca: "Tối",
          gioBatDau: "17:00",
          gioKetThuc: "20:30",
        },
        {
          thu: "Thứ 3",
          ca: "Tối",
          gioBatDau: "17:00",
          gioKetThuc: "20:30",
        },
        {
          thu: "Thứ 4",
          ca: "Tối",
          gioBatDau: "17:00",
          gioKetThuc: "20:30",
        },
        {
          thu: "Thứ 5",
          ca: "Tối",
          gioBatDau: "17:00",
          gioKetThuc: "20:30",
        },
        {
          thu: "Thứ 6",
          ca: "Tối",
          gioBatDau: "17:00",
          gioKetThuc: "20:30",
        },
        {
          thu: "Thứ 7",
          ca: "Tối",
          gioBatDau: "17:00",
          gioKetThuc: "20:30",
        },
        {
          thu: "Chủ Nhật",
          ca: "Tối",
          gioBatDau: "17:00",
          gioKetThuc: "20:30",
        },
      ];
      const promises = ngayLamViec.map(async (ngayLamViec) => {
        const newNgayLamViec = new lamviec(ngayLamViec);
        await newNgayLamViec.save();
      });
      await Promise.all(promises);

      res.status(201).json({ promises });
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
