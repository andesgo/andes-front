'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, User, Package, MapPin, Plus, Trash2, Upload, X, HelpCircle } from 'lucide-react';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  document: string;
  arrivalTimeOption: string;
  arrivalDate: string;
}

interface Product {
  id: string;
  name: string;
  store: string;
  trackingCode: string;
  shippingCompany: string;
  notes: string;
  image: File | null;
  imagePreview: string | null;
}

export default function StorageRequestPage() {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    countryCode: '+56',
    document: '',
    arrivalTimeOption: '',
    arrivalDate: ''
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: '',
      store: '',
      trackingCode: '',
      shippingCompany: '',
      notes: '',
      image: null,
      imagePreview: null
    }
  ]);

  const updateCustomerInfo = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      store: '',
      trackingCode: '',
      shippingCompany: '',
      notes: '',
      image: null,
      imagePreview: null
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateProduct(id, 'image', file);
      updateProduct(id, 'imagePreview', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (id: string) => {
    updateProduct(id, 'image', null);
    updateProduct(id, 'imagePreview', null);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Preparar los productos con las imágenes en base64
      const productsToSend = products.map(product => ({
        id: product.id,
        name: product.name,
        store: product.store,
        trackingCode: product.trackingCode,
        shippingCompany: product.shippingCompany,
        notes: product.notes,
        ...(product.imagePreview && {
          imageBase64: product.imagePreview,
          imageName: product.image?.name || 'image.jpg',
          imageType: product.image?.type || 'image/jpeg'
        })
      }));

      const response = await fetch('/api/casilla', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerInfo,
          products: productsToSend
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar la solicitud');
      }

      setSubmitSuccess(true);
      console.log('Solicitud enviada exitosamente:', data);
      
      // Redirigir a página de éxito
      setTimeout(() => {
        window.location.href = '/success_casilla';
      }, 1500);

    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setSubmitError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600 font-medium">Volver</span>
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
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                AndesGO
              </span>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      <div className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Solicitud de Casilla y Almacenaje
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Recibe tus compras internacionales en Chile de forma segura y confiable
            </p>
          </div>

          {/* Shipping Address Highlight Box */}
          <div className="mb-10 bg-gradient-to-br from-blue-600 to-sky-500 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl mr-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">Envía tus productos aquí</h2>
                  <p className="text-blue-100 text-lg">Dirección de nuestra bodega en Santiago</p>
                </div>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 text-gray-800 shadow-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-blue-600 mb-1">DIRECCIÓN COMPLETA</p>
                    <p className="text-lg font-bold leading-relaxed">
                      Av. Nueva Providencia 2155<br />
                      Oficina 1104B, Edificio Panorámico<br />
                      Comuna Providencia, Santiago<br />
                      Región Metropolitana
                    </p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="mb-3">
                      <p className="text-sm font-semibold text-blue-600 mb-1">CÓDIGO POSTAL</p>
                      <p className="text-2xl font-bold text-gray-900">7550000</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center text-gray-600 mb-4">
                    <HelpCircle className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="text-sm font-medium">¿Tienes dudas sobre precios o el servicio?</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hola, tengo una consulta sobre el servicio de casilla`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:${process.env.NEXT_PUBLIC_EMAIL_CONTACT}?subject=Consulta sobre servicio de casilla`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-sky-500 p-3 rounded-2xl mr-4">
                  <User className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Información Personal</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-gray-800">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => updateCustomerInfo('name', e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => updateCustomerInfo('email', e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <div className="flex">
                    <select
                      value={customerInfo.countryCode}
                      onChange={(e) => updateCustomerInfo('countryCode', e.target.value)}
                      className="px-3 py-3.5 border-2 border-gray-200 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all text-gray-600"
                    >
                      <option value="+54">🇦🇷 +54</option>
                      <option value="+55">🇧🇷 +55</option>
                      <option value="+56">🇨🇱 +56</option>
                      <option value="+57">🇨🇴 +57</option>
                      <option value="+51">🇵🇪 +51</option>
                      <option value="+591">🇧🇴 +591</option>
                      <option value="+593">🇪🇨 +593</option>
                      <option value="+595">🇵🇾 +595</option>
                      <option value="+598">🇺🇾 +598</option>
                      <option value="+58">🇻🇪 +58</option>
                      <option value="+52">🇲🇽 +52</option>
                      <option value="+509">🇭🇹 +509</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+34">🇪🇸 +34</option>
                    </select>

                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                      className="w-full px-4 py-3.5 border-2 border-l-0 border-gray-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600"
                      placeholder="9 1234 5678"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    RUT o Pasaporte
                  </label>
                  <input
                    type="text"
                    value={customerInfo.document}
                    onChange={(e) => updateCustomerInfo('document', e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600"
                    placeholder="12.345.678-9 o AB123456"
                  />
                </div>

                {/* Arrival Time */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    ¿Cuándo llegas a Chile? *
                  </label>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => updateCustomerInfo('arrivalTimeOption', 'tomorrow')}
                      className={`p-4 border-2 rounded-xl text-sm font-semibold transition-all ${
                        customerInfo.arrivalTimeOption === 'tomorrow'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      🚀 Mañana
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => updateCustomerInfo('arrivalTimeOption', 'one_week')}
                      className={`p-4 border-2 rounded-xl text-sm font-semibold transition-all ${
                        customerInfo.arrivalTimeOption === 'one_week'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      📅 En una semana
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => updateCustomerInfo('arrivalTimeOption', 'not_sure')}
                      className={`p-4 border-2 rounded-xl text-sm font-semibold transition-all ${
                        customerInfo.arrivalTimeOption === 'not_sure'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      🤔 Aún no lo sé
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => updateCustomerInfo('arrivalTimeOption', 'specific_date')}
                      className={`p-4 border-2 rounded-xl text-sm font-semibold transition-all ${
                        customerInfo.arrivalTimeOption === 'specific_date'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      🗓️ Fecha específica
                    </button>
                  </div>

                  {customerInfo.arrivalTimeOption === 'specific_date' && (
                    <div className="mt-4">
                      <input
                        type="date"
                        value={customerInfo.arrivalDate}
                        onChange={(e) => updateCustomerInfo('arrivalDate', e.target.value)}
                        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-sky-500 to-blue-500 p-3 rounded-2xl mr-4">
                    <Package className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Compras a Recibir</h2>
                    <p className="text-gray-600 mt-1">Agrega las compras que realizarás en diferentes tiendas</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addProduct}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5" />
                  <span>Agregar Compra</span>
                </button>
              </div>

              <div className="space-y-6">
                {products.map((product, index) => (
                  <div 
                    key={product.id} 
                    className="border-2 border-gray-200 rounded-2xl p-6 relative hover:border-blue-300 transition-all bg-gradient-to-br from-gray-50 to-white"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">
                        Compra #{index + 1}
                      </h3>
                      {products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Descripción de la Compra *
                        </label>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600 placeholder-gray-400"
                          placeholder="Ej: 2 laptops Dell, ropa deportiva, etc."
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Describe brevemente los productos de esta compra</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tienda *
                        </label>
                        <input
                          type="text"
                          value={product.store}
                          onChange={(e) => updateProduct(product.id, 'store', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600 placeholder-gray-400"
                          placeholder="Ej: Amazon, eBay, BestBuy"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Código de Rastreo
                        </label>
                        <input
                          type="text"
                          value={product.trackingCode}
                          onChange={(e) => updateProduct(product.id, 'trackingCode', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600 placeholder-gray-400"
                          placeholder="Ej: 1Z999AA10123456784"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Compañía de Envío
                        </label>
                        <input
                          type="text"
                          value={product.shippingCompany}
                          onChange={(e) => updateProduct(product.id, 'shippingCompany', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-600 placeholder-gray-400"
                          placeholder="Ej: UPS, FedEx, DHL, USPS"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Notas Adicionales
                        </label>
                        <textarea
                          value={product.notes}
                          onChange={(e) => updateProduct(product.id, 'notes', e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-gray-600 placeholder-gray-400"
                          rows={3}
                          placeholder="Información adicional sobre la compra, instrucciones especiales, etc."
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Orden de Compra o Boleta (Opcional)
                        </label>
                        
                        {!product.imagePreview ? (
                          <label 
                            className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const file = e.dataTransfer.files?.[0];
                              if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
                                handleImageUpload(product.id, file);
                              }
                            }}
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="h-10 w-10 text-gray-400 mb-3" />
                              <p className="mb-2 text-sm text-gray-600">
                                <span className="font-semibold">Click para subir</span> o arrastra y suelta
                              </p>
                              <p className="text-xs text-gray-500">PNG, JPG o PDF (MAX. 5MB)</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(product.id, file);
                              }}
                            />
                          </label>
                        ) : (
                          <div className="relative border-2 border-gray-200 rounded-xl overflow-hidden">
                            <img
                              src={product.imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(product.id)}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center pt-6">
              {/* Success Message */}
              {submitSuccess && (
                <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center max-w-md">
                  <div className="text-5xl mb-3">✅</div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">¡Solicitud Enviada!</h3>
                  <p className="text-green-700">Recibirás un email de confirmación pronto.</p>
                </div>
              )}

              {/* Error Message */}
              {submitError && (
                <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-2xl p-6 text-center max-w-md">
                  <div className="text-4xl mb-3">❌</div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">Error al enviar</h3>
                  <p className="text-red-700">{submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white px-12 py-4 rounded-2xl text-lg font-bold transition-all hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-3"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Enviando...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <span>✓</span>
                    <span>Solicitud Enviada</span>
                  </>
                ) : (
                  <span>Enviar Solicitud de Almacenaje</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}