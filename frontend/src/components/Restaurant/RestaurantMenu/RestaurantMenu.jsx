import React, { useEffect, useState } from "react";
import { useGetMenuByRestaurantIdQuery } from "../../../slices/menuApiSlice";
import { Link, useLocation, useParams } from "react-router-dom";
import "./RestaurantMenu.css";
import { Button } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { addToCart, incrementQty, decrementQty } from "../../../slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { resolveFoodItemImage, getFoodFallbackByName } from "../../../utils/foodImageHelper";
import LoginPage from "../../Loginc/LoginPage";

const RestaurantMenu = () => {
  const { id } = useParams();
  const location = useLocation();
  const [menuData, setMenuData] = useState([]);
  const {
    data,
    isLoading: menuLoading,
    error: menuError,
  } = useGetMenuByRestaurantIdQuery(id);
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isQrEntry = new URLSearchParams(location.search).get("qr") === "1";

  useEffect(() => {
    const tableNumber = new URLSearchParams(location.search).get("table");
    if (tableNumber) {
      localStorage.setItem("tableNumber", tableNumber);
    }
  }, [location.search]);

  useEffect(() => {
    if (data?.data) {
      setMenuData(
        data.data.map((item) => ({
          id: item._id,
          name: item.itemName,
          description: item.description,
          price: item.price,
          image: resolveFoodItemImage(item),
          category: item.category,
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
        }))
      );
    }
  }, [data]);

  // Cart quantity lookup for an item
  const getItemCartQty = (itemId) => {
    const found = cart.cartItems?.find((x) => (x.item?.id || x.item?._id) === itemId);
    return found ? found.qty : 0;
  };

  const handleAddToCart = (item) => {
    if (!item.isAvailable) return;
    if (cart.restaurantId && cart.restaurantId !== id && cart.cartItems?.length > 0) {
      toast.warn("Your cart contains items from another restaurant. Please clear your cart first.", {
        position: "top-center",
      });
      return;
    }

    dispatch(addToCart({ item, qty: 1, resId: id }));
    toast.success(`Added ${item.name} to cart! 🛒`, {
      autoClose: 1500,
      position: "top-right",
    });
  };

  const handleIncrement = (item) => {
    dispatch(incrementQty({ id: item.id }));
  };

  const handleDecrement = (item) => {
    dispatch(decrementQty({ id: item.id }));
  };

  const totalCartCount = cart.cartItems?.reduce((acc, i) => acc + (Number(i.qty) || 1), 0) || 0;

  if (isQrEntry && !userInfo) {
    return <LoginPage setShowLogin={() => {}} isProtectedPrompt />;
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-28 min-h-screen relative">
      <div className="flex justify-between items-center mb-6">
        <Link to="/">
          <Button size="sm" variant="outlined" color="black" className="rounded-full">
            ← Back to Restaurants
          </Button>
        </Link>
        {totalCartCount > 0 && (
          <Link to="/cart">
            <Button size="sm" className="bg-[#ff6347] rounded-full shadow-md hover:bg-orange-600">
              🛒 View Cart ({totalCartCount})
            </Button>
          </Link>
        )}
      </div>

      {menuError && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6 text-center">
          Failed to load menu items. Please try again.
        </div>
      )}

      {menuLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ff6347]"></div>
        </div>
      )}

      {menuData.length === 0 && !menuLoading && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-xl font-medium">No menu items found for this restaurant.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuData.map((item) => {
          const qty = getItemCartQty(item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
            >
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.src = getFoodFallbackByName(item.name, item.category);
                  }}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
                    item.isVeg ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.isVeg ? "🌱 Veg" : "🍗 Non-Veg"}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.name}</h3>
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">{item.description}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        item.isAvailable ? "text-green-600 bg-green-50" : "text-red-500 bg-red-50"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Sold Out"}
                    </span>
                  </div>

                  {/* Dynamic Action Buttons */}
                  {!item.isAvailable ? (
                    <button
                      disabled
                      className="w-full py-2 bg-gray-200 text-gray-400 font-medium rounded-xl cursor-not-allowed text-sm"
                    >
                      Out of Stock
                    </button>
                  ) : qty === 0 ? (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-2 bg-[#ff6347] hover:bg-orange-600 active:scale-95 text-white font-semibold rounded-xl shadow-md transition-all text-sm flex items-center justify-center space-x-1"
                    >
                      <span>+</span>
                      <span>Add to Cart</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl p-1 shadow-inner">
                      <button
                        onClick={() => handleDecrement(item)}
                        className="w-8 h-8 flex items-center justify-center bg-white text-orange-600 font-bold rounded-lg shadow-sm hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold text-orange-600 text-sm px-2">
                        {qty} in cart
                      </span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="w-8 h-8 flex items-center justify-center bg-white text-orange-600 font-bold rounded-lg shadow-sm hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Quick Checkout Bar */}
      {totalCartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-xl bg-gray-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between border border-orange-500/40 animate-slide-up">
          <div className="flex items-center space-x-3">
            <span className="bg-[#ff6347] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow">
              {totalCartCount} {totalCartCount === 1 ? "Item" : "Items"}
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Total Bill</span>
              <span className="font-bold text-lg text-white">₹{cart.totalPrice}</span>
            </div>
          </div>

          <Link
            to="/cart"
            className="bg-gradient-to-r from-orange-500 to-[#ff6347] hover:from-orange-600 hover:to-red-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center space-x-2 active:scale-95"
          >
            <span>Proceed to Cart</span>
            <span>→</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
