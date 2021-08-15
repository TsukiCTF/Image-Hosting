const path = require('path');
const fs = require('fs');
const pug = require("pug");
const express = require('express');
const compression = require('compression');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const csurf = require('csurf');

// set environment variables
dotenv.config({ path: '.env' });

// create global app object
const app = express();

// set template engine to pug
app.set('views', './views');
app.set('view engine', 'pug');

// set static file directory to root
app.use(express.static(path.join(__dirname, '/public')));

// serve favicon
app.use(favicon(path.join(__dirname, '/public', '/images', 'favicon.ico')));

// add middlewares
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(csurf({ cookie: true}));

// define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

// start server
const server = app.listen(process.env.PORT || 3000, () => {
    console.log('Server listening on port ' + server.address().port);
});
