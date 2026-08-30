import React, { Component, useState, useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { AdMob, AdmobConsentStatus, BannerAdSize, BannerAdPosition, BannerAdPluginEvents } from "@capacitor-community/admob";
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
const POCKETRULE_ADMOB_BANNER_ID = import.meta.env.VITE_ADMOB_BANNER_ID || "ca-app-pub-3940256099942544/6300978111";
const POCKETRULE_ADMOB_TESTING = String(import.meta.env.VITE_ADMOB_TESTING ?? "true").toLowerCase() !== "false";
const POCKETRULE_ADMOB_ENABLED = String(import.meta.env.VITE_ADMOB_ENABLED ?? "true").toLowerCase() !== "false";

let pocketRuleAdMobInitialized = false;
let pocketRuleAdMobConsentPromise = null;
let pocketRuleAdMobListenersReady = false;

async function setupPocketRuleAdMobListeners() {
  if (!isNativeApp() || pocketRuleAdMobListenersReady) return;

  pocketRuleAdMobListenersReady = true;

  try {
    await AdMob.addListener(BannerAdPluginEvents.Loaded, (info) => {
      console.log("PocketRule AdMob banner loaded:", info);
    });

    await AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
      console.error("PocketRule AdMob banner failed to load:", error);
    });

    await AdMob.addListener(BannerAdPluginEvents.Opened, () => {
      console.log("PocketRule AdMob banner opened.");
    });

    await AdMob.addListener(BannerAdPluginEvents.Closed, () => {
      console.log("PocketRule AdMob banner closed.");
    });

    await AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
      console.log("PocketRule AdMob banner size changed:", size);
    });
  } catch (error) {
    console.error("PocketRule AdMob listener setup failed:", error);
  }
}

async function startPocketRuleAdMob() {
  if (!isNativeApp() || !POCKETRULE_ADMOB_ENABLED) {
    console.log("PocketRule AdMob skipped:", {
      native: isNativeApp(),
      enabled: POCKETRULE_ADMOB_ENABLED,
    });
    return false;
  }

  try {
    if (!pocketRuleAdMobInitialized) {
      await AdMob.initialize({
        initializeForTesting: POCKETRULE_ADMOB_TESTING,
      });
      pocketRuleAdMobInitialized = true;
      console.log("PocketRule AdMob initialized.");
    }

    await setupPocketRuleAdMobListeners();

    if (!pocketRuleAdMobConsentPromise) {
      pocketRuleAdMobConsentPromise = (async () => {
        let consentInfo = await AdMob.requestConsentInfo();

        console.log("PocketRule AdMob consent info:", consentInfo);

        if (
          !consentInfo.canRequestAds &&
          consentInfo.isConsentFormAvailable
        ) {
          consentInfo = await AdMob.showConsentForm();
          console.log("PocketRule AdMob consent result:", consentInfo);
        }

        if (!consentInfo.canRequestAds) {
          console.warn(
            "PocketRule AdMob cannot request ads yet. " +
            "Consent/status does not currently allow an ad request."
          );
        }

        return Boolean(consentInfo.canRequestAds);
      })();
    }

    return await pocketRuleAdMobConsentPromise;
  } catch (error) {
    console.error("PocketRule AdMob initialization/consent failed:", error);
    pocketRuleAdMobConsentPromise = null;
    return false;
  }
}

async function showPocketRuleBanner() {
  if (!isNativeApp()) return;

  const canRequestAds = await startPocketRuleAdMob();

  if (!canRequestAds) {
    console.warn("PocketRule banner not shown because ads cannot be requested.");
    return;
  }

  try {
    console.log("PocketRule showing AdMob banner:", {
      adId: POCKETRULE_ADMOB_BANNER_ID,
      isTesting: POCKETRULE_ADMOB_TESTING,
    });

    await AdMob.showBanner({
      adId: POCKETRULE_ADMOB_BANNER_ID,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: POCKETRULE_ADMOB_TESTING,
    });
  } catch (error) {
    console.error("PocketRule banner failed to show:", error);
  }
}

async function hidePocketRuleBanner() {
  if (!isNativeApp()) return;
  try {
    await AdMob.hideBanner();
  } catch (error) {
    console.warn("PocketRule banner hide failed:", error);
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

const APP_VERSION = "1.18.13";
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

  useEffect(() => { setDragX(open ? -actionsWidth : 0); }, [open, actionsWidth]);

  function onPointerDown(e) {
    dragState.current = { startX: e.clientX, dragging: true, base: open ? -actionsWidth : 0 };
  }
  function onPointerMove(e) {
    if (!dragState.current.dragging) return;
    const delta = e.clientX - dragState.current.startX;
    const next = Math.max(-actionsWidth, Math.min(0, dragState.current.base + delta));
    setDragX(next);
  }
  function onPointerUp() {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    const shouldOpen = dragX < -actionsWidth / 2;
    setDragX(shouldOpen ? -actionsWidth : 0);
    setOpenRowKey(shouldOpen ? rowKey : null);
  }

  return (
    <div style={{ position: "relative", borderRadius: 18, overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, display: "flex" }}>
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <button
              key={i}
              onClick={() => { a.onClick(); setDragX(0); setOpenRowKey(null); }}
              style={{ width: 64, background: a.color || INK, border: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, color: "#fff", cursor: "pointer" }}
            >
              <Icon size={17} />
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700 }}>{a.label}</span>
            </button>
          );
        })}
      </div>
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ transform: `translateX(${dragX}px)`, transition: dragState.current.dragging ? "none" : "transform 200ms ease", touchAction: "pan-y" }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   PICKER SHEET — in-app bottom sheet, replaces native <select>
--------------------------------------------------------- */
function PickerSheet({ open, onClose, title, options, value, onAddCustom, addCustomLabel }) {
  if (!open) return null;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(10,14,11,0.45)" }} />
      <div style={{ position: "relative", width: "100%", background: PAPER_DIM, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: "14px 18px 22px", maxHeight: "65%", overflowY: "auto", boxShadow: "0 -20px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: LINE, margin: "0 auto 14px" }} />
        <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 15.5, color: INK, margin: "0 0 10px" }}>{title}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => opt.onSelect()}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", textAlign: "left",
                padding: "12px 12px", borderRadius: 12, border: "none", cursor: "pointer",
                background: opt.value === value ? ACTIVE_TINT : "transparent",
                fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 14, color: INK,
              }}
            >
              <span>{opt.label}</span>
              {opt.value === value && <Check size={16} color={GOLD} />}
            </button>
          ))}
        </div>
        {onAddCustom && (
          <button
            onClick={onAddCustom}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", marginTop: 10,
              padding: "12px", borderRadius: 12, border: `1.5px dashed ${LINE}`, background: "none", cursor: "pointer",
              fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13, color: GOLD,
            }}
          >
            <Plus size={14} /> {addCustomLabel || "Add custom"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   CUSTOM CURRENCY SHEET — let people add any currency not
   already in the preset list
--------------------------------------------------------- */
function CustomCurrencySheet({ open, onClose, onSave }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [symbol, setSymbol] = useState("");
  if (!open) return null;

  function submit() {
    if (!name.trim() || !code.trim() || !symbol.trim()) return;
    onSave(name.trim(), code.trim().toUpperCase(), symbol.trim());
    setName("");
    setCode("");
    setSymbol("");
  }

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 61, display: "flex", alignItems: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(10,14,11,0.45)" }} />
      <div style={{ position: "relative", width: "100%", background: PAPER_DIM, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: "14px 18px 24px", boxShadow: "0 -20px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: LINE, margin: "0 auto 14px" }} />
        <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 15.5, color: INK, margin: "0 0 4px" }}>Add a custom currency</h3>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "0 0 14px" }}>For any currency not already in the list.</p>

        <label style={labelStyle}>Currency name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. West African CFA franc"
          maxLength={40}
          style={{ width: "100%", boxSizing: "border-box", marginBottom: 12, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, color: INK, border: `1px solid ${LINE}`, borderRadius: R_SM, padding: "10px 12px", background: INPUT_BG }}
        />
        <label style={labelStyle}>Currency code</label>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. XOF"
          maxLength={4}
          style={{ width: "100%", boxSizing: "border-box", marginBottom: 12, fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 14, color: INK, border: `1px solid ${LINE}`, borderRadius: R_SM, padding: "10px 12px", background: INPUT_BG, textTransform: "uppercase" }}
        />
        <label style={labelStyle}>Symbol</label>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="e.g. CFA"
          maxLength={6}
          style={{ width: "100%", boxSizing: "border-box", marginBottom: 16, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 14, color: INK, border: `1px solid ${LINE}`, borderRadius: R_SM, padding: "10px 12px", background: INPUT_BG }}
        />
        <PrimaryButton disabled={!name.trim() || !code.trim() || !symbol.trim()} onClick={submit}>Add & use this currency</PrimaryButton>
      </div>
    </div>
  );
}

function Switch({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
        background: on ? GOLD : LINE, position: "relative", flexShrink: 0, transition: "background 150ms ease",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 4px rgba(18,24,27,0.35)",
        position: "absolute", top: 3, left: on ? 21 : 3, transition: "left 150ms ease",
      }} />
    </button>
  );
}

function ScreenHeader({ title, subtitle, onBack, right }) {
  return (
    <div style={{ padding: "20px 20px 12px" }}>
      <div style={{ position: "relative", minHeight: 42, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Go back" title="Back"
            style={{ position: "absolute", left: 0, top: 0, width: 44, height: 44, borderRadius: 13, background: PAPER_DIM, border: `1px solid ${LINE}`, boxShadow: "0 1px 4px rgba(0,0,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: INK, zIndex: 2 }}
          >
            <ArrowLeft size={21} strokeWidth={2.7} />
          </button>
        )}
        <div style={{ width: "100%", padding: onBack || right ? "0 44px" : 0 }}>
          <h1 style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 23, lineHeight: 1.15, letterSpacing: "-0.035em", color: INK, margin: 0, textAlign: "center" }}>{title}</h1>
          {subtitle && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, lineHeight: 1.45, color: MUTED, margin: "4px auto 0", maxWidth: 300 }}>{subtitle}</p>}
        </div>
        {right && <div style={{ position: "absolute", right: 0, top: 0, display: "flex", alignItems: "center" }}>{right}</div>}
      </div>
      <div style={{ height: 1, background: LINE, marginTop: 14 }} />
    </div>
  );
}

const labelStyle = {
  fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 0.4,
  textTransform: "uppercase", color: MUTED, display: "block", marginBottom: 6,
};
const settingsLabelStyle = { ...labelStyle, textAlign: "center", marginBottom: 8 };
const stepperBtn = {
  width: 24, height: 24, borderRadius: 6, border: `1.5px solid ${LINE}`, background: "none",
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: INK, flexShrink: 0,
};

/* ---------------------------------------------------------
   PIN PAD (used for setup + unlock)
--------------------------------------------------------- */
function PinPad({ value, onDigit, onDelete, dark, shake }) {
  // The PIN keypad intentionally stays light in both app themes for a stable,
  // familiar authentication surface and maximum digit contrast.
  const keys = ["1","2","3","4","5","6","7","8","9","","0","del"];
  const pinInk = "#12181B";
  const pinLine = "#DDE3DE";
  const pinBg = "#F5F7F3";
  return (
    <div className={shake ? "pr-shake" : undefined} style={{ width: "100%", background: "#FFFFFF", border: `1px solid ${pinLine}`, borderRadius: 22, padding: "16px 12px 12px", boxShadow: "0 8px 24px rgba(18,24,27,0.10)" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 26 }}>
        {[0,1,2,3].map((i) => (
          <div key={i} style={{
            width: 13, height: 13, borderRadius: "50%",
            border: `2px solid ${value.length > i ? pinInk : "rgba(18,24,27,0.22)"}`,
            background: value.length > i ? pinInk : "transparent",
            boxShadow: value.length > i ? "0 0 8px rgba(18,24,27,0.12)" : "none",
            transition: "all 150ms ease",
          }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, width: "100%", maxWidth: 360, margin: "0 auto" }}>
        {keys.map((k, i) =>
          k === "" ? <div key={i} /> : (
            <button
              key={i}
              type="button"
              aria-label={k === "del" ? "Delete" : `Digit ${k}`}
              onClick={() => (k === "del" ? onDelete() : onDigit(k))}
              style={{
                width: "100%", height: 66, borderRadius: 15,
                border: `1px solid ${pinLine}`,
                background: pinBg,
                boxShadow: "0 2px 8px rgba(18,24,27,0.08)",
                color: pinInk,
                fontFamily: '"Roboto", sans-serif', fontSize: k === "del" ? 20 : 28,
                fontWeight: 700, fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum" 1', letterSpacing: k === "0" ? "0.04em" : "0",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {k === "del" ? <Delete size={20} /> : k}
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   LOCK SCREEN
--------------------------------------------------------- */
function LockScreen({ pin, onUnlock, onForgot, dark }) {
  const [entry, setEntry] = useState("");
  const [error, setError] = useState(false);
  const [confirmForgot, setConfirmForgot] = useState(false);
  const [resetText, setResetText] = useState("");

  function digit(d) {
    if (entry.length >= 4) return;
    const next = entry + d;
    setEntry(next);
    if (next.length === 4) {
      verifyPin(next,pin).then((valid) => {
        if (valid) {
          setTimeout(() => onUnlock(next), 150);
        } else {
          setError(true);
          setTimeout(() => { setEntry(""); setError(false); }, 500);
        }
      });
    }
  }

  return (
    <div style={{ minHeight: "100%", width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 18px", background: dark ? "#0A100D" : "#F5F6F0" }}>
      <div style={{ width: "100%", maxWidth: 560, boxSizing: "border-box", background: dark ? "#182019" : "#FFFFFF", border: `1px solid ${dark ? "#2B342E" : "#E7E9E1"}`, borderRadius: 30, padding: "34px 28px 28px", boxShadow: "0 24px 60px rgba(0,0,0,0.28)", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
          <LogoMark size={48} />
          <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 27, letterSpacing: "-0.8px", color: dark ? "#F1F4F0" : "#12181B", lineHeight: 1 }}>
            Pocket<span style={{ color: "#F47B20" }}>Rule</span>
          </div>
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: dark ? "rgba(241,244,240,0.62)" : "#707E74", margin: "0 0 22px" }}>Welcome back 👋</p>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 21, color: dark ? "#FFFFFF" : "#12181B", margin: "0 0 5px" }}>Enter your PIN</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: error ? "#FF8A80" : (dark ? "rgba(241,244,240,0.48)" : "#707E74"), margin: "0 0 22px", minHeight: 18 }}>
          {error ? "Wrong PIN, try again" : "Unlock PocketRule"}
        </p>
        <PinPad value={entry} onDigit={digit} onDelete={() => setEntry(entry.slice(0, -1))} dark={dark} shake={error} />

        <div style={{ marginTop: 26, width: "100%", display: "flex", justifyContent: "center" }}>
          {!confirmForgot ? (
            <button onClick={() => setConfirmForgot(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#F47B20", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, textDecoration: "underline", textUnderlineOffset: 3 }}>
              Forgot your PIN?
            </button>
          ) : (
            <div style={{ background: dark ? "rgba(226,87,76,0.14)" : "#FDEDEB", border: "1px solid rgba(226,87,76,0.4)", borderRadius: 14, padding: 14, width: "100%", maxWidth: 330, boxSizing: "border-box" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: dark ? "rgba(241,244,240,0.85)" : "#12181B", margin: "0 0 10px", lineHeight: 1.5 }}>
                Resetting clears every Rule, your saved History, and all settings — starting over from scratch.
              </p>
              <input
                value={resetText}
                onChange={(e) => setResetText(e.target.value)}
                placeholder="Type RESET to continue"
                autoComplete="off"
                style={{
                  width: "100%", boxSizing: "border-box", marginBottom: 9,
                  border: "1px solid rgba(255,255,255,0.18)", borderRadius: 9,
                  padding: "10px 11px", background: dark ? "rgba(255,255,255,0.05)" : "#F1F3EC",
                  color: dark ? "#fff" : "#12181B", fontFamily: "Inter, sans-serif", fontSize: 12
                }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  disabled={resetText.trim().toLowerCase() !== "reset"}
                  onClick={onForgot}
                  style={{ flex: 1, background: resetText.trim().toLowerCase() === "reset" ? CORAL : "rgba(255,255,255,0.12)", border: "none", borderRadius: 9, padding: "10px", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, cursor: resetText.trim().toLowerCase() === "reset" ? "pointer" : "not-allowed" }}
                >
                  Reset app
                </button>
                <button onClick={() => { setConfirmForgot(false); setResetText(""); }} style={{ flex: 1, background: "none", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 9, padding: "10px", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", alignItems: "center", gap: 8, color: dark ? "rgba(241,244,240,0.42)" : "#707E74", fontFamily: '"Roboto Mono", monospace', fontSize: 12, letterSpacing: "0.5px" }}>
          <span style={{ fontSize: 15 }}>🔒</span>
          <span>PIN protected</span><span>•</span><span>Stored locally</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   ONBOARDING
--------------------------------------------------------- */
function Onboarding({ onFinish, onCreateRule, rules, selectedRuleId, onSelectRule, currency, onCurrencyChange, onAddCurrency }) {
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);
  const [showAddCurrency, setShowAddCurrency] = useState(false);

  const starterRules = [
    rules.find((r) => r.id === "starter") || rules[0],
    rules.find((r) => r.id === "rule_50_30_20") || rules[1],
    rules.find((r) => r.id === "freelancer") || rules[0],
  ].filter(Boolean);

  const selectedRule = rules.find((r) => r.id === selectedRuleId) || starterRules[0];

  useEffect(() => {
    if (currency === "GEN") {
      const detected = detectLikelyCurrency();
      if (detected !== "GEN") onCurrencyChange(detected);
    }
  }, [currency, onCurrencyChange]);

  function finish() {
    onFinish(selectedRule?.id || rules[0]?.id || "starter");
  }

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: PAPER }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "26px 20px 8px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 9, margin: "0 auto 18px", padding: "7px 12px 7px 8px", borderRadius: 999, background: PAPER_DIM, border: `1px solid ${LINE}`, boxShadow: SHADOW_CARD }}>
            <LogoMark size={34} />
            <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 850, fontSize: 18, letterSpacing: "-0.035em", color: INK }}>PocketRule</span>
          </div>
          <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, color: GOLD, margin: "2px 0 9px", letterSpacing: .8 }}>QUICK SETUP</p>
          <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: "-0.045em", color: INK, margin: 0, lineHeight: 1.08 }}>
            Turn any money<br />into a <span style={{ color: GOLD }}>plan.</span>
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: MUTED, margin: "13px auto 0", lineHeight: 1.48, maxWidth: 320 }}>
            We’ve suggested a currency from your device settings. Pick a starting Rule and you’re ready to plan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCurrencySheet(true)}
          style={{
            width: "100%", marginTop: 21, display: "flex", alignItems: "center", gap: 12,
            textAlign: "left", background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 18,
            padding: "14px 15px", boxShadow: SHADOW_CARD, cursor: "pointer", color: INK
          }}
        >
          <div style={{ width: 42, height: 42, borderRadius: 13, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Globe2 size={21} color={GOLD} strokeWidth={2.2} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: 0, fontWeight: 800 }}>Your currency</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: INK, margin: "4px 0 0", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currencyLabel(selectedCurrency)}
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: MUTED, margin: "3px 0 0" }}>Suggested from your device settings</p>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: GOLD, fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
            Change <ChevronRight size={16} />
          </span>
        </button>

        <div style={{ marginTop: 22 }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 13, color: INK, margin: "0 0 10px", letterSpacing: .1 }}>How do you want to start?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {starterRules.map((r, index) => {
              const active = r.id === selectedRuleId;
              const isRecommended = index === 0;
              return (
                <button key={r.id} onClick={() => onSelectRule(r.id)} style={{
                  width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 14px", borderRadius: 18, border: `1.5px solid ${active ? GOLD : LINE}`,
                  background: active ? ACTIVE_TINT : PAPER_DIM, boxShadow: active ? "0 10px 25px -18px rgba(31,168,74,0.48)" : SHADOW_CARD,
                  cursor: "pointer", color: INK
                }}>
                  <div style={{ width: 43, height: 43, borderRadius: 13, background: active ? "#FFFFFF" : INPUT_BG, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <RuleIcon rule={r} size={20} color={active ? GOLD : INK} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 14.5, color: INK }}>{r.name}</span>
                      {isRecommended && <span style={{ padding: "3px 7px", borderRadius: 999, background: active ? "rgba(31,168,74,0.13)" : ACTIVE_TINT, color: GOLD, fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 800 }}>Recommended</span>}
                    </div>
                    <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, lineHeight: 1.4, margin: "4px 0 0" }}>
                      {r.categories.slice(0, 5).map((c) => `${c.name} ${c.pct}%`).join(" · ")}
                    </p>
                  </div>
                  {active ? <div style={{ width: 25, height: 25, borderRadius: 999, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={16} color="#fff" strokeWidth={3} /></div> : <ChevronRight size={18} color={MUTED} />}
                </button>
              );
            })}

            <button
              type="button"
              onClick={onCreateRule}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, textAlign: "left",
                padding: "14px", borderRadius: 18, border: `1.5px dashed ${GOLD}`,
                background: PAPER_DIM, color: INK, cursor: "pointer", boxShadow: "none"
              }}
            >
              <div style={{ width: 43, height: 43, borderRadius: 13, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Plus size={22} color={GOLD} strokeWidth={2.5} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 14.5, color: INK, margin: 0 }}>Create my own rule</p>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "4px 0 0" }}>Build a plan that fits your life</p>
              </div>
              <ChevronRight size={18} color={MUTED} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, margin: "18px 0 8px", color: MUTED }}>
          <Shield size={15} color={GOLD} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5 }}>Private by default. No bank access.</span>
        </div>
      </div>

      <PickerSheet
        open={showCurrencySheet}
        onClose={() => setShowCurrencySheet(false)}
        title="Choose your currency"
        value={currency}
        options={CURRENCIES.map((c) => ({ value: c.code, label: currencyLabel(c), onSelect: () => { onCurrencyChange(c.code); setShowCurrencySheet(false); } }))}
        onAddCustom={() => { setShowCurrencySheet(false); setShowAddCurrency(true); }}
        addCustomLabel="Add custom currency"
      />
      <CustomCurrencySheet
        open={showAddCurrency}
        onClose={() => setShowAddCurrency(false)}
        onSave={(name, code, symbol) => { onAddCurrency(name, code, symbol); setShowAddCurrency(false); }}
      />

      <div style={{ padding: "10px 20px calc(16px + env(safe-area-inset-bottom))", borderTop: `1px solid ${LINE}`, background: PAPER, flexShrink: 0 }}>
        <PrimaryButton icon={ArrowRight} onClick={finish}>Continue with {selectedRule?.name || "Starter Split"}</PrimaryButton>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: MUTED, textAlign: "center", margin: "9px 0 0", lineHeight: 1.35 }}>
          You can create or change Rules anytime from the Rules tab.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   PHASE 2 — ACTIVE PAYDAY PLAN + SPENDING TRACKER
