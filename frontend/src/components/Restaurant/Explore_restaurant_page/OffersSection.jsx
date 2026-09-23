import React, { useState } from "react"
import { ChevronLeft, ChevronRight, Gift } from "lucide-react"

const OffersSection = ({ offers = [] }) => {
  const [currentOffer, setCurrentOffer] = useState(0)

  if (!Array.isArray(offers) || offers.length === 0) {
    return null;
  }

  const activeOffer = offers[currentOffer] || offers[0];
  if (!activeOffer) return null;

  const nextOffer = () => {
    setCurrentOffer((prev) => (prev + 1) % offers.length)
  }

  const prevOffer = () => {
    setCurrentOffer((prev) => (prev - 1 + offers.length) % offers.length)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Gift className="w-5 h-5 text-orange-500" />
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Special Offers & Deals</h2>
      </div>

      <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Offer Display */}
        <div className="relative h-48 sm:h-64 md:h-80">
          <img
            src={activeOffer.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"}
            alt={activeOffer.name || "Offer"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800";
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
            <div className="text-white">
              <span className="bg-orange-500 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-2 inline-block">
                Limited Time Promo
              </span>
              <h3 className="text-lg md:text-2xl font-bold mb-1">{activeOffer.name}</h3>
              <p className="text-xs md:text-sm text-gray-200 line-clamp-2">{activeOffer.description}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          {offers.length > 1 && (
            <>
              <button
                onClick={prevOffer}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextOffer}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {offers.length > 1 && (
          <div className="flex justify-center space-x-1.5 py-3 bg-gray-50">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentOffer(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentOffer ? "bg-orange-500 w-5" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OffersSection
