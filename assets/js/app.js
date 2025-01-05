// Elements selection
const bodyEl = document.body;

// Data
const storage = localStorage.getItem("appData");
// console.log(storage);

// Check if storage.todos is available instead of storage to avoid conflicts with other storage with the same host in github pages
const appState = storage?.todos ? JSON.parse(storage) : { todos: [] };
// console.log(appState);

const widnowWidth = window.innerWidth;
// console.log(widnowWidth);

let isScreenDesktop = widnowWidth > 586;

// Saves dragged data for drop event handler
let dragged = {};

// Functions
/**
 * Saves the provided data to the local storage under the key "appData".
 *
 * @param {Object} data - The data to be saved to local storage.
 */
const saveToLocalStorage = function (data) {
  localStorage.setItem("appData", JSON.stringify(data));
};

/**
 * Returns the maximum id from an array of todo objects.
 *
 * @param {Array} todos - The array of todo objects.
 * @param {number} todos[].id - The id of a todo object.
 * @returns {number} The maximum id found in the array of todos.
 */
const getMaxId = todos => Math.max(...todos.map(todo => todo.id));

/**
 * Returns the maximum id from an array of todo objects.
 *
 * @param {Array} todos - The array of todo objects.
 * @param {number} todos[].id - The id of a todo object.
 * @returns {number} The maximum id found in the array of todos.
 */
const getActiveTodos = todos => todos.filter(todo => !todo.isCompleted);

/**
 * Returns an array of completed todo items from the provided array of todos.
 *
 * @param {Array} todos - The array of todo objects.
 * @param {boolean} todos[].isCompleted - The completion status of a todo item.
 * @returns {Array} An array of completed todo items.
 */
const getCompletedTodos = todos => todos.filter(todo => todo.isCompleted);

/**
 * Returns the number of active todos.
 *
 * @param {Array} activeTodos - An array of active todo items.
 * @returns {number} The number of active todo items.
 */
const getActiveTodosNum = activeTodos => activeTodos.length;

/**
 * Renders the number of active todos into the provided HTML element.
 *
 * @param {HTMLElement} elToRender - The HTML element where the number of active todos will be displayed.
 */
const renderActiveTodosNum = (todos, elToRender) =>
  (elToRender.textContent = getActiveTodosNum(getActiveTodos(todos)));

/**
 * Retrieves an object from an array of todos based on the data-id attribute of a given element.
 *
 * @param {Array} todos - The array of todo objects.
 * @param {HTMLElement} el - The HTML element with a data-id attribute.
 * @returns {Object|undefined} The todo object with the matching id, or undefined if not found.
 */
const getObjFromEl = function (todos, el) {
  const elId = +el.dataset.id;

  return todos.find(todo => todo.id === elId);
};

/**
 * Makes a todo item completed by updating its completion status and CSS class.
 *
 * @param {HTMLElement} el - The DOM element representing the todo item.
 * @param {Object} todo - The todo item object.
 */
const makeItemCompleted = function (el, todo) {
  todo.isCompleted = true;

  if (activeBtn.classList.contains("active")) {
    el.remove();
    return;
  }

  el.classList.replace("active-item", "complete-item");
};

/**
 * Makes a todo item active by updating its completion status and CSS class.
 *
 * @param {HTMLElement} el - The DOM element representing the todo item.
 * @param {Object} todo - The todo item object.
 */
const makeItemActive = function (el, todo) {
  todo.isCompleted = false;

  if (completedBtn.classList.contains("active")) {
    el.remove();
    return;
  }

  el.classList.replace("complete-item", "active-item");
};

/**
 * Removes an object from an array of objects.
 *
 * @param {Array} objsArr - The array of objects.
 * @param {Object} obj - The object to be removed from the array.
 */
const removeObj = function (objsArr, obj) {
  const removingIndex = objsArr.indexOf(obj);

  objsArr.splice(removingIndex, 1);
};

/**
 * Deactivates a list of elements by removing the "active" class from each element.
 *
 * @param {HTMLElement[]} els - An array of HTML elements to deactivate.
 */
const deActivateEls = function (els) {
  els.forEach(el => el.classList.remove("active"));
};

