import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Dashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/user/UserDashboard";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import "@mantine/core/styles.css";
import Slots from "./pages/admin/Slots";
import Payments from "./pages/admin/Payments";
import Vehicles from "./pages/user/Vehicles";

const App = () => {
  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={isLoggedIn ? <Layout /> : <Navigate to={"/"} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/slots" element={<Slots />} />
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/vehicles" element={<Vehicles />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
