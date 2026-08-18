import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "../api/axiosConfig"; 
import PublicNavbar from "../components/PublicNavbar";

export default function HomePage() {
    const [stats, setStats] = useState({
    mealsServed: 0,
    activeVolunteers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/stats/public');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch homepage stats:", error);
        // In case of an error, we can keep the default stats
      }
    };
    fetchStats();
  }, []); // The empty array [] means this runs only once when the component loads

  return (
    <>
        <PublicNavbar /> 
        <div className="min-h-screen font-sans antialiased text-gray-800">
        {/* inline CSS for small animations (works without Tailwind config) */}
        <style>{`
            .fade-in { animation: fadeIn .8s ease forwards; opacity: 0; }
            .fade-in.delay-2 { animation-delay: .2s; }
            .fade-in.delay-4 { animation-delay: .4s; }
            .slide-up { animation: slideUp .6s cubic-bezier(.2,.9,.2,1) forwards; opacity: 0; }
            .pulse-slow { animation: pulse 2.6s infinite; }
            @keyframes fadeIn { to { opacity: 1; } }
            @keyframes slideUp { to { transform: translateY(0); opacity: 1; } from { transform: translateY(12px); opacity: 0; } }
            @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
        `}</style>

        {/* HERO */}
        <header className="relative overflow-hidden">
            {/* <img
            src="https://images.unsplash.com/photo-1598511729092-6a1dfe61f1ed?auto=format&fit=crop&w=1600&q=80"
            alt="Hero Food Donation"
            className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
            />  alternative will be choosen*/}

            <div className="relative z-10  text-black mx-auto px-6 py-24 text-center ">
                <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=60"
              alt="how-bg"
              className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
              />
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-green-900 fade-in slide-up">
                  Share Food, <span className="text-green-900">Save Lives</span>
              </h1>
              <p className="mt-6 text-lg md:text-2xl text-black fade-in delay-2">
                  Reduce food waste • Feed the hungry • Empower communities
              </p>

              <div className="mt-10 flex justify-center gap-4">
                  <a
                  href="#donate"
                  className="inline-block bg-green-100 text-green-700 font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition"
                  >
                  Donate Now
                  </a>
                  <a
                  href="#how"
                  className="inline-block bg-green-100 text-green-700 font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition"
                  >
                  Learn How
                  </a>
              </div>

              {/* small stats card */}
              <div className="mt-12 mx-auto max-w-3xl bg-green-700 backdrop-blur-sm rounded-full inline-flex items-center gap-8 px-8 py-3">
                  <div className="text-left">
                      <div className="text-sm text-green-50">Meals served</div>
                      {/* --- THIS IS THE FIX --- */}
                      <div className="text-2xl font-bold text-white">{stats.mealsServed.toLocaleString()}+</div>
                  </div>
                  <div className="h-10 w-px bg-white/30" />
                  <div className="text-left">
                      <div className="text-sm text-green-50">Active volunteers</div>
                      {/* --- THIS IS THE FIX --- */}
                      <div className="text-2xl font-bold text-white">{stats.activeVolunteers.toLocaleString()}</div>
                  </div>
              </div>
            </div>
        </header>

        {/* FEATURES */}
        <section id="features" className="relative py-10 bg-gradient-to-l from-green-700 via-green-400 via-green-100 via-green-300 to-green-700">
            <div className="relative z-10 max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Why Donate Food?</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                Small acts of sharing reduce waste and give comfort to those who need it most.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
                <Card
                img="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60"
                title="Reduce Food Waste"
                desc="Give surplus meals a second life — reduce landfill waste and help the planet."
                delay="0"
                />
                <Card
                img="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60"
                title="Feed the Hungry"
                desc="Trusted volunteers deliver safe, nutritious food to shelters and families."
                delay="100"
                />
                <Card
                img="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60"
                title="Support Communities"
                desc="Partner with local NGOs to build resilient, caring communities."
                delay="200"
                />
            </div>
            </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="relative py-20 bg-green-50">
            <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=60"
            alt="how-bg"
            className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
            />
            <div className="relative z-10 max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">How It Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <HowCard
                step="1"
                title="Donate Food"
                desc="Tell us when and where food is available. We accept home-cooked & packaged food."
                svg={DonateSVG}
                />
                <HowCard
                step="2"
                title="We Collect"
                desc="Volunteers pick up food safely and quickly using hygienic protocols."
                svg={CollectSVG}
                />
                <HowCard
                step="3"
                title="We Deliver"
                desc="Food reaches shelters, orphanages and community kitchens within hours."
                svg={DeliverSVG}
                />
            </div>
            </div>
        </section>

        {/* CTA */}
        <section id="donate" className="relative py-10">
            <img
            src="https://images.unsplash.com/photo-1528715471579-d531d36971e0?auto=format&fit=crop&w=1600&q=60"
            alt="cta-bg"
            className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
            />
            <div className="absolute inset-0 bg-green-900 pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 slide-up">Ready to Make a Difference?</h3>
            <p className="mb-8 text-lg text-green-50">
                Join our network — donate a meal, volunteer, or help with logistics.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                    {/* --- THIS IS THE FIX --- */}
                    <Link
                        className="inline-block bg-white text-green-700 font-semibold px-8 py-3 rounded-full shadow hover:scale-105 transition transform"
                        to="/signup" // <-- Changed from href="#"
                    >
                    Donate Food
                    </Link>
                    <Link
                        className="inline-block border border-white text-white px-6 py-3 rounded-full hover:bg-white/10 transition"
                        to="/signup" // <-- Changed from href="#"
                    >
                    Become a Volunteer
                    </Link>
                    {/* --- END OF FIX --- */}
                </div>

            <p className="mt-8 text-sm text-white/80">You can start by donating once — every little bit helps.</p>
            </div>
        </section>

              <footer className="bg-green-700 text-white py-5">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <p className="text-sm">© {new Date().getFullYear()} FoodLink • Built to reduce food waste & fight hunger</p>
                </div>
              </footer>
        
        </div>
    </>
  );
}

