/* =====================================================================
   Carino Learn — course: PC Architecture  (silicon, buses & boot)
   Goal: take someone who uses computers all day from "it's a magic box"
   to reading lscpu/lspci/smartctl fluently, understanding what every
   part on the board does, following the boot chain failure by failure,
   and speccing/diagnosing real machines with confidence.
   Same beginner-first contract as the other modules: every stage has a
   line-by-line `walkthrough` and small `drills`.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["pcarch"] = {
  id: "pcarch",
  title: "PC Architecture",
  tag: "silicon, buses & boot",
  icon: "ram",
  blurb: "Learn the machine from the silicon up: CPU, caches, RAM, buses, storage, firmware and boot — read live off your own Linux box.",
  intro:
    "Every command you type lands on a physical machine: a CPU juggling caches, RAM answering a " +
    "hundred nanoseconds later, PCIe traffic fanning out to disks and GPUs, firmware that ran before " +
    "any operating system existed. Twelve stages walk that whole machine — **the core** (CPU, caches, " +
    "memory), **the board** (buses, storage, GPU, power), **firmware & boot**, and finally **building " +
    "and diagnosing** real hardware. Your Fedora box is the textbook: nearly every stage is driven by " +
    "`lscpu`, `lspci`, `smartctl`, `sensors` and a little `/proc` and `/sys` spelunking — no screwdriver " +
    "required until you want one. This is the floor under the Assembly module: that course teaches the " +
    "CPU's language, this one teaches the machine the language runs on.",
  meta: [["Platform", "x86-64 · Fedora Linux"], ["Domain", "hardware & firmware"], ["Style", "interrogate your own machine"]],

  tracks: [
    { id: "core",  label: "The core",              stages: [0, 1, 2] },
    { id: "board", label: "The board",             stages: [3, 4, 5, 6] },
    { id: "boot",  label: "Firmware & boot",       stages: [7, 8] },
    { id: "build", label: "Building & diagnosing", stages: [9, 10, 11] },
  ],

  reference: [
    {
      kind: "table",
      title: "Latency numbers to memorize",
      head: ["where the data was", "how long the trip takes"],
      rows: [
        ["register",              "~0.3 ns — one cycle, effectively free"],
        ["L1 cache hit",          "~1 ns"],
        ["L2 cache hit",          "~4 ns"],
        ["L3 cache hit",          "~12 ns"],
        ["DRAM (main memory)",    "~80–100 ns"],
        ["NVMe SSD read",         "~20–100 µs"],
        ["SATA SSD read",         "~100–300 µs"],
        ["HDD seek + rotate",     "~5–10 ms"],
        ["same-city network RTT", "~1–5 ms"],
        ["cross-continent RTT",   "~80–150 ms"],
      ],
      foot: "The gaps are the story: RAM is ~100× slower than L1, disk is ~1,000× slower than RAM. **Every layer exists to hide the one below it.**",
    },
    {
      kind: "table",
      title: "Bus & connector bandwidth cheat-sheet",
      head: ["link", "throughput (each direction)"],
      rows: [
        ["PCIe 3.0 x4",        "~4 GB/s — the classic NVMe slot"],
        ["PCIe 4.0 x4",        "~8 GB/s — current NVMe"],
        ["PCIe 4.0 x16",       "~32 GB/s — the GPU slot"],
        ["PCIe 5.0 x16",       "~64 GB/s"],
        ["SATA III",           "0.6 GB/s ceiling — every SATA SSD parks against it"],
        ["DDR4-3200, 1 channel", "25.6 GB/s"],
        ["DDR5-5600, 1 channel", "44.8 GB/s — two sticks = two channels = double"],
        ["USB 2.0",            "480 Mb/s (~40 MB/s real)"],
        ["USB 3.2 Gen 2",      "10 Gb/s (~1 GB/s)"],
        ["USB4 / Thunderbolt", "40 Gb/s"],
        ["1 GbE / 10 GbE",     "~118 MB/s / ~1.2 GB/s"],
      ],
      foot: "PCIe roughly **doubles per lane each generation**: 3.0 ≈ 1, 4.0 ≈ 2, 5.0 ≈ 4 GB/s per lane. Multiply by lane count and you can size any link in your head.",
    },
    {
      kind: "cmds",
      title: "Interrogate any Linux box",
      rows: [
        ["CPU model, cores, caches",     "lscpu   (and lscpu -C for the cache table)"],
        ["Draw the whole topology",      "lstopo   (package hwloc)"],
        ["RAM sticks, slots, speeds",    "sudo dmidecode -t memory"],
        ["Every PCIe device, as a tree", "lspci -tv"],
        ["USB tree with real speeds",    "lsusb -t"],
        ["SATA disk health",             "sudo smartctl -a /dev/sda"],
        ["NVMe health & wear",           "sudo nvme smart-log /dev/nvme0"],
        ["Temps, fans, volts",           "sensors"],
        ["The kernel's hardware diary",  "journalctl -k | less"],
        ["Board & firmware identity",    "sudo dmidecode -t 2 -t bios"],
      ],
    },
    {
      kind: "table",
      title: "Symptom → first suspect",
      head: ["what you see", "where to look first"],
      rows: [
        ["no fans, no LEDs, nothing",          "PSU switch, PSU itself, front-panel header wiring"],
        ["fans spin, black screen, no beep",   "RAM seating, CPU power (EPS) cable, GPU seating"],
        ["beeps or blinking debug LEDs",       "count the pattern — the board is naming the failed POST stage"],
        ["No bootable device found",           "NVRAM boot entries (efibootmgr), dead disk, wrong boot order"],
        ["dracut emergency shell",             "initramfs can't find root — did a UUID change?"],
        ["reached emergency.target",           "one bad /etc/fstab line — journalctl -xb names it"],
        ["random freezes under load",          "thermals first (sensors), then RAM (memtest86+), then PSU"],
        ["slow, but nothing looks wrong",      "thermal throttling or a dying disk — sensors + smartctl"],
      ],
      foot: "Cheap checks in rising order of effort: **cables → seating → temperatures → SMART → memtest**.",
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "The machine at a glance",
      tag: "von Neumann on your desk",
      time: "35–45 min",
      payoff:
        "Every part in a PC has one job, and the whole machine is a handful of boxes joined by " +
        "buses. Once you can place CPU, RAM, chipset and devices on one diagram — and know which " +
        "link each pair speaks over — every spec sheet, every lspci dump and every upgrade " +
        "decision becomes a question about this picture. The rest of the course just zooms in.",
      concepts: ["von Neumann architecture", "CPU", "RAM", "chipset (PCH)", "PCIe", "DMI link", "bus", "fetch–decode–execute"],
      code:
`              WHAT IS ACTUALLY ON THE BOARD

                +------------------------+
                |          CPU           |
                |  cores · caches · MMU  |
                |  memory controller     |
                |  PCIe root complex     |
                +----+---------+---------+
     DDR channels    |         |     PCIe lanes (direct)
        +------------+         +--------------------+
        v                      v                    v
   +---------+           +-----------+       +------------+
   |   RAM   |           |    GPU    |       |  NVMe SSD  |
   +---------+           |  (x16)    |       |   (x4)     |
                         +-----------+       +------------+
                               |
                     DMI link  |   (a PCIe-x4-ish umbilical)
                +--------------+--------------+
                |         CHIPSET (PCH)       |
                |  SATA · USB · LAN · audio   |
                |  extra PCIe lanes           |
                +--------------+--------------+
                   |         |          |
               SATA disks  USB tree  ethernet

  The 1945 idea underneath (von Neumann):
    one memory holds BOTH code and data;
    the CPU loops forever: fetch -> decode -> execute -> repeat.
  Every other box on this diagram exists to feed that loop.`,
      lang: "txt",
      walkthrough: [
        "**Von Neumann's move** was storing the program in the same memory as the data. That single decision defines the machine: the CPU spends its life fetching instructions and operands out of memory, and the whole hierarchy of caches and buses exists because memory can't keep up with the loop.",
        "**The CPU** is no longer just cores. The memory controller and the PCIe **root complex** moved onto the CPU die years ago (the old 'northbridge' chip is gone), so RAM, the GPU and your NVMe drive talk to the CPU **directly** — that's why those three links are drawn straight into it.",
        "**RAM** hangs off the CPU on dedicated DDR channels. It is the working memory: byte-addressable, fast-ish, and completely amnesiac at power-off. Stage 2 is all about it.",
        "**The chipset** (Intel says PCH, AMD just says chipset) is the CPU's secretary: SATA ports, most USB, onboard ethernet and audio, plus extra PCIe lanes for lesser slots — all funneled through one **DMI link** back to the CPU. Everything below the chipset shares that one umbilical.",
        "**A bus is just a shared road with rules**: address, data, and an agreement about who talks when. PCIe, DDR, SATA, USB — different roads, different speed limits (there's a reference card with the numbers), same idea.",
        "First command of the course: `lscpu`. Model name, socket count, cores, threads, cache sizes — the CPU box of this diagram, in text. `lstopo` (package **hwloc**) will literally draw the whole diagram for your machine.",
        "This course deliberately stops above the instruction set: **what** the CPU executes — registers, mov, jmp, the stack — is the Assembly module's territory. Here we care about the metal that feeds it.",
      ],
      exercise:
        "On your own machine:\n" +
        "  1. Run lscpu. Write down: model name, sockets, cores, threads, L1/L2/L3 sizes.\n" +
        "  2. Install hwloc and run lstopo. Compare its drawing with the diagram above.\n" +
        "  3. Run lspci -tv. Find one device connected straight to the root complex\n" +
        "     and one hanging below the chipset bridge.\n" +
        "  4. Draw the block diagram of YOUR machine from memory: CPU, RAM, GPU,\n" +
        "     each disk, network — with the right bus on every arrow.",
      drills: [
        "Which two components talk to the CPU **without** going through the chipset in a modern PC?",
        "What travels over the DMI link, and why can it become a traffic jam?",
        "State the von Neumann loop in four words. What is the 'stored program' part of the idea?",
        "A spec sheet says 'CPU: 8 cores, PCIe 5.0 x16 + x4'. What do you expect to plug into those lanes?",
        "Which tool draws your machine's topology as a picture?",
      ],
      note:
        "Your **hardware.carino.systems** build-spec cards are this diagram in table form — CPU, RAM, " +
        "storage, network, one row each. By stage 9 you'll be filling those rows with reasons instead " +
        "of part names. And if `lscpu` output feels dense today, it will read like a menu by stage 11.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "Inside the CPU",
      tag: "cores, caches & pipelines",
      time: "50–70 min",
      payoff:
        "A modern CPU is a small city pretending to be a simple machine. Cores versus threads, " +
        "base versus boost, and above all the cache hierarchy — these decide real performance far " +
        "more than the GHz number on the box. After this stage you can read lscpu -C like a floor " +
        "plan and explain why a cache miss costs more than a hundred instructions.",
      concepts: ["core vs thread (SMT)", "frequency & boost", "L1/L2/L3 cache", "cache line", "locality", "cache miss", "pipeline", "branch prediction"],
      code:
`# How many "CPUs" do you really have?
lscpu | grep -E '^(Model name|Socket|Core|Thread|CPU\\(s\\))'
# CPU(s): 12    Socket(s): 1    Core(s) per socket: 6    Thread(s) per core: 2
# -> 6 real cores; SMT doubles the schedulable threads to 12.

# The cache hierarchy, straight from the kernel:
lscpu -C
# NAME ONE-SIZE ALL-SIZE WAYS TYPE        LEVEL
# L1d       32K     192K    8 Data            1    <- per core, data
# L1i       32K     192K    8 Instruction     1    <- per core, code
# L2       512K       3M    8 Unified         2    <- per core
# L3        32M      32M   16 Unified         3    <- shared by all cores

# Or spelunk /sys directly:
grep . /sys/devices/system/cpu/cpu0/cache/index2/size

# Frequency is a negotiation, not a number -- watch it move under load:
watch -n1 "grep MHz /proc/cpuinfo"
cpupower frequency-info | grep -A1 'hardware limits'

# The point of it all, in nanoseconds (at ~4 GHz, 1 cycle = 0.25 ns):
#   L1 hit ~1 ns · L2 ~4 ns · L3 ~12 ns · RAM ~90 ns
#   one RAM trip = ~350 cycles the core could have spent computing`,
      lang: "bash",
      walkthrough: [
        "**Core vs thread**: a core is real hardware — ALUs, its own L1/L2. SMT (Intel's Hyper-Threading) gives one core **two register sets**, so when thread A stalls on memory, thread B uses the idle execution units. Worth maybe 20–30% on mixed workloads, roughly nothing when the core is already saturated — which is why 6c/12t is not 12 cores.",
        "**Frequency & boost**: 'base' is the guaranteed all-core floor, 'boost' an opportunistic sprint the CPU sustains only while power and temperature allow. That's why frequency is a live negotiation (watch it move) and why cooling is a performance part — stage 6 closes that loop.",
        "**The cache hierarchy** is concentric rings of SRAM: tiny-and-instant L1 (split into data and instruction, per core), bigger L2 (per core), big-and-shared L3. Each level is roughly 4–10× larger and slower than the one inside it.",
        "**Why misses dominate**: at 4 GHz a cycle is 0.25 ns, and a RAM round-trip is ~90 ns — about **350 cycles of silence**. A program whose data fits in cache can beat an 'identical' one that misses constantly by 10× or more. The headline lab above turns these numbers into seconds and days — go click through it.",
        "**Locality is the contract**: caches load 64-byte **lines**, not single bytes, and keep what you touched recently. Code that walks arrays in order (spatial locality) or reuses the same working set (temporal locality) gets served from L1; code that hops randomly through gigabytes pays full RAM price every time. The stage-1 mini-lab below lets you feel this.",
        "**Pipelines**: each instruction passes through many stages (fetch, decode, execute, retire…) like an assembly line, so dozens are in flight at once. The line only flows if the CPU knows what comes next —",
        "— which is where **branch prediction** comes in: at every `if`, the CPU **guesses** the outcome and keeps the line full speculatively. A correct guess is free; a wrong one flushes ~15–20 stages of work. Predictable branches (sorted data, steady loops) are one of the quiet reasons some code is inexplicably fast.",
      ],
      exercise:
        "1. Run lscpu -C and sketch your hierarchy: sizes and what is per-core vs shared.\n" +
        "2. Open two terminals: watch -n1 \"grep MHz /proc/cpuinfo\" in one, then load\n" +
        "   all cores in the other (stress-ng --cpu 0 --timeout 30, or a big compile).\n" +
        "   Watch boost clocks rise, then settle as heat arrives.\n" +
        "3. From the latency card: compute how many 0.25 ns cycles fit in one 90 ns RAM\n" +
        "   trip, one 80 us NVMe read, one 5 ms HDD seek. Write the three numbers down.\n" +
        "4. In the mini-lab below, find the access pattern with the WORST hit rate and\n" +
        "   explain in one sentence why it loses.",
      drills: [
        "Your machine says 8 cores / 16 threads. How many independent register sets exist? How many sets of ALUs?",
        "Why is L1 split into L1d and L1i while L2 and L3 are unified?",
        "A loop sums a 16 KB array a thousand times. Which cache level serves almost every read after the first pass?",
        "Rank by cost: L1 hit, mispredicted branch, L3 hit, RAM access. (Rough cycle counts.)",
        "Why can adding cores make a memory-bound program **no faster at all**?",
      ],
      note:
        "The Assembly module shows these same mechanics from the software side — registers, the " +
        "stack, `cmp`/`je` driving the pipeline's guesses. If you've done it, reread its stage 0 " +
        "after this one: the fetch–execute loop and the cache hierarchy are two halves of one story.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "Memory: the DRAM story",
      tag: "channels, timings & the OOM killer",
      time: "50–70 min",
      payoff:
        "RAM is where your programs actually live, and it is misunderstood at every level — " +
        "people buy one stick and halve their bandwidth, panic at 'free' being small, and meet " +
        "the OOM killer without knowing his name. This stage covers the physics, the shopping " +
        "(channels, DDR generations, ECC) and the reading of free and /proc/meminfo like an admin.",
      concepts: ["DRAM cell & refresh", "channels & ranks", "DDR4/DDR5 & MT/s", "CAS latency", "ECC", "virtual memory & page tables", "page cache", "OOM killer"],
      code:
`free -h
#                total   used   free  shared  buff/cache  available
# Mem:            31Gi   8.2Gi  2.1Gi   612Mi        21Gi        22Gi
# 'free' being tiny is GOOD: unused RAM is wasted RAM.
# The kernel fills spare RAM with disk cache (buff/cache) and drops it
# the instant a program wants the space -- so read 'available', not 'free'.

# What is physically in the slots?
sudo dmidecode -t memory | grep -E 'Size|Locator|Speed|Total Width'
#  Size: 16 GB   Locator: DIMM_A1   Speed: 3200 MT/s   Total Width: 64 bits
#  Size: 16 GB   Locator: DIMM_B1   Speed: 3200 MT/s   Total Width: 64 bits
# Two sticks in A1+B1 -> dual channel = double bandwidth.
# Total Width 72 bits (64 data + 8 check) would mean ECC.

# Virtual memory at a glance:
grep -E 'MemAvailable|SwapTotal|Dirty|Mapped' /proc/meminfo

# And when it all runs out, the kernel executes a hostage:
sudo dmesg | grep -i 'out of memory'
# Out of memory: Killed process 4312 (chromium) total-vm:9812344kB ...`,
      lang: "bash",
      walkthrough: [
        "**A DRAM bit is a leaky capacitor** — charged = 1, and it self-discharges, so every cell is re-read and re-written thousands of times a second (**refresh**). That's the D in DRAM and the reason it's dense and cheap but ~100× slower than the SRAM in your caches, which holds state with six transistors and no refresh.",
        "**Channels**: the memory controller has independent 64-bit channels, and two sticks in the right slots (usually A2+B2 — read the board manual) serve them in parallel. One stick literally halves memory bandwidth; it is the most common self-inflicted wound in budget builds.",
        "**DDR generations & timings**: DDR4-3200 means 3200 **MT/s** (transfers, not MHz — DDR is double data rate). CAS latency (CL) counts cycles to first data. The dirty secret: true latency in nanoseconds has hovered near ~10 ns for twenty years — generations buy **bandwidth**, not lower latency, which is why the cache lessons of stage 1 never expire.",
        "**ECC** adds 8 check bits per 64 (Total Width: 72 bits) and corrects single-bit flips — which cosmic rays and marginal cells genuinely cause. Desktops shrug errors off as mystery crashes; a long-uptime server quietly corrupting an archive is worse. That's why stage 9 specs ECC for the PACS box.",
        "**Virtual memory**: every process sees a private, flat address space; **page tables** translate each 4 KB page to wherever it really lives (RAM, or disk if swapped), with the TLB caching translations. This is isolation, swap, and memory-mapped files, all from one mechanism — intuition level is enough here.",
        "**Reading `free`**: `buff/cache` is the page cache — recently-read files kept in otherwise-idle RAM. It's reclaimable, so **available** ≈ free + droppable cache is the real headroom. Alarm at low `available`, never at low `free`.",
        "**The OOM killer**: when RAM and swap are truly exhausted, the kernel scores every process and kills the worst offender rather than deadlock the machine. The verdict lands in `dmesg` — if a process 'just vanished', that's the first place to look.",
      ],
      exercise:
        "1. Run free -h. Compute: how much page cache would the kernel drop for a\n" +
        "   sudden 10 GB allocation? Would it survive without swapping?\n" +
        "2. Run sudo dmidecode -t memory. How many slots does the board have, how many\n" +
        "   are filled, at what speed, and are you running dual channel?\n" +
        "3. Check Total Width. ECC or not?\n" +
        "4. Watch the page cache work: time grep -r foo /usr/share/doc >/dev/null, then\n" +
        "   run the exact command again. Explain the speedup with /proc/meminfo's Cached.\n" +
        "5. Search your logs for past OOM kills: journalctl -k | grep -i 'out of memory'.",
      drills: [
        "Why does one 32 GB stick often perform worse than two 16 GB sticks?",
        "DDR5-5600 CL36 vs DDR4-3200 CL16 — which wins on bandwidth? Is the latency gap as big as it looks?",
        "A colleague says 'my server shows 200 MB free, it needs more RAM!' — what do you check before agreeing?",
        "What does Total Width: 72 bits tell you, and which of your machines deserves it most?",
        "Name the kernel mechanism that turns idle RAM into a disk accelerator.",
      ],
      note:
        "Page tables, TLB shootdowns and hugepages go deep — this stage keeps them at intuition level " +
        "on purpose. The one habit to take away: on any slow machine, `free -h` **before** theories. " +
        "Swapping (nonzero `si`/`so` in vmstat — stage 11) explains more mystery slowness than any other single cause.",
    },
    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Motherboard, chipset & buses",
      tag: "PCIe is the tree of life",
      time: "50–70 min",
      payoff:
        "Everything in a PC that isn't CPU or RAM hangs off a tree of PCIe links, and lspci -tv " +
        "shows you that tree exactly. Learn lanes and generations and you can do link bandwidth " +
        "math in your head, spot a GPU negotiated down to x4, and explain why three NVMe drives " +
        "behind the chipset fight over one uplink. This is the stage that makes spec sheets honest.",
      concepts: ["PCIe lanes & generations", "root complex", "link negotiation", "DMI uplink", "M.2 lane sharing", "USB tree & speeds", "lspci addressing"],
      code:
`# Every device, as the tree it really is:
lspci -tv
# -[0000:00]-+-00.0  Root Complex
#            +-01.1-[01]----00.0  Samsung NVMe SSD     <- x4 straight to the CPU
#            +-03.1-[03]----00.0  NVIDIA RTX 4060      <- x16 straight to the CPU
#            \\-02.1-[02-07]--+-00.0 SATA controller    <- everything from here
#                            +-00.1 USB controller        down lives BEHIND
#                            \\-00.2 Ethernet              the chipset uplink

# How wide and how fast is a link REALLY running?
sudo lspci -vv -s 03:00.0 | grep -E 'LnkCap|LnkSta'
#  LnkCap: Speed 16GT/s, Width x16     <- what it CAN do (PCIe 4.0)
#  LnkSta: Speed 16GT/s, Width x16     <- what it negotiated right now
# (LnkSta at 2.5GT/s while idle is power saving, not a fault -- load it, re-check.)

# Per-lane bandwidth you can do in your head, each direction:
#   PCIe 3.0 ~ 1 GB/s    PCIe 4.0 ~ 2 GB/s    PCIe 5.0 ~ 4 GB/s
#   gen4 x4 NVMe ~ 8 GB/s · gen4 x16 GPU ~ 32 GB/s · chipset DMI ~ gen4 x4-ish

# The USB side of the chipset:
lsusb -t
# /:  Bus 02.Port 1: Dev 1, Class=root_hub, Driver=xhci_hcd/10p, 10000M
#     |__ Port 5: Dev 3, If 0, Class=Mass Storage, Driver=usb-storage, 480M
# a "USB 3" disk enumerating at 480M is on a USB 2 port or a bad cable.

# Who made this board, exactly which model?
sudo dmidecode -t 2 | grep -E 'Manufacturer|Product'`,
      lang: "bash",
      walkthrough: [
        "**PCIe is point-to-point**, not a shared party line: each device gets its own link of 1–16 **lanes**, and each lane is an independent serial pipe. Width (x1/x4/x16) and generation multiply: a gen4 x4 link moves ~8 GB/s each way.",
        "**CPU lanes are the scarce resource** — a desktop CPU has maybe 20–28. The x16 GPU slot and one x4 M.2 eat most of them; everything else (SATA, USB, LAN, extra M.2 slots) lives behind the **chipset**, which multiplies lanes but funnels them through one DMI uplink of ~gen4 x4. Three chipset NVMe drives hammered at once share ~8 GB/s — the tree explains the ceiling.",
        "**Link negotiation**: `LnkCap` is the hardware's maximum, `LnkSta` the live agreement. A dusty slot, a x16 card in a x4-wired slot, or a bent pin shows up right here as Width x4 — the single most useful line in `lspci -vv` output.",
        "**M.2 lane sharing** is the classic gotcha the manual whispers about: populating M.2_2 often disables two SATA ports or drops the second slot to x2, because the lanes are literally the same wires. Check before you buy a third drive, not after.",
        "**lspci addressing** reads `bus:device.function` — `03:00.0`. Multi-function devices share bus:device and differ in function: a GPU is usually `.0` video plus `.1` HDMI audio.",
        "**USB is its own tree** with the speed printed per node: 480M (USB 2.0), 5000M, 10000M, 20000M. `lsusb -t` showing your 'USB 3' enclosure at 480M just diagnosed a cable without opening anything.",
        "Your NIC also lives on this tree — and the MAC address it exposes starts with the vendor's **OUI**, which is exactly what the MAC decoder on **hardware.carino.systems** looks up. `ip link` for the MAC, your own site for the vendor.",
      ],
      exercise:
        "1. Run lspci -tv. Count: how many devices are direct to the root complex,\n" +
        "   how many behind the chipset bridge?\n" +
        "2. Find your GPU's address (lspci | grep -i vga), then check LnkCap vs LnkSta\n" +
        "   with sudo lspci -vv -s <addr>. Idle first, then under load (glmark2 or a game).\n" +
        "3. Compute the bandwidth of: your GPU link, your NVMe link, the DMI uplink.\n" +
        "   Could your NVMe drives saturate the DMI together?\n" +
        "4. Run lsusb -t and identify the real negotiated speed of every external device.\n" +
        "5. Read your motherboard manual's M.2 section: which slots steal which lanes?",
      drills: [
        "Gen3 x4 vs gen4 x4 vs gen4 x16 — bandwidth of each, from memory.",
        "A GPU benchmarks 15% slow, LnkSta says Width x4. Name two physical causes.",
        "Why can a board offer 8 SATA ports + 3 M.2 slots but not let you use all of them at once?",
        "What's the difference between the root complex and the chipset, one sentence each?",
        "A USB SSD copies at 38 MB/s. Which command proves whether it's the port, and what number are you looking for?",
      ],
      note:
        "PCIe generations are backwards compatible both ways — a gen5 SSD in a gen3 board just runs " +
        "at gen3. That forgiveness is why the used-market advice of stage 9 works: last-gen boards " +
        "run current cards, only slower, and for most workloads the link was never the bottleneck anyway.",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "Storage: spinning rust to NVMe",
      tag: "smartctl is your stethoscope",
      time: "60–80 min",
      payoff:
        "Storage is where performance dies and where data lives — both at once. This stage gives " +
        "you the physics that separates HDD, SATA SSD and NVMe, the endurance numbers that predict " +
        "death, and the smartctl/nvme habit of interviewing every disk you own. For anything that " +
        "archives data — a PACS most of all — this is the load-bearing stage of the course.",
      concepts: ["HDD mechanics", "SATA SSD & AHCI", "NVMe & queues", "IOPS vs throughput", "TBW & endurance", "SMART attributes", "RAID levels", "backup vs RAID"],
      code:
`lsblk -o NAME,SIZE,ROTA,TRAN,MODEL
# NAME     SIZE ROTA TRAN  MODEL
# sda      3.6T    1 sata  WDC WD40EFRX        <- ROTA 1: spinning rust
# nvme0n1  931G    0 nvme  Samsung SSD 980 PRO

# The health interview -- SATA:
sudo smartctl -a /dev/sda | grep -E 'Reallocated_Sec|Current_Pending|Power_On_Hours'
#   5 Reallocated_Sector_Ct  ... RAW_VALUE 0      <- 0 is the only good number
# 197 Current_Pending_Sector ... RAW_VALUE 0      <- anything >0: back up NOW
#   9 Power_On_Hours         ... RAW_VALUE 31207  <- 3.5 years of spinning

# NVMe speaks its own dialect:
sudo nvme smart-log /dev/nvme0 | grep -E 'percentage_used|data_units_written|media_errors'
# percentage_used     : 4%           <- of rated endurance (TBW) consumed
# data_units_written  : 48,201,338   <- x 512 KB ~ 24 TB written so far
# media_errors        : 0

# Why NVMe changed everything: parallelism, not just flash.
#   SATA/AHCI : ONE command queue, 32 deep, built for one moving arm
#   NVMe      : up to 64K queues x 64K deep, one per CPU core, no arm at all
cat /sys/block/sda/queue/nr_requests
cat /sys/block/nvme0n1/queue/nr_requests`,
      lang: "bash",
      walkthrough: [
        "**HDD mechanics**: a real arm physically swings across spinning platters, so every random read pays seek + rotation ≈ 5–10 **milliseconds** — months, on the human scale of the headline lab. Sequential streaming is respectable (~150–250 MB/s); it's the ~100–200 IOPS of random access that kills. Thousands of small files on an HDD is the definition of pain.",
        "**SATA SSD**: flash, no moving parts, ~0.1–0.3 ms access — but strangled twice: the 0.6 GB/s SATA bus, and the AHCI protocol's single 32-deep queue designed around that arm. Still a 50–100× random-IO upgrade over rust, which is why 'add an SSD' resurrects old machines.",
        "**NVMe**: flash speaking a protocol born for it, over PCIe directly. Massive parallel queues, tens of microseconds latency, and gen4 x4 drives streaming ~7 GB/s. The wins you feel are latency and random IOPS, not the sequential headline number.",
        "**Endurance**: flash cells wear per write. Drives are rated in **TBW** (terabytes written) — a 1 TB consumer drive maybe 600 TBW. `percentage_used` from `nvme smart-log` tells you how much life is spent; most desktop drives die of obsolescence long before wear, but a heavy-write server can genuinely eat one.",
        "**SMART attributes worth alarms**: 5 `Reallocated_Sector_Ct` (sectors already swapped for spares), 197 `Current_Pending_Sector` (sectors the drive can't read and hasn't resolved), 187 `Reported_Uncorrect`. The trend matters more than the value — a drive that grows reallocations weekly is dying loudly. `smartctl -t long` (stage 10) makes the drive surface-scan itself.",
        "**RAID quick map**: 0 stripes for speed and doubles your failure odds; 1 mirrors; 5 stripes with one disk's worth of parity (survives one death); 6 survives two; 10 mirrors then stripes. Software RAID (mdadm, btrfs/ZFS) is the honest default at home.",
        "**RAID is uptime, not backup** — it faithfully replicates your rm -rf and your ransomware in real time. A Carino-PACS archive wants RAID for availability **and** an off-machine copy for survival; stage 9 turns this into a spec.",
      ],
      exercise:
        "1. lsblk -o NAME,SIZE,ROTA,TRAN,MODEL -- classify every disk you own.\n" +
        "2. Interview each: smartctl -a for SATA, nvme smart-log for NVMe. Record\n" +
        "   power-on hours, reallocated/pending sectors, percentage_used.\n" +
        "3. Estimate remaining NVMe life: data_units_written x 512 KB versus the\n" +
        "   model's rated TBW (look it up on the vendor sheet).\n" +
        "4. Design storage for a PACS receiving 20 GB/day that must keep 5 years:\n" +
        "   total capacity, tiers (fast vs archive), RAID level, backup plan.\n" +
        "5. Compare random IO yourself: fio --name=r --rw=randread --bs=4k --size=256m\n" +
        "   against an HDD path and an SSD path (or just time grep -r on each).",
      drills: [
        "Why is an HDD fine at streaming video but terrible at a million small DICOM files?",
        "Name the two separate bottlenecks a SATA SSD inherits that NVMe removed.",
        "Which two SMART attributes mean 'back up today', and what does each count?",
        "RAID5 with four 4 TB disks: usable capacity? How many simultaneous deaths survived?",
        "Explain 'RAID is not backup' with one concrete disaster it fails to prevent.",
      ],
      note:
        "Buying rust: NAS drives come **CMR** or **SMR**, and SMR (shingled) drives collapse under " +
        "sustained random writes — fine for cold archive, miserable in RAID rebuilds. Vendors hid " +
        "this for years; check the model sheet. Your PACS archive wants CMR, and stage 9 says so.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "GPUs & accelerators",
      tag: "thousands of dumb cores",
      time: "45–60 min",
      payoff:
        "A GPU is not a fast CPU — it's a different bet entirely: thousands of simple cores doing " +
        "the same operation on different data, in lockstep. Understand that bet and you know when " +
        "a GPU wins by 100×, when it loses to a laptop CPU, what VRAM is really for, and whether " +
        "the machine you're speccing needs a discrete card at all — often the biggest single line " +
        "item in a build.",
      concepts: ["SIMT / data parallelism", "iGPU vs dGPU", "VRAM & bandwidth", "PCIe copy tax", "CUDA / ROCm / Vulkan / OpenCL", "video engines (NVENC/QSV/VAAPI)"],
      code:
`# What GPUs does this box have?
lspci | grep -Ei 'vga|3d|display'
# 00:02.0 VGA compatible controller: Intel UHD Graphics 770      <- iGPU
# 03:00.0 VGA compatible controller: NVIDIA GeForce RTX 4060     <- dGPU

# VRAM: the prefetchable BAR is the window onto it
sudo lspci -v -s 03:00.0 | grep -i prefetchable
#   Memory at ... (64-bit, prefetchable) [size=8G]    <- 8 GB VRAM

# The kernel's view -- one cardN per GPU:
ls /sys/class/drm/
# card0  card1  renderD128  renderD129

# Vendor tools, whichever apply:
nvidia-smi        # NVIDIA: utilisation, VRAM, temps, per-process usage
# rocm-smi        # AMD compute stack
intel_gpu_top     # Intel iGPU, live

# Can the video path use hardware acceleration?
vainfo | head     # VAAPI decode/encode profiles the iGPU offers`,
      lang: "bash",
      walkthrough: [
        "**The architecture bet**: a CPU spends its silicon making a few cores clever — branch prediction, big caches, out-of-order execution. A GPU spends it on **thousands of simple ALUs** that all execute the same instruction on different data (**SIMT**). Pixels, matrix math, ML training: perfect. Branchy, serial, pointer-chasing logic: the thousands of cores idle while one limps.",
        "**When GPU wins**: the work is the same operation over a huge regular array, and there's enough of it to amortize setup. When it loses: small workloads, divergent branches, or anything dominated by moving data — a 100× compute win evaporates if you spend longer copying than computing.",
        "**VRAM** is about bandwidth as much as capacity: GDDR6 feeds the core army at 300–500+ GB/s, versus ~90 GB/s for dual-channel DDR5. Capacity decides what **fits** — spill your model or your textures past VRAM and performance falls off a cliff, because now every access pays…",
        "**…the PCIe copy tax**: data must cross the x16 link (~32 GB/s on gen4) to be computed on, an order of magnitude slower than VRAM. Good GPU code moves data once and keeps it there; the arithmetic from stage 3 tells you why.",
        "**iGPU vs dGPU**: the iGPU lives on the CPU die, shares your system RAM, sips single-digit watts, and is entirely sufficient for desktops, video playback and — via its **media engine** — even serious transcoding. The dGPU costs slot, power and money and earns them only when you actually have parallel work: games, ML, heavy render.",
        "**Compute APIs, namecheck level**: **CUDA** (NVIDIA-only, the ML incumbent), **ROCm/HIP** (AMD's answer), **OpenCL** (portable, aging), **Vulkan compute** (portable, modern), oneAPI (Intel). Practical consequence: if a workload says CUDA, your GPU shopping list says NVIDIA.",
        "**Video engines are separate silicon**: NVENC (NVIDIA), Quick Sync (Intel), exposed on Linux via VAAPI — fixed-function encoders that transcode video at a fraction of the power of shader cores. The ffmpeg command builder on media.carino.systems has a VAAPI toggle; this is the hardware it flips on.",
      ],
      exercise:
        "1. Inventory your GPUs: lspci | grep -Ei 'vga|3d', then find each one's VRAM\n" +
        "   (prefetchable BAR size, or nvidia-smi / /sys for amdgpu).\n" +
        "2. Run vainfo. Which codecs can your iGPU decode and encode in hardware?\n" +
        "3. Transcode 30 s of video twice with ffmpeg: CPU (libx264) vs hardware\n" +
        "   (h264_vaapi or h264_nvenc). Compare wall time and CPU usage during each.\n" +
        "4. For three machines you know, rule: iGPU enough, or dGPU justified? One\n" +
        "   sentence of workload-based reasoning each.",
      drills: [
        "Why does a GPU beat a CPU at matrix multiplication but lose at parsing JSON?",
        "A model needs 10 GB and the card has 8 GB VRAM. What physically happens to performance, and through which link?",
        "Which API name locks you to NVIDIA hardware? Name two portable alternatives.",
        "Why can an iGPU with a media engine out-transcode a 16-core CPU at a tenth of the power?",
        "Your PACS server build sheet has a dGPU line item. Argue for deleting it.",
      ],
      note:
        "The 'accelerator' pattern generalizes: NPUs for ML inference, DSPs, even the NIC offloading " +
        "checksums — modern machines are federations of specialized silicon around a general-purpose " +
        "CPU. The skill is always the same: know what shape of work each part is built for, and what " +
        "the data pays to get there.",
    },
    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Power, cooling & the case",
      tag: "watts in, heat out",
      time: "45–60 min",
      payoff:
        "Every watt a PC draws becomes heat, and heat quietly steals the performance you paid " +
        "for. This stage covers the PSU (ratings, rails, 80 Plus), why TDP is not power draw, " +
        "how thermal throttling hides in plain sight, and how to read sensors before guessing. " +
        "Half of all 'my computer got slow' mysteries end here.",
      concepts: ["PSU rails & wattage", "80 Plus efficiency", "TDP vs real draw", "PL1/PL2 & boost budgets", "thermal throttling", "airflow & positive pressure", "lm_sensors"],
      code:
`sensors
# coretemp-isa-0000
# Package id 0:  +72.0°C  (high = +80.0°C, crit = +100.0°C)
# Core 0:        +68.0°C
# nvme-pci-0400
# Composite:     +54.9°C  (low = -5.2°C, high = +81.8°C)
# fan1: 1180 RPM    fan2: 640 RPM

# Has the CPU been throttling?
journalctl -k | grep -iE 'thermal|throttl'
# CPU3: Package temperature above threshold, cpu clock throttled

# Real draw vs the sticker (Intel; AMD: read RAPL via /sys or turbostat too):
sudo turbostat --quiet --show PkgWatt,PkgTmp,Busy% --interval 5
# Busy%   PkgTmp   PkgWatt
#  99.2       94     142.3     <- "TDP 125 W" was a polite suggestion
#   1.1       41       8.7     <- idle: single digits

# Zone temps without any tools:
cat /sys/class/thermal/thermal_zone*/temp   # millidegrees C`,
      lang: "bash",
      walkthrough: [
        "**The PSU** converts wall AC to DC rails, and modern machines run almost everything off **12 V** (CPU VRMs, GPU, drives all down-convert from it). Wattage rating is the sustained ceiling; quality — clean voltage under sudden load — is what separates a good 650 W unit from a fireworks-adjacent 700 W one. The PSU is the one part that can kill the rest; never buy the mystery brand.",
        "**80 Plus** rates efficiency, not power: Bronze ≈ 85%, Gold ≈ 90%, Titanium ≈ 94% at half load. A Gold unit doesn't make the PC faster — it wastes fewer watts as heat inside its own housing, runs its fan quieter, and pays for itself on 24/7 boxes.",
        "**TDP is a thermal design number, not a power meter**: it's roughly the heat the cooler must handle at sustained base clocks. Boost blows past it on purpose — Intel's PL2 lets a '125 W' chip pull 200+ W for a burst window; the turbostat output above shows 142 W live. Size PSU and cooler for real draw, which you can now measure.",
        "**Thermal throttling** is protection, not failure: at the temperature limit the CPU (or GPU, or NVMe drive) sheds clocks until it's safe. No crash, no popup — just a machine that benchmarks fast for 90 seconds and then quietly loses 30%. The kernel logs it; `journalctl -k` catches it in the act.",
        "**Boost budgets close stage 1's loop**: base clock is the promise, boost is the opportunistic sprint, and temperature is the referee. A better cooler is genuinely a performance upgrade on a chip that's hitting its limit — same silicon, more sustained MHz.",
        "**Airflow is a duct problem**: cool air in the front/bottom, hot air out the back/top, filters on intakes, and slightly more intake than exhaust (**positive pressure**) so dust gets pushed out rather than sucked through every crack. A tidy €10 fan beats an exotic heatsink in a case with no path for air.",
        "**Get the sensors first**: `sudo dnf install lm_sensors && sudo sensors-detect` (accept defaults) populates `sensors` output. Also check NVMe temps — M.2 drives under a GPU cook, throttle writes, and get blamed as 'slow SSD'.",
      ],
      exercise:
        "1. Install lm_sensors, run sensors-detect, then sensors. Record idle temps for\n" +
        "   CPU package, NVMe composite, and every fan RPM.\n" +
        "2. Load all cores for 10 minutes (stress-ng --cpu 0). Watch sensors every 30 s:\n" +
        "   where does the temperature plateau? Did clocks fall from their first-minute peak?\n" +
        "   (watch grep MHz /proc/cpuinfo in a second terminal.)\n" +
        "3. Search history: journalctl -k | grep -i throttl. Has this machine ever throttled?\n" +
        "4. Estimate your build's worst-case draw (CPU boost + GPU board power + ~50 W rest)\n" +
        "   and compare with your PSU rating. Is there 30-40% headroom?\n" +
        "5. Trace your case's airflow on paper: every fan, its direction, the path air takes.",
      drills: [
        "80 Plus Gold vs Bronze on a 24/7 server drawing 100 W: what actually improves, and by roughly how much?",
        "Why can a CPU with 'TDP 125 W' legitimately pull 200 W? Which limit ends the party?",
        "A machine benchmarks great for a minute and then drops 30%. Name the mechanism and the two commands that prove it.",
        "Why is positive case pressure a dust strategy?",
        "Which non-CPU component in an M.2 slot is famous for silent thermal throttling?",
      ],
      note:
        "Watch the failure modes: PSUs die of dried-out capacitors and take voltage regulation with " +
        "them — 'random reboots under GPU load' is the classic obituary. Fans die of dust and age; a " +
        "€5 fan seizing can cook a €500 GPU. `sensors` once a month on machines you care about is " +
        "cheap insurance, and stage 10 turns it into a logging habit.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "Firmware: UEFI & friends",
      tag: "the OS before the OS",
      time: "50–70 min",
      payoff:
        "Before any disk is read, a full operating system you didn't install — the firmware — has " +
        "already trained your RAM, enumerated your buses and decided what to boot. UEFI, NVRAM " +
        "boot entries, Secure Boot and the TPM are where 'it won't boot' and 'dual-boot broke' " +
        "problems actually live, and efibootmgr is the tool that makes them boring.",
      concepts: ["SPI flash firmware", "POST", "UEFI vs legacy BIOS", "GPT & the ESP", "NVRAM boot entries", "efibootmgr", "Secure Boot & shim", "TPM & measured boot"],
      code:
`# Are we booted via UEFI? (a legacy-BIOS boot has no efi dir at all)
ls /sys/firmware/efi/ && echo "UEFI boot"

# Firmware identity and age -- every vendor shows here:
sudo dmidecode -t bios | grep -E 'Vendor|Version|Release Date'

# The boot menu lives in NVRAM on the board, not on any disk:
efibootmgr -v
# BootCurrent: 0001
# BootOrder: 0001,0004
# Boot0001* Fedora     HD(1,GPT,8a34...)/File(\\EFI\\fedora\\shimx64.efi)
# Boot0004* UEFI: SanDisk USB
# The firmware's F12 menu is literally THIS list.

# The ESP: a plain FAT32 partition full of .efi executables
lsblk -o NAME,PARTTYPENAME | grep -i efi
ls /boot/efi/EFI/
# BOOT  fedora

# Secure Boot state:
mokutil --sb-state
# SecureBoot enabled

# Is there a TPM, which version?
ls /sys/class/tpm/                            # tpm0 -> present
cat /sys/class/tpm/tpm0/tpm_version_major     # 2`,
      lang: "bash",
      walkthrough: [
        "**Firmware is code in a SPI flash chip on the motherboard** — it runs the instant the CPU leaves reset, before any disk exists as a concept. 'BIOS update' means reflashing that chip; the settings screen you get with Del/F2 is its user interface.",
        "**POST** (power-on self test) is firmware's opening act: train the RAM (those seconds of black screen on a new build are literally memory timing negotiation), enumerate PCIe, find a display. Fail before video works and the board can only talk in **beep codes or blink patterns** — stage 10 reads them.",
        "**UEFI replaced legacy BIOS** and the differences are structural: GPT partitioning (no 2 TB limit), boot programs as ordinary **.efi files on a FAT32 partition** instead of a 512-byte boot sector, a boot menu stored in the board's NVRAM, and drivers/network stacks inside the firmware itself. Legacy 'CSM' boot still exists as a compatibility ghost — mixing the two modes is a classic dual-boot disaster.",
        "**The ESP** (EFI System Partition) is refreshingly mundane: a FAT32 partition, mounted at `/boot/efi` on Fedora, holding `\\EFI\\fedora\\shimx64.efi` and friends. You can list it, copy files onto it, and fix half of all boot problems with nothing more exotic than `cp`.",
        "**NVRAM boot entries** are the part nobody tells beginners: the firmware keeps a small database — label, disk GUID, path to a .efi file — and `efibootmgr` reads and edits it. 'My OS disappeared after a board swap' usually means the **entries** are gone while the disk is fine; one `efibootmgr -c` (or reinstalling shim) rebuilds them.",
        "**Secure Boot** has the firmware verify signatures on what it loads. Fedora boots with it enabled via **shim**, a small Microsoft-signed loader that then verifies GRUB and the kernel. Cost: unsigned kernel modules (out-of-tree drivers) need MOK enrollment — that's what `mokutil` manages.",
        "**TPM and measured boot, one paragraph**: the TPM is a small vault chip; during boot each stage **hashes the next into TPM registers (PCRs)** before running it. Secrets — like a disk-encryption key — can be **sealed** to expected hash values: boot the untampered chain and the TPM releases the key, boot anything modified and it refuses. Verification (Secure Boot) and measurement (TPM) are complementary, not the same thing.",
      ],
      exercise:
        "1. Confirm UEFI: ls /sys/firmware/efi. Then dump your firmware vendor, version\n" +
        "   and date with dmidecode -t bios. Is a newer firmware available for your board?\n" +
        "2. Run efibootmgr -v. Map every entry to a real disk and .efi file -- mount\n" +
        "   point /boot/efi, ls its EFI/ directory and match the paths.\n" +
        "3. Check mokutil --sb-state and whether /sys/class/tpm/tpm0 exists. Note both\n" +
        "   on your machine's spec card.\n" +
        "4. Reboot once into the firmware setup (systemctl reboot --firmware-setup).\n" +
        "   Find: boot order, Secure Boot toggle, XMP/EXPO memory profile. Change nothing.\n" +
        "5. On paper: your board dies and you move the disk to a new board. List the\n" +
        "   steps to boot again, in order.",
      drills: [
        "Where physically does firmware live, and where do UEFI boot entries live? (Two different answers.)",
        "Name three structural differences between UEFI and legacy BIOS boot.",
        "What is the ESP — filesystem, typical mount point, and contents?",
        "What does shim exist to solve, and who signed it?",
        "Distinguish Secure Boot from measured boot in one sentence each.",
      ],
      note:
        "The CMOS coin cell (CR2032) keeps NVRAM settings and the clock alive; when it dies after " +
        "5–10 years the machine forgets boot order and time, and old boards refuse to POST — a €1 " +
        "battery masquerading as a dead motherboard. It's the first suspect on any used machine from " +
        "the stage 9 shopping trips.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "The boot chain",
      tag: "power button to login",
      time: "50–70 min",
      payoff:
        "Boot is a relay race with nine runners, and every failure symptom names the runner who " +
        "dropped the baton. Learn the chain once — firmware, ESP, bootloader, kernel, initramfs, " +
        "PID 1 — and 'it won't boot' stops being panic and becomes a lookup: how far did it get, " +
        "therefore what broke, therefore which tool fixes it.",
      concepts: ["POST", "boot entry selection", "ESP & shim", "GRUB / systemd-boot", "kernel + initramfs", "dracut", "pivot to real root", "PID 1 & targets"],
      code:
`POWER BUTTON -> the relay race, and where each runner drops the baton

 [1] PSU         power rails stabilise; POWER_GOOD releases the CPU
      fails as: nothing at all -- no fans, no LEDs
 [2] FIRMWARE    POST: RAM trained, PCIe enumerated, display found
      fails as: fans spin, screen black, beep/blink codes
 [3] NVRAM       firmware walks BootOrder, picks an entry (efibootmgr)
      fails as: "No bootable device found"
 [4] ESP         FAT32 partition read; \\EFI\\fedora\\shimx64.efi loaded
      fails as: entry silently skipped -> next entry or setup screen
 [5] BOOTLOADER  shim -> GRUB: menu, then loads kernel + initramfs to RAM
      fails as: grub rescue>  prompt
 [6] KERNEL      vmlinuz unpacks, drivers probe -- nothing mounted yet
      fails as: kernel panic (rare -- suspect RAM or a bad update)
 [7] INITRAMFS   dracut mini-root: finds the REAL root by UUID, mounts it
      fails as: dracut emergency shell -- "root not found"
 [8] PID 1       systemd on the real root: fstab mounts, units, targets
      fails as: "reached emergency.target" -- usually one bad fstab line
 [9] GREETER     display manager starts on graphical.target -> login
      fails as: black screen with cursor -- GPU driver / DM crash loop

read the race afterwards:   journalctl -b        (this boot, full story)
                            journalctl -b -1     (the boot that died)
                            systemd-analyze blame  (who was slow)`,
      lang: "txt",
      walkthrough: [
        "**Steps 1–4 are last stage's material in motion**: PSU, POST, NVRAM entry, ESP. Notice how clean the diagnosis is this early — no fans is electrical, black-screen-with-fans is POST, 'no bootable device' is the NVRAM/disk layer. Nothing OS-related can be at fault yet, because no OS has run.",
        "**The bootloader (5)** — GRUB on Fedora — exists to do exactly one job: show a menu, then load two files into RAM: the kernel (`vmlinuz-…`) and the **initramfs**, passing the kernel a command line (`cat /proc/cmdline` shows the one you booted with, including `root=UUID=…`).",
        "**The kernel (6)** unpacks, probes hardware, starts scheduling — and at this instant has mounted **no filesystem at all**. It needs a root filesystem to do anything useful, but the driver or LVM/RAID/crypto setup needed to reach that root might be… on the root. Chicken, meet egg.",
        "**The initramfs (7)** is the answer: a small compressed root filesystem, built per-machine by **dracut**, glued to the kernel by the bootloader. It contains just enough drivers and scripts to find the real root by UUID, mount it, and **pivot** onto it. When it can't — UUID changed, disk moved, rebuilt initramfs missing a driver — you get the famous **dracut emergency shell**. Fix: check `blkid` against `/proc/cmdline`, then `dracut -f` from a rescue boot.",
        "**PID 1 (8)**: with the real root mounted, the kernel executes `/usr/lib/systemd/systemd` — process 1, ancestor of everything. It mounts `/etc/fstab`, orders units by dependency, and climbs to a **target**. One unmountable fstab line drops you to **emergency.target**; `journalctl -xb` names the guilty line. This is exactly where the Linux module's systemd stage picks up the story.",
        "**The greeter (9)**: `graphical.target` pulls in the display manager (gdm), which is just another service — black screen with a working machine underneath usually means GPU driver or DM, and Ctrl+Alt+F3 to a text console proves the rest of the system is alive.",
        "**The diagnostic method is the diagram**: every symptom in the right column is a bookmark into the chain. Everything before your symptom worked; everything after never ran. The mini-lab below lets you rehearse exactly this.",
      ],
      exercise:
        "1. Read your machine's last boot: journalctl -b. Find the first kernel line,\n" +
        "   the initramfs-to-real-root switch, and the display manager starting.\n" +
        "2. Run systemd-analyze and systemd-analyze blame. What dominates your boot time?\n" +
        "3. cat /proc/cmdline -- identify the root= UUID, then match it with blkid.\n" +
        "4. In a VM (never your real machine): add a nonsense line to /etc/fstab and\n" +
        "   reboot. Read the emergency.target messages, fix it, reboot clean.\n" +
        "5. From memory, write the nine steps and one failure symptom for each.",
      drills: [
        "Boot stops at grub rescue>. Which steps completed? Which file(s) are suspect?",
        "dracut emergency shell: what couldn't be found, and which two commands do you compare?",
        "Why does the initramfs exist at all? What is the chicken-and-egg it solves?",
        "reached emergency.target vs a black screen with cursor — which runner dropped the baton in each?",
        "Which single command shows you the full story of the boot that just failed, after you rescue-boot?",
      ],
      note:
        "Fedora keeps three kernels installed for exactly this chain's sake: when a new kernel or a " +
        "botched initramfs breaks step 6–7, the GRUB menu's previous entry is your parachute. That's " +
        "also the order of a good rescue: old kernel first, live USB second, blaming hardware last.",
    },
    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "Spec a build that makes sense",
      tag: "bottleneck thinking",
      time: "60–90 min",
      payoff:
        "A good build isn't the most parts — it's money placed exactly where the workload lives. " +
        "This stage teaches the compatibility gauntlet (socket, chipset, RAM, PSU, case), the " +
        "bottleneck thinking that specs a PACS server, a gaming rig and a NAS completely " +
        "differently, and the used-market wisdom that gets you server-grade hardware for desktop " +
        "money.",
      concepts: ["socket & chipset matching", "workload-first speccing", "dual-channel & QVL", "PSU sizing", "used-market strategy", "Dell service tags", "burn-in on arrival"],
      code:
`THREE MACHINES, THREE MASTERS -- spec to the workload, not the hype

 PACS / file server  (the Carino-PACS box)
   CPU    4-8 efficient cores -- DICOM receive is IO, not compute
   RAM    32 GB, ECC if the platform allows: long uptimes, silent flips are real
   disk   two tiers: NVMe for OS + database, big CMR HDDs (RAID1/5) for archive
   net    the REAL spec: 2.5/10 GbE moves the studies; the CPU never notices
   GPU    none. money spent here is money burned

 gaming rig  (1440p)
   GPU    ~half the whole budget -- it IS the frame rate
   CPU    6-8 fast cores; beyond that, diminishing fps
   RAM    32 GB in TWO sticks -> dual channel (one stick quietly halves bandwidth)
   disk   one NVMe; it buys load times, nothing else cares
   PSU    quality 750 W -- modern GPU transient spikes are brutal

 NAS / homelab
   case   the spec is DRIVE BAYS and quiet fans
   CPU    low-TDP quad; it idles 95% of its life
   RAM    16-32 GB (more if ZFS -- the ARC eats whatever you give it)
   disk   NAS-rated CMR drives, one SSD for cache
   power  24/7 math: 10 W idle vs 60 W idle is real money every year

 the compatibility gauntlet, in order:
   socket (AM5 / LGA1851) -> chipset features -> RAM type the BOARD takes
   -> M.2 lanes shared with SATA? -> PSU wattage + connectors -> cooler
   height + GPU length vs the case`,
      lang: "txt",
      walkthrough: [
        "**The gauntlet is a dependency chain**: CPU socket dictates the board family, chipset dictates lanes/USB/overclocking, the board dictates DDR4 vs DDR5 (never both), stage 3's lane-sharing dictates how many drives you really get, and the PSU must cover worst-case draw (stage 6) **with the right connectors**. Run the chain in order and incompatible builds become impossible.",
        "**Workload-first thinking**: name the busiest component before spending a cent. The three sheets above disagree wildly on purpose — the PACS box puts its money in disks and the NIC because DICOM serving is IO; the gaming rig feeds a GPU; the NAS optimizes for bays, silence and idle watts. Same budget, three unrecognizable machines. The mini-lab below lets you test this instinct.",
        "**The PACS sheet, justified by earlier stages**: ECC from stage 2 (archives + uptime), CMR RAID + smartctl monitoring from stage 4, no GPU from stage 5, and the NIC from stage 3's arithmetic — 1 GbE is ~118 MB/s, so a 500 MB CT study takes 4+ seconds of pure wire time. The network is that machine's bottleneck; upgrade it first.",
        "**Easy wins people skip**: two sticks for dual channel, a case the cooler actually fits, checking the board's memory **QVL** (validated stick list) before buying exotic RAM, and enabling XMP/EXPO in firmware — without it that DDR5-6000 kit runs at a sleepy default.",
        "**Used-market wisdom**: off-lease business machines (Dell OptiPlex/Precision, Lenovo ThinkCentre/ThinkStation) are the best value in computing — corporate-fleet quality, boring reliable parts, sold in thousands. Last-gen Xeon/EPYC workstations give you ECC and lanes for a fraction of new. Weak spots: proprietary PSUs in small-form-factor cases, and coin cells (stage 7's note).",
        "**The Dell service-tag trick** from your own hardware.carino.systems: the 7-character tag on any Dell decodes to its exact factory configuration and warranty history on Dell's support site — and the numeric 'Express Service Code' is just the same tag converted from base-36 to decimal, which your site's converter does. Thirty seconds tells you if the listing is honest before you bid.",
        "**Burn-in on arrival**, no exceptions: memtest86+ overnight for RAM, `smartctl -a` for power-on hours and reallocated sectors (a '2 TB, lightly used' drive showing 45,000 hours tells its own story), `sensors` under load for the cooling. Stage 10 is the full toolkit; used purchases are its favorite patients.",
      ],
      exercise:
        "1. Spec the Carino-PACS replacement box on paper: exact part types (not brands)\n" +
        "   for CPU, board, RAM, both disk tiers, NIC, PSU -- one sentence of\n" +
        "   justification per line, citing the stage that taught it.\n" +
        "2. Find three used business machines locally. For any Dell, decode the\n" +
        "   service tag on the support site (and convert it with hardware.carino.systems).\n" +
        "   Does the factory config match the listing?\n" +
        "3. Run one listing through the gauntlet for an upgrade you'd want: can it take\n" +
        "   more RAM? A dGPU (PSU? clearance?)? A 10 GbE card (free slot? lanes?)\n" +
        "4. Write your arrival burn-in checklist: five checks, five commands.",
      drills: [
        "Why does the PACS sheet spend on the NIC and nothing on GPU, while the gaming sheet does the reverse?",
        "List the compatibility gauntlet from memory, in order.",
        "One 32 GB stick or two 16 GB sticks — which, and what does the wrong choice cost?",
        "What do 45,000 power-on hours on a 'lightly used' drive tell you, and which command found them?",
        "What is a Dell Express Service Code, mathematically?",
      ],
      note:
        "Price/performance is a bathtub curve: the newest generation carries an early-adopter tax, " +
        "the oldest can't be upgraded. One generation behind, bought used from a corporate fleet, is " +
        "the sweet spot — and the spec cards on hardware.carino.systems are exactly where a " +
        "justified build sheet should end up once it's real.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Hardware diagnostics",
      tag: "swap, test, listen",
      time: "60–90 min",
      payoff:
        "Diagnosis is not guessing harder — it's a method: read what the machine already told " +
        "you (dmesg, beep codes, SMART), test one subsystem at a time (memtest, long self-tests, " +
        "thermal logs), and swap one known-good part at a time. After this stage a dead or flaky " +
        "machine is a queue of cheap checks in a sensible order, not a mystery.",
      concepts: ["beep/POST codes & debug LEDs", "minimum boot config", "memtest86+", "SMART long self-test", "thermal logging", "one-variable swaps", "dmesg & MCE", "previous-boot journal"],
      code:
`# The kernel saw it first -- always start with what's already logged:
sudo dmesg --level=err,warn | tail -40
journalctl -k -b -1 | tail -50    # the PREVIOUS boot: last words before it died

# RAM: the only test that counts runs OUTSIDE the OS.
# Fedora: sudo dnf install memtest86+  -> reboot, pick it in GRUB.
# One full pass minimum; overnight for intermittent gremlins.
# ONE bit error = bad stick or bad slot. Zero tolerance.

# Disks: don't just ask -- make the drive test itself:
sudo smartctl -t long /dev/sda      # starts the drive's own surface scan
sudo smartctl -l selftest /dev/sda  # the verdict, hours later:
# Num  Test_Description  Status                    LifeTime  LBA_of_first_error
# # 1  Extended offline  Completed: read failure      31401  0x0badcafe   <- replace it
# # 2  Extended offline  Completed without error      29001         -

# Thermals over time, not snapshots -- log, load, read:
while true; do
  echo "$(date +%T) $(sensors | grep 'Package id')" >> /tmp/temps.log
  sleep 5
done   # run your workload in another terminal, then read the log

# Crash-pattern cheat lines:
#  instant power-off under GPU load        -> PSU
#  slow after 20 min + temps at limit      -> throttling / cooling
#  reboots with NOTHING in journal -b -1   -> RAM or PSU (no time to write)`,
      lang: "bash",
      walkthrough: [
        "**Listen before touching**: `dmesg --level=err,warn` and `journalctl -k -b -1` are the machine's own testimony. **MCE** (machine check exception) lines mean the CPU itself flagged a hardware fault; repeated disk I/O errors or PCIe link resets name their component outright. Minutes of reading routinely save hours of swapping.",
        "**When it won't POST, the board still talks**: beep codes through the case speaker, blink patterns, or the four **debug LEDs** on modern boards (CPU/DRAM/VGA/BOOT — the lit one is the stage that failed). Count the pattern, open the manual, and you've localized the failure without tools.",
        "**Minimum boot config** is the no-POST ritual: board out or bench-jumpered, CPU + one RAM stick + iGPU or known-good gpu, nothing else. If it POSTs, add parts back one at a time until it doesn't — the last part added is your suspect. If it doesn't POST bare, the suspects are down to board, CPU, RAM, PSU.",
        "**memtest86+** must run from GRUB, outside the OS, because the kernel can't test the RAM it's standing on. Errors condemn a stick **or a slot** — retest the same stick in another slot to tell which. Intermittent faults need the overnight run; one pass proves less than people hope.",
        "**SMART long self-test** makes the drive read its entire surface with its own firmware — `smartctl -t long`, come back hours later for `-l selftest`. 'Completed: read failure' plus a first-error LBA is a death certificate; combined with stage 4's attributes you can now judge any disk in two commands.",
        "**Thermal logging** catches what snapshots miss: the loop above timestamps package temperature every 5 seconds. If crashes or slowdowns line up with a plateau at the critical temp, you've found the cause — and stage 6 already taught the fix.",
        "**The swap method** is controlled experiment discipline: one variable at a time, known-good spares, write down each result. PSUs and RAM are the cheap, high-yield swaps; the write-it-down part is what separates diagnosis from thrashing — memory of 'wait, did I already try that stick?' does not survive hour three.",
      ],
      exercise:
        "1. Baseline your healthy machine NOW: dmesg error/warn count, SMART self-test\n" +
        "   on every drive, one memtest pass, idle and load temps. Save it all to a file --\n" +
        "   diagnosis is comparison, and this is your known-good.\n" +
        "2. Practice the previous-boot autopsy: journalctl -k -b -1 | tail -50. What were\n" +
        "   the last lines before your most recent shutdown?\n" +
        "3. Run the thermal logger during a 15-minute all-core load. Plot or eyeball:\n" +
        "   plateau temperature, and whether clocks sagged after the first minute.\n" +
        "4. Find your board's manual page for beep codes / debug LEDs. Note what DRAM\n" +
        "   and VGA failures look like on YOUR hardware, before you need to know.",
      drills: [
        "A machine reboots randomly and journalctl -b -1 ends mid-sentence with no errors. Top two suspects, and why is the journal empty?",
        "Describe the minimum boot config and the logic of adding parts back one at a time.",
        "memtest shows errors. What single retest distinguishes bad stick from bad slot?",
        "Which two commands start and read a drive's own surface scan?",
        "Instant power-off only under GPU load — component, and the stage-6 concept that explains it?",
      ],
      note:
        "Respect the order of cheap: reseat cables and RAM before buying anything; a CR2032 before a " +
        "motherboard; a PSU swap before a platform swap. And static discipline costs nothing — touch " +
        "the PSU housing before the parts, handle boards by their edges. The reference card's " +
        "symptom table is this whole stage compressed to eight rows.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "Performance literacy",
      tag: "CPU, RAM, disk or thermal?",
      time: "60–90 min",
      payoff:
        "The capstone: given any slow machine, name the bottleneck in five minutes with four " +
        "commands. vmstat answers 'CPU or RAM?', iostat answers 'disk?', sensors answers " +
        "'thermal?', and the latency numbers you memorized rank every fix by expected payoff. " +
        "This is the skill everything else in the course was quietly building.",
      concepts: ["latency table recall", "vmstat columns", "iostat %util & await", "iowait & D-state", "htop reading", "load average", "the four-question method"],
      code:
`# THE FOUR-QUESTION INTERROGATION OF A SLOW MACHINE

# 1. Is it CPU?
vmstat 1 5
# procs -----------memory---------- ---swap-- ----io---- -system-- ------cpu-----
#  r  b   swpd    free  buff cache    si   so   bi   bo   in   cs  us sy id wa st
#  9  0      0  214000   ...          0    0    ...           ...  96  3  1  0  0
# r > core count and us+sy near 100 -> CPU-bound. id high? keep asking.

# 2. Is it RAM?  (swap traffic is the smoking gun)
#    si/so nonzero in vmstat = actively swapping = RAM-starved.
free -h    # 'available' near zero confirms the verdict (stage 2)

# 3. Is it disk?
iostat -x 1 3
# Device   r/s   w/s   rkB/s   wkB/s  await  %util
# sda      182    41    9214    3102   45.0   98.4   <- 98% busy, 45 ms waits
# nvme0n1    7     2     310      88    0.4   11.9
# %util pinned + await >> the device's natural latency = disk-bound.
# Cross-check: vmstat's b column and wa%, and 'D' state processes in htop.

# 4. Is it thermal?  (the invisible one -- machine 'got slower since morning')
sensors | grep -E 'Package|Composite'
journalctl -k | grep -i throttl

htop   # load average vs core count · red bars (kernel/iowait) vs green (user)
       # per-process: the sort keys F6 -> CPU%, MEM%, and look for state D`,
      lang: "bash",
      walkthrough: [
        "**Ask in this order — CPU, RAM, disk, thermal — because each can masquerade as the next**: swapping shows up as disk traffic, a throttled CPU shows up as 'CPU maxed'. The order unmasks them: check swap before blaming the disk, check temperature before buying a CPU.",
        "**vmstat, four columns tell the story**: `r` is the run queue (more runnable processes than cores = CPU contention), `b` is processes blocked on IO, `si`/`so` are swap-in/out (**any** sustained nonzero = RAM starvation), and the cpu block splits time into us/sy/id/wa. High `wa` (iowait) means cores are idle **waiting for disk** — idle-but-not-really.",
        "**iostat -x, two numbers per device**: `%util` (how busy) and `await` (average milliseconds per request, queue included). Calibrate `await` with the latency card: an HDD at 8 ms is just physics; an NVMe at 8 ms is a queue forty deep — a hundred times its natural latency. Same number, opposite verdicts, and only the memorized table tells you which.",
        "**htop fluency**: load average vs core count (8.0 on 8 cores = saturated, on 32 = coasting — and since load counts D-state too, a dead NFS mount can 'overload' an idle box). Red bar segments are kernel + iowait time; process state **D** is uninterruptible IO wait — three Ds pointing at one disk is a verdict.",
        "**Thermal, the invisible fourth**: no tool in the CPU/RAM/disk trio sees it, yet it produces 'slow when busy, fine after a break' — which users report as haunting. `sensors` at the limit plus a throttle line in `journalctl -k` closes the case; stage 6 has the cure.",
        "**Why the latency table is the capstone**: every verdict prices its fix. Disk-bound on rust? NVMe is ~100× on random IO — transformative. RAM-starved? Stopping swap removes a 1000× penalty on every faulted page. CPU-bound already at 4 GHz in cache? Maybe 1.3× available — buy nothing, fix the code. The table turns 'something is slow' into an ordered shopping list.",
        "**The mini-lab at stage 9 is this method in miniature** — same components, same verdicts, now with the tools to reach them on real machines. Run the four questions on every slow box you meet for a month and it becomes reflex.",
      ],
      exercise:
        "1. Create each bottleneck on purpose, and catch it with the right tool:\n" +
        "   CPU: stress-ng --cpu 0        -> vmstat: r climbs, us pegs\n" +
        "   RAM: stress-ng --vm 4 --vm-bytes 90%  -> vmstat: si/so wake up\n" +
        "   disk: fio randread on the slowest disk -> iostat: %util pins, await grows\n" +
        "   Record the signature of each. This calibrates your eyes.\n" +
        "2. Recite the latency table from memory. Check. Repeat tomorrow.\n" +
        "3. Write your one-page runbook: the four questions, the command and the\n" +
        "   threshold for each, the fix each verdict implies.\n" +
        "4. Apply the full method to your slowest real machine and write the verdict\n" +
        "   line: bottleneck, evidence, cheapest fix that actually helps.",
      drills: [
        "vmstat shows r=14 on 8 cores, si/so=0, wa=2. Verdict?",
        "iostat shows nvme0n1 at await 9 ms, %util 99. Why is this ALARMING for NVMe but normal for an HDD?",
        "Load average 12 on a 16-core box, but everything feels frozen and htop shows five D-state processes. What class of problem is this?",
        "A machine is fast at 9:00 and slow at 9:30 every day. Which of the four questions do the first three miss?",
        "From the latency table: roughly what speedup does HDD -> NVMe buy on random reads? RAM-cache hit vs HDD?",
      ],
      note:
        "You now hold the full loop: read the machine (stages 0–8), spec it (9), fix it (10), and " +
        "measure it (11). A worthy capstone project: add a measured-numbers row to the build cards " +
        "on hardware.carino.systems — idle watts, load temps, iostat await for each box. Specs say " +
        "what a machine has; measurements say what it does.",
    },
  ],
};

