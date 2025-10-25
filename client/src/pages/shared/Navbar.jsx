// Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router"; // <-- use react-router-dom
import Swal from "sweetalert2";
import Logo from "./Logo";
import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Desktop profile dropdown state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();

  // Close desktop profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Unified sign out handler (closes menus)
  const handleSignOut = async () => {
    try {
      await logOut();
      setMobileOpen(false);
      setProfileOpen(false);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Signed out successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err?.message || "Failed to sign out",
      });
    }
  };

  // Utility: close mobile when navigating (link click)
  const handleMobileNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-sky-50 to-blue-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Logo />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="https://github.com/shamsuttabriz"
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 hover:text-blue-900 font-medium transition"
            >
              Join as Developer
            </a>

            {/* If not logged in show buttons */}
            {!user && (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-blue-400 text-white text-sm font-medium hover:bg-blue-500 transition"
                >
                  Register
                </NavLink>
              </div>
            )}

            {/* If logged in show profile avatar with dropdown (desktop only) */}
            {user && (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen((s) => !s)}
                  aria-expanded={profileOpen}
                  className="h-10 w-10 p-2 rounded-full border-2 border-blue-200 flex items-center justify-center hover:ring-2 hover:ring-blue-300 transition"
                >
                  <img
                    src={
                      user.photoURL ||
                      "https://i.ibb.co/4JQW8DG/default-user.png"
                    }
                    alt={user.displayName || "Profile"}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                    <NavLink
                      to="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition"
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle menu"
              className="text-blue-700"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (slide down). IMPORTANT: No profile avatar here — dashboard & logout appear directly */}
      <div
        className={`md:hidden bg-white shadow-md transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 px-4 py-4">
          <a
            href="https://github.com/shamsuttabriz"
            target="_blank"
            rel="noreferrer"
            onClick={handleMobileNavClick}
            className="block text-blue-700 hover:bg-blue-50 rounded-lg py-3 px-3 font-medium transition"
          >
            Join as Developer
          </a>

          {/* If user not logged in -> show login/register */}
          {!user && (
            <>
              <NavLink
                to="/login"
                onClick={handleMobileNavClick}
                className="block px-4 py-3 rounded-lg bg-blue-600 text-white text-center font-medium hover:bg-blue-700 transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={handleMobileNavClick}
                className="block px-4 py-3 rounded-lg bg-blue-400 text-white text-center font-medium hover:bg-blue-500 transition"
              >
                Register
              </NavLink>
            </>
          )}

          {/* If user logged in -> directly show Dashboard & Logout (no avatar) */}
          {user && (
            <>
              <NavLink
                to="/dashboard"
                onClick={handleMobileNavClick}
                className="block px-4 py-2 rounded-lg text-blue-800 bg-blue-50 hover:bg-blue-100 font-medium text-center transition"
              >
                Dashboard
              </NavLink>

              <button
                onClick={() => {
                  handleSignOut();
                  // mobile menu closed inside handleSignOut
                }}
                className="block w-full px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 font-medium transition text-center"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
