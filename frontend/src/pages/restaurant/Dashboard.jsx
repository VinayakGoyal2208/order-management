import Sidebar from "../../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-6 bg-gray-800 min-h-screen text-white">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
    </div>
  );
}