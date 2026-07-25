/* =====================================================================
   Carino Learn — course: Git & Version Control
   Goal: take a solo developer running a dozen-plus GitHub Pages repos
   from "I commit and pray" to a confident maintainer who never loses
   work, keeps history readable, and automates releases across a fleet.
   Same beginner-first contract as the other modules: every stage has a
   line-by-line `walkthrough` and small `drills`.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["git"] = {
  id: "git",
  title: "Git & Version Control",
  tag: "history as a graph",
  icon: "branch",
  blurb: "Commits as snapshots, branches as pointers, reflog as the safety net: professional history habits for a solo fleet.",
  intro:
    "Git looks like a save button until the day it eats an afternoon of work — and then it turns out " +
    "it didn't eat anything: you just didn't know where it put it. Thirteen hands-on stages build the " +
    "real model — **a commit is a snapshot with parents, a branch is a 41-byte pointer, history is a " +
    "graph you can read and rewrite** — and then aim it squarely at the solo maintainer's life: a " +
    "dozen repos on GitHub, static sites deploying from `main`, nobody to ask when a push is rejected. " +
    "Less team ceremony, more `reflog`, `add -p`, `bisect run` and hooks: never lose work, keep every " +
    "repo's history readable, and let the boring parts run themselves.",
  meta: [["Tool", "git 2.4x · GitHub · gh"], ["Domain", "version control"], ["Style", "graph surgery"]],

  tracks: [
    { id: "model",   label: "The model",               stages: [0, 1, 2, 3] },
    { id: "rewrite", label: "Rewriting & recovering",  stages: [4, 5, 6, 7] },
    { id: "remote",  label: "Remotes & GitHub",        stages: [8, 9, 10] },
    { id: "power",   label: "Power tools",             stages: [11, 12] },
  ],

  reference: [
    {
      kind: "cmds",
      title: "The daily drivers",
      rows: [
        ["Where am I, what changed?",     "git status -sb"],
        ["Stage hunk by hunk",            "git add -p"],
        ["Commit the staged snapshot",    "git commit -m 'navbar: shared header'"],
        ["Working tree vs index",         "git diff"],
        ["Index vs last commit",          "git diff --staged"],
        ["Create + switch branch",        "git switch -c feature"],
        ["See the whole graph",           "git log --oneline --graph --all --decorate"],
        ["What did that commit change?",  "git show 7aa90"],
      ],
    },
    {
      kind: "cmds",
      title: "Get out of trouble",
      rows: [
        ["Un-modify a file (destructive!)", "git restore styles.css"],
        ["Un-stage a file, keep the edit",  "git restore --staged styles.css"],
        ["Redo the last commit",            "git commit --amend"],
        ["Step back, keep work staged",     "git reset --soft HEAD~1"],
        ["Undo a pushed commit safely",     "git revert 7aa90"],
        ["Bail out of a bad merge",         "git merge --abort"],
        ["Find anything you ever committed","git reflog"],
        ["Pocket the mess, come back clean","git stash  /  git stash pop"],
      ],
    },
    {
      kind: "table",
      title: "reset --soft vs --mixed vs --hard",
      head: ["variant", "HEAD / branch", "index (staging)", "working tree"],
      rows: [
        ["--soft",            "moves to target", "untouched — undone commit's changes appear staged",   "untouched"],
        ["--mixed (default)", "moves to target", "reset to match target — everything unstaged",         "untouched — changes sit as unstaged edits"],
        ["--hard",            "moves to target", "reset to match target",                               "reset to match target — uncommitted work destroyed"],
      ],
      foot: "Committed work always survives a reset — `git reflog` still reaches it. Only **uncommitted** work is at risk, and only with `--hard`.",
    },
    {
      kind: "table",
      title: "fetch vs pull vs pull --rebase",
      head: ["command", "what it does", "history shape"],
      rows: [
        ["git fetch",         "downloads origin's new commits, moves origin/main only — your main and files untouched", "unchanged (safe, always)"],
        ["git pull",          "fetch, then merge origin/main into main",                                                "merge bubble when you had local commits"],
        ["git pull --rebase", "fetch, then replay your local commits on top of origin/main",                            "linear — your commits get new ids on top"],
      ],
      foot: "Solo default worth setting: `git config --global pull.rebase true` — sync merges add noise to a history only you write.",
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "Snapshots, not diffs",
      tag: "what git actually stores",
      time: "30–40 min",
      payoff:
        "Half of git's reputation for hostility evaporates the moment you learn what it stores: not " +
        "differences, but **complete snapshots** of your project, forever. Every scary command is just " +
        "moving labels between snapshots that are still there. This stage builds that mental model, " +
        "creates a repo from nothing, and opens the `.git` folder so the magic has a street address.",
      concepts: ["repository", "working tree", "commit = snapshot", "git init", "git status", "git log", "the .git directory", "porcelain vs plumbing"],
      code:
`# A repo is a folder with a time machine inside
mkdir MusicGrid && cd MusicGrid
git init
# Initialized empty Git repository in /home/carino/Github/MusicGrid/.git/

git status
# On branch main
# No commits yet
# nothing to commit (create or track files to make it happen)

printf '<h1>MusicGrid</h1>\\n' > index.html
git status --short           #  ?? index.html      <- untracked: git sees it, ignores it
git add index.html
git commit -m "MusicGrid: initial skeleton"
git log --oneline
# a1f9c02 (HEAD -> main) MusicGrid: initial skeleton

# The entire time machine is ONE hidden folder:
ls .git
# HEAD  config  hooks/  index  objects/  refs/
#   objects/  every version of every file you ever committed
#   refs/     branch pointers (just tiny files)
#   HEAD      "which branch am I on right now"
# Delete .git -> it's an ordinary folder again. Copy the folder -> you
# copied ALL history. There is no server, no daemon, no database.`,
      lang: "bash",
      walkthrough: [
        "**Snapshots, not diffs** — the single most important fact in this course. CVS and SVN stored changes; git stores the **whole project state** at every commit (deduplicated, so unchanged files cost nothing). When you check out an old commit, git isn't replaying patches — it's handing you a photograph.",
        "**Repository vs working tree** — the working tree is the files you edit; the repository is the `.git` folder holding every snapshot. `git status` is the bridge report between them, and running it every few minutes is not paranoia, it's the professional tic.",
        "**`git init` is not a ceremony** — it creates `.git` and nothing else. No account, no network, no registration. Any folder on your disk can become a repo in half a second, which is why even throwaway experiments deserve one.",
        "**Untracked (`??`)** means git has never been told this file matters. Nothing is versioned until the first `add` + `commit` — a repo full of untracked files protects exactly nothing.",
        "**`git log --oneline`** shows each snapshot's short id and message. That `(HEAD -> main)` decoration is the whole navigation system in six characters: the branch `main` points at this commit, and `HEAD` says you're on `main` — stages 2 and 3 unpack both.",
        "**Inside `.git`** — `objects/` is the vault (stage 2 opens it), `refs/` holds branch pointers (stage 3 reads one), `HEAD` is a one-line text file. Everyday commands like `status` and `commit` are called **porcelain**; the raw internals tools like `cat-file` are **plumbing**. This course uses plumbing just enough to make porcelain unmysterious.",
        "**Every clone is a full backup** — because history lives entirely in `.git`, the copy on GitHub and the copy on your laptop are equals. For a solo fleet this is the first safety net: two machines with the repo means the house can burn down politely.",
      ],
      exercise:
        "Create a scratch repo and take its pulse:\n" +
        "  1. mkdir scratch && cd scratch && git init — run git status; read every line.\n" +
        "  2. Create two files; confirm git status shows both as untracked.\n" +
        "  3. add + commit one of them. What does status say about each file now?\n" +
        "  4. ls .git — find HEAD, refs/, objects/. cat .git/HEAD and read it aloud.\n" +
        "  5. cp -r the whole folder elsewhere, cd in, run git log — full history came along.",
      drills: [
        "In one sentence: what does a commit contain — a diff or a snapshot? Why does it feel like diffs when you run `git show`?",
        "Which folder would you delete to turn a repo back into plain files? What exactly is lost?",
        "A file shows `??` in `git status --short`. Is it protected by git in any way?",
        "Why is 'my repo is also on GitHub and on my desktop' already a real backup story?",
      ],
      note:
        "Set your identity once before the first real commit: `git config --global user.name` and " +
        "`user.email` — every commit is stamped with them forever, and rewriting them later is exactly " +
        "the kind of history surgery stage 6 warns about. While you're there: `git config --global " +
        "init.defaultBranch main` if your git is old enough to still say 'master'.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "The three areas",
      tag: "working tree · index · repository",
      time: "40–50 min",
      payoff:
        "The staging area is the feature beginners resent and professionals live in. Once the " +
        "three-area dance is in your fingers — edit in the **working tree**, compose in the **index**, " +
        "seal into the **repository** — you stop making 'misc fixes' commits and start making atomic " +
        "ones. The underrated star is `git add -p`: one messy editing session, two clean commits.",
      concepts: ["working tree", "index / staging area", "repository (HEAD)", "git add -p", "diff vs diff --staged", "atomic commits", "commit message discipline"],
      code:
`# working tree --(git add)--> index --(git commit)--> repository
vim styles.css index.html         # hack freely: this is the WORKING TREE

git status --short
#  M styles.css                   #  M in the RIGHT column: modified, unstaged
#  M index.html

git diff                          # working tree vs index: what you COULD stage
git add -p styles.css             # stage hunk by hunk: y / n / s(plit) / q
git diff --staged                 # index vs HEAD: what WILL be committed
git commit -m "styles: gold theme tokens for the navbar"

# add -p turns one editing session into two honest commits:
git add -p index.html             # y only on the navbar hunks
git commit -m "navbar: adopt shared carino.systems header"
git add index.html                # now the rest
git commit -m "home: wire album tiles to catalog.json"

# status letters: LEFT column = index vs HEAD, RIGHT = working tree vs index
git status --short
# MM styles.css    <- staged changes AND newer unstaged edits on top
# A  player.js     <- new file, staged
# ?? notes.txt     <- untracked`,
      lang: "bash",
      walkthrough: [
        "**Three areas, two arrows** — `add` copies a file's current state from the working tree into the **index**; `commit` seals the index into a snapshot. The commit never looks at your working tree: it packages **exactly what you staged**, which is why you can keep editing while a commit is 'loaded'.",
        "**The index is a draft commit** — think of it as a shopping cart, not a checkbox. You are composing the next snapshot deliberately, and `git diff --staged` is proofreading it before you sign.",
        "**Two diffs, two questions** — `git diff` answers 'what have I not yet staged?'; `git diff --staged` answers 'what am I about to commit?'. Run the second one before **every** commit; it catches the stray `console.log` at the moment it's cheapest to remove.",
        "**`git add -p` is the star of this stage** — it walks you through each change hunk by hunk: `y` stage, `n` skip, `s` split smaller, `q` stop. This is how a real session — where you fixed a bug AND tweaked styles AND renamed a function — becomes three commits that each say one true thing.",
        "**Atomic commits** — one logical change per commit. Not because a reviewer demands it (you're solo) but because **future-you** does: `git log` becomes a readable diary, `revert` can remove one feature cleanly, and `bisect` (stage 11) can point at one small commit instead of a 400-line 'stuff'.",
        "**Message discipline, solo edition** — imperative summary under ~50 chars, shaped like `area: what changed` (`navbar: adopt shared header`). Add a body only when the **why** isn't obvious. Six months from now, `git log --oneline` over twelve repos is your only memory of what happened where.",
        "**Reading `MM`** — left letter: index vs last commit; right letter: working tree vs index. `MM` means you staged a version, then kept editing — commit now and the newer edits stay behind. The mini-lab under this stage lets you produce every one of these states by hand.",
      ],
      exercise:
        "In your scratch repo:\n" +
        "  1. Edit one file in two different places (top and bottom).\n" +
        "  2. git add -p — stage ONLY the top change (use s to split if needed).\n" +
        "  3. git diff, then git diff --staged. Confirm each shows exactly one change.\n" +
        "  4. Commit; then commit the second change separately with its own message.\n" +
        "  5. Produce an MM state on purpose: edit, add, edit again — read git status --short.\n" +
        "  6. git log --oneline: two lines, each describing one honest change.",
      drills: [
        "Which diff shows what will actually end up in the next commit?",
        "You staged a file, then edited it again. What does the commit contain — first version, second, or both?",
        "Why does `add -p` matter MORE for a solo dev than for a team with reviewers?",
        "Write the one-line message for: you swapped Google Fonts for self-hosted fonts in the Branding repo.",
        "What do `MM`, `A `, and `??` each mean in `git status --short`?",
      ],
      note:
        "There is one 'fourth area' worth knowing early: `git stash` pockets working tree + index and " +
        "leaves you clean — perfect for 'I need to fix something else RIGHT NOW'. It gets proper " +
        "treatment in stage 7; until then, resist the urge to commit 'wip' garbage just to switch tasks.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "A commit is a snapshot with parents",
      tag: "blobs · trees · commits",
      time: "40–60 min",
      payoff:
        "Under the porcelain, git is a tiny content-addressed database with three object types — and " +
        "you can read it with two plumbing commands. After this stage, SHAs stop being noise: you'll " +
        "know exactly what a commit id hashes, why changing history always mints **new** ids, and why " +
        "that makes git nearly impossible to corrupt silently.",
      concepts: ["SHA-1 object id", "blob", "tree", "commit object", "content addressing", "git cat-file", "why ids change", "immutability"],
      code:
`git log --oneline -1              # c3f2a09 navbar: adopt shared header

git cat-file -t c3f2a09           # commit        <- what kind of object?
git cat-file -p c3f2a09           # print it:
# tree 9d1b7e4c...                <- THE snapshot: the root directory listing
# parent b8e02d13...              <- the commit before this one
# author Miguel Carino <miguel@...> 1784822400 -0600
# committer Miguel Carino <miguel@...> 1784822400 -0600
#
# navbar: adopt shared carino.systems header

git cat-file -p 9d1b7e4           # the TREE: one line per entry
# 100644 blob 5c1a83f...    index.html
# 100644 blob e69de29...    styles.css
# 040000 tree a4c210d...    js

git cat-file -p 5c1a83f | head -3 # the BLOB: the file's bytes. Nothing else.
# <h1>MusicGrid</h1>

# Content addressing: the id IS the hash of the content
echo 'carino' | git hash-object --stdin
# 2c9c53a4a72a41f2c8c74ccbeff2716d5cee1af3
# same bytes, any machine on earth -> same id. One byte changes -> new id.

# A commit hashes its tree + parents + author + message.
# Change ANYTHING (even one char of the message) -> a DIFFERENT commit id.
# "Editing history" never edits: it writes new commits and moves pointers.`,
      lang: "bash",
      walkthrough: [
        "**Three object types carry everything** — a **blob** is file content (no name, no date — just bytes); a **tree** is a directory listing mapping names to blobs and sub-trees; a **commit** is a pointer to one root tree, plus parent id(s), author, timestamp and message. That's the entire data model.",
        "**The id is the hash of the content** — `hash-object` shows the trick: git names every object by the SHA-1 of its bytes. Identical content collapses to one stored object automatically (a thousand commits of an unchanged `favicon.ico` cost one blob), and any disk corruption changes a hash and gets detected.",
        "**Read the commit object slowly** — `tree` is the snapshot (this is where 'a commit is a photograph' lives physically); `parent` links it to the previous commit. Follow parents backwards and you've drawn the whole history graph. First commits have no parent; merge commits (stage 4) have two.",
        "**Why ids change when history changes** — the message is inside the hashed content, so `commit --amend` produces a **new** id. And because each commit hashes its parent's id, changing one old commit changes **every descendant's id** — the ripple you'll watch live in the graph playground above.",
        "**Nothing is edited, ever** — objects are immutable; 'rewriting history' means writing new objects and swinging pointers. The old commits stay in `objects/` until the garbage collector prunes unreachable ones (weeks later, by default) — which is why stage 7's recovery tricks work at all.",
        "**`cat-file` is a flashlight, not a workflow** — `-t` asks the type, `-p` pretty-prints. You'll rarely need them in anger, but having personally walked commit → tree → blob once turns git from folklore into a filesystem you happen to understand.",
        "**SHA-1 fine print** — ids are 160-bit hashes shown as 40 hex chars; any unambiguous prefix (7-ish chars) works in commands. Git is migrating to SHA-256 repos, but the model you just learned is unchanged — only the hash function swaps.",
      ],
      exercise:
        "Spelunk your scratch repo:\n" +
        "  1. git log --oneline -1, then cat-file -p that commit. Identify tree, parent, message.\n" +
        "  2. cat-file -p the tree; find a blob; cat-file -p the blob. You just walked the DAG by hand.\n" +
        "  3. echo 'hello' | git hash-object --stdin — run it twice; confirm the id never changes.\n" +
        "  4. git commit --amend -m 'reworded' on your last commit; git log --oneline —\n" +
        "     compare the id before and after. Explain to yourself why it HAD to change.",
      drills: [
        "Name the three object types and what each stores. Which one has no filename inside it?",
        "Two different commits contain an identical 2 MB image. How many blobs does git store?",
        "Why does rewording a 10-commit-old message change the ids of the 9 commits after it?",
        "Where do 'deleted' commits physically live right after a rewrite, and roughly how long?",
        "What would a flipped bit on disk in one blob do to `git fsck`?",
      ],
      note:
        "This design — content-addressed, immutable, hash-linked — is the same trick blockchains " +
        "resell at a markup. Git had it in 2005 for the price of free. When someone asks what makes " +
        "git reliable, the honest answer is: it's very hard to change data whose name is its checksum.",
    },

    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Branches are 41-byte pointers",
      tag: "refs · HEAD · detached",
      time: "40–50 min",
      payoff:
        "A branch is a text file containing one commit id — 40 hex characters and a newline. Once " +
        "you've read one with `cat`, branching stops feeling like copying a project and starts feeling " +
        "like what it is: sticking a label on a snapshot. This is why branches are instant, free, and " +
        "the correct tool even for a twenty-minute experiment — and why detached HEAD is a state, not " +
        "an emergency.",
      concepts: [".git/refs/heads", "HEAD", "git switch", "switch -c", "detached HEAD", "branch -d vs -D", "solo branch hygiene"],
      code:
`cat .git/refs/heads/main
# c3f2a09d41e7b2a90cc4e6f1d88ab3c15e97f204
# 40 hex chars + newline = 41 bytes. That file IS the branch.

cat .git/HEAD
# ref: refs/heads/main             <- HEAD = "which branch am I on"

git branch dark-theme              # new pointer at the SAME commit. Instant.
git switch dark-theme              # move HEAD there; working tree follows
git switch -c experiment           # create + switch in one move
git switch -                       # bounce back to the previous branch

# Committing = the current branch's file gets a new id written into it.
# That's the whole trick: branches FOLLOW your commits.

# Detached HEAD: point HEAD at a commit instead of a branch
git switch --detach v1.2.0
# "You are in 'detached HEAD' state..."   <- fine! Perfect for LOOKING around.
# Commits made here belong to no branch. Keep them:
git switch -c hotfix-1.2.1         # a branch now holds them
# ...or walk away: git switch main  (the commits become unreferenced)

git branch -d dark-theme           # delete pointer; refuses if unmerged work
git branch -D experiment           # capital D: yes, drop it anyway
git branch -vv                     # every local branch, tip + tracking info`,
      lang: "bash",
      walkthrough: [
        "**Read the two files first** — `refs/heads/main` holds a commit id; `HEAD` holds a branch name. All of `switch`, `branch`, `merge` and `reset` are ultimately edits to these tiny files plus a working-tree refresh. Nothing about your project is copied when you branch.",
        "**Commit moves the branch, not you** — when you commit, git writes the new commit, then updates the file of whatever branch HEAD names. `main` isn't a place; it's a label that trails your work. This one sentence dissolves most branch confusion.",
        "**`switch` is the modern verb** — old tutorials say `checkout`, which also restores files and detaches heads and made a mess of itself. Use `git switch` for branches and `git restore` for files; let `checkout` retire with honor.",
        "**Detached HEAD, demystified** — HEAD pointing straight at a commit id instead of a branch name. Git's scary paragraph just means: 'commits made here have no label following them'. Look around old versions freely; the moment you want to keep new work, `switch -c name` pins a branch on it.",
        "**`-d` vs `-D`** — lowercase refuses to delete a branch whose commits aren't reachable elsewhere (it's protecting work, not the label); uppercase says you understand the commits will be unreferenced. Note what deletion removes: a 41-byte pointer. The commits survive until pruning, and stage 7's reflog can find them.",
        "**Solo branch hygiene** — you don't need a git-flow diagram; you need two habits. One: `main` is always deployable, because for a Pages fleet **main IS production**. Two: anything experimental — a redesign, a risky refactor, a maybe-bad idea — gets a cheap branch (`git switch -c redesign-nav`) so main stays shippable while you play. Delete merged branches promptly; a branch list is a to-do list.",
      ],
      exercise:
        "All in the scratch repo:\n" +
        "  1. cat .git/HEAD and cat .git/refs/heads/main. Write down both values.\n" +
        "  2. git switch -c test-branch; commit once; cat both files again — which changed?\n" +
        "  3. git switch main — confirm the working tree changed back.\n" +
        "  4. git switch --detach HEAD~1; commit once; git switch main.\n" +
        "     Read git's warning: it prints the orphan commit's id. Save that id.\n" +
        "  5. git switch -c rescued <that-id> — you just recovered a 'lost' commit by hand.",
      drills: [
        "Exactly what does the file `.git/refs/heads/main` contain, byte for byte?",
        "Why is creating a branch O(1) regardless of repo size?",
        "You're in detached HEAD and just made two good commits. Two commands maximum — keep them.",
        "When does `branch -d` refuse, and what is it actually protecting?",
        "For the fleet: name two branches (besides main) that would have earned their keep this month, and two that would just be clutter.",
      ],
      note:
        "Tags live one folder over, in `refs/tags/` — same 41-byte idea, but a tag is a label that " +
        "**stays put** while a branch is a label that follows commits. That distinction is the entire " +
        "difference, and it's why releases are tags (stage 10) and work-in-progress is branches.",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "Merging: where histories meet",
      tag: "fast-forward vs merge commit",
      time: "40–50 min",
      payoff:
        "Merge has two completely different behaviours wearing one command, and knowing which one " +
        "you're about to get — pointer slide or two-parent commit — is the difference between reading " +
        "your history and squinting at it. This stage also teaches the skill that makes the rest of " +
        "the course legible: reading the DAG straight out of `log --graph`.",
      concepts: ["fast-forward", "merge commit", "two parents", "--no-ff", "merge base", "log --graph", "reading the DAG"],
      code:
`git switch -c player               # build the audio player on a branch
# ...two commits later...
git switch main
git merge player
# Updating c3f2a09..9be4127
# Fast-forward                      <- main was an ANCESTOR of player:
#  js/player.js | 74 ++++++++       #    no new commit, the pointer just slides

# Now make them DIVERGE: commit on main, then more on player
git log --oneline --graph --all
# * 4d2c1f0 (player) player: keyboard shortcuts
# | * 7aa9012 (HEAD -> main) home: country flag row
# |/
# * 9be4127 player: seek bar

git merge player
# Merge made by the 'ort' strategy.  <- a TRUE merge: new commit, TWO parents
git log --oneline --graph
# *   f00d1e2 (HEAD -> main) Merge branch 'player'
# |\\
# | * 4d2c1f0 player: keyboard shortcuts
# * | 7aa9012 home: country flag row
# |/
# * 9be4127 player: seek bar

git merge --no-ff docs             # force a merge commit even when ff possible
git branch -d player               # merged: the label has done its job`,
      lang: "bash",
      walkthrough: [
        "**Fast-forward: nothing merges** — if `main` is a direct ancestor of `player`, there are no two histories to reconcile; git just slides `main`'s pointer up to `player`'s tip. No new commit, no possible conflict. Stage 3's '41-byte file gets a new id' — that's all a ff is.",
        "**True merge: a commit with two parents** — when both branches moved since they split, git finds the **merge base** (the nearest common ancestor), combines both sets of changes against it, and seals the result in a commit listing **both** tips as parents. That two-parent commit is what keeps both lines visible in the graph forever.",
        "**When does each happen?** You don't choose — the shape of history chooses. Target hasn't moved since the split → ff. Both moved → merge commit. The playground above lets you set up each shape and press merge; do it until the rule is boring.",
        "**`--no-ff`** forces a merge commit even where ff was possible — teams use it so every feature leaves a visible bubble. Solo verdict: mostly skip it; ff keeps history linear and quiet. The one solo exception: when you want 'the redesign landed HERE' to be findable in `log` two years later.",
        "**Learn to read the graph output** — each `*` is a commit; the `|` lines are parent links; `|\\` opens a two-parent merge, `|/` shows lines rejoining. Read bottom-up (oldest first). Thirty seconds of tracing beats any GUI for building the graph instinct.",
        "**Merging is directional** — `git merge player` while on `main` means 'bring player's history INTO main'; main moves, player doesn't. Merging the wrong way round is a classic Monday mistake; `git status -sb` before merging tells you which branch is about to move.",
        "**Alias it now** — you'll type the graph view constantly: `git config --global alias.lg \"log --oneline --graph --all --decorate\"`. From here on, `git lg` is how you look at every repo.",
      ],
      exercise:
        "Build both merge shapes by hand in the scratch repo:\n" +
        "  1. Branch feature, commit twice on it, switch to main, merge. Confirm 'Fast-forward'\n" +
        "     in the output and a straight line in git lg.\n" +
        "  2. Branch feature2, commit on it, ALSO commit on main, merge. Confirm 'Merge made by'\n" +
        "     and find the |\\ bubble in git lg.\n" +
        "  3. git cat-file -p HEAD after each merge: count the parent lines. 1 vs 2.\n" +
        "  4. Repeat case 1 with --no-ff and compare the graphs.",
      drills: [
        "Predict ff or merge commit: you branched, made 3 commits, main untouched since. Merge into main — which?",
        "Same, but you also fixed a typo directly on main meanwhile — which now, and why?",
        "How many parents does a fast-forward 'merge' create? A true merge? An octopus (look it up)?",
        "In `git lg` output, what do `*`, `|\\` and `|/` each mean?",
        "Why can a fast-forward never produce a conflict?",
      ],
      note:
        "The merge base matters beyond merging: `git diff main...player` (three dots) diffs player " +
        "against the merge base — 'what did this branch actually do?' — while two dots compares tips. " +
        "The three-dot form is what GitHub PRs show, which is stage 9's territory.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "Conflicts without fear",
      tag: "markers · ours · theirs",
      time: "40–50 min",
      payoff:
        "A conflict is not an error — it's git being honest that two changes overlap and refusing to " +
        "guess. The panic comes from not knowing the anatomy: what the markers mean, who 'ours' and " +
        "'theirs' are, and the fact that `merge --abort` restores the world exactly. Learn those three " +
        "things and conflicts demote themselves from crisis to chore.",
      concepts: ["conflict markers", "merge base (the third voice)", "ours vs theirs", "checkout --ours/--theirs", "git add = resolved", "merge --abort", "mergetool", "rerere"],
      code:
`$ git merge player
Auto-merging js/app.js
CONFLICT (content): Merge conflict in js/app.js
Automatic merge failed; fix conflicts and then commit the result.

--- js/app.js now contains BOTH versions, fenced with markers: ---------
<<<<<<< HEAD
  const volume = loadSetting("volume", 0.8);        (ours: main, the branch
=======                                              you are standing on)
  const volume = clamp(settings.volume, 0, 1);      (theirs: player, the
>>>>>>> player                                       branch being merged in)
-------------------------------------------------------------------------
git resolved everything else in the file. The markers ARE the question.

your tools, in escalation order:
  git status                        "Unmerged paths" lists every conflicted file
  git diff                          shows remaining conflicts as you fix them
  (edit the file: keep one side, or weave both, DELETE the markers)
  git checkout --ours   js/app.js   whole-file shortcut: take main's version
  git checkout --theirs js/app.js   whole-file shortcut: take player's version
  git mergetool                     three-pane editor (meld, vimdiff, VS Code)
  git add js/app.js                 "this file is resolved" -- add IS the flag
  git commit                        seals the merge (message is pre-filled)

  git merge --abort                 changed your mind: back to the exact
                                    pre-merge state, nothing lost, no shame`,
      lang: "txt",
      walkthrough: [
        "**What a conflict actually is** — both branches edited the **same lines** since the merge base. Different files, or different regions of one file, merge silently; git only stops where an automatic choice would be a guess. Most merges in a solo repo have zero conflicts.",
        "**Reading the markers** — between `<<<<<<< HEAD` and `=======` is **ours** (the branch you're on, the one receiving the merge); between `=======` and `>>>>>> player` is **theirs** (the branch coming in). Your job: replace the whole fenced block — markers included — with the correct final text. Sometimes that's one side, often it's a weave of both.",
        "**The third voice** — the merge base version is what both sides diverged FROM, and seeing it usually makes the right answer obvious. `git config merge.conflictstyle zdiff3` puts it inside the markers between `|||||||` fences. Turn this on today; it's the single best conflict quality-of-life setting.",
        "**`add` means resolved** — git doesn't scan for leftover markers; staging the file is your signature that it's done. (This is also the trap: `git add .` with an unfixed file commits `<<<<<<<` into production — a Pages deploy with markers in `index.html` is a rite of passage you can skip.) `git commit` then completes the merge with a pre-written message.",
        "**Whole-file shortcuts** — `checkout --ours` / `--theirs` take one side of a file wholesale. Ideal for generated files (a built `dist/`, a lockfile) where 'weaving' is meaningless and you'll regenerate anyway.",
        "**`merge --abort` is a full undo** — it restores the pre-merge state exactly. Aborting to go re-read the two branches calmly is professional behaviour, not defeat. Nothing about a half-done merge is committed until you commit.",
        "**`rerere`, the name to remember** — 'reuse recorded resolution': `git config --global rerere.enabled true` makes git remember how you resolved a conflict and replay it if the same one reappears (classic when you rebase repeatedly, next stage). Set-and-forget.",
      ],
      exercise:
        "Manufacture a conflict on purpose — twice:\n" +
        "  1. In scratch: branch two ways, edit the SAME line differently on each, merge.\n" +
        "  2. Open the file; identify ours/theirs; resolve by weaving both; add; commit.\n" +
        "  3. git lg — confirm the merge commit exists and the file is sane.\n" +
        "  4. Repeat the setup, but this time run git merge --abort. Verify with git status\n" +
        "     and git diff that the world is exactly as before the merge.\n" +
        "  5. Set merge.conflictstyle zdiff3 and trigger it once more — meet the third voice.",
      drills: [
        "In a conflict during `git merge player` while on main: which branch is 'ours'?",
        "What exactly tells git a conflicted file is resolved?",
        "Why do generated files deserve `--ours`/`--theirs` instead of hand-weaving?",
        "You see `<<<<<<<` on your live Pages site. Reconstruct the two mistakes that shipped it.",
        "What does rerere do, and in which stage-6 workflow does it shine?",
      ],
      note:
        "Prevention beats resolution: small atomic commits (stage 1), short-lived branches (stage 3), " +
        "and merging main into a long-running branch early all shrink conflicts. The worst conflicts " +
        "come from two big stale branches meeting late — a failure mode a solo dev can simply refuse " +
        "to create.",
    },

    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Rebase: history, rewritten",
      tag: "replay · squash · the golden rule",
      time: "50–70 min",
      payoff:
        "Rebase is merge's tidier sibling: instead of tying two histories together, it **replays** " +
        "your commits on a new base, keeping the line straight. Interactive rebase goes further — " +
        "squash the 'wip' noise, reword the mumbles, drop the debug commit — so what lands on `main` " +
        "reads like it was written by someone competent all along. The price is one iron rule about " +
        "what you may rewrite.",
      concepts: ["rebase = replay", "new SHAs, same diffs", "linear history", "rebase -i", "pick/squash/fixup/reword/drop", "--autosquash", "the golden rule", "rebase --abort"],
      code:
`# main moved while you built 'lightbox'. Catch up the linear way:
git switch lightbox
git rebase main
# Successfully rebased and updated refs/heads/lightbox.
# your commits e11a4f2, f2b8c31 were RE-CREATED as 9c04d11, 1d77e02
# -> NEW ids, same diffs, now sitting on top of main's tip

# Interactive: rewrite your own last commits BEFORE they go anywhere
git rebase -i HEAD~5               # an editor opens with a todo list:
# pick   9c04d11 lightbox: overlay skeleton
# squash 1d77e02 wip                       <- melt into the commit above
# reword 22e0a9c lightbox: keyboard nav    <- stop to fix the message
# fixup  8a3c771 typo                      <- melt in, discard its message
# drop   77fe210 add debug logging         <- delete this commit entirely

# autosquash: file the fix at commit time...
git commit --fixup 9c04d11         # "fixup! lightbox: overlay skeleton"
git rebase -i --autosquash main    # ...and the todo list pre-arranges itself

git rebase --abort                 # any time before it finishes: full undo

# THE GOLDEN RULE: never rebase commits that exist anywhere but your machine.
# Solo nuance: "anywhere" includes YOU-elsewhere. Pushed from the laptop and
# pulled on the desktop? Shared. Deployed to Pages from main? Shared.
# Rebase freely BEFORE pushing. After pushing: revert instead (next stage).`,
      lang: "bash",
      walkthrough: [
        "**What rebase really does** — take each of your branch's own commits, compute its diff, and re-apply that diff on top of the new base, minting a **new commit** each time. Stage 2 says why the ids must change: new parent → new hash. The old commits aren't destroyed — they're abandoned, unreferenced, reflog-findable.",
        "**Rebase vs merge is a taste with a rule of thumb** — merge preserves the true shape (parallel lines, bubbles); rebase serializes it into a straight line. For a solo fleet the linear story usually wins: `git lg` in twelve repos should read like a changelog, not a subway map. Merge earns its place when the bubble itself is information.",
        "**The interactive todo list** is just a script executed top to bottom: `pick` keep, `reword` keep but re-message, `squash` fold into the previous commit (messages combined), `fixup` fold in silently, `drop` delete, and reordering lines reorders commits. Conflicts can appear mid-replay — same markers as stage 5, then `git rebase --continue`.",
        "**The pro move: `--fixup` + `--autosquash`** — you spot a typo in a commit three back; instead of a shameful 'fix typo' commit, `git commit --fixup <sha>` files it against the right commit, and the next `rebase -i --autosquash` folds everything automatically. This is how a messy honest workday compiles into clean history.",
        "**The golden rule, and why** — rebasing published commits replaces ids other repos already have; every copy now disagrees about history, and the next pull creates a duplicated, tangled mess. **Solo nuance**: 'other people' really means 'other clones' — your desktop, your laptop, GitHub. Once a commit has been pushed, treat its id as a promise. Before push, your history is a draft: edit ruthlessly.",
        "**Escape hatches** — `rebase --abort` mid-rebase restores the branch exactly. And even a finished bad rebase is survivable: the pre-rebase tip is in `reflog` (git even labels it `ORIG_HEAD`). Stage 7 turns that from folklore into procedure.",
        "**Where this bites a Pages fleet** — `main` deploys on push, so anything on `main` is published in both senses. The discipline that follows: polish on a branch with `rebase -i`, then land on main with a clean ff merge. Main's history stays linear, deployable, and never rewritten.",
      ],
      exercise:
        "The full polish cycle, in scratch:\n" +
        "  1. Branch 'messy'; make 5 commits: two real, one 'wip', one typo-fix, one debug-junk.\n" +
        "  2. git commit --fixup the typo-fix against the commit it repairs (redo it that way).\n" +
        "  3. git rebase -i main: squash the wip, keep the fixup automatic (--autosquash),\n" +
        "     drop the debug commit, reword one message.\n" +
        "  4. git lg — the branch should now be 2-3 clean commits. Note ALL ids changed.\n" +
        "  5. Switch to main and merge — confirm it fast-forwards. That's the whole workflow.",
      drills: [
        "After `git rebase main`, are your branch's commit ids the same? The diffs?",
        "squash vs fixup — the one-word difference?",
        "State the golden rule, then translate it for a one-person, three-machine setup.",
        "Mid-rebase, a conflict appears and you're late for dinner. One command, zero damage — which?",
        "Why is 'rebase before push, revert after push' the right pairing?",
      ],
      note:
        "`git pull --rebase` (stage 8) is this stage's everyday cameo: it rebases your unpushed " +
        "commits onto what origin has, avoiding the pointless 'Merge branch main of github.com...' " +
        "bubbles that infest beginner histories. Setting `pull.rebase true` globally is the " +
        "single-config version of everything taught here.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "Undo anything",
      tag: "restore · reset · revert · reflog",
      time: "50–70 min",
      payoff:
        "Git has four different 'undo's because there are four different questions: fix a file, " +
        "re-aim a branch, publicly cancel a commit, or find something you thought was gone. Sort the " +
        "tools by question and the fear evaporates — especially once you've met **reflog**, the " +
        "90-day diary of everywhere HEAD has been, which makes committed work effectively " +
        "indestructible.",
      concepts: ["git restore", "reset --soft/--mixed/--hard", "revert (the public undo)", "commit --amend", "reflog", "ORIG_HEAD", "stash", "what is truly unrecoverable"],
      code:
`# --- fix a FILE
git restore styles.css             # working-tree edit GONE (the one true delete!)
git restore --staged styles.css    # unstage; the edit stays in the working tree
git restore --source=HEAD~3 styles.css   # pull an old version into the tree

# --- fix the LAST commit
git commit --amend                 # re-open it: message, or add staged changes
git commit --amend --no-edit       # "I forgot one file" (add it first)

# --- re-aim the BRANCH: reset moves the pointer, flavors differ in fallout
git reset --soft  HEAD~1           # branch back one; changes stay STAGED
git reset         HEAD~1           # --mixed: changes back as UNSTAGED edits
git reset --hard  HEAD~1           # working tree too: uncommitted work DESTROYED

# --- undo a PUSHED commit: don't rewrite, counter it
git revert 7aa9012                 # new commit that applies the inverse diff
# history: ...7aa9012...  + "Revert 'home: country flag row'"  -- honest, safe

# --- the time machine: every position HEAD has held, ~90 days back
git reflog
# f00d1e2 HEAD@{0}: reset: moving to HEAD~1
# 9be4127 HEAD@{1}: commit: player: seek bar
# 4d2c1f0 HEAD@{2}: rebase (finish): returning to refs/heads/lightbox
git reset --hard HEAD@{1}          # "put everything back like 20 minutes ago"
git reset --hard ORIG_HEAD         # jump to before the last reset/rebase/merge

# --- the pocket
git stash                          # park tree+index, leave everything clean
git stash pop                      # take it back (list / show -p / stash -u)`,
      lang: "bash",
      walkthrough: [
        "**Ask which thing is wrong** — a file? `restore`. The last commit's content or message? `--amend`. The branch is pointing at commits you regret? `reset`. The commit is already public? `revert`. You can't find something? `reflog`. Five questions, five tools, zero overlap once you see it this way.",
        "**`restore` is the only truly destructive one** — a working-tree edit that was never committed or staged exists in exactly one place, and `git restore` deletes that place. Half a second of 'is this the file I mean?' before restoring is the entire safety procedure. Everything else in this stage is recoverable.",
        "**The reset triad, precisely** — all three move the branch pointer; they differ in how far the demolition reaches. `--soft`: index and tree untouched, so the undone commit's changes sit **staged** (perfect for 'recut my last 3 commits as one'). `--mixed` (default): changes survive as **unstaged** edits. `--hard`: index and tree forced to match — any **uncommitted** work is gone for real. The mini-lab below runs all three side by side.",
        "**`revert` is the public undo** — instead of rewriting history (golden rule!), it adds a new commit containing the inverse diff. History stays true — 'this landed, then we removed it' — every clone stays consistent, and your Pages deploy repairs itself on the next push. Pushed mistake? Revert, always.",
        "**Reflog is why git is nearly loss-proof** — every commit, reset, rebase, merge and switch appends a line: where HEAD went and why. A 'catastrophic' hard reset is a two-command fix: `git reflog`, find the line before the disaster, `git reset --hard HEAD@{n}`. Entries survive ~90 days; the objects they point at survive with them. **What reflog cannot save**: work that never became a commit.",
        "**`ORIG_HEAD`** — before dangerous moves (reset, rebase, merge) git saves your old position under this name. `git reset --hard ORIG_HEAD` is the panic button labelled in advance.",
        "**Stash, the honest pocket** — `git stash` shelves tree + index so you can switch tasks with a clean slate; `pop` restores (add `-u` to include untracked files). Solo pattern: stash is for **minutes-to-hours**; anything overnight deserves a real branch and a real commit — stashes have no message discipline and multiply into mystery.",
        "**The corollary habit** — since committed work is nearly indestructible and uncommitted work is the only fragile thing, commit **early and often** on branches, then polish with stage 6 before landing. 'Commit ugly, rebase pretty' is the safest workflow git offers.",
      ],
      exercise:
        "The recovery drill — do this until it's muscle memory:\n" +
        "  1. In scratch, make 3 commits. Note the tip id.\n" +
        "  2. git reset --hard HEAD~2 — 'disaster': two commits vanish from log.\n" +
        "  3. git reflog — find the pre-reset line. Recover with git reset --hard HEAD@{1}.\n" +
        "  4. git log --oneline — all three commits back. Time yourself; under 30 seconds is the bar.\n" +
        "  5. Now the other side: edit a file WITHOUT committing, git restore it,\n" +
        "     and try to get it back with reflog. You can't. State the lesson out loud.\n" +
        "  6. Bonus: revert your tip commit and read the generated commit's diff with git show.",
      drills: [
        "Match the tool: wrong message on last (unpushed) commit / bad commit pushed an hour ago / staged the wrong file / branch is 3 commits into a dead end (unpushed).",
        "After `reset --soft HEAD~2`, where are the two commits' changes? After `--mixed`? After `--hard`?",
        "Why is revert the only correct undo for anything on a deployed Pages main?",
        "Which single category of work can no git command recover?",
        "What is ORIG_HEAD and after which operations is it set?",
      ],
      note:
        "The deep reason nothing committed dies quickly: stage 2's immutable object store. Resets and " +
        "rebases only move **pointers**; unreachable objects linger until `git gc` prunes them " +
        "(default: reflog-protected ~90 days, loose unreachable objects ~2 weeks minimum). Git would " +
        "rather waste disk than lose your work — the correct bias.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "Remotes: your repo's twin",
      tag: "fetch · pull · push",
      time: "50–60 min",
      payoff:
        "A remote is just another clone with a URL, and `origin/main` is your **local, possibly " +
        "stale, notes** about it — once that clicks, ahead/behind counts, rejected pushes and the " +
        "fetch-vs-pull split all become one simple picture. Even fully solo you live this daily: " +
        "laptop, desktop and GitHub are three repos that must be reconciled, and GitHub's web editor " +
        "makes 'someone else pushed' happen to a team of one.",
      concepts: ["clone", "origin", "fetch vs pull", "remote-tracking branches", "ahead/behind", "pull --rebase", "non-fast-forward rejection", "--force-with-lease"],
      code:
`git clone git@github.com:MiguelCarino/MusicGrid.git
git remote -v                      # origin = the URL you cloned from. Just a name.

git fetch origin                   # download origin's new commits, update
                                   # origin/main -- YOUR main + files: untouched
git status -sb
# ## main...origin/main [ahead 2, behind 1]     <- diverged (vs your last fetch!)
git log --oneline origin/main..main    # what I have that origin lacks
git log --oneline main..origin/main    # what origin has that I lack

git pull                           # fetch + MERGE origin/main into main
git pull --rebase                  # fetch + REPLAY my commits on top (linear)
git config --global pull.rebase true   # solo: make linear the default

git push                           # send commits, ask origin/main to advance
# ! [rejected]  main -> main (non-fast-forward)
# origin moved since your last fetch. NEVER answer this with --force blindly:
git pull --rebase && git push      # reconcile, then push

# after an INTENDED rewrite (pre-push polish that leaked, amend, etc.):
git push --force-with-lease        # overwrite origin ONLY if it still matches
                                   # your last fetch; if origin moved -> refused
git fetch --prune                  # drop origin/* refs for branches deleted on GitHub`,
      lang: "bash",
      walkthrough: [
        "**`origin` is a bookmark, not a status** — `clone` copies the full history (every clone is a backup, stage 0) and names the source URL `origin`. Nothing keeps you in sync automatically; git never touches the network except for `clone`, `fetch`, `pull`, `push`.",
        "**`origin/main` is your cached view** — a read-only local ref recording where origin's main was **the last time you fetched**. All ahead/behind arithmetic compares against this cache, so the numbers can lie when the cache is stale. The mini-lab below renders the three copies — GitHub's truth, your cache, your main — precisely because conflating them causes most remote confusion.",
        "**Fetch is always safe** — it downloads objects and moves `origin/*` refs. Your branches, your index, your working tree: untouched. Fetch compulsively; inspect with `log main..origin/main`; act when ready. Pull = fetch + immediately weave into your branch — convenient, but it's fetch that carries zero risk.",
        "**Pull's two flavors** — plain `pull` merges, and when you had local commits it mints a 'Merge branch main of github.com…' bubble that records only 'a sync happened here'. `pull --rebase` replays your commits on top instead: same content, straight line. For a repo with one author, sync-merge bubbles are pure noise — set `pull.rebase true` and forget.",
        "**Why pushes get rejected** — push only fast-forwards the remote branch. If origin has commits you don't (you merged a PR in the web UI; you pushed from the desktop last night), your push would erase them, so git refuses: `non-fast-forward`. The fix is mechanical: `pull --rebase`, then push. Rejection is the system working.",
        "**`--force-with-lease`, the adult force** — plain `--force` says 'overwrite origin no matter what it contains'. With-lease says 'overwrite only if origin still matches my last fetch' — it cannot stomp commits you haven't seen. Legit solo uses: you amended or rebased something already pushed and you're certain no other clone pulled it. Even then: with-lease, never bare force. And if the lease fails — origin moved — that refusal just saved you; fetch and look before deciding.",
        "**Multi-machine hygiene** — the three-repo dance (laptop, desktop, GitHub) stays painless with one habit: `pull --rebase` when you sit down, push when you stand up. Add `--autostash` (`git config --global rebase.autostash true`) so a dirty tree doesn't block the sit-down pull.",
      ],
      exercise:
        "Simulate the two-machine life without a second machine:\n" +
        "  1. git clone one of your real repos twice: ~/tmp/A and ~/tmp/B.\n" +
        "  2. Commit + push from A. In B: git status -sb (still clean!), then git fetch,\n" +
        "     then status again — watch 'behind 1' appear only after the fetch.\n" +
        "  3. Commit in B WITHOUT pulling, then push — read the rejection carefully.\n" +
        "  4. Fix it the right way: git pull --rebase, git lg (no merge bubble), push.\n" +
        "  5. Make A and B diverge again and try plain git pull in B — find the sync-merge\n" +
        "     bubble in git lg. Decide which history you want your fleet to have.",
      drills: [
        "What does `git fetch` change: your main? your files? origin/main? the remote itself?",
        "`## main...origin/main [ahead 2, behind 1]` — describe the graph shape, and say what the numbers are measured against.",
        "Why does git reject a non-fast-forward push instead of merging on the server?",
        "Exactly what condition makes `--force-with-lease` refuse where `--force` would proceed?",
        "You edited a README in GitHub's web UI, then pushed from your laptop and got rejected. Narrate what happened commit-by-commit.",
      ],
      note:
        "SSH keys beat HTTPS tokens for a fleet: one `ssh-keygen -t ed25519`, paste the public key " +
        "into GitHub, and every repo authenticates silently forever. Test with `ssh -T " +
        "git@github.com`. HTTPS remotes + expiring personal-access-tokens are how you end up " +
        "re-authenticating twelve repos on a Saturday.",
    },

    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "The GitHub layer",
      tag: "PRs · Pages · protection",
      time: "50–60 min",
      payoff:
        "GitHub adds a workflow layer on top of git — pull requests, issues, checks, Pages — and " +
        "most of it earns its keep even with zero collaborators. A solo PR is a self-review surface " +
        "and a CI gate in front of a branch that deploys to production on push; issues are a memory " +
        "prosthesis across twelve repos; and `gh` makes all of it scriptable from the terminal you " +
        "already live in.",
      concepts: ["pull requests (solo)", "CI checks as a gate", "issues", "fork vs branch", "GitHub Pages deploys", "CNAME / custom domain", "branch protection", "gh CLI"],
      code:
`# the solo PR loop, entirely from the terminal
git switch -c navbar-refresh
# ...commits...
git push -u origin navbar-refresh      # -u: link local branch to origin's
gh pr create --fill                    # a PR from you, to you. Why?
#  1. the PR diff view is the best self-review tool you own
#  2. CI runs BEFORE main changes -> Pages never deploys a broken build
#  3. merged PRs become a searchable changelog of every repo
gh pr view --web                       # read your own diff like a stranger
gh pr merge --squash --delete-branch   # land clean, prune the branch

# issues: the fleet's shared brain
gh issue create -t "album art 404s on JP page" -b "repro: open /jp, tile 3"
gh issue list --repo MiguelCarino/MusicGrid
git commit -m "catalog: fix JP art path (closes #12)"   # auto-closes on merge

# Pages: the deployment model of the whole fleet
#   Settings -> Pages: deploy from branch (main, / or /docs) or via Actions
#   a CNAME file at the repo root = the custom domain:
cat CNAME                              # music.carino.systems
# push to main -> build -> live in ~a minute. main IS production.

# protection: make the gate mandatory (even for yourself)
gh repo edit --enable-auto-merge
# Settings -> Branches -> protect main: require PR + passing checks.
# Solo translation: "I promise not to push a broken navbar straight to prod."`,
      lang: "bash",
      walkthrough: [
        "**Git vs GitHub, cleanly** — everything before this stage works offline against `.git`; PRs, issues, checks and Pages live on GitHub's side and git itself knows nothing about them. A PR is not a git object — it's GitHub UI wrapped around a branch comparison (the three-dot diff from stage 4's note).",
        "**The solo PR case, honestly** — for a two-line typo fix, pushing to main directly is fine; ceremony for its own sake is how tools get abandoned. The PR pays off when the change is **risky or big**: the diff view catches what the editor didn't, CI must pass before merge, and 'Merged #23: navbar refresh' is a changelog entry future-you can search. Rule of thumb: if it touches more than one concern or you hesitated even once — branch and PR it.",
        "**Checks are the gate that matters** — a minimal GitHub Actions workflow (HTML validation, a link checker, `node --check` on your JS) running on every PR means `main` — which **is** the deployed site — only receives commits that passed. This converts branch protection from bureaucracy into an automated safety net for a fleet nobody else is watching.",
        "**Fork vs branch** — a branch lives inside a repo you can push to; a fork is a full copy under another account, used to propose changes to repos you **can't** push to. Solo fleet: always branches. Contributing a fix to someone's open-source project: fork, branch on the fork, PR across.",
        "**How Pages actually deploys** — push to the configured branch → GitHub builds (or just copies, for plain static) → CDN serves it, with the `CNAME` file binding the custom domain. Consequences: every push to main is a deploy (be sure), the gh-pages/docs source choice is per-repo (be consistent across the fleet), and DNS + CNAME must agree (one typo = a dead subdomain).",
        "**Issues as external memory** — with twelve repos, 'I'll remember that bug' is a lie. `gh issue create` from the terminal the moment you notice something costs ten seconds; `closes #12` in the fixing commit closes the loop automatically. Your issue list becomes the honest backlog the fleet never had.",
        "**`gh` is the fleet multiplier** — one CLI, authenticated once, that scripts everything this stage showed: `gh repo list`, `gh pr status`, `gh api` for anything the UI can do. Stage 12 leans on it hard.",
      ],
      exercise:
        "Run one real change through the full loop on an actual fleet repo:\n" +
        "  1. Pick a small, real improvement in any of your repos.\n" +
        "  2. Branch, commit, push -u, gh pr create --fill.\n" +
        "  3. Read your own diff in the PR view. Find one thing to improve (there is one).\n" +
        "     Push the fix commit; watch the PR update.\n" +
        "  4. gh pr merge --squash --delete-branch; confirm the site redeployed.\n" +
        "  5. Create one honest issue in each of your three most-active repos — real bugs or\n" +
        "     ideas you've been carrying in your head. That's the backlog, externalized.",
      drills: [
        "Name the three concrete things a solo PR buys that a direct push to main doesn't.",
        "Fork or branch: fixing a typo in someone else's OSS repo? Redesigning your own navbar?",
        "What is the deployment trigger for a branch-served Pages site, and what file binds the domain?",
        "Why does branch protection make MORE sense, not less, when main auto-deploys?",
        "What does `closes #12` in a commit message do, and when exactly does it fire?",
      ],
      note:
        "The squash-merge default is a solo sweet spot: work in honest messy commits on the branch, " +
        "land as ONE clean commit on main — stage 6's `rebase -i` polish, performed by a button. Just " +
        "mind the interaction: after a squash merge, delete the branch (its commits were replaced by " +
        "the squashed one), or its next PR will look haunted.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Repo hygiene",
      tag: ".gitignore · tags · releases",
      time: "40–50 min",
      payoff:
        "The difference between a repo that's a pleasure to return to and one that fights you is " +
        "maintenance you do once: an intentional `.gitignore` (and knowing its famous trap), tags " +
        "that mark releases so 'what was live in March?' has an answer, and the two files — README, " +
        "LICENSE — that make a public repo legible. Plus the two honest warnings every git user " +
        "deserves: large binaries and submodules.",
      concepts: [".gitignore patterns", "the already-tracked trap", "git rm --cached", "annotated vs lightweight tags", "semver", "releases", "README & LICENSE", "git lfs (namecheck)", "submodules (warning)"],
      code:
`cat .gitignore
# node_modules/          any directory by that name, anywhere
# dist/                  build output -- rebuilt, never committed
# *.log                  glob on filename
# .DS_Store              OS litter
# fonts/src/             raw fonts before pyftsubset
# !dist/CNAME            ! = exception: DO track this one

# THE TRAP: .gitignore only affects UNTRACKED files.
# Ignoring a file git already tracks changes nothing -- it keeps versioning it.
git rm --cached fonts/NotoSansJP-full.otf    # untrack (file stays on disk)
echo 'fonts/*-full.otf' >> .gitignore
git commit -m "fonts: stop tracking the unsubset source font"

# tags: labels that STAY PUT (stage 3's other ref type)
git tag -a v1.4.0 -m "MusicGrid 1.4.0: audio player + JP catalog"
git tag                        # list;   git show v1.4.0  -> who/when/why + commit
git push --follow-tags         # push commits AND their annotated tags
gh release create v1.4.0 --generate-notes    # tag -> Release page w/ changelog

# semver in one line: MAJOR.MINOR.PATCH = breaking.feature.fix
# v1.4.0 -> v1.4.1 fixed a bug -> v1.5.0 added a feature -> v2.0.0 broke URLs

# two honest warnings:
# 1. BIG BINARIES: git keeps every version forever -- a 20 MB PSD edited
#    weekly is a gigabyte of repo by next year. git lfs stores pointers in
#    the repo and bytes elsewhere; for a static fleet, better: commit only
#    final optimized assets, keep sources out of the repo.
# 2. SUBMODULES: a repo pinned inside a repo. Powerful, and famously sharp:
#    detached HEADs, forgotten --recurse-clones, two-step updates. For
#    sharing a navbar across the fleet, a copy script beats a submodule.`,
      lang: "bash",
      walkthrough: [
        "**Ignore by intent, not by accident** — a good `.gitignore` states policy: generated things (`dist/`), dependencies (`node_modules/`), machine litter (`.DS_Store`), and heavyweight sources you deliberately keep out (raw fonts pre-subset — your fleet's font convention makes this a real category). Write it at repo birth; retrofitting is the trap below.",
        "**The already-tracked trap** — `.gitignore` is consulted only when git decides whether to notice an **untracked** file. Files already in the index keep getting versioned no matter what you add to the ignore file — the #1 'my gitignore doesn't work' report. The fix pair: `git rm --cached <file>` (untracks, keeps it on disk) plus the ignore line, in one commit. History still contains the old versions — if the file was a **secret**, removal is not enough: rotate the secret; scrubbing history (`git filter-repo`) is the paranoid follow-up.",
        "**Tags are frozen labels** — stage 3's refs family, minus the following-you behaviour. **Annotated** tags (`-a`) are real objects with tagger, date and message; **lightweight** tags are bare pointers. Always `-a` for releases — 'what, when, why' attached to the exact commit that was live. And tags don't push by default: `--follow-tags`, or watch your releases exist only on your laptop.",
        "**Semver, fleet-sized** — you don't need release engineering for static sites, but `MAJOR.MINOR.PATCH` answers real questions: v2.0.0 tells future-you 'URLs or structure changed here'. Tag when something meaningful ships, not on every push — a tag is a sentence in the story, not a heartbeat.",
        "**Releases** — `gh release create` turns a tag into a GitHub Release page with auto-generated notes from your merged PRs (stage 9's changelog habit paying out). For the fleet: a place to write 'this is what the March redesign was' while you still remember.",
        "**README and LICENSE are not decoration** — the README states what the repo is, where it deploys, and any non-obvious build step (the future-you test: could you cold-start this repo in 5 minutes after a year away?). **No LICENSE = all rights reserved** — nobody may legally reuse code you left unlicensed on a public repo; MIT is the standard 'here, have it' answer.",
        "**The two warnings, expanded** — LFS exists and works (know the name for when someone's repo needs it), but for static sites the cleaner rule is: the repo holds what deploys, not what produced it. Submodules solve 'share code between repos' at the cost of everyone's afternoon; your navbar-convention-by-copy approach is the pragmatic fleet answer, and a sync script (stage 12) closes the drift gap.",
      ],
      exercise:
        "A hygiene audit across the real fleet:\n" +
        "  1. Pick your three most-active repos. For each: does .gitignore exist? Does\n" +
        "     git status show OS litter or build output as untracked? Fix now.\n" +
        "  2. Hunt the trap: git ls-files | grep -iE 'ds_store|\\.log$|node_modules' —\n" +
        "     anything tracked that shouldn't be? git rm --cached it properly.\n" +
        "  3. Tag the current state of one deployed site: git tag -a v1.0.0 -m '...'\n" +
        "     and push --follow-tags. Create the GitHub release.\n" +
        "  4. README check: open each repo's README as a stranger. Can you tell what it is,\n" +
        "     where it deploys, and how to run it locally? Patch the worst one.",
      drills: [
        "Why does adding `secret.env` to .gitignore not stop git from tracking it — and what are the TWO steps that do (three, if it held a real secret)?",
        "Annotated vs lightweight tag: which for v2.0.0, and what extra data does it carry?",
        "Your tags show locally but not on GitHub. Which flag did you forget?",
        "Semver: renaming every page URL on a site is which bump? Fixing a broken flag icon?",
        "Someone wants to reuse your unlicensed public repo. What may they legally do?",
      ],
      note:
        "One more hygiene file worth knowing: `.gitattributes` — line-ending normalization " +
        "(`* text=auto`), marking files as binary, and `linguist-vendored` to keep vendored JS from " +
        "dominating your repo's language stats. Rarely urgent, occasionally the exact fix, good to " +
        "recognize on sight.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "History archaeology",
      tag: "pickaxe · blame · bisect",
      time: "50–60 min",
      payoff:
        "Months of disciplined commits become a database, and git ships the query tools: the pickaxe " +
        "finds when any string entered or left the code, `blame` names the commit behind every line, " +
        "and `bisect` binary-searches history for the commit that broke things — automatically, if " +
        "you hand it a test script. This is the payoff stage for every atomic-commit habit from " +
        "stage 1.",
      concepts: ["log -S (pickaxe)", "log -G (regex)", "log -L (line history)", "blame -w -C", "bisect", "bisect run", "exit code 125", "shortlog"],
      code:
`# PICKAXE: when did this string's OCCURRENCE COUNT change? (added/removed)
git log -S "oEmbed" --oneline               # where the YouTube trick landed
git log -S "oEmbed" --oneline -- js/        # scoped to a path

# -G: regex, matches ANY changed line touching the pattern (noisier, wider)
git log -G "catalog\\.(json|js)" --oneline

# -L: full history of a line range or a function
git log -L 12,40:js/app.js                  # every commit that touched lines 12-40
git log -L :renderTiles:js/app.js           # ...or the function by name

# BLAME: which commit last touched each line?
git blame -w -C js/app.js | head            # -w ignore whitespace-only changes
# 7aa9012 (Miguel 2026-03-14) const tiles = catalog.albums.map(...)
# -C follows code MOVED between files (blames the origin, not the paste)
git show 7aa9012                            # blame gives you the WHY via its commit

# BISECT: binary search for the breaking commit
git bisect start
git bisect bad                              # HEAD is broken
git bisect good v1.3.0                      # this tag was fine
# Bisecting: 24 revisions left (~5 steps)   <- log2(N): 1000 commits = ~10 tests
#   test... then: git bisect good | bad     # repeat until "X is the first bad commit"

# the automated version: any command that exits 0=good, 1-124=bad, 125=skip
git bisect run node --check js/app.js
git bisect run ./test.sh                    # walk away; come back to the culprit
git bisect reset                            # always: return to where you started`,
      lang: "bash",
      walkthrough: [
        "**`-S` vs `-G`, the precise split** — `-S` (the pickaxe) reports commits where the **number of occurrences** of the string changed: the moments code was born or deleted, skipping every commit that merely shuffled it around. `-G` matches a regex against changed lines, so it also catches moves and edits near the pattern. Start with `-S`; escalate to `-G` when the trail runs cold.",
        "**`-L` is the scalpel** — the entire life story of one function or line range: every commit that touched it, with diffs, in order. 'Why is this function shaped so weirdly?' is a `-L` query, and the answer is usually a bug fix you forgot you made.",
        "**Blame, made honest** — naive `blame` gets fooled by cosmetic history: a reformat or a file split makes one janitorial commit 'author' of everything. `-w` ignores whitespace-only changes; `-C` follows code that moved between files back to its true origin. The real workflow is two steps: blame finds the commit, `git show <id>` reads its message and full diff — that's where the **why** lives, if stage 1's message discipline held.",
        "**Bisect is binary search on history** — mark one bad and one good commit; git checks out the midpoint; you test and vote; repeat. log2 growth means a thousand commits need ~10 tests. It works on any question shaped like 'this behaviour changed somewhere': a layout break, a slow page, a font that stopped subsetting.",
        "**`bisect run` removes you from the loop** — any command whose exit code says good (0) or bad (1–124) lets git drive the whole hunt alone. `node --check` for a syntax regression, `grep -q` for a string that must exist in built output, a tiny puppeteer script for 'does the page render'. Exit **125** means 'cannot test this commit, skip it' — for commits that don't build.",
        "**Two bisect disciplines** — always `git bisect reset` when done (bisect leaves you in detached HEAD — stage 3 says why that's fine and how to leave). And the quality of the hunt equals the quality of your commits: atomic commits make the 'first bad commit' a five-line read; 'stuff' commits make bisect point at a haystack.",
        "**`shortlog -sn`** — commit counts per author. Solo, it's mostly a mirror ('247 commits this year on the fleet'), but it's also the fastest sanity check that your author identity is consistent across machines — two spellings of yourself means misconfigured `user.email` somewhere (stage 0's note).",
      ],
      exercise:
        "Real archaeology on a real fleet repo:\n" +
        "  1. Pick a distinctive string you KNOW was added at some point (a function name,\n" +
        "     a CSS class). git log -S it — find the birth commit and read its message.\n" +
        "  2. git blame -w a file you've refactored; pick the oldest line; git show its commit.\n" +
        "  3. Stage a fake bug hunt: in scratch, make 15 commits appending lines to a file,\n" +
        "     one of which secretly writes 'BUG' into it. Then:\n" +
        "     git bisect start; bad HEAD; good <first-commit>;\n" +
        "     git bisect run sh -c '! grep -q BUG file.txt'\n" +
        "  4. Confirm bisect names exactly the guilty commit. git bisect reset.",
      drills: [
        "`-S \"fetch\"` vs `-G \"fetch\"`: which one stays silent when a call is merely moved 10 lines down?",
        "Blame says the giant 'reformat all JS' commit owns every line. Which two flags fix the view?",
        "How many bisect steps for ~4000 commits? Show the arithmetic.",
        "Write the bisect run command for: the built site must contain the string 'carino-fonts.css'.",
        "What does exit code 125 tell bisect, and when do you need it?",
      ],
      note:
        "Archaeology is where every earlier discipline pays interest: atomic commits (stage 1) make " +
        "bisect surgical, honest messages make blame explanatory, tags (stage 10) give bisect its " +
        "'last known good', and linear history (stage 6) makes all output readable. Git rewards past " +
        "diligence with present omniscience — it's the closest thing this course has to a moral.",
    },

    /* -------------------------------------------------------------- 12 */
    {
      n: 12,
      title: "The automation capstone",
      tag: "hooks · gh · fleet ops",
      time: "60–90 min",
      payoff:
        "Everything you now do by discipline can be enforced by machinery: hooks that refuse bad " +
        "commits before they exist, aliases that make the right command the short one, `gh` loops " +
        "that treat twelve repos as one, and a mirror script that makes 'GitHub is my backup' " +
        "actually true. The capstone wires a pre-commit hook and a release flow into a real fleet " +
        "repo — the course's habits, made permanent.",
      concepts: ["hooks", "pre-commit", "core.hooksPath", "aliases", "global config as fleet policy", "gh scripting", "clone --mirror backups", "the capstone"],
      code:
`# --- HOOK: .git/hooks/pre-commit (chmod +x) -- runs before EVERY commit;
#     nonzero exit ABORTS the commit. The fleet edition:
#!/bin/sh
for f in js/*.js js/courses/*.js; do
  [ -f "$f" ] && { node --check "$f" || exit 1; }     # no broken JS on main
done
if git diff --cached --name-only | grep -q '\\.html$'; then
  git diff --cached | grep -n 'fonts.googleapis' &&
    { echo "BLOCKED: Google Fonts -- fleet self-hosts (carino-fonts.css)"; exit 1; }
fi
exit 0

# one hooks dir for EVERY repo on the machine (instead of 12 copies):
git config --global core.hooksPath ~/.githooks
# (bypass for emergencies exists -- git commit --no-verify -- use it never)

# --- ALIASES: fleet policy in ~/.gitconfig
git config --global alias.st  "status -sb"
git config --global alias.lg  "log --oneline --graph --all --decorate"
git config --global alias.amend "commit --amend --no-edit"
git config --global alias.undo  "reset --soft HEAD~1"

# --- FLEET LOOPS with gh: twelve repos, one terminal
gh repo list MiguelCarino --limit 30 --json name,pushedAt \\
  --template '{{range .}}{{.name}}  {{.pushedAt}}{{"\\n"}}{{end}}'
for r in ~/Github/*/; do                       # morning sweep: any repo dirty?
  [ -d "$r/.git" ] && [ -n "$(git -C "$r" status --porcelain)" ] && echo "DIRTY: $r"
done
for r in ~/Github/*/; do                       # sync everything
  [ -d "$r/.git" ] && git -C "$r" pull --rebase --autostash
done

# --- BACKUP TRUTH: GitHub is a copy, not a policy. Mirror to a second disk:
for r in ~/Github/*/; do
  n=$(basename "$r")
  [ -d "$r/.git" ] && git clone --mirror "$r" "/mnt/backup/git/$n.git" 2>/dev/null \\
    || git -C "/mnt/backup/git/$n.git" remote update
done                                           # cron it weekly. Full history, x2.`,
      lang: "bash",
      walkthrough: [
        "**Hooks are git's event system** — executable scripts in `.git/hooks/` that git runs at named moments; `pre-commit` fires before the commit exists, and a nonzero exit cancels it. No framework needed: any script, any language, `chmod +x`. The demo hook encodes two real fleet rules — JS must parse, and no Google Fonts sneaks past the self-hosting convention.",
        "**Why pre-commit beats CI for a Pages fleet** — CI (stage 9) catches problems after push, but a branch-deployed `main` means push IS deploy. The hook moves the gate to the earliest possible moment: the broken commit never exists, so it can never deploy. Use both — hook for speed, CI as the backstop the hook can't be (hooks aren't in the repo and can be bypassed).",
        "**`core.hooksPath` scales it** — hooks live in `.git/`, which doesn't clone or push, so twelve repos would mean twelve hand-copied hooks drifting apart. One global hooks directory = one file to maintain, enforced everywhere. (The popular `pre-commit` Python framework solves the same problem with a per-repo config file — worth a namecheck if your hooks outgrow one script.)",
        "**Aliases make the right thing the short thing** — `st`, `lg`, `amend`, `undo`: each encodes a course lesson as the path of least resistance. Your `~/.gitconfig` — identity, `pull.rebase`, `rebase.autostash`, `rerere.enabled`, `conflictstyle zdiff3`, hooksPath, aliases — is now a policy document; keep a copy in a dotfiles repo so a new machine inherits the whole discipline in one file.",
        "**Fleet loops** — `git -C <path>` runs any command in another repo without cd, and `gh` speaks JSON for anything scriptable. The two loops shown are the real daily drivers: the **dirty sweep** (which repos have uncommitted work I forgot?) and the **sync sweep** (pull --rebase everywhere before starting). Ten lines of shell replace the anxiety of twelve mental tabs.",
        "**The backup script is not optional** — every clone is a full copy (stage 0), but all your clones share a failure mode: your GitHub account. `clone --mirror` copies **all** refs (branches, tags, notes) into a bare repo; `remote update` refreshes it incrementally. On a second disk, on a schedule, it makes the fleet survive account lockout, repo deletion, or a bad force-push — the three disasters git itself can't undo.",
        "**The capstone below is the course exam** — it asks for nothing new: a hook (this stage), a tag and release (stage 10), a PR (stage 9), a clean history (stage 6). If it feels routine, the course worked.",
      ],
      exercise:
        "THE CAPSTONE — on a real fleet repo, no scratch:\n" +
        "  1. Create ~/.githooks/pre-commit that node --checks every staged .js file;\n" +
        "     chmod +x; set core.hooksPath globally. Prove it: stage a file with a syntax\n" +
        "     error, watch the commit refuse, fix, commit.\n" +
        "  2. Set the policy config: pull.rebase, rebase.autostash, rerere.enabled,\n" +
        "     merge.conflictstyle zdiff3, plus the four aliases. Commit ~/.gitconfig to a\n" +
        "     dotfiles repo.\n" +
        "  3. Ship a release: branch, make 2-3 real commits, rebase -i them clean, PR,\n" +
        "     merge, then git tag -a v1.0.0 (or the honest next version), push\n" +
        "     --follow-tags, gh release create --generate-notes.\n" +
        "  4. Write the mirror-backup script for ~/Github, run it once to a second disk\n" +
        "     or directory, and verify: clone FROM the mirror and git lg the result.\n" +
        "  5. Run the dirty sweep across the fleet. Deal with what it finds. You're done.",
      drills: [
        "Why does a pre-commit hook protect a Pages fleet in a way CI alone cannot?",
        "Hooks don't travel with `git clone`. Name the two mechanisms from this stage that mitigate that, and what each costs.",
        "What extra does `clone --mirror` capture that a normal clone doesn't, and which three disasters does the mirror survive that 'it's on GitHub' doesn't?",
        "Write the one-liner that lists every repo under ~/Github with uncommitted changes.",
        "Which five global config keys from this course would you set on a brand-new machine first?",
      ],
      note:
        "Automation has a failure mode: hooks so slow or strict you start typing `--no-verify`, " +
        "sweeps so noisy you stop reading them. Keep the hook under two seconds and the rules few " +
        "and real. The test of good git automation is the same as good git history: six months from " +
        "now, it still tells you the truth and stays out of your way.",
    },
  ],
};

