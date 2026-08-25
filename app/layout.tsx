import type { Metadata } from "next";
import "./globals.css";
import PublicLayout from "@/components/navigation/PublicLayout";

export const metadata: Metadata = {
  title: {
    default: "Zyro Studios | High-Performance Engineering & Digital Products",
    template: "%s | Zyro Studios",
  },
  description:
    "Zyro Studios designs, engineers, and deploys high-performance web applications, enterprise software, and scalable digital systems.",
  keywords: [
    "web development",
    "systems engineering",
    "Next.js",
    "React",
    "digital agency",
    "educational platforms",
    "custom web applications",
    "full stack development",
  ],
  authors: [{ name: "Zyro Studios" }],
  creator: "Zyro Studios",
  publisher: "Zyro Studios",
  metadataBase: new URL("https://zyrostudios.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://zyrostudios.vercel.app",
    siteName: "Zyro Studios",
    title: "Zyro Studios | High-Performance Engineering & Digital Products",
    description:
      "Zyro Studios designs, engineers, and deploys high-performance web applications, enterprise software, and scalable digital systems.",
    images: [
      {
        url: "/logo/zyro-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Zyro Studios — We Build. You Grow.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zyro Studios | High-Performance Engineering & Digital Products",
    description:
      "Zyro Studios designs, engineers, and deploys high-performance web applications, enterprise software, and scalable digital systems.",
    images: ["/logo/zyro-logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "android-chrome-192x192", url: "/favicon/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/favicon/android-chrome-512x512.png" },
    ],
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://zyrostudios.vercel.app/#organization",
      name: "Zyro Studios",
      url: "https://zyrostudios.vercel.app",
      logo: {
        "@type": "ImageObject",
        url: "https://zyrostudios.vercel.app/logo/zyro-logo.jpg",
      },
      description:
        "Zyro Studios is a development-focused creative studio building modern websites and digital products for businesses, organizations, and individuals.",
      slogan: "We Build. You Grow.",
      foundingDate: "2025",
      areaServed: "Worldwide",
      serviceType: [
        "Web Development",
        "E-Commerce Development",
        "Educational Platform Development",
        "Custom Web Applications",
        "Landing Pages",
        "Portfolio Websites",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://zyrostudios.vercel.app/#website",
      url: "https://zyrostudios.vercel.app",
      name: "Zyro Studios",
      publisher: { "@id": "https://zyrostudios.vercel.app/#organization" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-bg text-zyro-white antialiased" suppressHydrationWarning>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
