function validateAPI(req, res, next) {
  if (!req.session.isLoggedIn) {
    res.send("Unauthorized user");
  } else {
    next();
  }
}

module.exports = validateAPI;
