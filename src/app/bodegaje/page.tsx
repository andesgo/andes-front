'use client';

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, User, Phone, CreditCard, MapPin, Shield, CheckCircle } from 'lucide-react'

// Componente que maneja los search params
function BodegajeForm() {
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')

  // Estados del formulario
  const [formData, setFormData] = useState({
    planTipo: planId || '1', // Plan por defecto
    nombre: '',
    apellido: '',
    telefono: '',
    documento: '',
    tipoDocumento: 'dni',
    fechaIngreso: '',
    fechaRetiro: '',
    horas: 1
  })

  const [total, setTotal] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const planes = [
    { id: '0', nombre: 'Por hora', precio: 1000, color: 'purple' },
    { id: '1', nombre: 'Por día', precio: 5000, color: 'blue' },
    { id: '2', nombre: 'Por semana', precio: 28000, color: 'emerald' }
  ]

  const colorClasses: Record<string, string> = {
    purple: 'border-purple-500 bg-purple-50 text-purple-700',
    blue: 'border-blue-500 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  };

  // Solo actualizar planTipo al cargar inicialmente desde el searchParam
  useEffect(() => {
    if (planId) {
      setFormData(prev => ({
        ...prev,
        planTipo: planId
      }))
    }
  }, [planId]) // Solo cuando planId cambie, no cuando formData.planTipo cambie

  // Función para calcular el total
  const calcularTotal = useCallback(() => {
    const planSeleccionado = planes.find(p => p.id === formData.planTipo)
    if (!planSeleccionado) return 0

    if (formData.planTipo === '0') {
      // Por hora: máximo $5,000
      return Math.min(formData.horas * planSeleccionado.precio, 5000)
    } else if (formData.planTipo === '1') {
      // Por día: $5,000 por día, descuento 20% si >= 7 días
      if (!formData.fechaIngreso || !formData.fechaRetiro) return 0
      
      const fechaInicio = new Date(formData.fechaIngreso)
      const fechaFin = new Date(formData.fechaRetiro)
      const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime()
      const dias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24))
      
      if (dias < 1) return 0
      
      const subtotal = dias * planSeleccionado.precio
      return dias >= 7 ? subtotal * 0.8 : subtotal // 20% descuento si >= 7 días
    } else if (formData.planTipo === '2') {
      // Por semana (28,000 CLP por semana, proporcional en días adicionales)
      if (!formData.fechaIngreso || !formData.fechaRetiro) return 0;

      const fechaInicio = new Date(formData.fechaIngreso);
      const fechaFin = new Date(formData.fechaRetiro);
      const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime();
      const dias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));

      if (dias < 1) return 0;

      if (dias <= 7) return planSeleccionado.precio; // Precio fijo por semana si es hasta 7 días

      const precioSemana = planSeleccionado.precio; // 28,000
      const semanasCompletas = Math.floor(dias / 7);
      const diasRestantes = dias % 7;

      return (semanasCompletas * precioSemana) + (diasRestantes * (precioSemana / 7));
    }

    return 0;
  }, [formData, planes]);

  useEffect(() => {
    setTotal(calcularTotal())
  }, [calcularTotal, formData.planTipo, formData.fechaIngreso, formData.fechaRetiro, formData.horas])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bodegaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          total
        }),
      })

      if (response.ok) {
        setShowConfirmation(true)
      } else {
        alert('Error al procesar la solicitud')
      }
    } catch (error) {
      alert('Error de conexión')
    } finally {
      setIsSubmitting(false)
    }
  }

  const planSeleccionado = planes.find(p => p.id === formData.planTipo)

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Solicitud Recibida!</h2>
          <p className="text-gray-600 mb-6">
            Hemos recibido tu solicitud de bodegaje. Te contactaremos pronto para coordinar los detalles.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">Total a pagar:</p>
            <p className="text-2xl font-bold text-emerald-600">${total.toLocaleString()} CLP</p>
          </div>
          <Link href="/" className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
            Volver al Inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-gray-600">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Reserva tu Espacio</h2>
              <p className="text-gray-600">Completa los datos para tu servicio de bodegaje seguro</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selección de Plan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tipo de Plan
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {planes.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => handleInputChange('planTipo', plan.id)}
                      className={`p-4 border-2 rounded-xl text-center transition-all ${
                        formData.planTipo === plan.id
                          ? colorClasses[plan.color]
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold">{plan.nombre}</div>
                      <div className="text-sm text-gray-600">${plan.precio.toLocaleString()}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Datos Personales */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono de Contacto *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Documento de Identidad *
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={formData.tipoDocumento}
                      onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="dni">DNI</option>
                      <option value="passport">Pasaporte</option>
                    </select>
                    <div className="relative flex-1">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.documento}
                        onChange={(e) => handleInputChange('documento', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Número de documento"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fechas y Horas */}
              {formData.planTipo === '0' ? (
                // Plan por hora
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha del Servicio *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.fechaIngreso}
                        onChange={(e) => handleInputChange('fechaIngreso', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cantidad de Horas *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <select
                        value={formData.horas}
                        onChange={(e) => handleInputChange('horas', parseInt(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1,2,3,4,5].map(h => (
                          <option key={h} value={h}>{h} hora{h > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                // Plan por día/semana
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de Ingreso *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.fechaIngreso}
                        onChange={(e) => handleInputChange('fechaIngreso', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de Retiro *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.fechaRetiro}
                        onChange={(e) => handleInputChange('fechaRetiro', e.target.value)}
                        min={formData.fechaIngreso || new Date().toISOString().split('T')[0]}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Botón Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-4 px-8 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
              </button>
            </form>
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6 text-gray-600">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen de tu Reserva</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan seleccionado:</span>
                <span className="font-semibold">{planSeleccionado?.nombre}</span>
              </div>
              
              {formData.planTipo === '0' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Horas:</span>
                  <span className="font-semibold">{formData.horas}h</span>
                </div>
              )}
              
              {formData.planTipo === '1' && formData.fechaIngreso && formData.fechaRetiro && (
                <div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Días:</span>
                    <span className="font-semibold">
                      {Math.ceil((new Date(formData.fechaRetiro).getTime() - new Date(formData.fechaIngreso).getTime()) / (1000 * 3600 * 24))}
                    </span>
                  </div>
                  {Math.ceil((new Date(formData.fechaRetiro).getTime() - new Date(formData.fechaIngreso).getTime()) / (1000 * 3600 * 24)) >= 7 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Descuento (20%):</span>
                      <span>-${(calcularTotal() / 0.8 * 0.2).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-blue-600">${total.toLocaleString()} CLP</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-4 w-4 mr-2 text-emerald-500" />
                Custodia 100% segura
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                Ubicación central en Santiago
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-emerald-500" />
                Acceso flexible
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de loading mientras se cargan los search params
function FormSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-6">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal de la página
export default function BodegajePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <Image
                src="/andes_logo.png"
                alt="AndesGO Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                AndesGO
              </span>
            </Link>
            <div className="text-right">
              <h1 className="text-lg font-semibold text-gray-900">Servicio de Bodegaje</h1>
              <p className="text-sm text-gray-600">Configura tu reserva</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal con Suspense */}
      <Suspense fallback={<FormSkeleton />}>
        <BodegajeForm />
      </Suspense>

     
    </div>
  )
}