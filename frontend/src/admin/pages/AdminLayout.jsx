import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiGrid,
  FiPackage,
  FiLayers,
  FiMail,
  FiLogOut,
  FiMenu,
  FiX,
  FiMessageCircle,
} from "react-icons/fi";

import { useState, useEffect } from "react";

const navLinks = [
  { to: "/admin/dashboard", icon: <FiGrid size={18} />, label: "Dashboard" },

  {
    to: "/admin/categories",
    icon: <FiLayers size={18} />,
    label: "Categories",
  },

  {
    to: "/admin/products",
    icon: <FiPackage size={18} />,
    label: "Products",
  },

  {
    to: "/admin/enquiries",
    icon: <FiMail size={18} />,
    label: "Enquiries",
  },

  // 👇 NEW
  {
    to: "/admin/chat",
    icon: <FiMessageCircle size={18} />,
    label: "Live Chat",
  },
];

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/categories": "Categories",
  "/admin/products": "Products",
  "/admin/enquiries": "Enquiries",

  // 👇 NEW
  "/admin/chat": "Live Chat",
};

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("admin");

    if (data) {
      setAdmin(JSON.parse(data));
    }
  }, []);

 const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin"); // ye bhi clear karna chahiye, warna purana admin data reh jayega
  toast.success("Logged out successfully");
  navigate("/admin/login", { replace: true });
};

  const currentTitle = pageTitles[location.pathname] || "Admin Panel";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-[#111827] text-white w-64 fixed lg:relative h-screen z-50 flex flex-col
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo + Close btn */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#D4AF37] flex items-center justify-center font-bold text-black text-lg">
              T
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight">Admin Panel</h2>
              <p className="text-[11px] text-gray-400">Techmark Universal</p>
            </div>
          </div>
          {/* Close — only mobile */}
          <button
            className="lg:hidden text-gray-400 hover:text-white transition"
            onClick={() => setOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {navLinks.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                 ${isActive ? "bg-[#D4AF37] text-black" : "text-gray-300 hover:bg-gray-800 hover:text-white"}`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-medium transition"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Right side: Navbar + scrollable content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar — fixed height, no scroll */}
        <header className="bg-white shadow-sm px-5 py-3 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900 transition"
              onClick={() => setOpen(!open)}
            >
              <FiMenu size={22} />
            </button>
            <h1 className="text-lg font-bold text-gray-800">{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold text-black text-sm">
              {admin?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-sm leading-tight">
                {admin?.name || "Admin"}
              </p>

              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </header>

        {/* Page content — only this scrolls */}
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
