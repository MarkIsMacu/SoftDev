// ================================================================
// CUSTOMER-PORTAL.JS — Customer Dashboard (US4: Customer View)
// Shows only their own tickets and service history
// Matches User Story US1, US4 from Lab 2
// ================================================================
function renderCustomerPortal(customerId) {
  const tickets = Store.getTicketsByCustomer(customerId);
  const hist    = Store.getHistoryByCustomer(customerId);

  // KPIs
  document.getElementById('cp-total').textContent  = tickets.length;
  document.getElementById('cp-active').textContent = tickets.filter(t => !['Completed','Released'].includes(t.ticket_status)).length;
  document.getElementById('cp-done').textContent   = tickets.filter(t => ['Completed','Released'].includes(t.ticket_status)).length;

  // My Tickets
  const tbody = document.getElementById('cp-tbody');
  tbody.innerHTML = !tickets.length ? emptyRow(8,'◈','No repair tickets found for your account. Please contact the shop to get started.') :
    [...tickets].reverse().map(t => {
      const tech = Store.getUserById(t.technician_id);
      const isReady = t.ticket_status === 'Completed';
      const isReleased = t.ticket_status === 'Released';
      return `<tr>
        <td>
          <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);font-weight:700">${t.ticket_name}</div>
          <div style="font-size:10px;color:var(--t3);margin-top:2px;font-family:var(--font-mono)">${t.created_date}</div>
        </td>
        <td>
          <div style="font-weight:600">${t.device_brand} ${t.device_model}</div>
          <div style="font-size:10px;color:var(--t3)">${t.device_type}</div>
        </td>
        <td style="max-width:180px;color:var(--t2);font-size:12px">${(t.reported_issue||'').slice(0,50)}${(t.reported_issue||'').length>50?'…':''}</td>
        <td>${statusBadge(t.ticket_status)}</td>
        <td style="font-size:13px">${tech ? `${tech.first_name} ${tech.last_name}` : '<span style="color:var(--t3)">Unassigned</span>'}</td>
        <td style="font-family:var(--font-mono);font-weight:700">${formatCurrency(t.estimated_cost)}</td>
        <td>
          ${isReady ? '<span class="badge b-completed" style="font-size:10px">✓ Ready for Pickup</span>' : ''}
          ${isReleased ? '<span class="badge b-released" style="font-size:10px">Released</span>' : ''}
          ${!isReady && !isReleased ? '<span style="color:var(--t3);font-size:11px">—</span>' : ''}
        </td>
        <td>
          <button class="btn-act" onclick="viewCpTicket('${t.ticket_id}')">View</button>
        </td>
      </tr>`;
    }).join('');

  // Service History
  const hbody = document.getElementById('cp-hist-tbody');
  hbody.innerHTML = !hist.length ? emptyRow(6,'◎','No completed repairs yet — history will appear here once a repair is marked complete.') :
    [...hist].reverse().map(h => {
      const t = Store.getTicketById(h.ticket_id);
      return `<tr>
        <td>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--accent);font-weight:700">${t?.ticket_name||h.ticket_id}</span>
        </td>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--t2)">${h.service_date}</td>
        <td style="color:var(--t1);font-size:12px;max-width:200px">${h.description}</td>
        <td style="font-size:11px;color:var(--t2);max-width:160px">${h.parts_used||'—'}</td>
        <td style="font-family:var(--font-mono);font-weight:700;color:var(--green)">${formatCurrency(h.cost)}</td>
        <td style="font-size:11px;color:var(--t2)">${h.notes||'—'}</td>
      </tr>`;
    }).join('');
}

