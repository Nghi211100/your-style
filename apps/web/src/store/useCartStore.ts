import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

interface CartState {
  items: CartItem[];
  sessionId: string | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  initializeSession: () => Promise<void>;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const API_URL = process.env.API_URL;

const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem('your-style-session-id');
  if (!sid) {
    sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('your-style-session-id', sid);
  }
  return sid;
};

const syncWithBackend = async (sessionId: string, items: CartItem[]) => {
  try {
    await fetch(`${API_URL}/cart/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });
  } catch (error) {
    console.error('Failed to sync cart with backend:', error);
  }
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: null,
      isOpen: false,
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      initializeSession: async () => {
        const sid = getSessionId();
        set({ sessionId: sid });
        try {
          const res = await fetch(`${API_URL}/cart/${sid}`);
          if (res.ok) {
            const backendItems = await res.json();
            if (backendItems && backendItems.length > 0) {
              set({ items: backendItems });
            }
          }
        } catch (error) {
          console.error('Failed to load cart from backend:', error);
        }
      },

      addItem: async (item) => {
        const sid = get().sessionId || getSessionId();
        if (!get().sessionId) set({ sessionId: sid });

        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
          );
          
          let newItems = [...state.items];
          if (existingItemIndex > -1) {
            newItems[existingItemIndex].quantity += item.quantity;
          } else {
            const id = `${item.productId}-${item.size || 'na'}-${item.color || 'na'}`;
            newItems.push({ ...item, id });
          }
          
          setTimeout(() => syncWithBackend(sid, newItems), 0);
          return { items: newItems };
        });
        get().openCart();
      },
      
      removeItem: async (id) => {
        const sid = get().sessionId || getSessionId();
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          setTimeout(() => syncWithBackend(sid, newItems), 0);
          return { items: newItems };
        });
      },
      
      updateQuantity: async (id, quantity) => {
        const sid = get().sessionId || getSessionId();
        set((state) => {
          const newItems = state.items.map((item) => 
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          );
          setTimeout(() => syncWithBackend(sid, newItems), 0);
          return { items: newItems };
        });
      },
      
      clearCart: async () => {
        const sid = get().sessionId || getSessionId();
        set({ items: [] });
        try {
          await fetch(`${API_URL}/cart/${sid}`, { method: 'DELETE' });
        } catch (error) {
          console.error('Failed to clear cart in backend:', error);
        }
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'your-style-cart',
      partialize: (state) => ({ items: state.items, sessionId: state.sessionId }),
    }
  )
);
