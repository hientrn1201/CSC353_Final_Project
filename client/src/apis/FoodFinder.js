import axios from "axios";
import axiosRetry from "axios-retry";

const FoodFinder = axios.create({
  baseURL:
    process.env.NODE_ENV !== "production"
      ? "http://localhost:8000/api/v1/foods"
      : "https://your-deployment-url.com/api/v1/foods",
  timeout: 5000,
});

axiosRetry(FoodFinder, { retries: 3 });

export default FoodFinder;

