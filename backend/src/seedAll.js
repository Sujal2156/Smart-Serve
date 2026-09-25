import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.models.js";
import { Restaurant } from "./models/restaurant.models.js";
import { Menu } from "./models/menu.models.js";
import { Order } from "./models/order.model.js";
import { Booking } from "./models/booking.model.js";
import { Offer } from "./models/offer.model.js";

dotenv.config({ path: "./.env" });

const seedAll = async () => {
  const mongoUri = process.env.MONGO_LOCAL_URI || "mongodb://127.0.0.1:27017/smartserve";
  console.log(`Connecting to MongoDB at: ${mongoUri}...`);

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected successfully. Cleaning old data...");

    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    await Order.deleteMany({});
    await Booking.deleteMany({});
    await Offer.deleteMany({});
    console.log("🧹 Cleaned old collections.");

    // 1. Create Restaurants
    const bistroAmd = await Restaurant.create({
      ownerName: "SmartServe Admin",
      ownerEmail: "softpro1712@gmail.com",
      name: "The Grand SmartServe Bistro",
      description: "Fine Multi-Cuisine Dining with Instant Smart Table QR Ordering & Gourmet Chef Specials.",
      phoneNumber: "+919876543210",
      openingTime: "10:00 AM",
      closingTime: "11:30 PM",
      address: "Sindhu Bhavan Road, Bodakdev",
      city: "Ahmedabad",
      state: "Gujarat",
      zipCode: "380054",
      isOpen: true,
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop",
    });

    const cafeAmd = await Restaurant.create({
      ownerName: "Anil Shah",
      ownerEmail: "anil@urbanroastery.com",
      name: "The Urban Roastery & Cafe",
      description: "Artisan Coffee, Sourdough Sandwiches, Continental Brunches & Table QR Ordering.",
      phoneNumber: "+919876543211",
      openingTime: "08:30 AM",
      closingTime: "11:00 PM",
      address: "Near Vastrapur Lake, Vastrapur",
      city: "Ahmedabad",
      state: "Gujarat",
      zipCode: "380015",
      isOpen: true,
      rating: 4.8,
      avatar: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop",
    });

    const pizzeriaGnr = await Restaurant.create({
      ownerName: "Marco Rossi",
      ownerEmail: "marco@bellaitalia.com",
      name: "Bella Italia Pizzeria",
      description: "Authentic Wood-Fired Neapolitan Pizzas, Handmade Pastas, and Italian Desserts.",
      phoneNumber: "+919811223344",
      openingTime: "11:00 AM",
      closingTime: "11:00 PM",
      address: "Infocity, Sector 0",
      city: "Gandhinagar",
      state: "Gujarat",
      zipCode: "382007",
      isOpen: true,
      rating: 4.8,
      avatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
    });

    console.log("🏰 Created 3 Restaurants.");

    // 2. Create Admin Users (with proper passwords)
    const admin1 = await User.create({
      fullName: "SmartServe Admin",
      email: "softpro1712@gmail.com",
      password: "adminpassword",
      isAdmin: true,
      isVerified: true,
      restaurantId: bistroAmd._id,
    });

    const admin2 = await User.create({
      fullName: "Main Admin",
      email: "admin@smartserve.com",
      password: "adminpassword",
      isAdmin: true,
      isVerified: true,
      restaurantId: bistroAmd._id,
    });

    // 3. Create Customers
    const customer1 = await User.create({
      fullName: "Rahul Sharma",
      email: "customer@gmail.com",
      password: "userpassword",
      isAdmin: false,
      isVerified: true,
    });

    const customer2 = await User.create({
      fullName: "Priya Patel",
      email: "priya@gmail.com",
      password: "userpassword",
      isAdmin: false,
      isVerified: true,
    });

    console.log("👤 Created Admin and Customer Accounts.");

    // 4. Create Menu Items
    const bistroMenu = [
      {
        itemName: "Paneer Butter Masala",
        price: 280,
        description: "Fresh cottage cheese cooked in creamy tomato butter gravy with aromatic spices.",
        category: "MainCourse",
        isVeg: true,
        image: [{ publicId: "pbm", url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: bistroAmd._id,
      },
      {
        itemName: "Dal Makhani",
        price: 240,
        description: "Slow-cooked black lentils with fresh cream and clarified butter overnight.",
        category: "MainCourse",
        isVeg: true,
        image: [{ publicId: "dal", url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: bistroAmd._id,
      },
      {
        itemName: "Hyderabadi Dum Biryani",
        price: 330,
        description: "Fragrant long-grain basmati rice with succulent spices and saffron.",
        category: "Rice",
        isVeg: false,
        image: [{ publicId: "biryani", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: bistroAmd._id,
      },
      {
        itemName: "Cheese Garlic Bread",
        price: 150,
        description: "Toasted baguette topped with garlic herb butter and melted mozzarella.",
        category: "Starters",
        isVeg: true,
        image: [{ publicId: "garlic_bread", url: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: bistroAmd._id,
      },
      {
        itemName: "Margherita Pizza",
        price: 299,
        description: "Thin-crust Neapolitan pizza with San Marzano tomato sauce, fresh basil, and mozzarella.",
        category: "Pizza",
        isVeg: true,
        image: [{ publicId: "pizza", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: bistroAmd._id,
      },
      {
        itemName: "Cold Brew Coffee",
        price: 120,
        description: "Refreshing cold brewed artisan coffee with creamy milk froth.",
        category: "Drinks",
        isVeg: true,
        image: [{ publicId: "cold_coffee", url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: bistroAmd._id,
      },
      {
        itemName: "Sizzling Chocolate Brownie",
        price: 160,
        description: "Warm fudgy brownie served on a hot sizzler plate with vanilla ice cream and hot chocolate fudge.",
        category: "Desserts",
        isVeg: true,
        image: [{ publicId: "brownie", url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: bistroAmd._id,
      },
    ];

    const createdBistroItems = await Menu.insertMany(bistroMenu);
    console.log(`🍕 Created ${createdBistroItems.length} Menu Items for Bistro.`);

    // 5. Create Live Orders
    const ordersData = [
      {
        user: customer1._id,
        restaurantId: bistroAmd._id,
        orderNo: "ORD-84729103",
        tableNumber: "Table 4",
        name: "Rahul Sharma",
        items: [
          { menu: createdBistroItems[0]._id, name: createdBistroItems[0].itemName, quantity: "2", price: String(createdBistroItems[0].price) },
          { menu: createdBistroItems[3]._id, name: createdBistroItems[3].itemName, quantity: "1", price: String(createdBistroItems[3].price) },
        ],
        taxPrice: 35,
        serviceCharge: 20,
        totalPrice: 765,
        orderStatus: "Pending",
        paymentMethod: "Cash",
        isPaid: false,
      },
      {
        user: customer2._id,
        restaurantId: bistroAmd._id,
        orderNo: "ORD-91823746",
        tableNumber: "Table 8",
        name: "Priya Patel",
        items: [
          { menu: createdBistroItems[2]._id, name: createdBistroItems[2].itemName, quantity: "2", price: String(createdBistroItems[2].price) },
          { menu: createdBistroItems[5]._id, name: createdBistroItems[5].itemName, quantity: "2", price: String(createdBistroItems[5].price) },
        ],
        taxPrice: 45,
        serviceCharge: 20,
        totalPrice: 965,
        orderStatus: "Received",
        paymentMethod: "Online",
        isPaid: true,
      },
    ];

    await Order.insertMany(ordersData);
    console.log(`🛒 Created ${ordersData.length} Live Orders.`);

    // 6. Create Table Bookings
    const today = new Date();
    today.setHours(19, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);

    const bookingsData = [
      {
        user: customer1._id,
        restaurantId: bistroAmd._id,
        bookingToken: "BKG-7849201",
        name: "Rahul Sharma",
        reservationDate: today,
        reservationTime: "19:00",
        numGuests: 4,
        specialRequests: "Window side table requested for anniversary dinner.",
        contactPhone: "+919876543210",
        contactEmail: "customer@gmail.com",
        status: "Confirmed",
      },
      {
        user: customer2._id,
        restaurantId: bistroAmd._id,
        bookingToken: "BKG-9182345",
        name: "Priya Patel",
        reservationDate: tomorrow,
        reservationTime: "20:00",
        numGuests: 2,
        specialRequests: "Romantic candlelight table setup if possible.",
        contactPhone: "+919823456789",
        contactEmail: "priya@gmail.com",
        status: "Pending",
      },
    ];

    await Booking.insertMany(bookingsData);
    console.log(`📅 Created ${bookingsData.length} Table Reservations.`);

    // 7. Create Special Offers
    const offersData = [
      {
        restaurantId: bistroAmd._id,
        offerName: "WEEKEND25 - Flat 25% OFF",
        offerDescription: "Enjoy 25% discount on all main course dishes and signature mocktails every Saturday & Sunday.",
        offerImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop",
      },
      {
        restaurantId: bistroAmd._id,
        offerName: "SWEETDEAL - Free Dessert",
        offerDescription: "Complimentary Sizzling Chocolate Brownie on all table orders above ₹999.",
        offerImage: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop",
      },
    ];

    await Offer.insertMany(offersData);
    console.log(`🎁 Created ${offersData.length} Special Offers.`);

    console.log("\n=======================================================");
    console.log("✅ ALL DATABASE DATA SEEDED SUCCESSFULLY TO LOCAL MONGODB!");
    console.log("=======================================================");
    console.log("🛡️ Admin Login Email:    softpro1712@gmail.com (or admin@smartserve.com)");
    console.log("🔑 Admin Password:       adminpassword");
    console.log("-------------------------------------------------------");
    console.log("👤 Customer Login Email: customer@gmail.com (or priya@gmail.com)");
    console.log("🔑 Customer Password:    userpassword");
    console.log("=======================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedAll();
