import "./App.css";

import { Route, Routes } from "react-router-dom";

import BrandLoader from "./components/ui/BrandLoader.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import useAuth from "./hooks/useAuth.js";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Matches from "./pages/Matches.jsx";
import Predictions from "./pages/Predictions.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Community from "./pages/Community.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return <BrandLoader />;
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/app" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
