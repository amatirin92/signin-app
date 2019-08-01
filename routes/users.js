const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

//User Model
const User = require("../models/User");

router
  .get("/signin", (req, res) => {
    res.status(200).render("signin");
  })
  .post("/signin", (req, res) => {
    res.status(200).render("home");
  });

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
                  return res.redirect("/users/signin");
                })
                .catch(err => {
                  console.error("error fron new user save", err);
                });
            })
          );
        }
      });
    }
  });

module.exports = router;
