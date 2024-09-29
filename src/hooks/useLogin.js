import { useState } from "react";
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:4000/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const json = await response.json();
                throw new Error(json.error || 'Login failed');
            }

            const json = await response.json();
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });

            const userData = JSON.parse(localStorage.getItem('user'));
            //const userid = userData ? userData.user.id : null; // Safely access the user ID
            const userToken = userData ? userData.user.token : null; // Safely access the user ID
    
    
    
            console.log('on login hecking token: ', JSON.stringify(userToken, null, 2));


            // Redirect to home page
            window.location.href = 'http://localhost:3000/';

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};
