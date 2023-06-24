
const Product = require("../models/product");
class APISearch{

    //đọc tất cả các product
    async searchProduct(req,res){
        const searchKey = req.query.searchKey
        try{
            const search = await Product.find({ten: {$regex: searchKey , $options: 'i'}});
            res.status(200).json(search);
        }catch(err){
            res.status(404).json({message: err.message});
        }
    }

}
module.exports =  new APISearch;