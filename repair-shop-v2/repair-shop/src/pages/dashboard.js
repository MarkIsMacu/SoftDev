// ================================================================
// DASHBOARD.JS — Module VI: Role-aware Dashboard
// Admin: Executive analytics & reports overview
// Reception: Intake & workflow overview
// Technician: Personal workload queue
// ================================================================
function renderDashboard() {
  if (currentRole === 'admin') {
    renderAdminDashboard();
  } else if (currentRole === 'reception') {
    renderReceptionDashboard();
  } else if (currentRole === 'technician') {
    renderTechnicianDashboard();
  }
}

// ================================================================
// ADMIN DASHBOARD — Executive reporting overview
// ================================================================
function renderAdminDashboard() {
  const m = Store.getAdminMetrics();
  const container = document.getElementById('sec-dashboard');

  container.innerHTML = `
    <div class="sec-header">
      <div class="sec-title-wrap">
        <h2 class="sec-title">Admin Dashboard</h2>
        <p class="sec-sub">Executive overview &amp; business intelligence — <span id="dash-date"></span></p>
      </div>
      <div class="header-actions">
        <div class="status-pill online"><span class="pulse-dot"></span> System Online</div>
        <button class="btn-primary" onclick="navTo('reports', document.querySelector('[data-page=reports]'))" style="font-size:12px;padding:7px 14px;">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 17V9l4-4 4 4 4-8v16"/></svg>
          Full Reports
        </button>
      </div>
    </div>

    <!-- Row 1: Executive KPIs -->
    <div class="kpi-row">
      <div class="kpi-card kpi-gold">
        <div class="kpi-bg-icon">₱</div>
        <div class="kpi-label">Total Revenue</div>
        <div class="kpi-val" style="font-size:20px">${formatCurrency(m.totalRevenue)}</div>
        <div class="kpi-foot">All-time service revenue</div>
      </div>
      <div class="kpi-card kpi-green">
        <div class="kpi-bg-icon">💳</div>
        <div class="kpi-label">Collected</div>
        <div class="kpi-val" style="font-size:20px">${formatCurrency(m.totalCollected)}</div>
        <div class="kpi-foot">Payments received</div>
      </div>
      <div class="kpi-card kpi-orange">
        <div class="kpi-bg-icon">📋</div>
        <div class="kpi-label">Total Tickets</div>
        <div class="kpi-val">${m.totalTickets}</div>
        <div class="kpi-foot">${m.newThisWeek} new this week</div>
      </div>
      <div class="kpi-card kpi-blue">
        <div class="kpi-bg-icon">%</div>
        <div class="kpi-label">Completion Rate</div>
        <div class="kpi-val">${m.completionRate}%</div>
        <div class="kpi-foot">${m.completedCount} completed/released</div>
      </div>
    </div>

    <!-- Row 2: Secondary metrics -->
    <div class="kpi-row" style="margin-top:0">
      <div class="kpi-card kpi-orange" style="opacity:0.85">
        <div class="kpi-bg-icon">👥</div>
        <div class="kpi-label">Total Customers</div>
        <div class="kpi-val" style="font-size:28px">${m.totalCustomers}</div>
        <div class="kpi-foot">Registered accounts</div>
      </div>
      <div class="kpi-card kpi-blue" style="opacity:0.85">
        <div class="kpi-bg-icon">👷</div>
        <div class="kpi-label">Active Staff</div>
        <div class="kpi-val" style="font-size:28px">${m.totalStaff}</div>
        <div class="kpi-foot">Users in system</div>
      </div>
      <div class="kpi-card kpi-gold">
        <div class="kpi-bg-icon">🔧</div>
        <div class="kpi-label">In Progress</div>
        <div class="kpi-val" style="font-size:28px">${m.inProgress}</div>
        <div class="kpi-foot">Active repairs</div>
      </div>
      <div class="kpi-card kpi-blue">
        <div class="kpi-bg-icon">⏳</div>
        <div class="kpi-label">Awaiting Parts</div>
        <div class="kpi-val" style="font-size:28px">${m.awaitingParts}</div>
        <div class="kpi-foot">Pending orders</div>
      </div>
    </div>

    <!-- Row 3: Technician Performance + Status Chart -->
    <div class="dash-row">
      <div class="card dash-chart-card">
        <div class="card-head">
          <span class="card-title">Technician Performance</span>
          <span class="card-badge">Live</span>
        </div>
        <div class="rpt-body" id="admin-tech-perf">
          ${m.techPerf.map(t => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--b1)">
              <div style="width:36px;height:36px;border-radius:10px;background:var(--purple-dim);border:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;color:var(--purple);flex-shrink:0">${t.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:13px">${t.name}</div>
                <div class="bar-track" style="margin-top:5px"><div class="bar-fill" style="width:${t.rate}%;background:linear-gradient(90deg,#8B5CF6,#6D28D9)">${t.rate}%</div></div>
              </div>
              <div style="text-align:right;flex-shrink:0">
                <div style="font-family:var(--font-mono);font-size:12px;color:var(--green);font-weight:700">${formatCurrency(t.revenue)}</div>
                <div style="font-size:10px;color:var(--t3)">${t.assigned} assigned · ${t.completed} done</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card dash-notif-card">
        <div class="card-head">
          <span class="card-title">Ticket Status Breakdown</span>
          <span class="card-badge">Live</span>
        </div>
        <div class="chart-body" id="admin-status-chart">
          ${renderStatusBars(m.byStatus)}
        </div>
      </div>
    </div>

    <!-- Row 4: Monthly Volume + Payment Methods -->
    <div class="dash-row">
      <div class="card dash-chart-card">
        <div class="card-head">
          <span class="card-title">Monthly Ticket Volume</span>
          <span class="card-badge">6 Months</span>
        </div>
        <div class="chart-body">
          ${renderMonthlyBars(m.months)}
        </div>
      </div>
      <div class="card dash-notif-card">
        <div class="card-head">
          <span class="card-title">Revenue by Payment Method</span>
        </div>
        <div style="padding:16px 20px">
          ${Object.entries(m.payMethods).length ? Object.entries(m.payMethods).map(([method, amount]) =>
            `<div class="stat-item"><span class="stat-lbl">${method}</span><span class="stat-val" style="color:var(--green);font-family:var(--font-mono);font-weight:700">${formatCurrency(amount)}</span></div>`
          ).join('') : '<div class="empty" style="padding:24px 0"><div class="empty-txt">No payments yet</div></div>'}
          <div class="stat-item" style="margin-top:4px">
            <span class="stat-lbl" style="font-weight:700">Avg per Job</span>
            <span class="stat-val" style="font-family:var(--font-mono);color:var(--accent);font-weight:700">${formatCurrency(m.avgRevPerJob)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 5: Recent activity -->
    <div class="card">
      <div class="card-head">
        <span class="card-title">Recent Repair Tickets</span>
        <button class="btn-link" onclick="navTo('tickets',document.querySelector('[data-page=tickets]'))">View all →</button>
      </div>
      <div class="tbl-wrap">
        <table class="tbl" id="dash-tbl">
          <thead><tr>
            <th>Ticket #</th><th>Customer</th><th>Device</th>
            <th>Technician</th><th>Status</th><th>Priority</th><th>Est. Cost</th><th>Date</th>
          </tr></thead>
          <tbody id="dash-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('dash-date').textContent =
    new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // Render recent tickets
  const recent = [...Store.getTickets()].reverse().slice(0,6);
  const tbody = document.getElementById('dash-tbody');
  tbody.innerHTML = !recent.length ? emptyRow(8,'◈','No tickets yet') :
    recent.map(t => {
      const tech = Store.getUserById(t.technician_id);
      return `<tr onclick="viewTicket('${t.ticket_id}')" style="cursor:pointer">
        <td><span style="font-family:var(--font-mono);font-size:11px;color:var(--accent)">${t.ticket_name}</span></td>
        <td>${Store.getCustomerName(t.customer_id)}</td>
        <td><div style="font-weight:600">${t.device_model}</div><div style="font-size:10px;color:var(--t3)">${t.device_type}</div></td>
        <td>${tech ? `${tech.first_name} ${tech.last_name}` : '<span style="color:var(--t3)">—</span>'}</td>
        <td>${statusBadge(t.ticket_status)}</td>
        <td>${priorityBadge(t.priority)}</td>
        <td style="font-family:var(--font-mono);font-size:12px">${formatCurrency(t.estimated_cost)}</td>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--t2)">${t.created_date}</td>
      </tr>`;
    }).join('');
}

// ================================================================
// RECEPTION DASHBOARD — Intake & workflow focus
// ================================================================
function renderReceptionDashboard() {
  const rm = Store.getReceptionMetrics();
  const container = document.getElementById('sec-dashboard');

  container.innerHTML = `
    <div class="sec-header">
      <div class="sec-title-wrap">
        <h2 class="sec-title">Reception Overview</h2>
        <p class="sec-sub">Front desk operations — <span id="dash-date"></span></p>
      </div>
      <div class="header-actions">
        <div class="status-pill online"><span class="pulse-dot"></span> System Online</div>
        <button class="btn-primary" id="btn-new-ticket-dash" onclick="openNewTicket()" style="font-size:12px;padding:7px 14px;">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M10 4v12M4 10h12"/></svg>
          New Ticket
        </button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-card kpi-orange">
        <div class="kpi-bg-icon">🎫</div>
        <div class="kpi-label">New Today</div>
        <div class="kpi-val">${rm.todayTickets.length}</div>
        <div class="kpi-foot">Tickets created today</div>
      </div>
      <div class="kpi-card kpi-blue">
        <div class="kpi-bg-icon">📥</div>
        <div class="kpi-label">Received</div>
        <div class="kpi-val">${rm.received}</div>
        <div class="kpi-foot">Awaiting assignment</div>
      </div>
      <div class="kpi-card kpi-green">
        <div class="kpi-bg-icon">📦</div>
        <div class="kpi-label">Released</div>
        <div class="kpi-val">${rm.released}</div>
        <div class="kpi-foot">Picked up by customer</div>
      </div>
      <div class="kpi-card kpi-gold">
        <div class="kpi-bg-icon">💰</div>
        <div class="kpi-label">Pending Payment</div>
        <div class="kpi-val">${rm.pendingPay}</div>
        <div class="kpi-foot">Ready to collect</div>
      </div>
    </div>

    <div class="dash-row">
      <div class="card dash-chart-card">
        <div class="card-head">
          <span class="card-title">Ticket Status at a Glance</span>
          <span class="card-badge">Live</span>
        </div>
        <div class="chart-body" id="status-chart">
          ${renderStatusBars(Store.getMetrics().byStatus)}
        </div>
      </div>
      <div class="card dash-notif-card">
        <div class="card-head">
          <span class="card-title">Activity Feed</span>
          <span class="notif-count" id="notif-count">0</span>
        </div>
        <div class="notif-feed" id="notif-feed"></div>
      </div>
    </div>

    <div class="card">
      <div class="card-head">
        <span class="card-title">Unassigned & Received Tickets</span>
        <button class="btn-link" onclick="navTo('tickets',document.querySelector('[data-page=tickets]'))">View all →</button>
      </div>
      <div class="tbl-wrap">
        <table class="tbl">
          <thead><tr>
            <th>Ticket #</th><th>Customer</th><th>Device</th><th>Issue</th><th>Status</th><th>Priority</th><th>Est. Cost</th><th>Date</th>
          </tr></thead>
          <tbody id="dash-tbody"></tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('dash-date').textContent =
    new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // Show received/unassigned tickets first, then others
  const notifs = Store.getNotifs();
  const feed = document.getElementById('notif-feed');
  document.getElementById('notif-count').textContent = notifs.length;
  if (!notifs.length) { feed.innerHTML='<div class="empty"><div class="empty-txt">No activity yet</div></div>'; }
  else {
    feed.innerHTML = notifs.slice(0,7).map(n =>
      `<div class="notif-item">
        <div class="notif-dot nd-${n.type}"></div>
        <div><div class="notif-text">${n.text}</div><div class="notif-time">${n.time}</div></div>
      </div>`).join('');
  }

  const priorityOrder = { 'Urgent':0,'High':1,'Normal':2,'Low':3 };
  const tix = [...Store.getTickets()]
    .filter(t => t.ticket_status === 'Received' || !t.technician_id)
    .sort((a,b) => (priorityOrder[a.priority]||2)-(priorityOrder[b.priority]||2));
  const allRecent = tix.length ? tix : [...Store.getTickets()].reverse().slice(0,6);
  const tbody = document.getElementById('dash-tbody');
  tbody.innerHTML = !allRecent.length ? emptyRow(8,'◈','No tickets yet') :
    allRecent.slice(0,6).map(t => {
      const issue = (t.reported_issue||'').length>40 ? t.reported_issue.slice(0,40)+'…' : t.reported_issue;
      return `<tr onclick="viewTicket('${t.ticket_id}')" style="cursor:pointer">
        <td><span style="font-family:var(--font-mono);font-size:11px;color:var(--accent)">${t.ticket_name}</span></td>
        <td>${Store.getCustomerName(t.customer_id)}</td>
        <td><div style="font-weight:600">${t.device_brand} ${t.device_model}</div><div style="font-size:10px;color:var(--t3)">${t.device_type}</div></td>
        <td style="color:var(--t2);font-size:12px;max-width:140px">${issue}</td>
        <td>${statusBadge(t.ticket_status)}</td>
        <td>${priorityBadge(t.priority)}</td>
        <td style="font-family:var(--font-mono);font-size:12px">${formatCurrency(t.estimated_cost)}</td>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--t2)">${t.created_date}</td>
      </tr>`;
    }).join('');
}

