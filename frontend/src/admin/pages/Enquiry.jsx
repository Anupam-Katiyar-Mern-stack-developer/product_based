import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import API from "../../api/axios";

export default function Enquiry() {
  const [search, setSearch] = useState("");
  const [enquiries, setEnquiries] = useState([]);

  const handleDelete = async(id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if(!confirmDelete) return ;
    try{
      const res =await API.delete(`/contacts/delete/${id}`);
      alert(res.data.message);
      setEnquiries((prev)=>prev.filter((item)=> item._id !== id));
    }
    catch(eror){
      
    alert(error.response?.data?.message || "Failed to delete enquiry");
    }
    


  };

  const filtered = enquiries.filter((item) =>
    [item.name, item.email, item.phone, item.subject, item.message]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  useEffect(() => {

    const fetchContacts = async () => {
      try {
        const res = await API.get("/contacts");
        setEnquiries(res.data.contacts || res.data || []);
      } catch (eror) {
        
      }
    };

    fetchContacts();
  },[]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Enquiries
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage customer enquiries
          </p>
        </div>
        <span className="text-xs bg-gray-100 text-gray-500 font-medium px-3 py-1.5 rounded-lg">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={15}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, subject..."
          className="w-full bg-white border rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#D4AF37] shadow-sm"
        />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border p-6 text-center text-sm text-gray-400">
            No enquiries found.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border shadow-sm p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-gray-800 truncate">
                    {item.fullName}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">{item.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="h-7 w-7 flex-shrink-0 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
                >
                  <RiDeleteBin6Line size={13} />
                </button>
              </div>

              <div className="mt-2.5 space-y-1">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span>📞 {item.phone}</span>
                  <span>📌 {item.subject}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {item.message}
                </p>
                <p className="text-[11px] text-gray-400">{item.createdAt}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl border shadow-sm overflow-x-auto">
        <table className="w-full min-w-[750px]">
          <thead>
            <tr className="bg-gray-50 border-b">
              {[
                "Name",
                "Email",
                "Phone",
               
                "Message",
             
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide ${h === "Action" ? "text-center" : "text-left"}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No enquiries found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item._id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2.5 font-semibold text-sm text-gray-800 whitespace-nowrap">
                    {item.fullName}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.email}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.phone}
                  </td>
                  
                  <td className="px-4 py-2.5 max-w-[220px]">
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {item.message}
                    </p>
                  </td>
                 
                  <td className="px-4 py-2.5">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="h-8 w-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
                      >
                        <RiDeleteBin6Line size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
