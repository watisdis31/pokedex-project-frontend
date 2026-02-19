import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice";

export default function BaseLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (error) {
        console.log(error);
      }
    }
  }, [token]);

  function handleLogout() {
    Swal.fire({
      title: "Logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        navigate("/login");
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="bg-[#111111] border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-bold text-cyan-400 cursor-pointer"
          >
            Pokédex Database
          </h1>

          <button
            onClick={() => navigate("/")}
            className="hover:text-cyan-400 transition cursor-pointer"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="hover:text-green-400 transition cursor-pointer"
          >
            Profile
          </button>
        </div>

        {token && (
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <Outlet />
    </div>
  );
}
