
import { motion } from "framer-motion";
import { weddingData } from "../data/weddingData";

export default function CoupleIntroduction() {
  const { couple } = weddingData;

  const groomName = "Arjun Reddy";
  const brideName = "Priya Reddy";
  const groomParents = "Mr. Aravind & Mrs. Sunitha";
  const brideParents = "Mr. Navdeep & Mrs. Parvathi";

  return (
    <section className="couple-section" id="couple">
      <style>{`
        .couple-section,
        .couple-section * {
          box-sizing: border-box;
        }

        .couple-section {
          position: relative;
          width: 100%;
          height: 100vh;
          height: 100svh;
          min-height: 580px;
          overflow: hidden;
          background: #f9f0e8;
          isolation: isolate;
        }

        .couple-template {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          z-index: 0;
          pointer-events: none;
        }

        .couple-photo-frame {
          position: absolute;
          top: 16.1%;
          width: 39.1%;
          height: 22.1%;
          overflow: hidden;
          border-radius: 50%;
          z-index: 2;
          background: #f1e6d9;
        }

        .couple-photo-frame.groom {
          left: 7.8%;
        }

        .couple-photo-frame.bride {
          left: 52%;
        }

        .couple-photo {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
          border-radius: 50%;
        }

        .couple-person-details {
          position: absolute;
          top: 48%;
          width: 43%;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 3px;
        }

        .couple-person-details.groom {
          left: 5%;
        }

        .couple-person-details.bride {
          right: 5%;
        }

        .couple-person-name {
          width: 100%;
          margin: 0;
          color: #805a32;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(14px, 4vw, 22px);
          font-weight: 600;
          line-height: 1.15;
        }

        .couple-person-role {
          margin: 4px 0 0;
          color: #a27a3e;
          font-family: Georgia, serif;
          font-size: 7px;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        /* PARENTS' DETAILS - INCREASED FONT SIZE */

        .couple-parent-label {
          width: 100%;
          margin: 6px 0 0;
          color: #725638;
          font-family: Georgia, serif;
          font-size: clamp(9px, 2.2vw, 11px);
          font-weight: 500;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .couple-parent-label span {
          display: block;
          margin-bottom: 3px;
          color: #a27a3e;
          font-size: .85em;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .couple-introduction {
          position: absolute;
          top: 64%;
          left: 12%;
          width: 76%;
          z-index: 4;
          text-align: center;
          padding: 0 4px;
        }

        .couple-eyebrow {
          margin: 0 0 5px;
          color: #a27a3e;
          font-family: Georgia, serif;
          font-size: 7px;
          line-height: 1.4;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .couple-introduction h2 {
          margin: 0;
          color: #805a32;
          font-family: "Cormorant Garamond", Georgia, serif;
          font-size: clamp(17px, 4.8vw, 24px);
          font-weight: 500;
          line-height: 1.15;
        }

        .couple-description {
          max-width: 240px;
          margin: 6px auto 0;
          color: #80694d;
          font-family: Georgia, serif;
          font-size: clamp(7px, 2vw, 9px);
          font-style: italic;
          line-height: 1.4;
        }

        @media (min-width: 700px) {
          .couple-section {
            height: min(100svh, 1000px);
            min-height: 700px;
          }

          .couple-person-name {
            font-size: 26px;
          }

          .couple-parent-label {
            font-size: 13px;
          }

          .couple-introduction h2 {
            font-size: 30px;
          }

          .couple-description {
            font-size: 12px;
          }
        }

        @media (max-width: 380px) {
          .couple-section {
            min-height: 0;
          }

          .couple-person-name {
            font-size: 13px;
          }

          .couple-person-role {
            font-size: 5.5px;
            margin-top: 3px;
          }

          .couple-parent-label {
            margin-top: 4px;
            font-size: 8px;
            line-height: 1.35;
          }

          .couple-introduction {
            top: 64%;
          }

          .couple-introduction h2 {
            font-size: 18px;
          }

          .couple-description {
            margin-top: 5px;
            font-size: 7.5px;
          }
        }
      `}</style>

      <img
        src={couple.coupleImage || "/images/couple.jpg"}
        alt=""
        className="couple-template"
        draggable="false"
      />

      <motion.div
        className="couple-photo-frame groom"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={couple.groom.image}
          alt={groomName}
          className="couple-photo"
          loading="eager"
        />
      </motion.div>

      <motion.div
        className="couple-photo-frame bride"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img
          src={couple.bride.image}
          alt={brideName}
          className="couple-photo"
          loading="eager"
        />
      </motion.div>

      <motion.div
        className="couple-person-details groom"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <h3 className="couple-person-name">{groomName}</h3>
        <p className="couple-person-role">The Groom</p>
        <p className="couple-parent-label">
          <span>Beloved son of</span>
          {groomParents}
        </p>
      </motion.div>

      <motion.div
        className="couple-person-details bride"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <h3 className="couple-person-name">{brideName}</h3>
        <p className="couple-person-role">The Bride</p>
        <p className="couple-parent-label">
          <span>Beloved daughter of</span>
          {brideParents}
        </p>
      </motion.div>

      <motion.div
        className="couple-introduction"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <p className="couple-eyebrow">A Beautiful Beginning</p>
        <h2>Two Hearts, One Promise</h2>
        <p className="couple-description">
          Together begins forever. With love, we celebrate our new journey.
        </p>
      </motion.div>
    </section>
  );
}
