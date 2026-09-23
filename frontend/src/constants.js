// constants.js
const getApiBaseUrl = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // When accessing from phone or LAN IP (e.g. 10.110.82.231 or 192.168.x.x)
    if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
      return `http://${hostname}:8080`;
    }
  }
  return import.meta.env.VITE_API_BASE || "http://localhost:8080";
};

export const BASE_URL = getApiBaseUrl();
export const USER_URL = "/api/v1/user";
export const RESTAURANT_URL = "/api/v1/restaurant";
export const ORDER_URL = "/api/v1";
export const PAYPAL_URL = "/api/config/paypal";
export const MENU_URL = "/api/v1";
export const OFFER_URL = "/api/v1";
export const BOOK_TABLE_URL = "/api/v1/booking";