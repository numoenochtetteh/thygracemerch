import { paystackStorefrontUrl } from '@/config/storefront';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';
import { ShopifyProduct, createCheckout, demoModeEnabled, getLocalProductByHandle } from '@/lib/shopify';

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

// Reconcile persisted local carts with the client's current prices and size range.
// Connected Shopify carts continue to use their provider data.
function currentCartItem(item: CartItem): CartItem | null {
  if (!item?.product?.node?.handle || !Number.isInteger(item.quantity) || item.quantity <= 0) return null;
  if (!demoModeEnabled()) return item;
  const product = getLocalProductByHandle(item.product.node.handle);
  if (!product || product.tags.includes('coming-soon')) return null;
  const variant = product.variants.edges.find(edge => edge.node.id === item.variantId)?.node;
  if (!variant?.availableForSale) return null;
  return { ...item, product: { node: product }, price: variant.price, variantTitle: variant.title, selectedOptions: variant.selectedOptions };
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
  checkout: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isOpen: false,

      addItem: (submitted) => {
        const item = currentCartItem(submitted);
        if (!item) { toast.info('This item or size is not available to order yet.'); return; }
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        
        if (existingItem) {
          set({
            items: items.map(i =>
              i.variantId === item.variantId
                ? { ...item, quantity: i.quantity + item.quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        set({
          items: get().items.map(item =>
            item.variantId === variantId ? { ...item, quantity } : item
          )
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter(item => item.variantId !== variantId)
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setOpen: (isOpen) => set({ isOpen }),

      checkout: async () => {
        const { items, setLoading } = get();
        if (items.length === 0) return;

        if (paystackStorefrontUrl) {
          // The hosted store has its own cart. Never imply that local cart items transfer.
          window.location.assign(paystackStorefrontUrl);
          return;
        }

        // In demo mode, show a toast explaining checkout requires a connected store
        if (demoModeEnabled()) {
          toast.info('Online checkout is not available yet', {
            description: 'Please check back when our store opens.',
          });
          return;
        }

        setLoading(true);
        try {
          const checkoutUrl = await createCheckout(
            items.map(item => ({
              variantId: item.variantId,
              quantity: item.quantity
            }))
          );
          if (checkoutUrl) {
            window.location.assign(checkoutUrl);
          }
        } catch (error) {
          toast.error('Checkout couldn’t be opened. Please try again.');
          if (import.meta.env.DEV) {
            console.error('Failed to create checkout:', error);
          }
        } finally {
          setLoading(false);
        }
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
      }
    }),
    {
      name: 'thygracemerch-cart',
      merge: (persisted, current) => {
        const saved = persisted as { items?: CartItem[] } | undefined;
        const items = Array.isArray(saved?.items) ? saved.items.map(currentCartItem).filter((item): item is CartItem => item !== null) : [];
        return { ...current, items };
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
