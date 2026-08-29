import React, { Component, useState, useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import {
  ArrowRight, ArrowLeft, Check, Eye, EyeOff, Share2, BookmarkPlus, BookmarkCheck, Minus,
  Globe2,
  Plus, Trash2, Pencil, Home as HomeIcon, LayoutGrid, Settings as SettingsIcon,
  Copy, History as HistoryIcon, Lock, ChevronRight, ChevronDown, Delete, Download,
  Info, Shield, Star, Mail, Bell, Repeat, Zap, Utensils, PiggyBank, TrendingUp, Calendar, Upload,
  ClipboardList, BookOpen, House, Car, BriefcaseBusiness, GraduationCap, ShieldCheck, Heart, Wifi, Lightbulb, Gift, Calculator, Target, CreditCard, Users, Wallet, Receipt, Bus, School, Landmark, CircleDollarSign, UtensilsCrossed, BarChart3
} from "lucide-react";

/* ---------------------------------------------------------
   TOKENS — theme-aware via CSS custom properties
--------------------------------------------------------- */
const INK = "var(--pr-ink)";
const INK_SOFT = "var(--pr-ink-soft)";
const PAPER = "var(--pr-paper)";
const PAPER_DIM = "var(--pr-paper-dim)";
const GOLD = "#16A34A"; // PocketRule primary green
const BRAND_NAVY = "#0B2346";
const BRAND_ORANGE = "#F47A1F";
const CORAL = "#E2574C";
const LINE = "var(--pr-line)";
const MUTED = "var(--pr-muted)";

const INPUT_BG = "var(--pr-input-bg)";
const ACTIVE_TINT = "var(--pr-active-tint)";
const DANGER_BG = "var(--pr-danger-bg)";
const NAV_MUTED = "var(--pr-nav-muted)";

const THEME_VARS = {
  light: {
    "--pr-ink": "#12181B", "--pr-ink-soft": "#16211A", "--pr-paper": "#F7F8F4", "--pr-paper-dim": "#FFFFFF",
    "--pr-line": "#E1E6DF", "--pr-muted": "#69766E", "--pr-input-bg": "#EFF3EE", "--pr-active-tint": "#E8F7ED",
    "--pr-danger-bg": "#FDEDEB", "--pr-nav-muted": "#536159", "--pr-primary-disabled-bg": "#DCE8DF", "--pr-primary-disabled-ink": "#5C6B62",
    "--pr-primary": "#16A34A", "--pr-primary-bright": "#22C55E", "--pr-surface-green": "#E8F7ED",
    "--pr-progress-track": "#D7E1D9", "--pr-progress-text": "#166534",
  },
  dark: {
    "--pr-ink": "#F5F7F5", "--pr-ink-soft": "#E4E9E1", "--pr-paper": "#0B1510", "--pr-paper-dim": "#17221C",
    "--pr-line": "#26352B", "--pr-muted": "#A8B2AB", "--pr-input-bg": "#17221C", "--pr-active-tint": "#123A24",
    "--pr-danger-bg": "#3A211F", "--pr-nav-muted": "#C1CEC5", "--pr-primary-disabled-bg": "#294334", "--pr-primary-disabled-ink": "#B8C9BF",
    "--pr-primary": "#16A34A", "--pr-primary-bright": "#22C55E", "--pr-surface-green": "#123A24",
    "--pr-progress-track": "#3A5A46", "--pr-progress-text": "#22C55E",
  },
};

function resolveIsDark(appearance) {
  if (appearance === "dark") return true;
  if (appearance === "light") return false;
  try { return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches; } catch { return false; }
}

const R_SM = 10;
const R_MD = 14;
const R_LG = 20;
const SHADOW_CARD = "0 8px 24px -20px rgba(0,0,0,0.22)";
const SHADOW_BTN = "0 10px 24px -14px rgba(22,163,74,0.34)";
const GOLD_GRADIENT = "linear-gradient(145deg, #16A34A 0%, #22C55E 100%)";
const HERO_GRADIENT = "linear-gradient(145deg, #16A34A 0%, #22C55E 100%)";

const SEGMENT_COLORS = [
  "#1FA84A", "#3978A8", "#6B7785", "#A18B55",
  "#4F8F78", "#7A8794", "#2E5F8C", "#7B6F5A",
];

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@500;600;700&display=swap');
* { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
html, body, #root { margin: 0; min-height: 100%; }
body { font-family: Inter, sans-serif; background: #050705; }
/* PERMANENT NUMERIC STANDARD: Roboto keeps 0 and 8 clearly distinct. */
input[inputmode="numeric"] { font-family: "Roboto", sans-serif !important; font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1; font-weight: 500; }
button { transition: transform 150ms cubic-bezier(0.2,0.8,0.2,1), opacity 150ms ease, background 150ms ease, border-color 150ms ease; }
button:hover { opacity: 0.97; } button:active { transform: scale(0.985); }
button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline: 2px solid rgba(22,163,74,0.60); outline-offset: 2px; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(113,128,116,0.28); border-radius: 99px; }
button, input, textarea, select { -webkit-appearance: none; }
input, textarea, select { color: var(--pr-ink); background-color: var(--pr-input-bg); caret-color: var(--pr-ink); }
input::placeholder, textarea::placeholder { color: var(--pr-muted); opacity: 1; }
.pr-money { font-family: "Roboto", sans-serif !important; font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1; font-weight: 600; letter-spacing: -0.01em; }
.pr-number { font-family: "Roboto", sans-serif !important; font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1; font-weight: 500; letter-spacing: -0.015em; }
select option { color: var(--pr-ink); background: var(--pr-paper-dim); }
.pr-amount-input { color: #fff !important; font-family: "Roboto", sans-serif !important; background: transparent !important; font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1; }
.pr-amount-input::placeholder { color: transparent; }
.pr-amount-input { caret-color: #FFFFFF !important; }
button { color: inherit; }
@keyframes pr-shake { 10%,90%{transform:translateX(-2px);} 20%,80%{transform:translateX(3px);} 30%,50%,70%{transform:translateX(-5px);} 40%,60%{transform:translateX(5px);} }
.pr-shake { animation: pr-shake 400ms ease; }
@keyframes pr-rise { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.pr-rise { animation: pr-rise 220ms ease both; }
.pr-press:active { transform: scale(.985); }
`;

const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const CURRENCIES = [
  { code: "GEN", name: "No currency", symbol: "" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF " },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh " },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
];


/* ---------------------------------------------------------
   REMINDERS — MONEY RECEIVED / EXPECTED
--------------------------------------------------------- */
const POCKETRULE_REMINDER_ID = 481516;
const POCKETRULE_NOTIFICATION_CHANNEL = "pocketrule-reminders-v2";

// Banner lifecycle is deliberately serialized. Android WebViews can crash if
let pocketRuleBannerRequest = 0;
let pocketRuleBannerVisible = false;
let pocketRuleBannerShowInFlight = null;



  try {
    });

    });

    });

    });

    });
  } catch (error) {
  }
}




const POCKETRULE_REMINDER_TITLE = "Money Reminder";
const POCKETRULE_REMINDER_BODY = "You’re expecting money today. Open PocketRule and decide where it goes.";

function isNativeApp() {
  try { return Capacitor.isNativePlatform(); } catch { return false; }
}

function notificationsSupported() {
  if (isNativeApp()) return true;
  return typeof window !== "undefined" && "Notification" in window;
}

async function requestPocketRuleNotifications() {
  if (isNativeApp()) {
    try {
      const current = await LocalNotifications.checkPermissions();
      if (current.display !== "granted") {
        const requested = await LocalNotifications.requestPermissions();
        if (requested.display !== "granted") return "denied";
      }
      return "granted";
    } catch { return "denied"; }
  }
  if (!notificationsSupported()) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  try { return await Notification.requestPermission(); } catch { return "denied"; }
}

async function ensureExactNotificationAccess({ openSettings = false } = {}) {
  if (!isNativeApp()) return "granted";

  try {
    if (typeof LocalNotifications.checkExactNotificationSetting !== "function") {
      // Older plugin versions do not expose the exact-alarm API. Do not block
      // normal notification scheduling on those versions.
      return "granted";
    }

    const current = await LocalNotifications.checkExactNotificationSetting();
    if (current?.exact_alarm === "granted") return "granted";

    // Only open Android's Alarms & reminders screen after the user explicitly
    // asks to enable reminders. Never launch Settings on app startup.
    if (openSettings && typeof LocalNotifications.changeExactNotificationSetting === "function") {
      const changed = await LocalNotifications.changeExactNotificationSetting();
      return changed?.exact_alarm === "granted" ? "granted" : "denied";
    }

    return "denied";
  } catch (error) {
    console.error("PocketRule exact-alarm check failed:", error);
    return "denied";
  }
}

function reminder24Hour(reminder) {
  const hour = Number(reminder?.hour) || 12;
  return (hour % 12) + (String(reminder?.ampm).toUpperCase() === "PM" ? 12 : 0);
}

function reminderDateValue(reminder) {
  return typeof reminder?.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(reminder.date) ? reminder.date : "";
}

function buildOneTimeReminderDate(reminder) {
  const dateValue = reminderDateValue(reminder);
  if (!dateValue) return null;
  const [year, month, day] = dateValue.split("-").map(Number);
  const date = new Date(year, month - 1, day, reminder24Hour(reminder), 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function cancelPocketRuleReminder() {
  if (!isNativeApp()) return;
  try { await LocalNotifications.cancel({ notifications: [{ id: POCKETRULE_REMINDER_ID }] }); } catch {}
}

async function schedulePocketRuleReminder(reminder, { openSettingsIfNeeded = false } = {}) {
  if (!isNativeApp()) return { ok: false, reason: "web" };
  if (!reminder || reminder.frequency === "off") {
    await cancelPocketRuleReminder();
    return { ok: true, reason: "off" };
  }
  if ((await requestPocketRuleNotifications()) !== "granted") return { ok: false, reason: "permission" };

  const exactAccess = await ensureExactNotificationAccess({ openSettings: openSettingsIfNeeded });
  if (exactAccess !== "granted") return { ok: false, reason: "exact-alarm-permission" };

  try {
    await LocalNotifications.createChannel({
      id: POCKETRULE_NOTIFICATION_CHANNEL,
      name: "Money reminders",
      description: "Reminders for money you expect to receive.",
      importance: 4,
      visibility: 1,
      sound: "pocketrule_reminder.wav",
      vibration: true,
    });
    await cancelPocketRuleReminder();

    let schedule;
    if (reminder.frequency === "once") {
      const at = buildOneTimeReminderDate(reminder);
      if (!at || at.getTime() <= Date.now()) return { ok: false, reason: "invalid-date" };
      schedule = { at, allowWhileIdle: true };
    } else if (reminder.frequency === "daily") {
      schedule = { on: { hour: reminder24Hour(reminder), minute: 0 }, allowWhileIdle: true };
    } else if (reminder.frequency === "weekly") {
      const weekday = { Sunday:1, Monday:2, Tuesday:3, Wednesday:4, Thursday:5, Friday:6, Saturday:7 };
      schedule = { on: { weekday: weekday[String(reminder.day)] || 1, hour: reminder24Hour(reminder), minute: 0 }, allowWhileIdle: true };
    } else if (reminder.frequency === "monthly") {
      schedule = { on: { day: Math.min(31, Math.max(1, Number(reminder.dayOfMonth) || 1)), hour: reminder24Hour(reminder), minute: 0 }, allowWhileIdle: true };
    } else {
      return { ok: false, reason: "unsupported-frequency" };
    }

    const result = await LocalNotifications.schedule({
      notifications: [{
        id: POCKETRULE_REMINDER_ID,
        title: POCKETRULE_REMINDER_TITLE,
        body: POCKETRULE_REMINDER_BODY,
        channelId: POCKETRULE_NOTIFICATION_CHANNEL,
        schedule,
        autoCancel: true,
        sound: "pocketrule_reminder.wav",
        extra: { pocketrule: "money-reminder" },
      }],
    });

    const scheduled = result?.notifications?.length > 0;

    if (!scheduled) {
      return { ok: false, reason: "not-scheduled" };
    }

    // Verify that Android actually has the reminder pending.
    try {
      const pending = await LocalNotifications.getPending();
      const exists = pending?.notifications?.some(
        (notification) => notification.id === POCKETRULE_REMINDER_ID
      );
      if (!exists) return { ok: false, reason: "not-pending" };
    } catch {
      // Scheduling already succeeded; verification is best-effort.
    }

    return { ok: true, reason: "scheduled" };
  } catch (error) {
    console.error("PocketRule reminder scheduling failed:", error);
    return { ok: false, reason: "schedule-failed" };
  }
}

function reminderIsDue(reminder, now = new Date()) {
  if (!reminder || reminder.frequency === "off") return false;
  const hour12 = now.getHours() % 12 || 12;
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  if (Number(reminder.hour) !== hour12 || String(reminder.ampm).toUpperCase() !== ampm) return false;
  if (reminder.frequency === "once") {
    const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
    return reminderDateValue(reminder) === today;
  }
  if (reminder.frequency === "daily") return true;
  if (reminder.frequency === "weekly") {
    const today = now.toLocaleDateString(undefined, { weekday: "long" });
    return String(reminder.day).toLowerCase() === today.toLowerCase();
  }
  if (reminder.frequency === "monthly") return Number(reminder.dayOfMonth) === now.getDate();
  return false;
}

function firePocketRuleReminder() {
  if (!notificationsSupported() || isNativeApp() || Notification.permission !== "granted") return;
  try { new Notification(POCKETRULE_REMINDER_TITLE, { body: POCKETRULE_REMINDER_BODY, tag: "pocketrule-reminder" }); } catch {}
}

const APP_VERSION = "1.18.5";
const STORAGE_KEY = "pocketrule-state-v1";
const ENCRYPTED_STORAGE_KEY = "pocketrule-state-v1-encrypted";
const SECURITY_META_KEY = "pocketrule-security-meta-v1";
const AUTO_LOCK_MS = 5 * 60 * 1000;
const SECURITY_VERSION = 2;
const LEGACY_SECURITY_VERSION = 1;
const PBKDF2_ITERATIONS = 210000;
const MIN_BACKUP_ITERATIONS = 100000;
const MAX_BACKUP_ITERATIONS = 1000000;
const MAX_BACKUP_CIPHERTEXT_BYTES = 5 * 1024 * 1024;
const LEGACY_STORAGE_SALT = new TextEncoder().encode("PocketRule-storage-v1");
async function deriveStorageKey(pin, salt = null) {
  try {
    const effectiveSalt = salt instanceof Uint8Array ? salt : LEGACY_STORAGE_SALT;
    const base=await crypto.subtle.importKey("raw",new TextEncoder().encode(pin),"PBKDF2",false,["deriveKey"]);
    return await crypto.subtle.deriveKey({name:"PBKDF2",salt:effectiveSalt,iterations:PBKDF2_ITERATIONS,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
  } catch { return null; }
}
async function encryptJson(value,pin) {
  try {
    const salt=new Uint8Array(16); crypto.getRandomValues(salt);
    const key=await deriveStorageKey(pin,salt); if(!key)return null;
    const iv=new Uint8Array(12); crypto.getRandomValues(iv);
    const cipher=await crypto.subtle.encrypt({name:"AES-GCM",iv},key,new TextEncoder().encode(JSON.stringify(value)));
    return JSON.stringify({version:SECURITY_VERSION,kdf:"PBKDF2-SHA256",iterations:PBKDF2_ITERATIONS,salt:bytesToHex(salt),iv:bytesToHex(iv),data:bytesToHex(cipher)});
  } catch { return null; }
}
async function encryptBackupWithPassword(value,password) {
  try {
    if (!password || password.length < 8) return null;
    const salt = new Uint8Array(16); crypto.getRandomValues(salt);
    const iv = new Uint8Array(12); crypto.getRandomValues(iv);
    const base = await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveKey"]);
    const key = await crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations:PBKDF2_ITERATIONS,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
    const cipher = await crypto.subtle.encrypt({name:"AES-GCM",iv},key,new TextEncoder().encode(JSON.stringify(value)));
    return JSON.stringify({version:2,kdf:"PBKDF2-SHA256",iterations:PBKDF2_ITERATIONS,salt:bytesToHex(salt),iv:bytesToHex(iv),ciphertext:bytesToHex(cipher)});
  } catch { return null; }
}
async function decryptBackupWithPassword(payload,password) {
  try {
    const x=typeof payload==="string"?JSON.parse(payload):payload;
    if(!x||x.version!==2||x.kdf!=="PBKDF2-SHA256"||!x.salt||!x.iv||!x.ciphertext||!password)return null;
    const salt=hexToBytes(x.salt),iv=hexToBytes(x.iv),cipher=hexToBytes(x.ciphertext);
    const iterations=Number(x.iterations);
    if(!salt||salt.length<16||salt.length>64||!iv||iv.length!==12||!cipher||cipher.length>MAX_BACKUP_CIPHERTEXT_BYTES)return null;
    if(!Number.isInteger(iterations)||iterations<MIN_BACKUP_ITERATIONS||iterations>MAX_BACKUP_ITERATIONS)return null;
    const base=await crypto.subtle.importKey("raw",new TextEncoder().encode(password),"PBKDF2",false,["deriveKey"]);
    const key=await crypto.subtle.deriveKey({name:"PBKDF2",salt,iterations,hash:"SHA-256"},base,{name:"AES-GCM",length:256},false,["encrypt","decrypt"]);
    const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv},key,cipher);
    return JSON.parse(new TextDecoder().decode(plain));
  } catch { return null; }
}
async function decryptJson(payload,pin) {
  try {
    const x=typeof payload==="string"?JSON.parse(payload):payload;
    if(!x||!pin||!x.iv||!x.data)return null;
    const iv=hexToBytes(x.iv),cipher=hexToBytes(x.data);
    if(!iv||iv.length!==12||!cipher||cipher.length>MAX_BACKUP_CIPHERTEXT_BYTES)return null;
    let salt = LEGACY_STORAGE_SALT;
    if(x.version===SECURITY_VERSION) {
      salt=hexToBytes(x.salt);
      if(!salt||salt.length<16||salt.length>64||x.kdf!=="PBKDF2-SHA256"||Number(x.iterations)!==PBKDF2_ITERATIONS)return null;
    } else if(x.version!==LEGACY_SECURITY_VERSION) return null;
    const key=await deriveStorageKey(pin,salt);
    if(!key)return null;
    const plain=await crypto.subtle.decrypt({name:"AES-GCM",iv},key,cipher);
    return JSON.parse(new TextDecoder().decode(plain));
  } catch { return null; }
}

// Portable storage adapter: use the host app storage when available,
// otherwise fall back to standard browser localStorage. This keeps data
// persistent in Chrome, PWAs, and Android WebViews without depending on a
// non-standard window.storage API.
const storageAdapter = {
  async get(key) {
    try {
      if (window.storage?.get) {
        const res = await window.storage.get(key, false);
        if (res?.value != null) return res.value;
      }
    } catch {}
    try { return window.localStorage?.getItem(key) ?? null; } catch { return null; }
  },
  async set(key, value) {
    try {
      if (window.storage?.set) {
        await window.storage.set(key, value, false);
        return true;
      }
    } catch {}
    try { window.localStorage?.setItem(key, value); return true; } catch { return false; }
  },
  async remove(key) {
    try { if (window.storage?.remove) await window.storage.remove(key, false); } catch {}
    try { window.localStorage?.removeItem(key); } catch {}
  },
};

const PRELOADED_RULES = [
  { id: "starter", name: "Starter Split", emoji: "💼", categories: [{name:"Food",pct:30},{name:"Rent",pct:25},{name:"Transport",pct:15},{name:"Savings",pct:20},{name:"Business",pct:10}] },
  { id: "student", name: "Student Budget", emoji: "🎓", categories: [{name:"Feeding",pct:35},{name:"Transport",pct:15},{name:"Data & Airtime",pct:10},{name:"Savings",pct:15},{name:"Personal",pct:15},{name:"Emergency",pct:10}] },
  { id: "family4", name: "Family of 4", emoji: "👨‍👩‍👧‍👦", categories: [{name:"Feeding",pct:30},{name:"Rent",pct:25},{name:"School Fees",pct:15},{name:"Transport",pct:10},{name:"Utilities",pct:10},{name:"Savings",pct:10}] },
  { id: "freelancer", name: "Freelancer Budget", emoji: "💻", categories: [{name:"Business & Tools",pct:20},{name:"Feeding",pct:20},{name:"Savings",pct:20},{name:"Tax Reserve",pct:15},{name:"Rent",pct:15},{name:"Transport",pct:10}] },
  { id: "under100k", name: "Starter Salary", emoji: "💵", categories: [{name:"Feeding",pct:30},{name:"Rent",pct:20},{name:"Transport",pct:15},{name:"Emergency",pct:15},{name:"Savings",pct:10},{name:"Data & Airtime",pct:10}] },
  { id: "above500k", name: "Growing Income", emoji: "💰", categories: [{name:"Savings",pct:25},{name:"Rent",pct:20},{name:"Investment",pct:15},{name:"Feeding",pct:15},{name:"Business",pct:10},{name:"Transport",pct:10},{name:"Giving",pct:5}] },
  { id: "smallbiz", name: "Small Business Owner", emoji: "🏪", categories: [{name:"Inventory & Restock",pct:35},{name:"Personal Salary",pct:20},{name:"Savings",pct:15},{name:"Business Expenses",pct:15},{name:"Tax Reserve",pct:10},{name:"Emergency",pct:5}] },
  { id: "tithing", name: "Tithing & Faith Budget", emoji: "🙏", categories: [{name:"Rent",pct:25},{name:"Feeding",pct:25},{name:"Savings",pct:15},{name:"Tithe",pct:10},{name:"Transport",pct:10},{name:"Emergency",pct:10},{name:"Offering",pct:5}] },
  { id: "rule_50_30_20", name: "50/30/20 Rule", emoji: "⚖️", categories: [{name:"Needs",pct:50},{name:"Wants",pct:30},{name:"Savings & Debt",pct:20}] },
  { id: "rule_70_20_10", name: "70/20/10 Rule", emoji: "📐", categories: [{name:"Living Expenses",pct:70},{name:"Savings",pct:20},{name:"Giving & Debt",pct:10}] },
  { id: "rule_80_20", name: "80/20 Rule (Pay Yourself First)", emoji: "🎯", categories: [{name:"Savings",pct:20},{name:"Everything Else",pct:80}] },
  { id: "rule_60_solution", name: "60% Solution", emoji: "🧮", categories: [{name:"Committed Expenses",pct:60},{name:"Retirement Savings",pct:10},{name:"Long-Term Savings",pct:10},{name:"Short-Term Savings",pct:10},{name:"Fun Money",pct:10}] },
  { id: "rule_ramsey", name: "Dave Ramsey Budget", emoji: "📋", categories: [{name:"Giving",pct:10},{name:"Savings",pct:10},{name:"Housing",pct:25},{name:"Utilities",pct:10},{name:"Food",pct:10},{name:"Transportation",pct:10},{name:"Health & Insurance",pct:15},{name:"Personal & Recreation",pct:10}] },
];

const CATEGORY_EMOJI = {
  tithe: "🏠", tithing: "🏠", offering: "🎁", giving: "🎁",
  saving: "💰", savings: "💰", investment: "📈", "kingdom investment": "🎯",
  food: "🍔", feeding: "🍔", upkeep: "🍔",
  rent: "🏠", housing: "🏠",
  transport: "🚗", fuel: "🚗",
  wife: "❤️", husband: "❤️", family: "❤️", kids: "❤️",
  me: "😊", personal: "😊",
  pastor: "🎯", church: "⛪", kingdom: "🎯",
  business: "🏪", "tax reserve": "🧾", tax: "🧾",
  emergency: "🚨",
  data: "📶", airtime: "📶",
  school: "🎓", fees: "🎓", education: "🎓",
  utilities: "💡",
};
function categoryEmoji(name) {
  const key = (name || "").toLowerCase();
  for (const k in CATEGORY_EMOJI) {
    if (key.includes(k)) return CATEGORY_EMOJI[k];
  }
  return "📊";
}

/* PREMIUM UI FOUNDATION — v1.14 */
const PREMIUM_TRANSITION = "150ms cubic-bezier(0.2,0.8,0.2,1)";
const PREMIUM_CARD_STYLE = { borderRadius: R_LG, border: `1px solid ${LINE}`, boxShadow: "none", background: PAPER_DIM };
const PREMIUM_PRESS_STYLE = { transition: PREMIUM_TRANSITION, WebkitTapHighlightColor: "transparent" };

function PremiumCard({ children, style = {}, ...props }) {
  return <div {...props} style={{ ...PREMIUM_CARD_STYLE, ...PREMIUM_PRESS_STYLE, ...style }}>{children}</div>;
}

function PremiumSectionLabel({ children }) {
  return <p style={{ margin: "0 0 8px 2px", fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.2, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase", color: MUTED }}>{children}</p>;
}

function CategoryIcon({ name, size = 18, color = INK, strokeWidth = 2.1 }) {
  const key = (name || "").toLowerCase();
  let Icon = Wallet;
  if (key.includes("food") || key.includes("feeding")) Icon = UtensilsCrossed;
  else if (key.includes("rent") || key.includes("housing") || key.includes("house")) Icon = House;
  else if (key.includes("transport") || key.includes("fuel")) Icon = Car;
  else if (key.includes("saving") || key.includes("emergency")) Icon = PiggyBank;
  else if (key.includes("invest")) Icon = TrendingUp;
  else if (key.includes("business") || key.includes("inventory")) Icon = BriefcaseBusiness;
  else if (key.includes("school") || key.includes("education") || key.includes("fees")) Icon = GraduationCap;
  else if (key.includes("data") || key.includes("airtime")) Icon = Wifi;
  else if (key.includes("utilit")) Icon = Lightbulb;
  else if (key.includes("giving") || key.includes("offering") || key.includes("tithe")) Icon = Gift;
  else if (key.includes("tax")) Icon = Receipt;
  else if (key.includes("debt") || key.includes("loan") || key.includes("credit")) Icon = CreditCard;
  else if (key.includes("family") || key.includes("personal")) Icon = Users;
  else if (key.includes("goal")) Icon = Target;
  else if (key.includes("health") || key.includes("insurance") || key.includes("protection")) Icon = ShieldCheck;
  else if (key.includes("salary") || key.includes("income")) Icon = CircleDollarSign;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}

function RuleIcon({ rule, size = 21, color = INK }) {
  const id = String(rule?.id || "").toLowerCase();
  const name = String(rule?.name || "").toLowerCase();
  let Icon = Wallet;
  if (id.includes("student") || name.includes("student")) Icon = GraduationCap;
  else if (id.includes("family")) Icon = Users;
  else if (id.includes("freelancer") || id.includes("smallbiz") || name.includes("business")) Icon = BriefcaseBusiness;
  else if (id.includes("tithing") || name.includes("faith")) Icon = Gift;
  else if (id.includes("50_30") || id.includes("70_20") || id.includes("60_solution")) Icon = Calculator;
  else if (id.includes("80_20")) Icon = Target;
  else if (id.includes("ramsey")) Icon = ClipboardList;
  else if (id.includes("above") || name.includes("growing")) Icon = TrendingUp;
  else if (id.includes("under")) Icon = CircleDollarSign;
  return <Icon size={size} color={color} strokeWidth={2.1} />;
}

function ruleDescription(rule) {
  const id = String(rule?.id || "").toLowerCase();
  const name = String(rule?.name || "").toLowerCase();
  if (id === "starter") return "A balanced everyday split for getting started.";
  if (id === "student") return "Built around school, living costs and savings.";
  if (id === "family4") return "A household-first plan for shared expenses.";
  if (id === "freelancer") return "Separates personal needs from freelance costs.";
  if (id === "smallbiz") return "Keeps business cash and personal money intentional.";
  if (id.includes("50_30_20")) return "A classic needs, wants and savings framework.";
  if (id.includes("70_20_10")) return "A simple living, saving and giving split.";
  if (id.includes("80_20")) return "Save first, then plan the rest of your money.";
  if (id.includes("ramsey")) return "A detailed zero-based style budgeting framework.";
  if (name.includes("salary")) return "A practical starting point for a fixed income.";
  if (name.includes("growing")) return "Designed to give higher income more jobs.";
  return "A ready-made money system you can customize.";
}

const GREEN_CARD_GRADIENT = "radial-gradient(120% 90% at 30% 0%, #2FAE5E 0%, #12572E 55%, #0A2E1B 100%)";

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const ICON_TINT_BG = ["#E6F6EA","#F1E8FB","#E4F0FC","#FDECD9","#E1F8F1","#FCE7EC","#FFF6DA","#E8ECFB"];

const QUICK_CATEGORIES = [
  "Rent","Food","Transport","Savings","Tithe","Giving","Business","Emergency",
  "Data & Airtime","Utilities","Offering","Investment","School Fees","Health",
  "Insurance","Debt Repayment","Subscriptions","Entertainment","Clothing",
  "Family Support","Car Maintenance","Internet","Personal","Travel",
];


function detectLikelyCurrency() {
  if (typeof window === "undefined") return "GEN";

  // Prefer the device timezone first. Android phones are often configured
  // with a UK/US language/region while physically being used elsewhere.
  // Timezone is a stronger location signal here and avoids requesting GPS
  // permission during onboarding.
  let timezone = "";
  try { timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch {}

  const timezoneToCurrency = [
    [/^Africa\/Lagos$|^Africa\/Porto-Novo$/, "NGN"],
    [/^Africa\/Accra$/, "GHS"],
    [/^Africa\/Nairobi$/, "KES"],
    [/^Africa\/Johannesburg$|^Africa\/Harare$/, "ZAR"],
    [/^Asia\/Kolkata$|^Asia\/Calcutta$/, "INR"],
    [/^Asia\/Tokyo$/, "JPY"],
    [/^Europe\/London$/, "GBP"],
    [/^Europe\/Zurich$/, "CHF"],
    [/^America\/New_York$|^America\/Chicago$|^America\/Denver$|^America\/Los_Angeles$/, "USD"],
    [/^America\/Toronto$|^America\/Vancouver$/, "CAD"],
    [/^Australia\//, "AUD"],
    [/^Pacific\/Auckland$/, "NZD"],
  ];

  for (const [pattern, code] of timezoneToCurrency) {
    if (pattern.test(timezone)) return code;
  }

  // If the timezone is unavailable/unmapped, fall back to the device locale.
  const locales = [];
  try {
    if (Array.isArray(navigator.languages)) locales.push(...navigator.languages);
    if (navigator.language) locales.push(navigator.language);
  } catch {}

  const regionToCurrency = {
    NG: "NGN", GH: "GHS", KE: "KES", ZA: "ZAR", IN: "INR",
    US: "USD", CA: "CAD", AU: "AUD", NZ: "NZD", GB: "GBP",
    JP: "JPY", CH: "CHF", DE: "EUR", FR: "EUR", ES: "EUR",
    IT: "EUR", NL: "EUR", IE: "EUR", PT: "EUR", AT: "EUR",
  };

  for (const locale of locales) {
    const value = String(locale || "");
    const match = value.match(/[-_]([A-Za-z]{2})$/);
    const region = match ? match[1].toUpperCase() : "";
    if (region && regionToCurrency[region]) return regionToCurrency[region];
  }

  // Some Android WebViews expose only a language tag without the region.
  // Don't guess a currency from language alone; the user can always choose it.
  return "GEN";
}

function defaultState() {
  return {
    onboarded: false,
    settings: {
      currency: detectLikelyCurrency(),
      reminderFrequency: "weekly",
      reminderDate: "",
      reminderDay: "Friday",
      reminderDayOfMonth: 1,
      reminderHour: 12,
      reminderAmpm: "PM",
      pin: null,
      proNoAds: false,
      notificationsEnabled: false,
      reminderPromptSeen: false,
      appearance: "light",
      customCurrencies: [],
    },
    rules: PRELOADED_RULES.map((r) => ({ ...r })),
    history: [],
    plans: [],
    activePlanId: null,
    activeRuleId: "starter",
    lastIncome: "",
    lastPlanName: "",
    notes: "",
  };
}

function getPlanLedgerTotals(plan) {
  const transactions = Array.isArray(plan?.transactions) ? plan.transactions : [];
  const byCategory = {};
  let spent = 0;
  transactions.forEach((tx) => {
    const categoryId = String(tx?.categoryId || "");
    const amount = Math.max(0, Math.round(Number(tx?.amount) || 0));
    if (!categoryId || amount <= 0) return;
    byCategory[categoryId] = (byCategory[categoryId] || 0) + amount;
    spent += amount;
  });
  return { transactions, byCategory, spent };
}

function reconcilePlanSpending(plan, forceLedger = false) {
  if (!plan || !Array.isArray(plan.categories)) return plan;
  const { transactions, byCategory } = getPlanLedgerTotals(plan);
  if (transactions.length === 0 && !forceLedger) return plan;
  return {
    ...plan,
    hasTransactionLedger: true,
    categories: plan.categories.map((c) => ({
      ...c,
      spent: Math.max(0, byCategory[String(c.id)] || 0),
    })),
  };
}


function normalizeSettings(rawSettings, baseSettings) {
  const s = rawSettings && typeof rawSettings === "object" && !Array.isArray(rawSettings)
    ? rawSettings
    : {};

  const rawPin = s.pin;
  let pin = null;

  if (typeof rawPin === "string" && /^\\d{4}$/.test(rawPin)) {
    pin = rawPin;
  } else if (
    rawPin &&
    typeof rawPin === "object" &&
    rawPin.scheme === "pbkdf2-sha256" &&
    Number.isFinite(Number(rawPin.iterations)) &&
    Number(rawPin.iterations) >= 1000 &&
    typeof rawPin.salt === "string" &&
    /^[0-9a-f]+$/i.test(rawPin.salt) &&
    rawPin.salt.length >= 16 &&
    typeof rawPin.hash === "string" &&
    /^[0-9a-f]+$/i.test(rawPin.hash) &&
    rawPin.hash.length === 64
  ) {
    pin = {
      scheme: "pbkdf2-sha256",
      iterations: Number(rawPin.iterations),
      salt: rawPin.salt.toLowerCase(),
      hash: rawPin.hash.toLowerCase(),
    };
  }

  const appearance = ["light", "dark", "system"].includes(s.appearance) ? s.appearance : baseSettings.appearance;
  const reminderFrequency = ["off", "once", "daily", "weekly", "monthly"].includes(s.reminderFrequency)
    ? s.reminderFrequency
    : baseSettings.reminderFrequency;
  const reminderDate = typeof s.reminderDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s.reminderDate)
    ? s.reminderDate
    : (typeof baseSettings.reminderDate === "string" ? baseSettings.reminderDate : "");

  const reminderHourNumber = Number(s.reminderHour);
  const reminderHour = Number.isFinite(reminderHourNumber)
    ? Math.min(12, Math.max(1, Math.round(reminderHourNumber)))
    : baseSettings.reminderHour;

  const reminderDay = typeof s.reminderDay === "string" ? s.reminderDay : baseSettings.reminderDay;
  const reminderDayOfMonthNumber = Number(s.reminderDayOfMonth);
  const reminderDayOfMonth = Number.isFinite(reminderDayOfMonthNumber)
    ? Math.min(31, Math.max(1, Math.round(reminderDayOfMonthNumber)))
    : baseSettings.reminderDayOfMonth;

  const reminderAmpm = s.reminderAmpm === "AM" || s.reminderAmpm === "PM"
    ? s.reminderAmpm
    : baseSettings.reminderAmpm;

  return {
    ...baseSettings,
    ...s,
    currency: typeof s.currency === "string" && s.currency.trim() && s.currency.trim().toUpperCase() !== "GEN" ? s.currency.trim().toUpperCase() : (baseSettings.currency !== "GEN" ? baseSettings.currency : detectLikelyCurrency()),
    reminderFrequency,
    reminderDate,
    reminderDay,
    reminderDayOfMonth,
    reminderHour,
    reminderAmpm,
    pin,
    proNoAds: Boolean(s.proNoAds),
    notificationsEnabled: s.notificationsEnabled === true,
    reminderPromptSeen: s.reminderPromptSeen === true,
    appearance,
    customCurrencies: Array.isArray(s.customCurrencies)
      ? s.customCurrencies
          .filter((c) => c && typeof c === "object" && !Array.isArray(c))
          .map((c) => ({
            name: String(c.name || c.code || "Custom currency"),
            code: String(c.code || "").trim().toUpperCase(),
            symbol: String(c.symbol || "").trim(),
          }))
          .filter((c) => c.code && c.symbol)
      : [],
  };
}

function normalizeState(raw) {
  const base = defaultState();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return base;

  const settings = normalizeSettings(raw.settings, base.settings);

  const sourceRules = Array.isArray(raw.rules) ? raw.rules.filter((r) => r && typeof r === "object" && !Array.isArray(r)) : [];
  const rules = sourceRules.length
    ? sourceRules.map((r, i) => ({
        ...base.rules[0],
        ...r,
        id: String(r.id || uid("rule")),
        name: String(r.name || `Rule ${i + 1}`).slice(0, 120),
        emoji: typeof r.emoji === "string" ? r.emoji.slice(0, 8) : "💼",
        categories: Array.isArray(r.categories) && r.categories.length
          ? r.categories
              .filter((c) => c && typeof c === "object" && !Array.isArray(c))
              .map((c) => ({
                name: String(c.name || "Category"),
                pct: Number.isFinite(Number(c.pct)) ? Number(c.pct) : 0,
              }))
          : [{ name: "Everything", pct: 100 }],
      }))
    : base.rules;

  const history = Array.isArray(raw.history)
    ? raw.history
        .filter((h) => h && typeof h === "object" && !Array.isArray(h))
        .map((h) => ({
          ...h,
          id: String(h.id || uid("h")),
          date: Number(h.date) || Date.now(),
          ruleName: String(h.ruleName || "Money Plan"),
          income: Math.max(0, Math.round(Number(h.income) || 0)),
          categories: Array.isArray(h.categories)
            ? h.categories
                .filter((c) => c && typeof c === "object" && !Array.isArray(c))
                .map((c, i) => ({
                  ...c,
                  id: String(c.id || uid(`hc${i}`)),
                  name: String(c.name || `Category ${i + 1}`),
                  pct: Number(c.pct) || 0,
                  amount: Math.max(0, Math.round(Number(c.amount) || 0)),
                  budget: Math.max(0, Math.round(Number(c.budget) || 0)),
                  spent: Math.max(0, Math.round(Number(c.spent) || 0)),
                }))
            : [],
        }))
    : [];

  const plans = Array.isArray(raw.plans)
    ? raw.plans
        .filter((p) => p && typeof p === "object" && !Array.isArray(p))
        .map((p) => ({
          id: String(p.id || uid("plan")),
          name: String(p.name || p.ruleName || "Money Plan"),
          date: Number(p.date) || Date.now(),
          ruleId: String(p.ruleId || raw.activeRuleId || rules[0].id),
          ruleName: String(p.ruleName || "Money Plan"),
          income: Math.max(0, Math.round(Number(p.income) || 0)),
          currency: String(p.currency || settings.currency || "GEN"),
          categories: Array.isArray(p.categories)
            ? p.categories
                .filter((c) => c && typeof c === "object" && !Array.isArray(c))
                .map((c, i) => ({
                  id: String(c.id || uid(`pc${i}`)),
                  name: String(c.name || `Category ${i + 1}`),
                  pct: Number(c.pct) || 0,
                  budget: Math.max(0, Math.round(Number(c.budget) || 0)),
                  spent: Math.max(0, Math.round(Number(c.spent) || 0)),
                }))
            : [],
          transactions: Array.isArray(p.transactions)
            ? p.transactions
                .filter((t) => t && typeof t === "object" && !Array.isArray(t))
                .map((t) => ({
                  id: String(t.id || uid("tx")),
                  categoryId: String(t.categoryId || ""),
                  amount: Math.max(0, Math.round(Number(t.amount) || 0)),
                  note: String(t.note || ""),
                  date: Number(t.date) || Date.now(),
                }))
            : [],
          hasTransactionLedger: Boolean(p.hasTransactionLedger),
          status: p.status === "completed" ? "completed" : "active",
        }))
    : [];

  const reconciledPlans = plans.map((p) => {
    const hasTransactions = Array.isArray(p.transactions) && p.transactions.length > 0;
    return reconcilePlanSpending(
      { ...p, hasTransactionLedger: p.hasTransactionLedger || hasTransactions },
      hasTransactions
    );
  });

  const requestedRuleId = String(raw.activeRuleId || "");
  const activeRuleId = rules.some((r) => String(r.id) === requestedRuleId)
    ? requestedRuleId
    : String(rules[0].id);

  const requestedPlanId = String(raw.activePlanId || "");
  const activePlanId = reconciledPlans.some(
    (p) => String(p.id) === requestedPlanId && p.status === "active"
  )
    ? requestedPlanId
    : null;

  return {
    ...base,
    ...raw,
    onboarded: Boolean(raw.onboarded),
    settings,
    rules,
    history,
    plans: reconciledPlans,
    activePlanId,
    activeRuleId,
    lastIncome: typeof raw.lastIncome === "string" ? raw.lastIncome : "",
    lastPlanName: typeof raw.lastPlanName === "string" ? raw.lastPlanName : "",
    notes: typeof raw.notes === "string" ? raw.notes : "",
  };
}

function calculateCategories(income, categories) {
  const totalUnits = Math.max(0, Math.round(Number(income) || 0));
  const rows = (categories || []).map((c, index) => {
    const exact = totalUnits * (Number(c.pct) || 0) / 100;
    const base = Math.floor(exact);
    return { c, index, exact, amount: base, fraction: exact - base };
  });
  let remainder = totalUnits - rows.reduce((sum, r) => sum + r.amount, 0);
  const ranked = [...rows].sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  if (remainder > 0 && ranked.length > 0) {
    // Distribute every remaining unit so even legacy rules whose percentages
    // do not add to exactly 100% still reconcile to the entered amount.
    for (let i = 0; i < remainder; i += 1) ranked[i % ranked.length].amount += 1;
  } else if (remainder < 0 && ranked.length > 0) {
    // If a legacy rule totals above 100%, remove units from the smallest
    // fractional allocations until the total reconciles without negatives.
    const removable = [...ranked].reverse();
    let remainingToRemove = Math.abs(remainder);
    let cursor = 0;
    while (remainingToRemove > 0 && cursor < removable.length * 2) {
      const row = removable[cursor % removable.length];
      if (row.amount > 0) { row.amount -= 1; remainingToRemove -= 1; }
      cursor += 1;
    }
  }
  return rows.map((r) => ({ ...r.c, amount: Math.max(0, r.amount) }));
}

function allocationTotal(income, categories) {
  return calculateCategories(income, categories).reduce((sum, c) => sum + c.amount, 0);
}

function withColors(categories) {
  return categories.map((c, i) => ({
    id: c.id || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + i,
    name: c.name,
    pct: c.pct,
    color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
  }));
}

function currencySymbol(code) {
  return (CURRENCIES.find((c) => c.code === code) || CURRENCIES[0]).symbol;
}

function currencyLabel(c) {
  if (!c) return "No currency";
  const sym = (c.symbol || "").trim();
  const name = c.name || c.code || "Currency";
  return sym ? `${name} · ${sym}` : name;
}

function registerCustomCurrency(entry) {
  if (!entry || !entry.code) return;
  const normalized = { ...entry, name: entry.name || entry.code };
  if (!CURRENCIES.some((c) => c.code === normalized.code)) {
    CURRENCIES.push(normalized);
  }
}

function formatMoney(n, code) {
  const v = Math.round(n || 0);
  const symbol = currencySymbol(code);
  return (symbol ? symbol : "") + v.toLocaleString("en-US");
}

function uid(prefix) {
  return prefix + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

function ruleSignature(rule, income) {
  if (!rule) return null;
  return `${rule.id}|${income}|${rule.categories.map((c) => `${c.name}:${c.pct}`).join(",")}`;
}

function bytesToHex(bytes) { return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, "0")).join(""); }
function hexToBytes(hex) { if (typeof hex !== "string" || hex.length % 2) return null; const out = new Uint8Array(hex.length / 2); for (let i=0;i<out.length;i++) { const v=Number.parseInt(hex.slice(i*2,i*2+2),16); if(!Number.isFinite(v)) return null; out[i]=v; } return out; }
function timingSafeEqual(a,b) { if(typeof a!=="string"||typeof b!=="string"||a.length!==b.length)return false; let d=0; for(let i=0;i<a.length;i++) d|=a.charCodeAt(i)^b.charCodeAt(i); return d===0; }
async function legacyHashPin(pin) { try { return bytesToHex(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(pin))); } catch { return null; } }
async function derivePinVerifier(pin,saltHex,iterations=210000) { try { const salt=saltHex?hexToBytes(saltHex):(()=>{const b=new Uint8Array(16);crypto.getRandomValues(b);return b;})(); if(!salt)return null; const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(pin),"PBKDF2",false,["deriveBits"]); const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt,iterations,hash:"SHA-256"},key,256); return {scheme:"pbkdf2-sha256",iterations,salt:bytesToHex(salt),hash:bytesToHex(bits)}; } catch { return null; } }
async function verifyPin(pin,stored) { if(!stored)return false; if(typeof stored==="string")return timingSafeEqual(await legacyHashPin(pin),stored); if(stored.scheme!=="pbkdf2-sha256")return false; const d=await derivePinVerifier(pin,stored.salt,stored.iterations); return Boolean(d&&timingSafeEqual(d.hash,stored.hash)); }

/* ---------------------------------------------------------
   LOGO MARK
--------------------------------------------------------- */
function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-label="PocketRule logo">
      <g transform="rotate(-7 50 38)">
        <rect x="29" y="8" width="45" height="47" rx="7" fill="#BFE7C9" stroke={BRAND_NAVY} strokeWidth="5" />
        <circle cx="51.5" cy="30" r="10" fill={GOLD} />
        <path d="M47 30h9M51.5 25.5v9" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <path d="M18 37v38l32 18 32-18V37" fill={BRAND_NAVY} stroke={BRAND_NAVY} strokeWidth="5" strokeLinejoin="round" />
      <path d="M18 43c10 7 22 10 32 10s22-3 32-10" stroke={BRAND_ORANGE} strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" />
      <rect x="81" y="48" width="7" height="13" rx="2" fill={BRAND_ORANGE} />
    </svg>
  );
}

/* ---------------------------------------------------------
   TOTAL CARD — clear percentage + progress + status,
   the one authoritative place a Rule tells you it's ready.
--------------------------------------------------------- */
function TotalCard({ total }) {
  const complete = total === 100;
  const over = total > 100;
  const barPct = Math.min(total, 100);
  return (
    <div style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: R_LG, padding: 16, boxShadow: "none", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={labelStyle}>Total</span>
        <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.02em", color: over ? CORAL : complete ? GOLD : INK }}>{total}%</span>
      </div>
      <div style={{ height: 8, background: LINE, borderRadius: 999, marginTop: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${barPct}%`, background: over ? CORAL : GOLD, borderRadius: 999, transition: "width 250ms ease" }} />
      </div>
      <p style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, color: over ? CORAL : complete ? GOLD : MUTED, marginTop: 10, marginBottom: 0 }}>
        {complete ? (<><Check size={14} /> Rule Complete</>) : over ? `${total - 100}% over — trim a category` : `${100 - total}% left to allocate`}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------
   SMALL UI PIECES
--------------------------------------------------------- */
function PrimaryButton({ children, onClick, disabled, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      style={{
        width: "100%",
        background: disabled ? "var(--pr-primary-disabled-bg)" : GOLD_GRADIENT,
        color: disabled ? "var(--pr-primary-disabled-ink)" : "#052711",
        border: "none",
        borderRadius: R_MD,
        padding: "15px 18px",
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : SHADOW_BTN,
        letterSpacing: 0.1,
        transition: "transform 150ms cubic-bezier(0.2,0.8,0.2,1), opacity 150ms ease, background 150ms ease, color 150ms ease",
      }}
    >
      {children}{Icon && <Icon size={17} />}
    </button>
  );
}

function GhostButton({ children, onClick, icon: Icon, disabled, style, isDark = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", background: disabled ? INPUT_BG : PAPER_DIM, color: disabled ? MUTED : INK, border: `1.5px solid ${isDark ? "#53645A" : LINE}`, borderRadius: R_MD,
        padding: "14px 18px", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14.5,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: disabled ? "not-allowed" : "pointer", ...style,
      }}
    >
      {children}{Icon && <Icon size={16} />}
    </button>
  );
}

