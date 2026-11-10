
import { motion } from "framer-motion";
import { Navigation, ArrowUpRight } from "lucide-react";
import { weddingData } from "../data/weddingData";

const sparkles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 13) % 100}%`,
  top: `${(i * 29 + 7) % 100}%`,
  delay: (i % 6) * 0.35,
}));

export default function Venue() {
  const venue = weddingData.venue || {};

  const template =
    venue.template ||
    weddingData.templates?.venue ||
    "/images/venue.jpg";

  const hallImage = venue.image || "/images/hall.jpg";
  const venueName = venue.name || "The Grand Wedding Function Hall";
  const venueAddress =
    venue.address || "Shamirpet, Hyderabad, Telangana";

  const mapUrl =
    venue.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      venueAddress
    )}`;

  return (
    <section className="venue-section" id="venue">
      <style>{`
        .venue-section,
        .venue-section * {
          box-sizing: border-box;
        }

        .venue-section {
          width: 100%;
          min-height: 100vh;
          min-height: 100svh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
          background: #f7eee5;
          isolation: isolate;
        }

        .venue-card {
          position: relative;
          width: min(100%, 56.35svh);
          height: 100vh;
          height: 100svh;
          min-height: 600px;
          overflow: hidden;
          background: #f8eee5;
          isolation: isolate;
        }

        /* ORIGINAL TEMPLATE */

        .venue-template {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          z-index: 0;
          pointer-events: none;
          user-select: none;
        }

        /* FUNCTION HALL IMAGE */

        .venue-photo-frame {
          position: absolute;
          top: 15.2%;
          left: 8.5%;
          width: 83%;
          height: 27%;
          z-index: 2;
          overflow: hidden;
          background: #ead8b9;
          clip-path: polygon(
            0% 28%, 3% 20%, 10% 14%, 20% 9%,
            31% 4%, 42% 1%, 50% 0%, 58% 1%,
            69% 4%, 80% 9%, 90% 14%, 97% 20%,
            100% 28%, 100% 100%, 0% 100%
          );
        }

        .venue-hall-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .venue-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 65%,
            rgba(48, 30, 12, .18)
          );
          pointer-events: none;
        }

        .venue-photo-caption {
          position: absolute;
          right: 8px;
          bottom: 9px;
          max-width: 75%;
          padding: 6px 10px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,.55);
          background: rgba(75, 48, 24, .65);
          color: #fffaf0;
          font-family: Georgia, serif;
          font-size: 8px;
          letter-spacing: .07em;
          line-height: 1.3;
          text-align: center;
        }

        /* VENUE TITLE */

        .venue-details {
          position: absolute;
          top: 53%;
          left: 9%;
          width: 82%;
          z-index: 4;
          text-align: center;
        }

        .venue-eyebrow {
          margin: 0 0 7px;
          color: #a17b47;
          font-family: Georgia, serif;
          font-size: 7px;
          line-height: 1.4;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .venue-title {
          width: 100%;
          margin: 0 auto;
          color: #795936;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(19px, 5vw, 25px);
          line-height: 1.12;
          font-weight: 500;
          text-align: center;
          text-wrap: balance;
          overflow-wrap: break-word;
        }

        /* ADDRESS - CLEAR SPACE BELOW THE DIVIDER */

        .venue-location {
          position: absolute;
          top: 69%;
          left: 9%;
          width: 82%;
          z-index: 5;
          margin: 0;
          padding: 0 5px;
          color: #806343;
          font-family: Georgia, serif;
          font-size: 9px;
          line-height: 1.4;
          text-align: center;
          overflow-wrap: anywhere;
          background: transparent;
        }

        /* BUTTON - ABOVE THE LOWER DECORATION */

        .venue-button-wrap {
          position: absolute;
          top: 76%;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 6;
        }

        .venue-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 33px;
          max-width: 75%;
          padding: 0 15px;
          border: 1px solid #b58c51;
          border-radius: 30px;
          background: linear-gradient(
            135deg,
            #fffaf0,
            #ead8b9
          );
          color: #806039;
          box-shadow: 0 4px 12px rgba(135, 97, 48, .13);
          font-family: Georgia, serif;
          font-size: 7px;
          letter-spacing: .12em;
          text-decoration: none;
          white-space: nowrap;
        }

        .venue-button:focus-visible {
          outline: 2px solid #9c713b;
          outline-offset: 4px;
        }

        /* SPARKLES */

        .venue-sparkles {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          overflow: hidden;
        }

        .venue-sparkle {
          position: absolute;
          color: #b58a4b;
          font-size: 10px;
          text-shadow: 0 0 9px rgba(218, 180, 116, .8);
        }

        /* MOBILE */

        @media (max-width: 600px) {
          .venue-card {
            width: 100%;
            height: 100svh;
            min-height: 0;
          }

          .venue-photo-frame {
            top: 15.2%;
            left: 8.5%;
            width: 83%;
            height: 27%;
          }

          .venue-details {
            top: 53%;
            left: 9%;
            width: 82%;
          }

          .venue-title {
            font-size: clamp(19px, 5.5vw, 24px);
            line-height: 1.13;
          }

          .venue-location {
            top: 69%;
            left: 8%;
            width: 84%;
            font-size: 8px;
          }

          .venue-button-wrap {
            top: 76%;
          }
        }

        /* SMALL MOBILE */

        @media (max-width: 360px) {
          .venue-details {
            top: 53%;
            left: 10%;
            width: 80%;
          }

          .venue-eyebrow {
            font-size: 6px;
            margin-bottom: 6px;
          }

          .venue-title {
            font-size: 19px;
          }

          .venue-location {
            top: 69%;
            left: 8%;
            width: 84%;
            font-size: 7.5px;
          }

          .venue-button-wrap {
            top: 76%;
          }
        }

        /* SHORT SCREENS */

        @media (max-height: 680px) {
          .venue-card {
            min-height: 0;
          }

          .venue-title {
            font-size: 20px;
          }

          .venue-location {
            font-size: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .venue-section * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="venue-card">

        {/* ORIGINAL GOLD TEMPLATE */}
        <img
          src={template}
          alt="Wedding venue invitation design"
          className="venue-template"
          draggable="false"
        />

        {/* FLOATING GOLD SPARKLES */}
        <div className="venue-sparkles" aria-hidden="true">
          {sparkles.map((item) => (
            <motion.span
              key={item.id}
              className="venue-sparkle"
              style={{
                left: item.left,
                top: item.top,
              }}
              animate={{
                opacity: [0.15, 0.75, 0.15],
                scale: [0.7, 1.2, 0.7],
                rotate: [0, 35, 0],
              }}
              transition={{
                duration: 3 + (item.id % 3),
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {item.id % 2 === 0 ? "✧" : "✦"}
            </motion.span>
          ))}
        </div>

        {/* INDOOR WEDDING FUNCTION HALL */}
        <motion.div
          className="venue-photo-frame"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={hallImage}
            alt={`${venueName} indoor wedding function hall`}
            className="venue-hall-image"
          />

          <div className="venue-photo-overlay" />

          <div className="venue-photo-caption">
            A beautiful setting for your forever
          </div>
        </motion.div>

        {/* VENUE NAME */}
        <div className="venue-details">
          <motion.p
            className="venue-eyebrow"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            THE PLACE OF CELEBRATION
          </motion.p>

          <motion.h2
            className="venue-title"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {venueName}
          </motion.h2>
        </div>

        {/* ADDRESS */}
        <motion.div
          className="venue-location"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          {venueAddress}
        </motion.div>

        {/* VIEW LOCATION */}
        <div className="venue-button-wrap">
          <motion.a
            className="venue-button"
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Navigation size={11} />
            VIEW LOCATION
            <ArrowUpRight size={11} />
          </motion.a>
        </div>

      </div>
    </section>
  );
}
