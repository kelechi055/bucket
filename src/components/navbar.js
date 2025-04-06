'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { AppBar, Toolbar, Box, Button } from '@mui/material';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: 'black' }}>
      <Toolbar
        className="font-fredoka"
        sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
      >
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
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="border px-4 py-2 rounded border-white text-white hover:bg-white hover:text-black transition-all">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-all">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          ) : (
            <UserButton afterSignOutUrl="/" />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
