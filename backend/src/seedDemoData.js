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
    console.log("Connected to MongoDB for Seeding City-Wise Rich Presentation Data...");

    // 1. Clean previous data
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});
    await Order.deleteMany({});
    await Booking.deleteMany({});
    await Offer.deleteMany({});
    console.log("🧹 Cleaned old database records.");

    // 2. Create Realistic City-Wise Restaurants
    // --- AHMEDABAD ---
    const bistroAmd = await Restaurant.create({
      ownerName: "SmartServe Admin",
      ownerEmail: "admin@smartserve.com",
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

    // --- GANDHINAGAR ---
    const pizzeriaGnr = await Restaurant.create({
      ownerName: "Marco Rossi",
      ownerEmail: "marco@bellaitalia.com",
      name: "Bella Italia Pizzeria & Trattoria",
      description: "Authentic Wood-Fired Neapolitan Pizzas, Handmade Creamy Pastas, and Italian Gelatos.",
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

    const greenKitchenGnr = await Restaurant.create({
      ownerName: "Harsh Patel",
      ownerEmail: "harsh@greenleaf.com",
      name: "Green Leaf Organic Dining",
      description: "Farm-to-Table Fresh Vegetarian Cuisine, North Indian Specialties & Gujarati Thalis.",
      phoneNumber: "+919811223345",
      openingTime: "11:30 AM",
      closingTime: "10:45 PM",
      address: "Near Reliance Cross Road, Kudasan",
      city: "Gandhinagar",
      state: "Gujarat",
      zipCode: "382421",
      isOpen: true,
      rating: 4.7,
      avatar: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop",
    });

    // --- RAJKOT ---
    const bbqRajkot = await Restaurant.create({
      ownerName: "Vikram Singhania",
      ownerEmail: "vikram@royalbbq.com",
      name: "Royal Spice Barbecue House",
      description: "Live Charcoal Grills, Smoked Kebabs, Dum Biryanis, and Rich Mughlai Curries.",
      phoneNumber: "+919822334455",
      openingTime: "12:00 PM",
      closingTime: "11:45 PM",
      address: "Kalawad Road, Near Crystal Mall",
      city: "Rajkot",
      state: "Gujarat",
      zipCode: "360005",
      isOpen: true,
      rating: 4.7,
      avatar: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop",
    });

    const kathiyawadiRajkot = await Restaurant.create({
      ownerName: "Bhavik Jadeja",
      ownerEmail: "bhavik@kathiyawadi.com",
      name: "Kathiyawadi Swad & Heritage Rasoi",
      description: "Traditional Kathiyawadi Sev Tameta, Ringna No Olo, Bajra Roti with Desi Makhan.",
      phoneNumber: "+919822334456",
      openingTime: "11:00 AM",
      closingTime: "11:00 PM",
      address: "150 Feet Ring Road, Mavdi",
      city: "Rajkot",
      state: "Gujarat",
      zipCode: "360004",
      isOpen: true,
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop",
    });

    // --- SURAT ---
    const suratBites = await Restaurant.create({
      ownerName: "Ketan Patel",
      ownerEmail: "ketan@suratgrill.com",
      name: "Surat Street Bites & Lounge",
      description: "Signature Fusion Snacks, Sizzlers, Sourdough Pizzas & Table QR Ordering.",
      phoneNumber: "+919833445566",
      openingTime: "11:00 AM",
      closingTime: "11:30 PM",
      address: "Gaurav Path, Piplod",
      city: "Surat",
      state: "Gujarat",
      zipCode: "395007",
      isOpen: true,
      rating: 4.6,
      avatar: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop",
    });

    // --- MUMBAI ---
    const mumbaiGrill = await Restaurant.create({
      ownerName: "Sameer Merchant",
      ownerEmail: "sameer@bayview.com",
      name: "Bayview Coastal Bistro & Bar",
      description: "Oceanfront Dining, Continental Platters, Gourmet Seafood & Signature Cocktails.",
      phoneNumber: "+919844556677",
      openingTime: "12:00 PM",
      closingTime: "01:00 AM",
      address: "Marine Drive, Nariman Point",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400021",
      isOpen: true,
      rating: 4.8,
      avatar: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&auto=format&fit=crop",
    });

    console.log("🏰 Created 8 Multi-City Restaurants across Ahmedabad, Gandhinagar, Rajkot, Surat, Mumbai.");

    // 3. Create Admin Users & Customer Users
    const adminUser1 = await User.create({
      fullName: "SmartServe Admin",
      email: "admin@smartserve.com",
      password: "adminpassword",
      isAdmin: true,
      isVerified: true,
      restaurantId: bistroAmd._id,
    });

    const adminUser2 = await User.create({
      fullName: "Restaurant Owner",
      email: "softpro1712@gmail.com",
      password: "adminpassword",
      isAdmin: true,
      isVerified: true,
      restaurantId: bistroAmd._id,
    });

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

    const customer3 = await User.create({
      fullName: "Amit Verma",
      email: "amit@gmail.com",
      password: "userpassword",
      isAdmin: false,
      isVerified: true,
    });

    console.log("👤 Created Admin & Customer Accounts.");

    // 4. Create Category-Wise Menu Items with HD Food Images
    const bistroMenuItemsData = [
      // Starters
      {
        itemName: "Tandoori Paneer Tikka",
        price: 240,
        description: "Fresh cottage cheese marinated in spiced yogurt and charred in a clay tandoor with bell peppers.",
        category: "Starters",
        isVeg: true,
        image: [{ publicId: "paneertikka", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },
      {
        itemName: "Crispy Veg Spring Rolls",
        price: 180,
        description: "Golden fried crispy pastry rolls filled with shredded seasonal vegetables and sweet chili dip.",
        category: "Starters",
        isVeg: true,
        image: [{ publicId: "springrolls", url: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },
      {
        itemName: "Steamed Himalayan Momos",
        price: 160,
        description: "Authentic Tibetan dumplings stuffed with seasoned minced veggies, served with spicy red chutney.",
        category: "Starters",
        isVeg: true,
        image: [{ publicId: "momos", url: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },
      {
        itemName: "BBQ Glazed Chicken Wings",
        price: 280,
        description: "Crispy chicken wings tossed in a rich smoky barbecue sauce with toasted sesame seeds.",
        category: "Starters",
        isVeg: false,
        image: [{ publicId: "wings", url: "https://images.unsplash.com/photo-1527477378408-1bc0a6042063?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },

      // Main Course
      {
        itemName: "Paneer Butter Masala",
        price: 280,
        description: "Tender cottage cheese cubes simmered in a velvety, buttery tomato and cashew gravy with fresh cream.",
        category: "MainCourse",
        isVeg: true,
        image: [{ publicId: "paneer", url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },
      {
        itemName: "Dal Makhani Grand Special",
        price: 220,
        description: "Slow-cooked black lentils simmered overnight with butter, cream, and aromatic spices.",
        category: "MainCourse",
        isVeg: true,
        image: [{ publicId: "dalmakhani", url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },
      {
        itemName: "Butter Chicken Delhi Style",
        price: 340,
        description: "Juicy roasted tandoori chicken cooked in a rich, mildly spiced aromatic makhani gravy.",
        category: "MainCourse",
        isVeg: false,
        image: [{ publicId: "butterchicken", url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },

      // Rice & Biryani
      {
        itemName: "Hyderabadi Dum Chicken Biryani",
        price: 330,
        description: "Fragrant basmati rice layered with spiced marinated chicken, saffron, caramelized onions, and herbs.",
        category: "Rice",
        isVeg: false,
        image: [{ publicId: "biryani", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },
      {
        itemName: "Royal Veg Dum Biryani",
        price: 260,
        description: "Dum cooked aromatic basmati rice with garden fresh vegetables, paneer, and rich saffron essence.",
        category: "Rice",
        isVeg: true,
        image: [{ publicId: "vegbiryani", url: "https://images.unsplash.com/photo-1642821373181-696a54913e93?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },

      // Breads & Pizza
      {
        itemName: "Cheese Garlic Bread",
        price: 150,
        description: "Freshly baked artisan baguette topped with roasted garlic butter, parsley, and melted mozzarella.",
        category: "Breads",
        isVeg: true,
        image: [{ publicId: "garlicbread", url: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },
      {
        itemName: "Margherita Supreme Pizza",
        price: 299,
        description: "Thin-crust sourdough pizza loaded with San Marzano tomato sauce, fresh mozzarella, and basil leaves.",
        category: "Pizza",
        isVeg: true,
        image: [{ publicId: "pizza", url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },

      // Burgers & Pasta
      {
        itemName: "Smoky Charcoal Veg Burger",
        price: 189,
        description: "Grilled crunchy veggie patty with cheddar cheese, caramelized onions, crisp lettuce, and secret sauce.",
        category: "Burger",
        isVeg: true,
        image: [{ publicId: "burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },
      {
        itemName: "Creamy Alfredo Pasta",
        price: 269,
        description: "Al dente penne pasta tossed in a rich garlic, butter, and Italian parmesan cream sauce with herbs.",
        category: "Pasta",
        isVeg: true,
        image: [{ publicId: "pasta", url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },

      // Beverages & Drinks
      {
        itemName: "Chilled Iced Cold Coffee",
        price: 120,
        description: "Rich espresso blended with chilled milk, vanilla bean ice cream, and cocoa powder dusting.",
        category: "Drinks",
        isVeg: true,
        image: [{ publicId: "coldcoffee", url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },
      {
        itemName: "Fresh Alphonso Mango Juice",
        price: 110,
        description: "100% pure chilled Alphonso mango pulp served fresh with a touch of mint.",
        category: "Juice",
        isVeg: true,
        image: [{ publicId: "mangojuice", url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },

      // Desserts
      {
        itemName: "Sizzling Chocolate Walnut Brownie",
        price: 160,
        description: "Warm fudgy walnut brownie served on a sizzling platter with vanilla ice cream and hot chocolate fudge.",
        category: "Desserts",
        isVeg: true,
        image: [{ publicId: "brownie", url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },
      {
        itemName: "Royal Double Sundae",
        price: 140,
        description: "Belgian chocolate and vanilla ice cream scoops drizzled with caramel sauce and roasted cashews.",
        category: "Ice cream",
        isVeg: true,
        image: [{ publicId: "sundae", url: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop" }],
        isAvailable: true,
      },
    ];

    const createdBistroItems = await Menu.insertMany(
      bistroMenuItemsData.map((item) => ({
        ...item,
        restaurantId: bistroAmd._id,
      }))
    );

    // Populate all restaurants with distinct curated menus
    await Menu.insertMany([
      // Urban Roastery (Ahmedabad)
      {
        itemName: "Avocado Sourdough Toast",
        price: 210,
        description: "Toasted artisan sourdough with smashed seasoned avocado, cherry tomatoes, and microgreens.",
        category: "Starters",
        isVeg: true,
        image: [{ publicId: "avotoast", url: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: cafeAmd._id,
      },
      {
        itemName: "Hazelnut Cold Brew Coffee",
        price: 150,
        description: "Slow-steeped single-origin coffee infused with roasted hazelnut and creamy oat milk.",
        category: "Drinks",
        isVeg: true,
        image: [{ publicId: "coldbrew", url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: cafeAmd._id,
      },

      // Gandhinagar Pizzeria
      {
        itemName: "Classic Margherita Pizza",
        price: 280,
        description: "Authentic wood-fired pizza with mozzarella and fresh basil.",
        category: "Pizza",
        isVeg: true,
        image: [{ publicId: "p1", url: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: pizzeriaGnr._id,
      },
      {
        itemName: "Peri Peri Chicken Pizza",
        price: 360,
        description: "Spicy roasted chicken, jalapenos, and melted mozzarella.",
        category: "Pizza",
        isVeg: false,
        image: [{ publicId: "p2", url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: pizzeriaGnr._id,
      },
      {
        itemName: "Creamy White Sauce Pasta",
        price: 250,
        description: "Penne in rich cheese garlic sauce with bell peppers.",
        category: "Pasta",
        isVeg: true,
        image: [{ publicId: "p3", url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: pizzeriaGnr._id,
      },

      // Green Leaf Organic (Gandhinagar)
      {
        itemName: "Royal Organic Gujarati Thali",
        price: 290,
        description: "Complete traditional thali with 3 organic curries, rotli, dal, rice, sweet, and buttermilk.",
        category: "MainCourse",
        isVeg: true,
        image: [{ publicId: "thali", url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: greenKitchenGnr._id,
      },
      {
        itemName: "Paneer Tikka Organic Bowl",
        price: 240,
        description: "Tandoori cottage cheese cubes served over brown rice, quinoa, and mint dip.",
        category: "MainCourse",
        isVeg: true,
        image: [{ publicId: "tikka", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: greenKitchenGnr._id,
      },

      // Rajkot BBQ
      {
        itemName: "Smoked Chicken Tikka Kebab",
        price: 310,
        description: "Charcoal grilled succulent chicken morsels with mint chutney.",
        category: "Starters",
        isVeg: false,
        image: [{ publicId: "bbq1", url: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: bbqRajkot._id,
      },
      {
        itemName: "Rajkot Special Dum Biryani",
        price: 340,
        description: "Richly spiced layered saffron biryani with fried onions.",
        category: "Rice",
        isVeg: false,
        image: [{ publicId: "bbq2", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: bbqRajkot._id,
      },

      // Rajkot Kathiyawadi
      {
        itemName: "Kathiyawadi Ringna No Olo & Rotla",
        price: 220,
        description: "Smoked roasted eggplant mash served with warm bajra rotla and white butter.",
        category: "MainCourse",
        isVeg: true,
        image: [{ publicId: "olo", url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: kathiyawadiRajkot._id,
      },
      {
        itemName: "Sev Tameta Nu Shaak",
        price: 180,
        description: "Tangy sweet and spicy tomato curry garnished with crispy sev.",
        category: "MainCourse",
        isVeg: true,
        image: [{ publicId: "sev", url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: kathiyawadiRajkot._id,
      },

      // Surat Bites
      {
        itemName: "Surati Cheese Locho Platter",
        price: 160,
        description: "Steamed seasoned gram flour delicacy topped with butter, sev, and cheese.",
        category: "Starters",
        isVeg: true,
        image: [{ publicId: "locho", url: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: suratBites._id,
      },
      {
        itemName: "Mexican Sizzler Supreme",
        price: 320,
        description: "Sizzling platter with Mexican rice, fries, sauteed veggies and cheese sauce.",
        category: "MainCourse",
        isVeg: true,
        image: [{ publicId: "sizzler", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: suratBites._id,
      },

      // Mumbai Coastal Bayview
      {
        itemName: "Butter Garlic Prawns Sizzler",
        price: 420,
        description: "Jumbo prawns tossed in garlic butter and herbs served on a sizzling hot plate.",
        category: "Starters",
        isVeg: false,
        image: [{ publicId: "prawns", url: "https://images.unsplash.com/photo-1527477378408-1bc0a6042063?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: mumbaiGrill._id,
      },
      {
        itemName: "Blue Ocean Lagoon Mocktail",
        price: 140,
        description: "Refreshing curacao citrus syrup with soda, crushed ice, and fresh mint.",
        category: "Drinks",
        isVeg: true,
        image: [{ publicId: "lagoon", url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop" }],
        isAvailable: true,
        restaurantId: mumbaiGrill._id,
      },
    ]);

    console.log(`🍕 Created 26+ Menu Items across all Restaurants.`);

    // 5. Create Live Orders in Different Lifecycle Stages (Pending, Received/Cooking, Served)
    const itemMap = {};
    createdBistroItems.forEach((i) => {
      itemMap[i.itemName] = i;
    });

    const ordersToCreate = [
      {
        user: customer1._id,
        restaurantId: bistroAmd._id,
        orderNo: "84729103",
        tableNumber: "Table 4",
        name: "Rahul Sharma",
        items: [
          { menu: itemMap["Paneer Butter Masala"]._id, name: "Paneer Butter Masala", quantity: "2", price: "280" },
          { menu: itemMap["Cheese Garlic Bread"]._id, name: "Cheese Garlic Bread", quantity: "1", price: "150" },
        ],
        taxPrice: 35,
        serviceCharge: 20,
        totalPrice: 765,
        orderStatus: "Pending", // Ready for live demo of accepting order!
        paymentMethod: "Cash",
        isPaid: false,
      },
      {
        user: customer2._id,
        restaurantId: bistroAmd._id,
        orderNo: "91823746",
        tableNumber: "Table 8",
        name: "Priya Patel",
        items: [
          { menu: itemMap["Hyderabadi Dum Chicken Biryani"]._id, name: "Hyderabadi Dum Chicken Biryani", quantity: "2", price: "330" },
          { menu: itemMap["Chilled Iced Cold Coffee"]._id, name: "Chilled Iced Cold Coffee", quantity: "2", price: "120" },
        ],
        taxPrice: 45,
        serviceCharge: 20,
        totalPrice: 965,
        orderStatus: "Pending", // Pending order
        paymentMethod: "Online",
        isPaid: true,
      },
      {
        user: customer3._id,
        restaurantId: bistroAmd._id,
        orderNo: "65481920",
        tableNumber: "Table 12",
        name: "Amit Verma",
        items: [
          { menu: itemMap["Margherita Supreme Pizza"]._id, name: "Margherita Supreme Pizza", quantity: "2", price: "299" },
          { menu: itemMap["Creamy Alfredo Pasta"]._id, name: "Creamy Alfredo Pasta", quantity: "2", price: "269" },
          { menu: itemMap["Sizzling Chocolate Walnut Brownie"]._id, name: "Sizzling Chocolate Walnut Brownie", quantity: "2", price: "160" },
        ],
        taxPrice: 72,
        serviceCharge: 25,
        totalPrice: 1553,
        orderStatus: "Received", // Currently in cooking / kitchen
        paymentMethod: "Card",
        isPaid: true,
      },
      {
        user: customer1._id,
        restaurantId: bistroAmd._id,
        orderNo: "38291045",
        tableNumber: "Table 2",
        name: "Rahul Sharma",
        items: [
          { menu: itemMap["Butter Chicken Delhi Style"]._id, name: "Butter Chicken Delhi Style", quantity: "2", price: "340" },
          { menu: itemMap["Cheese Garlic Bread"]._id, name: "Cheese Garlic Bread", quantity: "2", price: "150" },
        ],
        taxPrice: 49,
        serviceCharge: 20,
        totalPrice: 1049,
        orderStatus: "Received", // In kitchen
        paymentMethod: "Online",
        isPaid: true,
      },
      {
        user: customer2._id,
        restaurantId: bistroAmd._id,
        orderNo: "72619483",
        tableNumber: "Table 6",
        name: "Priya Patel",
        items: [
          { menu: itemMap["Tandoori Paneer Tikka"]._id, name: "Tandoori Paneer Tikka", quantity: "2", price: "240" },
          { menu: itemMap["Dal Makhani Grand Special"]._id, name: "Dal Makhani Grand Special", quantity: "2", price: "220" },
          { menu: itemMap["Royal Double Sundae"]._id, name: "Royal Double Sundae", quantity: "1", price: "140" },
        ],
        taxPrice: 60,
        serviceCharge: 20,
        totalPrice: 1280,
        orderStatus: "Served", // Completed order with downloadable invoice
        paymentMethod: "Cash",
        isPaid: true,
      },
      {
        user: customer3._id,
        restaurantId: bistroAmd._id,
        orderNo: "50192837",
        tableNumber: "Table 15",
        name: "Amit Verma",
        items: [
          { menu: itemMap["Smoky Charcoal Veg Burger"]._id, name: "Smoky Charcoal Veg Burger", quantity: "2", price: "189" },
          { menu: itemMap["Crispy Veg Spring Rolls"]._id, name: "Crispy Veg Spring Rolls", quantity: "2", price: "180" },
        ],
        taxPrice: 37,
        serviceCharge: 20,
        totalPrice: 795,
        orderStatus: "Served", // Completed order
        paymentMethod: "Card",
        isPaid: true,
      },
    ];

    await Order.insertMany(ordersToCreate);
    console.log(`🛒 Created ${ordersToCreate.length} Live Orders across all lifecycle stages.`);

    // 6. Create Table Bookings across Today & Future Dates
    const makeFutureDate = (daysFromNow) => {
      const d = new Date();
      d.setDate(d.getDate() + daysFromNow);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    const bookingsToCreate = [
      {
        user: customer1._id,
        restaurantId: bistroAmd._id,
        bookingToken: "BKG-7849201",
        name: "Rahul Sharma",
        reservationDate: makeFutureDate(1),
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
        reservationDate: makeFutureDate(1),
        reservationTime: "20:00",
        numGuests: 2,
        specialRequests: "Romantic candlelight table setup if possible.",
        contactPhone: "+919823456789",
        contactEmail: "priya@gmail.com",
        status: "Pending", // Ready for demo of confirming in Admin
      },
      {
        user: customer3._id,
        restaurantId: bistroAmd._id,
        bookingToken: "BKG-6251890",
        name: "Amit Verma",
        reservationDate: makeFutureDate(2),
        reservationTime: "13:00",
        numGuests: 6,
        specialRequests: "Family birthday gathering with high chairs.",
        contactPhone: "+919834567890",
        contactEmail: "amit@gmail.com",
        status: "Confirmed",
      },
      {
        user: customer1._id,
        restaurantId: bistroAmd._id,
        bookingToken: "BKG-4019283",
        name: "Rohan Mehta",
        reservationDate: makeFutureDate(2),
        reservationTime: "21:00",
        numGuests: 2,
        specialRequests: "Quiet corner table.",
        contactPhone: "+919845678901",
        contactEmail: "customer@gmail.com",
        status: "Pending",
      },
      {
        user: customer2._id,
        restaurantId: bistroAmd._id,
        bookingToken: "BKG-5381920",
        name: "Sneha Joshi",
        reservationDate: makeFutureDate(3),
        reservationTime: "19:00",
        numGuests: 5,
        specialRequests: "Corporate dinner with projector/screen access if available.",
        contactPhone: "+919856789012",
        contactEmail: "priya@gmail.com",
        status: "Confirmed",
      },
    ];

    await Booking.insertMany(bookingsToCreate);
    console.log(`📅 Created ${bookingsToCreate.length} Table Reservations across upcoming dates.`);

    // 7. Create Active Special Offers
    const offersToCreate = [
      {
        restaurantId: bistroAmd._id,
        offerName: "WEEKEND25 - Flat 25% OFF",
        offerDescription: "Enjoy 25% discount on all main course dishes and signature mocktails every Saturday & Sunday in Ahmedabad.",
        offerImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop",
      },
      {
        restaurantId: bistroAmd._id,
        offerName: "SWEETDEAL - Free Dessert",
        offerDescription: "Complimentary Sizzling Chocolate Brownie on all table orders above ₹999.",
        offerImage: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop",
      },
      {
        restaurantId: pizzeriaGnr._id,
        offerName: "BOGO PIZZA TUESDAYS",
        offerDescription: "Buy 1 Large Neapolitan Pizza and get another Gourmet Pizza completely free in Gandhinagar.",
        offerImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop",
      },
    ];

    await Offer.insertMany(offersToCreate);
    console.log(`🎁 Created ${offersToCreate.length} Active Special Offers.`);

    console.log("\n=======================================================");
    console.log("🎉 CITY-WISE DUMMY DATA SEEDED SUCCESSFULLY!");
    console.log("=======================================================");
    console.log("🛡️ Admin Login:    admin@smartserve.com (or softpro1712@gmail.com) / adminpassword");
    console.log("👤 Customer Login: customer@gmail.com (or priya@gmail.com) / userpassword");
    console.log("🏰 Main Restaurant: The Grand SmartServe Bistro (Ahmedabad) [ID: " + bistroAmd._id + "]");
    console.log("=======================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding presentation data:", error);
    process.exit(1);
  }
};

seedData();
