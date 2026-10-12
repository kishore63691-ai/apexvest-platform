const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticate } = require('../middleware/auth');

// Get notifications for current user/admin
router.get('/', authenticate, (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? 'admin' : req.user.id;
    const list = db.getNotifications(userId);
    res.json({ notifications: list });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving notifications.' });
  }
});

// Mark single notification as read
router.put('/:id/read', authenticate, (req, res) => {
  try {
    db.markNotificationRead(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notification.' });
  }
});

// Mark all as read
router.put('/read-all', authenticate, (req, res) => {
  try {
    const userId = req.user.role === 'admin' ? 'admin' : req.user.id;
    const list = db.getNotifications(userId);
    list.forEach(n => db.markNotificationRead(n.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Error marking all notifications.' });
  }
});

module.exports = router;
