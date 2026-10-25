/* =====================================================================
   Carino Learn — platform logic
   A multi-course learning site. Courses register themselves into
   window.COURSES (see js/courses/*.js). This file builds the slice-menu
   chooser, renders the selected course and tracks per-course progress
   (ticked by the learner, kept in this browser, exportable as JSON).
   The navbar is the shared carino-navbar.js. No frameworks.
   ===================================================================== */

(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /* i18n: chrome strings go through the site dictionary (i18n.js). It loads
     deferred, so guard — English falls through untouched either way. */
  const tt = (s) => (typeof window.t === "function" ? window.t(s) : s);

  /* tiny inline markdown: `code` and **bold** (input is escaped first) */
  const md = (s) =>
    esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

  const ICONS = {
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>',
    terminal: '<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>',
    server: '<rect x="2" y="2" width="20" height="8" rx="2"></rect><rect x="2" y="14" width="20" height="8" rx="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>',
    globe: '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>',
    browser: '<rect x="2" y="3" width="20" height="18" rx="2"></rect><line x1="2" y1="8" x2="22" y2="8"></line><line x1="6" y1="5.5" x2="6.01" y2="5.5"></line><line x1="9" y1="5.5" x2="9.01" y2="5.5"></line>',
    regex: '<path d="M4 20v-4"></path><path d="M4 12V4"></path><path d="M4 12h4"></path><path d="M15 5l6 3.5-6 3.5V5z"></path><path d="M12 8.5H8"></path><circle cx="6" cy="19" r="1.4"></circle><path d="M17 15l4 4M21 15l-4 4"></path>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline>',
    pulse: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>',
    ram: '<rect x="2" y="7" width="20" height="10" rx="1.5"></rect><line x1="6" y1="10" x2="6" y2="14"></line><line x1="10" y1="10" x2="10" y2="14"></line><line x1="14" y1="10" x2="14" y2="14"></line><line x1="18" y1="10" x2="18" y2="14"></line><line x1="5" y1="17" x2="5" y2="20"></line><line x1="12" y1="17" x2="12" y2="20"></line><line x1="19" y1="17" x2="19" y2="20"></line>',
    branch: '<line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path>',
    atom: '<circle cx="12" cy="12" r="1.6"></circle><ellipse cx="12" cy="12" rx="10" ry="4.2"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"></ellipse><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"></ellipse>',
    topology: '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>',
  };
  const svg = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.cpu}</svg>`;

  /* ---------- progress (per course) ---------- */
  /* keys use the fleet 'learn.' prefix; legacy 'carino-learn-*' keys migrate.
     Every access is guarded: private windows and blocked storage throw, and
     the page must keep working (ticks then last only until reload). */
  const keyFor = (id) => `learn.${id}`;
  const memory = {};                       // fallback when storage is unavailable
  let storeOK = true;
  function storeFailed() {
    if (!storeOK) return;
    storeOK = false;
    showAlert("warn", tt("Progress can't be saved in this browser. Your ticks last until you close the page."), true);
  }
  const doneFor = (id) => {
    if (memory[id]) return new Set(memory[id]);
    try {
      let raw = localStorage.getItem(keyFor(id));
      if (raw == null) {
        const legacy = localStorage.getItem(`carino-learn-${id}`);
        if (legacy != null) { localStorage.setItem(keyFor(id), legacy); raw = legacy; }
      }
      const arr = JSON.parse(raw);
      return new Set(Array.isArray(arr) ? arr : []);
    }
    catch { return new Set(); }
  };
  const saveDone = (id, set) => {
    memory[id] = [...set];
    try { localStorage.setItem(keyFor(id), JSON.stringify([...set])); delete memory[id]; }
    catch { storeFailed(); }
  };

  /* ---------- page alerts (Branding .alert) ---------- */
  function showAlert(kind, text, sticky) {
    const host = $("#pageAlerts");
    if (!host) return;
    const el = document.createElement("div");
    el.className = "alert " + kind;
    el.setAttribute("role", kind === "err" || kind === "warn" ? "alert" : "status");
    el.textContent = text;
    host.appendChild(el);
    if (!sticky) setTimeout(() => el.remove(), 6000);
  }
  const labFailed = (mount, err, what) => {
    console.warn(what, err);
    mount.innerHTML = `<div class="alert err">${esc(tt("This lab couldn't start. The reading still works."))}</div>`;
  };

  /* =================================================================== */
  /* Syntax highlighting (lang-aware, HTML-safe)                         */
  /* =================================================================== */
  const ASM_INS = new Set((
    "mov movzx movsx lea push pop add sub inc dec imul mul and or xor not neg " +
    "shl shr sar cmp test jmp je jne jl jg jle jge jb ja jz jnz jecxz call ret " +
    "syscall int iret iretq cli sti hlt nop lodsb stosb in out lidt lgdt sti " +
    "cmovg cmovl cmove cmovge cmovle xchg cmpxchg lock mfence sfence lfence leave"
  ).split(" "));
  const ASM_REG = new Set((
    "rax rbx rcx rdx rsi rdi rbp rsp rip r8 r9 r10 r11 r12 r13 r14 r15 " +
    "eax ebx ecx edx esi edi ebp esp r8d r9d ax bx cx dx si di al bl cl dl ah " +
    "sil dil cr0 cr2 cr3 cr4 cs ds es ss fs gs"
  ).split(" "));
  const ASM_DIR = /^(section|global|extern|db|dq|dw|dd|resb|resq|resd|equ|times|org|bits)$/;

  const SH_KW = new Set((
    "if then else elif fi for while until do done case esac in function return " +
    "local export declare readonly read echo printf cd pwd set unset trap exit " +
    "source eval test break continue shift getopts mktemp sudo"
  ).split(" "));

  function findCommentIdx(s, ch) {
    let q = null;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (q) { if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === ch) {
        if (ch === "#") { if (i === 0 || /\s/.test(s[i - 1])) return i; }
        else return i;
      }
    }
    return -1;
  }

  // generic engine: escapes the gaps, classify() escapes + wraps each token
  function hlLine(line, commentChar, re, classify) {
    let code = line, comment = "";
    const ci = findCommentIdx(line, commentChar);
    if (ci >= 0) { code = line.slice(0, ci); comment = line.slice(ci); }
    let out = "", last = 0, m;
    re.lastIndex = 0;
    while ((m = re.exec(code))) {
      out += esc(code.slice(last, m.index));
      out += classify(m[0]);
      last = m.index + m[0].length;
      if (re.lastIndex === m.index) re.lastIndex++; // guard against zero-width
    }
    out += esc(code.slice(last));
    if (comment) out += `<span class="t-com">${esc(comment)}</span>`;
    return out;
  }

  const ASM_RE = /"[^"]*"|'[^']*'|\b0x[0-9a-fA-F]+\b|\b\d+\b|[A-Za-z_.][\w.]*/g;
  function asmClassify(t) {
    if (/^["']/.test(t)) return `<span class="t-str">${esc(t)}</span>`;
    if (/^(0x[0-9a-fA-F]+|\d+)$/.test(t)) return `<span class="t-num">${esc(t)}</span>`;
    const low = t.toLowerCase();
    if (ASM_INS.has(low)) return `<span class="t-ins">${esc(t)}</span>`;
    if (ASM_REG.has(low)) return `<span class="t-reg">${esc(t)}</span>`;
    if (ASM_DIR.test(low)) return `<span class="t-dir">${esc(t)}</span>`;
    if (t[0] === ".") return `<span class="t-lbl">${esc(t)}</span>`;
    return esc(t);
  }

  const PY_KW = new Set((
    "def return import from for while if elif else print class with as in not " +
    "and or lambda try except finally raise pass break continue yield global " +
    "None True False assert del is async await"
  ).split(" "));
  const PY_RE = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d[\w.]*\b|[A-Za-z_]\w*/g;
  function pyClassify(t) {
    if (/^["']/.test(t)) return `<span class="t-str">${esc(t)}</span>`;
    if (/^\d/.test(t)) return `<span class="t-num">${esc(t)}</span>`;
    if (PY_KW.has(t)) return `<span class="t-ins">${esc(t)}</span>`;
    return esc(t);
  }

  const SH_RE = /"(?:[^"\\]|\\.)*"|'[^']*'|\$\{[^}]*\}|\$\(|\$[A-Za-z_]\w*|\$[?@#*!0-9-]|\b\d+\b|[A-Za-z_][\w-]*/g;
  function shClassify(t) {
    if (/^["']/.test(t)) return `<span class="t-str">${esc(t)}</span>`;
    if (t[0] === "$") return `<span class="t-reg">${esc(t)}</span>`;
    if (/^\d+$/.test(t)) return `<span class="t-num">${esc(t)}</span>`;
    if (SH_KW.has(t)) return `<span class="t-ins">${esc(t)}</span>`;
    return esc(t);
  }

  /* HL7 v2 (ER7): colour the segment name and the encoding characters */
  function hl7Line(line) {
    if (!/^[A-Z][A-Z0-9]{2}[|]/.test(line)) return esc(line);
    const seg = line.slice(0, 3);
    const rest = line.slice(3).split(/([|^~&\\])/).map((t) =>
      /^[|^~&\\]$/.test(t) ? `<span class="t-dir">${esc(t)}</span>` : esc(t)).join("");
    return `<span class="t-ins">${esc(seg)}</span>${rest}`;
  }

  /* DICOM (dcmdump style): (gggg,eeee) VR [value] # comment */
  function dcmLine(line) {
    const m = /^(\s*)\(([0-9a-fA-F]{4}),([0-9a-fA-F]{4})\)(\s+)([A-Z]{2})(\s+)(.*)$/.exec(line);
    if (!m) {
      const ci = line.indexOf("#");
      return ci >= 0
        ? esc(line.slice(0, ci)) + `<span class="t-com">${esc(line.slice(ci))}</span>`
        : esc(line);
    }
    let rest = m[7], comment = "";
    const ci = rest.indexOf("#");
    if (ci >= 0) { comment = rest.slice(ci); rest = rest.slice(0, ci); }
    const val = rest.replace(/\[([^\]]*)\]/g, (_, v) => `[<span class="t-str">${esc(v)}</span>]`);
    return `${m[1]}<span class="t-reg">(${m[2]},${m[3]})</span>${m[4]}` +
      `<span class="t-ins">${m[5]}</span>${m[6]}${val}` +
      (comment ? `<span class="t-com">${esc(comment)}</span>` : "");
  }

  /* YAML (netplan style): colour keys, values and comments */
  function yamlLine(line) {
    const ci = line.indexOf("#");
    const body = ci >= 0 ? line.slice(0, ci) : line;
    const comment = ci >= 0 ? `<span class="t-com">${esc(line.slice(ci))}</span>` : "";
    const m = /^(\s*(?:-\s+)?)([A-Za-z0-9_."/*-]+)(:)(\s.*|$)/.exec(body);
    if (!m) return esc(body) + comment;
    const val = m[4] ? `<span class="t-str">${esc(m[4])}</span>` : "";
    return `${m[1]}<span class="t-ins">${esc(m[2])}</span>:${val}${comment}`;
  }

  function highlight(src, lang) {
    const lines = src.split("\n");
    if (lang === "asm")
      return lines.map((l) => hlLine(l, ";", ASM_RE, asmClassify)).join("\n");
    if (lang === "hl7")   return lines.map(hl7Line).join("\n");
    if (lang === "dicom") return lines.map(dcmLine).join("\n");
    if (lang === "py")
      return lines.map((l) => hlLine(l, "#", PY_RE, pyClassify)).join("\n");
    if (lang === "yaml")  return lines.map(yamlLine).join("\n");
    if (lang === "json" || lang === "txt") return esc(src);
    return lines.map((l) => hlLine(l, "#", SH_RE, shClassify)).join("\n");
  }

  const LANG_LABEL = {
    asm: "x86-64 · nasm", hl7: "HL7 v2 · ER7", dicom: "DICOM · dcmdump",
    json: "JSON", txt: "plain text", py: "Python", yaml: "YAML · netplan",
  };

  /* =================================================================== */
  /* Course rendering                                                    */
  /* =================================================================== */
  const courseList = () => Object.values(window.COURSES || {});
  let active = null;          // current course id
  let done = new Set();       // current course progress

  function trackOf(course, n) {
    return (course.tracks || []).find((t) => t.stages.includes(n)) || course.tracks[0];
  }

  function stageCard(course, s) {
    const isDone = done.has(s.n);
    const el = document.createElement("article");
    el.className = "stage" + (isDone ? " is-done" : "");
    el.id = "stage-" + s.n;
    el.dataset.n = s.n;

    const chips = s.concepts.map((c) => `<span class="chip">${esc(c)}</span>`).join("");
    const walk = (s.walkthrough || [])
      .map((w) => `<li>${md(w)}</li>`).join("");
    const drills = (s.drills || [])
      .map((d) => `<li>${md(d)}</li>`).join("");
    const langLabel = LANG_LABEL[s.lang] || "shell";

    // documents attached to this stage (e.g. ISO 27001 templates)
    const tplDocs = (s.templates || [])
      .map((tid) => (course.templates || []).find((t) => t.id === tid))
      .filter(Boolean);
    const tplHtml = tplDocs.map((t, i) => `
      <details class="panel tpl">
        <summary class="panel-h">📄 <span class="tpl-name">${esc(t.name)}</span>
          <span class="tpl-annex">${esc(t.annex)}</span>
          <span class="tpl-tier tier-${esc(t.tier)}">${esc(t.tier)}</span>
        </summary>
        <div class="tpl-inner">
          <div class="tpl-top">
            <p class="tpl-desc">${esc(t.desc)}</p>
            <button class="copy-btn tpl-copy" type="button" data-tpl="${i}">${tt("copy document")}</button>
          </div>
          <pre class="tpl-body">${esc(t.content)}</pre>
        </div>
      </details>`).join("");

    el.innerHTML = `
      <div class="stage-rail">
        <div class="stage-num">${s.n}</div>
        <div class="rail-line"></div>
      </div>
      <div class="stage-body">
        <header class="stage-head">
          <div>
            <span class="stage-tag">${esc(s.tag)}</span>
            <h3 class="stage-title">${esc(s.title)}</h3>
          </div>
          <div class="stage-meta">
            <span class="stage-time" title="${tt("Suggested time")}">⏱ ${esc(s.time)}</span>
            <label class="done-toggle">
              <input type="checkbox" ${isDone ? "checked" : ""} aria-label="Mark stage ${s.n} complete">
              <span>${tt("Done")}</span>
            </label>
          </div>
        </header>

        <p class="payoff">${md(s.payoff)}</p>

        <div class="concepts">${chips}</div>

        ${s.code ? `
        <div class="code-wrap">
          <div class="code-top">
            <span class="code-lang">${langLabel}</span>
            <button class="copy-btn code-copy" type="button">${tt("copy")}</button>
          </div>
          <pre class="code"><code>${highlight(s.code, s.lang)}</code></pre>
        </div>` : ""}

        ${walk ? `
        <details class="panel wk" open>
          <summary class="panel-h">📖 ${tt("Line-by-line")}</summary>
          <ol class="walk">${walk}</ol>
        </details>` : ""}

        ${tplHtml ? `
        <div class="tpl-stack">
          <div class="tpl-stack-h">📁 ${tt("Documents for this stage")} <span class="tpl-count">${tplDocs.length}</span></div>
          ${tplHtml}
        </div>` : ""}

        ${s.exercise ? `
        <div class="panel ex">
          <div class="panel-h">🛠 ${tt("Do this")}</div>
          <pre class="panel-body">${esc(s.exercise)}</pre>
        </div>` : ""}

        ${drills ? `
        <details class="panel dr">
          <summary class="panel-h">🎯 ${tt("Quick drills")}</summary>
          <ul class="drills">${drills}</ul>
        </details>` : ""}

        ${s.note ? `
        <div class="panel nt">
          <div class="panel-h">🧠 ${tt("Go deeper")}</div>
          <p class="panel-body">${md(s.note)}</p>
        </div>` : ""}
      </div>`;

    const codeBtn = $(".code-copy", el);
    if (codeBtn) codeBtn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(s.code); codeBtn.textContent = tt("copied ✓"); }
      catch { codeBtn.textContent = tt("select & copy"); }
      setTimeout(() => (codeBtn.textContent = tt("copy")), 1400);
    });

    $$(".tpl-copy", el).forEach((b) => b.addEventListener("click", async () => {
      const t = tplDocs[+b.dataset.tpl];
      try { await navigator.clipboard.writeText(t.content); b.textContent = tt("copied ✓"); }
      catch { b.textContent = tt("select & copy"); }
      setTimeout(() => (b.textContent = tt("copy document")), 1400);
    }));

    $(".done-toggle input", el).addEventListener("change", (e) => {
      if (e.target.checked) done.add(s.n); else done.delete(s.n);
      el.classList.toggle("is-done", e.target.checked);
      saveDone(active, done);
      refreshProgress();
    });

    return el;
  }

  function referenceCard(card) {
    const wrap = document.createElement("div");
    wrap.className = "ref-card" + (card.kind === "cmds" ? " ref-build" : "");
    if (card.kind === "table") {
      const head = card.head.map((h) => `<th>${esc(h)}</th>`).join("");
      const rows = card.rows.map((r) =>
        `<tr>${r.map((c, i) =>
          `<td class="${i === 0 ? "mono accent" : ""}">${esc(c)}</td>`).join("")}</tr>`
      ).join("");
      wrap.innerHTML = `
        <h3>${esc(card.title)}</h3>
        <table class="ref-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>
        ${card.foot ? `<p class="ref-foot">${md(card.foot)}</p>` : ""}`;
    } else {
      const rows = card.rows.map(([l, c]) =>
        `<div class="bcmd"><span class="bcmd-l">${esc(l)}</span><code>${esc(c)}</code></div>`
      ).join("");
      wrap.innerHTML = `<h3>${esc(card.title)}</h3>${rows}`;
    }
    return wrap;
  }

  /* widgets rewrite their explainer/status lines on every interaction —
     mark them live so screen readers announce the change. Also give every
     widget command line a copy button (it copies whatever the line shows
     at click time, so it tracks the widget's state). */
  function livenLab(root) {
    $$('.asm-msg, .viz-status, [data-r="say"], .net-say, .br-say', root)
      .forEach((el) => el.setAttribute("aria-live", "polite"));
    $$(".gnu-cmdline", root).forEach((line) => {
      if ($(".copy-btn", line)) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn cmd-copy";
      btn.textContent = tt("copy");
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const code = $("code", line);
        try { await navigator.clipboard.writeText(code ? code.textContent : ""); btn.textContent = tt("copied ✓"); }
        catch { btn.textContent = tt("select & copy"); }
        setTimeout(() => (btn.textContent = tt("copy")), 1400);
      });
      line.appendChild(btn);
    });
  }

  function renderCourse(course) {
    const host = $("#courseHost");
    const viz = (window.COURSE_VIZ || {})[course.id];
    const labHtml = viz ? `
      <div class="lab-wrap">
        <section class="lab" id="lab">
          <div class="lab-kicker">${tt("Interactive lab")}</div>
          <h2>${esc(viz.title)}</h2>
          <p class="lab-blurb">${md(viz.blurb || "")}</p>
          <div class="lab-mount" id="labMount"></div>
        </section>
      </div>` : "";
    host.innerHTML = `
      <section class="mod-hero">
        <div class="hero-inner">
          <span class="kicker">${esc(course.tag)}</span>
          <h1>${esc(course.title)}</h1>
          <p class="lede">${md(course.intro)}</p>
          <div class="hero-cta">
            <a class="btn btn-primary" href="#${course.id}/stage-0">${tt("Start at stage 0")}</a>
            <a class="btn" href="#${course.id}/reference">${tt("Cheat-sheet")}</a>
            <button class="btn btn-ghost" id="allDoneBtn" type="button"></button>
          </div>
          <div class="prog-bar-wrap">
            <span class="progress fluid"><span id="progFill" style="width:0%"></span></span>
            <span class="prog-label" id="progText">0 / 0</span>
          </div>
        </div>
      </section>

      ${labHtml}

      <div class="layout">
        <nav class="jump" aria-label="Stages"><div class="jump-title">${esc(course.title)} · ${tt("the path")}</div><div id="jumpNav"></div></nav>
        <div class="roadmap-col">
          <div id="roadmap" class="roadmap"></div>
          <section id="reference" class="reference">
            <div class="track-head"><span class="track-kicker">${tt("Keep open while you work")}</span><h2>${tt("Cheat-sheet")}</h2></div>
            <div class="ref-grid" id="refGrid"></div>
          </section>
        </div>
      </div>`;

    // roadmap with track headers + inline mini-labs placed at their topic
    const roadmap = $("#roadmap", host);
    const miniLabs = (window.COURSE_MINILABS || {})[course.id] || [];
    let curTrack = null;
    course.stages.forEach((s) => {
      const tr = trackOf(course, s.n);
      if (tr !== curTrack) {
        curTrack = tr;
        const h = document.createElement("div");
        h.className = "track-head";
        h.innerHTML = `<span class="track-kicker">${tt("Track")}</span><h2>${esc(tr.label)}</h2>`;
        roadmap.appendChild(h);
      }
      roadmap.appendChild(stageCard(course, s));
      miniLabs.filter((L) => L.at === s.n).forEach((L) => {
        const sec = document.createElement("section");
        sec.className = "lab lab-inline";
        sec.innerHTML = `
          <div class="lab-kicker">${tt("Interactive lab")}</div>
          <h3>${esc(L.title)}</h3>
          <p class="lab-blurb">${md(L.blurb || "")}</p>
          <div class="lab-mount"></div>`;
        roadmap.appendChild(sec);
        const mount = $(".lab-mount", sec);
        try { L.mount(mount); livenLab(sec); }
        catch (err) { labFailed(mount, err, "mini-lab mount failed for " + course.id); }
      });
    });

    // jump nav: the lab first, then every stage
    const jn = $("#jumpNav", host);
    if (viz) {
      const a = document.createElement("a");
      a.href = `#${course.id}/lab`;
      a.className = "jump-item jump-lab";
      a.innerHTML = `<span class="jn-num">▶</span><span class="jn-t">${tt("Interactive lab")}</span>`;
      jn.appendChild(a);
    }
    course.stages.forEach((s) => {
      const a = document.createElement("a");
      a.href = `#${course.id}/stage-${s.n}`;
      a.className = "jump-item";
      a.dataset.n = s.n;
      a.innerHTML = `<span class="jn-num">${s.n}</span><span class="jn-t">${esc(s.title)}</span>`;
      jn.appendChild(a);
    });

    // reference
    const rg = $("#refGrid", host);
    (course.reference || []).forEach((c) => rg.appendChild(referenceCard(c)));

    // "mark every stage done" / "clear every tick" for this module
    $("#allDoneBtn", host).addEventListener("click", () => {
      const all = done.size === course.stages.length;
      done = all ? new Set() : new Set(course.stages.map((s) => s.n));
      saveDone(active, done);
      $$(".stage", host).forEach((c) => {
        const on = done.has(+c.dataset.n);
        c.classList.toggle("is-done", on);
        const cb = $(".done-toggle input", c); if (cb) cb.checked = on;
      });
      refreshProgress();
    });

    // mount the interactive visual
    if (viz) {
      const mount = $("#labMount", host);
      try { viz.mount(mount); livenLab(mount); }
      catch (err) { labFailed(mount, err, "viz mount failed for " + course.id); }
    }

    wireScrollSpy(host);
    refreshProgress();
  }

  function wireScrollSpy(host) {
    const items = $$(".jump-item", host);
    if (!items.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const n = en.target.dataset.n;
          items.forEach((i) => i.classList.toggle("active", i.dataset.n === n));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$(".stage", host).forEach((s) => obs.observe(s));
  }

  /* ---------- progress UI (current course + slice tiles) ---------- */
  function overallProgress() {
    let n = 0, total = 0;
    courseList().forEach((c) => {
      const d = c.id === active ? done : doneFor(c.id);
      n += d.size; total += c.stages.length;
    });
    return { n, total, pct: total ? Math.round((n / total) * 100) : 0 };
  }

  function refreshProgress() {
    const course = window.COURSES[active];
    const total = course ? course.stages.length : 0;
    const n = done.size;
    const pct = total ? Math.round((n / total) * 100) : 0;
    const all = overallProgress();

    // module hero bar + "all done" toggle
    const fill = $("#progFill"); if (fill) fill.style.width = pct + "%";
    const ptext = $("#progText"); if (ptext) ptext.textContent = `${n} / ${total} ${tt("complete")}`;
    const allBtn = $("#allDoneBtn");
    if (allBtn) allBtn.textContent = total && n === total ? tt("Clear every tick") : tt("Mark every stage done");

    // navbar Progress menu: the open module when there is one, else everything
    $("#progPct").textContent = (course ? pct : all.pct) + "%";
    $("#rowModule").hidden = !course;
    if (course) {
      $("#rowModuleName").textContent = course.title;
      $("#diagDone").textContent = `${n} / ${total}`;
    }
    $("#diagAllDone").textContent = `${all.n} / ${all.total} · ${all.pct}%`;

    // overview pill
    const oProg = $("#overviewProg");
    if (oProg) oProg.textContent = `${all.n} / ${all.total} ${tt("stages")} · ${all.pct}%`;
    const oFill = $("#overviewFill"); if (oFill) oFill.style.width = all.pct + "%";

    $$(".jump-item[data-n]").forEach((a) => a.classList.toggle("done", done.has(+a.dataset.n)));
    refreshSliceTiles();
  }

  function refreshSliceTiles() {
    courseList().forEach((c) => {
      const tile = $(`.slice[data-id="${c.id}"]`);
      if (!tile) return;
      const d = c.id === active ? done : doneFor(c.id);
      const total = c.stages.length;
      const pct = total ? Math.round((d.size / total) * 100) : 0;
      const f = $(".progress > span", tile); if (f) f.style.width = pct + "%";
      const complete = total > 0 && d.size === total;
      const cnt = $(".s-count", tile);
      if (cnt) cnt.textContent = complete ? `✓ ${tt("complete")}` : `${d.size} / ${total}`;
      tile.classList.toggle("is-complete", complete);
    });
  }

  /* =================================================================== */
  /* Slice menu + routing                                                */
  /* =================================================================== */
  function buildSlices() {
    const menu = $("#sliceMenu");
    courseList().forEach((c, i) => {
      const slice = document.createElement("a");
      slice.className = "slice";
      slice.dataset.id = c.id;
      slice.href = "#" + c.id;
      slice.innerHTML = `
        <span class="s-num">${String(i + 1).padStart(2, "0")}</span>
        <span class="s-icon" aria-hidden="true">${svg(c.icon)}</span>
        <span class="s-text">${esc(c.title)}</span>
        <span class="s-blurb">${esc(c.blurb)}</span>
        <span class="s-prog"><span class="progress fluid"><span style="width:0%"></span></span><span class="s-count">0 / ${c.stages.length}</span></span>`;
      menu.appendChild(slice);
    });
  }

  /* Routing follows CarinoUI.slices (body.state-overview / .state-module,
     .collapsed, .active + aria-current), with one addition it does not have
     yet: a stage or lab after a slash, #bash/stage-3 or #bash/lab. */
  function markSlices(id) {
    const menu = $("#sliceMenu");
    document.body.classList.toggle("state-module", !!id);
    document.body.classList.toggle("state-overview", !id);
    menu.classList.toggle("collapsed", !!id);
    $$(".slice", menu).forEach((s) => {
      const on = s.dataset.id === id;
      s.classList.toggle("active", on);
      if (on) s.setAttribute("aria-current", "page"); else s.removeAttribute("aria-current");
      // keep the active tab visible in the (scrollable) collapsed bar
      if (on) menu.scrollLeft = s.offsetLeft - (menu.clientWidth - s.offsetWidth) / 2;
    });
  }

  function selectCourse(id, anchor) {
    if (!window.COURSES[id]) return showOverview();
    active = id;
    done = doneFor(id);
    markSlices(id);
    renderCourse(window.COURSES[id]);
    // scroll to anchor if any, else top of course
    requestAnimationFrame(() => {
      const target = anchor && $("#" + anchor);
      if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
      else window.scrollTo(0, 0);
    });
  }

  function showOverview() {
    active = null; done = new Set();
    markSlices(null);
    $("#courseHost").innerHTML = "";
    refreshProgress();
    window.scrollTo(0, 0);
  }

  function route() {
    const raw = location.hash.replace(/^#/, "");          // e.g. "bash/stage-3"
    if (!raw) return showOverview();
    const [id, anchor] = raw.split("/");
    if (!window.COURSES[id]) return showOverview();
    if (id !== active) selectCourse(id, anchor);
    else if (anchor) { const t = $("#" + anchor); if (t) t.scrollIntoView({ block: "start" }); }
  }

  /* ---------- reset (Branding modal, never confirm()) ---------- */
  let lastFocus = null;
  function openReset() {
    const course = window.COURSES[active];
    $("#resetSub").textContent = course ? course.title : tt("Every module");
    $("#resetBody").textContent = course
      ? tt("This clears every tick in this module. Other modules keep theirs.")
      : tt("This clears every tick in every module. Export first if you want a copy.");
    lastFocus = document.activeElement;
    $("#resetModal").hidden = false;
    $("#resetCancel").focus();
  }
  function closeReset() {
    $("#resetModal").hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function doReset() {
    const ids = active ? [active] : courseList().map((c) => c.id);
    ids.forEach((id) => saveDone(id, new Set()));
    if (active) {
      done = new Set();
      $$("#courseHost .done-toggle input").forEach((cb) => (cb.checked = false));
      $$("#courseHost .stage").forEach((c) => c.classList.remove("is-done"));
    }
    closeReset();
    refreshProgress();
  }
  function wireReset() {
    $("#resetBtn").addEventListener("click", openReset);
    $("#resetOk").addEventListener("click", doReset);
    $("#resetCancel").addEventListener("click", closeReset);
    $("#resetX").addEventListener("click", closeReset);
    $("#resetModal").addEventListener("click", (e) => { if (e.target.id === "resetModal") closeReset(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#resetModal").hidden) closeReset(); });
  }

  /* ---------- export / import (the only way to move progress) ---------- */
  function exportProgress() {
    const progress = {};
    courseList().forEach((c) => {
      const d = c.id === active ? done : doneFor(c.id);
      if (d.size) progress[c.id] = [...d].sort((x, y) => x - y);
    });
    const data = { site: "learn.carino.systems", version: 1, exported: new Date().toISOString(), progress };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "carino-learn-progress.json";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importProgress(file) {
    let data;
    try { data = JSON.parse(await file.text()); }
    catch { return showAlert("err", tt("That file is not a progress export.")); }
    const prog = data && typeof data.progress === "object" && data.progress;
    if (!prog) return showAlert("err", tt("That file is not a progress export."));
    let modules = 0;
    courseList().forEach((c) => {
      const list = prog[c.id];
      if (!Array.isArray(list)) return;
      const valid = new Set(c.stages.map((s) => s.n));
      saveDone(c.id, new Set(list.map(Number).filter((n) => valid.has(n))));
      modules++;
    });
    if (active) { done = doneFor(active); renderCourse(window.COURSES[active]); }
    else refreshProgress();
    showAlert("ok", tt("Progress imported for {n} modules.").replace("{n}", modules));
  }
  function wireTransfer() {
    $("#exportBtn").addEventListener("click", exportProgress);
    $("#importBtn").addEventListener("click", () => $("#importFile").click());
    $("#importFile").addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      e.target.value = "";
      if (f) importProgress(f);
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    try { const k = "learn.__probe"; localStorage.setItem(k, "1"); localStorage.removeItem(k); }
    catch { storeFailed(); }
    if (!window.COURSES || !courseList().length) {
      $("#sliceMenu").hidden = true;
      showAlert("warn", tt("No modules loaded. Reload the page; if it keeps happening, a script was blocked."), true);
      return;
    }
    buildSlices();
    wireReset();
    wireTransfer();
    $("#diagCourses").textContent = String(courseList().length);
    window.addEventListener("hashchange", route);
    // fleet language switch: re-render the open course so its JS-built
    // chrome picks up the new dictionary (static chrome is handled by i18n.js)
    window.addEventListener("carino:langchange", () => {
      if (active && window.COURSES[active]) renderCourse(window.COURSES[active]);
      else refreshProgress();
    });
    route();
  });
})();
