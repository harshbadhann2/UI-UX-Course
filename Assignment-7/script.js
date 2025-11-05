const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskDescriptionInput = document.getElementById("task-description");
const taskList = document.getElementById("task-list");

let tasks = [];
let currentFilter = "all";

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();

  if (title === "") {
    alert("Task title cannot be empty!");
    return;
  }

  const task = {
    id: Date.now(),
    title,
    description,
    completed: false,
  };

  tasks.push(task);
  renderTasks();
  updateStats();
  taskForm.reset();
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    currentFilter = this.dataset.filter;
    renderTasks();
  });
});

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  } else if (currentFilter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p class="empty-msg">No tasks found!</p>';
    return;
  }

  filteredTasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = `task ${task.completed ? "completed" : ""}`;

    taskDiv.innerHTML = `
      <div class="task-content">
        <input type="checkbox" ${task.completed ? "checked" : ""}>
        <div class="task-text">
          <h3>${task.title}</h3>
          ${task.description ? `<p>${task.description}</p>` : ""}
        </div>
      </div>
      <div class="task-actions">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    const checkbox = taskDiv.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", function () {
      task.completed = !task.completed;
      renderTasks();
      updateStats();
    });

    const editBtn = taskDiv.querySelector(".edit-btn");
    editBtn.addEventListener("click", function () {
      const newTitle = prompt("Edit task title:", task.title);
      if (newTitle && newTitle.trim()) {
        task.title = newTitle.trim();
        const newDesc = prompt("Edit description:", task.description);
        task.description = newDesc ? newDesc.trim() : "";
        renderTasks();
      }
    });

    const deleteBtn = taskDiv.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function () {
      if (confirm("Delete this task?")) {
        tasks = tasks.filter((t) => t.id !== task.id);
        renderTasks();
        updateStats();
      }
    });

    taskList.appendChild(taskDiv);
  });
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  document.getElementById("total-tasks").textContent = total;
  document.getElementById("completed-tasks").textContent = completed;
}
