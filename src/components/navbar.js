'use client'

import Image from 'next/image';
import { AppBar, Toolbar, Box, Button } from '@mui/material';

export default function Navbar() {
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
            { label: 'About', href: '/about' },
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}
