const { response } = require("express");
const { PromiseProvider } = require("mongoose");
const BenhNhan = require("../models/benhnhan");
class APIBN {
  async UpdateBN(req, res) {
    try {
      const bnId = req.params.id;
      const TTBN = req.body;
      if (!bnId) {
        return res
          .status(400)
          .json({ error: "Vui lòng cung cấp ID của bệnh nhân." });
      }
      const updatedPatient = await BenhNhan.findByIdAndUpdate(bnId, TTBN, {
        new: true,
      });
      if (!updatedPatient) {
        return res.status(404).json({ error: "Không tìm thấy bệnh nhân." });
      }

      res.status(200).json(updatedPatient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = new APIBN();