/* --- Small subcomponents --- */

function Card({ img, title, desc, delay = 0 }) {
  // delay used for subtle staggered slide-up via inline style
  const style = { animationDelay: `${delay}ms` };
  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:-translate-y-3 transition"
      style={style}
    >
      <div className="mx-auto w-32 h-32 rounded-full overflow-hidden shadow-sm">
        <img src={img} alt={title} className="w-full h-full object-cover" />
      </div>
      <h3 className="mt-5 text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-gray-600">{desc}</p>
      <button className="mt-6 inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition">
        Learn more
      </button>
    </div>
  );
}

function HowCard({ step, title, desc, svg: Svg }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:-translate-y-2 transition">
      <div className="mx-auto w-20 h-20 rounded-lg bg-green-50 flex items-center justify-center">
        <Svg />
      </div>
      <div className="mt-4 text-sm font-medium text-green-700">Step {step}</div>
      <h4 className="mt-2 text-xl font-semibold">{title}</h4>
      <p className="mt-2 text-gray-600">{desc}</p>
    </div>
  );
}

/* --- Simple SVG icons --- */
function DonateSVG() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 2v7" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10c0 3.314 2.686 6 6 6s6-2.686 6-6" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20h16" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CollectSVG() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 7h18" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 7v10a2 2 0 002 2h6a2 2 0 002-2V7" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12h4" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DeliverSVG() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 12h4l2 3h6l2-3h4" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19a1 1 0 100 2 1 1 0 000-2zm14 0a1 1 0 100 2 1 1 0 000-2z" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


// client/src/pages/HomePage.jsx

// import React, { useState, useEffect } from "react"; // <-- THIS LINE IS NOW CORRECT
// import { Link } from 'react-router-dom';
// import axios from "../api/axiosConfig";
// import PublicNavbar from "../components/PublicNavbar";

// export default function HomePage() {
//   const [stats, setStats] = useState({
//     mealsServed: 0,
//     activeVolunteers: 0,
//   });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const response = await axios.get('/stats/public');
//         setStats(response.data);
//       } catch (error) {
//         console.error("Failed to fetch homepage stats:", error);
//       }
//     };
//     fetchStats();
//   }, []);

