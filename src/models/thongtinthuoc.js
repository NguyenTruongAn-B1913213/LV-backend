const mongoose = require("mongoose");

const thuocSchema = mongoose.Schema({
  maThuoc: { type: String, required: true, unique: true },
  tenThuoc: { type: String, required: true },
  lieuLuong: { type: String, required: true },
  huongDanSuDung: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

module.exports = mongoose.model("Thuoc", thuocSchema);
