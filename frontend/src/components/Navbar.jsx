import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiChevronDown, FiX } from "react-icons/fi";
import API from "../api/axios";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false); // desktop hover dropdown
  const [mobileProductOpen, setMobileProductOpen] = useState(false); // mobile accordion
  const [category, setCategory] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const closeTimer = useRef(null);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  // fetch categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get("/category");
        setCategory(res.data.categories || []);
      } catch (error) {
        
      }
    };

    fetchCategory();
  }, []);

  // close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setMobileProductOpen(false);
    setProductOpen(false);
  }, [location.pathname]);

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // close desktop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProductOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // desktop hover open
  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setProductOpen(true);
  };

  // desktop hover close
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setProductOpen(false);
    }, 150);
  };

  // category click logic
  const handleCategoryClick = async (categoryId) => {
    try {
      const res = await API.get(`/product/category/${categoryId}`);
      const products = res.data.products || [];

      setProductOpen(false);
      setIsOpen(false);
      setMobileProductOpen(false);

      if (products.length > 0) {
        navigate(`/products?category=${categoryId}`);
      } else {
        navigate(`/product_details/category/${categoryId}`);
      }
    } catch (error) {
     
    }
  };

  const navLinkClass = (path) =>
    `font-semibold text-lg cursor-pointer transition ${
      location.pathname === path
        ? "text-green-600"
        : "text-gray-800 hover:text-green-600"
    }`;

  return (
    <div className="w-full bg-white sticky z-50 top-0 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link to="/" className="h-10 flex-shrink-0">
          <img
            src="https://www.shutterstock.com/shutterstock/photos/1765746851/display_1500/stock-vector-demo-text-logo-design-icon-1765746851.jpg"
            alt="logo"
            className="h-10"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex">
          <ul className="flex gap-8 items-center">
            <li>
              <Link to="/" className={navLinkClass("/")}>
                Home
              </Link>
            </li>

            <li>
              <Link to="/about" className={navLinkClass("/about")}>
                About
              </Link>
            </li>

            <li>
              <Link to="/service" className={navLinkClass("/service")}>
                Service
              </Link>
            </li>

            {/* PRODUCT DROPDOWN */}
            <li
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setProductOpen((prev) => !prev)}
                className="flex items-center gap-1 font-semibold text-lg text-gray-800 hover:text-green-600 transition"
              >
                Product
                <FiChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    productOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-0 mt-3 w-56 bg-white shadow-xl rounded-xl border py-2 transition-all duration-200 origin-top ${
                  productOpen
                    ? "opacity-100 visible scale-100"
                    : "opacity-0 invisible scale-95 pointer-events-none"
                }`}
              >
                {category.length > 0 ? (
                  category.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleCategoryClick(item._id)}
                      className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {item.categoryName}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2.5 text-sm text-gray-400">
                    No categories found
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>

        {/* Contact — desktop */}
        <Link to="/contact" className="hidden lg:block flex-shrink-0">
          <button className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition">
            Contact
          </button>
        </Link>

        {/* Mobile Hamburger / Close Toggle */}
        <button
          className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 flex-shrink-0"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Overlay backdrop — mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* MOBILE MENU — slide panel */}
      <div
        ref={navRef}
        className={`lg:hidden fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={() => setIsOpen(false)}>
            <FiX size={22} />
          </button>
        </div>

        <div className="flex flex-col px-5 py-4 gap-1 overflow-y-auto h-[calc(100%-64px)]">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`py-2.5 border-b ${
              location.pathname === "/" ? "text-green-600 font-semibold" : "text-gray-800"
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className={`py-2.5 border-b ${
              location.pathname === "/about" ? "text-green-600 font-semibold" : "text-gray-800"
            }`}
          >
            About
          </Link>

          <Link
            to="/service"
            onClick={() => setIsOpen(false)}
            className={`py-2.5 border-b ${
              location.pathname === "/service" ? "text-green-600 font-semibold" : "text-gray-800"
            }`}
          >
            Service
          </Link>

          {/* Mobile Product Accordion */}
          <div className="border-b">
            <button
              onClick={() => setMobileProductOpen((prev) => !prev)}
              className="flex items-center justify-between w-full py-2.5 text-gray-800 font-medium"
            >
              Product
              <FiChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  mobileProductOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                mobileProductOpen ? "max-h-96 pb-2" : "max-h-0"
              }`}
            >
              {category.length > 0 ? (
                category.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleCategoryClick(item._id)}
                    className="py-2 pl-3 text-gray-600 cursor-pointer text-sm"
                  >
                    {item.categoryName}
                  </div>
                ))
              ) : (
                <div className="py-2 pl-3 text-sm text-gray-400">
                  No categories found
                </div>
              )}
            </div>
          </div>

          <Link to="/contact" onClick={() => setIsOpen(false)}>
            <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg transition">
              Contact
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;