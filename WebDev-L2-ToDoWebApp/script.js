const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");

let tasks = JSON.parse(localStorage.getItem("myTasks") || "[]");

function save() {
  localStorage.setItem("myTasks", JSON.stringify(tasks));
}

function formatTime(time) {
  return new Date(time).toLocaleString([], {dateStyle:"medium", timeStyle:"short"});
}

function render() {
  pendingList.innerHTML = "";
  completedList.innerHTML = "";

  const pending = tasks.filter(task => !task.done);
  const completed = tasks.filter(task => task.done);

  pendingCount.textContent = `${pending.length} pending`;
  completedCount.textContent = `${completed.length} completed`;
  pendingEmpty.classList.toggle("hidden", pending.length !== 0);
  completedEmpty.classList.toggle("hidden", completed.length !== 0);

  pending.forEach(task => addTaskElement(task, pendingList));
  completed.forEach(task => addTaskElement(task, completedList));
}

function addTaskElement(task, parent) {
  const item = document.createElement("div");
  item.className = "task" + (task.done ? " completed" : "");

  const text = document.createElement("div");
  text.className = "task-text";
  text.textContent = task.text;

  const small = document.createElement("small");
  small.textContent = task.done && task.completedAt
    ? `Completed ${formatTime(task.completedAt)}`
    : `Added ${formatTime(task.createdAt)}`;
  text.appendChild(small);

  const toggle = document.createElement("button");
  toggle.textContent = task.done ? "Undo" : "Complete";
  toggle.addEventListener("click", () => {
    task.done = !task.done;
    task.completedAt = task.done ? Date.now() : null;
    save(); render();
  });

  const edit = document.createElement("button");
  edit.textContent = "Edit";
  edit.addEventListener("click", () => {
    const newText = prompt("Edit your task:", task.text);
    if (newText && newText.trim()) {
      task.text = newText.trim();
      save(); render();
    }
  });

  const remove = document.createElement("button");
  remove.textContent = "Delete";
  remove.addEventListener("click", () => {
    tasks = tasks.filter(item => item.id !== task.id);
    save(); render();
  });

  item.append(text, toggle, edit, remove);
  parent.appendChild(item);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) {
    input.focus();
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text: value,
    done: false,
    createdAt: Date.now(),
    completedAt: null
  });

  input.value = "";
  save();
  render();
  input.focus();
});

render();
