const mongoose = require("mongoose");
async function connect() {
  try {
    mongoose.connect("mongodb://127.0.0.1:27017/luanvan", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("thanh cong");
  } catch (error) {
    console.log("thất bại");
  }
}
module.exports = { connect };
