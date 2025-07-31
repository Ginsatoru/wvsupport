const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  logo: { type: String, default: '' },
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  mapEmbedCode: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

// Ensure there's only one settings document
SettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      companyName: 'WV Support Services Cambodia',
      address: 'Phum Thmey, Sangkat Svay Dankum, Siem Reap Cambodia',
      phoneNumber: '+855 974 839 135',
      email: 'wvsservicescambodia@gmail.com',
      mapEmbedCode: '<iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7764.40225166468!2d103.8387237!3d13.3377616!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sau!4v1749446170018!5m2!1sen!2sau" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    });
  }
  return settings;
};

module.exports = mongoose.model('Settings', SettingsSchema);