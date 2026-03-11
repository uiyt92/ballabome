import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string; // 상품 고유 ID
    name: string; // 상품명
    price: number; // 단일 상품 가격
    quantity: number; // 수량
    image?: string; // 상품 이미지 URL (선택)
}

interface CartState {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    buyNowItem: CartItem | null;
    setBuyNowItem: (item: CartItem) => void;
    clearBuyNowItem: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            buyNowItem: null,
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            setBuyNowItem: (item) => set({ buyNowItem: item }),
            clearBuyNowItem: () => set({ buyNowItem: null }),

            addToCart: (item) => set((state) => {
                const existingItem = state.items.find((i) => i.id === item.id);
                if (existingItem) {
                    return {
                        items: state.items.map((i) =>
                            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                        ),
                    };
                }
                return { items: [...state.items, item] };
            }),

            removeFromCart: (id) => set((state) => ({
                items: state.items.filter((i) => i.id !== id)
            })),

            // 수량이 0 이하가 되면 자동으로 항목 제거
            updateQuantity: (id, quantity) => set((state) => {
                if (quantity <= 0) {
                    return { items: state.items.filter((i) => i.id !== id) }
                }
                return {
                    items: state.items.map((i) =>
                        i.id === id ? { ...i, quantity } : i
                    )
                }
            }),

            clearCart: () => set({ items: [] }),

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            }
        }),
        {
            name: 'ballabom-cart-storage',
            // buyNowItem은 세션 한정 → persist에서 제외
            partialize: (state) => ({ items: state.items }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.setHasHydrated(true)
                }
            }
        }
    )
)
