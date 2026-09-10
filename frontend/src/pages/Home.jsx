import React from "react";
import Navbar from "../features/customer/components/layout/Navbar";
import Footer from "../features/customer/components/layout/Footer";
import CategoryNavbar from "../features/customer/components/layout/CategoryNavbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <CategoryNavbar />
      <main style={{ minHeight: "60vh" }}></main>
      <Footer />
    </>
  );
}