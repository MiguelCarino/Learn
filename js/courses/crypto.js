/* =====================================================================
   Carino Learn — course: Cryptography  (secrets, signatures & trust)
   Goal: take someone who has only ever **used** HTTPS from "what does
   cryptography even promise?" through breaking a Caesar cipher, running
   openssl by hand, understanding AES modes, hashes, HMAC, Diffie-Hellman,
   RSA/ECC, signatures, certificates, password storage, real-world failures
   and finally the post-quantum migration.
   Same beginner-first contract as the other modules: every stage has a
   rich `walkthrough` and small `drills`. Written for Miguel, who built
   hash.carino.systems (live SHA-256 visualiser + a Lamport signature demo)
   and runs the carino.systems fleet — those get referenced where they fit.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["crypto"] = {
  id: "crypto",
  title: "Cryptography",
  tag: "secrets, signatures & trust",
  icon: "lock",
  blurb: "From breaking Caesar to post-quantum keys: how confidentiality, integrity and trust actually work.",
  intro:
    "Cryptography is the small pile of maths that lets strangers keep secrets, prove who they are, and " +
    "detect tampering — on a network run by adversaries. This course starts where you can win: breaking a " +
    "cipher with a dozen lines of Python. Then it builds up the modern toolkit one primitive at a time — " +
    "**randomness**, **AES**, **hashes**, **HMAC**, **Diffie-Hellman**, **RSA and elliptic curves**, " +
    "**signatures**, **certificates** — using `openssl` on your own machine so nothing stays abstract. " +
    "It closes honestly: how crypto fails in the field (nonce reuse, ECB, rolling your own) and what the " +
    "quantum computers on the horizon do to all of it. You already built hash.carino.systems, so you have " +
    "seen SHA-256 and Lamport signatures move; here is the whole map they live on.",
  meta: [["Primitives", "AES · SHA-2 · RSA · ECC"], ["Toolkit", "openssl · python3"], ["Style", "break it, then trust it"]],

  tracks: [
    { id: "secrets",  label: "Keeping secrets",     stages: [0, 1, 2, 3] },
    { id: "identity", label: "Integrity & identity", stages: [4, 5, 6] },
    { id: "pubkey",   label: "Public keys & trust",  stages: [7, 8, 9] },
    { id: "practice", label: "Practice & the future", stages: [10, 11, 12] },
  ],

  reference: [
    {
      kind: "table",
      title: "Algorithm cheat-sheet — what to reach for in 2026",
      head: ["algorithm", "type · status & use"],
      rows: [
        ["AES-256-GCM", "symmetric AEAD — the default for encrypting data; confidentiality + integrity in one"],
        ["ChaCha20-Poly1305", "symmetric AEAD — AES's rival; faster in software without AES hardware (mobile, embedded)"],
        ["SHA-256 / SHA-3", "hash — integrity, fingerprints, commitments; SHA-256 is everywhere, SHA-3 the newer sponge"],
        ["HMAC-SHA256", "keyed hash (MAC) — proves a message came from someone holding the key"],
        ["RSA-2048/3072", "public-key — signatures and key transport; large keys, slow, ubiquitous, being phased toward ECC"],
        ["ECDSA / Ed25519", "public-key on elliptic curves — small fast signatures; Ed25519 is the modern default"],
        ["X25519", "elliptic-curve key exchange — the Diffie-Hellman used in modern TLS"],
        ["argon2id", "password KDF — deliberately slow + memory-hard; the current recommendation for storing passwords"],
        ["ML-KEM (Kyber)", "post-quantum key exchange — NIST standard FIPS 203, quantum-resistant"],
        ["ML-DSA (Dilithium)", "post-quantum signature — NIST standard FIPS 204"],
        ["MD5 / SHA-1 / DES / RC4", "BROKEN — collisions or trivial breaks; never for security, only legacy checksums"],
      ],
      foot: "Rule of thumb: **encrypt with AES-GCM, hash with SHA-256, sign with Ed25519, store passwords with argon2id** — and reach for nothing you rolled yourself.",
    },
    {
      kind: "table",
      title: "Key & hash sizes that actually matter",
      head: ["parameter", "size · why"],
      rows: [
        ["Symmetric key (AES)", "128-bit = safe today, 256-bit = safe against quantum's halving; brute force is 2^128 either way today"],
        ["Hash output (SHA-256)", "256 bits → collision resistance ~2^128 (birthday bound = half the bits)"],
        ["RSA modulus", "2048-bit minimum, 3072 for long-term; roughly equivalent to a 112–128-bit symmetric key"],
        ["Elliptic curve (P-256, Curve25519)", "256-bit key ≈ RSA-3072 security — an order of magnitude smaller for the same strength"],
        ["Nonce / IV (GCM)", "96 bits, MUST be unique per key — reuse is catastrophic, not just weak"],
        ["Salt (password hash)", "≥128 bits, random, unique per password, stored in the clear alongside the hash"],
        ["ML-KEM-768 key", "~1.2 KB public key — post-quantum safety costs bytes, which is why migration is gradual"],
      ],
      foot: "The birthday bound is the trap: an `n`-bit hash gives only `n/2` bits of collision resistance, which is why SHA-256 (not SHA-128) is the floor.",
    },
    {
      kind: "cmds",
      title: "openssl one-liners you will actually use",
      rows: [
        ["Encrypt a file (AEAD-ish)",  "openssl enc -aes-256-cbc -pbkdf2 -salt -in secret.txt -out secret.enc"],
        ["Decrypt it back",            "openssl enc -d -aes-256-cbc -pbkdf2 -in secret.enc -out secret.txt"],
        ["Hash a file",                "sha256sum file.iso   # or: openssl dgst -sha256 file.iso"],
        ["Random 32-byte key (hex)",   "openssl rand -hex 32"],
        ["Generate an Ed25519 keypair","openssl genpkey -algorithm ed25519 -out key.pem && openssl pkey -in key.pem -pubout -out key.pub"],
        ["Generate RSA-3072",          "openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out rsa.pem"],
        ["Sign a file",                "openssl pkeyutl -sign -inkey key.pem -rawin -in doc.pdf -out doc.sig"],
        ["Verify a signature",         "openssl pkeyutl -verify -pubin -inkey key.pub -rawin -in doc.pdf -sigfile doc.sig"],
        ["Inspect a certificate",      "openssl x509 -in cert.pem -noout -text -subject -issuer -dates"],
        ["Test a live TLS server",     "openssl s_client -connect carino.systems:443 -servername carino.systems </dev/null"],
        ["Hash a password (KDF)",      "openssl passwd -6 -salt \"$(openssl rand -hex 8)\" 'hunter2'   # SHA-512-crypt"],
      ],
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "What cryptography promises",
      tag: "the four guarantees",
      time: "30–40 min",
      payoff:
        "Before any algorithm, know what you are buying. Cryptography sells exactly four guarantees — " +
        "**confidentiality**, **integrity**, **authenticity**, **non-repudiation** — and almost every " +
        "security mistake is reaching for one when you needed another. Learn the four, learn " +
        "Kerckhoffs's principle, and learn to always ask 'which attacker?', and the rest of this course " +
        "is just tools bolted onto this frame.",
      concepts: ["confidentiality", "integrity", "authenticity", "non-repudiation", "Kerckhoffs's principle", "attacker models", "plaintext / ciphertext / key"],
      code:
`             WHAT A CRYPTOSYSTEM CAN PROMISE YOU

  CONFIDENTIALITY  "no one else can READ it"          -> encryption
  INTEGRITY        "no one changed it undetected"     -> hashes / MACs
  AUTHENTICITY     "it really came from who it claims" -> MACs / signatures
  NON-REPUDIATION  "they can't later DENY sending it"  -> signatures only

  The moving parts:
     plaintext  --[ encrypt with KEY ]-->  ciphertext
     ciphertext --[ decrypt with KEY ]-->  plaintext

  KERCKHOFFS'S PRINCIPLE
     The system's security must rest on the KEY, not on the
     algorithm being secret. Assume the enemy owns your source code,
     your binaries and your protocol docs — only the key is yours.

  THE ATTACKER decides everything:
     passive eavesdropper   just listens          (needs confidentiality)
     active man-in-middle   rewrites in flight     (needs authenticity too)
     malicious insider      has partial access     (needs non-repudiation)`,
      lang: "txt",
      walkthrough: [
        "**Confidentiality** hides content: an eavesdropper sees ciphertext and learns nothing about the plaintext. This is the promise people mean by 'encryption' — but it is only one of four, and on its own it is rarely enough.",
        "**Integrity** detects tampering: if a single bit changes in transit, the receiver notices. Encryption alone does NOT give you this — a classic trap is that many ciphertexts can be silently altered, which is why modern schemes bundle integrity in (stage 5).",
        "**Authenticity** proves origin: the message genuinely came from the party holding the right key, not an impostor who spliced themselves into the conversation. A man-in-the-middle attack is precisely an authenticity failure.",
        "**Non-repudiation** is the strong one: the sender cannot later deny it, because only they could have produced the proof. A shared secret (a MAC) can not give this — either party could have made it — so non-repudiation needs a **signature** with a private key (stage 8).",
        "**Kerckhoffs's principle** (1883) is the oldest rule that still holds: never rely on the algorithm being secret. Secret algorithms leak, get reverse-engineered, and cannot be peer-reviewed. Your `hash.carino.systems` visualiser shows every step of SHA-256 in public precisely because openness is a feature — the security is all in the key.",
        "**'Which attacker?' is the first question of every design.** Encrypting a database protects against a stolen disk (passive) but not against a live SQL-injection (insider). Name the adversary and their powers before you name an algorithm.",
        "**Vocabulary lock-in**: plaintext is the readable message, ciphertext the scrambled output, the key is the secret parameter, and a cipher is the transform. Everything after this stage is a specific cipher, hash, or protocol filling one of the four promises.",
      ],
      exercise:
        "For each real scenario, name WHICH of the four guarantees you need (often more than one):\n" +
        "  1. Storing customer credit-card numbers in a database.\n" +
        "  2. A software vendor publishing an installer users will download.\n" +
        "  3. A signed contract you may need to enforce in court next year.\n" +
        "  4. A chat app where a network provider must not read messages.\n" +
        "Then, for scenario 2, explain why confidentiality is NOT one of the needs.",
      drills: [
        "Give the one-word promise each of these delivers: encryption, a hash, a MAC, a digital signature.",
        "Why can a shared-secret MAC provide authenticity but NOT non-repudiation?",
        "State Kerckhoffs's principle in your own words, then give one real product that violated it.",
        "An app 'encrypts' data but an attacker can flip bits to change the decrypted result. Which guarantee is missing?",
      ],
      note:
        "The word 'encryption' in casual use smuggles in all four promises, but the primitives are " +
        "separate and you must combine them deliberately. Almost every headline breach in the last " +
        "decade is a case of shipping one guarantee and assuming the others came free. Keep the " +
        "four-column table above pinned; you will map every later stage back onto it.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "Classical ciphers & how they die",
      tag: "Caesar, Vigenère, frequency",
      time: "40–60 min",
      payoff:
        "Nothing teaches cryptanalysis like breaking something. Classical ciphers are weak enough to " +
        "shatter by hand yet real enough to expose the ideas — substitution, key length, and the " +
        "statistical fingerprint every natural language leaves behind. Break a Caesar cipher in a dozen " +
        "lines of Python and you will forever distrust 'it looks scrambled to me'.",
      concepts: ["substitution cipher", "Caesar / shift cipher", "brute force", "Vigenère (polyalphabetic)", "frequency analysis", "Kasiski / key length", "why classical fails"],
      code:
`#!/usr/bin/env python3
# Break a Caesar cipher with ZERO key knowledge, using English letter
# frequencies. 'E' is the most common letter in English (~12.7%).

CIPHER = "WKLV LV D VHFUHW PHVVDJH"   # someone shifted the alphabet

def shift(text, k):
    out = []
    for c in text:
        if c.isalpha():
            out.append(chr((ord(c) - 65 + k) % 26 + 65))
        else:
            out.append(c)
    return "".join(out)

# 1. BRUTE FORCE: only 25 possible keys — just try them all.
for k in range(26):
    print(f"{k:2d}: {shift(CIPHER, -k)}")

# 2. AUTOMATE the choice: pick the shift whose letter counts look
#    most like English. Score by how often 'E','T','A','O' appear.
COMMON = "ETAOINSHR"
def score(text):
    return sum(text.count(c) for c in COMMON)

best = max(range(26), key=lambda k: score(shift(CIPHER, -k)))
print("best key:", best, "->", shift(CIPHER, -best))
# Caesar has 25 keys. Even without frequency, a human breaks it in seconds.`,
      lang: "py",
      walkthrough: [
        "**A substitution cipher** replaces each letter with another by a fixed rule. Caesar is the simplest: shift every letter by `k` positions. The key is a single number 0–25, so there are only 25 useful keys — a laughably small **keyspace**.",
        "**Brute force wins instantly** when the keyspace is tiny: the loop prints all 25 decryptions and your eye finds the English one. This is the whole lesson of key size — security requires a keyspace too large to enumerate (stage 2 makes this quantitative).",
        "**Frequency analysis** automates the eye. Every language has a lopsided letter distribution — in English `E`, `T`, `A` dominate and `Z`, `Q`, `J` are rare. A monoalphabetic cipher preserves that shape, so the shift that makes the plaintext look most 'English' is almost always the key.",
        "**Vigenère** tried to fix this by using a keyword: letter 1 shifts by the keyword's first letter, letter 2 by its second, and so on, cycling. For centuries it was 'le chiffre indéchiffrable' — because a single letter now maps to several ciphertext letters, flattening the frequency graph.",
        "**But key length betrays it.** If the keyword is 5 letters long, then every 5th letter was shifted by the SAME amount — so slice the ciphertext into 5 columns and each column is just a Caesar cipher again. Find the period (Kasiski examination spots repeated substrings) and Vigenère collapses into several Caesars.",
        "**The common cause of death** is that these ciphers leak structure: patterns in the plaintext survive into the ciphertext. Modern ciphers are judged by the opposite standard — output must be statistically indistinguishable from random noise (the avalanche property you will meet at stage 4).",
        "**Why this still matters**: the attacker mindset here — count things, exploit any deviation from uniform, reduce a hard problem to many easy ones — is exactly how real ciphers get attacked, just with subtler statistics. You cannot judge strength by 'it looks random to me'.",
      ],
      exercise:
        "Run the script above and confirm it recovers the message.\n" +
        "Then extend your understanding by hand:\n" +
        "  1. Encrypt 'ATTACK AT DAWN' with a Caesar shift of 7 and write down the ciphertext.\n" +
        "  2. Write a Vigenere encryptor in Python using the keyword 'KEY'.\n" +
        "  3. Explain, in two sentences, why a 20-character message with a 20-character\n" +
        "     RANDOM key (a one-time pad) cannot be broken by frequency analysis at all.\n" +
        "  4. Then explain why nobody uses one-time pads in practice.",
      drills: [
        "How many possible keys does a Caesar cipher have? Why is brute force trivial?",
        "What statistical property of English does frequency analysis exploit?",
        "How does knowing the Vigenere key length reduce it to solving several Caesar ciphers?",
        "A one-time pad is provably unbreakable — name the two rules that make it so, and why they doom it operationally.",
      ],
      note:
        "The one-time pad is the exception that proves the rule: a truly random key as long as the " +
        "message, never reused, gives perfect secrecy (Shannon proved it). It is useless in practice " +
        "because distributing that much key material securely is the same problem as sending the " +
        "message securely. Every modern cipher is a bargain — stretch a short key into a long " +
        "pseudo-random stream — and stages 2 and 3 are that bargain made rigorous.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "Randomness & the size of keys",
      tag: "entropy, CSPRNGs, brute force",
      time: "40–50 min",
      payoff:
        "Every key, nonce and salt is only as strong as the randomness behind it, and 'random' has a " +
        "precise meaning here that most bugs get wrong. Learn where good randomness comes from, why " +
        "`random.random()` is a loaded gun, and how to compute the brute-force cost of a key size — so " +
        "you can answer 'is 128 bits enough?' with arithmetic instead of a shrug.",
      concepts: ["entropy", "true vs pseudo-random", "CSPRNG", "/dev/urandom vs /dev/random", "seeding", "key size & 2^n", "brute-force cost"],
      code:
`# --- WHERE randomness comes from on Linux ---
# /dev/urandom : kernel CSPRNG, seeded from hardware entropy. USE THIS.
# /dev/random  : same pool on modern kernels; historically blocked. Old advice.
head -c 32 /dev/urandom | xxd          # 32 raw bytes = a 256-bit key
openssl rand -hex 32                    # the same idea, hex-encoded

# --- The brute-force math: a key is a number 2^n big ---
python3 - <<'PY'
for bits in (40, 56, 80, 128, 256):
    keys = 2**bits
    # a fast attacker: 1e12 (a trillion) guesses per second
    seconds = keys / 1e12
    years   = seconds / (365.25*24*3600)
    print(f"{bits:3d}-bit key: {keys:.2e} keys  ~ {years:.2e} years to exhaust")
PY
#  40-bit: crackable in seconds (old export-grade crypto — DEAD)
#  56-bit: DES — brute-forced in <1 day since the 1990s (DEAD)
# 128-bit: ~1e19 years even at a trillion/sec — safe. This is the floor.
# 256-bit: absurdly safe, and keeps a margin against quantum (stage 12).

# --- The classic footgun ---
python3 -c "import random; print(random.random())"   # PREDICTABLE, not secret!
python3 -c "import secrets; print(secrets.token_hex(16))"  # this is the safe one`,
      lang: "bash",
      walkthrough: [
        "**Entropy** is the amount of genuine unpredictability, measured in bits. A key with 128 bits of entropy means an attacker's best strategy is to guess among 2^128 equally likely values. If your 128-bit key was derived from a 4-digit PIN, it has ~13 bits of entropy no matter how long the key looks.",
        "**True vs pseudo-random**: true randomness comes from physical noise (thermal, timing jitter) the kernel harvests. A pseudo-random generator (PRNG) is a deterministic algorithm that stretches a small seed into a long stream. The stream is only as unpredictable as the seed and the algorithm.",
        "**A CSPRNG** (cryptographically secure PRNG) is a PRNG with one extra promise: even seeing lots of output, you cannot predict the next bit or recover the seed. `/dev/urandom`, `openssl rand`, Python's `secrets`, and `crypto.getRandomValues` in browsers are CSPRNGs. `random.random()` and C's `rand()` are NOT — they are for simulations, and using them for keys is a real, exploited bug.",
        "**/dev/urandom vs /dev/random**: old lore said `/dev/random` was 'more secure' because it blocked when entropy ran low. On modern Linux they draw from the same properly-seeded CSPRNG pool; the current advice is unambiguous — use `/dev/urandom` (or `getrandom()`), and never block. The one caveat is very early boot before the pool is seeded.",
        "**Key size is exponential defence.** Add one bit and you double the attacker's work. The table shows why 56-bit DES fell and 128-bit AES will not: at a trillion guesses per second, 2^128 keys take on the order of 10^19 years — longer than the universe has existed, many times over.",
        "**Why 256-bit exists** if 128 is already unbreakable: partly margin, partly future-proofing against quantum computers, whose Grover's algorithm effectively halves symmetric key strength (stage 12). A 256-bit key keeps 128 bits of post-quantum safety — which is exactly why AES-256 is the conservative default.",
        "**Salts and nonces are randomness too**, just with different rules: a nonce must be UNIQUE per key (not necessarily secret), a salt must be unique per password (and can be public). Getting their randomness wrong breaks GCM (stage 11) and password hashing (stage 10) even when the key itself is fine.",
      ],
      exercise:
        "Run the brute-force script and read the numbers, then reason it out:\n" +
        "  1. An attacker upgrades from 1e12 to 1e18 guesses/second (a million-fold GPU farm).\n" +
        "     How many BITS of key strength did they just erase? (Hint: log2 of a million.)\n" +
        "  2. Generate three different 256-bit keys with 'openssl rand -hex 32' and confirm\n" +
        "     they differ completely.\n" +
        "  3. Seed Python's random with random.seed(42), print two values, reseed with 42,\n" +
        "     print again — explain what you observe and why that is fatal for a key.\n" +
        "  4. State the minimum key size you would ship in 2026 for a symmetric cipher, and why.",
      drills: [
        "Define entropy in one sentence. Why does a long key derived from a short password have low entropy?",
        "Name two CSPRNGs and two random sources you must NEVER use for keys.",
        "Each added key bit does what to brute-force cost? So how much harder is 128-bit than 127-bit?",
        "On modern Linux, which of /dev/random and /dev/urandom should you read, and why is the old 'random is stronger' advice wrong?",
      ],
      note:
        "Randomness failures are quiet and devastating: the 2008 Debian OpenSSL bug shrank the key " +
        "space to a few thousand possibilities because a line seeding the PRNG was removed, and years " +
        "of 'random' keys were trivially guessable. When you review any crypto code, the first thing " +
        "to check is where the randomness comes from — it is the load-bearing wall everything else " +
        "rests on.",
    },

    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Symmetric encryption today",
      tag: "AES, modes & the penguin",
      time: "50–70 min",
      payoff:
        "AES is the workhorse that encrypts almost every byte at rest and in flight, but AES alone is not " +
        "a system — the MODE you wrap it in decides whether you get real security or a leaky mess. Learn " +
        "why ECB famously fails (the penguin below), what CBC needs, and why GCM's authenticated " +
        "encryption is the answer you should reach for by default.",
      concepts: ["symmetric key", "AES (block cipher)", "block vs stream", "ECB and why it leaks", "CBC + IV", "GCM / AEAD", "authenticated encryption"],
      code:
