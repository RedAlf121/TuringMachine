const MAX_HISTORY = 1000;

const operations = {
  "+": (tape) => tape.editList((tape.current() + 1) % 256),
  "-": (tape) => tape.editList(tape.current() - 1 < 0 ? 255 : tape.current() - 1),
  ">": (tape) => {
    tape.setPointer(
      tape.pointer() + 1 > tape.size() ? tape.pointer() : tape.pointer() + 1
    );
  },
  "<": (tape) => {
    tape.setPointer(
      tape.pointer() - 1 < 0 ? tape.pointer() : tape.pointer() - 1
    );
  },
  ".": (tape) => printValue(tape.current()),
  ",": (tape) => {
    tape.editList(Math.abs(prompt("Enter a value")) % 256);
  },
};

export default function compile(tape, options = {}) {
  clear(tape);
  const code = getCode();
  const bracketPairs = evaluate(code);
  if (!bracketPairs) return null;

  return new ExecutionController(tape, code, bracketPairs, options);
}

export class ExecutionController {
  constructor(tape, code, bracketPairs, { delayMs = 250, onStateChange = () => {} } = {}) {
    this.tape = tape;
    this.code = code;
    this.bracketPairs = bracketPairs;
    this.delayMs = delayMs;
    this.onStateChange = onStateChange;
    this.instructionPointer = 0;
    this.status = "ready";
    this.timer = null;
    this.stepRequested = false;
    this.isResolvingStep = false;
    this.history = [this._createSnapshot()];
  }

  start() {
    if (this.status !== "ready") return;
    this.status = "running";
    this._notify();
    this._advance();
  }

  pause() {
    if (this.status !== "running" && !this.stepRequested && !this.isResolvingStep) return;
    this._clearTimer();
    this.stepRequested = false;
    this.isResolvingStep = false;
    this.status = "paused";
    this._notify();
  }

  resume() {
    if (this.status !== "paused" || this.stepRequested || this.isResolvingStep) return;
    this.status = "running";
    this._notify();
    this._advance();
  }

  step() {
    if (this.status !== "paused" || this.stepRequested || this.isResolvingStep) return;
    this.stepRequested = true;
    this.isResolvingStep = false;
    this._notify();
    this._advance();
  }

  back() {
    if (this.status === "running" || this.stepRequested || this.isResolvingStep) {
      this._clearTimer();
      this.stepRequested = false;
      this.isResolvingStep = false;
      this.status = "paused";
    }

    if (this.history.length <= 1) {
      this._notify();
      return;
    }

    this.history.pop();
    this._restoreSnapshot(this.history[this.history.length - 1]);
    this.status = "paused";
    this._notify();
  }

  stop() {
    this._clearTimer();
    this.stepRequested = false;
    this.isResolvingStep = false;
    this.status = "stopped";
    this._notify();
  }

  setDelay(delayMs) {
    this.delayMs = delayMs;
  }

  getState() {
    return {
      status: this.status,
      isStepping: this.stepRequested || this.isResolvingStep,
      canStep: this.status === "paused" && !this.stepRequested && !this.isResolvingStep,
      canGoBack: this.history.length > 1,
    };
  }

  _advance() {
    if (this.status !== "running" && !this.stepRequested && !this.isResolvingStep) return;

    if (this.instructionPointer >= this.code.length) {
      this.stepRequested = false;
      this.isResolvingStep = false;
      this.status = "completed";
      this._notify();
      return;
    }

    const instruction = this.code[this.instructionPointer];
    if (instruction === "[") {
      this.instructionPointer =
        this.tape.current() === 0
          ? this.bracketPairs.get(this.instructionPointer) + 1
          : this.instructionPointer + 1;
      this._schedule(0, () => this._advance());
      return;
    }

    if (instruction === "]") {
      this.instructionPointer =
        this.tape.current() !== 0
          ? this.bracketPairs.get(this.instructionPointer) + 1
          : this.instructionPointer + 1;
      this._schedule(0, () => this._advance());
      return;
    }

    if (this.isResolvingStep) {
      this.isResolvingStep = false;
      this.status = "paused";
      this._notify();
      return;
    }

    const delay = this.stepRequested ? 0 : this.delayMs;
    this._schedule(delay, () => this._execute(instruction));
  }

  _execute(instruction) {
    operations[instruction](this.tape);
    this.instructionPointer += 1;
    this.history.push(this._createSnapshot());
    if (this.history.length > MAX_HISTORY) this.history.shift();

    if (this.stepRequested) {
      this.stepRequested = false;
      this.isResolvingStep = true;
      this._notify();
      this._advance();
      return;
    }

    this._notify();
    this._advance();
  }

  _schedule(delay, callback) {
    this.timer = setTimeout(() => {
      this.timer = null;
      if (this.status !== "running" && !this.stepRequested && !this.isResolvingStep) return;
      callback();
    }, delay);
  }

  _clearTimer() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  _createSnapshot() {
    const result = document.querySelector(".result");
    return {
      instructionPointer: this.instructionPointer,
      cells: this.tape.list().slice(),
      pointer: this.tape.pointer(),
      outputLength: result.children.length - 1,
    };
  }

  _restoreSnapshot(snapshot) {
    const cells = this.tape.list();
    snapshot.cells.forEach((value, index) => {
      cells[index] = value;
    });
    this.tape.setPointer(snapshot.pointer);

    const result = document.querySelector(".result");
    while (result.children.length > snapshot.outputLength + 1) {
      result.removeChild(result.lastChild);
    }
    this.instructionPointer = snapshot.instructionPointer;
  }

  _notify() {
    this.onStateChange(this.getState());
  }
}

function getCode() {
  return document.querySelector("textarea#text-editor").value;
}

function validate(char) {
  return /^[+\-<>.,\[\]]$/.test(char);
}

function evaluate(code) {
  const openBrackets = [];
  const bracketPairs = new Map();
  for (let i = 0; i < code.length; i++) {
    const instruction = code.charAt(i);
    if (!validate(instruction)) {
      showError(`Invalid character: "${instruction}".`);
      return null;
    }

    if (instruction === "[") {
      openBrackets.push(i);
    } else if (instruction === "]") {
      const opening = openBrackets.pop();
      if (opening === undefined) {
        showError("Invalid program: unmatched closing bracket ']' (missing '[').");
        return null;
      }
      bracketPairs.set(opening, i);
      bracketPairs.set(i, opening);
    }
  }

  if (openBrackets.length > 0) {
    showError("Invalid program: missing closing ']' for a loop.");
    return null;
  }

  return bracketPairs;
}

function showError(message) {
  const result = document.querySelector(".result");
  const error = document.createElement("span");
  error.className = "result-error";
  error.textContent = message;
  result.appendChild(error);
}

function printValue(value) {
  const result = document.querySelector(".result");
  const printedValue = document.createElement("span");
  printedValue.textContent = String.fromCharCode(value);
  result.appendChild(printedValue);
}

export function clear(tape) {
  tape.clear();
  const result = document.querySelector(".result");
  while (result.children.length > 1) {
    result.removeChild(result.lastChild);
  }
}
