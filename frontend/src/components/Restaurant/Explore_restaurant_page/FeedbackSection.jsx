import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { Star, MessageSquare } from "lucide-react"
import { useCreateReviewMutation } from "../../../slices/restaurantApitSlice"

const FeedbackSection = ({ feedback = [], restaurantId, onFeedbackUpdate }) => {
  const { userInfo } = useSelector((state) => state.auth)
  const [createReview, { isLoading: reviewLoading }] = useCreateReviewMutation()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [hoveredRating, setHoveredRating] = useState(0)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  const feedbackList = Array.isArray(feedback) ? feedback : [];

  // Auto-scroll carousel safely
  useEffect(() => {
    if (feedbackList.length > 1) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % feedbackList.length)
      }, 4000)

      return () => clearInterval(interval)
    }
  }, [feedbackList.length])

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (!rating || !comment.trim()) {
      toast.error("Please provide both rating and comment")
      return
    }

    try {
      await createReview({
        restaurantId,
        data: { rating, review: comment },
      }).unwrap()

      toast.success("Thank you for your feedback! ⭐")
      setRating(5)
      setComment("")
      if (typeof onFeedbackUpdate === "function") {
        onFeedbackUpdate()
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit review")
    }
  }

  const currentReview = feedbackList[currentReviewIndex] || feedbackList[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="w-6 h-6 text-[#ff6347]" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Guest Reviews & Ratings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reviews Display / Carousel */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Recent Feedback ({feedbackList.length})
          </h3>

          {feedbackList.length > 0 && currentReview ? (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
              <div className="flex items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (currentReview.rating || 5)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                "{currentReview.comment || currentReview.review || "Great food and fast service!"}"
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-200/60 pt-3">
                <span className="font-bold text-gray-800">{currentReview.name || "Happy Customer"}</span>
                <span>
                  {currentReview.createdAt
                    ? new Date(currentReview.createdAt).toLocaleDateString()
                    : "Verified Diner"}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-500 border border-gray-100 text-sm">
              🌟 No reviews yet. Be the first to share your dining experience!
            </div>
          )}
        </div>

        {/* Submit Review Form */}
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
            Leave a Review
          </h3>

          {userInfo ? (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Your Rating:</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "text-yellow-400 fill-yellow-400 scale-110"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Your Comments:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="3"
                  placeholder="How was the food, ambiance, and QR ordering speed?"
                  className="w-full text-xs sm:text-sm p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="px-5 py-2.5 bg-[#ff6347] hover:bg-orange-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {reviewLoading ? "Submitting..." : "Post Review"}
              </button>
            </form>
          ) : (
            <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-6 text-center text-sm text-gray-700">
              <p className="mb-2 font-medium">Please sign in to leave a review for this restaurant.</p>
              <span className="text-xs text-orange-600 font-bold">Sign in via navbar to rate dishes!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FeedbackSection
