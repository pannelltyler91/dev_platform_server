const express = require('express')
const db = require("../models");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");
const router = express.Router()
const cors = require("cors");
//const shortUrl = require('node-url-shortener');

router.use(cors());
router.use(express.json());


/* shortUrl.short('https://www.google.com/search?q=how+to+shorten+url+in+node+js&biw=1067&bih=765&sxsrf=AOaemvIxiG411NLgvig-VK-u9U7hgXyhAQ%3A1641082435237&ei=Q-7QYc-CDvfF0PEPyfGg-AM&ved=0ahUKEwiPsOW85JH1AhX3IjQIHck4CD8Q4dUDCA8&uact=5&oq=how+to+shorten+url+in+node+js&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEIAEMggIABCGAxCLAzIICAAQhgMQiwMyCAgAEIYDEIsDMggIABCGAxCLAzoHCAAQRxCwA0oECEEYAEoECEYYAFCiBFiiBGCVCWgCcAJ4AIABuwOIAbsDkgEDNC0xmAEAoAEByAEIuAEBwAEB&sclient=gws-wiz', function(err, url) {
    console.log(url);
}); */


router.post("/signup", (req, res) => {
    console.log(req.body);
    db.users
      .findAll({
        where: {
          username: req.body.username,
        },
      })
      .then((results) => {
        let hash = bcrypt.hashSync(req.body.password, 10);
        if (results.length == 0) {
          db.users.create({
            username: req.body.username,
            email: req.body.email,
            password: hash,
          });
          res
            .status(201)
            .json({ message: "successfully create!", created: true });
        } else {
          res
            .status(409)
            .json({ message: "User already exists", created: false });
        }
      });
  });
  
  router.post("/login", (req, res) => {
    db.users
      .findAll({
        where: {
          username: req.body.username,
        },
      })
      .then((users) => {
        console.log(users);
        if (users.length == 0) {
          res.status(404).json({ message: "User not found", loggedIn: false });
        } else {
          let user = users[0];
          if (bcrypt.compareSync(req.body.password, user.password)) {
            const accessToken = jwt.sign(
              { user },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: 60 * 60 }
            );
            res.status(200).json({
              message: "Login was successful",
              loggedIn: true,
              accessToken: accessToken,
              userId:user.id
            });
          } else {
            res
              .status(409)
              .json({ message: "Password does not match", loggedIn: false });
          }
        }
      });
  });
  

  router.put("/:username/profile/create", (req, res) => {
    //console.log(req.body);
    //console.log(req.params.username);
  
    db.users.update(
      {
        github: req.body.github,
        linkedin: req.body.linkedin,
        portfolio: req.body.portfolio,
        currentLanguages: req.body.knownLanguages,
        newLanguages: req.body.toLearn,
        pic: req.body.userImg,
      },
      {
        where: {
          username: req.params.username,
        },
      }
    ) 
    db.users.findAll({
      where:{
        username:req.params.username
      }
    }).then((users) => {
      let user = users[0]
      res.json({ update: true, userId:user.id });
    })
  });
  


  router.put("/:username", (req, res) => {
    console.log(req.body);
    console.log(req.params.username);
    db.users.update(
      { banner: req.body.data },
      {
        where: {
          username: req.params.username,
        },
      }
    );
    res.json({ message: "its working" });
  });
  

  router.get("/:username", (req, res) => {
    db.users
      .findAll({
        where: {
          username: req.params.username,
        },
      })
      .then((users) => {
        for (let i = 0; i < users.length; i++) {
          users[i].password = undefined;
          let user = users[0];

          res.json({ user:user, pic:user.pic, userId:user.id });

        }
      });
  });


  router.get("/:username/users/feed", (req, res) => {
    //finds current user to cross-reference languages
    db.users
      .findAll({
        where: {
          username: req.params.username,
        },
      })
  
      //searches users and compares current user currentLanguages for potential matches newLanguages and vice versa
      .then((users) => {
        let user = users[0];
        console.log(user);
        db.users
          .findAll({
            where: {
              currentLanguages: {
                [Op.overlap]: user.newLanguages,
              },
              newLanguages: {
                [Op.overlap]: user.currentLanguages,
              },
            },
          })
          //filters matched users so that current user is not included in results
          .then((matchedUsers) => {
            console.log(matchedUsers);
            let newMatchedUsers = matchedUsers.filter(
              (user) => user.username !== req.params.username
            );
            res.json({ matchedUsers: newMatchedUsers,userId:user.id });
          });
      });
  });

  module.exports = router