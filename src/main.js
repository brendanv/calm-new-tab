import moment from 'moment';

function initPage() {
  updateTime();
  window.setInterval(updateTime, 1000);
}

let timeStr = null;
function updateTime() {
  const currTime = moment().format('HH:mm');
  if (currTime !== timeStr) {
    document.getElementById('time').textContent = currTime;
    timeStr = currTime;
  }
}

window.onload = initPage;
