import React from "react"
import AddFood from "../components/AddFood"
import Header from "../components/Header"
import FoodList from "../components/FoodList"

const Home = (props) => {
  return (
    <div>
      <Header/>
      <AddFood/>
      <FoodList />
    </div>
  )
};

export default Home;
