import { useState } from "react";

export const useAuth = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('http://localhost:4000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const json = await response.json();
        setIsLoading(false);

        if (!response.ok) {
            setError(json.error);
        } else {
            // Save token and user data
            localStorage.setItem('user', JSON.stringify(json));
        }
    };

    const signup = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('http://localhost:4000/api/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const json = await response.json();
        setIsLoading(false);

        if (!response.ok) {
            setError(json.error);
        } else {
            // Save token and user data
            localStorage.setItem('user', JSON.stringify(json));
        }
    };

    return { login, signup, error, isLoading };
};
