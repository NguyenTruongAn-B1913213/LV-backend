const { response } = require("express");
const BacSi = require("../models/bacsi");
const BenhNhan = require("../models/benhnhan");
const LichKham = require("../models/lichkham");
const { PromiseProvider } = require("mongoose");
class APILichKham {
  async registerLichKham(req, res) {
    try {
      const userId = req.headers.userid;
      const {
        idBS,
        ngaygioKham,
        madinhdanh,
        ten,
        ngaySinh,
        gioiTinh,
        diaChi,
        soDienThoai,
        trieuchung,
      } = req.body;
      console.log(req.body);
      if (
        !idBS ||
        !ngaygioKham ||
        !madinhdanh ||
        !ten ||
        !ngaySinh ||
        !gioiTinh ||
        !diaChi ||
        !soDienThoai
      ) {
        console.log(1);
        return res
          .status(400)
          .json({ message: "Vui lòng nhập thông tin đầy đủ" });
      }

      const daysOfWeek = [
        "Chủ Nhật",
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
      ];
      const selectedDayIndex = daysOfWeek.indexOf(ngaygioKham.thu);
      if (selectedDayIndex === -1) {
        return res.status(400).json({ message: "Ngày không hợp lệ" });
      }
      const today = new Date();
      const currentDayIndex = today.getDay();
      let daysToAdd =
        selectedDayIndex >= currentDayIndex
          ? selectedDayIndex - currentDayIndex
          : 7 - currentDayIndex + selectedDayIndex;
      if (selectedDayIndex === currentDayIndex) {
        daysToAdd += 7;
      }
      const selectedDate = new Date(today);
      selectedDate.setDate(today.getDate() + daysToAdd);
      const ngayKham = selectedDate.toISOString().split("T")[0];

      // Kiểm tra xem ngày đó có phải là ngày tiếp theo hay không
      // const latestAppointment = await LichKham.findOne().sort({ createAt: -1 });
      // if (
      //   latestAppointment !== null &&
      //   latestAppointment.ngaygioKham.ca === ngaygioKham.ca &&
      //   latestAppointment.ngaygioKham.ngay === ngayKham
      // ) {
      //   // Nếu không có lịch khám trước đó hoặc ngày khám mới, tăng số `stt` lên một
      //   newStt++;
      // } else {
      //   // Nếu ngày đó là ngày tiếp theo, đặt số `stt` thành 1
      //   newStt = 1;
      // }
      // // Kiểm tra số lượng lịch khám đã được đặt trong ngày đó
      const appointmentsInSameDay = await LichKham.find({
        $and: [
          { "ngaygioKham.ca": ngaygioKham.ca },
          { "ngaygioKham.ngay": ngayKham },
        ],
      });
      console.log(appointmentsInSameDay);
      // // Đặt giới hạn số lượng lịch khám trong một ngày
      const maxAppointmentsPersession = 200; // Số lượng tối đa cho ví dụ
      if (appointmentsInSameDay.length >= maxAppointmentsPersession) {
        console.log(2);
        // Nếu đã quá đông người bệnh đặt lịch trong ngày đó, từ chối đặt lịch
        return res
          .status(400)
          .json({ error: "Buổi đã quá đông người bệnh đặt lịch" });
      }
      const newBenhNhan = new BenhNhan({
        // stt: newStt, // Gán giá trị `stt` mới
        madinhdanh,
        ten,
        ngaySinh,
        gioiTinh,
        diaChi,
        soDienThoai,
      });
      const newsbenhnhan = await newBenhNhan.save();
      const bacSi = await BacSi.findById(idBS);
      if (!bacSi) {
        console.log(3);
        return res.status(400).json({ error: "Bác sĩ không tồn tại" });
      }
      const lichkham = new LichKham({
        maBenhNhan: newsbenhnhan._id,
        maBacSi: idBS,
        tkid: userId,
        ngaygioKham: {
          ngay: ngayKham,
          thu: ngaygioKham.thu,
          ca: ngaygioKham.ca,
        },
        trieuchung,
      });
      await lichkham.save();
      return res.status(200).json(lichkham);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "Đã xảy ra lỗi trong quá trình xử lý" });
    }
  }

  // quá đông
  // chuyển giờ thành option
  //trả về người dùng stt bệnh nhân
}
module.exports = new APILichKham();
