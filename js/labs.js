/* =====================================================================
   Carino Learn — inline mini-labs.
   viz.js gives every course its headline lab at the top of the page;
   this file adds smaller interactive widgets INSIDE the roadmap, each
   placed right after the stage that teaches its topic (`at: n`).
   Registered as window.COURSE_MINILABS[courseId] = [{at,title,blurb,mount}].
   Pure DOM/SVG, no libraries — same contract as viz.js.
   ===================================================================== */

(() => {
  "use strict";

  // merge-safe: course files may self-register their mini-labs before or
  // after this file loads (window.COURSE_MINILABS[courseId] = [...])
  const LABS = window.COURSE_MINILABS = window.COURSE_MINILABS || {};

  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;");
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (s) => esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

  /* =================================================================
     ASSEMBLY
     ================================================================= */
  LABS.assembly = [

    /* ---- at 3: the stack, live ---------------------------------- */
    {
      at: 3,
      title: "The stack, live",
      blurb:
        "Push, pop, call and return — and watch `rsp` crawl **down** through memory. " +
        "Try a `ret` when the top of the stack isn't a return address and see why " +
        "smashed stacks crash programs.",
      mount(host) {
        const BASE = 0x7ffc_d000;
        let cells, rax, msg;
        const reset = () => { cells = []; rax = 5n; msg = "stack is empty — rsp points at the base"; };
        reset();

        host.innerHTML = `
          <div class="viz stkviz">
            <div class="viz-ctrls wrap">
              <button class="viz-btn mono" data-a="pushrax">push rax</button>
              <button class="viz-btn mono" data-a="pushimm">push 0xdead</button>
              <button class="viz-btn mono" data-a="pop">pop rcx</button>
              <button class="viz-btn mono" data-a="call">call greet</button>
              <button class="viz-btn mono" data-a="ret">ret</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
            </div>
            <div class="stk-cols">
              <div class="stk-mem" data-r="mem"></div>
              <div class="asm-panel">
                <div class="viz-panel-h">registers</div>
                <div class="asm-regs" data-r="regs"></div>
                <div class="asm-msg" data-r="msg"></div>
              </div>
            </div>
          </div>`;

        const hexA = (a) => "0x" + a.toString(16);
        function paint() {
          const rsp = BASE - cells.length * 8;
          const rows = [];
          for (let k = Math.max(cells.length + 1, 5); k >= 0; k--) {
            const addr = BASE - k * 8;
            const cell = cells[k - 1];
            rows.push(`<div class="stk-cell ${cell ? "used" : ""} ${k === cells.length && cell ? "top" : ""} ${cell && cell.ra ? "ra" : ""}">
              <span class="stk-addr">${hexA(addr)}</span>
              <span class="stk-val">${cell ? esc(cell.v) : "·"}</span>
              ${k === cells.length ? '<span class="stk-rsp">← rsp</span>' : ""}
            </div>`);
          }
          $('[data-r="mem"]', host).innerHTML =
            `<div class="stk-hint">higher addresses ↑ (the base)</div>${rows.reverse().join("")}<div class="stk-hint">the stack grows ↓ this way</div>`;
          $('[data-r="regs"]', host).innerHTML = `
            <div class="asm-reg"><b>rsp</b><code>${hexA(rsp)}</code><span></span></div>
            <div class="asm-reg"><b>rax</b><code>${rax}</code><span></span></div>
            <div class="asm-reg"><b>rcx</b><code>${host._rcx ?? "?"}</code><span></span></div>`;
          $('[data-r="msg"]', host).innerHTML = fmt(msg);
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-a]"); if (!b) return;
          const a = b.dataset.a;
          if (a === "reset") { reset(); host._rcx = undefined; }
          else if (cells.length >= 7 && (a.startsWith("push") || a === "call")) msg = "stack full (for this demo) — pop something first";
          else if (a === "pushrax") { cells.push({ v: `rax = ${rax}` }); rax += 1n; msg = "`push rax`: rsp −= 8, then the value is written at the new rsp"; }
          else if (a === "pushimm") { cells.push({ v: "0xdead" }); msg = "an immediate works the same way — 8 bytes onto the stack, rsp −= 8"; }
          else if (a === "pop") {
            if (!cells.length) msg = "**pop on an empty stack** — real code reads whatever garbage lies beyond, then usually segfaults";
            else { const c = cells.pop(); host._rcx = c.v.replace("rax = ", ""); msg = "`pop rcx`: value read from rsp into rcx, then rsp += 8. The data is still in memory — just no longer 'on' the stack"; }
          }
          else if (a === "call") { cells.push({ v: "ret → line 42", ra: true }); msg = "`call` pushed the **return address** (the line after the call) and jumped into `greet`"; }
          else if (a === "ret") {
            if (!cells.length) msg = "nothing to return to — crash";
            else {
              const c = cells.pop();
              msg = c.ra ? "`ret` popped the return address into `rip` — execution resumes at line 42. Balanced call/ret, all is well"
                         : `\`ret\` popped **${c.v}** into \`rip\` and jumped there. That's not code — this is exactly how a smashed stack becomes a crash (or an exploit)`;
            }
          }
          paint();
        });
        paint();
      },
    },

    /* ---- at 8: syscall loadout ----------------------------------- */
    {
      at: 8,
      title: "Syscall loadout",
      blurb:
        "Every syscall is the same ritual: number in `rax`, arguments in `rdi rsi rdx`, " +
        "then `syscall`. Pick one and see its loadout, what the kernel does, and what " +
        "comes back.",
      mount(host) {
        const SYS = [
          { name: "write", n: 1,  args: [["rdi", "1", "fd 1 = stdout"], ["rsi", "&buf", "pointer to the bytes"], ["rdx", "14", "how many bytes"]],
            code: "mov rax, 1\nmov rdi, 1\nlea rsi, [msg]\nmov rdx, 14\nsyscall",
            eff: "kernel copies 14 bytes from your buffer to stdout → returns **14** in rax (bytes written)" },
          { name: "read", n: 0,   args: [["rdi", "0", "fd 0 = stdin"], ["rsi", "&buf", "where to put the bytes"], ["rdx", "64", "buffer size"]],
            code: "mov rax, 0\nmov rdi, 0\nlea rsi, [buf]\nmov rdx, 64\nsyscall",
            eff: "kernel **blocks** until input arrives, fills your buffer → returns bytes read in rax (0 = end of file)" },
          { name: "openat", n: 257, args: [["rdi", "-100", "AT_FDCWD: relative to cwd"], ["rsi", "&path", "pointer to \"log.txt\""], ["rdx", "0", "O_RDONLY"]],
            code: "mov rax, 257\nmov rdi, -100\nlea rsi, [path]\nmov rdx, 0\nsyscall",
            eff: "kernel resolves the path, checks permissions → returns a **new fd** (e.g. 3) in rax, or a negative errno" },
          { name: "getpid", n: 39, args: [],
            code: "mov rax, 39\nsyscall",
            eff: "no arguments at all — kernel just returns the calling process's **PID** in rax" },
          { name: "exit", n: 60,  args: [["rdi", "0", "the exit status"]],
            code: "mov rax, 60\nxor rdi, rdi\nsyscall",
            eff: "process is torn down; **nothing returns** — there is no instruction after this one from your program's point of view" },
        ];
        let cur = 0;
        host.innerHTML = `
          <div class="viz sysviz">
            <div class="viz-ctrls wrap" data-r="btns"></div>
            <div class="sys-cols">
              <pre class="sys-code" data-r="code"></pre>
              <div class="asm-panel">
                <div class="viz-panel-h">the loadout</div>
                <div class="asm-regs" data-r="regs"></div>
                <div class="asm-msg" data-r="eff"></div>
              </div>
            </div>
          </div>`;
        $('[data-r="btns"]', host).innerHTML = SYS.map((s, i) =>
          `<button class="viz-btn mono ${i === 0 ? "primary" : ""}" data-i="${i}">${s.name}(${s.n})</button>`).join("");
        function paint() {
          const s = SYS[cur];
          $$("[data-i]", host).forEach((b) => b.classList.toggle("primary", +b.dataset.i === cur));
          $('[data-r="code"]', host).textContent = s.code;
          $('[data-r="regs"]', host).innerHTML =
            `<div class="asm-reg hot"><b>rax</b><code>${s.n}</code><span>the syscall number</span></div>` +
            s.args.map(([r, v, d]) => `<div class="asm-reg"><b>${r}</b><code>${esc(v)}</code><span>${esc(d)}</span></div>`).join("");
          $('[data-r="eff"]', host).innerHTML = fmt(s.eff);
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-i]"); if (!b) return;
          cur = +b.dataset.i; paint();
        });
        paint();
      },
    },
  ];

  /* =================================================================
     BASH
     ================================================================= */
  LABS.bash = [

    /* ---- at 1: quoting x-ray ------------------------------------- */
    {
      at: 1,
      title: "Quoting x-ray",
      blurb:
        "The shell splits your line into an **argv** array **before** the program runs. " +
        "Click each command and see exactly what the program receives — with " +
        "`FILE=\"my report.txt\"` set and `a.txt`, `b.txt`, `my report.txt` in the directory.",
      mount(host) {
        const FILES = ["a.txt", "b.txt", "my report.txt"];
        const CASES = [
          { cmd: 'rm $FILE',        argv: ["rm", "my", "report.txt"],
            say: "**Unquoted**: the value is word-split at spaces. `rm` receives TWO arguments and deletes files called `my` and `report.txt` — not your file. This is the classic spaces-in-filenames bug." },
          { cmd: 'rm "$FILE"',      argv: ["rm", "my report.txt"],
            say: "**Double-quoted**: the variable expands but the result stays ONE word. This is the habit: `\"$var\"`, always, unless you know why not." },
          { cmd: "rm '$FILE'",      argv: ["rm", "$FILE"],
            say: "**Single-quoted**: no expansion at all. `rm` is told to delete a file literally named `$FILE` — which doesn't exist." },
          { cmd: "ls *.txt",        argv: ["ls", "a.txt", "b.txt", "my report.txt"],
            say: "**Glob**: the SHELL expands `*.txt` against the directory before `ls` runs — `ls` never sees the star, it sees three filenames." },
          { cmd: 'ls "*.txt"',      argv: ["ls", "*.txt"],
            say: "Quotes suppress globbing too: `ls` receives the literal string `*.txt` and will complain no such file exists." },
          { cmd: 'echo "today: $(date +%A)"', argv: ["echo", "today: Thursday"],
            say: "**Command substitution** runs inside double quotes: the inner command's output is spliced into the word. Single quotes would have blocked it." },
        ];
        let cur = 0;
        host.innerHTML = `
          <div class="viz qxviz">
            <div class="viz-ctrls wrap" data-r="cmds"></div>
            <div class="qx-argv" data-r="argv"></div>
            <p class="asm-msg" data-r="say"></p>
            <div class="qx-dir">directory: ${FILES.map((f) => `<code>${esc(f)}</code>`).join(" ")}</div>
          </div>`;
        $('[data-r="cmds"]', host).innerHTML = CASES.map((c, i) =>
          `<button class="viz-btn mono ${i === 0 ? "primary" : ""}" data-i="${i}">${esc(c.cmd)}</button>`).join("");
        function paint() {
          const c = CASES[cur];
          $$("[data-i]", host).forEach((b) => b.classList.toggle("primary", +b.dataset.i === cur));
          $('[data-r="argv"]', host).innerHTML = c.argv.map((a, i) =>
            `<div class="qx-cell"><span>argv[${i}]</span><code>${esc(a)}</code></div>`).join("");
          $('[data-r="say"]', host).innerHTML = fmt(c.say);
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-i]"); if (!b) return;
          cur = +b.dataset.i; paint();
        });
        paint();
      },
    },

    /* ---- at 5: exit codes & && || -------------------------------- */
    {
      at: 5,
      title: "Exit codes drive the chain",
      blurb:
        "`backup.sh && verify.sh || alert.sh` — flip each script between succeeding " +
        "and failing and watch the shell decide what runs. Everything hangs on `$?`.",
      mount(host) {
        const st = { backup: true, verify: true };
        host.innerHTML = `
          <div class="viz ecviz">
            <div class="viz-ctrls">
              <button class="viz-btn mono" data-t="backup">backup.sh → <b data-r="tb"></b></button>
              <button class="viz-btn mono" data-t="verify">verify.sh → <b data-r="tv"></b></button>
              <span class="viz-status">click to flip success / failure</span>
            </div>
            <div class="ec-chain" data-r="chain"></div>
            <p class="asm-msg" data-r="say"></p>
          </div>`;
        function paint() {
          $('[data-r="tb"]', host).textContent = st.backup ? "exit 0" : "exit 1";
          $('[data-r="tv"]', host).textContent = st.verify ? "exit 0" : "exit 1";
          const backupRan = true;
          const verifyRuns = st.backup;
          const verifyOk = verifyRuns && st.verify;
          const alertRuns = !st.backup || (verifyRuns && !st.verify);
          const finalCode = 0; // last command to run always succeeds in this demo
          const node = (name, ran, ok) =>
            `<div class="ec-node ${!ran ? "skip" : ok ? "ok" : "fail"}">
              <code>${name}</code><span>${!ran ? "skipped" : ok ? "ran → 0" : "ran → 1"}</span></div>`;
          $('[data-r="chain"]', host).innerHTML =
            node("backup.sh", backupRan, st.backup) +
            `<span class="ec-op">&&</span>` +
            node("verify.sh", verifyRuns, st.verify) +
            `<span class="ec-op">||</span>` +
            node("alert.sh", alertRuns, true) +
            `<span class="ec-final">$? = ${finalCode}</span>`;
          $('[data-r="say"]', host).innerHTML = fmt(
            !st.backup
              ? "`backup.sh` failed, so `&&` **short-circuits**: `verify.sh` never runs. The failure flows to `||`, which fires `alert.sh`."
              : !st.verify
              ? "`backup.sh` succeeded so `verify.sh` runs — but it fails, and that failure reaches `||`: `alert.sh` fires. Note the alert can't tell **which** step failed."
              : "Both succeed: `&&` lets each step proceed, and `||` sees success — `alert.sh` is **skipped**. The happy path is silent.");
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-t]"); if (!b) return;
          st[b.dataset.t] = !st[b.dataset.t]; paint();
        });
        paint();
      },
    },
  ];

  /* =================================================================
     GNU UTILS
     ================================================================= */
  LABS.gnu = [

    /* ---- at 4: find expression builder --------------------------- */
    {
      at: 4,
      title: "Build a find expression",
      blurb:
        "`find` is a tiny query language. Combine the four classic tests against this " +
        "fake project directory and watch the match list — and the command line — update.",
      mount(host) {
        const TREE = [
          { p: "./notes.txt",          t: "f", mb: 0.01, d: 2 },
          { p: "./backup.tar.gz",      t: "f", mb: 850,  d: 40 },
          { p: "./photos",             t: "d", mb: 0,    d: 400 },
          { p: "./photos/img_001.jpg", t: "f", mb: 4,    d: 400 },
          { p: "./photos/img_002.jpg", t: "f", mb: 5,    d: 400 },
          { p: "./src",                t: "d", mb: 0,    d: 5 },
          { p: "./src/main.c",         t: "f", mb: 0.02, d: 5 },
          { p: "./src/util.c",         t: "f", mb: 0.01, d: 90 },
          { p: "./src/build",          t: "d", mb: 0,    d: 5 },
          { p: "./src/build/app",      t: "f", mb: 12,   d: 5 },
          { p: "./tmp/cache.db",       t: "f", mb: 300,  d: 90 },
        ];
        const SLOTS = [
          { name: "type", opts: [["—", () => true], ["-type f", (x) => x.t === "f"], ["-type d", (x) => x.t === "d"]] },
          { name: "name", opts: [["—", () => true], ['-name "*.jpg"', (x) => x.p.endsWith(".jpg")], ['-name "*.c"', (x) => x.p.endsWith(".c")], ['-name "img_*"', (x) => /\/img_[^/]*$/.test(x.p)]] },
          { name: "size", opts: [["—", () => true], ["-size +100M", (x) => x.mb > 100], ["-size -1M", (x) => x.mb < 1]] },
          { name: "age",  opts: [["—", () => true], ["-mtime -7", (x) => x.d < 7], ["-mtime +30", (x) => x.d > 30]] },
        ];
        const sel = [1, 0, 0, 0];
        host.innerHTML = `
          <div class="viz gnuviz">
            <div class="gnu-slots" data-r="slots"></div>
            <div class="gnu-cmdline"><span class="prompt">$</span> <code data-r="cmd"></code></div>
            <div class="gnu-flow" data-r="flow"></div>
          </div>`;
        $('[data-r="slots"]', host).innerHTML = SLOTS.map((s, i) => `
          <label class="gnu-slot">
            <span class="gnu-slot-name">${esc(s.name)}</span>
            <select data-s="${i}">${s.opts.map((o, j) =>
              `<option value="${j}" ${sel[i] === j ? "selected" : ""}>${esc(o[0])}</option>`).join("")}</select>
          </label>`).join("");
        function paint() {
          const parts = ["find ."], fns = [];
          SLOTS.forEach((s, i) => {
            const [label, fn] = s.opts[sel[i]];
            if (label !== "—") { parts.push(label); fns.push(fn); }
          });
          const hits = TREE.filter((x) => fns.every((f) => f(x)));
          $('[data-r="cmd"]', host).textContent = parts.join(" ");
          $('[data-r="flow"]', host).innerHTML = `
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>the directory</code><span>${TREE.length} entries</span></div>
              <pre class="gnu-pane-b">${TREE.map((x) => `${x.t === "d" ? "d" : "-"} ${String(x.mb).padStart(6)}M ${String(x.d).padStart(3)}d ${esc(x.p)}`).join("\n")}</pre>
            </div>
            <div class="gnu-arrow">⇢</div>
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>matches</code><span>${hits.length} hit${hits.length === 1 ? "" : "s"}</span></div>
              <pre class="gnu-pane-b">${hits.map((x) => esc(x.p)).join("\n") || "∅  (no file passes every test)"}</pre>
            </div>`;
        }
        host.addEventListener("change", (e) => {
          const s = e.target.closest("[data-s]"); if (!s) return;
          sel[+s.dataset.s] = +s.value; paint();
        });
        paint();
      },
    },

    /* ---- at 5: grep, flag by flag -------------------------------- */
    {
      at: 5,
      title: "grep, flag by flag",
      blurb:
        "Same file, same pattern — completely different output depending on the flags. " +
        "Toggle them one at a time and watch what `-i`, `-v`, `-w`, `-n` and `-c` each change.",
      mount(host) {
        const TEXT = [
          "2026-07-24 08:01 INFO  service started",
          "2026-07-24 08:15 ERROR disk /dev/sda1 87% full",
          "2026-07-24 08:16 error retrying disk check",
          "2026-07-24 09:02 WARN  certificate expires in 12 days",
          "2026-07-24 09:40 INFO  errors_total counter reset",
          "2026-07-24 10:11 Error timeout talking to db",
        ];
        const PATTERNS = ["ERROR", "error", "disk", "^2026-07-24 09"];
        let pat = "ERROR";
        const flags = { i: false, v: false, w: false, n: false, c: false };
        host.innerHTML = `
          <div class="viz grpviz">
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">pattern</span>
              ${PATTERNS.map((p) => `<button class="viz-btn mono ${p === pat ? "primary" : ""}" data-p="${esc(p)}">${esc(p)}</button>`).join("")}
              <span class="gnu-slot-name">flags</span>
              ${Object.keys(flags).map((f) => `<button class="viz-btn mono" data-f="${f}">-${f}</button>`).join("")}
            </div>
            <div class="gnu-cmdline"><span class="prompt">$</span> <code data-r="cmd"></code></div>
            <pre class="rx-text" data-r="out"></pre>
            <p class="asm-msg" data-r="say"></p>
          </div>`;
        const SAY = {
          base: "no flags: print every line containing the pattern, case-sensitively.",
          i: "`-i` folds case: ERROR, error and Error all match.",
          v: "`-v` inverts: print the lines that do **NOT** match — grep as a filter-out.",
          w: "`-w` requires whole words: `error` no longer matches inside `errors_total`.",
          n: "`-n` prefixes the line number — the format editors and `grep -rn` use.",
          c: "`-c` throws the lines away and prints only the **count** of matching lines.",
        };
        function paint() {
          $$("[data-p]", host).forEach((b) => b.classList.toggle("primary", b.dataset.p === pat));
          $$("[data-f]", host).forEach((b) => b.classList.toggle("on", flags[b.dataset.f]));
          const fl = Object.keys(flags).filter((f) => flags[f]);
          $('[data-r="cmd"]', host).textContent =
            `grep ${fl.map((f) => "-" + f).join(" ")}${fl.length ? " " : ""}'${pat}' app.log`;
          let src = pat.replace(/[.*+?()[\]\\$]/g, "\\$&");
          if (pat.startsWith("^")) src = "^" + pat.slice(1).replace(/[.*+?()[\]\\$]/g, "\\$&");
          if (flags.w) src = "\\b(?:" + src + ")\\b";
          const re = new RegExp(src, flags.i ? "gi" : "g");
          const rows = [];
          let count = 0;
          TEXT.forEach((line, li) => {
            re.lastIndex = 0;
            const hit = re.test(line);
            const keep = flags.v ? !hit : hit;
            if (!keep) return;
            count++;
            if (flags.c) return;
            re.lastIndex = 0;
            const marked = flags.v ? esc(line)
              : esc(line).replace(new RegExp(src, flags.i ? "gi" : "g"), (m) => `<mark class="rx-m0">${m}</mark>`);
            rows.push((flags.n ? `<span class="t-num">${li + 1}:</span>` : "") + marked);
          });
          $('[data-r="out"]', host).innerHTML = flags.c ? `<span class="t-num">${count}</span>` :
            rows.join("\n") || '<span class="ln-dim">(no matching lines)</span>';
          const active = Object.keys(flags).filter((f) => flags[f]);
          $('[data-r="say"]', host).innerHTML = fmt(active.length ? active.map((f) => SAY[f]).join(" ") : SAY.base);
        }
        host.addEventListener("click", (e) => {
          const p = e.target.closest("[data-p]");
          if (p) { pat = p.dataset.p; paint(); return; }
          const f = e.target.closest("[data-f]");
          if (f) { flags[f.dataset.f] = !flags[f.dataset.f]; paint(); }
        });
        paint();
      },
    },

    /* ---- at 9: sed & awk, before/after --------------------------- */
    {
      at: 9,
      title: "sed & awk, before → after",
      blurb:
        "One small CSV, six classic one-liners. Click each and compare the panes: " +
        "sed edits the **stream**, awk thinks in **fields**.",
      mount(host) {
        const CSV = ["name,dept,hours", "ana,eng,38", "bruno,ops,45", "carla,eng,41", "diego,sales,29"];
        const OPS = [
          { cmd: "sed 's/eng/engineering/'", fn: (ls) => ls.map((l) => l.replace("eng", "engineering")),
            say: "substitute: first occurrence per line. Note it also hit the header? No — no `eng` there. But watch `s/an/AN/` style traps: sed knows characters, not fields." },
          { cmd: "sed '/ops/d'", fn: (ls) => ls.filter((l) => !l.includes("ops")),
            say: "`d` deletes every line matching the pattern — grep -v in sed clothing." },
          { cmd: "sed -n '2,3p'", fn: (ls) => ls.slice(1, 3),
            say: "`-n` silences the default print; `2,3p` prints only lines 2 to 3. sed addresses lines by number as happily as by pattern." },
          { cmd: "awk -F, '{print $1}'", fn: (ls) => ls.map((l) => l.split(",")[0]),
            say: "awk splits each line on `-F,` and gives you the pieces: `$1` is the first field. Column extraction with zero counting of characters." },
          { cmd: "awk -F, '$3 > 40 {print $1, $3}'", fn: (ls) => ls.filter((l) => +l.split(",")[2] > 40).map((l) => { const f = l.split(","); return f[0] + " " + f[2]; }),
            say: "pattern → action: only rows where field 3 beats 40 run the print. (The header fails `>40` because a non-number compares as 0.)" },
          { cmd: "awk -F, 'NR>1 {s+=$3} END {print s}'", fn: (ls) => [String(ls.slice(1).reduce((s, l) => s + +l.split(",")[2], 0))],
            say: "`NR>1` skips the header, each row adds to `s`, and `END` runs once after the last line — awk as a tiny report generator." },
        ];
        let cur = 0;
        host.innerHTML = `
          <div class="viz sawviz">
            <div class="viz-ctrls wrap" data-r="ops"></div>
            <div class="gnu-flow" data-r="flow"></div>
            <p class="asm-msg" data-r="say"></p>
          </div>`;
        $('[data-r="ops"]', host).innerHTML = OPS.map((o, i) =>
          `<button class="viz-btn mono ${i === 0 ? "primary" : ""}" data-i="${i}">${esc(o.cmd)}</button>`).join("");
        function paint() {
          const o = OPS[cur];
          $$("[data-i]", host).forEach((b) => b.classList.toggle("primary", +b.dataset.i === cur));
          const out = o.fn(CSV);
          $('[data-r="flow"]', host).innerHTML = `
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>people.csv</code><span>${CSV.length} lines</span></div>
              <pre class="gnu-pane-b">${esc(CSV.join("\n"))}</pre>
            </div>
            <div class="gnu-arrow">⇢</div>
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>${esc(o.cmd)}</code><span>${out.length} line${out.length === 1 ? "" : "s"}</span></div>
              <pre class="gnu-pane-b">${esc(out.join("\n")) || "∅"}</pre>
            </div>`;
          $('[data-r="say"]', host).innerHTML = fmt(o.say);
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-i]"); if (!b) return;
          cur = +b.dataset.i; paint();
        });
        paint();
      },
    },
  ];

  /* =================================================================
     LINUX
     ================================================================= */
  LABS.linux = [

    /* ---- at 4: systemd lifecycle --------------------------------- */
    {
      at: 4,
      title: "A unit's life",
      blurb:
        "`start` is not `enable` — one is **now**, the other is **at boot**. Drive this fake " +
        "`nginx.service` through its states, crash it, reboot the box, and read the " +
        "`systemctl status` output like an admin.",
      mount(host) {
        const st = { active: false, enabled: false, failed: false };
        host.innerHTML = `
          <div class="viz sdviz">
            <div class="viz-ctrls wrap">
              <button class="viz-btn mono" data-a="start">systemctl start</button>
              <button class="viz-btn mono" data-a="stop">systemctl stop</button>
              <button class="viz-btn mono" data-a="enable">systemctl enable</button>
              <button class="viz-btn mono" data-a="disable">systemctl disable</button>
              <button class="viz-btn mono" data-a="crash">💥 process crashes</button>
              <button class="viz-btn mono" data-a="reboot">⟳ reboot the box</button>
            </div>
            <pre class="sd-status" data-r="stat"></pre>
            <p class="asm-msg" data-r="say"></p>
          </div>`;
        let say = "fresh install: the unit is loaded but neither running nor enabled.";
        function paint() {
          const dot = st.failed ? "●" : st.active ? "●" : "○";
          const dotCls = st.failed ? "sd-red" : st.active ? "sd-green" : "sd-dim";
          const activeLine = st.failed ? "failed (Result: exit-code)" : st.active ? "active (running) since Thu 2026-07-24 09:00:12" : "inactive (dead)";
          $('[data-r="stat"]', host).innerHTML =
            `<span class="${dotCls}">${dot}</span> nginx.service - The nginx HTTP server\n` +
            `     Loaded: loaded (/usr/lib/systemd/system/nginx.service; <b>${st.enabled ? "enabled" : "disabled"}</b>; preset: disabled)\n` +
            `     Active: <b class="${dotCls}">${activeLine}</b>\n` +
            (st.active ? `   Main PID: 1204 (nginx)\n     Memory: 12.4M` : st.failed ? `    Process: 1204 ExitStatus=1 (FAILURE)` : `             (not running)`);
          $('[data-r="say"]', host).innerHTML = fmt(say);
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-a]"); if (!b) return;
          const a = b.dataset.a;
          if (a === "start")   { st.active = true; st.failed = false; say = "`start` launches it **now**. Boot behaviour is untouched — check the Loaded line."; }
          if (a === "stop")    { st.active = false; st.failed = false; say = "`stop` kills it now; if it's enabled it will **still** come back at next boot."; }
          if (a === "enable")  { st.enabled = true; say = "`enable` creates the boot-time symlink. It does **not** start anything now — use `enable --now` for both."; }
          if (a === "disable") { st.enabled = false; say = "`disable` removes the boot symlink; a running instance keeps running until stopped."; }
          if (a === "crash")   { if (st.active) { st.active = false; st.failed = true; say = "the process died: state **failed**, exit code kept for the post-mortem. `journalctl -u nginx` is your next command; `systemctl reset-failed` clears the flag."; } else say = "it wasn't running — nothing to crash."; }
          if (a === "reboot")  { st.failed = false; st.active = st.enabled; say = st.enabled ? "reboot: **enabled** units start automatically — it's running again." : "reboot: it's disabled, so it stayed down. This is the start-vs-enable trap: 'it worked until we rebooted'."; }
          paint();
        });
        paint();
      },
    },

    /* ---- at 6: processes & signals ------------------------------- */
    {
      at: 6,
      title: "Signals at work",
      blurb:
        "Pick a process, send it a signal, watch the `ps` table react. `video_encode` " +
        "traps SIGTERM and ignores it — meet the difference between **asking** and **forcing**.",
      mount(host) {
        const fresh = () => ([
          { pid: 1204, name: "nginx",        state: "S", alive: true, note: "" },
          { pid: 2117, name: "backup.sh",    state: "S", alive: true, note: "" },
          { pid: 2450, name: "video_encode", state: "R", alive: true, note: "traps SIGTERM", stubborn: true },
        ]);
        let procs = fresh(), selPid = 1204, log = "select a process, pick a signal.";
        host.innerHTML = `
          <div class="viz sigviz">
            <div class="ps-table" data-r="ps"></div>
            <div class="viz-ctrls wrap">
              ${["TERM", "KILL", "STOP", "CONT", "HUP"].map((s) => `<button class="viz-btn mono" data-sig="${s}">kill -${s}</button>`).join("")}
              <button class="viz-btn" data-sig="__reset">Reset ⟲</button>
            </div>
            <p class="asm-msg" data-r="log"></p>
          </div>`;
        function paint() {
          $('[data-r="ps"]', host).innerHTML =
            `<div class="ps-row ps-head"><span>PID</span><span>STAT</span><span>COMMAND</span><span></span></div>` +
            procs.map((p) => `
              <div class="ps-row ${p.pid === selPid ? "sel" : ""} ${!p.alive ? "dead" : ""}" data-pid="${p.pid}">
                <span>${p.pid}</span><span>${p.alive ? p.state : "✝"}</span><span>${esc(p.name)}</span><span class="ps-note">${esc(p.note)}</span>
              </div>`).join("");
          $('[data-r="log"]', host).innerHTML = fmt(log);
        }
        host.addEventListener("click", (e) => {
          const row = e.target.closest("[data-pid]");
          if (row) { selPid = +row.dataset.pid; log = `selected PID ${selPid}.`; paint(); return; }
          const b = e.target.closest("[data-sig]"); if (!b) return;
          if (b.dataset.sig === "__reset") { procs = fresh(); selPid = 1204; log = "everything back."; paint(); return; }
          const sig = b.dataset.sig;
          const p = procs.find((x) => x.pid === selPid);
          if (!p || !p.alive) { log = "that PID is gone — `kill` would answer **No such process**."; paint(); return; }
          if (sig === "TERM") {
            if (p.stubborn) { p.note = "caught SIGTERM, kept going"; log = "**SIGTERM is a request.** This process installed a handler and chose to ignore it. Polite asking has limits."; }
            else { p.alive = false; p.note = "exited cleanly (saved state)"; log = "**SIGTERM** delivered: the process ran its cleanup handler and exited. This is why TERM-first is the professional habit."; }
          } else if (sig === "KILL") {
            p.alive = false; p.note = "killed by the kernel";
            log = "**SIGKILL never reaches the process** — the kernel simply removes it. No cleanup, no goodbye, temp files left behind. The last resort, not the first.";
          } else if (sig === "STOP") {
            if (p.state !== "T") { p.state = "T"; log = "**SIGSTOP**: frozen mid-instruction (state `T`). Like KILL, it cannot be caught. The process doesn't even know."; }
            else log = "already stopped.";
          } else if (sig === "CONT") {
            if (p.state === "T") { p.state = p.stubborn ? "R" : "S"; log = "**SIGCONT**: thawed exactly where it froze. STOP/CONT is free pause/resume for any program."; }
            else log = "it isn't stopped — CONT does nothing.";
          } else if (sig === "HUP") {
            if (p.name === "nginx") { p.note = "re-read nginx.conf"; log = "daemons repurpose **SIGHUP** as **reload your config** — nginx re-reads its files without dropping a single connection."; }
            else { p.alive = false; p.note = "hung up"; log = "for ordinary processes **SIGHUP** ('terminal hung up') is fatal by default — this is what `nohup` exists to shield against."; }
          }
          paint();
        });
        paint();
      },
    },
  ];

  /* =================================================================
     NETWORKING
     ================================================================= */
  LABS.networking = [

    /* ---- at 2: subnet splitter ----------------------------------- */
    {
      at: 2,
      title: "Subnet splitter",
      blurb:
        "An IP address is one number wearing a mask. Drag the prefix and watch the " +
        "**network bits** (gold) and **host bits** (grey) trade territory — every derived " +
        "value updates live.",
      mount(host) {
        const ip2int = (s) => s.split(".").reduce((a, o) => ((a << 8) >>> 0) + +o, 0) >>> 0;
        const int2ip = (n) => [24, 16, 8, 0].map((sh) => (n >>> sh) & 255).join(".");
        let ip = "192.168.1.130", prefix = 24, other = "192.168.1.200";
        const IPS = ["192.168.1.130", "10.7.20.66", "172.16.44.9"];
        const OTHERS = ["192.168.1.200", "192.168.2.14", "10.7.31.250", "8.8.8.8"];
        host.innerHTML = `
          <div class="viz subviz">
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">host</span>
              ${IPS.map((x) => `<button class="viz-btn mono" data-ip="${x}">${x}</button>`).join("")}
              <label class="sub-slider">/<b data-r="p"></b>
                <input type="range" min="8" max="30" value="24" data-r="range" aria-label="Prefix length"></label>
            </div>
            <div class="sub-bin" data-r="bin"></div>
            <div class="lnx-read" data-r="outs"></div>
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">same subnet as…</span>
              ${OTHERS.map((x) => `<button class="viz-btn mono" data-o="${x}">${x}</button>`).join("")}
              <span class="viz-status" data-r="verdict"></span>
            </div>
          </div>`;
        function paint() {
          const n = ip2int(ip);
          const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
          const net = (n & mask) >>> 0;
          const bcast = (net | (~mask >>> 0)) >>> 0;
          const hosts = prefix >= 31 ? 0 : Math.pow(2, 32 - prefix) - 2;
          $('[data-r="p"]', host).textContent = prefix;
          $$("[data-ip]", host).forEach((b) => b.classList.toggle("primary", b.dataset.ip === ip));
          $$("[data-o]", host).forEach((b) => b.classList.toggle("primary", b.dataset.o === other));
          const bits = [...Array(32)].map((_, i) => {
            const bit = (n >>> (31 - i)) & 1;
            const cls = i < prefix ? "net" : "host";
            return `<span class="sub-bit ${cls}">${bit}</span>${(i % 8 === 7 && i < 31) ? '<span class="sub-dot">·</span>' : ""}`;
          }).join("");
          $('[data-r="bin"]', host).innerHTML =
            `<div class="sub-ipline"><code>${ip}/${prefix}</code><span><i class="sub-key net"></i> network bits <i class="sub-key host"></i> host bits</span></div>
             <div class="sub-bits">${bits}</div>`;
          $('[data-r="outs"]', host).innerHTML = [
            ["netmask", int2ip(mask)],
            ["network", int2ip(net)],
            ["broadcast", int2ip(bcast)],
            ["host range", hosts > 0 ? `${int2ip(net + 1)} – ${int2ip(bcast - 1)}` : "—"],
            ["usable hosts", hosts.toLocaleString()],
          ].map(([k, v]) => `<div class="lnx-out"><span>${k}</span><code>${v}</code></div>`).join("");
          const on = ip2int(other);
          const same = ((on & mask) >>> 0) === net;
          const v = $('[data-r="verdict"]', host);
          v.innerHTML = same
            ? `✓ same subnet → talks <b>directly</b> (ARP, no router)`
            : `✗ different subnet → traffic goes <b>via the gateway</b>`;
        }
        host.addEventListener("input", (e) => {
          if (e.target.matches('[data-r="range"]')) { prefix = +e.target.value; paint(); }
        });
        host.addEventListener("click", (e) => {
          const i = e.target.closest("[data-ip]");
          if (i) { ip = i.dataset.ip; paint(); return; }
          const o = e.target.closest("[data-o]");
          if (o) { other = o.dataset.o; paint(); }
        });
        paint();
      },
    },

    /* ---- at 10: firewall gatekeeper ------------------------------ */
    {
      at: 10,
      title: "The gatekeeper",
      blurb:
        "Four services listen on this server. Set each port's rule to **accept**, " +
        "**reject** or **drop**, then read what a client experiences and what an " +
        "`nmap` scan reports — reject and drop feel very different from outside.",
      mount(host) {
        const PORTS = [
          { port: 22,   svc: "ssh",      rule: "accept" },
          { port: 80,   svc: "http",     rule: "accept" },
          { port: 443,  svc: "https",    rule: "accept" },
          { port: 5432, svc: "postgres", rule: "drop" },
        ];
        const RULES = ["accept", "reject", "drop"];
        const FEEL = {
          accept: ["connection established ✓", "open"],
          reject: ["instant “connection refused” (RST/ICMP came back)", "closed"],
          drop:   ["…hangs, then times out (nothing came back)", "filtered"],
        };
        host.innerHTML = `
          <div class="viz fwviz">
            <div class="fw-rows" data-r="rows"></div>
            <div class="gnu-flow">
              <div class="gnu-pane">
                <div class="gnu-pane-h"><code>what the client feels</code></div>
                <pre class="gnu-pane-b" data-r="feel"></pre>
              </div>
              <div class="gnu-arrow">⇢</div>
              <div class="gnu-pane">
                <div class="gnu-pane-h"><code>nmap server.example</code></div>
                <pre class="gnu-pane-b" data-r="nmap"></pre>
              </div>
            </div>
            <p class="asm-msg">**reject** answers honestly ("there's a door, it's shut"); **drop** pretends the machine isn't there — slower for attackers to scan, but also harder for **you** to debug.</p>
          </div>`;
        $$(".asm-msg", host)[0].innerHTML = fmt($$(".asm-msg", host)[0].textContent);
        function paint() {
          $('[data-r="rows"]', host).innerHTML = PORTS.map((p, i) => `
            <div class="fw-row">
              <code class="fw-port">${p.port}/tcp</code><span class="fw-svc">${p.svc}</span>
              ${RULES.map((r) => `<button class="viz-btn mono ${p.rule === r ? "on" : ""}" data-i="${i}" data-rule="${r}">${r}</button>`).join("")}
            </div>`).join("");
          $('[data-r="feel"]', host).textContent =
            PORTS.map((p) => `curl :${p.port}  → ${FEEL[p.rule][0]}`).join("\n");
          $('[data-r="nmap"]', host).textContent =
            "PORT      STATE     SERVICE\n" +
            PORTS.map((p) => `${(p.port + "/tcp").padEnd(9)} ${FEEL[p.rule][1].padEnd(9)} ${p.svc}`).join("\n");
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-rule]"); if (!b) return;
          PORTS[+b.dataset.i].rule = b.dataset.rule; paint();
        });
        paint();
      },
    },
  ];

  /* =================================================================
     BROWSER
     ================================================================= */
  LABS.browser = [

    /* ---- at 2: the event loop, stepped --------------------------- */
    {
      at: 2,
      title: "The event loop, stepped",
      blurb:
        "Four lines of JavaScript, one famous puzzle: in what order do A, B, C, D print? " +
        "Step the loop and watch the call stack, the **microtask** queue and the **task** " +
        "queue fight it out.",
      mount(host) {
        const CODE = [
          'console.log("A");',
          'setTimeout(() => log("D"));',
          'Promise.resolve().then(() => log("C"));',
          'console.log("B");',
        ];
        const STEPS = [
          { line: 0, stack: ["script"], micro: [], macro: [], out: ["A"], say: "synchronous code runs immediately on the call stack: **A** prints." },
          { line: 1, stack: ["script"], micro: [], macro: ["timeout cb"], out: ["A"], say: "`setTimeout` hands its callback to the browser; even with 0 ms it goes to the **task (macrotask) queue** — never straight onto the stack." },
          { line: 2, stack: ["script"], micro: ["then cb"], macro: ["timeout cb"], out: ["A"], say: "the resolved promise queues its `.then` on the **microtask queue** — a separate, higher-priority line." },
          { line: 3, stack: ["script"], micro: ["then cb"], macro: ["timeout cb"], out: ["A", "B"], say: "still synchronous: **B** prints. The script is about to finish — the stack will empty." },
          { line: -1, stack: [], micro: ["then cb"], macro: ["timeout cb"], out: ["A", "B"], say: "stack empty. The loop's rule: **drain ALL microtasks before touching the task queue**." },
          { line: -1, stack: ["then cb"], micro: [], macro: ["timeout cb"], out: ["A", "B", "C"], say: "the microtask runs: **C**. Promises always beat timeouts — this is why." },
          { line: -1, stack: ["timeout cb"], micro: [], macro: [], out: ["A", "B", "C", "D"], say: "only now does the task queue get a turn: **D**. Final order **A B C D** — and now you can predict it every time." },
        ];
        let i = 0;
        host.innerHTML = `
          <div class="viz elviz">
            <div class="viz-ctrls">
              <button class="viz-btn primary" data-a="step">Step ▸</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <div class="el-cols">
              <pre class="el-code" data-r="code"></pre>
              <div class="el-q"><div class="viz-panel-h">call stack</div><div class="el-list" data-r="stack"></div></div>
              <div class="el-q"><div class="viz-panel-h">microtasks</div><div class="el-list" data-r="micro"></div></div>
              <div class="el-q"><div class="viz-panel-h">task queue</div><div class="el-list" data-r="macro"></div></div>
              <div class="el-q"><div class="viz-panel-h">console</div><div class="el-list el-out" data-r="out"></div></div>
            </div>
            <p class="asm-msg" data-r="say"></p>
          </div>`;
        const cell = (t, hot) => `<div class="el-item ${hot ? "hot" : ""}">${esc(t)}</div>`;
        function paint() {
          const s = STEPS[i];
          $('[data-r="code"]', host).innerHTML = CODE.map((l, li) =>
            `<span class="${li === s.line ? "el-cur" : ""}">${esc(l)}</span>`).join("\n");
          $('[data-r="stack"]', host).innerHTML = s.stack.map((x, xi) => cell(x, xi === s.stack.length - 1)).join("") || '<span class="ln-dim">empty</span>';
          $('[data-r="micro"]', host).innerHTML = s.micro.map((x) => cell(x)).join("") || '<span class="ln-dim">—</span>';
          $('[data-r="macro"]', host).innerHTML = s.macro.map((x) => cell(x)).join("") || '<span class="ln-dim">—</span>';
          $('[data-r="out"]', host).innerHTML = s.out.map((x) => cell(x, x === s.out[s.out.length - 1])).join("") || '<span class="ln-dim">—</span>';
          $('[data-r="say"]', host).innerHTML = fmt(s.say);
          $('[data-r="stat"]', host).textContent = `step ${i + 1} / ${STEPS.length}`;
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-a]"); if (!b) return;
          if (b.dataset.a === "reset") i = 0; else i = Math.min(i + 1, STEPS.length - 1);
          paint();
        });
        paint();
      },
    },

    /* ---- at 6: same-origin checker ------------------------------- */
    {
      at: 6,
      title: "Same-origin checker",
      blurb:
        "Your page lives at `https://shop.example`. Build a second URL from parts and " +
        "see whether the browser calls it the **same origin** — and exactly what that " +
        "unlocks or blocks. Scheme + host + port: all three must match.",
      mount(host) {
        const A = { scheme: "https", hostn: "shop.example", port: "443" };
        const sel = { scheme: "https", hostn: "api.shop.example", port: "443" };
        const OPTS = {
          scheme: ["https", "http"],
          hostn: ["shop.example", "api.shop.example", "evil.example"],
          port: ["443", "8443"],
        };
        let cors = false;
        host.innerHTML = `
          <div class="viz soviz">
            <div class="so-urls">
              <div class="so-url"><span class="gnu-slot-name">your page</span><code>https://shop.example<span class="ln-dim">:443</span></code></div>
              <div class="so-url"><span class="gnu-slot-name">the other URL</span>
                ${Object.keys(OPTS).map((k) => `<select data-k="${k}">${OPTS[k].map((o) =>
                  `<option ${o === sel[k] ? "selected" : ""}>${o}</option>`).join("")}</select>`).join('<span class="so-sep">·</span>')}
              </div>
            </div>
            <div class="viz-ctrls">
              <span class="viz-status" data-r="verdict"></span>
              <button class="viz-btn mono" data-a="cors">server sends Access-Control-Allow-Origin</button>
            </div>
            <div class="lnx-users" data-r="rows"></div>
            <p class="asm-msg" data-r="say"></p>
          </div>`;
        function paint() {
          const same = sel.scheme === A.scheme && sel.hostn === A.hostn && sel.port === A.port;
          $('[data-a="cors"]', host).classList.toggle("on", cors);
          $('[data-r="verdict"]', host).innerHTML = same
            ? `<b>SAME origin</b> — scheme, host and port all match`
            : `<b>DIFFERENT origin</b> — mismatch on ${[
                sel.scheme !== A.scheme && "scheme",
                sel.hostn !== A.hostn && "host",
                sel.port !== A.port && "port"].filter(Boolean).join(" + ")}`;
          const rows = [
            ["read its DOM / variables", same, "cross-origin window access is walled off, full stop — CORS cannot open this"],
            ["fetch() and read the response", same || cors, cors && !same ? "allowed only because the **server** opted in with CORS headers" : "blocked until the server opts in with CORS"],
            ["send its cookies with a request", same || sel.hostn.endsWith("shop.example"), "cookies follow the **site**, not the full origin — subdomains can share them"],
            ["run scripts FROM it (<script src>)", true, "script/img/css loading was always allowed cross-origin — that's the old web; reading the **content** is what's restricted"],
          ];
          $('[data-r="rows"]', host).innerHTML = rows.map(([label, ok, note]) => `
            <div class="lnx-user"><div class="lnx-user-h">${esc(label)}</div>
              <span class="lnx-can ${ok ? "yes" : "no"}">${ok ? "✓ allowed" : "✗ blocked"}</span>
              <div class="lnx-verdict">${esc(note)}</div>
            </div>`).join("");
          $('[data-r="say"]', host).innerHTML = fmt(same
            ? "Same origin: the page is talking to itself — no restrictions apply."
            : "Different origin: the browser assumes the two sites are strangers. `evil.example` opening your bank in an iframe and reading your balance is exactly what this rule prevents.");
        }
        host.addEventListener("change", (e) => {
          const s = e.target.closest("[data-k]"); if (!s) return;
          sel[s.dataset.k] = s.value; paint();
        });
        host.addEventListener("click", (e) => {
          if (e.target.closest('[data-a="cors"]')) { cors = !cors; paint(); }
        });
        paint();
      },
    },
  ];

  /* =================================================================
     REGEX
     ================================================================= */
  LABS.regex = [

    /* ---- at 6: greedy vs lazy ------------------------------------ */
    {
      at: 6,
      title: "Greedy vs lazy, on one string",
      blurb:
        "Three ways to write “match a tag”, three very different results on " +
        "`<b>bold</b> and <i>italic</i>`. Click each pattern and study what got highlighted.",
      mount(host) {
        const S = "<b>bold</b> and <i>italic</i>";
        const PATS = [
          { p: "<.*>",    say: "**Greedy**: `.*` grabs as much as it can while still letting the final `>` match — so it swallows from the first `<` to the LAST `>`. One giant match. Almost never what you meant." },
          { p: "<.*?>",   say: "**Lazy**: `.*?` takes as little as possible, stopping at the first `>` that works. Four tidy matches. Correct — but the engine tip-toes forward character by character." },
          { p: "<[^>]*>", say: "**Negated class**: “anything that isn't `>`, then `>`”. Same four matches as lazy, but the intent is explicit and the engine never backtracks — the professional's choice." },
        ];
        let cur = 0;
        host.innerHTML = `
          <div class="viz glviz">
            <div class="viz-ctrls wrap" data-r="pats"></div>
            <pre class="rx-text" data-r="text"></pre>
            <p class="asm-msg" data-r="say"></p>
          </div>`;
        $('[data-r="pats"]', host).innerHTML = PATS.map((x, i) =>
          `<button class="viz-btn mono ${i === 0 ? "primary" : ""}" data-i="${i}">${esc(x.p)}</button>`).join("") +
          `<span class="viz-status" data-r="stat"></span>`;
        function paint() {
          const x = PATS[cur];
          $$("[data-i]", host).forEach((b) => b.classList.toggle("primary", +b.dataset.i === cur));
          const re = new RegExp(x.p, "g");
          let html = "", last = 0, m, n = 0;
          while ((m = re.exec(S))) {
            html += esc(S.slice(last, m.index)) + `<mark class="rx-m${n % 2}">${esc(m[0])}</mark>`;
            last = m.index + m[0].length; n++;
          }
          html += esc(S.slice(last));
          $('[data-r="text"]', host).innerHTML = html;
          $('[data-r="stat"]', host).textContent = `${n} match${n === 1 ? "" : "es"}`;
          $('[data-r="say"]', host).innerHTML = fmt(x.say);
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-i]"); if (!b) return;
          cur = +b.dataset.i; paint();
        });
        paint();
      },
    },

    /* ---- at 8: capture & replace lab ----------------------------- */
    {
      at: 8,
      title: "Capture & replace lab",
      blurb:
        "Groups don't just match — they **remember**. Edit the pattern and the replacement " +
        "(`$1`, `$2`…) and watch the rewrite happen live. Three presets show the classics.",
      mount(host) {
        const SAMPLE =
          "2026-07-24 backup ok\n2025-11-02 restore test\nGarcia, Maria — ext 4211\nHouse, Gregory — ext 5150\ncall 555-0142 or 555-0199";
        let pat = "(\\d{4})-(\\d{2})-(\\d{2})", rep = "$3/$2/$1";
        const PRESETS = [
          ["dates → DD/MM/YYYY", "(\\d{4})-(\\d{2})-(\\d{2})", "$3/$2/$1"],
          ["Last, First → First Last", "(\\w+), (\\w+)", "$2 $1"],
          ["redact phone numbers", "(\\d{3})-\\d{4}", "$1-XXXX"],
        ];
        host.innerHTML = `
          <div class="viz crviz">
            <div class="viz-ctrls wrap" data-r="presets">
              ${PRESETS.map((p, i) => `<button class="viz-btn mono ${i === 0 ? "primary" : ""}" data-i="${i}">${esc(p[0])}</button>`).join("")}
            </div>
            <div class="rx-bar"><span class="rx-delim">s/</span>
              <input class="rx-input" data-r="pat" value="${esc(pat)}" spellcheck="false" aria-label="Pattern">
              <span class="rx-delim">/</span>
              <input class="rx-input" data-r="rep" value="${esc(rep)}" spellcheck="false" aria-label="Replacement">
              <span class="rx-delim">/g</span>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <div class="gnu-flow">
              <div class="gnu-pane"><div class="gnu-pane-h"><code>before</code></div><pre class="gnu-pane-b">${esc(SAMPLE)}</pre></div>
              <div class="gnu-arrow">⇢</div>
              <div class="gnu-pane"><div class="gnu-pane-h"><code>after</code></div><pre class="gnu-pane-b" data-r="out"></pre></div>
            </div>
            <div class="viz-panel-h">first match, group by group</div>
            <div class="rx-tokens" data-r="groups"></div>
          </div>`;
        function paint() {
          const statEl = $('[data-r="stat"]', host);
          let re;
          try { re = new RegExp(pat, "g"); statEl.classList.remove("err"); statEl.textContent = ""; }
          catch (err) {
            statEl.classList.add("err"); statEl.textContent = "✗ " + err.message;
            $('[data-r="out"]', host).textContent = SAMPLE; return;
          }
          $('[data-r="out"]', host).textContent = SAMPLE.replace(re, rep);
          re.lastIndex = 0;
          const m = re.exec(SAMPLE);
          $('[data-r="groups"]', host).innerHTML = m
            ? [`<div class="rx-tok"><code>$&</code><span>whole match: “${esc(m[0])}”</span></div>`,
               ...m.slice(1).map((g, gi) => `<div class="rx-tok"><code>$${gi + 1}</code><span>${g === undefined ? "did not participate" : `captured “${esc(g)}”`}</span></div>`)].join("")
            : '<span class="ln-dim">no match in the sample</span>';
        }
        $('[data-r="pat"]', host).addEventListener("input", (e) => { pat = e.target.value; paint(); });
        $('[data-r="rep"]', host).addEventListener("input", (e) => { rep = e.target.value; paint(); });
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-i]"); if (!b) return;
          $$("[data-i]", host).forEach((x) => x.classList.toggle("primary", x === b));
          const p = PRESETS[+b.dataset.i];
          pat = p[1]; rep = p[2];
          $('[data-r="pat"]', host).value = pat; $('[data-r="rep"]', host).value = rep;
          paint();
        });
        paint();
      },
    },
  ];

  /* =================================================================
     ISO 27001
     ================================================================= */
  LABS.iso27001 = [

    /* ---- at 4: the risk matrix ----------------------------------- */
    {
      at: 4,
      title: "Work the risk matrix",
      blurb:
        "Pick a scenario, set **likelihood × impact**, and watch the risk land on the " +
        "5×5 matrix. Then apply a treatment and see the residual risk move — the whole " +
        "Clause 6 loop in one widget.",
      mount(host) {
        const SCEN = [
          { name: "Laptop stolen from café", L: 3, I: 4, ctrl: "A.8.1 endpoint policy + full-disk encryption", rL: 3, rI: 1 },
          { name: "Ransomware via phishing", L: 4, I: 5, ctrl: "A.6.3 awareness training + A.8.13 offline backups", rL: 3, rI: 2 },
          { name: "Cloud region outage",     L: 2, I: 4, ctrl: "A.8.14 redundancy across regions", rL: 2, rI: 2 },
          { name: "Admin leaks customer DB", L: 2, I: 5, ctrl: "A.8.2 privileged access mgmt + A.8.15 logging", rL: 1, rI: 4 },
        ];
        let cur = 0, L = SCEN[0].L, I = SCEN[0].I, treated = false;
        const band = (s) => s <= 6 ? ["low", "accept or watch"] : s <= 12 ? ["medium", "mitigate this planning cycle"] : ["high", "treat now — this outranks feature work"];
        host.innerHTML = `
          <div class="viz rkviz">
            <div class="viz-ctrls wrap" data-r="scen"></div>
            <div class="rk-cols">
              <div class="rk-grid" data-r="grid"></div>
              <div class="rk-side">
                <label class="sub-slider">likelihood <b data-r="lv"></b><input type="range" min="1" max="5" data-r="L" aria-label="Likelihood"></label>
                <label class="sub-slider">impact <b data-r="iv"></b><input type="range" min="1" max="5" data-r="I" aria-label="Impact"></label>
                <button class="viz-btn mono" data-a="treat"></button>
                <div class="asm-msg" data-r="say"></div>
              </div>
            </div>
          </div>`;
        $('[data-r="scen"]', host).innerHTML = SCEN.map((s, i) =>
          `<button class="viz-btn mono ${i === 0 ? "primary" : ""}" data-i="${i}">${esc(s.name)}</button>`).join("");
        function paint() {
          const s = SCEN[cur];
          const score = L * I;
          const [b, advice] = band(score);
          const rScore = s.rL * s.rI;
          $$("[data-i]", host).forEach((x) => x.classList.toggle("primary", +x.dataset.i === cur));
          $('[data-r="lv"]', host).textContent = L; $('[data-r="iv"]', host).textContent = I;
          $('[data-r="L"]', host).value = L; $('[data-r="I"]', host).value = I;
          let cells = "";
          for (let ii = 5; ii >= 1; ii--) {
            for (let ll = 1; ll <= 5; ll++) {
              const sc = ll * ii;
              const cls = sc <= 6 ? "g" : sc <= 12 ? "y" : "r";
              const here = ll === L && ii === I;
              const resid = treated && ll === s.rL && ii === s.rI;
              cells += `<div class="rk-cell ${cls}">${here ? '<span class="rk-dot" title="inherent risk"></span>' : ""}${resid ? '<span class="rk-dot resid" title="residual risk"></span>' : ""}</div>`;
            }
          }
          $('[data-r="grid"]', host).innerHTML =
            `<div class="rk-axis-y">impact →</div>${cells}<div class="rk-axis-x">likelihood →</div>`;
          $('[data-a="treat"]', host).textContent = treated ? "remove the control" : "apply treatment: " + s.ctrl;
          $('[data-r="say"]', host).innerHTML = fmt(
            `**${s.name}** — inherent risk ${L}×${I} = **${score}** (${b}): ${advice}.` +
            (treated ? ` With **${s.ctrl}** in place, residual risk falls to ${s.rL}×${s.rI} = **${rScore}** (${band(rScore)[0]}). The gap between the two dots is what the SoA justifies — and residual risk is what management formally accepts.` : ""));
        }
        host.addEventListener("input", (e) => {
          if (e.target.matches('[data-r="L"]')) { L = +e.target.value; paint(); }
          if (e.target.matches('[data-r="I"]')) { I = +e.target.value; paint(); }
        });
        host.addEventListener("click", (e) => {
          const s = e.target.closest("[data-i]");
          if (s) { cur = +s.dataset.i; L = SCEN[cur].L; I = SCEN[cur].I; treated = false; paint(); return; }
          if (e.target.closest('[data-a="treat"]')) { treated = !treated; paint(); }
        });
        paint();
      },
    },

    /* ---- at 11: audit verdicts ----------------------------------- */
    {
      at: 11,
      title: "Call the audit verdict",
      blurb:
        "Four findings from a mock internal audit. For each, decide: **conformity**, " +
        "**OFI** (opportunity for improvement), **minor NC** or **major NC** — then " +
        "check yourself against the auditor's reasoning.",
      mount(host) {
        const CASES = [
          { f: "Backup policy exists; restore tests are documented for all 12 months of the year.",
            a: 0, why: "Requirement met, evidence complete. Conformity — auditors do write these down; a report that is 100% findings has lost the plot." },
          { f: "Access reviews are performed quarterly as required, but the Q2 review record has no approver sign-off.",
            a: 2, why: "The control operates, one instance of incomplete evidence: a classic **minor** nonconformity. Isolated lapse, system intact — fix the record-keeping, show it stays fixed." },
          { f: "No risk assessment has ever been performed; the ISMS scope document does not exist.",
            a: 3, why: "**Major**: a whole clause (6.1.2, and 4.3) is simply absent. The management system cannot function without it — certification is blocked until this is closed and verified." },
          { f: "Password rules meet the policy everywhere; the auditor suggests adding passphrase guidance to the onboarding deck.",
            a: 1, why: "Nothing is broken and nothing is required — a suggestion to do better than the standard demands. That's an **OFI**: worth logging, impossible to 'fail'." },
        ];
        const V = ["conformity", "OFI", "minor NC", "major NC"];
        const picked = new Array(CASES.length).fill(null);
        host.innerHTML = `<div class="viz audviz"><div data-r="cards"></div><p class="viz-status" data-r="score"></p></div>`;
        function paint() {
          $('[data-r="cards"]', host).innerHTML = CASES.map((c, i) => `
            <div class="aud-card">
              <p class="aud-f">${esc(c.f)}</p>
              <div class="viz-ctrls wrap">
                ${V.map((v, vi) => `<button class="viz-btn mono
                  ${picked[i] === null ? "" : vi === c.a ? "ok" : picked[i] === vi ? "bad" : ""}"
                  data-c="${i}" data-v="${vi}" ${picked[i] !== null ? "disabled" : ""}>${v}</button>`).join("")}
              </div>
              ${picked[i] !== null ? `<p class="asm-msg">${picked[i] === c.a ? "✓ " : `✗ you said <b>${V[picked[i]]}</b> — it's <b>${V[c.a]}</b>. `}${fmt(c.why)}</p>` : ""}
            </div>`).join("");
          const done = picked.filter((x) => x !== null).length;
          const right = picked.filter((x, i) => x === CASES[i].a).length;
          $('[data-r="score"]', host).textContent = done ? `${right} / ${done} called correctly${done === CASES.length ? " — audit complete" : ""}` : "click a verdict on each finding";
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-c]"); if (!b || b.disabled) return;
          picked[+b.dataset.c] = +b.dataset.v; paint();
        });
        paint();
      },
    },
  ];

  /* =================================================================
     DICOM & HL7
     ================================================================= */
  LABS.dicom = [

    /* ---- at 3: the order lifecycle ------------------------------- */
    {
      at: 3,
      title: "Drive an order through the RIS",
      blurb:
        "Seven states from ORDERED to FINAL. Step through them and watch which system " +
        "moves the order, which message fires — and what your PACS should expect at each " +
        "point. Then flip **walk-in mode** and see the states an emergency skips.",
      mount(host) {
        const STATES = [
          { k: "ORDERED",     msg: "HL7 ORM^O01 (NW) → RIS", pacs: "accession now exists — prefetch of priors becomes possible",
            say: "the EMR asks, the RIS **mints the accession**. Nothing has been scanned; your archive already has a name for the future study." },
          { k: "SCHEDULED",   msg: "clerk binds slot + station", pacs: "study will appear in CT01's MWL — expect images from that AE",
            say: "a human (or auto-scheduler) picks date and scanner. Only now does the entry answer that scanner's **worklist query**." },
          { k: "ARRIVED",     msg: "HL7 ADT^A04/A08 → all", pacs: "demographics refreshed — last chance before they're burned into headers",
            say: "check-in fires a demographic update. Whatever PID says *now* is what MWL hands the modality." },
          { k: "IN PROGRESS", msg: "DICOM MPPS N-CREATE → RIS", pacs: "C-STOREs will start any second",
            say: "the tech tapped the worklist entry: **MPPS 'started'**. Note the protocol switch — status flows over DICOM now, not HL7." },
          { k: "COMPLETED",   msg: "DICOM MPPS N-SET → RIS", pacs: "RIS now knows N instances were made — completeness check against your archive",
            say: "**MPPS 'completed'** carries what was actually performed. A good RIS asks the PACS: did all 401 arrive?" },
          { k: "DICTATED",    msg: "radiologist signs in RIS", pacs: "report belongs to the accession — images stay untouched",
            say: "read from the PACS, signed in the RIS. The report is RIS data; your archive only ever linked to it by accession." },
          { k: "FINAL",       msg: "HL7 ORU^R01 (F) → EMR · DFT^P03 → HIS", pacs: "order closed — study becomes a future 'relevant prior'",
            say: "result to the chart, charge to billing. The loop closes — and this study starts its second life as tomorrow's comparison." },
        ];
        const WALKIN_SKIP = new Set([0, 1, 2]);
        let i = 0, walkin = false;
        host.innerHTML = `
          <div class="viz risviz">
            <div class="viz-ctrls">
              <button class="viz-btn primary" data-a="step">Step ▸</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
              <button class="viz-btn mono" data-a="walkin">walk-in emergency</button>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <div class="br-phases" data-r="ph"></div>
            <div class="ris-cols">
              <div class="ris-msg"><div class="viz-panel-h">the message</div><code data-r="msg"></code></div>
              <div class="ris-msg"><div class="viz-panel-h">what your PACS should expect</div><span data-r="pacs"></span></div>
            </div>
            <p class="asm-msg" data-r="say"></p>
          </div>`;
        function skipped(x) { return walkin && WALKIN_SKIP.has(x); }
        function paint() {
          $('[data-a="walkin"]', host).classList.toggle("on", walkin);
          $('[data-r="ph"]', host).innerHTML = STATES.map((s, si) =>
            `<button class="br-phase ${skipped(si) ? "skip" : si === i ? "cur" : si < i ? "done" : ""}" data-i="${si}">${esc(s.k)}</button>`
          ).join('<span class="br-sep">›</span>');
          const s = STATES[i];
          $('[data-r="msg"]', host).textContent = skipped(i) ? "— nothing: this state never happened —" : s.msg;
          $('[data-r="pacs"]', host).innerHTML = skipped(i) ? '<span class="ln-dim">unscheduled study incoming: no valid accession, manual demographics</span>' : fmt(s.pacs);
          $('[data-r="say"]', host).innerHTML = fmt(skipped(i)
            ? "**Walk-in reality**: the scan happened before any order existed. The tech typed demographics by hand — the study arrives **unscheduled**, and this state is back-filled later during reconciliation (IHE PIR)."
            : s.say);
          $('[data-r="stat"]', host).textContent = `${i + 1} / ${STATES.length}${walkin ? " · walk-in" : ""}`;
        }
        host.addEventListener("click", (e) => {
          const p = e.target.closest("[data-i]");
          if (p) { i = +p.dataset.i; paint(); return; }
          const b = e.target.closest("[data-a]"); if (!b) return;
          if (b.dataset.a === "reset") i = 0;
          else if (b.dataset.a === "walkin") { walkin = !walkin; i = walkin ? 3 : 0; }
          else i = Math.min(i + 1, STATES.length - 1);
          paint();
        });
        paint();
      },
    },

    /* ---- at 8: dataset inspector & anonymizer -------------------- */
    {
      at: 8,
      title: "Header inspector & anonymizer",
      blurb:
        "A real-looking CT header. Click any tag to decode it, then flip the **anonymize** " +
        "switch and watch a PS3.15-style profile clean it — pseudonyms in, PHI out, UIDs " +
        "remapped **consistently**.",
      mount(host) {
        const ROWS = [
          { t: "(0008,0018)", vr: "UI", name: "SOPInstanceUID", v: "…868.1.2.37", phi: "uid", anon: "…anon.1.2.37",
            d: "identifies THIS image forever. Must be remapped when anonymizing — it fingerprints device and acquisition time." },
          { t: "(0008,0050)", vr: "SH", name: "AccessionNumber", v: "ACC-99031", phi: "hard", anon: "(removed)",
            d: "the RIS order key — a direct link back to the hospital record. Always strip for research export." },
          { t: "(0008,0060)", vr: "CS", name: "Modality", v: "CT", phi: null, anon: "CT",
            d: "coded string, safe to keep — research is useless without knowing what kind of image this is." },
          { t: "(0008,0080)", vr: "LO", name: "InstitutionName", v: "CARINO GENERAL HOSP", phi: "hard", anon: "(removed)",
            d: "reveals **where** — combined with a date and a rare finding, that's re-identification fuel." },
          { t: "(0008,0090)", vr: "PN", name: "ReferringPhysicianName", v: "HOUSE^GREGORY", phi: "hard", anon: "(removed)",
            d: "third-party PHI: the doctor's name is protected too." },
          { t: "(0010,0010)", vr: "PN", name: "PatientName", v: "GARCIA^MARIA^L", phi: "pseud", anon: "ANON^7F3A",
            d: "person name, LAST^FIRST^MIDDLE. Replaced with a pseudonym (not blanked) so viewers and tools still function." },
          { t: "(0010,0020)", vr: "LO", name: "PatientID", v: "12345", phi: "pseud", anon: "ANON7F3A",
            d: "the MRN. Replaced with the SAME pseudonym across every file of the study, or the study falls apart." },
          { t: "(0010,0030)", vr: "DA", name: "PatientBirthDate", v: "19840312", phi: "pseud", anon: "19840101",
            d: "dates are quasi-identifiers. Common tactic: keep the year (age matters clinically), flatten month and day." },
          { t: "(0010,1000)", vr: "LO", name: "OtherPatientIDs", v: "99887", phi: "hard", anon: "(removed)",
            d: "the sneaky one — old MRNs from mergers hide here. Naive anonymizers miss it." },
          { t: "(0020,000d)", vr: "UI", name: "StudyInstanceUID", v: "…868.1", phi: "uid", anon: "…anon.1",
            d: "must change, but to the SAME new value in all ~400 instances — that's the UID map." },
          { t: "(0028,1050)", vr: "DS", name: "WindowCenter", v: "40", phi: null, anon: "40",
            d: "display parameter — clinically necessary, zero identification risk. Keep." },
          { t: "(7fe0,0010)", vr: "OW", name: "PixelData", v: "524288 bytes", phi: "pix", anon: "524288 bytes ⚠",
            d: "headers say nothing about what's IN the pixels: ultrasound and secondary captures often have the name burned in. Look at the image." },
        ];
        let anon = false, selIdx = 5;
        host.innerHTML = `
          <div class="viz dcmviz">
            <div class="viz-ctrls">
              <button class="viz-btn mono" data-a="anon">anonymize: <b data-r="sw">OFF</b></button>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <div class="dcm-rows" data-r="rows"></div>
            <div class="asm-msg" data-r="info"></div>
          </div>`;
        function paint() {
          $('[data-r="sw"]', host).textContent = anon ? "ON" : "OFF";
          $('[data-a="anon"]', host).classList.toggle("on", anon);
          const phiN = ROWS.filter((r) => r.phi).length;
          $('[data-r="stat"]', host).textContent = anon
            ? `${phiN} PHI-bearing tags handled · pixels still need eyeballing`
            : `${phiN} of ${ROWS.length} tags carry PHI — click them`;
          $('[data-r="rows"]', host).innerHTML = ROWS.map((r, i) => `
            <div class="dcm-row ${r.phi ? "phi" : ""} ${anon && r.phi ? "clean" : ""} ${i === selIdx ? "sel" : ""}" data-i="${i}">
              <code class="dcm-tag">${r.t}</code><code class="dcm-vr">${r.vr}</code>
              <span class="dcm-name">${esc(r.name)}</span>
              <code class="dcm-val">${esc(anon ? r.anon : r.v)}</code>
            </div>`).join("");
          const r = ROWS[selIdx];
          $('[data-r="info"]', host).innerHTML =
            `<b>${r.t} ${esc(r.name)}</b> · VR ${r.vr} — ${fmt(r.d)}`;
        }
        host.addEventListener("click", (e) => {
          if (e.target.closest('[data-a="anon"]')) { anon = !anon; paint(); return; }
          const row = e.target.closest("[data-i]");
          if (row) { selIdx = +row.dataset.i; paint(); }
        });
        paint();
      },
    },

    /* ---- at 10: a PACS conversation ------------------------------ */
    {
      at: 10,
      title: "A PACS conversation, step by step",
      blurb:
        "Watch `CT01` push one image to `PACS`: association, negotiation, C-STORE, release. " +
        "Then flip **wrong AE title** on and see the whole thing die at the door — the " +
        "most common DICOM failure in the wild.",
      mount(host) {
        const OK = [
          { from: 0, txt: "TCP connect → pacs.host:104", say: "plain TCP first — if this fails, it's networking, not DICOM." },
          { from: 0, txt: "A-ASSOCIATE-RQ  calling=CT01  called=PACS\n + context: CT Image Storage (Explicit LE, Implicit LE)", say: "the SCU introduces itself by **AE title** and proposes presentation contexts: what it wants to send, in which transfer syntaxes." },
          { from: 1, txt: "A-ASSOCIATE-AC\n + context accepted: CT Image Storage → Explicit LE", say: "the SCP checked its allowlist (CT01 is known) and picked ONE transfer syntax per context. The channel is open." },
          { from: 0, txt: "C-STORE-RQ  SOPInstance …868.1.2.37  (dataset + pixels)", say: "the actual service: one composite object crosses the wire." },
          { from: 1, txt: "C-STORE-RSP  status 0x0000 (Success)", say: "the SCP wrote the file to its archive **before** answering Success — same rule as HL7 ACKs: persist, then acknowledge." },
          { from: 0, txt: "…C-STORE ×399 more (one per slice)", say: "a CT study is hundreds of objects; they stream over the same association." },
          { from: 0, txt: "A-RELEASE-RQ → A-RELEASE-RP", say: "a polite goodbye, both sides agreeing the association is done. Abrupt drops (A-ABORT) show up in logs when things go wrong." },
        ];
        const BAD = [
          { from: 0, txt: "TCP connect → pacs.host:104", say: "TCP is fine — the port is open. DICOM problems start above TCP." },
          { from: 0, txt: "A-ASSOCIATE-RQ  calling=CT_NEW  called=PACS", say: "the scanner was replaced and nobody updated the PACS. `CT_NEW` is not in the allowlist…" },
          { from: 1, txt: "A-ASSOCIATE-RJ  (rejected: calling AE title not recognized)", say: "**rejected at the door.** No service ever ran. The fix is one row in the PACS's AE table — this is '90% of DICOM doesn't work' in one step." },
        ];
        let i = -1, bad = false;
        host.innerHTML = `
          <div class="viz pacsviz">
            <div class="viz-ctrls">
              <button class="viz-btn primary" data-a="step">Step ▸</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
              <button class="viz-btn mono" data-a="bad">wrong AE title</button>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <div class="net-topo">
              <div class="net-node" data-r="n0">CT01 🩻 <small>store-SCU</small></div>
              <div class="net-link"><span class="net-pkt">▣</span></div>
              <div class="net-node" data-r="n1">PACS 🗄 <small>store-SCP</small></div>
            </div>
            <div class="pacs-log" data-r="log"></div>
            <p class="asm-msg" data-r="say">press Step to open the association.</p>
          </div>`;
        function paint() {
          const SEQ = bad ? BAD : OK;
          $('[data-a="bad"]', host).classList.toggle("on", bad);
          $('[data-r="n0"]', host).classList.toggle("cur", i >= 0 && SEQ[i].from === 0);
          $('[data-r="n1"]', host).classList.toggle("cur", i >= 0 && SEQ[i].from === 1);
          $('[data-r="log"]', host).innerHTML = SEQ.slice(0, i + 1).map((s, si) => `
            <div class="pacs-line ${s.from ? "rt" : "lt"} ${si === i ? "hot" : ""} ${/-RJ|ABORT/.test(s.txt) ? "err" : ""}">
              <span class="pacs-dir">${s.from ? "◀" : "▶"}</span><pre>${esc(s.txt)}</pre>
            </div>`).join("") || '<span class="ln-dim">— no traffic yet —</span>';
          $('[data-r="say"]', host).innerHTML = i >= 0 ? fmt(SEQ[i].say) : "press Step to open the association.";
          $('[data-r="stat"]', host).textContent = i < 0 ? "idle" :
            i === SEQ.length - 1 ? (bad ? "association REJECTED" : "study stored — association closed") : `step ${i + 1} / ${SEQ.length}`;
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-a]"); if (!b) return;
          const SEQ = bad ? BAD : OK;
          if (b.dataset.a === "reset") i = -1;
          else if (b.dataset.a === "bad") { bad = !bad; i = -1; }
          else i = Math.min(i + 1, SEQ.length - 1);
          paint();
        });
        paint();
      },
    },

    /* ---- at 11: retrieve, two ways ------------------------------- */
    {
      at: 11,
      title: "Retrieve, two ways",
      blurb:
        "Same study, two protocols. Step a **C-MOVE** and watch the PACS call you back on a " +
        "second association — then switch to **C-GET** and watch the images ride home on the " +
        "one connection you opened. The firewall knows the difference; now you will too.",
      mount(host) {
        const MOVE = [
          { from: 0, txt: "association A → PACS:104\nC-MOVE-RQ  QueryRetrieveLevel=STUDY  dest AE = ME", say: "you ask the PACS to send study X **to the AE named ME** — a name, not an address. The PACS must resolve it from its own config table." },
          { from: 1, txt: "PACS looks up “ME” → 10.0.0.7:11112\nopens association B → ME:11112", say: "**the callback**: a brand-new inbound TCP connection to your listener. This is the step NAT and firewalls kill — and if 'ME' isn't in the table, you get *Success, 0 completed*." },
          { from: 1, txt: "C-STORE-RQ ×401 … over association B", say: "the images flow on association **B**, delivered by the PACS acting as a store-SCU. Your storescp files them away." },
          { from: 1, txt: "C-MOVE-RSP (final) on association A:\nCompleted=401  Failed=0  Warning=0", say: "meanwhile association **A** was drip-feeding pending responses; the final one carries the honest **sub-operation counters**." },
          { from: 0, txt: "A-RELEASE on both associations", say: "two connections, three roles (you-as-SCU, PACS-as-SCP *and* store-SCU, you-as-store-SCP). Elegant in 1993; a support ticket today." },
        ];
        const GET = [
          { from: 0, txt: "ONE association → PACS:104\n + storage contexts negotiated with SCP ROLE for me", say: "the trick happens at negotiation: your SCU proposes storage presentation contexts and claims the **SCP role** for them — 'I can receive C-STOREs on this same socket'." },
          { from: 0, txt: "C-GET-RQ  QueryRetrieveLevel=STUDY  StudyInstanceUID=…868.1", say: "no destination AE, no callback address — there is nothing to configure on the PACS side about *you*." },
          { from: 1, txt: "C-STORE-RQ ×401 … interleaved on the SAME association", say: "the images come back **down the pipe you opened**. Outbound-only from your side: home offices, NAT and strict firewalls are all fine with this." },
          { from: 1, txt: "C-GET-RSP (final): Completed=401  Failed=0", say: "same honest counters, one connection, zero AE-table entries. The catch: both ends must implement the role dance — many classic PACS never did." },
          { from: 0, txt: "A-RELEASE — done", say: "one association, in and out. DICOMweb's WADO-RS is this same two-party idea reborn over HTTPS." },
        ];
        let mode = "move", i = -1;
        host.innerHTML = `
          <div class="viz rtviz">
            <div class="viz-ctrls">
              <button class="viz-btn mono primary" data-m="move">C-MOVE</button>
              <button class="viz-btn mono" data-m="get">C-GET</button>
              <button class="viz-btn primary" data-a="step">Step ▸</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <div class="net-topo" data-r="topo"></div>
            <div class="pacs-log" data-r="log"></div>
            <p class="asm-msg" data-r="say">pick a protocol, press Step.</p>
          </div>`;
        function paint() {
          const SEQ = mode === "move" ? MOVE : GET;
          $$("[data-m]", host).forEach((b) => b.classList.toggle("primary", b.dataset.m === mode));
          $('[data-r="topo"]', host).innerHTML = `
            <div class="net-node ${i >= 0 && SEQ[i].from === 0 ? "cur" : ""}">ME 💻 <small>${mode === "move" ? "SCU + listener :11112" : "SCU (storage SCP role in-band)"}</small></div>
            <div class="net-link"></div>
            <div class="net-node ${i >= 0 && SEQ[i].from === 1 ? "cur" : ""}">PACS 🗄 <small>${mode === "move" ? "Q/R SCP + store-SCU" : "Q/R SCP"}</small></div>`;
          $('[data-r="log"]', host).innerHTML = SEQ.slice(0, i + 1).map((s, si) => `
            <div class="pacs-line ${s.from ? "rt" : "lt"} ${si === i ? "hot" : ""}">
              <span class="pacs-dir">${s.from ? "◀" : "▶"}</span><pre>${esc(s.txt)}</pre>
            </div>`).join("") || '<span class="ln-dim">— no traffic yet —</span>';
          $('[data-r="say"]', host).innerHTML = i >= 0 ? fmt(SEQ[i].say) : "pick a protocol, press Step.";
          $('[data-r="stat"]', host).textContent = i < 0 ? (mode === "move" ? "3-party retrieve" : "2-party retrieve")
            : i === SEQ.length - 1 ? "study retrieved" : `step ${i + 1} / ${SEQ.length}`;
        }
        host.addEventListener("click", (e) => {
          const m = e.target.closest("[data-m]");
          if (m) { mode = m.dataset.m; i = -1; paint(); return; }
          const b = e.target.closest("[data-a]"); if (!b) return;
          const SEQ = mode === "move" ? MOVE : GET;
          if (b.dataset.a === "reset") i = -1; else i = Math.min(i + 1, SEQ.length - 1);
          paint();
        });
        paint();
      },
    },

    /* ---- at 13: drive a DICOM printer ---------------------------- */
    {
      at: 13,
      title: "Drive a film printer with N-services",
      blurb:
        "A print job is remote object-building: **N-CREATE** the session and the film box, " +
        "**N-SET** pixels into each cell, **N-ACTION** to print, **N-DELETE** to clean up. " +
        "Step the job and watch the 2×3 film fill — the same verb family that powers MPPS " +
        "and storage commitment.",
      mount(host) {
        const STEPS = [
          { txt: "N-GET Printer", cells: 0, say: "first, ask the stateful thing how it feels: **N-GET** reads the Printer object's attributes — status NORMAL, 14×17 film loaded. No job exists yet." },
          { txt: "N-CREATE Basic Film Session  (copies=1, priority=MED)", cells: 0, say: "**N-CREATE** builds an object that lives *on the printer*: the session is the job envelope — copies, priority, medium type." },
          { txt: "N-CREATE Basic Film Box  (ImageDisplayFormat = STANDARD\\2,3)", cells: 0, boxes: true, say: "one film box = one sheet, laid out 2×3. The SCP **creates the six Image Boxes itself** and hands you back their UIDs — you never create cells, only fill them." },
          { txt: "N-SET Image Box 1 ← slice 041", cells: 1, boxes: true, say: "**N-SET** updates attributes of an existing object — here, pushing pixel data into cell 1. One N-SET per cell." },
          { txt: "N-SET Image Box 2..6 ← slices 087…241", cells: 6, boxes: true, say: "five more N-SETs and the sheet is composed. Density, magnification and the presentation LUT are also just attributes you N-SET." },
          { txt: "N-ACTION Film Box → PRINT", cells: 6, boxes: true, printed: true, say: "**N-ACTION** triggers behaviour: the film comes out of the camera. On the wire it's one small command — all the pixels already live printer-side." },
          { txt: "N-DELETE Basic Film Session", cells: 0, boxes: false, deleted: true, say: "**N-DELETE** dismantles the job tree. Session gone, boxes gone — the printer is stateless again. Now re-read MPPS and storage commitment: same verbs, different objects." },
        ];
        let i = -1;
        host.innerHTML = `
          <div class="viz prviz">
            <div class="viz-ctrls">
              <button class="viz-btn primary" data-a="step">Step ▸</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <div class="pr-cols">
              <div class="pacs-log" data-r="log"></div>
              <div class="pr-film-wrap">
                <div class="viz-panel-h">the film box (2×3)</div>
                <div class="film-grid" data-r="film"></div>
              </div>
            </div>
            <p class="asm-msg" data-r="say">press Step to talk to the printer.</p>
          </div>`;
        function paint() {
          const s = i >= 0 ? STEPS[i] : null;
          $('[data-r="log"]', host).innerHTML = STEPS.slice(0, i + 1).map((x, xi) => `
            <div class="pacs-line lt ${xi === i ? "hot" : ""}">
              <span class="pacs-dir">▶</span><pre>${esc(x.txt)}</pre>
            </div>`).join("") || '<span class="ln-dim">— idle: printer status NORMAL —</span>';
          const showBoxes = s && s.boxes;
          $('[data-r="film"]', host).innerHTML = showBoxes
            ? [...Array(6)].map((_, c) =>
                `<div class="film-cell ${c < s.cells ? "set" : ""} ${s.printed ? "printed" : ""}">${c < s.cells ? "▦" : c + 1}</div>`).join("")
            : `<div class="ln-dim" style="grid-column:1/-1;text-align:center;padding:18px 0">${s && s.deleted ? "— job deleted, film in the tray 🎞 —" : "no film box yet"}</div>`;
          $('[data-r="say"]', host).innerHTML = s ? fmt(s.say) : "press Step to talk to the printer.";
          $('[data-r="stat"]', host).textContent = i < 0 ? "idle" : i === STEPS.length - 1 ? "job complete" : `step ${i + 1} / ${STEPS.length}`;
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-a]"); if (!b) return;
          if (b.dataset.a === "reset") i = -1; else i = Math.min(i + 1, STEPS.length - 1);
          paint();
        });
        paint();
      },
    },
  ];
})();
