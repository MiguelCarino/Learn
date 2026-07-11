/* =====================================================================
   Carino Learn — course: GNU UTILS  (coreutils + grep/sed/awk/find/tar)
   Goal: turn a complete beginner into someone who can chew through any
   text file or pile of files from the command line with confidence.
   Written for someone who has NEVER opened a terminal in anger:
   every stage has a line-by-line `walkthrough` and small `drills`.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["gnu"] = {
  id: "gnu",
  title: "GNU Utils",
  tag: "coreutils · text power tools",
  icon: "tool",
  blurb: "Bend any text file to your will with tiny composable commands.",
  intro:
    "The GNU command-line utilities are dozens of small, sharp tools — each does one thing well, " +
    "and you snap them together with the pipe `|` to do almost anything to text. " +
    "Twelve hands-on stages take you from simply looking at a file to building real " +
    "pipelines with grep, sed, awk, find and tar. No prior terminal experience assumed — " +
    "by the end you'll read a log, hunt a file, and reshape a CSV without breaking a sweat.",
  meta: [["Toolkit", "GNU coreutils"], ["Host", "Linux"], ["Style", "pipelines"]],

  tracks: [
    { id: "look",   label: "Looking at files",    stages: [0, 1, 2, 3] },
    { id: "find",   label: "Finding & filtering", stages: [4, 5, 6] },
    { id: "shape",  label: "Reshaping text",      stages: [7, 8, 9] },
    { id: "manage", label: "Files & archives",    stages: [10, 11] },
  ],

  reference: [
    {
      kind: "table",
      title: "Essential tools & what each one does",
      head: ["tool", "one-line purpose"],
      rows: [
        ["ls",    "list files in a directory"],
        ["cat",   "dump a file's contents to the screen"],
        ["less",  "scroll through a file one screen at a time"],
        ["grep",  "print lines that match a pattern"],
        ["sed",   "stream editor: find-and-replace, delete, print lines"],
        ["awk",   "process text column-by-column with logic"],
        ["find",  "walk directories looking for files by name/size/age"],
        ["sort",  "sort lines alphabetically or numerically"],
        ["uniq",  "collapse or count adjacent duplicate lines"],
        ["cut",   "snip out columns/fields from each line"],
        ["tr",    "translate, squeeze or delete characters"],
        ["wc",    "count lines, words and bytes"],
        ["xargs", "turn a list of items into arguments for a command"],
        ["tar",   "bundle many files into one archive (and back)"],
      ],
      foot: "Every tool has `--help` and a manual: try `man grep`.",
    },
    {
      kind: "table",
      title: "grep / regex basics",
      head: ["piece", "meaning"],
      rows: [
        ["^",     "start of the line"],
        ["$",     "end of the line"],
        [".",     "any single character"],
        ["*",     "zero or more of the thing before it"],
        ["[abc]", "any one of a, b or c"],
        ["[^0-9]","any character that is NOT a digit"],
        ["a\\|b", "match a OR b (use -E to drop the backslash)"],
        ["-i",    "ignore upper/lower case"],
        ["-r",    "search recursively through folders"],
        ["-n",    "show the line number of each match"],
        ["-v",    "invert: print lines that do NOT match"],
        ["-E",    "extended regex (cleaner + ? | ( ) syntax)"],
      ],
      foot: "Anchors `^`/`$` and the quantifier `*` are the workhorses.",
    },
    {
      kind: "cmds",
      title: "Killer one-liners",
      rows: [
        ["Top 10 most common lines", "sort file | uniq -c | sort -rn | head"],
        ["Find big files (>100MB)",  "find . -type f -size +100M"],
        ["Count matches in a tree",  "grep -rn TODO . | wc -l"],
        ["Replace in place",         "sed -i 's/old/new/g' file.txt"],
        ["Sum a column of numbers",  "awk '{s += $1} END {print s}' nums.txt"],
        ["Make a compressed backup", "tar -czf backup.tgz mydir/"],
        ["Watch a log live",         "tail -f /var/log/syslog"],
      ],
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "Looking at files",
      tag: "first contact",
      time: "30–45 min",
      payoff:
        "Before you can transform text you have to *see* it. These commands let you read a " +
        "file from the comfortable middle, peek at just the top or bottom, or watch a log " +
        "grow live as a program writes to it. Knowing how to look — and how to ask any tool " +
        "for help — is the foundation everything else is built on.",
      concepts: ["cat", "less", "head", "tail", "tail -f", "wc", "--help & man"],
      code:
`# Make a small file to play with (we'll explain echo later)
printf 'apple\\nbanana\\ncherry\\ndate\\nelderberry\\n' > fruit.txt

cat  fruit.txt          # dump the WHOLE file to the screen
less fruit.txt          # scroll it (arrows/space to move, q to quit)

head -n 2 fruit.txt     # just the first 2 lines
tail -n 2 fruit.txt     # just the last 2 lines
tail -f /var/log/syslog # follow a log LIVE (Ctrl-C to stop)

wc fruit.txt            # count lines, words, bytes
wc -l fruit.txt         # just the line count

man cat                 # the full manual (q to quit)
ls --help               # a quick summary of every option`,
      lang: "bash",
      walkthrough: [
        "**`cat fruit.txt`** — `cat` (short for 'concatenate') prints a file's entire contents to your screen. Perfect for tiny files; on a huge file it'll scroll past too fast, which is why `less` exists.",
        "**`less fruit.txt`** — opens the file in a scrollable pager. Use the **arrow keys** or **Space** to move, type **`/word`** to search, and press **`q`** to quit. Counter-intuitive name: `less` is a better version of an older tool called `more`.",
        "**`head -n 2`** — shows only the **first** lines. The **`-n 2`** flag means 'give me 2 lines'. Great for sampling the top of a giant file without printing all of it.",
        "**`tail -n 2`** — the mirror image: the **last** lines. Logs put the newest entries at the bottom, so `tail` is how you read recent activity.",
        "**`tail -f`** — the **`-f`** means 'follow'. Instead of quitting, `tail` stays open and prints new lines the instant they're written. This is *the* way to watch a live log. Press **Ctrl-C** to stop.",
        "**`wc fruit.txt`** — 'word count' prints three numbers: lines, words, and bytes. Add **`-l`** for only lines, **`-w`** for only words, **`-c`** for only bytes.",
        "**`man cat`** opens the full manual for any tool (press **`q`** to quit), and **`ls --help`** prints a shorter summary. When you forget a flag, these two are your first stop — get comfortable reaching for them.",
      ],
      exercise:
        "Create the `fruit.txt` file from the code above, then:\n" +
        "  1. Print the whole file with `cat`.\n" +
        "  2. Show only the first 3 lines with `head -n 3`.\n" +
        "  3. Show only the last line with `tail -n 1`.\n" +
        "  4. Run `wc -l fruit.txt` and confirm it reports 5 lines.",
      drills: [
        "Open `fruit.txt` in `less`, search for `cherry` by typing `/cherry` then Enter, and quit with `q`.",
        "Run `head -n 1 fruit.txt` and `tail -n 1 fruit.txt` — predict each output before pressing Enter.",
        "Run `wc fruit.txt` and explain, in your own words, what each of the three numbers means.",
        "Skim `man wc` and find the flag that counts only characters. (Press `q` when done.)",
      ],
      note:
        "Almost every GNU tool obeys two conventions: a long manual via `man toolname`, and a " +
        "quick `toolname --help`. When you're stuck on which flag does what, you rarely need the " +
        "internet — the answer is one of those two commands away.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "Listing & inspecting",
      tag: "reading the columns",
      time: "1 hr",
      payoff:
        "`ls` is the command you'll type more than any other — but its plain output hides most " +
        "of the truth. Learn to read the long listing and the sizes-of-things tools and a " +
        "directory stops being a list of names and becomes a table you can actually reason " +
        "about: who owns what, how big it is, and how much disk is left.",
      concepts: ["ls -l -a -h", "stat", "file", "du", "df", "reading permission bits"],
      code:
`ls                      # bare names, nothing else
ls -l                   # LONG listing: one file per line, with details
ls -a                   # also show "hidden" files (names starting with .)
ls -lah                 # combine: long + all + human-readable sizes

# A long-listing line looks like this:
#   -rw-r--r--  1  miguel  users  1024  Jun 30 10:00  notes.txt
#   |perms   |  | owner |group| |size| |  modified  | | name |

stat fruit.txt          # everything the filesystem knows about a file
file  fruit.txt         # GUESS what kind of file it is (text? image?)

du -h fruit.txt         # disk usage of one file, human units
du -sh .                # total Size of the current folder (-s = summary)
df -h                   # free space on every mounted disk`,
      lang: "bash",
      walkthrough: [
        "**`ls`** with no flags just lists names. Useful, but it tells you nothing about size, owner, or dates.",
        "**`ls -l`** — the **`-l`** ('long') flag is the important one. Each file gets its own line with permissions, owner, group, size, modification date, and name laid out in columns.",
        "**`ls -a`** — the **`-a`** ('all') flag reveals **hidden** files, whose names start with a dot (like `.bashrc`). They're hidden only by that naming convention, nothing more.",
        "**`ls -lah`** — flags stack, so this is `-l`, `-a` and `-h` together. The **`-h`** ('human-readable') flag turns `1048576` into a friendly `1.0M`. You'll type `ls -lah` constantly.",
        "**Reading the long line**: the first column is the permission bits (next we'll decode them; covered fully in stage 10), then a link count, the **owner**, the **group**, the **size in bytes**, the **last-modified date**, and finally the **name**.",
        "**`stat fruit.txt`** — `stat` prints *everything* the filesystem records: exact byte size, the three timestamps (accessed / modified / changed), permissions in both forms, and more.",
        "**`file fruit.txt`** — `file` inspects the *contents* and guesses the type: 'ASCII text', 'PNG image', 'ELF executable'. Handy when a file has no extension or a misleading one.",
        "**`du -h`** ('disk usage') reports how much space a file or folder actually occupies; **`du -sh .`** adds **`-s`** ('summarise') to print one grand total for the current directory (`.`). **`df -h`** ('disk free') shows space *remaining* on each disk.",
      ],
      exercise:
        "In any directory with a few files:\n" +
        "  1. Run `ls -lah` and identify, on one line, the owner and the human-readable size.\n" +
        "  2. Run `file` on three different files and note what type each is.\n" +
        "  3. Run `du -sh .` to get the folder's total size, then `df -h` to see free space.",
      drills: [
        "Run `ls` then `ls -a` in your home directory and count how many extra hidden files appear.",
        "Pick a file and run both `du -h thatfile` and `stat thatfile`; find the size in each output.",
        "Run `ls -l` and `ls -lh` on the same folder and describe exactly what the `-h` changed.",
        "Run `file /bin/ls` and read what it reports about the `ls` program itself.",
      ],
      note:
        "`ls -lh` shows the *logical* size of a file, while `du -h` shows the *disk* space it uses — " +
        "and they can differ, because disks hand out space in fixed blocks. A 1-byte file still " +
        "consumes a whole block. That gap surprises everyone the first time they notice it.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "Counting & the pipe",
      tag: "the big idea",
      time: "1–2 hrs",
      payoff:
        "This is the single most important idea in the whole toolkit: the **pipe** `|`. It " +
        "takes the output of one command and feeds it straight into the next as input. Master " +
        "this and you stop looking for one giant tool that does everything, and start *snapping " +
        "small tools together* to build exactly what you need. This is the Unix philosophy.",
      concepts: ["the | pipe", "stdin / stdout", "small tools, one job each", "composing commands", "wc as a counter"],
      code:
`# Each tool reads from "standard input" and writes to "standard output".
# The pipe | wires one tool's output into the next tool's input.

cat fruit.txt | wc -l            # how many lines does the file have?

# Build a chain step by step, reading it LEFT to RIGHT:
ls /usr/bin | wc -l              # how many programs are in /usr/bin?

ls /usr/bin | head -n 5          # the first 5 names, alphabetically

# A pipe can be as long as you like — each | adds one stage:
cat /etc/passwd | head -n 3 | wc -c   # bytes in the first 3 lines

# The Unix philosophy in one line: many small sharp tools > one big blunt one.
echo 'one two three four' | wc -w      # echo prints text; wc -w counts words`,
      lang: "bash",
      walkthrough: [
        "Every tool here reads from **standard input** (stdin) and writes to **standard output** (stdout). By default stdin is your keyboard and stdout is your screen — the pipe re-wires them.",
        "**`cat fruit.txt | wc -l`** — `cat` sends the file's text into the pipe; **`|`** hands that text to `wc -l`, which counts the lines instead of you reading them yourself. The two tools never had to know about each other.",
        "**`ls /usr/bin | wc -l`** — `ls` lists every program in the system's `/usr/bin` folder, and `wc -l` counts them. You just answered 'how many commands are installed?' by combining two tools that each do one tiny job.",
        "**`ls /usr/bin | head -n 5`** — same `ls`, but now piped into `head` to show just the first 5 names. Swapping the second stage changes the whole result; the first stage didn't change at all.",
        "**Chaining further**: `cat ... | head -n 3 | wc -c` runs three stages. Read it **left to right**: get the file, keep the first 3 lines, count the bytes. Each `|` is a hand-off to the next tool.",
        "**`echo 'one two three four' | wc -w`** — **`echo`** simply prints whatever text you give it; **`wc -w`** counts words. Together they count words in a string — a throwaway example of composing two trivial tools into something useful.",
        "**The Unix philosophy**: write programs that each do one thing well and read/write plain text, so they connect freely. Every later stage (grep, sort, sed, awk) is just another tool you drop into a pipe.",
      ],
      exercise:
        "Answer each question with a single piped command:\n" +
        "  1. How many files are in `/etc`?  (hint: `ls /etc | wc -l`)\n" +
        "  2. What are the last 4 names in `/usr/bin`?  (use `ls` piped into `tail`)\n" +
        "  3. How many words are in this sentence: pipe an `echo` into `wc -w`.",
      drills: [
        "Run `ls /usr/bin | wc -l`, then `ls -a /usr/bin | wc -l`, and explain any difference.",
        "Build a 3-stage pipe of your own using `cat`, `head`, and `wc`.",
        "Run `cat fruit.txt | head -n 2` and then `head -n 2 fruit.txt` — same result; note that many tools take a filename directly OR read a pipe.",
        "Pipe `echo 'hello world'` into `wc -c` and figure out why the byte count is one more than you'd expect (hint: the newline).",
      ],
      note:
        "Because tools speak plain text over pipes, you can reorder and recombine them endlessly — " +
        "that flexibility is the whole point. A useful habit: build long pipes one stage at a time, " +
        "checking the output after each new `|` before adding the next.",
    },

    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Sorting & uniqueness",
      tag: "order from chaos",
      time: "2 hrs",
      payoff:
        "Real data arrives jumbled and full of repeats. `sort` puts lines in order and `uniq` " +
        "collapses or counts duplicates. Together they produce the single most useful pipeline " +
        "in day-to-day text work: a frequency count that tells you *what shows up most*. You'll " +
        "reach for it constantly — log analysis, word counts, finding the noisy IP address.",
      concepts: ["sort", "sort -n", "sort -r", "sort -k", "uniq", "uniq -c", "sort | uniq -c | sort -rn"],
      code:
`# A messy file with repeats and out-of-order numbers
printf 'pear\\napple\\npear\\nfig\\napple\\napple\\n' > items.txt

sort items.txt              # alphabetical order
sort -r items.txt           # Reverse (Z to A)

printf '10\\n2\\n33\\n4\\n' > nums.txt
sort nums.txt               # WRONG for numbers: sorts as text (10 before 2)
sort -n nums.txt            # -n = numeric sort: 2, 4, 10, 33  (correct)
sort -rn nums.txt           # numeric AND reversed: biggest first

uniq items.txt              # collapse ADJACENT duplicates (needs sorting first!)
sort items.txt | uniq       # the right way: sort, THEN dedupe

# THE classic frequency-count pipeline — memorise this one:
sort items.txt | uniq -c | sort -rn
#   count each item, then sort by count, biggest first

# Sort by a particular column with -k (here: 2nd whitespace field)
printf 'b 3\\na 1\\nc 2\\n' | sort -k2 -n`,
      lang: "bash",
      walkthrough: [
        "**`sort items.txt`** puts the lines in alphabetical order. **`sort -r`** adds **`-r`** ('reverse') for Z-to-A. By default `sort` compares lines as *text*, character by character.",
        "**The numeric trap**: as text, `\"10\"` comes before `\"2\"` because `'1'` is less than `'2'`. **`sort -n`** — the **`-n`** ('numeric') flag — compares lines as numbers instead, giving the correct `2, 4, 10, 33`.",
        "**`sort -rn`** stacks `-r` and `-n`: numeric order, largest first. This exact combo is what you'll use to put the biggest counts on top.",
        "**`uniq`** removes duplicate lines — but only when they're **adjacent**. It walks the file once and collapses runs of identical neighbours, so unsorted duplicates slip past it.",
        "**`sort items.txt | uniq`** is therefore the correct idiom: sort first so all duplicates become neighbours, *then* `uniq` collapses them. Remember: **`uniq` almost always follows `sort`**.",
        "**`uniq -c`** — the **`-c`** ('count') flag prefixes each line with how many times it occurred. Now you have counts, but in alphabetical order.",
        "**`sort items.txt | uniq -c | sort -rn`** — the famous pipeline. Stage 1 groups duplicates, stage 2 counts each group, stage 3 sorts those counts biggest-first. The result is a ranked frequency table. Burn this into memory.",
        "**`sort -k2 -n`** — the **`-k2`** ('key') flag sorts by the **2nd** whitespace-separated column instead of the whole line. Combined with `-n` it sorts that column numerically — how you order a table by one of its fields.",
      ],
      exercise:
        "Build the frequency pipeline from scratch:\n" +
        "  1. Create `items.txt` from the code above.\n" +
        "  2. Run `sort items.txt | uniq -c | sort -rn`.\n" +
        "  3. Confirm `apple` is on top with a count of 3, and that the list is ordered by count.\n" +
        "  4. Now run just `uniq items.txt` (no sort) and explain why the result is wrong.",
      drills: [
        "Sort `nums.txt` with and without `-n` and describe, in one sentence, why the results differ.",
        "Take the frequency pipeline and append `| head -n 1` to print only the single most common item.",
        "Use `sort -k2 -n` on `printf 'b 3\\na 1\\nc 2\\n'` and confirm the rows come out ordered by the second column.",
        "Run `sort -u items.txt` and figure out what the `-u` flag does on its own (compare it to `sort | uniq`).",
      ],
      note:
        "`uniq` only sees *adjacent* duplicates because it's designed to stream huge files using " +
        "almost no memory — it never holds the whole file at once. That streaming design is why " +
        "you must `sort` first, and it's exactly why these tools scale to gigabytes.",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "Finding files",
      tag: "the hunt",
      time: "half a day",
      payoff:
        "Sooner or later you need 'every `.log` file changed in the last day' or 'all files " +
        "bigger than 100 MB'. `find` walks an entire directory tree and tests each file against " +
        "conditions you specify — name, type, size, age — and can run a command on every match. " +
        "It's the search engine for your filesystem, and it never gives up until it's checked " +
        "everything.",
      concepts: ["find -name", "-type", "-size", "-mtime", "-exec", "find | xargs", "locate"],
      code:
`# Make a little tree to search
mkdir -p demo/sub
printf 'hi'  > demo/a.txt
printf 'log' > demo/sub/b.log
printf 'x'   > demo/sub/c.txt

find demo                       # list EVERYTHING under demo (files + dirs)
find demo -type f               # -type f = only regular files (not folders)
find demo -type d               # -type d = only directories

find demo -name '*.txt'         # by name; QUOTE the * so the shell leaves it alone
find demo -iname '*.TXT'        # -iname = same but case-insensitive

find demo -type f -size +1c     # bigger than 1 byte   (+ = "more than")
find demo -type f -size -10k    # smaller than 10 kilobytes  (- = "less than")
find . -type f -mtime -1        # modified in the last 1 day   (-mtime = days)

# Run a command on every match. {} is each filename; \\; ends the -exec.
find demo -name '*.txt' -exec wc -l {} \\;

# The faster, more common pattern: pipe matches into xargs (next stage)
find demo -name '*.txt' | xargs wc -l

locate passwd                   # instant search of a prebuilt index (if installed)`,
      lang: "bash",
      walkthrough: [
        "**`find demo`** lists every file and folder beneath `demo`, no matter how deeply nested. With no other options, `find` simply prints everything it walks past.",
        "**`-type f`** keeps only **regular files**; **`-type d`** keeps only **directories**. These 'tests' filter the walk — `find` prints a path only if it passes every test you list.",
        "**`-name '*.txt'`** matches by filename, where `*` means 'any characters'. **Always quote the pattern** (`'*.txt'`) so the shell hands the `*` to `find` instead of expanding it first — a classic beginner trap. **`-iname`** is the case-insensitive version.",
        "**`-size +1c`** filters by size. The unit suffix matters: **`c`** = bytes, **`k`** = kilobytes, **`M`** = megabytes. A leading **`+`** means 'greater than', **`-`** means 'less than', and a bare number means 'exactly'.",
        "**`-mtime -1`** filters by **modification time in days**. **`-1`** means 'less than 1 day ago' (i.e. recently); **`+7`** would mean 'more than 7 days ago'. Tests combine with implicit AND — list several and a file must satisfy all of them.",
        "**`-exec wc -l {} \\;`** runs a command on each match. The **`{}`** is replaced by the current filename, and the **`\\;`** marks the end of the command (the backslash protects the semicolon from the shell). Here it counts lines in every `.txt`.",
        "**`find ... | xargs wc -l`** does the same job by piping the list of names into `xargs`, which is usually faster because it runs `wc` once on many files instead of once per file. Stage 6 is all about `xargs`.",
        "**`locate passwd`** searches a *prebuilt database* of filenames, so it's near-instant — but the database is only refreshed periodically (via `updatedb`), so brand-new files may be missing. Use `find` for accuracy, `locate` for speed.",
      ],
      exercise:
        "Build the `demo` tree from the code, then:\n" +
        "  1. List only the files (not directories) under `demo` with `find demo -type f`.\n" +
        "  2. Find every `.txt` file with `find demo -name '*.txt'`.\n" +
        "  3. Find every `.log` file, then count its lines using `-exec wc -l {} \\;`.\n" +
        "  4. Find files in the current tree modified in the last day with `-mtime -1`.",
      drills: [
        "Run `find demo -name '*.txt'` then `find demo -iname '*.TXT'` and explain why `-iname` matched more.",
        "Use `find . -type f -size +1M` to list files bigger than a megabyte somewhere in your home folder.",
        "Try `find demo -type d` and confirm it lists only the folders `demo` and `demo/sub`.",
        "Run the `-exec` form and the `| xargs` form of the line-counting command and confirm they agree.",
      ],
      note:
        "`find`'s tests are combined with an implicit AND, evaluated left to right, so order can " +
        "matter for speed — put cheap tests like `-type f` before expensive ones. And always quote " +
        "name patterns: an unquoted `*.txt` is expanded by the *shell* before `find` ever sees it.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "Searching inside files with grep",
      tag: "find the needle",
      time: "half a day",
      payoff:
        "`grep` answers 'which lines contain this?' across one file or a whole project. It's how " +
        "you locate a function, a config setting, an error message, or every TODO you ever left " +
        "behind. Add regular expressions — patterns that match shapes of text, not just exact " +
        "words — and grep becomes the most-used search tool you own.",
      concepts: ["grep pattern", "-i", "-r", "-n", "-v", "-c", "-E", "anchors ^ $ . *"],
      code:
`printf 'Error: disk full\\nwarning: low memory\\nERROR: timeout\\nok: all good\\n' > log.txt

grep error log.txt          # lines containing "error" (case-sensitive: misses ERROR)
grep -i error log.txt       # -i = ignore case: now matches Error AND ERROR
grep -n -i error log.txt    # -n = also show each match's line NUMBER
grep -c -i error log.txt    # -c = just COUNT matching lines, don't print them
grep -v ok log.txt          # -v = inVert: lines that do NOT contain "ok"

grep -r TODO .              # -r = recurse: search every file under . (a folder)
grep -rn TODO .             # recurse AND show file:line for each hit

# Regular expressions match SHAPES of text, not just literal words:
grep '^Error'  log.txt      # ^ = start of line: lines that BEGIN with Error
grep 'full$'   log.txt      # $ = end of line:   lines that END with full
grep 'w.rning' log.txt      # . = any one character (matches "warning")
grep -E 'err(or)?' log.txt  # -E = extended regex; ? means "optional"`,
      lang: "bash",
      walkthrough: [
        "**`grep error log.txt`** prints every line containing the text `error`. By default grep is **case-sensitive**, so it matches `error` but skips `Error` and `ERROR`.",
        "**`-i`** ('ignore case') makes the match case-insensitive, so `error`, `Error`, and `ERROR` all match. This is usually what you actually want when searching logs.",
        "**`-n`** ('number') prefixes each result with its **line number** in the file — essential when you need to jump to the spot in an editor.",
        "**`-c`** ('count') suppresses the matching lines and prints only **how many** matched. Great for 'how many errors today?' without scrolling through them all.",
        "**`-v`** ('invert') flips the logic: it prints the lines that **do not** match. `grep -v ok` shows everything that *isn't* fine — a quick way to filter out noise.",
        "**`-r`** ('recursive') searches **every file** under a directory instead of one named file. `grep -rn TODO .` is the everyday 'find all TODOs in this project' command — the `.` means 'here and below'.",
        "**Anchors**: **`^`** matches the **start** of a line and **`$`** matches the **end**, so `^Error` finds lines that *begin* with Error and `full$` finds lines that *end* with full. Anchors stop a pattern from matching in the middle of a line.",
        "**Wildcards**: **`.`** matches any single character (`w.rning` matches `warning`), and **`*`** means 'zero or more of the previous thing'. **`-E`** turns on *extended* regex, where `?`, `+`, `|` and `( )` work without backslashes — `err(or)?` matches `err` with an optional `or`.",
      ],
      exercise:
        "Create `log.txt` from the code above, then:\n" +
        "  1. Find all error lines regardless of case with `grep -i error log.txt`.\n" +
        "  2. Count them with `grep -ci error log.txt`.\n" +
        "  3. Show only lines that do NOT contain `ok` using `-v`.\n" +
        "  4. Use an anchor to find only lines that BEGIN with `Error` (capital E).",
      drills: [
        "Run `grep error log.txt` and `grep -i error log.txt` and explain why the second finds more.",
        "Use `grep -rn TODO .` in a folder that has some source files and read the `file:line:` format.",
        "Write a pattern with `$` that matches only lines ending in the word `good`.",
        "Use `grep -E 'full|timeout' log.txt` to match either word, then rewrite it without `-E` using `\\|`.",
      ],
      note:
        "grep has two regex dialects: *basic* (the default, where `+ ? |` are literal unless " +
        "backslashed) and *extended* via **`-E`** (where they're special). Beginners hit fewer " +
        "surprises by reaching for `-E` whenever a pattern gets more complex than a plain word.",
    },

    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "xargs & composing commands",
      tag: "list → action",
      time: "half a day",
      payoff:
        "`find` and `grep` hand you *lists* of things; `xargs` turns a list into *actions*. It " +
        "takes whatever arrives on its input and feeds it as arguments to another command — so " +
        "'find these files' becomes 'find these files AND do X to each'. It's the connective " +
        "tissue that turns searching into doing, and it can run jobs in parallel for free.",
      concepts: ["find | xargs", "-print0 with -0", "xargs -I{}", "-n batching", "-P parallelism"],
      code:
`mkdir -p box
printf 'a' > 'box/one.txt'
printf 'bb' > 'box/two.txt'
printf 'ccc' > 'box/a file.txt'   # note the SPACE in this name

# Basic: feed the list of names to wc as arguments
find box -name '*.txt' | xargs wc -c

# Spaces in names BREAK the simple version. The safe pattern:
find box -name '*.txt' -print0 | xargs -0 wc -c
#   -print0 separates names with a zero byte; -0 tells xargs to expect that

# Put each item in a specific spot with -I{}  (the {} is the placeholder)
find box -name '*.txt' -print0 | xargs -0 -I{} cp {} {}.bak

# Process one item per command run with -n 1
echo 'x y z' | xargs -n 1 echo 'got:'

# Run many jobs at once with -P (parallelism)
seq 1 4 | xargs -P 4 -I{} echo 'task {}'`,
      lang: "bash",
      walkthrough: [
        "**`find box -name '*.txt' | xargs wc -c`** — `find` prints a list of filenames, and `xargs` collects them and appends them as arguments to `wc -c`. Instead of running `wc` once per file, `xargs` packs many names into a single `wc` call, which is fast.",
        "**The space problem**: by default `xargs` splits its input on spaces *and* newlines, so a file named `a file.txt` looks like two files. This silently breaks pipelines and is a genuine source of bugs.",
        "**`-print0` and `-0`** — the fix. **`find ... -print0`** separates filenames with an invisible **zero byte** (the one character that can't appear *in* a filename), and **`xargs -0`** tells xargs to split on that byte. This pair handles spaces, tabs, even newlines in names. Use it as your default.",
        "**`-I{}`** — by default xargs tacks the items on at the *end* of the command. **`-I{}`** instead substitutes each item wherever you write **`{}`**, so you control its position. `cp {} {}.bak` copies each file to itself plus `.bak`.",
        "**`-n 1`** — controls how many items go into each command run. **`-n 1`** means 'one item per invocation', so `echo 'x y z' | xargs -n 1 echo 'got:'` runs `echo` three separate times. Without it, xargs crams as many as it can into one run.",
        "**`-P 4`** — runs up to 4 commands **in parallel** at once. On a list of slow, independent jobs this is near-free speedup: `seq 1 4` prints the numbers 1–4, and xargs fans them out across 4 workers.",
        "**The mental model**: `find`/`grep`/`ls` produce a list of *nouns*; `xargs` attaches a *verb*. Together they let you act on hundreds of files with one line — the natural next step after stage 4's `find`.",
      ],
      exercise:
        "Build the `box` folder (including the file with a space in its name), then:\n" +
        "  1. Run `find box -name '*.txt' | xargs wc -c` and notice the spaced filename misbehaves.\n" +
        "  2. Fix it with `find box -name '*.txt' -print0 | xargs -0 wc -c`.\n" +
        "  3. Use `xargs -0 -I{} cp {} {}.bak` to make a `.bak` copy of every match.\n" +
        "  4. Confirm the `.bak` files exist with `ls box`.",
      drills: [
        "Run `echo '1 2 3' | xargs -n 1 echo` and watch echo run three times.",
        "Compare `find box -name '*.txt' | xargs wc -c` with the `-print0`/`-0` version and explain the difference on the spaced filename.",
        "Use `seq 1 6 | xargs -P 3 -I{} echo working on {}` and notice the output order can vary because they run in parallel.",
        "Read `man xargs` and find what `-r` (no-run-if-empty) does. (Press `q` to quit.)",
      ],
      note:
        "Make `find ... -print0 | xargs -0 ...` your habit. The instant a filename contains a space " +
        "(and on real systems, eventually one will), the naive `find | xargs` form silently does the " +
        "wrong thing — possibly to the wrong files. The zero-byte form is correct by construction.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "Cutting & translating columns",
      tag: "carve the text",
      time: "half a day",
      payoff:
        "Loads of data is columnar — CSV exports, `/etc/passwd`, log lines, command output. " +
        "`cut` snips out the exact fields you want, `tr` rewrites characters wholesale, and " +
        "`paste`/`column` line things back up. These are your scalpel and tweezers for pulling " +
        "one column out of a wall of text, the everyday glue between bigger tools.",
      concepts: ["cut -d -f", "tr translate", "tr -d delete", "tr -s squeeze", "paste", "column -t"],
      code:
`# A colon-separated file, like a slice of /etc/passwd
printf 'root:x:0:0:root:/root\\nmiguel:x:1000:1000:Miguel:/home/miguel\\n' > users.txt

cut -d: -f1 users.txt        # -d: = fields are split on ":"; -f1 = the 1st field
cut -d: -f1,6 users.txt      # fields 1 AND 6 (the name and the home directory)
cut -d: -f3-5 users.txt      # a RANGE: fields 3 through 5

# tr rewrites characters. Give it a "from" set and a "to" set:
echo 'hello' | tr 'a-z' 'A-Z'    # translate lowercase -> uppercase
echo 'a,b,c' | tr ',' '\\n'       # turn every comma into a newline
echo 'hello' | tr -d 'l'          # -d = DELETE every 'l'
printf 'a   b     c\\n' | tr -s ' '  # -s = SQUEEZE repeats: collapse runs of spaces

# paste joins files side by side; column -t lines columns up into a neat table
printf '1\\n2\\n' > nums; printf 'one\\ntwo\\n' > words
paste nums words                 # glue them into two columns (tab-separated)
cut -d: -f1,6 users.txt | column -t -s:   # pretty-print as an aligned table`,
      lang: "bash",
      walkthrough: [
        "**`cut -d: -f1`** — **`-d:`** sets the **delimiter** (here a colon) that separates fields, and **`-f1`** selects the **first field**. So this pulls just the username out of each colon-separated line.",
        "**`-f1,6`** selects a **list** of fields (1 and 6), and **`-f3-5`** selects a **range** (3 through 5). You can mix them: `-f1,3-5`. `cut` is the quickest way to grab specific columns when the separator is consistent.",
        "**`tr 'a-z' 'A-Z'`** — `tr` ('translate') maps each character in the first set to the character in the same position of the second set. `a-z` and `A-Z` are ranges, so this upcases text. `tr` reads only from a pipe/stdin — it never takes a filename.",
        "**`tr ',' '\\n'`** swaps every comma for a newline, a handy way to turn a comma-separated line into one item per line (ready for `sort` or `grep`).",
        "**`tr -d 'l'`** — the **`-d`** ('delete') flag removes every character in the set entirely instead of translating it. Useful for stripping out unwanted characters like carriage returns: `tr -d '\\r'`.",
        "**`tr -s ' '`** — the **`-s`** ('squeeze') flag collapses each *run* of repeated characters down to one. `tr -s ' '` turns messy multi-space alignment into single spaces, which makes the next tool's job easier.",
        "**`paste nums words`** glues files together **side by side**, one line from each, separated by a tab — the horizontal counterpart to `cat`'s vertical stacking.",
        "**`column -t`** reads whitespace- (or with **`-s:`**, colon-) separated input and pads every column so they **line up** into a readable table. It's the finishing touch that makes piped output human-friendly.",
      ],
      exercise:
        "Create `users.txt` from the code, then:\n" +
        "  1. Extract just the usernames with `cut -d: -f1 users.txt`.\n" +
        "  2. Extract the username and home directory (fields 1 and 6) together.\n" +
        "  3. Uppercase a word with `echo hello | tr 'a-z' 'A-Z'`.\n" +
        "  4. Turn `echo 'a,b,c'` into three separate lines using `tr`.",
      drills: [
        "Use `cut -d: -f3 users.txt` to pull out just the numeric user IDs.",
        "Pipe `printf 'a,,b,,c\\n'` through `tr -s ','` and explain what `-s` did to the doubled commas.",
        "Combine tools: `cut -d: -f1 users.txt | tr 'a-z' 'A-Z'` to get UPPERCASE usernames.",
        "Run `cut -d: -f1,6 users.txt | column -t -s:` and admire the aligned columns.",
      ],
      note:
        "`cut` is fast but rigid: it splits on a *single* fixed character, so it stumbles on data " +
        "aligned with *runs* of spaces (two spaces look like an empty field). When fields are " +
        "separated by variable whitespace, reach for `awk` (stage 9) instead — it splits smartly.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "Stream editing with sed",
      tag: "find & replace, scaled",
      time: "1 day",
      payoff:
        "`sed` edits text as it streams past — no opening an editor, no clicking. Its bread and " +
        "butter is search-and-replace across thousands of lines or hundreds of files at once, " +
        "but it can also delete lines, print only a range, and edit files in place. When you " +
        "need to change the same thing everywhere, `sed` does in one line what would take an " +
        "hour by hand.",
      concepts: ["s/old/new/", "the g flag", "addresses & ranges", "-i in place", "d to delete", "-n with p"],
      code:
`printf 'cat sat on a mat\\ncat and cat\\na dog barks\\n' > text.txt

sed 's/cat/dog/' text.txt        # replace the FIRST "cat" on each line with "dog"
sed 's/cat/dog/g' text.txt       # g = global: replace EVERY "cat" on the line
sed 's/cat/dog/gi' text.txt      # i = also ignore case

# Addresses pick WHICH lines to act on:
sed '2s/cat/dog/' text.txt       # only on line 2
sed '1,2s/cat/dog/g' text.txt    # only on lines 1 through 2
sed '/dog/s/barks/howls/' text.txt   # only on lines that MATCH /dog/

sed '2d' text.txt                # d = delete line 2
sed '/dog/d' text.txt            # delete every line matching /dog/

sed -n '1,2p' text.txt           # -n = stay quiet; p = print. Show only lines 1-2
sed -i 's/cat/dog/g' text.txt    # -i = edit the FILE IN PLACE (no screen output)`,
      lang: "bash",
      walkthrough: [
        "**`s/cat/dog/`** is the substitute command — `sed`'s signature move. It reads **`s/old/new/`** and replaces the **first** occurrence of `cat` with `dog` on each line. The `/` characters are just separators.",
        "**The `g` flag** — append **`g`** ('global') after the final slash to replace **every** match on the line, not just the first. `s/cat/dog/g` is what you usually want. Add **`i`** for case-insensitive matching: `s/cat/dog/gi`.",
        "**Addresses** restrict *which* lines the command touches. A bare number like **`2`** means line 2 only; **`1,2`** is a range of lines; and **`/dog/`** is a *pattern* address — act only on lines matching that regex. So `sed '/dog/s/barks/howls/'` edits only the lines that mention a dog.",
        "**`sed '2d'`** — the **`d`** command **deletes** lines. With an address it deletes specific ones: `2d` drops line 2, and `/dog/d` drops every line matching `/dog/`. This is how you strip blank lines or comments from a file.",
        "**`sed -n '1,2p'`** — by default `sed` prints every line as it passes. **`-n`** silences that automatic printing, and the **`p`** command prints only what you ask for. Together, `-n '1,2p'` shows just lines 1–2 — a `sed`-flavoured `head`.",
        "**`sed -i`** — the **`-i`** ('in place') flag writes the changes **back into the file** instead of to the screen. Powerful and permanent: there's no undo, so make a backup first, or use `sed -i.bak` to have sed save the original as `file.bak` automatically.",
        "**Why streaming?** `sed` never loads the whole file — it processes one line, emits it, and moves on. That's why it edits gigabyte logs and (with a shell loop or `find`/`xargs`) thousands of files without strain.",
      ],
      exercise:
        "Create `text.txt` from the code, then:\n" +
        "  1. Replace only the first `cat` per line: `sed 's/cat/dog/' text.txt`.\n" +
        "  2. Replace every `cat` with the `g` flag and compare the output.\n" +
        "  3. Delete every line containing `dog` with `sed '/dog/d'`.\n" +
        "  4. Print only lines 1–2 using `sed -n '1,2p' text.txt`.",
      drills: [
        "Run `sed 's/cat/dog/' text.txt` then `sed 's/cat/dog/g' text.txt` and explain the difference on line 2.",
        "Use a pattern address: `sed '/dog/s/a/A/g' text.txt` and describe which lines changed.",
        "Make a copy of `text.txt`, run `sed -i 's/a/@/g' copy.txt`, and confirm the file itself changed.",
        "Use `sed -n '$p' text.txt` to print only the last line (`$` as an address means 'last line').",
      ],
      note:
        "`-i` is genuinely irreversible — it overwrites the original. Always test your `s///` on the " +
        "screen first (without `-i`), and when you do commit, prefer `sed -i.bak '...'` so the " +
        "untouched original is saved alongside as `file.bak`. One typo in a pattern can mangle a file.",
    },

    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "Field processing with awk",
      tag: "the mini-language",
      time: "1–2 days",
      payoff:
        "`awk` is the most powerful tool in the kit: a tiny programming language built for " +
        "columnar text. It splits each line into numbered fields for you, runs your logic on " +
        "the ones you care about, and keeps running totals. Summing a column, computing an " +
        "average, reformatting a report, filtering rows by a condition — awk does in one line " +
        "what would otherwise need a real script.",
      concepts: ["fields $1 $2 $NF", "NR record number", "{print}", "-F separator", "patterns", "BEGIN / END sums"],
      code:
`printf 'alice 90 math\\nbob 75 art\\ncarol 88 math\\n' > scores.txt

awk '{print $1}' scores.txt        # $1 = the 1st field (whitespace-separated)
awk '{print $1, $2}' scores.txt    # comma adds a space between fields
awk '{print $NF}' scores.txt       # $NF = the LAST field (NF = Number of Fields)
awk '{print NR, $0}' scores.txt    # NR = record (line) number; $0 = the whole line

# A pattern before the {block} filters which lines run it:
awk '$2 > 80 {print $1}' scores.txt          # names scoring above 80
awk '/math/ {print $1}' scores.txt           # names on lines matching /math/

# BEGIN runs first, END runs last — perfect for totals and averages:
awk '{sum += $2} END {print sum}' scores.txt            # total of column 2
awk '{sum += $2} END {print sum/NR}' scores.txt         # average of column 2
awk 'BEGIN {print "Report:"} {print $1}' scores.txt     # a header line

awk -F: '{print $1}' /etc/passwd   # -F sets the field separator (here a colon)`,
      lang: "bash",
      walkthrough: [
        "**Fields**: awk automatically splits each line on whitespace and numbers the pieces. **`$1`** is the first field, **`$2`** the second, and so on; **`$0`** is the whole untouched line. `awk '{print $1}'` prints just the first column.",
        "**`print $1, $2`** — the **comma** between fields inserts a space in the output. (Without the comma, `print $1 $2` would jam them together with no gap.)",
        "**`$NF`** — **`NF`** is a built-in holding the **N**umber of **F**ields on the current line, so **`$NF`** is the *last* field — handy when lines have a varying number of columns.",
        "**`NR`** — the **N**umber of the current **R**ecord (line), counting up as awk reads. `awk '{print NR, $0}'` numbers every line, like `cat -n`. At the very end, `NR` equals the total line count.",
        "**Patterns**: anything before the `{ }` block is a *condition* — the block runs only on lines where it's true. **`$2 > 80 { print $1 }`** prints the name whenever the second column exceeds 80, and **`/math/ { ... }`** runs only on lines matching the regex. A block with no pattern runs on every line.",
        "**Running totals**: variables spring into existence when used and start at 0, so **`{ sum += $2 }`** keeps adding column 2 across all lines. You don't declare anything — awk just does the bookkeeping.",
        "**`BEGIN` and `END`** — the **`BEGIN`** block runs once *before* any line is read (great for headers or setup), and the **`END`** block runs once *after* the last line (great for printing totals). `'{sum += $2} END {print sum}'` sums a column then prints the result; dividing by `NR` gives the average.",
        "**`-F:`** — the **`-F`** flag sets the **field separator** to something other than whitespace. `awk -F:` splits on colons, so `awk -F: '{print $1}' /etc/passwd` prints every username — the same job as stage 7's `cut`, but awk can also compute and filter at the same time.",
      ],
      exercise:
        "Create `scores.txt` from the code, then:\n" +
        "  1. Print just the names with `awk '{print $1}' scores.txt`.\n" +
        "  2. Print the names of students who scored above 80.\n" +
        "  3. Sum the scores with `awk '{sum += $2} END {print sum}' scores.txt`.\n" +
        "  4. Compute the average by dividing that sum by `NR` in the END block.",
      drills: [
        "Use `awk '{print $NF}' scores.txt` to print each student's subject (the last field).",
        "Print line numbers with the line: `awk '{print NR, $0}' scores.txt`.",
        "Filter with a regex: `awk '/math/ {print $1, $2}' scores.txt` to list math students and scores.",
        "Use `awk -F: '{print $1, $6}' /etc/passwd` to print each username next to its home directory.",
      ],
      note:
        "awk shines exactly where `cut` struggles: it splits on *runs* of whitespace by default, so " +
        "messy, variable-spaced columns just work. The progression `grep` (which lines?) → `cut` " +
        "(which columns?) → `awk` (logic on columns) is the natural ladder of text-processing power.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Permissions & ownership",
      tag: "who can touch what",
      time: "half a day",
      payoff:
        "Every file carries permissions that decide who may read, write, or run it, plus an " +
        "owner and a group. Misread them and you get baffling 'Permission denied' errors or, " +
        "worse, leave a private file world-readable. Learn to read the `ls -l` permission bits " +
        "and to change them with `chmod`/`chown`, and the security model of the whole system " +
        "clicks into place.",
      concepts: ["the rwx bits", "chmod symbolic", "chmod octal", "chown", "umask", "ls -l permissions"],
      code:
`printf '#!/bin/sh\\necho hi\\n' > script.sh
ls -l script.sh
#   -rw-r--r--   means:
#   -            type: - is a file, d a directory, l a link
#    rw-         OWNER  can read+write, not execute
#       r--      GROUP  can read only
#          r--   OTHERS can read only

# Symbolic chmod: who (u/g/o/a) + or - which permission (r/w/x)
chmod u+x script.sh         # give the OWNER execute permission (now runnable)
chmod go-r script.sh        # remove read from group and others
chmod a+r  script.sh        # add read for ALL (user, group, others)

# Octal chmod: each digit = r(4)+w(2)+x(1), for owner/group/others
chmod 644 script.sh         # owner rw- (6), group r-- (4), others r-- (4)
chmod 755 script.sh         # owner rwx (7), group r-x (5), others r-x (5)

# Ownership and the default-permission mask:
sudo chown miguel script.sh        # change the file's owner (needs privilege)
sudo chown miguel:users script.sh  # set owner AND group
umask                              # show the mask that removes bits from NEW files`,
      lang: "bash",
      walkthrough: [
        "**Reading `ls -l`**: the first character is the **type** (`-` file, `d` directory, `l` symlink). The next nine characters are three groups of **`rwx`** — read, write, execute — for the **owner**, the **group**, and **everyone else**, in that order. A `-` means that permission is absent.",
        "**`r`/`w`/`x`** mean: **read** the contents, **write** (modify) them, and e**x**ecute the file as a program. On a *directory*, `x` instead means 'may enter/traverse it' — a common source of confusion.",
        "**Symbolic `chmod`** reads like a sentence: a **who** (`u`=user/owner, `g`=group, `o`=others, `a`=all), a **`+`** to add or **`-`** to remove, and a **permission** (`r`/`w`/`x`). So **`chmod u+x`** grants the owner execute, making `script.sh` runnable.",
        "**`chmod go-r`** removes read from group and others at once; **`chmod a+r`** grants read to everybody. Symbolic mode is best when you want to flip *one* bit without disturbing the rest.",
        "**Octal `chmod`** sets all bits at once using one digit per group, where **read=4, write=2, execute=1** are added together. So `7 = rwx`, `6 = rw-`, `5 = r-x`, `4 = r--`. **`chmod 644`** = owner `rw-`, group `r--`, others `r--`; **`chmod 755`** = owner `rwx`, the rest `r-x` (the classic mode for scripts and folders).",
        "**`chown`** changes the file's **owner** (and optionally its group, as `owner:group`). Because reassigning ownership can bypass security, it usually needs **`sudo`** (administrator privilege).",
        "**`umask`** shows the **mask** that's subtracted from the default permissions of *newly created* files. A common `umask` of `022` removes the write bit from group and others, so new files are born as `644` rather than world-writable — a quiet but important safety default.",
      ],
      exercise:
        "Create `script.sh` from the code, then:\n" +
        "  1. Run `ls -l script.sh` and read off the owner/group/others permissions.\n" +
        "  2. Make it executable with `chmod u+x script.sh` and run it with `./script.sh`.\n" +
        "  3. Set its mode to `644` with octal `chmod`, then back to `755`.\n" +
        "  4. Run `umask` and work out what default permission new files will get.",
      drills: [
        "Translate `rw-r--r--` into its octal number, then verify with `chmod` and `ls -l`.",
        "Use `chmod go-r script.sh` then `ls -l` and confirm group/others lost read.",
        "Explain in one sentence why a directory needs the `x` bit to be entered, not just `r`.",
        "Run `stat -c '%A %a %U' script.sh` to see the permissions in symbolic, octal, and the owner together.",
      ],
      note:
        "Octal and symbolic are two views of the same nine bits — `chmod 755` and " +
        "`chmod u=rwx,go=rx` do exactly the same thing. Reach for octal when you want to set an " +
        "exact whole mode, and symbolic when you want to nudge a single permission without touching " +
        "the others.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "Archiving, compression & a capstone",
      tag: "bundle it all up",
      time: "1 day",
      payoff:
        "To move or back up many files you bundle them into one archive with `tar`, and shrink " +
        "it with compression. This is how software is shipped, how backups are made, and how " +
        "folders travel across machines. We finish by tying the entire course together into one " +
        "real pipeline — proof that the small tools you've learned combine into genuine power.",
      concepts: ["tar -czf", "tar -xzf", "tar -tzf list", "gzip / gunzip", "tar over ssh", "capstone pipeline"],
      code:
`mkdir -p project && printf 'a' > project/a.txt && printf 'b' > project/b.txt

# CREATE a compressed archive. Read the flags as a word: c-z-f
tar -czf project.tgz project/    # -c create, -z gzip-compress, -f use this file

tar -tzf project.tgz             # -t = list (Test) the contents WITHOUT extracting
tar -xzf project.tgz             # -x = extract everything back out

# Plain gzip works on a single file (and gunzip reverses it):
gzip  a.log                      # makes a.log.gz and REMOVES a.log
gunzip a.log.gz                  # back to a.log

# Stream a folder to another machine over ssh, no temp file on disk:
#   tar -czf - project/ | ssh user@host 'tar -xzf - -C /backup'
#   ( -f -  means "use stdin/stdout instead of a file" )

# --- CAPSTONE: most common words in all .txt files under here ---
find . -name '*.txt' -print0 \\
  | xargs -0 cat \\
  | tr 'A-Z' 'a-z' \\
  | tr -s ' ' '\\n' \\
  | sort \\
  | uniq -c \\
  | sort -rn \\
  | head -n 5`,
      lang: "bash",
      walkthrough: [
        "**`tar -czf project.tgz project/`** — `tar` ('tape archive') bundles many files into one. Read the flags as a word **c-z-f**: **`-c`** create a new archive, **`-z`** compress it with gzip, **`-f`** followed by the archive's filename. The result is one tidy `.tgz` file.",
        "**`tar -tzf project.tgz`** — swap `-c` for **`-t`** to **list** (table-of-contents) what's inside *without* unpacking. Always peek with `-t` before extracting an archive someone sent you, so you know where its files will land.",
        "**`tar -xzf project.tgz`** — **`-x`** **extracts** the contents back to disk. The `z` and `f` mean the same as before. Notice the pattern: only the first letter changes — `c` create, `t` list, `x` extract — while `-zf` stays put.",
        "**`gzip a.log`** compresses a **single** file in place, producing `a.log.gz` and removing the original; **`gunzip a.log.gz`** reverses it. `tar` bundles *and* (with `-z`) calls gzip for you; plain `gzip` is for one lone file.",
        "**`-f -`** — using **`-`** as the filename means 'read/write the archive through the pipe' instead of a file on disk. That lets you do `tar -czf - dir/ | ssh host 'tar -xzf - -C /dest'`: tar a folder, stream it over `ssh`, and untar it on the far machine — a backup with no temporary file anywhere (**`-C`** tells the receiving tar which directory to extract into).",
        "**The capstone** chains nearly the whole course: **`find ... -print0`** safely lists every `.txt` file, **`xargs -0 cat`** concatenates them, **`tr 'A-Z' 'a-z'`** lowercases so 'The' and 'the' match, and **`tr -s ' ' '\\n'`** turns runs of spaces into newlines so every word lands on its own line.",
        "Then the stage-3 frequency engine finishes the job: **`sort`** groups identical words, **`uniq -c`** counts each group, **`sort -rn`** ranks them biggest-first, and **`head -n 5`** keeps the top five. Eight tiny tools, one pipeline, a real answer — that is the entire philosophy of this course in a single line.",
      ],
      exercise:
        "Build a small `project/` folder, then complete the full cycle:\n" +
        "  1. Create `project.tgz` with `tar -czf project.tgz project/`.\n" +
        "  2. List its contents with `tar -tzf project.tgz` (don't extract yet).\n" +
        "  3. Delete the original folder, then restore it with `tar -xzf project.tgz`.\n" +
        "  4. Run the capstone pipeline in a folder with a few `.txt` files and read off the top 5 words.",
      drills: [
        "Compress a single file with `gzip`, check its new size with `ls -lh`, then restore it with `gunzip`.",
        "Run `tar -tzf project.tgz` and explain why listing before extracting is a safe habit.",
        "Take the capstone pipeline and change `head -n 5` to `head -n 10` to see the top ten words.",
        "Build the capstone one stage at a time — add a single `|` and inspect the output before adding the next.",
      ],
      note:
        "Mnemonic for tar: the first flag is the verb (`-c` create, `-x` extract, `-t` list), `-z` " +
        "adds gzip, and `-f` always comes right before the filename. Forget `-f` and tar tries to " +
        "talk to an actual tape drive — a quirk left over from the 1970s that still trips people up.",
    },
  ],
};
