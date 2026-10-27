/* ============================================================
   Quiz engine
   ------------------------------------------------------------
   Each questions/lecture-XX.js file calls:
       registerLecture({ id, title, blurb, questions: [...] })

   Question object shapes:
     fill   : { type:'fill',  prompt, blanks:[ [accepted...], ... ], explanation? }
              - prompt contains one {{blank}} token per blank, in order.
     mcq    : { type:'mcq',   prompt, options:[...], answer: <index>, explanation? }
     multi  : { type:'multi', prompt, options:[...], answers:[<index>...], explanation? }
     tf     : { type:'tf',    prompt, answer: true|false, explanation? }

   Scoring is secondary; the point is to reveal correct answers.
   ============================================================ */

(function () {
  "use strict";

  const LECTURES = [];
  window.registerLecture = function (lecture) {
    LECTURES.push(lecture);
  };

  const TYPE_LABELS = {
    fill: "Fill in the blank",
    mcq: "Multiple choice",
    multi: "Multi-select",
    tf: "True / False",
  };

  // Minimal, safe-ish inline formatting: `code` spans only.
  function fmt(text) {
    const escaped = String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function normalize(s) {
    return String(s).trim().toLowerCase().replace(/\s+/g, " ");
  }

  let current = null; // current lecture object
  const state = {};   // questionId -> user response

  // ---------- rendering ----------

  function render(lecture) {
    current = lecture;
    Object.keys(state).forEach((k) => delete state[k]);

    const main = document.getElementById("main");
    main.innerHTML = "";

    const header = document.createElement("div");
    header.className = "section-header";
    header.innerHTML =
      "<h2>" + fmt(lecture.title) + "</h2>" +
      "<p>" + fmt(lecture.blurb || "") + " &middot; " +
      lecture.questions.length + " questions</p>";
    main.appendChild(header);

    if (!lecture.questions.length) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Questions for this lecture haven't been added yet.";
      main.appendChild(empty);
      main.scrollIntoView({ block: "start" });
      return;
    }

    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";
    toolbar.innerHTML =
      '<button class="btn" id="checkBtn">Check answers</button>' +
      '<button class="btn secondary" id="revealBtn">Show all answers</button>' +
      '<button class="btn ghost" id="resetBtn">Reset</button>' +
      '<span class="score-pill" id="scorePill"></span>';
    main.appendChild(toolbar);

    const list = document.createElement("div");
    list.id = "qlist";
    main.appendChild(list);

    lecture.questions.forEach((q, i) => {
      q._id = lecture.id + "-" + i;
      list.appendChild(renderQuestion(q, i + 1));
    });

    document.getElementById("checkBtn").onclick = () => checkAll(false);
    document.getElementById("revealBtn").onclick = () => checkAll(true);
    document.getElementById("resetBtn").onclick = () => render(lecture);

    main.scrollIntoView({ block: "start" });
  }

  function renderQuestion(q, number) {
    const card = document.createElement("div");
    card.className = "q-card";
    card.id = "card-" + q._id;

    const head = document.createElement("div");
    head.className = "q-head";
    head.innerHTML =
      '<span class="q-num">Q' + number + "</span>" +
      '<span class="q-type">' + (TYPE_LABELS[q.type] || q.type) + "</span>" +
      '<span class="verdict" id="verdict-' + q._id + '"></span>';
    card.appendChild(head);

    const body = document.createElement("div");
    if (q.type === "fill") body.appendChild(renderFill(q));
    else if (q.type === "mcq") body.appendChild(renderChoice(q, false));
    else if (q.type === "multi") body.appendChild(renderChoice(q, true));
    else if (q.type === "tf") body.appendChild(renderTF(q));
    card.appendChild(body);

    const ans = document.createElement("div");
    ans.className = "answer-box";
    ans.id = "answer-" + q._id;
    card.appendChild(ans);

    return card;
  }

  function renderFill(q) {
    const wrap = document.createElement("div");
    const parts = String(q.prompt).split("{{blank}}");
    const prompt = document.createElement("p");
    prompt.className = "q-prompt";

    state[q._id] = [];
    parts.forEach((part, idx) => {
      prompt.insertAdjacentHTML("beforeend", fmt(part));
      if (idx < parts.length - 1) {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "fill-input";
        input.autocomplete = "off";
        input.dataset.blank = idx;
        input.placeholder = "answer " + (idx + 1);
        input.addEventListener("input", () => {
          state[q._id][idx] = input.value;
        });
        prompt.appendChild(input);
      }
    });
    wrap.appendChild(prompt);
    return wrap;
  }

  function renderChoice(q, multi) {
    const wrap = document.createElement("div");
    const prompt = document.createElement("p");
    prompt.className = "q-prompt";
    prompt.innerHTML = fmt(q.prompt);
    wrap.appendChild(prompt);

    if (multi) {
      const hint = document.createElement("p");
      hint.className = "q-hint";
      hint.textContent = "Select all that apply.";
      wrap.appendChild(hint);
    }

    const opts = document.createElement("div");
    opts.className = "options";
    state[q._id] = multi ? [] : null;

    q.options.forEach((opt, idx) => {
      const label = document.createElement("label");
      label.className = "option";
      label.dataset.index = idx;

      const input = document.createElement("input");
      input.type = multi ? "checkbox" : "radio";
      input.name = "opt-" + q._id;
      input.value = idx;

      input.addEventListener("change", () => {
        if (multi) {
          const set = new Set(state[q._id]);
          if (input.checked) set.add(idx); else set.delete(idx);
          state[q._id] = Array.from(set);
        } else {
          state[q._id] = idx;
        }
      });

      const text = document.createElement("span");
      text.className = "opt-text";
      text.innerHTML = fmt(opt);

      label.appendChild(input);
      label.appendChild(text);
      opts.appendChild(label);
    });

    wrap.appendChild(opts);
    return wrap;
  }

  function renderTF(q) {
    const wrap = document.createElement("div");
    const prompt = document.createElement("p");
    prompt.className = "q-prompt";
    prompt.innerHTML = fmt(q.prompt);
    wrap.appendChild(prompt);

    const opts = document.createElement("div");
    opts.className = "options";
    state[q._id] = null;

    [["True", true], ["False", false]].forEach(([labelText, val], idx) => {
      const label = document.createElement("label");
      label.className = "option";
      label.dataset.index = idx;
      label.dataset.tf = String(val);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "opt-" + q._id;
      input.value = String(val);
      input.addEventListener("change", () => { state[q._id] = val; });

      const text = document.createElement("span");
      text.className = "opt-text";
      text.textContent = labelText;

      label.appendChild(input);
      label.appendChild(text);
      opts.appendChild(label);
    });

    wrap.appendChild(opts);
    return wrap;
  }

  // ---------- checking / revealing ----------

  function checkAll(forceReveal) {
    let correct = 0;
    const total = current.questions.length;

    current.questions.forEach((q) => {
      const result = gradeQuestion(q, forceReveal);
      if (result) correct++;
    });

    const pill = document.getElementById("scorePill");
    pill.innerHTML = "Correct: <strong>" + correct + " / " + total + "</strong>";
  }

  function gradeQuestion(q, forceReveal) {
    const card = document.getElementById("card-" + q._id);
    const verdict = document.getElementById("verdict-" + q._id);
    const answerBox = document.getElementById("answer-" + q._id);
    const resp = state[q._id];

    let isCorrect = false;
    let answerHTML = "";

    if (q.type === "fill") {
      const inputs = card.querySelectorAll(".fill-input");
      let allOk = true;
      const acceptedPieces = [];
      q.blanks.forEach((accepted, idx) => {
        const val = (resp && resp[idx]) || "";
        const ok = accepted.some((a) => normalize(a) === normalize(val));
        if (!ok) allOk = false;
        const input = inputs[idx];
        if (input) {
          input.classList.remove("correct", "wrong");
          input.classList.add(ok ? "correct" : "wrong");
        }
        acceptedPieces.push(
          "<code>" + fmt(accepted[0]) + "</code>" +
          (accepted.length > 1
            ? ' <span class="accepted">(also accepts: ' +
              accepted.slice(1).map((a) => "<code>" + fmt(a) + "</code>").join(", ") +
              ")</span>"
            : "")
        );
      });
      isCorrect = allOk;
      answerHTML =
        '<span class="label">Answer:</span> ' + acceptedPieces.join(" &nbsp;|&nbsp; ");
    }

    else if (q.type === "mcq") {
      const chosen = resp;
      isCorrect = chosen === q.answer;
      markOptions(card, [q.answer], chosen == null ? [] : [chosen]);
      answerHTML =
        '<span class="label">Answer:</span> ' + fmt(q.options[q.answer]);
    }

    else if (q.type === "multi") {
      const chosen = (resp || []).slice().sort();
      const right = q.answers.slice().sort();
      isCorrect =
        chosen.length === right.length &&
        chosen.every((v, i) => v === right[i]);
      markOptions(card, q.answers, resp || []);
      answerHTML =
        '<span class="label">Answer:</span> ' +
        q.answers.map((i) => fmt(q.options[i])).join("; ");
    }

    else if (q.type === "tf") {
      isCorrect = resp === q.answer;
      const correctIdx = q.answer ? 0 : 1;
      const chosenIdx = resp === null ? -1 : (resp ? 0 : 1);
      markOptions(card, [correctIdx], chosenIdx === -1 ? [] : [chosenIdx]);
      answerHTML =
        '<span class="label">Answer:</span> ' + (q.answer ? "True" : "False");
    }

    if (q.explanation) {
      answerHTML += '<div class="expl">' + fmt(q.explanation) + "</div>";
    }

    answerBox.innerHTML = answerHTML;
    card.classList.add("revealed");

    const answered = isAnswered(q, resp);
    if (!answered && !forceReveal) {
      verdict.textContent = "";
      verdict.className = "verdict";
    } else {
      verdict.textContent = isCorrect ? "Correct" : "Incorrect";
      verdict.className = "verdict " + (isCorrect ? "ok" : "no");
    }

    return isCorrect;
  }

  function isAnswered(q, resp) {
    if (q.type === "fill") return resp && resp.some((v) => v && v.trim());
    if (q.type === "multi") return resp && resp.length > 0;
    return resp !== null && resp !== undefined;
  }

  function markOptions(card, correctIdxs, chosenIdxs) {
    const correctSet = new Set(correctIdxs);
    const chosenSet = new Set(chosenIdxs);
    card.querySelectorAll(".option").forEach((el) => {
      const idx = Number(el.dataset.index);
      el.classList.remove("correct", "chosen-wrong");
      if (correctSet.has(idx)) el.classList.add("correct");
      else if (chosenSet.has(idx)) el.classList.add("chosen-wrong");
    });
  }

  // ---------- navigation ----------

  function buildNav() {
    const navList = document.getElementById("navList");
    navList.innerHTML = "";
    LECTURES.forEach((lecture, i) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.className = "nav-btn" + (i === 0 ? " active" : "");
      btn.innerHTML =
        "<span>" + fmt(lecture.title) + "</span>" +
        '<span class="count">' + lecture.questions.length + "</span>";
      btn.onclick = () => {
        document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        render(lecture);
        closeNav();
      };
      li.appendChild(btn);
      navList.appendChild(li);
    });
  }

  // ---------- mobile nav (hamburger drawer) ----------

  function openNav() {
    document.body.classList.add("nav-open");
    const toggle = document.getElementById("menuToggle");
    const backdrop = document.getElementById("backdrop");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    if (backdrop) backdrop.hidden = false;
  }

  function closeNav() {
    document.body.classList.remove("nav-open");
    const toggle = document.getElementById("menuToggle");
    const backdrop = document.getElementById("backdrop");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    if (backdrop) backdrop.hidden = true;
  }

  function setupMobileNav() {
    const toggle = document.getElementById("menuToggle");
    const backdrop = document.getElementById("backdrop");

    if (toggle) {
      toggle.addEventListener("click", () => {
        if (document.body.classList.contains("nav-open")) closeNav();
        else openNav();
      });
    }
    if (backdrop) backdrop.addEventListener("click", closeNav);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // If the viewport grows back to desktop, make sure the drawer state is reset.
    window.addEventListener("resize", () => {
      if (window.innerWidth > 720) closeNav();
    });
  }

  window.addEventListener("DOMContentLoaded", function () {
    setupMobileNav();

    if (!LECTURES.length) {
      document.getElementById("main").innerHTML =
        '<p class="empty-state">No lectures loaded. Check that the question files are included in index.html.</p>';
      return;
    }
    LECTURES.sort((a, b) => a.id.localeCompare(b.id));
    buildNav();
    render(LECTURES[0]);
  });
})();
