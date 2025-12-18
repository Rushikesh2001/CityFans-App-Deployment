const express = require("express");
const validateAPI = require("../common/validateAPI");
const router = express.Router();

router.get("/", validateAPI, function (req, res, next) {
  req.session.isLoggedIn = false;
  res.redirect("/login");
});

module.exports = router;
