// controllers/contactController.js
const Contact = require('../models/Contact');
const User = require('../models/User');

exports.getSavedContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id }).populate('contact', 'displayName _id');
    const formatted = contacts.map((entry) => entry.contact);
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching saved contacts' });
  }
};

exports.addContact = async (req, res) => {
  try {
    const { contactId } = req.body;
    if (!contactId) return res.status(400).json({ message: 'Contact ID required' });

    const alreadyExists = await Contact.findOne({ owner: req.user.id, contact: contactId });
    if (alreadyExists) return res.status(409).json({ message: 'Already added' });

    const newContact = new Contact({ owner: req.user.id, contact: contactId });
    await newContact.save();

    res.status(201).json({ message: 'Contact added' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding contact' });
  }
};
