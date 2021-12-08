require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
//const fileUpload = require('express-fileupload');
const app = express();
const port = process.env.PORT || 3001;
const db = require("./models");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;


app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
//app.use(fileUpload());

app.get("/api", (req, res) => {
  res.send("I love coding!");
});

app.post("/user/signup", async (req, res) => {
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

app.post("/user/login", (req, res) => {
  db.users
    .findAll({
      where: {
        username: req.body.username,
      },
    })
    .then((users) => {
      if (users.length == 0) {
        res.status(404).json({ message: "User not found", loggedIn: false });
      } else {
        let user = users[0];
        //console.log(user.id);
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
            userId: user.id
          });
        } else {
          res
            .status(409)
            .json({ message: "Password does not match", loggedIn: false });
        }
      }
    });
});

app.put("/user/:username/profile/create", (req, res) => {
  //console.log(req.body);
  //console.log(req.params.username);

  db.users.findAll({where: {username: req.params.username}})
  .then(users => {
    let user = users[0]
    db.users.update(
      {
        github: req.body.github,
        linkedin: req.body.linkedin,
        portfolio: req.body.portfolio,
        currentLanguages: req.body.knownLanguages,
        newLanguages: req.body.toLearn,
        pic: req.body.userImg
      },
      {
        where: {
          username: req.params.username,
        },
      }
    );
    res.json({ update: true, userId: user.id });
  })

/*   db.users.update(
    {
      github: req.body.github,
      linkedin: req.body.linkedin,
      portfolio: req.body.portfolio,
      currentLanguages: req.body.knownLanguages,
      newLanguages: req.body.toLearn,
      pic: req.body.profilePicType || null,
      pic_name: req.body.profilePicName || null
    },
    {
      where: {
        username: req.params.username,
      },
    }
  );
  res.json({ update: true }); */
});


app.put("/user/:username", (req, res) => {
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


app.get("/user/:username", (req, res) => {
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
        res.json({ user: user, userId: user.id, userImg: user.pic });
      }
    });
});

app.get("/user/:username/users/feed", (req, res) => {
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
      //console.log(user);
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
          //console.log(matchedUsers);
          let newMatchedUsers = matchedUsers.filter(
            (user) => user.username !== req.params.username
          );
          res.json({ matchedUsers: newMatchedUsers, userId: user.id });
        });
    });
});


app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
