# Carino Learn

Practical, **beginner-friendly** roadmaps for the low-level Linux stack, the web, hospital
IT, security and the frontier. Thirteen hands-on courses, one site. Every stage opens with why it
matters, ships a runnable snippet with a **line-by-line walkthrough**, and gives you small
**drills** plus a real exercise. Every course also carries **interactive labs**: a headline
visualizer at the top plus smaller widgets embedded right after the stages that teach them
(a live CPU stepper, an fd-wiring diagram, a pipeline forge, a subnet splitter, an HL7
dissector, a risk matrix… all pure DOM/SVG, no libraries).

Pick a course from the **slice-menu** chooser on the landing page; it collapses into a tab
bar once you're inside one. Progress is saved per-course in your browser.

## Courses

| # | Course | What it covers |
| - | --- | --- |
| 01 | **Assembly** (x86-64 · NASM · Linux) | From your first `syscall` to boot sectors, interrupts, paging and context switching — assembly as a flashlight for understanding operating systems. 13 stages. |
| 02 | **Bash** | Living in the shell, then writing robust scripts: quoting, expansion, pipes, conditionals, loops, functions, arrays, `set -euo pipefail`, traps. 12 stages. |
| 03 | **GNU Utils** | The classic text-processing toolkit: `ls`/`cat`/`grep`/`find`/`sort`/`cut`/`tr`/`sed`/`awk`/`xargs`/`tar`, composed into pipelines. 12 stages. |
| 04 | **Linux** (Fedora · CentOS · RHEL) | Administering the Red Hat family: FHS, users & permissions, `dnf`/`rpm`, systemd, journald, networking (`nmcli`), firewalld, SELinux, LVM, timers. 12 stages. |
| 05 | **Networking** (from the wire up) | The practical basis of all networking: layers, network hardware (NIC/switch/router/AP), addressing & subnets, ports/sockets, routing & NAT, a DNS deep-dive + "is it DNS?" playbook, `tcpdump`, network mapping (`nmap`/`ip neigh`), TLS, firewalls, and a layered troubleshooting method. Links the [topo.carino.systems](https://topo.carino.systems) toolkit. 13 stages. |
| 06 | **Web Browsers** (how the web runs) | What a browser really is (engines, site isolation), HTML/CSS/DOM, JS & the console, page loading, HTTP & headers, cookies/storage, origins/CORS/security, caching, **permissions** (geolocation/camera/mic/notifications), privacy/tracking/extensions, and troubleshooting broken pages & cert/DNS errors — all via DevTools. Acronyms spelled out + a glossary card. 13 stages. |
| 07 | **Regex** (pattern matching) | Regular expressions from scratch: literals, metacharacters & escaping, character classes, anchors, quantifiers, greedy vs lazy, groups & alternation, backreferences, lookaround, flavors (POSIX BRE/ERE · PCRE · JS), and using them in `grep`/`sed`/`awk`/JS/Python — with a catastrophic-backtracking capstone. 13 stages. |
| 08 | **DICOM & HL7** (healthcare interoperability) | How hospital systems talk: the HIS/RIS/PACS/EMR map, the patient journey message-by-message, identifiers (MRN · accession · UIDs), the RIS order lifecycle, HL7 v2 anatomy, ADT/ORM/ORU, ACKs & MLLP, the DICOM data model (tags/VRs/part-10), the patient→study→series→instance hierarchy, DIMSE services (C-ECHO/STORE/FIND), retrieval (C-MOVE vs C-GET vs DICOMweb), Modality Worklist, N-services (film printers, MPPS, storage commitment), FHIR, and PHI de-identification. Labs: a clickable HL7 dissector, a RIS order stepper, a header anonymizer, a PACS association stepper, a C-MOVE/C-GET comparator, a film-printer job. 16 stages. |
| 09 | **ISO 27001** (information security management) | Build, run and audit an ISMS: scope, leadership, objectives, risk assessment & treatment, the full Annex A control library (93 tickable controls), procedures, records and audit — with ready-to-copy document templates per stage. 12 stages. |
| 10 | **PC Architecture** (silicon, buses & boot) | The physical machine under everything: CPU & caches, DRAM, PCIe/chipset, storage (HDD→NVMe, SMART), GPUs, power & cooling, UEFI firmware, the boot chain, spec-ing sane builds, diagnostics and performance literacy — driven by `lscpu`/`lspci`/`smartctl`/`sensors` on a real Linux box. Labs: memory-hierarchy-at-human-scale, cache hit/miss simulator, boot-chain stepper, bottleneck finder. 12 stages. |
| 11 | **Git & Version Control** (history as a graph) | Snapshots not diffs, the three areas, commits/branches as pointers, merge vs rebase, conflicts, undo-anything (reset triad + reflog), remotes & GitHub flow, repo hygiene, history archaeology (`bisect`, pickaxe), hooks & automation — angled at the solo multi-repo maintainer. Labs: a live commit-graph playground (SVG DAG), three-areas visualizer, reset comparator, sync-states simulator. 13 stages. |
| 12 | **Cryptography** (secrets, signatures & trust) | From breaking Caesar in Python to the modern toolkit: randomness & key sizes, AES & modes (the ECB penguin), hashes, HMAC, Diffie-Hellman, RSA/ECC, signatures, PKI & TLS, password storage (KDFs), how crypto fails in practice, and post-quantum (Kyber/Dilithium/hash-based). openssl-driven. Labs: live DH mixer, ECB penguin, avalanche visualizer, crack-speed calculator. 13 stages. |
| 13 | **Quantum Computing** (qubits, gates & the RSA countdown) | Real amplitude math, no hand-waving: qubits, interference as the engine, entanglement, gates & circuits, Deutsch-Jozsa, Grover (with honest overshoot), Shor & what it means for RSA, 2026 hardware reality, and the post-quantum bridge. Qiskit snippets throughout. Labs: a working single-qubit simulator, Bell-pair correlator, geometric Grover, RSA-countdown calculator. 13 stages. |

Each course is split into 3–4 **tracks** (foundations → applied → advanced) and ends with a
capstone that ties the pieces together. **167 stages across 13 courses, 47 interactive labs.** The acronym-dense
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
js/viz.js               # headline interactive lab for each course (window.COURSE_VIZ)
js/labs.js              # inline mini-labs placed inside the roadmap (window.COURSE_MINILABS)
js/courses/
  assembly.js           # each course registers itself into window.COURSES
  bash.js
  gnu.js
  linux.js
  networking.js
  browser.js
  regex.js
  dicom.js
  pcarch.js             # newer courses are fully self-contained: course content
  git.js                #   + headline lab + mini-labs in one file (the registries
  crypto.js             #   in viz.js / labs.js are merge-safe)
  quantum.js
  iso27001.js (+ iso27001-data.js)
logo.svg
```

Adding a course is just another file in `js/courses/` that pushes onto `window.COURSES`
(same object shape as `assembly.js`) and a matching `<script>` tag in `index.html`.
Its headline lab goes in `js/viz.js` (`COURSE_VIZ[id]`); optional inline mini-labs go in
`js/labs.js` as `COURSE_MINILABS[id] = [{at: stageNumber, title, blurb, mount}]` and are
rendered right after the stage they belong to.

## License

AGPL-3.0 — part of the [carino.systems](https://carino.systems/) workshop.
