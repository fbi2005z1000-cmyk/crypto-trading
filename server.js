const fs = require("fs");
const path = require("path");
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const http = require("http");
const { Server } = require("socket.io");
const sqlite3 = require("sqlite3").verbose();

const PORT = process.env.PORT || 3000;
const FX_RATE = 24500;
const BASE_FEE_RATE = 0.001;
const MAINTENANCE_RATE = 0.5;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_OWNER_USER = process.env.ADMIN_OWNER_USER;
const ADMIN_OWNER_PASS = process.env.ADMIN_OWNER_PASS;
const ADMIN_OWNER_CODE = process.env.ADMIN_OWNER_CODE;
const ADMIN_OTP_SECRET = process.env.ADMIN_OTP_SECRET || "";
const COINGECKO_BASE = "https://api.coingecko.com/api/v3";
const BINANCE_BASE = "https://api.binance.com";
const LIVE_STALE_MS = 45000;
const USERS_FILE = path.join(__dirname, "users.json");
const DB_FILE = path.join(__dirname, "users.db");
const ADMIN_LOG_FILE = path.join(__dirname, "admin.log");
const SECURITY_LOG_FILE = path.join(__dirname, "security.log");
const USER_EDIT_LOG_FILE = path.join(__dirname, "user_edits.log");
const SETTINGS_FILE = path.join(__dirname, "settings.json");
const IP_BLACKLIST_FILE = path.join(__dirname, "ip_blacklist.json");
const ADMIN_WHITELIST_FILE = path.join(__dirname, "admin_whitelist.json");
const INVITE_FILE = path.join(__dirname, "invite_codes.json");
const BACKUP_DIR = path.join(__dirname, "backups");
const CONFIG_LOG_FILE = path.join(__dirname, "config_changes.log");
const FEE_LOG_FILE = path.join(__dirname, "fee_leverage.log");
const COMPLAINTS_FILE = path.join(__dirname, "complaints.json");
const INCIDENT_FILE = path.join(__dirname, "incident_checklist.json");
const SPAM_HEATMAP_FILE = path.join(__dirname, "spam_heatmap.json");
const HASH_ROUNDS = 10;
const LOGIN_FAIL_WINDOW_MS = 5 * 60 * 1000;
const LOGIN_FAIL_MAX = 5;
const LOGIN_BLOCK_MS = 10 * 60 * 1000;
const ORDER_RATE_WINDOW_MS = 2000;
const ORDER_RATE_MAX = 8;
const ADMIN_RATE_WINDOW_MS = 3000;
const ADMIN_RATE_MAX = 3;
const ADMIN_RATE_MAX_SUPER = 5;
const ADMIN_RATE_MAX_MOD = 3;
const AUTH_RATE_WINDOW_MS = 5000;
const AUTH_RATE_MAX = 5;
const MAX_ORDER_QTY = 1e8;
const MAX_NOTIONAL_USD = 5e7;
const SPIN_TRADE_REQUIRED = 10;
const MAX_LEVERAGE_CAP = 200;
const BOOSTER_CATALOG = {
  insurance: { priceUsd: 150 },
  anonymity: { priceUsd: 90 }
};
const IDEMPOTENCY_TTL_MS = 2 * 60 * 1000;
const MAX_OPEN_ORDERS = 50;
const MAX_POSITIONS = 30;
const ACCESS_TTL_MS = 15 * 60 * 1000;
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const TOKEN_BYTES = 32;
const ADMIN_PRICE_COOLDOWN_MS = 8000;
const ADMIN_MAX_PRICE_CHANGE_PCT = 10;
const ADMIN_MAX_ADJUST_PCT = 10;
const ADMIN_OTP_WINDOW_SEC = 30;
const CANCEL_SPAM_WINDOW_MS = 60 * 1000;
const CANCEL_SPAM_THRESHOLD = 6;
const STRIKE_LIMIT_DEFAULT = 3;
const CIRCUIT_BREAK_WINDOW_MS = 60 * 1000;
const CIRCUIT_BREAK_PCT = 20;
const DEFAULT_MAX_LEVERAGE = 50;
const DEFAULT_SLIPPAGE_PCT = 0;
const NEW_USER_DAYS = 7;
const BACKUP_INTERVAL_MS = 6 * 60 * 60 * 1000;
const DEFAULT_LOG_RETENTION_DAYS = 30;
const DEFAULT_ADMIN_IDLE_MS = 10 * 60 * 1000;
const DEFAULT_ADMIN_SESSION_MS = 60 * 60 * 1000;

if (!ADMIN_PASSWORD || !ADMIN_OWNER_USER || !ADMIN_OWNER_PASS || !ADMIN_OWNER_CODE) {
  throw new Error("Thiếu biến môi trường admin. Vui lòng cấu hình .env.");
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname), {
  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
    } else if (filePath.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css; charset=utf-8");
    } else if (filePath.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    }
  }
}));

const baseCoins = [
  { symbol: "BTC", name: "Bitcoin", base: 42000, vol: 0.003 },
  { symbol: "ETH", name: "Ethereum", base: 2300, vol: 0.004 },
  { symbol: "BNB", name: "BNB", base: 320, vol: 0.005 },
  { symbol: "SOL", name: "Solana", base: 95, vol: 0.007 },
  { symbol: "XRP", name: "XRP", base: 0.62, vol: 0.01 },
  { symbol: "ADA", name: "Cardano", base: 0.45, vol: 0.012 },
  { symbol: "DOGE", name: "Dogecoin", base: 0.09, vol: 0.015 },
  { symbol: "TRX", name: "TRON", base: 0.13, vol: 0.01 },
  { symbol: "TON", name: "Toncoin", base: 2.3, vol: 0.012 },
  { symbol: "DOT", name: "Polkadot", base: 6.5, vol: 0.012 },
  { symbol: "AVAX", name: "Avalanche", base: 35, vol: 0.011 },
  { symbol: "SHIB", name: "Shiba Inu", base: 0.000011, vol: 0.02 },
  { symbol: "MATIC", name: "Polygon", base: 0.78, vol: 0.012 },
  { symbol: "LINK", name: "Chainlink", base: 15.2, vol: 0.012 },
  { symbol: "LTC", name: "Litecoin", base: 80, vol: 0.01 },
  { symbol: "ATOM", name: "Cosmos", base: 10.4, vol: 0.012 },
  { symbol: "XLM", name: "Stellar", base: 0.12, vol: 0.012 },
  { symbol: "NEAR", name: "Near", base: 3.1, vol: 0.015 },
  { symbol: "ICP", name: "Internet Computer", base: 12.2, vol: 0.016 },
  { symbol: "APT", name: "Aptos", base: 8.1, vol: 0.017 },
  { symbol: "ARB", name: "Arbitrum", base: 1.1, vol: 0.02 },
  { symbol: "OP", name: "Optimism", base: 2.7, vol: 0.018 },
  { symbol: "SUI", name: "Sui", base: 1.2, vol: 0.02 },
  { symbol: "INJ", name: "Injective", base: 25, vol: 0.018 },
  { symbol: "RUNE", name: "THORChain", base: 4.5, vol: 0.016 },
  { symbol: "FTM", name: "Fantom", base: 0.7, vol: 0.018 },
  { symbol: "GRT", name: "The Graph", base: 0.2, vol: 0.015 },
  { symbol: "AAVE", name: "Aave", base: 95, vol: 0.012 },
  { symbol: "ETC", name: "Ethereum Classic", base: 24, vol: 0.013 },
  { symbol: "FIL", name: "Filecoin", base: 6.2, vol: 0.017 },
  { symbol: "HBAR", name: "Hedera", base: 0.08, vol: 0.014 },
  { symbol: "UNI", name: "Uniswap", base: 6.1, vol: 0.015 },
  { symbol: "VET", name: "VeChain", base: 0.03, vol: 0.018 },
  { symbol: "MKR", name: "Maker", base: 1300, vol: 0.009 },
  { symbol: "LDO", name: "Lido", base: 2.4, vol: 0.016 },
  { symbol: "KAS", name: "Kaspa", base: 0.12, vol: 0.02 },
  { symbol: "TIA", name: "Celestia", base: 9.1, vol: 0.018 },
  { symbol: "IMX", name: "Immutable", base: 2.3, vol: 0.017 },
  { symbol: "SEI", name: "Sei", base: 0.65, vol: 0.018 },
  { symbol: "XMR", name: "Monero", base: 140, vol: 0.01 },
  { symbol: "ALGO", name: "Algorand", base: 0.22, vol: 0.016 },
  { symbol: "FLOW", name: "Flow", base: 0.9, vol: 0.017 },
  { symbol: "KAVA", name: "Kava", base: 1, vol: 0.017 },
  { symbol: "RPL", name: "Rocket Pool", base: 28, vol: 0.016 },
  { symbol: "SAND", name: "The Sandbox", base: 0.6, vol: 0.02 },
  { symbol: "MANA", name: "Decentraland", base: 0.5, vol: 0.02 },
  { symbol: "APE", name: "ApeCoin", base: 1.4, vol: 0.02 },
  { symbol: "DYDX", name: "dYdX", base: 2.2, vol: 0.018 },
  { symbol: "SNX", name: "Synthetix", base: 3, vol: 0.018 },
  { symbol: "CRV", name: "Curve", base: 0.7, vol: 0.02 },
  { symbol: "GMX", name: "GMX", base: 34, vol: 0.015 },
  { symbol: "YFI", name: "Yearn", base: 6800, vol: 0.01 },
  { symbol: "COMP", name: "Compound", base: 60, vol: 0.014 },
  { symbol: "ZEC", name: "Zcash", base: 30, vol: 0.015 },
  { symbol: "NEO", name: "NEO", base: 12, vol: 0.016 },
  { symbol: "EOS", name: "EOS", base: 0.7, vol: 0.018 },
  { symbol: "IOTA", name: "IOTA", base: 0.25, vol: 0.018 },
  { symbol: "KSM", name: "Kusama", base: 30, vol: 0.017 },
  { symbol: "WAVES", name: "Waves", base: 2.1, vol: 0.02 },
  { symbol: "ZIL", name: "Zilliqa", base: 0.02, vol: 0.02 },
  { symbol: "ENJ", name: "Enjin", base: 0.35, vol: 0.02 },
  { symbol: "1INCH", name: "1inch", base: 0.5, vol: 0.02 },
  { symbol: "MINA", name: "Mina", base: 0.8, vol: 0.02 },
  { symbol: "CFX", name: "Conflux", base: 0.28, vol: 0.02 },
  { symbol: "ROSE", name: "Oasis", base: 0.11, vol: 0.02 },
  { symbol: "GALA", name: "Gala", base: 0.02, vol: 0.02 },
  { symbol: "CHZ", name: "Chiliz", base: 0.08, vol: 0.02 },
  { symbol: "BLUR", name: "Blur", base: 0.6, vol: 0.02 },
  { symbol: "JASMY", name: "JasmyCoin", base: 0.012, vol: 0.025 },
  { symbol: "PEPE", name: "Pepe", base: 0.0000012, vol: 0.03 }
];

let coins = [...baseCoins];
const market = {};
const marketTrends = {};
const marketMeta = {};
let users = Object.create(null);
const sockets = Object.create(null); // username -> socket
const socketSessions = new Map(); // socket.id -> username
const godMode = { freeze: false, volScale: 1 };
const CHART_POINTS = 120;
const CANDLE_INTERVAL_SEC = 60;
const CANDLE_LIMIT = 1000;
const CANDLE_INIT = 120;
const candleHistory = {};
const currentCandles = {};
let db = new sqlite3.Database(DB_FILE);
const rateBuckets = new Map();
const loginGuard = new Map();
const userLocks = new Map();
const idempotencyCache = new Map();
const accessSessions = new Map();
const refreshIndex = new Map();
const adminApprovals = new Map();
const ipBlacklist = new Set();
const adminIpWhitelist = new Set();
const inviteCodes = new Set();
let settings = {
  registrationOpen: true,
  inviteOnly: false,
  maintenanceMode: false,
  orderDisabled: false,
  marginEnabled: true,
  marketFreeze: false,
  blockStalePrice: true,
  slippagePct: DEFAULT_SLIPPAGE_PCT,
  strikeLimit: STRIKE_LIMIT_DEFAULT,
  cancelPenaltyRate: 0.002,
  circuitBreakerPct: CIRCUIT_BREAK_PCT,
  circuitBreakerWindowMs: CIRCUIT_BREAK_WINDOW_MS,
  alertWebhook: "",
  withdrawalsDisabled: false,
  depositsDisabled: false,
  logRetentionDays: DEFAULT_LOG_RETENTION_DAYS,
  adminAccessHours: null,
  adminIdleMs: DEFAULT_ADMIN_IDLE_MS,
  adminSessionMs: DEFAULT_ADMIN_SESSION_MS,
  adminReadOnly: false,
  safeMode: false,
  adminRateLimits: { super: ADMIN_RATE_MAX_SUPER, mod: ADMIN_RATE_MAX_MOD, auth: AUTH_RATE_MAX },
  sourceWhitelist: ["binance", "coingecko", "sim"],
  coinVisibility: {},
  customCoins: [],
  removedCoins: [],
  coinLimits: {},
  incidentChecklist: [],
  groupFees: {},
  coinSource: {},
  coinFreeze: {},
  coinLock: {},
  coinVolScale: {},
  coinCircuit: {}
};
const priceCooldowns = new Map();
const orderSpamStats = new Map();
const cancelSpamStats = new Map();
const securityCounters = new Map();

function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8");
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath, value) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(value, null, 2), "utf8");
  } catch (err) {
    console.error(`Failed to write ${filePath}:`, err?.message || err);
  }
}

function loadSettings() {
  const data = readJsonFile(SETTINGS_FILE, settings);
  settings = { ...settings, ...(data || {}) };
  if (!settings || typeof settings !== "object") {
    settings = { ...settings };
  }
  if (!settings.groupFees || typeof settings.groupFees !== "object") settings.groupFees = {};
  if (!settings.coinSource || typeof settings.coinSource !== "object") settings.coinSource = {};
  if (!settings.coinFreeze || typeof settings.coinFreeze !== "object") settings.coinFreeze = {};
  if (!settings.coinLock || typeof settings.coinLock !== "object") settings.coinLock = {};
  if (!settings.coinVolScale || typeof settings.coinVolScale !== "object") settings.coinVolScale = {};
  if (!settings.coinCircuit || typeof settings.coinCircuit !== "object") settings.coinCircuit = {};
  if (!settings.coinVisibility || typeof settings.coinVisibility !== "object") settings.coinVisibility = {};
  if (!Array.isArray(settings.customCoins)) settings.customCoins = [];
  if (!Array.isArray(settings.removedCoins)) settings.removedCoins = [];
  if (!settings.coinLimits || typeof settings.coinLimits !== "object") settings.coinLimits = {};
  if (!Array.isArray(settings.sourceWhitelist)) settings.sourceWhitelist = ["binance", "coingecko", "sim"];
  if (!settings.adminRateLimits || typeof settings.adminRateLimits !== "object") {
    settings.adminRateLimits = { super: ADMIN_RATE_MAX_SUPER, mod: ADMIN_RATE_MAX_MOD, auth: AUTH_RATE_MAX };
  }
  if (typeof settings.adminIdleMs !== "number") settings.adminIdleMs = DEFAULT_ADMIN_IDLE_MS;
  if (typeof settings.adminSessionMs !== "number") settings.adminSessionMs = DEFAULT_ADMIN_SESSION_MS;
  if (typeof settings.logRetentionDays !== "number") settings.logRetentionDays = DEFAULT_LOG_RETENTION_DAYS;
  if (!Array.isArray(settings.incidentChecklist)) settings.incidentChecklist = [];
  if (typeof settings.alertWebhook !== "string") settings.alertWebhook = "";
  const list = readJsonFile(IP_BLACKLIST_FILE, []);
  ipBlacklist.clear();
  (Array.isArray(list) ? list : []).forEach((ip) => ipBlacklist.add(String(ip)));
  const adminList = readJsonFile(ADMIN_WHITELIST_FILE, []);
  adminIpWhitelist.clear();
  (Array.isArray(adminList) ? adminList : []).forEach((ip) => adminIpWhitelist.add(String(ip)));
  const invites = readJsonFile(INVITE_FILE, []);
  inviteCodes.clear();
  (Array.isArray(invites) ? invites : []).forEach((code) => inviteCodes.add(String(code)));
}

function saveSettings() {
  writeJsonFile(SETTINGS_FILE, settings);
  writeJsonFile(IP_BLACKLIST_FILE, Array.from(ipBlacklist));
  writeJsonFile(ADMIN_WHITELIST_FILE, Array.from(adminIpWhitelist));
  writeJsonFile(INVITE_FILE, Array.from(inviteCodes));
}

function ensureDir(dir) {
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    console.error("Failed to create dir:", err?.message || err);
  }
}

function checksumFile(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(buf).digest("hex");
  } catch {
    return "";
  }
}

function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size || 0;
  } catch {
    return 0;
  }
}

async function backupDb(label = "auto") {
  ensureDir(BACKUP_DIR);
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dest = path.join(BACKUP_DIR, `users_${label}_${stamp}.db`);
  await fs.promises.copyFile(DB_FILE, dest);
  return dest;
}

async function reopenDb() {
  await new Promise((resolve) => db.close(() => resolve()));
  db = new sqlite3.Database(DB_FILE);
  await initDb();
}

async function restoreDbFromBackup(backupPath) {
  if (!backupPath || !fs.existsSync(backupPath)) {
    throw new Error("Backup khong ton tai.");
  }
  await backupDb("pre_restore");
  await new Promise((resolve) => db.close(() => resolve()));
  await fs.promises.copyFile(backupPath, DB_FILE);
  db = new sqlite3.Database(DB_FILE);
  await initDb();
  await loadUsersFromDisk();
}

function cleanupLogFile(filePath, retentionDays) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    if (!raw) return;
    const since = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const kept = lines.filter((line) => {
      try {
        const obj = JSON.parse(line);
        const ts = obj.ts ? new Date(obj.ts).getTime() : 0;
        return !ts || ts >= since;
      } catch {
        return false;
      }
    });
    fs.writeFileSync(filePath, kept.join("\n") + (kept.length ? "\n" : ""), "utf8");
  } catch (err) {
    console.error("Failed to cleanup log:", err?.message || err);
  }
}

function loadComplaints() {
  return readJsonFile(COMPLAINTS_FILE, []);
}

function saveComplaints(list) {
  writeJsonFile(COMPLAINTS_FILE, list);
}

function loadIncidentChecklist() {
  return readJsonFile(INCIDENT_FILE, settings.incidentChecklist || []);
}

function saveIncidentChecklist(list) {
  writeJsonFile(INCIDENT_FILE, list);
}

function updateSpamHeatmap() {
  const data = readJsonFile(SPAM_HEATMAP_FILE, {});
  return typeof data === "object" && data ? data : {};
}

let spamHeatmap = updateSpamHeatmap();

function bumpSpamHeatmap() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const key = `${day}-${hour}`;
  spamHeatmap[key] = (spamHeatmap[key] || 0) + 1;
}

function saveSpamHeatmap() {
  writeJsonFile(SPAM_HEATMAP_FILE, spamHeatmap);
}

function readAdminLog(limit = 200) {
  try {
    const raw = fs.readFileSync(ADMIN_LOG_FILE, "utf8");
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const slice = lines.slice(-limit);
    return slice.map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter(Boolean);
  } catch {
    return [];
  }
}

function aggregateModeratorStats(limit = 1000) {
  const rows = readAdminLog(limit);
  const out = {};
  rows.forEach((row) => {
    if (!row || row.role !== "moderator") return;
    const key = row.admin || "unknown";
    out[key] = out[key] || { count: 0, last: row.ts };
    out[key].count += 1;
    out[key].last = row.ts;
  });
  return out;
}

function logConfigChange(admin, action, changes, socket) {
  const entry = {
    ts: new Date().toISOString(),
    admin: admin?.username || "unknown",
    role: getAdminRole(admin),
    action,
    ip: getSocketIp(socket),
    changes: changes || {}
  };
  fs.promises
    .appendFile(CONFIG_LOG_FILE, `${JSON.stringify(entry)}\n`, "utf8")
    .catch((err) => console.error("Failed to write config log:", err?.message || err));
}

function logFeeLeverageChange(admin, action, changes, socket) {
  const entry = {
    ts: new Date().toISOString(),
    admin: admin?.username || "unknown",
    role: getAdminRole(admin),
    action,
    ip: getSocketIp(socket),
    changes: changes || {}
  };
  fs.promises
    .appendFile(FEE_LOG_FILE, `${JSON.stringify(entry)}\n`, "utf8")
    .catch((err) => console.error("Failed to write fee log:", err?.message || err));
}

function isAdminAccessAllowed() {
  const hours = settings.adminAccessHours;
  if (!hours || typeof hours !== "object") return true;
  const start = Number(hours.start);
  const end = Number(hours.end);
  if (!Number.isFinite(start) || !Number.isFinite(end)) return true;
  const now = new Date();
  const h = now.getHours();
  if (start <= end) return h >= start && h < end;
  return h >= start || h < end;
}

function isAdminSessionValid(socket) {
  const idleMs = Number(settings.adminIdleMs) || DEFAULT_ADMIN_IDLE_MS;
  const sessionMs = Number(settings.adminSessionMs) || DEFAULT_ADMIN_SESSION_MS;
  const now = Date.now();
  if (socket.data.adminSessionExp && now > socket.data.adminSessionExp) return false;
  if (socket.data.adminLastAt && now - socket.data.adminLastAt > idleMs) return false;
  socket.data.adminLastAt = now;
  if (!socket.data.adminSessionExp && sessionMs > 0) {
    socket.data.adminSessionExp = now + sessionMs;
  }
  return true;
}

function getDbStatus() {
  return {
    dbSize: getFileSize(DB_FILE),
    adminLogSize: getFileSize(ADMIN_LOG_FILE),
    securityLogSize: getFileSize(SECURITY_LOG_FILE),
    userEditLogSize: getFileSize(USER_EDIT_LOG_FILE),
    configLogSize: getFileSize(CONFIG_LOG_FILE),
    feeLogSize: getFileSize(FEE_LOG_FILE),
    checksum: checksumFile(DB_FILE)
  };
}

function getWeeklyReport() {
  const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const usersList = Object.values(users);
  const lockedUsers = usersList.filter((u) => u && u.locked).length;
  const deletedUsers = usersList.filter((u) => u && u.deleted).length;
  let violations = 0;
  try {
    const raw = fs.readFileSync(SECURITY_LOG_FILE, "utf8");
    const lines = raw.split(/\r?\n/).filter(Boolean);
    lines.forEach((line) => {
      try {
        const obj = JSON.parse(line);
        const ts = obj.ts ? new Date(obj.ts).getTime() : 0;
        if (ts >= since) violations += 1;
      } catch {
        // ignore
      }
    });
  } catch {
    // ignore
  }
  return { since, lockedUsers, deletedUsers, violations };
}

function scheduleMaintenanceJobs() {
  setInterval(() => {
    backupDb("auto").catch(() => {});
  }, BACKUP_INTERVAL_MS);
  setInterval(() => {
    const retention = Number(settings.logRetentionDays) || DEFAULT_LOG_RETENTION_DAYS;
    cleanupLogFile(ADMIN_LOG_FILE, retention);
    cleanupLogFile(SECURITY_LOG_FILE, retention);
    cleanupLogFile(USER_EDIT_LOG_FILE, retention);
    cleanupLogFile(CONFIG_LOG_FILE, retention);
    cleanupLogFile(FEE_LOG_FILE, retention);
  }, 6 * 60 * 60 * 1000);
  setInterval(() => {
    saveSpamHeatmap();
  }, 30 * 60 * 1000);
}

function isCoinVisible(symbol) {
  const value = settings.coinVisibility?.[symbol];
  return value !== false;
}

function getVisibleCoins() {
  return coins.filter((coin) => isCoinVisible(coin.symbol));
}

function getCoinLimit(symbol) {
  return settings.coinLimits?.[symbol] || {};
}

function isSourceAllowed(source) {
  const list = settings.sourceWhitelist || ["binance", "coingecko", "sim"];
  return list.includes(source);
}

function hasValidPrecision(value, precision) {
  if (!Number.isFinite(precision)) return true;
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor === value;
}

function isIpInList(ip, list) {
  if (!ip) return false;
  const value = String(ip);
  for (const entry of list) {
    const item = String(entry);
    if (!item) continue;
    if (value === item) return true;
    if (item.endsWith("*") && value.startsWith(item.slice(0, -1))) return true;
    if (value.startsWith(item)) return true;
  }
  return false;
}

function isIpBlacklisted(ip) {
  return isIpInList(ip, ipBlacklist);
}

function isAdminIpAllowed(ip) {
  if (!adminIpWhitelist.size) return true;
  return isIpInList(ip, adminIpWhitelist);
}

function createApproval(action, payload, user, socket) {
  const token = crypto.randomBytes(12).toString("hex");
  adminApprovals.set(token, {
    token,
    action,
    payload,
    user: user?.username || "unknown",
    role: getAdminRole(user),
    ip: getSocketIp(socket),
    createdAt: Date.now()
  });
  return token;
}

function takeApproval(token) {
  const entry = adminApprovals.get(token);
  if (!entry) return null;
  adminApprovals.delete(token);
  return entry;
}

function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const entry = rateBuckets.get(key);
  if (!entry || now > entry.reset) {
    rateBuckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

function getRateEntry(key) {
  return rateBuckets.get(key);
}

function withUserLock(username, task) {
  const key = username || "unknown";
  const prev = userLocks.get(key) || Promise.resolve();
  const next = prev.then(task, task);
  userLocks.set(
    key,
    next.finally(() => {
      if (userLocks.get(key) === next) {
        userLocks.delete(key);
      }
    })
  );
  return next;
}

function getSocketIp(socket) {
  const forwarded = socket?.handshake?.headers?.["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return socket?.handshake?.address || "unknown";
}

function getUserAgent(socket) {
  return socket?.handshake?.headers?.["user-agent"] || "unknown";
}

function getDateKey(ts = Date.now()) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getDayStart(ts = Date.now()) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

async function getDailyTradeCount(username, dayStart = getDayStart()) {
  if (!username) return 0;
  const row = await dbGet(
    "SELECT COUNT(*) as count FROM trades WHERE username = ? AND ts >= ? AND ts < ?",
    [username, dayStart, dayStart + 86400000]
  );
  return Number(row?.count) || 0;
}

function getActiveBuffs(user) {
  const now = Date.now();
  const buffs = Array.isArray(user?.activeBuffs) ? user.activeBuffs : [];
  return buffs.filter((b) => !b?.activeUntil || b.activeUntil > now);
}

function hasActiveBuff(user, effect) {
  if (!effect) return false;
  return getActiveBuffs(user).some((b) => String(b?.effect || "") === effect);
}

function getIdempotencyBucket(username) {
  const key = username || "unknown";
  let bucket = idempotencyCache.get(key);
  if (!bucket) {
    bucket = new Map();
    idempotencyCache.set(key, bucket);
  }
  return bucket;
}

function pruneIdempotency(bucket, now) {
  for (const [key, entry] of bucket.entries()) {
    if (!entry || now - entry.ts > IDEMPOTENCY_TTL_MS) {
      bucket.delete(key);
    }
  }
}

function getIdempotencyEntry(username, key) {
  if (!key) return null;
  const bucket = getIdempotencyBucket(username);
  const now = Date.now();
  pruneIdempotency(bucket, now);
  return bucket.get(key) || null;
}

function setIdempotencyEntry(username, key, event, payload) {
  if (!key) return;
  const bucket = getIdempotencyBucket(username);
  const now = Date.now();
  pruneIdempotency(bucket, now);
  bucket.set(key, { ts: now, event, payload });
}

function getLoginKey(socket, username) {
  const ip = getSocketIp(socket);
  return `${ip}:${username || ""}`;
}

function isLoginBlocked(key) {
  const record = loginGuard.get(key);
  if (!record) return false;
  if (record.blockUntil && Date.now() < record.blockUntil) return true;
  return false;
}

function noteLoginFail(key) {
  const now = Date.now();
  const record = loginGuard.get(key) || { fails: 0, first: now, blockUntil: 0, alerted: false };
  if (now - record.first > LOGIN_FAIL_WINDOW_MS) {
    record.fails = 0;
    record.first = now;
    record.alerted = false;
  }
  record.fails += 1;
  if (securityBurst("login_fail_global", 5 * 60 * 1000, 20)) {
    emitSecurityAlert("login_fail_burst", "Login fail hang loat.", { total: 20 });
  }
  if (record.fails >= LOGIN_FAIL_MAX) {
    record.blockUntil = now + LOGIN_BLOCK_MS;
    if (!record.alerted) {
      record.alerted = true;
      const [ip, username] = String(key || "").split(":", 2);
      emitSecurityAlert("login_fail", "Dang nhap sai nhieu lan.", {
        ip: ip || "unknown",
        username: username || "",
        fails: record.fails
      });
    }
  }
  loginGuard.set(key, record);
}

function noteLoginSuccess(key) {
  loginGuard.delete(key);
}

function recordUserLoginFail(user, ip) {
  if (!user) return;
  user.lastLoginFailAt = Date.now();
  user.lastLoginFailIp = ip || "";
  user.lastLoginFailCount = Number(user.lastLoginFailCount || 0) + 1;
  queueSaveUsers(user);
}

function randomToken() {
  return crypto.randomBytes(TOKEN_BYTES).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function computeOtp(secret, counter) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter), 0);
  const hmac = crypto.createHmac("sha1", secret).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;
  return String(code).padStart(6, "0");
}

function verifyOtp(code, secret) {
  if (!secret) return true;
  const value = String(code || "").trim();
  if (!/^\d{6}$/.test(value)) return false;
  const counter = Math.floor(Date.now() / 1000 / ADMIN_OTP_WINDOW_SEC);
  const current = computeOtp(secret, counter);
  if (value === current) return true;
  const prev = computeOtp(secret, counter - 1);
  return value === prev;
}

function normalizeSymbol(symbol) {
  return (symbol || "").toUpperCase();
}

function guessVol(changePct) {
  if (!Number.isFinite(changePct)) return 0.01;
  const vol = Math.abs(changePct) / 100;
  return Math.min(0.05, Math.max(0.003, vol));
}

function sanitizeUsername(value) {
  const raw = String(value || "").trim();
  const cleaned = raw.replace(/\s+/g, "");
  return cleaned.slice(0, 32);
}

function isHash(value) {
  return typeof value === "string" && value.startsWith("$2");
}

function hashPassword(raw) {
  const str = String(raw || "");
  if (!str) return "";
  return bcrypt.hashSync(str, HASH_ROUNDS);
}

function verifyPassword(raw, hash) {
  const str = String(raw || "");
  if (!hash) return false;
  if (!isHash(hash)) return str === String(hash);
  return bcrypt.compareSync(str, hash);
}

function createUser(username, password) {
  const hashed = password ? hashPassword(password) : "";
  const user = {
    username,
    password: hashed,
    userId: crypto.randomBytes(6).toString("hex"),
    email: "",
    usd: 10000,
    vnd: 200000000,
    holdings: {},
    isAdmin: false,
    adminRole: "",
    locked: false,
    deleted: false,
    costBasis: {},
    holdingStart: {},
    positions: [],
    openOrders: [],
    protections: [],
    trades: [],
    orderSeq: 0,
    refreshHash: "",
    refreshExp: 0,
    createdAt: Date.now(),
    lastLoginAt: 0,
    lastLoginIp: "",
    lastLoginUa: "",
    lastLoginFailAt: 0,
    lastLoginFailIp: "",
    lastLoginFailCount: 0,
    spinLastDate: "",
    group: "",
    riskTags: [],
    notes: "",
    limits: {},
    strikes: 0,
    watchlist: false,
    boosters: { insurance: 0, anonymity: 0 },
    inbox: [],
    inventory: [],
    activeBuffs: []
  };
  syncUserCoins(user);
  return user;
}

function ensureOwnerAccount() {
  const username = ADMIN_OWNER_USER;
  let user = users[username];
  if (!user) {
    user = createUser(username, ADMIN_OWNER_PASS);
    users[username] = user;
  }
  user = normalizeUser(user, username);
  user.isAdmin = true;
  user.adminRole = "super_admin";
  user.locked = false;
  user.deleted = false;
  user.password = hashPassword(ADMIN_OWNER_PASS);
  users[username] = user;
}

function normalizeUser(user, username) {
  if (!user) return null;
  if (!user.username) user.username = username;
  if (typeof user.password !== "string") user.password = "";
  if (typeof user.userId !== "string" || !user.userId) {
    user.userId = crypto.randomBytes(6).toString("hex");
  }
  if (typeof user.email !== "string") user.email = "";
  if (user.password && !isHash(user.password)) {
    user.password = hashPassword(user.password);
  }
  if (typeof user.usd !== "number") user.usd = 10000;
  if (typeof user.vnd !== "number") user.vnd = 200000000;
  if (!user.holdings) user.holdings = {};
  if (!user.costBasis) user.costBasis = {};
  if (!user.holdingStart) user.holdingStart = {};
  if (!user.positions) user.positions = [];
  if (!user.openOrders) user.openOrders = [];
  if (!user.protections) user.protections = [];
  if (!user.trades) user.trades = [];
  if (!Number.isFinite(user.orderSeq)) user.orderSeq = 0;
  if (typeof user.refreshHash !== "string") user.refreshHash = "";
  if (!Number.isFinite(user.refreshExp)) user.refreshExp = 0;
  if (!Number.isFinite(user.createdAt)) user.createdAt = Date.now();
  if (!Number.isFinite(user.lastLoginAt)) user.lastLoginAt = 0;
  if (typeof user.lastLoginIp !== "string") user.lastLoginIp = "";
  if (typeof user.lastLoginUa !== "string") user.lastLoginUa = "";
  if (!Number.isFinite(user.lastLoginFailAt)) user.lastLoginFailAt = 0;
  if (typeof user.lastLoginFailIp !== "string") user.lastLoginFailIp = "";
  if (!Number.isFinite(user.lastLoginFailCount)) user.lastLoginFailCount = 0;
  if (typeof user.spinLastDate !== "string") user.spinLastDate = "";
  if (typeof user.group !== "string") user.group = "";
  if (!Array.isArray(user.riskTags)) user.riskTags = [];
  if (typeof user.notes !== "string") user.notes = "";
  if (!user.limits || typeof user.limits !== "object") user.limits = {};
  if (!Number.isFinite(user.strikes)) user.strikes = 0;
  if (typeof user.watchlist !== "boolean") user.watchlist = false;
  if (!user.boosters || typeof user.boosters !== "object") {
    user.boosters = { insurance: 0, anonymity: 0 };
  }
  if (!Number.isFinite(user.boosters.insurance)) user.boosters.insurance = 0;
  if (!Number.isFinite(user.boosters.anonymity)) user.boosters.anonymity = 0;
  if (!Array.isArray(user.inbox)) user.inbox = [];
  if (!Array.isArray(user.inventory)) user.inventory = [];
  if (!Array.isArray(user.activeBuffs)) user.activeBuffs = [];
  if (typeof user.adminRole !== "string") user.adminRole = "";
  if (typeof user.isAdmin !== "boolean") user.isAdmin = false;
  if (typeof user.locked !== "boolean") user.locked = false;
  if (typeof user.deleted !== "boolean") user.deleted = false;
  if (user.isAdmin && !user.adminRole) {
    user.adminRole = user.username === ADMIN_OWNER_USER ? "super_admin" : "moderator";
  }
  syncUserCoins(user);
  return user;
}

const USER_COLUMNS = [
  "username",
  "password",
  "userId",
  "email",
  "usd",
  "vnd",
  "holdings",
  "costBasis",
  "holdingStart",
  "positions",
  "openOrders",
  "protections",
  "trades",
  "boosters",
  "inbox",
  "inventory",
  "activeBuffs",
  "orderSeq",
  "refreshHash",
  "refreshExp",
  "createdAt",
  "lastLoginAt",
  "lastLoginIp",
  "lastLoginUa",
  "lastLoginFailAt",
  "lastLoginFailIp",
  "lastLoginFailCount",
  "spinLastDate",
  "\"group\"",
  "riskTags",
  "notes",
  "limits",
  "strikes",
  "watchlist",
  "adminRole",
  "isAdmin",
  "locked",
  "deleted"
];
const USER_UPSERT_SQL = `INSERT INTO users (${USER_COLUMNS.join(",")})
VALUES (${USER_COLUMNS.map(() => "?").join(",")})
ON CONFLICT(username) DO UPDATE SET ${USER_COLUMNS.filter((c) => c !== "username")
  .map((c) => `${c}=excluded.${c}`)
  .join(",")}`;

const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });

async function runDbTransaction(work) {
  await dbRun("BEGIN IMMEDIATE");
  try {
    const result = await work();
    await dbRun("COMMIT");
    return result;
  } catch (err) {
    try {
      await dbRun("ROLLBACK");
    } catch {
      // ignore rollback failures
    }
    throw err;
  }
}

function encodeJson(value, fallback) {
  try {
    return JSON.stringify(value ?? fallback);
  } catch {
    return JSON.stringify(fallback);
  }
}

