/* =====================================================================
   Carino Learn — course: NETPLAN  (declarative Linux networking)
   Goal: take someone who has never touched /etc/netplan and make them
   fluent in describing a whole network — DHCP, statics, Wi-Fi, VLANs,
   bonds, bridges and policy routing — as small YAML files that netplan
   renders into systemd-networkd or NetworkManager configuration. This
   is the Ubuntu/Debian counterpart to the Fedora-flavoured courses on
   this site: the tooling is netplan, networkd, nmcli and the iproute2
   suite, and every stage leans on the try/apply safety workflow so a
   typo never locks you out of a remote box. Practise in a VM.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["netplan"] = {
  id: "netplan",
  title: "Netplan",
  tag: "declarative Linux networking",
  icon: "topology",
  blurb: "Describe your whole network as YAML — DHCP to bonds, bridges and VLANs — the Ubuntu way.",
  intro:
    "Netplan is Ubuntu's answer to 'how should a Linux box describe its network?': you write small YAML " +
    "files in `/etc/netplan` that declare the **end state** — this NIC gets DHCP, that one is static, here " +
    "is a bond with a VLAN and a bridge on top — and netplan renders them into configuration for one of " +
    "two backends, systemd-networkd or NetworkManager. Thirteen stages take you from your first " +
    "`netplan get` to a capstone VM-host with a bonded, VLAN-tagged, bridged uplink, with a heavy " +
    "emphasis on the `netplan try` safety ritual that keeps remote machines reachable. Where this site's " +
    "other courses speak Fedora/RHEL, this one is deliberately the Ubuntu/Debian side of the street — " +
    "everything runs on any Ubuntu Server VM, and a VM is exactly where you should practise, so a bad " +
    "config can never cost you a real connection.",
  meta: [["Scope", "YAML → running network"], ["Tools", "netplan · networkd · NM"], ["Host", "Ubuntu / Debian"]],

  tracks: [
    { id: "model",   label: "The model & first configs",       stages: [0, 1, 2, 3] },
    { id: "daily",   label: "Everyday configs & ops",          stages: [4, 5, 6, 7] },
    { id: "virtual", label: "Virtual devices & advanced ops",  stages: [8, 9, 10, 11, 12] },
  ],

  reference: [
    {
      kind: "table",
      title: "The YAML skeleton at a glance",
      head: ["Key", "Level", "What it holds"],
      rows: [
        ["network:", "top", "the single root — everything lives under it"],
        ["version: 2", "under network", "the netplan schema version (always 2)"],
        ["renderer:", "global or per device", "which backend acts: networkd (servers) or NetworkManager (desktops)"],
        ["ethernets:", "device map", "wired NICs — DHCP, addresses, routes, match/set-name"],
        ["wifis:", "device map", "wireless NICs — everything ethernets has, plus access-points"],
        ["bonds:", "device map", "several NICs fused into one logical link (failover / LACP)"],
        ["bridges:", "device map", "a software switch — the classic br0 for VMs and containers"],
        ["vlans:", "device map", "802.1Q tagged sub-interfaces — id + link on a parent device"],
        ["tunnels: / vrfs:", "device map", "encapsulated links and routing domains (beyond this course)"],
      ],
      foot: "Files live in `/etc/netplan/*.yaml`, merged in lexicographic order — later names override earlier ones, which is why prefixes like 00-, 50- and 99- matter. Canonical docs: `https://netplan.readthedocs.io`",
    },
    {
      kind: "cmds",
      title: "Everyday netplan one-liners",
      rows: [
        ["Apply with an auto-revert safety net", "sudo netplan try"],
        ["Try with a longer countdown", "sudo netplan try --timeout 300"],
        ["Apply for real (local console only)", "sudo netplan apply"],
        ["Compile the YAML, verbosely, without touching the network", "sudo netplan --debug generate"],
        ["Print the merged config netplan sees", "sudo netplan get"],
        ["Read one key from the merged tree", "sudo netplan get ethernets.enp3s0.dhcp4"],
        ["Set a key from the shell", "sudo netplan set ethernets.enp3s0.dhcp4=true"],
        ["Interface / IP / DNS overview (0.106+)", "netplan status --all"],
        ["Quick state of every interface", "ip -br a"],
        ["What networkd thinks of a link", "networkctl status enp3s0"],
      ],
    },
    {
      kind: "table",
      title: "Common keys cheat sheet",
      head: ["Key", "Lives under", "Meaning"],
      rows: [
        ["dhcp4: / dhcp6:", "any device", "true/false — ask a DHCP server for v4/v6 config"],
        ["addresses:", "any device", "static IPs with CIDR, e.g. [192.168.1.50/24]"],
        ["routes: [{to:, via:}]", "any device", "static routes; to: default replaces deprecated gateway4"],
        ["nameservers: {addresses:, search:}", "any device", "DNS servers and search domains"],
        ["match: {name:/macaddress:/driver:}", "ethernets entry", "pick real hardware; the YAML key becomes a mere label"],
        ["set-name:", "ethernets entry (with match)", "rename the matched NIC to a stable name"],
        ["id: + link:", "vlans entry", "802.1Q tag number and the parent interface"],
        ["interfaces:", "bonds / bridges entry", "the member NICs enslaved to the virtual device"],
        ["mode:", "bond parameters", "active-backup, 802.3ad, balance-rr…"],
        ["parameters:", "bonds / bridges entry", "tuning — mii-monitor-interval, lacp-rate, stp, forward-delay"],
      ],
      foot: "Every key sits under `network:` → a device map → a device entry. Two-space indentation is the syntax — stage 1 drills this.",
    },
    {
      kind: "table",
      title: "Acronyms",
      head: ["term", "stands for", "in one line"],
      rows: [
        ["YAML", "YAML Ain't Markup Language", "the indentation-based data format netplan files are written in"],
        ["DHCP", "Dynamic Host Configuration Protocol", "a server hands your NIC an address, routes and DNS automatically"],
        ["DNS", "Domain Name System", "turns names (example.com) into IP addresses"],
        ["NIC", "Network Interface Card", "the hardware (or virtual device) that connects a host to a network"],
        ["MAC", "Media Access Control (address)", "the NIC's burned-in link-layer identity — great for matching"],
        ["VLAN", "Virtual LAN", "802.1Q tags carve one physical wire into isolated networks"],
        ["LACP", "Link Aggregation Control Protocol", "switch and host negotiate a multi-NIC 802.3ad bond"],
        ["STP", "Spanning Tree Protocol", "stops bridged networks looping frames forever"],
        ["NM", "NetworkManager", "the desktop-oriented renderer — roaming Wi-Fi, nmcli, GUI applets"],
        ["SSID", "Service Set Identifier", "a Wi-Fi network's name"],
        ["AP", "Access Point", "bridges Wi-Fi radio onto the wired network"],
        ["WPA", "Wi-Fi Protected Access", "the Wi-Fi encryption family (WPA2-PSK is the common home case)"],
        ["CIDR", "Classless Inter-Domain Routing", "the /24-style prefix on every address you'll write"],
      ],
      foot: "Every acronym is spelled out on first use within each stage, then abbreviated. The canonical reference for everything here is `https://netplan.readthedocs.io`.",
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "What netplan is & where it lives",
      tag: "YAML in, network out",
      time: "1–2 hrs",
      payoff:
        "Most network configuration tutorials teach you *steps* — run this command, then that one, and hope " +
        "the box remembers after a reboot. Netplan flips the model: you describe the network you *want* in a " +
        "small YAML (YAML Ain't Markup Language) file, and the system makes it so, every boot, identically. Once you can find the files, " +
        "predict how they merge, and read the current state with `netplan get` and `netplan status`, every " +
        "later stage is just learning more vocabulary for the same one-page document.",
      concepts: [
        "declarative: describe the end state",
        "who uses it: Ubuntu, Debian (opt-in)",
        "/etc/netplan/*.yaml discovery",
        "merge order: 00- before 99-",
        "/run overrides /etc overrides /lib",
        "root-owned, mode 0600",
        "pipeline: YAML → generate → backend → kernel",
        "netplan get / status",
      ],
      code:
`# Practise in a VM so mistakes can't strand a real machine:
multipass launch --name netlab lts    # or LXD, or any Ubuntu Server VM
multipass shell netlab

# Where do netplan files live, and what's already there?
ls -l /etc/netplan/                   # e.g. 50-cloud-init.yaml on cloud images,
                                      #      00-installer-config.yaml from the installer
sudo cat /etc/netplan/*.yaml          # the YAML itself — short, isn't it?

# Netplan reads THREE directories, highest priority first:
#   /run/netplan   (runtime overrides, e.g. written by tools)
#   /etc/netplan   (yours — this is where you work)
#   /lib/netplan   (vendor defaults)
# Within a directory, files merge in filename order: 00- first, 99- last,
# and later files override earlier ones key-by-key. Hence the prefixes.

# Files must be root-owned and private, or netplan complains:
sudo chmod 600 /etc/netplan/*.yaml
sudo chown root:root /etc/netplan/*.yaml

# Read the MERGED configuration netplan actually sees:
sudo netplan get                      # the whole tree, all files combined
sudo netplan get ethernets            # just one branch of it

# A live dashboard: interfaces, addresses, routes, DNS (netplan 0.106+):
netplan status --all

# The pipeline made visible — compile YAML to backend config, no activation:
sudo netplan generate
ls /run/systemd/network/              # 10-netplan-*.network — the rendered output`,
      lang: "bash",
      walkthrough: [
        "**Declarative beats imperative for networks.** The old way was imperative: a script of `ip addr add` and `ip route add` commands that mutate the system step by step, and if one step fails or the box reboots, you're in an unknown state. Netplan is **declarative** — the YAML file says 'this interface has this address and this route', full stop. Netplan's job is to make reality match the file, and the file *is* the documentation of your network. Delete the file, and the config it described goes with it.",
        "**Who uses netplan.** It has shipped as the default on **Ubuntu** since 18.04 — Server and Desktop alike — and is available on **Debian** as an opt-in package. This course is deliberately the Ubuntu/Debian counterpart to this site's Fedora-flavoured material: Fedora and RHEL configure networking through NetworkManager (NM) directly, while Ubuntu puts netplan's YAML in front of the backend. The concepts (DHCP — Dynamic Host Configuration Protocol, addresses, routes) are identical; only the file format differs.",
        "**One directory, many small files.** Netplan reads every `*.yaml` file in `/etc/netplan/` and **merges** them in **lexicographic filename order** — `00-installer-config.yaml` is read before `50-cloud-init.yaml`, which is read before `99-my-overrides.yaml`, and where two files set the same key, the *later* file wins. That's the whole point of those numeric prefixes: they're a priority system spelled out in filenames. Keep your own changes in their own file with a high number and you never have to fight the installer's.",
        "**Three directories, one hierarchy.** `/etc/netplan` is yours, but two more exist: `/lib/netplan` holds vendor defaults, and `/run/netplan` holds runtime files that tools can drop in. Priority runs `/run` over `/etc` over `/lib` — and within the merged view, a file in a higher-priority directory *shadows* a same-named file below it entirely. Ninety-nine per cent of the time you only touch `/etc/netplan`, but knowing the other two exist saves you an afternoon when a config appears from nowhere.",
        "**Permissions matter.** Netplan files can contain Wi-Fi passwords (stage 7), so since version 0.106.1 netplan warns loudly unless each file is **owned by root with mode 0600** — readable and writable by root only. Get in the habit now: every file you create gets a `sudo chmod 600` before anything else. It's one line and it silences a warning you'd otherwise see on every command.",
        "**`netplan get` shows the merged truth.** Rather than mentally merging three directories and five files yourself, ask netplan: **`sudo netplan get`** prints the single combined tree it will act on, and **`sudo netplan get ethernets.enp3s0.dhcp4`** walks down to one key using dot-separated paths. When files fight in merge order (a classic stage 12 failure), `get` is how you see who won.",
        "**`netplan status` shows the running reality.** Where `get` shows what's *configured*, **`netplan status --all`** (netplan 0.106+, so Ubuntu 23.04 onward — on older releases use `ip -br a` instead) shows what's *live*: each interface, its addresses, routes, DNS (Domain Name System) servers, and crucially which **renderer** manages it. Configured versus running is the fundamental diagnostic split, and these two commands are its two halves.",
        "**The pipeline in one sentence.** Your YAML never touches the kernel directly. The flow is: **YAML → `netplan generate` → backend config files → backend daemon → kernel**. `generate` compiles `/etc/netplan/*.yaml` into native configuration for a **renderer** — systemd-networkd or NetworkManager (stage 2 is entirely about choosing between them) — and the rendered output lands in `/run/systemd/network/10-netplan-*.network` or `/run/NetworkManager/system-connections/netplan-*`. The backend then programs the kernel. Never edit those `/run` files: they are compiler output, rebuilt from your YAML on every apply.",
        "**Why a VM, and why now.** Networking config is the one kind of config where a mistake can cut off your ability to fix the mistake — apply a bad file over SSH (Secure Shell) and the session that would fix it dies with the network. So this whole course runs inside a **VM (virtual machine)**: `multipass launch` gives you a disposable Ubuntu Server in a minute, LXD containers work too, and you always have the virtual console as a back door. On real remote machines the rule is absolute: **always `netplan try`, never bare `netplan apply`** — stage 5 covers the full ritual.",
      ],
      exercise:
        "Take the guided tour of a fresh box. Launch an Ubuntu VM (`multipass launch --name netlab lts` or your " +
        "preferred tool) and shell in. List `/etc/netplan/` and read every file that's there — identify who wrote " +
        "it (installer? cloud-init?) from its name and header comment. Fix permissions with `chmod 600` if netplan " +
        "would warn. Run `sudo netplan get` and confirm it matches the file contents, then `netplan status --all` " +
        "and confirm the *running* state matches too. Finally run `sudo netplan generate` and find the rendered " +
        "output under `/run/systemd/network/` — open one `.network` file and see your YAML translated into the " +
        "backend's dialect. In two sentences, describe the journey one `dhcp4: true` takes from YAML to kernel.",
      drills: [
        "Run `ls -l /etc/netplan/` and state, from the filenames alone, the exact order the files merge in.",
        "Run `sudo netplan get` and then `sudo netplan get ethernets` — confirm the second is a subtree of the first.",
        "Run `stat -c '%U %a %n' /etc/netplan/*.yaml` and verify every file is root-owned with mode 600.",
        "Run `sudo netplan generate && ls /run/systemd/network/` and count how many files one YAML produced.",
        "Run `netplan status --all` (or `ip -br a` on pre-23.04) and note which renderer manages each interface.",
      ],
      note:
        "On Ubuntu cloud images the file you'll find is `/etc/netplan/50-cloud-init.yaml`, and it is **owned by " +
        "cloud-init**, which regenerates it — edits there quietly vanish on the next boot. Either add your own " +
        "higher-numbered file alongside it, or disable cloud-init's networking with a one-line file; stage 12 " +
        "covers that interplay in full. For now: never edit `50-cloud-init.yaml` directly.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "Just enough YAML",
      tag: "indentation is the syntax",
      time: "1–2 hrs",
      payoff:
        "Every netplan problem that isn't a networking problem is a YAML problem, and YAML has exactly one " +
        "hard rule: structure *is* indentation. Learn mappings, lists and scalars, why a tab character is " +
        "instant death, and how one wrong indent silently hangs a key off the wrong device, and you'll read " +
        "and write netplan files as fluently as prose. Best of all, `netplan generate` is a free linter that " +
        "tells you the file and line of every mistake before anything touches the network.",
      concepts: [
        "mappings: key: value",
        "lists: - item or [a, b]",
        "scalars: strings, numbers, booleans",
        "2-space indent, NO TABS ever",
        "quoting: when \"no\" means false",
        "# comments",
        "the netplan skeleton",
        "netplan generate as a linter",
      ],
      code:
`# The netplan skeleton — every file in this course is this shape.
network:                       # a MAPPING: 'network' is a key, its value is nested below
  version: 2                   # a scalar value — the number 2
  renderer: networkd           # another scalar — a string (no quotes needed here)
  ethernets:                   # a nested mapping: the wired-device section
    enp3s0:                    # one device entry — this key names the interface
      dhcp4: true              # a boolean scalar: true/false (yes/on also parse as true!)
      addresses:               # a LIST written in block form:
        - 192.168.1.50/24      #   each item starts with '- ' at the same indent
        - 192.168.1.51/24
      nameservers:
        addresses: [1.1.1.1, 9.9.9.9]   # the SAME list idea in flow form: [a, b]
        search: [home.arpa]
    enp4s0:                    # a second device — a SIBLING of enp3s0,
      dhcp4: true              # so it sits at the same indent as enp3s0

# Indentation IS the structure. Two spaces per level, always.
# This says 'enp4s0 is a setting inside enp3s0' — almost certainly a bug:
#   ethernets:
#     enp3s0:
#       dhcp4: true
#         enp4s0:              <- indented one level too deep: now a child of enp3s0
#           dhcp4: true

# A TAB character anywhere = hard parse error. If your editor inserts tabs, fix
# the editor. (In vim: ':set expandtab'. nano: 'nano -ET2 file.yaml'.)

# Quoting: YAML 1.1 treats bare no, yes, on, off, true and false as booleans.
# Netplan reads its string fields (SSIDs, passwords) literally, so it copes -
# but quote them anyway: other YAML tooling may not be so literal:
#   access-points:
#     "no":                    # quoted — the network is literally named 'no'
#       password: "0n3-tw0"    # quote passwords always; leading 0 could surprise you

# Your linter, free of charge — parses every file, reports file + line:
#   sudo netplan generate
#   sudo netplan --debug generate    # same, plus a trace of what it parsed`,
      lang: "yaml",
      walkthrough: [
        "**YAML (YAML Ain't Markup Language) has three shapes, and netplan uses all three.** A **mapping** is `key: value` pairs — note the colon is followed by a space, always. A **list** is items introduced by `- ` (dash space), or the compact flow form `[a, b, c]` on one line. A **scalar** is a single value: a string (`networkd`), a number (`2`), or a boolean (`true`/`false`). Every netplan file is mappings containing mappings containing the occasional list — nothing more exotic than that.",
        "**Nesting is done purely by indentation.** A key indented two spaces further than the line above is *inside* it. There are no braces and no `end` keywords: the whitespace on the left margin is the entire structure. The netplan convention is **two spaces per level**, and consistency matters more than the number — but stick to two, because every example in the docs and this course does.",
        "**Tabs are forbidden. Not discouraged — forbidden.** The YAML specification does not allow tab characters in indentation, and one invisible tab produces a parse error that looks baffling because the file *looks* fine. Configure your editor before you write a single file: in vim, `:set expandtab shiftwidth=2`; in nano, launch with `nano -ET2`. If `netplan generate` complains about a line that looks perfect, run `cat -A file.yaml` and look for `^I` — that's a tab exposing itself.",
        "**The skeleton is always the same.** `network:` at the root, `version: 2` under it, an optional `renderer:`, then one or more *device maps* — `ethernets:`, `wifis:`, `bonds:`, `bridges:`, `vlans:` — each containing named device entries, each entry containing that device's settings. Memorise the skeleton and you can navigate any netplan file on sight; the rest of the course just fills in vocabulary at the device-settings level.",
        "**The classic silent bug: one indent too deep.** Because indentation is structure, a key indented one level too far doesn't error — it just becomes a child of the wrong parent. Indent a second NIC (Network Interface Card) entry under the first, and YAML happily parses it as an unknown *setting* of the first device instead of a sibling device. Netplan may then reject the unknown key — that's the good outcome — or, with some keys, silently accept a structure you didn't mean. When a device 'isn't picking up its config', check its left margin before anything else: siblings sit at *identical* indentation.",
        "**Quoting saves you from YAML's helpful streak.** Under the YAML 1.1 rules netplan inherits, the bare words `yes`, `no`, `on`, `off`, `true` and `false` parse as **booleans**. That is exactly how netplan's *boolean* keys work — `dhcp4: yes` means true — but its *string* fields (SSIDs, passwords) take the scalar's raw text, so a Wi-Fi network literally named 'no' still arrives as the two-letter word and `netplan generate` stays quiet. Quote defensively anyway: any *other* YAML tool that parses the same file will see a boolean, not a name. The rule of thumb: **quote every SSID (Service Set Identifier) and every password**, quote any string that could look like a number or boolean, and never quote actual booleans or numbers. Addresses like `192.168.1.50/24` are safely strings without quotes.",
        "**Comments are `#` to end of line.** Use them generously — a netplan file is documentation as much as configuration, and 'why' comments (`# uplink to the lab switch, VLAN 40 trunk`) are what save the next admin, who is usually you in six months. Everything after `#` is ignored, so you can annotate inline as the code block above does.",
        "**`netplan generate` is your free linter.** It parses every file and compiles it to backend config *without activating anything* — so it is always safe to run, even on a production box. Errors come back with the **file and line number**: `Invalid YAML: /etc/netplan/99-lab.yaml line 6 column 9`. Add `--debug` (note it goes *before* the subcommand: `netplan --debug generate`) and you also get a trace of every file parsed and every device emitted. The habit to build from today: **edit, then generate, then try** — never straight from editor to apply. Stage 5 turns this into a full ritual.",
      ],
      exercise:
        "Break a file five ways and let the linter catch you. In your VM, copy your existing config to " +
        "`/etc/netplan/99-lab.yaml` (`chmod 600` it), confirm `sudo netplan generate` passes clean, then " +
        "introduce one deliberate error at a time, re-running generate after each: (1) replace a leading " +
        "double-space with a tab; (2) delete the space after a colon; (3) indent a device entry one extra " +
        "level; (4) change `version: 2` to `version: 3`; (5) add a made-up key like `dhcp5: true`. For each, " +
        "write down the exact error message — or note, tellingly, if there wasn't one. Restore the file and " +
        "finish with a clean generate. You have now met most of the errors you'll ever see, on your own terms.",
      drills: [
        "Run `cat -A /etc/netplan/*.yaml | grep -n \"\\^I\"` and confirm there are no tabs hiding in your files.",
        "Rewrite `addresses: [10.0.0.5/24, 10.0.0.6/24]` in block form with `- ` items, and confirm `netplan generate` accepts both spellings.",
        "Write a `nameservers:` block containing `addresses:` and `search:` lists from memory, then check it against `netplan get`.",
        "Run `sudo netplan --debug generate` and find the line where it reports parsing your file.",
        "Create a file whose only content is `network:` with a tab-indented `version: 2` and read the exact parse error before deleting it.",
      ],
      note:
        "YAML has depths this course deliberately ignores — anchors, multi-line block scalars, explicit type " +
        "tags — because netplan needs none of them. If you find yourself reaching for clever YAML, the config " +
        "is probably wrong-shaped. Small, flat, boring files with generous comments are the professional style " +
        "here, and the numeric filename prefixes from stage 0 are how you compose them.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "The two renderers",
      tag: "networkd vs NetworkManager",
      time: "half a day",
      payoff:
        "Netplan doesn't configure your network — it delegates to one of two backends, and knowing which one " +
        "is in charge changes where the files land, which logs to read, and which commands tell the truth. " +
        "Servers run systemd-networkd; desktops run NetworkManager; and one YAML line — `renderer:` — chooses " +
        "between them, globally or per device. Master this split now and every 'why is my config ignored?' " +
        "mystery in stage 12 gets one of its two most common answers.",
      concepts: [
        "renderer = the backend that acts",
        "systemd-networkd: server, headless",
        "NetworkManager: desktop, roaming, nmcli",
        "renderer: global vs per-device",
        "rendered files in /run — never edit",
        "networkctl vs nmcli device",
        "NM writes back: 90-NM-*.yaml",
      ],
      code:
`# Which renderer does my YAML declare? (may be absent = networkd default)
sudo netplan get | grep -A1 renderer

# Which backends are actually running right now?
systemctl status systemd-networkd --no-pager   # server default: active on Ubuntu Server
systemctl status NetworkManager --no-pager     # desktop default: active on Ubuntu Desktop

# Ask each backend which devices it manages:
networkctl                    # networkd's view: 'configured' = it owns the link
nmcli device                  # NM's view: 'unmanaged' = it is leaving it alone
# A healthy box shows each NIC managed by exactly ONE of the two.

# What generate emits depends on the renderer:
sudo netplan generate
ls /run/systemd/network/                       # networkd: 10-netplan-enp3s0.network ...
sudo ls /run/NetworkManager/system-connections/  # NM: netplan-enp3s0.nmconnection ...
# Both trees are COMPILER OUTPUT. Never edit them — apply regenerates them.

# Per-device renderer: one box, both backends, each doing what it's best at.
# /etc/netplan/99-lab.yaml:
#   network:
#     version: 2
#     renderer: networkd        # global default: networkd handles the wire...
#     ethernets:
#       enp3s0:
#         dhcp4: true
#     wifis:
#       wlp2s0:
#         renderer: NetworkManager   # ...but NM owns the roaming Wi-Fi card
#         dhcp4: true
#         access-points:
#           "HomeNet":
#             password: "correct-horse"

# Ubuntu Desktop 23.10+: nmcli edits write BACK into netplan files:
ls /etc/netplan/                               # look for 90-NM-<uuid>.yaml`,
      lang: "bash",
      walkthrough: [
        "**A renderer is the thing that does the work.** Netplan itself is a translator: it turns your YAML into configuration for a backend daemon, and *that* daemon programs the kernel, runs the DHCP (Dynamic Host Configuration Protocol) client, and watches the links. Netplan supports two: **systemd-networkd** and **NetworkManager (NM)**. The `renderer:` key picks one — and if you never write it, the default is networkd.",
        "**systemd-networkd is the server's choice.** Part of the systemd suite, it is small, fast, entirely non-interactive and driven purely by config files — perfect for a headless machine whose network is decided once and never touched by a human at a GUI. **Ubuntu Server uses networkd by default**, and everything in this course's server-side stages (bonds, bridges, VLANs — Virtual LANs — in stages 8-10) assumes it. Its command-line window is **`networkctl`**: bare for a device list, `networkctl status enp3s0` for one link's addresses, DNS and recent events.",
        "**NetworkManager is the desktop's choice.** NM is built for machines whose networks *change*: laptops that roam between Wi-Fi networks, VPNs (Virtual Private Networks) toggled from a menu, captive portals in cafés. It has a GUI applet, a rich CLI in **`nmcli`**, and it stores connection *profiles* rather than static config. **Ubuntu Desktop uses NM by default**, and stage 7's advice for laptop Wi-Fi is: let NM own it. Its device view is **`nmcli device`** — and note that on a Desktop box, NM deliberately reports itself as managing everything netplan hands it.",
        "**One key, two scopes.** Written directly under `network:`, `renderer:` sets the **global** default for every device in the file. Written inside a single device entry, it overrides the global for that device alone. The mixed pattern in the code block is genuinely useful on a lab laptop with a docking station: networkd drives the boring wired NIC (Network Interface Card), NM drives the Wi-Fi radio it's better at. One box, two backends, no conflict — as long as each device has exactly one owner.",
        "**Where the compiled output lands tells you who's in charge.** After `netplan generate`, networkd-rendered devices become files like `/run/systemd/network/10-netplan-enp3s0.network` (plus `.netdev` files for virtual devices in stages 8-10), while NM-rendered devices become keyfiles under `/run/NetworkManager/system-connections/netplan-*`. Two things to internalise: the prefix `netplan-` marks NM profiles that netplan generated, and everything under `/run` is **ephemeral compiler output** — it vanishes on reboot and is regenerated on every apply, so editing it is writing on water. The source of truth is only ever `/etc/netplan`.",
        "**Checking who actually manages a link.** Three commands triangulate it. `systemctl status systemd-networkd` and `systemctl status NetworkManager` show which daemons are even running. `networkctl` marks links it owns as `configured` (or `unmanaged` for ones it's leaving alone); `nmcli device` shows the mirror image, listing `unmanaged` for links NM has been told are networkd's. If *both* claim a device, or *neither* does, you've found your bug — the classic symptom is an interface that comes up with no address at all.",
        "**NM can write netplan, too.** Since Ubuntu 23.10, Desktop's NM ships with netplan integration: when you join a Wi-Fi network from the GUI or run `nmcli connection add`, NM persists the profile *by writing a netplan file* — `/etc/netplan/90-NM-<uuid>.yaml` — so `netplan get` shows one merged truth however the config arrived. Don't be surprised to find those files on a Desktop box; they're legitimate, and the 90- prefix slots them into stage 0's merge order after installer files but before your 99- overrides.",
        "**Which should *you* use?** The boring answer is the right one: keep each platform's default. Servers and VMs (virtual machines — your lab for this course): networkd. Desktops and laptops: NM. Change renderers only with a reason you can say out loud — 'this headless box needs Wi-Fi roaming' or 'this desktop hosts VMs on a bridge and networkd is simpler for that'. Every following stage states its assumed renderer when it matters, and stage 7 revisits the choice specifically for Wi-Fi.",
      ],
      exercise:
        "Audit a box of each flavour if you can — your Ubuntu Server VM at minimum, a Desktop install if you " +
        "have one. On each: record which of the two daemons is active (`systemctl status` both), what " +
        "`netplan get` declares as renderer (including 'absent, so networkd'), and how `networkctl` and " +
        "`nmcli device` each classify every interface. Then run `sudo netplan generate` and list both `/run` " +
        "output directories, mapping each rendered file back to the YAML device that produced it. Finish with " +
        "a two-column summary — device → owning renderer — and one sentence on why that ownership is right " +
        "(or wrong) for that machine's job.",
      drills: [
        "Run `sudo netplan get | grep renderer` and state the effective renderer for each device, including defaults.",
        "Run `networkctl list` and `nmcli device` back to back and confirm no interface is claimed by both backends.",
        "Run `sudo netplan generate && ls /run/systemd/network/` and match each output file to a device in your YAML.",
        "Run `networkctl status enp3s0` (your NIC's name) and find its address, gateway and DNS in the output.",
        "On an Ubuntu Desktop box (or in reading if you lack one), locate a `90-NM-*.yaml` file and identify which nmcli or GUI action created it.",
      ],
      note:
        "There is a third pseudo-state worth knowing: a device managed by *neither* backend, which you'll " +
        "sometimes want deliberately — for instance a NIC handed raw to a VM. But when it's an accident, " +
        "'link is up, no address, both tools say unmanaged' is the tell. Also note the spelling in YAML is " +
        "exactly `NetworkManager` and `networkd` — case matters, and `netplan generate` will refuse anything else.",
    },

    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "DHCP done right",
      tag: "addresses that find you",
      time: "half a day",
      payoff:
        "One line — `dhcp4: true` — gets a machine online, which is why it's the whole config on most fresh " +
        "installs. But the lease brings more than an address: a default route, DNS servers, sometimes a " +
        "hostname, and netplan lets you accept or veto each piece with `dhcp4-overrides`. Learn what the " +
        "lease carries, how to lease by MAC like the old tools did, and how metrics break the tie when two " +
        "NICs both have DHCP, and 'it got an address from somewhere' becomes 'I know exactly what it got and why'.",
      concepts: [
        "dhcp4: true / dhcp6: true",
        "the lease: address + route + DNS",
        "dhcp4-overrides: use-dns, use-routes",
        "route-metric: tie-breaking two NICs",
        "dhcp-identifier: mac",
        "watching the lease: networkctl status",
        "journalctl -u systemd-networkd",
      ],
      code:
`# The one-liner that runs most of the world's Ubuntu boxes.
# /etc/netplan/99-lab.yaml  (root-owned, chmod 600 — stage 0):
cat <<'EOF' | sudo tee /etc/netplan/99-lab.yaml >/dev/null
network:
  version: 2
  ethernets:
    enp3s0:
      dhcp4: true              # ask for IPv4 config: address, route, DNS
      dhcp6: false             # be explicit about v6 rather than silent
      dhcp-identifier: mac     # lease by MAC address, like ifupdown did —
                               # keeps your router's DHCP reservation working
    enp4s0:                    # second NIC, also DHCP — but tamed:
      dhcp4: true
      dhcp4-overrides:
        use-dns: false         # take the address, IGNORE the lease's DNS
        use-routes: true       # do accept its routes...
        route-metric: 200      # ...but at metric 200, so enp3s0 (default
                               # metric 100) wins the default-route race
EOF
sudo chmod 600 /etc/netplan/99-lab.yaml

# Lint, then apply with the safety net (stage 5 explains the ritual):
sudo netplan generate
sudo netplan try                 # ENTER to confirm; auto-reverts if you vanish

# Did the lease arrive, and what did it bring?
ip -br a                         # the address, at a glance
ip route                         # look for: default via ... metric 100 / 200
networkctl status enp3s0         # networkd's view: Address, Gateway, DNS, lease
resolvectl status enp3s0         # exactly which DNS servers this link uses

# Watch a lease renew, live:
sudo journalctl -u systemd-networkd -f     # DHCPv4 address, lease expires, renews
sudo networkctl renew enp3s0               # force a renewal and watch the log`,
      lang: "bash",
      walkthrough: [
        "**DHCP is a conversation, and the lease is its outcome.** DHCP (Dynamic Host Configuration Protocol) is a broadcast negotiation between your NIC (Network Interface Card) and a server — usually your router — that ends in a **lease**: a temporary grant of an IP address plus a bundle of options. The bundle typically includes the **default route** (via the router), **DNS (Domain Name System) servers**, a search domain, and a lease *time* after which the client must renew. `dhcp4: true` accepts the whole bundle; this stage is about accepting it *selectively*.",
        "**`dhcp4` and `dhcp6` are independent booleans.** They default to false, so a device with neither is expected to get static addresses (stage 4) or none at all. Writing `dhcp6: false` explicitly, as the code block does, costs one line and documents intent — six months on, nobody wonders whether v6 was forgotten or declined. (IPv6 has a second, separate auto-configuration mechanism — router advertisements — which stage 4 covers alongside `accept-ra`.)",
        "**`dhcp4-overrides` vetoes pieces of the lease.** Sometimes you want the address but not the baggage. **`use-dns: false`** takes the lease but ignores its DNS servers — essential when you run your own resolver and the ISP's (Internet Service Provider's) router keeps pushing its own. **`use-routes: false`** ignores the lease's routes entirely — the pattern for a storage or management NIC that must never become a path to the internet. **`use-domains`** controls the search domain, and **`use-hostname: false`** stops the lease renaming your machine. Each override is per-device, so two NICs can treat their leases completely differently.",
        "**Two DHCP NICs means two default routes — metrics break the tie.** Each lease offers a default route, and the kernel picks the one with the **lowest metric** (think: cost). Netplan's generated networkd config sets DHCP routes to metric 100 by default (raw networkd would use 1024), so two DHCP NICs tie and the winner is effectively arbitrary. **`route-metric: 200`** on the second NIC makes the preference explicit: `enp3s0` at 100 carries the internet traffic, `enp4s0` at 200 is standby. Check your work in `ip route` — both `default via ...` lines are present, and the metric numbers tell you which one wins. Stage 11 builds on exactly this for real multi-uplink routing.",
        "**`dhcp-identifier: mac` keeps old reservations working.** DHCP servers recognise returning clients by an identifier, and networkd's default is an RFC-4361-style client ID rather than the bare MAC (Media Access Control) address that the old ifupdown tooling sent. Consequence: migrate a box to netplan and your router's carefully configured 'always give this MAC 192.168.1.80' reservation stops matching — the box looks like a stranger and gets a fresh address. **`dhcp-identifier: mac`** restores the old behaviour. If a migrated machine 'lost its reserved IP', this is the fix — a gotcha stage 12's migration walkthrough calls out again.",
        "**Reading what actually arrived.** `ip -br a` confirms the address; `ip route` shows the lease's routes with their metrics; **`networkctl status enp3s0`** is the richest single view — address, gateway, DNS, and the lease's server — and **`resolvectl status`** shows per-link DNS, which is where a `use-dns: false` proves itself (the link should list no servers from that lease). Configured (`netplan get`) versus running (these commands) — the same split stage 0 introduced, now with DHCP specifics.",
        "**Watching the lease live.** Leases are time-limited and renew in the background, and when DHCP misbehaves the story is in the journal: **`journalctl -u systemd-networkd -f`** follows networkd's log, where you'll see lines for the address grant, the lease length, and each renewal. **`networkctl renew enp3s0`** forces a renewal on demand — run it in one terminal with the journal following in another and you'll watch the whole exchange in real time. On an NM (NetworkManager)-rendered device, the equivalents are `journalctl -u NetworkManager -f` and `nmcli device reapply`.",
        "**The safety ritual, previewed.** Notice the code block never runs bare `netplan apply`: it lints with `generate`, then activates with **`netplan try`**, which auto-reverts unless you confirm within its countdown. In a VM this is good practice; over SSH (Secure Shell) to a real machine it is the difference between a bad DHCP change being a 120-second hiccup and a drive to the machine. Stage 5 is devoted to this workflow — from here on, every stage assumes it.",
      ],
      exercise:
        "Dissect your VM's lease, then tame it. Start from plain `dhcp4: true` and record everything the lease " +
        "delivers: address (`ip -br a`), routes and metrics (`ip route`), DNS (`resolvectl status`), lease " +
        "details (`networkctl status`). Now add `dhcp4-overrides` with `use-dns: false`, run `netplan generate` " +
        "then `netplan try`, and prove with `resolvectl status` that the lease's DNS is gone while the address " +
        "remains. If your VM tool allows a second NIC, put both on DHCP with metrics 100 and 200 and confirm " +
        "with `ip route` which default route wins. Finish by forcing a renewal with `networkctl renew` while " +
        "following `journalctl -u systemd-networkd -f`, and write down the lease time your DHCP server grants.",
      drills: [
        "Run `networkctl status enp3s0` and pick out the address, gateway, DNS server and the DHCP server that granted the lease.",
        "Set `dhcp4-overrides: {route-metric: 300}` on your NIC, `netplan try` it, and confirm the new metric in `ip route`.",
        "Run `resolvectl status` before and after setting `use-dns: false` and diff the per-link DNS section.",
        "Add `dhcp-identifier: mac`, re-apply, and check in your router's DHCP client list whether the box's identity changed.",
        "Run `sudo journalctl -u systemd-networkd | grep -i dhcp | tail -20` and reconstruct the timeline of your current lease.",
      ],
      note:
        "DHCP hands you whatever the *server* is configured to give, and half of all 'netplan is broken' reports " +
        "are really 'the router's DHCP is odd' — wrong DNS pushed, tiny lease times, reservations that don't " +
        "match. When a lease looks wrong, read the journal first: it records exactly what was offered, which " +
        "separates a netplan problem from a server problem in one look. And remember `dhcp4: true` with no " +
        "reachable DHCP server means an interface that sits addressless, patiently retrying forever.",
    },
    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "Static addressing & DNS",
      tag: "addresses you choose",
      time: "1 day",
      payoff:
        "DHCP (Dynamic Host Configuration Protocol) from stage 3 is perfect for laptops, but a server that " +
        "other machines depend on needs an address that never moves. This stage teaches the full static " +
        "recipe: an address in CIDR (Classless Inter-Domain Routing) notation, the modern default route, " +
        "DNS (Domain Name System) servers and search domains, and IPv6 alongside IPv4. It also covers the " +
        "very common real-world mix — one NIC (Network Interface Card) static, another on DHCP — and how to " +
        "prove the result with `ip` and `resolvectl` rather than hoping.",
      concepts: [
        "addresses: with a /prefix — always",
        "routes: to: default via: (modern gateway)",
        "gateway4 is deprecated",
        "nameservers: addresses + search",
        "IPv6 statics & accept-ra",
        "static + DHCP on one box",
        "verify: ip -br a · ip route · resolvectl",
      ],
      code:
`# /etc/netplan/50-static.yaml — a server that owns its addresses.
# Root-owned, chmod 600, and applied with 'sudo netplan try' (stage 5).
network:
  version: 2
  renderer: networkd            # Ubuntu Server's default backend (stage 2)
  ethernets:

    enp3s0:                     # the wired NIC facing the main LAN
      dhcp4: false              # no lease — we choose the address ourselves
      addresses:
        - 192.168.1.50/24       # the /prefix is mandatory: address AND subnet size
        - 2001:db8:1::50/64     # an IPv6 static on the same NIC (doc prefix)
      routes:
        - to: default           # the modern way to say 'default gateway'
          via: 192.168.1.1      # (gateway4: is deprecated — old guides still show it)
      nameservers:
        addresses: [192.168.1.1, 9.9.9.9]   # who answers our DNS queries
        search: [home.lan]      # bare names like 'nas' become nas.home.lan
      accept-ra: false          # ignore IPv6 Router Advertisements — fully manual v6

    enp4s0:                     # second NIC: a lab segment that still uses DHCP
      dhcp4: true
      dhcp4-overrides:
        use-dns: false          # the lab lease must not overwrite our DNS (stage 3)
        route-metric: 200       # and its routes must lose against enp3s0's

# Verify after applying:  ip -br a   ·  ip route  ·  resolvectl status`,
      lang: "yaml",
      walkthrough: [
        "**Static means the address is yours to lose.** With `dhcp4: false` and an `addresses:` list, nothing is negotiated: the machine simply *is* `192.168.1.50`. That is what you want for anything other machines point at — a file server, a DNS target, a box behind a port-forward. The price is responsibility: pick an address outside your router's DHCP pool, or one day the router will lease the same address to a phone and both machines will fight over it.",
        "**The /prefix is not decoration — netplan refuses an address without one.** `192.168.1.50/24` says the first 24 bits are the network, so this host believes everything in `192.168.1.0`–`192.168.1.255` is a neighbour it can reach directly. Write `/32` by mistake and the box thinks it is alone in the world; write `/16` and it will try to reach `192.168.200.x` without the gateway and fail. Half of all 'static address does not work' problems are a wrong prefix.",
        "**The modern default route is a `routes:` entry.** `to: default` with `via: 192.168.1.1` installs the route that catches everything not on a local subnet. You will find `gateway4:` and `gateway6:` in countless older tutorials — they still parse, but netplan deprecated them and warns; teach your fingers the `routes:` form now. Stage 11 builds on this exact block for multi-uplink and policy routing.",
        "**`nameservers:` sets who resolves names and how bare names complete.** `addresses:` lists the DNS servers to query; `search:` lists suffixes tried for short names, so `ssh nas` really attempts `nas.home.lan`. On Ubuntu these values flow into systemd-resolved, which is why `/etc/resolv.conf` shows only the stub `127.0.0.53` — the *real* per-interface servers are shown by `resolvectl status`, your go-to check.",
        "**IPv6 statics ride in the same `addresses:` list.** A v6 address just needs its own prefix length, typically `/64`. The twist is RA (Router Advertisement): routers broadcast v6 configuration, and by default the host will happily auto-configure an extra address from it. `accept-ra: false` switches that off so the interface holds exactly the v6 identity you wrote — the norm for servers. Leave RA on for clients that should follow the router's lead.",
        "**One box, two personalities is completely normal.** Here `enp3s0` is static towards the LAN while `enp4s0` takes a DHCP lease on a lab segment. The two overrides make them coexist politely: `use-dns: false` stops the lab lease replacing your chosen resolvers, and `route-metric: 200` makes any route the lease brings *more expensive* than the static NIC's, so ordinary traffic keeps leaving via `enp3s0` — the same metric tie-breaking you met in stage 3.",
        "**Verification is three commands, in order.** `ip -br a` — does the interface hold exactly the addresses you wrote? `ip route` — is there one `default via 192.168.1.1 dev enp3s0` line, with the lab route carrying `metric 200`? `resolvectl status` — do the right DNS servers appear under the right interface? Then prove reachability outwards: `ping -c2 192.168.1.1` (gateway), `ping -c2 9.9.9.9` (routing), `ping -c2 example.com` (DNS).",
        "**Practise where mistakes are free.** A wrong static config on a remote machine is the classic way to lock yourself out, because unlike DHCP nothing will 'come back' on its own. Do this stage in a VM (Virtual Machine) — `multipass launch` gives you a disposable Ubuntu Server in seconds — and when you graduate to real remote boxes, make the change only through `sudo netplan try`, never a bare `apply`; stage 5 turns that into a ritual.",
      ],
      exercise:
        "In your practice VM, convert the main interface from DHCP to static. First record what the lease gave " +
        "you (`ip -br a`, `ip route`, `resolvectl status`), then write a `50-static.yaml` that pins the same " +
        "address, prefix, default route and DNS servers explicitly, and roll it out with `sudo netplan try`. " +
        "Verify all three read-back commands match your YAML, then prove DNS and routing with pings to the " +
        "gateway, to `9.9.9.9`, and to a hostname. Finally break it on purpose: change the prefix to `/32`, " +
        "run `netplan try` again, watch the gateway ping fail, and let the countdown revert you to safety. " +
        "Explain in one sentence why `/32` killed it.",
      drills: [
        "Run `ip -br a` and confirm your interface shows exactly the addresses in your YAML, each with its prefix.",
        "Run `ip route` and identify the `default via` line — which device and which metric does it carry?",
        "Run `resolvectl status` and find which DNS servers are bound to your static interface.",
        "Run `netplan get ethernets` and check your `routes:` block uses `to: default`, not the deprecated `gateway4:`.",
        "Add a second IPv4 address to the `addresses:` list, `netplan try` it, and confirm both respond to ping from another host.",
      ],
      note:
        "Even with `accept-ra: false` and no v6 static, every interface keeps an automatic link-local IPv6 " +
        "address (`fe80::...`) — that is normal and required by the protocol, not a leak in your config. And if " +
        "an old guide shows `gateway4:`, translate it to a `routes:` entry in your head; the deprecated key " +
        "still works today but the warning it triggers is netplan telling you its days are numbered.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "The command workflow",
      tag: "try, apply, never get locked out",
      time: "half a day",
      payoff:
        "Netplan's YAML is only half the story — the other half is a small toolbelt of commands and the " +
        "discipline of using them in the right order. `generate` compiles and lints, `try` applies with an " +
        "automatic undo, `apply` commits, and `get`/`set`/`status` read and write config without an editor. " +
        "Master this workflow, especially the auto-revert safety net, and you can reconfigure a machine on " +
        "the other side of the planet over SSH (Secure Shell) without ever sawing off the branch you are " +
        "sitting on.",
      concepts: [
        "netplan generate — compile & lint",
        "netplan try — auto-revert countdown",
        "--timeout & confirming with ENTER",
        "netplan apply — no safety net",
        "netplan get / set — scripting config",
        "netplan status / info",
        "--debug goes before the subcommand",
        "the remote-change ritual",
      ],
      code:
`# The netplan toolbelt, in the order you actually use it.

# 1) COMPILE & LINT — no activation, just YAML -> backend files
sudo netplan generate             # errors report the file and line
sudo netplan --debug generate     # verbose: files merged, config emitted
#             note: --debug goes BEFORE the subcommand, not after

# 2) INSPECT what generate produced (networkd backend):
ls /run/systemd/network/          # 10-netplan-*.network and friends
# NetworkManager backend instead writes:
#   /run/NetworkManager/system-connections/netplan-*
# NEVER edit those files — they are regenerated on every apply.

# 3) TRY — apply with an automatic undo if you go silent
sudo netplan try                  # 120 s countdown; press ENTER to keep
sudo netplan try --timeout 30     # shorter fuse for quick experiments

# 4) APPLY — commit for real (only after try succeeded, on remote boxes)
sudo netplan apply

# 5) READ & WRITE config without an editor (great for scripts)
netplan get                       # the whole merged tree
netplan get ethernets.enp3s0.addresses
sudo netplan set ethernets.enp3s0.dhcp4=true
sudo netplan set network.renderer=networkd

# 6) OBSERVE the live result
netplan status                    # per-interface live view (needs 0.106+)
netplan status --all              # include loopback and unmanaged devices
netplan info                      # netplan version and supported features`,
      lang: "bash",
      walkthrough: [
        "**`generate` is your compiler and your linter.** It reads every YAML file, merges them (stage 0's lexicographic order), and writes backend configuration — networkd files or NetworkManager keyfiles — *without touching the live network*. Because it parses everything, it is also the fastest way to catch a typo: a bad indent or unknown key is reported with the offending file and line. Make `sudo netplan generate` a reflex after every edit, exactly like proof-reading before hitting send.",
        "**`try` is the reason netplan is safe to use over SSH.** It applies your config, then starts a countdown (120 seconds by default, `--timeout` to change it) waiting for you to press ENTER. If you never confirm — because your change killed the connection and you *cannot* — the countdown expires and netplan rolls back to the previous working state. Your SSH session usually survives a good change because the interface is reconfigured, not destroyed; and if the change was bad, the revert brings the old addresses back and you simply reconnect.",
        "**Confirm deliberately, not reflexively.** After `try` applies, test from a *second* terminal before pressing ENTER: can you still ping the gateway, does DNS (Domain Name System) resolve, is the address right in `ip -br a`? Pressing ENTER the instant the prompt appears throws away the entire safety net. On a local VM (Virtual Machine) this is practice; on a remote box it is the whole game.",
        "**`apply` commits with no undo.** It regenerates backend config and restarts the relevant services so the new state goes live — and if that state is wrong on a remote machine, you are locked out. Hence the golden rule this course repeats: on anything you cannot walk over to, the sequence is always `generate` → `try` → test → ENTER, and `apply` is reserved for changes a `try` has already proven, or for boxes with a console you can reach.",
        "**Know what `apply` actually restarts.** Under the networkd renderer it re-runs the generator and restarts `systemd-networkd` (plus helpers like `netplan-wpa-*` for Wi-Fi); under NetworkManager (NM) it reloads NM's keyfiles and reactivates connections. That is why the output files live under `/run` — they are ephemeral, rebuilt on every apply and every boot, and any hand-edit there evaporates. The YAML in `/etc/netplan` is the only source of truth.",
        "**A reboot is occasionally the honest test.** `apply` is good at adding things but shy about *removing* some virtual devices: delete a bridge or bond from YAML and the kernel device may linger until you take it down by hand (`sudo ip link delete br0`) or reboot. When a machine must survive power cycles — and they all must — the final proof of any serious change is one clean reboot that comes up configured correctly. Stage 12's capstone returns to exactly this lingering-virtual-device gotcha.",
        "**`get` and `set` make config scriptable.** `netplan get` prints the merged tree (a superb way to see what all your files add up to), and dotted keys drill in: `netplan get ethernets.enp3s0.addresses`. `netplan set key=value` writes YAML for you — into `/etc/netplan/70-netplan-set.yaml` unless you target a file with `--origin-hint` — which makes one-line changes and fleet automation possible without an editor. It is still just editing YAML, so the try/apply ritual applies unchanged.",
        "**`status` and `info` close the loop.** `netplan status` (netplan 0.106+, so any current Ubuntu) shows each interface's live addresses, routes, DNS and which renderer manages it — the config *as reality*, next to `get` which shows config *as written*. Disagreement between the two is stage 12's first clue. `netplan info` prints the installed version and feature flags, worth checking on older releases before you rely on newer keys.",
        "**Mind the `--debug` placement.** It is `netplan --debug generate` — the flag belongs to netplan itself, *before* the subcommand; `netplan generate --debug` just errors. Debug output walks you through every file consumed and every backend file emitted, which is how you catch a stray `99-*.yaml` silently overriding your carefully written config.",
      ],
      exercise:
        "Rehearse the full remote-change ritual in your VM, treating it as a production server. Connect over " +
        "SSH, then change the interface's address to a different (valid) one in the YAML. Run `sudo netplan " +
        "generate` first and fix anything it reports; run `sudo netplan --debug generate` and identify in the " +
        "output which files were merged and what was written under `/run`. Then `sudo netplan try --timeout " +
        "60`, reconnect over SSH to the *new* address from a second terminal to prove it works, and only then " +
        "press ENTER. Repeat once more with a deliberately unreachable gateway and let the timeout revert you. " +
        "Finish with `netplan get` versus `netplan status` and note where the two views differ in shape.",
      drills: [
        "Run `sudo netplan generate` after adding a deliberate typo (`adresses:`) and read exactly which file and line it blames.",
        "Run `sudo netplan try --timeout 20`, let it expire without pressing ENTER, and confirm with `ip -br a` that the old config returned.",
        "Run `netplan get ethernets` and compare it with `netplan status --all` for the same interface.",
        "Run `sudo netplan set ethernets.enp3s0.dhcp4=true`, find which file appeared in `/etc/netplan`, then revert it with another `set`.",
        "Run `ls /run/systemd/network/` before and after an apply and note which `10-netplan-*` files changed.",
      ],
      note:
        "`netplan try` is superb but not literally bulletproof: a config that keeps the link up while quietly " +
        "breaking something else (say, DNS) will happily 'survive' the countdown if you confirm without " +
        "testing. The safety net catches lost connectivity — *you* still have to test everything else before " +
        "pressing ENTER, which is why the second-terminal check is part of the ritual, not an optional extra. " +
        "And netplan's own known-issues note adds one more caveat: when a `try` involving virtual devices " +
        "(bonds, bridges, VLANs) times out, verify with `ip -br a` that the revert actually completed — " +
        "leftover virtual devices may need an `ip link delete` or a reboot to clear.",
    },

    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Matching & naming NICs",
      tag: "pin the right interface",
      time: "half a day",
      payoff:
        "On a laptop with one port, interface names barely matter. On a server with four NICs (Network " +
        "Interface Cards), an add-in card and a USB adapter, writing config against `enp1s0f0` is fragile — " +
        "move the card to another slot and the name changes with it. Netplan's `match:` block lets you pin " +
        "config to what a NIC *is* (its MAC address, its driver, a name pattern) rather than where it sits, " +
        "and `set-name:` gives it a stable human name like `lan0` that your firewall rules and monitoring " +
        "can rely on forever.",
      concepts: [
        "predictable names: enp3s0 decoded",
        "match: name (globs) · macaddress · driver",
        "set-name: your own stable names",
        "with match, the YAML key is a label",
        "one stanza for many NICs (glob)",
        "set-name lands at boot/replug, not live",
        "find MACs with ip link",
      ],
      code:
`# Step 1 — collect each NIC's identity anchors:
ip -br link                             # names and link state, one line each
ip link show enp3s0 | grep link/ether   # the MAC (Media Access Control) address

# Step 2 — pin by MAC and rename; glob-match a whole card:
sudo tee /etc/netplan/60-names.yaml >/dev/null <<'EOF'
network:
  version: 2
  ethernets:

    lan0:                       # a LABEL, not a device name (because match: is set)
      match:
        macaddress: "52:54:00:ab:cd:ef"   # this exact physical NIC, wherever it sits
      set-name: lan0            # rename the kernel interface itself to lan0
      dhcp4: true

    labports:                   # one stanza configures every port it matches
      match:
        name: "enp1s0f*"        # glob: all four ports of the quad card
      dhcp4: true
      dhcp4-overrides:
        route-metric: 300       # keep lab leases from stealing the default route

    usbnet:
      match:
        driver: "r8152"         # match by kernel driver (USB Ethernet chipset)
      dhcp4: true
EOF
sudo chmod 600 /etc/netplan/60-names.yaml
sudo netplan try                # the safety net from stage 5, as always`,
      lang: "bash",
      walkthrough: [
        "**Predictable names encode location, and that is their weakness.** `enp3s0` means Ethernet, PCI bus 3, slot 0 — deterministic across reboots, which beats the old lottery where `eth0` and `eth1` could swap. But the determinism is tied to the *slot*: reseat the card, add another before it, or restore this config onto slightly different hardware, and the name shifts while your YAML keeps talking about an interface that no longer exists.",
        "**`match:` selects interfaces by property instead of by name.** Three selectors are available: `name:` (with `*`/`?` globs allowed), `macaddress:`, and `driver:`. The MAC is the strongest anchor for one specific physical port — it is burned into the NIC and travels with it between slots and even between machines. Collect MACs first with `ip link show <iface> | grep link/ether`, and keep a note of which port on the chassis owns which MAC; future-you doing stage 9's bonds will be grateful.",
        "**The moment `match:` appears, the YAML key stops being a device name.** Without `match:`, a key like `enp3s0:` must literally be the interface's name. *With* `match:`, the key — `lan0:`, `labports:`, anything — is just a label for the stanza, and the match block alone decides which hardware it applies to. Forgetting this rule cuts both ways: people add `match:` and wonder why the key is ignored, or omit it and wonder why their friendly made-up key configures nothing.",
        "**`set-name:` turns the label into reality.** Paired with a `match:` (which it requires), `set-name: lan0` renames the kernel interface itself, so `ip -br a`, firewall rules, `tcpdump` and every dashboard see `lan0` from then on. Sensible role-based names — `lan0`, `wan0`, `storage0` — make a multi-NIC server self-documenting in a way `enp129s0f1` never will.",
        "**The rename lands at boot or replug, not mid-flight.** Renaming happens when the device is (re)initialised — at boot, or when the NIC is unplugged and replugged — because live services may be holding the old name. So after adding `set-name:`, a `netplan apply` may leave the old name in place until the next reboot. Plan the rename as a boot-time change: apply, verify the YAML is sound, then reboot the VM (Virtual Machine) and confirm the new name appears — never debug a 'rename did not happen' on a remote box without remembering this.",
        "**Globs configure fleets of ports in one stanza.** `name: \"enp1s0f*\"` catches all four ports of a quad-port card; `driver: \"r8152\"` catches every USB adapter using that chipset regardless of which socket it is plugged into. Every matched interface receives the same settings — ideal for 'all lab ports take DHCP (Dynamic Host Configuration Protocol) with a high metric' policies. One rule: a stanza that matches *multiple* devices cannot use `set-name:`, since several NICs cannot share one name.",
        "**Verify the pinning end to end.** After a reboot: `ip -br link` should list `lan0` where the old name used to be; `ip link show lan0 | grep link/ether` should show exactly the MAC you matched; and `netplan status` should show the label's settings live on the right hardware. If a rename half-happened, stage 12's ladder applies — `netplan --debug generate` will show what netplan *intended*, and `journalctl -u systemd-networkd` shows what udev and networkd actually did.",
        "**MACs are the anchor — with two footnotes.** Some virtualisation platforms regenerate a VM's MAC when you clone it, so cloned guests need their `match:` updated (or a `name:` match instead). And modern privacy features randomise *Wi-Fi* MACs by default on some systems — a non-issue for wired servers, but worth remembering before you match a wireless card by MAC in stage 7.",
      ],
      exercise:
        "Give your practice VM a second network interface (in multipass, VirtualBox or virt-manager this is a " +
        "one-line or one-click addition), then bring order to the pair. List both NICs with `ip -br link` and " +
        "record each MAC. Write a `60-names.yaml` that matches each interface by `macaddress:` and renames " +
        "them `lan0` and `lab0`, keeping DHCP on both but giving `lab0` a `route-metric` of 300. Run `sudo " +
        "netplan generate`, then `try`, then reboot and confirm with `ip -br link` that both new names exist " +
        "and with `ip route` that the default route prefers `lan0`. Swap which MAC gets which name and reboot " +
        "again to prove the config follows the hardware, not the old names.",
      drills: [
        "Run `ip link show <iface> | grep link/ether` for every NIC in your VM and write down the name-to-MAC table.",
        "Run `netplan get ethernets` and identify which stanzas use `match:` — for each, say what the key is: device name or label?",
        "Change a stanza's key from `lan0:` to `mainlink:` (keeping `match:` and `set-name: lan0`), re-apply, and confirm nothing observable changed.",
        "Add a `match: name: \"enp*\"` stanza with only `dhcp4: true` and use `netplan --debug generate` to see which devices it captured.",
        "Rename an interface with `set-name:`, run `netplan apply`, note whether the name changed live, then reboot and check again.",
      ],
      note:
        "Resist the urge to rename everything: on a one-NIC VM the predictable name is fine, and each rename " +
        "is one more thing a future admin must discover. The technique earns its keep on multi-NIC servers " +
        "and in configs you template across machines — there, matching by MAC with role-based `set-name:` " +
        "labels is the difference between a config that documents itself and one that lies after a hardware swap.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "Wi-Fi from a YAML file",
      tag: "headless wireless",
      time: "half a day",
      payoff:
        "Wi-Fi is usually configured by clicking an icon — but a headless Raspberry Pi, a server in a room " +
        "without Ethernet, or a kiosk build has no icon to click. Netplan's `wifis:` block declares the " +
        "SSID (Service Set Identifier) and passphrase in the same YAML as everything else, and the backend " +
        "drives `wpa_supplicant` for you. Learn it once and 'bring this box up on the wireless' becomes a " +
        "file you copy in, not a ritual of USB keyboards and borrowed monitors.",
      concepts: [
        "wifis: + access-points:",
        "WPA2-PSK: SSID + password",
        "hidden: true for unbroadcast SSIDs",
        "several APs = a roaming list",
        "renderer choice: networkd vs NM for radios",
        "wpa_supplicant under the bonnet",
        "regulatory domain (iw reg)",
      ],
      code:
`# /etc/netplan/70-wifi.yaml — headless Wi-Fi on a server or a Pi.
# As always: root-owned, chmod 600 (it now contains a secret!), netplan try.
network:
  version: 2
  renderer: networkd            # networkd + wpa_supplicant own the radio (stage 2)
  wifis:
    wlan0:
      dhcp4: true               # take an address from the AP's network (stage 3)
      access-points:

        "HomeNet-5G":           # the SSID, quoted — spaces and symbols are fine
          password: "correct horse battery staple"   # WPA2-PSK passphrase (8-63 chars)

        "LabNet":               # a second AP: netplan builds a roaming list
          password: "another-strong-passphrase"
          hidden: true          # SSID not broadcast — we must probe for it by name

      # Enterprise (802.1X) networks need an auth: block instead of password:
      #   auth:
      #     key-management: eap
      #     method: peap
      #     identity: "user@example.org"
      #     password: "..."
      # — the netplan reference documents the full set; pointer only here.

      nameservers:
        addresses: [9.9.9.9]    # optional: pin DNS instead of trusting the lease
      dhcp4-overrides:
        use-dns: false`,
      lang: "yaml",
      walkthrough: [
        "**`wifis:` is `ethernets:` plus radio details.** Everything you already know applies — DHCP (Dynamic Host Configuration Protocol) or static addressing, `nameservers:`, `routes:`, overrides — and one new requirement: an `access-points:` map naming which network(s) to join. Each key under it is an SSID (Service Set Identifier), quoted because SSIDs love spaces and odd characters, and stage 1's quoting rules apply in full.",
        "**WPA2-PSK is the simple, common case.** WPA (Wi-Fi Protected Access) with a Pre-Shared Key is your home or lab network: one passphrase, 8 to 63 characters, given as `password:`. Because that secret now sits in plain text, the file-permission rule from stage 0 stops being a formality: `chmod 600`, root-owned, no exceptions — netplan itself warns about world-readable files for exactly this reason.",
        "**Hidden SSIDs need to be told they are hidden.** A network that does not broadcast its name will never appear in a scan, so the client must actively probe for it — that is what `hidden: true` switches on. Without it, netplan waits politely for a beacon that never comes and the connection simply never happens. (Hiding an SSID is obscurity, not security — the name is trivially visible to anyone watching the airwaves — but plenty of real networks do it, so you need the key.)",
        "**Several access points (APs) make a roaming list.** List more than one SSID and `wpa_supplicant` will join whichever is available, which is exactly what a device that moves between home and lab wants. Priorities between them are the supplicant's decision; if you need hard control over which network wins, keep the list short or split configs per site.",
        "**Under networkd, netplan manages `wpa_supplicant` for you.** `systemd-networkd` knows nothing about radios, so `netplan apply` also generates a supplicant configuration and starts a per-interface service to run the WPA handshake — on netplan systems it appears as `netplan-wpa-wlan0.service` (the classic unit name pattern is `wpa_supplicant@wlan0`). That unit's journal is where authentication failures land: `journalctl -u netplan-wpa-wlan0` showing a 4-way-handshake failure means, nine times out of ten, a wrong passphrase.",
        "**On a desktop, let NetworkManager own the radio.** NM (NetworkManager) exists precisely for roaming laptops — scanning, captive portals, VPNs (Virtual Private Networks), a GUI (Graphical User Interface) — and Ubuntu Desktop uses it as the default renderer, as stage 2 covered. Fighting that by hand-writing `renderer: networkd` for a laptop's radio means losing all of it. The headless YAML approach in this stage is for servers, Pis and kiosks; on Desktop, click the icon and let NM write its own netplan file.",
        "**Radio problems have their own debugging layer.** Before blaming YAML, check the physical tier: `ip -br link` — does `wlan0` exist at all (missing usually means firmware/driver, check `dmesg | grep -i firmware`)? `iw dev` — what state is the radio in? `iw dev wlan0 scan | grep SSID` — can it even *hear* your network? Then the supplicant journal for auth, then `networkctl status wlan0` for addressing — the wireless-flavoured version of stage 12's ladder.",
        "**The regulatory domain can silently hide networks.** Radio rules differ by country — channels 12 and 13 in the 2.4 GHz band and various 5 GHz channels are legal in some regions and not others. If the kernel believes it is in the wrong country (`iw reg get` shows the current setting, often the world-safe default `00`), your card may refuse channels your AP is using and the network simply never appears in scans. `sudo iw reg set GB` fixes the session; setting your country persistently is a one-line change in the wireless-regdb configuration.",
      ],
      exercise:
        "Configure Wi-Fi fully headless on real hardware if you have it — a Raspberry Pi or a laptop you can " +
        "treat as a server is ideal (a VM rarely has a real radio; if that is all you have, write and " +
        "`netplan generate`-validate the file anyway). Unplug Ethernet so the radio is the only path, write " +
        "`70-wifi.yaml` with your network's SSID and passphrase, set its permissions to 0600, and bring it up " +
        "with `sudo netplan try`. Verify with `ip -br a` that `wlan0` holds an address, with `iw dev` that it " +
        "is associated to the right SSID, and by pinging the gateway and a hostname. Then follow the failure " +
        "path deliberately: change one character of the passphrase, re-try, and find the handshake failure " +
        "in the supplicant journal before reverting.",
      drills: [
        "Run `iw dev wlan0 scan | grep -i ssid` (or `iw dev wlan0 scan | less`) and confirm your target network is audible.",
        "Run `journalctl -u netplan-wpa-wlan0 -e` after an apply and find the line showing association or failure.",
        "Run `ls -l /etc/netplan/` and verify every file containing a passphrase is `-rw-------` and root-owned.",
        "Run `iw reg get` and check the regulatory domain matches your country, not the `00` world default.",
        "Add a second (guest or phone-hotspot) SSID to `access-points:`, apply, and prove the box joins it when the primary AP is off.",
      ],
      note:
        "WPA3 support depends on the driver, the card and the `wpa_supplicant` build as much as on netplan, " +
        "so mixed WPA2/WPA3 networks usually 'just work' while WPA3-only ones can be temperamental on older " +
        "chips. And for enterprise (802.1X) networks, treat the `auth:` block shown in the comments as a " +
        "starting pointer — certificate paths and EAP methods vary enough that the netplan reference " +
        "documentation is the authority there, not any single example.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "VLANs",
      tag: "one wire, many networks",
      time: "half a day",
      payoff:
        "A VLAN (Virtual LAN) lets one physical cable carry several isolated networks at once — management " +
        "traffic here, lab machines there, guests somewhere else — without buying more NICs (Network " +
        "Interface Cards) or pulling more cable. Netplan makes each VLAN a tiny stanza: an `id`, a `link` " +
        "to its parent, and then all the addressing you already know. This is the first of the virtual " +
        "devices (stages 9 and 10 add bonds and bridges) and the one you will meet everywhere real " +
        "infrastructure lives.",
      concepts: [
        "802.1Q: a 4-byte tag per frame",
        "isolation without more cables",
        "vlans: id: + link:",
        "each VLAN addresses like a real NIC",
        "trunk vs access ports (switch side)",
        "parent often carries no address",
        "verify: ip -d link show",
      ],
      code:
`# /etc/netplan/80-vlans.yaml — one cable into a trunk port, three networks.
network:
  version: 2
  ethernets:
    enp3s0:
      dhcp4: false              # the parent is just the trunk — no address of its own

  vlans:
    vlan10:                     # the stanza name is yours; id + link do the work
      id: 10                    # the 802.1Q tag stamped on every frame (1-4094)
      link: enp3s0              # which physical NIC carries this VLAN
      addresses: [10.10.0.5/24]
      routes:
        - to: default           # the box's one default route lives on VLAN 10
          via: 10.10.0.1
      nameservers:
        addresses: [10.10.0.1]

    vlan40:                     # a second network on the SAME wire
      id: 40
      link: enp3s0
      addresses: [10.40.0.5/24] # no default route here: this segment stays local

    mgmt:                       # names need not embed the id — this is tag 99
      id: 99
      link: enp3s0
      addresses: [10.99.0.5/24]

# Verify after applying:
#   ip -d link show vlan10      -> 'vlan protocol 802.1Q id 10'
#   ip -br a                    -> one address per VLAN, none on enp3s0`,
      lang: "yaml",
      walkthrough: [
        "**A VLAN is a name-tag on every frame.** The 802.1Q standard inserts a 4-byte tag into the Ethernet frame header carrying a VLAN ID between 1 and 4094. Switches and hosts that understand tags sort traffic by ID and keep the groups strictly apart: a frame tagged 10 is *never* delivered into VLAN 40, even though both share the same copper. One wire, several logically separate LANs (Local Area Networks) — that is the entire trick.",
        "**Why bother: isolation and tidiness without hardware.** Separating management, lab and guest traffic onto different physical networks would mean three NICs, three cables and three switch ports per host. VLANs achieve the same separation in software: the security boundary (helped by firewall rules at the router between VLANs), the broadcast isolation, and the tidy addressing plan, all over the one link you already have.",
        "**The netplan syntax is two keys plus everything you know.** Under `vlans:`, each stanza needs `id:` (the tag) and `link:` (the parent interface — a name from `ethernets:`, or later a bond from stage 9). Beyond that a VLAN behaves exactly like a NIC: `addresses:`, `routes:`, `nameservers:`, DHCP (Dynamic Host Configuration Protocol) if the VLAN has a DHCP server — every key from stages 3 and 4 works unchanged.",
        "**The parent usually carries no address.** In the classic setup, *all* traffic is tagged, so `enp3s0` itself is bare — `dhcp4: false`, no `addresses:` — and merely ferries tagged frames for its children. An address on the parent would live in the *untagged* (native) VLAN of the switch port, which is a legitimate design but an easy accident: if the parent unexpectedly picks up a DHCP lease, you have probably left it enabled while the switch port still passes untagged traffic.",
        "**The switch side must agree, and this is where VLANs 'don't work'.** A switch port is either an **access port** — untagged, belonging to exactly one VLAN, for normal devices that know nothing of tags — or a **trunk port**, which carries multiple tagged VLANs to a tag-aware host like ours. Your netplan config needs the switch port configured as a trunk allowing IDs 10, 40 and 99; plug the same host into an access port and every tagged frame is silently dropped. When a VLAN passes no traffic at all, suspect the switch configuration *before* your YAML.",
        "**Stanza names are labels; only `id:` is the truth.** Calling the stanza `vlan10` for tag 10 is a kindness to readers, not a requirement — `mgmt` with `id: 99` works identically, and the kernel interface takes the stanza's name. Echoes of stage 6: the name is for humans, the structured keys are what the machine obeys. Pick one naming convention (`vlan<id>` or role names) and stay with it across the fleet.",
        "**Verify with the -d flag doing the talking.** `ip -d link show vlan10` (`-d` for details) prints `vlan protocol 802.1Q id 10` plus the parent — proof the kernel device is tagged as intended. `ip -br a` should show one address per VLAN and none on `enp3s0`. Then prove isolation end to end: from `vlan10`, ping that VLAN's gateway; confirm you can *not* reach `10.40.0.x` directly except via a router that deliberately connects the two networks.",
        "**Practise safely, and preview the stack.** VLAN experiments are gentler than address changes — adding `vlan40` cannot break the connection you are working over — but keep the `netplan try` habit from stage 5 anyway, since editing the parent's stanza absolutely can cut you off. And note the composability: a VLAN's `link:` can point at a bond, and a bridge can enslave a VLAN. Bond → VLAN → bridge is precisely the stack stage 12's capstone builds, so every layer you master here is a floor of that tower.",
      ],
      exercise:
        "Build a two-VLAN host in your VM and prove the isolation. If your virtualisation platform lets you " +
        "(most do), you can even skip a real switch: create two VLANs (ids 10 and 40) on the VM's single " +
        "interface, giving each a static address from a distinct /24 as in the code block, with only vlan10 " +
        "carrying a default route. Apply with `sudo netplan try`, then verify: `ip -d link show` must report " +
        "the right 802.1Q id on each device, `ip -br a` must show the parent bare, and `ip route` must show " +
        "exactly one default. If you have a managed switch or a second VM, put a peer on VLAN 40 and confirm " +
        "vlan40-to-peer pings succeed while untagged traffic to it fails. Write two sentences on what the " +
        "switch port would need to be (trunk, allowed IDs) for this host in a real rack.",
      drills: [
        "Run `ip -d link show vlan10` and find the `802.1Q id` and the parent device in the output.",
        "Run `ip -br a` and confirm the parent interface carries no IPv4 address while each VLAN carries exactly one.",
        "Run `ip route` and explain which VLAN owns the default route and why the others must not have one.",
        "Add a third VLAN (id 99) with `netplan set` from stage 5 instead of an editor, then `try` and verify it appeared.",
        "Delete a VLAN from the YAML, run `sudo netplan apply`, and check with `ip link` whether the kernel device vanished or lingered (stage 5's removal caveat).",
      ],
      note:
        "Two IDs deserve respect: VLAN 1 is the near-universal default/native VLAN on switches and best left " +
        "for nothing important, and IDs 0 and 4095 are reserved by the standard. Also remember that VLANs " +
        "isolate at layer 2 only — if a router or layer-3 switch connects your VLANs, the isolation is " +
        "exactly as strong as the firewall rules on that router, not the tags themselves.",
    },
    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "Bonds",
      tag: "two NICs, one address",
      time: "1 day",
      payoff:
        "A bond fuses two (or more) physical NICs into one logical interface with one address, so a dead " +
        "cable, a dead switch port or a dead NIC no longer takes the server offline — and, with the right " +
        "mode, you can aggregate bandwidth too. This is the bread and butter of every serious server room, " +
        "and in netplan it's a `bonds:` block of maybe ten lines. Learn the modes, the parameters, and how " +
        "to *prove* failover works by pulling a link while a ping is running.",
      concepts: [
        "bond: many NICs, one logical device",
        "members carry no addresses — the bond does",
        "active-backup vs 802.3ad (LACP) vs balance-rr",
        "mii-monitor-interval & primary",
        "lacp-rate & transmit-hash-policy",
        "switch-side LAG requirements",
        "/proc/net/bonding/bond0",
        "failover test: down a member",
      ],
      code:
`# /etc/netplan/60-bond.yaml — two NICs, one address, survives a cable pull
network:
  version: 2
  renderer: networkd
  ethernets:
    # the member NICs: declare them so the links come up,
    # but give them NO addresses — the bond owns the identity
    enp3s0:
      dhcp4: false
    enp4s0:
      dhcp4: false
  bonds:
    bond0:
      interfaces: [enp3s0, enp4s0]
      addresses: [192.168.10.20/24]
      routes:
        - to: default
          via: 192.168.10.1
      nameservers:
        addresses: [192.168.10.1]
      parameters:
        mode: active-backup        # failover only: one active, one hot spare
        primary: enp3s0            # prefer this member whenever it is healthy
        mii-monitor-interval: 100  # check link state every 100 ms

# --- if your switch speaks LACP, swap the parameters block for: ---
#      parameters:
#        mode: 802.3ad                    # true aggregation (switch must agree!)
#        lacp-rate: fast                  # negotiate every 1 s, not every 30 s
#        mii-monitor-interval: 100
#        transmit-hash-policy: layer3+4   # spread flows by IP + port`,
      lang: "yaml",
      walkthrough: [
        "**A bond is many NICs pretending to be one.** A **NIC (Network Interface Card)** is a single point of failure: one cable, one port, one card. **Link aggregation** (bonding) stacks several NICs into one logical device — `bond0` — that carries the address and the traffic. If a member dies, the bond shuffles traffic onto the survivors in milliseconds and your **SSH (Secure Shell)** session never notices. Some modes go further and use *all* members at once for extra throughput.",
        "**The golden rule: members carry no addresses.** In the YAML, `enp3s0` and `enp4s0` appear under `ethernets:` only so netplan brings their links up — each is just `dhcp4: false`, nothing more. The `bond0` device under `bonds:` lists them in `interfaces:` and owns *everything* identity-related: the `addresses:`, the default route, the `nameservers:`. If you accidentally leave an address on a member, you get two devices fighting over routing — the exact confusion bonding exists to remove. Bridges in stage 10 follow the same no-address-on-the-port rule.",
        "**`mode: active-backup` is the safe default.** One member is active, the rest are hot spares; on link failure the **MAC (Media Access Control)** address hops to a spare and traffic continues. Its superpower is that it needs *nothing* from the switch — the two cables can even go to two different switches for real redundancy. No extra bandwidth, but bulletproof and unconditionally deployable. `primary: enp3s0` says which member to prefer when both are healthy.",
        "**`mode: 802.3ad` is real aggregation — but it takes two to tango.** This is **LACP (Link Aggregation Control Protocol)**: the server and the switch actively negotiate a link-aggregation group, and traffic is spread across all members. The catch: the switch ports **must** be configured as a LAG/port-channel with LACP enabled. Plug an 802.3ad bond into an unconfigured switch and you get a broken, flapping mess — this is the number-one bonding support ticket. `lacp-rate: fast` asks for negotiation packets every second instead of every 30, so failures are noticed sooner.",
        "**`transmit-hash-policy` decides how flows are spread.** LACP never splits a single flow across members (packets would arrive out of order); instead it hashes each *flow* to a member. `layer3+4` hashes on IP addresses plus ports, which spreads many small connections nicely. Remember the consequence: one big file copy still maxes out at *one* member's speed — aggregation multiplies capacity for many flows, not for a single one.",
        "**`mii-monitor-interval` is the heartbeat.** The **MII (Media Independent Interface)** monitor polls each member's carrier state — is the link electrically up? — every N milliseconds; `100` is the conventional value. Without a monitor interval the bond cannot detect failures at all, so always set it. `mode: balance-rr` (round-robin, packet-by-packet striping) exists too, but its packet reordering hurts TCP — treat it as a curiosity unless you know exactly why you want it.",
        "**Practise this in a VM with two NICs.** A **VM (Virtual Machine)** is the ideal bonding lab: in virt-manager or your hypervisor of choice, add a second network interface to an Ubuntu Server guest and both 'cables' are yours to pull with a click. Write the file, `sudo chmod 600` it, run `sudo netplan generate` to lint, then `sudo netplan try` — the stage 5 ritual applies doubly here, because a half-formed bond is a classic way to lose connectivity on a remote box.",
        "**`/proc/net/bonding/bond0` is the bond's dashboard.** `cat` it and the kernel tells you everything: the mode, the currently active member, each member's link state and failure count, and (for 802.3ad) whether the LACP negotiation actually converged — look for matching aggregator IDs on all members. `ip -br a` should show `bond0` with the address and the members without; `networkctl` lists the members as enslaved.",
        "**Prove failover — never just trust it.** Start `ping 192.168.10.1` in one terminal. In another, `sudo ip link set enp3s0 down` to simulate a pulled cable. Watch `/proc/net/bonding/bond0` flip the active member to `enp4s0` and confirm the ping barely hiccups (active-backup typically drops zero or one packet). Bring the link back up and, because you set `primary:`, traffic returns to `enp3s0`. A bond you have never failed over is a bond you cannot trust.",
      ],
      exercise:
        "Build and torture-test a failover bond in a VM with two NICs. Write `60-bond.yaml` with `mode: " +
        "active-backup`, `primary:` and a 100 ms `mii-monitor-interval`, lint it with `sudo netplan generate`, " +
        "and land it with `sudo netplan try`. Confirm the shape with `ip -br a` — address on `bond0`, none on " +
        "the members — and read `/proc/net/bonding/bond0` to identify the active member. Now start a continuous " +
        "ping to your gateway, down the active member with `ip link set ... down`, and record how many pings " +
        "(if any) were lost during the switch. Bring it back up and verify traffic returns to the primary. " +
        "Finally, re-read the file and explain in one sentence why neither member has an `addresses:` key.",
      drills: [
        "Run `cat /proc/net/bonding/bond0` and identify the mode, the currently active member, and each member's link-failure count.",
        "Run `ip -br a` and confirm the address sits on `bond0` while both members show no IPv4 of their own.",
        "With a ping running, run `sudo ip link set <active-member> down`, watch the failover, then bring it back up.",
        "Run `netplan get bonds` and read your bond's parameters back out of the merged config.",
        "Run `ip link show` on both members and the bond — note that all three share the same MAC while the bond is up.",
      ],
      note:
        "Mode choice is really a question about your switch: `active-backup` works everywhere and even across " +
        "two switches; `802.3ad` needs LACP configured on the switch ports and all members plugged into the " +
        "same LAG. When an 802.3ad bond misbehaves, check the switch side *first* — " +
        "`/proc/net/bonding/bond0` showing members in different aggregator IDs is the tell-tale that the " +
        "switch never joined the negotiation.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Bridges",
      tag: "a switch in software",
      time: "1 day",
      payoff:
        "A bridge is a network switch made of software: plug interfaces into it and the kernel forwards " +
        "frames between them exactly like the box under your desk. It's *the* pattern for hosting VMs and " +
        "containers — `br0` owns the host's address, the physical NIC becomes a mere port, and every guest " +
        "you attach appears on your real LAN as a first-class citizen with its own address. Once you can " +
        "build a bridge in netplan, you can build a virtualisation host.",
      concepts: [
        "a bridge is a software switch",
        "br0 owns the IP, the NIC is a port",
        "interfaces: [enp3s0]",
        "stp & forward-delay",
        "bridged vs NAT (virbr0 / docker0)",
        "attach a VM or container to br0",
        "bridge link / ip -br a",
      ],
      code:
`# --- the classic VM-host bridge: br0 owns the IP, enp3s0 is just a port ---
sudo tee /etc/netplan/70-bridge.yaml > /dev/null <<'EOF'
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0:
      dhcp4: false          # the physical NIC carries NO address...
  bridges:
    br0:                    # ...the bridge does
      interfaces: [enp3s0]
      addresses: [192.168.10.30/24]
      routes:
        - to: default
          via: 192.168.10.1
      nameservers:
        addresses: [192.168.10.1]
      parameters:
        stp: false          # one uplink, no loops: skip the STP pause
        forward-delay: 0    # start forwarding immediately
EOF
sudo chmod 600 /etc/netplan/70-bridge.yaml

# compile, then apply with the stage-5 safety net
sudo netplan generate
sudo netplan try                  # press ENTER to confirm within 120 s

# prove the shape
ip -br a                          # br0 has the IPv4; enp3s0 shows none
bridge link                       # every port currently in the bridge
networkctl status br0             # networkd's view: members, address, routes`,
      lang: "bash",
      walkthrough: [
        "**A bridge is a switch you conjure from thin air.** A hardware switch learns which **MAC (Media Access Control)** address lives behind which port and forwards frames accordingly. A Linux **bridge** is the same machine written in kernel code: create `br0`, plug interfaces into it as *ports*, and frames flow between them at layer 2. No cables, no rack space — just YAML.",
        "**The classic pattern: br0 for VMs and containers.** A **VM (Virtual Machine)** on a plain host hides behind its hypervisor's **NAT (Network Address Translation)**; with a bridge it can instead *join your real LAN*. The host's physical **NIC (Network Interface Card)** becomes one port of `br0`; each guest gets a virtual cable (a tap interface) plugged in as another port. Now the guest asks your real router for a **DHCP (Dynamic Host Configuration Protocol)** lease, gets a real `192.168.10.x` address, and every device on the network can reach it directly — as if it were another physical machine plugged into the switch.",
        "**The no-address rule, again.** Exactly as with bonds in stage 9: the physical NIC under a bridge carries **no address** — `enp3s0` is declared with just `dhcp4: false`, and `br0` owns the `addresses:`, the default route (`routes: to: default`, the stage 4 form) and the `nameservers:`. Forgetting this and leaving DHCP on the NIC gives the host two personalities and produces baffling intermittent routing. The address always lives at the *top* of the stack.",
        "**`stp` and `forward-delay` — the loop question.** **STP (Spanning Tree Protocol)** is how switches detect and break forwarding loops (two switches cabled to each other twice would otherwise storm the network with duplicate frames). But STP costs you: a new port sits in the listening state and then the learning state for `forward-delay` seconds **each** — roughly 30 seconds at the 15-second default — before it passes traffic. On a home-lab bridge with a single uplink a loop is impossible, so `stp: false` with `forward-delay: 0` makes VMs get network the instant they boot. If your bridge ever has *two* paths to the same switch fabric, turn STP back on.",
        "**Bridged vs NAT — know which you're looking at.** You have already seen `virbr0` (libvirt) and `docker0` (Docker) in `ip -br a`: those are also bridges, but *NAT'd* ones — they front a private subnet like `192.168.122.0/24` and masquerade guests out through the host's address, so guests can dial out but nobody can dial in without port-forwarding. Your `br0` is the opposite: no private subnet, no NAT, guests sit on the real LAN. NAT is fine for a disposable dev container; a home-lab server VM you want to reach from other machines wants `br0`.",
        "**Attaching a guest.** In virt-manager, set the VM's network source to 'Bridge device' and name `br0`; with plain libvirt XML it's an `interface type='bridge'` stanza; LXD does it with a profile whose nictype is `bridged` and parent `br0`. The moment the guest boots, run `bridge link` on the host — you'll see a new `vnet0`- or `tap`-style port has silently joined the bridge alongside `enp3s0`. That's the software switch doing its job.",
        "**Apply with the net, verify the shape.** The code block uses the full stage 5 ritual — `generate` to lint, `try` to apply with auto-revert — because a bridge mistake (address left on the NIC, typo in `interfaces:`) can absolutely strand a remote host. Afterwards `ip -br a` must show the IPv4 on `br0` and *nothing* on `enp3s0`; `bridge link` lists the ports; `networkctl status br0` confirms networkd manages it and shows the address and routes in one screen.",
        "**One honest limitation: Wi-Fi.** You generally *cannot* put a Wi-Fi client interface into a bridge — 802.11 frames carry three MAC addresses and an access point will drop frames from MACs it hasn't authenticated, which is exactly what bridged guests would send. Bridge over Ethernet; for wireless hosts, guests must live behind NAT instead. Knowing this saves an evening of confusion.",
      ],
      exercise:
        "Turn a VM host (or a nested-virtualisation lab guest) into a bridged host. Write `70-bridge.yaml` " +
        "moving the machine's address from `enp3s0` (or your NIC's real name — check `ip -br link`) onto a new " +
        "`br0`, lint with `sudo netplan generate`, and land it with `sudo netplan try` — over SSH this is " +
        "non-negotiable, since you are moving the address your session rides on. Verify with `ip -br a` and " +
        "`bridge link` that the bridge owns the IP and the NIC is a bare port. Then attach a guest (virt-manager " +
        "bridge device, or an LXD bridged profile), let it take a DHCP lease from your real router, and prove " +
        "the point by pinging the guest's address from a *different* machine on the LAN.",
      drills: [
        "Run `ip -br a` after applying and confirm `br0` holds the IPv4 while the physical NIC shows none.",
        "Run `bridge link` before and after starting a guest VM — identify the new tap/vnet port that appears.",
        "Run `networkctl status br0` and read off the members, the address, and the default route.",
        "Run `ip -br a | grep -E 'virbr|docker'` and classify each hit: bridged-to-LAN or NAT'd private subnet?",
        "Run `netplan get bridges` and check `stp` and `forward-delay` came through as you wrote them.",
      ],
      note:
        "`stp: false` is right only while the bridge has a single uplink and no chance of a loop — the moment " +
        "you cable a second path into the same fabric, a loop can melt the network in seconds, so re-enable " +
        "STP. And remember the read-only rule from stage 0: the bridge netplan builds is described in " +
        "`/run/systemd/network/`, and hand-edits there evaporate on the next `netplan apply`.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "Routes & policy routing",
      tag: "which way do packets leave",
      time: "1 day",
      payoff:
        "One default route answers one question: 'where does everything else go?'. Real networks ask harder " +
        "ones — this subnet via that router, two internet uplinks at once, replies that must leave the way " +
        "they arrived. Netplan expresses all of it declaratively: `routes:` entries with metrics and tables, " +
        "and `routing-policy:` rules for source-based routing. Master this stage and multi-homed servers stop " +
        "being black magic and become twelve lines of YAML you can read aloud.",
      concepts: [
        "routes: to / via / metric",
        "on-link routes",
        "two uplinks, metric picks the winner",
        "asymmetric routing pain",
        "extra routing tables (table:)",
        "routing-policy: from / table",
        "ip route get / ip rule",
      ],
      code:
`# /etc/netplan/80-uplinks.yaml — two uplinks, replies leave the way they came
network:
  version: 2
  ethernets:
    enp3s0:                          # uplink A: the primary line
      addresses: [203.0.113.10/24]
      routes:
        - to: default
          via: 203.0.113.1
          metric: 100                # lower metric wins: normal traffic exits here
        - to: 10.20.0.0/16           # a static route: internal net that sits
          via: 203.0.113.254         # behind a second router on this segment
    enp4s0:                          # uplink B: second provider / backup line
      addresses: [198.51.100.10/24]
      routes:
        - to: default
          via: 198.51.100.1
          metric: 200                # higher metric: idle unless A disappears
        - to: default                # the SAME default again, but placed in a
          via: 198.51.100.1          # private routing table used only by the
          table: 101                 # policy rule below
      routing-policy:
        - from: 198.51.100.10        # traffic sourced from uplink B's address
          table: 101                 # consults table 101 -> leaves via B. Done.

# an on-link route, for gateways outside your own prefix:
#      routes:
#        - to: 0.0.0.0/0
#          via: 169.254.0.1          # not inside any local subnet...
#          on-link: true             # ...but reachable directly on this wire
#          (common on cloud VMs and point-to-point links)`,
      lang: "yaml",
      walkthrough: [
        "**Routing is a lookup table, and you can read it.** For every outgoing packet the kernel scans its routing table for the most specific matching prefix — the **CIDR (Classless Inter-Domain Routing)** longest match — and `default` (`0.0.0.0/0`) is simply the least specific entry of all, the catch-all. `ip route` prints the table; stage 4 gave you the one-default case, and this stage is about every case beyond it.",
        "**A static route is three keys.** `to:` is the destination prefix, `via:` is the next-hop router, and optional `metric:` is the tie-breaker when two routes match equally (lower wins — the same mechanism stage 3 used to arbitrate two DHCP leases). The `10.20.0.0/16 via 203.0.113.254` entry in the code is the everyday example: an internal network reachable through a *second* router on your segment that is not your default gateway. Without the route, packets for `10.20.x.x` would wrongly chase the default.",
        "**`on-link` handles the gateway-outside-your-prefix trick.** Normally the kernel refuses a `via:` address it has no route to — the gateway must be inside a connected subnet. Cloud providers and point-to-point links break that assumption: your address might be a `/32` with a gateway like `169.254.0.1` that is on the wire but in no subnet of yours. `on-link: true` tells the kernel 'trust me, this next hop answers ARP directly on this link' and the route installs cleanly.",
        "**Two uplinks: metrics choose the exit, but that's only half the job.** Give both NICs a default route and let `metric:` rank them — A at 100 carries traffic, B at 200 sits idle as a fallback. That solves *outbound* choice. It does not solve the nastier problem: a connection arriving *inbound* on B will, by default, get its replies routed out through A, because A owns the winning default route. The reply leaves with B's source address through A's provider — and providers and stateful firewalls routinely drop such **asymmetric** traffic. Your service on uplink B appears mysteriously half-dead.",
        "**The fix is source-based routing, and it needs two pieces.** Piece one: an extra routing table — the `table: 101` key on a route places it in table 101 instead of the main table, an entirely separate lookup universe (`ip route show table 101` to see it). Piece two: a rule that steers packets into that table. `routing-policy: - from: 198.51.100.10, table: 101` says: any packet *sourced from* uplink B's address skips the main table and consults table 101 — whose only default points out via B. Replies now leave the way the request came in. This from/table pair is the entire recipe; memorise it as one unit.",
        "**Verify with `ip route get` and `ip rule` — don't guess.** `ip rule` lists the policy rules in priority order; yours appears between the default `from all lookup main` entries. `ip route get 1.1.1.1` shows the actual decision for ordinary traffic (via A), and the killer diagnostic is `ip route get 1.1.1.1 from 198.51.100.10`, which shows the decision *for a given source address* — it must say via B. If those two commands give the answers you expect, the setup works; if not, they tell you exactly which piece (rule or table) is missing.",
        "**Apply with the usual paranoia.** Routing changes are the most lock-out-prone edits in this whole course: a wrong default route strands the machine somewhere you can't follow. On anything remote this is a mandatory `sudo netplan try` moment (stage 5) — if your **SSH (Secure Shell)** session's replies start leaving via the wrong uplink, you won't be able to press ENTER, the timeout expires, and the config rolls itself back. That failure mode is precisely the safety net working.",
        "**Know when not to.** Policy routing earns its complexity only when packets must choose paths *by source or by rule* — multi-uplink servers, VPN split-tunnels, answer-where-you-came-from services. A single-uplink host never needs it, and a second table left behind by an old experiment is a superb source of 'why does this box route weirdly' tickets. Simplest table that works, always; the capstone in stage 12 uses exactly one policy rule, and only because its design demands it.",
      ],
      exercise:
        "Build the two-uplink lab in a VM with two NICs (two networks in your hypervisor, or one real plus " +
        "one host-only). Write `80-uplinks.yaml` as in the code block: both defaults with metrics 100 and 200, " +
        "the second default duplicated into `table: 101`, and the `routing-policy` rule keyed on uplink B's " +
        "address. Apply with `sudo netplan try`, then interrogate the result: `ip rule` must show your rule, " +
        "`ip route show table 101` must show B's private default, and `ip route get 1.1.1.1` versus `ip route " +
        "get 1.1.1.1 from <B-address>` must name different uplinks. Finish by writing one sentence explaining " +
        "what would go wrong for inbound connections on B if the rule were deleted.",
      drills: [
        "Run `ip route` and rank every route by specificity — which entry would match a packet to `10.20.30.40`?",
        "Add a static route to a test prefix via `netplan set`, apply, and confirm it with `ip route | grep <prefix>`.",
        "Run `ip route get 1.1.1.1` and then `ip route get 1.1.1.1 from <second-address>` — confirm the chosen device differs.",
        "Run `ip rule` and identify the priority number netplan gave your `routing-policy` entry.",
        "Run `ip route show table 101` and compare it with the main table — note it contains only what you put there.",
      ],
      note:
        "The deprecated `gateway4:` you'll meet in older guides is just a less capable spelling of `routes: " +
        "- to: default` — the modern form exists precisely because real routing needs metrics, tables and " +
        "multiple entries. And metrics only rank *static* preferences; genuine dead-uplink detection and " +
        "failover need a monitoring layer above netplan's remit.",
    },

    /* -------------------------------------------------------------- 12 */
    {
      n: 12,
      title: "Troubleshooting & the capstone",
      tag: "when apply does nothing",
      time: "1–2 days",
      payoff:
        "Two finales in one. First, the debugging ladder — a fixed sequence of commands that finds why a " +
        "netplan config 'applied fine' yet changed nothing, covering every classic failure from a stray tab " +
        "to cloud-init silently overwriting your file. Second, the capstone: a virtualisation host built " +
        "file-by-file — an LACP bond, a VLAN riding the bond, and a bridge on the VLAN carrying the address, " +
        "a custom route and a policy rule. Build it, prove it with `netplan try`, and you have used every " +
        "stage of this course in one working machine.",
      concepts: [
        "the debugging ladder",
        "status → get → --debug generate",
        "/run backend files & journalctl",
        "classic failures: tabs, perms, merge order",
        "cloud-init & the disable file",
        "migrating from ifupdown / raw NM",
        "capstone: bond → VLAN 40 → bridge",
      ],
      code:
`# ---- CAPSTONE: bond (802.3ad) -> VLAN 40 -> bridge, one file per layer ----
# File 1 (60-): the bond. Members and bond carry NO addresses.
sudo tee /etc/netplan/60-bond.yaml > /dev/null <<'EOF'
network:
  version: 2
  renderer: networkd
  ethernets:
    enp3s0: {dhcp4: false}
    enp4s0: {dhcp4: false}
  bonds:
    bond0:
      interfaces: [enp3s0, enp4s0]
      parameters:
        mode: 802.3ad              # needs LACP on the switch ports!
        lacp-rate: fast
        mii-monitor-interval: 100
        transmit-hash-policy: layer3+4
EOF

# File 2 (70-): VLAN 40 rides the bond (stage 8). Still no address.
sudo tee /etc/netplan/70-vlan40.yaml > /dev/null <<'EOF'
network:
  version: 2
  vlans:
    bond0.40: {id: 40, link: bond0}
EOF

# File 3 (80-): the bridge on top owns the ONE address, route and rule.
sudo tee /etc/netplan/80-br40.yaml > /dev/null <<'EOF'
network:
  version: 2
  bridges:
    br40:
      interfaces: [bond0.40]
      addresses: [10.40.0.20/24]
      nameservers: {addresses: [10.40.0.1]}
      routes:
        - {to: default, via: 10.40.0.1}
        - {to: 10.50.0.0/24, via: 10.40.0.254}     # custom static route
        - {to: default, via: 10.40.0.1, table: 140}
      routing-policy:
        - {from: 10.40.0.20, table: 140}           # answer out where you came in
      parameters: {stp: false, forward-delay: 0}
EOF

sudo chmod 600 /etc/netplan/*.yaml
sudo netplan generate              # lint all three files + watch them merge
sudo netplan try --timeout 60      # auto-reverts unless you confirm with ENTER`,
      lang: "bash",
      walkthrough: [
        "**The debugging ladder — climb it in order, every time.** When a config seems ignored: (1) `netplan status --all` — what does netplan believe right now? (2) `netplan get` — did your keys survive the merge, or did another file override them? (3) `sudo netplan --debug generate` — remember `--debug` goes *before* the subcommand — which prints every file parsed, in order, plus exact file-and-line YAML errors. (4) Inspect what was emitted: `ls /run/systemd/network/` for networkd or `/run/NetworkManager/system-connections/` for **NM (NetworkManager)** — if no `10-netplan-*` file mentions your device, the backend was never told. (5) `journalctl -u systemd-networkd -e` (or `-u NetworkManager`) for the backend's own complaints. (6) `networkctl` or `nmcli device` for live device state. Six rungs, and the fault is almost always found by rung three.",
        "**Classic failure #1: the YAML itself.** A tab instead of spaces kills the parse outright (stage 1) — `--debug generate` names the file and line. Subtler and nastier: a *wrong indent* that parses fine but attaches a key to the wrong parent, so `netplan get` shows your route living under the wrong device. And a config file not owned by root with mode `0600` earns a loud permissions warning — `sudo chmod 600 /etc/netplan/*.yaml` is the one-line cure.",
        "**Classic failure #2: another file wins the merge.** Files merge in lexicographic order and later keys override earlier ones (stage 0), so your beautiful `40-lan.yaml` loses silently to a forgotten `99-experiment.yaml` setting the same device. `ls /etc/netplan/ /run/netplan/ 2>/dev/null` then `netplan get` reveals whose value survived. Related: edits made to the *generated* files under `/run/systemd/network/` work for a while, then evaporate on the next `netplan apply` — those files are compiler output, never sources.",
        "**Classic failure #3: cloud-init takes it all back.** On any cloud image, `/etc/netplan/50-cloud-init.yaml` is *owned by cloud-init* and regenerated from instance metadata — your edits to it can vanish on the next boot. Either add your own higher-numbered file, or tell cloud-init to stand down permanently: create `/etc/cloud/cloud.cfg.d/99-disable-network-config.cfg` containing exactly `network: {config: disabled}`, after which `50-cloud-init.yaml` is yours (better: replace it with cleanly named files of your own).",
        "**Migrating an old box.** From classic Debian `ifupdown`: each `/etc/network/interfaces` stanza maps almost mechanically — `address`/`netmask` become one **CIDR (Classless Inter-Domain Routing)** entry in `addresses:`, `gateway` becomes `routes: - to: default`, `dns-nameservers` becomes `nameservers:`. Translate, `generate`, `try`, then disable the old system. And if the migrated box 'loses its reserved IP', that is the stage 3 gotcha: networkd identifies itself to the DHCP server by a DUID (DHCP Unique Identifier) where ifupdown sent the bare MAC, so the router's reservation no longer matches — `dhcp-identifier: mac` restores it. From hand-managed NM connections: `netplan status --all` shows what exists today, and on Ubuntu Desktop 23.10+ NM already writes its connections back as `/etc/netplan/90-NM-*.yaml` (stage 2) — migration mostly means consolidating those into files you actually curate.",
        "**The capstone, layer by layer — read the stack bottom-up.** Physical NICs → `bond0` (stage 9, 802.3ad with fast **LACP — Link Aggregation Control Protocol**) → `bond0.40`, a **VLAN (Virtual LAN)** tagging everything 40 as it crosses the trunk (stage 8) → `br40`, the bridge where guest VMs plug in (stage 10). Only the *top* layer carries identity: address, nameservers, a custom route to `10.50.0.0/24`, and one `routing-policy` rule with its `table: 140` route (stage 11). Every device below is pure plumbing with no address — the rule from stages 9 and 10, now applied twice in one stack.",
        "**Why three files?** One file per layer exploits merge order (stage 0) as a design tool: `60-` bond, `70-` VLAN, `80-` bridge, applied in exactly dependency order and each reviewable, diffable and removable on its own. Renaming `80-br40.yaml` to `80-br40.yaml.off` and re-applying peels just the top layer off — try doing *that* with one monolithic file. This is how production netplan trees are actually organised.",
        "**Prove it with `try`, then verify each layer by hand.** `sudo netplan generate` first — it lints all three files and `--debug` shows the merge happening. Then `sudo netplan try --timeout 60`: if the bond fails to negotiate or the address lands wrong, connectivity dies, you can't confirm, and everything rolls back — the stage 5 net catching a stage 9-11 fall. (One honest caveat from netplan's known-issues page: with virtual devices in the stack, a timed-out `try` is not guaranteed to unwind them cleanly — after any revert, check `ip -br a` and `ip link` and clear leftover bonds or bridges with `ip link delete`, or reboot.) After confirming: `cat /proc/net/bonding/bond0` (LACP converged, both members up), `ip -d link show bond0.40` (`vlan protocol 802.1Q id 40`), `bridge link` (the VLAN is a port of `br40`), `ip -br a` (exactly one address, on `br40`), `ip route` and `ip rule` (custom route and policy rule present). Five commands, five layers, zero doubt.",
        "**Where the guests land.** Attach a VM to `br40` (stage 10) and it transparently joins VLAN 40: its frames enter the bridge, get tagged at `bond0.40`, and ride the LACP bond out through both trunk ports. Guest traffic is isolated to VLAN 40, load-balanced across two cables, and survives either cable dying — the entire course, working as one machine. In a home lab without an LACP-capable switch, substitute `mode: active-backup` in file 1 and everything else stands unchanged.",
      ],
      exercise:
        "Build the capstone and prove it with the full ritual, in a VM with two NICs so nothing real can " +
        "break. Write the three files exactly as in the code block (swap the bond to `active-backup` if no " +
        "LACP switch is available), `chmod 600` them, and run `sudo netplan --debug generate`, reading the " +
        "debug output to watch the three files merge in 60/70/80 order. Apply with `sudo netplan try " +
        "--timeout 60` and — before pressing ENTER — verify from a second terminal: `ip -br a` shows the one " +
        "address on `br40`, `ping 10.40.0.1` answers, and `ip rule` lists the policy rule; only then confirm. " +
        "Walk the stack with `/proc/net/bonding/bond0`, `ip -d link show bond0.40` and `bridge link`, then " +
        "test failover by downing one bond member while pinging the gateway. Finally, deliberately break one " +
        "thing — add a tab to file 2, or chmod file 3 to 644, or create a rogue `99-test.yaml` overriding the " +
        "bridge address — and use the debugging ladder to identify it, citing the exact command and output " +
        "that gave it away.",
      drills: [
        "Run `sudo netplan --debug generate` on a healthy config and find the lines showing each file being parsed in merge order.",
        "Put a tab character in a test YAML file, run `netplan generate`, and read the file-and-line error it reports.",
        "Create `/etc/netplan/99-test.yaml` overriding one address, prove the hijack with `netplan get`, then delete it and re-apply.",
        "Run `ls /run/systemd/network/` and match each `10-netplan-*` file to the device in your YAML that produced it.",
        "On a cloud image, read `/etc/netplan/50-cloud-init.yaml` and its header comment, then write (but do not deploy) the 99-disable-network-config.cfg that would retire it.",
      ],
      note:
        "The ladder's real lesson is that netplan failures are *layered*: YAML errors die at `generate`, " +
        "merge surprises show in `get`, backend refusals show in `journalctl`, and only genuine network " +
        "problems remain after all three are clean. Keep the capstone VM around — it is a complete rehearsal " +
        "environment for any change you'll ever make to a production Ubuntu box, and `netplan try` makes " +
        "every experiment on it free.",
    },
  ],
};
/* =====================================================================
   Netplan — interactive labs (self-registering).
   Headline lab: the YAML → network pipeline.
   Mini-labs: at 1 (indentation puzzles), at 5 (netplan try, simulated).
   Pure DOM, no libraries — same contract as viz.js / labs.js.
   ===================================================================== */
