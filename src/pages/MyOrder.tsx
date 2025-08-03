import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { formatPrice } from '../utils/priceFormatter'

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }>
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
}

const MyOrder = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: '#KOLZO-2025-001',
      date: '2025-01-15',
      status: 'delivered',
      total: 3330,
      items: [
        {
          id: 'handbag-001',
          name: 'Kolzo Signature Shoulder Bag',
          price: 3200,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
        },
        {
          id: 'lipstick-001',
          name: 'Kolzo Rouge Velvet Lipstick',
          price: 65,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2915&q=80'
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        address: '123 Luxury Lane',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      trackingNumber: '1Z999AA1234567890',
      estimatedDelivery: '2025-01-20'
    },
    {
      id: '2',
      orderNumber: '#KOLZO-2025-002',
      date: '2025-01-10',
      status: 'shipped',
      total: 485,
      items: [
        {
          id: 'perfume-001',
          name: 'Kolzo Essence Eau de Parfum',
          price: 420,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2004&q=80'
        },
        {
          id: 'lipstick-002',
          name: 'Kolzo Rouge Velvet Lipstick',
          price: 65,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2915&q=80'
        }
      ],
      shippingAddress: {
        name: 'Jane Smith',
        address: '456 Fashion Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210'
      },
      trackingNumber: '1Z999AA1234567891',
      estimatedDelivery: '2025-01-18'
    }
  ]

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      navigate('/')
      return
    }

    // Simulate loading orders
    setTimeout(() => {
      setOrders(mockOrders)
      setIsLoading(false)
    }, 1000)

    // Scroll to top
    window.scrollTo(0, 0)
  }, [isAuthenticated, navigate])

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'shipped':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'Processing'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600 font-light tracking-wide">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <motion.section
        className="relative h-[40vh] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gray-100"></div>
        
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="text-center px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase mb-6">
              My Orders
            </h1>
            <p className="text-lg font-light tracking-wide max-w-2xl mx-auto">
              Track your orders and manage your purchases
            </p>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {orders.length === 0 ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-4">
                No Orders Yet
              </h2>
              <p className="text-gray-600 font-light tracking-wide mb-8">
                Start shopping to see your orders here.
              </p>
              <Link
                to="/"
                className="inline-block bg-black text-white px-8 py-4 text-sm font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-500"
              >
                Start Shopping
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    className={`border border-gray-200 rounded-lg p-6 cursor-pointer transition-all duration-300 ${
                      selectedOrder?.id === order.id ? 'border-black bg-gray-50' : 'hover:border-gray-300'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-light tracking-wide mb-2">{order.orderNumber}</h3>
                        <p className="text-sm text-gray-600 font-light tracking-wide">
                          {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-light tracking-wide ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        <p className="text-lg font-medium mt-2">${order.total.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-light">+{order.items.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-1">
              {selectedOrder ? (
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <h3 className="text-xl font-light tracking-[0.2em] uppercase mb-6">
                    Order Details
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Order Info */}
                    <div>
                      <h4 className="text-sm font-light tracking-[0.2em] uppercase mb-3">Order Information</h4>
                      <div className="space-y-2 text-sm font-light tracking-wide">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Number:</span>
                          <span>{selectedOrder.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span>{new Date(selectedOrder.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={getStatusColor(selectedOrder.status)}>
                            {getStatusText(selectedOrder.status)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium">${selectedOrder.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <h4 className="text-sm font-light tracking-[0.2em] uppercase mb-3">Shipping Information</h4>
                      <div className="space-y-2 text-sm font-light tracking-wide">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <p>{selectedOrder.shippingAddress.name}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Address:</span>
                          <p>{selectedOrder.shippingAddress.address}</p>
                          <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                        </div>
                        {selectedOrder.trackingNumber && (
                          <div>
                            <span className="text-gray-600">Tracking Number:</span>
                            <p className="font-mono">{selectedOrder.trackingNumber}</p>
                          </div>
                        )}
                        {selectedOrder.estimatedDelivery && (
                          <div>
                            <span className="text-gray-600">Estimated Delivery:</span>
                            <p>{new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="text-sm font-light tracking-[0.2em] uppercase mb-3">Order Items</h4>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-light tracking-wide">{item.name}</p>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg text-center"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 font-light tracking-wide">
                    Select an order to view details
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrder 