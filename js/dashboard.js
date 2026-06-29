const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

// USER
const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
  window.location.href = "login.html";
}

// WELCOME TEXT
const welcomeText = document.getElementById("welcomeText");

if (user.plan === "premium") {
  welcomeText.innerHTML = `Welcome ${user.username} 👑`;
} else {
  welcomeText.innerHTML = `Welcome ${user.username} 👋`;
}

// PREMIUM BANNER
const premiumBanner =
  document.querySelector(".premium-banner");

if (premiumBanner) {

  if (user.plan === "premium") {

    premiumBanner.innerHTML = `
      <div class="premium-active">
        <h2>💎 Premium Active</h2>
        <p>
          You currently have access to all premium features.
        </p>
      </div>
    `;

  }

}

// AI FEATURE LOCK
const aiLink = document.getElementById("aiLink");

if (aiLink) {

  aiLink.addEventListener("click", (e) => {

    if (user.plan !== "premium") {

      e.preventDefault();

      alert(
        "AI Assistant is available only for Premium users."
      );

      window.location.href = "premium.html";

    } else {

      window.location.href = "ai.html";

    }

  });

}

// TOUR FEATURE LOCK
const tourLink = document.getElementById("tourLink");

if (tourLink) {

  tourLink.addEventListener("click", (e) => {

    if (user.plan !== "premium") {

      e.preventDefault();

      alert(
        "Tours feature is available only for Premium users."
      );

      window.location.href = "premium.html";

    } else {

      window.location.href = "tour.html";

    }

  });

}
// CALENDAR FEATURE LOCK
const calendarLink =
  document.getElementById("calendarLink");

if (calendarLink) {

  calendarLink.addEventListener("click", (e) => {

    if (user.plan !== "premium") {

      e.preventDefault();

      alert(
        "Academic Calendar feature is available only for Premium users."
      );

      window.location.href = "premium.html";

    } else {

      window.location.href = "calendar.html";

    }

  });

}


// POMODORO FEATURE LOCK
const pomodoroLink =
  document.getElementById("pomodoroLink");

if (pomodoroLink) {

  pomodoroLink.addEventListener("click", (e) => {

    if (user.plan !== "premium") {

      e.preventDefault();

      alert(
        "Pomodoro Timer feature is available only for Premium users."
      );

      window.location.href = "premium.html";

    } else {

      window.location.href = "pomodoro.html";

    }

  });

}

// LOGOUT
document
  .getElementById("logoutBtn")
  .addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "login.html";

  });

// THEME
const themeToggle =
  document.getElementById("themeToggle");

if (
  localStorage.getItem("theme") === "dark"
) {
  document.body.classList.add("dark-mode");
}

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark-mode");

  if (
    document.body.classList.contains(
      "dark-mode"
    )
  ) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

});

// FETCH DASHBOARD DATA
const fetchDashboardData = async () => {

  try {

    // NOTES
    const notesResponse = await fetch(
      "http://localhost:5000/api/notes",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

   const notesData =
  await notesResponse.json();

document.getElementById(
  "notesCount"
).innerText =
  notesData.totalNotes;

  // FREE PLAN NOTE LIMIT WARNING
if (user.plan === "free") {

  const notesCount =
    notesData.totalNotes;

  if (notesCount >= 10) {

    const premiumBanner =
      document.querySelector(".premium-banner");

    premiumBanner.innerHTML = `
      <div class="premium-content">
        <div>
          <h2>⚠️ Free Limit Reached</h2>

          <p>
            You have reached the maximum limit of
            <strong>10 Notes</strong> on the Free Plan.
            Upgrade to Premium for unlimited notes,
            AI Assistant, Tours, Calendar, Pomodoro,
            Cloud Backup and more.
          </p>
        </div>

        <div class="premium-actions">
          <a href="premium.html" class="premium-btn">
            Upgrade Now 🚀
          </a>
        </div>
      </div>
    `;
  }
}


    // ASSIGNMENTS
    const assignmentResponse =
      await fetch(
        "http://localhost:5000/api/assignments",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

    const assignments =
      await assignmentResponse.json();

    document.getElementById(
      "assignmentCount"
    ).innerText = assignments.length;


    // EXAMS
    const examResponse =
      await fetch(
        "http://localhost:5000/api/exams",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

    const exams =
      await examResponse.json();

    document.getElementById(
      "examCount"
    ).innerText = exams.length;


    // TOURS
    const tourResponse =
      await fetch(
        "http://localhost:5000/api/tours",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

    const tours =
      await tourResponse.json();

    document.getElementById(
      "tourCount"
    ).innerText = tours.length;


    // UPCOMING EXAMS
    const upcomingExams =
      document.getElementById(
        "upcomingExams"
      );

    upcomingExams.innerHTML = "";

    exams.slice(0, 3).forEach((exam) => {

      upcomingExams.innerHTML += `
        <div class="upcoming-item">
          <h4>${exam.subject}</h4>
          <p>
            ${new Date(
              exam.examDate
            ).toLocaleDateString()}
          </p>
        </div>
      `;

    });

    // ASSIGNMENTS
    const upcomingAssignments =
      document.getElementById(
        "upcomingAssignments"
      );

    upcomingAssignments.innerHTML = "";

    assignments
      .slice(0, 3)
      .forEach((assignment) => {

        upcomingAssignments.innerHTML += `
          <div class="upcoming-item">
            <h4>${assignment.title}</h4>
            <p>${assignment.subject}</p>
          </div>
        `;

      });

    // TOURS
    const upcomingTours =
      document.getElementById(
        "upcomingTours"
      );

    upcomingTours.innerHTML = "";

    tours
      .slice(0, 3)
      .forEach((tour) => {

        upcomingTours.innerHTML += `
          <div class="upcoming-item">
            <h4>${tour.title}</h4>
            <p>${tour.location}</p>
          </div>
        `;

      });

  } catch (error) {

    console.error(
      "Dashboard Error:",
      error
    );

  }

};

fetchDashboardData();
document.getElementById("notesCard")
.addEventListener("click", () => {
  window.location.href = "notes.html";
});

document.getElementById("assignmentCard")
.addEventListener("click", () => {
  window.location.href = "assignments.html";
});

document.getElementById("examCard")
.addEventListener("click", () => {
  window.location.href = "exams.html";
});

document.getElementById("tourCard")
.addEventListener("click", () => {
  window.location.href = "tour.html";
});

// MINI CALENDAR
let miniDate = new Date();

function renderMiniCalendar(date) {

  const year =
    date.getFullYear();

  const month =
    date.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const days =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  document.getElementById(
    "miniMonth"
  ).innerText =
    date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        year: "numeric"
      }
    );

  const grid =
    document.getElementById(
      "miniGrid"
    );

  grid.innerHTML = "";

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    grid.innerHTML += "<div></div>";

  }

  const today = new Date();

  for (
    let d = 1;
    d <= days;
    d++
  ) {

    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    grid.innerHTML += `
      <div class="mini-day ${
        isToday ? "today" : ""
      }">
        ${d}
      </div>
    `;

  }


}

// CALENDAR NAVIGATION
document.getElementById(
  "miniPrev"
).onclick = () => {

  miniDate.setMonth(
    miniDate.getMonth() - 1
  );

  renderMiniCalendar(
    miniDate
  );

};

document.getElementById(
  "miniNext"
).onclick = () => {

  miniDate.setMonth(
    miniDate.getMonth() + 1
  );

  renderMiniCalendar(
    miniDate
  );

};

renderMiniCalendar(miniDate);
