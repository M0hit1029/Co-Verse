'use client';

import { useEffect, useState } from 'react';

export default function Bg() {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    const generatedDots = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${5 + Math.random() * 10}s`,
      delay: `${Math.random() * 5}s`,
    }));

    setDots(generatedDots);
  }, []);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dots.map((dot, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#2EE59D] rounded-full opacity-20"
            style={{
              left: dot.left,
              top: dot.top,
              animation: `float ${dot.duration} ease-in-out infinite`,
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div>

      {/* Animated CSS */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(46, 229, 157, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(46, 229, 157, 0.6);
          }
        }

        @keyframes fade-in-up {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
      `}</style>
    </>
  );
}
