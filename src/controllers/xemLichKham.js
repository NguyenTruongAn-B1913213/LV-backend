const { response } = require("express");
const BacSi = require("../models/bacsi");
const benhnhan = require("../models/benhnhan");
const LichKham = require("../models/lichkham");
const { PromiseProvider } = require("mongoose");

class APIxemLichKham {
  async LichKhamBN(req, res) {
    try {
      const idBN = req.headers.userid;
      const lichkhamList = await LichKham.find({
        tkid: idBN,
      }).sort({ createdAt: -1 });
      if (!lichkhamList) {
        return res.status(404).json({ error: "Không tìm thấy lịch khám" });
      }
      const result = [];
      for (const lichkham of lichkhamList) {
        const benhNhan = await benhnhan.findOne({ _id: lichkham.maBenhNhan });
        const bacSi = await BacSi.findOne({ _id: lichkham.maBacSi });
        console.log(bacSi);
        if (benhNhan && bacSi) {
          const lichKhamWithBenhNhanandBS = {
            LichKham: lichkham,
            benhNhan: benhNhan,
            bacSi: bacSi,
          };
          // console.log(lichKhamWithBenhNhanandBS);
          result.push(lichKhamWithBenhNhanandBS);
        }
        if (result.length === 0) {
          return res
            .status(404)
            .json({ error: "Không tìm thấy thông tin bệnh nhân hoặc bác sĩ" });
        }
      }
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }
  async huyLichKham(req, res) {
    try {
      const lichKhamId = req.params.lichKhamId;
      console.log(lichKhamId);
      const updatedLichKham = await LichKham.findByIdAndUpdate(
        lichKhamId,
        { trangThai: "Hủy" },
        { new: true }
      );
      res.status(200).json(updatedLichKham);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
  }
}
module.exports = new APIxemLichKham();
