import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const port = 5000;

// Enable CORS middleware
app.use(cors());

// Serve static files from the public folder
app.use(express.static("public"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Connect to the SQLite database
const db = new sqlite3.Database("dua_main.sqlite");

// fetching categories
app.get("/categories", (req: Request, res: Response) => {
  // Your SQL query to fetch data from a specific table
  const query = "SELECT * FROM 'category' LIMIT 0,30";

  // Execute the query
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});

app.get("/duas", (req: Request, res: Response) => {
  const catId = req.query.catId as string;
  const subcatId = req.query.subcatId as string;

  // Check if either catId or subcatId is provided
  if (!catId && !subcatId) {
    return res
      .status(400)
      .json({ error: "catId or subcatId parameter is required" });
  }

  // Define the base SQL query
  let query = "SELECT * FROM dua";

  // Check if catId is provided
  if (catId) {
    query += " WHERE cat_id = ?";
  } else if (subcatId) {
    // If not, check if subcatId is provided
    query += " WHERE subcat_id = ?";
  }

  // Execute the query
  db.all(query, [catId || subcatId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});

// fetching sub categories By cat_id
app.get("/sub-categories", (req: Request, res: Response) => {
  const catId = req.query.catId as string;

  if (!catId) {
    return res.status(400).json({ error: "catId parameter is required" });
  }

  const query = "SELECT * FROM sub_category WHERE cat_id = ?";
  db.all(query, [catId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: rows });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
