const mongoose = require("mongoose");

const toaThuocSchema = mongoose.Schema({
  maToaThuoc: { type: String, require: true },
  maBenhNhan: { type: String, require: true },
  maBacSi: { type: String, require: true },
  ngayKeToa: { type: String, require: true },
  danhSachThuoc: [],
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});
module.exports = mongoose.model("ToaThuoc", toaThuocSchema);
