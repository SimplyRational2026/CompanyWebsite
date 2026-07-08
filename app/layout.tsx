import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Geist,
  Noto_Serif_JP,
} from "next/font/google";
import "./globals.css";
import { ScrollToTopOnLoad } from "./lib/scrollLock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const notoSerifJp = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  weight: ["800"],
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simply Rational GmbH \u2013 Das Institut f\u00fcr Entscheidung",
  description:
    "We support organizations in measurably improving decision-making. To achieve this, we combine Nobel Prize-winning insights from behavioral science with organizational expertise.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${notoSerifJp.variable} ${bricolageGrotesque.variable} antialiased`}
    >
      <body>
        <ScrollToTopOnLoad />
        {children}
      </body>
    </html>
  );
}
