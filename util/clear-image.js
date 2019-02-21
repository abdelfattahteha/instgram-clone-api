const fs = require('fs');
module.exports = (imageUrl) => {
    const imagePathArray = imageUrl.split('/');
    const imagePath = imagePathArray[imagePathArray.length-1];
    const dirPath = __dirname + '/../' + 'images/'+imagePath;
    fs.unlink( dirPath , error => {
        if(error) {console.log(error)}
    })
};