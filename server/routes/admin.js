const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAdmin } = require('../middleware/auth');

// Get overall Admin Dashboard Statistics
router.get('/stats', requireAdmin, (req, res) => {
  try {
    const allUsers = db.getUsers().filter(u => u.role !== 'admin');
    const allInvestments = db.getInvestments();
    const allPayments = db.getPayments();
    const allUserInvestments = db.getUserInvestments();

    // Unique investors who have at least one confirmed investment
    const investorUserIds = new Set(allUserInvestments.map(ui => ui.userId));

    // Payments breakdown
    const pendingPayments = allPayments.filter(p => p.status === 'pending');
    const confirmedPayments = allPayments.filter(p => p.status === 'confirmed');
    const rejectedPayments = allPayments.filter(p => p.status === 'rejected');

    const totalInvestment = confirmedPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
    const pendingAmount = pendingPayments.reduce((acc, p) => acc + Number(p.amount || 0), 0);

    // Business vs Commodity funding split
    const businessFunding = allInvestments
      .filter(i => i.type === 'business')
      .reduce((acc, i) => acc + Number(i.raisedAmount || 0), 0);

    const commodityFunding = allInvestments
      .filter(i => i.type === 'commodity' || i.type === 'community')
      .reduce((acc, i) => acc + Number(i.raisedAmount || 0), 0);

    const activeOpportunities = allInvestments.filter(i => i.status === 'active').length;
    const allWithdrawals = db.getWithdrawals();
    const pendingWithdrawals = allWithdrawals.filter(w => w.status === 'pending');
    const approvedWithdrawals = allWithdrawals.filter(w => w.status === 'approved');

    res.json({
      totalUsers: allUsers.length,
      totalInvestors: investorUserIds.size,
      totalInvestment,
      pendingPaymentsCount: pendingPayments.length,
      pendingPaymentsAmount: pendingAmount,
      confirmedPaymentsCount: confirmedPayments.length,
      rejectedPaymentsCount: rejectedPayments.length,
      pendingWithdrawalsCount: pendingWithdrawals.length,
      pendingWithdrawalsAmount: pendingWithdrawals.reduce((acc, w) => acc + Number(w.payoutAmount || 0), 0),
      approvedWithdrawalsCount: approvedWithdrawals.length,
      businessFunding,
      commodityFunding,
      communityFunding: commodityFunding,
      activeOpportunities,
      totalOpportunities: allInvestments.length
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Error calculating admin statistics.' });
  }
});

// Get user list with portfolio summaries
router.get('/users', requireAdmin, (req, res) => {
  try {
    const allUsers = db.getUsers().map(u => {
      const { passwordHash: _, ...safeUser } = u;
      const userInvestments = db.getUserInvestments(u.id);
      const userPayments = db.getPayments().filter(p => p.userId === u.id);

      const totalInvested = userInvestments.reduce((acc, ui) => acc + Number(ui.amount || 0), 0);
      return {
        ...safeUser,
        totalInvested,
        investmentsCount: userInvestments.length,
        pendingPaymentsCount: userPayments.filter(p => p.status === 'pending').length
      };
    });

    res.json({ users: allUsers });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users list.' });
  }
});

// Get platform settings (UPI ID, Payee, etc.)
router.get('/settings', requireAdmin, (req, res) => {
  res.json({ settings: db.getSettings() });
});

// Update platform settings
router.put('/settings', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({
      message: 'Platform settings updated successfully.',
      settings: updated
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating settings.' });
  }
});

// --- Admin Withdrawal Requests Endpoints ---

// Get all withdrawal requests
router.get('/withdrawals', requireAdmin, (req, res) => {
  try {
    const withdrawals = db.getWithdrawals();
    res.json({ withdrawals });
  } catch (err) {
    console.error('Admin get withdrawals error:', err);
    res.status(500).json({ message: 'Error fetching withdrawal requests.' });
  }
});

// Approve withdrawal request
router.post('/withdrawals/:id/approve', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { payoutTxnId, payoutProofUrl, adminNotes } = req.body;
    const adminId = req.user.id;

    const approved = db.approveWithdrawal(id, adminId, {
      payoutTxnId,
      payoutProofUrl,
      adminNotes
    });

    res.json({
      message: `Withdrawal request ${id} approved successfully! Payout confirmed.`,
      withdrawal: approved
    });
  } catch (err) {
    console.error('Admin approve withdrawal error:', err);
    res.status(400).json({ message: err.message || 'Error approving withdrawal request.' });
  }
});

// Reject withdrawal request
router.post('/withdrawals/:id/reject', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    const rejected = db.rejectWithdrawal(id, adminId, reason);

    res.json({
      message: `Withdrawal request ${id} rejected.`,
      withdrawal: rejected
    });
  } catch (err) {
    console.error('Admin reject withdrawal error:', err);
    res.status(400).json({ message: err.message || 'Error rejecting withdrawal request.' });
  }
});

module.exports = router;

