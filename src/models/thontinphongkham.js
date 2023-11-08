const mongoose = require("mongoose");

const phongKhamSchema = mongoose.Schema({
  tenPhongKham: { type: String, require: true },
  diaChi: { type: String, require: true },
  soDienThoai: { type: String, require: true },
  giolamviec: { type: String, require: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});
module.exports = mongoose.model("PhongKham", phongKhamSchema);
