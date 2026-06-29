const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}


const semesterForm =
  document.getElementById("semesterForm");

const semesterList =
  document.getElementById("semesterList");


// FETCH SEMESTERS
const fetchSemesters = async () => {

  try {

    const response = await fetch(
      "https://student-note-making-app-1.onrender.com/api/semesters",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const semesters = await response.json();

    semesterList.innerHTML = "";

    semesters.forEach((semester) => {

      semesterList.innerHTML += `
      
        <div class="semester-card">

          <h3>${semester.semesterName}</h3>

          <button onclick="deleteSemester('${semester._id}')">
            Delete
          </button>

        </div>
      
      `;
    });

  } catch (error) {
    console.log(error);
  }

};


// CREATE SEMESTER
semesterForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const semesterName =
      document.getElementById("semesterName").value;

    try {

      await fetch(
        "https://student-note-making-app-1.onrender.com/api/semesters",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            semesterName,
          }),
        }
      );

      semesterForm.reset();

      fetchSemesters();

    } catch (error) {
      console.log(error);
    }

  }
);


// DELETE SEMESTER
const deleteSemester = async (id) => {

  try {

    await fetch(
      `https://student-note-making-app-1.onrender.com/api/semesters/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchSemesters();

  } catch (error) {
    console.log(error);
  }

};


fetchSemesters();