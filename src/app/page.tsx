// app/page.tsx
'use client'

import Link from 'next/link'
import Image from "next/image";
import Head from 'next/head';
import { getTiendas } from "@/lib/tiendas";
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, MapPin, Clock, Shield, Users, ArrowRight, ExternalLink, WalletCards, BadgeDollarSign, Archive, Store, ChevronRight, ChevronLeft, MessageCircle, Luggage, Calendar, Star, Quote } from 'lucide-react'

export default function Home() {
  // Componente TiendasSection completo
  const TiendasSection = () => {

    const tiendas = getTiendas(12)
    
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [itemsPerView, setItemsPerView] = useState(4);

    // Responsive items per view
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 640) {
          setItemsPerView(1);
        } else if (window.innerWidth < 768) {
          setItemsPerView(2);
        } else if (window.innerWidth < 1024) {
          setItemsPerView(3);
        } else {
          setItemsPerView(4);
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto-scroll effect
    useEffect(() => {
      if (!isAutoPlaying) return;

      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = tiendas.length - itemsPerView;
          if (prevIndex >= maxIndex) {
            return 0; // Volver al inicio
          }
          return prevIndex + 1;
        });
      }, 3000);

      return () => clearInterval(interval);
    }, [isAutoPlaying, itemsPerView, tiendas.length]);

    const nextSlide = () => {
      const maxIndex = tiendas.length - itemsPerView;
      setCurrentIndex((prevIndex) => {
        if (prevIndex >= maxIndex) {
          return 0; // Volver al inicio
        }
        return prevIndex + 1;
      });
    };

    const prevSlide = () => {
      const maxIndex = tiendas.length - itemsPerView;
      setCurrentIndex((prevIndex) => {
        if (prevIndex <= 0) {
          return maxIndex; // Ir al final
        }
        return prevIndex - 1;
      });
    };

    return (
      <section id="donde-comprar" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Dónde Comprar?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Encuentra los mejores productos en las tiendas más populares de Chile. Compramos en cualquier tienda online por ti.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-semibold">
              <Store className="w-5 h-5 mr-2" />
              Ver Todas las Tiendas
            </button>
          </div>

          {/* Carousel Container */}
          <div 
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Tienda anterior"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Siguiente tienda"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Carousel */}
            <div className="overflow-hidden px-12">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                }}
              >
                {tiendas.map((tienda) => (
                  <div
                    key={tienda.id}
                    className="flex-shrink-0 px-4"
                    style={{ width: `${100 / itemsPerView}%` }}
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                      <div className="p-6">
                        {/* Logo placeholder */}
                        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 mb-6 flex items-center justify-center h-32">
                          <div className="text-blue-600 font-bold text-2xl">
                            {tienda.nombre.charAt(0)}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">{tienda.nombre}</h3>
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              {tienda.categoria}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                            {tienda.descripcion}
                          </p>
                          
                          <a
                            href={tienda.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-sm group-hover:translate-x-1 transition-all"
                          >
                            Visitar Tienda
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: tiendas.length - itemsPerView + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir a página ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Tiendas Disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
              <div className="text-gray-600">Compras Disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Compras Seguras</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">48h</div>
              <div className="text-gray-600">Tiempo de Procesamiento</div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Componente Sección de Bodegaje
  const BodegajeSection = () => {
    const planes = [
      {
        id: 0,
        tipo: "Por hora",
        precio: "$1.000",
        periodo: "CLP por hora",
        descripcion: "Para estadías express",
        caracteristicas: [
          "Custodia segura 24/7",
          "Acceso durante horario comercial",
          "Sin límite de peso por maleta"
        ],
        popular: false,
        color: "purple"
      },
      {
        id: 1,
        tipo: "Por Día",
        precio: "$5.000",
        periodo: "CLP por día",
        descripcion: "Ideal para estadías cortas",
        caracteristicas: [
          "Custodia segura 24/7",
          "Acceso durante horario comercial",
          "Sin límite de peso por maleta"
        ],
        popular: true,
        color: "blue"
      },
      {
        id: 2,
        tipo: "Por Semana",
        precio: "$28.000",
        periodo: "CLP por semana",
        descripcion: "Perfecto para viajes extendidos",
        caracteristicas: [
          "Custodia segura 24/7",
          "Acceso flexible",
          "Descuento del 20%"
        ],
        popular: false,
        color: "emerald"
      },
    ];

    return (
      <section id="bodegaje" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Luggage className="w-4 h-4 mr-2" />
              Servicio de Bodegaje
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Guarda tu Equipaje de Forma Segura</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              No te preocupes por cargar tus maletas mientras exploras Chile. Ofrecemos custodia segura 
              con planes flexibles para todos los tipos de viaje.
            </p>
          </div>

          {/* Beneficios del servicio */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">100% Seguro</h3>
              <p className="text-gray-600 text-sm">Instalaciones con seguridad 24/7 y seguro incluido</p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Ubicación Central</h3>
              <p className="text-gray-600 text-sm">En el corazón de Santiago, fácil acceso</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Horarios Flexibles</h3>
              <p className="text-gray-600 text-sm">Recoge y entrega según tu itinerario</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sin Complicaciones</h3>
              <p className="text-gray-600 text-sm">Proceso simple y rápido de almacenamiento</p>
            </div>
          </div>

          {/* Planes de precio */}
          <div className="grid md:grid-cols-3 gap-8 mb-12 justify-items-center">
            {planes.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  plan.popular ? 'ring-2 ring-emerald-500' : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.tipo}</h3>
                    <p className="text-gray-600 mb-4">{plan.descripcion}</p>
                    <div className="mb-6">
                      <span className={`text-4xl font-bold text-${plan.color}-600`}>{plan.precio}</span>
                      <span className="text-gray-500 ml-2">{plan.periodo}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-center">
                        <div className={`bg-${plan.color}-100 w-5 h-5 rounded-full flex items-center justify-center mr-3`}>
                          <div className={`w-2 h-2 bg-${plan.color}-600 rounded-full`}></div>
                        </div>
                        <span className="text-gray-700">{caracteristica}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/bodegaje?plan=${plan.id}`}
                    className={`block w-full py-3 px-6 rounded-full font-semibold text-center transition-all ${
                      plan.popular
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600'
                    }`}
                  >
                    Seleccionar Plan
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Componente Sección de Reseñas
  const ReseñasSection = () => {
    const [currentReview, setCurrentReview] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const reseñas = [
      {
        id: 1,
        nombre: "María González",
        pais: "Colombia",
        rating: 5,
        comentario: "Increíble servicio! Necesitaba comprar vinos chilenos y AndesGO me hizo todo súper fácil. El equipo fue muy profesional y mis compras llegaron perfectas.",
        producto: "Vinos chilenos",
        fecha: "Enero 2025"
      },
      {
        id: 2,
        nombre: "Carlos Mendoza",
        pais: "Perú",
        rating: 5,
        comentario: "Excelente experiencia con el servicio de bodegaje. Luego de hacer varias compras por mi parada en Santiago pude dejarlas seguras mientras fui a recorrer las Torres del Paine por una semana, personal muy amable.",
        producto: "Servicio de bodegaje - 1 semana",
        fecha: "Diciembre 2024"
      },
      {
        id: 3,
        nombre: "Ana Rodríguez",
        pais: "Argentina",
        rating: 5,
        comentario: "Súper recomendado! Compré regalos para toda mi familia y el proceso fue muy transparente. Me mantuvieron informada en todo momento.",
        producto: "Compras navideñas múltiples tiendas",
        fecha: "Diciembre 2024"
      },
      {
        id: 4,
        nombre: "João Silva",
        pais: "Brasil",
        rating: 4,
        comentario: "Muy buen servicio. La única sugerencia sería tener más opciones de pago internacional, pero fuera de eso, todo perfecto.",
        producto: "Electrónicos y tecnología",
        fecha: "Noviembre 2024"
      },
      {
        id: 5,
        nombre: "Luis Herrera",
        pais: "Ecuador",
        rating: 5,
        comentario: "No puedo estar más satisfecho. Necesitaba productos muy específicos para mi negocio y ellos se encargaron de todo. Definitivamente volveré a usar el servicio.",
        producto: "Productos industriales especializados",
        fecha: "Enero 2025"
      }
    ];

    useEffect(() => {
      if (!isAutoPlaying) return;

      const interval = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % reseñas.length);
      }, 5000);

      return () => clearInterval(interval);
    }, [isAutoPlaying, reseñas.length]);

    const nextReview = () => {
      setCurrentReview((prev) => (prev + 1) % reseñas.length);
    };

    const prevReview = () => {
      setCurrentReview((prev) => (prev - 1 + reseñas.length) % reseñas.length);
    };

    const renderStars = (rating: number) => {
      return [...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 ${
            index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ));
    };

    return (
      <section id="reseñas" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Testimonios de Clientes
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que Dicen Nuestros Clientes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Miles de viajeros han confiado en AndesGO para sus compras y bodegaje en Chile.
            </p>
          </div>

          {/* Carrusel de reseñas */}
          <div 
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Navigation Buttons */}
            <button
              onClick={prevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 -ml-6"
              aria-label="Reseña anterior"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            
            <button
              onClick={nextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 -mr-6"
              aria-label="Siguiente reseña"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>

            {/* Reseña actual */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 transform transition-all duration-500">
              <div className="text-center">
                <Quote className="w-12 h-12 text-blue-200 mx-auto mb-6" />
                
                <div className="flex justify-center mb-4">
                  {renderStars(reseñas[currentReview].rating)}
                </div>

                <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 italic">
                  {reseñas[currentReview].comentario}
                </blockquote>

                <div className="border-t border-gray-200 pt-6">
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-900">
                      {reseñas[currentReview].nombre}
                    </h4>
                    <p className="text-gray-600 mb-2">
                      {reseñas[currentReview].pais}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">
                      {reseñas[currentReview].producto}
                    </p>
                    <p className="text-xs text-gray-400">
                      {reseñas[currentReview].fecha}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {reseñas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentReview 
                      ? 'bg-blue-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir a reseña ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Stats de reseñas */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-500 mb-2">4.9/5</div>
              <div className="text-gray-600">Rating Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Reseñas Verificadas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfacción Cliente</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
              <div className="text-gray-600">Países Atendidos</div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Componente Botón Flotante de WhatsApp
  const WhatsAppButton = () => {
    const whatsappNumber = "56982876757"; 
    const message = encodeURIComponent("¡Hola! Me interesa conocer más sobre los servicios de AndesGO");
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        
        {/* Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          ¡Chatea con nosotros!
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
      </a>
    );
  };

  return (
    <>
    <Head>
      <title>AndesGO - Compra en Chile desde el extranjero fácilmente</title>
      <meta name="description" 
      content="AndesGO facilita tus compras en Chile desde cualquier país. Recogemos tus pedidos, hacemos el shopping online por ti, almacenamos tus compras y ofrecemos pago en cuotas. ¡Compra en Chile sin complicaciones!" />
    </Head>
    
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div >
                  <Image
                    src="/andes_logo.png"
                    alt="AndesGO Logo"
                    width={52}
                    height={60}
                    className="rounded-lg"
                  />
                </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                AndesGO
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#servicios" className="text-gray-700 hover:text-blue-600 transition-colors">Servicios</a>
              <a href="#como-funciona" className="text-gray-700 hover:text-blue-600 transition-colors">Cómo Funciona</a>
              <a href="#bodegaje" className="text-gray-700 hover:text-blue-600 transition-colors">Bodegaje</a>
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
                El servicio de picking más confiable para extranjeros: compramos y recibimos tus compras para que estén listas a tu llegada.  
                Además, contamos con custodia segura de equipaje, con planes por día o por semana.
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
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Picking Premium
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Servicio de Shopping Personal</h2>
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

      {/* Donde comprar - USAR EL COMPONENTE AQUÍ */}
      <TiendasSection />

      {/* Nueva Sección de Bodegaje */}
      <BodegajeSection />

      {/* Nueva Sección de Reseñas */}
      <ReseñasSection />

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
                <div >
                  <Image
                    src="/andes_logo.png"
                    alt="AndesGO Logo"
                    width={60}
                    height={60}
                    className="rounded-lg"
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
                <li>andesgoshopping@gmail.com</li>
                <li>+56 9 8287 6757</li>
                <li>Santiago, Chile</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AndesGO. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}