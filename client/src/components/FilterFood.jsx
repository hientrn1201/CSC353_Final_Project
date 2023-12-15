import React, { useContext, useState } from "react";
import FoodFinder from "../apis/FoodFinder";
import { FoodsContext } from "../context/FoodsContext";

const FilterFoods = () => {
  const { setFoods } = useContext(FoodsContext);
  const [rating, setRating] = useState("");
  const [dietaryRestriction, setDietaryRestriction] = useState("");

  const handleFilter = async (e) => {
    e.preventDefault();
    try {
      const response = await FoodFinder.get('/foods', {
        params: {
          rating: rating,
          dietaryRestriction: dietaryRestriction,
        },
      });
      setFoods(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleFilter}>
        <div className="form-row m-3">
          <div className="col">
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="form-control"
              placeholder="Minimum Rating"
            />
          </div>
          <div className="col">
            <select
              value={dietaryRestriction}
              onChange={(e) => setDietaryRestriction(e.target.value)}
              className="custom-select"
            >
              <option value="">Select Dietary Restriction</option>
              <option value="None">None</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Gluten-Free">Gluten-Free</option>
            </select>
          </div>
          <button className="col-auto btn btn-primary">Filter</button>
        </div>
      </form>
    </div>
  );
};

export default FilterFoods;
