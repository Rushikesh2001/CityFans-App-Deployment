const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { randomBytes } = require("node:crypto");
const mongoClient = require("mongodb").MongoClient;

const appUrl = process.env.APP_URL;

const uri = process.env.DB_CONN_URL;
const client = new mongoClient(uri);

async function dbConnection(mail, uid) {
  try {
    await client.connect();

    const database = client.db("mciFanApp");
    const collection = database.collection("accountDetails");

    const cursor = await collection.updateOne(
      { email: mail },
      { $set: { hash: uid } }
    );
    smtpConnection(mail);
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
    pass: "rfgpvpitthobdoit",
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
      subject: "CityFans - Confirm E-mail Address", // Subject line
      html: `Welcome<br/>Thanks for signing up with CityFans!<br/>You must follow this link to activate your account:<br/><a href='${appUrl}/accountVerify?id=${uniqueId}'>${appUrl}/accountVerify?id=${uniqueId}<a/>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.log(error);
  }
}

router.post("/", function (req, res, next) {
  if (req.body.mail) {
    dbConnection(req.body.mail, uniqueId).then(() => {
      res.send({ msg: "Success" });
    });
  } else {
    res.send({ msg: "Failure" });
  }
});

module.exports = router;
