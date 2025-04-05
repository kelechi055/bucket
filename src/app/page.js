'use client'

import Image from "next/image";
import Link from "next/link";
import {Box, AppBar, Toolbar, Typography, Grid, Button} from "@mui/material";
import '@fontsource/poppins';
import '@fontsource/inter';
import "@fontsource/inria-serif";
import TrustedBy from '@/components/trusted.js';
import TrustedBy2 from '@/components/trusted2.js';
import Navbar from '@/components/navbar.js';

export default function LandingPage() {
  return (
    <Box>
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: 'url(landingpage.png)',
        backgroundSize: 'cover',
        fontFamily: 'Inter',
        padding: 0,
        margin: 0
      }}
      >
        <Navbar/>
        {/* Start of Hero Section */}
        <div className="flex flex-col items-center justify-center mb-10 mt-40 text-center">
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '70px',
              lineHeight: '70px',
              color: 'white',
            }}
          >
            Create Your Dream Life, <br />
            One List At A Time.
          </Typography>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontstyle: 'normal',
              fontWeight: 400,
              fontSize: '20px',
              lineHeight: '30px',
              textAlign: 'center',
              color: 'grey'
            }}
          >
            Let AI craft a personalized bucket list based on your goals, passions, <br />
            and the experiences you’ve always wanted to try.
          </Typography>

          <TrustedBy/>
        </div>
        
            {/* Generate Button */}
            <div className="flex flex-col items-center justify-center text-center mt-20">
            <Link href="/generate" passHref>
              <Button
                sx={{
                  fontFamily: 'Poppins',
                  fontSize: '20px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: '24px',
                  py: '12px',
                  color: 'black',
                  backgroundColor: 'white',
                  boxShadow: '0 0 0 transparent',
                  transition: 'all 0.4s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'black',
                    boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.6)',
                    animation: 'pulseGlow 1.5s ease-in-out infinite',
                  },
                  '@keyframes pulseGlow': {
                    '0%': {
                      boxShadow: '0 0 8px 1px rgba(255, 255, 255, 0.4)',
                    },
                    '50%': {
                      boxShadow: '0 0 15px 10px rgba(255, 255, 255, 0.8)',
                    },
                    '100%': {
                      boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.4)',
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
          backgroundColor: 'white',
          padding: '2rem',
        }}
      >

        {/* Start of Hero Section 2*/}
        <div className="flex flex-col items-center justify-center mt-15 mb-5 text-center">
          {/* How It Works */}
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '70px',
              lineHeight: '70px',
              color: 'black',
            }}
          >
            How It Works
          </Typography>
        </div>

        <div className="flex flex-row items-center justify-center text-center mb-10 space-x-12 space-x-60">
          {/* Step 1 */}
          <div className="flex flex-col items-center">
            <img 
              src="/brain.png"
              alt="Brain Logo" 
              width={150}
              height={150}
              style={{ marginBottom: '8px' }}
            />
            <Typography
              sx={{
                fontFamily: 'Inter',
                color: 'black',
                fontSize: '20px',
                fontWeight: 400,
                textAlign: 'center',
              }}
            >
              Tell us about <br /> yourself
            </Typography> 
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center">
            <img 
              src="/sparkles.png"
              alt="Sparkles Logo" 
              width={150}
              height={150}
              style={{ marginBottom: '8px' }}
            />
            <Typography
              sx={{
                fontFamily: 'Inter',
                color: 'black',
                fontSize: '20px',
                textAlign: 'center',
              }}
            >
              AI generates <br /> your dream list
            </Typography> 
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center">
            <img 
              src="/scroll-logo.png"
              alt="scroll Logo" 
              width={150}
              height={150}
              style={{ marginBottom: '8px' }}
            />
            <Typography
              sx={{
                fontFamily: 'Inter',
                color: 'black',
                fontSize: '20px',
                textAlign: 'center',
              }}
            >
              Start living it.
            </Typography> 
          </div>
        </div>

        {/* IPAD + TESTIMONIAL */}
        <div className="flex flex-row items-center">
          {/* LEFT ITEM */}
          <div className="flex flex-row items-left mt-10">
            <img
              src="/ipad.png"
              width={550}
              height={550}
              >
            </img>
          </div>
          
          {/* MIDDLE ITEM / LINE */}
          <div className="w-px h-150 bg-gray-300 mx-8 mt-10 ml-50"></div>
        
          {/* Right Side */}
          <div className="w-1/2 text-left ">
            <Typography
            sx={{
              color: 'black',
              fontFamily: 'Inter',
              fontStyle: 'italic',
              fontSize: '30px',
            }}
          >
            "I never realized I wanted to go skydiving <br/>
            until I tried{' '}
            <span
              style={{
                fontFamily: 'Inria Serif',
                fontWeight: 'bold',
                fontStyle: 'italic',

              }}
            >
              bucket
            </span>
            !"

            <br/> <br/> 
            <span className="font-normal not-italic">Maya, 23</span>
            </Typography>
            <img src="/maya.png"></img>

          </div>
        </div>    
      </Box>

      {/* 3rd Landing Page Section */}

      <Box
        sx={{
          backgroundColor: 'black',
          padding: '4rem',
        }}
      >
        {/* Start of Hero Section 2*/}
        <div className="flex flex-col items-center justify-center mt-15 text-center">
          {/* CTA 1 */}
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '50px',
              lineHeight: '70px',
              color: 'white',
            }}
          >
            Ready for your next adventure? <br/>
          </Typography>
        </div>
        <div className="flex flex-col items-center justify-center mb-0 mt-0 text-center">
          {/* CTA pt.2 */}
          <Typography
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: '50px',
              lineHeight: 'normal',
              color: 'white',
            }}
          >
            Lets make it{' '}
            <span style={{
              background: 'linear-gradient(to right, #00f0ff, #3b00ff, #b800f9, #ff007b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
            >
            happen
              </span>.<br/>
          </Typography>

          <div className="flex flex-col items-center justify-center text-center mt-10">
            <Typography
              sx={{
                fontFamily: 'Inter',
                fontstyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                textAlign: 'center',
                color: 'grey'
              }}
            >
              Join hundreds creating their dream lives with AI-generated <br/> bucket lists. Discover goals you didn’t know you had.
            </Typography>
            <TrustedBy/>
            {/* Generate Button */}
            <div className="flex flex-col items-center justify-center text-center mt-20">
            <Link href="/generate" passHref>
              <Button
                sx={{
                  fontFamily: 'Poppins',
                  fontSize: '20px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '10px',
                  px: '24px',
                  py: '12px',
                  color: 'black',
                  backgroundColor: 'white',
                  boxShadow: '0 0 0 transparent',
                  transition: 'all 0.4s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'black',
                    boxShadow: '0 0 20px 5px rgba(255, 255, 255, 0.6)',
                    animation: 'pulseGlow 1.5s ease-in-out infinite',
                  },
                  '@keyframes pulseGlow': {
                    '0%': {
                      boxShadow: '0 0 8px 1px rgba(255, 255, 255, 0.4)',
                    },
                    '50%': {
                      boxShadow: '0 0 15px 10px rgba(255, 255, 255, 0.8)',
                    },
                    '100%': {
                      boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.4)',
                    },
                  },
                }}
              >
                GENERATE MY LIST
                
              </Button>
            </Link>

            </div>
            <div className="flex items-center justify-center text-gray-400 mt-40 space-x-4 text-sm font-medium">
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
                href="https://devpost.com/software/bucket" // <- replace with your real Devpost link
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300"
              >
                DEVPOST
              </a>
            </div>
          </div>
        </div>
      </Box>
    </Box>

  );
}
