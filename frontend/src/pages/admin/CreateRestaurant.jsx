import { useState } from "react";
import { createRestaurant } from "../../api/admin.api";
import Sidebar from "../../components/Sidebar";

export default function CreateRestaurant() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name.trim()) return "Name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Valid email required";

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) return "Phone must be 10 digits";

    if (!form.address.trim()) return "Address is required";

    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return alert(error);

    try {
      setLoading(true);

      await createRestaurant(form);

      alert("✅ Restaurant created successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
      });
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Error creating restaurant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">
          Create Restaurant 🍴
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg">

          <input
            value={form.name}
            placeholder="Restaurant Name"
            className="w-full mb-3 px-4 py-2 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            value={form.email}
            placeholder="Email"
            className="w-full mb-3 px-4 py-2 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            value={form.phone}
            placeholder="Phone Number"
            className="w-full mb-3 px-4 py-2 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />

          <textarea
            value={form.address}
            placeholder="Address"
            className="w-full mb-4 px-4 py-2 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />

          <input
            value={form.password}
            placeholder="Password"
            type="password"
            className="w-full mb-3 px-4 py-2 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            {loading ? "Sending..." : "Create Restaurant"}
          </button>

        </div>
      </div>
    </div>
  );
}