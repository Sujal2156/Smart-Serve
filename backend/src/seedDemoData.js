import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.models.js";
import { Restaurant } from "./models/restaurant.models.js";
import { Menu } from "./models/menu.models.js";
import { Order } from "./models/order.model.js";
import { Booking } from "./models/booking.model.js";
import { Offer } from "./models/offer.model.js";

dotenv.config({ path: "./.env" });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Seeding Demo Data...");

    // 1. Clean previous data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    await Order.deleteMany({});
    await Booking.deleteMany({});
    await Offer.deleteMany({});
    console.log("🧹 Cleaned old database records.");

    // 2. Create Main Restaurant
    const restaurant = await Restaurant.create({
      ownerName: "SmartServe Admin",
      ownerEmail: "softpro1712@gmail.com",
      name: "The Grand SmartServe Bistro",
      description: "Modern Fine Dining & Real-Time QR Experience",
      phoneNumber: "+919876543210",
      openingTime: "10:00 AM",
      closingTime: "11:00 PM",
      address: "123 Gourmet Avenue, Sector 18",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      isOpen: true,
      rating: 4.8,
      avatar: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    });
    console.log("🏰 Created Restaurant: " + restaurant.name);

    // 3. Create Admin Users & Customer User
    // Note: userSchema pre('save') automatically hashes passwords!
    const adminUser1 = await User.create({
      fullName: "SmartServe Admin",
      email: "softpro1712@gmail.com",
      password: "adminpassword",
      isAdmin: true,
      isVerified: true,
      restaurantId: restaurant._id,
    });

    const adminUser2 = await User.create({
      fullName: "Admin User",
      email: "admin@smartserve.com",
      password: "adminpassword",
      isAdmin: true,
      isVerified: true,
      restaurantId: restaurant._id,
    });

    const customerUser = await User.create({
      fullName: "Rahul Sharma",
      email: "customer@gmail.com",
      password: "userpassword",
      isAdmin: false,
      isVerified: true,
    });
    console.log("👤 Created Admin & Customer Users.");

    // 4. Create High Quality Menu Items
    const menuItems = [
      {
        itemName: "Paneer Butter Masala",
        price: 260,
        description: "Rich cottage cheese cubes cooked in a buttery tomato gravy.",
        category: "MainCourse",
        isVeg: true,
        image: [{ publicId: "paneer", url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600" }],
        isAvailable: true,
      },
      {
        itemName: "Hyderabadi Chicken Biryani",
        price: 320,
        description: "Fragrant basmati rice dum cooked with juicy marinated chicken.",
        category: "Rice",
        isVeg: false,
        image: [{ publicId: "biryani", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600" }],
        isAvailable: true,
      },
      {
        itemName: "Cheese Garlic Bread",
        price: 140,
        description: "Toasted baguette topped with melted mozzarella and herbs.",
        category: "Breads",
        isVeg: true,
        image: [{ publicId: "garlicbread", url: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=600" }],
        isAvailable: true,
      },
      {
        itemName: "Margherita Supreme Pizza",
        price: 299,
        description: "Classic Italian crust with fresh basil, tomatoes, and mozzarella.",
        category: "Pizza",
        isVeg: true,
        image: [{ publicId: "pizza", url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600" }],
        isAvailable: true,
      },
      {
        itemName: "Smoky Veg Burger",
        price: 179,
        description: "Crispy patty loaded with caramelized onions, cheddar, and sauce.",
        category: "Burger",
        isVeg: true,
        image: [{ publicId: "burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600" }],
        isAvailable: true,
      },
      {
        itemName: "Creamy Alfredo Pasta",
        price: 249,
        description: "Penne pasta tossed in a rich garlic parmesan cream sauce.",
        category: "Pasta",
        isVeg: true,
        image: [{ publicId: "pasta", url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600" }],
        isAvailable: true,
      },
      {
        itemName: "Crispy Spring Rolls",
        price: 160,
        description: "Golden fried rolls packed with seasoned garden vegetables.",
        category: "Starters",
        isVeg: true,
        image: [{ publicId: "springroll", url: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600" }],
        isAvailable: true,
      },
      {
        itemName: "Steamed Veg Momos",
        price: 130,
        description: "Soft Tibetan dumplings stuffed with cabbage & carrots served with spicy chutney.",
        category: "Momo",
        isVeg: true,
        image: [{ publicId: "momos", url: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600" }],
        isAvailable: true,
      },
      {
        itemName: "Chilled Cold Coffee",
        price: 110,
        description: "Blended espresso shot with ice cream and cocoa powder.",
        category: "Drinks",
        isVeg: true,
        image: [{ publicId: "coffee", url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600" }],
        isAvailable: true,
      },
      {
        itemName: "Fresh Mango Juice",
        price: 90,
        description: "Pure Alphonso mango pulp served chilled.",
        category: "Juice",
        isVeg: true,
        image: [{ publicId: "mango", url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600" }],
        isAvailable: true,
      },
      {
        itemName: "Sizzling Chocolate Brownie",
        price: 150,
        description: "Fudgy warm chocolate brownie topped with dark chocolate drizzle.",
        category: "Desserts",
        isVeg: true,
        image: [{ publicId: "brownie", url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600" }],
        isAvailable: true,
      },
      {
        itemName: "Vanilla Chocolate Sundae",
        price: 120,
        description: "Double scoop ice cream topped with roasted nuts and fudge.",
        category: "Ice cream",
        isVeg: true,
        image: [{ publicId: "sundae", url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600" }],
        isAvailable: true,
      },
    ];

    const createdMenuItems = await Menu.insertMany(
      menuItems.map((item) => ({
        restaurantId: restaurant._id,
        ...item,
      }))
    );
    console.log(`🍕 Inserted ${createdMenuItems.length} Menu Items.`);

    // 5. Create Live Orders
    const order1 = await Order.create({
      user: customerUser._id,
      restaurantId: restaurant._id,
      orderNo: "84729103",
      items: [
        { menu: createdMenuItems[0]._id, name: createdMenuItems[0].itemName, quantity: "2", price: "260" },
        { menu: createdMenuItems[2]._id, name: createdMenuItems[2].itemName, quantity: "1", price: "140" },
      ],
      taxPrice: 33,
      serviceCharge: 20,
      totalPrice: 713,
      orderStatus: "Pending",
      paymentMethod: "Cash",
      isPaid: false,
    });

    const order2 = await Order.create({
      user: customerUser._id,
      restaurantId: restaurant._id,
      orderNo: "93821045",
      items: [
        { menu: createdMenuItems[1]._id, name: createdMenuItems[1].itemName, quantity: "1", price: "320" },
        { menu: createdMenuItems[8]._id, name: createdMenuItems[8].itemName, quantity: "2", price: "110" },
      ],
      taxPrice: 27,
      serviceCharge: 20,
      totalPrice: 587,
      orderStatus: "Recieved",
      paymentMethod: "Online",
      isPaid: true,
    });

    // Update restaurant orders array
    restaurant.orders.push(order1._id, order2._id);
    await restaurant.save();
    console.log("🛒 Created Live Demo Orders.");

    // 6. Create Table Bookings
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    await Booking.create({
      user: customerUser._id,
      restaurantId: restaurant._id,
      bookingToken: "71038492",
      name: "Rahul Sharma",
      contactEmail: "customer@gmail.com",
      contactPhone: "+919876543210",
      numGuests: 4,
      reservationDate: tomorrow,
      reservationTime: "19:00",
      specialRequests: "Window corner table preferred for anniversary.",
      status: "Confirmed",
    });

    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    dayAfterTomorrow.setHours(0, 0, 0, 0);

    await Booking.create({
      user: adminUser2._id,
      restaurantId: restaurant._id,
      bookingToken: "82049516",
      name: "Priya Patel",
      contactEmail: "priya@gmail.com",
      contactPhone: "+919123456789",
      numGuests: 2,
      reservationDate: dayAfterTomorrow,
      reservationTime: "20:00",
      specialRequests: "Quiet booth if available.",
      status: "Confirmed",
    });
    console.log("📅 Created Table Bookings.");

    // 7. Create Active Offers
    await Offer.create({
      restaurantId: restaurant._id,
      offerName: "Grand Launch Special - 20% OFF",
      offerDescription: "Enjoy 20% discount on all main course & dessert items today!",
      offerImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    });
    console.log("🎁 Created Active Special Offer.");

    console.log("\n🎉 PERFECT DEMO DATA SEEDED SUCCESSFULLY!");
    console.log("-----------------------------------------");
    console.log("Admin Email: softpro1712@gmail.com OR admin@smartserve.com");
    console.log("Admin Password: adminpassword");
    console.log("Customer Email: customer@gmail.com");
    console.log("Customer Password: userpassword");
    console.log("-----------------------------------------");
  } catch (err) {
    console.error("❌ Seeding Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedData();
