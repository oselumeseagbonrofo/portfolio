import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { AccessibilityProvider } from "@/components/accessibility";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Oselumese Agbonrofo | Data Scientist & Researcher",
  description: "Portfolio of a Data Scientist focused on impactful insights and engineering excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AccessibilityProvider>
            <Header />
            <main id="main-content" className="pt-16">
              {children}
            </main>
            <Footer />
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
