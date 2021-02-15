/**
 * schedule-event:
 *   date - "YYYY/MM/DD"
 *   title - text
 */

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

document.addEventListener('DOMContentLoaded', (event) => {
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
      console.log(clickSeq);
      if (clickSeq) {
        clickSeq.push(event.target.firstChild.textContent);
      } else {
        clickSeq = [];
      }
      localStorage.setItem("clicks", JSON.stringify(clickSeq));
    });

  });
});
