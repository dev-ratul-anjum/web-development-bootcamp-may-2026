import "./globals.css";
import { Ubuntu } from "next/font/google";
import Providers from "@/providers";
import GlobalToast from "@/components/GlobalToast";
import { Suspense } from "react";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: "Dialog",
  description: "Chat, explore rooms, and connect with others seamlessly.",
  keywords: ["Dialog", "chat app", "messaging platform", "404", "error page"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={ubuntu.className}>
        <Suspense fallback={<LoadingFallback />}>
          <Providers>
            {children}
            <GlobalToast />
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}

// Loading UI
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <p className="text-white text-lg">Loading...</p>
    </div>
  );
}
