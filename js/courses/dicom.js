/* =====================================================================
   Carino Learn — course: DICOM · HIS · HL7  (healthcare interoperability)
   Goal: take someone who has never seen hospital IT from "what is a
   PACS?" to reading HL7 v2 messages, dumping DICOM headers, running
   DIMSE services against a test PACS, and de-identifying studies.
   Same beginner-first contract as the other modules: every stage has a
   line-by-line `walkthrough` and small `drills`.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["dicom"] = {
  id: "dicom",
  title: "DICOM & HL7",
  tag: "healthcare interoperability",
  icon: "pulse",
  blurb: "How hospital systems talk: HL7 messages, DICOM images, PACS workflow.",
  intro:
    "Behind every hospital there is a quiet conversation between machines: the HIS admits a patient, " +
    "the RIS schedules a scan, the modality queries a worklist, the PACS stores the images, a report " +
    "flows back as an HL7 result. Sixteen hands-on stages teach you both languages of that conversation — " +
    "**HL7 v2** for text events and **DICOM** for images and their services, from C-STORE all the way to " +
    "retrieval, film printers and storage commitment — plus the modern FHIR layer " +
    "and the privacy rules that govern all of it. No hospital badge required: everything runs against " +
    "free tools (dcmtk, pynetdicom, public test servers) on your own machine.",
  meta: [["Standards", "HL7 v2.x · DICOM · FHIR"], ["Domain", "hospital IT"], ["Style", "message dissection"]],

  tracks: [
    { id: "map",    label: "The hospital IT map",         stages: [0, 1, 2, 3] },
    { id: "hl7",    label: "HL7 v2 — the lingua franca",  stages: [4, 5, 6, 7] },
    { id: "dicom",  label: "DICOM — the imaging standard", stages: [8, 9, 10, 11, 12, 13] },
    { id: "modern", label: "FHIR & staying safe",         stages: [14, 15] },
  ],

  reference: [
    {
      kind: "table",
      title: "The systems & what each one does",
      head: ["system", "one-line purpose"],
      rows: [
        ["HIS",  "Hospital Information System — admissions, transfers, billing; the master of patient demographics"],
        ["EMR/EHR", "Electronic Medical/Health Record — the clinical chart doctors read and write"],
        ["RIS",  "Radiology Information System — schedules imaging orders, holds the radiology report"],
        ["PACS", "Picture Archiving & Communication System — stores and serves the images themselves"],
        ["LIS",  "Laboratory Information System — lab orders and results (blood work, cultures…)"],
        ["VNA",  "Vendor Neutral Archive — long-term image store independent of any one PACS vendor"],
        ["EMPI", "Enterprise Master Patient Index — reconciles one human across many MRNs"],
        ["Interface engine", "the router in the middle (Mirth/Rhapsody…) — receives, transforms, forwards HL7"],
        ["Modality", "the machine that makes images: CT, MR, US, CR/DX, MG…"],
      ],
      foot: "Rule of thumb: **HL7 carries the story, DICOM carries the pictures.**",
    },
    {
      kind: "table",
      title: "HL7 v2 segments you will actually meet",
      head: ["segment", "carries"],
      rows: [
        ["MSH", "message header: who sends, who receives, message type, encoding characters"],
        ["EVN", "event type & when it happened"],
        ["PID", "patient identity: MRN, name, birth date, sex, address"],
        ["PV1", "patient visit: class (in/outpatient), location, attending doctor, visit number"],
        ["ORC", "common order: order control (NW new, CA cancel), placer/filler order numbers"],
        ["OBR", "observation request: what exam/test was ordered, accession number"],
        ["OBX", "one observation result: value, units, reference range, abnormal flag"],
        ["NTE", "free-text note attached to the segment above it"],
        ["MSA", "acknowledgement: AA accept, AE error, AR reject"],
        ["AL1", "allergy information"],
      ],
      foot: "Message type lives in `MSH-9`, e.g. `ADT^A01`, `ORM^O01`, `ORU^R01`.",
    },
    {
      kind: "table",
      title: "DICOM tags worth memorising",
      head: ["tag", "VR · name"],
      rows: [
        ["(0010,0010)", "PN · PatientName (LAST^FIRST^MIDDLE)"],
        ["(0010,0020)", "LO · PatientID — the MRN"],
        ["(0010,0030)", "DA · PatientBirthDate (YYYYMMDD)"],
        ["(0008,0050)", "SH · AccessionNumber — the link back to the RIS order"],
        ["(0008,0060)", "CS · Modality (CT, MR, US, CR, DX, MG…)"],
        ["(0020,000D)", "UI · StudyInstanceUID — one visit to the scanner"],
        ["(0020,000E)", "UI · SeriesInstanceUID — one acquisition/stack"],
        ["(0008,0018)", "UI · SOPInstanceUID — one image, globally unique forever"],
        ["(0008,0016)", "UI · SOPClassUID — what KIND of object (CT Image Storage…)"],
        ["(0002,0010)", "UI · TransferSyntaxUID — how pixels are encoded on the wire"],
        ["(7FE0,0010)", "OW · PixelData — the actual pixels, always dead last"],
      ],
      foot: "Group is the first number: `0008` identification, `0010` patient, `0020` relationship, `7FE0` pixels.",
    },
    {
      kind: "table",
      title: "The DIMSE verb set",
      head: ["verb", "what it does"],
      rows: [
        ["C-ECHO",  "ping: prove the association machinery works"],
        ["C-STORE", "push one composite object (image, SR…)"],
        ["C-FIND",  "query: filled keys filter, empty keys return"],
        ["C-MOVE",  "3-party retrieve: SCP C-STOREs to a named third AE"],
        ["C-GET",   "2-party retrieve: C-STOREs come back on the same association"],
        ["N-CREATE","make a stateful object (film box, MPPS instance)"],
        ["N-SET",   "update its attributes (pixels into an image box, MPPS→COMPLETED)"],
        ["N-GET",   "read its attributes (printer status)"],
        ["N-ACTION","trigger behaviour (print the film, request commitment)"],
        ["N-EVENT-REPORT", "asynchronous callback (commitment verdict)"],
        ["N-DELETE","destroy the object (dismantle the print job)"],
      ],
      foot: "C-* ship **copies of composite objects**; N-* manage **live, stateful ones**.",
    },
    {
      kind: "cmds",
      title: "DIMSE one-liners (dcmtk & pynetdicom)",
      rows: [
        ["Is the PACS alive?",          "echoscu -aet ME -aec PACS pacs.host 104"],
        ["Send a study",                "storescu -aet ME -aec PACS pacs.host 104 *.dcm"],
        ["Find a patient's studies",    "findscu -S -aet ME -aec PACS -k QueryRetrieveLevel=STUDY -k PatientID=12345 pacs.host 104"],
        ["Pull (3-party, C-MOVE)",      "movescu -S -aet ME -aec PACS -aem ME -k StudyInstanceUID=1.2.3… pacs.host 104"],
        ["Pull (2-party, C-GET)",       "getscu -S -aet ME -aec PACS -k QueryRetrieveLevel=STUDY -k StudyInstanceUID=1.2.3… -od ./incoming pacs.host 104"],
        ["Dump a file's header",        "dcmdump image.dcm | less"],
        ["Run a toy PACS in Python",    "python -m pynetdicom storescp 11112 -aet MYPACS -od ./incoming"],
        ["Query a worklist",            "findscu -W -aet CT01 -aec RIS -k Modality=CT ris.host 105"],
        ["Emulate a film printer",      "dcmprscp --config dcmpstat.cfg  (then print to it with dcmpsprt/dcmprscu)"],
      ],
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "The hospital IT landscape",
      tag: "HIS · RIS · PACS · EMR",
      time: "30–40 min",
      payoff:
        "One patient's scan touches half a dozen systems, and every acronym in a hospital IT " +
        "meeting maps to a box in this diagram. Once you can place HIS, RIS, PACS and the EMR " +
        "on the map — and know which of the two languages each pair of boxes speaks — the rest " +
        "of this course is just filling in the arrows.",
      concepts: ["HIS", "RIS", "PACS", "EMR/EHR", "LIS", "modality", "interface engine", "VNA"],
      code:
`                 THE CONVERSATION AROUND ONE CT SCAN

   HIS (admissions, demographics, billing)
    |
    |  HL7 ADT  "patient 12345 was admitted"
    v
   RIS (radiology orders & reports) <---- HL7 ORM "CT chest ordered"
    |                                \\
    |  DICOM MWL  "here is your       \\  HL7 ORU  "report: no acute
    |   worklist for today"            \\  findings" ---> EMR
    v                                   \\
   CT SCANNER (the modality)             (radiologist dictates)
    |
    |  DICOM C-STORE  "here are 400 images"
    v
   PACS (image archive) <---> radiologist's workstation (DICOM Q/R)

   text events travel as HL7  ·  images travel as DICOM`,
      lang: "txt",
      walkthrough: [
        "**HIS** — the Hospital Information System is the administrative brain: it registers patients, assigns the **MRN** (medical record number), tracks admissions and produces the bill. Almost every other system learns about a patient **from** the HIS.",
        "**RIS** — the Radiology Information System runs the imaging department: it receives orders, schedules them onto scanners, assigns the **accession number**, and stores the radiologist's report.",
        "**PACS** — the Picture Archiving and Communication System stores the images and serves them to viewers. It speaks DICOM almost exclusively.",
        "**EMR/EHR** — the chart clinicians actually read: notes, meds, labs, and the radiology **report** (usually not the images themselves — those stay on PACS and are linked).",
        "**The modality** is the imaging device itself — CT, MR, ultrasound. In DICOM-speak 'modality' means both the machine and the two-letter code for its image type (`CT`, `MR`, `US`).",
        "**The interface engine** (Mirth Connect, Rhapsody, Cloverleaf…) sits in the middle of all HL7 traffic like a mail sorting office: one system sends it a message, it transforms and routes copies to everyone who cares.",
        "Notice the split in the diagram: every **text** arrow is HL7, every **image** arrow is DICOM. That single distinction organises this whole course.",
      ],
      exercise:
        "Draw the diagram above from memory (boxes and arrows, labels on the arrows).\n" +
        "Then answer for each arrow: HL7 or DICOM?\n" +
        "  1. HIS tells RIS a patient was admitted.\n" +
        "  2. The CT sends finished images to the archive.\n" +
        "  3. The RIS sends the finished report to the chart.\n" +
        "  4. The scanner asks 'who am I scanning this morning?'",
      drills: [
        "Which system **owns** the MRN? Which one assigns the accession number?",
        "A clinician says 'the images aren't in the chart'. Which two systems are involved, and what actually links them?",
        "What does a VNA add that a PACS alone doesn't?",
        "Name the three systems a single chest CT order touches before the scanner even starts.",
      ],
      note:
        "Vendors blur these lines — many EMRs contain a RIS module, many PACS bundle a viewer and " +
        "an archive. The **roles** stay stable even when the boxes merge, so always ask 'which role is " +
        "this system playing right now?' rather than 'which product is it?'.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "The patient journey, message by message",
      tag: "one scan, seven messages",
      time: "30–40 min",
      payoff:
        "Interoperability makes sense only as a **story**. Follow one patient from the front desk to " +
        "the signed report and you'll see exactly when each message fires, what it contains, and " +
        "what breaks downstream when one of them goes missing — which is precisely how integration " +
        "analysts debug real hospitals.",
      concepts: ["ADT", "order (ORM)", "worklist", "acquisition", "C-STORE", "report (ORU)", "billing"],
      code:
`# The timeline of one chest CT — every line is a real message
07:58  HIS  -> everyone   HL7  ADT^A01   patient admitted (demographics)
08:15  EMR  -> RIS        HL7  ORM^O01   "order: CT CHEST W/O CONTRAST"
08:16  RIS  -> HIS        HL7  ORM^O01   (order echoed for billing)
09:02  CT   -> RIS        DICOM MWL C-FIND   "today's worklist please"
09:03  RIS  -> CT         DICOM MWL results  patient + accession pre-filled
09:20  CT   -> PACS       DICOM C-STORE x400 the images land in the archive
09:21  CT   -> RIS        DICOM MPPS      "acquisition complete"
10:40  RIS  -> EMR        HL7  ORU^R01   preliminary report
11:55  RIS  -> EMR        HL7  ORU^R01   final signed report
12:00  RIS  -> HIS        HL7  DFT^P03   charge posted`,
      lang: "txt",
      walkthrough: [
        "**07:58 ADT^A01** — the moment registration finishes, the HIS broadcasts an **admit** event. Every subscribed system creates or updates the patient locally. This is why demographics are (usually) consistent everywhere.",
        "**08:15 ORM^O01** — the order message. It carries **what** was ordered and the **placer order number**; the RIS answers with its own **filler order number** and mints the **accession number** that will follow this exam forever.",
        "**09:02 MWL C-FIND** — the scanner queries the RIS's **Modality Worklist**. The reply pre-fills patient name, MRN and accession on the console, so the technologist never types them — the #1 defence against mislabeled studies.",
        "**09:20 C-STORE** — each reconstructed image is pushed to the PACS as its own DICOM object; a chest CT is easily hundreds of instances in a few series.",
        "**09:21 MPPS** — Modality Performed Procedure Step tells the RIS 'I actually scanned it' (started/completed), closing the loop between **scheduled** and **performed**.",
        "**10:40 / 11:55 ORU^R01** — the report travels as an observation result. Status **P** (preliminary) then **F** (final) — the EMR shows the distinction to clinicians.",
        "**12:00 DFT^P03** — a financial transaction message posts the charge. No message, no revenue: broken interfaces are found by accountants as often as by clinicians.",
      ],
      exercise:
        "Cover the code block and write the timeline yourself: the 6 message TYPES in order,\n" +
        "who sends each one, and whether it is HL7 or DICOM.\n" +
        "Then decide what a user would report if each single message were lost:\n" +
        "  a) the MWL reply   b) the C-STOREs   c) the final ORU",
      drills: [
        "The technologist sees an empty worklist. Which two systems and which protocol do you check?",
        "Images are on PACS but the EMR shows 'no report'. Which message went missing?",
        "Why does the accession number exist at 08:15 but the StudyInstanceUID only around 09:03?",
        "Which two messages exist purely so the hospital gets paid?",
      ],
      note:
        "This flow has an official name: the **IHE Scheduled Workflow (SWF) profile**. IHE " +
        "(Integrating the Healthcare Enterprise) publishes 'profiles' that pin down exactly which " +
        "HL7/DICOM messages implement a clinical scenario — reading SWF after this stage will feel " +
        "like seeing this diagram in legalese.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "Identifiers: the threads that hold it together",
      tag: "MRN · accession · UID",
      time: "30–40 min",
      payoff:
        "Every mismatched study, every 'wrong patient' near-miss, every merge headache is an " +
        "identifier problem. Learn the four identifier families and which system mints each one, " +
        "and you can diagnose most integration incidents from your chair.",
      concepts: ["MRN", "visit/account number", "accession number", "placer/filler order numbers", "Study/Series/SOP Instance UID", "patient merge (A40)"],
      code:
`# One exam, four identifier families -- who mints what

MRN (PatientID)          12345          minted by HIS   lives for life
Visit / account number   V2026-08812    minted by HIS   lives per stay
Accession number         ACC-99031      minted by RIS   lives per exam
Placer order number      EMR-55710      minted by EMR (the asker)
Filler order number      RIS-70221      minted by RIS (the doer)

# DICOM UIDs: globally unique, dot-decimal, minted by the modality
StudyInstanceUID   1.2.840.113619.2.55.3.604688119.868.1
SeriesInstanceUID  1.2.840.113619.2.55.3.604688119.868.1.2
SOPInstanceUID     1.2.840.113619.2.55.3.604688119.868.1.2.37

# The magic join: the accession number is copied into DICOM tag
# (0008,0050) by the worklist -- that is how RIS rows meet PACS studies.`,
      lang: "txt",
      walkthrough: [
        "**MRN** — the medical record number identifies **the human** inside one institution. The HIS mints it once and everything else references it (HL7 `PID-3`, DICOM `(0010,0020)`).",
        "**Visit number** — one hospital **stay**. A patient readmitted next month keeps their MRN but gets a new visit. HL7 carries it in `PV1-19`.",
        "**Accession number** — one imaging **exam**. It is the primary key radiology thinks in: reports, billing and images all quote it.",
        "**Placer vs filler** — HL7's polite pair: the system that **asks** (placer, usually EMR) and the system that **does** (filler, usually RIS) each keep their own order number, and every order message quotes both so either side can reconcile.",
        "**DICOM UIDs** are different animals: globally unique dot-decimal strings (max 64 chars) minted by the device itself under a registered root. Two hospitals can never collide, which is what makes CD imports and migrations possible at all.",
        "The hierarchy is strict: one **Study** UID per exam, one **Series** UID per acquisition, one **SOP Instance** UID per image. Copy an image and give it the same SOPInstanceUID and a PACS will treat it as **the same object**.",
        "The **join line** at the bottom is the single most important fact in radiology IT: MWL copies the RIS accession into `(0008,0050)`, welding the HL7 world to the DICOM world.",
      ],
      exercise:
        "For each incident, name the identifier at fault:\n" +
        "  1. Two chart entries turn out to be the same human.\n" +
        "  2. A report attaches to yesterday's X-ray instead of today's CT.\n" +
        "  3. A CD import creates a duplicate study on PACS.\n" +
        "  4. The EMR can't match the RIS's 'order complete' to its own order.",
      drills: [
        "Which HL7 message type fixes incident 1, and what is its event code? (Peek at the ADT stage if stuck.)",
        "Why must a modality **never** reuse a SOPInstanceUID, even after a crash?",
        "A study arrives on PACS with a blank (0008,0050). What was skipped at the scanner?",
        "Whose UID root is `1.2.840.113619`? Search it — vendors' roots are public.",
      ],
      note:
        "Patient merges (`ADT^A40`) are the horror-movie of this stage: the HIS declares 'MRN B was " +
        "really MRN A', and every downstream system must re-home years of data. PACS teams speak of " +
        "merge queues with the same tone sysadmins reserve for failed RAID arrays.",
    },

    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Inside the RIS: the order's life",
      tag: "your PACS's upstream",
      time: "40–50 min",
      payoff:
        "If you build or run a PACS, the RIS is your **upstream**: it decides what your archive " +
        "will receive, when, and under which identifiers. Learn the order's state machine and the " +
        "messages that drive each transition, and half of tomorrow's mysteries — unscheduled " +
        "studies, missing priors, status stuck at 'in progress' — become one-glance diagnoses.",
      concepts: ["order lifecycle", "scheduling", "procedure codes", "protocoling", "MPPS status sync", "prefetch & relevant priors", "unscheduled/walk-in studies"],
      code:
`# One order's life inside the RIS -- and what each hop emits

 ORDERED       EMR sends ORM^O01 (ORC-1=NW) ....... RIS creates order, MINTS THE ACCESSION
    |
 SCHEDULED     clerk picks slot + station ......... entry appears in that scanner's MWL
    |
 ARRIVED       front desk checks patient in ....... ADT^A04/A08 refreshes demographics
    |
 IN PROGRESS   modality sends MPPS "started" ...... RIS locks the slot, starts the clock
    |
 COMPLETED     MPPS "completed" ................... RIS now EXPECTS N objects on the PACS
    |
 DICTATED      radiologist reads from PACS ........ draft report attached to accession
    |
 PRELIM/FINAL  ORU^R01 (P then F) to the EMR ...... order closed; DFT^P03 posts the charge

# The RIS also owns:
#   procedure codes   71250^CT CHEST WO CONTRAST^CPT  (what MWL hands the scanner)
#   protocoling       which acquisition protocol fits this order
#   prefetch          "CT chest tomorrow -> pull priors to the reading workstation tonight"`,
      lang: "txt",
      walkthrough: [
        "**ORDERED** — the ORM lands and the RIS mints the accession number. From this instant your PACS has a name for a study that does not exist yet — which is exactly what makes **prefetching** possible.",
        "**SCHEDULED** — a human (or auto-scheduler) binds the order to a date and a station AE title. Only now does it appear in that scanner's Modality Worklist query results; an order can sit ORDERED for weeks (routine screening) or seconds (stat trauma).",
        "**IN PROGRESS / COMPLETED** — driven not by HL7 but by **MPPS**, DICOM's status back-channel. When 'completed' arrives, a well-built RIS knows how many instances were acquired and can ask the PACS 'did you get all 401?' — this is the hook exam-completeness checking hangs on.",
        "**DICTATED → FINAL** — the radiologist reads from the PACS but *signs in the RIS*; the report belongs to the accession, not to the images. The ORU carries it to the EMR (stage 6).",
        "**Prefetch / relevant priors** — the RIS knows tomorrow's schedule; a smart integration queries the PACS tonight (C-FIND by PatientID + BodyPart) and C-MOVEs priors to the right workstation cache. If you ever add prefetch to Carino-PACS, this stage is its specification.",
        "**The walk-in problem** — emergency X-rays happen before any order exists. The tech scans with manual entry, the images arrive **unscheduled** (no accession, or a made-up one), and the RIS creates the order *after the fact*. Every real PACS needs a reconciliation queue for exactly this; IHE calls the cleanup profile **PIR**.",
        "For a store-only PACS the practical takeaways are: **trust (0008,0050) only if MWL was used**, expect unscheduled studies daily, and treat RIS status messages as the source of truth about what *should* exist in your archive.",
      ],
      exercise:
        "Trace a walk-in emergency wrist X-ray through the state machine:\n" +
        "  1. Which states are skipped entirely?\n" +
        "  2. What lands in (0008,0050) if the tech types nothing? If they type 'TRAUMA1'?\n" +
        "  3. Write the sequence of events (human + message) that gets this study correctly\n" +
        "     attached to a real order created 40 minutes later.\n" +
        "  4. What should a PACS display in its worklist for such a study meanwhile?",
      drills: [
        "Which two transitions are driven by DICOM (MPPS) rather than HL7 — and why does that split exist?",
        "The RIS shows 'completed' but the PACS has 380 of 401 instances. Name three places the other 21 could be.",
        "Why must the accession be minted at ORDERED rather than at SCHEDULED for prefetch to work?",
        "A study appears on the PACS with accession 'TRAUMA1' that matches no RIS order. Walk the reconciliation steps.",
      ],
      note:
        "Market reality: standalone RIS is fading — EMR vendors (Epic Radiant, Cerner RadNet) absorbed " +
        "scheduling and reporting, and many 'PACS' products now bundle RIS features. The *state machine* " +
        "above survives every repackaging; learn it once and you can navigate any vendor's rename of it.",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "HL7 v2 anatomy: pipes all the way down",
      tag: "MSH · segments · fields",
      time: "40–60 min",
      payoff:
        "HL7 v2 looks like line noise until someone shows you the five delimiters — then every " +
        "message in every hospital on earth becomes readable. After this stage you can open a raw " +
        "ADT and answer 'who, what, when, from where' in seconds.",
      concepts: ["segment", "field", "component", "repetition", "MSH-9 message type", "encoding characters |^~\\&"],
      code:
`MSH|^~\\&|HIS|CARINO_GH|RIS|RADIOLOGY|20260724081500||ADT^A01|MSG00042|P|2.5.1
EVN|A01|20260724081500
PID|1||12345^^^CARINO_GH^MR||GARCIA^MARIA^L||19840312|F|||CALLE 5 #22^^GUADALAJARA^JAL^44100^MEX
PV1|1|I|3W^301^A|||^HOUSE^GREGORY^^^DR|||MED|||||||||V2026-08812

# How to read any field:  SEGMENT-position
#   MSH-9  = ADT^A01          message type ^ trigger event
#   PID-3  = 12345^^^CARINO_GH^MR    the MRN + assigning authority
#   PID-5  = GARCIA^MARIA^L    name components: last ^ first ^ middle
#   PV1-2  = I                 patient class: I inpatient, O outpatient, E emergency`,
      lang: "hl7",
      walkthrough: [
        "**MSH** must be the first segment of every message, and its first field **is** the delimiter set: `|` splits fields, `^` components, `~` repetitions, `\\` escapes, `&` sub-components. The message literally teaches you how to parse it.",
        "**MSH-3/4 → MSH-5/6** — sending application/facility and receiving application/facility. Interface engines route on these four fields all day long.",
        "**MSH-9 = `ADT^A01`** — message **type** (ADT) plus **trigger event** (A01, an admission). The pair tells the receiver which segments to expect.",
        "**MSH-10** is the message control ID — the ACK you'll meet in stage 7 quotes it back, which is how senders match answers to questions.",
        "**PID-3 = `12345^^^CARINO_GH^MR`** — an identifier is itself componentised: the value, then (skipping two) the assigning authority and the type code `MR`. One PID-3 can **repeat** with `~` to carry MRN + national ID together.",
        "**PID-5** — names are components in `LAST^FIRST^MIDDLE` order. This convention leaks into DICOM (`GARCIA^MARIA^L` again) — one of the few things both standards agree on.",
        "**PV1** — the visit: class `I` (inpatient), location `3W^301^A` (ward^room^bed), attending doctor, and the visit number in PV1-19.",
        "Counting trick: the field **after** `MSH|^~\\&|` is MSH-3, because the delimiters themselves are MSH-1 and MSH-2. For every other segment, the first pipe-separated value after the name is field 1.",
      ],
      exercise:
        "Without scrolling up, decode from the message: the patient's full name, sex, birth date,\n" +
        "MRN, ward/room/bed, attending physician, and the exact date-time of the event.\n" +
        "Then change the message so she is an OUTPATIENT seen in ER — which two fields move?",
      drills: [
        "What are the five encoding characters, in order, and what does each split?",
        "Why is MSH-1 the pipe character itself?",
        "Write a PID-5 for 'DR. JOHN A. SMITH JR.' — where do prefix and suffix go? (Components 5 and 4 — look up the XPN type.)",
        "A feed arrives with `\\S\\` inside a field. What is it? (An escape sequence — `^` as data.)",
      ],
      note:
        "HL7 v2 is from 1989 and it shows: positional, cryptic, wildly successful. Ninety-plus percent " +
        "of hospital interfaces still run v2 today precisely **because** it is trivially parseable and " +
        "every vendor already speaks it. Learn v2 first; FHIR (stage 14) will feel like a luxury hotel.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "ADT: admit, discharge, transfer",
      tag: "the demographic heartbeat",
      time: "40–50 min",
      payoff:
        "ADT is the highest-volume feed in any hospital — the drumbeat every other system dances to. " +
        "Know the dozen trigger events that matter and you can predict what any downstream system " +
        "will do when a patient moves, merges, or was never really admitted at all.",
      concepts: ["A01 admit", "A02 transfer", "A03 discharge", "A04 register", "A08 update", "A11/A13 cancels", "A40 merge"],
      code:
`# The trigger events that run a hospital (MSH-9 second component)
A01  admit inpatient          creates the visit everywhere
A02  transfer                 patient moved bed/ward -> PV1-3 changes
A03  discharge                closes the visit
A04  register outpatient      like A01 but for clinic/ER visits
A05  pre-admit                booking before arrival
A08  update patient info      demographics changed -- most common message of all
A11  cancel admit             "that A01 was a mistake"
A13  cancel discharge         "they're back, un-discharge them"
A40  merge patient IDs        MRN B folds into MRN A (MRG segment!)

# A transfer on the wire -- note only PV1 really changes:
MSH|^~\\&|HIS|CARINO_GH|PACS|RADIOLOGY|20260724103000||ADT^A02|MSG00097|P|2.5.1
EVN|A02|20260724103000
PID|1||12345^^^CARINO_GH^MR||GARCIA^MARIA^L||19840312|F
PV1|1|I|ICU^02^B|||^HOUSE^GREGORY^^^DR|||MED|||||||||V2026-08812

# A merge carries the DYING identifier in the MRG segment:
MSH|^~\\&|HIS|CARINO_GH|RIS|RADIOLOGY|20260724110000||ADT^A40|MSG00101|P|2.5.1
PID|1||12345^^^CARINO_GH^MR||GARCIA^MARIA^L||19840312|F
MRG|99887^^^CARINO_GH^MR`,
      lang: "hl7",
      walkthrough: [
        "**A01 vs A04** — both create a patient encounter; A01 means a bed (inpatient), A04 a visit (outpatient/ER). Downstream billing treats them very differently, clinical systems mostly don't care.",
        "**A02** — the transfer message: compare its PV1-3 (`ICU^02^B`) with the admission's (`3W^301^A`). Nurse-call systems, meal trays, and portable X-ray routing all follow this one field.",
        "**A08** — the workhorse. Any demographic correction (typo in name, new insurance, changed address) fires an A08. Systems must **upsert**: update if the patient exists, create if somehow they don't.",
        "**A11/A13** — cancel events. They exist because reality is messy: registrations happen to the wrong person, discharges bounce. A system that ignores cancels slowly fills with ghosts.",
        "**A40 + MRG** — the merge: PID carries the **surviving** MRN, the **MRG segment** carries the **retired** one. Every archive must re-label; a PACS that misses an A40 will file tomorrow's images under a dead MRN.",
        "Notice all three example messages share the same PID skeleton — ADT is repetitive by design, so parsers are simple and boring, which in an interface is the highest compliment.",
      ],
      exercise:
        "Write (by hand, in ER7 pipes) the A03 that discharges Maria Garcia on 2026-07-25 at 14:00.\n" +
        "Base it on the A02 above: which fields change, which stay identical?\n" +
        "Bonus: write the A11 that would cancel her original admission — what should\n" +
        "a PACS do with any images already stored under that visit?",
      drills: [
        "Rank A01, A02, A08 by expected daily volume in a 400-bed hospital. Why does A08 win?",
        "Which event makes a downstream system **delete or re-home** data rather than add it?",
        "Your test PACS shows the patient in two beds at once. Which message did it drop?",
        "What's in MSH-9 for a merge, and which segment appears **only** in merges?",
      ],
      note:
        "Real feeds add Z-segments — site-specific extras like `ZPI|smoker|N`. The standard blesses " +
        "the escape hatch: anything starting with Z is yours to define. Every integration engineer " +
        "has cursed an undocumented Z-segment at 2 a.m.; when you design one, write it down.",
    },

    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Orders & results: ORM and ORU",
      tag: "ORC · OBR · OBX",
      time: "40–60 min",
      payoff:
        "Orders and results are where hospitals **do** things: every lab draw, every scan, every " +
        "report rides an ORM out and an ORU back. Master the ORC/OBR/OBX trio and you can read a " +
        "lab result, a radiology report, or a vital-signs feed with the same three-segment lens.",
      concepts: ["ORM^O01 / OMI", "ORU^R01", "ORC order control", "OBR", "OBX value types", "result status P/F/C"],
      code:
`# THE ORDER -- EMR asks radiology for a chest CT
MSH|^~\\&|EMR|CARINO_GH|RIS|RADIOLOGY|20260724081500||ORM^O01|MSG00055|P|2.5.1
PID|1||12345^^^CARINO_GH^MR||GARCIA^MARIA^L||19840312|F
ORC|NW|EMR-55710|||||^^^20260724^^R
OBR|1|EMR-55710||71250^CT CHEST WO CONTRAST^CPT|||||||||||^HOUSE^GREGORY

# THE RESULT -- RIS returns the signed report (plus one numeric OBX for flavour)
MSH|^~\\&|RIS|RADIOLOGY|EMR|CARINO_GH|20260724115500||ORU^R01|MSG00088|P|2.5.1
PID|1||12345^^^CARINO_GH^MR||GARCIA^MARIA^L||19840312|F
ORC|RE|EMR-55710|RIS-70221
OBR|1|EMR-55710|RIS-70221|71250^CT CHEST WO CONTRAST^CPT|||20260724092000|||||||||^HOUSE^GREGORY||ACC-99031||||20260724115500|||F
OBX|1|TX|IMP^IMPRESSION||No acute cardiopulmonary abnormality.||||||F
OBX|2|NM|DLP^DOSE LENGTH PRODUCT||142|mGy.cm|<200||||F`,
      lang: "hl7",
      walkthrough: [
        "**ORC-1 order control** is the verb: `NW` new order, `CA` cancel, `SC` status change, `RE` observations to follow. One code turns the same segments into an ask, a takeback, or an answer.",
        "**ORC-2/ORC-3** — placer and filler order numbers, the handshake from stage 2 that you watched drive the RIS in stage 3. The order goes out with only ORC-2; the result comes back carrying both.",
        "**OBR-4** — **what** was ordered, as a coded value: `71250^CT CHEST WO CONTRAST^CPT` = code ^ human text ^ coding system. Swap CPT for LOINC and the same shape orders a potassium level.",
        "**OBR-18 in the result carries `ACC-99031`** — there's our accession number again, the same string that MWL will stamp into DICOM (0008,0050).",
        "**OBR-25 = `F`** — result status: `P` preliminary, `F` final, `C` corrected. An EMR must visually distinguish these; addendum handling (`C` after `F`) is a classic source of missed findings when done badly.",
        "**OBX** — one observation each. OBX-2 is the value **type**: `TX` text (our impression), `NM` numeric (our dose), `CE` coded, `ED` embedded document (a base64 PDF!). OBX-3 says **what** was observed, OBX-5 the value, OBX-6 units, OBX-7 reference range.",
        "A lab ORU is the same skeleton with more OBX rows: potassium, sodium, chloride — one OBX each, `NM` type, with OBX-8 flagging `H`/`L` abnormals. Same lens, different department.",
      ],
      exercise:
        "Write the ORU for a basic metabolic panel with two results:\n" +
        "  potassium 5.9 mmol/L (range 3.5-5.1, flag H) and sodium 139 mmol/L (range 136-145).\n" +
        "Use LOINC-ish codes (2823-3 potassium, 2951-2 sodium), status F.\n" +
        "Then send the ORM^O01 that CANCELS the CT order — which single ORC field changes?",
      drills: [
        "What ORC-1 code means 'new order'? 'Cancel'? 'Results follow'?",
        "In OBX-2, when do you pick TX vs NM vs ED?",
        "How would an EMR know a result is an updated **correction** to one it already displayed?",
        "Which two fields tie this ORU back to (a) the EMR's order and (b) the DICOM study?",
      ],
      note:
        "Modern imaging shops are moving from ORM^O01 to the tidier **OMI^O23** (imaging-specific " +
        "order), but ORM remains everywhere. As always in HL7: the standard proposes, the installed " +
        "base disposes. Support what the other end actually sends.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "ACKs, MLLP & interface engines",
      tag: "delivery guarantees",
      time: "40–50 min",
      payoff:
        "Messages don't teleport — they cross TCP inside MLLP frames and are answered by ACKs, and " +
        "when interfaces 'go down' this plumbing is where you look. This stage turns you into the " +
        "person who can read an engine's error queue instead of just restarting it.",
      concepts: ["MLLP framing", "ACK/NAK", "MSA codes AA/AE/AR", "store-and-forward", "interface engine", "message queue"],
      code:
`# MLLP: how HL7 v2 travels over TCP (usually port 2575 or site-chosen)
#   <VT>  0x0B  vertical tab   -- start of message
#   <FS>  0x1C  file separator -- end of message
#   <CR>  0x0D  carriage return -- trailer
#
#   <VT>MSH|^~\\&|HIS|...<CR>PID|...<CR>PV1|...<CR><FS><CR>
#   (segments end with plain CR -- NOT newline, a classic gotcha)

# The receiver answers every message with an ACK:
MSH|^~\\&|RIS|RADIOLOGY|HIS|CARINO_GH|20260724081501||ACK^A01|ACK00042|P|2.5.1
MSA|AA|MSG00042

# The three MSA-1 verdicts:
#   AA  application accept -- committed, sender may forget it
#   AE  application error  -- something wrong with THIS message (bad segment)
#   AR  application reject -- receiver can't/won't process (unknown patient, down)

# Test any HL7 listener from bash:
printf '\\x0bMSH|^~\\&|TEST|ME|RIS|RAD|20260724||ADT^A08|1|P|2.5\\x0d\\x1c\\x0d' | nc ris.host 2575 | xxd | head`,
      lang: "hl7",
      walkthrough: [
        "**MLLP** (Minimal Lower Layer Protocol) is gloriously dumb: wrap the message in `0x0B … 0x1C 0x0D` over a plain TCP socket. That's the whole protocol — which is why a `printf | nc` one-liner is a legitimate test tool.",
        "**Segments end with CR (0x0D)** — not LF, not CRLF. Editors that 'helpfully' convert line endings corrupt HL7 files; when a parser reports 'one giant segment', check your line endings first.",
        "**The ACK** echoes the sender's MSH-10 (`MSG00042`) inside **MSA-2** — that's the correlation. Senders keep a message in their outbound queue until the matching AA arrives.",
        "**AA/AE/AR** — accept, error, reject. The operational difference: after **AE** you fix the **message** and resend; after **AR** you fix the **receiver** (or the patient context) and resend; after **AA** you must **never** resend, or you create duplicates.",
        "**Store-and-forward** — engines like Mirth persist every inbound message to disk **before** ACKing, then deliver onward with retries. When a destination dies for an hour, messages pool in a queue and drain later — nothing is lost, only late.",
        "The `nc` line at the bottom sends a minimal A08 and hex-dumps whatever comes back — if you see `0x0B MSH … MSA|AA`, the listener is alive and parsing. This is `echoscu` for the HL7 world (you'll meet the real echoscu in stage 9).",
      ],
      exercise:
        "Install Mirth Connect (free) or use any TCP listener, and:\n" +
        "  1. Create a channel listening on port 2575.\n" +
        "  2. Send the A08 one-liner from the code block with nc.\n" +
        "  3. Find the message in the channel's queue view and read the returned ACK.\n" +
        "  4. Stop the destination, send 3 more, and watch the queue hold them; restart and watch it drain.",
      drills: [
        "Write out the three MLLP bytes and where each goes.",
        "Your sender shows 'timeout waiting for ACK'. List three distinct causes at three different layers.",
        "Why must a receiver ACK only **after** persisting the message?",
        "A destination returns AE for every message with 'invalid date'. Where do you look — sender, engine transform, or receiver?",
      ],
      note:
        "The engine's transform layer is where hospitals quietly patch the world: mapping local codes, " +
        "fixing vendor quirks, stripping fields a receiver chokes on. Powerful and dangerous — " +
        "undocumented transforms are how two hospitals running 'the same interface' behave differently.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "DICOM: tags, VRs & the file",
      tag: "the data model",
      time: "45–60 min",
      payoff:
        "A DICOM file is not 'an image with extras' — it's a database record that happens to " +
        "contain pixels. Once you can read a dcmdump — tag, VR, value — you can answer almost any " +
        "'why does the viewer show X?' question straight from the header.",
      concepts: ["tag (group,element)", "VR value representation", "dataset", "part 10 file", "preamble & DICM", "transfer syntax", "sequences (SQ)"],
      code:
`# dcmdump chest_ct_001.dcm      (a real header, abridged)

# -- file meta (group 0002: about the FILE, always explicit little endian)
(0002,0010) UI =LittleEndianExplicit                    #  TransferSyntaxUID
(0002,0002) UI =CTImageStorage                          #  MediaStorageSOPClassUID

# -- the dataset (about the PATIENT / STUDY / IMAGE)
(0008,0016) UI =CTImageStorage                          #  SOPClassUID
(0008,0018) UI [1.2.840.113619.2.55.3.604688119.868.1.2.37] #  SOPInstanceUID
(0008,0020) DA [20260724]                               #  StudyDate
(0008,0050) SH [ACC-99031]                              #  AccessionNumber
(0008,0060) CS [CT]                                     #  Modality
(0010,0010) PN [GARCIA^MARIA^L]                         #  PatientName
(0010,0020) LO [12345]                                  #  PatientID
(0010,0030) DA [19840312]                               #  PatientBirthDate
(0020,000d) UI [1.2.840.113619.2.55.3.604688119.868.1]  #  StudyInstanceUID
(0020,000e) UI [1.2.840.113619.2.55.3.604688119.868.1.2] #  SeriesInstanceUID
(0028,0010) US 512                                      #  Rows
(0028,0011) US 512                                      #  Columns
(0028,1050) DS [40]                                     #  WindowCenter
(0028,1051) DS [400]                                    #  WindowWidth
(7fe0,0010) OW 0000\\0000\\0000\\0000...                   #  PixelData (524288 bytes)`,
      lang: "dicom",
      walkthrough: [
        "**A tag is `(group,element)`** — two 16-bit hex numbers. Groups cluster meaning: `0008` identification, `0010` patient, `0020` relationships, `0028` image description, `7FE0` pixels. After a week these read like postcodes.",
        "**VR — Value Representation** — is the type system: `PN` person name, `LO` long string, `DA` date `YYYYMMDD`, `UI` UID, `CS` coded string, `US` unsigned short, `DS` decimal **string** (yes, numbers as text), `OW` other-word (raw pixel words), `SQ` sequence — a list of nested datasets, DICOM's way of holding structure.",
        "**The dataset is just a sorted list** of (tag, VR, length, value) — ascending tag order, which is why PixelData `(7FE0,0010)` is physically last and why tools can read **everything about** an image without reading the image.",
        "**Group 0002 is the file-meta header** — information **about the file**: which SOP class it holds and, crucially, the **TransferSyntaxUID**: how the dataset after it is encoded (little/big endian, implicit/explicit VR, JPEG/JPEG-LS/RLE compressed…).",
        "**Part 10 file layout**: 128 zero-filled preamble bytes, then the four magic characters `DICM`, then group 0002, then the dataset. `xxd file.dcm | head -9` shows you `DICM` at offset 0x80 — the fastest 'is this DICOM?' check there is.",
        "**Implicit vs explicit VR** — in explicit transfer syntaxes the VR is written in the file; in **implicit** (the default network syntax!) it's omitted and both sides must know it from the data dictionary. This is why unknown private tags in implicit files are undecodable blobs.",
        "**WindowCenter/Width** `(40, 400)` — display instructions: centre the greyscale at 40 HU, span 400. Change them to (600, 1500) and the same pixels show lung instead of soft tissue — the header, not the pixels, decides what you **see**.",
      ],
      exercise:
        "Install dcmtk (`dnf install dcmtk` / `apt install dcmtk`), grab any sample .dcm\n" +
        "(e.g. from the pydicom test files repo), then:\n" +
        "  1. `xxd file.dcm | head -9` — find DICM at offset 0x80.\n" +
        "  2. `dcmdump file.dcm | head -40` — identify SOP class, transfer syntax, modality.\n" +
        "  3. Find the patient tags in group 0010.\n" +
        "  4. `dcmdump +P PixelData file.dcm` — confirm pixels live at (7fe0,0010).",
      drills: [
        "Decode from memory: (0010,0010), (0008,0050), (0020,000D), (7FE0,0010).",
        "What VR would you expect for: a birth date? a UID? a person name? raw pixels?",
        "Why can a viewer list 400 studies' worth of metadata in a second without touching pixel data?",
        "A file fails with 'cannot determine VR of private tag'. Which transfer syntax family is it in?",
      ],
      note:
        "The full data dictionary lives in **DICOM PS3.6** — thousands of tags — and part 10 files are " +
        "defined in PS3.10. The standard is free at dicomstandard.org and, unusually for standards, " +
        "genuinely readable. Bookmark PS3.6; you will grep it weekly.",
    },

    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "Patient → Study → Series → Instance",
      tag: "the hierarchy & UIDs",
      time: "35–45 min",
      payoff:
        "Every PACS query, every viewer layout, every retrieve you'll ever run walks the same " +
        "four-level tree. Internalise it and Q/R levels, series splits, and 'why are there 3 " +
        "thumbnails for one scan?' all become obvious.",
      concepts: ["information model", "study", "series", "SOP instance", "SOP class", "UID hierarchy", "composite objects"],
      code:
`PATIENT  GARCIA^MARIA^L   (PatientID 12345)
 |
 +-- STUDY  "CT CHEST WO CONTRAST"  2026-07-24     <- one trip to imaging
 |    |   StudyInstanceUID  ...868.1
 |    |   AccessionNumber   ACC-99031
 |    |
 |    +-- SERIES 1  "SCOUT"            CT   2 images
 |    |     SeriesInstanceUID ...868.1.1
 |    +-- SERIES 2  "AXIAL 1.25mm"     CT   398 images
 |    |     SeriesInstanceUID ...868.1.2
 |    |     +-- INSTANCE  ...868.1.2.1     (one slice)
 |    |     +-- INSTANCE  ...868.1.2.2
 |    |     +-- ...
 |    +-- SERIES 3  "DOSE REPORT"      SR   1 object
 |
 +-- STUDY  "XR CHEST PA/LAT"  2025-11-02          <- last year's x-ray
      StudyInstanceUID  ...441.7

# Rule: every level has its own UID; children inherit context, never UIDs.
# SOP CLASS  = what KIND of thing (CT Image Storage, 1.2.840.10008.5.1.4.1.1.2)
# SOP INSTANCE = which EXACT thing (this slice, this moment, forever)`,
      lang: "txt",
      walkthrough: [
        "**Patient** — the root, keyed by PatientID within an institution. A patient node exists on PACS only because some study referenced it.",
        "**Study** — one visit to imaging, minted when the exam happens. It owns the accession number and the StudyDate; a patient accumulates studies for life, and comparing today's study with a **prior** is half of radiology.",
        "**Series** — one acquisition or reconstruction: the scout, the axial stack, a reformat, the dose report. Same modality, same position context. Viewers hang one series per hanging-protocol slot.",
        "**Instance** — one storable object. Usually 'one image', but also one structured report, one presentation state, one RT plan. 'SOP instance' = Service-Object Pair instance, DICOM's charmingly bureaucratic name for 'a thing'.",
        "**SOP Class vs SOP Instance** — class is the **type** (CT Image Storage, its UID fixed in the standard); instance is the **individual** (minted by the device, unique forever). Exactly a class/object split, in 1993 clothing.",
        "**Series 3 is an SR** — Structured Report. Non-image objects live in the same tree, which is why a 'CT study' can contain documents. Your viewer's mystery thumbnail is usually one of these.",
        "Q/R spoiler for stage 10: queries name a **level** — 'find STUDIES matching…', 'move this SERIES' — which is literally choosing a floor of this tree to operate on.",
      ],
      exercise:
        "Sketch the tree for this real scenario: MR brain with and without contrast —\n" +
        "localizer (3 img), T1 axial pre (26), T2 axial (26), T1 axial post (26), plus a\n" +
        "radiation-free bonus: which levels get NEW UIDs if the tech repeats the T2 series?\n" +
        "(New series UID + new instance UIDs; study UID stays.)",
      drills: [
        "One chest CT with scout + axial + coronal reformat + dose SR: how many series? Roughly how many instances?",
        "Which two identifiers live at study level but come from **different** worlds (RIS vs modality)?",
        "Why does 'delete the study' terrify PACS admins more than 'delete the series'?",
        "Give the SOP class vs SOP instance analogy in programming terms.",
      ],
      note:
        "The tree is also the **DICOMDIR** structure on patient CDs and the folder layout most " +
        "archives use on disk. When Carino-PACS or any store-SCP files an incoming object, it is " +
        "walking exactly this hierarchy: patient/study/series/instance, mkdir all the way down.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "DIMSE services: echo, store, find, move",
      tag: "DICOM on the network",
      time: "60–90 min",
      payoff:
        "This is DICOM's verbs — the four services that move every image in every hospital. After " +
        "this stage you can prove connectivity, push studies, query archives and retrieve them, " +
        "using nothing but free command-line tools. This is the daily toolkit of a PACS admin.",
      concepts: ["AE title", "association", "presentation context", "SCU/SCP", "C-ECHO", "C-STORE", "C-FIND", "C-MOVE vs C-GET"],
      code:
`# Cast: your machine (AE title ME) and a PACS (AE title PACS, host pacs.host, port 104)

# 1. C-ECHO -- the DICOM ping. Proves TCP + association + AE titles all agree.
echoscu -v -aet ME -aec PACS pacs.host 104

# 2. C-STORE -- push objects. You are the SCU (client), PACS the SCP (server).
storescu -v -aet ME -aec PACS pacs.host 104 series2/*.dcm

# 3. C-FIND -- query. -S = study root; -k sets both filters and return keys.
findscu -S -v -aet ME -aec PACS pacs.host 104 \\
  -k QueryRetrieveLevel=STUDY \\
  -k PatientID=12345 \\
  -k StudyDate=20260101-20260724 \\
  -k StudyInstanceUID= -k StudyDescription=      # empty = "return this field"

# 4. C-MOVE -- retrieve. The PACS opens a NEW association back to the AE
#    named by -aem and C-STOREs the study to it. You must be listening!
storescp -v -aet ME -od ./incoming 11112 &       # our receiving SCP
movescu -S -aet ME -aec PACS -aem ME \\
  -k QueryRetrieveLevel=STUDY \\
  -k StudyInstanceUID=1.2.840.113619.2.55.3.604688119.868.1 \\
  pacs.host 104

# The PACS only trusts AEs it knows: AE title + host + port must be
# configured on BOTH ends. 90% of "DICOM doesn't work" is this table.`,
      lang: "bash",
      walkthrough: [
        "**AE titles** — Application Entity titles, up to 16 chars, ALL CAPS by convention. They are DICOM's names-on-the-door: `-aet` is who **you** claim to be, `-aec` who you're calling. PACS keep an allowlist of known AEs — wrong title, association rejected.",
        "**Association** — before any service, the two ends negotiate: 'I propose to send CT images in these transfer syntaxes' — each offer is a **presentation context**, and the SCP accepts or rejects each. Only then do commands flow. `-v` shows this negotiation; read it once, slowly.",
        "**SCU/SCP** — Service Class **User** (asks) and **Provider** (serves). Roles, not machines: your workstation is a store-SCU when pushing and a store-SCP when receiving a C-MOVE.",
        "**C-ECHO** — the verification service. If echoscu succeeds, network, port, and AE configuration are all correct; if it fails, nothing else will work. Always start here.",
        "**C-FIND** — send a template dataset: filled keys are filters, empty keys are 'please return this'. Responses come one match at a time. `-S` picks the **study root** model — you must state which level you're querying with QueryRetrieveLevel.",
        "**C-MOVE's famous trap** — the images do NOT come back on your query connection. The PACS opens a **fresh association** to the AE named in `-aem`, which must resolve to a host:port in the PACS's config, where a store-SCP (our backgrounded `storescp`) must be listening. Firewalls that allow outbound 104 but block inbound 11112 break retrieves in exactly this confusing way.",
        "**C-GET** pulls images back on the **same** association — no callback connection, no firewall drama. It deserves (and gets) its own stage next, side by side with C-MOVE and their modern successor DICOMweb.",
      ],
      exercise:
        "Build a two-node lab on your own machine:\n" +
        "  1. Terminal A: `python -m pynetdicom storescp 11112 -aet MYPACS -od ./archive`\n" +
        "  2. Terminal B: `echoscu -aet ME -aec MYPACS localhost 11112` — expect success.\n" +
        "  3. Push a sample file: `storescu -aet ME -aec MYPACS localhost 11112 sample.dcm`.\n" +
        "  4. Confirm it landed in ./archive and dcmdump it.\n" +
        "  5. Break it on purpose: wrong port, then wrong AE title — read both error messages.",
      drills: [
        "Which side is SCU and which SCP during: an echo? a store? the store **inside** a C-MOVE?",
        "Write the findscu keys to list all CT studies for MRN 12345 this year.",
        "A C-MOVE returns 'success, 0 completed'. The query worked — what table entry is missing?",
        "Why does C-GET traverse firewalls more happily than C-MOVE?",
      ],
      note:
        "Port 104 is the historic DICOM port (privileged!); 11112 is the common unprivileged choice. " +
        "For Python folks, **pynetdicom** implements all of this natively — a complete store-SCP is " +
        "~20 lines, which is exactly how the Carino-PACS project started.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "Retrieval: C-MOVE, C-GET & DICOMweb",
      tag: "three ways to get images back",
      time: "50–70 min",
      payoff:
        "Storing images is half a PACS; giving them back is the other half — and the half where " +
        "designs differ. C-MOVE, C-GET and WADO-RS all answer 'send me study X', with wildly " +
        "different connection shapes, firewall behaviour and implementation cost. Choose (and " +
        "implement) knowingly: this decision defines what Carino-PACS must support as an SCP.",
      concepts: ["C-MOVE (3-party)", "C-GET (2-party)", "role negotiation", "sub-operation counters", "retrieve levels", "WADO-RS / QIDO-RS / STOW-RS", "firewalls & NAT"],
      code:
`# --- C-MOVE: THREE parties. The PACS calls you back on a NEW association.
storescp -aet ME -od ./incoming 11112 &        # you must already be listening
movescu -S -aet ME -aec PACS -aem ME \\
  -k QueryRetrieveLevel=STUDY \\
  -k StudyInstanceUID=1.2.840.113619.2.55.3.604688119.868.1 \\
  pacs.host 104
# PACS must know AE "ME" -> host:port in its config, or: "Success, 0 completed"

# --- C-GET: TWO parties. Images come back ON THE SAME association.
getscu -S -aet ME -aec PACS \\
  -k QueryRetrieveLevel=STUDY \\
  -k StudyInstanceUID=1.2.840.113619.2.55.3.604688119.868.1 \\
  -od ./incoming pacs.host 104
# no listener, no PACS-side AE table entry, no inbound firewall hole

# Every retrieve response streams sub-operation counters:
#   Remaining / Completed / Failed / Warning     (watch Completed climb to 401)

# --- DICOMweb: the modern two-party retrieve -- plain HTTPS
curl -s "https://pacs.example/dicomweb/studies/1.2.840.…868.1" \\
  -H "Accept: multipart/related; type=application/dicom" -o study.multipart`,
      lang: "bash",
      walkthrough: [
        "**C-MOVE is a delegation**: 'PACS, please C-STORE study X *to the AE named ME*'. The images never travel on your query association — the PACS opens a **brand-new association** to whatever host:port its config maps 'ME' to. Elegant in 1993 (send to a *third* machine!), painful today.",
        "**The C-MOVE failure signature** — `Success, 0 completed` or a hang: query worked, callback failed. Causes, in order: AE not in the PACS table, wrong port in that table, inbound firewall, no store-SCP actually listening. You met this in the DIMSE stage; now you know its anatomy.",
        "**C-GET flips the arrow**: the images ride back on the association *you* opened. The trick is **role negotiation** — during A-ASSOCIATE your SCU proposes storage presentation contexts with the *SCP role* for itself, declaring 'I can receive C-STOREs on this same socket'. That extra negotiation is why lazy implementations skipped C-GET for decades.",
        "**Sub-operation counters** are your progress bar and your truth serum: the final response says Completed=399, Failed=2 — and a good client surfaces that instead of pretending success. When you implement retrieve in Carino-PACS, send honest counters; debugging colleagues will bless you.",
        "**As a PACS (SCP) the costs differ**: supporting C-MOVE means your server must *initiate outbound associations* and C-STORE to configured AEs — which is literally the folder-auto-forward machinery Carino-PACS already has, pointed at a dynamic destination. Supporting C-GET means interleaving C-STORE-RQs back down the association you're already serving. Many minimal archives ship C-MOVE first for exactly this reason.",
        "**DICOMweb** is DICOM's REST face: **QIDO-RS** (query ≈ C-FIND) as GET with query params, **WADO-RS** (retrieve ≈ C-GET) as GET returning multipart DICOM or rendered JPEG, **STOW-RS** (store ≈ C-STORE) as POST. One HTTPS port, standard auth, browser-viewer friendly — it is where new integrations are going, with DIMSE staying for modality traffic.",
        "**Retrieve levels** mirror the hierarchy from stage 9: MOVE/GET a whole STUDY, one SERIES, or a single IMAGE — a viewer fetching just the series you clicked is sending SERIES-level retrieves with the UIDs it learned from an earlier C-FIND.",
      ],
      exercise:
        "Extend your stage-10 two-node lab into a retrieve lab:\n" +
        "  1. Push 3+ instances into your pynetdicom storescp archive.\n" +
        "  2. Try `getscu` against it — read the association log: which storage contexts were\n" +
        "     proposed with which role, and what did the SCP accept?\n" +
        "  3. If your toy SCP lacks C-GET, note the abort/rejection — that IS the lesson.\n" +
        "  4. Sketch (on paper) the three TCP connections involved when a workstation\n" +
        "     C-MOVEs a study from PACS-A *to workstation-B*. Label every AE title.",
      drills: [
        "Which retrieve crosses a NAT/home-office firewall without configuration — and exactly why?",
        "`Success, 0 completed` — which retrieve, and what three config rows do you check?",
        "What must an SCU negotiate at association time to make C-GET possible?",
        "Map QIDO-RS, WADO-RS and STOW-RS to their DIMSE ancestors.",
        "Your viewer shows a study list instantly but each series loads on click. Which operations, at which levels, in what order?",
      ],
      note:
        "pynetdicom implements all three DIMSE retrieves (see its QueryRetrievePresentationContexts " +
        "and the C-GET handler docs), and pydicom + a few hundred lines gives you a workable STOW/WADO " +
        "endpoint. A realistic Carino-PACS roadmap: C-FIND → C-MOVE → STOW-RS/WADO-RS → C-GET last.",
    },

    /* -------------------------------------------------------------- 12 */
    {
      n: 12,
      title: "Modality Worklist & the scheduled workflow",
      tag: "where HL7 meets DICOM",
      time: "45–60 min",
      payoff:
        "MWL is the weld between the two halves of this course: an HL7 order goes in, a DICOM " +
        "worklist comes out, and the scanner inherits perfect demographics. Understand this join " +
        "and you understand why studies match patients — and how to fix it when they don't.",
      concepts: ["MWL C-FIND", "scheduled procedure step", "MPPS", "IHE SWF", "accession → (0008,0050)", "broken worklist debugging"],
      code:
`# The scanner asks the RIS: "what is scheduled for me today?"
findscu -W -v -aet CT01 -aec RIS_MWL ris.host 105 \\
  -k ScheduledProcedureStepSequence[0].Modality=CT \\
  -k ScheduledProcedureStepSequence[0].ScheduledStationAETitle=CT01 \\
  -k ScheduledProcedureStepSequence[0].ScheduledProcedureStepStartDate=20260724 \\
  -k PatientName= -k PatientID= -k PatientBirthDate= \\
  -k AccessionNumber= -k RequestedProcedureDescription= \\
  -k StudyInstanceUID=

# One worklist item comes back (abridged) -- every value born in HL7:
# (0010,0010) PN [GARCIA^MARIA^L]      <- from ADT PID-5
# (0010,0020) LO [12345]               <- from ADT PID-3
# (0008,0050) SH [ACC-99031]           <- minted by RIS at ORM time
# (0020,000d) UI [...868.1]            <- RIS pre-assigns the Study UID!
# (0040,0100) SQ ScheduledProcedureStepSequence
#   (0008,0060) CS [CT]
#   (0040,0002) DA [20260724]          <- scheduled date
#   (0040,0001) AE [CT01]              <- which scanner

# Tech taps the entry on the console -> all of it is COPIED into every image.
# No typing, no typos, no orphaned studies.`,
      lang: "bash",
      walkthrough: [
        "**`-W`** switches findscu to the Modality Worklist information model — still C-FIND under the hood, just a different query root aimed at **scheduled** work rather than stored images.",
        "**The sequence keys** — worklist entries keep scheduling details inside `ScheduledProcedureStepSequence` (an SQ, stage 8's nested dataset). The query filters on modality + station + date: 'CT jobs, for me, today'.",
        "**Trace each returned tag to its HL7 source** — name and MRN entered the RIS via ADT, the accession was minted at ORM time, and the RIS **pre-assigns the StudyInstanceUID**. The modality copies all of it into every image it creates. This copying moment is the entire integration.",
        "**The technologist's tap** replaces manual entry. Before MWL, techs typed patient names at the console — 'GARC1A', 'GRACIA' — and PACS filled with orphans. Worklist adoption is the single biggest data-quality upgrade in imaging history.",
        "**MPPS** (Modality Performed Procedure Step) is the return path: N-CREATE 'started' and N-SET 'completed/discontinued', carrying what was **actually** performed. The RIS reconciles scheduled vs performed and can tell PACS to expect exactly 401 objects.",
        "**Debugging a broken worklist** is a layer walk you already know: echoscu to the MWL SCP (config?), rerun with `-v` (association?), loosen keys (filter too tight? date format? station AE mismatch?), then check the RIS end (did the ORM ever arrive? is the exam scheduled to **this** station?).",
      ],
      exercise:
        "Stand up a fake worklist and query it:\n" +
        "  1. `wlmscpfs -dfp ./wl_db 105` (dcmtk's file-based MWL server; it serves .wl files).\n" +
        "  2. Create a worklist file: take any .dcm, edit PatientName/AccessionNumber with\n" +
        "     `dcmodify`, save as ./wl_db/OFFIS/example.wl (or craft one with `dump2dcm`).\n" +
        "  3. Run the findscu -W query from the code block against localhost 105.\n" +
        "  4. Change the Modality key to MR and watch your CT entry vanish from results.",
      drills: [
        "Which three demographic tags in an image trace back to an ADT message, via which segments?",
        "Why is it significant that the RIS (not the scanner) assigns the StudyInstanceUID here?",
        "Scanner shows an empty worklist but echoscu succeeds. Name the next three checks in order.",
        "What does MPPS 'discontinued' let the RIS do that a missing study alone cannot?",
      ],
      note:
        "When worklist is down, techs fall back to manual entry, and the mislabeled studies that " +
        "result must later be fixed by **patient reconciliation** on PACS (move study to correct " +
        "patient). Every PACS admin has a Monday-morning queue of these. IHE's **PIR** profile " +
        "(Patient Information Reconciliation) exists precisely for that cleanup.",
    },

    /* -------------------------------------------------------------- 13 */
    {
      n: 13,
      title: "N-services: printers, MPPS & storage commitment",
      tag: "DICOM's other verb family",
      time: "50–70 min",
      payoff:
        "C-services move copies of objects; **N-services manage stateful things** that live on the " +
        "other side — a film printer's job queue, a procedure step, a commitment promise. Film may " +
        "be fading, but N-services are how MPPS works and how **storage commitment** works — the " +
        "feature that lets a modality safely delete local images because your PACS promised to keep " +
        "them. If Carino-PACS grows one more service, this is the one.",
      concepts: ["composite vs normalized", "N-CREATE / N-SET / N-GET / N-ACTION / N-EVENT-REPORT / N-DELETE", "film session → film box → image box", "Basic Grayscale Print", "MPPS revisited", "storage commitment"],
      code:
`# COMPOSITE (C-*) verbs ship whole objects. NORMALIZED (N-*) verbs poke at
# stateful objects the SCP keeps alive between calls. Two famous users:

# --- A DICOM PRINTER is driven like a tiny remote object database
WORKSTATION                             PRINTER (Print SCP / film camera)
  N-GET    Printer .................... "status NORMAL, 14x17 film loaded"
  N-CREATE Basic Film Session ......... session created   (copies=1, MED priority)
  N-CREATE Basic Film Box ............. film created      (layout STANDARD\\2,3)
  N-SET    Image Box 1..6 ............. pixels placed into each of the 6 cells
  N-ACTION Film Box -> PRINT .......... film actually comes out
  N-DELETE Basic Film Session ......... job dismantled

# --- STORAGE COMMITMENT: "will you take responsibility for these?"
MODALITY                                PACS (this is YOUR side as an SCP)
  N-ACTION  StorageCommitmentPushModel  "please commit:" + list of SOP UIDs
        ... the answer is ASYNCHRONOUS -- maybe seconds, maybe minutes ...
  N-EVENT-REPORT  <------------------   "committed: 401, failed: 0"
        (often on a NEW association that the PACS opens back to the modality)

# Only after that N-EVENT-REPORT may the modality auto-delete local copies.
# A PACS that answers commitment must mean it: verified on durable storage.`,
      lang: "txt",
      walkthrough: [
        "**The split**: C-STORE hands you a *copy* and forgets. N-services operate on a *live instance* by UID — create it, set its attributes, read them back, trigger behaviour, destroy it. It's remote object-oriented programming over an association, vintage 1993.",
        "**The print hierarchy is nested state**: one **Film Session** (the job: copies, priority, medium) contains **Film Boxes** (one per sheet: layout `STANDARD\\2,3` = 2×3 grid), each containing **Image Boxes** the SCP itself creates when the film box is made — you only N-SET pixels into them. N-ACTION on the film box fires the actual print.",
        "**Why bother in 2026?** Film printers still haunt ORs, dental clinics and courts (film is a legal artifact in some places); 'paper print' SCPs put images on report paper; and any legacy modality with a Print button expects *someone* to answer. A PACS that can be that someone earns installs in exactly the small clinics Carino-PACS targets.",
        "**Grayscale vs colour** are separate SOP classes (Basic Grayscale/Color Print Management Meta). Density, magnification and presentation LUTs are attributes you N-SET — how radiographs stay diagnostic on film.",
        "**MPPS, revisited**: now you can name what stage 3 hand-waved — the modality **N-CREATEs** an MPPS instance ('started', patient + accession inside) and later **N-SETs** it to COMPLETED or DISCONTINUED. Same verb family as the printer, different object.",
        "**Storage commitment is a promise with a signature.** The modality N-ACTIONs a transaction UID plus the SOP instance list; your PACS verifies every instance is safely on durable storage and answers with **N-EVENT-REPORT** — success list and failure list. Asynchronous by design: the report may arrive on a fresh association *initiated by the PACS*, so both ends need each other's AE config (shades of C-MOVE).",
        "**Implementation notes for Carino-PACS**: pynetdicom ships the Storage Commitment Push Model and Print Management classes; the work is (1) persist the request, (2) verify files (sizes/digests) *after* fsync, not just after receive, (3) send the event report with honest failure lists, (4) never commit what you might prune. Commitment turns a store-only cache into an archive modalities can trust with deletion.",
      ],
      exercise:
        "Two small builds:\n" +
        "  1. PRINT — run dcmtk's printer emulator: `dcmprscp --config /etc/dcmpstat.cfg`\n" +
        "     (sample config ships with dcmtk), then send it a page with `dcmpsprt`/`dcmprscu`\n" +
        "     and read the N-CREATE/N-SET/N-ACTION sequence in its verbose log.\n" +
        "  2. COMMITMENT — sketch (or code, ~60 lines of pynetdicom) an SCP that accepts the\n" +
        "     N-ACTION, checks the requested SOPInstanceUIDs against a folder, and sends the\n" +
        "     N-EVENT-REPORT. Decide: what do you verify before saying 'committed'?",
      drills: [
        "Match each N-verb to its printer moment: create the sheet, put a slice in cell 4, press print, ask for toner status, tear down the job.",
        "Why is the storage-commitment answer asynchronous rather than a simple response?",
        "What is the difference between a PACS that ACKed 401 C-STOREs and one that committed 401 instances?",
        "Which two other things in this course are N-service users? (MPPS; and MWL is not — why not?)",
        "A modality's disk is full because auto-delete never triggers. Name the missing service and the two config rows to check.",
      ],
      note:
        "The old joke is that DICOM print is 'a database protocol wearing a printer costume' — true, " +
        "and useful: once you've driven film boxes with N-CREATE/N-SET, MPPS, storage commitment and " +
        "even Unified Procedure Step (UPS, the modern worklist) all read as the same pattern. PS3.4 " +
        "Annexes H (print) and J (storage commitment) are the primary sources.",
    },

    /* -------------------------------------------------------------- 14 */
    {
      n: 14,
      title: "FHIR: healthcare goes REST",
      tag: "the modern layer",
      time: "45–60 min",
      payoff:
        "FHIR is what greenfield healthcare APIs speak: JSON resources over HTTPS with real REST " +
        "semantics. One stage won't make you a FHIR engineer, but you'll read resources fluently, " +
        "query a public server from curl, and know exactly how FHIR maps onto the v2 and DICOM " +
        "knowledge you now have.",
      concepts: ["resource", "Patient / Encounter / ServiceRequest / DiagnosticReport / ImagingStudy", "REST verbs", "search params", "references", "DICOMweb"],
      code:
`# FHIR: every 'thing' is a Resource with a REST home. Try a public test server:
curl -s 'https://hapi.fhir.org/baseR4/Patient?name=garcia&_count=1' | jq .

# A Patient resource -- compare field-for-field with PID:
{
  "resourceType": "Patient",
  "id": "12345",
  "identifier": [{
    "system": "urn:oid:2.16.840.1.113883.19.5",     // assigning authority (PID-3.4)
    "value": "12345"                                 // the MRN (PID-3.1)
  }],
  "name": [{ "family": "Garcia", "given": ["Maria", "L"] }],   // PID-5
  "gender": "female",                                // PID-8
  "birthDate": "1984-03-12"                          // PID-7 (ISO dates at last!)
}

# The mappings you already know, in FHIR clothes:
#   ADT admit        ->  Encounter resource (status: in-progress)
#   ORM order        ->  ServiceRequest
#   ORU report       ->  DiagnosticReport (+ Observation per OBX)
#   the study on PACS -> ImagingStudy (UIDs inside!) + DICOMweb for pixels

# REST verbs do what they say:
#   GET    /Patient/12345            read
#   GET    /ServiceRequest?subject=Patient/12345&status=active
#   POST   /DiagnosticReport         create
#   PUT    /Patient/12345            update`,
      lang: "json",
      walkthrough: [
        "**Resources** are FHIR's unit: ~150 defined types (Patient, Encounter, Observation…), each a JSON (or XML) document with a fixed schema, an `id`, and a REST endpoint. Everything you did with segments now has a noun.",
        "**The identifier block** is PID-3 grown up: `system` (a URI naming the assigning authority) + `value`. The same patient can carry MRN, national ID and insurance number as separate identifiers — no more counting carets.",
        "**References** stitch resources together: a ServiceRequest points at `\"subject\": {\"reference\": \"Patient/12345\"}`. Where v2 **copies** patient demographics into every message, FHIR **links** — normalised, like a sane database.",
        "**Search parameters** — `GET /ServiceRequest?subject=Patient/12345&status=active` — replace an entire class of v2 query messages with query strings anyone can read.",
        "**ImagingStudy** is the bridge to your DICOM half: it mirrors the study/series/instance hierarchy **with the same UIDs**, so an EMR can list studies via FHIR and then fetch pixels via **DICOMweb** — QIDO-RS (find ≈ C-FIND), WADO-RS (retrieve ≈ C-MOVE), STOW-RS (store ≈ C-STORE), all plain HTTPS.",
        "**The catch**: FHIR dominates new APIs (patient apps, SMART-on-FHIR, national exchanges) while v2 still dominates hospital-internal feeds. Real integration work is **translation** — an engine mapping ADT^A01 → Encounter is the 2020s' bread and butter.",
      ],
      exercise:
        "Against https://hapi.fhir.org/baseR4 (public, no auth):\n" +
        "  1. Search patients named 'smith'; note the Bundle wrapper and total.\n" +
        "  2. Pick one id and GET /Patient/<id> directly.\n" +
        "  3. Find their Observations: /Observation?subject=Patient/<id>&_count=5.\n" +
        "  4. Write (on paper) the FHIR resource + fields for HL7 'OBX|1|NM|2823-3^POTASSIUM||5.9|mmol/L'.",
      drills: [
        "Name the FHIR resource for: an admission, an imaging order, a lab result, a stored study.",
        "How does FHIR express 'MRN 12345 assigned by Carino GH' without carets?",
        "Which DICOMweb service corresponds to C-FIND? To C-STORE?",
        "Why does FHIR **reference** the patient where v2 **embeds** the patient? One advantage of each?",
      ],
      note:
        "SMART on FHIR adds OAuth2 app-launch on top — the reason a third-party app can open inside " +
        "an EMR with the right patient in context. If you build anything patient-facing, that plus " +
        "the US/EU national FHIR mandates is why the JSON you learned today is a career skill.",
    },

    /* -------------------------------------------------------------- 15 */
    {
      n: 15,
      title: "PHI, de-identification & security",
      tag: "with great data…",
      time: "45–60 min",
      payoff:
        "Every byte you've studied is protected health information, and mishandling it is a " +
        "career-ending, law-breaking event. This stage gives you the working rules: what counts " +
        "as PHI, how to actually strip it from DICOM (including the traps), and how these " +
        "protocols are secured in transit.",
      concepts: ["PHI/PII", "HIPAA & GDPR posture", "de-identification profile", "burned-in annotation", "private tags", "UID remapping", "TLS for DICOM & HL7"],
      code:
`# BEFORE: dcmdump study/img37.dcm   -- PHI everywhere
(0008,0050) SH [ACC-99031]            #  AccessionNumber
(0008,0080) LO [CARINO GENERAL HOSP]  #  InstitutionName
(0008,0090) PN [HOUSE^GREGORY]        #  ReferringPhysicianName
(0010,0010) PN [GARCIA^MARIA^L]       #  PatientName
(0010,0020) LO [12345]                #  PatientID
(0010,0030) DA [19840312]             #  PatientBirthDate
(0010,1000) LO [99887]                #  OtherPatientIDs  <- the sneaky one

# Strip/replace with dcmodify (gdcmanon & pydicom do this better at scale):
dcmodify -nb \\
  -m "PatientName=ANON^7F3A" -m "PatientID=ANON7F3A" \\
  -m "PatientBirthDate=19840101" \\
  -e "AccessionNumber" -e "OtherPatientIDs" \\
  -e "ReferringPhysicianName" -e "InstitutionName" \\
  study/img37.dcm

# AFTER:
(0010,0010) PN [ANON^7F3A]            #  PatientName
(0010,0020) LO [ANON7F3A]             #  PatientID

# But header-cleaning alone is NOT de-identification:
#  1. Ultrasound/CR often BURN patient name INTO THE PIXELS.
#  2. Private tags (odd groups) hide vendor copies of demographics.
#  3. UIDs must be REMAPPED (consistently!) -- they encode device+time,
#     and unchanged UIDs let anyone rejoin your data to the original.`,
      lang: "dicom",
      walkthrough: [
        "**PHI** is any health data linkable to a person — name, MRN, birth date, but also device serials, exact dates, and rare-disease + zip-code combinations. Both HIPAA (US) and GDPR (EU) treat it as radioactive; 'we anonymized it' is a technical claim you must be able to defend.",
        "**The standard has an answer**: DICOM PS3.15 Annex E defines de-identification profiles — a canonical list of which tags to remove, replace or keep. Serious tools (gdcm's `gdcmanon`, pydicom-based pipelines, CTP) implement these profiles; ad-hoc tag deletion always misses something.",
        "**`dcmodify -m` vs `-e`** — modify (replace value) vs erase (remove element). We **replace** PatientName/ID with a pseudonym so the study stays internally consistent, and **erase** what nothing downstream needs. `-nb` skips backup files.",
        "**Trap 1 — burned-in pixels**: ultrasound and secondary captures render the name into the image itself. Check `(0028,0301) BurnedInAnnotation` (when present) and **look at the pixels** — header tools cannot save you here; you need masking.",
        "**Trap 2 — private tags**: odd-numbered groups carry vendor secrets, sometimes including duplicate demographics. Safe posture for research export: drop all private tags unless a named tag is proven needed.",
        "**Trap 3 — UIDs**: they must change (they fingerprint device and time) but **consistently** — every instance of a study must get the same new StudyInstanceUID or the study shatters into 400 one-image studies. Real anonymizers keep a UID map.",
        "**In transit**: classic DICOM and MLLP are plaintext. Inside one hospital they live in isolated VLANs; the moment traffic crosses sites you need TLS — DICOM defines TLS profiles (dcmtk's `+tls`), HL7 rides stunnel/VPN, DICOMweb inherits HTTPS. Teleradiology without TLS is malpractice.",
      ],
      exercise:
        "Take one sample study (3+ files) and de-identify it properly:\n" +
        "  1. dcmdump one file; list every tag you consider PHI (aim for 10+).\n" +
        "  2. Anonymize all files with consistent pseudonym AND consistent new UIDs\n" +
        "     (gdcmanon --dumb with a UID map, or a 15-line pydicom script).\n" +
        "  3. Re-dump and verify: no name, no MRN, no accession, same-study UIDs still match.\n" +
        "  4. Load into any viewer and check the pixels for burned-in text.",
      drills: [
        "Name the three places PHI hides beyond the obvious patient tags.",
        "Why must UID remapping be consistent within a study? What breaks otherwise?",
        "Your research partner asks for 'the raw files, headers untouched, it's fine'. What do you send instead, and which standard section do you cite?",
        "Which of the course's three wire protocols (MLLP, DIMSE, DICOMweb) encrypts by default?",
      ],
      note:
        "De-identification is **risk reduction**, not magic: dates, rare conditions and skull-surface " +
        "renders from head CTs can all re-identify. Research releases pair technical stripping with " +
        "governance (DUAs, ethics approval). The engineering habit to keep: treat every DICOM file " +
        "and HL7 message as PHI until a process — not a hunch — says otherwise.",
    },
  ],
};
