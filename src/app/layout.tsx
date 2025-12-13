import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import ClientAnalytics from './components/ClientAnalytics'
import Footer from "./components/Footer";
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

const GA_ID = 'G-DC0NHJ9DBR';
const AW_ID = 'AW-17747465413';

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
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_ID}', { send_page_view: false });
            gtag('config', '${AW_ID}', { send_page_view: false });
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
        
        <main className="min-h-screen flex flex-col">
          <div className="flex-grow">
            {children}
          </div>

          {/* Footer global */}
          <Footer />
        </main>
        {/* Vercel Analytics - cliente */}
        <ClientAnalytics />
      </body>
    </html>
  )
}