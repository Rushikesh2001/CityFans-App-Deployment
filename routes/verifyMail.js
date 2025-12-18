const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

const uri = process.env.DB_CONN_URL;
const client = new mongoClient(uri);

async function dbConnection(hashCode) {
  try {
    await client.connect();
    const database = client.db("mciFanApp");
    const collection = database.collection("accountDetails");

    const cursor = await collection.find({ hash: hashCode }).toArray();
    if (cursor.length == 1) {
      await collection.updateOne(
        { hash: hashCode },
        {
          $set: {
            isVerified: true,
          },
        }
      );
      await collection.updateOne({ hash: hashCode }, { $unset: { hash: 1 } });
      return true;
    } else {
      return false;
    }
  } finally {
    await client.close();
  }
}

router.get(
  "/",
  function (req, res, next) {
    var message = {};
    if (req.query.id) {
      next();
    } else {
      message.heading = "Verification Error";
      message.msg =
        "An error occurred while verifying your email. Please consider resending the verification link.";
      res.render("signUpSuccess", { message });
    }
  },
  function (req, res, next) {
    var message = {};
    dbConnection(req.query.id).then((response) => {
      if (response) {
        res.redirect("/account-active");
      } else {
        message.heading = "Verification Error";
        message.msg =
          "An error occurred while verifying your email. Please consider resending the verification link.";
        res.render("signUpSuccess", { message });
      }
    });
  }
);

module.exports = router;
