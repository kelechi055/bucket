'use client';
import { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { Moon, Sun } from 'lucide-react';
const ThemeContext = createContext({ theme: 'light', toggle: () => {} });
function snapshot() { return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'; }
function apply(theme) { document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; }
function subscribe(listener) {
  const storage = (event) => { if (event.key === 'bucket-theme') { apply(event.newValue === 'dark' ? 'dark' : 'light'); listener(); } };
  window.addEventListener('bucket-theme-change', listener);
  window.addEventListener('storage', storage);
  return () => { window.removeEventListener('bucket-theme-change', listener); window.removeEventListener('storage', storage); };
}
export default function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, snapshot, () => 'light');
  const muiTheme = useMemo(() => createTheme({ palette: { mode: theme, primary: { main: theme === 'dark' ? '#fcd34d' : '#92400e' } }, typography: { fontFamily: 'Fredoka, sans-serif' } }), [theme]);
  const value = useMemo(() => ({ theme, toggle: () => {
    const next = snapshot() === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('bucket-theme', next); } catch { /* Theme still works when browser storage is unavailable. */ }
    window.dispatchEvent(new Event('bucket-theme-change'));
  } }), [theme]);
  return <ThemeContext.Provider value={value}><MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider></ThemeContext.Provider>;
}
export function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);
  return <button type="button" onClick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} aria-pressed={theme === 'dark'} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-amber-300">{theme === 'dark' ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}</button>;
}
