const mongoose= require("mongoose");
const product = mongoose.model(
    "product",
    mongoose.Schema({
        productName:{
            type:String,
            required:true,
            unique : true,
        },
        catagory:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Catagory",  
        },
        productShortDescription:{
            type: String,
            required: false
        },
        productDescription:{
            type:String,
            required: false
        },
        productPrice:{
            type: Number,
            required: true,
        },
        productSalePrice:{
            type: Number,
            required: true,
            default:0
        },
        productImage:{
            type:String,
        },
        productSKU:{
            type: String,
            required: false,
        },
        productType:{
            type: String,
            required:true,
            default:"simple"
        },
        stockStatus:{
            type:String,
            default:"IN"
        },
    },
    {
        toJSON:{
            transform: function(doc,ret){
                ret.productId = ret._id.toString();
                delete ret._id;
                delete ret.v;
                

            }
        }
    })

);

module.exports ={
    product 
}