---------------------------------------------------------
*/

function AddMoneySheet({ open, onClose, onConfirm, currency, plan }) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (open) setAmount("");
  }, [open]);

  if (!open || !plan) return null;

  const value = Math.round(Number(String(amount).replace(/[^0-9]/g, "")) || 0);
  const pctTotal = (plan.categories || []).reduce((sum, c) => sum + (Number(c.pct) || 0), 0);
  const preview = value > 0 && pctTotal > 0
    ? (plan.categories || []).map((c) => ({
        ...c,
        added: Math.round(value * (Number(c.pct) || 0) / pctTotal),
      }))
    : [];

  // Fix rounding so the displayed category additions always add up exactly.
  if (preview.length && value > 0) {
    const diff = value - preview.reduce((sum, c) => sum + c.added, 0);
    if (diff !== 0) preview[preview.length - 1].added += diff;
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="add-money-title" style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(0,0,0,0.58)", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 14 }}>
      <div style={{ width: "min(100%, 500px)", maxHeight: "88vh", overflowY: "auto", background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: "22px 22px 16px 16px", padding: "18px 16px calc(16px + env(safe-area-inset-bottom))", boxShadow: "0 24px 70px rgba(0,0,0,0.34)" }}>
        <div style={{ width: 38, height: 4, borderRadius: 99, background: LINE, margin: "0 auto 15px" }} />
        <p id="add-money-title" style={{ fontFamily: "Sora, sans-serif", fontSize: 19, fontWeight: 800, color: INK, margin: 0 }}>Add money to this plan</p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "5px 0 15px", lineHeight: 1.4 }}>
          New money will be distributed using the same Rule that built this plan.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 8, background: INPUT_BG, border: `1px solid ${LINE}`, borderRadius: 14, padding: "10px 12px" }}>
          <span style={{ fontFamily: "Roboto, sans-serif", fontWeight: 800, fontSize: 25, color: INK }}>{currencySymbol(currency)}</span>
          <input
            autoFocus
            inputMode="numeric"
            value={amount ? Number(amount).toLocaleString("en-US") : ""}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="0"
            aria-label="Additional amount"
            style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", color: INK, fontFamily: "Roboto, sans-serif", fontWeight: 800, fontSize: 27 }}
          />
        </div>

        {value > 0 && (
          <div style={{ marginTop: 14, background: ACTIVE_TINT, border: `1px solid ${LINE}`, borderRadius: 14, padding: "11px 12px" }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: .6, margin: 0 }}>Added to your plan</p>
            <div style={{ marginTop: 7, display: "flex", flexDirection: "column", gap: 5 }}>
              {preview.map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontFamily: "Inter, sans-serif", fontSize: 12, color: INK }}>
                  <span>{c.name} <span style={{ color: MUTED }}>({c.pct}%)</span></span>
                  <strong>{formatMoney(c.added, currency)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 15 }}>
          <button onClick={onClose} style={{ border: `1px solid ${LINE}`, background: "transparent", color: INK, borderRadius: 12, padding: "12px 10px", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>Cancel</button>
          <button disabled={value <= 0} onClick={() => onConfirm(value)} style={{ border: "none", background: value > 0 ? GOLD_GRADIENT : "var(--pr-primary-disabled-bg)", color: value > 0 ? "#fff" : "var(--pr-primary-disabled-ink)", borderRadius: 12, padding: "12px 10px", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, cursor: value > 0 ? "pointer" : "not-allowed" }}>
            Add money
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanTracker({ plan, currency, onAddExpense, onEditExpense, onDeleteExpense, onAddMoney, onFinish, isDark, resourcePrompt, onOpenResource }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [successToast, setSuccessToast] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showAddMoney, setShowAddMoney] = useState(false);
  if (!plan) return null;

  const { transactions: txs, byCategory: spentByCategory } = getPlanLedgerTotals(plan);
  const useLedger = Boolean(plan.hasTransactionLedger);
  const displayCategories = plan.categories.map((c) => ({
    ...c,
    spent: useLedger ? Math.max(0, spentByCategory[String(c.id)] || 0) : Math.max(0, Number(c.spent) || 0),
  }));
  const totalBudget = Number(plan.income) || displayCategories.reduce((sum, c) => sum + (Number(c.budget) || 0), 0);
  const totalSpent = displayCategories.reduce((sum, c) => sum + (Number(c.spent) || 0), 0);
  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const progress = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
  const selected = displayCategories.find((c) => c.id === selectedCategoryId);

  return (
    <section style={{ marginTop: 2, paddingBottom: 10 }}>
      {/* Active plan hero */}
      <div className="pr-rise" style={{
        background: GOLD_GRADIENT, color: "#fff", borderRadius: 24, padding: 18,
        boxShadow: "0 18px 38px -24px rgba(22,163,74,0.60)"
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.78)", margin: 0, textTransform: "uppercase", letterSpacing: .9, fontWeight: 800 }}>Active plan</p>
            <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 21, color: "#fff", margin: "5px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{plan.name || "Current plan"}</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.76)", margin: "4px 0 0" }}>{new Date(plan.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 13, background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Calendar size={22} color="#fff" strokeWidth={2.1} />
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 22 }}>
          <p className="pr-money" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 800, fontSize: 34, letterSpacing: "-0.045em", margin: 0, color: "#fff" }}>{formatMoney(totalRemaining, currency)}</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, margin: "4px 0 0", color: "rgba(255,255,255,0.86)", textTransform: "uppercase", letterSpacing: .8 }}>Remaining</p>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.22)", margin: "17px 0 13px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", textAlign: "center" }}>
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.20)" }}>
            <p className="pr-money" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 800, fontSize: 15, margin: 0 }}>{formatMoney(totalSpent, currency)}</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, margin: "3px 0 0", color: "rgba(255,255,255,0.75)" }}>Spent</p>
          </div>
          <div>
            <p className="pr-money" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 800, fontSize: 15, margin: 0 }}>{formatMoney(totalBudget, currency)}</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, margin: "3px 0 0", color: "rgba(255,255,255,0.75)" }}>Planned</p>
          </div>
        </div>

        <div style={{ marginTop: 15 }}>
          <div style={{ height: 7, background: "rgba(255,255,255,0.28)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "#fff", borderRadius: 999, transition: "width 220ms ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontFamily: "Inter, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.80)" }}>
            <span>{Math.round(progress)}% spent</span><span>100%</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="pr-press"
        onClick={() => setShowAddMoney(true)}
        style={{
          width: "100%", marginTop: 10, border: `1.5px solid ${GOLD}`, background: PAPER_DIM, color: GOLD,
          borderRadius: 14, padding: "12px 14px", fontFamily: "Inter, sans-serif", fontWeight: 800,
          fontSize: 13, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7
        }}
      >
        <Plus size={17} strokeWidth={2.8} /> Add money to this plan
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 13 }}>
        <div style={{ background: ACTIVE_TINT, border: `1px solid ${LINE}`, borderRadius: 15, padding: "12px 8px", textAlign: "center" }}>
          <p className="pr-money" style={{ fontSize: 14, fontWeight: 800, margin: 0, color: INK }}>{formatMoney(totalRemaining, currency)}</p>
          <p style={{ fontSize: 10.5, margin: "4px 0 0", color: MUTED }}>Remaining</p>
        </div>
        <div style={{ background: INPUT_BG, border: `1px solid ${LINE}`, borderRadius: 15, padding: "12px 8px", textAlign: "center" }}>
          <p className="pr-money" style={{ fontSize: 14, fontWeight: 800, margin: 0, color: INK }}>{formatMoney(totalSpent, currency)}</p>
          <p style={{ fontSize: 10.5, margin: "4px 0 0", color: MUTED }}>Spent</p>
        </div>
        <div style={{ background: "var(--pr-surface-green)", border: `1px solid ${LINE}`, borderRadius: 15, padding: "12px 8px", textAlign: "center" }}>
          <p className="pr-number" style={{ fontSize: 14, fontWeight: 800, margin: 0, color: "var(--pr-progress-text)" }}>{Math.round(progress)}%</p>
          <p style={{ fontSize: 10.5, margin: "4px 0 0", color: MUTED }}>Progress</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, margin: "22px 2px 10px" }}>
        <div>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: .7, textTransform: "uppercase", color: MUTED, margin: 0 }}>Your categories</p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: MUTED, margin: "3px 0 0" }}>Tap a category to record spending.</p>
        </div>
        <span style={{ color: GOLD, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{displayCategories.length} categories</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {displayCategories.map((c, index) => {
          const remaining = c.budget - c.spent;
          const pct = c.budget > 0 ? Math.min(100, Math.max(0, (c.spent / c.budget) * 100)) : 0;
          const over = c.spent > c.budget;
          const complete = c.budget > 0 && c.spent === c.budget;
          const rawPlanPct = Number(c.pct);
          const planPct = Number.isFinite(rawPlanPct) ? (Number.isInteger(rawPlanPct) ? String(rawPlanPct) : rawPlanPct.toFixed(1).replace(/\.0$/, "")) : "0";
          return (
            <button className="pr-press" key={c.id} onClick={() => setSelectedCategoryId(c.id)} style={{
              width: "100%", textAlign: "left", border: `1px solid ${over ? CORAL : LINE}`,
              borderRadius: 17, padding: "11px 12px 9px", background: PAPER_DIM, cursor: "pointer",
              color: INK, boxShadow: SHADOW_CARD, transition: "transform 150ms ease, opacity 150ms ease",
              animation: `pr-rise 180ms ease ${Math.min(index * 18, 120)}ms both`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: over ? DANGER_BG : ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CategoryIcon name={c.name} size={19} color={over ? CORAL : GOLD} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 13.5, color: INK }}>{c.name}</span>
                    {/* Always show the budgeted amount here. Overspending is shown separately below. */}
                    <span className="pr-money" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 800, fontSize: 13.5, color: over ? CORAL : INK, flexShrink: 0 }}>{formatMoney(c.budget, currency)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginTop: 3 }}>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: MUTED }}>{planPct}% of plan · {formatMoney(c.spent, currency)} spent</span>
                    <span style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: over ? CORAL : GOLD, fontWeight: 700, flexShrink: 0 }}>
                      {over ? `${formatMoney(c.spent - c.budget, currency)} over` : complete ? "All spent" : `${formatMoney(Math.max(0, remaining), currency)} left`}
                    </span>
                  </div>
                </div>
                <ChevronRight size={17} color={MUTED} />
              </div>
              <div style={{ height: 4, background: "var(--pr-progress-track)", borderRadius: 999, overflow: "hidden", marginTop: 9 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: over ? CORAL : GOLD, borderRadius: 999, transition: "width 220ms ease" }} />
              </div>
            </button>
          );
        })}
      </div>

      {resourcePrompt && (
        <div className="pr-rise" style={{ marginTop: 15, background: ACTIVE_TINT, border: `1px solid ${LINE}`, borderRadius: 17, padding: "13px 14px" }}>
          <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 11.5, color: GOLD, fontWeight: 800, letterSpacing: .7 }}>A QUICK TIP FOR YOUR PLAN</p>
          <p style={{ margin: "5px 0 3px", fontFamily: "Sora, sans-serif", fontSize: 14.5, lineHeight: 1.25, fontWeight: 800, color: INK }}>{resourcePrompt.title}</p>
          <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.4, color: MUTED }}>{resourcePrompt.message}</p>
          <button type="button" onClick={() => onOpenResource(resourcePrompt.id)} style={{ marginTop: 9, border: "none", background: GOLD_GRADIENT, color: "#fff", borderRadius: 10, padding: "9px 12px", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
            Learn about {resourcePrompt.id === "debt" ? "debt" : resourcePrompt.id === "saving" ? "saving" : resourcePrompt.id === "investing" ? "investing" : "family money"} →
          </button>
        </div>
      )}

      <button
        type="button"
        className="pr-press"
        onClick={() => setConfirmFinish(true)}
        style={{
          width: "100%", marginTop: 15, border: `1.5px solid ${GOLD}`, background: PAPER_DIM, color: GOLD,
          borderRadius: 15, padding: "13px 12px", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 13,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7
        }}
      >
        <Check size={17} strokeWidth={2.8} /> Finish plan
      </button>
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 11.5, color: MUTED, margin: "6px 0 0", textAlign: "center" }}>Move this plan to Completed Plans. You can still review it later.</p>

      {selected && (
        <SpendSheet
          category={selected}
          currency={currency}
          transactions={txs.filter((t) => String(t.categoryId) === String(selected.id)).slice().sort((a,b) => b.date - a.date)}
          editingTransaction={editingTransaction}
          onStartEdit={(tx) => setEditingTransaction(tx)}
          onClose={() => { setSelectedCategoryId(null); setEditingTransaction(null); }}
          isDark={isDark}
          onEdit={(transactionId, amount, note) => {
            onEditExpense?.(transactionId, amount, note);
            setEditingTransaction(null);
            setSelectedCategoryId(null);
            setSuccessToast({ category: selected.name, amount, edited: true });
            window.clearTimeout(window.__prToastTimer);
            window.__prToastTimer = window.setTimeout(() => setSuccessToast(null), 1900);
          }}
          onDelete={(txId) => {
            const deletedTx = txs.find((t) => t.id === txId);
            onDeleteExpense?.(txId);
            setEditingTransaction(null);
            setSelectedCategoryId(null);
            setSuccessToast({ category: selected.name, amount: Number(deletedTx?.amount) || 0, deleted: true });
            window.clearTimeout(window.__prToastTimer);
            window.__prToastTimer = window.setTimeout(() => setSuccessToast(null), 1900);
          }}
          onAdd={(amount, note) => {
            onAddExpense(selected.id, amount, note);
            setSelectedCategoryId(null);
            setSuccessToast({ category: selected.name, amount });
            window.clearTimeout(window.__prToastTimer);
            window.__prToastTimer = window.setTimeout(() => setSuccessToast(null), 1900);
          }}
        />
      )}

      <AddMoneySheet
        open={showAddMoney}
        onClose={() => setShowAddMoney(false)}
        onConfirm={(amount) => { setShowAddMoney(false); onAddMoney(amount); }}
        currency={currency}
        plan={plan}
      />

      {confirmFinish && (
        <ConfirmSheet
          title="Finish this plan?"
          body="Your plan will move to completed plans. You can still review what you spent."
          cancelLabel="Keep plan"
          confirmLabel="Finish plan"
          onCancel={() => setConfirmFinish(false)}
          onConfirm={() => { setConfirmFinish(false); onFinish(); }}
        />
      )}

      {successToast && (
        <div role="status" aria-live="polite" className="pr-rise" style={{
          position: "fixed", left: "50%", bottom: 78, transform: "translateX(-50%)", zIndex: 100,
          width: "calc(100% - 48px)", maxWidth: 340, background: isDark ? "#F1F4F0" : "#12181B",
          color: isDark ? "#12181B" : "#FFFFFF", borderRadius: 15, padding: "11px 13px",
          display: "flex", alignItems: "center", gap: 9, boxShadow: "0 14px 32px rgba(0,0,0,0.28)"
        }}>
          <div style={{ width: 25, height: 25, borderRadius: 999, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={14} color="#fff" strokeWidth={3} /></div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, margin: 0 }}>{successToast.deleted ? "Spending deleted" : successToast.edited ? "Spending updated" : "Spending recorded"}</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: isDark ? "rgba(18,24,27,0.68)" : "rgba(255,255,255,0.72)", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {formatMoney(successToast.amount, currency)} {successToast.deleted ? "removed from" : successToast.edited ? "updated in" : "added to"} {successToast.category}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}


function DeleteSpendingModal({ isDark, formattedAmount, categoryName, onCancel, onConfirm }) {
  const bg = isDark ? "#17201B" : "#FFFFFF";
  const ink = isDark ? "#F4F7F2" : "#12181B";
  const muted = isDark ? "#D1DDD5" : "#46534C";
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="delete-spending-title"
      style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(0,0,0,0.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 370, background: bg, color: ink, borderRadius: 22, padding: 22, boxShadow: "0 24px 70px rgba(0,0,0,0.35)", border: `1px solid ${isDark ? "#29362F" : "#E5EAE5"}` }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: isDark ? "#352020" : "#FFF0EF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 13 }}>
          <Trash2 size={20} color={CORAL} />
        </div>
        <h2 id="delete-spending-title" style={{ margin: "0 0 7px", fontFamily: "Inter, sans-serif", fontSize: 18, fontWeight: 850 }}>Delete spending entry?</h2>
        <p style={{ margin: "0 0 20px", color: muted, fontFamily: "Inter, sans-serif", fontSize: 13.5, lineHeight: 1.55 }}>
          Remove {formattedAmount} spent on {categoryName}? This will update your category total and plan insights.
        </p>
        <div style={{ display: "flex", gap: 9 }}>
          <button type="button" onClick={onCancel}
            style={{ flex: 1, border: `1px solid ${isDark ? "#53645A" : "#DCE3DD"}`, background: "transparent", color: ink, borderRadius: 12, padding: "11px 10px", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 13 }}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm}
            style={{ flex: 1, border: "none", background: CORAL, color: "#fff", borderRadius: 12, padding: "11px 10px", fontFamily: "Inter, sans-serif", fontWeight: 850, fontSize: 13 }}>
            Delete entry
          </button>
        </div>
      </div>
    </div>
  );
}

