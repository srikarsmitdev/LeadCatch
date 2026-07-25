import type { Metadata } from "next";
import { Providers } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "LeadFlow — Premium Lead Capture Platform",
  description:
    "Convert more visitors into qualified leads with our beautifully crafted lead capture platform. Smart forms, instant analytics, and seamless CRM integration.",
  keywords: ["lead capture", "CRM", "SaaS", "lead generation", "analytics"],
  openGraph: {
    title: "LeadFlow — Premium Lead Capture Platform",
    description:
      "Convert more visitors into qualified leads with our beautifully crafted lead capture platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
