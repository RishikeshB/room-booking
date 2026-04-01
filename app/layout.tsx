import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "Room Booking HQ",
  description: "Room booking and allocation management platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <div className="app-shell">{children}</div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

