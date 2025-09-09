import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./component/Nav";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./component/Dashboard.jsx";
import Department from "./department/Department.jsx";
import Employee from "./employee/Employee.jsx";
import { userDataContext } from "./context/UserContext";

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { userdata } = useContext(userDataContext);
  return userdata ? children : <Navigate to="/login" replace />;
}

// Public Route Wrapper (for login/signup)
function PublicRoute({ children }) {
  const { userdata } = useContext(userDataContext);
  return userdata ? <Navigate to="/" replace /> : children;
}

export default function App() {
  const location = useLocation();

  // Hide Navbar on login & signup
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="p-4 bg-gray-100 min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/department"
            element={
              <ProtectedRoute>
                <Department />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee"
            element={
              <ProtectedRoute>
                <Employee />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}
