import { Plus_Jakarta_Sans } from 'next/font/google';

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

/** Resolved font-family string for MUI theme (not CSS variables). */
export const fontFamilySans = plusJakarta.style.fontFamily;
