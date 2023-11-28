const mongoose = require("mongoose");

const chuandoanSchema = mongoose.Schema({
  malichkham: { type: String, require: true },
  mabenhnhan: { type: String, require: true },
  maBacSi: { type: String, require: true },
  cannang: { type: String, require: true },
  chieucao: { type: String, require: true },
  chuandoanbenh: { type: String, require: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});
module.exports = mongoose.model("ChuanDoan", chuandoanSchema);
