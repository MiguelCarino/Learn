/* =====================================================================
   Carino Learn — course: REGEX  (Regular Expressions)
   Goal: take a complete beginner — someone who has never written a
   pattern — and make them comfortable finding and reshaping text with
   regex in grep, sed, awk, JavaScript and Python. Thirteen hands-on
   stages, every one with a walkthrough, drills and a live-practice
   nudge toward regex101.com. Correct patterns, right flavor per tool.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["regex"] = {
  id: "regex",
  title: "Regex",
  tag: "pattern matching",
  icon: "regex",
  blurb: "Describe patterns in text and match, extract or rewrite it anywhere.",
  intro:
    "Regex (regular expressions) is a tiny language for describing patterns in text — 'three digits, " +
    "a dash, four digits' instead of one fixed word. This course is hands-on: you'll run patterns through " +
    "grep and sed on the command line and use them in real code (JavaScript and Python), building from a " +
    "plain literal search up to extracting fields from a log line. Keep regex101.com open in a browser as " +
    "you go — it highlights matches and explains every piece of your pattern live, and it's the fastest way to learn.",
  meta: [["Flavors", "POSIX · PCRE · JS"], ["Tools", "grep · sed · awk"], ["Practice", "regex101.com"]],

  tracks: [
    { id: "basics", label: "Matching basics",       stages: [0, 1, 2, 3, 4] },
    { id: "power",  label: "Quantifiers & groups",  stages: [5, 6, 7, 8, 9] },
    { id: "apply",  label: "In the real world",     stages: [10, 11, 12] },
  ],

  reference: [
    {
      kind: "table",
      title: "The metacharacters (the 'magic' symbols)",
      head: ["symbol", "what it matches / does"],
      rows: [
        [".", "any single character (except newline)"],
        ["^", "start of line / string (anchor)"],
        ["$", "end of line / string (anchor)"],
        ["*", "zero or more of the previous item"],
        ["+", "one or more of the previous item"],
        ["?", "zero or one (makes the previous item optional)"],
        ["[ ]", "a character class: match any one char inside"],
        ["( )", "a group: capture text and/or apply a quantifier"],
        ["{ }", "a count: {n}, {n,}, {n,m}"],
        ["|", "alternation: match this OR that"],
        ["\\", "escape the next char (make a metacharacter literal)"],
      ],
      foot: "To match one of these literally, put a backslash before it: \\. is a real dot, \\* a real asterisk.",
    },
    {
      kind: "table",
      title: "Character classes & shorthands",
      head: ["symbol", "meaning"],
      rows: [
        ["[abc]", "any one of a, b or c"],
        ["[a-z]", "any lowercase letter (a range)"],
        ["[a-z0-9]", "any lowercase letter or digit"],
        ["[^abc]", "any character EXCEPT a, b, c (negated)"],
        ["\\d / \\D", "a digit / a non-digit  (PCRE, JS, Python)"],
        ["\\w / \\W", "word char (letter, digit, _) / non-word"],
        ["\\s / \\S", "whitespace / non-whitespace"],
        ["[[:digit:]]", "POSIX named class (works in grep -E)"],
        ["[[:alpha:]]", "POSIX: any letter"],
      ],
      foot: "\\d \\w \\s are PCRE; in POSIX grep -E use [0-9] or [[:digit:]] instead.",
    },
    {
      kind: "table",
      title: "Quantifiers & flags",
      head: ["symbol / flag", "meaning"],
      rows: [
        ["*", "zero or more (greedy)"],
        ["+", "one or more (greedy)"],
        ["?", "zero or one (optional)"],
        ["{n}", "exactly n times"],
        ["{n,m}", "between n and m times"],
        ["*?  +?", "lazy: match as FEW as possible"],
        ["i", "flag: case-insensitive"],
        ["g", "flag: global — all matches, not just the first"],
        ["m", "flag: ^ and $ match every line"],
        ["s", "flag: . also matches a newline (dotall)"],
        ["x", "flag: ignore whitespace / allow # comments in the pattern"],
      ],
    },
    {
      kind: "cmds",
      title: "How to run a regex in each tool",
      rows: [
        ["grep — POSIX extended (ERE)", "grep -E 'pat' file"],
        ["grep — Perl syntax (PCRE)", "grep -P 'pat' file"],
        ["sed — substitute", "sed -E 's/pat/repl/g' file"],
        ["awk — match a line, print a field", "awk '/pat/ {print $1}' file"],
        ["ripgrep — fast recursive search", "rg 'pat' ."],
        ["JavaScript — test / replace", "/pat/flags.test(s)   s.replace(/pat/g, r)"],
        ["Python — search / substitute", "re.search(r'pat', s)   re.sub(r'pat', r, s)"],
      ],
      foot: "Practise any pattern live, with a plain-English explainer: https://regex101.com",
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "What regex is & where you meet it",
      tag: "your first pattern",
      time: "30–45 min",
      payoff:
        "Regex is a mini-language for finding patterns in text, and once you have it you stop doing " +
        "tedious edits by hand. Almost every tool you already use — grep, your code editor's search box, " +
        "JavaScript, Python — speaks some dialect of it, so learning the shared core once pays off everywhere.",
      concepts: [
        "what a pattern is",
        "literal matching first",
        "grep 'word' file",
        "where regex shows up",
        "regex101.com",
        "regex = regular expression",
      ],
      code:
`# Search for the literal word "cat" in a file
grep 'cat' pets.txt        # prints every line containing c-a-t in a row

# Suppose pets.txt contains:
#   the cat sat
#   a dog barked
#   category five
# grep 'cat' matches lines 1 AND 3 (cat, and inside category)

# The very same idea in other tools:
#   JavaScript:  /cat/.test("the cat sat")      -> true
#   Python:      re.search("cat", "the cat sat") -> a match

# Practise any pattern live, with an explanation panel:
#   https://regex101.com`,
      lang: "bash",
      walkthrough: [
        "**Regex** ('regular expression') is a tiny language for describing *patterns* in text. Instead of searching for one fixed word, you describe a *shape* — 'three digits, a dash, four digits' — and the tool finds every piece of text that fits.",
        "**Start with literal matching.** The simplest pattern is just the text itself. **`grep 'cat' pets.txt`** prints every line that contains the letters c-a-t in a row. No special characters yet — a plain-text search is already a (very simple) regex.",
        "**One gotcha even here:** a literal search matches *anywhere* in the line and ignores word boundaries, so `grep 'cat'` also matches `category` and `scatter`. You'll learn to tighten that up in stage 4.",
        "**Where you meet regex:** `grep` and `sed` on the command line, the Find box in almost every editor (VS Code, Vim, Sublime), and inside real languages — JavaScript's `/cat/`, Python's `re` module. The same pattern idea travels everywhere, with small dialect differences covered in stage 10.",
        "**Practise live.** Open **regex101.com**: type a pattern up top, sample text below, and it highlights matches *and explains every piece of your pattern in plain English* as you type. It is the single best way to learn — keep it open beside this course.",
      ],
      exercise:
        "Open regex101.com and paste this sample text: `the cat sat / a dog barked / category five` (on three " +
        "lines). Type `cat` in the pattern box and watch which lines light up — you'll see it matches both `cat` " +
        "and `category`. Then, in a terminal, create a small file with those lines and run `grep 'cat' yourfile` " +
        "to confirm you get the same matches. In one sentence, explain why `category` matched.",
      drills: [
        "On regex101, type the pattern `dog` with sample `dog dogged underdog` — note it matches inside `dogged` and `underdog` too.",
        "Run `grep -i 'cat' file` and see how `-i` makes the search ignore case, so it also matches `Cat` and `CAT`.",
        "Open your editor's Find box, click the `.*` (regex) icon, and search `cat` — same pattern, different tool.",
      ],
      note:
        "Regex has small dialect differences between tools (grep, JavaScript, Python), but the core — literals, " +
        "the dot, classes, quantifiers — is shared. Learn the core here; stage 10 covers the quirks. Keep " +
        "regex101.com open as you go: its live explanation panel teaches faster than any reference.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "Metacharacters & escaping",
      tag: "the magic characters",
      time: "1 hr",
      payoff:
        "The whole power of regex lives in about a dozen special characters. Knowing which characters are " +
        "'magic' — and how to switch that magic off with a backslash when you want the literal symbol — is the " +
        "foundation everything else is built on.",
      concepts: [
        "metacharacters . ^ $ * + ? [ ] ( ) { } | \\",
        "the dot . = any character",
        "\\ escapes a literal",
        "\\. = a real dot",
        "grep -E (ERE) vs plain grep (BRE)",
        "when to escape",
      ],
      code:
`# The dot . matches ANY single character
grep -E 'c.t' words.txt      # matches cat, cot, c9t, even "c t" (c, space, t)

# To match a LITERAL dot, escape it with a backslash: \\.
grep -E 'example\\.com' urls.txt   # the dot is a real dot, not "any char"

# Why it matters — sample text: "3.14 and 3x14"
#   pattern  3.14    matches BOTH  3.14  and  3x14   (dot = wildcard!)
#   pattern  3\\.14   matches ONLY  3.14              (escaped = literal)

# The same escape works for every metacharacter:
#   \\*  literal *      \\?  literal ?      \\(  literal (      \\\\  literal \\`,
      lang: "bash",
      walkthrough: [
        "**Most characters are literal** — `a` matches an `a`. But a handful are **metacharacters** with special powers: `.` `^` `$` `*` `+` `?` `[` `]` `(` `)` `{` `}` `|` and the backslash `\\`. The whole course is learning what each of these does.",
        "**The dot `.` matches any single character** (except a newline). So **`c.t`** matches `cat`, `cot`, `c9t`, even `c t` (c, space, t). It's a wildcard for exactly one position.",
        "**To match a metacharacter literally, escape it** with a backslash. **`\\.`** means 'a real dot', not 'any character', so `example\\.com` matches the text `example.com` but not `exampleXcom`. This is the number-one beginner bug: an unescaped `.` in `3.14` also matches `3x14`.",
        "**The same trick works for every metacharacter:** `\\*` is a literal asterisk, `\\?` a literal question mark, `\\(` a literal parenthesis, and `\\\\` a literal backslash. When you're unsure whether a symbol is special, escaping it is always safe.",
        "**`grep -E`** turns on **ERE** (Extended Regular Expression) — the flavor where `+ ? { } ( ) |` work without extra backslashes. Plain `grep` uses **BRE** (Basic Regular Expression), where several of those need escaping. Stage 10 covers the difference; for now, use `grep -E` and life is simpler.",
      ],
      exercise:
        "Prove you understand the dot and escaping. With the sample `3.14 and 3x14 and 3-14` (on regex101 or via " +
        "`grep -E`): first match with `3.14` and note it matches ALL THREE (the dot is a wildcard). Then change " +
        "the pattern to `3\\.14` and confirm it now matches only the real `3.14`. Finally, write a pattern that " +
        "matches `example.com` literally but NOT `exampleXcom`.",
      drills: [
        "On regex101, match `a.c` against `abc a c a1c ac` — note `ac` does NOT match (the dot needs one character).",
        "Write a pattern for a literal `?`: use `\\?` and test it against `ok? yes`.",
        "Escape a literal backslash: match the text `C:\\Users` with the pattern `C:\\\\Users` and see it work.",
      ],
      note:
        "A frequent trap: inside a character class `[...]` most metacharacters are already literal, so `[.]` is a " +
        "plain dot and you don't need `\\.` there. Outside a class, though, an unescaped `.` is a wildcard — the " +
        "most common source of 'my pattern matches too much'.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "Character classes",
      tag: "one of a set",
      time: "1 hr",
      payoff:
        "Real patterns rarely match one fixed letter; they match 'any digit' or 'any vowel'. Character classes " +
        "are how you say 'one character from this set', and they turn up in nearly every pattern you'll ever write.",
      concepts: [
        "[abc] = one of a set",
        "ranges [a-z0-9]",
        "negation [^...]",
        "^ inside vs outside brackets",
        "POSIX [[:alpha:]]",
        "little escaping needed inside",
      ],
      code:
`grep -E '[aeiou]' file          # any line containing a vowel
grep -E 'gr[ae]y' file          # matches "gray" OR "grey" (one slot, a or e)
grep -E '[0-9]' file            # any digit
grep -E '[a-zA-Z0-9]' file      # any letter or digit (three ranges combined)
grep -E '[^0-9]' file           # any character that is NOT a digit
grep -E '[[:alpha:]]' file      # POSIX class: any alphabetic character

# Sample: "gray skies, grey seas"
#   gr[ae]y  matches BOTH gray and grey`,
      lang: "bash",
      walkthrough: [
        "**A character class `[...]` matches exactly one character from a set.** **`[aeiou]`** matches any single vowel, so `gr[ae]y` matches `gray` or `grey` — the class fills one position with 'either a or e'.",
        "**Ranges save typing.** **`[a-z]`** is every lowercase letter, **`[0-9]`** every digit, **`[a-zA-Z0-9]`** any letter or digit. The dash means 'through', but *only between two characters*; a literal dash goes first or last, like `[-+]` or `[a-]`.",
        "**Negation:** a `^` as the *first* character inside the brackets flips the set. **`[^0-9]`** means 'any character that is NOT a digit'. (Outside brackets, `^` means something completely different — start of line — which trips people up; you'll meet that in stage 4.)",
        "**Inside a class, most metacharacters lose their magic.** `[.]` is a literal dot and `[+*?]` matches those three literal symbols. You rarely need to escape inside `[...]` — a nice simplification.",
        "**POSIX classes** are named sets that read clearly and work in `grep -E`: **`[[:alpha:]]`** (letters), `[[:digit:]]` (digits), `[[:space:]]` (whitespace), `[[:alnum:]]` (letters and digits). Note the *double* brackets — `[:alpha:]` is the class name sitting inside a normal `[...]`. **POSIX** ('Portable Operating System Interface') is the standard they follow, so they work even where `\\d` does not.",
      ],
      exercise:
        "Using the sample `gray grey groy gr8y`: write `gr[ae]y` and confirm it matches only `gray` and `grey`. " +
        "Then write a class that also allows `groy` but still rejects `gr8y` (hint: put `o` in the class). Finally, " +
        "write `[^0-9]` and describe in words which characters it matches, then try `[[:alpha:]]` and compare the two.",
      drills: [
        "Match a hex digit with `[0-9a-fA-F]` against `1f G3 zz`.",
        "Match anything that is NOT a space with `[^ ]` — a poor-man's `\\S`.",
        "Compare `[[:digit:]]` and `[0-9]` on the same input and confirm they behave identically in `grep -E`.",
      ],
      note:
        "The dash `-` is only a range when it sits *between* two characters; put it first or last (`[-a]` or " +
        "`[a-]`) to match a literal dash. Also beware that `[a-Z]` (mixing cases across one range) is usually a " +
        "mistake — write `[a-zA-Z]` instead.",
    },

    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Shorthand classes",
      tag: "\\d \\w \\s",
      time: "45 min",
      payoff:
        "Typing `[0-9]` a dozen times is tedious. Shorthand classes like `\\d` and `\\w` compress the most " +
        "common sets into two characters — but they aren't available everywhere, and knowing where they work " +
        "saves you a baffling 'why doesn't my pattern match?' moment.",
      concepts: [
        "\\d \\w \\s",
        "\\D \\W \\S (negations)",
        "shorthand = shorter patterns",
        "PCRE vs POSIX availability",
        "grep -P vs grep -E",
        "\\w includes the underscore",
      ],
      code:
`# \\d \\w \\s need PCRE — use grep -P (not -E)
grep -P '\\d' file        # \\d = a digit (same as [0-9])
grep -P '\\w' file        # \\w = word char: a letter, digit or underscore
grep -P '\\s' file        # \\s = whitespace (space, tab, newline)
grep -P '\\D' file        # \\D = NOT a digit (capital = negation)

# In grep -E (POSIX ERE) there is NO \\d — use a class instead:
grep -E '[0-9]' file
grep -E '[[:digit:]]' file

# JavaScript & Python understand \\d \\w \\s directly:
#   /\\d\\d:\\d\\d/  matches a time like 09:30`,
      lang: "bash",
      walkthrough: [
        "**Shorthand classes are quick abbreviations** for common sets. **`\\d`** = a digit (same as `[0-9]`), **`\\w`** = a 'word character' (a letter, digit or underscore), **`\\s`** = whitespace (space, tab, newline). They make patterns much shorter — a time is just `\\d\\d:\\d\\d`.",
        "**Their capital versions negate them.** **`\\D`** = anything that is NOT a digit, **`\\W`** = not a word character, **`\\S`** = not whitespace. Handy rule: lowercase = 'in the set', uppercase = 'everything else'.",
        "**Availability is the catch.** These come from **PCRE** (Perl-Compatible Regular Expressions), so they work in **`grep -P`**, JavaScript, Python, GNU `sed`, and most editors — but **NOT** in POSIX **`grep -E`**. In `-E`, write `[0-9]` or `[[:digit:]]` instead of `\\d`.",
        "**So which do I use?** In JS/Python and `grep -P`, reach for `\\d \\w \\s` — they're concise and universally understood there. On a strict POSIX `grep -E` (or in `awk`), fall back to the class or POSIX form. Stage 10 lists exactly what each tool supports.",
        "**A subtlety:** `\\w` includes the underscore `_`, and (with Unicode on in some engines) accented letters too — it is *not* just `[a-z]`. Likewise `\\d` can match non-ASCII digits in some engines. For plain ASCII work this rarely bites, but it's why `\\w` and `[a-zA-Z]` aren't perfectly identical.",
      ],
      exercise:
        "On the sample `Order 42 shipped on 2024-08-01`: in a PCRE tool (regex101 set to PCRE, or `grep -P`) write " +
        "`\\d+` and confirm it grabs `42`, `2024`, `08`, `01`. Now write the SAME idea for a strict `grep -E` using " +
        "`[0-9]+` and check you get identical matches. Then try `\\w+` and describe what counts as a 'word'. " +
        "Bonus: what does `\\D+` match in that sample?",
      drills: [
        "In `grep -P`, match `\\d\\d:\\d\\d` against `it is 09:30 now` to grab the time.",
        "Match `\\w+` against `hello_world foo-bar` — note the `-` breaks the word but `_` does not.",
        "Swap `\\d` for `\\D` and describe what changes when you test against `a1b2c3`.",
      ],
      note:
        "Because `\\d`, `\\w`, `\\s` are PCRE features, a pattern copied from a JavaScript or Python tutorial often " +
        "fails in `grep -E` — that's not a bug, it's the flavor. Either add `-P` to grep or translate `\\d` to " +
        "`[0-9]`. This single mismatch causes a huge share of beginner confusion.",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "Anchors & boundaries",
      tag: "position, not text",
      time: "1 hr",
      payoff:
        "Sometimes *where* a match sits matters as much as *what* it is: only at the start of a line, only as a " +
        "whole word. Anchors and boundaries pin your pattern to a position, which is how you stop `cat` from " +
        "matching inside `category`.",
      concepts: [
        "^ start, $ end",
        "^$ = empty line",
        "^exact$ = whole line",
        "\\b word boundary",
        "\\B non-boundary",
        "the m (multiline) flag",
      ],
      code:
`grep -E '^Error' log.txt      # lines that START with Error
grep -E 'done$'  log.txt      # lines that END with done
grep -E '^$'     file         # completely empty lines (start = end)
grep -P '\\bcat\\b' file        # the WORD cat, not "category" or "scatter"

# ^ and $ anchor to line start/end; \\b anchors to a word boundary
# Sample: "cat category scatter"
#   \\bcat\\b  matches only the standalone "cat"`,
      lang: "bash",
      walkthrough: [
        "**Anchors match a *position*, not a character** — they have zero width. **`^`** matches the start of a line, **`$`** the end. So `^Error` finds lines that *begin* with `Error`, and `done$` finds lines that *end* with `done`.",
        "**Combine them to match a whole line.** **`^$`** matches a completely empty line (start immediately followed by end). **`^cat$`** matches a line that is *exactly* `cat` and nothing else — the way to demand an exact match rather than 'contains'.",
        "**`\\b` is a word boundary** — the invisible edge between a word character (`\\w`) and a non-word character. **`\\bcat\\b`** matches the standalone word `cat` but not `category` or `scatter`. This fixes the stage-0 problem of matching inside longer words. (`\\b` needs `grep -P`; it's a PCRE feature.)",
        "**`\\B`** is the opposite — a *non*-boundary, a position *inside* a word. `\\Bcat\\B` matches `cat` only when it's buried in a longer word (like the middle of `muscatel`). Less common, but occasionally exactly what you want.",
        "**Multiline behavior.** In line-based tools like `grep`, `^` and `$` already match the start/end of each line. In JavaScript and Python, `^`/`$` anchor to the whole string by default — you turn on per-line behavior with the **`m`** (multiline) flag, after which they match at every line break. Stage 10 covers flags.",
      ],
      exercise:
        "Using a few lines of log text, find lines that START with `Error` using `^Error`, and lines that END with " +
        "`failed` using `failed$`. Then, on the sample `cat category scatter`, use `\\bcat\\b` (in `grep -P` or " +
        "regex101/PCRE) and confirm it matches only the standalone `cat`. Finally, explain in your own words why " +
        "`^` inside `[^abc]` means something different from `^` at the start of a pattern.",
      drills: [
        "Find blank lines in a file with `grep -En '^$' file` (the `-n` adds line numbers).",
        "Match a whole-line exact word: `^ok$` against the lines `ok`, `okay`, `not ok`.",
        "In `grep -P`, compare `\\bcat\\b` and plain `cat` on `cat category scatter cat.` and note the difference.",
      ],
      note:
        "Anchors are 'zero-width' — they match a position between characters, not a character itself, so they never " +
        "consume input. In line-oriented tools like grep, `^`/`$` already mean line start/end; in JavaScript and " +
        "Python you must add the `m` flag for per-line behavior, otherwise they anchor to the whole string.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "Quantifiers",
      tag: "how many times",
      time: "1 hr",
      payoff:
        "Patterns get useful the moment you can say 'one or more' or 'exactly four'. Quantifiers control " +
        "repetition, turning a fixed pattern into one that matches a phone number, a year, or an optional letter.",
      concepts: [
        "* = zero or more",
        "+ = one or more",
        "? = optional",
        "{n} {n,} {n,m}",
        "what the quantifier applies to",
        "greedy by default",
      ],
      code:
`grep -E 'ab*c' file      # a, then ZERO or more b, then c:  ac abc abbbc
grep -E 'ab+c' file      # a, then ONE or more b, then c:   abc abbc (not ac)
grep -E 'colou?r' file   # optional u:  color OR colour
grep -E 'a{3}' file      # exactly 3 a's:  aaa
grep -E 'a{2,4}' file    # between 2 and 4 a's
grep -E 'a{2,}' file     # 2 or more a's
grep -E '[0-9]{4}' file  # a four-digit year

# * + ? {n,m} are GREEDY: they grab as much as they can (see stage 6)`,
      lang: "bash",
      walkthrough: [
        "**A quantifier says how many times** the item before it may repeat. **`*`** = zero or more, **`+`** = one or more, **`?`** = zero or one (optional). So `ab*c` matches `ac`, `abc`, `abbbc`; `ab+c` needs at least one `b` (so `ac` fails); `colou?r` makes the `u` optional, matching both `color` and `colour`.",
        "**The item they apply to is whatever is directly before them** — a single character, a class, or a group. `a*` repeats `a`; `[0-9]*` repeats the digit class; `(ab)*` repeats the whole `ab` (you'll meet groups in stage 7).",
        "**Braces give exact counts.** **`{n}`** = exactly n, **`{n,}`** = n or more, **`{n,m}`** = between n and m. So `a{3}` matches `aaa`, `a{2,4}` matches 2 to 4 a's, `[0-9]{4}` matches a four-digit year. These are just precise cousins of `* + ?`: `*` is `{0,}`, `+` is `{1,}`, `?` is `{0,1}`.",
        "**In BRE (plain `grep`), braces must be escaped** as `\\{2,4\\}`. In `grep -E`/`-P`, JavaScript and Python they work bare — another reason this course defaults to `grep -E`.",
        "**All of these are *greedy* by default** — they match as *much* as they can while still letting the overall pattern succeed. That's usually fine, but sometimes it grabs too much, which is exactly the problem stage 6 solves.",
      ],
      exercise:
        "On the sample `color colour colouur ac abc abbc`: write `colou?r` and confirm it matches `color` and " +
        "`colour` but not `colouur`. Write `ab+c` and confirm it matches `abc` and `abbc` but NOT `ac`. Then write " +
        "a pattern for a 4-digit year using `{n}` and test it against `2024`. Finally, express `+` using brace " +
        "syntax (what `{n,}` is equivalent to `+`?).",
      drills: [
        "Match `go+gle` against `gogle google gooogle ggle` and note which ones fail.",
        "Write `[0-9]{3}-[0-9]{4}` for a 7-digit phone like `555-1234`.",
        "Show that `a*` can match the empty string by testing it against `bbb` (every position 'matches').",
      ],
      note:
        "Watch out for `.*` — it means 'any character, any number of times', which matches almost anything, " +
        "including nothing. It's useful but greedy (stage 6), and it's the seed of the backtracking problems in " +
        "stage 12. Reach for a specific class like `[0-9]*` when you can.",
    },

    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Greedy vs lazy",
      tag: "grabbing too much",
      time: "1 hr",
      payoff:
        "The most common regex surprise is a pattern that matches far more than you meant. Understanding that " +
        "quantifiers are greedy by default — and how to make them lazy — is what turns 'why did it grab the whole " +
        "line?' into a five-second fix.",
      concepts: [
        "greedy = grab the most",
        "lazy: *? +? ??",
        "the <.*> trap",
        "quoted-string example",
        "grep -o to see the match",
        "negated class as an alternative",
      ],
      code:
`# Greedy .* grabs as MUCH as possible
echo '<b>hi</b> <i>yo</i>' | grep -oE '<.*>'
#   -> <b>hi</b> <i>yo</i>      (ONE giant match!)

# Lazy .*? grabs as LITTLE as possible (needs -P)
echo '<b>hi</b> <i>yo</i>' | grep -oP '<.*?>'
#   -> <b>   </b>   <i>   </i>  (four small matches)

# Quoted strings — sample:  "a" and "b"
#   ".*"    greedy -> matches  "a" and "b"   (the whole thing)
#   ".*?"   lazy   -> matches  "a"  then  "b"
#   "[^"]*" class  -> matches  "a"  then  "b"   (often best)`,
      lang: "bash",
      walkthrough: [
        "**Greedy means 'grab as much as possible'.** Given `<b>hi</b> <i>yo</i>`, the pattern **`<.*>`** does NOT stop at the first `>`. The `.*` swallows everything, then backtracks just enough to leave a final `>` — so it matches the *entire* string in one go.",
        "**Lazy (non-greedy) means 'grab as little as possible'.** Add a **`?`** after the quantifier: **`*?`**, **`+?`**, **`??`**, **`{2,4}?`**. Now **`<.*?>`** stops at the *first* `>`, matching `<b>`, then `</b>`, then `<i>`, then `</i>` as four separate small matches.",
        "**The `-o` flag in the examples** prints only the matched text (not the whole line), which makes the greedy-vs-lazy difference visible. Lazy quantifiers are a **PCRE** feature, so the lazy example uses **`grep -P`** while the greedy one works fine in `grep -E`.",
        "**The classic real case is quoted strings.** In `\"a\" and \"b\"`, the pattern `\".*\"` greedily matches from the first quote to the *last* — `\"a\" and \"b\"` all as one. The lazy `\".*?\"` (or the class trick `\"[^\"]*\"`) correctly matches `\"a\"` and `\"b\"` separately.",
        "**Often a negated class beats lazy.** `[^\"]*` ('anything that isn't a quote') is both clearer and faster than `.*?` for 'up to the next quote', and it dodges the backtracking traps you'll meet in stage 12. Reach for lazy when there's no obvious 'stop' character; reach for a negated class when there is.",
      ],
      exercise:
        "Paste `<b>hi</b> <i>yo</i>` into regex101. Match with `<.*>` and watch it select the WHOLE string (greedy). " +
        "Change it to `<.*?>` and watch it select four separate tags (lazy). Then, on `\"a\" and \"b\"`, show that " +
        "`\".*\"` grabs everything while `\"[^\"]*\"` correctly matches the two quoted letters separately. Explain in " +
        "one sentence why the negated class works.",
      drills: [
        "Compare `<.*>` and `<.*?>` on `<a><b><c>` using `grep -oE` then `grep -oP`.",
        "Use `\"[^\"]*\"` to grab each quoted string in `say \"hi\" and \"bye\"`.",
        "Add `?` to a `+`: compare `[0-9]+` and `[0-9]+?` on `12345` in a PCRE tool and watch the match shrink to one digit.",
      ],
      note:
        "Not every tool supports lazy quantifiers: they're a PCRE feature, so `grep -P` and JavaScript/Python have " +
        "them, but POSIX `grep -E` and `awk` do not. When lazy isn't available, the negated-class trick `[^x]*` " +
        "usually does the same job — and is often faster and clearer anyway.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "Groups & alternation",
      tag: "bundles & OR",
      time: "1–2 hrs",
      payoff:
        "Grouping lets you apply a quantifier to several characters at once and remember the text you matched; " +
        "alternation lets you say 'this or that'. Together they take you from matching fixed strings to matching " +
        "real, varied structure.",
      concepts: [
        "( ) capturing group",
        "(?:...) non-capturing",
        "| alternation (OR)",
        "group + quantifier",
        "precedence of |",
        "https? = optional letter",
      ],
      code:
`grep -E 'cat|dog' file          # matches cat OR dog
grep -E 'gr(a|e)y' file         # group + alternation: gray or grey
grep -E '(ab)+' file            # one or more of "ab": ab, abab, ababab
grep -E '(https?|ftp)://' file  # a URL scheme; https? = http with optional s

# Non-capturing group (?:...) groups WITHOUT capturing (PCRE/JS/Python):
grep -P '(?:ab)+' file

# Precedence: | is LOWEST.  ^cat|dog$  means  (^cat) OR (dog$)
# For "a line that is exactly cat or dog", group it:  ^(cat|dog)$`,
      lang: "bash",
      walkthrough: [
        "**Parentheses `( )` create a group** — they bundle several items so a quantifier or alternation applies to the whole bundle. **`(ab)+`** matches `ab`, `abab`, `ababab` — one or more of the pair `ab`, which `ab+` (one a, many b) could never do.",
        "**Groups also *capture*.** Each `( )` remembers the text it matched, numbered left to right: group 1, group 2… You reuse those captures in backreferences and substitutions — the whole of stage 8.",
        "**Alternation `|` means OR.** **`cat|dog`** matches `cat` or `dog`. Combine with a group to bound it: **`gr(a|e)y`** matches `gray` or `grey`, and `(https?|ftp)://` matches a URL scheme. (`https?` = `http` with an optional `s`.)",
        "**Precedence matters.** `|` has the *lowest* precedence of all — it splits the whole pattern. So **`^cat|dog$`** actually means `(^cat)` OR `(dog$)` — 'starts with cat, OR ends with dog' — NOT 'a line that is cat or dog'. To get the latter, group it: `^(cat|dog)$`. Forgetting this is a very common bug.",
        "**Non-capturing groups `(?:...)`** group *without* creating a numbered capture. **`(?:ab)+`** repeats `ab` but doesn't clutter your capture numbers. Use them when you only need grouping, not the captured text — it keeps `\\1`, `\\2` pointing at the groups you actually care about. (A **PCRE**/JS/Python feature; use `grep -P`.)",
      ],
      exercise:
        "On a sample containing `gray grey cats dogs http://x ftp://y`: write `gr(a|e)y` and match both spellings. " +
        "Write `cat|dog` and match both animals. Write `(https?|ftp)://` and match both URL schemes. Then " +
        "demonstrate the precedence trap: show what `^cat|dog$` matches versus what `^(cat|dog)$` matches on the " +
        "lines `cat`, `dog`, and `dogcat`.",
      drills: [
        "Match `(ha)+` against `ha haha hahaha hhaa`.",
        "Match a file extension with `\\.(jpg|png|gif)$` against `a.png b.txt c.gif`.",
        "Show the difference between `^(cat|dog)$` and `^cat|dog$` on the single line `dogcat`.",
      ],
      note:
        "By default `( )` both groups AND captures, which costs a little and shifts your capture numbers. If you " +
        "only need grouping (for a quantifier or alternation), use the non-capturing `(?:...)` so your `\\1`, `\\2` " +
        "stay lined up with the captures you actually care about — a habit that pays off in long patterns.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "Backreferences & substitution",
      tag: "find & rewrite",
      time: "1–2 hrs",
      payoff:
        "Regex isn't only for finding — it's for *rewriting*. Capturing text and referring back to it lets you " +
        "reorder names, reformat dates, and transform files with a single `sed` command, and it's the heart of " +
        "every find-and-replace you'll ever do.",
      concepts: [
        "s/pat/repl/ substitution",
        "\\1 \\2 backreferences",
        "(\\w)\\1 = a doubled char",
        "named groups (?<name>..)",
        "sed \\1 vs JavaScript $1",
        "the g (global) flag",
      ],
      code:
`# sed: swap two captured groups. -E turns on extended regex.
echo 'John Smith' | sed -E 's/(\\w+) (\\w+)/\\2 \\1/'
#   -> Smith John        (group 1 = John, group 2 = Smith)

# A backreference \\1 INSIDE the pattern = "the same text again"
grep -P '(\\w)\\1' file      # a doubled letter: the ss in pass, ee in tree

# Named groups (PCRE / JS / Python):  (?<word>\\w+)
# Replacement references differ by tool:
#   sed & Python re.sub:  \\1  \\2
#   JavaScript replace:   $1  $2
#   "John Smith".replace(/(\\w+) (\\w+)/, "$2 $1")  -> "Smith John"`,
      lang: "bash",
      walkthrough: [
        "**Substitution replaces matched text.** **`sed -E 's/pattern/replacement/'`** finds `pattern` and swaps in `replacement`. The `-E` gives you ERE so groups don't need escaping; a trailing `g` (as in `s/.../.../g`) replaces *all* matches on a line, not just the first.",
        "**In the replacement, `\\1` `\\2` mean 'the text captured by group 1, 2…'.** So `sed -E 's/(\\w+) (\\w+)/\\2 \\1/'` on `John Smith` swaps the words to `Smith John`: group 1 caught `John`, group 2 caught `Smith`, and the replacement writes them back in the other order.",
        "**A backreference *inside the pattern* means 'the same text again'.** **`(\\w)\\1`** matches a doubled character — the `\\1` must equal whatever `(\\w)` just matched — so it finds the `ss` in `pass`, the `ee` in `tree`. A plain wildcard cannot express that.",
        "**Named groups** make big patterns readable: **`(?<year>\\d{4})`** captures into the name `year` instead of a number. You refer to it as `\\k<year>` in-pattern, or `$<year>` (JavaScript) / `\\g<year>` (Python) in replacements. Supported in JS, Python, and PCRE `grep -P`.",
        "**Different tools spell the replacement reference differently.** `sed` and Python's `re.sub` use **`\\1`**; JavaScript's `String.replace` uses **`$1`** (dollar). So `\"John Smith\".replace(/(\\w+) (\\w+)/, \"$2 $1\")` gives `\"Smith John\"`. Same idea, `$` instead of `\\`.",
      ],
      exercise:
        "In a terminal: `echo 'Jane Doe' | sed -E 's/(\\w+) (\\w+)/\\2 \\1/'` and confirm it prints `Doe Jane`. " +
        "Then find doubled letters: `echo 'bookkeeper' | grep -oP '(\\w)\\1'` and see which pairs it finds. Finally, " +
        "do the same swap in your browser's JavaScript console: `\"Jane Doe\".replace(/(\\w+) (\\w+)/, \"$2 $1\")`, " +
        "and note that JS uses `$1` where sed uses `\\1`.",
      drills: [
        "Reformat a date: `echo '2024-08-01' | sed -E 's|(\\w{4})-(\\w{2})-(\\w{2})|\\3/\\2/\\1|'` (note `|` used as the delimiter).",
        "Find any tripled letter with `(\\w)\\1\\1` (PCRE) against `aaah brrr ok`.",
        "In JavaScript: `\"a-b-c\".replace(/-/g, \"_\")` — swap all dashes for underscores (the `g` does 'all').",
      ],
      note:
        "Mind the delimiter: `sed` uses `s/pat/repl/`, but if your pattern contains slashes (like a path), switch " +
        "the delimiter — `s|pat|repl|` or `s#pat#repl#` — to avoid a forest of `\\/`. And remember the tool split: " +
        "`sed` and Python use `\\1` in replacements, JavaScript uses `$1`; naming groups makes both far more readable.",
    },

    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "Lookaround",
      tag: "peeking around",
      time: "1–2 hrs",
      payoff:
        "Lookaround lets a pattern check its surroundings without consuming them — 'a price, but only after a $ " +
        "sign', 'at least 8 characters and containing a digit'. It unlocks conditions that are awkward or " +
        "impossible any other way, with one catch: not every tool supports it.",
      concepts: [
        "lookahead (?=) (?!)",
        "lookbehind (?<=) (?<!)",
        "zero-width assertions",
        "password-rule example",
        "thousands separator",
        "engine support varies",
      ],
      code:
