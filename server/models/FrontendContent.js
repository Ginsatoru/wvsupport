const mongoose = require('mongoose');

const frontendContentSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  paragraph: {
    type: String,
    required: true
  },
  imagePath: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FrontendContent', frontendContentSchema);