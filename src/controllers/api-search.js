
const Product = require("../models/product");
class APISearch{

    //đọc tất cả các product
    async searchProduct(req,res){
        const searchKey = req.query.searchKey
        const page = req.query.page;
        const pageNumber = parseInt(page);
        console.log({searchKey, page})
        const limitNumber = 6;
        const skip = (pageNumber - 1) * limitNumber;
        try{
            const search = await Product.find({ten: {$regex: searchKey , $options: 'i'},soluong : {$gt: 0 } })
                                    .skip(skip)
                                    .limit(limitNumber);
            console.log(search)
            const totalProducts = await Product.countDocuments({ten: {$regex: searchKey , $options: 'i'},soluong : {$gt: 0 } });
            const totalPages = Math.ceil(totalProducts / limitNumber);
            res.status(200).json({search,totalPages});
        }catch(err){
            console.log(err)
        }
    }

}
module.exports =  new APISearch;