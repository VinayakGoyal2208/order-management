import { useState } from "react";
import { loginUser, signupUser } from "../../api/auth.api";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent refresh

    setLoading(true);

    try {
      let res;

      if (isLogin) {
        res = await loginUser({
          email: form.email,
          password: form.password,
        });
      } else {
        res = await signupUser(form);
      }

      // store user + token
      login(res.data);

      const role = res.data.user.role;

      // redirect based on role
      if (role === "admin") navigate("/admin");
      else if (role === "restaurant") navigate("/restaurant");
      else navigate("/");
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);
  if (err.response?.data?.errors) {
    const messages = err.response.data.errors.map(e => {
      if (e.path === "email") return "Enter a valid email";
      if (e.path === "password") return "Password must be at least 6 characters";
      if (e.path === "name") return "Name is required";
      if (e.path === "phone") return "Enter a valid phone number";
      return e.msg;
    });

    alert(messages.join(", "));
  } else {
    alert(err.response?.data?.msg || "Something went wrong");
  }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl w-[900px] flex overflow-hidden">

        {/* LEFT SIDE */}
        <div className="w-1/2 bg-green-600 text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-4">
            B2B Food Ordering Made Simple 🍽️
          </h1>
          <p className="text-sm opacity-90">
            Order food in bulk from your favorite restaurants,
            simplified for your business.
          </p>

          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            className="mt-6 rounded-xl"
            alt="food"
          />
        </div>

        {/* RIGHT SIDE */}
        <form onSubmit={handleSubmit} className="w-1/2 p-10">

          {/* TOGGLE */}
          <div className="flex mb-6 border-b">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-2 ${
                isLogin
                  ? "border-b-2 border-green-600 text-green-600 font-semibold"
                  : "text-gray-400"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-2 ${
                !isLogin
                  ? "border-b-2 border-green-600 text-green-600 font-semibold"
                  : "text-gray-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* NAME (Signup only) */}
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              required
              className="w-full mb-3 px-4 py-2 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full mb-3 px-4 py-2 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          {/*PHONE (Signup only) */}
          {!isLogin && (
            <input
              type="text"
              placeholder="Phone"
              required
              className="w-full mb-3 px-4 py-2 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          )}


          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full mb-3 px-4 py-2 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />


          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>

          {/* SWITCH TEXT */}
          <p className="text-center mt-4 text-sm">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <span
                  className="text-green-600 cursor-pointer"
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="text-green-600 cursor-pointer"
                  onClick={() => setIsLogin(true)}
                >
                  Sign In
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;