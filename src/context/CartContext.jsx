import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { parsePriceToCents } from '../utils/money.js';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'luxora-cart';

function createProductSnapshot(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    finish: product.finish,
    spec: product.spec,
    priceCents:
      typeof product.priceCents === 'number'
        ? product.priceCents
        : parsePriceToCents(product.price),
    currency: product.currency ?? 'USD',
    tone: product.tone,
    visual: product.visual,
  };
}

function normalizeStoredItem(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const productId = item.productId ?? item.id;
  const quantity = Number(item.quantity);

  if (!productId || !Number.isFinite(quantity) || quantity < 1) {
    return null;
  }

  const snapshotSource = item.productSnapshot ?? item;
  const productSnapshot = createProductSnapshot({
    ...snapshotSource,
    id: snapshotSource.id ?? productId,
  });

  if (
    !productSnapshot.name ||
    typeof productSnapshot.priceCents !== 'number'
  ) {
    return null;
  }

  return {
    productId,
    quantity,
    productSnapshot,
  };
}

function readStoredCart() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart = storedCart ? JSON.parse(storedCart) : [];

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart.map(normalizeStoredItem).filter(Boolean);
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
      const existingItem = currentItems.find(
        (item) => item.productId === product.id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          productId: product.id,
          productSnapshot: createProductSnapshot(product),
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
      currentItems.filter((item) => item.productId !== productId),
    );
  }, []);

  const increaseQuantity = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }, []);

  const decreaseQuantity = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.productId === productId
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
        (total, item) =>
          total + item.productSnapshot.priceCents * item.quantity,
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
