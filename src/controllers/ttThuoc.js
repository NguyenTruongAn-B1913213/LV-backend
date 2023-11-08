const { response } = require("express");
const { PromiseProvider } = require("mongoose");
const Thuoc = require("../models/thongtinthuoc");
class APIttThuoc {
  async createdThuoc(req, res) {
    try {
      // Extract medicine data from the request body
      const { maThuoc, tenThuoc, lieuLuong, huongDanSuDung } = req.body;
      // Create a new medicine document
      const newThuoc = new Thuoc({
        maThuoc,
        tenThuoc,
        lieuLuong,
        huongDanSuDung,
      });

      // Save the new medicine to the database
      await newThuoc.save();

      // Send a success response
      res.status(201).json({ message: "Medicine added successfully" });
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while adding the medicine" });
    }
  }
  async getThuoc(req, res) {
    // const page = req.query.page;
    // const pageNumber = parseInt(page);
    // const limitNumber = 1;
    // const skip = (pageNumber - 1) * limitNumber;
    try {
      //   const allThuoc = await Thuoc.find().skip(skip).limit(limitNumber);
      // const totalpage = await Thuoc.countDocuments();
      const allThuoc = await Thuoc.find();
      // const totalPages = Math.ceil(totalpage / limitNumber);
      res.status(201).json({ allThuoc });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }
  async seachThuoc(req, res) {
    const searchKey = req.query.searchKey;
    const page = req.query.page;
    const pageNumber = parseInt(page);
    const limitNumber = 6;
    const skip = (pageNumber - 1) * limitNumber;
    try {
      const totalSearch = await Thuoc.find({
        tenThuoc: { $regex: searchKey, $options: "i" },
      })
        .skip(skip)
        .limit(limitNumber);
      const totalThuoc = await Thuoc.countDocuments({
        tenThuoc: { $regex: searchKey, $options: "i" },
      });
      const totalPages = Math.ceil(totalThuoc / limitNumber);
      res.status(200).json({ totalSearch, totalPages });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }
}
module.exports = new APIttThuoc();
