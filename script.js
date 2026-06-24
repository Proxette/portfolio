/* =========================================================
   Никита Проксет — портфолио-лендинг
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. Каталог работ ---------- */
  const WORKS = [
    { title: "Lumière",        niche: "Студия маникюра",          url: "https://proxette.github.io/lumiere-nail-studio/" },
    { title: "PREMIUM",        niche: "Натяжные потолки",         url: "https://proxette.github.io/premium-potolki/" },
    { title: "РемонтПро",      niche: "Ремонт квартир под ключ",  url: "https://proxette.github.io/remontpro-msk/" },
    { title: "АЛЬБА",          niche: "Стоматология",             url: "https://proxette.github.io/alba-dental/" },
    { title: "LUMIÈRE",        niche: "Салон красоты",            url: "https://proxette.github.io/lumiere-salon/" },
    { title: "Мария Иванова",  niche: "Фотограф",                 url: "https://proxette.github.io/photographer-landing/" },
    { title: "ÉCRU",           niche: "Интернет-магазин одежды",  url: "https://proxette.github.io/ecru-maison/" },
    { title: "Зелёный Контур", niche: "Ландшафтный дизайн",       url: "https://proxette.github.io/green-kontur-landing/" },
  ];

  const grid = document.getElementById("works-grid");
  if (grid) {
    grid.innerHTML = WORKS.map(function (w) {
      const pretty = w.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
      return (
        '<article class="work-card">' +
          '<a class="work-link" href="' + w.url + '" target="_blank" rel="noopener" aria-label="Открыть ' + w.title + '">' +
            '<div class="browser-bar"><i></i><i></i><i></i><span class="url">' + pretty + '</span></div>' +
            '<div class="work-frame">' +
              '<iframe src="' + w.url + '" title="' + w.title + '" loading="lazy" scrolling="no" tabindex="-1"></iframe>' +
            '</div>' +
            '<div class="work-meta">' +
              '<div><h3>' + w.title + '</h3><div class="work-tag">' + w.niche + '</div></div>' +
              '<svg class="work-arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>' +
            '</div>' +
          '</a>' +
        '</article>'
      );
    }).join("");
  }

  /* ---------- 2. Калькулятор ---------- */
  const typeInputs = document.querySelectorAll('input[name="ctype"]');
  const addonInputs = document.querySelectorAll('#calc-addons input[type="checkbox"]');
  const urgent = document.getElementById("calc-urgent");
  const totalEl = document.getElementById("calc-total");
  const summaryEl = document.getElementById("calc-summary");

  function fmt(n) { return n.toLocaleString("ru-RU"); }

  function getType() {
    const checked = document.querySelector('input[name="ctype"]:checked');
    return checked ? { price: parseInt(checked.value, 10), label: checked.dataset.label } : { price: 0, label: "" };
  }

  function calcState() {
    const type = getType();
    let total = type.price;
    const items = [{ label: type.label, price: type.price }];

    addonInputs.forEach(function (a) {
      if (a.checked) {
        const p = parseInt(a.value, 10);
        total += p;
        items.push({ label: a.dataset.label, price: p });
      }
    });

    const isUrgent = urgent && urgent.checked;
    if (isUrgent) {
      const extra = Math.round(total * 0.4);
      items.push({ label: "Срочный запуск (+40%)", price: extra });
      total += extra;
    }
    return { total: total, items: items, type: type.label, urgent: isUrgent };
  }

  function renderCalc() {
    const s = calcState();
    if (totalEl) totalEl.textContent = fmt(s.total);
    if (summaryEl) {
      summaryEl.innerHTML = s.items.map(function (i) {
        return "<li><span>" + i.label + "</span><b>" + fmt(i.price) + " ₽</b></li>";
      }).join("");
    }
  }

  // info icons → single floating tooltip, clamped to the viewport (works on hover + tap)
  const infos = document.querySelectorAll(".info");
  const tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("role", "tooltip");
  document.body.appendChild(tip);
  let tipOwner = null;

  function hideTip() { tip.classList.remove("show"); tipOwner = null; }
  function showTip(btn) {
    tip.textContent = btn.getAttribute("data-tip") || "";
    tip.style.left = "-9999px";
    tip.style.top = "0px";
    tip.classList.add("show");
    const r = btn.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    const m = 10; // min margin from viewport edge
    let left = r.left + r.width / 2 - t.width / 2;
    left = Math.max(m, Math.min(left, window.innerWidth - t.width - m));
    let top = r.top - t.height - 10;
    if (top < m) top = r.bottom + 10; // flip below if no room above
    tip.style.left = left + "px";
    tip.style.top = top + "px";
    tipOwner = btn;
  }

  infos.forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (tipOwner === b) hideTip(); else showTip(b);
    });
    b.addEventListener("mouseenter", function () { showTip(b); });
    b.addEventListener("mouseleave", function () { if (tipOwner === b) hideTip(); });
  });
  document.addEventListener("click", hideTip);
  window.addEventListener("scroll", hideTip, true);
  window.addEventListener("resize", hideTip);

  typeInputs.forEach(function (i) { i.addEventListener("change", renderCalc); });
  addonInputs.forEach(function (i) { i.addEventListener("change", renderCalc); });
  if (urgent) urgent.addEventListener("change", renderCalc);
  renderCalc();

  /* ---------- 3. «Перенести в заявку» ---------- */
  const toBrief = document.getElementById("calc-to-brief");
  if (toBrief) {
    toBrief.addEventListener("click", function () {
      const s = calcState();
      const map = {
        "Лендинг (одностраничный)": "Лендинг",
        "Премиум-лендинг": "Премиум-лендинг",
        "Многостраничный сайт": "Многостраничный сайт",
        "Интернет-магазин": "Интернет-магазин",
      };
      const typeSel = document.getElementById("f-type");
      if (typeSel && map[s.type]) typeSel.value = map[s.type];

      // отметим домен / хостинг / админку, если выбраны в калькуляторе
      const labels = s.items.map(function (i) { return i.label; });
      const setSel = function (id, on) { const el = document.getElementById(id); if (el) el.value = on ? "Да" : el.value; };
      if (labels.some(function (l) { return /домен/i.test(l); })) setSel("f-domain", true);
      if (labels.some(function (l) { return /хостинг/i.test(l); })) setSel("f-hosting", true);
      const adminSel = document.getElementById("f-admin");
      if (adminSel && labels.some(function (l) { return /админ/i.test(l); })) adminSel.value = "Да, хочу сам редактировать";
      if (s.urgent) { const d = document.getElementById("f-deadline"); if (d) d.value = "Срочно"; }

      const comment = document.getElementById("f-comment");
      if (comment) {
        comment.value = "Интересует: " + s.type + ". Предварительная оценка по калькулятору — от " + fmt(s.total) + " ₽.";
      }
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      const niche = document.getElementById("f-niche");
      if (niche) setTimeout(function () { niche.focus(); }, 500);
    });
  }

  /* ---------- 4. Бриф → Telegram ---------- */
  const TG = "https://t.me/proxette";
  const form = document.getElementById("brief");
  const toast = document.getElementById("toast");

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () { toast.classList.remove("show"); }, 4200);
  }

  function val(id) { const el = document.getElementById(id); return el ? el.value.trim() : ""; }

  function buildBrief() {
    const lines = ["Здравствуйте, Никита! Хочу обсудить проект 👋", ""];
    const add = function (label, v) { if (v) lines.push(label + ": " + v); };
    add("Имя", val("f-name"));
    add("Ниша / проект", val("f-niche"));
    add("Что нужно", val("f-type"));
    add("Домен", val("f-domain"));
    add("Хостинг", val("f-hosting"));
    add("Админ-панель", val("f-admin"));
    add("Бюджет", val("f-budget"));
    add("Сроки", val("f-deadline"));
    add("Комментарий", val("f-comment"));
    return lines.join("\n");
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const niche = document.getElementById("f-niche");
      if (niche && !niche.value.trim()) {
        niche.focus();
        showToast("Заполните, пожалуйста, нишу / описание проекта.");
        return;
      }

      const consent = document.getElementById("f-consent");
      if (consent && !consent.checked) {
        showToast("Отметьте согласие с офертой и политикой конфиденциальности.");
        return;
      }

      const text = buildBrief();
      const openTg = function () { window.open(TG, "_blank", "noopener"); };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showToast("Бриф скопирован ✓ Вставьте его в чат (Ctrl + V).");
          openTg();
        }).catch(function () {
          showToast("Открываю Telegram — напишите мне пару слов о проекте.");
          openTg();
        });
      } else {
        showToast("Открываю Telegram — напишите мне пару слов о проекте.");
        openTg();
      }
    });
  }

  /* ---------- 5. Мобильное меню ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 6. Год в футере ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
