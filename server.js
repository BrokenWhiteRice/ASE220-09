const http = require("http");
const fs = require("fs");
const path = require("path");

const accounts = [];
const csvFilePath = "credentials.csv";
fs.readFile(csvFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading CSV file:", err);
    return;
  }

  // Split CSV data into rows
  const rows = data.trim().split("\n");

  // Parse each row into email and password
  rows.forEach((row) => {
    const [email, password] = row.trim().split(",");
    accounts.push({ email, password });
  });

  console.log("CSV file successfully loaded");
});

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    fs.readFile(path.join(__dirname, "index.html"), "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: -1, error: "Internal Server Error" }));
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });

    // ------- SIGN UP ---------
  } else if (req.method === "GET" && req.url === "/signup.js") {
    fs.readFile(path.join(__dirname, "signup.js"), "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: -1, error: "Internal Server Error" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(data);
      }
    });
  } else if (req.method === "POST" && req.url === "/api/signup") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      console.log(body);
    });
    req.on("end", () => {
      const userData = JSON.parse(body);
      saveUser(userData);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "User signed up successfully." }));
    });
    // ------- SIGN UP DONE ------

    // ------- SIGN IN ---------
  } else if (req.method === "GET" && req.url === "/signin.js") {
    const filePath = path.join(__dirname, "signin.js");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/javascript" });
        res.end(data);
      }
    });
  } else if (req.method === "POST" && req.url === "/api/signin") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const { email, password } = JSON.parse(body);

      // Check if provided email and password match
      const matchedAccount = accounts.find(
        (account) => account.email === email && account.password === password
      );
      if (matchedAccount) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Login successful" }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Incorrect email or password" }));
      }
    });
  } // ------- SIGN IN DONE ---------
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: -1, error: "Not Found" }));
  }
});

// ---- ADD SAVED DATA TO JSON ----
function saveUser(user) {
  const userData = `${user.email},${user.password}`;
  fs.appendFileSync("./credentials.csv", userData + "\n");
}
// ---- ADD SAVED DATA TO JSON DONE ----

const PORT = process.env.PORT || 3020;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
