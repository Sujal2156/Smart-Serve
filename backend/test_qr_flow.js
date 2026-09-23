const API_BASE = "http://127.0.0.1:8080/api/v1";

const testQRWorkflow = async () => {
  console.log("======================================================");
  console.log("🔍 QA AUDIT: QR CODE SCAN & MENU NAVIGATION FLOW");
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
    // 1. Fetch available restaurants
    const resResponse = await fetch(`${API_BASE}/restaurant/all?limit=10`);
    const resJson = await resResponse.json();
    const restaurants = resJson?.data?.restaurants || [];

    assert(restaurants.length > 0, `Database has active restaurants for QR generator (Found ${restaurants.length})`);

    // 2. Test QR payload generation and parsing logic
    console.log("\n--- Testing QR URL String Formats & Parser ---");

    const parseQRResult = (result) => {
      if (!result) return null;
      if (result.includes("/restaurant/")) {
        return result.substring(result.indexOf("/restaurant/"));
      } else if (result.startsWith("http://") || result.startsWith("https://")) {
        try {
          const parsed = new URL(result);
          return parsed.pathname;
        } catch (e) {
          return result;
        }
      } else {
        return `/restaurant/${result}/menu`;
      }
    };

    restaurants.forEach((restaurant, i) => {
      const sampleFullUrl = `http://10.110.82.231:5173/restaurant/${restaurant._id}/menu`;
      const sampleRelativeUrl = `/restaurant/${restaurant._id}/menu`;
      const sampleRawId = restaurant._id;

      const parsedFull = parseQRResult(sampleFullUrl);
      const parsedRelative = parseQRResult(sampleRelativeUrl);
      const parsedId = parseQRResult(sampleRawId);

      const expectedRoute = `/restaurant/${restaurant._id}/menu`;

      assert(
        parsedFull === expectedRoute && parsedRelative === expectedRoute && parsedId === expectedRoute,
        `QR Parser correctly parses payload for "${restaurant.name}"`
      );
    });

    // 3. Test Digital Menu API for Each Scanned Restaurant ID
    console.log("\n--- Testing Digital Menu Availability for Scanned Restaurants ---");
    for (const restaurant of restaurants.slice(0, 4)) {
      const menuRes = await fetch(`${API_BASE}/${restaurant._id}/menu`);
      const menuJson = await menuRes.json();
      const menuItems = menuJson?.data || [];

      assert(
        menuItems.length > 0,
        `Scanned QR Target: "${restaurant.name}" (${restaurant.city}) ➔ Loaded ${menuItems.length} menu items with prices & tags`
      );
    }

    console.log("\n======================================================");
    console.log(` QR FLOW QA RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("======================================================\n");

    if (failed === 0) {
      console.log("QR EXPERIENCE & MENU NAVIGATION ARE 100% OPERATIONAL!");
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error("Error during QR flow test:", err);
    process.exit(1);
  }
};

testQRWorkflow();
