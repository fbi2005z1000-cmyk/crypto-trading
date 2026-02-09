const FX_RATE = 24500;
const BASE_FEE_RATE = 0.001;
const FUNDING_RATE = 0.0001;
const FUNDING_INTERVAL_MS = 60000;
const MAINTENANCE_RATE = 0.5;
const FEE_TIERS = [
  { volume: 0, discount: 0 },
  { volume: 50000, discount: 0.05 },
  { volume: 200000, discount: 0.1 },
  { volume: 1000000, discount: 0.18 }
];
const MAX_ORDER_QTY = 1e8;
const MAX_NOTIONAL_USD = 5e7;
const TOAST_MUTE_KEY = "cta_toast_mute_until";

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

const coingeckoIds = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  TRX: "tron",
  TON: "toncoin",
  DOT: "polkadot",
  AVAX: "avalanche-2",
  SHIB: "shiba-inu",
  MATIC: "polygon",
  LINK: "chainlink",
  LTC: "litecoin",
  ATOM: "cosmos",
  XLM: "stellar",
  NEAR: "near",
  ICP: "internet-computer",
  APT: "aptos",
  ARB: "arbitrum",
  OP: "optimism",
  SUI: "sui",
  INJ: "injective-protocol",
  RUNE: "thorchain",
  FTM: "fantom",
  GRT: "the-graph",
  AAVE: "aave",
  ETC: "ethereum-classic",
  FIL: "filecoin",
  HBAR: "hedera-hashgraph",
  UNI: "uniswap",
  VET: "vechain",
  MKR: "maker",
  LDO: "lido-dao",
  KAS: "kaspa",
  TIA: "celestia",
  IMX: "immutable-x",
  SEI: "sei-network",
  XMR: "monero",
  ALGO: "algorand",
  FLOW: "flow",
  KAVA: "kava",
  RPL: "rocket-pool",
  SAND: "the-sandbox",
  MANA: "decentraland",
  APE: "apecoin",
  DYDX: "dydx",
  SNX: "synthetix",
  CRV: "curve-dao-token",
  GMX: "gmx",
  YFI: "yearn-finance",
  COMP: "compound-governance-token",
  ZEC: "zcash",
  NEO: "neo",
  EOS: "eos",
  IOTA: "iota",
  KSM: "kusama",
  WAVES: "waves",
  ZIL: "zilliqa",
  ENJ: "enjincoin",
  "1INCH": "1inch",
  MINA: "mina-protocol",
  CFX: "conflux-token",
  ROSE: "oasis-network",
  GALA: "gala",
  CHZ: "chiliz",
  BLUR: "blur",
  JASMY: "jasmycoin",
  PEPE: "pepe"
};

let coins = [...baseCoins];
const clientId = (() => {
  try {
    const keyNew = "crypto_user_id";
    const keyLegacy = "cta_client_id";
    let id = localStorage.getItem(keyNew) || localStorage.getItem(keyLegacy);
    if (!id) {
      id = (crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    }
    localStorage.setItem(keyNew, id);
    localStorage.setItem(keyLegacy, id);
    return id;
  } catch {
    return `${Date.now()}-${Math.random()}`;
  }
})();
// FIX: Kiểm tra xem io có tồn tại không trước khi gọi
let socket = null;
try {
  if (typeof io !== "undefined") {
    socket = io({
      path: "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true
    });
  } else {
    console.warn("Socket.io không tìm thấy - Chạy chế độ Offline");
  }
} catch (e) {
  console.error("Lỗi kết nối Socket:", e);
}
const pendingOrders = new Map();
const adminState = {
  authed: false,
  pending: null,
  revealed: false,
  comboStart: 0,
  gCount: 0,
  role: "",
  settings: {}
};
let adminKpiTimer = null;
let broadcastTimerId = null;
let broadcastHideTimer = null;
const ADMIN_OWNER_USER = "admincta1009";
const ADMIN_SPAM_KEY = "g";
const ADMIN_SPAM_COUNT = 20;
const ADMIN_WINDOW_MS = 5000;
const socketState = { connected: false, offline: false };

const state = {
  quote: "USD",
  selected: "BTC",
  side: "buy",
  leverage: 1,
  usd: 10000,
  vnd: 200000000,
  tradeVolumeUsd: 0,
  holdings: {},
  costBasis: {},
  holdingStart: {},
  favorites: new Set(),
  market: {},
  trades: [],
  openOrders: [],
  positions: [],
  protections: [],
  liveSymbols: new Set(),
  indicators: {
    ma14: true,
    ma50: false,
    rsi: false,
    bb: false,
    macd: false,
    ema9: false,
    ema21: false,
    ma200: false
  },
  volBoosts: {},
  newsItems: [],
  macro: {
    blackSwan: null,
    pumpGroup: null,
    calendarFired: {}
  },
  funding: { lastTs: Date.now() },
  career: { level: 1, xp: 0, maxLeverage: 50, feeDiscount: 0, unlocks: [] },
  boosters: { insurance: 0, anonymity: 0 },
  inbox: [],
  inventory: [],
  activeBuffs: [],
  chartLayout: 1,
  chartSlots: [],
  copyBotId: null,
  botStates: {},
  botLastRun: 0,
  sentimentHistory: [],
  achievements: new Set(),
  lessonHistory: [],
  recentPnl: [],
  lossStreak: 0,
  risk: { maxLeverage: null, limitUntil: 0, cooldownUntil: 0, restUntil: 0 },
  marketRegime: { mode: "sideway", until: 0 },
  depthBooks: {},
  chartPoints: 120,
  equityHistory: [],
  leaderboard: [],
  weeklyLeaderboard: [],
  marketFromServer: false,
  marketCollapsed: false,
  quickLetter: "",
  mailFilter: "all",
  muteUntil: 0,
  perfMode: false,
  compactMode: false,
  focusMode: false,
  tipAudioEnabled: true,
  practice: { active: false, remaining: 0, sl: false, tp: false, order: false },
  lastOrderMeta: { hasSLTP: false, leverage: 1, qty: 0, notional: 0 },
  crosshair: { active: false, slot: -1, x: 0, y: 0, price: 0, candle: null }
};

let currentUser = null;
let adminUsers = [];
let adminLogRaw = [];
let orderNoteDefault = "";
let adminModalState = { resolve: null };
let orderWarnState = { resolve: null };
let restTimerId = 0;
let mailReadMap = {};
let todayAssist = { viewChart: false, demoOrder: false, sampleSLTP: false };
let assistTimerId = 0;
let assistRemaining = 0;
const AUTH_USER_KEY = "cta_auth_user";
const AUTH_REFRESH_KEY = "cta_auth_refresh";
const AUTH_REMEMBER_KEY = "cta_auth_remember";
const ONBOARDING_KEY = "cta_onboarding_v1";
const MAIL_READ_KEY = "cta_mail_read_v1";
const TODAY_ASSIST_KEY_PREFIX = "cta_today_assist_";
const LESSON_HISTORY_KEY = "cta_lesson_history_v1";
const TIP_AUDIO_KEY = "cta_tip_audio_v1";
const TIP_QUIZ_KEY_PREFIX = "cta_tip_quiz_";
const FOCUS_MODE_KEY = "cta_focus_mode_v1";
const PRACTICE_DURATION_SEC = 180;
const REST_SUGGEST_MS = 15 * 60 * 1000;
const MOBILE_BREAKPOINT = 900;
const CHART_MIN_VISIBLE = 20;
const CHART_MAX_VISIBLE = 600;
const CHART_ZOOM_MIN = 0.35;
const CHART_ZOOM_MAX = 4;
const TV_BAR_SPACING_MIN = 2;
const TV_BAR_SPACING_MAX = 28;
const CHART_PAN_THRESHOLD = 8;
const DAILY_CHECKIN_PREFIX = "cta_daily_checkin_";
const PREDICT_COOLDOWN_MS = 30000;
let predictLock = false;
let predictCooldownUntil = 0;
let lastCareerLevel = null;
const WEEKLY_LEADERBOARD_PREFIX = "cta_weekly_leaderboard_";
const DAILY_TIP_KEY = "cta_daily_tip_v1";
const BULL_BEAR_COUNT_PREFIX = "cta_bullbear_counts_";
const BULL_BEAR_VOTE_PREFIX = "cta_bullbear_vote_";
const BULL_BEAR_XP = 15;
const UNDO_WINDOW_MS = 6000;
let undoState = null;
const SPIN_TRADE_REQUIRED = 10;
const SPIN_SEGMENTS = 3;
const SPIN_FULL_ROTATIONS = 4;
let spinRotation = 0;
let spinLock = false;
let spinState = {
  eligible: false,
  spunToday: false,
  tradeCount: 0,
  remaining: 0,
  loginToday: false,
  reason: ""
};

function setAuthState(username) {
  currentUser = username || null;
  if (!currentUser) {
    adminState.revealed = false;
    resetAdminCombo();
    setAdminCodeVisible(false);
    state.inbox = [];
    state.inventory = [];
    state.activeBuffs = [];
    spinState = {
      eligible: false,
      spunToday: false,
      tradeCount: 0,
      remaining: 0,
      loginToday: false,
      reason: ""
    };
    spinLock = false;
    spinRotation = 0;
    if (els.spinWheel) els.spinWheel.style.transform = "rotate(0deg)";
    updateMailBadge();
    updateUserRank();
    if (els.mailOverlay) {
      els.mailOverlay.classList.remove("show");
      els.mailOverlay.classList.add("hidden");
    }
  }
  if (els.authOverlay) {
    els.authOverlay.classList.toggle("hidden", !!currentUser);
  }
  if (els.orderPanel) {
    els.orderPanel.classList.toggle("locked", !currentUser);
  }
  if (els.logoutBtn) {
    els.logoutBtn.classList.toggle("hidden", !currentUser);
  }
  if (els.logoutOverlay && !currentUser) {
    els.logoutOverlay.classList.add("hidden");
  }
  if (!currentUser) {
    setAdminUI();
    setTimeout(startOnboarding, 50);
  } else {
    endOnboarding();
  }
  renderDailyCheckin();
  renderBullBearPoll();
  requestSpinStatus();
}

function getStoredAuth() {
  try {
    const remember = localStorage.getItem(AUTH_REMEMBER_KEY) === "1";
    if (!remember) return null;
    const username = localStorage.getItem(AUTH_USER_KEY) || "";
    const refreshToken = localStorage.getItem(AUTH_REFRESH_KEY) || "";
    if (!username || !refreshToken) return null;
    return { username, refreshToken };
  } catch {
    return null;
  }
}

function storeAuth(username, refreshToken) {
  try {
    localStorage.setItem(AUTH_USER_KEY, username);
    localStorage.setItem(AUTH_REFRESH_KEY, refreshToken);
  } catch {
    // ignore
  }
}

function clearAuth() {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_REFRESH_KEY);
    localStorage.removeItem(AUTH_REMEMBER_KEY);
  } catch {
    // ignore
  }
}

function setRemember(value) {
  try {
    localStorage.setItem(AUTH_REMEMBER_KEY, value ? "1" : "0");
  } catch {
    // ignore
  }
}

function getRemember() {
  try {
    return localStorage.getItem(AUTH_REMEMBER_KEY) === "1";
  } catch {
    return false;
  }
}

function getDateKey(ts = Date.now()) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getYesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getDateKey(d.getTime());
}

function getWeekId(ts = Date.now()) {
  const date = new Date(ts);
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
  return `${temp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function getDailyKey(username, suffix) {
  const safe = username || "guest";
  return `${DAILY_CHECKIN_PREFIX}${safe}_${suffix}`;
}

function loadDailyState(username) {
  try {
    const lastDate = localStorage.getItem(getDailyKey(username, "date")) || "";
    const streak = parseInt(localStorage.getItem(getDailyKey(username, "streak")) || "0", 10) || 0;
    return { lastDate, streak };
  } catch {
    return { lastDate: "", streak: 0 };
  }
}

function saveDailyState(username, lastDate, streak) {
  try {
    localStorage.setItem(getDailyKey(username, "date"), lastDate || "");
    localStorage.setItem(getDailyKey(username, "streak"), String(streak || 0));
  } catch {
    // ignore
  }
}

function renderDailyCheckin() {
  if (!els.dailyCheckin) return;
  if (!currentUser) {
    if (els.dailyCheckinSub) els.dailyCheckinSub.textContent = "Đăng nhập để điểm danh.";
    if (els.dailyStreakBadge) els.dailyStreakBadge.textContent = "0 ngày";
    if (els.dailyNextTime) els.dailyNextTime.textContent = "";
    if (els.dailyCheckinBtn) {
      els.dailyCheckinBtn.textContent = "Nhận thưởng";
      els.dailyCheckinBtn.disabled = true;
    }
    return;
  }
  const today = getDateKey();
  const yesterday = getYesterdayKey();
  const { lastDate, streak } = loadDailyState(currentUser);
  const claimed = lastDate === today;
  if (els.dailyStreakBadge) els.dailyStreakBadge.textContent = `${streak} ngày`;
  if (els.dailyCheckinSub) {
    els.dailyCheckinSub.textContent = `Chuỗi hiện tại: ${streak} ngày`;
  }
  if (els.dailyCheckinBtn) {
    els.dailyCheckinBtn.textContent = claimed ? "Đã nhận" : "Nhận thưởng";
    els.dailyCheckinBtn.disabled = claimed;
  }
  if (els.dailyNextTime) {
    if (claimed) {
      els.dailyNextTime.textContent = "Quay lại vào ngày mai để tiếp tục chuỗi.";
    } else if (lastDate && lastDate !== yesterday) {
      els.dailyNextTime.textContent = "Chuỗi sẽ bị reset nếu bỏ lỡ ngày hôm nay.";
    } else {
      els.dailyNextTime.textContent = "";
    }
  }
}

function claimDailyCheckin() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để điểm danh.");
    return;
  }
  const today = getDateKey();
  const yesterday = getYesterdayKey();
  const { lastDate, streak } = loadDailyState(currentUser);
  if (lastDate === today) {
    showToast("Bạn đã nhận điểm danh hôm nay.");
    return;
  }
  const nextStreak = lastDate === yesterday ? streak + 1 : 1;
  saveDailyState(currentUser, today, nextStreak);
  const reward = Math.min(120, 20 + nextStreak * 5);
  addXp(reward);
  showToast(`Điểm danh thành công! +${reward} XP (Chuỗi ${nextStreak} ngày)`);
  renderDailyCheckin();
}

function renderSpinStatus() {
  if (!els.spinCard) return;
  if (!currentUser) {
    if (els.spinStatus) els.spinStatus.textContent = "Đăng nhập để quay.";
    if (els.spinNote) els.spinNote.textContent = "";
    if (els.spinBtn) els.spinBtn.disabled = true;
    return;
  }
  if (spinState.spunToday) {
    if (els.spinStatus) els.spinStatus.textContent = "Hôm nay bạn đã quay.";
    if (els.spinNote) els.spinNote.textContent = "Quay lại vào ngày mai nhé.";
    if (els.spinBtn) els.spinBtn.disabled = true;
    return;
  }
  if (spinState.eligible) {
    if (els.spinStatus) els.spinStatus.textContent = "Đủ điều kiện quay!";
    if (els.spinNote) {
      const count = Number.isFinite(spinState.tradeCount) ? spinState.tradeCount : 0;
      els.spinNote.textContent = `Lệnh hôm nay: ${count}/${SPIN_TRADE_REQUIRED}.`;
    }
    if (els.spinBtn) els.spinBtn.disabled = !!spinLock;
    return;
  }
  const remaining = Number.isFinite(spinState.remaining) ? spinState.remaining : SPIN_TRADE_REQUIRED;
  if (els.spinStatus) els.spinStatus.textContent = "Chưa đủ điều kiện.";
  if (els.spinNote) els.spinNote.textContent = `Cần thêm ${remaining} lệnh để quay.`;
  if (els.spinBtn) els.spinBtn.disabled = true;
}

function requestSpinStatus() {
  if (!socket || !currentUser) {
    renderSpinStatus();
    return;
  }
  socket.emit("spin_status");
}

function spinToSegment(index) {
  if (!els.spinWheel) return;
  const segmentAngle = 360 / SPIN_SEGMENTS;
  const target = 360 - (index * segmentAngle + segmentAngle / 2);
  const current = ((spinRotation % 360) + 360) % 360;
  const delta = (target - current + 360) % 360;
  spinRotation = spinRotation + SPIN_FULL_ROTATIONS * 360 + delta;
  els.spinWheel.style.transform = `rotate(${spinRotation}deg)`;
}

function formatSpinReward(reward) {
  if (!reward) return "Phần thưởng đã nhận.";
  if (reward.type === "usd") return `+${formatUSD(reward.amount || 0)}`;
  if (reward.type === "item") return reward?.item?.name || "Vật phẩm đặc biệt";
  return "Phần thưởng đã nhận.";
}

function renderPredictStatus(text, type = "") {
  if (els.predictStatus) els.predictStatus.textContent = text || "Sẵn sàng";
  if (els.predictResult) {
    els.predictResult.textContent = type ? type : "";
  }
}

function updatePredictButtons(enabled) {
  if (els.predictUpBtn) els.predictUpBtn.disabled = !enabled;
  if (els.predictDownBtn) els.predictDownBtn.disabled = !enabled;
}

function canPredict() {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để chơi.");
    return false;
  }
  if (predictLock) return false;
  if (Date.now() < predictCooldownUntil) return false;
  return true;
}

function startPredict(direction) {
  if (!canPredict()) return;
  const symbol = state.selected;
  const market = state.market[symbol];
  if (!market) {
    showToast("Dữ liệu giá chưa sẵn sàng.");
    return;
  }
  predictLock = true;
  updatePredictButtons(false);
  renderPredictStatus("Đang chờ kết quả...", "");
  const entryPrice = market.price;
  const startTs = Date.now();
  setTimeout(() => {
    const m = state.market[symbol];
    const finalPrice = m ? m.price : entryPrice;
    const isUp = finalPrice >= entryPrice;
    const win = (direction === "up" && isUp) || (direction === "down" && !isUp);
    const reward = win ? 25 : 5;
    addXp(reward);
    renderPredictStatus("Hoàn tất", win ? "Bạn đoán đúng! +XP" : "Chưa đúng, vẫn có +XP nhỏ");
    showToast(win ? `Dự đoán đúng! +${reward} XP` : `Chưa đúng. +${reward} XP khuyến khích`);
    predictLock = false;
    predictCooldownUntil = startTs + PREDICT_COOLDOWN_MS;
    updatePredictButtons(false);
    const left = Math.max(0, Math.ceil((predictCooldownUntil - Date.now()) / 1000));
    if (els.predictResult) {
      els.predictResult.textContent = `Chờ ${left}s để chơi lại.`;
    }
    const timer = setInterval(() => {
      const remain = Math.max(0, Math.ceil((predictCooldownUntil - Date.now()) / 1000));
      if (els.predictResult) els.predictResult.textContent = remain > 0 ? `Chờ ${remain}s để chơi lại.` : "";
      if (remain <= 0) {
        clearInterval(timer);
        updatePredictButtons(true);
        renderPredictStatus("Sẵn sàng", "");
      }
    }, 1000);
  }, 5000);
}

const ORDER_SEQ_PREFIX = "cta_order_seq_";
const orderSeqMem = new Map();

function getOrderSeqKey(username) {
  return `${ORDER_SEQ_PREFIX}${username || "guest"}`;
}

function loadOrderSeq(username) {
  if (!username) return 0;
  const key = getOrderSeqKey(username);
  try {
    const raw = localStorage.getItem(key);
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
  } catch {
    // ignore
  }
  return orderSeqMem.get(key) || 0;
}

function saveOrderSeq(username, value) {
  if (!username) return;
  const key = getOrderSeqKey(username);
  orderSeqMem.set(key, value);
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

function bumpOrderSeq(username) {
  const current = loadOrderSeq(username);
  const next = current + 1;
  saveOrderSeq(username, next);
  return next;
}

function showAuthError(message) {
  if (!els.authError) return;
  els.authError.textContent = message || "";
  if (message) {
    shakeAuthInputs();
  }
}

function setAdminCodeVisible(show) {
  if (!els.authAdminCodeWrap) return;
  els.authAdminCodeWrap.classList.toggle("hidden", !show);
  if (!show && els.authAdminCode) {
    els.authAdminCode.value = "";
  }
}

function shakeAuthInputs() {
  const targets = [els.authCard, els.authUsername, els.authPassword, els.authInviteCode, els.authAdminCode]
    .filter(Boolean);
  targets.forEach((el) => {
    el.classList.remove("shake");
    void el.offsetWidth;
    el.classList.add("shake");
  });
  [els.authUsername, els.authPassword, els.authInviteCode, els.authAdminCode].forEach((el) => {
    if (el) el.classList.add("input-error");
  });
  window.setTimeout(() => {
    targets.forEach((el) => el.classList.remove("shake"));
  }, 400);
}

function clearAuthInputError() {
  [els.authUsername, els.authPassword, els.authInviteCode, els.authAdminCode].forEach((el) => {
    if (el) el.classList.remove("input-error");
  });
}

const onboardingSteps = [
  {
    title: "Bước 1: Nhập tài khoản",
    text: "Nhập tài khoản bạn muốn dùng để vào game.",
    target: () => els.authUsername
  },
  {
    title: "Bước 2: Mật khẩu",
    text: "Nhập mật khẩu để đăng nhập hoặc đăng ký.",
    target: () => els.authPassword
  },
  {
    title: "Bước 3: Đăng nhập",
    text: "Bấm Đăng nhập để bắt đầu trải nghiệm.",
    target: () => els.authLoginBtn
  }
];

let onboardingIndex = 0;
let onboardingActive = false;

function hasSeenOnboarding() {
  return false;
}

function setOnboardingSeen() {
  // no-op: luôn hiển thị onboarding
}

function setOnboardingVisible(show) {
  if (!els.onboardingOverlay) return;
  els.onboardingOverlay.classList.toggle("hidden", !show);
  els.onboardingOverlay.setAttribute("aria-hidden", show ? "false" : "true");
}

function clearOnboardingHighlight() {
  document.querySelectorAll(".onboarding-highlight").forEach((el) => {
    el.classList.remove("onboarding-highlight");
  });
}

function positionOnboardingTooltip(target, text) {
  if (!els.onboardingTooltip) return;
  if (!target) {
    els.onboardingTooltip.classList.remove("visible");
    return;
  }
  const rect = target.getBoundingClientRect();
  const tooltip = els.onboardingTooltip;
  tooltip.textContent = text || "";
  tooltip.classList.add("visible");
  const top = rect.bottom + 10;
  const left = Math.min(rect.left, window.innerWidth - 240);
  tooltip.style.top = `${Math.max(12, top)}px`;
  tooltip.style.left = `${Math.max(12, left)}px`;
}

function renderOnboardingStep() {
  const step = onboardingSteps[onboardingIndex];
  if (!step) return;
  if (els.onboardingStep) {
    els.onboardingStep.textContent = `Bước ${onboardingIndex + 1}/${onboardingSteps.length}`;
  }
  if (els.onboardingTitle) els.onboardingTitle.textContent = step.title;
  if (els.onboardingText) els.onboardingText.textContent = step.text;
  clearOnboardingHighlight();
  const target = step.target();
  if (target) target.classList.add("onboarding-highlight");
  positionOnboardingTooltip(target, step.text);
}

function startOnboarding() {
  if (!els.authOverlay) return;
  els.authOverlay.classList.remove("hidden");
  onboardingIndex = 0;
  onboardingActive = true;
  setOnboardingVisible(true);
  renderOnboardingStep();
}

window.startOnboarding = startOnboarding;

function endOnboarding() {
  clearOnboardingHighlight();
  setOnboardingVisible(false);
  if (els.onboardingTooltip) els.onboardingTooltip.classList.remove("visible");
  setOnboardingSeen();
  onboardingActive = false;
}

function hasSeenOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "1";
  } catch {
    return false;
  }
}

function setOnboardingSeen() {
  try {
    localStorage.setItem(ONBOARDING_KEY, "1");
  } catch {
    // ignore
  }
}

function startOnboarding() {
  if (!els.authOverlay) return;
  if (hasSeenOnboarding()) {
    setOnboardingVisible(false);
    return;
  }
  els.authOverlay.classList.remove("hidden");
  onboardingIndex = 0;
  onboardingActive = true;
  setOnboardingVisible(true);
  renderOnboardingStep();
}

window.startOnboarding = startOnboarding;

const academySteps = [
  {
    target: null,
    title: {
      vi: "Chào mừng đến Học viện Trading",
      en: "Welcome to the Interactive Trading Academy"
    },
    body: {
      vi: "Mục tiêu: biến 10k$ thành 1M$ bằng kỷ luật. Bạn sẽ hiểu từng nút, cách đọc giá, và đặt lệnh an toàn để không lỗ vì cảm xúc.",
      en: "Goal: grow 10k$ to 1M$ with discipline. You will learn each button, how to read prices, and place safer orders without emotional losses."
    }
  },
  {
    target: "#tickerTrack",
    title: {
      vi: "Thanh giá chạy (Ticker)",
      en: "Live Ticker"
    },
    body: {
      vi: "Màu xanh là giá đang tăng, màu đỏ là đang giảm. Đây là nhịp thở của thị trường theo thời gian thực.",
      en: "Green means price is rising, red means falling. This is the market heartbeat in real time."
    }
  },
  {
    target: "#chartArea",
    title: {
      vi: "Biểu đồ nến",
      en: "Candlestick Chart"
    },
    body: {
      vi: "Mỗi nến có thân (open-close) và râu (cao/thấp). Thân dài = biến động mạnh, râu dài = có phản ứng giá.",
      en: "Each candle has a body (open-close) and wicks (high/low). Long body = strong move, long wicks = price reaction."
    }
  },
  {
    target: "#chartArea",
    title: {
      vi: "Nhìn xu hướng",
      en: "Read the Trend"
    },
    body: {
      vi: "Đỉnh sau cao hơn đỉnh trước + đáy sau cao hơn đáy trước = xu hướng tăng → ưu tiên MUA. Ngược lại là xu hướng giảm → ưu tiên BÁN.",
      en: "Higher highs + higher lows = uptrend → prioritize BUY. Lower highs + lower lows = downtrend → prioritize SELL."
    }
  },
  {
    target: "#btnLong",
    title: {
      vi: "Nút Mua/Long (Xanh)",
      en: "LONG / Buy (Green)"
    },
    body: {
      vi: "Bấm nút xanh khi bạn dự đoán giá sẽ LÊN. Lãi khi giá tăng đúng kỳ vọng.",
      en: "Press green when you expect price to go UP. You profit if price rises as expected."
    }
  },
  {
    target: "#btnShort",
    title: {
      vi: "Nút Bán/Short (Đỏ)",
      en: "SHORT / Sell (Red)"
    },
    body: {
      vi: "Bấm nút đỏ khi bạn dự đoán giá sẽ XUỐNG. Bạn vẫn có thể kiếm tiền khi thị trường giảm.",
      en: "Press red when you expect price to go DOWN. You can profit even when the market falls."
    }
  },
  {
    target: "#leverageSlider",
    title: {
      vi: "Đòn bẩy",
      en: "Leverage"
    },
    body: {
      vi: "Đòn bẩy cao = lợi nhuận cao nhưng dễ cháy tài khoản. Khuyến nghị F0 dùng x10–x20 để kiểm soát rủi ro.",
      en: "Higher leverage = higher profit but higher risk. New users should stick to x10–x20 for control."
    }
  },
  {
    target: "#portfolioList",
    title: {
      vi: "Danh sách lệnh đang chạy",
      en: "Open Positions"
    },
    body: {
      vi: "Đây là nơi bạn theo dõi lãi/lỗ (PnL). Màu xanh là lời, màu đỏ là lỗ. Đừng để lỗ kéo dài quá lâu.",
      en: "Track your PnL here. Green is profit, red is loss. Don’t let losses run too long."
    }
  },
  {
    target: "#orderStop",
    title: {
      vi: "Cắt lỗ (Stoploss)",
      en: "Stoploss"
    },
    body: {
      vi: "Luôn đặt điểm cắt lỗ. Không cắt lỗ = gồng lỗ. Gồng lỗ = mất tài khoản.",
      en: "Always set a stoploss. No stoploss = holding losses. Holding losses = blown account."
    }
  },
  {
    target: "#submitOrder",
    title: {
      vi: "Hành động ngay",
      en: "Take Action"
    },
    body: {
      vi: "Hãy đặt lệnh đầu tiên với khối lượng nhỏ để làm quen. Kỷ luật là chìa khóa.",
      en: "Place your first small order to practice. Discipline is the key."
    }
  }
];

let academyState = {
  active: false,
  index: 0,
  lang: "vi"
};

function setAcademyVisible(show) {
  if (!els.academyOverlay) return;
  els.academyOverlay.classList.toggle("hidden", !show);
  els.academyOverlay.setAttribute("aria-hidden", show ? "false" : "true");
  document.body.classList.toggle("academy-open", show);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getAcademyTarget(step) {
  if (!step || !step.target) return null;
  if (typeof step.target === "string") return document.querySelector(step.target);
  if (typeof step.target === "function") return step.target();
  return null;
}

function positionAcademySpotlight(rect) {
  if (!els.academySpotlight) return;
  if (!rect) {
    const size = Math.min(180, window.innerWidth * 0.35);
    const top = clamp((window.innerHeight - size) / 2, 16, window.innerHeight - size - 16);
    const left = clamp((window.innerWidth - size) / 2, 16, window.innerWidth - size - 16);
    els.academySpotlight.style.opacity = "1";
    els.academySpotlight.style.top = `${top}px`;
    els.academySpotlight.style.left = `${left}px`;
    els.academySpotlight.style.width = `${size}px`;
    els.academySpotlight.style.height = `${size}px`;
    return;
  }
  const padding = 10;
  const top = clamp(rect.top - padding, 8, window.innerHeight - 8);
  const left = clamp(rect.left - padding, 8, window.innerWidth - 8);
  const width = clamp(rect.width + padding * 2, 40, window.innerWidth - left - 8);
  const height = clamp(rect.height + padding * 2, 40, window.innerHeight - top - 8);
  els.academySpotlight.style.opacity = "1";
  els.academySpotlight.style.top = `${top}px`;
  els.academySpotlight.style.left = `${left}px`;
  els.academySpotlight.style.width = `${width}px`;
  els.academySpotlight.style.height = `${height}px`;
}

function positionAcademyPanel(rect) {
  if (!els.academyPanel) return;
  const panel = els.academyPanel;
  const panelRect = panel.getBoundingClientRect();
  const margin = 14;
  let top = margin;
  let left = margin;
  if (rect) {
    const spaceBottom = window.innerHeight - rect.bottom;
    const spaceTop = rect.top;
    const spaceRight = window.innerWidth - rect.right;
    const spaceLeft = rect.left;
    if (spaceBottom >= panelRect.height + margin) {
      top = rect.bottom + margin;
      left = clamp(rect.left, margin, window.innerWidth - panelRect.width - margin);
    } else if (spaceTop >= panelRect.height + margin) {
      top = rect.top - panelRect.height - margin;
      left = clamp(rect.left, margin, window.innerWidth - panelRect.width - margin);
    } else if (spaceRight >= panelRect.width + margin) {
      top = clamp(rect.top, margin, window.innerHeight - panelRect.height - margin);
      left = rect.right + margin;
    } else if (spaceLeft >= panelRect.width + margin) {
      top = clamp(rect.top, margin, window.innerHeight - panelRect.height - margin);
      left = rect.left - panelRect.width - margin;
    } else {
      top = clamp(rect.bottom + margin, margin, window.innerHeight - panelRect.height - margin);
      left = clamp(rect.left, margin, window.innerWidth - panelRect.width - margin);
    }
  } else {
    top = clamp(window.innerHeight * 0.18, margin, window.innerHeight - panelRect.height - margin);
    left = clamp(window.innerWidth * 0.5 - panelRect.width * 0.5, margin, window.innerWidth - panelRect.width - margin);
  }
  panel.style.top = `${top}px`;
  panel.style.left = `${left}px`;
}

function renderAcademyStep() {
  const step = academySteps[academyState.index];
  if (!step) return;
  const lang = academyState.lang;
  if (els.academyStep) {
    els.academyStep.textContent = lang === "vi"
      ? `Bước ${academyState.index + 1}/${academySteps.length}`
      : `Step ${academyState.index + 1}/${academySteps.length}`;
  }
  if (els.academyTitle) els.academyTitle.textContent = step.title[lang];
  if (els.academyText) els.academyText.textContent = step.body[lang];
  if (els.academyPrev) els.academyPrev.textContent = lang === "vi" ? "Quay lại" : "Back";
  if (els.academyNext) els.academyNext.textContent = academyState.index === academySteps.length - 1
    ? (lang === "vi" ? "Bắt đầu" : "Start")
    : (lang === "vi" ? "Tiếp tục" : "Next");
  if (els.academyClose) els.academyClose.textContent = lang === "vi" ? "Thoát" : "Exit";
  if (els.academyProgressFill) {
    const progress = ((academyState.index + 1) / academySteps.length) * 100;
    els.academyProgressFill.style.width = `${progress}%`;
  }
  const target = getAcademyTarget(step);
  if (target) {
    const rect = target.getBoundingClientRect();
    const margin = 24;
    const fullyVisible = rect.top >= margin
      && rect.left >= margin
      && rect.bottom <= window.innerHeight - margin
      && rect.right <= window.innerWidth - margin;
    if (!fullyVisible) {
      target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      setTimeout(() => {
        if (academyState.active) renderAcademyStep();
      }, 350);
      return;
    }
  }
  const rect = target ? target.getBoundingClientRect() : null;
  positionAcademySpotlight(rect);
  positionAcademyPanel(rect);
}

function openAcademy(startIndex = 0) {
  academyState.active = true;
  academyState.index = clamp(startIndex, 0, academySteps.length - 1);
  setAcademyVisible(true);
  renderAcademyStep();
}

function closeAcademy() {
  academyState.active = false;
  setAcademyVisible(false);
}

function nextAcademyStep() {
  if (academyState.index >= academySteps.length - 1) {
    addLessonHistory("Academy A-Z");
    closeAcademy();
    return;
  }
  academyState.index += 1;
  renderAcademyStep();
}

function prevAcademyStep() {
  academyState.index = clamp(academyState.index - 1, 0, academySteps.length - 1);
  renderAcademyStep();
}

function sendAuth(action, creds = null) {
  if (!socket || !socket.connected) {
    showAuthError("Máy chủ chưa sẵn sàng.");
    return;
  }
  const username = (creds?.username || els.authUsername?.value || "").trim();
  const password = String(creds?.password || els.authPassword?.value || "");
  const isOwner = username.toLowerCase() === ADMIN_OWNER_USER;
  if (!username || !password) {
    showAuthError("Nhập đầy đủ tài khoản và mật khẩu.");
    return;
  }
  if (action === "register" && isOwner) {
    showAuthError("Tài khoản này đã được dành riêng.");
    return;
  }
  const payload = { username, password };
  if (action === "register") {
    const inviteCode = String(creds?.inviteCode || els.authInviteCode?.value || "").trim();
    if (inviteCode) payload.inviteCode = inviteCode;
  }
  if (action === "login" && isOwner) {
    setAdminCodeVisible(true);
    const adminCode = String(creds?.adminCode || els.authAdminCode?.value || "");
    if (!adminCode) {
      showAuthError("Nhập mã sếp để đăng nhập admin.");
      return;
    }
    payload.adminCode = adminCode;
  } else {
    setAdminCodeVisible(false);
  }
  showAuthError("");
  socket.emit(action, payload);
}

function attemptAutoLogin() {
  if (onboardingActive) return;
  if (currentUser || !socket || !socket.connected) return;
  const creds = getStoredAuth();
  if (!creds) return;
  if (els.authUsername) els.authUsername.value = creds.username;
  socket.emit("refresh_session", { refreshToken: creds.refreshToken });
}

function setAdminUI() {
  const show = adminState.authed && adminState.revealed;
  const isSuper = adminState.role === "super_admin";
  if (els.adminPanel) {
    els.adminPanel.classList.toggle("hidden", !show);
  }
  const godPanel = document.getElementById("godPanel");
  if (godPanel) {
    godPanel.classList.toggle("hidden", !show || !isSuper);
  }
  const priceControls = document.getElementById("adminPriceControls");
  if (priceControls) {
    priceControls.classList.toggle("hidden", !show || !isSuper);
  }
  if (els.adminAdvancedSuper) {
    els.adminAdvancedSuper.classList.toggle("hidden", !show || !isSuper);
  }
  if (els.adminAdvancedStats) {
    els.adminAdvancedStats.classList.toggle("hidden", !show);
  }
  const superOnlyEls = [
    els.adminCancelOrderBtn,
    els.adminResetOrdersBtn,
    els.adminResetPositionsBtn,
    els.adminImpersonateBtn,
    els.adminStopImpersonateBtn,
    els.adminStatsApprovals
  ];
  superOnlyEls.forEach((el) => {
    if (!el) return;
    el.classList.toggle("hidden", !show || !isSuper);
  });
  if (show) {
    if (!adminKpiTimer) {
      sendAdminAction("GET_KPI", {});
      adminKpiTimer = setInterval(() => {
        if (adminState.authed && adminState.revealed) {
          sendAdminAction("GET_KPI", {});
        }
      }, 5000);
    }
    updateAdminPricePreview();
  } else if (adminKpiTimer) {
    clearInterval(adminKpiTimer);
    adminKpiTimer = null;
  }
  if (!show) {
    setAdminOutputPopup(false);
  }
}

function toggleAdminReveal(force) {
  if (!adminState.authed) {
    showToast("Cần đăng nhập admin để mở bảng điều khiển.");
    return;
  }
  if (typeof force === "boolean") {
    adminState.revealed = force;
  } else {
    adminState.revealed = !adminState.revealed;
  }
  setAdminUI();
}

function renderAdminKpi(payload = {}) {
  const online = Number(payload.onlineUsers) || 0;
  const orders = Number(payload.openOrders) || 0;
  const volume = Number(payload.volume24h) || 0;
  const pnl = Number(payload.unrealizedPnl) || 0;
  const signedPnl = `${pnl < 0 ? "-" : ""}${formatUSD(Math.abs(pnl))}`;
  if (els.adminKpiOnline) els.adminKpiOnline.textContent = `${online}`;
  if (els.adminKpiOrders) els.adminKpiOrders.textContent = `${orders}`;
  if (els.adminKpiVolume) els.adminKpiVolume.textContent = formatUSD(volume);
  if (els.adminKpiPnl) els.adminKpiPnl.textContent = signedPnl;
}

const ADMIN_OUTPUT_PLACEHOLDER = "Chưa có dữ liệu.";

function setAdminOutputPopup(enabled) {
  if (!els.adminOutputPanel) return;
  els.adminOutputPanel.classList.toggle("admin-output-popup", !!enabled);
}

function resetAdminOutput() {
  if (els.adminStatsTitle) els.adminStatsTitle.textContent = "Kết quả";
  if (els.adminStatsOutput) els.adminStatsOutput.textContent = ADMIN_OUTPUT_PLACEHOLDER;
}

function renderAdminStats(title, data) {
  if (els.adminStatsTitle) els.adminStatsTitle.textContent = title || "Kết quả";
  if (els.adminStatsOutput) {
    els.adminStatsOutput.classList.remove("admin-log-view");
    const text = data == null ? ADMIN_OUTPUT_PLACEHOLDER : JSON.stringify(data, null, 2);
    els.adminStatsOutput.textContent = text;
  }
  setAdminOutputPopup(true);
}

function renderAdminLogList(list = []) {
  if (!els.adminStatsOutput) return;
  adminLogRaw = Array.isArray(list) ? list : [];
  const term = (els.adminLogSearch?.value || "").trim().toLowerCase();
  const roleFilter = (els.adminLogRole?.value || "").trim().toLowerCase();
  const actionFilter = (els.adminLogAction?.value || "").trim().toLowerCase();
  const filtered = adminLogRaw.filter((entry) => {
    if (!entry) return false;
    const obj = typeof entry === "object" ? entry : { action: String(entry) };
    const role = String(obj.role || obj.adminRole || "").toLowerCase();
    const action = String(obj.action || obj.event || obj.type || "").toLowerCase();
    const actor = String(obj.actor || obj.user || obj.username || obj.admin || "").toLowerCase();
    const detail = String(obj.detail || obj.note || obj.target || obj.message || "").toLowerCase();
    if (roleFilter && roleFilter !== "all" && role !== roleFilter) return false;
    if (actionFilter && actionFilter !== "all" && !action.includes(actionFilter)) return false;
    if (!term) return true;
    return [role, action, actor, detail].some((v) => v.includes(term));
  });
  if (!filtered.length) {
    els.adminStatsOutput.innerHTML = "<div class=\"admin-log-empty\">Khong co log.</div>";
    els.adminStatsOutput.classList.add("admin-log-view");
    return;
  }
  const html = filtered.map((entry) => {
    const obj = typeof entry === "object" ? entry : { action: String(entry) };
    const when = obj.ts || obj.time || obj.createdAt || obj.at;
    const timeLabel = when ? formatDateTime(when) : "-";
    const action = obj.action || obj.event || obj.type || "action";
    const actor = obj.actor || obj.user || obj.username || obj.admin || "-";
    const role = obj.role || obj.adminRole || "";
    const ip = obj.ip || obj.ipAddr || obj.address || "-";
    const detail = obj.detail || obj.note || obj.target || obj.message || "";
    const levelRaw = String(obj.level || obj.severity || "").toLowerCase();
    const actionUpper = String(action).toUpperCase();
    let level = "info";
    if (["warn", "warning", "error", "danger"].includes(levelRaw)) level = "warn";
    if (actionUpper.includes("DELETE") || actionUpper.includes("BLOCK") || actionUpper.includes("RESET")) level = "warn";
    return `
      <div class="admin-log-line ${level}">
        <span class="log-time">${escapeHtml(timeLabel)}</span>
        <span class="log-action">${escapeHtml(action)}</span>
        <span class="log-actor">${escapeHtml(actor)}${role ? ` (${escapeHtml(role)})` : ""}</span>
        <span class="log-ip">${escapeHtml(ip)}</span>
        <span class="log-detail">${escapeHtml(detail)}</span>
      </div>
    `;
  }).join("");
  els.adminStatsOutput.classList.add("admin-log-view");
  els.adminStatsOutput.innerHTML = html;
}

function renderAdminTrades(target, rows = []) {
  const title = target ? `Trades: ${target}` : "Trades";
  renderAdminStats(title, rows);
}

function downloadTextFile(filename, content) {
  try {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    if (els.adminStatsOutput) els.adminStatsOutput.textContent = content;
  }
}

function openAdminModal(opts = {}) {
  if (!els.adminModal || !els.adminModalInput) {
    return Promise.resolve({ ok: false, value: "" });
  }
  const {
    title = "Xac nhan",
    text = "",
    placeholder = "",
    value = "",
    type = "text",
    okText = "Xac nhan",
    cancelText = "Huy",
    hideInput = false
  } = opts;
  return new Promise((resolve) => {
    adminModalState.resolve = resolve;
    if (els.adminModalTitle) els.adminModalTitle.textContent = title;
    if (els.adminModalText) els.adminModalText.textContent = text;
    if (els.adminModalCancel) els.adminModalCancel.textContent = cancelText;
    if (els.adminModalOk) els.adminModalOk.textContent = okText;
    els.adminModalInput.type = type;
    els.adminModalInput.placeholder = placeholder;
    els.adminModalInput.value = value;
    els.adminModalInput.classList.toggle("hidden", hideInput);
    els.adminModal.classList.remove("hidden");
    requestAnimationFrame(() => els.adminModal.classList.add("show"));
    if (!hideInput) {
      setTimeout(() => {
        try {
          els.adminModalInput.focus();
          els.adminModalInput.select();
        } catch {
          // ignore
        }
      }, 30);
    }
  });
}

function resolveAdminModal(ok) {
  if (!adminModalState.resolve) return;
  const value = els.adminModalInput ? els.adminModalInput.value : "";
  const resolver = adminModalState.resolve;
  adminModalState.resolve = null;
  els.adminModal.classList.remove("show");
  setTimeout(() => els.adminModal.classList.add("hidden"), 200);
  resolver({ ok: !!ok, value });
}

async function adminPrompt(opts = {}) {
  const result = await openAdminModal(opts);
  if (!result.ok) return null;
  return result.value ?? "";
}

async function adminConfirm(opts = {}) {
  const result = await openAdminModal({ ...opts, hideInput: true });
  return !!result.ok;
}

async function promptNumber(label, fallback) {
  const raw = await adminPrompt({
    title: "Nhap so",
    text: label,
    value: fallback != null ? String(fallback) : "",
    placeholder: fallback != null ? String(fallback) : ""
  });
  if (raw == null) return null;
  const normalized = String(raw).trim();
  if (!normalized) return null;
  const value = parseFloat(normalized);
  if (!Number.isFinite(value)) return null;
  return value;
}

function renderAdminUsers(list = []) {
  if (Array.isArray(list)) adminUsers = list;
  if (!els.adminUserList) return;
  const isSuper = adminState.role === "super_admin";
  const term = (els.adminSearch?.value || "").trim().toLowerCase();
  const minBalance = parseFloat(els.adminMinBalance?.value || "");
  const newDays = parseInt(els.adminNewDays?.value || "", 10);
  const filterLocked = !!els.adminFilterLocked?.checked;
  const filterDeleted = !!els.adminFilterDeleted?.checked;
  const filterNew = !!els.adminFilterNew?.checked;
  const filterAdmin = !!els.adminFilterAdmin?.checked;
  const now = Date.now();
  const filtered = adminUsers.filter((u) => {
    if (filterLocked && !u.locked) return false;
    if (filterDeleted && !u.deleted) return false;
    if (filterAdmin && !u.isAdmin) return false;
    if (filterNew) {
      const days = Number.isFinite(newDays) && newDays > 0 ? newDays : 7;
      if (!u.createdAt || now - u.createdAt > days * 24 * 60 * 60 * 1000) return false;
    }
    if (Number.isFinite(minBalance)) {
      const usd = Number(u.usd) || 0;
      const vnd = Number(u.vnd) || 0;
      const total = usd + vnd / FX_RATE;
      if (total < minBalance) return false;
    }
    if (!term) return true;
    const text = [
      u.username,
      u.userId,
      u.email
    ].map((v) => String(v || "").toLowerCase());
    return text.some((v) => v.includes(term));
  });
  if (!filtered.length) {
    els.adminUserList.textContent = "Không có người dùng.";
    return;
  }
  els.adminUserList.innerHTML = filtered
    .map((u) => {
      const usd = Number.isFinite(u.usd) ? u.usd.toFixed(2) : "0";
      const vnd = Number.isFinite(u.vnd) ? Math.round(u.vnd).toLocaleString("vi-VN") : "0";
      const total = (Number(u.usd) || 0) + (Number(u.vnd) || 0) / FX_RATE;
      const locked = !!u.locked;
      const deleted = !!u.deleted;
      const badgeLabel = deleted ? "Đã xóa" : locked ? "Khóa" : "Hoạt động";
      const badgeClass = deleted ? "deleted" : locked ? "locked" : "active";
      const isOnline = !!u.online;
      const onlineClass = isOnline ? "online" : "offline";
      const onlineLabel = isOnline ? "Online" : "Offline";
      const lockLabel = locked ? "Mở khóa" : "Khóa";
      const lockClass = locked ? "ok" : "warn";
      const groupLabel = u.group ? `Nhóm: ${u.group}` : "Nhóm: -";
      const tagsLabel = Array.isArray(u.riskTags) && u.riskTags.length
        ? `Tags: ${u.riskTags.join(", ")}`
        : "Tags: -";
      const noteLabel = u.notes ? `Ghi chú: ${u.notes}` : "Ghi chú: -";
      const strikes = Number.isFinite(u.strikes) ? u.strikes : 0;
      const watchLabel = u.watchlist ? "Watchlist: ON" : "Watchlist: -";
      const limits = u.limits || {};
      const limitsLabel = limits && Object.keys(limits).length
        ? `Limits: orders=${limits.maxOpenOrders ?? "-"}, pos=${limits.maxPositions ?? "-"}, notional=${limits.maxNotionalUsd ?? "-"}, lev=${limits.maxLeverage ?? "-"}`
        : "Limits: -";
      const lastLogin = u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString("vi-VN") : "-";
      const lastLoginIp = u.lastLoginIp || "-";
      const lastFail = u.lastLoginFailAt ? new Date(u.lastLoginFailAt).toLocaleString("vi-VN") : "-";
      const lastFailIp = u.lastLoginFailIp || "-";
      const passSection = isSuper
        ? `
          <div class="admin-pass">
            <input class="admin-pass-input" type="password" placeholder="Mật khẩu mới" />
            <button class="admin-setpass" data-user="${u.username}">Đặt MK</button>
            <button class="admin-reset" data-user="${u.username}">MK mặc định</button>
          </div>`
        : "";
      const deleteBtn = isSuper && !deleted
        ? `<button class="admin-delete warn" data-user="${u.username}">Xóa tài khoản</button>`
        : "";
      const restoreBtn = isSuper && deleted
        ? `<button class="admin-restore ok" data-user="${u.username}">Khôi phục</button>`
        : "";
      const lockBtn = deleted
        ? ""
        : `<button class="admin-lock ${lockClass}" data-user="${u.username}" data-locked="${locked ? 1 : 0}">${lockLabel}</button>`;
      const logoutBtn = deleted
        ? ""
        : `<button class="admin-logout" data-user="${u.username}">Đăng xuất</button>`;
      const groupBtn = `<button class="admin-group" data-user="${u.username}">Nhóm</button>`;
      const tagsBtn = `<button class="admin-tags" data-user="${u.username}">Tags</button>`;
      const noteBtn = `<button class="admin-note" data-user="${u.username}">Ghi chú</button>`;
      const limitsBtn = `<button class="admin-limits" data-user="${u.username}">Giới hạn</button>`;
      const feeBtn = `<button class="admin-fee" data-user="${u.username}">Fee</button>`;
      const strikesBtn = `<button class="admin-strikes" data-user="${u.username}">Strikes</button>`;
      const resetStrikesBtn = `<button class="admin-reset-strikes" data-user="${u.username}">Reset strikes</button>`;
      const watchBtn = `<button class="admin-watch" data-user="${u.username}" data-watch="${u.watchlist ? 1 : 0}">Watch</button>`;
      const tradesBtn = `<button class="admin-trades" data-user="${u.username}">Trades</button>`;
      const tradesCsvBtn = `<button class="admin-trades-csv" data-user="${u.username}">CSV</button>`;
      const resetOrdersBtn = isSuper ? `<button class="admin-reset-orders" data-user="${u.username}">Reset orders</button>` : "";
      const resetPositionsBtn = isSuper ? `<button class="admin-reset-positions" data-user="${u.username}">Reset positions</button>` : "";
      return `
        <div class="admin-row" data-user="${u.username}">
        <div class="admin-top">
            <span class="admin-name"><span class="status-dot ${onlineClass}" title="${onlineLabel}"></span>${u.username}</span>
            <span class="admin-badge ${badgeClass}">${badgeLabel}</span>
          </div>
          <div class="admin-balance">${usd} USD / ${vnd} VND (≈ ${total.toFixed(2)} USD)</div>
          <div class="admin-meta">
            <div>ID: ${u.userId || "-"}</div>
            <div>${groupLabel}</div>
            <div>${tagsLabel}</div>
            <div>${noteLabel}</div>
            <div>Strikes: ${strikes}</div>
            <div>${watchLabel}</div>
            <div>${limitsLabel}</div>
            <div>Login: ${lastLogin} (${lastLoginIp})</div>
            <div>Fail: ${lastFail} (${lastFailIp})</div>
          </div>
          ${passSection}
          <div class="admin-actions">
            ${lockBtn}
            ${logoutBtn}
            ${deleteBtn}
            ${restoreBtn}
            ${groupBtn}
            ${tagsBtn}
            ${noteBtn}
            ${limitsBtn}
            ${feeBtn}
            ${strikesBtn}
            ${resetStrikesBtn}
            ${watchBtn}
            ${tradesBtn}
            ${tradesCsvBtn}
            ${resetOrdersBtn}
            ${resetPositionsBtn}
          </div>
        </div>`;
    })
    .join("");
}

function updateAdminUser(username, patch) {
  if (!username || !adminUsers?.length) return;
  const idx = adminUsers.findIndex((u) => u.username === username);
  if (idx === -1) return;
  adminUsers[idx] = { ...adminUsers[idx], ...patch };
  renderAdminUsers();
}

function buildAdminCoinSelect() {
  const options = coins
    .map((coin) => `<option value="${coin.symbol}">${coin.symbol}</option>`)
    .join("");
  if (els.adminCoinSelect) {
    els.adminCoinSelect.innerHTML = options;
    if (!els.adminCoinSelect.value && coins.length) {
      els.adminCoinSelect.value = state.selected;
    }
  }
  if (els.adminCandleSymbol) {
    els.adminCandleSymbol.innerHTML = options;
    if (!els.adminCandleSymbol.value && coins.length) {
      els.adminCandleSymbol.value = state.selected;
    }
  }
  updateAdminCoinControls();
}

function getAdminCoinSymbol() {
  return (els.adminCoinSelect?.value || state.selected || "").toUpperCase();
}

function updateAdminCoinControls() {
  const symbol = getAdminCoinSymbol();
  const settings = adminState.settings || {};
  if (els.adminCoinFreeze) {
    els.adminCoinFreeze.checked = !!settings?.coinFreeze?.[symbol];
  }
  if (els.adminCoinSource) {
    els.adminCoinSource.value = settings?.coinSource?.[symbol] || "";
  }
  if (els.adminCoinVolScale) {
    const value = settings?.coinVolScale?.[symbol];
    els.adminCoinVolScale.value = Number.isFinite(value) ? value : "";
  }
  if (els.adminCoinCircuitPct) {
    const value = settings?.coinCircuit?.[symbol];
    els.adminCoinCircuitPct.value = Number.isFinite(value) ? value : "";
  }
}

function adminAdjustCoin(direction) {
  if (!adminState.authed) return;
  const symbol = getAdminCoinSymbol();
  const percent = parseFloat(els.adminCoinPercent?.value || "");
  if (!symbol) {
    showToast("Chọn coin cần điều chỉnh.");
    return;
  }
  if (!Number.isFinite(percent) || percent <= 0) {
    showToast("Nhập phần trăm hợp lệ.");
    return;
  }
  const signed = direction >= 0 ? percent : -percent;
  sendAdminAction("ADJUST_PRICE", { symbol, percent: signed });
}

function adminSetCoinPrice() {
  if (!adminState.authed) return;
  const symbol = getAdminCoinSymbol();
  const value = parseFloat(els.adminCoinSet?.value || "");
  if (!symbol) {
    showToast("Chọn coin cần điều chỉnh.");
    return;
  }
  if (!Number.isFinite(value) || value <= 0) {
    showToast("Giá không hợp lệ.");
    return;
  }
  sendAdminAction("SET_PRICE", { symbol, price: value });
}

function adminApplyCandleBias() {
  if (!adminState.authed) return;
  const all = !!els.adminCandleAll?.checked;
  const symbol = (els.adminCandleSymbol?.value || getAdminCoinSymbol() || "").toUpperCase();
  const direction = String(els.adminCandleDirection?.value || "up").toLowerCase();
  const strengthPct = parseFloat(els.adminCandleStrength?.value || "");
  const wickPct = parseFloat(els.adminCandleWick?.value || "");
  const durationSec = parseFloat(els.adminCandleDuration?.value || "");
  if (!all && !symbol) {
    showToast("Chon coin can dieu khien nen.");
    return;
  }
  if (!["up", "down", "side"].includes(direction)) {
    showToast("Loai nen khong hop le.");
    return;
  }
  const payload = {
    action: "SET_CANDLE_BIAS",
    symbol,
    direction,
    all
  };
  if (Number.isFinite(strengthPct)) payload.strengthPct = strengthPct;
  if (Number.isFinite(wickPct)) payload.wickPct = wickPct;
  if (Number.isFinite(durationSec)) payload.durationMs = Math.max(0, durationSec) * 1000;
  sendAdminAction(payload.action, payload);
}

function updateAdminPricePreview() {
  if (!els.adminPricePreview) return;
  const symbol = getAdminCoinSymbol();
  const current = state.market?.[symbol]?.price;
  if (!symbol || !Number.isFinite(current)) {
    els.adminPricePreview.textContent = "Preview: -";
    return;
  }
  const percent = parseFloat(els.adminCoinPercent?.value || "");
  const setPrice = parseFloat(els.adminCoinSet?.value || "");
  let next = current;
  if (Number.isFinite(percent) && percent !== 0) {
    next = current * (1 + percent / 100);
  } else if (Number.isFinite(setPrice) && setPrice > 0) {
    next = setPrice;
  }
  const deltaPct = current > 0 ? ((next - current) / current) * 100 : 0;
  els.adminPricePreview.textContent = `Preview: ${symbol} ${formatUSD(current)} → ${formatUSD(next)} (${deltaPct.toFixed(2)}%)`;
}

const els = {
  fxRate: document.getElementById("fxRate"),
  feeRate: document.getElementById("feeRate"),
  marketTable: document.getElementById("marketTable"),
  searchInput: document.getElementById("searchInput"),
  watchAll: document.getElementById("watchAll"),
  watchFav: document.getElementById("watchFav"),
  quickToggle: document.getElementById("quickToggle"),
  quickLetters: document.getElementById("quickLetters"),
  pairTitle: document.getElementById("pairTitle"),
  pairSub: document.getElementById("pairSub"),
  priceNow: document.getElementById("priceNow"),
  priceChange: document.getElementById("priceChange"),
  high24: document.getElementById("high24"),
  low24: document.getElementById("low24"),
  vol24: document.getElementById("vol24"),
  asks: document.getElementById("asks"),
  bids: document.getElementById("bids"),
  tradesList: document.getElementById("tradesList"),
  depthChart: document.getElementById("depthChart"),
  orderType: document.getElementById("orderType"),
  orderLeverage: document.getElementById("orderLeverage") || document.getElementById("leverageSlider"),
  orderPrice: document.getElementById("orderPrice"),
  orderQty: document.getElementById("orderQty"),
  orderQtyUp: document.getElementById("orderQtyUp"),
  orderQtyDown: document.getElementById("orderQtyDown"),
  orderPercent: document.getElementById("orderPercent"),
  orderPercentLabel: document.getElementById("orderPercentLabel"),
  orderStop: document.getElementById("orderStop"),
  orderTake: document.getElementById("orderTake"),
  orderTrail: document.getElementById("orderTrail"),
  orderTotal: document.getElementById("orderTotal"),
  orderFee: document.getElementById("orderFee"),
  orderNote: document.getElementById("orderNote"),
  orderPreview: document.getElementById("orderPreview"),
  previewPrice: document.getElementById("previewPrice"),
  previewLeverage: document.getElementById("previewLeverage"),
  previewNotional: document.getElementById("previewNotional"),
  previewSlippage: document.getElementById("previewSlippage"),
  previewFee: document.getElementById("previewFee"),
  submitOrder: document.getElementById("submitOrder"),
  orderPanel: document.querySelector(".panel.orderform"),
  authOverlay: document.getElementById("authOverlay"),
  authCard: document.querySelector(".auth-card"),
  authUsername: document.getElementById("authUsername"),
  authPassword: document.getElementById("authPassword"),
  authInviteCode: document.getElementById("authInviteCode"),
  authAdminCode: document.getElementById("authAdminCode"),
  authAdminCodeWrap: document.getElementById("authAdminCodeWrap"),
  authRemember: document.getElementById("authRemember"),
  authLoginBtn: document.getElementById("authLoginBtn"),
  authRegisterBtn: document.getElementById("authRegisterBtn"),
  authError: document.getElementById("authError"),
  onboardingOverlay: document.getElementById("onboardingOverlay"),
  onboardingStep: document.getElementById("onboardingStep"),
  onboardingTitle: document.getElementById("onboardingTitle"),
  onboardingText: document.getElementById("onboardingText"),
  onboardingNext: document.getElementById("onboardingNext"),
  onboardingSkip: document.getElementById("onboardingSkip"),
  onboardingSkipForever: document.getElementById("onboardingSkipForever"),
  onboardingTooltip: document.getElementById("onboardingTooltip"),
  academyBtn: document.getElementById("academyBtn"),
  academyOverlay: document.getElementById("academyOverlay"),
  academySpotlight: document.getElementById("academySpotlight"),
  academyPanel: document.getElementById("academyPanel"),
  academyStep: document.getElementById("academyStep"),
  academyTitle: document.getElementById("academyTitle"),
  academyText: document.getElementById("academyText"),
  academyProgressFill: document.getElementById("academyProgressFill"),
  academyPrev: document.getElementById("academyPrev"),
  academyNext: document.getElementById("academyNext"),
  academyRestart: document.getElementById("academyRestart"),
  academyClose: document.getElementById("academyClose"),
  academyLangToggle: document.getElementById("academyLangToggle"),
  adminRevealBtn: document.getElementById("adminRevealBtn"),
  logoutOverlay: document.getElementById("logoutOverlay"),
  logoutConfirmBtn: document.getElementById("logoutConfirmBtn"),
  logoutCancelBtn: document.getElementById("logoutCancelBtn"),
  adminModal: document.getElementById("adminModal"),
  adminModalTitle: document.getElementById("adminModalTitle"),
  adminModalText: document.getElementById("adminModalText"),
  adminModalInput: document.getElementById("adminModalInput"),
  adminModalCancel: document.getElementById("adminModalCancel"),
  adminModalOk: document.getElementById("adminModalOk"),
  usdBalance: document.getElementById("usdBalance"),
  vndBalance: document.getElementById("vndBalance"),
  portfolioList: document.getElementById("portfolioList"),
  positionsList: document.getElementById("positionsList"),
  openOrders: document.getElementById("openOrders"),
  tickerTrack: document.getElementById("tickerTrack"),
  newsTrack: document.getElementById("newsTrack"),
  themeToggle: document.getElementById("themeToggle"),
  compactToggle: document.getElementById("compactToggle"),
  todayAssist: document.getElementById("todayAssist"),
  assistDone: document.getElementById("assistDone"),
  assistTimer: document.getElementById("assistTimer"),
  assistViewChart: document.getElementById("assistViewChart"),
  assistDemoOrder: document.getElementById("assistDemoOrder"),
  assistSampleSLTP: document.getElementById("assistSampleSLTP"),
  logoutBtn: document.getElementById("logoutBtn"),
  bgCanvas: document.getElementById("bgParticles"),
  chartArea: document.getElementById("chartArea"),
  chartGrid: document.getElementById("chartGrid"),
  chartTvContainers: Array.from(document.querySelectorAll(".chart-tv")),
  chartCanvases: Array.from(document.querySelectorAll(".chart-fg")),
  chartBgCanvases: Array.from(document.querySelectorAll(".chart-bg")),
  chartFxCanvases: Array.from(document.querySelectorAll(".chart-fx")),
  chartTooltip: document.getElementById("chartTooltip"),
  slotSelects: Array.from(document.querySelectorAll(".slot-select")),
  tileLabels: [
    document.getElementById("tileLabel0"),
    document.getElementById("tileLabel1"),
    document.getElementById("tileLabel2"),
    document.getElementById("tileLabel3")
  ],
  equityChart: document.getElementById("equityChart"),
  achievementList: document.getElementById("achievementList"),
  leaderboard: document.getElementById("leaderboard"),
  weeklyLeaderboard: document.getElementById("weeklyLeaderboard"),
  dailyTipCard: document.getElementById("dailyTipCard"),
  dailyTipText: document.getElementById("dailyTipText"),
  quickActions: document.getElementById("quickActions"),
  mobileBar: document.getElementById("mobileBar"),
  quickBuyBtn: document.getElementById("quickBuyBtn"),
  quickSellBtn: document.getElementById("quickSellBtn"),
  quickCancelBtn: document.getElementById("quickCancelBtn"),
  practiceBtn: document.getElementById("practiceBtn"),
  practiceOverlay: document.getElementById("practiceOverlay"),
  practiceTimer: document.getElementById("practiceTimer"),
  practiceSL: document.getElementById("practiceSL"),
  practiceTP: document.getElementById("practiceTP"),
  practiceOrder: document.getElementById("practiceOrder"),
  practiceClose: document.getElementById("practiceClose"),
  orderTemplates: document.getElementById("orderTemplates"),
  focusToggle: document.getElementById("focusToggle"),
  lessonHistoryList: document.getElementById("lessonHistoryList"),
  sentimentValue: document.getElementById("sentimentValue"),
  sentimentFill: document.getElementById("sentimentFill"),
  botList: document.getElementById("botList"),
  careerLevel: document.getElementById("careerLevel"),
  careerXp: document.getElementById("careerXp"),
  careerXpNext: document.getElementById("careerXpNext"),
  careerMaxLev: document.getElementById("careerMaxLev"),
  careerFee: document.getElementById("careerFee"),
  careerUnlocks: document.getElementById("careerUnlocks"),
  xpFill: document.getElementById("xpFill"),
  xpBar: document.querySelector(".xp-bar"),
  boosterShop: document.getElementById("boosterShop"),
  boosterInventory: document.getElementById("boosterInventory"),
  dailyCheckin: document.getElementById("dailyCheckin"),
  dailyCheckinSub: document.getElementById("dailyCheckinSub"),
  dailyCheckinBtn: document.getElementById("dailyCheckinBtn"),
  dailyStreakBadge: document.getElementById("dailyStreakBadge"),
  dailyNextTime: document.getElementById("dailyNextTime"),
  miniPredict: document.getElementById("miniPredict"),
  predictUpBtn: document.getElementById("predictUpBtn"),
  predictDownBtn: document.getElementById("predictDownBtn"),
  predictStatus: document.getElementById("predictStatus"),
  predictResult: document.getElementById("predictResult"),
  spinCard: document.getElementById("spinCard"),
  spinWheel: document.getElementById("spinWheel"),
  spinBtn: document.getElementById("spinBtn"),
  spinStatus: document.getElementById("spinStatus"),
  spinNote: document.getElementById("spinNote"),
  liquidationOverlay: document.getElementById("liquidationOverlay"),
  toast: document.getElementById("toast"),
  netBadge: document.getElementById("netBadge"),
  pendingBadge: document.getElementById("pendingBadge"),
  undoToast: document.getElementById("undoToast"),
  undoText: document.getElementById("undoText"),
  undoBtn: document.getElementById("undoBtn"),
  userRank: document.getElementById("userRank"),
  mailBtn: document.getElementById("mailBtn"),
  mailCount: document.getElementById("mailCount"),
  mailOverlay: document.getElementById("mailOverlay"),
  mailCloseBtn: document.getElementById("mailCloseBtn"),
  mailFilter: document.getElementById("mailFilter"),
  mailMarkAll: document.getElementById("mailMarkAll"),
  mailMute: document.getElementById("mailMute"),
  mailList: document.getElementById("mailList"),
  inventoryList: document.getElementById("inventoryList"),
  activeBuffList: document.getElementById("activeBuffList"),
  tipChips: Array.from(document.querySelectorAll(".tip-chip")),
  tipOverlay: document.getElementById("tipOverlay"),
  tipTitle: document.getElementById("tipTitle"),
  tipSub: document.getElementById("tipSub"),
  tipText: document.getElementById("tipText"),
  tipTimer: document.getElementById("tipTimer"),
  tipAudioBtn: document.getElementById("tipAudioBtn"),
  tipClose: document.getElementById("tipClose"),
  tipVideo: document.getElementById("tipVideo"),
  tipVideoWrap: document.getElementById("tipVideoWrap"),
  tipFallback: document.getElementById("tipFallback"),
  quizOverlay: document.getElementById("quizOverlay"),
  quizTitle: document.getElementById("quizTitle"),
  quizSub: document.getElementById("quizSub"),
  quizQuestion: document.getElementById("quizQuestion"),
  quizOptions: document.getElementById("quizOptions"),
  quizSkip: document.getElementById("quizSkip"),
  quizNext: document.getElementById("quizNext"),
  orderWarnOverlay: document.getElementById("orderWarnOverlay"),
  orderWarnTitle: document.getElementById("orderWarnTitle"),
  orderWarnText: document.getElementById("orderWarnText"),
  orderWarnPrimary: document.getElementById("orderWarnPrimary"),
  orderWarnSecondary: document.getElementById("orderWarnSecondary"),
  restOverlay: document.getElementById("restOverlay"),
  restSub: document.getElementById("restSub"),
  restTimer: document.getElementById("restTimer"),
  restClose: document.getElementById("restClose"),
  broadcastOverlay: document.getElementById("broadcastOverlay"),
  broadcastMessage: document.getElementById("broadcastMessage"),
  broadcastTimer: document.getElementById("broadcastTimer"),
  pollCard: document.getElementById("bullBearPoll"),
  pollBullBar: document.getElementById("pollBullBar"),
  pollBearBar: document.getElementById("pollBearBar"),
  pollBullPct: document.getElementById("pollBullPct"),
  pollBearPct: document.getElementById("pollBearPct"),
  pollBullBtn: document.getElementById("pollBullBtn"),
  pollBearBtn: document.getElementById("pollBearBtn"),
  pollNote: document.getElementById("pollNote"),
  adminPanel: document.getElementById("adminPanel"),
  adminHeader: document.getElementById("adminHeader"),
  adminFullBtn: document.getElementById("adminFullBtn"),
  adminResetPos: document.getElementById("adminResetPos"),
  adminKpiOnline: document.getElementById("adminKpiOnline"),
  adminKpiOrders: document.getElementById("adminKpiOrders"),
  adminKpiVolume: document.getElementById("adminKpiVolume"),
  adminKpiPnl: document.getElementById("adminKpiPnl"),
  adminTarget: document.getElementById("adminTarget"),
  adminCurrency: document.getElementById("adminCurrency"),
  adminAmount: document.getElementById("adminAmount"),
  adminSetBtn: document.getElementById("adminSetBtn"),
  adminRefreshBtn: document.getElementById("adminRefreshBtn"),
  adminBroadcastMsg: document.getElementById("adminBroadcastMsg"),
  adminBroadcastDuration: document.getElementById("adminBroadcastDuration"),
  adminBroadcastBtn: document.getElementById("adminBroadcastBtn"),
  adminMailTarget: document.getElementById("adminMailTarget"),
  adminMailTitle: document.getElementById("adminMailTitle"),
  adminMailMessage: document.getElementById("adminMailMessage"),
  adminMailUsd: document.getElementById("adminMailUsd"),
  adminMailVnd: document.getElementById("adminMailVnd"),
  adminMailCoin: document.getElementById("adminMailCoin"),
  adminMailCoinQty: document.getElementById("adminMailCoinQty"),
  adminMailBoostInsurance: document.getElementById("adminMailBoostInsurance"),
  adminMailBoostAnonymity: document.getElementById("adminMailBoostAnonymity"),
  adminMailItemName: document.getElementById("adminMailItemName"),
  adminMailItemDesc: document.getElementById("adminMailItemDesc"),
  adminMailItemType: document.getElementById("adminMailItemType"),
  adminMailItemDuration: document.getElementById("adminMailItemDuration"),
  adminMailSendBtn: document.getElementById("adminMailSendBtn"),
  adminCoinSelect: document.getElementById("adminCoinSelect"),
  adminCoinPercent: document.getElementById("adminCoinPercent"),
  adminCoinUpBtn: document.getElementById("adminCoinUpBtn"),
  adminCoinDownBtn: document.getElementById("adminCoinDownBtn"),
  adminCoinSet: document.getElementById("adminCoinSet"),
  adminCoinSetBtn: document.getElementById("adminCoinSetBtn"),
  adminPricePreview: document.getElementById("adminPricePreview"),
  adminCandleSymbol: document.getElementById("adminCandleSymbol"),
  adminCandleDirection: document.getElementById("adminCandleDirection"),
  adminCandleStrength: document.getElementById("adminCandleStrength"),
  adminCandleWick: document.getElementById("adminCandleWick"),
  adminCandleDuration: document.getElementById("adminCandleDuration"),
  adminCandleAll: document.getElementById("adminCandleAll"),
  adminCandleApply: document.getElementById("adminCandleApply"),
  adminMinBalance: document.getElementById("adminMinBalance"),
  adminNewDays: document.getElementById("adminNewDays"),
  adminFilterLocked: document.getElementById("adminFilterLocked"),
  adminFilterDeleted: document.getElementById("adminFilterDeleted"),
  adminFilterNew: document.getElementById("adminFilterNew"),
  adminFilterAdmin: document.getElementById("adminFilterAdmin"),
  adminRegOpen: document.getElementById("adminRegOpen"),
  adminInviteOnly: document.getElementById("adminInviteOnly"),
  adminInviteCode: document.getElementById("adminInviteCode"),
  adminInviteAdd: document.getElementById("adminInviteAdd"),
  adminInviteRemove: document.getElementById("adminInviteRemove"),
  adminBlockIp: document.getElementById("adminBlockIp"),
  adminBlockIpBtn: document.getElementById("adminBlockIpBtn"),
  adminUnblockIpBtn: document.getElementById("adminUnblockIpBtn"),
  adminWhitelistIp: document.getElementById("adminWhitelistIp"),
  adminWhitelistIpBtn: document.getElementById("adminWhitelistIpBtn"),
  adminUnwhitelistIpBtn: document.getElementById("adminUnwhitelistIpBtn"),
  adminSearch: document.getElementById("adminSearch"),
  adminUserList: document.getElementById("adminUserList"),
  adminMaintenance: document.getElementById("adminMaintenance"),
  adminOrderDisabled: document.getElementById("adminOrderDisabled"),
  adminMarginEnabled: document.getElementById("adminMarginEnabled"),
  adminBlockStale: document.getElementById("adminBlockStale"),
  adminMarketFreeze: document.getElementById("adminMarketFreeze"),
  adminWithdrawDisabled: document.getElementById("adminWithdrawDisabled"),
  adminDepositDisabled: document.getElementById("adminDepositDisabled"),
  adminSafeMode: document.getElementById("adminSafeMode"),
  adminReadOnly: document.getElementById("adminReadOnly"),
  adminSlippage: document.getElementById("adminSlippage"),
  adminSetSlippage: document.getElementById("adminSetSlippage"),
  adminCancelPenalty: document.getElementById("adminCancelPenalty"),
  adminSetCancelPenalty: document.getElementById("adminSetCancelPenalty"),
  adminStrikeLimit: document.getElementById("adminStrikeLimit"),
  adminSetStrikeLimit: document.getElementById("adminSetStrikeLimit"),
  adminGroupFeeGroup: document.getElementById("adminGroupFeeGroup"),
  adminGroupFeeRate: document.getElementById("adminGroupFeeRate"),
  adminSetGroupFee: document.getElementById("adminSetGroupFee"),
  adminAlertWebhook: document.getElementById("adminAlertWebhook"),
  adminSetAlertWebhook: document.getElementById("adminSetAlertWebhook"),
  adminAccessStart: document.getElementById("adminAccessStart"),
  adminAccessEnd: document.getElementById("adminAccessEnd"),
  adminSetAccessHours: document.getElementById("adminSetAccessHours"),
  adminIdleMs: document.getElementById("adminIdleMs"),
  adminSetIdleMs: document.getElementById("adminSetIdleMs"),
  adminSessionMs: document.getElementById("adminSessionMs"),
  adminSetSessionMs: document.getElementById("adminSetSessionMs"),
  adminRateSuper: document.getElementById("adminRateSuper"),
  adminRateMod: document.getElementById("adminRateMod"),
  adminRateAuth: document.getElementById("adminRateAuth"),
  adminSetRateLimits: document.getElementById("adminSetRateLimits"),
  adminLogRetention: document.getElementById("adminLogRetention"),
  adminSetLogRetention: document.getElementById("adminSetLogRetention"),
  adminRunLogCleanup: document.getElementById("adminRunLogCleanup"),
  adminSourceWhitelist: document.getElementById("adminSourceWhitelist"),
  adminSetSourceWhitelist: document.getElementById("adminSetSourceWhitelist"),
  adminCoinVisibilitySymbol: document.getElementById("adminCoinVisibilitySymbol"),
  adminCoinVisible: document.getElementById("adminCoinVisible"),
  adminSetCoinVisibility: document.getElementById("adminSetCoinVisibility"),
  adminAddCoinSymbol: document.getElementById("adminAddCoinSymbol"),
  adminAddCoinName: document.getElementById("adminAddCoinName"),
  adminAddCoinBase: document.getElementById("adminAddCoinBase"),
  adminAddCoinVol: document.getElementById("adminAddCoinVol"),
  adminAddCoinBtn: document.getElementById("adminAddCoinBtn"),
  adminRemoveCoinSymbol: document.getElementById("adminRemoveCoinSymbol"),
  adminRemoveCoinBtn: document.getElementById("adminRemoveCoinBtn"),
  adminCoinLimitSymbol: document.getElementById("adminCoinLimitSymbol"),
  adminCoinMinQty: document.getElementById("adminCoinMinQty"),
  adminCoinMaxQty: document.getElementById("adminCoinMaxQty"),
  adminCoinPrecision: document.getElementById("adminCoinPrecision"),
  adminSetCoinLimits: document.getElementById("adminSetCoinLimits"),
  adminBackupDbBtn: document.getElementById("adminBackupDbBtn"),
  adminRestorePath: document.getElementById("adminRestorePath"),
  adminRestoreDbBtn: document.getElementById("adminRestoreDbBtn"),
  adminCoinFreeze: document.getElementById("adminCoinFreeze"),
  adminCoinLockPrice: document.getElementById("adminCoinLockPrice"),
  adminCoinLockSeconds: document.getElementById("adminCoinLockSeconds"),
  adminCoinLockBtn: document.getElementById("adminCoinLockBtn"),
  adminCoinSource: document.getElementById("adminCoinSource"),
  adminCoinSourceBtn: document.getElementById("adminCoinSourceBtn"),
  adminCoinVolScale: document.getElementById("adminCoinVolScale"),
  adminCoinVolBtn: document.getElementById("adminCoinVolBtn"),
  adminCoinCircuitPct: document.getElementById("adminCoinCircuitPct"),
  adminCoinCircuitBtn: document.getElementById("adminCoinCircuitBtn"),
  adminStatsSpam: document.getElementById("adminStatsSpam"),
  adminStatsDailyPnl: document.getElementById("adminStatsDailyPnl"),
  adminStatsTopUsers: document.getElementById("adminStatsTopUsers"),
  adminStatsTopCoins: document.getElementById("adminStatsTopCoins"),
  adminStatsOpenInterest: document.getElementById("adminStatsOpenInterest"),
  adminStatsOnline: document.getElementById("adminStatsOnline"),
  adminStatsApprovals: document.getElementById("adminStatsApprovals"),
  adminStatsApprovalsByAction: document.getElementById("adminStatsApprovalsByAction"),
  adminStatsAdminLog: document.getElementById("adminStatsAdminLog"),
  adminStatsModerator: document.getElementById("adminStatsModerator"),
  adminStatsDb: document.getElementById("adminStatsDb"),
  adminStatsWeekly: document.getElementById("adminStatsWeekly"),
  adminStatsHeatmap: document.getElementById("adminStatsHeatmap"),
  adminStatsCoins: document.getElementById("adminStatsCoins"),
  adminComplaintUser: document.getElementById("adminComplaintUser"),
  adminComplaintNote: document.getElementById("adminComplaintNote"),
  adminComplaintAdd: document.getElementById("adminComplaintAdd"),
  adminComplaintList: document.getElementById("adminComplaintList"),
  adminComplaintId: document.getElementById("adminComplaintId"),
  adminComplaintNoteAdd: document.getElementById("adminComplaintNoteAdd"),
  adminComplaintNoteBtn: document.getElementById("adminComplaintNoteBtn"),
  adminComplaintResolve: document.getElementById("adminComplaintResolve"),
  adminIncidentLoad: document.getElementById("adminIncidentLoad"),
  adminIncidentId: document.getElementById("adminIncidentId"),
  adminIncidentToggle: document.getElementById("adminIncidentToggle"),
  adminIncidentJson: document.getElementById("adminIncidentJson"),
  adminIncidentSave: document.getElementById("adminIncidentSave"),
  adminTradeTarget: document.getElementById("adminTradeTarget"),
  adminTradeLimit: document.getElementById("adminTradeLimit"),
  adminTradeFetch: document.getElementById("adminTradeFetch"),
  adminTradeExport: document.getElementById("adminTradeExport"),
  adminActionTarget: document.getElementById("adminActionTarget"),
  adminCancelOrderId: document.getElementById("adminCancelOrderId"),
  adminCancelOrderBtn: document.getElementById("adminCancelOrderBtn"),
  adminResetOrdersBtn: document.getElementById("adminResetOrdersBtn"),
  adminResetPositionsBtn: document.getElementById("adminResetPositionsBtn"),
  adminImpersonateBtn: document.getElementById("adminImpersonateBtn"),
  adminStopImpersonateBtn: document.getElementById("adminStopImpersonateBtn"),
  adminOutputPanel: document.querySelector(".admin-output"),
  adminOutputBack: document.getElementById("adminOutputBack"),
  adminOutputShowAll: document.getElementById("adminOutputShowAll"),
  adminCloseBtn: document.getElementById("adminCloseBtn"),
  adminStatsTitle: document.getElementById("adminStatsTitle"),
  adminStatsOutput: document.getElementById("adminStatsOutput"),
  adminLogSearch: document.getElementById("adminLogSearch"),
  adminLogRole: document.getElementById("adminLogRole"),
  adminLogAction: document.getElementById("adminLogAction"),
  adminAdvancedSuper: document.getElementById("adminAdvancedSuper"),
  adminAdvancedStats: document.getElementById("adminAdvancedStats")
};

const rowMap = new Map();
const marketView = {
  filtered: [],
  rowHeight: 64,
  buffer: 6,
  start: 0,
  end: 0,
  filterKey: 0,
  lastKey: -1,
  measured: false
};
let marketBodyEl = null;
let marketScrollRaf = null;
const chartData = new Map();
const candleHistory = new Map();
const candleCurrent = new Map();
let tvEnabled = false;
const tvCharts = [];
const tvSeries = [];
const chartFrames = [null, null, null, null];
const chartViewports = Array.from({ length: 4 }, () => ({ zoom: 1, offset: 0 }));
const chartPanState = {
  active: false,
  pending: false,
  slot: -1,
  startX: 0,
  startY: 0,
  startOffset: 0,
  pointerId: null
};
const chartWheelState = { raf: 0, slot: -1, clientX: 0, deltaY: 0 };
let chartInteractionUntil = 0;
let chartInteractionTimer = 0;
const fxBursts = [[], [], [], []];
const fxBurstTimes = [0, 0, 0, 0];
const ORDER_SPLASH_ENABLED = false;
const pnlCache = new Map();
const balanceCache = { usd: null, vnd: null };
const priceCache = new Map();
const candleCounters = new Map();
const marketTrends = {};
const godMode = { volScale: 1, freeze: false };

const formatUSD = (value) => {
  const digits = value < 1 ? 6 : value < 10 ? 4 : 2;
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};

const formatVND = (value) =>
  `${value.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫`;

const formatNumber = (value) =>
  value.toLocaleString("en-US", { maximumFractionDigits: 2 });

const escapeHtml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const formatDateTime = (ts) => {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString("vi-VN");
  } catch {
    return "";
  }
};

const formatDurationMs = (ms) => {
  const totalMs = Number(ms) || 0;
  if (!totalMs || totalMs <= 0) return "Vĩnh viễn";
  const totalMinutes = Math.ceil(totalMs / 60000);
  if (totalMinutes < 60) return `${totalMinutes} phút`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours < 24) return minutes ? `${hours} giờ ${minutes} phút` : `${hours} giờ`;
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return remHours ? `${days} ngày ${remHours} giờ` : `${days} ngày`;
};

const debounce = (fn, wait = 150) => {
  let t = null;
  return (...args) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

function calcTotalBalanceUsd() {
  let total = 0;
  total += Number(state.usd) || 0;
  total += (Number(state.vnd) || 0) / FX_RATE;
  if (state.holdings && typeof state.holdings === "object") {
    Object.entries(state.holdings).forEach(([symbol, qty]) => {
      const amount = Number(qty) || 0;
      if (amount <= 0) return;
      const price = state.market?.[symbol]?.price || 0;
      if (price > 0) total += amount * price;
    });
  }
  return total;
}

function getRankByBalance(balanceUsd) {
  const value = Number(balanceUsd) || 0;
  if (value >= 1_000_000) {
    return { title: "Thần Sàn", emoji: "👑", legend: true };
  }
  if (value >= 50_000) {
    return { title: "Cá voi", emoji: "🐋", legend: false };
  }
  if (value >= 10_000) {
    return { title: "Cá chép", emoji: "🐟", legend: false };
  }
  return { title: "Tôm tép", emoji: "🦐", legend: false };
}

function updateUserRank() {
  if (!els.userRank) return;
  if (!currentUser) {
    els.userRank.classList.add("hidden");
    return;
  }
  const total = calcTotalBalanceUsd();
  const rank = getRankByBalance(total);
  els.userRank.innerHTML = `
    <span class="rank-emoji">${rank.emoji}</span>
    <span class="rank-title">${rank.title}</span>
  `;
  els.userRank.classList.toggle("rank-legend", !!rank.legend);
  els.userRank.classList.remove("hidden");
}

const getCoinIcon = (symbol) => {
  const coin = coins.find((c) => c.symbol === symbol);
  return coin?.icon || null;
};

function animateNumber(el, from, to, formatter, duration = 450) {
  if (!el) return;
  const safeFrom = Number.isFinite(from) ? from : to;
  const safeTo = Number.isFinite(to) ? to : from;
  if (!Number.isFinite(safeTo)) return;
  if (!Number.isFinite(safeFrom) || Math.abs(safeTo - safeFrom) < 0.000001) {
    el.textContent = formatter(safeTo);
    return;
  }
  const start = performance.now();
  if (el._anim) cancelAnimationFrame(el._anim);
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = safeFrom + (safeTo - safeFrom) * eased;
    el.textContent = formatter(value);
    if (t < 1) el._anim = requestAnimationFrame(step);
  };
  el._anim = requestAnimationFrame(step);
}

function formatPnl(value) {
  const label = value >= 0 ? `+${formatUSD(value)}` : `${formatUSD(value)}`;
  return label;
}

const toQuote = (usdValue) => (state.quote === "USD" ? usdValue : usdValue * FX_RATE);
const fromQuote = (quoteValue) => (state.quote === "USD" ? quoteValue : quoteValue / FX_RATE);

function initMarket() {
  coins.forEach((coin) => {
    coin.cgId = coin.cgId || coingeckoIds[coin.symbol] || null;
    if (!coin.icon && coin.symbol) {
      coin.icon = `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`;
    }
    const seed = coin.base;
    state.market[coin.symbol] = {
      price: seed,
      prev: seed,
      open: seed,
      high: seed,
      low: seed,
      vol: Math.random() * 5000
    };
    state.holdings[coin.symbol] = 0;
    state.costBasis[coin.symbol] = 0;
    state.holdingStart[coin.symbol] = null;
    const history = Array.from({ length: state.chartPoints }, () => seed);
    chartData.set(coin.symbol, history);
    candleCounters.set(coin.symbol, 0);
  });
}

function applyInitMarket(payload) {
  if (!payload || !Array.isArray(payload.coins) || payload.coins.length === 0) return;
  coins = payload.coins.map((coin) => ({
    ...coin,
    symbol: (coin.symbol || "").toUpperCase(),
    base: Number.isFinite(coin.base) && coin.base > 0 ? coin.base : 1,
    icon: coin.icon || coin.image || (coin.symbol
      ? `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`
      : null)
  }));
  if (coins.length === 0) return;

  state.market = {};
  chartData.clear();
  candleCounters.clear();

  if (!coins.some((coin) => coin.symbol === state.selected)) {
    state.selected = coins[0].symbol;
  }

  ensureAllCoinsState();
  initChartSlots();
  buildMarketTable();
  buildSlotSelects();
  buildAdminCoinSelect();
  applyFilters();
  updateChartLabels();
  updateRows();
  selectCoin(state.selected);
  updatePairHeader();
  updateOrderInputs();
  updatePortfolio();
  renderOpenOrders();
  normalizeChartDataLength();
}

function applyServerWallet(wallet) {
  if (!wallet) return;
  if (typeof wallet.usd === "number") state.usd = wallet.usd;
  if (typeof wallet.vnd === "number") state.vnd = wallet.vnd;
  updateBalances();
  updatePortfolio();
}

function applyServerAccount(payload) {
  if (!payload) return;
  if (payload.holdings) state.holdings = payload.holdings;
  if (payload.costBasis) state.costBasis = payload.costBasis;
  if (payload.holdingStart) state.holdingStart = payload.holdingStart;
  if (Array.isArray(payload.positions)) state.positions = payload.positions;
  if (Array.isArray(payload.openOrders)) state.openOrders = payload.openOrders;
  if (Array.isArray(payload.protections)) state.protections = payload.protections;
  if (Array.isArray(payload.trades)) state.trades = payload.trades;
  if (payload.boosters) state.boosters = payload.boosters;
  if (Array.isArray(payload.inbox)) state.inbox = payload.inbox;
  if (Array.isArray(payload.inventory)) state.inventory = payload.inventory;
  if (Array.isArray(payload.activeBuffs)) state.activeBuffs = payload.activeBuffs;
  renderOpenOrders();
  updateBalances();
  updatePortfolio();
  renderPositions();
  renderBoosters();
  renderMailInbox();
  renderInventory();
  renderActiveBuffs();
  updateMailBadge();
  updateLeverageOptions();
}

function applyMarketUpdate(marketData) {
  if (!marketData) return;
  const firstSync = !state.marketFromServer;
  state.marketFromServer = true;
  const activeSymbols = new Set(
    state.chartSlots.slice(0, state.chartLayout).concat(state.selected)
  );

  if (firstSync) {
    Object.entries(marketData).forEach(([symbol, payload]) => {
      const price = payload?.price ?? state.market[symbol]?.price ?? 0;
      const history = Array.from({ length: state.chartPoints }, () => price);
      chartData.set(symbol, history);
      candleCounters.set(symbol, 0);
    });
  }

  Object.entries(marketData).forEach(([symbol, payload]) => {
    if (!payload) return;
    const prev = state.market[symbol]?.price ?? payload.price ?? 0;
    state.market[symbol] = {
      price: typeof payload.price === "number" ? payload.price : prev,
      prev: typeof payload.prev === "number" ? payload.prev : prev,
      open: typeof payload.open === "number" ? payload.open : prev,
      high: typeof payload.high === "number" ? payload.high : prev,
      low: typeof payload.low === "number" ? payload.low : prev,
      vol: typeof payload.vol === "number" ? payload.vol : 0
    };

    if (payload.candle) {
      const prevCandle = candleCurrent.get(symbol);
      if (prevCandle && prevCandle.time !== payload.candle.time) {
        const history = candleHistory.get(symbol) || [];
        history.push(prevCandle);
        if (history.length > 1000) history.shift();
        candleHistory.set(symbol, history);
      }
      candleCurrent.set(symbol, payload.candle);
      updateTvForSymbol(symbol, payload.candle);
    }

    const history = chartData.get(symbol) || [];
    if (history.length === 0) history.push(state.market[symbol].price);
    const groupSize = getCandleGroupSize();
    const count = candleCounters.get(symbol) || 0;
    history[history.length - 1] = state.market[symbol].price;
    if (count + 1 >= groupSize) {
      history.push(state.market[symbol].price);
      if (history.length > state.chartPoints) history.shift();
      candleCounters.set(symbol, 0);
    } else {
      candleCounters.set(symbol, count + 1);
    }
    chartData.set(symbol, history);

    const delta = prev > 0 ? (state.market[symbol].price - prev) / prev : 0;
    const oldTrend = marketTrends[symbol] || 0;
    marketTrends[symbol] = oldTrend * 0.7 + delta * 12;

    if (activeSymbols.has(symbol)) updateDepthBook(symbol);
  });

  updateRows();
  updatePairHeader();
  updateTicker();
  drawChart();
  drawEquity();
  updateUserRank();
  if (adminState.authed && adminState.revealed) {
    updateAdminPricePreview();
  }
}

function applyAcceptedOrder(order, priceUsd) {
  if (!order) return;
  const side = order.side;
  const type = order.type;
  const symbol = order.symbol;
  const qty = order.qty;
  const leverage = order.leverage || 1;
  const quote = order.quote || state.quote;
  const price = priceUsd || order.priceUsd || state.market[symbol]?.price || 0;

  const notionalQuote = toQuote(price) * qty;
  const totalQuote = leverage === 1 ? notionalQuote : notionalQuote / leverage;
  const feeQuote = totalQuote * getFeeRate();

  if (side === "buy") {
    if (type === "market") {
      if (leverage === 1) {
        state.holdings[symbol] = (state.holdings[symbol] || 0) + qty;
        const oldQty = state.holdings[symbol] - qty;
        const oldAvg = state.costBasis[symbol] || 0;
        const newAvg = ((oldQty * oldAvg) + qty * price) / (oldQty + qty);
        state.costBasis[symbol] = newAvg;
        if (!state.holdingStart[symbol]) state.holdingStart[symbol] = Date.now();
      } else {
        state.positions.push({
          id: Date.now() + Math.random(),
          symbol,
          side: "buy",
          qty,
          entry: price,
          leverage,
          margin: totalQuote,
          quote
        });
      }
      addTrade({ symbol, price, qty, side: "buy" });
      playTradeSound();
      attachProtection({
        stopInput: order.stopInput,
        takeInput: order.takeInput,
        trailPct: order.trailPct,
        qty,
        side: "buy",
        leverage,
        entryPrice: price,
        symbol
      });
      showToast("Đã khớp lệnh mua.");
    } else {
      state.openOrders.push({
        id: Date.now() + Math.random(),
        side,
        type,
        symbol,
        priceUsd: price,
        qty,
        quote,
        leverage,
        stopInput: order.stopInput,
        takeInput: order.takeInput,
        trailPct: order.trailPct,
        locked: totalQuote + feeQuote,
        ts: new Date()
      });
      showToast("Đã tạo lệnh giới hạn mua.");
    }
  } else {
    if (type === "market") {
      if (leverage === 1) {
        state.holdings[symbol] = Math.max(0, (state.holdings[symbol] || 0) - qty);
        const avg = state.costBasis[symbol] || 0;
        const pnl = (price - avg) * qty;
        recordPnl(pnl);
        if (state.holdings[symbol] <= 0) {
          state.costBasis[symbol] = 0;
          state.holdingStart[symbol] = null;
        }
      } else {
        state.positions.push({
          id: Date.now() + Math.random(),
          symbol,
          side: "sell",
          qty,
          entry: price,
          leverage,
          margin: totalQuote,
          quote
        });
      }
      addTrade({ symbol, price, qty, side: "sell" });
      playTradeSound();
      attachProtection({
        stopInput: order.stopInput,
        takeInput: order.takeInput,
        trailPct: order.trailPct,
        qty,
        side: "sell",
        leverage,
        entryPrice: price,
        symbol
      });
      showToast("Đã khớp lệnh bán.");
    } else {
      if (leverage === 1) {
        state.holdings[symbol] = Math.max(0, (state.holdings[symbol] || 0) - qty);
        if (state.holdings[symbol] <= 0) {
          state.costBasis[symbol] = 0;
          state.holdingStart[symbol] = null;
        }
      }
      state.openOrders.push({
        id: Date.now() + Math.random(),
        side,
        type,
        symbol,
        priceUsd: price,
        qty,
        quote,
        leverage,
        stopInput: order.stopInput,
        takeInput: order.takeInput,
        trailPct: order.trailPct,
        locked: leverage === 1 ? qty : totalQuote + feeQuote,
        ts: new Date()
      });
      showToast("Đã tạo lệnh giới hạn bán.");
    }
  }

  markPracticeOrder();
  renderOpenOrders();
  updateBalances();
  updatePortfolio();
  renderPositions();
  els.orderQty.value = "";
  els.orderStop.value = "";
  els.orderTake.value = "";
  els.orderTrail.value = "";
  resetOrderPercent();
  updateOrderCalc();
}

function initSocket() {
  if (!socket) return;
  socket.on("connect", () => {
    socketState.connected = true;
    socketState.offline = false;
    updateConnectionBadge();
    stopLiveFeed();
    attemptAutoLogin();
  });
  socket.on("disconnect", () => {
    socketState.connected = false;
    adminState.authed = false;
    adminState.revealed = false;
    resetAdminCombo();
    setAdminUI();
    startOfflineMode();
  });
  socket.on("connect_error", () => {
    if (!socketState.connected) startOfflineMode();
  });
  socket.on("init_market", (payload) => {
    applyInitMarket(payload);
  });
  socket.on("init_history", (payload) => {
    handleInitHistory(payload);
  });
  socket.on("init_chart", (payload) => {
    if (!payload) return;
    if (payload.history && typeof payload.history === "object") {
      if (handleInitHistory(payload)) return;
    }
    if (Number.isFinite(payload.chartPoints) && payload.chartPoints > 10) {
      state.chartPoints = payload.chartPoints;
    }
    if (payload.history && typeof payload.history === "object") {
      Object.entries(payload.history).forEach(([symbol, series]) => {
        if (!Array.isArray(series) || series.length === 0) return;
        const trimmed = series.slice(-state.chartPoints);
        chartData.set(symbol, trimmed);
        candleCounters.set(symbol, 0);
      });
      state.marketFromServer = true;
      normalizeChartDataLength();
      drawChart();
      drawEquity();
    }
  });
  socket.on("market_update", (data) => applyMarketUpdate(data));
  socket.on("update_wallet", (wallet) => applyServerWallet(wallet));
  socket.on("sync_account", (payload) => applyServerAccount(payload));
  socket.on("admin_broadcast", (payload) => {
    showBroadcastNotice(payload);
  });
  socket.on("mail_new", (payload) => {
    const mail = payload?.mail;
    if (mail && mail.id) {
      const inbox = Array.isArray(state.inbox) ? state.inbox : [];
      if (!inbox.find((m) => m && m.id === mail.id)) {
        inbox.unshift(mail);
        state.inbox = inbox;
      }
      renderMailInbox();
      updateMailBadge();
    }
    showToast("Bạn có thư mới từ Admin.");
  });
  socket.on("mail_claimed", (payload) => {
    const id = payload?.id;
    if (id) {
      const mail = Array.isArray(state.inbox) ? state.inbox.find((m) => m && m.id === id) : null;
      if (mail && !mail.claimedAt) mail.claimedAt = Date.now();
    }
    renderMailInbox();
    updateMailBadge();
    showToast("Đã nhận phần thưởng.");
  });
  socket.on("item_used", (payload) => {
    const id = payload?.id;
    if (id && Array.isArray(state.inventory)) {
      state.inventory = state.inventory.filter((it) => it && it.id !== id);
    }
    renderInventory();
    showToast("Đã sử dụng vật phẩm.");
  });
  socket.on("big_win", (payload) => {
    showBigWin(payload || {});
  });
  socket.on("spin_status", (payload) => {
    if (payload && typeof payload === "object") {
      spinState = { ...spinState, ...payload };
      renderSpinStatus();
    }
  });
  socket.on("spin_result", (payload) => {
    spinLock = true;
    if (payload && Number.isFinite(payload.index)) {
      spinToSegment(payload.index);
    }
    const label = formatSpinReward(payload?.reward);
    showToast(`Quay trúng: ${label}`);
    spinState.spunToday = true;
    spinState.eligible = false;
    setTimeout(() => {
      spinLock = false;
      renderSpinStatus();
    }, 3200);
  });
  socket.on("spin_error", (payload) => {
    spinLock = false;
    renderSpinStatus();
    showToast(payload?.reason || "Không thể quay.");
  });
  socket.on("register_ok", (payload) => {
    showAuthError("");
    if (payload?.username) {
      if (els.authRemember?.checked && payload.refreshToken) {
        setRemember(true);
        storeAuth(payload.username, payload.refreshToken);
      } else {
        setRemember(false);
        clearAuth();
      }
    }
    setAuthState(payload?.username || "user");
    showToast("Đăng ký thành công.");
  });
  socket.on("login_ok", (payload) => {
    showAuthError("");
    if (payload?.username) {
      if (els.authRemember?.checked && payload.refreshToken) {
        setRemember(true);
        storeAuth(payload.username, payload.refreshToken);
      } else {
        setRemember(false);
        clearAuth();
      }
    }
    setAuthState(payload?.username || "user");
    if (payload?.isAdmin) {
      adminState.authed = true;
      adminState.role = payload.adminRole || payload.role || "";
      adminState.revealed = true;
      adminState.pending = null;
      setAdminUI();
      sendAdminAction("CHECK_USERS", {});
    }
    showToast("Đăng nhập thành công.");
  });
  socket.on("session_ok", (payload) => {
    showAuthError("");
    if (payload?.username && payload?.refreshToken && getRemember()) {
      storeAuth(payload.username, payload.refreshToken);
    }
    setAuthState(payload?.username || "user");
    if (payload?.isAdmin) {
      adminState.authed = true;
      adminState.role = payload.adminRole || payload.role || "";
      adminState.revealed = true;
      adminState.pending = null;
      setAdminUI();
      sendAdminAction("CHECK_USERS", {});
    }
    showToast("Đã khôi phục phiên đăng nhập.");
  });
  socket.on("register_error", (payload) => {
    showAuthError(payload?.reason || "Đăng ký thất bại.");
  });
  socket.on("login_error", (payload) => {
    showAuthError(payload?.reason || "Đăng nhập thất bại.");
  });
  socket.on("session_error", (payload) => {
    if (!currentUser) {
      clearAuth();
      setRemember(false);
      showAuthError(payload?.reason || "Phiên đăng nhập hết hạn.");
    }
  });
  socket.on("auth_required", (payload) => {
    adminState.authed = false;
    adminState.role = "";
    setAdminUI();
    setAuthState(null);
    showAuthError(payload?.reason || "Vui lòng đăng nhập.");
    if (payload?.reason) showToast(payload.reason);
  });
  socket.on("order_accepted", (payload) => {
    if (payload?.clientId) pendingOrders.delete(payload.clientId);
    updatePendingBadge();
    showToast("Lệnh đã được khớp.");
    requestSpinStatus();
  });
  socket.on("order_filled", (payload) => {
    if (!payload) return;
    showToast(`Lệnh giới hạn ${payload.side === "buy" ? "mua" : "bán"} đã khớp.`);
    requestSpinStatus();
  });
  socket.on("order_rejected", (payload) => {
    if (payload?.clientId) pendingOrders.delete(payload.clientId);
    updatePendingBadge();
    showToast(payload?.reason || "Lệnh bị từ chối.");
  });
  socket.on("admin_status", (payload) => {
    if (payload?.ok) {
      adminState.authed = true;
      adminState.role = payload.role || adminState.role || "";
      setAdminUI();
      sendAdminAction("CHECK_USERS", {});
      sendAdminAction("GET_SETTINGS", {});
      showToast("Đã kích hoạt quyền admin.");
      if (adminState.pending) {
        socket.emit("admin_action", adminState.pending);
        adminState.pending = null;
      }
    } else {
      adminState.authed = false;
      setAdminUI();
      adminState.pending = null;
      showToast(payload?.reason || "Sai mật khẩu admin.");
    }
  });
  socket.on("admin_error", (payload) => {
    showToast(payload?.reason || "Không có quyền admin.");
  });
  socket.on("admin_users", (payload) => {
    renderAdminUsers(payload?.users || []);
  });
  socket.on("admin_settings", (payload) => {
    if (els.adminRegOpen) els.adminRegOpen.checked = !!payload?.registrationOpen;
    if (els.adminInviteOnly) els.adminInviteOnly.checked = !!payload?.inviteOnly;
    if (els.adminMaintenance) els.adminMaintenance.checked = !!payload?.maintenanceMode;
    if (els.adminOrderDisabled) els.adminOrderDisabled.checked = !!payload?.orderDisabled;
    if (els.adminMarginEnabled) els.adminMarginEnabled.checked = !!payload?.marginEnabled;
    if (els.adminBlockStale) els.adminBlockStale.checked = !!payload?.blockStalePrice;
    if (els.adminMarketFreeze) els.adminMarketFreeze.checked = !!payload?.marketFreeze;
    if (els.adminWithdrawDisabled) els.adminWithdrawDisabled.checked = !!payload?.withdrawalsDisabled;
    if (els.adminDepositDisabled) els.adminDepositDisabled.checked = !!payload?.depositsDisabled;
    if (els.adminSafeMode) els.adminSafeMode.checked = !!payload?.safeMode;
    if (els.adminReadOnly) els.adminReadOnly.checked = !!payload?.adminReadOnly;
    if (els.adminSlippage) els.adminSlippage.value = payload?.slippagePct ?? "";
    if (els.adminCancelPenalty) els.adminCancelPenalty.value = payload?.cancelPenaltyRate ?? "";
    if (els.adminStrikeLimit) els.adminStrikeLimit.value = payload?.strikeLimit ?? "";
    if (els.adminAlertWebhook) els.adminAlertWebhook.value = payload?.alertWebhook ?? "";
    if (els.adminAccessStart) els.adminAccessStart.value = payload?.adminAccessHours?.start ?? "";
    if (els.adminAccessEnd) els.adminAccessEnd.value = payload?.adminAccessHours?.end ?? "";
    if (els.adminIdleMs) els.adminIdleMs.value = payload?.adminIdleMs ?? "";
    if (els.adminSessionMs) els.adminSessionMs.value = payload?.adminSessionMs ?? "";
    if (els.adminRateSuper) els.adminRateSuper.value = payload?.adminRateLimits?.super ?? "";
    if (els.adminRateMod) els.adminRateMod.value = payload?.adminRateLimits?.mod ?? "";
    if (els.adminRateAuth) els.adminRateAuth.value = payload?.adminRateLimits?.auth ?? "";
    if (els.adminLogRetention) els.adminLogRetention.value = payload?.logRetentionDays ?? "";
    if (els.adminSourceWhitelist) els.adminSourceWhitelist.value = (payload?.sourceWhitelist || []).join(",");
    adminState.settings = payload || {};
    updateAdminCoinControls();
  });
  socket.on("admin_kpi", (payload) => {
    renderAdminKpi(payload);
  });
  socket.on("admin_stats", (payload) => {
    const type = payload?.type || "stats";
    const data = payload?.data;
    const titleMap = {
      spam: "Spam order",
      pnl_daily: "PnL theo ngày",
      top_users_pnl: "Top user PnL",
      top_coin_volume: "Top coin volume",
      open_interest: "Open interest",
      online_users: "User online",
      approvals: "Hàng chờ duyệt",
      approvals_by_action: "Approval theo action",
      admin_log: "Admin log",
      moderator_stats: "Moderator stats",
      db_status: "DB status",
      weekly_report: "Weekly report",
      spam_heatmap: "Heatmap spam",
      coins: "Danh sách coin",
      complaints: "Khiếu nại",
      incident_checklist: "Incident checklist"
    };
    if (type === "admin_log") {
      if (els.adminStatsTitle) els.adminStatsTitle.textContent = titleMap[type] || "Admin log";
      renderAdminLogList(data);
      setAdminOutputPopup(true);
      return;
    }
    renderAdminStats(titleMap[type] || "Thống kê", data);
  });
  socket.on("admin_trades", (payload) => {
    renderAdminTrades(payload?.target, payload?.rows || []);
  });
  socket.on("admin_trades_csv", (payload) => {
    const target = payload?.target || "trades";
    const csv = payload?.csv || "";
    if (!csv) {
      renderAdminStats("CSV", "Không có dữ liệu.");
      return;
    }
    downloadTextFile(`trades_${target}.csv`, csv);
  });
  socket.on("admin_notice", (payload) => {
    if (payload?.target) {
      if (typeof payload.locked === "boolean") {
        updateAdminUser(payload.target, { locked: payload.locked });
        showToast(payload.locked ? `Đã khóa ${payload.target}.` : `Đã mở khóa ${payload.target}.`);
      } else if (payload.deleted) {
        updateAdminUser(payload.target, { deleted: true, locked: true });
        showToast(`Đã xóa tài khoản: ${payload.target}.`);
      } else if (payload.restored) {
        updateAdminUser(payload.target, { deleted: false, locked: false });
        showToast(`Đã khôi phục tài khoản: ${payload.target}.`);
      } else if (payload.reset) {
        showToast(`Đã đặt lại mật khẩu: ${payload.target}.`);
      } else if (payload.logout) {
        showToast(`Đã đăng xuất: ${payload.target}.`);
      } else {
        showToast(`Đã cập nhật số dư: ${payload.target}`);
      }
    }
    if (payload?.settings) {
      showToast("Đã cập nhật cấu hình admin.");
    }
    if (payload?.candleBias) {
      const symbol = payload?.all ? "tat ca coin" : (payload?.symbol || "coin");
      const dir = payload?.direction || "";
      showToast(`Da ap dung nen ${dir} cho ${symbol}.`);
    }
    if (adminState.authed) {
      socket.emit("admin_action", { action: "CHECK_USERS" });
      if (payload?.settings) {
        socket.emit("admin_action", { action: "GET_SETTINGS" });
      }
    }
  });
  socket.on("admin_approval_required", async (payload) => {
    if (!adminState.authed) return;
    const action = payload?.action || "Hành động";
    const approveToken = payload?.token;
    if (!approveToken) return;
    if (payload?.requireOwnerCode && action !== "RESET_PASSWORD") {
      const confirmCode = await adminPrompt({
        title: "Ma xac nhan",
        text: "Nhap ma xac nhan (ma sep):",
        type: "password"
      });
      if (!confirmCode) return;
      sendAdminAction(action, { approveToken, confirmCode });
      return;
    }
    sendAdminAction(action, { approveToken });
  });
  socket.on("security_alert", (payload) => {
    if (!adminState.authed) return;
    const message = payload?.message || "Security alert.";
    const type = payload?.type ? `[${payload.type}] ` : "";
    showToast(`${type}${message}`);
  });
  socket.on("change_password_ok", () => {
    const msg = document.getElementById("passwordMsg");
    if (msg) msg.textContent = "Đã cập nhật mật khẩu.";
    const oldPass = document.getElementById("oldPassword");
    const newPass = document.getElementById("newPassword");
    const confirmPass = document.getElementById("confirmPassword");
    if (oldPass) oldPass.value = "";
    if (newPass) newPass.value = "";
    if (confirmPass) confirmPass.value = "";
    if (els.authRemember?.checked && currentUser) {
      clearAuth();
    }
  });
  socket.on("change_password_error", (payload) => {
    const msg = document.getElementById("passwordMsg");
    if (msg) msg.textContent = payload?.reason || "Đổi mật khẩu thất bại.";
  });
  socket.on("liquidation", () => {
    showLiquidation();
  });
}

const achievementsCatalog = [
  { id: "first_profit", title: "Lần đầu chốt lời", desc: "Chốt lời lần đầu tiên.", icon: "★" },
  { id: "patient_trader", title: "Trader kiên nhẫn", desc: "Giữ một coin liên tục 10 phút.", icon: "⏳" },
  { id: "whale", title: "Cá mập", desc: "Tổng tài sản đạt 1 tỷ VND.", icon: "🐋" }
];

const careerTiers = [
  { level: 1, xp: 0, feeDiscount: 0.0, maxLeverage: 50, unlocks: ["ma14", "rsi"] },
  { level: 2, xp: 250, feeDiscount: 0.08, maxLeverage: 50, unlocks: [] },
  { level: 3, xp: 650, feeDiscount: 0.12, maxLeverage: 75, unlocks: ["bb"] },
  { level: 4, xp: 1100, feeDiscount: 0.18, maxLeverage: 100, unlocks: ["ma50"] },
  { level: 5, xp: 1700, feeDiscount: 0.25, maxLeverage: 125, unlocks: ["macd"] }
];

const boosterCatalog = [
  {
    id: "insurance",
    title: "Thẻ bảo hiểm",
    desc: "Giảm 50% thiệt hại khi liquidation.",
    priceUsd: 150
  },
  {
    id: "anonymity",
    title: "Thẻ ẩn danh",
    desc: "Ẩn tên trên BXH khi bị lỗ.",
    priceUsd: 90
  }
];

const botTraders = [
  {
    id: "atlas",
    name: "Atlas Quant",
    style: "Momentum",
    risk: "Medium",
    symbol: "BTC",
    size: 0.03,
    cooldown: 7000
  },
  {
    id: "luna",
    name: "Luna Mean-Revert",
    style: "Mean Reversion",
    risk: "Low",
    symbol: "ETH",
    size: 0.02,
    cooldown: 9000
  },
  {
    id: "fenrir",
    name: "Fenrir Breakout",
    style: "Breakout",
    risk: "High",
    symbol: "SOL",
    size: 0.05,
    cooldown: 6000
  },
  {
    id: "vega",
    name: "Vega Scalper",
    style: "Scalping",
    risk: "High",
    symbol: "XRP",
    size: 0.04,
    cooldown: 5000
  }
];

function getActiveSymbols() {
  return new Set(state.chartSlots.slice(0, state.chartLayout).concat(state.selected));
}

function saveLocalLegacy() {
  return;
  const saveData = {
    // 1. Lưu thời gian hiện tại để tính toán khi quay lại
    lastLogin: Date.now(),

    // 2. Lưu Tài chính
    usd: state.usd,
    vnd: state.vnd,
    holdings: state.holdings,
    costBasis: state.costBasis,
    holdingStart: state.holdingStart,

    // 3. Lưu Vị thế & Lệnh
    positions: state.positions,
    openOrders: state.openOrders,
    protections: state.protections,
    trades: state.trades,

    // 4. Lưu Thông tin nhân vật
    career: state.career,
    achievements: [...state.achievements],
    leaderboard: state.leaderboard,
    boosters: state.boosters,

    // 5. Lưu trạng thái thị trường
    market: state.market,
    marketTrends,

    // 6. Cài đặt
    theme: document.body.dataset.theme,
    favorites: [...state.favorites],

    // Extra
    tradeVolumeUsd: state.tradeVolumeUsd,
    risk: state.risk,
    marketRegime: state.marketRegime,
    chartPoints: state.chartPoints
  };

  localStorage.setItem("cryptoGameSave_Full_v1", JSON.stringify(saveData));
}

function loadLocalLegacy() {
  return false;
  try {
    const raw = localStorage.getItem("cryptoGameSave_Full_v1");
    if (!raw) {
      const migrated = tryMigrateLegacySave();
      return migrated;
    }

    const data = JSON.parse(raw);

    // 1. Khôi phục dữ liệu cơ bản
    state.usd = data.usd || 10000;
    state.vnd = data.vnd || 200000000;
    state.holdings = data.holdings || {};
    state.costBasis = data.costBasis || {};
    state.holdingStart = data.holdingStart || {};
    state.positions = data.positions || [];
    state.openOrders = data.openOrders || [];
    state.protections = data.protections || [];
    state.trades = data.trades || [];
    state.career = data.career || state.career;
    state.boosters = data.boosters || state.boosters;
    state.tradeVolumeUsd = data.tradeVolumeUsd || 0;
    state.risk = data.risk || state.risk;
    state.marketRegime = data.marketRegime || state.marketRegime;
    if (data.chartPoints) state.chartPoints = data.chartPoints;

    if (data.achievements) state.achievements = new Set(data.achievements);
    if (data.favorites) state.favorites = new Set(data.favorites);
    if (data.leaderboard) state.leaderboard = data.leaderboard;
    state.weeklyLeaderboard = loadWeeklyLeaderboard();
    if (data.theme) {
      document.body.dataset.theme = data.theme;
      if (els.themeToggle) els.themeToggle.textContent = data.theme === "light" ? "Chế độ tối" : "Chế độ sáng";
    }

    // 2. XỬ LÝ "TIME TRAVEL" (Tua nhanh thời gian)
    const now = Date.now();
    const lastTime = data.lastLogin || now;
    const timeDiff = now - lastTime;

    if (!socket) {
      if (data.market) state.market = data.market;
      if (data.marketTrends) Object.assign(marketTrends, data.marketTrends);
    }

    if (timeDiff > 5000 && !socket) {
      simulateOfflineProgress(timeDiff);
      showToast("Chào mừng trở lại! Thị trường đã chạy trong lúc bạn vắng mặt.");
    }

    ensureAllCoinsState();
    normalizeChartDataLength();
    return true;
  } catch (e) {
    console.error("Lỗi load save:", e);
    return false;
  }
}

function simulateOfflineProgress(timeDiffMs) {
  const minutesPassed = timeDiffMs / 60000;
  const safeMinutes = Math.min(minutesPassed, 10080);

  coins.forEach((coin) => {
    const market = state.market[coin.symbol];
    if (!market) return;

    const trend = marketTrends[coin.symbol] || 0;
    const volatility = coin.vol * 0.5;
    const randomShock = (Math.random() - 0.5) * 2;
    const drift = trend * 0.001 * safeMinutes;
    const diffusion = volatility * randomShock * Math.sqrt(safeMinutes) * 0.01;
    const totalChangePct = drift + diffusion;

    market.prev = market.price;
    market.price = market.price * (1 + totalChangePct);
    market.price = Math.max(0.000001, market.price);

    if (market.price > market.high) market.high = market.price;
    if (market.price < market.low) market.low = market.price;

    const history = chartData.get(coin.symbol) || [];
    history.push(market.price);
    if (history.length > state.chartPoints) history.shift();
    chartData.set(coin.symbol, history);
  });

  checkLiquidations();
}

function tryMigrateLegacySave() {
  let migrated = false;
  try {
    const legacyAchievements = JSON.parse(localStorage.getItem("tradingGameAchievements") || "[]");
    if (Array.isArray(legacyAchievements) && legacyAchievements.length) {
      state.achievements = new Set(legacyAchievements);
      migrated = true;
    }
  } catch {
    // ignore
  }
  try {
    const legacyLeaderboard = JSON.parse(localStorage.getItem("tradingGameLeaderboard") || "[]");
    if (Array.isArray(legacyLeaderboard) && legacyLeaderboard.length) {
      state.leaderboard = legacyLeaderboard;
      migrated = true;
    }
  } catch {
    // ignore
  }
  try {
    const legacyCareer = JSON.parse(localStorage.getItem("tradingGameCareer") || "{}");
    if (legacyCareer && (typeof legacyCareer.xp === "number" || typeof legacyCareer.level === "number")) {
      state.career.xp = legacyCareer.xp ?? state.career.xp;
      state.career.level = legacyCareer.level ?? state.career.level;
      migrated = true;
    }
  } catch {
    // ignore
  }
  try {
    const legacyBoosters = JSON.parse(localStorage.getItem("tradingGameBoosters") || "{}");
    if (legacyBoosters && (typeof legacyBoosters.insurance === "number" || typeof legacyBoosters.anonymity === "number")) {
      state.boosters.insurance = legacyBoosters.insurance ?? state.boosters.insurance;
      state.boosters.anonymity = legacyBoosters.anonymity ?? state.boosters.anonymity;
      migrated = true;
    }
  } catch {
    // ignore
  }
  const legacyTheme = localStorage.getItem("tradingGameTheme");
  if (legacyTheme) {
    document.body.dataset.theme = legacyTheme;
    if (els.themeToggle) els.themeToggle.textContent = legacyTheme === "light" ? "Chế độ tối" : "Chế độ sáng";
    migrated = true;
  }
  if (migrated) {
    ensureAllCoinsState();
    saveLocal();
  }
  return migrated;
}

function saveLocal() {
  const saveData = {
    lastLogin: Date.now(),
    career: state.career,
    achievements: [...state.achievements],
    lessonHistory: state.lessonHistory,
    leaderboard: state.leaderboard,
    boosters: state.boosters,
    theme: document.body.dataset.theme,
    favorites: [...state.favorites],
    tradeVolumeUsd: state.tradeVolumeUsd,
    risk: state.risk,
    marketRegime: state.marketRegime,
    chartPoints: state.chartPoints,
    compactMode: !!state.compactMode,
    focusMode: !!state.focusMode,
    tipAudioEnabled: !!state.tipAudioEnabled
  };

  localStorage.setItem("cryptoGameSave_UI_v1", JSON.stringify(saveData));
}

function loadLocal() {
  try {
    const raw = localStorage.getItem("cryptoGameSave_UI_v1") || localStorage.getItem("cryptoGameSave_Full_v1");
    if (!raw) return false;

    const data = JSON.parse(raw);
    state.career = data.career || state.career;
    state.boosters = data.boosters || state.boosters;
    state.tradeVolumeUsd = data.tradeVolumeUsd || 0;
    state.risk = data.risk || state.risk;
    state.marketRegime = data.marketRegime || state.marketRegime;
    if (data.chartPoints) state.chartPoints = data.chartPoints;

    if (data.achievements) state.achievements = new Set(data.achievements);
    if (Array.isArray(data.lessonHistory)) state.lessonHistory = data.lessonHistory;
    if (data.favorites) state.favorites = new Set(data.favorites);
    if (data.leaderboard) state.leaderboard = data.leaderboard;
    if (data.theme) {
      document.body.dataset.theme = data.theme;
      if (els.themeToggle) els.themeToggle.textContent = data.theme === "light" ? "Chế độ tối" : "Chế độ sáng";
    }
    if (typeof data.compactMode === "boolean") {
      setCompactMode(data.compactMode);
    }
    if (typeof data.focusMode === "boolean") {
      setFocusMode(data.focusMode);
    }
    if (typeof data.tipAudioEnabled === "boolean") {
      setTipAudioEnabled(data.tipAudioEnabled);
    }

    return true;
  } catch (e) {
    console.error("Loi load save:", e);
    return false;
  }
}

function setCompactMode(enabled) {
  state.compactMode = !!enabled;
  document.body.classList.toggle("compact", state.compactMode);
  if (els.compactToggle) {
    els.compactToggle.textContent = state.compactMode ? "Giao diện đầy đủ" : "Gọn giao diện";
  }
}

function setFocusMode(enabled) {
  state.focusMode = !!enabled;
  document.body.classList.toggle("focus-one", state.focusMode);
  if (els.focusToggle) {
    els.focusToggle.textContent = state.focusMode ? "Tat focus" : "Focus 1 coin";
  }
  saveLocal();
}

function getTodayAssistKey() {
  return `${TODAY_ASSIST_KEY_PREFIX}${getDateKey()}`;
}

function loadTodayAssist() {
  try {
    const raw = localStorage.getItem(getTodayAssistKey());
    if (raw) {
      const data = JSON.parse(raw);
      todayAssist = {
        viewChart: !!data.viewChart,
        demoOrder: !!data.demoOrder,
        sampleSLTP: !!data.sampleSLTP
      };
    } else {
      todayAssist = { viewChart: false, demoOrder: false, sampleSLTP: false };
    }
  } catch {
    todayAssist = { viewChart: false, demoOrder: false, sampleSLTP: false };
  }
  renderTodayAssist();
}

function saveTodayAssist() {
  try {
    localStorage.setItem(getTodayAssistKey(), JSON.stringify(todayAssist));
  } catch {
    // ignore storage errors
  }
}

function renderTodayAssist() {
  if (!els.todayAssist) return;
  const items = els.todayAssist.querySelectorAll(".assist-item");
  items.forEach((row) => {
    const key = row.dataset.assist;
    row.classList.toggle("done", !!todayAssist[key]);
  });
  const doneCount = Object.values(todayAssist).filter(Boolean).length;
  if (els.assistDone) els.assistDone.textContent = `${doneCount}/3`;
}

function updateAssistTimer() {
  if (!els.assistTimer) return;
  const value = assistRemaining > 0 ? `${assistRemaining}s` : "30s";
  els.assistTimer.textContent = value;
}

function startAssistTimer() {
  assistRemaining = 30;
  updateAssistTimer();
  if (assistTimerId) clearInterval(assistTimerId);
  assistTimerId = setInterval(() => {
    assistRemaining -= 1;
    if (assistRemaining <= 0) {
      assistRemaining = 0;
      clearInterval(assistTimerId);
      assistTimerId = 0;
    }
    updateAssistTimer();
  }, 1000);
}

function markTodayAssist(key) {
  if (!key || typeof todayAssist[key] === "undefined") return;
  if (!todayAssist[key]) {
    todayAssist[key] = true;
    saveTodayAssist();
    renderTodayAssist();
  }
}

function runAssistViewChart() {
  startAssistTimer();
  const chartPanel = document.getElementById("panelChart");
  if (chartPanel && chartPanel.scrollIntoView) {
    chartPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  markTodayAssist("viewChart");
}

function runAssistDemoOrder() {
  startAssistTimer();
  const btnLong = document.getElementById("btnLong");
  if (btnLong) btnLong.click();
  if (els.orderType) {
    els.orderType.value = "market";
    if (els.orderPrice) els.orderPrice.disabled = true;
  }
  if (els.orderLeverage) {
    els.orderLeverage.value = "1";
    state.leverage = 1;
  }
  applyOrderPercent(10);
  updateOrderInputs();
  showToast("Đã chuẩn bị lệnh demo 10% vốn.");
  markTodayAssist("demoOrder");
}

function runAssistSampleSLTP() {
  startAssistTimer();
  const basePrice = state.market[state.selected]?.price;
  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    showToast("Chưa có giá để đặt SL/TP.");
    return;
  }
  const side = state.side === "sell" ? "sell" : "buy";
  const stopUsd = side === "buy" ? basePrice * 0.99 : basePrice * 1.01;
  const takeUsd = side === "buy" ? basePrice * 1.02 : basePrice * 0.98;
  const stopQuote = toQuote(stopUsd);
  const takeQuote = toQuote(takeUsd);
  const fmtQuote = (value) => (state.quote === "USD"
    ? value.toFixed(2)
    : Math.round(value).toString());
  if (els.orderStop) els.orderStop.value = fmtQuote(stopQuote);
  if (els.orderTake) els.orderTake.value = fmtQuote(takeQuote);
  updateOrderCalc();
  showToast("Đã áp dụng SL/TP mẫu 1%/2%.");
  markTodayAssist("sampleSLTP");
}

function ensureAllCoinsState() {
  coins.forEach((coin) => {
    if (!state.market[coin.symbol]) {
      const seed = coin.base * (0.9 + Math.random() * 0.2);
      state.market[coin.symbol] = {
        price: seed,
        prev: seed,
        open: seed,
        high: seed,
        low: seed,
        vol: Math.random() * 5000
      };
    } else {
      const m = state.market[coin.symbol];
      if (typeof m.prev !== "number") m.prev = m.price;
      if (typeof m.open !== "number") m.open = m.price;
      if (typeof m.high !== "number") m.high = m.price;
      if (typeof m.low !== "number") m.low = m.price;
      if (typeof m.vol !== "number") m.vol = Math.random() * 5000;
    }
    if (state.holdings[coin.symbol] == null) state.holdings[coin.symbol] = 0;
    if (state.costBasis[coin.symbol] == null) state.costBasis[coin.symbol] = 0;
    if (state.holdingStart[coin.symbol] == null) state.holdingStart[coin.symbol] = null;
    if (!chartData.has(coin.symbol)) {
      const history = [];
      let cursor = state.market[coin.symbol].price;
      for (let i = 0; i < state.chartPoints; i += 1) {
        cursor = Math.max(0.0000001, cursor + (Math.random() - 0.5) * coin.vol * cursor);
        history.push(cursor);
      }
      chartData.set(coin.symbol, history);
    } else {
      const history = chartData.get(coin.symbol);
      if (history && history.length) {
        history[history.length - 1] = state.market[coin.symbol].price;
      }
    }
    if (marketTrends[coin.symbol] == null) marketTrends[coin.symbol] = 0;
    if (!state.depthBooks[coin.symbol]) updateDepthBook(coin.symbol);
    if (!candleCounters.has(coin.symbol)) candleCounters.set(coin.symbol, 0);
  });
}

function renderAchievements() {
  els.achievementList.innerHTML = achievementsCatalog
    .map((ach) => {
      const unlocked = state.achievements.has(ach.id);
      return `
        <div class="badge ${unlocked ? "" : "locked"}">
          <div class="badge-icon">${ach.icon}</div>
          <div>
            <div class="badge-title">${ach.title}</div>
            <div class="badge-sub">${ach.desc}</div>
          </div>
          <div>${unlocked ? "Đã mở" : "Chưa mở"}</div>
        </div>
      `;
    })
    .join("");
}

function unlockAchievement(id) {
  if (state.achievements.has(id)) return;
  state.achievements.add(id);
  renderAchievements();
  saveLocal();
  const ach = achievementsCatalog.find((a) => a.id === id);
  showToast(`Nhận huy hiệu: ${ach ? ach.title : "Achievement"}`);
}

function updateLeaderboard() {
  const equity = totalEquityUSD();
  const entry = { name: "Bạn", equityUsd: equity, ts: new Date().toISOString() };
  state.leaderboard.push(entry);
  state.leaderboard = state.leaderboard.sort((a, b) => b.equityUsd - a.equityUsd).slice(0, 5);
  state.weeklyLeaderboard.push(entry);
  state.weeklyLeaderboard = state.weeklyLeaderboard.sort((a, b) => b.equityUsd - a.equityUsd).slice(0, 5);
  saveWeeklyLeaderboard(state.weeklyLeaderboard);
  saveLocal();
  renderLeaderboard();
  renderWeeklyLeaderboard();
}

function renderLeaderboard() {
  if (state.leaderboard.length === 0) {
    els.leaderboard.innerHTML = `<div class="leader-row">Chưa có kỷ lục</div>`;
    return;
  }
  els.leaderboard.innerHTML = state.leaderboard
    .map((row, idx) => {
      return `
        <div class="leader-row">
          <div class="leader-rank">${idx + 1}</div>
          <div>${row.name}</div>
          <div>${formatUSD(row.equityUsd)}</div>
        </div>
      `;
    })
    .join("");
}

function maybeUpdateLeaderboard(equity) {
  if (state.leaderboard.length === 0 || equity > state.leaderboard[0].equityUsd * 1.002) {
    updateLeaderboard();
  }
}

function loadWeeklyLeaderboard() {
  const key = `${WEEKLY_LEADERBOARD_PREFIX}${getWeekId()}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveWeeklyLeaderboard(list) {
  const key = `${WEEKLY_LEADERBOARD_PREFIX}${getWeekId()}`;
  try {
    localStorage.setItem(key, JSON.stringify(list || []));
  } catch {
    // ignore
  }
}

function renderWeeklyLeaderboard() {
  if (!els.weeklyLeaderboard) return;
  const title = `BXH tuần (${getWeekId()})`;
  if (state.weeklyLeaderboard.length === 0) {
    els.weeklyLeaderboard.innerHTML = `<div class="leader-row">${title} - Chưa có dữ liệu</div>`;
    return;
  }
  els.weeklyLeaderboard.innerHTML = [
    `<div class="leader-row"><strong>${title}</strong></div>`,
    ...state.weeklyLeaderboard.map((row, idx) => {
      return `
        <div class="leader-row">
          <div class="leader-rank">${idx + 1}</div>
          <div>${row.name}</div>
          <div>${formatUSD(row.equityUsd)}</div>
        </div>
      `;
    })
  ].join("");
}

function renderLessonHistory() {
  if (!els.lessonHistoryList) return;
  if (!Array.isArray(state.lessonHistory) || state.lessonHistory.length === 0) {
    els.lessonHistoryList.innerHTML = "<div class=\"lesson-item\">Chua co bai hoc</div>";
    return;
  }
  els.lessonHistoryList.innerHTML = state.lessonHistory
    .slice(0, 8)
    .map((row) => `<div class="lesson-item"><span>${row.title}</span><span>${row.date}</span></div>`)
    .join("");
}

function addLessonHistory(title) {
  const entry = {
    title: title || "Academy",
    date: getDateKey(),
    ts: Date.now()
  };
  if (!Array.isArray(state.lessonHistory)) state.lessonHistory = [];
  state.lessonHistory.unshift(entry);
  if (state.lessonHistory.length > 20) state.lessonHistory.length = 20;
  renderLessonHistory();
  saveLocal();
}

const tipPool = [
  "Luôn đặt stop‑loss trước khi vào lệnh.",
  "Không all‑in khi thị trường biến động mạnh.",
  "Hãy ưu tiên quản lý rủi ro hơn là lợi nhuận.",
  "Đòn bẩy cao đi kèm rủi ro cao.",
  "Chỉ vào lệnh khi có kế hoạch rõ ràng.",
  "Giữ kỷ luật chốt lời theo mục tiêu.",
  "Đừng FOMO khi giá đã chạy mạnh.",
  "Tránh giao dịch khi tâm lý đang căng thẳng.",
  "Kiểm tra khối lượng trước khi vào lệnh.",
  "Ghi chú lại lệnh để rút kinh nghiệm."
];

const TIP_CHIPS = {
  candle: {
    title: "Nen la gi?",
    text: "Doc than nen, rau nen va y nghia cua moi phan.",
    duration: 12
  },
  trend: {
    title: "Xac dinh xu huong",
    text: "Dinh sau cao hon dinh truoc thi xu huong tang.",
    duration: 14
  },
  "sl-tp": {
    title: "SL/TP co ban",
    text: "Dat SL 1-2%, TP 2-3% de bao ve tai khoan.",
    duration: 10
  },
  risk: {
    title: "Quan ly rui ro",
    text: "Khong all-in, vao 10-20% von moi lenh.",
    duration: 15
  }
};

const TIP_MIN_SEC = 10;
const TIP_MAX_SEC = 15;
let tipTimerId = 0;
let tipRemaining = 0;
let tipOpen = false;
let tipActiveKey = "";

const TIP_QUIZ_XP = 20;
const TIP_QUIZ = {
  candle: [
    {
      q: "Than nen the hien dieu gi?",
      options: ["Gia mo dong cua", "Do bien dong gia", "Khoi luong", "Thong tin SL"],
      correct: 1
    },
    {
      q: "Rau nen dung de nhan biet?",
      options: ["Do rung", "Diem cao/thap trong ky", "Phi giao dich", "Lenh cho"],
      correct: 1
    }
  ],
  trend: [
    {
      q: "Dinh sau cao hon dinh truoc la xu huong?",
      options: ["Giam", "Tang", "Sideway", "Khong ro"],
      correct: 1
    },
    {
      q: "Trong xu huong tang, uu tien?",
      options: ["Ban", "Mua", "All-in", "Bo qua SL"],
      correct: 1
    }
  ],
  "sl-tp": [
    {
      q: "SL dung de?",
      options: ["Nham loi", "Cat lo", "Tang don bay", "Giam phi"],
      correct: 1
    },
    {
      q: "TP dung de?",
      options: ["Cat lo", "Chot loi", "Giam rui ro", "An toan hon"],
      correct: 1
    }
  ],
  risk: [
    {
      q: "Quan ly rui ro dung la?",
      options: ["All-in", "Vao 10-20% von", "Khong can SL", "Tang don bay max"],
      correct: 1
    },
    {
      q: "Neu thua lien tuc nen?",
      options: ["Giao dich tiep", "Nghi va xem lai", "Tang von", "Bo SL"],
      correct: 1
    }
  ]
};

let quizState = { active: false, key: "", index: 0, correct: 0 };

function updateTipTimerUI() {
  if (els.tipTimer) els.tipTimer.textContent = `${tipRemaining}s`;
  if (els.tipSub) els.tipSub.textContent = `${tipRemaining}s`;
}

function closeTipOverlay() {
  if (!els.tipOverlay) return;
  tipOpen = false;
  tipActiveKey = "";
  if (tipTimerId) {
    clearInterval(tipTimerId);
    tipTimerId = 0;
  }
  if (els.tipVideo) {
    try {
      els.tipVideo.pause();
    } catch {
      // ignore
    }
    els.tipVideo.removeAttribute("src");
    if (typeof els.tipVideo.load === "function") els.tipVideo.load();
  }
  els.tipOverlay.classList.remove("show");
  setTimeout(() => {
    els.tipOverlay.classList.add("hidden");
  }, 200);
  document.body.classList.remove("tip-open");
}

function openTipOverlay(key) {
  if (!els.tipOverlay) return;
  let tip = TIP_CHIPS[key] || null;
  if (!tip) {
    const chip = document.querySelector(`.tip-chip[data-tip="${key}"]`);
    if (chip) {
      tip = {
        title: chip.dataset.title || chip.textContent || "Video tip",
        text: chip.dataset.text || "",
        duration: Number(chip.dataset.duration) || 12,
        video: chip.dataset.video || ""
      };
    }
  }
  if (!tip) return;
  tipActiveKey = key;
  tipRemaining = clamp(Math.round(tip.duration || 12), TIP_MIN_SEC, TIP_MAX_SEC);
  if (els.tipTitle) els.tipTitle.textContent = tip.title || "Video tip";
  if (els.tipText) els.tipText.textContent = tip.text || "";
  updateTipTimerUI();
  if (els.tipVideoWrap) {
    if (tip.video && els.tipVideo) {
      els.tipVideo.src = tip.video;
      els.tipVideoWrap.classList.add("has-video");
      try {
        els.tipVideo.currentTime = 0;
        els.tipVideo.play().catch(() => {});
      } catch {
        // ignore
      }
    } else {
      els.tipVideoWrap.classList.remove("has-video");
    }
  }
  els.tipOverlay.classList.remove("hidden");
  requestAnimationFrame(() => els.tipOverlay.classList.add("show"));
  document.body.classList.add("tip-open");
  tipOpen = true;
  if (state.tipAudioEnabled) playTipAudio();
  if (tipTimerId) clearInterval(tipTimerId);
  tipTimerId = setInterval(() => {
    tipRemaining -= 1;
    if (tipRemaining <= 0) {
      tipRemaining = 0;
      updateTipTimerUI();
      closeTipOverlay();
      showTipQuizIfNeeded(key);
      return;
    }
    updateTipTimerUI();
  }, 1000);
}

function setTipAudioEnabled(enabled) {
  state.tipAudioEnabled = !!enabled;
  if (els.tipAudioBtn) {
    els.tipAudioBtn.textContent = state.tipAudioEnabled ? "Audio: On" : "Audio: Off";
    els.tipAudioBtn.classList.toggle("off", !state.tipAudioEnabled);
  }
  saveLocal();
}

function playTipAudio() {
  playTone({ type: "sine", freq: 620, duration: 0.08, volume: 0.08 });
  setTimeout(() => playTone({ type: "sine", freq: 740, duration: 0.08, volume: 0.08 }), 120);
}

function getTipQuizKey(key) {
  return `${TIP_QUIZ_KEY_PREFIX}${getDateKey()}_${key}`;
}

function isTipQuizDone(key) {
  try {
    return localStorage.getItem(getTipQuizKey(key)) === "1";
  } catch {
    return false;
  }
}

function markTipQuizDone(key) {
  try {
    localStorage.setItem(getTipQuizKey(key), "1");
  } catch {
    // ignore
  }
}

function showTipQuizIfNeeded(key) {
  if (!key || !TIP_QUIZ[key]) return;
  if (isTipQuizDone(key)) return;
  quizState = { active: true, key, index: 0, correct: 0 };
  renderQuizQuestion();
  if (els.quizOverlay) {
    els.quizOverlay.classList.remove("hidden");
    requestAnimationFrame(() => els.quizOverlay.classList.add("show"));
  }
}

function closeQuizOverlay() {
  quizState.active = false;
  if (!els.quizOverlay) return;
  els.quizOverlay.classList.remove("show");
  setTimeout(() => els.quizOverlay.classList.add("hidden"), 200);
}

function renderQuizQuestion() {
  if (!quizState.active) return;
  const list = TIP_QUIZ[quizState.key] || [];
  const item = list[quizState.index];
  if (!item || !els.quizQuestion || !els.quizOptions) {
    closeQuizOverlay();
    return;
  }
  if (els.quizTitle) els.quizTitle.textContent = "Mini quiz";
  if (els.quizSub) els.quizSub.textContent = `Cau ${quizState.index + 1}/${list.length}`;
  els.quizQuestion.textContent = item.q;
  els.quizOptions.innerHTML = item.options
    .map((opt, idx) => `<button type="button" data-idx="${idx}">${opt}</button>`)
    .join("");
}

function handleQuizAnswer(idx) {
  if (!quizState.active) return;
  const list = TIP_QUIZ[quizState.key] || [];
  const item = list[quizState.index];
  if (!item || !els.quizOptions) return;
  const buttons = Array.from(els.quizOptions.querySelectorAll("button"));
  buttons.forEach((btn) => btn.setAttribute("disabled", "true"));
  const correct = item.correct;
  if (idx === correct) {
    quizState.correct += 1;
    buttons[idx]?.classList.add("correct");
  } else {
    buttons[idx]?.classList.add("wrong");
    buttons[correct]?.classList.add("correct");
  }
}

function nextQuizStep() {
  if (!quizState.active) return;
  const list = TIP_QUIZ[quizState.key] || [];
  if (quizState.index >= list.length - 1) {
    markTipQuizDone(quizState.key);
    if (quizState.correct >= list.length) addXp(TIP_QUIZ_XP);
    showToast(`Quiz: ${quizState.correct}/${list.length} dung. +${quizState.correct >= list.length ? TIP_QUIZ_XP : 0} XP`);
    closeQuizOverlay();
    return;
  }
  quizState.index += 1;
  renderQuizQuestion();
}

function renderDailyTip() {
  if (!els.dailyTipText) return;
  const today = getDateKey();
  let selected = "";
  try {
    const raw = localStorage.getItem(DAILY_TIP_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data?.date === today && data?.text) {
        selected = data.text;
      }
    }
  } catch {
    // ignore
  }
  if (!selected) {
    const idx = Math.abs(hashString(today)) % tipPool.length;
    selected = tipPool[idx];
    try {
      localStorage.setItem(DAILY_TIP_KEY, JSON.stringify({ date: today, text: selected }));
    } catch {
      // ignore
    }
  }
  els.dailyTipText.textContent = selected;
}

let practiceTimerId = 0;
function updatePracticeUI() {
  if (!els.practiceTimer) return;
  const mins = Math.floor(state.practice.remaining / 60);
  const secs = state.practice.remaining % 60;
  els.practiceTimer.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  if (els.practiceSL) els.practiceSL.checked = !!state.practice.sl;
  if (els.practiceTP) els.practiceTP.checked = !!state.practice.tp;
  if (els.practiceOrder) els.practiceOrder.checked = !!state.practice.order;
}

function openPractice() {
  state.practice.active = true;
  state.practice.remaining = PRACTICE_DURATION_SEC;
  state.practice.sl = false;
  state.practice.tp = false;
  state.practice.order = false;
  if (els.practiceOverlay) els.practiceOverlay.classList.remove("hidden");
  updatePracticeUI();
  if (practiceTimerId) clearInterval(practiceTimerId);
  practiceTimerId = setInterval(() => {
    if (!state.practice.active) return;
    state.practice.remaining -= 1;
    if (state.practice.remaining <= 0) {
      state.practice.remaining = 0;
      updatePracticeUI();
      closePractice();
      showToast("Hoan thanh luyen tap 3 phut.");
      return;
    }
    updatePracticeUI();
  }, 1000);
}

function closePractice() {
  state.practice.active = false;
  if (practiceTimerId) {
    clearInterval(practiceTimerId);
    practiceTimerId = 0;
  }
  if (els.practiceOverlay) els.practiceOverlay.classList.add("hidden");
}

function markPracticeFromInputs() {
  if (!state.practice.active) return;
  const stopInput = parseFloat(els.orderStop?.value || "0");
  const takeInput = parseFloat(els.orderTake?.value || "0");
  if (stopInput > 0) state.practice.sl = true;
  if (takeInput > 0) state.practice.tp = true;
  updatePracticeUI();
}

function markPracticeOrder() {
  if (!state.practice.active) return;
  state.practice.order = true;
  updatePracticeUI();
}

function resolveOrderWarn(value) {
  if (els.orderWarnOverlay) {
    els.orderWarnOverlay.classList.remove("show");
    setTimeout(() => els.orderWarnOverlay.classList.add("hidden"), 200);
  }
  if (orderWarnState.resolve) {
    orderWarnState.resolve(!!value);
  }
  orderWarnState.resolve = null;
}

function showOrderWarn({ title, text, primary, secondary } = {}) {
  if (!els.orderWarnOverlay) return Promise.resolve(true);
  if (orderWarnState.resolve) {
    try {
      orderWarnState.resolve(false);
    } catch {
      // ignore
    }
  }
  if (els.orderWarnTitle) els.orderWarnTitle.textContent = title || "Canh bao";
  if (els.orderWarnText) els.orderWarnText.textContent = text || "";
  if (els.orderWarnPrimary) els.orderWarnPrimary.textContent = primary || "Tiep tuc";
  if (els.orderWarnSecondary) els.orderWarnSecondary.textContent = secondary || "Huy";
  els.orderWarnOverlay.classList.remove("hidden");
  requestAnimationFrame(() => els.orderWarnOverlay.classList.add("show"));
  return new Promise((resolve) => {
    orderWarnState.resolve = resolve;
  });
}

function updateRestTimer() {
  if (!els.restTimer) return;
  const remain = Math.max(0, (state.risk.restUntil || 0) - Date.now());
  const total = Math.ceil(remain / 1000);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  els.restTimer.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function showRestOverlay() {
  if (!els.restOverlay) return;
  updateRestTimer();
  els.restOverlay.classList.remove("hidden");
  requestAnimationFrame(() => els.restOverlay.classList.add("show"));
  if (restTimerId) clearInterval(restTimerId);
  restTimerId = setInterval(() => {
    if (!state.risk.restUntil || Date.now() >= state.risk.restUntil) {
      closeRestOverlay();
      return;
    }
    updateRestTimer();
  }, 1000);
}

function closeRestOverlay() {
  if (!els.restOverlay) return;
  els.restOverlay.classList.remove("show");
  setTimeout(() => els.restOverlay.classList.add("hidden"), 200);
  if (restTimerId) {
    clearInterval(restTimerId);
    restTimerId = 0;
  }
}

function getPollCountsKey() {
  return `${BULL_BEAR_COUNT_PREFIX}${getDateKey()}`;
}

function getPollVoteKey(username) {
  const safe = username || "guest";
  return `${BULL_BEAR_VOTE_PREFIX}${getDateKey()}_${safe}`;
}

function loadPollCounts() {
  try {
    const raw = localStorage.getItem(getPollCountsKey());
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return {
          bull: Number(parsed.bull) || 0,
          bear: Number(parsed.bear) || 0
        };
      }
    }
  } catch {
    // ignore
  }
  return { bull: 0, bear: 0 };
}

function savePollCounts(counts) {
  try {
    localStorage.setItem(getPollCountsKey(), JSON.stringify(counts));
  } catch {
    // ignore
  }
}

function getPollVote(username) {
  try {
    return localStorage.getItem(getPollVoteKey(username)) || "";
  } catch {
    return "";
  }
}

function setPollVote(username, side) {
  try {
    localStorage.setItem(getPollVoteKey(username), side || "");
  } catch {
    // ignore
  }
}

function renderBullBearPoll() {
  if (!els.pollCard) return;
  const counts = loadPollCounts();
  const total = counts.bull + counts.bear;
  const bullPct = total > 0 ? Math.round((counts.bull / total) * 100) : 50;
  const bearPct = 100 - bullPct;

  if (els.pollBullBar) els.pollBullBar.style.width = `${bullPct}%`;
  if (els.pollBearBar) els.pollBearBar.style.width = `${bearPct}%`;
  if (els.pollBullPct) els.pollBullPct.textContent = `${bullPct}% Bull`;
  if (els.pollBearPct) els.pollBearPct.textContent = `${bearPct}% Bear`;

  if (els.pollNote) {
    if (!currentUser) {
      els.pollNote.textContent = "Đăng nhập để bình chọn.";
    } else {
      const voted = getPollVote(currentUser);
      els.pollNote.textContent = voted ? `Bạn đã vote: ${voted.toUpperCase()}` : "Bạn chưa vote hôm nay.";
    }
  }
}

function voteBullBear(side) {
  if (!currentUser) {
    showToast("Vui lòng đăng nhập để vote.");
    return;
  }
  const voted = getPollVote(currentUser);
  if (voted) {
    showToast("Bạn đã vote hôm nay.");
    return;
  }
  const counts = loadPollCounts();
  if (side === "bull") counts.bull += 1;
  else counts.bear += 1;
  savePollCounts(counts);
  setPollVote(currentUser, side);
  addXp(BULL_BEAR_XP);
  showToast(`Cảm ơn! +${BULL_BEAR_XP} XP`);
  renderBullBearPoll();
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function renderBoosters() {
  if (!els.boosterShop || !els.boosterInventory) return;
  els.boosterShop.innerHTML = boosterCatalog
    .map((item) => {
      const priceVnd = item.priceUsd * FX_RATE;
      return `
        <div class="booster-item">
          <div>
            <div><strong>${item.title}</strong></div>
            <div class="panel-sub">${item.desc}</div>
            <div>${formatUSD(item.priceUsd)} | ${formatVND(priceVnd)}</div>
          </div>
          <button data-id="${item.id}">Mua</button>
        </div>
      `;
    })
    .join("");

  els.boosterShop.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => buyBooster(btn.dataset.id));
  });

  els.boosterInventory.innerHTML = `
    <div class="booster-item">
      <div>Thẻ bảo hiểm: <strong>${state.boosters.insurance}</strong></div>
      <div></div>
    </div>
    <div class="booster-item">
      <div>Thẻ ẩn danh: <strong>${state.boosters.anonymity}</strong></div>
      <div></div>
    </div>
  `;
}

function loadMailReadMap() {
  try {
    const raw = localStorage.getItem(MAIL_READ_KEY);
    mailReadMap = raw ? JSON.parse(raw) : {};
  } catch {
    mailReadMap = {};
  }
}

function saveMailReadMap() {
  try {
    localStorage.setItem(MAIL_READ_KEY, JSON.stringify(mailReadMap || {}));
  } catch {
    // ignore
  }
}

function getMailCategory(mail) {
  if (!mail || typeof mail !== "object") return "system";
  if (mail.type) return String(mail.type);
  const hasReward = !!mail.reward && (
    Number(mail.reward.usd) ||
    Number(mail.reward.vnd) ||
    (mail.reward.coins && Object.keys(mail.reward.coins || {}).length)
  );
  const hasItems = Array.isArray(mail.items) && mail.items.length > 0;
  if (hasReward || hasItems) return "reward";
  if (mail.from && String(mail.from).toLowerCase() !== "system") return "admin";
  return "system";
}

function markMailRead(mail) {
  if (!mail || !mail.id) return;
  if (!mail.readAt) mail.readAt = Date.now();
  if (!mailReadMap) mailReadMap = {};
  mailReadMap[mail.id] = mail.readAt;
  saveMailReadMap();
}

function applyMailReadState(mail) {
  if (!mail || !mail.id) return;
  if (mail.readAt) return;
  const ts = mailReadMap && mailReadMap[mail.id];
  if (ts) mail.readAt = ts;
}

function isToastMuted() {
  return state.muteUntil && Date.now() < state.muteUntil;
}

function setToastMute(minutes = 60) {
  state.muteUntil = Date.now() + minutes * 60 * 1000;
  try {
    localStorage.setItem(TOAST_MUTE_KEY, String(state.muteUntil));
  } catch {
    // ignore
  }
  updateMuteButton();
}

function updateMuteButton() {
  if (!els.mailMute) return;
  const now = Date.now();
  if (state.muteUntil && now < state.muteUntil) {
    const remainMin = Math.max(1, Math.ceil((state.muteUntil - now) / 60000));
    els.mailMute.textContent = `Muted ${remainMin}m`;
    els.mailMute.classList.add("active");
  } else {
    els.mailMute.textContent = "Mute 1h";
    els.mailMute.classList.remove("active");
  }
}

function updateMailBadge() {
  if (!els.mailCount) return;
  const inbox = Array.isArray(state.inbox) ? state.inbox : [];
  const unread = inbox.filter((m) => m && !m.claimedAt && !m.readAt).length;
  if (unread > 0) {
    els.mailCount.textContent = `${unread}`;
    els.mailCount.classList.remove("hidden");
  } else {
    els.mailCount.textContent = "0";
    els.mailCount.classList.add("hidden");
  }
}

function buildMailRewardText(reward = {}) {
  const parts = [];
  if (Number.isFinite(reward.usd) && reward.usd !== 0) {
    parts.push(`USD +${formatUSD(Math.abs(reward.usd))}`);
  }
  if (Number.isFinite(reward.vnd) && reward.vnd !== 0) {
    parts.push(`VND +${formatVND(Math.abs(reward.vnd))}`);
  }
  if (reward.coins && typeof reward.coins === "object") {
    Object.entries(reward.coins).forEach(([sym, qty]) => {
      const amount = Number(qty);
      if (!Number.isFinite(amount) || amount <= 0) return;
      parts.push(`${sym} +${formatNumber(amount)}`);
    });
  }
  if (reward.boosters && typeof reward.boosters === "object") {
    const ins = Number(reward.boosters.insurance) || 0;
    const anon = Number(reward.boosters.anonymity) || 0;
    if (ins > 0) parts.push(`Thẻ bảo hiểm +${ins}`);
    if (anon > 0) parts.push(`Thẻ ẩn danh +${anon}`);
  }
  return parts.join(" • ");
}

function buildMailItemsText(items = []) {
  if (!Array.isArray(items) || !items.length) return "";
  const parts = items.map((it) => {
    const name = escapeHtml(it?.name || "Vật phẩm");
    const durationText = formatDurationMs(Number(it?.durationMs) || 0);
    const type = String(it?.type || "buff");
    const typeLabel = type === "boost_insurance"
      ? "Thẻ bảo hiểm"
      : type === "boost_anonymity"
        ? "Thẻ ẩn danh"
        : "Buff";
    return `${name} (${typeLabel}, ${durationText})`;
  });
  return parts.join(" • ");
}

function renderMailInbox() {
  if (!els.mailList) return;
  const inbox = Array.isArray(state.inbox) ? state.inbox : [];
  inbox.forEach((m) => applyMailReadState(m));
  const filter = state.mailFilter || "all";
  const filtered = inbox.filter((mail) => {
    if (!mail) return false;
    if (filter === "all") return true;
    return getMailCategory(mail) === filter;
  });
  if (!filtered.length) {
    els.mailList.innerHTML = `<div class="mail-empty">Chưa có thư.</div>`;
    return;
  }
  els.mailList.innerHTML = filtered.map((mail) => {
    const claimed = !!mail.claimedAt;
    const rewardText = buildMailRewardText(mail.reward || {});
    const itemsText = buildMailItemsText(mail.items || []);
    const readClass = mail.readAt || claimed ? "read" : "";
    return `
      <div class="mail-item ${readClass}" data-mail="${mail.id}">
        <div>
          <h4>${escapeHtml(mail.title || "Thông báo")}</h4>
          <div class="mail-meta">${escapeHtml(mail.from || "admin")} • ${formatDateTime(mail.createdAt)}</div>
          <div>${escapeHtml(mail.message || "")}</div>
          ${rewardText ? `<div class="mail-reward">Phần thưởng: ${rewardText}</div>` : ""}
          ${itemsText ? `<div class="mail-reward">Vật phẩm: ${itemsText}</div>` : ""}
        </div>
        <div class="mail-actions">
          ${claimed ? "<span class=\"mail-meta\">Đã nhận</span>" : `<button class="primary" data-claim="${mail.id}">Nhận</button>`}
        </div>
      </div>
    `;
  }).join("");
}

function renderInventory() {
  if (!els.inventoryList) return;
  const items = Array.isArray(state.inventory) ? state.inventory : [];
  if (!items.length) {
    els.inventoryList.innerHTML = `<div class="mail-empty">Chưa có vật phẩm.</div>`;
    return;
  }
  els.inventoryList.innerHTML = items.map((item) => {
    const type = String(item.type || "buff");
    const typeLabel = type === "boost_insurance"
      ? "Thẻ bảo hiểm"
      : type === "boost_anonymity"
        ? "Thẻ ẩn danh"
        : "Buff";
    const effectLabel = item.effect === "x2_leverage" ? "X2 đòn bẩy" : "";
    const durationText = formatDurationMs(Number(item.durationMs) || 0);
    return `
      <div class="mail-item">
        <div>
          <h4>${escapeHtml(item.name || "Vật phẩm")}</h4>
          <div class="mail-meta">${escapeHtml(item.desc || "")}</div>
          <div class="mail-reward">Loại: ${typeLabel}${effectLabel ? ` • ${effectLabel}` : ""} • ${durationText}</div>
        </div>
        <div class="mail-actions">
          <button class="primary" data-use="${item.id}">Sử dụng</button>
        </div>
      </div>
    `;
  }).join("");
}

function renderActiveBuffs() {
  if (!els.activeBuffList) return;
  const now = Date.now();
  const buffs = Array.isArray(state.activeBuffs)
    ? state.activeBuffs.filter((b) => !b?.activeUntil || b.activeUntil > now)
    : [];
  if (!buffs.length) {
    els.activeBuffList.innerHTML = `<div class="mail-empty">Chưa có buff.</div>`;
    return;
  }
  els.activeBuffList.innerHTML = buffs.map((buff) => {
    const until = Number(buff.activeUntil) || 0;
    const remaining = until ? Math.max(0, until - now) : 0;
    const durationText = until ? formatDurationMs(remaining) : "Vĩnh viễn";
    const effectLabel = buff.effect === "x2_leverage" ? "X2 đòn bẩy" : "";
    return `
      <div class="mail-item">
        <div>
          <h4>${escapeHtml(buff.name || "Buff")}</h4>
          <div class="mail-meta">${escapeHtml(buff.desc || "")}</div>
          <div class="mail-reward">Còn lại: ${durationText}${effectLabel ? ` • ${effectLabel}` : ""}</div>
        </div>
      </div>
    `;
  }).join("");
}

function toggleMailOverlay(show) {
  if (!els.mailOverlay) return;
  if (show) {
    renderMailInbox();
    renderInventory();
    renderActiveBuffs();
    updateMailBadge();
    els.mailOverlay.classList.remove("hidden");
    requestAnimationFrame(() => els.mailOverlay.classList.add("show"));
  } else {
    els.mailOverlay.classList.remove("show");
    setTimeout(() => els.mailOverlay.classList.add("hidden"), 200);
  }
}

function showBroadcastNotice(payload = {}) {
  if (isToastMuted()) return;
  if (!els.broadcastOverlay || !els.broadcastMessage) return;
  const message = String(payload.message || payload.text || "").trim();
  const durationMs = Math.min(120000, Math.max(5000, Number(payload.durationMs || payload.duration || 30000)));
  if (!message) return;
  els.broadcastMessage.textContent = message;
  if (els.broadcastTimer) els.broadcastTimer.textContent = `Tự đóng sau ${Math.ceil(durationMs / 1000)}s`;
  els.broadcastOverlay.classList.remove("hidden");
  requestAnimationFrame(() => els.broadcastOverlay.classList.add("show"));
  if (broadcastTimerId) clearInterval(broadcastTimerId);
  if (broadcastHideTimer) clearTimeout(broadcastHideTimer);
  const start = Date.now();
  broadcastTimerId = setInterval(() => {
    const remainMs = Math.max(0, durationMs - (Date.now() - start));
    if (els.broadcastTimer) {
      els.broadcastTimer.textContent = `Tự đóng sau ${Math.ceil(remainMs / 1000)}s`;
    }
    if (remainMs <= 0 && broadcastTimerId) {
      clearInterval(broadcastTimerId);
      broadcastTimerId = null;
    }
  }, 300);
  broadcastHideTimer = setTimeout(() => {
    els.broadcastOverlay.classList.remove("show");
    setTimeout(() => els.broadcastOverlay.classList.add("hidden"), 250);
  }, durationMs);
}

function renderBots() {
  if (!els.botList) return;
  els.botList.innerHTML = botTraders
    .map((bot) => {
      const active = state.copyBotId === bot.id;
      return `
        <div class="bot-card ${active ? "active" : ""}">
          <div>
            <div><strong>${bot.name}</strong> · ${bot.style}</div>
            <div class="bot-meta">Risk: ${bot.risk} · Cặp: ${bot.symbol}/${state.quote}</div>
          </div>
          <button data-id="${bot.id}">${active ? "Stop" : "Copy"}</button>
        </div>
      `;
    })
    .join("");

  els.botList.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => toggleCopyBot(btn.dataset.id));
  });
}

function toggleCopyBot(id) {
  if (state.copyBotId === id) {
    state.copyBotId = null;
    showToast("Đã dừng copy bot.");
  } else {
    state.copyBotId = id;
    showToast("Đang copy bot trader.");
  }
  renderBots();
  localStorage.setItem("tradingGameCopyBot", state.copyBotId || "");
}

function initCopyBot() {
  const saved = localStorage.getItem("tradingGameCopyBot");
  if (saved) state.copyBotId = saved;
  renderBots();
}

function botBuy(symbol, usdAmount) {
  if (usdAmount <= 0) return;
  let costUsd = usdAmount;
  if (state.usd < costUsd && state.vnd >= costUsd * FX_RATE) {
    state.vnd -= costUsd * FX_RATE;
  } else if (state.usd >= costUsd) {
    state.usd -= costUsd;
  } else {
    return;
  }
  const price = calcSlippage(state.market[symbol].price, usdAmount / state.market[symbol].price, "buy");
  const qty = costUsd / price;
  const fee = costUsd * getFeeRate();
  if (state.usd >= fee) state.usd -= fee;
  else if (state.vnd >= fee * FX_RATE) state.vnd -= fee * FX_RATE;
  else return;
  state.holdings[symbol] += qty;
  const oldQty = state.holdings[symbol] - qty;
  const oldAvg = state.costBasis[symbol] || 0;
  const newAvg = ((oldQty * oldAvg) + qty * price) / (oldQty + qty);
  state.costBasis[symbol] = newAvg;
  if (!state.holdingStart[symbol]) state.holdingStart[symbol] = Date.now();
  addTrade({ symbol, price, qty, side: "buy" });
  playTradeSound();
}

function botSell(symbol, usdAmount) {
  const price = state.market[symbol].price;
  const qtyTarget = usdAmount / price;
  const qty = Math.min(state.holdings[symbol], qtyTarget);
  if (qty <= 0) return;
  const saleUsd = qty * price;
  const fee = saleUsd * getFeeRate();
  state.holdings[symbol] -= qty;
  const avg = state.costBasis[symbol] || 0;
  const pnl = (price - avg) * qty;
  recordPnl(pnl);
  if (state.holdings[symbol] <= 0) {
    state.costBasis[symbol] = 0;
    state.holdingStart[symbol] = null;
  }
  if (state.usd >= 0) state.usd += saleUsd - fee;
  addTrade({ symbol, price, qty, side: "sell" });
  playTradeSound();
}

function runCopyBot() {
  if (!state.copyBotId) return;
  const bot = botTraders.find((b) => b.id === state.copyBotId);
  if (!bot) return;
  const now = Date.now();
  const botState = state.botStates[bot.id] || { last: 0 };
  if (now - botState.last < bot.cooldown) return;
  const history = chartData.get(bot.symbol);
  if (!history || history.length < 30) return;

  const price = history[history.length - 1];
  const prev = history[history.length - 2];
  const ma14 = calcMA(history, 14).pop();
  const ma20 = calcMA(history, 20).pop();
  const recent = history.slice(-20);
  const high = Math.max(...recent);
  const low = Math.min(...recent);

  let signal = null;
  if (bot.style === "Momentum" && ma14) {
    if (price > ma14 * 1.002) signal = "buy";
    if (price < ma14 * 0.998) signal = "sell";
  } else if (bot.style === "Mean Reversion" && ma20) {
    if (price < ma20 * 0.985) signal = "buy";
    if (price > ma20 * 1.015) signal = "sell";
  } else if (bot.style === "Breakout") {
    if (price > high * 1.002) signal = "buy";
    if (price < low * 0.998) signal = "sell";
  } else if (bot.style === "Scalping") {
    const change = (price - prev) / prev;
    if (change > 0.004) signal = "buy";
    if (change < -0.004) signal = "sell";
  }

  if (!signal) return;
  const equityUsd = totalEquityUSD();
  const usdAmount = equityUsd * bot.size;
  if (signal === "buy") botBuy(bot.symbol, usdAmount);
  else botSell(bot.symbol, usdAmount);
  botState.last = now;
  state.botStates[bot.id] = botState;
}
function buyBooster(id) {
  const item = boosterCatalog.find((b) => b.id === id);
  if (!item) return;
  const priceUsd = item.priceUsd;
  const priceVnd = priceUsd * FX_RATE;
  if (state.usd >= priceUsd) {
    state.usd -= priceUsd;
  } else if (state.vnd >= priceVnd) {
    state.vnd -= priceVnd;
  } else {
    showToast("Không đủ tiền để mua booster.");
    return;
  }
  state.boosters[id] += 1;
  renderBoosters();
  updateBalances();
  saveLocal();
  showToast(`Đã mua ${item.title}.`);
}

const newsPool = [
  { text: "Elon Musk tweet về Dogecoin!", symbol: "DOGE", mult: 1.2 },
  { text: "ETF Bitcoin được nhắc đến trên truyền thông!", symbol: "BTC", mult: 1.15 },
  { text: "Cộng đồng Solana bùng nổ chiến dịch mới!", symbol: "SOL", mult: 1.18 },
  { text: "Tin đồn airdrop làm SUI sôi động.", symbol: "SUI", mult: 1.2 },
  { text: "Cá voi gom hàng ETH quy mô lớn.", symbol: "ETH", mult: 1.12 },
  { text: "Hệ sinh thái ARB tăng trưởng mạnh.", symbol: "ARB", mult: 1.18 }
];

function renderNews(items) {
  const html = items
    .map((item) => {
      const label = item.symbol ? `<strong>${item.symbol}</strong> ` : "";
      return `<div class="news-item">${label}${item.text}</div>`;
    })
    .join("");
  els.newsTrack.innerHTML = html + html;
}

function pushNews(item) {
  state.newsItems.unshift(item);
  state.newsItems = state.newsItems.slice(0, 6);
  renderNews(state.newsItems);
}

function addVolBoost(symbol, mult, durationMs) {
  const now = Date.now();
  const expires = now + durationMs;
  const existing = state.volBoosts[symbol];
  if (existing) {
    state.volBoosts[symbol] = {
      mult: Math.max(existing.mult, mult),
      expires: Math.max(existing.expires, expires)
    };
    return;
  }
  state.volBoosts[symbol] = { mult, expires };
}

function triggerNews() {
  const item = newsPool[Math.floor(Math.random() * newsPool.length)];
  addVolBoost(item.symbol, item.mult, 60000);
  pushNews({ symbol: item.symbol, text: item.text });
  showToast(`Tin nóng: ${item.text} Volatility tăng 1 phút.`);
}

function scheduleNews() {
  state.newsItems = [...newsPool.slice(0, 5)];
  renderNews(state.newsItems);
  setInterval(() => {
    if (Math.random() < 0.7) triggerNews();
  }, 30000);
}

function triggerBlackSwan() {
  if (state.macro.blackSwan) return;
  const start = Date.now();
  const duration = 5 * 60 * 1000;
  const dropPct = 0.5 + Math.random() * 0.3;
  const startPrices = {};
  coins.forEach((coin) => {
    startPrices[coin.symbol] = state.market[coin.symbol].price;
    addVolBoost(coin.symbol, 3, duration);
  });
  state.macro.blackSwan = { start, duration, dropPct, startPrices };
  pushNews({ symbol: "ALL", text: "Thiên nga đen! Thị trường lao dốc mạnh." });
  showToast("Cảnh báo: Black Swan! Giá có thể giảm 50-80% trong 5 phút.");
}

function triggerPumpGroup() {
  const now = Date.now();
  if (state.macro.pumpGroup && state.macro.pumpGroup.expires > now) return;
  const candidates = coins.filter(
    (c) => c.base < 1 && !["BTC", "ETH", "BNB"].includes(c.symbol)
  );
  if (candidates.length === 0) return;
  const count = Math.min(4, Math.max(2, Math.floor(Math.random() * 4) + 2));
  const pool = [...candidates];
  const picks = [];
  while (picks.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    picks.push(pool.splice(idx, 1)[0]);
  }
  const duration = 60 * 1000;
  picks.forEach((coin) => addVolBoost(coin.symbol, 10, duration));
  state.macro.pumpGroup = { symbols: picks.map((c) => c.symbol), expires: now + duration };
  pushNews({ symbol: "PUMP", text: `Nhóm lái đẩy giá: ${picks.map((c) => c.symbol).join(", ")}` });
}

const calendarEvents = [
  { id: "fed_rate", time: "20:00", text: "Công bố lãi suất FED", symbol: "BTC", mult: 2.8, duration: 20 * 60 * 1000 },
  { id: "cpi", time: "14:00", text: "CPI Hoa Kỳ công bố", symbol: "BTC", mult: 2.3, duration: 15 * 60 * 1000 },
  { id: "jobs", time: "08:30", text: "Báo cáo việc làm (NFP)", symbol: "BTC", mult: 2.5, duration: 15 * 60 * 1000 }
];

function triggerCalendarEvent(event) {
  addVolBoost(event.symbol, event.mult, event.duration);
  pushNews({ symbol: event.symbol, text: `${event.text} - biến động mạnh!` });
  showToast(`Lịch kinh tế: ${event.text}`);
}

function checkCalendarEvents() {
  const now = new Date();
  const hhmm = now.toISOString().slice(11, 16);
  const dayKey = now.toISOString().slice(0, 10);
  calendarEvents.forEach((event) => {
    const key = `${event.id}-${dayKey}`;
    if (hhmm === event.time && !state.macro.calendarFired[key]) {
      state.macro.calendarFired[key] = true;
      triggerCalendarEvent(event);
    }
  });
}

function scheduleMacroEvents() {
  setInterval(() => {
    if (Math.random() < 0.001) triggerBlackSwan();
    if (Math.random() < 0.04) triggerPumpGroup();
  }, 60000);
  setInterval(checkCalendarEvents, 30000);
}

function applyBlackSwan(coin, market) {
  const bs = state.macro.blackSwan;
  if (!bs) return;
  const now = Date.now();
  if (now - bs.start >= bs.duration) {
    state.macro.blackSwan = null;
    return;
  }
  const progress = Math.min(1, (now - bs.start) / bs.duration);
  const startPrice = bs.startPrices[coin.symbol] || market.price;
  const target = startPrice * (1 - bs.dropPct * progress);
  const floor = startPrice * (1 - bs.dropPct);
  if (market.price > target) market.price = target;
  if (market.price < floor) market.price = floor;
}

async function fetchLivePrices() {
  const now = Date.now();
  if (liveFeedBlockedUntil && now < liveFeedBlockedUntil) return;
  if (liveFeedInFlight) return;
  liveFeedInFlight = true;
  const activeSymbols = getActiveSymbols();
  const ids = coins
    .filter((c) => activeSymbols.has(c.symbol) && c.cgId)
    .map((c) => c.cgId);
  if (ids.length === 0) {
    liveFeedInFlight = false;
    return;
  }
  const uniq = [...new Set(ids)];
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${uniq.join(",")}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 429) {
        liveFeedBackoffMs = liveFeedBackoffMs
          ? Math.min(LIVE_FEED_MAX_MS, Math.round(liveFeedBackoffMs * 2))
          : 120000;
        liveFeedBlockedUntil = Date.now() + liveFeedBackoffMs;
        if (Date.now() - liveFeedLastNotice > 60000) {
          liveFeedLastNotice = Date.now();
          showToast("CoinGecko bi gioi han. Tam ngung lay gia.");
        }
      }
      liveFeedInFlight = false;
      return;
    }
    const data = await res.json();
    liveFeedBackoffMs = 0;
    liveFeedBlockedUntil = 0;
    coins.forEach((coin) => {
      if (!coin.cgId || !data[coin.cgId]) return;
      if (!activeSymbols.has(coin.symbol)) return;
      const payload = data[coin.cgId];
      const price = payload.usd;
      if (!price) return;
      const market = state.market[coin.symbol];
      market.prev = market.price;
      market.price = price;
      if (typeof payload.usd_24h_vol === "number") market.vol = payload.usd_24h_vol;
      if (typeof payload.usd_24h_change === "number") {
        const change = payload.usd_24h_change;
        const base = price / (1 + change / 100);
        market.open = base > 0 ? base : market.open;
      }
      market.high = Math.max(market.high, price);
      market.low = Math.min(market.low, price);
      state.liveSymbols.add(coin.symbol);
      const history = chartData.get(coin.symbol) || [];
      if (history.length === 0) history.push(market.price);
      history[history.length - 1] = market.price;
      chartData.set(coin.symbol, history);
    });
    liveFeedInFlight = false;
  } catch {
    // ignore errors, fallback to simulation
    liveFeedInFlight = false;
  }
}

let liveFeedTimer = null;
let liveFeedInFlight = false;
let liveFeedBlockedUntil = 0;
let liveFeedBackoffMs = 0;
let liveFeedLastNotice = 0;
const LIVE_FEED_BASE_MS = 60000;
const LIVE_FEED_MAX_MS = 10 * 60 * 1000;
function startLiveFeed() {
  if (liveFeedTimer) return;
  fetchLivePrices();
  liveFeedTimer = setInterval(fetchLivePrices, LIVE_FEED_BASE_MS);
}

function stopLiveFeed() {
  if (!liveFeedTimer) return;
  clearInterval(liveFeedTimer);
  liveFeedTimer = null;
}

function startOfflineMode() {
  if (socketState.offline) return;
  socketState.offline = true;
  socketState.connected = false;
  state.marketFromServer = false;
  startLiveFeed();
  updateConnectionBadge();
  showToast("Mất kết nối server, chuyển sang chế độ offline.");
}

function updateConnectionBadge() {
  if (!els.netBadge) return;
  const online = socketState.connected && !socketState.offline;
  els.netBadge.textContent = online ? "Dang ket noi" : "Mat ket noi";
  els.netBadge.classList.toggle("online", online);
  els.netBadge.classList.toggle("offline", !online);
}

function updatePendingBadge() {
  if (!els.pendingBadge) return;
  const count = pendingOrders.size;
  if (count > 0) {
    els.pendingBadge.textContent = `Dang xu ly: ${count}`;
    els.pendingBadge.classList.remove("hidden");
  } else {
    els.pendingBadge.classList.add("hidden");
  }
}

function buildMarketTableLegacy() {
  els.marketTable.innerHTML = "";
  rowMap.clear();
  const header = document.createElement("div");
  header.className = "market-header";
  header.innerHTML = `
    <div>Cặp</div>
    <div>Giá</div>
    <div>24h</div>
    <div class="vol-toggle">Vol <button id="marketToggleBtn" class="market-toggle-btn" type="button">${state.marketCollapsed ? "-" : "+"}</button></div>
  `;
  els.marketTable.appendChild(header);
  const toggleBtn = header.querySelector("#marketToggleBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const next = !state.marketCollapsed;
      setMarketCollapsed(next);
      toggleBtn.textContent = next ? "-" : "+";
    });
  }

  coins.forEach((coin) => {
    const iconHtml = coin.icon
      ? `<img class="coin-icon-img" src="${coin.icon}" alt="${coin.symbol}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />`
      : "";
    const fallbackStyle = coin.icon ? "" : ' style="display:inline-flex"';
    const fallback = `<span class="coin-icon-fallback"${fallbackStyle}>${coin.symbol.slice(0, 2)}</span>`;
    const row = document.createElement("div");
    row.className = "market-row";
    row.dataset.symbol = coin.symbol;
    row.innerHTML = `
      <div class="coin">
        <div class="coin-icon">${iconHtml}${fallback}</div>
        <div>
          <div class="coin-sym">${coin.symbol}</div>
          <div class="coin-name">${coin.name}</div>
        </div>
        <button class="star" aria-label="Theo dõi">☆</button>
      </div>
      <div class="price" data-field="price"></div>
      <div class="change" data-field="change"></div>
      <div class="vol" data-field="vol"></div>
    `;

    row.querySelector(".star").addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(coin.symbol);
    });

    row.addEventListener("click", () => selectCoin(coin.symbol));
    rowMap.set(coin.symbol, row);
    els.marketTable.appendChild(row);
  });
  if (els.marketTable) {
    els.marketTable.classList.toggle("collapsed", state.marketCollapsed);
  }
}

function toggleFavoriteLegacy(symbol) {
  const row = rowMap.get(symbol);
  if (!row) return;
  if (state.favorites.has(symbol)) {
    state.favorites.delete(symbol);
  } else {
    state.favorites.add(symbol);
  }
  const star = row.querySelector(".star");
  star.classList.toggle("active", state.favorites.has(symbol));
  applyFilters();
}

function setMarketCollapsedLegacy(collapsed) {
  state.marketCollapsed = !!collapsed;
  if (els.marketTable) {
    els.marketTable.classList.toggle("collapsed", state.marketCollapsed);
  }
  applyFilters();
}

function applyFiltersLegacy() {
  if (state.marketCollapsed) {
    coins.forEach((coin) => {
      const row = rowMap.get(coin.symbol);
      if (!row) return;
      row.style.display = coin.symbol === state.selected ? "grid" : "none";
    });
    return;
  }
  const keyword = els.searchInput.value.toLowerCase().trim();
  const onlyFav = els.watchFav.classList.contains("active");
  const quickLetter = state.quickLetter.toLowerCase();

  coins.forEach((coin) => {
    const row = rowMap.get(coin.symbol);
    const symbolText = coin.symbol.toLowerCase();
    const nameText = coin.name.toLowerCase();
    const matchKeyword = keyword
      ? (symbolText.includes(keyword) || nameText.includes(keyword))
      : true;
    const matchQuick = quickLetter
      ? (symbolText.includes(quickLetter) || nameText.includes(quickLetter))
      : true;
    const matchFav = !onlyFav || state.favorites.has(coin.symbol);
    row.style.display = matchKeyword && matchQuick && matchFav ? "grid" : "none";
  });
}

function buildQuickLetters() {
  if (!els.quickLetters) return;
  const letters = ["Tất", ...Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ")];
  els.quickLetters.innerHTML = "";
  letters.forEach((letter) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = letter;
    btn.dataset.letter = letter === "Tất" ? "" : letter.toLowerCase();
    btn.addEventListener("click", () => {
      state.quickLetter = btn.dataset.letter || "";
      Array.from(els.quickLetters.querySelectorAll("button")).forEach((b) => {
        b.classList.toggle("active", b === btn);
      });
      applyFilters();
    });
    els.quickLetters.appendChild(btn);
  });
}

function updateRows() {
  rowMap.forEach((row, symbol) => {
    const market = state.market[symbol];
    if (!row || !market) return;

    const priceEl = row.querySelector("[data-field='price']");
    const changeEl = row.querySelector("[data-field='change']");
    const volEl = row.querySelector("[data-field='vol']");

    const priceQuote = toQuote(market.price);
    priceEl.textContent = state.quote === "USD" ? formatUSD(priceQuote) : formatVND(priceQuote);

    const base = market.open || market.price || 1;
    const change = ((market.price - base) / base) * 100;
    changeEl.textContent = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
    changeEl.classList.toggle("up", change >= 0);
    changeEl.classList.toggle("down", change < 0);

    const volQuote = toQuote(market.vol);
    volEl.textContent = formatNumber(volQuote);

    if (market.price > market.prev) {
      row.classList.add("flash-up");
      setTimeout(() => row.classList.remove("flash-up"), 500);
    } else if (market.price < market.prev) {
      row.classList.add("flash-down");
      setTimeout(() => row.classList.remove("flash-down"), 500);
    }
  });
}

function selectCoin(symbol) {
  if (!state.market[symbol]) return;
  state.selected = symbol;
  rowMap.forEach((row) => row.classList.remove("selected"));
  const selectedRow = rowMap.get(symbol);
  if (selectedRow) selectedRow.classList.add("selected");
  const history = chartData.get(symbol);
  if (!history || history.length === 0) {
    chartData.set(symbol, [state.market[symbol].price]);
    normalizeChartDataLength();
  }
  state.chartSlots[0] = symbol;
  resetChartViewport(0, true);
  if (els.slotSelects[0] && els.slotSelects[0].value !== symbol) {
    els.slotSelects[0].value = symbol;
  }
  renderTvSlot(0);
  updatePairHeader();
  updateOrderInputs();
  buildOrderBook();
  renderTrades();
  scheduleChartDraw();
  if (state.marketCollapsed) {
    applyFilters();
  }
}

function updatePairHeader() {
  const market = state.market[state.selected];
  const coin = coins.find((item) => item.symbol === state.selected);
  if (!market || !coin) return;
  els.pairTitle.textContent = `${coin.symbol}/${state.quote}`;
  els.pairSub.textContent = coin.name;

  const priceQuote = toQuote(market.price);
  const prevPrice = priceCache.get("pair") ?? priceQuote;
  animateNumber(els.priceNow, prevPrice, priceQuote, state.quote === "USD" ? formatUSD : formatVND, 420);
  priceCache.set("pair", priceQuote);
  const change = ((market.price - market.open) / market.open) * 100;
  els.priceChange.textContent = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
  els.priceChange.classList.toggle("up", change >= 0);
  els.priceChange.classList.toggle("down", change < 0);

  if (market.price > market.prev) {
    els.priceNow.classList.add("flash-up");
    setTimeout(() => els.priceNow.classList.remove("flash-up"), 500);
  } else if (market.price < market.prev) {
    els.priceNow.classList.add("flash-down");
    setTimeout(() => els.priceNow.classList.remove("flash-down"), 500);
  }

  els.high24.textContent = state.quote === "USD" ? formatUSD(toQuote(market.high)) : formatVND(toQuote(market.high));
  els.low24.textContent = state.quote === "USD" ? formatUSD(toQuote(market.low)) : formatVND(toQuote(market.low));
  els.vol24.textContent = formatNumber(toQuote(market.vol));
}

function updateBalances() {
  const prevUsd = balanceCache.usd ?? state.usd;
  const prevVnd = balanceCache.vnd ?? state.vnd;
  animateNumber(els.usdBalance, prevUsd, state.usd, formatUSD);
  animateNumber(els.vndBalance, prevVnd, state.vnd, formatVND, 520);
  balanceCache.usd = state.usd;
  balanceCache.vnd = state.vnd;
  updateUserRank();
}

function updatePortfolio() {
  const entries = Object.entries(state.holdings)
    .filter(([, qty]) => qty > 0.0000001)
    .map(([symbol, qty]) => {
      const price = state.market[symbol].price;
      return { symbol, qty, valueUsd: price * qty };
    })
    .sort((a, b) => b.valueUsd - a.valueUsd);

  if (entries.length === 0) {
    els.portfolioList.innerHTML = `<div class="portfolio-row">Chưa có tài sản</div>`;
    return;
  }

  els.portfolioList.innerHTML = entries
    .map((entry) => {
      const valueVnd = entry.valueUsd * FX_RATE;
      const icon = getCoinIcon(entry.symbol);
      const iconHtml = icon
        ? `<img class="mini-icon" src="${icon}" alt="${entry.symbol}" loading="lazy" onerror="this.style.display='none';" />`
        : "";
      return `
        <div class="portfolio-row">
          <div class="portfolio-coin">${iconHtml}<span>${entry.symbol}</span></div>
          <div>${entry.qty.toFixed(6)}</div>
          <div>${formatUSD(entry.valueUsd)} | ${formatVND(valueVnd)}</div>
        </div>
      `;
    })
    .join("");
}

function renderPositions() {
  if (state.positions.length === 0) {
    els.positionsList.innerHTML = `<div class="position-row">Chưa có vị thế</div>`;
    return;
  }

  els.positionsList.innerHTML = state.positions
    .map((pos) => {
      const price = state.market[pos.symbol].price;
      const pnl = pos.side === "buy"
        ? (price - pos.entry) * pos.qty * pos.leverage
        : (pos.entry - price) * pos.qty * pos.leverage;
      const marginUsd = pos.quote === "USD" ? pos.margin : pos.margin / FX_RATE;
      const threshold = Math.max(15, marginUsd * 0.12);
      const pnlClass = pnl >= threshold ? "pnl-good" : pnl <= -threshold ? "pnl-bad" : "";
      const icon = getCoinIcon(pos.symbol);
      const iconHtml = icon
        ? `<img class="mini-icon" src="${icon}" alt="${pos.symbol}" loading="lazy" onerror="this.style.display='none';" />`
        : "";
      return `
        <div class="position-row ${pnlClass}">
          <div class="position-coin">${iconHtml}<span>${pos.symbol} x${pos.leverage}</span></div>
          <div>${pos.side === "buy" ? "Long" : "Short"}</div>
          <div class="pnl-cell">PnL <span class="pnl-value" data-id="${pos.id}" data-pnl="${pnl}"></span></div>
          <button data-id="${pos.id}">Đóng</button>
        </div>
      `;
    })
    .join("");

  els.positionsList.querySelectorAll(".pnl-value").forEach((el) => {
    const id = el.dataset.id;
    const next = parseFloat(el.dataset.pnl);
    const prev = pnlCache.get(id);
    animateNumber(el, prev ?? next, next, formatPnl, 520);
    pnlCache.set(id, next);
  });

  els.positionsList.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => closePosition(parseFloat(btn.dataset.id)));
  });
}

function totalEquityUSD() {
  const spotValue = Object.entries(state.holdings).reduce((sum, [symbol, qty]) => {
    const data = state.market?.[symbol];
    if (!data || !Number.isFinite(data.price)) return sum;
    return sum + qty * data.price;
  }, 0);
  const marginValue = state.positions.reduce((sum, pos) => {
    return sum + (pos.quote === "USD" ? pos.margin : pos.margin / FX_RATE);
  }, 0);
  const positionsPnl = state.positions.reduce((sum, pos) => {
    const data = state.market?.[pos.symbol];
    if (!data || !Number.isFinite(data.price)) return sum;
    const price = data.price;
    const pnl = pos.side === "buy"
      ? (price - pos.entry) * pos.qty * pos.leverage
      : (pos.entry - price) * pos.qty * pos.leverage;
    return sum + pnl;
  }, 0);
  return state.usd + state.vnd / FX_RATE + spotValue + marginValue + positionsPnl;
}

let equityCtx = null;
function resizeEquityCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = els.equityChart.getBoundingClientRect();
  els.equityChart.width = rect.width * dpr;
  els.equityChart.height = rect.height * dpr;
  equityCtx = els.equityChart.getContext("2d");
  equityCtx.setTransform(1, 0, 0, 1, 0, 0);
  equityCtx.scale(dpr, dpr);
}

let depthCtx = null;
function resizeDepthCanvas() {
  if (!els.depthChart) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = els.depthChart.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;
  els.depthChart.width = rect.width * dpr;
  els.depthChart.height = rect.height * dpr;
  depthCtx = els.depthChart.getContext("2d");
  depthCtx.setTransform(1, 0, 0, 1, 0, 0);
  depthCtx.scale(dpr, dpr);
}

function drawDepthToCanvas(canvas, asks, bids, strong = false) {
  if (!canvas) return;
  const ctx = getCanvasContext(canvas);
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  if (!asks.length || !bids.length) return;

  const padding = strong ? 14 : 10;
  const w = rect.width - padding * 2;
  const h = rect.height - padding * 2;

  const bidSorted = [...bids].sort((a, b) => a.price - b.price);
  const askSorted = [...asks].sort((a, b) => a.price - b.price);

  let cum = 0;
  const bidPoints = bidSorted.map((b) => {
    cum += b.amount;
    return { price: b.price, amount: cum };
  });
  cum = 0;
  const askPoints = askSorted.map((a) => {
    cum += a.amount;
    return { price: a.price, amount: cum };
  });

  const minPrice = Math.min(bidPoints[0].price, askPoints[0].price);
  const maxPrice = Math.max(bidPoints[bidPoints.length - 1].price, askPoints[askPoints.length - 1].price);
  const maxAmount = Math.max(bidPoints[bidPoints.length - 1].amount, askPoints[askPoints.length - 1].amount);
  const priceRange = maxPrice - minPrice || 1;

  const toX = (price) => padding + ((price - minPrice) / priceRange) * w;
  const toY = (amount) => padding + h - (amount / maxAmount) * h;

  const isLight = document.body.dataset.theme === "light";
  ctx.save();
  ctx.globalCompositeOperation = isLight ? "source-over" : "lighter";
  ctx.fillStyle = isLight
    ? (strong ? "rgba(16, 122, 92, 0.25)" : "rgba(16, 122, 92, 0.18)")
    : (strong ? "rgba(62, 240, 183, 0.25)" : "rgba(62, 240, 183, 0.18)");
  ctx.strokeStyle = isLight ? "rgba(16, 122, 92, 0.85)" : "rgba(62, 240, 183, 0.85)";
  ctx.lineWidth = strong ? 1.6 : 1.2;
  ctx.beginPath();
  bidPoints.forEach((p, idx) => {
    const x = toX(p.price);
    const y = toY(p.amount);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(toX(bidPoints[bidPoints.length - 1].price), padding + h);
  ctx.lineTo(toX(bidPoints[0].price), padding + h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = isLight
    ? (strong ? "rgba(178, 42, 69, 0.25)" : "rgba(178, 42, 69, 0.18)")
    : (strong ? "rgba(255, 92, 122, 0.25)" : "rgba(255, 92, 122, 0.18)");
  ctx.strokeStyle = isLight ? "rgba(178, 42, 69, 0.85)" : "rgba(255, 92, 122, 0.85)";
  ctx.lineWidth = strong ? 1.6 : 1.2;
  ctx.beginPath();
  askPoints.forEach((p, idx) => {
    const x = toX(p.price);
    const y = toY(p.amount);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(toX(askPoints[askPoints.length - 1].price), padding + h);
  ctx.lineTo(toX(askPoints[0].price), padding + h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  const mid = (bidPoints[bidPoints.length - 1].price + askPoints[0].price) / 2;
  ctx.strokeStyle = isLight ? "rgba(15, 23, 42, 0.25)" : "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.moveTo(toX(mid), padding);
  ctx.lineTo(toX(mid), padding + h);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawDepthChart(asks, bids) {
  if (!els.depthChart) return;
  if (!depthCtx) resizeDepthCanvas();
  drawDepthToCanvas(els.depthChart, asks, bids, false);
}

function drawEquity() {
  if (!equityCtx) resizeEquityCanvas();
  const rect = els.equityChart.getBoundingClientRect();
  equityCtx.clearRect(0, 0, rect.width, rect.height);
  if (state.equityHistory.length < 2) return;

  const padding = 10;
  const w = rect.width - padding * 2;
  const h = rect.height - padding * 2;
  const min = Math.min(...state.equityHistory);
  const max = Math.max(...state.equityHistory);
  const range = max - min || 1;

  equityCtx.beginPath();
  state.equityHistory.forEach((value, idx) => {
    const x = padding + (w * idx) / (state.equityHistory.length - 1);
    const y = padding + h - ((value - min) / range) * h;
    if (idx === 0) equityCtx.moveTo(x, y);
    else equityCtx.lineTo(x, y);
  });
  equityCtx.strokeStyle = "rgba(62, 240, 183, 0.9)";
  equityCtx.lineWidth = 2;
  equityCtx.stroke();
}

function updateDepthBook(symbol, levels = 14) {
  const base = state.market[symbol].price;
  const coin = coins.find((c) => c.symbol === symbol);
  const book = state.depthBooks[symbol] || { asks: [], bids: [] };
  const trendRaw = marketTrends[symbol] || 0;
  const trend = Math.max(-2, Math.min(2, trendRaw));
  const buyPressure = 1 + (trend > 0 ? trend * 2 : 0);
  const sellPressure = 1 + (trend < 0 ? Math.abs(trend) * 2 : 0);
  const baseVol = coin ? coin.vol : 0.01;
  const spreadStep = 0.0006 + Math.abs(trend) * 0.00045 + baseVol * 0.02;

  const asks = [];
  const bids = [];
  for (let i = 1; i <= levels; i += 1) {
    const step = spreadStep * i;
    const askPrice = base * (1 + step + Math.random() * spreadStep * 0.35);
    const bidPrice = base * (1 - step - Math.random() * spreadStep * 0.35);
    const askAmount = (Math.random() * 10 + 1) * sellPressure;
    const bidAmount = (Math.random() * 10 + 1) * buyPressure;
    const prevAsk = book.asks[i - 1];
    const prevBid = book.bids[i - 1];
    asks.push({
      price: prevAsk ? prevAsk.price * 0.7 + askPrice * 0.3 : askPrice,
      amount: prevAsk ? prevAsk.amount * 0.75 + askAmount * 0.25 : askAmount
    });
    bids.push({
      price: prevBid ? prevBid.price * 0.7 + bidPrice * 0.3 : bidPrice,
      amount: prevBid ? prevBid.amount * 0.75 + bidAmount * 0.25 : bidAmount
    });
  }

  state.depthBooks[symbol] = { asks, bids };
  return state.depthBooks[symbol];
}

function getDepthBook(symbol) {
  if (!state.depthBooks[symbol]) return updateDepthBook(symbol);
  return state.depthBooks[symbol];
}

function buildOrderBook() {
  const { asks, bids } = getDepthBook(state.selected);

  const maxAsk = Math.max(...asks.map((a) => a.amount));
  const maxBid = Math.max(...bids.map((b) => b.amount));

  els.asks.innerHTML = asks
    .reverse()
    .map((ask) => {
      const width = (ask.amount / maxAsk) * 100;
      return `
        <div class="orderbook-row">
          <div class="depth ask" style="width:${width}%"></div>
          <span>${state.quote === "USD" ? formatUSD(toQuote(ask.price)) : formatVND(toQuote(ask.price))}</span>
          <span>${ask.amount.toFixed(3)}</span>
          <span>${formatNumber(ask.amount * ask.price)}</span>
        </div>
      `;
    })
    .join("");

  els.bids.innerHTML = bids
    .map((bid) => {
      const width = (bid.amount / maxBid) * 100;
      return `
        <div class="orderbook-row">
          <div class="depth bid" style="width:${width}%"></div>
          <span>${state.quote === "USD" ? formatUSD(toQuote(bid.price)) : formatVND(toQuote(bid.price))}</span>
          <span>${bid.amount.toFixed(3)}</span>
          <span>${formatNumber(bid.amount * bid.price)}</span>
        </div>
      `;
    })
    .join("");

  drawDepthChart(asks, bids);
}

function addTrade({ symbol, price, qty, side }) {
  state.trades.unshift({
    symbol,
    price,
    qty,
    side,
    ts: new Date()
  });
  state.trades = state.trades.slice(0, 50);
  renderTrades();
  spawnOrderSplash(symbol, side, price);
  recordTradeVolume(price * qty);
}

function renderTrades() {
  const trades = state.trades.filter((trade) => trade.symbol === state.selected).slice(0, 20);
  if (trades.length === 0) {
    els.tradesList.innerHTML = `<div class="trade-row">Chưa có giao dịch</div>`;
    return;
  }
  els.tradesList.innerHTML = trades
    .map((trade) => {
      const priceQuote = toQuote(trade.price);
      return `
        <div class="trade-row ${trade.side}">
          <div>${trade.side === "buy" ? "Mua" : "Bán"}</div>
          <div>${state.quote === "USD" ? formatUSD(priceQuote) : formatVND(priceQuote)}</div>
          <div>${trade.qty.toFixed(4)}</div>
        </div>
      `;
    })
    .join("");
}

function updateOrderInputs() {
  if (els.orderType.value === "limit") {
    const priceQuote = toQuote(state.market[state.selected].price);
    els.orderPrice.value = state.quote === "USD"
      ? priceQuote.toFixed(2)
      : Math.round(priceQuote).toString();
  } else {
    els.orderPrice.value = "";
  }
  updateOrderCalc();
}

function updateOrderCalc() {
  const qty = parseFloat(els.orderQty.value || "0");
  const priceInput = parseFloat(els.orderPrice.value || "0");
  const basePrice = state.market[state.selected]?.price || 0;
  const type = els.orderType.value;
  const leverage = Math.min(parseInt(els.orderLeverage.value, 10), getMaxLeverage());
  const priceUsd = type === "limit" ? fromQuote(priceInput) : basePrice;
  const execPriceUsd = type === "market" ? calcSlippage(basePrice, qty, state.side) : priceUsd;
  const slippagePct = basePrice > 0 ? ((execPriceUsd - basePrice) / basePrice) * 100 : 0;
  const notionalUsd = execPriceUsd * qty;
  const notionalQuote = toQuote(execPriceUsd) * qty;
  const totalQuote = leverage === 1 ? notionalQuote : notionalQuote / leverage;
  const feeQuote = totalQuote * getFeeRate();
  const fmt = (value) => (state.quote === "USD" ? formatUSD(value) : formatVND(value));

  if (!qty || qty <= 0) {
    els.orderTotal.textContent = "0";
    els.orderFee.textContent = "0";
    if (els.previewPrice) els.previewPrice.textContent = "-";
    if (els.previewLeverage) els.previewLeverage.textContent = "-";
    if (els.previewNotional) els.previewNotional.textContent = "-";
    if (els.previewSlippage) els.previewSlippage.textContent = "-";
    if (els.previewFee) els.previewFee.textContent = "-";
    if (els.orderPreview) els.orderPreview.classList.remove("warn");
    if (els.orderNote) {
      els.orderNote.textContent = orderNoteDefault || els.orderNote.textContent;
      els.orderNote.classList.remove("warn");
    }
    [els.orderQty, els.orderPrice].forEach((el) => el && el.classList.remove("input-error"));
    return;
  }

  els.orderTotal.textContent = fmt(totalQuote);
  els.orderFee.textContent = fmt(feeQuote);
  if (els.previewPrice) els.previewPrice.textContent = fmt(execPriceUsd);
  if (els.previewLeverage) els.previewLeverage.textContent = `x${leverage}`;
  if (els.previewNotional) els.previewNotional.textContent = fmt(notionalQuote);
  if (els.previewSlippage) els.previewSlippage.textContent = `${slippagePct.toFixed(2)}%`;
  if (els.previewFee) els.previewFee.textContent = fmt(feeQuote);

  const warnMessages = [];
  const overQty = qty > MAX_ORDER_QTY;
  const overNotional = notionalUsd > MAX_NOTIONAL_USD;
  const balanceQuote = state.quote === "USD" ? state.usd : state.vnd;
  const requiredQuote = totalQuote + feeQuote;
  const insufficientBalance = requiredQuote > balanceQuote;
  const insufficientSpot = state.side === "sell"
    && leverage === 1
    && qty > (state.holdings[state.selected] || 0);
  if (overQty) warnMessages.push("So luong vuot gioi han.");
  if (overNotional) warnMessages.push("Notional vuot gioi han.");
  if (insufficientBalance && !(state.side === "sell" && leverage === 1)) {
    warnMessages.push("So du khong du de dat lenh.");
  }
  if (insufficientSpot) {
    warnMessages.push("Khong du coin de ban spot.");
  }
  const showWarn = warnMessages.length > 0;
  if (els.orderPreview) els.orderPreview.classList.toggle("warn", showWarn);
  if (els.orderQty) els.orderQty.classList.toggle("input-error", overQty || insufficientSpot);
  if (els.orderPrice) els.orderPrice.classList.remove("input-error");
  if (els.orderNote) {
    els.orderNote.textContent = showWarn ? warnMessages.join(" ") : (orderNoteDefault || els.orderNote.textContent);
    els.orderNote.classList.toggle("warn", showWarn);
  }
}

function ensurePrimaryAriaLabels() {
  const labels = {
    watchAll: "Hien thi tat ca coin",
    watchFav: "Hien thi coin theo doi",
    submitOrder: "Gui lenh giao dich",
    orderQtyDown: "Giam so luong dat lenh",
    orderQtyUp: "Tang so luong dat lenh",
    dailyCheckinBtn: "Nhan thuong diem danh",
    predictUpBtn: "Du doan nen xanh",
    predictDownBtn: "Du doan nen do",
    adminSetBtn: "Cap nhat so du user",
    adminBroadcastBtn: "Phat thong bao toan he thong",
    adminMailSendBtn: "Gui thu admin den nguoi choi",
    academyPrev: "Quay lai buoc huong dan truoc",
    academyNext: "Di den buoc huong dan tiep theo",
    academyRestart: "Bat dau lai hoc vien",
    academyClose: "Thoat hoc vien"
  };
  Object.entries(labels).forEach(([id, label]) => {
    const el = document.getElementById(id);
    if (!el || el.getAttribute("aria-label")) return;
    el.setAttribute("aria-label", label);
  });
}

function stepOrderQty(direction) {
  if (!els.orderQty) return;
  const step = parseFloat(els.orderQty.step || "0.0001") || 0.0001;
  const current = parseFloat(els.orderQty.value || "0") || 0;
  const next = Math.max(0, current + step * direction);
  els.orderQty.value = next.toFixed(6).replace(/\.?0+$/, "");
  updateOrderCalc();
}

function resetOrderPercent() {
  if (els.orderPercent) els.orderPercent.value = "0";
  if (els.orderPercentLabel) els.orderPercentLabel.textContent = "0%";
}

function applyOrderPercent(rawValue) {
  if (!els.orderPercent) return;
  const pct = Math.max(0, Math.min(100, Number(rawValue) || 0));
  els.orderPercent.value = pct.toString();
  if (els.orderPercentLabel) els.orderPercentLabel.textContent = `${pct}%`;

  const leverage = Math.min(parseInt(els.orderLeverage.value, 10), getMaxLeverage());
  const priceInput = parseFloat(els.orderPrice.value || "0");
  const priceUsd = els.orderType.value === "limit"
    ? fromQuote(priceInput)
    : state.market[state.selected]?.price;
  if (!Number.isFinite(priceUsd) || priceUsd <= 0) {
    updateOrderCalc();
    return;
  }

  let qty = 0;
  if (state.side === "sell" && leverage === 1) {
    const holding = state.holdings[state.selected] || 0;
    qty = holding * (pct / 100);
  } else {
    const balance = state.quote === "USD" ? state.usd : state.vnd;
    const feeRate = getFeeRate();
    const available = balance * (pct / 100);
    const maxTotal = available / (1 + feeRate);
    const priceQuote = toQuote(priceUsd);
    if (priceQuote > 0 && maxTotal > 0) {
      qty = leverage === 1
        ? maxTotal / priceQuote
        : (maxTotal * leverage) / priceQuote;
    }
  }

  if (qty > 0) {
    els.orderQty.value = qty.toFixed(6);
  } else {
    els.orderQty.value = "";
  }
  updateOrderCalc();
}

function applyOrderTemplate(kind) {
  const templates = {
    safe: { pct: 10, lev: 5, sl: 1, tp: 2 },
    mid: { pct: 20, lev: 10, sl: 2, tp: 4 },
    risk: { pct: 30, lev: 25, sl: 3, tp: 6 }
  };
  const tpl = templates[kind];
  if (!tpl) return;
  const priceUsd = state.market[state.selected]?.price;
  if (!Number.isFinite(priceUsd) || priceUsd <= 0) {
    showToast("Gia chua san sang.");
    return;
  }
  const maxLev = getMaxLeverage();
  const lev = Math.min(tpl.lev, maxLev);
  if (els.orderLeverage) {
    els.orderLeverage.value = lev.toString();
    state.leverage = lev;
  }
  if (els.orderPercent) {
    els.orderPercent.value = String(tpl.pct);
    if (els.orderPercentLabel) els.orderPercentLabel.textContent = `${tpl.pct}%`;
  }
  const slPrice = state.side === "buy"
    ? priceUsd * (1 - tpl.sl / 100)
    : priceUsd * (1 + tpl.sl / 100);
  const tpPrice = state.side === "buy"
    ? priceUsd * (1 + tpl.tp / 100)
    : priceUsd * (1 - tpl.tp / 100);
  if (els.orderStop) els.orderStop.value = toQuote(slPrice).toFixed(4);
  if (els.orderTake) els.orderTake.value = toQuote(tpPrice).toFixed(4);
  applyOrderPercent(tpl.pct);
  updateOrderCalc();
  markPracticeFromInputs();
  showToast("Da ap dung mau lenh.");
}

async function preOrderGuard() {
  const qty = parseFloat(els.orderQty?.value || "0");
  if (!Number.isFinite(qty) || qty <= 0) return true;

  const type = els.orderType?.value || "market";
  const priceInput = parseFloat(els.orderPrice?.value || "0");
  const basePrice = type === "limit" ? fromQuote(priceInput) : state.market[state.selected]?.price;
  const priceUsd = type === "market" ? calcSlippage(basePrice, qty, state.side) : basePrice;
  if (!Number.isFinite(priceUsd) || priceUsd <= 0) return true;

  const stopInput = parseFloat(els.orderStop?.value || "0");
  const takeInput = parseFloat(els.orderTake?.value || "0");
  const trailInput = parseFloat(els.orderTrail?.value || "0");
  const hasSLTP = stopInput > 0 || takeInput > 0 || trailInput > 0;

  const equity = totalEquityUSD();
  const notional = priceUsd * qty;
  const sizePct = equity > 0 ? (notional / equity) : 0;

  const warns = [];
  if (!hasSLTP) warns.push("Ban chua dat SL/TP cho lenh nay.");
  if (sizePct >= 0.3) warns.push(`Kich thuoc lenh ~${Math.round(sizePct * 100)}% von. Hay can nhac giam.`);

  if (warns.length === 0) return true;
  const ok = await showOrderWarn({
    title: "Canh bao rui ro",
    text: warns.join(" "),
    primary: "Tiep tuc",
    secondary: "Huy"
  });
  return ok;
}

function calcSlippage(price, qty, side) {
  const market = state.market[state.selected];
  const liquidity = Math.max(3000, market.vol);
  const impact = Math.min(0.006, (qty / liquidity) * 0.25);
  return side === "buy" ? price * (1 + impact) : price * (1 - impact);
}

function recordTradeVolume(usdNotional) {
  if (!Number.isFinite(usdNotional) || usdNotional <= 0) return;
  state.tradeVolumeUsd += usdNotional;
}

function getVolumeDiscount() {
  let discount = 0;
  FEE_TIERS.forEach((tier) => {
    if (state.tradeVolumeUsd >= tier.volume) discount = tier.discount;
  });
  return discount;
}

function getFeeRate() {
  const volumeDiscount = getVolumeDiscount();
  const totalDiscount = Math.min(0.6, state.career.feeDiscount + volumeDiscount);
  return BASE_FEE_RATE * (1 - totalDiscount);
}

function getMaxLeverage() {
  const now = Date.now();
  let maxLev = state.career.maxLeverage;
  if (state.risk.limitUntil && now < state.risk.limitUntil && state.risk.maxLeverage) {
    maxLev = Math.min(maxLev, state.risk.maxLeverage);
  }
  const hasBoost = Array.isArray(state.activeBuffs)
    && state.activeBuffs.some((b) => !b?.activeUntil || b.activeUntil > now)
    && state.activeBuffs.some((b) => (b?.effect || "") === "x2_leverage" && (!b.activeUntil || b.activeUntil > now));
  if (hasBoost) {
    maxLev = Math.min(maxLev * 2, 200);
  }
  return maxLev;
}

function updateLeverageOptions() {
  if (!els.orderLeverage) return;
  const maxLev = getMaxLeverage();
  const options = Array.from(els.orderLeverage.options);
  options.forEach((opt) => {
    const value = parseInt(opt.value, 10);
    opt.disabled = value > maxLev;
  });
  const current = parseInt(els.orderLeverage.value, 10);
  if (current > maxLev) {
    const allowed = options.filter((o) => !o.disabled);
    if (allowed.length > 0) {
      els.orderLeverage.value = allowed[allowed.length - 1].value;
    }
  }
}

function updateIndicatorButtons() {
  const unlocked = new Set(state.career.unlocks);
  document.querySelectorAll(".time-btn.ind").forEach((btn) => {
    const key = btn.dataset.ind;
    const isBase = key === "ma14" || key === "rsi" || key === "ema9" || key === "ema21" || key === "ma200";
    const canUse = isBase || unlocked.has(key);
    btn.disabled = !canUse;
    btn.style.opacity = canUse ? "1" : "0.4";
    if (!canUse) btn.classList.remove("active");
    else btn.classList.toggle("active", !!state.indicators[key]);
  });
}

function initChartSlots() {
  const defaults = coins.map((c) => c.symbol);
  const unique = [];
  defaults.forEach((sym) => {
    if (!unique.includes(sym) && unique.length < 4) unique.push(sym);
  });
  if (unique[0] !== state.selected) {
    unique.unshift(state.selected);
  }
  state.chartSlots = unique.slice(0, 4);
}

function buildSlotSelects() {
  if (!els.slotSelects.length) return;
  const options = coins.map((coin) => `<option value="${coin.symbol}">${coin.symbol}</option>`).join("");
  els.slotSelects.forEach((sel, idx) => {
    sel.innerHTML = options;
    sel.value = state.chartSlots[idx] || state.selected;
    if (!sel.dataset.bound) {
      sel.addEventListener("change", () => {
        state.chartSlots[idx] = sel.value;
        resetChartViewport(idx, true);
        if (idx === 0) {
          selectCoin(sel.value);
        } else {
          updateChartLabels();
          renderTvSlot(idx);
          scheduleChartDraw();
        }
      });
      sel.dataset.bound = "1";
    }
  });
  applyChartLayout(state.chartLayout);
}

function applyChartLayout(layout) {
  const allowed = [1, 2, 4];
  state.chartLayout = allowed.includes(layout) ? layout : 1;
  if (els.chartGrid) {
    els.chartGrid.classList.remove("layout-1", "layout-2", "layout-4");
    els.chartGrid.classList.add(`layout-${state.chartLayout}`);
    const tiles = Array.from(els.chartGrid.children);
    tiles.forEach((tile, idx) => {
      tile.style.display = idx < state.chartLayout ? "block" : "none";
    });
  }
  els.slotSelects.forEach((sel, idx) => {
    sel.style.display = idx < state.chartLayout ? "inline-flex" : "none";
  });
  document.querySelectorAll(".layout-btn").forEach((btn) => {
    btn.classList.toggle("active", parseInt(btn.dataset.layout, 10) === state.chartLayout);
  });
  renderAllTvSlots();
  scheduleChartDraw();
}

function renderCareer() {
  const nextTier = careerTiers.find((t) => t.level === state.career.level + 1);
  const nextXp = nextTier ? nextTier.xp : state.career.xp;
  const progress = nextTier ? (state.career.xp / nextXp) * 100 : 100;
  if (els.careerLevel) els.careerLevel.textContent = state.career.level;
  if (els.careerXp) els.careerXp.textContent = Math.floor(state.career.xp).toString();
  if (els.careerXpNext) els.careerXpNext.textContent = Math.floor(nextXp).toString();
  if (els.careerMaxLev) els.careerMaxLev.textContent = `x${state.career.maxLeverage}`;
  if (els.careerFee) els.careerFee.textContent = `${(getFeeRate() * 100).toFixed(2)}%`;
  if (els.careerUnlocks) {
    const map = { ma50: "MA50", bb: "Bollinger", macd: "MACD" };
    const labels = state.career.unlocks.map((u) => map[u] || u);
    els.careerUnlocks.textContent = labels.length ? labels.join(", ") : "-";
  }
  if (els.xpFill) els.xpFill.style.width = `${Math.min(100, progress)}%`;
  if (els.feeRate) els.feeRate.textContent = `${(getFeeRate() * 100).toFixed(2)}%`;
}

function refreshCareer() {
  const prevLevel = lastCareerLevel ?? state.career.level;
  let tier = careerTiers[0];
  const unlocks = new Set();
  careerTiers.forEach((t) => {
    if (state.career.xp >= t.xp) {
      tier = t;
      t.unlocks.forEach((u) => unlocks.add(u));
    }
  });
  state.career.level = tier.level;
  state.career.feeDiscount = tier.feeDiscount;
  state.career.maxLeverage = tier.maxLeverage;
  state.career.unlocks = Array.from(unlocks);
  if (state.career.level > prevLevel) {
    showToast(`Chúc mừng! Lên cấp ${state.career.level}.`);
    if (els.xpBar) {
      els.xpBar.classList.remove("level-up");
      void els.xpBar.offsetWidth;
      els.xpBar.classList.add("level-up");
    }
  }
  lastCareerLevel = state.career.level;
  if (!unlocks.has("bb")) state.indicators.bb = false;
  if (!unlocks.has("macd")) state.indicators.macd = false;
  if (!unlocks.has("ma50")) state.indicators.ma50 = false;
  updateLeverageOptions();
  updateIndicatorButtons();
  renderCareer();
  saveLocal();
}

function addXp(amount) {
  if (amount <= 0) return;
  state.career.xp += amount;
  refreshCareer();
}

function recordPnl(pnlUsd) {
  state.recentPnl.push(pnlUsd);
  if (state.recentPnl.length > 6) state.recentPnl.shift();
  if (pnlUsd < 0) state.lossStreak += 1;
  else state.lossStreak = 0;
  const now = Date.now();
  if (state.lossStreak >= 3) {
    state.risk.maxLeverage = Math.min(10, state.career.maxLeverage);
    state.risk.limitUntil = Math.max(state.risk.limitUntil || 0, now + 3 * 60 * 1000);
    showToast("Risk Control: Giảm đòn bẩy tối đa tạm thời.");
    updateLeverageOptions();
  }
  if (state.lossStreak >= 5) {
    state.risk.cooldownUntil = Math.max(state.risk.cooldownUntil || 0, now + 60 * 1000);
    if (!state.risk.restUntil || now > state.risk.restUntil) {
      state.risk.restUntil = now + REST_SUGGEST_MS;
      showRestOverlay();
    }
    showToast("Risk Control: Tạm khóa giao dịch 60s.");
  }
  if (state.lossStreak === 0 && (!state.risk.limitUntil || now > state.risk.limitUntil)) {
    state.risk.maxLeverage = null;
    state.risk.limitUntil = 0;
    updateLeverageOptions();
  }
  evaluateTradeQuality(pnlUsd);
  if (pnlUsd > 0) unlockAchievement("first_profit");
  if (pnlUsd > 0) addXp(Math.min(120, Math.max(5, pnlUsd * 2)));
  if (pnlUsd < 0 && state.boosters.anonymity > 0) {
    state.boosters.anonymity -= 1;
    state.leaderboard = state.leaderboard.map((entry) => ({
      ...entry,
      name: entry.name === "Bạn" ? "Ẩn danh" : entry.name
    }));
    saveLocal();
    renderLeaderboard();
    renderBoosters();
    showToast("Thẻ ẩn danh đã kích hoạt.");
  }
}

function evaluateTradeQuality(pnlUsd) {
  const meta = state.lastOrderMeta || {};
  if (!Number.isFinite(meta.notional) || meta.notional <= 0) return;
  const equity = typeof totalEquityUSD === "function" ? totalEquityUSD() : state.usd;
  const equitySafe = Number.isFinite(equity) && equity > 0 ? equity : 1;
  const ratio = meta.notional / equitySafe;
  let score = 50;
  const reasons = [];
  if (meta.hasSLTP) {
    score += 20;
    reasons.push("Co SL/TP");
  } else {
    score -= 10;
    reasons.push("Thieu SL/TP");
  }
  if (meta.leverage <= 10) {
    score += 15;
    reasons.push("Don bay vua");
  } else if (meta.leverage <= 20) {
    score += 5;
    reasons.push("Don bay cao");
  } else {
    score -= 10;
    reasons.push("Don bay rat cao");
  }
  if (ratio <= 0.1) {
    score += 15;
    reasons.push("Von nho");
  } else if (ratio <= 0.25) {
    score += 8;
    reasons.push("Von vua");
  } else if (ratio <= 0.5) {
    score -= 5;
    reasons.push("Von lon");
  } else {
    score -= 15;
    reasons.push("Von qua lon");
  }
  if (pnlUsd > 0) {
    score += 10;
    reasons.push("Chot loi");
  } else if (pnlUsd < 0) {
    score -= 5;
    reasons.push("Lo");
  }
  score = clamp(Math.round(score), 0, 100);
  let grade = "On";
  if (score >= 75) grade = "Tot";
  else if (score < 45) grade = "Can cai thien";
  showToast(`Danh gia lenh: ${grade} (${score}/100). ${reasons.join(", ")}.`);
}

function calcPositionPnl(pos, price) {
  return pos.side === "buy"
    ? (price - pos.entry) * pos.qty * pos.leverage
    : (pos.entry - price) * pos.qty * pos.leverage;
}

function applyFundingFee(pos, feeUsd) {
  if (pos.quote === "USD") state.usd += feeUsd;
  else state.vnd += feeUsd * FX_RATE;
}

function getFundingRate(symbol) {
  const trend = Math.abs(marketTrends[symbol] || 0);
  const coin = coins.find((c) => c.symbol === symbol);
  const baseVol = coin ? coin.vol : 0.01;
  const regime = state.marketRegime.mode;
  const regimeMult = regime === "volatile" ? 1.8 : regime === "trend" ? 1.2 : 0.8;
  const volFactor = Math.min(2.2, baseVol * 80);
  return FUNDING_RATE * (1 + trend * 1.2 + volFactor) * regimeMult;
}

function applyFunding() {
  const now = Date.now();
  const elapsed = now - state.funding.lastTs;
  const ticks = Math.floor(elapsed / FUNDING_INTERVAL_MS);
  if (ticks <= 0 || state.positions.length === 0) return;
  state.funding.lastTs += ticks * FUNDING_INTERVAL_MS;

  state.positions.forEach((pos) => {
    const price = state.market[pos.symbol].price;
    const notional = price * pos.qty * pos.leverage;
    const trendUp = price >= state.market[pos.symbol].open;
    const paysLong = trendUp;
    const fee = notional * getFundingRate(pos.symbol) * ticks;
    let cashflow = 0;
    if (pos.side === "buy") cashflow = paysLong ? -fee : fee;
    else cashflow = paysLong ? fee : -fee;
    applyFundingFee(pos, cashflow);
  });
}

async function placeOrder() {
  if (!currentUser) {
    showToast("Vui long dang nhap truoc.");
    return;
  }
  if (!socket || !socket.connected) {
    showToast("Đang offline, dùng chế độ giả lập.");
    placeOrderLegacy();
    return;
  }
  if (state.risk.cooldownUntil && Date.now() < state.risk.cooldownUntil) {
    showToast("Đang cooldown sau chuỗi thua. Hãy bình tĩnh lại!");
    return;
  }
  const qty = parseFloat(els.orderQty.value || "0");
  if (!qty || qty <= 0) {
    showToast("Vui lòng nhập số lượng hợp lệ.");
    return;
  }

  const type = els.orderType.value;
  const side = state.side;
  const priceInput = parseFloat(els.orderPrice.value || "0");
  let leverage = parseInt(els.orderLeverage.value, 10);
  const maxLev = getMaxLeverage();
  if (leverage > maxLev) {
    leverage = maxLev;
    els.orderLeverage.value = leverage.toString();
  }

  if (type === "limit" && (!priceInput || priceInput <= 0)) {
    showToast("Giá giới hạn không hợp lệ.");
    return;
  }

  const basePrice = type === "limit" ? fromQuote(priceInput) : state.market[state.selected].price;
  const priceUsd = type === "market" ? calcSlippage(basePrice, qty, side) : basePrice;

  const stopInputQuote = parseFloat(els.orderStop.value || "0");
  const takeInputQuote = parseFloat(els.orderTake.value || "0");
  const trailPctRaw = parseFloat(els.orderTrail.value || "0");
  const trailPct = Number.isFinite(trailPctRaw) ? trailPctRaw : 0;
  const stopInput = stopInputQuote ? fromQuote(stopInputQuote) : 0;
  const takeInput = takeInputQuote ? fromQuote(takeInputQuote) : 0;

  if (!(await preOrderGuard())) return;

  state.lastOrderMeta = {
    hasSLTP: stopInput > 0 || takeInput > 0 || trailPct > 0,
    leverage,
    qty,
    notional: priceUsd * qty
  };

  const clientId = Date.now() + Math.random();
  const seq = bumpOrderSeq(currentUser);
  const orderPayload = {
    clientId,
    seq,
    symbol: state.selected,
    side,
    type,
    qty,
    leverage,
    quote: state.quote,
    priceUsd,
    stopInput,
    takeInput,
    trailPct
  };

  pendingOrders.set(clientId, orderPayload);
  updatePendingBadge();
  socket.emit("place_order", orderPayload);
  showToast("Đã gửi lệnh lên server...");
  markPracticeOrder();
}

async function placeOrderLegacy() {
  if (!currentUser) {
    showToast("Vui long dang nhap truoc.");
    return;
  }
  if (state.risk.cooldownUntil && Date.now() < state.risk.cooldownUntil) {
    showToast("Đang cooldown sau chuỗi thua. Hãy bình tĩnh lại!");
    return;
  }
  const qty = parseFloat(els.orderQty.value || "0");
  if (!qty || qty <= 0) {
    showToast("Vui lòng nhập số lượng hợp lệ.");
    return;
  }

  const type = els.orderType.value;
  const side = state.side;
  const priceInput = parseFloat(els.orderPrice.value || "0");
  let leverage = parseInt(els.orderLeverage.value, 10);
  const maxLev = getMaxLeverage();
  if (leverage > maxLev) {
    leverage = maxLev;
    els.orderLeverage.value = leverage.toString();
  }
  const basePrice = type === "limit" ? fromQuote(priceInput) : state.market[state.selected].price;
  const priceUsd = type === "market" ? calcSlippage(basePrice, qty, side) : basePrice;

  if (type === "limit" && (!priceInput || priceInput <= 0)) {
    showToast("Giá giới hạn không hợp lệ.");
    return;
  }

  const notionalQuote = toQuote(priceUsd) * qty;
  const totalQuote = leverage === 1 ? notionalQuote : notionalQuote / leverage;
  const feeQuote = totalQuote * getFeeRate();

  const stopInputQuote = parseFloat(els.orderStop.value || "0");
  const takeInputQuote = parseFloat(els.orderTake.value || "0");
  const trailPctRaw = parseFloat(els.orderTrail.value || "0");
  const trailPct = Number.isFinite(trailPctRaw) ? trailPctRaw : 0;
  const stopInput = stopInputQuote ? fromQuote(stopInputQuote) : 0;
  const takeInput = takeInputQuote ? fromQuote(takeInputQuote) : 0;

  if (!(await preOrderGuard())) return;

  state.lastOrderMeta = {
    hasSLTP: stopInput > 0 || takeInput > 0 || trailPct > 0,
    leverage,
    qty,
    notional: priceUsd * qty
  };

  const balance = state.quote === "USD" ? state.usd : state.vnd;
  if (socket && socket.connected) {
    if (side === "buy" && balance < totalQuote + feeQuote) {
      showToast("Số dư không đủ để mua.");
      return;
    }
    if (side === "sell" && leverage === 1 && state.holdings[state.selected] < qty) {
      showToast("Không đủ coin để bán.");
      return;
    }
    const clientId = Date.now() + Math.random();
    const seq = bumpOrderSeq(currentUser);
    const orderPayload = {
      clientId,
      seq,
      symbol: state.selected,
      side,
      type,
      qty,
      leverage,
      quote: state.quote,
      priceUsd,
      stopInput,
      takeInput,
      trailPct
    };
    pendingOrders.set(clientId, orderPayload);
    updatePendingBadge();
    socket.emit("place_order", orderPayload);
    showToast("Đã gửi lệnh lên máy chủ...");
    markPracticeOrder();
    return;
  }
  const allInBuy = totalQuote + feeQuote > balance * 0.9;
  const allInSellSpot = leverage === 1 && side === "sell" && state.holdings[state.selected] > 0
    ? qty >= state.holdings[state.selected] * 0.9
    : false;
  if (state.lossStreak >= 3 && (allInBuy || allInSellSpot)) {
    showToast("Anti-Tilting: Bạn đang thua nhiều. Hãy giảm rủi ro.");
  }

  if (side === "buy") {
    if (balance < totalQuote + feeQuote) {
      showToast("Số dư không đủ để mua.");
      return;
    }

    if (type === "market") {
      if (state.quote === "USD") state.usd -= totalQuote + feeQuote;
      else state.vnd -= totalQuote + feeQuote;
      if (leverage === 1) {
        state.holdings[state.selected] += qty;
        const oldQty = state.holdings[state.selected] - qty;
        const oldAvg = state.costBasis[state.selected] || 0;
        const newAvg = ((oldQty * oldAvg) + qty * priceUsd) / (oldQty + qty);
        state.costBasis[state.selected] = newAvg;
        if (!state.holdingStart[state.selected]) state.holdingStart[state.selected] = Date.now();
      } else {
        state.positions.push({
          id: Date.now() + Math.random(),
          symbol: state.selected,
          side: "buy",
          qty,
          entry: priceUsd,
          leverage,
          margin: totalQuote,
          quote: state.quote
        });
      }
      addTrade({ symbol: state.selected, price: priceUsd, qty, side: "buy" });
      playTradeSound();
      attachProtection({
        stopInput,
        takeInput,
        trailPct,
        qty,
        side: "buy",
        leverage,
        entryPrice: priceUsd,
        symbol: state.selected
      });
      showToast("Đã khớp lệnh mua market.");
    } else {
      if (state.quote === "USD") state.usd -= totalQuote + feeQuote;
      else state.vnd -= totalQuote + feeQuote;
      state.openOrders.push({
        id: Date.now() + Math.random(),
        side,
        type,
        symbol: state.selected,
        priceUsd,
        qty,
        quote: state.quote,
        leverage,
        stopInput,
        takeInput,
        trailPct,
        locked: totalQuote + feeQuote,
        ts: new Date()
      });
      showToast("Đã tạo lệnh giới hạn mua.");
    }
  } else {
    if (type === "market") {
      if (leverage === 1) {
        if (state.holdings[state.selected] < qty) {
          showToast("Không đủ coin để bán.");
          return;
        }
        state.holdings[state.selected] -= qty;
        const avg = state.costBasis[state.selected] || 0;
        const pnl = (priceUsd - avg) * qty;
        recordPnl(pnl);
        if (state.holdings[state.selected] <= 0) {
          state.costBasis[state.selected] = 0;
          state.holdingStart[state.selected] = null;
        }
        const receive = totalQuote - feeQuote;
        if (state.quote === "USD") state.usd += receive;
        else state.vnd += receive;
        addTrade({ symbol: state.selected, price: priceUsd, qty, side: "sell" });
        playTradeSound();
        attachProtection({
          stopInput,
          takeInput,
          trailPct,
          qty,
          side: "sell",
          leverage,
          entryPrice: priceUsd,
          symbol: state.selected
        });
        showToast("Đã khớp lệnh bán market.");
      } else {
        if (state.quote === "USD") state.usd -= totalQuote + feeQuote;
        else state.vnd -= totalQuote + feeQuote;
        state.positions.push({
          id: Date.now() + Math.random(),
          symbol: state.selected,
          side: "sell",
          qty,
          entry: priceUsd,
          leverage,
          margin: totalQuote,
          quote: state.quote
        });
        addTrade({ symbol: state.selected, price: priceUsd, qty, side: "sell" });
        playTradeSound();
        attachProtection({
          stopInput,
          takeInput,
          trailPct,
          qty,
          side: "sell",
          leverage,
          entryPrice: priceUsd,
          symbol: state.selected
        });
        showToast("Đã khớp lệnh bán market.");
      }
    } else {
      if (leverage === 1) {
        if (state.holdings[state.selected] < qty) {
          showToast("Không đủ coin để bán.");
          return;
        }
        state.holdings[state.selected] -= qty;
        if (state.holdings[state.selected] <= 0) {
          state.costBasis[state.selected] = 0;
          state.holdingStart[state.selected] = null;
        }
      } else {
        if (state.quote === "USD") state.usd -= totalQuote + feeQuote;
        else state.vnd -= totalQuote + feeQuote;
      }
      state.openOrders.push({
        id: Date.now() + Math.random(),
        side,
        type,
        symbol: state.selected,
        priceUsd,
        qty,
        quote: state.quote,
        leverage,
        stopInput,
        takeInput,
        trailPct,
        locked: leverage === 1 ? qty : totalQuote + feeQuote,
        ts: new Date()
      });
      showToast("Đã tạo lệnh giới hạn bán.");
    }
  }

  markPracticeOrder();
  renderOpenOrders();
  updateBalances();
  updatePortfolio();
  renderPositions();
  els.orderQty.value = "";
  els.orderStop.value = "";
  els.orderTake.value = "";
  els.orderTrail.value = "";
  updateOrderCalc();
}

function renderOpenOrders() {
  if (state.openOrders.length === 0) {
    els.openOrders.innerHTML = `<div class="order-row">Không có lệnh chờ</div>`;
    return;
  }

  els.openOrders.innerHTML = state.openOrders
    .map((order) => {
      const priceQuote = order.quote === "USD" ? order.priceUsd : order.priceUsd * FX_RATE;
      const priceLabel = order.quote === "USD" ? formatUSD(priceQuote) : formatVND(priceQuote);
      return `
        <div class="order-row">
          <div>${order.symbol}</div>
          <div>${order.side === "buy" ? "Mua" : "Bán"} ${order.type}</div>
          <div>${priceLabel} x ${order.qty.toFixed(4)}</div>
          <button data-id="${order.id}">Hủy</button>
        </div>
      `;
    })
    .join("");

  els.openOrders.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => cancelOrder(parseFloat(btn.dataset.id)));
  });
}

function cancelOrder(id) {
  const idx = state.openOrders.findIndex((order) => order.id === id);
  if (idx === -1) return;
  const order = state.openOrders[idx];
  if (socket && socket.connected) {
    queueUndo(order);
    socket.emit("cancel_order", id);
    return;
  }

  if (order.side === "buy") {
    if (order.quote === "USD") state.usd += order.locked;
    else state.vnd += order.locked;
  } else {
    if (order.leverage === 1) {
      state.holdings[order.symbol] += order.locked;
      if (!state.holdingStart[order.symbol]) state.holdingStart[order.symbol] = Date.now();
    } else {
      if (order.quote === "USD") state.usd += order.locked;
      else state.vnd += order.locked;
    }
  }

  state.openOrders.splice(idx, 1);
  renderOpenOrders();
  updateBalances();
  updatePortfolio();
  queueUndo(order);
  showToast("Đã hủy lệnh.");
}

function setSide(side) {
  const target = document.querySelector(`.tab[data-side="${side}"]`);
  if (target) {
    target.click();
    return;
  }
  state.side = side;
}

function cancelLatestOrder() {
  if (!state.openOrders.length) {
    showToast("Không có lệnh chờ để hủy.");
    return;
  }
  const latest = state.openOrders[state.openOrders.length - 1];
  if (!latest?.id) {
    showToast("Không tìm thấy lệnh để hủy.");
    return;
  }
  cancelOrder(latest.id);
}

function attachProtection({ stopInput, takeInput, trailPct, qty, side, leverage, entryPrice, symbol }) {
  if (!stopInput && !takeInput && !trailPct) return;
  const refPrice = entryPrice || state.market[state.selected].price;
  state.protections.push({
    id: Date.now() + Math.random(),
    symbol: symbol || state.selected,
    qty,
    side,
    leverage,
    stop: stopInput || null,
    take: takeInput || null,
    trailPct: trailPct || 0,
    trailHigh: side === "buy" ? refPrice : null,
    trailLow: side === "sell" ? refPrice : null
  });
}

function checkLimitOrders() {
  const remaining = [];
  state.openOrders.forEach((order) => {
    const price = state.market[order.symbol].price;
    const shouldFill =
      (order.side === "buy" && order.priceUsd >= price) ||
      (order.side === "sell" && order.priceUsd <= price);

    if (!shouldFill) {
      remaining.push(order);
      return;
    }

    const notionalQuote = (order.quote === "USD" ? price : price * FX_RATE) * order.qty;
    const totalQuote = order.leverage === 1 ? notionalQuote : notionalQuote / order.leverage;
    const feeQuote = totalQuote * getFeeRate();

    if (order.side === "buy") {
      if (order.leverage === 1) {
        state.holdings[order.symbol] += order.qty;
        const oldQty = state.holdings[order.symbol] - order.qty;
        const oldAvg = state.costBasis[order.symbol] || 0;
        const newAvg = ((oldQty * oldAvg) + order.qty * price) / (oldQty + order.qty);
        state.costBasis[order.symbol] = newAvg;
        if (!state.holdingStart[order.symbol]) state.holdingStart[order.symbol] = Date.now();
        const refund = order.locked - (totalQuote + feeQuote);
        if (refund > 0) {
          if (order.quote === "USD") state.usd += refund;
          else state.vnd += refund;
        }
      } else {
        state.positions.push({
          id: Date.now() + Math.random(),
          symbol: order.symbol,
          side: "buy",
          qty: order.qty,
          entry: price,
          leverage: order.leverage,
          margin: totalQuote,
          quote: order.quote
        });
        const refund = order.locked - (totalQuote + feeQuote);
        if (refund > 0) {
          if (order.quote === "USD") state.usd += refund;
          else state.vnd += refund;
        }
      }
      addTrade({ symbol: order.symbol, price, qty: order.qty, side: "buy" });
      playTradeSound();
      attachProtection({
        stopInput: order.stopInput,
        takeInput: order.takeInput,
        trailPct: order.trailPct,
        qty: order.qty,
        side: "buy",
        leverage: order.leverage,
        entryPrice: price,
        symbol: order.symbol
      });
    } else {
      if (order.leverage === 1) {
        const avg = state.costBasis[order.symbol] || 0;
        const pnl = (price - avg) * order.qty;
        recordPnl(pnl);
        if (state.holdings[order.symbol] <= 0) {
          state.costBasis[order.symbol] = 0;
          state.holdingStart[order.symbol] = null;
        }
        const receive = totalQuote - feeQuote;
        if (order.quote === "USD") state.usd += receive;
        else state.vnd += receive;
      } else {
        state.positions.push({
          id: Date.now() + Math.random(),
          symbol: order.symbol,
          side: "sell",
          qty: order.qty,
          entry: price,
          leverage: order.leverage,
          margin: totalQuote,
          quote: order.quote
        });
        const refund = order.locked - (totalQuote + feeQuote);
        if (refund > 0) {
          if (order.quote === "USD") state.usd += refund;
          else state.vnd += refund;
        }
      }
      addTrade({ symbol: order.symbol, price, qty: order.qty, side: "sell" });
      playTradeSound();
      attachProtection({
        stopInput: order.stopInput,
        takeInput: order.takeInput,
        trailPct: order.trailPct,
        qty: order.qty,
        side: "sell",
        leverage: order.leverage,
        entryPrice: price,
        symbol: order.symbol
      });
    }
  });

  state.openOrders = remaining;
  renderOpenOrders();
  updateBalances();
  updatePortfolio();
  renderPositions();
}

function simulateTrades() {
  const price = state.market[state.selected].price;
  const qty = Math.random() * 2 + 0.02;
  const side = Math.random() > 0.5 ? "buy" : "sell";
  addTrade({ symbol: state.selected, price, qty, side });
}

const tickerState = {
  symbols: [],
  items: [],
  lastRefresh: 0,
  lastUpdate: 0
};

function getTopTickerSymbols() {
  return [...coins]
    .sort((a, b) => state.market[b.symbol].vol - state.market[a.symbol].vol)
    .slice(0, 18)
    .map((coin) => coin.symbol);
}

function buildTickerDom(symbols) {
  if (!els.tickerTrack) return;
  els.tickerTrack.innerHTML = "";
  const frag = document.createDocumentFragment();
  const items = [];
  const appendItem = (symbol) => {
    const item = document.createElement("div");
    item.className = "ticker-item";
    const strong = document.createElement("strong");
    strong.textContent = symbol;
    const priceEl = document.createElement("span");
    priceEl.className = "ticker-price";
    const changeEl = document.createElement("span");
    changeEl.className = "ticker-change";
    item.append(strong, priceEl, changeEl);
    frag.appendChild(item);
    items.push({ symbol, priceEl, changeEl });
  };
  for (let repeat = 0; repeat < 2; repeat += 1) {
    symbols.forEach((symbol) => appendItem(symbol));
  }
  els.tickerTrack.appendChild(frag);
  tickerState.items = items;
  tickerState.symbols = symbols;
}

function updateTicker() {
  if (!els.tickerTrack || document.hidden) return;
  const now = Date.now();
  if (now - tickerState.lastUpdate < 900) return;
  tickerState.lastUpdate = now;

  if (!tickerState.symbols.length || now - tickerState.lastRefresh > 15000) {
    const next = getTopTickerSymbols();
    if (next.join("|") !== tickerState.symbols.join("|")) {
      buildTickerDom(next);
    }
    tickerState.lastRefresh = now;
  }

  if (!tickerState.items.length) return;
  const cache = {};
  tickerState.symbols.forEach((symbol) => {
    const market = state.market[symbol];
    if (!market) return;
    const base = market.open || market.price || 1;
    const change = base ? ((market.price - base) / base) * 100 : 0;
    const priceQuote = toQuote(market.price);
    cache[symbol] = {
      priceText: state.quote === "USD" ? formatUSD(priceQuote) : formatVND(priceQuote),
      changeText: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`,
      changeColor: change >= 0 ? "var(--green)" : "var(--red)"
    };
  });

  tickerState.items.forEach((item) => {
    const data = cache[item.symbol];
    if (!data) return;
    item.priceEl.textContent = data.priceText;
    item.changeEl.textContent = data.changeText;
    item.changeEl.style.color = data.changeColor;
  });
}

const canvasCtxMap = new WeakMap();
function getCanvasContext(canvas) {
  if (!canvas) return null;
  if (canvasCtxMap.has(canvas)) return canvasCtxMap.get(canvas);
  const ctx = canvas.getContext("2d");
  canvasCtxMap.set(canvas, ctx);
  return ctx;
}

function resizeCanvasFor(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;
  const nextW = Math.floor(rect.width * dpr);
  const nextH = Math.floor(rect.height * dpr);
  if (canvas.width === nextW && canvas.height === nextH) return;
  canvas.width = nextW;
  canvas.height = nextH;
  const ctx = getCanvasContext(canvas);
  if (!ctx) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

function resizeAllCharts() {
  els.chartCanvases.forEach((canvas) => resizeCanvasFor(canvas));
  els.chartBgCanvases.forEach((canvas) => resizeCanvasFor(canvas));
  els.chartFxCanvases.forEach((canvas) => resizeCanvasFor(canvas));
  chartFrames.fill(null);
  resizeTvCharts();
}

const chartBgCache = new WeakMap();
function drawChartBackgroundFor(canvas, lowerEnabled) {
  const ctx = getCanvasContext(canvas);
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  const padding = 22;
  const w = rect.width - padding * 2;
  const h = rect.height - padding * 2;
  if (w <= 0 || h <= 0) return;
  if (w <= 0 || h <= 0) return null;
  const priceHeight = lowerEnabled ? h * 0.68 : h;
  const lowerHeight = lowerEnabled ? h * 0.25 : 0;
  const lowerTop = padding + priceHeight + (lowerEnabled ? 10 : 0);
  const isLight = document.body.dataset.theme === "light";
  const gridColor = isLight ? "rgba(51,93,255,0.14)" : "rgba(95,193,255,0.16)";
  const gridGlow = isLight ? "rgba(51,93,255,0.35)" : "rgba(95,193,255,0.45)";

  ctx.save();
  ctx.fillStyle = isLight ? "rgba(51,93,255,0.04)" : "rgba(62,240,183,0.03)";
  ctx.fillRect(padding, padding, w, priceHeight);

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.shadowBlur = 8;
  ctx.shadowColor = gridGlow;

  const vCount = 6;
  for (let i = 0; i <= vCount; i += 1) {
    const x = padding + (w / vCount) * i;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, padding + priceHeight);
    ctx.stroke();
  }

  const hCount = 4;
  for (let i = 0; i <= hCount; i += 1) {
    const y = padding + (priceHeight / hCount) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + w, y);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  if (lowerEnabled) {
    ctx.strokeStyle = isLight ? "rgba(51,93,255,0.12)" : "rgba(95,193,255,0.12)";
    ctx.beginPath();
    ctx.moveTo(padding, lowerTop);
    ctx.lineTo(padding + w, lowerTop);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, lowerTop + lowerHeight);
    ctx.lineTo(padding + w, lowerTop + lowerHeight);
    ctx.stroke();
  }
  ctx.restore();
}

function ensureChartBackground(canvas, lowerEnabled) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const key = `${Math.round(rect.width)}x${Math.round(rect.height)}-${lowerEnabled ? 1 : 0}`;
  const cached = chartBgCache.get(canvas);
  if (cached && cached.key === key) return;
  resizeCanvasFor(canvas);
  drawChartBackgroundFor(canvas, lowerEnabled);
  chartBgCache.set(canvas, { key });
}

let chartDirty = true;
let chartRAF = 0;
function scheduleChartDraw() {
  if (tvEnabled) {
    renderAllTvSlots();
    return;
  }
  chartDirty = true;
  if (chartRAF) return;
  chartRAF = requestAnimationFrame(() => {
    chartRAF = 0;
    if (!chartDirty) return;
    drawCharts();
    chartDirty = false;
  });
}

function calcMA(series, period) {
  const out = [];
  for (let i = 0; i < series.length; i += 1) {
    if (i + 1 < period) {
      out.push(null);
      continue;
    }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j += 1) sum += series[j];
    out.push(sum / period);
  }
  return out;
}

function calcRSI(series, period) {
  if (series.length < period + 1) return [];
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i += 1) {
    const diff = series[i] - series[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let rs = gains / (losses || 1);
  let rsi = 100 - 100 / (1 + rs);
  const out = Array(period).fill(null);
  out.push(rsi);
  for (let i = period + 1; i < series.length; i += 1) {
    const diff = series[i] - series[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    gains = (gains * (period - 1) + gain) / period;
    losses = (losses * (period - 1) + loss) / period;
    rs = gains / (losses || 1);
    rsi = 100 - 100 / (1 + rs);
    out.push(rsi);
  }
  return out;
}

function calcEMA(series, period) {
  const k = 2 / (period + 1);
  const out = [];
  let ema = series[0] || 0;
  series.forEach((value, idx) => {
    if (idx === 0) {
      ema = value;
    } else {
      ema = value * k + ema * (1 - k);
    }
    out.push(ema);
  });
  return out;
}

function calcMACD(series) {
  if (series.length < 26) return { macd: [], signal: [], hist: [] };
  const ema12 = calcEMA(series, 12);
  const ema26 = calcEMA(series, 26);
  const macd = ema12.map((v, i) => v - ema26[i]);
  const signal = calcEMA(macd, 9);
  const hist = macd.map((v, i) => v - signal[i]);
  return { macd, signal, hist };
}

function calcBB(series, period, mult) {
  const mid = [];
  const upper = [];
  const lower = [];
  for (let i = 0; i < series.length; i += 1) {
    if (i + 1 < period) {
      mid.push(null);
      upper.push(null);
      lower.push(null);
      continue;
    }
    let sum = 0;
    for (let j = i - period + 1; j <= i; j += 1) sum += series[j];
    const mean = sum / period;
    let variance = 0;
    for (let j = i - period + 1; j <= i; j += 1) {
      variance += (series[j] - mean) ** 2;
    }
    const std = Math.sqrt(variance / period);
    mid.push(mean);
    upper.push(mean + mult * std);
    lower.push(mean - mult * std);
  }
  return { mid, upper, lower };
}

/* function buildCandles(series, target = 40) {
  if (!series || series.length === 0) return [];

  const total = series.length;
  // Tính toán kích thước nhóm sao cho luôn ổn định
  // Math.ceil để đảm bảo ta không chia quá nhỏ
  const group = Math.max(1, Math.ceil(total / target));

  const candles = [];

  for (let i = 0; i < total; i += group) {
    // Xác định điểm cắt (slice) an toàn
    const end = Math.min(i + group, total);
    const slice = series.slice(i, end);

    if (slice.length === 0) continue;

    // Tính toán OHLC (Open, High, Low, Close)
    const open = slice[0];
    const close = slice[slice.length - 1];
    let high = -Infinity;
    let low = Infinity;

    for (let j = 0; j < slice.length; j++) {
      const v = slice[j];
      if (v > high) high = v;
      if (v < low) low = v;
    }

    // Xác định nến cuối cùng (nến đang chạy)
    // Nếu điểm kết thúc (end) chạm vào tổng số dữ liệu (total) -> Đây là nến cuối
    const isLastCandle = (end === total);

    candles.push({
      open,
      high,
      low,
      close,
      ghost: isLastCandle // Đánh dấu để vẽ hiệu ứng nến đang thở
    });
  }

  return candles;
}

function calcBrickSize(series) {
  if (!series || series.length < 2) return 1;
  const diffs = [];
  for (let i = 1; i < series.length; i += 1) {
    diffs.push(Math.abs(series[i] - series[i - 1]));
  }
  diffs.sort((a, b) => a - b);
  const idx = Math.max(0, Math.floor(diffs.length * 0.65));
  const raw = diffs[idx] || diffs[diffs.length - 1] || 1;
  return Math.max(raw, (series[series.length - 1] || 1) * 0.0025);
}

function buildRenko(series, target = 40) {
  if (!series || series.length < 2) return [];
  const brick = calcBrickSize(series);
  const bricks = [];
  let last = series[0];
  for (let i = 1; i < series.length; i += 1) {
    const price = series[i];
    let diff = price - last;
    while (Math.abs(diff) >= brick) {
      const dir = diff > 0 ? 1 : -1;
      const open = last;
      const close = last + dir * brick;
      const high = Math.max(open, close);
      const low = Math.min(open, close);
      bricks.push({ open, high, low, close, ghost: false });
      last = close;
      diff = price - last;
    }
  }
  if (bricks.length === 0) {
    bricks.push({ open: last, high: last, low: last, close: last, ghost: true });
  } else {
    bricks[bricks.length - 1].ghost = true;
  }
  if (bricks.length > target) {
    return bricks.slice(bricks.length - target);
  }
  return bricks;
}

*/
function normalizeChartDataLength() {
  const desired = state.chartPoints;
  if (!desired || desired <= 0) return;
  chartData.forEach((history, symbol) => {
    if (!history) return;
    const lastValue = history[history.length - 1] ?? state.market[symbol]?.price ?? 0;
    while (history.length < desired) history.unshift(lastValue);
    if (history.length > desired) history.splice(0, history.length - desired);
    chartData.set(symbol, history);
    candleCounters.set(symbol, 0);
  });
}

function getCandleGroupSize() {
  return Math.max(1, Math.round(state.chartPoints / 40));
}

function buildCandlesFromSeries(series, target = 40) {
  if (!series || series.length === 0) return [];
  const total = series.length;
  const group = Math.max(1, Math.ceil(total / target));
  const candles = [];
  for (let i = 0; i < total; i += group) {
    const end = Math.min(i + group, total);
    const slice = series.slice(i, end);
    if (!slice.length) continue;
    const open = slice[0];
    const close = slice[slice.length - 1];
    let high = -Infinity;
    let low = Infinity;
    for (let j = 0; j < slice.length; j += 1) {
      const v = slice[j];
      if (v > high) high = v;
      if (v < low) low = v;
    }
    candles.push({
      open,
      high,
      low,
      close,
      ghost: end === total
    });
  }
  return candles;
}

function getCandlesForSymbol(symbol) {
  const history = candleHistory.get(symbol) || [];
  const current = candleCurrent.get(symbol);
  let candles = history.slice();
  if (current) {
    const last = candles[candles.length - 1];
    if (!last || last.time !== current.time) candles.push(current);
    else candles[candles.length - 1] = current;
  }
  if (!candles.length) {
    const series = chartData.get(symbol) || [];
    candles = buildCandlesFromSeries(series, Math.max(state.chartPoints, 200));
  }
  return candles
    .map((c) => ({
      open: Number(c.open),
      high: Number(c.high),
      low: Number(c.low),
      close: Number(c.close),
      ghost: !!c.ghost
    }))
    .filter((c) => Number.isFinite(c.open) && Number.isFinite(c.close));
}

function getChartViewport(slotIndex) {
  const idx = Math.max(0, Math.min(chartViewports.length - 1, Number(slotIndex) || 0));
  return chartViewports[idx];
}

function getVisibleCount(total, zoom) {
  const maxVisible = Math.min(CHART_MAX_VISIBLE, Math.max(CHART_MIN_VISIBLE, total));
  const raw = Math.round((state.chartPoints || 120) / zoom);
  return Math.max(CHART_MIN_VISIBLE, Math.min(maxVisible, raw));
}

function sliceCandlesForViewport(allCandles, slotIndex) {
  const total = allCandles.length;
  if (total <= CHART_MIN_VISIBLE) {
    return {
      candles: allCandles.slice(),
      total,
      visible: total,
      leftIndex: 0
    };
  }
  const viewport = getChartViewport(slotIndex);
  viewport.zoom = clamp(Number(viewport.zoom) || 1, CHART_ZOOM_MIN, CHART_ZOOM_MAX);
  const visible = getVisibleCount(total, viewport.zoom);
  const maxOffset = Math.max(0, total - visible);
  viewport.offset = clamp(Math.round(Number(viewport.offset) || 0), 0, maxOffset);
  const leftIndex = total - visible - viewport.offset;
  return {
    candles: allCandles.slice(leftIndex, leftIndex + visible),
    total,
    visible,
    leftIndex
  };
}

function buildChartFrame(canvas, symbol, lowerEnabled, slotIndex = 0) {
  if (!canvas || !symbol) return null;
  const data = chartData.get(symbol);
  if (!data || data.length < 2) return null;
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return null;

  const series = data.slice(-state.chartPoints);
  if (series.length < 2) return null;
  const allCandles = getCandlesForSymbol(symbol);
  const viewportSlice = sliceCandlesForViewport(allCandles, slotIndex);
  const candles = viewportSlice.candles;
  if (candles.length < 2) return null;
  const closes = candles.map((c) => c.close);

  const padding = 22;
  const w = rect.width - padding * 2;
  const h = rect.height - padding * 2;
  const priceHeight = lowerEnabled ? h * 0.68 : h;
  const lowerHeight = lowerEnabled ? h * 0.25 : 0;
  const lowerTop = padding + priceHeight + (lowerEnabled ? 10 : 0);

  let min = Math.min(...candles.map((c) => c.low));
  let max = Math.max(...candles.map((c) => c.high));

  const bb = state.indicators.bb ? calcBB(closes, 20, 2) : null;
  if (bb) {
    const upper = bb.upper.filter((v) => v != null);
    const lower = bb.lower.filter((v) => v != null);
    if (upper.length) max = Math.max(max, ...upper);
    if (lower.length) min = Math.min(min, ...lower);
  }

  const range = max - min || 1;
  const priceToY = (value) => padding + priceHeight - ((value - min) / range) * priceHeight;
  const candleGap = candles.length > 1 ? w / (candles.length - 1) : w;
  const candleWidth = Math.max(2, candleGap * 0.6);
  const last = candles[candles.length - 1];

  const trailWindow = Math.min(12, candles.length);
  const trailSlice = candles.slice(-trailWindow);
  const trailMin = Math.min(...trailSlice.map((c) => c.close));
  const trailMax = Math.max(...trailSlice.map((c) => c.close));
  const trailAvg = (trailMin + trailMax) / 2 || last.close || 1;
  let volatility = (trailMax - trailMin) / trailAvg;
  const boost = state.volBoosts[symbol];
  if (boost && boost.expires > Date.now()) volatility *= 1.6;

  return {
    symbol,
    lowerEnabled,
    rect,
    padding,
    w,
    h,
    priceHeight,
    lowerHeight,
    lowerTop,
    candles,
    closes,
    min,
    max,
    range,
    candleGap,
    candleWidth,
    last,
    priceToY,
    bb,
    volatility,
    slotIndex,
    totalCandles: viewportSlice.total,
    visibleCandles: viewportSlice.visible,
    leftIndex: viewportSlice.leftIndex
  };
}

function drawChartFor(canvas, symbol, lowerEnabled, slotIndex = 0) {
  if (!canvas || !symbol) return;
  const ctx = getCanvasContext(canvas);
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();
  ctx.clearRect(0, 0, rect.width, rect.height);
  const frame = buildChartFrame(canvas, symbol, lowerEnabled, slotIndex);
  if (!frame) return null;

  const { candles, closes, padding, priceToY, candleGap, candleWidth, bb, lowerHeight, lowerTop, priceHeight } = frame;
  const rsiEnabled = state.indicators.rsi;
  const macdEnabled = state.indicators.macd;
  const last = candles[candles.length - 1];

  ctx.save();
  candles.forEach((candle, idx) => {
    const x = padding + idx * candleGap;
    const openY = priceToY(candle.open);
    const closeY = priceToY(candle.close);
    const highY = priceToY(candle.high);
    const lowY = priceToY(candle.low);
    const up = candle.close >= candle.open;
    const alpha = candle.ghost ? 0.45 : 0.9;
    const bodyColor = up ? `rgba(62,240,183,${alpha})` : `rgba(255,92,122,${alpha})`;
    const wickColor = up ? `rgba(62,240,183,${Math.min(alpha + 0.1, 1)})` : `rgba(255,92,122,${Math.min(alpha + 0.1, 1)})`;

    ctx.strokeStyle = wickColor;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x, highY);
    ctx.lineTo(x, lowY);
    ctx.stroke();

    const bodyTop = Math.min(openY, closeY);
    const bodyBottom = Math.max(openY, closeY);
    const bodyHeight = Math.max(2, bodyBottom - bodyTop);
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
  });

  if (last) {
    const lastX = padding + (candles.length - 1) * candleGap;
    const lastY = priceToY(last.close);
    const up = last.close >= last.open;
    const lastColor = up ? "62,240,183" : "255,92,122";
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(padding, lastY);
    ctx.lineTo(padding + (candles.length - 1) * candleGap, lastY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = `rgba(${lastColor},0.9)`;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();

  if (state.indicators.ma14) {
    const ma = calcMA(closes, 14);
    ctx.beginPath();
    ma.forEach((value, idx) => {
      if (value == null) return;
      const x = padding + idx * candleGap;
      const y = priceToY(value);
      if (idx === 0 || ma[idx - 1] == null) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "rgba(95, 91, 255, 0.9)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  if (state.indicators.ema9) {
    const ema = calcEMA(closes, 9);
    ctx.beginPath();
    ema.forEach((value, idx) => {
      if (idx < 8 || value == null) return;
      const x = padding + idx * candleGap;
      const y = priceToY(value);
      if (idx === 0 || ema[idx - 1] == null) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "rgba(66, 215, 255, 0.9)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }

  if (state.indicators.ema21) {
    const ema = calcEMA(closes, 21);
    ctx.beginPath();
    ema.forEach((value, idx) => {
      if (idx < 20 || value == null) return;
      const x = padding + idx * candleGap;
      const y = priceToY(value);
      if (idx === 0 || ema[idx - 1] == null) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "rgba(255, 120, 190, 0.9)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }

  if (state.indicators.ma50) {
    const ma = calcMA(closes, 50);
    ctx.beginPath();
    ma.forEach((value, idx) => {
      if (value == null) return;
      const x = padding + idx * candleGap;
      const y = priceToY(value);
      if (idx === 0 || ma[idx - 1] == null) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "rgba(255, 197, 110, 0.9)";
    ctx.lineWidth = 1.1;
    ctx.stroke();
  }

  if (state.indicators.ma200) {
    const ma = calcMA(closes, 200);
    ctx.beginPath();
    ma.forEach((value, idx) => {
      if (value == null) return;
      const x = padding + idx * candleGap;
      const y = priceToY(value);
      if (idx === 0 || ma[idx - 1] == null) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "rgba(180, 180, 180, 0.75)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  if (bb) {
    ctx.beginPath();
    bb.upper.forEach((value, idx) => {
      if (value == null) return;
      const x = padding + idx * candleGap;
      const y = priceToY(value);
      if (idx === 0 || bb.upper[idx - 1] == null) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "rgba(255, 197, 110, 0.6)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    bb.lower.forEach((value, idx) => {
      if (value == null) return;
      const x = padding + idx * candleGap;
      const y = priceToY(value);
      if (idx === 0 || bb.lower[idx - 1] == null) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "rgba(95, 91, 255, 0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  if (rsiEnabled) {
    const rsi = calcRSI(closes, 14);
    ctx.beginPath();
    rsi.forEach((value, idx) => {
      if (value == null) return;
      const x = padding + idx * candleGap;
      const y = lowerTop + lowerHeight - (value / 100) * lowerHeight;
      if (idx === 0 || rsi[idx - 1] == null) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "rgba(255, 92, 122, 0.85)";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  if (macdEnabled) {
    const { macd, signal } = calcMACD(closes);
    if (macd.length > 0) {
      const combined = macd.concat(signal).filter((v) => typeof v === "number");
      const macdMin = Math.min(...combined);
      const macdMax = Math.max(...combined);
      const macdRange = macdMax - macdMin || 1;

      ctx.beginPath();
      macd.forEach((value, idx) => {
        if (value == null) return;
        const x = padding + idx * candleGap;
        const y = lowerTop + lowerHeight - ((value - macdMin) / macdRange) * lowerHeight;
        if (idx === 0 || macd[idx - 1] == null) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "rgba(62, 240, 183, 0.85)";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.beginPath();
      signal.forEach((value, idx) => {
        if (value == null) return;
        const x = padding + idx * candleGap;
        const y = lowerTop + lowerHeight - ((value - macdMin) / macdRange) * lowerHeight;
        if (idx === 0 || signal[idx - 1] == null) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "rgba(255, 197, 110, 0.85)";
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  }

  return frame;
}

function updateChartLabels() {
  els.tileLabels.forEach((label, idx) => {
    if (!label) return;
    const symbol = state.chartSlots[idx];
    if (symbol) label.textContent = `${symbol}/${state.quote}`;
  });
}

function initLightweightCharts() {
  if (tvEnabled) return;
  if (typeof LightweightCharts === "undefined") return;
  if (!els.chartTvContainers.length) return;
  try {
    els.chartTvContainers.forEach((container, idx) => {
      if (tvCharts[idx]) return;
      const chart = LightweightCharts.createChart(container, {
        width: container.clientWidth || 300,
        height: container.clientHeight || 200,
        watermark: { visible: false },
        layout: {
          background: { color: "transparent" },
          textColor: document.body.dataset.theme === "light" ? "#111827" : "#d1d4dc",
          attributionLogo: false
        },
        grid: {
          vertLines: { color: "rgba(42, 46, 57, 0.35)" },
          horzLines: { color: "rgba(42, 46, 57, 0.35)" }
        },
        timeScale: { timeVisible: true, secondsVisible: false },
        rightPriceScale: { borderVisible: false }
      });
      if (chart.applyOptions) chart.applyOptions({ layout: { attributionLogo: false }, watermark: { visible: false } });
      const series = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350"
      });
      tvCharts[idx] = chart;
      tvSeries[idx] = series;
    });
    tvEnabled = true;
    document.body.dataset.chart = "tv";
    resizeTvCharts();
    if (!socket || !socket.connected) {
      seedLocalCandles();
    }
    renderAllTvSlots();
  } catch (err) {
    console.error("Lightweight chart init failed", err);
    tvEnabled = false;
    delete document.body.dataset.chart;
    scheduleChartDraw();
  }
}

function resizeTvCharts() {
  if (!tvEnabled) return;
  els.chartTvContainers.forEach((container, idx) => {
    const chart = tvCharts[idx];
    if (!chart) return;
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) chart.resize(rect.width, rect.height);
  });
}

function getCandleData(symbol) {
  const history = candleHistory.get(symbol) || [];
  const current = candleCurrent.get(symbol);
  const data = history.slice();
  if (current) {
    if (!data.length || data[data.length - 1].time < current.time) data.push(current);
    else data[data.length - 1] = current;
  }
  return data;
}

function buildPlaceholderCandles(symbol) {
  const price = state.market[symbol]?.price;
  if (!Number.isFinite(price)) return [];
  const now = Math.floor(Date.now() / 1000);
  const candles = [];
  let last = price;
  for (let i = 30; i > 0; i -= 1) {
    const time = now - i * 60;
    const open = last;
    const close = open * (1 + (Math.random() - 0.5) * 0.002);
    const high = Math.max(open, close);
    const low = Math.min(open, close);
    candles.push({ time, open, high, low, close });
    last = close;
  }
  return candles;
}

function renderTvSlot(idx) {
  if (!tvEnabled) return;
  const symbol = state.chartSlots[idx];
  const series = tvSeries[idx];
  const chart = tvCharts[idx];
  if (!series || !symbol) return;
  let data = getCandleData(symbol);
  if (!data.length) {
    data = buildPlaceholderCandles(symbol);
  }
  try {
    series.setData(data);
    if (chart && chart.timeScale) chart.timeScale().fitContent();
  } catch (err) {
    console.warn("Lỗi vẽ nến:", err);
  }
}

function renderAllTvSlots() {
  if (!tvEnabled) return;
  const layout = state.chartLayout;
  for (let i = 0; i < layout; i += 1) renderTvSlot(i);
}

function updateTvForSymbol(symbol, candle) {
  if (!tvEnabled || !candle) return;
  const layout = state.chartLayout;
  for (let i = 0; i < layout; i += 1) {
    if (state.chartSlots[i] === symbol && tvSeries[i]) {
      tvSeries[i].update(candle);
    }
  }
}

function getChartSlotFromEvent(event) {
  if (!els.chartGrid) return 0;
  const tile = event.target?.closest?.(".chart-tile");
  if (tile && tile.dataset?.slot != null) {
    const idx = parseInt(tile.dataset.slot, 10);
    if (Number.isFinite(idx)) return idx;
  }
  const rect = els.chartGrid.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return 0;
  const layout = state.chartLayout;
  if (layout <= 1) return 0;
  const cols = layout === 2 ? 2 : 2;
  const rows = layout === 4 ? 2 : 1;
  const col = Math.min(cols - 1, Math.max(0, Math.floor((event.clientX - rect.left) / (rect.width / cols))));
  const row = Math.min(rows - 1, Math.max(0, Math.floor((event.clientY - rect.top) / (rect.height / rows))));
  return row * cols + col;
}

function markChartInteraction(duration = 220) {
  const ms = Math.max(80, Number(duration) || 220);
  chartInteractionUntil = Date.now() + ms;
  if (els.chartArea) els.chartArea.classList.add("interacting");
  document.body.classList.add("chart-interacting");
  if (chartInteractionTimer) clearTimeout(chartInteractionTimer);
  chartInteractionTimer = setTimeout(() => {
    chartInteractionTimer = 0;
    if (Date.now() < chartInteractionUntil) {
      markChartInteraction(chartInteractionUntil - Date.now());
      return;
    }
    if (els.chartArea) els.chartArea.classList.remove("interacting");
    document.body.classList.remove("chart-interacting");
  }, ms + 24);
}

function resetChartViewport(slotIndex, keepZoom = false) {
  const viewport = getChartViewport(slotIndex);
  viewport.offset = 0;
  if (!keepZoom) viewport.zoom = 1;
  if (chartFrames[slotIndex]) chartFrames[slotIndex] = null;
}

function zoomChartAt(slotIndex, clientX, deltaY) {
  const symbol = state.chartSlots[slotIndex];
  if (!symbol) return;
  const allCandles = getCandlesForSymbol(symbol);
  if (!allCandles || allCandles.length < 3) return;
  const wheelDelta = clamp(Number(deltaY) || 0, -720, 720);
  if (Math.abs(wheelDelta) < 0.01) return;

  const viewport = getChartViewport(slotIndex);
  const oldZoom = clamp(Number(viewport.zoom) || 1, CHART_ZOOM_MIN, CHART_ZOOM_MAX);
  const factor = clamp(Math.exp(-wheelDelta * 0.0015), 0.72, 1.38);
  const nextZoom = clamp(oldZoom * factor, CHART_ZOOM_MIN, CHART_ZOOM_MAX);
  if (Math.abs(nextZoom - oldZoom) < 0.0001) return;

  const total = allCandles.length;
  const visibleBefore = getVisibleCount(total, oldZoom);
  const visibleAfter = getVisibleCount(total, nextZoom);
  const tile = els.chartGrid?.querySelector(`.chart-tile[data-slot="${slotIndex}"]`);
  const rect = tile ? tile.getBoundingClientRect() : null;
  const ratio = rect
    ? clamp((clientX - rect.left) / Math.max(1, rect.width), 0, 1)
    : 0.5;

  const oldOffset = clamp(Number(viewport.offset) || 0, 0, Math.max(0, total - visibleBefore));
  const leftBefore = total - visibleBefore - oldOffset;
  const anchorIndex = leftBefore + ratio * (visibleBefore - 1);

  viewport.zoom = nextZoom;
  const maxOffsetAfter = Math.max(0, total - visibleAfter);
  const leftAfter = Math.round(anchorIndex - ratio * (visibleAfter - 1));
  viewport.offset = clamp(total - visibleAfter - leftAfter, 0, maxOffsetAfter);
  chartFrames[slotIndex] = null;
}

function flushChartWheelZoom() {
  chartWheelState.raf = 0;
  const deltaY = chartWheelState.deltaY;
  if (!Number.isFinite(deltaY) || Math.abs(deltaY) < 0.01) return;
  zoomChartAt(chartWheelState.slot, chartWheelState.clientX, deltaY);
  chartWheelState.deltaY = 0;
  scheduleChartDraw();
}

function queueChartZoom(slotIndex, clientX, deltaY) {
  if (!Number.isFinite(deltaY) || deltaY === 0) return;
  markChartInteraction(240);
  if (chartWheelState.slot !== slotIndex) {
    chartWheelState.slot = slotIndex;
    chartWheelState.deltaY = 0;
  }
  chartWheelState.clientX = clientX;
  chartWheelState.deltaY = clamp(chartWheelState.deltaY + deltaY, -1200, 1200);
  if (chartWheelState.raf) return;
  chartWheelState.raf = requestAnimationFrame(flushChartWheelZoom);
}

function zoomTvAt(slotIndex, clientX, deltaY) {
  const chart = tvCharts[slotIndex];
  const container = els.chartTvContainers?.[slotIndex];
  if (!chart || !container || !chart.timeScale) return;
  const wheelDelta = clamp(Number(deltaY) || 0, -720, 720);
  if (Math.abs(wheelDelta) < 0.01) return;
  const factor = clamp(Math.exp(-wheelDelta * 0.0015), 0.72, 1.38);
  const ts = chart.timeScale();
  const rect = container.getBoundingClientRect();
  const localX = clamp(clientX - rect.left, 0, rect.width);
  let handled = false;
  try {
    if (
      typeof ts.getVisibleLogicalRange === "function"
      && typeof ts.setVisibleLogicalRange === "function"
      && typeof ts.coordinateToLogical === "function"
    ) {
      const range = ts.getVisibleLogicalRange();
      const logical = ts.coordinateToLogical(localX);
      if (range && Number.isFinite(range.from) && Number.isFinite(range.to) && Number.isFinite(logical)) {
        const oldLen = range.to - range.from;
        if (oldLen > 0.01) {
          const symbol = state.chartSlots[slotIndex];
          const total = symbol ? getCandleData(symbol).length : 0;
          const maxLen = Math.max(10, total || 10);
          const newLen = clamp(oldLen * factor, 10, maxLen);
          const ratio = clamp((logical - range.from) / oldLen, 0, 1);
          const newFrom = logical - ratio * newLen;
          const newTo = newFrom + newLen;
          ts.setVisibleLogicalRange({ from: newFrom, to: newTo });
          handled = true;
        }
      }
    }
  } catch {
    handled = false;
  }
  if (!handled && typeof ts.getBarSpacing === "function" && typeof ts.setBarSpacing === "function") {
    const spacing = ts.getBarSpacing();
    if (Number.isFinite(spacing)) {
      ts.setBarSpacing(clamp(spacing * factor, TV_BAR_SPACING_MIN, TV_BAR_SPACING_MAX));
    }
  }
}

function startChartPan(event) {
  if (tvEnabled || !event || event.button !== 0) return false;
  const slot = getChartSlotFromEvent(event);
  const symbol = state.chartSlots[slot];
  if (!symbol) return false;
  const allCandles = getCandlesForSymbol(symbol);
  if (!allCandles || allCandles.length < CHART_MIN_VISIBLE + 2) return false;
  const viewport = getChartViewport(slot);
  chartPanState.active = false;
  chartPanState.pending = true;
  chartPanState.slot = slot;
  chartPanState.startX = event.clientX;
  chartPanState.startY = event.clientY;
  chartPanState.startOffset = Number(viewport.offset) || 0;
  chartPanState.pointerId = Number.isFinite(event.pointerId) ? event.pointerId : null;
  return true;
}

function moveChartPan(event) {
  if ((!chartPanState.active && !chartPanState.pending) || tvEnabled || !event) return false;
  const slot = chartPanState.slot;
  const symbol = state.chartSlots[slot];
  if (!symbol) return false;
  const moveX = event.clientX - chartPanState.startX;
  const moveY = event.clientY - chartPanState.startY;
  if (chartPanState.pending && !chartPanState.active) {
    const moved = Math.hypot(moveX, moveY);
    if (moved < CHART_PAN_THRESHOLD) return false;
    chartPanState.pending = false;
    chartPanState.active = true;
    markChartInteraction(320);
    if (els.chartArea) els.chartArea.classList.add("dragging");
  }
  if (!chartPanState.active) return false;
  const baseCanvas = els.chartCanvases[slot] || els.chartFxCanvases[slot];
  const lowerEnabled = state.indicators.rsi || state.indicators.macd;
  let frame = chartFrames[slot];
  if (!frame || frame.symbol !== symbol || frame.lowerEnabled !== lowerEnabled) {
    frame = buildChartFrame(baseCanvas, symbol, lowerEnabled, slot);
    chartFrames[slot] = frame;
  }
  if (!frame || !frame.candleGap) return false;
  const deltaPx = moveX;
  const deltaCandles = Math.round(deltaPx / Math.max(2, frame.candleGap));
  const viewport = getChartViewport(slot);
  const allCandles = getCandlesForSymbol(symbol);
  const visible = getVisibleCount(allCandles.length, viewport.zoom);
  const maxOffset = Math.max(0, allCandles.length - visible);
  const nextOffset = clamp(chartPanState.startOffset + deltaCandles, 0, maxOffset);
  if (nextOffset === viewport.offset) return true;
  viewport.offset = nextOffset;
  markChartInteraction(180);
  chartFrames[slot] = null;
  state.crosshair.active = false;
  if (els.chartTooltip) els.chartTooltip.classList.add("hidden");
  scheduleChartDraw();
  return true;
}

function endChartPan() {
  if (!chartPanState.active && !chartPanState.pending) return;
  if (
    chartPanState.pointerId != null
    && els.chartArea
    && typeof els.chartArea.hasPointerCapture === "function"
    && els.chartArea.hasPointerCapture(chartPanState.pointerId)
    && typeof els.chartArea.releasePointerCapture === "function"
  ) {
    try {
      els.chartArea.releasePointerCapture(chartPanState.pointerId);
    } catch {
      // ignore pointer capture release errors
    }
  }
  chartPanState.active = false;
  chartPanState.pending = false;
  chartPanState.slot = -1;
  chartPanState.pointerId = null;
  if (els.chartArea) els.chartArea.classList.remove("dragging");
}

function renderChartTooltip(frame, candle, x, y) {
  if (!els.chartTooltip || !els.chartArea || !candle || !frame) return;
  const fmt = (value) => (state.quote === "USD" ? formatUSD(value) : formatVND(value));
  const timeLabel = candle.time ? formatDateTime(candle.time * 1000) : "-";
  els.chartTooltip.innerHTML = `
    <div class="tt-title">${escapeHtml(frame.symbol)}</div>
    <div class="tt-row"><span>Time</span><span>${escapeHtml(timeLabel)}</span></div>
    <div class="tt-row"><span>O</span><span>${fmt(toQuote(candle.open))}</span></div>
    <div class="tt-row"><span>H</span><span>${fmt(toQuote(candle.high))}</span></div>
    <div class="tt-row"><span>L</span><span>${fmt(toQuote(candle.low))}</span></div>
    <div class="tt-row"><span>C</span><span>${fmt(toQuote(candle.close))}</span></div>
  `;
  els.chartTooltip.classList.remove("hidden");
  const areaRect = els.chartArea.getBoundingClientRect();
  const rect = frame.rect;
  const tooltipRect = els.chartTooltip.getBoundingClientRect();
  const rawLeft = rect.left - areaRect.left + x + 12;
  const rawTop = rect.top - areaRect.top + y - tooltipRect.height - 12;
  const maxLeft = areaRect.width - tooltipRect.width - 12;
  const maxTop = areaRect.height - tooltipRect.height - 12;
  const left = Math.max(12, Math.min(maxLeft, rawLeft));
  const top = Math.max(12, Math.min(maxTop, rawTop));
  els.chartTooltip.style.transform = `translate(${left}px, ${top}px)`;
}

function updateChartCrosshair(event) {
  if (!els.chartGrid) return;
  const slot = getChartSlotFromEvent(event);
  const symbol = state.chartSlots[slot];
  if (!symbol) return;
  const canvas = els.chartCanvases[slot] || els.chartFxCanvases[slot];
  if (!canvas) return;
  const lowerEnabled = state.indicators.rsi || state.indicators.macd;
  let frame = chartFrames[slot];
  if (!frame || frame.symbol !== symbol || frame.lowerEnabled !== lowerEnabled) {
    frame = buildChartFrame(canvas, symbol, lowerEnabled, slot);
    chartFrames[slot] = frame;
  }
  if (!frame) return;
  const rect = canvas.getBoundingClientRect();
  const localX = event.clientX - rect.left;
  const localY = event.clientY - rect.top;
  const clampedX = Math.max(frame.padding, Math.min(rect.width - frame.padding, localX));
  const clampedY = Math.max(frame.padding, Math.min(frame.padding + frame.priceHeight, localY));
  const idx = Math.round((clampedX - frame.padding) / frame.candleGap);
  const safeIdx = Math.max(0, Math.min(frame.candles.length - 1, idx));
  const candle = frame.candles[safeIdx];
  const x = frame.padding + safeIdx * frame.candleGap;
  const price = frame.max - ((clampedY - frame.padding) / frame.priceHeight) * frame.range;
  state.crosshair = { active: true, slot, x, y: clampedY, price, candle, idx: safeIdx };
  renderChartTooltip(frame, candle, x, clampedY);
}

function hideChartCrosshair() {
  state.crosshair.active = false;
  if (els.chartTooltip) els.chartTooltip.classList.add("hidden");
}

function handleInitHistory(payload) {
  if (!payload || !payload.history) return false;
  candleHistory.clear();
  candleCurrent.clear();
  Object.entries(payload.history).forEach(([symbol, series]) => {
    if (!Array.isArray(series) || series.length === 0) return;
    candleHistory.set(symbol, series);
  });
  if (payload.current && typeof payload.current === "object") {
    Object.entries(payload.current).forEach(([symbol, candle]) => {
      if (candle) candleCurrent.set(symbol, candle);
    });
  }
  state.marketFromServer = true;
  if (!tvEnabled) initLightweightCharts();
  renderAllTvSlots();
  return true;
}

function seedLocalCandles() {
  const now = Math.floor(Date.now() / 1000);
  coins.forEach((coin) => {
    const series = chartData.get(coin.symbol);
    if (!series || series.length === 0) return;
    if (candleHistory.has(coin.symbol) && candleHistory.get(coin.symbol)?.length) return;
    const candles = [];
    let last = series[0];
    const start = now - series.length * 60;
    series.forEach((price, idx) => {
      const time = start + idx * 60;
      const open = last;
      const close = price;
      const high = Math.max(open, close);
      const low = Math.min(open, close);
      candles.push({ time, open, high, low, close });
      last = close;
    });
    candleHistory.set(coin.symbol, candles);
    candleCurrent.set(coin.symbol, candles[candles.length - 1]);
  });
}

function updateOfflineCandles(symbols) {
  const now = Math.floor(Date.now() / 1000);
  const bucket = now - (now % 60);
  symbols.forEach((symbol) => {
    const price = state.market[symbol]?.price;
    if (!Number.isFinite(price)) return;
    let candle = candleCurrent.get(symbol);
    if (!candle || candle.time !== bucket) {
      if (candle) {
        const history = candleHistory.get(symbol) || [];
        history.push(candle);
        if (history.length > 1000) history.shift();
        candleHistory.set(symbol, history);
      }
      candle = { time: bucket, open: price, high: price, low: price, close: price };
      candleCurrent.set(symbol, candle);
    } else {
      candle.close = price;
      if (price > candle.high) candle.high = price;
      if (price < candle.low) candle.low = price;
    }
    updateTvForSymbol(symbol, candle);
  });
}

function drawCharts() {
  const layout = state.chartLayout;
  const tiles = els.chartGrid ? Array.from(els.chartGrid.children) : [];
  tiles.forEach((tile, idx) => {
    tile.style.display = idx < layout ? "block" : "none";
  });
  updateChartLabels();
  const lowerEnabled = state.indicators.rsi || state.indicators.macd;
  for (let i = 0; i < layout; i += 1) {
    const canvas = els.chartCanvases[i];
    const bgCanvas = els.chartBgCanvases[i];
    const symbol = state.chartSlots[i];
    if (!canvas || !symbol) continue;
    ensureChartBackground(bgCanvas, lowerEnabled);
    resizeCanvasFor(canvas);
    const frame = drawChartFor(canvas, symbol, lowerEnabled, i);
    chartFrames[i] = frame;
  }
}

function drawChart() {
  scheduleChartDraw();
}

let fxRAF = 0;
let fxLast = 0;
const FX_FRAME_MS = 1000 / 40;

let bgRAF = 0;
let bgLast = 0;
const bgState = {
  ctx: null,
  width: 0,
  height: 0,
  particles: [],
  intensity: 1
};

function resizeBgCanvas() {
  if (!els.bgCanvas) return;
  const dpr = window.devicePixelRatio || 1;
  const w = window.innerWidth;
  const h = window.innerHeight;
  els.bgCanvas.width = Math.floor(w * dpr);
  els.bgCanvas.height = Math.floor(h * dpr);
  els.bgCanvas.style.width = `${w}px`;
  els.bgCanvas.style.height = `${h}px`;
  bgState.ctx = els.bgCanvas.getContext("2d");
  bgState.ctx.setTransform(1, 0, 0, 1, 0, 0);
  bgState.ctx.scale(dpr, dpr);
  bgState.width = w;
  bgState.height = h;
  seedBgParticles();
}

function seedBgParticles() {
  if (!bgState.ctx) return;
  const area = bgState.width * bgState.height;
  const count = Math.min(240, Math.max(90, Math.floor(area / 12000)));
  bgState.particles = Array.from({ length: count }, () => {
    const speed = 0.06 + Math.random() * 0.2;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * bgState.width,
      y: Math.random() * bgState.height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 0.6 + Math.random() * 1.8,
      type: Math.random() > 0.75 ? "line" : "dot",
      len: 6 + Math.random() * 18,
      tint: (Math.random() - 0.5) * 40
    };
  });
}

function updateBgParticles(time) {
  if (!bgState.ctx) return;
  const ctx = bgState.ctx;
  const w = bgState.width;
  const h = bgState.height;
  const dt = Math.min(48, time - bgLast || 16);
  bgLast = time;
  const dtScale = dt / 16.6;
  const storm = !!state.macro.blackSwan;
  const targetIntensity = storm ? 4.2 : 1;
  bgState.intensity += (targetIntensity - bgState.intensity) * 0.04;
  const isLight = document.body.dataset.theme === "light";

  ctx.clearRect(0, 0, w, h);
  const base = storm
    ? (isLight ? [210, 40, 60] : [255, 90, 100])
    : (isLight ? [40, 90, 160] : [120, 220, 255]);
  const alt = storm
    ? (isLight ? [190, 30, 55] : [255, 60, 80])
    : (isLight ? [70, 120, 200] : [140, 160, 255]);
  ctx.save();
  ctx.globalCompositeOperation = isLight ? "source-over" : "screen";

  bgState.particles.forEach((p) => {
    const jitter = storm ? (Math.random() - 0.5) * 0.4 * dtScale : 0;
    p.x += (p.vx * bgState.intensity + jitter) * dtScale * 2.4;
    p.y += (p.vy * bgState.intensity + jitter) * dtScale * 2.4;
    if (p.x < -20) p.x = w + 20;
    if (p.x > w + 20) p.x = -20;
    if (p.y < -20) p.y = h + 20;
    if (p.y > h + 20) p.y = -20;

    const tint = p.tint;
    const mix = p.type === "line" ? alt : base;
    const r = Math.max(0, Math.min(255, mix[0] + tint));
    const g = Math.max(0, Math.min(255, mix[1] + tint * 0.5));
    const b = Math.max(0, Math.min(255, mix[2] - tint * 0.4));
    const alpha = storm ? (isLight ? 0.4 : 0.35) : (isLight ? 0.28 : 0.2);
    if (p.type === "line") {
      const len = p.len * (storm ? 1.6 : 1);
      const dx = p.vx * len * 18;
      const dy = p.vy * len * 18;
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x - dx, p.y - dy);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    } else {
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (storm ? 1.3 : 1), 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();
}

function startBgLoop() {
  if (bgRAF) return;
  const step = (time) => {
    bgRAF = requestAnimationFrame(step);
    if (document.hidden) return;
    updateBgParticles(time);
  };
  bgRAF = requestAnimationFrame(step);
}

function playGlassBreak() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const duration = 0.35;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1200;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + duration + 0.05);
  } catch {
    // ignore
  }
}

/* function updateMarketLogic(coin) {
  if (marketTrends[coin.symbol] === undefined) marketTrends[coin.symbol] = 0;
  const market = state.market[coin.symbol];

  const boost = state.volBoosts[coin.symbol];
  const mult = boost && boost.expires > Date.now() ? boost.mult : 1;

  let trend = marketTrends[coin.symbol];
  const regime = state.marketRegime.mode;
  const regimeVol = regime === "volatile" ? 1.6 : regime === "trend" ? 1.15 : 0.75;
  const regimeDamp = regime === "volatile" ? 0.985 : regime === "trend" ? 0.992 : 0.96;
  if (!godMode.freeze) {
    const change = (Math.random() - 0.5) * 0.1;
    trend += change;
    trend *= regimeDamp;
  } else {
    trend *= 0.9;
  }

  if (state.macro.blackSwan) trend -= 0.5;
  if (state.macro.pumpGroup && state.macro.pumpGroup.symbols.includes(coin.symbol)) trend += 0.8;

  marketTrends[coin.symbol] = trend;

  const baseVol = state.liveSymbols.has(coin.symbol) ? coin.vol * 0.35 : coin.vol;
  const volatility = baseVol * 0.05 * godMode.volScale * mult * regimeVol;
  const noise = (Math.random() - 0.5) * volatility * 0.5;
  const movement = trend * volatility + noise;

  market.prev = market.price;
  market.price = Math.max(0.0000001, market.price + movement * market.price);
}
*/

function updateMarketRegime() {
  const now = Date.now();
  if (state.marketRegime.until && now < state.marketRegime.until) return;
  let mode = "sideway";
  if (state.macro.blackSwan) {
    mode = "volatile";
  } else {
    const trendStrength = Math.abs(marketTrends[state.selected] || 0);
    const roll = Math.random();
    if (trendStrength > 0.4) mode = roll < 0.7 ? "trend" : "volatile";
    else if (roll < 0.45) mode = "sideway";
    else if (roll < 0.8) mode = "trend";
    else mode = "volatile";
  }
  const duration = mode === "volatile" ? 60000 : mode === "trend" ? 90000 : 120000;
  state.marketRegime = { mode, until: now + duration };
}

function refreshRiskState() {
  const now = Date.now();
  if (state.risk.limitUntil && now > state.risk.limitUntil) {
    state.risk.limitUntil = 0;
    state.risk.maxLeverage = null;
    updateLeverageOptions();
  }
  if (state.risk.cooldownUntil && now > state.risk.cooldownUntil) {
    state.risk.cooldownUntil = 0;
  }
}

function spawnOrderSplash(symbol, side, price) {
  if (!ORDER_SPLASH_ENABLED) return;
  const slot = state.chartSlots.findIndex((s, idx) => idx < state.chartLayout && s === symbol);
  if (slot === -1) return;
  const lowerEnabled = state.indicators.rsi || state.indicators.macd;
  let frame = chartFrames[slot];
  if (!frame || frame.symbol !== symbol || frame.lowerEnabled !== lowerEnabled) {
    const baseCanvas = els.chartCanvases[slot] || els.chartFxCanvases[slot];
    frame = buildChartFrame(baseCanvas, symbol, lowerEnabled, slot);
    chartFrames[slot] = frame;
  }
  if (!frame) return;
  const lastIdx = frame.candles.length - 1;
  const x = frame.padding + lastIdx * frame.candleGap + frame.candleGap / 2;
  const y = frame.priceToY(price);
  const color = side === "buy" ? "62,240,183" : "255,92,122";
  const baseAngle = side === "buy" ? -Math.PI / 2 : Math.PI / 2;
  const spread = Math.PI * 0.65;
  const count = 16 + Math.floor(Math.random() * 10);

  for (let i = 0; i < count; i += 1) {
    const angle = baseAngle + (Math.random() - 0.5) * spread;
    const speed = 1.6 + Math.random() * 2.8;
    fxBursts[slot].push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: 1 + Math.random() * 2.6,
      color,
      streak: Math.random() > 0.55,
      gravity: side === "buy" ? 0.03 : 0.06
    });
  }
}

function drawFxFor(canvas, frame, time, slotIndex) {
  if (!canvas || !frame) return;
  const ctx = getCanvasContext(canvas);
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;
  ctx.clearRect(0, 0, rect.width, rect.height);

  const { candles, candleGap, padding, priceToY, last, volatility } = frame;
  if (!candles || !last) return;

  const isLight = document.body.dataset.theme === "light";
  const perfMode = state.perfMode || Date.now() < chartInteractionUntil;
  const blend = isLight ? "source-over" : "lighter";
  const lastIdx = candles.length - 1;
  const x = padding + lastIdx * candleGap;
  const y = priceToY(last.close);
  const up = last.close >= last.open;
  const color = up ? "62,240,183" : "255,92,122";
  const pulse = 0.5 + 0.5 * Math.sin(time * 0.004 + lastIdx * 0.12);
  const radius = (perfMode ? 2.5 : 3.5) + pulse * (perfMode ? 2.5 : 4);
  const glow = perfMode ? 6 + pulse * 6 : 8 + pulse * 12;
  const pulseAlpha = isLight ? 0.5 + pulse * 0.3 : 0.35 + pulse * 0.35;
  const coreAlpha = isLight ? 0.85 : 0.9;

  ctx.save();
  ctx.globalCompositeOperation = blend;
  ctx.shadowBlur = isLight ? glow * 0.6 : glow;
  ctx.shadowColor = `rgba(${color},${isLight ? 0.6 : 0.9})`;
  ctx.fillStyle = `rgba(${color},${pulseAlpha})`;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = `rgba(${color},${coreAlpha})`;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(1.4, radius * 0.35), 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const trailIntensity = Math.min(1, volatility * 12);
  if (!perfMode && trailIntensity > 0.15) {
    const count = Math.min(14, candles.length);
    const start = candles.length - count;
    const startX = padding + start * candleGap;
    const trailBase = isLight ? 0.35 : 0.25;
    const trailBoost = isLight ? 0.35 : 0.45;
    const grad = ctx.createLinearGradient(startX, 0, x, 0);
    grad.addColorStop(0, `rgba(${color},0)`);
    grad.addColorStop(1, `rgba(${color},${trailBase + trailIntensity * trailBoost})`);
    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2 + trailIntensity * 1.6;
    ctx.shadowBlur = (isLight ? 4 : 6) + trailIntensity * (isLight ? 6 : 10);
    ctx.shadowColor = `rgba(${color},${isLight ? 0.4 : 0.6})`;
    ctx.beginPath();
    for (let i = start; i < candles.length; i += 1) {
      const c = candles[i];
      const px = padding + i * candleGap;
      const py = priceToY(c.close);
      if (i === start) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  const burstList = fxBursts[slotIndex] || [];
  if (!perfMode && burstList && burstList.length) {
    const lastTime = fxBurstTimes[slotIndex] || time;
    const dt = Math.min(48, time - lastTime);
    fxBurstTimes[slotIndex] = time;
    const dtScale = dt / 16.6;
    ctx.save();
    ctx.globalCompositeOperation = blend;
    const nextBursts = [];
    burstList.forEach((p) => {
      p.vx *= 0.98;
      p.vy = p.vy * 0.98 + p.gravity * dtScale;
      p.x += p.vx * dtScale;
      p.y += p.vy * dtScale;
      p.life -= 0.035 * dtScale;
      if (p.life <= 0) return;
      const alpha = Math.max(0, p.life);
      ctx.fillStyle = `rgba(${p.color},${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      if (p.streak) {
        ctx.strokeStyle = `rgba(${p.color},${alpha * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 2, p.y - p.vy * 2);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      nextBursts.push(p);
    });
    fxBursts[slotIndex] = nextBursts;
    ctx.restore();
  }

  if (perfMode && burstList && burstList.length) {
    fxBursts[slotIndex] = [];
  }

  if (state.crosshair.active && state.crosshair.slot === slotIndex) {
    const crossX = state.crosshair.x;
    const crossY = state.crosshair.y;
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = isLight ? "rgba(51,93,255,0.45)" : "rgba(95,193,255,0.45)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(crossX, padding);
    ctx.lineTo(crossX, padding + frame.priceHeight);
    ctx.moveTo(padding, crossY);
    ctx.lineTo(padding + frame.w, crossY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = isLight ? "rgba(51,93,255,0.9)" : "rgba(95,193,255,0.9)";
    ctx.beginPath();
    ctx.arc(crossX, crossY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawFx(time) {
  const layout = state.chartLayout;
  const lowerEnabled = state.indicators.rsi || state.indicators.macd;
  for (let i = 0; i < layout; i += 1) {
    const fxCanvas = els.chartFxCanvases[i];
    const symbol = state.chartSlots[i];
    if (!fxCanvas || !symbol) continue;
    let frame = chartFrames[i];
    if (!frame || frame.symbol !== symbol || frame.lowerEnabled !== lowerEnabled) {
      const canvas = els.chartCanvases[i] || fxCanvas;
      frame = buildChartFrame(canvas, symbol, lowerEnabled, i);
      chartFrames[i] = frame;
    }
    if (!frame) continue;
    drawFxFor(fxCanvas, frame, time, i);
  }
}

function startFxLoop() {
  if (fxRAF) return;
  const step = (time) => {
    fxRAF = requestAnimationFrame(step);
    if (document.hidden) return;
    if (time - fxLast < FX_FRAME_MS) return;
    fxLast = time;
    drawFx(time);
  };
  fxRAF = requestAnimationFrame(step);
}

function tick() {
  refreshRiskState();
  updateMarketRegime();
  const activeSymbols = new Set(
    state.chartSlots.slice(0, state.chartLayout).concat(state.selected)
  );
  if (tvEnabled && (!socket || !socket.connected)) {
    updateOfflineCandles(activeSymbols);
  }
  coins.forEach((coin) => {
    if (activeSymbols.has(coin.symbol)) updateDepthBook(coin.symbol);
  });

  updateRows();
  updatePairHeader();
  updateTicker();
  simulateTrades();
  buildOrderBook();
  if (!socket) {
    checkLimitOrders();
    checkProtections();
    applyFunding();
    checkLiquidations();
  }
  updateBalances();
  updatePortfolio();
  renderPositions();
  trackEquity();
  checkHoldingAchievements();
  updateSentiment();
  runCopyBot();
  drawChart();
  drawEquity();
}

function showToast(message) {
  if (isToastMuted()) return;
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(els.toast._timer);
  els.toast._timer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}

const adminDragState = { active: false, offsetX: 0, offsetY: 0 };

function setAdminFullscreen(force) {
  if (!els.adminPanel) return;
  const isFull = els.adminPanel.classList.contains("fullscreen");
  const next = typeof force === "boolean" ? force : !isFull;
  if (next) {
    els.adminPanel.dataset.prevLeft = els.adminPanel.style.left || "";
    els.adminPanel.dataset.prevTop = els.adminPanel.style.top || "";
    els.adminPanel.dataset.prevRight = els.adminPanel.style.right || "";
    els.adminPanel.dataset.prevBottom = els.adminPanel.style.bottom || "";
    els.adminPanel.classList.add("fullscreen");
    els.adminPanel.style.left = "";
    els.adminPanel.style.top = "";
    els.adminPanel.style.right = "";
    els.adminPanel.style.bottom = "";
    if (els.adminFullBtn) els.adminFullBtn.textContent = "Thu nhỏ";
  } else {
    els.adminPanel.classList.remove("fullscreen");
    if (els.adminPanel.dataset.prevLeft !== undefined) {
      els.adminPanel.style.left = els.adminPanel.dataset.prevLeft;
    }
    if (els.adminPanel.dataset.prevTop !== undefined) {
      els.adminPanel.style.top = els.adminPanel.dataset.prevTop;
    }
    if (els.adminPanel.dataset.prevRight !== undefined) {
      els.adminPanel.style.right = els.adminPanel.dataset.prevRight;
    }
    if (els.adminPanel.dataset.prevBottom !== undefined) {
      els.adminPanel.style.bottom = els.adminPanel.dataset.prevBottom;
    }
    if (els.adminFullBtn) els.adminFullBtn.textContent = "Toàn màn hình";
  }
}

function resetAdminPosition() {
  if (!els.adminPanel) return;
  els.adminPanel.classList.remove("fullscreen");
  els.adminPanel.style.left = "";
  els.adminPanel.style.top = "";
  els.adminPanel.style.right = "";
  els.adminPanel.style.bottom = "";
  if (els.adminFullBtn) els.adminFullBtn.textContent = "Toàn màn hình";
}

function onAdminDragMove(ev) {
  if (!adminDragState.active || !els.adminPanel) return;
  const panel = els.adminPanel;
  const maxX = Math.max(0, window.innerWidth - panel.offsetWidth);
  const maxY = Math.max(0, window.innerHeight - panel.offsetHeight);
  const nextX = Math.min(Math.max(0, ev.clientX - adminDragState.offsetX), maxX);
  const nextY = Math.min(Math.max(0, ev.clientY - adminDragState.offsetY), maxY);
  panel.style.left = `${nextX}px`;
  panel.style.top = `${nextY}px`;
}

function endAdminDrag() {
  if (!adminDragState.active) return;
  adminDragState.active = false;
  document.removeEventListener("pointermove", onAdminDragMove);
  document.removeEventListener("pointerup", endAdminDrag);
}

function startAdminDrag(ev) {
  if (!els.adminPanel || !els.adminHeader) return;
  if (els.adminPanel.classList.contains("fullscreen")) return;
  if (ev.button !== undefined && ev.button !== 0) return;
  if (ev.target && ev.target.closest("button")) return;
  const rect = els.adminPanel.getBoundingClientRect();
  adminDragState.active = true;
  adminDragState.offsetX = ev.clientX - rect.left;
  adminDragState.offsetY = ev.clientY - rect.top;
  els.adminPanel.style.left = `${rect.left}px`;
  els.adminPanel.style.top = `${rect.top}px`;
  els.adminPanel.style.right = "auto";
  els.adminPanel.style.bottom = "auto";
  document.addEventListener("pointermove", onAdminDragMove);
  document.addEventListener("pointerup", endAdminDrag);
}

function showUndoToast(message) {
  if (!els.undoToast) return;
  if (els.undoText) els.undoText.textContent = message || "Đã hủy lệnh.";
  els.undoToast.classList.add("show");
  clearTimeout(els.undoToast._timer);
  els.undoToast._timer = setTimeout(() => {
    els.undoToast.classList.remove("show");
    undoState = null;
  }, UNDO_WINDOW_MS);
}

function hideUndoToast() {
  if (!els.undoToast) return;
  els.undoToast.classList.remove("show");
  clearTimeout(els.undoToast._timer);
}

function queueUndo(order) {
  if (!order) return;
  undoState = { order: { ...order } };
  showUndoToast("Đã hủy lệnh. Hoàn tác?");
}

function restoreCancelledOrder(order) {
  if (!order) return;
  if (socket && socket.connected) {
    const clientId = Date.now() + Math.random();
    const seq = bumpOrderSeq(currentUser);
    const payload = {
      clientId,
      seq,
      symbol: order.symbol,
      side: order.side,
      type: order.type || "limit",
      qty: order.qty,
      leverage: order.leverage || 1,
      quote: order.quote || state.quote,
      priceUsd: order.priceUsd,
      stopInput: order.stopInput || 0,
      takeInput: order.takeInput || 0,
      trailPct: order.trailPct || 0
    };
    pendingOrders.set(clientId, payload);
    updatePendingBadge();
    socket.emit("place_order", payload);
    showToast("Đã gửi lệnh khôi phục.");
    return;
  }

  const leverage = order.leverage || 1;
  const priceUsd = order.priceUsd;
  if (!Number.isFinite(priceUsd) || priceUsd <= 0) {
    showToast("Không thể hoàn tác lệnh.");
    return;
  }
  const priceQuote = toQuote(priceUsd);
  const totalQuote = leverage === 1 ? priceQuote * order.qty : (priceQuote * order.qty) / leverage;
  const feeQuote = totalQuote * getFeeRate();

  if (order.side === "buy") {
    const need = totalQuote + feeQuote;
    const balance = order.quote === "USD" ? state.usd : state.vnd;
    if (balance < need) {
      showToast("Không đủ số dư để hoàn tác.");
      return;
    }
    if (order.quote === "USD") state.usd -= need;
    else state.vnd -= need;
    state.openOrders.push({
      ...order,
      id: Date.now() + Math.random(),
      locked: need,
      ts: new Date()
    });
  } else {
    if (leverage === 1) {
      const holding = state.holdings[order.symbol] || 0;
      if (holding < order.qty) {
        showToast("Không đủ coin để hoàn tác.");
        return;
      }
      state.holdings[order.symbol] -= order.qty;
      if (state.holdings[order.symbol] <= 0) {
        state.costBasis[order.symbol] = 0;
        state.holdingStart[order.symbol] = null;
      }
      state.openOrders.push({
        ...order,
        id: Date.now() + Math.random(),
        locked: order.qty,
        ts: new Date()
      });
    } else {
      const need = totalQuote + feeQuote;
      const balance = order.quote === "USD" ? state.usd : state.vnd;
      if (balance < need) {
        showToast("Không đủ số dư để hoàn tác.");
        return;
      }
      if (order.quote === "USD") state.usd -= need;
      else state.vnd -= need;
      state.openOrders.push({
        ...order,
        id: Date.now() + Math.random(),
        locked: need,
        ts: new Date()
      });
    }
  }

  renderOpenOrders();
  updateBalances();
  updatePortfolio();
  showToast("Đã hoàn tác lệnh.");
}

function applyUndo() {
  if (!undoState?.order) return;
  const snapshot = undoState.order;
  undoState = null;
  hideUndoToast();
  restoreCancelledOrder(snapshot);
}

function closePosition(id) {
  if (socket && socket.connected) {
    const idx = state.positions.findIndex((pos) => pos.id === id);
    if (idx === -1) return;
    const pos = state.positions[idx];
    socket.emit("close_position", {
      id: pos.id,
      symbol: pos.symbol,
      side: pos.side,
      leverage: pos.leverage,
      qty: pos.qty
    });
    return;
  }
  const idx = state.positions.findIndex((pos) => pos.id === id);
  if (idx === -1) return;
  const pos = state.positions[idx];
  const price = state.market[pos.symbol].price;
  const pnl = calcPositionPnl(pos, price);
  const feeUsd = Math.abs(price * pos.qty * getFeeRate());

  if (pos.quote === "USD") state.usd += pos.margin + pnl - feeUsd;
  else state.vnd += pos.margin + pnl * FX_RATE - feeUsd * FX_RATE;
  recordPnl(pnl);

  state.positions.splice(idx, 1);
  removeProtectionsFor(pos.symbol, pos.side, pos.leverage);
  renderPositions();
  updateBalances();
  updatePortfolio();
  showToast("Đã đóng vị thế.");
}

function removeProtectionsFor(symbol, side, leverage) {
  state.protections = state.protections.filter(
    (p) => !(p.symbol === symbol && p.side === side && p.leverage === leverage)
  );
}

let audioCtx = null;
function getAudioCtx() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  audioCtx = audioCtx || new AudioCtx();
  return audioCtx;
}

function playTone({ type = "sine", freq = 600, duration = 0.1, volume = 0.12 }) {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.05);
  } catch {
    // ignore
  }
}

function playTradeSound() {
  playTone({ type: "sine", freq: 880, duration: 0.08, volume: 0.08 });
}

function playStopAlert() {
  [0, 180, 360].forEach((delay) => {
    setTimeout(() => {
      playTone({ type: "square", freq: 240, duration: 0.1, volume: 0.18 });
    }, delay);
  });
}

function playLiquidationSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.45, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.65);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.7);
  } catch {
    // ignore
  }
}

function showLiquidation() {
  if (!els.liquidationOverlay) return;
  els.liquidationOverlay.classList.remove("show");
  void els.liquidationOverlay.offsetWidth;
  els.liquidationOverlay.classList.add("show");
  playLiquidationSound();
  playGlassBreak();
  setTimeout(() => els.liquidationOverlay.classList.remove("show"), 1600);
}

function liquidatePosition(pos, reason) {
  const marginUsd = pos.quote === "USD" ? pos.margin : pos.margin / FX_RATE;
  let lossFactor = 1;
  if (state.boosters.insurance > 0) {
    state.boosters.insurance -= 1;
    lossFactor = 0.5;
    const refund = pos.margin * 0.5;
    if (pos.quote === "USD") state.usd += refund;
    else state.vnd += refund;
    showToast("Thẻ bảo hiểm kích hoạt, giảm thiệt hại 50%.");
    renderBoosters();
  }
  recordPnl(-Math.abs(marginUsd * lossFactor));
  removeProtectionsFor(pos.symbol, pos.side, pos.leverage);
  state.positions = state.positions.filter((p) => p.id !== pos.id);
  renderPositions();
  updateBalances();
  updatePortfolio();
  showLiquidation();
  showToast(reason || "Vị thế bị thanh lý.");
}

function checkLiquidations() {
  if (state.positions.length === 0) return;
  state.positions.slice().forEach((pos) => {
    const price = state.market[pos.symbol].price;
    const pnl = calcPositionPnl(pos, price);
    const marginUsd = pos.quote === "USD" ? pos.margin : pos.margin / FX_RATE;
    const equityUsd = marginUsd + pnl;
    const maintenance = marginUsd * MAINTENANCE_RATE;
    if (equityUsd <= maintenance) {
      liquidatePosition(pos, "Margin Call! Vị thế bị thanh lý.");
    }
  });
}

function checkProtections() {
  if (state.protections.length === 0) return;
  const remaining = [];

  state.protections.forEach((prot) => {
    const price = state.market[prot.symbol].price;
    let trailStop = null;
    if (prot.trailPct && prot.trailPct > 0) {
      if (prot.side === "buy") {
        prot.trailHigh = Math.max(prot.trailHigh || price, price);
        trailStop = prot.trailHigh * (1 - prot.trailPct / 100);
      } else {
        prot.trailLow = Math.min(prot.trailLow || price, price);
        trailStop = prot.trailLow * (1 + prot.trailPct / 100);
      }
      prot.trailStop = trailStop;
    }

    const hitStop = prot.stop && (prot.side === "buy" ? price <= prot.stop : price >= prot.stop);
    const hitTake = prot.take && (prot.side === "buy" ? price >= prot.take : price <= prot.take);
    const hitTrail = trailStop && (prot.side === "buy" ? price <= trailStop : price >= trailStop);
    if (!hitStop && !hitTake && !hitTrail) {
      remaining.push(prot);
      return;
    }

    if (prot.leverage === 1) {
      const qty = Math.min(state.holdings[prot.symbol], prot.qty);
      if (qty > 0) {
        state.holdings[prot.symbol] -= qty;
        const avg = state.costBasis[prot.symbol] || 0;
        const pnl = (price - avg) * qty;
        recordPnl(pnl);
        if (state.holdings[prot.symbol] <= 0) {
          state.costBasis[prot.symbol] = 0;
          state.holdingStart[prot.symbol] = null;
        }
        const totalQuote = toQuote(price) * qty;
        const feeQuote = totalQuote * getFeeRate();
        if (state.quote === "USD") state.usd += totalQuote - feeQuote;
        else state.vnd += totalQuote - feeQuote;
        addTrade({ symbol: prot.symbol, price, qty, side: "sell" });
        if (hitStop || hitTrail) playStopAlert();
        const msg = hitTake ? "Take-Profit khớp lệnh."
          : hitTrail ? "Trailing Stop khớp lệnh."
          : "Stop-Loss khớp lệnh.";
        showToast(msg);
      }
    } else {
      const posIdx = state.positions.findIndex((p) => p.symbol === prot.symbol && p.side === prot.side);
      if (posIdx !== -1) {
        closePosition(state.positions[posIdx].id);
        if (hitStop || hitTrail) playStopAlert();
        const msg = hitTake ? "Take-Profit đóng vị thế."
          : hitTrail ? "Trailing Stop đóng vị thế."
          : "Stop-Loss đóng vị thế.";
        showToast(msg);
      }
    }
  });

  state.protections = remaining;
}

function trackEquity() {
  const equity = totalEquityUSD();
  state.equityHistory.push(equity);
  if (state.equityHistory.length > 80) state.equityHistory.shift();
  if (equity >= 1000000000 / FX_RATE) unlockAchievement("whale");
  maybeUpdateLeaderboard(equity);
}

function updateSentiment() {
  const now = Date.now();
  const symbol = state.market.BTC ? "BTC" : state.selected;
  const price = state.market[symbol]?.price;
  if (!price) return;
  state.sentimentHistory.push({ ts: now, price });
  const cutoff = now - 10 * 60 * 1000;
  state.sentimentHistory = state.sentimentHistory.filter((p) => p.ts >= cutoff);
  const prices = state.sentimentHistory.map((p) => p.price);
  if (prices.length < 5) return;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = (min + max) / 2 || 1;
  const rangePct = (max - min) / avg;
  const trendPct = (prices[prices.length - 1] - prices[0]) / prices[0];
  let index = 100 - rangePct * 120;
  index += trendPct * 80;
  index = Math.max(0, Math.min(100, Math.round(index)));

  let label = "Neutral";
  if (index < 20) label = "Extreme Fear";
  else if (index < 40) label = "Fear";
  else if (index < 60) label = "Neutral";
  else if (index < 80) label = "Greed";
  else label = "Extreme Greed";

  if (els.sentimentValue) els.sentimentValue.textContent = `${index} ${label}`;
  if (els.sentimentFill) els.sentimentFill.style.width = `${100 - index}%`;
}

function checkHoldingAchievements() {
  const now = Date.now();
  Object.entries(state.holdings).forEach(([symbol, qty]) => {
    if (qty <= 0) return;
    const started = state.holdingStart[symbol];
    if (started && now - started >= 10 * 60 * 1000) {
      unlockAchievement("patient_trader");
    }
  });
}

function resetAdminCombo() {
  adminState.comboStart = 0;
  adminState.gCount = 0;
}

function triggerAdminReveal() {
  if (adminState.revealed) return;
  adminState.revealed = true;
  setAdminUI();
  showToast("Đã mở bảng quản trị. Nhập mật khẩu admin để thao tác.");
  if (!adminState.authed) {
    sendAdminAction("CHECK_USERS", {});
  }
}

function updatePerfMode() {
  const reduceMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
  const mobile = window.innerWidth <= MOBILE_BREAKPOINT;
  state.perfMode = reduceMotion || mobile;
  document.body.classList.toggle("perf-mode", state.perfMode);
  document.body.classList.toggle("mobile-lite", mobile);
}

function setupCollapsiblePanels() {
  const panels = Array.from(document.querySelectorAll(".panel"));
  panels.forEach((panel) => {
    const head = panel.querySelector(".panel-head");
    if (!head) return;
    let toggle = head.querySelector(".panel-toggle");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "panel-toggle";
      toggle.setAttribute("aria-label", "Thu gon panel");
      toggle.textContent = "−";
      head.appendChild(toggle);
      toggle.addEventListener("click", () => {
        panel.classList.toggle("collapsed");
        toggle.textContent = panel.classList.contains("collapsed") ? "+" : "−";
      });
    }
  });
}

function handleAdminComboKeyDown(event) {
  const key = String(event.key || "").toLowerCase();
  if (key !== ADMIN_SPAM_KEY) return;
  const now = Date.now();
  if (!adminState.comboStart || now - adminState.comboStart > ADMIN_WINDOW_MS) {
    adminState.comboStart = now;
    adminState.gCount = 0;
  }
  adminState.gCount += 1;
  if (adminState.gCount >= ADMIN_SPAM_COUNT) {
    triggerAdminReveal();
    resetAdminCombo();
  }
}

function bindEvents() {
  if (els.authLoginBtn) {
    els.authLoginBtn.addEventListener("click", () => sendAuth("login"));
  }
  if (els.authRegisterBtn) {
    els.authRegisterBtn.addEventListener("click", () => sendAuth("register"));
  }
  [els.authUsername, els.authPassword, els.authInviteCode, els.authAdminCode].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", clearAuthInputError);
  });
  if (els.authPassword) {
    els.authPassword.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendAuth("login");
    });
  }
  if (els.authUsername) {
    els.authUsername.addEventListener("input", () => {
      const name = (els.authUsername.value || "").trim().toLowerCase();
      if (name !== ADMIN_OWNER_USER) {
        setAdminCodeVisible(false);
      }
    });
  }
  if (els.quickToggle) {
    els.quickToggle.addEventListener("click", () => {
      if (!els.quickLetters) return;
      els.quickLetters.classList.toggle("hidden");
    });
  }
  if (els.practiceBtn) {
    els.practiceBtn.addEventListener("click", openPractice);
  }
  if (els.practiceClose) {
    els.practiceClose.addEventListener("click", closePractice);
  }
  if (els.practiceOverlay) {
    els.practiceOverlay.addEventListener("click", (e) => {
      if (e.target === els.practiceOverlay) closePractice();
    });
  }
  if (els.focusToggle) {
    els.focusToggle.addEventListener("click", () => setFocusMode(!state.focusMode));
  }
  if (els.orderTemplates) {
    els.orderTemplates.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-template]");
      if (!btn) return;
      applyOrderTemplate(btn.dataset.template || "");
    });
  }
  if (els.mailBtn) {
    els.mailBtn.addEventListener("click", () => toggleMailOverlay(true));
  }
  if (els.mailCloseBtn) {
    els.mailCloseBtn.addEventListener("click", () => toggleMailOverlay(false));
  }
  if (els.mailFilter) {
    els.mailFilter.addEventListener("change", () => {
      state.mailFilter = els.mailFilter.value || "all";
      renderMailInbox();
    });
  }
  if (els.mailMarkAll) {
    els.mailMarkAll.addEventListener("click", () => {
      const inbox = Array.isArray(state.inbox) ? state.inbox : [];
      inbox.forEach((m) => markMailRead(m));
      renderMailInbox();
      updateMailBadge();
      showToast("Da danh dau da doc.");
    });
  }
  if (els.mailMute) {
    els.mailMute.addEventListener("click", () => {
      if (isToastMuted()) {
        state.muteUntil = 0;
        try {
          localStorage.removeItem(TOAST_MUTE_KEY);
        } catch {
          // ignore
        }
        updateMuteButton();
        showToast("Da tat mute.");
        return;
      }
      setToastMute(60);
      showToast("Da mute thong bao 1h.");
    });
  }
  if (els.mailOverlay) {
    els.mailOverlay.addEventListener("click", (e) => {
      if (e.target === els.mailOverlay) toggleMailOverlay(false);
    });
  }
  if (els.tipChips && els.tipChips.length) {
    els.tipChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        els.tipChips.forEach((btn) => btn.classList.remove("active"));
        chip.classList.add("active");
        openTipOverlay(chip.dataset.tip);
      });
    });
  }
  if (els.tipClose) {
    els.tipClose.addEventListener("click", closeTipOverlay);
  }
  if (els.tipOverlay) {
    els.tipOverlay.addEventListener("click", (e) => {
      if (e.target === els.tipOverlay) closeTipOverlay();
    });
  }
  if (els.tipAudioBtn) {
    els.tipAudioBtn.addEventListener("click", () => {
      setTipAudioEnabled(!state.tipAudioEnabled);
    });
  }
  if (els.quizOptions) {
    els.quizOptions.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-idx]");
      if (!btn) return;
      handleQuizAnswer(parseInt(btn.dataset.idx, 10));
    });
  }
  if (els.quizNext) {
    els.quizNext.addEventListener("click", nextQuizStep);
  }
  if (els.quizSkip) {
    els.quizSkip.addEventListener("click", closeQuizOverlay);
  }
  if (els.quizOverlay) {
    els.quizOverlay.addEventListener("click", (e) => {
      if (e.target === els.quizOverlay) closeQuizOverlay();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && tipOpen) closeTipOverlay();
    if (e.key === "Escape" && quizState.active) closeQuizOverlay();
  });
  if (els.adminModalOk) {
    els.adminModalOk.addEventListener("click", () => resolveAdminModal(true));
  }
  if (els.adminModalCancel) {
    els.adminModalCancel.addEventListener("click", () => resolveAdminModal(false));
  }
  if (els.adminModal) {
    els.adminModal.addEventListener("click", (e) => {
      if (e.target === els.adminModal) resolveAdminModal(false);
    });
  }
  if (els.adminModalInput) {
    els.adminModalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") resolveAdminModal(true);
      if (e.key === "Escape") resolveAdminModal(false);
    });
  }
  if (els.orderWarnPrimary) {
    els.orderWarnPrimary.addEventListener("click", () => resolveOrderWarn(true));
  }
  if (els.orderWarnSecondary) {
    els.orderWarnSecondary.addEventListener("click", () => resolveOrderWarn(false));
  }
  if (els.orderWarnOverlay) {
    els.orderWarnOverlay.addEventListener("click", (e) => {
      if (e.target === els.orderWarnOverlay) resolveOrderWarn(false);
    });
  }
  if (els.restClose) {
    els.restClose.addEventListener("click", closeRestOverlay);
  }
  if (els.restOverlay) {
    els.restOverlay.addEventListener("click", (e) => {
      if (e.target === els.restOverlay) closeRestOverlay();
    });
  }
  if (els.mobileBar) {
    els.mobileBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-target]");
      if (!btn) return;
      const target = document.querySelector(btn.dataset.target);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  if (els.chartArea) {
    els.chartArea.addEventListener("pointerdown", (e) => {
      const started = startChartPan(e);
      if (
        started
        && Number.isFinite(e.pointerId)
        && typeof els.chartArea.setPointerCapture === "function"
      ) {
        try {
          els.chartArea.setPointerCapture(e.pointerId);
        } catch {
          // ignore pointer capture errors
        }
      }
      updateChartCrosshair(e);
    });
    els.chartArea.addEventListener("pointermove", (e) => {
      if (moveChartPan(e)) return;
      updateChartCrosshair(e);
    });
    els.chartArea.addEventListener("pointerup", (e) => {
      endChartPan(e);
    });
    els.chartArea.addEventListener("pointercancel", (e) => {
      endChartPan(e);
    });
    els.chartArea.addEventListener("wheel", (e) => {
      const slot = getChartSlotFromEvent(e);
      let deltaY = e.deltaY;
      if (e.deltaMode === 1) deltaY *= 16;
      else if (e.deltaMode === 2) deltaY *= window.innerHeight;
      if (tvEnabled) {
        zoomTvAt(slot, e.clientX, deltaY);
      } else {
        updateChartCrosshair(e);
        queueChartZoom(slot, e.clientX, deltaY);
      }
      if (e.cancelable) e.preventDefault();
    }, { passive: false });
    els.chartArea.addEventListener("dblclick", (e) => {
      if (tvEnabled) return;
      const slot = getChartSlotFromEvent(e);
      markChartInteraction(220);
      resetChartViewport(slot, false);
      scheduleChartDraw();
    });
    els.chartArea.addEventListener("pointerleave", () => {
      if (chartPanState.active || chartPanState.pending) return;
      hideChartCrosshair();
    });
  }
  window.addEventListener("pointerup", (e) => {
    endChartPan(e);
  });
  window.addEventListener("pointercancel", (e) => {
    endChartPan(e);
  });
  if (els.mailList) {
    els.mailList.addEventListener("click", (e) => {
      const mailEl = e.target.closest(".mail-item");
      if (mailEl && mailEl.dataset.mail) {
        const mail = Array.isArray(state.inbox)
          ? state.inbox.find((m) => m && m.id === mailEl.dataset.mail)
          : null;
        if (mail) {
          markMailRead(mail);
          updateMailBadge();
        }
      }
      const btn = e.target.closest("[data-claim]");
      if (!btn) return;
      const id = btn.dataset.claim;
      if (!id) return;
      if (socket && socket.connected) {
        socket.emit("claim_mail", { id });
      } else {
        showToast("Máy chủ chưa sẵn sàng.");
      }
    });
  }
  if (els.inventoryList) {
    els.inventoryList.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-use]");
      if (!btn) return;
      const id = btn.dataset.use;
      if (!id) return;
      if (socket && socket.connected) {
        socket.emit("use_item", { id });
      } else {
        showToast("Máy chủ chưa sẵn sàng.");
      }
    });
  }
  if (els.broadcastOverlay) {
    els.broadcastOverlay.addEventListener("click", (e) => {
      if (e.target !== els.broadcastOverlay) return;
      els.broadcastOverlay.classList.remove("show");
      setTimeout(() => els.broadcastOverlay.classList.add("hidden"), 200);
    });
  }
  if (els.onboardingNext) {
    els.onboardingNext.addEventListener("click", () => {
      onboardingIndex += 1;
      if (onboardingIndex >= onboardingSteps.length) {
        endOnboarding();
        return;
      }
      renderOnboardingStep();
    });
  }
  if (els.onboardingSkip) {
    els.onboardingSkip.addEventListener("click", () => {
      endOnboarding();
    });
  }
  if (els.onboardingSkipForever) {
    els.onboardingSkipForever.addEventListener("click", () => {
      setOnboardingSeen();
      endOnboarding();
    });
  }
    window.addEventListener("resize", () => {
      if (els.onboardingOverlay && !els.onboardingOverlay.classList.contains("hidden")) {
        renderOnboardingStep();
      }
      if (academyState.active) {
        renderAcademyStep();
      }
    });
    window.addEventListener("scroll", () => {
      if (els.onboardingOverlay && !els.onboardingOverlay.classList.contains("hidden")) {
        renderOnboardingStep();
      }
      if (academyState.active) {
        renderAcademyStep();
      }
    }, true);
    if (els.academyBtn) {
      els.academyBtn.addEventListener("click", () => {
        openAcademy(0);
      });
    }
    if (els.academyPrev) {
      els.academyPrev.addEventListener("click", () => {
        prevAcademyStep();
      });
    }
    if (els.academyNext) {
      els.academyNext.addEventListener("click", () => {
        nextAcademyStep();
      });
    }
    if (els.academyClose) {
      els.academyClose.addEventListener("click", () => {
        closeAcademy();
      });
    }
    if (els.academyRestart) {
      els.academyRestart.addEventListener("click", () => {
        academyState.index = 0;
        if (!academyState.active) {
          openAcademy(0);
          return;
        }
        renderAcademyStep();
      });
    }
    if (els.academyLangToggle) {
      els.academyLangToggle.addEventListener("click", () => {
        academyState.lang = academyState.lang === "vi" ? "en" : "vi";
        renderAcademyStep();
      });
    }
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && academyState.active) {
        closeAcademy();
      }
    });
  if (els.logoutBtn) {
    els.logoutBtn.addEventListener("click", () => {
      if (els.logoutOverlay) {
        els.logoutOverlay.classList.remove("hidden");
      }
    });
  }
  if (els.logoutConfirmBtn) {
    els.logoutConfirmBtn.addEventListener("click", () => {
      if (els.logoutOverlay) els.logoutOverlay.classList.add("hidden");
      clearAuth();
      currentUser = null;
      adminState.authed = false;
      adminState.role = "";
      setAuthState(null);
      setAdminUI();
      if (socket && socket.connected) {
        socket.emit("logout");
      }
    });
  }
  if (els.logoutCancelBtn) {
    els.logoutCancelBtn.addEventListener("click", () => {
      if (els.logoutOverlay) els.logoutOverlay.classList.add("hidden");
    });
  }
  if (els.adminSetBtn) {
    els.adminSetBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const username = (els.adminTarget?.value || "").trim();
      const amount = parseFloat(els.adminAmount?.value || "0");
      const currency = els.adminCurrency?.value || "USD";
      if (!username || !Number.isFinite(amount)) {
        showToast("Nhập tài khoản và số tiền.");
        return;
      }
      sendAdminAction("SET_BALANCE", { target: username, amount, currency });
    });
  }
  if (els.adminRefreshBtn) {
    els.adminRefreshBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("CHECK_USERS", {});
    });
  }
  if (els.adminBroadcastBtn) {
    els.adminBroadcastBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const message = String(els.adminBroadcastMsg?.value || "").trim();
      if (!message) {
        showToast("Nhập nội dung thông báo.");
        return;
      }
      const seconds = Number(els.adminBroadcastDuration?.value || 30);
      const durationMs = Math.max(5, Number.isFinite(seconds) ? seconds : 30) * 1000;
      sendAdminAction("BROADCAST_NOTICE", { message, durationMs });
      if (els.adminBroadcastMsg) els.adminBroadcastMsg.value = "";
    });
  }
  if (els.adminMailSendBtn) {
    els.adminMailSendBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const payload = {
        target: String(els.adminMailTarget?.value || "").trim(),
        title: String(els.adminMailTitle?.value || "").trim(),
        message: String(els.adminMailMessage?.value || "").trim()
      };
      const usd = Number(els.adminMailUsd?.value || 0);
      const vnd = Number(els.adminMailVnd?.value || 0);
      const coin = String(els.adminMailCoin?.value || "").trim();
      const coinQty = Number(els.adminMailCoinQty?.value || 0);
      const boostInsurance = Number(els.adminMailBoostInsurance?.value || 0);
      const boostAnonymity = Number(els.adminMailBoostAnonymity?.value || 0);
      const itemName = String(els.adminMailItemName?.value || "").trim();
      const itemDesc = String(els.adminMailItemDesc?.value || "").trim();
      const itemType = String(els.adminMailItemType?.value || "buff").trim();
      const itemDuration = Number(els.adminMailItemDuration?.value || 0);
      if (Number.isFinite(usd) && usd !== 0) payload.usd = usd;
      if (Number.isFinite(vnd) && vnd !== 0) payload.vnd = vnd;
      if (coin) payload.coin = coin;
      if (Number.isFinite(coinQty) && coinQty > 0) payload.coinQty = coinQty;
      if (Number.isFinite(boostInsurance) && boostInsurance > 0) payload.boostInsurance = boostInsurance;
      if (Number.isFinite(boostAnonymity) && boostAnonymity > 0) payload.boostAnonymity = boostAnonymity;
      if (itemName) {
        payload.itemName = itemName;
        if (itemDesc) payload.itemDesc = itemDesc;
        if (itemType) payload.itemType = itemType;
        if (Number.isFinite(itemDuration) && itemDuration >= 0) payload.itemDuration = itemDuration;
      }
      if (!payload.message && !payload.title && !payload.usd && !payload.vnd && !payload.coinQty && !payload.boostInsurance && !payload.boostAnonymity && !payload.itemName) {
        showToast("Nhập nội dung hoặc phần thưởng để gửi.");
        return;
      }
      sendAdminAction("SEND_MAIL", payload);
      [els.adminMailTitle, els.adminMailMessage, els.adminMailUsd, els.adminMailVnd, els.adminMailCoin, els.adminMailCoinQty, els.adminMailBoostInsurance, els.adminMailBoostAnonymity, els.adminMailItemName, els.adminMailItemDesc, els.adminMailItemDuration].forEach((el) => {
        if (el) el.value = "";
      });
    });
  }
  if (els.adminSearch) {
    els.adminSearch.addEventListener("input", () => {
      renderAdminUsers();
    });
  }
  if (els.adminLogSearch) {
    els.adminLogSearch.addEventListener("input", () => {
      renderAdminLogList(adminLogRaw);
    });
  }
  if (els.adminLogRole) {
    els.adminLogRole.addEventListener("change", () => {
      renderAdminLogList(adminLogRaw);
    });
  }
  if (els.adminLogAction) {
    els.adminLogAction.addEventListener("input", () => {
      renderAdminLogList(adminLogRaw);
    });
    els.adminLogAction.addEventListener("change", () => {
      renderAdminLogList(adminLogRaw);
    });
  }
  [els.adminMinBalance, els.adminNewDays].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => renderAdminUsers());
  });
  [els.adminFilterLocked, els.adminFilterDeleted, els.adminFilterNew, els.adminFilterAdmin].forEach((el) => {
    if (!el) return;
    el.addEventListener("change", () => renderAdminUsers());
  });
  if (els.adminRegOpen) {
    els.adminRegOpen.addEventListener("change", () => {
      if (!adminState.authed) return;
      sendAdminAction("SET_REGISTRATION", { enabled: els.adminRegOpen.checked });
    });
  }
  if (els.adminInviteOnly) {
    els.adminInviteOnly.addEventListener("change", () => {
      if (!adminState.authed) return;
      sendAdminAction("SET_INVITE_ONLY", { enabled: els.adminInviteOnly.checked });
    });
  }
  if (els.adminInviteAdd) {
    els.adminInviteAdd.addEventListener("click", () => {
      if (!adminState.authed) return;
      const code = String(els.adminInviteCode?.value || "").trim();
      if (!code) {
        showToast("Nhập mã mời.");
        return;
      }
      sendAdminAction("ADD_INVITE", { code });
      if (els.adminInviteCode) els.adminInviteCode.value = "";
    });
  }
  if (els.adminInviteRemove) {
    els.adminInviteRemove.addEventListener("click", () => {
      if (!adminState.authed) return;
      const code = String(els.adminInviteCode?.value || "").trim();
      if (!code) {
        showToast("Nhập mã mời.");
        return;
      }
      sendAdminAction("REMOVE_INVITE", { code });
      if (els.adminInviteCode) els.adminInviteCode.value = "";
    });
  }
  if (els.adminBlockIpBtn) {
    els.adminBlockIpBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const ip = String(els.adminBlockIp?.value || "").trim();
      if (!ip) {
        showToast("Nhập IP.");
        return;
      }
      sendAdminAction("BLOCK_IP", { ip });
      if (els.adminBlockIp) els.adminBlockIp.value = "";
    });
  }
  if (els.adminUnblockIpBtn) {
    els.adminUnblockIpBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const ip = String(els.adminBlockIp?.value || "").trim();
      if (!ip) {
        showToast("Nhập IP.");
        return;
      }
      sendAdminAction("UNBLOCK_IP", { ip });
      if (els.adminBlockIp) els.adminBlockIp.value = "";
    });
  }
  if (els.adminWhitelistIpBtn) {
    els.adminWhitelistIpBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const ip = String(els.adminWhitelistIp?.value || "").trim();
      if (!ip) {
        showToast("Nhập IP.");
        return;
      }
      sendAdminAction("WHITELIST_ADMIN_IP", { ip });
      if (els.adminWhitelistIp) els.adminWhitelistIp.value = "";
    });
  }
  if (els.adminUnwhitelistIpBtn) {
    els.adminUnwhitelistIpBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const ip = String(els.adminWhitelistIp?.value || "").trim();
      if (!ip) {
        showToast("Nhập IP.");
        return;
      }
      sendAdminAction("UNWHITELIST_ADMIN_IP", { ip });
      if (els.adminWhitelistIp) els.adminWhitelistIp.value = "";
    });
  }
  if (els.adminUserList) {
    els.adminUserList.addEventListener("click", async (e) => {
      if (!adminState.authed) return;
      const resetBtn = e.target.closest(".admin-reset");
      if (resetBtn) {
        const username = resetBtn.dataset.user;
        if (!username) return;
        const confirmCode = await adminPrompt({
          title: "Ma xac nhan",
          text: "Nhap ma xac nhan (ma sep):",
          type: "password"
        });
        if (!confirmCode) return;
        sendAdminAction("RESET_PASSWORD", { target: username, confirmCode });
        return;
      }
      const setBtn = e.target.closest(".admin-setpass");
      if (setBtn) {
        const username = setBtn.dataset.user;
        if (!username) return;
        const row = setBtn.closest(".admin-row");
        const input = row ? row.querySelector(".admin-pass-input") : null;
        const newPass = String(input?.value || "").trim();
        if (!newPass) {
          showToast("Nhập mật khẩu mới.");
          return;
        }
        const confirmCode = await adminPrompt({
          title: "Ma xac nhan",
          text: "Nhap ma xac nhan (ma sep):",
          type: "password"
        });
        if (!confirmCode) return;
        sendAdminAction("RESET_PASSWORD", { target: username, password: newPass, confirmCode });
        if (input) input.value = "";
        return;
      }
      const lockBtn = e.target.closest(".admin-lock");
      if (lockBtn) {
        const username = lockBtn.dataset.user;
        if (!username) return;
        const locked = lockBtn.dataset.locked === "1";
        updateAdminUser(username, { locked: !locked });
        sendAdminAction(locked ? "UNLOCK_USER" : "LOCK_USER", { target: username });
        return;
      }
      const logoutBtn = e.target.closest(".admin-logout");
      if (logoutBtn) {
        const username = logoutBtn.dataset.user;
        if (!username) return;
        sendAdminAction("FORCE_LOGOUT", { target: username });
        return;
      }
      const restoreBtn = e.target.closest(".admin-restore");
      if (restoreBtn) {
        const username = restoreBtn.dataset.user;
        if (!username) return;
        sendAdminAction("RESTORE_USER", { target: username });
        return;
      }
      const delBtn = e.target.closest(".admin-delete");
      if (delBtn) {
        const username = delBtn.dataset.user;
        if (!username) return;
        const ok = await adminConfirm({
          title: "Xoa tai khoan",
          text: `Xoa tai khoan ${username}?`
        });
        if (!ok) return;
        sendAdminAction("DELETE_USER", { target: username });
        return;
      }
      const groupBtn = e.target.closest(".admin-group");
      if (groupBtn) {
        const username = groupBtn.dataset.user;
        if (!username) return;
        const group = await adminPrompt({
          title: "Nhom nguoi dung",
          text: "Nhap nhom (VIP/test/suspect...):",
          value: ""
        });
        if (group == null) return;
        sendAdminAction("SET_USER_GROUP", { target: username, group });
        return;
      }
      const tagsBtn = e.target.closest(".admin-tags");
      if (tagsBtn) {
        const username = tagsBtn.dataset.user;
        if (!username) return;
        const tags = await adminPrompt({
          title: "Tags rui ro",
          text: "Nhap tags (phan tach bang dau phay):",
          value: ""
        });
        if (tags == null) return;
        sendAdminAction("SET_USER_TAGS", { target: username, tags });
        return;
      }
      const noteBtn = e.target.closest(".admin-note");
      if (noteBtn) {
        const username = noteBtn.dataset.user;
        if (!username) return;
        const note = await adminPrompt({
          title: "Ghi chu",
          text: "Ghi chu noi bo:",
          value: ""
        });
        if (note == null) return;
        sendAdminAction("SET_USER_NOTE", { target: username, note });
        return;
      }
      const limitsBtn = e.target.closest(".admin-limits");
      if (limitsBtn) {
        const username = limitsBtn.dataset.user;
        if (!username) return;
        const maxOpenOrders = await promptNumber("Max open orders (bo trong neu khong doi):");
        const maxPositions = await promptNumber("Max positions (bo trong neu khong doi):");
        const maxNotionalUsd = await promptNumber("Max notional USD (bo trong neu khong doi):");
        const maxLeverage = await promptNumber("Max leverage (bo trong neu khong doi):");
        const feeRate = await promptNumber("Fee rate (bo trong neu khong doi):");
        const cancelPenaltyRate = await promptNumber("Cancel penalty rate (bo trong neu khong doi):");
        const cancelSpamThreshold = await promptNumber("Cancel spam threshold (bo trong neu khong doi):");
        const cancelSpamWindowMs = await promptNumber("Cancel spam window (ms) (bo trong neu khong doi):");
        const limits = {};
        if (Number.isFinite(maxOpenOrders)) limits.maxOpenOrders = maxOpenOrders;
        if (Number.isFinite(maxPositions)) limits.maxPositions = maxPositions;
        if (Number.isFinite(maxNotionalUsd)) limits.maxNotionalUsd = maxNotionalUsd;
        if (Number.isFinite(maxLeverage)) limits.maxLeverage = maxLeverage;
        if (Number.isFinite(feeRate)) limits.feeRate = feeRate;
        if (Number.isFinite(cancelPenaltyRate)) limits.cancelPenaltyRate = cancelPenaltyRate;
        if (Number.isFinite(cancelSpamThreshold)) limits.cancelSpamThreshold = cancelSpamThreshold;
        if (Number.isFinite(cancelSpamWindowMs)) limits.cancelSpamWindowMs = cancelSpamWindowMs;
        if (!Object.keys(limits).length) return;
        sendAdminAction("SET_LIMITS", { target: username, limits });
        return;
      }
      const feeBtn = e.target.closest(".admin-fee");
      if (feeBtn) {
        const username = feeBtn.dataset.user;
        if (!username) return;
        const feeRate = await promptNumber("Fee rate cho user:");
        if (!Number.isFinite(feeRate)) return;
        sendAdminAction("SET_USER_FEE", { target: username, feeRate });
        return;
      }
      const strikesBtn = e.target.closest(".admin-strikes");
      if (strikesBtn) {
        const username = strikesBtn.dataset.user;
        if (!username) return;
        const strikes = await promptNumber("Dat so strikes:");
        if (!Number.isFinite(strikes)) return;
        sendAdminAction("SET_STRIKES", { target: username, strikes });
        return;
      }
      const resetStrikesBtn = e.target.closest(".admin-reset-strikes");
      if (resetStrikesBtn) {
        const username = resetStrikesBtn.dataset.user;
        if (!username) return;
        sendAdminAction("RESET_STRIKES", { target: username });
        return;
      }
      const watchBtn = e.target.closest(".admin-watch");
      if (watchBtn) {
        const username = watchBtn.dataset.user;
        if (!username) return;
        const next = watchBtn.dataset.watch === "1" ? false : true;
        sendAdminAction("SET_WATCHLIST", { target: username, watchlist: next });
        return;
      }
      const tradesBtn = e.target.closest(".admin-trades");
      if (tradesBtn) {
        const username = tradesBtn.dataset.user;
        if (!username) return;
        sendAdminAction("GET_USER_TRADES", { target: username, limit: 200 });
        return;
      }
      const tradesCsvBtn = e.target.closest(".admin-trades-csv");
      if (tradesCsvBtn) {
        const username = tradesCsvBtn.dataset.user;
        if (!username) return;
        sendAdminAction("EXPORT_USER_TRADES_CSV", { target: username, limit: 500 });
        return;
      }
      const resetOrdersBtn = e.target.closest(".admin-reset-orders");
      if (resetOrdersBtn) {
        const username = resetOrdersBtn.dataset.user;
        if (!username) return;
        sendAdminAction("RESET_OPEN_ORDERS", { target: username });
        return;
      }
      const resetPositionsBtn = e.target.closest(".admin-reset-positions");
      if (resetPositionsBtn) {
        const username = resetPositionsBtn.dataset.user;
        if (!username) return;
        sendAdminAction("RESET_POSITIONS", { target: username });
        return;
      }
    });
  }
  if (els.adminCoinUpBtn) {
    els.adminCoinUpBtn.addEventListener("click", () => adminAdjustCoin(1));
  }
  if (els.adminCoinDownBtn) {
    els.adminCoinDownBtn.addEventListener("click", () => adminAdjustCoin(-1));
  }
  if (els.adminCoinSetBtn) {
    els.adminCoinSetBtn.addEventListener("click", adminSetCoinPrice);
  }
  if (els.adminCoinPercent) {
    els.adminCoinPercent.addEventListener("input", updateAdminPricePreview);
  }
  if (els.adminCoinSet) {
    els.adminCoinSet.addEventListener("input", updateAdminPricePreview);
  }
  if (els.adminCoinSelect) {
    els.adminCoinSelect.addEventListener("change", () => {
      updateAdminPricePreview();
      updateAdminCoinControls();
    });
  }
  if (els.adminCandleApply) {
    els.adminCandleApply.addEventListener("click", adminApplyCandleBias);
  }
  if (els.adminMaintenance) {
    els.adminMaintenance.addEventListener("change", () => {
      if (!adminState.authed) return;
      sendAdminAction("SET_MAINTENANCE", { enabled: els.adminMaintenance.checked });
    });
  }
  if (els.adminOrderDisabled) {
    els.adminOrderDisabled.addEventListener("change", () => {
      if (!adminState.authed) return;
      sendAdminAction("SET_ORDER_DISABLED", { enabled: els.adminOrderDisabled.checked });
    });
  }
  if (els.adminMarginEnabled) {
    els.adminMarginEnabled.addEventListener("change", () => {
      if (!adminState.authed) return;
      sendAdminAction("SET_MARGIN_ENABLED", { enabled: els.adminMarginEnabled.checked });
    });
  }
  if (els.adminBlockStale) {
    els.adminBlockStale.addEventListener("change", () => {
      if (!adminState.authed) return;
      sendAdminAction("SET_BLOCK_STALE", { enabled: els.adminBlockStale.checked });
    });
  }
  if (els.adminMarketFreeze) {
    els.adminMarketFreeze.addEventListener("change", () => {
      if (!adminState.authed) return;
      sendAdminAction("SET_MARKET_FREEZE", { enabled: els.adminMarketFreeze.checked });
    });
  }
  if (els.adminWithdrawDisabled) {
    els.adminWithdrawDisabled.addEventListener("change", () => {
      if (!adminState.authed) return;
      sendAdminAction("SET_WITHDRAW_DISABLED", { enabled: els.adminWithdrawDisabled.checked });
    });
  }
  if (els.adminDepositDisabled) {
    els.adminDepositDisabled.addEventListener("change", () => {
      if (!adminState.authed) return;
      sendAdminAction("SET_DEPOSIT_DISABLED", { enabled: els.adminDepositDisabled.checked });
    });
  }
  if (els.adminSafeMode) {
    els.adminSafeMode.addEventListener("change", () => {
      if (!adminState.authed) return;
      sendAdminAction("SET_SAFE_MODE", { enabled: els.adminSafeMode.checked });
    });
  }
  if (els.adminReadOnly) {
    els.adminReadOnly.addEventListener("change", () => {
      if (!adminState.authed) return;
      sendAdminAction("SET_ADMIN_READONLY", { enabled: els.adminReadOnly.checked });
    });
  }
  if (els.adminSetSlippage) {
    els.adminSetSlippage.addEventListener("click", () => {
      if (!adminState.authed) return;
      const pct = parseFloat(els.adminSlippage?.value || "");
      if (!Number.isFinite(pct)) {
        showToast("Nhập slippage hợp lệ.");
        return;
      }
      sendAdminAction("SET_SLIPPAGE", { slippagePct: pct });
    });
  }
  if (els.adminSetCancelPenalty) {
    els.adminSetCancelPenalty.addEventListener("click", () => {
      if (!adminState.authed) return;
      const rate = parseFloat(els.adminCancelPenalty?.value || "");
      if (!Number.isFinite(rate)) {
        showToast("Nhập phí phạt hợp lệ.");
        return;
      }
      sendAdminAction("SET_CANCEL_PENALTY", { rate });
    });
  }
  if (els.adminSetStrikeLimit) {
    els.adminSetStrikeLimit.addEventListener("click", () => {
      if (!adminState.authed) return;
      const limit = parseInt(els.adminStrikeLimit?.value || "", 10);
      if (!Number.isFinite(limit) || limit <= 0) {
        showToast("Nhập strike limit hợp lệ.");
        return;
      }
      sendAdminAction("SET_STRIKE_LIMIT", { limit });
    });
  }
  if (els.adminSetGroupFee) {
    els.adminSetGroupFee.addEventListener("click", () => {
      if (!adminState.authed) return;
      const group = String(els.adminGroupFeeGroup?.value || "").trim();
      const feeRate = parseFloat(els.adminGroupFeeRate?.value || "");
      if (!group || !Number.isFinite(feeRate)) {
        showToast("Nhập nhóm và fee hợp lệ.");
        return;
      }
      sendAdminAction("SET_GROUP_FEE", { group, feeRate });
    });
  }
  if (els.adminSetAlertWebhook) {
    els.adminSetAlertWebhook.addEventListener("click", () => {
      if (!adminState.authed) return;
      const url = String(els.adminAlertWebhook?.value || "").trim();
      sendAdminAction("SET_ALERT_WEBHOOK", { url });
    });
  }
  if (els.adminSetAccessHours) {
    els.adminSetAccessHours.addEventListener("click", () => {
      if (!adminState.authed) return;
      const start = parseInt(els.adminAccessStart?.value || "", 10);
      const end = parseInt(els.adminAccessEnd?.value || "", 10);
      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        showToast("Nhập giờ admin hợp lệ.");
        return;
      }
      sendAdminAction("SET_ADMIN_ACCESS_HOURS", { start, end });
    });
  }
  if (els.adminSetIdleMs) {
    els.adminSetIdleMs.addEventListener("click", () => {
      if (!adminState.authed) return;
      const ms = parseInt(els.adminIdleMs?.value || "", 10);
      if (!Number.isFinite(ms) || ms < 60000) {
        showToast("Nhập idle hợp lệ (>= 60000).");
        return;
      }
      sendAdminAction("SET_ADMIN_IDLE", { ms });
    });
  }
  if (els.adminSetSessionMs) {
    els.adminSetSessionMs.addEventListener("click", () => {
      if (!adminState.authed) return;
      const ms = parseInt(els.adminSessionMs?.value || "", 10);
      if (!Number.isFinite(ms) || ms < 60000) {
        showToast("Nhập session hợp lệ (>= 60000).");
        return;
      }
      sendAdminAction("SET_ADMIN_SESSION", { ms });
    });
  }
  if (els.adminSetRateLimits) {
    els.adminSetRateLimits.addEventListener("click", () => {
      if (!adminState.authed) return;
      const superLimit = parseInt(els.adminRateSuper?.value || "", 10);
      const modLimit = parseInt(els.adminRateMod?.value || "", 10);
      const authLimit = parseInt(els.adminRateAuth?.value || "", 10);
      if (!Number.isFinite(superLimit) || !Number.isFinite(modLimit) || !Number.isFinite(authLimit)) {
        showToast("Nhập rate limit hợp lệ.");
        return;
      }
      sendAdminAction("SET_RATE_LIMITS", { super: superLimit, mod: modLimit, auth: authLimit });
    });
  }
  if (els.adminSetLogRetention) {
    els.adminSetLogRetention.addEventListener("click", () => {
      if (!adminState.authed) return;
      const days = parseInt(els.adminLogRetention?.value || "", 10);
      if (!Number.isFinite(days) || days < 1) {
        showToast("Nhập retention hợp lệ.");
        return;
      }
      sendAdminAction("SET_LOG_RETENTION", { days });
    });
  }
  if (els.adminRunLogCleanup) {
    els.adminRunLogCleanup.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("RUN_LOG_CLEANUP", {});
    });
  }
  if (els.adminSetSourceWhitelist) {
    els.adminSetSourceWhitelist.addEventListener("click", () => {
      if (!adminState.authed) return;
      const raw = String(els.adminSourceWhitelist?.value || "");
      const sources = raw.split(",").map((s) => s.trim()).filter(Boolean);
      sendAdminAction("SET_SOURCE_WHITELIST", { sources });
    });
  }
  if (els.adminSetCoinVisibility) {
    els.adminSetCoinVisibility.addEventListener("click", () => {
      if (!adminState.authed) return;
      const symbol = String(els.adminCoinVisibilitySymbol?.value || "").trim().toUpperCase();
      if (!symbol) {
        showToast("Nhập symbol coin.");
        return;
      }
      sendAdminAction("SET_COIN_VISIBILITY", { symbol, visible: !!els.adminCoinVisible?.checked });
    });
  }
  if (els.adminAddCoinBtn) {
    els.adminAddCoinBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const symbol = String(els.adminAddCoinSymbol?.value || "").trim().toUpperCase();
      const name = String(els.adminAddCoinName?.value || "").trim();
      const base = parseFloat(els.adminAddCoinBase?.value || "");
      const vol = parseFloat(els.adminAddCoinVol?.value || "");
      if (!symbol || !Number.isFinite(base)) {
        showToast("Nhập symbol/base hợp lệ.");
        return;
      }
      sendAdminAction("ADD_COIN", { symbol, name, base, vol });
    });
  }
  if (els.adminRemoveCoinBtn) {
    els.adminRemoveCoinBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const symbol = String(els.adminRemoveCoinSymbol?.value || "").trim().toUpperCase();
      if (!symbol) {
        showToast("Nhập symbol coin.");
        return;
      }
      sendAdminAction("REMOVE_COIN", { symbol });
    });
  }
  if (els.adminSetCoinLimits) {
    els.adminSetCoinLimits.addEventListener("click", () => {
      if (!adminState.authed) return;
      const symbol = String(els.adminCoinLimitSymbol?.value || "").trim().toUpperCase();
      const minQty = parseFloat(els.adminCoinMinQty?.value || "");
      const maxQty = parseFloat(els.adminCoinMaxQty?.value || "");
      const precision = parseInt(els.adminCoinPrecision?.value || "", 10);
      if (!symbol) {
        showToast("Nhập symbol coin.");
        return;
      }
      sendAdminAction("SET_COIN_LIMITS", {
        symbol,
        minQty: Number.isFinite(minQty) ? minQty : undefined,
        maxQty: Number.isFinite(maxQty) ? maxQty : undefined,
        precision: Number.isFinite(precision) ? precision : undefined
      });
    });
  }
  if (els.adminBackupDbBtn) {
    els.adminBackupDbBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("BACKUP_DB", {});
    });
  }
  if (els.adminRestoreDbBtn) {
    els.adminRestoreDbBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const backupPath = String(els.adminRestorePath?.value || "").trim();
      if (!backupPath) {
        showToast("Nhập đường dẫn restore.");
        return;
      }
      sendAdminAction("RESTORE_DB", { backupPath });
    });
  }
  if (els.adminCoinFreeze) {
    els.adminCoinFreeze.addEventListener("change", () => {
      if (!adminState.authed) return;
      const symbol = getAdminCoinSymbol();
      if (!symbol) return;
      sendAdminAction("SET_COIN_FREEZE", { symbol, enabled: els.adminCoinFreeze.checked });
    });
  }
  if (els.adminCoinLockBtn) {
    els.adminCoinLockBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const symbol = getAdminCoinSymbol();
      const price = parseFloat(els.adminCoinLockPrice?.value || "");
      const seconds = parseInt(els.adminCoinLockSeconds?.value || "", 10);
      if (!symbol || !Number.isFinite(price) || !Number.isFinite(seconds) || seconds <= 0) {
        showToast("Nhập giá/giây lock hợp lệ.");
        return;
      }
      sendAdminAction("SET_COIN_LOCK", { symbol, price, seconds });
    });
  }
  if (els.adminCoinSourceBtn) {
    els.adminCoinSourceBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const symbol = getAdminCoinSymbol();
      const source = els.adminCoinSource?.value || "";
      if (!symbol) return;
      sendAdminAction("SET_COIN_SOURCE", { symbol, source });
    });
  }
  if (els.adminCoinVolBtn) {
    els.adminCoinVolBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const symbol = getAdminCoinSymbol();
      const scale = parseFloat(els.adminCoinVolScale?.value || "");
      if (!symbol || !Number.isFinite(scale)) {
        showToast("Nhập volScale hợp lệ.");
        return;
      }
      sendAdminAction("SET_COIN_VOL", { symbol, scale });
    });
  }
  if (els.adminCoinCircuitBtn) {
    els.adminCoinCircuitBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const symbol = getAdminCoinSymbol();
      const pct = parseFloat(els.adminCoinCircuitPct?.value || "");
      if (!symbol || !Number.isFinite(pct)) {
        showToast("Nhập circuit % hợp lệ.");
        return;
      }
      sendAdminAction("SET_CIRCUIT_BREAKER", { symbol, pct });
    });
  }
  if (els.adminStatsSpam) {
    els.adminStatsSpam.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_SPAM_STATS", {});
    });
  }
  if (els.adminStatsDailyPnl) {
    els.adminStatsDailyPnl.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_PNL_DAILY", {});
    });
  }
  if (els.adminStatsTopUsers) {
    els.adminStatsTopUsers.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_TOP_USERS_PNL", {});
    });
  }
  if (els.adminStatsTopCoins) {
    els.adminStatsTopCoins.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_TOP_COIN_VOLUME", {});
    });
  }
  if (els.adminStatsOpenInterest) {
    els.adminStatsOpenInterest.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_OPEN_INTEREST", {});
    });
  }
  if (els.adminStatsOnline) {
    els.adminStatsOnline.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_ONLINE_USERS", {});
    });
  }
  if (els.adminStatsApprovals) {
    els.adminStatsApprovals.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("LIST_APPROVALS", {});
    });
  }
  if (els.adminStatsApprovalsByAction) {
    els.adminStatsApprovalsByAction.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_APPROVALS_BY_ACTION", {});
    });
  }
  if (els.adminStatsAdminLog) {
    els.adminStatsAdminLog.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_ADMIN_LOG", { limit: 300 });
    });
  }
  if (els.adminStatsModerator) {
    els.adminStatsModerator.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_MODERATOR_STATS", {});
    });
  }
  if (els.adminStatsDb) {
    els.adminStatsDb.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_DB_STATUS", {});
    });
  }
  if (els.adminStatsWeekly) {
    els.adminStatsWeekly.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_WEEKLY_REPORT", {});
    });
  }
  if (els.adminStatsHeatmap) {
    els.adminStatsHeatmap.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_SPAM_HEATMAP", {});
    });
  }
  if (els.adminStatsCoins) {
    els.adminStatsCoins.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_ALL_COINS", {});
    });
  }
  if (els.adminComplaintAdd) {
    els.adminComplaintAdd.addEventListener("click", () => {
      if (!adminState.authed) return;
      const target = String(els.adminComplaintUser?.value || "").trim();
      const note = String(els.adminComplaintNote?.value || "").trim();
      if (!target || !note) {
        showToast("Nhập user và nội dung.");
        return;
      }
      sendAdminAction("ADD_COMPLAINT", { target, note });
    });
  }
  if (els.adminComplaintList) {
    els.adminComplaintList.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("LIST_COMPLAINTS", {});
    });
  }
  if (els.adminComplaintNoteBtn) {
    els.adminComplaintNoteBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const id = String(els.adminComplaintId?.value || "").trim();
      const note = String(els.adminComplaintNoteAdd?.value || "").trim();
      if (!id || !note) {
        showToast("Nhập complaint ID và ghi chú.");
        return;
      }
      sendAdminAction("ADD_COMPLAINT_NOTE", { id, note });
    });
  }
  if (els.adminComplaintResolve) {
    els.adminComplaintResolve.addEventListener("click", () => {
      if (!adminState.authed) return;
      const id = String(els.adminComplaintId?.value || "").trim();
      if (!id) {
        showToast("Nhập complaint ID.");
        return;
      }
      sendAdminAction("RESOLVE_COMPLAINT", { id });
    });
  }
  if (els.adminIncidentLoad) {
    els.adminIncidentLoad.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("GET_INCIDENT_CHECKLIST", {});
    });
  }
  if (els.adminIncidentToggle) {
    els.adminIncidentToggle.addEventListener("click", () => {
      if (!adminState.authed) return;
      const id = String(els.adminIncidentId?.value || "").trim();
      if (!id) {
        showToast("Nhập incident ID.");
        return;
      }
      sendAdminAction("TOGGLE_INCIDENT_ITEM", { id });
    });
  }
  if (els.adminIncidentSave) {
    els.adminIncidentSave.addEventListener("click", () => {
      if (!adminState.authed) return;
      const raw = String(els.adminIncidentJson?.value || "").trim();
      if (!raw) {
        showToast("Nhập JSON checklist.");
        return;
      }
      let list = [];
      try {
        list = JSON.parse(raw);
      } catch {
        showToast("JSON không hợp lệ.");
        return;
      }
      sendAdminAction("SET_INCIDENT_CHECKLIST", { list });
    });
  }
  if (els.adminTradeFetch) {
    els.adminTradeFetch.addEventListener("click", () => {
      if (!adminState.authed) return;
      const target = String(els.adminTradeTarget?.value || "").trim();
      const limit = parseInt(els.adminTradeLimit?.value || "", 10);
      if (!target) {
        showToast("Nhập user cần xem trades.");
        return;
      }
      sendAdminAction("GET_USER_TRADES", { target, limit });
    });
  }
  if (els.adminTradeExport) {
    els.adminTradeExport.addEventListener("click", () => {
      if (!adminState.authed) return;
      const target = String(els.adminTradeTarget?.value || "").trim();
      const limit = parseInt(els.adminTradeLimit?.value || "", 10);
      if (!target) {
        showToast("Nhập user cần export trades.");
        return;
      }
      sendAdminAction("EXPORT_USER_TRADES_CSV", { target, limit });
    });
  }
  if (els.adminCancelOrderBtn) {
    els.adminCancelOrderBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const target = String(els.adminActionTarget?.value || "").trim();
      const orderId = String(els.adminCancelOrderId?.value || "").trim();
      if (!target || !orderId) {
        showToast("Nhập user và order ID.");
        return;
      }
      sendAdminAction("CANCEL_ORDER_ADMIN", { target, orderId });
    });
  }
  if (els.adminResetOrdersBtn) {
    els.adminResetOrdersBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const target = String(els.adminActionTarget?.value || "").trim();
      if (!target) {
        showToast("Nhập user cần reset orders.");
        return;
      }
      sendAdminAction("RESET_OPEN_ORDERS", { target });
    });
  }
  if (els.adminResetPositionsBtn) {
    els.adminResetPositionsBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const target = String(els.adminActionTarget?.value || "").trim();
      if (!target) {
        showToast("Nhập user cần reset positions.");
        return;
      }
      sendAdminAction("RESET_POSITIONS", { target });
    });
  }
  if (els.adminImpersonateBtn) {
    els.adminImpersonateBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      const target = String(els.adminActionTarget?.value || "").trim();
      if (!target) {
        showToast("Nhập user để impersonate.");
        return;
      }
      sendAdminAction("IMPERSONATE_START", { target });
    });
  }
  if (els.adminStopImpersonateBtn) {
    els.adminStopImpersonateBtn.addEventListener("click", () => {
      if (!adminState.authed) return;
      sendAdminAction("IMPERSONATE_STOP", {});
    });
  }
  if (els.adminOutputBack) {
    els.adminOutputBack.addEventListener("click", () => {
      setAdminOutputPopup(false);
      resetAdminOutput();
    });
  }
  if (els.adminOutputShowAll) {
    els.adminOutputShowAll.addEventListener("click", () => {
      setAdminOutputPopup(false);
    });
  }
  if (els.adminHeader) {
    els.adminHeader.addEventListener("pointerdown", startAdminDrag);
  }
  if (els.adminFullBtn) {
    els.adminFullBtn.addEventListener("click", () => {
      setAdminFullscreen();
    });
  }
  if (els.adminResetPos) {
    els.adminResetPos.addEventListener("click", () => {
      resetAdminPosition();
    });
  }
  if (els.adminCloseBtn) {
    els.adminCloseBtn.addEventListener("click", () => {
      adminState.revealed = false;
      setAdminUI();
      setAdminOutputPopup(false);
    });
  }
  if (els.dailyCheckinBtn) {
    els.dailyCheckinBtn.addEventListener("click", () => {
      claimDailyCheckin();
    });
  }
  if (els.spinBtn) {
    els.spinBtn.addEventListener("click", () => {
      if (!currentUser) {
        showToast("Vui lòng đăng nhập để quay.");
        return;
      }
      if (!socket || !socket.connected) {
        showToast("Máy chủ chưa sẵn sàng.");
        return;
      }
      if (spinLock) return;
      spinLock = true;
      renderSpinStatus();
      socket.emit("spin_wheel");
    });
  }
  if (els.predictUpBtn) {
    els.predictUpBtn.addEventListener("click", () => {
      startPredict("up");
    });
  }
  if (els.predictDownBtn) {
    els.predictDownBtn.addEventListener("click", () => {
      startPredict("down");
    });
  }
  if (els.pollBullBtn) {
    els.pollBullBtn.addEventListener("click", () => {
      voteBullBear("bull");
    });
  }
  if (els.pollBearBtn) {
    els.pollBearBtn.addEventListener("click", () => {
      voteBullBear("bear");
    });
  }
  if (els.adminRevealBtn) {
    els.adminRevealBtn.addEventListener("click", () => {
      toggleAdminReveal();
    });
  }
  const logoEl = document.querySelector(".logo");
  if (logoEl) {
    let pressTimer = null;
    const startPress = () => {
      if (pressTimer) clearTimeout(pressTimer);
      pressTimer = setTimeout(() => {
        toggleAdminReveal(true);
      }, 800);
    };
    const cancelPress = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };
    logoEl.addEventListener("touchstart", startPress, { passive: true });
    logoEl.addEventListener("touchend", cancelPress);
    logoEl.addEventListener("touchcancel", cancelPress);
    logoEl.addEventListener("mousedown", startPress);
    logoEl.addEventListener("mouseup", cancelPress);
    logoEl.addEventListener("mouseleave", cancelPress);
  }
  const changeBtn = document.getElementById("changePasswordBtn");
  if (changeBtn) {
    changeBtn.addEventListener("click", () => {
      if (!socket || !socket.connected) {
        showToast("Máy chủ chưa sẵn sàng.");
        return;
      }
      const oldPass = String(document.getElementById("oldPassword")?.value || "");
      const newPass = String(document.getElementById("newPassword")?.value || "");
      const confirmPass = String(document.getElementById("confirmPassword")?.value || "");
      const msg = document.getElementById("passwordMsg");
      if (!oldPass || !newPass || !confirmPass) {
        if (msg) msg.textContent = "Nhập đầy đủ thông tin.";
        return;
      }
      if (newPass !== confirmPass) {
        if (msg) msg.textContent = "Mật khẩu mới không khớp.";
        return;
      }
      if (msg) msg.textContent = "";
      socket.emit("change_password", { oldPassword: oldPass, newPassword: newPass });
    });
  }
  document.addEventListener("keydown", handleAdminComboKeyDown);
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.quote = chip.dataset.quote;
      updateRows();
      updatePairHeader();
      updateOrderInputs();
      buildOrderBook();
      updatePortfolio();
      updateTicker();
      updateChartLabels();
      scheduleChartDraw();
      if (els.orderPercent && Number(els.orderPercent.value) > 0) {
        applyOrderPercent(els.orderPercent.value);
      }
    });
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active", "buy", "sell"));
      tab.classList.add("active", tab.dataset.side);
      state.side = tab.dataset.side;
      if (els.orderPercent && Number(els.orderPercent.value) > 0) {
        applyOrderPercent(els.orderPercent.value);
      }
    });
  });

  document.querySelectorAll(".time-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("ind")) {
        if (btn.disabled) return;
        const key = btn.dataset.ind;
        state.indicators[key] = !state.indicators[key];
        btn.classList.toggle("active", state.indicators[key]);
        drawChart();
        return;
      }
      document.querySelectorAll(".time-btn").forEach((b) => {
        if (!b.classList.contains("ind")) b.classList.remove("active");
      });
      btn.classList.add("active");
      const map = { "1m": 80, "5m": 120, "15m": 160, "1h": 200, "1d": 240 };
      state.chartPoints = map[btn.dataset.tf];
      normalizeChartDataLength();
      scheduleChartDraw();
    });
  });

  document.querySelectorAll(".layout-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const layout = parseInt(btn.dataset.layout, 10);
      if (Number.isFinite(layout)) applyChartLayout(layout);
    });
  });

  els.orderType.addEventListener("change", () => {
    els.orderPrice.disabled = els.orderType.value === "market";
    updateOrderInputs();
    if (els.orderPercent && Number(els.orderPercent.value) > 0) {
      applyOrderPercent(els.orderPercent.value);
    }
  });

  els.orderLeverage.addEventListener("change", () => {
    state.leverage = parseInt(els.orderLeverage.value, 10);
    updateLeverageOptions();
    updateOrderCalc();
    if (els.orderPercent && Number(els.orderPercent.value) > 0) {
      applyOrderPercent(els.orderPercent.value);
    }
  });

  els.orderPrice.addEventListener("input", () => {
    updateOrderCalc();
    if (els.orderPercent && Number(els.orderPercent.value) > 0) {
      applyOrderPercent(els.orderPercent.value);
    }
  });
  els.orderQty.addEventListener("input", updateOrderCalc);
  if (els.orderQtyUp) {
    els.orderQtyUp.addEventListener("click", () => stepOrderQty(1));
  }
  if (els.orderQtyDown) {
    els.orderQtyDown.addEventListener("click", () => stepOrderQty(-1));
  }
  els.orderStop.addEventListener("input", () => {
    updateOrderCalc();
    markPracticeFromInputs();
  });
  els.orderTake.addEventListener("input", () => {
    updateOrderCalc();
    markPracticeFromInputs();
  });
  els.orderTrail.addEventListener("input", updateOrderCalc);
  els.submitOrder.addEventListener("click", placeOrder);
  if (els.orderPercent) {
    els.orderPercent.addEventListener("input", () => {
      applyOrderPercent(els.orderPercent.value);
    });
  }
  if (els.quickBuyBtn) {
    els.quickBuyBtn.addEventListener("click", () => {
      setSide("buy");
      placeOrder();
    });
  }
  if (els.quickSellBtn) {
    els.quickSellBtn.addEventListener("click", () => {
      setSide("sell");
      placeOrder();
    });
  }
  if (els.quickCancelBtn) {
    els.quickCancelBtn.addEventListener("click", () => {
      cancelLatestOrder();
    });
  }
  if (els.undoBtn) {
    els.undoBtn.addEventListener("click", () => {
      applyUndo();
    });
  }

  const debouncedMarketFilter = debounce(() => applyFilters({ resetScroll: true }), 180);
  els.searchInput.addEventListener("input", debouncedMarketFilter);

  els.watchAll.addEventListener("click", () => {
    els.watchAll.classList.add("active");
    els.watchFav.classList.remove("active");
    applyFilters({ resetScroll: true });
  });

  els.watchFav.addEventListener("click", () => {
    els.watchFav.classList.add("active");
    els.watchAll.classList.remove("active");
    applyFilters({ resetScroll: true });
  });

  window.addEventListener("resize", () => {
    resizeAllCharts();
    drawChart();
    resizeBgCanvas();
    resizeEquityCanvas();
    resizeDepthCanvas();
    drawEquity();
    marketView.measured = false;
    renderMarketVirtual();
    updatePerfMode();
  });

  els.themeToggle?.addEventListener("click", () => {
    const next = document.body.dataset.theme === "light" ? "dark" : "light";
    document.body.dataset.theme = next;
    els.themeToggle.textContent = next === "light" ? "Chế độ tối" : "Chế độ sáng";
    localStorage.setItem("tradingGameTheme", next);
    els.chartBgCanvases.forEach((c) => chartBgCache.delete(c));
    scheduleChartDraw();
  });

  els.compactToggle?.addEventListener("click", () => {
    setCompactMode(!state.compactMode);
    saveLocal();
  });

  els.assistViewChart?.addEventListener("click", runAssistViewChart);
  els.assistDemoOrder?.addEventListener("click", runAssistDemoOrder);
  els.assistSampleSLTP?.addEventListener("click", runAssistSampleSLTP);

  const volRange = document.getElementById("volRange");
  if (volRange) {
    volRange.addEventListener("input", () => {
      const value = Math.max(0.2, parseFloat(volRange.value) / 10);
      sendAdminAction("VOL", { value });
    });
  }
}

function init() {
  const savedTheme = localStorage.getItem("tradingGameTheme");
  if (savedTheme) {
    document.body.dataset.theme = savedTheme;
  }
  if (els.themeToggle) {
    els.themeToggle.textContent = document.body.dataset.theme === "light" ? "Chế độ tối" : "Chế độ sáng";
  }
  ensurePrimaryAriaLabels();
  if (!orderNoteDefault && els.orderNote) {
    orderNoteDefault = els.orderNote.textContent || "";
  }
  loadMailReadMap();
  updateMuteButton();
  updatePerfMode();
  initMarket();
  initSocket();
  loadLocal();
  setCompactMode(state.compactMode);
  loadTodayAssist();
  state.weeklyLeaderboard = loadWeeklyLeaderboard();
  lastCareerLevel = state.career.level;
  setAuthState(null);
  startOnboarding();
  setAdminUI();
  const storedAuth = getStoredAuth();
  if (storedAuth) {
    if (els.authUsername) els.authUsername.value = storedAuth.username;
  }
  if (els.authRemember) {
    els.authRemember.checked = getRemember();
  }
  if (els.adminNewDays && !els.adminNewDays.value) {
    els.adminNewDays.value = "7";
  }
  ensureAllCoinsState();
  refreshCareer();
  els.fxRate.textContent = formatNumber(FX_RATE);
  buildMarketTable();
  applyFilters();
  buildQuickLetters();
  updateConnectionBadge();
  updatePendingBadge();
  initChartSlots();
  initLightweightCharts();
  buildSlotSelects();
  buildAdminCoinSelect();
  bindEvents();
  setupCollapsiblePanels();
  renderAchievements();
  renderLeaderboard();
  renderWeeklyLeaderboard();
  renderDailyTip();
  renderBullBearPoll();
  renderBoosters();
  renderDailyCheckin();
  renderLessonHistory();
  updatePredictButtons(true);
  renderPredictStatus("Sẵn sàng", "");
  initCopyBot();
  updateRows();
  updateBalances();
  updatePortfolio();
  renderPositions();
  renderOpenOrders();
  updatePairHeader();
  updateOrderInputs();
  updateTicker();
  selectCoin(state.selected);
  resizeBgCanvas();
  resizeAllCharts();
  drawChart();
  resizeEquityCanvas();
  resizeDepthCanvas();
  trackEquity();
  drawEquity();
  scheduleNews();
  scheduleMacroEvents();
  if (!socket) startOfflineMode();
  setTimeout(() => {
    if (!socket || !socket.connected) startOfflineMode();
  }, 1500);
  startBgLoop();
  startFxLoop();
  setInterval(tick, 600);
  setInterval(() => {
    saveLocal();
  }, 5000);

  window.addEventListener("beforeunload", saveLocal);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveLocal();
  });
}

// Virtualized market list (overrides earlier helpers)
function buildMarketTable() {
  if (!els.marketTable) return;
  els.marketTable.innerHTML = "";
  rowMap.clear();
  marketView.filtered = [];
  marketView.start = 0;
  marketView.end = 0;
  marketView.filterKey += 1;
  marketView.lastKey = -1;
  marketView.measured = false;

  const header = document.createElement("div");
  header.className = "market-header";
  header.innerHTML = `
    <div>Cáº·p</div>
    <div>GiÃ¡</div>
    <div>24h</div>
    <div class="vol-toggle">Vol <button id="marketToggleBtn" class="market-toggle-btn" type="button">${state.marketCollapsed ? "-" : "+"}</button></div>
  `;
  els.marketTable.appendChild(header);
  const toggleBtn = header.querySelector("#marketToggleBtn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const next = !state.marketCollapsed;
      setMarketCollapsed(next);
      toggleBtn.textContent = next ? "-" : "+";
    });
  }

  marketBodyEl = document.createElement("div");
  marketBodyEl.className = "market-body";
  els.marketTable.appendChild(marketBodyEl);

  els.marketTable.classList.toggle("collapsed", state.marketCollapsed);
  if (!els.marketTable.dataset.virtualInit) {
    els.marketTable.addEventListener("scroll", handleMarketScroll, { passive: true });
    els.marketTable.dataset.virtualInit = "1";
  }
}

function createMarketRow(coin, index) {
  const iconHtml = coin.icon
    ? `<img class="coin-icon-img" src="${coin.icon}" alt="${coin.symbol}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';" />`
    : "";
  const fallbackStyle = coin.icon ? "" : ' style="display:inline-flex"';
  const fallback = `<span class="coin-icon-fallback"${fallbackStyle}>${coin.symbol.slice(0, 2)}</span>`;
  const row = document.createElement("div");
  row.className = "market-row virtual";
  row.dataset.symbol = coin.symbol;
  row.style.top = `${index * marketView.rowHeight}px`;
  row.style.height = `${marketView.rowHeight}px`;
  row.style.display = "grid";
  row.innerHTML = `
    <div class="coin">
      <div class="coin-icon">${iconHtml}${fallback}</div>
      <div>
        <div class="coin-sym">${coin.symbol}</div>
        <div class="coin-name">${coin.name}</div>
      </div>
      <button class="star" aria-label="Theo dÃµi">â˜†</button>
    </div>
    <div class="price" data-field="price"></div>
    <div class="change" data-field="change"></div>
    <div class="vol" data-field="vol"></div>
  `;

  const star = row.querySelector(".star");
  if (star) {
    star.classList.toggle("active", state.favorites.has(coin.symbol));
    star.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(coin.symbol, row);
    });
  }

  row.addEventListener("click", () => selectCoin(coin.symbol));
  if (coin.symbol === state.selected) row.classList.add("selected");
  return row;
}

function getFilteredCoins() {
  if (state.marketCollapsed) {
    const selectedCoin = coins.find((coin) => coin.symbol === state.selected);
    return selectedCoin ? [selectedCoin] : [];
  }
  const keyword = els.searchInput.value.toLowerCase().trim();
  const onlyFav = els.watchFav.classList.contains("active");
  const quickLetter = state.quickLetter.toLowerCase();

  return coins.filter((coin) => {
    const symbolText = coin.symbol.toLowerCase();
    const nameText = coin.name.toLowerCase();
    const matchKeyword = keyword
      ? (symbolText.includes(keyword) || nameText.includes(keyword))
      : true;
    const matchQuick = quickLetter
      ? (symbolText.includes(quickLetter) || nameText.includes(quickLetter))
      : true;
    const matchFav = !onlyFav || state.favorites.has(coin.symbol);
    return matchKeyword && matchQuick && matchFav;
  });
}

function renderMarketVirtual() {
  if (!els.marketTable || !marketBodyEl) return;
  const list = marketView.filtered.length ? marketView.filtered : getFilteredCoins();
  if (marketView.filtered.length === 0) {
    marketView.filtered = list;
  }

  const total = list.length;
  const rowHeight = marketView.rowHeight || 64;
  marketBodyEl.style.height = `${total * rowHeight}px`;

  if (total === 0) {
    rowMap.clear();
    marketBodyEl.innerHTML = "";
    return;
  }

  const viewHeight = els.marketTable.clientHeight || 0;
  const scrollTop = els.marketTable.scrollTop || 0;
  const start = Math.max(0, Math.floor(scrollTop / rowHeight) - marketView.buffer);
  const end = Math.min(total, Math.ceil((scrollTop + viewHeight) / rowHeight) + marketView.buffer);
  const rangeChanged = start !== marketView.start || end !== marketView.end;
  const keyChanged = marketView.filterKey !== marketView.lastKey;

  if (!rangeChanged && !keyChanged) {
    updateRows();
    return;
  }

  marketView.start = start;
  marketView.end = end;
  marketView.lastKey = marketView.filterKey;
  rowMap.clear();
  marketBodyEl.innerHTML = "";

  for (let i = start; i < end; i += 1) {
    const coin = list[i];
    if (!coin) continue;
    const row = createMarketRow(coin, i);
    rowMap.set(coin.symbol, row);
    marketBodyEl.appendChild(row);
  }

  updateRows();

  if (!marketView.measured) {
    const sample = marketBodyEl.querySelector(".market-row");
    if (sample) {
      const measured = Math.round(sample.getBoundingClientRect().height);
      if (measured && measured !== marketView.rowHeight) {
        marketView.rowHeight = measured;
        marketView.measured = true;
        renderMarketVirtual();
        return;
      }
      marketView.measured = true;
    }
  }
}

function handleMarketScroll() {
  if (marketScrollRaf) return;
  marketScrollRaf = requestAnimationFrame(() => {
    marketScrollRaf = null;
    renderMarketVirtual();
  });
}

function toggleFavorite(symbol, rowEl = null) {
  if (state.favorites.has(symbol)) {
    state.favorites.delete(symbol);
  } else {
    state.favorites.add(symbol);
  }
  const row = rowEl || rowMap.get(symbol);
  if (row) {
    const star = row.querySelector(".star");
    if (star) star.classList.toggle("active", state.favorites.has(symbol));
  }
  applyFilters();
}

function setMarketCollapsed(collapsed) {
  state.marketCollapsed = !!collapsed;
  if (els.marketTable) {
    els.marketTable.classList.toggle("collapsed", state.marketCollapsed);
  }
  applyFilters();
}

function applyFilters(options = {}) {
  marketView.filtered = getFilteredCoins();
  marketView.filterKey += 1;
  if (options.resetScroll && els.marketTable) {
    els.marketTable.scrollTop = 0;
  }
  renderMarketVirtual();
}

init();

function getAchievementTitle(id) {
  const ach = achievementsCatalog.find((a) => a.id === id);
  return ach ? ach.title : "Achievement";
}

function showAchievementPop(title) {
  const text = title ? `Mở khóa: ${title}` : "Mở khóa thành tích!";
  const pop = document.createElement("div");
  pop.className = "achievement-pop";
  pop.textContent = text;
  document.body.appendChild(pop);
  spawnConfetti(18);
  setTimeout(() => {
    pop.remove();
  }, 2000);
}

let bigWinTimer = null;
function showBigWin({ pnlUsd = 0, pct = 0, symbol = "" } = {}) {
  const amount = formatUSD(Math.abs(Number(pnlUsd) || 0));
  const percent = Number.isFinite(pct) ? (pct * 100).toFixed(2) : "0.00";
  const overlay = document.createElement("div");
  overlay.className = "bigwin-overlay";
  overlay.innerHTML = `
    <div class="bigwin-card">
      <div class="bigwin-title">BIG WIN!</div>
      <div class="bigwin-text">Bạn vừa kiếm được <strong>${amount}</strong>${symbol ? ` từ ${symbol}` : ""}!</div>
      <div class="bigwin-sub">Lợi nhuận ~ ${percent}% tài khoản</div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("show"));
  spawnConfetti(60);
  clearTimeout(bigWinTimer);
  bigWinTimer = setTimeout(() => {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 250);
  }, 2600);
}

function spawnConfetti(count = 12) {
  const container = document.createElement("div");
  container.className = "confetti-container";
  const colors = ["#3ef0b7", "#5f5bff", "#ffc56e", "#ff5c7a", "#5fc1ff"];
  for (let i = 0; i < count; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.animationDelay = `${Math.random() * 0.2}s`;
    container.appendChild(piece);
  }
  document.body.appendChild(container);
  setTimeout(() => {
    container.remove();
  }, 1800);
}

if (typeof unlockAchievement === "function") {
  const originalUnlockAchievement = unlockAchievement;
  unlockAchievement = function (id) {
    const had = state.achievements.has(id);
    originalUnlockAchievement(id);
    if (!had && state.achievements.has(id)) {
      showAchievementPop(getAchievementTitle(id));
    }
  };
}

async function sendAdminAction(action, extra = {}) {
  if (!socket || !socket.connected) {
    showToast("Chế độ admin chỉ hoạt động khi kết nối máy chủ.");
    return;
  }
  const payload = { action, ...extra };
  if (adminState.authed) {
    socket.emit("admin_action", payload);
    return;
  }
  adminState.pending = payload;
  const pass = await adminPrompt({
    title: "Mat khau admin",
    text: "Nhap mat khau admin:",
    type: "password"
  });
  if (!pass) {
    adminState.pending = null;
    return;
  }
  const otp = await adminPrompt({
    title: "OTP admin",
    text: "Nhap OTP admin (neu co):",
    type: "text",
    value: ""
  });
  const ownerCode = await adminPrompt({
    title: "Ma sep (toan quyen)",
    text: "Nhap ma sep neu can toan quyen:",
    type: "password",
    value: ""
  });
  socket.emit("admin_auth", { password: pass, otp: otp || "", ownerCode: ownerCode || "" });
}

function triggerGodMode(action) {
  if (action === "SET_PRICE") {
    const input = document.getElementById("godPrice");
    const value = parseFloat(input?.value || "0");
    if (!Number.isFinite(value) || value <= 0) {
      showToast("Giá không hợp lệ.");
      return;
    }
    sendAdminAction(action, { symbol: state.selected, price: value });
    return;
  }
  sendAdminAction(action, { symbol: state.selected });
}

/* function triggerGodMode(action) {
  const symbol = state.selected;
  switch (action) {
    case "CRASH":
      coins.forEach((c) => { marketTrends[c.symbol] = -3.0; });
      godMode.freeze = false;
      showToast("GOD MODE: Kích hoạt bán tháo toàn thị trường!");
      break;
    case "PUMP_BTC":
      marketTrends[symbol] = 2.5;
      godMode.freeze = false;
      showToast(`GOD MODE: Bơm giá ${symbol} cực mạnh!`);
      break;
    case "FREEZE":
      coins.forEach((c) => { marketTrends[c.symbol] = 0; });
      godMode.freeze = true;
      showToast("GOD MODE: Đóng băng biến động.");
      break;
    case "CALM":
      coins.forEach((c) => { marketTrends[c.symbol] = (Math.random() - 0.5) * 0.1; });
      godMode.freeze = false;
      showToast("GOD MODE: Thị trường ổn định lại.");
      break;
    default:
      break;
  }
} */

window.triggerGodMode = triggerGodMode;

function resetSimulation() {
  state.usd = 10000;
  state.vnd = 200000000;
  state.tradeVolumeUsd = 0;
  state.holdings = {};
  state.costBasis = {};
  state.holdingStart = {};
  state.market = {};
  state.trades = [];
  state.openOrders = [];
  state.positions = [];
  state.protections = [];
  state.liveSymbols = new Set();
  state.volBoosts = {};
  state.macro = { blackSwan: null, pumpGroup: null, calendarFired: {} };
  state.funding.lastTs = Date.now();
  state.lossStreak = 0;
  state.risk = { maxLeverage: null, limitUntil: 0, cooldownUntil: 0 };
  state.marketRegime = { mode: "sideway", until: 0 };
  state.depthBooks = {};
  state.equityHistory = [];
  chartData.clear();
  candleCounters.clear();
  Object.keys(marketTrends).forEach((k) => delete marketTrends[k]);
  initMarket();
  normalizeChartDataLength();
  updateRows();
  updateBalances();
  updatePortfolio();
  renderPositions();
  renderOpenOrders();
  updatePairHeader();
  updateOrderInputs();
  updateTicker();
  buildOrderBook();
  renderTrades();
  resizeAllCharts();
  scheduleChartDraw();
  trackEquity();
  drawEquity();
  showToast("Simulation reset.");
}

window.resetSimulation = resetSimulation;
