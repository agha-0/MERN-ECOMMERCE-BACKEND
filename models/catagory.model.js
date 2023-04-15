const mongoose = require("mongoose");

const catagory = mongoose.model(
    "Catagory",
    mongoose.Schema({
        catagoryName:{
            type:String,
            required :true,
            unique: true,
        },
        catagoryDescription:{
            type:String,
            required:false,
        },
        catagoryImage:{
            type:String,
        },
    },
    {
        toJSON:{
            transform: function(doc,ret){
                ret.catagoryId = ret._id.toString();
                delete ret._id;
                delete ret.v;
                

            },
        },
        
    }
    )
);
    module.exports ={
        catagory,

    };