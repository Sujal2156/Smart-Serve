import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { addToCart } from "../../../slices/cartSlice"
import { Leaf } from "lucide-react"

const MenuSection = ({ menu = [], restaurantId }) => {
  const dispatch = useDispatch()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const menuList = Array.isArray(menu) ? menu : [];

  // Get unique categories safely
  const rawCategories = menuList.map((item) => item?.category || "General");
  const categories = ["all", ...Array.from(new Set(rawCategories)).filter(Boolean)];

  // Filter menu items
  const filteredMenu =
    selectedCategory === "all"
      ? menuList
      : menuList.filter((item) => (item?.category || "General") === selectedCategory);

  const handleAddToCart = (item) => {
    const formattedItem = {
      id: item._id || item.id,
      name: item.itemName || item.name,
      description: item.description,
      price: Number(item.price) || 0,
      image: Array.isArray(item.images) ? item.images[0]?.url || "" : item.images || item.image || "",
      category: item.category,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
    };
    dispatch(addToCart({ item: formattedItem, qty: 1, resId: restaurantId || item.restaurantId }));
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Our Digital Menu</h2>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all shadow-sm ${
              selectedCategory === category
                ? "bg-[#ff6347] text-white shadow-orange-500/20 scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map((item, idx) => (
          <div
            key={item.id || item._id || idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
          >
            {/* Image */}
            <div className="h-44 bg-gray-100 relative">
              <img
                src={
                  (Array.isArray(item.images) ? item.images[0]?.url : item.images) ||
                  item.image ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
                }
                alt={item.name || "Menu item"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600";
                }}
              />
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{item.name}</h3>
                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    {item.isVeg && <Leaf className="w-3.5 h-3.5 text-green-500" />}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.isAvailable !== false
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {item.isAvailable !== false ? "Available" : "Sold Out"}
                    </span>
                  </div>
                </div>

                <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                  {item.description || "Freshly prepared gourmet specialty."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-lg font-black text-gray-900">
                  ₹{Number(item.price || 0).toFixed(2)}
                </span>

                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.isAvailable === false}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    item.isAvailable !== false
                      ? "bg-[#ff6347] hover:bg-orange-600 text-white shadow-orange-500/20 active:scale-95"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  + Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-sm">No items found in this category.</p>
        </div>
      )}
    </div>
  )
}

export default MenuSection
