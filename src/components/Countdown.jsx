
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { weddingData } from "../data/weddingData";

const initialTime = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const countdownItems = [
  { key: "days", label: "DAYS" },
  { key: "hours", label: "HOURS" },
  { key: "minutes", label: "MINUTES" },
  { key: "seconds", label: "SECONDS" },
];

function getWeddingTimestamp() {
  const { wedding } = weddingData;

  if (wedding.dateTime) {
    return new Date(wedding.dateTime).getTime();
  }

  if (wedding.date && wedding.time) {
    return new Date(`${wedding.date}T${wedding.time}:00`).getTime();
  }

  return new Date(
    Number(wedding.year),
    new Date(`${wedding.month} 1, ${wedding.year}`).getMonth(),
    Number(wedding.dayNumber),
    10,
    30,
    0
  ).getTime();
}

function calculateTime(targetDate) {
  const difference = Math.max(0, targetDate - Date.now());

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

const burstParticles = [
  { x: -45, y: -55 },
  { x: 0, y: -75 },
  { x: 45, y: -55 },
  { x: 65, y: 0 },
  { x: 45, y: 55 },
  { x: 0, y: 75 },
  { x: -45, y: 55 },
  { x: -65, y: 0 },
  { x: -25, y: -30 },
  { x: 25, y: -30 },
  { x: 25, y: 30 },
  { x: -25, y: 30 },
];

function SparkleBurst({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="countdown-burst"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
        >
          {burstParticles.map((particle, index) => (
            <motion.span
              key={index}
              className="countdown-burst-particle"
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: particle.x,
                y: particle.y,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0.2],
                rotate: 160,
              }}
              transition={{
                duration: 0.95,
                ease: "easeOut",
                delay: index * 0.015,
              }}
            >
              {index % 2 === 0 ? "✦" : "✧"}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CountdownTile({ item, value, revealed, onReveal }) {
  const [burst, setBurst] = useState(false);

  const handleReveal = () => {
    if (revealed) return;

    onReveal(item.key);
    setBurst(true);

    window.setTimeout(() => {
      setBurst(false);
    }, 1200);
  };

  return (
    <motion.button
      type="button"
      className={`countdown-tile ${revealed ? "is-revealed" : ""}`}
      onClick={handleReveal}
      aria-label={
        revealed
          ? `${item.label}: ${value}`
          : `Tap to reveal ${item.label}`
      }
      whileTap={{ scale: 0.94 }}
    >
      <SparkleBurst active={burst} />

      <div className="countdown-tile-inner">
        <AnimatePresence mode="wait">
          {revealed ? (
            <motion.div
              key="revealed"
              className="countdown-value"
              initial={{
                opacity: 0,
                rotateX: -90,
                y: 15,
                scale: 0.65,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                rotateX: 0,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {String(value).padStart(2, "0")}
            </motion.div>
          ) : (
            <motion.div
              key="hidden"
              className="countdown-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 1.5,
                filter: "blur(8px)",
              }}
              transition={{ duration: 0.35 }}
            >
              <motion.span
                className="countdown-hidden-icon"
                animate={{
                  rotate: [0, 12, -12, 0],
                  scale: [1, 1.12, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ✧
              </motion.span>

              <span className="countdown-tap-text">TAP</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="countdown-tile-label">
        {item.label}
      </div>

      <motion.div
        className="countdown-tile-shine"
        animate={{ x: ["-150%", "180%"] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}

export default function Countdown() {
  const weddingTimestamp = useMemo(() => getWeddingTimestamp(), []);

  const [time, setTime] = useState(() =>
    calculateTime(weddingTimestamp)
  );

  const [revealed, setRevealed] = useState([]);

  const revealAll = revealed.length === countdownItems.length;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(calculateTime(weddingTimestamp));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [weddingTimestamp]);

  const handleReveal = (key) => {
    setRevealed((previous) =>
      previous.includes(key) ? previous : [...previous, key]
    );
  };

  const handleRevealAll = () => {
    setRevealed(countdownItems.map((item) => item.key));
  };

  return (
    <section className="countdown-section" id="countdown">
      <style>{`
        .countdown-section {
          width: 100%;
          min-height: 100svh;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background: #f5e9dc;
          isolation: isolate;
        }

        .countdown-section *,
        .countdown-section *::before,
        .countdown-section *::after {
          box-sizing: border-box;
        }

        .countdown-card {
          position: relative;
          width: min(100%, 56.3svh);
          height: 100svh;
          min-height: 620px;
          overflow: hidden;
          background: #f8eee4;
          isolation: isolate;
        }

        .countdown-template {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          z-index: -2;
          pointer-events: none;
        }

        /* Heading */

        .countdown-heading {
          position: absolute;
          top: 17%;
          left: 5%;
          width: 90%;
          text-align: center;
          z-index: 3;
        }

        .countdown-eyebrow {
          margin: 0 0 9px;
          color: #a47e45;
          font-family: Georgia, serif;
          font-size: clamp(9px, 2.2vw, 12px);
          letter-spacing: .27em;
          text-transform: uppercase;
        }

        .countdown-title {
          margin: 0;
          color: #795a34;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(29px, 7vw, 42px);
          font-weight: 500;
          line-height: 1.1;
          text-shadow: 0 2px 12px rgba(255,255,255,.7);
        }

        .countdown-subtitle {
          margin: 9px 0 0;
          color: #947b5c;
          font-family: Georgia, serif;
          font-size: clamp(11px, 2.8vw, 14px);
          font-style: italic;
        }

        /* Four interactive frames */

        .countdown-grid {
          position: absolute;
          top: 35.8%;
          left: 6.4%;
          width: 87.2%;
          height: 16.1%;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          column-gap: 2.2%;
          z-index: 4;
        }

        .countdown-tile {
          position: relative;
          width: 100%;
          height: 100%;
          min-width: 0;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          color: #80603a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
          overflow: visible;
          perspective: 700px;
          touch-action: manipulation;
        }

        .countdown-tile:focus-visible {
          outline: 2px solid #b18a4d;
          outline-offset: 3px;
          border-radius: 12px;
        }

        .countdown-tile-inner {
          width: 100%;
          height: 76%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          border-radius: 22%;
        }

        .countdown-value {
          color: #8e6939;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(26px, 7vw, 48px);
          font-weight: 600;
          line-height: 1;
          text-shadow:
            0 1px 0 #fff,
            0 3px 10px rgba(177, 135, 68, .18);
          transform-style: preserve-3d;
        }

        .countdown-hidden {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 4px;
          background: radial-gradient(
            circle,
            rgba(255, 249, 234, .84),
            rgba(224, 196, 151, .12)
          );
        }

        .countdown-hidden-icon {
          color: #ae874c;
          font-size: clamp(20px, 5vw, 29px);
          line-height: 1;
          text-shadow: 0 0 12px rgba(198, 158, 91, .5);
        }

        .countdown-tap-text {
          color: #987544;
          font-family: Georgia, serif;
          font-size: clamp(8px, 2vw, 10px);
          letter-spacing: .13em;
        }

        .countdown-tile-label {
          width: 100%;
          margin-top: 3px;
          text-align: center;
          color: #987544;
          font-family: Georgia, serif;
          font-size: clamp(8px, 2vw, 10px);
          letter-spacing: .12em;
          line-height: 1;
        }

        .countdown-tile-shine {
          position: absolute;
          top: 0;
          left: -50%;
          width: 35%;
          height: 75%;
          transform: skewX(-20deg);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.55),
            transparent
          );
          pointer-events: none;
          border-radius: 30%;
        }

        /* Golden burst */

        .countdown-burst {
          position: absolute;
          left: 50%;
          top: 40%;
          width: 1px;
          height: 1px;
          z-index: 10;
          pointer-events: none;
        }

        .countdown-burst-particle {
          position: absolute;
          color: #bd914e;
          font-size: 15px;
          text-shadow: 0 0 10px rgba(220, 178, 108, .9);
        }

        /* Lower interaction message */

        .countdown-bottom {
          position: absolute;
          top: 66%;
          left: 7%;
          width: 86%;
          text-align: center;
          z-index: 3;
        }

        .countdown-bottom-title {
          color: #8c6c42;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(22px, 6vw, 34px);
          font-style: italic;
          font-weight: 500;
          margin: 0;
        }

        .countdown-bottom-text {
          color: #987f60;
          font-family: Georgia, serif;
          font-size: 12px;
          line-height: 1.8;
          margin: 10px auto 18px;
          max-width: 280px;
        }

        .countdown-reveal-all {
          border: 1px solid rgba(168, 127, 66, .7);
          border-radius: 999px;
          background: linear-gradient(135deg, #fffaf0, #ead8b9);
          color: #89683d;
          padding: 11px 23px;
          font-family: Georgia, serif;
          font-size: 10px;
          letter-spacing: .16em;
          text-transform: uppercase;
          box-shadow: 0 5px 18px rgba(144, 105, 53, .13);
          cursor: pointer;
          transition: transform .25s ease, box-shadow .25s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .countdown-reveal-all:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(144, 105, 53, .2);
        }

        .countdown-reveal-all:active {
          transform: scale(.96);
        }

        .countdown-reveal-all:disabled {
          opacity: .65;
          cursor: default;
        }

        .countdown-bottom-ornament {
          color: #b18a4d;
          font-size: 17px;
          margin-top: 17px;
        }

        /* Background floating particles */

        .countdown-floating {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }

        .countdown-floating span {
          position: absolute;
          color: rgba(183, 140, 72, .65);
          text-shadow: 0 0 10px rgba(226, 190, 128, .7);
        }

        @media (max-width: 480px) {
          .countdown-card {
            width: 100%;
            height: 100svh;
          }

          .countdown-grid {
            top: 35.8%;
            height: 16.1%;
            column-gap: 2.2%;
          }

          .countdown-value {
            font-size: clamp(25px, 7.3vw, 38px);
          }

          .countdown-tile-label {
            font-size: clamp(7px, 2vw, 9px);
            letter-spacing: .08em;
          }

          .countdown-bottom {
            top: 66%;
          }
        }

        @media (max-width: 360px) {
          .countdown-value {
            font-size: 24px;
          }

          .countdown-tap-text {
            font-size: 7px;
          }

          .countdown-bottom-text {
            font-size: 11px;
          }
        }

        @media (max-height: 680px) {
          .countdown-card {
            min-height: 560px;
          }

          .countdown-heading {
            top: 14%;
          }

          .countdown-grid {
            top: 34%;
          }

          .countdown-bottom {
            top: 63%;
          }

          .countdown-bottom-text {
            margin: 7px auto 12px;
          }

          .countdown-bottom-ornament {
            margin-top: 9px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .countdown-tile-shine {
            display: none;
          }
        }
      `}</style>

      <div className="countdown-card">
        {/* Original countdown artwork */}
        <img
          src={weddingData.templates.countdown}
          alt=""
          className="countdown-template"
          draggable="false"
        />

        {/* Heading */}
        <div className="countdown-heading">
          <motion.p
            className="countdown-eyebrow"
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Every second brings us closer
          </motion.p>

          <motion.h2
            className="countdown-title"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            The Countdown Begins
          </motion.h2>

          <motion.p
            className="countdown-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            A beautiful moment is getting closer...
          </motion.p>
        </div>

        {/* Interactive countdown frames */}
        <div className="countdown-grid">
          {countdownItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={{
                opacity: 0,
                y: 35,
                scale: 0.8,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.35 + index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <CountdownTile
                item={item}
                value={time[item.key]}
                revealed={revealed.includes(item.key)}
                onReveal={handleReveal}
              />
            </motion.div>
          ))}
        </div>

        {/* Lower interactive area */}
        <div className="countdown-bottom">
          <motion.h3
            className="countdown-bottom-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.5 }}
          >
            A moment worth waiting for
          </motion.h3>

          <motion.p
            className="countdown-bottom-text"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.8 }}
          >
            Tap each golden frame to uncover the time
            remaining until their beautiful beginning.
          </motion.p>

          <motion.button
            type="button"
            className="countdown-reveal-all"
            onClick={handleRevealAll}
            disabled={revealAll}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 1 }}
            whileTap={{ scale: 0.96 }}
          >
            {revealAll ? "All Revealed ✨" : "Reveal All"}
          </motion.button>

          <motion.div
            className="countdown-bottom-ornament"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.95, 1.08, 0.95],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ✧ &nbsp; ♡ &nbsp; ✧
          </motion.div>
        </div>

        {/* Ambient sparkles */}
        <div className="countdown-floating">
          {Array.from({ length: 12 }).map((_, index) => (
            <motion.span
              key={index}
              style={{
                left: `${8 + ((index * 17) % 84)}%`,
                top: `${12 + ((index * 23) % 78)}%`,
                fontSize: index % 3 === 0 ? 15 : 10,
              }}
              animate={{
                opacity: [0.1, 0.75, 0.1],
                scale: [0.7, 1.25, 0.7],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3 + (index % 3),
                delay: index * 0.25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {index % 2 === 0 ? "✧" : "·"}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
