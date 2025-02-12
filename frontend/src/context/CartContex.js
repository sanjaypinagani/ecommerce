import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState({
    user:null,
    items:null,
    wishlist:null
  });
  return (
    <CartContext.Provider value={[cart, setCart]}>
      { children }
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);
export {CartContextProvider,useCart}


