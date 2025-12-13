import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type ArrivalTimeOption = 'tomorrow' | 'one_week' | 'not_sure' | 'specific_date'

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  countryCode: string
  document: string
  arrivalTimeOption: ArrivalTimeOption
  arrivalDate: string
}

export interface Product {
  id: string
  name: string
  store: string
  trackingCode: string
  shippingCompany: string
  notes: string
  imageBase64?: string
  imageName?: string
  imageType?: string
}

export interface RequestBody {
  customerInfo: CustomerInfo
  products: Product[]
}

function generateStorageId(): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `STG-${timestamp}-${random}`
}

function buildAttachmentPayload(storageId: string, body: RequestBody) {
  const createdAt = new Date().toISOString()
  const totalProducts = body.products.length

  return {
    storageId,
    createdAt,
    customerInfo: body.customerInfo,
    products: body.products.map(p => ({
      id: p.id,
      name: p.name,
      store: p.store,
      trackingCode: p.trackingCode,
      shippingCompany: p.shippingCompany,
      notes: p.notes,
      hasImage: !!p.imageBase64
    })),
    summary: {
      totalProducts,
      productsWithTracking: body.products.filter(p => p.trackingCode).length,
      productsWithImages: body.products.filter(p => p.imageBase64).length
    }
  }
}

