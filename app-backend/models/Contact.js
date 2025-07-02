// models/Contact.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  contact: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

contactSchema.index({ owner: 1, contact: 1 }, { unique: true });

module.exports = mongoose.model('Contact', contactSchema);
