import type { Metadata } from 'next';
import { Marcellus, Nunito_Sans } from 'next/font/google';
import './globals.css';

import 'reactflow/dist/style.css';
import CustomProvider from '@/redux/costumProvider';
const marcellus = Marcellus({ weight: '400', variable: '--font-marcellus', subsets: ['latin'] });
const nunito = Nunito_Sans({ variable: '--font-nunito', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fawn Protocol',
  description: 'Fawn Protocol',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${""} ${""} max-w-[100vw] overflow-x-hidden relative`}>
        <CustomProvider>{children}</CustomProvider>
      </body>
    </html>
  );
}
