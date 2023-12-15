import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import FoodFinder from "../apis/FoodFinder";
import { useAuth } from "../context/AuthContext";

const AddReview = () => {
  const {id} = useParams()
  const history = useHistory()
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");
  const { currentUser } = useAuth();
  const userId =  currentUser ? currentUser.id : '';

  const isDisabled = review.trim().length === 0

  const handleSubmit = e => {
    if (!currentUser) {
      alert("Please log in to leave a review.");
      history.push('/auth')
    } else {
      e.preventDefault();
      FoodFinder.post(`/foods/${id}/addReview`, {
        userId,
        rating,
        review,
      })
      .then(function (response) {
        alert("Review submitted!");
        setRating(0);
        setReview("");
        history.push('/')
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">

          <div className="form-group col-4">
            <label htmlFor="rating">Rating</label>
            <select
              onChange={(e) => setRating(e.target.value)}
              value={rating}
              name="rating"
              id="rating"
              className="custom-select"
            >
              <option disabled>Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="review">Review</label>
          <textarea value={review} onChange={e=> setReview(e.target.value)} className="form-control" rows="5"></textarea>
        </div>
        <button disabled={isDisabled} className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default AddReview;