function SpendSheet({ category, currency, transactions = [], onClose, onAdd, onEdit, onDelete, onStartEdit, editingTransaction, isDark }) {
  const activeEdit = editingTransaction || null;
  const [amount, setAmount] = useState(activeEdit ? String(activeEdit.amount) : "");
  const [note, setNote] = useState(activeEdit?.note || "");
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    setAmount(activeEdit ? String(activeEdit.amount) : "");
    setNote(activeEdit?.note || "");
    setShowDelete(false);
    setShowAllTransactions(false);
  }, [activeEdit?.id]);

  const amountNum = Number(String(amount).replace(/[^0-9]/g, "")) || 0;
  const ledgerSpent = transactions.reduce((sum, t) => sum + Math.max(0, Number(t.amount) || 0), 0);
  const currentSpent = ledgerSpent;
  const remaining = category.budget - currentSpent;
  const baseSpent = activeEdit ? currentSpent - Number(activeEdit.amount || 0) : currentSpent;
  const projected = baseSpent + amountNum;
  const willOver = amountNum > 0 && projected > category.budget;
  const overBy = Math.max(0, projected - category.budget);
  const planAmount = Math.max(0, Number(category.budget) || 0);
  const quickAmounts = [
    { label: "¼", value: Math.round(planAmount / 4) },
    { label: "½", value: Math.round(planAmount / 2) },
    { label: "All", value: planAmount },
  ].filter((item, index, arr) => item.value > 0 && arr.findIndex((x) => x.value === item.value) === index);

  const isEditing = Boolean(activeEdit);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "flex-end" }}>
      <button aria-label="Close" onClick={onClose} style={{ position: "absolute", inset: 0, border: "none", background: "rgba(10,14,11,0.56)", cursor: "pointer" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 520, maxHeight: "88vh", overflowY: "auto", boxSizing: "border-box", margin: "0 auto", overscrollBehavior: "contain", background: PAPER_DIM, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: "12px 20px 24px", boxShadow: "0 -20px 40px rgba(0,0,0,0.32)" }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: LINE, margin: "0 auto 14px" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 20 }}>{categoryEmoji(category.name)}</span></div>
            <div>
              <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 16, color: INK, margin: 0 }}>{category.name}</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "2px 0 0" }}>{isEditing ? "Edit spending entry" : "Add a spending entry"}</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ border: "none", background: INPUT_BG, color: MUTED, borderRadius: 999, width: 34, height: 34, fontSize: 18, cursor: "pointer" }}>×</button>
        </div>

        <div style={{ marginTop: 10, background: INPUT_BG, border: `1px solid ${LINE}`, borderRadius: 16, padding: "13px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, textTransform: "uppercase", fontWeight: 800, letterSpacing: .35 }}>
              Remaining
            </span>
            <span style={{ fontFamily: "Roboto, sans-serif", fontWeight: 800, fontSize: 19, color: remaining < 0 ? CORAL : GOLD }}>
              {formatMoney(Math.max(0, remaining), currency)}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 7 }}>
          {[["Planned", category.budget, INK], ["Spent", currentSpent, INK]].map(([label, value, color]) => (
            <div key={label} style={{ background: INPUT_BG, borderRadius: 12, padding: "9px 10px" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: 0 }}>{label}</p>
              <p style={{ fontFamily: "Roboto, sans-serif", fontWeight: 800, fontSize: 12, color, margin: "4px 0 0" }}>{formatMoney(value, currency)}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 9 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED }}>Category progress</span>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, fontWeight: 700 }}>
              {category.budget > 0 ? Math.min(100, Math.round((currentSpent / category.budget) * 100)) : 0}%
            </span>
          </div>
          <div style={{ height: 5, background: "var(--pr-progress-track)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${category.budget > 0 ? Math.min(100, Math.max(0, (currentSpent / category.budget) * 100)) : 0}%`, height: "100%", background: GOLD, borderRadius: 999 }} />
          </div>
        </div>

        <div style={{ marginTop: 9, background: GOLD_GRADIENT, borderRadius: 17, padding: 15, color: "#fff", boxShadow: SHADOW_BTN }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <label style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, opacity: 0.85, textTransform: "uppercase", letterSpacing: 0.35 }}>How much did you spend?</label>

          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, borderBottom: "1px dashed rgba(255,255,255,0.45)", paddingBottom: 6, marginTop: 4 }}>
            <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 25 }}>{currencySymbol(currency)}</span>
            <input autoFocus inputMode="numeric" value={amount ? Number(String(amount).replace(/[^0-9]/g, "")).toLocaleString("en-US") : ""} onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))} placeholder="0" style={{ width: "100%", border: "none", outline: "none", background: "transparent", color: "#fff", fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 31, lineHeight: 1.05 }} />
          </div>
        </div>

        {!isEditing && (
          <div style={{ display: "flex", gap: 6, marginTop: 9, overflowX: "auto", paddingBottom: 1 }}>
            {quickAmounts.map(({ label, value }) => (
              <button key={`${label}-${value}`} aria-label={`Use ${label} of plan: ${formatMoney(value, currency)}`} onClick={() => setAmount(String(value))} className="pr-press" style={{ border: `1px solid ${LINE}`, background: INPUT_BG, color: INK, borderRadius: 999, padding: "8px 13px", fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", transition: "transform 150ms cubic-bezier(0.2,0.8,0.2,1), opacity 150ms ease" }}>{label} · {formatMoney(value, currency)}</button>
            ))}
          </div>
        )}

        {willOver && <div style={{ marginTop: 9, padding: "9px 11px", borderRadius: 11, background: DANGER_BG, border: `1px solid ${CORAL}` }}><p style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, color: CORAL, margin: 0 }}>This goes over the category budget.</p><p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: CORAL, margin: "3px 0 0" }}>{formatMoney(overBy, currency)} over after this spending.</p></div>}

        <div style={{ marginTop: 8 }}>
          <label style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, color: MUTED, margin: "0 0 5px 2px", textTransform: "uppercase", letterSpacing: 0.35 }}>Note <span style={{ fontWeight: 600, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="What was this for?" style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", borderRadius: 11, border: `1px solid ${LINE}`, background: INPUT_BG, color: INK, fontFamily: "Inter, sans-serif", fontSize: 13, outline: "none", transition: "border-color 150ms ease, box-shadow 150ms ease" }} />
        </div>

        {!isEditing && transactions.length > 0 ? (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 12.5, color: INK }}>Recent spending</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED }}>{showAllTransactions ? `All ${transactions.length}` : `Latest ${Math.min(4, transactions.length)}`}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(showAllTransactions ? transactions : transactions.slice(0, 4)).map((t) => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, background: INPUT_BG, borderRadius: 10, padding: "8px 9px" }}>
                  <button type="button" onClick={() => onStartEdit?.(t)}
                    aria-label={`Edit ${t.note || "spending"} ${formatMoney(t.amount, currency)}`}
                    style={{ flex: 1, minWidth: 0, border: "none", background: "transparent", padding: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, textAlign: "left", color: INK, cursor: "pointer" }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, color: INK, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.note || "Spending"}</p>
                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "2px 0 0" }}>
                        {new Date(t.date).toLocaleDateString()} · <span style={{ fontFamily: "Roboto, sans-serif", fontWeight: 800, color: INK }}>−{formatMoney(t.amount, currency)}</span>
                      </p>
                    </div>
                  </button>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <button type="button" onClick={() => onStartEdit?.(t)} aria-label="Edit spending entry"
                      style={{ border: `1px solid ${LINE}`, background: "transparent", color: INK, borderRadius: 8, minWidth: 48, height: 30, padding: "0 8px", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800 }}>
                      <Pencil size={12} /> Edit
                    </button>
                    <button type="button" onClick={() => { setDeleteTransactionId(t.id); }} aria-label="Delete spending entry"
                      style={{ border: `1px solid ${isDark ? "#633B3B" : "#F0C8C4"}`, background: isDark ? "#2B1B1B" : "#FFF6F5", color: CORAL, borderRadius: 8, minWidth: 54, height: 30, padding: "0 8px", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800 }}>
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {transactions.length > 4 && (
              <button type="button" onClick={() => setShowAllTransactions((v) => !v)}
                style={{ width: "100%", marginTop: 7, border: `1px solid ${LINE}`, background: INPUT_BG, color: GOLD, borderRadius: 10, padding: "9px 10px", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                {showAllTransactions ? "Show latest 4" : `View all spending (${transactions.length})`}
              </button>
            )}
          </div>
        ) : !isEditing ? (
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, textAlign: "center", margin: "14px 0 0" }}>No spending recorded here yet.</p>
        ) : null}


        <div style={{ position: "sticky", bottom: 0, zIndex: 8, margin: "16px -20px -24px", padding: "10px 20px calc(10px + env(safe-area-inset-bottom))", background: PAPER_DIM, borderTop: `1px solid ${LINE}` }}>
          <div style={{ display: "grid", gridTemplateColumns: isEditing ? "1fr 1.2fr" : "1fr 1.2fr", gap: 8 }}>
            <GhostButton isDark={isDark} onClick={onClose}>Cancel</GhostButton>
            <PrimaryButton isDark={isDark} disabled={amountNum <= 0} onClick={() => isEditing ? onEdit(activeEdit.id, amountNum, note.trim()) : onAdd(amountNum, note.trim())}>{isEditing ? "Save changes" : "+ Add spending"}</PrimaryButton>
          </div>
          {isEditing && (
            <button type="button" onClick={() => setShowDelete(true)} style={{ width: "100%", marginTop: 8, border: "none", background: "transparent", color: CORAL, fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, padding: "5px 8px", cursor: "pointer" }}>
              Delete spending entry
            </button>
          )}
        </div>


        {(showDelete || deleteTransactionId) && (
          <DeleteSpendingModal
            isDark={isDark}
            formattedAmount={formatMoney((deleteTransactionId ? transactions.find((t) => t.id === deleteTransactionId)?.amount : activeEdit?.amount) || 0, currency)}
            categoryName={category.name}
            onCancel={() => { setShowDelete(false); setDeleteTransactionId(null); }}
            onConfirm={() => {
              const id = deleteTransactionId || activeEdit?.id;
              setShowDelete(false);
              setDeleteTransactionId(null);
              if (id) onDelete?.(id);
            }}
          />
        )}
      </div>
    </div>
  );
}


function BackupPasswordSheet({ mode, onCancel, onConfirm, isDark, error, loading }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const inputRef = useRef(null);
  const creating = mode === "create";
  const valid = creating
    ? password.length >= 8 && confirmPassword.length >= 8 && password === confirmPassword
    : password.length >= 1;

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 140);
    return () => clearTimeout(t);
  }, []);

  const submit = () => {
    if (!valid || loading) return;
    onConfirm({ password, confirmPassword });
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box", border: `1px solid ${LINE}`, borderRadius: 14,
    background: INPUT_BG, color: INK, outline: "none", padding: "14px 44px 14px 14px",
    fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 650,
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="backup-sheet-title" aria-describedby="backup-sheet-description" style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "flex-end" }}>
      <button aria-label="Close" onClick={onCancel} style={{ position: "absolute", inset: 0, border: "none", background: "rgba(10,14,11,0.62)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 520, maxHeight: "min(88vh, 720px)", margin: "0 auto", background: PAPER_DIM, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: "18px 20px calc(24px + env(safe-area-inset-bottom))", boxShadow: "0 -24px 60px rgba(0,0,0,0.35)", overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: LINE, margin: "0 auto 18px" }} />
        <div style={{ width: 48, height: 48, borderRadius: 15, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 13 }}>
          {creating ? <ShieldCheck size={23} color={GOLD} strokeWidth={2.4} /> : <Upload size={23} color={GOLD} strokeWidth={2.4} />}
        </div>
        <h3 id="backup-sheet-title" style={{ fontFamily: "Sora, sans-serif", fontWeight: 850, fontSize: 20, color: INK, margin: 0 }}>
          {creating ? "Create encrypted backup" : "Restore encrypted backup"}
        </h3>
        <p id="backup-sheet-description" style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, lineHeight: 1.55, color: MUTED, margin: "8px 0 16px" }}>
          {creating
            ? "Your backup is encrypted before it leaves PocketRule. You’ll need this password to restore it on another device."
            : "Enter the password used when this backup was created. PocketRule cannot recover a forgotten backup password."}
        </p>

        <label style={labelStyle}>Backup password</label>
        <div style={{ position: "relative", marginTop: 6 }}>
          <input ref={inputRef} type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} autoComplete={creating ? "new-password" : "current-password"} placeholder={creating ? "At least 8 characters" : "Enter backup password"} style={{ ...inputStyle, borderColor: error ? CORAL : LINE }} />
          <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", right: 6, top: 6, width: 40, height: 40, border: "none", borderRadius: 10, background: "transparent", color: MUTED, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {creating && <>
          <label style={{ ...labelStyle, display: "block", marginTop: 13 }}>Confirm password</label>
          <div style={{ position: "relative", marginTop: 6 }}>
            <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} autoComplete="new-password" placeholder="Re-enter your password" style={{ ...inputStyle, borderColor: error ? CORAL : LINE }} />
            <button type="button" aria-label={showConfirm ? "Hide password" : "Show password"} onClick={() => setShowConfirm(v => !v)} style={{ position: "absolute", right: 6, top: 6, width: 40, height: 40, border: "none", borderRadius: 10, background: "transparent", color: MUTED, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </>}

        <div style={{ minHeight: 28, marginTop: 9 }}>
          {error && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.45, color: CORAL, margin: 0 }}>{error}</p>}
          {!error && creating && password.length > 0 && password.length < 8 && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: 0 }}>Use at least 8 characters.</p>}
          {!error && creating && confirmPassword.length > 0 && password !== confirmPassword && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: CORAL, margin: 0 }}>Passwords do not match.</p>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 8, marginTop: 5 }}>
          <GhostButton onClick={onCancel}>Cancel</GhostButton>
          <PrimaryButton onClick={submit} disabled={!valid || loading}>{loading ? (creating ? "Encrypting…" : "Restoring…") : (creating ? "Create encrypted backup" : "Restore backup")}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function ConfirmSheet({ title, body, cancelLabel, confirmLabel, onCancel, onConfirm, zIndex = 90, icon = "check" }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex, display: "flex", alignItems: "flex-end" }}>
      <button aria-label="Close" onClick={onCancel} style={{ position: "absolute", inset: 0, border: "none", background: "rgba(10,14,11,0.56)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 520, margin: "0 auto", background: PAPER_DIM, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: "18px 20px 24px", boxShadow: "0 -20px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: LINE, margin: "0 auto 18px" }} />
        <div style={{ width: 46, height: 46, borderRadius: 15, background: icon === "warning" ? "rgba(239,92,87,0.12)" : ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{icon === "warning" ? <ShieldAlert size={22} color={CORAL} strokeWidth={2.5} /> : <Check size={22} color={GOLD} strokeWidth={3} />}</div>
        <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 18, color: INK, margin: 0 }}>{title}</h3>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, lineHeight: 1.5, color: MUTED, margin: "7px 0 0" }}>{body}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 18 }}>
          <GhostButton onClick={onCancel}>{cancelLabel}</GhostButton>
          <PrimaryButton onClick={onConfirm}>{confirmLabel}</PrimaryButton>
        </div>
      </div>
    </div>
  );
}


function ReminderSetupSheet({ open, reminder, setReminder, onLater, onEnable }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 98, display: "flex", alignItems: "flex-end" }}>
      <button aria-label="Close" onClick={onLater} style={{ position: "absolute", inset: 0, border: "none", background: "rgba(10,14,11,0.56)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 520, margin: "0 auto", background: PAPER_DIM, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: "18px 20px calc(24px + env(safe-area-inset-bottom))", boxShadow: "0 -20px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: LINE, margin: "0 auto 18px" }} />
        <div style={{ width: 46, height: 46, borderRadius: 15, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <Bell size={22} color={GOLD} strokeWidth={2.5} />
        </div>
        <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 19, color: INK, margin: 0 }}>Want a reminder?</h3>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, lineHeight: 1.5, color: MUTED, margin: "7px 0 14px" }}>
          Your first money plan is ready. PocketRule can remind you when it’s time to review what’s coming in and decide where it goes.
        </p>
        <ReminderPicker reminder={reminder} setReminder={setReminder} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 8, marginTop: 18 }}>
          <GhostButton onClick={onLater}>Maybe later</GhostButton>
          <PrimaryButton onClick={onEnable} icon={Bell}>Enable reminders</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function PlanNameSheet({ open, value, onChange, onCancel, onConfirm }) {
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  const trimmed = value.trim();
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 95, display: "flex", alignItems: "flex-end" }}>
      <button aria-label="Close" onClick={onCancel} style={{ position: "absolute", inset: 0, border: "none", background: "rgba(10,14,11,0.56)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: 520, margin: "0 auto", background: PAPER_DIM, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: "18px 20px calc(24px + env(safe-area-inset-bottom))", boxShadow: "0 -20px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: LINE, margin: "0 auto 18px" }} />
        <div style={{ width: 46, height: 46, borderRadius: 15, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <BookmarkPlus size={22} color={GOLD} strokeWidth={2.5} />
        </div>
        <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 19, color: INK, margin: 0 }}>Name your plan</h3>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, lineHeight: 1.5, color: MUTED, margin: "7px 0 14px" }}>
          Give this plan a name so you can recognize it later in your saved plans.
        </p>
        <label style={labelStyle}>Plan name</label>
        <input
          ref={inputRef}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && trimmed) onConfirm(); }}
          placeholder="e.g. August money plan"
          maxLength={60}
          style={{ width: "100%", boxSizing: "border-box", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 15, color: INK, border: `1.5px solid ${trimmed ? GOLD : LINE}`, borderRadius: 12, outline: "none", background: INPUT_BG, padding: "13px 12px" }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 8, marginTop: 14 }}>
          <GhostButton onClick={onCancel}>Cancel</GhostButton>
          <PrimaryButton disabled={!trimmed} onClick={onConfirm} icon={Check}>Save plan</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   HOME — simplified plan-first dashboard
