const mongoose = require("mongoose");
const gioKhamSchema = mongoose.Schema({
  ngay: { type: String, require: true },
  thu: { type: String, require: true },
  ca: { type: String, require: true },
});
const lichKhamSchema = mongoose.Schema({
  stt: { type: Number, require: true },
  maBenhNhan: { type: String, require: true },
  maBacSi: { type: String, require: true },
  tkid: { type: String, require: true },
  ngaygioKham: { type: gioKhamSchema },
  trieuchung: { type: String, require: true },
  trangThai: {
    type: String,
    enum: ["Hủy", "Xác Nhận", "Đang Duyệt", "Đã Khám"],
    default: "Đang Duyệt",
  },
  trangThaiNotification: { type: Boolean, default: false },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});
module.exports = mongoose.model("LichKham", lichKhamSchema);
