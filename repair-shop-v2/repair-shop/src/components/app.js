// ================================================================
// APP.JS — Module I: User Authentication & Role-Based Access Control
// Roles: Admin, Reception, Technician, Customer
// ================================================================

// Particle canvas animation
(function initParticles() {
  window.addEventListener('load', () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 60; i++) {
      particles.push({ x: Math.random()*1920, y: Math.random()*1080, vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3, r: Math.random()*1.5+0.5, a: Math.random()*0.5+0.1 });
    }
    function draw() {
      ctx.clearRect(0,0,W,H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0)p.x=W; if (p.x>W)p.x=0;
        if (p.y<0)p.y=H; if (p.y>H)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(255,100,30,${p.a})`; ctx.fill();
      });
      // Draw connecting lines
      for (let i=0; i<particles.length; i++) {
        for (let j=i+1; j<particles.length; j++) {
          const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if (dist<120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y);
            ctx.strokeStyle=`rgba(255,100,30,${0.08*(1-dist/120)})`; ctx.lineWidth=0.5; ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  });
})();

// ---- Role selection ----
function selectRole(btn, role) {
  document.querySelectorAll('.role-tile').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentRole = role;
}

// ---- Login (Module I: User Authentication) ----
function doLogin() {
  const email = document.getElementById('login-user').value.trim();
  const pass  = document.getElementById('login-pass').value.trim();
  if (!email || !pass) { showToast('Please enter your credentials', 'error'); return; }

  if (currentRole === 'customer') {
    // Customer login — find matching customer record
    const cust = Store.getCustomerByEmail(email);
    if (!cust) { showToast('No customer account found with that email', 'error'); return; }
    currentUser = { id: cust.customer_id, name: `${cust.first_name} ${cust.last_name}`, role: 'customer', ref: cust };
    launchCustomerPortal();
    return;
  }

  // Staff login
  const staffNames = {
    admin: { name: 'Maria Santos', id: 'u1' },
    reception: { name: 'Ana Dela Cruz', id: 'u3' },
    technician: { name: 'Carlo Reyes', id: 'u2' }
  };
  const s = staffNames[currentRole];
  currentUser = { id: s.id, name: s.name, role: currentRole };

  document.getElementById('sb-user-name').textContent = currentUser.name;
  document.getElementById('sb-user-role').textContent = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
  document.getElementById('sb-avatar').textContent = currentUser.name.split(' ').map(w=>w[0]).join('').slice(0,2);

  applyRoleNav();

  document.getElementById('page-login').classList.remove('active');
  document.getElementById('page-app').classList.add('active');

  // Boot all pages
  renderDashboard();
  renderCustomers();
  renderTickets();
  renderHistory();
  renderPayments();
  renderUsers();
  renderReports();
  populateTicketDropdowns();
  populatePaymentDropdown();

  document.getElementById('dash-date').textContent =
    new Date().toLocaleDateString('en-PH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // First nav item for role
  const firstLink = document.querySelector(`.sb-link[data-roles*="${currentRole}"]`);
  if (firstLink) { navTo(firstLink.dataset.page, firstLink); }

  showToast(`Welcome back, ${currentUser.name}!`, 'success');
}

function launchCustomerPortal() {
  document.getElementById('page-login').classList.remove('active');
  document.getElementById('page-customer').classList.add('active');
  document.getElementById('cp-user-name').textContent = currentUser.name;
  renderCustomerPortal(currentUser.id);
  showToast(`Welcome, ${currentUser.name}!`, 'success');
}

// ---- Role-based nav visibility ----
function applyRoleNav() {
  document.querySelectorAll('.sb-link, .sb-nav-label').forEach(el => {
    const roles = el.getAttribute('data-roles');
    if (roles) el.style.display = roles.split(',').includes(currentRole) ? '' : 'none';
  });
  // Technician: hide New Ticket button
  const nBtn = document.getElementById('btn-new-ticket');
  if (nBtn) nBtn.style.display = currentRole === 'technician' ? 'none' : '';
  // Show/hide status fields in ticket modal
  const sw = document.getElementById('t-status-wrap');
  if (sw) sw.style.display = currentRole === 'reception' ? 'none' : '';
}

function doLogout() {
  currentUser = null;
  ['page-app','page-customer'].forEach(id => document.getElementById(id).classList.remove('active'));
  document.getElementById('page-login').classList.add('active');
  // Re-select admin by default
  document.querySelectorAll('.role-tile').forEach(b => b.classList.remove('active'));
  document.querySelector('.role-tile[data-role="admin"]').classList.add('active');
  currentRole = 'admin';
  showToast('Signed out successfully', 'info');
}

// ---- Navigation ----
function navTo(page, el) {
  if (el) {
    const roles = el.getAttribute('data-roles') || '';
    if (roles && !roles.split(',').includes(currentRole)) {
      showToast('Access denied for your role', 'error'); return false;
    }
  }
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-' + page)?.classList.add('active');
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
  if (el) el.classList.add('active');
  return false;
}

// ---- Modal helpers ----
function openModal(id) {
  document.getElementById('overlay').classList.add('open');
  document.getElementById(id).classList.add('open');
}
function closeModals() {
  document.getElementById('overlay').classList.remove('open');
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
  // Reset ticket modal
  document.getElementById('edit-tkt-id').value = '';
  document.getElementById('modal-tkt-title').textContent = 'New Repair Ticket';
  document.getElementById('tkt-submit-btn').textContent = 'Create Ticket';
  // Reset customer modal
  document.getElementById('edit-cust-id').value = '';
  document.getElementById('modal-cust-title').textContent = 'New Customer';
}

// ---- Toast ----
function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg; t.className = `toast show ${type}`;
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ---- Badge helpers ----
function statusBadge(s) {
  const map = { 'Received':'received','In Progress':'inprogress','Awaiting Parts':'awaiting','Completed':'completed','Released':'released' };
  return `<span class="badge b-${map[s]||'received'}">${s}</span>`;
}
function priorityBadge(p) {
  return `<span class="badge b-${(p||'normal').toLowerCase()}">${p||'Normal'}</span>`;
}
function roleBadge(r) {
  return `<span class="badge b-${r}">${r.charAt(0).toUpperCase()+r.slice(1)}</span>`;
}
function payStatusBadge(s) {
  return `<span class="badge b-${(s||'pending').toLowerCase()}">${s}</span>`;
}
function emptyRow(cols, icon, msg) {
  return `<tr><td colspan="${cols}"><div class="empty"><div class="empty-icon">${icon}</div><div class="empty-txt">${msg}</div></div></td></tr>`;
}
function openNewTicket() {
  closeModals();
  document.getElementById('t-status-wrap').style.display = currentRole !== 'reception' ? 'block' : 'none';
  openModal('modal-ticket');
}
