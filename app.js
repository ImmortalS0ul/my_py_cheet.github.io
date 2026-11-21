/* =========================================================
   app.js — логика приложения
   ========================================================= */

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

const state = {
  query: "",
  filter: "all",          // all | fav | id категории
  favs: new Set(JSON.parse(localStorage.getItem("pycheat:favs") || "[]")),
  theme: localStorage.getItem("pycheat:theme") || null
};

/* ---------- Sidebar and counts ---------- */

function buildSidebar() {
  const nav = $("#navList");
  nav.innerHTML = "";
  window.CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "nav-item";
    btn.dataset.filter = cat.id;
    btn.innerHTML = `
      <span class="nav-icon">${cat.emoji}</span>
      <span class="nav-label"></span>
      <span class="nav-count">${cat.items.length}</span>`;
    btn.querySelector(".nav-label").textContent = cat.title;
    btn.addEventListener("click", () => selectFilter(cat.id));
    nav.appendChild(btn);
  });
  $("#countAll").textContent = window.CATEGORIES.reduce((n, c) => n + c.items.length, 0);
  $("#stats").textContent =
    window.CATEGORIES.length + " разделов · " +
    window.CATEGORIES.reduce((n, c) => n + c.items.length, 0) + " карточек";
}

/* ---------- Rendering markdown-lite inside code ---------- */

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function cardHTML(item, cat, q) {
  const fav = state.favs.has(itemCatKey(cat, item));
  let title = escapeHtml(item.t);
  let desc = escapeHtml(item.d || "");
  if (q) {
    title = highlight(title, q);
    desc = highlight(desc, q);
  }
  const code = escapeHtml(item.code);
  return `
    <article class="card">
      <div class="card-head">
        <h3 class="card-title">${title}</h3>
        <button class="star-btn ${fav ? "on" : ""}" data-star title="В избранное">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
        </button>
      </div>
      <p class="card-desc">${desc}</p>
      <div class="code-wrap">
        <button class="copy-btn" data-copy>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          <span>Copy</span>
        </button>
        <pre><code>${code}</code></pre>
      </div>
    </article>`
    .replace(/^ +/gm, ""); // компактнее
}

function itemCatKey(cat, item) {
  return cat.id + "::" + item.t;
}

/* ---------- Highlight ---------- */

function highlight(escaped, q) {
  if (!q) return escaped;
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
  let result = escaped;
  tokens.forEach(t => {
    if (!t) return;
    const safe = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // не подсвечиваем то, что уже внутри <mark>
    result = result.replace(new RegExp(`(${safe})(?!([^<]*?)</mark>)`, "gi"), "<mark>$1</mark>");
  });
  return result;
}

/* ---------- Rendering the main part ---------- */

function matchTokens(item, cat, q) {
  const hay = (item.t + " " + (item.d || "") + " " + item.code + " " + cat.title).toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every(t => hay.includes(t));
}

function render() {
  const results = $("#results");
  const q = state.query.trim();
  let total = 0;

  let cats = window.CATEGORIES;
  if (state.filter !== "all" && state.filter !== "fav") {
    cats = cats.filter(c => c.id === state.filter);
  }

  const html = cats.map(cat => {
    let items = cat.items;
    if (state.filter === "fav") {
      items = items.filter(it => state.favs.has(itemCatKey(cat, it)));
    }
    if (q) {
      items = items.filter(it => matchTokens(it, cat, q));
    }
    if (!items.length) return "";
    total += items.length;
    return `
      <section class="category" id="cat-${cat.id}">
        <h2 class="cat-title"><span class="cat-emoji">${cat.emoji}</span> ${cat.title}</h2>
        <p class="cat-sub">${cat.sub}</p>
        <div class="cards">
          ${items.map(it => cardHTML(it, cat, q)).join("")}
        </div>
      </section>`;
  }).join("");

  results.innerHTML = html;
  $("#empty").hidden = total > 0;
  updateSidebarCounts();
}

/* ---------- Filter selection ---------- */

function selectFilter(id) {
  state.filter = id;
  const btns = $$(".sidebar .nav-item");
  btns.forEach(b => b.classList.toggle("active", b.dataset.filter === id));
  render();
  if (id !== "all") {
    const el = $("#cat-" + id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ---------- Favorites ---------- */

function updateSidebarCounts() {
  $("#countFav").textContent = state.favs.size;
}

function toggleFav(btn) {
  const card = btn.closest(".card");
  const title = card.querySelector(".card-title").textContent;
  const key = title.replace(/^/, ""); // title text
  const catId = card.closest(".category")?.id?.replace("cat-", "") || "";
  const full = catId + "::" + title;
  if (state.favs.has(full)) {
    state.favs.delete(full);
    btn.classList.remove("on");
  } else {
    state.favs.add(full);
    btn.classList.add("on");
  }
  localStorage.setItem("pycheat:favs", JSON.stringify([...state.favs]));
  updateSidebarCounts();
  if (state.filter === "fav") render();
}

/* ---------- Copy ---------- */

function copyCode(btn) {
  const pre = btn.parentElement.querySelector("pre");
  const text = pre.textContent;
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add("done");
    btn.querySelector("span").textContent = "Copied";
    showToast("Скопировано ✓");
    setTimeout(() => {
      btn.classList.remove("done");
      btn.querySelector("span").textContent = "Copy";
    }, 1400);
  }).catch(() => {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove();
    showToast("Скопировано ✓");
  });
}

/* ---------- Toast ---------- */

let toastTimer;
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
}

/* ---------- Theme ---------- */

function applyTheme() {
  let theme = state.theme;
  if (!theme) theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
}

function toggleTheme() {
  const cur = document.documentElement.dataset.theme;
  state.theme = cur === "dark" ? "light" : "dark";
  localStorage.setItem("pycheat:theme", state.theme);
  applyTheme();
}

/* ---------- Handlers ---------- */

function bindEvents() {
  // search
  const search = $("#search");
  search.addEventListener("input", () => {
    state.query = search.value;
    render();
  });

  // keyboard shortcuts
  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      search.focus();
      search.select();
    }
    if (e.key === "Escape" && document.activeElement === search) {
      if (search.value) { search.value = ""; state.query = ""; render(); }
      else search.blur();
    }
  });

  // favorites and theme in header
  $("#favToggle").addEventListener("click", () => {
    const on = document.getElementById("favToggle").classList.toggle("fav-on");
    selectFilter(on ? "fav" : "all");
  });
  $("#themeToggle").addEventListener("click", toggleTheme);

  // sidebar "All"
  $$('.sidebar .nav-item[data-filter="all"], .sidebar .nav-item[data-filter="fav"]').forEach(b =>
    b.addEventListener("click", () => {
      if (b.dataset.filter === "fav" && !$("#favToggle").classList.contains("fav-on")) {
        $("#favToggle").classList.add("fav-on");
      }
      if (b.dataset.filter === "all") {
        $("#favToggle").classList.remove("fav-on");
      }
      selectFilter(b.dataset.filter);
    })
  );

  // copy / favorite via delegation
  $("#results").addEventListener("click", e => {
    const copyBtn = e.target.closest("[data-copy]");
    if (copyBtn) { copyCode(copyBtn); return; }
    const starBtn = e.target.closest("[data-star]");
    if (starBtn) { toggleFav(starBtn); }
  });
}

/* ---------- Start ---------- */

buildSidebar();
applyTheme();
bindEvents();
render();
