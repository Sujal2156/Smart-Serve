import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "../Loginc/LoginPage";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // If user is authenticated, render protected page.
  // Otherwise, directly render the Login & Register page on the current route without ugly alerts.
  return userInfo ? <Outlet /> : <LoginPage setShowLogin={() => {}} isProtectedPrompt={true} />;
};

export default PrivateRoute;
