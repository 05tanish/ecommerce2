import { createContext, useContext, useReducer, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
};

function authReducer(state, action) {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, loading: true, error: null };
        case 'AUTH_SUCCESS':
            return { ...state, loading: false, user: action.payload.user, token: action.payload.token, error: null };
        case 'AUTH_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'LOGOUT':
            return { ...state, user: null, token: null, error: null };
        case 'UPDATE_USER':
            return { ...state, user: action.payload };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        if (state.token) {
            localStorage.setItem('token', state.token);
        } else {
            localStorage.removeItem('token');
        }
        if (state.user) {
            localStorage.setItem('user', JSON.stringify(state.user));
        } else {
            localStorage.removeItem('user');
        }
    }, [state.token, state.user]);

    const login = async (email, password) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const { data } = await API.post('/auth/login', { email, password });
            dispatch({ type: 'AUTH_SUCCESS', payload: data });
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || 'Login failed';
            dispatch({ type: 'AUTH_ERROR', payload: msg });
            throw new Error(msg);
        }
    };

    const register = async (userData) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const { data } = await API.post('/auth/register', userData);
            dispatch({ type: 'AUTH_SUCCESS', payload: data });
            return data;
        } catch (error) {
            const msg = error.response?.data?.message || 'Registration failed';
            dispatch({ type: 'AUTH_ERROR', payload: msg });
            throw new Error(msg);
        }
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (user) => {
        dispatch({ type: 'UPDATE_USER', payload: user });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
