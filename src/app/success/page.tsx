import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Home, FileText, Mail, MessageCircle, ArrowRight, Shield, Clock, Headphones } from 'lucide-react'

export default function SuccessPage() {
  const whatsappNumber =  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56982876757" 
  const whatsappMessage = encodeURIComponent("Hola! Acabo de enviar una solicitud me podrían informar por WhatsApp.")
  const contactEmail = process.env.NEXT_PUBLIC_EMAIL_SUPPORT

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header simple */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/andes_logo.png"
              alt="AndesGO Logo"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              AndesGO
            </span>
          </Link>
        </div>
      </header>

      {/* Success Content */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-emerald-600 w-24 h-24 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-14 w-14 text-white" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                ¡Solicitud Enviada con Éxito!
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Hemos recibido tu solicitud correctamente. Nuestro equipo la revisará y te contactaremos pronto con los detalles de tu compra.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>

            {/* What happens next */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                ¿Qué sigue ahora?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">1. Revisión</h3>
                  <p className="text-gray-600 text-sm">
                    Analizamos tu solicitud en las próximas 2-4 horas hábiles.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl">
                  <div className="bg-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">2. Confirmación</h3>
                  <p className="text-gray-600 text-sm">
                    Te enviamos un email con cotización y detalles de pago.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl">
                  <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">3. Compra</h3>
                  <p className="text-gray-600 text-sm">
                    Realizamos tu compra y la tenemos lista para ti.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                href="/"
                className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center group"
              >
                <Home className="mr-2 h-5 w-5" />
                Volver al Inicio
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/solicitar"
                className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center group"
              >
                <FileText className="mr-2 h-5 w-5" />
                Nueva Solicitud
              </Link>
            </div>

            {/* Contact Options */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-center mb-4">
                <Headphones className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">
                  ¿Necesitas ayuda inmediata?
                </h3>
              </div>
              <p className="text-center text-gray-600 mb-6">
                Estamos aquí para ayudarte. Contáctanos por tu medio preferido:
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-all flex items-center justify-center group"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Escribir por WhatsApp
                </a>
                
                <a
                  href={`mailto:${contactEmail}`}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-all flex items-center justify-center group"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Enviar Email
                </a>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2-4h</div>
              <p className="text-gray-600 text-sm">Tiempo de respuesta promedio</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
              <p className="text-gray-600 text-sm">Solicitudes completadas</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <p className="text-gray-600 text-sm">Satisfacción de clientes</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer simplificado */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image
              src="/andes_logo.png"
              alt="AndesGO Logo"
              width={50}
              height={50}
              className="rounded-lg"
            />
            <span className="text-2xl font-bold">AndesGO</span>
          </div>
          <p className="text-gray-400 mb-4">
            Tu servicio de picking personal en Chile.
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 AndesGO. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}