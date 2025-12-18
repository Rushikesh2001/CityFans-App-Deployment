const express = require("express");
const router = express.Router();
// const session = require("express-session");

router.get("/", function (req, res, next) {
  var responseObj = {};
  if (req.session.isLoggedIn) {
    responseObj.msg = true;
  } else {
    responseObj.msg = false;
  }
  res.send(responseObj);
});

module.exports = router;
