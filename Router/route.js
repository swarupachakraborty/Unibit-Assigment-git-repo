const express = require('express')
const router = express.Router()
 const { authentication,authorization } = require("../Middleware/auth")

const {userforTicket,userLogin} = require("../Controller/userController")
const{createTicket,fetchTickets}=require("../Controller/ticketController")
//---USER APIS---//
//==Register User
router.post('/register',userforTicket)

//==Login User
router.post('/login', userLogin)
//==Ticket creation and Fetching
router.post('/ticket',createTicket) 
 router.get('/fetch/',authentication,authorization,fetchTickets)
module.exports = router 