import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { AccessibilityProvider, SkipLink } from '@/components/accessibility';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Oselumese Agbonrofo | Product Manager & Data Scientist',
  description: 'Portfolio of a Data Scientist focused on impactful insights and engineering excellence.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AccessibilityProvider>
            <SkipLink />
            <Header />
            <main id="main-content" className="pt-20 md:pt-24">
              {children}
              <Analytics />
            </main>
            <Footer />
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
