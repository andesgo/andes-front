// app/api/send-email/route.ts (nota el nombre correcto del directorio)
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type ArrivalTimeOption = 'tomorrow' | 'one_week' | 'not_sure' | 'specific_date'

export interface ProductWithLink {
  id: string
  type: 'with_link'
  url: string
  quantity: number
  color: string
  size: string
  notes: string
}

export interface ProductSearchRequest {
  id: string
  type: 'search_request'
  productType: string
  brand: string
  model: string
  specifications: string
  quantity: number
}

export type ProductItem = ProductWithLink | ProductSearchRequest

interface CustomerInfo {
  name: string
  email: string
  document: string
  countryCode: string
  phone: string
  arrivalTimeOption: ArrivalTimeOption
  arrivalDate: string
  deliveryOption: 'pickup' | 'hotel'
  hotelName: string
  hotelAddress: string
  hotelCommune: string
  hotelOther: string
}

interface AttachmentPayload {
  quotationId: string
  createdAt: string
  customerInfo: CustomerInfo
  products: ProductItem[]
  summary?: {
    totalProducts: number
    productsWithLink: number
    productsSearchRequest: number
  }
}

interface RequestBody {
  customerInfo: CustomerInfo
  products: ProductItem[]
}

function buildAttachmentPayload(quotationId: string, body: RequestBody) {
  const createdAt = new Date().toISOString()
  const totalProducts = body.products.length
  const productsWithLink = body.products.filter(p => p.type === 'with_link').length

  return {
    quotationId,
    createdAt,
    customerInfo: body.customerInfo,
    products: body.products,
    summary: {
      totalProducts,
      productsWithLink,
      productsSearchRequest: totalProducts - productsWithLink
    }
  }
}

