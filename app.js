/* =========================================================
   app.js — поиск, фильтры, избранное, темы, печать и экспорт
   ========================================================= */

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

const ALL_OS = ["macOS", "Linux", "Windows"];
const OS_ICON = { macOS: "🍏", Linux: "🐧", Windows: "⊞" };

const store = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* приватный режим — работаем без сохранения */
    }
  }
};

function detectOS() {
  const data = (navigator.userAgentData && navigator.userAgentData.platform) || "";
  const raw = `${data} ${navigator.platform || ""} ${navigator.userAgent || ""}`;
  if (/win/i.test(raw)) return "Windows";
  if (/mac|iphone|ipad|ipod/i.test(raw)) return "macOS";
  if (/linux|x11|android/i.test(raw)) return "Linux";
  return null;
}

const detectedOS = detectOS();
const isMac = detectedOS === "macOS";

const savedOS = store.get("pycheat:os", "all");
let favs = [];
try {
  const parsed = JSON.parse(store.get("pycheat:favs", "[]"));
  favs = Array.isArray(parsed) ? parsed : [];
} catch (e) {
  favs = [];
}

const savedTheme = store.get("pycheat:theme", null);

const state = {
  query: "",
  filter: "all",                 // all | fav | id категории
  os: ["all", "my", ...ALL_OS].includes(savedOS) ? savedOS : "all",
  favs: new Set(favs),
  theme: ["light", "dark"].includes(savedTheme) ? savedTheme : null,
  detectedOS
};

/* ---------- Утилиты ---------- */

function activeOS() {
  if (state.os === "my") return state.detectedOS || "all";
  return state.os;
}

function matchesOS(item) {
  const os = activeOS();
  if (os === "all" || !item.os || !item.os.length) return true;
  return item.os.includes(os);
}

function osBadges(item) {
  if (!item.os || item.os.length >= ALL_OS.length) {
    return `<span class="os-badge universal" title="Универсально">🌐</span>`;
  }
  return item.os.map(os =>
    `<span class="os-badge os-${os.toLowerCase()}">${OS_ICON[os]} ${os}</span>`
  ).join("");
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function highlight(escaped, q) {
  if (!q) return escaped;
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  let result = escaped;
  tokens.forEach(t => {
    if (!t) return;
    const safe = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(new RegExp(`(${safe})(?!([^<]*?)</mark>)`, "gi"), "<mark>$1</mark>");
  });
  return result;
}

function itemKey(cat, item) {
  return `${cat.id}::${item.t}`;
}

function matchQuery(item, cat, q) {
  if (!q) return true;
  const hay = [
    item.t,
    item.d || "",
    item.code,
    cat.title,
    cat.sub || "",
    (item.os || []).join(" ")
  ].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every(t => hay.includes(t));
}

function visibleItems(cat, { ignoreFav = false } = {}) {
  const q = state.query.trim();
  return cat.items.filter(item => {
    if (!ignoreFav && state.filter === "fav" && !state.favs.has(itemKey(cat, item))) return false;
    if (!matchesOS(item)) return false;
    if (!matchQuery(item, cat, q)) return false;
    return true;
  });
}

/* ---------- Sidebar ---------- */

function buildSidebar() {
  const nav = $("#navList");
  nav.innerHTML = "";
  window.CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "nav-item";
    btn.type = "button";
    btn.dataset.filter = cat.id;
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = `
      <span class="nav-icon">${escapeHtml(cat.emoji)}</span>
      <span class="nav-label"></span>
      <span class="nav-count">${cat.items.length}</span>`;
    btn.querySelector(".nav-label").textContent = cat.title;
    btn.addEventListener("click", () => selectFilter(cat.id));
    nav.appendChild(btn);
  });

  const total = window.CATEGORIES.reduce((n, c) => n + c.items.length, 0);
  $("#stats").textContent = `${window.CATEGORIES.length} разделов · ${total} карточек`;
  updateSidebarCounts();
}

