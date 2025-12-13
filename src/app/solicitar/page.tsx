'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Building2, Plane, Trash2, Send, ArrowLeft, Package, User, Mail, Phone, MapPin, Link as LinkIcon, Search } from 'lucide-react'

// TIPOS ACTUALIZADOS
type ArrivalTimeOption = 'tomorrow' | 'one_week' | 'not_sure' | 'specific_date'
type DeliveryMethod = 'pickup_santiago' | 'hotel_delivery' | 'pickup_buenosaires'

type ProductType = 'with_link' | 'search_request'

interface ProductWithLink {
  id: string
  type: 'with_link'
  url: string
  quantity: number
  nombre: string
  color: string
  size: string
  notes: string
}

interface ProductSearchRequest {
  id: string
  type: 'search_request'
  productType: string // ej: "Smartphone", "Laptop", "Ropa"
  brand: string
  model: string
  specifications: string // detalles adicionales
  quantity: number
}

type ProductItem = ProductWithLink | ProductSearchRequest

interface HotelDetails {
  region: string
  comuna: string
  address: string
  hotelName?: string
  roomNumber?: string
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  countryCode: string
  document: string
  arrivalTimeOption: ArrivalTimeOption
  arrivalDate: string // solo se usa si arrivalTimeOption === 'specific_date'
  deliveryMethod: DeliveryMethod
  hotelDetails: HotelDetails 
}

