import React, {useContext, useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner'; // Assuming you are using React Bootstrap
import FoodFinder from '../apis/FoodFinder'; // Adjust the import based on your actual API file
import {FoodsContext} from '../context/FoodsContext'; // Adjust the context import
import {useAuth} from '../context/AuthContext'; // Import useAuth
import StarRating from "./StarRating";
import './FoodList.css'; // Import your CSS file

const FoodList = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const {foods, setFoods} = useContext(FoodsContext);
    const [filterRating, setFilterRating] = useState(0);
    const [filterRestriction, setFilterRestriction] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const {currentUser, logout} = useAuth();
    const [searchQuery, setSearchQuery] = useState("");


    const handleLogout = async () => {
        try {
            await logout();
            history.push('/auth');
        } catch (error) {
            console.error("Logout Failed", error);
        }
    };


    const handleFoodSelect = (id) => {
        history.push(`/foods/${id}`);
    };

    useEffect(() => {
        FoodFinder.get("/foods")
            .then((response) => {
                setFoods(response.data.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [setFoods]);

    const filteredFoods = foods.filter(food => {
        const matchesRating = filterRating === 0 || food.avgRatings >= filterRating;
        const matchesRestriction = filterRestriction === "" || food.dietaryRestrictions.includes(filterRestriction);
        const matchesSearch = searchQuery === "" || food.name.toLowerCase().includes(searchQuery.toLowerCase()) || food.ingredients.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesRating && matchesRestriction && matchesSearch;
    });

    const sortFoods = (field) => {
        const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(newDirection);
    };

    const sortedFoods = [...filteredFoods].sort((a, b) => {
        if (sortField === "name") {
            return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        } else if (sortField === "avgRatings") {
            return sortDirection === "asc" ? a.avgRatings - b.avgRatings : b.avgRatings - a.avgRatings;
        }
        return 0;
    });

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
            <div className="auth-button-container">
                {currentUser ? (
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <button onClick={() => history.push('/auth')}>Login</button>
                )}
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Food Name or Ingredients"
                />
                <input
                    type="number"
                    className="filter-input"
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    placeholder="Minimum Rating"
                />
                <select
                    className="filter-select"
                    value={filterRestriction}
                    onChange={(e) => setFilterRestriction(e.target.value)}
                >
                    <option value="">Select Dietary Restriction</option>
                    <option value="None">None</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                </select>
            </div>
            <div className="table-responsive">
                <table className="table table-striped table-hover food-table">
                    <thead>
                    <tr className="bg-primary">
                        <th scope="col" className="name-cell" onClick={() => sortFoods("name")}>Food Name</th>
                        <th scope="col" className="rating-cell" onClick={() => sortFoods("avgRatings")}>Average
                            Ratings
                        </th>
                        <th scope="col" className="ingredients-cell">Ingredients</th>
                        <th scope="col" className="restriction-cell">Dietary Restrictions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedFoods.map(({id, name, avgRatings, ingredients, dietaryRestrictions}) => (
                        <tr onClick={() => handleFoodSelect(id)} key={id}>
                            <th scope="row">{name}</th>
                            <td className="rating-cell"><StarRating rating={avgRatings}/></td>
                            <td className="ingredients-cell">{ingredients}</td>
                            <td>{dietaryRestrictions}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

};
export default FoodList;
