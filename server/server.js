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
    password: 'password',
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
  const sql = `
  SELECT
    f.id AS id,
    f.name AS name,
    AVG(r.score) AS avgRatings,
    GROUP_CONCAT(i.name) AS ingredients,
    GROUP_CONCAT(dr.name) AS dietaryRestrictions
  FROM
    Food f
    LEFT JOIN Rating r ON f.id = r.food_id
    LEFT JOIN FoodIngredientMap fim ON f.id = fim.food_id
    LEFT JOIN Ingredient i ON fim.ingredient_id = i.id
    LEFT JOIN FoodDietaryRestriction fdr ON f.id = fdr.food_id
    LEFT JOIN DietaryRestriction dr ON fdr.diet_id = dr.id
  GROUP BY
    f.id, f.name;
  `
  try {
    const [results] = await db.query(sql);
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

app.get("/api/v1/foods/:id", async (req, res) => {
  const { id } = req.params;
  const queryFood = `
  SELECT
    f.id AS id,
    f.name AS name,
    AVG(r.score) AS avgRatings,
    GROUP_CONCAT(i.name) AS ingredients,
    GROUP_CONCAT(dr.name) AS dietaryRestrictions
  FROM
    Food f
    LEFT JOIN Rating r ON f.id = r.food_id
    LEFT JOIN FoodIngredientMap fim ON f.id = fim.food_id
    LEFT JOIN Ingredient i ON fim.ingredient_id = i.id
    LEFT JOIN FoodDietaryRestriction fdr ON f.id = fdr.food_id
    LEFT JOIN DietaryRestriction dr ON fdr.diet_id = dr.id
  WHERE
    f.id = ?
  GROUP BY
    f.id, f.name;
  `

  const queryReviews = `
  SELECT
    r.id AS id,
    r.review,
    r.score,
    u.username
  FROM
    Rating r
  JOIN User u ON r.user_id = u.id
  WHERE
    r.food_id = ?;
  `

  try {
    const [results] = await db.query(queryFood, 
      [id,]
    );

    const [reviews] = await db.query(queryReviews,
      [id,]
    );

    const data = {
      ...results[0],
      reviews
    }
    
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});



app.post(`/api/v1/foods/:id/addRating`, async (req, res) => {
  const { user_id, score, review } = req.body;
  const { id } = req.params;
  try {
    const [results] = await db.query(
      "INSERT INTO rating(user_id, food_id, score, review) VALUES (?,?,?,?)",
      [user_id, id, score, review]
    ).catch(err => {throw err});

    res.status(200).json({
      status: "success",
      data: results.insertId,
    });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

