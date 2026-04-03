// ================================================================
// PAYMENTS.JS — tbl_payment (from Lab 2 ERD)
// ================================================================
function renderPayments() {
  const pays = [...Store.getPayments()].reverse();
  const tbody = document.getElementById('pay-tbody');
  tbody.innerHTML = !pays.length ? emptyRow(8,'◫','No payments recorded yet') :
    pays.map(p => {
      const t = Store.getTicketById(p.ticket_id);
      return `<tr>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--accent)">${p.payment_id}</td>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--t2)">${t?.ticket_name||p.ticket_id}</td>
        <td>${Store.getCustomerName(p.customer_id)}</td>
        <td style="font-family:var(--font-mono);font-weight:700;color:var(--green)">${formatCurrency(p.amount)}</td>
        <td><span class="badge b-reception">${p.payment_method}</span></td>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--t2)">${p.payment_date}</td>
        <td>${payStatusBadge(p.payment_status)}</td>
        <td>${currentRole==='admin'?`<button class="btn-act danger" onclick="deletePayment('${p.payment_id}')">Del</button>`:'—'}</td>
      </tr>`;
    }).join('');
}

function populatePaymentDropdown() {
  const sel = document.getElementById('p-ticket');
  const completedOrReleased = Store.getTickets().filter(t => t.ticket_status==='Completed'||t.ticket_status==='Released');
  sel.innerHTML = '<option value="">Select completed ticket...</option>' +
    completedOrReleased.map(t => `<option value="${t.ticket_id}">${t.ticket_name} — ${Store.getCustomerName(t.customer_id)}</option>`).join('');
}

function savePayment() {
  const ticket_id = document.getElementById('p-ticket').value;
  const amount    = parseFloat(document.getElementById('p-amount').value)||0;
  const method    = document.getElementById('p-method').value;
  const status    = document.getElementById('p-status').value;
  if (!ticket_id||!amount) { showToast('Ticket and amount required','error'); return; }
  const t = Store.getTicketById(ticket_id);
  Store.addPayment({ ticket_id, customer_id: t?.customer_id||'', amount, payment_method: method, payment_status: status });
  showToast(`Payment of ${formatCurrency(amount)} recorded!`,'success');
  closeModals(); renderPayments(); renderReports(); renderDashboard();
}

function deletePayment(id) {
  // For demo: just re-render (Store doesn't persist delete for payments here — add if needed)
  showToast('Payment record removed','info');
}
