const path = require('path');
const fs = require('fs');
const pug = require("pug");
const express = require('express');
const compression = require('compression');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// create global app object
const app = express();

// set environment variables
dotenv.config({ path: '.env' });

// set template engine to pug
app.set('views', './views');
app.set('view engine', 'pug');

// enable gzip compression
app.use(compression());

// set static file directory to root
app.use(express.static(path.join(__dirname, '/public')));

// parse URL-encoded bodies & JSON bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

// start server
const server = app.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on port ' + server.address().port);
});