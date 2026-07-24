/* =====================================================================
   Carino Learn — course: Quantum Computing  (qubits, gates & the RSA countdown)
   Goal: take a working programmer with zero physics from "what is a
   qubit?" to walking amplitudes through Deutsch-Jozsa by hand, running
   Grover and a Bell pair in Qiskit, and understanding exactly why the
   Cryptography course ends with Kyber and Dilithium.
   Same beginner-first contract as the other modules: every stage has a
   line-by-line `walkthrough` and small `drills`.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["quantum"] = {
  id: "quantum",
  title: "Quantum Computing",
  tag: "qubits, gates & the RSA countdown",
  icon: "atom",
  blurb: "Qubits, gates and interference from zero — why Shor and Grover force the post-quantum migration, and what 2026 hardware honestly does.",
  intro:
    "You already built the punchline: the Lamport one-time-signature demo on hash.carino.systems exists " +
    "because somebody, someday, may run **Shor's algorithm** against RSA — and the Cryptography course ended " +
    "with Kyber and Dilithium for the same reason. This course supplies the missing WHY. Thirteen stages take " +
    "you from a single amplitude pair to gates, entanglement, interference-choreography, Grover, Shor, and an " +
    "honest look at 2026 hardware — no physics degree, no linear-algebra ambush, and **no `tries all answers " +
    "at once` hand-waving**: you will see that interference, not parallelism, is the actual engine. Everything " +
    "runnable runs free on your own machine with Qiskit's simulator.",
  meta: [["Stack", "amplitudes · gates · Qiskit"], ["Why now", "harvest-now-decrypt-later"], ["Style", "amplitudes as arrows"]],

  tracks: [
    { id: "rules",  label: "The rules of the game",  stages: [0, 1, 2, 3] },
    { id: "gates",  label: "Computing with qubits",  stages: [4, 5, 6, 7] },
    { id: "famous", label: "The famous algorithms",  stages: [8, 9] },
    { id: "real",   label: "Reality & defense",      stages: [10, 11, 12] },
  ],

  reference: [
    {
      kind: "table",
      title: "Gate cheat-sheet",
      head: ["gate", "matrix", "what it does"],
      rows: [
        ["X",       "[[0,1],[1,0]]",              "NOT: swaps the |0⟩ and |1⟩ amplitudes"],
        ["Z",       "[[1,0],[0,−1]]",             "phase flip: negates the |1⟩ amplitude, probabilities untouched"],
        ["H",       "1/√2 · [[1,1],[1,−1]]",      "makes/unmakes superposition; the interference workhorse"],
        ["S",       "[[1,0],[0,i]]",              "quarter phase turn (√Z); i = the 90° arrow rotation"],
        ["T",       "[[1,0],[0,e^(iπ/4)]]",       "eighth phase turn (√S); the expensive gate in error-corrected machines"],
        ["CNOT",    "4×4: identity on 00/01, swaps 10↔11", "flips the target wherever the control is |1⟩; the entangler"],
        ["CZ",      "4×4: diag(1,1,1,−1)",        "negates only the |11⟩ amplitude; symmetric — no real control/target"],
        ["SWAP",    "4×4: swaps 01↔10",           "exchanges two qubits' states (3 CNOTs in a trench coat)"],
        ["Toffoli", "8×8: swaps 110↔111",         "CCNOT — AND gate made reversible; classical logic lives inside quantum"],
      ],
      foot: "H, S, T and CNOT together are **universal**: any quantum computation compiles down to just these.",
    },
    {
      kind: "table",
      title: "Algorithm scoreboard",
      head: ["algorithm", "speedup", "breaks / helps what", "qubits needed (ballpark)"],
      rows: [
        ["Shor (factoring / discrete log)", "exponential → polynomial", "breaks RSA, DH, ECDH, ECDSA — all deployed public-key crypto", "~2n+3 logical for n-bit RSA ≈ 4,100 logical ≈ millions physical"],
        ["Grover (unstructured search)",    "quadratic: N → √N",        "halves symmetric-key security bits: AES-128 → 64-ish",         "thousands logical, but the depth (sequential steps) is the killer"],
        ["Quantum simulation",              "exponential (for quantum systems)", "helps chemistry, materials, drug candidates — the near-term hope", "hundreds to thousands of good logical qubits"],
        ["QFT / phase estimation",          "building block",           "the engine inside Shor; reads out periods hiding in amplitudes",  "scales with problem size; needs error correction"],
        ["VQE / QAOA (heuristics)",         "unproven",                 "maybe optimization/ML someday; no guaranteed speedup exists",     "runs on NISQ hardware today — which is exactly why it is popular"],
      ],
      foot: "Rule of thumb: **proved speedups need error correction; NISQ-runnable things have no proved speedup.** That tension is the whole 2026 story.",
    },
    {
      kind: "table",
      title: "Quantum vs post-quantum vocabulary",
      head: ["term", "what it actually means"],
      rows: [
        ["PQC (post-quantum crypto)", "classical algorithms (Kyber, Dilithium, SPHINCS+) that run on today's CPUs but resist quantum attack — software update, not new hardware"],
        ["QKD (quantum key distribution)", "using quantum physics itself to exchange keys over fiber — special hardware, short range, NOT the same thing as PQC and not what NIST standardized"],
        ["Logical qubit", "one error-corrected, dependable qubit — built out of ~100–1,000 noisy physical qubits"],
        ["Physical qubit", "one actual hardware two-level system, noisy and short-lived; press releases count these"],
        ["NISQ", "Noisy Intermediate-Scale Quantum — the current era: 100s–1,000s of physical qubits, no full error correction"],
        ["Quantum advantage", "beating the best known classical algorithm at one specific task — not general speedup"],
        ["Harvest now, decrypt later", "recording today's encrypted traffic to decrypt once a big quantum computer exists — the reason PQC migration cannot wait"],
        ["Superposition", "a weighted combination of basis states with signed/complex amplitudes — NOT `being both values at once`"],
      ],
      foot: "When a vendor says **quantum-safe**, ask which one they mean: PQC (software, standardized) or QKD (hardware, niche).",
    },
    {
      kind: "cmds",
      title: "Run real circuits today",
      rows: [
        ["Install the toolkit",          "pip install qiskit qiskit-aer"],
        ["Check the version (want 1.x+)","python -c \"import qiskit; print(qiskit.__version__)\""],
        ["Minimal Bell pair, simulated", "python -c \"from qiskit import QuantumCircuit, transpile; from qiskit_aer import AerSimulator; qc=QuantumCircuit(2,2); qc.h(0); qc.cx(0,1); qc.measure([0,1],[0,1]); s=AerSimulator(); print(s.run(transpile(qc,s), shots=1000).result().get_counts())\""],
        ["Draw a circuit in the terminal","python -c \"from qiskit import QuantumCircuit; qc=QuantumCircuit(2); qc.h(0); qc.cx(0,1); print(qc.draw())\""],
        ["Real hardware, free tier",     "sign up at quantum.ibm.com  ->  pip install qiskit-ibm-runtime  ->  submit the same circuit to a real backend"],
      ],
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "Why quantum computers exist",
      tag: "Feynman's dare",
      time: "30–40 min",
      payoff:
        "Quantum computing has a creation myth ('transistors are running out!') and a real origin " +
        "story, and telling them apart inoculates you against 90% of the hype you will read. The real " +
        "reason is that nature itself runs on exponentially expensive math, and Feynman noticed that " +
        "only a quantum machine can afford it. Get this straight and 'quantum advantage' stops being a " +
        "marketing phrase and becomes a precise, checkable claim.",
      concepts: ["exponential state space", "Feynman 1981", "quantum simulation", "quantum advantage", "the honest 2026 scoreboard", "what QC is NOT for"],
      code:
`WHY BUILD A QUANTUM COMPUTER AT ALL?

  the popular story (wrong):
     "transistors are hitting atomic limits, so quantum computers
      will keep Moore's law going"
     -> no. a quantum computer is not a faster classical computer.
        for ordinary code it is slower, colder, and absurdly expensive.

  the real story (Feynman, 1981):
     nature is quantum, and simulating quantum systems classically
     costs EXPONENTIAL memory. n interacting particles need 2^n numbers:

       n = 10    2^10  =            1,024 amplitudes    trivial
       n = 30    2^30  ≈    1,000,000,000 amplitudes    ~8 GB of RAM
       n = 50    2^50  ≈             10^15               a supercomputer, barely
       n = 300   2^300 ≈             10^90               more numbers than atoms
                                                         in the observable universe

     Feynman's dare: "Nature isn't classical, dammit, and if you want
     to make a simulation of nature, you'd better make it quantum
     mechanical." Build hardware that IS quantum, and the bookkeeping
     is free — the universe does it natively.

  WHAT "QUANTUM ADVANTAGE" ACTUALLY MEANS
     beating the BEST KNOWN classical algorithm at ONE specific task.
     never "faster at everything" (stage 12 buries that myth properly).

  THE HONEST SCOREBOARD, 2026
     contrived sampling stunts     claimed, disputed, re-claimed — a cycle
     chemistry / materials         promising small demos, no killer result yet
     factoring RSA-2048            nowhere close: the largest honest Shor
                                   factorization is still a two-digit number
     your web apps, DBs, most ML   no advantage expected. ever. that's fine.`,
      lang: "txt",
      walkthrough: [
        "**The transistor story is a category error.** Shrinking transistors makes classical computers faster at classical steps. A quantum computer does not do classical steps faster — it does a **different kind of step** (amplitude arithmetic, stage 2) that classical machines can only imitate at exponential cost.",
        "**The 2^n table is the whole argument.** A system of n quantum particles is described by one amplitude per possible configuration — 2^n of them, all needed at once. Classical simulation must store and update every single one; at n = 50 the world's biggest machines wheeze, at n = 300 the universe runs out of atoms to write with.",
        "**Feynman's move was jujitsu**: if the bookkeeping is the problem, build the computer out of the thing being simulated. A quantum machine with n qubits **is** a 2^n-amplitude object physically — no RAM required, the state just exists.",
        "**Quantum advantage is task-specific by definition.** The claim is always 'for THIS problem, the quantum machine beats the best classical algorithm we know'. Both halves matter: classical algorithms improve too, and several early advantage claims were later matched by better classical tricks — that is science working, not scandal.",
        "**The 2026 state of play, without spin**: machines with hundreds-to-thousands of noisy physical qubits exist (stage 10); error-corrected logical qubits exist in single digits to low tens; nothing cryptographically relevant has been factored. The threat to RSA is a **timeline**, not a today-problem — but stage 9 explains why you must act on timelines.",
        "**Know the non-goals now**: quantum computers will not speed up your compiler, your SQL joins, or serving web pages. The course ends (stage 12) with the honest map of what they are for: simulation, some algebra, cryptanalysis — and that short list is still world-changing.",
      ],
      exercise:
        "Without looking at the code block:\n" +
        "  1. Write down the wrong origin story and the right one, one sentence each.\n" +
        "  2. Compute how many amplitudes 20 qubits need, and how much RAM that is\n" +
        "     at 16 bytes per amplitude. Repeat for 40 qubits.\n" +
        "  3. Define quantum advantage in one sentence that includes the phrase\n" +
        "     'best known classical algorithm'.\n" +
        "  4. List three computing tasks you do daily that will never benefit.",
      drills: [
        "Why is 'quantum computers will replace classical computers' wrong on its face?",
        "What breaks first when you simulate 50 entangled particles classically — CPU or memory? Why?",
        "A press release says 'our 1,000-qubit chip outperforms all supercomputers'. What two questions expose whether that means anything?",
        "What was Feynman actually proposing to compute — factoring, or something else?",
      ],
      note:
        "The 2^n numbers assume the particles can **entangle** (stage 3). Unentangled qubits factor into " +
        "n independent little states — 2n numbers, simulable on a phone. Entanglement is what turns the " +
        "state space exponential, which is why it shows up in this course as **the** resource, not a spooky " +
        "side effect.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "The qubit: two amplitudes, one bit out",
      tag: "superposition & the Born rule",
      time: "40–60 min",
      payoff:
        "Everything in this course reduces to one data structure: a pair of amplitudes with the rule " +
        "that squares sum to one. Learn how measurement converts amplitudes into a single classical " +
        "bit — and why the beloved 'coin spinning in the air' picture is not just imprecise but " +
        "actually wrong — and stages 2 through 9 become arithmetic instead of mysticism.",
      concepts: ["amplitude pair (a, b)", "normalization a²+b²=1", "superposition", "measurement collapse", "Born rule: probability = amplitude²", "why the coin analogy fails"],
      code:
`  A CLASSICAL BIT                    A QUBIT
  is 0 or 1. one of them.            is a PAIR of amplitudes  (a, b)
                                       a = the |0⟩ amplitude
                                       b = the |1⟩ amplitude
                                       rule:  a² + b² = 1

  some legal qubit states:
    |0⟩          = (1, 0)             reads 0, always
    |1⟩          = (0, 1)             reads 1, always
    |+⟩          = (0.707, 0.707)     50/50
    |−⟩          = (0.707, −0.707)    ALSO 50/50 — but a DIFFERENT state
    (0.6, 0.8)                        36% zero, 64% one

  THE BORN RULE — the only exit door
    measuring a qubit in state (a, b):
      you get 0 with probability a²
      you get 1 with probability b²
      and the state COLLAPSES to what you saw:
        got 0 -> state is now (1, 0).  the old amplitudes are gone.
    you never, ever see a or b directly. one classical bit per qubit
    per measurement. that's the whole readout budget.

  WHY "A COIN SPINNING IN THE AIR" IS THE WRONG PICTURE
    a spinning coin IS heads or tails already — you just don't know
    which. that is ignorance: one probability number, always positive.
    a qubit is an amplitude pair, and amplitudes carry SIGNS.
    |+⟩ and |−⟩ have identical probabilities (50/50) yet behave
    completely differently the moment they interfere (stage 2 shows
    them split apart deterministically). no not-yet-revealed-value
    story can reproduce that. the sign is physically real.`,
      lang: "txt",
      walkthrough: [
        "**The state is the pair, not the outcome.** A qubit in state (0.6, 0.8) is not 'secretly 0 or secretly 1'. The pair (0.6, 0.8) is the complete physical description — the machine's actual configuration between measurements.",
        "**Normalization** a² + b² = 1 is just 'probabilities must sum to 1' pushed one level down. Every legal state lives on a circle of radius 1 — which is why the headline lab above draws your qubit as a point on a dial.",
        "**The Born rule is the bridge** between the quantum world (amplitudes) and yours (bits): probability = amplitude squared. Squaring is why a negative amplitude gives the same probability as a positive one — and why |+⟩ = (0.707, 0.707) and |−⟩ = (0.707, −0.707) are indistinguishable to a naive measurement.",
        "**Collapse is destructive and final.** Measure (0.707, 0.707), get 0, and the state is now (1, 0). Measure it a hundred more times: 0 every time. The superposition is spent. This single fact shapes all quantum algorithm design — you get one sample per run, so the circuit must make the answer **likely** before you look (stage 7 is exactly that craft).",
        "**Run it, don't trust me**: in the headline lab, press H then Measure repeatedly (Reset + H + Measure). You'll see roughly half zeros, half ones — the Born rule as a histogram. Then press Run 100 shots and watch the statistics settle around 50/50.",
        "**The coin autopsy, precisely**: a coin's uncertainty is one number p ≥ 0, and any two 50/50 coins are the same coin. Qubits have two 50/50 states — |+⟩ and |−⟩ — that later evolve to **opposite deterministic outcomes**. Probabilities can't be negative, so they can't cancel; amplitudes can. That cancellation is next stage's whole show.",
        "**Vocabulary check**: 'superposition' just means the state has more than one nonzero amplitude. It does not mean the qubit 'is both 0 and 1'. It is a third kind of thing — an amplitude-weighted combination that will pick a side only when measured.",
      ],
      exercise:
        "Work by hand, then check yourself in the headline lab:\n" +
        "  1. Which of these are legal states? (0.5, 0.5), (0.8, 0.6), (1, 1), (0.707, -0.707)\n" +
        "  2. For each legal one, give P(0) and P(1).\n" +
        "  3. State (0.6, 0.8) is measured and gives 1. Write the state after collapse,\n" +
        "     and P(0) for a second measurement.\n" +
        "  4. Explain in two sentences why (0.707, 0.707) and (0.707, -0.707) are\n" +
        "     different states even though every measurement statistic here matches.",
      drills: [
        "Recite the Born rule from memory, including what happens to the state afterward.",
        "Why is (0.5, 0.5) not a legal qubit state, and what is the nearest legal one?",
        "How many classical bits of information can you extract from one qubit by measuring it? (One. Why does the 2-amplitude description not contradict that?)",
        "A blog says 'a qubit stores infinite information because amplitudes are continuous'. What is wrong with that claim in practice?",
        "In the headline lab: what sequence of button presses prepares |−⟩ from |0⟩? (Two gates.)",
      ],
      note:
        "Full disclosure for later: amplitudes are **complex** numbers in general, so a qubit is really " +
        "(a, b) with each a little 2D arrow. This course keeps amplitudes real (signed numbers) until phase " +
        "genuinely matters, which covers every algorithm we walk through — X, Z, H and CNOT never create " +
        "complex values from real ones. When S and T gates appear in the reference card, that is where the " +
        "full arrows live.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "Interference: negative arrows cancel",
      tag: "the actual computational resource",
      time: "40–60 min",
      payoff:
        "This is the most important stage in the course. Quantum computers do not work by 'trying " +
        "everything at once' — they work by steering many amplitude paths so that wrong answers " +
        "arrive with opposite signs and cancel, while the right answer's paths add up. Once you see " +
        "cancellation happen in a two-path experiment, every famous algorithm becomes a variation on " +
        "one trick: choreograph the interference.",
      concepts: ["signed amplitudes", "constructive interference", "destructive interference", "Mach-Zehnder interferometer", "path amplitudes add", "why probabilities alone can't do this"],
      code:
`        MACH-ZEHNDER: one photon, two paths, one giant lesson

                     mirror
                   +--------+
        path A    /          \\
                 /            \\                 detector D0
  photon --> [BS1]            [BS2] ==========>  (all of them!)
                 \\            /
        path B    \\          /                  detector D1
                   +--------+                    (silence)
                     mirror

  BS = 50/50 beam-splitter: transmit or reflect, amplitude 0.707 each.
  after BS1 the photon is in a superposition of "took A" and "took B".

  at BS2 the two paths RECOMBINE. amplitudes for each detector add:

    amplitude(D0) = (path A contribution) + (path B contribution)
                  =  0.5 + 0.5  = 1.0     -> P(D0) = 100%   they ADD
    amplitude(D1) =  0.5 − 0.5  = 0.0     -> P(D1) =   0%   they CANCEL

  (the minus sign comes from reflection bookkeeping at the splitters —
   one path picks up a sign flip on the D1 route. exact convention
   doesn't matter; the OPPOSITE SIGNS do.)

  NOW BLOCK PATH B WITH YOUR HAND:
    half the photons hit your hand. the survivors reach BS2 by path A
    only — nothing left to cancel with:
      P(D0) = 25%     P(D1) = 25%     (+ 50% absorbed)

    READ THAT AGAIN: removing a path made D1 fire. taking away an
    option INCREASED an outcome's probability — impossible for any
    probability-only story, trivial for signed amplitudes.

  the quantum computing recipe hiding in this diagram:
    1. split into many paths          (H gates, stage 4)
    2. let paths pick up signs        (the oracle / problem structure)
    3. recombine so wrong answers     (H gates again)
       cancel and right answers add
    4. measure — the survivor is likely the answer`,
      lang: "txt",
      walkthrough: [
        "**Amplitudes are arrows, and arrows can point opposite ways.** When two paths lead to the same outcome, you add their amplitudes first, then square the sum. Same signs: (0.5 + 0.5)² = 1. Opposite signs: (0.5 − 0.5)² = 0. Probability arithmetic — squaring first, then adding — could never produce that zero.",
        "**D1's silence is not absorption or blocking** — both paths individually would happily reach D1 (block either one and D1 fires!). D1 is silent because two live possibilities annihilate. This is the single weirdest and most useful fact in the field.",
        "**The blocked-path experiment is your proof kit.** Any 'the photon really took one path, we just don't know which' theory predicts blocking path B can only remove photons from detectors, never add them. Reality: D1 goes from 0% to 25%. Hidden-single-path stories die here.",
        "**See it yourself right now** in the headline lab: Reset, press H (state becomes (0.707, 0.707) — the split), press H again — the state returns to exactly (1, 0), i.e. |0⟩, with **zero** probability of 1. The two paths into |1⟩ carried opposite signs and canceled: H-H is the Mach-Zehnder in two button presses. Then try X, H, H, X — and for the real treat, H on |1⟩: you get (0.707, −0.707), same 50/50 probabilities as |+⟩, but a second H sends it back to |1⟩, not |0⟩. The **sign steered the outcome**.",
        "**The four-step recipe at the bottom is the whole industry.** Deutsch-Jozsa (stage 7) is the recipe verbatim. Grover (stage 8) is steps 2–3 in a loop. Shor (stage 9) is the recipe with a Fourier transform as step 3. Learn the recipe once, recognize it forever.",
        "**Correcting the famous lie**: 'a quantum computer tries all answers in parallel' — the first half is defensible (superposition does contain a term per answer), but the conclusion is wrong because **measurement gives you one random term**, not all of them. Reading a superposition is a lottery. The skill is rigging the lottery beforehand with interference so the winning ticket is nearly certain. Parallelism is free; making it useful is the algorithm.",
      ],
      exercise:
        "Amplitude bookkeeping by hand:\n" +
        "  1. Two paths reach outcome X with amplitudes 0.5 and 0.5; two paths reach\n" +
        "     outcome Y with amplitudes 0.5 and -0.5. Compute P(X) and P(Y).\n" +
        "  2. Now block one path (remove one 0.5 from each outcome). Recompute both.\n" +
        "     Which outcome got MORE likely?\n" +
        "  3. In the headline lab, predict the exact state after each press of the\n" +
        "     sequence H, Z, H starting from |0⟩ — three states, written as pairs.\n" +
        "     Then run it. (You should land exactly on |1⟩.)\n" +
        "  4. Explain step 3's result in one sentence using the word 'sign'.",
      drills: [
        "Why can probabilities never cancel, and what property of amplitudes allows it?",
        "In the interferometer, what does blocking a path do to P(D1), and why does that kill 'it secretly took one path' explanations?",
        "H then H returns any basis state to itself. Which outcome's paths canceled when you start from |0⟩?",
        "Recite the four-step interference recipe and name which stage of this course implements each famous variant.",
        "A colleague says quantum speedup comes from parallel evaluation. Give the two-sentence correction.",
      ],
      note:
        "The H-Z-H sandwich you built in the exercise is worth remembering: it turns a **phase** flip (Z, " +
        "invisible to measurement) into a **bit** flip (X, maximally visible). Algorithms constantly use H " +
        "to convert information hidden in signs into information sitting in probabilities — that conversion " +
        "IS the readout trick of Deutsch-Jozsa and the reason Grover's oracle only needs to flip a sign.",
    },
    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Entanglement: correlation without copies",
      tag: "the Bell pair",
      time: "40–60 min",
      payoff:
        "Entanglement is what makes n qubits worth 2^n amplitudes instead of 2n, and it is the most " +
        "misreported phenomenon in physics. After this stage you will know exactly what a Bell pair " +
        "does (perfect correlation), what it cannot do (send signals), and why 'two synced coins' " +
        "fails as an explanation — plus why monogamy of entanglement quietly underwrites both " +
        "quantum error correction and QKD.",
      concepts: ["joint state = 4 amplitudes", "Bell pair (|00⟩+|11⟩)/√2", "perfect correlation", "no-signaling", "Bell/CHSH tests", "monogamy of entanglement", "why 2^n needs entanglement"],
      code:
`  TWO QUBITS = FOUR AMPLITUDES, one per joint outcome

     outcome     00      01      10      11
     amplitude   a00     a01     a10     a11        (squares sum to 1)

  THE BELL PAIR   (|00⟩ + |11⟩)/√2
     amplitude   0.707   0       0       0.707

  measure both qubits:
     P(00) = 0.5     P(11) = 0.5     P(01) = P(10) = 0

  each qubit ALONE is a fair coin. TOGETHER they always agree —
  even if one is measured in Guadalajara and the other on the Moon.

  WHAT IT IS NOT
   ✗ not communication. Alice sees a random bit. Bob sees a random
     bit. neither can influence or detect anything from the other's
     side. only when the two logs are brought together (classically,
     at light speed or slower) does the correlation appear.
   ✗ not two synced coins. coins that agreed in advance ("both heads
     today") reproduce THIS table perfectly fine. the difference only
     shows when you measure in TILTED bases: quantum correlations
     then exceed the hard ceiling (CHSH: 2) that every possible
     pre-agreement obeys, hitting 2√2 ≈ 2.83. tested for 40 years,
     loophole-free since 2015, Nobel Prize 2022. no local hidden
     story survives.

  WHY COMPUTING NEEDS IT
     n unentangled qubits = n separate (a,b) pairs = 2n numbers.
     n ENTANGLED qubits   = one joint list of 2^n amplitudes that
     cannot be factored apart. entanglement is what makes the state
     space exponential — Feynman's 2^n from stage 0, made real.

  MONOGAMY
     if A and B are maximally entangled, NEITHER can be entangled
     with anything else. eavesdroppers in QKD get caught because
     listening = entangling = degrading the A-B correlation.`,
      lang: "txt",
      walkthrough: [
        "**Upgrade your data structure**: one qubit was a pair, two qubits are a 4-vector of amplitudes indexed by joint outcomes 00, 01, 10, 11. Three qubits: 8. The list is over **joint** outcomes — that is the exponential doubling, and it only pays off when the vector can't be split into per-qubit factors.",
        "**The Bell pair's table is brutally simple**: half the time both say 0, half the time both say 1, never a disagreement. The mini-lab below simulates the honest 4-amplitude state — run 500 pairs and watch 01 and 10 stay at exactly zero.",
        "**Try to factor it and fail**: is there a qubit-A state (a, b) and qubit-B state (c, d) with a·c = 0.707, a·d = 0, b·c = 0, b·d = 0.707? From a·d = 0, either a = 0 (kills a·c) or d = 0 (kills b·d). No factoring exists — the pair has a joint state but **no individual states**. That is the definition of entangled.",
        "**No-signaling, concretely**: whatever Bob does — measure, not measure, measure in a rotated basis — Alice's own statistics remain a fair coin. The correlation lives only in the **comparison** of records, and comparing requires a classical channel. Entanglement + no classical channel = zero bits transmitted. Every faster-than-light headline you have ever read gets this wrong.",
        "**Why synced coins die**: for the plain table above, 'we flipped one coin this morning and both memorized it' works fine. Bell's 1964 insight: measure each side in one of two tilted bases chosen randomly, and score agreements. **Every** pre-agreed strategy — any local hidden variable theory, however baroque — is mathematically capped at a CHSH score of 2. Quantum mechanics predicts and experiments deliver 2√2. The mini-lab namechecks this honestly rather than simulating it; the point to retain is that the correlations are provably not pre-agreement.",
        "**Monogamy is the enforcement mechanism you already met in crypto**: maximal A-B entanglement leaves nothing for Eve. In QKD (reference card: quantum vs post-quantum vocabulary), an eavesdropper must interact with the flying qubit, which entangles her with it, which measurably weakens the A-B statistics. Detection is physics, not luck.",
        "**For the road**: entanglement is a **resource** — created by two-qubit gates (stage 5's CNOT), consumed by algorithms and teleportation, destroyed by decoherence (stage 10, where the environment 'measures' your qubits without asking).",
      ],
      exercise:
        "Using the 4-amplitude vector (0.707, 0, 0, 0.707):\n" +
        "  1. Alice measures her qubit and gets 1. Write the collapsed joint state and\n" +
        "     P(Bob measures 1) afterward.\n" +
        "  2. Show the factoring attempt from the walkthrough fails: write the four\n" +
        "     equations a·c=0.707, a·d=0, b·c=0, b·d=0.707 and derive the contradiction.\n" +
        "  3. Is (0.5, 0.5, 0.5, 0.5) entangled? Try to factor it. (Hint: it factors —\n" +
        "     into which two single-qubit states?)\n" +
        "  4. In the mini-lab, run 500 pairs in quantum mode and 500 in classical-coins\n" +
        "     mode. Which columns of the counts table tell the two modes apart?",
      drills: [
        "Why can't Alice send Bob a message by choosing whether to measure her half?",
        "State the monogamy rule and name the security protocol whose eavesdropper-detection leans on it.",
        "What is the CHSH classical ceiling, what does quantum mechanics achieve, and what class of theories does the gap eliminate?",
        "How many amplitudes describe 10 entangled qubits? 10 unentangled qubits?",
        "The state (0.5, 0.5, 0.5, 0.5): entangled or not, and what does your answer imply about H⊗H on |00⟩?",
      ],
      note:
        "The 2022 Nobel Prize (Aspect, Clauser, Zeilinger) was for exactly the experiments in this stage's " +
        "code block — closing the loopholes in Bell tests. It is genuinely settled science: the universe " +
        "does not run on local pre-agreed values. When you build the Bell pair yourself in stage 5 with two " +
        "gates and eight lines of Python, remember that this little histogram carries a Nobel's worth of " +
        "philosophy.",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "Single-qubit gates: rotations, not instructions",
      tag: "X · H · Z, as matrices",
      time: "45–60 min",
      payoff:
        "Gates are to qubits what instructions are to registers — except every gate is a rotation of " +
        "the amplitude arrow, which makes all of them reversible and none of them able to copy. " +
        "Master just three matrices (X, H, Z) and you can hand-compute every circuit in this course; " +
        "this stage also gets Qiskit onto your machine so the computer checks your arithmetic.",
      concepts: ["gate = matrix on amplitudes", "X (NOT)", "H (superposition maker)", "Z (phase flip)", "reversibility / unitarity", "no-cloning theorem", "Qiskit Statevector"],
      code:
`# pip install qiskit qiskit-aer          (Python 3.10+, five minutes)
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(1)
print(Statevector(qc))     # [1, 0]            we start in |0⟩

qc.h(0)                    # H: split into superposition
print(Statevector(qc))     # [0.707, 0.707]    this is |+⟩

qc.z(0)                    # Z: flip the sign of the |1⟩ amplitude
print(Statevector(qc))     # [0.707, -0.707]   now |−⟩ — probabilities unchanged!

qc.h(0)                    # H again: recombine the paths
print(Statevector(qc))     # [0, 1]            |1⟩, with certainty.
                           # H·Z·H acted exactly like X. interference, on tap.

# The three matrices — columns say where |0⟩ and |1⟩ go.
# apply to a state by matrix-vector multiplication on (a, b):
#
#   X = [[0, 1],       X(a, b) = (b, a)        swap: the classical NOT
#        [1, 0]]
#
#   Z = [[1,  0],      Z(a, b) = (a, -b)       sign-flip the |1⟩ path:
#        [0, -1]]                              NO classical analogue at all
#
#   H = 0.707 * [[1,  1],   H(a, b) = (0.707(a+b), 0.707(a-b))
#                [1, -1]]                      mixer: makes AND unmakes
#                                              superposition (H·H = identity)`,
      lang: "py",
      walkthrough: [
        "**A gate is a 2×2 matrix multiplying the amplitude pair.** No control flow, no side effects: new_a = row1 · (a, b), new_b = row2 · (a, b). You can do every computation in this course with pencil arithmetic on pairs — and should, at least once per stage.",
        "**X is the familiar one**: swap the amplitudes. On basis states it is classical NOT (|0⟩ ↔ |1⟩); on (0.6, 0.8) it gives (0.8, 0.6). Nothing spooky.",
        "**Z is the new species**: negate b, leave a. Measurement probabilities (a², b²) don't change at all, so Z is **invisible** to an immediate measurement — yet H·Z·H behaved like X in the code. Z writes information into the sign, where only interference can read it. Oracles in Grover and Deutsch-Jozsa are just conditional Z's.",
        "**H is the mixer**: it sends |0⟩ → (0.707, 0.707) and |1⟩ → (0.707, −0.707) — note the minus: H remembers where you came from in the sign. And H·H = identity, which you proved by button-mashing in stage 2: apply the matrix twice and the cross terms cancel.",
        "**Rotations, literally**: on the real-amplitude circle from the headline lab, X is a reflection across the diagonal, Z a reflection across the horizontal axis, H a reflection across the 22.5° line. All rigid motions of the arrow — length always 1, normalization free of charge.",
        "**Reversibility is not optional**: quantum mechanics only allows unitary (length-preserving, invertible) matrices, so every gate has an undo (X, Z, H are each their own). There is no AND gate eating two qubits and emitting one — irreversible operations destroy amplitude information, and only **measurement** is allowed to do that.",
        "**No-cloning drops out of the same math**: a hypothetical COPY gate would need to be linear AND satisfy copy(a·|0⟩ + b·|1⟩) = (a|0⟩+b|1⟩)(a|0⟩+b|1⟩) — but linearity forces a|00⟩ + b|11⟩ instead (a Bell pair, not a copy!). Unknown quantum states cannot be duplicated. This is why quantum money and QKD work, and why error correction (stage 10) has to be brilliant instead of just keeping backups.",
        "**Qiskit habits from day one**: build a `QuantumCircuit`, inspect with `Statevector(qc)` while learning (the simulator hands you the amplitudes — real hardware never can), and read `print(qc.draw())` to see the circuit diagram grow.",
      ],
      exercise:
        "By hand first, then verify each with Statevector in Python:\n" +
        "  1. Compute X, then Z, then H applied to (0.6, 0.8) — three separate results.\n" +
        "  2. Compute the full sequence H, Z, H starting from |1⟩. Which basis state lands?\n" +
        "  3. Show by matrix arithmetic that H(H(a, b)) = (a, b) for any a, b.\n" +
        "  4. Predict the statevector for: qc.x(0); qc.h(0); qc.z(0); qc.h(0) — then run it.\n" +
        "  5. Try to write a 2x2 matrix that maps BOTH (1,0) to (1,0) and (0.707,0.707)\n" +
        "     to (1,0). What property of matrices makes this impossible?",
      drills: [
        "Write the X, Z and H matrices from memory, and each one's effect on (a, b).",
        "Why does Z change nothing about an immediate measurement, and which gate sandwich makes Z's effect visible?",
        "State the no-cloning theorem and one security protocol that depends on it.",
        "Why can't there be a quantum AND gate mapping two qubits to one?",
        "What does unitarity guarantee about every quantum circuit before measurement? (Reversible, length-preserving — hence deterministic and undoable.)",
      ],
      note:
        "The gates beyond this stage's big three are mostly **finer rotations**: S is a quarter phase turn, " +
        "T an eighth (both need complex amplitudes — the arrows leave the real circle). The deep result " +
        "worth knowing by name is **universality**: H, T and CNOT alone approximate any quantum computation " +
        "to any accuracy, the quantum analogue of NAND-completeness. The reference gate table is your " +
        "cheat-sheet.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "CNOT & circuits: building the Bell pair",
      tag: "two-qubit gates",
      time: "45–60 min",
      payoff:
        "One two-qubit gate — CNOT — is the difference between n lonely qubits and an exponential " +
        "joint state; H plus CNOT builds in two gates the entangled pair that stage 3 philosophized " +
        "about. This stage teaches you to read and write circuit diagrams, walk 4-vectors through " +
        "gates by hand, and run the whole thing in Qiskit with shot statistics.",
      concepts: ["CNOT (control/target)", "CZ", "circuit diagrams", "walking the 4-vector", "H+CNOT = Bell pair", "universal gate sets", "qiskit bit ordering"],
      code:
`# bell.py — entangle two qubits, then look at the statistics
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)
qc.h(0)                       # split qubit 0:   |0⟩ -> (0.707, 0.707)
qc.cx(0, 1)                   # CNOT: flip qubit 1 wherever qubit 0 is |1⟩
qc.measure([0, 1], [0, 1])
print(qc.draw())              # the circuit, in ASCII:
#      ┌───┐     ┌─┐
# q_0: ┤ H ├──■──┤M├───       ■  = control
#      └───┘┌─┴─┐└╥┘┌─┐      (+) = target (drawn as ⊕)
# q_1: ─────┤ X ├─╫─┤M├
#           └───┘ ║ └╥┘
#
# walk the amplitudes by hand — 4-vector ordered (00, 01, 10, 11),
# writing the H'd qubit as the LEFT bit:
#   start          (1,     0,  0,     0    )    pure |00⟩
#   after H        (0.707, 0,  0.707, 0    )    |00⟩ and |10⟩ paths alive
#   after CNOT     (0.707, 0,  0,     0.707)    the |10⟩ amplitude MOVED
#                                               to |11⟩ (control 1 -> flip)
# that final vector is the Bell pair from stage 3. it cannot be
# factored into (qubit A) x (qubit B) — H made a superposition,
# CNOT welded the qubits' fates together.

sim = AerSimulator()
counts = sim.run(transpile(qc, sim), shots=1000).result().get_counts()
print(counts)                 # {'00': ~500, '11': ~500} — never 01, never 10`,
      lang: "py",
      walkthrough: [
        "**CNOT is an if-statement made unitary**: if control is |1⟩, apply X to target; if |0⟩, do nothing. On the 4-vector it simply **swaps the amplitudes** of |10⟩ and |11⟩ (control-1 rows) and leaves |00⟩, |01⟩ alone. Reversible — it is its own inverse — and no measurement happens: the 'if' runs on both branches of the superposition at once.",
        "**Walk the vector, always.** The three-line trace in the code is the skill this stage exists to teach: write the 4-vector, apply H to one qubit (it mixes pairs of entries), apply CNOT (it swaps two entries). Ten minutes of this and circuits stop being diagrams and start being arithmetic.",
        "**Why the result is entangled**: before CNOT the state factors — (0.707, 0.707) ⊗ (1, 0). After CNOT, you proved in stage 3's exercise that (0.707, 0, 0, 0.707) admits no factoring. A **two**-qubit gate acting on a **superposed** control is precisely what entanglement creation requires; no pile of single-qubit gates can ever do it.",
        "**Circuit diagrams read left to right** — time flows rightward, each wire is a qubit, boxes are gates, ■ with a vertical line to ⊕ is CNOT. But the math composes right to left (last gate = leftmost matrix). Everyone trips on this once; now you get to skip that.",
        "**Qiskit's bit-ordering gotcha**, before it bites you: qubit 0 is the **rightmost** character in counts strings. For the Bell pair both bits agree so you can't tell, but tomorrow's circuit will confuse you for an hour unless you remember: `'01'` means qubit 1 = 0, qubit 0 = 1.",
        "**CZ, the sign-flipping sibling**: flip the sign of the |11⟩ amplitude only. No bit moves — pure phase. It is symmetric (no meaningful control vs target) and H on the target converts CZ ↔ CNOT — the stage-2 lesson (H turns phase into bits) now as a two-qubit identity. Grover's N=4 oracle in stage 12 is a bare CZ.",
        "**Universality, stated once**: {H, T, CNOT} can build any quantum computation, exactly like NAND builds all of classical logic. Everything else — Toffoli, SWAP, rotation gates — is convenience notation that the transpiler compiles down. This is why hardware vendors advertise their 'native two-qubit gate' fidelity above all else (stage 10).",
        "**Shots, not statevectors, from here on**: `AerSimulator` + `measure` + `get_counts` is the honest workflow — histograms, like real hardware gives. `Statevector` remains your X-ray for debugging, a luxury physics denies to real machines.",
      ],
      exercise:
        "Pencil, then Qiskit, for each:\n" +
        "  1. Walk the 4-vector for: X on qubit A, then CNOT(A -> B), starting from |00⟩.\n" +
        "     Predict the counts histogram, then run it with 1000 shots.\n" +
        "  2. Walk H on A, CNOT(A->B), then H on A again. (Careful: H now mixes 00 with 10,\n" +
        "     and 01 with 11.) Predict counts; run; explain the four-way split you find.\n" +
        "  3. Build the OTHER Bell state (|01⟩+|10⟩)/sqrt(2) by adding exactly one X gate\n" +
        "     to the bell.py circuit. Verify: counts show only 01 and 10.\n" +
        "  4. Replace cx(0,1) with cz(0,1) in bell.py. Predict the counts before running.\n" +
        "     Why did entanglement seemingly vanish from the histogram?",
      drills: [
        "What does CNOT do to each of the four amplitudes of the joint state?",
        "Why can no collection of single-qubit gates ever create entanglement?",
        "In the Bell circuit, what state exists between H and CNOT? Factored or entangled?",
        "Qiskit prints '10' for a two-qubit measurement. Which qubit is the 1?",
        "Name a universal gate set and the classical analogue of the universality claim.",
      ],
      note:
        "SWAP = three CNOTs back-to-back-to-back (try proving it on the 4-vector — it's a lovely five " +
        "minutes), and Toffoli (CCNOT) makes classical AND reversible by keeping the inputs alongside the " +
        "answer. Toffoli matters historically: it proves any classical computation embeds inside a quantum " +
        "computer, so quantum machines are at least as capable — the question this course keeps asking is " +
        "when they are **more**.",
    },
    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Measurement: statistics is the readout",
      tag: "bases, shots & collapse",
      time: "40–50 min",
      payoff:
        "A quantum computer holds 2^n amplitudes and hands you n measly classical bits per run — " +
        "measurement is the bottleneck every algorithm is designed around. This stage makes you " +
        "fluent in the readout craft: choosing a basis is choosing a question, repeated shots turn " +
        "randomness into estimates, and the deferred-measurement rule tidies every circuit you will " +
        "ever read.",
      concepts: ["Z-basis vs X-basis", "basis choice = question choice", "collapse destroys the rest", "shots & histograms", "expectation values", "deferred measurement principle"],
      code:
`  MEASUREMENT IS THE ONLY WINDOW — and it is a narrow one

    the machine holds:   2^n amplitudes (n qubits)
    one run gives you:   n classical bits. that's it.
    and the state after: collapsed. superposition spent.

  BASIS MATTERS — the same state answers different questions
    "Z-basis" = measure as-is.  "X-basis" = apply H first, then measure.

    state    Z-basis result            X-basis result
    |0⟩      0, always                 0/1, fifty-fifty
    |1⟩      1, always                 0/1, fifty-fifty
    |+⟩      0/1, fifty-fifty          0, always   (|+⟩ is X's own "|0⟩")
    |−⟩      0/1, fifty-fifty          1, always

    Z-basis CANNOT tell |+⟩ from |−⟩. X-basis CANNOT tell |0⟩ from |1⟩.
    choosing a basis = choosing which property you burn everything
    else to learn. (this trade-off IS the security of QKD: an
    eavesdropper who guesses the basis wrong scrambles the state.)

  STATISTICS IS THE READOUT
    one shot of a 50/50 state teaches you almost nothing.
    so: run the identical circuit many times ("shots"), histogram it.

      shots=1000  ->  counts {'00': 493, '11': 507}
      estimate:   P(00) ≈ 0.49, statistical error ~ 1/√shots ≈ 3%

    every real quantum result you will ever see is a histogram.
    "the answer" is a property of the DISTRIBUTION, never of one shot.

  DEFERRED MEASUREMENT (the tidiness theorem)
    measuring mid-circuit and branching on the result classically
    can always be rewritten as: entangle with a fresh qubit now,
    keep everything quantum, measure at the very end. same statistics,
    guaranteed. so: read any circuit as "unitary stuff, THEN
    measurements" without loss of generality.`,
      lang: "txt",
      walkthrough: [
        "**The readout budget is brutal and non-negotiable**: Holevo's theorem (fine to know just by name) proves n qubits can yield at most n classical bits per measurement. The 2^n amplitudes are working memory, not output. Algorithms must funnel their answer into those n bits **before** anyone looks — which is why interference choreography (stage 2's recipe) exists at all.",
        "**A basis is a question, not a knob setting.** Z-basis asks 'are you |0⟩ or |1⟩?'; X-basis asks 'are you |+⟩ or |−⟩?'. Each question has a pair of states it answers with certainty, and the other question's certain states answer it with a coin flip. You cannot ask both — the first answer destroys the material for the second.",
        "**X-basis measurement is just H + Z-basis** — no new hardware, no new physics. H rotates |+⟩ to |0⟩ and |−⟩ to |1⟩, then the ordinary measurement reads it. Every 'measure in basis B' you will ever meet is 'rotate B to the computational basis, then measure'.",
        "**Shots arithmetic worth memorizing**: statistical error shrinks as 1/√shots. 100 shots ≈ 10% wobble, 10,000 shots ≈ 1%. When stage 12's Bell histogram shows 493/507 instead of 500/500, that is √1000 ≈ 32 counts of expected noise, not hardware error.",
        "**Expectation values** are the polished version of the same move: many algorithms (especially chemistry, stage 12) don't want a bitstring at all — they want an average like 'P(0) − P(1)', estimated from the histogram. The measurement is run thousands of times purely to nail down a single number.",
        "**Deferred measurement earns its keep twice**: practically, it lets hardware postpone all measurement to the end (mid-circuit measurement is technically nasty); conceptually, it tells you measurement's timing is never load-bearing — any 'measure early and branch' trick can be replaced by one more entangled qubit. When you meet teleportation or error-correction circuits, this rule is why the diagrams can be read either way.",
        "**Collapse revisited with two qubits**: measure only qubit A of the Bell pair and get 0 — the joint 4-vector collapses to pure |00⟩. Qubit B's outcome is now fixed **before B is touched**. That's stage 3's correlation mechanism seen from the measurement side: collapse acts on the joint state, not on one wire.",
      ],
      exercise:
        "Predict, then verify each in Qiskit (add H before measurement for X-basis):\n" +
        "  1. Prepare |−⟩ (X then H from |0⟩). Measure 1000 shots in Z-basis: expected\n" +
        "     histogram? Then in X-basis: expected histogram?\n" +
        "  2. Prepare |+⟩ and measure in X-basis. Why is this histogram boring, and what\n" +
        "     does boring prove?\n" +
        "  3. With shots = 100, 1000, 10000 on a fair 50/50 state, record how far the\n" +
        "     counts stray from perfect halves. Compare with the 1/sqrt(shots) rule.\n" +
        "  4. Bell pair: measure qubit A only (measure just one classical bit), run 20\n" +
        "     shots, and argue from the counts what state qubit B held after each shot.",
      drills: [
        "Why can't you distinguish |+⟩ from |−⟩ with a Z-basis measurement, no matter how many shots, if you measure the same prepared state each time?",
        "How is an X-basis measurement implemented with only Z-basis hardware?",
        "How many shots do you need to estimate a probability to about 1% error?",
        "State the deferred measurement principle in one sentence and give one practical reason hardware teams love it.",
        "One shot of Grover's algorithm returns a bitstring. Why is the algorithm still called probabilistic, and what do you do with the returned string? (Check it classically — verification is cheap.)",
      ],
      note:
        "The basis-choice trade-off is the exact engine of **BB84 QKD**: the sender encodes random bits in " +
        "randomly chosen Z/X bases; an eavesdropper forced to guess measures ~half in the wrong basis and " +
        "unavoidably scrambles those states, betraying herself in the error rate. You now understand a " +
        "protocol this course's crypto sibling could only assert. Remember though: QKD is key exchange " +
        "hardware, not a replacement for the PQC migration of stage 11.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "Deutsch-Jozsa: your first quantum win",
      tag: "one query beats 2^(n-1)+1",
      time: "60–90 min",
      payoff:
        "This is the 'hello world' of quantum advantage: a task where classical computing provably " +
        "needs many queries and a quantum circuit needs exactly one. The problem itself is a toy, but " +
        "walking the amplitudes through H → oracle → H by hand is the moment the interference recipe " +
        "stops being a slogan and becomes something you can execute — and every later algorithm reuses " +
        "the exact same skeleton.",
      concepts: ["oracle / black-box model", "constant vs balanced promise", "phase kickback", "H-oracle-H skeleton", "reading the all-zeros amplitude", "query complexity"],
      code:
`# Deutsch-Jozsa: a black box computes f(x) on n-bit inputs. PROMISE:
# f is either CONSTANT (same output always) or BALANCED (0 for exactly
# half the inputs, 1 for the other half). Which is it?
#   classical worst case: 2^(n-1) + 1 queries.   quantum: exactly 1.
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

n = 3                              # 3 input bits -> 8 possible inputs
qc = QuantumCircuit(n + 1, n)
qc.x(n); qc.h(n)                   # helper qubit in |−⟩: the phase-kickback trick
qc.h(range(n))                     # H everywhere: all 8 inputs now live in
                                   # superposition, amplitude 0.354 each
qc.barrier()
# --- the oracle: f(x) = x0 XOR x2   (a balanced function) ------------
qc.cx(0, n); qc.cx(2, n)           # with the helper in |−⟩, each CNOT lands a
                                   # MINUS SIGN on exactly the inputs where
                                   # that bit is 1 — f is written into signs
qc.barrier()
qc.h(range(n))                     # H again: interfere all 8 paths
qc.measure(range(n), range(n))

sim = AerSimulator()
print(sim.run(transpile(qc, sim), shots=1000).result().get_counts())
# constant f  ->  {'000': 1000}        all-zeros, with CERTAINTY
# balanced f  ->  '000' NEVER appears  (this f gives {'101': 1000})
#
# swap the oracle for a constant one (nothing, or a lone qc.x(n)) and
# rerun: the histogram snaps to all-zeros. one query either way.`,
      lang: "py",
      walkthrough: [
        "**The rules of the game**: the oracle is a subroutine you may call but not open. Cost = number of calls. Classically, if you've seen 4 inputs of 8 all return 0, f could still be balanced (the other 4 might be 1s) or constant — you need a 5th query to be sure. Quantumly, one call settles it with certainty. Nothing probabilistic about the win.",
        "**Phase kickback, the trick that powers everything**: the helper qubit sits in |−⟩ = (0.707, −0.707). When the oracle XORs f(x) into it, inputs with f(x) = 1 flip the helper's amplitudes — which equals multiplying that input's branch by −1 while the helper itself is unchanged. Net effect: **f gets written into the signs** of the input register's amplitudes. The answer-carrying qubit never changes; the question register inherits the phases. Grover's oracle is this same move.",
        "**Walk n = 1 fully by hand** (four amplitudes total, do it on paper): input starts |0⟩ → H → (0.707, 0.707). Constant f: no signs change → H returns it to (1, 0) → measure 0, certainty. Balanced f (f(x) = x): signs become (0.707, −0.707) = |−⟩ → H maps it to (0, 1) → measure 1, certainty. The measurement literally asks 'did the oracle flip the sign pattern from |+⟩ to |−⟩?' — stage 6's basis lesson, weaponized.",
        "**The general readout in one sentence**: after the final H layer, the amplitude of the all-zeros string is the **average of all the signs** — constant f: all signs equal, average ±1, P(000) = 1; balanced f: exactly half the signs are minus, average 0, P(000) = 0. Wrong-answer paths into |000⟩ cancel pairwise. That is stage 2's recipe executed verbatim: split (H), mark (oracle signs), recombine (H), measure.",
        "**Why this is not 'trying all inputs at once'** — the superposition does evaluate f on all 8 inputs in one call, but that alone is useless: measuring right after the oracle yields one random input and one f-value, exactly like a single classical query. The entire advantage is manufactured by the second H layer, which converts the **global sign pattern** — a property of all 8 branches jointly — into a single certain bit. Parallel evaluation is the raw material; interference is the computation.",
        "**Honest scope**: Deutsch-Jozsa solves a promise problem nobody has in practice, and a classical randomized algorithm gets exponentially confident with a handful of queries. Its value is pedagogical — it is the smallest circuit exhibiting the full skeleton: **superpose → phase-encode the problem → interfere → measure**. Simon's algorithm (same skeleton, exponential win even against randomized classical) was the direct inspiration for Shor. You are two stages away.",
        "**Reading the code**: `qc.barrier()` is purely visual (keeps the oracle boxed in the drawing); the oracle `cx(0,n); cx(2,n)` computes f(x) = x0 XOR x2, balanced since flipping x0 flips f. The result '101' actually encodes **which** XOR mask the oracle used — Deutsch-Jozsa quietly identifies the hidden linear structure, a freebie the balanced/constant question doesn't even ask for.",
      ],
      exercise:
        "The full-contact version — budget an hour:\n" +
        "  1. On paper, walk n=1 Deutsch-Jozsa for all four possible oracles\n" +
        "     (f=0, f=1, f=x, f=NOT x): eight amplitude vectors each three steps long.\n" +
        "     Confirm: constants end in measuring 0, balanced end in measuring 1.\n" +
        "  2. Run the n=3 code as-is; confirm '000' never appears. Then delete both\n" +
        "     CNOTs (constant f) and confirm {'000': 1000}.\n" +
        "  3. Change the oracle to f(x) = x1 (one CNOT from qubit 1). Balanced?\n" +
        "     Predict the exact output string before running. (Hint: the walkthrough's\n" +
        "     last item tells you what the string encodes.)\n" +
        "  4. Measure immediately AFTER the oracle instead (move the measure line,\n" +
        "     drop the second H layer). Describe the histogram and explain why the\n" +
        "     advantage evaporated.",
      drills: [
        "How many queries does a deterministic classical algorithm need in the worst case for n = 10? And the quantum circuit?",
        "Explain phase kickback in two sentences: what state must the helper be in, and where does f end up?",
        "After the final H layer, what quantity is the amplitude of the all-zeros string, and why does 'balanced' force it to zero?",
        "Where exactly does the naive parallelism story break, and which gate layer rescues it?",
        "Which stage-2 recipe step does each circuit chunk implement: first H layer, oracle, second H layer, measurement?",
      ],
      note:
        "The skeleton you just internalized — H layer, phase oracle, structured interference, measure — " +
        "is the body plan of the whole algorithm zoo: Bernstein-Vazirani (reads a hidden bitmask in one " +
        "query, literally this circuit), Simon (finds a hidden XOR period, exponential win), and Shor " +
        "(stage 9: same idea with the Fourier transform as the interference layer, aimed at the period of " +
        "modular exponentiation). Nobody designs quantum algorithms from scratch; they mutate this one.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "Grover's search: reflect, reflect, rotate",
      tag: "√N and the AES tax",
      time: "60–90 min",
      payoff:
        "Grover's algorithm finds a needle in an unstructured haystack of N items with ~√N oracle " +
        "calls instead of ~N — provably optimal, endlessly applicable, and endearingly geometric: " +
        "just two reflections repeated, rotating the state toward the answer. It is also the reason " +
        "your Cryptography course told you AES-128 loses half its bits on paper — this stage does " +
        "that math honestly, including why AES-128 still isn't dead.",
      concepts: ["amplitude amplification", "sign-flip oracle", "inversion about the mean", "π/4·√N iterations", "overshoot", "BBBV optimality", "Grover vs AES key sizes"],
      code:
`# Grover on N=8 (3 qubits): find the marked item |101⟩ in ~sqrt(8) steps
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

def oracle(qc):                      # flip the SIGN of |101⟩ only
    qc.x(1)                          # qubit 1 is the middle 0 of '101'
    qc.h(2); qc.ccx(0, 1, 2); qc.h(2)    # H-CCX-H on qubit 2 == a CCZ
    qc.x(1)                          # (sign flip iff all three "look 1")

def diffuser(qc):                    # reflect every amplitude about the mean
    qc.h([0, 1, 2]); qc.x([0, 1, 2])
    qc.h(2); qc.ccx(0, 1, 2); qc.h(2)
    qc.x([0, 1, 2]); qc.h([0, 1, 2])

qc = QuantumCircuit(3, 3)
qc.h([0, 1, 2])                      # uniform start: all 8 amplitudes 0.354
for _ in range(2):                   # optimal ≈ (pi/4)*sqrt(8) ≈ 2.2 -> 2 rounds
    oracle(qc); diffuser(qc)
qc.measure([0, 1, 2], [0, 1, 2])

sim = AerSimulator()
print(sim.run(transpile(qc, sim), shots=1000).result().get_counts())
# -> {'101': ~945, crumbs elsewhere}
#
# the marked amplitude, round by round (start 0.354):
#   round 1:  0.884   P = 78.1%
#   round 2:  0.972   P = 94.5%     <- stop here!
#   round 3:  0.575   P = 33.0%     <- OVERSHOOT: kept rotating, went past
# Grover is a rotation, not a ratchet. more iterations != better.`,
      lang: "py",
      walkthrough: [
        "**The problem model**: N candidates, an oracle that answers 'is this the one?' — no structure to exploit, so classically you try candidates one by one, expecting N/2 attempts. Grover does it in about (π/4)·√N oracle calls: a **quadratic** speedup. For N = a million: ~785 queries instead of ~500,000.",
        "**The oracle marks with a minus sign** — never 'returns the answer'. It flips the amplitude sign of the marked item and touches nothing else (a conditional Z, built here as H·CCX·H plus X-conjugation to select the 101 pattern — and powered by the same phase-kickback idea as stage 7). Crucially, a sign flip is **invisible to measurement**: after the oracle alone, all probabilities are still equal. The oracle hides the answer in phase; the second move digs it out.",
        "**Inversion about the mean, by arithmetic**: compute the average of all N amplitudes, then replace every amplitude a with (2·mean − a) — each value reflected through the mean. Uniform state: mean ≈ everyone, nothing moves. But after the oracle, the marked amplitude is negative, dragging the mean slightly down; reflecting the big positive crowd through that lowered mean shrinks them slightly, while the negative marked one reflects to **above** the crowd. The sign flip has been converted into a magnitude boost. Run one round on paper for N = 4 (start 0.5 each): oracle → (0.5, 0.5, −0.5, 0.5); mean = 0.25; invert → (0, 0, 1.0, 0). One round, certainty — for N = 4 Grover is exact.",
        "**The geometric picture that explains everything**: the state lives in a 2D plane spanned by 'the marked item' and 'uniform-over-everything-else'. Oracle = reflection across the unmarked axis; diffuser = reflection across the starting state; two reflections = **rotation** by a fixed angle 2·arcsin(1/√N) toward the marked axis. The mini-lab below draws all 16 amplitudes live — step it and watch the rotation.",
        "**Overshoot is not a bug, it is the proof you understood**: the rotation doesn't stop at the target — iterate past (π/4)·√N and the state rotates beyond the marked axis, and success probability **falls** (the code's round 3: 94.5% → 33%). Step the mini-lab to iteration 6 and watch it slide downhill. Knowing when to stop is part of the algorithm; when the number of marked items is unknown, there are standard tricks (random iteration counts, quantum counting).",
        "**Optimality, so you can shut down hype**: the BBBV theorem proves **no** quantum algorithm can beat O(√N) for unstructured search. Quadratic is the ceiling. This kills the fantasy of quantum computers brute-forcing NP-complete problems by magic: for SAT with 2^n candidates, Grover gives 2^(n/2) — still exponential. Quantum ≠ NP solved (stage 12 returns to this).",
        "**Now the crypto bill, honestly**: brute-forcing AES-128's 2^128 keyspace with Grover needs ~2^64 **sequential** oracle calls, each a full quantum AES evaluation — so 'AES-128 becomes a 64-bit cipher' is true only in the query-counting model. Real estimates put the hardware-time product astronomically high (billions of years of coherent serial computation, and Grover parallelizes badly: k machines give only √k speedup). So: AES-128 is not practically dead, but the safety margin is gone on paper — which is why the guidance you met in the Cryptography course is simply **use AES-256** (Grover leaves it 2^128-hard: untouchable) and spend your worry budget on Shor instead.",
      ],
      exercise:
        "  1. On paper, run Grover for N=4, marked item 3: start (0.5,0.5,0.5,0.5),\n" +
        "     oracle, mean, inversion. Confirm one round reaches amplitude 1.0 exactly.\n" +
        "  2. Run the N=8 code with 1, 2, 3, 4 rounds (edit the range). Tabulate the\n" +
        "     '101' hit rate vs the predicted probabilities. Where is the peak?\n" +
        "  3. Change the marked item to |011⟩ (which X-conjugations change?). Verify.\n" +
        "  4. In the mini-lab (N=16): step to the optimal 3 iterations, note P, then\n" +
        "     step to 6 and watch the overshoot. At what iteration does it peak again?\n" +
        "     (Grover is periodic — keep stepping and find the second peak.)\n" +
        "  5. Compute Grover-effective security bits for: AES-128, AES-192, AES-256,\n" +
        "     and a 12-character random-lowercase password (26^12 candidates).",
      drills: [
        "Why must the oracle flip a sign rather than 'output the index', and which measurement fact makes the bare oracle useless alone?",
        "Write the inversion-about-the-mean formula and apply it to (0.6, 0.6, -0.2): what is the new middle value? (mean = 1/3; new values 2/3−each → (0.067, 0.067, 0.867).)",
        "How many iterations for N = 2^20? For N = 2^128? What does the second number tell you about 'Grover breaks AES'?",
        "What happens if you run 2× the optimal iterations, and why (in the rotation picture)?",
        "Why doesn't Grover make quantum computers solve NP-complete problems efficiently?",
      ],
      note:
        "Grover generalizes to **amplitude amplification**: boost the success probability of ANY quantum " +
        "subroutine that succeeds with probability p to near-1 in ~1/√p repetitions instead of ~1/p. That " +
        "generalized form is the workhorse inside dozens of algorithm papers. And a lovely exercise-shaped " +
        "fact: with multiple marked items m of N, the optimal iteration count drops to (π/4)·√(N/m) — mark " +
        "4 of the mini-lab's 16 mentally and everything runs twice as fast.",
    },
    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "Shor's algorithm & the RSA countdown",
      tag: "period finding kills factoring",
      time: "60–90 min",
      payoff:
        "This is the stage the whole course has been walking toward: why a working quantum computer " +
        "ends RSA, Diffie-Hellman and elliptic curves in one blow. Shor's insight is a reduction — " +
        "factoring becomes period-finding, and period-finding is exactly the kind of global pattern " +
        "interference can read in one shot. You will factor 15 by hand, see where the quantum part " +
        "begins and ends, and leave with honest resource numbers and the harvest-now-decrypt-later " +
        "argument that makes this a 2026 problem, not a someday problem.",
      concepts: ["factoring → period finding", "modular exponentiation cycles", "QFT as period reader", "resource estimates for RSA-2048", "harvest now, decrypt later", "what else falls: DH & ECC", "timeline honesty"],
      code:
`  SHOR IN ONE STORY: factoring N = 15

  1. pick a random a coprime with N.   say a = 7.
  2. look at the powers of a mod N:
       7^1=7   7^2=4   7^3=13   7^4=1   7^5=7   7^6=4 ...
     the sequence CYCLES. its period here: r = 4.
  3. classical number theory takes over: if r is even and
     a^(r/2) ≠ N−1 (mod N), then the factors are
       gcd(a^(r/2) − 1, N)  and  gcd(a^(r/2) + 1, N)
     here a^(r/2) = 7^2 = 49:
       gcd(48, 15) = 3      gcd(50, 15) = 5      15 = 3 × 5.  done.

  steps 1 and 3 are cheap classical code. ALL the difficulty of
  factoring lives in step 2: for a 2048-bit N the period r is a
  ~2048-bit number, and classically, hunting it is as hard as
  factoring itself. Shor's machine does ONLY step 2.

  HOW THE QUANTUM PART READS r (one honest paragraph)
    prepare a superposition over x = 0,1,2,...,2^m−1, compute a^x mod N
    into a second register (reversible circuits — Toffolis all the way
    down). the joint state now holds the whole repeating sequence in
    its amplitudes. measuring the second register leaves register one
    in a superposition of ALL x sharing one value — a comb with teeth
    exactly r apart. the QUANTUM FOURIER TRANSFORM is the interference
    layer (stage 7's second H-layer, grown up): paths interfere so
    that only multiples of 2^m/r survive. measure, get one, and a
    classical continued-fraction step recovers r. the answer was a
    GLOBAL property of 2^m amplitudes — exactly what interference,
    and nothing classical, can extract.

  THE BILL FOR RSA-2048 (honest 2026 ballparks)
    logical qubits:    ~2n+3  ≈ 4,100 good, error-corrected qubits
    physical qubits:   ~1,000 physical per logical (stage 10)
                       -> famous estimate: ~20 MILLION noisy qubits,
                          ~8 hours (Gidney-Ekera 2019); improvements
                          since push toward ~1M with better codes
    where we are:      ~10^3 physical qubits, logical qubits in the
                       tens. largest honest Shor factorization: 21.
    the gap is ORDERS OF MAGNITUDE — but it is an engineering gap,
    not a theory gap. nobody credible gives a date; serious agencies
    (NIST, NSA CNSA 2.0) plan for the 2030s ANYWAY. why? ↓

  HARVEST NOW, DECRYPT LATER
    TLS traffic recorded today can be decrypted the day the machine
    exists. anything that must stay secret 10+ years (health records,
    state secrets, your DICOM archives) is ALREADY at risk — the
    migration deadline is set by your data's lifetime, not the
    machine's arrival. that is why stage 11 is not optional.`,
      lang: "txt",
      walkthrough: [
        "**The reduction is the genius part.** Factoring looks nothing like a wave problem — until you notice modular exponentiation is periodic and that Euler/Fermat number theory converts a known period into factors with two gcd calls. Shor didn't build a quantum factoring machine; he built a quantum **period-finding** machine and dragged factoring into its jurisdiction.",
        "**Do the 15 walk yourself, then once more with a = 2**: 2, 4, 8, 1, 2, ... period r = 4; 2^2 = 4; gcd(3, 15) = 3, gcd(5, 15) = 5. Sometimes the dice land badly (odd r, or a^(r/2) = N−1) — then you pick a new a and rerun; a few tries suffice on average. Shor is a Las Vegas algorithm: random attempts, certain verification (multiply the factors!).",
        "**Where the exponential state space earns its keep**: computing a^x mod N for ALL 2^m values of x takes one pass of reversible arithmetic over a superposition — that part really is 'all inputs at once'. But stage 2's discipline applies: measuring now would yield one random (x, a^x) pair, worth nothing. The magic is that the **period** is a pattern spread across all branches jointly, and patterns spread across all branches are precisely what interference layers read.",
        "**The QFT in one intuition**: it is a change of basis that asks 'what rhythm does this amplitude comb have?' — the H-layer from Deutsch-Jozsa generalized from 'is the sign pattern constant or half-flipped?' to 'what frequency repeats here?'. Paths from comb teeth r apart arrive at frequency-multiples in phase (add) and everywhere else out of phase (cancel). If you have ever run an FFT on audio to find a pitch, you have the right picture — except this FFT runs on 2^2048 amplitudes and costs only ~m² gates.",
        "**Read the resource numbers like an engineer**: ~4,100 logical qubits is astonishingly few — the catch is each logical qubit costs ~1,000 physical ones plus a continuous error-correction workload, and the circuit is **deep**: billions of sequential Toffoli-level steps that all must land inside the error budget. That is why 'we have 1,121 physical qubits' headlines (stage 10) are three orders of magnitude of qubits AND many orders of fidelity away. Both gaps close with engineering, neither with hype.",
        "**The blast radius is all deployed public-key crypto**: the same period-finding engine solves discrete logarithms, so Diffie-Hellman and ECDH/ECDSA fall with RSA — elliptic curves actually fall **cheaper** (ECC-256 needs ~2,300 logical qubits, fewer than RSA-2048). Everything your TLS handshakes, SSH keys, code-signing certs and blockchain signatures rely on. Symmetric crypto and hashes only take the Grover haircut from stage 8 — hence your Lamport demo and SPHINCS+ surviving on hash.carino.systems.",
        "**Harvest-now-decrypt-later closes the argument**: an adversary storing ciphertext today needs no quantum computer today. Compute your exposure as Mosca's inequality: if (years your data must stay secret) + (years your migration takes) > (years until a cryptographically relevant quantum computer), you are already late. Plug in 10-year medical-record confidentiality and a realistic 5-year enterprise migration and the deadline lands uncomfortably close to now — which is exactly why NIST shipped the stage-11 standards in 2024 and CNSA 2.0 mandates PQC by the early 2030s.",
      ],
      exercise:
        "  1. Factor 21 by Shor's recipe by hand: a = 2. List powers of 2 mod 21 until\n" +
        "     they cycle, find r, apply the gcd formula. (You should recover 3 x 7.)\n" +
        "  2. Try a = 5 for N = 21. What goes wrong, and what does the algorithm do next?\n" +
        "  3. Write a 10-line Python function shor_classical(N) that does steps 1-3 with\n" +
        "     brute-force period finding, and factor 15, 21, 33, 35 with it. Time it on a\n" +
        "     20-bit semiprime and reflect on why the quantum step is the whole ballgame.\n" +
        "  4. Mosca's inequality for your own projects: pick one dataset you run (e.g. a\n" +
        "     PACS archive), estimate its secrecy lifetime and a migration time, and\n" +
        "     decide which quantum-computer arrival year would make you already-late.\n" +
        "  5. In the RSA-countdown mini-lab: find the smallest scenario that breaks\n" +
        "     RSA-2048, then check what the same scenario does to AES-256.",
      drills: [
        "State the factoring-to-period-finding reduction: what sequence is periodic, and what two gcds finish the job?",
        "Which parts of Shor run on a classical CPU, and which single step needs the quantum computer?",
        "Why does measuring right after computing a^x mod N in superposition teach you (almost) nothing, and what does the QFT change?",
        "Roughly how many logical and physical qubits does RSA-2048 need, and where is 2026 hardware relative to that?",
        "Explain harvest-now-decrypt-later and Mosca's inequality in three sentences, aimed at a CTO.",
      ],
      note:
        "Keep your skepticism calibrated in both directions. Claims of 'we factored RSA-100 with quantum " +
        "annealing/variational tricks' appear yearly and do not implement Shor — none scale, and several " +
        "quietly relied on the answer being nearby. Meanwhile the error-correction milestones (stage 10) " +
        "have been arriving roughly on the roadmap schedule. The correct posture is the one NIST took: no " +
        "panic, no denial, migrate on a schedule — which is the entire content of stage 11.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Real hardware in 2026",
      tag: "NISQ, decoherence & the 1000:1 tax",
      time: "45–60 min",
      payoff:
        "Between the algorithms and the headlines sits the hardware, and the hardware has a brutal " +
        "accounting: qubits forget (T1/T2), gates miss (fidelity), and fixing both costs roughly a " +
        "thousand physical qubits per usable logical one. This stage gives you the four main " +
        "platforms in one line each, the NISQ vocabulary, and the numbers that let you translate any " +
        "quantum press release into an honest sentence.",
      concepts: ["superconducting / trapped-ion / photonic / neutral-atom", "decoherence, T1 & T2", "gate fidelity & error budget", "NISQ era", "error correction & the surface code", "logical vs physical qubits", "press-release arithmetic"],
      code:
`  THE FOUR HORSES (2026 form guide, one line each)

  superconducting   IBM, Google. microwave circuits at 15 millikelvin.
                    fast gates (~ns), so-so coherence (~100 µs),
                    1,000+ physical qubits demonstrated. front-runner.
  trapped ion       IonQ, Quantinuum. individual atoms in EM traps.
                    superb fidelity & coherence (seconds!), all-to-all
                    connectivity — but slow gates and hard to scale
                    past ~100 per trap.
  neutral atom      QuEra, Pasqal. atoms held in laser tweezer arrays.
                    scales to 1,000+ atoms cheaply; young gate tech,
                    rising fast — the 2020s dark horse.
  photonic          PsiQuantum, Xanadu. qubits are light; room
                    temperature, fiber-friendly, but gates are
                    probabilistic — betting everything on one giant
                    error-corrected machine, no NISQ product.

  THE ENEMY: DECOHERENCE
    the environment "measures" your qubits without permission —
    every stray photon collapses amplitudes you were counting on.
      T1 (relaxation):  how long |1⟩ takes to decay toward |0⟩
      T2 (dephasing):   how long the SIGNS stay trustworthy
                        (T2 ≤ 2·T1; phase dies first)
    superconducting T2 ~ 100 µs, two-qubit gate ~ 100 ns
    -> budget: ~1,000 sequential 2-qubit gates before the state rots.
    Shor on RSA-2048 needs BILLIONS. hence: error correction, or bust.

  ERROR CORRECTION: THE 1000:1 TAX
    can't copy qubits (no-cloning, stage 4) — but CAN spread one
    logical qubit's state across many physical ones (entanglement!)
    and measure PARITIES that reveal errors without reading data.
    the surface code: a 2D grid, distance d ~ 30 needed at today's
    error rates -> ~1,000 physical qubits per logical qubit, plus a
    classical decoder racing alongside in real time.
    milestone that mattered (Google, 2024): making the code BIGGER
    made errors go DOWN — below-threshold operation, the "it actually
    works" moment of the decade.

  PRESS-RELEASE ARITHMETIC (apply to any announcement)
    "1,121 qubits!"        physical or logical? (physical. always.)
    at 1000:1              -> ~1 logical qubit
    RSA-2048 needs         ~4,100 logical
    honest translation:    "a fine research machine, ~7 orders of
                            magnitude of total capability from Shor"`,
      lang: "txt",
      walkthrough: [
        "**Decoherence is stage 6's collapse, weaponized against you by the universe**: any stray interaction that could in principle reveal a qubit's value acts exactly like a measurement — amplitudes collapse, signs scramble. A quantum computer is a machine for keeping 2^n amplitudes **unobserved** while still manipulating them; that near-contradiction is why the engineering is heroic.",
        "**T1 vs T2, the two clocks**: T1 is energy decay (|1⟩ relaxes to |0⟩ — the bit rots); T2 is phase coherence (the signs that stages 2–9 built everything on stop being trustworthy — the interference rots). T2 ≤ 2·T1 always, and in practice phase dies first, which is fitting: the signs were always the precious part.",
        "**The error budget calculation you should be able to do at a whiteboard**: usable circuit depth ≈ coherence time / gate time, degraded by gate fidelity. At 99.5% two-qubit fidelity, after ~140 gates the odds of a clean run drop below 50%. Compare: mini-lab Grover, dozens of gates — fine; Shor on RSA-2048, billions of gates — needs error rates around 10^-12 per logical operation. Physical qubits will never be that good; **logical** ones must be manufactured.",
        "**NISQ, defined honestly** (Preskill's term): Noisy Intermediate-Scale Quantum — enough qubits to be classically hard to simulate (50+), too noisy for error correction at useful scale. The NISQ business model is variational algorithms (VQE, QAOA) that tolerate some noise; recall the scoreboard reference card: those are exactly the algorithms with **no proven speedup**. That is not coincidence — it is the era's defining tension.",
        "**How error correction dodges no-cloning**: you cannot copy the state, but you can entangle it across (say) 1,000 physical qubits such that any single physical error changes a **parity** you are allowed to measure — the syndrome reveals 'qubit 417 flipped' without revealing (or collapsing) the logical amplitudes. Redundancy without copying, purchasable only with entanglement. The surface code arranges this on a 2D nearest-neighbor grid, which is why everyone's chips are checkerboards.",
        "**The threshold theorem is why anyone bothers**: if physical error rates sit below a threshold (~1% for surface codes), adding more qubits suppresses logical errors **exponentially**. Above threshold, more qubits = more noise = doom. Google's 2024 below-threshold demonstration (bigger code, fewer errors, a logical qubit outliving its best physical component) was the field's proof-of-life; the game since is scaling from a handful of logical qubits to thousands.",
        "**Reading 2026 honestly**: ~1,000-qubit-class superconducting chips, trapped-ion machines with the best per-gate numbers, neutral atoms scaling fastest, and logical-qubit counts in the tens across the industry. Cryptographically relevant machines need ~4,100 logical + billions of clean cycles — the distance is real, the direction of travel is unambiguous, and the below-threshold result means the remaining risk is schedule, not physics. Which is precisely Mosca's-inequality territory: stage 11.",
      ],
      exercise:
        "  1. Whiteboard math: T2 = 200 µs, two-qubit gate = 50 ns, fidelity 99.9%.\n" +
        "     (a) max sequential gates inside T2; (b) expected gates until first error\n" +
        "     (~1/0.001). Which limit binds first?\n" +
        "  2. A vendor announces 5,000 physical qubits at 99.9% fidelity. Estimate its\n" +
        "     logical qubit count at 1000:1 and write the honest one-sentence translation\n" +
        "     re: RSA-2048.\n" +
        "  3. Rank the four platforms by: coherence time, gate speed, current scale,\n" +
        "     connectivity. (One line each — the code block has everything you need.)\n" +
        "  4. Find this month's largest announced machine (any vendor) and run the\n" +
        "     press-release arithmetic on it.",
      drills: [
        "Define T1 and T2 in one sentence each, and say which one the interference tricks of stages 2–9 depend on most.",
        "What does NISQ stand for, and what is the defining tension of NISQ-era algorithms?",
        "How does error correction store redundant information without violating no-cloning?",
        "State the threshold theorem informally and why Google's 2024 result mattered.",
        "A headline says '1,000 qubits'. List the three questions that determine whether that is news.",
      ],
      note:
        "The 1000:1 overhead is a 2026 snapshot, not a law of nature — better codes (qLDPC), better " +
        "qubits, and cat/bosonic qubits with built-in bias all push it down, and estimates for breaking " +
        "RSA-2048 have already fallen from ~a billion physical qubits (2012 assumptions) to ~20 million " +
        "(2019) toward ~1 million (mid-2020s proposals). When the overhead moves, every timeline in stage " +
        "9 moves with it. That one ratio is the single most consequential number in applied quantum " +
        "computing — worth checking on annually, like you'd check a CVE feed.",
    },
    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "The post-quantum defense",
      tag: "Kyber, Dilithium & the migration",
      time: "45–60 min",
      payoff:
        "Here the course shakes hands with its crypto sibling: the defense against Shor is not " +
        "quantum hardware but better classical math, standardized by NIST in 2024 and shipping in " +
        "your browser already. This stage maps each PQC family to the quantum attack it dodges, " +
        "places your own Lamport demo in the lineage, and lays out the migration playbook — " +
        "inventory, hybrid, agility — that turns stage 9's countdown into a work plan.",
      concepts: ["ML-KEM (Kyber)", "ML-DSA (Dilithium)", "SLH-DSA (SPHINCS+) & hash-based sigs", "why lattices resist Shor", "hybrid TLS", "crypto inventory", "crypto-agility", "CNSA 2.0 timeline"],
      code:
`  THE DEFENSE ROSTER (NIST standards, August 2024)

  FIPS 203  ML-KEM   (Kyber)      key exchange     lattice (Module-LWE)
  FIPS 204  ML-DSA   (Dilithium)  signatures       lattice (Module-LWE)
  FIPS 205  SLH-DSA  (SPHINCS+)   signatures       hash-based (backup
                                                   of a different color)
  none need quantum hardware. they are classical code — a software
  update, running today on the same CPUs, phones and smart cards.

  WHY THESE SURVIVE WHERE RSA DIES
    Shor is not a generic solver — it is a PERIOD FINDER. RSA/DH/ECC
    all hide their secrets inside periodic structures (modular
    exponentiation, group order), so Shor's one trick opens all three
    locks. lattice problems (find the short vector in a 700-dim
    lattice) and hash inversion have NO known periodic structure to
    feed the QFT. not provably quantum-proof — but 30 years of attack
    attempts, classical AND quantum, have produced only Grover-grade
    dents, and Grover-grade is priced in by parameter sizes.

  YOUR LAMPORT DEMO IS THE ANCESTOR
    hash.carino.systems' Lamport one-time signature: commit to 256
    hash-preimage pairs, reveal per bit. security = hash preimage
    resistance = only Grover applies = fine. its two flaws (huge keys,
    ONE use per key) are what SPHINCS+ fixes with Merkle trees of
    few-time signatures: same bet, industrial packaging. you built
    the teaching version of FIPS 205.

  THE MIGRATION PLAYBOOK (what "do something" actually means)
   1. INVENTORY   find every use of RSA/ECDH/ECDSA you own: TLS,
                  SSH, VPN, code signing, JWTs, DICOM TLS, firmware,
                  smart cards. (this step reliably horrifies.)
   2. CLASSIFY    by data lifetime (Mosca!): 10-year-secret data
                  first; ephemeral stuff last.
   3. HYBRID      X25519+ML-KEM key exchange: secure unless BOTH
                  break. Chrome, Firefox, OpenSSH, Cloudflare and
                  Signal already default to it — check your own TLS!
   4. AGILITY     make algorithms a CONFIG VALUE, not a hardcode.
                  the next migration should be a rollout, not a
                  rewrite. (this is the durable lesson.)
   5. SIGNATURES  longer-lived and harder: firmware signed today is
                  verified in 2040 — sign with ML-DSA (or hybrid) now.

  DEADLINES ALREADY ON PAPER
    CNSA 2.0 (US national security systems): PQC for firmware signing
    by 2025-2030, everything by ~2033. browsers/CDNs: hybrid KEX is
    already the default path. your projects: see exercise.`,
      lang: "txt",
      walkthrough: [
        "**Get the framing right: PQC is a software problem with a deadline, not a physics problem.** Nothing in this stage needs a qubit. The threat (stage 9) is quantum; the defense is classical algorithms whose hardness has no period for the QFT to bite — that asymmetry is the whole strategy.",
        "**ML-KEM replaces the key-exchange half of TLS** (the part harvest-now-decrypt-later attacks): instead of ECDH's group structure, security rests on Module-LWE — solving noisy linear equations over lattices. Costs are honest but fine: ~1.2 KB public keys vs 32-byte X25519, roughly comparable speed. Your Cryptography course's final stage covered the mechanics; now you know the enemy it was built for.",
        "**ML-DSA replaces ECDSA/RSA signatures** and matters on a different clock: signatures are verified far in the future (firmware, certificates, signed releases, archival DICOM). A signature made with ECDSA today is a promise Shor can forge retroactively the day the machine exists — long-lived signing keys are the most urgent migration of all, which is why CNSA 2.0 put firmware signing first.",
        "**SLH-DSA is the diversity play, and it is personally yours**: pure hash-based signatures assume only that the hash function resists preimage attacks — the most battle-tested assumption in cryptography, and quantum attacks can only bring Grover (halve the bits; SHA-256 keeps 128). Your Lamport demo is this scheme's grandparent: SPHINCS+ = Lamport-style few-time signatures + Merkle trees to get many uses + bigger parameters. If lattices ever fall to a clever new algorithm, SLH-DSA is the survivor — slow and fat (~8–50 KB signatures), but standing.",
        "**Hybrid is how grown-ups deploy new crypto**: run X25519 AND ML-KEM, hash both shared secrets together. An attacker must break both — the new lattice math AND the old curve. This costs a kilobyte per handshake and removes the 'what if Kyber has a bug' objection entirely; it is why the browsers could default it years before anyone's quantum computer works. Check any of your own sites: Wireshark or browser dev tools will show `X25519MLKEM768` in the TLS handshake against Cloudflare-fronted hosts today.",
        "**The inventory step is where theory meets your repos**: every `ssh-keygen -t rsa`, every ECDSA JWT, every TLS cert in your fleet — carino.systems included — is a line item. For a working audit: list (algorithm, key size, data lifetime, replacement date) per system. Most items turn out fine to migrate lazily (session TLS with hybrid already handles harvest risk); the scary rows are always long-lived signatures and archived encrypted data.",
        "**Crypto-agility is the lesson that outlives even this migration**: the organizations suffering most are the ones where RSA-2048 is hardcoded in firmware, formats and foreign fleets of devices (hospital modalities speaking DICOM-TLS, looking at you). Design every new system so the algorithm is negotiated or configured — because Kyber will not be the last migration either.",
      ],
      exercise:
        "  1. Verify hybrid PQC in the wild: open browser dev tools (Security tab) or run\n" +
        "     a TLS scan against a Cloudflare-fronted site and find the key-exchange\n" +
        "     group. Is it X25519MLKEM768? Check your own deployed sites too.\n" +
        "  2. Crypto-inventory one real system you run (a server, the PACS project, a\n" +
        "     repo with signing keys): list every asymmetric algorithm in use, its data\n" +
        "     lifetime, and a verdict per row (migrate now / hybrid handles it / lazy).\n" +
        "  3. Generate a PQC keypair locally: recent OpenSSH supports hybrid KEX\n" +
        "     (sntrup761x25519 / mlkem768x25519); check ssh -Q kex on your machine and\n" +
        "     confirm which your server negotiates.\n" +
        "  4. Write the three-sentence explanation of why your Lamport demo survives a\n" +
        "     quantum computer, suitable for the hash.carino.systems page itself.\n" +
        "  5. Order these by migration urgency and justify: session TLS, 25-year firmware\n" +
        "     signing key, JWT signing for 15-minute tokens, encrypted DICOM archive.",
      drills: [
        "Match each: ML-KEM, ML-DSA, SLH-DSA → key exchange / signatures / backup signatures, and name each one's hardness assumption.",
        "Why does Shor's period-finding trick not apply to lattice problems or hash functions?",
        "What property does hybrid X25519+ML-KEM guarantee, and what does it cost?",
        "Why are long-lived signatures MORE urgent than session encryption, despite harvest-now-decrypt-later targeting the latter?",
        "Define crypto-agility and give one concrete design decision that implements it.",
      ],
      note:
        "QKD deserves one closing sentence of disambiguation (the vocabulary reference card has the " +
        "table): quantum key distribution uses quantum physics to exchange keys over dedicated fiber — " +
        "real technology, niche uses, but it is **not** what NIST standardized, doesn't do signatures, " +
        "needs special hardware and short ranges, and national security agencies (NSA, ANSSI, BSI) " +
        "explicitly recommend PQC over QKD for general use. When a vendor says 'quantum-safe', your first " +
        "question is now always: FIPS 203/204/205, or photons?",
    },

    /* -------------------------------------------------------------- 12 */
    {
      n: 12,
      title: "Myths, honest hopes & the capstone",
      tag: "BQP, chemistry & your first real run",
      time: "60–90 min",
      payoff:
        "The finale does two jobs: it hands you the complexity-theory compass (BQP vs NP, informally " +
        "but correctly) that separates real quantum promise from conference-keynote fantasy, and it " +
        "puts your fingers on the keyboard — Qiskit installed, a Bell pair and a Grover search " +
        "running on your own machine, with an optional hop to real IBM hardware. You leave able to " +
        "explain, build, and honestly evaluate — which is more than most of the industry.",
      concepts: ["BQP vs NP (intuition)", "what QC will NOT speed up", "quantum simulation as the near win", "chemistry & materials", "capstone: Bell + Grover locally", "optional: real hardware run"],
      code:
`# capstone.py — your first real quantum programs, end to end
# setup (5 min):  pip install qiskit qiskit-aer        Python 3.10+
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

sim = AerSimulator()

# --- 1. the Bell pair: stages 3 & 5, now on your machine ------------
bell = QuantumCircuit(2, 2)
bell.h(0)
bell.cx(0, 1)
bell.measure([0, 1], [0, 1])
res = sim.run(transpile(bell, sim), shots=1000).result().get_counts()
print("bell:", res)
# -> {'00': ~500, '11': ~500}   and NEVER '01' or '10'.
#    perfect correlation from two gates. stage 3, empirically yours.

# --- 2. Grover for N=4: one iteration is EXACT ----------------------
g = QuantumCircuit(2, 2)
g.h([0, 1])                          # uniform: all four amplitudes 0.5
g.cz(0, 1)                           # oracle: minus sign on |11⟩ only
g.h([0, 1]); g.x([0, 1])             # diffuser: inversion about the mean,
g.cz(0, 1)                           #   spelled out in gates
g.x([0, 1]); g.h([0, 1])
g.measure([0, 1], [0, 1])
print("grover:", sim.run(transpile(g, sim), shots=1000).result().get_counts())
# -> {'11': 1000}. walk it on paper: (0.5,0.5,0.5,0.5) -> oracle ->
#    (0.5,0.5,0.5,-0.5) -> mean 0.25 -> invert -> (0,0,0,1). certainty.

# --- 3. (optional) same Bell circuit, REAL hardware, free tier ------
# 1) account at quantum.ibm.com   2) pip install qiskit-ibm-runtime
# from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2
# service = QiskitRuntimeService()          # after saving your token
# backend = service.least_busy(operational=True, simulator=False)
# job = SamplerV2(backend).run([transpile(bell, backend)], shots=1000)
# print(job.result()[0].data.c.get_counts())
# expect ~1-5% of shots landing in '01'/'10': that is stage 10's
# decoherence, measured personally, on a machine near absolute zero.`,
      lang: "py",
      walkthrough: [
        "**The complexity compass, minus the formality**: BQP is 'what quantum computers solve efficiently'. Known relationships: BQP contains everything classical computers do efficiently (P), plus a few celebrated extras (factoring, discrete logs, quantum simulation). Strongly believed: BQP does **not** contain the NP-complete problems — Grover's provable √-only limit (stage 8) is the evidence-in-miniature. So the correct one-liner for colleagues: quantum computers are a **new axis** of capability, sideways from the P-vs-NP ladder, not a cheat code up it.",
        "**The myth checklist, ready to deploy**: 'QC speeds up everything' — no; most code sees zero benefit and enormous overhead. 'QC solves NP-complete/optimization problems' — believed false; heuristics like QAOA exist but with no proven advantage (scoreboard card). 'QC = infinite parallelism' — you know the real story is interference (stage 2, forever). 'Quantum internet will replace TCP/IP' — entanglement carries no signals (stage 3). Each myth dies to a specific stage you have already done.",
        "**The honest near-term hope is Feynman's original one**: simulating quantum systems — molecules, catalysts, battery chemistry, superconductors — where the 2^n wall (stage 0) blocks classical methods at painfully small sizes. Exact classical simulation tops out around 50 electrons' worth of full quantum detail; industrially interesting molecules sit just past classical reach, which is why chemistry keeps being everyone's first-customer bet, ahead of finance and ML.",
        "**Run the capstone and treat it as a lab, not a demo**: predict every histogram before running (you can — that is the point of the course). The Bell counts should wobble around 500/500 by ±√250 ≈ 16 (stage 6's shot noise); Grover-N=4 should be exactly 1000 on '11' because the rotation lands exactly on the target — check the paper walk in the comments.",
        "**Extend it while it's warm**: change the Grover oracle to mark |01⟩ instead of |11⟩ (conjugate the CZ with an X on the right qubit — remember Qiskit's bit order from stage 5), rebuild the N=8 version from stage 8 with three qubits, or add stage 7's Deutsch-Jozsa as program 4. Twenty minutes of edits cements more than rereading any stage.",
        "**If you do the real-hardware run**, you complete the course's full arc in one histogram: designed interference (stages 2–8) executing on hardware fighting decoherence (stage 10), producing 1–5% forbidden outcomes '01'/'10' — physical error rates, visible to you, on a dilution refrigerator you will never see. Compare counts with the simulator run and compute the fidelity yourself.",
        "**Where you now stand**: you can hand-walk amplitudes through any small circuit, explain the only two cryptographically scary algorithms and their real costs, price a press release in logical qubits, and justify the Kyber/Dilithium/SPHINCS+ roster from first principles. That is the working programmer's complete quantum literacy — and if a stage-9-relevant machine ever gets close, you'll recognize the milestones before the headlines do.",
      ],
      exercise:
        "The capstone, in full:\n" +
        "  1. Install qiskit + qiskit-aer and run capstone.py. Confirm both histograms\n" +
        "     match your paper predictions (write the predictions FIRST).\n" +
        "  2. Modify Grover to mark |01⟩ and verify 1000/1000 on the new target.\n" +
        "  3. Port stage 8's N=8 Grover into the file; sweep 1-4 iterations and plot\n" +
        "     (even as ASCII) the success curve, overshoot included.\n" +
        "  4. Add Deutsch-Jozsa (stage 7) with one constant and one balanced oracle.\n" +
        "  5. Optional but recommended: run the Bell circuit on IBM's free tier and\n" +
        "     report the error rate: (counts of 01 + counts of 10) / 1000.\n" +
        "  6. Close the loop: reread your hash.carino.systems Lamport page and add one\n" +
        "     paragraph connecting it to Grover-only attack surface. You now own every\n" +
        "     claim in it.",
      drills: [
        "Give the two-sentence BQP-vs-NP answer for a colleague who asks if quantum computers solve the traveling salesman problem.",
        "Name three tasks with proven or strongly-expected quantum advantage and three popular tasks with none.",
        "Why is quantum chemistry the consensus near-term application rather than optimization or ML?",
        "In your real-hardware Bell run, what do '01'/'10' counts measure, and which stage-10 numbers do they trace back to?",
        "A recruiter asks what a quantum computer will do for a web-dev shop. Give the honest 30-second answer.",
      ],
      note:
        "Where to go from here, in effort order: run everything in this course on real IBM hardware " +
        "(free); read Nielsen & Chuang chapters 1-2 and 4 (the field's bible — you already speak its " +
        "language now); implement Simon's algorithm, the bridge between Deutsch-Jozsa and Shor; then " +
        "the Gidney-Ekera paper for the RSA-2048 resource estimate you quoted in stage 9. And keep the " +
        "annual habit: check the logical-qubit count and the physical-per-logical ratio each year — " +
        "those two numbers ARE the countdown clock.",
    },
  ],
};
/* =====================================================================
   Interactive labs — self-registered (merge-safe with viz.js/labs.js).
   Headline: a real single-qubit simulator. Mini-labs: Bell correlator
   (at 3), Grover geometry on N=16 (at 8), the RSA countdown (at 9).
   All quantum states are simulated honestly with real amplitude vectors.
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

  const R2 = Math.SQRT1_2;
  const snap = (v) => (Math.abs(v) < 1e-12 ? 0 : Math.abs(v - 1) < 1e-12 ? 1 : Math.abs(v + 1) < 1e-12 ? -1 : v);
  const f3 = (v) => (Object.is(v, -0) ? 0 : v).toFixed(3).replace("-0.000", "0.000");

  /* =================================================================
     HEADLINE — one qubit, for real
     ================================================================= */
  VIZ["quantum"] = {
    title: "One qubit, for real",
    blurb:
      "A working single-qubit simulator: the state is literally two signed amplitudes, " +
      "and each button multiplies them by the real 2×2 matrix. Try **H, H** from |0⟩ and " +
      "watch interference cancel the |1⟩ path — then try **X, H, H** and see the minus " +
      "sign steer the round trip back to |1⟩. `Measure` collapses by the Born rule.",
    mount(host) {
      let a = 1, b = 0;
      let msg = "state |0⟩ = (1, 0). Apply gates — each one is a real 2×2 matrix on this pair.";
      let hist = null; // {c0, c1} from last shots run

      host.innerHTML = `
        <div class="viz qbviz">
          <div class="viz-ctrls wrap">
            <button class="viz-btn mono" data-g="X">X</button>
            <button class="viz-btn mono" data-g="H">H</button>
            <button class="viz-btn mono" data-g="Z">Z</button>
            <button class="viz-btn" data-a="measure">Measure</button>
            <button class="viz-btn" data-a="shots">Run 100 shots</button>
            <button class="viz-btn" data-a="reset">Reset |0⟩ ⟲</button>
          </div>
          <div class="gnu-flow">
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>amplitudes</code><span data-r="probs"></span></div>
              <div class="gnu-pane-b" data-r="bars" style="display:flex;gap:18px;justify-content:center;padding:10px 6px"></div>
            </div>
            <div class="gnu-arrow">⇢</div>
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>state dial</code><span data-r="angle"></span></div>
              <div class="gnu-pane-b" data-r="dial" style="display:flex;justify-content:center;padding:6px"></div>
            </div>
            <div class="gnu-arrow">⇢</div>
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>shots histogram</code><span data-r="shotn"></span></div>
              <div class="gnu-pane-b" data-r="hist" style="padding:10px"></div>
            </div>
          </div>
          <p class="asm-msg" data-r="msg"></p>
        </div>`;

      const ampBar = (amp, label) => {
        const h = Math.max(1, Math.round(Math.abs(amp) * 56));
        const pos = amp >= 0;
        return `<div style="width:76px;text-align:center">
          <div style="position:relative;height:120px">
            <div style="position:absolute;left:6px;right:6px;top:60px;border-top:1px solid #71717a"></div>
            <div style="position:absolute;left:22px;right:22px;${pos ? "bottom:60px" : "top:61px"};height:${h}px;background:${pos ? "#eab308" : "#ef4444"};border-radius:2px"></div>
          </div>
          <code>${label}</code> <span class="ln-dim">${f3(amp)}</span>
        </div>`;
      };

      function paint() {
        a = snap(a); b = snap(b);
        const p0 = a * a, p1 = b * b;
        $('[data-r="probs"]', host).textContent = `P(0)=${(p0 * 100).toFixed(1)}%  P(1)=${(p1 * 100).toFixed(1)}%`;
        $('[data-r="bars"]', host).innerHTML = ampBar(a, "|0⟩ amp") + ampBar(b, "|1⟩ amp");
        const deg = Math.round(Math.atan2(b, a) * 180 / Math.PI);
        $('[data-r="angle"]', host).textContent = `θ = ${deg}°`;
        const x = 50 + a * 38, y = 50 - b * 38;
        $('[data-r="dial"]', host).innerHTML =
          `<svg viewBox="0 0 100 100" width="128" height="128" role="img" aria-label="qubit state on the unit circle">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#71717a" stroke-width="1"/>
            <line x1="8" y1="50" x2="92" y2="50" stroke="#71717a" stroke-width="0.5"/>
            <line x1="50" y1="8" x2="50" y2="92" stroke="#71717a" stroke-width="0.5"/>
            <line x1="50" y1="50" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#eab308" stroke-width="2.5"/>
            <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="#eab308"/>
            <text x="91" y="47" font-size="7" fill="#71717a">|0⟩</text>
            <text x="54" y="10" font-size="7" fill="#71717a">|1⟩</text>
          </svg>`;
        const histEl = $('[data-r="hist"]', host);
        if (!hist) {
          $('[data-r="shotn"]', host).textContent = "—";
          histEl.innerHTML = `<span class="ln-dim">press “Run 100 shots”</span>`;
        } else {
          $('[data-r="shotn"]', host).textContent = "100 shots";
          const row = (k, n, col) =>
            `<div style="display:flex;align-items:center;gap:8px;margin:6px 0">
              <code>${k}</code>
              <div style="flex:1;height:14px;background:rgba(113,113,122,.18);border-radius:2px">
                <div style="width:${n}%;height:100%;background:${col};border-radius:2px"></div>
              </div>
              <span class="ln-dim" style="min-width:2.5em;text-align:right">${n}</span>
            </div>`;
          histEl.innerHTML = row("0", hist.c0, "#3b82f6") + row("1", hist.c1, "#eab308");
        }
        $('[data-r="msg"]', host).innerHTML = fmt(msg);
      }

      const stateName = () => {
        if (a === 1 && b === 0) return "|0⟩";
        if (a === 0 && b === 1) return "|1⟩";
        if (a === 0 && b === -1) return "−|1⟩ (a global sign — physically the same as |1⟩)";
        if (Math.abs(a - R2) < 1e-9 && Math.abs(b - R2) < 1e-9) return "|+⟩";
        if (Math.abs(a - R2) < 1e-9 && Math.abs(b + R2) < 1e-9) return "|−⟩";
        return "";
      };

      host.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-g],[data-a]");
        if (!btn) return;
        const g = btn.dataset.g, act = btn.dataset.a;
        hist = g || act === "reset" || act === "measure" ? null : hist;

        if (g === "X") {
          [a, b] = [b, a];
          msg = `**X** swaps the amplitudes: state is now (${f3(a)}, ${f3(b)})` + (stateName() ? ` = ${stateName()}` : "") + ". Probabilities swapped with it.";
        } else if (g === "Z") {
          const was1 = b !== 0;
          b = -b;
          msg = was1
            ? `**Z** flips the sign of the |1⟩ amplitude: (${f3(a)}, ${f3(b)})` + (stateName() ? ` = ${stateName()}` : "") + ". P(0)/P(1) are **unchanged** — the sign is invisible until an H makes it interfere."
            : "**Z** on this state does nothing visible — the |1⟩ amplitude is 0, so there is no sign to flip.";
        } else if (g === "H") {
          const oa = a, ob = b;
          a = snap(R2 * (oa + ob)); b = snap(R2 * (oa - ob));
          if ((Math.abs(oa) > 1e-9 && Math.abs(ob) > 1e-9) && (a === 0 || b === 0 || Math.abs(a) === 1 || Math.abs(b) === 1)) {
            const dead = b === 0 ? "|1⟩" : "|0⟩";
            msg = `**H** recombined the paths: (${f3(oa)}, ${f3(ob)}) → (${f3(a)}, ${f3(b)}). The two contributions into ${dead} had **opposite signs and canceled** — that zero is destructive interference, live. (H·H = identity: the sign bookkeeping guarantees the round trip.)`;
          } else if (oa === 1 && ob === 0) {
            msg = `**H** on |0⟩ gives (${f3(a)}, ${f3(b)}) = |+⟩ — an equal split, both signs positive.`;
          } else if (oa === 0 && Math.abs(ob) === 1) {
            msg = `**H** on |1⟩ gives (${f3(a)}, ${f3(b)}) — same 50/50 probabilities as |+⟩ but a **minus sign on the |1⟩ path**. Apply H again and watch that sign cancel the |1⟩ contributions.`;
          } else {
            msg = `**H** mixes the pair: (${f3(oa)}, ${f3(ob)}) → (${f3(a)}, ${f3(b)}).`;
          }
        } else if (act === "measure") {
          const p1 = b * b;
          const got1 = Math.random() < p1;
          msg = `**Measure**: Born rule rolled P(1) = ${(p1 * 100).toFixed(1)}% → got **${got1 ? 1 : 0}**. The state **collapsed** to ${got1 ? "|1⟩" : "|0⟩"}; the old amplitudes are gone for good.`;
          a = got1 ? 0 : 1; b = got1 ? 1 : 0;
        } else if (act === "shots") {
          const p1 = b * b;
          let c1 = 0;
          for (let i = 0; i < 100; i++) if (Math.random() < p1) c1++;
          hist = { c0: 100 - c1, c1 };
          msg = `**100 shots** of preparing this same state and measuring: ${hist.c0}× zero, ${hist.c1}× one (expected ${Math.round((1 - p1) * 100)}/${Math.round(p1 * 100)}). Statistics is the readout — one shot alone tells you almost nothing. The state itself is untouched here because each shot re-prepares it.`;
        } else if (act === "reset") {
          a = 1; b = 0;
          msg = "back to |0⟩ = (1, 0). Suggested tours: H,H (cancellation) · X,H,H (the sign steers it back to |1⟩) · H,Z,H (phase flip becomes bit flip).";
        }
        paint();
      });
      paint();
    },
  };

  /* =================================================================
     MINI-LABS
     ================================================================= */
  LABS["quantum"] = [

    /* ---- at 3: the Bell pair correlator --------------------------- */
    {
      at: 3,
      title: "The Bell pair correlator",
      blurb:
        "The honest 4-amplitude state (0.707, 0, 0, 0.707), sampled by the Born rule — " +
        "versus **two classical random coins**. Same per-qubit randomness, completely " +
        "different joint story: quantum mode never once prints `01` or `10`.",
      mount(host) {
        let mode = "q";           // "q" bell pair | "c" classical coins
        let counts, log;
        const reset = () => { counts = { "00": 0, "01": 0, "10": 0, "11": 0 }; log = []; };
        reset();

        // the real state: amplitudes over (00, 01, 10, 11)
        const AMPS = [Math.SQRT1_2, 0, 0, Math.SQRT1_2];
        const KEYS = ["00", "01", "10", "11"];
        const sampleQ = () => {
          const r = Math.random();
          let acc = 0;
          for (let i = 0; i < 4; i++) { acc += AMPS[i] * AMPS[i]; if (r < acc) return KEYS[i]; }
          return "11";
        };
        const sampleC = () => (Math.random() < 0.5 ? "0" : "1") + (Math.random() < 0.5 ? "0" : "1");
        const sample = () => (mode === "q" ? sampleQ() : sampleC());

        host.innerHTML = `
          <div class="viz bellviz">
            <div class="viz-ctrls wrap">
              <button class="viz-btn mono" data-m="q">Bell pair (quantum)</button>
              <button class="viz-btn mono" data-m="c">two classical coins</button>
              <button class="viz-btn" data-a="one">measure one pair</button>
              <button class="viz-btn" data-a="many">measure 500 pairs</button>
              <button class="viz-btn" data-a="clear">Clear ⟲</button>
            </div>
            <div class="gnu-flow">
              <div class="gnu-pane">
                <div class="gnu-pane-h"><code>counts</code><span data-r="tot"></span></div>
                <div class="gnu-pane-b"><div class="lnx-read" data-r="counts"></div></div>
              </div>
              <div class="gnu-arrow">⇢</div>
              <div class="gnu-pane">
                <div class="gnu-pane-h"><code>Alice · Bob log</code><span data-r="logn"></span></div>
                <pre class="pacs-log" data-r="log" style="max-height:150px;overflow-y:auto;margin:0"></pre>
              </div>
            </div>
            <p class="asm-msg" data-r="msg"></p>
          </div>`;

        let msg = "quantum mode: the joint state is (0.707, 0, 0, 0.707) over (00, 01, 10, 11) — the Born rule is rolled on those four squared amplitudes, nothing else.";

        function paint() {
          $$("[data-m]", host).forEach((btn) => btn.classList.toggle("primary", btn.dataset.m === mode));
          const tot = KEYS.reduce((s, k) => s + counts[k], 0);
          $('[data-r="tot"]', host).textContent = tot ? `${tot} pairs` : "—";
          $('[data-r="counts"]', host).innerHTML = KEYS.map((k) => {
            const zero = counts[k] === 0 && tot > 0 && (k === "01" || k === "10") && mode === "q";
            return `<div class="lnx-out"><span>${k}</span><code${zero ? ' style="color:#22c55e"' : ""}>${counts[k]}${zero ? " ← impossible" : ""}</code></div>`;
          }).join("");
          $('[data-r="logn"]', host).textContent = log.length ? `last ${Math.min(log.length, 24)}` : "—";
          $('[data-r="log"]', host).innerHTML = log.slice(-24).map((k) =>
            `<div class="pacs-line ${k === "00" || k === "11" ? "" : "err"}">A=${k[0]}  B=${k[1]}  ${k[0] === k[1] ? "agree" : "DISAGREE"}</div>`).join("") || '<span class="ln-dim">no measurements yet</span>';
          $('[data-r="msg"]', host).innerHTML = fmt(msg);
        }

        host.addEventListener("click", (e) => {
          const m = e.target.closest("[data-m]");
          if (m) {
            mode = m.dataset.m; reset();
            msg = mode === "q"
              ? "quantum mode: sampling the real 4-amplitude Bell state. Each qubit alone is a fair coin — but `01`/`10` have amplitude 0, so they **never** occur."
              : "classical mode: two independent fair coins — the 'it's just synced randomness' hypothesis. Watch all **four** outcomes appear ~equally.";
            paint(); return;
          }
          const btn = e.target.closest("[data-a]"); if (!btn) return;
          const act = btn.dataset.a;
          if (act === "clear") { reset(); msg = "cleared."; }
          else if (act === "one") {
            const k = sample(); counts[k]++; log.push(k);
            msg = mode === "q"
              ? `Alice got **${k[0]}**, Bob got **${k[1]}** — random individually, equal every single time. No message traveled: the correlation only exists once you compare the two logs.`
              : `coins: A=${k[0]}, B=${k[1]}. Independent coins agree only half the time — keep pressing and the disagreements pile up.`;
          } else if (act === "many") {
            for (let i = 0; i < 500; i++) { const k = sample(); counts[k]++; log.push(k); }
            msg = mode === "q"
              ? "500 pairs: ~250/~250 split between `00` and `11`, and **exactly zero** `01`/`10`. Two synced coins could fake THIS table — but measure in tilted bases and quantum correlations beat every possible pre-agreement (Bell/CHSH: classical ceiling 2, quantum 2√2 ≈ 2.83 — tested loophole-free, Nobel 2022). This lab shows the correlation; Bell's theorem shows it isn't secretly classical."
              : "500 coin pairs: all four outcomes near 125 — the classical signature. Compare with quantum mode's empty `01`/`10` columns: same marginals, different world.";
          }
          paint();
        });
        paint();
      },
    },
    /* ---- at 8: Grover, geometrically ------------------------------ */
    {
      at: 8,
      title: "Grover, geometrically",
      blurb:
        "Sixteen real amplitudes. Click a bar to hide the needle, then step: the oracle " +
        "**flips the marked sign**, the diffuser **inverts everything about the mean** — " +
        "the actual arithmetic, no faking. Optimal is ⌊π/4·√16⌋ = **3 steps (≈96%)**; " +
        "keep stepping and watch the rotation overshoot and success **fall**.",
      mount(host) {
        const N = 16;
        let amps, iter, marked = 5, prevP, msg;
        const reset = (keepMsg) => {
          amps = Array(N).fill(1 / Math.sqrt(N));
          iter = 0; prevP = 1 / N;
          if (!keepMsg) msg = "uniform start: all 16 amplitudes = 0.25, so P(marked) = 6.25% — a blind guess. Click any bar to move the secret item, then run a Grover step.";
        };
        reset();

        host.innerHTML = `
          <div class="viz grovviz">
            <div class="viz-ctrls wrap">
              <button class="viz-btn primary" data-a="step">oracle + diffuse ▸ (1 Grover step)</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <div data-r="bars" style="display:flex;gap:3px;align-items:stretch;padding:8px 2px"></div>
            <p class="asm-msg" data-r="msg"></p>
          </div>`;

        function paint() {
          const p = amps[marked] * amps[marked];
          $('[data-r="stat"]', host).textContent =
            `iteration ${iter} — P(find marked) = ${(p * 100).toFixed(1)}%`;
          $('[data-r="bars"]', host).innerHTML = amps.map((amp, i) => {
            const h = Math.max(1, Math.round(Math.abs(amp) * 52));
            const pos = amp >= 0;
            const col = i === marked ? "#eab308" : pos ? "#3b82f6" : "#ef4444";
            return `<div data-i="${i}" title="item ${i}: amp ${amp.toFixed(3)}" style="flex:1;cursor:pointer;text-align:center">
              <div style="position:relative;height:112px;${i === marked ? "outline:1px solid #eab308;outline-offset:1px;border-radius:2px;" : ""}">
                <div style="position:absolute;left:0;right:0;top:56px;border-top:1px solid #71717a"></div>
                <div style="position:absolute;left:15%;right:15%;${pos ? "bottom:56px" : "top:57px"};height:${h}px;background:${col};border-radius:1px"></div>
              </div>
              <span class="ln-dim" style="font-size:.62rem">${i === marked ? "★" : i}</span>
            </div>`;
          }).join("");
          $('[data-r="msg"]', host).innerHTML = fmt(msg);
        }

        host.addEventListener("click", (e) => {
          const cell = e.target.closest("[data-i]");
          if (cell) {
            marked = +cell.dataset.i;
            reset(true);
            msg = `secret item is now **${marked}** — state reset to uniform. The oracle knows the index; the algorithm only ever asks it for sign flips.`;
            paint(); return;
          }
          const btn = e.target.closest("[data-a]"); if (!btn) return;
          if (btn.dataset.a === "reset") { reset(); paint(); return; }
          // --- one real Grover iteration ---
          amps[marked] = -amps[marked];                       // oracle: sign flip
          const mean = amps.reduce((s, x) => s + x, 0) / N;    // diffuser:
          amps = amps.map((x) => 2 * mean - x);                // invert about mean
          iter++;
          const p = amps[marked] * amps[marked];
          if (p > prevP) {
            msg = iter === 3
              ? `step ${iter}: P = **${(p * 100).toFixed(1)}%** — the optimal stop (π/4·√16 ≈ 3.14 → 3 steps). Measure now. One more step and the rotation keeps turning **past** the target…`
              : `step ${iter}: oracle made the marked amplitude negative, which dragged the mean down; inversion about the mean reflected it **above** the crowd. P: ${(prevP * 100).toFixed(1)}% → **${(p * 100).toFixed(1)}%**.`;
          } else {
            msg = `step ${iter}: **overshoot** — P fell ${(prevP * 100).toFixed(1)}% → **${(p * 100).toFixed(1)}%**. Grover is a rotation, not a ratchet: two reflections turn the state by a fixed angle every step, and past the target it turns **away**. (Keep stepping: it is periodic and will swing back.)`;
          }
          prevP = p;
          paint();
        });
        paint();
      },
    },

    /* ---- at 9: the RSA countdown ----------------------------------- */
    {
      at: 9,
      title: "The RSA countdown",
      blurb:
        "Pick a key size and a hardware scenario: the lab prices the classical attack " +
        "(GNFS), the quantum bill (**2n+3 logical qubits**), and delivers a verdict — " +
        "plus the Grover flip side for AES. Honest numbers, honest uncertainty.",
      mount(host) {
        const KEYS = {
          1024: { gnfs: "feasible for a nation-state-class effort — deprecated since 2010, retire on classical grounds alone" },
          2048: { gnfs: "≈ 10^20 core-years (GNFS) — safe from every classical computer on Earth" },
          3072: { gnfs: "≈ 10^26 core-years — classical margin: comfortable" },
          4096: { gnfs: "≈ 10^31 core-years — classical margin: absurd" },
        };
        const SCEN = {
          nisq:   { label: "2026 NISQ (~1,000 noisy physical)",      logical: 0,
                    cap: "~1,000 physical qubits, no error correction → **0** usable logical qubits for Shor" },
          earlyft:{ label: "early fault-tolerant (~5,000 logical)",  logical: 5000,
                    cap: "~5,000 logical qubits (≈ 5 million physical at 1000:1) — the first cryptographically scary machine" },
          mature: { label: "mature (~1,000,000 logical)",            logical: 1000000,
                    cap: "~1M logical qubits — Shor on any RSA size is a batch job" },
        };
        let bits = 2048, scen = "nisq";

        host.innerHTML = `
          <div class="viz rsaviz">
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">RSA key size</span>
              ${Object.keys(KEYS).map((k) => `<button class="viz-btn mono" data-k="${k}">${k}</button>`).join("")}
            </div>
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">hardware scenario</span>
              ${Object.keys(SCEN).map((s) => `<button class="viz-btn mono" data-s="${s}">${SCEN[s].label}</button>`).join("")}
            </div>
            <div class="lnx-read" data-r="rows"></div>
            <p class="asm-msg" data-r="verdict"></p>
          </div>`;

        function paint() {
          $$("[data-k]", host).forEach((btn) => btn.classList.toggle("primary", +btn.dataset.k === bits));
          $$("[data-s]", host).forEach((btn) => btn.classList.toggle("primary", btn.dataset.s === scen));
          const need = 2 * bits + 3;
          const have = SCEN[scen].logical;
          const broken = have >= need;
          const rows = [
            ["classical attack (GNFS)", KEYS[bits].gnfs],
            ["Shor needs (2n+3 rule of thumb)", `${need.toLocaleString()} logical qubits`],
            ["…as physical qubits (~1,000:1)", `≈ ${(need / 1000).toFixed(1)} million physical + billions of clean sequential cycles`],
            ["this scenario provides", SCEN[scen].cap.replace(/\*\*/g, "")],
            ["Grover vs AES-128", "2^64 sequential quantum AES calls — uncomfortable on paper, impractical in any realistic machine-time budget"],
            ["Grover vs AES-256", "2^128 quantum calls — untouchable; this is why the advice is simply: use AES-256"],
          ];
          $('[data-r="rows"]', host).innerHTML = rows.map(([k, v]) =>
            `<div class="lnx-out"><span>${esc(k)}</span><code>${esc(v)}</code></div>`).join("");
          let verdict;
          if (broken) {
            verdict = `**RSA-${bits}: BROKEN in this scenario** (${have.toLocaleString()} ≥ ${need.toLocaleString()} logical). Every signature ever made with such a key becomes forgeable, and all recorded handshakes open. The fix is not bigger RSA — 4096 only nudges the qubit bill — it is **switching math**: ML-KEM + ML-DSA, stage 11.`;
          } else if (scen === "nisq") {
            verdict = `**RSA-${bits}: safe today** — 2026 hardware provides zero usable logical qubits for a ${need.toLocaleString()}-logical-qubit job. But traffic recorded **now** is decryptable **then**: if your data must stay secret past the machine's arrival, harvest-now-decrypt-later means you are already on the clock. The defense (and the schedule) is stage 11.`;
          } else {
            verdict = `**RSA-${bits}: survives this scenario** (needs ${need.toLocaleString()}, scenario has ${have.toLocaleString()}) — but read that as a countdown, not an all-clear: the 2n+3 bill grows linearly while machines grow on their own curve. Migration beats key-size arms races: stage 11.`;
          }
          $('[data-r="verdict"]', host).innerHTML = fmt(verdict);
        }

        host.addEventListener("click", (e) => {
          const k = e.target.closest("[data-k]");
          if (k) { bits = +k.dataset.k; paint(); return; }
          const s = e.target.closest("[data-s]");
          if (s) { scen = s.dataset.s; paint(); }
        });
        paint();
      },
    },
  ];
})();
