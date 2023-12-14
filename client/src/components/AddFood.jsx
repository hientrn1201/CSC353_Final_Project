import FoodFinder from "../apis/FoodFinder"; // Adjust the import to your Food API
import React, { useContext, useState } from "react";
import { FoodsContext } from "../context/FoodsContext";

const AddFood = () => {
  const { addFood } = useContext(FoodsContext);
  const [name, setName] = useState("");
  const [ingredient, setIngredient] = useState(""); // Changed from location to ingredient
  // Add any other state variables relevant to food (e.g., dietary restrictions)

  const isDisabled = name.trim().length === 0 || ingredient.trim().length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    FoodFinder.post('/', {
      name,
      ingredient, // Changed from location
      // Include any other relevant food fields here
    })
    .then(function (response) {
      addFood(response.data.data); // Ensure this function matches your context
      setName("");
      setIngredient("");
      // Reset any other state variables if necessary
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSubmit}>
        <div className="form-row m-3">
          <div className="col">
            <input
              type="text"
              value={name}
              className="form-control"
              onChange={(e) => setName(e.target.value)}
              placeholder="Food Name"
            />
          </div>
          <div className="col">
            <input
              type="text"
              value={ingredient}
              className="form-control"
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="Main Ingredient"
            />
          </div>
          {/* Include additional form elements for other food attributes */}
          <button type="submit" disabled={isDisabled} className="col-auto btn btn-primary">Add Food</button>
        </div>
      </form>
    </div>
  );
};

export default AddFood;
