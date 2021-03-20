/**
 * schedule-event:
 *   date - "YYYY/MM/DD"
 *   title - text
 */

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let dateRange = 15;
let draggedTodoText = {};

// TODO: incorporate this as id's for todos
let todoCount = 0;

const clearTodos = function () {
  var todoCards = document.querySelectorAll(".todo");

  if (todoCards) {
    todoCards.forEach(todo => todo.parentNode.removeChild(todo));
  }
}

const removeTodo = (todoText) => {
  let todos = JSON.parse(localStorage.getItem("todos"));

  let newTodos = todos.filter(el => el.text !== todoText);

  sortSetAddTodos(newTodos);
};

const createTodoElement = (text) => {
  let container = document.createElement('div');
  let txt = document.createElement('p');
  let close = document.createElement('button');

  container.className = "todo";
  container.draggable = true;
  container.addEventListener('dragstart', () => draggedTodoText = text);
  
  txt.innerText = text;

  close.innerText = 'complete';
  close.addEventListener('click', () => removeTodo(text));
  
  container.appendChild(txt);
  container.appendChild(close);
  
  return container;
};

const sortSetAddTodos = (todos) => {
  todos.sort((e1, e2) => e1.date < e2.date);
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

    if (dateDiff < dateRange) {
      if (dateDiff <= 0) {
        var id = "day-0";
      } else if (dateDiff < dateRange) {
        var id = "day-" + dateDiff;
      }

      var newTodoElement = createTodoElement(todo.text);

      var column = document.getElementById(id);

      for (var i = 0; i < column.childNodes.length; i++) {
        if (column.childNodes[i].className == "drop-zone") {
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

// Initialize bonbon
document.addEventListener('DOMContentLoaded', (event) => {
  var contentContainerElement = document.getElementById('content');

  for (i = 0; i < 15; i++) {
    var column = document.createElement('div');
    column.id = "day-" + i;
    column.className = 'day-column';

    let dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault(); 

      const targetDate = e.target.dataset.date;
      var todos = JSON.parse(localStorage.getItem("todos"));

      for (i = 0; i < todos.length; i++) {
        if (todos[i].text === draggedTodoText) {
          todos[i].date = targetDate;
          break;
        }
      }

      sortSetAddTodos(todos);
    });

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
      dropZone.setAttribute("data-date", date);
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
    addTodosToDOM(todos);
  }
  
  // add click events for each date range button
  document.getElementsByClassName('btn-row')[0].childNodes.forEach(btn => {
    btn.addEventListener('click', (event) => {
      changeDateRange(event.target.firstChild.textContent.trim());
    });
  });
  
  // on form submit add new todo
  document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault();
    
    const inputText = document.getElementById('input').value;
    
    if (!inputText) {
      return;
    }
    
    const creationDate = new Date();
    const newTodo = { date: creationDate, text: inputText };
    
    var todos = JSON.parse(localStorage.getItem("todos"));
    
    todos.push(newTodo);
    
    sortSetAddTodos(todos);

    // reset the form
    var form = document.getElementById("form");
    form.reset();
  });
});
