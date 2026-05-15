const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render Tasks
function renderTasks() {

  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {

    if (currentFilter === "active") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  filteredTasks.forEach(task => {

    const li = document.createElement("li");
    li.classList.add("task");

    if (task.completed) {
      li.classList.add("completed");
    }

    li.setAttribute("data-id", task.id);

    li.innerHTML = `
      <span>${task.text}</span>

      <div class="task-actions">
        <button class="complete-btn">
          ${task.completed ? "Undo" : "Done"}
        </button>

        <button class="edit-btn">Edit</button>

        <button class="delete-btn">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Add Task
function addTask() {

  const text = taskInput.value.trim();

  if (text === "") {
    alert("Please enter a task");
    return;
  }

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();

  taskInput.value = "";
}

// Handle Task Actions using Event Delegation
taskList.addEventListener("click", (e) => {

  const li = e.target.closest(".task");

  if (!li) return;

  const id = Number(li.dataset.id);

  // DELETE
  if (e.target.classList.contains("delete-btn")) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
  }

  // COMPLETE
  if (e.target.classList.contains("complete-btn")) {

    tasks = tasks.map(task => {

      if (task.id === id) {
        return {
          ...task,
          completed: !task.completed
        };
      }

      return task;
    });

    saveTasks();
    renderTasks();
  }

  // EDIT
  if (e.target.classList.contains("edit-btn")) {

    const task = tasks.find(task => task.id === id);

    const updatedText = prompt("Edit task:", task.text);

    if (updatedText !== null && updatedText.trim() !== "") {

      task.text = updatedText.trim();

      saveTasks();
      renderTasks();
    }
  }
});

// Filter Tasks
filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    // Remove active class
    filterButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    // Add active class
    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();
  });
});

// Add Button Event
addBtn.addEventListener("click", addTask);

// Enter Key Support
taskInput.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {
    addTask();
  }
});

// Initial Render
renderTasks();