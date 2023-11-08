const mongoose = require("mongoose");
const ngayLamViecSchema = mongoose.Schema({
  thu: String,
  ca: String,
  gioBatDau: String,
  gioKetThuc: String,
});
module.exports = mongoose.model("ngayLamViec", ngayLamViecSchema);
