/* =====================================================================
   Carino Learn — course: LINUX  (Red Hat family: Fedora, CentOS Stream, RHEL)
   Goal: take a comfortable-in-the-terminal beginner and turn them into
   someone who can confidently administer a Red Hat-family Linux system.
   Written for someone who knows `cd`, `ls` and editing a file, but has
   never managed users, packages, services, logs, networking or SELinux:
   every stage has a hands-on `walkthrough` and small `drills`.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["linux"] = {
  id: "linux",
  title: "Linux",
  tag: "Fedora · CentOS · RHEL",
  icon: "server",
  blurb: "Administer the Red Hat family with dnf, systemd, firewalld and SELinux.",
  intro:
    "This is hands-on Linux system administration for the Red Hat family — Fedora on your " +
    "laptop, CentOS Stream and RHEL on servers. Twelve practical stages take you from 'where " +
    "do files live?' to installing packages, running services with systemd, reading logs, " +
    "configuring the network and firewall, taming SELinux and provisioning a real service. " +
    "You only need to be comfortable typing commands; no prior administration assumed.",
  meta: [["Family", "RHEL / Fedora"], ["Pkg mgr", "dnf / rpm"], ["Init", "systemd"]],

  tracks: [
    { id: "ground", label: "Getting your bearings", stages: [0, 1, 2] },
    { id: "system", label: "Running the system",    stages: [3, 4, 5, 6] },
    { id: "admin",  label: "Administering it",       stages: [7, 8, 9, 10, 11] },
  ],

  reference: [
    {
      kind: "table",
      title: "Old tool → new tool (the Red Hat way)",
      head: ["if a guide says…", "you should run…", "what it does"],
      rows: [
        ["yum install", "dnf install", "install a package"],
        ["service x start", "systemctl start x", "start a service now"],
        ["chkconfig x on", "systemctl enable x", "start it at every boot"],
        ["iptables", "firewall-cmd (firewalld)", "manage the firewall"],
        ["ifconfig", "ip addr / nmcli", "view & set up networking"],
        ["route", "ip route", "view the routing table"],
        ["netstat", "ss", "list sockets & ports"],
      ],
      foot: "Old commands sometimes still work, but the right-hand column is what to learn.",
    },
    {
      kind: "table",
      title: "The systemctl verbs you will use daily",
      head: ["verb", "what it does"],
      rows: [
        ["status", "show if a service is running, plus recent log lines"],
        ["start / stop", "run or halt the service right now (not persistent)"],
        ["restart", "stop then start (apply new config)"],
        ["reload", "re-read config without dropping connections (if supported)"],
        ["enable / disable", "turn on / off automatic start at boot"],
        ["enable --now", "enable at boot AND start immediately"],
        ["mask", "forbid a service from ever starting (stronger than disable)"],
      ],
    },
    {
      kind: "cmds",
      title: "Essential one-liners",
      rows: [
        ["Install & start a service", "sudo dnf install -y httpd && sudo systemctl enable --now httpd"],
        ["What broke? (last boot)", "journalctl -b -p err"],
        ["Follow a service's logs", "journalctl -u sshd -f"],
        ["Who owns this file?", "rpm -qf /usr/bin/ssh"],
        ["What provides a missing command?", "dnf provides '*/bin/htop'"],
        ["Open a port in the firewall", "sudo firewall-cmd --add-service=http --permanent && sudo firewall-cmd --reload"],
        ["Is SELinux blocking me?", "sudo ausearch -m AVC -ts recent"],
      ],
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "The Red Hat family & the filesystem",
      tag: "the lay of the land",
      time: "1–2 hrs",
      payoff:
        "Before you change anything, you need a map: which distribution you're on, how Fedora, " +
        "CentOS Stream and RHEL relate, and where the system keeps its files. Linux puts things " +
        "in predictable places (the Filesystem Hierarchy Standard), so once you learn the map " +
        "you can find any config, log or program on any Red Hat-family machine.",
      concepts: [
        "Fedora vs CentOS Stream vs RHEL",
        "/etc /var /usr /home (the FHS)",
        "/etc/os-release",
        "uname -r",
        "everything is a file",
      ],
      code:
`# Which distro and version am I actually on?
cat /etc/os-release        # NAME, VERSION_ID, ID (fedora / centos / rhel)

# Kernel version and machine architecture
uname -r                   # e.g. 6.8.10-300.fc40.x86_64
uname -m                   # x86_64 / aarch64

# Walk the most important top-level directories
ls /etc                    # system-wide configuration files
ls /var/log                # logs the system writes as it runs
ls /usr/bin                # the programs (commands) you run
ls /home                   # one folder per human user

# Where am I, and what is this thing?
pwd                        # print working directory
file /usr/bin/ls           # ask what a file actually is`,
      lang: "bash",
      walkthrough: [
        "**The family tree.** **Fedora** is the fast-moving upstream where new ideas land first — great on a laptop. **CentOS Stream** is the rolling preview of the *next* RHEL. **RHEL** (Red Hat Enterprise Linux) is the stable, supported, paid product companies run in production. They share the same DNA: `dnf`, `rpm`, `systemd`, `firewalld`, SELinux. Learn one and you can drive all three.",
        "**`cat /etc/os-release`** prints machine-readable lines describing the OS. The **`ID`** field (`fedora`, `centos`, `rhel`) and **`VERSION_ID`** are the reliable way to know what you're on — far better than guessing.",
        "**`uname -r`** prints the running *kernel* version. The tail like `.fc40` or `.el9` even tells you the distro (`fc` = Fedora, `el` = Enterprise Linux). **`uname -m`** prints the CPU architecture.",
        "**`/etc`** holds configuration — almost every setting on the system is a plain text file under here. It's pronounced 'etsy' or 'et-see'. You will spend a lot of time in `/etc`.",
        "**`/var`** holds *variable* data the system writes while running: **`/var/log`** (logs), spool files, databases. When something misbehaves, `/var/log` is where the evidence is.",
        "**`/usr`** holds the installed software: **`/usr/bin`** the commands, `/usr/lib` their libraries, `/usr/share` their data. **`/home`** holds each user's personal files, one directory per person.",
        "**`file /usr/bin/ls`** asks 'what kind of thing is this?'. On Linux 'everything is a file' — programs, your keyboard, even disks appear as files — so `file` is a handy way to inspect anything.",
      ],
      exercise:
        "Identify your system end to end. Run `cat /etc/os-release` and write down the `ID` and " +
        "`VERSION_ID`. Run `uname -r` and decode the suffix (`fc`? `el`?). Then `ls /etc | wc -l` to " +
        "count how many config entries live there, and `ls -ld /home/*` to list every human user's " +
        "home directory. In one sentence, state which distro you're on and why it matters for the " +
        "rest of the course.",
      drills: [
        "Run `ls -l /` and read the top-level directories. Find `/etc`, `/var`, `/usr`, `/home`, `/tmp`, `/root`.",
        "Run `cat /etc/redhat-release` — a one-line human-friendly version string unique to this family.",
        "Run `df -h /` to see how full your root filesystem is (you'll meet `df` properly in stage 10).",
        "Run `file /etc/os-release` and `file /usr/bin/bash` and compare what `file` reports for each.",
      ],
      note:
        "RHEL and CentOS use the `.el9` / `.el10` kernel naming and move slowly; Fedora uses `.fc40` " +
        "and moves fast, getting new kernels and tools first. AlmaLinux and Rocky Linux are free " +
        "rebuilds of RHEL — everything in this course applies to them unchanged.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "Getting help & finding things",
      tag: "self-sufficiency",
      time: "1–2 hrs",
      payoff:
        "Nobody memorises every flag. The skill that makes you a real administrator is finding " +
        "the answer fast: reading a manual page, asking which package provides a command, and " +
        "discovering which package a file came from. Master these and you stop being stuck.",
      concepts: [
        "man & sections (man 5 passwd)",
        "--help",
        "dnf provides",
        "rpm -qf",
        "apropos / tldr",
        "less navigation",
      ],
      code:
