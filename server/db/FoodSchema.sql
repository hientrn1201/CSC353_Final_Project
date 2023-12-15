DROP SCHEMA IF EXISTS Food;

CREATE SCHEMA Food;

USE Food;

CREATE TABLE User
(
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(50)
);

CREATE TABLE Food
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(10000)
);

CREATE TABLE Rating
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT,
    food_id    INT,
    score      INT,
    review     VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User (id),
    FOREIGN KEY (food_id) REFERENCES food (id)
);

CREATE TABLE DietaryRestriction
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name ENUM ('Vegetarian', 'Vegan', 'Gluten-Free', 'None')
);

INSERT INTO DietaryRestriction (name)
VALUES ('Vegetarian'),
       ('Vegan'),
       ('Gluten-Free'),
       ('None');


CREATE TABLE FoodDietaryRestriction
(
    id      INT AUTO_INCREMENT PRIMARY KEY,
    food_id INT,
    diet_id INT,
    FOREIGN KEY (food_id) REFERENCES food (id),
    FOREIGN KEY (diet_id) REFERENCES dietaryRestriction (id)
);

CREATE TABLE Ingredient
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE FoodIngredientMap
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    food_id       INT,
    ingredient_id INT,
    FOREIGN KEY (food_id) REFERENCES food (id),
    FOREIGN KEY (ingredient_id) REFERENCES ingredient (id)
);

