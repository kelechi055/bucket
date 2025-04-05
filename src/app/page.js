'use client'

import Image from "next/image";
import Link from "next/link";
import {Box, AppBar, Toolbar, Typography, Grid, Button} from "@mui/material";
import '@fontsource/poppins';
import '@fontsource/inter';

export default function Home() {
  return (
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

      <AppBar position="fixed" sx={{ backgroundColor: 'black' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          
          {/* Left side (Logo or Title) */}
          <Box 
            sx={{
              display: 'flex',
              fontWeight: 'bold', 
              fontSize: '1.2rem',
              alignItems: 'center',
              gap: 1,
            }} 
            component="a"
            href="/"
          >
            Bucket
            <img 
              src='/bucket-logo.png'
              alt="Bucket Logo" 
              width={20}
              height={20}
              style={{ marginRight: '16px', top: '40', marginTop: '-4px', transformOrigin: 'center'}}
              className="transition-transform duration-500 hover:rotate-180"
            />

          </Box>

          {/* Right side (Nav Items) */}
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
            <Button
              color="inherit"
              sx={{
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black'
                }
              }}
              href="/"
            >
              Home
            </Button>

            <Button
              color="inherit"
              sx={{
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black' 
                }
              }}
              href="/about"
            >
              About
            </Button>
            <Button
              color="inherit"
              sx={{
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black' 
                }
              }}
              href="/generate"
            >
              Generate
            </Button>
            <Button
              color="inherit"
              sx={{
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black' 
                }
              }}
              href="https://github.com/kelechi055/bucket"
            >
              GitHub
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/* End of Navbar */}


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
      </div>


      {/* Generate Button */}
      <div className="flex flex-col items-center justify-center text-center mt-20">
       <Button
        sx={{
          fontFamily: 'Poppins',
          fontSize: '20px',
          color: 'black',
          backgroundColor: 'white',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '10px',
        }}
        >
        
        GENERATE MY LIST
       </Button>
      </div>



    </Box>
  );
}