`# The built-in manual: full reference for a command or a config file
man ls                     # press / to search, n for next, q to quit
man 5 passwd               # section 5 = file FORMATS, not the passwd command

# The quick reminder most commands print themselves
ls --help | less           # pipe into less so you can scroll

# "I need a command that does X but don't know its name"
apropos network            # search man page descriptions by keyword

# "Something mentions a command I don't have — what installs it?"
sudo dnf provides '*/bin/htop'     # which package provides htop?
sudo dnf provides /usr/bin/dig     # which package provides dig?

# "This file is on my system — where did it come from?"
rpm -qf /usr/bin/ssh       # query which package owns a file
rpm -qf /etc/hostname`,
      lang: "bash",
      walkthrough: [
        "**`man ls`** opens the *manual page* — the authoritative, offline reference. It opens in a pager called `less`: arrow keys or **`Space`** to scroll, **`/word`** then **`Enter`** to search, **`n`** for the next match, **`q`** to quit.",
        "**Manual sections matter.** `man` is split into numbered sections. **`man 5 passwd`** shows the *file format* of `/etc/passwd` (section 5 = file formats), while plain `man passwd` shows the *command* to change a password (section 1). When a name is both, you pick with the number.",
        "**`--help`** is the fast path: almost every command prints a short usage summary when you add `--help`. Piping into **`| less`** lets you scroll long output. Use `--help` for a reminder, `man` for the full story.",
        "**`apropos network`** (same as `man -k`) searches the *one-line descriptions* of every man page for a keyword — perfect for 'I know what I want to do but not the command name'.",
        "**`dnf provides`** answers 'what would I install to get this?'. Give it a path pattern like **`'*/bin/htop'`** (quote it so the shell doesn't expand the `*`) and it names the package — here, `htop`. You haven't installed it yet; you're asking *which* package to install.",
        "**`rpm -qf /usr/bin/ssh`** runs in reverse: it takes a file *already on disk* and tells you which installed package owns it (`q` = query, `f` = which file). Indispensable when you find a mystery file and want to know where it came from.",
        "**Optional but lovely:** `tldr` (install with `sudo dnf install tldr`) gives short, example-first cheat sheets — `tldr tar` shows the five `tar` commands you actually use, instead of 200 lines of `man`.",
      ],
      exercise:
        "Answer three questions using only the tools above. (1) Use `man 5 fstab` to learn what the " +
        "fourth column of `/etc/fstab` is for. (2) Use `dnf provides` to find which package would give " +
        "you the `dig` command. (3) Pick any command in `/usr/bin`, then run `rpm -qf` on it to discover " +
        "its package, and `rpm -qi <package>` to read that package's description.",
      drills: [
        "Run `man man` and find what section number covers system administration commands.",
        "Run `apropos password` and skim the matches — note how many different tools touch passwords.",
        "Run `ls --help | grep -- -a` to find every flag that starts with `-a` without scrolling.",
        "Run `rpm -qf $(which systemctl)` to discover which package ships systemd's main command.",
      ],
      note:
        "`dnf provides` queries package *repositories* (things you could install), while `rpm -qf` " +
        "queries the local database (things already installed). Same question — 'what package?' — from " +
        "two directions: one for files you want, one for files you have.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "Users, groups & permissions",
      tag: "who can do what",
      time: "half a day",
      payoff:
        "Linux is multi-user to its core. Every file is owned by a user and a group, every " +
        "process runs as someone, and `sudo` is how you safely borrow root's power for one " +
        "command. Get users, groups and permissions right and you have security; get them wrong " +
        "and you have either a locked-out system or an open door.",
      concepts: [
        "useradd / usermod / passwd",
        "/etc/passwd & /etc/group",
        "chmod & chown",
        "the wheel group",
        "sudo & /etc/sudoers",
        "id & groups",
      ],
      code:
`# Create a user, give them a password, see what got created
sudo useradd -m -s /bin/bash alice   # -m makes /home/alice, -s sets the shell
sudo passwd alice                    # set alice's password (you'll be prompted)
id alice                             # show alice's UID, GID and groups
grep '^alice:' /etc/passwd           # alice's account line (no password here!)

# Grant admin rights the Red Hat way: add to the 'wheel' group
sudo usermod -aG wheel alice         # -a APPEND, -G group(s). Forgetting -a is a trap!
groups alice                         # confirm 'wheel' is now listed

# Permissions: owner / group / others, each rwx
ls -l report.txt                     # e.g. -rw-r--r-- 1 alice staff ...
sudo chown alice:staff report.txt    # set owner to alice, group to staff
chmod 640 report.txt                 # owner rw, group r, others nothing
chmod u+x deploy.sh                  # add execute for the owner only`,
      lang: "bash",
      walkthrough: [
        "**`useradd -m -s /bin/bash alice`** creates the account. **`-m`** makes her home directory `/home/alice`; **`-s /bin/bash`** sets her login shell. Without `-m` she'd have no home — a common surprise.",
        "**`passwd alice`** sets her password. A fresh account is *locked* until it has one. Run as yourself, `passwd` (no name) changes *your own* password instead.",
        "**`/etc/passwd`** has one line per account: `name:x:UID:GID:comment:home:shell`. The `x` is a placeholder — actual password *hashes* live in `/etc/shadow`, readable only by root. **`id alice`** summarises her numeric UID, primary group and extra groups.",
        "**Groups** let several users share access. **`/etc/group`** lists them. The **`wheel`** group is special on the Red Hat family: its members are allowed to use `sudo`. (On Debian that group is called `sudo`; here it's `wheel`.)",
        "**`usermod -aG wheel alice`** adds alice to `wheel`. The **`-a`** (append) is critical — **`-G` without `-a` *replaces* all her secondary groups**, silently removing her from every other group. Always write `-aG` together.",
        "**`ls -l`** shows permissions as `-rw-r--r--`: three triplets for **owner**, **group**, **others**, each `r`ead/`w`rite/e`x`ecute. **`chown alice:staff`** sets the owning user and group.",
        "**`chmod`** changes the bits. Numeric mode reads as three digits where `r=4, w=2, x=1`: **`640`** = owner `6` (rw), group `4` (r), others `0` (none). Symbolic mode like **`u+x`** is friendlier: 'add execute for the user/owner'.",
        "**`sudo`** runs a single command as root after checking you're allowed (you're in `wheel`) and asking *your* password. It's safer than logging in as root: every `sudo` is logged, and you stay in your own account the rest of the time.",
      ],
      exercise:
        "Create a throwaway user and prove the wiring works. Run `sudo useradd -m -s /bin/bash bob` and " +
        "`sudo passwd bob`. Inspect `grep '^bob:' /etc/passwd` and note his UID, home and shell. Add him " +
        "to wheel with `sudo usermod -aG wheel bob` and confirm with `groups bob`. Create a file, set it " +
        "to mode `640` with `chmod`, and run `ls -l` to read back the `-rw-r-----` you produced. When " +
        "done, remove him cleanly with `sudo userdel -r bob` (the `-r` also deletes his home).",
      drills: [
        "Run `id` (no name) to see your own UID and groups. Are you in `wheel`?",
        "Translate `chmod 755 script.sh` and `chmod 600 secret` into words before checking with `ls -l`.",
        "Run `getent passwd` and `getent group` — the database-aware way to list users and groups.",
        "Run `sudo visudo` (then quit without saving): the *only* safe way to edit `/etc/sudoers`, because it checks syntax before saving.",
      ],
      note:
        "Never edit `/etc/sudoers` with a plain editor — a syntax error there can lock everyone out of " +
        "`sudo`. Always use `sudo visudo`, which validates before saving. Prefer dropping a file in " +
        "`/etc/sudoers.d/` over editing the main file, and prefer adding users to `wheel` over writing " +
        "custom rules.",
    },

    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Package management with dnf & rpm",
      tag: "installing software",
      time: "half a day",
      payoff:
        "On the Red Hat family you almost never download and 'install' software by hand — you ask " +
        "`dnf`, which fetches the package, every dependency, and verified signatures from trusted " +
        "repositories. Understanding `dnf` (the high-level manager) and `rpm` (the low-level " +
        "package tool underneath) is the difference between a tidy system and a broken one.",
      concepts: [
        "dnf install / remove / upgrade",
        "dnf search / info",
        "dnf group install",
        "/etc/yum.repos.d & EPEL",
        "rpm -qa / -qi / -ql / -qf",
        "dnf history",
      ],
      code:
