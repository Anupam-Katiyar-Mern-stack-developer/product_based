import React, { useEffect, useState, useRef } from "react";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGlobeAsia,
  FaBoxOpen,
  FaShippingFast,
} from "react-icons/fa";

import Hero from "../components/Hero";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const reviews = [
  {
    text: "EthnoIndia Exports understands wholesale needs perfectly. Every shipment has matched the sample exactly.",
    name: "James Carter",
    loc: "London, UK",
  },
  {
    text: "Excellent export coordination and consistent quality across every order we've placed this year.",
    name: "Sarah Wilson",
    loc: "New York, USA",
  },
  {
    text: "Very professional team and smooth communication, even across time zones.",
    name: "Michael Brown",
    loc: "Sydney, Australia",
  },
  {
    text: "Reliable supplier and always on-time delivery, which is rare in this category.",
    name: "David Smith",
    loc: "Toronto, Canada",
  },
  {
    text: "Packaging quality and support were outstanding, nothing arrived damaged in transit.",
    name: "Emma Johnson",
    loc: "Berlin, Germany",
  },
  {
    text: "Best sourcing partner we've worked with so far, highly recommended for bulk orders.",
    name: "Robert Lee",
    loc: "Dubai, UAE",
  },
];

// Why choose us — three distinct, real value props instead of one card repeated
const features = [
  {
    icon: FaGlobeAsia,
    badge: "01",
    title: "Global Buyer Assistance",
    desc: "lorem5",
    tags: ["Single piece OK", "Pan India", "Quick replies"],
  },
  {
    icon: FaBoxOpen,
    badge: "02",
    title: "Artisan-Sourced Quality",
    desc: "lorem5",
    tags: ["Hand-checked", "Authentic craft", "Custom batches"],
  },
  {
    icon: FaShippingFast,
    badge: "03",
    title: "Reliable Export Logistics",
    desc: "lorem5",
    tags: ["Tracked shipping", "Secure packing", "On-time delivery"],
  },
];

