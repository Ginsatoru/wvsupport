const mongoose = require('mongoose');

// Bilingual text (Khmer empty = show English)
const text = new mongoose.Schema(
  { en: { type: String, default: '', trim: true }, km: { type: String, default: '', trim: true } },
  { _id: false }
);

// One row on the Contact page's "Business Hours" card
const hoursRow = new mongoose.Schema(
  { day: { type: text, default: () => ({}) }, time: { type: text, default: () => ({}) } },
  { _id: false }
);

const DEFAULT_HOURS = [
  { day: { en: 'Monday - Friday', km: 'ច័ន្ទ - សុក្រ' }, time: { en: '09:00 - 20:00', km: '០៩.០០ - ២០.០០' } },
  { day: { en: 'Saturday', km: 'សៅរ៍' }, time: { en: '10:30 - 22:30', km: '១០.៣០ - ២២.៣០' } },
  { day: { en: 'Sunday', km: 'អាទិត្យ' }, time: { en: '10:30 - 22:30', km: '១០.៣០ - ២២.៣០' } },
];

const SettingsSchema = new mongoose.Schema({
  logo: { type: String, default: '' },
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  mapEmbedCode: { type: String, required: false },
  businessHours: { type: [hoursRow], default: DEFAULT_HOURS },
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