`# The everyday verbs
sudo dnf install -y htop          # install (with deps); -y auto-confirms
sudo dnf remove htop              # uninstall
sudo dnf upgrade                  # update everything to the latest available
dnf search editor                 # find packages by keyword (no sudo needed)
dnf info htop                     # version, size, summary, project URL

# Groups: install a whole role at once
dnf group list                    # see available groups
sudo dnf group install "Development Tools"   # gcc, make, git, ... in one go

# Repositories live as .repo files here
ls /etc/yum.repos.d/
sudo dnf install -y epel-release  # add EPEL: extra community packages (RHEL/CentOS)

# rpm: query the LOCAL package database (q = query)
rpm -qa | wc -l                   # -a: count every installed package
rpm -qi htop                      # -i: detailed info about an installed package
rpm -ql htop                      # -l: list every file the package installed`,
      lang: "bash",
      walkthrough: [
        "**`dnf install htop`** is the workhorse: it resolves *dependencies* (the other packages htop needs), downloads them all, checks cryptographic signatures, and installs. **`-y`** answers 'yes' to the confirmation prompt — handy in scripts, but read what it's about to do first.",
        "**`dnf remove`** uninstalls, and will also offer to remove now-unneeded dependencies. **`dnf upgrade`** (the modern spelling; `update` is an alias) brings every installed package up to the latest version in your repos — the core of keeping a system patched.",
        "**`dnf search`** and **`dnf info`** need no `sudo` because they only read. `search` finds packages by keyword across names and summaries; `info` prints the details of one package so you can decide before installing.",
        "**Groups** bundle related packages. **`dnf group install \"Development Tools\"`** pulls in `gcc`, `make`, `git` and friends together. **`dnf group list`** shows what's available — great for setting up a build or server role in one command.",
        "**Repositories** are the catalogues `dnf` reads from, defined by `.repo` files in **`/etc/yum.repos.d/`**. Each lists a URL and a signing key. **`dnf repolist`** shows which are enabled.",
        "**EPEL** ('Extra Packages for Enterprise Linux') is a hugely useful add-on repo for RHEL/CentOS that provides software not in the base channels (like `htop` historically). **`sudo dnf install epel-release`** adds it. On Fedora you rarely need it — Fedora's own repos are already large.",
        "**`rpm`** is the low-level tool `dnf` is built on; you use it to *query* what's installed. **`-qa`** lists all packages, **`-qi`** shows info on one, **`-ql`** lists the files a package put on disk, and (from stage 1) **`-qf`** maps a file back to its package. `rpm` knows nothing about repos or dependencies — that's `dnf`'s job.",
        "**`dnf history`** is your safety net: it logs every transaction and lets you **`sudo dnf history undo <id>`** to roll back an install or update that went wrong.",
      ],
      exercise:
        "Install, inspect and remove a package the proper way. Run `dnf info htop` and read its summary, " +
        "then `sudo dnf install -y htop`. Use `rpm -ql htop` to list the files it added and find where its " +
        "binary landed (`rpm -qf $(which htop)` to confirm). Run `dnf history` and note the transaction ID " +
        "for that install. Finally `sudo dnf remove htop`. Bonus: run `dnf grouplist` and identify one group " +
        "you'd install on a fresh server.",
      drills: [
        "Run `dnf repolist` to list your enabled repositories. Is EPEL among them?",
        "Run `rpm -qa | sort | less` and scroll the full inventory of installed packages.",
        "Run `dnf check-update` to preview which packages have updates *without* installing them.",
        "Run `sudo dnf install -y tree && tree -L 1 /etc` then `sudo dnf remove tree` to install, use and clean up a small tool.",
      ],
      note:
        "Fedora and RHEL 8+ use `dnf`; you'll still see `yum` typed everywhere — on these systems `yum` is " +
        "just a symlink to `dnf`, so old habits keep working. RHEL 8/9 also feature *modules* and *application " +
        "streams* (`dnf module list`) that let you pick, say, a specific PostgreSQL version — a wrinkle Fedora " +
        "doesn't have.",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "systemd & services",
      tag: "what runs in the background",
      time: "1 day",
      payoff:
        "Web servers, SSH, databases, the network itself — all run as background *services* " +
        "managed by **systemd**, the first process the kernel starts and the parent of everything " +
        "else. Learn `systemctl` and you can start, stop, inspect and permanently enable any " +
        "service, and write your own. This is the single most important admin skill on modern Linux.",
      concepts: [
        "systemctl status/start/stop/restart",
        "enable vs start",
        "unit files (.service)",
        "systemctl daemon-reload",
        "targets vs runlevels",
        "systemctl list-units",
      ],
      code:
`# Inspect and control a service (sshd = the SSH server)
systemctl status sshd             # running? enabled? recent log lines
sudo systemctl start sshd         # start it NOW (this boot only)
sudo systemctl stop sshd          # stop it now
sudo systemctl restart sshd       # stop then start (apply new config)
sudo systemctl enable sshd        # start automatically at every boot
sudo systemctl enable --now sshd  # enable at boot AND start right now

# See what exists
systemctl list-units --type=service        # currently loaded services
systemctl list-unit-files --type=service   # all installed, enabled or not

# Where unit files live, and editing them safely
systemctl cat sshd                # show sshd's unit file
sudo systemctl edit sshd          # create a safe override snippet
sudo systemctl daemon-reload      # re-read unit files after editing them

# The boot target (the modern 'runlevel')
systemctl get-default             # e.g. multi-user.target or graphical.target`,
      lang: "bash",
      walkthrough: [
        "**`systemctl status sshd`** is the first thing you run for any service. It tells you three things at a glance: is it **active (running)**, is it **enabled** (set to start at boot), and the last few log lines — often enough to see why it failed.",
        "**`start` vs `enable` is the concept to nail.** **`start`** runs the service *right now* but forgets after a reboot. **`enable`** schedules it to start *at boot* but doesn't touch it now. You usually want both — hence **`enable --now`**, which does the two together. Many a confused admin has enabled a service and wondered why it isn't running yet.",
        "**`restart`** fully stops and restarts (use after changing config). **`reload`** (when a service supports it) re-reads config *without* dropping connections — gentler, but not every service offers it.",
        "**`list-units --type=service`** shows what's currently loaded and their state; **`list-unit-files`** shows everything *installed*, including disabled ones, with their enable state. Use the first to ask 'what's running now?', the second to ask 'what could run?'.",
        "**A unit file** is the recipe that describes a service: what command to run, when to start it, what it depends on. **`systemctl cat sshd`** prints it. They live in `/usr/lib/systemd/system/` (shipped by packages) and `/etc/systemd/system/` (your overrides — yours win).",
        "**`systemctl edit sshd`** creates a small *override* file rather than hacking the original — your changes survive package updates. After editing any unit by hand you must run **`systemctl daemon-reload`** so systemd re-reads the files; forgetting this is a classic 'why didn't my change take effect?'.",
        "**Targets replaced runlevels.** Old SysV Linux had numbered runlevels (3 = text, 5 = graphical). systemd uses named **targets**: **`multi-user.target`** (text/server) and **`graphical.target`** (desktop). **`systemctl get-default`** shows the boot target; `sudo systemctl set-default multi-user.target` switches a server out of graphical mode.",
        "**systemd is PID 1** — the very first process, started by the kernel, that brings up everything else in parallel and adopts orphaned processes. When people say 'modern Linux', the switch to systemd is most of what they mean.",
      ],
      exercise:
        "Practise the full lifecycle on `sshd` (safe on most desktops; if you're on a remote box, don't " +
        "*stop* sshd — just use status/restart). Run `systemctl status sshd` and identify the 'Active:' and " +
        "'Loaded:' lines, noting whether it's `enabled` or `disabled`. Run `systemctl cat sshd` and find the " +
        "`ExecStart=` line — that's the actual command systemd runs. Run `systemctl get-default`. Finally, " +
        "list the five longest-running services with `systemctl list-units --type=service --state=running`.",
      drills: [
        "Run `systemctl --failed` to list any services that failed to start — ideally an empty list.",
        "Run `systemctl list-dependencies multi-user.target | head` to see what the text-mode target pulls in.",
        "Run `systemd-analyze blame` to see which services took longest to start at last boot.",
        "Run `systemctl is-enabled sshd` and `systemctl is-active sshd` — scriptable yes/no answers.",
      ],
      note:
        "There are also *user* services: `systemctl --user` manages services that run under your login, no " +
        "root needed. And a `.service` is only one kind of unit — there are also `.socket`, `.mount`, `.target` " +
        "and the `.timer` units you'll meet in stage 11. Same `systemctl` commands drive them all.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "Logs with journald",
      tag: "what happened & why",
      time: "half a day",
      payoff:
        "When something breaks, the answer is almost always in the logs. systemd collects every " +
        "service's output into a single, queryable journal you read with `journalctl` — filter by " +
        "service, by time, by priority, or follow it live. Stop guessing why a service won't start; " +
        "the journal will tell you in plain text.",
      concepts: [
        "journalctl basics",
        "-u (by unit), -f (follow)",
        "-p (priority), --since",
        "-b (this boot)",
        "persistent vs volatile journal",
        "/var/log & rsyslog",
      ],
      code:
