// Temporarily disabled due to TypeScript errors
// Will be fixed in a future update

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface OrderItem {
  product: {
    id: string
    name: string
    price: number
    image: string
  }
  quantity: number
  size?: string
  color?: string
}

interface Order {
  _id: string
  orderNumber: string
  user: {
    _id: string
    name: string
    email: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: string
  updatedAt: string
}

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  
  // Actions
  fetchOrders: () => Promise<void>
  fetchOrder: (orderId: string) => Promise<void>
  createOrder: (orderData: {
    items: any[]
    shippingAddress: Address
    billingAddress: Address
    paymentMethod: string
  }) => Promise<Order>
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      currentOrder: null,
      isLoading: false,

      fetchOrders: async () => {
        set({ isLoading: true })
        try {
          // Mock data for now
          const mockOrders: Order[] = []
          set({ orders: mockOrders, isLoading: false })
        } catch (error) {
          console.error('Failed to fetch orders:', error)
          set({ isLoading: false })
        }
      },

      fetchOrder: async () => {
        set({ isLoading: true })
        try {
          // Mock data for now
          const mockOrder: Order | null = null
          set({ currentOrder: mockOrder, isLoading: false })
        } catch (error) {
          console.error('Failed to fetch order:', error)
          set({ isLoading: false })
        }
      },

      createOrder: async (orderData) => {
        set({ isLoading: true })
        try {
          // Mock order creation
          const mockOrder: Order = {
            _id: Date.now().toString(),
            orderNumber: `ORD-${Date.now()}`,
            user: {
              _id: '1',
              name: 'Test User',
              email: 'test@example.com'
            },
            items: orderData.items,
            subtotal: orderData.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
            shipping: 25,
            tax: 0,
            total: 0,
            status: 'pending',
            shippingAddress: orderData.shippingAddress,
            billingAddress: orderData.billingAddress,
            paymentMethod: orderData.paymentMethod,
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          mockOrder.total = mockOrder.subtotal + mockOrder.shipping + mockOrder.tax
          
          set((state) => ({
            orders: [mockOrder, ...state.orders],
            currentOrder: mockOrder,
            isLoading: false
          }))
          
          return mockOrder
        } catch (error) {
          console.error('Failed to create order:', error)
          set({ isLoading: false })
          throw error
        }
      },

      updateOrderStatus: async (orderId: string, status: Order['status']) => {
        set({ isLoading: true })
        try {
          set((state) => ({
            orders: state.orders.map(order =>
              order._id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
            ),
            currentOrder: state.currentOrder?._id === orderId 
              ? { ...state.currentOrder, status, updatedAt: new Date().toISOString() }
              : state.currentOrder,
            isLoading: false
          }))
        } catch (error) {
          console.error('Failed to update order status:', error)
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'kolzo-orders',
      partialize: (state) => ({
        orders: state.orders,
        currentOrder: state.currentOrder
      })
    }
  )
) 