// ================================================================
// TECHNICIAN DASHBOARD — Personal workload queue
// ================================================================
function renderTechnicianDashboard() {
  const techId = currentUser ? currentUser.id : null;
  const tm = techId ? Store.getTechnicianMetrics(techId) : { myTickets:[], inProgress:0, awaiting:0, completed:0, totalLabor:0, doneThisWeek:0, totalAssigned:0 };
  const container = document.getElementById('sec-dashboard');

  container.innerHTML = `
    <div class="sec-header">
      <div class="sec-title-wrap">
        <h2 class="sec-title">My Workstation</h2>
        <p class="sec-sub">Your assigned repair queue — <span id="dash-date"></span></p>
      </div>
      <div class="header-actions">
        <div class="status-pill online"><span class="pulse-dot"></span> System Online</div>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi-card kpi-orange">
        <div class="kpi-bg-icon">🔧</div>
        <div class="kpi-label">In Progress</div>
        <div class="kpi-val">${tm.inProgress}</div>
        <div class="kpi-foot">Currently repairing</div>
      </div>
      <div class="kpi-card kpi-blue">
        <div class="kpi-bg-icon">⏳</div>
        <div class="kpi-label">Awaiting Parts</div>
        <div class="kpi-val">${tm.awaiting}</div>
        <div class="kpi-foot">Parts on order</div>
      </div>
      <div class="kpi-card kpi-green">
        <div class="kpi-bg-icon">✓</div>
        <div class="kpi-label">Completed (Week)</div>
        <div class="kpi-val">${tm.doneThisWeek}</div>
        <div class="kpi-foot">This week</div>
      </div>
      <div class="kpi-card kpi-gold">
        <div class="kpi-bg-icon">📁</div>
        <div class="kpi-label">Total Assigned</div>
        <div class="kpi-val">${tm.totalAssigned}</div>
        <div class="kpi-foot">${tm.completed} completed overall</div>
      </div>
    </div>

    <div class="dash-row">
      <div class="card" style="flex:1">
        <div class="card-head">
          <span class="card-title">My Active Tickets</span>
          <span class="card-badge">Live</span>
        </div>
        <div class="tbl-wrap">
          <table class="tbl">
            <thead><tr>
              <th>Ticket #</th><th>Customer</th><th>Device</th><th>Issue</th><th>Status</th><th>Priority</th><th>Actions</th>
            </tr></thead>
            <tbody id="dash-tbody"></tbody>
          </table>
        </div>
      </div>
      <div class="card dash-notif-card">
        <div class="card-head">
          <span class="card-title">Activity Feed</span>
          <span class="notif-count" id="notif-count">0</span>
        </div>
        <div class="notif-feed" id="notif-feed"></div>
      </div>
    </div>
  `;

  document.getElementById('dash-date').textContent =
    new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const notifs = Store.getNotifs();
  const feed = document.getElementById('notif-feed');
  document.getElementById('notif-count').textContent = notifs.length;
  if (!notifs.length) { feed.innerHTML='<div class="empty"><div class="empty-txt">No activity yet</div></div>'; }
  else {
    feed.innerHTML = notifs.slice(0,7).map(n =>
      `<div class="notif-item">
        <div class="notif-dot nd-${n.type}"></div>
        <div><div class="notif-text">${n.text}</div><div class="notif-time">${n.time}</div></div>
      </div>`).join('');
  }

  const activeStatuses = ['Received','In Progress','Awaiting Parts'];
  const myActive = tm.myTickets
    .filter(t => activeStatuses.includes(t.ticket_status))
    .sort((a,b) => {
      const pOrder = {'Urgent':0,'High':1,'Normal':2,'Low':3};
      return (pOrder[a.priority]||2)-(pOrder[b.priority]||2);
    });
  const allDisplay = myActive.length ? myActive : tm.myTickets.slice().reverse().slice(0,6);

  const tbody = document.getElementById('dash-tbody');
  tbody.innerHTML = !allDisplay.length ? emptyRow(7,'🔧','No tickets assigned to you yet') :
    allDisplay.map(t => {
      const issue = (t.reported_issue||'').length>40 ? t.reported_issue.slice(0,40)+'…' : t.reported_issue;
      return `<tr onclick="viewTicket('${t.ticket_id}')" style="cursor:pointer">
        <td><span style="font-family:var(--font-mono);font-size:11px;color:var(--accent)">${t.ticket_name}</span></td>
        <td>${Store.getCustomerName(t.customer_id)}</td>
        <td><div style="font-weight:600">${t.device_brand} ${t.device_model}</div><div style="font-size:10px;color:var(--t3)">${t.device_type}</div></td>
        <td style="color:var(--t2);font-size:12px;max-width:140px">${issue}</td>
        <td>${statusBadge(t.ticket_status)}</td>
        <td>${priorityBadge(t.priority)}</td>
        <td><div class="actions">
          <button class="btn-act" onclick="event.stopPropagation();viewTicket('${t.ticket_id}')">View</button>
          <button class="btn-act" onclick="event.stopPropagation();quickNext('${t.ticket_id}')">Next →</button>
        </div></td>
      </tr>`;
    }).join('');
}

