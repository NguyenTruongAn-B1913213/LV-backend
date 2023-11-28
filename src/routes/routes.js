const express = require("express");
const { model } = require("mongoose");
const router = express.Router();
const user = require("../controllers/api-user");
const LichKham = require("../controllers/api-dk");
const LichKhamBS = require("../controllers/xnLichKham");
const LichKhamBN = require("../controllers/xemLichKham");
const Thuoc = require("../controllers/ttThuoc");
const toaThuoc = require("../controllers/toaThuoc");
const ttPhongKham = require("../controllers/ttPhongKham");
const BS = require("../controllers/api-BS");
const TinTuc = require("../controllers/tintuc");
const BN = require("../controllers/BN");
const Notification = require("../controllers/api-notification");
const Thongke = require("../controllers/Thongke");
const ChuanDoan = require("../controllers/api-chuandoan");
const { join } = require("path");
const chuandoan = require("../models/chuandoan");
// user.authenticateToken,user.authorizeAdmin,
// Bệnh Nhân
router.put("/benhNhan/lich-kham/update/:id", BN.UpdateBN);
// bac sĩ
router.get("/get-bacsi", BS.getBacSi);
router.get("/get-datework", BS.getNgayLamViec);
router.get("/getID-bacsi/:id", BS.getIDBacSi);
router.get("/getName-bacsi/:name", BS.getnameBacSi);
router.post("/lich-lam-viec", BS.createdNgayLamViec);
router.post("/them-lich-lam-viec/:id", BS.updateLichLamViec);
router.put("/admin/lich-kham/xac-nhan/:lichKhamId", LichKhamBS.xacNhanLichKham);
router.put("/admin/inforBS/:id", BS.updateinforBS);
// Lịch Khám
router.get("/bacsi/lich-kham", LichKhamBS.LichKhamBS);
router.get(
  "/benhnhan/lich-kham",
  // user.authenticateToken,
  LichKhamBN.LichKhamBN
);
router.get("/History/:id", ChuanDoan.historyLK);
router.get("/chuandoanLK/:id", ChuanDoan.ChuanDoanID);
router.get("/chuandoanLKTime/:id", ChuanDoan.historyLKTime);
router.post("/chuandoan", ChuanDoan.ChuanDoan);

router.get("/lichkham/:appointmentId", LichKhamBS.detailLichKham);

router.put("/benhnhan/lich-kham/huy/:lichKhamId", LichKhamBN.huyLichKham);
// thuốc
router.get("/thuoc", Thuoc.getThuoc);
router.get("/thuoc/search", Thuoc.seachThuoc);
router.post("/thuoc/create", Thuoc.createdThuoc);

// Toa thuốc
router.post("/create-prescription", toaThuoc.createdToaThuoc);
router.get("/prescriptions", user.authenticateToken, toaThuoc.getToaThuoc);
router.get("/get-prescription/:prescriptionId", toaThuoc.getToaThuocWithID);
// router.get("/prescriptions", user.authenticateToken, toaThuoc.getToaThuoc);
//Tin tức
router.get("/get-tintuc", TinTuc.getTinTuc);
router.post("/create-tintuc", TinTuc.createdTinTuc);
router.get("/get-tintuc/:id", TinTuc.getTinTucWithID);
// Thông tin phong khám
router.get("/phongkham", ttPhongKham.getPhongKham);
router.get("/get-phongkham/:id", ttPhongKham.getIDPhongKham);
router.post("/phongkham/create", ttPhongKham.createdttPhongKham);

router.put("/phongkham/update/:id", ttPhongKham.updateTTPhongKham);

router.post(
  "/lichkham",
  // user.authenticateToken,
  LichKham.registerLichKham
);
router.get("/get-LichKham", LichKhamBS.getLichKham);
// thông báo realtime
router.get("/get-notification", Notification.GetNotification);
router.get(
  "/check-notification/:appointmentId",
  Notification.CheckNotification
);
router.get("/check-toathuoc/:appointmentId", Notification.CheckToaTHuoc);
// Thống kê
router.get("/get-Thongke", Thongke.getThongKe);
router.get("/get-Thongke/BS", Thongke.getThongKeBS);
router.get("/get-Thongke/report", Thongke.getThongKeReport);
router.get("/get-Thongke/BS/report", Thongke.getThongKeBSReport);
// router.post("/save-notification", Notification.SaveNotification);

router.get("/user/profile", user.authenticateToken, user.profileUser);

router.post("/user/register", user.registerBenhnhan);
router.post("/user/register1", user.registerBacSi);
router.post("/user/login", user.login);

module.exports = router;
