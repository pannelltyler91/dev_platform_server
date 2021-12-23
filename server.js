require("dotenv").config();
const express = require("express");

const cors = require("cors");
//const fileUpload = require('express-fileupload');
const app = express();
const port = process.env.PORT || 3001;

const userRoutes = require("./routes/user");
const chatRoutes = require('./routes/chats')
const messageRoutes = require('./routes/messages')

app.use("/user", userRoutes);
app.use("/chat", chatRoutes)
app.use("/message", messageRoutes)

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

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
