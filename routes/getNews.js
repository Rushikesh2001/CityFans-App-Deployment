const express = require("express");
const app = express();
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.DB_CONN_URL;
const client = new MongoClient(uri);

async function dbConnect() {
  try {
    await client.connect();
    // Get the database and collection on which to run the operation
    const database = client.db("mciFanApp");
    const news = database.collection("latestNews");
    // Execute query
    const cursor = news.find({});
    // Print the document returned by find()
    const allNews = await cursor.toArray();
    // console.log(allNews);

    //Storing retrieved data in session storage

    return allNews;
  } finally {
    await client.close();
  }
}

router.get("/", function (req, res, next) {
  // Connecting to mongo client
  dbConnect().then((result) => {
    res.send(result);
  });
});

module.exports = router;
