
import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const particles = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  left: `${(index * 37 + 11) % 100}%`,
  size: index % 5 === 0 ? 16 : index % 3 === 0 ? 11 : 7,
  duration: 7 + (index % 7) * 1.5,
  delay: (index % 9) * 0.7,
  drift: (index % 2 === 0 ? 1 : -1) * (15 + (index % 5) * 9),
  symbol:
    index % 9 === 0
      ? "♡"
      : index % 4 === 0
        ? "✦"
        : index % 3 === 0
          ? "✧"
          : "•",
}));

function FloatingParticles() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="wedding-particles" aria-hidden="true">
      <style>{`
        .wedding-particles {
          position: fixed;
          inset: 0;
          z-index: 50;
          overflow: hidden;
          pointer-events: none;
          user-select: none;
        }

        .wedding-particle {
          position: absolute;
          bottom: -35px;
          display: block;
          color: #bd995f;
          line-height: 1;
          text-shadow:
            0 0 5px rgba(220, 188, 131, .7),
            0 0 14px rgba(221, 185, 119, .35);
          will-change: transform, opacity;
        }

        .wedding-particle-heart {
          color: #c5a16b;
          text-shadow:
            0 0 8px rgba(218, 179, 112, .65),
            0 0 18px rgba(218, 179, 112, .3);
        }

        .wedding-particle-glow {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fff8e9;
          box-shadow:
            0 0 6px 2px rgba(225, 190, 126, .75),
            0 0 15px 5px rgba(225, 190, 126, .3);
        }

        @media (max-width: 600px) {
          .wedding-particle:nth-child(3n) {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wedding-particle {
            animation: none;
          }
        }
      `}</style>

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={`wedding-particle ${
            particle.symbol === "♡" ? "wedding-particle-heart" : ""
          }`}
          style={{
            left: particle.left,
            fontSize: particle.size,
          }}
          initial={{
            y: 0,
            x: 0,
            opacity: 0,
            scale: 0.5,
            rotate: 0,
          }}
          animate={
            reduceMotion
              ? {
                  opacity: [0.15, 0.45, 0.15],
                }
              : {
                  y: [0, -window.innerHeight * 1.15],
                  x: [0, particle.drift, -particle.drift * 0.4],
                  opacity: [0, 0.8, 0.65, 0],
                  scale: [0.5, 1.15, 0.8],
                  rotate: [0, 90, 180],
                }
          }
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.5,
          }}
        >
          {particle.symbol}
        </motion.span>
      ))}

      {/* Tiny glowing lights */}
      {Array.from({ length: 12 }).map((_, index) => (
        <motion.span
          key={`glow-${index}`}
          className="wedding-particle-glow"
          style={{
            left: `${(index * 43 + 7) % 100}%`,
            top: `${(index * 29 + 13) % 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.85, 0.1],
            scale: [0.6, 1.4, 0.6],
          }}
          transition={{
            duration: 2.5 + (index % 4),
            delay: index * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default memo(FloatingParticles);
