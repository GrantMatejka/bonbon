/**
 * schedule-event:
 *   date - "YYYY/MM/DD"
 *   title - text
 */

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const clearTodos = function () {
  var es = document.querySelectorAll(".todo");

  if (es) {
    es.forEach(e => e.parentNode.removeChild(e));
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  const addTodosToDOM = function (todos) {
    clearTodos();

    todos.forEach(todo => {
      // since todo date will be correctly formatted this is safe
      const currDate = new Date();
      var todoDate = Date.parse(todo.date);
      var dateDiff = Math.floor((todoDate - currDate) / (1000 * 3600 * 24)) + 2;

      if (dateDiff < 15) {
        if (dateDiff <= 0) {
          var id = "day-0";
        } else if (dateDiff < 15) {
          var id = "day-" + dateDiff;
        }

        var todoColumn = document.getElementById(id);
        var newTodoElement = document.createElement('p');
        newTodoElement.innerText = todo.text;
        newTodoElement.className = "todo";

        todoColumn.appendChild(newTodoElement);
      }
    });
  };

  var contentContainerElement = document.getElementById('content');

  for (i = 0; i < 15; i++) {
    var el = document.createElement('div');
    el.id = "day-" + i;

    var title = document.createElement('h4');

    el.appendChild(title);
    contentContainerElement.appendChild(el);

    if (i > 0) {
      const date = new Date();
      date.setDate(date.getDate() + i - 1);

      title.innerText = date.toLocaleDateString();

      var subtitle = document.createElement('h5');
      subtitle.innerText = daysOfWeek[date.getDay()];

      if (i > 7) {
        el.style.display = 'none';
      }

      el.appendChild(subtitle);
    } else {
      title.innerText = "Past";
    }
  }

  // init todos array if not existant
  var todos = JSON.parse(localStorage.getItem("todos"));
  if (!todos) {
    localStorage.setItem("todos", JSON.stringify([]));
  } else {
    addTodosToDOM(todos);
  }

  const changeDateRange = function (dateRange) {
    document.getElementById('date-view').innerHTML = "Viewing: " + dateRange;

    var numOfDays = 0;
    if (dateRange === "Today") {
      numOfDays = 1;
    } else if (dateRange === "This Week") {
      numOfDays = 7;
    } else {
      numOfDays = 14;
    }

    for (var i = 2; i <= 14; i++) {
      var id = "day-" + i;
      var el = document.getElementById(id);

      console.log(numOfDays + " " + i + " " + (numOfDays - i));
      if (numOfDays - i >= 0) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    }
  };

  document.getElementsByClassName('btn-row')[0].childNodes.forEach(btn => {
    btn.addEventListener('click', (event) => {
      changeDateRange(event.target.firstChild.textContent.trim());

      var clickSeq = JSON.parse(localStorage.getItem("clicks"));
      if (clickSeq) {
        clickSeq.push(event.target.firstChild.textContent);
      } else {
        clickSeq = [];
      }
      localStorage.setItem("clicks", JSON.stringify(clickSeq));
    });

  });

  // add new todo
  document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault();
    const inputText = document.getElementById('input').value;
    const currDate = new Date();
    const newTodo = { date: currDate, text: inputText };

    var todos = JSON.parse(localStorage.getItem("todos"));

    if (inputText && todos) {
      todos.push(newTodo);
    }

    todos.sort((e1, e2) => e1.date < e2.date);
    localStorage.setItem("todos", JSON.stringify(todos));

    addTodosToDOM(todos);
  })
});
