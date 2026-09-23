"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useGetRestaurantDetailsQuery } from "../../../slices/restaurantApitSlice"
import { useGetMenuByRestaurantIdQuery } from "../../../slices/menuApiSlice"
import { useGetOfferByRestaurantIdQuery } from "../../../slices/offerApiSlice"
import { useGetFeedbackByRestaurantIdQuery } from "../../../slices/feedbackApiSlice"

// Import separate components
import RestaurantHeader from "./RestaurantHeader"
import RestaurantInfo from "./RestaurantInfo"
import MenuSection from "./MenuSection"
import OffersSection from "./OffersSection"
import FeedbackSection from "./FeedbackSection"
import LoadingSpinner from "./LoadingSpinner"

const RestaurantTemplate = () => {
  const { id } = useParams()
  const [restaurantData, setRestaurantData] = useState(null)

  // API queries
  const { data: restaurant, isLoading: restaurantLoading, error: restaurantError } = useGetRestaurantDetailsQuery(id)
  const { data: menu, isLoading: menuLoading } = useGetMenuByRestaurantIdQuery(id)
  const { data: offers, isLoading: offersLoading } = useGetOfferByRestaurantIdQuery(id)
  const { data: feedback, isLoading: feedbackLoading, refetch: refetchFeedback } = useGetFeedbackByRestaurantIdQuery(id)

  // Process data safely with robust fallbacks
  useEffect(() => {
    if (restaurant?.data) {
      const restObj = restaurant.data
      const menuList = Array.isArray(menu?.data) ? menu.data : menu?.data?.menu || []
      const offerList = Array.isArray(offers?.data) ? offers.data : []
      const feedbackList = Array.isArray(feedback?.data) ? feedback.data : []

      setRestaurantData({
        info: {
          id: restObj._id,
          name: restObj.name,
          address: restObj.address,
          phone: restObj.phoneNumber,
          email: restObj.ownerEmail || restObj.email || "",
          hours: `${restObj.openingTime || "10:00 AM"} - ${restObj.closingTime || "11:00 PM"}`,
          isOpen: restObj.isOpen !== undefined ? restObj.isOpen : true,
          description: restObj.description || "",
          avatar: restObj.avatar || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
          rating: restObj.rating || 4.8,
        },
        menu: menuList.map((item) => ({
          id: item._id,
          name: item.itemName,
          description: item.description,
          price: item.price,
          images: item.image,
          category: item.category,
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
        })),
        offers: offerList.map((offer) => ({
          id: offer._id,
          name: offer.offerName,
          description: offer.offerDescription,
          image: offer.offerImage,
        })),
        feedback: feedbackList.map((fb) => ({
          id: fb._id,
          name: fb.name,
          comment: fb.review,
          rating: fb.rating,
          createdAt: fb.createdAt,
        })),
      })
    }
  }, [restaurant, menu, offers, feedback])

  // Loading state
  if (restaurantLoading || (menuLoading && !restaurantData)) {
    return <LoadingSpinner />
  }

  // Error state
  if (restaurantError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    )
  }

  if (!restaurantData) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header with Hero Image - Full Width */}
      <RestaurantHeader restaurant={restaurantData.info} />

      {/* Main Content Container - Consistent Width */}
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8 mx-auto">
        {/* Restaurant Info Section */}
        <RestaurantInfo restaurant={restaurantData.info} />

        {/* Menu Section */}
        <MenuSection menu={restaurantData.menu} restaurantId={id} />

        {/* Offers Section */}
        {restaurantData.offers.length > 0 && <OffersSection offers={restaurantData.offers} />}

        {/* Feedback Section */}
        <FeedbackSection feedback={restaurantData.feedback} restaurantId={id} onFeedbackUpdate={refetchFeedback} />
      </div>
    </div>
  )
}

export default RestaurantTemplate