import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import FoodFinder from "../apis/FoodFinder";

const UpdateFood = () => {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [ingredient, setIngredient] = useState(""); // Changed from location to ingredient
  const [price, setPrice] = useState(1); // Assuming you still want to keep price

  useEffect(() => {
    FoodFinder.get(`/${id}`)
      .then((response) => {
        const food = response.data.data.food; // Adjust based on your API response structure
        setName(food.name);
        setIngredient(food.ingredient); // Adjust based on your food item structure
        setPrice(food.price); // Assuming price is a property of your food item
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();
    FoodFinder.put(`/${id}`, {
      name,
      ingredient, // Changed from location to ingredient
      price, // Assuming you're updating price
    })
      .then(function () {
        history.push("/"); // Adjust redirection as needed
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <h1 className="font-weight-light display-2 text-center">
        Update {name}
      </h1>
      <div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
              id="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ingredient">Main Ingredient</label>
            <input
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              className="form-control"
              id="ingredient"
            />
          </div>
          {/* Include other form elements for additional food item attributes as needed */}
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="1"
              max="5"
              className="form-control"
              id="price"
            />
          </div>
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    </>
  );
};

export default UpdateFood; // Correct the export statement
