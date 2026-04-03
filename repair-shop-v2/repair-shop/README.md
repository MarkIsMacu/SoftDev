# RepairOS v2 — Computer Repair Shop Management System
**ITCD 103 | Adamson University | SDLC Phase 3 — Task 1.1.3**

## 🚀 How to Run in VS Code

### Fastest Method (Recommended)
1. Extract the ZIP
2. Open `repair-shop` folder in VS Code
3. Install **Live Server** extension by Ritwick Dey (if not installed)
4. Right-click `index.html` → **Open with Live Server**
5. Opens at `http://127.0.0.1:5500`

### Node.js Method
```bash
cd repair-shop
npm install
npm start
# Opens at http://localhost:3000
```

---

## 🔐 Login Credentials

| Role | Email | Password | Redirects To |
|------|-------|----------|-------------|
| Admin | admin@repairshop.com | any | Full dashboard |
| Reception | ana@repairshop.com | any | Dashboard (no user mgmt) |
| Technician | carlo@repairshop.com | any | Dashboard (view/update only) |
| Customer | john.smith@email.com | any | Customer Portal |
| Customer | maria.r@email.com | any | Customer Portal |
| Customer | jose.c@email.com | any | Customer Portal |

> **Customer login:** Email must match a registered customer record. Any password works in demo mode.

---

## 📋 Lab 1.1.3 — Module Mapping

| Lab | Module (Lab 3 §1.1.2) | Key Files | ERD Tables |
|-----|----------------------|-----------|-----------|
| Lab 1 | User Authentication & Role Management | `app.js` → `doLogin()`, `applyRoleNav()` | `tbl_technician` |
| Lab 2 | Customer Management | `customers.js`, `store.js` | `tbl_customer` |
| Lab 3 | Repair Ticket Management | `tickets.js` → `saveTicket()`, auto ID | `tbl_repair_ticket` |
| Lab 4 | Status Tracking & Workflow Automation | `store.js` → `updateTicket()`, `tbl_status_update` | `tbl_status_update`, `tbl_repair_ticket` |
| Lab 5 | Notification System | `store.js` → auto-notify on Completed | Email-to-Case simulation |
| Lab 6 | Dashboard & Reporting | `dashboard.js`, `reports.js` | Aggregates across all tables |
| Lab 7 | Service History Management | `history.js`, `store.js` → auto-create on Completed | `tbl_service_history` |
| Bonus | Payment Management | `payments.js` | `tbl_payment` |
| Bonus | Customer Portal | `customer-portal.js` | `tbl_customer` + filtered views |

---

## 🗃️ ERD Alignment (Lab 2 §1.2.4)

All field names in `store.js` match the ERD exactly:

| ERD Table | Store Key | Fields |
|-----------|-----------|--------|
| tbl_customer | `customers` | customer_id, first_name, last_name, email, phone, address, city, created_date |
| tbl_technician | `users` | technician_id, first_name, last_name, email, phone, specialization, hire_date, status |
| tbl_repair_ticket | `tickets` | ticket_id, customer_id, technician_id, device_type, device_brand, device_model, serial_number, reported_issue, ticket_status, priority, estimated_cost, actual_cost, created_date, updated_date, completion_date |
| tbl_service_history | `history` | service_id, ticket_id, technician_id, service_date, description, parts_used, labor_hours, cost, notes |
| tbl_status_update | `statusLogs` | update_id, ticket_id, old_status, new_status, updated_by, update_date, notes, customer_notified |
| tbl_payment | `payments` | payment_id, ticket_id, customer_id, amount, payment_method, payment_date, payment_status |

---

## 📁 Project Structure
```
repair-shop/
├── index.html
├── package.json
├── README.md
└── src/
    ├── styles/main.css
    ├── data/store.js          ← All DB entities + SOQL-like queries
    └── components/
        └── app.js             ← Auth, routing, utilities
    └── pages/
        ├── dashboard.js       ← Lab 6 (KPIs, charts, activity feed)
        ├── customers.js       ← Lab 2 (tbl_customer CRUD)
        ├── tickets.js         ← Lab 3 & 4 (tbl_repair_ticket + workflow)
        ├── history.js         ← Lab 7 (tbl_service_history)
        ├── payments.js        ← Bonus (tbl_payment)
        ├── users.js           ← Lab 1 (tbl_technician / roles)
        ├── reports.js         ← Lab 6 (analytics for shop owner)
        └── customer-portal.js ← Bonus (US4: Customer view of own tickets)
```

---

## ✅ Functional Requirements Coverage (Lab 2 §II)

| Requirement | Implemented |
|-------------|-------------|
| Customer Management | ✅ Full CRUD with search |
| Repair Ticket Management | ✅ Auto ticket_id, device info, status |
| Status Tracking | ✅ 5-stage pipeline with timeline log |
| Service History | ✅ Auto-created on Completed |
| Reporting & Analytics | ✅ Dashboard metrics + reports page |
| User Authentication | ✅ 4-role login with access control |
| Payment Tracking | ✅ tbl_payment with methods |
| Email Notification | ✅ Simulated — logs in timeline + activity feed |

## ✅ Non-Functional Requirements (Lab 2 §III)

| Requirement | Status |
|-------------|--------|
| Performance < 3s | ✅ Pure JS, no build step |
| Concurrent users | ✅ localStorage per browser |
| Security / RBAC | ✅ Role-based nav + action hiding |
| Usability | ✅ Clean UI, 4-role portals |
| Scalability | ✅ localStorage expandable to API backend |
