import fetch from "node-fetch";

const BASE_URL = "http://127.0.0.1:8080/api/v1";

const debugAPI = async () => {
  const custLoginRes = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "customer@gmail.com", password: "userpassword" }),
  });
  const custLoginJson = await custLoginRes.json();
  const customerToken = custLoginJson?.data?.accessToken;
  console.log("Customer Token received:", !!customerToken);

  const amdRes = await (await fetch(`${BASE_URL}/restaurant/all?city=Ahmedabad`)).json();
  const resId = amdRes?.data?.restaurants[0]._id;
  console.log("Using Restaurant ID:", resId);

  // Review
  const postReviewRes = await fetch(`${BASE_URL}/restaurant/${resId}/review/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({ rating: 5, review: "Great place" }),
  });
  const reviewJson = await postReviewRes.json();
  console.log("Review Response:", postReviewRes.status, reviewJson);

  // Order
  const menuRes = await (await fetch(`${BASE_URL}/${resId}/menu`)).json();
  const item1 = menuRes.data[0];
  const placeOrderRes = await fetch(`${BASE_URL}/${resId}/order/place-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      items: [{ id: item1._id, quantity: 2, price: item1.price }],
      tableNo: "Table 5",
      taxPrice: 10,
      totalPrice: item1.price * 2 + 10,
      serviceCharge: 0,
    }),
  });
  const orderJson = await placeOrderRes.json();
  console.log("Place Order Response:", placeOrderRes.status, orderJson);

  // Booking
  const bookTableRes = await fetch(`${BASE_URL}/booking/${resId}/book-table`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      name: "Rahul Sharma",
      contactEmail: "customer@gmail.com",
      contactPhone: "9876543210",
      reservationDate: "28/08/2026",
      reservationTime: "08:30 PM",
      numGuests: 4,
      specialRequests: "Window seat",
    }),
  });
  const bookJson = await bookTableRes.json();
  console.log("Book Table Response:", bookTableRes.status, bookJson);
};

debugAPI();
