const mongoose = require("mongoose");

const ttUserSchema = mongoose.Schema({
  ten: { type: String, require: true },
  idtk: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ngaySinh: { type: Date, require: true },
  gioiTinh: { type: String, require: true },
  diaChi: { type: String, require: true },
  soDienThoai: { type: String, require: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});
module.exports = mongoose.model("ttUser", ttUserSchema);
