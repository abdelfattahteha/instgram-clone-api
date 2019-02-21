module.exports = (message) => {
    const error = new Error(message);
    error.statusCode = 404;
    throw error;
}