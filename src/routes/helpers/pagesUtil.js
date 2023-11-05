const multer = require('multer');

const serverUrl = process.env.SERVER_URL; // Ex: http://localhost:3000

const handleError = (err, res) => {
    res
        .status(500)
        .contentType('text/plain')
        .end('Oops! Something went wrong!');
};

const upload = multer({
    dest: './public/uploads',   // relative path to the app.js
}).single('file');

// helper middleware to confirm a file is submitted
const confirmFileExists = (req, res, next) => {
    if (!req.file)
        return res.redirect('/fail/noFileChosen');
    else
        return next();
}

const acceptedImageExt = ['.jpg', '.png', '.gif' , '.webp', '.tiff', '.psd', '.raw', '.bmp', '.heif', '.indd', '.jpeg', '.svg', '.ai'];


module.exports = { serverUrl, handleError, upload, confirmFileExists, acceptedImageExt };