const catagoriesService = require("../services/catagories.service");
const upload = require("../middleware/catagories.uploads");

exports.create = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }
        else {
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                catagoryName: req.body.catagoryName,
                catagoryDescription: req.body.catagoryDescription,
                catagoryImage: path != "" ? "/" + path : "",
            };
            catagoriesService.createCatagory(model, (error, results) => {
                if (error) {
                    return next(error);
                }
                else {
                    return res.status(200).send({
                        message: "success",
                        data: results,
                    });
                }
            });
        }
    });
};


exports.findAll = (req, res, next) => {
    var model = {
        catagoryName: req.query.catagoryName,
        pageSize: req.query.pageSize,
        page: req.query.page,
    };
        catagoriesService.getCatagories(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "success",
                data: results,
            });
        }
    });

};

//  from end points      /api/catagory/id

exports.findOne = (req, res, next) => {
    var model = {
        catagoryId: req.params.id,
    };
    catagoriesService.getCatagoryById(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "success",
                data: results,
            });
        }
    });

};

// update function

exports.update = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            next(err);
        }
        else {
            const path = req.file != undefined ? req.file.path.replace(/\\/g, "/") : "";

            var model = {
                catagoryId: req.params.id,
                catagoryName: req.body.catagoryName,
                catagoryDescription: req.body.catagoryDescription,
                catagoryImage: path != "" ? "/" + path : "",
            };
            catagoriesService.updateCatagory(model, (error, results) => {
                if (error) {
                    return next(error);
                }
                else {
                    return res.status(200).send({
                        message: "success",
                        data: results,
                    });
                }
            });
        }
    })
};

exports.delete = (req, res, next) => {
    var model = {
        catagoryId: req.params.id,
    };
    catagoriesService.deleteCatagory(model, (error, results) => {
        if (error) {
            return next(error);
        }
        else {
            return res.status(200).send({
                message: "success",
                data: results,
            });
        }
    });

}