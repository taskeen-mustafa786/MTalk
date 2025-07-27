const Contact = require('../models/Contact');
const User = require('../models/User');

exports.getSavedContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id })
      .populate('contact', 'displayName email _id');
    const formatted = contacts.map(entry => ({
      _id: entry.contact._id,
      displayName: entry.contact.displayName,
      email: entry.contact.email
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching saved contacts' });
  }
};

exports.addContactByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const contactUser = await User.findOne({ email });
    if (!contactUser) return res.status(404).json({ message: 'User not found' });

    if (contactUser._id.equals(req.user.id))
      return res.status(400).json({ message: 'You cannot add yourself' });

    const alreadyExists = await Contact.findOne({
      owner: req.user.id,
      contact: contactUser._id
    });

    if (alreadyExists)
      return res.status(409).json({ message: 'Already added' });

    const newContact = new Contact({
      owner: req.user.id,
      contact: contactUser._id
    });

    await newContact.save();
    res.status(201).json({ message: 'Contact added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding contact' });
  }
};
