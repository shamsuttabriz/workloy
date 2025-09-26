import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router"; // ✅ Correct import
import Logo from "./Logo";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

// ✅ Reusable navlink style
const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-xl bg-brand block text-center text-white shadow-md transition font-medium ${
    isActive
      ? "bg-brand text-white shadow-md"
      : "text-gray-700 hover:bg-brand-dark"
  }`;

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

// ✅ Menu Items Component for Desktop & Mobile
const MenuItems = ({ user, onLogout, isMobile }) => (
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
      <>
        {/* Profile photo */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `h-10 w-10 flex justify-center items-center rounded-full border-2 transition ${
              isActive ? "border-brand ring-2 ring-brand/50" : "border-brand"
            }`
          }
        >
          <img
            className="h-8 w-8 rounded-full object-cover"
            src={user.photoURL}
            alt="Profile"
          />
        </NavLink>

        <NavLink to="/dashboard" className={navLinkClass}>
          Dashboard
        </NavLink>

        <button
          onClick={onLogout}
          className={`${
            isMobile ? "w-full px-4 py-2" : "btn"
          } rounded-xl bg-accant text-white hover:bg-accant-dark transition`}
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <NavLink to="/login" className={navLinkClass}>
          Login
        </NavLink>
        <NavLink to="/register" className={navLinkClass}>
          Registration
        </NavLink>
      </>
    )}
  </>
);

export default function Navbar() {
  const { coins, user, logOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <MenuItems
              user={user}
              coins={coins}
              onLogout={() => handleSignOut(logOut)}
            />
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
        <div className="md:hidden bg-white shadow-md px-4 pb-4 space-y-3">
          <MenuItems
            user={user}
            coins={coins}
            onLogout={() => handleSignOut(logOut)}
            isMobile
          />
        </div>
      )}
    </nav>
  );
}
