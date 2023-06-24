const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    masp: {type: String,require: true},
    ten: {type: String,require: true},
    mota: {type: String,require: true},
    hinhanh: {type: String,require: true},
    gia:{type: String,require: true},
    chatlieu:{type: String,require: true},
    gioitinh:{type: String,require: true},
    thuonghieu:{type: String, require: true},
    category:{type: String, require: true},
    xuatxu: {type: String,require: true},
    soluong: {type: Number, require: true},
    createAt: {type: Date ,default: Date.now},
    updateAt: {type: Date ,default: Date.now},
    deletedAt:{type: Date},
});
module.exports = mongoose.model("Product",productSchema);

