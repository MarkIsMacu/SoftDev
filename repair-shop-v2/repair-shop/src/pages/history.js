// ================================================================
// HISTORY.JS — Module VII: Service History (tbl_service_history)
// ================================================================
function renderHistory() {
  const search = (document.getElementById('hist-search')?.value||'').toLowerCase();
  const hist = [...Store.getHistory()].reverse().filter(h => {
    const t = Store.getTicketById(h.ticket_id);
    return Store.getCustomerName(h.customer_id).toLowerCase().includes(search) ||
      (t?.ticket_name||'').toLowerCase().includes(search);
  });
  const tbody = document.getElementById('hist-tbody');
  tbody.innerHTML = !hist.length ? emptyRow(8,'◎','No service history yet — complete a ticket to auto-generate records') :
    hist.map(h => {
      const t    = Store.getTicketById(h.ticket_id);
      const tech = Store.getUserById(h.technician_id);
      return `<tr>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--accent)">${h.service_id}</td>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--t2)">${t?.ticket_name||h.ticket_id}</td>
        <td>${Store.getCustomerName(h.customer_id)}</td>
        <td>${tech ? `${tech.first_name} ${tech.last_name}` : '—'}</td>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--t2)">${h.service_date}</td>
        <td style="max-width:180px;color:var(--t2);font-size:12px">${(h.description||'').slice(0,55)}${(h.description||'').length>55?'…':''}</td>
        <td style="font-size:11px;color:var(--t2);max-width:140px">${(h.parts_used||'—').slice(0,40)}${(h.parts_used||'').length>40?'…':''}</td>
        <td style="font-family:var(--font-mono);font-weight:700;color:var(--green)">${formatCurrency(h.cost)}</td>
      </tr>`;
    }).join('');
}
