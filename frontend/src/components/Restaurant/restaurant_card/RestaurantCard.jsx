import React, { useState } from "react";
import Card from "./Card";
import { useGetRestaurantQuery } from "../../../slices/restaurantApitSlice";
import { Alert } from "@material-tailwind/react";

const CITIES = ["All Cities", "Ahmedabad", "Gandhinagar", "Rajkot", "Surat", "Mumbai"];

function RestaurantCard({ keyword }) {
  const [selectedCity, setSelectedCity] = useState("All Cities");

  const queryParams = {
    keyword: keyword || undefined,
    city: selectedCity !== "All Cities" ? selectedCity : undefined,
    limit: 50,
  };

  const { data: Restaurant, isLoading, error } = useGetRestaurantQuery(queryParams);

  const restaurants = Restaurant?.data?.restaurants || [];
  const hasRestaurants = Array.isArray(restaurants) && restaurants.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header & City Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            {selectedCity === "All Cities"
              ? "Explore Top Restaurants"
              : `Top Restaurants in ${selectedCity}`}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {hasRestaurants
              ? `Showing ${restaurants.length} verified ${
                  restaurants.length === 1 ? "restaurant" : "restaurants"
                } with digital menu & QR ordering`
              : "Discover top-rated dining spots with seamless smart ordering"}
          </p>
        </div>

        {/* Interactive City Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
            City:
          </span>
          {CITIES.map((city) => {
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 whitespace-nowrap shadow-sm ${
                  isSelected
                    ? "bg-[#ff6347] text-white shadow-orange-500/30 shadow-md scale-105"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900"
                }`}
              >
                {city === "All Cities" ? "🌐 " : "📍 "}
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff6347]"></div>
        </div>
      ) : error ? (
        <Alert color="red" className="my-4 rounded-2xl">
          {error?.data?.message || error.error || "Failed to load restaurants."}
        </Alert>
      ) : hasRestaurants ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((data, index) => (
            <Card key={data._id || index} {...data} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100 p-8">
          <span className="text-4xl block mb-3">🍽️</span>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            No restaurants found in {selectedCity}
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-5">
            We are expanding rapidly! In the meantime, browse our restaurants in other top cities.
          </p>
          <button
            onClick={() => setSelectedCity("All Cities")}
            className="px-5 py-2.5 bg-[#ff6347] hover:bg-orange-600 text-white text-sm font-semibold rounded-full shadow transition-all"
          >
            Show All Cities
          </button>
        </div>
      )}
    </div>
  );
}

export default RestaurantCard;