`# The journal: structured logs from every service, in one place
journalctl                        # everything, oldest first (q to quit)
journalctl -e                     # jump to the END (newest)
journalctl -u sshd                # only sshd's messages (-u = unit)
journalctl -u sshd -f             # FOLLOW sshd live (like tail -f; Ctrl-C to stop)

# Filter by time and severity
journalctl --since "1 hour ago"
journalctl --since today
journalctl -b                     # only this boot
journalctl -b -1                  # the PREVIOUS boot (did it crash?)
journalctl -p err                 # only priority 'error' and worse

# Make logs survive reboots (Fedora: on by default; minimal RHEL: maybe not)
sudo mkdir -p /var/log/journal
sudo systemctl restart systemd-journald

# The classic plain-text logs still exist too
ls /var/log                       # messages, secure, dnf.log, boot.log ...`,
      lang: "bash",
      walkthrough: [
        "**`journalctl`** with no arguments dumps the whole journal into a pager. Useful flags right away: **`-e`** jumps to the newest entries, **`-r`** reverses to newest-first, and **`-n 50`** shows just the last 50 lines.",
        "**`-u sshd`** is the filter you'll use most: show only one service's messages. Combine with **`-f`** to *follow* — the screen updates live as new lines arrive, exactly like `tail -f`. This is how you watch a service while you poke it from another window.",
        "**`--since`** accepts friendly times: `\"1 hour ago\"`, `today`, `\"2024-01-01 09:00\"`. Pair with `--until` to bound both ends. This narrows a noisy journal down to the minutes that matter.",
        "**`-b`** limits output to the *current* boot — invaluable for 'what happened since I turned it on?'. **`-b -1`** shows the *previous* boot, which is how you investigate a crash or unexpected reboot after the machine comes back.",
        "**`-p err`** filters by *priority*. The levels run `emerg, alert, crit, err, warning, notice, info, debug`; naming one shows that level **and everything more severe**. `journalctl -b -p err` ('errors this boot') is a fast triage command.",
        "**Persistence.** By default some systems keep the journal only in RAM (`/run`), so it's wiped on reboot — which means `-b -1` shows nothing. Creating **`/var/log/journal`** and restarting `systemd-journald` makes the journal *persistent* on disk. Fedora enables this out of the box; a minimal RHEL install may not.",
        "**The old `/var/log` files still exist.** `rsyslog` (the traditional logging daemon) writes human-readable text files: **`/var/log/messages`** (general), **`/var/log/secure`** (logins and sudo), `/var/log/dnf.log`. Many tools and habits still rely on these, so know both systems — the journal for rich queries, the text files for grep-and-go.",
      ],
      exercise:
        "Investigate your own system like an admin. Run `journalctl -b -p err` and read any errors from this " +
        "boot. Open two terminals: in one run `journalctl -u sshd -f`, in the other run `sudo systemctl restart " +
        "sshd`, and watch the restart appear live. Run `journalctl --since today -u sshd` to see today's SSH " +
        "activity. Finally, check whether your journal is persistent: does `journalctl -b -1` return anything, " +
        "or 'Specified boot ID ... not found'? If the latter, enable persistence as shown.",
      drills: [
        "Run `journalctl -k` to see only *kernel* messages (the equivalent of `dmesg`).",
        "Run `journalctl --disk-usage` to see how much space the journal occupies.",
        "Run `sudo tail -f /var/log/secure` in one window and `sudo -i` then `exit` in another — watch sudo get logged.",
        "Run `journalctl -u sshd -o json-pretty | head -40` to see the structured fields behind each log line.",
      ],
      note:
        "The journal is structured: every entry carries fields like `_SYSTEMD_UNIT`, `_PID` and `PRIORITY`, " +
        "which is why precise filtering (`-u`, `-p`, `_PID=…`) works where grepping a flat text file is clumsy. " +
        "On a busy server, cap its size in `/etc/systemd/journald.conf` (`SystemMaxUse=500M`) so logs can't fill " +
        "the disk.",
    },

    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Processes & performance",
      tag: "what the CPU is doing",
      time: "half a day",
      payoff:
        "When a server is slow or hot, you need to see what's running and what's eating the CPU or " +
        "memory — and sometimes stop it. `ps`, `top`/`htop`, `kill`, `nice` and a few quick health " +
        "checks like `free` and `uptime` let you diagnose a struggling system in under a minute.",
      concepts: [
        "ps aux & process state",
        "top / htop",
        "kill & killall, signals",
        "nice & renice",
        "free, uptime, load average",
        "systemd-cgls",
      ],
      code:
