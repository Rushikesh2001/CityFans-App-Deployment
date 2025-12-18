const express = require("express");
const app = express();
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;
// const session = require("express-session");
const bcrypt = require("bcrypt");
const { read } = require("fs");
const saltRounds = 10;

const uri = process.env.DB_CONN_URL;
const client = new mongoClient(uri);

async function dbConnection(userDetail) {
  var responseObj = {};
  try {
    await client.connect();

    const database = client.db("mciFanApp");
    const collection = database.collection("accountDetails");

    const cursor = await collection.find({ email: userDetail.mail }).toArray();

    return cursor;
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
}

router.post("/", function (req, res, next) {
  var responseMsg = {};
  dbConnection(req.body).then((response) => {
    if (response.length == 1) {
      bcrypt.compare(
        req.body.password,
        response[0].password,
        function (err, result) {
          if (result == true) {
            if (response[0].isVerified === true) {
              req.session.isLoggedIn = true;
              req.session.mail = req.body.mail;
              res.redirect(`/quiz`);
            } else {
              req.session.isLoggedIn = false;
              responseMsg.msg =
                "Email is not verified. Please check your mailbox for verification link.";
              res.render("login", { responseMsg });
            }
          } else {
            req.session.isLoggedIn = false;
            responseMsg.msg = "Incorrect username or password";
            res.render("login", { responseMsg });
          }
        }
      );
    } else {
      responseMsg.msg = "Incorrect username or password";
      res.render("login", { responseMsg });
    }
  });
});

module.exports = router;
