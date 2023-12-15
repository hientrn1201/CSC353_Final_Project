import { useState, createContext, useContext } from "react";
import FoodFinder from "../apis/FoodFinder";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const signup = async (username, password) => {
        FoodFinder.post("/users/signup", { username, password, })
        .then((res) => {
            const id  = res.data.data;
            setCurrentUser({ id, username });
        })
        .catch((err) => console.log(err));
    }

    const login = async (username, password) => {
        FoodFinder.post("/users/login", { username, password })
        .then((res) => {
            const id  = res.data.data.id;
            setCurrentUser({ id, username });
        })
        .catch((err) => console.log(err));
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