/**
 * Changes the active tab by deactivating all buttons, activating the clicked button,
 * clearing the items wrapper element, and rendering the todos.
 *
 * @param {HTMLElement} btnClicked - The button element that was clicked.
 * @param {NodeListOf<HTMLElement>} btns - A NodeList of all button elements.
 * @param {HTMLElement} itemsWrapperEl - The element that wraps the todo items.
 * @param {Array} todos - An array of todo items to be rendered.
 */
const changeActiveTab = function (btnClicked, btns, itemsWrapperEl, todos) {
  if (btnClicked.classList.contains("active")) return;

  deActivateEls(btns);

  btnClicked.classList.add("active");

  itemsWrapperEl.innerHTML = "";

  renderTodos(todos, itemsWrapperEl);
};

/**
 * Renders the initial HTML structure for the todo app.
 *
 * @param {HTMLElement} initHTMLWrapper - The wrapper element where the initial HTML will be inserted.
 */
const renederInitHTML = function (initHTMLWrapper) {
  const initHTML = `
    <div class="wallpaper-bg"></div>

  <main class="main-container">
    <div class="title-theme-wrapper">
      <h1 class="title">TODO</h1>
      <div class="theme">
        <svg class="theme-icon" xmlns="http://www.w3.org/2000/svg" width="26" height="26">
          <path fill="#FFF" fill-rule="evenodd"
            d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z" />
        </svg>
      </div>
    </div>
    <form class="add-item" action="">
      <button type="submit" class="circle-wrapper submit-new-item">
        <span class="circle"></span>
      </button>
      <input type="text" class="add-item-field" placeholder="Create a new todo...">

    </form>
    <div class="items-status-wrapper">
      <div class="items-wrapper">
      </div>
      <div class="status-bar">
        <div class="narrow-text items-remaining"><span>${getActiveTodosNum(
          getActiveTodos(appState.todos)
        )}</span> items left</div>
        ${
          isScreenDesktop
            ? `<div class="filter-items">
          <button id="all-btn" class="filter-item-btn active">All</button>
          <button id="active-btn" class="filter-item-btn">Active</button>
          <button id="completed-btn" class="filter-item-btn">Completed</button>
        </div>`
            : ""
        }
        <button class="narrow-text clear-completed-items">Clear Completed</button>
      </div>
    </div>
${
  !isScreenDesktop
    ? `<div class="filter-items">
      <button class="filter-item-btn active">All</button>
      <button class="filter-item-btn">Active</button>
      <button class="filter-item-btn">Completed</button>
    </div> `
    : ""
}
    <h4 class="narrow-text reorder-items-text">Drag and drop to reorder list</h4>
  </main>
    `;

  initHTMLWrapper.insertAdjacentHTML("afterbegin", initHTML);
};

/**
 * Renders a todo item as HTML and inserts it into the specified element.
 *
 * @param {Object} todo - The todo item to render.
 * @param {string} todo.id - The unique identifier of the todo item.
 * @param {string} todo.text - The text content of the todo item.
 * @param {boolean} todo.isCompleted - Indicates whether the todo item is completed.
 * @param {HTMLElement} elToRender - The DOM element to render the todo item into.
 */
const renderTodo = function (todo, elToRender) {
  const todoHTML = `
        <div class="item ${
          todo.isCompleted ? "complete-item" : "active-item"
        }" data-id="${todo.id}" draggable="true">
          <button class="circle-wrapper check-item">
            <span class="circle"></span>
          </button>
          <span class="item-text">${todo.text}</span>
          <div class="close-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path fill="#494C6B" fill-rule="evenodd"
                d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z" />
            </svg>
          </div>
        </div>
    `;

  elToRender.insertAdjacentHTML("beforeend", todoHTML);
};

/**
 * Renders a list of todo items.
 *
 * @param {Array} todos - The array of todo objects to render.
 * @param {HTMLElement} elToRender - The HTML element where the todos will be rendered.
 */
const renderTodos = function (todos, elToRender) {
  todos.forEach(todo => renderTodo(todo, elToRender));
};

/**
 * Re-renders the todo items based on the active filter button.
 *
 * @param {Array} todos - The list of todo items.
 * @param {Array} filterBtns - The list of filter buttons.
 */
const reRenderTodos = function (todos, filterBtns, itemsWrapperEl) {
  const activeBtn = filterBtns.find(btn => btn.classList.contains("active"));

  const activeTodos = getActiveTodos(todos);
  const completedTodos = getCompletedTodos(todos);

  itemsWrapperEl.innerHTML = "";

  if (activeBtn.id === "all-btn") renderTodos(todos, itemsWrapperEl);
  if (activeBtn.id === "active-btn") renderTodos(activeTodos, itemsWrapperEl);
  if (activeBtn.id === "completed-btn")
    renderTodos(completedTodos, itemsWrapperEl);
};

const reorderItems = function (todos, draggedInfo, droppedInfo) {
  const {
    el: draggedEl,
    obj: draggedObj,
    yCoords: draggedYCoords,
  } = draggedInfo;

  const {
    el: droppedEl,
    obj: droppedObj,
    yCoords: droppedYCoords,
  } = droppedInfo;

  const draggedObjIndex = todos.indexOf(draggedObj);
  const droppedObjIndex = todos.indexOf(droppedObj);

  // Remove dragged object from todos to reinsert it in the new position
  todos.splice(draggedObjIndex, 1);

  if (draggedYCoords < droppedYCoords) {
    // Insert dragged el/object after the dropped el/object
    droppedEl.after(draggedEl);
    todos.splice(droppedObjIndex + 1, 0, draggedObj);
  } else {
    // Insert dragged el/object before the dropped el/object
    droppedEl.before(draggedEl);
    todos.splice(droppedObjIndex, 0, draggedObj);
  }
};

/**
 * Initializes the application by rendering the initial HTML and todos.
 *
 * @param {Array} todos - An array of todo items to be rendered.
 */
const init = function (todos) {
  renederInitHTML(bodyEl);

  if (todos.length === 0) return;

  const itemsWrapperEl = document.querySelector(".items-wrapper");
  renderTodos(todos, itemsWrapperEl);
};

init(appState.todos);

// Elements selection (here after init HTML rendered)
const filterItemsEl = document.querySelector(".filter-items");
const reorderItemsTextEl = document.querySelector(".reorder-items-text");
const itemsRemainingEl = document.querySelector(".items-remaining");
const themeEl = document.querySelector(".theme");
const itemsWrapperEl = document.querySelector(".items-wrapper");
const addItemFrom = document.querySelector(".add-item");
const addTodoBtn = document.querySelector(".submit-new-item");
const addTodoField = document.querySelector(".add-item-field");
const itemsRemainingNumEl = document.querySelector(".items-remaining span");
const allBtn = document.querySelector("#all-btn");
const activeBtn = document.querySelector("#active-btn");
const completedBtn = document.querySelector("#completed-btn");
const filterBtns = [...document.querySelectorAll(".filter-item-btn")];
const clearCompletedBtn = document.querySelector(".clear-completed-items");

// Event listeners
// Change layout when screen switches to desktop/screen mode
window.addEventListener("resize", function (e) {
  const windowWidth = window.innerWidth;

  if (windowWidth <= 586 && isScreenDesktop) {
    isScreenDesktop = false;

    reorderItemsTextEl.before(filterItemsEl);
  }

  if (windowWidth > 586 && !isScreenDesktop) {
    isScreenDesktop = true;

    itemsRemainingEl.after(filterItemsEl);
  }
});

// Change page theme when moon/sun icon is clicked
themeEl.addEventListener("click", function () {
  bodyEl.classList.toggle("light");

  const themeSvgHTML = bodyEl.classList.contains("light")
    ? `
    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fill-rule="evenodd" d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"/></svg>
    `
    : `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path fill="#FFF" fill-rule="evenodd" d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"/></svg> `;

  this.innerHTML = themeSvgHTML;
});

