const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const authHeader = req.get('Authorization');

    // if no authoriztion token in header
    if (!authHeader) {
        const error = new Error('Not Authenticated, No Provided Token');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;

    // check authrization token
    try {
        
        decodedToken = jwt.verify(token, process.env.JWT_KEY || 'mysecretkey');
        // Authenticated-user data
        req.userId = decodedToken.userId;
        next();

    } catch (err) {

        // if authoriztion token not valid
        err.message = "Invalid Token."
        err.statusCode = 401;
        throw err;
    }

}