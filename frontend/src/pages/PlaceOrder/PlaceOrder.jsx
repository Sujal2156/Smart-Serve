import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreateOrderMutation,
} from "../../slices/orderApiSlice";
import { useValidateOfferMutation } from "../../slices/offerApiSlice";
import {
  clearAllCartItems,
} from "../../slices/cartSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Typography,
  Input,
} from "@material-tailwind/react";

export default function PlaceOrder() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const [createOrder, { isLoading: orderLoading }] = useCreateOrderMutation();
  const [validateOffer, { isLoading: offerChecking }] = useValidateOfferMutation();
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [promoOfferId, setPromoOfferId] = useState("");

  const [orderData, setOrderData] = useState({
    tableNumber: localStorage.getItem("tableNumber") || "",
    remarks: "",
    items: [],
    totalPrice: 0,
    taxPrice: 0,
    serviceCharge: 0,
    restaurantId: "",
  });

  useEffect(() => {
    setOrderData((prevData) => ({
      ...prevData,
      items: cartItems.map((item) => ({
        name: item.item.name,
        price: item.item.price,
        quantity: item.qty,
        menu: item.item.id,
      })),
      totalPrice: cart.totalPrice,
      taxPrice: cart.taxPrice,
      serviceCharge: cart.serviceCharge,
      restaurantId: cart.restaurantId || cartItems[0]?.resId || cartItems[0]?.item?.restaurantId || localStorage.getItem("restaurantId") || "",
      tableNumber: prevData.tableNumber || localStorage.getItem("tableNumber") || "",
    }));
  }, [cartItems, cart]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkPromoCode = async () => {
    const code = promoCode.trim();
    if (!code) {
      setPromoDiscount(0);
      setPromoOfferId("");
      setPromoMessage("Enter a promo code to check.");
      return;
    }

    try {
      const response = await validateOffer({
        restaurantId: orderData.restaurantId,
        offerCode: code,
      }).unwrap();
      const discount = Number(response.data.discountAmount) || 0;
      setPromoCode(response.data.offerCode);
      setPromoDiscount(discount);
      setPromoOfferId(response.data.offerId);
      setPromoMessage(`Promo applied: you save ₹${discount.toFixed(2)}.`);
    } catch (error) {
      setPromoDiscount(0);
      setPromoOfferId("");
      setPromoMessage(error.data?.message || "Promo code does not match an active offer.");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!orderData.tableNumber?.trim()) {
      toast.error("Please scan a table QR code before placing an order");
      return;
    }
    if (!orderData.remarks?.trim()) {
      toast.error("Please enter a remark for the restaurant");
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const orderPayload = {
        ...orderData,
        promoCode: promoDiscount > 0 ? promoCode.trim() : "",
        promoOfferId: promoDiscount > 0 ? promoOfferId : "",
        promoDiscount,
        totalPrice: Math.max(Number(cart.totalPrice) - promoDiscount, 0),
        items: cartItems.map((item) => ({
          name: item.item.name,
          price: item.item.price,
          quantity: item.qty,
          menu: item.item.id,
        })),
      };
      await createOrder(orderPayload).unwrap();
      toast.success(`Order placed successfully!`);
      dispatch(clearAllCartItems());
    } catch (err) {
      console.error("Error placing order: ", err);
      toast.error(
        err.data?.message || "Failed to place order. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/cart">
        <Button variant="outlined" className="mb-4">
          Go back
        </Button>
      </Link>
      <form className="grid md:grid-cols-2 gap-8">
        <Card className="w-full">
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Order Details
            </Typography>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Item Name
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        Quantity
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((food, index) => (
                    <tr
                      key={food.item.id || index}
                      className="even:bg-blue-gray-50/50"
                    >
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {food.item.name}
                        </Typography>
                      </td>
                      <td className="p-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {food.qty}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 rounded-lg bg-orange-50 px-4 py-3 text-sm text-orange-900">
              Ordering from <strong>{orderData.tableNumber || "your scanned table"}</strong>. Customer details come from your login.
            </div>
          </CardBody>
        </Card>

        <Card className="w-full">
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Cart Total
            </Typography>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Typography color="blue-gray">Subtotal</Typography>
                <Typography color="blue-gray">₹{cart.totalPrice}</Typography>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <Typography color="blue-gray" className="font-bold">
                  Total
                </Typography>
                <Typography color="blue-gray" className="font-bold">
                  ₹{Math.max(Number(cart.totalPrice) - promoDiscount, 0).toFixed(2)}
                </Typography>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <Input
                type="text"
                label="Remark for restaurant (required)"
                name="remarks"
                value={orderData.remarks}
                onChange={handleInputChange}
                required
              />
              <div className="flex items-end gap-2">
                <Input
                  type="text"
                  label="Promo code (optional)"
                  value={promoCode}
                  onChange={(event) => {
                    setPromoCode(event.target.value);
                    setPromoDiscount(0);
                    setPromoOfferId("");
                    setPromoMessage("");
                  }}
                />
                <Button
                  type="button"
                  onClick={checkPromoCode}
                  disabled={offerChecking || !orderData.restaurantId}
                  className="min-w-[90px]"
                >
                  {offerChecking ? "Checking..." : "Check"}
                </Button>
              </div>
              {promoMessage && (
                <p className={`text-xs ${promoDiscount > 0 ? "text-green-700" : "text-red-600"}`}>
                  {promoMessage}
                </p>
              )}
              {cartItems && (
                <Button
                  onClick={submitHandler}
                  className="w-full"
                  disabled={orderLoading || cartItems.length === 0}
                >
                  {orderLoading ? "Placing Order..." : "Place Order"}
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
