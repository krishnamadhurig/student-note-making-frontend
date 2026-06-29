const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(
      "https://student-note-making-app-1.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    // Login failed
    if (!response.ok) {
      alert(data.message);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return;
    }

    // Login success
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    alert(data.message);

    window.location.href = "dashboard.html";

  } catch (error) {
    console.log(error);
    alert("Server Error");
  }
});