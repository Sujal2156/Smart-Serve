const API_BASE = "http://127.0.0.1:8080/api/v1";

const testQA = async () => {
  console.log("======================================================");
  console.log("🧪 STARTING SMART-SERVE END-TO-END QA SUITE");
  console.log("======================================================\n");

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = "") => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}: ${details}`);
      failed++;
    }
  };

  try {
    // 1. Test Customer Authentication
    console.log("--- 1. Testing Customer Authentication ---");
    const customerLoginRes = await fetch(`${API_BASE}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "customer@gmail.com",
        password: "userpassword",
      }),
    });
    const customerLoginJson = await customerLoginRes.json();
    assert(
      customerLoginRes.status === 200 && customerLoginJson?.data?.accessToken,
      "Customer Login API (customer@gmail.com)",
      `Status: ${customerLoginRes.status}`
    );
    const customerToken = customerLoginJson?.data?.accessToken;

    // 2. Test Admin Authentication
    console.log("\n--- 2. Testing Admin Authentication ---");
    const adminLoginRes = await fetch(`${API_BASE}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@smartserve.com",
        password: "adminpassword",
      }),
    });
    const adminLoginJson = await adminLoginRes.json();
    assert(
      adminLoginRes.status === 200 && adminLoginJson?.data?.user?.isAdmin === true,
      "Admin Login API (admin@smartserve.com)",
      `isAdmin: ${adminLoginJson?.data?.user?.isAdmin}`
    );
    const adminToken = adminLoginJson?.data?.accessToken;

    // 3. Test City-Wise Restaurant Retrieval
    console.log("\n--- 3. Testing City-Wise Restaurant Filtering ---");
    const allRes = await fetch(`${API_BASE}/restaurant/all?limit=50`);
    const allJson = await allRes.json();
    const allRestaurants = allJson?.data?.restaurants || [];
    assert(allRestaurants.length >= 4, `Get All Restaurants (Found ${allRestaurants.length})`);

    const amdRes = await fetch(`${API_BASE}/restaurant/all?city=Ahmedabad`);
    const amdJson = await amdRes.json();
    const amdRestaurants = amdJson?.data?.restaurants || [];
    const allAmd = amdRestaurants.length > 0 && amdRestaurants.every((r) => r.city.toLowerCase() === "ahmedabad");
    assert(allAmd, `Filter by Ahmedabad (Found ${amdRestaurants.length} strictly in Ahmedabad)`);

    const rajkotRes = await fetch(`${API_BASE}/restaurant/all?city=Rajkot`);
    const rajkotJson = await rajkotRes.json();
    const rajkotRestaurants = rajkotJson?.data?.restaurants || [];
    const allRajkot = rajkotRestaurants.length > 0 && rajkotRestaurants.every((r) => r.city.toLowerCase() === "rajkot");
    assert(allRajkot, `Filter by Rajkot (Found ${rajkotRestaurants.length} strictly in Rajkot)`);

    const gnrRes = await fetch(`${API_BASE}/restaurant/all?city=Gandhinagar`);
    const gnrJson = await gnrRes.json();
    const gnrRestaurants = gnrJson?.data?.restaurants || [];
    const allGnr = gnrRestaurants.length > 0 && gnrRestaurants.every((r) => r.city.toLowerCase() === "gandhinagar");
    assert(allGnr, `Filter by Gandhinagar (Found ${gnrRestaurants.length} strictly in Gandhinagar)`);

    // 4. Test Restaurant Digital Menu Retrieval
    console.log("\n--- 4. Testing Digital Menu Retrieval ---");
    const targetRestaurant = amdRestaurants[0] || allRestaurants[0];
    const menuRes = await fetch(`${API_BASE}/${targetRestaurant._id}/menu`);
    const menuJson = await menuRes.json();
    const menuItems = menuJson?.data || [];
    assert(
      menuItems.length > 0,
      `Fetch Digital Menu for "${targetRestaurant.name}" (Found ${menuItems.length} items with HD images)`
    );

    // 5. Test Live Order Creation (Customer Cart Flow)
    console.log("\n--- 5. Testing Order Placement Flow ---");
    const testItem1 = menuItems[0];
    const testItem2 = menuItems[1] || menuItems[0];

    const orderPayload = {
      tableNumber: "Table 99",
      name: "QA Automated Tester",
      items: [
        { menu: testItem1._id, name: testItem1.itemName, quantity: 2, price: testItem1.price },
        { menu: testItem2._id, name: testItem2.itemName, quantity: 1, price: testItem2.price },
      ],
      taxPrice: 25,
      serviceCharge: 20,
      totalPrice: testItem1.price * 2 + testItem2.price + 45,
      paymentMethod: "Cash",
    };

    const createOrderRes = await fetch(`${API_BASE}/${targetRestaurant._id}/order/place-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify(orderPayload),
    });
    const createOrderJson = await createOrderRes.json();
    const newOrderId = createOrderJson?.data?.placedOrder?._id || createOrderJson?.data?._id;
    assert(
      newOrderId && (createOrderRes.status === 201 || createOrderRes.status === 200),
      "Create New Order from Cart",
      `OrderNo: ${createOrderJson?.data?.placedOrder?.orderNo}`
    );

    // 6. Test Admin Kitchen Status Workflow (Pending -> Received -> Served)
    console.log("\n--- 6. Testing Kitchen Order Status Lifecycle ---");
    const statusUpdateRes1 = await fetch(`${API_BASE}/order/${newOrderId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ orderStatus: "Received" }),
    });
    const statusUpdateJson1 = await statusUpdateRes1.json();
    assert(
      statusUpdateJson1?.data?.orderStatus === "Received",
      'Update Order Status: Pending ➔ Received (Cooking in Kitchen)'
    );

    const statusUpdateRes2 = await fetch(`${API_BASE}/order/${newOrderId}/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ orderStatus: "Served" }),
    });
    const statusUpdateJson2 = await statusUpdateRes2.json();
    assert(
      statusUpdateJson2?.data?.orderStatus === "Served",
      'Update Order Status: Received ➔ Served (Completed & Ready for Invoice)'
    );

    // 7. Test Table Reservation Booking
    console.log("\n--- 7. Testing Table Booking Flow ---");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const bookingPayload = {
      name: "QA Table Booker",
      reservationDate: tomorrow.toISOString(),
      reservationTime: "20:00",
      numGuests: 4,
      specialRequests: "QA verification booking",
      contactPhone: "+919876543210",
      contactEmail: "customer@gmail.com",
    };

    const bookTableRes = await fetch(`${API_BASE}/booking/${targetRestaurant._id}/book-table`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify(bookingPayload),
    });
    const bookTableJson = await bookTableRes.json();
    assert(
      bookTableRes.status === 201 || bookTableRes.status === 200,
      "Book Table Reservation",
      `Token: ${bookTableJson?.data?.bookingToken}`
    );

    // 8. Test Active Promotional Offers
    console.log("\n--- 8. Testing Active Special Offers ---");
    const offersRes = await fetch(`${API_BASE}/${targetRestaurant._id}/offers`);
    const offersJson = await offersRes.json();
    const offersList = offersJson?.data || [];
    assert(offersList.length > 0, `Fetch Active Offers (Found ${offersList.length} promo banners)`);

    console.log("\n======================================================");
    console.log(`📊 QA SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("======================================================\n");

    if (failed === 0) {
      console.log("🎉 ALL CORE WORKFLOWS ARE 100% OPERATIONAL & VERIFIED!");
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error("\n💥 QA Suite Encountered Error:", err);
    process.exit(1);
  }
};

testQA();
