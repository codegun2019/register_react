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
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'mydb'
// });

const connection = mysql.createConnection({
    host: '212.80.213.170',
    user: 'appdayco_appdayco',
    password: 'cPqCqhXCdDDPb8CmsLxu',
    database: 'appdayco_appdayco'
});
// Register
app.post('/register', jsonParser, function (req, res, next) {
    // Check if the email already exists in the database
    connection.execute(
        'SELECT COUNT(*) AS count FROM st_users WHERE username = ?',
        [req.body.email],
        function (err, results, fields) {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }

            const emailCount = results[0].count;

            if (emailCount > 0) {
                // username already exists, return an error
                res.json({ status: 'error', message: 'username already exists' });
            } else {
                // username does not exist, proceed with the insert
                bcrypt.hash(req.body.password, saltRounds, function (hashErr, hash) {
                    connection.execute(
                        //'INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)',
                        //[req.body.email, hash, req.body.fname, req.body.lname],
                        'INSERT INTO st_users (img, username, password, email, point, ip, status, timeadd, cash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        [req.body.img, req.body.username, hash, req.body.email, req.body.point, req.body.ip, req.body.status, req.body.timeadd, req.body.cash],
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
// create api login REACT
app.post('/login', jsonParser, function (req, res, next) {
});
// App   
app.listen(3333, function () {
    console.log('CORS-enabled web server listening on port 3333');
});
