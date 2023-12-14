const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json()); // To parse JSON bodies

// Database connection using promise() for async/await support
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '33511804',
    database: 'Food'
}).promise();

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

app.get("/api/v1/foods", async (req, res) => {
    try {
      const [results] = await db.query("SELECT * FROM food");
      res.status(200).json({
        status: "success",
        results: results.length,
        data: results,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
});



app.post(`/api/v1/foods/:id/addRating`, async (req, res) => {
  const { user_id, score, review, image_url } = req.body;
  const { id } = req.params;
  try {
    const results = await db.query(
      "INSERT INTO rating(user_id, food_id, score, review, image_url) VALUES($1, $2, $3, $4, $5) returning *",
      [user_id, id, score, review, image_url]
    );
    res.status(200).json({
      status: "success",
      data: results.rows[0],
    });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

