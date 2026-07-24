/* =====================================================================
   Carino Learn — interactive labs, one per module.
   Every course gets a manipulable visual in the spirit of
   hash.carino.systems: not decoration — a diagram you can drive.
   Pure DOM/SVG, no libraries. Mounted by app.js into #labMount.
   ===================================================================== */

(() => {
  "use strict";

  const VIZ = {};
  window.COURSE_VIZ = VIZ;

  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;");
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* =================================================================
     ASSEMBLY — live CPU: step a real program, watch registers & flags
     ================================================================= */
  VIZ.assembly = {
    title: "The CPU, one instruction at a time",
    blurb:
      "This is a working model of the fetch–execute loop. Press **Step** and watch " +
      "`rip` walk the program while registers and flags change — including a `cmp`/`je` " +
      "pair taking a branch and a real `exit` syscall.",
    mount(host) {
      const PROG = [
        { t: "mov rax, 5",      d: "put 5 in rax",                run: (s) => { s.regs.rax = 5n; s.chg = ["rax"]; } },
        { t: "mov rcx, 3",      d: "put 3 in rcx",                run: (s) => { s.regs.rcx = 3n; s.chg = ["rcx"]; } },
        { t: "add rax, rcx",    d: "rax = rax + rcx",             run: (s) => { s.regs.rax += s.regs.rcx; s.flags.ZF = s.regs.rax === 0n; s.flags.SF = s.regs.rax < 0n; s.chg = ["rax", "ZF", "SF"]; } },
        { t: "cmp rax, 8",      d: "compute rax − 8, set flags",  run: (s) => { const r = s.regs.rax - 8n; s.flags.ZF = r === 0n; s.flags.SF = r < 0n; s.chg = ["ZF", "SF"]; } },
        { t: "je  .done",       d: "jump if ZF is set",           run: (s) => { if (s.flags.ZF) { s.rip = 6; s.msg = "ZF=1 → branch taken, line 5 is skipped"; } else s.msg = "ZF=0 → fall through"; s.chg = ["rip"]; } },
        { t: "mov rax, 0",      d: "(only runs if no jump)",      run: (s) => { s.regs.rax = 0n; s.chg = ["rax"]; } },
        { t: ".done:\n  mov rdi, rax", d: "exit code ← rax",      run: (s) => { s.regs.rdi = s.regs.rax; s.chg = ["rdi"]; } },
        { t: "mov rax, 60",     d: "60 = the exit syscall",       run: (s) => { s.regs.rax = 60n; s.chg = ["rax"]; } },
        { t: "syscall",         d: "trap into the kernel",        run: (s) => { s.halted = true; s.msg = `kernel: exit(${s.regs.rdi}) — process terminated, exit status ${s.regs.rdi}`; s.chg = []; } },
      ];
      const fresh = () => ({ regs: { rax: 0n, rcx: 0n, rdi: 0n }, flags: { ZF: false, SF: false }, rip: 0, halted: false, msg: "", chg: [] });
      let st = fresh();

      host.innerHTML = `
        <div class="viz asmviz">
          <div class="viz-ctrls">
            <button class="viz-btn primary" data-a="step">Step ▸</button>
            <button class="viz-btn" data-a="run">Run ▸▸</button>
            <button class="viz-btn" data-a="reset">Reset ⟲</button>
            <span class="viz-status" data-r="status"></span>
          </div>
          <div class="asm-cols">
            <ol class="asm-prog" data-r="prog"></ol>
            <div class="asm-panel">
              <div class="viz-panel-h">registers</div>
              <div class="asm-regs" data-r="regs"></div>
              <div class="viz-panel-h">flags</div>
              <div class="asm-flags" data-r="flags"></div>
              <div class="asm-msg" data-r="msg"></div>
            </div>
          </div>
        </div>`;

      const progEl = $('[data-r="prog"]', host);
      progEl.innerHTML = PROG.map((p, i) =>
        `<li class="asm-line" data-i="${i}"><span class="asm-arrow">▶</span><code>${esc(p.t)}</code><span class="asm-cmt">; ${esc(p.d)}</span></li>`).join("");

      const hex = (v) => "0x" + v.toString(16);
      function paint() {
        $$(".asm-line", host).forEach((li) =>
          li.classList.toggle("cur", !st.halted && +li.dataset.i === st.rip));
        $('[data-r="regs"]', host).innerHTML =
          Object.entries(st.regs).map(([k, v]) =>
            `<div class="asm-reg ${st.chg.includes(k) ? "hot" : ""}"><b>${k}</b><code>${hex(v)}</code><span>${v}</span></div>`).join("") +
          `<div class="asm-reg ${st.chg.includes("rip") ? "hot" : ""}"><b>rip</b><code>${st.halted ? "—" : "line " + st.rip}</code><span></span></div>`;
        $('[data-r="flags"]', host).innerHTML =
          Object.entries(st.flags).map(([k, v]) =>
            `<span class="asm-flag ${v ? "on" : ""} ${st.chg.includes(k) ? "hot" : ""}">${k}=${v ? 1 : 0}</span>`).join("");
        $('[data-r="msg"]', host).textContent = st.msg;
        $('[data-r="status"]', host).textContent =
          st.halted ? "halted — process exited" : `next: line ${st.rip}`;
      }
      function step() {
        if (st.halted) return;
        const ins = PROG[st.rip];
        st.msg = ""; st.chg = [];
        const before = st.rip;
        ins.run(st);
        if (!st.halted && st.rip === before) st.rip++;
        paint();
      }
      host.addEventListener("click", (e) => {
        const b = e.target.closest("[data-a]"); if (!b) return;
        if (b.dataset.a === "step") step();
        else if (b.dataset.a === "reset") { st = fresh(); paint(); }
        else if (b.dataset.a === "run") {
          let guard = 0;
          const tick = () => { if (!st.halted && guard++ < 30) { step(); setTimeout(tick, 420); } };
          tick();
        }
      });
      paint();
    },
  };

  /* =================================================================
     BASH — file-descriptor wiring: watch stdout/stderr get redirected
     ================================================================= */
  VIZ.bash = {
    title: "Where do stdout and stderr go?",
    blurb:
      "A process is born with three file descriptors. Click a command line and watch " +
      "fd 1 (stdout, green) and fd 2 (stderr, red) get rewired to the terminal, files " +
      "or a pipe — then check where each output line actually landed.",
    mount(host) {
      const OUT = ["building app…", "tests: 42 passed", "deploy complete"];
      const ERR = ["WARN: low disk space", "WARN: cert expires soon"];
      // destination slots (name → y-centre in the SVG)
      const DEST = { term: { y: 44, label: "terminal" }, out: { y: 108, label: "out.txt" }, err: { y: 172, label: "err.log" }, pipe: { y: 236, label: "| wc -l" } };
      const MODES = [
        { cmd: "./deploy.sh",                    o: "term", e: "term" },
        { cmd: "./deploy.sh > out.txt",          o: "out",  e: "term" },
        { cmd: "./deploy.sh 2> err.log",         o: "term", e: "err" },
        { cmd: "./deploy.sh > out.txt 2> err.log", o: "out", e: "err" },
        { cmd: "./deploy.sh > out.txt 2>&1",     o: "out",  e: "out" },
        { cmd: "./deploy.sh 2>&1 | wc -l",       o: "pipe", e: "pipe" },
        { cmd: "./deploy.sh | wc -l",            o: "pipe", e: "term" },
      ];
      let cur = 0;

      host.innerHTML = `
        <div class="viz bashviz">
          <div class="viz-ctrls wrap" data-r="modes"></div>
          <div class="bash-cols">
            <svg viewBox="0 0 560 280" class="bash-svg" data-r="svg" aria-label="File descriptor wiring diagram"></svg>
            <div class="bash-sinks" data-r="sinks"></div>
          </div>
        </div>`;

      $('[data-r="modes"]', host).innerHTML = MODES.map((m, i) =>
        `<button class="viz-btn mono ${i === 0 ? "primary" : ""}" data-m="${i}">${esc(m.cmd)}</button>`).join("");

      function wirePath(fromY, destKey) {
        const d = DEST[destKey];
        return `M 200 ${fromY} C 290 ${fromY}, 320 ${d.y}, 400 ${d.y}`;
      }
      function paint() {
        const m = MODES[cur];
        $$("[data-m]", host).forEach((b) => b.classList.toggle("primary", +b.dataset.m === cur));
        const destBoxes = Object.entries(DEST).map(([k, d]) => {
          const used = m.o === k || m.e === k;
          return `<g opacity="${used ? 1 : 0.32}">
            <rect x="400" y="${d.y - 20}" width="140" height="40" rx="7" class="bash-node ${k === "term" ? "term" : ""}"/>
            <text x="470" y="${d.y + 5}" class="bash-label" text-anchor="middle">${esc(d.label)}</text>
          </g>`;
        }).join("");
        const p1 = wirePath(148, m.o), p2 = wirePath(180, m.e);
        $('[data-r="svg"]', host).innerHTML = `
          <rect x="20" y="60" width="180" height="140" rx="10" class="bash-proc"/>
          <text x="110" y="92" text-anchor="middle" class="bash-title">./deploy.sh</text>
          <text x="34" y="120" class="bash-fd">fd 0 · stdin</text>
          <text x="34" y="152" class="bash-fd fd1">fd 1 · stdout</text>
          <text x="34" y="184" class="bash-fd fd2">fd 2 · stderr</text>
          <circle cx="200" cy="148" r="4" class="port p1"/>
          <circle cx="200" cy="180" r="4" class="port p2"/>
          <path d="${p1}" class="wire w1"/>
          <path d="${p2}" class="wire w2"/>
          ${destBoxes}
          <circle r="4.5" class="dot d1"><animateMotion dur="1.5s" repeatCount="indefinite" path="${p1}"/></circle>
          <circle r="4.5" class="dot d2"><animateMotion dur="1.9s" begin="0.4s" repeatCount="indefinite" path="${p2}"/></circle>`;
        // sinks: what ended up where
        const bucket = { term: [], out: [], err: [], pipe: [] };
        OUT.forEach((l) => bucket[m.o].push(`<span class="ln-out">${esc(l)}</span>`));
        ERR.forEach((l) => bucket[m.e].push(`<span class="ln-err">${esc(l)}</span>`));
        if (bucket.pipe.length) bucket.pipe = [`<span class="ln-dim">wc -l reads ${bucket.pipe.length} lines →</span><span class="ln-out">${bucket.pipe.length}</span>`];
        $('[data-r="sinks"]', host).innerHTML = Object.entries(DEST).map(([k, d]) => `
          <div class="bash-sink ${bucket[k].length ? "" : "empty"}">
            <div class="bash-sink-h">${esc(d.label)}</div>
            <div class="bash-sink-b">${bucket[k].length ? bucket[k].join("") : '<span class="ln-dim">— nothing —</span>'}</div>
          </div>`).join("");
      }
      host.addEventListener("click", (e) => {
        const b = e.target.closest("[data-m]"); if (!b) return;
        cur = +b.dataset.m; paint();
      });
      paint();
    },
  };

  /* =================================================================
     GNU — pipeline forge: assemble a real text pipeline, live output
     ================================================================= */
  VIZ.gnu = {
    title: "Forge a pipeline",
    blurb:
      "The GNU way: small tools, each doing one thing, chained with pipes. Pick a tool " +
      "for each slot and watch a real `access.log` flow through — every intermediate " +
      "result is computed live, exactly as the shell would.",
    mount(host) {
      const LOG = [
        "203.0.113.9 GET /index.html 200",
        "198.51.100.4 GET /admin 403",
        "203.0.113.9 POST /login 200",
        "192.0.2.55 GET /index.html 200",
        "198.51.100.4 GET /admin 403",
        "203.0.113.9 GET /style.css 200",
        "192.0.2.55 POST /login 500",
        "198.51.100.4 GET /admin 403",
        "192.0.2.55 GET /index.html 200",
        "203.0.113.9 GET /missing 404",
        "192.0.2.55 GET /index.html 200",
        "198.51.100.4 POST /login 200",
      ];
      const SLOTS = [
        { name: "filter", opts: [
          ["—", null],
          ["grep GET",     (ls) => ls.filter((l) => l.includes("GET"))],
          ["grep 403",     (ls) => ls.filter((l) => l.includes("403"))],
          ["grep -v 200",  (ls) => ls.filter((l) => !l.includes("200"))],
        ]},
        { name: "carve", opts: [
          ["—", null],
          ["cut -d' ' -f1", (ls) => ls.map((l) => l.split(" ")[0])],
          ["cut -d' ' -f3", (ls) => ls.map((l) => l.split(" ")[2])],
          ["cut -d' ' -f4", (ls) => ls.map((l) => l.split(" ")[3])],
          ["awk '{print $4, $3}'", (ls) => ls.map((l) => { const f = l.split(" "); return f[3] + " " + f[2]; })],
        ]},
        { name: "order", opts: [
          ["—", null],
          ["sort",    (ls) => [...ls].sort()],
          ["sort -r", (ls) => [...ls].sort().reverse()],
        ]},
        { name: "collapse", opts: [
          ["—", null],
          ["uniq",    (ls) => ls.filter((l, i) => i === 0 || l !== ls[i - 1])],
          ["uniq -c", (ls) => { const o = []; ls.forEach((l) => { const p = o[o.length - 1]; if (p && p.l === l) p.n++; else o.push({ l, n: 1 }); }); return o.map((x) => String(x.n).padStart(7) + " " + x.l); }],
        ]},
        { name: "finish", opts: [
          ["—", null],
          ["sort -rn", (ls) => [...ls].sort((a, b) => parseInt(b) - parseInt(a) || a.localeCompare(b))],
          ["head -3",  (ls) => ls.slice(0, 3)],
          ["wc -l",    (ls) => [String(ls.length)]],
        ]},
      ];
      const sel = [1, 1, 1, 2, 1];   // default: grep GET | cut -f1 | sort | uniq -c | sort -rn

      host.innerHTML = `
        <div class="viz gnuviz">
          <div class="gnu-slots" data-r="slots"></div>
          <div class="gnu-cmdline"><span class="prompt">$</span> <code data-r="cmd"></code></div>
          <div class="gnu-flow" data-r="flow"></div>
        </div>`;

      $('[data-r="slots"]', host).innerHTML = SLOTS.map((s, i) => `
        <label class="gnu-slot">
          <span class="gnu-slot-name">${esc(s.name)}</span>
          <select data-s="${i}">
            ${s.opts.map((o, j) => `<option value="${j}" ${sel[i] === j ? "selected" : ""}>${esc(o[0])}</option>`).join("")}
          </select>
        </label>`).join('<span class="gnu-pipe">|</span>');

      function paint() {
        const parts = ["cat access.log"];
        let data = LOG;
        const panes = [{ label: "access.log", lines: LOG }];
        SLOTS.forEach((s, i) => {
          const [label, fn] = s.opts[sel[i]];
          if (!fn) return;
          parts.push(label);
          data = fn(data);
          panes.push({ label, lines: data });
        });
        $('[data-r="cmd"]', host).textContent = parts.join(" | ");
        $('[data-r="flow"]', host).innerHTML = panes.map((p, i) => `
          ${i ? '<div class="gnu-arrow">⇢</div>' : ""}
          <div class="gnu-pane">
            <div class="gnu-pane-h"><code>${esc(p.label)}</code><span>${p.lines.length} line${p.lines.length === 1 ? "" : "s"}</span></div>
            <pre class="gnu-pane-b">${esc(p.lines.join("\n")) || "∅"}</pre>
          </div>`).join("");
      }
      host.addEventListener("change", (e) => {
        const s = e.target.closest("[data-s]"); if (!s) return;
        sel[+s.dataset.s] = +s.value; paint();
      });
      paint();
    },
  };

  /* =================================================================
     LINUX — permission bits: toggle rwx, read octal, test three users
     ================================================================= */
  VIZ.linux = {
    title: "Permission bits, decoded",
    blurb:
      "Every file carries nine bits. Toggle them and watch the octal number, the " +
      "`ls -l` string and the `chmod` command stay in sync — then see what **alice** " +
      "(owner), **bob** (group `devs`) and **eve** (other) can actually do.",
    mount(host) {
      let bits = 0o754;
      const WHO = ["owner", "group", "other"], W = ["r", "w", "x"];
      const USERS = [
        { name: "alice", tag: "owner · alice", cls: 0 },
        { name: "bob",   tag: "group · devs",  cls: 1 },
        { name: "eve",   tag: "other",         cls: 2 },
      ];
      host.innerHTML = `
        <div class="viz lnxviz">
          <div class="viz-ctrls">
            ${[0o644, 0o755, 0o600, 0o777, 0o400].map((p) => `<button class="viz-btn mono" data-p="${p}">${p.toString(8)}</button>`).join("")}
            <span class="viz-status">file: <code>report.sh</code> · owner <b>alice</b> · group <b>devs</b></span>
          </div>
          <div class="lnx-bits" data-r="bits"></div>
          <div class="lnx-read">
            <div class="lnx-out"><span>octal</span><code data-r="oct"></code></div>
            <div class="lnx-out"><span>ls -l</span><code data-r="sym"></code></div>
            <div class="lnx-out"><span>command</span><code data-r="cmd"></code></div>
          </div>
          <div class="lnx-users" data-r="users"></div>
        </div>`;

      function paint() {
        $('[data-r="bits"]', host).innerHTML = WHO.map((w, gi) => `
          <div class="lnx-grp">
            <div class="lnx-grp-h">${w}</div>
            <div class="lnx-grp-b">
              ${W.map((c, bi) => {
                const shift = 8 - (gi * 3 + bi);
                const on = (bits >> shift) & 1;
                return `<button class="lnx-bit ${on ? "on" : ""}" data-shift="${shift}" aria-pressed="${!!on}">
                  <b>${c}</b><span>${on ? 4 >> bi : 0}</span></button>`;
              }).join("")}
            </div>
            <div class="lnx-grp-n">${(bits >> (6 - gi * 3)) & 7}</div>
          </div>`).join('<div class="lnx-sep"></div>');
        const sym = "-" + [...Array(9)].map((_, i) => ((bits >> (8 - i)) & 1) ? W[i % 3] : "-").join("");
        $('[data-r="oct"]', host).textContent = bits.toString(8).padStart(3, "0");
        $('[data-r="sym"]', host).textContent = `${sym} alice devs report.sh`;
        $('[data-r="cmd"]', host).textContent = `chmod ${bits.toString(8).padStart(3, "0")} report.sh`;
        $('[data-r="users"]', host).innerHTML = USERS.map((u) => {
          const g = (bits >> (6 - u.cls * 3)) & 7;
          const can = (m, label) => `<span class="lnx-can ${g & m ? "yes" : "no"}">${g & m ? "✓" : "✗"} ${label}</span>`;
          return `<div class="lnx-user"><div class="lnx-user-h">${u.name} <em>${u.tag}</em></div>
            ${can(4, "read")}${can(2, "write")}${can(1, "execute")}
            <div class="lnx-verdict">${g & 1 ? `<code>./report.sh</code> runs` : `<code>./report.sh</code> → Permission denied`}</div>
          </div>`;
        }).join("");
      }
      host.addEventListener("click", (e) => {
        const bit = e.target.closest("[data-shift]");
        if (bit) { bits ^= (1 << +bit.dataset.shift); paint(); return; }
        const pre = e.target.closest("[data-p]");
        if (pre) { bits = +pre.dataset.p; paint(); }
      });
      paint();
    },
  };

  /* =================================================================
     NETWORKING — a packet's journey: encapsulate, hop, decapsulate
     ================================================================= */
  VIZ.networking = {
    title: "Follow one packet through the layers",
    blurb:
      "Step an HTTPS request from your laptop to a web server. Watch each layer wrap " +
      "the one above it, then watch what changes at the router hop (MACs and TTL) and " +
      "what never changes (the IP addresses, the TCP ports, your data).",
    mount(host) {
      const LAYERS = {
        http: { cls: "l-http", name: "HTTP",     fields: () => ["GET / HTTP/1.1", "Host: shop.example"] },
        tcp:  { cls: "l-tcp",  name: "TCP",      fields: () => ["src port 51334", "dst port 443", "seq 1"] },
        ip:   { cls: "l-ip",   name: "IP",       fields: (s) => [`src 192.168.1.23`, `dst 203.0.113.80`, `TTL ${s.ttl}`] },
        eth:  { cls: "l-eth",  name: "Ethernet", fields: (s) => [`src ${s.smac}`, `dst ${s.dmac}`] },
      };
      const STEPS = [
        { at: 0, stack: ["http"],                     hot: ["http"], say: "The application writes its message: a plain-text HTTP request. It knows nothing about networks." },
        { at: 0, stack: ["tcp", "http"],              hot: ["tcp"],  say: "TCP wraps it: ports say *which program* on each machine, sequence numbers let lost pieces be resent." },
        { at: 0, stack: ["ip", "tcp", "http"],        hot: ["ip"],   say: "IP wraps that: addresses say *which machine*, valid across the whole internet. TTL starts at 64." },
        { at: 0, stack: ["eth", "ip", "tcp", "http"], hot: ["eth"],  say: "Ethernet wraps everything for the local link only: destination MAC is your **router**, not the server (ARP told us that)." },
        { at: 1, stack: ["eth", "ip", "tcp", "http"], hot: [],       say: "The frame crosses the cable/Wi-Fi to the router.", move: true },
        { at: 1, stack: ["eth", "ip", "tcp", "http"], hot: ["eth", "ip"], say: "The router strips the Ethernet frame, reads the IP destination, decrements **TTL 64 → 63**, and wraps a **new** frame with new MACs. IPs and ports are untouched.", ttl: 63, smac: "rt:00:aa:12:9e:01", dmac: "sv:44:be:0a:77:c2" },
        { at: 2, stack: ["eth", "ip", "tcp", "http"], hot: [],       say: "The new frame crosses the next link to the server.", move: true },
        { at: 2, stack: ["ip", "tcp", "http"],        hot: ["ip"],   say: "The server strips Ethernet, sees its own IP address — this packet is for me." },
        { at: 2, stack: ["tcp", "http"],              hot: ["tcp"],  say: "The kernel strips IP, reads TCP port 443 → hands the data to the web server process listening there." },
        { at: 2, stack: ["http"],                     hot: ["http"], say: "The application reads the original HTTP request, untouched by the journey — and answers `200 OK` back down the same stack." },
      ];
      const NODES = ["laptop 💻", "router 📡", "server 🖥"];
      let i = -1;
      const state = () => {
        const s = { ttl: 64, smac: "my:3c:71:e4:22:b1", dmac: "rt:00:aa:12:9e:01" };
        for (let k = 0; k <= i; k++) { if (STEPS[k].ttl) s.ttl = STEPS[k].ttl; if (STEPS[k].smac) { s.smac = STEPS[k].smac; s.dmac = STEPS[k].dmac; } }
        return s;
      };

      host.innerHTML = `
        <div class="viz netviz">
          <div class="viz-ctrls">
            <button class="viz-btn primary" data-a="step">Step ▸</button>
            <button class="viz-btn" data-a="reset">Reset ⟲</button>
            <span class="viz-status" data-r="stat">press Step to send the request</span>
          </div>
          <div class="net-topo" data-r="topo"></div>
          <div class="net-stack-wrap"><div class="net-stack" data-r="stack"></div></div>
          <p class="net-say" data-r="say">A packet is about to be born on the laptop.</p>
        </div>`;

      function paint() {
        const stp = i >= 0 ? STEPS[i] : { at: 0, stack: [], hot: [], say: "A packet is about to be born on the laptop." };
        const s = state();
        $('[data-r="topo"]', host).innerHTML = NODES.map((n, ni) => `
          <div class="net-node ${stp.at === ni ? "cur" : ""}">${n}</div>
          ${ni < 2 ? `<div class="net-link ${stp.move && stp.at === ni + 1 ? "moving" : ""}"><span class="net-pkt">▣</span></div>` : ""}`).join("");
        let inner = `<div class="net-data">…</div>`;
        [...stp.stack].reverse().forEach((key) => {
          const L = LAYERS[key];
          inner = `<div class="net-layer ${L.cls} ${stp.hot.includes(key) ? "hot" : ""}">
            <div class="net-layer-h">${L.name}</div>
            <div class="net-layer-f">${L.fields(s).map((f) => `<code>${esc(f)}</code>`).join("")}</div>
            ${inner}</div>`;
        });
        $('[data-r="stack"]', host).innerHTML = stp.stack.length ? inner : '<div class="net-empty">no packet yet</div>';
        $('[data-r="say"]', host).innerHTML = stp.say
          .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>")
          .replace(/\*([^*]+)\*/g, "<i>$1</i>");
        $('[data-r="stat"]', host).textContent =
          i < 0 ? "press Step to send the request" :
          i === STEPS.length - 1 ? "delivered — step 10 / 10" : `step ${i + 1} / ${STEPS.length}`;
      }
      host.addEventListener("click", (e) => {
        const b = e.target.closest("[data-a]"); if (!b) return;
        if (b.dataset.a === "reset") i = -1;
        else if (i < STEPS.length - 1) i++;
        paint();
      });
      paint();
    },
  };

  /* =================================================================
     BROWSER — from URL to pixels: the page-load pipeline + live DOM
     ================================================================= */
  VIZ.browser = {
    title: "From URL to pixels",
    blurb:
      "Everything that happens between pressing Enter and seeing a page. Step through " +
      "the pipeline: name resolution, handshakes, the response — then watch the DOM " +
      "tree assemble node-by-node and finally paint.",
    mount(host) {
      const DOMSTEPS = [
        ["html", 0], ["head", 1], ["title", 2], ["body", 1], ["h1", 2], ["p", 2], ["a", 3],
      ];
      const PHASES = [
        { k: "URL",   say: "The bar parses <code>https://shop.example/</code> — scheme <b>https</b>, host <b>shop.example</b>, path <b>/</b>. Port 443 is implied by the scheme.",
          art: `<div class="br-url"><span class="u-scheme">https</span>://<span class="u-host">shop.example</span><span class="u-path">/</span><span class="u-port">:443</span></div>` },
        { k: "DNS",   say: "The resolver turns the name into an address: cache → OS → recursive resolver → answer.",
          art: `<div class="br-kv"><code>shop.example</code><span class="br-arrow">→ A record →</span><code>203.0.113.80</code></div>` },
        { k: "TCP",   say: "Three packets open a reliable byte-pipe to 203.0.113.80:443.",
          art: `<div class="br-shake"><span>SYN →</span><span>← SYN-ACK</span><span>ACK →</span></div>` },
        { k: "TLS",   say: "The handshake proves the server's identity (certificate) and agrees on session keys. Everything after this line is encrypted.",
          art: `<div class="br-shake"><span>ClientHello →</span><span>← cert + ServerHello</span><span>keys agreed 🔒</span></div>` },
        { k: "HTTP",  say: "Now, finally, the actual request — and the response with headers and HTML body.",
          art: `<div class="br-http"><pre>GET / HTTP/1.1\nHost: shop.example</pre><pre>HTTP/1.1 200 OK\nContent-Type: text/html\n\n&lt;html&gt;…</pre></div>` },
        { k: "Parse", say: "The parser reads HTML top-to-bottom, building the <b>DOM tree</b> — watch it grow on the right. Scripts can pause this; stylesheets build the CSSOM alongside.", grow: 4 },
        { k: "DOM ✓", say: "Tree complete — <code>DOMContentLoaded</code> fires. The render tree combines DOM + CSSOM, layout assigns every box a position and size.", grow: 7 },
        { k: "Paint", say: "Pixels at last: paint + composite put the page on screen. Typical budget for all of this on a good connection: under a second.", grow: 7, paint: true },
      ];
      let i = 0;

      host.innerHTML = `
        <div class="viz brviz">
          <div class="viz-ctrls">
            <button class="viz-btn primary" data-a="step">Step ▸</button>
            <button class="viz-btn" data-a="reset">Reset ⟲</button>
            <span class="viz-status" data-r="stat"></span>
          </div>
          <div class="br-phases" data-r="phases"></div>
          <div class="br-cols">
            <div class="br-main">
              <div class="br-art" data-r="art"></div>
              <p class="br-say" data-r="say"></p>
            </div>
            <div class="br-side">
              <div class="viz-panel-h">DOM tree</div>
              <div class="br-dom" data-r="dom"></div>
              <div class="viz-panel-h">viewport</div>
              <div class="br-page" data-r="page"><span class="br-blank">about:blank</span></div>
            </div>
          </div>
        </div>`;

      function paint() {
        const ph = PHASES[i];
        $('[data-r="phases"]', host).innerHTML = PHASES.map((p, pi) =>
          `<button class="br-phase ${pi === i ? "cur" : pi < i ? "done" : ""}" data-i="${pi}">${esc(p.k)}</button>`).join('<span class="br-sep">›</span>');
        $('[data-r="art"]', host).innerHTML = ph.art || "";
        $('[data-r="say"]', host).innerHTML = ph.say;
        const n = ph.grow || 0;
        $('[data-r="dom"]', host).innerHTML = n
          ? DOMSTEPS.slice(0, n).map(([t, d], di) =>
              `<div class="br-node ${di === n - 1 && !ph.paint ? "new" : ""}" style="margin-left:${d * 16}px">&lt;${t}&gt;</div>`).join("")
          : '<span class="br-blank">— empty —</span>';
        $('[data-r="page"]', host).innerHTML = ph.paint
          ? `<div class="br-render"><div class="br-r-h1">Welcome to shop.example</div><div class="br-r-p"></div><div class="br-r-p short"></div><div class="br-r-btn">Shop now</div></div>`
          : '<span class="br-blank">about:blank</span>';
        $('[data-r="stat"]', host).textContent = `phase ${i + 1} / ${PHASES.length}`;
      }
      host.addEventListener("click", (e) => {
        const p = e.target.closest("[data-i]");
        if (p) { i = +p.dataset.i; paint(); return; }
        const b = e.target.closest("[data-a]"); if (!b) return;
        if (b.dataset.a === "reset") i = 0; else i = Math.min(i + 1, PHASES.length - 1);
        paint();
      });
      paint();
    },
  };

  /* =================================================================
     REGEX — live pattern lab: highlighted matches + token explainer
     ================================================================= */
  VIZ.regex = {
    title: "Live pattern lab",
    blurb:
      "Type a pattern and watch it hunt through the sample text in real time. Below, " +
      "every token of your pattern is explained — edit either side and see what changes.",
    mount(host) {
      const SAMPLE =
        "Contact ada@carino.systems or grace_h@example.org today.\n" +
        "Server logs: 2026-07-24 14:02:11 ERROR disk 87% full\n" +
        "IPs seen: 192.168.1.23, 10.0.0.5 and 8.8.8.8\n" +
        "Order codes: AB-1042, ab-9, XY-77 (legacy: Z_3)";
      let pattern = "\\b\\w+[\\w.]*@\\w+\\.\\w{2,}\\b";
      let flags = "g";

      host.innerHTML = `
        <div class="viz rxviz">
          <div class="rx-bar">
            <span class="rx-delim">/</span>
            <input class="rx-input" data-r="pat" value="${esc(pattern)}" spellcheck="false" aria-label="Regular expression pattern">
            <span class="rx-delim">/</span>
            <label class="rx-flag"><input type="checkbox" data-f="g" checked>g</label>
            <label class="rx-flag"><input type="checkbox" data-f="i">i</label>
            <label class="rx-flag"><input type="checkbox" data-f="m">m</label>
            <span class="viz-status" data-r="stat"></span>
          </div>
          <div class="viz-ctrls wrap" data-r="presets">
            <button class="viz-btn mono" data-pt="\\b\\w+[\\w.]*@\\w+\\.\\w{2,}\\b">emails</button>
            <button class="viz-btn mono" data-pt="\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b">IPv4</button>
            <button class="viz-btn mono" data-pt="\\d{4}-\\d{2}-\\d{2}">dates</button>
            <button class="viz-btn mono" data-pt="[A-Z]{2}-\\d+">codes</button>
            <button class="viz-btn mono" data-pt="^\\w+">line starts</button>
          </div>
          <pre class="rx-text" data-r="text"></pre>
          <div class="viz-panel-h">token by token</div>
          <div class="rx-tokens" data-r="tokens"></div>
        </div>`;

      const CLS_DESC = { d: "a digit 0-9", D: "anything but a digit", w: "a word character [A-Za-z0-9_]", W: "a non-word character", s: "a whitespace character", S: "a non-whitespace character", b: "a word boundary (zero-width)", B: "not a word boundary", n: "a newline", t: "a tab" };
      function tokenize(p) {
        const out = []; let i = 0;
        const push = (tok, desc) => out.push({ tok, desc });
        while (i < p.length) {
          const c = p[i];
          if (c === "\\") {
            const n = p[i + 1] || "";
            push("\\" + n, CLS_DESC[n] || `the literal character “${n}”`); i += 2;
          } else if (c === "[") {
            let j = i + 1, body = ""; if (p[j] === "^") { j++; }
            while (j < p.length && p[j] !== "]") { if (p[j] === "\\") { body += p[j] + (p[j + 1] || ""); j += 2; } else { body += p[j]; j++; } }
            const neg = p[i + 1] === "^";
            push(p.slice(i, j + 1), (neg ? "any character NOT in the set " : "any one character from the set ") + body); i = j + 1;
          } else if (c === "(") {
            if (p.startsWith("(?:", i)) { push("(?:", "start of a non-capturing group"); i += 3; }
            else if (p.startsWith("(?=", i)) { push("(?=", "lookahead: what follows must match this (not consumed)"); i += 3; }
            else if (p.startsWith("(?!", i)) { push("(?!", "negative lookahead: what follows must NOT match this"); i += 3; }
            else { push("(", "start of capturing group"); i++; }
          } else if (c === ")") { push(")", "end of group"); i++; }
          else if (c === "{") {
            const m = /^\{(\d+)(,(\d*)?)?\}/.exec(p.slice(i));
            if (m) { push(m[0], m[2] == null ? `exactly ${m[1]} times` : m[3] ? `between ${m[1]} and ${m[3]} times` : `${m[1]} or more times`); i += m[0].length; }
            else { push("{", "a literal “{”"); i++; }
          }
          else if (c === "+") { push("+", "one or more of the previous (greedy)"); i++; }
          else if (c === "*") { push("*", "zero or more of the previous (greedy)"); i++; }
          else if (c === "?") {
            const prev = out[out.length - 1];
            if (prev && /[+*}?]$/.test(prev.tok)) push("?", "…but lazy: match as little as possible");
            else push("?", "the previous item is optional (0 or 1)");
            i++;
          }
          else if (c === "|") { push("|", "OR — match either side"); i++; }
          else if (c === "^") { push("^", "anchor: start of string (or line with /m)"); i++; }
          else if (c === "$") { push("$", "anchor: end of string (or line with /m)"); i++; }
          else if (c === ".") { push(".", "any single character except newline"); i++; }
          else {
            let j = i; while (j < p.length && !/[\\\[\](){}+*?|^$.]/.test(p[j])) j++;
            push(p.slice(i, j), `the literal text “${p.slice(i, j)}”`); i = j;
          }
        }
        return out;
      }

      function paint() {
        const statEl = $('[data-r="stat"]', host), textEl = $('[data-r="text"]', host);
        let re;
        try { re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g"); }
        catch (err) {
          statEl.textContent = "✗ " + err.message; statEl.classList.add("err");
          textEl.innerHTML = esc(SAMPLE);
          $('[data-r="tokens"]', host).innerHTML = '<span class="ln-dim">fix the pattern to see its anatomy</span>';
          return;
        }
        statEl.classList.remove("err");
        let html = "", last = 0, m, count = 0, guard = 0;
        while ((m = re.exec(SAMPLE)) && guard++ < 500) {
          html += esc(SAMPLE.slice(last, m.index));
          html += `<mark class="rx-m${count % 2}">${esc(m[0]) || "∅"}</mark>`;
          last = m.index + m[0].length; count++;
          if (m[0] === "") re.lastIndex++;
          if (!flags.includes("g")) break;
        }
        html += esc(SAMPLE.slice(last));
        textEl.innerHTML = html;
        statEl.textContent = `${count} match${count === 1 ? "" : "es"}`;
        $('[data-r="tokens"]', host).innerHTML = tokenize(pattern).map((t) =>
          `<div class="rx-tok"><code>${esc(t.tok)}</code><span>${esc(t.desc)}</span></div>`).join("") || '<span class="ln-dim">empty pattern</span>';
      }
      $('[data-r="pat"]', host).addEventListener("input", (e) => { pattern = e.target.value; paint(); });
      host.addEventListener("change", (e) => {
        const f = e.target.closest("[data-f]"); if (!f) return;
        flags = ["g", "i", "m"].filter((x) => $(`[data-f="${x}"]`, host).checked).join("");
        paint();
      });
      host.addEventListener("click", (e) => {
        const b = e.target.closest("[data-pt]"); if (!b) return;
        pattern = b.dataset.pt; $('[data-r="pat"]', host).value = pattern; paint();
      });
      paint();
    },
  };

  /* =================================================================
     ISO 27001 — PDCA wheel + the full Annex A map (93 checkable
     controls, persisted in localStorage under the learn. prefix)
     ================================================================= */
  const ANNEX_A = [
    { id: "A5", name: "A.5 Organisational", controls: [
      ["5.1","Policies for information security"],["5.2","Roles and responsibilities"],["5.3","Segregation of duties"],["5.4","Management responsibilities"],["5.5","Contact with authorities"],["5.6","Contact with special interest groups"],["5.7","Threat intelligence"],["5.8","Security in project management"],["5.9","Inventory of information & assets"],["5.10","Acceptable use of assets"],["5.11","Return of assets"],["5.12","Classification of information"],["5.13","Labelling of information"],["5.14","Information transfer"],["5.15","Access control"],["5.16","Identity management"],["5.17","Authentication information"],["5.18","Access rights"],["5.19","Security in supplier relationships"],["5.20","Security within supplier agreements"],["5.21","ICT supply chain security"],["5.22","Monitoring of supplier services"],["5.23","Security for cloud services"],["5.24","Incident mgmt planning"],["5.25","Assessment of security events"],["5.26","Response to incidents"],["5.27","Learning from incidents"],["5.28","Collection of evidence"],["5.29","Security during disruption"],["5.30","ICT readiness for continuity"],["5.31","Legal & contractual requirements"],["5.32","Intellectual property rights"],["5.33","Protection of records"],["5.34","Privacy and protection of PII"],["5.35","Independent review of security"],["5.36","Compliance with policies & standards"],["5.37","Documented operating procedures"],
    ]},
    { id: "A6", name: "A.6 People", controls: [
      ["6.1","Screening"],["6.2","Terms and conditions of employment"],["6.3","Awareness, education and training"],["6.4","Disciplinary process"],["6.5","Responsibilities after termination"],["6.6","Confidentiality / NDA"],["6.7","Remote working"],["6.8","Security event reporting"],
    ]},
    { id: "A7", name: "A.7 Physical", controls: [
      ["7.1","Physical security perimeters"],["7.2","Physical entry"],["7.3","Securing offices & facilities"],["7.4","Physical security monitoring"],["7.5","Physical & environmental threats"],["7.6","Working in secure areas"],["7.7","Clear desk and clear screen"],["7.8","Equipment siting and protection"],["7.9","Security of assets off-premises"],["7.10","Storage media"],["7.11","Supporting utilities"],["7.12","Cabling security"],["7.13","Equipment maintenance"],["7.14","Secure disposal or re-use"],
    ]},
    { id: "A8", name: "A.8 Technological", controls: [
      ["8.1","User endpoint devices"],["8.2","Privileged access rights"],["8.3","Information access restriction"],["8.4","Access to source code"],["8.5","Secure authentication"],["8.6","Capacity management"],["8.7","Protection against malware"],["8.8","Technical vulnerabilities"],["8.9","Configuration management"],["8.10","Information deletion"],["8.11","Data masking"],["8.12","Data leakage prevention"],["8.13","Information backup"],["8.14","Redundancy of facilities"],["8.15","Logging"],["8.16","Monitoring activities"],["8.17","Clock synchronization"],["8.18","Privileged utility programs"],["8.19","Software installation control"],["8.20","Networks security"],["8.21","Security of network services"],["8.22","Segregation of networks"],["8.23","Web filtering"],["8.24","Use of cryptography"],["8.25","Secure development life cycle"],["8.26","Application security requirements"],["8.27","Secure architecture principles"],["8.28","Secure coding"],["8.29","Security testing in development"],["8.30","Outsourced development"],["8.31","Separation of dev/test/prod"],["8.32","Change management"],["8.33","Test information"],["8.34","Systems protection during audit"],
    ]},
  ];
  const PDCA = [
    { k: "Plan",  cls: "plan",  clauses: "Clauses 4 · 5 · 6", desc: "Understand context, set the scope, get leadership signed on, assess risks, choose Annex A controls, write the SoA and objectives.", docs: "Scope Statement · Information Security Policy · Risk Methodology & Register · SoA · Objectives" },
    { k: "Do",    cls: "do",    clauses: "Clauses 7 · 8", desc: "Resource it and run it: train people, operate the controls and procedures, execute the risk treatment plan day to day.", docs: "All Annex A policies · Incident / Access / Change / Vulnerability procedures · Training register" },
    { k: "Check", cls: "check", clauses: "Clause 9", desc: "Measure the objectives, run internal audits, and put the results in front of management — with minutes.", docs: "Internal Audit Checklist · Management Review Minutes · Supplier Assessments" },
    { k: "Act",   cls: "act",   clauses: "Clause 10", desc: "Raise nonconformities, find root causes, apply corrective actions, and feed everything learned back into the next Plan.", docs: "Corrective Action Register → back into the Risk Register" },
  ];

  VIZ.iso27001 = {
    title: "The PDCA wheel & the Annex A map",
    blurb:
      "Two instruments in one: click the **PDCA quadrants** to see which clauses and " +
      "which of this module's documents drive each phase, then work the **Annex A map** " +
      "— all 93 controls of ISO/IEC 27002:2022, tickable, saved in your browser.",
    mount(host) {
      const KEY = "learn.iso-annexa";
      let ticked;
      try { ticked = new Set(JSON.parse(localStorage.getItem(KEY)) || []); }
      catch { ticked = new Set(); }
      const save = () => localStorage.setItem(KEY, JSON.stringify([...ticked]));
      let phase = 0;

      // quarter-circle arcs for the wheel
      const arc = (a0, a1) => {
        const r = 88, R = 150, cx = 160, cy = 160;
        const p = (r_, a) => [cx + r_ * Math.cos(a), cy + r_ * Math.sin(a)];
        const [x0, y0] = p(R, a0), [x1, y1] = p(R, a1), [x2, y2] = p(r, a1), [x3, y3] = p(r, a0);
        return `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${r} ${r} 0 0 0 ${x3} ${y3} Z`;
      };
      const A = Math.PI / 2, off = -Math.PI / 2 + 0.02;
      const labelAt = (qi) => {
        const a = off - 0.02 + A * qi + A / 2, r = 119;
        return [160 + r * Math.cos(a), 160 + r * Math.sin(a)];
      };

      host.innerHTML = `
        <div class="viz isoviz">
          <div class="iso-top">
            <svg viewBox="0 0 320 320" class="iso-wheel" data-r="wheel" aria-label="PDCA cycle wheel">
              ${PDCA.map((p, qi) => `<path d="${arc(off + A * qi, off + A * (qi + 1) - 0.04)}" class="iso-q ${p.cls}" data-q="${qi}"/>`).join("")}
              ${PDCA.map((p, qi) => { const [x, y] = labelAt(qi); return `<text x="${x}" y="${y}" class="iso-qlbl" data-q="${qi}" text-anchor="middle" dominant-baseline="middle">${p.k}</text>`; }).join("")}
              <text x="160" y="152" text-anchor="middle" class="iso-center">PDCA</text>
              <text x="160" y="176" text-anchor="middle" class="iso-center-sub">continual improvement</text>
              <path d="M 160 24 l 12 -9 l -3 11" class="iso-arrowhead"/>
            </svg>
            <div class="iso-phase" data-r="phase"></div>
          </div>
          <div class="viz-panel-h">Annex A — 93 controls, 4 families <span class="iso-total" data-r="total"></span></div>
          <div class="iso-fams" data-r="fams"></div>
        </div>`;

      function paintPhase() {
        const p = PDCA[phase];
        $$(".iso-q", host).forEach((q) => q.classList.toggle("cur", +q.dataset.q === phase));
        $('[data-r="phase"]', host).innerHTML = `
          <div class="iso-phase-k ${p.cls}">${p.k}</div>
          <div class="iso-phase-c">${p.clauses}</div>
          <p class="iso-phase-d">${p.desc}</p>
          <div class="iso-phase-docs"><b>Documents in this module:</b> ${p.docs}</div>`;
      }
      function paintFams() {
        let all = 0;
        $('[data-r="fams"]', host).innerHTML = ANNEX_A.map((f) => {
          const n = f.controls.filter(([num]) => ticked.has(num)).length;
          all += n;
          const pct = Math.round((n / f.controls.length) * 100);
          return `<div class="iso-fam">
            <div class="iso-fam-h"><span>${esc(f.name)}</span>
              <span class="iso-fam-n">${n} / ${f.controls.length}</span></div>
            <div class="iso-fam-bar"><div style="width:${pct}%"></div></div>
            <div class="iso-ctrls">${f.controls.map(([num, name]) =>
              `<button class="iso-ctl ${ticked.has(num) ? "on" : ""}" data-c="${num}" title="${esc(num + " " + name)}" aria-pressed="${ticked.has(num)}"><b>${num}</b> ${esc(name)}</button>`).join("")}</div>
          </div>`;
        }).join("");
        $('[data-r="total"]', host).textContent = `· ${all} / 93 reviewed`;
      }
      host.addEventListener("click", (e) => {
        const q = e.target.closest("[data-q]");
        if (q) { phase = +q.dataset.q; paintPhase(); return; }
        const c = e.target.closest("[data-c]");
        if (c) {
          const id = c.dataset.c;
          if (ticked.has(id)) ticked.delete(id); else ticked.add(id);
          save(); paintFams();
        }
      });
      paintPhase(); paintFams();
    },
  };
})();
