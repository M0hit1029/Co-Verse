import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { Inter } from "next/font/google";
import { ToastNotificationProvider } from "@/components/ToastNotificationProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Co-Verse - Collaborative Project Management",
  description: "Real-time collaborative project management with Kanban, Documents, and Activity Feed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-[#00ff88]/80`}>
        <div className="flex h-screen overflow-hidden bg-gradient-to-b from-[#0a0e0d] via-[#0f1716] to-[#0a0e0d]">
          <Sidebar />

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>

        <ToastNotificationProvider />
      </body>
    </html>
  );
}