--------------------------------------------------------- */

function CurrencyChangeWarning({ oldCurrency, newCurrency, onCancel, onConfirm }) {
  return (
    <ConfirmSheet
      title="Change currency?"
      body={`Your existing plans use ${oldCurrency}. Changing to ${newCurrency} may make Spending Insights harder to compare. Existing plans will keep their original currency.`}
      cancelLabel="Cancel"
      confirmLabel="Change currency"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}

function PlanSavedToast({ isDark }) {
  return (
    <div role="status" aria-live="polite" className="pr-rise" style={{
      position: "fixed", left: "50%", bottom: 78, transform: "translateX(-50%)",
      zIndex: 120, width: "calc(100% - 48px)", maxWidth: 340,
      background: isDark ? "#F1F4F0" : "#12181B", color: isDark ? "#12181B" : "#FFFFFF",
      borderRadius: 15, padding: "11px 13px", display: "flex", alignItems: "center", gap: 9,
      boxShadow: "0 14px 32px rgba(0,0,0,0.28)"
    }}>
      <div style={{ width: 25, height: 25, borderRadius: 999, background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Check size={14} color="#fff" strokeWidth={3} />
      </div>
      <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, margin: 0 }}>Plan saved</p>
    </div>
  );
}

function HomeScreen({ rules, activeRule, income, setIncome, currency, onSave, onShare, onSelectRule, onEditActive, onHistory, onCurrencyChange, onAddCurrency, historyCount, notes, setNotes, planName, setPlanName, saved, savedSignature, activePlan, onAddExpense, onEditExpense, onDeleteExpense, onAddMoney, onFinishPlan, isDark, resourcePrompt, onOpenResource }) {
  const colored = withColors(activeRule.categories);
  const incomeNum = Number(income) || 0;
  const allocated = calculateCategories(incomeNum, colored);
  const total = Math.round(activeRule.categories.reduce((s, c) => s + c.pct, 0) * 10) / 10;
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);
  const [showAddCurrency, setShowAddCurrency] = useState(false);
  const [showRuleSheet, setShowRuleSheet] = useState(false);
  const amountInputRef = useRef(null);
  const isValid = incomeNum > 0 && Math.abs(total - 100) < 0.01;

  useEffect(() => {
    if (activePlan) return;
    const timer = setTimeout(() => {
      amountInputRef.current?.focus({ preventScroll: true });
    }, 180);
    return () => clearTimeout(timer);
  }, [activePlan]);

  return (
    <div style={{ padding: "4px 18px 28px" }}>
      {!activePlan && (
        <section style={{ marginBottom: 16 }}>
          <div style={{
            background: HERO_GRADIENT, borderRadius: 22, padding: 18, color: "#fff",
            boxShadow: "0 16px 34px -24px rgba(22,163,74,0.42)"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", opacity: 0.72, margin: 0 }}>
                  Amount to plan
                </p>
                <button
                  onClick={() => setShowCurrencySheet(true)}
                  aria-label="Change currency"
                  style={{
                    marginTop: 5, display: "inline-flex", alignItems: "center", gap: 5,
                    background: "transparent", color: "#fff", border: "none", padding: 0,
                    fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12,
                    cursor: "pointer", textAlign: "left"
                  }}
                >
                  <span>{currencyLabel(CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0])}</span>
                  <ChevronDown size={12} />
                </button>
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 44, height: 34, padding: "0 10px", borderRadius: 999,
                background: "rgba(255,255,255,0.13)", fontFamily: "Roboto, sans-serif",
                fontWeight: 800, fontSize: 13
              }}>
                {currencySymbol(currency)}
              </span>
            </div>

            <div style={{
              marginTop: 14, display: "flex", alignItems: "center", gap: 8,
              borderBottom: "1.5px dashed rgba(255,255,255,0.42)", paddingBottom: 10
            }}>
              <span aria-hidden="true" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 31, lineHeight: 1, color: "#fff" }}>
                {currencySymbol(currency)}
              </span>
              <input
                ref={amountInputRef}
                autoFocus
                inputMode="numeric"
                className="pr-amount-input"
                value={income ? Number(income).toLocaleString("en-US") : ""}
                onChange={(e) => setIncome(e.target.value.replace(/[^0-9]/g, ""))}
                aria-label="Plan amount"
                style={{
                  display: "block", flex: 1, minWidth: 0, height: 40,
                  fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 31,
                  letterSpacing: "-0.04em", color: "#fff", border: "none",
                  outline: "none", padding: 0, background: "transparent"
                }}
              />
            </div>

            <div style={{ marginTop: 13 }}>
              <span style={{
                display: "block", fontFamily: "Inter, sans-serif", fontSize: 12,
                fontWeight: 800, letterSpacing: .7, textTransform: "uppercase", opacity: .68
              }}>
                Using this rule
              </span>
              <button
                onClick={() => setShowRuleSheet(true)}
                style={{
                  width: "100%", marginTop: 5, display: "flex", alignItems: "center",
                  justifyContent: "space-between", gap: 8, border: "1px solid rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.10)", color: "#fff", borderRadius: 14,
                  padding: "11px 12px", fontFamily: "Inter, sans-serif", fontWeight: 800,
                  fontSize: 12, cursor: "pointer", textAlign: "left"
                }}
              >
                <span>{activeRule.name}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {activePlan ? (
        <PlanTracker
          plan={activePlan}
          currency={activePlan?.currency || currency}
          onAddExpense={onAddExpense}
          onEditExpense={onEditExpense}
          onDeleteExpense={onDeleteExpense}
          onAddMoney={onAddMoney}
          onFinish={onFinishPlan}
          isDark={isDark}
          resourcePrompt={resourcePrompt}
          onOpenResource={onOpenResource}
        />
      ) : (
        <>
          <section>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
              <div>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: .8, textTransform: "uppercase", color: MUTED, margin: 0 }}>
                  Your plan
                </p>
                <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 20, color: INK, margin: "3px 0 0", letterSpacing: "-0.03em" }}>
                  {formatMoney(incomeNum, currency)}
                </h2>
              </div>
              <button
                onClick={() => onEditActive(activeRule.id)}
                style={{
                  border: `1px solid ${LINE}`, background: ACTIVE_TINT, color: GOLD,
                  borderRadius: 999, padding: "7px 10px", fontFamily: "Inter, sans-serif",
                  fontWeight: 800, fontSize: 12, cursor: "pointer"
                }}
              >
                Edit rule
              </button>
            </div>

            <div aria-label="Plan breakdown" style={{ height: 7, display: "flex", gap: 2, overflow: "hidden", borderRadius: 999, background: LINE, margin: "0 0 10px" }}>
              {allocated.map((c) => (
                <div key={c.id} title={`${c.name} ${c.pct}%`} style={{ width: `${Math.max(0, Number(c.pct) || 0)}%`, background: GOLD, opacity: 0.9 }} />
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0, background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 17, overflow: "hidden" }}>
              {allocated.map((c, index) => (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 13px",
                  minHeight: 58, borderBottom: index < allocated.length - 1 ? `1px solid ${LINE}` : "none"
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CategoryIcon name={c.name} size={17} color={GOLD} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 13, color: INK }}>
                      {c.name}
                    </span>
                    <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, marginTop: 2 }}>
                      {c.pct}% of plan
                    </span>
                  </div>
                  <span className="pr-money" style={{ textAlign: "right", fontFamily: "Roboto, sans-serif", fontWeight: 800, fontSize: 13.5, color: INK, flexShrink: 0 }}>
                    {formatMoney(c.amount, currency)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: INPUT_BG, borderRadius: 13, padding: "10px 12px", marginTop: 8 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, color: MUTED }}>Total</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, color: isValid ? GOLD : CORAL }}>{total}% allocated</span>
                <span className="pr-money" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 800, fontSize: 13.5, color: INK }}>{formatMoney(incomeNum, currency)}</span>
              </div>
            </div>
          </section>

          <section style={{ marginTop: 14 }}>
            <div style={{
              background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 17,
              padding: 13
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: .7, textTransform: "uppercase", color: MUTED, margin: 0 }}>
                    Plan note
                  </p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "3px 0 9px" }}>
                    Optional. Add something you'll want to remember.
                  </p>
                </div>
                <BookmarkPlus size={16} color={GOLD} />
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything you want to remember about this plan..."
                rows={2}
                style={{
                  width: "100%", boxSizing: "border-box", resize: "none",
                  fontFamily: "Inter, sans-serif", fontSize: 13, color: INK,
                  border: `1px solid ${LINE}`, borderRadius: 12, outline: "none",
                  background: INPUT_BG, padding: "10px 11px", lineHeight: 1.4
                }}
              />
            </div>
          </section>

          <section style={{
            position: "sticky", bottom: 0, zIndex: 12,
            margin: "14px -18px -28px", padding: "10px 18px calc(10px + env(safe-area-inset-bottom))",
            background: `linear-gradient(to bottom, transparent, ${PAPER} 18%)`,
            borderTop: `1px solid ${LINE}`
          }}>
            <PrimaryButton icon={saved ? BookmarkCheck : BookmarkPlus} disabled={!isValid} onClick={onSave}>
              {saved ? "Plan saved" : "Start tracking this plan →"}
            </PrimaryButton>

            {!isValid && (
              <p style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "7px 0 0" }}>
                {incomeNum <= 0 ? "Enter any amount to build your plan." : "Allocate 100% before creating your plan."}
              </p>
            )}

            {savedSignature !== null && savedSignature === ruleSignature(activeRule, income) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: 8 }}>
                <GhostButton icon={Share2} onClick={onShare}>Share plan</GhostButton>
                <GhostButton icon={HistoryIcon} onClick={onHistory}>History{historyCount ? ` (${historyCount})` : ""}</GhostButton>
              </div>
            )}
          </section>
        </>
      )}
      {saved === "plan" && <PlanSavedToast isDark={isDark} />}
      <PickerSheet
        open={showCurrencySheet}
        onClose={() => setShowCurrencySheet(false)}
        title="Currency"
        value={currency}
        options={CURRENCIES.map((c) => ({ value: c.code, label: currencyLabel(c), onSelect: () => { onCurrencyChange(c.code); setShowCurrencySheet(false); } }))}
        onAddCustom={() => { setShowCurrencySheet(false); setShowAddCurrency(true); }}
        addCustomLabel="Add custom currency"
      />
      <CustomCurrencySheet
        open={showAddCurrency}
        onClose={() => setShowAddCurrency(false)}
        onSave={(name, code, symbol) => { onAddCurrency(name, code, symbol); setShowAddCurrency(false); }}
      />
      <PickerSheet
        open={showRuleSheet}
        onClose={() => setShowRuleSheet(false)}
        title="Choose a Rule"
        value={activeRule.id}
        options={sortRulesForDisplay(rules, activeRule?.id).map((r) => ({ value: r.id, label: r.name, onSelect: () => { onSelectRule(r.id); setShowRuleSheet(false); } }))}
      />
    </div>
  );
}


function getResourceRecommendation(categories) {
  const rows = (categories || []).map(c => ({
    name: String(c?.name || ""),
    pct: Number(c?.pct) || 0,
  }));
  const pick = (patterns, id, title, message) => {
    const match = rows
      .filter(c => patterns.some(p => c.name.toLowerCase().includes(p)))
      .sort((a,b) => b.pct - a.pct)[0];
    return match && match.pct >= 10 ? { id, title, message, pct: match.pct } : null;
  };
  return (
    pick(["debt", "loan", "credit"], "debt", "Want to eliminate debt faster?", "Your plan puts a meaningful amount toward debt. Learn a few practical ways to make debt repayment easier.") ||
    pick(["invest", "retirement", "wealth"], "investing", "Want to learn the basics of investing?", "You’ve given investing a place in your plan. Learn the basics before putting money to work.") ||
    pick(["saving", "emergency"], "saving", "Want to make saving easier?", "You’ve given saving a meaningful place in your plan. Learn simple ways to make it stick.") ||
    pick(["family", "wife", "husband", "kids", "children", "household"], "family", "Want to plan household money better?", "Your plan includes a meaningful amount for family or household needs. Learn practical ways to make the plan work together.") ||
    null
  );
}