//   return (
//     <>
//         <div className="min-h-screen font-sans antialiased text-gray-800">
//         {/* inline CSS for small animations (works without Tailwind config) */}
//         <style>{`
//             .fade-in { animation: fadeIn .8s ease forwards; opacity: 0; }
//             .fade-in.delay-2 { animation-delay: .2s; }
//             .fade-in.delay-4 { animation-delay: .4s; }
//             .slide-up { animation: slideUp .6s cubic-bezier(.2,.9,.2,1) forwards; opacity: 0; }
//             .pulse-slow { animation: pulse 2.6s infinite; }
//             @keyframes fadeIn { to { opacity: 1; } }
//             @keyframes slideUp { to { transform: translateY(0); opacity: 1; } from { transform: translateY(12px); opacity: 0; } }
//             @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
//         `}</style>

//         {/* HERO */}
//         <header className="relative overflow-hidden">
//             <img
//             src="https://images.unsplash.com/photo-1598511729092-6a1dfe61f1ed?auto=format&fit=crop&w=1600&q=80"
//             alt="Hero Food Donation"
//             className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
//             />

//             <div className="relative z-10  text-black mx-auto px-6 py-24 text-center ">
//                 <img
//             src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=60"
//             alt="how-bg"
//             className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
//             />
//             <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-green-900 fade-in slide-up">
//                 Share Food, <span className="text-green-900">Save Lives</span>
//             </h1>
//             <p className="mt-6 text-lg md:text-2xl text-black fade-in delay-2">
//                 Reduce food waste • Feed the hungry • Empower communities
//             </p>

//             <div className="mt-10 flex justify-center gap-4">
//                 <a
//                 href="#donate"
//                 className="inline-block bg-green-100 text-green-700 font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition"
//                 >
//                 Donate Now
//                 </a>
//                 <a
//                 href="#how"
//                 className="inline-block bg-green-100 text-green-700 font-semibold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition"
//                 >
//                 Learn How
//                 </a>
//             </div>

//             {/* small stats card */}
//             <div className="mt-12 mx-auto max-w-3xl bg-green-700 backdrop-blur-sm rounded-full inline-flex items-center gap-8 px-8 py-3">
//                 <div className="text-left">
//                 <div className="text-sm text-green-50">Meals served</div>
//                 <div className="text-2xl font-bold text-white">{stats.mealsServed.toLocaleString()}+</div>
//                 </div>
//                 <div className="h-10 w-px bg-white/30" />
//                 <div className="text-left">
//                 <div className="text-sm text-green-50">Active volunteers</div>
//                 <div className="text-2xl font-bold text-white">{stats.activeVolunteers.toLocaleString()}</div>
//                 </div>
//             </div>
//             </div>
//         </header>

//         {/* FEATURES */}
//         <section id="features" className="relative py-10 bg-gradient-to-l from-green-700 via-green-400 via-green-100 via-green-300 to-green-700">
//             <div className="relative z-10 max-w-6xl mx-auto px-6">
//             <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Why Donate Food?</h2>
//             <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
//                 Small acts of sharing reduce waste and give comfort to those who need it most.
//             </p>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
//                 <Card
//                 img="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60"
//                 title="Reduce Food Waste"
//                 desc="Give surplus meals a second life — reduce landfill waste and help the planet."
//                 delay="0"
//                 />
//                 <Card
//                 img="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60"
//                 title="Feed the Hungry"
//                 desc="Trusted volunteers deliver safe, nutritious food to shelters and families."
//                 delay="100"
//                 />
//                 <Card
//                 img="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60"
//                 title="Support Communities"
//                 desc="Partner with local NGOs to build resilient, caring communities."
//                 delay="200"
//                 />
//             </div>
//             </div>
//         </section>

