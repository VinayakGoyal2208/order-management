import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRestaurants } from "../../api/user.api";
import { useAuth } from "../../hooks/useAuth";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const { user } = useAuth();

  // 🔥 FETCH FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.log("Error fetching restaurants:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* 🔝 NAVBAR */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-10 py-4 bg-white shadow gap-4">
        <h1 className="text-2xl font-bold text-green-600">
          🍔 FoodHub
        </h1>

        <div className="flex items-center gap-3 w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search restaurants..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />

          {!user ? (
            <Link to="/login">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Login
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              {/* USER NAME */}
              <span className="text-sm font-medium text-gray-600">
                👋 {user.user?.name}
              </span>

              {/* LOGOUT BUTTON */}
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  window.location.reload(); // simple reset
                }}
                className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🎯 HERO */}
      <div className="px-6 md:px-10 py-14 text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Simplify Bulk Food Ordering 🍽️
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto text-sm md:text-base">
          Order from multiple restaurants, manage bulk orders, and streamline
          your business food supply — all in one place.
        </p>
      </div>

      {/* 🍽️ RESTAURANTS */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg md:text-xl font-semibold">
            Restaurants Taking Orders
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {restaurants.map((res) => (
            <div
              key={res._id}
              className="bg-white rounded-xl shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300"
            >
              <img
                src={
                  res.image ||
                  "https://via.placeholder.com/300x200?text=Restaurant"
                }
                className="w-full h-44 object-cover rounded-t-xl"
                alt={res.name}
              />

              <div className="p-4">
                <h3 className="font-semibold text-lg">
                  {res.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {res.address || "Location not available"}
                </p>

                <div className="flex justify-between items-center mt-2 text-sm">
                  <span>⭐ {res.rating || 4.5}</span>

                  <span
                    className={`px-2 py-1 rounded text-xs ${res.status === "Open"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                      }`}
                  >
                    {res.status || "Open"}
                  </span>
                </div>

                {/* 🔐 ACCESS CONTROL */}
                {user ? (
                  <Link to={`/menu/${res._id}`}>
                    <button
                      disabled={res.status === "Closed"}
                      className={`mt-4 w-full py-2 rounded ${res.status === "Closed"
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                    >
                      {res.status === "Closed"
                        ? "Closed"
                        : "View Menu"}
                    </button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                      Login to Order
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ⚙️ HOW IT WORKS */}
      <div className="bg-white py-12 px-6">
        <h2 className="text-center text-lg md:text-xl font-semibold mb-8">
          How It Works
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { icon: "🍽️", title: "Choose Restaurant" },
            { icon: "🛒", title: "Add to Cart" },
            { icon: "💳", title: "Place Order" },
            { icon: "🚚", title: "Get Delivered" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-50 p-6 rounded-xl shadow text-center hover:shadow-md transition"
            >
              <p className="text-3xl">{item.icon}</p>
              <p className="font-medium mt-3">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}