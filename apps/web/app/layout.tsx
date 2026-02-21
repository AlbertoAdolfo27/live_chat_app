import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Header from "@/shared/components/header"
import "./globals.css"
import { LoggedUserProvider } from "@/modules/auth/auth.context"
import { SocketProvider } from "@/lib/socket/socket.context"
import { getLoggedUser } from "@/modules/auth/auth.service"
import { Suspense } from "react"
import Loading from "@/shared/components/loading"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat App",
  description: "Web App of real-time chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <Suspense fallback={<Loading />}>
          <LoggedUserProvider>
            <SocketProvider>
              <Header />
              {children}
            </SocketProvider>
          </LoggedUserProvider>
        </Suspense>
      </body>
    </html>
  );
}
