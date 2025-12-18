const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const validateAPI = require("../common/validateAPI");
const saltRounds = 10;
const mongoClient = require("mongodb").MongoClient;

const uri = process.env.DB_CONN_URL;
const client = new mongoClient(uri);

async function dbConnection(mail, pass, hashCode) {
  try {
    await client.connect();

    const database = client.db("mciFanApp");
    const collection = database.collection("accountDetails");
    const cursor1 = await collection.find({ hash: hashCode }).toArray();
    if (cursor1.length == 1) {
      await collection.updateOne({ hash: hashCode }, { $unset: { hash: 1 } });
      const cursor2 = await collection.updateOne(
        { email: mail },
        { $set: { password: pass } }
      );
      return true;
    } else {
      return false;
    }
  } finally {
    await client.close();
  }
}

router.post(
  "/",
  function (req, res, next) {
    if (!req.query.id) {
      res.send("Unauthorized access. Please go back to login page !!!!!!");
    } else {
      next();
    }
  },
  function (req, res) {
    bcrypt.hash(req.body.pwd, saltRounds, async function (err, hash) {
      const response = await dbConnection(req.body.mail, hash, req.query.id);
      if (response) {
        res.send({ msg: "Success" });
      } else {
        res.send({ msg: "Failure" });
      }
    });
  }
);

module.exports = router;
