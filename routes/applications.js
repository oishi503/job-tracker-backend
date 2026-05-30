const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const auth = require('../middleware/auth');

// GET all applications for logged in user
router.get('/', auth, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.userId });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add new application
router.post('/', auth, async (req, res) => {
  try {
    const { company, role, status, dateApplied, notes } = req.body;
    const application = new Application({
      user: req.userId,
      company,
      role,
      status,
      dateApplied,
      notes
    });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update an application
router.put('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE an application
router.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;