<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>inFlow Dashboard</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #fafafa;
    color: #18181b;
  }
  .page { padding: 24px 16px; background: #fafafa; }
  .wrap { max-width: 1400px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }

  /* Welcome banner */
  .banner {
    background: #eff6ff;
    border: 1px solid #dbeafe;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .banner-avatar {
    width: 64px; height: 64px; border-radius: 9999px;
    background: #dbeafe; display:flex; align-items:center; justify-content:center;
    overflow: hidden; flex-shrink: 0;
  }
  .banner h2 { font-size: 20px; font-weight: 700; color: #18181b; }
  .banner p { font-size: 14px; color: #52525b; margin-top: 2px; }

  /* Card base */
  .card {
    background: #fff;
    border: 1px solid #e4e4e7;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
  }
  .card h3 { font-size: 16px; font-weight: 700; color: #18181b; }
  .label { font-size: 12px; font-weight: 600; color: #a1a1aa; margin-top: 12px; margin-bottom: 8px; }

  /* Top grid */
  .top-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  .row-between { display: flex; align-items: center; justify-content: space-between; }
  .row { display: flex; align-items: center; gap: 8px; }
  .dot { width: 6px; height: 6px; border-radius: 9999px; flex-shrink: 0; }

  .sync-list { display: flex; flex-direction: column; gap: 10px; }
  .sync-row .row span.lbl { font-size: 14px; color: #3f3f46; }
  .sync-row .status { font-size: 14px; color: #71717a; }

  .divider {
    border-top: 1px solid #f4f4f5;
    margin-top: 16px;
    padding-top: 12px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .divider .lbl { font-size: 14px; color: #71717a; }
  .divider .val { font-size: 16px; font-weight: 700; color: #18181b; }

  .stat-list { display: flex; flex-direction: column; gap: 10px; }
  .stat-row { display: flex; align-items: center; gap: 8px; }
  .stat-num { font-size: 24px; font-weight: 700; color: #18181b; }
  .stat-label { font-size: 14px; color: #52525b; }
  .issue-row { display: flex; align-items: flex-start; gap: 8px; }
  .issue-row .dot { margin-top: 8px; }
  .issue-num { font-size: 24px; font-weight: 700; color: #ea580c; line-height: 1; }
  .issue-text { font-size: 14px; color: #ea580c; line-height: 1.375; }

  .link-btn {
    font-size: 14px; font-weight: 600; color: #2563eb;
    background: none; border: none; cursor: pointer; text-align: left;
    margin-top: 12px; display: inline-block;
  }
  .link-btn:hover { text-decoration: underline; }

  .workflows-card { display: flex; flex-direction: column; }
  .automations { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .automations .row span.lbl { font-size: 14px; color: #3f3f46; }

  .btn-dark {
    background: #18181b; color: #fff; font-size: 14px; font-weight: 600;
    border: none; border-radius: 8px; padding: 10px 0; cursor: pointer;
    margin-top: auto;
  }
  .btn-dark:hover { background: #27272a; }

  /* Bottom grid */
  .bottom-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }

  .inbox-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
  .convo {
    border: 1px solid #f4f4f5;
    border-radius: 12px;
    padding: 14px;
    display: flex; align-items: flex-start; gap: 12px;
  }
  .avatar-wrap { position: relative; flex-shrink: 0; }
  .avatar {
    width: 36px; height: 36px; border-radius: 9999px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #3f3f46;
  }
  .channel-badge {
    position: absolute; bottom: -4px; right: -4px;
    width: 16px; height: 16px; border-radius: 9999px;
    background: #fff; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 1px #f4f4f5;
  }
  .convo-body { flex: 1; min-width: 0; }
  .convo-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; }
  .convo-name { font-size: 14px; font-weight: 700; color: #18181b; }
  .status-row { display: flex; align-items: center; gap: 12px; font-size: 12px; }
  .status-pill { display: flex; align-items: center; gap: 4px; font-weight: 500; }
  .status-new { color: #059669; }
  .status-pending { color: #d97706; }
  .status-resolved { color: #a1a1aa; }
  .convo-preview { font-size: 14px; color: #71717a; margin-top: 2px; }
  .pill-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .pill {
    font-size: 12px; font-weight: 600; background: #f4f4f5; color: #52525b;
    border: none; border-radius: 9999px; padding: 6px 12px; cursor: pointer;
  }
  .pill:hover { background: #e4e4e7; }

  .side-stack { display: flex; flex-direction: column; gap: 16px; }
  .schedule-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
  .schedule-row { display: flex; align-items: center; gap: 12px; }
  .schedule-hour { font-size: 12px; color: #a1a1aa; width: 48px; flex-shrink: 0; }
  .schedule-bar { height: 8px; flex: 1; border-radius: 9999px; background: #fafafa; }
  .schedule-bar.active { background: #dbeafe; }

  .actions-list { display: flex; flex-direction: column; gap: 8px; }
  .action-btn {
    width: 100%; text-align: left; font-size: 14px; font-weight: 600;
    border-radius: 8px; padding: 10px 12px; cursor: pointer; border: none;
  }
  .action-blue { background: #2563eb; color: #fff; }
  .action-blue:hover { background: #1d4ed8; }
  .action-orange { background: #f97316; color: #fff; }
  .action-orange:hover { background: #ea580c; }
  .action-rose { background: #fff1f2; color: #e11d48; border: 1px solid #ffe4e6; }
  .action-rose:hover { background: #ffe4e6; }

  .calendar-actions { display: flex; gap: 8px; }
  .btn-resync {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    background: #18181b; color: #fff; font-size: 14px; font-weight: 600;
    border: none; border-radius: 8px; padding: 10px 12px; cursor: pointer;
    white-space: nowrap;
  }
  .btn-resync:hover { background: #27272a; }
  .btn-manage {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    background: #f4f4f5; color: #3f3f46; font-size: 14px; font-weight: 600;
    border: none; border-radius: 8px; padding: 10px 12px; cursor: pointer;
    flex: 1;
  }
  .btn-manage:hover { background: #e4e4e7; }

  .mail-icon-box {
    border-radius: 6px; background: #3b82f6; display: flex;
    align-items: center; justify-content: center;
  }

  @media (max-width: 768px) {
    .top-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 1024px) {
    .bottom-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
<div class="page">
  <div class="wrap">

    <!-- WELCOME BANNER -->
    <div class="banner">
      <div class="banner-avatar">
        <svg viewBox="0 0 64 64" width="68" height="68">
          <circle cx="32" cy="32" r="32" fill="#DBEAFE" />
          <path d="M6 64c0-14 11-23 26-23s26 9 26 23H6z" fill="#C2410C" />
          <path d="M21 64c0-10 5-16 11-16s11 6 11 16H21z" fill="#FAFAF9" />
          <rect x="27" y="33" width="10" height="10" rx="3" fill="#6B4226" />
          <circle cx="32" cy="24" r="11" fill="#8B5A3C" />
          <path d="M21 24a11 11 0 0122 0v2H21v-2z" fill="#1C1410" />
          <path d="M41 15c2 4 1 8-1 11c-3-3-7-4-11-3c3-4 7-7 12-8z" fill="#1C1410" />
          <circle cx="40" cy="16" r="5" fill="#1C1410" />
          <path d="M29 52c5-4 10-6 15-7l2 5c-6 1.5-10 4-14 7z" fill="#7C4A2D" />
          <g transform="rotate(-8 44.5 46)">
            <rect x="37" y="40" width="15" height="12" rx="2" fill="#0F172A" />
            <rect x="38.5" y="41.5" width="12" height="9" rx="1" fill="#60A5FA" />
          </g>
        </svg>
      </div>
      <div>
        <h2>Welcome Back, &lsquo;Lindiwe&rsquo;.</h2>
        <p>Your business is looking good today.</p>
      </div>
    </div>

    <!-- TOP 3 SUMMARY CARDS -->
    <div class="top-grid">

      <!-- Communications Summary -->
      <div class="card">
        <h3>Communications Summary</h3>
        <p class="label">Channel Sync Status</p>
        <div class="sync-list">
          <div class="row-between sync-row">
            <div class="row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.406A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#25D366"/><path d="M17.006 14.713c-.258-.129-1.528-.754-1.764-.84-.236-.086-.408-.129-.58.129-.172.257-.665.84-.815 1.012-.15.172-.3.193-.557.064-.258-.129-1.088-.401-2.073-1.279-.766-.683-1.283-1.527-1.433-1.784-.15-.258-.016-.397.113-.525.116-.115.258-.3.387-.45.129-.15.172-.258.258-.43.086-.172.043-.322-.021-.45-.064-.129-.58-1.397-.794-1.912-.21-.502-.422-.433-.58-.441l-.494-.008c-.172 0-.45.064-.686.322-.236.257-.9.879-.9 2.144s.922 2.487 1.05 2.659c.13.172 1.812 2.766 4.388 3.879.614.265 1.092.423 1.465.541.616.196 1.176.168 1.619.102.494-.073 1.528-.625 1.743-1.228.215-.602.215-1.118.15-1.226-.064-.107-.236-.172-.494-.3z" fill="white"/></svg>
              <span class="lbl">WhatsApp Business</span>
            </div>
            <div class="row"><span class="dot" style="background:#f59e0b"></span><span class="status">Syncing</span></div>
          </div>
          <div class="row-between sync-row">
            <div class="row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><defs><radialGradient id="ig1" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig1)"/><circle cx="12" cy="12" r="4" stroke="white" stroke-width="1.8" fill="none"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/><rect x="3" y="3" width="18" height="18" rx="6" stroke="white" stroke-width="1.8" fill="none"/></svg>
              <span class="lbl">Instagram DMs</span>
            </div>
            <div class="row"><span class="dot" style="background:#10b981"></span><span class="status">Connected</span></div>
          </div>
          <div class="row-between sync-row">
            <div class="row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#000000"/><path d="M15.5 4.5c.4 1.6 1.5 2.7 3 3v2.3c-1.2 0-2.3-.4-3.2-1.1v5.3a4.7 4.7 0 11-4-4.6v2.4a2.3 2.3 0 102 2.3V4.5h2.2z" fill="white"/></svg>
              <span class="lbl">TikTok</span>
            </div>
            <div class="row"><span class="dot" style="background:#10b981"></span><span class="status">Connected</span></div>
          </div>
          <div class="row-between sync-row">
            <div class="row">
              <div class="mail-icon-box" style="width:18px;height:18px;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <span class="lbl">Email</span>
            </div>
            <div class="row"><span class="dot" style="background:#10b981"></span><span class="status">Connected</span></div>
          </div>
        </div>
        <div class="divider">
          <span class="lbl">Total incoming messages:</span>
          <span class="val">84</span>
        </div>
      </div>

      <!-- Bookings & Schedules -->
      <div class="card">
        <h3>Bookings &amp; Schedules</h3>
        <p class="label">Bookings Today</p>
        <div class="stat-list">
          <div class="stat-row">
            <span class="dot" style="background:#10b981"></span>
            <span class="stat-num">12</span>
            <span class="stat-label">Confirmed</span>
          </div>
          <div class="stat-row">
            <span class="dot" style="background:#3b82f6"></span>
            <span class="stat-num">2</span>
            <span class="stat-label">New</span>
          </div>
          <div class="issue-row">
            <span class="dot" style="background:#f97316"></span>
            <span class="issue-num">1</span>
            <span class="issue-text">Issue (Conflict detected with Google Calendar)</span>
          </div>
        </div>
        <button class="link-btn">View Full Calendar</button>
        <div class="divider">
          <span class="lbl">Total bookings this week:</span>
          <span class="val">58</span>
        </div>
      </div>

      <!-- Active Workflows -->
      <div class="card workflows-card">
        <h3>Active Workflows</h3>
        <p class="label">Operational Automations</p>
        <div class="stat-row" style="margin-bottom:8px;">
          <span class="dot" style="background:#10b981"></span>
          <span class="stat-num">3</span>
          <span class="stat-label">Live</span>
        </div>
        <div class="automations">
          <div class="row"><span class="dot" style="background:#10b981"></span><span class="lbl">WhatsApp Auto-Reply</span></div>
          <div class="row"><span class="dot" style="background:#10b981"></span><span class="lbl">Booking Reminder</span></div>
        </div>
        <button class="btn-dark">Create Workflow</button>
        <button class="link-btn" style="text-align:left;">View Workflow Performance</button>
      </div>
    </div>

    <!-- BOTTOM ROW -->
    <div class="bottom-grid">

      <!-- OMNICHANNEL CONVERSATIONS -->
      <div class="card">
        <h3>Omnichannel Conversations (Unified Inbox)</h3>
        <div class="inbox-list">

          <div class="convo">
            <div class="avatar-wrap">
              <div class="avatar" style="background:#fde68a;">BN</div>
              <div class="channel-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.406A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#25D366"/><path d="M17.006 14.713c-.258-.129-1.528-.754-1.764-.84-.236-.086-.408-.129-.58.129-.172.257-.665.84-.815 1.012-.15.172-.3.193-.557.064-.258-.129-1.088-.401-2.073-1.279-.766-.683-1.283-1.527-1.433-1.784-.15-.258-.016-.397.113-.525.116-.115.258-.3.387-.45.129-.15.172-.258.258-.43.086-.172.043-.322-.021-.45-.064-.129-.58-1.397-.794-1.912-.21-.502-.422-.433-.58-.441l-.494-.008c-.172 0-.45.064-.686.322-.236.257-.9.879-.9 2.144s.922 2.487 1.05 2.659c.13.172 1.812 2.766 4.388 3.879.614.265 1.092.423 1.465.541.616.196 1.176.168 1.619.102.494-.073 1.528-.625 1.743-1.228.215-.602.215-1.118.15-1.226-.064-.107-.236-.172-.494-.3z" fill="white"/></svg>
              </div>
            </div>
            <div class="convo-body">
              <div class="convo-top">
                <p class="convo-name">Braina Name</p>
                <div class="status-row">
                  <span class="status-pill status-new"><span class="dot" style="background:#10b981"></span>New</span>
                  <span class="status-pill status-pending"><span class="dot" style="background:#f59e0b"></span>Pending</span>
                  <span class="status-pill status-resolved"><span class="dot" style="background:#d4d4d8"></span>Resolved</span>
                </div>
              </div>
              <p class="convo-preview">Hello, first you renewed your messages?</p>
              <div class="pill-row">
                <button class="pill">Smart-Tagging</button>
                <button class="pill">Suggest Booking Slot</button>
                <button class="pill">Create Order</button>
                <button class="pill">Flag &amp; Tag</button>
              </div>
            </div>
          </div>

          <div class="convo">
            <div class="avatar-wrap">
              <div class="avatar" style="background:#f4f4f5;">IS</div>
              <div class="channel-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><defs><radialGradient id="ig2" cx="30%" cy="107%" r="150%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><rect width="24" height="24" rx="6" fill="url(#ig2)"/><circle cx="12" cy="12" r="4" stroke="white" stroke-width="1.8" fill="none"/><circle cx="17.5" cy="6.5" r="1.2" fill="white"/><rect x="3" y="3" width="18" height="18" rx="6" stroke="white" stroke-width="1.8" fill="none"/></svg>
              </div>
            </div>
            <div class="convo-body">
              <div class="convo-top">
                <p class="convo-name">Instagram Smith</p>
                <div class="status-row">
                  <span class="status-pill status-new"><span class="dot" style="background:#10b981"></span>New</span>
                  <span class="status-pill status-pending"><span class="dot" style="background:#f59e0b"></span>Pending</span>
                  <span class="status-pill status-resolved"><span class="dot" style="background:#d4d4d8"></span>Resolved</span>
                </div>
              </div>
              <p class="convo-preview">Message is helov on your needs.</p>
              <div class="pill-row">
                <button class="pill">Smart-Tagging</button>
                <button class="pill">Suggest Booking Slot</button>
                <button class="pill">Create Order</button>
                <button class="pill">Flag &amp; Tag</button>
              </div>
            </div>
          </div>

          <div class="convo">
            <div class="avatar-wrap">
              <div class="avatar" style="background:#f4f4f5;">TS</div>
              <div class="channel-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="6" fill="#000000"/><path d="M15.5 4.5c.4 1.6 1.5 2.7 3 3v2.3c-1.2 0-2.3-.4-3.2-1.1v5.3a4.7 4.7 0 11-4-4.6v2.4a2.3 2.3 0 102 2.3V4.5h2.2z" fill="white"/></svg>
              </div>
            </div>
            <div class="convo-body">
              <div class="convo-top">
                <p class="convo-name">Tiktok Soner</p>
                <div class="status-row">
                  <span class="status-pill status-new"><span class="dot" style="background:#10b981"></span>New</span>
                  <span class="status-pill status-pending"><span class="dot" style="background:#f59e0b"></span>Pending</span>
                  <span class="status-pill status-resolved"><span class="dot" style="background:#d4d4d8"></span>Resolved</span>
                </div>
              </div>
              <p class="convo-preview">What you can rarely to your message.</p>
              <div class="pill-row">
                <button class="pill">Smart-Tagging</button>
                <button class="pill">Suggest Booking Slot</button>
                <button class="pill">Create Order</button>
                <button class="pill">Flag &amp; Tag</button>
              </div>
            </div>
          </div>

          <div class="convo">
            <div class="avatar-wrap">
              <div class="avatar" style="background:#f4f4f5;">EA</div>
              <div class="channel-badge">
                <div class="mail-icon-box" style="width:18px;height:18px;">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
              </div>
            </div>
            <div class="convo-body">
              <div class="convo-top">
                <p class="convo-name">Email Amiltin</p>
                <div class="status-row">
                  <span class="status-pill status-new"><span class="dot" style="background:#10b981"></span>New</span>
                  <span class="status-pill status-pending"><span class="dot" style="background:#f59e0b"></span>Pending</span>
                  <span class="status-pill status-resolved"><span class="dot" style="background:#d4d4d8"></span>Resolved</span>
                </div>
              </div>
              <p class="convo-preview">Chek a'anting to ileave about!</p>
              <div class="pill-row">
                <button class="pill">Smart-Tagging</button>
                <button class="pill">Suggest Booking Slot</button>
                <button class="pill">Create Order</button>
                <button class="pill">Flag &amp; Tag</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- SCHEDULE & ACTIONS -->
      <div class="side-stack">
        <div class="card">
          <h3 style="margin-bottom:12px;">Today's Schedule</h3>
          <div class="schedule-list">
            <div class="schedule-row"><span class="schedule-hour">1 am</span><div class="schedule-bar active"></div></div>
            <div class="schedule-row"><span class="schedule-hour">10 am</span><div class="schedule-bar"></div></div>
            <div class="schedule-row"><span class="schedule-hour">11 am</span><div class="schedule-bar"></div></div>
            <div class="schedule-row"><span class="schedule-hour">12 am</span><div class="schedule-bar"></div></div>
            <div class="schedule-row"><span class="schedule-hour">1 pm</span><div class="schedule-bar"></div></div>
            <div class="schedule-row"><span class="schedule-hour">2 pm</span><div class="schedule-bar"></div></div>
            <div class="schedule-row"><span class="schedule-hour">3 am</span><div class="schedule-bar"></div></div>
          </div>
          <p class="label" style="margin-top:0;">Customer Actions Needed</p>
          <div class="actions-list">
            <button class="action-btn action-blue">Confirm 2 New Bookings</button>
            <button class="action-btn action-orange">Confirmd to a 'Price Inquiry'</button>
            <button class="action-btn action-rose">Respond to a 'Price Inquiry'</button>
            <button class="action-btn action-rose">Respond to a 'Price Inquiry'</button>
          </div>
        </div>

        <div class="card">
          <h3 style="margin-bottom:12px;">Google &amp; Apple Calendar Sync Status</h3>
          <div class="calendar-actions">
            <button class="btn-resync">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Resync
            </button>
            <button class="btn-manage">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Manage Synced Calendars
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
</body>
</html>
