import './style.css'

// --- State Management ---
let notifications = [
  { id: 1, type: 'request', title: 'New Visitor', body: 'Raghul is at the main gate', time: 'Just now' },
  { id: 2, type: 'request', title: 'New Visitor', body: 'Praveen is at the main gate', time: '1 min ago' },
  { id: 3, type: 'security', title: 'System Alert', body: 'Gate 02 motion detected', time: '5 mins ago' }
];

const mockVisitors = [
  { id: 101, name: 'Raghul', purpose: 'Visitor', phone: '+1 234 567 890', photo: '👤', status: 'pending', time: '15:40' },
  { id: 102, name: 'Praveen', purpose: 'Guest', phone: '+1 987 654 321', photo: '👤', status: 'pending', time: '15:45' }
];

// --- Components ---

const NotificationSystem = {
  add: (n) => {
    notifications.unshift({ ...n, id: Date.now(), time: 'Just now' });
    showToast(`${n.title}: ${n.body}`);
    updateNotifBadge();
    renderNotificationInfo();
  }
};

const updateNotifBadge = () => {
  const badge = document.querySelector('#notif-trigger .badge');
  if (badge) badge.textContent = notifications.length;
}

const showToast = (msg) => {
  const toast = document.createElement('div');
  toast.className = 'toast fade-in';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

const renderNotificationInfo = () => {
  const list = document.querySelector('#notif-popup');
  if (!list) return;
  list.innerHTML = `
        <div class="card" style="position: absolute; top: 70px; right: 0; width: 300px; z-index: 1000; padding: 1rem;">
            <h3 style="margin-bottom: 1rem; font-size: 1rem;">Recent Notifications</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${notifications.map(n => `
                    <div style="padding-bottom: 0.5rem; border-bottom: 1px solid var(--glass-border);">
                        <div style="font-weight: 600; font-size: 0.85rem;">${n.title}</div>
                        <div style="font-size: 0.8rem; color: var(--text-dim);">${n.body}</div>
                        <div style="font-size: 0.7rem; color: var(--primary); margin-top: 2px;">${n.time}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

const renderApprovalModule = () => {
  const container = document.querySelector('#module-container');
  container.innerHTML = `
    <div class="fade-in">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2>Incoming Requests</h2>
        <span class="badge badge-pending">${mockVisitors.filter(v => v.status === 'pending').length} Pending</span>
      </div>
      <div class="grid-2">
        ${mockVisitors.map(v => `
          <div class="card visitor-card" data-id="${v.id}">
            <div style="display: flex; gap: 1rem; align-items: center;">
              <div class="avatar">${v.photo}</div>
              <div style="flex: 1">
                <h3 style="color: var(--text-main)">${v.name}</h3>
                <p>${v.purpose}</p>
              </div>
              <span class="badge badge-${v.status}">${v.status.toUpperCase()}</span>
            </div>
            ${v.status === 'pending' ? `
              <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem;">
                <button class="btn btn-primary approve-btn" data-id="${v.id}" style="flex: 1">Approve</button>
                <button class="btn reject-btn" data-id="${v.id}" style="background: var(--glass); flex: 1; border: 1px solid var(--glass-border); color: var(--text-main)">Reject</button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.querySelectorAll('.approve-btn').forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.dataset.id);
      const visitor = mockVisitors.find(v => v.id === id);
      visitor.status = 'approved';
      NotificationSystem.add({ title: 'Visitor Approved', body: `${visitor.name} has been granted access.`, type: 'success' });
      renderApprovalModule();
    };
  });
};

const renderWebcamModule = () => {
  const container = document.querySelector('#module-container');
  container.innerHTML = `
        <div class="fade-in">
            <h2>Webcam Monitoring</h2>
            <div class="card" style="height: 400px; display: flex; align-items: center; justify-content: center; border: 2px dashed var(--glass-border); background: var(--bg-main);">
                <div style="text-align: center;">
                    <div style="font-size: 4rem; opacity: 0.3; margin-bottom: 1rem;">📷</div>
                    <p style="font-size: 1.2rem; font-weight: 600; color: var(--text-main)">This is where the cam goes</p>
                    <p style="color: var(--text-dim)">Live stream feed from Gate 01</p>
                </div>
            </div>
        </div>
    `;
}

const renderCredentialsModule = () => {
  const container = document.querySelector('#module-container');
  container.innerHTML = `
        <div class="fade-in grid-2">
            <div class="card">
                <h2>QR Code Access</h2>
                <p>Generated for smartphone users</p>
                <div style="margin: 2rem auto; width: 200px; height: 200px; background: white; border: 8px solid white; border-radius: 8px; display: grid; place-items: center; color: black; font-size: 5rem;">
                    ⬛
                </div>
                <p style="text-align: center; font-family: monospace; color: var(--primary); font-weight: bold;">REF: SG-2026-X8B2</p>
                <button class="btn btn-primary" style="width: 100%; margin-top: 2rem;">Download QR</button>
            </div>
            <div class="card">
                <h2>OTP Verification</h2>
                <p>For basic mobile phone users</p>
                <div style="margin: 2rem 0; padding: 2.5rem; background: var(--glass); border-radius: var(--radius); text-align: center; border: 1px solid var(--glass-border);">
                    <span style="font-size: 3rem; font-weight: 800; letter-spacing: 12px; color: var(--primary);">8 4 9 2</span>
                </div>
                <div style="margin-bottom: 1.5rem">
                    <label style="display: block; margin-bottom: 0.5rem; font-size: 0.825rem; font-weight: 600;">Mobile Number</label>
                    <input type="text" value="+1 234 567 890" style="width: 100%; padding: 0.85rem; border-radius: 8px; border: 1px solid var(--glass-border); background: var(--bg-main); color: var(--text-main); font-weight: 500;">
                </div>
                <button class="btn" style="width: 100%; background: var(--glass); border: 1px solid var(--glass-border); color: var(--text-main)">Resend via SMS</button>
            </div>
        </div>
    `;
}

// --- App Shell ---

document.querySelector('#app').innerHTML = `
  <aside class="sidebar">
    <div class="logo-area">
      <div style="width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: grid; place-items: center; color: white;">SG</div>
      SecureGate
    </div>
    <nav class="nav-menu">
      <div class="nav-item active" data-id="approval"><span>✅</span> Approval</div>
      <div class="nav-item" data-id="webcam"><span>📹</span> Webcam</div>
      <div class="nav-item" data-id="credentials"><span>📱</span> QR & OTP</div>
    </nav>
  </aside>
  <main class="content">
    <header class="top-bar">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <button class="hamburger">☰</button>
        <div>
          <h1 id="page-title">Approval Dashboard</h1>
          <p>Security Status: <span style="color: var(--accent-green)">● Active</span></p>
        </div>
      </div>
      <div class="top-bar-actions" style="position: relative;">
        <button class="theme-toggle" id="theme-btn">🌙</button>
        <div id="notif-trigger-container">
            <div class="card" id="notif-trigger" style="padding: 0.5rem 1rem; display: flex; align-items: center; gap: 1rem; cursor: pointer;">
              <span style="position: relative;">🔔 <span class="badge badge-pending" style="position: absolute; top: -10px; right: -10px; padding: 2px 6px;">${notifications.length}</span></span>
              <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary); display: grid; place-items: center; font-weight: bold; color: white;">R</div>
            </div>
            <div id="notif-popup"></div>
        </div>
      </div>
    </header>
    <div id="module-container"></div>
  </main>
`;

const renderModule = (id) => {
  const titles = { approval: 'Approval Dashboard', webcam: 'Webcam Monitoring', credentials: 'Access Credentials' };
  document.querySelector('#page-title').textContent = titles[id];

  if (id === 'approval') renderApprovalModule();
  else if (id === 'webcam') renderWebcamModule();
  else if (id === 'credentials') renderCredentialsModule();

  if (window.innerWidth <= 768) {
    document.querySelector('.sidebar').classList.remove('open');
  }
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.onclick = () => {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    renderModule(item.dataset.id);
  };
});

const themeBtn = document.querySelector('#theme-btn');
let currentTheme = 'light';
themeBtn.onclick = () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeBtn.textContent = currentTheme === 'light' ? '🌙' : '☀️';
};

const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
hamburger.onclick = (e) => {
  e.stopPropagation();
  sidebar.classList.toggle('open');
};

const notifTrigger = document.querySelector('#notif-trigger');
notifTrigger.onclick = (e) => {
  e.stopPropagation();
  const popup = document.querySelector('#notif-popup');
  if (popup.innerHTML) popup.innerHTML = '';
  else renderNotificationInfo();
};

document.addEventListener('click', (e) => {
  if (sidebar.classList.contains('open') && !sidebar.contains(e.target)) {
    sidebar.classList.remove('open');
  }
  const popup = document.querySelector('#notif-popup');
  if (popup && popup.innerHTML && !document.querySelector('#notif-trigger-container').contains(e.target)) {
    popup.innerHTML = '';
  }
});

renderModule('approval');
updateNotifBadge();
