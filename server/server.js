require("dotenv").config();
const express = require("express");
const PORT = process.env.PORT || 8080;
const morgan = require("morgan");
const db = require("./db");
const cors = require("cors");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app
  .route("/api/v1/foods")
  .get(async (req, res, next) => {
    try {
      const results = await db.query(
        "SELECT * FROM food LEFT JOIN (SELECT food_id, COUNT(*), TRUNC(AVG(score)) AS average_score FROM rating GROUP BY food_id) ratings ON food.id = ratings.food_id"
      );
      res.status(200).json({
        status: "success",
        results: results.rows.length,
        data: results.rows,
      });
    } catch (error) {
      console.log(error);
    }
  })
  .post(async (req, res, next) => {
    const { name, location } = req.body;
    try {
      const results = await db.query(
        "INSERT INTO food(name, location) VALUES($1, $2) returning *",
        [name, location]
      );
      res.status(200).json({
        status: "success",
        data: results.rows[0],
      });
    } catch (error) {
      console.log(error);
    }
  });

app
  .route("/api/v1/foods/:id")
  .get(async (req, res, next) => {
    try {
      const { id } = req.params;

      const results = await db.query(
        "SELECT * FROM food LEFT JOIN (SELECT food_id, COUNT(*), TRUNC(AVG(score)) AS average_score FROM rating GROUP BY food_id) ratings ON food.id = ratings.food_id WHERE id = $1",
        [id]
      );
      const ratings = await db.query(
        "SELECT * FROM rating WHERE food_id = $1",
        [id]
      );
      res.status(200).json({
        status: "success",
        data: {
          food: results.rows[0],
          ratings: ratings.rows,
        },
      });
    } catch (error) {
      console.log(error);
    }
  })
  .put(async (req, res, next) => {
    const { id } = req.params;
    const { name, location } = req.body;
    try {
      const results = await db.query(
        "UPDATE food SET name = $1, location = $2 WHERE id = $3 returning *",
        [name, location, id]
      );
      res.status(200).json({
        status: "success",
        data: results.rows[0],
      });
    } catch (error) {
      console.log(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const { id } = req.params;
      const results = await db.query(
        "DELETE FROM food WHERE id = $1 returning id",
        [id]
      );
      res.status(201).json({
        status: "success",
        data: results.rows[0],
      });
    } catch (error) {
      console.log(error);
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

app.listen(PORT, () => console.log("Magic happening on PORT", +PORT));