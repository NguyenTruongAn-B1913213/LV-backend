const mongoose = require("mongoose");
const bacSiSchema = mongoose.Schema({
  tenBS: { type: String, required: true },
  idtk: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  chuyenKhoa: { type: String, required: true },
  ngaySinh: { type: String, required: true },
  soDienThoai: { type: String, required: true },
  tieusu: { type: String, required: true },
  ngayLamViec: [{ type: mongoose.Schema.Types.ObjectId, ref: "NgayLamViec" }],
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

module.exports = mongoose.model("BacSi", bacSiSchema);
