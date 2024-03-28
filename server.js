const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Setting Cors
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  Headers: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// connection o mongodb
const port = 5000;
const db ="mongodb://localhost:27017/crudDb";
mongoose.connect(db).then(()=>{
    // console.log("connected to database");
    app.listen(port, ()=>{
        if (mongoose.connection.readyState === 1){
            console.log(`server is runing on port ${port}`);
        }
    })
})
.catch ((error)=> {
    console.log(`server fail to run on port ${port}`);
    console.log(`mongodb error = ${error}`);
})


//post schema 
const postSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    email: String,
    password: String,
    picture: String,
    number: String,
})
const savedata = mongoose.model("data", postSchema)
 
// create request 
 app.post("/submit", (req, res)=>{
    const newdata = new savedata({
        _id: req.body._id,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        // picture: req.body.picture,
        // number: req.body.number,
    })
    newdata.save().then(()=>{
        res.status(200).send("data stored")
    }).catch((error)=> {
        res.status(500).send(error)
    })
 })


 //delete all request
 app.post("/deleteall",async (req, res) =>{
   try{
    const data= await savedata.deleteMany({})
    res.json(data)
    } catch (error) {
        res.status(500).send(error)
    }
})

//delete one
  app.post("/deleteone", async (req, res)=>{
    const id= req.body.id;
    try{
        const data= await savedata.deleteOne({_id:id})
        res.json(data)
    } catch (error) {
        res.status(500).send(error)
    }
  })


  //edit request
  app.put("/update", async(req, res)=>{
    const id= req.body._id;
    const {username, email, password} = req.body;
    console.log(req.body);
    const edit = {
        username, email, password,
    }
    try{
        const data= await savedata.updateOne({_id:id}, edit )
        res.json(data)
    } catch(error){
        res.status(500).send(error)
    }
  })



//get request
 app.get("/getdata" ,async (req, res)=>{
    try{
        const data= await savedata.find({});
        res.json(data)

    } catch (error){
        console.error(error);
        res.status(500).send(error)
    }
 })


 // Edit request

  