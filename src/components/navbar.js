'use client';

import { useEffect, useRef } from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { ThemeToggle } from './theme-provider';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const links = [
  { label: 'Search', href: '/search' },
  { label: 'Generate', href: '/generate' },
  { label: 'City Guides', href: '/guides' },
  { label: 'Saved Lists', href: '/save' },
];

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  const menuRef = useRef(null);
  const close = () => { if (menuRef.current) menuRef.current.open = false; };
  useEffect(() => {
    function dismiss(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) menuRef.current.open = false;
    }
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, []);
  const authButtons = isLoaded && (isSignedIn ? <UserButton /> : <>
    <SignInButton mode="modal"><button onClick={close} className="min-h-11 rounded-xl border border-white/40 px-4 py-2 text-sm font-medium">Log in</button></SignInButton>
    <SignUpButton mode="modal"><button onClick={close} className="min-h-11 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black">Sign up</button></SignUpButton>
  </>);

  return <AppBar position="fixed" sx={{ backgroundColor: 'black', pt: 'env(safe-area-inset-top)' }}>
    <Toolbar className="font-fredoka" sx={{ minHeight: '64px !important', justifyContent: 'space-between', gap: { xs: 1, sm: 2 }, px: { xs: 1.5, sm: 3 } }}>
      <Link href="/" aria-label="Bucket home" className="flex min-h-11 shrink-0 items-center gap-2 text-xl font-bold">bucket<Image src="/bucket-logo.png" alt="" width={22} height={22} /></Link>
      <Box component="nav" aria-label="Main navigation" sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1 }}>
        {links.map((item) => <Button key={item.href} component={Link} href={item.href} color="inherit" aria-current={pathname === item.href ? 'page' : undefined} sx={{ minHeight: 44, textTransform: 'none', backgroundColor: pathname === item.href ? 'white' : 'transparent', color: pathname === item.href ? 'black' : 'inherit', '&:hover': { backgroundColor: 'white', color: 'black' } }}>{item.label}</Button>)}
        <ThemeToggle />
        {authButtons}
      </Box>
      <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
        {isLoaded && (isSignedIn ? <UserButton /> : <div className="flex items-center gap-1"><SignInButton mode="modal"><button onClick={close} className="min-h-11 rounded-xl px-2 py-2 text-sm font-medium text-white hover:bg-white/10">Log in</button></SignInButton><SignUpButton mode="modal"><button onClick={close} className="min-h-11 whitespace-nowrap rounded-xl bg-white px-2 py-2 text-sm font-semibold text-black">Sign up</button></SignUpButton></div>)}
        <ThemeToggle />
        <details ref={menuRef} className="group" onKeyDown={(event) => { if (event.key === 'Escape') { close(); menuRef.current?.querySelector('summary')?.focus(); } }}>
          <summary aria-label="Navigation menu" className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-amber-300 [&::-webkit-details-marker]:hidden">
            <Menu aria-hidden="true" className="group-open:hidden" /><X aria-hidden="true" className="hidden group-open:block" />
          </summary>
          <div className="absolute right-3 top-full mt-2 max-h-[calc(100dvh-100px)] w-[min(320px,calc(100vw-24px))] overflow-y-auto rounded-2xl border border-white/20 bg-neutral-900 p-4 text-white shadow-xl">
            <nav id="mobile-navigation" aria-label="Mobile navigation" className="flex flex-col gap-2">{links.filter((item) => item.href !== "/" && !item.href.startsWith("https:")).map((item) => <Link key={item.href} href={item.href} onClick={close} aria-current={pathname === item.href ? 'page' : undefined} className={`flex min-h-12 items-center rounded-xl px-4 py-3 font-medium ${pathname === item.href ? 'bg-amber-200 text-amber-950' : 'hover:bg-white/10'}`}>{item.label}</Link>)}</nav>
          </div>
        </details>
      </Box>
    </Toolbar>
  </AppBar>;
}