`# AES is a BLOCK cipher: it encrypts 16 bytes at a time under one key.
# A MODE decides how to chain those blocks across a whole file.

KEY=$(openssl rand -hex 32)

# --- ECB: encrypt each block independently. DO NOT USE. ---
# identical plaintext blocks -> identical ciphertext blocks -> patterns leak.
openssl enc -aes-256-ecb -K "$KEY" -in cat.bmp -out cat-ecb.bmp   # shape survives!

# --- CBC: each block is XORed with the previous ciphertext first. ---
# needs a random IV; hides patterns, but gives NO integrity by itself.
IV=$(openssl rand -hex 16)
openssl enc -aes-256-cbc -K "$KEY" -iv "$IV" -in secret.txt -out secret.cbc

# --- GCM: encrypt AND authenticate (AEAD). This is the default. ---
# produces ciphertext + an authentication TAG; tampering is detected on decrypt.
# (openssl CLI GCM is fiddly; in code you would use a library)
python3 - <<'PY'
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os
key   = AESGCM.generate_key(bit_length=256)
nonce = os.urandom(12)               # 96-bit nonce, UNIQUE per key
ct = AESGCM(key).encrypt(nonce, b"attack at dawn", b"header-as-associated-data")
print("ciphertext+tag:", ct.hex())
# flip one byte of ct and decrypt -> it raises InvalidTag. That's integrity.
PY`,
      lang: "bash",
      walkthrough: [
        "**Symmetric means one shared key** encrypts and decrypts — fast, but both parties must already share the secret, which is the problem stages 6–7 solve. AES (Advanced Encryption Standard, 2001) is the near-universal choice, in 128- or 256-bit key sizes.",
        "**AES is a block cipher**: it transforms exactly 16 bytes (128 bits) at a time. A stream cipher (like ChaCha20) instead generates a pseudo-random keystream you XOR with the data byte by byte. Both are fine primitives; the danger is entirely in how you use them.",
        "**ECB (Electronic Codebook)** is the naive mode: chop the plaintext into blocks, encrypt each independently. The fatal flaw is determinism — the same 16-byte plaintext always yields the same 16-byte ciphertext, so any repetition in the input becomes visible repetition in the output. Encrypt a bitmap of a penguin (or a cat) and its silhouette survives encryption. Never use ECB.",
        "**CBC (Cipher Block Chaining)** fixes the leak by XORing each plaintext block with the previous ciphertext block before encrypting, so identical blocks encrypt differently depending on position. It needs a random, unpredictable **IV** (initialization vector) for the first block. Crucially, CBC gives confidentiality but NOT integrity — an attacker can flip ciphertext bits to flip plaintext bits, which is how padding-oracle attacks (stage 11) work.",
        "**GCM (Galois/Counter Mode)** is authenticated encryption, or **AEAD**: it turns AES into a stream cipher AND computes an authentication tag over the ciphertext. On decryption, a wrong tag means the data was tampered with (or the key/nonce is wrong) and you get an error instead of garbage plaintext. This bundles confidentiality and integrity — two of your four promises — into one call.",
        "**The nonce rule is absolute**: GCM needs a 96-bit nonce that is UNIQUE for every message under a given key. Reusing a nonce with the same key is catastrophic — it leaks the XOR of plaintexts and can even expose the authentication key. This is the single most common way GCM is misused in the wild (stage 11).",
        "**Associated data** (the 'AD' in AEAD) is the neat extra: data authenticated but not encrypted — a packet header, a version number, a filename. It is bound to the ciphertext by the tag, so an attacker cannot mix a valid ciphertext with a forged header.",
      ],
      exercise:
        "See ECB leak with your own eyes, then do it right:\n" +
        "  1. Take any simple image with large flat regions, convert to a headerless raw/BMP.\n" +
        "  2. Encrypt it with -aes-256-ecb and open the result as an image — you should still\n" +
        "     make out the shapes. (The mini-lab below simulates this if you would rather click.)\n" +
        "  3. Encrypt the same file with -aes-256-cbc and a random IV; confirm it is now noise.\n" +
        "  4. In the Python AES-GCM snippet, flip one byte of the ciphertext before decrypting\n" +
        "     and observe the InvalidTag exception — write one sentence on why that is the point.",
      drills: [
        "Why do identical plaintext blocks produce identical ciphertext in ECB but not in CBC?",
        "What does CBC require for its first block, and what property must that value have?",
        "What TWO of the four guarantees does AES-GCM provide in a single operation?",
        "You reuse a GCM nonce with the same key. Name what breaks — and why it is not merely 'a bit weaker'.",
      ],
      note:
        "The penguin image (Tux, encrypted with ECB) is the most reproduced picture in all of " +
        "cryptography teaching for good reason — one glance makes 'why mode matters' unforgettable. " +
        "The practical takeaway is boring and correct: pick an AEAD mode (AES-GCM or " +
        "ChaCha20-Poly1305), give it a unique nonce, and never hand-roll chaining. The mini-lab " +
        "below lets you flip between ECB and CBC/GCM on a toy image and watch the shape appear " +
        "and vanish.",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "Hash functions",
      tag: "fingerprints for data",
      time: "40–60 min",
      payoff:
        "A hash turns any input into a fixed-size fingerprint, and that one idea underpins integrity " +
        "checks, passwords, digital signatures, blockchains and git. You already watched SHA-256 grind " +
        "through its rounds on hash.carino.systems; here are the three security properties that make it " +
        "trustworthy — and the avalanche effect that makes it feel like magic.",
      concepts: ["hash function", "fixed-size digest", "deterministic", "preimage resistance", "second-preimage", "collision resistance", "avalanche effect"],
      code:
