# CarinoLearn

Practical, **beginner-friendly** roadmaps for the low-level Linux stack and the web. Seven
hands-on courses, one site. Every stage opens with why it matters, ships a runnable snippet
with a **line-by-line walkthrough**, and gives you small **drills** plus a real exercise.

Pick a course from the **slice-menu** chooser on the landing page; it collapses into a tab
bar once you're inside one. Progress is saved per-course in your browser.

## Courses

| # | Course | What it covers |
| - | --- | --- |
| 01 | **Assembly** (x86-64 · NASM · Linux) | From your first `syscall` to boot sectors, interrupts, paging and context switching — assembly as a flashlight for understanding operating systems. 13 stages. |
| 02 | **Bash** | Living in the shell, then writing robust scripts: quoting, expansion, pipes, conditionals, loops, functions, arrays, `set -euo pipefail`, traps. 12 stages. |
| 03 | **GNU Utils** | The classic text-processing toolkit: `ls`/`cat`/`grep`/`find`/`sort`/`cut`/`tr`/`sed`/`awk`/`xargs`/`tar`, composed into pipelines. 12 stages. |
| 04 | **Linux** (Fedora · CentOS · RHEL) | Administering the Red Hat family: FHS, users & permissions, `dnf`/`rpm`, systemd, journald, networking (`nmcli`), firewalld, SELinux, LVM, timers. 12 stages. |
| 05 | **Networking** (from the wire up) | The practical basis of all networking: layers, network hardware (NIC/switch/router/AP), addressing & subnets, ports/sockets, routing & NAT, a DNS deep-dive + "is it DNS?" playbook, `tcpdump`, network mapping (`nmap`/`ip neigh`), TLS, firewalls, and a layered troubleshooting method. Links the [network.carino.systems](https://network.carino.systems) toolkit. 13 stages. |
| 06 | **Web Browsers** (how the web runs) | What a browser really is (engines, site isolation), HTML/CSS/DOM, JS & the console, page loading, HTTP & headers, cookies/storage, origins/CORS/security, caching, **permissions** (geolocation/camera/mic/notifications), privacy/tracking/extensions, and troubleshooting broken pages & cert/DNS errors — all via DevTools. Acronyms spelled out + a glossary card. 13 stages. |
| 07 | **Regex** (pattern matching) | Regular expressions from scratch: literals, metacharacters & escaping, character classes, anchors, quantifiers, greedy vs lazy, groups & alternation, backreferences, lookaround, flavors (POSIX BRE/ERE · PCRE · JS), and using them in `grep`/`sed`/`awk`/JS/Python — with a catastrophic-backtracking capstone. 13 stages. |

Each course is split into 3–4 **tracks** (foundations → applied → advanced) and ends with a
capstone that ties the pieces together. **88 stages across 7 courses.** The acronym-dense
Networking and Web Browsers courses expand every acronym on first use and include an
"acronyms & jargon" glossary reference card.

## Run it

Static site, no build step:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Deep links work: `#assembly`, `#bash/stage-5`, `#linux/reference`, etc.

## Structure

```
index.html              # shell: Carino navbar + slice-menu chooser
css/styles.css          # gold-on-black design system + slice menu + course view
js/app.js               # platform: slice routing, rendering, progress, highlighter
js/courses/
  assembly.js           # each course registers itself into window.COURSES
  bash.js
  gnu.js
  linux.js
logo.svg
```

Adding a course is just another file in `js/courses/` that pushes onto `window.COURSES`
(same object shape as `assembly.js`) and a matching `<script>` tag in `index.html`.

## License

MIT — part of the [carino.systems](https://carino.systems/) workshop.
