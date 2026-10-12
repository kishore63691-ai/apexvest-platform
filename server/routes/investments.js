const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAdmin } = require('../middleware/auth');

// Get all investment opportunities with filters
router.get('/', (req, res) => {
  try {
    const { type, category, status, search, minAmount } = req.query;
    let list = db.getInvestments();

    if (type && type !== 'all') {
      list = list.filter(item => item.type.toLowerCase() === type.toLowerCase());
    }

    if (category && category !== 'all') {
      list = list.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== 'all') {
      list = list.filter(item => item.status.toLowerCase() === status.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    if (minAmount) {
      const min = Number(minAmount);
      list = list.filter(item => item.minInvestment <= min);
    }

    // Attach computed fields: remainingAmount, progressPercentage
    const enriched = list.map(item => {
      const raised = Number(item.raisedAmount || 0);
      const target = Number(item.targetAmount || 1);
      const remaining = Math.max(0, target - raised);
      const progress = Math.min(100, Number(((raised / target) * 100).toFixed(1)));
      return {
        ...item,
        remainingAmount: remaining,
        progressPercentage: progress
      };
    });

    res.json({ investments: enriched });
  } catch (err) {
    console.error('Fetch investments error:', err);
    res.status(500).json({ message: 'Error retrieving investments.' });
  }
});

// Get single investment
router.get('/:id', (req, res) => {
  try {
    const item = db.getInvestmentById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Investment opportunity not found.' });
    }

    const raised = Number(item.raisedAmount || 0);
    const target = Number(item.targetAmount || 1);
    const remaining = Math.max(0, target - raised);
    const progress = Math.min(100, Number(((raised / target) * 100).toFixed(1)));

    res.json({
      investment: {
        ...item,
        remainingAmount: remaining,
        progressPercentage: progress
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving investment details.' });
  }
});

// Admin: Create investment
router.post('/', requireAdmin, (req, res) => {
  try {
    const {
      title,
      type,
      category,
      image,
      description,
      targetAmount,
      rate,
      minInvestment,
      unitName,
      tenure,
      expectedReturn,
      riskLevel,
      terms
    } = req.body;

    if (!title || !type || !targetAmount) {
      return res.status(400).json({ message: 'Title, type, and target amount are required.' });
    }

    const normalizedType = (type === 'community' || type === 'commodity') ? 'commodity' : 'business';

    const newInv = db.createInvestment({
      title,
      type: normalizedType, // 'business' or 'commodity'
      category: category || (normalizedType === 'business' ? 'Business Funding' : 'Commodity Reserve'),
      image: image || (normalizedType === 'business'
        ? 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80'),
      description: description || '',
      targetAmount: Number(targetAmount),
      raisedAmount: 0,
      rate: Number(rate) || (normalizedType === 'business' ? 10 : 1000),
      minInvestment: Number(minInvestment) || (normalizedType === 'business' ? 10 : 50),
      unitName: unitName || (normalizedType === 'business' ? 'Lot' : 'Unit'),
      tenure: tenure || '12 Months',
      expectedReturn: expectedReturn || '12-16% Targeted',
      riskLevel: riskLevel || 'Moderate',
      terms: terms || 'Standard investment terms apply.',
      status: 'active'
    });

    res.status(201).json({
      message: 'Investment opportunity created successfully.',
      investment: newInv
    });
  } catch (err) {
    console.error('Create investment error:', err);
    res.status(500).json({ message: 'Error creating investment opportunity.' });
  }
});

// Admin: Update investment (rate, target, status, details)
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.getInvestmentById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Investment not found.' });
    }

    const updates = {};
    const allowed = [
      'title', 'category', 'image', 'description', 'targetAmount',
      'rate', 'minInvestment', 'unitName', 'tenure', 'expectedReturn',
      'riskLevel', 'status', 'terms'
    ];

    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        if (['targetAmount', 'rate', 'minInvestment'].includes(field)) {
          updates[field] = Number(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    const updated = db.updateInvestment(id, updates);
    res.json({
      message: 'Investment updated successfully.',
      investment: updated
    });
  } catch (err) {
    console.error('Update investment error:', err);
    res.status(500).json({ message: 'Error updating investment.' });
  }
});

// Admin: Delete investment
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const success = db.deleteInvestment(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Investment not found.' });
    }
    res.json({ message: 'Investment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting investment.' });
  }
});

// Admin: Get list of confirmed investors in an investment
router.get('/:id/investors', requireAdmin, (req, res) => {
  try {
    const investors = db.getInvestmentInvestors(req.params.id);
    res.json({ investors });
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving investors list.' });
  }
});

// Admin: Draw random lucky winner once target is reached
router.post('/:id/draw-winner', requireAdmin, (req, res) => {
  try {
    const result = db.drawInvestmentWinner(req.params.id, req.user.id);
    res.json({
      message: `Lucky Winner successfully selected! ₹${result.winner.amountWon.toLocaleString('en-IN')} allocated to ${result.winner.userName}.`,
      winner: result.winner,
      investment: result.investment
    });
  } catch (err) {
    console.error('Draw winner error:', err);
    res.status(400).json({ message: err.message || 'Error drawing winner.' });
  }
});

// Admin: Upload/submit payout proof for lucky winner
router.post('/:id/winner-payout-proof', requireAdmin, (req, res) => {
  try {
    const { proofUrl, txnId, notes } = req.body;
    if (!proofUrl && !txnId) {
      return res.status(400).json({ message: 'Proof screenshot URL or Payout UTR is required.' });
    }
    const winner = db.updateWinnerPayoutProof(req.params.id, { proofUrl, txnId, notes }, req.user.id);
    res.json({
      message: 'Payout proof updated and marked as disbursed! Winner has been notified.',
      winner
    });
  } catch (err) {
    console.error('Payout proof error:', err);
    res.status(400).json({ message: err.message || 'Error updating payout proof.' });
  }
});

module.exports = router;