`# Snapshot every process on the system
ps aux                            # a = all users, u = detailed, x = incl. daemons
ps aux --sort=-%cpu | head        # the top CPU hogs right now
ps -ef | grep sshd                # find a process by name (classic style)

# Live, interactive views
top                               # built in; press q to quit, M = sort by memory
sudo dnf install -y htop && htop  # friendlier, colourful; F9 to kill, q to quit

# Stop a misbehaving process (politely, then firmly)
kill 1234                         # send SIGTERM (15): "please exit"
kill -9 1234                      # send SIGKILL (9): forceful, cannot be ignored
killall firefox                   # signal every process named firefox

# Run or re-prioritise nicely (lower priority = friendlier to others)
nice -n 10 ./big_job.sh           # start a job at reduced priority
sudo renice -n 5 -p 1234          # change priority of a running PID

# Whole-system health at a glance
uptime                            # load averages: 1, 5, 15 minute
free -h                           # memory used / free / cached, human units`,
      lang: "bash",
      walkthrough: [
        "**`ps aux`** prints a *snapshot* of every process. The magic letters: **`a`** = all users' processes, **`u`** = user-friendly columns (USER, %CPU, %MEM, START, COMMAND), **`x`** = include background daemons with no terminal. **`--sort=-%cpu`** puts the biggest CPU users on top.",
        "**`ps -ef`** is the other common style (`-e` = every process, `-f` = full format); piping to `grep` is the old-school way to find one process, though `pgrep sshd` does it more cleanly.",
        "**`top`** is the live dashboard built into every system: a self-updating table sorted by CPU. Inside it, **`M`** sorts by memory, **`P`** by CPU, **`k`** kills a process, **`q`** quits. **`htop`** (install it) is the nicer version — scrollable, colour-coded, with `F9` to send signals via a menu.",
        "**`kill` sends a *signal*, it doesn't always 'kill'.** Plain **`kill 1234`** sends **SIGTERM (15)**: 'please shut down cleanly' — the program can flush data first. If it's stuck, **`kill -9 1234`** sends **SIGKILL (9)**, which the kernel enforces immediately and the program *cannot* catch. Always try the polite TERM before the brutal KILL. **`killall name`** signals by name instead of PID.",
        "**`nice`** sets how *generous* a process is with CPU. The scale runs −20 (greedy) to +19 (very polite); higher = nicer to others. **`nice -n 10 ./job`** starts a background job that yields to interactive work. **`renice`** changes a *running* process's niceness (raising priority needs `sudo`).",
        "**`uptime`** ends with three **load averages** — the average number of processes wanting the CPU over the last 1, 5 and 15 minutes. Rule of thumb: compare to your core count (`nproc`). A load of 4.0 on 4 cores is fully busy; 8.0 on 4 cores means tasks are queuing. Three numbers also show the *trend* — rising or settling.",
        "**`free -h`** shows memory in human units. Don't panic at low 'free': Linux deliberately uses spare RAM as disk **cache** (`buff/cache`), which it instantly gives back when programs need it. The number that matters is **`available`**.",
        "**`systemd-cgls`** shows processes grouped by their *control group* (cgroup) — i.e. by which service they belong to. It makes 'which service spawned this process?' obvious, and cgroups are also how systemd can cap a service's CPU and memory.",
      ],
      exercise:
        "Profile your system. Run `nproc` to learn your core count, then `uptime` and judge whether the load " +
        "average means 'idle', 'busy' or 'overloaded'. Run `ps aux --sort=-%mem | head` to find your three " +
        "biggest memory users. Start a harmless busy process in the background with `yes > /dev/null &`, watch " +
        "it dominate `top`, find its PID with `pgrep yes`, and stop it with `kill` (try plain `kill` first). " +
        "Confirm `free -h` and note the difference between 'free' and 'available'.",
      drills: [
        "Run `ps aux | wc -l` to count how many processes are running right now.",
        "Run `pgrep -a sshd` to list SSH-related PIDs and their command lines in one step.",
        "Start `sleep 300 &`, then practise `kill %1` (job number) and `kill <PID>` on it.",
        "Run `systemd-cgtop` for a live, service-grouped view of CPU and memory (like top, but per-service).",
      ],
      note:
        "A high load average isn't always CPU: processes stuck waiting on a slow disk or network count too (state " +
        "`D`, 'uninterruptible sleep'). If load is high but CPU% in `top` is low, suspect I/O — reach for `iostat` " +
        "(from the `sysstat` package) to confirm.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "Networking",
      tag: "getting on the network",
      time: "1 day",
      payoff:
        "Every server's job involves the network. On the Red Hat family, **NetworkManager** owns " +
        "your connections and **`nmcli`** is how you configure them from the command line — set an " +
        "IP, change DNS, name the host. Add `ip`, `ss`, `ping` and `curl` for diagnosis and you can " +
        "answer 'is the network up, and if not, where does it break?'.",
      concepts: [
        "NetworkManager & nmcli",
        "ip addr / ip route",
        "hostnamectl & /etc/hostname",
        "DNS & /etc/resolv.conf",
        "ss for sockets",
        "ping / curl to test",
      ],
      code:
`# What IP addresses and routes do I have? (read-only, no NetworkManager needed)
ip addr                           # every interface and its IP(s); 'ip a' for short
ip route                          # the routing table; the 'default' line = gateway

# NetworkManager: the manager that actually owns the config
nmcli device status               # interfaces and whether they're connected
nmcli connection show             # saved connection profiles
nmcli connection show "ens18"     # all settings for one connection

# Set a static IP on a connection profile (then bring it up)
sudo nmcli connection modify "ens18" ipv4.method manual \\
     ipv4.addresses 192.168.1.50/24 ipv4.gateway 192.168.1.1 \\
     ipv4.dns "1.1.1.1 8.8.8.8"
sudo nmcli connection up "ens18"

# Hostname and DNS
hostnamectl                       # current hostname + OS/kernel summary
sudo hostnamectl set-hostname web01.example.com
cat /etc/resolv.conf              # the DNS servers in use (managed for you)

# Test connectivity, listening ports, and a URL
ping -c 3 1.1.1.1                 # can I reach the internet by IP? (-c 3 = 3 pings)
ss -tulpn                         # which programs are listening on which ports
curl -I https://example.com       # fetch just the HTTP headers of a site`,
      lang: "bash",
      walkthrough: [
        "**`ip addr`** (short: `ip a`) lists every network interface and its addresses — the modern replacement for `ifconfig`. **`ip route`** shows where traffic goes; the line starting **`default`** is your gateway (the door to the rest of the network).",
        "**NetworkManager is in charge.** On Fedora/RHEL/CentOS it owns the configuration, so editing files by hand can get overwritten. **`nmcli`** is its command-line front end. **`nmcli device status`** shows interfaces and connection state; **`nmcli connection show`** lists saved *profiles* (NetworkManager separates the physical *device* from the *connection profile* applied to it).",
        "**Setting a static IP** edits the *profile*, not the live interface: **`nmcli connection modify`** changes settings (`ipv4.method manual` turns off DHCP, then you supply `addresses`, `gateway`, `dns`), and **`nmcli connection up`** applies them. The change is saved, so it survives reboots — unlike a raw `ip addr add`, which vanishes on restart.",
        "**`/24`** in `192.168.1.50/24` is the *netmask* in CIDR form — it says the first 24 bits are the network, so this host shares a network with `192.168.1.1`–`192.168.1.254`. You'll see `/24`, `/16` and `/8` constantly.",
        "**`hostnamectl`** reads and sets the machine's name. **`hostnamectl set-hostname web01.example.com`** writes it to **`/etc/hostname`** persistently (replacing the old trick of editing that file *and* running `hostname` separately).",
        "**DNS** turns names into IPs. The active servers are listed in **`/etc/resolv.conf`** — but NetworkManager *manages* that file, so set DNS via `nmcli` (as above) rather than editing it, or your edit gets overwritten.",
        "**Diagnosis, in order.** **`ping -c 3 1.1.1.1`** ('send 3 packets to this IP') tests raw reachability — if a *name* fails but the *IP* pings, your problem is DNS, not the network. **`ss -tulpn`** lists listening sockets (**t**cp, **u**dp, **l**istening, **p**rocess, **n**umeric) — the modern `netstat`, perfect for 'is my service actually listening, and on what port?'. **`curl -I`** fetches a URL's headers to confirm a web service responds.",
      ],
      exercise:
        "Map your own networking without changing anything risky. Run `ip addr` and write down your primary " +
        "interface name and its IP. Run `ip route` and identify your default gateway. Run `nmcli connection show` " +
        "and match the profile to that interface. Confirm DNS works by comparing `ping -c 2 1.1.1.1` (by IP) with " +
        "`ping -c 2 example.com` (by name) — if the first works but the second doesn't, you've isolated a DNS " +
        "problem. Finally, run `ss -tulpn` and identify which program is listening on port 22.",
      drills: [
        "Run `hostnamectl` and read your current static hostname and machine architecture.",
        "Run `nmcli device status` and note which devices are `connected` vs `disconnected`.",
        "Run `ss -tulpn | grep :22` to confirm sshd is listening, and on which addresses.",
        "Run `curl -s ifconfig.me` (or `curl -s https://api.ipify.org`) to discover your public IP.",
      ],
      note:
        "Server installs are configured with `nmcli`; desktop Fedora usually uses the GUI applet, but both drive " +
        "the *same* NetworkManager underneath, so the profiles are interchangeable. There's also `nmtui`, a " +
        "friendly text-menu interface — run `sudo nmtui` if you prefer arrow keys to flags.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "Firewalld",
      tag: "controlling access",
      time: "half a day",
      payoff:
        "A service is only safe if the right people can reach it and nobody else can. The Red Hat " +
        "family ships **firewalld**, a zone-based firewall you drive with `firewall-cmd`. Learn to " +
        "open a port or a service, make the change permanent, and reload — and you can expose a web " +
        "server to the world while keeping everything else locked down.",
      concepts: [
        "firewalld zones",
        "--add-service / --add-port",
        "--permanent + --reload",
        "--list-all",
        "runtime vs permanent",
        "firewalld vs iptables/nftables",
      ],
      code:
