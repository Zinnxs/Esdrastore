import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { products } from '../data/products';
import { generateOrderId } from '../utils/format';

const findProductById = (id) => products.find((product) => product.id === Number(id));

const buildCartItem = (product, size, color) => ({
  cartId: `${product.id}-${size}-${color}`,
  productId: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  size,
  color,
  quantity: 1,
});

export const useStore = create(
  persist(
    (set, get) => ({
      session: {
        role: 'guest',
        name: '',
        email: '',
      },
      cart: [],
      orders: [],
      login: ({ role, name, email }) => {
        set({
          session: {
            role,
            name,
            email,
          },
        });
      },
      logout: () => {
        set({
          session: {
            role: 'guest',
            name: '',
            email: '',
          },
        });
      },
      addToCart: ({ productId, size, color, quantity = 1 }) => {
        const product = findProductById(productId);

        if (!product || !size || !color) {
          return;
        }

        set((state) => {
          const cartId = `${product.id}-${size}-${color}`;
          const existingItem = state.cart.find((item) => item.cartId === cartId);

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.cartId === cartId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }

          return {
            cart: [...state.cart, { ...buildCartItem(product, size, color), quantity }],
          };
        });
      },
      updateCartQuantity: (cartId, quantity) => {
        set((state) => ({
          cart: state.cart
            .map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
            .filter((item) => item.quantity > 0),
        }));
      },
      incrementCartItem: (cartId) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        }));
      },
      decrementCartItem: (cartId) => {
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.cartId === cartId ? { ...item, quantity: item.quantity - 1 } : item,
            )
            .filter((item) => item.quantity > 0),
        }));
      },
      removeFromCart: (cartId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.cartId !== cartId),
        }));
      },
      clearCart: () => set({ cart: [] }),
      createOrder: ({ customer, paymentMethod, total, items, id, paymentSessionId }) => {
        const order = {
          id: id ?? generateOrderId(),
          customerEmail: customer?.email || '',
          customer,
          paymentMethod,
          total,
          items,
          status: 'Pago',
          paymentSessionId: paymentSessionId ?? null,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          orders: [order, ...state.orders],
        }));

        return order;
      },
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        }));
      },
      getCartSubtotal: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'esdras-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart, orders: state.orders, session: state.session }),
    },
  ),
);
