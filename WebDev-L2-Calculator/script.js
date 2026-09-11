const display = document.getElementById("display");
const history = document.getElementById("history");
const buttons = document.querySelectorAll(".keys button");

let current = "0";
let previous = null;
let operator = null;
let waitingForNumber = false;

function update() {
  display.textContent = current;
}

function inputNumber(value) {
  if (waitingForNumber) {
    current = value === "." ? "0." : value;
    waitingForNumber = false;
    return update();
  }

  if (value === "." && current.includes(".")) return;
  if (current === "0" && value !== ".") current = value;
  else if (current.length < 14) current += value;
  update();
}

function chooseOperator(nextOperator) {
  const value = Number(current);

  if (operator && waitingForNumber) {
    operator = nextOperator;
    return;
  }

  if (previous === null) previous = value;
  else if (operator) {
    const result = calculate(previous, value, operator);
    if (result === null) return;
    current = String(result);
    previous = result;
    update();
  }

  operator = nextOperator;
  waitingForNumber = true;
  history.textContent = `${current} ${nextOperator}`;
}

function calculate(a, b, op) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? null : a / b;
  return b;
}

function equals() {
  if (operator === null || previous === null) return;
  const a = previous, b = Number(current);
  if (operator === "/" && b === 0) {
    current = "Cannot divide by 0";
    previous = null; operator = null; waitingForNumber = true;
    return update();
  }
  const result = calculate(a, b, operator);
  history.textContent = `${a} ${operator} ${b} =`;
  current = String(Number(result.toFixed(10)));
  previous = null; operator = null; waitingForNumber = true;
  update();
}

function clearAll() {
  current = "0"; previous = null; operator = null; waitingForNumber = false;
  history.textContent = ""; update();
}

function backspace() {
  if (waitingForNumber || current === "Cannot divide by 0") return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
  update();
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    const action = button.dataset.action;
    if (value !== undefined) {
      if ("+-*/".includes(value)) chooseOperator(value);
      else inputNumber(value);
    } else if (action === "equals") equals();
    else if (action === "clear") clearAll();
    else if (action === "backspace") backspace();
  });
});

document.addEventListener("keydown", event => {
  if (/^[0-9.]$/.test(event.key)) inputNumber(event.key);
  else if ("+-*/".includes(event.key)) chooseOperator(event.key);
  else if (event.key === "Enter" || event.key === "=") equals();
  else if (event.key === "Escape") clearAll();
  else if (event.key === "Backspace") backspace();
});
