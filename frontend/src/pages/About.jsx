import React from "react";
import {
  FaCheckCircle,
  FaAward,
  FaGlobe,
  FaHandshake,
  FaShippingFast,
  FaHeadset,
  FaBoxes,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="w-full overflow-hidden">
      <div
        className="relative h-[280px] sm:h-[350px] md:h-[450px] bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url('YOUR_BANNER_IMAGE')` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-white">
            <Link to="/">
              <button className="px-4 py-2 bg-amber-400 rounded-full text-sm font-medium">
                Home
              </button>
            </Link>

            <span>/</span>

            <button className="px-4 py-2 bg-green-500 rounded-full text-sm font-medium">
              About Us
            </button>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mt-5">
            About Us
          </h1>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Section */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/33846967/pexels-photo-33846967.jpeg"
              alt=""
              className="w-full h-[320px] sm:h-[400px] lg:h-[500px] object-cover rounded-3xl shadow-xl"
            />

            <div
              className="
      absolute bottom-4 right-4
      md:bottom-6 md:right-6
      bg-white
      px-5 py-4
      rounded-2xl
      shadow-2xl
      border-l-4 border-green-500
    "
            >
              <h2 className="text-3xl md:text-4xl font-bold text-green-600">
                15+
              </h2>

              <p className="font-semibold text-gray-800">Years Experience</p>

              <span className="text-sm text-gray-500">Trusted Worldwide</span>
            </div>
          </div>
          {/* Content Section */}
          <div className="flex flex-col gap-6">
            <p className="text-amber-500 font-semibold uppercase tracking-wider">
              Who We Are
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
             lorem Exports
            </h1>

            <p className="text-gray-600 leading-8">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
              dolorem in, minus sint dolore iure eum quos saepe excepturi, natus
              recusandae cupiditate vel, quasi dignissimos! Nam labore beatae
              maiores quaerat.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                <p>Premium Quality Products</p>
              </div>

              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                <p>Worldwide Export Services</p>
              </div>

              <div className="flex items-center gap-3">
                <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
                <p>100% Customer Satisfaction</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link to="/products">
                <button className="px-6 py-3 bg-amber-400 text-white rounded-xl shadow-md hover:bg-amber-500 transition">
                  Explore Products
                </button>
              </Link>

              <Link to="/contact">
                <button className="px-6 py-3 border border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 transition">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="w-full bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <h1 className="text-4xl font-bold text-amber-500">200+</h1>
              <p className="mt-2 text-gray-600">Handcrafted Products</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <h1 className="text-4xl font-bold text-green-500">4.6★</h1>
              <p className="mt-2 text-gray-600">Customer Rating</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <h1 className="text-4xl font-bold text-blue-500">50+</h1>
              <p className="mt-2 text-gray-600">Export Countries</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md text-center">
              <h1 className="text-4xl font-bold text-purple-500">1000+</h1>
              <p className="mt-2 text-gray-600">Happy Clients</p>
            </div>
          </div>
        </div>
      </div>

      <section className="w-full bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-14">
            <p className="text-amber-500 font-semibold uppercase tracking-wider">
              Why Choose Us
            </p>

            <h2 className="text-3xl md:text-5xl font-bold mt-3">
              Why Global Buyers Trust Us
            </h2>

            <p className="text-gray-600 max-w-3xl mx-auto mt-4">
              We deliver premium quality products, reliable sourcing, and
              professional export services that help businesses grow with
              confidence.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div
              className="
          bg-white
          p-8
          rounded-3xl
          border border-gray-200
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-2
          transition-all
          duration-300
          group
        "
            >
              <div
                className="
            w-16 h-16
            rounded-2xl
            bg-amber-100
            flex items-center justify-center
            mb-6
            group-hover:bg-amber-400
            transition-all
          "
              >
                <FaGlobe
                  size={28}
                  className="text-amber-500 group-hover:text-white"
                />
              </div>

              <h3 className="text-2xl font-bold mb-3">Global Trade Network</h3>

              <p className="text-gray-600 leading-7">
               Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
              dolorem in, minus sint dolore iure eum quos saepe excepturi, natus
              recusandae cupiditate vel, quasi dignissimos! Nam labore beatae
              maiores quaerat.
              </p>
            </div>

            {/* Card 2 */}
            <div
              className="
          bg-white
          p-8
          rounded-3xl
          border border-gray-200
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-2
          transition-all
          duration-300
          group
        "
            >
              <div
                className="
            w-16 h-16
            rounded-2xl
            bg-green-100
            flex items-center justify-center
            mb-6
            group-hover:bg-green-500
            transition-all
          "
              >
                <FaAward
                  size={28}
                  className="text-green-600 group-hover:text-white"
                />
              </div>

              <h3 className="text-2xl font-bold mb-3">Premium Quality</h3>

              <p className="text-gray-600 leading-7">
                 Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
              dolorem in, minus sint dolore iure eum quos saepe excepturi, natus
              recusandae cupiditate vel, quasi dignissimos! Nam labore beatae
              maiores quaerat.
              </p>
            </div>

            {/* Card 3 */}
            <div
              className="
          bg-white
          p-8
          rounded-3xl
          border border-gray-200
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-2
          transition-all
          duration-300
          group
        "
            >
              <div
                className="
            w-16 h-16
            rounded-2xl
            bg-blue-100
            flex items-center justify-center
            mb-6
            group-hover:bg-blue-500
            transition-all
          "
              >
                <FaHandshake
                  size={28}
                  className="text-blue-600 group-hover:text-white"
                />
              </div>

              <h3 className="text-2xl font-bold mb-3">Trusted Partnership</h3>

              <p className="text-gray-600 leading-7">
               Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
              dolorem in, minus sint dolore iure eum quos saepe excepturi, natus
              recusandae cupiditate vel, quasi dignissimos! Nam labore beatae
              maiores quaerat.
              </p>
            </div>

            {/* Card 4 */}
            <div
              className="
          bg-white
          p-8
          rounded-3xl
          border border-gray-200
          shadow-lg
          hover:shadow-2xl
          hover:-translate-y-2
          transition-all
          duration-300
          group
        "
            >
              <div
                className="
            w-16 h-16
            rounded-2xl
            bg-purple-100
            flex items-center justify-center
            mb-6
            group-hover:bg-purple-500
            transition-all
          "
              >
                <FaShippingFast
                  size={28}
                  className="text-purple-600 group-hover:text-white"
                />
              </div>

              <h3 className="text-2xl font-bold mb-3">Timely Delivery</h3>

              <p className="text-gray-600 leading-7">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellat
              dolorem in, minus sint dolore iure eum quos saepe excepturi, natus
              recusandae cupiditate vel, quasi dignissimos! Nam labore beatae
              maiores quaerat.
              </p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