`# A hash: arbitrary input -> fixed 256-bit fingerprint, deterministically.
echo -n "hello" | sha256sum
# 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824  -

echo -n "hellp" | sha256sum          # one letter changed...
# 7d1a54127b222502f5b79b5fb0803061152a44f92b37e23c6527baf665d4da9a  -
# ...and ~half the output bits flip. That's the AVALANCHE effect.

# Same input ALWAYS gives the same digest (deterministic):
echo -n "hello" | sha256sum          # identical to the first line

# Verify a download's integrity: compare against the published hash.
sha256sum ubuntu.iso
openssl dgst -sha256 ubuntu.iso      # identical result, different tool

# The three hardness properties, informally:
#   preimage:        given H, find ANY m with hash(m)=H          -> ~2^256 work
#   second-preimage: given m1, find m2 != m1 with same hash      -> ~2^256 work
#   collision:       find ANY two m1,m2 with same hash           -> ~2^128 work
#                    (the birthday bound: half the bit-length!)`,
      lang: "bash",
      walkthrough: [
        "**A hash function** maps any input, of any length, to a fixed-length output (SHA-256 → 256 bits) by a fully deterministic algorithm. Same input, same digest, every time and everywhere — which is what lets two parties compare fingerprints instead of whole files.",
        "**It is one-way by design.** The output looks random and reveals nothing about the input, and you cannot run it backwards. This is the difference from encryption: a hash has no key and no decrypt — it destroys information deliberately.",
        "**Preimage resistance**: given a digest `H`, it must be infeasible to find any input that hashes to `H`. This is what lets you store a hash of a password instead of the password (stage 10) — the stored value does not reveal the secret.",
        "**Second-preimage resistance**: given a specific input `m1`, it must be infeasible to find a DIFFERENT input `m2` with the same hash. This protects integrity — an attacker cannot swap a file for a malicious one that carries the same published checksum.",
        "**Collision resistance**: it must be infeasible to find ANY two distinct inputs that hash to the same value. This is the weakest of the three because of the **birthday paradox**: finding a collision takes about 2^(n/2) work, not 2^n. So SHA-256 offers ~128 bits of collision resistance, which is exactly why 256-bit output is the sensible floor. MD5 and SHA-1 died here — practical collisions were found and forged certificates followed.",
        "**The avalanche effect** is the visible sign of a healthy hash: change one bit of input and roughly half of the output bits flip, unpredictably. `hello` and `hellp` differ by one bit in one letter, yet their SHA-256 digests share no visible relationship. The mini-lab below lets you flip a single input bit on a toy hash and count how many output bits move.",
        "**Where hashes live**: integrity checks on downloads, git commit IDs (a commit is named by the hash of its contents), content-addressed storage, proof-of-work, and as the first step of every digital signature (stage 8 — you sign the hash, not the document). Your `hash.carino.systems` step-visualiser is a window into exactly the compression rounds that produce these fingerprints.",
      ],
      exercise:
        "Explore the properties hands-on:\n" +
        "  1. Hash the strings 'carino', 'Carino' and 'carino ' (trailing space) with sha256sum;\n" +
        "     note that all three digests are completely unrelated.\n" +
        "  2. Download any file and its published .sha256; verify with 'sha256sum -c'.\n" +
        "  3. Explain why 'find two files with the same hash' is easier than 'find a file with\n" +
        "     THIS specific hash' — name the paradox and the rough work factor for each.\n" +
        "  4. Open your own hash.carino.systems visualiser and watch one round change; relate\n" +
        "     what you see to the avalanche effect.",
      drills: [
        "State the three hardness properties of a cryptographic hash and give a one-line use for each.",
        "Why does a 256-bit hash give only ~128 bits of collision resistance? Name the effect.",
        "MD5 and SHA-1 are broken for which specific property, and what real attack did that enable?",
        "Describe the avalanche effect and why a hash that lacked it would be dangerous.",
      ],
      note:
        "Not every hash is cryptographic: CRC32 and the FNV hash used in the mini-lab below are fast " +
        "checksums with NO security — trivial to collide on purpose. Always distinguish 'detect " +
        "accidental corruption' (a checksum is fine) from 'resist a motivated attacker' (you need " +
        "SHA-256 or SHA-3). The mini-lab labels its 32-bit toy hash honestly for exactly this reason.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "MACs & HMAC",
      tag: "hashing with a key",
      time: "40–50 min",
      payoff:
        "A bare hash proves a file wasn't accidentally corrupted, but it can't stop a deliberate " +
        "attacker — they can just recompute the hash of their forged message. A MAC adds a secret key " +
        "so only key-holders can produce a valid tag. Learn why the obvious construction hash(key||msg) " +
        "is broken, how HMAC fixes it, and how this all folds back into the AEAD you met at stage 3.",
      concepts: ["message authentication code", "integrity + authenticity", "hash(key||msg) is broken", "length-extension attack", "HMAC construction", "constant-time compare", "AEAD recap"],
      code:
`# A plain hash gives NO authenticity: an attacker who rewrites the message
# simply publishes a new hash. You need a SECRET KEY in the mix -> a MAC.

# The TEMPTING but BROKEN construction:  tag = hash(key || message)
#   Because SHA-256 is built from a running internal state (Merkle-Damgard),
#   an attacker who sees hash(key||msg) can CONTINUE hashing and compute
#   hash(key || msg || padding || evil) WITHOUT knowing the key.
#   That is the LENGTH-EXTENSION attack. It really works on SHA-256.

# HMAC is the fix — hash the key in on BOTH ends with two pads:
#   HMAC(K,m) = H( (K xor opad) || H( (K xor ipad) || m ) )
KEY="a-shared-secret-key"
echo -n "transfer \$100 to Bob" | openssl dgst -sha256 -hmac "$KEY"
# only someone who knows KEY can produce or verify this tag.

# Verify by recomputing and comparing — but compare in CONSTANT TIME,
# or the timing of an early mismatch leaks the tag byte by byte (stage 11).

# HMAC also underlies:
#   - PBKDF2 (password stretching), TOTP 2FA codes, JWT 'HS256' signatures
#   - the integrity half of older TLS cipher suites (encrypt-then-MAC)`,
      lang: "bash",
      walkthrough: [
        "**A MAC (Message Authentication Code)** is a keyed fingerprint: `tag = MAC(key, message)`. Anyone with the key can compute or verify the tag; anyone without it cannot forge one. This gives integrity AND authenticity in the shared-secret setting — but NOT non-repudiation, since either key-holder could have made the tag.",
        "**Why not just hash the key with the message?** The obvious `hash(key || message)` is genuinely insecure for hashes like MD5, SHA-1 and SHA-256 because of their internal structure. These hashes process data into a running state and expose that state as the output — so seeing the tag hands an attacker the machine's internal state.",
        "**The length-extension attack** exploits exactly that: knowing `hash(key||msg)` and the length of the key, an attacker can compute `hash(key||msg||padding||anything)` — a valid tag for a message they extended — without ever learning the key. A transfer-of-$100 message becomes transfer-of-$100-and-also-drain-the-account, with a tag that verifies.",
        "**HMAC defeats this** by hashing twice with two derived pads: an inner hash of `(key XOR ipad) || message`, then an outer hash of `(key XOR opad) || innerResult`. The output is the outer hash's state, which is NOT the state that processed your message, so length extension gains nothing. HMAC is proven secure given a reasonable hash, and it is what you should use — never hand-roll a keyed hash.",
        "**Verification must be constant-time.** Comparing the received tag to the computed tag with a normal byte-by-byte compare that returns early on the first mismatch leaks, through timing, how many leading bytes were correct — letting an attacker forge a tag one byte at a time. Use a constant-time comparison (Python's `hmac.compare_digest`, `CRYPTO_memcmp`). This is a real, repeatedly-exploited class of bug (stage 11).",
        "**HMAC is everywhere**: it is the engine inside PBKDF2 password stretching, TOTP two-factor codes, the `HS256` variant of JWTs, API request signing (AWS SigV4), and the MAC half of older TLS suites. Learn it once and you recognise it across a dozen systems.",
        "**AEAD recap**: modern encryption (AES-GCM, ChaCha20-Poly1305 from stage 3) folds the MAC INTO the cipher so you get confidentiality and authenticity from one primitive with one key. When you have AEAD available, prefer it over hand-combining a cipher and a separate HMAC — the combination has subtle ordering pitfalls (encrypt-then-MAC is the only safe order).",
      ],
      exercise:
        "Build intuition for keyed vs unkeyed integrity:\n" +
        "  1. Compute a plain sha256 of a short message, then an HMAC-SHA256 of the same message\n" +
        "     with a key; note that without the key you could reproduce the first but not the second.\n" +
        "  2. Change the key by one character and recompute the HMAC — confirm a totally different tag.\n" +
        "  3. In Python, verify an HMAC using hmac.compare_digest, and write one sentence explaining\n" +
        "     what attack a plain '==' comparison would open up.\n" +
        "  4. Look up one system you use that relies on HMAC (JWT, TOTP, git, AWS) and note where.",
      drills: [
        "What does a MAC add over a plain hash, and which of the four guarantees does it still NOT provide?",
        "Explain the length-extension attack in one or two sentences — why does hash(key||msg) fall to it?",
        "How does HMAC's two-pad construction stop length extension?",
        "Why must tag comparison be constant-time, and what is leaked otherwise?",
      ],
      note:
        "There is a family of newer hashes (SHA-3/Keccak, BLAKE2/3) built as 'sponges' or with keying " +
        "baked in, which are NOT vulnerable to length extension and can be used as MACs more directly. " +
        "But HMAC remains the interoperable default because it works safely on top of the SHA-2 hashes " +
        "everything already speaks. When in doubt: HMAC-SHA256, constant-time compare, done.",
    },

    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Key exchange: Diffie-Hellman",
      tag: "sharing a secret in public",
      time: "45–60 min",
      payoff:
        "Symmetric encryption needs both sides to already share a key — but how, if everything you send " +
        "is public? Diffie-Hellman is the astonishing 1976 answer: two strangers derive a shared secret " +
        "over an open wire while an eavesdropper, seeing every message, cannot compute it. It is the " +
        "handshake under HTTPS, and the headline lab above lets you run it live.",
      concepts: ["key exchange problem", "paint-mixing intuition", "modular exponentiation", "public parameters p, g", "discrete logarithm", "shared secret", "man-in-the-middle"],
      code:
`# Diffie-Hellman with tiny numbers you can check by hand.
# Public, known to EVERYONE (including the attacker): p (a prime) and g.
p = 23        # in reality a 2048-bit+ prime, or an elliptic curve
g = 5         # a generator

# Each side picks a PRIVATE secret and never sends it.
a = 6         # Alice's secret
b = 15        # Bob's secret

# Each computes a PUBLIC value = g^secret mod p, and sends THAT.
A = pow(g, a, p)     # = 5^6  mod 23 = 8   -> Alice sends 8
B = pow(g, b, p)     # = 5^15 mod 23 = 19  -> Bob sends 19

# Each raises the OTHER's public value to their own secret:
s_alice = pow(B, a, p)   # 19^6  mod 23
s_bob   = pow(A, b, p)   # 8^15  mod 23
print(s_alice, s_bob)    # 2 and 2 -> SAME shared secret!

# Why it works:  (g^b)^a = g^(a*b) = (g^a)^b   (mod p)
# Eve saw p, g, A=8, B=19 — and to get the secret she must solve
# g^x = A (mod p) for x. That is the DISCRETE LOGARITHM problem: easy to
# compute g^a, believed HARD to reverse for big primes.`,
      lang: "py",
      walkthrough: [
        "**The problem**: symmetric ciphers are fast and strong, but they assume both parties already hold the same key. If you have never met and the only channel is a wire the attacker is reading, how do you agree on a secret? For decades this looked impossible.",
        "**The paint-mixing intuition**: imagine a public bucket of yellow paint everyone can see. Alice secretly adds her private colour and sends the mix; Bob does the same with his. Then each adds their OWN private colour to the mix they received. Both end up with yellow+Alice+Bob — the identical shade — yet an eavesdropper who saw the two mixes cannot un-mix paint to recover either private colour. Mixing is easy, separating is hard.",
        "**The maths swaps paint for modular exponentiation.** Public parameters are a large prime `p` and a base `g`. Alice's private secret is `a`; she publishes `A = g^a mod p`. Bob publishes `B = g^b mod p`. The magic identity is `(g^a)^b = g^(ab) = (g^b)^a mod p`, so Alice computes `B^a` and Bob computes `A^b` and they land on the same number — the shared secret.",
        "**Why the eavesdropper is stuck**: Eve sees `p`, `g`, `A` and `B`, but to find the secret she must recover `a` from `A = g^a mod p`. That is the **discrete logarithm problem** — computing `g^a` is fast, but inverting it (finding the exponent) is believed to require infeasible work for large, well-chosen `p`. The whole scheme rests on that asymmetry, a **one-way function**.",
        "**Real parameters are huge**: `p` is 2048 bits or more for finite-field DH, or the whole thing is redone over an **elliptic curve** (X25519), where the hard problem is elliptic-curve discrete log and 256-bit keys suffice. Modern TLS uses ephemeral DH (a fresh secret per session) to get **forward secrecy** — stealing today's long-term key does not decrypt yesterday's recorded traffic.",
        "**The fatal gap: authentication.** Plain Diffie-Hellman defeats a passive eavesdropper but NOT an active **man-in-the-middle**. Eve can run one DH with Alice and another with Bob, sitting in the middle and relaying, and both sides think they share a secret with each other while actually sharing one with Eve. DH gives you a secret channel to SOMEONE — proving it is the right someone needs signatures and certificates (stages 8–9).",
        "**The headline lab above is this stage made tangible**: nudge Alice's and Bob's secrets, watch `A` and `B` update, watch both shared-secret computations land on the same value, and see the 'Eve sees' panel that lists only the public numbers — everything the attacker gets, and why it is not enough.",
      ],
      exercise:
        "Run Diffie-Hellman by hand and then break your intuition on purpose:\n" +
        "  1. With p=23, g=5, pick your own a and b (say 4 and 3) and compute A, B and the\n" +
        "     shared secret both ways. Confirm the two sides match.\n" +
        "  2. Play with the headline lab above: find two different (a,b) pairs that yield the\n" +
        "     same shared secret, and explain why small p makes that easy.\n" +
        "  3. On paper, sketch the man-in-the-middle attack: Eve between Alice and Bob running\n" +
        "     two exchanges. What single property, added, would stop her?\n" +
        "  4. State why real deployments use a fresh (ephemeral) secret per session.",
      drills: [
        "In one sentence, what problem does Diffie-Hellman solve that symmetric ciphers cannot?",
        "Which values are public and which are private in a DH exchange? What does each side actually send?",
        "Name the hard problem DH's security rests on, and why computing g^a is easy but reversing it is not.",
        "Plain DH stops a passive eavesdropper but not an active attacker. Which attack, and what fixes it?",
      ],
      note:
        "Diffie and Hellman's 1976 paper 'New Directions in Cryptography' invented public-key thinking; " +
        "RSA arrived a year later giving encryption and signatures from the same well. Everything in the " +
        "next track — RSA, ECC, signatures, TLS — is built on the one idea you just met: a function easy " +
        "to compute forward and believed hard to reverse. Get DH in your bones and the rest is variations.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "RSA & elliptic curves",
      tag: "trapdoor functions",
      time: "50–70 min",
      payoff:
        "Public-key cryptography gives everyone two keys — one to publish, one to guard — and lets " +
        "strangers encrypt to you or verify your signatures without any shared secret. RSA built this " +
        "on factoring; elliptic curves rebuilt it smaller and faster. Learn what a trapdoor function is, " +
        "why RSA-2048 and P-256 are 'equivalent', and generate both with openssl.",
      concepts: ["public / private keypair", "trapdoor one-way function", "RSA & integer factoring", "key sizes RSA-2048 / 3072", "elliptic curves", "P-256 / Curve25519", "why ECC is smaller"],
      code:
`# Public-key = a KEYPAIR. Publish the public key; guard the private key.
# What one key does, only the OTHER can undo.

# --- RSA: security rests on the hardness of FACTORING a big number ---
# n = p*q for secret primes p,q. Easy to multiply, believed hard to factor.
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out rsa.pem
openssl pkey -in rsa.pem -pubout -out rsa.pub          # extract public key
openssl pkey -in rsa.pem -text -noout | head           # peek at the modulus

# --- Elliptic curve: same idea, DIFFERENT hard problem (EC discrete log) ---
# a 256-bit EC key gives security comparable to a 3072-bit RSA key.
openssl genpkey -algorithm ec -pkeyopt ec_paramgen_curve:P-256 -out ec.pem
openssl genpkey -algorithm ed25519 -out ed.pem         # modern signing curve
openssl pkey -in ec.pem -pubout -out ec.pub

# Security-level equivalence (bits of symmetric-equivalent strength):
#   RSA-2048  ~= 112-bit   RSA-3072 ~= 128-bit
#   P-256     ~= 128-bit   Ed25519  ~= 128-bit   (at ~1/12 the key size)
# Smaller keys -> less bandwidth, faster ops, cheaper on embedded devices.`,
      lang: "bash",
      walkthrough: [
        "**A keypair splits the secret in two**: a public key you hand out freely and a private key you never reveal. The two are mathematically linked so that a message locked with one is unlocked only with the other. This dissolves the key-distribution problem — no shared secret needed to start.",
        "**A trapdoor one-way function** is the engine: easy to compute forward, infeasible to reverse WITHOUT a secret 'trapdoor', and easy to reverse WITH it. Diffie-Hellman's one-way function had no trapdoor (nobody can reverse it); RSA adds a trapdoor so the private-key holder specifically CAN invert it.",
        "**RSA rests on factoring.** You pick two large secret primes `p` and `q`, multiply them into a public modulus `n = p*q`, and derive the key pair from them. Multiplying is trivial; factoring `n` back into `p` and `q` is believed infeasible for big enough `n`. Knowing the factors is the trapdoor. RSA can both encrypt (anyone encrypts with your public key; only you decrypt) and sign (only you sign with your private key; anyone verifies).",
        "**RSA key sizes**: 2048 bits is the practical minimum today (~112-bit security), 3072 for anything long-lived (~128-bit). The keys are large and the operations relatively slow, and to keep pace with attacks the sizes keep creeping up — which is one motivation for moving to elliptic curves.",
        "**Elliptic-curve cryptography** does the same jobs with a different hard problem: the elliptic-curve discrete logarithm. Points on a specially chosen curve form a group where 'multiply a point by a scalar' is easy but recovering the scalar is hard. The payoff is dramatic key-size savings — a 256-bit EC key matches a 3072-bit RSA key.",
        "**Why ECC buys so much**: the best known attacks on elliptic-curve discrete log are far less efficient than the best factoring algorithms, so you need far fewer bits for the same security. Smaller keys mean less data on the wire, faster handshakes, and feasibility on constrained hardware — which is why modern TLS, SSH, Signal and cryptocurrencies default to curves like Curve25519.",
        "**Curve choices matter**: NIST P-256 is ubiquitous and fine but has awkward, hard-to-implement details; Curve25519 / Ed25519 (Daniel Bernstein) was designed to be fast and misuse-resistant, and is now the recommended default for key exchange (X25519) and signatures (Ed25519). When you generate a key today with no other constraint, reach for Ed25519.",
      ],
      exercise:
        "Generate and inspect real keys:\n" +
        "  1. Create an RSA-3072 private key and extract its public half; run 'openssl pkey\n" +
        "     -text -noout' and find the modulus and public exponent (usually 65537).\n" +
        "  2. Create a P-256 key and an Ed25519 key; compare the file sizes of all three\n" +
        "     public keys and note how much smaller the curve keys are.\n" +
        "  3. In one paragraph, explain the trapdoor in RSA: what is easy, what is hard, and\n" +
        "     what secret makes the hard direction easy.\n" +
        "  4. State which algorithm you would choose for a new signing key in 2026, and why.",
      drills: [
        "What are the two keys in a keypair, what may you publish, and what must stay secret?",
        "Define a trapdoor one-way function and name RSA's underlying hard problem.",
        "Roughly what RSA key size matches the security of a 256-bit elliptic-curve key?",
        "Give two concrete advantages ECC has over RSA at equivalent security.",
      ],
      note:
        "Public-key operations are slow, so nobody encrypts bulk data with RSA or ECC directly. Instead " +
        "they do HYBRID encryption: use public-key crypto once to agree on or transport a random " +
        "symmetric key, then encrypt the actual data with AES-GCM. TLS, PGP and age all work this way — " +
        "public-key for the handshake, symmetric for the payload. Keep that division of labour in mind " +
        "for stage 9.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "Digital signatures",
      tag: "sign, then anyone verifies",
      time: "40–60 min",
      payoff:
        "Signatures are public-key crypto run backwards: you sign with your PRIVATE key, and anyone " +
        "verifies with your PUBLIC key. That gives integrity, authenticity AND non-repudiation in one " +
        "move — the full complement your MAC could not. They secure git tags, OS packages, JWTs and " +
        "TLS handshakes, and you already built a signature scheme by hand in your Lamport demo.",
      concepts: ["sign with private / verify with public", "hash-then-sign", "integrity + authenticity + non-repudiation", "ECDSA / Ed25519 / RSA-PSS", "git & package signing", "JWTs", "MAC vs signature"],
      code:
`# A signature is made with the PRIVATE key and checked with the PUBLIC key —
# the reverse of encryption. Anyone can verify; only you can sign.

# Generate a signing keypair (Ed25519 = small, fast, modern):
openssl genpkey -algorithm ed25519 -out sign.pem
openssl pkey -in sign.pem -pubout -out sign.pub

# SIGN a document (openssl hashes-then-signs internally for you):
openssl pkeyutl -sign -inkey sign.pem -rawin -in release.tar.gz -out release.sig

# VERIFY with only the PUBLIC key + the file + the signature:
openssl pkeyutl -verify -pubin -inkey sign.pub -rawin \\
  -in release.tar.gz -sigfile release.sig
# "Signature Verified Successfully"  — change one byte of the file -> it FAILS.

# WHY hash-then-sign: signing is slow and size-limited, so you sign the
# fixed-size HASH of the document, not the document itself:
#     signature = sign_private( SHA-256(document) )
#     verify:     check that the signature matches SHA-256(document)

# Signatures you meet daily:
git tag -s v1.0 -m "signed release"     # git tags & commits (GPG/SSH keys)
#   apt/rpm packages, container images (cosign), JWT 'RS256/ES256', TLS certs`,
      lang: "bash",
      walkthrough: [
        "**Signing inverts the key roles.** In encryption anyone uses your PUBLIC key and only you decrypt with the private key. In signing, only YOU produce a signature with your PRIVATE key, and anyone verifies it with your PUBLIC key. Same keypair, opposite direction.",
        "**A valid signature proves three things at once**: the message was not altered (integrity), it came from the holder of the private key (authenticity), and — because ONLY that private key could have produced it — the signer cannot later deny it (non-repudiation). That last property is what a shared-secret MAC could never give you, and it is why contracts and code releases are signed, not MAC'd.",
        "**Hash-then-sign** is the universal pattern. Public-key operations are slow and bounded in size, so you never sign a whole document — you sign its hash: `signature = sign(private, SHA-256(document))`. Verification recomputes the hash and checks it against the signature. This is exactly why stage 4's collision resistance matters: if an attacker could find two documents with the same hash, one signature would validate both.",
        "**The algorithms**: RSA signatures (use RSA-PSS, not the legacy PKCS#1 v1.5 padding), ECDSA on NIST curves, and Ed25519 — the modern default: small signatures (64 bytes), fast, deterministic, and designed to resist the nonce-reuse disaster that has bitten ECDSA (a repeated nonce leaks the private key, as happened famously to the PlayStation 3).",
        "**Where signatures live**: signed git tags and commits (verifying who authored code), APT/RPM package signatures and container-image signing with cosign (verifying software supply chains), the `RS256`/`ES256` variants of JWTs (a token the server signs and clients can verify but not forge), and — most importantly for stage 9 — the certificates and handshake messages that make TLS trustworthy.",
        "**MAC vs signature — the decision**: if both parties share a secret and you only need to detect tampering between them, a MAC is smaller and faster (a JWT `HS256`). If verifiers should NOT be able to forge, or you need to prove origin to a third party, you need a signature (`ES256`). Symmetrically, a MAC is symmetric-key; a signature is public-key.",
        "**You have already built one.** Your `hash.carino.systems` Lamport demo is a signature scheme from scratch: a private key of random values, a public key of their hashes, and signing by revealing the right preimages. It is post-quantum (stage 12) and beautifully simple — and it makes the abstract 'sign with private, verify with public' concrete, because you wired it yourself.",
      ],
      exercise:
        "Sign and verify, then try to forge:\n" +
        "  1. Generate an Ed25519 keypair, sign a file, and verify it with the public key.\n" +
        "  2. Change a single byte of the file and re-run verification; confirm it now FAILS.\n" +
        "  3. Explain in two sentences why you sign the hash of a document rather than the document,\n" +
        "     and what stage-4 property this relies on.\n" +
        "  4. Compare your Lamport demo to Ed25519: what does each use as the private key, the\n" +
        "     public key, and the act of signing? Which is quantum-resistant, and why?",
      drills: [
        "Which key signs and which key verifies? How is that the reverse of encryption?",
        "Name the three guarantees a signature provides, and the one a MAC cannot.",
        "Why is 'hash-then-sign' universal, and which hash property protects it?",
        "When should you choose a MAC over a signature, and when the reverse?",
      ],
      note:
        "The subtle danger in signatures is what you are actually signing. Sign a raw hash an attacker " +
        "chose and you may be tricked into endorsing something (blind-signing attacks); sign without " +
        "binding context (who, when, for what) and a valid signature can be replayed in a different " +
        "setting. Good schemes bind domain-separation strings and context into the signed data — a " +
        "reminder that the primitive is sound but the protocol around it is where mistakes live.",
    },

    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "Certificates, PKI & TLS",
      tag: "who do you trust, and why",
      time: "50–70 min",
      payoff:
        "Signatures prove a key controls a message — but how do you know a public key really belongs to " +
        "carino.systems and not an impostor? Certificates and the public-key infrastructure answer that " +
        "by chaining trust up to a handful of roots your machine already trusts. Walk a real TLS " +
        "handshake with openssl and see how your whole HTTPS fleet actually earns the padlock.",
      concepts: ["binding key to identity", "X.509 certificate", "certificate authority (CA)", "chain of trust & roots", "Let's Encrypt / ACME", "TLS handshake", "forward secrecy"],
      code:
`# The trust problem: DH and signatures secure a channel to SOMEONE.
# A CERTIFICATE proves that someone is really "carino.systems".

# A cert = a public key + an identity, SIGNED by a Certificate Authority (CA).
# Your OS/browser ships a list of trusted ROOT CAs. Trust chains up to them:
#   leaf (carino.systems) <- signed by <- intermediate CA <- signed by <- ROOT

# Inspect any site's certificate chain and the live handshake:
openssl s_client -connect carino.systems:443 -servername carino.systems </dev/null \\
  | openssl x509 -noout -subject -issuer -dates
#   subject= CN=carino.systems           <- who it is for
#   issuer=  C=US, O=Let's Encrypt, CN=R3 <- who vouched for it
#   notBefore/notAfter                     <- validity window (LE = 90 days)

# See the full negotiated connection (version, cipher, chain, forward secrecy):
openssl s_client -connect carino.systems:443 -servername carino.systems </dev/null 2>/dev/null \\
  | grep -E "Protocol|Cipher|Verify"

# What a TLS 1.3 handshake actually does, in order:
#   1. ClientHello  -> offers versions, ciphers, an ephemeral DH public value
#   2. ServerHello  -> picks them, sends its CERTIFICATE + a SIGNATURE + its DH value
#   3. both derive the same session key via DH; client VERIFIES the cert chain
#   4. everything after is AES-GCM (or ChaCha20-Poly1305) under that session key`,
      lang: "bash",
      walkthrough: [
        "**The binding problem**: Diffie-Hellman and signatures let you talk securely to whoever holds a given key — but a man-in-the-middle also holds a key. You need to bind a public key to a real-world IDENTITY (a domain name) in a way you can verify. That binding, signed by someone you trust, is a certificate.",
        "**An X.509 certificate** is a structured document containing a subject (the identity, e.g. `CN=carino.systems`), the subject's public key, a validity window, and — crucially — a signature from a Certificate Authority attesting 'I checked, this key belongs to this identity'. It is signatures (stage 8) applied to identity.",
        "**The chain of trust**: your operating system and browser ship with a built-in list of trusted ROOT CA certificates. A site's 'leaf' certificate is usually signed by an intermediate CA, which is signed by a root. Verification walks the chain upward, checking each signature, until it reaches a root your machine already trusts. No trusted root at the top means no padlock.",
        "**Let's Encrypt changed the economics.** Certificates used to cost money and involve manual paperwork; Let's Encrypt issues them free and automatically via the ACME protocol, where your server proves control of the domain (answer a challenge on the domain) and gets a 90-day certificate that a client (certbot, caddy) auto-renews. Your entire carino.systems HTTPS fleet almost certainly runs on exactly this — short-lived, auto-renewed leaf certs chaining to the Let's Encrypt roots.",
        "**The TLS 1.3 handshake ties the whole course together.** The client offers cipher suites and an ephemeral Diffie-Hellman public value (stage 6); the server replies with its certificate and a SIGNATURE over the handshake (stage 8) plus its own DH value; both derive the same session secret via DH; the client VERIFIES the certificate chain proves the server owns the domain. From then on, all traffic is symmetric AEAD — AES-GCM or ChaCha20-Poly1305 (stage 3).",
        "**The signature over the handshake is what stops the man-in-the-middle.** A relay attacker can forward DH values, but they cannot forge the server's signature without its private key, and they cannot present a certificate for `carino.systems` that chains to a trusted root without a CA having been fooled or compromised. That is precisely the authentication that bare DH lacked.",
        "**Forward secrecy** falls out of ephemeral DH: because a fresh DH secret is generated per session and discarded after, an attacker who records your encrypted traffic today and steals the server's long-term private key tomorrow still cannot decrypt those past sessions. TLS 1.3 makes this mandatory — a genuine improvement you get for free on a modern stack.",
      ],
      exercise:
        "Walk a real handshake on your own fleet:\n" +
        "  1. Run the s_client command against carino.systems (or any of your subdomains) and\n" +
        "     read the subject, issuer and validity dates of the leaf certificate.\n" +
        "  2. Extract the full chain and identify the intermediate and the root; confirm the\n" +
        "     issuer of the leaf is a Let's Encrypt intermediate.\n" +
        "  3. From the handshake output, note the negotiated TLS version and cipher suite, and\n" +
        "     confirm 'Verify return code: 0 (ok)'.\n" +
        "  4. Explain, referencing stages 6 and 8, exactly which step in the handshake defeats\n" +
        "     a man-in-the-middle — and what would happen if you visited a site whose cert\n" +
        "     chained to no trusted root.",
      drills: [
        "What two things does an X.509 certificate bind together, and who signs that binding?",
        "Describe the chain of trust from a leaf certificate up to something your machine trusts.",
        "In the TLS handshake, which stage-6 and stage-8 primitives appear, and what does each accomplish?",
        "What is forward secrecy, and how does ephemeral Diffie-Hellman provide it?",
      ],
      note:
        "PKI's weakness is its trust anchors: your machine trusts dozens of root CAs, and a single " +
        "compromised or coerced CA can issue a valid-looking certificate for any domain (this has " +
        "happened — DigiNotar, 2011). Defences layered on top include Certificate Transparency logs " +
        "(every issued cert is publicly logged, so you can spot rogue ones), CAA DNS records (naming " +
        "which CA may issue for your domain), and short lifetimes. Trust in PKI is not absolute — it " +
        "is monitored.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Storing passwords",
      tag: "salts, KDFs & cost factors",
      time: "40–60 min",
      payoff:
        "Every breach headline that says 'passwords were leaked' is really a story about how they were " +
        "stored. Do it wrong — plaintext, or a plain fast hash — and one database dump exposes everyone. " +
        "Do it right — a salted, deliberately-slow, memory-hard KDF — and even a stolen database resists " +
        "cracking for years. This is the most immediately useful crypto you will ever ship.",
      concepts: ["never store plaintext", "why fast hashes fail", "salt (per-password)", "rainbow tables", "slow KDFs: bcrypt / scrypt / argon2", "cost / work factor", "pepper"],
      code:
`# WRONG: store the password, or a plain fast hash of it.
sha256sum <<< "hunter2"     # attacker with a GPU tries BILLIONS/sec -> instant

# The problems with a bare fast hash:
#   1. SAME password -> SAME hash: crack one, crack all who share it.
#   2. Precomputed RAINBOW TABLES map common hashes back to passwords.
#   3. GPUs compute SHA-256 ~10^10-10^11 times/second. Fast is the enemy.

# RIGHT: a password-hashing KDF that is SALTED and DELIBERATELY SLOW.
#   SALT: a unique random value per password, stored alongside the hash.
#         -> identical passwords get different hashes; rainbow tables die.
#   SLOW/MEMORY-HARD: tunable cost so each guess is expensive.

# argon2id — the current recommendation (memory-hard, GPU-resistant):
argon2 "$(openssl rand -hex 16)" -id -t 3 -m 16 -p 1 <<< "hunter2"

# bcrypt (cost 12) via a quick Python check:
python3 -c "import bcrypt; print(bcrypt.hashpw(b'hunter2', bcrypt.gensalt(rounds=12)))"

# The stored string bundles algorithm + cost + salt + hash, e.g.:
#   $argon2id$v=19$m=65536,t=3,p=1$<salt>$<hash>
#   $2b$12$<22-char-salt><31-char-hash>       (bcrypt)
# Verifying re-runs the SAME parameters on the input and compares.`,
      lang: "bash",
      walkthrough: [
        "**Never store the plaintext.** If your database stores passwords, a single leak (SQL injection, stolen backup, insider) hands the attacker every account instantly — and because people reuse passwords, their other accounts too. Storing a reversible-encrypted password is barely better: whoever holds the key holds every password.",
        "**A plain fast hash is not enough either**, and this is the mistake even experienced developers make. SHA-256 was DESIGNED to be fast, and an attacker with a GPU computes tens of billions of hashes per second. Against a leaked table of SHA-256 password hashes, common passwords fall in milliseconds.",
        "**Salting kills precomputation.** A salt is a unique random value generated per password and stored in the clear next to the hash. You hash `salt || password`, so two users with the same password get different hashes — cracking must be redone per user — and precomputed **rainbow tables** (giant lookup tables of hash → password) become useless because they would need to cover every salt.",
        "**But salting does not slow anything down**, and speed is the real enemy. The fix is a password-hashing function that is DELIBERATELY expensive: bcrypt (2000s, slow by design), scrypt (adds memory hardness), and argon2 (2015 Password Hashing Competition winner, the current recommendation, tunable in time AND memory). Use argon2id if available, bcrypt if not.",
        "**The cost/work factor is the tuning knob.** bcrypt's cost is a number of rounds (each +1 doubles the work); argon2 takes time, memory and parallelism parameters. You tune it so a single hash takes a noticeable fraction of a second on YOUR server — acceptable for one login, but murderous when an attacker must do it billions of times. As hardware improves, you raise the cost; the parameters are stored in the hash so old hashes still verify.",
        "**Memory hardness (scrypt, argon2) specifically fights GPUs and ASICs**, which have thousands of fast cores but limited fast memory. A function that demands, say, 64 MB per guess cannot be massively parallelised on a GPU the way a memory-light hash can. This is why argon2id, which is memory-hard, is preferred over bcrypt, which is not.",
        "**A pepper is the optional extra layer**: a secret value added to every password hash but stored SEPARATELY from the database (in code, an HSM, or an env var), so a database-only leak still leaves the attacker missing an ingredient. It complements salt (which is per-user and public) rather than replacing it. The mini-lab below lets you pit a password's length and character set against different algorithms and watch the crack time swing from seconds to centuries.",
      ],
      exercise:
        "Feel the difference between fast and slow:\n" +
        "  1. Hash 'hunter2' with sha256sum and with argon2 (or bcrypt); note that argon2\n" +
        "     visibly takes longer and bundles its parameters into the output string.\n" +
        "  2. Hash the SAME password twice with argon2 and confirm the two outputs differ\n" +
        "     (the random salt at work).\n" +
        "  3. Play with the mini-lab below: hold the password fixed and switch the algorithm\n" +
        "     from MD5-fast to argon2id; then hold the algorithm fixed and add character types.\n" +
        "     Which lever — algorithm, length, or charset — moves the crack time most?\n" +
        "  4. Explain in two sentences why a salt defeats rainbow tables but not a targeted\n" +
        "     brute force of one account.",
      drills: [
        "Why is a bare SHA-256 of a password unsafe even though SHA-256 itself is not 'broken'?",
        "What does a per-password salt prevent, and what does it NOT prevent?",
        "Name three password-hashing KDFs and say which is recommended today and why (one word: memory).",
        "What is a pepper, how does it differ from a salt, and what specific attack does it blunt?",
      ],
      note:
        "The uncomfortable truth is that no storage scheme saves a genuinely weak password — 'password1' " +
        "falls to a dictionary attack whatever the KDF, because the attacker guesses likely passwords " +
        "first, not random strings. Strong storage buys TIME (turning an instant mass-crack into a " +
        "years-long targeted grind) and protects strong and unique passwords completely. That is why " +
        "correct storage AND encouraging password managers / passkeys are both part of the answer.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "How crypto fails in practice",
      tag: "the mistakes, not the maths",
      time: "45–60 min",
      payoff:
        "Real systems almost never fall because AES or SHA-256 was broken — they fall on how the pieces " +
        "were used: a reused nonce, ECB where GCM belonged, a timing leak, a home-grown scheme, a key " +
        "left in a git repo. Knowing this catalogue of failures is what separates someone who USES " +
        "crypto from someone who can be trusted to deploy it.",
      concepts: ["primitives rarely break", "nonce / IV reuse", "ECB & pattern leaks", "padding oracles", "'don't roll your own'", "timing side-channels", "key management is the real problem"],
      code:
`# The primitives are strong. The USAGE is where systems die. A field guide:

# 1. NONCE / IV REUSE  — the #1 real-world AEAD failure.
#    Reuse a GCM nonce with the same key and you leak the XOR of the two
#    plaintexts AND can forge the authentication tag. "unique per key" is
#    not advice, it is a hard requirement.

# 2. ECB (again) — determinism leaks structure (stage 3's penguin).

# 3. PADDING ORACLE — if a server reveals (via error or timing) whether
#    CBC padding was valid, an attacker decrypts ciphertext WITHOUT the key,
#    one byte at a time. (Killed SSL 3.0 as POODLE.) AEAD prevents it.

# 4. TIMING SIDE-CHANNELS — a comparison that returns early leaks secrets:
if hmac == received:                 # WRONG: variable-time, leaks byte-by-byte
    ...
if hmac.compare_digest(hmac, recv):  # RIGHT: constant time

# 5. ROLLING YOUR OWN — a homemade cipher/protocol that "looks scrambled".
#    It has never survived review because it never had any. Use vetted libs.

# 6. KEY MANAGEMENT — the hardest and most-neglected problem of all:
git log -p | grep -i "secret_key ="  # keys committed to repos, in logs,
#    in backups, in env dumps, never rotated. Perfect crypto, key on GitHub.`,
      lang: "py",
      walkthrough: [
        "**The headline fact**: AES, SHA-256, RSA and the curves are not what break. Decades of public scrutiny have hardened the primitives. Nearly every real compromise is a MISUSE — the maths was fine, the plumbing leaked. So the skill that matters is spotting bad usage, not attacking algorithms.",
        "**Nonce/IV reuse** is the most common catastrophic mistake. AEAD modes like GCM assume the nonce is unique per key; reuse it and two ciphertexts leak the XOR of their plaintexts (often enough to recover both) and, worse, the authentication key can be recovered, letting the attacker forge. This bit real systems hard (WPA2's KRACK, some cloud SDKs). Generate nonces from a counter you never reset, or randomly from a large enough space, and rotate keys before you could ever repeat.",
        "**ECB, still.** It keeps reappearing because it is the default in some libraries and the simplest to call. Any deterministic encryption leaks equality — you can tell when two ciphertexts encrypt the same plaintext even without decrypting. Stage 3's penguin is the poster, but the same leak sinks encrypted database columns and cookies.",
        "**Padding oracles** are a beautiful, brutal class: with CBC, if the server behaves differently (an error message, or just a timing difference) depending on whether the decrypted padding was valid, an attacker who cannot break AES at all can still decrypt any ciphertext byte by byte, and sometimes encrypt too. POODLE and Lucky Thirteen are famous instances. AEAD (encrypt-then-MAC or GCM) closes the door because tampered ciphertext is rejected before any padding is examined.",
        "**Timing side-channels** leak secrets through how LONG an operation takes. A tag or password comparison that returns as soon as it finds a mismatched byte reveals, through timing, how many leading bytes were right — enough to forge one byte at a time. The fix is constant-time comparison (`hmac.compare_digest`, `CRYPTO_memcmp`). More exotic variants leak keys through cache timing and power draw; the lesson is that a mathematically correct implementation can still leak through the physical world.",
        "**'Don't roll your own crypto'** is a cliche because it is true. A homemade cipher or protocol that 'looks random' has simply never faced the years of expert attack that standard designs survived. This extends beyond algorithms to protocols: combining primitives yourself (encrypt-and-MAC in the wrong order, signing without domain separation) is where even careful engineers slip. Use vetted, high-level libraries (libsodium/NaCl, `cryptography`, Tink) that make the safe choice the default.",
        "**Key management is the real, unglamorous problem** — and where most of your effort should go. Perfect algorithms are worthless if the key is committed to a git repo, printed in a log, baked into a mobile app, shared over Slack, or never rotated after an employee leaves. Ask the boring questions: where is the key generated, where does it live, who can read it, how is it rotated, what happens when it leaks? That operational discipline protects more than any cipher choice.",
      ],
      exercise:
        "Audit with the failure catalogue in hand:\n" +
        "  1. For each of the six failure modes above, write one sentence naming the correct\n" +
        "     practice that prevents it.\n" +
        "  2. Find a real CVE or writeup for a padding-oracle attack (POODLE or Lucky Thirteen)\n" +
        "     and summarise, in three sentences, how leaking one bit of 'padding valid?' cascades\n" +
        "     into full decryption.\n" +
        "  3. Grep one of your own carino.systems repos for accidentally committed secrets\n" +
        "     (keys, tokens, .env values in history); note what you would rotate if you found any.\n" +
        "  4. Explain why 'the algorithm is unbroken' is a weak defence of a real system.",
      drills: [
        "What exactly goes wrong when a GCM nonce is reused with the same key?",
        "How can a padding oracle decrypt ciphertext when the attacker cannot break the cipher at all?",
        "Why must security-sensitive comparisons run in constant time?",
        "State the case for 'key management, not algorithm choice, is the hard part' in one sentence.",
      ],
      note:
        "A useful habit when reviewing crypto code: ignore the algorithm names (they are almost always " +
        "fine) and interrogate the surroundings — where do nonces come from, is the mode authenticated, " +
        "are comparisons constant-time, where does the key live, is anything home-grown. That checklist " +
        "catches the failures that actually happen. The maths is a solved problem; the engineering " +
        "around it is not.",
    },

    /* -------------------------------------------------------------- 12 */
    {
      n: 12,
      title: "Post-quantum cryptography",
      tag: "when the hard problems get easy",
      time: "45–60 min",
      payoff:
        "A large enough quantum computer would break RSA and elliptic curves outright and halve the " +
        "strength of symmetric keys — retiring most of the public-key crypto this course is built on. " +
        "The replacements are already standardised, and you have literally built one of the oldest " +
        "quantum-safe schemes yourself. This stage tells you what breaks, what survives, and what to " +
        "do about it now.",
      concepts: ["Shor's algorithm", "Grover's algorithm", "what breaks vs survives", "harvest-now-decrypt-later", "lattice crypto: ML-KEM / ML-DSA", "hash-based: Lamport / SPHINCS+", "migration"],
      code:
`# Two quantum algorithms threaten today's crypto by different amounts:

# SHOR'S ALGORITHM — factors integers and solves discrete logs EFFICIENTLY.
#   -> RSA, Diffie-Hellman, ECDSA/Ed25519, ECDH: all BROKEN outright.
#   -> every public-key primitive in stages 6-9 rests on problems Shor kills.

# GROVER'S ALGORITHM — speeds up brute-force search quadratically.
#   -> effectively HALVES symmetric key strength: AES-256 -> ~128-bit safety.
#   -> the fix is trivial: use 256-bit keys and 384/512-bit hashes. Survives.

# So: symmetric crypto + hashes just need bigger sizes. PUBLIC-KEY needs
# entirely new hard problems. NIST standardised the replacements in 2024:
#   ML-KEM  (Kyber)     FIPS 203  -> key exchange / encryption (lattices)
#   ML-DSA  (Dilithium) FIPS 204  -> signatures (lattices)
#   SLH-DSA (SPHINCS+)  FIPS 205  -> signatures (HASH-BASED, conservative)

# HASH-BASED signatures rest ONLY on hash security — which Grover merely
# dents. The simplest is LAMPORT, which you already built:
#   private key: pairs of random values
#   public key:  their hashes
#   sign a bit:  reveal the matching preimage
# SPHINCS+ is Lamport's idea, made practical (stateless, many-time).`,
      lang: "bash",
      walkthrough: [
        "**Quantum computers are not 'faster classical computers'** — they exploit superposition to attack specific mathematical structures. Two algorithms matter for cryptography, and they do very different amounts of damage, so the response differs by primitive.",
        "**Shor's algorithm is the catastrophe.** It factors large integers and computes discrete logarithms in polynomial time — efficiently solving the exact problems RSA, finite-field Diffie-Hellman, ECDH and ECDSA/Ed25519 depend on. A cryptographically-relevant quantum computer running Shor would break ALL of the public-key crypto in stages 6 through 9. Not weaken — break.",
        "**Grover's algorithm is the manageable threat.** It speeds up unstructured search quadratically, which effectively halves the security of symmetric ciphers and hashes: brute-forcing AES-256 drops to ~2^128 work, finding a hash preimage in a 256-bit hash to ~2^128. The fix is simply to use larger parameters — AES-256 instead of AES-128, SHA-384/512 — which is exactly why stage 2 flagged 256-bit keys as quantum margin. Symmetric crypto SURVIVES with bigger sizes.",
        "**'Harvest now, decrypt later' is why this is urgent despite no quantum computer existing yet.** An adversary can record encrypted traffic TODAY and decrypt it once quantum hardware arrives. Anything that must stay secret for a decade — health records, state secrets, long-lived keys — is already at risk, which is why migration is happening now rather than when the machines appear.",
        "**NIST standardised the replacements in 2024.** The main winners are LATTICE-based: ML-KEM (formerly Kyber, FIPS 203) for key encapsulation / key exchange, and ML-DSA (formerly Dilithium, FIPS 204) for signatures. Their hardness rests on problems over high-dimensional lattices that neither Shor nor Grover is known to break. The cost is size — keys and signatures are kilobytes, not dozens of bytes — which is the main friction in deployment (recall stage 2's size table).",
        "**Hash-based signatures are the conservative hedge**, and you already understand them. SLH-DSA (SPHINCS+, FIPS 205) rests ONLY on the security of a hash function — no fancy new hardness assumption — so it is trusted even by those wary of lattices; it is slower and larger but maximally conservative. Its ancestor is the Lamport signature you built on `hash.carino.systems`: a private key of random values, a public key of their hashes, signing by revealing preimages. That toy is genuinely post-quantum, because Grover only dents hashes rather than breaking them.",
        "**What to actually do**: for symmetric and hashing, use 256-bit keys and SHA-384/512 and you are already fine. For public-key, the migration is toward HYBRID schemes that run a classical algorithm (X25519) AND a post-quantum one (ML-KEM) together, so the connection is safe if EITHER holds — modern TLS and SSH are rolling this out now. You do not need to hand-roll anything; you need to track library and protocol support and prefer the hybrid modes as they land.",
      ],
      exercise:
        "Map the quantum threat onto everything you have learned:\n" +
        "  1. For each primitive family — AES, SHA-256, RSA, ECDSA, HMAC — write whether it is\n" +
        "     BROKEN, WEAKENED (fixable with bigger sizes), or SAFE under quantum, and by which\n" +
        "     algorithm (Shor or Grover).\n" +
        "  2. Explain 'harvest now, decrypt later' and name one kind of data it threatens today.\n" +
        "  3. Revisit your Lamport demo: describe its private key, public key and signing step,\n" +
        "     and explain in two sentences why it is post-quantum where Ed25519 is not.\n" +
        "  4. Look up whether your TLS stack (or OpenSSH) supports hybrid X25519+ML-KEM yet;\n" +
        "     note what you would enable to be quantum-ready on the carino.systems fleet.",
      drills: [
        "Which quantum algorithm breaks RSA and ECC, and which merely halves symmetric strength?",
        "Why does symmetric crypto survive quantum with only a size bump, while public-key needs replacing?",
        "What is 'harvest now, decrypt later' and why does it make migration urgent before quantum hardware exists?",
        "Name the two NIST families (lattice-based and hash-based) and give one strength of each; relate the hash-based one to your Lamport demo.",
      ],
      note:
        "The migration will be gradual and hybrid: classical + post-quantum side by side, so a break in " +
        "either the old or the new scheme leaves you covered while confidence in the lattice assumptions " +
        "matures. It echoes every transition in this course — nothing flips overnight; the installed base " +
        "moves slowly and safely. You finish this course holding the whole arc: from breaking Caesar by " +
        "hand to standing ready for the machines that will break RSA — and having already built, in your " +
        "own hash visualiser, a signature scheme that outlives them.",
    },
  ],
};

