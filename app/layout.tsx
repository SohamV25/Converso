import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "@/app/globals.css"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

// Soft, slightly wonky old-style serif for headlines — the "old school" voice
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});


export const metadata: Metadata = {
  title: "Converso — Learn out loud",
  description: "Real-time AI voice tutors for every subject.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${fraunces.variable}`}>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#3fe0b0",
            colorTextOnPrimaryBackground: "#1b1813",
            colorBackground: "#221f19",
            colorInputBackground: "#2a261f",
            colorInputText: "#f2eadb",
            colorText: "#f2eadb",
            colorTextSecondary: "#aba291",
            borderRadius: "0.9rem",
            fontFamily: "var(--font-bricolage)",
          },
        }}
      >
        <body className="flex min-h-dvh flex-col">
          <Navbar/>
          <div className="flex-1">{children}</div>
          <Footer/>
        </body>
      </ClerkProvider>
    </html>
  );
}