function updateSidebarCounts() {
  let allCount = 0;
  let favCount = 0;
  const perCategory = new Map();

  window.CATEGORIES.forEach(cat => {
    const items = visibleItems(cat, { ignoreFav: true });
    perCategory.set(cat.id, items.length);
    allCount += items.length;
    favCount += items.filter(it => state.favs.has(itemKey(cat, it))).length;
  });

  $$(".sidebar .nav-item").forEach(btn => {
    const f = btn.dataset.filter;
    const value = f === "all" ? allCount : f === "fav" ? favCount : (perCategory.get(f) || 0);
    const count = btn.querySelector(".nav-count");
    if (count) count.textContent = value;
  });
  $("#countAll").textContent = allCount;
  $("#countFav").textContent = favCount;
}

/* ---------- Рендер карточек ---------- */

function cardHTML(item, cat, q) {
  const key = itemKey(cat, item);
  const fav = state.favs.has(key);
  let title = escapeHtml(item.t);
  let desc = escapeHtml(item.d || "");
  if (q) {
    title = highlight(title, q);
    desc = highlight(desc, q);
  }
  const code = escapeHtml(item.code);

  return `
    <article class="card" data-key="${escapeHtml(key)}">
      <div class="card-head">
        <div class="card-heading">
          <h3 class="card-title">${title}</h3>
          <div class="os-badges">${osBadges(item)}</div>
        </div>
        <button class="star-btn ${fav ? "on" : ""}" data-star type="button"
                aria-label="${fav ? "Убрать из избранного" : "В избранное"}"
                aria-pressed="${fav}" title="В избранное">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
        </button>
      </div>
      <p class="card-desc">${desc}</p>
      <div class="code-wrap">
        <button class="copy-btn" data-copy type="button" aria-label="Скопировать код">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span>Copy</span>
        </button>
        <pre><code>${code}</code></pre>
      </div>
    </article>`;
}

function render() {
  const results = $("#results");
  const q = state.query.trim();
  let total = 0;

  const html = window.CATEGORIES.map(cat => {
    const items = visibleItems(cat);
    if (!items.length) return "";
    total += items.length;
    return `
      <section class="category" id="cat-${cat.id}">
        <h2 class="cat-title"><span class="cat-emoji">${escapeHtml(cat.emoji)}</span> ${escapeHtml(cat.title)}</h2>
        <p class="cat-sub">${escapeHtml(cat.sub || "")}</p>
        <div class="cards">
          ${items.map(it => cardHTML(it, cat, q)).join("")}
        </div>
      </section>`;
  }).join("");

  results.innerHTML = html;
  $("#empty").hidden = total > 0;
  updateSidebarCounts();
}

/* ---------- Фильтры ---------- */

