const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}
const user = JSON.parse(localStorage.getItem("user"));

if (user.plan !== "premium") {

  alert(
    "Academic Calendar feature is available only for Premium users."
  );

  window.location.href = "premium.html";

}

const calendarEvents =
  document.getElementById(
    "calendarEvents"
  );


// FETCH EVENTS
const fetchCalendarData = async () => {

  try {

    // EXAMS
    const examResponse = await fetch(
      "https://student-note-making-app-1.onrender.com/api/exams",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const exams =
      await examResponse.json();


    // ASSIGNMENTS
    const assignmentResponse =
      await fetch(
        "https://student-note-making-app-1.onrender.com/api/assignments",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const assignments =
      await assignmentResponse.json();


    displayEvents(
      exams,
      assignments
    );

  } catch (error) {

    console.log(error);

  }

};


// DISPLAY EVENTS
const displayEvents = (
  exams,
  assignments
) => {

  calendarEvents.innerHTML = "";


  // EXAMS
  exams.forEach((exam) => {

    calendarEvents.innerHTML += `
    
      <div class="
        calendar-event
        exam-event
      ">

        <h3>
          📘 ${exam.subject} Exam
        </h3>

        <p>
          📅 ${new Date(
            exam.examDate
          ).toLocaleDateString()}
        </p>

        <p>
          Priority:
          ${exam.priority}
        </p>

      </div>
    
    `;
  });


  // ASSIGNMENTS
  assignments.forEach(
    (assignment) => {

      calendarEvents.innerHTML += `
      
        <div class="
          calendar-event
          assignment-event
        ">

          <h3>
            📝 ${assignment.title}
          </h3>

          <p>
            Subject:
            ${assignment.subject}
          </p>

          <p>
            📅 ${new Date(
              assignment.dueDate
            ).toLocaleDateString()}
          </p>

          <p>
            Status:
            ${assignment.status}
          </p>

        </div>
      
      `;
    }
  );

};


fetchCalendarData();
let currentDate = new Date();

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  document.getElementById("monthYear").innerText =
    date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  // empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    grid.innerHTML += `<div></div>`;
  }

  const today = new Date();

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    grid.innerHTML += `
      <div class="calendar-day ${isToday ? "today" : ""}">
        ${day}
      </div>
    `;
  }
}

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};

renderCalendar(currentDate);