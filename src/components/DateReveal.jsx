
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { weddingData } from "../data/weddingData";

const particles = Array.from({ length: 40 }, (_, index) => {
  const angle = (index / 40) * Math.PI * 2;
  const distance = 90 + (index % 5) * 28;

  return {
    id: index,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    delay: (index % 10) * 0.035,
    symbol: index % 3 === 0 ? "✦" : index % 3 === 1 ? "✧" : "•",
  };
});

function ScratchSurface({ onComplete }) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const completedRef = useRef(false);
  const lastPointRef = useRef(null);
  const callbackRef = useRef(onComplete);

  useEffect(() => {
    callbackRef.current = onComplete;
  }, [onComplete]);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas || completedRef.current) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";

    const gradient = ctx.createLinearGradient(
      0,
      0,
      rect.width,
      rect.height
    );

    gradient.addColorStop(0, "#e8d4ad");
    gradient.addColorStop(0.25, "#fff4d9");
    gradient.addColorStop(0.5, "#c5a36d");
    gradient.addColorStop(0.75, "#f8e9c9");
    gradient.addColorStop(1, "#d0b17d");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    for (let x = 0; x < rect.width; x += 8) {
      for (let y = 0; y < rect.height; y += 8) {
        ctx.fillStyle =
          (x + y) % 16 === 0
            ? "rgba(255,255,255,.24)"
            : "rgba(126,91,44,.055)";

        ctx.fillRect(x, y, 1.2, 1.2);
      }
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#76572f";
    ctx.font = "600 10px Georgia";

    ctx.fillText(
      "✧ SCRATCH HERE ✧",
      rect.width / 2,
      rect.height / 2 - 8
    );

    ctx.fillStyle = "rgba(111,80,40,.75)";
    ctx.font = "8px Georgia";

    ctx.fillText(
      "REVEAL THE SPECIAL DAY",
      rect.width / 2,
      rect.height / 2 + 10
    );

    ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.font = "15px Georgia";
    ctx.fillText("✦", rect.width / 2, rect.height / 2 - 29);
  }, []);

  useEffect(() => {
    initializeCanvas();
    window.addEventListener("resize", initializeCanvas);

    return () => {
      window.removeEventListener("resize", initializeCanvas);
    };
  }, [initializeCanvas]);

  const getPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const checkProgress = (ctx, canvas) => {
    if (completedRef.current) return;

    const pixels = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    ).data;

    let transparent = 0;
    let total = 0;

    for (let i = 3; i < pixels.length; i += 64) {
      total++;
      if (pixels[i] < 80) transparent++;
    }

    if (total && transparent / total >= 0.38) {
      completedRef.current = true;
      drawingRef.current = false;
      callbackRef.current?.();
    }
  };

  const scratch = (event) => {
    if (!drawingRef.current || completedRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const point = getPoint(event);

    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 36;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(point.x, point.y, 18, 0, Math.PI * 2);
    ctx.fill();

    lastPointRef.current = point;
    checkProgress(ctx, canvas);
  };

  const handlePointerDown = (event) => {
    if (completedRef.current) return;

    event.preventDefault();
    drawingRef.current = true;
    lastPointRef.current = getPoint(event);

    event.currentTarget.setPointerCapture?.(event.pointerId);
    scratch(event);
  };

  const handlePointerMove = (event) => {
    if (!drawingRef.current) return;

    event.preventDefault();
    scratch(event);
  };

  const handlePointerUp = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className="date-scratch-surface"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label="Scratch to reveal the wedding date"
    />
  );
}

