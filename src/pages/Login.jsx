import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { loginUser, setLogin } from "../features/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import instance from "../api/axios";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLogin, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLogin) navigate("/");
  }, [isLogin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    const result = await dispatch(loginUser({ email, password }));

    if (result.meta.requestStatus === "fulfilled") {
      Swal.fire({
        icon: "success",
        title: "Login Success",
        showConfirmButton: false,
        timer: 1200,
      });
      navigate("/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: result.payload,
      });
    }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      const { data } = await instance.post("/auth/google-login", {
        googleToken: credentialResponse.credential,
      });

      localStorage.setItem("access_token", data.access_token);

      dispatch(setLogin());

      Swal.fire({
        icon: "success",
        title: "Google Login Success",
        showConfirmButton: false,
        timer: 1200,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.response?.data?.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 shadow-[0_0_25px_rgba(0,0,0,0.8)] w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-cyan-400 tracking-widest">
          TRAINER LOGIN
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="p-2 rounded bg-[#121212] border border-gray-700 focus:border-cyan-400 outline-none text-gray-200"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="p-2 rounded bg-[#121212] border border-gray-700 focus:border-cyan-400 outline-none text-gray-200"
          />

          <button
            disabled={loading}
            className="bg-[#22caff] text-black font-bold py-2 rounded hover:scale-105 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "LOADING..." : "LOGIN"}
          </button>
        </form>

        <div className="mt-5 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogle}
            useOneTap
          />
        </div>

        <p className="text-center text-sm mt-6 text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
