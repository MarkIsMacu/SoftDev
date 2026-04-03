// ================================================================
// USERS.JS — Module I: Role Management (tbl_technician)
// ================================================================
function renderUsers() {
  const users = Store.getUsers();
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = users.map(u => `<tr>
    <td style="font-family:var(--font-mono);font-size:11px;color:var(--t3)">${u.technician_id}</td>
    <td>
      <div style="display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;border-radius:9px;background:var(--purple-dim);border:1px solid rgba(139,92,246,0.2);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;color:var(--purple)">${u.first_name[0]}${u.last_name[0]}</div>
        <span style="font-weight:600">${u.first_name} ${u.last_name}</span>
      </div>
    </td>
    <td style="font-family:var(--font-mono);font-size:11px;color:var(--t2)">${u.email}</td>
    <td>${roleBadge(u.role)}</td>
    <td style="color:var(--t2)">${u.specialization||'—'}</td>
    <td style="font-family:var(--font-mono);font-size:11px;color:var(--t2)">${u.hire_date||'—'}</td>
    <td><span class="badge b-active">${u.status||'Active'}</span></td>
    <td>${currentRole==='admin'&&u.technician_id!=='u1'?`<button class="btn-act danger" onclick="delUser('${u.technician_id}')">Remove</button>`:'<span style="color:var(--t3)">—</span>'}</td>
  </tr>`).join('');
}

function saveUser() {
  const fname = document.getElementById('u-fname').value.trim();
  const lname = document.getElementById('u-lname').value.trim();
  const email = document.getElementById('u-email').value.trim();
  const phone = document.getElementById('u-phone').value.trim();
  const spec  = document.getElementById('u-spec').value.trim();
  const role  = document.getElementById('u-role').value;
  if (!fname||!lname||!email) { showToast('Name and email required','error'); return; }
  Store.addUser({ first_name:fname, last_name:lname, email, phone, specialization:spec, role, status:'Active' });
  showToast(`User ${fname} ${lname} added as ${role}`,'success');
  closeModals();
  ['u-fname','u-lname','u-email','u-phone','u-spec'].forEach(i => document.getElementById(i).value='');
  renderUsers(); populateTicketDropdowns();
}

function delUser(id) {
  if (!confirm('Remove this user?')) return;
  Store.deleteUser(id); showToast('User removed','info');
  renderUsers(); populateTicketDropdowns();
}