function createAttachmentBuffer(storageId: string, body: RequestBody) {
  const payload = buildAttachmentPayload(storageId, body)
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

    // Validar productos
    for (const product of products) {
      if (!product.name || !product.store) {
        return NextResponse.json(
          { error: 'Cada producto debe tener al menos nombre y tienda' },
          { status: 400 }
        )
      }
    }

    const storageId = generateStorageId()

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
    const adminEmailHtml = generateAdminEmail(storageId, customerInfo, products, formatArrivalTime())
    
    // Generar HTML para email cliente
    const customerEmailHtml = generateCustomerEmail(storageId, customerInfo, products, formatArrivalTime())

    // Verificar configuración de Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY no está configurada')
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      )
    }

    const attachmentBuffer = createAttachmentBuffer(storageId, body)

    // Preparar attachments con imágenes de productos
    const emailAttachments: any[] = [
      {
        filename: `storage-${storageId}.json`,
        content: attachmentBuffer,
        contentType: 'application/json'
      }
    ]

    // Agregar imágenes de productos como attachments
    products.forEach((product, index) => {
      if (product.imageBase64 && product.imageName) {
        // Extraer el contenido base64 sin el prefijo data:image/...;base64,
        const base64Content = product.imageBase64.split(',')[1] || product.imageBase64
        
        emailAttachments.push({
          filename: `producto-${index + 1}-${product.imageName}`,
          content: Buffer.from(base64Content, 'base64'),
          contentType: product.imageType || 'image/jpeg'
        })
      }
    })

    // Enviar email al administrador
    const adminEmail = await resend.emails.send({
      from: 'AndesGO <noreply@andesgo.cl>',
      to: [process.env.NEXT_PUBLIC_EMAIL_CONTACT || 'admin@andesgo.com'],
      subject: `📦 Nueva Solicitud de Casilla #${storageId} - ${customerInfo.name}`,
      html: adminEmailHtml,
      replyTo: customerInfo.email,
      attachments: emailAttachments
    })

    // Enviar email de confirmación al cliente
    let customerEmail
    let customerEmailError = null

    try {
      customerEmail = await resend.emails.send({
        from: 'AndesGO <noreply@andesgo.cl>',
        to: [customerInfo.email],
        subject: `✅ Solicitud de Casilla Recibida #${storageId} - AndesGO`,
        html: customerEmailHtml,
        replyTo: process.env.CONTACT_EMAIL || 'contacto@andesgo.com'
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
          from: 'AndesGO <noreply@andesgo.cl>',
          to: [process.env.ADMIN_EMAIL || 'admin@andesgo.com'],
          subject: `⚠️ Error enviando confirmación - Solicitud #${storageId}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #dc2626;">Error al enviar email de confirmación</h1>
              <p><strong>Solicitud:</strong> ${storageId}</p>
              <p><strong>Cliente:</strong> ${customerInfo.name}</p>
              <p><strong>Email del cliente:</strong> ${customerInfo.email}</p>
              <p><strong>Error:</strong> ${customerError instanceof Error ? customerError.message : 'Error desconocido'}</p>
              <hr>
              <p><strong>ACCIÓN REQUERIDA:</strong> Contacta manualmente al cliente para confirmar su solicitud.</p>
            </div>
          `,
          replyTo: process.env.CONTACT_EMAIL || 'contacto@andesgo.com'
        })
      } catch (notificationError) {
        console.error('Error enviando notificación de error al admin:', notificationError)
      }
    }

    // Log detallado para debugging
    console.log('Resultado completo de emails:', {
      storageId,
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
      storageId,
      message: customerEmail?.data?.id 
        ? 'Solicitud enviada exitosamente' 
        : 'Solicitud recibida. Confirmación al cliente pendiente.',
    })

  } catch (error) {
    console.error('Error processing storage request:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function generateAdminEmail(
  storageId: string,
  customerInfo: CustomerInfo,
  products: Product[],
  arrivalTimeFormatted: string
): string {
  const renderProducts = () => {
    return products.map((p, i) => `
      <div class="product-item">
        <h3>📦 Producto #${i + 1}</h3>
        <p><span class="label">Nombre:</span><span class="value">${p.name}</span></p>
        <p><span class="label">Tienda:</span><span class="value">${p.store}</span></p>
        ${p.trackingCode ? `<p><span class="label">Código de Rastreo:</span><span class="value">${p.trackingCode}</span></p>` : ''}
        ${p.shippingCompany ? `<p><span class="label">Compañía de Envío:</span><span class="value">${p.shippingCompany}</span></p>` : ''}
        ${p.notes ? `<p><span class="label">Notas:</span><span class="value">${p.notes}</span></p>` : ''}
        ${p.imageBase64 ? `<p><span class="label">Adjunto:</span><span class="value">✅ Imagen adjunta en el email</span></p>` : ''}
      </div>
    `).join('')
  }

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Solicitud de Casilla - AndesGO</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 16px; 
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%); 
          color: white; 
          padding: 30px; 
          text-align: center;
        }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; }
        .header p { margin: 5px 0; opacity: 0.95; font-size: 16px; }
        .content { padding: 30px; }
        .section { 
          margin-bottom: 25px; 
          padding: 20px; 
          background: #f8fafc; 
          border-radius: 12px;
          border-left: 4px solid #0284c7;
        }
        .section h2 { 
          margin-top: 0; 
          color: #0284c7; 
          font-size: 20px;
          margin-bottom: 15px;
        }
        .label { 
          font-weight: 600; 
          color: #64748b; 
          display: inline-block; 
          min-width: 160px;
          margin-right: 10px;
        }
        .value { 
          color: #1e293b; 
          font-weight: 500;
        }
        .product-item { 
          background: white; 
          padding: 15px; 
          border-radius: 8px; 
          margin-bottom: 15px;
          border: 1px solid #e2e8f0;
        }
        .product-item h3 { 
          margin: 0 0 12px 0; 
          color: #0284c7; 
          font-size: 16px;
        }
        .product-item p { margin: 8px 0; }
        .urgent {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin-bottom: 25px;
          border-radius: 8px;
          font-size: 14px;
        }
        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin: 5px 5px 0 0;
        }
        .badge-products {
          background: #dbeafe;
          color: #1e40af;
        }
        .badge-images {
          background: #dcfce7;
          color: #166534;
        }
        .shipping-address {
          background: #eff6ff;
          border: 2px solid #3b82f6;
          padding: 20px;
          border-radius: 12px;
          margin: 20px 0;
        }
        .shipping-address h3 {
          color: #1e40af;
          margin-top: 0;
          font-size: 18px;
        }
        .shipping-address p {
          margin: 8px 0;
          line-height: 1.6;
        }
        ul { 
          margin: 15px 0; 
          padding-left: 20px;
        }
        ul li { 
          margin: 8px 0;
          color: #475569;
        }
        .footer { 
          background: #f1f5f9; 
          padding: 20px; 
          text-align: center; 
          color: #64748b;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 Nueva Solicitud de Casilla</h1>
          <p>ID: ${storageId}</p>
          <p>
            <span class="badge badge-products">📦 ${products.length} producto${products.length !== 1 ? 's' : ''}</span>
            ${products.filter(p => p.imageBase64).length > 0 ? `<span class="badge badge-images">📎 ${products.filter(p => p.imageBase64).length} imagen${products.filter(p => p.imageBase64).length !== 1 ? 'es' : ''}</span>` : ''}
          </p>
        </div>
        <div class="content">
          <div class="urgent">
            <strong>⚡ NUEVA SOLICITUD:</strong> Recibida el ${new Date().toLocaleDateString('es-CL', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </div>

          <div class="shipping-address">
            <h3>📍 Dirección de Recepción</h3>
            <p><strong>Av. Nueva Providencia 2155</strong><br>
            Oficina 1104B, Edificio Panorámico<br>
            Comuna Providencia, Santiago<br>
            Región Metropolitana<br>
            <strong>Código Postal:</strong> 7500000</p>
          </div>

          <div class="section">
            <h2>👤 Información del Cliente</h2>
            <p><span class="label">Nombre:</span><span class="value">${customerInfo.name}</span></p>
            <p><span class="label">Email:</span><span class="value">${customerInfo.email}</span></p>
            <p><span class="label">Teléfono:</span><span class="value">${customerInfo.countryCode} ${customerInfo.phone}</span></p>
            <p><span class="label">Documento:</span><span class="value">${customerInfo.document || 'No especificado'}</span></p>
            <p><span class="label">Llegada a Chile:</span><span class="value">${arrivalTimeFormatted}</span></p>
          </div>

          <div class="section">
            <h2>📦 Productos a Almacenar</h2>
            ${renderProducts()}
          </div>

          <div class="section">
            <h2>📋 Próximos Pasos</h2>
            <ul>
              <li>✅ Confirmar recepción al cliente</li>
              <li>✅ Preparar espacio de almacenaje</li>
              <li>✅ Monitorear llegada de paquetes</li>
              <li>✅ Notificar al cliente cuando lleguen los productos</li>
              <li>✅ Coordinar entrega o retiro</li>
            </ul>
          </div>
        </div>
        <div class="footer">
          <p><strong>AndesGO</strong> - Servicio de Casilla y Almacenaje</p>
          <p>Sistema automatizado de solicitudes</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateCustomerEmail(
  storageId: string,
  customerInfo: CustomerInfo,
  products: Product[],
  arrivalTimeFormatted: string
): string {
  const renderProductSummary = () => {
    return products.map((p, i) => {
      const details: string[] = []
      if (p.trackingCode) details.push(`Tracking: ${p.trackingCode}`)
      if (p.shippingCompany) details.push(`Envío: ${p.shippingCompany}`)
      const detailsStr = details.length > 0 
        ? `<br><span style="margin-left:24px; font-size:0.9em; color:#64748b;">${details.join(' • ')}</span>` 
        : ''
      return `<li><strong>${p.name}</strong> (${p.store})${detailsStr}</li>`
    }).join('')
  }

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Solicitud Recibida - AndesGO</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          background-color: #f5f5f5;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: white; 
          border-radius: 16px; 
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header { 
          background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center;
        }
        .header h1 { margin: 0 0 10px 0; font-size: 32px; }
        .header p { margin: 5px 0; opacity: 0.95; font-size: 16px; }
        .success-icon {
          font-size: 60px;
          margin-bottom: 15px;
        }
        .content { padding: 30px; }
        .info-box { 
          background: #f0f9ff; 
          border-left: 4px solid #0284c7; 
          padding: 20px; 
          margin: 20px 0; 
          border-radius: 8px;
        }
        .info-box h3 { 
          margin-top: 0; 
          color: #0284c7; 
          font-size: 18px;
        }
        .shipping-address {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 2px solid #3b82f6;
          padding: 25px;
          border-radius: 12px;
          margin: 25px 0;
        }
        .shipping-address h3 {
          color: #1e40af;
          margin-top: 0;
          font-size: 20px;
          margin-bottom: 15px;
        }
        .shipping-address p {
          margin: 5px 0;
          line-height: 1.8;
          font-size: 15px;
        }
        .shipping-address .postal-code {
          background: white;
          display: inline-block;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          color: #1e40af;
          margin-top: 10px;
          font-size: 18px;
        }
        .section { 
          margin: 25px 0; 
          padding: 20px; 
          background: #f8fafc; 
          border-radius: 12px;
        }
        .section h3 { 
          margin-top: 0; 
          color: #334155; 
          font-size: 18px;
          margin-bottom: 15px;
        }
        ul { 
          margin: 10px 0; 
          padding-left: 20px;
        }
        ul li { 
          margin: 10px 0;
          color: #475569;
          line-height: 1.6;
        }
        .highlight { 
          background: #fef3c7; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 20px 0;
          border-left: 4px solid #f59e0b;
        }
        .footer { 
          background: #f1f5f9; 
          padding: 25px; 
          text-align: center; 
          color: #64748b;
          font-size: 14px;
        }
        .footer p { margin: 5px 0; }
        .contact-button {
          display: inline-block;
          background: #0284c7;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✅</div>
          <h1>¡Solicitud Recibida!</h1>
          <p>ID: ${storageId}</p>
        </div>
        <div class="content">
          <div class="info-box">
            <h3>👋 Hola ${customerInfo.name},</h3>
            <p>Hemos recibido tu solicitud de casilla y almacenaje exitosamente. Nuestro equipo revisará tu solicitud y te contactaremos pronto.</p>
          </div>

          <div class="shipping-address">
            <h3>📍 Envía tus productos a:</h3>
            <p><strong>Av. Nueva Providencia 2155</strong><br>
            Oficina 1104B, Edificio Panorámico<br>
            Comuna Providencia, Santiago<br>
            Región Metropolitana, Chile</p>
            <div class="postal-code">📮 Código Postal: 7500000</div>
          </div>

          <div class="section">
            <h3>📦 Resumen de tu solicitud</h3>
            <p><strong>Fecha de llegada:</strong> ${arrivalTimeFormatted}</p>
            <p><strong>Productos registrados:</strong> ${products.length}</p>
            <ul>
              ${renderProductSummary()}
            </ul>
          </div>

          <div class="highlight">
            <strong>💡 Importante:</strong> Cuando realices tus compras, asegúrate de usar la dirección de arriba como destino de envío. Te recomendamos agregar tu nombre y el ID de solicitud (${storageId}) en la información del destinatario.
          </div>

          <div class="section">
            <h3>📋 Próximos pasos</h3>
            <ul>
              <li>📧 Recibirás un email de confirmación adicional con más detalles</li>
              <li>📦 Realiza tus compras y envíalas a nuestra dirección</li>
              <li>📱 Te notificaremos cuando tus paquetes lleguen</li>
              <li>✈️ Coordinaremos la entrega según tu fecha de llegada</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <p>¿Tienes alguna pregunta?</p>
            <a href="mailto:${process.env.CONTACT_EMAIL || 'contacto@andesgo.com'}" class="contact-button">
              Contáctanos
            </a>
          </div>
        </div>
        <div class="footer">
          <p><strong>AndesGO</strong></p>
          <p>Tu servicio de confianza para casilla y almacenaje en Chile</p>
          <p style="margin-top: 15px; font-size: 12px;">Este es un email automático. Por favor no respondas directamente a este mensaje.</p>
        </div>
      </div>
    </body>
    </html>
  `
}