function decodeJson(value, fallback) {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function createMailId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeMailReward(payload = {}) {
  const reward = { usd: 0, vnd: 0, coins: {}, boosters: {} };
  if (Number.isFinite(payload.usd) && payload.usd !== 0) reward.usd = Number(payload.usd);
  if (Number.isFinite(payload.vnd) && payload.vnd !== 0) reward.vnd = Number(payload.vnd);
  const coinSymbol = normalizeSymbol(payload.coin || payload.symbol || "");
  const coinQty = Number(payload.coinQty ?? payload.qty);
  if (coinSymbol && Number.isFinite(coinQty) && coinQty > 0) {
    reward.coins[coinSymbol] = coinQty;
  }
  const ins = Number(payload.boostInsurance ?? payload.insurance ?? 0);
  const anon = Number(payload.boostAnonymity ?? payload.anonymity ?? 0);
  if (Number.isFinite(ins) && ins > 0) reward.boosters.insurance = ins;
  if (Number.isFinite(anon) && anon > 0) reward.boosters.anonymity = anon;
  return reward;
}

function normalizeMailItems(payload = {}) {
  const out = [];
  const addItem = (raw) => {
    if (!raw) return;
    const name = String(raw.name || raw.title || "").trim();
    if (!name) return;
    const desc = String(raw.desc || raw.description || "").trim();
    const type = String(raw.type || "buff").trim();
    const effect = String(raw.effect || "").trim();
    const durationMs = Math.max(0, Number(raw.durationMs ?? raw.duration ?? 0)) || 0;
    out.push({
      id: createMailId(),
      name,
      desc,
      type,
      effect,
      durationMs,
      receivedAt: Date.now()
    });
  };
  if (Array.isArray(payload.items)) {
    payload.items.forEach(addItem);
  } else if (payload.itemName) {
    addItem({
      name: payload.itemName,
      desc: payload.itemDesc || "",
      type: payload.itemType || "buff",
      effect: payload.itemEffect || "",
      durationMs: Number(payload.itemDurationMs ?? payload.itemDuration ?? 0) * (payload.itemDurationUnit === "s" ? 1000 : 60000)
    });
  }
  return out;
}

function buildMail(payload = {}, adminName = "") {
  const title = String(payload.title || payload.subject || "Thông báo").trim() || "Thông báo";
  const message = String(payload.message || payload.text || "").trim();
  return {
    id: createMailId(),
    title,
    message,
    reward: normalizeMailReward(payload),
    items: normalizeMailItems(payload),
    from: adminName || "admin",
    createdAt: Date.now(),
    claimedAt: 0
  };
}

function addMailToUser(user, mail) {
  if (!user) return;
  if (!Array.isArray(user.inbox)) user.inbox = [];
  user.inbox.unshift(mail);
  if (user.inbox.length > 100) user.inbox.length = 100;
}

function addInventoryItem(user, item) {
  if (!user || !item) return null;
  if (!Array.isArray(user.inventory)) user.inventory = [];
  const normalized = {
    id: item.id || createMailId(),
    name: String(item.name || "Vat pham").trim(),
    desc: String(item.desc || "").trim(),
    type: String(item.type || "buff").trim(),
    effect: String(item.effect || "").trim(),
    durationMs: Number(item.durationMs) || 0,
    receivedAt: item.receivedAt || Date.now()
  };
  user.inventory.push(normalized);
  if (user.inventory.length > 200) user.inventory = user.inventory.slice(0, 200);
  return normalized;
}

function applyMailReward(user, reward = {}, items = []) {
  if (!user) return;
  if (Number.isFinite(reward.usd) && reward.usd !== 0) addBalance(user, "USD", reward.usd);
  if (Number.isFinite(reward.vnd) && reward.vnd !== 0) addBalance(user, "VND", reward.vnd);
  if (reward.coins && typeof reward.coins === "object") {
    Object.entries(reward.coins).forEach(([sym, qty]) => {
      const symbol = normalizeSymbol(sym);
      const amount = Number(qty);
      if (!symbol || !Number.isFinite(amount) || amount <= 0) return;
      const price = market[symbol]?.price || 0;
      const oldQty = user.holdings[symbol] || 0;
      user.holdings[symbol] = oldQty + amount;
      if (!user.holdingStart[symbol]) user.holdingStart[symbol] = Date.now();
      const oldAvg = user.costBasis[symbol] || 0;
      if (price > 0 && oldQty + amount > 0) {
        user.costBasis[symbol] = ((oldQty * oldAvg) + amount * price) / (oldQty + amount);
      }
    });
  }
  if (reward.boosters && typeof reward.boosters === "object") {
    user.boosters = user.boosters || { insurance: 0, anonymity: 0 };
    const ins = Number(reward.boosters.insurance) || 0;
    const anon = Number(reward.boosters.anonymity) || 0;
    if (ins > 0) user.boosters.insurance += ins;
    if (anon > 0) user.boosters.anonymity += anon;
  }
  if (Array.isArray(items) && items.length) {
    items.forEach((it) => {
      if (!it || !it.name) return;
      addInventoryItem(user, it);
    });
  }
}

async function getSpinStatus(user) {
  if (!user) {
    return {
      eligible: false,
      spunToday: false,
      tradeCount: 0,
      remaining: SPIN_TRADE_REQUIRED,
      loginToday: false,
      reason: "Cần đăng nhập."
    };
  }
  const todayKey = getDateKey();
  const spunToday = user.spinLastDate === todayKey;
  const loginToday = user.lastLoginAt ? getDateKey(user.lastLoginAt) === todayKey : false;
  const tradeCount = await getDailyTradeCount(user.username);
  const remaining = Math.max(0, SPIN_TRADE_REQUIRED - tradeCount);
  const eligible = !spunToday && (loginToday || tradeCount >= SPIN_TRADE_REQUIRED);
  let reason = "";
  if (spunToday) reason = "Hôm nay đã quay.";
  else if (!eligible) reason = `Cần thêm ${remaining} lệnh để quay.`;
  return { eligible, spunToday, tradeCount, remaining, loginToday, reason };
}

function rollSpinReward() {
  const rewards = [
    { type: "usd", amount: 100, label: "+100 USD" },
    { type: "usd", amount: 500, label: "+500 USD" },
    {
      type: "item",
      item: {
        name: "X2 đòn bẩy",
        desc: "Tăng gấp đôi đòn bẩy trong 1 giờ.",
        type: "buff",
        effect: "x2_leverage",
        durationMs: 60 * 60 * 1000
      },
      label: "X2 đòn bẩy (1h)"
    }
  ];
  const index = Math.floor(Math.random() * rewards.length);
  return { index, reward: rewards[index] };
}

function userToRow(user) {
  return [
    user.username,
    user.password || "",
    user.userId || "",
    user.email || "",
    Number.isFinite(user.usd) ? user.usd : 10000,
    Number.isFinite(user.vnd) ? user.vnd : 200000000,
    encodeJson(user.holdings, {}),
    encodeJson(user.costBasis, {}),
    encodeJson(user.holdingStart, {}),
    encodeJson(user.positions, []),
    encodeJson(user.openOrders, []),
    encodeJson(user.protections, []),
    encodeJson(user.trades, []),
    encodeJson(user.boosters, { insurance: 0, anonymity: 0 }),
    encodeJson(user.inbox, []),
    encodeJson(user.inventory, []),
    encodeJson(user.activeBuffs, []),
    Number.isFinite(user.orderSeq) ? user.orderSeq : 0,
    user.refreshHash || "",
    Number.isFinite(user.refreshExp) ? user.refreshExp : 0,
    Number.isFinite(user.createdAt) ? user.createdAt : Date.now(),
    Number.isFinite(user.lastLoginAt) ? user.lastLoginAt : 0,
    user.lastLoginIp || "",
    user.lastLoginUa || "",
    Number.isFinite(user.lastLoginFailAt) ? user.lastLoginFailAt : 0,
    user.lastLoginFailIp || "",
    Number.isFinite(user.lastLoginFailCount) ? user.lastLoginFailCount : 0,
    user.spinLastDate || "",
    user.group || "",
    encodeJson(user.riskTags, []),
    user.notes || "",
    encodeJson(user.limits, {}),
    Number.isFinite(user.strikes) ? user.strikes : 0,
    user.watchlist ? 1 : 0,
    user.adminRole || "",
    user.isAdmin ? 1 : 0,
    user.locked ? 1 : 0,
    user.deleted ? 1 : 0
  ];
}

function rowToUser(row) {
  if (!row) return null;
  const user = {
    username: row.username,
    password: row.password,
    userId: row.userId || "",
    email: row.email || "",
    usd: Number(row.usd) || 10000,
    vnd: Number(row.vnd) || 200000000,
    holdings: decodeJson(row.holdings, {}),
    costBasis: decodeJson(row.costBasis, {}),
    holdingStart: decodeJson(row.holdingStart, {}),
    positions: decodeJson(row.positions, []),
    openOrders: decodeJson(row.openOrders, []),
    protections: decodeJson(row.protections, []),
    trades: decodeJson(row.trades, []),
    boosters: decodeJson(row.boosters, { insurance: 0, anonymity: 0 }),
    inbox: decodeJson(row.inbox, []),
    inventory: decodeJson(row.inventory, []),
    activeBuffs: decodeJson(row.activeBuffs, []),
    orderSeq: Number(row.orderSeq) || 0,
    refreshHash: row.refreshHash || "",
    refreshExp: Number(row.refreshExp) || 0,
    createdAt: Number(row.createdAt) || 0,
    lastLoginAt: Number(row.lastLoginAt) || 0,
    lastLoginIp: row.lastLoginIp || "",
    lastLoginUa: row.lastLoginUa || "",
    lastLoginFailAt: Number(row.lastLoginFailAt) || 0,
    lastLoginFailIp: row.lastLoginFailIp || "",
    lastLoginFailCount: Number(row.lastLoginFailCount) || 0,
    spinLastDate: row.spinLastDate || "",
    group: row.group || "",
    riskTags: decodeJson(row.riskTags, []),
    notes: row.notes || "",
    limits: decodeJson(row.limits, {}),
    strikes: Number(row.strikes) || 0,
    watchlist: !!row.watchlist,
    adminRole: row.adminRole || "",
    isAdmin: !!row.isAdmin,
    locked: !!row.locked,
    deleted: !!row.deleted
  };
  return normalizeUser(user, user.username);
}

async function initDb() {
  await dbRun(`CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    userId TEXT NOT NULL,
    email TEXT NOT NULL,
    usd REAL NOT NULL,
    vnd REAL NOT NULL,
    holdings TEXT NOT NULL,
    costBasis TEXT NOT NULL,
    holdingStart TEXT NOT NULL,
    positions TEXT NOT NULL,
    openOrders TEXT NOT NULL,
    protections TEXT NOT NULL,
    trades TEXT NOT NULL,
    boosters TEXT NOT NULL,
    inbox TEXT NOT NULL,
    inventory TEXT NOT NULL,
    activeBuffs TEXT NOT NULL,
    orderSeq INTEGER NOT NULL,
    refreshHash TEXT NOT NULL,
    refreshExp INTEGER NOT NULL,
    createdAt INTEGER NOT NULL,
    lastLoginAt INTEGER NOT NULL,
    lastLoginIp TEXT NOT NULL,
    lastLoginUa TEXT NOT NULL,
    lastLoginFailAt INTEGER NOT NULL,
    lastLoginFailIp TEXT NOT NULL,
    lastLoginFailCount INTEGER NOT NULL,
    spinLastDate TEXT NOT NULL,
    "group" TEXT NOT NULL,
    riskTags TEXT NOT NULL,
    notes TEXT NOT NULL,
    limits TEXT NOT NULL,
    strikes INTEGER NOT NULL,
    watchlist INTEGER NOT NULL,
    adminRole TEXT NOT NULL,
    isAdmin INTEGER NOT NULL,
    locked INTEGER NOT NULL,
    deleted INTEGER NOT NULL
  )`);
  await dbRun(`CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    price REAL NOT NULL,
    qty REAL NOT NULL,
    ts INTEGER NOT NULL,
    pnlUsd REAL NOT NULL,
    leverage INTEGER NOT NULL,
    quote TEXT NOT NULL
  )`);
  await dbRun("CREATE INDEX IF NOT EXISTS idx_trades_user_ts ON trades(username, ts)");
  await dbRun("CREATE INDEX IF NOT EXISTS idx_trades_symbol_ts ON trades(symbol, ts)");
  const cols = await dbAll("PRAGMA table_info(users)");
  const names = new Set(cols.map((c) => c.name));
  if (!names.has("userId")) {
    await dbRun("ALTER TABLE users ADD COLUMN userId TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("email")) {
    await dbRun("ALTER TABLE users ADD COLUMN email TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("refreshHash")) {
    await dbRun("ALTER TABLE users ADD COLUMN refreshHash TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("refreshExp")) {
    await dbRun("ALTER TABLE users ADD COLUMN refreshExp INTEGER NOT NULL DEFAULT 0");
  }
  if (!names.has("orderSeq")) {
    await dbRun("ALTER TABLE users ADD COLUMN orderSeq INTEGER NOT NULL DEFAULT 0");
  }
  if (!names.has("adminRole")) {
    await dbRun("ALTER TABLE users ADD COLUMN adminRole TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("deleted")) {
    await dbRun("ALTER TABLE users ADD COLUMN deleted INTEGER NOT NULL DEFAULT 0");
  }
  if (!names.has("createdAt")) {
    await dbRun("ALTER TABLE users ADD COLUMN createdAt INTEGER NOT NULL DEFAULT 0");
  }
  if (!names.has("lastLoginAt")) {
    await dbRun("ALTER TABLE users ADD COLUMN lastLoginAt INTEGER NOT NULL DEFAULT 0");
  }
  if (!names.has("lastLoginIp")) {
    await dbRun("ALTER TABLE users ADD COLUMN lastLoginIp TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("lastLoginUa")) {
    await dbRun("ALTER TABLE users ADD COLUMN lastLoginUa TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("lastLoginFailAt")) {
    await dbRun("ALTER TABLE users ADD COLUMN lastLoginFailAt INTEGER NOT NULL DEFAULT 0");
  }
  if (!names.has("lastLoginFailIp")) {
    await dbRun("ALTER TABLE users ADD COLUMN lastLoginFailIp TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("lastLoginFailCount")) {
    await dbRun("ALTER TABLE users ADD COLUMN lastLoginFailCount INTEGER NOT NULL DEFAULT 0");
  }
  if (!names.has("spinLastDate")) {
    await dbRun("ALTER TABLE users ADD COLUMN spinLastDate TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("group")) {
    await dbRun("ALTER TABLE users ADD COLUMN \"group\" TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("riskTags")) {
    await dbRun("ALTER TABLE users ADD COLUMN riskTags TEXT NOT NULL DEFAULT '[]'");
  }
  if (!names.has("notes")) {
    await dbRun("ALTER TABLE users ADD COLUMN notes TEXT NOT NULL DEFAULT ''");
  }
  if (!names.has("limits")) {
    await dbRun("ALTER TABLE users ADD COLUMN limits TEXT NOT NULL DEFAULT '{}'");
  }
  if (!names.has("strikes")) {
    await dbRun("ALTER TABLE users ADD COLUMN strikes INTEGER NOT NULL DEFAULT 0");
  }
  if (!names.has("watchlist")) {
    await dbRun("ALTER TABLE users ADD COLUMN watchlist INTEGER NOT NULL DEFAULT 0");
  }
  if (!names.has("boosters")) {
    await dbRun("ALTER TABLE users ADD COLUMN boosters TEXT NOT NULL DEFAULT '{}'");
  }
  if (!names.has("inbox")) {
    await dbRun("ALTER TABLE users ADD COLUMN inbox TEXT NOT NULL DEFAULT '[]'");
  }
  if (!names.has("inventory")) {
    await dbRun("ALTER TABLE users ADD COLUMN inventory TEXT NOT NULL DEFAULT '[]'");
  }
  if (!names.has("activeBuffs")) {
    await dbRun("ALTER TABLE users ADD COLUMN activeBuffs TEXT NOT NULL DEFAULT '[]'");
  }
}

async function upsertUser(user) {
  await dbRun(USER_UPSERT_SQL, userToRow(user));
}

async function migrateUsersFromJsonIfNeeded() {
  try {
    if (!fs.existsSync(USERS_FILE)) return;
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    if (!raw) return;
    const data = JSON.parse(raw);
    const jsonUsers = data && typeof data === "object"
      ? (data.users && typeof data.users === "object" ? data.users : data)
      : null;
    if (!jsonUsers) return;
    const entries = Object.entries(jsonUsers);
    if (!entries.length) return;
    entries.forEach(([username, user]) => {
      users[username] = normalizeUser(user, username);
    });
    await Promise.all(Object.values(users).map((user) => upsertUser(user)));
  } catch (err) {
    console.error("Failed to migrate users.json:", err?.message || err);
  }
}

async function loadUsersFromDisk() {
  await initDb();
  const row = await dbGet("SELECT COUNT(*) as count FROM users");
  if (!row || !row.count) {
    await migrateUsersFromJsonIfNeeded();
  }
  const rows = await dbAll("SELECT * FROM users");
  users = Object.create(null);
  rows.forEach((r) => {
    const user = rowToUser(r);
    if (user) users[user.username] = user;
  });
  ensureOwnerAccount();
  refreshIndex.clear();
  const now = Date.now();
  Object.values(users).forEach((user) => {
    if (user.refreshHash && user.refreshExp > now) {
      refreshIndex.set(user.refreshHash, user.username);
    } else {
      user.refreshHash = "";
      user.refreshExp = 0;
    }
  });
}

let saveQueue = Promise.resolve();
function queueSaveUsers(targets = null) {
  const list = targets
    ? (Array.isArray(targets) ? targets : [targets])
    : Object.values(users);
  saveQueue = saveQueue
    .then(async () => {
      await runDbTransaction(async () => {
        for (const user of list) {
          if (user) await upsertUser(user);
        }
      });
    })
    .catch((err) => console.error("Failed to save users.db:", err?.message || err));
  return saveQueue;
}

function setRefreshToken(user, refreshToken, refreshExp) {
  if (!user) return;
  if (user.refreshHash) refreshIndex.delete(user.refreshHash);
  const hash = hashToken(refreshToken);
  user.refreshHash = hash;
  user.refreshExp = refreshExp;
  refreshIndex.set(hash, user.username);
}

function clearRefreshToken(user) {
  if (!user) return;
  if (user.refreshHash) refreshIndex.delete(user.refreshHash);
  user.refreshHash = "";
  user.refreshExp = 0;
}

function issueTokens(user) {
  const accessToken = randomToken();
  const refreshToken = randomToken();
  const accessExp = Date.now() + ACCESS_TTL_MS;
  const refreshExp = Date.now() + REFRESH_TTL_MS;
  setRefreshToken(user, refreshToken, refreshExp);
  return { accessToken, refreshToken, accessExp, refreshExp };
}

function setSession(socket, username, accessToken = "", accessExp = 0) {
  clearSession(socket);
  if (!username) return;
  socketSessions.set(socket.id, username);
  sockets[username] = socket;
  if (accessToken) {
    socket.data.accessToken = accessToken;
    socket.data.accessExp = accessExp;
    accessSessions.set(accessToken, { username, exp: accessExp, socketId: socket.id });
  }
}

function clearSession(socket) {
  if (!socket) return;
  const token = socket.data?.accessToken;
  if (token) accessSessions.delete(token);
  socket.data.accessToken = null;
  socket.data.accessExp = 0;
  const username = socketSessions.get(socket.id);
  socketSessions.delete(socket.id);
  if (username && sockets[username] === socket) delete sockets[username];
}

function getAccessSession(socket) {
  const token = socket?.data?.accessToken;
  if (!token) return null;
  const session = accessSessions.get(token);
  if (!session) return null;
  if (session.socketId !== socket.id) return null;
  if (session.exp && Date.now() > session.exp) {
    accessSessions.delete(token);
    return null;
  }
  return session;
}

function getSessionUser(socket, opts = {}) {
  const session = getAccessSession(socket);
  if (!session) return null;
  const realUser = users[session.username] || null;
  if (opts.real) return realUser;
  const target = socket?.data?.impersonate;
  if (target && realUser && realUser.isAdmin) {
    const impersonated = users[target];
    if (impersonated && !impersonated.deleted) return impersonated;
  }
  return realUser;
}

function getRealUser(socket) {
  return getSessionUser(socket, { real: true });
}

function requireUser(socket) {
  const user = getSessionUser(socket);
  if (settings.maintenanceMode && user && !user.isAdmin) {
    socket.emit("auth_required", { reason: "He thong dang bao tri." });
    return null;
  }
  if (user && user.deleted) {
    socket.emit("auth_required", { reason: "Tai khoan da bi xoa." });
    return null;
  }
  if (!user) {
    socket.emit("auth_required", { reason: "Vui lòng đăng nhập." });
    return null;
  }
  if (user.locked) {
    socket.emit("auth_required", { reason: "Tài khoản đã bị khóa." });
    return null;
  }
  return user;
}

function getAdminRole(user) {
  if (!user) return "";
  if (user.adminRole) return user.adminRole;
  if (user.isAdmin) return user.username === ADMIN_OWNER_USER ? "super_admin" : "moderator";
  return "";
}

function isSuperAdmin(user) {
  return getAdminRole(user) === "super_admin";
}

function isModerator(user) {
  const role = getAdminRole(user);
  return role === "super_admin" || role === "moderator";
}

function requiresOwnerCode(action) {
  return [
    "RESET_PASSWORD",
    "DELETE_USER",
    "SET_PRICE",
    "ADJUST_PRICE",
    "CRASH",
    "PUMP_BTC",
    "FREEZE",
    "CALM",
    "VOL"
  ].includes(action);
}

function getOwnerCodeFromPayload(payload) {
  return String(payload?.confirmCode || payload?.ownerCode || "");
}

function adminLogDetails(action, payload) {
  if (!payload || typeof payload !== "object") return {};
  const details = {};
  if (payload.target || payload.username) {
    details.target = sanitizeUsername(payload.target || payload.username || "");
  }
  if (payload.symbol) details.symbol = payload.symbol;
  if (payload.amount != null) details.amount = payload.amount;
  if (payload.currency) details.currency = payload.currency;
  if (payload.quote) details.quote = payload.quote;
  if (payload.price != null) details.price = payload.price;
  if (payload.percent != null) details.percent = payload.percent;
  if (payload.orderId) details.orderId = payload.orderId;
  if (payload.group) details.group = payload.group;
  if (payload.feeRate != null) details.feeRate = payload.feeRate;
  return details;
}

function logAdminAction(socket, user, action, payload, ok = true, reason = "") {
  const entry = {
    ts: new Date().toISOString(),
    user: user?.username || "unknown",
    role: getAdminRole(user),
    ip: getSocketIp(socket),
    ua: getUserAgent(socket),
    origin: socket?.handshake?.headers?.origin || "",
    socketId: socket?.id || "",
    action,
    ok,
    reason,
    details: adminLogDetails(action, payload)
  };
  fs.promises
    .appendFile(ADMIN_LOG_FILE, `${JSON.stringify(entry)}\n`, "utf8")
    .catch((err) => console.error("Failed to write admin log:", err?.message || err));
}

function emitSecurityAlert(type, message, meta = {}) {
  const payload = {
    ts: new Date().toISOString(),
    type,
    message,
    meta
  };
  fs.promises
    .appendFile(SECURITY_LOG_FILE, `${JSON.stringify(payload)}\n`, "utf8")
    .catch((err) => console.error("Failed to write security log:", err?.message || err));
  Object.entries(sockets).forEach(([username, sock]) => {
    const u = users[username];
    if (u && u.isAdmin && sock) {
      sock.emit("security_alert", payload);
    }
  });
  dispatchExternalAlert(payload);
}

function dispatchExternalAlert(payload) {
  if (!payload) return;
  if (!settings || !settings.alertWebhook) return;
  const message = `[${payload.type}] ${payload.message}`;
  const meta = payload.meta ? `\n${JSON.stringify(payload.meta)}` : "";
  const body = {
    content: `${message}${meta}`
  };
  fetch(settings.alertWebhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  }).catch((err) => console.error("Alert webhook failed:", err?.message || err));
}

function logUserEdit(admin, target, action, changes, socket) {
  const entry = {
    ts: new Date().toISOString(),
    admin: admin?.username || "unknown",
    role: getAdminRole(admin),
    target,
    action,
    ip: getSocketIp(socket),
    ua: getUserAgent(socket),
    changes: changes || {}
  };
  fs.promises
    .appendFile(USER_EDIT_LOG_FILE, `${JSON.stringify(entry)}\n`, "utf8")
    .catch((err) => console.error("Failed to write user edit log:", err?.message || err));
}

function calcSpotPnl(user) {
  let pnl = 0;
  const holdings = user?.holdings || {};
  const costBasis = user?.costBasis || {};
  Object.keys(holdings).forEach((symbol) => {
    const qty = Number(holdings[symbol]) || 0;
    if (qty <= 0) return;
    const cost = Number(costBasis[symbol]) || 0;
    if (cost <= 0) return;
    const price = market[symbol]?.price;
    if (!Number.isFinite(price)) return;
    pnl += (price - cost) * qty;
  });
  return pnl;
}

function calcPositionsPnl(user) {
  let pnl = 0;
  const positions = Array.isArray(user?.positions) ? user.positions : [];
  positions.forEach((pos) => {
    const price = market[pos.symbol]?.price;
    if (!Number.isFinite(price)) return;
    pnl += calcPnl(pos, price);
  });
  return pnl;
}

function getUserLimits(user) {
  const limits = user?.limits && typeof user.limits === "object" ? user.limits : {};
  let maxLeverage = Number.isFinite(limits.maxLeverage) ? limits.maxLeverage : DEFAULT_MAX_LEVERAGE;
  if (hasActiveBuff(user, "x2_leverage")) {
    maxLeverage = Math.min(maxLeverage * 2, MAX_LEVERAGE_CAP);
  }
  return {
    maxOpenOrders: Number.isFinite(limits.maxOpenOrders) ? limits.maxOpenOrders : MAX_OPEN_ORDERS,
    maxPositions: Number.isFinite(limits.maxPositions) ? limits.maxPositions : MAX_POSITIONS,
    maxNotionalUsd: Number.isFinite(limits.maxNotionalUsd) ? limits.maxNotionalUsd : MAX_NOTIONAL_USD,
    maxLeverage,
    feeRate: Number.isFinite(limits.feeRate) ? limits.feeRate : BASE_FEE_RATE,
    cancelPenaltyRate: Number.isFinite(limits.cancelPenaltyRate)
      ? limits.cancelPenaltyRate
      : (Number.isFinite(settings.cancelPenaltyRate) ? settings.cancelPenaltyRate : 0),
    cancelSpamThreshold: Number.isFinite(limits.cancelSpamThreshold)
      ? limits.cancelSpamThreshold
      : CANCEL_SPAM_THRESHOLD,
    cancelSpamWindowMs: Number.isFinite(limits.cancelSpamWindowMs)
      ? limits.cancelSpamWindowMs
      : CANCEL_SPAM_WINDOW_MS
  };
}

function getFeeRateForUser(user) {
  if (!user) return BASE_FEE_RATE;
  const limits = getUserLimits(user);
  if (Number.isFinite(limits.feeRate)) return limits.feeRate;
  const groupFee = settings?.groupFees?.[user.group || ""];
  if (Number.isFinite(groupFee)) return groupFee;
  return BASE_FEE_RATE;
}

function recordOrderSpam(username, reason) {
  if (!username) return;
  const stat = orderSpamStats.get(username) || { count: 0, last: 0, reasons: {} };
  stat.count += 1;
  stat.last = Date.now();
  stat.reasons[reason] = (stat.reasons[reason] || 0) + 1;
  orderSpamStats.set(username, stat);
  bumpSpamHeatmap();
}

function recordCancelSpam(username) {
  if (!username) return null;
  const now = Date.now();
  const stat = cancelSpamStats.get(username) || { count: 0, reset: now + CANCEL_SPAM_WINDOW_MS };
  if (now > stat.reset) {
    stat.count = 0;
    stat.reset = now + CANCEL_SPAM_WINDOW_MS;
  }
  stat.count += 1;
  cancelSpamStats.set(username, stat);
  bumpSpamHeatmap();
  return stat;
}

function addStrike(user, reason, socket) {
  if (!user) return;
  user.strikes = Number(user.strikes || 0) + 1;
  const limit = Number.isFinite(settings.strikeLimit) ? settings.strikeLimit : STRIKE_LIMIT_DEFAULT;
  if (user.strikes >= limit) {
    user.locked = true;
    const targetSocket = sockets[user.username];
    if (targetSocket) {
      targetSocket.emit("auth_required", { reason: "Tai khoan bi khoa do vi pham." });
      clearSession(targetSocket);
    }
    emitSecurityAlert("strike_lock", "Tai khoan bi khoa do strike.", {
      username: user.username,
      strikes: user.strikes,
      reason
    });
  } else {
    emitSecurityAlert("strike", "Ghi nhan strike.", {
      username: user.username,
      strikes: user.strikes,
      reason
    });
  }
  queueSaveUsers(user);
}

function securityBurst(key, windowMs, threshold) {
  const now = Date.now();
  const record = securityCounters.get(key) || { count: 0, reset: now + windowMs, alerted: false };
  if (now > record.reset) {
    record.count = 0;
    record.reset = now + windowMs;
    record.alerted = false;
  }
  record.count += 1;
  if (record.count >= threshold && !record.alerted) {
    record.alerted = true;
    securityCounters.set(key, record);
    return true;
  }
  securityCounters.set(key, record);
  return false;
}

function computeAdminKpi() {
  const now = Date.now();
  const since = now - 24 * 60 * 60 * 1000;
  let openOrders = 0;
  let volume24h = 0;
  let unrealizedPnl = 0;
  let openPositions = 0;
  Object.values(users).forEach((user) => {
    if (!user || user.deleted) return;
    openOrders += Array.isArray(user.openOrders) ? user.openOrders.length : 0;
    openPositions += Array.isArray(user.positions) ? user.positions.length : 0;
    if (Array.isArray(user.trades)) {
      user.trades.forEach((trade) => {
        if (!trade) return;
        const ts = trade.ts ? new Date(trade.ts).getTime() : 0;
        if (ts && ts >= since) {
          const price = Number(trade.price);
          const qty = Number(trade.qty);
          if (Number.isFinite(price) && Number.isFinite(qty)) {
            volume24h += price * qty;
          }
        }
      });
    }
    unrealizedPnl += calcSpotPnl(user);
    unrealizedPnl += calcPositionsPnl(user);
  });
  const onlineUsers = Object.keys(sockets).length;
  return {
    onlineUsers,
    openOrders,
    openPositions,
    volume24h,
    unrealizedPnl
  };
}

function computeOpenInterest() {
  const out = {};
  Object.values(users).forEach((user) => {
    if (!user || user.deleted) return;
    (user.positions || []).forEach((pos) => {
      const price = market[pos.symbol]?.price;
      if (!Number.isFinite(price)) return;
      const notional = price * pos.qty;
      out[pos.symbol] = (out[pos.symbol] || 0) + notional;
    });
  });
  return out;
}

async function getUserTrades(username, limit = 100, offset = 0) {
  const lim = Math.min(Math.max(Number(limit) || 100, 1), 500);
  const off = Math.max(Number(offset) || 0, 0);
  return dbAll(
    "SELECT username, symbol, side, price, qty, ts, pnlUsd, leverage, quote FROM trades WHERE username = ? ORDER BY ts DESC LIMIT ? OFFSET ?",
    [username, lim, off]
  );
}

async function getDailyPnl(limit = 30) {
  const lim = Math.min(Math.max(Number(limit) || 30, 1), 120);
  return dbAll(
    "SELECT date(ts/1000, 'unixepoch') as day, SUM(pnlUsd) as pnlUsd FROM trades GROUP BY day ORDER BY day DESC LIMIT ?",
    [lim]
  );
}

async function getTopUsersPnl(limit = 10) {
  const lim = Math.min(Math.max(Number(limit) || 10, 1), 50);
  return dbAll(
    "SELECT username, SUM(pnlUsd) as pnlUsd FROM trades GROUP BY username ORDER BY pnlUsd DESC LIMIT ?",
    [lim]
  );
}

async function getTopCoinVolume(limit = 10) {
  const lim = Math.min(Math.max(Number(limit) || 10, 1), 50);
  return dbAll(
    "SELECT symbol, SUM(ABS(price * qty)) as volumeUsd FROM trades GROUP BY symbol ORDER BY volumeUsd DESC LIMIT ?",
    [lim]
  );
}

function tradesToCsv(rows) {
  const header = ["username", "symbol", "side", "price", "qty", "ts", "pnlUsd", "leverage", "quote"];
  const lines = rows.map((r) => ([
    r.username,
    r.symbol,
    r.side,
    r.price,
    r.qty,
    r.ts,
    r.pnlUsd,
    r.leverage,
    r.quote
  ]).map((v) => `"${String(v ?? "").replace(/"/g, "\"\"")}"`).join(","));
  return [header.join(","), ...lines].join("\n");
}

function toQuote(usdValue, quote) {
  return quote === "USD" ? usdValue : usdValue * FX_RATE;
}

function addBalance(user, quote, amount) {
  if (quote === "USD") user.usd += amount;
  else user.vnd += amount;
}

function calcUserEquityUsd(user) {
  if (!user) return 0;
  let total = 0;
  total += Number(user.usd) || 0;
  total += (Number(user.vnd) || 0) / FX_RATE;
  if (user.holdings && typeof user.holdings === "object") {
    Object.entries(user.holdings).forEach(([sym, qty]) => {
      const amount = Number(qty) || 0;
      if (amount <= 0) return;
      const price = market[sym]?.price || 0;
      total += amount * price;
    });
  }
  if (Array.isArray(user.positions)) {
    user.positions.forEach((pos) => {
      const price = market[pos.symbol]?.price || pos.entry || 0;
      const pnl = calcPnl(pos, price);
      total += (Number(pos.marginUsd) || 0) + (Number.isFinite(pnl) ? pnl : 0);
    });
  }
  return total;
}

function ensureUser(username, password = "") {
  if (users[username]) {
    users[username] = normalizeUser(users[username], username);
    return users[username];
  }
  const user = createUser(username, password);
  users[username] = user;
  queueSaveUsers(user);
  return user;
}

function syncUserCoins(user) {
  if (!user) return;
  coins.forEach((coin) => {
    if (user.holdings[coin.symbol] == null) user.holdings[coin.symbol] = 0;
    if (user.costBasis[coin.symbol] == null) user.costBasis[coin.symbol] = 0;
    if (user.holdingStart[coin.symbol] == null) user.holdingStart[coin.symbol] = null;
  });
}

function recordTrade(user, { symbol, side, price, qty, pnlUsd = 0, leverage = 1, quote = "USD" }) {
  if (!user) return;
  const ts = Date.now();
  const entry = {
    symbol,
    side,
    price,
    qty,
    pnlUsd,
    leverage,
    quote,
    ts: new Date(ts)
  };
  user.trades.unshift(entry);
  if (user.trades.length > 50) user.trades.length = 50;
  dbRun(
    "INSERT INTO trades (username, symbol, side, price, qty, ts, pnlUsd, leverage, quote) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [user.username, symbol, side, price, qty, ts, pnlUsd, leverage, quote]
  ).catch((err) => console.error("Failed to insert trade:", err?.message || err));
}

function emitAccount(socket, user) {
  if (!socket || !user) return;
  socket.emit("update_wallet", { usd: user.usd, vnd: user.vnd });
  socket.emit("sync_account", {
    holdings: user.holdings,
    costBasis: user.costBasis,
    holdingStart: user.holdingStart,
    positions: user.positions,
    openOrders: user.openOrders,
    protections: user.protections,
    trades: user.trades,
    boosters: user.boosters,
    inbox: user.inbox,
    inventory: user.inventory,
    activeBuffs: user.activeBuffs
  });
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 120)}`);
  }
  return res.json();
}

async function loadTopCoins() {
  const perPage = 250;
  const pages = [1, 2];
  let rows = [];
  for (const page of pages) {
    const url = `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`;
    const data = await fetchJson(url);
    if (Array.isArray(data)) rows = rows.concat(data);
  }

  const seen = new Set();
  const list = [];
  rows.forEach((item) => {
    if (!item || !item.symbol) return;
    const symbol = normalizeSymbol(item.symbol);
    if (seen.has(symbol)) return;
    const price = Number.isFinite(item.current_price) ? item.current_price : item.price || 0;
    const changePct = Number.isFinite(item.price_change_percentage_24h)
      ? item.price_change_percentage_24h
      : item.price_change_percentage_24h_in_currency;
    list.push({
      symbol,
      name: item.name || symbol,
      cgId: item.id,
      icon: item.image || null,
      base: price > 0 ? price : 1,
      vol: guessVol(changePct),
      changePct: Number.isFinite(changePct) ? changePct : 0,
      high24: Number.isFinite(item.high_24h) ? item.high_24h : price,
      low24: Number.isFinite(item.low_24h) ? item.low_24h : price,
      volume24: Number.isFinite(item.total_volume) ? item.total_volume : 0
    });
    seen.add(symbol);
  });

  return list.slice(0, 300);
}

async function loadBinanceSymbols() {
  const data = await fetchJson(`${BINANCE_BASE}/api/v3/exchangeInfo`);
  const set = new Set();
  if (data && Array.isArray(data.symbols)) {
    data.symbols.forEach((s) => {
      if (s.status !== "TRADING") return;
      if (s.quoteAsset !== "USDT") return;
      set.add(s.baseAsset);
    });
  }
  return set;
}

async function refreshBinancePrices() {
  if (godMode.freeze || settings.marketFreeze) return;
  const data = await fetchJson(`${BINANCE_BASE}/api/v3/ticker/price`);
  if (!Array.isArray(data)) return;
  const priceMap = {};
  data.forEach((row) => {
    if (!row || !row.symbol) return;
    priceMap[row.symbol] = parseFloat(row.price);
  });
  const now = Date.now();
  coins.forEach((coin) => {
    if (!coin.binanceSymbol) return;
    const sourceOverride = settings.coinSource?.[coin.symbol];
    if (sourceOverride && sourceOverride !== "binance") return;
    const lock = settings.coinLock?.[coin.symbol];
    if (lock && lock.until && now < lock.until) return;
    const price = priceMap[coin.binanceSymbol];
    if (!Number.isFinite(price) || price <= 0) return;
    const meta = marketMeta[coin.symbol] || {};
    if (meta.overrideUntil && now < meta.overrideUntil) return;
    const m = market[coin.symbol];
    if (!m) return;
    m.prev = m.price;
    m.price = price;
    m.high = Math.max(m.high, price);
    m.low = Math.min(m.low, price);
    const delta = m.prev > 0 ? (m.price - m.prev) / m.prev : 0;
    const breakerPct = Number(settings.coinCircuit?.[coin.symbol]) || Number(settings.circuitBreakerPct) || 0;
    if (breakerPct > 0 && Math.abs(delta * 100) > breakerPct) {
      meta.haltUntil = now + (Number(settings.circuitBreakerWindowMs) || CIRCUIT_BREAK_WINDOW_MS);
      marketMeta[coin.symbol] = { ...meta };
      emitSecurityAlert("price_spike", "Gia bien dong bat thuong.", {
        symbol: coin.symbol,
        deltaPct: delta * 100,
        haltUntil: meta.haltUntil
      });
    }
    marketMeta[coin.symbol] = { ...meta, lastLive: now, source: "binance" };
  });
}

async function refreshBinanceStats() {
  if (godMode.freeze || settings.marketFreeze) return;
  const data = await fetchJson(`${BINANCE_BASE}/api/v3/ticker/24hr`);
  if (!Array.isArray(data)) return;
  const statMap = {};
  data.forEach((row) => {
    if (!row || !row.symbol) return;
    statMap[row.symbol] = row;
  });
  const now = Date.now();
  coins.forEach((coin) => {
    if (!coin.binanceSymbol) return;
    const sourceOverride = settings.coinSource?.[coin.symbol];
    if (sourceOverride && sourceOverride !== "binance") return;
    const lock = settings.coinLock?.[coin.symbol];
    if (lock && lock.until && now < lock.until) return;
    const stats = statMap[coin.binanceSymbol];
    if (!stats) return;
    const meta = marketMeta[coin.symbol] || {};
    if (meta.overrideUntil && now < meta.overrideUntil) return;
    const m = market[coin.symbol];
    if (!m) return;
    const open = parseFloat(stats.openPrice);
    const high = parseFloat(stats.highPrice);
    const low = parseFloat(stats.lowPrice);
    const vol = parseFloat(stats.quoteVolume);
    if (Number.isFinite(open) && open > 0) m.open = open;
    if (Number.isFinite(high) && high > 0) m.high = Math.max(m.high, high);
    if (Number.isFinite(low) && low > 0) m.low = Math.min(m.low, low);
    if (Number.isFinite(vol)) m.vol = vol;
    marketMeta[coin.symbol] = { ...meta, lastLive: now, source: "binance" };
  });
}

async function refreshCoingeckoMarkets() {
  if (godMode.freeze || settings.marketFreeze) return;
  const list = await loadTopCoins();
  const lookup = {};
  list.forEach((coin) => {
    lookup[coin.symbol] = coin;
  });
  const now = Date.now();
  coins.forEach((coin) => {
    if (coin.binanceSymbol) return;
    const sourceOverride = settings.coinSource?.[coin.symbol];
    if (sourceOverride && sourceOverride !== "coingecko") return;
    const lock = settings.coinLock?.[coin.symbol];
    if (lock && lock.until && now < lock.until) return;
    const data = lookup[coin.symbol];
    if (!data) return;
    const meta = marketMeta[coin.symbol] || {};
    if (meta.overrideUntil && now < meta.overrideUntil) return;
    const m = market[coin.symbol];
    if (!m) return;
    if (Number.isFinite(data.base)) {
      m.prev = m.price;
      m.price = data.base;
    }
    if (Number.isFinite(data.high24)) m.high = Math.max(m.high, data.high24);
    if (Number.isFinite(data.low24)) m.low = Math.min(m.low, data.low24);
    if (Number.isFinite(data.volume24)) m.vol = data.volume24;
    if (Number.isFinite(data.changePct)) {
      const base = data.base / (1 + data.changePct / 100);
      if (Number.isFinite(base) && base > 0) m.open = base;
    }
    marketMeta[coin.symbol] = { ...meta, lastLive: now, source: "coingecko" };
  });
}

function initMarket() {
  coins.forEach((coin) => {
    const seed = coin.base * (0.9 + Math.random() * 0.2);
    market[coin.symbol] = {
      price: seed,
      prev: seed,
      open: seed,
      high: seed,
      low: seed,
      vol: Math.random() * 5000
    };
    marketTrends[coin.symbol] = 0;
    marketMeta[coin.symbol] = marketMeta[coin.symbol] || {
      lastLive: 0,
      source: coin.binanceSymbol ? "binance" : coin.cgId ? "coingecko" : "sim",
      overrideUntil: 0
    };
    candleHistory[coin.symbol] = [];
    let lastClose = seed;
    const now = Math.floor(Date.now() / 1000);
    for (let i = CANDLE_INIT; i > 0; i -= 1) {
      const time = now - i * CANDLE_INTERVAL_SEC;
      const open = lastClose;
      const close = open * (1 + (Math.random() - 0.5) * 0.01);
      const high = Math.max(open, close) * (1 + Math.random() * 0.005);
      const low = Math.min(open, close) * (1 - Math.random() * 0.005);
      candleHistory[coin.symbol].push({ time, open, high, low, close });
      lastClose = close;
    }
    const bucket = now - (now % CANDLE_INTERVAL_SEC);
    currentCandles[coin.symbol] = {
      time: bucket,
      open: lastClose,
      high: lastClose,
      low: lastClose,
      close: lastClose
    };
  });
}

function addCustomCoin(coin) {
  const symbol = normalizeSymbol(coin.symbol);
  if (!symbol) return false;
  if (coins.find((c) => c.symbol === symbol)) return false;
  const entry = {
    symbol,
    name: coin.name || symbol,
    base: Number.isFinite(coin.base) ? coin.base : 1,
    vol: Number.isFinite(coin.vol) ? coin.vol : 0.003
  };
  coins.push(entry);
  settings.customCoins = settings.customCoins || [];
  settings.customCoins.push(entry);
  saveSettings();
  market[symbol] = {
    price: entry.base,
    prev: entry.base,
    open: entry.base,
    high: entry.base,
    low: entry.base,
    vol: Math.random() * 1000
  };
  marketTrends[symbol] = 0;
  marketMeta[symbol] = marketMeta[symbol] || {
    lastLive: 0,
    source: "sim",
    overrideUntil: 0
  };
  candleHistory[symbol] = [];
  currentCandles[symbol] = {
    time: Math.floor(Date.now() / 1000),
    open: entry.base,
    high: entry.base,
    low: entry.base,
    close: entry.base
  };
  return true;
}

function removeCoin(symbol) {
  const sym = normalizeSymbol(symbol);
  if (!sym) return false;
  const idx = coins.findIndex((c) => c.symbol === sym);
  if (idx === -1) return false;
  coins.splice(idx, 1);
  delete market[sym];
  delete marketTrends[sym];
  delete marketMeta[sym];
  delete candleHistory[sym];
  delete currentCandles[sym];
  settings.removedCoins = settings.removedCoins || [];
  if (!settings.removedCoins.includes(sym)) settings.removedCoins.push(sym);
  saveSettings();
  return true;
}

function updateMarketLogic(coin) {
  const m = market[coin.symbol];
  if (!m) return;
  const meta = marketMeta[coin.symbol] || {};
  const now = Date.now();
  const freezeCoin = settings.coinFreeze?.[coin.symbol];
  const lock = settings.coinLock?.[coin.symbol];
  if (lock && lock.until && now >= lock.until) {
    delete settings.coinLock[coin.symbol];
    saveSettings();
  }
  if (lock && lock.until && now < lock.until && Number.isFinite(lock.price)) {
    m.prev = m.price;
    m.price = lock.price;
    m.high = Math.max(m.high, m.price);
    m.low = Math.min(m.low, m.price);
    return;
  }
  if (meta.haltUntil && now < meta.haltUntil) {
    m.prev = m.price;
    m.high = Math.max(m.high, m.price);
    m.low = Math.min(m.low, m.price);
    return;
  }
  const overrideActive = meta.overrideUntil && now < meta.overrideUntil;
  const liveFresh = meta.lastLive && now - meta.lastLive < LIVE_STALE_MS;

  if (settings.marketFreeze || freezeCoin || godMode.freeze || overrideActive || liveFresh) {
    m.prev = m.price;
    const bias = marketTrends[coin.symbol] || 0;
    if (!godMode.freeze && bias) {
      m.price = Math.max(0.0000001, m.price * (1 + bias * 0.01));
      marketTrends[coin.symbol] = bias * 0.9;
    }
    m.high = Math.max(m.high, m.price);
    m.low = Math.min(m.low, m.price);
    return;
  }

  const baseVol = Number.isFinite(coin.vol) ? coin.vol : 0.003;
  const coinScale = Number(settings.coinVolScale?.[coin.symbol]) || 1;
  const volatility = Math.max(0.0005, Math.min(0.01, baseVol * 1.5)) * godMode.volScale * coinScale;
  const change = 1 + (Math.random() * volatility * 2 - volatility);
  const minPrice = 0.0000001;
  const newPrice = Math.max(minPrice, m.price * change);

  m.prev = m.price;
  m.price = newPrice;
  m.high = Math.max(m.high, newPrice);
  m.low = Math.min(m.low, newPrice);
  m.vol += Math.random() * 120;

  const delta = m.prev > 0 ? (m.price - m.prev) / m.prev : 0;
  marketTrends[coin.symbol] = (marketTrends[coin.symbol] || 0) * 0.9 + delta * 10;
  const breakerPct = Number(settings.coinCircuit?.[coin.symbol]) || Number(settings.circuitBreakerPct) || 0;
  if (breakerPct > 0 && Math.abs(delta * 100) > breakerPct) {
    meta.haltUntil = now + (Number(settings.circuitBreakerWindowMs) || CIRCUIT_BREAK_WINDOW_MS);
    marketMeta[coin.symbol] = meta;
    emitSecurityAlert("price_spike", "Gia bien dong bat thuong.", {
      symbol: coin.symbol,
      deltaPct: delta * 100,
      haltUntil: meta.haltUntil
    });
  }
}

function buildMarketPayload() {
  const out = {};
  coins.forEach((coin) => {
    if (!isCoinVisible(coin.symbol)) return;
    out[coin.symbol] = {
      ...market[coin.symbol],
      candle: currentCandles[coin.symbol] || null
    };
  });
  return out;
}

function ensureCurrentCandleBucket(symbol, seedPrice) {
  const now = Math.floor(Date.now() / 1000);
  const bucket = now - (now % CANDLE_INTERVAL_SEC);
  let candle = currentCandles[symbol];
  if (!candle || candle.time !== bucket) {
    if (candle) {
      const history = candleHistory[symbol] || [];
      history.push(candle);
      if (history.length > CANDLE_LIMIT) history.shift();
      candleHistory[symbol] = history;
    }
    const open = Number.isFinite(seedPrice) && seedPrice > 0 ? seedPrice : market[symbol]?.price || 1;
    candle = { time: bucket, open, high: open, low: open, close: open };
    currentCandles[symbol] = candle;
  }
  return candle;
}

function applyCandleBiasToSymbol(symbol, direction, strengthPct, wickPct, durationMs) {
  const m = market[symbol];
  if (!m) return false;
  const basePrice = Number.isFinite(m.price) && m.price > 0 ? m.price : 1;
  const candle = ensureCurrentCandleBucket(symbol, basePrice);
  if (!candle) return false;

  const open = Number.isFinite(candle.open) && candle.open > 0 ? candle.open : basePrice;
  const bodyPct = Math.max(0.02, Math.min(25, Number(strengthPct) || 0.8));
  const wick = Math.max(0, Math.min(10, Number(wickPct) || 0.4));

  let close = open;
  if (direction === "up") close = open * (1 + bodyPct / 100);
  else if (direction === "down") close = open * (1 - bodyPct / 100);
  else close = open * (1 + (Math.random() - 0.5) * 0.002);

  close = Math.max(0.0000001, close);
  const bodyHigh = Math.max(open, close);
  const bodyLow = Math.min(open, close);
  const high = bodyHigh * (1 + wick / 100);
  const low = Math.max(0.0000001, bodyLow * (1 - wick / 100));

  candle.open = open;
  candle.close = close;
  candle.high = Math.max(high, bodyHigh);
  candle.low = Math.min(low, bodyLow);
  currentCandles[symbol] = candle;

  m.prev = m.price;
  m.price = close;
  m.high = Math.max(m.high, candle.high, close);
  m.low = Math.min(m.low, candle.low, close);

  if (direction === "up") marketTrends[symbol] = 2.4;
  else if (direction === "down") marketTrends[symbol] = -2.4;
  else marketTrends[symbol] = 0;

  marketMeta[symbol] = marketMeta[symbol] || { lastLive: 0, source: "admin", overrideUntil: 0 };
  marketMeta[symbol].overrideUntil = Date.now() + Math.max(1000, Math.min(300000, Number(durationMs) || 30000));
  marketMeta[symbol].source = "admin";
  return true;
}

function emitMarketUpdateNow() {
  const payload = buildMarketPayload();
  io.emit("market_update", payload);
  return payload;
}

function calcPnl(pos, price) {
  if (pos.side === "buy") return (price - pos.entry) * pos.qty * pos.leverage;
  return (pos.entry - price) * pos.qty * pos.leverage;
}

function closePositionInternal(user, symbol, side, leverage, price, qty, quoteOverride, result = null) {
  if (leverage === 1) {
    const quote = quoteOverride || "USD";
    const feeRate = getFeeRateForUser(user);
    const hold = user.holdings[symbol] || 0;
    const sellQty = Math.min(hold, qty);
    if (sellQty <= 0) return false;
    const notionalUsd = price * sellQty;
    const feeUsd = Math.abs(notionalUsd * feeRate);
    const receiveUsd = Math.max(0, notionalUsd - feeUsd);
    addBalance(user, quote, toQuote(receiveUsd, quote));
    const avg = Number(user.costBasis[symbol]) || 0;
    const pnlUsd = (price - avg) * sellQty - feeUsd;
    user.holdings[symbol] = hold - sellQty;
    if (user.holdings[symbol] <= 0) {
      user.costBasis[symbol] = 0;
      user.holdingStart[symbol] = null;
    }
    recordTrade(user, { symbol, side: "sell", price, qty: sellQty, pnlUsd, leverage: 1, quote });
    if (result) {
      result.symbol = symbol;
      result.side = "sell";
      result.leverage = 1;
      result.qty = sellQty;
      result.price = price;
      result.pnlUsd = pnlUsd;
    }
    return true;
  }

  const idx = user.positions.findIndex(
    (p) => p.symbol === symbol && p.side === side && p.leverage === leverage
  );
  if (idx === -1) return false;
  const pos = user.positions[idx];
  const closeQty = Math.min(pos.qty, qty || pos.qty);
  const ratio = closeQty / pos.qty;
  const pnlUsd = calcPnl({ ...pos, qty: closeQty }, price);
  const feeRate = getFeeRateForUser(user);
  const feeUsd = Math.abs(price * closeQty * feeRate);
  const marginUsd = pos.marginUsd * ratio;
  const realizedPnlUsd = pnlUsd - feeUsd;
  const payoutUsd = Math.max(0, marginUsd + realizedPnlUsd);
  addBalance(user, pos.quote, toQuote(payoutUsd, pos.quote));
  recordTrade(user, {
    symbol,
    side: pos.side === "buy" ? "close_buy" : "close_sell",
    price,
    qty: closeQty,
    pnlUsd,
    leverage,
    quote: pos.quote
  });
  if (result) {
    result.symbol = symbol;
    result.side = pos.side;
    result.leverage = leverage;
    result.qty = closeQty;
    result.price = price;
    result.pnlUsd = realizedPnlUsd;
  }

  pos.qty -= closeQty;
  pos.marginUsd -= marginUsd;
  if (pos.qty <= 0) user.positions.splice(idx, 1);
  return true;
}

function applyProtections(user, priceMap) {
  let changed = false;
  const remaining = [];
  user.protections.forEach((prot) => {
    const price = priceMap[prot.symbol];
    if (!price) {
      remaining.push(prot);
      return;
    }
    let trigger = false;
    if (prot.stop) {
      if (prot.side === "buy" && price <= prot.stop) trigger = true;
      if (prot.side === "sell" && price >= prot.stop) trigger = true;
    }
    if (!trigger && prot.take) {
      if (prot.side === "buy" && price >= prot.take) trigger = true;
      if (prot.side === "sell" && price <= prot.take) trigger = true;
    }
    if (!trigger && prot.trailPct) {
      if (prot.side === "buy") {
        prot.trailHigh = Math.max(prot.trailHigh || price, price);
        if (price <= prot.trailHigh * (1 - prot.trailPct / 100)) trigger = true;
      } else {
        prot.trailLow = Math.min(prot.trailLow || price, price);
        if (price >= prot.trailLow * (1 + prot.trailPct / 100)) trigger = true;
      }
    }

    if (trigger) {
      closePositionInternal(user, prot.symbol, prot.side, prot.leverage, price, prot.qty, prot.quote);
      changed = true;
      return;
    }
    remaining.push(prot);
  });
  if (changed) user.protections = remaining;
  return changed;
}

function processLimitOrders(user, priceMap, socket) {
  let changed = false;
  const remaining = [];
  const feeRate = getFeeRateForUser(user);

  user.openOrders.forEach((order) => {
    const price = priceMap[order.symbol];
    if (!price) {
      remaining.push(order);
      return;
    }
    const limit = Number.isFinite(order.priceUsd) ? order.priceUsd : order.price;
    if (!Number.isFinite(limit)) {
      remaining.push(order);
      return;
    }
    const shouldFill =
      (order.side === "buy" && limit >= price) ||
      (order.side === "sell" && limit <= price);

    if (!shouldFill) {
      remaining.push(order);
      return;
    }

    const notionalUsd = price * order.qty;
    const notionalQuote = toQuote(notionalUsd, order.quote);
    const totalQuote = order.leverage === 1 ? notionalQuote : notionalQuote / order.leverage;
    const feeQuote = totalQuote * feeRate;

    if (order.side === "buy") {
      if (order.leverage === 1) {
        user.holdings[order.symbol] = (user.holdings[order.symbol] || 0) + order.qty;
        const oldQty = user.holdings[order.symbol] - order.qty;
        const oldAvg = user.costBasis[order.symbol] || 0;
        const newAvg = ((oldQty * oldAvg) + order.qty * price) / (oldQty + order.qty);
        user.costBasis[order.symbol] = newAvg;
        if (!user.holdingStart[order.symbol]) user.holdingStart[order.symbol] = Date.now();
      } else {
        if (user.positions.length >= MAX_POSITIONS) {
          if (order.locked) addBalance(user, order.quote, order.locked);
          if (socket) {
            socket.emit("order_rejected", {
              clientId: order.clientId,
              reason: "Vuot qua so vi the."
            });
          }
          changed = true;
          return;
        }
        user.positions.push({
          id: Date.now() + Math.random(),
          userId: order.userId,
          symbol: order.symbol,
          side: "buy",
          qty: order.qty,
          entry: price,
          leverage: order.leverage,
          marginUsd: notionalUsd / order.leverage,
          quote: order.quote
        });
      }
      recordTrade(user, { symbol: order.symbol, side: "buy", price, qty: order.qty, pnlUsd: 0, leverage: order.leverage, quote: order.quote });
      const refund = order.locked - (totalQuote + feeQuote);
      if (refund > 0) addBalance(user, order.quote, refund);
    } else {
      if (order.leverage === 1) {
        const receive = totalQuote - feeQuote;
        addBalance(user, order.quote, receive);
        if (user.holdings[order.symbol] <= 0) {
          user.costBasis[order.symbol] = 0;
          user.holdingStart[order.symbol] = null;
        }
      } else {
        if (user.positions.length >= MAX_POSITIONS) {
          if (order.locked) addBalance(user, order.quote, order.locked);
          if (socket) {
            socket.emit("order_rejected", {
              clientId: order.clientId,
              reason: "Vuot qua so vi the."
            });
          }
          changed = true;
          return;
        }
        user.positions.push({
          id: Date.now() + Math.random(),
          userId: order.userId,
          symbol: order.symbol,
          side: "sell",
          qty: order.qty,
          entry: price,
          leverage: order.leverage,
          marginUsd: notionalUsd / order.leverage,
          quote: order.quote
        });
        const refund = order.locked - (totalQuote + feeQuote);
        if (refund > 0) addBalance(user, order.quote, refund);
      }
      const pnlUsd = order.leverage === 1
        ? (price - (user.costBasis[order.symbol] || 0)) * order.qty - Math.abs(price * order.qty * feeRate)
        : 0;
      recordTrade(user, { symbol: order.symbol, side: "sell", price, qty: order.qty, pnlUsd, leverage: order.leverage, quote: order.quote });
    }

    if (order.stopInput || order.takeInput || order.trailPct) {
      user.protections.push({
        id: Date.now() + Math.random(),
        symbol: order.symbol,
        qty: order.qty,
        side: order.side,
        leverage: order.leverage,
        quote: order.quote,
        stop: order.stopInput || null,
        take: order.takeInput || null,
        trailPct: order.trailPct || 0,
        trailHigh: order.side === "buy" ? price : null,
        trailLow: order.side === "sell" ? price : null
      });
    }

    if (socket) {
      socket.emit("order_filled", {
        symbol: order.symbol,
        side: order.side,
        qty: order.qty,
        price
      });
    }
    changed = true;
  });

  if (changed) user.openOrders = remaining;
  return changed;
}

function checkLiquidations(user, priceMap) {
  let changed = false;
  const remaining = [];
  user.positions.forEach((pos) => {
    if (pos.leverage <= 1) {
      remaining.push(pos);
      return;
    }
    const price = priceMap[pos.symbol];
    if (!price) {
      remaining.push(pos);
      return;
    }
    const pnl = calcPnl(pos, price);
    const equity = pos.marginUsd + pnl;
    if (equity <= pos.marginUsd * MAINTENANCE_RATE) {
      const payout = Math.max(0, equity);
      addBalance(user, pos.quote, toQuote(payout, pos.quote));
      const sock = sockets[pos.userId];
      if (sock) sock.emit("liquidation", { symbol: pos.symbol });
      emitSecurityAlert("liquidation", "Bi thanh ly bat thuong.", {
        username: user.username,
        symbol: pos.symbol,
        equity,
        margin: pos.marginUsd
      });
      if (securityBurst("liquidation_burst", 60 * 1000, 5)) {
        emitSecurityAlert("liquidation_burst", "Nhieu lenh bi thanh ly.", {});
      }
      changed = true;
      return;
    }
    remaining.push(pos);
  });
  if (changed) user.positions = remaining;
  return changed;
}

function applyGodModeAction(action, payload = {}) {
  const symbol = payload.symbol || "BTC";
  const now = Date.now();
  switch (action) {
    case "CRASH":
      coins.forEach((c) => {
        marketTrends[c.symbol] = -3.0;
        if (marketMeta[c.symbol]) marketMeta[c.symbol].overrideUntil = now + 30000;
      });
      godMode.freeze = false;
      break;
    case "PUMP_BTC":
      marketTrends[symbol] = 2.5;
      if (marketMeta[symbol]) marketMeta[symbol].overrideUntil = now + 30000;
      godMode.freeze = false;
      break;
    case "FREEZE":
      coins.forEach((c) => { marketTrends[c.symbol] = 0; });
      godMode.freeze = true;
      break;
    case "CALM":
      coins.forEach((c) => { marketTrends[c.symbol] = (Math.random() - 0.5) * 0.1; });
      godMode.freeze = false;
      break;
    case "VOL":
      if (typeof payload.value === "number") {
        godMode.volScale = Math.max(0.2, Math.min(5, payload.value));
      }
      break;
    case "SET_PRICE": {
      const price = Number(payload.price);
      if (!Number.isFinite(price) || price <= 0) break;
      const m = market[symbol];
      if (!m) break;
      m.prev = m.price;
      m.price = price;
      m.high = Math.max(m.high, price);
      m.low = Math.min(m.low, price);
      if (currentCandles[symbol]) {
        currentCandles[symbol].close = price;
        currentCandles[symbol].high = Math.max(currentCandles[symbol].high, price);
        currentCandles[symbol].low = Math.min(currentCandles[symbol].low, price);
      }
      marketMeta[symbol] = marketMeta[symbol] || { lastLive: 0, source: "admin", overrideUntil: 0 };
      marketMeta[symbol].overrideUntil = now + 30000;
      break;
    }
    case "ADJUST_PRICE": {
      const m = market[symbol];
      if (!m) break;
      const percent = Number(payload.percent);
      const amount = Number(payload.amount);
      let next = m.price;
      if (Number.isFinite(percent) && percent !== 0) {
        next = m.price * (1 + percent / 100);
      } else if (Number.isFinite(amount) && amount !== 0) {
        next = m.price + amount;
      }
      if (!Number.isFinite(next) || next <= 0) break;
      m.prev = m.price;
      m.price = next;
      m.high = Math.max(m.high, next);
      m.low = Math.min(m.low, next);
      if (currentCandles[symbol]) {
        currentCandles[symbol].close = next;
        currentCandles[symbol].high = Math.max(currentCandles[symbol].high, next);
        currentCandles[symbol].low = Math.min(currentCandles[symbol].low, next);
      }
      marketMeta[symbol] = marketMeta[symbol] || { lastLive: 0, source: "admin", overrideUntil: 0 };
      marketMeta[symbol].overrideUntil = now + 30000;
      break;
    }
    case "SET_CANDLE_BIAS": {
      const direction = String(payload?.direction || "up").toLowerCase();
      if (!["up", "down", "side"].includes(direction)) break;
      const all = !!payload?.all;
      const strengthPct = Number(payload?.strengthPct);
      const wickPct = Number(payload?.wickPct);
      const durationMs = Number(payload?.durationMs);
      const targets = all
        ? coins.map((coin) => coin.symbol)
        : [symbol];
      targets.forEach((sym) => {
        applyCandleBiasToSymbol(sym, direction, strengthPct, wickPct, durationMs);
      });
      break;
    }
    default:
      break;
  }
}

let marketTickBusy = false;
async function tickMarket() {
  if (marketTickBusy) return;
  marketTickBusy = true;
  try {
    coins.forEach((coin) => {
      updateMarketLogic(coin);
      const price = market[coin.symbol].price;
      const now = Math.floor(Date.now() / 1000);
      const bucket = now - (now % CANDLE_INTERVAL_SEC);
      let candle = currentCandles[coin.symbol];
      if (!candle || candle.time !== bucket) {
        if (candle) {
          const history = candleHistory[coin.symbol] || [];
          history.push(candle);
          if (history.length > CANDLE_LIMIT) history.shift();
          candleHistory[coin.symbol] = history;
        }
        candle = { time: bucket, open: price, high: price, low: price, close: price };
        currentCandles[coin.symbol] = candle;
      } else {
        candle.close = price;
        if (price > candle.high) candle.high = price;
        if (price < candle.low) candle.low = price;
      }
    });
    const payload = buildMarketPayload();
    io.emit("market_update", payload);

    const priceMap = {};
    Object.keys(payload).forEach((sym) => {
      priceMap[sym] = payload[sym].price;
    });

    const tasks = Object.entries(users).map(([username, user]) =>
      withUserLock(username, async () => {
        const sock = sockets[username];
        let changed = false;
        changed = processLimitOrders(user, priceMap, sock) || changed;
        changed = applyProtections(user, priceMap) || changed;
        changed = checkLiquidations(user, priceMap) || changed;
        if (changed) {
          queueSaveUsers(user);
          if (sock) emitAccount(sock, user);
        }
      })
    );
    await Promise.all(tasks);
  } finally {
    marketTickBusy = false;
  }
}

/* io.on("connection", (socket) => {
  const wallet = {
    usd: 10000,
    vnd: 200000000,
    holdings: {}
  };
  coins.forEach((coin) => {
    wallet.holdings[coin.symbol] = 0;
  });
  users[socket.id] = wallet;

  socket.emit("market_update", buildMarketPayload());
  socket.emit("update_wallet", { usd: wallet.usd, vnd: wallet.vnd });

  socket.on("place_order", (order) => {
    try {
      if (!order || !order.symbol || !Number.isFinite(order.qty) || order.qty <= 0) {
        socket.emit("order_rejected", { clientId: order?.clientId, reason: "Lệnh không hợp lệ." });
        return;
      }
      const user = users[socket.id];
      if (!user) return;

      const coin = coins.find((c) => c.symbol === order.symbol);
      if (!coin) {
        socket.emit("order_rejected", { clientId: order.clientId, reason: "Coin không tồn tại." });
        return;
      }

      const leverage = Math.max(1, parseInt(order.leverage, 10) || 1);
      const side = order.side === "sell" ? "sell" : "buy";
      const type = order.type === "limit" ? "limit" : "market";
      const price = type === "limit" && Number.isFinite(order.priceUsd)
        ? order.priceUsd
        : market[order.symbol].price;

      const notionalUsd = price * order.qty;
      const marginUsd = leverage === 1 ? notionalUsd : notionalUsd / leverage;
      const feeUsd = marginUsd * BASE_FEE_RATE;

      if (side === "buy") {
        if (user.usd < marginUsd + feeUsd) {
          socket.emit("order_rejected", { clientId: order.clientId, reason: "Số dư không đủ." });
          return;
        }
        user.usd -= marginUsd + feeUsd;
        if (leverage === 1) {
          user.holdings[order.symbol] = (user.holdings[order.symbol] || 0) + order.qty;
        }
      } else {
        if (leverage === 1) {
          const hold = user.holdings[order.symbol] || 0;
          if (hold < order.qty) {
            socket.emit("order_rejected", { clientId: order.clientId, reason: "Không đủ coin để bán." });
            return;
          }
          user.holdings[order.symbol] = hold - order.qty;
          user.usd += Math.max(0, notionalUsd - feeUsd);
        } else {
          if (user.usd < marginUsd + feeUsd) {
            socket.emit("order_rejected", { clientId: order.clientId, reason: "Số dư không đủ." });
            return;
          }
          user.usd -= marginUsd + feeUsd;
        }
      }

      const stored = {
        id: Date.now() + Math.random(),
        userId: socket.id,
        clientId: order.clientId,
        symbol: order.symbol,
        side,
        type,
        qty: order.qty,
        leverage,
        price
      };
      orders.push(stored);

      socket.emit("order_accepted", {
        clientId: order.clientId,
        order: order,
        filledPrice: price
      });
      socket.emit("update_wallet", { usd: user.usd, vnd: user.vnd });
    } catch (err) {
      socket.emit("order_rejected", { clientId: order?.clientId, reason: "Lỗi xử lý lệnh." });
    }
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
  });
}); */

/*
io.on("connection", (socket) => {
  const clientId = socket.handshake?.auth?.clientId
    || socket.handshake?.auth?.token
    || socket.id;
  socket.data.clientId = clientId;
  const user = ensureUser(clientId);
  syncUserCoins(user);
  sockets[clientId] = socket;

  socket.emit("init_market", { coins: getVisibleCoins(), coinVisibility: settings.coinVisibility || {} });
  socket.emit("init_history", {
    history: candleHistory,
    current: currentCandles,
    interval: CANDLE_INTERVAL_SEC
  });
  socket.emit("market_update", buildMarketPayload());
  emitAccount(socket, user);

  socket.on("admin_auth", (payload) => {
    const pass = payload?.password || "";
    if (pass === ADMIN_PASSWORD) {
      user.isAdmin = true;
      socket.emit("admin_status", { ok: true });
    } else {
      socket.emit("admin_status", { ok: false, reason: "Sai mật khẩu admin." });
    }
  });

  socket.on("admin_action", async (payload) => {
    if (!user.isAdmin) {
      socket.emit("admin_error", { reason: "Không có quyền admin." });
      return;
    }
    applyGodModeAction(payload?.action, payload);
  });

  socket.on("place_order", (order) => {
    try {
      if (!order || !order.symbol || !Number.isFinite(order.qty) || order.qty <= 0) {
        socket.emit("order_rejected", { clientId: order?.clientId, reason: "Lệnh không hợp lệ." });
        return;
      }
      const coin = coins.find((c) => c.symbol === order.symbol);
      if (!coin) {
        socket.emit("order_rejected", { clientId: order.clientId, reason: "Coin không tồn tại." });
        return;
      }

      const leverage = Math.max(1, parseInt(order.leverage, 10) || 1);
      const side = order.side === "sell" ? "sell" : "buy";
      const type = order.type === "limit" ? "limit" : "market";
      const price = type === "limit" && Number.isFinite(order.priceUsd)
        ? order.priceUsd
        : market[order.symbol].price;

      const notionalUsd = price * order.qty;
      const notionalQuote = toQuote(notionalUsd, order.quote);
      const totalQuote = leverage === 1 ? notionalQuote : notionalQuote / leverage;
      const feeQuote = totalQuote * BASE_FEE_RATE;

      if (side === "buy") {
        const balance = order.quote === "USD" ? user.usd : user.vnd;
        if (balance < totalQuote + feeQuote) {
          socket.emit("order_rejected", { clientId: order.clientId, reason: "Số dư không đủ." });
          return;
        }
        if (type === "market") {
          addBalance(user, order.quote, -(totalQuote + feeQuote));
          if (leverage === 1) {
            user.holdings[order.symbol] += order.qty;
            const oldQty = user.holdings[order.symbol] - order.qty;
            const oldAvg = user.costBasis[order.symbol] || 0;
            const newAvg = ((oldQty * oldAvg) + order.qty * price) / (oldQty + order.qty);
            user.costBasis[order.symbol] = newAvg;
            if (!user.holdingStart[order.symbol]) user.holdingStart[order.symbol] = Date.now();
          } else {
            user.positions.push({
              id: Date.now() + Math.random(),
            userId: clientId,
              symbol: order.symbol,
              side: "buy",
              qty: order.qty,
              entry: price,
              leverage,
              marginUsd: notionalUsd / leverage,
              quote: order.quote
            });
          }
          if (order.stopInput || order.takeInput || order.trailPct) {
            user.protections.push({
              id: Date.now() + Math.random(),
              symbol: order.symbol,
              qty: order.qty,
              side: "buy",
              leverage,
              quote: order.quote,
              stop: order.stopInput || null,
              take: order.takeInput || null,
              trailPct: order.trailPct || 0,
              trailHigh: price,
              trailLow: null
            });
          }
          socket.emit("order_accepted", { clientId: order.clientId, order, filledPrice: price });
          emitAccount(socket, user);
          return;
        }

        addBalance(user, order.quote, -(totalQuote + feeQuote));
        user.openOrders.push({
          id: Date.now() + Math.random(),
          userId: clientId,
          side,
          type,
          symbol: order.symbol,
          priceUsd: price,
          qty: order.qty,
          quote: order.quote,
          leverage,
          stopInput: order.stopInput,
          takeInput: order.takeInput,
          trailPct: order.trailPct,
          locked: totalQuote + feeQuote
        });
        socket.emit("order_accepted", { clientId: order.clientId, order, filledPrice: price });
        emitAccount(socket, user);
      } else {
        if (leverage === 1) {
          if ((user.holdings[order.symbol] || 0) < order.qty) {
            socket.emit("order_rejected", { clientId: order.clientId, reason: "Không đủ coin để bán." });
            return;
          }
        } else {
          const balance = order.quote === "USD" ? user.usd : user.vnd;
          if (balance < totalQuote + feeQuote) {
            socket.emit("order_rejected", { clientId: order.clientId, reason: "Số dư không đủ." });
            return;
          }
        }

        if (type === "market") {
          if (leverage === 1) {
            const receive = totalQuote - feeQuote;
            addBalance(user, order.quote, receive);
            user.holdings[order.symbol] -= order.qty;
            if (user.holdings[order.symbol] <= 0) {
              user.costBasis[order.symbol] = 0;
              user.holdingStart[order.symbol] = null;
            }
          } else {
            addBalance(user, order.quote, -(totalQuote + feeQuote));
            user.positions.push({
              id: Date.now() + Math.random(),
              userId: clientId,
              symbol: order.symbol,
              side: "sell",
              qty: order.qty,
              entry: price,
              leverage,
              marginUsd: notionalUsd / leverage,
              quote: order.quote
            });
          }
          if (order.stopInput || order.takeInput || order.trailPct) {
            user.protections.push({
              id: Date.now() + Math.random(),
              symbol: order.symbol,
              qty: order.qty,
              side: "sell",
              leverage,
              quote: order.quote,
              stop: order.stopInput || null,
              take: order.takeInput || null,
              trailPct: order.trailPct || 0,
              trailHigh: null,
              trailLow: price
            });
          }
          socket.emit("order_accepted", { clientId: order.clientId, order, filledPrice: price });
          emitAccount(socket, user);
          return;
        }

        if (leverage === 1) {
          user.holdings[order.symbol] -= order.qty;
        } else {
          addBalance(user, order.quote, -(totalQuote + feeQuote));
        }
        user.openOrders.push({
          id: Date.now() + Math.random(),
          userId: clientId,
          side,
          type,
          symbol: order.symbol,
          priceUsd: price,
          qty: order.qty,
          quote: order.quote,
          leverage,
          stopInput: order.stopInput,
          takeInput: order.takeInput,
          trailPct: order.trailPct,
          locked: leverage === 1 ? order.qty : totalQuote + feeQuote
        });
        socket.emit("order_accepted", { clientId: order.clientId, order, filledPrice: price });
        emitAccount(socket, user);
      }
    } catch (err) {
      socket.emit("order_rejected", { clientId: order?.clientId, reason: "Lỗi xử lý lệnh." });
    }
  });

  socket.on("cancel_order", (orderId) => {
    const orderIndex = user.openOrders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return;
    const order = user.openOrders[orderIndex];
    if (order.side === "buy") {
      addBalance(user, order.quote, order.locked);
    } else {
      if (order.leverage === 1) {
        user.holdings[order.symbol] += order.locked;
        if (!user.holdingStart[order.symbol]) user.holdingStart[order.symbol] = Date.now();
      } else {
        addBalance(user, order.quote, order.locked);
      }
    }
    user.openOrders.splice(orderIndex, 1);
    emitAccount(socket, user);
  });

  socket.on("close_position", (payload) => {
    if (!payload) return;
    let symbol = payload.symbol;
    let side = payload.side;
    let leverage = payload.leverage;
    let qty = payload.qty;
    let quote = payload.quote;

    if (payload.id || payload.positionId) {
      const lookupId = payload.id || payload.positionId;
      const pos = user.positions.find((p) => p.id === lookupId);
      if (pos) {
        symbol = pos.symbol;
        side = pos.side;
        leverage = pos.leverage;
        quote = pos.quote;
        qty = payload.qty || pos.qty;
      }
    }

    if (!symbol) return;
    const price = market[symbol]?.price;
    if (!price) return;
    const success = closePositionInternal(user, symbol, side, leverage, price, qty, quote);
    if (success) emitAccount(socket, user);
  });

  socket.on("disconnect", () => {
    delete sockets[clientId];
  });
});
*/

io.on("connection", (socket) => {
  const ip = getSocketIp(socket);
  if (isIpBlacklisted(ip)) {
    socket.emit("auth_required", { reason: "IP bị chặn." });
    try {
      socket.disconnect(true);
    } catch {
      // ignore disconnect errors
    }
    return;
  }
  socket.emit("init_market", { coins });
  socket.emit("init_history", {
    history: candleHistory,
    current: currentCandles,
    interval: CANDLE_INTERVAL_SEC
  });
  socket.emit("market_update", buildMarketPayload());
  socket.data.accessToken = null;
  socket.data.accessExp = 0;

  socket.on("refresh_session", (payload) => {
    const ip = getSocketIp(socket);
    if (!rateLimit(`auth:refresh:${ip}`, AUTH_RATE_MAX, AUTH_RATE_WINDOW_MS)) {
      socket.emit("session_error", { reason: "Thao tác quá nhanh. Vui lòng thử lại." });
      return;
    }
    const refreshToken = String(payload?.refreshToken || "");
    if (!refreshToken) {
      socket.emit("session_error", { reason: "Thiếu refresh token." });
      return;
    }
    const hash = hashToken(refreshToken);
    const username = refreshIndex.get(hash);
    if (!username || !users[username]) {
      socket.emit("session_error", { reason: "Refresh token không hợp lệ." });
      return;
    }
    const user = normalizeUser(users[username], username);
    if (user.refreshHash && user.refreshExp < Date.now()) {
      clearRefreshToken(user);
    }
    if (!user.refreshHash || user.refreshHash !== hash || user.refreshExp < Date.now()) {
      clearRefreshToken(user);
      queueSaveUsers(user);
      socket.emit("session_error", { reason: "Refresh token hết hạn." });
      return;
    }
    if (user.locked) {
      socket.emit("session_error", { reason: "Tài khoản đã bị khóa." });
      return;
    }
    if (user.deleted) {
      clearRefreshToken(user);
      queueSaveUsers(user);
      socket.emit("session_error", { reason: "Tai khoan da bi xoa." });
      return;
    }
    const tokens = issueTokens(user);
    setSession(socket, username, tokens.accessToken, tokens.accessExp);
    queueSaveUsers(user);
    socket.emit("session_ok", {
      username,
      isAdmin: !!user.isAdmin,
      adminRole: user.adminRole || "",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessExp: tokens.accessExp,
      refreshExp: tokens.refreshExp
    });
    emitAccount(socket, user);
  });

  socket.on("register", (payload) => {
    const ip = getSocketIp(socket);
    if (!rateLimit(`auth:register:${ip}`, AUTH_RATE_MAX, AUTH_RATE_WINDOW_MS)) {
      socket.emit("register_error", { reason: "Thao tác quá nhanh. Vui lòng thử lại." });
      return;
    }
    if (settings.maintenanceMode) {
      socket.emit("register_error", { reason: "Hệ thống đang bảo trì." });
      return;
    }
    if (!settings.registrationOpen) {
      socket.emit("register_error", { reason: "Đăng ký tạm thời đóng." });
      return;
    }
    if (settings.inviteOnly) {
      const invite = String(payload?.inviteCode || "").trim();
      if (!invite || !inviteCodes.has(invite)) {
        socket.emit("register_error", { reason: "Cần mã mời hợp lệ." });
        return;
      }
      inviteCodes.delete(invite);
      saveSettings();
    }
    const username = sanitizeUsername(payload?.username);
    const password = String(payload?.password || "");
    if (!username) {
      socket.emit("register_error", { reason: "Tài khoản không hợp lệ." });
      return;
    }
    if (username === ADMIN_OWNER_USER) {
      socket.emit("register_error", { reason: "Tài khoản này đã được dành riêng." });
      return;
    }
    if (users[username]) {
      const existing = normalizeUser(users[username], username);
      if (existing.deleted) {
        socket.emit("register_error", { reason: "Tài khoản đã bị xóa." });
      } else {
        socket.emit("register_error", { reason: "Tài khoản đã tồn tại." });
      }
      return;
    }
    const user = createUser(username, password);
    users[username] = user;
    const tokens = issueTokens(user);
    setSession(socket, username, tokens.accessToken, tokens.accessExp);
    queueSaveUsers(user);
    socket.emit("register_ok", {
      username,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessExp: tokens.accessExp,
      refreshExp: tokens.refreshExp
    });
    emitAccount(socket, user);
  });

  socket.on("login", (payload) => {
    const ip = getSocketIp(socket);
    const username = sanitizeUsername(payload?.username);
    const password = String(payload?.password || "");
    const adminCode = String(payload?.adminCode || "");
    const loginKey = getLoginKey(socket, username);
    if (!rateLimit(`auth:login:${ip}`, AUTH_RATE_MAX, AUTH_RATE_WINDOW_MS)) {
      socket.emit("login_error", { reason: "Thao tác quá nhanh. Vui lòng thử lại." });
      return;
    }
    if (settings.maintenanceMode && username !== ADMIN_OWNER_USER) {
      socket.emit("login_error", { reason: "Hệ thống đang bảo trì." });
      return;
    }
    if (isLoginBlocked(loginKey)) {
      socket.emit("login_error", { reason: "Tài khoản tạm khóa do đăng nhập sai nhiều lần." });
      return;
    }
    if (!username || !users[username]) {
      noteLoginFail(loginKey);
      socket.emit("login_error", { reason: "Sai tài khoản hoặc mật khẩu." });
      return;
    }
    const user = normalizeUser(users[username], username);
    if (user.deleted) {
      noteLoginFail(loginKey);
      recordUserLoginFail(user, ip);
      socket.emit("login_error", { reason: "Tai khoan da bi xoa." });
      return;
    }
    if (user.locked) {
      noteLoginFail(loginKey);
      recordUserLoginFail(user, ip);
      socket.emit("login_error", { reason: "Tài khoản đã bị khóa." });
      return;
    }
    if (username === ADMIN_OWNER_USER && adminCode !== ADMIN_OWNER_CODE) {
      noteLoginFail(loginKey);
      recordUserLoginFail(user, ip);
      socket.emit("login_error", { reason: "Cần mã sếp để đăng nhập." });
      return;
    }
    if (!verifyPassword(password, user.password)) {
      noteLoginFail(loginKey);
      recordUserLoginFail(user, ip);
      socket.emit("login_error", { reason: "Sai tài khoản hoặc mật khẩu." });
      return;
    }
    noteLoginSuccess(loginKey);
    user.lastLoginAt = Date.now();
    user.lastLoginIp = ip || "";
    user.lastLoginUa = getUserAgent(socket);
    user.lastLoginFailCount = 0;
    if (username === ADMIN_OWNER_USER) {
      user.isAdmin = true;
      user.adminRole = "super_admin";
    }
    if (user.isAdmin && !user.adminRole) {
      user.adminRole = "moderator";
    }
    const tokens = issueTokens(user);
    setSession(socket, username, tokens.accessToken, tokens.accessExp);
    queueSaveUsers(user);
    socket.emit("login_ok", {
      username,
      isAdmin: !!user.isAdmin,
      adminRole: user.adminRole || "",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessExp: tokens.accessExp,
      refreshExp: tokens.refreshExp
    });
    emitAccount(socket, user);
  });

  socket.on("change_password", (payload) => {
    const user = requireUser(socket);
    if (!user) return;
    const oldPass = String(payload?.oldPassword || "");
    const newPass = String(payload?.newPassword || "");
    if (!oldPass || !newPass) {
      socket.emit("change_password_error", { reason: "Thông tin không hợp lệ." });
      return;
    }
    if (!verifyPassword(oldPass, user.password)) {
      socket.emit("change_password_error", { reason: "Mật khẩu cũ không đúng." });
      return;
    }
    if (newPass.length < 6) {
      socket.emit("change_password_error", { reason: "Mật khẩu mới quá ngắn." });
      return;
    }
    user.password = hashPassword(newPass);
    queueSaveUsers(user);
    socket.emit("change_password_ok");
  });

  socket.on("admin_auth", (payload) => {
    const user = requireUser(socket);
    if (!user) return;
    const ip = getSocketIp(socket);
    if (!isAdminAccessAllowed()) {
      const reason = "Khung gio admin dang bi khoa.";
      logAdminAction(socket, user, "ADMIN_AUTH", payload, false, reason);
      socket.emit("admin_status", { ok: false, reason });
      return;
    }
    if (!isAdminIpAllowed(ip)) {
      const reason = "IP khong duoc phep.";
      logAdminAction(socket, user, "ADMIN_AUTH", payload, false, reason);
      emitSecurityAlert("admin_ip_block", "Admin IP bi chan.", { ip, admin: user.username });
      socket.emit("admin_status", { ok: false, reason });
      return;
    }
    const authLimit = Number(settings.adminRateLimits?.auth) || AUTH_RATE_MAX;
    if (!rateLimit(`admin_auth:${user.username}`, authLimit, AUTH_RATE_WINDOW_MS)) {
      const reason = "Thao tac qua nhanh.";
      logAdminAction(socket, user, "ADMIN_AUTH", payload, false, reason);
      socket.emit("admin_status", { ok: false, reason });
      return;
    }
    const pass = String(payload?.password || "");
    const otp = String(payload?.otp || "");
    if (pass === ADMIN_PASSWORD) {
      if (ADMIN_OTP_SECRET && !verifyOtp(otp, ADMIN_OTP_SECRET)) {
        const reason = "OTP khong hop le.";
        logAdminAction(socket, user, "ADMIN_AUTH", payload, false, reason);
        socket.emit("admin_status", { ok: false, reason });
        return;
      }
      socket.data.adminLastAt = Date.now();
      socket.data.adminSessionExp = Date.now() + (Number(settings.adminSessionMs) || DEFAULT_ADMIN_SESSION_MS);
      user.isAdmin = true;
      user.adminRole = user.username === ADMIN_OWNER_USER ? "super_admin" : "moderator";
      queueSaveUsers(user);
      logAdminAction(socket, user, "ADMIN_AUTH", payload, true);
      socket.emit("admin_status", { ok: true, role: user.adminRole || "" });
    } else {
      const reason = "Sai mat khau admin.";
      logAdminAction(socket, user, "ADMIN_AUTH", payload, false, reason);
      socket.emit("admin_status", { ok: false, reason });
    }
  });

  socket.on("admin_action", async (payload) => {
    const user = getRealUser(socket);
    if (!user) {
      requireUser(socket);
      return;
    }
    const action = String(payload?.action || "");
    const deny = (reason) => {
      logAdminAction(socket, user, action || "UNKNOWN", payload, false, reason);
      socket.emit("admin_error", { reason });
    };
    const ip = getSocketIp(socket);
    if (!user.isAdmin) {
      deny("Khong co quyen admin.");
      return;
    }
    if (!isAdminIpAllowed(ip)) {
      deny("IP khong duoc phep.");
      emitSecurityAlert("admin_ip_block", "Admin IP bi chan.", { ip, admin: user.username });
      return;
    }
    if (!isAdminAccessAllowed()) {
      deny("Khung gio admin dang bi khoa.");
      return;
    }
    if (!isAdminSessionValid(socket)) {
      deny("Phien admin het han hoac idle.");
      socket.emit("admin_status", { ok: false, reason: "Phien admin het han." });
      return;
    }
    const roleLimit = getAdminRole(user) === "super_admin"
      ? Number(settings.adminRateLimits?.super) || ADMIN_RATE_MAX_SUPER
      : Number(settings.adminRateLimits?.mod) || ADMIN_RATE_MAX_MOD;
    if (!rateLimit(`admin:${user.username}`, roleLimit, ADMIN_RATE_WINDOW_MS)) {
      deny("Thao tac qua nhanh.");
      emitSecurityAlert("admin_rate", "Admin thao tac lien tuc.", {
        admin: user.username,
        role: getAdminRole(user),
        ip
      });
      return;
    }
    const superOnly = new Set([
      "RESET_PASSWORD",
      "DELETE_USER",
      "RESTORE_USER",
      "SET_PRICE",
      "ADJUST_PRICE",
      "CRASH",
      "PUMP_BTC",
      "FREEZE",
      "CALM",
      "VOL",
      "SET_CANDLE_BIAS",
      "SET_REGISTRATION",
      "SET_INVITE_ONLY",
      "ADD_INVITE",
      "REMOVE_INVITE",
      "BLOCK_IP",
      "UNBLOCK_IP",
      "WHITELIST_ADMIN_IP",
      "UNWHITELIST_ADMIN_IP",
      "SET_MARKET_FREEZE",
      "SET_COIN_FREEZE",
      "SET_COIN_LOCK",
      "SET_COIN_SOURCE",
      "SET_COIN_VOL",
      "SET_SLIPPAGE",
      "SET_BLOCK_STALE",
      "SET_MARGIN_ENABLED",
      "SET_CANCEL_PENALTY",
      "SET_STRIKE_LIMIT",
      "SET_ALERT_WEBHOOK",
      "SET_ORDER_DISABLED",
      "SET_MAINTENANCE",
      "CANCEL_ORDER_ADMIN",
      "RESET_OPEN_ORDERS",
      "RESET_POSITIONS",
      "LIST_APPROVALS",
      "IMPERSONATE_START",
      "IMPERSONATE_STOP",
      "SET_CIRCUIT_BREAKER",
      "SET_GROUP_FEE",
      "SET_CANCEL_PENALTY",
      "SET_STRIKE_LIMIT",
      "SET_ALERT_WEBHOOK",
      "SET_WITHDRAW_DISABLED",
      "SET_DEPOSIT_DISABLED",
      "BACKUP_DB",
      "RESTORE_DB",
      "SET_ADMIN_ACCESS_HOURS",
      "SET_ADMIN_IDLE",
      "SET_ADMIN_SESSION",
      "SET_ADMIN_READONLY",
      "SET_SAFE_MODE",
      "SET_RATE_LIMITS",
      "SET_SOURCE_WHITELIST",
      "SET_COIN_VISIBILITY",
      "ADD_COIN",
      "REMOVE_COIN",
      "SET_COIN_LIMITS",
      "SET_LOG_RETENTION",
      "RUN_LOG_CLEANUP"
    ]);
    const approvalRequired = new Set([
      "RESET_PASSWORD",
      "DELETE_USER",
      "SET_PRICE",
      "ADJUST_PRICE",
      "CRASH",
      "PUMP_BTC",
      "FREEZE",
      "CALM",
      "VOL",
      "SET_CANDLE_BIAS",
      "CANCEL_ORDER_ADMIN",
      "RESET_OPEN_ORDERS",
      "RESET_POSITIONS",
      "SET_MARKET_FREEZE",
      "SET_COIN_LOCK",
      "RESTORE_DB"
    ]);
    const modAllowed = new Set([
      "SET_BALANCE",
      "LOCK_USER",
      "UNLOCK_USER",
      "FORCE_LOGOUT",
      "CHECK_USERS",
      "GET_KPI",
      "GET_SETTINGS",
      "SET_USER_GROUP",
      "SET_USER_TAGS",
      "SET_USER_NOTE",
      "SET_LIMITS",
      "SET_STRIKES",
      "RESET_STRIKES",
      "SET_WATCHLIST",
      "SET_USER_FEE",
      "GET_SPAM_STATS",
      "GET_USER_TRADES",
      "EXPORT_USER_TRADES_CSV",
      "GET_PNL_DAILY",
      "GET_TOP_USERS_PNL",
      "GET_TOP_COIN_VOLUME",
      "GET_OPEN_INTEREST",
      "GET_ONLINE_USERS",
      "GET_ADMIN_LOG",
      "GET_MODERATOR_STATS",
      "GET_DB_STATUS",
      "GET_WEEKLY_REPORT",
      "GET_SPAM_HEATMAP",
      "LIST_COMPLAINTS",
      "ADD_COMPLAINT",
      "RESOLVE_COMPLAINT",
      "ADD_COMPLAINT_NOTE",
      "GET_INCIDENT_CHECKLIST",
      "TOGGLE_INCIDENT_ITEM",
      "SET_INCIDENT_CHECKLIST",
      "GET_APPROVALS_BY_ACTION",
      "GET_ALL_COINS"
    ]);
    if (!action) {
      deny("Hanh dong khong hop le.");
      return;
    }
    const readOnlyAllowed = new Set([
      "CHECK_USERS",
      "GET_KPI",
      "GET_SETTINGS",
      "GET_SPAM_STATS",
      "GET_USER_TRADES",
      "EXPORT_USER_TRADES_CSV",
      "GET_PNL_DAILY",
      "GET_TOP_USERS_PNL",
      "GET_TOP_COIN_VOLUME",
      "GET_OPEN_INTEREST",
      "GET_ONLINE_USERS",
      "LIST_APPROVALS",
      "GET_ADMIN_LOG",
      "GET_MODERATOR_STATS",
      "GET_DB_STATUS",
      "GET_WEEKLY_REPORT",
      "GET_SPAM_HEATMAP",
      "LIST_COMPLAINTS",
      "GET_INCIDENT_CHECKLIST",
      "GET_APPROVALS_BY_ACTION",
      "GET_ALL_COINS"
    ]);
    if ((settings.adminReadOnly || settings.safeMode) && !readOnlyAllowed.has(action)) {
      deny("Admin dang o che do read-only.");
      return;
    }
    if (superOnly.has(action) && !isSuperAdmin(user)) {
      deny("Chi super_admin duoc phep.");
      return;
    }
    if (modAllowed.has(action) && !isModerator(user)) {
      deny("Khong co quyen admin.");
      return;
    }
    if (approvalRequired.has(action)) {
      const approveToken = String(payload?.approveToken || "");
      if (!approveToken) {
        const token = createApproval(action, payload, user, socket);
        socket.emit("admin_approval_required", {
          token,
          action,
          details: adminLogDetails(action, payload),
          requireOwnerCode: requiresOwnerCode(action)
        });
        return;
      }
      const approval = takeApproval(approveToken);
      if (!approval || approval.action !== action || approval.user !== user.username) {
        deny("Ma xac nhan khong hop le.");
        return;
      }
      payload = { ...(approval.payload || {}), ...(payload || {}) };
      if (requiresOwnerCode(action)) {
        const provided = getOwnerCodeFromPayload(payload);
        if (!provided || provided !== ADMIN_OWNER_CODE) {
          deny("Sai ma xac nhan.");
          return;
        }
      }
    }
    if (action === "BROADCAST_NOTICE") {
      const message = String(payload?.message || payload?.text || "").trim();
      const durationMs = Math.min(120000, Math.max(5000, Number(payload?.durationMs || payload?.duration || 30000)));
      if (!message) {
        deny("Thieu noi dung thong bao.");
        return;
      }
      io.emit("admin_broadcast", {
        message,
        durationMs,
        admin: user.username,
        ts: Date.now()
      });
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, broadcast: true });
      return;
    }
    if (action === "SEND_MAIL") {
      const targetRaw = String(payload?.target || payload?.username || "").trim();
      const target = targetRaw ? sanitizeUsername(targetRaw) : "";
      const mail = buildMail(payload, user.username);
      const recipients = target ? [target] : Object.keys(users);
      let delivered = 0;
      recipients.forEach((name) => {
        const u = users[name];
        if (!u || u.deleted) return;
        addMailToUser(u, { ...mail, id: createMailId() });
        queueSaveUsers(u);
        delivered += 1;
        const sock = sockets[name];
        if (sock) {
          sock.emit("mail_new", { mail: u.inbox[0] });
          emitAccount(sock, u);
        }
      });
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, delivered });
      return;
    }
    if (action === "SET_BALANCE") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        if (targetUser.deleted) {
          deny("Tai khoan da bi xoa.");
          return;
        }
        const before = { usd: targetUser.usd, vnd: targetUser.vnd };
        let updated = false;
        if (Number.isFinite(payload?.usd)) {
          targetUser.usd = Number(payload.usd);
          updated = true;
        }
        if (Number.isFinite(payload?.vnd)) {
          targetUser.vnd = Number(payload.vnd);
          updated = true;
        }
        if (!updated) {
          const amount = Number(payload?.amount);
          const currency = String(payload?.currency || payload?.quote || "USD").toUpperCase();
          if (!Number.isFinite(amount)) {
            deny("So tien khong hop le.");
            return;
          }
          if (currency === "VND") targetUser.vnd = amount;
          else targetUser.usd = amount;
          updated = true;
        }
        if (updated) {
          queueSaveUsers(targetUser);
          const targetSocket = sockets[target];
          if (targetSocket) emitAccount(targetSocket, targetUser);
          logUserEdit(user, target, "SET_BALANCE", {
            before,
            after: { usd: targetUser.usd, vnd: targetUser.vnd }
          }, socket);
          logAdminAction(socket, user, action, payload, true);
          socket.emit("admin_notice", { ok: true, target });
        }
      });
      return;
    }
    if (action === "LOCK_USER" || action === "UNLOCK_USER") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        if (targetUser.deleted) {
          deny("Tai khoan da bi xoa.");
          return;
        }
        const beforeLocked = targetUser.locked;
        targetUser.locked = action === "LOCK_USER";
        queueSaveUsers(targetUser);
        const targetSocket = sockets[target];
        if (targetSocket) {
          emitAccount(targetSocket, targetUser);
          if (targetUser.locked) {
            targetSocket.emit("auth_required", { reason: "Tai khoan da bi khoa." });
            clearSession(targetSocket);
          }
        }
        logUserEdit(user, target, action, { before: beforeLocked, after: targetUser.locked }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target, locked: targetUser.locked });
      });
      return;
    }
    if (action === "FORCE_LOGOUT") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        if (targetUser.deleted) {
          deny("Tai khoan da bi xoa.");
          return;
        }
        clearRefreshToken(targetUser);
        queueSaveUsers(targetUser);
        const targetSocket = sockets[target];
        if (targetSocket) {
          targetSocket.emit("auth_required", { reason: "Bi dang xuat boi admin." });
          clearSession(targetSocket);
          try {
            targetSocket.disconnect(true);
          } catch {
            // ignore disconnect errors
          }
        }
        logUserEdit(user, target, "FORCE_LOGOUT", { forced: true }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target, logout: true });
      });
      return;
    }
    if (action === "SET_USER_GROUP") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      const group = String(payload?.group || "").trim();
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        targetUser.group = group;
        queueSaveUsers(targetUser);
        logUserEdit(user, target, "SET_USER_GROUP", { group }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target });
      });
      return;
    }
    if (action === "SET_USER_TAGS") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      const raw = Array.isArray(payload?.tags)
        ? payload.tags
        : String(payload?.tags || "").split(",");
      const tags = raw
        .map((t) => String(t || "").trim())
        .filter(Boolean)
        .slice(0, 12);
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        targetUser.riskTags = tags;
        queueSaveUsers(targetUser);
        logUserEdit(user, target, "SET_USER_TAGS", { tags }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target });
      });
      return;
    }
    if (action === "SET_USER_NOTE") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      const note = String(payload?.note || "").trim().slice(0, 500);
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        targetUser.notes = note;
        queueSaveUsers(targetUser);
        logUserEdit(user, target, "SET_USER_NOTE", { note }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target });
      });
      return;
    }
    if (action === "SET_LIMITS") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      const next = payload?.limits && typeof payload.limits === "object" ? payload.limits : {};
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        targetUser.limits = { ...(targetUser.limits || {}) };
        const fields = [
          "maxOpenOrders",
          "maxPositions",
          "maxNotionalUsd",
          "maxLeverage",
          "feeRate",
          "cancelPenaltyRate",
          "cancelSpamThreshold",
          "cancelSpamWindowMs"
        ];
        fields.forEach((key) => {
          if (Number.isFinite(next[key])) targetUser.limits[key] = Number(next[key]);
        });
        queueSaveUsers(targetUser);
        logUserEdit(user, target, "SET_LIMITS", { limits: targetUser.limits }, socket);
        logFeeLeverageChange(user, action, { target, limits: targetUser.limits }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target, limits: targetUser.limits });
      });
      return;
    }
    if (action === "SET_USER_FEE") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      const feeRate = Number(payload?.feeRate);
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      if (!Number.isFinite(feeRate) || feeRate < 0) {
        deny("Fee khong hop le.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        targetUser.limits = { ...(targetUser.limits || {}), feeRate };
        queueSaveUsers(targetUser);
        logUserEdit(user, target, "SET_USER_FEE", { feeRate }, socket);
        logFeeLeverageChange(user, action, { target, feeRate }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target, feeRate });
      });
      return;
    }
    if (action === "SET_STRIKES" || action === "RESET_STRIKES") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      const value = action === "RESET_STRIKES" ? 0 : Number(payload?.strikes || 0);
      if (!Number.isFinite(value) || value < 0) {
        deny("Strike khong hop le.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        targetUser.strikes = value;
        queueSaveUsers(targetUser);
        logUserEdit(user, target, action, { strikes: value }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target, strikes: value });
      });
      return;
    }
    if (action === "SET_WATCHLIST") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      const watchlist = !!payload?.watchlist;
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        targetUser.watchlist = watchlist;
        queueSaveUsers(targetUser);
        logUserEdit(user, target, "SET_WATCHLIST", { watchlist }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target, watchlist });
      });
      return;
    }
    if (action === "GET_SPAM_STATS") {
      const stats = Array.from(orderSpamStats.entries()).map(([username, data]) => ({
        username,
        ...data
      }));
      const cancelStats = Array.from(cancelSpamStats.entries()).map(([username, data]) => ({
        username,
        ...data
      }));
      socket.emit("admin_stats", { type: "spam", data: { order: stats, cancel: cancelStats } });
      return;
    }
    if (action === "GET_USER_TRADES") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      const rows = await getUserTrades(target, payload?.limit, payload?.offset);
      socket.emit("admin_trades", { target, rows });
      return;
    }
    if (action === "EXPORT_USER_TRADES_CSV") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      const rows = await getUserTrades(target, payload?.limit || 500, payload?.offset || 0);
      const csv = tradesToCsv(rows);
      socket.emit("admin_trades_csv", { target, csv });
      return;
    }
    if (action === "GET_PNL_DAILY") {
      const rows = await getDailyPnl(payload?.limit);
      socket.emit("admin_stats", { type: "pnl_daily", data: rows });
      return;
    }
    if (action === "GET_TOP_USERS_PNL") {
      const rows = await getTopUsersPnl(payload?.limit);
      socket.emit("admin_stats", { type: "top_users_pnl", data: rows });
      return;
    }
    if (action === "GET_TOP_COIN_VOLUME") {
      const rows = await getTopCoinVolume(payload?.limit);
      socket.emit("admin_stats", { type: "top_coin_volume", data: rows });
      return;
    }
    if (action === "GET_OPEN_INTEREST") {
      const data = computeOpenInterest();
      socket.emit("admin_stats", { type: "open_interest", data });
      return;
    }
    if (action === "GET_ONLINE_USERS") {
      socket.emit("admin_stats", { type: "online_users", data: Object.keys(sockets) });
      return;
    }
    if (action === "GET_ADMIN_LOG") {
      const limit = Number(payload?.limit) || 200;
      const rows = readAdminLog(limit);
      socket.emit("admin_stats", { type: "admin_log", data: rows });
      return;
    }
    if (action === "GET_MODERATOR_STATS") {
      const stats = aggregateModeratorStats();
      socket.emit("admin_stats", { type: "moderator_stats", data: stats });
      return;
    }
    if (action === "GET_DB_STATUS") {
      const status = await getDbStatus();
      socket.emit("admin_stats", { type: "db_status", data: status });
      return;
    }
    if (action === "GET_WEEKLY_REPORT") {
      const report = getWeeklyReport();
      socket.emit("admin_stats", { type: "weekly_report", data: report });
      return;
    }
    if (action === "GET_SPAM_HEATMAP") {
      socket.emit("admin_stats", { type: "spam_heatmap", data: spamHeatmap });
      return;
    }
    if (action === "GET_APPROVALS_BY_ACTION") {
      const byAction = {};
      adminApprovals.forEach((entry) => {
        byAction[entry.action] = (byAction[entry.action] || 0) + 1;
      });
      socket.emit("admin_stats", { type: "approvals_by_action", data: byAction });
      return;
    }
    if (action === "GET_ALL_COINS") {
      const list = coins.map((coin) => ({
        symbol: coin.symbol,
        name: coin.name,
        base: coin.base,
        vol: coin.vol,
        visible: settings.coinVisibility?.[coin.symbol] ?? true,
        limits: settings.coinLimits?.[coin.symbol] || {},
        source: settings.coinSource?.[coin.symbol] || (coin.binanceSymbol ? "binance" : coin.cgId ? "coingecko" : "sim")
      }));
      socket.emit("admin_stats", { type: "coins", data: list });
      return;
    }
    if (action === "LIST_COMPLAINTS") {
      const list = loadComplaints();
      socket.emit("admin_stats", { type: "complaints", data: list });
      return;
    }
    if (action === "ADD_COMPLAINT") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      const note = String(payload?.note || "").trim().slice(0, 1000);
      if (!target || !note) {
        deny("Thong tin khong hop le.");
        return;
      }
      const list = loadComplaints();
      const entry = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        target,
        note,
        status: "open",
        createdAt: Date.now(),
        notes: []
      };
      list.unshift(entry);
      saveComplaints(list);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_stats", { type: "complaints", data: list });
      return;
    }
    if (action === "RESOLVE_COMPLAINT") {
      const id = String(payload?.id || "").trim();
      if (!id) {
        deny("ID khong hop le.");
        return;
      }
      const list = loadComplaints();
      const item = list.find((row) => row.id === id);
      if (!item) {
        deny("Khong tim thay phieu.");
        return;
      }
      item.status = "resolved";
      item.resolvedAt = Date.now();
      saveComplaints(list);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_stats", { type: "complaints", data: list });
      return;
    }
    if (action === "ADD_COMPLAINT_NOTE") {
      const id = String(payload?.id || "").trim();
      const note = String(payload?.note || "").trim().slice(0, 1000);
      if (!id || !note) {
        deny("Thong tin khong hop le.");
        return;
      }
      const list = loadComplaints();
      const item = list.find((row) => row.id === id);
      if (!item) {
        deny("Khong tim thay phieu.");
        return;
      }
      item.notes = Array.isArray(item.notes) ? item.notes : [];
      item.notes.push({
        at: Date.now(),
        by: user.username,
        note
      });
      saveComplaints(list);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_stats", { type: "complaints", data: list });
      return;
    }
    if (action === "GET_INCIDENT_CHECKLIST") {
      const list = loadIncidentChecklist();
      socket.emit("admin_stats", { type: "incident_checklist", data: list });
      return;
    }
    if (action === "SET_INCIDENT_CHECKLIST") {
      const list = Array.isArray(payload?.list) ? payload.list : [];
      const normalized = list
        .map((item) => ({
          id: item.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          label: String(item.label || "").trim(),
          done: !!item.done
        }))
        .filter((item) => item.label);
      saveIncidentChecklist(normalized);
      settings.incidentChecklist = normalized;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_stats", { type: "incident_checklist", data: normalized });
      return;
    }
    if (action === "TOGGLE_INCIDENT_ITEM") {
      const id = String(payload?.id || "").trim();
      if (!id) {
        deny("ID khong hop le.");
        return;
      }
      const list = loadIncidentChecklist();
      const item = list.find((row) => row.id === id);
      if (!item) {
        deny("Khong tim thay item.");
        return;
      }
      item.done = !item.done;
      saveIncidentChecklist(list);
      settings.incidentChecklist = list;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_stats", { type: "incident_checklist", data: list });
      return;
    }
    if (action === "GET_SETTINGS") {
      socket.emit("admin_settings", {
        registrationOpen: !!settings.registrationOpen,
        inviteOnly: !!settings.inviteOnly,
        maintenanceMode: !!settings.maintenanceMode,
        marketFreeze: !!settings.marketFreeze,
        orderDisabled: !!settings.orderDisabled,
        marginEnabled: !!settings.marginEnabled,
        blockStalePrice: !!settings.blockStalePrice,
        slippagePct: Number(settings.slippagePct) || 0,
        strikeLimit: Number(settings.strikeLimit) || STRIKE_LIMIT_DEFAULT,
        cancelPenaltyRate: Number(settings.cancelPenaltyRate) || 0,
        circuitBreakerPct: Number(settings.circuitBreakerPct) || CIRCUIT_BREAK_PCT,
        alertWebhook: settings.alertWebhook || "",
        invites: Array.from(inviteCodes),
        ipBlacklist: Array.from(ipBlacklist),
        adminWhitelist: Array.from(adminIpWhitelist),
        groupFees: settings.groupFees || {},
        coinSource: settings.coinSource || {},
        coinFreeze: settings.coinFreeze || {},
        coinLock: settings.coinLock || {},
        coinVolScale: settings.coinVolScale || {},
        coinCircuit: settings.coinCircuit || {},
        withdrawalsDisabled: !!settings.withdrawalsDisabled,
        depositsDisabled: !!settings.depositsDisabled,
        logRetentionDays: Number(settings.logRetentionDays) || DEFAULT_LOG_RETENTION_DAYS,
        adminAccessHours: settings.adminAccessHours || { start: 0, end: 24 },
        adminIdleMs: Number(settings.adminIdleMs) || DEFAULT_ADMIN_IDLE_MS,
        adminSessionMs: Number(settings.adminSessionMs) || DEFAULT_ADMIN_SESSION_MS,
        adminReadOnly: !!settings.adminReadOnly,
        safeMode: !!settings.safeMode,
        adminRateLimits: settings.adminRateLimits || {},
        sourceWhitelist: settings.sourceWhitelist || ["binance", "coingecko", "sim"],
        coinVisibility: settings.coinVisibility || {},
        customCoins: settings.customCoins || [],
        removedCoins: settings.removedCoins || [],
        coinLimits: settings.coinLimits || {},
        incidentChecklist: settings.incidentChecklist || []
      });
      return;
    }
    if (action === "SET_REGISTRATION") {
      settings.registrationOpen = !!payload?.enabled;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_INVITE_ONLY") {
      settings.inviteOnly = !!payload?.enabled;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "ADD_INVITE") {
      const code = String(payload?.code || "").trim();
      if (!code) {
        deny("Ma moi khong hop le.");
        return;
      }
      inviteCodes.add(code);
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "REMOVE_INVITE") {
      const code = String(payload?.code || "").trim();
      if (!code) {
        deny("Ma moi khong hop le.");
        return;
      }
      inviteCodes.delete(code);
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "BLOCK_IP") {
      const ipValue = String(payload?.ip || "").trim();
      if (!ipValue) {
        deny("IP khong hop le.");
        return;
      }
      ipBlacklist.add(ipValue);
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "UNBLOCK_IP") {
      const ipValue = String(payload?.ip || "").trim();
      if (!ipValue) {
        deny("IP khong hop le.");
        return;
      }
      ipBlacklist.delete(ipValue);
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "WHITELIST_ADMIN_IP") {
      const ipValue = String(payload?.ip || "").trim();
      if (!ipValue) {
        deny("IP khong hop le.");
        return;
      }
      adminIpWhitelist.add(ipValue);
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "UNWHITELIST_ADMIN_IP") {
      const ipValue = String(payload?.ip || "").trim();
      if (!ipValue) {
        deny("IP khong hop le.");
        return;
      }
      adminIpWhitelist.delete(ipValue);
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_MAINTENANCE") {
      settings.maintenanceMode = !!payload?.enabled;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_ORDER_DISABLED") {
      settings.orderDisabled = !!payload?.enabled;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_MARGIN_ENABLED") {
      settings.marginEnabled = !!payload?.enabled;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_BLOCK_STALE") {
      settings.blockStalePrice = !!payload?.enabled;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_SLIPPAGE") {
      const pct = Number(payload?.slippagePct);
      if (!Number.isFinite(pct) || pct < 0 || pct > 10) {
        deny("Slippage khong hop le.");
        return;
      }
      settings.slippagePct = pct;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_CANCEL_PENALTY") {
      const rate = Number(payload?.rate);
      if (!Number.isFinite(rate) || rate < 0) {
        deny("Phí phạt khong hop le.");
        return;
      }
      settings.cancelPenaltyRate = rate;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_STRIKE_LIMIT") {
      const limit = Number(payload?.limit);
      if (!Number.isFinite(limit) || limit <= 0) {
        deny("Strike limit khong hop le.");
        return;
      }
      settings.strikeLimit = limit;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_ALERT_WEBHOOK") {
      const url = String(payload?.url || "").trim();
      settings.alertWebhook = url;
      saveSettings();
      logConfigChange(user, action, { url }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_WITHDRAW_DISABLED") {
      settings.withdrawalsDisabled = !!payload?.enabled;
      saveSettings();
      logConfigChange(user, action, { enabled: settings.withdrawalsDisabled }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_DEPOSIT_DISABLED") {
      settings.depositsDisabled = !!payload?.enabled;
      saveSettings();
      logConfigChange(user, action, { enabled: settings.depositsDisabled }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_ADMIN_ACCESS_HOURS") {
      const start = Number(payload?.start);
      const end = Number(payload?.end);
      if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > 23 || end < 0 || end > 24) {
        deny("Gio admin khong hop le.");
        return;
      }
      settings.adminAccessHours = { start, end };
      saveSettings();
      logConfigChange(user, action, settings.adminAccessHours, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_ADMIN_IDLE") {
      const ms = Number(payload?.ms);
      if (!Number.isFinite(ms) || ms < 60000) {
        deny("Idle ms khong hop le.");
        return;
      }
      settings.adminIdleMs = ms;
      saveSettings();
      logConfigChange(user, action, { ms }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_ADMIN_SESSION") {
      const ms = Number(payload?.ms);
      if (!Number.isFinite(ms) || ms < 60000) {
        deny("Session ms khong hop le.");
        return;
      }
      settings.adminSessionMs = ms;
      saveSettings();
      logConfigChange(user, action, { ms }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_ADMIN_READONLY") {
      settings.adminReadOnly = !!payload?.enabled;
      saveSettings();
      logConfigChange(user, action, { enabled: settings.adminReadOnly }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_SAFE_MODE") {
      settings.safeMode = !!payload?.enabled;
      saveSettings();
      logConfigChange(user, action, { enabled: settings.safeMode }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_RATE_LIMITS") {
      const superLimit = Number(payload?.super);
      const modLimit = Number(payload?.mod);
      const authLimit = Number(payload?.auth);
      if (!Number.isFinite(superLimit) || !Number.isFinite(modLimit) || !Number.isFinite(authLimit)) {
        deny("Rate limit khong hop le.");
        return;
      }
      settings.adminRateLimits = { super: superLimit, mod: modLimit, auth: authLimit };
      saveSettings();
      logConfigChange(user, action, settings.adminRateLimits, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_SOURCE_WHITELIST") {
      const list = Array.isArray(payload?.sources) ? payload.sources : [];
      const cleaned = list.map((s) => String(s).toLowerCase()).filter(Boolean);
      settings.sourceWhitelist = cleaned.length ? cleaned : ["binance", "coingecko", "sim"];
      saveSettings();
      logConfigChange(user, action, { sources: settings.sourceWhitelist }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_COIN_VISIBILITY") {
      const symbol = String(payload?.symbol || "").toUpperCase();
      const visible = !!payload?.visible;
      if (!symbol) {
        deny("Coin khong hop le.");
        return;
      }
      settings.coinVisibility[symbol] = visible;
      saveSettings();
      logConfigChange(user, action, { symbol, visible }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "ADD_COIN") {
      const symbol = String(payload?.symbol || "").toUpperCase();
      const name = String(payload?.name || "").trim();
      const base = Number(payload?.base);
      const vol = Number(payload?.vol);
      if (!symbol || !Number.isFinite(base)) {
        deny("Thong tin coin khong hop le.");
        return;
      }
      const ok = addCustomCoin({ symbol, name, base, vol });
      if (!ok) {
        deny("Coin da ton tai.");
        return;
      }
      logConfigChange(user, action, { symbol, name, base, vol }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "REMOVE_COIN") {
      const symbol = String(payload?.symbol || "").toUpperCase();
      if (!symbol) {
        deny("Coin khong hop le.");
        return;
      }
      const ok = removeCoin(symbol);
      if (!ok) {
        deny("Khong tim thay coin.");
        return;
      }
      logConfigChange(user, action, { symbol }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_COIN_LIMITS") {
      const symbol = String(payload?.symbol || "").toUpperCase();
      const minQty = Number(payload?.minQty);
      const maxQty = Number(payload?.maxQty);
      const precision = Number(payload?.precision);
      if (!symbol) {
        deny("Coin khong hop le.");
        return;
      }
      settings.coinLimits[symbol] = {
        minQty: Number.isFinite(minQty) ? minQty : undefined,
        maxQty: Number.isFinite(maxQty) ? maxQty : undefined,
        precision: Number.isFinite(precision) ? precision : undefined
      };
      saveSettings();
      logConfigChange(user, action, { symbol, limits: settings.coinLimits[symbol] }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_LOG_RETENTION") {
      const days = Number(payload?.days);
      if (!Number.isFinite(days) || days < 1) {
        deny("Retention khong hop le.");
        return;
      }
      settings.logRetentionDays = days;
      saveSettings();
      logConfigChange(user, action, { days }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "RUN_LOG_CLEANUP") {
      const retention = Number(settings.logRetentionDays) || DEFAULT_LOG_RETENTION_DAYS;
      cleanupLogFile(ADMIN_LOG_FILE, retention);
      cleanupLogFile(SECURITY_LOG_FILE, retention);
      cleanupLogFile(USER_EDIT_LOG_FILE, retention);
      cleanupLogFile(CONFIG_LOG_FILE, retention);
      cleanupLogFile(FEE_LOG_FILE, retention);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "BACKUP_DB") {
      const dest = await backupDb("manual");
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, backup: dest });
      return;
    }
    if (action === "RESTORE_DB") {
      const backupPath = String(payload?.backupPath || "").trim();
      if (!backupPath) {
        deny("Can duong dan backup.");
        return;
      }
      try {
        await restoreDbFromBackup(backupPath);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, restored: true });
      } catch (err) {
        deny(err?.message || "Restore that bai.");
      }
      return;
    }
    if (action === "SET_GROUP_FEE") {
      const group = String(payload?.group || "").trim();
      const feeRate = Number(payload?.feeRate);
      if (!group) {
        deny("Nhom khong hop le.");
        return;
      }
      if (!Number.isFinite(feeRate) || feeRate < 0) {
        deny("Fee khong hop le.");
        return;
      }
      settings.groupFees[group] = feeRate;
      saveSettings();
      logFeeLeverageChange(user, action, { group, feeRate }, socket);
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_CIRCUIT_BREAKER") {
      const symbol = String(payload?.symbol || "").toUpperCase();
      const pct = Number(payload?.pct);
      if (!symbol) {
        deny("Coin khong hop le.");
        return;
      }
      if (!Number.isFinite(pct) || pct <= 0) {
        deny("Pct khong hop le.");
        return;
      }
      settings.coinCircuit[symbol] = pct;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_MARKET_FREEZE") {
      settings.marketFreeze = !!payload?.enabled;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_COIN_FREEZE") {
      const symbol = String(payload?.symbol || "").toUpperCase();
      if (!symbol) {
        deny("Coin khong hop le.");
        return;
      }
      settings.coinFreeze[symbol] = !!payload?.enabled;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_COIN_LOCK") {
      const symbol = String(payload?.symbol || "").toUpperCase();
      const price = Number(payload?.price);
      const seconds = Number(payload?.seconds || 0);
      if (!symbol || !Number.isFinite(price) || price <= 0 || !Number.isFinite(seconds) || seconds <= 0) {
        deny("Thong tin khoa gia khong hop le.");
        return;
      }
      settings.coinLock[symbol] = { price, until: Date.now() + seconds * 1000 };
      const m = market[symbol];
      if (m) {
        m.prev = m.price;
        m.price = price;
        m.high = Math.max(m.high, price);
        m.low = Math.min(m.low, price);
        if (currentCandles[symbol]) {
          currentCandles[symbol].close = price;
          currentCandles[symbol].high = Math.max(currentCandles[symbol].high, price);
          currentCandles[symbol].low = Math.min(currentCandles[symbol].low, price);
        }
      }
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_COIN_SOURCE") {
      const symbol = String(payload?.symbol || "").toUpperCase();
      const source = String(payload?.source || "").toLowerCase();
      if (!symbol || !["binance", "coingecko", "sim", ""].includes(source)) {
        deny("Nguon gia khong hop le.");
        return;
      }
      if (source && !isSourceAllowed(source)) {
        deny("Nguon gia bi chan.");
        return;
      }
      if (!source) delete settings.coinSource[symbol];
      else settings.coinSource[symbol] = source;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "SET_COIN_VOL") {
      const symbol = String(payload?.symbol || "").toUpperCase();
      const scale = Number(payload?.scale);
      if (!symbol || !Number.isFinite(scale) || scale <= 0) {
        deny("VolScale khong hop le.");
        return;
      }
      settings.coinVolScale[symbol] = scale;
      saveSettings();
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, settings: true });
      return;
    }
    if (action === "LIST_APPROVALS") {
      const list = Array.from(adminApprovals.values()).map((a) => ({
        token: a.token,
        action: a.action,
        user: a.user,
        role: a.role,
        ip: a.ip,
        createdAt: a.createdAt
      }));
      socket.emit("admin_stats", { type: "approvals", data: list });
      return;
    }
    if (action === "CANCEL_ORDER_ADMIN") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      const orderId = payload?.orderId;
      if (!target || !users[target] || !orderId) {
        deny("Thong tin khong hop le.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        const idx = targetUser.openOrders.findIndex((o) => o.id === orderId);
        if (idx === -1) {
          deny("Khong tim thay lenh.");
          return;
        }
        const order = targetUser.openOrders[idx];
        if (order.side === "buy") {
          addBalance(targetUser, order.quote, order.locked);
        } else {
          if (order.leverage === 1) {
            targetUser.holdings[order.symbol] += order.locked;
          } else {
            addBalance(targetUser, order.quote, order.locked);
          }
        }
        targetUser.openOrders.splice(idx, 1);
        queueSaveUsers(targetUser);
        const targetSocket = sockets[target];
        if (targetSocket) emitAccount(targetSocket, targetUser);
        logUserEdit(user, target, "CANCEL_ORDER_ADMIN", { orderId }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target });
      });
      return;
    }
    if (action === "RESET_OPEN_ORDERS") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        targetUser.openOrders.forEach((order) => {
          if (order.side === "buy") {
            addBalance(targetUser, order.quote, order.locked);
          } else if (order.leverage === 1) {
            targetUser.holdings[order.symbol] += order.locked;
          } else {
            addBalance(targetUser, order.quote, order.locked);
          }
        });
        targetUser.openOrders = [];
        queueSaveUsers(targetUser);
        const targetSocket = sockets[target];
        if (targetSocket) emitAccount(targetSocket, targetUser);
        logUserEdit(user, target, "RESET_OPEN_ORDERS", { reset: true }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target });
      });
      return;
    }
    if (action === "RESET_POSITIONS") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        const priceMap = buildMarketPayload();
        targetUser.positions.forEach((pos) => {
          const price = priceMap[pos.symbol]?.price || market[pos.symbol]?.price;
          if (!price) return;
          closePositionInternal(targetUser, pos.symbol, pos.side, pos.leverage, price, pos.qty, pos.quote);
        });
        targetUser.positions = [];
        queueSaveUsers(targetUser);
        const targetSocket = sockets[target];
        if (targetSocket) emitAccount(targetSocket, targetUser);
        logUserEdit(user, target, "RESET_POSITIONS", { reset: true }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target });
      });
      return;
    }
    if (action === "IMPERSONATE_START") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      socket.data.impersonate = target;
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, target, impersonate: true });
      return;
    }
    if (action === "IMPERSONATE_STOP") {
      socket.data.impersonate = null;
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_notice", { ok: true, impersonate: false });
      return;
    }
    if (action === "CHECK_USERS") {
      const list = Object.keys(users).map((name) => ({
        username: name,
        userId: users[name]?.userId || "",
        email: users[name]?.email || "",
        usd: users[name]?.usd ?? 0,
        vnd: users[name]?.vnd ?? 0,
        locked: !!users[name]?.locked,
        isAdmin: !!users[name]?.isAdmin,
        role: users[name]?.adminRole || "",
        deleted: !!users[name]?.deleted,
        createdAt: users[name]?.createdAt || 0,
        lastLoginAt: users[name]?.lastLoginAt || 0,
        lastLoginIp: users[name]?.lastLoginIp || "",
        lastLoginFailAt: users[name]?.lastLoginFailAt || 0,
        lastLoginFailIp: users[name]?.lastLoginFailIp || "",
        lastLoginFailCount: users[name]?.lastLoginFailCount || 0,
        group: users[name]?.group || "",
        riskTags: users[name]?.riskTags || [],
        notes: users[name]?.notes || "",
        limits: users[name]?.limits || {},
        strikes: users[name]?.strikes || 0,
        watchlist: !!users[name]?.watchlist,
        online: !!sockets[name]
      }));
      logAdminAction(socket, user, action, payload, true);
      socket.emit("admin_users", { users: list });
      return;
    }
    if (action === "GET_KPI") {
      const kpi = computeAdminKpi();
      socket.emit("admin_kpi", kpi);
      return;
    }
    if (action === "RESET_PASSWORD") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        if (targetUser.deleted) {
          deny("Tai khoan da bi xoa.");
          return;
        }
        const confirmCode = String(payload?.confirmCode || "");
        if (!confirmCode || confirmCode !== ADMIN_OWNER_CODE) {
          deny("Sai ma xac nhan.");
          return;
        }
        const nextPass = String(payload?.password || "").trim();
        const finalPass = nextPass ? nextPass : "12345";
        targetUser.password = hashPassword(finalPass);
        queueSaveUsers(targetUser);
        logUserEdit(user, target, "RESET_PASSWORD", { reset: true }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target, reset: true });
      });
      return;
    }
    if (action === "DELETE_USER") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      if (target === ADMIN_OWNER_USER) {
        deny("Khong the xoa tai khoan chu.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        const beforeDeleted = targetUser.deleted;
        targetUser.deleted = true;
        targetUser.locked = true;
        targetUser.isAdmin = false;
        targetUser.adminRole = "";
        clearRefreshToken(targetUser);
        queueSaveUsers(targetUser);
        const targetSocket = sockets[target];
        if (targetSocket) {
          targetSocket.emit("auth_required", { reason: "Tai khoan da bi xoa." });
          clearSession(targetSocket);
        }
        logUserEdit(user, target, "DELETE_USER", { before: beforeDeleted, after: true }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target, deleted: true });
      });
      return;
    }
    if (action === "RESTORE_USER") {
      const target = sanitizeUsername(payload?.target || payload?.username || "");
      if (!target || !users[target]) {
        deny("Khong tim thay nguoi dung.");
        return;
      }
      await withUserLock(target, async () => {
        const targetUser = users[target];
        if (!targetUser) {
          deny("Khong tim thay nguoi dung.");
          return;
        }
        const beforeDeleted = targetUser.deleted;
        targetUser.deleted = false;
        targetUser.locked = false;
        queueSaveUsers(targetUser);
        logUserEdit(user, target, "RESTORE_USER", { before: beforeDeleted, after: false }, socket);
        logAdminAction(socket, user, action, payload, true);
        socket.emit("admin_notice", { ok: true, target, restored: true });
      });
      return;
    }
    if (superOnly.has(action)) {
      const priceActions = new Set(["SET_PRICE", "ADJUST_PRICE", "CRASH", "PUMP_BTC", "FREEZE", "CALM", "VOL"]);
      if (priceActions.has(action)) {
        const symbol = String(payload?.symbol || "GLOBAL");
        const key = action === "SET_PRICE" || action === "ADJUST_PRICE" || action === "PUMP_BTC"
          ? symbol
          : "GLOBAL";
        const last = priceCooldowns.get(key) || 0;
        const now = Date.now();
        if (now - last < ADMIN_PRICE_COOLDOWN_MS) {
          deny("Dang cooldown thao tac gia.");
          return;
        }
        priceCooldowns.set(key, now);
        if (action === "SET_PRICE" || action === "ADJUST_PRICE") {
          const m = market[symbol];
          if (!m || !Number.isFinite(m.price) || m.price <= 0) {
            deny("Khong tim thay gia hien tai.");
            return;
          }
          let next = m.price;
          if (action === "SET_PRICE") {
            next = Number(payload?.price);
          } else {
            const percent = Number(payload?.percent);
            const amount = Number(payload?.amount);
            if (Number.isFinite(percent) && percent !== 0) {
              if (Math.abs(percent) > ADMIN_MAX_ADJUST_PCT) {
                deny("Vuot qua gioi han % dieu chinh.");
                return;
              }
              next = m.price * (1 + percent / 100);
            } else if (Number.isFinite(amount) && amount !== 0) {
              next = m.price + amount;
            }
          }
          if (!Number.isFinite(next) || next <= 0) {
            deny("Gia khong hop le.");
            return;
          }
          const deltaPct = Math.abs(next - m.price) / m.price * 100;
          if (deltaPct > ADMIN_MAX_PRICE_CHANGE_PCT) {
            deny("Vuot qua gioi han % thay doi gia.");
            return;
          }
        }
      }
      applyGodModeAction(action, payload);
      logAdminAction(socket, user, action, payload, true);
      if (action === "SET_CANDLE_BIAS") {
        emitMarketUpdateNow();
        socket.emit("admin_notice", {
          ok: true,
          candleBias: true,
          symbol: String(payload?.symbol || "").toUpperCase(),
          direction: String(payload?.direction || ""),
          all: !!payload?.all
        });
      }
      if (action === "SET_PRICE" || action === "ADJUST_PRICE" || action === "CRASH" || action === "PUMP_BTC") {
        emitSecurityAlert("admin_price", "Admin thay doi gia.", {
          admin: user.username,
          action,
          symbol: payload?.symbol,
          price: payload?.price,
          percent: payload?.percent
        });
      }
      if (action === "RESET_PASSWORD" || action === "DELETE_USER") {
        emitSecurityAlert("admin_sensitive", "Admin thao tac nhay cam.", {
          admin: user.username,
          action,
          target: payload?.target || payload?.username || ""
        });
      }
      return;
    }
    deny("Hanh dong khong hop le.");
  });

  socket.on("place_order", async (order) => {
    const sessionUser = requireUser(socket);
    if (!sessionUser) return;
    await withUserLock(sessionUser.username, async () => {
      const user = requireUser(socket);
      if (!user) return;
      if (settings.safeMode) {
        socket.emit("order_rejected", { clientId: order?.clientId, reason: "He thong dang o safe mode." });
        return;
      }
      if (settings.orderDisabled) {
        socket.emit("order_rejected", { clientId: order?.clientId, reason: "Dat lenh tam khoa." });
        return;
      }
      const idemKey = String(order?.clientId || "");
      const rejectOrder = (reason) => {
        const payload = { clientId: order?.clientId, reason };
        if (idemKey) setIdempotencyEntry(user.username, idemKey, "order_rejected", payload);
        socket.emit("order_rejected", payload);
      };
      if (!idemKey) {
        socket.emit("order_rejected", { clientId: order?.clientId, reason: "Thieu ma idempotency." });
        return;
      }
      const cached = getIdempotencyEntry(user.username, idemKey);
      if (cached) {
        socket.emit(cached.event, cached.payload);
        return;
      }
      if (!rateLimit(`order:${user.username}`, ORDER_RATE_MAX, ORDER_RATE_WINDOW_MS)) {
        const entry = getRateEntry(`order:${user.username}`);
        recordOrderSpam(user.username, "rate_limit");
        emitSecurityAlert("order_spam", "Order spam.", {
          username: user.username,
          ip: getSocketIp(socket),
          count: entry?.count || 0
        });
        addStrike(user, "order_spam", socket);
        rejectOrder("Ban thao tac qua nhanh.");
        return;
      }
      try {
        const limits = getUserLimits(user);
        const feeRate = getFeeRateForUser(user);
        const seq = Number(order?.seq);
        if (!Number.isFinite(seq) || seq <= user.orderSeq) {
          recordOrderSpam(user.username, "bad_seq");
          rejectOrder("Seq khong hop le.");
          return;
        }
        if (!order || !order.symbol || !Number.isFinite(order.qty) || order.qty <= 0 || order.qty > MAX_ORDER_QTY) {
          recordOrderSpam(user.username, "bad_qty");
          rejectOrder("Lenh khong hop le.");
          return;
        }
        const coin = coins.find((c) => c.symbol === order.symbol);
        if (!coin) {
          rejectOrder("Coin khong ton tai.");
          return;
        }
        if (!isCoinVisible(coin.symbol)) {
          rejectOrder("Coin tam an hoac dang bi an.");
          return;
        }
        const coinLimit = getCoinLimit(coin.symbol);
        if (Number.isFinite(coinLimit.minQty) && order.qty < coinLimit.minQty) {
          rejectOrder("So luong nho hon toi thieu.");
          return;
        }
        if (Number.isFinite(coinLimit.maxQty) && order.qty > coinLimit.maxQty) {
          rejectOrder("So luong vuot toi da.");
          return;
        }
        if (!hasValidPrecision(order.qty, Number(coinLimit.precision))) {
          rejectOrder("So luong vuot qua precision.");
          return;
        }

        const leverage = Math.max(1, parseInt(order.leverage, 10) || 1);
        if (!settings.marginEnabled && leverage > 1) {
          rejectOrder("Margin dang bi khoa.");
          return;
        }
        if (leverage > limits.maxLeverage) {
          rejectOrder("Vuot qua don bay toi da.");
          return;
        }
        const side = order.side === "sell" ? "sell" : "buy";
        const type = order.type === "limit" ? "limit" : "market";
        let price = type === "limit" && Number.isFinite(order.priceUsd)
          ? order.priceUsd
          : market[order.symbol].price;
        const quote = order.quote === "VND" ? "VND" : "USD";
        const meta = marketMeta[order.symbol] || {};
        if (settings.blockStalePrice && meta.lastLive && Date.now() - meta.lastLive > LIVE_STALE_MS) {
          rejectOrder("Gia live stale, vui long doi.");
          return;
        }
        if (type === "market") {
          const slippage = Math.max(0, Number(settings.slippagePct) || 0) / 100;
          if (Number.isFinite(slippage) && slippage > 0) {
            const basePrice = market[order.symbol]?.price || price;
            price = side === "buy" ? basePrice * (1 + slippage) : basePrice * (1 - slippage);
          }
        }

        const marketPrice = market[order.symbol]?.price || price;
        if (marketPrice > 0) {
          const diffPct = Math.abs(price - marketPrice) / marketPrice;
          if (diffPct > 0.05) {
            rejectOrder("Gia lenh lech qua 5%.");
            return;
          }
        }

        const notionalUsd = price * order.qty;
        if (!Number.isFinite(notionalUsd) || notionalUsd <= 0 || notionalUsd > limits.maxNotionalUsd) {
          rejectOrder("Gia tri lenh qua lon.");
          return;
        }
        const notionalQuote = toQuote(notionalUsd, quote);
        const totalQuote = leverage === 1 ? notionalQuote : notionalQuote / leverage;
        const feeQuote = totalQuote * feeRate;
        if (type === "limit" && user.openOrders.length >= limits.maxOpenOrders) {
          rejectOrder("Vuot qua so lenh cho.");
          return;
        }
        if (leverage > 1 && user.positions.length >= limits.maxPositions) {
          rejectOrder("Vuot qua so vi the.");
          return;
        }

        if (side === "buy") {
          const balance = quote === "USD" ? user.usd : user.vnd;
          if (balance < totalQuote + feeQuote) {
            rejectOrder("So du khong du.");
            return;
          }
          if (type === "market") {
            addBalance(user, quote, -(totalQuote + feeQuote));
            if (leverage === 1) {
              user.holdings[order.symbol] += order.qty;
              const oldQty = user.holdings[order.symbol] - order.qty;
              const oldAvg = user.costBasis[order.symbol] || 0;
              const newAvg = ((oldQty * oldAvg) + order.qty * price) / (oldQty + order.qty);
              user.costBasis[order.symbol] = newAvg;
              if (!user.holdingStart[order.symbol]) user.holdingStart[order.symbol] = Date.now();
            } else {
              user.positions.push({
                id: Date.now() + Math.random(),
                userId: user.username,
                symbol: order.symbol,
                side: "buy",
                qty: order.qty,
                entry: price,
                leverage,
                marginUsd: notionalUsd / leverage,
                quote
              });
            }
            if (order.stopInput || order.takeInput || order.trailPct) {
              user.protections.push({
                id: Date.now() + Math.random(),
                symbol: order.symbol,
                qty: order.qty,
                side: "buy",
                leverage,
                quote,
                stop: order.stopInput || null,
                take: order.takeInput || null,
                trailPct: order.trailPct || 0,
                trailHigh: price,
                trailLow: null
              });
            }
            recordTrade(user, { symbol: order.symbol, side: "buy", price, qty: order.qty, pnlUsd: 0, leverage, quote });
            user.orderSeq = seq;
            await queueSaveUsers(user);
            const okPayload = { clientId: order.clientId, order, filledPrice: price };
            setIdempotencyEntry(user.username, idemKey, "order_accepted", okPayload);
            socket.emit("order_accepted", okPayload);
            emitAccount(socket, user);
            return;
          }

          addBalance(user, quote, -(totalQuote + feeQuote));
          user.openOrders.push({
            id: Date.now() + Math.random(),
            userId: user.username,
            clientId: order.clientId,
            seq,
            side,
            type,
            symbol: order.symbol,
            priceUsd: price,
            qty: order.qty,
            quote,
            leverage,
            stopInput: order.stopInput,
            takeInput: order.takeInput,
            trailPct: order.trailPct,
            locked: totalQuote + feeQuote
          });
          user.orderSeq = seq;
          await queueSaveUsers(user);
          const okPayload = { clientId: order.clientId, order, filledPrice: price };
          setIdempotencyEntry(user.username, idemKey, "order_accepted", okPayload);
          socket.emit("order_accepted", okPayload);
          emitAccount(socket, user);
        } else {
          if (leverage === 1) {
            if ((user.holdings[order.symbol] || 0) < order.qty) {
              rejectOrder("Khong du coin de ban.");
              return;
            }
          } else {
            const balance = quote === "USD" ? user.usd : user.vnd;
            if (balance < totalQuote + feeQuote) {
              rejectOrder("So du khong du.");
              return;
            }
          }

          if (type === "market") {
            if (leverage === 1) {
              const receive = totalQuote - feeQuote;
              const avg = Number(user.costBasis[order.symbol]) || 0;
              addBalance(user, quote, receive);
              user.holdings[order.symbol] -= order.qty;
              if (user.holdings[order.symbol] <= 0) {
                user.costBasis[order.symbol] = 0;
                user.holdingStart[order.symbol] = null;
              }
              const pnlUsd = (price - avg) * order.qty - Math.abs(price * order.qty * feeRate);
              recordTrade(user, { symbol: order.symbol, side: "sell", price, qty: order.qty, pnlUsd, leverage, quote });
            } else {
              addBalance(user, quote, -(totalQuote + feeQuote));
              user.positions.push({
                id: Date.now() + Math.random(),
                userId: user.username,
                symbol: order.symbol,
                side: "sell",
                qty: order.qty,
                entry: price,
                leverage,
                marginUsd: notionalUsd / leverage,
                quote
              });
              recordTrade(user, { symbol: order.symbol, side: "sell", price, qty: order.qty, pnlUsd: 0, leverage, quote });
            }
            if (order.stopInput || order.takeInput || order.trailPct) {
              user.protections.push({
                id: Date.now() + Math.random(),
                symbol: order.symbol,
                qty: order.qty,
                side: "sell",
                leverage,
                quote,
                stop: order.stopInput || null,
                take: order.takeInput || null,
                trailPct: order.trailPct || 0,
                trailHigh: null,
                trailLow: price
              });
            }
            user.orderSeq = seq;
            await queueSaveUsers(user);
            const okPayload = { clientId: order.clientId, order, filledPrice: price };
            setIdempotencyEntry(user.username, idemKey, "order_accepted", okPayload);
            socket.emit("order_accepted", okPayload);
            emitAccount(socket, user);
            return;
          }

          if (leverage === 1) {
            user.holdings[order.symbol] -= order.qty;
          } else {
            addBalance(user, quote, -(totalQuote + feeQuote));
          }
          user.openOrders.push({
            id: Date.now() + Math.random(),
            userId: user.username,
            clientId: order.clientId,
            seq,
            side,
            type,
            symbol: order.symbol,
            priceUsd: price,
            qty: order.qty,
            quote,
            leverage,
            stopInput: order.stopInput,
            takeInput: order.takeInput,
            trailPct: order.trailPct,
            locked: leverage === 1 ? order.qty : totalQuote + feeQuote
          });
          user.orderSeq = seq;
          await queueSaveUsers(user);
          const okPayload = { clientId: order.clientId, order, filledPrice: price };
          setIdempotencyEntry(user.username, idemKey, "order_accepted", okPayload);
          socket.emit("order_accepted", okPayload);
          emitAccount(socket, user);
        }
      } catch (err) {
        rejectOrder("Loi xu ly lenh.");
      }
    });
  });

  socket.on("buy_booster", async (payload) => {
    const sessionUser = requireUser(socket);
    if (!sessionUser) return;
    await withUserLock(sessionUser.username, async () => {
      const user = requireUser(socket);
      if (!user) return;
      const id = String(payload?.id || "").trim();
      const item = BOOSTER_CATALOG[id];
      if (!item) {
        socket.emit("buy_booster_error", { reason: "Booster không hợp lệ." });
        return;
      }
      const priceUsd = Number(item.priceUsd) || 0;
      if (priceUsd <= 0) {
        socket.emit("buy_booster_error", { reason: "Giá booster không hợp lệ." });
        return;
      }
      const quote = String(payload?.quote || "USD").toUpperCase();
      const cost = quote === "USD" ? priceUsd : priceUsd * FX_RATE;
      const balance = quote === "USD" ? user.usd : user.vnd;
      if (balance < cost) {
        socket.emit("buy_booster_error", { reason: "Không đủ số dư." });
        return;
      }
      addBalance(user, quote, -cost);
      user.boosters = user.boosters || { insurance: 0, anonymity: 0 };
      if (id === "insurance") user.boosters.insurance += 1;
      if (id === "anonymity") user.boosters.anonymity += 1;
      await queueSaveUsers(user);
      emitAccount(socket, user);
      socket.emit("buy_booster_ok", { id });
    });
  });

  socket.on("spin_status", async () => {
    const user = requireUser(socket);
    if (!user) return;
    try {
      const status = await getSpinStatus(user);
      socket.emit("spin_status", status);
    } catch (err) {
      socket.emit("spin_error", { reason: "Không thể lấy trạng thái quay." });
    }
  });

  socket.on("spin_wheel", async () => {
    const sessionUser = requireUser(socket);
    if (!sessionUser) return;
    await withUserLock(sessionUser.username, async () => {
      const user = requireUser(socket);
      if (!user) return;
      const status = await getSpinStatus(user);
      if (!status.eligible) {
        socket.emit("spin_error", { reason: status.reason || "Chưa đủ điều kiện." });
        socket.emit("spin_status", status);
        return;
      }
      const todayKey = getDateKey();
      const { index, reward } = rollSpinReward();
      let granted = null;
      if (reward.type === "usd") {
        addBalance(user, "USD", reward.amount);
        granted = { type: "usd", amount: reward.amount, label: reward.label };
      } else if (reward.type === "item" && reward.item) {
        const item = addInventoryItem(user, reward.item);
        granted = { type: "item", item, label: reward.label };
      }
      user.spinLastDate = todayKey;
      await queueSaveUsers(user);
      emitAccount(socket, user);
      socket.emit("spin_result", { index, reward: granted });
      socket.emit("spin_status", await getSpinStatus(user));
    });
  });

  socket.on("cancel_order", async (orderId) => {
    const sessionUser = requireUser(socket);
    if (!sessionUser) return;
    await withUserLock(sessionUser.username, async () => {
      const user = requireUser(socket);
      if (!user) return;
      const orderIndex = user.openOrders.findIndex((o) => o.id === orderId);
      if (orderIndex === -1) return;
      const order = user.openOrders[orderIndex];
      const limits = getUserLimits(user);
      const spamStat = recordCancelSpam(user.username);
      if (spamStat && spamStat.count >= limits.cancelSpamThreshold) {
        const price = market[order.symbol]?.price || order.priceUsd || 0;
        let penaltyQuote = 0;
        if (order.side === "sell" && order.leverage === 1) {
          penaltyQuote = price * (order.locked || 0) * limits.cancelPenaltyRate;
        } else {
          penaltyQuote = (order.locked || 0) * limits.cancelPenaltyRate;
        }
        if (penaltyQuote > 0) {
          addBalance(user, order.quote, -penaltyQuote);
        }
        emitSecurityAlert("cancel_spam", "Huy lenh qua nhieu.", {
          username: user.username,
          count: spamStat.count
        });
        addStrike(user, "cancel_spam", socket);
      }
      if (order.side === "buy") {
        addBalance(user, order.quote, order.locked);
      } else {
        if (order.leverage === 1) {
          user.holdings[order.symbol] += order.locked;
          if (!user.holdingStart[order.symbol]) user.holdingStart[order.symbol] = Date.now();
        } else {
          addBalance(user, order.quote, order.locked);
        }
      }
      user.openOrders.splice(orderIndex, 1);
      await queueSaveUsers(user);
      emitAccount(socket, user);
    });
  });

  socket.on("claim_mail", async (payload) => {
    const sessionUser = requireUser(socket);
    if (!sessionUser) return;
    await withUserLock(sessionUser.username, async () => {
      const user = requireUser(socket);
      if (!user) return;
      const id = String(payload?.id || "").trim();
      if (!id) return;
      const inbox = Array.isArray(user.inbox) ? user.inbox : [];
      const mail = inbox.find((m) => m && m.id === id);
      if (!mail || mail.claimedAt) return;
      applyMailReward(user, mail.reward, mail.items);
      mail.claimedAt = Date.now();
      await queueSaveUsers(user);
      emitAccount(socket, user);
      socket.emit("mail_claimed", { id });
    });
  });

  socket.on("use_item", async (payload) => {
    const sessionUser = requireUser(socket);
    if (!sessionUser) return;
    await withUserLock(sessionUser.username, async () => {
      const user = requireUser(socket);
      if (!user) return;
      const id = String(payload?.id || "").trim();
      if (!id) return;
      const inventory = Array.isArray(user.inventory) ? user.inventory : [];
      const idx = inventory.findIndex((it) => it && it.id === id);
      if (idx === -1) return;
      const item = inventory[idx];
      const type = String(item.type || "buff");
      if (type === "boost_insurance") {
        user.boosters = user.boosters || { insurance: 0, anonymity: 0 };
        user.boosters.insurance += 1;
      } else if (type === "boost_anonymity") {
        user.boosters = user.boosters || { insurance: 0, anonymity: 0 };
        user.boosters.anonymity += 1;
      } else {
        if (!Array.isArray(user.activeBuffs)) user.activeBuffs = [];
        const now = Date.now();
        const durationMs = Number(item.durationMs) || 0;
        user.activeBuffs.unshift({
          id: item.id,
          name: item.name,
          desc: item.desc || "",
          effect: item.effect || "",
          activeAt: now,
          activeUntil: durationMs ? now + durationMs : 0
        });
      }
      inventory.splice(idx, 1);
      user.inventory = inventory;
      await queueSaveUsers(user);
      emitAccount(socket, user);
      socket.emit("item_used", { id });
    });
  });

  socket.on("close_position", async (payload) => {
    const sessionUser = requireUser(socket);
    if (!sessionUser || !payload) return;
    await withUserLock(sessionUser.username, async () => {
      const user = requireUser(socket);
      if (!user || !payload) return;
      let symbol = payload.symbol;
      let side = payload.side;
      let leverage = payload.leverage;
      let qty = payload.qty;
      let quote = payload.quote;

      if (payload.id || payload.positionId) {
        const lookupId = payload.id || payload.positionId;
        const pos = user.positions.find((p) => p.id === lookupId);
        if (pos) {
          symbol = pos.symbol;
          side = pos.side;
          leverage = pos.leverage;
          quote = pos.quote;
          qty = payload.qty || pos.qty;
        }
      }

      if (!symbol) return;
      const price = market[symbol]?.price;
      if (!price) return;
      const equityBefore = calcUserEquityUsd(user);
      const result = {};
      const success = closePositionInternal(user, symbol, side, leverage, price, qty, quote, result);
      if (success) {
        await queueSaveUsers(user);
        emitAccount(socket, user);
        const pnlUsd = Number(result.pnlUsd) || 0;
        if (pnlUsd > 0 && equityBefore > 0) {
          const pct = pnlUsd / equityBefore;
          if (pct >= 0.05) {
            socket.emit("big_win", {
              pnlUsd,
              pct,
              symbol: result.symbol || symbol
            });
          }
        }
      }
    });
  });

  socket.on("logout", async () => {
    const user = getSessionUser(socket);
    if (user) {
      clearRefreshToken(user);
      await queueSaveUsers(user);
    }
    clearSession(socket);
  });

  socket.on("disconnect", () => {
    clearSession(socket);
  });
});

async function bootstrap() {
  loadSettings();
  scheduleMaintenanceJobs();
  await loadUsersFromDisk();
  queueSaveUsers();

  let binanceSet = new Set();
  try {
    binanceSet = await loadBinanceSymbols();
  } catch (err) {
    console.error("Failed to load Binance symbols.", err?.message || err);
  }

  try {
    const topCoins = await loadTopCoins();
    if (topCoins.length) {
      coins = topCoins.map((coin) => {
        const sym = normalizeSymbol(coin.symbol);
        return {
          ...coin,
          symbol: sym,
          binanceSymbol: binanceSet.has(sym) ? `${sym}USDT` : null
        };
      });
    }
  } catch (err) {
    console.error("Failed to load live coin list, using fallback list.", err?.message || err);
  }

  // Nếu load API thất bại hoặc trả về ít hơn 5 coin, dùng luôn baseCoins giả lập
  if (!coins || coins.length < 5) {
    console.log("API CoinGecko/Binance lỗi hoặc không có dữ liệu. Sử dụng coin giả lập.");
    coins = [...baseCoins];
  }

  coins = coins.map((coin) => {
    const sym = normalizeSymbol(coin.symbol);
    const icon = coin.icon
      || coin.image
      || (sym ? `https://assets.coincap.io/assets/icons/${sym.toLowerCase()}@2x.png` : null);
    return {
      ...coin,
      symbol: sym,
      binanceSymbol: coin.binanceSymbol || (binanceSet.has(sym) ? `${sym}USDT` : null),
      icon
    };
  });
  if (Array.isArray(settings.customCoins)) {
    settings.customCoins.forEach((coin) => {
      if (!coin || !coin.symbol) return;
      const sym = normalizeSymbol(coin.symbol);
      if (coins.find((c) => c.symbol === sym)) return;
      coins.push({
        symbol: sym,
        name: coin.name || sym,
        base: Number.isFinite(coin.base) ? coin.base : 1,
        vol: Number.isFinite(coin.vol) ? coin.vol : 0.003,
        binanceSymbol: null,
        icon: coin.icon || null
      });
    });
  }
  if (Array.isArray(settings.removedCoins) && settings.removedCoins.length) {
    const removed = new Set(settings.removedCoins.map((s) => normalizeSymbol(s)));
    coins = coins.filter((coin) => !removed.has(coin.symbol));
  }

  initMarket();
  Object.keys(users).forEach((username) => {
    users[username] = normalizeUser(users[username], username);
    syncUserCoins(users[username]);
  });
  if (Object.keys(users).length) queueSaveUsers();

  const safeInterval = (fn, ms) => {
    setInterval(() => fn().catch((err) => console.error(err?.message || err)), ms);
  };

  refreshBinancePrices().catch(() => {});
  refreshBinanceStats().catch(() => {});
  refreshCoingeckoMarkets().catch(() => {});

  safeInterval(refreshBinancePrices, 10000);
  safeInterval(refreshBinanceStats, 60000);
  safeInterval(refreshCoingeckoMarkets, 60000);
  safeInterval(tickMarket, 1000);

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

bootstrap();
