import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../parts/footer/Footer";
import Header from "../../parts/header/Header";

function Auth() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Auth;
