const { response } = require("express");
const BacSi = require("../models/bacsi");
const LichKham = require("../models/lichkham");
const { PromiseProvider } = require("mongoose");
const BenhNhan = require("../models/benhnhan");
class APIxnLichKham {
  async LichKhamBS(req, res) {
    try {
      const idBS = req.headers.userid;
      const bsID = await BacSi.findOne({ _id: idBS });
      if (!bsID) {
        console.log(1);
        return res.status(400).json({ error: "Bạn Không Phải Bác Sĩ" });
      }
      let today = new Date();
      today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00.000 để so sánh theo ngày.
      today = new Date().toISOString().slice(0, 10);
      const lichkham = await LichKham.find({
        maBacSi: bsID._id,
        trangThai: "Xác Nhận",
        "ngaygioKham.ngay": { $gte: today }, // Lấy lịch khám từ hôm nay trở đi.
      }).sort({
        "ngaygioKham.ngay": 1, // Sắp xếp theo ngày tăng dần.
        "ngaygioKham.ca": 1, // (Tùy chọn) Sắp xếp theo ca nếu có.
      });
      const lichKhamWithBenhNhan = [];
      for (const lich of lichkham) {
        const benhNhan = await BenhNhan.findOne({ _id: lich.maBenhNhan });

        if (benhNhan) {
          lichKhamWithBenhNhan.push({
            lichKham: lich,
            benhNhan: benhNhan,
            BacSi: bsID,
          });
        }
      }
      res.status(200).json(lichKhamWithBenhNhan);
    } catch (error) {
      console.log(error);
    }
  }

  async xacNhanLichKham(req, res) {
    try {
      const LichKhamID = req.params.lichKhamId;
      const io = req.app.get("io");
      const getLichKham = await LichKham.findById(LichKhamID);

      if (getLichKham.trangThai === "Xác Nhận") {
        return res.status(404).json({ error: "Lịch Khám Đã Xác Nhận" });
      }
      const ngayKham = getLichKham.ngaygioKham.ngay;
      const caKham = getLichKham.ngaygioKham.ca;
      const appointmentsInSameDay = await LichKham.find({
        "ngaygioKham.ngay": ngayKham,
        "ngaygioKham.ca": caKham,
        trangThai: "Xác Nhận",
      });
      const soLuongCuocHen = appointmentsInSameDay.length;

      const stt = soLuongCuocHen + 1;
      const updatedLichKham = await LichKham.findByIdAndUpdate(
        LichKhamID,
        { trangThai: "Xác Nhận" },
        { new: true }
      );
      updatedLichKham.stt = stt;
      await updatedLichKham.save();
      // const benhNhan = await BenhNhan.findOne({
      //   _id: updatedLichKham.maBenhNhan,
      // });
      // if (benhNhan) {
      //   benhNhan.stt = stt;
      //   await benhNhan.save();
      // }
      // const tkid = updatedLichKham.tkid;
      // const data = {
      //   tkid,
      //   stt,
      //   LichKhamID,
      //   ngayKham: updatedLichKham.ngaygioKham.ngay,
      //   thu: updatedLichKham.ngaygioKham.thu,
      //   ca: updatedLichKham.ngaygioKham.ca,
      //   trangThai: false,
      // };
      const data = updatedLichKham;
      io.emit("xacNhanLichKham", data);
      res.status(200).json(updatedLichKham);
    } catch (error) {
      console.log(error);
    }
  }
  async detailLichKham(req, res) {
    try {
      const appointmentId = req.params.appointmentId;
      const appointment = await LichKham.findById(appointmentId); // appointmentId id lịch khám

      if (!appointment) {
        return res.status(404).json({ error: "Không tìm thấy lịch khám" });
      }

      // Fetch patient and doctor information
      const patient = await BenhNhan.findOne({ _id: appointment.maBenhNhan });
      const doctor = await BacSi.findOne({ _id: appointment.maBacSi });

      if (!patient || !doctor) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy thông tin bệnh nhân hoặc bác sĩ" });
      }

      // Combine appointment, patient, and doctor details
      const appointmentDetails = {
        appointment: appointment,
        patient: patient,
        doctor: doctor,
      };

      res.status(200).json(appointmentDetails);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }

  async getLichKham(req, res) {
    try {
      const page = req.query.page;
      const pageNumber = parseInt(page);
      const limitNumber = 2;
      const skip = (pageNumber - 1) * limitNumber;
      const getLichKham = await LichKham.find({ trangThai: "Đang Duyệt" })
        .sort({ "ngaygioKham.ngay": 1 })
        .skip(skip)
        .limit(limitNumber);
      const totalItems = await LichKham.countDocuments({
        trangThai: "Đang Duyệt",
      });
      const totalPages = Math.ceil(totalItems / limitNumber);
      const result = [];
      for (const lichkham of getLichKham) {
        const benhNhan = await BenhNhan.findOne({ _id: lichkham.maBenhNhan });
        const bacSi = await BacSi.findOne({ _id: lichkham.maBacSi });
        if (benhNhan && bacSi) {
          const lichKhamWithBenhNhanandBS = {
            LichKham: lichkham,
            benhNhan: benhNhan,
            bacSi: bacSi,
          };
          // console.log(lichKhamWithBenhNhanandBS);
          result.push(lichKhamWithBenhNhanandBS);
        }
      }
      res.status(200).json({ result, totalPages });
    } catch (error) {
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }
}
module.exports = new APIxnLichKham();
