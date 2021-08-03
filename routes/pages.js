const path = require('path');
const fs = require('fs');
const pug = require("pug");
const multer = require('multer');
const express = require('express');
const { nanoid } = require('nanoid');
const authController = require('../controllers/auth');
const uploadController = require('../controllers/upload');

const router = express.Router();

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

// AUTH RELATED ROUTERS:
router.get('/', authController.isLoggedIn, (req, res) => {
    const isAnonymous = req.user ? false : true;
    res.render('index', {
        isAnonymous
    });
});

router.get('/register', authController.isLoggedIn, (req, res) => {
    if (req.user)
        res.redirect('/profile');
    else
        res.render('register', {
            isAnonymous: true
        })
});

router.get('/login', authController.isLoggedIn, (req, res) => {
    if (req.user)
        res.redirect('/profile');
    else
        res.render('login', {
            isAnonymous: true
        });
});

router.get('/profile', [authController.isLoggedIn, uploadController.getFilesUploadedBy], (req, res) => {
    if (req.user) {
        // prepare file paths array for template engine
        const numPosts = req.user.fileNames.length;
        const filePaths = [];
        req.user.fileNames.forEach(e => filePaths.push('/uploads/' + e.file_name));

        res.render('profile', {
            isAnonymous: false,
            numPosts,
            filePaths,
            name: req.user.name,
            email: req.user.email,
            userType: 'Member'
        });
    }
    else {
        res.redirect('/login');
    }
});

// UPLOAD RELATED ROUTERS:
router.post('/upload', [ authController.isLoggedIn, upload, confirmFileExists ], (req, res, next) => {
    const tempPath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // validate file extension
    if (acceptedImageExt.includes(fileExt)) {
        // create a short UUID for file name
        const fileName = nanoid() + fileExt;
        const targetPath = path.join(__dirname, `../public/uploads/${fileName}`);

        fs.rename(tempPath, targetPath, err => {
            if (err)
                return handleError(err, res);
            res
                .status(200)
                .contentType('text/plain')
                .redirect(`/success/${fileName}`);
        });
        // save file information in database
        const email = (req.user) ? req.user.email : '';
        uploadController.saveFileInfo(fileName, email);
    }
    else {
        fs.unlink(tempPath, err => {
            if (err)
                return handleError(err, res);
            res
                .status(403)
                .contentType('text/plain')
                .redirect('/fail/unacceptedFileFormat')
        });
    }
});

router.get('/success/:fileName', authController.isLoggedIn, (req, res) => {
    const isAnonymous = req.user ? false : true;
    const fileName = req.params.fileName;
    res.render('success', {
        isAnonymous,
        imgSrc: `/uploads/${fileName}`,
        imgAlt: `failed to view ${fileName}`,
        imgSrcFQDN: `http://10.0.0.171:3000/uploads/${fileName}`
    });
});

router.get('/fail/:message', (req, res) => {
    const isAnonymous = req.user ? false : true;
    let message = 'Unknown';

    if (req.params.message == 'unacceptedFileFormat')
        message = 'Unaccepted file format';
    else if (req.params.message == 'noFileChosen')
        message = 'No file is chosen';

    res.render('fail', {
        isAnonymous,
        message
    });
})

// redirect to root for any non-exisiting pages
router.get('*', (req, res) => {
    res.redirect('/'); 
});

module.exports = router;