const img1 = "/images/img1.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get("/category/");
        setCategories(res.data.categories || res.data || []);
      } catch (error) {
       
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategory();
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      setSubmitting(true);

      const res = await API.post("/contacts/add", formData);

      toast.success(res.data.message || "Message sent successfully.");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const [current, setCurrent] = useState(0);
  const autoRef = useRef(null);

  const goTo = (n) => {
    setCurrent((n + reviews.length) % reviews.length);
  };

  const startAuto = () => {
    autoRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % reviews.length);
    }, 3500);
  };

  const stopAuto = () => clearInterval(autoRef.current);

  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, []);

  const handleCategoryClick = async (categoryId) => {
    try {
      const res = await API.get(`/product/category/${categoryId}`);

      

      if (res.data.count > 0) {
        
        navigate(`/products?category=${categoryId}`);
      } else {
       
        navigate(`/product_details/category/${categoryId}`);
      }
    } catch (error) {
      
    }
  };

  return (
    <>
      <Hero />

      {/* Categories */}
      <section className="w-full bg-white my-2">
        <div className="max-w-7xl mx-auto flex flex-col my-12 px-4">
          <div className="flex flex-col gap-3 items-center text-center">
            <h6 className="text-amber-500 tracking-widest text-sm font-semibold">
              BROWSE BY CATEGORY
            </h6>
            <h3 className="text-3xl font-bold">Our Collections</h3>
            <p className="text-gray-600 mb-3 max-w-xl">
              From sacred idols to everyday jewellery, rooted in Bengal's
              artisan heritage
            </p>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-[310px] rounded-xl bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">
              Categories will appear here soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {categories.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleCategoryClick(item._id)}
                  className="group flex flex-col border border-gray-100 rounded-xl bg-white shadow-md overflow-hidden cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-full h-[250px] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.categoryName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <h1 className="font-semibold text-xl px-4 py-4">
                    {item.categoryName}
                  </h1>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section
        className="w-full h-[500px] bg-cover bg-center relative flex items-center"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome To Our Store
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200">
              Discover beautiful handcrafted collections made with tradition and
              love.
            </p>
            <Link to="/about">
              <button className="px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:scale-105 transition">
                Explore Collection
              </button>
            </Link>
          </div>

          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
            {[
              { label: "200+", sub: "Products" },
              { label: "30+", sub: "Countries Served" },
              { label: "15+", sub: "Years Experience" },
              { label: "98%", sub: "On-time Delivery" },
            ].map((s) => (
              <div
                key={s.sub}
                className="h-24 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center text-white"
              >
                <span className="text-2xl font-bold">{s.label}</span>
                <span className="text-xs text-gray-200">{s.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="w-full bg-white mt-10 mb-5">
        <div className="max-w-7xl mx-auto w-full px-4">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-sm tracking-widest text-amber-500 font-semibold">
              WHY CHOOSE US
            </p>
            <h1 className="text-3xl font-bold">Crafted with Purpose</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 mt-8 gap-6">
            {features.map(({ icon: Icon, badge, title, desc, tags }) => (
              <div
                key={badge}
                className="flex border-l-4 border-amber-300 cursor-pointer rounded-lg shadow-md bg-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-5 gap-4"
              >
                <div className="shrink-0">
                  <div className="h-14 w-14 flex items-center justify-center bg-amber-100 rounded-xl relative">
                    <div className="absolute -top-2 -right-2 rounded-full px-2 py-0.5 bg-amber-500 text-white text-xs font-semibold">
                      {badge}
                    </div>
                    <Icon size={26} className="text-amber-700" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h1 className="text-lg font-bold">{title}</h1>
                  <p className="text-sm text-gray-600">{desc}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="bg-amber-100 text-amber-800 px-2 text-xs rounded-full py-1 text-center"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full bg-amber-50 py-14">
        <div className="max-w-7xl mx-auto flex flex-col items-center px-4">
          <div className="flex flex-col items-center text-center mb-8">
            <p className="text-sm tracking-widest text-amber-500 font-semibold">
              CUSTOMER REVIEWS
            </p>
            <h1 className="font-bold text-3xl">What They Say</h1>
          </div>

          <div
            className="relative w-full max-w-lg overflow-hidden"
            onMouseEnter={stopAuto}
            onMouseLeave={startAuto}
          >
            <button
              onClick={() => goTo(current - 1)}
              aria-label="Previous review"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-amber-400 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <FaChevronLeft />
            </button>

            <button
              onClick={() => goTo(current + 1)}
              aria-label="Next review"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-amber-400 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <FaChevronRight />
            </button>

            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {reviews.map((r, i) => (
                <div key={i} className="min-w-full px-8">
                  <div className="bg-white p-6 rounded-2xl shadow-md">
                    <p className="text-amber-400 text-xl">★★★★★</p>
                    <p className="text-lg font-medium my-3">{r.text}</p>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-gray-500 text-sm">{r.loc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            {current + 1} / {reviews.length}
          </p>

          <div className="flex gap-2 mt-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`w-3 h-3 rounded-full transition-all ${
                  current === i ? "bg-amber-500 scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="w-full bg-white mt-3 mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center flex-col items-center py-3 my-2">
            <h1 className="text-sm font-semibold uppercase text-amber-500">GET IN TOUCH</h1>
            <p className="text-3xl  font-bold">We're Here to Help</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 my-3 shadow-lg px-8 py-6 border border-gray-100 rounded-lg">
              <p className="text-sm text-amber-500 font-semibold tracking-widest">
                SEND A MESSAGE
              </p>
              <h1 className="text-2xl font-semibold">
                We'd Love to Hear from You
              </h1>
              <p className="text-sm text-gray-500">
                Fill the form below and we'll get back to you within 24 hours.
              </p>

              <form
                className="flex flex-col gap-3 mt-2"
                onSubmit={handleSubmit}
              >
                <div>
                  <label className="font-medium text-sm mb-1 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded px-3 py-2 bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="font-medium text-sm mb-1 block">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Your email"
                    pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded px-3 py-2 bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="font-medium text-sm mb-1 block">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Your mobile no"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                    }}
                    className="w-full rounded px-3 py-2 bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="font-medium text-sm mb-1 block">
                    Message
                  </label>
                  <textarea
                    placeholder="Enter your message..."
                    rows={4}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded px-3 py-2 bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-green-700 w-full px-2 py-2.5 rounded text-lg font-semibold text-white cursor-pointer hover:-translate-y-0.5 hover:bg-green-800 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-2 my-3 shadow-lg px-8 py-6 border-gray-100 rounded-lg bg-green-700">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold text-white">
                  Contact Information
                </h1>
                <p className="text-gray-100">
                 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat, eveniet.
                </p>
              </div>

              <div className="flex flex-col mt-5">
                <div className="space-y-6">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                      <FaMapMarkerAlt className="text-green-600 text-xl" />
                    </div>
                    <p className="text-white">demo </p>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                      <FaPhoneAlt className="text-green-600 text-xl" />
                    </div>
                    <a
                      href="tel:+9111111111"
                      className="cursor-pointer hover:text-amber-200 text-white transition-colors"
                    >
                      +91 11111111
                    </a>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                      <FaEnvelope className="text-green-600 text-xl" />
                    </div>
                    <a
                      href="mailto:info@ethnoindiaexports.com"
                      className="cursor-pointer hover:text-amber-200 text-white transition-colors"
                    >
                      info@ethnoindiaexports.com
                    </a>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/9111111111"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white flex items-center bg-green-800 px-4 gap-4 py-3 rounded mt-5 cursor-pointer text-lg font-medium hover:bg-green-900 transition-colors"
              >
                <FaWhatsapp size={26} /> Chat on WhatsApp
              </a>

              <div className="flex gap-4 items-center my-5">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white cursor-pointer text-green-700 hover:scale-110 transition-transform"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white cursor-pointer text-green-700 hover:scale-110 transition-transform"
                >
                  <FaLinkedin size={24} />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white cursor-pointer text-green-700 hover:scale-110 transition-transform"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
