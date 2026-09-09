import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CategoryNavbar from "../components/CategoryNavbar";

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