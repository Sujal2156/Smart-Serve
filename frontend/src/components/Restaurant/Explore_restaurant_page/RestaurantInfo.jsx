import React from "react"
import { Phone, Mail, MapPin } from "lucide-react"

const RestaurantInfo = ({ restaurant = {} }) => {
  const {
    name = "Restaurant",
    description = "Welcome to our restaurant! We serve delicious food with love and care.",
    phone = "+91 98765 43210",
    email = "contact@smartserve.com",
    address = "Main Boulevard",
  } = restaurant || {};

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">About {name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description */}
        <div>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Contact & Location</h3>

          <div className="flex items-center space-x-3 text-gray-700 text-sm">
            <Phone className="w-4 h-4 text-[#ff6347] flex-shrink-0" />
            <span className="font-medium">{phone}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-700 text-sm">
            <Mail className="w-4 h-4 text-[#ff6347] flex-shrink-0" />
            <span className="font-medium truncate">{email}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-700 text-sm">
            <MapPin className="w-4 h-4 text-[#ff6347] flex-shrink-0" />
            <span className="font-medium">{address}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantInfo
