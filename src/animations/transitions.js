
import { cubicBezier } from "framer-motion";

// Main cinematic easing
export const weddingEase = cubicBezier(0.22, 1, 0.36, 1);

// Common transition settings
export const transitions = {
  smooth: {
    duration: 0.8,
    ease: weddingEase,
  },

  cinematic: {
    duration: 1.4,
    ease: weddingEase,
  },

  quick: {
    duration: 0.35,
    ease: "easeOut",
  },

  elegant: {
    duration: 1.1,
    ease: [0.16, 1, 0.3, 1],
  },

  spring: {
    type: "spring",
    stiffness: 120,
    damping: 14,
  },

  softSpring: {
    type: "spring",
    stiffness: 75,
    damping: 18,
  },
};

// Full-screen section transitions
export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 35,
    filter: "blur(10px)",
  },

  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.1,
      ease: weddingEase,
    },
  },

  exit: {
    opacity: 0,
    scale: 1.03,
    y: -25,
    filter: "blur(8px)",
    transition: {
      duration: 0.55,
      ease: "easeInOut",
    },
  },
};

// Text animation
export const textVariants = {
  hidden: {
    opacity: 0,
    y: 25,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: transitions.cinematic,
  },

  exit: {
    opacity: 0,
    y: -15,
    filter: "blur(5px)",
    transition: transitions.quick,
  },
};

// Text entering from opposite directions
export const leftTextVariants = {
  hidden: {
    opacity: 0,
    x: -55,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: transitions.cinematic,
  },
};

export const rightTextVariants = {
  hidden: {
    opacity: 0,
    x: 55,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: transitions.cinematic,
  },
};

// Image reveal
export const imageRevealVariants = {
  hidden: {
    opacity: 0,
    scale: 1.16,
    clipPath: "inset(15% 15% 15% 15%)",
    filter: "blur(12px)",
  },

  visible: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    filter: "blur(0px)",
    transition: {
      duration: 1.5,
      ease: weddingEase,
    },
  },
};

// Circular photo reveal
export const photoRevealVariants = {
  hidden: {
    opacity: 0,
    scale: 0.55,
    rotate: -12,
    filter: "blur(12px)",
  },

  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    filter: "blur(0px)",
    transition: transitions.spring,
  },
};

// Fade and rise
export const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

// Fade and zoom
export const zoomVariants = {
  hidden: {
    opacity: 0,
    scale: 0.65,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
};

// Staggered children
export const staggerContainerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.15,
    },
  },
};

// Slower stagger for cinematic reveals
export const cinematicStaggerVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.28,
      delayChildren: 0.3,
    },
  },
};

// Floating animation
export const floatingVariants = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Gentle glowing animation
export const glowVariants = {
  animate: {
    opacity: [0.35, 1, 0.35],
    scale: [0.95, 1.08, 0.95],
    transition: {
      duration: 2.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Sparkle animation
export const sparkleVariants = {
  animate: {
    opacity: [0, 1, 0.2, 1, 0],
    scale: [0.4, 1.3, 0.8, 1.2, 0.4],
    rotate: [0, 45, 90, 135, 180],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Golden burst
export const burstVariants = {
  hidden: {
    opacity: 0,
    scale: 0.1,
  },

  visible: {
    opacity: [0, 1, 0],
    scale: [0.1, 1.8, 3],
    transition: {
      duration: 1.4,
      ease: "easeOut",
    },
  },
};

// Door opening
export const leftDoorVariants = {
  closed: {
    x: "0%",
    rotateY: 0,
    opacity: 1,
  },

  open: {
    x: "-110%",
    rotateY: -18,
    opacity: 0,
    transition: {
      duration: 1.8,
      ease: weddingEase,
    },
  },
};

export const rightDoorVariants = {
  closed: {
    x: "0%",
    rotateY: 0,
    opacity: 1,
  },

  open: {
    x: "110%",
    rotateY: 18,
    opacity: 0,
    transition: {
      duration: 1.8,
      ease: weddingEase,
    },
  },
};

// Scratch card reveal
export const scratchRevealVariants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    rotateX: -25,
    filter: "blur(12px)",
  },

  visible: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.1,
      ease: weddingEase,
    },
  },
};

// Interactive button motion
export const buttonVariants = {
  idle: {
    scale: 1,
  },

  hover: {
    scale: 1.06,
    transition: transitions.quick,
  },

  tap: {
    scale: 0.94,
    transition: {
      duration: 0.15,
    },
  },
};

// Countdown number flip
export const numberFlipVariants = {
  hidden: {
    opacity: 0,
    rotateX: -90,
    y: 15,
    scale: 0.7,
  },

  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    transition: transitions.cinematic,
  },
};

// Navigation arrow
export const arrowVariants = {
  animate: {
    y: [0, 7, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Shared reduced-motion-friendly transition
export const reducedMotionTransition = {
  duration: 0.01,
};
