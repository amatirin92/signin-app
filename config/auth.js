module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_message", "Please sign in to see this page");
    res.redirect("/users/signin");
  }
};
