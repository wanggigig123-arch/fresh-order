import { useState, useRef, useEffect } from "react";

// ╔══════════════════════════════════════════════════════════╗
// ║  🔧 設定區 — 只需要改這裡                                ║
// ╚══════════════════════════════════════════════════════════╝
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwWdoFoRdP3a0gj9SKtx539idJYVlkA_bhf1FY88FbUuIR5lvEaYzwNjdAY6VA9YAYlcg/exec";

const ADMIN_PASSWORD = "820822"; // 後台密碼

// ╔══════════════════════════════════════════════════════════╗
// ║  樣式                                                    ║
// ╚══════════════════════════════════════════════════════════╝
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;700&family=Noto+Sans+TC:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#1a2e18;--ink2:#3d5c38;--ink3:#6b8c63;
  --cream:#faf7f2;--warm:#f3ede2;--white:#ffffff;
  --leaf:#3a7d35;--leaf2:#5da854;--leaf3:#d4edcc;--leaf4:#eaf6e6;
  --gold:#b8860b;
  --red:#c0392b;--red2:#fde8e6;--red3:#fef5f4;
  --orange:#e67e22;
  --blue:#2471a3;
  --mushroom:#7d6035;
  --r:12px;--rs:8px;
  --s1:0 2px 8px rgba(26,46,24,.09);
  --s2:0 6px 20px rgba(26,46,24,.13);
}
body{font-family:'Noto Sans TC',sans-serif;background:var(--cream);color:var(--ink);min-height:100vh}
.hd{background:var(--leaf);padding:0 20px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;box-shadow:var(--s2)}
.hd-logo{font-family:'Noto Serif TC',serif;color:#fff;font-size:1.12rem;font-weight:700;display:flex;align-items:center;gap:9px}
.hd-tabs{display:flex;gap:4px}
.htab{border:1.5px solid transparent;background:transparent;color:rgba(255,255,255,.65);padding:5px 14px;border-radius:18px;font-family:'Noto Sans TC',sans-serif;font-size:.82rem;cursor:pointer;transition:all .2s}
.htab:hover{color:#fff;border-color:rgba(255,255,255,.4)}
.htab.on{background:rgba(255,255,255,.22);color:#fff;border-color:rgba(255,255,255,.5);font-weight:600}
.pg{max-width:1080px;margin:0 auto;padding:26px 16px}
.deadline-banner{border-radius:var(--r);padding:14px 20px;margin-bottom:22px;display:flex;align-items:center;gap:14px;box-shadow:var(--s1)}
.deadline-banner.open{background:linear-gradient(135deg,var(--leaf),var(--leaf2));color:#fff}
.deadline-banner.warning{background:linear-gradient(135deg,#d4680a,var(--orange));color:#fff}
.deadline-banner.closed{background:linear-gradient(135deg,#922b21,var(--red));color:#fff}
.dl-icon{font-size:1.8rem}
.dl-title{font-family:'Noto Serif TC',serif;font-size:1rem;font-weight:700;margin-bottom:2px}
.dl-sub{font-size:.78rem;opacity:.88}
.dl-countdown{margin-left:auto;text-align:right}
.dl-time{font-size:1.1rem;font-weight:700;font-variant-numeric:tabular-nums}
.dl-label{font-size:.72rem;opacity:.75;margin-top:1px}
.late-tag{background:var(--red);color:#fff;border-radius:8px;padding:2px 9px;font-size:.72rem;font-weight:700;margin-left:6px}
.late-tag-sm{background:#fde8e6;color:var(--red);border-radius:7px;padding:1px 8px;font-size:.7rem;font-weight:700}
.wk-banner{background:linear-gradient(135deg,var(--leaf),var(--leaf2));border-radius:var(--r);padding:16px 22px;margin-bottom:22px;display:flex;align-items:center;justify-content:space-between;color:#fff;box-shadow:var(--s1)}
.wk-title{font-family:'Noto Serif TC',serif;font-size:1.05rem;font-weight:700}
.wk-sub{font-size:.78rem;opacity:.8;margin-top:2px}
.wk-note{font-size:.73rem;opacity:.7;text-align:right;line-height:1.6}
.zone-wrap{margin-bottom:26px}
.zone-head{display:flex;align-items:center;gap:10px;margin-bottom:13px}
.zone-icon{font-size:1.25rem}
.zone-label{font-family:'Noto Serif TC',serif;font-size:1rem;font-weight:700}
.zone-line{flex:1;height:2px;border-radius:2px}
.zone-leaf .zone-line{background:linear-gradient(90deg,var(--leaf2),transparent)}
.zone-leaf .zone-label{color:var(--leaf)}
.zone-fruit .zone-line{background:linear-gradient(90deg,var(--orange),transparent)}
.zone-fruit .zone-label{color:#c0650a}
.zone-cold .zone-line{background:linear-gradient(90deg,var(--blue),transparent)}
.zone-cold .zone-label{color:var(--blue)}
.zone-sprout .zone-line{background:linear-gradient(90deg,#27ae60,transparent)}
.zone-sprout .zone-label{color:#1e8449}
.zone-mushroom .zone-line{background:linear-gradient(90deg,var(--mushroom),transparent)}
.zone-mushroom .zone-label{color:var(--mushroom)}
.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:10px}
.pcard{background:var(--white);border-radius:var(--r);padding:13px 12px;box-shadow:var(--s1);border:2px solid transparent;cursor:pointer;transition:all .22s}
.pcard:hover{transform:translateY(-2px);box-shadow:var(--s2)}
.pcard.sel{border-color:var(--leaf2);background:var(--leaf4)}
.pcard-icon{font-size:1.75rem;margin-bottom:6px;line-height:1}
.pcard-name{font-weight:600;font-size:.9rem;margin-bottom:2px}
.pcard-price{font-size:.77rem;color:var(--gold);font-weight:600}
.pcard-note{font-size:.7rem;color:var(--ink3);margin-top:2px}
.qty-row{display:flex;align-items:center;gap:7px;margin-top:9px}
.qbtn{width:26px;height:26px;border-radius:50%;border:1.5px solid var(--leaf2);background:transparent;color:var(--leaf);font-size:.95rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s}
.qbtn:hover{background:var(--leaf2);color:#fff}
.qnum{font-weight:700;font-size:.93rem;min-width:20px;text-align:center}
.unit-tag{font-size:.7rem;color:var(--ink3)}
.oform{background:var(--white);border-radius:var(--r);padding:22px;box-shadow:var(--s1);margin-top:18px}
.oform-title{font-family:'Noto Serif TC',serif;font-size:.98rem;color:var(--leaf);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.cart-box{background:var(--warm);border-radius:var(--rs);padding:13px;margin-bottom:14px;border-left:4px solid var(--leaf2);min-height:48px}
.cart-row{display:flex;justify-content:space-between;align-items:center;padding:3px 0;font-size:.86rem}
.cart-empty{color:var(--ink3);font-size:.83rem;text-align:center;padding:6px}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:13px}
@media(max-width:500px){.frow{grid-template-columns:1fr}}
.fg{display:flex;flex-direction:column;gap:5px}
.fl{font-size:.79rem;color:var(--ink2);font-weight:500}
.fi{border:1.5px solid #cde0c8;border-radius:var(--rs);padding:8px 12px;font-family:'Noto Sans TC',sans-serif;font-size:.9rem;color:var(--ink);background:var(--cream);outline:none;transition:border-color .2s}
.fi:focus{border-color:var(--leaf2);background:#fff}
textarea.fi{resize:vertical;min-height:66px}
.sub-btn{width:100%;padding:13px;background:linear-gradient(135deg,var(--leaf),var(--leaf2));color:#fff;border:none;border-radius:var(--rs);font-size:.95rem;font-weight:600;font-family:'Noto Sans TC',sans-serif;cursor:pointer;letter-spacing:.05em;transition:all .2s;box-shadow:0 4px 14px rgba(58,125,53,.28)}
.sub-btn:hover{transform:translateY(-1px);box-shadow:0 7px 20px rgba(58,125,53,.36)}
.sub-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
.late-warn-box{background:var(--red3);border:1.5px solid #f5b7ae;border-radius:var(--rs);padding:12px 14px;margin-bottom:14px;font-size:.85rem;color:var(--red)}
.suc{text-align:center;padding:56px 16px}
.suc-icon{font-size:3.6rem;margin-bottom:14px}
.suc-title{font-family:'Noto Serif TC',serif;font-size:1.45rem;color:var(--leaf);margin-bottom:7px}
.suc-sub{color:var(--ink2);font-size:.9rem}
.back-btn{margin-top:20px;padding:8px 24px;border:2px solid var(--leaf2);background:transparent;border-radius:18px;color:var(--leaf);font-family:'Noto Sans TC',sans-serif;font-size:.87rem;cursor:pointer;transition:all .2s}
.back-btn:hover{background:var(--leaf2);color:#fff}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:22px}
@media(max-width:480px){.stats{grid-template-columns:1fr 1fr}}
.scard{background:var(--white);border-radius:var(--rs);padding:15px;box-shadow:var(--s1);text-align:center}
.snum{font-size:1.65rem;font-weight:700;color:var(--leaf);font-family:'Noto Serif TC',serif}
.slabel{font-size:.73rem;color:var(--ink3);margin-top:2px}
.atabs{display:flex;gap:6px;margin-bottom:18px;flex-wrap:wrap}
.atab{padding:6px 15px;border-radius:16px;border:1.5px solid #cde0c8;background:#fff;color:var(--ink2);font-family:'Noto Sans TC',sans-serif;font-size:.82rem;cursor:pointer;transition:all .2s}
.atab.on{background:var(--leaf);color:#fff;border-color:transparent;font-weight:600}
.otable-wrap{background:#fff;border-radius:var(--r);box-shadow:var(--s1);overflow:hidden;overflow-x:auto}
.otable{width:100%;border-collapse:collapse;font-size:.83rem;min-width:600px}
.otable th{background:var(--leaf);color:#fff;padding:10px 12px;text-align:left;font-weight:500;font-family:'Noto Serif TC',serif}
.otable td{padding:10px 12px;border-bottom:1px solid #eef4ec;vertical-align:top}
.otable tr:last-child td{border-bottom:none}
.otable tr:hover td{background:#f4fbf2}
.otable tr.late-row td{background:#fff8f8}
.itag{display:inline-block;background:var(--leaf3);color:var(--leaf);border-radius:9px;padding:2px 8px;font-size:.73rem;font-weight:600;margin:2px}
.no-data{text-align:center;padding:42px;color:var(--ink3)}
.search-fi{border:1.5px solid #cde0c8;border-radius:var(--rs);padding:7px 12px;font-family:'Noto Sans TC',sans-serif;font-size:.84rem;outline:none;width:180px}
.search-fi:focus{border-color:var(--leaf2)}
.filter-row{display:flex;gap:10px;align-items:center;margin-bottom:13px;flex-wrap:wrap}
.count-tag{font-size:.78rem;color:var(--ink3)}
.export-btn{display:flex;align-items:center;gap:7px;padding:8px 16px;background:linear-gradient(135deg,#1a6b3a,#27a056);color:#fff;border:none;border-radius:var(--rs);font-family:'Noto Sans TC',sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;box-shadow:0 3px 10px rgba(26,107,58,.28);transition:all .2s;margin-left:auto}
.export-btn:hover{transform:translateY(-1px)}
.export-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
.ai-panel{background:#fff;border-radius:var(--r);box-shadow:var(--s1);padding:22px;margin-bottom:20px}
.ai-panel-title{font-family:'Noto Serif TC',serif;font-size:1rem;color:var(--leaf);margin-bottom:15px;display:flex;align-items:center;gap:8px}
.upload-zone{border:2.5px dashed #9ecb96;border-radius:var(--r);padding:28px;text-align:center;cursor:pointer;transition:all .22s;background:var(--leaf4)}
.upload-zone:hover,.upload-zone.drag{border-color:var(--leaf2);background:#e0f5db}
.upload-icon{font-size:2.2rem;margin-bottom:7px}
.upload-text{color:var(--ink2);font-size:.86rem;line-height:1.6}
.upload-hint{font-size:.75rem;color:var(--ink3);margin-top:3px}
.ai-loading{display:flex;flex-direction:column;align-items:center;gap:10px;padding:22px;color:var(--ink2);font-size:.87rem}
.spinner{width:34px;height:34px;border:3.5px solid var(--leaf3);border-top-color:var(--leaf);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.diff-panel{margin-top:16px}
.diff-title{font-weight:600;font-size:.86rem;margin-bottom:9px;color:var(--ink2)}
.diff-list{display:flex;flex-direction:column;gap:6px;max-height:380px;overflow-y:auto}
.diff-item{display:flex;align-items:center;gap:10px;padding:9px 13px;border-radius:var(--rs);border:1.5px solid transparent}
.diff-item.new-item{background:#e8f9e4;border-color:#9ecb96}
.diff-item.exist-item{background:#f4f4f4;border-color:#ddd}
.diff-item.removed-item{background:var(--red3);border-color:#f5b7ae}
.diff-emoji-big{font-size:1.35rem;min-width:26px;text-align:center}
.diff-info{flex:1}
.diff-name{font-weight:600;font-size:.88rem}
.diff-meta{font-size:.74rem;color:var(--ink3);margin-top:1px}
.diff-badge{border-radius:9px;padding:2px 9px;font-size:.71rem;font-weight:700;white-space:nowrap}
.badge-new{background:var(--leaf);color:#fff}
.badge-exist{background:#ddd;color:#888}
.badge-remove{background:var(--red);color:#fff}
.diff-toggle{width:27px;height:27px;border-radius:50%;border:1.5px solid;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.88rem;transition:all .15s;background:transparent;flex-shrink:0}
.diff-toggle.checked{background:var(--leaf2);border-color:var(--leaf2);color:#fff}
.diff-toggle.unchecked{border-color:#ccc;color:#ccc}
.apply-btn{width:100%;margin-top:13px;padding:12px;background:linear-gradient(135deg,#2d6b28,var(--leaf2));color:#fff;border:none;border-radius:var(--rs);font-size:.93rem;font-weight:700;font-family:'Noto Sans TC',sans-serif;cursor:pointer;letter-spacing:.05em;transition:all .2s;box-shadow:0 4px 14px rgba(45,107,40,.3)}
.apply-btn:hover{transform:translateY(-1px)}

/* ── 刪除確認 ── */
.del-confirm{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px}
.del-card{background:#fff;border-radius:var(--r);padding:28px 24px;max-width:340px;width:100%;box-shadow:var(--s2);text-align:center}
.del-icon{font-size:2.4rem;margin-bottom:10px}
.del-title{font-family:'Noto Serif TC',serif;font-size:1.05rem;color:var(--ink);margin-bottom:6px}
.del-sub{font-size:.83rem;color:var(--ink3);margin-bottom:20px;line-height:1.6}
.del-btns{display:flex;gap:10px}
.del-btn-cancel{flex:1;padding:10px;border:1.5px solid #ddd;background:#fff;border-radius:var(--rs);font-family:'Noto Sans TC',sans-serif;font-size:.88rem;cursor:pointer;transition:all .15s}
.del-btn-cancel:hover{background:#f5f5f5}
.del-btn-confirm{flex:1;padding:10px;border:none;background:var(--red);color:#fff;border-radius:var(--rs);font-family:'Noto Sans TC',sans-serif;font-size:.88rem;font-weight:600;cursor:pointer;transition:all .15s}
.del-btn-confirm:hover{background:#a93226}
.stock-panel{background:#fff;border-radius:var(--r);box-shadow:var(--s1);padding:20px;margin-bottom:16px}
.stock-title{font-family:'Noto Serif TC',serif;font-size:.95rem;color:var(--leaf);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.stock-table-wrap{overflow-x:auto}
.stock-table{border-collapse:collapse;font-size:.8rem;min-width:100%}
.stock-table th{background:var(--leaf);color:#fff;padding:8px 10px;text-align:center;font-weight:500;white-space:nowrap;position:sticky;top:0}
.stock-table th.item-col{text-align:left;min-width:80px;position:sticky;left:0;z-index:2;background:var(--leaf)}
.stock-table td{padding:7px 10px;border-bottom:1px solid #eef4ec;text-align:center;white-space:nowrap}
.stock-table td.item-col{text-align:left;font-weight:600;font-size:.82rem;background:#fff;position:sticky;left:0;z-index:1;border-right:1px solid #eef4ec}
.stock-table tr:hover td{background:#f4fbf2}
.stock-table tr:hover td.item-col{background:#f4fbf2}
.stock-qty{font-weight:600;color:var(--ink)}
.stock-total{font-weight:700;color:var(--leaf);background:#f0f8ee!important}
.stock-actual-input{width:54px;border:1.5px solid #cde0c8;border-radius:5px;padding:3px 6px;text-align:center;font-family:'Noto Sans TC',sans-serif;font-size:.8rem;outline:none}
.stock-actual-input:focus{border-color:var(--leaf2)}
.stock-diff-ok{color:var(--leaf);font-weight:700}
.stock-diff-warn{color:var(--red);font-weight:700;background:#fff0f0!important}
.stock-row-warn td{background:#fff8f8}
.stock-empty{text-align:center;padding:40px;color:var(--ink3)}
.stock-legend{display:flex;gap:14px;font-size:.76rem;color:var(--ink3);margin-bottom:12px;flex-wrap:wrap}
.stock-legend span{display:flex;align-items:center;gap:4px}
.pm-list{display:flex;flex-direction:column;gap:6px}
.pm-item{display:flex;align-items:center;gap:10px;padding:10px 14px;background:#fff;border-radius:var(--rs);box-shadow:var(--s1)}
.pm-emoji{font-size:1.3rem;min-width:26px;text-align:center}
.pm-info{flex:1}
.pm-name{font-weight:600;font-size:.88rem}
.pm-meta{font-size:.74rem;color:var(--ink3)}
.pm-zone{font-size:.69rem;padding:1px 7px;border-radius:7px;font-weight:600;background:var(--leaf3);color:var(--leaf)}
.pill{padding:2px 8px;border-radius:9px;font-size:.71rem;font-weight:600}
.pill-on{background:#e0f5db;color:var(--leaf)}
.pill-off{background:#f0f0f0;color:#999}
.icon-btn{background:none;border:none;cursor:pointer;padding:3px 7px;border-radius:6px;font-size:.92rem;transition:background .15s}
.icon-btn:hover{background:#f0f0f0}
.icon-btn.d:hover{background:#fde8e6}
.summary-wrap{background:#fff;border-radius:var(--r);box-shadow:var(--s1);padding:18px;margin-bottom:18px}
.summary-title{font-family:'Noto Serif TC',serif;font-size:.95rem;color:var(--leaf);margin-bottom:11px}
.summary-chips{display:flex;flex-wrap:wrap;gap:7px}
.s-chip{background:var(--leaf3);color:var(--leaf);border-radius:10px;padding:5px 12px;display:flex;align-items:center;gap:5px;font-size:.83rem}
.s-chip-qty{background:var(--leaf2);color:#fff;border-radius:7px;padding:1px 7px;font-size:.73rem;font-weight:700}
.toast{position:fixed;bottom:22px;right:18px;color:#fff;padding:12px 20px;border-radius:var(--rs);box-shadow:var(--s2);font-size:.87rem;z-index:999;animation:ti .3s ease;max-width:280px}
.toast.success{background:var(--leaf)}
.toast.error{background:var(--red)}
@keyframes ti{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
/* ── 後台登入 ── */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--cream)}
.login-card{background:#fff;border-radius:var(--r);padding:40px 32px;box-shadow:var(--s2);width:100%;max-width:360px;text-align:center}
.login-icon{font-size:2.8rem;margin-bottom:12px}
.login-title{font-family:'Noto Serif TC',serif;font-size:1.3rem;color:var(--leaf);margin-bottom:6px}
.login-sub{font-size:.83rem;color:var(--ink3);margin-bottom:24px}
.login-input{width:100%;border:1.5px solid #cde0c8;border-radius:var(--rs);padding:11px 14px;font-family:'Noto Sans TC',sans-serif;font-size:1rem;text-align:center;letter-spacing:.2em;outline:none;margin-bottom:14px;transition:border-color .2s}
.login-input:focus{border-color:var(--leaf2);background:#fff}
.login-btn{width:100%;padding:12px;background:linear-gradient(135deg,var(--leaf),var(--leaf2));color:#fff;border:none;border-radius:var(--rs);font-size:.95rem;font-weight:600;font-family:'Noto Sans TC',sans-serif;cursor:pointer;transition:all .2s}
.login-btn:hover{transform:translateY(-1px)}
.login-err{color:var(--red);font-size:.83rem;margin-top:10px}

.pwa-banner{background:var(--gold2,#fff8e1);border:1.5px solid #f0c040;border-radius:var(--rs);padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:12px;font-size:.83rem;color:#7a5c00}
.pwa-banner-text{flex:1;line-height:1.5}
.pwa-install-btn{padding:6px 14px;background:#f0c040;border:none;border-radius:6px;font-family:'Noto Sans TC',sans-serif;font-size:.8rem;font-weight:700;color:#5a3e00;cursor:pointer;white-space:nowrap}
.pwa-close{background:none;border:none;cursor:pointer;font-size:1rem;color:#bba000;padding:2px 6px}
`;

// ╔══════════════════════════════════════════════════════════╗
// ║  品項資料                                                ║
// ╚══════════════════════════════════════════════════════════╝
const DEFAULT_ZONES = [
  { id:"leaf",     label:"葉菜區", icon:"🥬", cls:"zone-leaf", items:[
    {id:"l01",name:"包菜",        emoji:"🥬",unit:"顆",price:null},
    {id:"l02",name:"紅蘿蔔",      emoji:"🥕",unit:"斤",price:130},
    {id:"l03",name:"馬鈴薯",      emoji:"🥔",unit:"斤",price:130},
    {id:"l04",name:"黃洋蔥",      emoji:"🧅",unit:"斤",price:null},
    {id:"l05",name:"高麗菜",      emoji:"🥬",unit:"顆",price:null},
    {id:"l06",name:"青花椰",      emoji:"🥦",unit:"顆",price:null},
    {id:"l07",name:"白花椰",      emoji:"🤍",unit:"顆",price:null},
    {id:"l08",name:"大蕃茄",      emoji:"🍅",unit:"斤",price:null},
    {id:"l09",name:"大黃瓜",      emoji:"🥒",unit:"條",price:null},
    {id:"l10",name:"小黃瓜",      emoji:"🥒",unit:"條",price:null},
    {id:"l11",name:"青椒",        emoji:"🫑",unit:"斤",price:null},
  ]},
  { id:"fruit",    label:"蔬果區", icon:"🍎", cls:"zone-fruit", items:[
    {id:"f01",name:"彩椒",        emoji:"🫑",unit:"斤", price:null},
    {id:"f02",name:"紅鬚玉米筍",  emoji:"🌽",unit:"包", price:null},
    {id:"f03",name:"牛蒡",        emoji:"🌿",unit:"斤", price:null},
    {id:"f04",name:"獅瓜",        emoji:"🎃",unit:"條", price:null},
    {id:"f05",name:"絲瓜",        emoji:"🥒",unit:"條", price:null},
    {id:"f06",name:"進口蘋果(大)",emoji:"🍎",unit:"顆", price:250},
    {id:"f07",name:"桶柑",        emoji:"🍊",unit:"斤", price:100},
    {id:"f08",name:"鳳梨",        emoji:"🍍",unit:"顆", price:null},
    {id:"f09",name:"珍珠芭樂",    emoji:"🍐",unit:"盒", price:null,note:"區域總量限制"},
    {id:"f10",name:"葡萄",        emoji:"🍇",unit:"串", price:null},
    {id:"f11",name:"小蕃茄",      emoji:"🍒",unit:"盒", price:null},
  ]},
  { id:"cold",     label:"冷藏區", icon:"❄️", cls:"zone-cold", items:[
    {id:"c01",name:"吉祥蛋",      emoji:"🥚",unit:"盒",price:135},
    {id:"c02",name:"紅吉蛋",      emoji:"🥚",unit:"盒",price:140},
    {id:"c03",name:"豆腐",        emoji:"🫙",unit:"盒",price:55},
    {id:"c04",name:"豆干",        emoji:"🫙",unit:"包",price:65},
    {id:"c05",name:"味噌",        emoji:"🍜",unit:"包",price:115},
    {id:"c06",name:"蘿蔔乾",      emoji:"🥡",unit:"包",price:300},
  ]},
  { id:"sprout",   label:"芽菜區", icon:"🌱", cls:"zone-sprout", items:[
    {id:"s01",name:"綠豆芽",      emoji:"🌱",unit:"包",price:55},
    {id:"s02",name:"黃豆芽",      emoji:"🌿",unit:"包",price:55},
    {id:"s03",name:"黑豆芽",      emoji:"🌿",unit:"包",price:50},
  ]},
  { id:"mushroom", label:"菇菇區", icon:"🍄", cls:"zone-mushroom", items:[
    {id:"m01",name:"蘑菇",        emoji:"🍄",unit:"盒",price:null},
    {id:"m02",name:"金針菇",      emoji:"🍄",unit:"包",price:40},
    {id:"m03",name:"木耳",        emoji:"🍄",unit:"包",price:87},
    {id:"m04",name:"白柳菇",      emoji:"🍄",unit:"包",price:85},
    {id:"m05",name:"杏鮑菇",      emoji:"🍄",unit:"包",price:350},
    {id:"m06",name:"生香菇(中)",  emoji:"🍄",unit:"盒",price:130},
    {id:"m07",name:"鴻禧菇",      emoji:"🍄",unit:"包",price:380},
    {id:"m08",name:"美白菇",      emoji:"🍄",unit:"包",price:380},
    {id:"m09",name:"乾猴頭菇",    emoji:"🍄",unit:"包",price:435},
  ]},
];

const EMOJI_MAP = {
  蘿蔔:"🥕",馬鈴薯:"🥔",洋蔥:"🧅",高麗菜:"🥬",包菜:"🥬",花椰:"🥦",
  蕃茄:"🍅",番茄:"🍅",黃瓜:"🥒",青椒:"🫑",彩椒:"🫑",玉米:"🌽",
  牛蒡:"🌿",蘋果:"🍎",柑:"🍊",橘:"🍊",鳳梨:"🍍",芭樂:"🍐",
  葡萄:"🍇",小蕃茄:"🍒",蛋:"🥚",豆腐:"🫙",豆干:"🫙",味噌:"🍜",
  豆芽:"🌱",菇:"🍄",木耳:"🍄",
};
function guessEmoji(name) {
  for (const [k,v] of Object.entries(EMOJI_MAP)) { if (name.includes(k)) return v; }
  return "🥗";
}

// ╔══════════════════════════════════════════════════════════╗
// ║  工具函式                                                ║
// ╚══════════════════════════════════════════════════════════╝
function getDeadline() {
  const now = new Date();
  const day = now.getDay();
  const diff = (4 - day + 7) % 7;
  const thu = new Date(now);
  thu.setDate(now.getDate() + (diff === 0 && now.getHours() >= 20 ? 7 : diff));
  thu.setHours(20, 0, 0, 0);
  return thu;
}

function useDeadlineStatus() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const deadline = getDeadline();
  const diff = deadline - now;
  const isClosed  = diff <= 0;
  const isWarning = !isClosed && diff < 2 * 60 * 60 * 1000;
  const hours = Math.floor(diff / 3600000);
  const mins  = Math.floor((diff % 3600000) / 60000);
  const secs  = Math.floor((diff % 60000) / 1000);
  return { deadline, isClosed, isWarning, hours, mins, secs };
}

function getWeekLabel() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() + (day === 0 ? 1 : 8 - day));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = d => `${d.getMonth()+1}/${d.getDate()}`;
  return `下週 ${fmt(monday)}（一）– ${fmt(sunday)}（日）`;
}

// 取得下週二到貨日
function getArrivalDate() {
  const now = new Date();
  const day = now.getDay();
  // 下週二 = 距離今天 (9 - day) % 7 天，若今天是週二且未截止則用下週
  const tuesday = new Date(now);
  const diff = (9 - day) % 7 || 7;
  tuesday.setDate(now.getDate() + diff);
  const fmt = d => `${d.getMonth()+1}/${d.getDate()}`;
  return `${fmt(tuesday)}（二）`;
}

// 取得本週四截止日
function getDeadlineDate() {
  const deadline = getDeadline();
  const fmt = d => `${d.getMonth()+1}/${d.getDate()}`;
  return `${fmt(deadline)}（四）`;
}

// 送訂單到 Google Sheets
async function sendToSheet(orderData) {
  if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes("貼上你的")) return;
  try {
    const url = GOOGLE_SHEET_URL + "?data=" + encodeURIComponent(JSON.stringify(orderData));
    await fetch(url, { method: "GET", mode: "no-cors" });
  } catch (e) {
    console.warn("Google Sheet 連線失敗", e);
  }
}

// 從 Google Sheets 讀取品項
async function loadZonesFromSheet() {
  if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes("貼上你的")) return null;
  try {
    const url = GOOGLE_SHEET_URL + "?action=getZones";
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.status === "ok" && data.zones) {
      // 存到 localStorage 快取
      localStorage.setItem("fresh_zones_cache", JSON.stringify(data.zones));
      return data.zones;
    }
    return null;
  } catch (e) {
    console.warn("讀取品項失敗", e);
    return null;
  }
}

// 從 localStorage 讀取快取品項
function loadZonesFromCache() {
  try {
    const cached = localStorage.getItem("fresh_zones_cache");
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    return null;
  }
}

// 儲存品項到 Google Sheets（分段 GET 傳送，避免 URL 長度限制）
async function saveZonesToSheet(zones) {
  if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes("貼上你的")) return;
  try {
    const json = JSON.stringify(zones);
    const CHUNK_SIZE = 800; // 每段 800 字元
    const chunks = [];
    for (let i = 0; i < json.length; i += CHUNK_SIZE) {
      chunks.push(json.slice(i, i + CHUNK_SIZE));
    }
    // 逐段傳送
    for (let i = 0; i < chunks.length; i++) {
      const url = GOOGLE_SHEET_URL
        + "?action=saveChunk"
        + "&idx=" + i
        + "&total=" + chunks.length
        + "&chunk=" + encodeURIComponent(chunks[i]);
      await fetch(url, { method: "GET", mode: "no-cors" });
      // 稍微等一下避免過快
      await new Promise(r => setTimeout(r, 100));
    }
  } catch (e) {
    console.warn("儲存品項失敗", e);
  }
}

// CSV 匯出
function downloadCSV(filename, rows) {
  const bom = "\uFEFF";
  const csv = bom + rows.map(row =>
    row.map(cell => {
      const s = String(cell ?? "");
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g,'""')}"` : s;
    }).join(",")
  ).join("\r\n");
  const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ╔══════════════════════════════════════════════════════════╗
// ║  主 App                                                  ║
// ╚══════════════════════════════════════════════════════════╝
export default function App() {
  const [view, setView]     = useState("order");
  const [zones, setZones]   = useState(DEFAULT_ZONES);
  const [orders, setOrders] = useState([]);
  const [toast, setToast]   = useState(null);
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [zonesLoading, setZonesLoading] = useState(true);
  // PWA 安裝提示
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall]       = useState(false);

  // 啟動時載入品項：先用快取（瞬間顯示），背景再從 Sheets 更新
  useEffect(() => {
    // 先檢查快取，有的話立刻顯示
    const cached = loadZonesFromCache();
    if (cached) {
      setZones(cached);
      setZonesLoading(false);
      // 背景靜默更新
      loadZonesFromSheet().then(fresh => {
        if (fresh) setZones(fresh);
      });
    } else {
      // 沒有快取，正常等待載入
      loadZonesFromSheet().then(savedZones => {
        if (savedZones) setZones(savedZones);
        setZonesLoading(false);
      }).catch(() => setZonesLoading(false));
    }
  }, []);

  useEffect(() => {
    const handler = e => { e.preventDefault(); setDeferredPrompt(e); setShowInstall(true); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null); setShowInstall(false);
  };

  const showToast = (msg, type="success") => {
    setToast({msg,type}); setTimeout(()=>setToast(null),3000);
  };

  // 更新品項並同步到 Google Sheets 和快取
  const updateZones = async (newZones) => {
    setZones(newZones);
    // 立刻存到快取
    try { localStorage.setItem("fresh_zones_cache", JSON.stringify(newZones)); } catch(e) {}
    // 背景存到 Sheets
    await saveZonesToSheet(newZones);
  };

  return (
    <>
      <style>{STYLE}</style>

      {/* PWA 安裝提示（Android Chrome 會自動觸發）*/}
      {showInstall && (
        <div className="pwa-banner" style={{margin:"8px 16px 0"}}>
          <span style={{fontSize:"1.4rem"}}>📲</span>
          <div className="pwa-banner-text">
            <strong>加入主畫面</strong>，像 App 一樣使用！<br/>
            下次直接從桌面開啟，不用記網址。
          </div>
          <button className="pwa-install-btn" onClick={installPWA}>安裝</button>
          <button className="pwa-close" onClick={()=>setShowInstall(false)}>✕</button>
        </div>
      )}

      <header className="hd">
        <div className="hd-logo"><span>🌾</span>鮮採直送 訂購平台</div>
        <div className="hd-tabs">
          <button className={`htab ${view==="order"?"on":""}`} onClick={()=>setView("order")}>🛒 訂購</button>
          <button className={`htab ${view==="admin"?"on":""}`} onClick={()=>setView("admin")}>⚙️ 後台</button>
        </div>
      </header>

      {view==="order"
        ? zonesLoading
          ? <div style={{textAlign:"center",padding:"60px",color:"var(--ink3)"}}>
              <div style={{fontSize:"2rem",marginBottom:12}}>🌱</div>
              <div>載入品項中…</div>
            </div>
          : <OrderPage zones={zones} onOrder={async o=>{
            setOrders(p=>[{...o,id:Date.now(),time:new Date().toLocaleString("zh-TW")},...p]);
            await sendToSheet(o);
            showToast(o.isLate ? "⚠️ 訂單送出（逾期標注）" : "✅ 訂單送出成功！");
          }}/>
        : adminAuthed
          ? <AdminPage zones={zones} setZones={updateZones} orders={orders} setOrders={setOrders} showToast={showToast} onLogout={()=>setAdminAuthed(false)}/>
          : <AdminLogin onSuccess={()=>setAdminAuthed(true)}/>
      }
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

// ╔══════════════════════════════════════════════════════════╗
// ║  後台登入頁                                              ║
// ╚══════════════════════════════════════════════════════════╝
function AdminLogin({ onSuccess }) {
  const [pwd, setPwd]   = useState("");
  const [err, setErr]   = useState(false);
  const [shake, setShake] = useState(false);

  const login = () => {
    if (pwd === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setErr(true);
      setShake(true);
      setPwd("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card" style={shake?{animation:"shake .4s ease"}:{}}>
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`}</style>
        <div className="login-icon">🔐</div>
        <div className="login-title">後台管理</div>
        <div className="login-sub">請輸入管理員密碼</div>
        <input
          className="login-input"
          type="password"
          placeholder="••••••"
          value={pwd}
          onChange={e=>{ setPwd(e.target.value); setErr(false); }}
          onKeyDown={e=>e.key==="Enter"&&login()}
          autoFocus
        />
        <button className="login-btn" onClick={login}>進入後台</button>
        {err && <div className="login-err">❌ 密碼錯誤，請再試一次</div>}
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════╗
// ║  DeadlineBanner                                         ║
// ╚══════════════════════════════════════════════════════════╝
function DeadlineBanner() {
  const { deadline, isClosed, isWarning, hours, mins, secs } = useDeadlineStatus();
  const cls  = isClosed ? "closed" : isWarning ? "warning" : "open";
  const icon = isClosed ? "🔒" : isWarning ? "⚠️" : "🕗";
  const fmt  = deadline.toLocaleString("zh-TW",{month:"numeric",day:"numeric",weekday:"short",hour:"2-digit",minute:"2-digit"});
  return (
    <div className={`deadline-banner ${cls}`}>
      <div className="dl-icon">{icon}</div>
      <div className="dl-text">
        <div className="dl-title">{isClosed?"本週收單已截止":isWarning?"即將截止，請盡快下單！":"收單進行中"}</div>
        <div className="dl-sub">截止時間：{fmt}</div>
      </div>
      <div className="dl-countdown">
        {isClosed
          ? <div className="dl-time">已截止</div>
          : <div className="dl-time">{String(hours).padStart(2,"0")}:{String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}</div>
        }
        <div className="dl-label">{isClosed?"":"剩餘時間"}</div>
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════╗
// ║  訂購頁                                                  ║
// ╚══════════════════════════════════════════════════════════╝
function OrderPage({ zones, onOrder }) {
  const [cart, setCart] = useState({});
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const { isClosed } = useDeadlineStatus();

  const change = (id,delta) => setCart(p=>{
    const v=Math.max(0,(p[id]||0)+delta);
    if(v===0){const n={...p};delete n[id];return n;}
    return {...p,[id]:v};
  });

  const allItems = zones.flatMap(z=>z.items.filter(i=>i.active!==false));
  const cartItems = Object.entries(cart)
    .map(([id,qty])=>{const p=allItems.find(x=>x.id===id);return p?{...p,qty}:null;})
    .filter(Boolean);

  const submit = async () => {
    if (!name.trim()){alert("請輸入姓名");return;}
    if (!cartItems.length){alert("請選擇至少一項");return;}
    setSending(true);
    await onOrder({name:name.trim(),note:note.trim(),items:cartItems,week:getWeekLabel(),isLate:isClosed});
    setSending(false);
    setDone(true);
  };

  if (done) return (
    <div className="pg"><div className="suc">
      <div className="suc-icon">{isClosed?"⚠️":"🎉"}</div>
      <div className="suc-title">{isClosed?"訂單已送出（逾期）":"感謝您的訂購！"}</div>
      <div className="suc-sub">{name} 您好，訂單已收到。{isClosed?"此訂單為截止後送出，管理員會另行確認。":"我們會盡快確認。"}</div>
      <button className="back-btn" onClick={()=>{setDone(false);setCart({});setName("");setNote("");}}>繼續訂購</button>
    </div></div>
  );

  return (
    <div className="pg">
      <DeadlineBanner/>
      <div className="wk-banner">
        <div>
          <div className="wk-title">📅 {getWeekLabel()} 預訂單</div>
          <div className="wk-sub" style={{display:"flex",flexDirection:"column",gap:3,marginTop:4}}>
            <span>🚚 到貨日：{getArrivalDate()}（可當天取貨或配送）</span>
            <span>⏰ 收單截止：{getDeadlineDate()} 晚上 8:00</span>
          </div>
        </div>
        <div className="wk-note">※價格僅供參考<br/>會隨市價調整</div>
      </div>

      {zones.map(zone=>{
        const active=zone.items.filter(i=>i.active!==false);
        if(!active.length) return null;
        return (
          <div key={zone.id} className={`zone-wrap ${zone.cls}`}>
            <div className="zone-head">
              <span className="zone-icon">{zone.icon}</span>
              <span className="zone-label">【{zone.label}】</span>
              <div className="zone-line"/>
            </div>
            <div className="pgrid">
              {active.map(p=>(
                <div key={p.id} className={`pcard ${cart[p.id]?"sel":""}`}>
                  <div className="pcard-icon">{p.emoji}</div>
                  <div className="pcard-name">{p.name}</div>
                  {p.price&&<div className="pcard-price">NT$ {p.price} / {p.unit}</div>}
                  {p.note&&<div className="pcard-note">⚠ {p.note}</div>}
                  <div className="qty-row">
                    <button className="qbtn" onClick={()=>change(p.id,-1)}>−</button>
                    <span className="qnum">{cart[p.id]||0}</span>
                    <button className="qbtn" onClick={()=>change(p.id,+1)}>+</button>
                    <span className="unit-tag">{p.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="oform">
        <div className="oform-title">🧾 確認訂單</div>
        {isClosed&&<div className="late-warn-box">⚠️ 本週收單已截止（週四 20:00），此訂單將標記為「逾期」，請聯絡管理員確認是否受理。</div>}
        <div className="cart-box">
          {!cartItems.length
            ? <div className="cart-empty">尚未選擇品項</div>
            : cartItems.map(i=>(
              <div key={i.id} className="cart-row">
                <span>{i.emoji} {i.name}</span>
                <span style={{fontWeight:600,color:"var(--leaf)"}}>× {i.qty} {i.unit}</span>
              </div>
            ))
          }
        </div>
        <div className="frow">
          <div className="fg">
            <label className="fl">姓名 *</label>
            <input className="fi" placeholder="請輸入您的姓名" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
          <div className="fg"/>
        </div>
        <div className="fg" style={{marginBottom:13}}>
          <label className="fl">備註留言</label>
          <textarea className="fi" placeholder="例：取貨時間、特殊需求…" value={note} onChange={e=>setNote(e.target.value)}/>
        </div>
        <button className="sub-btn" onClick={submit} disabled={!cartItems.length||!name.trim()||sending}>
          {sending?"⏳ 送出中…":isClosed?"⚠️ 逾期送出訂單":"確認送出訂單"}
        </button>
      </div>
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════╗
// ║  後台頁                                                  ║
// ╚══════════════════════════════════════════════════════════╝
function AdminPage({ zones, setZones, orders, setOrders, showToast, onLogout }) {
  const [tab, setTab] = useState("orders");
  const [loadingOrders, setLoadingOrders] = useState(false);

  // 從 Google Sheets 讀取訂單
  const fetchOrders = async () => {
    if (!GOOGLE_SHEET_URL || GOOGLE_SHEET_URL.includes("貼上你的")) return;
    setLoadingOrders(true);
    try {
      const url = GOOGLE_SHEET_URL + "?action=getOrders";
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.status === "ok" && data.orders) {
        const parsed = data.orders.map(o => ({
          ...o,
          items: (o.itemsRaw || "").split("、").filter(Boolean).map(s => {
            const match = s.match(/^(.+?)×(\d+)(.+)$/);
            return match
              ? { name: match[1], qty: parseInt(match[2]), unit: match[3], emoji: "🥗" }
              : { name: s, qty: 1, unit: "", emoji: "🥗" };
          })
        }));
        setOrders(parsed.reverse());
        showToast(`✅ 已載入 ${parsed.length} 筆訂單`);
      }
    } catch(e) {
      showToast("❌ 讀取訂單失敗", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  // 進入後台自動載入
  useEffect(() => { fetchOrders(); }, []);

  const itemTotals = {};
  orders.forEach(o=>o.items.forEach(i=>{
    if(!itemTotals[i.name]) itemTotals[i.name]={qty:0,unit:i.unit,emoji:i.emoji||"🥗"};
    itemTotals[i.name].qty+=i.qty;
  }));
  const topItem   = Object.entries(itemTotals).sort((a,b)=>b[1].qty-a[1].qty)[0];
  const lateCount = orders.filter(o=>o.isLate).length;

  return (
    <div className="pg">
      <DeadlineBanner/>
      <div className="stats">
        <div className="scard"><div className="snum">{orders.length}</div><div className="slabel">本週訂單</div></div>
        <div className="scard"><div className="snum" style={lateCount>0?{color:"var(--red)"}:{}}>{lateCount}</div><div className="slabel">逾期訂單</div></div>
        <div className="scard"><div className="snum" style={{fontSize:"1.1rem"}}>{topItem?`${topItem[1].emoji}${topItem[0]}`:"—"}</div><div className="slabel">最熱門品項</div></div>
      </div>
      <div className="atabs">
        <button className={`atab ${tab==="orders"?"on":""}`} onClick={()=>setTab("orders")}>📋 訂單列表</button>
        <button className={`atab ${tab==="stock"?"on":""}`}  onClick={()=>setTab("stock")}>📦 庫存調配</button>
        <button className={`atab ${tab==="update"?"on":""}`} onClick={()=>setTab("update")}>🤖 更新品項</button>
        <button className={`atab ${tab==="items"?"on":""}`}  onClick={()=>setTab("items")}>🥦 品項管理</button>
        <button className="atab" style={{color:"var(--leaf)",borderColor:"#cde0c8"}} onClick={fetchOrders} disabled={loadingOrders}>
          {loadingOrders ? "⏳" : "🔄 重新整理"}
        </button>
        <button className="atab" style={{marginLeft:"auto",color:"var(--red)",borderColor:"#fde8e6"}} onClick={onLogout}>🔓 登出</button>
      </div>
      {tab==="orders" && <OrdersTab orders={orders} setOrders={setOrders} itemTotals={itemTotals} showToast={showToast}/>}
      {tab==="stock"  && <StockTab  orders={orders}/>}
      {tab==="update" && <UpdateTab zones={zones} setZones={setZones} showToast={showToast}/>}
      {tab==="items"  && <ItemsTab  zones={zones} setZones={setZones} showToast={showToast}/>}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════╗
// ║  訂單列表                                                ║
// ╚══════════════════════════════════════════════════════════╝
function OrdersTab({ orders, setOrders, itemTotals, showToast }) {
  const [search,   setSearch]   = useState("");
  const [lateOnly, setLateOnly] = useState(false);
  const [exporting,setExporting]= useState(false);
  const [delTarget, setDelTarget] = useState(null); // 要刪除的訂單
  const [deleting,  setDeleting]  = useState(false);

  const filtered = orders.filter(o=>
    (!lateOnly||o.isLate)&&
    (o.name.includes(search)||o.items.some(i=>i.name.includes(search)))
  );

  // 刪除訂單
  const confirmDelete = async () => {
    if (!delTarget) return;
    setDeleting(true);
    try {
      const url = `${GOOGLE_SHEET_URL}?action=deleteOrder&rowId=${delTarget.id}`;
      await fetch(url, { mode: "no-cors" });
      // 從本地移除
      setOrders(prev => prev.filter(o => o.id !== delTarget.id));
      showToast("✅ 訂單已刪除");
    } catch(e) {
      showToast("❌ 刪除失敗，請到 Google Sheets 手動刪除", "error");
    } finally {
      setDeleting(false);
      setDelTarget(null);
    }
  };

  const exportCSV = () => {
    setExporting(true);
    try {
      const week = getWeekLabel();
      const rows = [["#","姓名","品項","數量","單位","備註","訂購時間","週次","狀態"]];
      filtered.forEach((o,oi)=>{
        o.items.forEach((item,ii)=>{
          rows.push([
            ii===0?filtered.length-oi:"",
            ii===0?o.name:"",
            item.name, item.qty, item.unit,
            ii===0?(o.note||""):"",
            ii===0?o.time:"",
            ii===0?week:"",
            ii===0?(o.isLate?"逾期":"正常"):"",
          ]);
        });
      });
      rows.push([],["【品項彙整】"],["品項","合計數量","單位"]);
      Object.entries(itemTotals).sort((a,b)=>b[1].qty-a[1].qty).forEach(([name,d])=>{
        rows.push([name,d.qty,d.unit]);
      });
      const safe = week.replace(/\s/g,"").replace(/[（）–\/\\:*?"<>|]/g,"-");
      downloadCSV(`鮮採直送訂單_${safe}.csv`, rows);
      showToast("✅ 匯出成功！用 Excel 開啟 CSV 即可");
    } catch(e){ showToast("❌ 匯出失敗："+e.message,"error"); }
    finally { setExporting(false); }
  };

  return (
    <div>
      {Object.keys(itemTotals).length>0&&(
        <div className="summary-wrap">
          <div className="summary-title">📊 本週品項訂購彙整</div>
          <div className="summary-chips">
            {Object.entries(itemTotals).sort((a,b)=>b[1].qty-a[1].qty).map(([name,d])=>(
              <div key={name} className="s-chip">
                <span>{d.emoji}</span><span>{name}</span>
                <span className="s-chip-qty">{d.qty} {d.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="filter-row">
        <input className="search-fi" placeholder="🔍 搜尋姓名或品項…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:".82rem",color:"var(--red)",cursor:"pointer",userSelect:"none"}}>
          <input type="checkbox" checked={lateOnly} onChange={e=>setLateOnly(e.target.checked)} style={{accentColor:"var(--red)",width:14,height:14}}/>
          只看逾期
        </label>
        <span className="count-tag">共 {filtered.length} 筆</span>
        <button className="export-btn" onClick={exportCSV} disabled={exporting||filtered.length===0}>
          {exporting?"⏳ 匯出中…":"📥 匯出 CSV"}
        </button>
      </div>
      {filtered.length===0
        ? <div className="otable-wrap"><div className="no-data"><div style={{fontSize:"2rem",marginBottom:8}}>📭</div>尚無訂單</div></div>
        : <div className="otable-wrap">
            <table className="otable">
              <thead><tr>
                <th style={{width:36}}>#</th><th>姓名</th><th>訂購品項</th><th>備註</th><th>時間</th><th>狀態</th><th style={{width:48}}></th>
              </tr></thead>
              <tbody>
                {filtered.map((o,i)=>(
                  <tr key={o.id} className={o.isLate?"late-row":""}>
                    <td style={{color:"var(--ink3)",fontWeight:600}}>{filtered.length-i}</td>
                    <td style={{fontWeight:700,whiteSpace:"nowrap"}}>{o.name}{o.isLate&&<span className="late-tag">逾期</span>}</td>
                    <td>{o.items.map(it=><span key={it.id||it.name} className="itag">{it.emoji}{it.name}×{it.qty}</span>)}</td>
                    <td style={{color:"var(--ink2)",fontSize:".81rem"}}>{o.note||"—"}</td>
                    <td style={{color:"var(--ink3)",fontSize:".77rem",whiteSpace:"nowrap"}}>{o.time}</td>
                    <td>{o.isLate?<span className="late-tag-sm">⚠ 逾期</span>:<span style={{color:"var(--leaf)",fontSize:".77rem",fontWeight:600}}>✓ 正常</span>}</td>
                    <td>
                      <button className="icon-btn d" title="刪除此訂單" onClick={()=>setDelTarget(o)}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }

      {/* 刪除確認對話框 */}
      {delTarget && (
        <div className="del-confirm" onClick={()=>!deleting&&setDelTarget(null)}>
          <div className="del-card" onClick={e=>e.stopPropagation()}>
            <div className="del-icon">🗑️</div>
            <div className="del-title">確定要刪除這筆訂單？</div>
            <div className="del-sub">
              <strong>{delTarget.name}</strong> 的訂單將從 Google Sheets 永久刪除，此動作無法復原。
            </div>
            <div className="del-btns">
              <button className="del-btn-cancel" onClick={()=>setDelTarget(null)} disabled={deleting}>取消</button>
              <button className="del-btn-confirm" onClick={confirmDelete} disabled={deleting}>
                {deleting ? "刪除中…" : "確定刪除"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════╗
// ║  AI 圖片更新品項                                         ║
// ╚══════════════════════════════════════════════════════════╝
function UpdateTab({ zones, setZones, showToast }) {
  const [dragging,    setDragging]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [diff,        setDiff]        = useState(null);
  const [checked,     setChecked]     = useState({});
  const [imgPreview,  setImgPreview]  = useState(null);
  const fileRef = useRef();
  const allItems = zones.flatMap(z=>z.items);

  const handleFile = async file => {
    if (!file) return;
    setLoading(true); setDiff(null); setChecked({});
    const reader=new FileReader();
    reader.onload=e=>setImgPreview(e.target.result);
    reader.readAsDataURL(file);
    try {
      const base64=await new Promise((res,rej)=>{
        const r=new FileReader();
        r.onload=()=>res(r.result.split(",")[1]);
        r.onerror=()=>rej(new Error("讀取失敗"));
        r.readAsDataURL(file);
      });
      const resp=await fetch("/api/analyze",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ base64, mediaType: file.type||"image/jpeg" })
      });
      const data=await resp.json();
      const text=data.content?.map(c=>c.text||"").join("")||"";
      let parsed;
      try{parsed=JSON.parse(text.replace(/```json|```/g,"").trim());}
      catch{throw new Error("AI 解析失敗，請換一張更清晰的圖片");}
      if(!parsed?.items?.length) throw new Error("未能辨識到品項");

      const diffItems=parsed.items.map(item=>{
        const exists=allItems.find(p=>p.name===item.name||p.name.replace(/\s/g,"")===item.name.replace(/\s/g,""));
        return{
          id:exists?exists.id:`new_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          name:item.name,unit:item.unit||"份",price:item.price||null,
          zone:item.zone||"leaf",emoji:exists?.emoji||guessEmoji(item.name),
          status:exists?"exist":"new",
        };
      });
      const scannedNames=new Set(parsed.items.map(i=>i.name));
      const missing=allItems.filter(p=>p.active!==false&&!scannedNames.has(p.name)).map(p=>({...p,status:"removed"}));
      const allDiff=[...diffItems,...missing];
      setDiff(allDiff);
      const init={};
      allDiff.forEach(i=>{init[i.id]=i.status==="new";});
      setChecked(init);
    }catch(e){showToast("❌ "+e.message,"error");}
    finally{setLoading(false);}
  };

  const applyChanges = async () => {
    if(!diff) return;
    let addC=0, rmC=0;
    let nz = zones.map(z=>({...z, items:[...z.items]}));

    diff.forEach(item=>{
      if(!checked[item.id]) return;
      if(item.status==="new"){
        const zi=nz.findIndex(z=>z.id===item.zone);
        const target = zi>=0?zi:0;
        // 先確認沒有同名品項才新增
        const alreadyExists = nz[target].items.some(p=>p.name===item.name);
        if(!alreadyExists){
          nz[target].items.push({id:item.id,name:item.name,emoji:item.emoji,unit:item.unit,price:item.price||null,active:true});
          addC++;
        }
      }else if(item.status==="removed"){
        nz=nz.map(z=>({...z,items:z.items.map(p=>p.id===item.id?{...p,active:false}:p)}));
        rmC++;
      }
    });

    // 去除所有重複品項（保留第一個）
    nz = nz.map(z=>{
      const seen = new Set();
      const deduped = z.items.filter(p=>{
        if(seen.has(p.name)) return false;
        seen.add(p.name);
        return true;
      });
      return {...z, items: deduped};
    });

    await setZones(nz);
    showToast(`✅ 已新增 ${addC} 項，下架 ${rmC} 項`);
    setDiff(null); setChecked({}); setImgPreview(null);
  };
    // 呼叫 updateZones（會同時更新畫面、快取、Sheets）
    await setZones(nz);
    showToast(`✅ 已新增 ${addC} 項，下架 ${rmC} 項`);
    setDiff(null); setChecked({}); setImgPreview(null);
  };

  const newC=diff?.filter(i=>i.status==="new"&&checked[i.id]).length||0;
  const rmC =diff?.filter(i=>i.status==="removed"&&checked[i.id]).length||0;

  return (
    <div className="ai-panel">
      <div className="ai-panel-title">🤖 上傳本週訂單圖片，AI 自動比對更新品項</div>
      <div className={`upload-zone ${dragging?"drag":""}`}
        onClick={()=>fileRef.current?.click()}
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}>
        {imgPreview
          ? <img src={imgPreview} alt="preview" style={{maxHeight:180,maxWidth:"100%",borderRadius:8,marginBottom:8}}/>
          : <div className="upload-icon">📷</div>}
        <div className="upload-text">{imgPreview?"點擊重新上傳":"點擊或拖曳上傳訂單圖片"}</div>
        <div className="upload-hint">支援 JPG / PNG</div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
      {loading&&<div className="ai-loading"><div className="spinner"/><span>AI 正在辨識圖片…</span></div>}
      {diff&&!loading&&(
        <div className="diff-panel">
          <div className="diff-title">📋 辨識結果（共 {diff.length} 項）— 勾選要執行的變更後按「套用」</div>
          {[
            {status:"new",     label:"＋ 新品項",          cls:"new-item",     bc:"badge-new",    bt:"新增"},
            {status:"exist",   label:"✓ 既有品項",          cls:"exist-item",   bc:"badge-exist",  bt:"已存在"},
            {status:"removed", label:"− 本週無此品項",       cls:"removed-item", bc:"badge-remove", bt:"下架?"},
          ].map(g=>{
            const items=diff.filter(i=>i.status===g.status);
            if(!items.length) return null;
            return(
              <div key={g.status} style={{marginBottom:12}}>
                <div style={{fontSize:".76rem",fontWeight:700,margin:"10px 0 6px",padding:"3px 10px",
                  background:g.status==="new"?"#e8f9e4":g.status==="removed"?"#fef0ed":"#f4f4f4",
                  color:g.status==="new"?"#2d7a28":g.status==="removed"?"var(--red)":"#888",
                  borderRadius:6,display:"inline-block"}}>{g.label}</div>
                <div className="diff-list">
                  {items.map(item=>(
                    <div key={item.id} className={`diff-item ${g.cls}`}>
                      <span className="diff-emoji-big">{item.emoji}</span>
                      <div className="diff-info">
                        <div className="diff-name">{item.name}</div>
                        <div className="diff-meta">{g.status==="exist"?"無需變更":g.status==="removed"?"勾選可下架":`單位：${item.unit}${item.price?` ／ NT$${item.price}`:""}`}</div>
                      </div>
                      <span className={`diff-badge ${g.bc}`}>{g.bt}</span>
                      {g.status!=="exist"&&(
                        <button className={`diff-toggle ${checked[item.id]?"checked":"unchecked"}`} onClick={()=>setChecked(p=>({...p,[item.id]:!p[item.id]}))}>
                          {checked[item.id]?"✓":"○"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <button className="apply-btn" onClick={applyChanges}>套用變更（新增 {newC} 項・下架 {rmC} 項）</button>
        </div>
      )}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════╗
// ║  品項管理                                                ║
// ╚══════════════════════════════════════════════════════════╝
function ItemsTab({ zones, setZones, showToast }) {
  const toggle = (zid, iid) => {
    const nz = zones.map(z=>z.id!==zid?z:{...z,items:z.items.map(p=>p.id!==iid?p:{...p,active:p.active===false})});
    setZones(nz);
  };
  const del = (zid, iid) => {
    const nz = zones.map(z=>z.id!==zid?z:{...z,items:z.items.filter(p=>p.id!==iid)});
    setZones(nz);
    showToast("已刪除品項");
  };
  return(
    <div className="pm-list">
      {zones.map(z=>z.items.map(p=>(
        <div key={p.id} className="pm-item">
          <span className="pm-emoji">{p.emoji}</span>
          <div className="pm-info">
            <div className="pm-name">{p.name}</div>
            <div className="pm-meta">{p.unit}{p.price?` ／ NT$${p.price}`:""}</div>
          </div>
          <span className="pm-zone">{z.label}</span>
          <span className={`pill ${p.active===false?"pill-off":"pill-on"}`}>{p.active===false?"下架":"上架"}</span>
          <button className="icon-btn" onClick={()=>toggle(z.id,p.id)}>{p.active===false?"▶️":"⏸"}</button>
          <button className="icon-btn d" onClick={()=>del(z.id,p.id)}>🗑</button>
        </div>
      )))}
    </div>
  );
}

// ╔══════════════════════════════════════════════════════════╗
// ║  庫存調配                                                ║
// ╚══════════════════════════════════════════════════════════╝
function StockTab({ orders }) {
  const [actuals, setActuals] = useState({});

  if (!orders.length) return (
    <div className="stock-panel">
      <div className="stock-empty">
        <div style={{fontSize:"2rem",marginBottom:8}}>📭</div>
        尚無訂單資料，請先載入訂單
      </div>
    </div>
  );

  const customers = [...new Set(orders.map(o => o.name))];
  const itemMap = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      if (!itemMap[item.name]) itemMap[item.name] = { unit: item.unit, customers: {} };
      itemMap[item.name].customers[o.name] = (itemMap[item.name].customers[o.name] || 0) + item.qty;
    });
  });
  const itemNames = Object.keys(itemMap).sort();

  const setActual = (name, val) => {
    setActuals(p => ({ ...p, [name]: val === "" ? "" : parseInt(val) || 0 }));
  };

  const hasShortage = itemNames.some(name => {
    const total = Object.values(itemMap[name].customers).reduce((a,b)=>a+b,0);
    const actual = actuals[name];
    return actual !== "" && actual !== undefined && actual < total;
  });

  // ── 匯出 CSV ──
  const exportCSV = () => {
    const week = getWeekLabel();
    const rows = [];

    // 標題行
    rows.push([`庫存調配表 ${week}`, ...customers.map(()=>""), "", "", ""]);
    rows.push(["品項", ...customers, "合計", "實際到貨", "差額", "狀態"]);

    // 資料行
    itemNames.forEach(name => {
      const data = itemMap[name];
      const total = Object.values(data.customers).reduce((a,b)=>a+b,0);
      const actual = actuals[name];
      const hasActual = actual !== "" && actual !== undefined;
      const diff = hasActual ? actual - total : "";
      const status = !hasActual ? "未填" : diff >= 0 ? "✓ 足夠" : `⚠ 缺 ${Math.abs(diff)} ${data.unit}`;
      rows.push([
        `${name}(${data.unit})`,
        ...customers.map(c => data.customers[c] || 0),
        total,
        hasActual ? actual : "",
        diff,
        status
      ]);
    });

    rows.push([]);
    rows.push(["※ 不足品項需減量名單"]);
    itemNames.forEach(name => {
      const data = itemMap[name];
      const total = Object.values(data.customers).reduce((a,b)=>a+b,0);
      const actual = actuals[name];
      const hasActual = actual !== "" && actual !== undefined;
      const diff = hasActual ? actual - total : null;
      if (!hasActual || diff >= 0) return;
      const shortage = Math.abs(diff);
      const sorted = Object.entries(data.customers).filter(([,q])=>q>0).sort((a,b)=>b[1]-a[1]);
      rows.push([`【${name}】缺 ${shortage} ${data.unit}`, ...sorted.map(([c,q])=>`${c}：${q}${data.unit}`)]);
    });

    const bom = "\uFEFF";
    const csv = bom + rows.map(row =>
      row.map(cell => {
        const s = String(cell ?? "");
        return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g,'""')}"` : s;
      }).join(",")
    ).join("\r\n");
    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safe = week.replace(/\s/g,"").replace(/[（）–\/\\:*?"<>|]/g,"-");
    a.href = url; a.download = `庫存調配表_${safe}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="stock-panel">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <div className="stock-title" style={{marginBottom:0}}>📦 庫存調配表</div>
          <button className="export-btn" onClick={exportCSV}>
            📥 匯出 CSV（可列印）
          </button>
        </div>
        <div className="stock-legend">
          <span>✅ 到貨量足夠</span>
          <span style={{color:"var(--red)"}}>🔴 到貨量不足（需調整）</span>
          <span style={{color:"var(--ink3)"}}>「實際到貨」欄填入後自動計算差額</span>
        </div>
        <div className="stock-table-wrap">
          <table className="stock-table">
            <thead>
              <tr>
                <th className="item-col">品項</th>
                {customers.map(c => <th key={c}>{c}</th>)}
                <th style={{background:"#1e5a1a"}}>合計</th>
                <th style={{background:"#1e5a1a"}}>實際到貨</th>
                <th style={{background:"#1e5a1a"}}>差額</th>
              </tr>
            </thead>
            <tbody>
              {itemNames.map(name => {
                const data = itemMap[name];
                const total = Object.values(data.customers).reduce((a,b)=>a+b,0);
                const actual = actuals[name];
                const hasActual = actual !== "" && actual !== undefined;
                const diff = hasActual ? actual - total : null;
                const isShort = diff !== null && diff < 0;
                return (
                  <tr key={name} className={isShort ? "stock-row-warn" : ""}>
                    <td className="item-col">{name}<span style={{fontSize:".7rem",color:"var(--ink3)",marginLeft:4}}>{data.unit}</span></td>
                    {customers.map(c => (
                      <td key={c}>
                        {data.customers[c]
                          ? <span className="stock-qty" style={isShort&&data.customers[c]?{color:"var(--red)"}:{}}>{data.customers[c]}</span>
                          : <span style={{color:"#ddd"}}>—</span>}
                      </td>
                    ))}
                    <td className="stock-total">{total}</td>
                    <td>
                      <input className="stock-actual-input" type="number" min="0" placeholder="填入"
                        value={actuals[name] ?? ""} onChange={e=>setActual(name,e.target.value)}/>
                    </td>
                    <td className={isShort?"stock-diff-warn":"stock-diff-ok"}>
                      {diff===null?"—":diff>=0?`+${diff} ✓`:`${diff} ⚠`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {hasShortage && (
        <div className="stock-panel" style={{borderLeft:"4px solid var(--red)"}}>
          <div className="stock-title" style={{color:"var(--red)"}}>⚠️ 到貨不足品項 — 需減量名單</div>
          {itemNames.map(name => {
            const data = itemMap[name];
            const total = Object.values(data.customers).reduce((a,b)=>a+b,0);
            const actual = actuals[name];
            const hasActual = actual !== "" && actual !== undefined;
            const diff = hasActual ? actual - total : null;
            if (!hasActual || diff >= 0) return null;
            const shortage = Math.abs(diff);
            const sorted = Object.entries(data.customers).filter(([,q])=>q>0).sort((a,b)=>b[1]-a[1]);
            return (
              <div key={name} style={{marginBottom:16,padding:"12px 14px",background:"#fff8f8",borderRadius:"var(--rs)"}}>
                <div style={{fontWeight:700,fontSize:".9rem",marginBottom:8}}>
                  {name}（訂購 {total}、到貨 {actual}、<span style={{color:"var(--red)"}}>缺 {shortage} {data.unit}</span>）
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {sorted.map(([customer,qty])=>(
                    <div key={customer} style={{background:"#fff",border:"1.5px solid #f5b7ae",borderRadius:8,padding:"5px 12px",fontSize:".82rem"}}>
                      <span style={{fontWeight:700}}>{customer}</span>
                      <span style={{color:"var(--ink3)",marginLeft:6}}>訂 {qty} {data.unit}</span>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:".76rem",color:"var(--ink3)",marginTop:8}}>
                  ↑ 依訂購量排列，建議從訂購量多的客戶開始協商減量
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
