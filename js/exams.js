const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}


const examForm =
  document.getElementById("examForm");

const examList =
  document.getElementById("examList");


// FETCH EXAMS
const fetchExams = async () => {

  try {

    const response = await fetch(
      "http://localhost:5000/api/exams",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const exams = await response.json();

    displayExams(exams);

  } catch (error) {

    console.log(error);

  }

};


// DISPLAY EXAMS
const displayExams = (exams) => {

  examList.innerHTML = "";

  exams.forEach((exam) => {

    const today = new Date();

    const examDate = new Date(exam.examDate);

    const timeDifference =
      examDate - today;

    const daysLeft =
      Math.ceil(
        timeDifference /
        (1000 * 60 * 60 * 24)
      );

    examList.innerHTML += `
    
      <div class="exam-card">

        <h2>${exam.subject}</h2>

        <p>
          <strong>Exam Date:</strong>
          ${examDate.toLocaleDateString()}
        </p>

        <p class="${exam.priority.toLowerCase()}">

          ${exam.priority} Priority

        </p>

        <p>
          ⏳ ${daysLeft} days left
        </p>

        <div class="exam-actions">

          <button
            onclick="deleteExam('${exam._id}')"
          >
            Delete
          </button>

        </div>

      </div>
    
    `;
  });

};


// CREATE EXAM
examForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const subject =
      document.getElementById("subject").value;

    const examDate =
      document.getElementById("examDate").value;

    const priority =
      document.getElementById("priority").value;

    try {

      await fetch(
        "http://localhost:5000/api/exams",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            subject,
            examDate,
            priority,
          }),
        }
      );

      examForm.reset();

      fetchExams();

    } catch (error) {

      console.log(error);

    }

  }
);


// DELETE EXAM
const deleteExam = async (id) => {

  try {

    await fetch(
      `http://localhost:5000/api/exams/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchExams();

  } catch (error) {

    console.log(error);

  }

};


fetchExams();