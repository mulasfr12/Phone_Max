import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'luxora-cart';

export function parsePrice(price) {
  const numericPrice = Number(String(price).replace(/[^0-9.]/g, ''));
  return Number.isFinite(numericPrice) ? numericPrice : 0;
}

function readStoredCart() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!notification) {
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setNotification(null);
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [notification]);

  const addToCart = useCallback((product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          finish: product.finish,
          spec: product.spec,
          price: product.price,
          tone: product.tone,
          visual: product.visual,
          quantity: 1,
        },
      ];
    });

    setNotification({
      id: `${product.id}-${Date.now()}`,
      productName: product.name,
      finish: product.finish,
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId),
    );
  }, []);

  const increaseQuantity = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + parsePrice(item.price) * item.quantity,
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      notification,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      dismissNotification,
    }),
    [
      items,
      itemCount,
      subtotal,
      notification,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      dismissNotification,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
