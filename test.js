const mysql = require('mysql');
const express = require('express');
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config();




var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "test"

});



con.connect(function (err) {
    if (err) res.sendFile(__dirname + "/invalid-page.html");
    console.log("Connected!");
    con.query("CREATE TABLE IF NOT EXISTS new_test_table (RegNo VARCHAR(255) PRIMARY KEY ,Names VARCHAR(255) ,Dept VARCHAR(255) ,Section VARCHAR(255))", (err, succ) => {
        if (err) res.sendFile(__dirname + "/invalid.html");
        else console.log("table created");
    })


});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/public', express.static('public', { 'extensions': ['css'] }));
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.get('/', (req, res) => {
    console.log("access")
    res.sendFile(__dirname + "/index.html");
})




app.post("/login-page.html", (req, res) => {

    const regNo = req.body.registerNo;
    const name = req.body.username;
    const dept = req.body.dept;
    const section = req.body.section;
    const email = req.body.email;


    const checkQuery = 'SELECT RegNo FROM new_test_table WHERE RegNo = (?)'; // we have to check according to sections too.
    con.query(checkQuery, [regNo], (err, succ) => {
        if (err) res.send("/invalid.html")
        else {
            if (succ.length > 0) {
                res.sendFile(__dirname + "/vote-submitted.html")
            }
            else {

                res.redirect(`/voting-page.ejs?name=${name}&reg=${regNo}&dept=${dept}&sec=${section}&email=${email}`);

            }
        }
    })



})

app.get("/login-page.html", (req, res) => {
    res.sendFile(__dirname + '/login-page.html');
})



app.post("/voting-page.ejs", (req, res) => {

    const final_name = req.body.final_name;
    const final_reg = req.body.final_reg;
    const name = req.body.voter_name;
    const reg = req.body.voter_reg;
    const dept = req.body.voter_dept;
    const sec = req.body.voter_sec;
    const email = req.body.voter_email;

    const insertQuery = 'INSERT INTO new_test_table (RegNo, Names, Dept, Section,Email) VALUES (?, ?, ?, ?, ?)';

    con.query(insertQuery, [reg, name, dept, sec, email], (err, succ) => {
        if (err) res.sendFile(__dirname + "/vote-submitted.html")
        else {
            console.log("inserted");
            const crUpdate = 'UPDATE cr_test_table SET votingPercent = votingPercent+1 WHERE RegNo=(?)';
            con.query(crUpdate, [final_reg], (err, succ) => {
                if (err) res.sendFile(__dirname + "/invalid-page.html");
                else console.log("crUpdated")
            })
            res.redirect(`/confirmation-page.html?name=${name}&reg=${reg}&final_name=${final_name}&final_reg=${final_reg}&email=${email}`);
        }
    })





})


app.get("/voting-page.ejs", (req, res) => {

    const section = req.query.sec;
    const searchQuery = 'SELECT RegNo, Names FROM cr_test_table WHERE Section = (?)';

    con.query(searchQuery, [section], (err, succ) => {
        if (err) res.sendFile(__dirname + '/invalid-page.html')
        else {
            res.render("voting-page.ejs", { succ });
        }
    })


})

app.get("/confirmation-page.html", (req, res) => {

    res.sendFile(__dirname + "/confirmation-page.html");

    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'warsimuhammadowais@gmail.com',
                pass: process.env.pass // Make sure process.env.pass is properly configured
            },
            authMethod:'PLAIN'
        });

        var mailOptions = {
            from: 'warsimuhammadowais@gmail.com',
            to:   `${req.query.email}`,
            subject: 'Vote Confirmed',
            html:  
            `<html>
                < head >
                <style>
                    /* Define your CSS styles here */
                    body {
                        font - family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                    }
                    .container {
                        max - width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        color: #666;
                    }
                    .confirmation-msg {
                        font - size: 18px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    }
                </style>
            </head >
            <body>
                <div class="container">
                    <h1>Vote Confirmation</h1>
                    <div class="confirmation-msg">
                        <p>Your vote has been confirmed!</p>
                    </div>
                    <p>Dear ${req.query.name},</p>
                    <p>Thank you for participating in the voting process. Your vote has been successfully received and recorded.</p>
                    <p>For any inquiries or concerns, please contact us.</p>
                    <p>Best Regards,<br />Election Committee</p>
                </div>
            </body>
            </html >
            `
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (err) {
        console.error('An error occurred:', err);
    }
    
})


app.post("/admin-login.html", (req, res) => {
    const sec = req.body.sec_input;

    const searchQuery = 'SELECT Names,votingPercent FROM cr_test_table WHERE Section = (?)';

    con.query(searchQuery, [sec], (err, succ) => {
        if (err) res.sendFile(__dirname + "/invalid-page.html");
        else {
            res.render("result-page.ejs", { succ });
        }
    })
})

app.get("/admin-login.html", (req, res) => {
    res.sendFile(__dirname + "/admin-login.html");
})

app.get("/faq.html", (req, res) => {
    res.sendFile(__dirname + "/faq.html");
})

app.get("/result-page.ejs", (req, res) => {
    res.render("result-page.ejs", { succ });
});



app.listen(8001, () => {
    console.log("started");
})