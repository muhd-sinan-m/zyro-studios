import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import PublicLayout from "@/components/navigation/PublicLayout";
import { constructMetadata, getRootSchemaGraph, SITE_CONFIG } from "@/lib/seo";

export const viewport: Viewport = {
  themeColor: "#030712",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootSchema = getRootSchemaGraph();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
        />
      </head>
      <body className="bg-bg text-zyro-white antialiased" suppressHydrationWarning>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${SITE_CONFIG.googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${SITE_CONFIG.googleAnalyticsId}');
          `}
        </Script>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
