import os from "os";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

const healthCheck = asyncHandler(async (req, res) => {
  const localIp = getLocalIp();
  return res.status(200).json(new ApiResponse(200, { status: "OK", localIp }, "Health check passed."));
});

export { healthCheck };