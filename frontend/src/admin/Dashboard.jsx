import { useEffect, useState } from "react";
import {
  FiPackage,
  FiLayers,
  FiMail,
} from "react-icons/fi";
import API from "../api/axios";
import { toast } from "react-toastify";
import ChatChart from "./ChatChart";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [count, setCount] = useState(0);
  const [catCount, setCatCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [productRes, categoryRes, contactRes] = await Promise.all([
        API.get("/product/"),
        API.get("/category/"),
        API.get("/contacts/"),
      ]);

      // Products
      const latestProducts = (productRes.data.products || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setProducts(latestProducts);
      setCount(productRes.data.count || 0);

      // Categories
      setCatCount(categoryRes.data.count || 0);

      // Contacts
      const latestContacts = (contactRes.data.contacts || [])
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setContacts(latestContacts);
      setContactCount(contactRes.data.count || 0);
    } catch (error) {
      

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-lg font-semibold text-gray-500">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* Heading */}

      <div className="mb-5">
        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard
        </h2>

        <p className="text-gray-500">
          Welcome back, Admin 👋
        </p>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-xl shadow border p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">
              Total Products
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {count}
            </h2>
          </div>

          <div className="bg-[#D4AF37] h-14 w-14 rounded-xl flex justify-center items-center">
            <FiPackage size={28} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">
              Total Categories
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {catCount}
            </h2>
          </div>

          <div className="bg-[#D4AF37] h-14 w-14 rounded-xl flex justify-center items-center">
            <FiLayers size={28} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-sm">
              Total Enquiries
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {contactCount}
            </h2>
          </div>

          <div className="bg-[#D4AF37] h-14 w-14 rounded-xl flex justify-center items-center">
            <FiMail size={28} />
          </div>
        </div>

      </div>

      {/* Recent Section */}
      <div className="grid lg:grid-cols-2 gap-5 mt-6">
      <ChatChart />

      <div className="grid lg:grid-cols-2 gap-5 mt-6">

        {/* Products */}

        <div className="bg-white rounded-xl shadow border">

          <div className="border-b px-5 py-4">
            <h3 className="font-semibold text-lg">
              Recent Products
            </h3>
          </div>

          <div>

            {products.length === 0 ? (
              <p className="p-5 text-center text-gray-500">
                No Products Found
              </p>
            ) : (
              products.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center p-4 border-b last:border-none hover:bg-gray-50"
                >
                  <div className="flex gap-3 items-center">

                    <img
                      src={item.image}
                      alt=""
                      className="h-14 w-14 rounded-lg object-cover"
                    />

                    <div>
                      <h4 className="font-semibold">
                        {item.productName}
                      </h4>

                      <p className="text-sm text-gray-500">
                        {item.category?.categoryName}
                      </p>
                    </div>

                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </span>

                </div>
              ))
            )}

          </div>

        </div>

        {/* Enquiries */}

        <div className="bg-white rounded-xl shadow border">

          <div className="border-b px-5 py-4">
            <h3 className="font-semibold text-lg">
              Recent Enquiries
            </h3>
          </div>

          <div>

            {contacts.length === 0 ? (
              <p className="p-5 text-center text-gray-500">
                No Enquiries Found
              </p>
            ) : (
              contacts.map((item) => (
                <div
                  key={item._id}
                  className="p-4 border-b last:border-none hover:bg-gray-50"
                >
                  <div className="flex justify-between">

                    <div>

                      <h4 className="font-semibold">
                        {item.fullName}
                      </h4>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.message}
                      </p>

                    </div>

                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString("en-IN")}
                    </span>

                  </div>

                </div>
              ))
            )}

          </div>

        </div>

      </div>
      </div>

    </div>
  );
}