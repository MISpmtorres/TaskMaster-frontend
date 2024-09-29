import { createContext, useReducer, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Define the reducer function
export const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        default:
            return state;
    }
};

// Context provider component
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, { user: null });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch({ type: 'LOGIN', payload: user });
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
        console.clear();
    };

    //console.log('AuthContext state: ', state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
