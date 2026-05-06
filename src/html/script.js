const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const filterButtons = document.querySelectorAll('[data-filter]');
const themeToggle = document.getElementById('theme-toggle');

const FILTERS = {
  ALL: 'all',
  COMPLETED: 'completed',
  PENDING: 'pending',
};

let activeFilter = FILTERS.ALL;
const tasks = [];

function getVisibleTasks() {
  return tasks.filter((task) => {
    if (activeFilter === FILTERS.COMPLETED) {
      return task.completed;
    }

    if (activeFilter === FILTERS.PENDING) {
      return !task.completed;
    }

    return true;
  });
}

function updateFilterButtons() {
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === activeFilter);
  });
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    taskCount.textContent = 'No tasks yet.';
    return;
  }

  if (visibleTasks.length === 0) {
    taskCount.textContent = 'No tasks match this filter.';
    const emptyState = document.createElement('li');
    emptyState.className = 'empty-state';
    emptyState.textContent = 'No tasks found for the selected filter.';
    taskList.appendChild(emptyState);
    return;
  }

  taskCount.textContent = `${visibleTasks.length} ${visibleTasks.length === 1 ? 'task' : 'tasks'} ${activeFilter === FILTERS.ALL ? 'total' : activeFilter}`;

  visibleTasks.forEach((task) => {
    const listItem = document.createElement('li');
    listItem.className = `task-item${task.completed ? ' completed' : ''}`;
    listItem.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`);
    checkbox.addEventListener('change', () => toggleComplete(task.id));

    const content = document.createElement('div');
    content.className = 'task-content';

    const title = document.createElement('p');
    title.className = 'task-title';
    title.textContent = task.title;

    const meta = document.createElement('p');
    meta.className = 'task-meta';
    meta.textContent = task.completed ? 'Completed' : 'In progress';

    content.append(title, meta);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.innerHTML = 'Remove';
    deleteButton.addEventListener('click', () => deleteTask(task.id));
    deleteButton.setAttribute('aria-label', `Remove ${task.title}`);

    actions.appendChild(deleteButton);
    listItem.append(checkbox, content, actions);
    taskList.appendChild(listItem);
  });
}

function addTask(title) {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    taskInput.focus();
    return;
  }

  const task = {
    id: Date.now().toString(),
    title: normalizedTitle,
    completed: false,
  };

  tasks.unshift(task);
  taskInput.value = '';
  taskInput.focus();
  renderTasks();
}

function deleteTask(taskId) {
  const index = tasks.findIndex((task) => task.id === taskId);
  if (index === -1) return;

  tasks.splice(index, 1);
  renderTasks();
}

function toggleComplete(taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  renderTasks();
}

function setFilter(filter) {
  if (!Object.values(FILTERS).includes(filter)) return;

  activeFilter = filter;
  updateFilterButtons();
  renderTasks();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark = document.body.classList.contains('dark-mode');
  themeToggle.querySelector('.theme-icon').textContent = isDark ? '☀️' : '🌙';
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

themeToggle.addEventListener('click', toggleTheme);

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const trimmedValue = taskInput.value.trim();
  if (!trimmedValue) {
    taskInput.focus();
    return;
  }
  addTask(trimmedValue);
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  updateThemeIcon();
  updateFilterButtons();
  renderTasks();
});
