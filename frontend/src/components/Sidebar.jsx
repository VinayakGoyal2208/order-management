import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const role = user?.user?.role || user?.role;

  const menuItems = {
    user: [
      { name: "Home", path: "/" },
      { name: "Orders", path: "/orders" },
      { name: "Cart", path: "/cart" },
    ],
    restaurant: [
      { name: "Dashboard", path: "/restaurant" },
      { name: "Orders", path: "/restaurant/orders" },
      { name: "Menu Management", path: "/restaurant/menu-management" },
    ],
    admin: [
      { name: "Dashboard", path: "/admin" },
      { name: "Manage Users", path: "/admin/users" },
      { name: "Manage Restaurants", path: "/admin/restaurants" },
      { name: "Create Restaurant", path: "/admin/create-restaurant" },
    ],
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">

      <div className="p-5 text-xl font-bold border-b border-gray-700">
        FoodB2B
      </div>

      <div className="flex-1 p-4 space-y-2">
        {menuItems[role]?.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${isActive ? "bg-green-500" : "hover:bg-gray-800 text-gray-300"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>


      <div className="p-4 border-t border-gray-700">
        <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 p-2 rounded-lg">
          Logout
        </button>
      </div>
    </div >
  );
}