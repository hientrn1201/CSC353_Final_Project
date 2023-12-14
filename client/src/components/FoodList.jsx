import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'; // Assuming you are using React Bootstrap
import FoodFinder from '../apis/FoodFinder'; // Adjust the import based on your actual API file
import { FoodsContext } from '../context/FoodsContext'; // Adjust the context import

const FoodList = (props) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const { foods, setFoods, deleteFood } = useContext(FoodsContext); // Adjust context usage

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    history.push(`/foods/${id}/update`); // Update the URL for food
  };

  const handleFoodSelect = (id) => {
    history.push(`/foods/${id}`); // Update the URL for food
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    FoodFinder.delete(`/${id}`) // Adjust the API call
      .then(function (response) {
        deleteFood(id); // Adjust the delete function
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    FoodFinder.get("/") // Adjust the API call
      .then((response) => {
        setFoods(response.data.data); // Adjust the state-setting function
      })
      .then(() => {
        setIsLoading((prevState) => !prevState);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [setFoods]);

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
    <div className="table-responsive">
      <table className="table table-striped table-hover table-dark">
        <thead>
          <tr className="bg-primary">
            <th scope="col">Food Name</th>
            <th scope="col">Ingredients</th>
            <th scope="col">Dietary Restrictions</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {foods.map(
            ({ id, name, ingredients, dietaryRestrictions }) => ( // Adjust based on your food data structure
              <tr onClick={() => handleFoodSelect(id)} key={id}>
                <th scope="row">{name}</th>
                <td>{ingredients}</td> {/* Adjust how you display ingredients */}
                <td>{dietaryRestrictions}</td> {/* Adjust how you display dietary restrictions */}
                <td>
                  <button
                    onClick={(e) => handleUpdate(e, id)}
                    className="btn btn-warning"
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    onClick={(e) => handleDelete(e, id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FoodList;