const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { secret } = require('../config');
const userModel = require('../Models/userModel');
const { isValidRequestBody,isValidEmail, isValid,isValidName,  isValidPassword } = require("../utility/validator");


//
const userforTicket = async function (req, res) {
    try{
//==validating request body==//
     let requestBody = req.body
     if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Invalid request, please provide details" })
     let { username,email,password } = requestBody

//==validating name==//
    if (!isValid(username)) return res.status(400).send({ status: false, msg: "Name is a mandatory field" })
    if (!isValidName(username)) return res.status(400).send({ status: false, msg: "Name must contain only alphabates" })

    //==checking and validating email==//
    if (email == "") { return res.status(400).send({ status: false, message: "email is not valid" }) }
    else if (email) {
        if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })
    }



//==validating password==//
    if (!isValid(password)) return res.status(400).send({ status: false, msg: "Password is a mandatory field" })
    if (!isValidPassword(password)) return res.status(400).send({ status: false, msg: `Password ${password}  must include atleast one special character[@$!%?&], one uppercase, one lowercase, one number and should be mimimum 8 to 15 characters long` })

//  hashing==//
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt)



//==creating user==//    
    const userData = { username,email,password };
    const saveUser = await userModel.create( userData)
    return res.status(201).send({ status: true, message: "User profile details", data: saveUser })
    }catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
    
}

//*******************************************************************//


const userLogin = async function(req,res){
    try {
//==validating request body==//
     let requestBody = req.body
    if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Invalid request, please provide details"})  
    const {email, password} = requestBody;

    //==checking and validating email==//
    if (email == "") { return res.status(400).send({ status: false, message: "email is not valid" }) }
    else if (email) {
        if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: "email is not valid" })
    }

       
//==validating password==//
    if(!isValid(password))return res.status(400).send({status:false, message: `Password is required`})
           
//==finding userDocument==//      
const user = await userModel.findOne({ email });

if (!user) {
    res.status(404).send({ status: false, message: `${email} related user unavailable` });
    return
}
const isLogin = await bcrypt.compare(password, user.password).catch(e => false)
if (!isLogin) {
    res.status(401).send({ status: false, message: `wrong email address or password` });
    return
}
        
//==creating token==//   
let token = jwt.sign(
    {
        userId:  user._id.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 96 * 60 * 60 //4days
    },
    "my secret key"
);
 
//==sending and setting token==// 
       res.header('Authorization',token);
       res.status(200).send({status:true, message:`User login successfully`, data:{token}});

   } catch (error) {
       res.status(500).send({status:false, message:error.message});
   }
}


module.exports={userforTicket,userLogin}



