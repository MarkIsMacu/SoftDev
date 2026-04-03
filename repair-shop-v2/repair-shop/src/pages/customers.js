// ================================================================
// CUSTOMERS.JS — Module II: Customer Management (tbl_customer)
// ================================================================
function renderCustomers() {
  const search = (document.getElementById('cust-search')?.value||'').toLowerCase();
  const customers = Store.getCustomers().filter(c =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(search) ||
    c.phone.includes(search) || (c.email||'').toLowerCase().includes(search)
  );
  document.getElementById('cust-count').textContent = Store.getCustomers().length;
  const tbody = document.getElementById('cust-tbody');
  tbody.innerHTML = !customers.length ? emptyRow(7,'◉','No customers found') :
    customers.map(c => {
      const tc = Store.getCustomerTicketCount(c.customer_id);
      return `<tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:34px;height:34px;border-radius:10px;background:var(--accent-dim);border:1px solid rgba(255,69,0,0.2);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;color:var(--accent);flex-shrink:0">${c.first_name[0]}${c.last_name[0]}</div>
            <div><div style="font-weight:600">${c.first_name} ${c.last_name}</div><div style="font-size:10px;color:var(--t3);font-family:var(--font-mono)">${c.customer_id}</div></div>
          </div>
        </td>
        <td style="font-family:var(--font-mono);font-size:12px">${c.phone}</td>
        <td style="color:var(--t2)">${c.email||'—'}</td>
        <td>${c.city||'—'}</td>
        <td><span class="badge b-reception">${tc} ticket${tc!==1?'s':''}</span></td>
        <td style="font-family:var(--font-mono);font-size:11px;color:var(--t2)">${c.created_date}</td>
        <td><div class="actions">
          <button class="btn-act" onclick="editCustomer('${c.customer_id}')">Edit</button>
          ${currentRole==='admin'?`<button class="btn-act danger" onclick="deleteCustomer('${c.customer_id}')">Delete</button>`:''}
        </div></td>
      </tr>`;
    }).join('');
}

function saveCustomer() {
  const id    = document.getElementById('edit-cust-id').value;
  const fname = document.getElementById('c-fname').value.trim();
  const lname = document.getElementById('c-lname').value.trim();
  const phone = document.getElementById('c-phone').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const addr  = document.getElementById('c-address').value.trim();
  const city  = document.getElementById('c-city').value.trim();
  if (!fname||!lname||!phone) { showToast('First name, last name, and phone required','error'); return; }
  if (id) {
    Store.updateCustomer(id, { first_name:fname, last_name:lname, phone, email, address:addr, city });
    showToast('Customer updated','success');
  } else {
    Store.addCustomer({ first_name:fname, last_name:lname, phone, email, address:addr, city });
    showToast(`Customer ${fname} ${lname} added!`,'success');
  }
  closeModals(); clearCustForm(); renderCustomers(); populateTicketDropdowns(); populatePaymentDropdown();
}

function editCustomer(id) {
  const c = Store.getCustomerById(id); if (!c) return;
  document.getElementById('edit-cust-id').value = c.customer_id;
  document.getElementById('c-fname').value   = c.first_name;
  document.getElementById('c-lname').value   = c.last_name;
  document.getElementById('c-phone').value   = c.phone;
  document.getElementById('c-email').value   = c.email||'';
  document.getElementById('c-address').value = c.address||'';
  document.getElementById('c-city').value    = c.city||'';
  document.getElementById('modal-cust-title').textContent = 'Edit Customer';
  openModal('modal-customer');
}

function deleteCustomer(id) {
  if (!confirm('Delete this customer? This cannot be undone.')) return;
  Store.deleteCustomer(id); showToast('Customer deleted','info');
  renderCustomers(); populateTicketDropdowns();
}

function clearCustForm() {
  ['c-fname','c-lname','c-phone','c-email','c-address','c-city'].forEach(i => document.getElementById(i).value='');
}
