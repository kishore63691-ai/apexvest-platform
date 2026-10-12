# ApexVest — Full-Stack Investment Platform Prototype

A modern, responsive, secure investment platform website built according to fintech standards and all 18 requirements:
- **Authentication / Login**: Multi-role support (Investor & Admin) with JWT authentication and bcrypt password hashing.
- **Investor/User Dashboard**: Total Invested, Confirmed Holdings, Pending Payments, Portfolio Market Value, and returns.
- **Option A — Business Investment**: Co-funding operating businesses with **₹10 per lot** standard, dynamic lot calculation, and visual progress bars.
- **Option B — Community / Asset Investment**: Fractional reserves in Physical 24K Gold, Pure Silver, and Commercial Land. **Admin controls the live spot rates in real-time.**
- **3-Step Investment Workflow**:
  1. *Step 1*: Investment Details & Lot calculation confirmation
  2. *Step 2*: Dynamic UPI Payment QR Code, UPI ID, Payee name, Reference code, instructions
  3. *Step 3*: Payment Confirmation with 12-digit UTR entry, date, optional screenshot upload → Status sets to **Payment Verification Pending**
- **Admin Payment Verification System**:
  - Live table of submitted payments
  - **CONFIRM PAYMENT**: Credits user portfolio, updates investment collected target, updates progress bar, notifies user
  - **REJECT PAYMENT**: Logs reason, updates status, notifies user
  - **Rule Enforcement**: Progress bar and user portfolio ONLY update once confirmed by Admin.
- **My Investments Ledger**: Detailed view of confirmed investments with unique Investment IDs, purchase rate, live rate, and market value.
- **Notifications Engine**: In-app notifications for users and administrators.
- **Search & Filters**: Multi-faceted filter by type, category, status, and search keywords.
- **Compliance & Legal**: Risk Disclosures, Terms & Conditions, and statutory warnings.

---

## 🚀 Quick Start Guide

### 1. Start the Platform
Run the following in the project root:
```bash
npm start
```
Or:
```bash
node server/server.js
```
The server will start at:
👉 **http://localhost:5000** (serves both API & Frontend)

### 2. Run in Development Mode (Optional)
To run the Vite hot-reloading dev server:
```bash
# Terminal 1 (Backend API):
node server/server.js

# Terminal 2 (Vite Frontend):
npm run client
```
Access the Vite dev server at **http://localhost:5173**.

---

## 🔑 Demo Login Credentials

### Investor Account:
- **Email:** `investor@demo.com`
- **Password:** `investor123`
*(Or click the **"⚡ Demo User"** shortcut button in the top navigation bar)*

### Admin Portal:
- **Email:** `admin@investment.com`
- **Password:** `admin123`
*(Or click the **"🛡️ Admin"** shortcut button in the top navigation bar)*

---

## 🧪 Automated End-to-End Test

To execute the automated test verifying all 18 business rules:
```bash
node server/test-flow.js
```

---

## 📁 Project Architecture

```
investment/
├── server/
│   ├── server.js              # Express 5 server entrypoint (port 5000)
│   ├── database.js            # Atomic file-backed JSON database engine
│   ├── data/
│   │   └── db.json            # Persistent storage (Users, Investments, Payments, Portfolio)
│   ├── middleware/
│   │   └── auth.js            # JWT verification & Admin role guard
│   ├── routes/
│   │   ├── auth.js            # Register, dual-login, profile
│   │   ├── investments.js     # Listing, filters, Admin CRUD, Rate updates
│   │   ├── payments.js        # Dynamic UPI QR generator, submissions, Admin verification
│   │   ├── portfolio.js       # User portfolio stats, My Investments ledger
│   │   ├── admin.js           # Admin stats, users list, platform settings
│   │   └── notifications.js   # User & Admin in-app notification center
│   ├── uploads/               # Screenshot & asset image storage
│   └── test-flow.js           # Automated end-to-end verification script
│
└── client/
    ├── index.html             # Plus Jakarta Sans fintech typography
    ├── package.json           # React, Tailwind CSS, Lucide icons, Confetti
    ├── tailwind.config.js     # Custom fintech slate/emerald/amber color system
    └── src/
        ├── context/
        │   └── AuthContext.jsx       # Authentication & user state management
        ├── components/
        │   ├── Navbar.jsx            # Header, quick login shortcuts, notification bell
        │   ├── Footer.jsx            # Regulatory risk notices, compliance links
        │   ├── InvestmentCard.jsx    # Progress bar, ₹10/lot calculation, badges
        │   ├── InvestModal.jsx       # 3-step investment modal with dynamic UPI QR
        │   ├── NotificationsDropdown.jsx # In-app notification drawer
        │   ├── AuthModal.jsx         # Dual-login and registration modal
        │   └── LegalModal.jsx        # Terms, Risk Disclosures, Privacy Policy
        └── views/
            ├── HomeView.jsx                  # Hero, Option A & B highlights, workflow
            ├── InvestmentsView.jsx           # Filter & search marketplace
            ├── BusinessFundingView.jsx       # Dedicated Option A (₹10/lot) showcase
            ├── CommunityInvestmentsView.jsx  # Dedicated Option B (Gold, Silver, Land)
            ├── DashboardView.jsx             # Investor summary & metric cards
            ├── MyInvestmentsView.jsx         # Portfolio ledger & detail modal
            ├── TransactionsView.jsx          # UTR payment reference history
            ├── ProfileView.jsx               # KYC status & account credentials
            └── AdminDashboardView.jsx        # Admin verification & rate management
```
