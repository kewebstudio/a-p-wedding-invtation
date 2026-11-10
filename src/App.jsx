
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Envelope3D from "./components/Envelope3D";
import CoupleIntroduction from "./components/CoupleIntroduction";
import DateReveal from "./components/DateReveal";
import Countdown from "./components/Countdown";
import Venue from "./components/Venue";
import FloatingParticles from "./components/FloatingParticles";
import MusicPlayer from "./components/MusicPlayer";

export default function App() {
  const [invitationOpened, setInvitationOpened] = useState(false);

  const handleEnvelopeOpened = useCallback(() => {
    setInvitationOpened(true);
  }, []);

  return (
    <main className="wedding-app">
      <FloatingParticles />

      {/* FIRST SECTION: INVITATION */}
      <Envelope3D onOpened={handleEnvelopeOpened} />

      {/* REMAINING WEDDING SECTIONS */}
      <AnimatePresence>
        {invitationOpened && (
          <motion.div
            id="wedding-surprises"
            className="wedding-surprises"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <section className="surprise-section" id="couple">
              <CoupleIntroduction />
            </section>

            <section className="surprise-section" id="date">
              <DateReveal />
            </section>

            <section className="surprise-section" id="countdown">
              <Countdown />
            </section>

            <section className="surprise-section" id="venue">
              <Venue />
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {invitationOpened && <MusicPlayer />}
    </main>
  );
}
