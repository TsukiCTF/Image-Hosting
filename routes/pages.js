const path = require('path');
const fs = require('fs');
const pug = require("pug");
const multer = require('multer');
const express = require('express');
const { nanoid } = require('nanoid');
const authController = require('../controllers/auth');
const uploadController = require('../controllers/upload');
const { serverFQDN, handleError, upload, confirmFileExists, acceptedImageExt } = require('./helpers/pagesUtil');

const router = express.Router();

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
        res.render('profile', {
            isAnonymous: false,
            numPosts: req.user.fileNames.length,
            fileNames: req.user.fileNames,
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
        const email = req.user ? req.user.email : '';
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
        imgSrcFQDN: `${serverFQDN}/uploads/${fileName}` 
    });
});

router.get('/fail/:message', authController.isLoggedIn, (req, res) => {
    const isAnonymous = req.user ? false : true;
    let message = 'Unknown';

    if (req.params.message == 'unacceptedFileFormat')
        message = 'Unaccepted file format. Also, make sure you are not using an online proxy site!';
    else if (req.params.message == 'noFileChosen')
        message = 'No file is chosen';

    res.render('fail', {
        isAnonymous,
        message
    });
});

router.get('/delete/:fileName', [authController.isLoggedIn, uploadController.getFilesUploadedBy], (req, res) => {
    const fileName = req.params.fileName;
    // ignore unauthenticated requests
    if (!req.user)
        return res.redirect('/');

    // verify this user owns the file
    let isOwner = false;
    req.user.fileNames.forEach(e => {
        if (e.file_name === fileName)
        isOwner = true;
    });

    if (isOwner) {
        // delete the file entry in database
        uploadController.deleteFileEntry(fileName);
        // delete the file on disk
        const filePath = path.join(__dirname, `../public/uploads/${fileName}`);
        fs.unlinkSync(filePath, err => {
            if (err)
                return handleError(err, res);
        });
    }
    res.redirect('/profile');
});

module.exports = router;