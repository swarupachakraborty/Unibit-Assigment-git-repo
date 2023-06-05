
const mongoose = require('mongoose');


const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  numTickets:{
    type:Number,
    required:true
  },
  ticketArray: {
    type: [[[Number]]],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
