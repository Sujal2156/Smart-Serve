import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./models/user.models.js";
import { Restaurant } from "./models/restaurant.models.js";
import { Menu } from "./models/menu.models.js";
import { Order } from "./models/order.model.js";
import { Booking } from "./models/booking.model.js";
import { Offer } from "./models/offer.model.js";

dotenv.config({ path: "./.env" });

// 👇 Apna registered + verified admin email yahan daal (jiske against restaurant register hai)
const OWNER_EMAIL = "softpro1712@gmail.com";

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    const user = await User.findOne({ email: OWNER_EMAIL });
    if (!user) {
      throw new Error(`User with email ${OWNER_EMAIL} not found. Pehle register/verify kar.`);
    }
    if (!user.restaurantId) {
      throw new Error("Is user ke against koi restaurant register nahi hai. Pehle restaurant register kar (RestaurantRegistration form se).");
    }

    const restaurant = await Restaurant.findById(user.restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant document nahi mila DB mein.");
    }

    console.log(`Seeding data for restaurant: ${restaurant.name} (${restaurant._id})`);

    // ---------- 1. Menu Items ----------
    const menuItemsData = [
      { itemName: "Paneer Butter Masala", price: 220, description: "Rich and creamy paneer curry", category: "MainCourse", isVeg: true },
      { itemName: "Chicken Biryani", price: 260, description: "Fragrant basmati rice with spiced chicken", category: "Rice", isVeg: false },
      { itemName: "Veg Spring Rolls", price: 120, description: "Crispy rolls stuffed with veggies", category: "Starters", isVeg: true },
      { itemName: "Margherita Pizza", price: 199, description: "Classic cheese and tomato pizza", category: "Pizza", isVeg: true },
      { itemName: "Cold Coffee", price: 90, description: "Chilled coffee with ice cream", category: "Drinks", isVeg: true },
      { itemName: "Chocolate Brownie", price: 110, description: "Warm brownie with chocolate sauce", category: "Desserts", isVeg: true },
    ];

    await Menu.deleteMany({ restaurantId: restaurant._id }); // purana dummy data clear (dobara chalane pe duplicate na ho)
    const createdMenuItems = await Menu.insertMany(
      menuItemsData.map((item) => ({
        restaurantId: restaurant._id,
        ...item,
        image: [
          {
            publicId: "demo",
            url: "https://via.placeholder.com/300x200.png?text=" + encodeURIComponent(item.itemName),
          },
        ],
        isAvailable: true,
      }))
    );
    console.log(`✅ ${createdMenuItems.length} menu items created.`);

    // ---------- 2. Order ----------
    await Order.deleteMany({ restaurantId: restaurant._id });
    const orderItems = createdMenuItems.slice(0, 3).map((item) => ({
      menu: item._id,
      name: item.itemName,
      quantity: "2",
      price: String(item.price),
    }));
    const subtotal = orderItems.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const serviceCharge = 20;

    const order = await Order.create({
      user: user._id,
      restaurantId: restaurant._id,
      orderNo: String(Math.floor(10000000 + Math.random() * 90000000)),
      items: orderItems,
      taxPrice: tax,
      serviceCharge,
      totalPrice: subtotal + tax + serviceCharge,
      orderStatus: "Pending",
      paymentMethod: "Cash",
      isPaid: false,
    });
    console.log(`✅ 1 order created (orderNo: ${order.orderNo}).`);

    // ---------- 3. Bookings ----------
    await Booking.deleteMany({ restaurantId: restaurant._id });
    const bookingsData = [
      { daysFromNow: 1, time: "19:00", guests: 2 },
      { daysFromNow: 2, time: "20:00", guests: 4 },
      { daysFromNow: 3, time: "13:00", guests: 3 },
    ];

    for (const b of bookingsData) {
      const date = new Date();
      date.setDate(date.getDate() + b.daysFromNow);
      date.setHours(0, 0, 0, 0);

      await Booking.create({
        user: user._id,
        restaurantId: restaurant._id,
        bookingToken: String(Math.floor(10000000 + Math.random() * 90000000)),
        name: user.fullName,
        reservationDate: date,
        reservationTime: b.time,
        numGuests: b.guests,
        specialRequests: "Window seat if possible",
        contactPhone: "+919876543210",
        contactEmail: user.email,
        status: "Confirmed",
      });
    }
    console.log(`✅ ${bookingsData.length} bookings created.`);

    // ---------- 4. Offer ----------
    await Offer.deleteMany({ restaurantId: restaurant._id });
    await Offer.create({
      restaurantId: restaurant._id,
      offerName: "Weekend Special - 20% Off",
      offerDescription: "Get 20% off on all main course items this weekend.",
      offerImage: "https://via.placeholder.com/400x200.png?text=Weekend+Offer",
    });
    console.log("✅ 1 offer created.");

    console.log("\n🎉 Dummy data seeded successfully! Dashboard refresh kar ke dekh.");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();