const express = require("express");
const cors = require("cors");
const router = express.Router();
const db = require("../models");

router.use(cors());
router.use(express.json());

router.post('/:id', (req, res) => {
    console.log(req.body);
    console.log(typeof parseInt(req.params.id));
    db.messages.create({
        message: req.body.message,
        user_id: parseInt(req.params.id),
        chat_id: parseInt(req.body.chatId)
    })
    res.json({message: 'info received'});
})

router.get('/:id', (req, res) => {
    console.log(req.params.id);
    db.messages.findAll({
        where: {
            chat_id: parseInt(req.params.id)
        }
    }).then((messages) => {
        console.log(messages)
        res.json({message: 'we got it!', messages: messages})
    })
})

module.exports = router;
