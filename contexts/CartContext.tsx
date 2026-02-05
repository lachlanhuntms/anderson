'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface CartItem {
  productId: number;
  productName: string;
  monthlyPrice: number;
  totalAnnualPrice: number;
  billingType: 'monthly' | 'annual';
}

interface CartContextType {
  cartItems: CartItem[];
  previewItem: CartItem | null;
  showSuccess: boolean;
  addToCart: (item: CartItem) => void;
  updatePreview: (item: CartItem) => void;
  commitPreview: () => void;
  clearCart: () => void;
  setShowSuccess: (show: boolean) => void;
  getTotalPrice: () => number;
  getPreviewPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'anderson_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [previewItem, setPreviewItem] = useState<CartItem | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        if (cartItems.length > 0) {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cartItems, isLoaded]);

  const addToCart = useCallback((item: CartItem) => {
    // Only one membership allowed at a time - always replace old with new
    setCartItems([item]);
  }, []);

  const updatePreview = useCallback((item: CartItem) => {
    // Update preview state (used for /plans page display)
    setPreviewItem(item);
  }, []);

  const commitPreview = useCallback(() => {
    // Commit preview to committed cart and localStorage
    if (previewItem) {
      setCartItems([previewItem]);
    }
  }, [previewItem]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setPreviewItem(null);
  }, []);

  const setShowSuccessHandler = useCallback((show: boolean) => {
    setShowSuccess(show);
  }, []);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Use totalAnnualPrice if annual, monthlyPrice if monthly
      const price = item.billingType === 'annual' ? item.totalAnnualPrice : item.monthlyPrice;
      return total + price;
    }, 0);
  };

  const getPreviewPrice = () => {
    if (!previewItem) return 0;
    // Use totalAnnualPrice if annual, monthlyPrice if monthly
    return previewItem.billingType === 'annual' 
      ? previewItem.totalAnnualPrice 
      : previewItem.monthlyPrice;
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      previewItem,
      showSuccess,
      addToCart, 
      updatePreview,
      commitPreview,
      clearCart,
      setShowSuccess: setShowSuccessHandler,
      getTotalPrice,
      getPreviewPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
