import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
const cookies = new Cookies();

// receives component and any other props represented by ...rest
const ProtectedRoutes = () => {
  // get cookie from browser if logged in
  let token = cookies.get("TOKEN");
  return (
    token ? <Outlet /> : <Navigate to="/login" />
  );
}

export default ProtectedRoutes