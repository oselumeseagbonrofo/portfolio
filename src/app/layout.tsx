import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import PipelineProgress from "@/components/PipelineProgress";

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          <PipelineProgress />
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
