const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const pool = require('./pool');

exports.login = async (req, res) => {
    try {
        const { password } = req.body;
        const email = req.body.email.toLowerCase();
        // do not accept empty fields
        if ( !email || !password ) {
            return res.status(400).render('login', {
                isAnonymous: true,
                message: 'Please fill in both email and password.'
            })
        }

        pool.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
            if ( !results[0] || !(await bcrypt.compare(password, results[0].password)) ) {
                return res.status(401).render('login', {
                    isAnonymous: true,
                    message: 'Email or password is incorrect.'
                });
            }
            
            const id = results[0].id;
            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000   // convert to milliseconds
                ),
                httpOnly: true  // disallow scripts to access cookie
            }
            res.cookie('jwt', token, cookieOptions);
            res.status(200).redirect('/profile');
        });
    } catch (err) {
        console.log(err);
    }
}

exports.logout = async (req, res) => {
    res.clearCookie('jwt'); // possible improvement: invalidate token from server side
    res.status(200).redirect('/login');
};

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // verify the token
            const decodedJWT = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            // verify that user exists
            pool.query('SELECT * FROM Users WHERE id = ?', [decodedJWT.id], (err, results) => {
                if (!results[0])
                    return next();
                req.user = results[0];
                return next();
            });
        } catch (err) {
            console.log(err);
            return next();
        }
    } else {
        next();
    }
}

// helper function to validate registration input fields
const validateRegisterInput = (name, email, password, passwordConfirm, results) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;    // regex for email
    // empty field(s)
    if ( !name || !email || !password )
        return 'You must fill all required fields.';
    // email is invalid
    else if (!re.test(email))
        return 'You must submit a valid email address.';
    // weak password
    else if (password.length < 6)
        return 'Please choose a password of at least 6 characters in length.';
    // two passwords do not match
    else if (password !== passwordConfirm)
        return 'Your passwords do not match.';
    // email already exists
    else if (results.length > 0)
        return 'User already exists with the email.';
    else
        return null;
} 

exports.register = (req, res) => {
    const { name, password, passwordConfirm } = req.body;
    const email = req.body.email.toLowerCase();

    pool.query('SELECT email FROM Users WHERE email = ?', [email], async (err, results) => {
        if (err)
            console.log(err);

        const message = validateRegisterInput(name, email, password, passwordConfirm, results);
        if (message) {
            return res.render('register', {
                isAnonymous: true,
                registerSuccess: false,
                message 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        pool.query('INSERT INTO Users SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
            if (err)
                console.log(err);
            else {
                return res.render('register', {
                    isAnonymous: true,
                    registerSuccess: true,
                    message: 'User successfully registered.'
                });
            }
        });
    });
}