// Customer view-only ticket detail modal
function viewCpTicket(id) {
  const t = Store.getTicketById(id);
  if (!t) return;
  const tech = Store.getUserById(t.technician_id);
  const pays = Store.getPaymentsByTicket(t.ticket_id);

  document.getElementById('detail-title').textContent = `${t.ticket_name} — Your Repair`;
  document.getElementById('detail-body').innerHTML = `
    <div class="det-grid">
      <div class="det-card">
        <div class="det-card-title">Device</div>
        <div class="det-field"><div class="det-lbl">Type</div><div class="det-val">${t.device_type}</div></div>
        <div class="det-field"><div class="det-lbl">Brand & Model</div><div class="det-val">${t.device_brand} ${t.device_model}</div></div>
        <div class="det-field"><div class="det-lbl">Serial Number</div><div class="det-val" style="font-family:var(--font-mono);font-size:11px">${t.serial_number||'—'}</div></div>
      </div>
      <div class="det-card">
        <div class="det-card-title">Repair Info</div>
        <div class="det-field"><div class="det-lbl">Assigned Technician</div><div class="det-val">${tech ? `${tech.first_name} ${tech.last_name}` : '<span style="color:var(--t3)">Not yet assigned</span>'}</div></div>
        <div class="det-field"><div class="det-lbl">Priority</div><div class="det-val">${priorityBadge(t.priority)}</div></div>
        <div class="det-field"><div class="det-lbl">Estimated Cost</div><div class="det-val" style="font-family:var(--font-mono);font-weight:700;color:var(--accent)">${formatCurrency(t.estimated_cost)}</div></div>
        ${t.actual_cost ? `<div class="det-field"><div class="det-lbl">Final Cost</div><div class="det-val" style="font-family:var(--font-mono);font-weight:700;color:var(--green)">${formatCurrency(t.actual_cost)}</div></div>` : ''}
      </div>
    </div>

    <div class="det-card" style="margin-bottom:14px">
      <div class="det-card-title">Reported Issue</div>
      <div style="color:var(--t1);font-size:13px;margin-top:8px;line-height:1.6">${t.reported_issue}</div>
    </div>

    <div style="display:flex;gap:10px;margin-bottom:14px">
      <div class="det-card" style="flex:1;text-align:center">
        <div class="det-lbl">Current Status</div>
        <div style="margin-top:8px">${statusBadge(t.ticket_status)}</div>
      </div>
      <div class="det-card" style="flex:1;text-align:center">
        <div class="det-lbl">Date Created</div>
        <div style="margin-top:8px;font-family:var(--font-mono);font-size:12px;color:var(--t2)">${t.created_date}</div>
      </div>
      <div class="det-card" style="flex:1;text-align:center">
        <div class="det-lbl">Last Updated</div>
        <div style="margin-top:8px;font-family:var(--font-mono);font-size:12px;color:var(--t2)">${t.updated_date}</div>
      </div>
    </div>

    ${t.notes ? `<div class="det-card" style="margin-bottom:14px">
      <div class="det-card-title">Technician Notes</div>
      <div style="color:var(--t2);font-size:12px;margin-top:8px;font-family:var(--font-mono);line-height:1.6">${t.notes}</div>
    </div>` : ''}

    ${pays.length ? `<div class="det-card" style="margin-bottom:14px">
      <div class="det-card-title">Payment</div>
      ${pays.map(p=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--b1)">
        <span style="color:var(--t2);font-size:12px">${p.payment_date} — ${p.payment_method}</span>
        <div style="display:flex;gap:8px;align-items:center">${payStatusBadge(p.payment_status)}<span style="font-family:var(--font-mono);font-weight:700;color:var(--green)">${formatCurrency(p.amount)}</span></div>
      </div>`).join('')}
    </div>` : ''}

    <div class="det-card">
      <div class="det-card-title">Repair Timeline</div>
      <div class="timeline">${(t.timeline||[]).map(ev=>`
        <div class="tl-item">
          <div class="tl-dot"></div>
          <div><div class="tl-action">${ev.action}</div><div class="tl-meta">${ev.by} · ${ev.date}</div></div>
        </div>`).join('')}
      </div>
    </div>
  `;
  openModal('modal-detail');
}
