/* =====================================================================
   Carino Learn — course: BASH  (shell scripting, Linux, bash 5+)
   Goal: take a complete beginner from typing their first command to
   writing a robust, real-world shell script.
   Written for someone who has NEVER scripted before: every stage has a
   line-by-line `walkthrough` and small `drills`.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["bash"] = {
  id: "bash",
  title: "Bash",
  tag: "the shell · scripting",
  icon: "terminal",
  blurb: "Turn the commands you type into scripts that work for you.",
  intro:
    "Bash is the language of the Linux command line — the same words you type to move " +
    "around your computer can be saved and replayed as a program. These 12 hands-on stages " +
    "take you from your very first `echo` to writing real scripts with loops, functions, " +
    "error handling and cleanup. No prior scripting assumed.",
  meta: [["Shell", "bash 5+"], ["Host", "Linux"], ["Scope", "scripting"]],

  tracks: [
    { id: "basics", label: "Living in the shell", stages: [0, 1, 2, 3] },
    { id: "script", label: "Writing scripts",     stages: [4, 5, 6, 7] },
    { id: "robust", label: "Real-world scripts",  stages: [8, 9, 10, 11] },
  ],

  reference: [
    {
      kind: "table",
      title: "Special variables & expansions",
      head: ["you write", "it means"],
      rows: [
        ["$?", "exit status of the last command (0 = success)"],
        ["$0", "the name of the script itself"],
        ["$1 $2 …", "the 1st, 2nd, … argument given to the script"],
        ["$#", "how many arguments were given"],
        ["$@", "all arguments, as separate words (quote it!)"],
        ["$*", "all arguments as one joined string"],
        ["$$", "the process ID of the current shell"],
        ["$(cmd)", "command substitution: insert the output of cmd"],
        ["${v:-x}", "use $v, but x if v is unset or empty"],
        ["${v:=x}", "use $v, and set v to x if it was unset/empty"],
        ["${#v}", "the length of the string in v"],
      ],
      foot: "Always wrap expansions in double quotes: `\"$var\"`, `\"$@\"`.",
    },
    {
      kind: "table",
      title: "Test operators (for [ ] and [[ ]])",
      head: ["test", "true when"],
      rows: [
        ["-f path", "path exists and is a regular file"],
        ["-d path", "path exists and is a directory"],
        ["-e path", "path exists (any kind)"],
        ["-r / -w / -x", "path is readable / writable / executable"],
        ["-z str", "string is empty"],
        ["-n str", "string is non-empty"],
        ["a = b", "strings are equal (use == inside [[ ]])"],
        ["a != b", "strings are not equal"],
        ["a -eq b", "numbers are equal"],
        ["a -ne b", "numbers are not equal"],
        ["a -lt / -le b", "number a is less than / less-or-equal b"],
        ["a -gt / -ge b", "number a is greater than / greater-or-equal b"],
      ],
      foot: "Strings use `=` and `!=`; numbers use `-eq`, `-lt`, etc.",
    },
    {
      kind: "cmds",
      title: "Handy one-liners",
      rows: [
        ["Make a script runnable", "chmod +x script.sh"],
        ["Run it", "./script.sh   (or)   bash script.sh"],
        ["Safety header (top of every script)", "set -euo pipefail"],
        ["Debug: print each line as it runs", "bash -x script.sh"],
        ["Check a script for bugs", "shellcheck script.sh"],
        ["See where a command lives", "type ls   ·   which bash"],
        ["Read the manual / quick help", "man cmd   ·   cmd --help"],
        ["Make a safe temp file", "tmp=$(mktemp)"],
      ],
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "The shell & your first commands",
      tag: "first steps",
      time: "30 min",
      payoff:
        "The shell is a program that reads the commands you type and runs them. Before you " +
        "can automate anything you need to be comfortable just *talking* to it: printing text, " +
        "seeing where you are, listing files, and moving around. Everything later is built " +
        "from these four or five everyday commands.",
      concepts: ["the prompt", "echo", "pwd", "ls", "cd", "man / --help"],
      code:
`# Lines starting with # are comments — bash ignores them.
echo "Hello from the shell!"   # print some text to the screen

pwd            # "print working directory" — where am I right now?

ls             # list the files in the current directory
ls -l          # the same, but a long, detailed listing
ls -la         # long listing that also shows hidden (dot) files

cd /tmp        # "change directory" — move into /tmp
pwd            # confirm we moved
cd             # cd with nothing goes to your home directory

ls --help      # most commands print a quick help summary
man ls         # the full manual (press q to quit, arrows to scroll)`,
      lang: "bash",
      walkthrough: [
        "**The prompt** is the text the shell shows when it's waiting for you, often ending in `$`. You type a command, press Enter, and the shell runs it. That back-and-forth is the whole game.",
        "**`echo \"Hello from the shell!\"`** — `echo` simply prints whatever you give it. It's the shell's way of saying things out loud, and you'll use it constantly to show values and debug.",
        "**`pwd`** stands for *print working directory*. The shell is always 'standing' in some folder; `pwd` tells you which one. Many commands act on that current folder by default.",
        "**`ls`** *lists* the files where you're standing. **`ls -l`** adds detail (sizes, dates, permissions); the `-l` is an *option* (also called a flag) that changes how the command behaves. **`ls -la`** also shows hidden files whose names start with a dot.",
        "**`cd /tmp`** *changes directory* — it walks you into the `/tmp` folder. Run `pwd` again and you'll see you moved. Plain **`cd`** with nothing after it jumps back to your home directory.",
        "**`ls --help`** and **`man ls`** are how you learn any command. `--help` gives a short reminder; `man` (manual) gives the full reference. When stuck, these two are your friends — press `q` to leave a manual page.",
      ],
      exercise:
        "Open a terminal and run, in order:\n" +
        "  echo \"my first command\"\n" +
        "  pwd\n" +
        "  ls -la\n" +
        "  cd /tmp ; pwd ; ls\n" +
        "  cd ; pwd\n" +
        "Notice how `pwd` changes as you `cd` around. You just navigated your computer entirely by typing.",
      drills: [
        "Run `echo \"$HOME\"` and `echo \"$USER\"` — the shell already knows who and where you are.",
        "Use `cd ..` to move *up* one folder, then `pwd` to confirm. (`..` always means 'the parent folder'.)",
        "Run `ls -l /` to list the top of the whole filesystem, and skim the folder names there.",
        "Open `man cd`... then try `help cd` instead, and notice some commands are built into bash itself.",
      ],
      note:
        "`ls`, `pwd`, and `cd` are not special 'scripting' commands — they are the exact same " +
        "commands a script will run on your behalf. A shell script is just these everyday " +
        "commands written down so the computer can type them for you.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "Variables & quoting",
      tag: "remembering",
      time: "1 hr",
      payoff:
        "A variable is a named box that remembers a value so you can reuse it. Getting " +
        "variables and *quoting* right is the single biggest source of beginner bugs in bash — " +
        "spaces and special characters bite people constantly. Learn the rules once here and " +
        "you'll dodge a whole category of mistakes forever.",
      concepts: ["name=value", "$var", "\"double\" vs 'single'", "${braces}", "$(command)"],
      code:
`# Assignment: NO spaces around the = sign. This is a strict rule.
name="Ada"
greeting="Hello"

# Use a variable by putting $ in front of its name.
echo "$greeting, $name!"          # Hello, Ada!

# Double quotes expand variables; single quotes do NOT.
echo "value is $name"             # value is Ada
echo 'value is $name'             # value is $name   (printed literally)

# Braces make where a name ends unambiguous.
fruit="apple"
echo "I ate three \${fruit}s"      # three apples (without {} bash seeks $fruits)

# Command substitution: capture a command's OUTPUT into a variable.
today=$(date +%Y-%m-%d)
echo "Today is $today"`,
      lang: "bash",
      walkthrough: [
        "**`name=\"Ada\"`** stores the text `Ada` in a variable called `name`. The most important rule in this whole stage: there must be **no spaces** around the `=`. `name = \"Ada\"` is an error, because bash would think `name` is a command.",
        "**`echo \"$greeting, $name!\"`** — putting **`$`** in front of a name fetches the value back out. So `$name` becomes `Ada`. The `$` is what turns a name into its contents.",
        "**Double quotes vs single quotes** is the key lesson. Inside **`\"double quotes\"`** bash *expands* `$name` into its value. Inside **`'single quotes'`** bash takes everything literally, so `$name` stays as the four characters `$name`. Use double quotes when you want the value, single when you want the raw text.",
        "**`${fruit}`** — the curly braces mark exactly where the variable name ends. Without them, `\"$fruits\"` would make bash look for a variable named `fruits` (which doesn't exist) instead of `fruit` followed by an `s`. When in doubt, brace it.",
        "**`today=$(date +%Y-%m-%d)`** is *command substitution*. The **`$( ... )`** runs the command inside it and hands its output back as text, which we store in `today`. This is how a script captures the result of a program — a date, a filename, a count — and reuses it.",
        "Why is quoting such a big deal? If a value contains a space (like a filename `my notes.txt`) and you forget the double quotes, bash splits it into two separate words and your command breaks. **Wrapping every `$var` in double quotes** is the habit that prevents this.",
      ],
      exercise:
        "Type these one at a time and watch the difference:\n" +
        "  who=\"world\"\n" +
        "  echo \"hello $who\"     # expands → hello world\n" +
        "  echo 'hello $who'     # literal  → hello $who\n" +
        "  now=$(date)\n" +
        "  echo \"it is now: $now\"\n" +
        "Confirm the single-quoted line really prints `$who` unchanged.",
      drills: [
        "Set `name=\"$USER\"` then `echo \"hi ${name}, nice to meet you\"`.",
        "Make a variable `files=$(ls)` and then `echo \"$files\"` — you captured a command's output.",
        "Try `count=5` then `echo \"$count items\"` and `echo \"${count}th place\"` — see why braces matter.",
        "Deliberately write `x = 3` (with spaces) and read the error, so you recognise it next time.",
      ],
      note:
        "There are no real 'types' in bash — every variable is text. `count=5` stores the " +
        "two characters `5`, not a number. Bash only treats text as a number in special " +
        "arithmetic contexts you'll meet in stage 5. Until then, think strings.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "Expansion & globbing",
      tag: "shorthand",
      time: "1 hr",
      payoff:
        "Before bash runs a command, it *expands* shorthand into full text: `*.txt` becomes a " +
        "list of files, `{a,b,c}` becomes three words, `~` becomes your home folder. " +
        "Understanding what bash rewrites — and when — makes commands feel less like magic and " +
        "stops 'why did that match everything?' surprises.",
      concepts: ["* ? [] globbing", "{a,b} brace expansion", "~ home", "${x:-default}", "expansion order"],
      code:
`# Globbing: the shell expands these patterns into matching filenames.
ls *.txt              # every file ending in .txt
ls report?.log        # report1.log, reportA.log — ? is exactly ONE character
ls [abc]*.csv         # files starting with a, b, or c, ending in .csv

# Brace expansion: generate text. This does NOT look at the filesystem.
echo file{1,2,3}.txt           # file1.txt file2.txt file3.txt
echo {1..5}                    # 1 2 3 4 5  (a numeric range)
mkdir -p project/{src,test,docs}   # make three folders at once

# Tilde is shorthand for your home directory.
echo ~                # /home/you
ls ~/Downloads        # the Downloads folder in your home

# Parameter default: use a fallback when a variable is empty/unset.
echo "Hi \${NAME:-stranger}"    # NAME unset → prints "Hi stranger"`,
      lang: "bash",
      walkthrough: [
        "**Globbing** is the shell filling in filenames for you. **`*`** matches any run of characters, so **`*.txt`** becomes every `.txt` file in the folder *before* `ls` even runs. The command never sees the `*` — it sees the final list of names.",
        "**`?`** matches exactly one character and **`[abc]`** matches any one of the listed characters. So `report?.log` matches `report1.log` but not `report12.log`, and `[abc]*.csv` matches files whose name starts with `a`, `b`, or `c`.",
        "**Brace expansion** with **`{1,2,3}`** is different: it generates text out of thin air and does *not* check whether those files exist. `file{1,2,3}.txt` simply becomes three words. It's a typing shortcut, not a search.",
        "**`{1..5}`** is a *range* — bash counts from 1 to 5 for you. Combined with `mkdir`, **`mkdir -p project/{src,test,docs}`** creates three sibling folders in one go. (`-p` also makes parent folders as needed and stays quiet if they exist.)",
        "**`~`** (tilde) expands to your home directory's path, so `~/Downloads` is the same as `/home/you/Downloads`. It's pure convenience so you don't type the full path every time.",
        "**`${NAME:-stranger}`** is a *parameter default*: it means 'use `$NAME`, but if it's unset or empty, use `stranger` instead'. This is how scripts supply sensible fallbacks so an empty variable doesn't ruin a command. The original `NAME` is left unchanged.",
        "**Order matters**: bash does brace expansion first, then `~`, then variables, then globbing — all *before* the command runs. Knowing the command receives the finished text (never the patterns) explains a lot of otherwise-baffling behaviour.",
      ],
      exercise:
        "In an empty scratch folder, run:\n" +
        "  mkdir -p demo/{a,b,c}\n" +
        "  touch demo/a/{one,two,three}.txt\n" +
        "  ls demo/a/*.txt\n" +
        "  echo \"Hello ${MISSING:-nobody}\"\n" +
        "Then run `echo demo/z/*.txt` in a folder where nothing matches, and notice bash hands the pattern through unchanged when there's no match.",
      drills: [
        "Run `echo {a..e}` and `echo {01..10}` to see letter and zero-padded ranges.",
        "Create files with `touch log{1,2,3}.txt`, then list only them with `ls log*.txt`.",
        "Compare `echo *.txt` in a folder with no `.txt` files versus one with some — note the difference.",
        "Set `COLOR=blue` and print `\"${COLOR:-red}\"`; then `unset COLOR` and print it again.",
      ],
      note:
        "A wildcard like `*` is expanded by the *shell*, not by the command. `ls`, `cp`, and " +
        "`rm` never see the `*` — they receive the final list of names. That's why a stray " +
        "`rm *` is so dangerous: the shell can expand it to *everything* before `rm` runs.",
    },

    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Pipes & redirection",
      tag: "plumbing",
      time: "2 hrs",
      payoff:
        "Every command has three channels: input, normal output, and error output. *Pipes* " +
        "connect one command's output to the next command's input, and *redirection* sends " +
        "those channels to files. This plumbing is the heart of Unix — small tools snapped " +
        "together do big jobs — and it's what makes the shell so powerful.",
      concepts: ["stdin/stdout/stderr", "| pipe", "> and >>", "< input", "2> and 2>&1", "/dev/null"],
      code:
`# Every command has 3 channels:
#   stdin  (0) = where input comes from
#   stdout (1) = normal output
#   stderr (2) = error messages
#
# A pipe | sends one command's stdout into the next command's stdin.
ls -l | grep ".txt"          # list files, keep only lines containing .txt
cat /etc/passwd | wc -l      # count the lines in a file

# Redirect stdout to a file:  >  overwrites,  >>  appends.
echo "first line"  >  notes.txt    # create/replace notes.txt
echo "second line" >> notes.txt    # add another line to the end

# Redirect a file INTO a command's stdin with <
wc -l < notes.txt                  # count lines, reading from the file

# Errors go on their own channel (2). Send them somewhere separately.
ls /does/not/exist 2> errors.log        # capture only error messages
ls /etc /nope > out.txt 2>&1            # send BOTH output and errors to out.txt
ls /nope 2> /dev/null                   # throw errors away into the void`,
      lang: "bash",
      walkthrough: [
        "**The three channels.** Picture every command as a little machine with one input pipe and two output pipes: **stdin** (where it reads input), **stdout** (its normal results), and **stderr** (its complaints/errors). They're numbered 0, 1, and 2. Keeping errors on a separate pipe means a failure message doesn't get mixed into real results.",
        "**The pipe `|`** connects the stdout of the command on its left to the stdin of the command on its right. So **`ls -l | grep \".txt\"`** feeds the file listing into `grep`, which keeps only the lines mentioning `.txt`. You're snapping two tools together into a small assembly line.",
        "**`>` redirects stdout into a file**, replacing whatever was there. **`echo \"first line\" > notes.txt`** writes the text into the file instead of the screen. Careful: `>` *overwrites*, wiping the file's old contents.",
        "**`>>` appends** instead of overwriting, adding to the end of the file. Use `>` to start fresh and `>>` to keep adding — a very common pattern when a script builds up a log.",
        "**`<` redirects a file into stdin.** `wc -l < notes.txt` tells `wc` to read its input *from the file* rather than the keyboard. Many tools that normally read what you type can instead be fed a file this way.",
        "**`2>` redirects only the error channel.** `ls /does/not/exist 2> errors.log` sends error messages to a file while normal output still goes to the screen. The `2` is the number of the stderr channel.",
        "**`2>&1` means 'send channel 2 to wherever channel 1 is going'.** So `> out.txt 2>&1` first points stdout at the file, then points stderr at the same place — capturing *both*. **`/dev/null`** is a special bottomless trash can: redirecting to it silently discards output you don't care about.",
      ],
      exercise:
        "Build a tiny pipeline and watch each channel:\n" +
        "  echo -e \"banana\\napple\\ncherry\\napple\" > fruit.txt\n" +
        "  sort fruit.txt | uniq -c          # count each unique fruit\n" +
        "  wc -l < fruit.txt                 # how many lines total\n" +
        "  ls /nope 2> /dev/null ; echo \"(error was hidden)\"\n" +
        "Notice the error message vanished because you sent stderr to /dev/null.",
      drills: [
        "Run `history | tail -5` to pipe your recent commands into `tail`.",
        "Append three lines to a file with three `echo ... >> file.txt` commands, then `cat file.txt`.",
        "Run `ls /etc /missing > all.txt 2>&1` then open `all.txt` and find both the listing and the error.",
        "Pipe and filter: `cat /etc/passwd | grep root | cut -d: -f1` to extract a username.",
      ],
      note:
        "The philosophy here is 'do one thing well, then combine'. `grep`, `sort`, `uniq`, " +
        "`wc`, and `cut` are each tiny, but piped together they become a custom data tool. " +
        "Much of shell mastery is knowing which small tool to reach for and snapping them up.",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "Your first script",
      tag: "saving commands",
      time: "1 hr",
      payoff:
        "A script is just the commands you already know, saved in a file so you can run them " +
        "all with one word. This stage turns you from someone who *types* commands into " +
        "someone who *writes programs* out of them. Once a task is a script, it's repeatable, " +
        "shareable, and never mistyped again.",
      concepts: ["#!/usr/bin/env bash", "chmod +x", "./script vs bash script", "comments", "$0"],
      code:
`#!/usr/bin/env bash
# greet.sh — my very first script. Lines starting with # are comments.
# The first line above is the "shebang": it tells the system to run this
# file with bash. It must be the very first line of the file.

echo "This script is called: $0"   # $0 is the script's own name
echo "Hello! The date is:"
date                               # run the date command
echo "You are in: $(pwd)"          # embed a command's output in a sentence
echo "Goodbye."`,
      lang: "bash",
      walkthrough: [
        "**`#!/usr/bin/env bash`** is called the *shebang* (hash-bang). It must be the very first line. When you run the file, the system reads this line and uses it to pick the right interpreter — here, bash. Writing it as `/usr/bin/env bash` finds bash wherever it's installed, which is more portable than hard-coding a path.",
        "**Comments** start with `#` (everything after it on the line is ignored). The shebang looks like a comment but is special *only* because it's the first line. Use comments generously to explain *why* your script does something.",
        "**`echo \"This script is called: $0\"`** — inside a script, **`$0`** holds the script's own name (how it was invoked). It's the first of several handy automatic variables you'll meet next stage.",
        "**`date`** is just a normal command. A script is nothing more than commands listed top to bottom; bash runs them in order, exactly as if you'd typed each one yourself.",
        "**`echo \"You are in: $(pwd)\"`** reuses the command substitution from stage 1: `$(pwd)` runs `pwd` and drops its output right into the sentence. Scripts lean on this constantly to weave live values into messages.",
        "**Two ways to run it.** `bash greet.sh` hands the file to bash explicitly and ignores the shebang. **`./greet.sh`** asks the system to run the file *itself* — which only works after you mark it executable with `chmod +x` (next). The `./` means 'the file right here in this folder'.",
      ],
      exercise:
        "Create and run your first script:\n" +
        "  1. Save the code above as `greet.sh`.\n" +
        "  2. Run it the easy way:   bash greet.sh\n" +
        "  3. Make it executable:    chmod +x greet.sh\n" +
        "  4. Run it as a program:   ./greet.sh\n" +
        "Both should print the same thing. You just wrote and ran software.",
      drills: [
        "Add a line `echo \"Running as user: $USER\"` and re-run the script.",
        "Run `ls -l greet.sh` before and after `chmod +x` and spot the new `x` permission letters.",
        "Try running `greet.sh` *without* the `./` and read the 'command not found' error — then learn why `./` is needed.",
        "Add a deliberately wrong line like `dat` (a typo for `date`) and watch bash keep going past the error — scripts don't stop by default.",
      ],
      note:
        "Why `./script.sh` and not just `script.sh`? For safety, the shell does not look in " +
        "your current folder for commands. The `./` explicitly says 'the file in this " +
        "directory', preventing a malicious `ls` file in a folder from hijacking the real `ls`.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "Conditionals: making decisions",
      tag: "logic",
      time: "half a day",
      payoff:
        "Real scripts react to circumstances: does the file exist? did the command succeed? " +
        "is this number too big? That decision-making rests on the *exit status* every command " +
        "leaves behind and the `if` statement that reads it. This is where a script stops being " +
        "a fixed list and starts being smart.",
      concepts: ["exit status $?", "[ ] and [[ ]]", "if/elif/else/fi", "&& and ||", "string vs number tests"],
      code:
`#!/usr/bin/env bash
# Every command leaves an exit status: 0 means success, non-zero means failure.
ls /etc > /dev/null
echo "ls succeeded? exit status = $?"     # 0

# if runs its block when the test command succeeds (exit status 0).
file="notes.txt"
if [[ -f "$file" ]]; then
    echo "$file exists and is a regular file"
elif [[ -d "$file" ]]; then
    echo "$file is a directory"
else
    echo "$file is not there"
fi

# Numeric comparison uses -eq -lt -gt; strings use == and !=.
count=7
if [[ "$count" -gt 5 ]]; then
    echo "count is greater than five"
fi

# && runs the next command only on success; || only on failure.
mkdir -p backups && echo "backups folder is ready"
ping -c1 example.com > /dev/null 2>&1 || echo "no network"`,
      lang: "bash",
      walkthrough: [
        "**Exit status** is the key idea. Every command, when it finishes, leaves behind a number: **`0` means success**, anything else means some kind of failure. You read the last one with **`$?`**. This number — not 'true/false' — is how the shell judges success.",
        "**`if [[ ... ]]; then ... fi`** runs the block when the test inside succeeds (exit status 0). The **`[[ ... ]]`** is bash's test construct; **`-f \"$file\"`** asks 'is this an existing regular file?'. Note the block ends with **`fi`** (`if` spelled backwards) — bash's way of closing the statement.",
        "**`elif`** ('else if') adds more conditions, and **`else`** is the fallback when none matched. **`-d`** tests for a directory. So this chain reports whether the name is a file, a folder, or missing — a very common pattern in scripts that handle paths.",
        "**Numbers vs strings** trip up beginners. For *numeric* comparison use **`-eq`, `-ne`, `-lt`, `-le`, `-gt`, `-ge`** (equal, not-equal, less-than, etc.). For *string* comparison use **`==`** and **`!=`**. Using the wrong family on the wrong kind of data is a classic bug — match the operator to the data.",
        "**Always quote the variable** inside a test: `\"$file\"`, `\"$count\"`. If `file` were empty and unquoted, the test could collapse into a syntax error. Quoting keeps an empty or spaced value as a single, safe word.",
        "**`&&` and `||`** are shortcuts that chain on exit status. **`A && B`** runs `B` only if `A` succeeded; **`A || B`** runs `B` only if `A` *failed*. So `mkdir -p backups && echo ready` confirms success, and `ping ... || echo \"no network\"` reacts to failure — compact `if`s for one-liners.",
      ],
      exercise:
        "Write `check.sh` that takes a filename and reports on it:\n" +
        "  #!/usr/bin/env bash\n" +
        "  target=\"$1\"\n" +
        "  if [[ -e \"$target\" ]]; then\n" +
        "      echo \"$target exists\"\n" +
        "  else\n" +
        "      echo \"$target is missing\"\n" +
        "  fi\n" +
        "Run `./check.sh /etc/hostname` and `./check.sh /no/such/file` and compare.",
      drills: [
        "Run `true; echo $?` then `false; echo $?` to see exit status 0 vs 1 directly.",
        "Write an `if [[ -z \"$1\" ]]` that prints 'no argument given' when you run the script with nothing after it.",
        "Compare two numbers: set `a=3 b=10` and test `[[ \"$a\" -lt \"$b\" ]]` — then try `[[ \"$a\" < \"$b\" ]]` and learn why string order differs.",
        "Use `grep -q root /etc/passwd && echo found` to make a decision from a command's success.",
      ],
      note:
        "Prefer `[[ ... ]]` (bash's smarter test) over the older `[ ... ]` in scripts: it's " +
        "safer with empty variables and supports `&&`, `||`, and pattern matching inside. The " +
        "old `[ ]` is really a command named `test`, which is why its spacing is so fussy.",
    },

    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Loops",
      tag: "repetition",
      time: "half a day",
      payoff:
        "Computers shine at doing the same thing many times without complaint. Loops let one " +
        "small script process a hundred files, retry until something works, or read a data " +
        "file line by line. The moment you can loop, tedious manual chores collapse into a " +
        "few lines you run once.",
      concepts: ["for in list", "while", "until", "while read line", "break / continue", "C-style for(())"],
      code:
`#!/usr/bin/env bash
# A for loop walks through a list of words, one at a time.
for color in red green blue; do
    echo "color: $color"
done

# Loop over files (the glob expands to a list, as in stage 2).
for f in *.txt; do
    echo "found file: $f"
done

# A while loop repeats AS LONG AS its test keeps succeeding.
n=1
while [[ "$n" -le 3 ]]; do
    echo "count $n"
    n=$((n + 1))            # arithmetic: add 1 to n
done

# Read a file line by line — the safe, standard pattern.
while IFS= read -r line; do
    echo "line: $line"
done < notes.txt

# C-style loop and loop control.
for ((i = 0; i < 5; i++)); do
    if [[ "$i" -eq 2 ]]; then continue; fi   # skip 2
    if [[ "$i" -eq 4 ]]; then break;    fi   # stop at 4
    echo "i = $i"
done`,
      lang: "bash",
      walkthrough: [
        "**`for color in red green blue; do ... done`** — the most common loop. It takes a list of words and runs the body once for each, with `color` holding the current word each time. The body lives between **`do`** and **`done`**.",
        "**`for f in *.txt`** combines loops with globbing from stage 2. The `*.txt` expands to a list of filenames *before* the loop starts, so the body runs once per matching file. This one pattern automates 'do something to every file of a type'.",
        "**`while [[ ... ]]; do ... done`** repeats as long as its test keeps succeeding. Here it counts while `n` is 3 or less. **`n=$((n + 1))`** is *arithmetic expansion*: the `$(( ... ))` evaluates math, so this increases `n` by one each pass. Without something changing inside, a `while` would loop forever.",
        "**`while IFS= read -r line; do ... done < notes.txt`** is the correct, safe way to read a file line by line. `read -r` reads one line into `line` and `IFS=` keeps leading/trailing spaces intact and `-r` stops backslashes being mangled. The **`< notes.txt`** at the end feeds the file into the loop's input. Memorise this exact incantation — it's the right way.",
        "**`for ((i = 0; i < 5; i++))`** is the C-style numeric loop: start `i` at 0, keep going while `i < 5`, add one each time. Reach for this when you want to count by index rather than walk a list of words.",
        "**`break`** jumps out of the loop entirely; **`continue`** skips the rest of *this* pass and moves to the next. Here `continue` skips printing 2 and `break` stops the loop at 4, so it prints only 0, 1, and 3. These two give you fine control inside any loop.",
      ],
      exercise:
        "Make a script that numbers the lines of a file:\n" +
        "  #!/usr/bin/env bash\n" +
        "  i=1\n" +
        "  while IFS= read -r line; do\n" +
        "      echo \"$i: $line\"\n" +
        "      i=$((i + 1))\n" +
        "  done < \"$1\"\n" +
        "Run it as `./number.sh /etc/hostname` (or any text file) and watch it tag each line.",
      drills: [
        "Loop `for i in 1 2 3 4 5; do echo \"square: $((i * i))\"; done` to print squares.",
        "Use `for f in *; do echo \"$f\"; done` to list every item in the current folder.",
        "Write a countdown with a `while` loop from 5 down to 1 using `n=$((n - 1))`.",
        "Add `continue` to a loop so it skips even numbers, and `break` so it stops at 10.",
      ],
      note:
        "Beware `for line in $(cat file)`: it splits on *spaces*, not lines, mangling any " +
        "line that contains a space. The `while IFS= read -r line; do ...; done < file` " +
        "pattern is the robust replacement — use it whenever you process a file's lines.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "Functions & arguments",
      tag: "reusable pieces",
      time: "half a day",
      payoff:
        "Functions let you name a block of code and reuse it, and arguments let your scripts " +
        "and functions accept input from the outside. Together they turn a long, repetitive " +
        "script into tidy, named building blocks — and let a script behave differently each " +
        "time you run it, just like the real commands you've been using.",
      concepts: ["defining functions", "$1 $2 $@ $#", "return vs echo", "local variables", "getopts"],
      code:
`#!/usr/bin/env bash
# A function groups commands under a name you can call later.
greet() {
    local who="$1"              # local keeps 'who' inside this function
    echo "Hello, $who!"
}

greet "Ada"                     # call it; "Ada" arrives as $1 inside greet
greet "World"

# Inside a script or function, arguments arrive as $1, $2, ...
# $# is how many there are; "$@" is all of them as separate words.
show_args() {
    echo "got $# arguments"
    for a in "$@"; do
        echo "  - $a"
    done
}
show_args one two "three four"   # "three four" stays one argument

# A function "returns" data by echoing it; capture it with $( ).
add() {
    echo "$(( $1 + $2 ))"        # echo the result to stdout
}
sum=$(add 3 4)
echo "3 + 4 = $sum"
# return is only for an exit STATUS (0-255), not for data:
is_even() { (( $1 % 2 == 0 )); return $?; }
is_even 10 && echo "10 is even"`,
      lang: "bash",
      walkthrough: [
        "**`greet() { ... }`** defines a function — a named bundle of commands. Nothing runs until you *call* it by writing its name, like `greet \"Ada\"`. Functions let you write a task once and reuse it everywhere, keeping a long script readable.",
        "**Arguments arrive as `$1`, `$2`, …** When you call `greet \"Ada\"`, the word `Ada` becomes `$1` *inside* the function. This is the same mechanism by which a whole script receives `$1` from the command line — functions and scripts share the exact same convention.",
        "**`local who=\"$1\"`** makes `who` exist only inside this function. Without `local`, every variable is global and functions can secretly clobber each other's values. Using `local` for a function's own variables is a habit that prevents baffling bugs.",
        "**`$#` is the argument count** and **`\"$@\"` is all the arguments as separate, properly-quoted words.** Looping with `for a in \"$@\"` visits each argument intact — notice `\"three four\"` stays a *single* argument because it was quoted on the call. The double quotes around `\"$@\"` are essential; without them spaces would split the arguments apart.",
        "**Returning data:** a bash function doesn't 'return' a value like other languages. Instead it **`echo`s** its result to stdout, and the caller captures it with command substitution: `sum=$(add 3 4)`. Think of a function's output as its return value.",
        "**`return` is different** — it sets only the *exit status* (0–255), the success/failure number, not data. So `is_even` uses arithmetic `(( ... ))` (which succeeds when true) and its status flows out, letting you write `is_even 10 && echo even`. Use `echo` for values, `return` for success/failure.",
        "**`getopts`** (a step beyond this code) is the built-in way to parse flags like `-v` or `-o file`. For your first scripts, reading `$1`/`$2` directly is plenty; reach for `getopts` once a script grows real options.",
      ],
      exercise:
        "Write a script that greets each name you pass it:\n" +
        "  #!/usr/bin/env bash\n" +
        "  greet() { echo \"Hi there, $1!\"; }\n" +
        "  if [[ \"$#\" -eq 0 ]]; then echo \"give me some names\"; exit 1; fi\n" +
        "  for name in \"$@\"; do greet \"$name\"; done\n" +
        "Run `./hi.sh Ada Lin \"Grace Hopper\"` and confirm the quoted name stays together.",
      drills: [
        "Write a `square() { echo $(( $1 * $1 )); }` and capture it: `r=$(square 6); echo \"$r\"`.",
        "Add `echo \"first arg is $1, there are $# total\"` to the top of a script and run it with various arguments.",
        "Make a function that uses `local tmp=\"...\"`, then prove `tmp` is empty *outside* the function.",
        "Skim `help getopts`, then write a loop that handles a single `-n NAME` option.",
      ],
      note:
        "Quoting `\"$@\"` versus `\"$*\"` matters: `\"$@\"` gives each argument as its own word " +
        "(almost always what you want), while `\"$*\"` smashes them into one space-joined " +
        "string. When forwarding arguments to another command, reach for `\"$@\"`.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "Arrays & string tricks",
      tag: "data",
      time: "half a day",
      payoff:
        "Real scripts juggle lists — files to process, users to notify — and slice up text — a " +
        "filename's extension, a line's prefix. Bash arrays hold lists safely (even with " +
        "spaces), and parameter expansion does surprising amounts of string surgery with no " +
        "external tools. These keep your scripts both correct and fast.",
      concepts: ["arr=(a b c)", "${arr[@]}", "${#arr[@]}", "${#var} length", "${var:0:3} substring", "${var/a/b}"],
      code:
`#!/usr/bin/env bash
# An indexed array holds a list of values.
fruits=("apple" "ripe banana" "cherry")

echo "first fruit: \${fruits[0]}"        # arrays count from 0
echo "how many:    \${#fruits[@]}"       # number of elements → 3

# "\${arr[@]}" expands to every element as a separate, safe word.
for f in "\${fruits[@]}"; do
    echo "  - $f"                       # 'ripe banana' stays one item
done

# Add to an array and replace an element.
fruits+=("date")                        # append → now 4 items
fruits[1]="banana"                      # overwrite element 1

# String surgery via parameter expansion (no external commands needed):
name="report-2026.txt"
echo "length:    \${#name}"              # number of characters
echo "first 6:   \${name:0:6}"           # substring: start 0, take 6 → report
echo "extension: \${name##*.}"           # strip up to last dot → txt
echo "base name: \${name%.txt}"          # strip the .txt suffix → report-2026
echo "swapped:   \${name/-/_}"           # replace first - with _`,
      lang: "bash",
      walkthrough: [
        "**`fruits=(\"apple\" \"ripe banana\" \"cherry\")`** creates an *array* — a single variable holding several values. Quoting each item keeps `\"ripe banana\"` as one element despite its space. Arrays are how you store a list without it splitting apart later.",
        "**`${fruits[0]}`** reads element zero (arrays count from 0, so this is `apple`). **`${#fruits[@]}`** gives the *number of elements* — the `#` means 'count' and `[@]` means 'all of them'.",
        "**`\"${fruits[@]}\"`** is the golden form: it expands to every element as its own properly-quoted word. Looping `for f in \"${fruits[@]}\"` therefore visits `ripe banana` as a *single* item. Forget the quotes and that element would split into two — the exact bug arrays exist to avoid.",
        "**`fruits+=(\"date\")`** appends a new element, and **`fruits[1]=\"banana\"`** overwrites element 1. Arrays grow and change like this without any special tooling.",
        "**`${#name}`** gives the *length* of the string in `name` (the same `#`-means-count idea). **`${name:0:6}`** is a *substring*: start at position 0 and take 6 characters, yielding `report`. These let you measure and slice text with no external command.",
        "**`${name##*.}`** removes the longest match of `*.` from the front, leaving just the extension `txt` — perfect for getting a file's type. **`${name%.txt}`** trims the `.txt` from the *end* (the `%` works from the right), giving the base name. The doubled `##`/`%%` mean 'longest match'; single `#`/`%` mean 'shortest'.",
        "**`${name/-/_}`** replaces the *first* `-` with `_`; use `${name//-/_}` (double slash) to replace *all* of them. Together these expansions handle most everyday text-munging — renaming files, building paths — faster and more reliably than calling out to `sed` or `cut`.",
      ],
      exercise:
        "Process a list of files held in an array:\n" +
        "  #!/usr/bin/env bash\n" +
        "  files=(\"a.txt\" \"my notes.txt\" \"data.csv\")\n" +
        "  echo \"processing ${#files[@]} files:\"\n" +
        "  for f in \"${files[@]}\"; do\n" +
        "      echo \"  $f  (type: ${f##*.})\"\n" +
        "  done\n" +
        "Confirm `my notes.txt` stays a single item and its extension prints as `txt`.",
      drills: [
        "Build an array `nums=(10 20 30)`, append `40`, then print `${#nums[@]}` and `${nums[3]}`.",
        "Set `path=\"/home/you/file.tar.gz\"` and extract the filename with `${path##*/}`.",
        "Take `s=\"HELLO\"` and print lowercase with `${s,,}`, then uppercase a word with `${s^^}`.",
        "Replace all spaces in `t=\"a b c\"` with dashes using `${t// /-}`.",
      ],
      note:
        "Capture command output into an array safely with `mapfile -t lines < file` (or " +
        "`readarray`). It reads each line into its own array element with no word-splitting " +
        "surprises — the array-friendly cousin of the `while read` loop from stage 6.",
    },

    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "Robust scripting",
      tag: "safety",
      time: "half a day",
      payoff:
        "The difference between a script that 'mostly works' and one you trust to run " +
        "unattended is error handling. A few habits — a strict header, religious quoting, the " +
        "right substitution syntax, and a linter — catch the silent failures that otherwise " +
        "delete the wrong file or push broken data. This stage is what makes scripts " +
        "production-grade.",
      concepts: ["set -euo pipefail", "quote everything", "$(...) over backticks", "word splitting", "shellcheck"],
      code:
`#!/usr/bin/env bash
set -euo pipefail
# -e  : exit immediately if any command fails
# -u  : treat use of an unset variable as an error (catches typos)
# -o pipefail : a pipeline fails if ANY part of it fails, not just the last

# Quote every expansion so spaces and empties don't break commands.
dir="my project"
mkdir -p "$dir"              # without quotes this makes TWO folders!
cp "$dir/a.txt" "$dir/b.txt" 2>/dev/null || true   # tolerate this one failure

# Prefer $(...) over old backticks: it nests cleanly and reads better.
count=$(ls -1 "$dir" | wc -l)
echo "the folder holds $count items"

# Provide a default so -u doesn't abort on a missing argument.
name="\${1:-world}"
echo "hello, $name"

# Word splitting demo: an unquoted variable with spaces explodes.
files="one two"
# for f in $files   → loops TWICE (word-split). Quote or use an array instead.
for f in "one" "two"; do echo "safe: $f"; done`,
      lang: "bash",
      walkthrough: [
        "**`set -euo pipefail`** is the safety header you should put near the top of almost every script. **`-e`** makes the script stop the instant any command fails, instead of blindly charging on. **`-u`** turns the use of an undefined variable into an error, catching typos like `$flie` before they cause damage. **`-o pipefail`** makes a pipeline report failure if *any* stage failed, not just the final one.",
        "Because `-e` aborts on the first failure, you sometimes have a command that's *allowed* to fail. Append **`|| true`** to it (as on the `cp` line) to say 'failure is fine here' and keep going. This makes your intent explicit rather than accidental.",
        "**Quote every expansion.** `mkdir -p \"$dir\"` with `dir=\"my project\"` makes one folder named `my project`; *without* the quotes bash word-splits it into two folders, `my` and `project`. This single habit — wrapping every `$var` in double quotes — prevents a huge share of real-world script bugs.",
        "**Use `$(...)` not backticks.** `count=$(ls -1 \"$dir\" | wc -l)` captures command output. The older backtick form does the same but is hard to read, hard to nest, and easy to confuse with a quote. Modern scripts always use `$( ... )`.",
        "**`name=\"${1:-world}\"`** combines two earlier ideas to play nicely with `-u`: if no first argument was given, the `:-world` default supplies one, so `-u` won't abort. Supplying defaults for optional inputs keeps a strict script from tripping on its own safety net.",
        "**Word splitting** is the underlying gotcha behind all this quoting. An *unquoted* variable containing spaces is broken into multiple words by bash before the command sees it — `for f in $files` would loop twice on `\"one two\"`. The cures are: quote the variable, or store lists in an array (stage 8) and expand `\"${arr[@]}\"`.",
        "**`shellcheck`** is a free linter that reads your script and points out exactly these mistakes — missing quotes, unsafe loops, typos — before you ever run it. Running `shellcheck myscript.sh` is the cheapest quality boost available; treat its warnings as a teacher.",
      ],
      exercise:
        "Harden a script and let the tools catch your mistakes:\n" +
        "  1. Put `set -euo pipefail` at the top of any script from earlier stages.\n" +
        "  2. Remove the quotes from a `\"$var\"` that holds a value with spaces and watch it break.\n" +
        "  3. Install and run `shellcheck yourscript.sh` and fix every warning it prints.\n" +
        "Notice how `-u` instantly flags a misspelled variable name.",
      drills: [
        "Add `set -u` to a script, reference an undefined `$typo`, and read the error it triggers.",
        "Make `dir=\"a b\"; mkdir $dir` (unquoted) then `ls` — count how many folders appeared.",
        "Replace any backticks in an old script with `$( ... )` and confirm it still works.",
        "Run `shellcheck` on a messy script and read its suggestions; each one teaches a rule.",
      ],
      note:
        "`set -e` has subtle corners — it won't trigger inside an `if` test or before a `||`, " +
        "by design. It's a strong safety net, not a force field; pair it with quoting and " +
        "`shellcheck` rather than trusting any one of them alone.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Signals, traps & cleanup",
      tag: "tidiness",
      time: "half a day",
      payoff:
        "Long-running scripts create temp files, lock files, and background jobs. If the " +
        "script is interrupted with Ctrl-C or killed, that mess is left behind. A *trap* runs " +
        "cleanup code no matter how the script ends, making your scripts polite citizens that " +
        "never litter — the mark of professional tooling.",
      concepts: ["signals (INT, TERM, EXIT)", "trap ... EXIT", "mktemp", "background & and wait", "kill"],
      code:
