const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
const nodemailer = require("nodemailer");
const { randomBytes } = require("node:crypto");

const appUrl = process.env.APP_URL;

const uri = process.env.DB_CONN_URL;
const client = new mongoClient(uri);

async function dbConnection(mail, uid) {
  try {
    await client.connect();
    const database = client.db("mciFanApp");
    const collection = database.collection("accountDetails");

    const cursor = await collection.find({ email: mail }).toArray();
    if (cursor.length != 0) {
      smtpConnection(mail);
      const newCursor = await collection.updateOne(
        { email: mail },
        { $set: { hash: uid } }
      );
      return true;
    }
    return false;
  } finally {
    await client.close();
  }
}

//Defining smtp configuration settings
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "rushikeshpalekar91@gmail.com",
    pass: "zbozdbflwosstdyr",
  },
});

// Making unique hash codes
const uniqueId = randomBytes(128).toString("hex");

async function smtpConnection(toMailId) {
  // send mail with defined transport object
  try {
    const info = await transporter.sendMail({
      from: "rushikeshpalekar91@gmail.com", // sender address
      to: `${toMailId}`, // list of receivers
      subject: "CityFans - Reset Password", // Subject line
      html: `Welcome<br/>CityFans!<br/>You must follow this link to reset your password:<br/><a href='${appUrl}/reset/password?id=${uniqueId}'>${appUrl}/reset/password?id=${uniqueId}<a/>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error(error);
  }
}

router.post("/", function (req, res) {
  var message = {};
  if (req.body.mail) {
    dbConnection(req.body.mail, uniqueId)
      .then((response) => {
        if (response) {
          message.msg = "success";
          res.send(JSON.stringify(message));
        } else {
          message.msg = "error";
          res.send(JSON.stringify(message));
        }
      })
      .catch((err) => {
        res.send(`Something went wrong:${err.message}`);
      });
  } else {
    res.send({ msg: "error" });
  }
});

module.exports = router;
