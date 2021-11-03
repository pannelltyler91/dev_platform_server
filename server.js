import express from 'express';
import bcrypt from 'bcrypt'
import cors from 'cors'
const app = express();
const port = process.env.PORT || 3001

app.use(cors());
app.use(express.json())
app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.get('/', (req,res) =>{
    res.send('I love coding!')
  })
  



app.listen(port, () =>{
    console.log(`Listening on port: ${port}`)
})