import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import PipelineProgress from "@/components/PipelineProgress";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { AccessibilityProvider } from "@/components/accessibility";
import { preloadCriticalComponents, preloadOnInteraction } from "@/utils/dynamicImports";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Science Portfolio",
  description: "A showcase of data science projects and machine learning process.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize performance optimizations
  if (typeof window !== 'undefined') {
    preloadCriticalComponents();
    preloadOnInteraction();
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <AccessibilityProvider>
            <PipelineProgress />
            <PerformanceMonitor />
            <main id="main-content">
              {children}
            </main>
          </AccessibilityProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
