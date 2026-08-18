// // client/src/components/PublicNavbar.jsx

// import React from 'react';
// import { Link } from 'react-router-dom';

// const PublicNavbar = () => {
//   return (
//     <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link to="/" className="text-2xl font-bold text-green-800">
//               Plate2Purpose
//             </Link>
//           </div>

//           {/* Primary Nav */}
//           <div className="hidden md:flex items-center space-x-8">
//             <a href="#features" className="text-gray-600 hover:text-green-700">Features</a>
//             <a href="#how" className="text-gray-600 hover:text-green-700">How It Works</a>
//           </div>

//           {/* Secondary Nav (Login/Signup) */}
//           <div className="flex items-center space-x-4">
//             <Link to="/login" className="text-gray-600 hover:text-green-700">
//               Login
//             </Link>
//             <Link
//               to="/signup"
//               className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-green-700 transition"
//             >
//               Sign Up
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };



// import React from "react";
// import { Link } from "react-router-dom";


// const PublicNavbar = () => {
//   return (
//     <nav className="fixed w-full z-50 top-0 left-0 bg-white/60 backdrop-blur-md shadow-sm">
//       <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">F</div>
//           <div>
//             <div className="text-lg font-bold text-green-700">Plate2Purpose</div>
//             <div className="text-xs text-gray-500 -mt-1">End Hunger • Share Meals</div>
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//            <Link
//                 to="/"
//                 className="hidden md:inline text-sm hover:text-green-700"
//                 >
//                 How it works
// </Link>
//           <Link
//                 to="/sponsors"
//                 className="hidden md:inline text-sm hover:text-green-700"
//                 >
//                 Sponsors
// </Link>

//           <button
//             onClick={() => (window.location.href = "/login")}
//             className="px-3 py-1.5 text-sm rounded-md bg-white border border-green-600 text-green-700 hover:bg-green-50 transition"
//           >
//             Login
//           </button>

//           <button
//             onClick={() => (window.location.href = "/signup")}
//             className="px-4 py-1.5 text-sm rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
//           >
//             Sign Up
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// }
// export default PublicNavbar;


// client/src/components/PublicNavbar.jsx

import React from "react";
import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-white/60 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Plate2Purpose Logo" className="w-10 h-10" />
          <div>
            <div className="text-lg font-bold text-green-700">Plate2Purpose</div>
            <div className="text-xs text-gray-500 -mt-1">End Hunger • Share Meals</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <a
                href="#how" // Use href="#..." for same-page scrolling links
                className="hidden md:inline text-sm hover:text-green-700"
                >
                How it works
            </a>
          {/* <Link
                to="/sponsors" // Use Link for navigating to other pages
                className="hidden md:inline text-sm hover:text-green-700"
                >
                Sponsors
            </Link> */}
          <button
            title="Coming Soon!" // This adds a hover tooltip
            className="hidden md:inline text-sm text-gray-400 cursor-not-allowed"
          >
            Sponsors
          </button>

          {/* --- THIS IS THE FIX --- */}
          {/* Changed from <button> to <Link> to prevent page reload */}
          <Link
            to="/login"
            className="px-3 py-1.5 text-sm rounded-md bg-white border border-green-600 text-green-700 hover:bg-green-50 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-4 py-1.5 text-sm rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Sign Up
          </Link>
          {/* --- END OF FIX --- */}
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;