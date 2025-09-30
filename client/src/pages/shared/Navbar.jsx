import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router";
import Logo from "./Logo";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

// ✅ Logout function
const handleSignOut = (logOut) => {
  logOut()
    .then(() => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Signout successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    })
    .catch((err) => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.message,
      });
    });
};

// ✅ Menu Items Component
const MenuItems = ({ user, onLogout, isMobile }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <a
        href="https://github.com/your-username"
        target="_blank"
        rel="noopener noreferrer"
        className={`${
          isMobile ? "block" : ""
        } text-gray-700 hover:text-brand font-medium`}
      >
        Join as Developer
      </a>

      {user ? (
        <div className="relative">
          {/* Profile photo */}
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="h-10 w-10 flex justify-center items-center rounded-full border-2 border-gray-300 transition hover:ring-2 hover:ring-brand"
          >
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={user.photoURL}
              alt="Profile"
            />
          </button>

          {/* Dropdown menu */}
          {profileOpen && (
            <div
              className={`absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden ${
                isMobile ? "w-full left-0 right-0" : ""
              }`}
            >
              <NavLink
                to="/dashboard"
                className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-dark transition font-medium"
                onClick={() => setProfileOpen(false)}
              >
                Dashboard
              </NavLink>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-red-400 hover:to-red-600 transition font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <NavLink
            to="/login"
            className="px-4 py-2 rounded-xl bg-brand text-white block text-center shadow-md hover:bg-brand-dark transition font-medium"
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="px-4 py-2 rounded-xl bg-accant text-white block text-center shadow-md hover:bg-accant-dark transition font-medium"
          >
            Registration
          </NavLink>
        </>
      )}
    </>
  );
};

export default function Navbar() {
  const { user, logOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-light shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <MenuItems user={user} onLogout={() => handleSignOut(logOut)} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setOpen(!open)}>
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden bg-light shadow-md px-4 pb-4 space-y-3">
          <MenuItems
            user={user}
            onLogout={() => handleSignOut(logOut)}
            isMobile
          />
        </div>
      )}
    </nav>
  );
}
