import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNotifications } from '../components/NotificationSystem'


interface Review {
  _id: string
  user: {
    _id: string
    name: string
    avatar?: string
  }
  rating: number
  title: string
  content: string
  images?: string[]
  helpfulCount: number
  verifiedPurchase: boolean
  createdAt: string
}

interface ProductReviewsProps {
  productId: string
  productName: string
  averageRating: number
  totalReviews: number
}

const ProductReviews = ({ averageRating, totalReviews }: ProductReviewsProps) => {
  const { isAuthenticated, user } = useAuthStore()
  const { addNotification } = useNotifications()
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful'>('newest')
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const reviewsPerPage = 5

  // Review form state
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    images: [] as string[]
  })

  // Mock reviews data
  const mockReviews: Review[] = [
    {
      _id: '1',
      user: {
        _id: 'user1',
        name: 'Sarah M.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      rating: 5,
      title: 'Absolutely Stunning Quality',
      content: 'This product exceeded all my expectations. The craftsmanship is impeccable and the attention to detail is remarkable. Worth every penny for the luxury experience.',
      helpfulCount: 12,
      verifiedPurchase: true,
      createdAt: '2025-01-15T10:30:00Z'
    },
    {
      _id: '2',
      user: {
        _id: 'user2',
        name: 'Michael R.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      rating: 4,
      title: 'Great Product, Fast Delivery',
      content: 'The quality is excellent and the delivery was incredibly fast. The packaging was beautiful and the product arrived in perfect condition.',
      helpfulCount: 8,
      verifiedPurchase: true,
      createdAt: '2025-01-10T14:20:00Z'
    },
    {
      _id: '3',
      user: {
        _id: 'user3',
        name: 'Emma L.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      rating: 5,
      title: 'Perfect for Special Occasions',
      content: 'I bought this for a special event and it was perfect. The quality is outstanding and I received many compliments. Highly recommend!',
      helpfulCount: 15,
      verifiedPurchase: true,
      createdAt: '2025-01-08T09:15:00Z'
    },
    {
      _id: '4',
      user: {
        _id: 'user4',
        name: 'David K.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      rating: 5,
      title: 'Exceptional Craftsmanship',
      content: 'The attention to detail is incredible. Every stitch, every material choice shows the highest level of craftsmanship. This is true luxury.',
      helpfulCount: 23,
      verifiedPurchase: true,
      createdAt: '2025-01-05T16:45:00Z'
    },
    {
      _id: '5',
      user: {
        _id: 'user5',
        name: 'Jennifer A.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      rating: 4,
      title: 'Beautiful Design',
      content: 'The design is timeless and elegant. I love how it complements any outfit and occasion. The quality is definitely worth the investment.',
      helpfulCount: 7,
      verifiedPurchase: true,
      createdAt: '2025-01-03T11:20:00Z'
    },
    {
      _id: '6',
      user: {
        _id: 'user6',
        name: 'Robert T.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      rating: 5,
      title: 'Premium Quality',
      content: 'This is exactly what I was looking for. The premium materials and construction are evident from the moment you hold it. Excellent purchase.',
      helpfulCount: 18,
      verifiedPurchase: true,
      createdAt: '2025-01-01T09:30:00Z'
    },
    {
      _id: '7',
      user: {
        _id: 'user7',
        name: 'Lisa P.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      rating: 4,
      title: 'Great Value',
      content: 'For the quality you get, this is excellent value. The materials are top-notch and the construction is solid. Very satisfied with my purchase.',
      helpfulCount: 11,
      verifiedPurchase: true,
      createdAt: '2024-12-28T14:15:00Z'
    },
    {
      _id: '8',
      user: {
        _id: 'user8',
        name: 'Thomas W.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      rating: 5,
      title: 'Outstanding Service',
      content: 'Not only is the product exceptional, but the customer service was also outstanding. They helped me choose the perfect item and delivery was prompt.',
      helpfulCount: 9,
      verifiedPurchase: true,
      createdAt: '2024-12-25T10:45:00Z'
    }
  ]

  useEffect(() => {
    setReviews(mockReviews)
  }, [])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      addNotification({
        type: 'error',
        title: 'Authentication Required',
        message: 'Please log in to submit a review',
        duration: 4000
      })
      return
    }

    if (formData.rating === 0) {
      addNotification({
        type: 'error',
        title: 'Rating Required',
        message: 'Please select a rating for your review',
        duration: 4000
      })
      return
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      addNotification({
        type: 'error',
        title: 'Missing Information',
        message: 'Please fill in all required fields',
        duration: 4000
      })
      return
    }

    // Mock review submission
    const newReview: Review = {
      _id: Date.now().toString(),
      user: {
        _id: user?._id || 'user',
        name: user?.name || 'Anonymous',
        avatar: user?.avatar
      },
      rating: formData.rating,
      title: formData.title,
      content: formData.content,
      images: formData.images,
      helpfulCount: 0,
      verifiedPurchase: true,
      createdAt: new Date().toISOString()
    }

    setReviews(prev => [newReview, ...prev])
    setShowReviewForm(false)
    setFormData({ rating: 0, title: '', content: '', images: [] })
    
    addNotification({
      type: 'success',
      title: 'Review Submitted',
      message: 'Thank you for your review! It has been successfully submitted.',
      duration: 5000
    })
  }

  const handleHelpful = (reviewId: string) => {
    setReviews(prev => prev.map(review => 
      review._id === reviewId 
        ? { ...review, helpfulCount: review.helpfulCount + 1 }
        : review
    ))
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    }

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    )
  }

  const filteredReviews = reviews.filter(review => 
    ratingFilter ? review.rating === ratingFilter : true
  )

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      case 'rating_high':
        return b.rating - a.rating
      case 'rating_low':
        return a.rating - b.rating
      case 'helpful':
        return b.helpfulCount - a.helpfulCount
      default:
        return 0
    }
  })

  // Pagination logic
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage)
  const startIndex = showAllReviews ? 0 : 0
  const endIndex = showAllReviews ? sortedReviews.length : Math.min(reviewsPerPage, sortedReviews.length)
  const displayedReviews = sortedReviews.slice(startIndex, endIndex)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Reviews Header */}
      <div className="border-b border-gray-200 pb-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-light tracking-[0.2em] uppercase mb-2">
              Customer Reviews
            </h2>
            <div className="flex items-center space-x-4">
              {renderStars(averageRating, 'lg')}
              <span className="text-gray-600 font-light">
                {averageRating.toFixed(1)} out of 5
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-gray-600 font-light">
                {totalReviews} reviews
              </span>
            </div>
          </div>
          
          <button
            onClick={() => {
              console.log('Write Review button clicked!')
              if (isAuthenticated) {
                setShowReviewForm(true)
              } else {
                addNotification({
                  type: 'error',
                  title: 'Authentication Required',
                  message: 'Please log in to write a review',
                  duration: 4000
                })
              }
            }}
            className="bg-black text-white px-6 py-3 font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-300 w-full sm:w-auto border border-gray-300"
          >
            Write a Review
          </button>
        </div>

        {/* Rating Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4">
              Rating Breakdown
            </h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(r => r.rating === rating).length
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm font-light w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-yellow-400 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Filters */}
          <div>
            <h3 className="text-lg font-light tracking-[0.2em] uppercase mb-4">
              Filter Reviews
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-light mb-2">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full p-2 border border-gray-300 font-light"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating_high">Highest Rated</option>
                  <option value="rating_low">Lowest Rated</option>
                  <option value="helpful">Most Helpful</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-light mb-2">Filter by rating:</label>
                <select
                  value={ratingFilter || ''}
                  onChange={(e) => setRatingFilter(e.target.value ? Number(e.target.value) : null)}
                  className="w-full p-2 border border-gray-300 font-light"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-light tracking-[0.2em] uppercase">
                  Write a Review
                </h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-light mb-2">Rating *</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none"
                      >
                        <svg
                          className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Review Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 font-light"
                    placeholder="Summarize your experience"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-light mb-2">Review Content *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full p-3 border border-gray-300 font-light h-32 resize-none"
                    placeholder="Share your detailed experience with this product..."
                    maxLength={1000}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-black text-white px-8 py-3 font-light tracking-[0.2em] uppercase hover:bg-gray-800 transition-all duration-300"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="border border-gray-300 text-gray-700 px-8 py-3 font-light tracking-[0.2em] uppercase hover:bg-gray-50 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-8">
        {displayedReviews.map((review) => (
          <motion.div
            key={review._id}
            className="border-b border-gray-200 pb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start space-x-4 mb-4">
              <img
                src={review.user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'}
                alt={review.user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium">{review.user.name}</h4>
                  {review.verifiedPurchase && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {renderStars(review.rating, 'sm')}
                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="font-medium mb-2">{review.title}</h5>
              <p className="text-gray-700 font-light leading-relaxed">{review.content}</p>
            </div>

            {review.images && review.images.length > 0 && (
              <div className="flex space-x-2 mb-4">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => handleHelpful(review._id)}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span>Helpful ({review.helpfulCount})</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {sortedReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 font-light">No reviews yet. Be the first to review this product!</p>
        </div>
      )}

      {/* View All Reviews Button */}
      {!showAllReviews && sortedReviews.length > reviewsPerPage && (
        <motion.div
          className="text-center pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setShowAllReviews(true)}
            className="bg-transparent text-black border border-gray-400 px-8 py-4 font-light tracking-[0.2em] uppercase hover:bg-gray-100 transition-all duration-300"
          >
            View All {sortedReviews.length} Reviews
          </button>
        </motion.div>
      )}

      {/* Pagination Controls */}
      {showAllReviews && totalPages > 1 && (
        <motion.div
          className="flex justify-center items-center space-x-4 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-light hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-light transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-black text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-light hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Show Less Button */}
      {showAllReviews && (
        <motion.div
          className="text-center pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => {
              setShowAllReviews(false)
              setCurrentPage(1)
            }}
            className="text-gray-600 font-light tracking-wide hover:text-gray-800 transition-colors duration-300"
          >
            Show Less
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default ProductReviews 