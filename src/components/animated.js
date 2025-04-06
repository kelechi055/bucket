'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ['Life', 'Summer', 'Journey', 'Experience', 'Reality', 'Story'];

export default function AnimatedWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes rainbowShift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>

      <span
        style={{
          display: 'inline-block',
          position: 'relative',
          minWidth: '120px',
          height: '1em',
          verticalAlign: 'baseline',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{

              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              background: 'linear-gradient(90deg, #00f0ff, #3b00ff, #b800f9, #ff007b, #ffae00, #00f0ff)',
              backgroundSize: '1000% 100%',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
              fontSize: 'inherit',
              lineHeight: 'inherit',
              whiteSpace: 'nowrap',
              animation: 'rainbowShift 5s linear infinite',
            }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}
