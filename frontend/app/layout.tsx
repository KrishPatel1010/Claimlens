import React from "react";
import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "ClaimLens — YouTube Health & Finance Claim Verifier",
  description:
    "Timestamped, evidence-backed verdict on every factual health and financial claim made in YouTube videos, powered by SerpApi and Google Fact Check Tools API.",
  authors: [{ name: "ClaimLens Engineering Team" }],
  keywords: [
    "Fact Check",
    "SerpApi",
    "YouTube Misinformation",
    "Google Scholar",
    "Google Finance",
    "Health Claims",
    "Trust Score",
  ],
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps): React.JSX.Element => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
