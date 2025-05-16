import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Dashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/user/UserDashboard";
import NotFound from "./pages/NotFound";
import '@mantine/core/styles.css';


const App = () => {
  const isAdmin = true;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout isAdmin={isAdmin} />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
