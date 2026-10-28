import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://music.naokiatkins.com"),
  title: "Naoki Atkins — Music",
  description: "Music by Naoki Atkins.",
};

export default function MusicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
