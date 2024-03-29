function handleSubmit(event) {
  event.preventDefault();

  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  // ------ VALIDATION -------
  function validateEmail(email) {
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailFormat.test(email);
  }
  if (!validateEmail(email)) {
    console.log("Invalid email address.");
    return;
  }
  function validatePassword(password) {
    return password.length >= 6;
  }
  if (!validatePassword(password)) {
    console.log("Length should be greater than 6 characters");
    return;
  }
  // ----- DONE VALIDATION -------

  const credentials = { email, password };

  let contentType;
  let body;
  contentType = "application/json";
  body = JSON.stringify(credentials); // JSON format

  // ------- DONE CSV or JSON ---------

  // ----- Fetching -------
  fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": contentType,
    },
    body: body, //body based above
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Response from server:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  event.target.reset();
}
// ------ Fetching done ----------

// Event listener to the form for form submission
document.getElementById("signup-form").addEventListener("submit", handleSubmit);
