(function() {
  const express = require("express");
  const url = require("url");
  const path = require("path");
  let publicPath = path.resolve(__dirname, '../dist');

  const expressLayouts = require("express-ejs-layouts");
  const PORT = process.env.PORT || 5000;
  const app = express();
  //Routing
  app.use("/", require("../routes/index"));
  app.use("/users", require("../routes/users"));

  //EJS layouts
  app.use(express.static(publicPath));
  app.use(expressLayouts);
  app.engine('html', require('ejs').renderFile);
  app.set("view engine", "ejs");

  app.listen(PORT, console.log(`Server is running on port ${PORT}`));

  module.exports = app;
})();
