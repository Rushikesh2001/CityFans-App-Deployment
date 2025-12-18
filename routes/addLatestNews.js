const express = require("express");
const router = express.Router();
const multer = require("multer");
const validateAPI = require("../common/validateAPI");
const storage = multer.diskStorage({
  destination: "./static/images/news",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const mongoClient = require("mongodb").MongoClient;

const uri = process.env.DB_CONN_URL;

const client = new mongoClient(uri);

async function dbConnect(newsObj) {
  try {
    await client.connect();
    const database = client.db("mciFanApp");
    const collection = database.collection("latestNews");

    const cursor = await collection.insertOne(newsObj);
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
}

router.post(
  "/",
  function (req, res, next) {
    const { isAdmin, isLoggedIn } = req.session;
    if (isAdmin && isLoggedIn) {
      next();
    } else {
      res.send("Unauthorized user. Please login!!!!!!");
    }
  },
  upload.single("imageFile"),
  function (req, res) {
    let message = {};
    let newsObj = {};
    newsObj.title = req.body.title;
    newsObj.imgUrl = `../images/news/${req.file.originalname}`;
    newsObj.webUrl = req.body.webUrl;
    newsObj.description = req.body.description;
    dbConnect(newsObj).then(() => {
      req.session.newsAddedMsg = "News added to the database successfully";
      res.redirect("back");
    });
  }
);

module.exports = router;
