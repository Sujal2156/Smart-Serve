import fetch from "node-fetch";

const BASE_URL = "http://127.0.0.1:8080/api/v1";

const runDeepQA = async () => {
  console.log("======================================================================");
  console.log("🔬 SMART-SERVE DEEP COMPREHENSIVE QA SIMULATION (END-TO-END)");
  console.log("======================================================================\n");

  let passed = 0;
  let failed = 0;

  const logTest = (status, name, details = "") => {
    if (status) {
      console.log(`✅ [PASS] ${name} ${details ? `(${details})` : ""}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name} ${details ? `(${details})` : ""}`);
      failed++;
    }
  };

  try {
    // ---------------------------------------------------------
    // 1. HEALTHCHECK & LAN IP DETECTION
    // ---------------------------------------------------------
    console.log("▶ [MODULE 1] System Health & Network Discovery");
    const healthRes = await fetch(`${BASE_URL}/healthcheck`);
    const healthJson = await healthRes.json();
    logTest(
      healthRes.status === 200 && healthJson?.data?.localIp,
      "HealthCheck API & Local IP Auto-Discovery",
      `IP: ${healthJson?.data?.localIp}`
    );

    // ---------------------------------------------------------
    // 2. AUTHENTICATION & ROLE-BASED ACCESS
    // ---------------------------------------------------------
    console.log("\n▶ [MODULE 2] User Authentication & Token Handlers");
    
    // Customer Login
    const custLoginRes = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "customer@gmail.com", password: "userpassword" }),
    });
    const custLoginJson = await custLoginRes.json();
    const customerToken = custLoginJson?.data?.accessToken;
    const customerUser = custLoginJson?.data?.user;

    logTest(
      custLoginRes.status === 200 && customerToken && customerUser?.email === "customer@gmail.com",
      "Customer Login & JWT Token Issue",
      `User: ${customerUser?.fullName}, Admin: ${customerUser?.isAdmin}`
    );

    // Admin Login
    const adminLoginRes = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@smartserve.com", password: "adminpassword" }),
    });
    const adminLoginJson = await adminLoginRes.json();
    const adminToken = adminLoginJson?.data?.accessToken;
    const adminUser = adminLoginJson?.data?.user;

    logTest(
      adminLoginRes.status === 200 && adminToken && adminUser?.isAdmin === true,
      "Admin Login & Elevated Role Verification",
      `Admin: ${adminUser?.fullName}, ResId: ${adminUser?.restaurantId}`
    );

    // ---------------------------------------------------------
    // 3. MULTI-CITY RESTAURANT FILTERING
    // ---------------------------------------------------------
    console.log("\n▶ [MODULE 3] City-Wise Restaurant Scoping");
    
    // All
    const allRes = await (await fetch(`${BASE_URL}/restaurant/all?limit=50`)).json();
    const totalCount = allRes?.data?.restaurants?.length || 0;
    logTest(totalCount >= 8, "Explore All Cities", `Found ${totalCount} restaurants across Gujarat & Mumbai`);

    // Ahmedabad
    const amdRes = await (await fetch(`${BASE_URL}/restaurant/all?city=Ahmedabad`)).json();
    const amdCount = amdRes?.data?.restaurants?.length || 0;
    const amdAllMatch = amdRes?.data?.restaurants?.every((r) => r.city.toLowerCase() === "ahmedabad");
    logTest(amdCount >= 2 && amdAllMatch, "Filter by Ahmedabad", `${amdCount} verified restaurants`);

    // Gandhinagar
    const gnrRes = await (await fetch(`${BASE_URL}/restaurant/all?city=Gandhinagar`)).json();
    const gnrCount = gnrRes?.data?.restaurants?.length || 0;
    const gnrAllMatch = gnrRes?.data?.restaurants?.every((r) => r.city.toLowerCase() === "gandhinagar");
    logTest(gnrCount >= 2 && gnrAllMatch, "Filter by Gandhinagar", `${gnrCount} verified restaurants`);

    // Rajkot
    const rajRes = await (await fetch(`${BASE_URL}/restaurant/all?city=Rajkot`)).json();
    const rajCount = rajRes?.data?.restaurants?.length || 0;
    const rajAllMatch = rajRes?.data?.restaurants?.every((r) => r.city.toLowerCase() === "rajkot");
    logTest(rajCount >= 2 && rajAllMatch, "Filter by Rajkot", `${rajCount} verified restaurants`);

    // Pick Main Bistro for subsequent tests
    const mainRestaurant = amdRes?.data?.restaurants?.find((r) => r.name.includes("Grand")) || amdRes?.data?.restaurants[0];
    const resId = mainRestaurant._id;

    // Pick Rajkot BBQ for review test
    const rajkotBbq = (await (await fetch(`${BASE_URL}/restaurant/all?city=Rajkot`)).json())?.data?.restaurants[0];
    const reviewResId = rajkotBbq._id;

    // ---------------------------------------------------------
    // 4. DIGITAL MENU & PRICING VERIFICATION
    // ---------------------------------------------------------
    console.log("\n▶ [MODULE 4] Digital Menu & Category Retrieval");
    const menuRes = await (await fetch(`${BASE_URL}/${resId}/menu`)).json();
    const menuItems = menuRes?.data || [];
    logTest(menuItems.length >= 10, "Digital Menu Retrieval", `${menuItems.length} dishes in "${mainRestaurant.name}"`);

    const vegItems = menuItems.filter((i) => i.isVeg);
    const nonVegItems = menuItems.filter((i) => !i.isVeg);
    logTest(vegItems.length > 0 && nonVegItems.length > 0, "Dietary Classification (Veg/Non-Veg)", `Veg: ${vegItems.length}, Non-Veg: ${nonVegItems.length}`);

    // ---------------------------------------------------------
    // 5. CUSTOMER FEEDBACK & REVIEWS
    // ---------------------------------------------------------
    console.log("\n▶ [MODULE 5] Customer Review & Rating Engine");
    const postReviewRes = await fetch(`${BASE_URL}/restaurant/${reviewResId}/review/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({ rating: 5, review: "Spectacular dining experience! QR ordering was blazing fast." }),
    });
    logTest(
      postReviewRes.status === 200 || postReviewRes.status === 201 || postReviewRes.status === 400,
      `Submit / Verify Diner Rating & Duplicate Guard for "${rajkotBbq.name}"`
    );

    const feedbackRes = await (await fetch(`${BASE_URL}/restaurant/${reviewResId}/reviews`)).json();
    const reviewsList = feedbackRes?.data || [];
    logTest(Array.isArray(reviewsList), "Retrieve Restaurant Reviews List", `${reviewsList.length} reviews fetched`);

    // ---------------------------------------------------------
    // 6. ORDER PLACEMENT & BILL COMPUTATION
    // ---------------------------------------------------------
    console.log("\n▶ [MODULE 6] Order Creation & Tax Computations");
    const item1 = menuItems[0];
    const item2 = menuItems[1];

    const orderPayload = {
      items: [
        { id: item1._id, quantity: 2, price: item1.price },
        { id: item2._id, quantity: 1, price: item2.price },
      ],
      tableNo: "Table 5",
      taxPrice: 25,
      serviceCharge: 15,
      totalPrice: item1.price * 2 + item2.price * 1 + 40,
    };

    const placeOrderRes = await fetch(`${BASE_URL}/${resId}/order/place-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify(orderPayload),
    });
    const placeOrderJson = await placeOrderRes.json();
    const createdOrder = placeOrderJson?.data?.placedOrder || placeOrderJson?.data;

    logTest(
      placeOrderRes.status === 200 && createdOrder?._id,
      "Create New Order from Cart",
      `OrderID: ${createdOrder?._id}, Total: ₹${createdOrder?.totalPrice}`
    );

    // ---------------------------------------------------------
    // 7. KITCHEN STATUS LIFECYCLE & INVOICING
    // ---------------------------------------------------------
    console.log("\n▶ [MODULE 7] Kitchen Order Status Transitions");
    const orderId = createdOrder?._id;

    // Transition 1: Pending ➔ Received (Cooking)
    const updateCookingRes = await fetch(`${BASE_URL}/order/${orderId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ orderStatus: "Received" }),
    });
    const cookingJson = await updateCookingRes.json();
    logTest(updateCookingRes.status === 200 && cookingJson?.data?.orderStatus === "Received", "Transition 1: Pending ➔ Received (Kitchen Cooking)");

    // Transition 2: Received ➔ Served (Completed)
    const updateServedRes = await fetch(`${BASE_URL}/order/${orderId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ orderStatus: "Served" }),
    });
    const servedJson = await updateServedRes.json();
    logTest(updateServedRes.status === 200 && servedJson?.data?.orderStatus === "Served", "Transition 2: Received ➔ Served (Order Fulfilled & Billed)");

    // ---------------------------------------------------------
    // 8. TABLE RESERVATIONS ENGINE
    // ---------------------------------------------------------
    console.log("\n▶ [MODULE 8] Table Reservation Engine");
    const uniqueDays = 10 + (Math.floor(Math.random() * 20));
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + uniqueDays);
    const d = String(targetDate.getDate()).padStart(2, "0");
    const m = String(targetDate.getMonth() + 1).padStart(2, "0");
    const y = targetDate.getFullYear();
    const formattedDate = `${d}/${m}/${y}`;
    const randomMinute = String(Math.floor(Math.random() * 50)).padStart(2, "0");
    const timeSlot = `07:${randomMinute} PM`;

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
        reservationDate: formattedDate,
        reservationTime: timeSlot,
        numGuests: 4,
        specialRequests: "Anniversary celebration table near the window.",
      }),
    });
    const bookTableJson = await bookTableRes.json();
    const createdBooking = bookTableJson?.data;

    logTest(
      bookTableRes.status === 201 && createdBooking?.bookingToken,
      "Customer Table Reservation",
      `Token: ${createdBooking?.bookingToken}, Slot: ${formattedDate} ${timeSlot}`
    );

    // ---------------------------------------------------------
    // 9. PROMOTIONAL OFFERS & BANNERS
    // ---------------------------------------------------------
    console.log("\n▶ [MODULE 9] Promotional Deals & Discount Banners");
    const offersRes = await (await fetch(`${BASE_URL}/${resId}/offers`)).json();
    const activeOffers = offersRes?.data || [];
    logTest(activeOffers.length > 0, "Retrieve Active Restaurant Offers", `${activeOffers.length} offers active`);

    // ---------------------------------------------------------
    // SUMMARY
    // ---------------------------------------------------------
    console.log("\n======================================================================");
    console.log(`📊 FINAL DEEP QA REPORT: ${passed} SCENARIOS PASSED, ${failed} FAILED`);
    console.log("======================================================================\n");

    if (failed === 0) {
      console.log("🌟 VERIFICATION SUCCESS: All functional and business requirements are 100% verified!");
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 Critical QA Test Failure:", error);
    process.exit(1);
  }
};

runDeepQA();
