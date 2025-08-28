// app/solicitar/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Plus, Trash2, Send, ArrowLeft, Package, User, Mail, Phone, MapPin } from 'lucide-react'

interface ProductItem {
  id: string
  // name: string
  url: string
  quantity: number
  notes: string
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  arrivalDate: string
  deliveryOption: 'pickup' | 'hotel'
  hotelName: string
  hotelAddress: string
  hotelCommune: string
  hotelOther: string
}

export default function SolicitarPage() {
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: '1',
      // name: '',
      url: '',
      quantity: 1,
      notes: ''
    }
  ])

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    arrivalDate: '',
    deliveryOption: 'pickup',
    hotelName: '',
    hotelAddress: '',
    hotelCommune: '',
    hotelOther: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const addProduct = () => {
    const newProduct: ProductItem = {
      id: Date.now().toString(),
      // name: '',
      url: '',
      quantity: 1,
      notes: ''
    }
    setProducts([...products, newProduct])
  }

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id))
    }
  }

  const updateProduct = (id: string, field: keyof ProductItem, value: string | number) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ))
  }

  const updateCustomerInfo = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validación previa: verificar que todos los productos tengan datos completos
      const incompleteProducts = products.filter(product => 
        !product.url.trim()
      )

      // if (customerInfo.deliveryOption === 'hotel') {
      // const requiredHotelFields = ['hotelName', 'hotelAddress', 'hotelCommune', 'hotelOther']
      // const missingFields = requiredHotelFields.filter(field => 
      //   !customerInfo[field as keyof CustomerInfo].trim()
      // )

      if (incompleteProducts.length > 0) {
        alert('Por favor, completa todos los campos requeridos (URL) en todos los productos')
        setIsSubmitting(false)
        return
      }

      // Preparar datos para enviar (ahora sabemos que todos están completos)
      const requestData = {
        customerInfo,
        products: products.map(product => ({
          ...product,
          url: product.url.trim(),
          notes: product.notes.trim()
        }))
      }

      console.log('Enviando datos:', requestData)

      // Enviar a la API
      const response = await fetch('/api/sendmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      // const result = await response.json()
      console.log('Response status:', response.status) // Para debugging
      console.log('Response headers:', response.headers.get('content-type')) // Para debugging

      // Verificar si la respuesta es JSON válido
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Respuesta inesperada del servidor. Content-Type: ${contentType}`)
    }

    let result
    try {
      result = await response.json()
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError)
      // Intentar obtener el texto de la respuesta para debugging
      const responseText = await response.text()
      console.error('Respuesta del servidor:', responseText)
      throw new Error('Error al procesar la respuesta del servidor')
    }

    console.log('Result:', result) // Para debugging

      if (!response.ok) {
        throw new Error(result.error || 'Error al enviar la cotización')
      }

      // Si todo salió bien, mostrar success
      setIsSubmitting(false)
      setShowSuccess(true)
      
      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false)
        setProducts([{
          id: '1',
          url: '',
          quantity: 1,
          notes: ''
        }])
        setCustomerInfo({
          name: '',
          email: '',
          phone: '',
          arrivalDate: '',
          deliveryOption: 'pickup',
          hotelName: '',
          hotelAddress: '',
          hotelCommune: '',
          hotelOther: ''
        })
      }, 4000)

    } catch (error) {
      setIsSubmitting(false)
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Error al enviar la cotización. Por favor, inténtalo de nuevo.')
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">¡Solicitud Enviada!</h1>
          <p className="text-gray-600 mb-8">
            Hemos recibido tu solicitud exitosamente. Te contactaremos dentro de las próximas 24 horas para confirmar los detalles y precios.
          </p>
          <Link href="/" className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
            Volver al Inicio
          </Link>
        </div>
      </div>
    )
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
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                AndesGO
              </span>
            </div>
            <div className="w-16"></div> {/* Spacer for centering */}
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
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 234 567 8900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Llegada a Chile *
                  </label>
                  <input
                    type="date"
                    value={customerInfo.arrivalDate}
                    onChange={(e) => updateCustomerInfo('arrivalDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Delivery Options */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Opción de Entrega</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      customerInfo.deliveryOption === 'pickup'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateCustomerInfo('deliveryOption', 'pickup')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={customerInfo.deliveryOption === 'pickup'}
                        onChange={() => updateCustomerInfo('deliveryOption', 'pickup')}
                        className="mr-3"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">Retiro en Oficina</h4>
                        <p className="text-sm text-gray-600">Retira en nuestras oficinas de Santiago</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      customerInfo.deliveryOption === 'hotel'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateCustomerInfo('deliveryOption', 'hotel')}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="delivery"
                        value="hotel"
                        checked={customerInfo.deliveryOption === 'hotel'}
                        onChange={() => updateCustomerInfo('deliveryOption', 'hotel')}
                        className="mr-3"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">Entrega en Hotel</h4>
                        <p className="text-sm text-gray-600">Enviamos directamente a tu hotel</p>
                      </div>
                    </div>
                  </div>
                </div>

                {customerInfo.deliveryOption === 'hotel' && (
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Hotel *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.hotelName}
                        onChange={(e) => updateCustomerInfo('hotelName', e.target.value)}
                        className="w-full px-4 py-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nombre del hotel"
                        required={customerInfo.deliveryOption === 'hotel'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección del Hotel *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.hotelAddress}
                        onChange={(e) => updateCustomerInfo('hotelAddress', e.target.value)}
                        className="w-full px-4 py-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dirección completa"
                        required={customerInfo.deliveryOption === 'hotel'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comuna del Hotel *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.hotelCommune}
                        onChange={(e) => updateCustomerInfo('hotelCommune', e.target.value)}
                        className="w-full px-4 py-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Comuna"
                        required={customerInfo.deliveryOption === 'hotel'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Habitación u otra información *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.hotelOther}
                        onChange={(e) => updateCustomerInfo('hotelOther', e.target.value)}
                        className="w-full px-4 py-3 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Habitación u otra información"
                        required={customerInfo.deliveryOption === 'hotel'}
                      />
                    </div>
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
                          Notas Adicionales
                        </label>
                        <input
                          type="text"
                          value={product.notes}
                          onChange={(e) => updateProduct(product.id, 'notes', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Color, talla, variaciones, etc."
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addProduct}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Agregar Otro Producto
                </button>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Información Adicional</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Importante:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Revisaremos la disponibilidad y precios de todos los productos</li>
                  <li>• Te contactaremos para confirmar el pedido y método de pago</li>
                  <li>• Los productos estarán listos 2-3 días antes de tu llegada</li>
                  <li>• Se aplicarán tarifas de servicio según el total de la compra</li>
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
                    <div className="text-2xl mb-2">📝</div>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">AndesGO</span>
            </div>
            <p className="text-gray-400 mb-4">¿Necesitas ayuda? Contáctanos</p>
            <div className="flex justify-center space-x-6 text-sm">
              <span className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                contacto@andesgo.com
              </span>
              <span className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +56 9 XXXX XXXX
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}