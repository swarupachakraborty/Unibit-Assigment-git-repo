const ticketModel = require('../Models/ticketModel');
const userModel = require('../Models/userModel');
const createTicket = async (req, res) => {
  try {
    const { userId, numTickets, ticketArray } = req.body;

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let tickets = [];

    if (!numTickets && !ticketArray) {
      return res.status(400).json({ message: 'Please provide either numTickets or ticketArray' });
    }

    if (ticketArray) {
      // Custom ticket array provided, use it to create tickets
      if (!Array.isArray(ticketArray)) {
        return res.status(400).json({ message: 'Invalid ticketArray format' });
      }

      for (const ticketData of ticketArray) {
        const ticket = { userId, ticketArray: ticketData };
        const createdTicket = await ticketModel.create(ticket);
        tickets.push(createdTicket._id.toString());
      }
    } else if (numTickets) {
      // Generate the tambola ticket(s) based on numTickets
      if (!/^\d+$/.test(numTickets)) {
        return res.status(400).json({ message: 'Invalid numTickets format' });
      }

      for (let i = 0; i < numTickets; i++) {
        const ticket = generateTambolaTicket();
        const createdTicket = await ticketModel.create({ userId, ticketArray: ticket });
        tickets.push(createdTicket._id.toString());
      }
    }

    res.status(201).json({ ticketIds: tickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Helper function to generate a Tambola ticket
function generateTambolaTicket() {
  const ticket = [];

  // Generate the numbers for each column
  for (let col = 0; col < 9; col++) {
    const column = [];

    // Generate 5 numbers for each row in the column
    for (let row = 0; row < 3; row++) {
      const rowNumbers = [];
      for (let i = 0; i < 5; i++) {
        let num;
        if (i === 0 && row === 0) {
          // Generate a number between startNum and endNum for the top-left cell
          num = Math.floor(Math.random() * 10) + col * 10 + 1;
        } else {
          // Generate a number between startNum and endNum excluding already generated numbers
          const usedNumbers = ticket.flat().filter((n) => n !== 0);
          const availableNumbers = Array.from({ length: 10 }, (_, index) => col * 10 + index + 1)
            .filter((n) => !usedNumbers.includes(n));
          num = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
        }
        rowNumbers.push(num);
      }
      column.push(rowNumbers);
    }

    ticket.push(column);
  }

  return ticket;
}
const fetchTickets = async (req, res) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: 'desc' }, // Sort tickets by createdAt field in descending order
      populate: { path: 'userId', select: 'username' }, // Populate the userId field with username
    };

    const tickets = await ticketModel.paginate({ userId }, options);

    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { fetchTickets };


module.exports = { createTicket };
