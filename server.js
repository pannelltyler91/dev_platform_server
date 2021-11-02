import express from 'express';
import bcrypt from 'bcrypt'
const app = express();
const port = process.env.PORT || 3001
app.use(express.json())
app.use(
    express.urlencoded({
      extended: true,
    })
  );
  



app.listen(port, () =>{
    console.log(`Listening on port: ${port}`)
})