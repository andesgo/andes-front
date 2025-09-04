import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AndesGO - Compra en Chile desde el extranjero fácilmente',
  description: 'AndesGO facilita tus compras en Chile desde cualquier país. Recogemos tus pedidos, hacemos el shopping online por ti, almacenamos tus compras y ofrecemos pago en cuotas. ¡Compra en Chile sin complicaciones!',
  keywords: 'compras chile, shopping personal chile, picking chile, bodegaje chile, comprar desde extranjero',
  openGraph: {
    title: 'AndesGO - Shopping Personal en Chile',
    description: 'El servicio de picking más confiable para extranjeros en Chile',
    url: 'https://andesgo.cl',
    siteName: 'AndesGO',
    images: [
      {
        url: '/andes_logo.png',
        width: 800,
        height: 600,
      }
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AndesGO - Shopping Personal en Chile',
    description: 'El servicio de picking más confiable para extranjeros en Chile',
    images: ['/andes_logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Google Tag Manager - Va lo más arriba posible en el head */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
        >
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MPW85D72');
          `}
        </Script>

        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DC0NHJ9DBR"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DC0NHJ9DBR');
          `}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) - Va inmediatamente después de la apertura del body */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MPW85D72"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        {children}
      </body>
    </html>
  )
}