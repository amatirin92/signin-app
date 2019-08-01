(function() {
  const express = require("express");
  const path = require("path");
  const mongoose = require("mongoose");
  const publicPath = path.join(__dirname, "public");
  const PORT = process.env.PORT || 5000;
  const expressLayouts = require("express-ejs-layouts");
  const bodyParser = require("body-parser");
  const flash = require("connect-flash");
  const session = require("express-session");
  const passport = require("passport");
  const app = express();

  //passport config
  require("../config/passport")(passport);

  //MongoDB/Mongoose connection
  const db = require("../config/keys").MongoURI;
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

  //EJS layouting
  app.set("view engine", "ejs");
  app.use(expressLayouts);

  //Bodyparser
  app.use(bodyParser.urlencoded({ extended: true }));

  //Session middleware
  app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true
    })
  );

  //Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  //connect flash
  app.use(flash());

  //global vars
  app.use((req, res, next) => {
    res.locals.success_message = req.flash("success_message");
    res.locals.error_message = req.flash("error_message");
    res.locals.error = req.flash("error");
    next();
  });

  //Routing
  app.use(express.static(publicPath));
  app.use("/", require("../routes/index"));
  app.use("/users", require("../routes/users"));

  app.listen(PORT, console.log(`Server is running on port ${PORT}`));

  module.exports = app;
})();
