import { FiEdit, FiSearch } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function Product_list() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/`);

        setProducts(res.data.products || res.data || []);

        
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/product/delete/${id}`);

      setProducts((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Products
          </h2>

          <p className="text-gray-500 text-sm mt-1">Manage all your products</p>
        </div>

        <Link
          to="/admin/products/add"
          className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#b78f25] transition px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <IoMdAdd size={20} />
          Add Product
        </Link>
      </div>

      {/* Search */}

      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="relative w-full sm:max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search Product..."
            className="w-full border rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border shadow-sm p-10 text-center text-gray-400">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border shadow-sm p-10 text-center text-gray-400">
          No products found
        </div>
      ) : (
        <>
          {/* Mobile View */}

          <div className="md:hidden space-y-4">
            {products.map((item) => (
              <div
                key={item._id || item.id}
                className="bg-white border rounded-xl shadow-sm p-4"
              >
                <div className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {item.productName}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-400 uppercase mb-2">
                    Gallery
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    {(item.images || []).map((img, index) => (
                      <img
                        key={index}
                         src={img.url}
                        alt=""
                        className="w-12 h-12 rounded object-cover border"
                      />
                    ))}

                    {(!item.images || item.images.length === 0) && (
                      <span className="text-xs text-gray-400">
                        No gallery images
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase text-gray-400">
                    Specification
                  </p>

                  <p className="text-sm font-medium mt-1">
                    {item.specification}
                  </p>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link
                    to={`/admin/products/edit/${item._id}`}
                    className="flex-1"
                  >
                    <button
                      type="button"
                      className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition"
                    >
                      <FiEdit size={18} />
                      Edit
                    </button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium transition"
                  >
                    <RiDeleteBin6Line size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}

          <div className="hidden md:block bg-white rounded-xl border shadow-sm overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3">Image</th>

                  <th className="text-left px-4 py-3">Product</th>

                  <th className="text-left px-4 py-3">Gallery</th>

                  <th className="text-left px-4 py-3">Description</th>

                  <th className="text-left px-4 py-3">Specification</th>

                  <th className="text-center px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((item) => (
                  <tr
                    key={item._id || item.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* Image */}
                    <td className="px-4 py-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                    </td>

                    {/* Product Name */}
                    <td className="px-4 py-3">
                      <h4 className="font-semibold text-gray-800 whitespace-nowrap">
                        {item.productName}
                      </h4>
                    </td>

                    {/* Gallery */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {(item.images || []).slice(0, 3).map((img, index) => (
                          <img
                            key={index}
                             src={img.url}
                            alt=""
                            className="w-10 h-10 rounded-md object-cover border"
                          />
                        ))}

                        {item.images && item.images.length > 3 && (
                          <div className="w-10 h-10 rounded-md border bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                            +{item.images.length - 3}
                          </div>
                        )}

                        {(!item.images || item.images.length === 0) && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3 max-w-[250px]">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    </td>

                    {/* Specification */}
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.specification}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Link to={`/admin/products/edit/${item._id}`}>
                          <button className="h-9 w-9 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition">
                            <FiEdit size={16} />
                          </button>
                        </Link>

                        <button
                          className="h-9 w-9 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
                          onClick={() => handleDelete(item._id)}
                        >
                          <RiDeleteBin6Line size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
