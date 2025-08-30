const LS_KEY = "edumarket_items_v1";
const LS_WALLET = "edumarket_wallet_v1";

const sample = [
  { id: 1, title: "Mikroiqtisod darsligi (yangi holat)", cat: "kitob", price: 70000, loc: "Toshkent, Chilonzor", rating: 4.8, img: "📕", tags: ["Sifatli", "Talabgor"] },
  { id: 2, title: "Core i5 noutbuk (8GB/256GB)", cat: "elektronika", price: 3200000, loc: "Samarqand", rating: 4.6, img: "💻", tags: ["Ish holati a'lo"] },
  { id: 3, title: "Matematika repetitor (1 soat)", cat: "xizmat", price: 60000, loc: "Farg‘ona", rating: 4.9, img: "👨‍🏫", tags: ["Zoom", "Dars tayyorlash"] },
  { id: 4, title: "Iqtisod nazariyasi konspekt to‘plami (PDF)", cat: "konspekt", price: 25000, loc: "Onlayn", rating: 4.7, img: "📝", tags: ["PDF", "Tayyor testlar"] },
  { id: 5, title: "Kalkulyator Casio fx-991ES", cat: "elektronika", price: 180000, loc: "Andijon", rating: 4.5, img: "🧮", tags: ["Original"] },
  { id: 6, title: "Ingliz tili speaking klubi (oylik)", cat: "xizmat", price: 350000, loc: "Toshkent", rating: 4.4, img: "🗣️", tags: ["Offline/Online"] },
];

function readItems() {
  const x = localStorage.getItem(LS_KEY);
  return x ? JSON.parse(x) : [...sample];
}
function writeItems(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}
function getWallet() {
  const v = localStorage.getItem(LS_WALLET);
  return v ? JSON.parse(v) : { points: 20, badges: [] };
}
function setWallet(w) { localStorage.setItem(LS_WALLET, JSON.stringify(w)); }

const grid = document.getElementById("grid");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categories = document.getElementById("categories");
const sortSelect = document.getElementById("sortSelect");
const walletPoints = document.getElementById("walletPoints");
const postBtn = document.getElementById("postBtn");
const ctaPost = document.getElementById("ctaPost");
const ctaBrowse = document.getElementById("ctaBrowse");

const postModal = document.getElementById("postModal");
const closeModal = document.getElementById("closeModal");
const cancelPost = document.getElementById("cancelPost");
const savePost = document.getElementById("savePost");
const pTitle = document.getElementById("pTitle");
const pCat = document.getElementById("pCat");
const pPrice = document.getElementById("pPrice");
const pLoc = document.getElementById("pLoc");
const pDesc = document.getElementById("pDesc");
const pImg = document.getElementById("pImg");

let st = { items: readItems(), q: "", cat: "all", sort: "new" };

function fileToDataUrl(file) {
  return new Promise((ok, bad) => {
    const r = new FileReader();
    r.onload = () => ok(r.result);
    r.onerror = bad;
    r.readAsDataURL(file);
  });
}

function esc(s) {
  return (s || "").replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}
function money(n) {
  try { return new Intl.NumberFormat('uz-UZ').format(n) + " so‘m"; }
  catch (_) { return n + " UZS"; }
}

