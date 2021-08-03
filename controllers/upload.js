const pool = require('./pool');

exports.saveFileInfo = async (fileName, email) => {
    pool.query('INSERT INTO Images (file_name, user_id) VALUES (?, (SELECT id FROM Users WHERE email = ?));', [fileName, email], async (err, results) => {
        if (err)
            console.log(err);
        else
            console.log(`[+] "Image ${fileName}" uploaded by "${email}"`);
    });
}


exports.getFilesUploadedBy = async (req, res, next) => {
    if (req.user) {
        pool.query('SELECT file_name FROM Images i INNER JOIN Users u ON i.user_id=u.id WHERE u.email = ?;', [req.user.email], async (err, results) => {    
            if (err)
                console.log(err);
            req.user.fileNames = results;
            return next();
        });
    } else {
        next();
    }
}