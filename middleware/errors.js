function errorHandler(err, req, res, next){
    if (typeof err ==="string") {

        return res.status(400).json({message: err});
    }
    if (err.name ==="validationError"){

        return res.status(400).json({ message: err.message});
    }
    if (err.name ==="UnauthorizzedError"){

        return res.status(401).json({message: "Token is not Valid"});
    }

    return res.status(500).json ({ message: err.message});
}

    module.exports = {
        errorHandler,
    };
    