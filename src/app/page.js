"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, AppBar, Toolbar, Typography, Grid, Button } from "@mui/material";
import "@fontsource/poppins";
import "@fontsource/inter";
import "@fontsource/inria-serif";
import TrustedBy from "../components/trusted.js";
import TrustedBy2 from "../components/trusted2.js";
import Navbar from "../components/navbar.js";
import AnimatedWord from "../components/animated.js";

export default function LandingPage() {
  const [mobileNoticeVisible, setMobileNoticeVisible] = useState(true);

  return (
    <Box>
      {/* Note To Mobile Users*/}
      {mobileNoticeVisible && (
        <div className="block md:hidden bg-yellow-500 text-black text-center p-3 mt-16">
          <p className="text-sm">
            Note: Due to time constraint, the mobile experience of Bucket is not fully optimized right now.
            For the best experience, please use a desktop. Thanks - Kelechi
          </p>
          <button
            className="mt-1 text-xs underline"
            onClick={() => setMobileNoticeVisible(false)}
          >
            Dismiss
          </button>
        </div>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundImage: "url(landingpage.png)",
          backgroundSize: "cover",
          fontFamily: "Inter",
          padding: 0,
          margin: 0,
        }}
      >
        <Navbar />
        {/* Start of Hero Section */}
        <div className="flex flex-col items-center justify-center mb-10 mt-55 text-center">
          <Typography
            component="div"
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "70px",
              lineHeight: "70px",
              color: "white",
              textAlign: "center",
            }}
          >
            Plan Your Dream <AnimatedWord />
            <br />
            One List At A Time.
          </Typography>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <Typography
            sx={{
              fontFamily: "Inter",
              fontstyle: "normal",
              fontWeight: 400,
              fontSize: "20px",
              lineHeight: "30px",
              textAlign: "center",
              color: "grey",
            }}
          >
            Let AI craft a personalized bucket list based on your goals,
            passions, <br />
            and the experiences you’ve always wanted to try.
          </Typography>

          <TrustedBy />
        </div>

        {/* Generate Button */}
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <Link href="/generate" passHref>
            <Button
              sx={{
                fontFamily: "Poppins",
                fontSize: "20px",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "10px",
                px: "24px",
                py: "12px",
                color: "black",
                backgroundColor: "white",
                boxShadow: "0 0 0 transparent",
                transition: "all 0.4s ease-in-out",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                  boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.6)",
                  animation: "pulseGlow 1.5s ease-in-out infinite",
                  scale: "1.05",
                },
                "@keyframes pulseGlow": {
                  "0%": {
                    boxShadow: "0 0 8px 1px rgba(255, 255, 255, 0.4)",
                  },
                  "50%": {
                    boxShadow: "0 0 15px 10px rgba(255, 255, 255, 0.8)",
                  },
                  "100%": {
                    boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.4)",
                  },
                },
              }}
            >
              GENERATE MY LIST
            </Button>
          </Link>
        </div>
        {/* End of Hero Section */}
      </Box>

      <Box
        sx={{
          backgroundColor: "white",
          padding: "1rem",
        }}
      >
        {/* Start of Hero Section 2*/}
        <div className="flex flex-col items-center justify-center mt-15 mb-30 text-center">
          {/* How It Works */}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "70px",
              lineHeight: "70px",
              color: "black",
            }}
          >
            How It Works
          </Typography>
        </div>

        <div className="flex flex-row items-center justify-center text-center mb-10 space-x-10 space-x-30">
          {/* Step 1 */}
          <div className="flex flex-col items-center mr-10">
            <img
              src="/brain.png"
              alt="Brain Logo"
              width={350}
              height={250}
              style={{ marginBottom: "8px" }}
            />
            <Typography
              sx={{
                fontFamily: "Inter",
                color: "black",
                fontSize: "20px",
                fontWeight: 400,
                textAlign: "center",
                marginRight: "50px"
              }}
            >
              Tell us about <br /> yourself
            </Typography>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <div className="relative w-[350px] h-[250px] mb-2">
              <img
                src="/sparkles.png"
                alt="Sparkles Logo"
                className="w-full h-full object-contain animate-neon-sparkle"
              />
            </div>

            <style jsx>{`
              @keyframes neon-sparkle {
                0%,
                100% {
                  filter: drop-shadow(0 0 5pxrgb (255, 255, 255))
                    drop-shadow(0 0 10pxrgb (255, 255, 255));
                  transform: scale(1);
                }
                50% {
                  filter: drop-shadow(0 0 15pxrgb (255, 255, 255))
                    drop-shadow(0 0 30pxrgb (255, 255, 255));
                  transform: scale(1.05);
                }
              }

              .animate-neon-sparkle {
                animation: neon-sparkle 2s ease-in-out infinite;
              }
            `}</style>

            <Typography
              sx={{
                fontFamily: "Inter",
                color: "black",
                fontSize: "20px",
                textAlign: "center",
              }}
            >
              AI generates <br /> your dream list
            </Typography>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <div className="relative w-[200px] h-[250px] mb-2">
              <img
                src="/location.png"
                alt="Location Icon"
                className="w-full h-full object-contain animate-neon-sparkle"
              />
            </div>

            <style jsx>{`
              @keyframes neon-sparkle {
                0%,
                100% {
                  filter: drop-shadow(0 0 5px rgb(255, 255, 255))
                    drop-shadow(0 0 10px rgb(255, 255, 255));
                  transform: scale(1);
                }
                50% {
                  filter: drop-shadow(0 0 15px rgb(255, 255, 255))
                    drop-shadow(0 0 30px rgb(255, 255, 255));
                  transform: scale(1.05);
                }
              }

              .animate-neon-sparkle {
                animation: neon-sparkle 2s ease-in-out infinite;
              }
            `}</style>

            <Typography
              sx={{
                fontFamily: "Inter",
                color: "black",
                fontSize: "20px",
                textAlign: "center",
              }}
            >
              Choose where <br /> your journey begins
            </Typography>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center">
            <img
              src="/scroll-logo.png"
              alt="scroll Logo"
              width={350}
              height={350}
              style={{ marginBottom: "8px" }}
            />
            <Typography
              sx={{
                fontFamily: "Inter",
                color: "black",
                fontSize: "20px",
                textAlign: "center",
              }}
            >
              Start exploring!
            </Typography>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mt-45 mb-5 text-center">
          {/* Dont take our word for it */}
          <Typography
            component="div"
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "70px",
              lineHeight: "70px",
              color: "black",
            }}
          >
            Dont just take <span style={{ color: "#FF00DC" }}>our </span> word
            for it.
          </Typography>
        </div>

        <div className="flex flex-col items-center justify-center mt-0 mb-20 text-center">
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "70px",
              lineHeight: "70px",
              color: "black",
            }}
          >
            Here's what one of our users think.
          </Typography>
        </div>

        {/* Centered Testimonial Section */}
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 text-left">
            <Typography
              component="div"
              sx={{
                color: "black",
                fontFamily: "Inter",
                fontStyle: "italic",
                fontSize: "30px",
                lineHeight: "1.6",
              }}
            >
              <span style={{ color: "#FF00DC", fontWeight: "bold" }}>"</span>
              This past summer was my first time interning at Meta in the Bay
              Area, and outside of work I had no idea what to do.{" "}
              <span
                style={{
                  fontFamily: "Inria Serif",
                  fontWeight: "bold",
                  fontStyle: "normal",
                }}
              >
                Bucket
              </span>{" "}
              gave me a curated list of things to try, from local food spots to
              scenic hikes, and made exploring way less overwhelming.
              <span style={{ color: "#FF00DC", fontWeight: "bold" }}>"</span>
              <br />
              <br />
              {/* Testimonial block */}
              <div className="flex items-center gap-4">
                <div className="relative w-[80px] h-[80px]">
                  <img
                    src="/testimony.png"
                    alt="Maya"
                    className="w-full h-full rounded-xl object-cover"
                  />
                  <img
                    src="/meta.png"
                    alt="Meta Logo"
                    className="absolute bottom-0 right-0 w-5 h-5"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-black font-semibold not-italic">
                    Maya, 21
                  </span>
                  <span className="text-gray-500 text-sm not-italic">
                    Prev SWE Intern @ Meta
                  </span>
                </div>
              </div>
            </Typography>
          </div>
        </div>

        {/* IPAD + TESTIMONIAL */}
        <div className="flex flex-col items-center">
          {/* LEFT ITEM */}
          <div className="flex flex-row items-left mt-10 mb-10">
            <img src="/ipad.png" width={750} height={550}></img>
          </div>
        </div>
      </Box>

      {/* 3rd Landing Page Section */}

      <Box
        sx={{
          backgroundColor: "black",
          padding: "4rem",
        }}
      >
        {/* Start of Hero Section 2*/}
        <div className="flex flex-col items-center justify-center mt-15 text-center ">
          {/* CTA 1 */}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "50px",
              lineHeight: "70px",
              color: "white",
            }}
          >
            Ready for your next adventure? <br />
          </Typography>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          {/* CTA pt.2 */}
          <Typography
            sx={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "50px",
              lineHeight: "normal",
              color: "white",
            }}
          >
            Lets make it <span className="animated-gradient-text">happen</span>
            <style>
              {`
                .animated-gradient-text {
                  background: linear-gradient(
                    90deg,
                    #00f0ff,
                    #3b00ff,
                    #b800f9,
                    #ff007b,
                    #ffae00,
                    #00f0ff,
                    #ffae00,
                    #ff007b,
                    #b800f9,
                    #3b00ff,
                    #00f0ff
                  );
                  background-size: 1000% 100%;
                  background-clip: text;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  animation: rainbowShift 10s linear infinite;
                  display: inline-block;
                }

                @keyframes rainbowShift {
                  0% { background-position: 0% 50%; }
                  100% { background-position: 100% 50%; }
                }
              `}
            </style>
            .<br />
            <style>
              {`
                  @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                  }
                `}
            </style>
          </Typography>

          <div className="flex flex-col items-center justify-center text-center mt-10">
            <Typography
              sx={{
                fontFamily: "Inter",
                fontstyle: "normal",
                fontWeight: 400,
                fontSize: "20px",
                textAlign: "center",
                color: "grey",
              }}
            >
              We’ll build your list based on your budget, location, <br /> and
              what you actually care about.
            </Typography>
            <TrustedBy />
            {/* Generate Button */}
            <div className="flex flex-col items-center justify-center text-center mt-20">
              <Link href="/generate" passHref>
                <Button
                  sx={{
                    fontFamily: "Poppins",
                    fontSize: "20px",
                    fontWeight: 600,
                    textTransform: "none",
                    borderRadius: "10px",
                    px: "24px",
                    py: "12px",
                    color: "black",
                    backgroundColor: "white",
                    boxShadow: "0 0 0 transparent",
                    transition: "all 0.4s ease-in-out",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "black",
                      boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.6)",
                      animation: "pulseGlow 1.5s ease-in-out infinite",
                      scale: "1.05",
                    },
                    "@keyframes pulseGlow": {
                      "0%": {
                        boxShadow: "0 0 8px 1px rgba(255, 255, 255, 0.4)",
                      },
                      "50%": {
                        boxShadow: "0 0 15px 10px rgba(255, 255, 255, 0.8)",
                      },
                      "100%": {
                        boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.4)",
                      },
                    },
                  }}
                >
                  GENERATE MY LIST
                </Button>
              </Link>
            </div>

            {/* Meet the Creators Section */}
            <div className="bg-transparent py-12 mt-45">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold font-poppins mb-8 text-white">
                  Meet the Team
                </h2>
                <div className="flex justify-center flex-wrap gap-10">
                  {[
                    {
                      name: "Kelechi",
                      image: "/kelechi.jpg",
                      href: "https://www.linkedin.com/in/kelechi-opurum/",
                    },
                    {
                      name: "Sam",
                      image: "/sam.jpg",
                      href: "https://www.linkedin.com/in/samhersick/",
                    },
                    {
                      name: "Miles",
                      image: "/miles.jpg",
                      href: "https://www.linkedin.com/in/miles-hall1/",
                    },
                    {
                      name: "Hans",
                      image: "/hans.jpg",
                      href: "https://www.linkedin.com/in/hans-van-lierop/",
                    },
                  ].map((creator) => (
                    <a
                      key={creator.name}
                      href={creator.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center transition-transform hover:scale-105"
                    >
                      <img
                        src={creator.image}
                        alt={creator.name}
                        className="w-32 h-32 rounded-full object-cover shadow-md"
                      />
                      <span className="mt-3 text-white font-medium text-lg">
                        {creator.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center text-gray-400 mt-5 space-x-4 text-sm font-medium">
              <a
                href="https://github.com/kelechi055/bucket"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300"
              >
                GITHUB
              </a>
              <span className="text-gray-600">—</span>
              <span>© 2025</span>
              <span className="text-gray-600">—</span>
              <a
                href="https://devpost.com/software/bucket-3hzwcf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300"
              >
                DEVPOST
              </a>
            </div>
            <div className="text-20mx text-gray-400 mt-0 text-center italic">
              Imagined at HackHounds 2025 Hackathon
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
}
