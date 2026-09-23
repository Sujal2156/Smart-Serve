import fetch from "node-fetch";

const BASE_URL = "http://127.0.0.1:8080/api/v1";

const debugBooking = async () => {
  const custLoginRes = await fetch(`${BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "customer@gmail.com", password: "userpassword" }),
  });
  const custLoginJson = await custLoginRes.json();
  const customerToken = custLoginJson?.data?.accessToken;

  const amdRes = await (await fetch(`${BASE_URL}/restaurant/all?city=Ahmedabad`)).json();
  const resId = amdRes?.data?.restaurants[0]._id;

  const bookTableRes = await fetch(`${BASE_URL}/booking/${resId}/book-table`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      name: "Rahul Sharma",
      contactEmail: `rahul_${Date.now()}@gmail.com`,
      contactPhone: "+919876543210",
      reservationDate: "29/08/2026",
      reservationTime: "08:30 PM",
      numGuests: 4,
      specialRequests: "Window table",
    }),
  });
  const bookJson = await bookTableRes.json();
  console.log("DEBUG BOOKING STATUS:", bookTableRes.status, bookJson);
};

debugBooking();