/* =====================================================================
   Interactive labs for this course — self-registered (merge-safe with
   js/viz.js and js/labs.js, whichever loads first).
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

  const VIZ = window.COURSE_VIZ = window.COURSE_VIZ || {};
  const LABS = window.COURSE_MINILABS = window.COURSE_MINILABS || {};

  /* ---- headline: the memory hierarchy, at human scale -------------- */
  VIZ["pcarch"] = {
    title: "The memory hierarchy, at human scale",
    blurb:
      "Nine places your data can be, from a register to the far side of the internet. " +
      "Click a tier: real latency, typical capacity, and the translation where " +
      "**one CPU cycle = one second**. This one picture explains why caches exist " +
      "and why touching disk is death.",
    mount(host) {
      const TIERS = [
        { k: "register", lat: "~0.3 ns", ns: 0.3, human: "1 second", cap: "~2 KB (16 integer + vector regs)",
          say: "Registers are **inside** the execution units — zero distance, zero wait. Everything the CPU computes passes through here, and the entire hierarchy below exists only to keep these few bytes fed." },
        { k: "L1 cache", lat: "~1 ns", ns: 1, human: "~3 seconds", cap: "32–64 KB per core",
          say: "One glance at your desk. L1 is tiny SRAM welded to each core, split into data and instruction halves. Code whose hot loop fits here runs at essentially full speed — this is what **locality** buys." },
        { k: "L2 cache", lat: "~4 ns", ns: 4, human: "~13 seconds", cap: "512 KB – 2 MB per core",
          say: "Reaching into a desk drawer. L2 catches what L1 couldn't hold. Notice the deal every level makes: roughly **10× the size for 4× the wait**." },
        { k: "L3 cache", lat: "~12 ns", ns: 12, human: "~40 seconds", cap: "16–96 MB, shared by all cores",
          say: "Walking to a bookshelf across the room. L3 is the last line of SRAM defence, **shared between cores** — one core's greedy working set can evict another's. Miss here and you pay the trip to DRAM." },
        { k: "RAM", lat: "~90 ns", ns: 90, human: "~5 minutes", cap: "8–128 GB",
          say: "Going to another building and back — for **one cache line**. At ~350 cycles per trip, a program that misses cache constantly runs an order of magnitude slower than one that doesn't. This gap is why caches exist at all." },
        { k: "NVMe SSD", lat: "~80 µs", ns: 80000, human: "~3 days", cap: "1–4 TB",
          say: "A thousand RAM trips per access — and this is the **fast** storage. The cliff between RAM and any disk is the biggest in the hierarchy: nanoseconds end here, microseconds begin. Software papers over it with the page cache." },
        { k: "SATA SSD", lat: "~250 µs", ns: 250000, human: "~10 days", cap: "0.5–4 TB",
          say: "Same flash as NVMe, strangled by the SATA bus and its one 32-deep command queue. Still ~50× faster than rust at random IO — the reason an SSD resurrects any old machine." },
        { k: "HDD", lat: "~5 ms", ns: 5000000, human: "~6 months", cap: "4–20 TB",
          say: "**Six months per random read**, because a physical arm has to swing and a platter has to spin underneath it. Sequential streaming is fine; a million small files is a life sentence. Disk IO is death — schedule it, batch it, cache it." },
        { k: "network", lat: "~30 ms RTT", ns: 30000000, human: "~3 years", cap: "everything else on earth",
          say: "A cross-continent round trip: **years**, at human scale. Every network call your code makes is an epoch — which is why one big request beats thirty small ones, and why CDNs move data closer instead of faster." },
      ];
      let cur = 0;
      host.innerHTML = `
        <div class="viz">
          <div class="viz-ctrls wrap" data-r="btns"></div>
          <div class="lnx-read" data-r="stats"></div>
          <div data-r="bars" style="margin:10px 0"></div>
          <p class="asm-msg" data-r="say"></p>
        </div>`;
      $('[data-r="btns"]', host).innerHTML = TIERS.map((t, i) =>
        `<button class="viz-btn mono ${i === cur ? "primary" : ""}" data-i="${i}">${esc(t.k)}</button>`).join("");
      const MAXL = Math.log10(TIERS[TIERS.length - 1].ns / 0.1);
      const pct = (ns) => Math.max(4, Math.round(100 * Math.log10(ns / 0.1) / MAXL));
      function paint() {
        const t = TIERS[cur];
        $$("[data-i]", host).forEach((b) => b.classList.toggle("primary", +b.dataset.i === cur));
        $('[data-r="stats"]', host).innerHTML = [
          ["real latency", t.lat],
          ["at 1 cycle = 1 s", t.human],
          ["typical size", t.cap],
        ].map(([k, v]) => `<div class="lnx-out"><span>${k}</span><code>${esc(v)}</code></div>`).join("");
        $('[data-r="bars"]', host).innerHTML = TIERS.map((x, i) => `
          <div style="display:flex;align-items:center;gap:10px;margin:3px 0;${i === cur ? "" : "opacity:.5"}">
            <code style="flex:0 0 7em">${esc(x.k)}</code>
            <div class="slice-prog" style="flex:1"><div class="slice-prog-fill" style="width:${pct(x.ns)}%"></div></div>
            <span class="ln-dim" style="flex:0 0 7em;text-align:right">${esc(x.human)}</span>
          </div>`).join("") +
          `<div class="ln-dim" style="margin-top:4px">bar length is logarithmic — each step rightward is another order of magnitude</div>`;
        $('[data-r="say"]', host).innerHTML = fmt(t.say);
      }
      host.addEventListener("click", (e) => {
        const b = e.target.closest("[data-i]"); if (!b) return;
        cur = +b.dataset.i; paint();
      });
      paint();
    },
  };

  LABS["pcarch"] = [

    /* ---- at 1: cache hit or miss ---------------------------------- */
    {
      at: 1,
      title: "Cache hit or miss",
      blurb:
        "A direct-mapped cache with 8 lines: every address can live in exactly one line " +
        "(`address mod 8`). Step through four access patterns and watch the hit rate — " +
        "**locality is the whole game**.",
      mount(host) {
        const PATTERNS = [
          { name: "sequential", seq: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
          { name: "tight loop", seq: [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3] },
          { name: "stride 8",   seq: [0, 8, 16, 24, 0, 8, 16, 24, 0, 8, 16, 24] },
          { name: "random",     seq: [5, 22, 3, 17, 9, 30, 12, 3, 25, 7, 19, 3] },
        ];
        let pi = 0, pos = 0, hits = 0, cache = Array(8).fill(null), last = null;
        let msg = "pick a pattern, then Step: each address maps to line `address mod 8`.";
        const reset = () => { pos = 0; hits = 0; cache = Array(8).fill(null); last = null; };
        host.innerHTML = `
          <div class="viz">
            <div class="viz-ctrls wrap">
              ${PATTERNS.map((p, i) => `<button class="viz-btn mono ${i === 0 ? "primary" : ""}" data-p="${i}">${esc(p.name)}</button>`).join("")}
              <button class="viz-btn primary" data-a="step">Step ▸</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <pre class="rx-text" data-r="seq"></pre>
            <div class="rk-grid" data-r="grid"></div>
            <p class="asm-msg" data-r="msg"></p>
          </div>`;
        function paint() {
          const P = PATTERNS[pi];
          $$("[data-p]", host).forEach((b) => b.classList.toggle("primary", +b.dataset.p === pi));
          $('[data-r="seq"]', host).innerHTML = "accesses: " + P.seq.map((a, i) =>
            i < pos ? `<span class="ln-dim">${a}</span>` :
            i === pos ? `<mark class="rx-m0">${a}</mark>` : String(a)).join(" ");
          $('[data-r="grid"]', host).innerHTML = cache.map((v, i) => {
            const cls = last && last.line === i ? (last.hit ? "g" : "r") : (v != null ? "y" : "");
            return `<div class="rk-cell ${cls}"><b>line ${i}</b> ${v == null ? "—" : "addr " + v}</div>`;
          }).join("");
          const rate = pos ? Math.round(100 * hits / pos) : 0;
          $('[data-r="stat"]', host).textContent = `${pos} accesses · ${hits} hits · ${pos - hits} misses · rate ${rate}%`;
          $('[data-r="msg"]', host).innerHTML = fmt(msg);
        }
        function step() {
          const seq = PATTERNS[pi].seq;
          if (pos >= seq.length) {
            msg = `pattern finished — final hit rate **${Math.round(100 * hits / pos)}%**. Try another pattern and compare.`;
            last = null; paint(); return;
          }
          const addr = seq[pos], line = addr % 8, hit = cache[line] === addr, prev = cache[line];
          if (hit) { hits++; msg = `addr ${addr} → line ${line}: **HIT** — the data was already there. Free.`; }
          else if (prev == null) { cache[line] = addr; msg = `addr ${addr} → line ${line}: **MISS** (cold) — first touch, fetched from RAM into the empty line.`; }
          else { cache[line] = addr; msg = `addr ${addr} → line ${line}: **MISS** — evicted addr ${prev}. Addresses ${prev} and ${addr} both map here (${prev} mod 8 = ${addr} mod 8 = ${line}): a **conflict**.`; }
          last = { line, hit }; pos++; paint();
        }
        host.addEventListener("click", (e) => {
          const p = e.target.closest("[data-p]");
          if (p) { pi = +p.dataset.p; reset(); msg = `pattern **${PATTERNS[pi].name}** — press Step.`; paint(); return; }
          const b = e.target.closest("[data-a]"); if (!b) return;
          if (b.dataset.a === "reset") { reset(); msg = "cache emptied."; paint(); }
          else step();
        });
        paint();
      },
    },

    /* ---- at 8: boot, step by step ---------------------------------- */
    {
      at: 8,
      title: "Boot, step by step",
      blurb:
        "Walk the relay race from the power button to the greeter — each step shows " +
        "**what runs, where it lives, and how it fails**. Then pick a failure scenario " +
        "and see exactly which step it kills.",
      mount(host) {
        const STEPS = [
          { k: "power",     runs: "you press the button; the case switch tells the PSU to come up", lives: "front-panel header → PSU PS_ON wire", fail: "nothing at all — no fans, no LEDs" },
          { k: "PSU good",  runs: "rails stabilise; POWER_GOOD releases the CPU from reset", lives: "the power supply itself", fail: "fans twitch for half a second, then dead" },
          { k: "POST",      runs: "UEFI firmware trains RAM, enumerates PCIe, finds a display", lives: "SPI flash chip on the motherboard", fail: "fans spin, screen stays black, beep/blink codes" },
          { k: "NVRAM",     runs: "firmware walks BootOrder and picks an entry", lives: "NVRAM on the board (efibootmgr edits it)", fail: "No bootable device found" },
          { k: "ESP",       runs: "the FAT32 EFI System Partition is read", lives: "small partition mounted at /boot/efi", fail: "entry silently skipped — next entry, or the setup screen" },
          { k: "loader",    runs: "shim verifies and starts GRUB: menu, then kernel + initramfs into RAM", lives: "EFI/fedora/ on the ESP, config in /boot", fail: "grub rescue> prompt" },
          { k: "kernel",    runs: "vmlinuz unpacks, drivers probe hardware — nothing mounted yet", lives: "/boot/vmlinuz-…", fail: "kernel panic (rare — suspect RAM or a bad update)" },
          { k: "initramfs", runs: "dracut's mini-root hunts for the real root filesystem by UUID", lives: "/boot/initramfs-….img", fail: "dracut emergency shell" },
          { k: "PID 1",     runs: "systemd on the real root: fstab mounts, units, targets", lives: "/usr/lib/systemd/systemd", fail: "reached emergency.target — usually one bad fstab line" },
          { k: "greeter",   runs: "the display manager draws the login screen", lives: "gdm.service, pulled in by graphical.target", fail: "black screen with a cursor — GPU driver or DM crash loop" },
        ];
        const SCEN = [
          { name: "— no failure —", dies: -1, why: "" },
          { name: "PSU died", dies: 1,
            why: "everything upstream is fine — you just can't tell, because nothing has power. Swap-test the PSU first; it's the cheapest suspect." },
          { name: "NVRAM wiped / board swapped", dies: 3,
            why: "POST succeeds but the boot menu points at nothing. Boot a live USB and rebuild the entry with `efibootmgr -c` (or reinstall shim)." },
          { name: "root UUID changed / initramfs broken", dies: 7,
            why: "the kernel runs but its mini-root can't find yours. At the dracut prompt: `blkid` vs the kernel cmdline, then rebuild with `dracut -f`." },
          { name: "typo in /etc/fstab", dies: 8,
            why: "systemd hit a mount it can't satisfy and stopped the climb. `journalctl -xb` names the line; fix fstab and reboot." },
        ];
        let i = 0, sc = 0;
        host.innerHTML = `
          <div class="viz">
            <div class="viz-ctrls wrap">
              <button class="viz-btn primary" data-a="step">Step ▸</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
              <label class="gnu-slot"><span class="gnu-slot-name">scenario</span>
                <select data-r="scen">${SCEN.map((s, si) => `<option value="${si}">${esc(s.name)}</option>`).join("")}</select>
              </label>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <div class="br-phases" data-r="ph"></div>
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code data-r="name"></code><span data-r="pos"></span></div>
              <pre class="gnu-pane-b" data-r="pane"></pre>
            </div>
            <p class="asm-msg" data-r="msg"></p>
          </div>`;
        function paint() {
          const dies = SCEN[sc].dies, dead = dies >= 0 && i >= dies;
          $('[data-r="ph"]', host).innerHTML = STEPS.map((s, si) =>
            `<button class="br-phase ${si === i ? "cur" : si < i ? "done" : (dies >= 0 && si > dies) ? "skip" : ""}" data-i="${si}">${esc(s.k)}</button>`
          ).join('<span class="br-sep">›</span>');
          const s = STEPS[i];
          $('[data-r="name"]', host).textContent = s.k;
          $('[data-r="pos"]', host).textContent = `step ${i + 1} / ${STEPS.length}`;
          $('[data-r="pane"]', host).textContent =
            `runs : ${s.runs}\nlives: ${s.lives}\nfails: ${s.fail}`;
          const stat = $('[data-r="stat"]', host);
          stat.classList.toggle("err", dead);
          stat.textContent = dead ? "boot is dead here" :
            i === STEPS.length - 1 ? "login screen — made it" : "";
          $('[data-r="msg"]', host).innerHTML = fmt(dead
            ? `**Dead right here — "${s.fail}".** ${SCEN[sc].why}`
            : dies >= 0
              ? `This step still works — the failure is waiting further down the chain. Keep stepping.`
              : `Every runner so far handed the baton on. The diagnostic gold: a symptom **names the step** — everything before it worked, everything after never ran.`);
        }
        function clamp(n) {
          const dies = SCEN[sc].dies;
          return Math.min(n, dies >= 0 ? dies : STEPS.length - 1);
        }
        host.addEventListener("click", (e) => {
          const p = e.target.closest("[data-i]");
          if (p) { i = clamp(+p.dataset.i); paint(); return; }
          const b = e.target.closest("[data-a]"); if (!b) return;
          if (b.dataset.a === "reset") i = 0; else i = clamp(i + 1);
          paint();
        });
        host.addEventListener("change", (e) => {
          if (!e.target.matches('[data-r="scen"]')) return;
          sc = +e.target.value; i = 0; paint();
        });
        paint();
      },
    },

    /* ---- at 9: bottleneck finder ----------------------------------- */
    {
      at: 9,
      title: "Bottleneck finder",
      blurb:
        "Pick a workload, pick a machine, read the load bars. The verdict names the " +
        "**one component capping everything else** — and the single upgrade that would " +
        "actually move the needle.",
      mount(host) {
        const COMP = ["CPU", "GPU", "RAM", "disk", "network"];
        const WORK = ["gaming 1440p", "code compile", "PACS / file server", "4K video edit"];
        const BUILDS = [
          { k: "budget office", d: "i3 · iGPU · 8 GB · SATA SSD · 1 GbE" },
          { k: "mid gaming",    d: "Ryzen 5 · RTX 4060 · 32 GB · NVMe · 1 GbE" },
          { k: "old server",    d: "2× old Xeon (28c, slow clocks) · no GPU · 64 GB ECC · HDD RAID5 · 10 GbE" },
        ];
        const DATA = [
          [ // gaming 1440p
            { l: [85, 100, 95, 40, 5], v: "**GPU** — the iGPU is the wall at any settings, with 8 GB of RAM drowning right behind it.", u: "a used dGPU (and a second RAM stick while the case is open)." },
            { l: [55, 92, 45, 15, 8], v: "**GPU-bound — and that's correct.** A healthy gaming rig runs its GPU in the 90s while the CPU keeps pace.", u: "nothing sensible; a bigger GPU is the only knob left." },
            { l: [70, 100, 20, 30, 3], v: "**GPU — there isn't one.** Twenty-eight slow server cores cannot draw a single frame.", u: "a dGPU gets it running, but low clocks will still cap fps — wrong machine for the job." },
          ],
          [ // code compile
            { l: [100, 3, 92, 55, 2], v: "**CPU cores** — 4 threads pegged flat, and 8 GB means the linker is one tab away from swapping.", u: "RAM to 32 GB first (swap poisons everything), more cores second." },
            { l: [96, 2, 45, 20, 2], v: "**CPU** — exactly what a compile should look like: every core busy, everything else loafing.", u: "more cores; builds scale almost linearly with a 12/16-core drop-in." },
            { l: [78, 0, 25, 65, 2], v: "**disk** — 28 cores starve while the HDD RAID grinds through thousands of small source-file reads.", u: "one cheap NVMe as the build scratch disk transforms this box." },
          ],
          [ // PACS / file server
            { l: [25, 2, 60, 70, 96], v: "**network** — 1 GbE (~118 MB/s) is the pipe every study squeezes through; the CPU never breaks a sweat.", u: "a 2.5/10 GbE NIC — the cheapest dramatic upgrade in this whole lab." },
            { l: [15, 2, 30, 35, 98], v: "**network** — a gaming rig serving files leaves a 4060 idle while 1 GbE saturates. The money sits in the wrong component.", u: "a 10 GbE NIC; the GPU could have funded three of them." },
            { l: [20, 0, 35, 85, 45], v: "**disk** — 10 GbE finally opens the pipe and the HDD array becomes the wall: thousands of small DICOM files are random-IO poison for spinning rust.", u: "an SSD/NVMe tier for hot studies; keep the HDDs for cold archive." },
          ],
          [ // 4K video edit
            { l: [100, 90, 100, 80, 3], v: "**RAM** — 8 GB with 4K footage means the machine is editing the swap file, not the video. Everything else queues behind it.", u: "RAM to 32 GB — nothing else matters until then." },
            { l: [82, 60, 70, 45, 3], v: "**CPU** — with NVENC handling export, sustained core grunt for effects and scrubbing is the ceiling. A balanced, workable rig.", u: "more cores if exports drag; 64 GB only if timelines go 6K." },
            { l: [92, 100, 35, 75, 3], v: "**GPU** — no hardware encoder, so 28 cores brute-force what a media engine does for free, while HDD scrubbing stutters.", u: "any modern GPU — NVENC/QSV turns overnight exports into a lunch break." },
          ],
        ];
        let wi = 2, bi = 0;
        host.innerHTML = `
          <div class="viz">
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">workload</span>
              ${WORK.map((w, i) => `<button class="viz-btn mono" data-w="${i}">${esc(w)}</button>`).join("")}
            </div>
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">machine</span>
              ${BUILDS.map((b, i) => `<button class="viz-btn mono" data-b="${i}" title="${esc(b.d)}">${esc(b.k)}</button>`).join("")}
              <span class="viz-status" data-r="spec"></span>
            </div>
            <div data-r="bars" style="margin:10px 0"></div>
            <p class="asm-msg" data-r="verdict"></p>
          </div>`;
        function paint() {
          $$("[data-w]", host).forEach((b) => b.classList.toggle("primary", +b.dataset.w === wi));
          $$("[data-b]", host).forEach((b) => b.classList.toggle("primary", +b.dataset.b === bi));
          $('[data-r="spec"]', host).textContent = BUILDS[bi].d;
          const d = DATA[wi][bi];
          const top = Math.max(...d.l);
          $('[data-r="bars"]', host).innerHTML = COMP.map((c, i) => `
            <div style="display:flex;align-items:center;gap:10px;margin:3px 0">
              <code style="flex:0 0 5.5em">${c}</code>
              <div class="slice-prog" style="flex:1"><div class="slice-prog-fill" style="width:${d.l[i]}%;${d.l[i] === top ? "" : "opacity:.55"}"></div></div>
              <span class="ln-dim" style="flex:0 0 3em;text-align:right">${d.l[i]}%</span>
            </div>`).join("");
          $('[data-r="verdict"]', host).innerHTML = fmt(d.v + " **The upgrade that helps:** " + d.u);
        }
        host.addEventListener("click", (e) => {
          const w = e.target.closest("[data-w]");
          if (w) { wi = +w.dataset.w; paint(); return; }
          const b = e.target.closest("[data-b]");
          if (b) { bi = +b.dataset.b; paint(); }
        });
        paint();
      },
    },
  ];
})();