/* ---------------------------------------------------------
   SWIPE ROW — swipe left to reveal quick actions (duplicate/delete)
--------------------------------------------------------- */
function SwipeRow({ children, actions, rowKey, openRowKey, setOpenRowKey }) {
  const actionsWidth = actions.length * 64;
  const open = openRowKey === rowKey;
  const dragState = useRef({ startX: 0, dragging: false });
  const [dragX, setDragX] = useState(open ? -actionsWidth : 0);


  useEffect(() => {
    (async () => {
      try {
        const encrypted = await storageAdapter.get(ENCRYPTED_STORAGE_KEY);
        if (encrypted) {
          const metaRaw = await storageAdapter.get(SECURITY_META_KEY);
          const meta = metaRaw ? JSON.parse(metaRaw) : null;
          if (meta?.pin) setData((d) => ({ ...d, settings: { ...d.settings, pin: meta.pin } }));
          setIsLocked(true);
        }
        const raw = await storageAdapter.get(STORAGE_KEY);
        if (raw) {
          const parsed = normalizeState(JSON.parse(raw));
          parsed.settings.customCurrencies.forEach(registerCustomCurrency);
          setData(parsed);
          setIncome(parsed.lastIncome || "");
          // Plan names belong to each plan, not to the global app draft.
          // Start a fresh name field so a previous plan name is never reused accidentally.
          setPlanName("");
          setNotes(parsed.notes || "");
          if (parsed.settings.pin) setIsLocked(true);
        }
      } catch {
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      if (sessionPin) {
        const encrypted = await encryptJson(data, sessionPin);
        if (encrypted) { await storageAdapter.set(ENCRYPTED_STORAGE_KEY, encrypted); await storageAdapter.set(SECURITY_META_KEY, JSON.stringify({ pin: data.settings.pin })); await storageAdapter.remove(STORAGE_KEY); }
      } else if (!data.settings.pin) {
        await storageAdapter.set(STORAGE_KEY, JSON.stringify(data));
      }
    })();
  }, [data, loaded, sessionPin]);

  useEffect(() => {
    if (!loaded) return;
    setData((d) => (d.lastIncome === income ? d : { ...d, lastIncome: income }));
  }, [income, loaded]);

  useEffect(() => {
    if (!loaded) return;
  }, [planName, loaded]);

  useEffect(() => {
    if (!loaded) return;
    setData((d) => (d.notes === notes ? d : { ...d, notes }));
  }, [notes, loaded]);

  function updateSettings(next) {
    setData((d) => ({ ...d, settings: next }));
  }
  function requestCurrencyChange(code) {
    if (!code || code === data.settings.currency) return;
    const hasExistingData = (data.plans || []).length > 0 || (data.history || []).length > 0;
    if (hasExistingData) {
      setPendingCurrency(code);
      return;
    }
    updateSettings({ ...data.settings, currency: code });
  }

  function confirmCurrencyChange() {
    if (!pendingCurrency) return;
    updateSettings({ ...data.settings, currency: pendingCurrency });
    setPendingCurrency(null);
  }
  function saveRule(rule) {
    setData((d) => {
      if (rule.id) {
        return { ...d, rules: d.rules.map((r) => (r.id === rule.id ? { ...r, ...rule } : r)) };
      }
      const newRule = { ...rule, id: uid("rule"), createdAt: Date.now(), lastUsedAt: Date.now() };
      return { ...d, rules: [...d.rules, newRule], activeRuleId: newRule.id };
    });
    setEditingRuleId(undefined);
    setScreen("home");
  }
  function duplicateRule(id) {
    setData((d) => {
      const r = d.rules.find((x) => x.id === id);
      if (!r) return d;
      return { ...d, rules: [...d.rules, { ...r, id: uid("rule"), name: r.name + " Copy" }] };
    });
  }
  function deleteRule(id) {
    setData((d) => {
      if (d.rules.length <= 1) return d;
      const rules = d.rules.filter((r) => r.id !== id);
      const activeRuleId = d.activeRuleId === id ? (rules[0] ? rules[0].id : null) : d.activeRuleId;
      return { ...d, rules, activeRuleId };
    });
  }
  function useRule(id) {
    setData((d) => ({ ...d, activeRuleId: id, rules: d.rules.map((r) => r.id === id ? { ...r, lastUsedAt: Date.now() } : r) }));
    setSavedFlash(false);
    setScreen("home");
  }
  function requestSavePlan() {
    const rule = data.rules.find((r) => r.id === data.activeRuleId);
    const incomeNum = Number(income) || 0;
    const total = rule ? Math.round(rule.categories.reduce((sum, c) => sum + (Number(c.pct) || 0), 0) * 10) / 10 : 0;
    if (!rule || incomeNum <= 0 || total !== 100) return;
    setPlanName("");
    setShowPlanNameSheet(true);
  }

  function confirmSavePlan() {
    const name = planName.trim();
    if (!name) return;
    setShowPlanNameSheet(false);
    saveToHistory(name);
  }

  function saveToHistory(finalPlanName) {
    const rule = data.rules.find((r) => r.id === data.activeRuleId);
    const incomeNum = Number(income) || 0;
    if (!rule || incomeNum <= 0) return;
    const allocated = calculateCategories(incomeNum, rule.categories);
    const signature = ruleSignature(rule, income);

    const shouldAskAboutReminders = (data.plans || []).length === 0 && data.settings.reminderPromptSeen !== true;

    setData((d) => {
      let plans = [...(d.plans || [])];
      let activePlanId = d.activePlanId;
      const existing = activePlanId ? plans.find((p) => p.id === activePlanId && p.status === "active") : null;
      const sameExisting = existing && existing.ruleId === rule.id && existing.income === incomeNum;
      let name = existing?.name || String(finalPlanName || "").trim();
      let createdNewPlan = false;

      if (!sameExisting) {
        // Keep exactly one active plan. Starting another plan closes any
        // previous active plan so active-plan state stays consistent.
        if (!name) return d;
        plans = plans.map((p) => p.status === "active" ? { ...p, status: "completed", completedAt: Date.now() } : p);

        const plan = {
          id: uid("plan"), date: Date.now(), name, ruleId: rule.id, ruleName: rule.name, income: incomeNum, currency: d.settings.currency,
          categories: allocated.map((c) => ({ id: uid("pc"), name: c.name, pct: c.pct, budget: c.amount, spent: 0 })),
          transactions: [], hasTransactionLedger: true, status: "active",
        };
        plans = [...plans, plan];
        activePlanId = plan.id;
        createdNewPlan = true;
      }

      const existingHistoryId = existing?.historyId;
      const finalEntry = {
        id: existingHistoryId || uid("h"),
        date: existingHistoryId ? (d.history.find((h) => h.id === existingHistoryId)?.date || Date.now()) : Date.now(),
        ruleName: name || existing?.name || rule.name,
        income: incomeNum,
        categories: rule.categories,
        planId: activePlanId,
        // A saved plan keeps the currency it was created with. If we are
        // refreshing an existing plan/history entry, never overwrite that
        // currency just because Settings has since changed.
        currency: existing?.currency || d.settings.currency,
        notes: notes.trim(),
      };
      const history = existingHistoryId
        ? d.history.map((h) => h.id === existingHistoryId ? { ...h, ...finalEntry } : h)
        : [...d.history, finalEntry];
      if (createdNewPlan) {
        plans = plans.map((p) => p.id === activePlanId ? { ...p, historyId: finalEntry.id } : p);
      }
      return { ...d, history, plans, activePlanId, lastPlanName: createdNewPlan ? "" : d.lastPlanName };
    });

    // Clear the draft field after a new plan is created. The saved plan keeps
    // its own name, so subsequent plans start fresh instead of inheriting it.
    setPlanName("");
    setIncome("");
    const recommendation = getResourceRecommendation(rule.categories);
    setResourcePrompt(recommendation);
    setSavedFlash("plan");
    setSavedSignature(signature);
    setTimeout(() => setSavedFlash(false), 1800);
    if (shouldAskAboutReminders) {
      setReminderPrompt((current) => ({
        ...current,
        frequency: data.settings.reminderFrequency && data.settings.reminderFrequency !== "off" ? data.settings.reminderFrequency : "weekly",
        day: data.settings.reminderDay || "Friday",
        dayOfMonth: data.settings.reminderDayOfMonth || 1,
        hour: data.settings.reminderHour || 12,
        ampm: data.settings.reminderAmpm || "PM",
      }));
      setShowReminderPrompt(true);
    }
  }

  function addMoneyToActivePlan(amount) {
    const value = Math.round(Number(amount) || 0);
    if (value <= 0 || !data.activePlanId) return;

    setData((d) => {
      const plan = (d.plans || []).find((p) => p.id === d.activePlanId && p.status === "active");
      if (!plan || !Array.isArray(plan.categories) || plan.categories.length === 0) return d;

      const pctTotal = plan.categories.reduce((sum, c) => sum + (Number(c.pct) || 0), 0);
      if (pctTotal <= 0) return d;

      const additions = plan.categories.map((c) => ({
        id: String(c.id),
        amount: Math.round(value * (Number(c.pct) || 0) / pctTotal),
      }));
      const roundedTotal = additions.reduce((sum, a) => sum + a.amount, 0);
      const roundingDiff = value - roundedTotal;
      if (roundingDiff !== 0 && additions.length) additions[additions.length - 1].amount += roundingDiff;

      const updated = {
        ...plan,
        income: Math.max(0, Math.round(Number(plan.income) || 0) + value),
        categories: plan.categories.map((c) => {
          const added = additions.find((a) => a.id === String(c.id))?.amount || 0;
          return { ...c, budget: Math.max(0, Math.round(Number(c.budget) || 0) + added) };
        }),
      };

      // Keep the linked history entry in sync so the completed/history view
      // reflects the current size of the living plan.
      const history = (d.history || []).map((h) => {
        if (String(h.planId) !== String(plan.id)) return h;
        return {
          ...h,
          income: updated.income,
          currency: updated.currency || h.currency,
          categories: updated.categories.map((c) => ({
            id: c.id,
            name: c.name,
            pct: c.pct,
            amount: c.budget,
            budget: c.budget,
            spent: c.spent,
          })),
        };
      });

      return {
        ...d,
        history,
        plans: d.plans.map((p) => p.id === updated.id ? updated : p),
      };
    });
  }

  function addExpense(categoryId, amount, note) {
    const value = Math.round(Number(amount) || 0);
    if (value <= 0 || !data.activePlanId) return;
    setData((d) => {
      const plan = (d.plans || []).find((p) => p.id === d.activePlanId && p.status === "active");
      if (!plan) return d;
      const tx = { id: uid("tx"), categoryId: String(categoryId || ""), amount: value, note: String(note || "").trim(), date: Date.now() };
      const updated = reconcilePlanSpending({ ...plan, hasTransactionLedger: true, transactions: [...(plan.transactions || []), tx] }, true);
      return { ...d, plans: d.plans.map((p) => p.id === updated.id ? updated : p) };
    });
  }




  function editExpense(transactionId, amount, note) {
    const id = String(transactionId || "");
    const value = Math.round(Number(amount) || 0);
    if (!id || value <= 0 || !data.activePlanId) return;
    setData((d) => {
      const plan = (d.plans || []).find((p) => p.id === d.activePlanId && p.status === "active");
      if (!plan) return d;
      const existingTransactions = Array.isArray(plan.transactions) ? plan.transactions : [];
      if (!existingTransactions.some((t) => String(t.id) === id)) return d;

      const transactions = existingTransactions.map((t) =>
        String(t.id) === id ? { ...t, amount: value, note: String(note || "").trim() } : t
      );
      const updated = reconcilePlanSpending({ ...plan, hasTransactionLedger: true, transactions }, true);
      return { ...d, plans: d.plans.map((p) => p.id === plan.id ? updated : p) };
    });
  }

  function deleteExpense(transactionId) {
    const id = String(transactionId || "");
    if (!id || !data.activePlanId) return;
    setData((d) => {
      const plan = (d.plans || []).find((p) => p.id === d.activePlanId && p.status === "active");
      if (!plan) return d;
      const existingTransactions = Array.isArray(plan.transactions) ? plan.transactions : [];
      if (!existingTransactions.some((t) => String(t.id) === id)) return d;

      const transactions = existingTransactions.filter((t) => String(t.id) !== id);
      const updated = reconcilePlanSpending({ ...plan, hasTransactionLedger: true, transactions }, true);
      return { ...d, plans: d.plans.map((p) => p.id === plan.id ? updated : p) };
    });
  }

  function finishPlan() {
    if (!data.activePlanId) return;
    setData((d) => ({ ...d, plans: (d.plans || []).map((p) => p.id === d.activePlanId ? { ...p, status: "completed", completedAt: Date.now() } : p), activePlanId: null }));
  }
  function deleteCompletedPlan(id) {
    if (!id) return;
    setData((d) => {
      const plan = (d.plans || []).find((p) => p.id === id);
      const historyId = plan?.historyId;
      return {
        ...d,
        plans: (d.plans || []).filter((p) => p.id !== id),
        history: d.history.filter((h) => h.id !== historyId && h.planId !== id),
      };
    });
    setSelectedCompletedPlanId(null);
    setScreen("plan");
  }
  function deleteHistoryEntry(id) {
    setData((d) => ({ ...d, history: d.history.filter((h) => h.id !== id) }));
  }
  function addCustomCurrency(name, code, symbol) {
    const cleanName = String(name || "").trim();
    const cleanCode = String(code || "").trim().toUpperCase();
    const cleanSymbol = String(symbol || "").trim();
    if (!cleanName || !cleanCode || !cleanSymbol) return;
    registerCustomCurrency({ name: cleanName, code: cleanCode, symbol: cleanSymbol });
    setData((d) => {
      const existing = d.settings.customCurrencies || [];
      const already = existing.some((c) => c.code === cleanCode);
      return {
        ...d,
        settings: {
          ...d.settings,
          currency: cleanCode,
          customCurrencies: already
            ? existing.map((c) => c.code === cleanCode ? { ...c, name: c.name || cleanName, symbol: cleanSymbol } : c)
            : [...existing, { name: cleanName, code: cleanCode, symbol: cleanSymbol }],
        },
      };
    });
  }
  function exportBackup() {
    setBackupModal({ mode: "create", error: "", loading: false });
  }

  function importBackup() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || file.size > 5 * 1024 * 1024) {
        setBackupModal({ mode: "restore", error: "Backup is missing or larger than 5 MB.", loading: false, invalid: true });
        return;
      }
      try {
        const parsed = JSON.parse(await file.text());
        if (parsed?.app !== "PocketRule") throw new Error();
        setBackupModal({ mode: "restore", error: "", loading: false, file: parsed });
      } catch {
        setBackupModal({ mode: "restore", error: "That file is not a valid PocketRule backup.", loading: false, invalid: true });
      }
    };
    input.click();
  }

  async function submitBackupModal({ password, confirmPassword }) {
    if (!backupModal) return;
    setBackupModal((m) => ({ ...m, loading: true, error: "" }));
    try {
      if (backupModal.mode === "create") {
        if (password.length < 8) throw new Error("Use at least 8 characters.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        const payload = { app: "PocketRule", version: APP_VERSION, backupVersion: 3, exportedAt: new Date().toISOString(), data };
        const encrypted = await encryptBackupWithPassword(payload, password);
        if (!encrypted) throw new Error("Unable to encrypt the backup on this device.");
        const blob = new Blob([JSON.stringify({ app: "PocketRule", backupVersion: 3, encrypted })], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pocketrule-encrypted-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setBackupModal(null);
        return;
      }

      const parsed = backupModal.file;
      if (backupModal.invalid) throw new Error("That file is not a valid PocketRule backup.");
      let payload = null;
      if (parsed?.backupVersion === 3 && parsed.encrypted) {
        payload = await decryptBackupWithPassword(parsed.encrypted, password);
      } else if (parsed?.backupVersion === 2 && parsed.encrypted) {
        payload = await decryptJson(parsed.encrypted, password);
      } else {
        payload = parsed;
      }
      if (!payload) throw new Error("The password is incorrect or the backup cannot be decrypted.");
      const candidate = payload.data || payload;
      if (candidate && typeof candidate === "object") {
        const limits = [
          ["rules", 100], ["plans", 500], ["history", 500], ["customCurrencies", 100]
        ];
        for (const [key, max] of limits) {
          const value = key === "customCurrencies" ? candidate.settings?.[key] : candidate[key];
          if (value !== undefined && (!Array.isArray(value) || value.length > max)) {
            throw new Error("The backup contains too much data to restore safely.");
          }
        }
        const planTransactions = Array.isArray(candidate.plans)
          ? candidate.plans.reduce((sum, p) => sum + (Array.isArray(p?.transactions) ? p.transactions.length : 0), 0)
          : 0;
        if (planTransactions > 5000) throw new Error("The backup contains too many transactions to restore safely.");
      }
      if (
        !candidate ||
        typeof candidate !== "object" ||
        Array.isArray(candidate) ||
        !candidate.settings ||
        typeof candidate.settings !== "object" ||
        !Array.isArray(candidate.rules)
      ) throw new Error("The backup structure is invalid.");
      if (JSON.stringify(candidate).length > 4 * 1024 * 1024) throw new Error("The backup contains too much data to restore safely.");
      setBackupModal((m) => ({ ...m, loading: false, pendingRestore: candidate }));
      return;
    } catch (err) {
      setBackupModal((m) => ({ ...m, loading: false, error: err?.message || "Unable to complete the backup operation." }));
    }
  }

  function confirmRestoreBackup() {
    const candidate = backupModal?.pendingRestore;
    if (!candidate) return;
    try {
      const restored = normalizeState(candidate);
      if (!restored || !Array.isArray(restored.rules) || restored.rules.length === 0 || !Array.isArray(restored.plans) || !restored.settings) {
        throw new Error("This backup could not be safely restored.");
      }
      // Final preflight: the state must be plain JSON and contain only render-safe core structures.
      JSON.stringify(restored);
      if (
        typeof restored.settings.pin !== "object" && restored.settings.pin !== null && typeof restored.settings.pin !== "string"
      ) {
        throw new Error("The backup contains an invalid PIN value.");
      }
      restored.settings.customCurrencies.forEach(registerCustomCurrency);
      setData(restored);
      setIncome(restored.lastIncome || "");
      setPlanName("");
      setNotes(restored.notes || "");
      setSessionPin(null);
      setScreen("home");
      setIsLocked(Boolean(restored.settings.pin));
      setBackupModal(null);
      setBackupSuccess(true);
    } catch (err) {
      setBackupModal((m) => ({ ...m, loading: false, error: err?.message || "Unable to restore this backup." }));
    }
  }

  function resetApp() {
    setData(defaultState());
    setIncome("");
    setPlanName("");
    setNotes("");
    setSavedFlash(false);
    setSavedSignature(null);
    setPendingCurrency(null);
    setResourceTarget(null);
    setResourcePrompt(null);
    setShowPlanNameSheet(false);
    setScreen("home");
    setIsLocked(false);
    setSessionPin(null);
    storageAdapter.remove(ENCRYPTED_STORAGE_KEY);
    storageAdapter.remove(SECURITY_META_KEY);
    storageAdapter.remove(STORAGE_KEY);
  }

  function finishOnboarding(selectedRuleId) {
    setData((d) => ({
      ...d,
      onboarded: true,
      activeRuleId: d.rules.some((r) => r.id === selectedRuleId) ? selectedRuleId : d.activeRuleId,
      settings: { ...d.settings, notificationsEnabled: d.settings.notificationsEnabled === true },
    }));
    setScreen("home");
  }

  function startOwnRule() {
    setData((d) => ({ ...d, onboarded: true }));
    setEditingRuleId(null);
    setScreen("firstRule");
  }

  function dismissReminderPrompt() {
    setShowReminderPrompt(false);
    setData((d) => ({ ...d, settings: { ...d.settings, reminderPromptSeen: true } }));
  }

  async function enableReminderFromPrompt() {
    const reminder = { ...reminderPrompt };
    setData((d) => ({
      ...d,
      settings: {
        ...d.settings,
        reminderPromptSeen: true,
        reminderFrequency: reminder.frequency,
        reminderDate: reminder.date || "",
        reminderDay: reminder.day,
        reminderDayOfMonth: reminder.dayOfMonth,
        reminderHour: reminder.hour,
        reminderAmpm: reminder.ampm,
      },
    }));
    const permission = await requestPocketRuleNotifications();
    const granted = permission === "granted";
    setData((d) => ({ ...d, settings: { ...d.settings, notificationsEnabled: granted } }));
    if (granted && reminder.frequency !== "off") {
      await schedulePocketRuleReminder(reminder, { openSettingsIfNeeded: true });
    } else {
      await cancelPocketRuleReminder();
    }
    setShowReminderPrompt(false);
  }

  async function unlockWithPin(pin) {
    if (!(await verifyPin(pin, data.settings.pin))) return false;
    setSessionPin(pin);
    const encrypted = await storageAdapter.get(ENCRYPTED_STORAGE_KEY);
    if (encrypted) {
      const restored = await decryptJson(encrypted, pin);
      if (!restored) { setSessionPin(null); return false; }
      const normalized = normalizeState(restored);
      normalized.settings.customCurrencies.forEach(registerCustomCurrency);
      setData(normalized); setIncome(normalized.lastIncome || ""); setPlanName(""); setNotes(normalized.notes || "");
      try {
        const parsedEncrypted = typeof encrypted === "string" ? JSON.parse(encrypted) : encrypted;
        if (parsedEncrypted?.version === LEGACY_SECURITY_VERSION) {
          const migrated = await encryptJson(normalized, pin);
          if (migrated) await storageAdapter.set(ENCRYPTED_STORAGE_KEY, migrated);
        }
      } catch {}
    } else {
      const raw = await storageAdapter.get(STORAGE_KEY);
      if (raw) {
        const normalized = normalizeState(JSON.parse(raw));
        normalized.settings.customCurrencies.forEach(registerCustomCurrency);
        setData(normalized); setIncome(normalized.lastIncome || ""); setPlanName(""); setNotes(normalized.notes || "");
        const migrated = await encryptJson(normalized,pin);
        if (migrated) { await storageAdapter.set(ENCRYPTED_STORAGE_KEY,migrated); await storageAdapter.set(SECURITY_META_KEY,JSON.stringify({pin:normalized.settings.pin})); await storageAdapter.remove(STORAGE_KEY); }
      }
    }
    return true;
  }
  useEffect(() => {
    if (!data.settings.pin) return undefined;
    const mark = () => { lastActivityRef.current = Date.now(); };
    window.addEventListener("pointerdown", mark, { passive: true });
    window.addEventListener("keydown", mark);
    const timer = window.setInterval(() => {
      if (!isLocked && Date.now() - lastActivityRef.current >= AUTO_LOCK_MS) {
        setSessionPin(null);
        setIsLocked(true);
      }
    }, 10000);
    return () => { window.removeEventListener("pointerdown", mark); window.removeEventListener("keydown", mark); window.clearInterval(timer); };
  }, [data.settings.pin, isLocked]);

  const activeRule = data.rules.find((r) => r.id === data.activeRuleId) || data.rules[0];
  const activePlan = (data.plans || []).find((p) => p.id === data.activePlanId && p.status === "active") || null;
  const isDark = resolveIsDark(data.settings.appearance);
  const themeVars = THEME_VARS[isDark ? "dark" : "light"];

  return (
    <div style={{ minHeight: "100dvh", width: "100%", background: PAPER, color: INK, boxSizing: "border-box", ...themeVars }}>
    {backupModal && <BackupPasswordSheet mode={backupModal.mode} isDark={isDark} error={backupModal.error} loading={backupModal.loading} onCancel={() => setBackupModal(null)} onConfirm={submitBackupModal} />}
        {backupModal?.pendingRestore && (
          <ConfirmSheet
            zIndex={10001}
            icon="warning"
            title="Restore this backup?"
            body="Your current PocketRule data will be replaced with the data in this backup. This cannot be undone."
            cancelLabel="Cancel"
            confirmLabel="Restore backup"
            onCancel={() => setBackupModal((m) => ({ ...m, pendingRestore: null }))}
            onConfirm={confirmRestoreBackup}
          />
        )}
        {backupSuccess && (
          <ConfirmSheet
            zIndex={10002}
            title="Backup restored"
            body="Your PocketRule data has been restored successfully."
            cancelLabel="Close"
            confirmLabel="Done"
            onCancel={() => setBackupSuccess(false)}
            onConfirm={() => setBackupSuccess(false)}
          />
        )}
        <ReminderSetupSheet
          open={showReminderPrompt}
          reminder={reminderPrompt}
          setReminder={setReminderPrompt}
          onLater={dismissReminderPrompt}
          onEnable={enableReminderFromPrompt}
        />
      <style>{FONTS}</style>
      <div style={{ width: "100%", height: "100dvh", minHeight: 0, boxSizing: "border-box", background: PAPER, color: INK, colorScheme: isDark ? "dark" : "light", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative", ...themeVars }}>
        {loaded && data.onboarded && !isLocked && screen !== "firstRule" && (
          <div style={{ position: "relative", height: 38, padding: "3px 20px 9px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <LogoMark size={22} />
              <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 17, color: INK, textShadow: isDark ? "0 1px 2px rgba(0,0,0,0.35)" : "none" }}>Pocket<span style={{ color: BRAND_ORANGE }}>Rule</span></span>
            </div>
            {data.settings.pin && (
              <button aria-label="Lock app" onClick={() => setIsLocked(true)} style={{ position: "absolute", right: 16, top: 2, width: 32, height: 32, background: "none", border: "none", cursor: "pointer", color: INK, display: "flex", alignItems: "center", justifyContent: "center" }}><Lock size={19} /></button>
            )}
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto" }}>
          {!loaded ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LogoMark size={40} />
            </div>
          ) : isLocked ? (
            <LockScreen pin={data.settings.pin} onUnlock={async (enteredPin) => { if (await unlockWithPin(enteredPin)) setIsLocked(false); }} onForgot={resetApp} dark={isDark} />
          ) : !data.onboarded ? (
            <Onboarding
              rules={data.rules}
              selectedRuleId={data.activeRuleId}
              onSelectRule={(id) => setData((d) => ({ ...d, activeRuleId: id }))}
              currency={data.settings.currency}
              onCurrencyChange={requestCurrencyChange}
              onAddCurrency={addCustomCurrency}
              onFinish={finishOnboarding}
              onCreateRule={startOwnRule}
            />
          ) : screen === "home" ? (
            <HomeScreen
              rules={data.rules}
              activeRule={activeRule}
              income={income}
              setIncome={setIncome}
              notes={notes}
              setNotes={setNotes}
              planName={planName}
              setPlanName={setPlanName}
              activePlan={activePlan}
              onAddExpense={addExpense}
              onEditExpense={editExpense}
              onDeleteExpense={deleteExpense}
              onAddMoney={addMoneyToActivePlan}
              onFinishPlan={finishPlan}
              resourcePrompt={resourcePrompt}
              onOpenResource={(id) => { setResourceTarget(id); setScreen("resources"); setResourcePrompt(null); }}
              currency={data.settings.currency}
              saved={savedFlash}
              savedSignature={savedSignature}
              onSave={requestSavePlan}
              onShare={() => setScreen("share")}
              onSelectRule={useRule}
              onEditActive={(id) => { setEditingRuleId(id); setScreen("ruleEditor"); }}
              onHistory={() => setScreen("history")}
              historyCount={data.history.length}
              onCurrencyChange={requestCurrencyChange}
              onAddCurrency={addCustomCurrency}
              isDark={isDark}
            />
          ) : screen === "firstRule" ? (
            <RuleEditor
              initial={editingRuleId ? (data.rules.find((r) => r.id === editingRuleId) || data.rules[0]) : { id: null, name: "", emoji: "📊", categories: [{ name: "New category", pct: 100 }] }}
              firstRun
              onCancel={() => setScreen("home")}
              onSave={saveRule}
            />
          ) : screen === "plan" ? (
            <PlansScreen
              plans={data.plans}
              currency={data.settings.currency}
              onOpenActive={() => setScreen("home")}
              onOpenCompleted={(id) => { setSelectedCompletedPlanId(id); setScreen("completedPlanDetail"); }}
            />
          ) : screen === "completedPlanDetail" ? (
            <CompletedPlanDetailScreen
              plan={data.plans.find((p) => p.id === selectedCompletedPlanId)}
              currency={data.settings.currency}
              onBack={() => setScreen("plan")}
              onDeletePlan={deleteCompletedPlan}
              isDark={isDark}
            />
          ) : screen === "resources" ? (
            <ResourcesScreen targetId={resourceTarget} />
          ) : screen === "rules" ? (
            <RulesScreen
              rules={data.rules}
              activeRuleId={data.activeRuleId}
              onNew={() => { setEditingRuleId(null); setScreen("ruleEditor"); }}
              onOpen={(id) => { setSelectedRuleId(id); setScreen("ruleDetail"); }}
              onDuplicate={duplicateRule}
              onDelete={deleteRule}
            />
          ) : screen === "ruleDetail" ? (
            <RuleDetailScreen
              rule={data.rules.find((r) => r.id === selectedRuleId)}
              isActive={selectedRuleId === data.activeRuleId}
              canDelete={data.rules.length > 1}
              onBack={() => setScreen("rules")}
              onUse={() => useRule(selectedRuleId)}
              onEdit={() => { setEditingRuleId(selectedRuleId); setScreen("ruleEditor"); }}
              onDuplicate={() => { duplicateRule(selectedRuleId); setScreen("rules"); }}
              onDelete={() => { deleteRule(selectedRuleId); setScreen("rules"); }}
            />
          ) : screen === "ruleEditor" ? (
            <RuleEditor
              initial={editingRuleId ? data.rules.find((r) => r.id === editingRuleId) : { name: "", categories: [{ name: "New category", pct: 100 }] }}
              onCancel={() => setScreen("rules")}
              onSave={saveRule}
            />
          ) : screen === "settings" ? (
            <SettingsScreen settings={data.settings} onChange={updateSettings} onPinCreated={(pin) => setSessionPin(pin)} onLockNow={() => { setSessionPin(null); setIsLocked(true); }} onReset={resetApp} onAddCurrency={addCustomCurrency} onExportBackup={exportBackup} onImportBackup={importBackup} onRequestCurrencyChange={requestCurrencyChange} isDark={isDark} />
          ) : screen === "history" ? (
            <HistoryScreen
              history={data.history}
              currency={data.settings.currency}
              onBack={() => setScreen("home")}
              onOpen={(id) => { setSelectedHistoryId(id); setScreen("historyDetail"); }}
              onDelete={deleteHistoryEntry}
            />
          ) : screen === "historyDetail" ? (
            <HistoryDetailScreen
              entry={data.history.find((h) => h.id === selectedHistoryId)}
              currency={data.settings.currency}
              onBack={() => setScreen("history")}
            />
          ) : screen === "share" ? (
            <ShareCardScreen income={income} categories={activeRule.categories} ruleName={activeRule.name} currency={data.settings.currency} onClose={() => setScreen("home")} />
          ) : null}
        </div>

        <PlanNameSheet
          open={showPlanNameSheet}
          value={planName}
          onChange={setPlanName}
          onCancel={() => { setShowPlanNameSheet(false); setPlanName(""); }}
          onConfirm={confirmSavePlan}
        />

        {loaded && data.onboarded && !isLocked && screen !== "share" && screen !== "ruleEditor" && screen !== "firstRule" && screen !== "historyDetail" && screen !== "ruleDetail" && screen !== "completedPlanDetail" && (
          <BottomNav active={screen} onNav={(next) => { if (next !== "resources") setResourceTarget(null); setScreen(next); }} />
        )}

        {pendingCurrency && (
          <CurrencyChangeWarning
            oldCurrency={currencyLabel(CURRENCIES.find((c) => c.code === data.settings.currency) || CURRENCIES[0])}
            newCurrency={currencyLabel(CURRENCIES.find((c) => c.code === pendingCurrency) || CURRENCIES[0])}
            onCancel={() => setPendingCurrency(null)}
            onConfirm={confirmCurrencyChange}
          />
        )}
      </div>
  
</div>
); 
}

export default function PocketRuleApp() {
  return <PocketRuleErrorBoundary><PocketRuleAppInner /></PocketRuleErrorBoundary>;
}
