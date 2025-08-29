// app/api/send-email/route.ts (nota el nombre correcto del directorio)
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Inicializar Resend con tu API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Interfaces para tipado
interface ProductItem {
  id: string
  url: string
  quantity: number
  color: string
  size: string
  notes: string
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
  countryCode: string
  arrivalDate: string
  deliveryOption: 'pickup' | 'hotel'
  hotelName: string
  hotelAddress: string
  hotelCommune: string
  hotelOther: string
}

interface RequestBody {
  customerInfo: CustomerInfo
  products: ProductItem[]
}

export async function POST(request: NextRequest) {
  try {
    // Parsear el body de la request
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
    const requiredFields = ['name', 'email', 'phone', 'arrivalDate']
    for (const field of requiredFields) {
      if (!customerInfo[field as keyof CustomerInfo]) {
        return NextResponse.json(
          { error: `Campo requerido faltante: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validar productos
    for (const product of products) {
      if (!product.url || !product.quantity || product.quantity < 1) {
        return NextResponse.json(
          { error: 'Todos los productos deben tener URL válida y cantidad mayor a 0' },
          { status: 400 }
        )
      }
    }

    // Generar ID único para la cotización
    const quotationId = `ANX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Crear HTML para el email al administrador
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nueva Cotización AndesGO</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
          .product-item { background: #f1f5f9; margin: 10px 0; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; }
          .label { font-weight: 600; color: #374151; }
          .value { margin-left: 10px; }
          .urgent { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Nueva Cotización AndesGO</h1>
            <p>ID: ${quotationId}</p>
          </div>
          <div class="content">
            <div class="urgent">
              <strong>⚡ ACCIÓN REQUERIDA:</strong> Nueva cotización recibida el ${new Date().toLocaleDateString('es-CL', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>

            <div class="section">
              <h2>👤 Información del Cliente</h2>
              <p><span class="label">Nombre:</span><span class="value">${customerInfo.name}</span></p>
              <p><span class="label">Email:</span><span class="value">${customerInfo.email}</span></p>
              <p><span class="label">Teléfono:</span><span class="value">${customerInfo.countryCode} ${customerInfo.phone}</span></p>
              <p><span class="label">Fecha de llegada:</span><span class="value">${new Date(customerInfo.arrivalDate).toLocaleDateString('es-CL')}</span></p>
              <p><span class="label">Tipo de entrega:</span><span class="value">${customerInfo.deliveryOption === 'pickup' ? 'Retiro en oficina' : 'Entrega en hotel'}</span></p>
              ${customerInfo.deliveryOption === 'hotel' ? `
                <p><span class="label">Hotel:</span><span class="value">${customerInfo.hotelName}</span></p>
                <p><span class="label">Dirección:</span><span class="value">${customerInfo.hotelAddress}</span></p>
              ` : ''}
            </div>

            <div class="section">
              <h2>🛍️ Productos Solicitados (${products.length})</h2>
              ${products.map((product, index) => `
                <div class="product-item">
                  <h3>Producto #${index + 1}</h3>
                  <p><span class="label">URL:</span> <a href="${product.url}" target="_blank">${product.url}</a></p>
                  <p><span class="label">Cantidad:</span><span class="value">${product.quantity}</span></p>
                  ${product.color ? `<p><span class="label">Color:</span><span class="value">${product.color}</span></p>` : ''}
                  ${product.size ? `<p><span class="label">Tamaño:</span><span class="value">${product.size}</span></p>` : ''}
                  ${product.notes ? `<p><span class="label">Notas:</span><span class="value">${product.notes}</span></p>` : ''}
                </div>
              `).join('')}
            </div>

            <div class="section">
              <h2>📋 Próximos Pasos</h2>
              <ul>
                <li>✅ Revisar disponibilidad de productos</li>
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

    // Crear HTML para el email al cliente
    const customerEmailHtml = `
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
          .cta-button { background: linear-gradient(135deg, #2563eb, #059669); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 20px 0; font-weight: bold; }
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
              <p>Hemos recibido tu solicitud de cotización para <strong>${products.length} producto(s)</strong> y ya estamos trabajando en ella.</p>
              
              <h3>📦 Resumen de tu solicitud:</h3>
              
              <ul>
                ${products.map((product, index) => {
                  // Armamos un array con los detalles opcionales
                  const details: string[] = [];
                  if (product.notes) details.push(`Notas: ${product.notes}`);
                  if (product.size) details.push(`Tamaño: ${product.size}`);
                  if (product.color) details.push(`Color: ${product.color}`);

                  // Unimos los detalles con " - " o salto de línea
                  const detailsFormatted = details.length > 0
                    ? `<br><span style="margin-left:16px; font-size:0.9em; color:#555;">${details.join(' • ')}</span>`
                    : "";

                  return `<li><strong>Producto #${index + 1}</strong> - Cantidad: ${product.quantity}${detailsFormatted}</li>`;
                }).join('')}
              </ul>
              
              <p><strong>Fecha de llegada:</strong> ${new Date(customerInfo.arrivalDate).toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Tipo de entrega:</strong> ${customerInfo.deliveryOption === 'pickup' ? 'Retiro en oficina' : 'Entrega en hotel'}</p>
            </div>

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
                  <p>Después de tu confirmación</p>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>📞 ¿Necesitas ayuda?</h2>
              <p>Nuestro equipo está aquí para ayudarte:</p>
              <ul>
                <li><strong>Email:</strong> contacto@andesgo.com</li>
                <li><strong>WhatsApp:</strong> +56 9 XXXX XXXX</li>
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
    
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY no está configurada')
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      )
    }

    // Enviar email al administrador
    const adminEmail = await resend.emails.send({
      from: 'AndesGO <noreply@andesgo.cl>', // Cambia por tu dominio verificado
      to: [process.env.ADMIN_EMAIL || 'admin@andesgo.com'], // Tu email de administrador
      subject: `🚨 Nueva Cotización #${quotationId} - ${customerInfo.name}`,
      html: adminEmailHtml,
      replyTo: customerInfo.email
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
      replyTo: process.env.ADMIN_EMAIL || 'contacto@andesgo.com'
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
    message: customerEmail?.data?.id 
      ? 'Cotización enviada exitosamente' 
      : 'Cotización recibida. Confirmación al cliente pendiente.',
    data: {
      quotationId,
      emailsSent: {
        admin: !!adminEmail.data?.id,
        customer: !!customerEmail?.data?.id
      },
      warnings: customerEmailError ? ['No se pudo enviar confirmación al cliente'] : []
    }
  }, { status: 200 })
   

  } catch (error) {
    console.error('Error en send-email API:', error)
    
    // Manejar diferentes tipos de errores
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, { status: 500 })
    }

    return NextResponse.json({
      success: false,
      error: 'Error desconocido al procesar la solicitud'
    }, { status: 500 })
  }
}

// Método GET para healthcheck (opcional)
export async function GET() {
  return NextResponse.json({
    status: 'OK',
    service: 'AndesGO Email Service',
    timestamp: new Date().toISOString()
  })
}