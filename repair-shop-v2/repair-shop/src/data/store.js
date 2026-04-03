// ================================================================
// STORE.JS — Central Data Store
// Field names aligned to Lab 2 ERD: tbl_customer, tbl_technician,
// tbl_repair_ticket, tbl_service_history, tbl_status_update, tbl_payment
// ================================================================

const Store = (() => {

  // ---- tbl_technician (also used for admin/reception users) ----
  const defaultTechnicians = [
    { technician_id: 'u1', first_name: 'Maria', last_name: 'Santos', email: 'admin@repairshop.com', phone: '(555) 001-0001', specialization: 'System Administration', hire_date: '2023-01-10', status: 'Active', role: 'admin' },
    { technician_id: 'u2', first_name: 'Carlo', last_name: 'Reyes', email: 'carlo@repairshop.com', phone: '(555) 001-0002', specialization: 'Hardware Repair', hire_date: '2023-03-15', status: 'Active', role: 'technician' },
    { technician_id: 'u3', first_name: 'Ana', last_name: 'Dela Cruz', email: 'ana@repairshop.com', phone: '(555) 001-0003', specialization: 'Front Desk', hire_date: '2023-06-01', status: 'Active', role: 'reception' },
    { technician_id: 'u4', first_name: 'Jose', last_name: 'Garcia', email: 'jose@repairshop.com', phone: '(555) 001-0004', specialization: 'Software & Mobile', hire_date: '2024-01-20', status: 'Active', role: 'technician' },
  ];

  // ---- tbl_customer ----
  const defaultCustomers = [
    { customer_id: 'c1', first_name: 'John', last_name: 'Smith', email: 'john.smith@email.com', phone: '(555) 123-4567', address: '123 Rizal Ave', city: 'Manila', created_date: '2026-03-01' },
    { customer_id: 'c2', first_name: 'Maria', last_name: 'Reyes', email: 'maria.r@email.com', phone: '(555) 234-5678', address: '45 Mabini St', city: 'Quezon City', created_date: '2026-03-05' },
    { customer_id: 'c3', first_name: 'Jose', last_name: 'Cruz', email: 'jose.c@email.com', phone: '(555) 345-6789', address: '78 Bonifacio Blvd', city: 'Makati', created_date: '2026-03-10' },
    { customer_id: 'c4', first_name: 'Ana', last_name: 'Santos', email: 'ana.s@email.com', phone: '(555) 456-7890', address: '12 Luna St', city: 'Pasig', created_date: '2026-03-15' },
    { customer_id: 'c5', first_name: 'Luis', last_name: 'Fernandez', email: 'luis.f@email.com', phone: '(555) 567-8901', address: '9 Del Pilar Ave', city: 'Bacoor', created_date: '2026-03-20' },
  ];

  // ---- tbl_repair_ticket ----
  const defaultTickets = [
    {
      ticket_id: 't1', ticket_name: 'TKT-001023',
      customer_id: 'c1', technician_id: 'u2',
      device_type: 'Laptop', device_brand: 'Apple', device_model: 'MacBook Pro 2021',
      serial_number: 'ABC123XYZ789',
      reported_issue: 'Screen flickering intermittently when laptop is warm. Goes black for 2-3 seconds.',
      ticket_status: 'Awaiting Parts', priority: 'High',
      estimated_cost: 4500.00, actual_cost: null,
      created_date: '2026-03-21', updated_date: '2026-03-23', completion_date: null,
      notes: 'Waiting for replacement display panel — estimated arrival 3-5 days',
      timeline: [
        { action: 'Ticket created', by: 'Ana Dela Cruz (Reception)', date: '2026-03-21 09:30' },
        { action: 'Status → In Progress', by: 'Carlo Reyes (Technician)', date: '2026-03-22 10:15' },
        { action: 'Status → Awaiting Parts', by: 'Carlo Reyes (Technician)', date: '2026-03-23 14:00' },
      ]
    },
    {
      ticket_id: 't2', ticket_name: 'TKT-001015',
      customer_id: 'c2', technician_id: 'u4',
      device_type: 'Desktop', device_brand: 'Dell', device_model: 'XPS 15',
      serial_number: 'DEF456GHI',
      reported_issue: 'Computer will not boot. Powers on but shows black screen with blinking cursor.',
      ticket_status: 'In Progress', priority: 'Urgent',
      estimated_cost: 2000.00, actual_cost: null,
      created_date: '2026-03-20', updated_date: '2026-03-22', completion_date: null,
      notes: 'Diagnosed: corrupted boot sector. Running disk repair tool.',
      timeline: [
        { action: 'Ticket created', by: 'Ana Dela Cruz (Reception)', date: '2026-03-20 11:00' },
        { action: 'Assigned to Jose Garcia', by: 'Maria Santos (Admin)', date: '2026-03-20 11:30' },
        { action: 'Status → In Progress', by: 'Jose Garcia (Technician)', date: '2026-03-22 09:00' },
      ]
    },
    {
      ticket_id: 't3', ticket_name: 'TKT-000998',
      customer_id: 'c3', technician_id: 'u2',
      device_type: 'Laptop', device_brand: 'HP', device_model: 'Pavilion 15',
      serial_number: 'GHI789JKL',
      reported_issue: 'Keyboard unresponsive — several keys stopped working after liquid spill.',
      ticket_status: 'Completed', priority: 'Normal',
      estimated_cost: 1500.00, actual_cost: 1800.00,
      created_date: '2026-03-15', updated_date: '2026-03-18', completion_date: '2026-03-18',
      notes: 'Replaced keyboard membrane and cleaned motherboard. Unit fully functional.',
      timeline: [
        { action: 'Ticket created', by: 'Ana Dela Cruz (Reception)', date: '2026-03-15 13:00' },
        { action: 'Status → In Progress', by: 'Carlo Reyes (Technician)', date: '2026-03-16 09:00' },
        { action: 'Status → Completed', by: 'Carlo Reyes (Technician)', date: '2026-03-18 15:30' },
        { action: '📧 Email notification sent to Jose Cruz', by: 'System (Auto)', date: '2026-03-18 15:31' },
      ]
    },
    {
      ticket_id: 't4', ticket_name: 'TKT-000985',
      customer_id: 'c4', technician_id: 'u4',
      device_type: 'Smartphone', device_brand: 'Samsung', device_model: 'Galaxy S23',
      serial_number: null,
      reported_issue: 'Cracked screen. Touch still works but display has visible fractures.',
      ticket_status: 'Released', priority: 'Normal',
      estimated_cost: 3500.00, actual_cost: 3500.00,
      created_date: '2026-03-10', updated_date: '2026-03-14', completion_date: '2026-03-13',
      notes: 'Full OLED assembly replaced. Warranty: 30 days on parts and labor.',
      timeline: [
        { action: 'Ticket created', by: 'Ana Dela Cruz (Reception)', date: '2026-03-10 10:00' },
        { action: 'Status → In Progress', by: 'Jose Garcia (Technician)', date: '2026-03-11 09:00' },
        { action: 'Status → Completed', by: 'Jose Garcia (Technician)', date: '2026-03-13 14:00' },
        { action: '📧 Email notification sent to Ana Santos', by: 'System (Auto)', date: '2026-03-13 14:01' },
        { action: 'Status → Released', by: 'Ana Dela Cruz (Reception)', date: '2026-03-14 11:00' },
      ]
    },
    {
      ticket_id: 't5', ticket_name: 'TKT-001030',
      customer_id: 'c5', technician_id: null,
      device_type: 'Laptop', device_brand: 'Acer', device_model: 'Aspire 5',
      serial_number: 'JKL012MNO',
      reported_issue: 'Battery drains extremely fast — 100% to 0 in under 30 minutes.',
      ticket_status: 'Received', priority: 'Low',
      estimated_cost: 2200.00, actual_cost: null,
      created_date: '2026-03-28', updated_date: '2026-03-28', completion_date: null,
      notes: '',
      timeline: [
        { action: 'Ticket created', by: 'Ana Dela Cruz (Reception)', date: '2026-03-28 09:00' },
      ]
    },
  ];

  // ---- tbl_service_history ----
  const defaultHistory = [
    {
      service_id: 'sh1', ticket_id: 't3', technician_id: 'u2',
      customer_id: 'c3',
      service_date: '2026-03-18',
      description: 'Keyboard replacement after liquid spill. Cleaned motherboard.',
      parts_used: 'HP Pavilion 15 keyboard membrane (PN: L50000-001)',
      labor_hours: 3.0, cost: 1800.00,
      notes: 'Customer advised on liquid damage prevention'
    },
    {
      service_id: 'sh2', ticket_id: 't4', technician_id: 'u4',
      customer_id: 'c4',
      service_date: '2026-03-13',
      description: 'Full OLED screen assembly replacement for Galaxy S23',
      parts_used: 'Samsung Galaxy S23 OLED assembly (GH82-29118A)',
      labor_hours: 2.0, cost: 3500.00,
      notes: 'Warranty: 30 days on parts and labor'
    },
  ];

  // ---- tbl_status_update ----
  const defaultStatusUpdates = [
    { update_id: 'su1', ticket_id: 't1', old_status: 'In Progress', new_status: 'Awaiting Parts', updated_by: 'u2', update_date: '2026-03-23 14:00', notes: 'Waiting for display panel', customer_notified: false },
    { update_id: 'su2', ticket_id: 't3', old_status: 'In Progress', new_status: 'Completed', updated_by: 'u2', update_date: '2026-03-18 15:30', notes: 'Repair completed', customer_notified: true },
    { update_id: 'su3', ticket_id: 't4', old_status: 'Completed', new_status: 'Released', updated_by: 'u3', update_date: '2026-03-14 11:00', notes: 'Customer picked up device', customer_notified: true },
  ];

  // ---- tbl_payment ----
  const defaultPayments = [
    { payment_id: 'p1', ticket_id: 't3', customer_id: 'c3', amount: 1800.00, payment_method: 'Cash', payment_date: '2026-03-18', payment_status: 'Paid' },
    { payment_id: 'p2', ticket_id: 't4', customer_id: 'c4', amount: 3500.00, payment_method: 'GCash', payment_date: '2026-03-14', payment_status: 'Paid' },
  ];

  const defaultNotifications = [
    { id: 'n1', type: 'green', text: 'TKT-000998 marked Completed — email sent to Jose Cruz', time: '2 days ago' },
    { id: 'n2', type: 'blue', text: 'TKT-001023 status updated to Awaiting Parts', time: '2 days ago' },
    { id: 'n3', type: 'orange', text: 'New ticket TKT-001030 received for Acer Aspire 5', time: '5 days ago' },
    { id: 'n4', type: 'green', text: 'TKT-000985 released to Ana Santos', time: '1 week ago' },
  ];

  // ---- Persistence ----
  function load(key, defaults) {
    try { const s = localStorage.getItem('ros_' + key); return s ? JSON.parse(s) : JSON.parse(JSON.stringify(defaults)); }
    catch { return JSON.parse(JSON.stringify(defaults)); }
  }
  function save(key, data) {
    try { localStorage.setItem('ros_' + key, JSON.stringify(data)); } catch {}
  }

  let users      = load('users',    defaultTechnicians);
  let customers  = load('customers',defaultCustomers);
  let tickets    = load('tickets',  defaultTickets);
  let history    = load('history',  defaultHistory);
  let statusLogs = load('statlog',  defaultStatusUpdates);
  let payments   = load('payments', defaultPayments);
  let notifs     = load('notifs',   defaultNotifications);

  // ---- ID generators ----
  function uid(p) { return p + Date.now().toString(36) + Math.random().toString(36).substr(2,4); }
  function nextTicketName() {
    const nums = tickets.map(t => parseInt(t.ticket_name.replace('TKT-',''))||0);
    return 'TKT-' + String(Math.max(0,...nums)+1).padStart(6,'0');
  }

  return {
    // ======= USERS (tbl_technician) =======
    getUsers:       ()  => users,
    getUserById:    id  => users.find(u => u.technician_id === id),
    getTechnicians: ()  => users.filter(u => u.role === 'technician'),
    getUserByEmail: em  => users.find(u => u.email.toLowerCase() === em.toLowerCase()),
    getCustomerByEmail: em => customers.find(c => c.email.toLowerCase() === em.toLowerCase()),
    addUser(d) {
      const u = { technician_id: uid('u'), ...d, hire_date: new Date().toISOString().split('T')[0], status: 'Active' };
      users.push(u); save('users', users); return u;
    },
    deleteUser(id) { users = users.filter(u => u.technician_id !== id); save('users', users); },

    // ======= CUSTOMERS (tbl_customer) =======
    getCustomers:    ()  => customers,
    getCustomerById: id  => customers.find(c => c.customer_id === id),
    getCustomerName: id  => { const c = customers.find(c => c.customer_id === id); return c ? `${c.first_name} ${c.last_name}` : 'Unknown'; },
    addCustomer(d) {
      const c = { customer_id: uid('c'), ...d, created_date: new Date().toISOString().split('T')[0] };
      customers.push(c); save('customers', customers); return c;
    },
    updateCustomer(id, d) { customers = customers.map(c => c.customer_id === id ? {...c,...d} : c); save('customers', customers); },
    deleteCustomer(id) { customers = customers.filter(c => c.customer_id !== id); save('customers', customers); },
    getCustomerTicketCount: id => tickets.filter(t => t.customer_id === id).length,

    // ======= TICKETS (tbl_repair_ticket) =======
    getTickets:    ()  => tickets,
    getTicketById: id  => tickets.find(t => t.ticket_id === id),
    getTicketsByCustomer: cid => tickets.filter(t => t.customer_id === cid),
    addTicket(d) {
      const t = {
        ticket_id: uid('t'), ticket_name: nextTicketName(), ...d,
        ticket_status: 'Received',
        created_date: new Date().toISOString().split('T')[0],
        updated_date: new Date().toISOString().split('T')[0],
        completion_date: null, notes: '',
        timeline: [{ action: 'Ticket created', by: 'System', date: new Date().toLocaleString() }]
      };
      tickets.push(t); save('tickets', tickets);
      this.pushNotif('orange', `New ticket ${t.ticket_name} created for ${d.device_brand} ${d.device_model}`);
      return t;
    },
    updateTicket(id, d, byLabel = 'System') {
      const old = tickets.find(t => t.ticket_id === id);
      if (!old) return;

      // Status change handling (StatusUpdateTrigger equivalent)
      if (d.ticket_status && d.ticket_status !== old.ticket_status) {
        // Log to tbl_status_update
        const log = {
          update_id: uid('su'),
          ticket_id: id,
          old_status: old.ticket_status,
          new_status: d.ticket_status,
          updated_by: byLabel,
          update_date: new Date().toLocaleString(),
          notes: d.notes || '',
          customer_notified: d.ticket_status === 'Completed'
        };
        statusLogs.push(log); save('statlog', statusLogs);

        // Timeline entry
        d.timeline = [...(old.timeline||[]), {
          action: `Status → ${d.ticket_status}`,
          by: byLabel,
          date: new Date().toLocaleString()
        }];

        // On Completed: auto service history + email notification
        if (d.ticket_status === 'Completed' && old.ticket_status !== 'Completed') {
          d.completion_date = new Date().toISOString().split('T')[0];
          d.timeline.push({ action: '📧 Email notification sent to customer', by: 'System (Auto)', date: new Date().toLocaleString() });
          // Auto-create service history (ServiceHistoryService equivalent)
          this.addHistory({
            ticket_id: id,
            customer_id: old.customer_id,
            technician_id: old.technician_id || d.technician_id,
            service_date: new Date().toISOString().split('T')[0],
            description: old.reported_issue,
            parts_used: d.parts_used || 'See ticket notes',
            labor_hours: d.labor_hours || 1,
            cost: d.actual_cost || old.estimated_cost,
            notes: d.notes || ''
          });
          const custName = this.getCustomerName(old.customer_id);
          this.pushNotif('green', `${old.ticket_name} completed — email notification sent to ${custName}`);
        } else {
          this.pushNotif('blue', `${old.ticket_name} status updated to ${d.ticket_status}`);
        }
        d.updated_date = new Date().toISOString().split('T')[0];
      }
      tickets = tickets.map(t => t.ticket_id === id ? {...t,...d} : t);
      save('tickets', tickets);
    },
    deleteTicket(id) { tickets = tickets.filter(t => t.ticket_id !== id); save('tickets', tickets); },

    // ======= SERVICE HISTORY (tbl_service_history) =======
    getHistory:    ()  => history,
    getHistoryByCustomer: cid => history.filter(h => h.customer_id === cid),
    addHistory(d) {
      const sh = { service_id: uid('sh'), ...d };
      history.push(sh); save('history', history); return sh;
    },

    // ======= STATUS UPDATES (tbl_status_update) =======
    getStatusLogs:  ()  => statusLogs,

    // ======= PAYMENTS (tbl_payment) =======
    getPayments:    ()  => payments,
    getPaymentsByTicket: tid => payments.filter(p => p.ticket_id === tid),
    addPayment(d) {
      const p = { payment_id: uid('p'), ...d, payment_date: new Date().toISOString().split('T')[0] };
      payments.push(p); save('payments', payments);
      this.pushNotif('green', `Payment of ${formatCurrency(d.amount)} recorded for ticket`);
      return p;
    },

    // ======= NOTIFICATIONS =======
    getNotifs: () => notifs,
    pushNotif(type, text) {
      notifs.unshift({ id: uid('n'), type, text, time: 'Just now' });
      if (notifs.length > 30) notifs.pop();
      save('notifs', notifs);
    },

    // ======= ANALYTICS (SOQL aggregate simulation) =======
    getMetrics() {
      const weekAgo = new Date(Date.now() - 7*24*60*60*1000);
      return {
        inProgress:        tickets.filter(t => t.ticket_status === 'In Progress').length,
        completedThisWeek: tickets.filter(t => t.ticket_status === 'Completed' && t.completion_date && new Date(t.completion_date) >= weekAgo).length,
        awaitingParts:     tickets.filter(t => t.ticket_status === 'Awaiting Parts').length,
        totalRevenue:      history.reduce((s,h) => s+(h.cost||0), 0),
        byStatus: {
          'Received':      tickets.filter(t => t.ticket_status==='Received').length,
          'In Progress':   tickets.filter(t => t.ticket_status==='In Progress').length,
          'Awaiting Parts':tickets.filter(t => t.ticket_status==='Awaiting Parts').length,
          'Completed':     tickets.filter(t => t.ticket_status==='Completed').length,
          'Released':      tickets.filter(t => t.ticket_status==='Released').length,
        }
      };
    },

    // ======= ADMIN-SPECIFIC ANALYTICS =======
    getAdminMetrics() {
      const allTix = tickets;
      const allHist = history;
      const allPays = payments;
      const allUsers = users;
      const weekAgo = new Date(Date.now() - 7*24*60*60*1000);
      const monthAgo = new Date(Date.now() - 30*24*60*60*1000);

      // Revenue figures
      const totalRevenue = allHist.reduce((s,h) => s+(h.cost||0), 0);
      const totalCollected = allPays.filter(p => p.payment_status==='Paid').reduce((s,p) => s+(p.amount||0), 0);
      const pendingRevenue = allTix
        .filter(t => t.ticket_status !== 'Released')
        .reduce((s,t) => s+(t.estimated_cost||0), 0);
      const completedCount = allTix.filter(t => t.ticket_status==='Completed'||t.ticket_status==='Released').length;
      const completionRate = allTix.length ? Math.round(completedCount/allTix.length*100) : 0;
      const avgRevPerJob = allHist.length ? totalRevenue/allHist.length : 0;

      // New this week
      const newThisWeek = allTix.filter(t => new Date(t.created_date) >= weekAgo).length;
      const completedThisWeek = allTix.filter(t => t.ticket_status==='Completed' && t.completion_date && new Date(t.completion_date) >= weekAgo).length;

      // Technician performance
      const techPerf = allUsers.filter(u => u.role==='technician').map(u => {
        const assigned = allTix.filter(t => t.technician_id === u.technician_id);
        const done = assigned.filter(t => t.ticket_status==='Completed'||t.ticket_status==='Released');
        const revenue = allHist.filter(h => h.technician_id === u.technician_id).reduce((s,h) => s+(h.cost||0), 0);
        return {
          name: `${u.first_name} ${u.last_name}`,
          id: u.technician_id,
          assigned: assigned.length,
          completed: done.length,
          revenue,
          rate: assigned.length ? Math.round(done.length/assigned.length*100) : 0
        };
      });

      // Device type breakdown
      const deviceMap = {};
      allTix.forEach(t => { deviceMap[t.device_type] = (deviceMap[t.device_type]||0)+1; });

      // Payment method breakdown
      const payMethods = {};
      allPays.forEach(p => { payMethods[p.payment_method] = (payMethods[p.payment_method]||0)+p.amount; });

      // Priority breakdown
      const priorityMap = { 'Urgent':0, 'High':0, 'Normal':0, 'Low':0 };
      allTix.forEach(t => { if (priorityMap[t.priority]!==undefined) priorityMap[t.priority]++; });

      // Monthly ticket volumes (last 6 months)
      const months = [];
      for (let i=5; i>=0; i--) {
        const d = new Date(); d.setMonth(d.getMonth()-i);
        const label = d.toLocaleDateString('en-PH',{month:'short',year:'2-digit'});
        const yr = d.getFullYear(); const mo = d.getMonth();
        const count = allTix.filter(t => {
          const td = new Date(t.created_date);
          return td.getFullYear()===yr && td.getMonth()===mo;
        }).length;
        months.push({ label, count });
      }

      return {
        totalRevenue, totalCollected, pendingRevenue,
        completedCount, completionRate, avgRevPerJob,
        newThisWeek, completedThisWeek,
        totalTickets: allTix.length,
        totalCustomers: customers.length,
        totalStaff: allUsers.length,
        awaitingParts: allTix.filter(t => t.ticket_status==='Awaiting Parts').length,
        inProgress: allTix.filter(t => t.ticket_status==='In Progress').length,
        received: allTix.filter(t => t.ticket_status==='Received').length,
        techPerf, deviceMap, payMethods, priorityMap, months,
        byStatus: {
          'Received':       allTix.filter(t => t.ticket_status==='Received').length,
          'In Progress':    allTix.filter(t => t.ticket_status==='In Progress').length,
          'Awaiting Parts': allTix.filter(t => t.ticket_status==='Awaiting Parts').length,
          'Completed':      allTix.filter(t => t.ticket_status==='Completed').length,
          'Released':       allTix.filter(t => t.ticket_status==='Released').length,
        }
      };
    },

    // ======= TECHNICIAN-SPECIFIC METRICS =======
    getTechnicianMetrics(techId) {
      const myTickets = tickets.filter(t => t.technician_id === techId);
      const myHistory = history.filter(h => h.technician_id === techId);
      const inProgress = myTickets.filter(t => t.ticket_status==='In Progress').length;
      const awaiting   = myTickets.filter(t => t.ticket_status==='Awaiting Parts').length;
      const completed  = myTickets.filter(t => t.ticket_status==='Completed'||t.ticket_status==='Released').length;
      const totalLabor = myHistory.reduce((s,h) => s+(h.labor_hours||0), 0);
      const weekAgo    = new Date(Date.now() - 7*24*60*60*1000);
      const doneThisWeek = myTickets.filter(t => t.ticket_status==='Completed' && t.completion_date && new Date(t.completion_date) >= weekAgo).length;
      return { myTickets, inProgress, awaiting, completed, totalLabor, doneThisWeek, totalAssigned: myTickets.length };
    },

    // ======= RECEPTION-SPECIFIC METRICS =======
    getReceptionMetrics() {
      const today = new Date().toISOString().split('T')[0];
      const todayTickets = tickets.filter(t => t.created_date === today);
      const received = tickets.filter(t => t.ticket_status==='Received').length;
      const released = tickets.filter(t => t.ticket_status==='Released').length;
      const pendingPay = tickets.filter(t =>
        (t.ticket_status==='Completed'||t.ticket_status==='Released') &&
        !payments.find(p => p.ticket_id===t.ticket_id && p.payment_status==='Paid')
      ).length;
      const weekAgo = new Date(Date.now() - 7*24*60*60*1000);
      const newThisWeek = tickets.filter(t => new Date(t.created_date) >= weekAgo).length;
      return { todayTickets, received, released, pendingPay, newThisWeek, totalCustomers: customers.length };
    }
  };
})();

// Session state
let currentUser = null;
let currentRole = 'admin';

// Utility (used globally)
function formatCurrency(n) {
  if (n === null || n === undefined) return '—';
  return '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: 2 });
}