function selectFilter(id) {
  state.filter = id;
  $$(".sidebar .nav-item").forEach(btn => {
    const active = btn.dataset.filter === id;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  const favOn = id === "fav";
  $("#favToggle").classList.toggle("fav-on", favOn);
  $("#favToggle").setAttribute("aria-pressed", String(favOn));

  render();

  if (id !== "all" && id !== "fav") {
    const el = document.getElementById(`cat-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (window.innerWidth > 760 && window.innerWidth <= 1000) {
    const activeBtn = $(".sidebar .nav-item.active");
    if (activeBtn) activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }
}

function setOS(os) {
  state.os = os;
  store.set("pycheat:os", os);
  updateOSUI();
  render();
}

function updateOSUI() {
  $$("#osFilters .chip").forEach(chip => {
    const active = chip.dataset.os === state.os;
    chip.classList.toggle("active", active);
    chip.setAttribute("aria-pressed", String(active));
  });

  const myChip = $("#myOsChip");
  myChip.textContent = state.detectedOS ? `Моя ОС · ${state.detectedOS}` : "Моя ОС";

  const os = activeOS();
  const hint = os === "all"
    ? "Без фильтра"
    : `Универсальные + ${os}`;
  $("#osHint").textContent = hint;

  const keyLabel = isMac ? "⌘K" : "Ctrl+K";
  $("#shortcut").textContent = keyLabel;
  $("#footerShortcut").textContent = keyLabel;
}

function resetFilters() {
  state.query = "";
  $("#search").value = "";
  setOS("all");
  selectFilter("all");
  showToast("Фильтры сброшены");
}

/* ---------- Избранное ---------- */

function toggleFav(btn) {
  const card = btn.closest(".card");
  if (!card) return;
  const key = card.dataset.key;
  if (state.favs.has(key)) {
    state.favs.delete(key);
    btn.classList.remove("on");
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", "В избранное");
  } else {
    state.favs.add(key);
    btn.classList.add("on");
    btn.setAttribute("aria-pressed", "true");
    btn.setAttribute("aria-label", "Убрать из избранного");
  }
  store.set("pycheat:favs", JSON.stringify([...state.favs]));
  updateSidebarCounts();
  if (state.filter === "fav") render();
}

/* ---------- Копирование ---------- */

function copyCode(btn) {
  const pre = btn.parentElement.querySelector("pre");
  const text = pre ? pre.textContent : "";
  const done = () => {
    btn.classList.add("done");
    btn.querySelector("span").textContent = "Copied";
    showToast("Скопировано ✓");
    setTimeout(() => {
      btn.classList.remove("done");
      btn.querySelector("span").textContent = "Copy";
    }, 1400);
  };
  const fallback = () => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {
      showToast("Не удалось скопировать");
    }
    ta.remove();
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(fallback);
  } else {
    fallback();
  }
}

/* ---------- Экспорт ---------- */

function exportMarkdown() {
  const os = activeOS();
  const parts = [
    "# Python Шпаргалка",
    "",
    `> Фильтр ОС: ${os === "all" ? "все" : os} · сгенерировано ${new Date().toLocaleDateString("ru-RU")}`,
    ""
  ];

  let count = 0;
  window.CATEGORIES.forEach(cat => {
    const items = visibleItems(cat);
    if (!items.length) return;
    count += items.length;
    parts.push(`## ${cat.emoji} ${cat.title}`, "");
    if (cat.sub) parts.push(cat.sub, "");
    items.forEach(item => {
      parts.push(`### ${item.t}`, "");
      if (item.d) parts.push(item.d, "");
      if (item.os && item.os.length) parts.push(`ОС: ${item.os.join(", ")}`, "");
      parts.push("````python", item.code, "````", "");
    });
  });

  if (!count) {
    showToast("Нечего экспортировать");
    return;
  }

  const blob = new Blob([parts.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const slug = os === "all" ? "all" : os.toLowerCase();
  a.href = url;
  a.download = `python-cheatsheet-${slug}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Экспортировано в Markdown");
}

/* ---------- Toast ---------- */

let toastTimer;
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- Тема ---------- */

function applyTheme() {
  let theme = state.theme;
  if (!theme) {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.theme = theme;
}

function toggleTheme() {
  const cur = document.documentElement.dataset.theme;
  state.theme = cur === "dark" ? "light" : "dark";
  store.set("pycheat:theme", state.theme);
  applyTheme();
}

/* ---------- События ---------- */

function bindEvents() {
  const search = $("#search");

  search.addEventListener("input", () => {
    state.query = search.value;
    render();
  });

  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      search.focus();
      search.select();
    }
    if (e.key === "Escape" && document.activeElement === search) {
      if (search.value) {
        search.value = "";
        state.query = "";
        render();
      } else {
        search.blur();
      }
    }
  });

  $("#favToggle").addEventListener("click", () => {
    selectFilter(state.filter === "fav" ? "all" : "fav");
  });
  $("#themeToggle").addEventListener("click", toggleTheme);
  $("#printBtn").addEventListener("click", () => window.print());
  $("#exportBtn").addEventListener("click", exportMarkdown);
  $("#footerPrint").addEventListener("click", () => window.print());
  $("#footerExport").addEventListener("click", exportMarkdown);
  $("#emptyReset").addEventListener("click", resetFilters);

  $("#osFilters").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (chip) setOS(chip.dataset.os);
  });

  $$('.sidebar .nav-item[data-filter="all"], .sidebar .nav-item[data-filter="fav"]')
    .forEach(btn => btn.addEventListener("click", () => selectFilter(btn.dataset.filter)));

  $("#results").addEventListener("click", e => {
    const copyBtn = e.target.closest("[data-copy]");
    if (copyBtn) {
      copyCode(copyBtn);
      return;
    }
    const starBtn = e.target.closest("[data-star]");
    if (starBtn) toggleFav(starBtn);
  });
}

/* ---------- Старт ---------- */

buildSidebar();
applyTheme();
updateOSUI();
bindEvents();
render();
