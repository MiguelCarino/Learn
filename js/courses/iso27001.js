/* =====================================================================
   Carino Learn — course: ISO 27001 / COMPLIANCE
   The full ISO/IEC 27001:2022 template library (ported from the
   ISO-27001 repo) restructured as a hands-on module: 12 stages walk the
   ISMS lifecycle — scope → leadership → risk → Annex A controls →
   operation → audit & improvement. Every stage carries the real,
   ready-to-fill document templates for that step.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["iso27001"] = {
  id: "iso27001",
  title: "ISO 27001",
  tag: "compliance · ISMS",
  icon: "shield",
  blurb: "Build a real ISO/IEC 27001:2022 ISMS — with every document template you need.",
  intro:
    "ISO/IEC 27001 is the international standard for an Information Security Management " +
    "System (ISMS): a management loop that finds your risks, picks controls to treat them, " +
    "and proves — with documents and records — that the loop actually runs. This module walks " +
    "the whole lifecycle in 12 stages, and each stage ships the actual templates " +
    "(39 policies, procedures, registers and checklists) so you leave with a fillable " +
    "document set, not just theory.",
  meta: [["Standard", "ISO/IEC 27001:2022"], ["Controls", "93 (Annex A)"], ["Templates", "39"]],

  /* full template library, ported verbatim from the ISO-27001 site */
  templates: window.ISO27001_TEMPLATES || [],

  tracks: [
    { id: "build",   label: "Build the ISMS",           stages: [0, 1, 2, 3] },
    { id: "risk",    label: "Risk-driven planning",     stages: [4, 5] },
    { id: "annexa",  label: "The Annex A control library", stages: [6, 7, 8, 9] },
    { id: "operate", label: "Operate, check, improve",  stages: [10, 11] },
  ],

  reference: [
    {
      kind: "table",
      title: "The mandatory clauses (4–10)",
      head: ["clause", "name", "what it demands"],
      rows: [
        ["4", "Context",       "Understand the org, interested parties, and define the ISMS scope"],
        ["5", "Leadership",    "Top management commitment, the top-level policy, roles"],
        ["6", "Planning",      "Risk assessment & treatment, Statement of Applicability, objectives"],
        ["7", "Support",       "Resources, competence, awareness training, documented information"],
        ["8", "Operation",     "Actually run the risk process and the planned controls"],
        ["9", "Performance",   "Monitor & measure, internal audit, management review"],
        ["10", "Improvement",  "Nonconformities, corrective actions, continual improvement"],
      ],
      foot: "Clauses 4–10 are **not optional** — every certified ISMS must satisfy all of them. Annex A is the control menu you select from.",
    },
    {
      kind: "table",
      title: "Annex A control families (2022 edition)",
      head: ["family", "controls", "theme"],
      rows: [
        ["A.5 Organisational", "37", "policies, roles, suppliers, cloud, incidents, continuity, legal"],
        ["A.6 People",         "8",  "screening, terms, awareness, discipline, NDAs, remote work"],
        ["A.7 Physical",       "14", "perimeters, entry, clear desk, media, cabling, disposal"],
        ["A.8 Technological",  "34", "endpoints, access, crypto, backup, logging, dev security"],
      ],
      foot: "93 controls total. You justify every include **and** every exclude in the Statement of Applicability.",
    },
    {
      kind: "cmds",
      title: "Document map (what auditors ask for first)",
      rows: [
        ["ISMS scope",          "[ORG]-SCOPE-001 — ISMS Scope Statement (Clause 4.3)"],
        ["Top policy",          "[ORG]-POL-001 — Information Security Policy (Clause 5.2)"],
        ["Risk method",         "[ORG]-RISK-001 — Risk Assessment Methodology (Clause 6.1.2)"],
        ["Risk register",       "[ORG]-RISK-REG-001 — Risk Register (Clause 6.1.2)"],
        ["SoA",                 "[ORG]-SOA-001 — Statement of Applicability (Clause 6.1.3)"],
        ["Objectives",          "[ORG]-OBJ-001 — Information Security Objectives (Clause 6.2)"],
        ["Audit evidence",      "Internal Audit Checklist · Management Review Minutes · Corrective Action Register"],
      ],
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "The standard & the management loop",
      tag: "orientation",
      time: "40 min",
      payoff:
        "ISO 27001 is not a checklist of firewalls — it is a **management system**: a " +
        "Plan-Do-Check-Act loop that continuously finds risks, treats them, verifies the " +
        "treatment worked, and fixes what did not. Understand the loop first and every " +
        "document in this module falls into an obvious place.",
      concepts: ["ISMS", "PDCA", "clauses 4–10", "Annex A", "certification audit", "CIA triad"],
      walkthrough: [
        "**Plan** — clauses 4–6: understand context, set scope, assess risks, choose controls, write the Statement of Applicability and objectives.",
        "**Do** — clauses 7–8: fund it, train people, run the controls and the risk process day to day.",
        "**Check** — clause 9: measure, run internal audits, hold management reviews.",
        "**Act** — clause 10: raise nonconformities, apply corrective actions, improve, and go around again.",
        "**Annex A** is a menu of 93 reference controls in 4 families (Organisational, People, Physical, Technological). You pick from it during *Plan* — it is not a to-do list.",
        "**Certification** — an accredited auditor checks the loop runs: stage 1 reviews your documents, stage 2 checks reality matches them; surveillance audits follow yearly.",
      ],
      exercise:
        "Spin the PDCA wheel in the interactive lab above: click each quadrant and read which " +
        "clauses and which of this module's documents belong to it. Then open the Annex A map " +
        "and skim all four families once — you don't need to memorise them, just know the menu exists.",
      note:
        "The 2022 revision merged the old 114 controls (14 families) into 93 controls (4 families) " +
        "and added 11 new ones — threat intelligence, cloud security, data masking, web filtering, " +
        "secure coding among them. If you see 'A.9 Access Control' in a blog post, it's the 2013 edition.",
    },
    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "Scope the ISMS (Clause 4)",
      tag: "context",
      time: "1 h",
      payoff:
        "Everything else hangs off the scope: which locations, systems, people and processes " +
        "the ISMS covers — and, just as important, what is **excluded and why**. Auditors read " +
        "this document first, because an ISMS with a fuzzy boundary can't be audited at all.",
      concepts: ["interested parties", "scope boundaries", "exclusions", "interfaces & dependencies"],
      walkthrough: [
        "**Interested parties** — list who cares about your security: customers, regulators, staff, suppliers, insurers — and what they require of you.",
        "**Boundaries** — name the sites, org units, information assets and business processes inside the ISMS. 'The whole company' is valid but expensive; a product line or data centre is a common first scope.",
        "**Exclusions** — anything left out needs a written justification (e.g. a subsidiary running its own certified ISMS).",
        "**Interfaces** — where in-scope processes touch out-of-scope parties (cloud providers, payroll bureau), the boundary must be named, because risk flows across it.",
      ],
      templates: ["isms-scope"],
      exercise:
        "Open the ISMS Scope Statement template below and fill it in for a real or imagined " +
        "organisation (a 30-person SaaS company works well). Decide one deliberate exclusion " +
        "and write its justification — that sentence is the part auditors actually probe.",
      note:
        "Scope creep kills first-time certifications. A small, honest scope you can defend beats a " +
        "grand scope you can't evidence. You can widen scope at any surveillance audit.",
    },
    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "Leadership & the top policy (Clause 5)",
      tag: "leadership",
      time: "1 h",
      payoff:
        "Clause 5 makes information security a **top-management duty**, not an IT hobby. Its " +
        "visible artifact is the Information Security Policy: the short, board-approved document " +
        "every other policy hangs from, signed by someone who can be held accountable.",
      concepts: ["management commitment", "top-level policy", "roles & responsibilities", "policy hierarchy"],
      walkthrough: [
        "**The top policy** states commitment to confidentiality, integrity and availability, promises resources and continual improvement, and is signed by the CEO or board sponsor.",
        "**The hierarchy** — the top policy points to topic-specific policies (acceptable use, access control, …) which point to procedures, which produce records. One page rules them all.",
        "**Roles** — the standard doesn't mandate a CISO title, but someone must own the ISMS, and the accountability table must reach the board.",
        "**Modern additions** — the ported template already covers AI usage, cloud shared responsibility and software supply chain (SBOM, SLSA), because 2020s auditors ask about all three.",
      ],
      templates: ["isms-policy"],
      exercise:
        "Read the Information Security Policy template end-to-end (it is the richest document in " +
        "this module). Then write, from memory, the five information-security principles it names " +
        "and one prohibited AI use — if you can't, read it again; every staff member is expected " +
        "to know this document exists and what it demands of them.",
      note:
        "Auditors interview random employees with 'does your company have a security policy and " +
        "what does it say about your job?'. Blank stares are a Clause 7.3 (awareness) nonconformity " +
        "— which is why the policy must be short enough that people actually read it.",
    },
    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Security objectives (Clause 6.2)",
      tag: "planning",
      time: "45 min",
      payoff:
        "Objectives turn 'be secure' into **measurable targets** — patch SLAs, phishing-test " +
        "failure rates, incident response times — each with an owner, a metric and a deadline. " +
        "They are how the Check phase later gets numbers to check.",
      concepts: ["SMART objectives", "metrics & KPIs", "owners", "measurement plan"],
      templates: ["isms-objectives"],
      exercise:
        "Using the Information Security Objectives template, write three objectives for your " +
        "practice organisation. Force each one to have a number and a date (e.g. 'critical CVEs " +
        "patched within 14 days, measured monthly from the vulnerability scanner, owner: IT manager').",
      note:
        "Weak objectives ('improve security awareness') are one of the most common minor " +
        "nonconformities. If a metric can't fail, it isn't a metric — an objective you always " +
        "meet by definition tells the management review nothing.",
    },
    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "Risk assessment (Clause 6.1.2)",
      tag: "risk",
      time: "2 h",
      payoff:
        "The risk assessment is the **engine of the whole ISMS**: inventory your assets, work out " +
        "what can go wrong to each, score likelihood × impact, and rank the results. Every control " +
        "you implement later must trace back to a risk found here.",
      concepts: ["asset register", "threat × vulnerability", "likelihood × impact", "risk matrix", "risk owner", "risk appetite"],
      walkthrough: [
        "**Methodology first** — define the scales (what does 'likelihood 4' mean?), the matrix, and the acceptance threshold *before* scoring anything, or scores drift per assessor.",
        "**Asset register** — you can't protect what you haven't listed: information, systems, people, sites, services, each with an owner and a classification.",
        "**Scoring** — for each asset, pair threats with vulnerabilities ('laptop theft × no disk encryption') and score likelihood × impact on the defined scales.",
        "**Risk register** — the ranked output, with a named owner per risk. This is a living document — it changes every time the business or the threat landscape does.",
      ],
      templates: ["risk-methodology", "risk-asset-register", "risk-register"],
      exercise:
        "Fill the Asset Register with 10 assets for your practice org, then take the top 3 and run " +
        "them through the Risk Register: one threat/vulnerability pair each, scored with the " +
        "methodology's scales. Check the score lands where your gut says it should — if not, fix " +
        "the scales, not the score.",
      note:
        "ISO 27001 does not mandate a method — qualitative 5×5 matrices are fine and far more " +
        "common than quantitative models. What auditors check is **consistency**: same scales, " +
        "same process, every cycle, with results comparable over time.",
    },
    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "Risk treatment & the SoA (Clause 6.1.3)",
      tag: "risk",
      time: "1.5 h",
      payoff:
        "For every unacceptable risk you choose: **modify** (apply controls), **transfer** " +
        "(insure/outsource), **avoid** (stop the activity) or **retain** (accept, signed). The " +
        "Statement of Applicability then reconciles your choices against all 93 Annex A controls " +
        "— it is the single most-audited document in the standard.",
      concepts: ["treat / transfer / avoid / retain", "residual risk", "Statement of Applicability", "control selection"],
      walkthrough: [
        "**Treatment plan** — each treated risk gets controls, an owner, a deadline and the expected residual risk. Retained risks need a sign-off by someone entitled to accept them.",
        "**The SoA** — walk all 93 Annex A controls: applicable or not, justification either way, and implementation status. 'Applicable because it treats risks R-012, R-031' is the pattern.",
        "**Exclusions are fine** — a company with no software development can exclude A.8.25–A.8.30, with that one-line justification. Unjustified exclusions are findings.",
        "**Traceability** — auditors love to pick a control in the SoA and ask 'which risk?' then pick a risk and ask 'which control?'. Both directions must resolve.",
      ],
      templates: ["risk-treatment", "isms-soa"],
      exercise:
        "Take your 3 scored risks from the previous stage and write their treatment plan rows. " +
        "Then open the SoA template and mark 10 Annex A controls: at least 8 applicable (naming " +
        "which risk each treats) and at least 1 excluded with a justification you'd defend out loud.",
      note:
        "The Annex A map in this module's interactive lab doubles as a personal SoA tracker — " +
        "tick controls as you decide they're applicable and watch the per-family coverage climb. " +
        "Your ticks persist in this browser.",
    },
    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "A.5 — Organisational controls",
      tag: "annex a",
      time: "3 h",
      payoff:
        "The biggest family: **37 controls** covering the policy suite, supplier and cloud " +
        "security, incident management, business continuity and legal compliance. Nine of this " +
        "module's policy templates implement its core — from Acceptable Use to Privacy.",
      concepts: ["acceptable use", "classification", "access control policy", "supplier security", "cloud (A.5.23)", "incident mgmt (A.5.24–28)", "continuity (A.5.29–30)", "privacy & PII (A.5.34)"],
      walkthrough: [
        "**Acceptable Use (A.5.10)** — the rules every user signs up to: what company kit and data may and may not be used for.",
        "**Classification & transfer (A.5.12–14)** — label information (e.g. Public / Internal / Confidential / Secret) and set handling rules for each level, including how it may leave the org.",
        "**Access control (A.5.15–18)** — need-to-know, least privilege, joiner-mover-leaver, and periodic access reviews as policy.",
        "**Suppliers & cloud (A.5.19–23)** — security requirements flow down contracts; cloud services get their own control in 2022 with shared-responsibility mapping.",
        "**Incidents (A.5.24–28)** — plan, assess, respond, learn, and collect evidence properly — the policy here pairs with the procedure in stage 10.",
        "**Continuity (A.5.29–30)** — keep security running during disruption, and test ICT readiness (RTO/RPO) rather than assume it.",
      ],
      templates: ["pol-aup", "pol-classification", "pol-info-transfer", "pol-access", "pol-supplier", "pol-cloud", "pol-incident", "pol-bcp", "pol-privacy"],
      exercise:
        "Pick three of the nine A.5 policy templates below and adapt their bracketed placeholders " +
        "([ORG], [DATE], tool names) to your practice organisation. Then open the lab's Annex A " +
        "map and tick every A.5 control these nine documents cover — count how much of the family " +
        "a solid policy suite already addresses.",
      note:
        "One document can satisfy several controls and one control may need several documents — " +
        "the mapping is many-to-many. That's exactly what the SoA's 'evidence/reference' column is for.",
    },
    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "A.6 — People controls",
      tag: "annex a",
      time: "1.5 h",
      payoff:
        "Eight controls for the human layer: **screening before hire, security terms in " +
        "contracts, awareness training, discipline, NDAs, and remote work**. Most breaches " +
        "start with a person, so auditors always sample this family.",
      concepts: ["screening (A.6.1)", "terms of employment (A.6.2)", "awareness (A.6.3)", "disciplinary process (A.6.4)", "NDA (A.6.6)", "remote work (A.6.7)"],
      templates: ["pol-hr-security", "pol-nda", "pol-remote-work"],
      exercise:
        "Read the HR Security Policy and note where it touches the employment lifecycle: " +
        "before (screening), during (training, discipline) and after (returning assets, enduring " +
        "confidentiality). Then fill the NDA template for a contractor scenario and list which " +
        "obligations survive termination.",
      note:
        "A.6.8 (event reporting) is the cheapest control you'll ever deploy: a well-known " +
        "address/channel where anyone can report something odd, blame-free. Many real incidents " +
        "are first noticed by a non-technical employee who almost didn't say anything.",
    },
    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "A.7 — Physical controls",
      tag: "annex a",
      time: "1.5 h",
      payoff:
        "Fourteen controls that keep bodies and hardware honest: **perimeters, entry control, " +
        "clear desk, equipment siting, secure media handling and disposal**. Cloud-first " +
        "companies still need this family — laptops, offices and printed contracts exist.",
      concepts: ["perimeters (A.7.1)", "entry control (A.7.2)", "clear desk/screen (A.7.7)", "off-premises assets (A.7.9)", "storage media (A.7.10)", "secure disposal (A.7.14)"],
      templates: ["pol-physical-security", "pol-clear-desk", "pol-media-disposal"],
      exercise:
        "Walk (mentally or literally) from your building's front door to where the most sensitive " +
        "data lives, and note every barrier: door, badge, lock, camera, safe. Map each barrier to " +
        "an A.7 control using the Physical Security Policy template, then check the disposal " +
        "policy's method table — what happens to a dead SSD that held Confidential data?",
      note:
        "Secure disposal (A.7.10/A.7.14) is a classic audit catch: organisations encrypt " +
        "everything in transit, then sell decommissioned drives on eBay. 'Certificate of " +
        "destruction' is the record auditors ask to see.",
    },
    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "A.8 — Technological controls",
      tag: "annex a",
      time: "3 h",
      payoff:
        "The 34 controls closest to IT reality: **endpoints, privileged access, malware defence, " +
        "vulnerability management, backup, logging & monitoring, network security, cryptography " +
        "and the secure development lifecycle**. Seven templates below give you the policy layer " +
        "for the whole family.",
      concepts: ["endpoints (A.8.1)", "malware (A.8.7)", "vulnerabilities (A.8.8)", "backup (A.8.13)", "logging & monitoring (A.8.15–16)", "network security (A.8.20–22)", "crypto (A.8.24)", "SSDLC (A.8.25–29)"],
      walkthrough: [
        "**Endpoints & malware** — device baselines (encryption, screen lock, EDR) and layered anti-malware with defined response when something fires.",
        "**Backup (A.8.13)** — the 3-2-1 pattern plus the part everyone skips: scheduled *restore tests*. An untested backup is a hope, not a control.",
        "**Logging (A.8.15–16)** — what is logged, where it's centralised, how long it's retained, and who reviews alerts; clock sync (A.8.17) makes logs court-usable.",
        "**Network (A.8.20–22)** — segmentation, secured network services, and separation of dev/test/prod (A.8.31).",
        "**Crypto (A.8.24)** — approved algorithms and key management; the template names modern choices (AES-256, TLS 1.2+, Argon2/bcrypt for passwords).",
        "**Secure development (A.8.25–29)** — requirements, secure coding, security testing and change control through the pipeline.",
      ],
      templates: ["pol-endpoint", "pol-malware", "pol-backup", "pol-logging", "pol-network", "pol-crypto", "pol-ssdlc"],
      exercise:
        "Open the Backup Policy and answer from it: what would your practice org lose if its " +
        "primary database died at 16:00 today (RPO), and how long until service is back (RTO)? " +
        "Then open the Logging Policy and list the five log sources it says must reach the SIEM " +
        "first. Finish by ticking the A.8 controls these seven documents cover in the lab map.",
      note:
        "A.8 is where 'we have a policy' most often diverges from 'the control exists'. Auditors " +
        "pair each A.8 policy with live evidence: show me last month's restore test record, " +
        "show me the vulnerability scan and the ticket that closed the critical finding.",
    },
    /* ------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Procedures — how controls actually run",
      tag: "operation",
      time: "2 h",
      payoff:
        "Policies say *what*; procedures say **who does what, in what order, within what time**. " +
        "These four are the ones every ISMS needs on day one: incident response, access " +
        "management, change management and vulnerability handling — each with severity levels, " +
        "SLAs and named roles.",
      concepts: ["incident severity P1–P4", "joiner / mover / leaver", "CAB & emergency change", "CVSS-based SLAs", "runbooks"],
      walkthrough: [
        "**Incident Management** — detect → triage (severity!) → contain → eradicate → recover → post-incident review, with notification clocks (GDPR's 72 hours is wired in).",
        "**User Access Management** — the joiner/mover/leaver flows plus quarterly access reviews; leavers same-day is the line auditors check.",
        "**Change Management** — normal/standard/emergency change classes, approval thresholds, rollback plans; this procedure is what keeps A.8.32 real.",
        "**Vulnerability Management** — scan cadence, severity-based patch SLAs (e.g. critical: 14 days), and exception handling when patching truly can't happen.",
      ],
      templates: ["proc-incident", "proc-access", "proc-change", "proc-vulnerability"],
      exercise:
        "Tabletop it: your monitoring pages you at 02:00 — ransomware note on a file server. " +
        "Using only the Incident Management Procedure below, write the first five actions in " +
        "order, with the role that performs each and the clock that starts ticking. If you had " +
        "to improvise anything, the procedure has a gap — fix the template.",
      note:
        "Procedures are also your training material: a new on-call engineer should be able to run " +
        "an incident from the document alone. If the veteran's head holds steps the paper doesn't, " +
        "that's undocumented single-point-of-failure knowledge — exactly what clause 7.5 exists to prevent.",
    },
    /* ------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "Records, audit & improvement (Clauses 7–10)",
      tag: "check & act",
      time: "2 h",
      payoff:
        "The Check-Act half of the loop: **records prove the ISMS runs** (training registers, " +
        "supplier assessments), **internal audit** finds the gaps before the certifier does, " +
        "**management review** makes leadership look at the numbers, and the **corrective action " +
        "register** closes the loop back into Plan.",
      concepts: ["records & evidence", "internal audit (9.2)", "management review (9.3)", "nonconformity & corrective action (10.1)", "continual improvement"],
      walkthrough: [
        "**Training register (7.2/7.3, A.6.3)** — who was trained on what, when, with completion evidence; awareness is auditable only if recorded.",
        "**Supplier assessment (8.1, A.5.19)** — the scored questionnaire that turns 'we trust our vendors' into a defensible record with a tier and a review date.",
        "**Internal audit (9.2)** — the ported checklist walks every clause and control family; auditors must be independent of what they audit (peer teams work in small orgs).",
        "**Management review (9.3)** — a set agenda: audit results, objectives vs. metrics, risk status, incidents, improvement decisions — minuted, with owners and deadlines.",
        "**Corrective action (10.1)** — every nonconformity gets a root cause and a fix with a verification step; the register's aging columns show whether Act actually happens.",
      ],
      templates: ["rec-training", "rec-supplier", "rec-audit", "rec-management-review", "rec-corrective-action"],
      exercise:
        "Run a 30-minute mini internal audit of your practice ISMS using the Internal Audit " +
        "Checklist: sections 4–6 only. Record two findings (one nonconformity, one observation), " +
        "then open the Corrective Action Register and process the nonconformity through root " +
        "cause → action → verification. You have now been around the whole PDCA loop once.",
      note:
        "This stage's records are what separates a paper ISMS from a real one. A certifier can " +
        "forgive an immature control; they cannot forgive a management system that produces no " +
        "evidence of checking itself. Keep the loop turning and certification is a by-product.",
    },
  ],
};
