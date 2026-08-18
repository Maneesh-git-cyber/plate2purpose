import React from "react";
import { Link } from "react-router-dom";


export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-white/60 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">F</div>
          <div>
            <div className="text-lg font-bold text-green-700">Plate2Purpose</div>
            <div className="text-xs text-gray-500 -mt-1">End Hunger • Share Meals</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <Link
                to="/"
                className="hidden md:inline text-sm hover:text-green-700"
                >
                How it works
</Link>
          <Link
                to="/sponsors"
                className="hidden md:inline text-sm hover:text-green-700"
                >
                Sponsors
</Link>

          <button
            onClick={() => (window.location.href = "/login")}
            className="px-3 py-1.5 text-sm rounded-md bg-white border border-green-600 text-green-700 hover:bg-green-50 transition"
          >
            Login
          </button>

          <button
            onClick={() => (window.location.href = "/signup")}
            className="px-4 py-1.5 text-sm rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}
