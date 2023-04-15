const catagoryController = require("../controllers/catagories.controller");
const productController = require("../controllers/product.controller");
const express = require ('express');
const router = require ("express").Router();
const bodyParser = require ("body-parser");
router.use(bodyParser.json());


router.post("/catagory", catagoryController.create);
router.get("/catagory", catagoryController.findAll);
router.get("/catagory/:id", catagoryController.findOne);
router.put("/catagory/:id", catagoryController.update);
router.delete("/catagory/:id", catagoryController.delete);


router.post("/product", productController.create);
router.get("/product", productController.findAll);
router.get("/product/:id", productController.findOne);
router.put("/product/:id", productController.update);
router.delete("/product/:id", productController.delete);



module.exports = router;
