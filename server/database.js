const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Default initial state
function getInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);
  const userPasswordHash = bcrypt.hashSync('investor123', salt);

  return {
    users: [
      {
        id: 'USR-ADMIN-01',
        name: 'Platform Administrator',
        email: 'admin@investment.com',
        mobile: '+91 98765 43210',
        passwordHash: adminPasswordHash,
        role: 'admin',
        kycStatus: 'verified',
        createdAt: '2026-09-01T10:00:00.000Z'
      },
      {
        id: 'USR-10025',
        name: 'Rahul Sharma',
        email: 'investor@demo.com',
        mobile: '+91 98123 45678',
        passwordHash: userPasswordHash,
        role: 'user',
        kycStatus: 'verified',
        createdAt: '2026-09-15T12:00:00.000Z'
      }
    ],
    investments: [
      {
        id: 'BIZ-101',
        title: 'ABC Jute Industries',
        type: 'business',
        category: 'Jute Business',
        image: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
        description: 'Eco-friendly biodegradable jute sack manufacturing plant modernising looms for export packaging supply. Established factory with 7-year profitable track record.',
        targetAmount: 500000,
        raisedAmount: 275000,
        rate: 10, // ₹10 per lot
        minInvestment: 10,
        unitName: 'Lot',
        tenure: '12 Months',
        expectedReturn: '16.5% Annualized',
        riskLevel: 'Moderate',
        investorCount: 142,
        status: 'active',
        terms: 'Quarterly interest disbursement with principal redemption at maturity (12 months). Security held in industrial weaving equipment pledge.',
        createdAt: '2026-09-10T08:00:00.000Z'
      },
      {
        id: 'BIZ-102',
        title: 'Green Agro Hydroponics Hub',
        type: 'business',
        category: 'AgriTech',
        image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
        description: 'Smart climate-controlled hydroponic farming producing pesticide-free exotic vegetables for premier supermarket chains across Western India.',
        targetAmount: 1200000,
        raisedAmount: 840000,
        rate: 10, // ₹10 per lot
        minInvestment: 10,
        unitName: 'Lot',
        tenure: '18 Months',
        expectedReturn: '18.0% Annualized',
        riskLevel: 'Moderate',
        investorCount: 218,
        status: 'active',
        terms: 'Bi-monthly profit share distribution. 100% of greenhouse assets and solar pumping units hypothecated as collateral.',
        createdAt: '2026-09-12T09:30:00.000Z'
      },
      {
        id: 'BIZ-103',
        title: 'VoltGrid Micro-Solar Stations',
        type: 'business',
        category: 'Clean Energy',
        image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        description: 'Decentralized 50kW solar mini-grids powering rural commercial workshops and cold storage centers with 10-year PPA off-take agreements.',
        targetAmount: 1500000,
        raisedAmount: 1450000,
        rate: 10,
        minInvestment: 10,
        unitName: 'Lot',
        tenure: '24 Months',
        expectedReturn: '15.2% Annualized',
        riskLevel: 'Low',
        investorCount: 310,
        status: 'active',
        terms: 'Government-backed PPA contract assignment with quarterly scheduled yields and asset buyback guarantee.',
        createdAt: '2026-09-05T14:15:00.000Z'
      },
      {
        id: 'COMM-201',
        title: 'Digital 24K Physical Gold Vault',
        type: 'commodity',
        category: 'Gold',
        image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80',
        description: 'Securitized 99.9% fine LBMA-accredited gold bullion held in insured Brinks vaults. Admin updates real-time gram rate based on spot bullion market.',
        targetAmount: 1000000,
        raisedAmount: 650000,
        rate: 15000, // Admin sets current rate
        minInvestment: 50,
        unitName: 'Unit (0.01g equivalent)',
        tenure: 'Flexible Liquidity',
        expectedReturn: 'Bullion Spot Appreciation + Physical Delivery Option',
        riskLevel: 'Low',
        investorCount: 184,
        status: 'active',
        terms: '100% physically backed by insured vaults. User may hold or request liquidity redemption based on active daily bullion rates.',
        createdAt: '2026-09-01T06:00:00.000Z'
      },
      {
        id: 'COMM-202',
        title: 'Pure 999 Silver Reserve',
        type: 'commodity',
        category: 'Silver',
        image: 'https://images.unsplash.com/photo-1624365168968-f283a546c1a8?auto=format&fit=crop&w=800&q=80',
        description: 'Institutional grade 99.9% fine silver bars stored in audited depository. Industrial green transition demands driving long-term value.',
        targetAmount: 600000,
        raisedAmount: 310000,
        rate: 950, // Silver rate set by Admin
        minInvestment: 50,
        unitName: 'Unit (10g equivalent)',
        tenure: 'Flexible Liquidity',
        expectedReturn: 'Commodity Upside + Storage Verification',
        riskLevel: 'Moderate',
        investorCount: 95,
        status: 'active',
        terms: 'Audited monthly by independent chartered inspectors. Full custody certificates issued.',
        createdAt: '2026-09-08T11:20:00.000Z'
      },
      {
        id: 'COMM-203',
        title: 'Metro Highway Commercial Land Parcel',
        type: 'commodity',
        category: 'Land',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
        description: 'Prime fractional commercial land acquisition adjacent to Outer Ring Road logistics corridor. Clear title with DTCP approved boundary zoning.',
        targetAmount: 5000000,
        raisedAmount: 3450000,
        rate: 25000, // Rate per square yard fraction set by Admin
        minInvestment: 500,
        unitName: 'Sq. Yard Fraction',
        tenure: '36 Months',
        expectedReturn: 'Capital Appreciation 20-25% Target',
        riskLevel: 'Moderate',
        investorCount: 167,
        status: 'active',
        terms: 'Fractional undivided share of land registered through SPV custodial deed with exit upon commercial development lease.',
        createdAt: '2026-09-02T16:00:00.000Z'
      }
    ],
    payments: [
      {
        id: 'PAY-10025-01',
        userId: 'USR-10025',
        userName: 'Rahul Sharma',
        userEmail: 'investor@demo.com',
        investmentId: 'COMM-201',
        investmentTitle: 'Digital 24K Physical Gold Vault',
        investmentType: 'community',
        amount: 500,
        lots: 0.0333,
        rateAtInvestment: 15000,
        transactionId: 'TXN123456789',
        paymentDate: '2026-10-01',
        screenshotUrl: null,
        status: 'confirmed',
        adminNotes: 'Verified against bank credit ledger',
        rejectionReason: '',
        createdAt: '2026-10-01T10:15:00.000Z',
        verifiedAt: '2026-10-01T11:00:00.000Z',
        verifiedBy: 'USR-ADMIN-01'
      },
      {
        id: 'PAY-10025-02',
        userId: 'USR-10025',
        userName: 'Rahul Sharma',
        userEmail: 'investor@demo.com',
        investmentId: 'BIZ-101',
        investmentTitle: 'ABC Jute Industries',
        investmentType: 'business',
        amount: 2500,
        lots: 250,
        rateAtInvestment: 10,
        transactionId: 'TXN987654321',
        paymentDate: '2026-10-03',
        screenshotUrl: null,
        status: 'confirmed',
        adminNotes: 'IMPS reference verified',
        rejectionReason: '',
        createdAt: '2026-10-03T14:30:00.000Z',
        verifiedAt: '2026-10-03T15:00:00.000Z',
        verifiedBy: 'USR-ADMIN-01'
      },
      {
        id: 'PAY-DEMO-PENDING',
        userId: 'USR-10025',
        userName: 'Rahul Sharma',
        userEmail: 'investor@demo.com',
        investmentId: 'BIZ-102',
        investmentTitle: 'Green Agro Hydroponics Hub',
        investmentType: 'business',
        amount: 5000,
        lots: 500,
        rateAtInvestment: 10,
        transactionId: 'UTR883921004',
        paymentDate: '2026-10-07',
        screenshotUrl: null,
        status: 'pending',
        adminNotes: '',
        rejectionReason: '',
        createdAt: '2026-10-07T08:00:00.000Z',
        verifiedAt: null,
        verifiedBy: null
      }
    ],
    user_investments: [
      {
        id: 'INV-10025',
        userId: 'USR-10025',
        investmentId: 'COMM-201',
        investmentTitle: 'Digital 24K Physical Gold Vault',
        investmentType: 'community',
        paymentId: 'PAY-10025-01',
        transactionId: 'TXN123456789',
        amount: 500,
        lots: 0.0333,
        rateAtInvestment: 15000,
        purchaseDate: '2026-10-01T11:00:00.000Z',
        currentRate: 15000,
        currentValue: 500,
        status: 'confirmed'
      },
      {
        id: 'INV-10026',
        userId: 'USR-10025',
        investmentId: 'BIZ-101',
        investmentTitle: 'ABC Jute Industries',
        investmentType: 'business',
        paymentId: 'PAY-10025-02',
        transactionId: 'TXN987654321',
        amount: 2500,
        lots: 250,
        rateAtInvestment: 10,
        purchaseDate: '2026-10-03T15:00:00.000Z',
        currentRate: 10,
        currentValue: 2568, // slightly accrued return
        status: 'confirmed'
      }
    ],
    notifications: [
      {
        id: 'NOTIF-01',
        userId: 'USR-10025',
        title: 'Investment Confirmed',
        message: 'Your investment of ₹2,500 in ABC Jute Industries has been verified and confirmed by Admin.',
        type: 'success',
        isRead: false,
        createdAt: '2026-10-03T15:01:00.000Z'
      },
      {
        id: 'NOTIF-02',
        userId: 'USR-10025',
        title: 'Payment Under Verification',
        message: 'Payment of ₹5,000 (UTR883921004) submitted for Green Agro Hydroponics Hub. Admin verification in progress.',
        type: 'info',
        isRead: false,
        createdAt: '2026-10-07T08:00:00.000Z'
      },
      {
        id: 'NOTIF-ADMIN-01',
        userId: 'admin',
        title: 'New Payment Pending Verification',
        message: 'Rahul Sharma submitted payment of ₹5,000 for Green Agro Hydroponics Hub (Ref: UTR883921004).',
        type: 'alert',
        isRead: false,
        createdAt: '2026-10-07T08:00:00.000Z'
      }
    ],
    settings: {
      upiId: 'growcapital@icici',
      payeeName: 'Apex Capital Ventures Ltd',
      supportEmail: 'compliance@growcapital.in',
      supportPhone: '+91 80 4910 8800',
      minLotSize: 10,
      disclaimerNotice: 'Investments are subject to market, commodity and business risk. Please read full risk disclosures before proceeding.'
    }
  };
}

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      this.write(initial);
      console.log('Initialized database with rich seed data.');
    }
  }

  read() {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Error reading DB, restoring initial state', err);
      const initial = getInitialData();
      this.write(initial);
      return initial;
    }
  }

  write(data) {
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  }

  // --- Users ---
  getUsers() {
    return this.read().users;
  }

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  }

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(userData) {
    const data = this.read();
    const newUser = {
      id: `USR-${Date.now().toString().slice(-5)}`,
      kycStatus: 'verified',
      role: 'user',
      createdAt: new Date().toISOString(),
      ...userData
    };
    data.users.push(newUser);
    this.write(data);
    return newUser;
  }

  updateUser(id, updates) {
    const data = this.read();
    const idx = data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    data.users[idx] = { ...data.users[idx], ...updates };
    this.write(data);
    return data.users[idx];
  }

  // --- Investments ---
  getInvestments() {
    return this.read().investments;
  }

  getInvestmentById(id) {
    return this.getInvestments().find(i => i.id === id);
  }

  createInvestment(item) {
    const data = this.read();
    const prefix = item.type === 'business' ? 'BIZ' : 'COMM';
    const newInv = {
      id: `${prefix}-${Date.now().toString().slice(-4)}`,
      raisedAmount: 0,
      investorCount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      ...item
    };
    data.investments.push(newInv);
    this.write(data);
    return newInv;
  }

  updateInvestment(id, updates) {
    const data = this.read();
    const idx = data.investments.findIndex(i => i.id === id);
    if (idx === -1) return null;

    // Check if target reached -> auto mark fully_funded
    const updated = { ...data.investments[idx], ...updates };
    if (updated.raisedAmount >= updated.targetAmount && updated.status === 'active') {
      updated.status = 'fully_funded';
    }

    data.investments[idx] = updated;

    // If rate changed for commodity / community asset, update current value for active user investments!
    if (updates.rate && (updated.type === 'commodity' || updated.type === 'community')) {
      data.user_investments = data.user_investments.map(ui => {
        if (ui.investmentId === id) {
          return {
            ...ui,
            currentRate: updates.rate,
            currentValue: Number((ui.lots * updates.rate).toFixed(2))
          };
        }
        return ui;
      });
    }

    this.write(data);
    return updated;
  }

  deleteInvestment(id) {
    const data = this.read();
    const idx = data.investments.findIndex(i => i.id === id);
    if (idx === -1) return false;
    data.investments.splice(idx, 1);
    this.write(data);
    return true;
  }

  // --- Lucky Draw & Winner Management ---
  getInvestmentInvestors(investmentId) {
    const data = this.read();
    // Confirmed user investments for this campaign
    const records = data.user_investments.filter(ui => ui.investmentId === investmentId);
    
    // Group by unique user
    const userMap = new Map();
    records.forEach(r => {
      const u = data.users.find(user => user.id === r.userId);
      if (!userMap.has(r.userId)) {
        userMap.set(r.userId, {
          userId: r.userId,
          name: u?.name || 'Investor',
          email: u?.email || '',
          mobile: u?.mobile || '',
          totalInvested: 0,
          totalLots: 0,
          investmentCount: 0
        });
      }
      const existing = userMap.get(r.userId);
      existing.totalInvested += Number(r.amount);
      existing.totalLots += Number(r.lots);
      existing.investmentCount += 1;
    });

    return Array.from(userMap.values());
  }

  drawInvestmentWinner(investmentId, adminId) {
    const data = this.read();
    const inv = data.investments.find(i => i.id === investmentId);
    if (!inv) throw new Error('Investment not found');

    if (inv.status !== 'fully_funded' && inv.raisedAmount < inv.targetAmount) {
      throw new Error('Lucky draw can only be conducted once the target amount is reached (100% funded).');
    }

    const eligibleInvestors = this.getInvestmentInvestors(investmentId);
    if (eligibleInvestors.length === 0) {
      throw new Error('No confirmed investors found for this investment.');
    }

    // Pick a random investor
    const randomIndex = Math.floor(Math.random() * eligibleInvestors.length);
    const winnerInvestor = eligibleInvestors[randomIndex];
    const amountWon = Number(inv.targetAmount || inv.raisedAmount);

    inv.winner = {
      userId: winnerInvestor.userId,
      userName: winnerInvestor.name,
      userEmail: winnerInvestor.email,
      userMobile: winnerInvestor.mobile,
      totalLots: winnerInvestor.totalLots,
      totalInvested: winnerInvestor.totalInvested,
      amountWon: amountWon,
      selectedAt: new Date().toISOString(),
      selectedBy: adminId,
      payoutStatus: 'pending',
      payoutProofUrl: null,
      payoutTxnId: null,
      payoutNotes: '',
      payoutDisbursedAt: null
    };

    // User notification for winner
    data.notifications.unshift({
      id: `NOTIF-WIN-${Date.now()}`,
      userId: winnerInvestor.userId,
      title: '🏆 You Have Won the Full Target Jackpot!',
      message: `Congratulations ${winnerInvestor.name}! You were randomly selected as the lucky winner for "${inv.title}"! Full payout of ₹${amountWon.toLocaleString('en-IN')} will be transferred to you. Check status in your dashboard.`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Notify other investors
    eligibleInvestors.forEach(invUser => {
      if (invUser.userId !== winnerInvestor.userId) {
        data.notifications.unshift({
          id: `NOTIF-DRAW-${Date.now()}-${invUser.userId}`,
          userId: invUser.userId,
          title: `Lucky Draw Winner Announced: ${inv.title}`,
          message: `The random winner for ${inv.title} has been drawn: ${winnerInvestor.name}. Payout proof will be published by Admin.`,
          type: 'info',
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    });

    this.write(data);
    return { investment: inv, winner: inv.winner };
  }

  updateWinnerPayoutProof(investmentId, { proofUrl, txnId, notes }, adminId) {
    const data = this.read();
    const inv = data.investments.find(i => i.id === investmentId);
    if (!inv) throw new Error('Investment not found');
    if (!inv.winner) throw new Error('No winner has been selected for this investment yet.');

    inv.winner.payoutProofUrl = proofUrl || inv.winner.payoutProofUrl;
    inv.winner.payoutTxnId = txnId || inv.winner.payoutTxnId || `UTR-PAYOUT-${Date.now().toString().slice(-6)}`;
    inv.winner.payoutNotes = notes || 'Payout transferred to winner account.';
    inv.winner.payoutStatus = 'disbursed';
    inv.winner.payoutDisbursedAt = new Date().toISOString();
    inv.winner.verifiedByAdmin = adminId;

    // Winner notification
    data.notifications.unshift({
      id: `NOTIF-PROOF-${Date.now()}`,
      userId: inv.winner.userId,
      title: '💸 Payout Proof Published!',
      message: `Your lucky draw prize of ₹${inv.winner.amountWon.toLocaleString('en-IN')} for "${inv.title}" has been disbursed! Reference: ${inv.winner.payoutTxnId}. The transfer proof receipt is now viewable.`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return inv.winner;
  }

  // --- Payments ---
  getPayments() {
    return this.read().payments;
  }

  getPaymentById(id) {
    return this.getPayments().find(p => p.id === id);
  }

  createPayment(paymentData) {
    const data = this.read();
    const newPayment = {
      id: `PAY-${Date.now().toString().slice(-5)}`,
      status: 'pending',
      adminNotes: '',
      rejectionReason: '',
      createdAt: new Date().toISOString(),
      verifiedAt: null,
      verifiedBy: null,
      ...paymentData
    };
    data.payments.unshift(newPayment);

    // Notify admin
    data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: 'admin',
      title: 'New Payment Submitted',
      message: `${newPayment.userName} submitted ₹${newPayment.amount.toLocaleString('en-IN')} for ${newPayment.investmentTitle} (Ref: ${newPayment.transactionId}).`,
      type: 'alert',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    // Notify user
    data.notifications.unshift({
      id: `NOTIF-U-${Date.now()}`,
      userId: newPayment.userId,
      title: 'Payment Submitted',
      message: `Your payment of ₹${newPayment.amount.toLocaleString('en-IN')} has been submitted and is pending verification.`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return newPayment;
  }

  confirmPayment(paymentId, adminId, adminNotes = '', adminProofUrl = null) {
    const data = this.read();
    const payment = data.payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'pending') throw new Error(`Payment is already ${payment.status}`);

    payment.status = 'confirmed';
    payment.verifiedAt = new Date().toISOString();
    payment.verifiedBy = adminId;
    payment.adminNotes = adminNotes || 'Approved by Administrator';
    if (adminProofUrl) {
      payment.adminProofUrl = adminProofUrl;
    }

    // 1. Update investment raisedAmount and investorCount
    const investment = data.investments.find(i => i.id === payment.investmentId);
    if (investment) {
      investment.raisedAmount = Math.min(
        Number(investment.targetAmount),
        (Number(investment.raisedAmount) || 0) + Number(payment.amount)
      );
      investment.investorCount = (investment.investorCount || 0) + 1;
      if (investment.raisedAmount >= investment.targetAmount) {
        investment.status = 'fully_funded';
      }
    }

    // 2. Create confirmed User Investment Record
    const userInvestmentId = `INV-${Date.now().toString().slice(-5)}`;
    const currentRate = investment ? investment.rate : payment.rateAtInvestment;
    const lots = payment.lots || (payment.amount / currentRate);

    const newUserInvestment = {
      id: userInvestmentId,
      userId: payment.userId,
      investmentId: payment.investmentId,
      investmentTitle: payment.investmentTitle,
      investmentType: payment.investmentType,
      paymentId: payment.id,
      transactionId: payment.transactionId,
      amount: Number(payment.amount),
      lots: Number(lots),
      rateAtInvestment: payment.rateAtInvestment,
      purchaseDate: new Date().toISOString(),
      currentRate: currentRate,
      currentValue: Number((lots * currentRate).toFixed(2)),
      adminProofUrl: payment.adminProofUrl || null,
      adminNotes: payment.adminNotes || null,
      status: 'confirmed'
    };
    data.user_investments.unshift(newUserInvestment);

    // 3. User notification
    data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: payment.userId,
      title: 'Payment Confirmed 🎉',
      message: `Your investment of ₹${payment.amount.toLocaleString('en-IN')} in ${payment.investmentTitle} is now confirmed! (ID: ${userInvestmentId})`,
      type: 'success',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return { payment, userInvestment: newUserInvestment, investment };
  }

  rejectPayment(paymentId, adminId, reason = 'Transaction verification failed') {
    const data = this.read();
    const payment = data.payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'pending') throw new Error(`Payment is already ${payment.status}`);

    payment.status = 'rejected';
    payment.verifiedAt = new Date().toISOString();
    payment.verifiedBy = adminId;
    payment.rejectionReason = reason;

    // User notification
    data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: payment.userId,
      title: 'Payment Verification Rejected',
      message: `Your payment of ₹${payment.amount.toLocaleString('en-IN')} for ${payment.investmentTitle} was rejected. Reason: ${reason}`,
      type: 'warning',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return payment;
  }

  updatePaymentProof(paymentId, { adminProofUrl, adminNotes }) {
    const data = this.read();
    const payment = data.payments.find(p => p.id === paymentId);
    if (!payment) throw new Error('Payment not found');

    if (adminProofUrl) payment.adminProofUrl = adminProofUrl;
    if (adminNotes !== undefined) payment.adminNotes = adminNotes;

    // Sync to user_investments if exists
    const userInv = data.user_investments.find(ui => ui.paymentId === paymentId);
    if (userInv) {
      if (adminProofUrl) userInv.adminProofUrl = adminProofUrl;
      if (adminNotes !== undefined) userInv.adminNotes = adminNotes;
    }

    // Notify user
    data.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: payment.userId,
      title: 'Payment Verification Receipt Updated',
      message: `Administrator uploaded verified payment confirmation receipt for ${payment.investmentTitle} (Ref: ${payment.transactionId}).`,
      type: 'info',
      isRead: false,
      createdAt: new Date().toISOString()
    });

    this.write(data);
    return payment;
  }

  // --- User Investments ---
  getUserInvestments(userId) {
    const data = this.read();
    if (!userId) return data.user_investments;
    return data.user_investments.filter(ui => ui.userId === userId);
  }

  // --- Notifications ---
  getNotifications(userId) {
    const data = this.read();
    return data.notifications.filter(n => n.userId === userId || (userId === 'admin' && n.userId === 'admin'));
  }

  markNotificationRead(id) {
    const data = this.read();
    const notif = data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.write(data);
    }
  }

  // --- Settings ---
  getSettings() {
    return this.read().settings;
  }

  updateSettings(newSettings) {
    const data = this.read();
    data.settings = { ...data.settings, ...newSettings };
    this.write(data);
    return data.settings;
  }
}

module.exports = new Database();
