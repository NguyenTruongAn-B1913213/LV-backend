const { response } = require("express");
const BacSi = require("../models/bacsi");
const ttUser = require("../models/ttUser");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { PromiseProvider } = require("mongoose");
const jwt = require("jsonwebtoken");
class APIUser {
  async registerBenhnhan(req, res) {
    try {
      const { email, password, ten, ngaySinh, gioiTinh, diaChi, soDienThoai } =
        req.body;
      if (
        !email ||
        !password ||
        !ten ||
        !ngaySinh ||
        !gioiTinh ||
        !diaChi ||
        !soDienThoai
      ) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập thông tin đầy đủ" });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Tài khoản đã được sử dụng" });
      }
      const newUser = new User({
        email,
        password: bcrypt.hashSync(password, 10),
      });
      await newUser.save();
      const newPatient = new ttUser({
        ten,
        ngaySinh,
        gioiTinh,
        diaChi,
        soDienThoai,
        idtk: newUser._id,
      });

      await newPatient.save();
      res.status(201).json(newPatient);
    } catch (e) {
      console.log(e);
    }
  }

  async registerBacSi(req, res) {
    try {
      const {
        email,
        password,
        tenBS,
        ngaySinh,
        chuyenKhoa,
        soDienThoai,
        tieusu,
      } = req.body;
      if (
        !email ||
        !password ||
        !tenBS ||
        !ngaySinh ||
        !chuyenKhoa ||
        !soDienThoai ||
        !tieusu ||
        !soDienThoai
      ) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập thông tin đầy đủ" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Tài khoản đã được sử dụng" });
      }
      const newUser = new User({
        email,
        password: bcrypt.hashSync(password, 10),
        role: "bacsi",
      });
      await newUser.save();
      const newDoctor = new BacSi({
        tenBS,
        ngaySinh,
        chuyenKhoa,
        soDienThoai,
        tieusu,
        idtk: newUser._id,
      });
      await newDoctor.save();
      res.status(201).json(newDoctor);
    } catch (error) {
      console.log(error);
    }
  }

  async login(req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        return res.status(500).json({
          message: "Lỗi server",
        });
      }
      if (!user) {
        return res.status(400).json({
          message: "Tài khoản không tồn tại",
        });
      }
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({
          message: "Mật khẩu không đúng",
        });
      }
      console.log(User);
      let token = jwt.sign(
        { UserId: user._id, role: user.role },
        "secret-key",
        { expiresIn: "7h" }
      );

      res.status(200).json({
        message: "Đăng nhập thành công",
        token,
      });
    });
  }
  async authenticateToken(req, res, next) {
    // console.log({ header: req.headers.authorization });
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Authentication token required." });
    }
    jwt.verify(token.split(" ")[1], "secret-key", (err, decodedToken) => {
      if (err) {
        // console.log(err);
        return res.status(404).json({ error: "Invalid token." });
      }
      req.UserId = decodedToken.UserId;
      req.Role = decodedToken.role;
      next();
    });
  }
  async profileUser(req, res) {
    try {
      const userId = req.UserId;
      const userRole = req.Role;
      if (userRole === "bacsi") {
        const doctor = await BacSi.findOne({ idtk: userId });
        if (!doctor) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy thông tin bác sĩ" });
        }
        return res.status(200).json({ doctor, userRole });
      } else {
        const doctor = await ttUser.findOne({ idtk: userId });
        if (!doctor) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy thông tin bệnh nhân" });
        }
        return res.status(200).json({ doctor, userRole });
      }
    } catch (error) {
      console.log(error);
    }
  }
  // authorizeAdmin(req, res, next) {
  //   if (req.user.role != "admin") {
  //     return res.status(403).json({ message: "không có quyền truy cập" });
  //   }
  //   next();
  // }
}
module.exports = new APIUser();
