import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { ThreeBackground } from "@/components/ui/three-background";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "C S SHARVAN SAI — Creative Developer & Computer Science Engineer",
  description:
    "Production portfolio of C S Sharvan Sai (B.Tech CSE at SRM IST). Engineering interactive web games, algorithmic systems, AV route planning labs, dynamic SaaS platforms, and fluid 3D architectures.",
  keywords: [
    "Sharvan Sai",
    "Creative Developer",
    "Computer Science Engineer",
    "SRM IST",
    "Tech Gaming Hub",
    "Sai Games Online",
    "AV Route Planner",
    "NEXORA",
    "Three.js",
    "Next.js",
    "SVG Mask Effect",
  ],
  authors: [{ name: "C S Sharvan Sai" }],
  openGraph: {
    title: "C S SHARVAN SAI — Creative Developer Portfolio",
    description:
      "Interactive 3D simulations, 20+ web game portal, A* pathfinding visualizer, and full-stack SaaS engineering.",
    url: "https://cssharvansai-portfolio.netlify.app",
    siteName: "SHARVAN Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050507] text-slate-100 antialiased selection:bg-purple-500/30 selection:text-white">
        <ThemeProvider>
          <CustomCursor />
          <ThreeBackground />
          <Navbar />
          <main className="relative min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
