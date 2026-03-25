import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const initialState = {
    items: [],
    loading: false,
};

function cartReducer(state, action) {
    switch (action.type) {
        case 'SET_CART':
            return { ...state, items: action.payload, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: true };
        case 'CLEAR':
            return { ...state, items: [], loading: false };
        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const { user, token } = useAuth();

    // Fetch cart function
    const fetchCart = useCallback(async () => {
        try {
            dispatch({ type: 'SET_LOADING' });
            const { data } = await API.get('/cart');
            dispatch({ type: 'SET_CART', payload: data.items || [] });
        } catch {
            dispatch({ type: 'SET_CART', payload: [] });
        }
    }, []);

    // Fetch cart when user logs in
    useEffect(() => {
        if (user && user.role === 'user' && token) {
            fetchCart();
        } else {
            dispatch({ type: 'CLEAR' });
        }
    }, [user, token, fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        try {
            const { data } = await API.post('/cart', { productId, quantity });
            dispatch({ type: 'SET_CART', payload: data.items || [] });
        } catch (error) {
            console.error('Add to cart failed:', error);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const { data } = await API.put(`/cart/${productId}`, { quantity });
            dispatch({ type: 'SET_CART', payload: data.items || [] });
        } catch (error) {
            console.error('Update cart failed:', error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const { data } = await API.delete(`/cart/${productId}`);
            dispatch({ type: 'SET_CART', payload: data.items || [] });
        } catch (error) {
            console.error('Remove from cart failed:', error);
        }
    };

    const clearCart = async () => {
        try {
            await API.delete('/cart/clear');
            dispatch({ type: 'CLEAR' });
        } catch (error) {
            console.error('Clear cart failed:', error);
        }
    };

    const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = state.items.reduce((sum, item) => {
        const price = item.product?.price || 0;
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider value={{
            ...state, cartCount, cartTotal,
            addToCart, updateQuantity, removeFromCart, clearCart, fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
