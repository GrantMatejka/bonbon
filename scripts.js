/**
 * schedule-event:
 *   date - "YYYY/MM/DD"
 *   title - text
 *   id - int
 */

const INITIAL_DATE_RANGE = 15;
const DROP_ZONE = 'drop-zone';

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let dateRange = INITIAL_DATE_RANGE;

// hacky workaround for now
//let draggedTodoId = 0;

let todoCount = 0;

const createNewTodo = (text, time) => {
  const creationDate = new Date();

  const newTodo = { date: creationDate.toISOString().split('T')[0], text: text, time: time, id: todoCount };
  todoCount += 1;

  return newTodo;
};

const clearTodos = () => {
  var todoCards = document.querySelectorAll(".todo");

  if (todoCards) {
    todoCards.forEach(todo => todo.parentNode.removeChild(todo));
  }
}

const removeTodo = (id) => {
  let todos = JSON.parse(localStorage.getItem("todos"));

  let newTodos = todos.filter(el => el.id !== id);

  sortSetAddTodos(newTodos);
};

const createTodoElement = (todo) => {
  let container = document.createElement('div');
  let txt = document.createElement('p');
  let close = document.createElement('button');

  container.className = "todo";
  container.draggable = true;
  container.addEventListener('dragstart', e => e.dataTransfer.setData("text/plain", todo.id));
  
  txt.innerText = todo.time ? todo.time + ' - ' + todo.text : todo.text;

  close.innerText = 'complete';
  close.addEventListener('click', () => removeTodo(todo.id));
  
  container.appendChild(txt);
  container.appendChild(close);
  
  return container;
};

const sortSetAddTodos = (todos) => {
  const todoSorter = (t1, t2) => {
    if (t1.date.toString().substring(0, 15) < t2.date.toString().substring(0, 15)) return -1;
    if (t1.date.toString().substring(0, 15) > t2.date.toString().substring(0, 15)) return 1;
    if (parseInt(t1.time) < parseInt(t2.time)) return -1;
    if (parseInt(t1.time) > parseInt(t2.time)) return 1;
    return 0;
  };

  todos.sort(todoSorter);
  localStorage.setItem("todos", JSON.stringify(todos));

  addTodosToDOM(todos);
};

// takes in a list of 'todo elements' from local storage
// iterates through and only adds todos that fit within 
const addTodosToDOM = function (todos) {
  clearTodos();

  todos.forEach(todo => {
    // since todo date will be correctly formatted this is safe
    const currDate = new Date();
    var todoDate = Date.parse(todo.date);

    // calculate number of days between dates
    var dateDiff = Math.floor((todoDate - currDate) / (1000 * 3600 * 24)) + 2;

    // figure out which date column to put todo into
    if (dateDiff < dateRange) {
      if (dateDiff <= 0) {
        var id = "day-0";
      } else if (dateDiff < dateRange) {
        var id = "day-" + dateDiff;
      }

      var newTodoElement = createTodoElement(todo);

      var column = document.getElementById(id);

      for (var i = 0; i < column.childNodes.length; i++) {
        if (column.childNodes[i].className == DROP_ZONE) {
          column.childNodes[i].appendChild(newTodoElement);
          break;
        }
      }
    }
  });
};

const changeDateRange = function (dateRange) {
  document.getElementById('date-view').innerHTML = "Viewing: " + dateRange;

  if (dateRange === "Today") {
    dateRange = 1;
  } else if (dateRange === "This Week") {
    dateRange = 7;
  } else {
    dateRange = 14;
  }

  for (var i = 2; i <= 14; i++) {
    var id = "day-" + i;
    var el = document.getElementById(id);

    if (dateRange - i >= 0) {
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  }
};

const dropTodoCard = (e) => {
  e.preventDefault();

  const draggedTodoId = parseInt(e.dataTransfer.getData("text/plain"));

  // find valid drop zone for todo card
  var validDropZone = e.target;
  while (validDropZone.className !== DROP_ZONE) {
    validDropZone = validDropZone.parentNode;
  }

  // the new date we want
  const targetDate = validDropZone.dataset.date;

  var todos = JSON.parse(localStorage.getItem("todos"));

  for (i = 0; i < todos.length; i++) {
    if (todos[i].id === draggedTodoId) {
      todos[i].date = targetDate;
      break;
    }
  }

  sortSetAddTodos(todos);
};

const handleFormSubmission = (event) => {
  event.preventDefault();

  const inputText = document.getElementById('input').value;
  const inputTime = document.getElementById('input-time').value;

  if (!inputText) {
    return;
  }

  const newTodo = createNewTodo(inputText, inputTime);

  var todos = JSON.parse(localStorage.getItem("todos"));

  todos.push(newTodo);

  sortSetAddTodos(todos);

  // reset the form
  var form = document.getElementById("form");
  form.reset();
};

/** Initialize BonBon
 * 
 * We will iterate through initial count of date columns we want and insert divs
 * also initialize todos if we need to
 * finally add in form and button operations
 */
document.addEventListener('DOMContentLoaded', (event) => {
  var contentContainerElement = document.getElementById('content');

  for (i = 0; i < INITIAL_DATE_RANGE; i++) {
    var column = document.createElement('div');
    column.id = "day-" + i;
    column.className = 'day-column';

    let dropZone = document.createElement('div');
    dropZone.className = DROP_ZONE;

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); });
    dropZone.addEventListener('drop', dropTodoCard);

    let titleContainer = document.createElement('div');
    titleContainer.className = 'col-title-container'
    column.appendChild(titleContainer)

    var title = document.createElement('h4');
    titleContainer.appendChild(title);

    // if we aren't on 'past' column add date stuff
    if (i > 0) {
      const date = new Date();
      date.setDate(date.getDate() + i - 1);
      
      title.innerText = date.toLocaleDateString();
      
      var subtitle = document.createElement('h5');
      subtitle.innerText = daysOfWeek[date.getDay()];
      
      if (i > 7) {
        column.style.display = 'none';
      }
      
      titleContainer.appendChild(subtitle);
      dropZone.setAttribute("data-date", date.toISOString().split('T')[0]);
    } else {
      title.innerText = "Ongoing";
      dropZone.setAttribute("data-date", 0);
    }

    column.appendChild(dropZone);
    contentContainerElement.appendChild(column);
  }

  // init todos array if not existant
  var todos = JSON.parse(localStorage.getItem("todos"));
  if (!todos) {
    localStorage.setItem("todos", JSON.stringify([]));
  } else {
    // we need to get the maximum id so we know where to begin creating id's from
    const maxTodoId = Math.max(...todos.map(el => parseInt(el.id)));
    todoCount = maxTodoId + 1;

    addTodosToDOM(todos);
  }
  
  // add click events for each date range button
  document.getElementsByClassName('btn-row')[0].childNodes.forEach(btn => {
    btn.addEventListener('click', (event) => {
      changeDateRange(event.target.firstChild.textContent.trim());
    });
  });
  
  // on form submit add new todo
  document.getElementById('form').addEventListener('submit', (event) => handleFormSubmission(event));
});
