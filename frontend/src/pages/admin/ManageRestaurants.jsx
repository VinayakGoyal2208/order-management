import { useEffect, useState } from "react";
import {
  getRestaurantsAdmin,
  deleteRestaurant,
} from "../../api/admin.api";
import Sidebar from "../../components/Sidebar";

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await getRestaurantsAdmin();
      setRestaurants(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete restaurant?")) return;

    await deleteRestaurant(id);
    fetchData();
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Manage Restaurants
          </h1>

          <span className="text-sm text-gray-500">
            Total Restaurants: {restaurants.length}
          </span>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Address</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6">
                      Loading restaurants...
                    </td>
                  </tr>
                ) : restaurants.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-500">
                      No restaurants found
                    </td>
                  </tr>
                ) : (
                  restaurants.map((r) => (
                    <tr
                      key={r._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {r.name}
                      </td>

                      <td className="p-4 text-gray-600">
                        {r.email}
                      </td>

                      <td className="p-4 text-gray-600">
                        {r.phone}
                      </td>

                      <td className="p-4 text-gray-600">
                        {r.address}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-xs transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

        </div>
      </div>
    </div>
  );
}