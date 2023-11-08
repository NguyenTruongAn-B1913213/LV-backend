const { response } = require("express");
const { PromiseProvider } = require("mongoose");
const TinTuc = require("../models/tintuc");
class APItinTuc {
  async createdTinTuc(req, res) {
    try {
      const { tieuDe, img, noiDung } = req.body;

      // Kiểm tra xem title, content và author có tồn tại và không rỗng
      if (!tieuDe || !img || !noiDung) {
        return res
          .status(400)
          .json({ error: "Vui lòng nhập đầy đủ thông tin." });
      }
      const newNews = new TinTuc({
        tieuDe,
        img,
        noiDung,
      });
      const savedNews = await newNews.save();
      res.status(201).json(savedNews);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async getTinTuc(req, res) {
    try {
      const page = req.query.page;
      const pageNumber = parseInt(page);
      const limitNumber = 6;
      const skip = (pageNumber - 1) * limitNumber;
      const news = await TinTuc.find()
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNumber);
      const totalNews = await TinTuc.countDocuments();
      const totalPages = Math.ceil(totalNews / limitNumber);
      const response = {
        news,
        totalPages,
      };
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getTinTucWithID(req, res) {
    try {
      const newsId = req.params.newsId;
      if (!newsId) {
        return res
          .status(400)
          .json({ error: "Vui lòng cung cấp ID của tin tức." });
      }
      const news = await TinTuc.findById(newsId);
      if (!news) {
        return res.status(404).json({ error: "Không tìm thấy tin tức." });
      }
      res.status(200).json(news);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = new APItinTuc();
