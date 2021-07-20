const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const user = require("../model/user");
const https = require("https");

const request = require("request");

// gettin request from database
router.get("/", (req, res, next) => {
  User.find()
    .then((result) => {
      res.status(200).json({ UserData: result });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// signing up or registering data to server and thereafter postin data in database

router.post("/register", (req, res) => {
  console.log("register......", req.body);
  req.body.email = req.body.username;
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: err });
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: hash,
        phone: req.body.phone,
        address: req.body.address,
      });
      user
        .save()
        .then((result) => {
          console.log(result);
          res.status(200).json({ new_user: result });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    }
  });
});

// for login

router.post("/login", async (req, res, next) => {
  console.log(req.body);

  // let userData = await user.findOne({email: req.body.username})
  // console.log(userData);

  // res.json({success: true, data: userData})

  // return

  // try {

  // } catch (error) {

  // }

  User.find({ email: req.body.username })
    .exec()
    .then((user) => {
      if (user.length == 0) {
        return res.status(401).json({ msg: "user not exist" });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (!result) {
          return res.status(401).json({ msg: "password matching failed" });
        }
        if (result) {
          const token = jwt.sign(
            {
              name: user[0].name,
              email: user[0].email,
              phone: user[0].phone,
              address: user[0].address,
            },
            "secret key",
            { expiresIn: "1h" }
          );
          res.status(200).json({
            name: user[0].name,
            email: user[0].email,
            phone: user[0].phone,
            address: user[0].address,
            token: token,
          });
        }
      });
    })
    .catch((err) => {
      res.status(500).json({ err: err });
    });
});

//let callAPITest = () => {
  // let url = `https://api.github.com/users/hsinha21/repos`

  // let username = "";

  //   var options = {
  //     host: "api.github.com",
  //     path: "/users/" + username + "/repos",
  //     method: "GET",
  //   };

  //   console.log(options);

  //   https.request(options, (error, res) => {
  //     if (error) console.log(error);
  //     else {
  //         var body = '';
  //         res.on("data", function(chunk){
  //             body += chunk.toString('utf8');
  //         });

  //         console.log(body);
  //     }
  //   });

  request.get(
    {
      header: { "Content-Type": "application/json" },
      url: url,
      observer: "response",
    },
    (error, response, body) => {
      if (error) console.log(error);
      else {
        console.log(body);
      }
    }
  );

  // fetch(url, (error, res) => {
  //     if(error) console.log(error);
  //     else {
  //         console.log(body);
  //     }
  // })

  // fetch({
  //     url: url
  // }, (error, res)=>{
  //     if(error) console.log(error);
  //     else {
  //         console.log(body);
  //     }
  // })
//};

// callAPITest();

router.get("/thirdPartyData/:name", (req, res) => {
  console.log(req.params.name);

//   let searchQuery = req.params.name;
//   let CLIENT_ID = "ae855444f71f8a1a5b78";
//   let CLIENT_SECRET = "8e48326f918a5c02306abaf7cbc1ed9951d05713";
//   let url = `https://api.github.com/users/${searchQuery}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;

let users = req.params.name
  let url = `https://api.github.com/users/${users}/repos`

console.log(url);
  request.get(
    {
      headers: { "Content-Type": "application/json", 'User-Agent': 'node.js' },
      url: url,
      observer: "response",
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
        res.status(500).json({success: false, msg: 'Some error occured'})
      }
      else {
        console.log(typeof(body));

        let resData = JSON.parse(body)
        res.json({success: true, msg: 'User git repo data', data: resData})

      }
    }
  );
});

module.exports = router;
