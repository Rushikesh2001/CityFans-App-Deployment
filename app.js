const express = require("express");
const fs = require("fs");
const pug = require("pug");
const path = require("path");
const session = require("express-session");
var bodyParser = require("body-parser");
const compression = require("compression");
const RateLimit = require("express-rate-limit");
const dotenv = require("dotenv").config();
const MongoStore = require("connect-mongo");

const app = express();

//Declaring domain
const appUrl = process.env.APP_URL;

// Declaring port.
const PORT = process.env.PORT || 3000;

//Including the webservice
const getNews = require("./routes/getNews.js");
const getplayerDetails = require("./routes/getPlayerDetails.js");
const validateUserRouter = require("./routes/validateCredentials.js");
const registerUserRouter = require("./routes/registerUser.js");
const verifyMailRouter = require("./routes/verifyMail.js");
const isLoggedInRouter = require("./routes/checkLogin.js");
const logoutRouter = require("./routes/logoutUser.js");
const getQuizDetailsRouter = require("./routes/getQuizDetails.js");
const addUserQuizDetailsRouter = require("./routes/addUserQuizDetails.js");
const sendResetLinkRouter = require("./routes/sendResetLink.js");
const verifyHashRouter = require("./routes/verifyHash.js");
const changePasswordRouter = require("./routes/changePassword.js");
const resendVerifyLinkRouter = require("./routes/resendVerifyLink.js");
const addLatestNewsRouter = require("./routes/addLatestNews.js");
const { get } = require("http");
const validateAPI = require("./common/validateAPI.js");

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});

//Set template engine as pug
app.set("view engine", "pug");

//Set the views directory
app.set("views", path.join(__dirname, "views"));

// Telling express all the static files
app.use(express.static(__dirname + "/static"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(
  session({
    secret: "cityFans app",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_CONN_URL,
      dbName: "mciFanApp",
      ttl: 1800,
    }),
    // cookie: { secure: true },
  })
);

// Compressing http responses
app.use(compression());

// Apply rate limiter to all requests
app.use(limiter);

// Assigning link to webservice
app.use("/ManCity/News", getNews);
app.use("/ManCity/data/players", getplayerDetails);
app.use("/session", validateUserRouter);
app.use("/verify", registerUserRouter);
app.use("/accountVerify", verifyMailRouter);
app.use("/check/login", isLoggedInRouter);
app.use("/logout", logoutRouter);
app.use("/data/QuickfireQuiz", getQuizDetailsRouter);
app.use("/user/data/quiz", addUserQuizDetailsRouter);
app.use("/send/resetLink", sendResetLinkRouter);
app.use("/reset/password", verifyHashRouter);
app.use("/change/user/password", changePasswordRouter);
app.use("/resend/verifyLink", resendVerifyLinkRouter);
app.use("/add/news", addLatestNewsRouter);

//Reading static html files
const pos = fs.readFileSync("static/playerOfSeason.html");
const forgot = fs.readFileSync("static/forgot.html");
const journey = fs.readFileSync("static/journey.html");

//Handling request urls
app.get("/", (req, res) => {
  var fetchedNews;
  if (req.session.news) {
    fetchedNews = req.session.news;
    console.log("Session exists");
    res.status(200).render("index", { fetchedNews });
  } else {
    console.log("Session does not exists");
    // Making api call
    try {
      fetch(`${appUrl}/ManCity/News`, { method: "GET" })
        .then((response) => response.json())
        .then((data) => {
          req.session.news = data;
        })
        .then(() => {
          fetchedNews = req.session.news;
          res.status(200).render("index", { fetchedNews });
        });
    } catch (error) {
      res.end(error);
    }
  }
});

app.get("/pos", (req, res) => {
  res.status(200);
  res.end(pos);
});

app.get("/players", (req, res) => {
  fetch(`${appUrl}/ManCity/data/players`, { method: "GET" })
    .then((response) => response.json())
    .then((playerList) => {
      res.status(200).render("players", { playerList });
    });
});

app.get("/login", (req, res) => {
  res.status(200).render("login");
});

app.get("/quiz", (req, res) => {
  // console.log(req.query.uid);
  if (req.session.isLoggedIn) {
    fetch(`${appUrl}/data/QuickfireQuiz?uid=${req.session.mail}`)
      .then((response) => response.json())
      .then((responseObj) => {
        if (responseObj.accountId[0].isAdmin) {
          req.session.isAdmin = true;
        }
        res.status(200).render("quiz", {
          accountId: responseObj.accountId,
          quizdetail: responseObj.quizdetail,
        });
      });
  } else {
    res.redirect("/login");
  }
});

app.get("/signUp", (req, res) => {
  res.status(200).render("signUp");
});

app.get("/mailVerify", (req, res) => {
  res.status(200).render("verify");
});

app.get("/account-active", (req, res) => {
  const message = {
    heading: "Verification completed",
    msg: "Your mail has been verified and account is activated.",
  };
  res.status(200).render("signUpSuccess", { message });
});

app.get("/forgotPassword", (req, res) => {
  res.status(200);
  res.end(forgot);
});

app.get("/reset", (req, res) => {
  let msg = JSON.parse(req.query.data);
  res.status(200).render("reset", msg);
});

app.get("/reset-success", (req, res) => {
  let message = {};
  message.heading = "Reset Password Successfully";
  message.msg =
    "Your password has been reset successfully. You can proceed to login.";
  res.status(200).render("resetSuccess", { message });
});

app.get("/journey", (req, res) => {
  res.status(200);
  res.end(journey);
});

app.get(
  "/addNews",
  function (req, res, next) {
    const { isAdmin, isLoggedIn } = req.session;
    if (isAdmin && isLoggedIn) {
      next();
    } else {
      res.send("Unauthorized user. Please login!!!!!!");
    }
  },
  (req, res) => {
    if (req.session.newsAddedMsg) {
      let message = {};
      message.msg = req.session.newsAddedMsg;
      req.session.newsAddedMsg = "";
      res.status(200).render("addNews", { message });
    } else {
      res.status(200).render("addNews");
    }
  }
);

//Securing endpoints

//App is listening to request
app.listen(PORT, () => {
  console.log("App is listening......");
  console.log(`Server is live at ${appUrl}`);
});
