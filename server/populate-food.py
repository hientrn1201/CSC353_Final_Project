import csv
import mysql.connector

# Establish a database connection
db = mysql.connector.connect(
    host='localhost',
    user='root',
    password='33511804'
)

cursor = db.cursor()

databaseName = "Food"

try:
    cursor.execute("DROP DATABASE IF EXISTS {}".format(databaseName))
except mysql.connector.Error as error_descriptor:
    print("Failed dropping database: {}".format(error_descriptor))
    exit(1)

try:
    cursor.execute("CREATE DATABASE {}".format(databaseName))
except mysql.connector.Error as error_descriptor:
    print("Failed creating database: {}".format(error_descriptor))
    exit(1)

try:
    cursor.execute("USE {}".format(databaseName))
except mysql.connector.Error as error_descriptor:
    print("Failed using database: {}".format(error_descriptor))
    exit(1)

with open("db/FoodSchema.sql", "r") as schema_file:
    schema_string = schema_file.read()

try:
    for result in cursor.execute(schema_string, multi=True):
        pass
except mysql.connector.Error as error_descriptor:
    if error_descriptor.errno == mysql.connector.errorcode.ER_TABLE_EXISTS_ERROR:
        print("Table already exists: {}".format(error_descriptor))
    else:
        print("Failed creating schema: {}".format(error_descriptor))
    exit(1)

cursor.close()

cursor = db.cursor()


def insert_food(name):
    query = "INSERT INTO Food (name) VALUES (%s)"
    cursor.execute(query, (name,))
    return cursor.lastrowid


# Function to insert ingredient
def insert_ingredient(name):
    if not name or name.strip() == "":
        return None
    query = "SELECT id FROM Ingredient WHERE name = %s"
    cursor.execute(query, (name,))
    result = cursor.fetchone()

    if result:
        return result[0]

    else:
        insert_query = "INSERT INTO Ingredient (name) VALUES (%s)"
        cursor.execute(insert_query, (name,))
        return cursor.lastrowid


# Function to insert food-ingredient relationship
def insert_ingredient_food(food_id, ingredient_id):
    query = "INSERT INTO FoodIngredientMap (food_id, ingredient_id) VALUES (%s, %s)"
    cursor.execute(query, (food_id, ingredient_id))


def get_dietary_restriction_id(diet_name):
    query = "SELECT id FROM DietaryRestriction WHERE name = %s"
    cursor.execute(query, (diet_name,))
    result = cursor.fetchone()
    return result[0] if result else None

# Function to map CSV diet abbreviations to ENUM values


def map_diet_to_enum(diet_abbreviation):
    mapping = {
        'VG': 'Vegetarian',
        'V': 'Vegan',
        'MWG': 'Gluten-Free',
        'None': 'None'
    }
    return mapping.get(diet_abbreviation, 'None')  # Default to 'None'

# Function to insert food-dietary restriction relationship


def insert_food_dietary_restriction(food_id, diet_id):
    query = "INSERT INTO FoodDietaryRestriction (food_id, diet_id) VALUES (%s, %s)"
    cursor.execute(query, (food_id, diet_id))


# Read CSV and insert data
with open('food-data.csv', 'r') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        # Insert food
        food_id = insert_food(row['Food Name'])

        # Insert ingredients and link to food
        ingredients = row['Ingredient'].split(', ')
        for ingredient in ingredients:
            ingredient_id = insert_ingredient(ingredient)
            if ingredient_id:  # Only insert if ingredient_id is not None
                insert_ingredient_food(food_id, ingredient_id)

        diets = row['Diets'].split(', ')
        for diet in diets:
            diet_name = map_diet_to_enum(diet)
            diet_id = get_dietary_restriction_id(diet_name)
            if diet_id:
                insert_food_dietary_restriction(food_id, diet_id)

        # Commit each food item to the database
        db.commit()

# Close the database connection
cursor.close()
db.close()
