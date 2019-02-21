const mongoose = require('mongoose');
module.exports = (req,res,next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const error = new Error(`This is not a valid ID = ${req.params.id}`);
        error.statusCode = 404;
        throw error;
    }

    next();
}