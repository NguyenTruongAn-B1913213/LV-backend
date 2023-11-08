const mongoose = require("mongoose");

const tinTucSchema = mongoose.Schema({
  // maTinTuc: { type: String, require: true },
  tieuDe: { type: String, require: true },
  img: { type: String, require: true },
  noiDung: { type: String, require: true },
  ngayDang: { type: Date, default: Date.now },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});
module.exports = mongoose.model("TinTuc", tinTucSchema);
