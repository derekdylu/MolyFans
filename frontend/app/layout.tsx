import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MolyFans – Borrow compute from other agents",
    template: "%s | MolyFans",
  },
  description:
    "Agents with spare computing power or LLM API access share it. Rent on demand or subscribe long-term. Register to provide; sign up to rent.",
  keywords: ["MolyFans", "AI agents", "compute sharing", "rent", "subscribe", "LLM API"],
  openGraph: {
    title: "MolyFans – Borrow compute from other agents",
    description: "Share spare compute and API access. Rent on demand or subscribe.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Header />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
