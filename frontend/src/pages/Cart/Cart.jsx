import React from "react";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  clearAllCart,
  incrementQty,
  decrementQty,
} from "../../slices/cartSlice";
import { Button } from "@material-tailwind/react";

import { resolveFoodItemImage, getFoodFallbackByName } from "../../utils/foodImageHelper";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state?.cart);
  const cart = useSelector((state) => state.cart);

  const removeFromCartHandler = (item) => {
    dispatch(removeFromCart(item));
  };

  const clearCartHandler = () => {
    dispatch(clearAllCart());
  };

  const incrementQuantityHandler = (item) => {
    dispatch(incrementQty(item));
  };

  const decrementQuantityHandler = (item) => {
    dispatch(decrementQty(item));
  };

  return (
    <>
      <div className="">
        <Link to="/">
          <Button size="medium" variant="outlined" className="mx-auto mt-4">
            Go back
          </Button>
        </Link>
      </div>
      <div className="cart">
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <br />
          <hr />
          {cartItems.length > 0 ? (
            cartItems.map((food, index) => (
              <div key={index} className="cart-items-title cart-items-item">
                <img
                  src={resolveFoodItemImage(food.item)}
                  alt={food.item?.name || "Dish"}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    e.currentTarget.src = getFoodFallbackByName(food.item?.name, food.item?.category);
                  }}
                  className="w-14 h-14 object-cover rounded-xl shadow-sm border border-gray-100"
                />
                <p>{food.item?.name}</p>
                <p>₹{food.item?.price}</p>
                <div className="cart-quantity-controls">
                  <button
                    onClick={() => decrementQuantityHandler(food.item)}
                    className="qty-btn"
                  >
                    <box-icon name="minus-square" type="solid"></box-icon>
                  </button>
                  <span className="quantity">{food.qty}</span>
                  <button
                    onClick={() => incrementQuantityHandler(food.item)}
                    className="qty-btn"
                  >
                    <box-icon name="plus-square" type="solid"></box-icon>
                  </button>
                </div>
                <p>₹{(food.item.price * food.qty).toFixed(2)}</p>
                <p
                  onClick={() => removeFromCartHandler(food.item)}
                  className="cross "
                >
                  <i className="fa-solid fa-trash fa-lg"></i>
                </p>
                <hr />
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
          <button
            onClick={clearCartHandler}
            type="button"
            className="clear-cart-btn "
          >
            Clear Cart{" "}
            <box-icon name="trash-alt" type="solid" color="#fdf3f3"></box-icon>
          </button>
        </div>
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-totals-details">
                <p>Subtotal</p>
                <p>₹{cart.itemsPrice}</p>
              </div>
              <hr />
              <div className="cart-totals-details">
                <p>Service Charge</p>
                <p>₹{cart.serviceCharge}</p>
              </div>
              <hr />
              <div className="cart-totals-details">
                <p>Tax</p>
                <p>₹{cart.taxPrice}</p>
              </div>
              <hr />
              <div className="cart-totals-details">
                <b>Total</b>
                <b>₹{cart.totalPrice}</b>
              </div>
            </div>
            <button onClick={() => navigate("/order")}>
              PROCEED TO CHECKOUT
            </button>
          </div>
          <div className="cart-promocode">
            <div>
              <p>If you have a promocode, Enter here</p>
              <div className="cart-promocode-input">
                <input type="text" placeholder="Enter Promocode" />
                <button>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
