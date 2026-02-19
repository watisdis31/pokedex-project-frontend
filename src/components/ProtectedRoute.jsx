import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const isLogin = useSelector((state) => state.auth.isLogin)

  if (!isLogin) {
    return <Navigate to="/login" replace />
  }

  return children
}
