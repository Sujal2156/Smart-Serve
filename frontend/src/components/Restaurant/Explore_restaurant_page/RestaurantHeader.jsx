import React from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Star, Clock, MapPin } from "lucide-react"

const RestaurantHeader = ({ restaurant = {} }) => {
  const {
    name = "SmartServe Restaurant",
    avatar = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    rating = 4.8,
    address = "Main Street",
    hours = "10:00 AM - 11:00 PM",
    isOpen = true,
  } = restaurant || {};

  return (
    <div className="relative h-72 md:h-96 bg-gray-900">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${avatar})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors text-sm font-semibold shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* Restaurant Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">{name}</h1>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm">
            <div className="flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold">{rating}</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>{address}</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{hours}</span>
              <span
                className={`ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {isOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantHeader
