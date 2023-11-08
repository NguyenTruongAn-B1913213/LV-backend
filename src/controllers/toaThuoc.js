const { response } = require("express");
const { PromiseProvider } = require("mongoose");
const Thuoc = require("../models/thongtinthuoc");
const ToaThuoc = require("../models/toathuoc");
const BacSi = require("../models/bacsi");
const ttUser = require("../models/ttUser");
class APItoaThuoc {
  async createdToaThuoc(req, res) {
    try {
      const userId = req.headers.userid;
      // const doctor = await BacSi.findOne({ _id: userId });
      const { maBenhNhan, ngayKeToa, danhSachThuoc } = req.body;
      const a = await ToaThuoc.findOne({ maBenhNhan: maBenhNhan });
      if (a) {
        return res.status(404).json({ message: "Lịch Khám đã có Toa Thuốc" });
      }

      // // Create a new prescription instance
      let Toathuoc = [];
      // // Add medicines to the prescription
      for (const medicine of danhSachThuoc) {
        Toathuoc.push(medicine);
      }
      const prescription = new ToaThuoc({
        maBenhNhan,
        maBacSi: userId,
        ngayKeToa,
        danhSachThuoc: Toathuoc,
      });
      // Save the prescription to the database
      await prescription.save();

      res.status(201).json({ success: true, prescription });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred." });
    }
  }
  async getToaThuoc(req, res) {
    try {
      const userId = req.UserId;
      const userRole = req.Role;
      let prescriptions;
      if (userRole === "bacsi") {
        const doctor = await BacSi.findOne({ idtk: userId });
        if (!doctor) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy thông tin bác sĩ" });
        }
        console.log(doctor._id);
        prescriptions = await ToaThuoc.find({ maBacSi: doctor._id });
      } else {
        const patient = await ttUser.findOne({ idtk: userId });
        if (!patient) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy thông tin bệnh nhân" });
        }
        prescriptions = await ToaThuoc.find({
          maBenhNhan: patient._id,
        });
      }
      // Return the prescriptions as JSON
      res.status(200).json(prescriptions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred." });
    }
  }
  async getToaThuocWithID(req, res) {
    try {
      const prescriptionId = req.params.prescriptionId;

      // Kiểm tra xem prescriptionId có hợp lệ không
      if (!prescriptionId) {
        return res
          .status(400)
          .json({ error: "Vui lòng cung cấp ID của toa thuốc." });
      }

      // Truy vấn toa thuốc dựa trên ID
      const prescription = await ToaThuoc.findById(prescriptionId);

      // Kiểm tra xem có toa thuốc nào được tìm thấy không
      if (!prescription) {
        return res.status(404).json({ error: "Không tìm thấy toa thuốc." });
      }

      res.status(200).json(prescription);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = new APItoaThuoc();
