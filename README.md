# BrainF Simulator

A dependency-free browser simulator for a tape-based programming language. It visualizes cell values and the pointer while a program runs, and includes controls for speed, pause/resume, stepping, and moving backward through execution.

## Run locally

Serve the repository root over HTTP so the browser can load the ES modules:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. No build step or package installation is required.

## Project structure

- `index.html` defines the editor, tape, output, execution controls, and language guide.
- `main.js` connects the interface, validates editor input, and manages the tape and execution controls.
- `compile.js` validates programs, pairs loop brackets, executes instructions, and stores up to 1,000 history states for backward navigation.
- `tape.js` stores cell values and the current pointer.
- `tapeview.js` renders the tape and pointer in the DOM.
- `style.css` contains the dark theme and responsive layout.

## Execution controls

- **Run** validates the editor contents, resets the tape and output, then starts execution.
- **Pause / Resume** stops or continues the current run.
- **Step** executes one non-bracket instruction. Loop brackets are resolved internally.
- **Back** pauses execution and restores the previous instruction's tape, pointer, output, and program position.
- **Clear** empties the editor, resets the tape and output, and stops the current run.

The speed slider displays a percentage. Higher values reduce the delay between instructions; the resulting delay ranges from 1 ms at 100% to 1,000 ms at 0%. The history retains up to 1,000 states; older states are discarded when the limit is reached.

## Supported instructions

| Instruction | Behavior |
| --- | --- |
| `+` / `-` | Increment or decrement the current cell, wrapping between 0 and 255. |
| `>` / `<` | Move the pointer right or left. |
| `.` | Append the current cell as a character to the output. |
| `,` | Request a value and store it in the current cell. |
| `[` / `]` | Loop while the current cell is nonzero. Brackets must be balanced. |

The editor accepts only these eight instruction characters. Programs with invalid characters or unbalanced brackets are rejected before execution.

## Manual checks

There is no automated test runner configured. When changing the executor or interface, verify valid and invalid programs, nested loops, pause/resume, step and back behavior, the history limit, and clearing during execution.
