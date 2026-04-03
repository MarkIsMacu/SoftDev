// ================================================================
// TICKETS.JS — Module III: Repair Ticket Management
//              Module IV: Status Tracking & Workflow Automation
// Maps to tbl_repair_ticket + tbl_status_update
// ================================================================
let _statusFilter = 'all';

function renderTickets() {
  const search = (document.getElementById('tkt-search')?.value||'').toLowerCase();
  let tix = Store.getTickets();
  if (_statusFilter !== 'all') tix = tix.filter(t => t.ticket_status === _statusFilter);
  if (search) tix = tix.filter(t =>
    t.ticket_name.toLowerCase().includes(search) ||
    Store.getCustomerName(t.customer_id).toLowerCase().includes(search) ||
    (t.device_model||'').toLowerCase().includes(search) ||
    (t.reported_issue||'').toLowerCase().includes(search)
  );
  tix = [...tix].reverse();
  const tbody = document.getElementById('tkt-tbody');
  tbody.innerHTML = !tix.length ? emptyRow(9,'◈','No tickets found') :
    tix.map(t => {
      const tech = Store.getUserById(t.technician_id);
      const techName = tech ? `${tech.first_name} ${tech.last_name}` : '<span style="color:var(--t3)">Unassigned</span>';
      const issue = (t.reported_issue||'').length>45 ? t.reported_issue.slice(0,45)+'…' : t.reported_issue;
      return `<tr>
        <td><button style="font-family:var(--font-mono);font-size:11px;color:var(--accent);background:none;border:none;cursor:pointer;font-weight:700" onclick="viewTicket('${t.ticket_id}')">${t.ticket_name}</button></td>
        <td>${Store.getCustomerName(t.customer_id)}</td>
        <td><div style="font-weight:600">${t.device_brand} ${t.device_model}</div><div style="font-size:10px;color:var(--t3)">${t.device_type}</div></td>
        <td style="max-width:160px;color:var(--t2);font-size:12px">${issue}</td>
        <td>${techName}</td>
        <td>${statusBadge(t.ticket_status)}</td>
        <td>${priorityBadge(t.priority)}</td>
        <td style="font-family:var(--font-mono);font-size:12px">${formatCurrency(t.estimated_cost)}</td>
        <td><div class="actions">
          <button class="btn-act" onclick="viewTicket('${t.ticket_id}')">View</button>
          ${currentRole!=='reception'?`<button class="btn-act" onclick="quickNext('${t.ticket_id}')">Next →</button>`:''}
          ${currentRole==='admin'?`<button class="btn-act danger" onclick="delTicket('${t.ticket_id}')">Del</button>`:''}
        </div></td>
      </tr>`;
    }).join('');
}

