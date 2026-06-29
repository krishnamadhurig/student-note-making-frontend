const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

const assignmentForm =
  document.getElementById("assignmentForm");

const assignmentList =
  document.getElementById("assignmentList");

// FETCH ASSIGNMENTS
const fetchAssignments = async () => {

  try {

    const response = await fetch(
      "http://localhost:5000/api/assignments",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const assignments =
      await response.json();

    displayAssignments(assignments);

  } catch (error) {

    console.log(error);

  }

};

// DISPLAY ASSIGNMENTS
const displayAssignments = (assignments) => {

  assignmentList.innerHTML = "";

  assignments.forEach((assignment) => {

    assignmentList.innerHTML += `
    
      <div class="assignment-card">

        <h3>${assignment.title}</h3>

        <p>
          <strong>Subject:</strong>
          ${assignment.subject}
        </p>

        <p>
          <strong>Due Date:</strong>
          ${new Date(
            assignment.dueDate
          ).toLocaleDateString()}
        </p>

        <p class="${
          assignment.status === "Completed"
            ? "completed"
            : "pending"
        }">

          ${assignment.status}

        </p>

        <div class="assignment-actions">

          <button
            class="complete-btn"
            onclick="toggleStatus('${assignment._id}')"
          >
            Mark Complete
          </button>

          <button
            class="delete-btn"
            onclick="deleteAssignment('${assignment._id}')"
          >
            Delete
          </button>

        </div>

      </div>
    
    `;
  });

};

// CREATE ASSIGNMENT
assignmentForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const title =
      document.getElementById("title").value;

    const subject =
      document.getElementById("subject").value;

    const dueDate =
      document.getElementById("dueDate").value;

    try {

      await fetch(
        "http://localhost:5000/api/assignments",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title,
            subject,
            dueDate,
          }),
        }
      );

      assignmentForm.reset();

      fetchAssignments();

    } catch (error) {

      console.log(error);

    }

  }
);

// DELETE ASSIGNMENT
const deleteAssignment = async (id) => {

  try {

    await fetch(
      `http://localhost:5000/api/assignments/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchAssignments();

  } catch (error) {

    console.log(error);

  }

};

// TOGGLE STATUS
const toggleStatus = async (id) => {

  try {

    await fetch(
      `http://localhost:5000/api/assignments/status/${id}`,
      {
        method: "PUT",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchAssignments();

  } catch (error) {

    console.log(error);

  }

};


fetchAssignments();