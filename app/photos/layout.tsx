import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://photos.naokiatkins.com"),
  title: "Naoki Atkins — Photography",
  description: "Photography by Naoki Atkins.",
};

export default function PhotosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
