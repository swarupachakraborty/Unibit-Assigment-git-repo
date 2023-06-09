const express = require('express')

const bodyParser = require('body-parser')
const route = require('./Router/route.js')
const mongoose = require('mongoose')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


mongoose.connect("mongodb+srv://pragya_user1:tfr9Y2SlmidKsL1L@cluster0.e7bog.mongodb.net/unibitDatabase?retryWrites=true&w=majority", {
    usenewurlParser: true
})
.then(() => console.log("MongoDb is connected..."))
.catch(error => console.log(error)) 

app.use("/", route)

app.listen(process.env.PORT || 3000, function(){
    console.log("Express app running on port " + (process.env.PORT || 3000))
})