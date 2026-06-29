const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

let editMode = false;
let editNoteId = null;
let currentPage = 1;
let totalPages = 1;
let allFetchedNotes = []; // Storing fetched notes safely to avoid inline HTML parsing crashes

const noteForm = document.getElementById("noteForm");
const notesList = document.getElementById("notesList");
const semesterSelect = document.getElementById("semesterSelect");
const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");

// FETCH SEMESTERS
const fetchSemesters = async () => {
  try {
    const response = await fetch("https://student-note-making-app-1.onrender.com/api/semesters", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const semesters = await response.json();

    semesterSelect.innerHTML = `<option value="">Select Semester</option>`;

    semesters.forEach((semester) => {
      semesterSelect.innerHTML += `
        <option value="${semester._id}">
          ${semester.semesterName}
        </option>
      `;
    });
  } catch (error) {
    console.log(error);
  }
};

// FETCH NOTES
const fetchNotes = async () => {
  try {
    const response = await fetch(`https://student-note-making-app-1.onrender.com/api/notes?page=${currentPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    totalPages = data.totalPages || 1;
    allFetchedNotes = data.notes || []; // Keep global reference for the edit function lookup
    displayNotes(allFetchedNotes);

    document.getElementById("pageNumber").innerText = `${data.currentPage}/${data.totalPages}`;

    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === totalPages;
  } catch (error) {
    console.log(error);
  }
};

// DISPLAY NOTES
const displayNotes = (notes) => {
  notesList.innerHTML = "";

  if (!notes || notes.length === 0) {
    notesList.innerHTML = "<p>No notes found.</p>";
    return;
  }

  notes.forEach((note) => {
    notesList.innerHTML += `
      <div class="note-card">
        <h3>
          ${note.title}
          ${note.pinned ? "📌" : ""}
        </h3>
        <p>
          <strong>Semester:</strong>
          ${note.semesterId?.semesterName || "N/A"}
        </p>
        <p>
          <strong>Subject:</strong>
          ${note.subject}
        </p>
        <p>${note.content}</p>
        ${
          note.fileUrl
            ? `<a target="_blank" href="https://student-note-making-app-1.onrender.com/uploads/${note.fileUrl}">📄 View File</a>`
            : ""
        }
        <div class="note-actions">
          <!-- Passing only ID to avoid string/newline truncation breaks in HTML inline onClick declarations -->
          <button onclick="prepareEditNote('${note._id}')">Edit</button>
          <button onclick="pinNote('${note._id}')">Pin</button>
          <button onclick="deleteNote('${note._id}')">Delete</button>
        </div>
      </div>
    `;
  });
};

// CREATE / UPDATE NOTE
noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const semesterId = semesterSelect.value;
  const subject = document.getElementById("subject").value;
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  try {
    let response;

    if (editMode) {
      response = await fetch(`https://student-note-making-app-1.onrender.com/api/notes/${editNoteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return showToast(data.message);
      }

      showToast("Note Updated");
      editMode = false;
      editNoteId = null;
      document.getElementById("file").value = "";
    } else {
      const formData = new FormData();
      formData.append("semesterId", semesterId);
      formData.append("subject", subject);
      formData.append("title", title);
      formData.append("content", content);

      const file = document.getElementById("file").files[0];
      if (file) {
        formData.append("file", file);
      }

      response = await fetch("https://student-note-making-app-1.onrender.com/api/notes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return showToast(data.message);
      }

      showToast("Note Added");
      document.getElementById("file").value = "";
    }

    noteForm.reset();
    fetchNotes();
  } catch (error) {
    console.log(error);
  }
});

// PREPARE EDIT NOTE (Safe alternative lookup)
function prepareEditNote(id) {
  const noteToEdit = allFetchedNotes.find((n) => n._id === id);
  if (!noteToEdit) return;

  document.getElementById("subject").value = noteToEdit.subject;
  document.getElementById("title").value = noteToEdit.title;
  document.getElementById("content").value = noteToEdit.content;
  if (noteToEdit.semesterId?._id) {
    semesterSelect.value = noteToEdit.semesterId._id;
  }

  editMode = true;
  editNoteId = id;
}

// DELETE NOTE
async function deleteNote(id) {
  try {
    await fetch(`https://student-note-making-app-1.onrender.com/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showToast("Note Deleted");

    const response = await fetch(`hhttps://student-note-making-app-1.onrender.com/api/notes?page=${currentPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.notes.length === 0 && currentPage > 1) {
      currentPage--;
    }

    fetchNotes();
  } catch (error) {
    console.log(error);
  }
}

// PIN NOTE
async function pinNote(id) {
  try {
    await fetch(`https://student-note-making-app-1.onrender.com/api/notes/pin/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showToast("Note Pinned");
    fetchNotes();
  } catch (error) {
    console.log(error);
  }
}

// SEARCH NOTES (Local array filter implementation)
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filteredNotes = allFetchedNotes.filter((note) =>
    note.title.toLowerCase().includes(query) || 
    note.subject.toLowerCase().includes(query)
  );
  displayNotes(filteredNotes);
});

// PAGINATION
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchNotes();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchNotes();
  }
});

// TOAST
function showToast(message) {
  toast.innerText = message;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}

// Initialize Application Loads
fetchSemesters();
fetchNotes();
