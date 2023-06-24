const Product = require("../models/product");
class APIProduct{

    //đọc tất cả các product
    async show(req,res){
        const page = req.query.page;
        const pageNumber = parseInt(page);
        const limitNumber = 6;
        const skip = (pageNumber - 1) * limitNumber;
        try{
            const products = await Product.find({soluong : {$gt: 0 }}).skip(skip).limit(limitNumber);
            const totalProducts = await Product.countDocuments({soluong : {$gt: 0 }});
            const totalPages = Math.ceil(totalProducts / limitNumber);
            res.status(200).json({products, totalPages});
        }catch(err){
            res.status(404).json({message: err.message});
        }
    }
    async detail(req,res){
        const id = req.params.id;
        try {
            const product = await Product.findById(id)
            res.status(200).json(product);
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }

    async create(req,res){
        const product =  req.body;
        try {
            const data =  await Product.create(product);
            await data.save();
            res.status(200).json({message:"Thêm sản phẩm thành công"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }


    }
    //sửa thông tin sản phẩm
    async update(req,res){
        const id = req.params.id;
        console.log(id)
        const newProduct = req.body
        console.log(newProduct)
        try {
            const data = await Product.findByIdAndUpdate(id,newProduct)
            res.status(200).json({message:"Sửa thông tin sản phẩm thành công"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
    //xóa sản phẩm
    async delete(req, res){
        const id = req.params.id;
        console.log(id)
        try {
            const data = await Product.findByIdAndDelete(id);
            res.status(200).json({message:"Xóa sản phẩm thành công sản phẩm thành công"});
        } catch (err) {
            res.status(404).json({message: err.message});
        }
    }
    // xóa tất cả sản phẩm
    // async deleteALL(req,res){
    //     try {
    //         const product = await Product.deleteMany()
    //         console.log(product);
    //         res.status(200).json({message:"Xóa tất cả các sản phẩm"});
            
    //     } catch (err) {
    //         res.status(404).json({message: err.message});
    //     }
    // }
        //chi tiết product


}
module.exports =  new APIProduct;