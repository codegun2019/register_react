const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var jwt = require('jsonwebtoken');
const secret = 'Fullstack-Login-2'

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
        [req.body.username],
        function (err, results, fields) {
            if (err) {
                res.json({ status: 'error', message: err });
                return;
            }

            const username = results[0].count;

            if (username > 0) {
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
app.post('/login', jsonParser,  function (req, res, next) {
    connection.execute(
        'SELECT * FROM st_users WHERE username = ?',
        [req.body.username],
        function (err, st_users, fields) {
            if (err) {  res.json({ status: 'error', message: err });  return; }
            if(st_users.length == 0) {  res.json({ status: 'error', message: 'no users found' }); return;}
            // Load hash from your password DB.
            bcrypt.compare(req.body.password, st_users[0].password, function(err, isLogin) {
                console.log(isLogin);
                if (isLogin) {
                  // Passwords match, user is logged in
                  res.json({ status: 'ok',message: "login success" });
                } else {
                  // Passwords do not match, user is not logged in
                  console.log('Hashed Password from DB:', st_users[0].password);
                  console.log('Password from Request:', req.body.password);
                  res.json({ status: 'error',message: "login fail" });
                }
            });
        }
    );
});

// App   
app.listen(3333, function () {
    console.log('CORS-enabled web server listening on port 3333');
});