`#!/usr/bin/env bash
set -euo pipefail

# mktemp creates a uniquely-named temp file (or dir) safely.
tmp=$(mktemp)
echo "using temp file: $tmp"

# A trap runs the given command when a signal arrives.
# EXIT fires no matter HOW the script ends — success, error, or Ctrl-C.
cleanup() {
    rm -f "$tmp"
    echo "cleaned up $tmp"
}
trap cleanup EXIT               # guarantee cleanup happens on the way out

# Do some work using the temp file.
echo "some data" > "$tmp"
wc -l "$tmp"

# Run a command in the background with & and collect it later with wait.
sleep 2 &                       # & launches it without blocking
bg_pid=$!                       # $! is the PID of that last background job
echo "started background job $bg_pid"
wait "$bg_pid"                  # pause here until that job finishes
echo "background job done"
# When the script ends here, the EXIT trap deletes the temp file for us.`,
      lang: "bash",
      walkthrough: [
        "**A signal** is a message the operating system sends to a running program. The ones you'll meet most: **INT** (sent by Ctrl-C, 'please stop'), **TERM** (a polite 'shut down', the default `kill`), and **EXIT** (not a real signal but a handy hook bash fires whenever the script ends, however it ends).",
        "**`tmp=$(mktemp)`** creates a uniquely-named temporary file and prints its path, which we capture. Using `mktemp` instead of a hard-coded name like `/tmp/myfile` avoids clashes and a class of security problems — let the system pick a safe, unique name.",
        "**`trap cleanup EXIT`** is the heart of this stage. It registers our `cleanup` function to run automatically whenever the script exits — whether it finished normally, hit an error (remember `set -e`), or was interrupted with Ctrl-C. This *guarantees* the temp file gets removed; you can't forget, because bash does it for you.",
        "**The `cleanup` function** simply deletes the temp file with `rm -f` (the `-f` means 'don't complain if it's already gone'). Any tidy-up — removing temp files, releasing a lock, restoring a setting — belongs here, safe in the knowledge it always runs.",
        "**`sleep 2 &`** runs a command in the *background*: the trailing **`&`** launches it and lets the script carry on immediately instead of waiting. This is how a script kicks off work that can happen in parallel.",
        "**`bg_pid=$!`** captures the *process ID* of that background job — **`$!`** always holds the PID of the most recent background command. You need that ID to refer to the job later, for instance to wait on it or to `kill` it.",
        "**`wait \"$bg_pid\"`** pauses the script until that specific background job finishes, so you can synchronise. (And **`kill \"$bg_pid\"`** would send it a TERM signal to stop it early.) When the script then reaches its end, the EXIT trap fires and the temp file disappears — no litter left behind.",
      ],
      exercise:
        "Prove the trap fires even on Ctrl-C:\n" +
        "  #!/usr/bin/env bash\n" +
        "  tmp=$(mktemp)\n" +
        "  trap 'rm -f \"$tmp\"; echo \"removed $tmp\"' EXIT\n" +
        "  echo \"working in $tmp ... press Ctrl-C\"\n" +
        "  sleep 30\n" +
        "Run it, press Ctrl-C during the sleep, and confirm you still see 'removed ...'.",
      drills: [
        "Add `trap 'echo \"caught Ctrl-C, ignoring\"' INT` to a script and press Ctrl-C to see it intercepted.",
        "Create two temp files with `mktemp` and remove both in one cleanup function.",
        "Launch `sleep 10 &`, note the printed `$!`, then stop it early with `kill \"$!\"`.",
        "Start three `sleep` jobs in the background, then `wait` for all of them and time how long it takes.",
      ],
      note:
        "Trapping `EXIT` is usually better than trapping `INT` and `TERM` separately, because " +
        "`EXIT` catches *every* way the script can end — including a normal finish and a " +
        "`set -e` abort — so your cleanup logic lives in exactly one place.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "A real script: log summary",
      tag: "capstone",
      time: "1 day",
      payoff:
        "Time to assemble everything. This capstone is a genuinely useful tool — it scans a " +
        "log file and prints a tidy summary — built from the variables, conditionals, loops, " +
        "functions, arrays, safety flags, and traps from every earlier stage. Finish this and " +
        "you can write the small automation scripts that quietly run real systems.",
      concepts: ["argument handling", "usage/help", "while read loop", "counting with arrays", "safe + trapped"],
      code:
`#!/usr/bin/env bash
set -euo pipefail

# --- a small, real tool: summarise a web/access log file ---
usage() {
    echo "usage: $0 LOGFILE"
    echo "  prints total lines, error count, and the busiest line prefixes"
    exit 1
}

# Argument handling: require exactly one readable file.
[[ "$#" -eq 1 ]] || usage
logfile="$1"
[[ -r "$logfile" ]] || { echo "cannot read: $logfile" >&2; exit 1; }

# A temp file for intermediate work, cleaned up no matter what.
tmp=$(mktemp)
trap 'rm -f "$tmp"' EXIT

# Count totals with a line-by-line loop.
total=0
errors=0
while IFS= read -r line; do
    total=$((total + 1))
    # treat any line mentioning ERROR or "500" as an error.
    if [[ "$line" == *ERROR* || "$line" == *" 500 "* ]]; then
        errors=$((errors + 1))
        echo "$line" >> "$tmp"
    fi
done < "$logfile"

# Report, using arithmetic for a percentage (guard against divide-by-zero).
echo "===== summary of $logfile ====="
echo "total lines : $total"
echo "error lines : $errors"
if (( total > 0 )); then
    echo "error rate  : $(( errors * 100 / total ))%"
fi

# Show the 3 most common first-words among error lines, if any.
if [[ -s "$tmp" ]]; then
    echo "top error sources:"
    awk '{print $1}' "$tmp" | sort | uniq -c | sort -rn | head -3
fi`,
      lang: "bash",
      walkthrough: [
        "**`usage()`** defines a help message and exits with status 1. Every real tool needs a way to tell users how to run it. Calling `usage` from several places keeps that message in one spot — a direct payoff of the functions you learned in stage 7.",
        "**`[[ \"$#\" -eq 1 ]] || usage`** enforces 'exactly one argument' using `$#` (the argument count) and the `||` shortcut: if the test fails, run `usage` (which prints help and exits). This is conditionals (stage 5) doing input validation — the gatekeeper of a trustworthy script.",
        "**`[[ -r \"$logfile\" ]] || { echo \"cannot read: $logfile\" >&2; exit 1; }`** checks the file is actually readable before we try, and sends the error to stderr with `>&2` (stage 3). Failing early with a clear message beats a confusing crash deep inside the loop.",
        "**`tmp=$(mktemp)` + `trap 'rm -f \"$tmp\"' EXIT`** sets up scratch space and guarantees cleanup, exactly as in stage 10. Even if the loop below errors out under `set -e`, the temp file is removed on the way out.",
        "**The `while IFS= read -r line` loop** is the safe file-reading pattern from stage 6. Each pass bumps `total`, and the **`[[ \"$line\" == *ERROR* || ... ]]`** test uses pattern matching (the `*` are wildcards inside `[[ ]]`) to spot error lines, count them, and stash them in the temp file with `>>`.",
        "**The reporting block** prints the totals and computes a percentage with arithmetic `$(( errors * 100 / total ))`. The **`if (( total > 0 ))`** guard avoids dividing by zero on an empty file — exactly the kind of edge case robust scripts (stage 9) anticipate.",
        "**The final block** runs only when the temp file is non-empty (**`-s`** tests 'has size > 0'). It pipes the saved error lines through a classic Unix chain (stage 3): `awk` pulls the first word, `sort | uniq -c` counts duplicates, `sort -rn` ranks them, and `head -3` keeps the top three. Small tools, snapped together, produce a real report.",
      ],
      exercise:
        "Build and run the capstone end to end:\n" +
        "  1. Save it as `logsum.sh` and `chmod +x logsum.sh`.\n" +
        "  2. Make test data:\n" +
        "       printf 'web INFO ok\\nweb ERROR boom\\napi 500 fail\\nweb INFO ok\\n' > test.log\n" +
        "  3. Run it:  ./logsum.sh test.log\n" +
        "  4. Run it wrong:  ./logsum.sh   (no file) and see the usage message.\n" +
        "Confirm the totals, the error rate, and the top-sources list all look right.",
      drills: [
        "Add a `-h`/`--help` check at the top that calls `usage` when the first argument is `-h`.",
        "Extend the error test to also match lines containing `WARN`, and add a separate warning count.",
        "Change `head -3` to `head -5` and feed it a bigger log to see more sources.",
        "Turn it into a mini backup tool instead: copy a folder to `backup-$(date +%F).tar.gz` with `tar`, reusing the same safety header and trap.",
      ],
      note:
        "Notice what made this *trustworthy* rather than merely working: the strict header, " +
        "argument validation, a stderr error path, the divide-by-zero guard, and guaranteed " +
        "cleanup. Those habits — not clever one-liners — are what separate a script you run " +
        "once from one you can schedule and forget. You can now write real shell tools.",
    },
  ],
};