export default function SolicitarPage() {
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: '1',
      type: 'with_link',
      url: '',
      nombre: '',
      quantity: 1,
      color: '',
      size: '',
      notes: ''
    }
  ])

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    countryCode: '+54',
    document: '',
    arrivalTimeOption: 'one_week',
    arrivalDate: '',
    deliveryMethod: 'pickup_santiago',
    hotelDetails: {
      region: '',
      comuna: '',
      address: '',
      hotelName: '',
      roomNumber: ''
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const addProduct = (type: ProductType) => {
    const baseProduct = {
      id: Date.now().toString(),
      quantity: 1
    }

    const newProduct: ProductItem = type === 'with_link'
      ? { ...baseProduct, type: 'with_link', url: '', nombre: '', color: '', size: '', notes: '' }
      : { ...baseProduct, type: 'search_request', productType: '', brand: '', model: '', specifications: '' }

    setProducts([...products, newProduct])
  }

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id))
    }
  }

  const changeProductType = (id: string, newType: ProductType) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        // Crear nuevo producto del tipo solicitado manteniendo solo id y quantity
        const baseProduct = {
          id: product.id,
          quantity: product.quantity
        }
        
        return newType === 'with_link'
          ? { ...baseProduct, type: 'with_link', url: '', nombre: '', color: '', size: '', notes: '' }
          : { ...baseProduct, type: 'search_request', productType: '', brand: '', model: '', specifications: '' }
      }
      return product
    }))
  }

  const updateProduct = (id: string, field: string, value: string | number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ))
  }

  // const updateCustomerInfo = (field: keyof CustomerInfo, value: string | ArrivalTimeOption) => {
  //   setCustomerInfo(prev => ({ ...prev, [field]: value }))
  // }
  const updateCustomerInfo = (field: keyof CustomerInfo, value: any) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validación de productos
      const incompleteProducts = products.filter(product => {
        if (product.type === 'with_link') {
          return !product.url.trim()
        } else {
          return !product.productType.trim() || !product.brand.trim()
        }
      })

      if (incompleteProducts.length > 0) {
        alert('Por favor, completa todos los campos requeridos en todos los productos')
        setIsSubmitting(false)
        return
      }

      // Validar fecha de llegada si eligió fecha específica
      if (customerInfo.arrivalTimeOption === 'specific_date' && !customerInfo.arrivalDate) {
        alert('Por favor, selecciona una fecha de llegada')
        setIsSubmitting(false)
        return
      }

      const requestData = {
        customerInfo,
        products
      }

      console.log('Enviando datos:', requestData)

      const response = await fetch('/api/sendmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Respuesta inesperada del servidor. Content-Type: ${contentType}`)
      }

      let result
      try {
        result = await response.json()
      } catch (parseError) {
        console.error('Error al parsear JSON:', parseError)
        throw new Error('Error al procesar la respuesta del servidor')
      }

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar la cotización')
      }

      // Redirigir a página de éxito
      window.location.href = '/success'

    } catch (error) {
      setIsSubmitting(false)
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Error al enviar la cotización. Por favor, inténtalo de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">Volver</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div>
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
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Crear Nueva Solicitud</h1>
            <p className="text-xl text-gray-600">
              Completa el formulario con los productos que deseas comprar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Información Personal</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-gray-800">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => updateCustomerInfo('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => updateCustomerInfo('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <div className="flex">
                    <select
                      value={customerInfo.countryCode}
                      onChange={(e) => updateCustomerInfo('countryCode', e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="+54">🇦🇷 +54</option>
                      <option value="+55">🇧🇷 +55</option>
                      <option value="+56">🇨🇱 +56</option>
                      <option value="+57">🇨🇴 +57</option>
                      <option value="+51">🇵🇪 +51</option>
                      <option value='+591'>🇧🇴 +591</option>
                      <option value="+593">🇪🇨 +593</option>
                      <option value='+595'>🇵🇾 +595</option>
                      <option value="+598">🇺🇾 +598</option>
                      <option value="+58">🇻🇪 +58</option>
                      <option value="+52">🇲🇽 +52</option>
                      <option value='+509'>🇭🇳 +509</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+34">🇪🇸 +34</option>
                    </select>

                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="9 1234 5678"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RUT o Pasaporte
                  </label>
                  <input
                    type="text"
                    value={customerInfo.document}
                    onChange={(e) => updateCustomerInfo('document', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="12.345.678-9 o AB123456"
                  />
                </div>

                {/* NUEVA SECCIÓN: Cuándo llegas */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ¿Cuándo llegas a Chile? *
                  </label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => updateCustomerInfo('arrivalTimeOption', 'tomorrow')}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                        customerInfo.arrivalTimeOption === 'tomorrow'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      🚀 Mañana
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => updateCustomerInfo('arrivalTimeOption', 'one_week')}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                        customerInfo.arrivalTimeOption === 'one_week'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      📅 En una semana
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => updateCustomerInfo('arrivalTimeOption', 'not_sure')}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                        customerInfo.arrivalTimeOption === 'not_sure'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      🤔 Aún no lo sé
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => updateCustomerInfo('arrivalTimeOption', 'specific_date')}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                        customerInfo.arrivalTimeOption === 'specific_date'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      🗓️ Fecha específica
                    </button>
                  </div>

                  {/* Mostrar calendario solo si eligió fecha específica */}
                  {customerInfo.arrivalTimeOption === 'specific_date' && (
                    <div className="mt-4">
                      <input
                        type="date"
                        value={customerInfo.arrivalDate}
                        onChange={(e) => updateCustomerInfo('arrivalDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Method Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Método de Despacho</h2>
              </div>

              <div className="space-y-4">
                {/* Opciones de despacho */}
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Retiro en Santiago */}
                  <button
                    type="button"
                    onClick={() => {
                      updateCustomerInfo('deliveryMethod', 'pickup_santiago')
                      // Limpiar hotel details si cambia de método
                      updateCustomerInfo('hotelDetails', {
                        region: '',
                        comuna: '',
                        address: '',
                        hotelName: '',
                        roomNumber: ''
                      })
                    }}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      customerInfo.deliveryMethod === 'pickup_santiago'
                        ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Building2 className={`h-8 w-8 mb-3 ${
                        customerInfo.deliveryMethod === 'pickup_santiago' 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`} />
                      <div className={`font-semibold mb-1 ${
                        customerInfo.deliveryMethod === 'pickup_santiago'
                          ? 'text-blue-700'
                          : 'text-gray-700'
                      }`}>
                        Retiro en Santiago
                      </div>
                      <div className={`text-xs ${
                        customerInfo.deliveryMethod === 'pickup_santiago'
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      }`}>
                        Oficina Centro de Santiago
                      </div>
                    </div>
                  </button>

                  {/* Despacho a Hotel */}
                  <button
                    type="button"
                    onClick={() => updateCustomerInfo('deliveryMethod', 'hotel_delivery')}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      customerInfo.deliveryMethod === 'hotel_delivery'
                        ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <MapPin className={`h-8 w-8 mb-3 ${
                        customerInfo.deliveryMethod === 'hotel_delivery' 
                          ? 'text-emerald-600' 
                          : 'text-gray-400'
                      }`} />
                      <div className={`font-semibold mb-1 ${
                        customerInfo.deliveryMethod === 'hotel_delivery'
                          ? 'text-emerald-700'
                          : 'text-gray-700'
                      }`}>
                        Despacho a Hotel
                      </div>
                      <div className={`text-xs ${
                        customerInfo.deliveryMethod === 'hotel_delivery'
                          ? 'text-emerald-600'
                          : 'text-gray-500'
                      }`}>
                        Entrega en tu alojamiento
                      </div>
                    </div>
                  </button>

                  {/* Retiro en Buenos Aires */}
                  <button
                    type="button"
                    onClick={() => {
                      updateCustomerInfo('deliveryMethod', 'pickup_buenosaires')
                      updateCustomerInfo('hotelDetails', {
                        region: '',
                        comuna: '',
                        address: '',
                        hotelName: '',
                        roomNumber: ''
                      })
                    }}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      customerInfo.deliveryMethod === 'pickup_buenosaires'
                        ? 'border-purple-500 bg-purple-50 shadow-md scale-105'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <Plane className={`h-8 w-8 mb-3 ${
                        customerInfo.deliveryMethod === 'pickup_buenosaires' 
                          ? 'text-purple-600' 
                          : 'text-gray-400'
                      }`} />
                      <div className={`font-semibold mb-1 ${
                        customerInfo.deliveryMethod === 'pickup_buenosaires'
                          ? 'text-purple-700'
                          : 'text-gray-700'
                      }`}>
                        Retiro en Buenos Aires
                      </div>
                      <div className={`text-xs ${
                        customerInfo.deliveryMethod === 'pickup_buenosaires'
                          ? 'text-purple-600'
                          : 'text-gray-500'
                      }`}>
                        Oficina en Argentina
                      </div>
                    </div>
                  </button>
                </div>

                {/* Formulario de Hotel - Solo se muestra si selecciona hotel_delivery */}
                {customerInfo.deliveryMethod === 'hotel_delivery' && (
                  <div className="mt-6 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                    <h3 className="font-semibold text-emerald-900 mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Detalles del Hotel
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-gray-800">
                      {/* Región */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Región *
                        </label>
                        <select
                          value={customerInfo.hotelDetails.region}
                          onChange={(e) => updateCustomerInfo('hotelDetails', {
                            ...customerInfo.hotelDetails,
                            region: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                          required
                        >
                          <option value="">Selecciona una región</option>
                          <option value="Región Metropolitana">Región Metropolitana</option>
                          <option value="Valparaíso">Valparaíso</option>
                          <option value="Biobío">Biobío</option>
                          <option value="Araucanía">Araucanía</option>
                          <option value="Los Lagos">Los Lagos</option>
                          <option value="Coquimbo">Coquimbo</option>
                          <option value="Maule">Maule</option>
                          <option value="Antofagasta">Antofagasta</option>
                          <option value="Atacama">Atacama</option>
                          <option value="Tarapacá">Tarapacá</option>
                          <option value="Arica y Parinacota">Arica y Parinacota</option>
                          <option value="Los Ríos">Los Ríos</option>
                          <option value="Aysén">Aysén</option>
                          <option value="Magallanes">Magallanes</option>
                          <option value="O'Higgins">O&apos;Higgins</option>
                          <option value="Ñuble">Ñuble</option>
                        </select>
                      </div>

                      {/* Comuna */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comuna *
                        </label>
                        <input
                          type="text"
                          value={customerInfo.hotelDetails.comuna}
                          onChange={(e) => updateCustomerInfo('hotelDetails', {
                            ...customerInfo.hotelDetails,
                            comuna: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Ej: Providencia, Las Condes..."
                          required
                        />
                      </div>

                      {/* Dirección */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Dirección *
                        </label>
                        <input
                          type="text"
                          value={customerInfo.hotelDetails.address}
                          onChange={(e) => updateCustomerInfo('hotelDetails', {
                            ...customerInfo.hotelDetails,
                            address: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Calle, número, etc."
                          required
                        />
                      </div>

                      {/* Nombre del Hotel (Opcional) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Hotel
                          <span className="text-gray-400 text-xs ml-1">(Opcional)</span>
                        </label>
                        <input
                          type="text"
                          value={customerInfo.hotelDetails.hotelName}
                          onChange={(e) => updateCustomerInfo('hotelDetails', {
                            ...customerInfo.hotelDetails,
                            hotelName: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Ej: Hotel Ritz, Airbnb..."
                        />
                      </div>

                      {/* Número de Habitación/Depto (Opcional) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          N° Habitación / Depto
                          <span className="text-gray-400 text-xs ml-1">(Opcional)</span>
                        </label>
                        <input
                          type="text"
                          value={customerInfo.hotelDetails.roomNumber}
                          onChange={(e) => updateCustomerInfo('hotelDetails', {
                            ...customerInfo.hotelDetails,
                            roomNumber: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="Ej: 405, Depto 3B..."
                        />
                      </div>
                    </div>

                    {/* Info adicional */}
                    <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-200">
                      <p className="text-sm text-emerald-800">
                        💡 <strong>Tip:</strong> Asegúrate de proporcionar la dirección completa para garantizar una entrega exitosa.
                      </p>
                    </div>
                  </div>
                )}

                {/* Info según el método seleccionado */}
                {customerInfo.deliveryMethod === 'pickup_santiago' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      📍 <strong>Dirección:</strong> Av. Nueva Providencia 2155 depto 1104B, Edificio Panoramico, Metro Los Leones, Providencia
                    </p>
                  </div>
                )}

                {customerInfo.deliveryMethod === 'pickup_buenosaires' && (
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-800">
                      📍 <strong>Dirección:</strong> Te contactaremos con los detalles de retiro en Buenos Aires.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Package className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Lista de Productos</h2>
                </div>
                <span className="text-sm text-gray-500">{products.length} producto(s)</span>
              </div>

              <div className="space-y-6">
                {products.map((product, index) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Producto #{index + 1}</h3>
                      {products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Selector de tipo de producto - MEJORADO */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Tipo de Solicitud
                      </label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => changeProductType(product.id, 'with_link')}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            product.type === 'with_link'
                              ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-center mb-2">
                            <LinkIcon className={`h-5 w-5 ${
                              product.type === 'with_link' ? 'text-blue-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className={`text-sm font-semibold ${
                            product.type === 'with_link' ? 'text-blue-700' : 'text-gray-600'
                          }`}>
                            Tengo el Link
                          </div>
                          <div className={`text-xs mt-1 ${
                            product.type === 'with_link' ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            Copiar URL del producto
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => changeProductType(product.id, 'search_request')}
                          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                            product.type === 'search_request'
                              ? 'border-purple-500 bg-purple-50 shadow-md scale-105'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-center mb-2">
                            <Search className={`h-5 w-5 ${
                              product.type === 'search_request' ? 'text-purple-600' : 'text-gray-400'
                            }`} />
                          </div>
                          <div className={`text-sm font-semibold ${
                            product.type === 'search_request' ? 'text-purple-700' : 'text-gray-600'
                          }`}>
                            Búsqueda
                          </div>
                          <div className={`text-xs mt-1 ${
                            product.type === 'search_request' ? 'text-purple-600' : 'text-gray-500'
                          }`}>
                            Describir producto
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Formulario según el tipo */}
                    {product.type === 'with_link' ? (
                      <div className="grid md:grid-cols-2 text-gray-800 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link del Producto *
                          </label>
                          <input
                            type="url"
                            value={product.url}
                            onChange={(e) => updateProduct(product.id, 'url', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://tienda.com/producto"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={product.quantity}
                            onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={product.nombre}
                            onChange={(e) => updateProduct(product.id, 'nombre', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nombre detallado"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Color
                          </label>
                          <input
                            type="text"
                            value={product.color}
                            onChange={(e) => updateProduct(product.id, 'color', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Color, variaciones, etc."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Talla
                          </label>
                          <input
                            type="text"
                            value={product.size}
                            onChange={(e) => updateProduct(product.id, 'size', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Talla, capacidad, etc."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notas Adicionales
                          </label>
                          <textarea
                            value={product.notes}
                            onChange={(e) => updateProduct(product.id, 'notes', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Cualquier información adicional..."
                            rows={2}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 text-gray-800 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Producto *
                          </label>
                          <select
                            value={product.productType}
                            onChange={(e) => updateProduct(product.id, 'productType', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          >
                            <option value="">Selecciona una categoría</option>
                            <option value="Smartphone">📱 Smartphone</option>
                            <option value="Laptop">💻 Laptop</option>
                            <option value="Tablet">📲 Tablet</option>
                            <option value="Auriculares">🎧 Auriculares</option>
                            <option value="Smartwatch">⌚ Smartwatch</option>
                            <option value="Cámara">📷 Cámara</option>
                            <option value="Ropa">👕 Ropa</option>
                            <option value="Zapatos">👟 Zapatos</option>
                            <option value="Deportes">⚽ Artículos Deportivos</option>
                            <option value="Otro">🔍 Otro</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Marca *
                          </label>
                          <input
                            type="text"
                            value={product.brand}
                            onChange={(e) => updateProduct(product.id, 'brand', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Apple, Samsung, Nike..."
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Modelo
                          </label>
                          <input
                            type="text"
                            value={product.model}
                            onChange={(e) => updateProduct(product.id, 'model', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: iPhone 15 Pro, Galaxy S24..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={product.quantity}
                            onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Especificaciones y Detalles
                          </label>
                          <textarea
                            value={product.specifications}
                            onChange={(e) => updateProduct(product.id, 'specifications', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: Color negro, 256GB, talla L, versión internacional..."
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Botones para agregar productos */}
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => addProduct('with_link')}
                    className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-blue-600 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center"
                  >
                    <LinkIcon className="h-5 w-5 mr-2" />
                    <span className="font-medium">Agregar con Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addProduct('search_request')}
                    className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-purple-600 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center justify-center"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    <span className="font-medium">Solicitar Búsqueda</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Información Adicional</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Importante:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Revisaremos la disponibilidad y precios de todos los productos</li>
                  <li>• Te enviaremos una cotización detallada en tu moneda local (ARS)</li>
                  <li>• Los productos estarán listos 2-3 días antes de tu llegada</li>
                  <li>• Si solicitaste búsquedas, te enviaremos las mejores opciones encontradas</li>
                </ul>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-3" />
                    Enviar Solicitud
                  </>
                )}
              </button>
            </div>

            {/* Estimated Timeline */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">⏰ Cronograma Estimado</h3>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl mb-2">📧</div>
                    <div className="font-semibold text-gray-900">0-24h</div>
                    <div className="text-sm text-gray-600">Confirmación</div>
                  </div>
                </div>
                <div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl mb-2">🛒</div>
                    <div className="font-semibold text-gray-900">1-3 días</div>
                    <div className="text-sm text-gray-600">Compra</div>
                  </div>
                </div>
                <div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl mb-2">📦</div>
                    <div className="font-semibold text-gray-900">3-5 días</div>
                    <div className="text-sm text-gray-600">Preparación</div>
                  </div>
                </div>
                <div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl mb-2">🎉</div>
                    <div className="font-semibold text-gray-900">Tu llegada</div>
                    <div className="text-sm text-gray-600">Entrega</div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>


    </div>
  )
}