function CelebrationBurst({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="date-celebration"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, delay: 0.2 }}
        >
          <motion.div
            className="date-burst-flash"
            initial={{ opacity: 0.9, scale: 0.2 }}
            animate={{ opacity: 0, scale: 3 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
          />

          <motion.div
            className="date-burst-ring"
            initial={{ scale: 0.1, opacity: 1 }}
            animate={{ scale: 7, opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />

          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className="date-burst-particle"
              initial={{
                x: 0,
                y: 0,
                opacity: 0,
                scale: 0,
              }}
              animate={{
                x: particle.x * 1.8,
                y: particle.y * 1.8,
                opacity: [0, 1, 1, 0],
                scale: [0, 1.5, 1, 0.2],
                rotate: 180,
              }}
              transition={{
                duration: 2,
                delay: particle.delay,
                ease: "easeOut",
              }}
            >
              {particle.symbol}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function DateReveal() {
  const [revealed, setRevealed] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const burstTimer = useRef(null);

  const wedding = weddingData.wedding;

  const handleComplete = useCallback(() => {
    setRevealed(true);
    setShowBurst(true);

    window.clearTimeout(burstTimer.current);

    burstTimer.current = window.setTimeout(() => {
      setShowBurst(false);
    }, 2800);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(burstTimer.current);
  }, []);

  return (
    <section className="date-reveal-section" id="date-reveal">
      <style>{`
        .date-reveal-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          isolation: isolate;
          background: #f7eee5;
        }

        .date-reveal-card {
          position: relative;
          width: min(100%, 56.3svh);
          height: 100vh;
          height: 100svh;
          min-height: 620px;
          overflow: hidden;
          background: #f8eee5;
          isolation: isolate;
        }

        .date-template {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          display: block;
          object-fit: fill;
          pointer-events: none;
          user-select: none;
        }

        /* TOP HEADING */
        .date-heading {
          position: absolute;
          top: 15%;
          left: 5%;
          width: 90%;
          text-align: center;
          z-index: 3;
        }

        .date-eyebrow {
          margin: 0 0 8px;
          color: #a27b43;
          font-family: Georgia, serif;
          font-size: 10px;
          letter-spacing: .24em;
          text-transform: uppercase;
        }

        .date-title {
          margin: 0;
          color: #795a36;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(29px, 7vw, 43px);
          font-weight: 500;
          line-height: 1.1;
        }

        .date-subtitle {
          margin: 8px 0 0;
          color: #987e5d;
          font-family: Georgia, serif;
          font-size: 12px;
          font-style: italic;
        }

        /* SIDE FRAMES */
        .date-side-value {
          position: absolute;
          top: 39.5%;
          width: 18%;
          height: 12%;
          z-index: 4;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: #8b6739;
          overflow: hidden;
        }

        .date-side-value.left {
          left: 14%;
        }

        .date-side-value.right {
          right: 14%;
        }

        .date-side-main {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(13px, 3.5vw, 21px);
          font-weight: 600;
          line-height: 1.1;
        }

        .date-side-caption {
          margin-top: 5px;
          font-family: Georgia, serif;
          font-size: 7px;
          letter-spacing: .12em;
        }

        /* CENTRE FRAME */
        .date-main-value {
          position: absolute;
          top: 36%;
          left: 36%;
          width: 28%;
          height: 17%;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #886439;
          perspective: 800px;
        }

        .date-number {
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(39px, 10vw, 62px);
          line-height: .9;
          font-weight: 600;
          text-shadow: 0 2px 12px rgba(181, 140, 76, .2);
        }

        .date-month {
          margin-top: 7px;
          font-family: Georgia, serif;
          font-size: clamp(8px, 2.2vw, 12px);
          letter-spacing: .15em;
        }

        .date-scratch-surface {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: 23%;
          touch-action: none;
          cursor: crosshair;
          z-index: 8;
        }

        /* BOTTOM MESSAGE — SEPARATE FROM SCROLL PROMPT */
        .date-bottom {
          position: absolute;
          top: 61%;
          left: 8%;
          width: 84%;
          text-align: center;
          z-index: 5;
        }

        .date-bottom-kicker {
          margin: 0 0 6px;
          color: #a17a43;
          font-family: Georgia, serif;
          font-size: 8px;
          letter-spacing: .18em;
        }

        .date-bottom-title {
          margin: 0;
          color: #87633b;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(23px, 5.8vw, 31px);
          font-weight: 500;
          font-style: italic;
          line-height: 1.15;
        }

        .date-bottom-message {
          max-width: 290px;
          margin: 8px auto 0;
          color: #8d785e;
          font-family: Georgia, serif;
          font-size: 10px;
          line-height: 1.55;
        }

        .date-bottom-ornament {
          margin-top: 7px;
          color: #b18b50;
          font-size: 16px;
          line-height: 1;
        }

        /* CELEBRATION */
        .date-celebration {
          position: absolute;
          inset: 0;
          z-index: 12;
          overflow: hidden;
          pointer-events: none;
        }

        .date-burst-flash {
          position: absolute;
          left: 50%;
          top: 45%;
          width: 100%;
          height: 45%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(255,255,255,.95),
            rgba(255,222,157,.5) 35%,
            transparent 72%
          );
        }

        .date-burst-ring {
          position: absolute;
          top: 45%;
          left: 50%;
          width: 70px;
          height: 70px;
          border: 2px solid rgba(188,143,70,.8);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 22px rgba(210,167,93,.4);
        }

        .date-burst-particle {
          position: absolute;
          left: 50%;
          top: 45%;
          color: #bd914e;
          font-size: 19px;
          text-shadow: 0 0 12px rgba(232,195,128,.95);
        }

        /* AMBIENT SPARKLES */
        .date-ambient-sparkle {
          position: absolute;
          z-index: 2;
          color: rgba(183,140,72,.65);
          pointer-events: none;
          text-shadow: 0 0 10px rgba(226,190,128,.7);
        }

        /* SCROLL PROMPT — ITS OWN CLEAR AREA */
        .date-scroll-prompt {
          position: absolute;
          top: 81%;
          left: 0;
          width: 100%;
          text-align: center;
          color: #9a794b;
          font-family: Georgia, serif;
          font-size: 8px;
          letter-spacing: .15em;
          text-transform: uppercase;
          z-index: 6;
          pointer-events: none;
        }

        .date-scroll-arrow {
          display: block;
          margin-top: 4px;
          font-size: 19px;
          line-height: 1;
        }

        /* MOBILE */
        @media (max-width: 600px) {
          .date-reveal-section {
            width: 100%;
            min-height: 100svh;
          }

          .date-reveal-card {
            width: 100%;
            height: 100svh;
            min-height: 0;
          }

          .date-heading {
            top: 15%;
          }

          .date-eyebrow {
            font-size: 9px;
          }

          .date-title {
            font-size: clamp(28px, 8vw, 39px);
          }

          .date-subtitle {
            font-size: 11px;
          }

          .date-side-value {
            top: 39.5%;
            height: 12%;
          }

          .date-side-main {
            font-size: clamp(12px, 3.6vw, 17px);
          }

          .date-side-caption {
            font-size: 6px;
          }

          .date-main-value {
            top: 36%;
            left: 36%;
            width: 28%;
            height: 17%;
          }

          .date-number {
            font-size: clamp(35px, 10vw, 48px);
          }

          .date-month {
            font-size: 8px;
            margin-top: 5px;
          }

          .date-bottom {
            top: 61%;
            left: 7%;
            width: 86%;
          }

          .date-bottom-kicker {
            font-size: 7px;
            margin-bottom: 5px;
          }

          .date-bottom-title {
            font-size: clamp(22px, 6.5vw, 29px);
            line-height: 1.12;
          }

          .date-bottom-message {
            max-width: 270px;
            margin-top: 7px;
            font-size: 10px;
            line-height: 1.5;
          }

          .date-bottom-ornament {
            margin-top: 6px;
            font-size: 15px;
          }

          .date-scroll-prompt {
            top: 81%;
            font-size: 7px;
          }

          .date-scroll-arrow {
            margin-top: 4px;
            font-size: 18px;
          }
        }

        @media (max-width: 360px) {
          .date-heading {
            top: 14%;
          }

          .date-eyebrow {
            font-size: 8px;
          }

          .date-title {
            font-size: 27px;
          }

          .date-side-main {
            font-size: 11px;
          }

          .date-month {
            font-size: 7px;
          }

          .date-bottom {
            top: 60%;
          }

          .date-bottom-title {
            font-size: 22px;
          }

          .date-bottom-message {
            font-size: 9px;
            line-height: 1.45;
          }

          .date-scroll-prompt {
            top: 81%;
            font-size: 6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .date-reveal-section * {
            animation: none !important;
          }
        }
      `}</style>

      <div className="date-reveal-card">
        {/* ORIGINAL DATE TEMPLATE */}
        <img
          src={weddingData.templates.dateReveal}
          alt="Gold and ivory wedding date reveal template"
          className="date-template"
          draggable="false"
        />

        {/* HEADING */}
        <div className="date-heading">
          <motion.p
            className="date-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            A Moment to Remember
          </motion.p>

          <motion.h2
            className="date-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.9 }}
          >
            Save the Date
          </motion.h2>

          <motion.p
            className="date-subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Their forever has a day...
          </motion.p>
        </div>

        {/* LEFT FRAME */}
        <motion.div
          className="date-side-value left"
          initial={false}
          animate={
            revealed
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, scale: 0.7, filter: "blur(8px)" }
          }
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <span className="date-side-main">
            {wedding.day?.toUpperCase()}
          </span>
          <span className="date-side-caption">THE DAY</span>
        </motion.div>

        {/* RIGHT FRAME */}
        <motion.div
          className="date-side-value right"
          initial={false}
          animate={
            revealed
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, scale: 0.7, filter: "blur(8px)" }
          }
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="date-side-main">
            {wedding.year}
          </span>
          <span className="date-side-caption">THE YEAR</span>
        </motion.div>

        {/* CENTRE FRAME */}
        <div className="date-main-value">
          <AnimatePresence mode="wait">
            {revealed && (
              <motion.div
                key="revealed-date"
                initial={{
                  opacity: 0,
                  rotateX: -90,
                  scale: 0.5,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: 1,
                  rotateX: 0,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                transition={{
                  duration: 1.1,
                  delay: 0.15,
                  ease: "easeOut",
                }}
              >
                <div className="date-number">
                  {wedding.dayNumber}
                </div>

                <div className="date-month">
                  {wedding.month?.toUpperCase()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!revealed && (
            <ScratchSurface onComplete={handleComplete} />
          )}
        </div>

        {/* BOTTOM MESSAGE */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              className="date-bottom"
              initial={{
                opacity: 0,
                y: 18,
                filter: "blur(6px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.5,
                ease: "easeOut",
              }}
            >
              <p className="date-bottom-kicker">
                A CELEBRATION OF LOVE
              </p>

              <h3 className="date-bottom-title">
                A Day Made for Forever
              </h3>

              <p className="date-bottom-message">
                One beautiful day. Two hearts.
                <br />
                A lifetime of memories waiting to begin.
                <br />
                We cannot wait to celebrate with you!
              </p>

              <motion.div
                className="date-bottom-ornament"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.55, 1, 0.55],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ✧ &nbsp; ♡ &nbsp; ✧
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CELEBRATION BURST */}
        <CelebrationBurst active={showBurst} />

        {/* AMBIENT SPARKLES */}
        {Array.from({ length: 14 }).map((_, index) => (
          <motion.span
            key={index}
            className="date-ambient-sparkle"
            style={{
              left: `${7 + ((index * 19) % 86)}%`,
              top: `${12 + ((index * 17) % 78)}%`,
              fontSize: index % 3 === 0 ? 15 : 10,
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [0.7, 1.3, 0.7],
              y: [0, -9, 0],
              rotate: [0, 35, 0],
            }}
            transition={{
              duration: 3 + (index % 3),
              delay: index * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {index % 2 === 0 ? "✧" : "·"}
          </motion.span>
        ))}

        {/* NEXT SECTION PROMPT */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              className="date-scroll-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <span>Another surprise awaits</span>

              <motion.span
                className="date-scroll-arrow"
                animate={{ y: [0, 7, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ↓
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
