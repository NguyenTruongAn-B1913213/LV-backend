const { response } = require("express");
const { PromiseProvider } = require("mongoose");
const LichKham = require("../models/lichkham");
const chuandoan = require("../models/chuandoan");
const BacSi = require("../models/bacsi");
const BenhNhan = require("../models/benhnhan");
class APIChuanDoan {
  async historyLK(req, res) {
    try {
      const maBacSi = req.params.id; // Assuming maBacSi is a parameter in the URL
      const bsID = await BacSi.findOne({ _id: maBacSi });
      if (!bsID) {
        console.log(1);
        return res.status(400).json({ error: "Bạn Không Phải Bác Sĩ" });
      }
      let today = new Date();
      today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00.000 để so sánh theo ngày.
      today = new Date().toISOString().slice(0, 10);
      const history = await LichKham.find({
        maBacSi: maBacSi,
        trangThai: "Đã Khám",
        // "ngaygioKham.ngay": { $gte: today }, // Lấy lịch khám từ hôm nay trở đi.
      }).sort({
        "ngaygioKham.ngay": -1, // Sắp xếp theo ngày tăng dần.
        "ngaygioKham.ca": -1, // (Tùy chọn) Sắp xếp theo ca nếu có.
      });
      const lichKhamWithBenhNhan = [];
      for (const lich of history) {
        const benhNhan = await BenhNhan.findOne({ _id: lich.maBenhNhan });

        if (benhNhan) {
          lichKhamWithBenhNhan.push({
            lichKham: lich,
            benhNhan: benhNhan,
            BacSi: bsID,
          });
        }
      }
      res.status(200).json(lichKhamWithBenhNhan);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  catch(error) {
    console.log(error);
  }
  async historyLKTime(req, res) {
    try {
      const maBacSi = req.params.id;
      const { day, month, year } = req.query; // Assuming maBacSi is a parameter in the URL
      console.log(maBacSi);
      console.log(req.query);
      const bsID = await BacSi.findOne({ _id: maBacSi });
      if (!bsID) {
        console.log(1);
        return res.status(400).json({ error: "Bạn Không Phải Bác Sĩ" });
      }
      let ngayBatDau, ngayKetThuc, history;
      if (day && month && year) {
        ngayBatDau = new Date(Date.UTC(year, month - 1, day));
        history = await LichKham.find({
          $and: [
            { maBacSi: maBacSi },
            { trangThai: "Đã Khám" },
            { "ngaygioKham.ngay": ngayBatDau.toISOString().split("T")[0] },
          ],
        }).sort({
          "ngaygioKham.ngay": -1, // Sắp xếp theo ngày tăng dần.
          "ngaygioKham.ca": -1, // (Tùy chọn) Sắp xếp theo ca nếu có.
        });
      } else if (month && year) {
        ngayBatDau = new Date(Date.UTC(year, month - 1, 0));
        const nextMonth = new Date(ngayBatDau);
        nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
        ngayKetThuc = new Date(nextMonth);
        ngayKetThuc.setUTCHours(23, 59, 59);
        console.log(ngayBatDau.toISOString());
        history = await LichKham.find({
          $and: [
            { maBacSi: maBacSi },
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
          ],
        }).sort({
          "ngaygioKham.ngay": -1, // Sắp xếp theo ngày tăng dần.
          "ngaygioKham.ca": -1, // (Tùy chọn) Sắp xếp theo ca nếu có.
        });
      } else {
        // Chỉ năm được cung cấp
        ngayBatDau = new Date(Date.UTC(year, 0, 1));
        ngayKetThuc = new Date(Date.UTC(year, 11, 31, 23, 59, 59)); // 23:59:59 cuối ngày 31/12
        history = await LichKham.find({
          $and: [
            { maBacSi: maBacSi },
            {
              "ngaygioKham.ngay": {
                $gte: ngayBatDau.toISOString(),
                $lte: ngayKetThuc.toISOString(),
              },
            },
            { trangThai: "Đã Khám" },
          ],
        });
      }
      const lichKhamWithBenhNhan = [];
      for (const lich of history) {
        const benhNhan = await BenhNhan.findOne({ _id: lich.maBenhNhan });
        if (benhNhan) {
          lichKhamWithBenhNhan.push({
            lichKham: lich,
            benhNhan: benhNhan,
            BacSi: bsID,
          });
        }
      }
      res.status(200).json(lichKhamWithBenhNhan);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
  catch(error) {
    console.log(error);
  }
  async ChuanDoanID(req, res) {
    try {
      const idLichKham = req.params.id;
      const diagnoses = await chuandoan.findOne({ malichkham: idLichKham });
      return res.status(200).json(diagnoses);
    } catch (error) {
      console.log(error);
    }
  }
  async ChuanDoan(req, res) {
    try {
      const { cannang, chieucao, BenhTinh, malichkham, maBN } = req.body;
      console.log(req.body);
      if (!cannang || !chieucao || !BenhTinh || !malichkham || !maBN) {
        return res.status(400).json({ error: "Vui lòng điền thông tin vào" });
      }
      const updatedLichKham = await LichKham.findByIdAndUpdate(
        malichkham,
        { trangThai: "Đã Khám" },
        { new: true }
      );
      const chuanDoan = new chuandoan({
        maBenhNhan: maBN,
        // maBacSi: 1,
        malichkham: malichkham,
        mabenhnhan: maBN,
        // maBacSi: { type: String, require: true },
        cannang: cannang,
        chieucao: chieucao,
        chuandoanbenh: BenhTinh,
      });
      await chuanDoan.save();
      return res.status(200).json(chuanDoan);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new APIChuanDoan();
