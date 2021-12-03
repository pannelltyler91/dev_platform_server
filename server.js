require("dotenv").config();
const express = require("express");

const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;




const userRoutes = require('./routes/user')

app.use('/user', userRoutes)

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


app.get("/api", (req, res) => {
  res.send("I love coding!");
});



app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
