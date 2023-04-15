const multer =require ('multer');
const path = require ('path');

const storage = multer.diskStorage ({
    destination : function(req,file,cb){
        cb(null, "./uploads/catagories")
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const filefilter = (req, file, callback) =>{
    const acceptableExt = [".png", ".jpg", ".jpeg"];
    if(!acceptableExt.includes(path.extname(file.originalname))){
        return callback(new Error("Only .png, .jpg and .jpeg format allowed !"));

    }
    const fileSize = parseInt(req.heeaders["content-lenght"])

    if (fileSize > 1048576) {
        return callback ( new Error("File size is quite big"));
    }
    callback(null, true);
    };

    let upload  = multer({
        storage : storage,
        fileFilter : filefilter,
        fileSize: 1048576,
    });
    
    module.exports = upload.single("ctagoryImage");
    