  import { useState } from "react";
  import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
  import "./App.css";
  import { ToastContainer } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";
  import ChatWidget from "./components/ChatWidget";
  import Chat from "./admin/pages/Chat"


  import Hero from "./components/Hero";
  import Home from "./pages/Home";
  import Navbar from "./components/Navbar";

  import Footer from "./components/Footer";
  import About from "./pages/About";
  import Service from "./pages/Service";
  import Contact from "./pages/Contact";
  import Product_details from "./pages/Product_details";
  import Product from "./pages/Product";

  import Login from "./admin/Login";
  import AdminLayout from "./admin/pages/AdminLayout";
  import Dashboard from "./admin/Dashboard";
  import Product_list from "./admin/pages/Product_list";
  import Add_Product from "./admin/pages/Add_Product";
  import Add_Category from "./admin/pages/Add_Category";
  import CategoryList from "./admin/pages/CAtegory_list";
  import Enquiry from "./admin/pages/Enquiry";
  import ProtectedRoute from "./admin/components/ProtectedRoute";
  import VerifyOTP from "./admin/Veryfy";
  import ResetPassword from "./admin/ResetPassword";

  function App() {
    return (
      <>
      <ToastContainer position="top-right" autoClose={3000} />
    
    
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Navbar />
              <Home />
              <Footer />
            </div>
          }
        />

        <Route
          path="/about"
          element={
            <div>
              <Navbar />
              <About />
              <Footer />
            </div>
          }
        />

        <Route
          path="/contact"
          element={
            <div>
              <Navbar />
              <Contact />
              <Footer />
            </div>
          }
        />

        <Route
          path="/products"
          element={
            <div>
              <Navbar />
              <Product />
              <Footer />
            </div>
          }
        />

        <Route
          path="/products/:id"
          element={
            <div>
              <Navbar />
              <Product />
              <Footer />
            </div>
          }
        />
        <Route
          path="/service"
          element={
            <div>
              <Navbar />
              <Service />
              <Footer />
            </div>
          }
        />

        <Route
          path="/product_details/:type/:id"
          element={
            <>
              <Navbar />
              <Product_details />
              <Footer />
            </>
          }
        />

        {/* admin routing  */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />

          <Route path="dashboard" element={<Dashboard />} />

          <Route path="products" element={<Product_list />} />

          <Route path="products/add" element={<Add_Product />} />

          <Route path="products/edit/:id" element={<Add_Product />} />

          <Route path="categories" element={<CategoryList />} />

          <Route path="categories/add" element={<Add_Category />} />

          <Route path="categories/edit/:id" element={<Add_Category />} />

          <Route path="enquiries" element={<Enquiry />} />
          <Route path="/admin/chat" element={<Chat />} />
          
        </Route>
        
        <Route path="admin/login" element={<Login />} />
        <Route path="/admin/verify-otp" element={<VerifyOTP />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
      </Routes>
      
        <ChatWidget />
      </>
    );
  }

  export default App;
