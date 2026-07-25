/* =====================================================================
   Carino Learn — course: NETWORKING  (from the wire up)
   Goal: take a complete beginner and give them the practical basics of
   essentially every networking topic — the physical wire, addresses and
   subnets, ports and sockets, routing and NAT, DNS, watching real
   traffic, speaking protocols by hand, mapping a LAN, TLS/HTTPS,
   firewalls, a full troubleshooting methodology, and a capstone that
   ties the whole stack together. Written for Linux (Fedora/RHEL tooling:
   ip, dig, ss, tcpdump, nmap, openssl, mtr, nmcli), every stage has a
   hands-on `walkthrough` and small `drills`.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["networking"] = {
  id: "networking",
  title: "Networking",
  tag: "from the wire up",
  icon: "globe",
  blurb: "Understand every layer, from the cable to DNS, TLS and beyond.",
  intro:
    "This is a hands-on tour of practical networking, from the copper (or fibre) in the wall all the " +
    "way up to HTTPS. Thirteen stages take you from 'what even is a network?' to reading packets on the " +
    "wire, debugging DNS, mapping your LAN and diagnosing a broken connection like a pro. Everything runs " +
    "on Linux with the standard Fedora/RHEL toolkit — `ip`, `dig`, `ss`, `tcpdump` and friends — and no " +
    "prior networking knowledge is assumed.",
  meta: [["Scope", "LAN → Internet"], ["Tools", "ip · dig · ss · tcpdump"], ["Host", "Linux"]],

  tracks: [
    { id: "wire",    label: "The wire & addresses", stages: [0, 1, 2, 3] },
    { id: "packet",  label: "Follow a packet",      stages: [4, 5, 6, 7] },
    { id: "operate", label: "Diagnose & secure",    stages: [8, 9, 10, 11, 12] },
  ],

  reference: [
    {
      kind: "table",
      title: "The layers, with a real example at each",
      head: ["Layer", "Job", "Addresses / unit", "You'll meet"],
      rows: [
        ["Application", "the actual conversation", "URLs, hostnames", "HTTP, DNS, SSH, TLS"],
        ["Transport", "port-to-port, reliability", "port numbers, segments", "TCP (reliable), UDP (fast)"],
        ["Network / Internet", "host-to-host across networks", "IP address, packet", "IPv4/IPv6, routing, ICMP"],
        ["Link / Data-link", "next hop on this wire", "MAC address, frame", "Ethernet, Wi-Fi, ARP"],
        ["Physical", "actual signal", "bits on copper/fibre/radio", "Cat6, fibre, PoE"],
      ],
      foot: "The 7-layer OSI model and the 4-layer TCP/IP model describe the same idea — data is wrapped layer by layer as it goes down, and unwrapped on the way up. Live tools for all of this: `https://topo.carino.systems`",
    },
    {
      kind: "table",
      title: "Common ports worth memorising",
      head: ["Port", "Protocol", "What it is"],
      rows: [
        ["22", "TCP", "SSH — remote shell & file transfer"],
        ["53", "UDP/TCP", "DNS — name ↔ IP lookups"],
        ["80", "TCP", "HTTP — plain web"],
        ["443", "TCP", "HTTPS — web over TLS"],
        ["25 / 587 / 465", "TCP", "SMTP — sending mail (587 submission)"],
        ["143 / 993", "TCP", "IMAP — reading mail (993 = TLS)"],
        ["123", "UDP", "NTP — clock synchronisation"],
        ["67 / 68", "UDP", "DHCP — automatic IP assignment"],
        ["3389", "TCP", "RDP — Windows remote desktop"],
        ["3306 / 5432", "TCP", "MySQL / PostgreSQL databases"],
      ],
      foot: "Ports 0–1023 are 'well-known' and need root to bind on Linux; the full list lives in `/etc/services`.",
    },
    {
      kind: "table",
      title: "Private & reserved ranges + CIDR cheat sheet",
      head: ["Range / mask", "Meaning"],
      rows: [
        ["10.0.0.0/8", "private (huge — one big /8)"],
        ["172.16.0.0/12", "private (172.16 – 172.31)"],
        ["192.168.0.0/16", "private (home routers love this)"],
        ["127.0.0.0/8", "loopback — this machine (127.0.0.1)"],
        ["169.254.0.0/16", "link-local (APIPA: DHCP failed)"],
        ["/24 → 256 addrs", "254 usable hosts (e.g. 192.168.1.0/24)"],
        ["/16 → 65,536", "a whole 192.168.x.x block"],
        ["/30 → 4 addrs", "2 usable — point-to-point links"],
        ["/32 → 1 addr", "a single exact host"],
      ],
      foot: "The `/n` (CIDR) counts network bits; host count = 2^(32−n), minus 2 for the network & broadcast address.",
    },
    {
      kind: "cmds",
      title: "Go-to diagnostic one-liners",
      rows: [
        ["My IPs & interfaces", "ip -br addr"],
        ["My default gateway", "ip route | grep default"],
        ["Is it DNS? (name vs IP)", "ping -c2 1.1.1.1 && ping -c2 example.com"],
        ["Resolve a name", "dig +short example.com"],
        ["What's listening here?", "ss -tulpn"],
        ["Path & where loss starts", "mtr -rw 1.1.1.1"],
        ["Watch DNS on the wire", "sudo tcpdump -ni any port 53"],
        ["Test a TLS certificate", "echo | openssl s_client -connect example.com:443 -servername example.com"],
      ],
    },
    {
      kind: "table",
      title: "Networking acronyms",
      head: ["term", "stands for", "in one line"],
      rows: [
        ["DNS", "Domain Name System", "turns names (example.com) into IP addresses"],
        ["DHCP", "Dynamic Host Configuration Protocol", "hands out IP addresses automatically (DORA lease)"],
        ["NAT", "Network Address Translation", "many private IPs share one public IP"],
        ["MAC", "Media Access Control (address)", "the NIC's burned-in link-layer identity"],
        ["NIC", "Network Interface Card", "the hardware that connects a host to a network"],
        ["AP", "Access Point", "bridges Wi-Fi radio onto the wired network"],
        ["LAN", "Local Area Network", "one local network (your home/office)"],
        ["WAN", "Wide Area Network", "the wider network beyond your LAN (the internet)"],
        ["TCP", "Transmission Control Protocol", "reliable, ordered transport (the web, SSH)"],
        ["UDP", "User Datagram Protocol", "fast fire-and-forget transport (DNS, video)"],
        ["IP", "Internet Protocol", "host-to-host addressing across networks (v4/v6)"],
        ["CIDR", "Classless Inter-Domain Routing", "the /n prefix notation for subnets (192.168.1.0/24)"],
        ["ARP", "Address Resolution Protocol", "finds the MAC address behind an IP on the wire"],
        ["ICMP", "Internet Control Message Protocol", "control/error messages — ping lives here"],
        ["TLS", "Transport Layer Security", "encrypts + authenticates (the HTTPS padlock)"],
        ["SSL", "Secure Sockets Layer", "TLS's obsolete predecessor; the name still sticks"],
        ["MTU", "Maximum Transmission Unit", "largest packet a link carries (usually 1500 bytes)"],
        ["VLAN", "Virtual LAN", "logically splits one switch into isolated networks"],
        ["VPN", "Virtual Private Network", "an encrypted tunnel across an untrusted network"],
        ["SSID", "Service Set Identifier", "a Wi-Fi network's name"],
        ["PoE", "Power over Ethernet", "runs power + data down one Ethernet cable"],
        ["ONT", "Optical Network Terminal", "converts an ISP's fibre signal into Ethernet"],
        ["DoH / DoT", "DNS over HTTPS / over TLS", "encrypted DNS lookups (port 443 / port 853)"],
      ],
      foot: "Rule of thumb in this course: every acronym is spelled out on first use in each stage, then abbreviated. Live tools: `https://topo.carino.systems`",
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "The mental model & the layers",
      tag: "how networks are built",
      time: "1–2 hrs",
      payoff:
        "Networking feels like magic until you see the one idea underneath it all: data is wrapped in " +
        "layers, like envelopes inside envelopes, and each layer only worries about its own job. Get the " +
        "mental model — hosts, links, packets, and why we stack layers — and every tool in this course " +
        "stops being a mystery and starts being a lens onto one specific layer.",
      concepts: [
        "hosts, links & packets",
        "why layering (physical→app)",
        "encapsulation: envelopes in envelopes",
        "loopback (127.0.0.1)",
        "ip link — see your interfaces",
        "ping — is it alive?",
      ],
      code:
`# A 'host' is any machine on a network. List its network interfaces:
ip link                    # the links (NICs) this host can talk over
ip -br link                # -br = brief, one tidy line per interface

# 'lo' is the loopback: a fake network wired to yourself
ping -c 3 127.0.0.1        # talk to yourself; proves the TCP/IP stack works
ping -c 3 localhost        # the name 127.0.0.1 usually answers to

# Reach another host: send a few packets and time the replies
ping -c 3 1.1.1.1          # a real internet host (Cloudflare's resolver)

# Watch the layers in action: -R records the hops your packet passes
ping -c 1 -R 1.1.1.1 2>/dev/null || echo "record-route often blocked; that's normal"`,
      lang: "bash",
      walkthrough: [
        "**A network is just hosts talking over links.** A **host** is any machine (your laptop, a server, a phone). A **link** is the connection it talks over (an Ethernet cable, Wi-Fi, fibre). Data travels in small chunks called **packets** — a big file is chopped up, sent, and reassembled at the far end.",
        "**Layering is the whole trick.** Instead of one giant complicated system, networking is split into layers that each do one job and hand off to the next: **physical** (the actual signal on the wire) → **link** (getting to the next device on this wire, via MAC addresses) → **network** (getting across *many* networks, via IP addresses) → **transport** (which program, and reliably or not, via ports) → **application** (the real conversation: a web page, an email).",
        "**Encapsulation is 'envelopes inside envelopes'.** When you load a web page, the HTTP request (application) is placed inside a TCP segment (transport), which is placed inside an IP packet (network), which is placed inside an Ethernet frame (link). Each layer adds its own header. At the other end it's unwrapped in reverse. You'll literally *see* this in stage 6 with `tcpdump`.",
        "**`ip link`** lists your host's network interfaces — the hardware (or virtual) doors it can send packets through. **`ip -br link`** adds `-br` for a **brief**, one-line-per-interface view. You'll always see at least two: a real one (like `eth0`, `enp3s0`, or `wlan0`) and **`lo`**.",
        "**`lo` is the loopback interface** — a pretend network that loops straight back to your own machine at address **`127.0.0.1`**. It never touches a cable. It's how programs on the same computer talk to each other, and it's the first thing you `ping` to prove your networking software works at all.",
        "**`ping`** sends **ICMP echo-request** packets and times the replies — the simplest 'are you there?' test. **`-c 3`** sends just 3 and stops (otherwise it runs forever; `Ctrl-C` also stops it). Reaching `127.0.0.1` tests *your* stack; reaching `1.1.1.1` tests the whole path to the internet.",
        "**Names vs numbers.** `ping localhost` works because `localhost` is a *name* for `127.0.0.1`. That translation (name → IP) is **DNS**, which gets a whole stage (5) of its own. For now, notice that pinging by number skips DNS entirely — a distinction that becomes your #1 troubleshooting tool.",
      ],
      exercise:
        "Prove the stack works from the inside out. Run `ip -br link` and list every interface, marking which " +
        "is loopback and which is your real one. `ping -c 3 127.0.0.1` (your own stack), then `ping -c 3` your " +
        "default gateway if you know it, then `ping -c 3 1.1.1.1` (the internet). Note the *time* in milliseconds " +
        "for each — loopback should be well under 1 ms, the internet tens of ms. In one sentence, explain what a " +
        "failure at each step would tell you about *where* the problem is.",
      drills: [
        "Run `ip -br link` and identify your interface's state: is it `UP` or `DOWN`?",
        "Run `ping -c 3 localhost` and `ping -c 3 127.0.0.1` — confirm they behave identically.",
        "Run `ping -c 5 1.1.1.1` and read the summary line: how many packets were lost, and what was the average time?",
        "Run `cat /etc/hostname` to see your own host's name, then `hostname -I` to print its IP address(es).",
      ],
      note:
        "There are two layer models you'll see: the 7-layer **OSI** model (academic, great for naming things) and " +
        "the 4-layer **TCP/IP** model (what the internet actually uses). They describe the same reality — don't get " +
        "hung up on the exact count. The reference card at the top maps them side by side.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "Network hardware components",
      tag: "the physical pieces",
      time: "half a day",
      payoff:
        "Before packets, there's plumbing: the card in your machine, the box that connects everyone in a room, " +
        "the box that connects rooms to the internet, and the cables (or radio) between them. Knowing what a " +
        "NIC, switch, router, access point and modem each actually *do* — and how to identify yours — turns a " +
        "tangle of blinking boxes into a diagram you understand.",
      concepts: [
        "NIC (Network Interface Card): wired · Wi-Fi · USB",
        "interface names: enp3s0 / eth0 / wlan0 / lo",
        "switch (Layer 2, learns MACs) vs hub",
        "router (Layer 3) · gateway · AP · modem/ONT",
        "cables: Cat5e/6/6a · fibre (single/multi) · coax · RJ45 · PoE",
        "connections: Ethernet · Wi-Fi · fibre · cellular/LTE",
        "virtual & bridge interfaces",
        "identify your hardware (ip · lspci · ethtool)",
      ],
      code:
`# Every network interface this host has — wired, wireless & virtual:
ip -br link                       # brief, one line each; read the NAME to know the TYPE:
#   lo             = loopback (yourself)      enp3s0 / eth0 = wired Ethernet NIC
#   wlan0 / wlp2s0 = Wi-Fi NIC                enx001122... = USB Ethernet adapter
#   virbr0 / docker0 / br0 = virtual bridge   tun0 / wg0    = VPN tunnel interface

# The physical cards behind those names:
lspci | grep -i net               # network chips on the PCI bus (built-in NICs)
lsusb | grep -i -E 'net|wire|wifi'  # USB network adapters, if any

# Link details: is the cable in, how fast, and what speeds CAN it do?
sudo ethtool enp3s0               # 'Link detected: yes/no', Speed, Duplex
sudo ethtool enp3s0 | grep -i 'Supported link modes'  # what NIC + cable can negotiate
# (Fedora/RHEL: sudo dnf install ethtool | Debian/Ubuntu: sudo apt install ethtool)

# Wi-Fi specifics: which radio, which network, what signal
iw dev                            # wireless interfaces and the channel they're on
nmcli device wifi list            # nearby Wi-Fi networks and signal strength

# The MAC (Media Access Control) address is burned into every NIC:
ip link show enp3s0 | grep link/ether   # 6 bytes like 00:1a:2b:3c:4d:5e`,
      lang: "bash",
      walkthrough: [
        "**NIC — Network Interface Card.** The hardware that connects your machine to a network. There are three flavours you'll meet: a **wired** NIC (an Ethernet port, usually built into the motherboard), a **Wi-Fi** NIC (a radio, built-in on laptops or a plug-in card), and a **USB adapter** (a NIC on a stick — a USB-to-Ethernet dongle, or a USB Wi-Fi dongle). Every NIC, wired or wireless, carries a burned-in **MAC (Media Access Control) address** — its permanent link-layer identity. **`lspci | grep -i net`** lists the built-in chips; **`lsusb`** catches USB adapters.",
        "**Interfaces & their names.** Each NIC shows up in Linux as an *interface*, and the **name tells you the type**. Modern Fedora/RHEL uses 'predictable' names tied to the physical slot: **`enp3s0`** (Ethernet, PCI bus 3 slot 0), the older generic **`eth0`**, or **`wlan0`**/`wlp2s0` for Wi-Fi. **`lo`** is the **loopback** (the fake wire to yourself from stage 0). You'll also see **virtual interfaces** that have no cable at all: **bridges** like `virbr0`, `docker0` or `br0` (software switches that let virtual machines and containers share the network), and tunnels like `tun0`/`wg0` (VPNs). **`ip -br link`** lists them all — `-br` for **brief**, one tidy line each.",
        "**Switch (Layer 2).** A switch connects many devices *within one Local Area Network (LAN)* and is smart: it **learns which MAC address is on which port** (by watching traffic) and then forwards each frame only to the port that needs it. That's why a switch is private and efficient — it works at the link layer (Layer 2), knowing nothing about IP.",
        "**Hub (obsolete).** A hub is a dumb switch: it blindly copies every frame to *every* port, so everyone hears everyone and collisions abound. You'll basically never see one today, but the contrast explains *why* switches learn MACs — to avoid exactly that noise.",
        "**Router (Layer 3) & the gateway.** A switch keeps one network talking to itself; a **router joins *different* networks together** and decides, per packet, which way to send it using **IP (Internet Protocol) addresses** — that's Layer 3 work. The router that leads *off* your LAN toward the wider **WAN (Wide Area Network)/internet** is your **default gateway** (a full stage of its own, stage 4). Your home 'router' is really several devices in one plastic box.",
        "**Gateway box: router + switch + AP + modem, combined.** That all-in-one home unit typically bundles a **router**, a **switch** (the 4 LAN ports on the back), and a **Wi-Fi access point (AP)** — the radio that bridges wireless devices onto the wired network. Often it also includes the **modem** (for cable/DSL) or an **ONT (Optical Network Terminal)** for fibre — the device that converts your **ISP (Internet Service Provider)**'s signal into Ethernet, the actual doorway to the internet. Enterprise networks split these into separate boxes; home gear hides the layers in one. **`iw dev`** shows your wireless interfaces; **`nmcli device wifi list`** scans for nearby APs.",
        "**Cables & connectors.** Copper **twisted-pair** Ethernet uses an **RJ45** connector (the 8-pin clip that snaps into a NIC): **Cat5e** carries 1 Gbit/s, **Cat6** pushes 10 Gbit/s over short runs, and **Cat6a** does 10 Gbit/s over the full 100 m. **Fibre-optic** cable carries *light* instead of electricity — immune to interference and good over long distances; it comes as **single-mode** (a tiny core, lasers, kilometres — think ISP/backbone) and **multi-mode** (a fatter core, LEDs, cheaper, up to a few hundred metres inside a building). **Coax** (coaxial, the round screw-on cable) is what cable-internet and older networks use into the modem. A bad or too-long cable shows up as a slow or flapping link.",
        "**Connection types.** The same host can reach a network several ways: **wired Ethernet** (fast, stable, plug it in), **Wi-Fi** (radio, convenient, shared airtime), **fibre** (light, for long runs and ISP hand-off), and **cellular/LTE (Long-Term Evolution)** — a modem talking to a mobile tower, how phones and 4G/5G hotspots get online with no cable at all. Each is just a different *link* under the same IP stack from stage 0.",
        "**PoE — Power over Ethernet.** The same Ethernet cable can carry *power* as well as data, so cameras, phones and access points need only one wire. Handy to know when a device runs off its network cable with no power brick.",
        "**`ethtool enp3s0`** is your link-layer stethoscope: **`Link detected: yes`** means a cable is plugged in and negotiated, **`Speed`/`Duplex`** tell you the agreed rate, and **`Supported link modes`** shows what the NIC-plus-cable pair *can* do (a gigabit port stuck at `100Mb/s` or `Half` duplex is a classic bad-cable symptom you'll revisit in stage 11).",
        "**Where addresses come from — a preview.** A NIC has hardware and a link, but not yet an IP address. That IP usually arrives automatically via **DHCP (Dynamic Host Configuration Protocol)** — a service on your gateway that hands out addresses when a device joins. You met the hardware here; the very next stage explains addresses, subnets, and exactly how DHCP's lease negotiation works.",
      ],
      exercise:
        "Draw your own home/office network as a diagram. Run `ip -br link` and `lspci | grep -i net` to list your " +
        "NICs — note their names and whether each is wired or Wi-Fi. For a wired interface, run `sudo ethtool " +
        "<iface>` and record `Speed`, `Duplex` and `Link detected`. If you're on Wi-Fi, run `iw dev` and `nmcli " +
        "device wifi list` and note your channel and signal. Then sketch: your host → (cable/Wi-Fi) → switch/AP → " +
        "router → modem/ONT → internet, labelling which box does Layer 2 (switch) and which does Layer 3 (router).",
      drills: [
        "Run `ip -br link` and classify every interface by its name: which is loopback (`lo`), which is a real NIC (`enp*`/`wl*`), and which is virtual (`virbr*`/`docker*`/`br*`)?",
        "Run `ip link show <iface> | grep link/ether` and read your NIC's MAC address — note the first 3 bytes (the vendor).",
        "Run `sudo ethtool <wired-iface>` and find whether it negotiated full or half duplex, and its `Supported link modes`.",
        "Run `nmcli device status` to see, for each device, its TYPE (ethernet/wifi) and connection state.",
        "Run `iw dev` (Wi-Fi) or `ethtool -i <iface>` (wired) to discover the driver behind your card.",
      ],
      note:
        "Home gear crams router + switch + AP + sometimes modem into one plastic box, which hides the layers; " +
        "enterprise networks split them into separate, purpose-built devices. If `ethtool` says `Link detected: no`, " +
        "the problem is physical — a cable, port or NIC — and no amount of IP configuration will help until that's `yes`.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "Addresses & subnets",
      tag: "who am I on the network",
      time: "1 day",
      payoff:
        "Every host needs an address, and every network is carved into subnets. Understanding MAC vs IPv4 vs " +
        "IPv6, and being able to read `192.168.1.50/24` and instantly know the network, the broadcast and how " +
        "many hosts fit, is the single most useful literacy in networking. Get subnets and half of all " +
        "'why can't these two machines talk?' problems become obvious.",
      concepts: [
        "MAC vs IPv4 vs IPv6",
        "CIDR /24 & subnet masks",
        "network / broadcast / host",
        "DHCP: leases & the DORA handshake",
        "static vs dynamic addressing",
        "ip addr / ip -br a",
        "a worked subnetting example",
      ],
      code:
`# Your addresses: link-layer (MAC) and network-layer (IP)
ip addr                    # full detail: 'link/ether' = MAC, 'inet' = IPv4, 'inet6' = IPv6
ip -br a                   # the brief version: one line per interface

# Read a CIDR: 192.168.1.50/24 means...
#   /24  -> first 24 bits are the NETWORK, last 8 bits are the HOST
#   network address   = 192.168.1.0     (all host bits 0)
#   broadcast address = 192.168.1.255   (all host bits 1)
#   usable hosts      = 192.168.1.1 .. 192.168.1.254  (256 - 2 = 254)
ipcalc 192.168.1.50/24     # does this maths for you (dnf install ipcalc)

# Where did my IP come from — DHCP or set by hand?
CON=$(nmcli -t -f NAME c show --active | head -1)     # my active connection profile
nmcli -f IP4.ADDRESS,IP4.GATEWAY,DHCP4 connection show "$CON"

# What did the DHCP lease actually hand me (gateway, DNS, lease time, server)?
nmcli -f DHCP4.OPTION connection show "$CON"          # dhcp_lease_time, routers, dns...
grep -h . /var/lib/NetworkManager/*.lease* 2>/dev/null | head   # the raw lease file(s)

# Renew the lease by hand (release + request again — the DORA round-trip)
sudo nmcli connection down "$CON" && sudo nmcli connection up "$CON"

# Add a second IP by hand (temporary; gone on reboot — DHCP/NM is the real way)
sudo ip addr add 192.168.1.60/24 dev enp3s0   # then: sudo ip addr del ... to undo`,
      lang: "bash",
      walkthrough: [
        "**Three kinds of address, three layers.** A **MAC address** (`00:1a:2b:3c:4d:5e`) is burned into the NIC and identifies it on the *local wire* (link layer). An **IPv4 address** (`192.168.1.50`) identifies a host across *networks* (network layer) — 32 bits, written as four 0–255 numbers. An **IPv6 address** (`2001:db8::1`) does the same job with 128 bits, written in hex, because the world ran out of IPv4.",
        "**`ip addr`** (short **`ip -br a`**) shows all three: **`link/ether`** is the MAC, **`inet`** lines are IPv4, **`inet6`** are IPv6. Each address ends in a `/number` — that's the CIDR prefix, and reading it is the core skill of this stage.",
        "**CIDR `/24` = the subnet mask, counted in bits.** The `/24` in `192.168.1.50/24` says 'the first **24** bits are the **network** part, the remaining 8 are the **host** part'. As a mask that's `255.255.255.0`. Everyone sharing those first 24 bits is on the *same* local network and can talk directly; anyone else must go through a router.",
        "**Network, broadcast, host.** Within a `/24`, set all host bits to 0 and you get the **network address** (`192.168.1.0`, the name of the subnet itself); set them all to 1 and you get the **broadcast address** (`192.168.1.255`, 'everyone on this subnet'). Those two are reserved, so a `/24` holds **256 − 2 = 254 usable** host addresses.",
        "**Counting hosts from the prefix.** Host bits = `32 − prefix`, and usable hosts = `2^(host bits) − 2`. So `/24` → 254, `/25` → 126, `/30` → 2 (used for point-to-point links between routers), `/16` → 65,534. **`ipcalc 192.168.1.50/24`** prints all of this — network, broadcast, range, mask — so you can check yourself.",
        "**Static vs dynamic.** A **static** address is one you set by hand and it never changes — good for servers, printers and anything else you need to find at a fixed spot. A **dynamic** address is assigned automatically by **DHCP (Dynamic Host Configuration Protocol)** when a device joins — how your phone and laptop 'just work' the moment they connect. The `nmcli ... DHCP4` field tells you which you have.",
        "**DHCP, in depth.** The **DHCP server** usually lives *inside your gateway/router* (a bigger network may run a dedicated one). It owns a **pool** of addresses for the subnet and hands them out as **leases** — an address borrowed for a set time (the **lease time**, e.g. 24 hours) after which the client must renew or lose it. Crucially, one DHCP message delivers *everything a host needs to work*: its **IP address and subnet mask** (stage's core), the **default gateway** (stage 4), and the **DNS (Domain Name System)** servers (stage 5). That's why a single DHCP failure knocks out your whole connection at once.",
        "**The DORA handshake.** A fresh client and the server exchange four messages — remember them as **D-O-R-A**: **Discover** (the client shouts 'is there a DHCP server out there?' as a broadcast, since it has no address yet), **Offer** (a server replies 'you can have 192.168.1.50'), **Request** (the client says 'yes, I'll take that one' — broadcast, so any *other* servers know it's spoken for), and **Ack** (Acknowledge — the server confirms and includes the lease time, gateway and DNS). After the Ack the client configures its interface and is on the network. You'll watch a real DORA exchange on the wire with `tcpdump port 67 or port 68` in stage 6.",
        "**When DHCP fails.** If no server answers the Discover, the host self-assigns a **link-local** address in `169.254.x.x` (Windows calls this APIPA) — a fallback that can only reach the local wire, never the internet. So a `169.254.x.x` in `ip -br a` is a dead giveaway that **DHCP didn't work** (server down, wrong VLAN, cable issue). Renewing the lease (`nmcli connection down/up`) re-runs DORA from scratch.",
        "**`ip addr add` is temporary.** You *can* bolt an extra IP onto an interface live with `ip addr add`, but it evaporates on reboot because it isn't saved to a profile. On Fedora/RHEL the durable way is NetworkManager (`nmcli con modify ... ipv4.addresses ...`), which you met if you did the Linux course — here we're focused on *reading* addresses, not permanently setting them.",
        "**Worked example.** You're `192.168.1.50/24`, your friend is `192.168.1.90/24`: same first 24 bits → same subnet → you talk *directly* (via the switch, using MACs). A server at `10.0.0.5/24` is on a *different* network → your packets must go to the **default gateway** (next stage) to be routed there. That single 'same subnet or not?' check is the heart of routing.",
      ],
      exercise:
        "Fully decode your own address. Run `ip -br a` and pick your primary `inet` line, e.g. `192.168.1.50/24`. " +
        "Without a tool, work out on paper: the network address, the broadcast address, the usable host range, and " +
        "how many hosts the subnet holds. Then check yourself with `ipcalc <your-ip>/<prefix>` (install it if " +
        "needed). Finally, decide: is a host at `192.168.1.200` on your subnet? Is `192.168.2.10`? Explain each " +
        "answer in terms of the /24 boundary.",
      drills: [
        "Run `ip -br a` and count how many IPv4 and IPv6 addresses your machine currently holds.",
        "Compute in your head: how many usable hosts in a `/26`? A `/28`? (Then verify with `ipcalc`.)",
        "Run `ip -o link | awk '{print $2, $17}'` to pair each interface name with its MAC address.",
        "Run `nmcli -f DHCP4.OPTION connection show \"$(nmcli -t -f NAME c show --active | head -1)\"` and find your `dhcp_lease_time`, `routers` (gateway) and `domain_name_servers` (DNS) — the values DORA delivered.",
        "Run `ipcalc 10.0.0.0/8` and marvel at how many hosts a `/8` can theoretically hold.",
      ],
      note:
        "Addresses `10.0.0.0/8`, `172.16.0.0/12` and `192.168.0.0/16` are **private** — reusable inside any network " +
        "and never routed on the public internet (that's why NAT, next-but-one stage, exists). If your machine ever " +
        "shows a `169.254.x.x` address, that's a **link-local** self-assignment meaning DHCP failed — a red flag, not a real network.",
    },

    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Ports, sockets & connections",
      tag: "which program, and how",
      time: "half a day",
      payoff:
        "An IP address gets a packet to the right *machine*; a **port** gets it to the right *program* on that " +
        "machine. The pairing of IP + port is a **socket**, and it's how a single server runs a web server, an " +
        "SSH server and a database at once without confusion. Learn to list sockets with `ss` and you can " +
        "instantly answer 'is my service actually up and listening?'.",
      concepts: [
        "port = which program",
        "socket = ip:port",
        "TCP (reliable) vs UDP (fast)",
        "listening vs established",
        "ss -tulpn",
        "the TCP 3-way handshake",
      ],
      code:
`# Which programs are LISTENING for incoming connections?
ss -tulpn                  # t=TCP u=UDP l=listening p=process n=numeric ports
#   LISTEN 0 128  0.0.0.0:22  ...  users:(("sshd",...))   <- sshd on port 22

# Which connections are currently ESTABLISHED (actually talking)?
ss -tn state established   # live TCP conversations, numeric

# Look up what a well-known port is 'supposed' to be
grep -w 443 /etc/services  # the name<->number registry (https 443/tcp)
getent services ssh        # ask the system: ssh -> 22/tcp

# Make a connection yourself and watch it appear
ncat -l 9000 &             # start a listener on TCP port 9000 (dnf install nmap-ncat)
ss -tlpn | grep 9000       # see it LISTENing
ncat 127.0.0.1 9000        # connect to it; type a line, Ctrl-C to quit; then: kill %1`,
      lang: "bash",
      walkthrough: [
        "**A port is a numbered doorway on a host.** One IP, up to 65,535 ports. Servers 'listen' on well-known port numbers so clients know where to knock: **22** for SSH, **80** for HTTP, **443** for HTTPS, **53** for DNS. Ports **0–1023** are 'privileged' — a program needs root to listen on them.",
        "**A socket is the full address of a conversation: `IP:port`.** `192.168.1.50:443` is a specific service on a specific host. A live connection is actually a *pair* of sockets — yours and theirs — which is how your one machine can have many simultaneous connections without mixing them up.",
        "**TCP vs UDP is the big transport choice.** **TCP** is a phone call: it sets up a connection, guarantees every byte arrives in order, and retransmits losses — used by the web, SSH, email. **UDP** is a postcard: fire-and-forget, no setup, no guarantees, but fast and lightweight — used by DNS lookups, video calls, games, where speed beats perfection.",
        "**Listening vs established.** A socket in **`LISTEN`** state is a server *waiting* for connections (it's open for business). An **`ESTAB`** (established) socket is an *active* conversation in progress. Confusing the two is common: 'my server is running' usually means you want to see it `LISTEN`ing.",
        "**`ss -tulpn`** is the command to burn into memory (it replaces the old `netstat`). Read the flags: **`t`** TCP, **`u`** UDP, **`l`** only listening sockets, **`p`** show the owning **p**rocess (needs root to see other users' processes), **`n`** show **n**umeric ports (don't translate 22→ssh). The output tells you *what* is listening, on *which* address and port, run by *which* program.",
        "**`0.0.0.0:22` vs `127.0.0.1:22`.** The listen *address* matters: **`0.0.0.0`** (or `*`) means 'listen on every interface — reachable from the network', while **`127.0.0.1`** means 'loopback only — reachable from this machine alone'. A service that's up but only listening on `127.0.0.1` is a classic 'why can't I connect from outside?' gotcha.",
        "**`/etc/services`** maps names to numbers (`https → 443/tcp`) — it's just a lookup table, not a running thing. **`getent services ssh`** queries it. Handy for turning a mystery port number into a plausible meaning.",
        "**The TCP 3-way handshake** sets up every TCP connection: the client sends **SYN** ('let's talk?'), the server replies **SYN-ACK** ('sure, and same to you'), the client sends **ACK** ('great, go') — three packets, then data flows. You'll watch this happen live on the wire in stage 6. UDP skips all this, which is exactly why it's faster and less reliable.",
      ],
      exercise:
        "Inventory every open door on your machine. Run `ss -tulpn` and, for each listening socket, write down: the " +
        "port, whether it's TCP or UDP, the listen address (is it `0.0.0.0`/`*` = network-reachable, or `127.0.0.1` " +
        "= local-only?), and the program. Now create one yourself: run `ncat -l 9000` in one terminal, confirm it " +
        "with `ss -tlpn | grep 9000` in another, then connect with `ncat 127.0.0.1 9000` and type a message that " +
        "appears in the first terminal. Finally, run `ss -tn state established` while browsing a website and spot " +
        "the connection to port 443.",
      drills: [
        "Run `ss -tlpn` and identify which program is listening on port 22, and on which address.",
        "Run `ss -s` for a one-screen summary of total sockets by type and state.",
        "Run `getent services 53` and `getent services 3306` to name two ports from their numbers.",
        "Run `ss -tn state established | wc -l` while a browser is open to count your live TCP connections.",
      ],
      note:
        "If `ss` shows nothing for a service you *think* is running, the service isn't actually listening — check it " +
        "started correctly before blaming the network or firewall. And a process bound to `127.0.0.1` will never be " +
        "reachable from another machine no matter how open your firewall is; it must listen on `0.0.0.0` (or a real IP).",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "Routing & the gateway",
      tag: "how a packet leaves home",
      time: "half a day",
      payoff:
        "Your subnet is an island. The **default gateway** is the bridge off it, and the **routing table** is " +
        "the set of rules your host follows to decide 'is this destination local, or do I hand it to the " +
        "gateway?'. Add **NAT** — the trick that lets a whole house of `192.168.x.x` devices share one public " +
        "IP — and you understand how a packet actually travels from your laptop to a server across the world.",
      concepts: [
        "the default gateway",
        "the routing table (ip route)",
        "local subnet vs off-net",
        "ip route get <ip>",
        "NAT — private IPs on the internet",
        "traceroute preview",
      ],
      code:
`# The routing table: the rules your host follows to send each packet
ip route                   # the 'default via X' line is your gateway
#   default via 192.168.1.1 dev enp3s0   <- anything not local goes here
#   192.168.1.0/24 dev enp3s0 ...        <- this subnet is directly reachable

# Ask the kernel: which route (and gateway) would THIS destination use?
ip route get 1.1.1.1       # off-net -> shows 'via <gateway>'
ip route get 192.168.1.90  # on-net  -> no 'via', it's directly connected

# Who is my gateway, and can I reach it?
ip route | awk '/default/ {print $3}'      # extract just the gateway IP
ping -c 3 "$(ip route | awk '/default/ {print $3}')"   # can I reach the door out?

# Find my PUBLIC IP — the single address NAT presents to the world
curl -s https://api.ipify.org; echo

# Preview the path to a destination (full deep-dive in stage 11)
traceroute -n 1.1.1.1 2>/dev/null | head   # or: mtr -rw 1.1.1.1`,
      lang: "bash",
      walkthrough: [
        "**The routing table is a list of 'if the destination looks like X, send it this way' rules.** **`ip route`** prints it. Two lines matter on most hosts: a **directly-connected** line (`192.168.1.0/24 dev enp3s0` — 'my subnet, reachable over this NIC') and the **`default`** line — the catch-all for everything else.",
        "**The default gateway** is the `default via 192.168.1.1` line: it names the router that packets go to when the destination isn't on your local subnet. It's the single door out of your island. If you can't reach your gateway, you can't reach *anything* beyond your subnet — which makes 'ping the gateway' an essential early troubleshooting step.",
        "**The decision your host makes for every packet:** is the destination inside one of my directly-connected subnets? If yes, deliver it *directly* on the local wire (resolve its MAC via ARP, hand it to the switch). If no, hand it to the **default gateway** and let the router figure out the next hop. That's routing in one sentence.",
        "**`ip route get <ip>`** is a wonderful diagnostic: it asks the kernel to *show its work* — which route it would pick for a given destination, including the gateway and source address. **`ip route get 1.1.1.1`** shows `via <gateway>` (off-net), while **`ip route get`** a neighbour on your subnet shows no `via` (directly connected). Instant confirmation of how a packet would leave.",
        "**NAT — Network Address Translation — is why `192.168.x.x` works on the internet.** Private addresses aren't routable on the public internet, so your router **rewrites** the source address of outgoing packets to its *single public IP*, remembers the mapping, and rewrites the replies back to the right internal device. A whole household shares one public IP this way. **`curl https://api.ipify.org`** shows that shared public IP — usually very different from your `ip addr`.",
        "**Ping the gateway, then ping beyond.** `ping <gateway>` tests the door out; if that works but `ping 1.1.1.1` doesn't, the problem is upstream of you (the router or ISP), not your machine. This split is the backbone of the layered debugging you'll formalise in stage 11.",
        "**`traceroute -n <ip>`** previews the *path*: each router (hop) between you and the destination, in order, with timings. **`-n`** keeps it numeric (no slow reverse-DNS). The first hop is almost always your gateway; the rest are your ISP and the wider internet. It's the map of exactly the journey routing produces — and `mtr` (stage 11) is the live, continuously-updating version.",
      ],
      exercise:
        "Trace your own way out to the internet. Run `ip route` and identify (1) your directly-connected subnet " +
        "line and (2) your `default` gateway. Confirm you can reach the door with `ping -c 3 <gateway-ip>`. Run " +
        "`ip route get 1.1.1.1` and `ip route get <a-neighbour-on-your-subnet>` and explain why one shows `via` " +
        "and the other doesn't. Discover your public IP with `curl -s https://api.ipify.org` and confirm it differs " +
        "from your private `ip addr` — that difference *is* NAT. Finally, `traceroute -n 1.1.1.1` and note that hop 1 " +
        "is your gateway.",
      drills: [
        "Run `ip route` and read out, in plain English, what the `default` line means.",
        "Run `ip route get 8.8.8.8` and identify the gateway and the source IP the kernel would use.",
        "Compare `ip addr | grep inet` (private) with `curl -s https://api.ipify.org` (public) and note the NAT gap.",
        "Run `traceroute -n <a-website-ip>` and count how many hops away it is.",
      ],
      note:
        "If `ip route` has **no `default` line**, your host literally has no way off its subnet — that alone explains " +
        "'internet is down' even when the local network is fine. NAT is also why *incoming* connections to a home " +
        "device don't work without 'port forwarding': the router doesn't know which internal host an unsolicited " +
        "packet is for.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "DNS deep-dive & spotting DNS issues",
      tag: "names into numbers",
      time: "1 day",
      payoff:
        "DNS is the phone book of the internet — it turns `example.com` into an IP — and it is behind a " +
        "staggering share of 'the internet is broken' incidents (hence the sysadmin joke: *it's always DNS*). " +
        "Learn how a name resolves, master `dig`, and internalise a crisp 'is it DNS?' playbook, and you'll " +
        "diagnose a whole category of failures in seconds while others flail.",
      concepts: [
        "resolvers & the resolution walk",
        "records: A/AAAA/CNAME/MX/TXT/NS/PTR",
        "dig, dig +trace, dig @server",
        "/etc/resolv.conf & resolvectl",
        "caching & TTL",
        "'is it DNS?' troubleshooting",
      ],
      code:
`# The everyday lookup: name -> IPv4 address
dig +short example.com            # just the answer; add AAAA for IPv6
host example.com                  # a friendlier one-liner
nslookup example.com              # the classic (still handy)

# Ask for specific record TYPES
dig example.com A                 # IPv4 address
dig example.com AAAA              # IPv6 address
dig example.com MX                # mail servers for the domain
dig example.com NS                # which nameservers are authoritative
dig example.com TXT               # text records (SPF, verification, ...)
dig -x 1.1.1.1                    # PTR / reverse: IP -> name

# WHERE is the answer coming from? Compare resolvers
dig @1.1.1.1 example.com +short   # ask Cloudflare directly, bypassing local
cat /etc/resolv.conf              # the resolver(s) your system uses
resolvectl status                 # systemd-resolved's per-link DNS view

# Follow the resolution from the root down (see the whole walk)
dig +trace example.com | tail -20`,
      lang: "bash",
      walkthrough: [
        "**What DNS does.** It maps human names (`example.com`) to machine addresses (`93.184.216.34`). Nothing on the internet is reached by name directly — the name is *always* resolved to an IP first, then the IP is used. That's why a broken name lookup looks exactly like a broken internet, even when the network is perfectly fine.",
        "**The resolution walk (who answers).** Your machine asks a **resolver** (usually your router or an ISP/public resolver like `1.1.1.1`). If the resolver doesn't already know, it walks the hierarchy: ask a **root** server → which points to the **`.com`** servers → which point to the **authoritative** nameserver for `example.com` → which gives the final answer. **`dig +trace`** performs this walk yourself, one delegation at a time, so you can *see* it.",
        "**Record types are the different questions you can ask.** **A** = IPv4 address, **AAAA** = IPv6 address, **CNAME** = an alias ('this name is really that name'), **MX** = mail servers, **TXT** = free-form text (SPF, domain verification), **NS** = the authoritative nameservers, **PTR** = reverse lookup (IP → name). `dig NAME TYPE` asks for a specific one.",
        "**`dig` is the tool.** Plain `dig example.com` prints a full, labelled response (question, answer, authority, timing). **`dig +short`** strips it to just the answer — perfect for scripts and quick checks. **`host`** and **`nslookup`** are friendlier front-ends for the same job; `dig` gives you the most control and detail.",
        "**`dig @server` picks *who* you ask.** **`dig @1.1.1.1 example.com`** queries Cloudflare's public resolver directly, bypassing whatever your system normally uses. This is the single most powerful DNS debugging move: if `dig @1.1.1.1 name` *works* but your default resolver *doesn't*, the problem is your local/ISP resolver, not the domain.",
        "**Where your system's resolver comes from.** **`/etc/resolv.conf`** lists the `nameserver` IPs the system consults (often auto-managed). On modern Fedora/RHEL, **`resolvectl status`** shows the real picture — DNS servers per network link, because `systemd-resolved` handles it. **`resolvectl query name`** is the systemd-native lookup.",
        "**Caching & TTL.** Every DNS answer carries a **TTL** (time-to-live, in seconds) saying how long it may be cached. This is why a changed DNS record doesn't take effect everywhere instantly — old answers linger until their TTL expires. Watch the TTL count down on repeated `dig` calls; `resolvectl flush-caches` clears the local cache when you need a fresh look.",
        "**The 'is it DNS?' playbook.** (1) **Ping by IP vs by name:** `ping 1.1.1.1` works but `ping example.com` fails ⇒ it's DNS, not connectivity. (2) **Compare resolvers:** `dig @1.1.1.1 name` vs your default — if the public one works, blame your resolver. (3) **Read the status line** in `dig`: **`NXDOMAIN`** = the name genuinely doesn't exist; **`SERVFAIL`** = the resolver tried but failed (often DNSSEC or a broken upstream); **`NOERROR` with no answer** = the name exists but not for that record type. (4) **Check TTL/caching** if a recent change hasn't appeared. (5) **`dig -x <ip>` (PTR)** to sanity-check reverse records. Run those five and you've localised almost any DNS fault.",
      ],
      exercise:
        "Run the full 'is it DNS?' drill. First prove the split: `ping -c2 1.1.1.1` (by IP) then `ping -c2 " +
        "example.com` (by name) — if only the name fails you've caught a DNS problem red-handed. Resolve a domain " +
        "four ways: `dig +short`, `host`, `nslookup`, and `dig @1.1.1.1 +short`, and confirm they agree. Pull three " +
        "record types for a real domain you use: its `A`, `MX` and `NS` records. Run `dig +trace example.com` and " +
        "identify the root → TLD → authoritative handoff. Finally, run `dig example.com` twice and watch the TTL in " +
        "the answer count down — proof of caching.",
      drills: [
        "Run `dig +short example.com` then `dig -x <that-ip>` and see whether the reverse (PTR) matches.",
        "Run `dig @8.8.8.8 example.com` and `dig @1.1.1.1 example.com` and confirm two independent resolvers agree.",
        "Run `dig nonexistent-zzz.example` and read the `status:` line — you should see `NXDOMAIN`.",
        "Run `resolvectl status` (or `cat /etc/resolv.conf`) and write down exactly which resolver your system uses.",
      ],
      note:
        "The status codes are your fastest clue: **`NXDOMAIN`** means the name doesn't exist (typo? wrong domain?), " +
        "while **`SERVFAIL`** means the *resolver* choked (retry against `@1.1.1.1` to prove it's the resolver, not " +
        "the domain). And whenever a site 'just changed and isn't updating', suspect a cached record whose TTL " +
        "hasn't expired before suspecting anything else.",
    },

    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Watch real traffic",
      tag: "see the packets",
      time: "1 day",
      payoff:
        "Everything so far has been theory about packets — now you *watch them*. `tcpdump` prints the actual " +
        "frames crossing your interface, so you can see a TCP handshake happen, a DNS question and its answer, " +
        "and prove exactly what your machine is (or isn't) sending. Once you can read the wire, 'is it even " +
        "leaving my machine?' stops being a guess.",
      concepts: [
        "tcpdump: capture live",
        "-i interface, -n no-DNS",
        "filters: host / port / net",
        "-w write, -r read a .pcap",
        "reading a TCP handshake & a DNS query",
        "Wireshark for a GUI",
      ],
      code:
`# tcpdump needs root (it reads raw packets). Install: dnf install tcpdump
sudo tcpdump -ni any -c 5                 # capture 5 packets on ANY interface, numeric

# Watch DNS: run this, then in another terminal do 'dig example.com'
sudo tcpdump -ni any port 53              # see the query go out and the answer return

# Watch a TCP handshake to a web server (SYN, SYN-ACK, ACK)
sudo tcpdump -ni any host example.com and port 443
#   ... Flags [S]     <- SYN     (client -> server)
#   ... Flags [S.]    <- SYN-ACK (server -> client)
#   ... Flags [.]     <- ACK     (client -> server) : connection established

# Filters combine with and / or / not
sudo tcpdump -ni enp3s0 'tcp and port 22 and not host 192.168.1.50'
sudo tcpdump -ni any net 192.168.1.0/24   # only traffic to/from your LAN

# Save to a file, then read it back (or open in Wireshark)
sudo tcpdump -ni any -w /tmp/capture.pcap port 443   # Ctrl-C to stop
tcpdump -nr /tmp/capture.pcap | head                 # -r reads a saved capture`,
      lang: "bash",
      walkthrough: [
        "**`tcpdump` prints packets as they cross an interface.** It needs **`sudo`** because reading raw packets is privileged. **`-i any`** captures on *all* interfaces (or name one like `-i enp3s0`); **`-n`** disables name lookups so it prints numeric IPs and ports *fast* (without `-n` it does reverse-DNS on everything and floods you). **`-c 5`** stops after 5 packets — always start with a small count so you don't drown.",
        "**Watching DNS.** Run **`sudo tcpdump -ni any port 53`** and, in another terminal, run `dig example.com`. You'll see two lines: your host sending an **`A?` query** to the resolver on port 53, and the resolver's **answer** coming back. Seeing the question leave and the answer return (or *not* return) instantly separates 'my query never went out' from 'the resolver never replied'.",
        "**Reading a TCP handshake.** Filter to a web connection with **`host example.com and port 443`**, then open that site. tcpdump shows the **`Flags`**: **`[S]`** is the client's **SYN**, **`[S.]`** is the server's **SYN-ACK**, and **`[.]`** is the client's **ACK**. Those three lines *are* the 3-way handshake from stage 3, happening in front of you — after them, data flows.",
        "**Filters keep the noise out.** A capture filter narrows what tcpdump even records. The primitives: **`host X`** (traffic to/from an IP), **`port N`** (a port), **`net X/Y`** (a whole subnet), and the direction modifiers `src`/`dst`. Combine them with **`and`**, **`or`**, **`not`** (quote the expression if it has spaces): `'tcp and port 22 and not host 192.168.1.50'` = 'SSH traffic, but ignore that one host'.",
        "**`net 192.168.1.0/24`** limits capture to your LAN — useful for watching local chatter (ARP, DHCP, mDNS) without the wider internet mixed in. Matching stage 2's subnet knowledge, the `/24` here means exactly the same thing: 'these 256 addresses'.",
        "**Save and replay.** **`-w file.pcap`** writes raw packets to a file instead of your screen (great for capturing a rare event, then studying it later); **`-r file.pcap`** reads one back. The `.pcap` format is universal — the same file opens in Wireshark.",
        "**Wireshark is tcpdump with a GUI and superpowers.** For deep analysis you'll want **Wireshark** (`sudo dnf install wireshark`): it colour-codes, reassembles TCP streams, decodes hundreds of protocols, and lets you click a handshake to expand every field. Capture headless with `tcpdump -w` on a server, copy the `.pcap` to your laptop, open it in Wireshark — a very common workflow.",
      ],
      exercise:
        "Catch a handshake and a lookup in the act. In terminal A run `sudo tcpdump -ni any port 53`; in terminal B " +
        "run `dig example.com` and confirm you see the query leave and the answer return. Now in terminal A run " +
        "`sudo tcpdump -ni any host example.com and port 443`; in terminal B run `curl -sI https://example.com` and " +
        "identify the three handshake packets by their `Flags`: `[S]`, `[S.]`, `[.]`. Finally, capture 20 packets to " +
        "a file with `sudo tcpdump -ni any -c 20 -w /tmp/cap.pcap`, then read them back with `tcpdump -nr " +
        "/tmp/cap.pcap` — and, if you have it, open the same file in Wireshark.",
      drills: [
        "Run `sudo tcpdump -ni any -c 10 icmp`, then `ping -c 3 1.1.1.1` in another terminal, and watch the echo request/reply pairs.",
        "Run `sudo tcpdump -ni any arp` on a LAN and watch 'who-has / is-at' ARP chatter (the link-layer address hunt).",
        "Run `sudo tcpdump -ni any -c 5 port 80 or port 443` to grab the next few web packets.",
        "Run `sudo tcpdump -D` to list every interface tcpdump can capture on.",
      ],
      note:
        "On a busy link, always add a filter and a `-c` count or you'll be buried instantly. tcpdump only sees " +
        "traffic that reaches *your* interface — on a switched LAN you won't see other machines' unicast traffic " +
        "(that's the switch doing its job from stage 1). And modern web traffic is encrypted (TLS), so you'll see " +
        "the handshake and packet sizes but not the payload — that's the point of the next-but-two stage.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "Speak protocols by hand",
      tag: "become the client",
      time: "half a day",
      payoff:
        "Protocols like HTTP are just text you could type yourself — and once you *do* type it, the web stops " +
        "being magic. `curl -v` shows you the exact request and response, headers and status codes; `ncat` lets " +
        "you speak raw HTTP with your own fingers. This is how you test an API, debug a redirect, or prove a " +
        "server is misbehaving rather than the network.",
      concepts: [
        "curl -v: request & response",
        "HTTP headers & status codes",
        "curl -I (headers only)",
        "redirects (-L) & methods",
        "raw HTTP by hand with ncat",
        "end-to-end request tracing",
      ],
      code:
`# The verbose view: see the whole HTTP conversation
curl -v https://example.com 2>&1 | head -40
#   > lines are what curl SENT (request);  < lines are what it RECEIVED (response)

# Just the response headers (a HEAD request)
curl -I https://example.com       # status line + headers, no body

# Follow redirects and show where you land
curl -sIL http://example.com      # -L follows 301/302 to the final URL

# Send data, set headers, pick a method (the building blocks of API calls)
curl -s -X POST https://httpbin.org/post \\
     -H "Content-Type: application/json" \\
     -d '{"hello":"world"}'

# Speak raw HTTP/1.1 by hand — you type the protocol yourself
printf 'GET / HTTP/1.1\\r\\nHost: example.com\\r\\nConnection: close\\r\\n\\r\\n' \\
  | ncat example.com 80          # ncat = the netcat from nmap-ncat`,
      lang: "bash",
      walkthrough: [
        "**`curl -v` shows the full conversation.** The **`>`** lines are exactly what curl **sent** (the request: a method, a path, and headers); the **`<`** lines are what the server **sent back** (the response: a status line, headers, then the body). Seeing both halves side by side is how you tell 'my request was wrong' from 'the server's answer was wrong'.",
        "**The request line and method.** An HTTP request starts with a **method** and **path**: `GET /` (fetch a page), `POST /login` (submit data), `HEAD` (headers only), `PUT`/`DELETE` (update/remove). `GET` is the default; **`-X POST`** changes it.",
        "**Status codes are the server's one-word verdict.** **`2xx`** = success (200 OK), **`3xx`** = redirect (301 moved permanently, 302 temporarily), **`4xx`** = *your* fault (404 not found, 401 unauthorized, 403 forbidden), **`5xx`** = *server's* fault (500 internal error, 502 bad gateway, 503 unavailable). Reading that first digit tells you which side to investigate.",
        "**Headers carry the metadata.** Both sides send **headers** — `Host:` (which site you want, essential when one IP hosts many), `Content-Type:` (what format the body is), `Location:` (where a redirect points), `Set-Cookie:`, caching directives. **`curl -I`** issues a **HEAD** request that returns *only* the status line and headers, no body — the quickest way to check 'is this URL alive and what does it say about itself?'.",
        "**Redirects with `-L`.** By default curl shows you the `301`/`302` and stops. **`-L`** tells it to *follow* the `Location:` header to the final destination — so `curl -sIL http://example.com` reveals the whole redirect chain (e.g. http → https → www). Great for debugging 'it keeps redirecting' loops.",
        "**Sending data.** **`-H`** sets a request header, **`-d`** sends a body (and implies `POST`). The `httpbin.org/post` example is a safe echo service that shows you exactly what it received — perfect for learning how API calls are shaped before you point them at something real.",
        "**Raw HTTP by hand with `ncat`.** HTTP over port 80 is *plain text*, so you can be the client yourself: send **`GET / HTTP/1.1`**, a **`Host:`** header (required in HTTP/1.1), **`Connection: close`** (so the server hangs up when done), and a **blank line** to end the headers. The `\\r\\n` are the carriage-return + newline the protocol demands. `ncat` opens the TCP socket and pipes your text straight to the server — and the raw response comes back. This is the moment protocols stop being abstract.",
        "**End to end.** Putting it together: `curl -v` shows the request leaving and response arriving; if it hangs, you drop to `tcpdump` (stage 6) to see whether packets even left; if the *name* won't resolve, you're back to `dig` (stage 5). Each tool inspects a different layer of the same request.",
      ],
      exercise:
        "Trace one web request end to end. Run `curl -v https://example.com` and identify: the request method and " +
        "path in the `>` lines, and the status code and three interesting headers in the `<` lines. Run `curl -sIL " +
        "http://<a-site-that-redirects>` and write down each hop of the redirect chain and its status code. Send an " +
        "API-style call with `curl -s -X POST https://httpbin.org/post -H 'Content-Type: application/json' -d " +
        "'{\"x\":1}'` and find your data echoed in the response. Finally, become the client: use the raw `printf ... " +
        "| ncat example.com 80` one-liner and read the raw HTTP response you got back by hand.",
      drills: [
        "Run `curl -I https://example.com` and read just the status line and headers.",
        "Run `curl -s -o /dev/null -w '%{http_code} %{time_total}s\\n' https://example.com` to print only the status code and total time.",
        "Run `curl -sL -o /dev/null -w '%{url_effective}\\n' http://github.com` to see the final URL after redirects.",
        "Run the raw-HTTP `ncat` one-liner against a site and count how many response headers you got back.",
      ],
      note:
        "`curl -I` sends a **HEAD** request; a few servers handle HEAD differently from GET, so if `-I` looks odd, " +
        "retry with `curl -sD - -o /dev/null URL` to see the headers of a real GET. And speaking raw HTTP only works " +
        "in the clear on port 80 — on port 443 the bytes are encrypted by TLS, which is exactly what the next stage-9 " +
        "detour into `openssl s_client` lets you get underneath.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "Network mapping & discovery",
      tag: "what's on my network",
      time: "1 day",
      payoff:
        "You can't secure or troubleshoot what you can't see. Discovery tools build a picture of a network: " +
        "which hosts are alive, what services they run, and how they're named. Learn `nmap`, the ARP table and " +
        "mDNS and you can walk into any LAN and map it — a skill that's equal parts sysadmin, security and " +
        "plain curiosity. (Live, browser-based versions of these tools live at `https://topo.carino.systems`.)",
      concepts: [
        "ip neigh — the ARP table",
        "nmap -sn — host discovery",
        "nmap -sV — service/version scan",
        "arp-scan for a raw sweep",
        "mDNS / avahi (.local names)",
        "ethics: scan only what you own",
      ],
      code:
`# Who has my machine recently talked to on the LAN? (the ARP/neighbour table)
ip neigh                          # IP <-> MAC pairs your host has learned

# Sweep the LAN for live hosts (no port scan, just 'who's up?')
sudo nmap -sn 192.168.1.0/24      # -sn = ping scan / host discovery only

# Scan one host's ports and fingerprint the services & versions
sudo nmap -sV 192.168.1.10        # -sV probes open ports for service + version
sudo nmap -p 1-1000 192.168.1.10  # scan a specific port RANGE

# A fast raw layer-2 sweep (sends ARP directly; LAN only). dnf install arp-scan
sudo arp-scan --localnet          # every device that answers ARP on your subnet

# mDNS / Bonjour: '.local' names announced on the LAN. dnf install avahi-tools
avahi-browse -at                  # services (printers, Chromecasts...) announcing themselves
getent hosts somehost.local       # resolve a .local name via mDNS`,
      lang: "bash",
      walkthrough: [
        "**⚠️ Ethics first: only scan networks you own or are explicitly authorised to test.** Port-scanning someone else's network can be against the rules or the law, and will look hostile. On your *own* home lab it's a fantastic learning tool — keep it there.",
        "**`ip neigh` is your free first map.** It prints the **neighbour (ARP) table**: the IP↔MAC pairs your host has recently learned on the local wire. ARP is the link-layer mechanism (stage 6's 'who-has / is-at') that finds the MAC behind an IP. This costs nothing and instantly shows which local machines you've been talking to.",
        "**`nmap -sn` finds live hosts.** **`-sn`** ('no port scan') does *host discovery only* — it pings each address in the range and lists which answer. **`nmap -sn 192.168.1.0/24`** sweeps your whole `/24` (stage 2's subnet notation again) and tells you every device that's up. This is the fast 'what's on this network?' pass.",
        "**`nmap -sV` fingerprints services.** Once you know a host is up, **`-sV`** connects to its open ports and *probes* each one to identify the **service and version** (e.g. `22/tcp open ssh OpenSSH 9.6`). This is how you learn what a device actually *does*. **`-p 1-1000`** restricts to a port range to keep it quick; a bare scan checks the 1000 most common ports.",
        "**`arp-scan --localnet` is the raw layer-2 sweep.** It sends **ARP requests** directly to every address on your subnet and lists everyone who answers, with their MAC and vendor. Because ARP is answered by the device's NIC itself, this catches hosts that ignore pings — often a more complete LAN inventory than an ICMP sweep.",
        "**mDNS / Avahi names the friendly stuff.** Multicast DNS lets devices announce themselves on the LAN under **`.local`** names with *no* DNS server — this is Apple's Bonjour and how printers, Chromecasts and `raspberrypi.local` appear. **`avahi-browse -at`** lists every service advertising itself; **`getent hosts x.local`** resolves a `.local` name.",
        "**Building the picture.** Combine them: `ip neigh` and `arp-scan` for *who's there* (IP+MAC), `nmap -sn` to confirm liveness, `nmap -sV` for *what they run*, and `avahi-browse` for *what they call themselves*. Ten minutes of this on your own LAN turns a mystery of blinking boxes into a labelled inventory — the same recon a defender does to know their own turf.",
      ],
      exercise:
        "Map your own LAN (and only your own). Start free: `ip neigh` to list neighbours you've already talked to. " +
        "Then sweep for everyone: `sudo nmap -sn <your-subnet>/24` (use your real subnet from `ip -br a`) and count " +
        "the live hosts. Pick *one* device you own — your router is a good choice — and run `sudo nmap -sV <its-ip>` " +
        "to see what services it exposes; note anything you didn't expect. Cross-check with `sudo arp-scan " +
        "--localnet`. Finally run `avahi-browse -at` and identify at least one device by its `.local` name. Write a " +
        "short inventory: IP, MAC, and role for each host you found.",
      drills: [
        "Run `ip neigh` and match one entry's MAC vendor prefix to a device you recognise.",
        "Run `sudo nmap -sn <your-subnet>/24` and compare its host count to `arp-scan --localnet`.",
        "Run `sudo nmap -p 22,80,443 <your-router-ip>` to check just three ports on one host.",
        "Run `avahi-browse -art | grep -i -E 'printer|cast|http'` to spot advertised services on your LAN.",
      ],
      note:
        "Reminder: nmap is a professional tool that can trip intrusion-detection systems — never point it at " +
        "networks you don't control. A `-sV` scan is 'loud' and slow; `-sn` is quick and gentle. If a host shows as " +
        "'down' in nmap but you know it's up, its firewall may simply be dropping pings — try `nmap -Pn` to skip the " +
        "liveness check and scan anyway.",
    },

    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "TLS & HTTPS",
      tag: "the padlock, explained",
      time: "1 day",
      payoff:
        "The padlock in your browser is TLS, and it does two jobs at once: it **encrypts** the conversation so " +
        "nobody can read it, and it **authenticates** the server so you know you're really talking to your bank " +
        "and not an impostor. Learn to inspect a certificate with `openssl` and read curl's TLS errors, and " +
        "'your connection is not private' becomes a solvable diagnosis instead of a scary wall.",
      concepts: [
        "what encryption + authentication add",
        "certificates & Certificate Authorities",
        "the TLS handshake",
        "SNI (many sites, one IP)",
        "openssl s_client",
        "reading curl cert errors",
      ],
      code:
`# Inspect a site's certificate: who issued it, for whom, valid when?
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | openssl x509 -noout -subject -issuer -dates
#   subject= ...CN=example.com     <- who the cert is FOR
#   issuer=  ...CN=<some CA>        <- which Certificate Authority signed it
#   notBefore/notAfter             <- its validity window (expiry!)

# The full handshake detail: chain, protocol version, cipher
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \\
  | grep -E 'Protocol|Cipher|Verify return'

# curl reports cert problems clearly
curl -Iv https://example.com 2>&1 | grep -E 'SSL|subject|issuer|expire'

# See a deliberate certificate ERROR, then why -k 'fixes' it (insecurely)
curl -I https://expired.badssl.com          # fails: certificate has expired
curl -Ik https://expired.badssl.com         # -k skips verification (dangerous!)`,
      lang: "bash",
      walkthrough: [
        "**TLS adds two things to a plain connection.** **Encryption** scrambles the data so anyone watching the wire (recall stage 6 — they *can* watch) sees only gibberish. **Authentication** proves the server's identity via a **certificate**, so you can't be fooled by an impostor sitting in the middle. HTTPS is simply HTTP running inside a TLS tunnel on port 443.",
        "**Certificates and Certificate Authorities (CAs).** A certificate is a signed document saying 'the holder of this key really is `example.com`'. It's signed by a **CA** — a trusted third party (Let's Encrypt, DigiCert…) that your operating system already trusts (it ships a bundle of CA certs). Your machine trusts the *site* because it trusts the *CA that vouched for it* — a chain of trust from the site up to a root CA.",
        "**The TLS handshake, briefly.** After the TCP handshake, client and server negotiate: they agree a TLS version and cipher, the server presents its certificate, the client verifies that certificate against its trusted CAs and checks the name and dates, and they derive a shared secret key. Only then does encrypted data flow. If *any* check fails, the browser throws the scary warning instead of proceeding.",
        "**SNI — Server Name Indication — is why one IP can host many HTTPS sites.** Because the server needs to present the *right* certificate before it knows which site you want, the client announces the hostname **in the clear** at the very start of the handshake. That's what **`-servername example.com`** supplies to `openssl s_client`; omit it against a shared host and you may get the wrong certificate.",
        "**`openssl s_client -connect host:443` opens a raw TLS connection** and dumps everything about it — the certificate chain, the negotiated protocol and cipher, and the verification result. Piping into **`openssl x509 -noout -subject -issuer -dates`** decodes the presented certificate into the three things you usually care about: who it's **for** (subject/CN), who **signed** it (issuer/CA), and when it **expires** (notAfter). The `echo |` just feeds an empty input so the connection closes cleanly.",
        "**Reading the verify result.** In the handshake output, **`Verify return code: 0 (ok)`** means the certificate checked out; any other code is the reason it failed. **`Protocol`** and **`Cipher`** show what was negotiated — you want TLS 1.2 or 1.3, not ancient SSLv3.",
        "**curl's certificate errors, decoded.** `curl` fails *safely* on a bad cert and tells you why: **'certificate has expired'** (the `notAfter` date passed — renew it), **'self-signed certificate'** or **'unable to get local issuer certificate'** (no trusted CA vouches for it — common on internal/dev servers), **'certificate ... does not match'** (the name in the cert doesn't match the URL — often a missing SNI or wrong vhost). Each maps to a specific fix.",
        "**`-k` silences the error — and the protection.** **`curl -k`** (or `--insecure`) tells curl to *skip* certificate verification and connect anyway. It's fine to confirm 'the server works, it's just the cert', but understand what you gave up: with `-k` you've dropped the authentication half of TLS entirely, so *never* use it for anything real. The right fix is a valid certificate, not `-k`.",
      ],
      exercise:
        "Read a real certificate, then read a broken one. For a site you trust, run the `openssl s_client ... | " +
        "openssl x509 -noout -subject -issuer -dates` pipeline and record: who the cert is *for*, which CA *issued* " +
        "it, and its *expiry* date. Re-run and grep for `Protocol` and `Cipher` — note the TLS version negotiated. " +
        "Now visit the broken side: `curl -I https://expired.badssl.com` and read the exact error, then `curl -Ik " +
        "https://expired.badssl.com` and watch `-k` bypass it (and explain, in one sentence, why that's unsafe). " +
        "Bonus: try `https://self-signed.badssl.com` and `https://wrong.host.badssl.com` and match each to its " +
        "curl error message.",
      drills: [
        "Run the `openssl s_client | openssl x509 -noout -dates` pipeline on a site and note how many days until expiry.",
        "Run `curl -Iv https://example.com 2>&1 | grep -i 'SSL certificate verify'` to see the verification verdict.",
        "Run `openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | grep 'Protocol'` to read the TLS version.",
        "Compare `curl -I https://self-signed.badssl.com` (fails) with the same URL plus `-k` (works) and articulate the trade-off.",
      ],
      note:
        "Certificate expiry is one of the most common production outages there is — a cert quietly lapses and every " +
        "client refuses to connect at once; `openssl x509 -noout -dates` (or monitoring it) is cheap insurance. And " +
        "an 'unable to get local issuer certificate' error usually means an incomplete chain: the server forgot to " +
        "send its intermediate CA cert, not that the site is malicious.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Firewalls & filtering",
      tag: "who gets through",
      time: "half a day",
      payoff:
        "A firewall decides which packets are allowed in and out — the difference between a service exposed only " +
        "to the people who should reach it and one open to the whole internet. On Fedora/RHEL that's **firewalld**, " +
        "with **nftables** underneath. Learn to open a port, make it permanent, and *see what's blocking you*, and " +
        "'I can reach my service locally but not from another machine' becomes a five-second diagnosis.",
      concepts: [
        "stateful filtering",
        "firewalld zones",
        "--add-service / --add-port",
        "--permanent + --reload",
        "nftables basics",
        "seeing what's blocked",
      ],
      code:
`# What is the firewall allowing right now? (Fedora/RHEL: firewalld)
sudo firewall-cmd --state              # running?
firewall-cmd --get-default-zone        # usually 'public'
sudo firewall-cmd --list-all           # services, ports & interfaces allowed

# Open a service by NAME (firewalld knows http = 80, ssh = 22)
sudo firewall-cmd --permanent --add-service=http   # write to config...
sudo firewall-cmd --reload                         # ...then apply it live
sudo firewall-cmd --list-services                  # confirm it's listed

# Open a specific PORT firewalld doesn't know by name
sudo firewall-cmd --permanent --add-port=8080/tcp
sudo firewall-cmd --reload
sudo firewall-cmd --list-ports

# Peek at the raw engine underneath (nftables generates these)
sudo nft list ruleset | head -40

# 'Is the firewall the thing blocking me?' — test the port from another host
nc -vz <server-ip> 8080                # 'succeeded' = open, 'refused/timeout' = check firewall`,
      lang: "bash",
      walkthrough: [
        "**Stateful filtering is the key idea.** A modern firewall tracks the *state* of connections: it remembers that *you* opened a connection outbound, so it automatically lets the *replies* back in — you only need rules for *new, incoming* connections. That's why you can browse the web freely while blocking every unsolicited inbound packet; the firewall knows which is which.",
        "**firewalld and zones.** On Fedora/RHEL the default firewall manager is **firewalld**. It groups rules into **zones** — named trust levels (`public`, `home`, `trusted`…), each interface assigned to one. Most servers just use **`public`**. **`firewall-cmd --list-all`** is the command to remember: it shows everything the active zone permits in one screen.",
        "**Open by service name when you can.** firewalld ships definitions for common services, so **`--add-service=http`** opens port 80 without you memorising the number, and **`--add-service=ssh`** is open by default (so enabling the firewall doesn't lock you out over SSH). Names are self-documenting and less error-prone than raw numbers.",
        "**`--permanent` then `--reload` is the rhythm that trips everyone.** A bare `--add-service=http` changes the *running* firewall but is **lost on reload/reboot**. Adding **`--permanent`** writes it to config but does **not** apply it yet. So the reliable pattern is **`--permanent --add-...`** followed by **`--reload`** to make the saved rules live. Forgetting the reload is the classic 'my firewall change did nothing'.",
        "**`--add-port=8080/tcp`** opens a port firewalld has no name for — always specify **`/tcp`** or **`/udp`**. **`--list-services`** and **`--list-ports`** verify your work after reloading; get in the habit of confirming, because a typo in a permanent rule fails silently until you check.",
        "**nftables is the engine; firewalld is the driver.** Underneath, firewalld programs **nftables** (the modern Linux packet filter that replaced `iptables`). You rarely touch it directly, but **`sudo nft list ruleset`** shows the low-level rules firewalld generated — useful for understanding what's *really* enforced, or on a system that uses nftables directly without firewalld.",
        "**Seeing what's blocking you.** When a connection fails, the *symptom* tells you where: **'Connection refused'** means the packet arrived but nothing was listening (a service problem — recall stage 3's `ss`), while a **timeout / no response** often means a firewall silently *dropped* the packet. **`nc -vz <ip> <port>`** from another host is the cleanest test: `succeeded` = the port is open end to end; `refused`/`timed out` = start checking the firewall and the listen address.",
        "**Debian/Ubuntu differ.** There the common front-ends are **`ufw`** (`sudo ufw allow 8080/tcp`) or raw `iptables`/`nftables` — same underlying nftables engine, different commands. If you follow an Ubuntu tutorial on Fedora, translate its `ufw` lines into `firewall-cmd`.",
      ],
      exercise:
        "Open a port, prove it, and clean up. Run `sudo firewall-cmd --list-all` and read what's already allowed " +
        "(note `ssh` is there). Open HTTP durably: `sudo firewall-cmd --permanent --add-service=http`, then " +
        "`--reload`, then confirm with `--list-services`. Now open a custom port: add `8080/tcp` permanently, " +
        "reload, and verify with `--list-ports`. If you have a second machine, start a listener (`ncat -l 8080`) and " +
        "test from the other host with `nc -vz <server-ip> 8080` — watch it succeed. Then *close* 8080 " +
        "(`--permanent --remove-port=8080/tcp && --reload`) and re-test — watch it now refuse or time out. Finally, " +
        "peek at the raw rules with `sudo nft list ruleset | head`.",
      drills: [
        "Run `sudo firewall-cmd --get-active-zones` to see which zone each interface is in.",
        "Add a service in *runtime only* (no `--permanent`), `--reload`, and confirm it vanished — proving why `--permanent` matters.",
        "Run `nc -vz 1.1.1.1 443` and `nc -vz 1.1.1.1 444` and compare the 'succeeded' vs 'refused/timeout' results.",
        "Run `sudo firewall-cmd --list-all` and `sudo nft list ruleset | head -30` back to back to connect the friendly view to the raw one.",
      ],
      note:
        "Two firewalls can block you: the **host** firewall (firewalld, on the server itself) and a **network** " +
        "firewall (your router, or a cloud provider's 'security group'). If the host firewall says a port is open but " +
        "you still can't reach it from outside, suspect the network firewall next. And remember stage 3: a service " +
        "listening only on `127.0.0.1` is unreachable from other hosts *no matter how open the firewall is*.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "Troubleshooting toolkit & methodology",
      tag: "fix it in order",
      time: "1 day",
      payoff:
        "The difference between a beginner and a pro isn't more tools — it's a *method*. When 'the network is " +
        "broken', a pro walks the layers bottom-up (link? IP? gateway? DNS? service?) and isolates the fault in " +
        "minutes instead of randomly rebooting things. This stage gives you that checklist and the go-to tools " +
        "for each rung, so you're never staring at a dead connection with no idea where to start.",
      concepts: [
        "the layered checklist",
        "mtr / traceroute: latency vs loss",
        "MTU & ping -M do -s",
        "ethtool: link/speed/duplex",
        "nmcli device/connection",
        "common failure patterns",
      ],
      code:
`# THE LAYERED CHECKLIST — walk it in order, top to bottom
# 1. Is the LINK up? (physical/NIC)
ip -br link ; sudo ethtool enp3s0 | grep -E 'Link detected|Speed|Duplex'
# 2. Do I have an IP? (and not a 169.254 self-assigned one?)
ip -br a
# 3. Is my GATEWAY reachable? (can I leave my subnet?)
ping -c2 "$(ip route | awk '/default/ {print $3}')"
# 4. Is DNS working? (name vs IP — the stage-5 split)
ping -c2 1.1.1.1 && ping -c2 example.com
# 5. Is the SERVICE up and open? (stage 3 + stage 10)
ss -tulpn | grep :443 ; nc -vz example.com 443

# Path quality: where does latency rise or packets drop?
mtr -rw 1.1.1.1            # -r report mode, -w wide; loss% per hop
traceroute -n 1.1.1.1     # one-shot hop list

# MTU: is a too-big packet being silently dropped? (don't-fragment probe)
ping -M do -s 1472 -c 3 1.1.1.1   # 1472+28=1500; if this fails but small pings work -> MTU issue

# NetworkManager device & connection state
nmcli device status ; nmcli connection show`,
      lang: "bash",
      walkthrough: [
        "**Troubleshoot in layers, bottom-up.** Networking failures cascade — a dead link *looks* like a DNS problem which *looks* like a broken website. Walking the layers in order stops you chasing symptoms: **link → IP → gateway → DNS → service**. Fix the lowest broken rung first; everything above it may heal on its own.",
        "**Rung 1 — link.** Is the interface physically up? **`ip -br link`** shows `UP`/`DOWN`; **`ethtool`** confirms **`Link detected: yes`** and the negotiated **`Speed`/`Duplex`** (stage 1). No link means a cable, port or driver problem — no IP config can help until this is green. A gigabit port stuck at `100Mb/s` or `Half` duplex is a classic bad-cable clue.",
        "**Rung 2 — IP.** Do you actually *have* an address? **`ip -br a`** shows it. The red flag from stage 2: a **`169.254.x.x`** link-local address means **DHCP failed** — you got no real lease, so nothing beyond the local wire will work. Fix: renew the lease (`nmcli con up <name>`) or check the DHCP server.",
        "**Rung 3 — gateway.** Can you reach the door out? Ping your **default gateway** (stage 4). If the gateway answers but the internet doesn't, the fault is *upstream* of you (router/ISP), not your machine — a huge narrowing. If the gateway *doesn't* answer, it's local: your subnet, cable, or a missing default route.",
        "**Rung 4 — DNS.** The stage-5 split: **`ping 1.1.1.1`** (by IP) works but **`ping example.com`** (by name) fails ⇒ connectivity is fine, DNS is the culprit — jump to `dig @1.1.1.1 name`. This one test cleanly separates 'the network' from 'name resolution', the two things beginners constantly conflate.",
        "**Rung 5 — service.** The network's fine but the app won't connect? Check the *service*: **`ss -tulpn`** proves it's listening (and on `0.0.0.0`, not just `127.0.0.1` — stage 3), and **`nc -vz host port`** tests reachability through any firewall (stage 10). 'Refused' = nothing listening; 'timeout' = likely filtered.",
        "**`mtr` is `traceroute` + `ping`, continuously.** **`mtr -rw <host>`** shows every hop on the path *and* the **loss %** and latency at each — so you see not just *the route* but *where it degrades*. The key skill: **loss that starts at one hop and continues** to the end points to a real problem *at* that hop; loss at a *single middle* hop that doesn't carry through is usually a router de-prioritising pings, not a real fault. Rising latency pinpoints where the slowness is introduced.",
        "**MTU — the sneaky one.** The **MTU** is the largest packet a link carries (usually 1500 bytes). If something on the path has a smaller MTU and drops oversized packets silently, you get bizarre 'small requests work, big ones hang' symptoms (SSH connects, then freezes; pages half-load). **`ping -M do -s 1472`** sends a **d**on't-fragment packet of 1472 bytes (+28 of headers = 1500); if *small* pings succeed but this one fails with 'message too long / fragmentation needed', you've found an MTU problem.",
        "**`nmcli` for the config layer.** **`nmcli device status`** shows each interface's type and connection state; **`nmcli connection show`** lists the saved profiles. A device that's `disconnected` or a profile that's not active explains 'no network' at the configuration level — above the cable but below the IP.",
        "**Common patterns, matched to a rung.** *No link light* → rung 1 (cable/NIC). *`169.254` address* → rung 2 (DHCP). *Local works, internet doesn't* → rung 3 (gateway/route). *IPs work, names don't* → rung 4 (DNS). *Ping works, app refused* → rung 5 (service/firewall). *Connects then hangs on big transfers* → MTU. Memorise these five-to-six pairings and most outages announce their own cause.",
      ],
      exercise:
        "Run the whole checklist on a healthy system so it's muscle memory, then break something. Walk rungs 1–5 " +
        "with the commands above and record a green/red for each. Then run `mtr -rw 1.1.1.1` for 20 seconds and " +
        "identify the hop where latency first climbs and whether any hop shows sustained loss. Test MTU with `ping " +
        "-M do -s 1472 -c 3 1.1.1.1`. Now *induce* a fault: temporarily set a bogus DNS server (or use `dig " +
        "@192.0.2.1 example.com`, which will time out) and confirm your rung-4 test (`ping IP` ok, `ping name` " +
        "fails) correctly fingers DNS. Undo it. Write down which rung each of your tests exercises.",
      drills: [
        "Run `mtr -rw 8.8.8.8` and note which hop is your gateway (hop 1) and where, if anywhere, loss appears.",
        "Run `ethtool <iface> | grep -E 'Speed|Duplex|Link detected'` and confirm the link negotiated its full speed.",
        "Run `ping -M do -s 1500 -c 2 1.1.1.1` (oversized on purpose) and read the 'fragmentation needed' error.",
        "Run `nmcli device status` and `nmcli -f GENERAL.STATE,IP4.ADDRESS,IP4.GATEWAY device show <iface>` for a full one-device summary.",
      ],
      note:
        "Reach for tools in cost order: `ip`/`ping`/`ss` are instant and answer 90% of cases; `mtr`, `dig +trace` " +
        "and `tcpdump` are the heavier artillery for the stubborn 10%. And always ask 'what *changed*?' — most " +
        "outages follow a change (a new cable, a config edit, a cert expiry, an update), and retracing that is often " +
        "faster than any command.",
    },

    /* -------------------------------------------------------------- 12 */
    {
      n: 12,
      title: "Capstone — the whole stack",
      tag: "tie it all together",
      time: "1–2 days",
      payoff:
        "One exercise that exercises everything: you'll stand up a real service, reach it by IP and by name, open " +
        "the firewall, watch the connection form on the wire, and diagnose a deliberately-broken piece. If you can " +
        "do this end to end, you understand networking — not as isolated facts, but as one connected stack from " +
        "the socket to DNS to the firewall to the packets themselves.",
      concepts: [
        "stand up a tiny service",
        "reach it by IP then by name",
        "open the firewall port",
        "watch it with ss + tcpdump",
        "break & diagnose one thing",
        "the full-stack mental model",
      ],
      code:
`# 1. Stand up a tiny web service (serves the current directory on port 8000)
python3 -m http.server 8000 &        # or a raw listener: ncat -lk 8000
ss -tlpn | grep 8000                 # confirm it's LISTENing (stage 3)

# 2. Reach it locally, by IP, then by name
curl -s http://127.0.0.1:8000/ | head          # loopback
MYIP=$(ip -4 -o addr show scope global | awk '{print $4}' | cut -d/ -f1 | head -1)
curl -s "http://$MYIP:8000/" | head            # by your real IP
# add a name your host resolves, then use it:
echo "$MYIP  mylab.local" | sudo tee -a /etc/hosts
curl -s http://mylab.local:8000/ | head        # by NAME (stage 5)

# 3. Open the firewall so ANOTHER host can reach it (stage 10)
sudo firewall-cmd --permanent --add-port=8000/tcp && sudo firewall-cmd --reload

# 4. Watch a real connection form (run, then curl from another terminal/host)
sudo tcpdump -ni any port 8000       # see SYN / SYN-ACK / ACK + the GET (stages 3 & 6)

# 5. Break ONE thing on purpose, then diagnose with the stage-11 checklist:
sudo firewall-cmd --remove-port=8000/tcp   # runtime-close it; now debug why it fails`,
      lang: "bash",
      walkthrough: [
        "**Step 1 — stand up a service.** **`python3 -m http.server 8000`** starts a real HTTP server on port 8000 serving the current directory — no setup, on almost every Linux box. (**`ncat -lk 8000`** is the barebones alternative: a raw TCP listener, `-l` listen, `-k` keep accepting.) Then **`ss -tlpn | grep 8000`** confirms it's actually `LISTEN`ing and on which address — your stage-3 reflex. Note whether it bound `0.0.0.0` (reachable from outside) or only `127.0.0.1`.",
        "**Step 2 — reach it three ways, each testing a different layer.** **`curl http://127.0.0.1:8000`** over *loopback* proves the service itself works (stage 0). **`curl http://$MYIP:8000`** over your *real IP* proves it's reachable across the network stack (the `$MYIP` line just extracts your primary global IPv4 with `ip`/`awk`/`cut`). Then adding a line to **`/etc/hosts`** and using **`http://mylab.local:8000`** proves *name resolution* works (a local stand-in for DNS, stage 5) — the same request, now reached by name instead of number.",
        "**Why `/etc/hosts`?** It's the file the system checks *before* DNS — a manual name→IP mapping. Adding `mylab.local` there is the simplest possible 'DNS', letting you experience the by-IP vs by-name distinction without running a nameserver. (Remove the line when done to keep things tidy.)",
        "**Step 3 — open the firewall.** By default your host firewall blocks inbound 8000, so *another* machine can't reach it even though loopback works. **`firewall-cmd --permanent --add-port=8000/tcp && --reload`** opens it the durable way (stage 10). This is the moment the service goes from 'works on this box' to 'works on the network'.",
        "**Step 4 — watch the connection on the wire.** Run **`sudo tcpdump -ni any port 8000`**, then `curl` the service from another terminal or host. You'll see the entire stack in a few lines: the **`[S]` / `[S.]` / `[.]`** three-way handshake (stage 3), then the **`GET /`** request and the server's response — the encapsulated packets (stage 6) carrying the HTTP conversation (stage 7). Everything you've learned, scrolling past in real time.",
        "**Step 5 — break one thing and diagnose it.** Close the port again with **`firewall-cmd --remove-port=8000/tcp`** (runtime, so it comes back on reload) and try to reach it from another host: it now *times out*. Walk the stage-11 checklist: the service is still `LISTEN`ing (`ss`), loopback still works (so the service is fine), but `nc -vz $MYIP 8000` from outside times out (not 'refused') — the signature of a *firewall drop*, not a dead service. That reasoning — isolating the fault to one rung by testing each layer — *is* the skill this whole course was building toward.",
        "**The full-stack mental model.** Trace one `curl http://mylab.local:8000` all the way down: the **name** resolves to an IP (`/etc/hosts`/DNS), routing decides it's *local* so no gateway is needed (stage 4), ARP finds the MAC on the wire (stage 6), a TCP **socket** opens with the 3-way handshake (stage 3), the **firewall** allows the inbound packet (stage 10), the **service** accepts it and speaks **HTTP** back (stage 7) — all as **frames→packets→segments** you can watch with tcpdump. Hold that single picture in your head and you're no longer memorising commands; you're reading a system you understand.",
        "**Clean up.** Stop the server (`kill %1` or `Ctrl-C`), remove the `/etc/hosts` line you added, and re-`--reload` the firewall to drop the runtime port. Leaving a lab tidy is itself a good ops habit.",
      ],
      exercise:
        "Do the full loop, then prove you can debug it. (1) Start `python3 -m http.server 8000` and confirm it with " +
        "`ss -tlpn | grep 8000`. (2) Reach it three ways — loopback, your real IP, and a `mylab.local` name you add " +
        "to `/etc/hosts` — and confirm all three return the directory listing. (3) Open port 8000 in firewalld and, " +
        "from a second machine (or a phone on the same Wi-Fi, at `http://<your-ip>:8000`), load it. (4) Run `tcpdump " +
        "-ni any port 8000` and capture the handshake + GET while you reload the page. (5) Now have a friend (or " +
        "yourself) secretly break ONE thing — close the firewall port, OR stop the service, OR point the name at the " +
        "wrong IP — and use the stage-11 checklist to identify *which* it was and *why*, citing the specific command " +
        "whose output gave it away. Then clean everything up.",
      drills: [
        "Start the server, then from another device open `http://<your-ip>:8000` and confirm the page loads over the real network.",
        "With the server running, run `ss -tn state established | grep 8000` while a client is connected to see the live socket pair.",
        "Break it by binding local-only (`python3 -m http.server 8000 --bind 127.0.0.1`) and prove another host gets 'refused/timeout' while loopback still works — a listen-address fault, not a firewall one.",
        "Capture the full exchange to a file (`sudo tcpdump -ni any -w /tmp/cap.pcap port 8000`), reproduce a request, then read it back with `tcpdump -nr /tmp/cap.pcap` (or open it in Wireshark).",
      ],
      note:
        "The debugging *reasoning* is the real prize: 'refused' means the packet reached a host but nothing was " +
        "listening (service/bind-address), while 'timeout' means it was silently dropped (firewall/routing) — that " +
        "one distinction, plus the loopback-vs-real-IP-vs-name ladder, resolves the overwhelming majority of " +
        "real-world network problems. For live, browser-based versions of these tools to keep practising, visit " +
        "`https://topo.carino.systems`.",
    },
  ],
};