/* ---------------------------------------------------------
   RULE EDITOR
--------------------------------------------------------- */
function RuleEditor({ initial, onCancel, onSave, firstRun }) {
  const [name, setName] = useState(initial.name);
  const emoji = initial.emoji || "📊";
  const [categories, setCategories] = useState(initial.categories.map((c, i) => ({ ...c, id: c.id || uid("c" + i) })));

  const total = Math.round(categories.reduce((s, c) => s + (Number(c.pct) || 0), 0) * 10) / 10;
  const colored = withColors(categories);
  const duplicateNames = (() => {
    const seen = new Set();
    const dupes = new Set();
    categories.forEach((c) => {
      const key = String(c.name || "").trim().replace(/\s+/g, " ").toLowerCase();
      if (!key) return;
      if (seen.has(key)) dupes.add(key);
      seen.add(key);
    });
    return dupes;
  })();
  const hasDuplicateNames = duplicateNames.size > 0;

  function updatePctValue(id, val) {
    // allow free typing (including a trailing "." for decimals) while keeping values non-negative
    if (val !== "" && Number(val) < 0) return;
    setCategories((cats) => cats.map((c) => (c.id === id ? { ...c, pct: val } : c)));
  }
  function updateName(id, val) {
    const normalized = val.trim().replace(/\s+/g, " ").toLowerCase();
    const duplicate = normalized && categories.some((c) => c.id !== id && c.name.trim().replace(/\s+/g, " ").toLowerCase() === normalized);
    setCategories((cats) => cats.map((c) => (c.id === id ? { ...c, name: val } : c)));
    if (duplicate) {
      // Keep the warning local to the editor; the Save button will also be disabled.
    }
  }
  function removeCat(id) {
    setCategories((cats) => cats.filter((c) => c.id !== id));
  }
  function addCat() {
    setCategories((cats) => [...cats, { id: uid("c"), name: "New category", pct: 0 }]);
  }
  function addCatNamed(name) {
    if (categories.some((c) => c.name.trim().replace(/\s+/g, " ").toLowerCase() === name.trim().replace(/\s+/g, " ").toLowerCase())) return;
    setCategories((cats) => [...cats, { id: uid("c"), name, pct: 0 }]);
  }
  function autoBalance() {
    setCategories((cats) => {
      if (cats.length === 0) return cats;
      const n = cats.length;
      const affectedCount = Math.min(3, n);
      const startIdx = n - affectedCount;
      const untouchedSum = cats.slice(0, startIdx).reduce((s, c) => s + (Number(c.pct) || 0), 0);
      const affected = cats.slice(startIdx);
      const affectedSum = affected.reduce((s, c) => s + (Number(c.pct) || 0), 0);
      const targetSum = Math.max(0, Math.round((100 - untouchedSum) * 10) / 10);

      let scaled;
      if (affectedSum <= 0) {
        const even = Math.floor((targetSum / affectedCount) * 10) / 10;
        scaled = affected.map(() => even);
      } else {
        const scale = targetSum / affectedSum;
        scaled = affected.map((c) => Math.round(((Number(c.pct) || 0) * scale) * 10) / 10);
      }
      const drift = Math.round((targetSum - scaled.reduce((a, b) => a + b, 0)) * 10) / 10;
      scaled[scaled.length - 1] = Math.max(0, Math.round((scaled[scaled.length - 1] + drift) * 10) / 10);
      return cats.map((c, i) => (i < startIdx ? c : { ...c, pct: scaled[i - startIdx] }));
    });
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      {firstRun ? (
        <div style={{ padding: "16px 20px 10px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <p style={{ fontFamily: "Roboto, sans-serif", fontSize: 12, letterSpacing: 1, color: GOLD, fontWeight: 600, margin: 0 }}>STEP 2 OF 2</p>
            <button
              onClick={() => onSave({ id: initial.id, name: initial.name, emoji, categories: initial.categories })}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 0", color: GOLD, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12.5, flexShrink: 0, whiteSpace: "nowrap" }}
            >
              Skip
            </button>
          </div>
          <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 21, letterSpacing: "-0.02em", color: INK, margin: "4px 0 0", lineHeight: 1.2, textAlign: "center" }}>Your first Rule</h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: MUTED, marginTop: 4, lineHeight: 1.35, textAlign: "center" }}>
            Start in seconds. You can edit this Rule anytime.
          </p>
        </div>
      ) : (
        <ScreenHeader title={initial.id ? "Edit Rule" : "New Rule"} subtitle="Name it, split it, make it yours." onBack={onCancel} />
      )}
      {!firstRun && (
        <div style={{ margin: "0 20px 12px", display: "flex", alignItems: "center", gap: 7, background: ACTIVE_TINT, border: `1px solid ${LINE}`, borderRadius: 10, padding: "8px 10px", color: MUTED }}>
          <Pencil size={13} color={GOLD} strokeWidth={2.4} />
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.3 }}>Tap any category name or percentage to edit it.</span>
        </div>
      )}
      <div style={{ padding: "0 20px" }}>
        <div style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 16, padding: 14, boxShadow: "none", marginBottom: 14 }}>
          <label style={{ ...labelStyle, marginBottom: 4 }}>Rule name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Salary, Freelance, Bonus"
            style={{ width: "100%", boxSizing: "border-box", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 15, color: INK, border: `1px solid ${LINE}`, borderRadius: R_SM, padding: "9px 12px", background: INPUT_BG }}
          />
          {firstRun && (
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, marginTop: 6, marginBottom: 0 }}>
              💡 Example: "Monthly plan"
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
          {colored.map((c) => (
            <div key={c.id} style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: R_MD, padding: "7px 10px", boxShadow: SHADOW_CARD }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <input
                  value={c.name}
                  onChange={(e) => updateName(c.id, e.target.value)}
                  style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 13.5, color: INK, padding: 0 }}
                />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={c.pct}
                  onChange={(e) => updatePctValue(c.id, e.target.value)}
                  style={{ width: 44, flexShrink: 0, boxSizing: "border-box", fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 12, color: GOLD, border: `1px solid ${LINE}`, borderRadius: 6, padding: "2px 4px", background: INPUT_BG }}
                />
                <span style={{ fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 12, color: GOLD, flexShrink: 0 }}>%</span>
                <button onClick={() => removeCat(c.id)} style={{ ...stepperBtn, width: 24, height: 24, borderRadius: 7, border: "none", color: CORAL, flexShrink: 0 }}><Trash2 size={13} /></button>
              </div>
              <div style={{ height: 4, borderRadius: 999, background: LINE, overflow: "hidden", marginTop: 5 }}>
                <div style={{ width: `${Math.min(Number(c.pct) || 0, 100)}%`, height: "100%", background: GOLD, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

        {hasDuplicateNames && (
          <div className="pr-shake" style={{ display: "flex", alignItems: "flex-start", gap: 8, background: DANGER_BG, border: `1px solid ${CORAL}`, color: INK, borderRadius: 12, padding: "10px 11px", marginBottom: 10 }}>
            <Info size={15} color={CORAL} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ margin: 0, fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12, color: INK }}>Duplicate category name</p>
              <p style={{ margin: "3px 0 0", fontFamily: "Inter, sans-serif", fontSize: 12, lineHeight: 1.35, color: MUTED }}>
                Each item can only appear once. Rename the duplicate before saving.
              </p>
            </div>
          </div>
        )}

        <button onClick={addCat} style={{ width: "100%", background: INPUT_BG, border: `1px solid ${LINE}`, borderRadius: R_SM, padding: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: MUTED, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", marginBottom: 10 }}>
          <Plus size={14} /> Add category
        </button>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
          {QUICK_CATEGORIES
            .filter((name) => !categories.some((c) => c.name.trim().toLowerCase() === name.toLowerCase()))
            .slice(0, 10)
            .map((name) => (
              <button
                key={name}
                onClick={() => addCatNamed(name)}
                style={{ background: INPUT_BG, border: `1px solid ${LINE}`, borderRadius: 999, padding: "4px 9px", color: INK, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
              >
                + {name}
              </button>
            ))}
        </div>

        <TotalCard total={total} />

        {total !== 100 && categories.length > 0 && (
          <GhostButton onClick={autoBalance} style={{ marginBottom: 12 }}>
            Auto-balance to 100%
          </GhostButton>
        )}

        <div style={{
          position: "sticky", bottom: 0, zIndex: 12, margin: "14px -20px -24px",
          padding: "10px 20px calc(10px + env(safe-area-inset-bottom))",
          background: `linear-gradient(to bottom, transparent, ${PAPER} 24%)`, borderTop: `1px solid ${LINE}`
        }}>
          <PrimaryButton
            icon={Check}
            disabled={total !== 100 || !name.trim() || hasDuplicateNames}
            onClick={() => onSave({ id: initial.id, name: name.trim(), emoji, categories: categories.map(({ name, pct }) => ({ name: name.trim().replace(/\s+/g, " "), pct: Number(pct) || 0 })) })}
          >
            {firstRun ? "Save & Continue" : "Save Rule"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   RULES SCREEN
--------------------------------------------------------- */

function sortRulesForDisplay(rules, activeRuleId) {
  return [...rules].sort((a, b) => {
    if (a.id === activeRuleId) return -1;
    if (b.id === activeRuleId) return 1;
    const aNew = Number(a.createdAt || 0);
    const bNew = Number(b.createdAt || 0);
    const aUsed = Number(a.lastUsedAt || 0);
    const bUsed = Number(b.lastUsedAt || 0);
    return Math.max(bUsed, bNew) - Math.max(aUsed, aNew);
  });
}

function RulesScreen({ rules, activeRuleId, onNew, onOpen, onDuplicate, onDelete }) {
  const [openRowKey, setOpenRowKey] = useState(null);
  return (
    <div style={{ paddingBottom: 24 }}>
      <div style={{ padding: "20px 20px 14px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 24, color: INK, margin: 0, textAlign: "center", width: "100%" }}>Rules</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13.5, color: MUTED, margin: "4px auto 12px" }}>Pick one to use, or build a new Rule.</p>
        <button
          onClick={onNew}
          aria-label="Add new Rule"
          title="Add new Rule"
          style={{ width: 50, height: 50, margin: "0 auto", borderRadius: 15, background: GOLD_GRADIENT, border: "none", boxShadow: SHADOW_BTN, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#052711" }}
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>
      <div style={{ height: 1, background: `repeating-linear-gradient(90deg, ${LINE} 0 6px, transparent 6px 12px)`, margin: "0 20px 16px" }} />
      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "0 20px 12px" }}>Swipe a Rule left for quick actions.</p>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {sortRulesForDisplay(rules, activeRuleId).map((r, i) => {
          const active = r.id === activeRuleId;
          return (
            <SwipeRow
              key={r.id}
              rowKey={r.id}
              openRowKey={openRowKey}
              setOpenRowKey={setOpenRowKey}
              actions={[
                { icon: Copy, label: "Copy", color: GOLD, onClick: () => onDuplicate(r.id) },
                { icon: Trash2, label: "Delete", color: CORAL, onClick: () => rules.length > 1 && onDelete(r.id) },
              ]}
            >
              <button
                onClick={() => onOpen(r.id)}
                style={{ width: "100%", textAlign: "left", background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: R_LG, padding: "13px 14px", boxShadow: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <RuleIcon rule={r} size={21} color={GOLD} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 15.5, color: INK, margin: 0 }}>{r.name}</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "3px 0 0", lineHeight: 1.35 }}>{ruleDescription(r)}</p>
                </div>
                {active && (
                  <span style={{ background: ACTIVE_TINT, color: GOLD, borderRadius: 999, padding: "4px 11px", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>Default</span>
                )}
                <ChevronRight size={18} color={MUTED} style={{ flexShrink: 0 }} />
              </button>
            </SwipeRow>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   RULE DETAIL — preview + actions, reached by tapping a Rule
--------------------------------------------------------- */
function RuleDetailScreen({ rule, isActive, canDelete, onBack, onUse, onEdit, onDuplicate, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!rule) {
    return (
      <div style={{ paddingBottom: 24 }}>
        <ScreenHeader title="Rule" onBack={onBack} />
        <div style={{ padding: "0 20px" }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: MUTED, textAlign: "center", marginTop: 20 }}>
            This Rule couldn't be found. It may have been deleted.
          </p>
        </div>
      </div>
    );
  }

  const colored = withColors(rule.categories);

  return (
    <div style={{ paddingBottom: 24 }}>
      <ScreenHeader
        title={rule.name}
        subtitle={`${rule.categories.length} categories`}
        onBack={onBack}
        right={isActive && (
          <span style={{ background: ACTIVE_TINT, border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 999, padding: "3px 10px", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
            Default
          </span>
        )}
      />
      <div style={{ padding: "0 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {colored.map((c) => (
            <div key={c.id} style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 12, padding: "11px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <CategoryIcon name={c.name} size={16} color={GOLD} />
                  </div>
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: INK }}>{c.name}</span>
                </div>
                <span style={{ fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 13, color: MUTED }}>{c.pct}%</span>
              </div>
              <div style={{ height: 5, borderRadius: 999, background: LINE, overflow: "hidden", marginTop: 8 }}>
                <div style={{ width: `${Math.min(Number(c.pct) || 0, 100)}%`, height: "100%", background: GOLD, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            position: "sticky", bottom: 0, zIndex: 12, margin: "0 -20px",
            padding: "10px 20px calc(10px + env(safe-area-inset-bottom))",
            background: `linear-gradient(to bottom, transparent, ${PAPER} 24%)`, borderTop: `1px solid ${LINE}`
          }}>
            <PrimaryButton icon={isActive ? Check : undefined} disabled={isActive} onClick={onUse}>
              {isActive ? "In use" : "Use this Rule"}
            </PrimaryButton>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <GhostButton icon={Pencil} onClick={onEdit} style={{ flex: 1 }}>Edit</GhostButton>
            <GhostButton icon={Copy} onClick={onDuplicate} style={{ flex: 1 }}>Duplicate</GhostButton>
          </div>
          {!canDelete && (
            <p style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: 0 }}>
              You need at least one Rule — add another before deleting this one.
            </p>
          )}
          {!confirmDelete ? (
            <GhostButton icon={Trash2} disabled={!canDelete} onClick={() => setConfirmDelete(true)} style={canDelete ? { color: CORAL, border: `1.5px solid ${CORAL}` } : {}}>
              Delete Rule
            </GhostButton>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center", background: DANGER_BG, border: `1px solid ${CORAL}`, borderRadius: 10, padding: 10 }}>
              <span style={{ flex: 1, fontFamily: "Inter, sans-serif", fontSize: 12, color: INK }}>Delete this Rule?</span>
              <button onClick={onDelete} style={{ background: CORAL, border: "none", borderRadius: 8, padding: "6px 12px", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Delete</button>
              <button onClick={() => setConfirmDelete(false)} style={{ background: "none", border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "6px 12px", color: INK, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   HISTORY SCREEN
--------------------------------------------------------- */
function HistoryScreen({ history, currency, onBack, onOpen, onDelete }) {
  const [openRowKey, setOpenRowKey] = useState(null);
  const sorted = [...history].sort((a, b) => b.date - a.date);
  return (
    <div style={{ paddingBottom: 24 }}>
      <ScreenHeader title="History" subtitle={`${history.length} saved plan${history.length === 1 ? "" : "s"}`} onBack={onBack} />
      <div style={{ padding: "0 20px" }}>
        {sorted.length === 0 && (
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: MUTED, textAlign: "center", marginTop: 30 }}>
            Nothing saved yet. Create a plan on Home, then tap "Save."
          </p>
        )}
        {sorted.length > 0 && (
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "0 0 8px" }}>Swipe an entry left to delete it.</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sorted.map((h) => (
            <SwipeRow
              key={h.id}
              rowKey={h.id}
              openRowKey={openRowKey}
              setOpenRowKey={setOpenRowKey}
              actions={[{ icon: Trash2, label: "Delete", color: CORAL, onClick: () => onDelete(h.id) }]}
            >
              <button
                onClick={() => onOpen(h.id)}
                style={{ width: "100%", textAlign: "left", background: PAPER_DIM, border: "none", borderRadius: 14, boxShadow: "none", padding: "11px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 13, color: INK, margin: 0 }}>{h.ruleName}</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "1px 0 0" }}>
                    {new Date(h.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 13.5, color: INK }}>{formatMoney(h.income, h.currency || currency)}</span>
                  <ChevronRight size={15} color={MUTED} />
                </div>
              </button>
            </SwipeRow>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   MONEY RULE CARD — shared green share-card look, used by
   both the live Share screen and the History detail screen
--------------------------------------------------------- */
function MoneyRuleCard({ ruleName, income, currency, categories }) {
  const colored = withColors(categories);
  const allocated = calculateCategories(income, colored);
  return (
    <div style={{ background: GREEN_CARD_GRADIENT, borderRadius: 26, padding: "26px 22px", color: "#FFFFFF", boxShadow: "0 20px 40px -20px rgba(10,46,27,0.6)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}><LogoMark size={30} /></div>
        <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", marginTop: 7 }}>Pocket<span style={{ color: BRAND_ORANGE }}>Rule</span></span>
        <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "rgba(255,255,255,0.65)", margin: "18px 0 4px" }}>{ruleName} · Income</p>
        <p className="pr-money" style={{ fontFamily: "Roboto, sans-serif", fontWeight: 600, fontSize: 32, margin: 0, letterSpacing: "-0.02em" }}>{formatMoney(income, currency)}</p>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.22)", margin: "18px 0" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {allocated.map((c) => (
          <div key={c.id} style={{ display: "grid", gridTemplateColumns: "28px minmax(0,1fr) 120px", alignItems: "center", gap: 10 }}>
            <span style={{ width: 28, textAlign: "center", fontSize: 18 }}>{categoryEmoji(c.name)}</span>
            <span style={{ minWidth: 0, fontFamily: "Inter, sans-serif", fontSize: 14.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
            <span className="pr-money" style={{ width: 120, textAlign: "right", fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 14.5 }}>{formatMoney(c.amount, currency)}</span>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.22)", margin: "18px 0 14px" }} />
      <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 15, textAlign: "center", margin: 0 }}>Turn Any Money Into a Plan.</p>
    </div>
  );
}

function buildMoneyRuleCanvas({ ruleName, income, currency, categories }) {
  const colored = withColors(categories);
  const allocated = calculateCategories(income, colored);
  const W = 720, PAD = 48, ROW_H = 56;
  const headerH = 190;
  const footerH = 90;
  const H = headerH + colored.length * ROW_H + footerH + PAD * 2;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createRadialGradient(W * 0.3, 0, 40, W * 0.3, 0, H * 0.95);
  grad.addColorStop(0, "#2FAE5E");
  grad.addColorStop(0.55, "#12572E");
  grad.addColorStop(1, "#0A2E1B");
  roundRectPath(ctx, 0, 0, W, H, 32);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.textBaseline = "alphabetic";
  let y = PAD + 34;

  roundRectPath(ctx, PAD, y - 34, 52, 52, 14);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fill();
  ctx.font = "26px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("📋", PAD + 13, y + 2);

  ctx.font = "700 26px Sora, Inter, sans-serif";
  ctx.fillText("PocketRule", PAD + 68, y);

  y += 66;
  ctx.font = "700 13px Inter, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.fillText(`${ruleName.toUpperCase()} · INCOME`, PAD, y);

  y += 46;
  ctx.font = "800 44px Sora, Inter, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(formatMoney(income, currency), PAD, y);

  y += 26;
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.beginPath(); ctx.moveTo(PAD, y); ctx.lineTo(W - PAD, y); ctx.stroke();

  y += 42;
  allocated.forEach((c) => {
    ctx.font = "22px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(categoryEmoji(c.name), PAD, y);
    ctx.font = "600 18px Inter, sans-serif";
    ctx.fillText(c.name, PAD + 38, y);
    const amt = formatMoney(c.amount, currency);
    ctx.font = "700 18px 'Fira Mono', monospace";
    const w = ctx.measureText(amt).width;
    ctx.fillText(amt, W - PAD - w, y);
    y += ROW_H;
  });

  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.beginPath(); ctx.moveTo(PAD, y - 14); ctx.lineTo(W - PAD, y - 14); ctx.stroke();

  y += 32;
  ctx.font = "700 18px Sora, Inter, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("Turn Any Money Into a Plan.", W / 2, y);
  ctx.textAlign = "left";

  return canvas;
}

async function exportMoneyRuleCardPng({ ruleName, income, currency, categories, filenameBase }) {
  const canvas = buildMoneyRuleCanvas({ ruleName, income, currency, categories });
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenameBase}.png`;
  a.click();
}

// Tries the real OS share sheet (WhatsApp, Instagram, X, etc.) first, with the
// image attached where the platform supports file-sharing. Falls back to a
// text-only share, then to clipboard + direct download if navigator.share
// isn't available at all (e.g. most desktop browsers).
async function shareMoneyRuleCard({ ruleName, income, currency, categories, filenameBase, shareText }) {
  const canvas = buildMoneyRuleCanvas({ ruleName, income, currency, categories });
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  const file = blob ? new File([blob], `${filenameBase}.png`, { type: "image/png" }) : null;

  try {
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: "PocketRule", text: shareText });
      return { method: "share-file" };
    }
    if (navigator.share) {
      await navigator.share({ title: "PocketRule", text: shareText });
      return { method: "share-text" };
    }
  } catch (err) {
    // user cancelled the share sheet — treat like a no-op, not a failure
    if (err && err.name === "AbortError") return { method: "cancelled" };
  }

  // No Web Share support at all — fall back to what we had before.
  try { await navigator.clipboard.writeText(shareText); } catch {}
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filenameBase}.png`;
  a.click();
  return { method: "fallback" };
}

/* ---------------------------------------------------------
   HISTORY DETAIL — reached by tapping a saved History entry
--------------------------------------------------------- */
function HistoryDetailScreen({ entry, currency, onBack }) {
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);

  if (!entry) {
    return (
      <div style={{ paddingBottom: 24 }}>
        <ScreenHeader title="Money Plan" onBack={onBack} />
        <div style={{ padding: "0 20px" }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: MUTED, textAlign: "center", marginTop: 20 }}>
            This entry couldn't be found. It may have been removed.
          </p>
        </div>
      </div>
    );
  }

  const displayCurrency = entry.currency || currency;
  const shareText = [
    "My PocketRule", "", "Turn Any Money Into a Plan.", `Rule: ${entry.ruleName}`, `Amount: ${formatMoney(entry.income, displayCurrency)}`, "",
    ...withColors(entry.categories).map((c) => `✓ ${c.name} — ${c.pct}%`), "",
    "Turn Any Money Into a Plan.", "Created with PocketRule",
  ].join("\n");

  async function handleShare() {
    setSharing(true);
    try {
      await shareMoneyRuleCard({
        ruleName: entry.ruleName,
        income: entry.income,
        currency: displayCurrency,
        categories: entry.categories,
        shareText,
        filenameBase: `${entry.ruleName.replace(/\s+/g, "-").toLowerCase()}-${new Date(entry.date).toISOString().slice(0, 10)}`,
      });
    } finally {
      setSharing(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      await exportMoneyRuleCardPng({
        ruleName: entry.ruleName,
        income: entry.income,
        currency: displayCurrency,
        categories: entry.categories,
        filenameBase: `${entry.ruleName.replace(/\s+/g, "-").toLowerCase()}-${new Date(entry.date).toISOString().slice(0, 10)}`,
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <ScreenHeader
        title="Money Plan"
        subtitle={new Date(entry.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        onBack={onBack}
      />
      <div style={{ padding: "0 20px" }}>
        <MoneyRuleCard ruleName={entry.ruleName} income={entry.income} currency={displayCurrency} categories={entry.categories} />

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            position: "sticky", bottom: 0, zIndex: 12, margin: "0 -20px",
            padding: "10px 20px calc(10px + env(safe-area-inset-bottom))",
            background: `linear-gradient(to bottom, transparent, ${PAPER} 24%)`, borderTop: `1px solid ${LINE}`
          }}>
            <PrimaryButton icon={Share2} onClick={handleShare} disabled={sharing}>
              {sharing ? "Opening share…" : "Share"}
            </PrimaryButton>
          </div>
          <GhostButton icon={Download} onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting…" : "Export as PNG"}
          </GhostButton>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SETTINGS SCREEN
--------------------------------------------------------- */

function SegmentedControl({ value, onChange, options }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 5, background: INPUT_BG, borderRadius: 12, padding: 4 }}>
      {options.map((option) => (
        <button key={option.value} type="button" onClick={() => onChange(option.value)}
          style={{ border: "none", borderRadius: 9, padding: "9px 7px", background: value === option.value ? PAPER_DIM : "transparent",
            color: value === option.value ? INK : MUTED, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800,
            cursor: "pointer", boxShadow: value === option.value ? SHADOW_CARD : "none" }}>
          {option.label}
        </button>
      ))}
    </div>
  );
}


function ordinal(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "";
  const mod100 = num % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${num}th`;
  if (num % 10 === 1) return `${num}st`;
  if (num % 10 === 2) return `${num}nd`;
  if (num % 10 === 3) return `${num}rd`;
  return `${num}th`;
}

function ReminderPicker({ reminder, setReminder }) {
  const frequency = reminder?.frequency || "off";
  const hour = Number(reminder?.hour) || 9;
  const ampm = reminder?.ampm || "AM";
  const day = reminder?.day || "Monday";
  const dayOfMonth = Number(reminder?.dayOfMonth) || 1;
  const date = reminderDateValue(reminder);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <select value={frequency} onChange={(e) => setReminder({ ...reminder, frequency: e.target.value })} aria-label="Money reminder frequency"
          style={{ width: "100%", border: `1px solid ${LINE}`, borderRadius: 10, padding: "10px 11px", fontFamily: "Inter, sans-serif", fontSize: 12 }}>
          <option value="off">Off</option><option value="once">One time</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
        </select>
        {frequency === "once" ? (
          <input type="date" value={date} min={new Date().toISOString().slice(0,10)} onChange={(e) => setReminder({ ...reminder, date: e.target.value })} aria-label="Money reminder date"
            style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${LINE}`, borderRadius: 10, padding: "9px 11px", fontFamily: "Roboto Mono, monospace", fontSize: 12, background: INPUT_BG, color: INK }} />
        ) : frequency === "weekly" ? (
          <select value={day} onChange={(e) => setReminder({ ...reminder, day: e.target.value })} aria-label="Money reminder day"
            style={{ width: "100%", border: `1px solid ${LINE}`, borderRadius: 10, padding: "10px 11px", fontFamily: "Inter, sans-serif", fontSize: 12 }}>
            {WEEKDAYS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        ) : frequency === "monthly" ? (
          <select value={dayOfMonth} onChange={(e) => setReminder({ ...reminder, dayOfMonth: Number(e.target.value) })} aria-label="Money reminder date"
            style={{ width: "100%", border: `1px solid ${LINE}`, borderRadius: 10, padding: "10px 11px", fontFamily: "Roboto Mono, monospace", fontSize: 12 }}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{ordinal(d)}</option>)}
          </select>
        ) : <div />}
      </div>
      {frequency !== "off" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
          <select value={hour} onChange={(e) => setReminder({ ...reminder, hour: Number(e.target.value) })} aria-label="Money reminder hour"
            style={{ width: "100%", border: `1px solid ${LINE}`, borderRadius: 10, padding: "10px 11px", fontFamily: "Roboto Mono, monospace", fontSize: 12 }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
          <select value={ampm} onChange={(e) => setReminder({ ...reminder, ampm: e.target.value })} aria-label="Money reminder AM or PM"
            style={{ width: "100%", border: `1px solid ${LINE}`, borderRadius: 10, padding: "10px 11px", fontFamily: "Inter, sans-serif", fontSize: 12 }}>
            <option value="AM">AM</option><option value="PM">PM</option>
          </select>
        </div>
      )}
      <div style={{ marginTop: 9, textAlign: "center" }}>
        <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED }}>
          {frequency === "off" ? "Money reminders are off." : "Get reminded when you're expecting money so you can plan it before you spend it."}
        </span>
      </div>
    </div>
  );
}

function SettingsScreen({ settings, onChange, onPinCreated, onLockNow, onReset, onAddCurrency, onExportBackup, onImportBackup, onRequestCurrencyChange, isDark }) {
  const [pinStep, setPinStep] = useState(null);
  const [reminderError, setReminderError] = useState("");
  const [firstPin, setFirstPin] = useState("");
  const [pinDraft, setPinDraft] = useState("");
  const [pinError, setPinError] = useState(false);
  const [openSupport, setOpenSupport] = useState(null);
  const [showCurrencySheet, setShowCurrencySheet] = useState(false);
  const [showAddCurrency, setShowAddCurrency] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");

  function startPinSetup() {
    setPinStep("enter"); setFirstPin(""); setPinDraft(""); setPinError(false);
  }
  function digit(d) {
    const next = pinDraft + d;
    if (next.length > 4) return;
    setPinDraft(next);
    if (next.length === 4) {
      if (pinStep === "enter") {
        setFirstPin(next);
        setTimeout(() => { setPinStep("confirm"); setPinDraft(""); }, 150);
      } else if (pinStep === "confirm") {
        if (next === firstPin) {
          derivePinVerifier(next).then((verifier) => {
            if (verifier) setPinStep(null);
            else setPinError(true);
            if (verifier) { onChange({ ...settings, pin: verifier }); onPinCreated?.(next); }
          });
        } else {
          setPinError(true);
          setTimeout(() => { setPinDraft(""); setPinError(false); setPinStep("enter"); setFirstPin(""); }, 500);
        }
      }
    }
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <ScreenHeader title="Settings" subtitle="Money display, appearance, and planning." />
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>

        <div>
          <label style={settingsLabelStyle}>Currency</label>
          <button
            onClick={() => setShowCurrencySheet(true)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: R_MD, padding: 14, boxShadow: "none", cursor: "pointer" }}
          >
            <span style={{ fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 13.5, color: INK }}>
              {currencyLabel(CURRENCIES.find((c) => c.code === settings.currency) || CURRENCIES[0])}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: GOLD, fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12.5 }}>
              Change <ChevronDown size={14} />
            </span>
          </button>
        </div>

        <div>
          <label style={settingsLabelStyle}>Appearance</label>
          <div style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: R_MD, padding: 14, boxShadow: "none" }}>
            <SegmentedControl
              value={settings.appearance}
              onChange={(appearance) => onChange({ ...settings, appearance })}
              options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }, { value: "system", label: "System" }]}
            />
          </div>
        </div>

        <div>
          <label style={settingsLabelStyle}>Plan Reminders</label>
          <div style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: R_MD, boxShadow: "none", overflow: "hidden" }}>
            <div style={{ padding: 14, borderBottom: `1px solid ${LINE}` }}>
              <ReminderPicker
                reminder={{ frequency: settings.reminderFrequency, date: settings.reminderDate, day: settings.reminderDay, dayOfMonth: settings.reminderDayOfMonth, hour: settings.reminderHour, ampm: settings.reminderAmpm }}
                setReminder={async (next) => {
                  setReminderError("");
                  const nextSettings = {
                    ...settings,
                    reminderFrequency: next.frequency,
                    reminderDate: next.date || "",
                    reminderDay: next.day,
                    reminderDayOfMonth: next.dayOfMonth,
                    reminderHour: next.hour,
                    reminderAmpm: next.ampm,
                  };
                  onChange(nextSettings);
                  if (isNativeApp() && settings.notificationsEnabled && next.frequency !== "off") {
                    const result = await schedulePocketRuleReminder({
                      frequency: next.frequency,
                      date: next.date,
                      day: next.day,
                      dayOfMonth: next.dayOfMonth,
                      hour: next.hour,
                      ampm: next.ampm,
                    }, { openSettingsIfNeeded: true });
                    if (!result.ok) {
                      setReminderError(result.reason === "exact-alarm-permission"
                        ? "Turn on Alarms & reminders for PocketRule, then return here."
                        : "PocketRule could not schedule that reminder.");
                    }
                  } else if (next.frequency === "off") {
                    await cancelPocketRuleReminder();
                  }
                }}
              />
            </div>
            <div style={{ padding: 14, borderBottom: `1px solid ${LINE}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Bell size={16} color={INK} />
                  <div>
                    <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: INK }}>Allow reminders</span>
                    <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 11.5, color: MUTED, marginTop: 2 }}>Needed for scheduled money reminders.</span>
                  </div>
                </div>
                <Switch
                  on={settings.notificationsEnabled}
                  onToggle={async () => {
                    setReminderError("");
                    if (settings.notificationsEnabled) {
                      onChange({ ...settings, notificationsEnabled: false });
                      await cancelPocketRuleReminder();
                      return;
                    }

                    const permission = await requestPocketRuleNotifications();
                    if (permission !== "granted") {
                      setReminderError("Allow notifications for PocketRule to receive reminders.");
                      return;
                    }

                    const reminder = {
                      frequency: settings.reminderFrequency,
                      date: settings.reminderDate,
                      day: settings.reminderDay,
                      dayOfMonth: settings.reminderDayOfMonth,
                      hour: settings.reminderHour,
                      ampm: settings.reminderAmpm,
                    };

                    if (reminder.frequency === "off") {
                      onChange({ ...settings, notificationsEnabled: true });
                      return;
                    }

                    const result = await schedulePocketRuleReminder(reminder, { openSettingsIfNeeded: true });
                    if (result.ok) {
                      onChange({ ...settings, notificationsEnabled: true });
                    } else {
                      onChange({ ...settings, notificationsEnabled: false });
                      setReminderError(result.reason === "exact-alarm-permission"
                        ? "Turn on Alarms & reminders for PocketRule, then return and enable reminders again."
                        : "PocketRule could not schedule the reminder. Please try again.");
                    }
                  }}
                />
              </div>
              {reminderError && (
                <p style={{ margin: "9px 0 0 24px", fontFamily: "Inter, sans-serif", fontSize: 11.5, lineHeight: 1.4, color: CORAL, fontWeight: 700 }}>
                  {reminderError}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label style={settingsLabelStyle}>Account</label>
          <div style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: R_MD, boxShadow: "none", overflow: "hidden" }}>
            <div style={{ padding: 14, borderBottom: `1px solid ${LINE}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Lock size={16} color={INK} />
                  <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: INK }}>PIN Lock</span>
                </div>
                <Switch
                  on={!!settings.pin}
                  onToggle={() => (settings.pin ? onChange({ ...settings, pin: null }) : startPinSetup())}
                />
              </div>

              {pinStep && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 12.5, color: pinError ? CORAL : MUTED, marginBottom: 14 }}>
                    {pinError ? "PINs didn't match — try again" : pinStep === "enter" ? "Choose a 4-digit PIN" : "Confirm your PIN"}
                  </p>
                  <PinPad value={pinDraft} onDigit={digit} onDelete={() => setPinDraft(pinDraft.slice(0, -1))} dark={isDark} shake={pinError} />
                </div>
              )}

              {settings.pin && !pinStep && (
                <button onClick={onLockNow} style={{ marginTop: 12, width: "100%", background: "none", border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "9px", color: INK, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>
                  Lock app now
                </button>
              )}
            </div>
            <div style={{ marginTop: 10, padding: 16, borderRadius: 14, background: BRAND_NAVY, color: "#fff", textAlign: "center" }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", color: "#A8DDB8", margin: 0 }}>POCKETRULE PRO</p>
              <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 16, margin: "5px 0 0" }}>More control. More insight.</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.68)", margin: "5px auto 0", lineHeight: 1.45, maxWidth: 260 }}>Advanced planning · backups · insights · ad-free</p>
              <div style={{ marginTop: 10 }}>
                <span style={{ display: "inline-flex", background: "rgba(255,255,255,0.1)", color: "#CBEFD4", borderRadius: 999, padding: "5px 11px", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12 }}>Coming soon</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label style={settingsLabelStyle}>Data & Backup</label>
          <div style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: R_MD, boxShadow: "none", overflow: "hidden" }}>
            <button onClick={onExportBackup} style={{ width: "100%", background: "none", border: "none", borderBottom: `1px solid ${LINE}`, padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Download size={16} color={INK} />
                <div style={{ textAlign: "left" }}>
                  <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: INK }}>Export backup</span>
                  <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, marginTop: 2 }}>Create an encrypted backup with a separate backup password. PocketRule cannot recover a forgotten backup password.</span>
                </div>
              </div>
              <ChevronRight size={16} color={MUTED} />
            </button>
            <button onClick={onImportBackup} style={{ width: "100%", background: "none", border: "none", padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Upload size={16} color={INK} />
                <div style={{ textAlign: "left" }}>
                  <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: INK }}>Restore backup</span>
                  <span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, marginTop: 2 }}>Restore an encrypted PocketRule backup using its backup password.</span>
                </div>
              </div>
              <ChevronRight size={16} color={MUTED} />
            </button>
          </div>
        </div>

        <div>
          <label style={settingsLabelStyle}>Support</label>
          <div style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: R_MD, boxShadow: "none", overflow: "hidden" }}>
            {[
              { icon: Info, label: "About PocketRule", body: [
                "PocketRule helps you decide where your money goes before you spend it. Set a rule, enter an amount, create a named plan, record spending, and review what happened.",
                "PocketRule is a planning tool, not a bank, lender, investment service, or financial adviser. Always use your own judgment for financial decisions."
              ] },
              { icon: Shield, label: "Privacy Policy", body: [
                "Last updated: August 2026",
                "Your privacy matters. PocketRule is designed around keeping your money-planning information under your control.",
                "1. Information stored locally — Plans, rules, spending history, settings, and PIN-related app data are stored on your device using the app's available storage. Exported backups are created only when you request them.",
                "2. Information we collect — PocketRule does not require us to receive your personal financial figures in order for the core planning features to work. If a future feature requires additional information, the app will explain what is needed before collection.",
                "3. Reminders — If you enable plan reminders, the app may request notification permission from your device. Reminder settings are stored with your app settings.",
                "4. Sharing — PocketRule does not automatically publish your plans. When you choose Share, the app uses your device's share sheet so you choose the destination.",
                "5. Backups — Exported backup files may contain your rules, plans, history, and settings. Treat backup files as private financial records and store them securely.",
                "6. Third-party services and advertising — PocketRule uses Google AdMob to display ads in eligible areas of the app. Google may process device and advertising information as described in Google's applicable privacy documentation. PocketRule uses the Google User Messaging Platform (UMP) consent flow where required. Ads are not shown during onboarding or critical money-entry flows.",
                "7. Security — No digital storage method can be guaranteed to be perfectly secure. Use a device lock and PocketRule PIN when appropriate, and do not share backup files casually.",
                "8. Deletion — You can reset PocketRule from Settings to remove the app's locally stored data. Separately exported backup files must be deleted from the location where you saved them.",
                "9. Changes — We may update this policy as PocketRule evolves. The updated date will be shown here.",
                "10. Contact — Questions about privacy can be sent to support@pocketrule.app."
              ] },
              { icon: ShieldCheck, label: "Terms of Use", body: [
                "Last updated: August 2026",
                "By using PocketRule, you agree to use the app responsibly and in accordance with these terms.",
                "1. What PocketRule provides — PocketRule provides tools for creating money rules, planning your money, recording spending, viewing completed plans, and learning from educational resources.",
                "2. Not financial advice — PocketRule is an organizational and educational tool. It does not provide personalized financial, investment, tax, legal, lending, or accounting advice.",
                "3. Your responsibility — You are responsible for the amounts, categories, rules, spending records, and decisions you enter into the app. Check important figures before acting on them.",
                "4. Accuracy — We aim to make calculations and displays reliable, but you should verify important totals and records, especially before making a financial transaction.",
                "5. Data and backups — You are responsible for maintaining backups of information you consider important. A backup is only created when you export one, and an exported file may contain sensitive information.",
                "6. Availability — Features may change, be improved, interrupted, or discontinued as PocketRule develops. We do not promise that every feature will always be available on every device.",
                "7. Educational resources — Resources are provided for general education and should not be treated as individualized financial recommendations.",
                "8. Acceptable use — Do not misuse, reverse engineer, disrupt, or attempt to compromise PocketRule or its supporting services.",
                "9. Intellectual property — PocketRule's branding, interface, original content, and software are protected by applicable intellectual-property laws. You may use the app for its intended personal purposes.",
                "10. Changes to these terms — We may update these terms as the product changes. Continued use after an update means you accept the revised terms.",
                "11. Contact — Questions about these terms can be sent to support@pocketrule.app."
              ] },
              { icon: Star, label: "Rate PocketRule", body: ["If PocketRule is helping you plan your money, a rating on your app store helps other people discover it too."] },
            ].map((row, i, arr) => {
              const Icon = row.icon;
              const open = openSupport === row.label;
              return (
                <div key={row.label} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : "none" }}>
                  <button onClick={() => setOpenSupport(open ? null : row.label)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon size={16} color={INK} /><span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: INK }}>{row.label}</span></div>
                    <ChevronRight size={16} color={MUTED} style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 150ms ease" }} />
                  </button>
                  {open && <div style={{ margin: "0 16px 14px" }}>{row.body.map((paragraph, idx) => <p key={idx} style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: MUTED, lineHeight: 1.55, margin: idx === 0 ? "0 0 7px" : "7px 0 0" }}>{paragraph}</p>)}</div>}
                </div>
              );
            })}
            <div style={{ borderTop: `1px solid ${LINE}` }}>
              <button onClick={() => window.open("https://PocketRule.app", "_blank", "noopener,noreferrer")} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Globe2 size={16} color={INK} /><div style={{ textAlign: "left" }}><span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: INK }}>Visit PocketRule.app</span><span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, marginTop: 2 }}>PocketRule.app</span></div></div>
                <ChevronRight size={16} color={MUTED} />
              </button>
            </div>
            <div style={{ borderTop: `1px solid ${LINE}` }}>
              <button onClick={() => { window.location.href = "mailto:support@pocketrule.app?subject=PocketRule%20Support%20or%20Feature%20Request"; }} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "13px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Mail size={16} color={INK} /><div style={{ textAlign: "left" }}><span style={{ display: "block", fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 13.5, color: INK }}>Contact Us / Request a Feature</span><span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, marginTop: 2 }}>support@pocketrule.app</span></div></div>
                <ChevronRight size={16} color={MUTED} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label style={{ ...settingsLabelStyle, color: CORAL }}>Danger zone</label>
          {!confirmReset ? (
            <GhostButton onClick={() => setConfirmReset(true)} style={{ color: CORAL, border: `1.5px solid ${CORAL}` }}>
              Reset app
            </GhostButton>
          ) : (
            <div style={{ background: DANGER_BG, border: `1px solid ${CORAL}`, borderRadius: R_MD, padding: 14 }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12.5, color: INK, margin: "0 0 10px", lineHeight: 1.5 }}>
                This clears every Rule, your saved History, and all settings — starting the app over from scratch. This can't be undone.
              </p>
              <input value={resetConfirmText} onChange={(e) => setResetConfirmText(e.target.value)} placeholder="Type RESET to continue" autoComplete="off" style={{ width: "100%", boxSizing: "border-box", marginBottom: 9, border: `1px solid ${LINE}`, borderRadius: 9, padding: "10px 11px", background: INPUT_BG, color: INK, fontFamily: "Inter, sans-serif", fontSize: 12 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button disabled={resetConfirmText.trim().toLowerCase() !== "reset"} onClick={onReset} style={{ flex: 1, background: resetConfirmText.trim().toLowerCase() === "reset" ? CORAL : LINE, border: "none", borderRadius: 8, padding: "10px", color: "#fff", fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12.5, cursor: resetConfirmText.trim().toLowerCase() === "reset" ? "pointer" : "not-allowed" }}>Reset everything</button>
                <button onClick={() => { setConfirmReset(false); setResetConfirmText(""); }} style={{ flex: 1, background: "none", border: `1.5px solid ${LINE}`, borderRadius: 8, padding: "10px", color: INK, fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, marginTop: 4 }}>
          PocketRule v{APP_VERSION} — Turn Any Money Into a Plan.
        </p>
      </div>

      <PickerSheet
        open={showCurrencySheet}
        onClose={() => setShowCurrencySheet(false)}
        title="Currency"
        value={settings.currency}
        options={CURRENCIES.map((c) => ({ value: c.code, label: currencyLabel(c), onSelect: () => { onRequestCurrencyChange(c.code); setShowCurrencySheet(false); } }))}
        onAddCustom={() => { setShowCurrencySheet(false); setShowAddCurrency(true); }}
        addCustomLabel="Add custom currency"
      />
      <CustomCurrencySheet
        open={showAddCurrency}
        onClose={() => setShowAddCurrency(false)}
        onSave={(name, code, symbol) => { onAddCurrency(name, code, symbol); setShowAddCurrency(false); }}
      />
    </div>
  );
}

/* ---------------------------------------------------------
   SHARE CARD
--------------------------------------------------------- */
function ShareCardScreen({ income, categories, ruleName, currency, onClose }) {
  const incomeNum = Number(income) || 0;
  const colored = withColors(categories);
  const allocated = calculateCategories(incomeNum, colored);
  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);

  const shareText = [
    "My PocketRule", "", "Turn Any Money Into a Plan.", `Rule: ${ruleName}`, `Amount: ${formatMoney(incomeNum, currency)}`, "",
    ...colored.map((c) => `✓ ${c.name} — ${c.pct}%`), "",
    "Turn Any Money Into a Plan.", "Created with PocketRule",
  ].join("\n");

  async function handleShare() {
    setSharing(true);
    try {
      await shareMoneyRuleCard({
        ruleName, income: incomeNum, currency, categories, shareText,
        filenameBase: `${ruleName.replace(/\s+/g, "-").toLowerCase()}-money-rule`,
      });
    } finally {
      setSharing(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    try {
      await exportMoneyRuleCardPng({
        ruleName, income: incomeNum, currency, categories,
        filenameBase: `${ruleName.replace(/\s+/g, "-").toLowerCase()}-money-rule`,
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div style={{ paddingBottom: 24 }}>
      <ScreenHeader title="Share My PocketRule" subtitle="A clean summary of your money plan." onBack={onClose} />
      <div style={{ padding: "0 20px" }}>
        <MoneyRuleCard ruleName={ruleName} income={incomeNum} currency={currency} categories={categories} />

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            position: "sticky", bottom: 0, zIndex: 12, margin: "0 -20px",
            padding: "10px 20px calc(10px + env(safe-area-inset-bottom))",
            background: `linear-gradient(to bottom, transparent, ${PAPER} 24%)`, borderTop: `1px solid ${LINE}`
          }}>
            <PrimaryButton icon={Share2} onClick={handleShare} disabled={sharing}>
              {sharing ? "Opening share…" : "Share"}
            </PrimaryButton>
          </div>
          <GhostButton icon={Download} onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting…" : "Export as PNG"}
          </GhostButton>
          <p style={{ textAlign: "center", fontSize: 12, color: MUTED, fontFamily: "Inter, sans-serif" }}>Share opens your device's share sheet — WhatsApp, Instagram, X, and more.</p>
        </div>
      </div>
    </div>
  );
}


/* ---------------------------------------------------------
   RESOURCES — simple financial education + optional offers
--------------------------------------------------------- */
function ResourceIcon({ id }) {
  const map = {
    debt: CreditCard,
    saving: PiggyBank,
    investing: TrendingUp,
    family: Users,
    habits: Target,
    goals: Target,
    income: BriefcaseBusiness,
    protection: ShieldCheck,
    purchases: House,
    giving: Gift,
  };
  const Icon = map[id] || BookOpen;
  return <Icon size={20} color={GOLD} strokeWidth={2.1} />;
}

function ResourcesScreen({ targetId = null }) {
  const [open, setOpen] = useState(targetId || null);
  const sectionRefs = useRef({});

  const sections = [
    {
      id: "debt", icon: "💳", title: "Debt", sub: "Understand what you owe and make a plan.",
      tips: [
        "Know exactly what you owe. List each balance, rate, and minimum payment.",
        "Pay the minimum on every debt before putting extra money toward one balance.",
        "Prioritize high-cost debt when possible because interest can slow your progress.",
        "Avoid adding new debt while you are working on the debt you already have.",
        "Give debt repayment a specific place in your money plan instead of paying randomly.",
        "Use unexpected income intentionally: decide in advance how much can go toward debt.",
        "Track your progress. Seeing the balance fall can make the plan easier to stick with."
      ]
    },
    {
      id: "saving", icon: "💰", title: "Saving Money", sub: "Make saving part of your money plan.",
      tips: [
        "Give every savings goal a name so you know what the money is for.",
        "Start with an amount you can repeat consistently rather than chasing a perfect number.",
        "Build an emergency cushion before relying on credit for unexpected costs.",
        "Keep short-term savings separate from money intended for long-term goals.",
        "Save when money arrives instead of waiting to see what is left at the end.",
        "Increase your savings amount when your income rises or an expense disappears.",
        "Review your savings goals regularly and adjust them when your priorities change."
      ]
    },
    {
      id: "investing", icon: "📈", title: "Investing Basics", sub: "Learn before you put money to work.",
      tips: [
        "Understand what you are buying before putting money into an investment.",
        "Know that investments can rise and fall; higher potential returns usually involve more risk.",
        "Diversification can reduce the impact of one investment performing poorly.",
        "Think about your time horizon before choosing an investment approach.",
        "Pay attention to fees because small costs can compound over time.",
        "Do not invest money you may need soon for essential expenses.",
        "Be cautious of promises of guaranteed high returns or pressure to act immediately."
      ]
    },
    {
      id: "family", icon: "👨‍👩‍👧", title: "Family & Household", sub: "Build a money plan that works together.",
      tips: [
        "List the household expenses everyone needs to plan for.",
        "Talk about money goals before making large financial commitments.",
        "Agree on who handles recurring bills and when they should be paid.",
        "Create shared goals for important expenses instead of handling every goal separately.",
        "Leave room in the household plan for unexpected costs.",
        "Teach children simple money habits through age-appropriate conversations and examples.",
        "Review the household plan together when income, responsibilities, or priorities change."
      ]
    },
    {
      id: "habits", icon: "🧠", title: "Money Habits", sub: "Small decisions become money habits.",
      tips: [
        "Give your money a job before you spend it.",
        "Pause before non-essential purchases and ask whether they fit your plan.",
        "Separate needs, wants, and future goals when deciding where money should go.",
        "Record spending often enough that you know where your money is actually going.",
        "Make good decisions easier by preparing for predictable expenses in advance.",
        "Review your plan regularly instead of waiting until money feels tight.",
        "Focus on consistency. A simple system you follow beats a complicated system you abandon."
      ]
    },
    {
      id: "goals", icon: "🎯", title: "Financial Goals", sub: "Turn what you want into a number and a plan.",
      tips: [
        "Name the goal clearly so you know exactly what you are working toward.",
        "Give the goal a target amount instead of keeping it vague.",
        "Choose a realistic target date and work backward from it.",
        "Break a large goal into smaller amounts you can plan for regularly.",
        "Give the goal its own category when that makes tracking easier.",
        "Celebrate milestones without abandoning the bigger objective.",
        "Review the goal when your circumstances change rather than treating the original plan as permanent."
      ]
    },
    {
      id: "income", icon: "💼", title: "Increasing Income", sub: "Use extra income intentionally.",
      tips: [
        "Know how much extra income you actually keep after costs and taxes where applicable.",
        "Give additional income a plan before it arrives.",
        "Consider using extra income to strengthen weak areas of your financial plan.",
        "Invest in skills that can improve your earning ability over time.",
        "Separate business or side-income money from personal spending when practical.",
        "Avoid increasing recurring expenses every time income increases.",
        "Use occasional windfalls intentionally instead of letting them disappear through unplanned spending."
      ]
    },
    {
      id: "protection", icon: "🛡️", title: "Financial Protection", sub: "Prepare for problems before they become expensive.",
      tips: [
        "Keep an emergency reserve for unexpected essential expenses.",
        "Review important insurance coverage and understand what it actually protects.",
        "Protect account passwords and never share sensitive financial information casually.",
        "Watch for scams, fake investment opportunities, and pressure to send money quickly.",
        "Keep important financial records organized and accessible.",
        "Have a plan for what happens financially if your income is interrupted.",
        "Review your protection plan after major life or financial changes."
      ]
    },
    {
      id: "purchases", icon: "🏠", title: "Major Purchases", sub: "Plan big expenses before they plan your money for you.",
      tips: [
        "Set the full target cost, not just the sticker price.",
        "Include recurring costs such as maintenance, fees, or other ongoing expenses.",
        "Create a dedicated savings target when the purchase is planned for later.",
        "Compare alternatives before committing to a large purchase.",
        "Consider whether the purchase delays a more important financial goal.",
        "Avoid making a large purchase solely because a payment looks affordable.",
        "Give yourself time to decide when the purchase is not urgent."
      ]
    },
    {
      id: "giving", icon: "🎁", title: "Giving", sub: "Give intentionally while keeping your wider plan healthy.",
      tips: [
        "Decide what giving means to you and include it in your plan intentionally.",
        "Set an amount or percentage that fits your circumstances.",
        "Keep giving predictable when possible so it is easier to plan around.",
        "Make room for generosity without ignoring essential obligations.",
        "Consider occasional giving separately from regular giving when that helps your plan.",
        "Keep records where appropriate so you know what you have given.",
        "Let generosity be a planned choice rather than something that creates financial stress."
      ]
    }
  ];

  useEffect(() => {
    if (!targetId) return;
    const timer = setTimeout(() => sectionRefs.current[targetId]?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
    return () => clearTimeout(timer);
  }, [targetId]);

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "18px 18px 30px", boxSizing: "border-box" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 9px" }}>
          <BookOpen size={22} color={GOLD} strokeWidth={2.2} />
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: GOLD, fontWeight: 800, letterSpacing: 1.1, margin: 0 }}>RESOURCES</p>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 24, lineHeight: 1.15, color: INK, margin: "5px 0 0", textAlign: "center" }}>Learn. Plan. Do better.</h1>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 15, lineHeight: 1.5, color: MUTED, margin: "9px auto 18px", maxWidth: 320 }}>Simple, practical money education without the jargon.</p>
      </div>

      <div style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 20, padding: 18, marginTop: 4, boxShadow: "none", textAlign: "center" }}>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: GOLD, fontWeight: 800, letterSpacing: .9, margin: 0 }}>FEATURED EBOOK</p>
        <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 20, lineHeight: 1.25, color: INK, margin: "7px auto 0", maxWidth: 340 }}>99 Smart Ways to Cut Costs, Save Money &amp; Eliminate Waste</h2>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.5, color: MUTED, margin: "9px auto 15px", maxWidth: 330 }}>Practical ideas to cut unnecessary costs, save more money, and eliminate waste from everyday spending.</p>
        <button type="button" onClick={() => window.open("https://pocketrule.gumroad.com/l/money", "_blank", "noopener,noreferrer")} style={{ border: "none", background: GOLD_GRADIENT, color: "#fff", borderRadius: 12, padding: "12px 18px", fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer", minWidth: 150 }}>Get the Ebook →</button>
      </div>

      <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, fontWeight: 800, letterSpacing: .7, margin: "20px 0 9px" }}>EXPLORE TOPICS</p>
      <div style={{ display: "grid", gap: 10 }}>
        {sections.map((section) => {
          const isOpen = open === section.id;
          return (
            <div key={section.id} ref={(el) => { sectionRefs.current[section.id] = el; }} style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: R_LG, overflow: "hidden", boxShadow: "none" }}>
              <button type="button" onClick={() => setOpen(isOpen ? null : section.id)} aria-expanded={isOpen} style={{ width: "100%", border: "none", background: "transparent", padding: "15px 14px", display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer", color: INK }}>
                <span style={{ width: 40, height: 40, borderRadius: 11, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ResourceIcon id={section.id} /></span>
                <span style={{ flex: 1, minWidth: 0 }}><strong style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 17, lineHeight: 1.2, color: INK }}>{section.title}</strong><span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.35, color: MUTED, marginTop: 4 }}>{section.sub}</span></span>
                <span style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: GOLD }} aria-hidden="true">{isOpen ? <Minus size={21} strokeWidth={2.2} /> : <Plus size={21} strokeWidth={2.2} />}</span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 15px 16px" }} className="pr-rise">
                  <div style={{ height: 1, background: LINE, marginBottom: 12 }} />
                  <ol style={{ margin: 0, paddingLeft: 24, color: INK, fontFamily: "Inter, sans-serif", fontSize: 15, lineHeight: 1.55 }}>
                    {section.tips.map((tip) => <li key={tip} style={{ paddingLeft: 4, marginBottom: 10 }}>{tip}</li>)}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BottomNav({ active, onNav }) {
  const items = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "rules", label: "Rules", icon: LayoutGrid },
    { id: "plan", label: "Plan", icon: ClipboardList },
    { id: "resources", label: "Resources", icon: BookOpen },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];
  return (
    <div style={{ display: "flex", borderTop: `1px solid ${LINE}`, background: PAPER_DIM, paddingTop: 5, boxShadow: "0 -8px 20px -14px rgba(18,24,27,0.15)" }}>
      {items.map((it) => {
        const Icon = it.icon;
        const isActive = active === it.id;
        return (
          <button key={it.id} onClick={() => onNav(it.id)} style={{ flex: 1, background: "none", border: "none", padding: "6px 0 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", color: isActive ? GOLD : NAV_MUTED }}>
            <div style={{ height: 28, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: isActive ? GOLD : NAV_MUTED }}>
              <Icon size={19} strokeWidth={isActive ? 2.5 : 2.0} />
              {isActive && <span style={{ position: "absolute", bottom: -2, width: 18, height: 3, borderRadius: 99, background: GOLD }} />}
            </div>
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: isActive ? 800 : 600 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PlansScreen({ plans, currency, onBack, onOpenActive, onOpenCompleted }) {
  const [period, setPeriod] = useState("week");
  const [showInsights, setShowInsights] = useState(false);
  const todayForInput = new Date();
  const toInputDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [customStart, setCustomStart] = useState(toInputDate(new Date(todayForInput.getFullYear(), todayForInput.getMonth(), 1)));
  const [customEnd, setCustomEnd] = useState(toInputDate(todayForInput));
  const allPlans = Array.isArray(plans) ? plans : [];
  const active = allPlans.find((p) => p.status === "active");
  const completed = allPlans.filter((p) => p.status === "completed").slice().sort((a, b) => (b.completedAt || b.date) - (a.completedAt || a.date));

  function planSummary(plan) {
    const { transactions, spent: ledgerSpent } = getPlanLedgerTotals(plan);
    const spent = plan.hasTransactionLedger
      ? ledgerSpent
      : (plan.categories || []).reduce((s, c) => s + (Number(c.spent) || 0), 0);
    const budget = Number(plan.income) || (plan.categories || []).reduce((s, c) => s + (Number(c.budget) || 0), 0);
    return { spent, budget, remaining: Math.max(0, budget - spent), progress: budget > 0 ? Math.min(100, (spent / budget) * 100) : 0 };
  }

  function periodStart(type) {
    const now = new Date();
    if (type === "month") return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day; // Monday start
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(now.getDate() + diff);
    return start.getTime();
  }

  function periodLabel(type) {
    if (type === "month") return new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" });
    if (type === "custom") {
      if (!customStart || !customEnd) return "Choose a date range";
      const a = new Date(`${customStart}T00:00:00`);
      const b = new Date(`${customEnd}T00:00:00`);
      return `${a.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}–${b.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
    }
    const start = new Date(periodStart("week"));
    const end = new Date(start); end.setDate(start.getDate() + 6);
    const sameMonth = start.getMonth() === end.getMonth();
    return sameMonth
      ? `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}–${end.toLocaleDateString(undefined, { day: "numeric", year: "numeric" })}`
      : `${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}–${end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
  }

  let start;
  let end;
  if (period === "custom") {
    start = customStart ? new Date(`${customStart}T00:00:00`).getTime() : NaN;
    end = customEnd ? new Date(`${customEnd}T00:00:00`).getTime() + 24 * 60 * 60 * 1000 : NaN;
  } else {
    start = periodStart(period);
    end = period === "month"
      ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getTime()
      : start + 7 * 24 * 60 * 60 * 1000;
  }
  const validCustomRange = period !== "custom" || (Number.isFinite(start) && Number.isFinite(end) && end > start);

  // Plans that started in the selected period form the planned/remaining totals.
  const periodPlans = validCustomRange ? allPlans.filter((p) => {
    if ((p.currency || currency) !== currency) return false;
    const date = Number(p.date) || 0;
    return date >= start && date < end;
  }) : [];

  // Transactions are always filtered by their actual transaction date.
  const periodTransactions = validCustomRange ? allPlans.filter((p) => (p.currency || currency) === currency).flatMap((p) => (Array.isArray(p.transactions) ? p.transactions.map((t) => ({ ...t, plan: p })) : []))
    .filter((t) => Number(t.date) >= start && Number(t.date) < end) : [];

  const planned = periodPlans.reduce((sum, p) => sum + (Number(p.income) || (p.categories || []).reduce((s, c) => s + (Number(c.budget) || 0), 0)), 0);
  const spent = periodTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // For a completed/legacy plan with no transaction records, use its recorded
  // spent amount when the plan itself falls inside the selected period.
  const transactionPlanIds = new Set(periodTransactions.map((t) => t.plan.id));
  const legacySpent = periodPlans.reduce((sum, p) => {
    if (transactionPlanIds.has(p.id)) return sum;
    if (p.hasTransactionLedger || (Array.isArray(p.transactions) && p.transactions.length > 0)) return sum;
    return sum + planSummary(p).spent;
  }, 0);
  const totalSpent = spent + legacySpent;
  const totalRemaining = Math.max(0, planned - totalSpent);

  const categoryMap = {};
  periodPlans.forEach((p) => {
    (p.categories || []).forEach((c) => {
      if (!categoryMap[c.name]) categoryMap[c.name] = { name: c.name, planned: 0, spent: 0 };
      categoryMap[c.name].planned += Number(c.budget) || 0;
    });
  });
  periodTransactions.forEach((t) => {
    const category = (t.plan.categories || []).find((c) => String(c.id) === String(t.categoryId));
    if (!category) return;
    if (!categoryMap[category.name]) categoryMap[category.name] = { name: category.name, planned: 0, spent: 0 };
    categoryMap[category.name].spent += Number(t.amount) || 0;
  });
  periodPlans.forEach((p) => {
    if (transactionPlanIds.has(p.id)) return;
    if (p.hasTransactionLedger || (Array.isArray(p.transactions) && p.transactions.length > 0)) return;
    (p.categories || []).forEach((c) => {
      if (!categoryMap[c.name]) categoryMap[c.name] = { name: c.name, planned: 0, spent: 0 };
      categoryMap[c.name].spent += Number(c.spent) || 0;
    });
  });
  const categoryRows = Object.values(categoryMap)
    .map((c) => ({ ...c, remaining: Math.max(0, c.planned - c.spent) }))
    .filter((c) => c.planned > 0 || c.spent > 0)
    .sort((a, b) => b.spent - a.spent || b.planned - a.planned);

  return (
    <div style={{ paddingBottom: 24 }}>
      <ScreenHeader title="Plan" subtitle="Give every amount a job, then follow your plan." />
      <div style={{ padding: "0 20px" }}>
        {active ? (
          <button onClick={onOpenActive} style={{ width: "100%", textAlign: "left", border: "none", background: GREEN_CARD_GRADIENT, color: "#fff", borderRadius: 20, padding: 16, boxShadow: SHADOW_BTN, cursor: "pointer" }}>
            {(() => { const s = planSummary(active); return (
              <>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}><PiggyBank size={20} /></div>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", opacity: 0.7, margin: 0 }}>Active plan</p>
                  <h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 18, margin: "5px 0 0" }}>{active.name}</h2>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 18 }}>
                  <div><p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, opacity: 0.7, margin: 0 }}>Remaining</p><strong style={{ fontFamily: "Roboto, sans-serif", fontSize: 21 }}>{formatMoney(s.remaining, active.currency || currency)}</strong></div>
                  <div style={{ textAlign: "right" }}><p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, opacity: 0.7, margin: 0 }}>Spent</p><strong style={{ fontFamily: "Roboto, sans-serif", fontSize: 14 }}>{formatMoney(s.spent, active.currency || currency)}</strong></div>
                </div>
                <div style={{ height: 7, background: "rgba(255,255,255,0.2)", borderRadius: 999, overflow: "hidden", marginTop: 12 }}><div style={{ width: `${s.progress}%`, height: "100%", background: "#fff", borderRadius: 999 }} /></div>
              </>
            ); })()}
          </button>
        ) : (
          <div style={{ background: PAPER_DIM, border: `1px dashed ${LINE}`, borderRadius: R_LG, padding: 18, textAlign: "center" }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><PiggyBank size={21} color={GOLD} /></div>
            <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 15, color: INK, margin: 0 }}>No active plan</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "5px 0 0" }}>Create one from Home when money comes in.</p>
          </div>
        )}

        <div style={{ margin: "18px 0 0" }}>
          <button onClick={() => setShowInsights((v) => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, border: `1px solid ${LINE}`, borderRadius: 15, padding: "13px 14px", background: showInsights ? ACTIVE_TINT : PAPER_DIM, color: showInsights ? GOLD : INK, fontFamily: "Sora, sans-serif", fontSize: 12.5, fontWeight: 800, cursor: "pointer", boxShadow: SHADOW_CARD }}>
            <BarChart3 size={17} strokeWidth={2.4} />
            {showInsights ? "Hide spending insights" : "View spending insights"}
            <ChevronDown size={16} style={{ transform: showInsights ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s ease" }} />
          </button>

          {showInsights && <div style={{ marginTop: 10 }}>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 17, color: INK, margin: 0 }}>Spending insights</h3>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "3px 0 10px" }}>{periodLabel(period)}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 15, padding: 5, marginBottom: 8 }}>
            {[{ id: "week", label: "This week" }, { id: "month", label: "This month" }, { id: "custom", label: "Date range" }].map((item) => (
              <button key={item.id} onClick={() => setPeriod(item.id)} style={{ border: "none", borderRadius: 11, padding: "9px 6px", background: period === item.id ? ACTIVE_TINT : "transparent", color: period === item.id ? GOLD : MUTED, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>{item.label}</button>
            ))}
          </div>

          {period === "custom" && (
            <div style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 14, padding: 10, marginBottom: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, color: MUTED, textTransform: "uppercase" }}>
                  From
                  <input type="date" value={customStart} max={customEnd || undefined} onChange={(e) => setCustomStart(e.target.value)} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${LINE}`, borderRadius: 10, padding: "9px 8px", background: PAPER, color: INK, fontFamily: "Roboto, sans-serif", fontSize: 12.5, fontWeight: 600 }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, color: MUTED, textTransform: "uppercase" }}>
                  To
                  <input type="date" value={customEnd} min={customStart || undefined} onChange={(e) => setCustomEnd(e.target.value)} style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${LINE}`, borderRadius: 10, padding: "9px 8px", background: PAPER, color: INK, fontFamily: "Roboto, sans-serif", fontSize: 12.5, fontWeight: 600 }} />
                </label>
              </div>
              {!validCustomRange && <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: CORAL, margin: "7px 0 0", textAlign: "center", fontWeight: 700 }}>Choose an end date on or after the start date.</p>}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
            {[['Planned', planned, INK], ['Spent', totalSpent, INK], ['Left', totalRemaining, GOLD]].map(([label, value, color]) => (
              <div key={label} style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 14, padding: "11px 8px", textAlign: "center" }}>
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: 0, textTransform: "uppercase", fontWeight: 800, letterSpacing: .3 }}>{label}</p>
                <p style={{ fontFamily: "Roboto, sans-serif", fontWeight: 800, fontSize: 13.5, color, margin: "6px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{formatMoney(value, currency)}</p>
              </div>
            ))}
          </div>

          {categoryRows.length > 0 && (
            <div style={{ marginTop: 11, background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 15, padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <p style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 13.5, color: INK, margin: 0 }}>By category</p>
                <Calendar size={15} color={MUTED} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {categoryRows.map((c) => (
                  <div key={c.name} style={{ padding: "9px 0", borderTop: `1px solid ${LINE}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <strong style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: INK }}>{c.name}</strong>
                      <strong style={{ fontFamily: "Roboto, sans-serif", fontSize: 12, color: INK }}>{formatMoney(c.spent, currency)} spent</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginTop: 3 }}>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED }}>Planned {formatMoney(c.planned, currency)}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: GOLD, fontWeight: 700 }}>{formatMoney(c.remaining, currency)} left</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {categoryRows.length === 0 && (
            <div style={{ background: PAPER_DIM, border: `1px dashed ${LINE}`, borderRadius: 15, padding: 14, textAlign: "center", marginTop: 10 }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: 0 }}>Your {period === "week" ? "weekly" : period === "month" ? "monthly" : "date-range"} spending insights will appear here after you create a plan and record spending.</p>
            </div>
          )}
          </div>}
        </div>

        <div style={{ textAlign: "center", margin: "22px 0 10px" }}>
          <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 16, color: INK, margin: 0 }}>Completed plans</h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "3px 0 0" }}>Tap a plan to view the full breakdown.</p>
        </div>

        {completed.length === 0 ? (
          <div style={{ background: PAPER_DIM, borderRadius: 15, padding: 16, boxShadow: SHADOW_CARD }}>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: 0, textAlign: "center" }}>Complete your first plan and it will appear here.</p>
          </div>
        ) : completed.slice(0, 6).map((p) => {
          const s = planSummary(p);
          return (
            <button key={p.id} onClick={() => onOpenCompleted(p.id)} style={{ width: "100%", textAlign: "left", background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: R_MD, padding: 13, marginBottom: 8, boxShadow: "none", cursor: "pointer", color: INK }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={15} color={GOLD} strokeWidth={3} /></div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 13, color: INK, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</p>
                  <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "3px 0 0" }}>Completed · {new Date(p.completedAt || p.date).toLocaleDateString()} · {formatMoney(s.budget, p.currency || currency)} planned</p>
                </div>
                <ChevronRight size={17} color={MUTED} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}


function DeletePlanModal({ isDark, onCancel, onConfirm }) {
  const bg = isDark ? "#17201B" : "#FFFFFF";
  const ink = isDark ? "#F4F7F2" : "#12181B";
  const muted = isDark ? "#AAB6AE" : "#66736C";
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-plan-title"
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.58)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20
      }}
    >
      <div style={{
        width: "100%", maxWidth: 380, background: bg, color: ink,
        borderRadius: 22, padding: 22,
        boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
        border: `1px solid ${isDark ? "#29362F" : "#E5EAE5"}`
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 15,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: isDark ? "#352020" : "#FFF0EF",
          marginBottom: 14
        }}>
          <Trash2 size={21} color={CORAL} />
        </div>
        <h2 id="delete-plan-title" style={{
          margin: "0 0 8px", fontFamily: "Inter, sans-serif",
          fontSize: 19, fontWeight: 850, letterSpacing: "-0.02em"
        }}>
          Delete this plan?
        </h2>
        <p style={{
          margin: "0 0 22px", color: muted,
          fontFamily: "Inter, sans-serif", fontSize: 13.5,
          lineHeight: 1.55
        }}>
          This will remove the plan and its spending records from Spending Insights.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1, border: `1px solid ${isDark ? "#35433B" : "#DCE3DD"}`,
              background: "transparent", color: ink, borderRadius: 12,
              padding: "12px 10px", fontFamily: "Inter, sans-serif",
              fontWeight: 800, fontSize: 13, cursor: "pointer"
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1, border: "none", background: CORAL, color: "#fff",
              borderRadius: 12, padding: "12px 10px",
              fontFamily: "Inter, sans-serif", fontWeight: 850,
              fontSize: 13, cursor: "pointer"
            }}
          >
            Delete plan
          </button>
        </div>
      </div>
    </div>
  );
}

function CompletedPlanDetailScreen({ onDeletePlan, plan, currency, onBack, isDark }) {
  const [showDeletePlanModal, setShowDeletePlanModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  if (!plan) return null;
   const displayCurrency = plan.currency || currency;
  const budget = Number(plan.income) || (plan.categories || []).reduce((sum, c) => sum + (Number(c.budget) || 0), 0);
  const txs = Array.isArray(plan.transactions) ? plan.transactions : [];
  const spent = plan.hasTransactionLedger
    ? txs.reduce((sum, t) => sum + Math.max(0, Number(t.amount) || 0), 0)
    : (plan.categories || []).reduce((sum, c) => sum + (Number(c.spent) || 0), 0);
  const remaining = Math.max(0, budget - spent);
  const progress = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  return (
    <div style={{ paddingBottom: 24 }}>
      <ScreenHeader title="Completed Plan" subtitle="Review the full breakdown." onBack={onBack} />
      <div style={{ padding: "0 20px" }}>
        <div style={{ background: GREEN_CARD_GRADIENT, color: "#fff", borderRadius: 20, padding: 17, boxShadow: SHADOW_BTN }}>
          <div style={{ position: "relative", textAlign: "center", padding: "0 34px" }}><p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: .7, textTransform: "uppercase", margin: 0, opacity: .75 }}>Completed</p><h2 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 19, margin: "4px 0 0" }}>{plan.name || "Money Plan"}</h2><p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, margin: "4px 0 0", opacity: .72 }}>{new Date(plan.completedAt || plan.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p><Check size={22} strokeWidth={3} style={{ position: "absolute", right: 0, top: 0 }} /></div>
          <div style={{ marginTop: 18, fontFamily: "Roboto, sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: "-0.035em" }}>{formatMoney(budget, displayCurrency)}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
          <div style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 15, padding: 13 }}><p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: 0, textTransform: "uppercase", fontWeight: 800 }}>Spent</p><p style={{ fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 16, color: INK, margin: "6px 0 0" }}>{formatMoney(spent, displayCurrency)}</p></div>
          <div style={{ background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 15, padding: 13 }}><p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: 0, textTransform: "uppercase", fontWeight: 800 }}>Remaining</p><p style={{ fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 16, color: GOLD, margin: "6px 0 0" }}>{formatMoney(remaining, displayCurrency)}</p></div>
        </div>
        <div style={{ marginTop: 13, background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 15, padding: 13 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}><span style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED }}>Plan progress</span></div><div style={{ height: 7, background: "var(--pr-progress-track)", borderRadius: 999, overflow: "hidden" }}><div style={{ width: `${progress}%`, height: "100%", background: GOLD, borderRadius: 999 }} /></div></div>
        <div style={{ marginTop: 18 }}><h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 17, color: INK, margin: 0, textAlign: "center" }} >Categories</h3><p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "4px auto 9px", textAlign: "center", maxWidth: 320 }}>How your plan is divided among your categories.</p><div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{(plan.categories || []).map((c) => <div key={c.id || c.name} style={{ display: "flex", alignItems: "center", gap: 10, background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 13, padding: "10px 11px" }}><div style={{ width: 34, height: 34, borderRadius: 10, background: ACTIVE_TINT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><CategoryIcon name={c.name} size={17} color={GOLD} /></div><div style={{ flex: 1, minWidth: 0 }}><strong style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 13, color: INK }}>{c.name}</strong><span style={{ display: "block", fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, marginTop: 2 }}>Spent {formatMoney(plan.hasTransactionLedger ? txs.filter((t) => String(t.categoryId) === String(c.id)).reduce((sum, t) => sum + Math.max(0, Number(t.amount) || 0), 0) : (c.spent || 0), displayCurrency)}</span></div><span className="pr-money" style={{ width: 108, textAlign: "right", fontFamily: "Roboto, sans-serif", fontWeight: 700, fontSize: 12.5, color: GOLD, flexShrink: 0 }}>{formatMoney(c.budget, displayCurrency)}</span></div>)}</div></div>
        <div style={{ marginTop: 14 }}><button onClick={() => setShowHistory((v) => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 13, padding: "12px 13px", color: INK, cursor: "pointer" }}><span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "Inter, sans-serif", fontWeight: 800, fontSize: 12.5 }}><HistoryIcon size={16} color={GOLD} /> Spending history ({txs.length})</span><ChevronDown size={16} color={MUTED} style={{ transform: showHistory ? "rotate(180deg)" : "none" }} /></button>{showHistory && <div style={{ marginTop: 7, background: PAPER_DIM, border: `1px solid ${LINE}`, borderRadius: 13, overflow: "hidden" }}>{txs.length === 0 ? <p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: 0, padding: 14 }}>No spending entries were recorded for this plan.</p> : txs.slice().sort((a,b) => (b.date || 0) - (a.date || 0)).map((tx, idx) => { const cat=(plan.categories||[]).find((c)=>c.id===tx.categoryId); return <div key={tx.id||idx} style={{ padding: "11px 13px", borderBottom: idx < txs.length-1 ? `1px solid ${LINE}` : "none" }}><div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: 12.5, color: INK }}>{cat?.name || "Spending"}</span><strong style={{ fontFamily: "Roboto, sans-serif", fontSize: 12, color: CORAL }}>-{formatMoney(tx.amount, displayCurrency)}</strong></div><p style={{ fontFamily: "Inter, sans-serif", fontSize: 12, color: MUTED, margin: "3px 0 0" }}>{tx.note || "No note"} · {new Date(tx.date).toLocaleDateString()}</p></div>; })}</div>}</div>
        <button
          type="button"
          onClick={() => setShowDeletePlanModal(true)}
          style={{
            width: "100%", marginTop: 14, background: "transparent",
            border: `1.5px solid ${CORAL}`, color: CORAL, borderRadius: 13,
            padding: "12px 14px", fontFamily: "Inter, sans-serif",
            fontWeight: 800, fontSize: 12.5, cursor: "pointer"
          }}
        >
          Delete plan
        </button>

      {showDeletePlanModal && (
        <DeletePlanModal
          isDark={isDark}
          onCancel={() => setShowDeletePlanModal(false)}
          onConfirm={() => {
            setShowDeletePlanModal(false);
            onDeletePlan?.(plan.id);
          }}
        />
      )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   APP ERROR BOUNDARY
   Prevents a malformed imported state from ever becoming a
   silent white screen. It exposes the render error and lets
   the user safely return to the current app state.
--------------------------------------------------------- */
class PocketRuleErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "PocketRule could not render this screen." };
  }

  componentDidCatch(error) {
    console.error("PocketRule render error:", error);
  }

  reset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        minHeight: "100vh", background: "#050705", color: "#F1F4F0",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, boxSizing: "border-box", fontFamily: "Inter, sans-serif"
      }}>
        <div style={{
          width: "min(100%, 520px)", background: "#182019", border: "1px solid #334238",
          borderRadius: 24, padding: 24, textAlign: "center", boxSizing: "border-box"
        }}>
          <div style={{ fontFamily: "Sora, sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>
            PocketRule couldn't display this data
          </div>
          <div style={{ color: "rgba(241,244,240,.72)", fontSize: 14, lineHeight: 1.55, marginBottom: 16 }}>
            The imported data was accepted, but a screen encountered an unexpected value.
          </div>
          <div style={{
            textAlign: "left", background: "#0D130F", borderRadius: 12, padding: 12,
            color: "#FFB4AB", fontSize: 12, wordBreak: "break-word", marginBottom: 18
          }}>
            {this.state.message}
          </div>
          <button
            type="button"
            onClick={this.reset}
            style={{
              width: "100%", border: "none", borderRadius: 14, padding: "14px 18px",
              background: "#1FA84A", color: "#071109", fontWeight: 800, fontSize: 15
            }}
          >
            Return to PocketRule
          </button>
        </div>
      </div>
    );
  }
}

/* ---------------------------------------------------------
   APP SHELL
--------------------------------------------------------- */
function PocketRuleAppInner() {
  const [loaded, setLoaded] = useState(false);
  const [sessionPin, setSessionPin] = useState(null);
  const lastActivityRef = useRef(Date.now());
  const [data, setData] = useState(defaultState());
  // onboarded now lives in persisted `data.onboarded`
  const [reminderPrompt, setReminderPrompt] = useState({ frequency: "weekly", date: "", day: "Friday", dayOfMonth: 1, hour: 12, ampm: "PM" });
  const [showReminderPrompt, setShowReminderPrompt] = useState(false);

  const [screen, setScreen] = useState("home");
  const [income, setIncome] = useState("");
  const [planName, setPlanName] = useState("");
  const [notes, setNotes] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [savedSignature, setSavedSignature] = useState(null);
  const [editingRuleId, setEditingRuleId] = useState(undefined);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [selectedCompletedPlanId, setSelectedCompletedPlanId] = useState(null);
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [resourceTarget, setResourceTarget] = useState(null);
  const [resourcePrompt, setResourcePrompt] = useState(null);
  const [showPlanNameSheet, setShowPlanNameSheet] = useState(false);
  const [pendingCurrency, setPendingCurrency] = useState(null);
  const [backupModal, setBackupModal] = useState(null);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [, forceThemeRecheck] = useState(0);

  useEffect(() => {
    const reminder = {
      frequency: data.settings.reminderFrequency,
      date: data.settings.reminderDate,
      day: data.settings.reminderDay,
      dayOfMonth: data.settings.reminderDayOfMonth,
      hour: data.settings.reminderHour,
      ampm: data.settings.reminderAmpm,
    };

    if (isNativeApp()) {
      schedulePocketRuleReminder(data.settings.notificationsEnabled ? reminder : { frequency: "off" });
      return undefined;
    }

    if (!data.settings.notificationsEnabled) return undefined;
    let lastMinute = "";
    const checkReminder = () => {
      const now = new Date();
      const minuteKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
      if (minuteKey === lastMinute) return;
      lastMinute = minuteKey;
      if (reminderIsDue(reminder, now)) firePocketRuleReminder();
    };
    checkReminder();
    const timer = window.setInterval(checkReminder, 30000);
    return () => window.clearInterval(timer);
  }, [
    data.settings.notificationsEnabled,
    data.settings.reminderFrequency,
    data.settings.reminderDate,
    data.settings.reminderDay,
    data.settings.reminderDayOfMonth,
    data.settings.reminderHour,
    data.settings.reminderAmpm,
  ]);

  useEffect(() => {
    if (data.settings.appearance !== "system" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => forceThemeRecheck((n) => n + 1);
    if (mq.addEventListener) mq.addEventListener("change", handler); else mq.addListener(handler);
    return () => { if (mq.removeEventListener) mq.removeEventListener("change", handler); else mq.removeListener(handler); };
  }, [data.settings.appearance]);

  useEffect(() => {
    if (!loaded || !isNativeApp()) return;

    startPocketRuleAdMob().catch((error) => {
      console.error("PocketRule AdMob startup failed:", error);
    });
  }, [loaded]);

  useEffect(() => {
    if (!loaded || !isNativeApp()) return;
    if (data.onboarded && screen === "resources") {
      showPocketRuleBanner();
    } else {
      hidePocketRuleBanner();
    }
    return () => { hidePocketRuleBanner(); };
  }, [loaded, data.onboarded, screen]);

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
    <div style={{ minHeight: "100vh", background: "#050705", display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 16px", boxSizing: "border-box", ...themeVars }}>
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
      <div style={{ width: "min(100%, 780px)", height: "min(780px, calc(100vh - 28px))", minHeight: 0, boxSizing: "border-box", background: PAPER, color: INK, colorScheme: isDark ? "dark" : "light", borderRadius: 34, border: "6px solid #000000", boxShadow: "0 28px 70px rgba(0,0,0,0.52)", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative", ...themeVars }}>
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