`# Lookahead (?=...) : match "foo" only if followed by "bar" (bar NOT consumed)
grep -P 'foo(?=bar)' file       # matches foo in "foobar", not in "foobaz"

# Negative lookahead (?!...) : "foo" NOT followed by "bar"
grep -P 'foo(?!bar)' file

# Lookbehind (?<=...) grabs the word right AFTER an @, without the @:
grep -P '(?<=@)\\w+' emails.txt

# Password check: at least 8 chars AND contains a digit somewhere
grep -P '^(?=.*[0-9]).{8,}$' file

# Thousands separators need lookahead (sed lacks lookaround, so use perl):
echo 1234567 | perl -pe 's/\\d(?=(\\d{3})+$)/$&,/g'   # -> 1,234,567`,
      lang: "bash",
      walkthrough: [
        "**Lookaround checks the surroundings without consuming them.** A **lookahead `(?=...)`** asserts 'what follows here matches …' but doesn't include it in the match. **`foo(?=bar)`** matches the `foo` in `foobar` (because `bar` follows) but not in `foobaz` — and `bar` itself is *not* part of the matched text.",
        "**Negative lookahead `(?!...)`** flips it: 'what follows must NOT match'. **`foo(?!bar)`** matches `foo` *unless* it's followed by `bar`. Great for 'this, but not that special case'.",
        "**Lookbehind looks the other way.** **`(?<=...)`** ('positive lookbehind') asserts what *precedes*; **`(?<!...)`** is the negative form. **`(?<=@)\\w+`** grabs the word right after an `@` without including the `@` — perfect for pulling a username out of `@carino`.",
        "**A real example: password rules.** **`^(?=.*[0-9]).{8,}$`** means 'at least 8 characters AND contains a digit somewhere'. The lookahead `(?=.*[0-9])` scans ahead for a digit without moving the cursor, then `.{8,}` checks the length. Stacking several lookaheads is how you express multiple independent requirements.",
        "**Engine support varies — this is the big caveat.** Lookahead is widely supported (PCRE, JS, Python). Lookbehind is newer: fine in PCRE `grep -P`, Python, and modern JavaScript, but **not** in POSIX `grep -E`, `sed`, or `awk`. When a tool lacks lookaround (like `sed`), switch to `perl -pe` — as in the thousands-separator example, which inserts a comma before every group of three trailing digits.",
      ],
      exercise:
        "In a PCRE tool, on the sample `foobar foobaz`: write `foo(?=bar)` and confirm it matches only the `foo` in " +
        "`foobar`. Write `foo(?!bar)` and confirm the opposite. Then, on `$42 and 42 dollars`, use `(?<=\\$)\\d+` to " +
        "grab only the `42` that follows a `$`. Finally, write a password check `^(?=.*[0-9]).{8,}$` and test it " +
        "against `abcdefgh` (fails: no digit) and `abcdefg1` (passes).",
      drills: [
        "Match a digit only when followed by `px`: `\\d(?=px)` against `10px 20em 30px`.",
        "Match a word not preceded by `#`: `(?<!#)\\bword\\b` against `word #word`.",
        "On regex101, confirm `(?=...)` adds zero characters to the match: watch the highlighted match length as you add a lookahead.",
      ],
      note:
        "Lookaround is the least portable feature. Lookahead is common; lookbehind is missing from `sed`, `awk` and " +
        "POSIX `grep`, and older engines required a fixed-length lookbehind. If a lookaround pattern won't run, " +
        "either switch to `grep -P`/`perl`/Python, or restructure to avoid it — sometimes a capture group and a " +
        "second step is simpler.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Flavors & flags",
      tag: "dialects & flags",
      time: "1–2 hrs",
      payoff:
        "The same pattern can work in one tool and fail in another, because 'regex' is really a family of " +
        "dialects. Knowing the differences between grep, grep -E, grep -P, JavaScript and Python — and the flags " +
        "that change matching — is what stops you wasting an hour on a flavor mismatch.",
      concepts: [
        "BRE vs ERE vs PCRE",
        "grep / grep -E / grep -P",
        "JavaScript & Python",
        "flags i g m s x",
        "\\d & lookbehind gaps",
        "match the flavor to the tool",
      ],
      code:
`# BRE (plain grep): braces and groups need escaping!
grep 'a\\{2,3\\}' file       # BRE: braces must be escaped to be a quantifier
grep -E 'a{2,3}' file       # ERE (-E): braces work unescaped
grep -P '\\d{2,3}' file      # PCRE (-P): full Perl syntax, \\d works

# The SAME idea "two or three digits" in three flavors:
#   BRE:  [0-9]\\{2,3\\}
#   ERE:  [0-9]{2,3}
#   PCRE: \\d{2,3}

# Flags change how a pattern behaves:
#   i = ignore case      g = all matches (not just first)
#   m = ^/$ match each line   s = . also matches newline   x = allow spacing/comments
# JavaScript:  /cat/gi          Python:  re.findall("cat", text, re.I)`,
      lang: "bash",
      walkthrough: [
        "**There is no single 'regex' — there are dialects (flavors),** and the differences are small but bite. The three you meet on Linux are POSIX **BRE**, POSIX **ERE**, and **PCRE**.",
        "**BRE (Basic Regular Expression)** is what plain **`grep`** and `sed` use by default. Quirk: `+ ? { } ( ) |` are *literal* unless escaped, so a quantifier count is `a\\{2,3\\}` and a group is `\\(...\\)`. Verbose and easy to get wrong.",
        "**ERE (Extended Regular Expression)** is **`grep -E`** (and `sed -E`, `awk`). Now `+ ? { } ( ) |` work *unescaped* — much nicer. But ERE still has **no** `\\d`, `\\w`, `\\b`; use `[0-9]`, `[[:digit:]]`, and so on.",
        "**PCRE (Perl-Compatible Regular Expressions)** is **`grep -P`**, and the family that JavaScript and Python's `re` closely follow. This is the full toolkit: `\\d \\w \\s`, lazy `*?`, lookaround, named groups, backreferences. When you want everything, use `-P` (or write in JS/Python).",
        "**Flags tune matching, and you'll use these constantly.** **`i`** = ignore case, **`g`** = find all matches not just the first, **`m`** = make `^`/`$` match at every line, **`s`** = let `.` match newlines too ('dotall'), **`x`** = 'extended': ignore whitespace and allow `#` comments in the pattern for readability. In JS they're suffixes — `/cat/gi`; in Python they're arguments — `re.findall(\"cat\", text, re.I)`; in grep, `-i` gives case-insensitivity.",
        "**The differences that actually bite:** `\\d` doesn't exist in `grep -E` (use `[0-9]`); braces need escaping in plain `grep` (BRE); lookbehind is missing in `sed`/`awk`/POSIX grep; and `\\b` needs `grep -P`. When a pattern 'works on regex101 but not in grep', a flavor mismatch is almost always why — set regex101's flavor selector to match your tool.",
      ],
      exercise:
        "Take the pattern 'two or three digits' and write it three ways: BRE for plain `grep` (`[0-9]\\{2,3\\}`), " +
        "ERE for `grep -E` (`[0-9]{2,3}`), and PCRE for `grep -P` (`\\d{2,3}`). Run all three against a file " +
        "containing `4 42 428 4285` and confirm they match the same thing. Then set regex101's flavor selector to " +
        "PCRE, then to POSIX, and watch `\\d` stop working when you switch — the flavor lesson in action.",
      drills: [
        "Run the same pattern `a{2,3}` in `grep` (BRE — it won't quantify) then `grep -E` and observe the difference.",
        "Turn on the `i` flag on regex101 and match `HELLO` with the pattern `hello`.",
        "Turn on the `x` (extended) flag and write `\\d{3}  # area code` — see the spaces and comment ignored.",
      ],
      note:
        "When a pattern works on regex101 but fails in your terminal, check two things first: the flavor " +
        "(regex101 has a selector — set it to PCRE for `grep -P`, POSIX for `grep -E`) and the flags. Most 'regex " +
        "is broken' moments are really 'I used PCRE syntax in a POSIX tool' — for example `\\d` in `grep -E`.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "Regex in the wild",
      tag: "grep sed awk JS py",
      time: "half a day",
      payoff:
        "Knowing patterns is half the job; the other half is running them where the data lives. This stage shows " +
        "the same regex driven through grep, sed, awk, ripgrep, JavaScript and Python on real tasks — finding IPs, " +
        "dates and log fields — plus an honest warning about the tasks regex is bad at.",
      concepts: [
        "grep / ripgrep (rg)",
        "sed extract & rewrite",
        "awk fields",
        "JS test/match/matchAll/replace",
        "Python re module",
        "email/URL validation is hard",
      ],
      code:
`# grep / ripgrep: find lines matching a pattern
grep -E '[0-9]{1,3}(\\.[0-9]{1,3}){3}' access.log   # a rough IPv4 address
rg '\\d{4}-\\d{2}-\\d{2}' .          # ripgrep: ISO dates, whole tree, fast

# sed: extract a field. Pull the domain out of an email:
echo 'a@b.com' | sed -E 's/.*@(.*)/\\1/'      # -> b.com

# awk: match a line, print a column. 7th field of every GET line:
awk '/GET/ {print $7}' access.log

# JavaScript:
#   /\\d+/.test("abc123")            -> true
#   "a1b2".match(/\\d/g)             -> ["1","2"]
#   "a1b2".replace(/\\d/g, "#")      -> "a#b#"

# Python:
#   import re
#   re.search(r"\\d+", "abc123")     -> a match object
#   re.findall(r"\\d+", "a12 b34")   -> ["12", "34"]`,
      lang: "bash",
      walkthrough: [
        "**`grep -E`/`-P` and `ripgrep (rg)`** are your search tools. `grep -E '[0-9]{1,3}(\\.[0-9]{1,3}){3}'` finds anything shaped like an IPv4 address (four dot-separated numbers). **`rg`** (ripgrep) is a faster, recursive `grep` that respects `.gitignore` and defaults to PCRE-ish syntax — ideal for sweeping a whole codebase for `\\d{4}-\\d{2}-\\d{2}` dates.",
        "**`sed` rewrites text.** **`sed -E 's/.*@(.*)/\\1/'`** on `a@b.com` captures everything after the `@` and replaces the whole line with just that, printing `b.com`. `sed` shines at 'extract this field' and 'change X to Y across a file'.",
        "**`awk` matches per line and works in columns.** **`awk '/GET/ {print $7}'`** prints the 7th whitespace-separated field of every line containing `GET` — a natural fit for logs, where you want 'the URL column of every GET request'. The `/pattern/` selects lines; `$7` is the field.",
        "**In JavaScript:** `/\\d+/.test(s)` returns true/false; `s.match(/\\d/g)` returns an array of all matches; `s.matchAll(/(\\d)/g)` yields each match *with its capture groups*; `s.replace(/\\d/g, \"#\")` substitutes. The `g` flag is what makes `match`/`replace` act on *every* occurrence.",
        "**In Python:** `import re`, then `re.search(r\"\\d+\", s)` finds the first match (a match object, or `None`), `re.findall(r\"\\d+\", s)` returns every match as a list, and `re.sub(r\"\\d+\", \"#\", s)` substitutes. Always use **raw strings** `r\"...\"` so Python doesn't eat the backslashes before the regex engine sees them.",
        "**A serious caution: 'validate an email or URL perfectly' is famously near-impossible with regex.** The official email grammar is monstrous, and real addresses break naive patterns. For *finding* likely emails in text a rough pattern is fine; for *validating* user input, use a rough regex for shape plus a real check (send a confirmation link), or a dedicated library — not a giant regex.",
      ],
      exercise:
        "Pick one real task and do it in two tools. Given a line like `192.168.0.1 - GET /home 200`: use " +
        "`grep -oE '[0-9]{1,3}(\\.[0-9]{1,3}){3}'` to pull the IP, and `awk '{print $1}'` to pull the same first " +
        "field — compare. Then in your browser console, run `\"192.168.0.1 - GET /home 200\".match(/\\d+/g)` and " +
        "describe the array you get back. Finally, write one sentence on why you would NOT trust a regex to fully " +
        "validate an email address.",
      drills: [
        "Use `rg -n 'TODO' .` (or `grep -rn 'TODO' .`) to find every TODO across a project tree.",
        "Extract the domain of an email: `echo 'a@b.com' | sed -E 's/.*@//'`.",
        "In Python: `import re; re.findall(r'[0-9]+', 'a12 b3 c456')` and read the list you get back.",
      ],
      note:
        "Two habits save real pain: in Python always write patterns as raw strings `r\"...\"` so backslashes reach " +
        "the engine intact, and in JavaScript remember the `g` flag is what makes `match`/`replace` act on every " +
        "occurrence. And repeat after me: for *validating* emails and URLs, a regex checks rough shape only — real " +
        "validation needs more than a pattern.",
    },

    /* -------------------------------------------------------------- 12 */
    {
      n: 12,
      title: "Capstone & pitfalls",
      tag: "build it & break it",
      time: "half a day",
      payoff:
        "You'll put it all together to extract fields from a real log line and sanity-check user input — then " +
        "learn the traps that bite even experienced people: patterns that hang, over-escaping, and the structures " +
        "you should never parse with regex at all.",
      concepts: [
        "extract log fields",
        "negated-class fields",
        "shape validators",
        "catastrophic backtracking",
        "over-escaping",
        "don't parse HTML/JSON",
      ],
      code:
`# --- Extract fields from a log line ---
# Sample line:
#   192.168.1.5 - - [x] "GET /index.html" 200 2326
echo '192.168.1.5 - - [x] "GET /index.html" 200 2326' \\
  | sed -E 's/^([0-9.]+).*"[A-Z]+ ([^"]+)".* ([0-9]{3}) .*/\\1 | \\2 | \\3/'
#   -> 192.168.1.5 | /index.html | 200

# --- A simple validator: is this a plausible email? ---
grep -P '^[\\w.+-]+@[\\w-]+\\.[\\w.-]+$' addresses.txt
#   good ENOUGH to catch typos, NOT a perfect validator (see the note)

# --- Pitfall: catastrophic backtracking (do NOT run on long input) ---
#   (a+)+$   against "aaaaaaaaaaX"  can hang for seconds  (ReDoS)`,
      lang: "bash",
      walkthrough: [
        "**The capstone is extraction: pull structured fields out of a messy log line.** The `sed -E` pattern captures three pieces — `([0-9.]+)` for the leading IP, `\"[A-Z]+ ([^\"]+)\"` for the request path inside the quotes, and `([0-9]{3})` for the status code — then rebuilds the line as `\\1 | \\2 | \\3`. Building one capture at a time, testing on regex101 as you go, is exactly how real patterns get written.",
        "**Note the `[^\"]+` trick** for the path: 'one or more characters that are not a quote' cleanly grabs everything up to the closing `\"`, with no greedy/lazy worries. That negated-class technique from stage 6 is the workhorse of field extraction.",
        "**The validator** `^[\\w.+-]+@[\\w-]+\\.[\\w.-]+$` checks an email's *shape*: some word/dot/plus/dash characters, an `@`, a domain, a dot, a final part, anchored start-to-end so the whole string must match. It's good *enough* to catch obvious typos — and deliberately NOT a perfect email validator, because (stage 11) that's a fool's errand.",
        "**Pitfall 1 — catastrophic backtracking.** Patterns with nested quantifiers over overlapping text, like **`(a+)+$`** against a long run of `a`s that ultimately fails, can make the engine try astronomically many combinations and *hang*. Avoid nesting quantifiers on the same characters; prefer a negated class (`[^x]*`) or an atomic/possessive form. This is a real denial-of-service vector, nicknamed **ReDoS** (Regular-expression Denial of Service).",
        "**Pitfall 2 — over-escaping and unreadable patterns.** Escaping things that don't need it (`\\/`, `\\-` outside a class) adds noise; forgetting to escape a real `.` or `$` changes the meaning. Use the `x` flag (stage 10) to add whitespace and comments to a long pattern, and lean on regex101's explainer to keep yourself honest.",
        "**Pitfall 3 — knowing when NOT to use regex.** Regex matches *flat patterns*; it cannot properly parse *nested* structures. Do not parse **HTML, XML, or JSON** with regex — they nest arbitrarily, and a regex will get it subtly wrong on real data. Use a proper parser (`jq` for JSON, a DOM/HTML library, a CSV module). Regex is a scalpel for line-shaped text, not a chainsaw for structured documents.",
      ],
      exercise:
        "Build both deliverables. (1) Extraction: take the log line `192.168.1.5 - - [x] \"GET /index.html\" 200 " +
        "2326` and adapt the `sed -E` pattern in the code to print `IP | path | status`. (2) Validation: run the " +
        "email pattern `^[\\w.+-]+@[\\w-]+\\.[\\w.-]+$` against `me@x.com` (passes) and `not an email` (fails). Then, " +
        "as a thought exercise, explain in two sentences why `(a+)+$` is dangerous and why you'd reach for `jq` " +
        "instead of a regex to read a JSON file.",
      drills: [
        "Adapt the log-parsing `sed` to also capture the byte count (the trailing number) as a fourth field.",
        "Test the email pattern against tricky inputs: `a@b`, `a@b.c`, `@b.com`, `a b@c.com` — which pass, which fail?",
        "On regex101, paste a long string of `a`s and try `(a+)+b` (no `b` present) — watch the timeout warning appear, then stop it quickly.",
      ],
      note:
        "The deepest lesson of the whole course: regex is for flat, line-shaped text, not for nested structures. " +
        "HTML, XML and JSON nest arbitrarily, so a regex will eventually get them wrong — use `jq`, an HTML parser, " +
        "or a language's JSON library instead. Save regex for what it's brilliant at: finding and reshaping " +
        "patterns in lines of text.",
    },
  ],
};