//         {/* HOW IT WORKS */}
//         <section id="how" className="relative py-20 bg-green-50">
//             <img
//             src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=60"
//             alt="how-bg"
//             className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
//             />
//             <div className="relative z-10 max-w-6xl mx-auto px-6">
//             <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">How It Works</h2>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 <HowCard
//                 step="1"
//                 title="Donate Food"
//                 desc="Tell us when and where food is available. We accept home-cooked & packaged food."
//                 svg={DonateSVG}
//                 />
//                 <HowCard
//                 step="2"
//                 title="We Collect"
//                 desc="Volunteers pick up food safely and quickly using hygienic protocols."
//                 svg={CollectSVG}
//                 />
//                 <HowCard
//                 step="3"
//                 title="We Deliver"
//                 desc="Food reaches shelters, orphanages and community kitchens within hours."
//                 svg={DeliverSVG}
//                 />
//             </div>
//             </div>
//         </section>

//         {/* CTA */}
//         <section id="donate" className="relative py-10">
//             <img
//             src="https://images.unsplash.com/photo-1528715471579-d531d36971e0?auto=format&fit=crop&w=1600&q=60"
//             alt="cta-bg"
//             className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
//             />
//             <div className="absolute inset-0 bg-green-900 pointer-events-none"></div>

//             <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
//             <h3 className="text-3xl md:text-4xl font-bold mb-4 slide-up">Ready to Make a Difference?</h3>
//             <p className="mb-8 text-lg text-green-50">
//                 Join our network — donate a meal, volunteer, or help with logistics.
//             </p>

//             <div className="flex flex-col sm:flex-row justify-center gap-4">
//                 <Link
//                 className="inline-block bg-white text-green-700 font-semibold px-8 py-3 rounded-full shadow hover:scale-105 transition transform"
//                 to="/signup"
//                 >
//                 Donate Food
//                 </Link>
//                 <Link
//                 className="inline-block border border-white text-white px-6 py-3 rounded-full hover:bg-white/10 transition"
//                 to="/signup"
//                 >
//                 Become Volunteer
//                 </Link>
//             </div>

//             <p className="mt-8 text-sm text-white/80">You can start by donating once — every little bit helps.</p>
//             </div>
//         </section>
//         </div>
//     );
//     }

//     // ... (Card, HowCard, and SVG subcomponents remain unchanged) ...

//     function Card({ img, title, desc, delay = 0 }) {
//     // delay used for subtle staggered slide-up via inline style
//     const style = { animationDelay: `${delay}ms` };
//     return (
//         <div
//         className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:-translate-y-3 transition"
//         style={style}
//         >
//         <div className="mx-auto w-32 h-32 rounded-full overflow-hidden shadow-sm">
//             <img src={img} alt={title} className="w-full h-full object-cover" />
//         </div>
//         <h3 className="mt-5 text-xl font-semibold">{title}</h3>
//         <p className="mt-3 text-gray-600">{desc}</p>
//         <button className="mt-6 inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition">
//             Learn more
//         </button>
//         </div>
//     );
//     }

//     function HowCard({ step, title, desc, svg: Svg }) {
//     return (
//         <div className="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:-translate-y-2 transition">
//         <div className="mx-auto w-20 h-20 rounded-lg bg-green-50 flex items-center justify-center">
//             <Svg />
//         </div>
//         <div className="mt-4 text-sm font-medium text-green-700">Step {step}</div>
//         <h4 className="mt-2 text-xl font-semibold">{title}</h4>
//         <p className="mt-2 text-gray-600">{desc}</p>
//         </div>
//     );
//     }

//     /* --- Simple SVG icons --- */
//     function DonateSVG() {
//     return (
//         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
//         <path d="M12 2v7" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M6 10c0 3.314 2.686 6 6 6s6-2.686 6-6" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M4 20h16" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//     );
//     }
//     function CollectSVG() {
//     return (
//         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
//         <path d="M3 7h18" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M7 7v10a2 2 0 002 2h6a2 2 0 002-2V7" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M10 12h4" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//     );
//     }
//     function DeliverSVG() {
//     return (
//         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden>
//         <path d="M3 12h4l2 3h6l2-3h4" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//         <path d="M5 19a1 1 0 100 2 1 1 0 000-2zm14 0a1 1 0 100 2 1 1 0 000-2z" stroke="#047857" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
//         </svg>
//     </>
//   );
// }