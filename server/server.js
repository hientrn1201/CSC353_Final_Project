const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());

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
    const sql = `
        SELECT f.id                           AS id,
               f.name                         AS name,
               AVG(r.score)                   AS avgRatings,
               GROUP_CONCAT(DISTINCT i.name)  AS ingredients,
               GROUP_CONCAT(DISTINCT dr.name) AS dietaryRestrictions
        FROM Food f
                 LEFT JOIN Rating r ON f.id = r.food_id
                 LEFT JOIN FoodIngredientMap fim ON f.id = fim.food_id
                 LEFT JOIN Ingredient i ON fim.ingredient_id = i.id
                 LEFT JOIN FoodDietaryRestriction fdr ON f.id = fdr.food_id
                 LEFT JOIN DietaryRestriction dr ON fdr.diet_id = dr.id
        GROUP BY f.id, f.name;
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
    const {id} = req.params;
    const queryFood = `
        SELECT f.id                           AS id,
               f.name                         AS name,
               AVG(r.score)                   AS avgRatings,
               GROUP_CONCAT(DISTINCT i.name)  AS ingredients,
               GROUP_CONCAT(DISTINCT dr.name) AS dietaryRestrictions
        FROM Food f
                 LEFT JOIN Rating r ON f.id = r.food_id
                 LEFT JOIN FoodIngredientMap fim ON f.id = fim.food_id
                 LEFT JOIN Ingredient i ON fim.ingredient_id = i.id
                 LEFT JOIN FoodDietaryRestriction fdr ON f.id = fdr.food_id
                 LEFT JOIN DietaryRestriction dr ON fdr.diet_id = dr.id
        WHERE f.id = ?
        GROUP BY f.id, f.name;

    `

    const queryReviews = `
        SELECT r.id AS id,
               r.review,
               r.score,
               u.username
        FROM Rating r
                 JOIN User u ON r.user_id = u.id
        WHERE r.food_id = ?;
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


app.post(`/api/v1/foods/:id/addReview`, async (req, res) => {
    const {userId, rating, review} = req.body;
    const {id} = req.params;
    try {
        const [results] = await db.query(
            "INSERT INTO rating (user_id, food_id, score, review) VALUES (?, ?, ?, ?)",
            [userId, id, rating, review]
        );

        res.status(201).json({
            status: "success",
            data: {
                insertId: results.insertId,
            },
        });
    } catch (error) {
        console.error("Error in adding review:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred during the review submission process.",
        });
    }
});


app.post(`/api/v1/users/signup`, async (req, res) => {
    const {username, password} = req.body;
    console.log('Received username:', username);

    try {
        const [existingUsers, fields] = await db.query(
            "SELECT * FROM user WHERE username = ?",
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                status: "fail",
                message: "Username already exists",
            });
        }

        const [result] = await db.query(
            "INSERT INTO user(username, password) VALUES (?, ?)",
            [username, password]
        );

        return res.status(201).json({
            status: "success",
            data: {
                id: result.insertId,
                username,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({
            status: "error",
            message: "An error occurred during the signup process.",
        });
    }
});


app.post(`/api/v1/users/login`, async (req, res) => {
    const {username, password} = req.body;
    try {
        const [results] = await db.query(
            "SELECT id FROM user WHERE username = ? AND password = ?",
            [username, password]
        ).catch(err => {
            throw err
        });

        if (!results.length) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid username or password",
            });
        }

        res.status(200).json({
            status: "success",
            data: results[0],
        });
    } catch (error) {
        res.send(error);
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