function render() {
  walletPoints.textContent = getWallet().points;

  let arr = [...st.items];
  if (st.cat !== "all") arr = arr.filter(i => i.cat === st.cat);
  if (st.q.trim()) {
    const q = st.q.toLowerCase();
    arr = arr.filter(i =>
      (i.title || "").toLowerCase().includes(q) ||
      (i.loc || "").toLowerCase().includes(q) ||
      (i.tags || []).some(t => (t || "").toLowerCase().includes(q))
    );
  }

  if (st.sort === "cheap") arr.sort((a, b) => a.price - b.price);
  else if (st.sort === "exp") arr.sort((a, b) => b.price - a.price);
  else if (st.sort === "rating") arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else arr.sort((a, b) => (b.id || 0) - (a.id || 0));

  grid.innerHTML = "";
  if (arr.length === 0) {
    emptyState?.classList?.remove("hide");
    return;
  } else emptyState?.classList?.add("hide");

  arr.forEach(i => {

    const thumb = i.imgUrl
      ? `<img src="${i.imgUrl}" alt="rasm">`
      : `${esc(i.img || "📦")}`;

    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <div class="thumb">${thumb}</div>
      <div class="content">
        <div class="title">${esc(i.title)}</div>
        <div class="meta">
          <span class="price">${money(i.price)}</span> •
          <span>${esc(i.loc || "Onlayn")}</span> •
          <span>⭐ ${i.rating?.toFixed ? i.rating.toFixed(1) : (i.rating || "—")}</span>
        </div>
        <div class="tags">${(i.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <div class="act">
          <a href="https://t.me/Jamshid_frontend" class="btn" target="_blank">Bog‘lanish</a>
          <button class="btn ghost">Saqlash</button>
        </div>
      </div>
    `;
    grid.appendChild(el);
  });
}

categories?.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  [...categories.querySelectorAll(".chip")].forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  st.cat = btn.dataset.cat;
  render();
});

searchBtn?.addEventListener("click", () => {
  st.q = searchInput.value;
  render();
});
searchInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { st.q = searchInput.value; render(); }
});

sortSelect?.addEventListener("change", () => {
  st.sort = sortSelect.value;
  render();
});

function openModal() { postModal.classList.remove("hide"); }
function closeModalFn() { postModal.classList.add("hide"); }
postBtn?.addEventListener("click", openModal);
ctaPost?.addEventListener("click", openModal);
document.getElementById("cancelPost")?.addEventListener("click", closeModalFn);
document.getElementById("closeModal")?.addEventListener("click", closeModalFn);
postModal?.addEventListener("click", (e) => { if (e.target === postModal) closeModalFn(); });

ctaBrowse?.addEventListener("click", () => {
  const g = document.querySelector("#grid");
  if (g) window.scrollTo({ top: g.offsetTop - 80, behavior: "smooth" });
});

savePost?.addEventListener("click", async () => {
  const title = pTitle.value.trim();
  const cat = pCat.value;
  const price = Number(pPrice.value || 0);
  const loc = pLoc.value.trim();
  const desc = pDesc.value.trim();

  if (!title || !price) {
    alert("Nomi va narx majburiy.");
    return;
  }

  let imgUrl = null;
  if (pImg.files && pImg.files[0]) {
    try {
      imgUrl = await fileToDataUrl(pImg.files[0]);
    } catch (_) {
      imgUrl = null;
    }
  }

  const items = readItems();
  const id = Math.max(0, ...items.map(i => i.id || 0)) + 1;

  const newItem = {
    id, title, cat, price, loc,
    rating: 4.5,
    imgUrl, 
    tags: ["Yangi e’lon"],
    desc
  };
  items.push(newItem);
  writeItems(items);

  const w = getWallet();
  w.points += 5;
  if (w.points >= 50 && !w.badges.includes("Seller Lv.1")) w.badges.push("Seller Lv.1");
  if (w.points >= 100 && !w.badges.includes("Top Helper")) w.badges.push("Top Helper");
  setWallet(w);

  pTitle.value = ""; pPrice.value = ""; pLoc.value = ""; pDesc.value = ""; pImg.value = "";
  st.items = items;
  render();
  closeModalFn();

  toast("E’lon qo‘shildi! 💫 Rasm ham saqlandi.");
});

function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  Object.assign(t.style, {
    position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
    background: "#0b1128", color: "#fff", border: "1px solid rgba(255,255,255,.18)",
    padding: "10px 14px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,.5)",
    zIndex: 1000
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

// init
(function () {
  st.items = readItems();
  render();
})();


// app.js — yagona, toza, to'liq ishlaydigan versiya
document.addEventListener("DOMContentLoaded", () => {
  // ============ Konfiguratsiya / storage kalitlari ============
  const LS_KEY = "edumarket_items_v1";
  const LS_WALLET = "edumarket_wallet_v1";

  const sample = [
    { id: 1, title: "Mikroiqtisod darsligi (yangi holat)", cat: "kitob", price: 70000, loc: "Toshkent, Chilonzor", rating: 4.8, img: "📕", tags: ["Sifatli", "Talabgor"] },
    { id: 2, title: "Core i5 noutbuk (8GB/256GB)", cat: "elektronika", price: 3200000, loc: "Samarqand", rating: 4.6, img: "💻", tags: ["Ish holati a'lo"] },
    { id: 3, title: "Matematika repetitor (2 soat)", cat: "xizmat", price: 60000, loc: "Farg‘ona", rating: 4.9, img: "👨‍🏫", tags: ["Zoom", "Dars tayyorlash"] },
    { id: 4, title: "Iqtisod nazariyasi konspekt to‘plami (PDF)", cat: "konspekt", price: 25000, loc: "Onlayn", rating: 4.7, img: "📝", tags: ["PDF", "Tayyor testlar"] },
    { id: 5, title: "Kalkulyator Casio fx-991ES", cat: "elektronika", price: 180000, loc: "Andijon", rating: 4.5, img: "🧮", tags: ["Original"] },
    { id: 6, title: "Ingliz tili speaking klubi (oylik)", cat: "xizmat", price: 350000, loc: "Toshkent", rating: 4.4, img: "🗣", tags: ["Offline/Online"] },
  ];

  function readItems() {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [...sample];
  }
  function writeItems(items) {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }

  function getWallet() {
    const v = localStorage.getItem(LS_WALLET);
    return v ? JSON.parse(v) : { points: 20, badges: [] };
  }
  function setWallet(w) { localStorage.setItem(LS_WALLET, JSON.stringify(w)); }

  // ============ Elementlar (HTML bilan mos) ============
  const grid = document.getElementById("grid");
  const emptyState = document.getElementById("emptyState");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const categories = document.getElementById("categories");
  const sortSelect = document.getElementById("sortSelect");
  const walletPoints = document.getElementById("walletPoints");
  const postBtn = document.getElementById("postBtn");
  const ctaPost = document.getElementById("ctaPost");
  const ctaBrowse = document.getElementById("ctaBrowse");

  // Modal elementlar (HTML'dagi id'lar bilan)
  const postModal = document.getElementById("postModal");
  const closeModal = document.getElementById("closeModal");
  const cancelPost = document.getElementById("cancelPost");
  const savePost = document.getElementById("savePost");
  const pTitle = document.getElementById("pTitle");
  const pCat = document.getElementById("pCat");
  const pPrice = document.getElementById("pPrice");
  const pLoc = document.getElementById("pLoc");
  const pDesc = document.getElementById("pDesc");
  const pImg = document.getElementById("pImg");
  const pTg = document.getElementById("pTg");

  // state
  let state = {
    items: readItems(),
    q: "",
    cat: "all",
    sort: "new"
  };

  // ============ yordamchi funksiyalar ============
  function formatUZS(n) {
    try { return new Intl.NumberFormat('uz-UZ').format(n) + " so‘m"; }
    catch (e) { return n + " UZS"; }
  }
  function escapeHtml(s) {
    return (s || "").replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  }

  // Telegram username validatsiyasi (5–32 belgidan iborat: harf, raqam, underscore)
  function isValidTgUsername(tg) {
    if (!tg) return false;
    tg = tg.trim();
    if (tg.startsWith("@")) tg = tg.slice(1);
    return /^[A-Za-z0-9_]{5,32}$/.test(tg);
  }

  // ============ render (bitta, markaziy) ============
  function render() {
    // wallet
    walletPoints.textContent = getWallet().points;

    

    // filter
    let items = [...state.items];
    if (state.cat !== "all") items = items.filter(i => i.cat === state.cat);
    if (state.q.trim()) {
      const q = state.q.toLowerCase();
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        (i.loc || "").toLowerCase().includes(q) ||
        (i.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    // sort
    if (state.sort === "cheap") items.sort((a, b) => a.price - b.price);
    else if (state.sort === "exp") items.sort((a, b) => b.price - a.price);
    else if (state.sort === "rating") items.sort((a, b) => b.rating - a.rating);
    else items.sort((a, b) => b.id - a.id); // new

    grid.innerHTML = "";
    if (items.length === 0) {
      emptyState.classList.remove("hide");
      return;
    } else {
      emptyState.classList.add("hide");
    }

    items.forEach(i => {
      const el = document.createElement("div");
      el.className = "card";
      // sanitize username for href
      const safeTg = i.tg ? encodeURIComponent((i.tg || "").replace(/^@/, "")) : "";
      const href = safeTg ? `https://t.me/${safeTg}` : `https://t.me/edumarket_alg`;

      el.innerHTML = `
        <div class="thumb">${i.img || "📦"}</div>
        <div class="content">
          <div class="title">${escapeHtml(i.title)}</div>
          <div class="meta">
            <span class="price">${formatUZS(i.price)}</span> •
            <span>${escapeHtml(i.loc || "Onlayn")}</span> •
            <span>⭐️ ${i.rating?.toFixed(1) || "—"}</span>
          </div>
          <div class="tags">${(i.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}</div>
          <div class="act">
            <a class="btn" href="${href}" target="_blank" rel="noopener noreferrer">Bog‘lanish</a>
            <button class="btn ghost btn-save">Saqlash</button>
          </div>
        </div>
      `;
      grid.appendChild(el);
    });
  }

  // ============ Events (filter/search/sort/modal) ============
  // Category chips
  categories.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    [...categories.querySelectorAll(".chip")].forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    state.cat = btn.dataset.cat;
    render();
  });

  // Search
  searchBtn.addEventListener("click", () => {
    state.q = searchInput.value;
    render();
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { state.q = searchInput.value; render(); }
  });

  // Sort
  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    render();
  });

  // Modal open/close
  function openModal() { postModal.classList.remove("hide"); }
  function closeModalFn() { postModal.classList.add("hide"); }
  postBtn.addEventListener("click", openModal);
  ctaPost.addEventListener("click", openModal);
  cancelPost.addEventListener("click", closeModalFn);
  closeModal.addEventListener("click", closeModalFn);
  postModal.addEventListener("click", (e) => { if (e.target === postModal) closeModalFn(); });

  // CTA browse
  ctaBrowse.addEventListener("click", () => {
    const el = document.querySelector("#grid");
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  });

  // ============ Save post (posting) ============
  savePost.addEventListener("click", () => {
    const title = pTitle.value.trim();
    const cat = pCat.value;
    const price = Number(pPrice.value || 0);
    const loc = pLoc.value.trim();
    let tg = pTg.value.trim();
    const desc = pDesc.value.trim();

    // minimal validation: title, price, tg
    if (!title || !price || !tg) {
      alert("Nomi, telegrami va narxi majburiy.");
      return;
    }

    // remove @ if foydalanuvchi kiritsa
    if (tg.startsWith("@")) tg = tg.slice(1);

    // validate tg format (simple)
    if (!isValidTgUsername(tg)) {
      if (!confirm("Kiritilgan username formatga mos emas. Shunga qaramay davom etilsinmi?")) return;
    }

    

    let imgEmoji = "📦";
    if (pImg.files && pImg.files[0]) imgEmoji = "📷";

    const items = readItems();
    const id = Math.max(0, ...items.map(i => i.id || 0)) + 1;
    const newItem = { id, title, cat, price, loc, tg, rating: 4.5, img: imgEmoji, tags: ["Yangi e’lon"], desc };
    items.push(newItem);
    writeItems(items);

    // wallet points + badges
    const w = getWallet();
    w.points += 5; // posting bonus
    if (w.points >= 50 && !w.badges.includes("Seller Lv.1")) w.badges.push("Seller Lv.1");
    if (w.points >= 100 && !w.badges.includes("Top Helper")) w.badges.push("Top Helper");
    setWallet(w);

    // reset form
    pTitle.value = ""; pPrice.value = ""; pLoc.value = ""; pTg.value = ""; pDesc.value = ""; pImg.value = "";

    // update state + render + close modal + toast
    state.items = items;
    render();
    closeModalFn();
    toast("E’lon qo‘shildi! 💫 5 bonus ball qo‘shildi.");
  });

  // toast
  function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    Object.assign(t.style, {
      position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
      background: "#0b1128", color: "#fff", border: "1px solid rgba(255,255,255,.18)",
      padding: "10px 14px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,.5)",
      zIndex: 1000
    });
    document.body.appendChild(t);
    setTimeout(() => { t.remove(); }, 2200);
  }

  // init
  (function init() {
    state.items = readItems();
    render();
  })();
});
