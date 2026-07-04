import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaShippingFast,
  FaGlobe,
  FaBoxes,
  FaHandshake,
  FaHeadset,
  FaClipboardCheck,
} from "react-icons/fa";

export default function Service() {
  const [openFaq, setOpenFaq] = useState({});

  const handleFaq = (index) => {
    setOpenFaq((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return (
    <section className="w-full overflow-hidden bg-white ">
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
              Service
            </button>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mt-5">
            our Srvices
          </h1>
        </div>
      </div>

      {/* boxes */}
      <div className="max-w-7xl mx-auto w-full my-7">
        <div className="flex flex-col items-center gap-3 mb-3">
          <p className="text-xl text-amber-300">WHY CHOOSE US</p>
          <h1 className="text-2xl font-bold ">Crafted with Purpose</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12 mx-4">
          {/* Service 01 */}
          <div className="flex border-l-4 border-amber-400 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="p-5">
              <div className="relative w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center">
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  01
                </div>
                <FaHandshake size={28} className="text-amber-600" />
              </div>
            </div>

            <div className="py-5 pr-5">
              <h3 className="text-xl font-bold mb-3">
                Global Buyer Assistance
              </h3>

              <p className="text-gray-600 leading-7 mb-4">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Repellat dolorem in, minus sint dolore iure eum quos saepe
                excepturi, natus recusandae cupiditate vel, quasi dignissimos!
                Nam labore beatae maiores quaerat.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="bg-amber-100 px-3 py-1 rounded-full text-sm">
                  Buyer Support
                </span>
                <span className="bg-amber-100 px-3 py-1 rounded-full text-sm">
                  Worldwide
                </span>
                <span className="bg-amber-100 px-3 py-1 rounded-full text-sm">
                  Quick Response
                </span>
              </div>
            </div>
          </div>

          {/* Service 02 */}
          <div className="flex border-l-4 border-green-400 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="p-5">
              <div className="relative w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                  02
                </div>
                <FaBoxes size={28} className="text-green-600" />
              </div>
            </div>

            <div className="py-5 pr-5">
              <h3 className="text-xl font-bold mb-3">Product Sourcing</h3>

              <p className="text-gray-600 leading-7 mb-4">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Repellat dolorem in, minus sint dolore iure eum quos saepe
                excepturi, natus recusandae cupiditate vel, quasi dignissimos!
                Nam labore beatae maiores quaerat.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 px-3 py-1 rounded-full text-sm">
                  Bulk Orders
                </span>
                <span className="bg-green-100 px-3 py-1 rounded-full text-sm">
                  Quality Assured
                </span>
                <span className="bg-green-100 px-3 py-1 rounded-full text-sm">
                  Reliable Supply
                </span>
              </div>
            </div>
          </div>

          {/* Service 03 */}
          <div className="flex border-l-4 border-blue-400 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="p-5">
              <div className="relative w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  03
                </div>
                <FaClipboardCheck size={28} className="text-blue-600" />
              </div>
            </div>

            <div className="py-5 pr-5">
              <h3 className="text-xl font-bold mb-3">Export Documentation</h3>

              <p className="text-gray-600 leading-7 mb-4">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Repellat dolorem in, minus sint dolore iure eum quos saepe
                excepturi, natus recusandae cupiditate vel, quasi dignissimos!
                Nam labore beatae maiores quaerat.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                  Compliance
                </span>
                <span className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                  Documentation
                </span>
                <span className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                  Easy Process
                </span>
              </div>
            </div>
          </div>

          {/* Service 04 */}
          <div className="flex border-l-4 border-purple-400 bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="p-5">
              <div className="relative w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">
                  04
                </div>
                <FaShippingFast size={28} className="text-purple-600" />
              </div>
            </div>

            <div className="py-5 pr-5">
              <h3 className="text-xl font-bold mb-3">Logistics & Delivery</h3>

              <p className="text-gray-600 leading-7 mb-4">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Repellat dolorem in, minus sint dolore iure eum quos saepe
                excepturi, natus recusandae cupiditate vel, quasi dignissimos!
                Nam labore beatae maiores quaerat.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="bg-purple-100 px-3 py-1 rounded-full text-sm">
                  Fast Delivery
                </span>
                <span className="bg-purple-100 px-3 py-1 rounded-full text-sm">
                  Global Shipping
                </span>
                <span className="bg-purple-100 px-3 py-1 rounded-full text-sm">
                  Secure Packaging
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQS */}

      <div className="w-full bg-amber-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Heading */}
          <div className="text-center mb-12">
            <p className="uppercase text-sm font-bold tracking-widest text-amber-500">
              FAQs
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-3">
              Frequently Asked Questions
            </h1>
          </div>

          {/* FAQ 1 */}
          <div className="bg-white rounded-2xl shadow-md mb-5 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center p-6 cursor-pointer">
              <h3 className="font-semibold text-lg">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit?
              </h3>

              <span
                className="text-2xl font-bold text-amber-500"
                onClick={() => handleFaq(0)}
              >
                +
              </span>
            </div>
            {openFaq[0] && (
              <div className=" px-6 pb-6 text-gray-600 leading-7">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Repellat dolorem in, minus sint dolore iure eum quos saepe
                excepturi, natus recusandae cupiditate vel, quasi dignissimos!
                Nam labore beatae maiores quaerat.
              </div>
            )}
          </div>

          {/* FAQ 2 */}
          <div className="bg-white rounded-2xl shadow-md mb-5 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center p-6 cursor-pointer">
              <h3 className="font-semibold text-lg">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit?
              </h3>

              <span
                className="text-2xl font-bold text-amber-500"
                onClick={() => handleFaq(1)}
              >
                +
              </span>
            </div>
            {openFaq[1] && (
              <div className=" px-6 pb-6 text-gray-600 leading-7">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Repellat dolorem in, minus sint dolore iure eum quos saepe
                excepturi, natus recusandae cupiditate vel, quasi dignissimos!
                Nam labore beatae maiores quaerat.
              </div>
            )}
          </div>

          {/* FAQ 3 */}
          <div className="bg-white rounded-2xl shadow-md mb-5 overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center p-6 cursor-pointer">
              <h3 className="font-semibold text-lg">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit?
              </h3>

              <span
                className="text-2xl font-bold text-amber-500"
                onClick={() => {
                  handleFaq(2);
                }}
              >
                +
              </span>
            </div>
            {openFaq[2] && (
              <div className="px-6 pb-6 text-gray-600 leading-7">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Repellat dolorem in, minus sint dolore iure eum quos saepe
                excepturi, natus recusandae cupiditate vel, quasi dignissimos!
                Nam labore beatae maiores quaerat.
              </div>
            )}
          </div>

          {/* FAQ 4 */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center p-6 cursor-pointer">
              <h3 className="font-semibold text-lg">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit?
              </h3>

              <span
                className="text-2xl font-bold text-amber-500"
                onClick={() => {
                  handleFaq(3);
                }}
              >
                +
              </span>
            </div>
            {openFaq[3] && (
              <div className="px-6 pb-6 text-gray-600 leading-7">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Repellat dolorem in, minus sint dolore iure eum quos saepe
                excepturi, natus recusandae cupiditate vel, quasi dignissimos!
                Nam labore beatae maiores quaerat.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
