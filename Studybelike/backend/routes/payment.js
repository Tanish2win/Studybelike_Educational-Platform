const express = require('express');
const router = express.Router();
const PaymentSettings = require('../models/PaymentSettings');
const jwt = require('jsonwebtoken');

// Get payment settings (public)
router.get('/', async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = new PaymentSettings();
      await settings.save();
    }
    const publicSettings = {
      qrCodeImage: settings.qrCodeImage,
      qrCodeUpi: settings.qrCodeUpi,
      upiId: settings.upiId,
      courseAccessPrice: settings.courseAccessPrice,
      isPaymentActive: settings.isPaymentActive,
      bankDetails: settings.bankDetails ? {
        accountName: settings.bankDetails.accountName,
        bankName: settings.bankDetails.bankName
      } : null
    };
    res.json(publicSettings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update payment settings (admin only)
router.put('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = new PaymentSettings();
    }

    if (req.body.qrCodeImage) settings.qrCodeImage = req.body.qrCodeImage;
    if (req.body.qrCodeUpi) settings.qrCodeUpi = req.body.qrCodeUpi;
    if (req.body.paypalClientId) settings.paypalClientId = req.body.paypalClientId;
    if (req.body.paypalSecret) settings.paypalSecret = req.body.paypalSecret;
    if (req.body.upiId) settings.upiId = req.body.upiId;
    if (req.body.bankDetails) settings.bankDetails = req.body.bankDetails;
    if (req.body.courseAccessPrice) settings.courseAccessPrice = req.body.courseAccessPrice;
    if (req.body.isPaymentActive !== undefined) settings.isPaymentActive = req.body.isPaymentActive;
    
    settings.updatedAt = Date.now();
    await settings.save();
    
    res.json({ message: 'Payment settings updated successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Upload QR code image (admin only)
router.post('/upload-qr', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { qrCodeImage } = req.body;
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = new PaymentSettings();
    }
    settings.qrCodeImage = qrCodeImage;
    settings.updatedAt = Date.now();
    await settings.save();
    
    res.json({ message: 'QR code uploaded successfully', qrCodeImage });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
