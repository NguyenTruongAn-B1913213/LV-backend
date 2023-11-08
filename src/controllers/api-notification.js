const { response } = require("express");
const { PromiseProvider } = require("mongoose");
// const Notification = require("../models/notification");
const LichKham = require("../models/lichkham");
const BenhNhan = require("../models/benhnhan");
const BacSi = require("../models/bacsi");
const ToaThuoc = require("../models/toathuoc");
class APINotification {
  // async SaveNotification(req, res) {
  //   try {
  //     const newNotification = new Notification(req.body);
  //     const savedNotification = await newNotification.save();
  //     res.status(200).json(savedNotification);
  //   } catch (error) {
  //     res.status(500).json({ error: "Lỗi trong quá trình lưu thông báo" });
  //   }
  // }

  async GetNotification(req, res) {
    try {
      const idUser = req.headers.userid;
      const listNotification = await LichKham.find({
        tkid: idUser,
        trangThai: "Xác Nhận",
      }).sort({ createdAt: -1 });
      res.status(200).json(listNotification);
    } catch (error) {
      res.status(500).json({ error: "Lỗi trong quá trình lưu thông báo" });
    }
  }
  async CheckNotification(req, res) {
    try {
      const appointmentId = req.params.appointmentId;
      console.log(appointmentId);
      const Notification = await LichKham.findOne({
        _id: appointmentId,
      });
      const patient = await BenhNhan.findOne({ _id: Notification.maBenhNhan });
      const doctor = await BacSi.findOne({ _id: Notification.maBacSi });
      if (Notification.trangThaiNotification === false) {
        Notification.trangThaiNotification = true;
        await Notification.save();
      }
      if (!patient || !doctor) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy thông tin bệnh nhân hoặc bác sĩ" });
      }
      const appointmentDetails = {
        appointment: Notification,
        patient: patient,
        doctor: doctor,
      };
      res.status(200).json(appointmentDetails);
    } catch (error) {
      res.status(500).json({ error: "Lỗi trong quá trình lưu thông báo" });
    }
  }
  async CheckToaTHuoc(req, res) {
    try {
      const appointmentId = req.params.appointmentId;
      console.log(appointmentId);
      const Notification = await LichKham.findOne({
        _id: appointmentId,
      });
      const patient = await BenhNhan.findOne({ _id: Notification.maBenhNhan });
      const doctor = await BacSi.findOne({ _id: Notification.maBacSi });
      const toaThuoc = await ToaThuoc.findOne({
        maBenhNhan: Notification.maBenhNhan,
      });
      if (!patient || !doctor) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy thông tin bệnh nhân hoặc bác sĩ" });
      }
      const appointmentDetails = {
        appointment: Notification,
        patient: patient,
        doctor: doctor,
        toaThuoc,
      };
      res.status(200).json(appointmentDetails);
    } catch (error) {
      res.status(500).json({ error: "Lỗi trong quá trình lưu thông báo" });
    }
  }
}
module.exports = new APINotification();
