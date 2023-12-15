import { useState, createContext, useContext } from "react";
import FoodFinder from "../apis/FoodFinder";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

   const signup = async (username, password) => {
    try {
        await FoodFinder.post("/users/signup", { username, password });
    } catch (err) {
        throw err;
    }
}


    const login = async (username, password) => {
        try {
            const response = await FoodFinder.post("/users/login", { username, password });
            const id = response.data.data.id;
            setCurrentUser({ id, username });
        } catch (err) {
            throw err;
        }
    };

    const logout = () => {
        setCurrentUser(null);
    };
    
    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}
