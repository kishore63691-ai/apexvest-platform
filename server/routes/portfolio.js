const express = require('express');
const router = express.Router();
const db = require('../database');
const { authenticate } = require('../middleware/auth');

// Get user portfolio summary statistics
router.get('/stats', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const userInvestments = db.getUserInvestments(userId);
    const userPayments = db.getPayments().filter(p => p.userId === userId);

    // Confirmed investments
    const totalInvested = userInvestments.reduce((sum, inv) => sum + Number(inv.amount || 0), 0);
    const confirmedCount = userInvestments.length;

    // Dynamic current value: re-evaluating with current live asset rate from db
    const liveInvestments = db.getInvestments();
    let currentPortfolioValue = 0;

    userInvestments.forEach(inv => {
      const liveItem = liveInvestments.find(i => i.id === inv.investmentId);
      if (liveItem && (liveItem.type === 'commodity' || liveItem.type === 'community')) {
        currentPortfolioValue += Number((inv.lots * liveItem.rate).toFixed(2));
      } else {
        // Business investments maintain baseline or appreciation
        currentPortfolioValue += Number(inv.currentValue || inv.amount);
      }
    });

    // Pending investments
    const pendingPayments = userPayments.filter(p => p.status === 'pending');
    const pendingAmount = pendingPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const pendingCount = pendingPayments.length;

    // Estimated returns
    const totalReturns = Math.max(0, currentPortfolioValue - totalInvested);

    res.json({
      totalInvested,
      confirmedCount,
      pendingAmount,
      pendingCount,
      currentPortfolioValue,
      totalReturns,
      roiPercentage: totalInvested > 0 ? Number(((totalReturns / totalInvested) * 100).toFixed(2)) : 0
    });
  } catch (err) {
    console.error('Portfolio stats error:', err);
    res.status(500).json({ message: 'Error fetching portfolio statistics.' });
  }
});

// Get user's detailed confirmed investments
router.get('/investments', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const userInvestments = db.getUserInvestments(userId);
    const liveInvestments = db.getInvestments();

    const allPayments = db.getPayments();

    // Map each investment with live current rate and recalculated market value
    const detailed = userInvestments.map(inv => {
      const liveItem = liveInvestments.find(i => i.id === inv.investmentId);
      const payment = allPayments.find(p => p.id === inv.paymentId || (p.transactionId && p.transactionId === inv.transactionId));
      const currentRate = liveItem ? liveItem.rate : inv.rateAtInvestment;
      const currentValue = liveItem && (liveItem.type === 'commodity' || liveItem.type === 'community')
        ? Number((inv.lots * currentRate).toFixed(2))
        : Number(inv.currentValue || inv.amount);

      const returns = Number((currentValue - inv.amount).toFixed(2));
      const returnsPercentage = inv.amount > 0 ? Number(((returns / inv.amount) * 100).toFixed(2)) : 0;

      return {
        ...inv,
        adminProofUrl: inv.adminProofUrl || payment?.adminProofUrl || null,
        adminNotes: inv.adminNotes || payment?.adminNotes || null,
        currentRate,
        currentValue,
        returns,
        returnsPercentage,
        investmentDetails: liveItem || null
      };
    });

    res.json({ investments: detailed });
  } catch (err) {
    console.error('User investments error:', err);
    res.status(500).json({ message: 'Error retrieving user investments.' });
  }
});

module.exports = router;
