// Food Category & Item Specific High-Resolution Images
const FOOD_IMAGE_MAP = {
  paneer: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop",
  biryani: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop",
  rice: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop",
  bread: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=600&auto=format&fit=crop",
  garlic: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=600&auto=format&fit=crop",
  pizza: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&auto=format&fit=crop",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop",
  roll: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop",
  spring: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop",
  momo: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&auto=format&fit=crop",
  coffee: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop",
  juice: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop",
  mango: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop",
  brownie: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop",
  icecream: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop",
  sundae: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop",
  dessert: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop",
  maincourse: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop",
  starter: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop",
};

export const getFoodFallbackByName = (name = "", category = "") => {
  const query = `${name} ${category}`.toLowerCase();
  for (const [key, url] of Object.entries(FOOD_IMAGE_MAP)) {
    if (query.includes(key)) {
      return url;
    }
  }
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop";
};

export const resolveFoodItemImage = (item) => {
  if (!item) {
    return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop";
  }

  let img = item.image;

  // Handle mongoose array or object wrappers
  if (Array.isArray(img) && img.length > 0) {
    img = img[0]?.url || img[0];
  } else if (img && typeof img === "object" && img.url) {
    img = img.url;
  }

  if (typeof img === "string" && img.trim()) {
    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) {
      return img;
    }
    const baseUrl = import.meta.env.VITE_API_BASE || "http://localhost:8080";
    return `${baseUrl}/images/${img}`;
  }

  // Smart food-specific fallback based on dish name and category
  return getFoodFallbackByName(item.name || item.itemName, item.category);
};
