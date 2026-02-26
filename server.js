const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const morgan = require("morgan");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

let db;

// Initialize Database
(async () => {
  try {
    db = await open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );

      CREATE INDEX IF NOT EXISTS idx_email ON users(email);
    `);

    console.log("🚀 Database Ready");
  } catch (error) {
    console.error("Database Error:", error);
  }
})();

// ----------------------
// Routes
// ----------------------

// Root Route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🚀");
});

// Get All Users
app.get("/users", async (req, res) => {
  try {
    const users = await db.all("SELECT * FROM users ORDER BY id DESC");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create User
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required" });
  }

  try {
    const result = await db.run(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );

    res.status(201).json({
      id: result.lastID,
      name,
      email,
    });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Delete User
app.delete("/users/:id", async (req, res) => {
  try {
    await db.run("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------
// Start Server (IMPORTANT FOR RENDER)
// ----------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✨ Pro Server running on port ${PORT}`);
});
