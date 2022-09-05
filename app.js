//Define UI variables

const form = document.querySelector(".task-insertion-form");
const taskList = document.querySelector(".tasks-collection");
const clearBtn = document.querySelector(".btn-clear-task");
const filter = document.querySelector(".input-filter-task");
const taskInput = document.querySelector(".input-add-task");

let liDragged, liId, liIndex, liIndexDrop, liList;

let taskListCountId = [];
let idToAddList;

//Load all event listeners
loadEventListeners();

function loadEventListeners() {
  //DOM Load Event
  document.addEventListener('DOMContentLoaded', getTasks);

  //Add task event
  form.addEventListener("submit", addTask);

  //Remove task event (we have to assign to ul, as li element are dynamic)
  taskList.addEventListener("click", removeTask);

  //Clear task event
  clearBtn.addEventListener("click", clearTask);

  //Filter tasks event
  filter.addEventListener("keyup", filterTasks);
}

//Add task
function addTask(e) {
  e.preventDefault();

  if (taskInput.value === "") {
    return alert("Please add a task");
  }

  createTaskOnDOM(taskInput.value);

  //Store in Local Storage
  storeTaskInLocalStorage(taskInput.value);
}

//Store task
function storeTaskInLocalStorage(task){
    let tasks;

    if (localStorage.getItem('tasks') === null){
        tasks = [];
    }
    else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.push(task);

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//Get tasks from LS
function getTasks(){
    let tasks;

    if (localStorage.getItem('tasks') === null){
        tasks = [];
    }
    else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    for (var item of tasks){
        createTaskOnDOM(item);
    }
}

function createTaskOnDOM(task){
  //Create li element
  const li = document.createElement("li");
  li.className = "collection-item dropzone";
  li.draggable = true;

  if (taskListCountId.length === 0) {
    taskListCountId.push(0);
    li.id = "0";
  } else {
    idToAddList = taskListCountId[taskListCountId.length - 1] + 1;
    li.id = idToAddList.toString(); // last element of array
    taskListCountId.push(idToAddList);
  }

  //Create text node and append to li
  li.appendChild(document.createTextNode(task));

  //Create new link element
  const link = document.createElement("a");
  link.className = "delete-item";

  //Add icon html
  link.innerHTML = '<i class="material-icons">delete</i>';

  //Append the link to li
  li.appendChild(link);

  //Append li element to ul
  taskList.appendChild(li);
}

function removeTask(e) {
  //Target the delete item, li element
  if (e.target.parentElement.classList.contains("delete-item")) {
    if (confirm("Do you really want to remove it?")) {
      e.target.parentElement.parentElement.remove();

      //Remove from Local Storage
      removeTaskFromLocalStorage(e.target.parentElement.parentElement.firstChild);
    }
  }
}

function removeTaskFromLocalStorage(taskItem){
    let tasks;

    if (localStorage.getItem('tasks') === null){
        tasks = [];
    }
    else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }

    tasks.forEach(function(task, index){
        if(taskItem.textContent === task){
            tasks.splice(index, 1);
        }
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearTask(e) {
  //taskList.innerHTML = '';

  //Faster method
  while (taskList.firstChild) {
    taskList.removeChild(taskList.firstChild);
  }

  clearAllTasksFromLocalStorage();
}

function clearAllTasksFromLocalStorage(){
    let tasks = [];

    if (localStorage.getItem('tasks') != null){
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    //we can also do this way
    //localStorage.clear();
}


function filterTasks(e) {
  const text = e.target.value.toLowerCase();

  document.querySelectorAll(".collection-item").forEach(function (task) {
    const item = task.firstChild.textContent;

    if (item.toLowerCase().indexOf(text) != -1) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
}

taskList.addEventListener("dragstart", ({ target }) => {
  liDragged = target;
  liId = target.id;
  liList = target.parentNode.children;

  for (let i = 0; i < liList.length; i += 1) {
    if (liList[i] === liDragged) {
      liIndex = i;
    }
  }
});

taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
});

taskList.addEventListener("drop", ({ target }) => {
  if (target.className == "collection-item dropzone" && target.id !== liId) {
    liDragged.remove(liDragged);

    for (let i = 0; i < liList.length; i += 1) {
      if (liList[i] === target) {
        liIndexDrop = i;
      }
    }

    if (liIndex > liIndexDrop) {
      target.before(liDragged);
    } else {
      target.after(liDragged);
    }
  }
});