// Add a new todo item when the "Circle" button is clicked
// addTodoBtn.addEventListener("click", function (e) {
// Add a new todo item when the form is clicked (by clicking the "Circle" button or pressing Enter)
addItemFrom.addEventListener("submit", function (e) {
  e.preventDefault();

  const todoText = addTodoField.value.trim();

  if (todoText === "") return;

  const maxId = appState.todos.length > 0 ? getMaxId(appState.todos) : 0;

  const newTodo = {
    id: maxId + 1,
    text: todoText,
    isCompleted: false,
  };
  // console.log(newTodo);

  appState.todos.push(newTodo);

  renderTodo(newTodo, itemsWrapperEl);

  addTodoField.value = "";

  renderActiveTodosNum(appState.todos, itemsRemainingNumEl);

  saveToLocalStorage(appState);
});

// Mark a todo item as completed when the "Circle" button is clicked
itemsWrapperEl.addEventListener("click", function (e) {
  const clickedEl = e.target;

  // Mathing strategy
  if (!clickedEl.closest(".check-item")) return;

  const checkingItemEl = clickedEl.closest(".item");

  const checkedItemObj = getObjFromEl(appState.todos, checkingItemEl);

  if (checkingItemEl.classList.contains("active-item"))
    makeItemCompleted(checkingItemEl, checkedItemObj);
  else makeItemActive(checkingItemEl, checkedItemObj);

  renderActiveTodosNum(appState.todos, itemsRemainingNumEl);

  saveToLocalStorage(appState);
});

// Remove a todo item when the "Close" button is clicked
itemsWrapperEl.addEventListener("click", function (e) {
  const clickedEl = e.target;

  // Mathing strategy
  if (!clickedEl.closest(".close-icon")) return;

  const removingItemEl = clickedEl.closest(".item");
  const removingItemObj = getObjFromEl(appState.todos, removingItemEl);

  removingItemEl.remove();
  removeObj(appState.todos, removingItemObj);

  renderActiveTodosNum(appState.todos, itemsRemainingNumEl);

  saveToLocalStorage(appState);
});

// Show all todos when "All" button is clicked
allBtn.addEventListener("click", function (e) {
  const allBtn = e.target;

  changeActiveTab(allBtn, filterBtns, itemsWrapperEl, appState.todos);
});

// Show active todos when "Active" button is clicked
activeBtn.addEventListener("click", function (e) {
  const activeBtn = e.target;
  const activeTodos = getActiveTodos(appState.todos);

  changeActiveTab(activeBtn, filterBtns, itemsWrapperEl, activeTodos);
});

// Show completed todos when "Completed" button is clicked
completedBtn.addEventListener("click", function (e) {
  const completedBtn = e.target;
  const completedTodos = getCompletedTodos(appState.todos);

  changeActiveTab(completedBtn, filterBtns, itemsWrapperEl, completedTodos);
});

// Clear completed items when "Clear Completed" button is clicked
clearCompletedBtn.addEventListener("click", function (e) {
  const completedItemEls = [...document.querySelectorAll(".completed-item")];
  const completedTodos = getCompletedTodos(appState.todos);

  completedItemEls.forEach(el => el.remove());

  completedTodos.forEach(todo => removeObj(appState.todos, todo));

  reRenderTodos(appState.todos, filterBtns, itemsWrapperEl);

  saveToLocalStorage(appState);
});

// Set dragged item info global for next events
itemsWrapperEl.addEventListener("dragstart", function (e) {
  // Matching Strategy
  if (!e.target.closest(".item")) return;

  const draggedEl = e.target.closest(".item");

  dragged.el = draggedEl;
  dragged.obj = getObjFromEl(appState.todos, draggedEl);
  dragged.yCoords = draggedEl.getBoundingClientRect().y;
});

// Allow to drop the dragged item on todo list
itemsWrapperEl.addEventListener("dragover", function (e) {
  // Matching Strategy
  if (!e.target.closest(".item")) return;

  e.preventDefault();
});

// Reorder todo items when a dragged item is dropped
itemsWrapperEl.addEventListener("drop", function (e) {
  // Matching Strategy
  if (!e.target.closest(".item")) return;

  const droppedEl = e.target.closest(".item");

  const dropped = {
    el: droppedEl,
    obj: getObjFromEl(appState.todos, droppedEl),
    yCoords: droppedEl.getBoundingClientRect().y,
  };

  reorderItems(appState.todos, dragged, dropped);

  saveToLocalStorage(appState);
});
