export default async function compile(tape) {
  tape.clear();
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
      tape.editList(prompt("inserte un valor") % 256);
    },
  };
  const code = getCode();
  const stack = [];
  if (!evaluate(code)) return;
  for (let i = 0; i < code.length; i++) {
    console.log(stack);
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
  return document.querySelector("textarea.ide__editor").value;
}

function validate(char) {
  let valid = true;
  //todo
  return valid;
}
function evaluate(code) {
  for (let i = 0; i < code.length; i++) {
    if (!validate(code.charAt(i))) {
      alert("Compilation error");
      return false;
    }
  }
  return true;
}

function printValue(value) {
  console.log(value);
}
