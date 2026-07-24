/* =====================================================================
   Carino Learn — platform logic
   A multi-course learning site. Courses register themselves into
   window.COURSES (see js/courses/*.js). This file builds the slice-menu
   chooser, renders the selected course, tracks per-course progress, and
   drives the navbar clock + diagnostics. No frameworks.
   ===================================================================== */

(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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
  };
  const svg = (name) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.cpu}</svg>`;

  /* ---------- progress (per course) ---------- */
  /* keys use the fleet 'learn.' prefix; legacy 'carino-learn-*' keys migrate */
  const keyFor = (id) => `learn.${id}`;
  const doneFor = (id) => {
    try {
      let raw = localStorage.getItem(keyFor(id));
      if (raw == null) {
        const legacy = localStorage.getItem(`carino-learn-${id}`);
        if (legacy != null) { localStorage.setItem(keyFor(id), legacy); raw = legacy; }
      }
      return new Set(JSON.parse(raw) || []);
    }
    catch { return new Set(); }
  };
  const saveDone = (id, set) =>
    localStorage.setItem(keyFor(id), JSON.stringify([...set]));

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

  const SH_RE = /"(?:[^"\\]|\\.)*"|'[^']*'|\$\{[^}]*\}|\$\(|\$[A-Za-z_]\w*|\$[?@#*!0-9-]|\b\d+\b|[A-Za-z_][\w-]*/g;
  function shClassify(t) {
    if (/^["']/.test(t)) return `<span class="t-str">${esc(t)}</span>`;
    if (t[0] === "$") return `<span class="t-reg">${esc(t)}</span>`;
    if (/^\d+$/.test(t)) return `<span class="t-num">${esc(t)}</span>`;
    if (SH_KW.has(t)) return `<span class="t-ins">${esc(t)}</span>`;
    return esc(t);
  }

  function highlight(src, lang) {
    const lines = src.split("\n");
    if (lang === "asm")
      return lines.map((l) => hlLine(l, ";", ASM_RE, asmClassify)).join("\n");
    return lines.map((l) => hlLine(l, "#", SH_RE, shClassify)).join("\n");
  }

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
    const langLabel = s.lang === "asm" ? "x86-64 · nasm" : "shell";

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
            <button class="copy-btn tpl-copy" type="button" data-tpl="${i}">copy document</button>
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
            <span class="stage-time" title="Suggested time">⏱ ${esc(s.time)}</span>
            <label class="done-toggle">
              <input type="checkbox" ${isDone ? "checked" : ""} aria-label="Mark stage ${s.n} complete">
              <span>Done</span>
            </label>
          </div>
        </header>

        <p class="payoff">${md(s.payoff)}</p>

        <div class="concepts">${chips}</div>

        ${s.code ? `
        <div class="code-wrap">
          <div class="code-top">
            <span class="code-lang">${langLabel}</span>
            <button class="copy-btn code-copy" type="button">copy</button>
          </div>
          <pre class="code"><code>${highlight(s.code, s.lang)}</code></pre>
        </div>` : ""}

        ${walk ? `
        <details class="panel wk" open>
          <summary class="panel-h">📖 Line-by-line</summary>
          <ol class="walk">${walk}</ol>
        </details>` : ""}

        ${tplHtml ? `
        <div class="tpl-stack">
          <div class="tpl-stack-h">📁 Documents for this stage <span class="tpl-count">${tplDocs.length}</span></div>
          ${tplHtml}
        </div>` : ""}

        ${s.exercise ? `
        <div class="panel ex">
          <div class="panel-h">🛠 Do this</div>
          <pre class="panel-body">${esc(s.exercise)}</pre>
        </div>` : ""}

        ${drills ? `
        <details class="panel dr">
          <summary class="panel-h">🎯 Quick drills</summary>
          <ul class="drills">${drills}</ul>
        </details>` : ""}

        ${s.note ? `
        <div class="panel nt">
          <div class="panel-h">🧠 Go deeper</div>
          <p class="panel-body">${md(s.note)}</p>
        </div>` : ""}
      </div>`;

    const codeBtn = $(".code-copy", el);
    if (codeBtn) codeBtn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(s.code); codeBtn.textContent = "copied ✓"; }
      catch { codeBtn.textContent = "select & copy"; }
      setTimeout(() => (codeBtn.textContent = "copy"), 1400);
    });

    $$(".tpl-copy", el).forEach((b) => b.addEventListener("click", async () => {
      const t = tplDocs[+b.dataset.tpl];
      try { await navigator.clipboard.writeText(t.content); b.textContent = "copied ✓"; }
      catch { b.textContent = "select & copy"; }
      setTimeout(() => (b.textContent = "copy document"), 1400);
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

  function renderCourse(course) {
    const host = $("#courseHost");
    const viz = (window.COURSE_VIZ || {})[course.id];
    const labHtml = viz ? `
      <section class="lab" id="lab">
        <div class="lab-inner">
          <div class="lab-head">
            <span class="track-kicker">Interactive lab</span>
            <h2>${esc(viz.title)}</h2>
            <p class="lab-blurb">${md(viz.blurb || "")}</p>
          </div>
          <div class="lab-mount" id="labMount"></div>
        </div>
      </section>` : "";
    host.innerHTML = `
      <section class="hero">
        <div class="hero-inner">
          <span class="kicker">${esc(course.tag)}</span>
          <h1>${esc(course.title)} <em>course</em></h1>
          <p class="lede">${md(course.intro)}</p>
          <div class="hero-cta">
            <a class="btn btn-accent" href="#${course.id}/stage-0">Start at stage 0 →</a>
            <a class="btn btn-ghost" href="#${course.id}/reference">Cheat-sheet</a>
            <button class="btn btn-ghost" id="resetBtn" type="button">Reset progress</button>
          </div>
          <div class="prog-bar-wrap">
            <div class="prog-bar"><div class="prog-fill" id="progFill"></div></div>
            <span class="prog-label" id="progText">0 / 0</span>
          </div>
        </div>
      </section>

      ${labHtml}

      <div class="layout">
        <nav class="jump" aria-label="Stages"><div class="jump-title">${esc(course.title)} · the path</div><div id="jumpNav"></div></nav>
        <div class="roadmap-col">
          <div id="roadmap" class="roadmap"></div>
          <section id="reference" class="reference">
            <div class="track-head"><span class="track-kicker">Keep open while you work</span><h2>Cheat-sheet</h2></div>
            <div class="ref-grid" id="refGrid"></div>
          </section>
        </div>
      </div>`;

    // roadmap with track headers
    const roadmap = $("#roadmap", host);
    let curTrack = null;
    course.stages.forEach((s) => {
      const tr = trackOf(course, s.n);
      if (tr !== curTrack) {
        curTrack = tr;
        const h = document.createElement("div");
        h.className = "track-head";
        h.innerHTML = `<span class="track-kicker">Track</span><h2>${esc(tr.label)}</h2>`;
        roadmap.appendChild(h);
      }
      roadmap.appendChild(stageCard(course, s));
    });

    // jump nav
    const jn = $("#jumpNav", host);
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

    // wire reset + scrollspy
    $("#resetBtn", host).addEventListener("click", () => {
      if (!confirm(`Reset your progress on the ${course.title} course?`)) return;
      done.clear(); saveDone(active, done);
      $$(".done-toggle input", host).forEach((cb) => (cb.checked = false));
      $$(".stage", host).forEach((c) => c.classList.remove("is-done"));
      refreshProgress();
    });

    // mount the interactive visual
    if (viz) {
      try { viz.mount($("#labMount", host)); }
      catch (err) { console.warn("viz mount failed for " + course.id, err); }
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

    // header ring: current course when one is open, whole platform on the home grid
    const ringPct = course ? pct : all.pct;
    const fill = $("#progFill"); if (fill) fill.style.width = pct + "%";
    const ptext = $("#progText"); if (ptext) ptext.textContent = `${n} / ${total} complete`;
    $("#progPct").textContent = ringPct + "%";
    $("#progRing").style.background =
      `conic-gradient(var(--accent) ${ringPct * 3.6}deg, var(--border) 0deg)`;
    $("#diagDone").textContent = course ? `${n} / ${total}` : "—";
    $("#diagPct").textContent = course ? pct + "%" : "—";
    const dAll = $("#diagAllDone"); if (dAll) dAll.textContent = `${all.n} / ${all.total}`;
    const dAllPct = $("#diagAllPct"); if (dAllPct) dAllPct.textContent = all.pct + "%";
    const oProg = $("#overviewProg");
    if (oProg) oProg.textContent = `${all.n} / ${all.total} stages · ${all.pct}%`;

    const greet = $("#greeting");
    if (greet) greet.textContent = !course ?
      (all.n === 0 ? "Pick a module." : `Overall: ${all.n}/${all.total} stages cleared.`) :
      n === 0 ? `${course.title}: ready when you are.` :
      n === total ? `${course.title}: complete. 🏁` :
      `${course.title}: ${n}/${total} cleared.`;

    $$(".jump-item").forEach((a) => a.classList.toggle("done", done.has(+a.dataset.n)));
    refreshSliceTiles();
  }

  function refreshSliceTiles() {
    courseList().forEach((c) => {
      const tile = $(`.slice[data-id="${c.id}"]`);
      if (!tile) return;
      const d = c.id === active ? done : doneFor(c.id);
      const total = c.stages.length;
      const pct = total ? Math.round((d.size / total) * 100) : 0;
      const f = $(".slice-prog-fill", tile); if (f) f.style.width = pct + "%";
      const cnt = $(".slice-count", tile); if (cnt) cnt.textContent = `${d.size} / ${total}`;
      const ring = $(".slice-ring", tile);
      if (ring) {
        ring.style.background = `conic-gradient(var(--accent) ${pct * 3.6}deg, var(--border) 0deg)`;
        $("span", ring).textContent = pct + "%";
      }
      const cb = $(".slice-done input", tile);
      if (cb) cb.checked = total > 0 && d.size === total;
      tile.classList.toggle("is-complete", total > 0 && d.size === total);
    });
  }

  /* =================================================================== */
  /* Slice menu + routing                                                */
  /* =================================================================== */
  function buildSlices() {
    const menu = $("#sliceMenu");
    courseList().forEach((c, i) => {
      const slice = document.createElement("div");
      slice.className = "slice";
      slice.dataset.id = c.id;
      slice.setAttribute("role", "link");
      slice.tabIndex = 0;
      slice.innerHTML = `
        <div class="slice-bg"></div>
        <div class="slice-inner">
          <span class="slice-num">${String(i + 1).padStart(2, "0")}</span>
          <div class="slice-ring" aria-hidden="true"><span>0%</span></div>
          <span class="slice-icon">${svg(c.icon)}</span>
          <h2 class="slice-title">${esc(c.title)}</h2>
          <p class="slice-blurb">${esc(c.blurb)}</p>
          <div class="slice-prog"><div class="slice-prog-fill"></div></div>
          <span class="slice-count">0 / ${c.stages.length}</span>
          <label class="slice-done" title="Tick when you have finished every stage of this module">
            <input type="checkbox" aria-label="Mark ${esc(c.title)} module complete">
            <span>module complete</span>
          </label>
        </div>`;
      slice.addEventListener("click", (e) => {
        if (e.target.closest(".slice-done")) return;   // checkbox, not navigation
        location.hash = "#" + c.id;
      });
      slice.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === " ") && !e.target.closest(".slice-done")) {
          e.preventDefault(); location.hash = "#" + c.id;
        }
      });
      $(".slice-done input", slice).addEventListener("change", (e) => {
        const set = e.target.checked ? new Set(c.stages.map((s) => s.n)) : new Set();
        saveDone(c.id, set);
        if (c.id === active) { done = doneFor(c.id); renderCourse(c); }
        refreshProgress();
      });
      menu.appendChild(slice);
    });
  }

  function selectCourse(id, anchor) {
    if (!window.COURSES[id]) return showOverview();
    active = id;
    done = doneFor(id);
    document.body.classList.remove("state-overview");
    document.body.classList.add("state-selected");
    $$(".slice").forEach((s) => s.classList.toggle("active", s.dataset.id === id));
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
    document.body.classList.add("state-overview");
    document.body.classList.remove("state-selected");
    $$(".slice").forEach((s) => s.classList.remove("active"));
    $("#courseHost").innerHTML = "";
    refreshProgress();
    refreshSliceTiles();
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

  /* ---------- navbar clock + diagnostics ---------- */
  // Header clock (#clockLocal/#tzName + click-to-cycle) is owned by the shared
  // module carino-clock.js; here we only keep the diag "Local time" row.
  function tickClock() {
    const now = new Date();
    const p = (x) => String(x).padStart(2, "0");
    const dc = $("#diagClock"); if (dc) dc.textContent = `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
  }
  function wireDiag() {
    const btn = $("#diagToggle"), box = $("#diagBox");
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = box.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (!box.contains(e.target) && e.target !== btn) {
        box.classList.remove("open"); btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.COURSES || !courseList().length) {
      $("#sliceMenu").innerHTML = '<p style="margin:auto;color:#888">No courses loaded.</p>';
      return;
    }
    buildSlices();
    wireDiag();
    const dCourses = $("#diagCourses");
    if (dCourses) dCourses.textContent = String(courseList().length);
    $("#brandHome").addEventListener("click", (e) => { e.preventDefault(); location.hash = ""; });
    window.addEventListener("hashchange", route);
    tickClock(); setInterval(tickClock, 1000);
    route();
  });
})();
