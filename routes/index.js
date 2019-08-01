const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, (req, res) => {
  res.status(200).render("home", {
    email: req.user.email
  });
});

module.exports = router;
