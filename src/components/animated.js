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
      <style jsx global>{`
        @keyframes rainbowShift {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }

        .rainbow-text {
          background: linear-gradient(
            90deg,
            #00f0ff,
            #3b00ff,
            #b800f9,
            #ff007b,
            #ffae00,
            #00f0ff
          );
          background-size: 1000% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbowShift 5s linear infinite;
          font-weight: 600;
        }
      `}</style>

      <div
        style={{
          display: 'inline-block',
          position: 'relative',
          minWidth: '120px',
          height: '1em',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={words[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="rainbow-text"
            style={{
                top: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',                
            }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </>
  );
}
