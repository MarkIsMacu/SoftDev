// ================================================================
// REPORTS.JS — Module VI: Full Admin Reporting & Analytics
// Admin-only section with comprehensive business intelligence
// ================================================================
function renderReports() {
  if (currentRole !== 'admin') return; // Only admins see reports

  const m    = Store.getAdminMetrics();
  const hist = Store.getHistory();
  const tix  = Store.getTickets();
  const pays = Store.getPayments();

  // ---- 1. Status distribution ----
  const colors = { 'Received':'#44446A','In Progress':'#F5B800','Awaiting Parts':'#3D9EFF','Completed':'#00F5A0','Released':'#8B5CF6' };
  const total  = Object.values(m.byStatus).reduce((a,b)=>a+b,0)||1;
  document.getElementById('rpt-status').innerHTML =
    `<div class="bar-grp">` +
    Object.entries(m.byStatus).map(([s,n]) => {
      const pct = Math.round(n/total*100);
      return `<div class="bar-row"><span class="bar-lbl">${s}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(pct,2)}%;background:${colors[s]}">${n} (${pct}%)</div></div></div>`;
    }).join('') + `</div>`;

  // ---- 2. Revenue summary ----
  document.getElementById('rpt-revenue').innerHTML = [
    ['Total Revenue (service)',   `<span style="color:var(--green)">${formatCurrency(m.totalRevenue)}</span>`],
    ['Total Collected',           `<span style="color:var(--green)">${formatCurrency(m.totalCollected)}</span>`],
    ['Pending Revenue',           `<span style="color:var(--yellow)">${formatCurrency(m.pendingRevenue)}</span>`],
    ['Avg Revenue / Job',         formatCurrency(m.avgRevPerJob)],
    ['Total Tickets',             m.totalTickets],
    ['Completed + Released',      m.completedCount],
    ['Completion Rate',           `<span style="color:var(--green)">${m.completionRate}%</span>`],
    ['Service Records',           hist.length],
  ].map(([l,v])=>`<div class="stat-item"><span class="stat-lbl">${l}</span><span class="stat-val">${v}</span></div>`).join('');

  // ---- 3. Monthly ticket volume ----
  const maxV = Math.max(...m.months.map(mo=>mo.count))||1;
  document.getElementById('rpt-monthly').innerHTML =
    `<div class="bar-grp">` +
    m.months.map(({ label, count }) => {
      const pct = Math.round(count/maxV*100);
      if (count === 0) {
        return `<div class="bar-row"><span class="bar-lbl">${label}</span><div class="bar-track"><div style="height:100%;display:flex;align-items:center;padding:0 10px;font-size:10px;color:var(--t3)">No tickets</div></div></div>`;
      }
      return `<div class="bar-row"><span class="bar-lbl">${label}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:linear-gradient(90deg,var(--accent),var(--accent2))">${count} ticket${count!==1?'s':''}</div></div></div>`;
    }).join('') + `</div>`;

  // ---- 4. Technician Performance ----
  const rptTech = document.getElementById('rpt-tech');
  if (rptTech) {
    if (!m.techPerf.length) {
      rptTech.innerHTML = '<div class="empty"><div class="empty-txt">No technician data</div></div>';
    } else {
      rptTech.innerHTML = m.techPerf.map(t => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--b1)">
          <div style="width:38px;height:38px;border-radius:10px;background:var(--purple-dim);border:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;color:var(--purple);flex-shrink:0">${t.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:600;font-size:13px;margin-bottom:4px">${t.name}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${t.rate||2}%;background:linear-gradient(90deg,#8B5CF6,#6D28D9)">${t.rate}% completion</div></div>
          </div>
          <div style="text-align:right;flex-shrink:0;min-width:90px">
            <div style="font-family:var(--font-mono);font-size:13px;color:var(--green);font-weight:700">${formatCurrency(t.revenue)}</div>
            <div style="font-size:10px;color:var(--t3);margin-top:2px">${t.assigned} jobs · ${t.completed} done</div>
          </div>
        </div>
      `).join('');
    }
  }

  // ---- 5. Device Type Breakdown ----
  const rptDevice = document.getElementById('rpt-device');
  if (rptDevice) {
    const devEntries = Object.entries(m.deviceMap).sort((a,b)=>b[1]-a[1]);
    const devTotal = devEntries.reduce((s,[,n])=>s+n,0)||1;
    rptDevice.innerHTML = devEntries.length
      ? `<div class="bar-grp">${devEntries.map(([type,count]) => {
          const pct = Math.round(count/devTotal*100);
          return `<div class="bar-row"><span class="bar-lbl">${type}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(pct,2)}%;background:linear-gradient(90deg,#3D9EFF,#1E6FD9)">${count} (${pct}%)</div></div></div>`;
        }).join('')}</div>`
      : '<div class="empty"><div class="empty-txt">No device data</div></div>';
  }

  // ---- 6. Payment Method Revenue ----
  const rptPayMethod = document.getElementById('rpt-paymethod');
  if (rptPayMethod) {
    const payEntries = Object.entries(m.payMethods).sort((a,b)=>b[1]-a[1]);
    const payTotal = payEntries.reduce((s,[,n])=>s+n,0)||1;
    rptPayMethod.innerHTML = payEntries.length
      ? payEntries.map(([method, amount]) => {
          const pct = Math.round(amount/payTotal*100);
          return `<div class="stat-item">
            <span class="stat-lbl">${method}</span>
            <span class="stat-val" style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
              <span style="color:var(--green);font-family:var(--font-mono);font-weight:700">${formatCurrency(amount)}</span>
              <span style="font-size:10px;color:var(--t3)">${pct}% of total</span>
            </span>
          </div>`;
        }).join('')
      : '<div class="empty"><div class="empty-txt">No payment data</div></div>';
  }

  // ---- 7. Priority Breakdown ----
  const rptPriority = document.getElementById('rpt-priority');
  if (rptPriority) {
    const prColors = { 'Urgent':'#FF2D2D','High':'#FF8C00','Normal':'#3D9EFF','Low':'#8B5CF6' };
    const prTotal = Object.values(m.priorityMap).reduce((s,n)=>s+n,0)||1;
    rptPriority.innerHTML = `<div class="bar-grp">${Object.entries(m.priorityMap).map(([pr,count]) => {
      const pct = Math.round(count/prTotal*100);
      return `<div class="bar-row"><span class="bar-lbl">${pr}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(pct,2)}%;background:${prColors[pr]}">${count} (${pct}%)</div></div></div>`;
    }).join('')}</div>`;
  }
}
