// src/components/Hero.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import WAVES from "vanta/dist/vanta.waves.min";

export default function Hero() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (!vantaEffect.current) {
      vantaEffect.current = WAVES({
        el: vantaRef.current,
        THREE,
        color: 0x34d399,
        shininess: 50,
        waveHeight: 20,
        waveSpeed: 1,
      });
    }
    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  return (
    <section
      ref={vantaRef}
      className="relative min-h-screen bg-gradient-to-l from-green-100 via-green-400 to-green-500"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg">
          Share Food, Save Lives
        </h1>
      </div>
    </section>
  );
}
