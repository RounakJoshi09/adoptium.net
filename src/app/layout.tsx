import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@fortawesome/fontawesome-free/css/v4-shims.min.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import Script from 'next/script'
import { getLocale } from 'next-intl/server'
import { Organization, WithContext } from 'schema-dts'
import { sanitizeObject } from '@/utils/sanitize'

const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Eclipse Adoptium',
  url: 'https://adoptium.net',
  logo: {
    '@type': 'ImageObject',
    url: 'https://adoptium.net/images/adoptium-icon.png',
  }
}

const sanitizedOrganizationSchema = sanitizeObject(organizationSchema);

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://adoptium.net'),
  title: {
    default: 'Home | Adoptium',
    template: '%s | Adoptium'
  },
  description: 'Eclipse Adoptium provides prebuilt OpenJDK binaries from a fully open source set of build scripts and infrastructure.',
  authors: [{ name: 'Eclipse Adoptium' }],
  keywords: ['adoptium', 'openjdk', 'java', 'jdk', 'eclipse', 'temurin'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://adoptium.net',
    siteName: 'Adoptium',
    title: 'Adoptium',
    description: 'Eclipse Adoptium provides prebuilt OpenJDK binaries from a fully open source set of build scripts and infrastructure.',
    images: [
      {
        url: '/images/social-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Adoptium Social Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Adoptium',
    creator: '@Adoptium',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/images/favicon-32x32.png',
    apple: '/images/adoptium-icon.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get locale dynamically - this will work for both the root path (/)
  // and localized paths (/[locale])
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <head>
        <link rel="sitemap" type="application/xml" href="/sitemap.xml"></link>
        <link rel="alternate" type="application/rss+xml" title="Adoptium Blog" href="/rss.xml"></link>
        {/* Eclipse Foundation Cookie Consent Banner */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link
          rel="stylesheet"
          type="text/css"
          href="//www.eclipse.org/eclipse.org-common/themes/solstice/public/stylesheets/vendor/cookieconsent/cookieconsent.min.css"
        />
        <Script
          src="//www.eclipse.org/eclipse.org-common/themes/solstice/public/javascript/vendor/cookieconsent/default.min.js"
          strategy="beforeInteractive"
        />
        {/* End of Eclipse Foundation Cookie Consent Banner */}

        {/* Google Tag Manager gated by cookie consent */}
        {/* Consent Mode defaults (denied) before any scripts */}
        <Script src="/scripts/consent-defaults.js" strategy="beforeInteractive" />
        {/* GTM gated load + event-driven revoke handling */}
        <Script
          src="/scripts/consent-gtm-gate.js"
          strategy="afterInteractive"
          data-gtm-id={process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-5WLCZXC'}
        />
      </head>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(sanitizedOrganizationSchema),
          }}
        />
        {children}
      </body>
    </html>
  )
}
