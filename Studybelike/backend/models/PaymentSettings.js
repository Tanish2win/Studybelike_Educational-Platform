const mongoose = require('mongoose');

const paymentSettingsSchema = new mongoose.Schema({
  qrCodeImage: {
    type: String,
    default: ''
  },
  qrCodeUpi: {
    type: String,
    default: ''
  },
  paypalClientId: {
    type: String,
    default: ''
  },
  paypalSecret: {
    type: String,
    default: ''
  },
  upiId: {
    type: String,
    default: ''
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  courseAccessPrice: {
    type: Number,
    default: 99
  },
  isPaymentActive: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PaymentSettings', paymentSettingsSchema);

