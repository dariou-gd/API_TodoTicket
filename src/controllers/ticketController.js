const ticketController = {};

import ticketModel from "../models/tickets.js";

ticketController.getTicket = async (req, res) => {
  try {
    const tickets = await ticketModel.find();
    return res.status(200).json(tickets);
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

ticketController.insertTicket = async (req, res) => {
  try {
    const {
      customerId,
      quantity,
      purchaseDate,
      total,
      paymentStatus,
      transactionId,
    } = req.body;

    const newTicket = new ticketModel ({
      customerId,
      quantity,
      purchaseDate,
      total,
      paymentStatus,
      transactionId,
    });

    await newTicket.save();

    return res.status(200).json({ message: "Ticket saved" });
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

ticketController.deleteTicket = async (req, res) => {
  try {
    const deleteTicket = await ticketModel.findByIdAndDelete(req.params.id);

    if (!deleteTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ message: "Ticket deleted" });
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

ticketController.updateTicket = async (req, res) => {
  try {
    let {
      name,
      lastname,
      email,
      password,
      isVerified,
      loginAttempts,
      timeOut,
    } = req.body;

    const updateTicket = await ticketModel.findByIdAndUpdate(req.params.id, {
      name,
      lastname,
      email,
      password,
      isVerified,
      loginAttempts,
      timeOut,
    },
    {
        new: true
    });

    if (!updateTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({ message: "Ticket updated" });
  } catch (error) {
    console.log("Error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default ticketController;
