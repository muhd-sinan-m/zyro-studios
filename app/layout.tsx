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
        <meta name="google-site-verification" content={SITE_CONFIG.googleVerification} />
        <meta name="rating" content="general" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="application-name" content={SITE_CONFIG.name} />
        <meta name="apple-mobile-web-app-title" content={SITE_CONFIG.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="Global Freelance Engineering" />
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
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
