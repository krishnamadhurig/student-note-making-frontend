const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

const user = JSON.parse(localStorage.getItem("user"));

if (user.plan !== "premium") {

  alert(
    "Pomodoro Timer feature is available only for Premium users."
  );

  window.location.href = "premium.html";

}
const tourForm =
  document.getElementById("tourForm");

const tourList =
  document.getElementById("tourList");


// FETCH TOURS
const fetchTours = async () => {

  try {

    const response = await fetch(
      "http://localhost:5000/api/tours",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const tours = await response.json();

    displayTours(tours);

  } catch (error) {

    console.log(error);

  }

};


// DISPLAY TOURS
const displayTours = (tours) => {

  tourList.innerHTML = "";

  tours.forEach((tour) => {

    tourList.innerHTML += `
    
      <div class="tour-card">

        <h2>${tour.title}</h2>

        <p>
          📍 ${tour.location}
        </p>

        <p>
          📅 ${new Date(
            tour.date
          ).toLocaleDateString()}
        </p>

        <p>
          💰 Budget: ₹${tour.budget}
        </p>

        <p>
          👥 Members: ${tour.members}
        </p>

        <p>
          📝 ${tour.notes}
        </p>

        <div class="tour-actions">

          <button
            onclick="deleteTour('${tour._id}')"
          >
            Delete
          </button>

        </div>

      </div>
    
    `;
  });

};


// CREATE TOUR
tourForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const title =
      document.getElementById("title").value;

    const location =
      document.getElementById("location").value;

    const date =
      document.getElementById("date").value;

    const budget =
      document.getElementById("budget").value;

    const members =
      document.getElementById("members").value;

    const notes =
      document.getElementById("notes").value;

    try {

      await fetch(
        "http://localhost:5000/api/tours",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title,
            location,
            date,
            budget,
            members,
            notes,
          }),
        }
      );

      tourForm.reset();

      fetchTours();

    } catch (error) {

      console.log(error);

    }

  }
);


// DELETE TOUR
const deleteTour = async (id) => {

  try {

    await fetch(
      `http://localhost:5000/api/tours/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchTours();

  } catch (error) {

    console.log(error);

  }

};


fetchTours();