/* =====================================================================
   Self-registered labs: headline viz + inline mini-labs for this course.
   Same contract as js/viz.js / js/labs.js — pure DOM/SVG, no libraries.
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

  /* =================================================================
     HEADLINE — the commit graph playground
     ================================================================= */
  VIZ["git"] = {
    title: "The commit graph playground",
    blurb:
      "Every git command is a move on this graph. **Commit**, **branch**, **merge**, " +
      "**rebase** and **reset** a toy repo and watch what actually happens: circles are " +
      "snapshots, labels are 41-byte pointers, and grey commits are 'deleted' history " +
      "that never really died. The line below narrates every move.",
    mount(host) {
      const GOLD = "#eab308", GREEN = "#22c55e", MUTED = "#71717a", TEXT = "#d4d4d8";
      const POOL = ["a1f9", "b7e2", "c3d8", "d40a", "e951", "f26c", "0b3d", "17e4",
                    "28f5", "39a6", "4ab7", "5bc8", "6cd9", "7de0", "8ef1", "9f02",
                    "a013", "b124", "c235", "d346", "e457", "f568"];
      const MAX = 12;
      let st, undoStack;

      const newId = (s) => POOL[s.pool++ % POOL.length];
      function addCommit(s, lane, parents) {
        const tip = s.refs[s.head];
        const c = { id: newId(s), parents: parents || (tip ? [tip] : []), lane };
        s.commits.push(c);
        s.refs[s.head] = c.id;
        return c;
      }
      function fresh() {
        const s = { commits: [], refs: { main: null, feature: null }, head: "main", pool: 0, msg: "" };
        addCommit(s, 0); addCommit(s, 0);
        s.msg = "a repo with two commits on `main`. Try **commit** a few times, then **branch feature** and make the histories diverge.";
        return s;
      }
      const byId = (s, id) => s.commits.find((c) => c.id === id);
      function ancestors(s, id) {           // inclusive
        const seen = new Set(), stack = [id];
        while (stack.length) {
          const cur = stack.pop();
          if (!cur || seen.has(cur)) continue;
          seen.add(cur);
          const c = byId(s, cur);
          if (c) stack.push(...c.parents);
        }
        return seen;
      }
      const isAnc = (s, a, b) => ancestors(s, b).has(a);   // a is ancestor of b
      function reachable(s) {
        const set = new Set();
        for (const r of ["main", "feature"])
          if (s.refs[r]) for (const id of ancestors(s, s.refs[r])) set.add(id);
        return set;
      }
      function mergeState(s) {
        const mt = s.refs.main, ft = s.refs.feature;
        if (!ft || mt === ft) return "none";
        if (isAnc(s, mt, ft)) return "ff";
        if (isAnc(s, ft, mt)) return "none";
        return "true";
      }
      function featureOnly(s) {
        if (!s.refs.feature) return [];
        const fa = ancestors(s, s.refs.feature), ma = ancestors(s, s.refs.main);
        return s.commits.filter((c) => fa.has(c.id) && !ma.has(c.id));
      }
      const pushUndo = () => { undoStack.push(JSON.parse(JSON.stringify(st))); if (undoStack.length > 20) undoStack.shift(); };

      host.innerHTML = `
        <div class="viz gitviz">
          <div class="viz-ctrls wrap">
            <button class="viz-btn mono primary" data-a="commit">commit</button>
            <button class="viz-btn mono" data-a="branch">branch feature</button>
            <button class="viz-btn mono" data-a="sw-main">switch main</button>
            <button class="viz-btn mono" data-a="sw-feature">switch feature</button>
            <button class="viz-btn mono" data-a="merge">merge feature</button>
            <button class="viz-btn mono" data-a="rebase">rebase feature onto main</button>
            <button class="viz-btn mono" data-a="reset">reset --hard HEAD~1</button>
            <button class="viz-btn" data-a="undo">Undo ↶</button>
            <button class="viz-btn" data-a="fresh">Reset ⟲</button>
          </div>
          <div data-r="canvas" style="overflow-x:auto;padding:4px 0"></div>
          <div class="viz-ctrls"><span class="viz-status" data-r="stat"></span></div>
          <p class="asm-msg" data-r="msg"></p>
        </div>`;

      function paint() {
        const s = st;
        const live = reachable(s);
        // generations (parents are always created before children)
        const gen = {};
        for (const c of s.commits)
          gen[c.id] = c.parents.length ? Math.max(...c.parents.map((p) => gen[p] ?? 0)) + 1 : 0;
        // rows: start at lane, bump down on slot collision
        const pos = {}, taken = new Set();
        let maxGen = 0, maxRow = 0;
        for (const c of s.commits) {
          let row = c.lane;
          while (taken.has(row + ":" + gen[c.id]) && row < 3) row++;
          taken.add(row + ":" + gen[c.id]);
          pos[c.id] = { x: 46 + gen[c.id] * 58, y: 64 + row * 64 };
          maxGen = Math.max(maxGen, gen[c.id]);
          maxRow = Math.max(maxRow, row);
        }
        const W = 46 + (maxGen + 1) * 58 + 30;
        const H = 64 + maxRow * 64 + 44;
        // edges
        let edges = "";
        for (const c of s.commits) {
          const cp = pos[c.id];
          for (const p of c.parents) {
            const pp = pos[p]; if (!pp) continue;
            const dead = !live.has(c.id);
            edges += `<line x1="${pp.x + 11}" y1="${pp.y}" x2="${cp.x - 11}" y2="${cp.y}"
              stroke="${dead ? MUTED : "#52525b"}" stroke-width="1.5"
              ${dead ? 'stroke-dasharray="3 3" opacity="0.55"' : ""}/>`;
          }
        }
        // nodes + sha labels
        let nodes = "";
        for (const c of s.commits) {
          const p = pos[c.id];
          const dead = !live.has(c.id);
          const col = dead ? MUTED : (c.lane === 0 ? GOLD : GREEN);
          nodes += `<circle cx="${p.x}" cy="${p.y}" r="10" fill="rgba(0,0,0,0.25)"
              stroke="${col}" stroke-width="2" ${dead ? 'stroke-dasharray="3 3"' : ""}/>` +
            `<text x="${p.x}" y="${p.y + 25}" text-anchor="middle" font-size="10"
              font-family="monospace" fill="${dead ? MUTED : "#a1a1aa"}">${c.id}</text>`;
        }
        // ref labels stacked above tips
        const labels = {};
        const addLbl = (id, t, col) => { (labels[id] = labels[id] || []).push([t, col]); };
        if (s.refs.main) addLbl(s.refs.main, "main", GOLD);
        if (s.refs.feature) addLbl(s.refs.feature, "feature", GREEN);
        if (s.refs[s.head]) addLbl(s.refs[s.head], "HEAD", TEXT);
        let lbls = "";
        for (const id of Object.keys(labels)) {
          const p = pos[id];
          labels[id].forEach(([t, col], i) => {
            lbls += `<text x="${p.x}" y="${p.y - 20 - i * 13}" text-anchor="middle"
              font-size="10" font-weight="700" font-family="monospace" fill="${col}">${t}</text>`;
          });
        }
        $('[data-r="canvas"]', host).innerHTML =
          `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
             style="display:block;min-width:${W}px" role="img"
             aria-label="commit graph">${edges}${nodes}${lbls}</svg>`;

        // button guards
        const ms = mergeState(s);
        const fo = featureOnly(s);
        const tip = byId(s, s.refs[s.head]);
        const dis = {
          commit: s.commits.length >= MAX,
          branch: !!s.refs.feature || s.commits.length === 0,
          "sw-main": s.head === "main",
          "sw-feature": !s.refs.feature || s.head === "feature",
          merge: s.head !== "main" || ms === "none" || (ms === "true" && s.commits.length >= MAX),
          rebase: !s.refs.feature || ms !== "true" || s.commits.length + fo.length > MAX,
          reset: !tip || tip.parents.length === 0,
          undo: undoStack.length === 0,
          fresh: false,
        };
        $$("[data-a]", host).forEach((b) => { b.disabled = !!dis[b.dataset.a]; });
        $('[data-r="stat"]', host).innerHTML =
          `HEAD → <b>${s.head}</b> · ${s.commits.length}/${MAX} commits` +
          (s.commits.length >= MAX ? " · graph full — Undo or Reset ⟲" : "");
        $('[data-r="msg"]', host).innerHTML = fmt(s.msg);
      }

      host.addEventListener("click", (e) => {
        const b = e.target.closest("[data-a]");
        if (!b || b.disabled) return;
        const a = b.dataset.a, s = st;
        if (a === "fresh") { st = fresh(); undoStack = []; paint(); return; }
        if (a === "undo") {
          if (!undoStack.length) return;
          st = undoStack.pop();
          st.msg = "⟲ undone — previous state restored (a luxury real git spells `reflog`).";
          paint(); return;
        }

        if (a === "commit") {
          if (s.commits.length >= MAX) return;
          pushUndo();
          const parent = s.refs[s.head];
          const c = addCommit(s, s.head === "main" ? 0 : 1);
          s.msg = `commit \`${c.id}\`: a new snapshot whose parent is \`${parent}\`. The branch **${s.head}** moved forward by itself — a branch is a pointer that follows your commits.`;
        } else if (a === "branch") {
          pushUndo();
          s.refs.feature = s.refs[s.head];
          s.head = "feature";
          s.msg = `branch: a second 41-byte pointer now aims at \`${s.refs.feature}\` — **nothing was copied**. HEAD switched to \`feature\`; new commits will move it and leave \`main\` behind.`;
        } else if (a === "sw-main" || a === "sw-feature") {
          pushUndo();
          s.head = a === "sw-main" ? "main" : "feature";
          s.msg = `switch: only **HEAD** changed — it now names \`${s.head}\`. In a real repo the working tree would be rewritten to match \`${s.refs[s.head]}\`'s snapshot.`;
        } else if (a === "merge") {
          const ms = mergeState(s);
          if (ms === "ff") {
            pushUndo();
            s.refs.main = s.refs.feature;
            s.msg = "merge → **fast-forward**: `main` was a direct ancestor of `feature`, so the pointer just slid up to `feature`'s tip. No new commit, no possible conflict, history stays a straight line.";
          } else if (ms === "true") {
            pushUndo();
            const mt = s.refs.main, ft = s.refs.feature;
            s.head = "main";
            const c = addCommit(s, 0);
            c.parents = [mt, ft];
            s.msg = `merge → **merge commit** \`${c.id}\` with **two parents** (\`${mt}\` and \`${ft}\`). Both lines of history stay visible in the graph forever.`;
          } else return;
        } else if (a === "rebase") {
          const fo = featureOnly(s);
          if (!fo.length) return;
          pushUndo();
          let prev = s.refs.main;
          const pairs = [];
          for (const old of fo) {
            const c = { id: newId(s), parents: [prev], lane: 1 };
            s.commits.push(c);
            pairs.push(`\`${old.id}\`→\`${c.id}\``);
            prev = c.id;
          }
          s.refs.feature = prev;
          s.msg = `rebase: feature's ${fo.length} commit${fo.length > 1 ? "s were" : " was"} **re-created with new SHAs** on top of main (${pairs.join(", ")}) — same diffs, new parents, new ids. The grey originals still exist, unreferenced, until git prunes them.`;
        } else if (a === "reset") {
          const tip = byId(s, s.refs[s.head]);
          if (!tip || !tip.parents.length) return;
          pushUndo();
          s.refs[s.head] = tip.parents[0];
          const orphaned = !reachable(s).has(tip.id);
          s.msg = `reset --hard: **${s.head}** now points at \`${tip.parents[0]}\`. ` + (orphaned
            ? `Commit \`${tip.id}\` didn't die — it's unreferenced (grey), and \`git reflog\` still knows its id. That's why reset is survivable.`
            : `Commit \`${tip.id}\` is still reachable through the other branch, so it isn't even orphaned — only the pointer moved.`);
        }
        paint();
      });

      st = fresh(); undoStack = [];
      paint();
    },
  };

  /* =================================================================
     MINI-LABS
     ================================================================= */
  LABS["git"] = [

    /* ---- at 1: the three areas ----------------------------------- */
    {
      at: 1,
      title: "The three areas",
      blurb:
        "Four files, three columns: **working tree → index → last commit**. Edit, `add`, " +
        "`commit` and `restore` your way around and watch the chips move — the status pane " +
        "below shows exactly what `git status --short` would print at every step.",
      mount(host) {
        const fresh = () => ({
          files: [
            { name: "index.html", head: 1, index: 1, work: 1 },
            { name: "styles.css", head: 1, index: 1, work: 2 },
            { name: "app.js",     head: 1, index: 1, work: 1 },
            { name: "notes.md",   head: null, index: null, work: 1 },
          ],
          msg: "`styles.css` arrives already modified and `notes.md` untracked. Start with **edit index.html**, then walk it through the two-step dance: `add`, then `commit`.",
          hot: [],
        });
        let st = fresh();

        host.innerHTML = `
          <div class="viz areaviz">
            <div class="viz-ctrls wrap">
              <button class="viz-btn mono" data-a="edit">edit index.html</button>
              <button class="viz-btn mono" data-a="add">git add index.html</button>
              <button class="viz-btn mono" data-a="addall">git add .</button>
              <button class="viz-btn mono" data-a="commit">git commit</button>
              <button class="viz-btn mono" data-a="restore">git restore index.html</button>
              <button class="viz-btn mono" data-a="unstage">git restore --staged index.html</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
            </div>
            <div class="lnx-users">
              <div class="lnx-user"><div class="lnx-user-h">working tree <em>your files</em></div><div class="el-list" data-r="work"></div></div>
              <div class="lnx-user"><div class="lnx-user-h">index <em>staged — the next commit</em></div><div class="el-list" data-r="index"></div></div>
              <div class="lnx-user"><div class="lnx-user-h">repository <em>last commit (HEAD)</em></div><div class="el-list" data-r="head"></div></div>
            </div>
            <div class="gnu-pane" style="margin-top:12px">
              <div class="gnu-pane-h"><code>git status --short</code><span>left = index vs HEAD · right = tree vs index</span></div>
              <pre class="gnu-pane-b" data-r="status"></pre>
            </div>
            <p class="asm-msg" data-r="msg"></p>
          </div>`;

        const chip = (txt, hot) => `<div class="el-item ${hot ? "hot" : ""}">${esc(txt)}</div>`;
        function statusLines(files) {
          const lines = [];
          for (const f of files) {
            let X, Y;
            if (f.head === null && f.index === null) { X = "?"; Y = "?"; }
            else {
              X = f.index !== f.head ? (f.head === null ? "A" : "M") : " ";
              Y = f.work !== f.index ? "M" : " ";
            }
            if (X !== " " || Y !== " ") lines.push(`${X}${Y} ${f.name}`);
          }
          return lines.length ? lines.join("\n") : "nothing to commit, working tree clean";
        }
        function paint() {
          const hot = st.hot;
          $('[data-r="work"]', host).innerHTML = st.files.map((f) => {
            const state = f.index === null ? "untracked" : f.work !== f.index ? `modified (v${f.work})` : "clean";
            return chip(`${f.name} — ${state}`, hot.includes(f.name) || state !== "clean");
          }).join("");
          const staged = st.files.filter((f) => f.index !== null && f.index !== f.head || (f.head === null && f.index !== null));
          $('[data-r="index"]', host).innerHTML = staged.length
            ? staged.map((f) => chip(`${f.name} @ v${f.index} — ${f.head === null ? "new file" : "modified"}`, hot.includes(f.name))).join("")
            : '<span class="ln-dim">empty — the next commit would be empty</span>';
          const committed = st.files.filter((f) => f.head !== null);
          $('[data-r="head"]', host).innerHTML = committed.length
            ? committed.map((f) => chip(`${f.name} @ v${f.head}`, hot.includes(f.name))).join("")
            : '<span class="ln-dim">no commits yet</span>';
          $('[data-r="status"]', host).textContent = statusLines(st.files);
          $('[data-r="msg"]', host).innerHTML = fmt(st.msg);
        }
        const file = (n) => st.files.find((f) => f.name === n);

        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-a]"); if (!b) return;
          const a = b.dataset.a;
          const A = file("index.html");
          st.hot = [];
          if (a === "reset") { st = fresh(); paint(); return; }
          if (a === "edit") {
            A.work++;
            st.hot = ["index.html"];
            st.msg = A.index !== A.head
              ? "edited **on top of a staged version** — status shows `MM`: the index still holds the older staged copy; the commit would ship that one, not this edit."
              : "`index.html` changed in the **working tree only**. Git noticed (` M`) but nothing is staged — a commit right now would not include it.";
          } else if (a === "add") {
            if (A.work === A.index) st.msg = "nothing to add — the index already matches the working tree for `index.html`.";
            else { A.index = A.work; st.hot = ["index.html"]; st.msg = "`add` **copied the file's current state into the index**. The left status column lights up: this exact version is now part of the next commit."; }
          } else if (a === "addall") {
            const touched = st.files.filter((f) => f.index !== f.work).map((f) => f.name);
            if (!touched.length) st.msg = "`git add .` found nothing new — index already matches the working tree everywhere.";
            else {
              st.files.forEach((f) => { f.index = f.work; });
              st.hot = touched;
              st.msg = `\`git add .\` staged **everything** (${touched.join(", ")}) — including the untracked file, which shows as \`A \` (new). Convenient, and exactly how stray junk sneaks into commits; \`add -p\` is the deliberate alternative.`;
            }
          } else if (a === "commit") {
            const staged = st.files.filter((f) => f.index !== f.head);
            if (!staged.length) st.msg = "**nothing to commit** — the index matches HEAD. The commit packages the index, and the cart is empty; `add` something first.";
            else {
              st.files.forEach((f) => { f.head = f.index; });
              st.hot = staged.map((f) => f.name);
              const leftover = st.files.filter((f) => f.index !== null && f.work !== f.index).map((f) => f.name);
              st.msg = "committed the **index exactly as staged**." +
                (leftover.length ? ` The unstaged edits (${leftover.join(", ")}) stayed behind in the working tree — the commit never looked at them.` : " Working tree, index and HEAD now agree: clean.");
            }
          } else if (a === "restore") {
            if (A.work === A.index) st.msg = "nothing to restore — `index.html`'s working copy already matches the index.";
            else { A.work = A.index; st.hot = ["index.html"]; st.msg = "`restore` threw away the working-tree edit and rewrote the file from the index. **This is the one destructive move here** — that edit was never staged or committed, so nothing can bring it back."; }
          } else if (a === "unstage") {
            if (A.index === A.head) st.msg = "nothing staged for `index.html` — index already matches HEAD.";
            else { A.index = A.head; st.hot = ["index.html"]; st.msg = "`restore --staged` reset the **index** entry back to HEAD's version — the file itself is untouched, your edit still sits in the working tree as unstaged. The safe un-add."; }
          }
          paint();
        });
        paint();
      },
    },

    /* ---- at 7: reset, three ways --------------------------------- */
    {
      at: 7,
      title: "reset, three ways",
      blurb:
        "One repo state — three commits, one staged file, one unstaged edit — hit with " +
        "`--soft`, `--mixed` and `--hard`. Each variant moves the same pointer; they differ " +
        "in **how much of your uncommitted world survives**. Watch what each one preserves.",
      mount(host) {
        const START = {
          head: ["c3f2a — clock: live JST clock in navbar"],
          index: ["footer.html — new footer (staged, never committed)"],
          work: ["README.md — edited, unstaged"],
          msg: "the scenario: three commits (`c1`→`c2`→`c3`), `footer.html` staged, `README.md` edited but unstaged. Pick a reset flavor — you can switch between them freely, each starts from this same scenario.",
          warn: "", saved: "",
        };
        const OUT = {
          soft: {
            head: ["c2b91 — navbar: shared header  (moved back)"],
            index: ["c3's changes (the clock) — back in the index, staged", "footer.html — still staged, untouched"],
            work: ["README.md — edited, unstaged (untouched)"],
            msg: "`--soft` moved **only the branch pointer**. The undone commit's changes landed in the index as if freshly staged, joining `footer.html`. Nothing was lost — this is the 'recut my last commits as one' tool.",
            warn: "", saved: "",
          },
          mixed: {
            head: ["c2b91 — navbar: shared header  (moved back)"],
            index: ["(empty — everything unstaged)"],
            work: ["c3's changes (the clock) — now unstaged edits", "footer.html — back to unstaged", "README.md — edited, unstaged (untouched)"],
            msg: "`--mixed` (the default) moved the pointer **and reset the index**: the clock changes and the footer staging both fell back into the working tree as plain unstaged edits. Files preserved, staging undone — the 'let me re-sort this pile' tool.",
            warn: "", saved: "",
          },
          hard: {
            head: ["c2b91 — navbar: shared header  (moved back)"],
            index: ["(empty)"],
            work: ["clean — the tree now matches c2 exactly"],
            msg: "`--hard` forced index **and working tree** to match the target commit.",
            warn: "DESTROYED: the staged footer.html and the README.md edit are gone for good — they were never committed, so no reflog, no recovery. This is the only reset that eats work.",
            saved: "The committed part survives: `git reflog` → `c3f2a HEAD@{1}: commit: clock…` — and `git reset --hard c3f2a` brings the clock commit right back.",
          },
        };
        let cur = null;

        host.innerHTML = `
          <div class="viz resetviz">
            <div class="viz-ctrls wrap">
              <button class="viz-btn mono" data-v="soft">git reset --soft HEAD~1</button>
              <button class="viz-btn mono" data-v="mixed">git reset --mixed HEAD~1</button>
              <button class="viz-btn mono" data-v="hard">git reset --hard HEAD~1</button>
              <button class="viz-btn" data-v="__start">reset scenario ⟲</button>
            </div>
            <div class="lnx-users">
              <div class="lnx-user"><div class="lnx-user-h">HEAD points at <em>branch tip</em></div><div class="el-list" data-r="head"></div></div>
              <div class="lnx-user"><div class="lnx-user-h">index contains <em>staged</em></div><div class="el-list" data-r="index"></div></div>
              <div class="lnx-user"><div class="lnx-user-h">working tree contains <em>your files</em></div><div class="el-list" data-r="work"></div></div>
            </div>
            <div class="viz-ctrls" style="margin-top:10px"><span class="viz-status" data-r="warn"></span></div>
            <p class="asm-msg" data-r="msg"></p>
          </div>`;

        function paint() {
          const s = cur ? OUT[cur] : START;
          $$("[data-v]", host).forEach((b) => b.classList.toggle("on", b.dataset.v === cur));
          const list = (items, hot) => items.map((t) =>
            `<div class="el-item ${hot ? "hot" : ""}">${esc(t)}</div>`).join("");
          $('[data-r="head"]', host).innerHTML = list(s.head, !!cur);
          $('[data-r="index"]', host).innerHTML = list(s.index, !!cur && cur !== "hard");
          $('[data-r="work"]', host).innerHTML = list(s.work, cur === "mixed");
          const w = $('[data-r="warn"]', host);
          w.classList.toggle("err", !!s.warn);
          w.innerHTML = s.warn ? "⚠ " + esc(s.warn) : (cur ? "committed work: safe (reflog) · uncommitted work: " + (cur === "hard" ? "destroyed" : "preserved") : "3 commits · 1 staged file · 1 unstaged edit");
          $('[data-r="msg"]', host).innerHTML = fmt(s.msg + (s.saved ? " " + s.saved : ""));
        }
        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-v]"); if (!b) return;
          cur = b.dataset.v === "__start" ? null : b.dataset.v;
          paint();
        });
        paint();
      },
    },

    /* ---- at 8: sync states --------------------------------------- */
    {
      at: 8,
      title: "Sync states",
      blurb:
        "Three copies of `main`: **GitHub's truth**, your **last fetch** of it (`origin/main`), " +
        "and your **local main**. Advance either side, then try `fetch`, `pull`, `push` and " +
        "`--force-with-lease` — with honest outcomes: rejections included. Even solo, 'origin " +
        "moved' happens every time you edit on GitHub or push from another machine.",
      mount(host) {
        const POOL = ["c4d2", "d7e0", "e2f8", "f9a1", "0a1b", "1b2c", "2c3d", "3d4e", "4e5f", "5f6a",
                      "6a7b", "7b8c", "8c9d", "9d0e", "ae1f", "bf20", "c031", "d142", "e253", "f364"];
        const fresh = () => ({
          remote: ["a1f9", "b7e2"],
          known:  ["a1f9", "b7e2"],
          local:  ["a1f9", "b7e2"],
          pool: 0, err: false,
          msg: "everything in sync. Use the **scenario** buttons to move the world, then the **action** buttons to reconcile — and read the ahead/behind line: it measures against your **last fetch**, not against GitHub.",
        });
        let st = fresh();
        const nid = () => POOL[st.pool++ % POOL.length];
        const minus = (a, b) => a.filter((x) => !b.includes(x));
        const stale = () => JSON.stringify(st.known) !== JSON.stringify(st.remote);

        host.innerHTML = `
          <div class="viz syncviz">
            <div class="viz-ctrls wrap">
              <span class="gnu-slot-name">scenario</span>
              <button class="viz-btn mono" data-a="you">you commit</button>
              <button class="viz-btn mono" data-a="them">origin advances</button>
              <button class="viz-btn mono" data-a="both">both (diverge)</button>
              <button class="viz-btn" data-a="reset">Reset ⟲</button>
            </div>
            <div style="display:grid;gap:10px">
              <div class="lnx-user"><div class="lnx-user-h">GitHub — origin's main <em>the truth</em></div><div style="display:flex;gap:6px;flex-wrap:wrap" data-r="remote"></div></div>
              <div class="lnx-user"><div class="lnx-user-h">origin/main <em>your last fetch — a cached view</em></div><div style="display:flex;gap:6px;flex-wrap:wrap" data-r="known"></div></div>
              <div class="lnx-user"><div class="lnx-user-h">local main <em>your repo</em></div><div style="display:flex;gap:6px;flex-wrap:wrap" data-r="local"></div></div>
            </div>
            <div class="viz-ctrls wrap" style="margin-top:12px">
              <span class="gnu-slot-name">action</span>
              <button class="viz-btn mono" data-a="fetch">git fetch</button>
              <button class="viz-btn mono" data-a="pull">git pull</button>
              <button class="viz-btn mono" data-a="pullr">git pull --rebase</button>
              <button class="viz-btn mono" data-a="push">git push</button>
              <button class="viz-btn mono" data-a="force">git push --force-with-lease</button>
              <span class="viz-status" data-r="stat"></span>
            </div>
            <p class="asm-msg" data-r="msg"></p>
          </div>`;

        const BASE = ["a1f9", "b7e2"];
        function paint() {
          const chip = (id, base) =>
            `<div class="el-item ${base ? "" : "hot"}">${esc(id)}</div>`;
          for (const key of ["remote", "known", "local"]) {
            $(`[data-r="${key}"]`, host).innerHTML =
              st[key].map((id) => chip(id, BASE.includes(id))).join('<span class="ln-dim" style="align-self:center">→</span>');
          }
          const ahead = minus(st.local, st.known).length;
          const behind = minus(st.known, st.local).length;
          const stat = $('[data-r="stat"]', host);
          stat.classList.toggle("err", st.err);
          stat.innerHTML = st.err
            ? "✗ last action refused"
            : `## main...origin/main [ahead ${ahead}, behind ${behind}]` +
              (stale() ? " · <b>stale</b> — origin moved since your last fetch" : "");
          $('[data-r="msg"]', host).innerHTML = fmt(st.msg);
        }

        host.addEventListener("click", (e) => {
          const b = e.target.closest("[data-a]"); if (!b) return;
          const a = b.dataset.a;
          st.err = false;
          if (a === "reset") { st = fresh(); paint(); return; }

          if (a === "you" || a === "them" || a === "both") {
            const room = st.local.length < 8 && st.remote.length < 8;
            if (!room) { st.msg = "chains are long enough — **Reset ⟲** to start over."; paint(); return; }
            if (a === "you" || a === "both") st.local.push(nid());
            if (a === "them" || a === "both") st.remote.push(nid());
            st.msg = a === "you"
              ? "you committed locally. GitHub knows nothing; your cached `origin/main` didn't move either — you're **ahead** of it."
              : a === "them"
              ? "origin advanced — say, you merged a PR in the web UI, or pushed from the desktop last night. **Your repo has no idea yet**: the ahead/behind line still reads from the stale cache."
              : "diverged: one commit only you have, one only origin has. This is the state every sync command exists for.";
          } else if (a === "fetch") {
            const had = stale();
            st.known = st.remote.slice();
            st.msg = had
              ? "fetch: downloaded origin's new commits and moved **origin/main** to match the truth. Your `main`, your files: **untouched** — fetch is always safe. Now the ahead/behind numbers are honest."
              : "fetch: nothing new — your cached `origin/main` already matched GitHub. Still free, still safe.";
          } else if (a === "pull" || a === "pullr") {
            st.known = st.remote.slice();
            const ro = minus(st.remote, st.local), lo = minus(st.local, st.remote);
            if (!ro.length) {
              st.msg = lo.length
                ? "already up to date — origin has nothing you lack (you're just **ahead**; pulling can't help, pushing can)."
                : "already up to date.";
            } else if (!lo.length) {
              st.local = st.remote.slice();
              st.msg = "pull → **fast-forward**: you had nothing local, so `main` just slid up to origin's tip. No merge commit needed.";
            } else if (a === "pull") {
              st.local = st.local.concat(ro);
              st.local.push(nid() + "⋈");
              st.msg = "pull → **merge**: histories had diverged, so git created a sync **merge commit** (⋈) with two parents. Content is fine — but the bubble records nothing except 'a sync happened'. This is what `pull.rebase true` avoids.";
            } else {
              st.local = st.remote.concat(lo.map((x) => x.replace(/'*$/, "") + "'"));
              st.msg = "pull --rebase: your local commits were **replayed on top** of origin's — note the new ids (`'`). Same changes, linear history, no bubble. The solo default.";
            }
          } else if (a === "push") {
            const ro = minus(st.remote, st.local);
            if (ro.length) {
              st.err = true;
              st.msg = "**! [rejected] — non-fast-forward.** Origin has commits you don't (" + ro.join(", ") + "); your push would erase them, so git refuses. This rejection is the system working. Fix: `fetch`, then `pull --rebase`, then push.";
            } else if (JSON.stringify(st.remote) === JSON.stringify(st.local)) {
              st.msg = "everything up to date — nothing to push.";
            } else {
              st.remote = st.local.slice();
              st.known = st.remote.slice();
              st.msg = "push accepted: origin **fast-forwarded** to your `main`. All three rows agree again.";
            }
          } else if (a === "force") {
            if (stale()) {
              st.err = true;
              st.msg = "**refused: stale info.** Origin moved since your last fetch — the **lease** protects commits you haven't even seen. This is exactly the disaster plain `--force` would not have caught. Fetch, look at what arrived, then decide.";
            } else {
              const dropped = minus(st.remote, st.local);
              st.remote = st.local.slice();
              st.known = st.remote.slice();
              st.msg = dropped.length
                ? `force-with-lease accepted: origin **rewritten** to match your main — ${dropped.join(", ")} discarded from the remote. Legitimate only because you fetched first and knowingly chose to overwrite.`
                : "force-with-lease accepted — though origin needed no rewriting, so a plain push would have done the same.";
            }
          }
          paint();
        });
        paint();
      },
    },
  ];
})();
