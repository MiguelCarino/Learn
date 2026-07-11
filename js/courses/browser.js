/* =====================================================================
   Carino Learn — course: WEB BROWSERS
   Goal: take a complete beginner (or comfortable-but-curious user) and
   turn them into someone who understands what a browser really is, the
   web technologies it runs, how permissions and privacy work, and how to
   troubleshoot a broken page or a failed connection — hands-on, using the
   browser's OWN DevTools. Works in Chrome, Edge, Brave and Firefox.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["browser"] = {
  id: "browser",
  title: "Web Browsers",
  tag: "how the web runs",
  icon: "browser",
  blurb: "Understand what a browser is, the web it runs, and how to fix it.",
  intro:
    "This is a hands-on tour of the tool you already use all day. Twelve practical stages take you " +
    "from 'what actually is a browser?' to reading network traffic, understanding cookies, origins " +
    "and permissions, and confidently troubleshooting a broken page or a connection error — all " +
    "using the browser's own built-in DevTools (press F12). Everything works in Chrome, Edge, Brave " +
    "and Firefox; you only need a browser and curiosity.",
  meta: [["Engines", "Blink · Gecko · WebKit"], ["Tools", "DevTools"], ["Scope", "web platform"]],

  tracks: [
    { id: "engine", label: "What a browser is",     stages: [0, 1, 2, 3] },
    { id: "web",    label: "The web platform",       stages: [4, 5, 6, 7] },
    { id: "trust",  label: "Permissions & privacy",  stages: [8, 9] },
    { id: "fix",    label: "Troubleshooting",        stages: [10, 11, 12] },
  ],

  reference: [
    {
      kind: "table",
      title: "The major browsers & the engines inside them",
      head: ["browser", "engine", "what to know"],
      rows: [
        ["Chrome", "Blink (+ V8 for JS)", "Google's browser; the most common engine on the web"],
        ["Edge", "Blink (+ V8)", "Microsoft, rebuilt on Chromium in 2020 — behaves like Chrome"],
        ["Brave", "Blink (+ V8)", "Chromium-based with built-in tracker/ad blocking"],
        ["Firefox", "Gecko (+ SpiderMonkey)", "Mozilla's independent engine; strong privacy defaults"],
        ["Safari", "WebKit (+ JavaScriptCore)", "Apple's engine; on iPhones every browser must use it"],
      ],
      foot: "'Chromium' is the open-source base Chrome/Edge/Brave share. Testing in a Blink browser AND Firefox catches most cross-engine bugs.",
    },
    {
      kind: "table",
      title: "The DevTools panels and what each is for",
      head: ["panel", "use it to…"],
      rows: [
        ["Elements (Inspector in Firefox)", "see & live-edit the HTML/DOM and CSS of the page"],
        ["Console", "read errors, run JavaScript, log values — your REPL"],
        ["Network", "watch every request: URL, status, size, timing, headers"],
        ["Application (Storage in Firefox)", "inspect cookies, localStorage, IndexedDB, service workers"],
        ["Sources (Debugger in Firefox)", "view source files and set breakpoints to pause JS"],
        ["Performance", "record & profile what makes a page slow (CPU, rendering)"],
        ["Security", "check HTTPS/TLS, certificate details, mixed-content warnings"],
      ],
    },
    {
      kind: "table",
      title: "HTTP status codes & key response headers",
      head: ["code / header", "meaning"],
      rows: [
        ["200 OK", "success — here's the content"],
        ["301 / 302", "moved — follow the Location header (permanent / temporary)"],
        ["304 Not Modified", "your cached copy is still good; nothing re-sent"],
        ["403 Forbidden", "you're not allowed (auth/permissions)"],
        ["404 Not Found", "no such URL on this server"],
        ["500 / 502 / 503", "server error / bad gateway / service unavailable"],
        ["Content-Type", "what the body is: text/html, application/json, image/png…"],
        ["Cache-Control / ETag", "how long to cache, and a fingerprint for 304 checks"],
        ["Set-Cookie / Access-Control-Allow-Origin", "sets a cookie / permits a cross-origin (CORS) request"],
      ],
    },
    {
      kind: "cmds",
      title: "Shortcuts & about: pages worth knowing",
      rows: [
        ["Open DevTools", "F12  (or Ctrl+Shift+I / Cmd+Opt+I)"],
        ["Jump to Console", "Ctrl+Shift+J  (Cmd+Opt+J on Mac)"],
        ["Hard reload (bypass cache)", "Ctrl+Shift+R  (Cmd+Shift+R)"],
        ["Empty cache & hard reload", "DevTools open → right-click the reload button"],
        ["Browser & engine versions", "chrome://version   (Firefox: about:support)"],
        ["Advanced Firefox settings", "about:config"],
        ["Site permissions (Chrome)", "chrome://settings/content"],
        ["Low-level network tools (Chrome)", "chrome://net-internals"],
      ],
    },
    {
      kind: "table",
      title: "Web acronyms",
      head: ["term", "stands for", "in one line"],
      rows: [
        ["HTML", "HyperText Markup Language", "the tags that give a page its structure"],
        ["CSS", "Cascading Style Sheets", "the rules that style how a page looks"],
        ["DOM", "Document Object Model", "the live, in-memory tree of the page the browser renders"],
        ["URL", "Uniform Resource Locator", "a web address"],
        ["HTTP", "HyperText Transfer Protocol", "the request/response language of the web"],
        ["HTTPS", "HTTP Secure", "HTTP encrypted with TLS — the padlock"],
        ["TLS", "Transport Layer Security", "the encryption that protects a connection"],
        ["SSL", "Secure Sockets Layer", "the older name for TLS; used interchangeably"],
        ["DNS", "Domain Name System", "turns a site's name into a server's IP address"],
        ["SOP", "Same-Origin Policy", "default rule: a page can't read another origin's data"],
        ["CORS", "Cross-Origin Resource Sharing", "how a server opts in to allow cross-site reads"],
        ["API", "Application Programming Interface", "a service one program offers to another"],
        ["JSON", "JavaScript Object Notation", "a common, human-readable text format for data"],
        ["AJAX", "Asynchronous JavaScript and XML", "fetching data in the background without a full reload"],
        ["CDN", "Content Delivery Network", "edge servers that cache content close to users"],
        ["CSP", "Content Security Policy", "a header that limits what a page may load or run"],
        ["PWA", "Progressive Web App", "a website that can behave like an installed app"],
        ["CA", "Certificate Authority", "a trusted issuer of HTTPS certificates"],
        ["SNI", "Server Name Indication", "tells a server which site's certificate to send"],
        ["HSTS", "HTTP Strict Transport Security", "forces HTTPS-only connections to a site"],
        ["ETag", "Entity Tag", "a fingerprint used to check if a cached file changed"],
        ["MIME type", "Multipurpose Internet Mail Extensions", "labels content, e.g. text/html or image/png"],
        ["REPL", "Read-Eval-Print Loop", "the Console's interactive type-and-run prompt"],
      ],
      foot: "Each of these is spelled out in full the first time it appears in a stage, then used in short form.",
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "What a browser actually is",
      tag: "the engine under the hood",
      time: "1–2 hrs",
      payoff:
        "A browser looks like one app, but it's really several engines working together: one that " +
        "turns code into pixels, one that runs JavaScript, and a network layer that fetches it all. " +
        "Understanding this split — and that each tab is its own isolated process — is the mental " +
        "model everything else in this course hangs on, and it explains why one bad tab rarely takes " +
        "down the whole browser.",
      concepts: [
        "rendering engine (Blink/Gecko/WebKit)",
        "JS engine (V8/SpiderMonkey)",
        "the URL bar & navigation",
        "tabs = separate processes",
        "site isolation",
        "URL → painted page pipeline",
      ],
      code:
`// Open DevTools first: press F12 (or Ctrl+Shift+I / Cmd+Opt+I).
// Then in the address bar, visit this page to see what you're running:
//   chrome://version        (Chrome / Edge / Brave)
//   about:support           (Firefox)

// Now paste this into the DevTools Console and press Enter —
// it prints your browser's own description of itself:
navigator.userAgent`,
      lang: "text",
      walkthrough: [
        "**A browser is not one program but a team.** The **rendering engine** (Chrome's is **Blink**, Firefox's is **Gecko**, Safari's is **WebKit**) turns **HTML** (HyperText Markup Language) and **CSS** (Cascading Style Sheets) into the boxes, text and colours you see. A separate **JavaScript engine** (Chrome's **V8**, Firefox's **SpiderMonkey**) runs the code that makes pages interactive. A **network layer** fetches everything over the internet. They cooperate to show you a page.",
        "**Press `F12`** to open **DevTools** — the built-in inspector that is your workbench for this entire course. It docks to the side or bottom of the window and has tabs across the top (Elements, Console, Network…). If `F12` is taken by something, `Ctrl+Shift+I` (or `Cmd+Opt+I` on a Mac) does the same.",
        "**Visit `chrome://version`** (or `about:support` in Firefox). These are internal pages the browser serves *to itself* — no internet needed. They tell you the exact browser version, the engine, and even the command-line flags it launched with. Knowing your version is the first thing anyone will ask when you report a problem.",
        "**Each tab is its own operating-system process.** Modern browsers use **site isolation**: different websites run in separate, sandboxed processes so that a crash — or a malicious script — in one tab can't read the data of another or bring down the whole browser. That's why you sometimes see one tab die with a 'sad tab' icon while the rest keep working. (Open your OS task manager, or Chrome's own **Shift+Esc**, and you'll see multiple browser processes.)",
        "**`navigator.userAgent`** in the Console prints a string the browser uses to identify itself to websites — it names the engine and version. It's a gentle first taste of the Console as a place where you can ask the browser questions in JavaScript and get answers instantly.",
        "**From URL to picture, briefly.** When you type an address and hit Enter: (1) the name is looked up via **DNS** (the Domain Name System) to find a server's IP address, (2) a connection is opened (usually encrypted with **HTTPS** — HyperText Transfer Protocol Secure — running over **TLS**, Transport Layer Security), (3) the server returns the **HTML**, (4) the browser parses it into a tree, fetches the **CSS** and **JavaScript** it references, then (5) lays everything out and **paints** it to the screen. You'll meet each of these steps up close in the stages ahead.",
      ],
      exercise:
        "Get oriented in your own browser. Press F12 to open DevTools and note the panel names across the top — " +
        "you'll live here for the rest of the course. In the address bar visit chrome://version (or about:support " +
        "in Firefox) and write down your browser name, version number, and its engine. Back in the Console, run " +
        "navigator.userAgent and see if you can spot the engine name inside the string. Finally, open your browser's " +
        "task manager (Shift+Esc in Chrome, or your OS task manager) and count how many separate processes your " +
        "browser is running right now.",
      drills: [
        "Press F12, then click each top tab once (Elements, Console, Network…) just to see what's there.",
        "Visit about:blank — a real, empty page the browser serves instantly with no network.",
        "In the Console, run navigator.language and window.innerWidth to ask the browser two quick facts about itself.",
        "Open a second tab, then Shift+Esc (Chrome) to watch a new process appear for it.",
      ],
      note:
        "On iPhones and iPads, every browser — even 'Chrome' — is required by Apple to use the WebKit engine " +
        "underneath, so a bug you see only on iOS is often a WebKit quirk, not a Chrome one. On desktop and Android " +
        "the engines are genuinely different, which is why cross-browser testing matters.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "HTML, CSS & the DOM",
      tag: "structure, style & the live tree",
      time: "half a day",
      payoff:
        "Every web page is three things layered together: HTML (HyperText Markup Language) for structure, " +
        "CSS (Cascading Style Sheets) for style, and the DOM (Document Object Model) — the live, in-memory " +
        "tree the browser actually renders and that JavaScript can change. " +
        "Once you can see and edit that tree in the Elements panel, web pages stop being magic and " +
        "become something you can inspect, tweak and understand.",
      concepts: [
        "HTML = structure, CSS = style",
        "the DOM as a live tree",
        "the Elements/Inspector panel",
        "live-editing an element",
        "document.querySelector",
        "elements vs the source",
      ],
      code:
`// Run in the DevTools Console on ANY page.
// Grab the first heading on the page and read its text:
document.querySelector("h1")

// Read just the words inside it:
document.querySelector("h1").textContent

// Harmlessly change it (only on YOUR screen, until you reload):
document.querySelector("h1").textContent = "I edited the DOM!"`,
      lang: "text",
      walkthrough: [
        "**HTML** is the *structure* of a page — headings, paragraphs, links, images — written as nested tags like `<h1>` and `<p>`. **CSS** is the *style* — colours, fonts, spacing, layout — that says how those elements should look. A page is HTML dressed by CSS.",
        "**The DOM** is the crucial idea. When the browser reads your HTML, it builds a **live tree** of objects in memory — one node per element, nested exactly like the tags. This tree, not the original text file, is what actually gets rendered, and it's what JavaScript reads and changes. 'The DOM' just means 'the page, as a tree you can touch.'",
        "**Open the Elements panel** (called **Inspector** in Firefox). It shows the DOM tree. Click the little arrow/cursor icon in its top-left, then hover over anything on the page — the matching node highlights in the tree. This 'inspect' gesture is the single most useful thing DevTools does.",
        "**Live-edit right there.** Double-click any text in the Elements tree and type over it, or right-click a node → *Edit as HTML*. On the right, the **Styles** pane lets you toggle and change CSS rules and watch the page update instantly. Nothing you do here is saved — it's a sandbox on your own screen that vanishes on reload — so experiment freely.",
        "**`document.querySelector(\"h1\")`** does the same selection from the Console using JavaScript. `document` is the whole page; `querySelector` finds the *first* element matching a CSS selector (`\"h1\"` = the first top-level heading, `\".menu\"` = first element with class `menu`, `\"#logo\"` = the element with id `logo`). It hands you back that DOM node.",
        "**`.textContent`** reads (or sets) the words inside an element. Assigning to it — `... .textContent = \"...\"` — rewrites that node in the live DOM, and the page updates immediately. This is exactly how interactive sites change what you see without reloading; you're doing by hand what their JavaScript does automatically.",
        "**Elements shows the live DOM, not the original file.** If a page's JavaScript adds or changes elements after loading, the Elements panel reflects the *current* state, which can differ from 'View Source' (the raw HTML the server sent). When they disagree, trust Elements for what's on screen now, and View Source for what arrived.",
      ],
      exercise:
        "Inspect and edit a real page. Go to any website, press F12, and open the Elements/Inspector panel. Click " +
        "the inspect (cursor) icon and hover over a headline or button — watch it highlight in the tree. Double-click " +
        "its text in the tree and change it; see the page update. Now do it from code: in the Console run " +
        "document.querySelector(\"h1\").textContent to read the first heading, then assign a new string to it and " +
        "watch it change. Reload the page and confirm every edit disappears — proof you were only changing your own " +
        "live copy, never the real website.",
      drills: [
        "In the Console, run document.title to read the page's title (the text in the browser tab).",
        "Run document.querySelectorAll(\"a\").length to count how many links are on the page.",
        "In Elements, right-click any element → 'Copy' → 'Copy selector' to get a CSS selector for it.",
        "In the Styles pane, tick and untick a CSS property's checkbox and watch the element change.",
      ],
      note:
        "querySelector returns only the FIRST match; use querySelectorAll to get all of them as a list. If it " +
        "returns null, either nothing matches your selector or the element hasn't been added to the DOM yet — a " +
        "common surprise on pages that build themselves with JavaScript after the initial load.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "JavaScript & the engine",
      tag: "making pages do things",
      time: "half a day",
      payoff:
        "JavaScript is the language that makes pages interactive, and the Console is a live REPL " +
        "(Read-Eval-Print Loop — an interactive prompt) where " +
        "you can run it against the real page in front of you. Learning to try a line, read the result, " +
        "and understand the one-at-a-time event loop turns the Console from an intimidating black box " +
        "into the fastest way to explore, test and debug anything on the web.",
      concepts: [
        "the Console as a REPL",
        "variables & functions",
        "console.log",
        "expressions & return values",
        "the event loop (one line at a time)",
        "running JS on a live page",
      ],
      code:
`// Type these into the DevTools Console one line at a time, pressing Enter.
2 + 2                         // the Console shows the result: 4
let name = "world";           // store a value in a variable
console.log("hello, " + name) // print a message: hello, world

// A tiny function, then call it:
function double(x) { return x * 2; }
double(21)                    // -> 42

// Ask the live page a question:
document.querySelectorAll("img").length   // how many images are here?`,
      lang: "text",
      walkthrough: [
        "**The Console is a REPL** — Read, Evaluate, Print, Loop. You type an expression, press Enter, and it *immediately* shows the result. **`2 + 2`** returns `4`. There's no file to save, no page to reload — it's a calculator, notepad and remote control for the page all at once, and the best place to learn JavaScript.",
        "**Variables store values.** **`let name = \"world\"`** creates a named box holding the text `\"world\"`. Text in quotes is a *string*; you also have numbers (`42`), true/false *booleans*, lists (*arrays*), and *objects*. Use `let` when the value may change and `const` when it shouldn't.",
        "**`console.log(...)`** prints whatever you give it to the Console. It looks similar to just typing an expression, but `console.log` is what you sprinkle *inside* real code to see what's happening as it runs — the humble print statement is still the most-used debugging tool in the world.",
        "**Expressions return values; statements do things.** `double(21)` is an expression that *evaluates to* `42`, so the Console echoes `42`. `let name = ...` is a statement that *does* something (creates a variable) and returns nothing useful. Noticing which is which helps you read what the Console is telling you.",
        "**Functions are reusable recipes.** **`function double(x) { return x * 2; }`** defines a step (take `x`, give back double it); **`double(21)`** *calls* it with the input `21` and gets `42` back. Functions let you name a piece of behaviour once and reuse it — the building block of every program.",
        "**JavaScript runs one thing at a time — the event loop.** A browser tab has a single main thread. JavaScript runs to completion, then the browser handles the next queued task: a click, a timer firing, a network response arriving. This is why a slow script can 'freeze' a page (it's hogging the one thread), and why long work is broken into small pieces or handed to the network to run 'in the background' and call you back later.",
        "**You can run JS against the real page.** Combine what you know: `document.querySelectorAll(\"img\").length` asks the live DOM (Document Object Model) how many images it currently has. The Console isn't a toy sandbox — it's operating on the actual page you're looking at, which is exactly why it's such a powerful tool for exploring and fixing sites.",
      ],
      exercise:
        "Use the Console as a REPL. Open any page, press F12, click Console. Do maths: type 7 * 6 and confirm it " +
        "echoes 42. Make a variable: let city = \"Lisbon\", then run console.log(\"Hello from \" + city). Write and " +
        "call a small function that adds two numbers. Finally, point JavaScript at the live page: run " +
        "document.querySelectorAll(\"a\").length to count links, then document.body.style.background = \"pink\" and " +
        "watch the page turn pink (reload to undo). You've just read from and written to a real website with code.",
      drills: [
        "Run typeof 42, typeof \"hi\", and typeof true to see JavaScript name each kind of value.",
        "Run [1,2,3].map(n => n * 10) to transform a list — the Console prints the new array.",
        "Trigger an error on purpose: run notARealFunction() and read the red message the Console shows.",
        "Run console.log('a'); console.log('b') and note they appear in order — one line at a time.",
      ],
      note:
        "Some sites paste-block the Console with a 'Self-XSS' warning — a safety measure to stop scammers from " +
        "talking you into pasting malicious code that steals your account. The lesson is real: never paste code you " +
        "don't understand into the Console of a site you're logged into. Everything in this course is safe to run.",
    },

    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "How a page loads",
      tag: "the Network panel & the waterfall",
      time: "half a day",
      payoff:
        "A single web page is rarely one download — it's dozens of separate requests for HTML " +
        "(HyperText Markup Language), CSS (Cascading Style Sheets), scripts, fonts and images, each with " +
        "its own status, size and timing. The Network panel makes " +
        "all of it visible, and it's where you'll answer the two most common questions on the web: " +
        "'why is this slow?' and 'which request failed?'.",
      concepts: [
        "the Network panel",
        "the request waterfall",
        "status, size & timing columns",
        "the critical path (HTML→CSS/JS→render)",
        "types of resources",
        "curl -I to see the same headers",
      ],
      code:
`# Run in a terminal (not the browser) — fetch just the response headers
# of a page, the same top-of-request info the Network panel shows:
curl -I https://example.com

# -I asks for HEADERS ONLY (an HTTP HEAD request), so you see the
# status line and headers without downloading the whole page body.
# Try a redirecting URL and watch the 301/302 and Location header:
curl -I http://github.com`,
      lang: "bash",
      walkthrough: [
        "**Open the Network panel, then reload the page** (the panel only records while it's open, so reload with `Ctrl+R` to capture the load). You'll see a list fill up: one row per **request** the page made — the HTML document first, then every CSS file, script, font and image it pulls in. A rich page can make dozens or hundreds.",
        "**The waterfall** is the cascade of coloured bars on the right. Each bar shows *when* a request started and *how long* it took, stacked in time. Because requests depend on each other (the browser can't fetch a CSS file until it has read the HTML that mentions it), the shape reveals bottlenecks — long bars are slow responses, staircases mean things are waiting on each other.",
        "**The columns are your dashboard.** **Status** is the HTTP (HyperText Transfer Protocol) result (`200` good, `304` served from cache, `404` missing, red = failed). **Type** is what it is (document, stylesheet, script, image). **Size** shows bytes transferred (and whether it came 'from cache'). **Time** is how long it took. Click any column header to sort — sort by Size to find the heaviest download, by Time to find the slowest.",
        "**Click a single request** to open its details: **Headers** (the request and response headers you'll study next stage), **Preview/Response** (the actual content returned), and **Timing** (a breakdown of DNS — Domain Name System — lookup, connection, waiting, and download). This per-request view is where 'the page is broken' investigations usually end.",
        "**The critical path** is the sequence that must finish before the user sees a usable page: the browser fetches the **HTML**, discovers the **CSS** and **JavaScript** it needs, fetches those, then can **render**. CSS blocks rendering (the browser won't show unstyled content), and scripts can block parsing — which is why 'reduce and defer your CSS/JS' is the heart of web performance.",
        "**`curl -I https://example.com`** does the very first step from a terminal, no browser involved. **`curl`** is a command-line tool that speaks HTTP; **`-I`** asks for *headers only* (an HTTP `HEAD` request), so you get the status line and response headers without downloading the whole body. It's the same information the Network panel shows in a request's Headers tab — handy for scripting, servers with no GUI, or confirming a browser isn't adding its own caching into the picture.",
        "**Redirects show up plainly.** `curl -I http://github.com` returns a `301` with a **`Location:`** header pointing at the `https://` version — the server telling the browser 'go here instead'. In the Network panel the same thing appears as two rows: the redirect, then the final page.",
      ],
      exercise:
        "Watch a page load, request by request. Open the Network panel, tick 'Preserve log' if you like, then reload " +
        "a content-rich site (a news site works well). Count the requests at the bottom of the panel and read the " +
        "total transferred size. Sort by Size to find the single heaviest resource, and by Time to find the slowest. " +
        "Click the very first request (the HTML document) and read its Status and its Timing breakdown. Then open a " +
        "terminal and run curl -I on the same site's URL — match the status code and Content-Type you see there to " +
        "what the Network panel reported for that first request.",
      drills: [
        "In the Network panel, use the filter buttons (All / JS / CSS / Img / Fetch) to show only images, then only scripts.",
        "Reload with the Network panel open and read the 'DOMContentLoaded' and 'Load' times at the bottom.",
        "Run curl -I https://example.com and identify the Content-Type and Content-Length headers.",
        "Find a request whose Status is 304 and note that its Size shows 'from cache' — you'll learn why in stage 7.",
      ],
      note:
        "If the Network panel is empty, you probably opened it AFTER the page loaded — it only records while open, so " +
        "reload to capture. Tick 'Preserve log' to keep entries across navigations (useful for watching redirects and " +
        "logins), and remember the throttling dropdown can simulate a slow 3G connection to feel what mobile users feel.",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "HTTP & headers",
      tag: "the language of the web",
      time: "half a day",
      payoff:
        "Everything a browser fetches travels over HTTP (HyperText Transfer Protocol): a request goes out, a response comes back, " +
        "each carrying headers that control caching, cookies, content types and security. Learning to " +
        "read those headers turns cryptic behaviour — a page that won't cache, a login that won't stick, " +
        "a request the browser blocks — into something you can diagnose in seconds.",
      concepts: [
        "request & response",
        "methods: GET, POST",
        "status codes recap",
        "Content-Type & Location",
        "Cache-Control & Set-Cookie",
        "the CORS Access-Control-* headers",
      ],
      code:
`# Run in a terminal. -v = VERBOSE: show the full request AND response,
# headers and all, with '>' for what you send and '<' for what comes back.
curl -v https://example.com

# Just the response headers of an API that returns JSON:
curl -I https://api.github.com

# In the browser instead: open Network, click any request, and read its
# 'Headers' tab — same information, request headers and response headers.`,
      lang: "bash",
      walkthrough: [
        "**HTTP is a request/response conversation.** Your browser sends a **request** ('please give me `/index.html`') and the server sends back a **response** (a status code plus headers plus, usually, a body of content). Every image, script and API call on the web is one of these exchanges. It's plain, text-based, and — crucially — completely visible in DevTools.",
        "**Methods say what you want to do.** **`GET`** means 'fetch me this' (the default when you click a link or type a URL — a Uniform Resource Locator, i.e. a web address). **`POST`** means 'here's some data, please process it' (submitting a form, logging in). There are others (`PUT`, `DELETE`, `PATCH`) used by APIs, but GET and POST cover most of what you'll see. The Network panel shows the method in each request's details.",
        "**Status codes are the response's headline** (you met the table in the reference): `200` success, `301`/`302` redirect, `304` 'use your cache', `403` forbidden, `404` not found, `500`/`502`/`503` server-side failures. The first digit tells the story: `2xx` worked, `3xx` go elsewhere, `4xx` *you* messed up, `5xx` the *server* messed up.",
        "**Response headers are metadata about the content.** **`Content-Type`** says what the body is — its **MIME type** (Multipurpose Internet Mail Extensions), such as `text/html`, `application/json` or `image/png` — so the browser knows whether to render it, run it or download it. **`Location`** accompanies a redirect, naming where to go next. Getting `Content-Type` wrong is a classic bug: **JSON** (JavaScript Object Notation, a common text format for data) served as `text/plain` won't be treated as data, and a script served with the wrong type may be refused.",
        "**`Cache-Control`** tells the browser how long it may reuse a response without re-fetching (you'll dig into caching in stage 7), and **`Set-Cookie`** is how a server plants a cookie in your browser — the mechanism behind staying logged in (stage 5). Seeing these headers is how you understand *why* the browser cached something or *what* cookie a site set.",
        "**`curl -v`** ('verbose') shows the whole conversation from the terminal: lines starting **`>`** are what your machine *sent* (the request line and request headers), lines starting **`<`** are what the server *sent back* (the status line and response headers). It's the unfiltered truth of an HTTP exchange, and matches exactly what the Network panel's Headers tab shows — just without a browser in the way.",
        "**The `Access-Control-Allow-Origin` header is CORS (Cross-Origin Resource Sharing) in one line.** When a page tries to fetch data from a *different* website, the browser only allows it if that other server sends back this header granting permission. You'll study the whole same-origin model next stage; for now, just know that this response header — set by the *server*, readable in the Network panel — is what permits or forbids cross-site requests.",
      ],
      exercise:
        "Read a full HTTP exchange two ways. In a terminal, run curl -v https://example.com and find, in the output, " +
        "the request line (starts with >), the response status line (starts with <), and at least three response " +
        "headers including Content-Type. Now do it in the browser: open Network, reload a page, click the first " +
        "request, and open its Headers tab. Match up the same status code and Content-Type. Then find a request that " +
        "sets a cookie (look for a Set-Cookie response header) or one to a different domain that carries an " +
        "Access-Control-Allow-Origin header — you'll revisit both in the next two stages.",
      drills: [
        "Run curl -s -o /dev/null -w \"%{http_code}\\n\" https://example.com to print JUST the status code.",
        "In the Network panel, click a request and switch between its Headers, Preview and Response tabs.",
        "Run curl -I on a URL you know redirects and read the 3xx status plus the Location header.",
        "Find a JSON API response in Network (filter: Fetch/XHR) and confirm its Content-Type is application/json.",
      ],
      note:
        "Headers are case-insensitive and there are hundreds, but you only need a handful daily: Content-Type, " +
        "Cache-Control, Set-Cookie/Cookie, Location, and the Access-Control-* family. When something behaves oddly, " +
        "'what do the headers say?' — in Network or via curl -v — is the fastest question to ask.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "Cookies, storage & sessions",
      tag: "how a site remembers you",
      time: "half a day",
      payoff:
        "HTTP (HyperText Transfer Protocol) itself is forgetful — each request stands alone — so browsers keep small stores of data " +
        "to remember who you are and what you've done. Cookies keep you logged in; localStorage saves " +
        "preferences; IndexedDB holds bigger data. Knowing the differences (and where to clear them) is " +
        "the key to understanding logins, 'why am I still signed in?', and 'have you tried clearing your " +
        "cookies?'.",
      concepts: [
        "cookies vs localStorage vs sessionStorage",
        "IndexedDB for bigger data",
        "the Application/Storage panel",
        "document.cookie",
        "how login sessions work",
        "clearing site data",
      ],
      code:
`// Run in the DevTools Console on a site you're logged into (harmless):
document.cookie              // the cookies THIS page can read, as one string

// Save and read a preference in localStorage (persists across reloads):
localStorage.setItem("theme", "dark")
localStorage.getItem("theme")            // -> "dark"

// sessionStorage is the same, but cleared when you close the tab:
sessionStorage.setItem("scratch", "123")`,
      lang: "text",
      walkthrough: [
        "**HTTP is stateless — each request forgets the last.** Without help, a server couldn't tell that the request loading your inbox came from the same person who just logged in. Browser storage bridges that gap by keeping little bits of data on your machine and handing them back to the site on future visits.",
        "**Cookies** are small labelled pieces of text (typically an ID) that the browser stores and — this is the key part — **automatically attaches to every request** back to that site, via the `Cookie` request header. The server plants them with `Set-Cookie` (stage 4). Because they ride along automatically, cookies are how sites keep you logged in across page loads. They're small (a few KB) and can carry security flags like `HttpOnly` (hidden from JavaScript) and `Secure` (HTTPS only).",
        "**`localStorage`** and **`sessionStorage`** are simpler key/value stores for the *page's own* JavaScript — they are **not** sent with requests. `localStorage` **persists** until cleared (good for preferences like a chosen theme); `sessionStorage` **lasts only until you close the tab**. Use them to remember things on the client that the server doesn't need on every request.",
        "**`IndexedDB`** is the heavyweight: a small database in the browser for **larger, structured data** — think an offline email client caching thousands of messages, or a web app storing documents for offline use. You rarely poke it by hand, but you'll see it listed for data-heavy apps.",
        "**Open the Application panel** (called **Storage** in Firefox). In its left sidebar you'll find **Cookies**, **Local Storage**, **Session Storage** and **IndexedDB**, each listed per-site. Click one to see the actual keys and values in a table — and you can edit or delete individual entries right there, which is great for testing.",
        "**`document.cookie`** in the Console prints the cookies the current page's JavaScript is allowed to read, as one `name=value; name=value` string. Note that `HttpOnly` cookies — deliberately including most session/login cookies — **won't appear here**, because hiding them from JavaScript is a security feature that limits what a hijacked script can steal.",
        "**A login session, end to end:** you submit your password (a `POST`), the server verifies it and replies with **`Set-Cookie: session=<random-id>`**. Your browser stores that cookie and **automatically sends it back** on every subsequent request; the server looks up the ID to know it's still you. **Logging out** (or the cookie expiring) drops the ID, and you're anonymous again. 'Clear cookies to fix the login' works because it throws away a stale or corrupted session ID and forces a clean one.",
      ],
      exercise:
        "Explore what a site remembers about you. Open a site you're logged into, press F12, and open the " +
        "Application (or Storage) panel. Under Cookies, find the entry for that site and look for a cookie that looks " +
        "like a session (a long random value); note its Expires and whether HttpOnly is ticked. In the Console, run " +
        "document.cookie and notice the session cookie is probably MISSING (because it's HttpOnly). Now use " +
        "localStorage: run localStorage.setItem(\"demo\", \"hi\"), reload the page, and run localStorage.getItem(\"demo\") " +
        "to confirm it survived. Finally, in the Application panel, find 'Clear site data' (or right-click the site " +
        "under Storage) and understand — but only do it if you're happy to be logged out — that this wipes cookies " +
        "and storage, ending your session.",
      drills: [
        "In the Application panel, expand Local Storage for the current site and read any keys the site stored.",
        "Run sessionStorage.setItem(\"x\",\"1\"), then close and reopen the tab and check it's gone (localStorage would survive).",
        "Find a cookie with the Secure and HttpOnly flags ticked and describe in a sentence what each protects against.",
        "In the Application panel, use 'Clear site data' on a throwaway site and watch its cookies and storage empty out.",
      ],
      note:
        "'Have you cleared your cookies?' is common advice because a stale session or corrupted stored value causes a " +
        "surprising share of 'I'm logged in but it's acting broken' problems. Clearing site data for ONE site (in the " +
        "Application panel, or the site-info 'lock' menu) is far less disruptive than wiping every site at once from " +
        "the browser's global settings.",
    },

    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Origins, CORS & the security model",
      tag: "why the browser blocks things",
      time: "1 day",
      payoff:
        "The web's core safety rule is the same-origin policy: by default a page can't read data from a " +
        "different website, which is what stops a malicious tab from reading your bank in another tab. " +
        "CORS (Cross-Origin Resource Sharing) is the controlled exception. Understanding origins turns the web's most-Googled error — " +
        "'blocked by CORS policy' — from a wall into a signpost that points at the real fix.",
      concepts: [
        "what an 'origin' is (scheme+host+port)",
        "the same-origin policy",
        "why CORS exists",
        "reading a CORS error",
        "mixed content",
        "HTTPS/TLS & the Security panel",
      ],
      code:
`// Run in the Console. This prints THIS page's origin —
// the scheme + host + port that define its identity:
window.location.origin       // e.g. "https://example.com"

// Try to fetch from a DIFFERENT site without permission and watch
// the browser BLOCK it with a CORS error in the Console:
fetch("https://api.github.com/repos/nodejs/node")
  .then(r => r.json())
  .then(data => console.log(data.full_name))
  .catch(err => console.log("blocked or failed:", err))`,
      lang: "text",
      walkthrough: [
        "**An 'origin' is a website's identity: scheme + host + port.** `https://example.com` is one origin; `http://example.com` (different scheme), `https://api.example.com` (different host) and `https://example.com:8080` (different port) are all **different** origins. Two URLs are 'same-origin' only if all three match. This precise definition is the hinge everything else turns on.",
        "**The same-origin policy** is the browser's foundational security rule: JavaScript running on one origin **cannot read the responses** it gets from a *different* origin unless that other origin explicitly allows it. Without this, a random ad or malicious page could quietly read your logged-in email or bank in another tab. It's the wall that makes the multi-site web safe.",
        "**CORS is the doorway in that wall.** Legitimate cross-site requests are everywhere (a site calling a public API — Application Programming Interface, a service one program offers another — or a front-end talking to its own API on another subdomain), so CORS lets a server *opt in* by sending the **`Access-Control-Allow-Origin`** response header naming who may read its data. If the header is present and matches, the browser allows the read; if it's missing, the browser blocks it — even though the request itself succeeded on the network.",
        "**Reading a CORS error.** When blocked, the Console shows something like *'Access to fetch at X from origin Y has been blocked by CORS policy: No Access-Control-Allow-Origin header is present.'* The critical insight: **this is the browser protecting you, and the fix is on the SERVER, not in your page.** The other site's owner must send the right `Access-Control-Allow-Origin` header. You can't fix a real CORS error purely from the front end — and that's by design, so no page can grant itself access it wasn't given.",
        "**Watch it happen.** The `fetch(...)` snippet asks a cross-origin API for data. If GitHub's API sends the permissive CORS header, you'll see the repo name logged; if a server doesn't, the `.catch` fires and you'll see the CORS complaint in the Console. Either way, the Network panel will show the request as sent — CORS blocks your *reading of the response*, not the request itself, which trips up a lot of people.",
        "**Mixed content** is a related block: a page loaded over secure **HTTPS** (HyperText Transfer Protocol Secure) that tries to pull a script or image over plain, insecure **HTTP** (HyperText Transfer Protocol). The browser blocks (or upgrades) it, because one insecure resource can compromise the whole secure page. If images vanish or features break only on the HTTPS version of a site, check the Console for 'Mixed Content' warnings.",
        "**HTTPS/TLS and the Security panel.** The lock icon means the connection is encrypted with **TLS** (Transport Layer Security) and the server proved its identity with a digital **certificate** — nobody in between can read or tamper with the traffic. Open the **Security panel** to see the certificate details, who issued it, and whether any part of the page was served insecurely. A missing lock, or a warning here, is your cue that the connection isn't fully trustworthy.",
      ],
      exercise:
        "See the same-origin policy enforce itself. On any HTTPS site, open the Console and run " +
        "window.location.origin to read the current origin. Now run the cross-origin fetch snippet against an API " +
        "that does NOT allow your origin (try fetching a random non-API website's URL) and read the CORS error the " +
        "browser prints — identify the phrase 'Access-Control-Allow-Origin'. Confirm in the Network panel that the " +
        "request was actually SENT (it has a status), proving the browser blocked your reading of the response, not " +
        "the request. Finally, open the Security panel and inspect the current site's certificate: who issued it, and " +
        "is the whole page served over HTTPS?",
      drills: [
        "Run window.location.protocol, window.location.host and window.location.port to see the three parts of an origin.",
        "In the Security panel, click 'View certificate' and read the issuer and expiry date.",
        "Compare http://example.com and https://example.com in the address bar and note that they are different origins.",
        "Trigger a CORS error, then in Network click the blocked request and confirm it still shows a status code.",
      ],
      note:
        "The biggest CORS misconception is that it's an error IN your code that you can fix in your code. It isn't — " +
        "it's the server declining to share, and the fix is the server sending Access-Control-Allow-Origin (or you " +
        "routing the call through your own backend). During development a proxy or the server's dev settings handle " +
        "this; disabling browser security to 'make CORS go away' is never the real answer.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "Caching & the hard refresh",
      tag: "why it works after Ctrl+Shift+R",
      time: "half a day",
      payoff:
        "Browsers aggressively save copies of files so pages load fast and use less data — but that same " +
        "cache is why you sometimes see an old version after a site updates, and why 'try a hard refresh' " +
        "so often works. Understanding the cache turns that folk remedy into something you actually " +
        "understand and can apply deliberately.",
      concepts: [
        "the browser cache (disk vs memory)",
        "Cache-Control & ETag",
        "304 Not Modified",
        "service workers & PWAs (briefly)",
        "'Disable cache' in DevTools",
        "hard reload vs empty-cache-and-hard-reload",
      ],
      code:
`# Run in a terminal. Fetch the caching headers of a static file
# (images, CSS and JS usually carry these):
curl -I https://www.google.com/favicon.ico

# Look in the output for:
#   Cache-Control:  how long the browser may reuse this without asking
#   ETag:           a fingerprint used to check 'has this changed?'
#   Last-Modified:  when the file last changed
# In the browser: open Network, reload, and read the Status column —
# 200 = freshly downloaded, 304 = 'your cached copy is still good'.`,
      lang: "bash",
      walkthrough: [
        "**The cache is a local copy store.** The first time you load a site, the browser downloads its files and *keeps copies*. On your next visit it can serve those copies instantly from your own disk or memory — no network trip — which is why a return visit feels so much faster and uses far less data. The cost is that a copy can go stale when the site changes.",
        "**Memory vs disk cache.** Very recently used resources sit in fast **memory cache** (gone when you close the tab); everything else lives in **disk cache** (survives restarts, larger, slightly slower). In the Network panel's Size column you'll literally see '(memory cache)' or '(disk cache)' for served-from-cache resources.",
        "**`Cache-Control` is the server's instruction** for how long a file may be reused. `Cache-Control: max-age=3600` means 'reuse this for an hour without even asking me'; `no-cache` means 'you may keep it, but check with me before each use'; `no-store` means 'don't keep it at all'. This one header, set by the server, governs most caching behaviour you'll see.",
        "**`ETag` (and `Last-Modified`) enable cheap freshness checks.** An **ETag** (entity tag) is a fingerprint of a file's contents. When a cached copy needs validating, the browser asks 'still this ETag?'; if the file is unchanged the server replies **`304 Not Modified`** with **no body**, and the browser reuses its copy. So a `304` in the Network panel means 'checked, still good, nothing re-downloaded' — fast and lightweight, which is exactly what you want.",
        "**Service workers take caching further** and power **PWAs** (Progressive Web Apps). A service worker is a script the browser keeps running in the background that can intercept requests and serve responses from its own cache — enabling **offline** use and app-like behaviour. It's also a frequent culprit when a site stubbornly serves an old version even after a normal reload; you can inspect and unregister service workers in the **Application** panel.",
        "**DevTools 'Disable cache'.** In the Network panel there's a **'Disable cache'** checkbox that forces every resource to be re-downloaded **while DevTools is open**. Turn it on during development so you always see your latest changes and never chase a ghost that was just a cached file.",
        "**Hard reload vs empty-cache-and-hard-reload.** A normal reload (`Ctrl+R`) may still use cached files. A **hard reload** (`Ctrl+Shift+R`) bypasses the cache for *this page's* resources and re-fetches them — the everyday fix for 'I updated the site but still see the old version'. The stronger **'Empty Cache and Hard Reload'** (right-click the reload button while DevTools is open) *also* wipes the stored cache first, and is what to reach for when a service worker or stubborn cached asset survives an ordinary hard reload.",
      ],
      exercise:
        "Make the cache visible and then defeat it. Open the Network panel and reload a site twice: the first load " +
        "shows resources at 200 with real sizes; on the second, look for entries served '(from disk cache)' or " +
        "'(memory cache)', and any 304 statuses. Now tick 'Disable cache' in the Network panel and reload again — " +
        "notice everything is re-downloaded at full size. Untick it. In a terminal, run curl -I on a static file (a " +
        "site's favicon or CSS) and find its Cache-Control and ETag headers. Finally, right-click the reload button " +
        "(with DevTools open) and try 'Empty Cache and Hard Reload' — the most thorough refresh the browser offers.",
      drills: [
        "In Network, sort by Size and spot which resources say '(memory cache)' vs '(disk cache)'.",
        "Reload a page and count how many requests returned 304 Not Modified versus a full 200.",
        "In the Application panel, open Service Workers and see whether the current site has one registered.",
        "Run curl -I twice on the same URL and compare the ETag values — identical means the file hasn't changed.",
      ],
      note:
        "When someone says 'it works on my machine' but a colleague sees an old version, caching is the usual suspect: " +
        "your hard refresh loaded the update, theirs didn't. For a truly stubborn old version, suspect a service " +
        "worker (Application → Service Workers → Unregister) or a caching layer (a Content Delivery Network, or CDN) in front of the server, which no " +
        "amount of browser refreshing will clear.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "Permissions",
      tag: "camera, location, notifications",
      time: "half a day",
      payoff:
        "Powerful browser features — your location, camera, microphone, notifications, clipboard — are " +
        "gated behind explicit permission prompts, and you're in control of every one. Understanding the " +
        "grant/deny/prompt lifecycle, and knowing exactly where to reset a permission, means you can both " +
        "protect your privacy and fix the common 'the site can't see my camera' problem in seconds.",
      concepts: [
        "the permission model",
        "geolocation, camera/mic, notifications, clipboard",
        "the prompt lifecycle: prompt / granted / denied",
        "navigator.permissions.query(...)",
        "managing & resetting permissions",
        "why HTTPS is required",
      ],
      code:
`// Run in the DevTools Console on any HTTPS site.
// Ask the CURRENT permission state WITHOUT triggering a prompt:
navigator.permissions.query({ name: "geolocation" })
  .then(result => console.log("geolocation is:", result.state))
// logs one of: "granted", "denied", or "prompt" (not yet decided)

// Check a couple more the same way:
navigator.permissions.query({ name: "notifications" })
  .then(r => console.log("notifications:", r.state))`,
      lang: "text",
      walkthrough: [
        "**Powerful features are permission-gated by default.** A website can't silently switch on your **camera**, read your **location**, send you **notifications**, or read your **clipboard**. The first time a page tries, the browser interrupts with a **prompt** asking you to Allow or Block. You, the user, are always the one who decides — the site can only *ask*.",
        "**The lifecycle has three states.** A permission starts as **`prompt`** (undecided — the browser will ask). Once you choose, it becomes **`granted`** (the site may use the feature freely from now on) or **`denied`** (the site is blocked, usually without asking again). The browser remembers your choice per-site, which is why you're only asked once.",
        "**Common permissions and why they matter.** **Geolocation** reveals where you physically are. **Camera/microphone** can see and hear you. **Notifications** let a site pop system alerts even when its tab is closed (a frequent source of spam — deny liberally). **Clipboard** can read or write what you copy. Because each is genuinely sensitive, each has its own prompt and its own on/off switch.",
        "**`navigator.permissions.query({name: \"geolocation\"})`** lets you *inspect* the current state from JavaScript **without** triggering a prompt. It returns a promise resolving to an object whose **`.state`** is `\"granted\"`, `\"denied\"` or `\"prompt\"`. This is exactly how a well-built site checks 'do I already have permission?' before deciding whether to ask — and a safe way for you to see what you've granted.",
        "**Where users manage permissions.** Click the **icon on the left of the address bar** (a tune/sliders or lock icon) to see and change what the *current* site is allowed, and reset any of them with one click. For the full list across all sites, go to **`chrome://settings/content`** (Chrome/Edge) or *Settings → Privacy & Security → Permissions* (Firefox). **Resetting** a permission returns it to `prompt`, so the site will ask again next time — the fix when you accidentally clicked Block.",
        "**The #1 real problem: accidentally denied.** If a video call says 'camera not found' or a map can't locate you, you very likely clicked **Block** once and the browser is silently honouring it. The fix is not to reinstall anything — it's to open the site-info menu (address-bar icon), find the camera or location permission set to Block, **reset it**, and reload. This one troubleshooting move solves a huge share of 'the site can't access my hardware' complaints.",
        "**Powerful features require HTTPS.** The browser only offers geolocation, camera, mic and the like to pages served over **secure HTTPS** (HyperText Transfer Protocol Secure, with `localhost` exempted for development). On plain `http://` these APIs (Application Programming Interfaces) simply aren't available, because handing a webcam or your location to a connection that could be tampered with in transit would be reckless. If a feature is mysteriously missing, check you're on `https://`.",
      ],
      exercise:
        "Audit and reset a permission. On an HTTPS site, open the Console and run the navigator.permissions.query " +
        "snippet for 'geolocation' and 'notifications' — note whether each is prompt, granted or denied. Now click " +
        "the icon at the left of the address bar to open the site-info panel and find the same permissions listed " +
        "with their current setting; change one (say, set Notifications to Block) and re-run the query to watch " +
        "'.state' become 'denied'. Then RESET that permission back to 'Ask' (prompt) and confirm the state returns to " +
        "'prompt'. Finally, visit chrome://settings/content (or Firefox's permissions settings) and browse the full " +
        "list of what you've granted across all sites.",
      drills: [
        "Run navigator.permissions.query({name:\"camera\"}).then(r=>console.log(r.state)) and read your camera state.",
        "Click the address-bar site-info icon and list every permission the current site is currently allowed.",
        "Visit chrome://settings/content/notifications and see which sites you've allowed to notify you.",
        "Load a feature page over http:// vs https:// (or localhost) and note the feature only offers on the secure one.",
      ],
      note:
        "Denied is 'sticky' on purpose: to stop sites nagging you, a Block usually means the browser won't prompt " +
        "again, so the feature just silently doesn't work until YOU reset it in site settings. That's why 'it worked " +
        "yesterday, now my camera won't turn on' is so often a stray click on Block rather than a hardware fault — " +
        "always check the address-bar permission menu first.",
    },

    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "Privacy, tracking & extensions",
      tag: "who's watching, and blocking them",
      time: "half a day",
      payoff:
        "The web funds itself partly by tracking you across sites, and your browser is both the tool that " +
        "enables it and your best defence against it. Understanding third-party cookies, fingerprinting, " +
        "extensions and what incognito really does lets you make informed choices instead of relying on " +
        "myths — and troubleshoot the surprising number of problems that extensions cause.",
      concepts: [
        "third-party cookies & their phase-out",
        "fingerprinting (briefly)",
        "trackers & cross-site tracking",
        "extensions: power & risk",
        "private / incognito mode: what it does and doesn't",
        "ad/tracker blocking & clearing data",
      ],
      code:
`// Run in the Console. See how your browser identifies itself and what
// signals contribute to a 'fingerprint' — the point is how MUCH is exposed:
console.log("UA:", navigator.userAgent)
console.log("Languages:", navigator.languages)
console.log("Screen:", screen.width + "x" + screen.height)
console.log("Cores:", navigator.hardwareConcurrency)
console.log("Timezone:", Intl.DateTimeFormat().resolvedOptions().timeZone)`,
      lang: "text",
      walkthrough: [
        "**First-party vs third-party cookies.** A **first-party** cookie belongs to the site in your address bar (fine — it keeps you logged in). A **third-party** cookie is set by a *different* domain embedded in the page (an ad network, a 'like' button), and because that same domain appears on thousands of sites, it can recognise you across all of them — the classic cross-site tracking mechanism. Browsers are **phasing third-party cookies out**: Firefox and Safari block them by default already, and Chrome has been restricting them.",
        "**Fingerprinting is tracking without cookies.** Even with cookies blocked, a site can combine many small, individually-harmless signals — your user-agent, screen size, language, timezone, installed fonts, graphics quirks — into a **fingerprint** that's often unique enough to re-identify you. The Console snippet shows just a handful of those signals; the unsettling part is how much a page can read without asking. It's harder to defend against than cookies, which is why privacy browsers work to make everyone *look the same*.",
        "**Trackers** are the third-party scripts and pixels that do this watching — analytics, ad networks, social widgets. In the **Network panel** you can literally see requests going out to tracker domains as you browse. Privacy-focused browsers and blockers maintain lists of these domains and stop the requests before they leave.",
        "**Extensions are powerful — and that's the risk.** A browser extension can be brilliant (a password manager, a blocker), but many request permission to **'read and change all your data on all websites'**, which is exactly the access a malicious or hijacked extension needs to steal passwords or inject ads. Install few, from reputable sources, and periodically review each one's permissions in the browser's extensions page. A sold or compromised extension is a real and common attack.",
        "**What incognito / private mode actually does:** it gives you a **fresh session with no existing cookies or history**, and it **forgets everything when you close the window** — new cookies, history and form data are discarded locally. That's genuinely useful for signing into a second account or leaving no local trace on a shared computer.",
        "**What incognito does NOT do:** it does **not** hide you from the websites you visit, your employer or school network, or your internet provider. You are not anonymous — the sites still see your IP and can fingerprint you; incognito only controls what's stored *on your own device*. This is the web's most widespread misconception, and worth stating plainly.",
        "**Blocking and clearing.** A **content blocker** (uBlock Origin, or Brave's and Firefox's built-in protections) stops tracker and ad requests, which also speeds pages up and cuts data use. And when you want a clean slate, **clearing browsing data** (history, cookies, cache — Ctrl+Shift+Del) removes what's stored locally. Prefer clearing *one site's* data (stage 5) when you only need to fix one site, and a full clear when you want to genuinely reset.",
      ],
      exercise:
        "See what the web sees. In the Console, run the fingerprint snippet and read how many identifying signals your " +
        "browser exposes without any permission prompt — user-agent, screen size, languages, timezone, core count. " +
        "Now open the Network panel on a mainstream news or shopping site and scan the request list for domains that " +
        "aren't the site you're on (ad and analytics trackers) — count a few. Open your browser's extensions page and " +
        "review each installed extension's permissions, flagging any that can 'read and change all your data on all " +
        "sites'. Finally, open an incognito/private window, confirm you're logged out everywhere, and write one " +
        "sentence on what incognito protects and what it does not.",
      drills: [
        "Run the fingerprint snippet in a normal window and again in incognito — note which values stay the same (most do).",
        "In Network on a busy site, filter and count requests going to domains other than the one in the address bar.",
        "Open your extensions page (chrome://extensions or about:addons) and read the permissions of one extension.",
        "Open Ctrl+Shift+Del and read the options — but only clear data if you're prepared to be logged out.",
      ],
      note:
        "Incognito's forgetfulness is local only: your IP, your login if you sign in, and fingerprinting all still " +
        "identify you to sites and networks. For real anonymity you need much more (a trustworthy VPN or Tor, plus " +
        "anti-fingerprinting) — treat incognito as 'a clean local session', not 'invisible'. And after browser " +
        "weirdness that survives clearing cache, disabling extensions one by one is the fastest way to find a culprit.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Troubleshooting: the page is broken",
      tag: "a repeatable method",
      time: "half a day",
      payoff:
        "'The website isn't working' is the most common tech complaint there is, and you now have every " +
        "tool to diagnose it methodically instead of guessing. A fixed checklist — reload, Console, " +
        "Network, extensions, cache, another browser — will pinpoint the cause of the large majority of " +
        "broken pages in a couple of minutes.",
      concepts: [
        "the troubleshooting order",
        "reading a Console error & stack trace",
        "spotting failed/red requests in Network",
        "404 vs CORS vs mixed content",
        "the incognito (extension) test",
        "clear cache/cookies; try another browser",
      ],
      code:
`// Run in the Console to understand what a JavaScript error looks like.
// This deliberately throws, so you can read the error + stack trace:
function inner() { throw new Error("something went wrong"); }
function outer() { inner(); }
outer()

// You'll see the message in red, and a 'stack' showing outer -> inner:
// the call chain that led to the failure. Click the file:line link to
// jump to the exact spot in the Sources panel.`,
      lang: "text",
      walkthrough: [
        "**Have a fixed order, and follow it.** Panic-clicking wastes time; a checklist finds the fault fast. The order: **(1) hard reload → (2) check the Console → (3) check the Network panel → (4) rule out an extension → (5) clear cache/cookies → (6) try another browser.** Each step either fixes it or narrows down where the problem lives. Work top to bottom and stop when it's solved.",
        "**Step 1 — hard reload.** `Ctrl+Shift+R` re-fetches the page bypassing the cache. A shocking number of 'broken' pages are just a stale cached file (stage 7), and this clears them instantly — so it's always the cheap first move.",
        "**Step 2 — read the Console.** Open DevTools → Console. **Red messages are errors** that likely stopped the page's JavaScript. Read the top line (the *message*, e.g. `TypeError: x is not a function`) and the **stack trace** beneath it — the list of function calls that led to the failure, newest first — and click the `file:line` link to jump to the exact code in Sources. Even if you can't fix the code, the message often *names* the problem ('Failed to load resource', 'is not defined', a CORS — Cross-Origin Resource Sharing — complaint) and points you to the right next step.",
        "**Step 3 — check the Network panel.** Reload with Network open and scan for **red rows and 4xx/5xx statuses**. A **`404`** means a needed file (a script, a stylesheet, an image) is missing — the page is trying to load something that isn't there. A **CORS** message means a cross-origin request was blocked (stage 6). A **'Mixed Content'** warning means an insecure resource on a secure page (stage 6). The failing request usually *is* the reason the page looks broken.",
        "**Distinguish the three classic failures.** A **404** is a *missing file* (the URL is wrong or the file wasn't deployed). A **CORS** error is a *permission* problem on the server's side. **Mixed content** is an `http://` resource on an `https://` page. They look similar ('something didn't load') but each points at a different fix, and the Console/Network wording tells you which one you have.",
        "**Step 4 — the incognito test rules out extensions.** Open the page in an **incognito/private window**, where extensions are disabled by default. If it works there but not in your normal window, an **extension is the culprit** (an aggressive blocker or a broken add-on) — go disable them one at a time to find which. This single test resolves a huge class of 'works for everyone but me' mysteries.",
        "**Steps 5 & 6 — clear data, then change browser.** If it's still broken, **clear that site's cookies and cache** (stage 5's per-site clear, in case a corrupted session or cached file is at fault). Still broken? **Try another browser entirely.** If it works in Firefox but not Chrome, the problem is specific to your Chrome profile or a Chrome/Blink quirk; if it fails *everywhere*, the problem is the website or your network, not your browser — which is genuinely useful to know, because it tells you whether to keep debugging locally or report it to the site.",
      ],
      exercise:
        "Practise the method on a real page and on a deliberate error. First, run the throwing snippet in the Console " +
        "and read the error: identify the message, follow the stack trace from outer to inner, and click the file:line " +
        "link to land in the Sources panel. Now pick any page and walk the full checklist even though it works: hard " +
        "reload it, open the Console and confirm no red errors, open Network and reload while scanning for any 4xx/5xx " +
        "or red rows, then open the same page in an incognito window (extensions off) and confirm it still works. " +
        "Write down, as a five-line checklist, the order you'd follow next time a page is genuinely broken.",
      drills: [
        "In the Console, run undefinedThing.foo and read the exact TypeError message the browser produces.",
        "In Network, use the filter to show only failed requests (there's a 'Status' filter / red-only toggle) on a busy page.",
        "Open a page in incognito and confirm your extensions' icons are absent from the toolbar.",
        "Clear one site's data via the Application panel, reload, and note whether it changed anything.",
      ],
      note:
        "The most valuable outcome of the checklist is often knowing WHERE the fault is, not fixing it yourself: " +
        "Console error = the site's JavaScript; 404 in Network = a missing file on the server; works in incognito = " +
        "your extension; fails in every browser = the website or your connection. That triage alone tells you whether " +
        "to keep poking or to report it and move on.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "Troubleshooting: it won't connect",
      tag: "DNS, certificate & connection errors",
      time: "half a day",
      payoff:
        "Sometimes the page never even loads — you get a stark error screen instead. Those ERR_ and " +
        "certificate messages look alarming but each one names a specific, fixable cause: a DNS " +
        "(Domain Name System) lookup that failed, a refused connection, a clock that's wrong, an expired certificate. Learning to " +
        "decode them tells you instantly whether to blame the site, your network, or your own machine.",
      concepts: [
        "ERR_NAME_NOT_RESOLVED (DNS)",
        "ERR_CONNECTION_REFUSED / TIMED_OUT",
        "ERR_CERT_* & the clock",
        "SSL / HSTS warnings",
        "chrome://net-internals; flush DNS/sockets",
        "diagnosing with curl -v / dig",
      ],
      code:
`# Run in a terminal to reproduce a connection problem OUTSIDE the browser,
# which tells you if it's the site/network or just your browser profile.

# 1) Does the NAME resolve to an IP? (DNS)  -> ERR_NAME_NOT_RESOLVED if not
dig +short example.com          # prints the IP(s), or nothing if DNS fails

# 2) Can we actually connect and complete TLS? (-v shows every step)
curl -v https://example.com     # watch for 'Could not resolve host',
                                # 'Connection refused', or certificate errors

# 3) Check your system clock — a wrong clock breaks HTTPS certificates:
date`,
      lang: "bash",
      walkthrough: [
        "**Connection errors are different from broken pages** (stage 10): here the page *never loads* and you get a full-screen error, usually an **`ERR_...`** code (Chrome/Edge) or a named page (Firefox). The good news is these codes are specific — each points at one layer that failed — so decoding the code is most of the diagnosis.",
        "**`ERR_NAME_NOT_RESOLVED` = DNS failed.** The browser couldn't translate the site's *name* into an IP address (stage 0's first step). Causes: a typo in the address, your DNS server being down, or no internet at all. Test it directly with **`dig +short example.com`** — if that prints an IP, DNS works and the problem is elsewhere; if it prints nothing, you've confirmed a DNS failure. (This is exactly the 'name fails but IP works' distinction from the Networking course.)",
        "**`ERR_CONNECTION_REFUSED` / `ERR_CONNECTION_TIMED_OUT` = the name resolved but the connection didn't.** **Refused** means something actively said 'no' — often the server isn't running on that port, or a firewall blocked it. **Timed out** means no answer at all — the server is down, unreachable, or a firewall is silently dropping packets. `curl -v` will show which: watch for 'Connection refused' versus a long hang.",
        "**`ERR_CERT_*` and 'Your connection is not private' = a TLS (Transport Layer Security) certificate problem.** Common flavours: **`ERR_CERT_DATE_INVALID`** (the certificate is expired — or, very often, **your computer's clock is wrong**, so a valid cert looks expired), **`ERR_CERT_AUTHORITY_INVALID`** (self-signed or an untrusted issuer, typical on internal/dev servers), and **`ERR_CERT_COMMON_NAME_INVALID`** (the certificate is for a different hostname than the one you visited). Because a wrong clock is such a frequent and sneaky cause, **checking `date` is a real first move** for any cert error.",
        "**SSL/HSTS.** **SSL** (Secure Sockets Layer) is the older name for TLS — the two terms are used interchangeably for the padlock's encryption. **HSTS** (HTTP Strict Transport Security) is a rule a site can set that tells your browser 'only ever connect to me over **HTTPS**' (HyperText Transfer Protocol Secure). Once set, the browser will **refuse** to let you click through a certificate warning for that site — protecting you, but meaning a genuinely broken cert (or a corporate proxy) blocks you entirely until the *server* is fixed. It's why some cert warnings offer a 'proceed anyway' and others don't.",
        "**`chrome://net-internals` and flushing.** Chrome caches DNS results and keeps connection sockets open, and occasionally a stale entry causes errors after a network change. **`chrome://net-internals/#dns`** lets you **clear the host cache** and **`#sockets`** lets you **flush socket pools** — the browser-level equivalent of the OS command to flush DNS. Do this when a site started failing right after you switched networks or changed DNS and it works elsewhere.",
        "**Reproduce outside the browser to place the blame.** The power move for connection errors is `curl -v` and `dig` from a terminal. If `curl` fails the same way, the problem is the **site or your network**, not your browser — no amount of clearing cache or trying another browser will help, and you should check your connection or report the outage. If `curl` *succeeds* but the browser fails, the problem is **local to your browser** (a stale cache, an extension, HSTS, a proxy setting) and the browser-side fixes apply.",
      ],
      exercise:
        "Decode connection failures with terminal tools. In a terminal, run dig +short example.com and confirm you " +
        "get an IP (that's DNS working); then run dig +short a-name-that-does-not-exist-xyz.invalid and see it return " +
        "nothing — the machine-level version of ERR_NAME_NOT_RESOLVED. Run curl -v https://example.com and trace the " +
        "steps: name resolution, TCP connection, TLS handshake, then the response. Check your system clock with date " +
        "and confirm it's correct (a wrong clock is a top cause of certificate errors). Finally, open " +
        "chrome://net-internals/#dns, clear the host cache, and note this is what to try when a site fails only in " +
        "your browser after a network change.",
      drills: [
        "Run dig example.com (no +short) and read the full answer section — the name-to-IP mapping in detail.",
        "Run curl -v https://expired.badssl.com (a test site) and read the certificate error curl reports.",
        "Visit chrome://net-internals/#sockets and use 'Flush socket pools', then reload a stubborn site.",
        "Run date and, if it's wrong, understand that fixing your clock alone can clear an ERR_CERT_DATE_INVALID.",
      ],
      note:
        "The single most useful split: if curl -v and dig fail the same way the browser does, it's the site or your " +
        "NETWORK — stop clearing browser data and check your connection or the site's status. If they succeed but the " +
        "browser fails, it's LOCAL to the browser (cache, HSTS, extension, proxy). For the network layer itself — " +
        "gateways, packet loss, ping and traceroute — that's the Networking course's territory.",
    },

    /* -------------------------------------------------------------- 12 */
    {
      n: 12,
      title: "Capstone: performance & the toolbox",
      tag: "put it all together",
      time: "1 day",
      payoff:
        "You now understand what a browser is, the technologies it runs, how permissions and privacy " +
        "work, and how to troubleshoot. This capstone ties it together: profile a slow page, audit its " +
        "requests, deliberately cause and then fix a permission and a CORS (Cross-Origin Resource Sharing)/cache issue, and take a full " +
        "tour of the DevTools toolbox — the exact workflow you'd use to understand or fix any real site.",
      concepts: [
        "Performance panel & Lighthouse basics",
        "auditing requests in Network",
        "reproducing & fixing a permission block",
        "reproducing a CORS / cache issue",
        "the full DevTools toolbox tour",
        "what 'good' looks like",
      ],
      code:
`// A whole-course workout, run in the DevTools Console + panels.

// 1) Measure how long the page took to load (in milliseconds):
performance.now()

// 2) Audit the page's requests programmatically:
performance.getEntriesByType("resource").length   // how many resources?

// 3) Reproduce a permission state (from stage 8):
navigator.permissions.query({ name: "geolocation" })
  .then(r => console.log("geo permission:", r.state))

// Then: open the Performance panel, click Record, reload, Stop —
// and read the flame chart of where the time actually went.`,
      lang: "text",
      walkthrough: [
        "**Profile a slow page with the Performance panel.** Open **Performance**, click **Record**, reload the page, then **Stop**. You get a timeline (a 'flame chart') showing where the time went: scripting, rendering, painting, and long tasks that blocked the main thread (stage 2's event loop made visible). The tall, wide blocks are your bottlenecks — usually heavy JavaScript or too many/too-large resources.",
        "**Run a Lighthouse audit for a scorecard.** The **Lighthouse** panel (in Chrome/Edge DevTools) runs an automated audit and grades **Performance, Accessibility, Best Practices and SEO** out of 100, with a prioritised list of concrete fixes ('eliminate render-blocking resources', 'properly size images'). It's the fastest way to get an expert-style review of any page and to learn *what 'good' looks like* — aim for green scores and read the suggestions.",
        "**Audit the requests (Network).** Reload with the Network panel open and read the totals at the bottom: **number of requests** and **total transferred size**. Sort by Size to find bloated resources, by Time to find slow ones, and check how many were served **from cache** (stage 7) versus re-downloaded. Fewer, smaller, well-cached requests is the recipe for a fast page.",
        "**Reproduce and fix a permission block (stage 8).** Deliberately break something: open the site-info menu and set **Notifications** or **Location** to **Block**, then run `navigator.permissions.query(...)` and watch `.state` read `denied`. Now fix it the way a user would: reset the permission back to **Ask**, reload, and confirm the state returns to `prompt`. You've just performed the exact repair for the most common 'the site can't use my camera/location' complaint.",
        "**Reproduce a CORS or cache issue (stages 6 & 7).** For CORS: run a cross-origin `fetch(...)` to a server that doesn't allow your origin and read the blocked-by-CORS error, reaffirming the fix is server-side. For cache: load a page, tick **'Disable cache'** in Network and reload, and watch every resource re-download at full size — then untick it and watch the `304`s and 'from cache' return. Seeing both on demand cements *why* those behaviours happen.",
        "**A full toolbox tour.** You've now used every core panel: **Elements** (the live DOM — Document Object Model — and CSS, Cascading Style Sheets), **Console** (a REPL, the interactive prompt, and errors), **Network** (requests, headers, timing), **Application** (cookies, storage, service workers), **Sources** (view code & set breakpoints to pause JS mid-run), **Performance** (profiling), **Security** (certificates & HTTPS), and **Lighthouse** (audits). Knowing which panel answers which question — 'why does it look wrong?' → Elements; 'why is it broken?' → Console/Network; 'why is it slow?' → Performance/Lighthouse; 'what did it store?' → Application — is the real skill.",
        "**What 'good' looks like.** A healthy page loads over **HTTPS** (HyperText Transfer Protocol Secure) with a valid certificate and no mixed content; has a **clean Console** (no red errors); makes **few, well-cached** requests with sensible `Cache-Control`; asks for **only the permissions it needs, at the moment it needs them**; and scores well in **Lighthouse**. When you can look at any site through DevTools and judge it against that checklist — and fix where it falls short — you've genuinely learned how the web runs.",
      ],
      exercise:
        "Run the full toolbox on a real site, end to end. (1) Open the Performance panel, record a reload, and " +
        "identify the single longest task in the flame chart. (2) Run a Lighthouse audit and note the Performance " +
        "score and its top suggestion. (3) In Network, record the total request count and transferred size, and how " +
        "many came from cache. (4) Break and fix a permission: set Notifications to Block via the site-info menu, " +
        "confirm 'denied' with navigator.permissions.query, then reset it to Ask and confirm 'prompt'. (5) Toggle " +
        "'Disable cache' and reload to watch resources re-download, then untick it. Finish by writing a short verdict: " +
        "against the 'what good looks like' checklist, what does this site do well, and what would you improve?",
      drills: [
        "Run performance.getEntriesByType(\"resource\").length and compare it to the request count Network shows.",
        "In Lighthouse, run an audit in mobile mode and compare the Performance score to desktop.",
        "In Sources, open a JavaScript file, click a line number to set a breakpoint, and reload to see execution pause.",
        "Open the Security panel and confirm the page is HTTPS with a valid certificate and no mixed-content warnings.",
      ],
      note:
        "DevTools is deep — there are panels and features far beyond this course — but the workflow you've built is " +
        "the durable part: inspect the DOM, read the Console, watch the Network, check storage and permissions, " +
        "profile when slow, and reproduce-then-fix. Every browser update adds tools, but 'what question am I asking, " +
        "and which panel answers it?' is the habit that makes you effective in any of them.",
    },
  ],
};
