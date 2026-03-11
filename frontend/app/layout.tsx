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
        <a
          href="https://www.godaddy.com/domainsearch/find?itc=am_GDCart_afternicfos&domainToCheck=molyfans.com"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-accent py-2 text-center text-sm font-medium text-black transition-colors hover:bg-accent-hover hover:text-white"
        >
          This domain (molyfans.com) is for sale — inquire at GoDaddy
        </a>
        <Header />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
