const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contact: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    displayName: {
      type: String, // 👈 Display name given by the owner
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'blocked'],
      default: 'active',
    }
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate contacts for the same owner
contactSchema.index({ owner: 1, contact: 1 }, { unique: true });

// Clean up JSON
contactSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Contact', contactSchema);
