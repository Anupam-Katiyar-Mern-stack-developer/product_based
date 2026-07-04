const Contact = require("../models/Contact");
const sendMail = require("../utils/sendMail");

// ==========================
// Add Contact
// ==========================
const addContact = async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body;

    const contact = await Contact.create({
      fullName,
      email,
      phone,
      message,
    });

    // Send Email
    await sendMail(contact);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      contact,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================
// Get All Contacts
// ==========================
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Could not fetch contacts",
    });
  }
};

// ==========================
// Get Single Contact
// ==========================
const getSingleContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findById(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================
// Delete Contact
// ==========================
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  addContact,
  getContacts,
  getSingleContact,
  deleteContact,
};