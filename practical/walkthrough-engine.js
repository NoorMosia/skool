/* ============================================================
   Practical walkthrough engine
   ------------------------------------------------------------
   Each walkthroughs/<id>.js file calls:
       registerWalkthrough({ id, title, blurb, sections: [...] })

   Shapes:
     walkthrough = {
       id: "1-server",            // sort key + storage key
       title: "...",
       blurb: "...",
       sections: [ section, ... ]
     }

     section = {
       id: "s1",                  // unique within the walkthrough
       title: "...",
       intro: "markdown-lite string" (optional),
       steps: [ step, ... ]
     }

     step = {
       title: "...",
       tags: ["L09 Networking", ...] (optional concept tags),
       body: [ block, ... ]
     }

     block (one of):
       { p: "text" }                              paragraph (inline `code` + **bold**)
       { note: "text" }                           call-out ("why this matters")
       { scaffold: "text" }                       scaffolding call-out (not examinable)
       { code: "source", lang: "java" }           copyable code block
       { list: ["item", ...] }                    bullet list
       { file: "path/Name.java" }                 filename label above the next code block

   Progress (per step done) is kept in localStorage.
   ============================================================ */

(function () {
  "use strict";

  const WALKTHROUGHS = [];
  window.registerWalkthrough = function (w) { WALKTHROUGHS.push(w); };

  const STORE_KEY = "wrpv302-practical-progress";

  // ---------- progress persistence ----------
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }
  let progress = loadProgress();

  function stepKey(wId, sId, idx) { return wId + "::" + sId + "::" + idx; }
  function isDone(key) { return !!progress[key]; }
  function setDone(key, val) {
    if (val) progress[key] = 1; else delete progress[key];
    saveProgress(progress);
  }

  // ---------- inline formatting ----------
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  // `code` and **bold** on already-escaped text
  function fmt(text) {
    return esc(text)
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  }

  let current = null;

  // ---------- rendering ----------
  function render(w) {
    current = w;
    const main = document.getElementById("main");
    main.innerHTML = "";

    const header = document.createElement("div");
    header.className = "wt-header";
    header.innerHTML =
      "<h2>" + fmt(w.title) + "</h2>" +
      "<p>" + fmt(w.blurb || "") + "</p>";
    main.appendChild(header);

    // progress bar for this walkthrough
    const bar = document.createElement("div");
    bar.className = "progress-wrap";
    bar.innerHTML =
      '<div class="progress-track"><div class="progress-fill" id="progFill"></div></div>' +
      '<span class="progress-label" id="progLabel"></span>' +
      '<button class="btn ghost small" id="resetProg">Reset progress</button>';
    main.appendChild(bar);

    document.getElementById("resetProg").onclick = () => {
      w.sections.forEach((s) =>
        s.steps.forEach((_, i) => setDone(stepKey(w.id, s.id, i), false))
      );
      render(w);
    };

    w.sections.forEach((section) => main.appendChild(renderSection(w, section)));

    updateProgress();
    main.scrollIntoView({ block: "start" });
  }

  function renderSection(w, section) {
    const wrap = document.createElement("section");
    wrap.className = "wt-section";

    const h = document.createElement("h3");
    h.className = "wt-section-title";
    h.innerHTML = fmt(section.title);
    wrap.appendChild(h);

    if (section.intro) {
      const intro = document.createElement("p");
      intro.className = "wt-section-intro";
      intro.innerHTML = fmt(section.intro);
      wrap.appendChild(intro);
    }

    section.steps.forEach((step, idx) =>
      wrap.appendChild(renderStep(w, section, step, idx))
    );
    return wrap;
  }

  function renderStep(w, section, step, idx) {
    const key = stepKey(w.id, section.id, idx);
    const card = document.createElement("div");
    card.className = "step" + (isDone(key) ? " done" : "");
    card.dataset.key = key;

    // header (click to collapse/expand)
    const head = document.createElement("div");
    head.className = "step-head";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "step-check";
    check.checked = isDone(key);
    check.title = "Mark step done";
    check.addEventListener("click", (e) => e.stopPropagation());
    check.addEventListener("change", () => {
      setDone(key, check.checked);
      card.classList.toggle("done", check.checked);
      updateProgress();
    });

    const titleWrap = document.createElement("div");
    titleWrap.className = "step-title-wrap";
    titleWrap.innerHTML =
      '<span class="step-num">Step ' + (idx + 1) + "</span>" +
      '<span class="step-title">' + fmt(step.title) + "</span>";

    if (step.tags && step.tags.length) {
      const tags = document.createElement("div");
      tags.className = "step-tags";
      step.tags.forEach((t) => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = t;
        tags.appendChild(tag);
      });
      titleWrap.appendChild(tags);
    }

    const chevron = document.createElement("span");
    chevron.className = "step-chevron";
    chevron.textContent = "\u25BC";

    head.appendChild(check);
    head.appendChild(titleWrap);
    head.appendChild(chevron);

    const body = document.createElement("div");
    body.className = "step-body";
    (step.body || []).forEach((block) => body.appendChild(renderBlock(block)));

    head.addEventListener("click", () => card.classList.toggle("collapsed"));

    card.appendChild(head);
    card.appendChild(body);
    return card;
  }

  function renderBlock(block) {
    if (block.p !== undefined) {
      const p = document.createElement("p");
      p.className = "blk-p";
      p.innerHTML = fmt(block.p);
      return p;
    }
    if (block.note !== undefined) {
      const d = document.createElement("div");
      d.className = "callout note";
      d.innerHTML = '<span class="callout-label">Why</span>' + fmt(block.note);
      return d;
    }
    if (block.scaffold !== undefined) {
      const d = document.createElement("div");
      d.className = "callout scaffold";
      d.innerHTML = '<span class="callout-label">Scaffolding</span>' + fmt(block.scaffold);
      return d;
    }
    if (block.list !== undefined) {
      const ul = document.createElement("ul");
      ul.className = "blk-list";
      block.list.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = fmt(item);
        ul.appendChild(li);
      });
      return ul;
    }
    if (block.file !== undefined) {
      const f = document.createElement("div");
      f.className = "file-label";
      f.textContent = block.file;
      return f;
    }
    if (block.code !== undefined) {
      return renderCode(block.code, block.lang || "java");
    }
    const unknown = document.createElement("div");
    return unknown;
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
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (e) { reject(e); }
    });
  }

  // ---------- progress bar ----------
  function updateProgress() {
    if (!current) return;
    let total = 0, done = 0;
    current.sections.forEach((s) =>
      s.steps.forEach((_, i) => {
        total++;
        if (isDone(stepKey(current.id, s.id, i))) done++;
      })
    );
    const pct = total ? Math.round((done / total) * 100) : 0;
    const fill = document.getElementById("progFill");
    const label = document.getElementById("progLabel");
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = done + " / " + total + " steps";
    // reflect per-walkthrough completion in the nav
    const navCount = document.getElementById("navcount-" + current.id);
    if (navCount) navCount.textContent = done + "/" + total;
  }

  // ---------- navigation ----------
  function buildNav() {
    const navList = document.getElementById("navList");
    navList.innerHTML = "";
    WALKTHROUGHS.forEach((w, i) => {
      let total = 0, done = 0;
      w.sections.forEach((s) =>
        s.steps.forEach((_, j) => {
          total++;
          if (isDone(stepKey(w.id, s.id, j))) done++;
        })
      );
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.className = "nav-btn" + (i === 0 ? " active" : "");
      btn.innerHTML =
        "<span>" + fmt(w.title) + "</span>" +
        '<span class="count" id="navcount-' + w.id + '">' + done + "/" + total + "</span>";
      btn.onclick = () => {
        document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        render(w);
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
    if (!WALKTHROUGHS.length) {
      document.getElementById("main").innerHTML =
        '<p class="empty-state">No walkthroughs loaded. Check the script includes in index.html.</p>';
      return;
    }
    WALKTHROUGHS.sort((a, b) => a.id.localeCompare(b.id));
    buildNav();
    render(WALKTHROUGHS[0]);
  });
})();
