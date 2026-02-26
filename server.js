const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(morgan("dev")); // Logs all requests to console
app.use(express.static("public"));

let db;

(async () => {
    db = await open({
        filename: "./database.db",
        driver: sqlite3.Database
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
})();

// API Routes (Same logic as before, but wrapped in professional middleware)
app.get("/users", async (req, res) => {
    try {
        const users = await db.all("SELECT * FROM users ORDER BY id DESC");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    try {
        const result = await db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
        res.status(201).json({ id: result.lastID, name, email });
    } catch (err) {
        res.status(400).json({ error: "Email already exists" });
    }
});

app.delete("/users/:id", async (req, res) => {
    await db.run("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ success: true });
});
app.get("/", (req, res) => {
    res.send("Server is running successfully 🚀");
    const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
});


app.listen(3000, () => console.log("✨ Pro Server running at http://localhost:3000"));