`# What's the firewall doing right now?
sudo firewall-cmd --state              # is firewalld running?
firewall-cmd --get-default-zone        # usually 'public'
sudo firewall-cmd --list-all           # everything allowed in the default zone

# Open a well-known service (firewalld knows http = port 80)
sudo firewall-cmd --add-service=http              # RUNTIME only (lost on reload)
sudo firewall-cmd --add-service=http --permanent  # saved to config, not yet live
sudo firewall-cmd --reload                        # apply permanent rules now

# The reliable pattern: add permanent, then reload
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-services      # confirm http, https are listed
sudo firewall-cmd --list-ports         # confirm 8080/tcp is listed

# Closing things again
sudo firewall-cmd --permanent --remove-port=8080/tcp
sudo firewall-cmd --reload`,
      lang: "bash",
      walkthrough: [
        "**`firewall-cmd --state`** confirms firewalld is running, and **`--get-default-zone`** names the active zone (typically **`public`**). **`--list-all`** is the command to remember: it prints everything the current zone allows — services, ports, interfaces — in one screen.",
        "**Zones are firewalld's big idea.** A *zone* is a named trust level (`public`, `home`, `internal`, `trusted`…) with its own rules; each network interface is assigned to one. A laptop might trust `home` but treat coffee-shop wifi as `public`. Most servers just use `public` and that's fine — you mostly add services to it.",
        "**Open by service name, when you can.** firewalld ships definitions for common services, so **`--add-service=http`** opens port 80 without you remembering the number. **`--add-service=ssh`** is already open by default — which is why you don't lock yourself out the moment you enable the firewall.",
        "**Runtime vs permanent is the gotcha that bites everyone.** A bare `--add-service=http` changes the *running* firewall but is **lost on the next reload or reboot**. Adding **`--permanent`** writes it to config but does **not** apply it yet. So the dependable recipe is: **`--permanent --add-...`** then **`--reload`**. (Doing both — runtime *and* permanent — is also common when you want it live immediately and persisted.)",
        "**`--add-port=8080/tcp`** opens a specific port and protocol for services firewalld doesn't know by name. Always specify `/tcp` or `/udp`.",
        "**`--list-services`** and **`--list-ports`** verify your work after the reload. Get into the habit of confirming — a typo in a permanent rule fails silently until you check.",
        "**Removing** mirrors adding: **`--permanent --remove-port=8080/tcp`** then **`--reload`**. Same two-step rhythm.",
        "**Under the hood**, firewalld is a friendly manager *on top of* `nftables` (modern) or `iptables` (older). Those are the raw packet-filter engines; firewalld saves you from hand-writing their rules and makes changes persistent and zone-aware. You *can* drop to `nft list ruleset` to see the generated rules, but day to day you stay in `firewall-cmd`.",
      ],
      exercise:
        "Safely open and verify a port. First run `sudo firewall-cmd --list-all` and read what's already allowed " +
        "(note that `ssh` is there — good). Open HTTP the durable way: `sudo firewall-cmd --permanent " +
        "--add-service=http`, then `sudo firewall-cmd --reload`, then confirm with `sudo firewall-cmd " +
        "--list-services`. Now open a custom port: add `9090/tcp` permanently, reload, and verify with " +
        "`--list-ports`. Finally, clean up by removing `9090/tcp` permanently and reloading. You'll reuse exactly " +
        "this pattern in the capstone.",
      drills: [
        "Run `sudo firewall-cmd --get-zones` to list every available zone, and `--get-active-zones` for the ones in use.",
        "Run `firewall-cmd --get-services | tr ' ' '\\n' | grep -E 'http|ssh|mysql'` to see predefined service names.",
        "Add a service in *runtime only* (no `--permanent`), reload, and confirm it vanished — proving why `--permanent` matters.",
        "Run `sudo nft list ruleset | head -40` to peek at the low-level rules firewalld generated for you.",
      ],
      note:
        "firewalld is the default on RHEL/CentOS/Fedora; Ubuntu's `ufw` and raw `iptables` guides won't apply " +
        "here — translate them to `firewall-cmd`. If you `--permanent --add-...` but forget `--reload`, the rule " +
        "is on disk but not active, which looks exactly like 'my firewall change didn't work'. Reload, then check.",
    },

    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "SELinux basics",
      tag: "mandatory access control",
      time: "1 day",
      payoff:
        "SELinux is the Red Hat family's superpower and its most-cursed feature. It's a second " +
        "layer of security that confines each service so that even a hacked web server can't read " +
        "your password file. When something 'works on Ubuntu but not on RHEL', SELinux is often why " +
        "— and learning to *work with* it instead of disabling it is what separates real admins from " +
        "tutorials that say 'just turn it off'.",
      concepts: [
        "enforcing / permissive / disabled",
        "getenforce / setenforce",
        "ls -Z / ps -Z contexts",
        "restorecon & semanage",
        "booleans",
        "reading AVC denials",
      ],
      code:
`# What mode is SELinux in?
getenforce                        # Enforcing | Permissive | Disabled
sestatus                          # fuller status, including the policy in use

# Temporarily switch modes (does NOT survive reboot)
sudo setenforce 0                 # 0 = Permissive: log denials but allow them
sudo setenforce 1                 # 1 = Enforcing: actually block denials

# Every file and process carries a security 'context' (the -Z flag)
ls -Z /var/www/html               # see file contexts (user:role:TYPE:level)
ps -Z | head                      # see process contexts

# Fixing a mislabeled file (the #1 real-world SELinux issue)
sudo restorecon -Rv /var/www/html # reset files to their correct default labels

# Tell SELinux a directory should serve web content
sudo semanage fcontext -a -t httpd_sys_content_t "/srv/web(/.*)?"
sudo restorecon -Rv /srv/web

# Booleans: pre-built on/off switches for common needs
getsebool -a | grep httpd         # list httpd-related toggles
sudo setsebool -P httpd_can_network_connect on   # -P makes it permanent`,
      lang: "bash",
      walkthrough: [
        "**Three modes.** **Enforcing** = SELinux actively blocks anything its policy forbids (the production default). **Permissive** = it *allows* everything but *logs* what it *would* have blocked — perfect for diagnosis. **Disabled** = off entirely (don't). **`getenforce`** prints the mode; **`sestatus`** gives the full picture.",
        "**`setenforce 0`/`1`** flips between Permissive and Enforcing *temporarily* — handy to test 'is SELinux the cause?'. To change the mode *permanently* you edit **`/etc/selinux/config`** and reboot. Crucial subtlety: you can switch enforcing↔permissive live, but going to/from *Disabled* requires a reboot and a full relabel.",
        "**Contexts are the heart of it.** Every file and process has a label like `system_u:object_r:httpd_sys_content_t:s0`. SELinux's policy is a set of rules about which process *types* may touch which file *types*. The **`-Z`** flag reveals these labels: **`ls -Z`** on files, **`ps -Z`** on processes. The middle piece (the **type**, ending in `_t`) is what usually matters.",
        "**The #1 real problem is mislabeling.** If you move a file with `mv` (which preserves the old label) or restore from a backup, a file can end up with a context the serving process isn't allowed to read — so the service gets 'Permission denied' even though normal `rwx` permissions look fine. **`restorecon -Rv /path`** ('restore context, recursively, verbosely') resets files to the *default* label for their location, fixing this instantly. It's the single most useful SELinux command.",
        "**`semanage fcontext`** changes the *default* label rule for a path — needed when you serve content from a non-standard directory like `/srv/web`. You add the rule (mapping the path to `httpd_sys_content_t`, the 'web content' type) **and then** run `restorecon` to apply it. `semanage` comes from the `policycoreutils-python-utils` package.",
        "**Booleans are friendly switches.** Instead of writing policy, the distro ships toggles for common needs. **`httpd_can_network_connect`** lets the web server make outbound connections (off by default for safety). **`setsebool -P`** flips one; the **`-P`** ('persistent') makes it survive reboots — forget it and your fix evaporates on restart.",
        "**Reading denials.** When SELinux blocks something it logs an **AVC** (Access Vector Cache) message. Find them with `sudo ausearch -m AVC -ts recent` or `sudo journalctl -t setroubleshoot`. Even better, install `setroubleshoot-server` and `sealert -a /var/log/audit/audit.log` will explain the denial *in English and suggest the exact fix command*. That tool alone makes SELinux approachable.",
        "**Why not 'just disable it'?** Because SELinux is the thing that turns a compromised service into a contained one rather than a system-wide breach. Tutorials that disable it are trading away your best defence to skip ten minutes of learning. The right reflex when blocked is: switch to Permissive, reproduce the action, read the AVC, apply the proper label or boolean, switch back to Enforcing.",
      ],
      exercise:
        "Build SELinux intuition without breaking anything. Run `getenforce` and `sestatus`. Look at contexts: " +
        "`ls -Z /etc/passwd` and `ps -Z $(pgrep -n sshd)` — note the `_t` type on each. Now simulate the classic " +
        "mislabel bug *safely*: create a file in your home dir, copy it into a system web path if one exists " +
        "(`/var/www/html`), and compare `ls -Z` before and after a `sudo restorecon -v` on it — watch the label " +
        "change to `httpd_sys_content_t`. Finally, list httpd booleans with `getsebool -a | grep httpd` and read " +
        "what three of them control. Do NOT disable SELinux.",
      drills: [
        "Run `sudo setenforce 0`, then `getenforce` to confirm Permissive, then `sudo setenforce 1` to restore Enforcing.",
        "Run `ls -Z /var/www/html` (create it if missing) and identify the `httpd_sys_content_t` type.",
        "Run `sudo ausearch -m AVC -ts today` to see whether anything was denied today (often empty — good).",
        "Run `getsebool httpd_can_network_connect` to read one boolean's current on/off state.",
      ],
      note:
        "SELinux ships Enforcing on RHEL, CentOS Stream and Fedora alike — this is a defining Red Hat-family " +
        "trait (Ubuntu uses the different AppArmor system, which is why their guides won't mention contexts). " +
        "When a service inexplicably can't read a file, *permission looks fine but it's denied*, your first " +
        "thought should be 'SELinux label' — reach for `restorecon` before anything drastic.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Storage & filesystems",
      tag: "disks, space & mounting",
      time: "1 day",
      payoff:
        "Sooner or later you add a disk, run out of space, or need to mount a volume at boot. " +
        "Knowing how to see your block devices, check usage, format and mount a filesystem, and " +
        "make it permanent in `/etc/fstab` — plus the basics of LVM, which RHEL uses by default — " +
        "lets you manage storage instead of fearing it.",
      concepts: [
        "lsblk & block devices",
        "df -h & du",
        "mount / umount",
        "/etc/fstab & UUIDs",
        "mkfs & filesystems",
        "LVM: pv / vg / lv, swap",
      ],
      code:
`# See disks, partitions and how they're laid out
lsblk                             # tree of block devices: disks > partitions
lsblk -f                          # add filesystem type, label and UUID
sudo blkid                        # UUIDs of every filesystem (used in fstab)

# How full is everything? Where did the space go?
df -h                             # free/used per MOUNTED filesystem, human units
du -sh /var/log/*                 # size of each thing under /var/log, summarised
du -sh /home/* | sort -h         # biggest home directories, smallest first

# Format and mount a new disk (DANGEROUS: /dev/sdb wipes that disk!)
sudo mkfs.xfs /dev/sdb1           # create an XFS filesystem (RHEL's default)
sudo mkdir -p /mnt/data
sudo mount /dev/sdb1 /mnt/data    # mount it NOW (temporary, lost on reboot)
sudo umount /mnt/data             # unmount

# LVM: flexible storage you can grow later (the RHEL default layout)
sudo pvcreate /dev/sdb1           # mark the partition as an LVM 'physical volume'
sudo vgcreate datavg /dev/sdb1    # pool it into a 'volume group' named datavg
sudo lvcreate -L 10G -n lv01 datavg   # carve a 10G 'logical volume' from the pool

# Swap and memory
sudo swapon --show                # current swap areas
free -h                           # see swap usage alongside RAM`,
      lang: "bash",
      walkthrough: [
        "**`lsblk`** draws a tree of *block devices*: physical disks (`sda`, `nvme0n1`) and the partitions inside them (`sda1`, `sda2`). **`lsblk -f`** adds the filesystem type, label and UUID — usually all you need to understand a machine's storage at a glance. **`blkid`** lists the UUIDs you'll copy into `/etc/fstab`.",
        "**`df -h`** ('disk free, human') answers 'am I running out of space?' — one line per *mounted* filesystem showing size, used, available and mount point. It's per *filesystem*, so a full `/` and an empty `/home` show separately.",
        "**`du`** ('disk usage') answers the follow-up 'what's *using* the space?'. **`du -sh /var/log/*`** prints a **s**ummary, **h**uman-readable size for each item. Pipe to `sort -h` to rank them. The pattern `df` to find the full filesystem, then `du` to find the culprit inside it, is a core admin reflex.",
        "**`mkfs.xfs /dev/sdb1`** *formats* a partition with a filesystem — **XFS** is RHEL's default, `ext4` the other common choice. ⚠️ This **erases** whatever was on `/dev/sdb1`, so triple-check the device name with `lsblk` first; confusing `sdb` with `sda` (your system disk) is catastrophic.",
        "**`mount /dev/sdb1 /mnt/data`** attaches a filesystem onto a directory so its contents appear there; **`umount`** detaches it. A plain `mount` is *temporary* — it's gone after a reboot, which is exactly why `/etc/fstab` exists.",
        "**`/etc/fstab`** lists filesystems to mount automatically at boot, one per line: *what* to mount, *where*, the type, options, and two flags. Best practice is to identify the device by **`UUID=...`** (stable) rather than `/dev/sdb1` (which can change if you add disks). After editing fstab, test it with **`sudo mount -a`** *before* rebooting — a bad fstab entry can stop the system from booting cleanly.",
        "**LVM (Logical Volume Manager)** is RHEL's default layout and worth understanding because of one feature: you can **grow** a volume later without repartitioning. The three layers: a **physical volume** (`pvcreate` marks a disk/partition for LVM), pooled into a **volume group** (`vgcreate` — think of it as one big tank of storage), from which you carve **logical volumes** (`lvcreate -L 10G` — the flexible 'partitions' you actually format and mount). Need more space later? Add a disk to the group and extend the volume — no downtime.",
        "**Swap** is disk space used as overflow when RAM fills. **`swapon --show`** lists active swap areas and **`free -h`** shows swap usage beside RAM. A little swap is healthy; *constant* heavy swapping means you need more memory.",
      ],
      exercise:
        "Survey and right-size your storage (all read-only and safe). Run `lsblk -f` and sketch your disk layout: " +
        "which partition holds `/`, which holds `/home`, are they LVM logical volumes? Run `df -h` and identify " +
        "your fullest filesystem by percentage. Hunt the space: `sudo du -sh /var/* 2>/dev/null | sort -h` to find " +
        "the biggest consumers under `/var`. Open `/etc/fstab` read-only (`cat /etc/fstab`) and match each line to " +
        "a device in `lsblk` — note whether it uses `UUID=` or a device path. Finally `swapon --show` to see if " +
        "and how much swap you have.",
      drills: [
        "Run `lsblk` and `findmnt /` to confirm which device your root filesystem lives on.",
        "Run `df -i` to check *inode* usage — a disk can be 'full' of inodes (too many tiny files) while showing free space.",
        "Run `sudo du -xsh /* 2>/dev/null | sort -h` to rank every top-level directory by size.",
        "Run `cat /etc/fstab` and decode one line: field by field, what does each column mean? (Cross-check with `man 5 fstab`.)",
      ],
      note:
        "RHEL and CentOS default to **XFS on LVM**, which is why a fresh install shows volumes like " +
        "`/dev/mapper/rhel-root` rather than plain `/dev/sda1` — those are LVM logical volumes. XFS can grow but " +
        "(unlike ext4) **cannot shrink**, so plan volume sizes with room to expand rather than over-allocating and " +
        "hoping to reclaim it later.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "Automation & a capstone",
      tag: "tie it all together",
      time: "1–2 days",
      payoff:
        "Real administration is repeatable. Scheduling jobs with cron or systemd timers, and " +
        "reaching servers over SSH, turn one-off commands into reliable automation. Then you'll " +
        "combine everything — package, service, firewall, logs — to provision a working web server " +
        "from scratch, the exact workflow you'd use on a real machine.",
      concepts: [
        "cron & crontab -e",
        "systemd .timer units",
        "ssh & key-based login",
        "scp for file transfer",
        "the provisioning workflow",
        "verifying with journalctl",
      ],
      code:
