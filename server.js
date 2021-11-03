
const express = require('express')
const bcrypt = require('bcrypt')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3001
const db = require('./models')
app.use(cors());
app.use(express.json())
app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.get('/api', (req,res) =>{
    res.send('I love coding!')
  })

  app.post('/api/signup', (req,res) =>{
    console.log(req.body);
    db.users.findAll({
      where:{
        username:req.body.username
      }
    }).then((results) =>{
      let hash = bcrypt.hashSync(req.body.password,10)
      if(results.length == 0){
        db.users.create({
          username:req.body.username,
          email:req.body.email,
          password:hash
        })
        res.json({message:'successfully create!',created:true})
      }else{
        res.status(409).json({message:'User already exists',created:false})
      }
    })
    
  })

  app.post('/api/create/profile/:username',(req,res) =>{
    res.send('working')
  })
  



app.listen(port, () =>{
    console.log(`Listening on port: ${port}`)
})