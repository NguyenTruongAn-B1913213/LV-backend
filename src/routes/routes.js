const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const io = require('socket.io')();
const product = require("../controllers/api-product");
const user = require("../controllers/api-user");
const category = require("../controllers/api-category");
const search = require("../controllers/api-search")
const delivery = require("../controllers/api-delivery")

router.get("/",user.authenticateToken,user.authorizeAdmin,product.show);
router.get("/danhmuc",category.showcategory);
router.get("/search",search.searchProduct);
// router.get("/phanloai/nam",category.categorynam);
// router.get("/phanloai/nu",category.categorynu);
// router.get("/phanloai/doi",category.categorydoi);
router.get("/:id",product.detail);
router.get("/danhmuc/:category",category.detailcategory);


router.post("/",product.create);
router.post("/delivery",delivery.Delivery);
router.put("/delivery/:id/status",delivery.updateSatus)
router.patch("/:id",product.update);
router.delete("/:id",product.delete);
router.post("/danhmuc",category.createcategory);
router.patch("/danhmuc/:id",category.updatecategory);
router.delete("/danhmuc/:id",category.deletecategory);

router.post("/user/register",user.register);
router.post("/user/login",user.login);


module.exports = router;