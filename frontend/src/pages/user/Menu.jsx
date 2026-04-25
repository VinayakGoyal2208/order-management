import { useParams } from "react-router-dom";
import { useCart } from "../../hooks/useCart";

/* ---------- STATIC DATA ---------- */

const restaurantData = {
  "1": {
    name: "Spice Hub Kitchen",
    location: "Bangalore",
    status: "Open",
  },
};

const menuData = {
  "1": [
    {
      category: "Starters",
      items: [
        {
          _id: "1",
          name: "Paneer Tikka",
          price: 250,
          image:
            "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398",
        },
        {
          _id: "2",
          name: "Spring Rolls",
          price: 180,
          image:
            "https://images.unsplash.com/photo-1604908554027-1b1d4f0d9b62",
        },
      ],
    },
    {
      category: "Main Course",
      items: [
        {
          _id: "3",
          name: "Butter Chicken",
          price: 320,
          image:
            "https://images.unsplash.com/photo-1603893662172-99ed0cea2a08",
        },
      ],
    },
  ],
};

/* -------------------------------- */

function Menu() {
  const { id } = useParams();
  const { cart, addToCart, updateQty, removeFromCart } = useCart();

  const restaurant = restaurantData[id];
  const menu = menuData[id] || [];

  const getQty = (itemId) => {
    const item = cart.find((i) => i._id === itemId);
    return item ? item.qty : 0;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">

      {/* LEFT SIDE */}
      <div className="flex-1 p-6">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{restaurant?.name}</h1>
          <p className="text-gray-500">{restaurant?.location}</p>
          <span className="text-green-600 text-sm">
            {restaurant?.status}
          </span>
        </div>

        {/* MENU */}
        {menu.map((section, i) => (
          <div key={i} className="mb-10">

            <h2 className="text-xl font-semibold mb-4">
              {section.category}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {section.items.map((item) => {
                const qty = getQty(item._id);

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                  >
                    {/* IMAGE */}
                    <img
                      src={item.image}
                      className="w-full h-40 object-cover"
                      alt={item.name}
                    />

                    {/* CONTENT */}
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          ₹ {item.price}
                        </p>
                      </div>

                      {/* ACTION */}
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(item)}
                          className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              qty === 1
                                ? removeFromCart(item._id)
                                : updateQty(item._id, "dec")
                            }
                            className="px-2 bg-gray-200 rounded"
                          >
                            -
                          </button>

                          <span>{qty}</span>

                          <button
                            onClick={() =>
                              updateQty(item._id, "inc")
                            }
                            className="px-2 bg-gray-200 rounded"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE (CART) */}
      <div className="w-full lg:w-80 bg-white p-6 shadow-lg border-l">

        <h2 className="text-xl font-semibold mb-4">
          Your Order 🛒
        </h2>

        {cart.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No items added yet
          </p>
        ) : (
          <>
            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center text-sm"
                >
                  <div>
                    <p>{item.name}</p>
                    <p className="text-gray-500 text-xs">
                      ₹ {item.price} × {item.qty}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        item.qty === 1
                          ? removeFromCart(item._id)
                          : updateQty(item._id, "dec")
                      }
                      className="px-2 bg-gray-200 rounded"
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        updateQty(item._id, "inc")
                      }
                      className="px-2 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <hr className="mb-4" />

            <div className="flex justify-between font-semibold mb-4">
              <span>Total</span>
              <span>
                ₹{" "}
                {cart.reduce(
                  (acc, item) => acc + item.price * item.qty,
                  0
                )}
              </span>
            </div>

            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Proceed to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Menu;