// app/api/bodegaje/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Simulación de base de datos - en producción usarías una DB real
const reservas: any[] = []

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Validar datos requeridos
    const requiredFields = ['nombre', 'apellido', 'telefono', 'documento', 'planTipo']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Campo requerido faltante: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validar fechas según el plan
    if (data.planTipo === '0') {
      // Plan por hora: solo necesita fechaIngreso
      if (!data.fechaIngreso) {
        return NextResponse.json(
          { error: 'Fecha de servicio requerida para plan por hora' },
          { status: 400 }
        )
      }
    } else {
      // Plan por día/semana: necesita ambas fechas
      if (!data.fechaIngreso || !data.fechaRetiro) {
        return NextResponse.json(
          { error: 'Fechas de ingreso y retiro requeridas' },
          { status: 400 }
        )
      }
      
      // Validar que fecha de retiro sea posterior a ingreso
      if (new Date(data.fechaRetiro) <= new Date(data.fechaIngreso)) {
        return NextResponse.json(
          { error: 'La fecha de retiro debe ser posterior a la de ingreso' },
          { status: 400 }
        )
      }
    }

    // Calcular el total en el backend
    const total = calcularTotalBackend(data)
    
    // Crear la reserva
    const reserva = {
      id: Date.now().toString(),
      ...data,
      total,
      fechaCreacion: new Date().toISOString(),
      estado: 'pendiente'
    }

    // Guardar en "base de datos" (simulada)
    reservas.push(reserva)

    // En producción, aquí enviarías emails, notificaciones, etc.
    console.log('Nueva reserva creada:', reserva)

    return NextResponse.json(
      { 
        message: 'Reserva creada exitosamente',
        reserva: {
          id: reserva.id,
          total: reserva.total,
          estado: reserva.estado
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error processing bodegaje request:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Endpoint para obtener reservas (opcional, para admin)
    const url = new URL(request.url)
    const reservaId = url.searchParams.get('id')

    if (reservaId) {
      const reserva = reservas.find(r => r.id === reservaId)
      if (!reserva) {
        return NextResponse.json(
          { error: 'Reserva no encontrada' },
          { status: 404 }
        )
      }
      return NextResponse.json(reserva)
    }

    // Devolver todas las reservas (solo para admin)
    return NextResponse.json({
      total: reservas.length,
      reservas: reservas.map(r => ({
        id: r.id,
        nombre: `${r.nombre} ${r.apellido}`,
        planTipo: r.planTipo,
        total: r.total,
        fechaCreacion: r.fechaCreacion,
        estado: r.estado
      }))
    })

  } catch (error) {
    console.error('Error getting reservas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para calcular el total en el backend
function calcularTotalBackend(data: any): number {
  const planes = {
    '0': { nombre: 'Por hora', precio: 1000 },
    '1': { nombre: 'Por día', precio: 5000 },
    '2': { nombre: 'Por semana', precio: 28000 }
  }

  const planSeleccionado = planes[data.planTipo as keyof typeof planes]
  if (!planSeleccionado) return 0

  if (data.planTipo === '0') {
    // Plan por hora: máximo $5,000
    const horas = parseInt(data.horas) || 1
    return Math.min(horas * planSeleccionado.precio, 5000)
  } else if (data.planTipo === '1') {
    // Plan por día: $5,000 por día, descuento 20% si >= 7 días
    if (!data.fechaIngreso || !data.fechaRetiro) return 0
    
    const fechaInicio = new Date(data.fechaIngreso)
    const fechaFin = new Date(data.fechaRetiro)
    const diferenciaTiempo = fechaFin.getTime() - fechaInicio.getTime()
    const dias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24))
    
    if (dias < 1) return 0
    
    const subtotal = dias * planSeleccionado.precio
    return dias >= 7 ? Math.round(subtotal * 0.8) : subtotal // 20% descuento si >= 7 días
  } else if (data.planTipo === '2') {
    // Plan por semana: precio fijo
    return planSeleccionado.precio
  }

  return 0
}

// // Función para validar formato de teléfono chileno (opcional)
// function validarTelefonoChileno(telefono: string): boolean {
//   // Regex básico para teléfonos chilenos (+56 9 XXXX XXXX)
//   const regex = /^(\+?56\s?)?[9]\s?\d{4}\s?\d{4}$/
//   return regex.test(telefono.replace(/\s/g, ''))
// }

// // Función para validar documento (opcional)
// function validarDocumento(documento: string, tipo: string): boolean {
//   if (tipo === 'dni') {
//     // RUT chileno básico (sin validación de DV completa)
//     return /^\d{7,8}-[\dkK]$/.test(documento) || /^\d{8,9}$/.test(documento)
//   } else if (tipo === 'passport') {
//     // Pasaporte: letras y números, 6-9 caracteres
//     return /^[A-Z0-9]{6,9}$/i.test(documento)
//   }
//   return false
// }