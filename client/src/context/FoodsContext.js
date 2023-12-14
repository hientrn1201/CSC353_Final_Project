import React, { createContext, useState } from "react";

export const FoodsContext = createContext();

export const FoodsContextProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);

  const addFood = (food) => {
    setFoods([...foods, food]);
  };

  const deleteFood = (id) => {
    let updatedFoods = foods.filter((food) => food.id !== id);
    setFoods(updatedFoods);
  };

  return (
    <FoodsContext.Provider
      value={{
        foods,
        setFoods,
        addFood,
        deleteFood,
        selectedFood,
        setSelectedFood,
      }}
    >
      {children}
    </FoodsContext.Provider>
  );
};