(() => {
  "use strict";

  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;");
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = (s) => esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

  const VIZ  = window.COURSE_VIZ      = window.COURSE_VIZ      || {};
  const LABS = window.COURSE_MINILABS = window.COURSE_MINILABS || {};

  // hand-coloured YAML: keys in accent, comments dimmed
  function yamlHtml(y) {
    return y.split("\n").map((ln) => {
      if (/^\s*#/.test(ln))
        return `<span style="color:var(--text-muted)">${esc(ln)}</span>`;
      const ci = ln.indexOf(" #");
      const body = ci >= 0 ? ln.slice(0, ci) : ln;
      const com = ci >= 0
        ? `<span style="color:var(--text-muted)">${esc(ln.slice(ci))}</span>` : "";
      const m = body.match(/^(\s*-?\s*)([^:\s][^:]*):(\s.*|)$/);
      if (m)
        return esc(m[1]) +
          `<span style="color:var(--accent)">${esc(m[2])}</span>:` + esc(m[3]) + com;
      return esc(body) + com;
    }).join("\n");
  }

  /* =================================================================
     HEADLINE — the YAML → network pipeline
     ================================================================= */
  VIZ["netplan"] = {
    title: "The YAML → network pipeline",
    blurb:
      "One file in `/etc/netplan`, one renderer, one network. Pick a **scenario**, flip its " +
      "options and the **renderer**, and watch three things update live: the exact YAML you " +
      "would write, the backend files `netplan generate` would emit into `/run`, and a " +
      "narrator explaining the last change. Every YAML shown here is valid netplan v2 — " +
      "paste it into a VM and `netplan try` it for real.",
    mount(host) {

      const SCEN = {
        dhcp: {
          label: "DHCP laptop",
          toggles: [
            { id: "macid",  label: "dhcp-identifier: mac" },
            { id: "owndns", label: "override lease DNS" },
          ],
          intro:
            "the simplest useful netplan file: one wired interface, `dhcp4: true`, everything " +
            "else from the lease. Stage 3 territory — try the two overrides.",
          msgs: {
            macid_on:  "`dhcp-identifier: mac` makes the client lease **by MAC address**, the way old ifupdown did — handy when your DHCP server has a reservation keyed to the MAC and the default duid identifier keeps getting a different address.",
            macid_off: "back to the default **duid** identifier — fine for most networks, surprising only when a MAC-keyed reservation exists on the server.",
            owndns_on: "`dhcp4-overrides: use-dns: false` keeps the address and route from the lease but **refuses its DNS servers**; the `nameservers:` block supplies your own instead. The lease is a bundle — overrides let you unbundle it (stage 3).",
            owndns_off: "DNS comes from the lease again — the whole bundle, exactly as the DHCP server hands it out.",
          },
          build(t) {
            let y = "";
            y += "  ethernets:\n";
            y += "    enp3s0:\n";
            y += "      dhcp4: true\n";
            if (t.macid)
              y += "      # lease by MAC, like ifupdown did\n" +
                   "      dhcp-identifier: mac\n";
            if (t.owndns)
              y += "      # take the address, refuse the lease's DNS\n" +
                   "      dhcp4-overrides:\n" +
                   "        use-dns: false\n" +
                   "      nameservers:\n" +
                   "        addresses: [1.1.1.1, 9.9.9.9]\n";
            return { yaml: y, devices: ["enp3s0"] };
          },
        },

        static: {
          label: "Static server",
          toggles: [
            { id: "dns2",  label: "second nameserver" },
            { id: "route", label: "extra route" },
          ],
          intro:
            "a server with an address you chose: CIDR address, the **modern default route** " +
            "(`routes: to: default` — never `gateway4`, that's deprecated), and explicit DNS. " +
            "Stage 4 in one file.",
          msgs: {
            dns2_on:  "a second resolver joined the `addresses:` list — resolvers are tried in order, so the first is primary and the second is the fallback when it times out.",
            dns2_off: "one resolver only. Fine until it goes down — production boxes want two.",
            route_on: "an **extra static route**: traffic for `10.10.0.0/16` now leaves via `192.0.2.254` instead of the default gateway. Stage 11 covers routes in full, including metrics and policy rules.",
            route_off: "back to just the default route — everything non-local leaves via `192.0.2.1`.",
          },
          build(t) {
            let y = "";
            y += "  ethernets:\n";
            y += "    enp3s0:\n";
            y += "      # /24 = netmask 255.255.255.0\n";
            y += "      addresses: [192.0.2.20/24]\n";
            y += "      routes:\n";
            y += "        - to: default\n";
            y += "          via: 192.0.2.1\n";
            if (t.route)
              y += "        # branch-office subnet via a second router\n" +
                   "        - to: 10.10.0.0/16\n" +
                   "          via: 192.0.2.254\n";
            y += "      nameservers:\n";
            y += t.dns2
              ? "        addresses: [192.0.2.53, 9.9.9.9]\n"
              : "        addresses: [192.0.2.53]\n";
            y += "        search: [lab.lan]\n";
            return { yaml: y, devices: ["enp3s0"] };
          },
        },

        bond: {
          label: "Bond + VLAN",
          toggles: [
            { id: "lacp", label: "mode: 802.3ad (else active-backup)" },
            { id: "vlan", label: "VLAN 40 on the bond" },
          ],
          intro:
            "two NICs fused into `bond0` — the members carry **no addresses**, the bond does. " +
            "Stages 8 and 9, stacked the way the stage-12 capstone stacks them.",
          msgs: {
            lacp_on:  "**802.3ad (LACP)** aggregates bandwidth as well as surviving failures — but it only works if the **switch ports are configured as an LACP group too**. `lacp-rate: fast` and a layer3+4 hash policy spread flows across both links (stage 9).",
            lacp_off: "**active-backup** needs nothing from the switch: one member carries traffic, the other waits. The safe default for unmanaged switches; `primary:` names the preferred member.",
            vlan_on:  "the address moved **up one layer**: `bond0.40` is an 802.1Q VLAN riding the bond (`id: 40, link: bond0`), and it owns the IP now. One wire-pair, many networks — stage 8.",
            vlan_off: "no VLAN — the bond itself carries the address again, untagged traffic only.",
          },
          build(t) {
            let y = "";
            y += "  ethernets:\n";
            y += "    # members hold no addresses - the bond does\n";
            y += "    enp3s0: {}\n";
            y += "    enp4s0: {}\n";
            y += "  bonds:\n";
            y += "    bond0:\n";
            y += "      interfaces: [enp3s0, enp4s0]\n";
            y += "      parameters:\n";
            if (t.lacp) {
              y += "        # needs LACP configured switch-side\n";
              y += "        mode: 802.3ad\n";
              y += "        lacp-rate: fast\n";
              y += "        transmit-hash-policy: layer3+4\n";
            } else {
              y += "        mode: active-backup\n";
              y += "        primary: enp3s0\n";
            }
            y += "        mii-monitor-interval: 100\n";
            if (t.vlan) {
              y += "  vlans:\n";
              y += "    bond0.40:\n";
              y += "      id: 40\n";
              y += "      link: bond0\n";
              y += "      addresses: [10.40.0.20/24]\n";
            } else {
              y += "      addresses: [10.40.0.20/24]\n";
            }
            const d = ["enp3s0", "enp4s0", "bond0"];
            const v = ["bond0"];
            if (t.vlan) { d.push("bond0.40"); v.push("bond0.40"); }
            return { yaml: y, devices: d, virtual: v };
          },
        },

        bridge: {
          label: "VM-host bridge",
          toggles: [
            { id: "stp",   label: "STP + forward-delay" },
            { id: "port2", label: "second port NIC" },
          ],
          intro:
            "the classic VM-host pattern from stage 10: `br0` is a **software switch** that " +
            "owns the IP; `enp3s0` is just a port in it and carries no address of its own. " +
            "VMs and containers plug their virtual NICs into `br0` and sit on the LAN as peers.",
          msgs: {
            stp_on:  "**STP (Spanning Tree Protocol)** on: the bridge will detect and block loops, at the price of `forward-delay` seconds of listening before it forwards. Cheap insurance the moment a bridge has more than one physical port.",
            stp_off: "STP off — fine for a single-port VM bridge where a loop is impossible, and the bridge starts forwarding immediately.",
            port2_on: "a **second physical port** joined the bridge — now `br0` really is a two-port switch, and a cable mistake between those ports could loop the LAN. This is exactly when you want STP on.",
            port2_off: "one physical port again — the common VM-host shape.",
          },
          build(t) {
            let y = "";
            y += "  ethernets:\n";
            y += "    # ports carry no address - the bridge does\n";
            y += "    enp3s0: {}\n";
            if (t.port2) y += "    enp4s0: {}\n";
            y += "  bridges:\n";
            y += "    br0:\n";
            y += t.port2
              ? "      interfaces: [enp3s0, enp4s0]\n"
              : "      interfaces: [enp3s0]\n";
            y += "      addresses: [192.0.2.40/24]\n";
            y += "      routes:\n";
            y += "        - to: default\n";
            y += "          via: 192.0.2.1\n";
            y += "      nameservers:\n";
            y += "        addresses: [192.0.2.53]\n";
            if (t.stp) {
              y += "      parameters:\n";
              y += "        stp: true\n";
              y += "        forward-delay: 4\n";
            }
            const d = ["enp3s0"];
            if (t.port2) d.push("enp4s0");
            d.push("br0");
            return { yaml: y, devices: d, virtual: ["br0"] };
          },
        },

        wifi: {
          label: "Wi-Fi",
          toggles: [
            { id: "hidden", label: "hidden SSID" },
            { id: "static", label: "static address" },
          ],
          intro:
            "headless wireless from a YAML file (stage 7): a `wifis:` block with an " +
            "`access-points:` map. Under networkd, netplan also generates and starts a " +
            "**wpa_supplicant** service for the interface — watch the emitted-files pane.",
          msgs: {
            hidden_on:  "`hidden: true` makes the client **probe actively** for the SSID instead of waiting for beacons — required for hidden networks, and a small privacy leak everywhere else, since the laptop now shouts the name wherever it roams.",
            hidden_off: "back to a broadcast SSID — passive scanning, no probing.",
            static_on:  "static addressing works identically on wireless: `addresses`, a default route, DNS. Useful for a headless sensor that must always answer on the same IP.",
            static_off: "back to DHCP — the sensible default for anything that roams.",
          },
          build(t) {
            let y = "";
            y += "  wifis:\n";
            y += "    wlp2s0:\n";
            if (t.static) {
              y += "      addresses: [192.0.2.60/24]\n";
              y += "      routes:\n";
              y += "        - to: default\n";
              y += "          via: 192.0.2.1\n";
              y += "      nameservers:\n";
              y += "        addresses: [192.0.2.53]\n";
            } else {
              y += "      dhcp4: true\n";
            }
            y += "      access-points:\n";
            y += "        \"home-lab\":\n";
            y += "          password: \"correct-horse-battery\"\n";
            if (t.hidden)
              y += "          # probe actively - SSID not broadcast\n" +
                   "          hidden: true\n";
            return { yaml: y, devices: ["wlp2s0"], wifi: true };
          },
        },
      };

      const ORDER = ["dhcp", "static", "bond", "bridge", "wifi"];
      let st = { scen: "dhcp", renderer: "networkd", t: {}, msg: SCEN.dhcp.intro };

      host.innerHTML = `
        <div class="viz npviz">
          <div class="viz-ctrls wrap">
            <span class="gnu-slot-name">scenario</span>
            ${ORDER.map((k) =>
              `<button class="viz-btn mono" data-s="${k}">${esc(SCEN[k].label)}</button>`).join("")}
          </div>
          <div class="viz-ctrls wrap">
            <span class="gnu-slot-name">renderer</span>
            <button class="viz-btn mono" data-rd="networkd">networkd</button>
            <button class="viz-btn mono" data-rd="NetworkManager">NetworkManager</button>
            <span class="gnu-slot-name" style="margin-left:12px">options</span>
            <span data-r="toggles" style="display:contents"></span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>/etc/netplan/50-lab.yaml</code><span>what you write</span></div>
              <pre class="gnu-pane-b" data-r="yaml" style="max-height:420px"></pre>
            </div>
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>netplan generate</code><span>what the backend gets</span></div>
              <pre class="gnu-pane-b" data-r="gen" style="max-height:420px"></pre>
            </div>
          </div>
          <p class="asm-msg" data-r="msg"></p>
        </div>`;

      function paint() {
        const sc = SCEN[st.scen];
        const out = sc.build(st.t);

        $$("[data-s]", host).forEach((b) => b.classList.toggle("on", b.dataset.s === st.scen));
        $$("[data-rd]", host).forEach((b) => b.classList.toggle("on", b.dataset.rd === st.renderer));
        $('[data-r="toggles"]', host).innerHTML = sc.toggles.map((t) =>
          `<button class="viz-btn mono ${st.t[t.id] ? "on" : ""}" data-t="${t.id}">${esc(t.label)}</button>`).join("");

        const yaml =
          "network:\n" +
          "  version: 2\n" +
          "  renderer: " + st.renderer + "\n" +
          out.yaml;
        $('[data-r="yaml"]', host).innerHTML = yamlHtml(yaml);

        let gen;
        if (st.renderer === "networkd") {
          const virt = out.virtual || [];
          gen = out.devices.map((d) => {
            const base = "/run/systemd/network/10-netplan-" + d;
            // virtual devices (bonds, bridges, VLANs) also need a .netdev
            // unit telling networkd to CREATE the device, not just address it
            return virt.includes(d)
              ? base + ".netdev\n" + base + ".network"
              : base + ".network";
          }).join("\n");
          if (out.wifi)
            gen += "\n/run/netplan/wpa-wlp2s0.conf\n(+ netplan-wpa-wlp2s0.service started)";
        } else {
          gen = out.devices.map((d) =>
            "/run/NetworkManager/system-connections/netplan-" + d + ".nmconnection").join("\n");
        }
        $('[data-r="gen"]', host).innerHTML = esc(gen) +
          `\n<span style="color:var(--text-muted)">regenerated on every apply - never hand-edit these</span>`;

        $('[data-r="msg"]', host).innerHTML = fmt(st.msg);
      }

      host.addEventListener("click", (e) => {
        const s = e.target.closest("[data-s]");
        const rd = e.target.closest("[data-rd]");
        const tg = e.target.closest("[data-t]");
        if (s) {
          st.scen = s.dataset.s;
          st.t = {};
          st.msg = SCEN[st.scen].intro;
        } else if (rd) {
          if (st.renderer !== rd.dataset.rd) {
            st.renderer = rd.dataset.rd;
            st.msg = st.renderer === "networkd"
              ? "renderer → **systemd-networkd**: generate now writes `.network` units into `/run/systemd/network/` — one per device. The server default on Ubuntu; headless, no daemon beyond systemd itself (stage 2)."
              : "renderer → **NetworkManager**: generate now writes **keyfiles** into `/run/NetworkManager/system-connections/` and hands the devices to NM — the desktop default, built for roaming and `nmcli` (stage 2). Same YAML, different backend.";
          }
        } else if (tg) {
          const id = tg.dataset.t;
          st.t[id] = !st.t[id];
          st.msg = SCEN[st.scen].msgs[id + (st.t[id] ? "_on" : "_off")] || "";
        } else return;
        paint();
      });

      paint();
    },
  };

  /* =================================================================
     MINI-LABS
     ================================================================= */
  LABS["netplan"] = [

    /* ---- at 1: indentation is the syntax -------------------------- */
    {
      at: 1,
      title: "Indentation is the syntax",
      blurb:
        "Five short netplan files, each hiding **exactly one flaw** — a tab, a key indented " +
        "under the wrong parent, a missing colon, an unquoted word YAML reads as a boolean. " +
        "Click the faulty line; the narrator explains why it is wrong and what `netplan " +
        "generate` would say. A tab character is drawn as `⇥` so you can spot it.",
      mount(host) {
        const PUZZLES = [
          {
            goal: "DHCP on enp3s0 — but one line is indented with a tab",
            lines: [
              { t: "network:" },
              { t: "  version: 2" },
              { t: "  ethernets:" },
              { t: "    enp3s0:" },
              { t: "⇥dhcp4: true", bad: true },
            ],
            why:
              "that indent is a **tab** (drawn `⇥`) — and YAML forbids tabs for indentation, " +
              "full stop. It does not matter that it 'lines up' in your editor: the parser " +
              "rejects the whole file. Spaces only, two per level.",
            gen: "found character '\\t' that cannot start any token",
          },
          {
            goal: "DHCP plus your own DNS — but one key sits under the wrong parent",
            lines: [
              { t: "network:" },
              { t: "  version: 2" },
              { t: "  ethernets:" },
              { t: "    enp3s0:" },
              { t: "      dhcp4: true" },
              { t: "    nameservers:", bad: true },
              { t: "      addresses: [1.1.1.1]" },
            ],
            why:
              "at four spaces, `nameservers:` is a **sibling of enp3s0** — so netplan reads " +
              "it as a second Ethernet device literally named 'nameservers', with an " +
              "`addresses:` list of its own. Perfectly parseable YAML, completely wrong " +
              "meaning. It needed six spaces to sit inside `enp3s0`.",
            gen: "error in network definition: address '1.1.1.1' is missing /prefixlength",
          },
          {
            goal: "the minimal skeleton — but one line lost its colon",
            lines: [
              { t: "network:" },
              { t: "  version 2", bad: true },
              { t: "  ethernets:" },
              { t: "    enp3s0:" },
              { t: "      dhcp4: true" },
            ],
            why:
              "`version 2` has **no colon**, so it is not a key–value pair — YAML chokes " +
              "the moment the next line tries to open a mapping alongside it. Every " +
              "mapping entry is `key: value`, and the space after the colon matters too.",
            gen: "could not find expected ':' (yaml parse error, with file and line)",
          },
          {
            goal: "Wi-Fi with a password — but YAML has opinions about one value",
            lines: [
              { t: "network:" },
              { t: "  version: 2" },
              { t: "  wifis:" },
              { t: "    wlp2s0:" },
              { t: "      dhcp4: true" },
              { t: "      access-points:" },
              { t: "        \"cafe-guest\":" },
              { t: "          password: no", bad: true },
            ],
            why:
              "unquoted `no` is, to YAML 1.1, the **boolean false** (same trap as `yes`, " +
              "`on`, `off`). Netplan itself gets away with it — string fields like " +
              "passwords take the scalar's raw text, so the file passes — but any other " +
              "YAML tool that reads this file sees a boolean, not your password. Quote " +
              "it: `password: \"no\"` — defensive quoting costs nothing and keeps every " +
              "parser honest.",
            gen: "no error at all — the sneakiest kind of flaw, and exactly why you quote defensively",
          },
          {
            goal: "two NICs on DHCP — but one device escaped its section",
            lines: [
              { t: "network:" },
              { t: "  version: 2" },
              { t: "  ethernets:" },
              { t: "    enp3s0:" },
              { t: "      dhcp4: true" },
              { t: "  enp4s0:", bad: true },
              { t: "    dhcp4: true" },
            ],
            why:
              "at two spaces, `enp4s0:` is a **top-level key beside ethernets**, not a " +
              "device inside it — and netplan has no idea what a top-level 'enp4s0' is. " +
              "Two missing spaces silently changed which parent owns the key; this is the " +
              "single most common netplan mistake.",
            gen: "unknown key 'enp4s0'",
          },
        ];

        let st = { i: 0, solved: false, score: 0, misses: 0, done: [], msg: "" };
        st.msg = "read the file, then **click the one faulty line**.";

        host.innerHTML = `
          <div class="viz npindent">
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name" data-r="goal" style="text-transform:none;letter-spacing:0;font-size:.72rem"></span>
              <span class="viz-status" data-r="score"></span>
            </div>
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>/etc/netplan/50-lab.yaml</code><span>click the faulty line</span></div>
              <div class="gnu-pane-b" data-r="lines" style="max-height:none"></div>
            </div>
            <div class="viz-ctrls" style="margin-top:12px">
              <button class="viz-btn" data-a="next" disabled>next puzzle ▸</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
            </div>
            <p class="asm-msg" data-r="msg"></p>
          </div>`;

        function paint() {
          const p = PUZZLES[st.i];
          $('[data-r="goal"]', host).textContent =
            "puzzle " + (st.i + 1) + " of " + PUZZLES.length + " — " + p.goal;
          $('[data-r="lines"]', host).innerHTML = p.lines.map((ln, i) => {
            const revealed = st.solved && ln.bad;
            return `<div class="el-item" data-l="${i}" style="cursor:${st.solved ? "default" : "pointer"};margin-bottom:4px;white-space:pre;${revealed ? "border-color:var(--live);color:var(--live);" : ""}">${esc(ln.t)}</div>`;
          }).join("");
          $('[data-r="score"]', host).textContent =
            "solved " + st.score + "/" + PUZZLES.length + " · wrong clicks " + st.misses;
          $('[data-a="next"]', host).disabled = !st.solved;
          $('[data-r="msg"]', host).innerHTML = fmt(st.msg);
        }

        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-a]");
          if (b) {
            if (b.dataset.a === "reset") {
              st = { i: 0, solved: false, score: 0, misses: 0, done: [],
                     msg: "fresh start — **click the one faulty line**." };
              paint(); return;
            }
            if (b.dataset.a === "next" && st.solved) {
              st.i = (st.i + 1) % PUZZLES.length;
              st.solved = false;
              st.msg = st.i === 0 && st.score >= PUZZLES.length
                ? "full circle — all five flaws found. Notice the pattern: **YAML rarely refuses a wrong indent**, it just quietly means something else. `netplan generate` is your linter; run it after every edit."
                : "new file, new flaw — **click the faulty line**.";
              paint(); return;
            }
            return;
          }
          const li = e.target.closest("[data-l]");
          if (!li || st.solved) return;
          const p = PUZZLES[st.i];
          const ln = p.lines[+li.dataset.l];
          if (ln.bad) {
            st.solved = true;
            if (!st.done.includes(st.i)) { st.done.push(st.i); st.score++; }
            st.msg = p.why + " `netplan generate` reports: **" + p.gen + "**";
          } else {
            st.misses++;
            st.msg = "line " + (+li.dataset.l + 1) + " is fine — right depth, right parent, " +
                     "valid syntax. Look again: check every indent, every colon, and any " +
                     "unquoted word YAML might reinterpret.";
          }
          paint();
        });

        paint();
      },
    },

    /* ---- at 5: netplan try, simulated ----------------------------- */
    {
      at: 5,
      title: "netplan try, simulated",
      blurb:
        "You are on **SSH** to a remote server. Pick one of two edits — a harmless DNS " +
        "change, or a gateway typo that would cut your own connection — then run `netplan " +
        "try` and watch the countdown (compressed to 12 s here; the real default is 120 s). " +
        "With the safe edit you can confirm; with the bad one you **cannot press ENTER on a " +
        "dead session** — and that is exactly why the auto-revert saves the box.",
      mount(host) {
        const LIVE0 = { gw: "192.0.2.1", dns: "192.0.2.53", ssh: true };
        const EDITS = {
          safe: {
            label: "edit A - point DNS at 9.9.9.9",
            yaml: "      nameservers:\n        addresses: [9.9.9.9]",
            apply: (l) => { l.dns = "9.9.9.9"; },
            pick: "a DNS swap: routing untouched, so your SSH session will survive the trial. Now run **netplan try**.",
          },
          bad: {
            label: "edit B - gateway typo .11 for .1",
            yaml: "      routes:\n        - to: default\n          via: 192.0.2.11   # typo!",
            apply: (l) => { l.gw = "192.0.2.11"; l.ssh = false; },
            pick: "a fat-fingered gateway: `192.0.2.11` does not exist. The moment this applies, every reply packet — **including your SSH session's** — heads into a void. Run **netplan try** and see why it beats `apply`.",
          },
        };
        let st, timer = null;
        const stopTimer = () => { if (timer !== null) { clearInterval(timer); timer = null; } };
        const fresh = () => ({
          edit: null, phase: "idle", left: 0, live: { ...LIVE0 },
          msg: "pick an edit, then run `netplan try`. On a remote box this ritual is **non-negotiable** — a bare `netplan apply` with a bad route means a drive to the data centre.",
        });
        st = fresh();

        host.innerHTML = `
          <div class="viz nptry">
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">edit</span>
              <button class="viz-btn mono" data-e="safe">${esc(EDITS.safe.label)}</button>
              <button class="viz-btn mono" data-e="bad">${esc(EDITS.bad.label)}</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px">
              <div class="gnu-pane">
                <div class="gnu-pane-h"><code>proposed change</code><span>the edited lines</span></div>
                <pre class="gnu-pane-b" data-r="prop"></pre>
              </div>
              <div class="gnu-pane">
                <div class="gnu-pane-h"><code>live on the server</code><span>and your session</span></div>
                <pre class="gnu-pane-b" data-r="live"></pre>
              </div>
            </div>
            <div class="viz-ctrls wrap" style="margin-top:12px">
              <button class="viz-btn mono primary" data-a="try" disabled>sudo netplan try --timeout 12</button>
              <button class="viz-btn mono" data-a="confirm" disabled>press ENTER to confirm</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <p class="asm-msg" data-r="msg"></p>
          </div>`;

        function paint() {
          if (!host.isConnected) { stopTimer(); return; }
          const trying = st.phase === "trying";
          $$("[data-e]", host).forEach((b) => {
            b.classList.toggle("on", b.dataset.e === st.edit);
            b.disabled = trying;
          });
          $('[data-r="prop"]', host).innerHTML = st.edit
            ? yamlHtml(EDITS[st.edit].yaml)
            : '<span style="color:var(--text-muted)">no edit selected</span>';
          $('[data-r="live"]', host).innerHTML =
            "default route via " + esc(st.live.gw) + "\n" +
            "DNS              " + esc(st.live.dns) + "\n" +
            (st.live.ssh
              ? '<span style="color:var(--ok,#22c55e)">ssh session: connected</span>'
              : '<span style="color:var(--live,#ef4444)">ssh session: FROZEN - no route back to you</span>');
          $('[data-a="try"]', host).disabled = !st.edit || trying;
          $('[data-a="confirm"]', host).disabled = !(trying && st.live.ssh);
          const stat = $('[data-r="stat"]', host);
          stat.classList.toggle("err", trying && !st.live.ssh);
          stat.textContent = trying
            ? "reverting in " + st.left + " s unless confirmed"
            : st.phase === "kept" ? "change confirmed - config kept"
            : st.phase === "reverted" ? "timed out - config reverted"
            : "";
          $('[data-r="msg"]', host).innerHTML = fmt(st.msg);
        }

        function startTry() {
          stopTimer();
          st.phase = "trying";
          st.left = 12;
          EDITS[st.edit].apply(st.live);
          st.msg = st.live.ssh
            ? "`netplan try` applied the change **provisionally** and started the countdown. Everything still works, so you can press ENTER — and if you could not, the revert would rescue you. (Real default: 120 s.)"
            : "the change applied — and your **SSH session froze mid-keystroke**: replies now chase a gateway that does not exist. You cannot press ENTER on a dead session, so the confirm button is out of reach. Nothing to do but wait for the safety net.";
          timer = setInterval(() => {
            if (!host.isConnected) { stopTimer(); return; }
            st.left--;
            if (st.left <= 0) {
              stopTimer();
              st.phase = "reverted";
              st.live = { ...LIVE0 };
              st.msg = st.edit === "bad"
                ? "**timeout — netplan reverted the config**, the old gateway came back, and your SSH session thawed as if nothing happened. That was `netplan try` earning its keep: the same typo under bare `netplan apply` is a locked-out server and a long drive."
                : "timeout — you never confirmed, so netplan reverted even this harmless change. `try` treats **silence as failure**: only an explicit ENTER keeps a config.";
            }
            paint();
          }, 1000);
          paint();
        }

        host.addEventListener("click", (e) => {
          const eb = e.target.closest("[data-e]");
          const ab = e.target.closest("[data-a]");
          if (eb && !eb.disabled) {
            st.edit = eb.dataset.e;
            st.phase = "idle";
            st.live = { ...LIVE0 };
            st.msg = EDITS[st.edit].pick;
            paint(); return;
          }
          if (!ab || ab.disabled) return;
          if (ab.dataset.a === "reset") { stopTimer(); st = fresh(); paint(); return; }
          if (ab.dataset.a === "try" && st.edit && st.phase !== "trying") { startTry(); return; }
          if (ab.dataset.a === "confirm" && st.phase === "trying" && st.live.ssh) {
            stopTimer();
            st.phase = "kept";
            st.msg = "ENTER received — netplan **kept the new config** and cancelled the revert. This is the full remote ritual from stage 5: edit → `netplan generate` → `netplan try` → confirm only after you have proved the box still answers.";
            paint();
          }
        });

        paint();
      },
    },
  ];
})();
