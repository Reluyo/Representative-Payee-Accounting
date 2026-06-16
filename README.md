<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; }
</style>
</helmet>

<div style="min-height:100vh;background:#E7EBF0;padding:56px 56px 100px;font-family:'Public Sans',system-ui,sans-serif;color:#16263F">
  <div style="max-width:1820px;margin:0 auto">

    <div style="font-size:13px;letter-spacing:2.5px;text-transform:uppercase;color:#6B7A90;font-weight:700">Steward · Guardianship Expense Tracker</div>
    <h1 style="font-size:42px;font-weight:800;margin:10px 0 8px;letter-spacing:-0.5px">Two directions to compare</h1>
    <p style="font-size:18px;color:#5B6B82;max-width:780px;margin:0;line-height:1.55;text-wrap:pretty">Both built for a phone and for older eyes — very large type, high contrast, big tap targets, and the fewest possible steps to log an expense or file with the court. Same account, same week, two visual approaches.</p>

    <!-- ════════════════ DIRECTION A ════════════════ -->
    <div style="margin-top:52px">
      <div style="display:flex;align-items:flex-start;gap:18px">
        <div style="width:44px;height:44px;border-radius:13px;background:#2F62D9;color:#fff;font-weight:800;font-size:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0">A</div>
        <div>
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
            <div style="font-size:25px;font-weight:800">Calm &amp; Rounded</div>
            <div style="display:flex;gap:7px">
              <span style="width:18px;height:18px;border-radius:5px;background:#2F62D9"></span>
              <span style="width:18px;height:18px;border-radius:5px;background:#E7EFFD"></span>
              <span style="width:18px;height:18px;border-radius:5px;background:#1F8A5B"></span>
              <span style="width:18px;height:18px;border-radius:5px;background:#16263F"></span>
            </div>
          </div>
          <div style="font-size:16px;color:#5B6B82;margin-top:4px;max-width:680px;line-height:1.55;text-wrap:pretty">Soft blue with generous white space and large rounded cards. One clear number per screen, two big buttons, and a simple labelled tab bar — the gentlest path through each task.</div>
        </div>
      </div>

      <div style="display:flex;gap:40px;margin-top:30px;flex-wrap:nowrap;overflow-x:auto;padding-bottom:8px">

        <!-- ───── A1 · HOME ───── -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;flex-shrink:0">
          <div style="font-size:15px;font-weight:700;color:#16263F">01 &nbsp;·&nbsp; Home</div>
          <x-import component-from-global-scope="IOSDevice" from="./ios-frame.jsx" hint-size="402px,874px">
            <div style="height:100%;background:#F4F7FB;display:flex;flex-direction:column;overflow:hidden">
              <div style="padding:64px 22px 10px;display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0">
                <div>
                  <div style="font-size:15px;color:#5B6B82;font-weight:600">Tuesday, June 16</div>
                  <div style="font-size:23px;font-weight:800;color:#16263F;margin-top:2px">Good morning, Margaret</div>
                </div>
                <div style="width:50px;height:50px;border-radius:50%;background:#E7EFFD;color:#2F62D9;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:20px;flex-shrink:0">M</div>
              </div>
              <div style="flex:1;overflow:auto;padding:6px 22px 0;display:flex;flex-direction:column;gap:16px">
                <div style="background:#fff;border:1px solid #E3EAF4;border-radius:24px;padding:24px;box-shadow:0 6px 20px rgba(22,38,63,0.06)">
                  <div style="font-size:15px;color:#5B6B82;font-weight:600">Robert's Care Account</div>
                  <div style="font-size:46px;font-weight:800;color:#16263F;letter-spacing:-1px;margin:6px 0 4px;font-variant-numeric:tabular-nums">$12,480.55</div>
                  <div style="display:flex;align-items:center;gap:8px">
                    <span style="width:9px;height:9px;border-radius:50%;background:#1F8A5B;display:inline-block"></span>
                    <span style="font-size:15px;color:#5B6B82;font-weight:600">Available · updated today</span>
                  </div>
                  <div style="height:1px;background:#EDF1F8;margin:18px 0 14px"></div>
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-size:16px;color:#5B6B82;font-weight:600">Spent this month</span>
                    <span style="font-size:18px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$1,847.20</span>
                  </div>
                </div>
                <div style="display:flex;gap:12px">
                  <button style="flex:1;height:68px;border:none;border-radius:18px;background:#2F62D9;color:#fff;font-size:18px;font-weight:800;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;box-shadow:0 6px 16px rgba(47,98,217,0.28)"><span style="font-size:26px;line-height:1;font-weight:600">+</span> Add expense</button>
                  <button style="flex:1;height:68px;border:2px solid #CBD9F0;border-radius:18px;background:#fff;color:#2F62D9;font-size:18px;font-weight:800;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"></rect><circle cx="12" cy="13.5" r="3.3"></circle><path d="M8 7l1.5-2.5h5L16 7"></path></svg> Scan receipt</button>
                </div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:4px">
                  <div style="font-size:19px;font-weight:800;color:#16263F">Recent activity</div>
                  <div style="font-size:15px;font-weight:700;color:#2F62D9">See all</div>
                </div>
                <div style="background:#fff;border:1px solid #E3EAF4;border-radius:22px;overflow:hidden">
                  <div style="display:flex;align-items:center;gap:14px;padding:15px 18px;border-bottom:1px solid #EDF1F8">
                    <div style="width:44px;height:44px;border-radius:12px;background:#E7EFFD;color:#2F62D9;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;flex-shrink:0">M</div>
                    <div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700;color:#16263F">Riverside Pharmacy</div><div style="font-size:14px;color:#5B6B82;margin-top:1px">Medical &amp; Care · Today</div></div>
                    <div style="text-align:right"><div style="font-size:17px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$84.30</div><div style="font-size:13px;font-weight:700;color:#1F8A5B;margin-top:2px">✓ Receipt</div></div>
                  </div>
                  <div style="display:flex;align-items:center;gap:14px;padding:15px 18px;border-bottom:1px solid #EDF1F8">
                    <div style="width:44px;height:44px;border-radius:12px;background:#E2F2F1;color:#2E8B8B;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;flex-shrink:0">C</div>
                    <div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700;color:#16263F">Sunrise Home Care</div><div style="font-size:14px;color:#5B6B82;margin-top:1px">Care Services · Jun 14</div></div>
                    <div style="text-align:right"><div style="font-size:17px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$640.00</div><div style="font-size:13px;font-weight:700;color:#1F8A5B;margin-top:2px">✓ Receipt</div></div>
                  </div>
                  <div style="display:flex;align-items:center;gap:14px;padding:15px 18px;border-bottom:1px solid #EDF1F8">
                    <div style="width:44px;height:44px;border-radius:12px;background:#E6F4E9;color:#2F8B45;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;flex-shrink:0">G</div>
                    <div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700;color:#16263F">Whole Foods Market</div><div style="font-size:14px;color:#5B6B82;margin-top:1px">Groceries · Jun 13</div></div>
                    <div style="text-align:right"><div style="font-size:17px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$112.65</div><div style="font-size:13px;font-weight:700;color:#1F8A5B;margin-top:2px">✓ Receipt</div></div>
                  </div>
                  <div style="display:flex;align-items:center;gap:14px;padding:15px 18px">
                    <div style="width:44px;height:44px;border-radius:12px;background:#F7EEDD;color:#B57E1F;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;flex-shrink:0">U</div>
                    <div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700;color:#16263F">City Power &amp; Light</div><div style="font-size:14px;color:#5B6B82;margin-top:1px">Utilities · Jun 11</div></div>
                    <div style="text-align:right"><div style="font-size:17px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$98.40</div><div style="font-size:13px;font-weight:700;color:#B57E1F;margin-top:2px">+ Add receipt</div></div>
                  </div>
                </div>
                <div style="height:8px"></div>
              </div>
              <div style="border-top:1px solid #E3EAF4;background:#fff;padding:10px 8px 30px;display:flex;justify-content:space-around;align-items:flex-end;flex-shrink:0">
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#2F62D9"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"></path><path d="M5 10v10h14V10"></path></svg><span style="font-size:12px;font-weight:700">Home</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#8A98AC"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h11"></path></svg><span style="font-size:12px;font-weight:700">History</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#8A98AC"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"></rect><circle cx="12" cy="13.5" r="3.3"></circle><path d="M8 7l1.5-2.5h5L16 7"></path></svg><span style="font-size:12px;font-weight:700">Receipts</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#8A98AC"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5"></rect><path d="M9 8h6M9 12h6M9 16h4"></path></svg><span style="font-size:12px;font-weight:700">Reports</span></div>
              </div>
            </div>
          </x-import>
        </div>

        <!-- ───── A2 · HISTORY ───── -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;flex-shrink:0">
          <div style="font-size:15px;font-weight:700;color:#16263F">02 &nbsp;·&nbsp; History</div>
          <x-import component-from-global-scope="IOSDevice" from="./ios-frame.jsx" hint-size="402px,874px">
            <div style="height:100%;background:#F4F7FB;display:flex;flex-direction:column;overflow:hidden">
              <div style="padding:64px 22px 12px;flex-shrink:0">
                <div style="font-size:30px;font-weight:800;color:#16263F">History</div>
                <div style="font-size:15px;color:#5B6B82;font-weight:600;margin-top:2px">Robert's Care Account</div>
              </div>
              <div style="display:flex;gap:10px;padding:0 22px 14px;flex-shrink:0">
                <span style="padding:11px 18px;border-radius:999px;background:#2F62D9;color:#fff;font-size:15px;font-weight:700">All</span>
                <span style="padding:11px 18px;border-radius:999px;background:#fff;border:1px solid #D9E2F1;color:#5B6B82;font-size:15px;font-weight:700">This month</span>
                <span style="padding:11px 18px;border-radius:999px;background:#fff;border:1px solid #D9E2F1;color:#B57E1F;font-size:15px;font-weight:700">Needs receipt</span>
              </div>
              <div style="flex:1;overflow:auto;padding:0 22px 0">
                <div style="background:#EEF3FB;border-radius:16px;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
                  <span style="font-size:16px;font-weight:700;color:#16263F">June 2026 · 14 expenses</span>
                  <span style="font-size:18px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$1,847.20</span>
                </div>
                <div style="font-size:14px;font-weight:700;color:#5B6B82;text-transform:uppercase;letter-spacing:0.5px;margin:0 2px 8px">Today</div>
                <div style="background:#fff;border:1px solid #E3EAF4;border-radius:20px;overflow:hidden;margin-bottom:20px">
                  <div style="display:flex;align-items:center;gap:14px;padding:17px 18px">
                    <div style="width:46px;height:46px;border-radius:13px;background:#E7EFFD;color:#2F62D9;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:19px;flex-shrink:0">M</div>
                    <div style="flex:1;min-width:0"><div style="font-size:18px;font-weight:700;color:#16263F">Riverside Pharmacy</div><div style="font-size:14px;color:#5B6B82;margin-top:1px">Medical &amp; Care · ✓ Receipt</div></div>
                    <div style="font-size:18px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$84.30</div>
                  </div>
                </div>
                <div style="font-size:14px;font-weight:700;color:#5B6B82;text-transform:uppercase;letter-spacing:0.5px;margin:0 2px 8px">Earlier this week</div>
                <div style="background:#fff;border:1px solid #E3EAF4;border-radius:20px;overflow:hidden;margin-bottom:16px">
                  <div style="display:flex;align-items:center;gap:14px;padding:17px 18px;border-bottom:1px solid #EDF1F8">
                    <div style="width:46px;height:46px;border-radius:13px;background:#E2F2F1;color:#2E8B8B;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:19px;flex-shrink:0">C</div>
                    <div style="flex:1;min-width:0"><div style="font-size:18px;font-weight:700;color:#16263F">Sunrise Home Care</div><div style="font-size:14px;color:#5B6B82;margin-top:1px">Care Services · Jun 14 · ✓ Receipt</div></div>
                    <div style="font-size:18px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$640.00</div>
                  </div>
                  <div style="display:flex;align-items:center;gap:14px;padding:17px 18px;border-bottom:1px solid #EDF1F8">
                    <div style="width:46px;height:46px;border-radius:13px;background:#E6F4E9;color:#2F8B45;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:19px;flex-shrink:0">G</div>
                    <div style="flex:1;min-width:0"><div style="font-size:18px;font-weight:700;color:#16263F">Whole Foods Market</div><div style="font-size:14px;color:#5B6B82;margin-top:1px">Groceries · Jun 13 · ✓ Receipt</div></div>
                    <div style="font-size:18px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$112.65</div>
                  </div>
                  <div style="display:flex;align-items:center;gap:14px;padding:17px 18px;border-bottom:1px solid #EDF1F8;background:#FFFBF2">
                    <div style="width:46px;height:46px;border-radius:13px;background:#F7EEDD;color:#B57E1F;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:19px;flex-shrink:0">U</div>
                    <div style="flex:1;min-width:0"><div style="font-size:18px;font-weight:700;color:#16263F">City Power &amp; Light</div><div style="font-size:14px;color:#B57E1F;font-weight:700;margin-top:1px">Utilities · Jun 11 · Needs receipt</div></div>
                    <div style="font-size:18px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$98.40</div>
                  </div>
                  <div style="display:flex;align-items:center;gap:14px;padding:17px 18px">
                    <div style="width:46px;height:46px;border-radius:13px;background:#E7EFFD;color:#2F62D9;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:19px;flex-shrink:0">M</div>
                    <div style="flex:1;min-width:0"><div style="font-size:18px;font-weight:700;color:#16263F">Dr. Alan Reyes</div><div style="font-size:14px;color:#5B6B82;margin-top:1px">Medical &amp; Care · Jun 9 · ✓ Receipt</div></div>
                    <div style="font-size:18px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$150.00</div>
                  </div>
                </div>
              </div>
              <div style="border-top:1px solid #E3EAF4;background:#fff;padding:10px 8px 30px;display:flex;justify-content:space-around;align-items:flex-end;flex-shrink:0">
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#8A98AC"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"></path><path d="M5 10v10h14V10"></path></svg><span style="font-size:12px;font-weight:700">Home</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#2F62D9"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h11"></path></svg><span style="font-size:12px;font-weight:700">History</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#8A98AC"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"></rect><circle cx="12" cy="13.5" r="3.3"></circle><path d="M8 7l1.5-2.5h5L16 7"></path></svg><span style="font-size:12px;font-weight:700">Receipts</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#8A98AC"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5"></rect><path d="M9 8h6M9 12h6M9 16h4"></path></svg><span style="font-size:12px;font-weight:700">Reports</span></div>
              </div>
            </div>
          </x-import>
        </div>

        <!-- ───── A3 · RECEIPT ───── -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;flex-shrink:0">
          <div style="font-size:15px;font-weight:700;color:#16263F">03 &nbsp;·&nbsp; Scan receipt</div>
          <x-import component-from-global-scope="IOSDevice" from="./ios-frame.jsx" dark="{{ true }}" hint-size="402px,874px">
            <div style="height:100%;background:#0E1726;display:flex;flex-direction:column;overflow:hidden;color:#fff">
              <div style="padding:62px 22px 10px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
                <span style="font-size:17px;font-weight:700;color:rgba(255,255,255,0.9)">Cancel</span>
                <span style="font-size:18px;font-weight:800">Scan receipt</span>
                <span style="font-size:17px;font-weight:700;color:rgba(255,255,255,0.55)">Flash</span>
              </div>
              <div style="margin:8px 22px 0;background:rgba(255,255,255,0.12);border-radius:14px;padding:14px 16px;text-align:center;font-size:16px;font-weight:600;color:rgba(255,255,255,0.92)">Hold steady — we'll snap it for you</div>
              <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:28px">
                <div style="position:relative;width:236px;height:330px">
                  <div style="position:absolute;inset:0;background:#F4F1EA;border-radius:10px;padding:24px 22px;box-shadow:0 24px 60px rgba(0,0,0,0.55)">
                    <div style="height:16px;width:62%;background:#26323F;border-radius:3px;margin:0 auto 16px"></div>
                    <div style="height:9px;width:90%;background:#D8D2C6;border-radius:3px;margin-bottom:10px"></div>
                    <div style="height:9px;width:75%;background:#D8D2C6;border-radius:3px;margin-bottom:10px"></div>
                    <div style="height:9px;width:85%;background:#D8D2C6;border-radius:3px;margin-bottom:22px"></div>
                    <div style="display:flex;justify-content:space-between"><span style="height:11px;width:38%;background:#C7C0B2;border-radius:3px;display:block"></span><span style="height:11px;width:24%;background:#26323F;border-radius:3px;display:block"></span></div>
                  </div>
                  <div style="position:absolute;top:-7px;left:-7px;width:30px;height:30px;border-top:4px solid #fff;border-left:4px solid #fff;border-top-left-radius:8px"></div>
                  <div style="position:absolute;top:-7px;right:-7px;width:30px;height:30px;border-top:4px solid #fff;border-right:4px solid #fff;border-top-right-radius:8px"></div>
                  <div style="position:absolute;bottom:-7px;left:-7px;width:30px;height:30px;border-bottom:4px solid #fff;border-left:4px solid #fff;border-bottom-left-radius:8px"></div>
                  <div style="position:absolute;bottom:-7px;right:-7px;width:30px;height:30px;border-bottom:4px solid #fff;border-right:4px solid #fff;border-bottom-right-radius:8px"></div>
                </div>
              </div>
              <div style="text-align:center;font-size:15px;color:rgba(255,255,255,0.65);font-weight:600;padding:0 22px 14px">Line the receipt up inside the corners</div>
              <div style="padding:4px 26px 40px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
                <div style="width:58px;height:58px;border-radius:13px;background:rgba(255,255,255,0.14);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:rgba(255,255,255,0.85)">Photos</div>
                <div style="width:84px;height:84px;border-radius:50%;background:#fff;box-shadow:0 0 0 6px rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center"><div style="width:70px;height:70px;border-radius:50%;background:#fff;border:3px solid #0E1726"></div></div>
                <div style="width:58px;height:58px;border-radius:13px;background:rgba(255,255,255,0.14);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:rgba(255,255,255,0.85)">Type it</div>
              </div>
            </div>
          </x-import>
        </div>

        <!-- ───── A4 · REPORT ───── -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;flex-shrink:0">
          <div style="font-size:15px;font-weight:700;color:#16263F">04 &nbsp;·&nbsp; Court report</div>
          <x-import component-from-global-scope="IOSDevice" from="./ios-frame.jsx" hint-size="402px,874px">
            <div style="height:100%;background:#F4F7FB;display:flex;flex-direction:column;overflow:hidden">
              <div style="padding:64px 22px 8px;flex-shrink:0">
                <div style="font-size:30px;font-weight:800;color:#16263F">Court report</div>
                <div style="font-size:15px;color:#5B6B82;font-weight:600;margin-top:2px">Ready to file with the court</div>
              </div>
              <div style="flex:1;overflow:auto;padding:8px 22px 0;display:flex;flex-direction:column;gap:14px">
                <div style="background:#fff;border:1px solid #E3EAF4;border-radius:20px;padding:18px 20px;display:flex;justify-content:space-between;align-items:center">
                  <div><div style="font-size:14px;color:#5B6B82;font-weight:600">Reporting period</div><div style="font-size:19px;font-weight:800;color:#16263F;margin-top:2px">Jan 1 – Jun 30, 2026</div></div>
                  <div style="font-size:15px;font-weight:700;color:#2F62D9">Change</div>
                </div>
                <div style="background:#fff;border:1px solid #E3EAF4;border-radius:20px;padding:20px">
                  <div style="font-size:17px;font-weight:800;color:#16263F;margin-bottom:6px">Account summary</div>
                  <div style="display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid #EDF1F8"><span style="font-size:16px;color:#5B6B82;font-weight:600">Opening balance</span><span style="font-size:16px;font-weight:700;color:#16263F;font-variant-numeric:tabular-nums">$25,440.55</span></div>
                  <div style="display:flex;justify-content:space-between;padding:11px 0;border-bottom:1px solid #EDF1F8"><span style="font-size:16px;color:#5B6B82;font-weight:600">Total spent</span><span style="font-size:16px;font-weight:700;color:#16263F;font-variant-numeric:tabular-nums">$12,960.00</span></div>
                  <div style="display:flex;justify-content:space-between;padding:12px 0 2px"><span style="font-size:17px;color:#16263F;font-weight:800">Closing balance</span><span style="font-size:18px;font-weight:800;color:#1F8A5B;font-variant-numeric:tabular-nums">$12,480.55</span></div>
                </div>
                <div style="background:#fff;border:1px solid #E3EAF4;border-radius:20px;padding:20px">
                  <div style="font-size:17px;font-weight:800;color:#16263F;margin-bottom:6px">Where the money went</div>
                  <div style="padding:13px 0;border-bottom:1px solid #EDF1F8"><div style="display:flex;align-items:center;gap:12px"><div style="width:36px;height:36px;border-radius:10px;background:#E7EFFD;color:#2F62D9;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;flex-shrink:0">M</div><div style="flex:1;font-size:16px;font-weight:700;color:#16263F">Medical &amp; Care</div><div style="font-size:16px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$4,210</div></div><div style="height:8px;border-radius:6px;background:#ECF1F8;margin-top:9px;overflow:hidden"><div style="height:100%;width:32%;background:#2F62D9"></div></div></div>
                  <div style="padding:13px 0;border-bottom:1px solid #EDF1F8"><div style="display:flex;align-items:center;gap:12px"><div style="width:36px;height:36px;border-radius:10px;background:#E2F2F1;color:#2E8B8B;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;flex-shrink:0">C</div><div style="flex:1;font-size:16px;font-weight:700;color:#16263F">Care Services</div><div style="font-size:16px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$3,840</div></div><div style="height:8px;border-radius:6px;background:#ECF1F8;margin-top:9px;overflow:hidden"><div style="height:100%;width:30%;background:#2E8B8B"></div></div></div>
                  <div style="padding:13px 0;border-bottom:1px solid #EDF1F8"><div style="display:flex;align-items:center;gap:12px"><div style="width:36px;height:36px;border-radius:10px;background:#ECEAF8;color:#6A5AC0;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;flex-shrink:0">H</div><div style="flex:1;font-size:16px;font-weight:700;color:#16263F">Housing</div><div style="font-size:16px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$2,600</div></div><div style="height:8px;border-radius:6px;background:#ECF1F8;margin-top:9px;overflow:hidden"><div style="height:100%;width:20%;background:#6A5AC0"></div></div></div>
                  <div style="padding:13px 0"><div style="display:flex;align-items:center;gap:12px"><div style="width:36px;height:36px;border-radius:10px;background:#E6F4E9;color:#2F8B45;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;flex-shrink:0">G</div><div style="flex:1;font-size:16px;font-weight:700;color:#16263F">Groceries</div><div style="font-size:16px;font-weight:800;color:#16263F;font-variant-numeric:tabular-nums">$1,180</div></div><div style="height:8px;border-radius:6px;background:#ECF1F8;margin-top:9px;overflow:hidden"><div style="height:100%;width:9%;background:#2F8B45"></div></div></div>
                </div>
                <button style="height:68px;border:none;border-radius:18px;background:#2F62D9;color:#fff;font-size:18px;font-weight:800;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;box-shadow:0 6px 16px rgba(47,98,217,0.28)">Create PDF report</button>
                <button style="height:60px;border:2px solid #CBD9F0;border-radius:18px;background:#fff;color:#2F62D9;font-size:17px;font-weight:800;font-family:inherit;cursor:pointer">Email to my attorney</button>
                <div style="text-align:center;font-size:14px;color:#8A98AC;font-weight:600;padding:2px 0 4px">Every expense includes its receipt and date.</div>
                <div style="height:10px"></div>
              </div>
              <div style="border-top:1px solid #E3EAF4;background:#fff;padding:10px 8px 30px;display:flex;justify-content:space-around;align-items:flex-end;flex-shrink:0">
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#8A98AC"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"></path><path d="M5 10v10h14V10"></path></svg><span style="font-size:12px;font-weight:700">Home</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#8A98AC"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h11"></path></svg><span style="font-size:12px;font-weight:700">History</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#8A98AC"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"></rect><circle cx="12" cy="13.5" r="3.3"></circle><path d="M8 7l1.5-2.5h5L16 7"></path></svg><span style="font-size:12px;font-weight:700">Receipts</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;color:#2F62D9"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5"></rect><path d="M9 8h6M9 12h6M9 16h4"></path></svg><span style="font-size:12px;font-weight:700">Reports</span></div>
              </div>
            </div>
          </x-import>
        </div>

      </div>
    </div>

    <!-- ════════════════ DIRECTION B ════════════════ -->
    <div style="margin-top:64px">
      <div style="display:flex;align-items:flex-start;gap:18px">
        <div style="width:44px;height:44px;border-radius:13px;background:#1E3A5F;color:#fff;font-weight:800;font-size:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:'Source Serif 4',serif">B</div>
        <div>
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
            <div style="font-size:25px;font-weight:800;font-family:'Source Serif 4',serif">Structured &amp; Official</div>
            <div style="display:flex;gap:7px">
              <span style="width:18px;height:18px;border-radius:5px;background:#1E3A5F"></span>
              <span style="width:18px;height:18px;border-radius:5px;background:#EAF0F7"></span>
              <span style="width:18px;height:18px;border-radius:5px;background:#B5862B"></span>
              <span style="width:18px;height:18px;border-radius:5px;background:#1B2733"></span>
            </div>
          </div>
          <div style="font-size:16px;color:#5B6B82;margin-top:4px;max-width:680px;line-height:1.55;text-wrap:pretty">A serious, court-ready ledger: navy header cards, a refined serif for headings, tabular numbers and clean dividing lines. Reassuringly formal for filings — still large, high-contrast and easy to tap.</div>
        </div>
      </div>

      <div style="display:flex;gap:40px;margin-top:30px;flex-wrap:nowrap;overflow-x:auto;padding-bottom:8px">

        <!-- ───── B1 · HOME ───── -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;flex-shrink:0">
          <div style="font-size:15px;font-weight:700;color:#16263F">01 &nbsp;·&nbsp; Home</div>
          <x-import component-from-global-scope="IOSDevice" from="./ios-frame.jsx" hint-size="402px,874px">
            <div style="height:100%;background:#F5F7F9;display:flex;flex-direction:column;overflow:hidden;color:#1B2733">
              <div style="height:58px;flex-shrink:0"></div>
              <div style="flex:1;overflow:auto;padding:8px 16px 0">
                <div style="background:#1E3A5F;border-radius:18px;padding:22px 22px 24px;color:#fff;box-shadow:0 12px 26px rgba(30,58,95,0.24)">
                  <div style="display:flex;justify-content:space-between;align-items:center"><span style="font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:rgba(255,255,255,0.7)">Steward</span><span style="font-size:13px;font-weight:600;color:rgba(255,255,255,0.7)">Guardian · M. Ellison</span></div>
                  <div style="font-family:'Source Serif 4',serif;font-size:19px;font-weight:600;margin-top:18px;color:rgba(255,255,255,0.92)">Robert's Care Account</div>
                  <div style="font-family:'Source Serif 4',serif;font-size:42px;font-weight:700;letter-spacing:-0.5px;margin-top:4px;font-variant-numeric:tabular-nums">$12,480.55</div>
                  <div style="font-size:14px;color:rgba(255,255,255,0.72);margin-top:8px;font-weight:600">Available balance · as of June 16, 2026</div>
                </div>
                <div style="display:flex;gap:12px;margin-top:14px">
                  <div style="flex:1;background:#fff;border:1px solid #DCE3EA;border-radius:14px;padding:16px"><div style="font-size:13px;color:#5A6B7B;font-weight:600">Spent this month</div><div style="font-size:23px;font-weight:800;margin-top:4px;font-variant-numeric:tabular-nums">$1,847.20</div></div>
                  <div style="flex:1;background:#fff;border:1px solid #DCE3EA;border-radius:14px;padding:16px"><div style="font-size:13px;color:#5A6B7B;font-weight:600">Receipts on file</div><div style="font-size:23px;font-weight:800;margin-top:4px">26 <span style="font-size:15px;color:#5A6B7B;font-weight:700">of 28</span></div></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:baseline;margin:22px 2px 12px"><div style="font-family:'Source Serif 4',serif;font-size:21px;font-weight:700">Recent entries</div><div style="font-size:15px;font-weight:700;color:#1E3A5F">View all</div></div>
                <div style="background:#fff;border:1px solid #DCE3EA;border-radius:14px;overflow:hidden">
                  <div style="display:flex;align-items:center;gap:14px;padding:15px 16px;border-bottom:1px solid #ECF0F4"><div style="text-align:center;width:40px;flex-shrink:0"><div style="font-size:11px;font-weight:700;color:#5A6B7B;text-transform:uppercase">Jun</div><div style="font-size:19px;font-weight:800;line-height:1">16</div></div><div style="width:1px;align-self:stretch;background:#ECF0F4"></div><div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700">Riverside Pharmacy</div><div style="font-size:13px;color:#5A6B7B;margin-top:1px">Medical &amp; Care · Receipt on file</div></div><div style="font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">$84.30</div></div>
                  <div style="display:flex;align-items:center;gap:14px;padding:15px 16px;border-bottom:1px solid #ECF0F4"><div style="text-align:center;width:40px;flex-shrink:0"><div style="font-size:11px;font-weight:700;color:#5A6B7B;text-transform:uppercase">Jun</div><div style="font-size:19px;font-weight:800;line-height:1">14</div></div><div style="width:1px;align-self:stretch;background:#ECF0F4"></div><div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700">Sunrise Home Care</div><div style="font-size:13px;color:#5A6B7B;margin-top:1px">Care Services · Receipt on file</div></div><div style="font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">$640.00</div></div>
                  <div style="display:flex;align-items:center;gap:14px;padding:15px 16px;border-bottom:1px solid #ECF0F4;border-left:4px solid #B5862B;background:#FCF8EF"><div style="text-align:center;width:40px;flex-shrink:0"><div style="font-size:11px;font-weight:700;color:#5A6B7B;text-transform:uppercase">Jun</div><div style="font-size:19px;font-weight:800;line-height:1">11</div></div><div style="width:1px;align-self:stretch;background:#ECE3CC"></div><div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700">City Power &amp; Light</div><div style="font-size:13px;color:#9A6B16;font-weight:700;margin-top:1px">Utilities · Needs receipt</div></div><div style="font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">$98.40</div></div>
                  <div style="display:flex;align-items:center;gap:14px;padding:15px 16px"><div style="text-align:center;width:40px;flex-shrink:0"><div style="font-size:11px;font-weight:700;color:#5A6B7B;text-transform:uppercase">Jun</div><div style="font-size:19px;font-weight:800;line-height:1">09</div></div><div style="width:1px;align-self:stretch;background:#ECF0F4"></div><div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700">Dr. Alan Reyes</div><div style="font-size:13px;color:#5A6B7B;margin-top:1px">Medical &amp; Care · Receipt on file</div></div><div style="font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">$150.00</div></div>
                </div>
                <div style="display:flex;gap:12px;margin-top:16px">
                  <button style="flex:1;height:62px;border:none;border-radius:14px;background:#1E3A5F;color:#fff;font-size:17px;font-weight:800;font-family:inherit;cursor:pointer">Add expense</button>
                  <button style="flex:1;height:62px;border:2px solid #C3D0DC;border-radius:14px;background:#fff;color:#1E3A5F;font-size:17px;font-weight:800;font-family:inherit;cursor:pointer">Scan receipt</button>
                </div>
                <div style="height:14px"></div>
              </div>
              <div style="border-top:1px solid #DCE3EA;background:#fff;padding:8px 8px 30px;display:flex;justify-content:space-around;align-items:flex-end;flex-shrink:0">
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;border-radius:12px;background:#EAF0F7;color:#1E3A5F"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"></path><path d="M5 10v10h14V10"></path></svg><span style="font-size:12px;font-weight:800">Home</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;color:#8A98AC"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h11"></path></svg><span style="font-size:12px;font-weight:700">History</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;color:#8A98AC"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"></rect><circle cx="12" cy="13.5" r="3.3"></circle><path d="M8 7l1.5-2.5h5L16 7"></path></svg><span style="font-size:12px;font-weight:700">Receipts</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;color:#8A98AC"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5"></rect><path d="M9 8h6M9 12h6M9 16h4"></path></svg><span style="font-size:12px;font-weight:700">Reports</span></div>
              </div>
            </div>
          </x-import>
        </div>

        <!-- ───── B2 · HISTORY ───── -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;flex-shrink:0">
          <div style="font-size:15px;font-weight:700;color:#16263F">02 &nbsp;·&nbsp; History</div>
          <x-import component-from-global-scope="IOSDevice" from="./ios-frame.jsx" hint-size="402px,874px">
            <div style="height:100%;background:#F5F7F9;display:flex;flex-direction:column;overflow:hidden;color:#1B2733">
              <div style="height:58px;flex-shrink:0"></div>
              <div style="padding:8px 16px 0;flex-shrink:0">
                <div style="background:#1E3A5F;border-radius:18px;padding:20px 22px;color:#fff;box-shadow:0 12px 26px rgba(30,58,95,0.24)">
                  <div style="font-family:'Source Serif 4',serif;font-size:25px;font-weight:700">Expense History</div>
                  <div style="font-size:14px;color:rgba(255,255,255,0.72);margin-top:3px;font-weight:600">Robert's Care Account · 2026</div>
                </div>
                <div style="display:flex;background:#E7ECF1;border-radius:12px;padding:4px;margin-top:14px">
                  <div style="flex:1;text-align:center;padding:10px 0;border-radius:9px;background:#fff;font-size:15px;font-weight:800;color:#1E3A5F;box-shadow:0 1px 3px rgba(0,0,0,0.08)">This month</div>
                  <div style="flex:1;text-align:center;padding:10px 0;font-size:15px;font-weight:700;color:#5A6B7B">All</div>
                  <div style="flex:1;text-align:center;padding:10px 0;font-size:15px;font-weight:700;color:#9A6B16">Flagged</div>
                </div>
              </div>
              <div style="flex:1;overflow:auto;padding:16px 16px 0">
                <div style="display:flex;justify-content:space-between;align-items:baseline;margin:0 2px 10px"><span style="font-family:'Source Serif 4',serif;font-size:18px;font-weight:700">June 2026</span><span style="font-size:14px;font-weight:700;color:#5A6B7B">14 entries · <span style="color:#1B2733;font-weight:800">$1,847.20</span></span></div>
                <div style="background:#fff;border:1px solid #DCE3EA;border-radius:14px;overflow:hidden">
                  <div style="display:flex;align-items:center;gap:14px;padding:16px;border-bottom:1px solid #ECF0F4"><div style="text-align:center;width:40px;flex-shrink:0"><div style="font-size:11px;font-weight:700;color:#5A6B7B;text-transform:uppercase">Jun</div><div style="font-size:19px;font-weight:800;line-height:1">16</div></div><div style="width:1px;align-self:stretch;background:#ECF0F4"></div><div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700">Riverside Pharmacy</div><div style="font-size:13px;color:#5A6B7B;margin-top:1px">Medical &amp; Care · Receipt on file</div></div><div style="font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">$84.30</div></div>
                  <div style="display:flex;align-items:center;gap:14px;padding:16px;border-bottom:1px solid #ECF0F4"><div style="text-align:center;width:40px;flex-shrink:0"><div style="font-size:11px;font-weight:700;color:#5A6B7B;text-transform:uppercase">Jun</div><div style="font-size:19px;font-weight:800;line-height:1">14</div></div><div style="width:1px;align-self:stretch;background:#ECF0F4"></div><div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700">Sunrise Home Care</div><div style="font-size:13px;color:#5A6B7B;margin-top:1px">Care Services · Receipt on file</div></div><div style="font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">$640.00</div></div>
                  <div style="display:flex;align-items:center;gap:14px;padding:16px;border-bottom:1px solid #ECF0F4"><div style="text-align:center;width:40px;flex-shrink:0"><div style="font-size:11px;font-weight:700;color:#5A6B7B;text-transform:uppercase">Jun</div><div style="font-size:19px;font-weight:800;line-height:1">13</div></div><div style="width:1px;align-self:stretch;background:#ECF0F4"></div><div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700">Whole Foods Market</div><div style="font-size:13px;color:#5A6B7B;margin-top:1px">Groceries · Receipt on file</div></div><div style="font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">$112.65</div></div>
                  <div style="display:flex;align-items:center;gap:14px;padding:16px;border-bottom:1px solid #ECF0F4;border-left:4px solid #B5862B;background:#FCF8EF"><div style="text-align:center;width:40px;flex-shrink:0"><div style="font-size:11px;font-weight:700;color:#5A6B7B;text-transform:uppercase">Jun</div><div style="font-size:19px;font-weight:800;line-height:1">11</div></div><div style="width:1px;align-self:stretch;background:#ECE3CC"></div><div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700">City Power &amp; Light</div><div style="font-size:13px;color:#9A6B16;font-weight:700;margin-top:1px">Utilities · Needs receipt</div></div><div style="font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">$98.40</div></div>
                  <div style="display:flex;align-items:center;gap:14px;padding:16px"><div style="text-align:center;width:40px;flex-shrink:0"><div style="font-size:11px;font-weight:700;color:#5A6B7B;text-transform:uppercase">Jun</div><div style="font-size:19px;font-weight:800;line-height:1">09</div></div><div style="width:1px;align-self:stretch;background:#ECF0F4"></div><div style="flex:1;min-width:0"><div style="font-size:17px;font-weight:700">Dr. Alan Reyes</div><div style="font-size:13px;color:#5A6B7B;margin-top:1px">Medical &amp; Care · Receipt on file</div></div><div style="font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">$150.00</div></div>
                </div>
                <div style="height:14px"></div>
              </div>
              <div style="border-top:1px solid #DCE3EA;background:#fff;padding:8px 8px 30px;display:flex;justify-content:space-around;align-items:flex-end;flex-shrink:0">
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;color:#8A98AC"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"></path><path d="M5 10v10h14V10"></path></svg><span style="font-size:12px;font-weight:700">Home</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;border-radius:12px;background:#EAF0F7;color:#1E3A5F"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h11"></path></svg><span style="font-size:12px;font-weight:800">History</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;color:#8A98AC"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"></rect><circle cx="12" cy="13.5" r="3.3"></circle><path d="M8 7l1.5-2.5h5L16 7"></path></svg><span style="font-size:12px;font-weight:700">Receipts</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;color:#8A98AC"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5"></rect><path d="M9 8h6M9 12h6M9 16h4"></path></svg><span style="font-size:12px;font-weight:700">Reports</span></div>
              </div>
            </div>
          </x-import>
        </div>

        <!-- ───── B3 · RECEIPT ───── -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;flex-shrink:0">
          <div style="font-size:15px;font-weight:700;color:#16263F">03 &nbsp;·&nbsp; Scan receipt</div>
          <x-import component-from-global-scope="IOSDevice" from="./ios-frame.jsx" dark="{{ true }}" hint-size="402px,874px">
            <div style="height:100%;background:#0B1622;display:flex;flex-direction:column;overflow:hidden;color:#fff">
              <div style="padding:62px 22px 10px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
                <span style="font-size:17px;font-weight:700;color:rgba(255,255,255,0.9)">Cancel</span>
                <span style="font-family:'Source Serif 4',serif;font-size:19px;font-weight:700">Capture receipt</span>
                <span style="font-size:17px;font-weight:700;color:rgba(255,255,255,0.55)">Flash</span>
              </div>
              <div style="margin:8px 22px 0;background:rgba(181,134,43,0.22);border:1px solid rgba(181,134,43,0.45);border-radius:14px;padding:13px 16px;text-align:center;font-size:15px;font-weight:600;color:#F0DCB0">Position the receipt — we'll read the date &amp; amount</div>
              <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:24px">
                <div style="position:relative;width:236px;height:320px">
                  <div style="position:absolute;inset:0;background:#F4F1EA;border-radius:8px;padding:24px 22px;box-shadow:0 24px 60px rgba(0,0,0,0.6)">
                    <div style="height:16px;width:62%;background:#26323F;border-radius:3px;margin:0 auto 16px"></div>
                    <div style="height:9px;width:90%;background:#D8D2C6;border-radius:3px;margin-bottom:10px"></div>
                    <div style="height:9px;width:75%;background:#D8D2C6;border-radius:3px;margin-bottom:10px"></div>
                    <div style="height:9px;width:85%;background:#D8D2C6;border-radius:3px;margin-bottom:22px"></div>
                    <div style="display:flex;justify-content:space-between"><span style="height:11px;width:38%;background:#C7C0B2;border-radius:3px;display:block"></span><span style="height:11px;width:24%;background:#26323F;border-radius:3px;display:block"></span></div>
                  </div>
                  <div style="position:absolute;top:-6px;left:-6px;width:28px;height:28px;border-top:4px solid #B5862B;border-left:4px solid #B5862B;border-top-left-radius:6px"></div>
                  <div style="position:absolute;top:-6px;right:-6px;width:28px;height:28px;border-top:4px solid #B5862B;border-right:4px solid #B5862B;border-top-right-radius:6px"></div>
                  <div style="position:absolute;bottom:-6px;left:-6px;width:28px;height:28px;border-bottom:4px solid #B5862B;border-left:4px solid #B5862B;border-bottom-left-radius:6px"></div>
                  <div style="position:absolute;bottom:-6px;right:-6px;width:28px;height:28px;border-bottom:4px solid #B5862B;border-right:4px solid #B5862B;border-bottom-right-radius:6px"></div>
                </div>
              </div>
              <div style="display:flex;gap:10px;justify-content:center;padding:0 22px 16px;flex-shrink:0">
                <span style="background:rgba(255,255,255,0.14);border-radius:999px;padding:9px 15px;font-size:14px;font-weight:700">Date · Jun 16</span>
                <span style="background:rgba(255,255,255,0.14);border-radius:999px;padding:9px 15px;font-size:14px;font-weight:700">Amount · $84.30</span>
              </div>
              <div style="padding:0 26px 40px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
                <div style="width:58px;height:58px;border-radius:13px;background:rgba(255,255,255,0.14);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:rgba(255,255,255,0.85)">Photos</div>
                <div style="width:84px;height:84px;border-radius:50%;background:#fff;box-shadow:0 0 0 6px rgba(181,134,43,0.35);display:flex;align-items:center;justify-content:center"><div style="width:70px;height:70px;border-radius:50%;background:#fff;border:3px solid #0B1622"></div></div>
                <div style="width:58px;height:58px;border-radius:13px;background:rgba(255,255,255,0.14);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:rgba(255,255,255,0.85)">Type it</div>
              </div>
            </div>
          </x-import>
        </div>

        <!-- ───── B4 · REPORT ───── -->
        <div style="display:flex;flex-direction:column;align-items:center;gap:16px;flex-shrink:0">
          <div style="font-size:15px;font-weight:700;color:#16263F">04 &nbsp;·&nbsp; Court report</div>
          <x-import component-from-global-scope="IOSDevice" from="./ios-frame.jsx" hint-size="402px,874px">
            <div style="height:100%;background:#F5F7F9;display:flex;flex-direction:column;overflow:hidden;color:#1B2733">
              <div style="height:58px;flex-shrink:0"></div>
              <div style="flex:1;overflow:auto;padding:8px 16px 0">
                <div style="background:#1E3A5F;border-radius:18px;padding:22px;color:#fff;box-shadow:0 12px 26px rgba(30,58,95,0.24)">
                  <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:rgba(255,255,255,0.7)">Court Accounting</div>
                  <div style="font-family:'Source Serif 4',serif;font-size:26px;font-weight:700;margin-top:8px">Statement of Account</div>
                  <div style="font-size:14px;color:rgba(255,255,255,0.72);margin-top:4px;font-weight:600">Conservatorship of Robert Ellison</div>
                </div>
                <div style="display:flex;align-items:center;gap:12px;margin:18px 4px 14px"><div style="width:28px;height:3px;background:#B5862B;border-radius:2px"></div><span style="font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#5A6B7B">January 1 – June 30, 2026</span></div>
                <div style="background:#fff;border:1px solid #DCE3EA;border-radius:14px;overflow:hidden">
                  <div style="background:#EFF3F7;padding:12px 18px;font-family:'Source Serif 4',serif;font-size:16px;font-weight:700;border-bottom:1px solid #DCE3EA">Summary</div>
                  <div style="padding:4px 18px">
                    <div style="display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid #ECF0F4"><span style="font-size:16px;color:#5A6B7B;font-weight:600">Opening balance</span><span style="font-size:16px;font-weight:700;font-variant-numeric:tabular-nums">$25,440.55</span></div>
                    <div style="display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid #ECF0F4"><span style="font-size:16px;color:#5A6B7B;font-weight:600">Total disbursements</span><span style="font-size:16px;font-weight:700;font-variant-numeric:tabular-nums">$12,960.00</span></div>
                    <div style="display:flex;justify-content:space-between;padding:13px 0;border-bottom:1px solid #ECF0F4"><span style="font-size:16px;color:#5A6B7B;font-weight:600">Income received</span><span style="font-size:16px;font-weight:700;font-variant-numeric:tabular-nums">$0.00</span></div>
                    <div style="display:flex;justify-content:space-between;padding:14px 0"><span style="font-size:17px;font-weight:800">Closing balance</span><span style="font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">$12,480.55</span></div>
                  </div>
                </div>
                <div style="background:#fff;border:1px solid #DCE3EA;border-radius:14px;overflow:hidden;margin-top:14px">
                  <div style="background:#EFF3F7;padding:12px 18px;font-family:'Source Serif 4',serif;font-size:16px;font-weight:700;border-bottom:1px solid #DCE3EA">Disbursements by category</div>
                  <div style="padding:2px 18px">
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid #ECF0F4"><span style="font-size:16px;font-weight:700">Medical &amp; Care <span style="color:#5A6B7B;font-weight:600;font-size:14px">· 32%</span></span><span style="font-size:16px;font-weight:800;font-variant-numeric:tabular-nums">$4,210.00</span></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid #ECF0F4"><span style="font-size:16px;font-weight:700">Care Services <span style="color:#5A6B7B;font-weight:600;font-size:14px">· 30%</span></span><span style="font-size:16px;font-weight:800;font-variant-numeric:tabular-nums">$3,840.00</span></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid #ECF0F4"><span style="font-size:16px;font-weight:700">Housing <span style="color:#5A6B7B;font-weight:600;font-size:14px">· 20%</span></span><span style="font-size:16px;font-weight:800;font-variant-numeric:tabular-nums">$2,600.00</span></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid #ECF0F4"><span style="font-size:16px;font-weight:700">Groceries <span style="color:#5A6B7B;font-weight:600;font-size:14px">· 9%</span></span><span style="font-size:16px;font-weight:800;font-variant-numeric:tabular-nums">$1,180.00</span></div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 0"><span style="font-size:16px;font-weight:700">Utilities &amp; Personal <span style="color:#5A6B7B;font-weight:600;font-size:14px">· 9%</span></span><span style="font-size:16px;font-weight:800;font-variant-numeric:tabular-nums">$1,130.00</span></div>
                  </div>
                </div>
                <button style="width:100%;height:64px;border:none;border-radius:14px;background:#1E3A5F;color:#fff;font-size:18px;font-weight:800;font-family:inherit;cursor:pointer;margin-top:16px">Generate court PDF</button>
                <button style="width:100%;height:58px;border:2px solid #C3D0DC;border-radius:14px;background:#fff;color:#1E3A5F;font-size:17px;font-weight:800;font-family:inherit;cursor:pointer;margin-top:12px">Share with attorney</button>
                <div style="display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 0 4px"><span style="width:7px;height:7px;border-radius:50%;background:#B5862B"></span><span style="font-size:13px;color:#5A6B7B;font-weight:600">Prepared June 16, 2026 · 28 receipts attached</span></div>
                <div style="height:10px"></div>
              </div>
              <div style="border-top:1px solid #DCE3EA;background:#fff;padding:8px 8px 30px;display:flex;justify-content:space-around;align-items:flex-end;flex-shrink:0">
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;color:#8A98AC"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"></path><path d="M5 10v10h14V10"></path></svg><span style="font-size:12px;font-weight:700">Home</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;color:#8A98AC"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h11"></path></svg><span style="font-size:12px;font-weight:700">History</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;color:#8A98AC"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"></rect><circle cx="12" cy="13.5" r="3.3"></circle><path d="M8 7l1.5-2.5h5L16 7"></path></svg><span style="font-size:12px;font-weight:700">Receipts</span></div>
                <div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 12px;border-radius:12px;background:#EAF0F7;color:#1E3A5F"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5"></rect><path d="M9 8h6M9 12h6M9 16h4"></path></svg><span style="font-size:12px;font-weight:800">Reports</span></div>
              </div>
            </div>
          </x-import>
        </div>

      </div>
    </div>

  </div>
</div>
</x-dc>
</body>
</html>
