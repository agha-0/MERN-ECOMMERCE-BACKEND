// const { response } = require("express");
const {catagory} = require("../models/catagory.model");
const MONGO_DB_CONFIG = require("mongoose");

async function createCatagory(params,callback){

    if(!params.catagoryName){
        return callback(
            {
                message: "Catagory Name Required ",
            },
            ""
            );
    
    }

    const model = new catagory(params);
    model
    .save()
    .then((response)=>{
        return callback(null,response);

    })
    .catch((error)=>{
        return callback(error);
    });
    
}

async function getCatagories(params,callback) {
    const catagoryName = params.catagoryName;
    var condition = catagoryName
    ?{
        catagoryName:{$regex : new RegExp(catagoryName),$options:"i"},
    }
    :{};
    let perPage = Math.abs(params.pageSize) ||MONGO_DB_CONFIG.pageSize;
    let page = (Math.abs(params.page) ||  1 ) -1 ;
    catagory.find(condition, "catagoryName catagoryImage")
    .limit(perPage)
    .skip(perPage * page)
    .then((response)=>{
        return callback(null, response);
    })
    .catch ((error)=>{
        return callback(error);

    });
}

async function getCatagoryById(params,callback) {
    const catagoryId = params.catagoryId;
    
    catagory
    .findById(catagoryId)
    .then((response)=>{
        if(!response) callback("not found catagory with id"+ catagoryId);

        else  callback(null, response);
    })
    .catch ((error)=>{
        return callback(error);

    });
}

async function updateCatagory(params,callback) {
    const catagoryId = params.catagoryId;
    
    catagory
    .findByIdAndUpdate(catagoryId,params, {useFindAndModify : false})
    .then((response)=>{
        if(!response) callback("not found catagory with id"+ catagoryId);

        else  callback(null, response);
    })
    .catch ((error)=>{
        return callback(error);

    });
}

async function deleteCatagory(params,callback) {
    const catagoryId = params.catagoryId;
    
    catagory
    .findByIdAndDelete(catagoryId)
    .then((response)=>{
        if(!response) callback("not found catagory with id"+ catagoryId);

        else  callback(null, response);
    })
    .catch ((error)=>{
        return callback(error);

    });
}

module.exports = {
    createCatagory,
    getCatagories,
    getCatagoryById,
    updateCatagory,
    deleteCatagory
};
