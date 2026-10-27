/* ============================================================
   How-To Guide engine
   ------------------------------------------------------------
   Each lectures/lesson-XX.js file calls:
       registerGuide({ id, title, blurb, recipes: [...] })

   Shapes:
     guide = {
       id: "02",                 // sort key + storage key
       title: "L02: Basic UI Views",
       blurb: "...",
       recipes: [ recipe, ... ]
     }

     recipe = {
       name: "Create a RecyclerView list",
       goal: "what you end up with" (optional),
       tags: ["RecyclerView", ...] (optional),
       steps: [ step, ... ]
     }

     step = {
       do: "short imperative instruction (the click/action)",
       body: [ block, ... ] (optional detail under the step)
     }

     block (one of):
       { p: "text" }                       paragraph (inline `code`, **bold**)
       { list: ["item", ...] }             bullet list
       { code: "source", lang: "java" }    code block (copyable)
       { note: "text" }                    heads-up / why call-out
       { path: "Android Studio > menu" }   literal click path call-out

   Each recipe is collapsible and can be marked done; progress
   is stored per recipe in localStorage.
   ============================================================ */

(function () {
  "use strict";

  const GUIDES = [];
  window.registerGuide = function (g) { GUIDES.push(g); };

  const STORE_KEY = "wrpv302-howto-progress";

  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }
  let progress = loadProgress();

  function recipeKey(guideId, recipeIdx) { return guideId + "::" + recipeIdx; }
  function isDone(key) { return !!progress[key]; }
  function setDone(key, val) {
    if (val) progress[key] = 1; else delete progress[key];
    saveProgress(progress);
  }

  // ---------- inline formatting ----------
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function fmt(text) {
    return esc(text)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  let current = null;

  // ---------- rendering ----------
  function render(guide) {
    current = guide;
    const main = document.getElementById("main");
    main.innerHTML = "";

    const header = document.createElement("div");
    header.className = "ls-header";
    header.innerHTML =
      "<h2>" + fmt(guide.title) + "</h2>" +
      "<p>" + fmt(guide.blurb || "") + "</p>";
    main.appendChild(header);

    const bar = document.createElement("div");
    bar.className = "progress-wrap";
    bar.innerHTML =
      '<div class="progress-track"><div class="progress-fill" id="progFill"></div></div>' +
      '<span class="progress-label" id="progLabel"></span>' +
      '<button class="btn ghost small" id="resetProg">Reset</button>';
    main.appendChild(bar);

    document.getElementById("resetProg").onclick = () => {
      guide.recipes.forEach((_, ri) => setDone(recipeKey(guide.id, ri), false));
      render(guide);
    };

    guide.recipes.forEach((recipe, ri) => main.appendChild(renderRecipe(guide, recipe, ri)));

    updateProgress();
    main.scrollIntoView({ block: "start" });
  }

  function renderRecipe(guide, recipe, recipeIdx) {
    const key = recipeKey(guide.id, recipeIdx);
    const el = document.createElement("div");
    el.className = "recipe" + (isDone(key) ? " done" : "");

    // header
    const head = document.createElement("div");
    head.className = "recipe-head";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "recipe-check";
    check.checked = isDone(key);
    check.title = "Mark recipe done";
    check.addEventListener("click", (e) => e.stopPropagation());
    check.addEventListener("change", () => {
      setDone(key, check.checked);
      el.classList.toggle("done", check.checked);
      updateProgress();
    });

    const titleWrap = document.createElement("div");
    titleWrap.className = "recipe-title-wrap";
    let inner = '<span class="recipe-name">' + fmt(recipe.name) + "</span>";
    if (recipe.tags && recipe.tags.length) {
      inner += '<div class="recipe-tags">' +
        recipe.tags.map((t) => '<span class="tag">' + esc(t) + "</span>").join("") +
        "</div>";
    }
    titleWrap.innerHTML = inner;

    const chevron = document.createElement("span");
    chevron.className = "recipe-chevron";
    chevron.textContent = "\u25BC";

    head.appendChild(check);
    head.appendChild(titleWrap);
    head.appendChild(chevron);

    // body
    const body = document.createElement("div");
    body.className = "recipe-body";

    if (recipe.goal) {
      const goal = document.createElement("div");
      goal.className = "recipe-goal";
      goal.innerHTML = '<span class="goal-label">You will build</span>' + fmt(recipe.goal);
      body.appendChild(goal);
    }

    const ol = document.createElement("ol");
    ol.className = "steps";
    (recipe.steps || []).forEach((step) => ol.appendChild(renderStep(step)));
    body.appendChild(ol);

    head.addEventListener("click", () => el.classList.toggle("collapsed"));

    el.appendChild(head);
    el.appendChild(body);
    return el;
  }

  function renderStep(step) {
    const li = document.createElement("li");
    li.className = "step";

    const doLine = document.createElement("div");
    doLine.className = "step-do";
    doLine.innerHTML = fmt(step.do);
    li.appendChild(doLine);

    (step.body || []).forEach((block) => li.appendChild(renderBlock(block)));
    return li;
  }

  function renderBlock(block) {
    if (block.p !== undefined) {
      const p = document.createElement("p");
      p.className = "blk-p";
      p.innerHTML = fmt(block.p);
      return p;
    }
    if (block.list !== undefined) {
      const ul = document.createElement("ul");
      ul.className = "blk-list";
      block.list.forEach((item) => {
        const liEl = document.createElement("li");
        liEl.innerHTML = fmt(item);
        ul.appendChild(liEl);
      });
      return ul;
    }
    if (block.note !== undefined) {
      const d = document.createElement("div");
      d.className = "callout note";
      d.innerHTML = '<span class="callout-label">Heads up</span>' + fmt(block.note);
      return d;
    }
    if (block.path !== undefined) {
      const d = document.createElement("div");
      d.className = "callout path";
      d.innerHTML = '<span class="callout-label">Click</span>' + fmt(block.path);
      return d;
    }
    if (block.code !== undefined) {
      return renderCode(block.code, block.lang || "java");
    }
    return document.createElement("div");
  }

  function renderCode(source, lang) {
    const wrap = document.createElement("div");
    wrap.className = "code-wrap";

    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.type = "button";
    btn.textContent = "Copy";
    btn.addEventListener("click", () => {
      copyText(source).then(
        () => { btn.textContent = "Copied"; setTimeout(() => (btn.textContent = "Copy"), 1200); },
        () => { btn.textContent = "Press Ctrl+C"; }
      );
    });

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    code.className = "lang-" + lang;
    code.textContent = source;
    pre.appendChild(code);

    wrap.appendChild(btn);
    wrap.appendChild(pre);
    return wrap;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      try {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta); resolve();
      } catch (e) { reject(e); }
    });
  }

  // ---------- progress ----------
  function countRecipes(guide) {
    let total = guide.recipes.length, done = 0;
    guide.recipes.forEach((_, ri) => { if (isDone(recipeKey(guide.id, ri))) done++; });
    return { total, done };
  }

  function updateProgress() {
    if (!current) return;
    const { total, done } = countRecipes(current);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const fill = document.getElementById("progFill");
    const label = document.getElementById("progLabel");
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = done + " / " + total + " recipes done";
    const navCount = document.getElementById("navcount-" + current.id);
    if (navCount) navCount.textContent = done + "/" + total;
  }

  // ---------- navigation ----------
  function buildNav() {
    const navList = document.getElementById("navList");
    navList.innerHTML = "";
    GUIDES.forEach((guide, i) => {
      const { total, done } = countRecipes(guide);
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.className = "nav-btn" + (i === 0 ? " active" : "");
      btn.innerHTML =
        "<span>" + fmt(guide.title) + "</span>" +
        '<span class="count" id="navcount-' + guide.id + '">' + done + "/" + total + "</span>";
      btn.onclick = () => {
        document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        render(guide);
        closeNav();
      };
      li.appendChild(btn);
      navList.appendChild(li);
    });
  }

  // ---------- mobile nav ----------
  function openNav() {
    document.body.classList.add("nav-open");
    const t = document.getElementById("menuToggle");
    const b = document.getElementById("backdrop");
    if (t) t.setAttribute("aria-expanded", "true");
    if (b) b.hidden = false;
  }
  function closeNav() {
    document.body.classList.remove("nav-open");
    const t = document.getElementById("menuToggle");
    const b = document.getElementById("backdrop");
    if (t) t.setAttribute("aria-expanded", "false");
    if (b) b.hidden = true;
  }
  function setupMobileNav() {
    const toggle = document.getElementById("menuToggle");
    const backdrop = document.getElementById("backdrop");
    if (toggle) toggle.addEventListener("click", () => {
      document.body.classList.contains("nav-open") ? closeNav() : openNav();
    });
    if (backdrop) backdrop.addEventListener("click", closeNav);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });
    window.addEventListener("resize", () => { if (window.innerWidth > 720) closeNav(); });
  }

  window.addEventListener("DOMContentLoaded", function () {
    setupMobileNav();
    if (!GUIDES.length) {
      document.getElementById("main").innerHTML =
        '<p class="empty-state">No guides loaded. Check the script includes in index.html.</p>';
      return;
    }
    GUIDES.sort((a, b) => a.id.localeCompare(b.id));
    buildNav();
    render(GUIDES[0]);
  });
})();
