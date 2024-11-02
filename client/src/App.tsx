import React, { useState } from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import DummyComponent from "./components/DummyComponent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginForm from "./components/LoginForm";
import { AuthProvider, useAuth } from "./utils/AuthContext";
import RegisterForm from "./components/RegisterForm";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Guest Route Component (for non-authenticated users)
const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/" replace />;
};

const Home = () => {
  const { user, logout } = useAuth();
  return (
    <div className="container p-6">
      <h1>Home Page</h1>
      <p>User: {user}</p>
      <button onClick={logout} className="btn btn-primary">
        Logout
      </button>
    </div>
  );
};
const About = () => (
  <div className="container p-6">
    <h1>About Page</h1>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route
            element={
              <GuestRoute>
                <Outlet />
              </GuestRoute>
            }
          >
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dummy" element={<DummyComponent />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
