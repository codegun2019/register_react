const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
const jsonParser = bodyParser.json();

// Your MySQL connection code here...
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mydb'
});
// Register
app.post('/register', jsonParser, function (req, res, next) {
    // Check if the email already exists in the database
    connection.execute(
        'SELECT COUNT(*) AS count FROM users WHERE email = ?',
        [req.body.email],
        function (err, results, fields) {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }

            const emailCount = results[0].count;

            if (emailCount > 0) {
                // Email already exists, return an error
                res.json({ status: 'error', message: 'Email already exists' });
            } else {
                // Email does not exist, proceed with the insert
                bcrypt.hash(req.body.password, saltRounds, function (hashErr, hash) {
                    connection.execute(
                        'INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)',
                        [req.body.email, hash, req.body.fname, req.body.lname],
                        function (insertErr, insertResults, insertFields) {
                            if (insertErr) {
                                res.json({ status: 'error', message: insertErr });
                                return;
                            }
                            res.json({ status: 'ok' });
                        }
                    );
                });
            }
        }
    );
});
// Login
app.post('/login', jsonParser, function (req, res, next) {
});
// App   
app.listen(3333, function () {
    console.log('CORS-enabled web server listening on port 3333');
});