// ================================================================
// SHARED HELPERS for dashboard charts
// ================================================================
function renderStatusBars(byStatus) {
  const colors = { 'Received':'#44446A','In Progress':'#F5B800','Awaiting Parts':'#3D9EFF','Completed':'#00F5A0','Released':'#8B5CF6' };
  const total = Object.values(byStatus).reduce((a,b)=>a+b,0)||1;
  return `<div class="bar-grp">` +
    Object.entries(byStatus).map(([s,n]) => {
      const pct = Math.round(n/total*100);
      return `<div class="bar-row">
        <span class="bar-lbl">${s}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${colors[s]}">${n}</div></div>
      </div>`;
    }).join('') + `</div>`;
}

function renderMonthlyBars(months) {
  const maxV = Math.max(...months.map(m=>m.count))||1;
  return `<div class="bar-grp">` +
    months.map(({ label, count }) => {
      const pct = Math.round(count/maxV*100);
      if (count === 0) {
        return `<div class="bar-row"><span class="bar-lbl">${label}</span><div class="bar-track"><div style="height:100%;display:flex;align-items:center;padding:0 10px;font-size:10px;color:var(--t3)">No tickets</div></div></div>`;
      }
      return `<div class="bar-row"><span class="bar-lbl">${label}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:linear-gradient(90deg,var(--accent),var(--accent2))">${count} ticket${count!==1?'s':''}</div></div></div>`;
    }).join('') + `</div>`;
}