`# --- Classic scheduling: cron ---
crontab -e                        # edit YOUR user's scheduled jobs
# A cron line: minute hour day-of-month month day-of-week  command
#   0 2 * * *  /usr/local/bin/backup.sh      # every day at 02:00
crontab -l                        # list your cron jobs

# --- The modern way: a systemd timer (two files) ---
# /etc/systemd/system/backup.service  -> what to run
#   [Service]
#   ExecStart=/usr/local/bin/backup.sh
# /etc/systemd/system/backup.timer    -> when to run it
#   [Timer]
#   OnCalendar=*-*-* 02:00:00
#   [Install]
#   WantedBy=timers.target
sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer
systemctl list-timers             # see all timers and their next run time

# --- SSH: reach and secure a remote box ---
ssh-keygen -t ed25519             # make a key pair (press Enter for defaults)
ssh-copy-id alice@web01           # install your public key on the server
ssh alice@web01                   # log in (now without a password)
scp report.txt alice@web01:/tmp/  # copy a file over SSH

# --- CAPSTONE: provision a web server in five commands ---
sudo dnf install -y httpd                              # 1. install
sudo systemctl enable --now httpd                      # 2. enable + start
sudo firewall-cmd --permanent --add-service=http       # 3. open the firewall
sudo firewall-cmd --reload                             #    (apply it)
echo "Hello from $(hostname)" | sudo tee /var/www/html/index.html  # 4. content
curl -s http://localhost && journalctl -u httpd -n 20  # 5. verify + read logs`,
      lang: "bash",
      walkthrough: [
        "**`crontab -e`** edits your personal schedule of jobs. Each line is five time fields — **minute, hour, day-of-month, month, day-of-week** — followed by a command. `0 2 * * *` means 'at minute 0 of hour 2, every day': 2 AM nightly. A `*` means 'every'. **`crontab -l`** lists what you've scheduled. System-wide jobs also live in `/etc/cron.d/` and the `/etc/cron.daily/` directories.",
        "**systemd timers** are the modern alternative, and they're better in real ways: their output goes to the journal (so `journalctl -u backup` shows exactly what happened), they can run jobs *missed* while the machine was off (`Persistent=true`), and they handle dependencies. The cost is *two* files: a **`.service`** that says *what* to run and a **`.timer`** that says *when* (**`OnCalendar=`** uses the same idea as cron but clearer syntax).",
        "**After creating unit files** you must **`systemctl daemon-reload`** (so systemd reads them) and **`systemctl enable --now backup.timer`** (enable at boot *and* start the timer now). **`systemctl list-timers`** then shows every timer and, helpfully, *when each will next fire* — something cron can't tell you.",
        "**SSH** is how you reach servers. **`ssh-keygen -t ed25519`** generates a *key pair*: a private key that stays on your machine and a public key you can hand out. **`ssh-copy-id`** installs your public key on the server's account so you can log in **without a password** — more secure and convenient than typing one each time. **`ssh alice@web01`** then drops you into a remote shell.",
        "**`scp`** copies files over that same SSH connection: `scp localfile user@host:/remote/path`. Secure by default, no extra setup. (`rsync -avz` over SSH is the heavier-duty cousin for syncing whole directories.)",
        "**The capstone is the whole course in five lines.** **(1) Install** `httpd` (Apache) with `dnf` — stage 3. **(2) `enable --now`** so it runs now and at every boot — stage 4. **(3+ reload) open the firewall** to the `http` service so the outside world can reach port 80 — stage 8, and note the permanent-then-reload pattern. **(4) Drop an `index.html`** into `/var/www/html` (the `tee` trick writes to a root-owned file through `sudo`). **(5) Verify**: `curl http://localhost` should return your page, and **`journalctl -u httpd`** shows the service's own log of starting and serving — stage 5.",
        "**If the capstone fails, you now know how to debug it**, and that's the real lesson. Page won't load? Check `systemctl status httpd` (is it running?), then `journalctl -u httpd` (what did it complain about?), then `firewall-cmd --list-services` (is http open?), then — the Red Hat special — `getenforce` and `sudo ausearch -m AVC -ts recent` (is SELinux blocking it, e.g. because your content is mislabeled?). That four-stop checklist — service, logs, firewall, SELinux — diagnoses the vast majority of 'it doesn't work' on this family.",
      ],
      exercise:
        "Provision a working web server end to end, then break and fix it. Run the five capstone commands and " +
        "confirm `curl http://localhost` returns your greeting. Now make it real: from another machine (or after " +
        "opening the port), browse to the server's IP. Then *deliberately* cause a failure — `sudo systemctl stop " +
        "httpd` and watch `curl` fail and `systemctl status httpd` show 'inactive'; restart it. Finally, schedule " +
        "a tiny maintenance job: write a one-line script that appends the date to a log file, and run it nightly " +
        "via either `crontab -e` *or* a `.timer` unit — then prove it's scheduled with `crontab -l` or " +
        "`systemctl list-timers`.",
      drills: [
        "Run `systemctl list-timers --all` and read the `NEXT` and `LEFT` columns — when do existing timers fire?",
        "Translate three cron lines in words: `*/15 * * * *`, `0 0 * * 0`, `30 4 1 * *`. (Check yourself against the field order.)",
        "Run `ssh -V` to see your OpenSSH version, and `ls -l ~/.ssh/` after `ssh-keygen` to find your key pair.",
        "After the capstone, run the four-stop debug checklist even though nothing's broken: `systemctl status httpd`, `journalctl -u httpd -n 5`, `firewall-cmd --list-services`, `getenforce`.",
      ],
      note:
        "Prefer systemd timers over cron on modern Red Hat systems: journal integration and `Persistent=true` " +
        "(catch-up after downtime) make them more reliable, though cron is simpler for a quick one-liner and still " +
        "perfectly valid. And the capstone's debug order — **service → logs → firewall → SELinux** — is the single " +
        "most useful habit you can take from this whole course.",
    },
  ],
};
