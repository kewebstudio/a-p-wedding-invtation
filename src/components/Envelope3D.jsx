
import { useEffect, useRef, useState } from "react";

const CLOSED_IMAGE = "/images/closed-card.jpg";
const OPENED_IMAGE = "/images/opened-card.jpg";
const LOGO_IMAGE = "/logo.png";

const sparkles = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 53 + 9) % 100}%`,
  delay: `${(i % 8) * 0.25}s`,
  size: `${5 + (i % 4) * 2}px`,
}));

export default function Envelope3D({ onOpened }) {
  const [phase, setPhase] = useState("closed");
  const [revealStarted, setRevealStarted] = useState(false);
  const [closedError, setClosedError] = useState(false);
  const [openedError, setOpenedError] = useState(false);

  const finishedDoors = useRef(new Set());
  const started = useRef(false);
  const notified = useRef(false);
  const revealTimer = useRef(null);

  useEffect(() => {
    const closed = new Image();
    const opened = new Image();

    closed.onload = () => setClosedError(false);
    closed.onerror = () => setClosedError(true);
    opened.onerror = () => setOpenedError(true);

    closed.src = CLOSED_IMAGE;
    opened.src = OPENED_IMAGE;

    return () => {
      if (revealTimer.current) {
        window.clearTimeout(revealTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (phase === "opened" && !notified.current) {
      notified.current = true;
      onOpened?.();
    }
  }, [phase, onOpened]);

  function openInvitation() {
    if (started.current) return;

    started.current = true;
    finishedDoors.current.clear();

    setPhase("opening");

    // Start revealing the opened invitation while the doors are moving.
    revealTimer.current = window.setTimeout(() => {
      setRevealStarted(true);
    }, 1200);
  }

  function handleDoorAnimationEnd(event) {
    if (event.animationName !== "gateDoorOpen") return;

    const side = event.currentTarget.dataset.side;
    finishedDoors.current.add(side);

    if (
      finishedDoors.current.has("left") &&
      finishedDoors.current.has("right")
    ) {
      setPhase("opened");
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openInvitation();
    }
  }

  return (
    <section className="wedding-envelope-screen">
      {/* Ambient golden light */}
      <div className="envelope-glow envelope-glow-left" />
      <div className="envelope-glow envelope-glow-right" />

      {/* Floating sparkles */}
      <div className="envelope-sparkles" aria-hidden="true">
        {sparkles.map((star) => (
          <span
            key={star.id}
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              fontSize: star.size,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      <div className="invitation-stage">

        {/* ORIGINAL OPENED CARD */}
        <div
          className={`opened-invitation ${
            revealStarted ? "opened-invitation-visible" : ""
          }`}
        >
          {!openedError ? (
            <img
              src={OPENED_IMAGE}
              alt="Arjun and Priya's opened wedding invitation"
              className="opened-invitation-image"
              draggable="false"
              onError={() => setOpenedError(true)}
            />
          ) : (
            <div className="opened-image-fallback">
              <p>TOGETHER WITH THEIR FAMILIES</p>
              <h1>Arjun & Priya</h1>
              <p>Two hearts, one beautiful journey.</p>
            </div>
          )}

          {/* CENTERED LOGO ABOVE THE TEXT */}
          <div
            className={`invitation-brand ${
              revealStarted ? "invitation-brand-visible" : ""
            }`}
          >
            <img
              src={LOGO_IMAGE}
              alt="Wedding logo"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>

          {/* ANIMATED INVITATION TEXT */}
          <div
            className={`opened-invitation-text ${
              revealStarted ? "text-reveal" : ""
            }`}
          >
            <p className="invitation-eyebrow">
              TOGETHER WITH THEIR FAMILIES
            </p>

            <h1>Arjun Reddy</h1>
            <span className="invitation-ampersand">&</span>
            <h1>Priya Reddy</h1>

            <div className="invitation-divider" />

            <p className="invitation-message">
              Two hearts, one beautiful journey.
            </p>

            <p className="invitation-request">
              JOYFULLY INVITE YOU TO CELEBRATE
              <br />
              THEIR WEDDING
            </p>

            <span className="invitation-heart">♡</span>
          </div>
        </div>

        {/* ORIGINAL CLOSED IMAGE — 3D FOLDING DOORS */}
        {phase !== "opened" && (
          <div
            className={`closed-invitation ${
              phase === "opening" ? "closed-invitation-opening" : ""
            }`}
            role="button"
            tabIndex={0}
            aria-label="Tap to open the wedding invitation"
            onClick={openInvitation}
            onKeyDown={handleKeyDown}
          >
            {/* LEFT DOOR */}
            <div
              className={`gate-door gate-door-left ${
                phase === "opening" ? "gate-door-animate" : ""
              }`}
              data-side="left"
              onAnimationEnd={handleDoorAnimationEnd}
            >
              {!closedError ? (
                <div
                  className="gate-image gate-image-left"
                  style={{ backgroundImage: `url("${CLOSED_IMAGE}")` }}
                />
              ) : (
                <div className="gate-fallback">♡</div>
              )}
            </div>

            {/* RIGHT DOOR */}
            <div
              className={`gate-door gate-door-right ${
                phase === "opening" ? "gate-door-animate" : ""
              }`}
              data-side="right"
              onAnimationEnd={handleDoorAnimationEnd}
            >
              {!closedError ? (
                <div
                  className="gate-image gate-image-right"
                  style={{ backgroundImage: `url("${CLOSED_IMAGE}")` }}
                />
              ) : (
                <div className="gate-fallback">♡</div>
              )}
            </div>

            {phase === "closed" && (
              <div className="invitation-tap">
                <span />
                TOUCH TO OPEN
                <span />
              </div>
            )}

            {phase === "opening" && (
              <>
                <div className="invitation-opening-light" />

                <div className="opening-magic">
                  <span>✦</span>
                  <span>♡</span>
                  <span>✧</span>
                  <span>✦</span>
                  <span>✧</span>
                  <span>♡</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        .wedding-envelope-screen,
        .wedding-envelope-screen * {
          box-sizing: border-box;
        }

        .wedding-envelope-screen {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          min-height: 600px;
          overflow: hidden;
          isolation: isolate;
          background: radial-gradient(
            ellipse at center,
            #fffefa 0%,
            #fff8ed 65%,
            #f1e3d1 100%
          );
        }

        .invitation-stage {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 2200px;
          perspective-origin: center;
          transform-style: preserve-3d;
        }

        /* AMBIENT LIGHT */

        .envelope-glow {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          filter: blur(85px);
          pointer-events: none;
        }

        .envelope-glow-left {
          top: 5%;
          left: 4%;
          background: rgba(224, 187, 128, .2);
        }

        .envelope-glow-right {
          right: 4%;
          bottom: 5%;
          background: rgba(224, 187, 128, .25);
        }

        /* FLOATING SPARKLES */

        .envelope-sparkles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .envelope-sparkles span {
          position: absolute;
          color: #cda467;
          opacity: .5;
          text-shadow: 0 0 10px #e5c58d;
          animation: invitationSparkle 3s ease-in-out infinite;
        }

        @keyframes invitationSparkle {
          0%, 100% {
            opacity: .2;
            transform: translateY(0) scale(.7) rotate(0);
          }
          50% {
            opacity: .95;
            transform: translateY(-14px) scale(1.3) rotate(35deg);
          }
        }

        /* CARD FRAME */

        .closed-invitation,
        .opened-invitation {
          position: absolute;
          width: min(
            506px,
            calc(94svh * .5604),
            calc(100vw - 24px)
          );
          aspect-ratio: 928 / 1656;
        }

        /* OPENED IMAGE */

        .opened-invitation {
          z-index: 1;
          overflow: hidden;
          opacity: 0;
          visibility: hidden;
          background: #f6ead9;
          box-shadow: 0 15px 45px rgba(83, 57, 32, .16);
        }

        .opened-invitation-visible {
          opacity: 1;
          visibility: visible;
          animation: openedCardReveal 1.5s ease both;
        }

        @keyframes openedCardReveal {
          0% {
            opacity: 0;
            transform: scale(.96);
            filter: brightness(1.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: brightness(1);
          }
        }

        .opened-invitation-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: fill;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* CENTERED LOGO */

        .invitation-brand {
          position: absolute;
          z-index: 6;
          top: 17%;
          left: 50%;
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(193, 151, 86, .35);
          border-radius: 50%;
          background: rgba(255, 251, 243, .9);
          box-shadow: 0 4px 18px rgba(113, 78, 38, .12);
          transform: translateX(-50%);
          opacity: 0;
        }

        .invitation-brand-visible {
          animation: logoAppear .9s ease .15s forwards;
        }

        .invitation-brand img {
          display: block;
          width: 78%;
          height: 78%;
          object-fit: contain;
        }

        @keyframes logoAppear {
          from {
            opacity: 0;
            transform: translate(-50%, -8px) scale(.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }

        /* INVITATION TEXT */

        .opened-invitation-text {
          position: absolute;
          z-index: 5;
          top: 27%;
          left: 17%;
          width: 66%;
          height: 44%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #987044;
          pointer-events: none;
        }

        .opened-invitation-text > * {
          opacity: 0;
          transform: translateY(15px);
        }

        .opened-invitation-text.text-reveal > * {
          animation: invitationTextReveal .8s cubic-bezier(.2,.75,.25,1) forwards;
        }

        .opened-invitation-text.text-reveal .invitation-eyebrow {
          animation-delay: .25s;
        }

        .opened-invitation-text.text-reveal h1:nth-of-type(1) {
          animation-delay: .48s;
        }

        .opened-invitation-text.text-reveal .invitation-ampersand {
          animation-delay: .65s;
        }

        .opened-invitation-text.text-reveal h1:nth-of-type(2) {
          animation-delay: .82s;
        }

        .opened-invitation-text.text-reveal .invitation-divider {
          animation-delay: 1s;
        }

        .opened-invitation-text.text-reveal .invitation-message {
          animation-delay: 1.15s;
        }

        .opened-invitation-text.text-reveal .invitation-request {
          animation-delay: 1.3s;
        }

        .opened-invitation-text.text-reveal .invitation-heart {
          animation-delay: 1.5s;
        }

        @keyframes invitationTextReveal {
          from {
            opacity: 0;
            transform: translateY(15px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .invitation-eyebrow {
          margin: 0 0 18px;
          color: #a47b43;
          font-family: Georgia, serif;
          font-size: clamp(8px, 2vw, 11px);
          letter-spacing: .16em;
        }

        .opened-invitation-text h1 {
          margin: 0;
          color: #936b3e;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(32px, 8vw, 54px);
          font-weight: 500;
          line-height: .98;
        }

        .invitation-ampersand {
          margin: 7px 0;
          color: #c59a59;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 28px;
          font-style: italic;
        }

        .invitation-divider {
          width: 100px;
          height: 1px;
          flex-shrink: 0;
          margin: 17px 0;
          background: linear-gradient(
            90deg,
            transparent,
            #c49a59,
            transparent
          );
        }

        .invitation-message {
          margin: 0;
          color: #806344;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: 16px;
          font-style: italic;
        }

        .invitation-request {
          margin: 16px 0 0;
          color: #a47b43;
          font-family: Georgia, serif;
          font-size: 8px;
          line-height: 1.8;
          letter-spacing: .12em;
        }

        .invitation-heart {
          margin-top: 12px;
          color: #c49a59;
          font-size: 23px;
          animation: heartPulse 1.8s ease-in-out infinite;
        }

        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .opened-image-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #85633f;
          background: #f5e8d7;
        }

        .opened-image-fallback h1 {
          font: italic 42px Georgia, serif;
        }

        /* CLOSED CARD */

        .closed-invitation {
          z-index: 5;
          overflow: visible;
          transform-style: preserve-3d;
          cursor: pointer;
          filter: drop-shadow(
            0 18px 28px rgba(70, 48, 28, .2)
          );
          -webkit-tap-highlight-color: transparent;
        }

        .closed-invitation-opening {
          cursor: default;
          pointer-events: none;
        }

        /* 3D DOORS */

        .gate-door {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          will-change: transform;
        }

        .gate-door-left {
          left: 0;
          transform-origin: left center;
        }

        .gate-door-right {
          right: 0;
          transform-origin: right center;
        }

        .gate-door-left.gate-door-animate {
          animation: gateDoorOpen 2.8s cubic-bezier(.45, 0, .2, 1) forwards;
          --door-angle: -125deg;
        }

        .gate-door-right.gate-door-animate {
          animation: gateDoorOpen 2.8s cubic-bezier(.45, 0, .2, 1) forwards;
          --door-angle: 125deg;
        }

        @keyframes gateDoorOpen {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(var(--door-angle));
          }
        }

        .gate-image {
          position: absolute;
          inset: 0;
          background-repeat: no-repeat;
          background-size: 200% 100%;
        }

        .gate-image-left {
          background-position: left center;
        }

        .gate-image-right {
          background-position: right center;
        }

        /* TAP PROMPT */

        .invitation-tap {
          position: absolute;
          z-index: 10;
          left: 0;
          right: 0;
          bottom: 8%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: #fff;
          font-family: Georgia, serif;
          font-size: 12px;
          letter-spacing: .2em;
          text-shadow: 0 2px 8px rgba(40,25,10,.8);
          pointer-events: none;
          animation: tapPulse 2s ease-in-out infinite;
        }

        .invitation-tap span {
          width: 23px;
          height: 1px;
          background: rgba(255,255,255,.9);
        }

        @keyframes tapPulse {
          0%, 100% { opacity: .65; }
          50% { opacity: 1; }
        }

        /* LIGHT THROUGH THE CENTRE */

        .invitation-opening-light {
          position: absolute;
          z-index: 10;
          top: 15%;
          bottom: 15%;
          left: 49%;
          width: 2%;
          background: #fff1cc;
          filter: blur(12px);
          box-shadow: 0 0 40px 25px rgba(255,218,155,.7);
          pointer-events: none;
          animation: openingGlow .8s ease-in-out infinite alternate;
        }

        @keyframes openingGlow {
          from { opacity: .35; }
          to { opacity: 1; }
        }

        /* MAGIC PARTICLES */

        .opening-magic {
          position: absolute;
          z-index: 12;
          inset: 0;
          pointer-events: none;
        }

        .opening-magic span {
          position: absolute;
          color: #fff2ce;
          text-shadow: 0 0 12px #d7a34f, 0 0 25px #fff;
          animation: magicRise 1.5s ease-out infinite;
        }

        .opening-magic span:nth-child(1) {
          left: 20%;
          top: 45%;
        }

        .opening-magic span:nth-child(2) {
          left: 72%;
          top: 55%;
          animation-delay: .3s;
        }

        .opening-magic span:nth-child(3) {
          left: 45%;
          top: 25%;
          animation-delay: .6s;
        }

        .opening-magic span:nth-child(4) {
          left: 80%;
          top: 75%;
          animation-delay: .9s;
        }

        .opening-magic span:nth-child(5) {
          left: 30%;
          top: 70%;
          animation-delay: .45s;
        }

        .opening-magic span:nth-child(6) {
          left: 60%;
          top: 35%;
          animation-delay: .75s;
        }

        @keyframes magicRise {
          from {
            opacity: 0;
            transform: translateY(18px) scale(.5) rotate(0);
          }
          50% { opacity: 1; }
          to {
            opacity: 0;
            transform: translateY(-35px) scale(1.4) rotate(70deg);
          }
        }

        .gate-fallback {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: #f5e8d7;
          color: #a77f49;
        }

        /* MOBILE FULL-SCREEN */

        @media (max-width: 600px) {
          .wedding-envelope-screen {
            width: 100%;
            height: 100vh;
            height: 100svh;
            min-height: 100svh;
          }

          .closed-invitation,
          .opened-invitation {
            inset: 0;
            width: 100%;
            height: 100%;
            max-width: none;
            aspect-ratio: auto;
            border-radius: 0;
          }

          .opened-invitation-image {
            width: 100%;
            height: 100%;
            object-fit: fill;
          }

          .gate-door {
            height: 100%;
          }

          .invitation-brand {
            top: 17%;
            left: 50%;
            width: 46px;
            height: 46px;
          }

          .invitation-tap {
            bottom: 8%;
            font-size: 10px;
          }

          .opened-invitation-text {
            top: 27%;
            left: 15%;
            width: 70%;
            height: 44%;
          }

          .invitation-eyebrow {
            font-size: 7px;
            margin-bottom: 12px;
          }

          .opened-invitation-text h1 {
            font-size: clamp(30px, 9vw, 43px);
          }

          .invitation-ampersand {
            font-size: 23px;
            margin: 5px 0;
          }

          .invitation-divider {
            margin: 13px 0;
          }

          .invitation-message {
            font-size: 14px;
          }

          .invitation-request {
            font-size: 7px;
            margin-top: 12px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gate-door.gate-door-animate {
            animation-duration: .01ms;
          }

          .opened-invitation-visible,
          .opened-invitation-text.text-reveal > * {
            animation-duration: .01ms;
          }
        }
      `}</style>
    </section>
  );
}
