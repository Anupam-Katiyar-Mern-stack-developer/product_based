import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function Product_details() {
  const { type, id } = useParams();

  const isProduct = type === "product";

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);

  const [mainImage, setMainImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        if (isProduct) {
          const res = await API.get(`/product/${id}`);

          const productData = res.data.product;

          if (!productData) {
            throw new Error("Product not found.");
          }

          setProduct(productData);
          setCategory(null);

          setMainImage(productData.image);

          // category can come back populated ({_id, categoryName, ...})
          // or as a plain id string — handle both so we never send
          // "[object Object]" to the backend
          const categoryId =
            productData.category?._id || productData.category;

          if (categoryId) {
            const related = await API.get(`/product/category/${categoryId}`);

            setRelatedProducts(
              (related.data.products || []).filter(
                (item) => item._id !== productData._id,
              ),
            );
          } else {
            setRelatedProducts([]);
          }
        } else {
          const res = await API.get(`/category/${id}`);

          const categoryData = res.data.category;

          if (!categoryData) {
            throw new Error("Category not found.");
          }

          setCategory(categoryData);
          setProduct(null);

          setMainImage(categoryData.image);

          const catRes = await API.get("/category");

          setAllCategories(catRes.data.categories || []);
        }
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load details.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isProduct]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/category");

        setAllCategories(res.data.categories || []);
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message || "Unable to load categories.",
        );
      }
    };

    fetchCategories();
  }, []);

  const data = isProduct ? product : category;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-semibold">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <h1 className="text-3xl font-bold text-red-600">{error}</h1>

        <button
          onClick={() => window.location.reload()}
          className="bg-amber-500 px-6 py-3 rounded-lg text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="w-full bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Image */}
          <div>
            <div className="rounded-3xl overflow-hidden border border-gray-200 shadow">
              <img
                src={mainImage}
                alt=""
                className="w-full h-[500px] object-cover"
              />
            </div>

            {type === "product" && product.images?.length > 0 && (
              <div className="flex gap-3 mt-5 flex-wrap">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                     src={img.url}
                    onClick={() => setMainImage(img)}
                    className={`w-24 h-24 rounded-xl border-2 cursor-pointer object-cover transition
                  ${
                    mainImage === img
                      ? "border-amber-500"
                      : "border-gray-200 hover:border-amber-400"
                  }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Content */}

          <div className="flex flex-col">
            <span className="text-amber-500 uppercase font-semibold tracking-wider">
              {type === "product" ? "Product" : "Category"}
            </span>

            <h1 className="text-4xl font-bold text-gray-800 mt-2">
              {type === "product" ? product.productName : category.categoryName}
            </h1>

            {type === "product" && (
              <>
                <h2 className="text-2xl font-semibold mt-8 mb-3">
                  Product Specification
                </h2>

                <div className="bg-gray-50 border rounded-xl p-5 whitespace-pre-line leading-8 text-gray-700">
                  {product.specification}
                </div>
              </>
            )}

            <h2 className="text-2xl font-semibold mt-8 mb-3">Description</h2>

            <p className="text-gray-600 leading-8 text-justify">
              {data.description}
            </p>

            <div className="flex gap-4 mt-8">
              <Link to='/contact' className="px-7 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition">
                Send Enquiry
              </Link>

              <button className="px-7 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition">
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}

      <div className="bg-amber-50 mt-20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-amber-500 uppercase tracking-wider">
              Explore More
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {isProduct ? "Related Products" : "All Categories"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {(isProduct ? relatedProducts : allCategories)
              .filter((item) => (isProduct ? true : item._id !== id))
              .map((item) => (
                <Link
                  key={item._id}
                  to={
                    isProduct
                      ? `/product_details/product/${item._id}`
                      : `/product_details/category/${item._id}`
                  }
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-2xl duration-300">
                    <div className="overflow-hidden">
                      <img
                        src={item.image}
                        className="h-60 w-full object-cover group-hover:scale-110 duration-500"
                        alt=""
                      />
                    </div>

                    <div className="p-5">
                      <h3 className="font-semibold text-lg">
                        {isProduct ? item.productName : item.categoryName}
                      </h3>

                      <Link
                        to={`/product_details/product/${item._id}`}
                        className="mt-4 w-full py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 flex items-center justify-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}