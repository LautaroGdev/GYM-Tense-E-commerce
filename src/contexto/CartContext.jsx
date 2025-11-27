import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    
    const isInCart = useCallback((itemId) => {
        return cart.some(item => item.id === itemId);
    }, [cart]);

    const addItem = useCallback((item, quantity) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);

            if (existingItemIndex > -1) {
                
                const newCart = [...prevCart];
                newCart[existingItemIndex] = { 
                    ...newCart[existingItemIndex], 
                    quantity: newCart[existingItemIndex].quantity + quantity 
                };
                return newCart;
            } else {
                
                return [...prevCart, { ...item, quantity }];
            }
        });
    }, []); 


    // Saca un item del carrito
    const removeItem = useCallback((itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    }, []); 


    // Vacia todo el carrito
    const clearCart = useCallback(() => {
        setCart([]);
    }, []); 




    // Cantidad total de productos (para el CartWidget)
    const totalItems = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.quantity, 0);
    }, [cart]);

    // Precio total de la compra
    const totalPrice = useMemo(() => {
        return cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    }, [cart]);

    //
    const getQuantityById = useCallback((itemId) => {
        const item = cart.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    }, [cart]); 
    
    // Usamos useMemo para memoizar el objeto de contexto
    const contextValue = useMemo(() => ({
        cart,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        clearCart,
        isInCart,
        getQuantityById, 
    }), [cart, totalItems, totalPrice, addItem, removeItem, clearCart, isInCart, getQuantityById]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};