import React, { useEffect, useState, useMemo } from "react";

import API from "../api/axios";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  const categoryId = searchParams.get("category");
  useEffect(() => {
    if (categoryId && categories.length > 0) {
      setSelectedCategories([categoryId]);
    }
  }, [categoryId, categories]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await API.get("/product/");

        setProducts(res.data.products || []);
      } catch (error) {
        console.error(error);

        setError(error.response?.data?.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const fetchCategory = async () => {
      try {
        const res = await API.get("/category");

        setCategories(res.data.categories || []);
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message || "Unable to load categories.",
        );
      }
    };

    fetchCategory();
  }, []);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const clearFilters = () => setSelectedCategories([]);

  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products;

    return products.filter((item) =>
      selectedCategories.includes(item.category._id),
    );
  }, [products, selectedCategories]);

  return (
    <section className="w-full bg-white">
      {/* Banner */}
      <div className="relative h-[280px] sm:h-[350px] md:h-[420px] flex items-center bg-gradient-to-br from-green-800 via-green-700 to-amber-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%),radial-gradient(circle_at_80%_70%,white,transparent_35%)]" />

        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-white">
            <Link to="/">
              <button className="px-4 py-1.5 bg-white/90 text-gray-800 rounded-full text-sm font-medium hover:bg-white transition">
                Home
              </button>
            </Link>
            <span className="text-white/60">/</span>
            <span className="px-4 py-1.5 bg-amber-400 text-gray-900 rounded-full text-sm font-semibold">
              Product
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mt-5">
            Our Products
          </h1>
          <p className="text-white/80 mt-2 max-w-md text-sm md:text-base">
            Handpicked, export-ready goods sourced directly from trusted growers
            and artisans.
          </p>
        </div>
      </div>

      <div className="w-full bg-white my-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-7">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Filters */}
            <aside className="w-full lg:w-[26%]">
              <div className="bg-white border border-gray-200 shadow-sm py-5 rounded-xl lg:sticky lg:top-5">
                <div className="flex justify-between items-center py-1 px-4">
                  <p className="font-bold text-lg">Category</p>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-amber-600 text-sm font-medium hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="h-px w-full bg-gray-200 my-3" />

                <div className="flex flex-col gap-1 px-2">
                  {categories.map((cat) => (
                    <label
                      key={cat._id}
                      className="flex items-center gap-2 cursor-pointer px-2 py-2 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat._id)}
                        onChange={() => toggleCategory(cat._id)}
                      />

                      <span>{cat.categoryName}</span>
                    </label>
                  ))}
                </div>

                <div className="px-4 mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    {filteredProducts.length} product
                    {filteredProducts.length !== 1 ? "s" : ""} found
                  </p>
                </div>
              </div>
            </aside>

            {/* Right Side - Products */}
            <div className="w-full lg:w-[74%]">
              {error && (
                <div className="mb-5 rounded-xl border border-red-300 bg-red-50 p-4">
                  <p className="text-red-600 font-medium">{error}</p>
                </div>
              )}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden border border-gray-200"
                    >
                      <div className="h-[250px] bg-gray-100 animate-pulse" />
                      <div className="p-4 space-y-2">
                        <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-lg font-semibold text-gray-700">
                    No products match this filter
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try clearing the category filter to see everything.
                  </p>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm hover:bg-amber-600 transition"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
                  {filteredProducts.map((item) => (
                    <Link
                      to={`/product_details/product/${item._id}`}
                      key={item._id}
                      className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="overflow-hidden relative">
                        <img
                          src={item.image}
                          alt={item.productName || "Unnamed Product"}
                          onError={(e) => {
                            e.target.src = "/no-image.png";
                          }}
                          className="w-full h-[230px] object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {item.category && (
                          <p className="p-3">{item.category?.categoryName || "Category"}</p>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-1">
                          {item.productName || "Unnamed Product"}
                        </h3>

                        <button className="w-full py-2 bg-amber-500 text-white rounded-lg font-medium group-hover:bg-amber-600 transition-colors">
                          View Details
                        </button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