function filterStatus(s, btn) {
  _statusFilter = s;
  document.querySelectorAll('.pill-row .pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderTickets();
}

function populateTicketDropdowns() {
  const cSel = document.getElementById('t-cust');
  const tSel = document.getElementById('t-tech');
  cSel.innerHTML = '<option value="">Select customer...</option>' +
    Store.getCustomers().map(c => `<option value="${c.customer_id}">${c.first_name} ${c.last_name} — ${c.phone}</option>`).join('');
  tSel.innerHTML = '<option value="">Unassigned</option>' +
    Store.getTechnicians().map(u => `<option value="${u.technician_id}">${u.first_name} ${u.last_name} (${u.specialization})</option>`).join('');
}

function saveTicket() {
  const editId     = document.getElementById('edit-tkt-id').value;
  const customer_id  = document.getElementById('t-cust').value;
  const technician_id= document.getElementById('t-tech').value||null;
  const device_type  = document.getElementById('t-dtype').value;
  const rawModel     = document.getElementById('t-model').value.trim();
  const serial_number= document.getElementById('t-serial').value.trim()||null;
  const reported_issue=document.getElementById('t-issue').value.trim();
  const priority     = document.getElementById('t-priority').value;
  const estimated_cost=parseFloat(document.getElementById('t-cost').value)||0;
  const ticket_status= document.getElementById('t-status')?.value||'Received';
  const actual_cost  = parseFloat(document.getElementById('t-actual')?.value)||null;
  const notes        = document.getElementById('t-notes')?.value||'';

  if (!customer_id||!device_type||!rawModel||!reported_issue) {
    showToast('Customer, device type, model, and issue are required','error'); return;
  }
  // Parse brand/model
  const parts = rawModel.split(' ');
  const device_brand = parts[0];
  const device_model = rawModel;

  if (editId) {
    const byLabel = currentUser ? `${currentUser.name} (${currentRole})` : 'System';
    Store.updateTicket(editId, { customer_id, technician_id, device_type, device_brand, device_model, serial_number, reported_issue, priority, estimated_cost, ticket_status, actual_cost, notes }, byLabel);
    showToast('Ticket updated successfully','success');
  } else {
    Store.addTicket({ customer_id, technician_id, device_type, device_brand, device_model, serial_number, reported_issue, priority, estimated_cost });
    showToast('Repair ticket created!','success');
  }
  closeModals(); clearTktForm(); renderTickets(); renderDashboard(); renderHistory(); renderReports();
}

function editTicket(id) {
  const t = Store.getTicketById(id); if (!t) return;
  document.getElementById('edit-tkt-id').value = t.ticket_id;
  document.getElementById('t-cust').value    = t.customer_id;
  document.getElementById('t-tech').value    = t.technician_id||'';
  document.getElementById('t-dtype').value   = t.device_type;
  document.getElementById('t-model').value   = t.device_model;
  document.getElementById('t-serial').value  = t.serial_number||'';
  document.getElementById('t-issue').value   = t.reported_issue;
  document.getElementById('t-priority').value= t.priority;
  document.getElementById('t-cost').value    = t.estimated_cost||'';
  const sw = document.getElementById('t-status-wrap');
  sw.style.display = 'block';
  document.getElementById('t-status').value  = t.ticket_status;
  document.getElementById('t-actual').value  = t.actual_cost||'';
  document.getElementById('t-notes').value   = t.notes||'';
  document.getElementById('modal-tkt-title').textContent = `Edit — ${t.ticket_name}`;
  document.getElementById('tkt-submit-btn').textContent = 'Save Changes';
  closeModals(); openModal('modal-ticket');
}

function quickNext(id) {
  const statuses = ['Received','In Progress','Awaiting Parts','Completed','Released'];
  const t = Store.getTicketById(id); if (!t) return;
  const next = statuses[(statuses.indexOf(t.ticket_status)+1) % statuses.length];
  const by = currentUser ? `${currentUser.name} (${currentRole})` : 'System';
  Store.updateTicket(id, { ticket_status: next }, by);
  showToast(`${t.ticket_name} → ${next}`,'success');
  renderTickets(); renderDashboard(); renderHistory(); renderReports(); renderPayments();
}

function viewTicket(id) {
  const t = Store.getTicketById(id); if (!t) return;
  const cust = Store.getCustomerById(t.customer_id);
  const tech = Store.getUserById(t.technician_id);
  const pays = Store.getPaymentsByTicket(t.ticket_id);

  document.getElementById('detail-title').textContent = `${t.ticket_name} — Details`;
  document.getElementById('detail-body').innerHTML = `
    <div class="det-grid">
      <div class="det-card">
        <div class="det-card-title">Customer</div>
        <div class="det-field"><div class="det-lbl">customer_id</div><div class="det-val" style="font-family:var(--font-mono);font-size:11px;color:var(--t3)">${t.customer_id}</div></div>
        <div class="det-field"><div class="det-lbl">Name</div><div class="det-val">${cust ? `${cust.first_name} ${cust.last_name}` : '—'}</div></div>
        <div class="det-field"><div class="det-lbl">phone</div><div class="det-val" style="font-family:var(--font-mono)">${cust?.phone||'—'}</div></div>
        <div class="det-field"><div class="det-lbl">email</div><div class="det-val">${cust?.email||'—'}</div></div>
      </div>
      <div class="det-card">
        <div class="det-card-title">Device</div>
        <div class="det-field"><div class="det-lbl">device_type</div><div class="det-val">${t.device_type}</div></div>
        <div class="det-field"><div class="det-lbl">device_brand / device_model</div><div class="det-val">${t.device_brand} ${t.device_model}</div></div>
        <div class="det-field"><div class="det-lbl">serial_number</div><div class="det-val" style="font-family:var(--font-mono)">${t.serial_number||'—'}</div></div>
        <div class="det-field"><div class="det-lbl">technician_id</div><div class="det-val">${tech ? `${tech.first_name} ${tech.last_name}` : 'Unassigned'}</div></div>
      </div>
    </div>

    <div class="det-card" style="margin-bottom:14px">
      <div class="det-card-title">reported_issue</div>
      <div style="color:var(--t1);font-size:13px;margin-top:8px;line-height:1.6">${t.reported_issue}</div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:14px">
      ${[['ticket_status',statusBadge(t.ticket_status)],['priority',priorityBadge(t.priority)],
         ['estimated_cost',`<span style="font-family:var(--font-mono);font-size:13px;font-weight:700">${formatCurrency(t.estimated_cost)}</span>`],
         ['actual_cost',`<span style="font-family:var(--font-mono);font-size:13px;font-weight:700;color:var(--green)">${formatCurrency(t.actual_cost)}</span>`],
         ['created_date',`<span style="font-family:var(--font-mono);font-size:11px;color:var(--t2)">${t.created_date}</span>`]
       ].map(([l,v])=>`<div class="det-card" style="text-align:center"><div class="det-lbl">${l}</div><div style="margin-top:6px">${v}</div></div>`).join('')}
    </div>

    ${pays.length ? `<div class="det-card" style="margin-bottom:14px">
      <div class="det-card-title">Payments (tbl_payment)</div>
      ${pays.map(p=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--b1)">
        <span style="color:var(--t2);font-size:12px">${p.payment_date} — ${p.payment_method}</span>
        <div style="display:flex;gap:8px;align-items:center">${payStatusBadge(p.payment_status)}<span style="font-family:var(--font-mono);font-weight:700;color:var(--green)">${formatCurrency(p.amount)}</span></div>
      </div>`).join('')}
    </div>`:''}

    ${t.notes ? `<div class="det-card" style="margin-bottom:14px">
      <div class="det-card-title">Technician Notes</div>
      <div style="color:var(--t2);font-size:12px;margin-top:8px;font-family:var(--font-mono);line-height:1.6">${t.notes}</div>
    </div>`:''}

    <div class="det-card">
      <div class="det-card-title">Timeline</div>
      <div class="timeline">${(t.timeline||[]).map(ev=>`
        <div class="tl-item">
          <div class="tl-dot"></div>
          <div><div class="tl-action">${ev.action}</div><div class="tl-meta">${ev.by} · ${ev.date}</div></div>
        </div>`).join('')}
      </div>
    </div>

    <div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end">
      ${currentRole!=='reception'?`<button class="btn-primary" onclick="closeModals();editTicket('${t.ticket_id}')">Edit Ticket</button>`:''}
      ${currentRole!=='reception'?`<button class="btn-ghost" onclick="closeModals();quickNext('${t.ticket_id}')">Next Status →</button>`:''}
    </div>`;
  openModal('modal-detail');
}

function delTicket(id) {
  if (!confirm('Delete this ticket?')) return;
  Store.deleteTicket(id); showToast('Ticket deleted','info');
  renderTickets(); renderDashboard();
}

function clearTktForm() {
  ['t-cust','t-tech','t-dtype','t-model','t-serial','t-issue','t-cost','t-actual','t-notes'].forEach(i => {
    const el = document.getElementById(i); if (el) el.value = '';
  });
  document.getElementById('t-priority').value = 'Normal';
  const ts = document.getElementById('t-status'); if (ts) ts.value = 'Received';
}
