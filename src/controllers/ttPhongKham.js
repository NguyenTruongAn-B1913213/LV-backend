const { response } = require("express");
const { PromiseProvider } = require("mongoose");
const ttPhongKham = require("../models/thontinphongkham");
class APIttPhongKham {
  async createdttPhongKham(req, res) {
    try {
      const { tenPhongKham, ten, diaChi, soDienThoai, giolamviec } = req.body;

      // Create a new PhongKham document
      const newPhongKham = new ttPhongKham({
        tenPhongKham,
        ten,
        diaChi,
        soDienThoai,
        giolamviec,
      });

      // Save the new clinic information to the database
      await newPhongKham.save();

      res
        .status(201)
        .json({ message: "Clinic information added successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while adding clinic information" });
    }
  }
  async updateTTPhongKham(req, res) {
    try {
      const clinicId = req.params.id;
      const updatedClinicData = req.body;
      const updatedClinic = await ttPhongKham.findByIdAndUpdate(
        clinicId,
        updatedClinicData,
        { new: true }
      );

      if (!updatedClinic) {
        return res.status(404).json({ error: "Clinic not found" });
      }

      res.status(200).json(updatedClinic);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update clinic information" });
    }
  }
  async getIDPhongKham(req, res) {
    try {
      const id = req.params.id;
      const PhongKham = await ttPhongKham.findById({ _id: id });
      res.status(201).json(PhongKham);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async getPhongKham(req, res) {
    try {
      const PhongKham = await ttPhongKham.find();
      res.status(201).json(PhongKham);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
module.exports = new APIttPhongKham();
