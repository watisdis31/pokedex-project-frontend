import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { isLogin } = useSelector((state) => state.auth);

  if (isLogin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
