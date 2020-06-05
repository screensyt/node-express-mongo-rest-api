const UserRepository = require("../repository/UserRepository");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { check, validationResult } = require("express-validator");

const repo = new UserRepository();

class AuthController {
  constructor() {}

  checkLogin = [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ];

  doLogin(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      repo.userByEmail(email, function (err, user) {
        if (err) throw err;

        if (!user) {
          return res.status(400).json({ msg: "user does not exist" });
        }

        bcrypt.compare(password, user.password, function (err, isMatch) {
          if (err) throw err;
          if (!isMatch) {
            return res.status(400).json({
              message: "Incorrect Password !",
            });
          }
          const payload = {
            user: {
              id: user.id,
            },
          };

          jwt.sign(
            payload,
            "randomString",
            {
              expiresIn: 3600,
            },
            function (err, token) {
              if (err) throw err;
              res.status(200).json({
                token,
              });
            }
          );
        });
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Server error",
      });
    }
  }

  checkSignUp = [
    check("username", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ];

  doSignUp(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;

    repo.userByEmail(email, function (err, user) {
      console.log(err);
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
    });

    var user = new User({
      username,
      email,
      password,
    });

    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        console.log(err.message);
        res.status(500).send("Error in Saving");
      }

      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          console.log(err.message);
          res.status(500).send("Error in Saving");
        }
        user.password = hash;

        repo.save(user, function (err, savedUser) {
          if (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
          }
          const payload = {
            user: {
              id: user.id,
            },
          };

          jwt.sign(
            payload,
            "randomString",
            {
              expiresIn: 10000,
            },
            (err, token) => {
              if (err) {
                console.log(err.message);
                res.status(500).send("Error in Saving");
              }
              res.status(200).json({
                token,
              });
            }
          );
        });
      });
    });
  }

  doGetMe(req, res) {
    try {
      // request.user is getting fetched from Middleware after token authentication
      repo.userById(req.user.id, function (err, user) {
        if (err) throw err;
        const userWithOutPassword = {
          createdAt: user.createdAt,
          _id: user._id,
          username: user.username,
          email: user.email,
        };
        res.json(userWithOutPassword);
      });
    } catch (e) {
      console.log(e);
      res.send({ message: "Error in Fetching user" });
    }
  }
}

module.exports = AuthController;