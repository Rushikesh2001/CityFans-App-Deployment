const express = require("express");
const router = express.Router();
const mongoClient = require("mongodb").MongoClient;

const uri = process.env.DB_CONN_URL;
const client = new mongoClient(uri);

async function dbConnection(mail) {
  try {
    await client.connect();
    const database = client.db("mciFanApp");
    const collection1 = database.collection("quizDetails");
    const collection2 = database.collection("accountDetails");

    const cursor1 = await collection1.find({}).toArray();
    const cursor2 = await collection2
      .find({ email: `${mail}` })
      .project({ email: 1, isAdmin: 1, quiz: 1, _id: 0 })
      .toArray();

    return { quizdetail: cursor1, accountId: cursor2 };
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
}

router.get("/", function (req, res) {
  dbConnection(req.query.uid).then((response) => {
    res.send(JSON.stringify(response));
  });
});

module.exports = router;
