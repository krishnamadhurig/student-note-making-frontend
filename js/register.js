const registerForm =
  document.getElementById("registerForm");

registerForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();

    const username =
      document.getElementById("username").value;

    const email =
      document.getElementById("email").value;

    const password =
      document.getElementById("password").value;

    try {

      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      console.log(response);

      const data = await response.json();

      console.log(data);

  if (!response.ok) {
    alert(data.message);
    return;
}

alert(data.message);
window.location.href = "login.html";
    } catch (error) {

      console.log(
        "FETCH ERROR:",
        error
      );

    }

  }
);