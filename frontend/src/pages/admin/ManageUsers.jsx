import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../api/admin.api";
import Sidebar from "../../components/Sidebar";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchUsers = async () => {
  try {
    const data = await getUsers();
    const onlyUsers = data.filter(u => u.role === "user");
    setUsers(onlyUsers);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
  

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await deleteUser(id);
    fetchUsers();
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Manage Users
          </h1>

          <span className="text-sm text-gray-500">
            Total Users: {users.length}
          </span>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-4 text-left">User</th>
                  <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-center">Role</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center p-6">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      {/* USER */}
                      <td className="p-4 font-medium text-gray-800">
                        {u.name}
                      </td>

                      {/* EMAIL */}
                      <td className="p-4 text-gray-600">
                        {u.email}
                      </td>

                       {/* PHONE */}
                      <td className="p-4 text-gray-600">
                        {u.phone}
                      </td>

                      {/* ROLE */}
                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-600"
                              : u.role === "restaurant"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(u._id)}
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

export default ManageUsers;