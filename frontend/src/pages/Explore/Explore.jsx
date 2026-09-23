import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetRestaurantQuery } from "../../slices/restaurantApitSlice";
import { Button } from "@material-tailwind/react";
import QRScannerModal from "../../components/QRScanner/QRScannerModal";

const Explore = () => {
  const navigate = useNavigate();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: restaurantsData, isLoading, error } = useGetRestaurantQuery();
  const restaurants =
    restaurantsData?.data?.restaurants ||
    (Array.isArray(restaurantsData?.data) ? restaurantsData.data : []);

  const filteredRestaurants = restaurants.filter(
    (res) =>
      res.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white rounded-3xl p-8 md:p-12 mb-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block bg-[#ff6347] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            ⚡ Smart QR Dining
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Explore Restaurants & Scan Table QR
          </h1>
          <p className="text-gray-300 text-sm md:text-base mb-6">
            Scan any SmartServe QR code at your table or explore nearby top-rated dining spots to view digital menus and place orders.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setIsScannerOpen(true)}
              className="bg-[#ff6347] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all flex items-center space-x-2 text-sm"
            >
              <span>📷</span>
              <span>Open QR Scanner</span>
            </Button>
            <Link to="/">
              <Button variant="outlined" color="white" className="rounded-full">
                Browse All
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search restaurants by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 pl-12 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff6347] text-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff6347]"></div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-2xl text-center max-w-md mx-auto">
          Unable to load restaurants. Please check your connection.
        </div>
      )}

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant._id}
            className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group"
          >
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              <img
                src={
                  restaurant.avatar ||
                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
                }
                alt={restaurant.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span
                className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full shadow ${
                  restaurant.isOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"
                }`}
              >
                {restaurant.isOpen ? "● Open Now" : "● Closed"}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-gray-900 line-clamp-1">
                    {restaurant.name}
                  </h3>
                  <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2 py-1 rounded-lg">
                    ⭐ {restaurant.rating || 4.8}
                  </span>
                </div>
                <p className="text-gray-500 text-xs line-clamp-2 mb-4">
                  {restaurant.description || "Authentic dining experience with digital table ordering."}
                </p>
                <p className="text-gray-400 text-xs mb-4">
                  📍 {restaurant.address}, {restaurant.city}
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Link
                  to={`/restaurant/${restaurant._id}/menu`}
                  className="flex-1 text-center py-2.5 bg-[#ff6347] hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95"
                >
                  Digital Menu
                </Link>
                <Link
                  to={`/restaurant/${restaurant._id}/view`}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-all"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
