let timer = 25 * 60;

let interval = null;

let isRunning = false;
const user = JSON.parse(localStorage.getItem("user"));

if (user.plan !== "premium") {

  alert(
    "Pomodoro Timer feature is available only for Premium users."
  );

  window.location.href = "premium.html";

}

let completedSessions =
  localStorage.getItem("sessions") || 0;


const timerDisplay =
  document.getElementById("timer");

const sessionCount =
  document.getElementById("sessionCount");


sessionCount.innerText =
  completedSessions;


// UPDATE TIMER
const updateTimer = () => {

  const minutes =
    Math.floor(timer / 60);

  const seconds =
    timer % 60;

  timerDisplay.innerText =
    `${String(minutes).padStart(2, "0")}
    :
    ${String(seconds).padStart(2, "0")}`;

};


// START TIMER
const startTimer = () => {

  if (isRunning) return;

  isRunning = true;

  interval = setInterval(() => {

    timer--;

    updateTimer();

    // SESSION COMPLETE
    if (timer <= 0) {

      clearInterval(interval);

      isRunning = false;

      completedSessions++;

      localStorage.setItem(
        "sessions",
        completedSessions
      );

      sessionCount.innerText =
        completedSessions;

      alert(
        "Pomodoro Session Completed!"
      );

      timer = 25 * 60;

      updateTimer();

    }

  }, 1000);

};


// PAUSE TIMER
const pauseTimer = () => {

  clearInterval(interval);

  isRunning = false;

};


// RESET TIMER
const resetTimer = () => {

  clearInterval(interval);

  isRunning = false;

  timer = 25 * 60;

  updateTimer();

};


// EVENT LISTENERS
document.getElementById(
  "startBtn"
).addEventListener(
  "click",
  startTimer
);

document.getElementById(
  "pauseBtn"
).addEventListener(
  "click",
  pauseTimer
);

document.getElementById(
  "resetBtn"
).addEventListener(
  "click",
  resetTimer
);


updateTimer();