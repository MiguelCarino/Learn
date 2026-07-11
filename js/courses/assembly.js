/* =====================================================================
   Carino Learn — course: ASSEMBLY  (x86-64, NASM, Linux)
   Goal: learn just enough assembly to truly understand operating systems.
   Written for someone who has NEVER seen an assembly instruction before:
   every stage has a line-by-line `walkthrough` and small `drills`.
   ===================================================================== */

window.COURSES = window.COURSES || {};
window.COURSES["assembly"] = {
  id: "assembly",
  title: "Assembly",
  tag: "x86-64 · the metal",
  icon: "cpu",
  blurb: "Read the CPU's own language to understand how an OS really works.",
  intro:
    "Assembly is the human-readable form of the actual instructions your CPU runs. " +
    "We learn it not to write fast code, but as a flashlight: 13 hands-on stages take you " +
    "from your very first instruction to writing a boot sector, handling interrupts, walking " +
    "page tables and switching tasks — so words like process, virtual memory and scheduler " +
    "stop being abstractions. No prior assembly assumed.",
  meta: [["Arch", "x86-64"], ["Assembler", "NASM"], ["Host", "Linux"]],

  tracks: [
    { id: "found",  label: "Foundations",      stages: [0, 1, 2, 3, 4] },
    { id: "abi",    label: "Code that talks",   stages: [5, 6, 7] },
    { id: "kernel", label: "Into the kernel",   stages: [8, 9, 10, 11, 12] },
  ],

  reference: [
    {
      kind: "table",
      title: "Registers & the System V ABI",
      head: ["register", "what it's for", "who saves it"],
      rows: [
        ["rax", "return value / syscall number", "caller"],
        ["rdi", "1st argument", "caller"],
        ["rsi", "2nd argument", "caller"],
        ["rdx", "3rd argument", "caller"],
        ["rcx", "4th arg (r10 in syscalls)", "caller"],
        ["r8",  "5th argument", "caller"],
        ["r9",  "6th argument", "caller"],
        ["rbx", "general use", "callee"],
        ["rbp", "frame pointer", "callee"],
        ["rsp", "stack pointer", "—"],
        ["r12–r15", "general use", "callee"],
        ["rip", "instruction pointer", "—"],
      ],
    },
    {
      kind: "table",
      title: "Common Linux x86-64 syscalls",
      head: ["rax", "name", "args in rdi, rsi, rdx, …"],
      rows: [
        ["0",  "read",   "fd, *buf, count"],
        ["1",  "write",  "fd, *buf, count"],
        ["2",  "open",   "*path, flags, mode"],
        ["3",  "close",  "fd"],
        ["9",  "mmap",   "addr, len, prot, flags, fd, off"],
        ["12", "brk",    "addr"],
        ["57", "fork",   "—"],
        ["59", "execve", "*path, *argv, *envp"],
        ["60", "exit",   "status"],
        ["61", "wait4",  "pid, *status, opts, *rusage"],
      ],
      foot: "Full list: `/usr/include/asm/unistd_64.h`",
    },
    {
      kind: "cmds",
      title: "Build & inspect commands",
      rows: [
        ["Static, no libc", "nasm -f elf64 a.asm -o a.o && ld a.o -o a"],
        ["Linked with C",   "nasm -f elf64 a.asm -o a.o && gcc a.o -o a -no-pie"],
        ["Flat boot binary","nasm -f bin boot.asm -o boot.bin"],
        ["Disassemble",     "objdump -d -M intel ./a"],
        ["Debug",           "gdb ./a  →  break _start  →  run  →  stepi"],
        ["Trace syscalls",  "strace ./a"],
        ["Boot in QEMU",    "qemu-system-x86_64 -drive format=raw,file=boot.bin"],
      ],
    },
  ],

  stages: [
    /* -------------------------------------------------------------- 0 */
    {
      n: 0,
      title: "Build the lab",
      tag: "setup",
      time: "30 min",
      payoff:
        "Before reasoning about an OS you need the tools that turn typed text into a " +
        "running program. Install them once and use them for the whole course. Think of " +
        "this as setting up a workbench: an assembler, a linker, a debugger, and an " +
        "emulator you can crash safely.",
      concepts: ["nasm", "ld / gcc", "gdb", "objdump", "qemu", "strace"],
      code:
`# Fedora / RHEL / CentOS
sudo dnf install nasm gcc gdb binutils \\
                 qemu-system-x86 strace

# Debian / Ubuntu
sudo apt install nasm build-essential gdb binutils \\
                 qemu-system-x86 strace

# Confirm each tool is installed (each prints a version)
nasm  --version
ld    --version
gdb   --version
qemu-system-x86_64 --version`,
      lang: "bash",
      walkthrough: [
        "**`nasm`** — the *assembler*. It turns the assembly text you write into raw machine-code bytes. It's the single most important tool in this course.",
        "**`ld`** (the *linker*, part of `binutils`) and **`gcc`** — these glue your machine code into a finished, runnable file the OS can launch.",
        "**`gdb`** — the *debugger*. It lets you run a program one instruction at a time and peek at the CPU's registers. You will use it constantly to *see* what each instruction does.",
        "**`objdump`** — *disassembles* a finished program back into assembly, so you can check what the tools produced.",
        "**`qemu-system-x86_64`** — a *virtual computer*. Later you'll write code that runs with no OS underneath it; QEMU lets you boot that safely instead of rebooting your real machine.",
        "**`strace`** — prints every request a program makes to the kernel. That request boundary is exactly what this course is about.",
      ],
      exercise:
        "Run every `--version` command above and confirm each one prints something. If one " +
        "says 'command not found', install it before moving on — a half-built workbench " +
        "wastes hours later.",
      drills: [
        "Find out where each tool lives on disk: `which nasm gcc gdb qemu-system-x86_64`.",
        "Open the NASM manual with `man nasm` and skim the first screen (press `q` to quit). You won't understand it yet — that's fine.",
      ],
      note:
        "Why this specific set? `nasm` = text → machine code. `ld`/`gcc` = machine code → a " +
        "runnable file. `gdb` = step through and inspect. `qemu` = run bare-metal code " +
        "safely. `strace` = watch the user/kernel boundary you're here to understand.",
    },

    /* -------------------------------------------------------------- 1 */
    {
      n: 1,
      title: "The machine model",
      tag: "mental model",
      time: "2–3 hrs",
      payoff:
        "An operating system exists to share one CPU and one pool of memory among many " +
        "programs. You can't understand that sharing until you can picture what a single " +
        "program sees: a small set of fast slots called *registers*, and a giant numbered " +
        "array of bytes it calls *memory*. This stage has no code to run — it builds the map.",
      concepts: [
        "registers (rax…r15)",
        "rip & rflags",
        "memory = numbered bytes",
        "little-endian",
        "two's complement",
        "hex ↔ binary",
      ],
      code:
`; A "register" is a tiny storage slot built into the CPU itself.
; It holds ONE 64-bit number and is far faster than memory.
; There are 16 general-purpose registers you can freely use:
;
;   rax  rbx  rcx  rdx        rsi  rdi
;   rbp  rsp                  r8 r9 r10 r11 r12 r13 r14 r15
;
; Each 64-bit register has smaller "windows" onto the same bits:
;   rax = full 64 bits
;   eax = low 32 bits      ax = low 16 bits      al = low 8 bits
;
; Two special registers you do NOT set by hand like the others:
;   rip    = points at the next instruction to run
;   rflags = a bag of yes/no bits the CPU sets after each operation
;            (ZF "result was zero", SF "result was negative", ...)
;
; "Memory" is just a huge array of bytes, each with a numbered address:
;   address:  0      1      2      3   ...
;   byte:    [ ?? ] [ ?? ] [ ?? ] [ ?? ]`,
      lang: "asm",
      walkthrough: [
        "A **register** is a slot *inside* the CPU. There are only 16 general ones, so they're precious — most work is shuffling values between registers and memory.",
        "**`rax`**, **`rbx`**, … are the 64-bit names. The `r` means 64-bit (`r` = 'register-extended'). `eax` is the lower half, `ax` lower still, `al` the lowest byte — all the *same* physical register, just different-sized views.",
        "**`rip`** is the *instruction pointer*: it always holds the address of the next instruction. Running a program is really just `rip` marching forward (and sometimes jumping).",
        "**`rflags`** is set automatically as a side effect of math. After `5 - 5 = 0`, the CPU flips the 'zero flag' on. Later, jumps read these flags to make decisions.",
        "**Memory** is one long array of bytes numbered from 0 upward. An 'address' is just an index into that array — nothing more mysterious than that.",
        "**Little-endian**: a multi-byte number is stored lowest-byte-first. The value `0x11223344` sits in memory as `44 33 22 11`. Surprising, but it's just a convention x86 follows.",
        "**Two's complement**: how negatives are stored. For a single byte, `0xFF` means `255` if you call it unsigned, or `-1` if you call it signed. The bits are identical — *you* decide how to read them.",
      ],
      exercise:
        "On paper, write the number 200 and the number -56 as 8-bit binary (two's " +
        "complement), then convert each to two hex digits. Check yourself: " +
        "`printf '%x\\n' 200` for 200, and `python3 -c \"print(hex(-56 & 0xff))\"` for -56.",
      drills: [
        "Convert by hand: `0xFF`, `0x10`, `0x80` into decimal. (Hex digit × 16 + next digit.)",
        "Which is bigger as *unsigned* bytes: `0xFF` or `0x7F`? Which is bigger as *signed*? (This trap causes real bugs.)",
        "Write the registers `rax / eax / ax / al` from memory and say how many bits each one is.",
      ],
      note:
        "OS payoff: every process believes it owns this entire flat array of memory from " +
        "address 0 upward. It doesn't — the kernel and a chip called the MMU fake that for " +
        "each program. That illusion is *virtual memory*, the central trick of modern " +
        "operating systems, and the whole course builds toward it.",
    },

    /* -------------------------------------------------------------- 2 */
    {
      n: 2,
      title: "Your first instructions & first syscall",
      tag: "user ↔ kernel",
      time: "half a day",
      payoff:
        "Printing 'hello' looks trivial, but a normal program can't touch the screen " +
        "directly — it has to *ask the kernel* to do it. That request is a **syscall**, and " +
        "it is THE doorway between your program and the operating system. Walk through this " +
        "one doorway carefully and the rest of OS behaviour starts to click.",
      concepts: ["mov", "xor", "sections .text / .data", "the syscall instruction", "exit status"],
      code:
`section .data
    msg db "Hello, kernel!", 10      ; 10 is the newline character
    len equ $ - msg                  ; len = (here) minus (start of msg)

section .text
    global _start                    ; tell the linker where to begin
_start:
    mov rax, 1          ; rax = 1  → "I want syscall number 1 (write)"
    mov rdi, 1          ; rdi = 1  → 1st arg: file descriptor 1 = screen
    mov rsi, msg        ; rsi = address of the text to print
    mov rdx, len        ; rdx = how many bytes to print
    syscall             ; hand control to the kernel: it prints the text

    mov rax, 60         ; rax = 60 → syscall "exit"
    xor edi, edi        ; rdi = 0  → exit status 0 (success)
    syscall             ; ask the kernel to end the program`,
      lang: "asm",
      walkthrough: [
        "**`section .data`** — a labelled area for data that has a starting value. **`section .text`** — where your instructions live. The CPU runs `.text`; it reads from `.data`.",
        "**`msg db \"Hello, kernel!\", 10`** — `db` means 'define bytes'. This lays the text into memory, followed by byte `10` (a newline). `msg` becomes a name for that text's address.",
        "**`len equ $ - msg`** — `$` means 'the current address'. So `$ - msg` is the text's length in bytes, computed for you. `equ` makes `len` a constant name for that number.",
        "**`global _start`** + **`_start:`** — a label is just a name for a spot in the code. `_start` is the special spot where execution begins; `global` makes it visible to the linker.",
        "**`mov rax, 1`** — `mov` copies a value into a register. Read it right-to-left: 'put 1 into rax'. It does NOT move anything away from anywhere; it's really 'copy'.",
        "The four `mov`s load the syscall's *number* (into `rax`) and its *arguments* (into `rdi`, `rsi`, `rdx`). This ordering is a fixed rule called the syscall convention.",
        "**`syscall`** — the star of the show. It pauses your program and jumps into the kernel, which reads `rax`/`rdi`/`rsi`/`rdx`, does the work (prints your text), and returns.",
        "**`xor edi, edi`** — `xor` of anything with itself is 0, so this is just a fast, idiomatic way to write 'set rdi to 0'. You'll see it everywhere instead of `mov rdi, 0`.",
        "The second `syscall` (with `rax = 60`) is `exit`. Without it the CPU would keep running into whatever bytes follow and crash. A program must end itself.",
      ],
      exercise:
        "Build it, run it, and read the exit status:\n" +
        "  nasm -f elf64 hello.asm -o hello.o\n" +
        "  ld hello.o -o hello\n" +
        "  ./hello ; echo \"exit code = $?\"\n" +
        "`$?` holds the last program's exit status. Confirm you see your text and `exit code = 0`.",
      drills: [
        "Change the message text, rebuild, and run it. (Edit → reassemble → relink → run.)",
        "Change `xor edi, edi` to `mov edi, 42`, rebuild, and confirm `echo $?` now prints 42.",
        "Run `strace ./hello` and find the `write(1, ...)` and `exit(...)` lines — that's the kernel seeing your two syscalls.",
        "Delete the final two `syscall`/exit lines, rebuild, and watch it crash. Now you know why `exit` is mandatory.",
      ],
      note:
        "The syscall convention is fixed and worth memorising: `rax` = which syscall, " +
        "arguments go in `rdi, rsi, rdx, r10, r8, r9`, and the result comes back in `rax`. " +
        "Every syscall number lives in `/usr/include/asm/unistd_64.h`.",
    },

    /* -------------------------------------------------------------- 3 */
    {
      n: 3,
      title: "Memory & the stack",
      tag: "memory",
      time: "1 day",
      payoff:
        "The **stack** is a special region of memory where programs keep temporary values, " +
        "return addresses and saved registers. 'Stack overflow', the per-thread stack, and " +
        "classic security exploits all live here. Learn to `push`, `pop`, and read memory by " +
        "address and you can decode almost any crash.",
      concepts: ["push / pop", "rsp & rbp", "the stack grows down", "[address] memory access", ".bss"],
      code:
`section .bss
    buf resq 4                 ; reserve room for 4 numbers (uninitialised)

section .text
    global _start
_start:
    mov rax, 111
    mov rbx, 222
    push rax                   ; put 111 ON the stack (rsp moves down by 8)
    push rbx                   ; put 222 on top of it
    pop  rax                   ; take the TOP value off → rax becomes 222
    pop  rbx                   ; take the next one      → rbx becomes 111
                               ; the two values swapped!

    lea  rdi, [buf]            ; rdi = the ADDRESS of buf
    mov  qword [rdi], 7        ; store 7 into the memory rdi points at
    mov  qword [rdi + 8], 9    ; store 9 into the next slot (8 bytes over)
    mov  rcx, [rdi + 8]        ; read that slot back → rcx becomes 9

    mov rax, 60
    xor edi, edi
    syscall`,
      lang: "asm",
      walkthrough: [
        "**`section .bss`** — reserved memory that starts out as all zeros. **`buf resq 4`** means 'reserve 4 qwords (4 × 8 bytes)' and call that area `buf`. Use it when you need scratch space.",
        "**The stack** is a stack of plates: you `push` a value on top and `pop` the top one off. It's **LIFO** — last in, first out. The register **`rsp`** always points at the current top.",
        "**`push rax`** — copies `rax` onto the top of the stack and moves `rsp` *down* by 8 (the stack grows toward lower addresses — a historical quirk that matters later).",
        "**`pop rbx`** — copies the top stack value into `rbx` and moves `rsp` back *up* by 8.",
        "Because it's LIFO, pushing 111 then 222 and popping into `rax` then `rbx` *swaps* them — a neat way to feel how the stack works.",
        "**`lea rdi, [buf]`** — `lea` = 'load effective address'. It puts the *address* of `buf` into `rdi`, not its contents. `rdi` now 'points at' `buf`.",
        "**`mov qword [rdi], 7`** — the square brackets mean 'the memory *at* this address'. So this stores 7 into the memory `rdi` points at. `qword` says 'write 8 bytes'.",
        "**`[rdi + 8]`** — addressing with an offset. Since each number is 8 bytes, `+8` is the *next* slot. This `[base + offset]` form is how arrays and structs are accessed.",
      ],
      exercise:
        "Watch the stack move under the debugger:\n" +
        "  nasm -f elf64 stack.asm -o stack.o && ld stack.o -o stack\n" +
        "  gdb ./stack   then:   break _start   →   run   →   stepi\n" +
        "After each `stepi`, type `info registers rsp rax rbx`. Watch `rsp` drop by 8 on each " +
        "`push` and rise on each `pop`, and confirm `rax`/`rbx` really swapped.",
      drills: [
        "In gdb, after the two pushes, run `x/2gx $rsp` to *see* the two values sitting on the stack.",
        "Push three different numbers, then pop them into three registers. Predict the order before you run it.",
        "Change `[rdi + 8]` to `[rdi + 16]` and confirm you wrote into the *third* slot of `buf` instead.",
      ],
      note:
        "OS payoff: the kernel gives every thread its own stack with an unmapped 'guard " +
        "page' just below it. Run off the end and you hit that page → the kernel kills you " +
        "with SIGSEGV. That's a *stack overflow*. Attackers who overwrite the saved return " +
        "address sitting on this stack are doing a *buffer-overflow exploit*.",
    },

    /* -------------------------------------------------------------- 4 */
    {
      n: 4,
      title: "Control flow: making decisions",
      tag: "logic",
      time: "1 day",
      payoff:
        "There is no `if` or `while` in hardware — only *compare* and *jump*. Seeing how " +
        "ordinary logic breaks down into `cmp` + a conditional jump is how you'll later read " +
        "a scheduler's loop or a lock's retry loop. Once this clicks, assembly stops looking " +
        "like noise.",
      concepts: ["cmp", "conditional jumps (je/jl/jg…)", "jmp", "inc", "building a loop"],
      code:
`; Add up the numbers 1 through 10. This is a "for" loop in raw form.
section .text
    global _start
_start:
    xor rax, rax            ; rax = 0   → this will hold the running sum
    mov rcx, 1              ; rcx = 1   → our counter, "i", starts at 1
.loop:
    cmp rcx, 10             ; compare i with 10 (sets the flags)
    jg  .done               ; if i is Greater than 10, jump out of the loop
    add rax, rcx            ; sum = sum + i
    inc rcx                 ; i = i + 1
    jmp .loop               ; go back and test again
.done:
    mov rdi, rax            ; put the sum (55) into rdi...
    mov rax, 60             ; ...and exit with it, so we can read it
    syscall`,
      lang: "asm",
      walkthrough: [
        "**`xor rax, rax`** zeroes the sum; **`mov rcx, 1`** starts the counter at 1. (`rcx` is traditional for counters.)",
        "**`.loop:`** — a label starting with `.` is a *local* label, handy for marking jump targets inside one routine. It's just a name for this spot.",
        "**`cmp rcx, 10`** — `cmp` subtracts 10 from `rcx` but throws the result away, keeping only the flags. It's how you *ask a question* about two values without changing them.",
        "**`jg .done`** — 'jump if greater'. It reads the flags `cmp` just set and, if `rcx > 10`, jumps to `.done`. Otherwise execution falls through to the next line.",
        "**`add rax, rcx`** adds the counter into the sum. **`inc rcx`** is shorthand for 'add 1 to rcx' — it increments the counter.",
        "**`jmp .loop`** — an *unconditional* jump: always go back to the top and test again. The `cmp`/`jg` pair is what eventually lets us escape.",
        "Together, `cmp` + conditional jump + `jmp` build every loop and `if` you'll ever see. High-level languages compile down to exactly this.",
      ],
      exercise:
        "Build and run it, then read the result with `echo $?` — you should get 55. Then change " +
        "the `10` to `100`. The exit status only holds 0–255, so predict what `echo $?` shows " +
        "now (hint: it wraps around) and check.",
      drills: [
        "Rewrite the loop to count *down* from 10 to 1 using `dec rcx` and `cmp rcx, 0` / `jne`.",
        "Make it sum only even numbers (add 2 to the counter each time instead of 1).",
        "Change `jg` to `jge` and explain, in one sentence, why the sum changes.",
        "Single-step the whole loop in gdb (`stepi`) and watch `rax` grow: 1, 3, 6, 10, 15…",
      ],
      note:
        "`cmp a, b` computes `a − b` for its flags only. Signed jumps (`jg`/`jl`) and unsigned " +
        "jumps (`ja`/`jb`) read *different* flags — using a signed jump on unsigned data (or " +
        "vice-versa) is a classic real-world bug. Match the jump to the kind of number.",
    },

    /* -------------------------------------------------------------- 5 */
    {
      n: 5,
      title: "Functions & the calling convention",
      tag: "the contract",
      time: "1–2 days",
      payoff:
        "`call` and `ret`, plus an agreed set of rules called a *calling convention*, are the " +
        "contract every compiler, library and the OS loader rely on. Learn the System V " +
        "AMD64 convention and your assembly can call C code, C can call your assembly, and " +
        "you can read any stack trace in a debugger.",
      concepts: ["call / ret", "args in rdi, rsi, rdx…", "return in rax", "caller- vs callee-saved", "16-byte alignment"],
      code:
`; long add3(long a, long b, long c)  — returns a + b + c.
; By the convention: a is in rdi, b in rsi, c in rdx, result goes in rax.
global add3
add3:
    lea rax, [rdi + rsi]     ; rax = a + b   (lea here is just fast addition)
    add rax, rdx             ; rax = (a + b) + c
    ret                      ; return to the caller; result already in rax

; A function that calls others must keep the stack 16-byte aligned and
; must preserve "callee-saved" registers it uses (rbx, rbp, r12-r15):
global work
work:
    push rbp                 ; save caller's frame pointer (also realigns)
    mov  rbp, rsp            ; set up our own frame pointer
    push rbx                 ; rbx is callee-saved → save it before using
    mov  rbx, rdi            ; ... safely use rbx here ...
    pop  rbx                 ; restore rbx for the caller
    pop  rbp                 ; restore the frame pointer
    ret`,
      lang: "asm",
      walkthrough: [
        "**`call add3`** (used by a caller) does two things: it pushes the *return address* onto the stack, then jumps to `add3`. **`ret`** pops that address back into `rip`, resuming the caller.",
        "**The convention** says where arguments live: 1st in `rdi`, 2nd in `rsi`, 3rd in `rdx`, then `rcx`, `r8`, `r9`. The return value comes back in `rax`. Everyone agrees on this so code from different sources fits together.",
        "**`lea rax, [rdi + rsi]`** — we met `lea` as 'load address', but `[rdi + rsi]` computes `a + b` along the way, so people use `lea` as a quick add. `rax` gets the sum.",
        "**`add rax, rdx`** adds the third argument. The total is now in `rax`, which is exactly where the convention says a return value belongs — so `ret` is all that's left.",
        "**`push rbp` / `mov rbp, rsp`** — the standard *function prologue*. It saves the caller's frame pointer and starts a new 'stack frame'. Debuggers follow these to unwind a call stack.",
        "**Callee-saved** registers (`rbx`, `rbp`, `r12`–`r15`): if your function uses them, it must put them back exactly as it found them — hence `push rbx` … `pop rbx`.",
        "**Caller-saved** registers (`rax`, `rcx`, `rdx`, `rsi`, `rdi`, `r8`–`r11`): a called function is *allowed* to clobber these, so if you need their values after a `call`, you save them yourself first.",
      ],
      exercise:
        "Write `long maxof(long a, long b)` that returns the larger of its two arguments, using " +
        "`cmp rdi, rsi` and a conditional move `cmovl rax, rsi`. Start with `mov rax, rdi`. Test " +
        "it from a tiny C `main` (next stage shows the linking) or check it in gdb.",
      drills: [
        "Write `long square(long n)` returning `n*n` using `imul rax, rdi` after `mov rax, rdi`.",
        "In gdb, break on `add3`, and confirm with `info registers rdi rsi rdx` that the arguments really arrived in those registers.",
        "Write `long add4(a,b,c,d)` — which register holds the 4th argument? (Check the cheat-sheet.)",
        "Make `work` actually do something with `rbx`, then remove the `push/pop rbx` and observe how it corrupts the caller's `rbx`.",
      ],
      note:
        "This contract is *why* a debugger can show you a clean backtrace: the prologue/epilogue " +
        "and saved registers leave a trail it can walk. Break the convention and tools — and " +
        "other people's code — quietly stop working.",
    },

    /* -------------------------------------------------------------- 6 */
    {
      n: 6,
      title: "Interfacing with C",
      tag: "the glue",
      time: "1–2 days",
      payoff:
        "Real systems are C glued together with a little assembly. Calling a C library " +
        "function (like `printf`) from assembly, and reading the assembly a C compiler " +
        "produces, demystifies what every program actually does — and reveals `_start`, the C " +
        "runtime, and how your `main` is reached.",
      concepts: ["extern / global", "linking with gcc", "calling printf", "gcc -S", "_start vs main"],
      code:
`extern printf                ; printf lives in the C library, defined elsewhere
global main                  ; the C runtime will call our "main"
section .rodata
    fmt db "answer = %d", 10, 0   ; a C string MUST end in a 0 byte

section .text
main:
    push rbp                ; keep the stack 16-byte aligned before a call
    lea  rdi, [rel fmt]     ; 1st arg to printf: the format string
    mov  rsi, 42            ; 2nd arg: the number to print
    xor  eax, eax           ; printf is variadic: eax = 0 vector registers
    call printf             ; let the C library do the printing
    pop  rbp
    xor  eax, eax           ; return 0 from main
    ret`,
      lang: "asm",
      walkthrough: [
        "**`extern printf`** — promises 'a function named `printf` exists somewhere; the linker will connect it'. It comes from the C library.",
        "**`global main`** — we expose `main` instead of `_start` this time, because we're going to let the C runtime start the program and call our `main`, just like in a C file.",
        "**`section .rodata`** — read-only data. **`fmt db \"answer = %d\", 10, 0`** ends with a `0` byte because C strings are 'null-terminated': functions find the end by looking for that zero.",
        "**`push rbp`** — here it's not for a frame; it's to fix *alignment*. The convention requires the stack be a multiple of 16 bytes when you `call`. This single push gets us there.",
        "**`lea rdi, [rel fmt]`** — load the format string's address into the first-argument register. `rel` makes it position-independent, which modern systems require.",
        "**`mov rsi, 42`** — the value that `%d` will print, in the second-argument register.",
        "**`xor eax, eax`** — a special rule for *variadic* functions like `printf`: `al` must say how many arguments were passed in vector (float) registers. We passed none, so 0.",
        "**`call printf`** runs the library function with the arguments we set up. Afterwards we restore `rbp`, set `rax` to 0 (main's return value), and `ret`.",
      ],
      exercise:
        "Link it through gcc so the C runtime wraps your `main`:\n" +
        "  nasm -f elf64 demo.asm -o demo.o\n" +
        "  gcc demo.o -o demo -no-pie\n" +
        "  ./demo            # prints: answer = 42\n" +
        "Then write a 3-line C function in `f.c`, run `gcc -S -O2 -masm=intel f.c`, and read the " +
        "`f.s` the compiler produced. Compare it to assembly you'd write by hand.",
      drills: [
        "Add a second `%d` to the format string and pass a second number in `rdx` (the 3rd arg register).",
        "Print a string instead of a number: use format `\"%s\\n\"` and point `rsi` at another `db` string.",
        "Compile `int main(){return 7;}` with `gcc -S -masm=intel`, open the `.s`, and find where `7` appears.",
        "Run `ltrace ./demo` to watch the call into `printf` from the outside.",
      ],
      note:
        "`_start`, not `main`, is the *real* entry point. It comes from the C runtime (crt0): it " +
        "collects argc/argv, calls `__libc_start_main`, which calls *your* `main`, then calls " +
        "`exit()` with whatever `main` returned. That's why a bare `_start` (stage 2) had to " +
        "call `exit` itself — there was no runtime to do it.",
    },

    /* -------------------------------------------------------------- 7 */
    {
      n: 7,
      title: "Anatomy of a process",
      tag: "loading",
      time: "2–3 days",
      payoff:
        "How does a file on disk become a *living* process? The answer is the ELF file " +
        "format, the loader, the initial stack the kernel hands you, and the virtual-memory " +
        "map. This is the stage where 'a program' and 'a process' finally become two " +
        "different things in your head.",
      concepts: ["ELF format", "the loader", "initial stack: argc/argv/envp", "memory map", "brk & mmap"],
      code:
`; When the program starts, the kernel has already placed the command-line
; arguments on the stack for us. At _start, the very top of the stack holds:
;
;   [rsp]      = argc           (how many arguments)
;   [rsp + 8]  = argv[0]        (address of the program's own name)
;   [rsp + 16] = argv[1]        (address of the first real argument)
;   ...
section .text
    global _start
_start:
    mov rax, [rsp]          ; rax = argc, read straight off the stack top
    mov rdi, [rsp + 8]      ; rdi = pointer to argv[0]

    mov rdi, rax            ; exit with argc as the status, so we can see it
    mov rax, 60
    syscall`,
      lang: "asm",
      walkthrough: [
        "An **ELF file** (Executable and Linkable Format) is the standard layout of every Linux program: a header describing the file, plus chunks of code and data and instructions for the loader.",
        "**The loader** (part of the kernel + a helper) reads that ELF, copies its pieces into a fresh memory layout, sets up the stack, and jumps to the entry point. That act *is* turning a file into a process.",
        "**`mov rax, [rsp]`** — at the instant `_start` begins, the kernel has put `argc` (the argument count) at the very top of the stack. So reading `[rsp]` gives us `argc` directly.",
        "**`mov rdi, [rsp + 8]`** — 8 bytes further along sits `argv[0]`, a *pointer* to the program's name. Each `argv[i]` is one pointer (8 bytes), laid out in order above `argc`.",
        "We then exit with `argc` as the status purely so the exercise can observe it with `echo $?`. (Real programs read the strings the pointers point to.)",
        "Beyond `argv` the kernel also stacks the environment variables (`envp`) and an 'auxiliary vector' of hints — all there before your first instruction runs.",
      ],
      exercise:
        "Build it, then inspect a real ELF and a real process map:\n" +
        "  readelf -h ./prog        # the ELF header: entry point, type\n" +
        "  readelf -l ./prog        # 'program headers' = the loadable segments\n" +
        "  ./prog one two ; echo $? # argc is 3 (program name + two args)\n" +
        "  cat /proc/self/maps      # the live virtual-memory map of `cat` itself\n" +
        "Match the segments in `readelf -l` to the regions in `/proc/self/maps`.",
      drills: [
        "Run `./prog` with 0, 1, and 5 arguments and confirm `echo $?` matches argc each time.",
        "Run `file ./prog` and read what it reports (ELF, 64-bit, statically linked, etc.).",
        "Open `/proc/self/maps` and find the lines labelled `[stack]` and `[heap]`.",
        "Run `size ./prog` to see the byte sizes of its text, data, and bss sections.",
      ],
      note:
        "OS payoff: the `execve` syscall maps an ELF's segments into a brand-new virtual " +
        "address space, lays `argc`/`argv`/`envp` onto the new stack, and jumps to the entry " +
        "point. The heap grows on demand via `brk`/`mmap`; the stack grows downward. You're " +
        "seeing memory management from the *process's* side — next we cross into the kernel's.",
    },

    /* -------------------------------------------------------------- 8 */
    {
      n: 8,
      title: "Talking to the kernel directly",
      tag: "syscalls",
      time: "3–4 days",
      payoff:
        "Every service an OS provides — files, processes, memory, signals — is reached " +
        "through a syscall. Writing real programs with nothing but raw syscalls (no C " +
        "library at all) makes the kernel interface concrete and shows you exactly where the " +
        "OS does work on your behalf.",
      concepts: ["read / write / open / close", "mmap", "fork / execve / wait4", "signals", "strace"],
      code:
`; A minimal "cat": copy standard input to standard output, no C library.
; It reads up to 4096 bytes at a time and writes back exactly what it read.
section .bss
    buf resb 4096              ; a 4096-byte scratch buffer
section .text
    global _start
_start:
.loop:
    xor rax, rax            ; rax = 0 → syscall "read"
    xor rdi, rdi            ; rdi = 0 → read from standard input
    mov rsi, buf            ; rsi = where to put the bytes
    mov rdx, 4096           ; rdx = read at most 4096 bytes
    syscall                 ; rax comes back = number of bytes read
    test rax, rax           ; was the count zero (end of input) or negative?
    jle  .done              ; if <= 0, we're finished

    mov rdx, rax            ; write exactly as many bytes as we read
    mov rax, 1              ; rax = 1 → syscall "write"
    mov rdi, 1              ; rdi = 1 → write to standard output
    mov rsi, buf            ; rsi = the same buffer
    syscall
    jmp .loop               ; repeat until input runs out
.done:
    mov rax, 60
    xor edi, edi
    syscall`,
      lang: "asm",
      walkthrough: [
        "**`buf resb 4096`** reserves a 4096-byte buffer (`resb` = reserve bytes). 4096 is one memory page — a natural, efficient chunk size.",
        "**The read syscall** (`rax = 0`): we set `rdi = 0` (standard input), `rsi = buf` (where to store data), `rdx = 4096` (max bytes). After `syscall`, `rax` holds how many bytes actually arrived.",
        "**`test rax, rax`** — `test` ANDs a value with itself to set flags without changing it; here it's the standard idiom for 'is `rax` zero?'. **`jle .done`** leaves the loop on 0 (end of input) or a negative error.",
        "**`mov rdx, rax`** — we must write back *exactly* the number of bytes we read, so we copy that count into `rdx` for the write call.",
        "**The write syscall** (`rax = 1`, `rdi = 1` for standard output) sends those bytes onward. Then **`jmp .loop`** goes back for more.",
        "When input ends, `read` returns 0, we fall through to `.done`, and `exit` ends the program cleanly. You just reimplemented `cat` with two syscalls.",
      ],
      exercise:
        "Build it, then prove it's a real `cat` and watch the syscalls:\n" +
        "  echo 'piped through raw assembly' | ./mycat\n" +
        "  ./mycat < /etc/hostname\n" +
        "  strace -e read,write ./mycat < /etc/hostname\n" +
        "The `strace` output shows the exact read/write pairs your loop made.",
      drills: [
        "Change `rdi` in the read from 0 to a file you `open` first, turning `mycat` into a file reader.",
        "Make a `mywc`: instead of writing, count the bytes you read and print the total at the end.",
        "Read the man page `man 2 read` and find what a *negative* return value means (an error code).",
        "Stretch: use `fork` + `execve` + `wait4` to write a 20-line shell that runs one typed command.",
      ],
      note:
        "OS payoff: `fork` duplicates the entire process (cheaply, via copy-on-write pages), " +
        "`execve` replaces its program image, and `wait4` collects the finished child. That " +
        "fork → exec → wait dance is literally how every shell launches every command you've " +
        "ever typed.",
    },

    /* -------------------------------------------------------------- 9 */
    {
      n: 9,
      title: "Bare metal: write a boot sector",
      tag: "no OS below you",
      time: "3–5 days",
      payoff:
        "Now remove the operating system entirely. When a PC powers on, the firmware loads " +
        "the first 512 bytes of a disk and jumps to them — and now *you* are the only " +
        "software running. This is where an operating system literally begins, and where " +
        "16-bit 'real mode', the GDT, and the jump to 64-bit mode become real.",
      concepts: ["the 512-byte boot sector", "real mode & BIOS int 0x10", "the boot signature 0xAA55", "QEMU"],
      code:
`; A boot sector that prints a message using the BIOS, then halts forever.
[bits 16]                   ; the CPU starts in old 16-bit mode
[org 0x7c00]                ; the firmware loads us at address 0x7c00
start:
    mov si, msg             ; si points at our message
.print:
    lodsb                   ; load the byte at [si] into al, advance si
    test al, al             ; was it the terminating 0 byte?
    jz   .hang              ; yes → stop printing
    mov  ah, 0x0e           ; BIOS "teletype output" function
    int  0x10               ; ask the firmware to print al
    jmp  .print             ; next character
.hang:
    cli                     ; disable interrupts
    hlt                     ; halt the CPU
    jmp .hang               ; (safety) loop forever if it ever wakes

msg db "Booted with no OS!", 0
times 510 - ($ - $$) db 0   ; pad the file out to 510 bytes with zeros
dw 0xAA55                   ; the 2-byte signature firmware looks for`,
      lang: "asm",
      walkthrough: [
        "**`[bits 16]`** — x86 CPUs boot in an ancient 16-bit mode for compatibility. This tells NASM to assemble 16-bit instructions. Note the registers are `si`, `al`, `ah` (16-bit names).",
        "**`[org 0x7c00]`** — the firmware always loads a boot sector to memory address `0x7c00`, so we tell the assembler our code will live there; this makes labels point to the right addresses.",
        "**`lodsb`** — 'load string byte': copy the byte at address `si` into `al`, then bump `si` to the next byte. It's a compact way to walk through a string.",
        "**`test al, al` / `jz .hang`** — stop when we hit the terminating `0` byte (the same null-terminator idea as C strings).",
        "**`mov ah, 0x0e` / `int 0x10`** — `int 0x10` calls a BIOS service. With `ah = 0x0e` it's 'print the character in `al`'. There's no OS, but the firmware offers these primitive routines.",
        "**`cli` / `hlt`** — disable interrupts and halt. With nothing else to do, we stop the CPU rather than run off into random memory.",
        "**`times 510 - ($ - $$) db 0`** — pad with zeros until the file is 510 bytes. `$$` is the start of the section, `$` is here, so `$ - $$` is how much we've written so far.",
        "**`dw 0xAA55`** — the final 2 bytes. Firmware only treats a sector as bootable if it ends in this exact signature. Total: 512 bytes.",
      ],
      exercise:
        "Assemble it as a flat binary (no ELF wrapper) and boot it in the emulator:\n" +
        "  nasm -f bin boot.asm -o boot.bin\n" +
        "  qemu-system-x86_64 -drive format=raw,file=boot.bin\n" +
        "A QEMU window should open and print your message.",
      drills: [
        "Run `ls -l boot.bin` and confirm it is exactly 512 bytes.",
        "Change the message and re-boot it. (Edit → `nasm -f bin` → run QEMU.)",
        "Remove the `dw 0xAA55` line, rebuild, and watch QEMU refuse to boot it.",
        "Stretch: read the OSDev wiki's 'Babystep' pages and add code to switch the CPU from 16-bit real mode into 32-bit protected mode (this needs a GDT).",
      ],
      note:
        "OS payoff: this is 'bring-up'. There is no `printf`, no `malloc`, no `syscall` — those " +
        "are services an OS provides, and right now there is no OS. Everything above this " +
        "point, *you* build. Keep the OSDev wiki open beside this stage.",
    },

    /* -------------------------------------------------------------- 10 */
    {
      n: 10,
      title: "Interrupts & privilege rings",
      tag: "preemption",
      time: "4–6 days",
      payoff:
        "Multitasking is impossible unless something can forcibly take the CPU back from a " +
        "running program. That something is an **interrupt**. The interrupt table, the " +
        "ring 0 / ring 3 split between kernel and user code, and the timer interrupt are the " +
        "literal heartbeat of every preemptive operating system.",
      concepts: ["the IDT", "exceptions vs hardware IRQs", "ring 0 vs ring 3", "in / out ports", "the timer tick"],
      code:
`; A skeleton timer interrupt handler. (This runs inside the little kernel
; you started building in stage 9, NOT under Linux.)
isr_timer:
    push rax                ; the CPU already saved rip/cs/flags for us;
    push rcx                ; we save the general registers we will use
    push rdx
    ; --- a real kernel would call the scheduler about here ---
    mov  al, 0x20
    out  0x20, al           ; tell the interrupt controller "handled it"
    pop  rdx
    pop  rcx
    pop  rax
    iretq                   ; "interrupt return": restore rip/cs/flags, resume

; The CPU finds this handler through the IDT (Interrupt Descriptor Table):
; a 256-entry table where entry N holds the address of the handler for
; interrupt N, plus its privilege level. You fill the table, then load it
; with the  lidt  instruction.`,
      lang: "asm",
      walkthrough: [
        "An **interrupt** is the CPU stopping whatever it's doing to run a special handler — triggered by hardware (a key press, a timer) or by an error (divide-by-zero).",
        "**The IDT** (Interrupt Descriptor Table) is a 256-slot lookup table. Slot N stores the address of the routine to run for interrupt number N. You build it, then point the CPU at it with the **`lidt`** instruction.",
        "**`isr_timer:`** is one such handler ('ISR' = interrupt service routine). When the timer fires, the CPU automatically saves the interrupted code's `rip`/`cs`/`flags` and jumps here.",
        "**`push rax/rcx/rdx`** — we save any general registers we'll modify, because the interrupted program expects them untouched when it resumes. We restore them before returning.",
        "**`mov al, 0x20` / `out 0x20, al`** — `out` sends a byte to a hardware 'port' (a side channel to devices). This particular write tells the interrupt controller chip 'I've handled this interrupt', so it can deliver the next one.",
        "**`iretq`** — 'interrupt return'. It restores the `rip`/`cs`/`flags` the CPU saved and hands control back to whatever was interrupted, as if nothing happened.",
        "**Rings**: user programs run in ring 3 (restricted — no `out`, no `lidt`). The kernel runs in ring 0 (full power). An interrupt is one of the few ways to cross from ring 3 up into ring 0.",
      ],
      exercise:
        "In your hobby kernel: create one IDT entry pointing at `isr_timer`, load the table with " +
        "`lidt`, program the timer chip (PIT) to fire about 100 times a second, then run `sti` to " +
        "enable interrupts. Increment a counter inside the handler and print it — proof the CPU is " +
        "being interrupted on a clock.",
      drills: [
        "On plain Linux first, run `cat /proc/interrupts` and watch the timer and keyboard counts climb.",
        "Explain in one sentence why a user program is *not allowed* to run the `out` or `lidt` instructions.",
        "Add a second IDT entry for the keyboard (IRQ 1) that reads the pressed key from port `0x60`.",
        "What happens to the whole machine if your handler forgets the `out 0x20, al` acknowledgement? (Predict, then try it.)",
      ],
      note:
        "OS payoff: a timer interrupt traps from a running user program (ring 3) into the kernel " +
        "(ring 0), where the kernel can run the scheduler and switch to a different task. Take " +
        "that interrupt away and a single infinite loop would freeze the entire computer — that's " +
        "the fatal flaw of cooperative multitasking, and why preemption exists.",
    },

    /* -------------------------------------------------------------- 11 */
    {
      n: 11,
      title: "Memory management: paging",
      tag: "virtual memory",
      time: "5–7 days",
      payoff:
        "Back to the illusion stage 1 promised: that every process owns the whole address " +
        "space. **Paging** and a hardware unit called the MMU make that illusion real. Page " +
        "tables, the CR3 register, the TLB cache and page faults are how process isolation, " +
        "swapping and copy-on-write actually work.",
      concepts: ["virtual vs physical addresses", "page tables", "CR3 register", "the TLB", "page faults"],
      code:
`; Conceptual: how the CPU slices a 64-bit virtual address to translate it.
;
;  bits: 47..39   38..30   29..21   20..12   11..0
;        [ PML4 ][ PDPT ][  PD  ][  PT  ][ offset ]
;          9 bits each, indexing a 512-entry table at each level
;
; Each table entry holds a physical page address plus permission flags:
;   bit 0  P   present   (is this page actually mapped?)
;   bit 1  RW  writable
;   bit 2  US  user      (0 = kernel-only, 1 = usable by ring 3)
;   bit 63 NX  no-execute
;
; The CPU walks PML4 -> PDPT -> PD -> PT for EVERY memory access.
; You tell it where the top table lives by loading CR3:

    mov rax, pml4_phys      ; physical address of your top-level table
    mov cr3, rax            ; install this address space (also clears the TLB)`,
      lang: "asm",
      walkthrough: [
        "**Virtual vs physical**: the addresses your program uses are *virtual*. The actual RAM chips use *physical* addresses. The MMU translates one to the other on every single access.",
        "**Paging** chops memory into 4096-byte 'pages'. A **page table** is a big lookup that says 'virtual page X currently lives at physical page Y' — or 'X isn't mapped at all'.",
        "x86-64 uses **four levels** of tables (PML4 → PDPT → PD → PT) because one flat table would be enormous. The CPU uses 9 bits of the address to index each level, like following signposts.",
        "**The entry flags** matter for the OS: `P` (present) lets you mark a page as 'not in RAM right now'; `RW` controls writability; `US` enforces the kernel/user boundary; `NX` blocks executing data (a security win).",
        "**`mov cr3, rax`** — `CR3` is a control register that holds the *physical address of the top-level table*. Loading it installs an entire address space at once. This one instruction is how the kernel switches which process's memory is visible.",
        "**The TLB** is a small cache of recent translations, because walking four tables on every access would be slow. Changing `CR3` flushes it, which is why context switches have a real cost.",
      ],
      exercise:
        "On Linux first, build intuition with zero risk:\n" +
        "  cat /proc/self/maps          # each line is a mapped virtual range\n" +
        "  /usr/bin/time -v ./prog      # watch the 'page faults' count climb\n" +
        "Then, in your kernel: hand-build a top-level table that maps the first 2 MiB of virtual " +
        "memory onto the same physical memory, load `CR3`, and turn paging on. Deliberately touch an " +
        "unmapped address and catch the page fault.",
      drills: [
        "Compare `/proc/self/maps` for two different running programs and note they reuse the *same* low virtual addresses — yet never collide.",
        "Run `getconf PAGE_SIZE` and confirm it's 4096.",
        "In `/usr/bin/time -v`, find 'minor' vs 'major' page faults and read what each means.",
        "Explain in one sentence why giving two processes different `CR3` values makes them unable to read each other's memory.",
      ],
      note:
        "OS payoff: give each process its own `CR3` and they *physically cannot* see each other's " +
        "memory — that's process isolation. Mark a shared page read-only and copy it on the first " +
        "write — that's copy-on-write, the reason `fork` is cheap. The MMU is the hardware the " +
        "entire concept of a 'process' rests on.",
    },

    /* -------------------------------------------------------------- 12 */
    {
      n: 12,
      title: "Concurrency & context switching",
      tag: "the scheduler",
      time: "ongoing",
      payoff:
        "Tie it all together. A **context switch** is nothing more than saving one task's " +
        "registers and loading another's. **Atomic** instructions and memory barriers are how " +
        "multiple CPU cores agree on shared data. This stage is the scheduler, the mutex, and " +
        "the race condition — expressed in raw metal.",
      concepts: ["saving/restoring registers", "the context switch", "xchg / cmpxchg", "spinlocks", "memory barriers"],
      code:
`; A spinlock: the simplest possible lock, built from ONE atomic instruction.
; lock_acquire spins until it successfully grabs the lock.
section .data
    lock_var dq 0           ; 0 = free, 1 = held

global lock_acquire
lock_acquire:
.spin:
    mov  rax, 1
    xchg rax, [lock_var]    ; ATOMICALLY swap: rax <- old value, [lock] <- 1
    test rax, rax           ; was the old value 1 (already held)?
    jnz  .spin              ; yes → keep spinning until it's free
    ret                     ; no  → the old value was 0, we now own the lock

global lock_release
lock_release:
    mov  qword [lock_var], 0   ; store 0 to let someone else take the lock
    ret`,
      lang: "asm",
      walkthrough: [
        "**A lock** is a flag that says 'this shared thing is in use'. `lock_var` is 0 when free, 1 when held. The trick is grabbing it safely when many cores try at once.",
        "**`xchg rax, [lock_var]`** — `xchg` *swaps* a register and a memory location. Crucially, on x86 `xchg` with memory is **atomic**: no other core can sneak in between the read and the write.",
        "After the swap, `rax` holds the *old* value of the lock and the lock is now 1. **`test rax, rax` / `jnz .spin`**: if the old value was 1, someone else already held it, so we loop and try again.",
        "If the old value was 0, *we* are the one who flipped it to 1 — we own the lock — so we `ret`. Because the swap was atomic, exactly one core can win this race.",
        "**`lock_release`** just stores 0. Releasing is simple; it's *acquiring* safely that needs the atomic instruction.",
        "Why not a plain `mov` to read then write? Because two cores could both read 0 and both think they won. The atomic `xchg` is what makes the read-and-set indivisible.",
      ],
      exercise:
        "Write a context switch in about a dozen instructions: `switch(old_sp_ptr, new_sp)` should " +
        "push all callee-saved registers, save `rsp` into `*old_sp_ptr`, load `rsp` from `new_sp`, " +
        "pop those registers back, and `ret` — landing inside the *other* task. Then answer: exactly " +
        "what goes wrong if `lock_acquire` used `mov` instead of `xchg`? Construct the race.",
      drills: [
        "Explain why the stack is the perfect place to save a task's registers during a switch.",
        "Look up `cmpxchg` and describe how it differs from `xchg` (it compares first, then maybe swaps).",
        "On Linux, run a program twice and use `/usr/bin/time -v` to see 'voluntary' vs 'involuntary context switches'.",
        "Add a counter that two pretend-threads both increment without the lock, and reason about why the total can come out wrong.",
      ],
      note:
        "OS payoff: `xchg` carries an implicit lock so the swap is indivisible across cores — " +
        "without it, two CPUs can both read 0 and both 'acquire' the same lock, corrupting shared " +
        "state. The context switch you just wrote is the core of the scheduler; perform it on every " +
        "timer interrupt from stage 10 and you have preemptive multitasking. At that point, you " +
        "have built an operating system.",
    },
  ],
};
