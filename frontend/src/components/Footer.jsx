import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Footer() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get("/category/");
        setCategories(res.data.categories || res.data || []);
      } catch (eror) {
        
      }
    };

    fetchCategory();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    try {
      const res = await API.get(`/product/category/${categoryId}`);

      const products = res.data.products || [];

      if (products.length > 0) {
        navigate(`/products?category=${categoryId}`);
      } else {
        navigate(`/product_details/category/${categoryId}`);
      }
    } catch (error) {
      
    }
  };

  return (
    <footer className="bg-white shadow-md mt-16">
      <div
        className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-10
      "
      >
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-10
        "
        >
          {/* About */}
          <div>
            <img
              src="https://www.shutterstock.com/shutterstock/photos/1765746851/display_1500/stock-vector-demo-text-logo-design-icon-1765746851.jpg"
              alt="logo"
              className="h-10 mb-4"
            />

            <p className="text-gray-600 leading-7">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
              vitae magnam ipsam at inventore maiores repellat.
            </p>
          </div>

          {/* Links */}
          <div>
            <h2 className="font-bold text-lg">Quick Links</h2>

            <div
              className="
              w-16 h-1 mb-5 rounded-full
              bg-gradient-to-r
              from-blue-500
              to-green-500
            "
            />

            <ul className=" flex flex-col gap-2">
              <Link to="/">
                <li
                  className="
                    cursor-pointer
                    hover:text-green-600
                    hover:translate-x-2
                    transition-all
                  "
                >
                  Home
                </li>
              </Link>

              <Link to="/about">
                <li
                  className="
                    cursor-pointer
                    hover:text-green-600
                    hover:translate-x-2
                    transition-all
                  "
                >
                  About
                </li>
              </Link>

              <Link to="/service">
                <li
                  className="
                    cursor-pointer
                    hover:text-green-600
                    hover:translate-x-2
                    transition-all
                  "
                >
                  Service
                </li>
              </Link>

              <Link to="/product">
                <li
                  className="
                    cursor-pointer
                    hover:text-green-600
                    hover:translate-x-2
                    transition-all
                  "
                >
                  products
                </li>
              </Link>
            </ul>
          </div>

          {/* Category */}
          <div>
            <h2 className="font-bold text-lg">Category</h2>

            <div
              className="
              w-16 h-1 mb-5 rounded-full
              bg-gradient-to-r
              from-blue-500
              to-green-500
            "
            />

            <ul className="space-y-3">
              {categories.map((item) => (
                <div key={item._id}>
                  <li
                    onClick={() => handleCategoryClick(item._id)}
                    className="
                    cursor-pointer
                    hover:text-green-600
                    hover:translate-x-2
                    transition-all
                  "
                  >
                    {item.categoryName}
                  </li>
                </div>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-bold text-lg">Contact Us</h2>

            <div
              className="
              w-16 h-1 mb-5 rounded-full
              bg-gradient-to-r
              from-blue-500
              to-green-500
            "
            />

            <div className="space-y-4">
              <div className="flex gap-3">
                <FaMapMarkerAlt className="text-green-600 text-xl mt-1" />
                <p>demo </p>
              </div>

              <div className="flex gap-3">
                <FaPhoneAlt className="text-green-600 text-xl mt-1" />
                <p className="cursor-pointer hover:text-green-600">
                  +91 11111111
                </p>
              </div>

              <div className="flex gap-3">
                <FaEnvelope className="text-green-600 text-xl mt-1" />
                <p className="cursor-pointer hover:text-green-600">
                  info@example.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="
          mt-10
          pt-5
          border-t
          text-center
          text-gray-500
        "
        >
          © 2026 Demo Company. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
