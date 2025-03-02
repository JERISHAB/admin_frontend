import { Navigate } from "react-router-dom";
import Layout from "./Layout";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
  };

  return isAuthenticated() ? <Layout>{element}</Layout> : <Navigate to="/" />;
};

export default ProtectedRoute;