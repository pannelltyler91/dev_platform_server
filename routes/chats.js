const express = require("express");
const cors = require("cors");
const router = express.Router();
const db = require("../models");

router.use(cors());
router.use(express.json());

router.post("/create/:user2_name", (req, res) => {
  
  db.chats
    .findAll({
      where: {
        user1: req.body.currentUserId,
        user2: req.body.otherUserId,
      },
    })
    .then((chats) => {
      if (chats.length == 0) {
        db.chats.create({
          user1: req.body.currentUserId,
          user2: req.body.otherUserId,
          user2_name: req.params.user2_name
        });
        res
          .status(201)
          .json({ created: true, message: "Chat has been created" });
      } else {
        res
          .status(409)
          .json({ created: false, message: "chat already exists" });
      }
    });
});

router.get('/:user1/:user2', (req,res) =>{
  console.log(req.params.user1)
  console.log(req.params.user2)
  db.chats.findAll({
    where:{
      user1:req.params.user1,
      user2:req.params.user2
    }
  }).then((chats) =>{
    if(chats.length > 0){
      let chat = chats[0]
      console.log(chat.id)
      res.status(200).json({chatId:chat.id, newChat:false})

      //still need to create messages table with foreign keys, find messages and send back to front
    } else{ 
      db.chats.create({
        user1:req.params.user1,
        user2:req.params.user2
      })
      .then((results)=>{ 
        console.log(results)
      })
    }
  })
})

router.get('/:id', (req,res) =>{
  console.log(req.params.id)
  db.chats.findAll({
    where:{
      user1:req.params.id
    }
  }).then((chats) =>{
    if(chats.length == 0){
      res.json({message:'your inbox is empty', existingChats:false})
    }else{
      res.json({existingChats:true,chats:chats})
    }
  })
  
})

module.exports = router;
