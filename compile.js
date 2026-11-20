export default async function compile(tape) {
  clear(tape);
  const operations = {
    "+": () => {
      tape.editList((tape.current() + 1) % 256);
    },
    "-": () => {
      tape.editList(tape.current() - 1 < 0 ? 255 : tape.current() - 1);
    },
    ">": () => {
      tape.setPointer(
        tape.pointer() + 1 > tape.size() ? tape.pointer() : tape.pointer() + 1
      );
    },
    "<": () => {
      tape.setPointer(
        tape.pointer() - 1 < 0 ? tape.pointer() : tape.pointer() - 1
      );
    },
    ".": () => {
      printValue(tape.current());
    },
    ",": () => {
      tape.editList(Math.abs(prompt("inserte un valor")) % 256);
    },
  };
  const code = getCode();
  const stack = [];
  if (!evaluate(code)) return;
  for (let i = 0; i < code.length; i++) {
    if (code.charAt(i) === "[") {
      if (tape.current() === 0) {
        stack.pop();
      } else stack.push(i);
    } else if (code.charAt(i) === "]") {
      if (tape.current() !== 0) {
        i = stack[stack.length - 1];
      } else {
        stack.pop();
      }
    } else {
      await sleep(1000);
      operations[code.charAt(i)]();
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCode() {
  return document.querySelector("textarea#text-editor").value;
}

function validate(char) {
  return /^[+\-<>.,\[\]]$/.test(char);
}
function evaluate(code) {
  const brackets = [];
  for (let i = 0; i < code.length; i++) {
    if (!validate(code.charAt(i))) {
      showError(`Carácter no válido: "${code.charAt(i)}".`);
      return false;
    }

    if (code.charAt(i) === "[") {
      brackets.push(i);
    } else if (code.charAt(i) === "]" && brackets.pop() === undefined) {
      showError("Programa inválido: hay un ] sin su [ correspondiente.");
      return false;
    }
  }

  if (brackets.length > 0) {
    showError("Programa inválido: falta un ] para cerrar un bucle.");
    return false;
  }
  return true;
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