/* =====================================================================
   Interactive labs for the Cryptography course — self-registered.
   Helpers (esc/$/$$/fmt) copied verbatim from js/labs.js. Pure DOM, no
   libraries, no network, works fully offline (no crypto.subtle / fetch —
   the hashes and ciphers below are deliberate TOYS, labelled as such).
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

  const VIZ  = window.COURSE_VIZ = window.COURSE_VIZ || {};
  const LABS = window.COURSE_MINILABS = window.COURSE_MINILABS || {};

  /* small integer modular exponentiation for the DH lab (BigInt) */
  const modpow = (base, exp, mod) => {
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp); mod = BigInt(mod);
    let r = 1n;
    while (exp > 0n) {
      if (exp & 1n) r = (r * base) % mod;
      base = (base * base) % mod;
      exp >>= 1n;
    }
    return r;
  };

  /* =================================================================
     HEADLINE VIZ — Diffie-Hellman, mixed live
     ================================================================= */
  VIZ["crypto"] = {
    title: "Diffie-Hellman, mixed live",
    blurb:
      "Two strangers agree on a secret over a wire the attacker is reading. Nudge Alice's " +
      "secret `a` and Bob's secret `b`; watch their public values `A` and `B` update and both " +
      "sides land on the **same** shared secret — while the **Eve sees** panel gets only the " +
      "public numbers and still cannot compute it.",
    mount(host) {
      const p = 23, g = 5;
      let a = 6, b = 15;

      host.innerHTML = `
        <div class="viz dhviz">
          <div class="viz-ctrls wrap">
            <span class="gnu-slot-name">public</span>
            <span class="viz-btn mono" style="cursor:default">p = ${p}</span>
            <span class="viz-btn mono" style="cursor:default">g = ${g}</span>
            <span class="gnu-slot-name" style="margin-left:12px">Alice a</span>
            <button class="viz-btn mono" data-act="a-">−</button>
            <b class="viz-status" data-r="av" style="margin:0"></b>
            <button class="viz-btn mono" data-act="a+">+</button>
            <span class="gnu-slot-name" style="margin-left:12px">Bob b</span>
            <button class="viz-btn mono" data-act="b-">−</button>
            <b class="viz-status" data-r="bv" style="margin:0"></b>
            <button class="viz-btn mono" data-act="b+">+</button>
          </div>
          <div class="sys-cols">
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>Alice</code><span>secret a (private)</span></div>
              <pre class="gnu-pane-b" data-r="alice"></pre>
            </div>
            <div class="gnu-pane">
              <div class="gnu-pane-h"><code>Bob</code><span>secret b (private)</span></div>
              <pre class="gnu-pane-b" data-r="bob"></pre>
            </div>
          </div>
          <div class="lnx-read" data-r="shared"></div>
          <div class="gnu-pane" data-r="evewrap">
            <div class="gnu-pane-h"><code>Eve sees (the whole wire)</code><span>everything public</span></div>
            <pre class="gnu-pane-b" data-r="eve"></pre>
          </div>
          <p class="asm-msg" data-r="say"></p>
        </div>`;

      function paint() {
        const A = Number(modpow(g, a, p));
        const B = Number(modpow(g, b, p));
        const sA = Number(modpow(B, a, p));   // Bob's public raised to Alice's secret
        const sB = Number(modpow(A, b, p));   // Alice's public raised to Bob's secret
        const match = sA === sB;

        $('[data-r="av"]', host).textContent = a;
        $('[data-r="bv"]', host).textContent = b;

        $('[data-r="alice"]', host).textContent =
          `secret   a = ${a}\n` +
          `sends    A = g^a mod p\n` +
          `           = ${g}^${a} mod ${p}\n` +
          `           = ${A}\n\n` +
          `computes shared = B^a mod p\n` +
          `                = ${B}^${a} mod ${p}\n` +
          `                = ${sA}`;
        $('[data-r="bob"]', host).textContent =
          `secret   b = ${b}\n` +
          `sends    B = g^b mod p\n` +
          `           = ${g}^${b} mod ${p}\n` +
          `           = ${B}\n\n` +
          `computes shared = A^b mod p\n` +
          `                = ${A}^${b} mod ${p}\n` +
          `                = ${sB}`;

        $('[data-r="shared"]', host).innerHTML = [
          ["Alice computes", String(sA)],
          ["Bob computes", String(sB)],
          [match ? "shared secret ✓" : "mismatch", match ? String(sA) : "—"],
        ].map(([k, v], i) =>
          `<div class="lnx-out" style="${i === 2 && match ? "border-color:var(--accent)" : ""}"><span>${k}</span><code>${v}</code></div>`).join("");

        $('[data-r="eve"]', host).textContent =
          `p = ${p}   g = ${g}\n` +
          `A = ${A}   (Alice's public value)\n` +
          `B = ${B}   (Bob's public value)\n\n` +
          `to get the secret Eve must solve\n` +
          `   ${g}^x mod ${p} = ${A}   for x\n` +
          `that is the DISCRETE LOG problem —\n` +
          `easy for p=23, INFEASIBLE for a 2048-bit p.`;

        $('[data-r="say"]', host).innerHTML = fmt(match
          ? `Both sides reached **${sA}** without ever sending a or b. The identity `+
            "`(g^a)^b = g^(ab) = (g^b)^a mod p` is why. Eve has p, g, A and B — and still cannot get there."
          : "computing…");
      }

      host.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-act]"); if (!btn) return;
        const act = btn.dataset.act;
        if (act === "a-") a = a <= 1 ? 21 : a - 1;
        else if (act === "a+") a = a >= 21 ? 1 : a + 1;
        else if (act === "b-") b = b <= 1 ? 21 : b - 1;
        else if (act === "b+") b = b >= 21 ? 1 : b + 1;
        paint();
      });
      paint();
    },
  };

  /* =================================================================
     MINI-LABS
     ================================================================= */
  LABS["crypto"] = [

    /* ---- at 3: the ECB penguin ---------------------------------- */
    {
      at: 3,
      title: "The ECB penguin",
      blurb:
        "A tiny 12×12 'image'. **ECB** encrypts each block on its own, so identical plaintext " +
        "blocks become identical ciphertext — the shape survives encryption. **CBC** and **GCM** " +
        "chain in position and a nonce, so the same picture becomes patternless noise.",
      mount(host) {
        // 12x12 plaintext: '1' = foreground pixel, '0' = background. A "C" glyph.
        const PLAIN = [
          "000000000000",
          "000111111100",
          "001111111110",
          "011100000000",
          "011000000000",
          "110000000000",
          "110000000000",
          "011000000000",
          "011100000000",
          "001111111110",
          "000111111100",
          "000000000000",
        ];
        const MODES = [
          ["ecb", "ECB"],
          ["cbc", "CBC"],
          ["gcm", "GCM"],
        ];
        let mode = "ecb";

        // deterministic toy "cipher" — NOT real encryption, just a mapping:
        //   ECB : colour depends ONLY on the block value (0 or 1) -> pattern survives
        //   CBC/GCM : colour depends on cell position + a nonce -> patternless
        const mix = (x) => { x = (x ^ 0x9e3779b9) >>> 0; x = Math.imul(x, 0x85ebca6b) >>> 0; x ^= x >>> 13; return x >>> 0; };
        function ecbColour(v) {
          // two fixed "ciphertext" colours, one per plaintext block value
          return v === "1" ? "#c9a227" : "#2a2b33";
        }
        function noiseColour(i) {
          const h = mix(i + 1) % 360;
          const l = 30 + (mix(i * 7 + 3) % 30);
          return `hsl(${h},22%,${l}%)`;
        }

        host.innerHTML = `
          <div class="viz ecbviz">
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">mode</span>
              ${MODES.map(([id, lbl]) => `<button class="viz-btn mono ${id === mode ? "primary" : ""}" data-m="${id}">${lbl}</button>`).join("")}
            </div>
            <div class="sys-cols">
              <div class="gnu-pane">
                <div class="gnu-pane-h"><code>plaintext</code><span>the original "image"</span></div>
                <div data-r="plain" style="display:grid;grid-template-columns:repeat(12,1fr);gap:2px;padding:8px;max-width:280px"></div>
              </div>
              <div class="gnu-pane">
                <div class="gnu-pane-h"><code>ciphertext</code><span data-r="modelbl"></span></div>
                <div data-r="cipher" style="display:grid;grid-template-columns:repeat(12,1fr);gap:2px;padding:8px;max-width:280px"></div>
              </div>
            </div>
            <p class="asm-msg" data-r="say"></p>
          </div>`;

        const flat = PLAIN.join("").split("");
        // paint the static plaintext once
        $('[data-r="plain"]', host).innerHTML = flat.map((v) =>
          `<span style="aspect-ratio:1;border-radius:2px;background:${v === "1" ? "#e8c24a" : "#1b1c22"}"></span>`).join("");

        function paint() {
          $$("[data-m]", host).forEach((b) => b.classList.toggle("primary", b.dataset.m === mode));
          $('[data-r="modelbl"]', host).textContent =
            mode === "ecb" ? "AES-ECB (block-by-block)" : mode === "cbc" ? "AES-CBC (chained + IV)" : "AES-GCM (nonce + tag)";
          $('[data-r="cipher"]', host).innerHTML = flat.map((v, i) => {
            const c = mode === "ecb" ? ecbColour(v) : noiseColour(i);
            return `<span style="aspect-ratio:1;border-radius:2px;background:${c}"></span>`;
          }).join("");
          $('[data-r="say"]', host).innerHTML = fmt(mode === "ecb"
            ? "**ECB leaks the shape.** Every background block encrypts to the same colour and every "
              + "foreground block to another — so the `C` is still perfectly legible. Determinism is the flaw."
            : mode === "cbc"
            ? "**CBC** XORs each block with the previous ciphertext (and a random IV first), so identical "
              + "plaintext blocks diverge by position — the shape dissolves into noise."
            : "**GCM** turns AES into a nonce-driven stream and adds an authentication tag: patternless "
              + "output AND tamper detection. This is the default you should reach for.");
        }

        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-m]"); if (!b) return;
          mode = b.dataset.m; paint();
        });
        paint();
      },
    },

    /* ---- at 4: avalanche ----------------------------------------- */
    {
      at: 4,
      title: "Avalanche",
      blurb:
        "Type a message and flip a single input bit. Watch a **toy 32-bit hash** (FNV-1a — a fast "
        + "checksum, NOT secure, shown only to illustrate) scramble completely: one bit in, about "
        + "**half** the output bits out.",
      mount(host) {
        let msg = "carino";
        let flipPos = 0;

        // toy 32-bit FNV-1a — a NON-cryptographic checksum, for illustration only
        const fnv32 = (str) => {
          let h = 0x811c9dc5 >>> 0;
          for (let i = 0; i < str.length; i++) {
            h ^= str.charCodeAt(i);
            h = Math.imul(h, 0x01000193) >>> 0;
          }
          return h >>> 0;
        };
        const bits = (n) => [...Array(32)].map((_, i) => (n >>> (31 - i)) & 1);

        host.innerHTML = `
          <div class="viz avviz">
            <div class="rx-bar">
              <span class="gnu-slot-name">message</span>
              <input class="rx-input" data-r="in" value="${esc(msg)}" spellcheck="false" aria-label="message to hash">
              <button class="viz-btn mono" data-a="flip">flip one input bit ↯</button>
            </div>
            <div data-r="rows"></div>
            <p class="asm-msg" data-r="say"></p>
          </div>`;

        const inEl = $('[data-r="in"]', host);

        function flippedMessage() {
          if (!msg.length) return "";
          const chars = msg.split("");
          const pos = flipPos % msg.length;
          chars[pos] = String.fromCharCode(chars[pos].charCodeAt(0) ^ 1); // flip low bit
          return chars.join("");
        }

        function bitRow(label, bs, ref) {
          const cells = bs.map((bit, i) => {
            const diff = ref && bit !== ref[i];
            const cls = bit ? "net" : "host";
            const style = diff ? "outline:2px solid var(--accent);outline-offset:-1px" : "";
            return `<span class="sub-bit ${cls}" style="${style}">${bit}</span>${(i % 8 === 7 && i < 31) ? '<span class="sub-dot">·</span>' : ""}`;
          }).join("");
          return `<div class="sub-ipline"><code>${label}</code></div><div class="sub-bits">${cells}</div>`;
        }

        function paint() {
          const h1 = fnv32(msg);
          const fmsg = flippedMessage();
          const h2 = fnv32(fmsg);
          const b1 = bits(h1), b2 = bits(h2);
          const diffCount = b1.reduce((acc, x, i) => acc + (x !== b2[i] ? 1 : 0), 0);
          const pos = msg.length ? (flipPos % msg.length) : 0;

          $('[data-r="rows"]', host).innerHTML =
            `<div class="lnx-read">
               <div class="lnx-out"><span>hash("${esc(msg || "∅")}")</span><code>${h1.toString(16).padStart(8, "0")}</code></div>
               <div class="lnx-out"><span>flipped @ char ${pos}</span><code>${h2.toString(16).padStart(8, "0")}</code></div>
               <div class="lnx-out" style="border-color:var(--accent)"><span>bits changed</span><code>${diffCount}/32</code></div>
             </div>` +
            bitRow("original digest", b1, null) +
            bitRow("after 1-bit flip", b2, b1);

          $('[data-r="say"]', host).innerHTML = fmt(
            `Flipping one bit of one character changed **${diffCount} of 32** output bits — roughly half, `
            + "with no visible relationship between the two digests. A real hash like SHA-256 does this over "
            + "256 bits. (This toy FNV-1a is a **checksum, not secure** — never use it where an attacker is involved.)");
        }

        host.addEventListener("input", (e) => {
          if (e.target === inEl) { msg = inEl.value; paint(); }
        });
        host.addEventListener("click", (e) => {
          if (e.target.closest('[data-a="flip"]')) { flipPos++; paint(); }
        });
        paint();
      },
    },

    /* ---- at 10: crack-speed calculator --------------------------- */
    {
      at: 10,
      title: "Crack-speed calculator",
      blurb:
        "Pit a password against a cracker. Pick the storage algorithm, the length and the character "
        + "set, and read the **worst-case** time to exhaust the keyspace at honest ballpark GPU rates — "
        + "watch a fast hash fall in seconds where **argon2id** holds for centuries.",
      mount(host) {
        const ALGOS = [
          { id: "md5",    name: "MD5 (fast)",      rate: 100000000000n, note: "a plain fast hash on a GPU farm — ~10^11 guesses/s" },
          { id: "sha256", name: "SHA-256 (fast)",  rate: 1000000000n,   note: "still a fast hash — ~10^9 guesses/s. Fast is the enemy." },
          { id: "bcrypt", name: "bcrypt (cost 12)",rate: 10000n,        note: "a deliberately slow KDF — ~10^4 guesses/s" },
          { id: "argon2", name: "argon2id",        rate: 1000n,         note: "slow AND memory-hard — ~10^3 guesses/s, GPU-resistant" },
        ];
        const CHARSETS = [
          { id: "lower", name: "lowercase", size: 26n },
          { id: "digit", name: "+ digits",  size: 36n },
          { id: "sym",   name: "+ symbols", size: 95n },
        ];
        let algo = "md5", charset = "lower", len = 8;

        const YEAR = 31557600n;
        const big = (n) => {
          const s = n.toString();
          if (s.length <= 4) return Number(n).toLocaleString();
          if (s.length > 18) return `${s[0]}.${s.slice(1, 3)} × 10^${s.length - 1}`;
          const num = Number(n);
          const names = [[15, "quadrillion"], [12, "trillion"], [9, "billion"], [6, "million"], [3, "thousand"]];
          for (const [z, nm] of names) {
            if (num >= Math.pow(10, z)) {
              const v = (num / Math.pow(10, z)).toPrecision(3);
              // strip trailing zeros only after a decimal point ("2.50"→"2.5", never "100"→"1")
              return (v.includes(".") ? v.replace(/\.?0+$/, "") : v) + " " + nm;
            }
          }
          return Math.round(num).toLocaleString();
        };
        const human = (sec) => {
          if (sec < 1n) return "under a second";
          if (sec < 60n) return `${sec} second${sec === 1n ? "" : "s"}`;
          if (sec < 3600n) return `${sec / 60n} minutes`;
          if (sec < 86400n) return `${sec / 3600n} hours`;
          if (sec < YEAR) return `${sec / 86400n} days`;
          return `${big(sec / YEAR)} years`;
        };

        host.innerHTML = `
          <div class="viz crkviz">
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">stored as</span>
              ${ALGOS.map((a) => `<button class="viz-btn mono ${a.id === algo ? "primary" : ""}" data-algo="${a.id}">${a.name}</button>`).join("")}
            </div>
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">charset</span>
              ${CHARSETS.map((c) => `<button class="viz-btn mono ${c.id === charset ? "primary" : ""}" data-cs="${c.id}">${c.name}</button>`).join("")}
              <label class="sub-slider" style="margin-left:12px">length <b data-r="lenv"></b>
                <input type="range" min="6" max="16" value="${len}" data-r="len" aria-label="password length"></label>
            </div>
            <div class="lnx-read" data-r="outs"></div>
            <p class="asm-msg" data-r="say"></p>
          </div>`;

        function paint() {
          $$("[data-algo]", host).forEach((b) => b.classList.toggle("primary", b.dataset.algo === algo));
          $$("[data-cs]", host).forEach((b) => b.classList.toggle("primary", b.dataset.cs === charset));
          $('[data-r="lenv"]', host).textContent = len;

          const a = ALGOS.find((x) => x.id === algo);
          const cs = CHARSETS.find((x) => x.id === charset);
          const keyspace = cs.size ** BigInt(len);
          const seconds = keyspace / a.rate;

          $('[data-r="outs"]', host).innerHTML = [
            ["charset size", cs.size.toString()],
            ["keyspace", big(keyspace) + (keyspace.toString().length > 18 ? "" : " combos")],
            ["guess rate", big(a.rate) + " / s"],
            ["time to crack", human(seconds)],
          ].map(([k, v], i) =>
            `<div class="lnx-out" style="${i === 3 ? "border-color:var(--accent)" : ""}"><span>${k}</span><code>${v}</code></div>`).join("");

          $('[data-r="say"]', host).innerHTML = fmt(
            `A ${len}-character ${cs.name.replace("+ ", "with ")} password stored with **${a.name}**: `
            + `${a.note}. Worst case, exhausting the whole keyspace takes about **${human(seconds)}**. `
            + "The algorithm's slowness matters as much as the password's length — that is why you store "
            + "with argon2id, not a raw fast hash. (Average case is about half this; the guess rates are "
            + "honest ballparks.)");
        }

        host.addEventListener("click", (e) => {
          const a = e.target.closest("[data-algo]");
          if (a) { algo = a.dataset.algo; paint(); return; }
          const c = e.target.closest("[data-cs]");
          if (c) { charset = c.dataset.cs; paint(); }
        });
        host.addEventListener("input", (e) => {
          if (e.target.matches('[data-r="len"]')) { len = +e.target.value; paint(); }
        });
        paint();
      },
    },
  ];
})();
