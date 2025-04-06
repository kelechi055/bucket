'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { AppBar, Toolbar, Box, Button } from '@mui/material';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'black' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        {/* Left side (Bucket Logo) */}
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
          bucket
          <img
            src="/bucket-logo.png"
            alt="Bucket Logo"
            width={20}
            height={20}
            style={{ marginRight: '16px', marginTop: '-4px', transformOrigin: 'center' }}
            className="transition-transform duration-500 hover:rotate-180"
          />
        </Box>

        {/* Right side (Nav Items) */}
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}>
          {[
            { label: 'Home', href: '/' },
            { label: 'Generate', href: '/generate' },
            { label: 'GitHub', href: 'https://github.com/kelechi055/bucket' },
          ].map((item) => (
            <Button
              key={item.label}
              color="inherit"
              href={item.href}
              sx={{
                position: 'relative',
                color: 'white',
                textTransform: 'none',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '2px',
                  bottom: 4,
                  left: 0,
                  backgroundColor: 'white',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease',
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
          {!isSignedIn ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <SignInButton mode="modal">
                <Button
                sx={{
                  position: 'relative',
                  color: 'white',
                  textTransform: 'none',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '2px',
                    bottom: 4,
                    left: 0,
                    backgroundColor: 'white',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                  },
                }}
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                sx={{
                  position: 'relative',
                  color: 'white',
                  textTransform: 'none',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '100%',
                    height: '2px',
                    bottom: 4,
                    left: 0,
                    backgroundColor: 'white',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                  },
                }}
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </Box>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
