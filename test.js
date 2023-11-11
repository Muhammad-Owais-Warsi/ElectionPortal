const mysql = require('mysql');
const express = require('express');
const ejs = require('ejs');


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "test"
});


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE TABLE IF NOT EXISTS new_test_table (RegNo VARCHAR(255) PRIMARY KEY ,Names VARCHAR(255) ,Dept VARCHAR(255) ,Section VARCHAR(255))", (err, succ) => {
        if (err) res.send("/invalid.html");
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

    res.sendFile(__dirname + "/login-page.html");
})


app.get('/login-page.html', (req, res) => {
    res.redirect('/');
});

app.post("/login-page.html", (req, res) => {
    const regNo = req.body.registerNo;
    const name = req.body.username;
    const dept = req.body.dept;
    const section = req.body.section;


    const checkQuery = 'SELECT RegNo FROM new_test_table WHERE RegNo = (?)';
    con.query(checkQuery, [regNo], (err, succ) => {
        if (err) res.send("/invalid.html")
        else {
            if (succ.length > 0) {
                res.sendFile(__dirname + "/invalid-page.html")
            }
            else {

                res.redirect(`/voting-page.ejs?name=${name}&reg=${regNo}&dept=${dept}&sec=${section}`);

            }
        }
    })



})


app.post("/voting-page.ejs", (req, res) => {
    const final_name = req.body.final_name;
    const final_reg = req.body.final_reg;
    const name = req.body.voter_name;
    const reg = req.body.voter_reg;
    const dept = req.body.voter_dept;
    const sec = req.body.voter_sec;

    const crUpdate = 'UPDATE cr_test_table SET votingPercent = votingPercent+1 WHERE RegNo=(?)';
    con.query(crUpdate,[final_reg],(err,succ)=>{
        if (err) res.sendFile(__dirname + "/invalid-page.html");
        else console.log("crUpdated")
    })
    const insertQuery = 'INSERT INTO new_test_table (RegNo, Names, Dept, Section) VALUES (?, ?, ?, ?)';

    con.query(insertQuery, [reg, name, dept, sec], (err, succ) => {
        if (err) res.sendFile(__dirname + "/invalid-page.html")
        else {
            console.log("inserted");
            res.redirect(`/confirmation-page.html?name=${name}&reg=${reg}&final_name=${final_name}&final_reg=${final_reg}`);
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

    res.sendFile(__dirname + "/confirmation-page.html")
})


app.post("/admin-login.html",(req,res)=>{
    const sec = req.body.sec_input;

    const searchQuery = 'SELECT Names,votingPercent FROM cr_test_table WHERE Section = (?)';

    con.query(searchQuery,[sec],(err,succ) => {
        if(err) res.sendFile(__dirname + "/invalid-page.html");
        else {
            res.render("result-page.ejs",{succ});
        }
    })
})

app.get("/result-page.ejs", (req, res) => {
    res.render("result-page.ejs", { succ });
});



app.listen(8002, () => {
    console.log("started");
})