const productServices = require("../services/products.services");
const upload = require ("../middleware/product.upload");


exports.create = (req,res,next)=> {
    upload(req, res, function(err){
        if(err){
            next(err);
        }
        else {
            const path=
            req.file != undefined ? req.file.path.replace(/\\/g, "/") :"";

            var model = {
                productName: req.body.productName,
                catagory:req.body.catagory,
                productShortDescription: req.body.productShortDescription,
                productDescription: req.body.productDescription,
                productPrice: req.body.productPrice,
                productSalePrice: req.body.productSalePrice,
                productSKU: req.body.productSKU,
                productType:req.body.productType,
                stockStatus : req.body.stockStatus,
                productImage: path !=""? "/" + path: ""
            }
            productServices.createProduct(model,(error,results)=>{
                if(error){
                    return next(error);
                }
                else{
                    return  res.status(200).send({
                        message:"Done",
                        data:results
                    });
                }

            });
        }
    });
}
exports.findAll = (req, res, next) =>{
    var model  = {
        productName: req.query.productName,
        catagoryId: req.query.catagoryId,
        pageSize: req.query.pageSize,
        page: req.query.page
    };
    productServices.getProducts(model,(error,results)=>{
        if(error){
            return next(error);
        }
        else{
            return  res.status(200).send({
                message:"Done",
                data:results
            });
        }

    });
    
}
exports.findOne = (req, res, next) =>{
    var model  = {
        productName: req.query.productName,
    };
    productServices.getByproductId(model,(error,results)=>{
        if(error){
            return next(error);
        }
        else{
            return  res.status(200).send({
                message:"Done",
                data:results
            });
        }

    });
    
}
exports.update = (req,res,next)=> {
    upload(req, res, function(err){
        if(err){
            next(err);
        }
        else {
            const path=
            req.file != undefined ? req.file.path.replace(/\\/g, "/") :"";

            var model = {
                productId: req.params.id,
                productName: req.body.productName,
                catagory:req.body.catagory,
                productShortDescription: req.body.productShortDescription,
                productDescription: req.body,productDescription,
                productPrice: req.body.productPrice,
                productSalePrice: req.body.productSalePrice,
                productSKU: req.body.productSKU,
                productType:req.body.productType,
                stockStatus : req.body.stockStatus,
                productImage: path !=""? "/" + path: ""
            }
            productServices.updateProduct(model,(error,results)=>{
                if(error){
                    return next(error);
                }
                else{
                    return  res.status(200).send({
                        message:"Done",
                        data:results
                    });
                }

            });
        }
    });
}

exports.delete = (req, res, next) =>{
    var model  = {
        productName: req.query.productName,
    };
    productServices.deleteProduct(model,(error,results)=>{
        if(error){
            return next(error);
        }
        else{
            return  res.status(200).send({
                message:"Done",
                data:results
            });
        }

    });
    
}
