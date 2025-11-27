// app/components/ClientAnalytics.tsx
'use client'

import { Analytics } from '@vercel/analytics/react'

export default function ClientAnalytics() {
  // Opcional: solo renderizar en producción
//   if (process.env.NODE_ENV !== 'production') return null

  return <Analytics />
}
