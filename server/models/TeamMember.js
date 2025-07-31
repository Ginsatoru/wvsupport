const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  contacts: {
    telegram: String,
    email: {
      type: String,
      required: true
    },
    phone: String
  }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);