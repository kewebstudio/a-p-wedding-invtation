
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, Pause, Play, Volume2, VolumeX, X } from "lucide-react";

export default function MusicPlayer() {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setHasError(false);
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      setHasError(true);
      setIsPlaying(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    setVolume(nextVolume);

    if (nextVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  return (
    <>
      <style>{`
        .wedding-music-player {
          position: fixed;
          right: 18px;
          bottom: 20px;
          z-index: 100;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          font-family: Georgia, serif;
        }

        .music-panel {
          width: 225px;
          padding: 15px;
          border: 1px solid rgba(184, 147, 91, .55);
          border-radius: 17px;
          background: rgba(255, 251, 243, .96);
          box-shadow: 0 12px 35px rgba(79, 57, 31, .17);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .music-panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #87683e;
          font-size: 12px;
          letter-spacing: .08em;
          margin-bottom: 13px;
        }

        .music-close {
          border: 0;
          background: transparent;
          color: #987c55;
          padding: 3px;
          cursor: pointer;
          display: flex;
        }

        .music-track {
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .music-disc {
          width: 43px;
          height: 43px;
          flex: 0 0 43px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            repeating-radial-gradient(
              circle,
              #795c38 0px,
              #795c38 2px,
              #b28c55 3px,
              #795c38 4px
            );
          box-shadow: 0 3px 9px rgba(70, 48, 25, .25);
        }

        .music-disc-center {
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #f6e7c9;
          border: 2px solid #b28c55;
        }

        .music-track-title {
          color: #765938;
          font-size: 12px;
          margin: 0;
        }

        .music-track-subtitle {
          color: #a28a6b;
          font-size: 10px;
          margin: 4px 0 0;
        }

        .music-controls {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 14px;
        }

        .music-play-button {
          width: 35px;
          height: 35px;
          border: 0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fffaf1;
          background: linear-gradient(135deg, #c2a16a, #927044);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(117, 84, 42, .2);
        }

        .music-volume {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          color: #96774c;
        }

        .music-volume input {
          width: 100%;
          accent-color: #a98752;
          cursor: pointer;
        }

        .music-error {
          margin: 10px 0 0;
          color: #9b654b;
          font-size: 10px;
          line-height: 1.5;
        }

        .music-floating-button {
          position: relative;
          width: 53px;
          height: 53px;
          border: 1px solid rgba(255,255,255,.85);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fffaf1;
          background: linear-gradient(135deg, #c7a66f, #8e6d41);
          box-shadow:
            0 6px 22px rgba(84, 61, 32, .25),
            0 0 0 4px rgba(191, 157, 101, .15);
          cursor: pointer;
        }

        .music-floating-button svg {
          position: relative;
          z-index: 2;
        }

        .music-wave {
          position: absolute;
          bottom: 10px;
          left: 50%;
          display: flex;
          align-items: center;
          gap: 2px;
          height: 12px;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity .3s ease;
        }

        .music-wave span {
          width: 2px;
          height: 4px;
          border-radius: 3px;
          background: #fff8e9;
        }

        .music-floating-button.playing .music-wave {
          opacity: 1;
        }

        .music-floating-button.playing > svg {
          transform: translateY(-5px);
        }

        .music-floating-button.playing .music-wave span {
          animation: music-wave-animation .7s ease-in-out infinite alternate;
        }

        .music-wave span:nth-child(2) {
          animation-delay: .15s;
        }

        .music-wave span:nth-child(3) {
          animation-delay: .3s;
        }

        .music-wave span:nth-child(4) {
          animation-delay: .45s;
        }

        @keyframes music-wave-animation {
          from { height: 3px; }
          to { height: 11px; }
        }

        @media (max-width: 480px) {
          .wedding-music-player {
            right: 12px;
            bottom: 14px;
          }

          .music-floating-button {
            width: 48px;
            height: 48px;
          }

          .music-panel {
            width: 215px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .music-wave span {
            animation: none !important;
          }
        }
      `}</style>

      <audio
        ref={audioRef}
        src="/audio/music.mp3"
        loop
        preload="none"
        onEnded={handleEnded}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
      />

      <div className="wedding-music-player">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="music-panel"
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <div className="music-panel-heading">
                <span>WEDDING MELODY</span>

                <button
                  type="button"
                  className="music-close"
                  onClick={() => setIsExpanded(false)}
                  aria-label="Close music panel"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="music-track">
                <motion.div
                  className="music-disc"
                  animate={{
                    rotate: isPlaying ? 360 : 0,
                  }}
                  transition={{
                    duration: 4,
                    repeat: isPlaying ? Infinity : 0,
                    ease: "linear",
                  }}
                >
                  <div className="music-disc-center" />
                </motion.div>

                <div>
                  <p className="music-track-title">A Melody of Love</p>
                  <p className="music-track-subtitle">
                    A special moment for two hearts
                  </p>
                </div>
              </div>

              <div className="music-controls">
                <button
                  type="button"
                  className="music-play-button"
                  onClick={togglePlayback}
                  aria-label={isPlaying ? "Pause music" : "Play music"}
                >
                  {isPlaying ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} fill="currentColor" />
                  )}
                </button>

                <div className="music-volume">
                  <button
                    type="button"
                    className="music-close"
                    onClick={() => setIsMuted((previous) => !previous)}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX size={15} />
                    ) : (
                      <Volume2 size={15} />
                    )}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    aria-label="Music volume"
                  />
                </div>
              </div>

              {hasError && (
                <p className="music-error">
                  Music could not be loaded. Check that
                  public/audio/music.mp3 exists.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          className={`music-floating-button ${isPlaying ? "playing" : ""}`}
          onClick={() => setIsExpanded((previous) => !previous)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Open wedding music player"
        >
          <Music2 size={21} />

          <div className="music-wave">
            <span />
            <span />
            <span />
            <span />
          </div>
        </motion.button>
      </div>
    </>
  );}
