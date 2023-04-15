const { product } = require("../models/product.model");
const { catagory } = require("../models/catagory.model");
const { MONGO_DB_CONFIG } = require("../config/app.config");


async function createProduct(params, callback) {
    if (!params.productName) {
        return callback(
            {
                message: "Product Name is Required",
            },
            ""
        );
    }

    if (!params.catagory) {
        return callback(
            {
                message: "catagory Required",
            },
            ""
        );
    }
    const productModel = new product(params);
    productModel.save()
        .then((response) => {
            return callback(null, response);

        }
        )
        .catch((error) => {
            return callback(err);
        });
    }
    async function getProducts(params, callback) {
        const productName = params.productName;
        const catagoryId = params.catagoryId;
        var condition = {};
        if (productName) {
            condition["productName"] = {
                $reges: new RegExp(productName), $options: "i"
            };
        }
        if (catagoryId) {
            condition("catagory") = catagoryId;
        }
        let perPage = Math.abs(params.pageSize) || MONGO_DB_CONFIG.PAGE_SIZE;
        let page = (Math.abs(params.page) || 1) - 1;

        product
            .find(condition, "productId productName productShortDescription productDescription productPrice productImage productSKU productType stockStatus")
            .populate("catagory", "catagoryName catagoryImage")
            .limit(perPage)
            .skip(perPage * page)
            .then((response) => {
                return callback(null, response);

            }
            )
            .catch((error) => {
                return callback(error);
            }); 
    }



async function getProductById(params, callback) {
    const productId = params.productId;

    product
        .findById(productId)
        .populate("catagory", "catagoryName catagoryImage")
        .then((response) => {
            return callback(null, response);

        }
        )
        .catch((error) => {
            return callback(err);
        });
}

async function updateProduct(params, callback) {
    const productId = params.productId;

    product
        .findByIdAndUpdate(productId, params, { useFindaAndModify: false })
        .populate("catagory", "catagoryName catagoryImage")
        .then((response) => {
            if (!response) {
                callback(`Cannot update product with id ${productId}`)
            }
            return callback(null, response);

        }
        )
        .catch((error) => {
            return callback(err);
        });
}

async function deleteProduct(params, callback) {
    const productId = params.productId;

    product
        .findByIdAndRemove(productId)
        .then((response) => {
            return callback(null, response);

        }
        )
        .catch((error) => {
            return callback(err);
        });
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct

};