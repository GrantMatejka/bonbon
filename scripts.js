/**
 * schedule-event:
 *   date - "YYYY/MM/DD"
 *   title - text
 */

document.addEventListener('DOMContentLoaded', (event) => {
  var el = document.createElement('p');
  el.innerText = "DOM ready";

  document.getElementsByClassName('content')[0].appendChild(el);

  document.getElementsByClassName('btn-row')[0].childNodes.forEach(btn => {
    btn.addEventListener('click', (event) => { 
      if (event.isTrusted) {
        document.getElementById('date-view').innerHTML = "Viewing: " + event.target.firstChild.textContent;
      }

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
