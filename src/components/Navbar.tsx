import React from "react";
import { useLocation, Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  // Function to determine the page title based on current path
  const getPageTitle = () => {
    switch (path) {
      case "/":
        return "Home";
      case "/enter-idea":
        return "Enter Idea";
      case "/validate":
        return "Validate Ideas";
      case "/dashboard":
        return "Dashboard";
      default:
        return "";
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">Idea Spark</div>
        <div className="text-lg">
          {getPageTitle()}
        </div>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/enter-idea" className="hover:underline">
            Enter Idea
          </Link>
          <Link to="/validate" className="hover:underline">
            Validate
          </Link>
          <Link to="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
