// app/page.tsx
'use client'

import Link from 'next/link'
import Image from "next/image";
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, MapPin, Clock, Shield, Users, ArrowRight, ExternalLink, WalletCards, BadgeDollarSign, Archive, Store, ChevronRight, ChevronLeft } from 'lucide-react'

export default function Home() {

  return (
    <>
    <Head>
      <title>AndesGO - Compra en Chile desde el extranjero fácilmente</title>
      <meta name="description" 
      content="AndesGO facilita tus compras en Chile desde cualquier país. Recogemos tus pedidos, hacemos el shopping online por ti, almacenamos tus compras y ofrecemos pago en cuotas. ¡Compra en Chile sin complicaciones!" />
    </Head>
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {/* <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div> */}
              <div >
                  <Image
                    src="/andes_logo.png" // pon aquí tu logo (ej: public/logo.png)
                    alt="AndesGO Logo"
                    width={52}
                    height={60}
                    className="rounded-lg" // o "rounded-lg" si lo quieres redondeado
                  />
                </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                AndesGO
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#servicios" className="text-gray-700 hover:text-blue-600 transition-colors">Servicios</a>
              <a href="#como-funciona" className="text-gray-700 hover:text-blue-600 transition-colors">Cómo Funciona</a>
              <a href="#contacto" className="text-gray-700 hover:text-blue-600 transition-colors">Contacto</a>
              <Link href="/solicitar" className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                Solicitar Ahora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                Servicio Premium de Shopping Personal
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Compramos por ti en
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent"> Chile</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                El servicio de picking más confiable para extranjeros. Nosotros compramos tus productos favoritos 
                y los tenemos listos para cuando llegues al país.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/solicitar" className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center group">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all">
                  Ver Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl p-8 transform rotate-3 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 text-gray-800 -rotate-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <ShoppingBag className="h-8 w-8 text-blue-600 mb-2" />
                      <p className="font-semibold text-gray-800">1,500+</p>
                      <p className="text-sm text-gray-600">Productos Comprados</p>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <Users className="h-8 w-8 text-emerald-600 mb-2" />
                      <p className="font-semibold">200+</p>
                      <p className="text-sm text-gray-600">Clientes Satisfechos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir AndesGO?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos un servicio completo y confiable para que puedas obtener cualquier producto chileno sin complicaciones.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Truck className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Logística Completa</h3>
              <p className="text-gray-600 leading-relaxed">
                Nos encargamos de toda la gestión: desde la compra hasta la entrega en nuestras oficinas o tu hotel.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-emerald-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Múltiples Tiendas</h3>
              <p className="text-gray-600 leading-relaxed">
                Compramos en cualquier tienda online chilena. Una sola solicitud, múltiples productos.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Seguro</h3>
              <p className="text-gray-600 leading-relaxed">
                Protección completa de tu compra. Si algo sale mal, nos hacemos responsables.
              </p>
            </div> 

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <WalletCards className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Paga en Cuotas</h3>
              <p className="text-gray-600 leading-relaxed">
                Facilidades de pago para que puedas adquirir lo que necesitas sin preocupaciones.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-emerald-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <BadgeDollarSign className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Aprovecha Ofertas</h3>
              <p className="text-gray-600 leading-relaxed">
                Mantente atento a las promociones del retail CyberDay BlackFriday.
              </p>
            </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="bg-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Archive className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bodega Segura</h3>
              <p className="text-gray-600 leading-relaxed">
                Cambio de planes, no te preocupes, almacenamos tus productos por largos periodos sin costo extra.
              </p>
            </div>
            
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="como-funciona" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Cómo Funciona?</h2>
            <p className="text-xl text-gray-600">Simple, rápido y sin complicaciones</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Envía tu Lista</h3>
              <p className="text-gray-600">
                Completa nuestro formulario con los links de los productos que quieres comprar.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmamos y Compramos</h3>
              <p className="text-gray-600">
                Verificamos precios y disponibilidad, luego procedemos con la compra.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Preparamos tu Pedido</h3>
              <p className="text-gray-600">
                Recibimos y preparamos cuidadosamente todos tus productos.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Retira o Recibe</h3>
              <p className="text-gray-600">
                Retira en nuestras oficinas o recibe en tu hotel cuando llegues a Chile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para empezar tu experiencia AndesGO?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a cientos de extranjeros que ya confían en nosotros para sus compras en Chile.
          </p>
          <Link href="/solicitar" className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all inline-flex items-center group">
            Crear mi Primera Solicitud
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {/* <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div> */}
                <div >
                  <Image
                    src="/andes_logo.png" // pon aquí tu logo (ej: public/logo.png)
                    alt="AndesGO Logo"
                    width={60}
                    height={60}
                    className="rounded-lg" // o "rounded-lg" si lo quieres redondeado
                  />
                </div>
                <span className="text-2xl font-bold">AndesGO</span>
              </div>
              <p className="text-gray-400">
                Tu servicio de picking personal en Chile.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Personal Shopping</li>
                <li>Logística Completa</li>
                <li>Entrega en Hotel</li>
                <li>Retiro en Oficina</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Soporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Centro de Ayuda</li>
                <li>Política de Devoluciones</li>
                <li>Términos y Condiciones</li>
                <li>Privacidad</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contacto@andesgo.com</li>
                <li>+56 9 XXXX XXXX</li>
                <li>Santiago, Chile</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AndesGO. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
