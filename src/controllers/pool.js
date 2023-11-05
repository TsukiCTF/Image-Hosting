const mysql = require('mysql2');
const { promisify } = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log('Error when connecting to database:');
        console.log(err)
    }
    if (connection)
        connection.release();
});

pool.query = promisify(pool.query);

module.exports = pool;