function createAttachmentBuffer(quotationId: string, body: RequestBody) {
  const payload = buildAttachmentPayload(quotationId, body)
  const jsonString = JSON.stringify(payload, null, 2)
  return Buffer.from(jsonString, 'utf-8')
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json()
    const { customerInfo, products } = body

    // Validaciones básicas
    if (!customerInfo || !products || products.length === 0) {
      return NextResponse.json(
        { error: 'Datos incompletos. Se requiere información del cliente y al menos un producto.' },
        { status: 400 }
      )
    }

    // Validar campos requeridos del cliente
    const requiredFields = ['name', 'email', 'phone']
    for (const field of requiredFields) {
      if (!customerInfo[field as keyof CustomerInfo]) {
        return NextResponse.json(
          { error: `Campo requerido faltante: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validar arrivalDate solo si arrivalTimeOption es 'specific_date'
    if (customerInfo.arrivalTimeOption === 'specific_date' && !customerInfo.arrivalDate) {
      return NextResponse.json(
        { error: 'Se requiere fecha de llegada cuando se selecciona fecha específica' },
        { status: 400 }
      )
    }

    // Validar productos según su tipo
    for (const product of products) {
      if (!product.quantity || product.quantity < 1) {
        return NextResponse.json(
          { error: 'Todos los productos deben tener cantidad mayor a 0' },
          { status: 400 }
        )
      }

      if (product.type === 'with_link') {
        const p = product as ProductWithLink
        if (!p.url || !isValidUrl(p.url)) {
          return NextResponse.json(
            { error: 'Los productos con link deben tener una URL válida' },
            { status: 400 }
          )
        }
      } else if (product.type === 'search_request') {
        const p = product as ProductSearchRequest
        if (!p.productType) {
          return NextResponse.json(
            { error: 'Los productos de búsqueda deben especificar el tipo de producto' },
            { status: 400 }
          )
        }
      } else {
        return NextResponse.json(
          { error: 'Tipo de producto no válido' },
          { status: 400 }
        )
      }
    }

    // Generar ID de cotización
    const quotationId = `AG-${Date.now().toString(36).toUpperCase()}`

    // Separar productos por tipo
    const productsWithLink = products.filter(p => p.type === 'with_link') as ProductWithLink[]
    const productsToSearch = products.filter(p => p.type === 'search_request') as ProductSearchRequest[]

    // Formatear tiempo de llegada
    const formatArrivalTime = () => {
      switch (customerInfo.arrivalTimeOption) {
        case 'tomorrow':
          return '🚀 Mañana'
        case 'one_week':
          return '📅 En una semana'
        case 'not_sure':
          return '🤔 Aún no está seguro'
        case 'specific_date':
          return `🗓️ ${new Date(customerInfo.arrivalDate).toLocaleDateString('es-CL', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
          })}`
        default:
          return 'No especificado'
      }
    }

    // Generar HTML para email admin
    const adminEmailHtml = generateAdminEmail(quotationId, customerInfo, productsWithLink, productsToSearch, formatArrivalTime())
    
    // Generar HTML para email cliente
    const customerEmailHtml = generateCustomerEmail(quotationId, customerInfo, productsWithLink, productsToSearch, formatArrivalTime())

    // Aquí enviarías los emails...
    // await sendEmail({ to: 'admin@andesgo.com', html: adminEmailHtml })
    // await sendEmail({ to: customerInfo.email, html: customerEmailHtml })

    if (!process.env.RESEND_API_KEY) {
          console.error('RESEND_API_KEY no está configurada')
          return NextResponse.json(
            { error: 'Configuración del servidor incompleta' },
            { status: 500 }
          )
        }
    
        const attachmentBuffer = createAttachmentBuffer(quotationId, body)
        // Enviar email al administrador
        const adminEmail = await resend.emails.send({
          from: 'AndesGO <noreply@andesgo.cl>', // Cambia por tu dominio verificado
          to: [process.env.NEXT_PUBLIC_EMAIL_ADMIN || 'admin@andesgo.com'], // Tu email de administrador
          subject: `🚨 New Quote #${quotationId} - ${customerInfo.name}`,
          html: adminEmailHtml,
          replyTo: customerInfo.email,
          attachments: [
            {
              filename: `quote-${quotationId}.json`,
              content: attachmentBuffer,
              contentType: 'application/json'
            }
          ]
        })
    
        // Enviar email de confirmación al cliente
        let customerEmail
        let customerEmailError = null
    
        try {
        customerEmail = await resend.emails.send({
          from: 'AndesGO <noreply@andesgo.cl>',
          to: [customerInfo.email],
          subject: `✅ Cotización recibida #${quotationId} - AndesGO`,
          html: customerEmailHtml,
          replyTo: process.env.NEXT_PUBLIC_EMAIL_CONTACT || 'contacto@andesgo.com'
        })
        
        console.log('Resultado email customer:', {
          success: !!customerEmail.data?.id,
          id: customerEmail.data?.id,
          error: customerEmail.error
        })
        
      } catch (customerError) {
        console.error('Error específico al enviar email al customer:', customerError)
        customerEmailError = customerError
    
        // Intentar enviar una copia al admin con la información del error
        try {
          await resend.emails.send({
            from: 'AndesGO <onboarding@resend.dev>',
            to: [process.env.ADMIN_EMAIL || 'admin@andesgo.com'],
            subject: `⚠️ Error enviando confirmación - Cotización #${quotationId}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #dc2626;">Error al enviar email de confirmación</h1>
                <p><strong>Cotización:</strong> ${quotationId}</p>
                <p><strong>Cliente:</strong> ${customerInfo.name}</p>
                <p><strong>Email del cliente:</strong> ${customerInfo.email}</p>
                <p><strong>Error:</strong> ${customerError instanceof Error ? customerError.message : 'Error desconocido'}</p>
                <hr>
                <p><strong>ACCIÓN REQUERIDA:</strong> Contacta manualmente al cliente para confirmar su cotización.</p>
              </div>
            `,
            replyTo: 'noreply@resend.dev'
          })
        } catch (notificationError) {
          console.error('Error enviando notificación de error al admin:', notificationError)
        }
      }
    
        // Log detallado para debugging
      console.log('Resultado completo de emails:', {
        quotationId,
        admin: {
          id: adminEmail.data?.id,
          success: !!adminEmail.data?.id,
          error: adminEmail.error
        },
        customer: {
          id: customerEmail?.data?.id,
          success: !!customerEmail?.data?.id,
          error: customerEmail?.error || customerEmailError,
          email: customerInfo.email
        },
        timestamp: new Date().toISOString()
      })
    
        // Validar que al menos el email del admin se haya enviado
        if (!adminEmail.data?.id) {
          throw new Error('Error crítico: No se pudo enviar el email al administrador')
        }

    return NextResponse.json({ 
      success: true, 
      quotationId,
      message: customerEmail?.data?.id 
      ? 'Cotización enviada exitosamente' 
      : 'Cotización recibida. Confirmación al cliente pendiente.',
    })

  } catch (error) {
    console.error('Error processing quotation:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch {
    return false
  }
}

function generateAdminEmail(
  quotationId: string,
  customerInfo: CustomerInfo,
  productsWithLink: ProductWithLink[],
  productsToSearch: ProductSearchRequest[],
  arrivalTimeFormatted: string
): string {
  const renderProductsWithLink = () => {
    if (productsWithLink.length === 0) return ''
    return `
      <div class="section">
        <h2>🔗 Productos con Link (${productsWithLink.length})</h2>
        ${productsWithLink.map((p, i) => `
          <div class="product-item">
            <h3>Producto #${i + 1}</h3>
            <p><span class="label">URL:</span> <a href="${p.url}" target="_blank">${p.url}</a></p>
            <p><span class="label">Cantidad:</span><span class="value">${p.quantity}</span></p>
            ${p.color ? `<p><span class="label">Color:</span><span class="value">${p.color}</span></p>` : ''}
            ${p.size ? `<p><span class="label">Tamaño:</span><span class="value">${p.size}</span></p>` : ''}
            ${p.notes ? `<p><span class="label">Notas:</span><span class="value">${p.notes}</span></p>` : ''}
          </div>
        `).join('')}
      </div>
    `
  }

  const renderProductsToSearch = () => {
    if (productsToSearch.length === 0) return ''
    return `
      <div class="section">
        <h2>🔍 Productos para Buscar (${productsToSearch.length})</h2>
        ${productsToSearch.map((p, i) => `
          <div class="product-item search-item">
            <h3>Búsqueda #${i + 1}</h3>
            <p><span class="label">Tipo:</span><span class="value">${p.productType}</span></p>
            ${p.brand ? `<p><span class="label">Marca:</span><span class="value">${p.brand}</span></p>` : ''}
            ${p.model ? `<p><span class="label">Modelo:</span><span class="value">${p.model}</span></p>` : ''}
            <p><span class="label">Cantidad:</span><span class="value">${p.quantity}</span></p>
            ${p.specifications ? `<p><span class="label">Especificaciones:</span><span class="value">${p.specifications}</span></p>` : ''}
          </div>
        `).join('')}
      </div>
    `
  }

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Quote AndesGO</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .product-item { background: #f1f5f9; margin: 10px 0; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; }
        .product-item.search-item { border-left-color: #f59e0b; background: #fffbeb; }
        .label { font-weight: 600; color: #374151; }
        .value { margin-left: 10px; }
        .urgent { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .badge-link { background: #dbeafe; color: #1d4ed8; }
        .badge-search { background: #fef3c7; color: #b45309; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Nueva Cotización AndesGO</h1>
          <p>ID: ${quotationId}</p>
          <p>
            ${productsWithLink.length > 0 ? `<span class="badge badge-link">🔗 ${productsWithLink.length} con link</span>` : ''}
            ${productsToSearch.length > 0 ? `<span class="badge badge-search">🔍 ${productsToSearch.length} para buscar</span>` : ''}
          </p>
        </div>
        <div class="content">
          <div class="urgent">
            <strong>⚡ ACCIÓN REQUERIDA:</strong> Nueva cotización recibida el ${new Date().toLocaleDateString('es-CL', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </div>

          <div class="section">
            <h2>👤 Información del Cliente</h2>
            <p><span class="label">Nombre:</span><span class="value">${customerInfo.name}</span></p>
            <p><span class="label">Email:</span><span class="value">${customerInfo.email}</span></p>
            <p><span class="label">Documento:</span><span class="value">${customerInfo.document || 'No especificado'}</span></p>
            <p><span class="label">Teléfono:</span><span class="value">${customerInfo.countryCode} ${customerInfo.phone}</span></p>
            <p><span class="label">Llegada:</span><span class="value">${arrivalTimeFormatted}</span></p>
            <p><span class="label">Tipo de entrega:</span><span class="value">${customerInfo.deliveryOption === 'pickup' ? 'Retiro en oficina' : 'Entrega en hotel'}</span></p>
            ${customerInfo.deliveryOption === 'hotel' ? `
              <p><span class="label">Hotel:</span><span class="value">${customerInfo.hotelName}</span></p>
              <p><span class="label">Dirección:</span><span class="value">${customerInfo.hotelAddress}</span></p>
              <p><span class="label">Comuna:</span><span class="value">${customerInfo.hotelCommune}</span></p>
              ${customerInfo.hotelOther ? `<p><span class="label">Información adicional:</span><span class="value">${customerInfo.hotelOther}</span></p>` : ''}
            ` : ''}
          </div>

          ${renderProductsWithLink()}
          ${renderProductsToSearch()}

          <div class="section">
            <h2>📋 Próximos Pasos</h2>
            <ul>
              <li>✅ Revisar disponibilidad de productos</li>
              ${productsToSearch.length > 0 ? '<li>🔍 Buscar alternativas para productos sin link</li>' : ''}
              <li>✅ Calcular precios y tarifas de servicio</li>
              <li>✅ Contactar al cliente en máximo 24 horas</li>
              <li>✅ Enviar cotización detallada</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p>AndesGO - Servicio de Shopping Personal</p>
          <p>Sistema automatizado de cotizaciones</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCustomerEmail(
  quotationId: string,
  customerInfo: CustomerInfo,
  productsWithLink: ProductWithLink[],
  productsToSearch: ProductSearchRequest[],
  arrivalTimeFormatted: string
): string {
  const renderProductSummary = () => {
    const items: string[] = []
    
    productsWithLink.forEach((p, i) => {
      const details: string[] = []
      if (p.color) details.push(`Color: ${p.color}`)
      if (p.size) details.push(`Tamaño: ${p.size}`)
      if (p.notes) details.push(`Notas: ${p.notes}`)
      const detailsStr = details.length > 0 
        ? `<br><span style="margin-left:16px; font-size:0.9em; color:#555;">${details.join(' • ')}</span>` 
        : ''
      items.push(`<li>🔗 <strong>Producto con link #${i + 1}</strong> - Cantidad: ${p.quantity}${detailsStr}</li>`)
    })

    productsToSearch.forEach((p, i) => {
      const details: string[] = [`Tipo: ${p.productType}`]
      if (p.brand) details.push(`Marca: ${p.brand}`)
      if (p.model) details.push(`Modelo: ${p.model}`)
      if (p.specifications) details.push(`Specs: ${p.specifications}`)
      const detailsStr = `<br><span style="margin-left:16px; font-size:0.9em; color:#555;">${details.join(' • ')}</span>`
      items.push(`<li>🔍 <strong>Búsqueda #${i + 1}</strong> - Cantidad: ${p.quantity}${detailsStr}</li>`)
    })

    return items.join('')
  }

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cotización Recibida - AndesGO</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
        .success-box { background: #ecfdf5; border: 1px solid #10b981; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .timeline { display: flex; justify-content: space-between; margin: 20px 0; }
        .timeline-item { text-align: center; flex: 1; }
        .timeline-number { background: #3b82f6; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Cotización Recibida! 🎉</h1>
          <p>Gracias por confiar en AndesGO</p>
        </div>
        <div class="content">
          <div class="success-box">
            <h2 style="color: #059669; margin: 0 0 10px 0;">✅ Tu solicitud fue enviada exitosamente</h2>
            <p style="margin: 0;"><strong>ID de cotización:</strong> ${quotationId}</p>
          </div>

          <div class="section">
            <h2>Hola ${customerInfo.name} 👋</h2>
            <p>Hemos recibido tu solicitud de cotización para <strong>${productsWithLink.length + productsToSearch.length} producto(s)</strong> y ya estamos trabajando en ella.</p>
            
            <h3>📦 Resumen de tu solicitud:</h3>
            <ul>${renderProductSummary()}</ul>
            
            <p><strong>Tu Llegada:</strong> ${arrivalTimeFormatted}</p>
            <p><strong>Tipo de entrega:</strong> ${customerInfo.deliveryOption === 'pickup' ? 'Retiro en oficina' : 'Entrega en hotel'}</p>
            ${customerInfo.deliveryOption === 'hotel' ? `<p><strong>Hotel:</strong> ${customerInfo.hotelName}, ${customerInfo.hotelCommune}</p>` : ''}
          </div>

          ${productsToSearch.length > 0 ? `
          <div class="section" style="background: #fffbeb; border-color: #f59e0b;">
            <h2>🔍 Búsqueda de Productos</h2>
            <p>Has solicitado que busquemos <strong>${productsToSearch.length} producto(s)</strong> para ti. Nuestro equipo investigará las mejores opciones disponibles y te las incluiremos en la cotización.</p>
          </div>
          ` : ''}

          <div class="section">
            <h2>⏰ ¿Qué sigue ahora?</h2>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-number">1</div>
                <h4>Revisión</h4>
                <p>0-12 horas</p>
              </div>
              <div class="timeline-item">
                <div class="timeline-number">2</div>
                <h4>Cotización</h4>
                <p>12-24 horas</p>
              </div>
              <div class="timeline-item">
                <div class="timeline-number">3</div>
                <h4>Confirmación</h4>
                <p>24-48 horas</p>
              </div>
              <div class="timeline-item">
                <div class="timeline-number">4</div>
                <h4>Compra</h4>
                <p>Después de tu OK</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>📞 ¿Necesitas ayuda?</h2>
            <p>Nuestro equipo está aquí para ayudarte:</p>
            <ul>
              <li><strong>Email:</strong> andesgoshopping@gmail.com</li>
              <li><strong>WhatsApp:</strong> +56 9 8287 6757</li>
              <li><strong>Horarios:</strong> Lunes a Viernes, 9:00 - 18:00 hrs</li>
            </ul>
            
            <p style="background: #eff6ff; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
              <strong>💡 Tip:</strong> Guarda este email y el ID de cotización para futuras referencias.
            </p>
          </div>
        </div>
        <div class="footer">
          <p><strong>AndesGO</strong> - Tu servicio de shopping personal en Chile</p>
          <p>Hacemos que comprar en Chile sea fácil y confiable 🇨🇱</p>
        </div>
      </div>
    </body>
    </html>
  `
}