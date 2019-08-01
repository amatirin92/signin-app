const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require("passport");

//User Model
const User = require("../models/User");

//Signin Handle

router
  .get("/signin", (req, res) => {
    res.status(200).render("signin");
  })
  .post("/signin", (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/users/signin",
      failureFlash: true
    })(req, res, next);
  });

//Signup handle
router
  .get("/signup", (req, res) => {
    res.render("signup");
  })
  .post("/signup", (req, res) => {
    console.log(req.body);
    const { email, password, passwordConfirm } = req.body;
    let errors = [];

    if (!email || !password || !passwordConfirm) {
      errors.push({ message: "Please fill in all fields" });
    }

    if (password !== passwordConfirm) {
      errors.push({ message: "Passwords do not match" });
    }
    if (errors.length > 0) {
      return res.render("signup", {
        errors,
        email,
        password,
        passwordConfirm
      });
    } else {
      User.findOne({ email }).then(user => {
        if (user) {
          //User exists
          errors.push({ message: "Email is already registered" });
          return res.render("signup", {
            errors,
            email,
            password,
            passwordConfirm
          });
        } else {
          const newUser = new User({
            email,
            password
          });
          console.log(newUser);
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              //set pass to hash and save user
              newUser.password = hash;
              newUser
                .save()
                .then(() => {
                  req.flash("success_message", "You can now sign in");

                  return res.redirect("/users/signin");
                })
                .catch(err => {
                  req.flash("error_message");
                  console.error("error fron new user save", err);
                });
            })
          );
        }
      });
    }
  });

//Signout handle
router.get("/signout", (req, res) => {
  req.logout();
  req.flash("success_message", "You are logged out");
  res.redirect("/users/signin");
});

module.exports = router;
