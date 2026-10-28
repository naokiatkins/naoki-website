import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  // Makes the generated preview image an absolute URL, which LinkedIn/Slack require
  metadataBase: new URL("https://www.naokiatkins.com"),
  title: "Naoki Atkins — Portfolio",
  description:
    "Data engineer and business intelligence developer. Upload a job description to check our match.",
  openGraph: {
    title: "Naoki Atkins — Portfolio",
    description: "Upload a JD to see if we're a fit.",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
