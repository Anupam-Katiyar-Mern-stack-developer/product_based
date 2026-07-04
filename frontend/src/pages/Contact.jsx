import React from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaHeadset,
  FaPhone,
} from "react-icons/fa";

import API from "../api/axios";

import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact() {
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
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
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
            <Link to="/contact">
              <button className="px-4 py-2 bg-green-500 rounded-full text-sm font-medium">
                Contact
              </button>
            </Link>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mt-5">
            Get in Touch
          </h1>
        </div>
      </div>

      <div className="w-full bg-amber-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Call */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <FaPhoneAlt className="text-amber-500 text-2xl" />
              </div>

              <h3 className="text-xl font-semibold mb-2">Call Us</h3>

              <p className="text-gray-500 mb-2">
                Speak directly with our support team
              </p>

              <a
                href="tel:+9111111111"
                className="font-semibold text-amber-600 hover:text-amber-700"
              >
                +91 11111111
              </a>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaEnvelope className="text-green-500 text-2xl" />
              </div>

              <h3 className="text-xl font-semibold mb-2">Email Us</h3>

              <p className="text-gray-500 mb-2">
                Send us your requirements anytime
              </p>

              <a
                href="mailto:info@company.com"
                className="font-semibold text-green-600"
              >
                info@company.com
              </a>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FaMapMarkerAlt className="text-blue-500 text-2xl" />
              </div>

              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>

              <p className="text-gray-500 mb-2">Our office location</p>

              <p className="font-semibold text-blue-600">
                demo
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="w-full bg-white mt-3">
        <div className="max-w-7xl mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mx-8 lg:mx-4">
            <div className="flex flex-col gap-2 my-3 shadow-lg px-6 lg:px-8 py-5 border-gray-100 rounded-lg">
              <p className="text-sm text-amber-200">Send a Message</p>
              <h1 className="text-2xl font-semibold">
                We'd Love to Hear from You
              </h1>
              <p className="text-sm">
                Fill the form below and we will get back to you within 24 hours.
              </p>

              <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <label className="font-normal mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  name="fullName"
                  value={formData.fullName}
                  required
                  onChange={handleChange}
                  className="w-full outline rounded px-3 py-2 mb-2 bg-white shadow-md"
                />

                <label className="font-normal mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Your email"
                  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded px-3 py-2 mb-2 outline bg-white shadow-md"
                />

                <label className="font-normal mb-1">Mob No.</label>
                <input
                  type="tel"
                  placeholder="Your mobile no"
                  maxLength={10}
                  required
                  pattern="[0-9]{10}"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onInput={(e) => {
                    e.target.value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10);
                  }}
                  className="w-full outline rounded px-3 py-2 mb-2 bg-white shadow-md"
                />

                <label className="font-normal mb-1">Message</label>
                <textarea
                  placeholder="Enter message..."
                  rows={4}
                  name="message"
                  value={formData.message}
                  required
                  onChange={handleChange}
                  className="w-full rounded px-3 py-2 mb-2 outline bg-white shadow-md resize-none"
                />

                <div className="flex items-center justify-center mb-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-green-700 w-full px-2 py-2 rounded text-xl text-white hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </div>

            <div className="flex flex-col gap-2 my-3 shadow-lg px-8 py-5 border-gray-100 rounded-lg bg-green-700">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold text-white">
                  Contact Information
                </h1>
                <p className="text-normal text-gray-100 ">
                 Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat, eveniet.
                </p>
              </div>

              <div className="flex flex-col mt-5 ">
                <div className="space-y-7">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50  flex items-center justify-center">
                      <FaMapMarkerAlt className="text-green-600 text-xl mt-1" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xl text-white">
                        demo 
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50  flex items-center justify-center">
                      <FaPhoneAlt className="text-green-600 text-xl mt-1" />
                    </div>

                    <p className="cursor-pointer hover:text-green-600 text-white">
                      +91 11111111
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-50  flex items-center justify-center">
                      <FaEnvelope className="text-green-600 text-xl mt-1" />
                    </div>

                    <p className="cursor-pointer hover:text-green-600 text-white">
                      info@example.com
                    </p>
                  </div>
                </div>
              </div>

              <button className="text-white flex bg-green-800 px-4 gap-5 py-3 rounded mt-3 cursor-pointer text-xl">
                <FaWhatsapp size={28} /> chat on whatsapp
              </button>

              <div className="flex gap-4 items-center my-5">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white cursor-pointer text-green-700">
                  <FaFacebook size={28} />
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white cursor-pointer text-green-700">
                  <FaLinkedin size={28} />
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white cursor-pointer text-green-700">
                  <FaInstagram size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-amber-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center w-full gap-3 mb-4">
            <p className="uppercase leading-1 text-amber-400 text-sm">
              Why Contact Us
            </p>
            <h1 className="text-xl font-bold ">We Are Here to Help</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 px-4 gap-5">
            <div className="flex flex-col shadow-sm rounded-2xl p-4 border bg-white border-gray-100 hover:-translate-y-1 transition-all items-center duration-300 lg:shadow-md">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaEnvelope className="text-green-500 text-2xl" />
              </div>
              <h1 className="text-center mb-2 font-bold text-xl">
                Quick Response
              </h1>
              <p className="text-center">
              Lorem ipsum dolor sit amet.
              </p>
            </div>

            <div className="flex flex-col shadow-sm rounded-2xl p-4 items-center border bg-white border-gray-100 hover:-translate-y-1 transition-all duration-300 lg:shadow-md">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaEnvelope className="text-green-500 text-2xl" />
              </div>
              <h1 className="text-center mb-2 font-bold text-xl">
                Trusted Service
              </h1>
              <p className="text-center">
               Lorem ipsum dolor, sit amet consectetur adipisicing.
              </p>
            </div>

            <div className="flex flex-col shadow-sm rounded-2xl p-4 border items-center bg-white border-gray-100 hover:-translate-y-1 transition-all duration-300 lg:shadow-md">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaEnvelope className="text-green-500 text-2xl" />
              </div>
              <h1 className="text-center mb-2 font-bold text-xl">
                Business Consultation
              </h1>
              <p className="text-center">
               Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat, eveniet.
              </p>
            </div>

            <div className="flex flex-col shadow-sm rounded-2xl p-4 border bg-white border-gray-100 hover:-translate-y-1 transition-all duration-300 lg:shadow-md">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaEnvelope className="text-green-500 text-2xl" />
              </div>
              <h1 className="text-center mb-2 font-bold text-xl">
                Reliable Partnership
              </h1>
              <p className="text-center">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat, eveniet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto p-7">
          <div className="flex justify-center items-center flex-col gap-4 mb-5">
            <p className="uppercase leading-2 font-normal text-sm text-amber-300">
              Our Location
            </p>
            <h1 className="text-xl font-bold leading-2">
              Find Us in demo
            </h1>
          </div>

          <div className="flex flex-col mx-1  my-2 w-full items-center justify-center">
            <div className="flex mb-6 w-full">
              <iframe
                src="https://www.google.com/maps?q=demo,Uttar%20Pradesh&output=embed"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
                className="rounded-2xl shadow-lg"
              ></iframe>
            </div>

            <div className="flex mx-4 w-full gap-4 flex-col lg:flex-row items-center justify-center">
              <div className="flex p-3  rounded border-gray-300 items-center justify-center bg-white border w-full">
                <div className="flex items-center justify-center p-4 flex-col gap-3">
                  <FaMapMarkerAlt size={25} />
                  <h1>Address</h1>
                  <p>demo </p>
                </div>
              </div>

              <div className="flex p-3 rounded border-gray-300 items-center justify-center bg-white border w-full">
                <div className="flex flex-col items-center justify-center p-4 gap-3">
                  <FaPhone size={25} />
                  <h1>phone</h1>
                  <p>+91 11111111</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
