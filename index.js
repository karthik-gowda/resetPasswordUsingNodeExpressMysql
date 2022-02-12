const express = require("express");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const path = require("path");
var port = process.env.PORT || 3000;
var userEnteredEmail;
var userEnteredPassword;

const app = express();

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/forgetpassword", function (req, res) {
    res.sendFile(path.join(__dirname, "views", "email.html"));
});

app.get("/resetpassword", function (req, res) {
    res.sendFile(path.join(__dirname, "views", "password.html"));
});

app.post("/email", (req, res) => {
    //Send an email here but currently dummy email
    console.log("Data:", req.body.email);
    userEnteredEmail = req.body.email;
    if (res.statusCode == 200) {
        toSendEmail(userEnteredEmail);
    } else {
        console.log(error);
    }
    res.json({ message: "Message received!" });
});

app.post("/password", (req, res) => {
    console.log("Data:", req.body.password);
    userEnteredPassword = req.body.password;
    if (res.statusCode == 200) {
        console.log(userEnteredPassword);
        toSetNewPasword(userEnteredPassword);
    } else {
        console.log(error);
    }
    res.json({ message: "Message received!" });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});

function toSetNewPasword(userEnteredPassword) {
    var connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "<YOUR_SQL_ROOT_PASSWORD>",
        database: "<YOUR_DB_NAME>",
        //connectionLimit: 50,
        port: 3306,
    });

    connection.connect(function (err) {
        if (err) throw err;
    });

    const iduser = userEnteredEmail; // ID
    const newPassword = userEnteredPassword;

    var insertQuery = "UPDATE `testusers` SET `password` = ('" + newPassword + "') WHERE email = '" + iduser + "';";

    connection.query(insertQuery, function (error, results, fields) {
        console.log(insertQuery);
        console.log(JSON.stringify(results));
        if (error) throw error;
    });
    module.exports = connection;
    connection.end(); // End connection
}

//Function to send Email to user with reset link
function toSendEmail(userEnteredEmail) {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "<YOUR_EMAIL>",
            pass: "<YOUR_PASSWORD>",
        },
    });

    const options = {
        from: "<YOUR_EMAIL>",
        to: userEnteredEmail, //TO EMAIL WHICH YOU NEED TO SEND PASSWORD RESET LINK
        subject: "Reset Password link",
        text: "Click on this link to reset your password : " + "http://localhost:3000/resetpassword",
    };

    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Sent: " + info.response);
    });
}
