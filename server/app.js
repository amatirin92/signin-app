(function() {
  const express = require("express");
  const url = require("url");
  const path = require("path");
  const mongoose = require("mongoose");
  const publicPath = path.join(__dirname, "public");
  const PORT = process.env.PORT || 5000;
  const expressLayouts = require("express-ejs-layouts");
  const bodyParser = require("body-parser");

  const app = express();

  //MongoDB/Mongoose connection
  const db = require("../config/keys").MongoURI;
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

  //EJS layouting
  app.set("view engine", "ejs");
  app.use(expressLayouts);
  // app.engine("html", require("ejs").renderFile);

  //Bodyparser
  //app.use(express.urlencoded({ extended: false }));

  app.use(bodyParser.urlencoded({ extended: true }));

  //Routing
  app.use(express.static(publicPath));
  app.use("/", require("../routes/index"));
  app.use("/users", require("../routes/users"));

  app.listen(PORT, console.log(`Server is running on port ${PORT}`));

  module.exports = app;
})();
