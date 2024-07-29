require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

app.use(express.json());

app.post("/searchWord", async (req, res) => {
  const query = req.body.query;
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/YOUR_MODEL_NAME",
      {
        inputs: `Translate the word '${query}' to Japanese with an example sentence.`,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        }
      }
    );

    const meaning = response.data[0].generated_text.trim();

    const sql = "INSERT INTO words (word, meaning) VALUES (?, ?)";
    db.query(sql, [query, meaning], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error saving to database");
        return;
      }
      res.json({ word: query, meaning });
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
