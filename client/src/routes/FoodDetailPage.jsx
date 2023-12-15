import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FoodFinder from '../apis/FoodFinder'; // Adjust the import to your Food API
import AddReview from '../components/AddReview'; // If you have food-specific review functionality
import Reviews from '../components/Reviews'; // Adjust as needed for food-specific reviews
import StarRating from '../components/StarRating'; // If applicable to food
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FoodsContext } from '../context/FoodsContext'; // Change to FoodsContext
import './FoodDetailPage.css'; // Import your CSS file

const FoodDetailPage = () => {
  const {id} = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const {selectedFood, setSelectedFood} = useContext(FoodsContext);

  useEffect(() => {
  const fetchFoodDetails = async () => {
    setIsLoading(true);
    try {
      const response = await FoodFinder.get(`/foods/${id}`);
      setSelectedFood(response.data.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  fetchFoodDetails();
}, [id, setSelectedFood]);




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
    <div className="food-detail-container">
      {selectedFood && (
        <>
          <h1 className="food-detail-heading text-center">{selectedFood.name}</h1>
          <div className="text-center">
            {selectedFood.avgRatings &&
              <>
                <StarRating rating={selectedFood.avgRatings} />
                <p className="food-detail-rating">Average Rating: {selectedFood.avgRatings}</p>
              </>
            }
            <p className="food-detail-text">Ingredients: {selectedFood.ingredients}</p>
            <p className="food-detail-text">Dietary Restrictions: {selectedFood.dietaryRestrictions}</p>
          </div>
          <div className="food-detail-reviews">
            {selectedFood.reviews && <Reviews reviews={selectedFood.reviews} />}
          </div>
          <AddReview foodId={id} />
        </>
      )}
    </div>
  );
}

export default FoodDetailPage;
