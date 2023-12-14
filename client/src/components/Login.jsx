import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
    const [user, setUser] = useState('');
    const auth =  useAuth();
    const handleLogin = () => {
        const handleLogin = () => {
            auth.login(user);
        }
    }
    return (
        <div>
        <label>
            Username: {' '}
            <input type="text" onChange={e => setUser(e.target.value)}/>
        </label>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}