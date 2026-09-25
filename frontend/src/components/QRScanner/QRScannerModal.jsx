import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { useGetRestaurantQuery } from "../../slices/restaurantApitSlice";

const QRScannerModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sample_qr"); // default to standee for presentation
  const [selectedTable, setSelectedTable] = useState("Table 4");
  const [cameraError, setCameraError] = useState("");
  const [networkHost, setNetworkHost] = useState("10.110.82.231");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const { data: restaurantsData } = useGetRestaurantQuery();
  const restaurants = restaurantsData?.data?.restaurants || restaurantsData?.data || [];
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");

  useEffect(() => {
    if (restaurants.length > 0 && !selectedRestaurantId) {
      setSelectedRestaurantId(restaurants[0]._id);
    }
  }, [restaurants, selectedRestaurantId]);

  // Fetch local server IP for phone-friendly scannable QR URLs
  useEffect(() => {
    fetch("/api/v1/healthcheck")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.localIp && data.data.localIp !== "localhost") {
          setNetworkHost(data.data.localIp);
        }
      })
      .catch(() => {});
  }, []);

  const handleScanSuccess = (result) => {
    if (!result) return;
    onClose();
    toast.success("QR Code recognized! Opening menu... 🎯");

    if (result.includes("/restaurant/")) {
      const path = result.substring(result.indexOf("/restaurant/"));
      navigate(path);
    } else if (result.startsWith("http://") || result.startsWith("https://")) {
      try {
        const parsed = new URL(result);
        navigate(parsed.pathname);
      } catch (e) {
        window.location.href = result;
      }
    } else {
      navigate(`/restaurant/${result}/menu`);
    }
  };

  // Camera scanner lifecycle
  useEffect(() => {
    let html5QrCode = null;

    if (isOpen && activeTab === "scan") {
      setCameraError("");
      const timer = setTimeout(async () => {
        try {
          const element = document.getElementById("qr-reader-viewport");
          if (!element) return;

          html5QrCode = new Html5Qrcode("qr-reader-viewport");
          const cameras = await Html5Qrcode.getCameras().catch(() => []);

          if (cameras && cameras.length > 0) {
            const cameraId = cameras[cameras.length - 1].id;
            await html5QrCode.start(
              cameraId,
              {
                fps: 10,
                qrbox: { width: 220, height: 220 },
              },
              (decodedText) => {
                html5QrCode.stop().then(() => {
                  html5QrCode.clear();
                  handleScanSuccess(decodedText);
                }).catch(() => {
                  handleScanSuccess(decodedText);
                });
              },
              (errorMessage) => {}
            );
          } else {
            await html5QrCode.start(
              { facingMode: "environment" },
              {
                fps: 10,
                qrbox: { width: 220, height: 220 },
              },
              (decodedText) => {
                html5QrCode.stop().then(() => {
                  html5QrCode.clear();
                  handleScanSuccess(decodedText);
                }).catch(() => {
                  handleScanSuccess(decodedText);
                });
              },
              (errorMessage) => {}
            );
          }
        } catch (err) {
          console.warn("Camera init note:", err);
          setCameraError(
            "Camera stream unavailable. You can snap a QR photo with your camera or select a demo standee."
          );
        }
      }, 200);

      return () => {
        clearTimeout(timer);
        if (html5QrCode) {
          try {
            html5QrCode.stop().catch(() => {}).finally(() => {
              try { html5QrCode.clear(); } catch (e) {}
            });
          } catch (e) {}
        }
      };
    }
  }, [isOpen, activeTab]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const html5QrCode = new Html5Qrcode("qr-reader-viewport");
      const decodedText = await html5QrCode.scanFile(file, true);
      html5QrCode.clear();
      handleScanSuccess(decodedText);
    } catch (err) {
      toast.error("No valid QR code found in this image. Please try another photo.");
    }
  };

  if (!isOpen) return null;

  const currentRestaurant =
    restaurants.find((r) => r._id === selectedRestaurantId) || restaurants[0];

  const activeHost =
    typeof window !== "undefined" &&
    window.location.hostname &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
      ? window.location.hostname
      : networkHost || "10.110.82.231";

  const targetMenuUrl = currentRestaurant
    ? `http://${activeHost}:5173/restaurant/${currentRestaurant._id}/menu`
    : window.location.href;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    targetMenuUrl
  )}&margin=12&color=111827`;

  const copyMenuLink = () => {
    navigator.clipboard?.writeText(targetMenuUrl);
    setCopied(true);
    toast.success("Menu URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-fade-in"
    >
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100/60 relative max-h-[94vh] flex flex-col">
        {/* Sleek Header */}
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-black text-white px-6 py-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-xl">📱</span>
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight">SmartServe QR</h3>
              <p className="text-xs text-gray-400">Interactive Table Standee & Digital Scanner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close QR Scanner"
            title="Close"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white flex items-center justify-center transition-all duration-200 shadow-lg shadow-red-500/40 border border-red-300/50 hover:scale-110 active:scale-95 cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5 text-white stroke-[2.5]" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-gray-100 bg-gray-50/70 p-1.5 gap-1.5 flex-shrink-0">
          <button
            onClick={() => setActiveTab("sample_qr")}
            className={`flex-1 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2 ${
              activeTab === "sample_qr"
                ? "bg-white text-gray-900 shadow-md shadow-gray-200/50"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/60"
            }`}
          >
            <span>🏷️</span> Table Standee (Demo)
          </button>
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex-1 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-center transition-all flex items-center justify-center gap-2 ${
              activeTab === "scan"
                ? "bg-white text-[#ff6347] shadow-md shadow-gray-200/50"
                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/60"
            }`}
          >
            <span>📷</span> Camera Scanner
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-gray-50/30">
          {activeTab === "sample_qr" ? (
            /* Luxury Table Standee Card */
            <div className="flex flex-col items-center">
              {/* Standee Frame */}
              <div className="w-full max-w-[340px] bg-gradient-to-b from-gray-900 via-gray-900 to-black rounded-[2rem] p-1 shadow-2xl shadow-orange-950/20 border border-gray-800 relative">
                {/* Metallic Gold Top Accent */}
                <div className="h-1.5 w-20 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 rounded-full mx-auto my-1.5 opacity-90"></div>

                {/* Standee Inner Canvas */}
                <div className="bg-white rounded-[1.75rem] p-5 text-center flex flex-col items-center relative overflow-hidden">
                  {/* Subtle Background Pattern */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none"></div>

                  {/* Brand & Badge */}
                  <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-gray-100">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-base">🍽️</span>
                      <span className="font-black text-xs tracking-wider uppercase text-gray-900">
                        SmartServe
                      </span>
                    </div>
                    <span className="flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-green-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Verified Partner
                    </span>
                  </div>

                  {/* Restaurant Name & Location */}
                  <h4 className="font-extrabold text-base text-gray-900 leading-snug line-clamp-1 max-w-[280px]">
                    {currentRestaurant?.name || "The Grand SmartServe Bistro"}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 mb-3">
                    <span className="bg-orange-50 text-orange-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-orange-200/60">
                      📍 {currentRestaurant?.city || "Ahmedabad"}
                    </span>
                    <span className="bg-gray-900 text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-sm">
                      {selectedTable}
                    </span>
                  </div>

                  {/* QR Box with High-Tech Corner Crosshairs */}
                  <div className="relative p-2.5 bg-white rounded-2xl shadow-md border-2 border-orange-100 my-1 group">
                    {/* Crosshair accents */}
                    <div className="absolute top-1 left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#ff6347] rounded-tl-sm"></div>
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#ff6347] rounded-tr-sm"></div>
                    <div className="absolute bottom-1 left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#ff6347] rounded-bl-sm"></div>
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#ff6347] rounded-br-sm"></div>

                    <img
                      src={qrImageUrl}
                      alt="Scannable Table QR"
                      className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-xl"
                    />
                  </div>

                  {/* Instructions Callout */}
                  <div className="mt-3">
                    <p className="text-[12px] font-bold text-gray-800">
                      Scan with Phone Camera or Google Lens
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Instantly browse digital menu, dietary tags & place table orders
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Controls: Change Restaurant & Table for Presentation */}
              <div className="w-full mt-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
                <div className="flex gap-3 mb-3">
                  <div className="flex-1">
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                      Choose Restaurant:
                    </label>
                    <select
                      value={selectedRestaurantId}
                      onChange={(e) => setSelectedRestaurantId(e.target.value)}
                      className="w-full text-xs font-bold p-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 cursor-pointer"
                    >
                      {restaurants.map((r) => (
                        <option key={r._id} value={r._id}>
                          {r.name} ({r.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-28">
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
                      Table Standee:
                    </label>
                    <select
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      className="w-full text-xs font-bold p-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-gray-800 cursor-pointer"
                    >
                      {["Table 1", "Table 2", "Table 4", "Table 5", "Table 8", "Table 12"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex gap-2">
                  <button
                    onClick={copyMenuLink}
                    className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{copied ? "✅" : "📋"}</span>
                    <span>{copied ? "Link Copied" : "Copy Link"}</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/restaurant/${currentRestaurant?._id}/menu`);
                    }}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>🚀</span>
                    <span>Open Menu Directly</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Tab 2: Live Camera Scanner */
            <div>
              <p className="text-gray-600 text-xs sm:text-sm text-center mb-3">
                Point your webcam or phone camera at the Table Standee QR code:
              </p>

              {/* Viewport Box */}
              <div className="relative rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 mb-4 min-h-[230px] flex flex-col items-center justify-center text-white p-2 shadow-inner">
                <div id="qr-reader-viewport" className="w-full"></div>

                {cameraError && (
                  <div className="text-center p-4">
                    <p className="text-xs text-yellow-300 mb-3">{cameraError}</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#ff6347] text-white text-xs font-bold rounded-xl shadow hover:bg-orange-600 transition-all"
                    >
                      📁 Upload / Snap QR Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Hidden File Input for snapshot / gallery */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Snap / Upload Button */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-gray-200 transition-colors"
                >
                  <span>📸</span> Snap / Pick QR Photo
                </button>
                <button
                  onClick={() => setActiveTab("sample_qr")}
                  className="flex-1 py-2.5 px-3 bg-orange-50 hover:bg-orange-100 text-[#ff6347] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-orange-200 transition-colors"
                >
                  <span>🏷️</span> View Demo Standees →
                </button>
              </div>

              {/* Direct Restaurant Quick Launcher */}
              {restaurants.length > 0 && (
                <div className="border-t border-gray-100 pt-3">
                  <span className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    ⚡ Quick Launch Digital Menu:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {restaurants.slice(0, 4).map((res) => (
                      <button
                        key={res._id}
                        onClick={() => {
                          onClose();
                          navigate(`/restaurant/${res._id}/menu`);
                        }}
                        className="text-left px-3 py-2.5 bg-white hover:bg-orange-50/70 rounded-xl border border-gray-200/70 hover:border-orange-300 transition-all flex items-center justify-between shadow-sm"
                      >
                        <span className="text-xs font-bold text-gray-800 truncate mr-2">
                          {res.name}
                        </span>
                        <span className="text-[10px] bg-[#ff6347] text-white px-2 py-0.5 rounded-md font-bold flex-shrink-0">
                          Open →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;
