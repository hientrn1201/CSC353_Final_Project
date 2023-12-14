import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FoodFinder from '../apis/FoodFinder'; // Adjust the import to your Food API
import AddReview from '../components/AddReview'; // If you have food-specific review functionality
import Reviews from '../components/Reviews'; // Adjust as needed for food-specific reviews
import StarRating from '../components/StarRating'; // If applicable to food
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FoodsContext } from '../context/FoodsContext'; // Change to FoodsContext

const FoodDetailPage = () => {
  const {id} = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const {selectedFood, setSelectedFood} = useContext(FoodsContext);

  useEffect(() => {
    FoodFinder.get(`/${id}`) // Adjust the API call
      .then((response) => {
        const data = response.data.data;
        setSelectedFood(data);
      })
      .then(()=>{
        setIsLoading(prev => !prev);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setSelectedFood, id]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      {selectedFood && (
        <>
          <h1 className="font-weight-light display-1 text-center">{selectedFood.food.name}</h1>
          {/* Adjust the displayed information according to your food data structure */}
          {/* Include other food-specific details like ingredients, dietary restrictions, etc. */}
          <div className="mt-3">
            <Reviews reviews={selectedFood}/> {/* Adjust as needed */}
          </div>
          <AddReview /> {/* If applicable to food */}
        </>
      )}
    </div>
  )
}

export default FoodDetailPage;
