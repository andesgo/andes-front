# AndesGO

## 📋 Descripción del Proyecto

AndesGO es una plataforma web que facilita las compras en Chile para personas que se encuentran en el extranjero. La aplicación ofrece dos servicios principales:

1. **Servicio de Shopping Personal**: Los usuarios pueden solicitar productos que desean comprar en Chile, y AndesGO gestiona todo el proceso de compra, recogida y almacenamiento.
2. **Servicio de Bodegaje**: Los usuarios pueden solicitar almacenamiento temporal de su equipaje durante sus viajes a Chile.

La plataforma permite compras con pago en cuotas y elimina las complicaciones de comprar desde el extranjero.

---

## 🎯 Funcionalidades Principales

### 1. Solicitud de Compras (Shopping Personal)
- Formulario para capturar información personal del usuario
- Registro de fecha de llegada a Chile
- Listado de productos deseados
- Gestión logística completa de las compras
- Sistema de notificaciones por email

### 2. Bodegaje de Equipaje
- Formulario de solicitud de almacenamiento
- Selección de fechas de custodia
- Información de contacto y detalles del equipaje
- Confirmación por correo electrónico

### 3. Página de Éxito
- Confirmación visual de solicitudes enviadas
- Redirección automática después de completar formularios

---

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: CSS Modules / Global CSS
- **APIs**: Next.js Route Handlers (API Routes)
- **Notificaciones**: Sistema de envío de emails integrado

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx              # Layout principal de la aplicación
│   ├── page.tsx                # Página de inicio
│   ├── globals.css             # Estilos globales
│   ├── favicon.ico             # Icono de la aplicación
│   │
│   ├── api/                    # Endpoints de la API
│   │   ├── bodegaje/
│   │   │   └── route.ts        # API para solicitudes de bodegaje
│   │   ├── sendmail/
│   │   │   └── route.ts        # API para envío de emails
│   │   ├── test/
│   │   │   └── route.ts        # API de pruebas
│   │   └── tiendas/
│   │       └── route.ts        # API de información de tiendas
│   │
│   ├── solicitar/
│   │   └── page.tsx            # Formulario de solicitud de compras
│   │
│   ├── bodegaje/
│   │   └── page.tsx            # Formulario de bodegaje
│   │
│   └── success/
│       └── page.tsx            # Página de confirmación
│
└── lib/
    └── tiendas.ts              # Utilidades y datos de tiendas
```

---

## 🔑 Componentes Clave

### Layout Principal (`layout.tsx`)
Define la estructura HTML base de la aplicación con metadata SEO:
- **Title**: "AndesGO - Compra en Chile desde el extranjero fácilmente"
- **Description**: Descripción completa de los servicios
- **Keywords**: SEO optimizado para búsquedas relacionadas con compras en Chile

### Rutas de API

#### `/api/bodegaje`
Maneja las solicitudes de almacenamiento de equipaje.
- Método: POST
- Procesa información del usuario y fechas de bodegaje
- Dispara notificación por email

#### `/api/sendmail`
Servicio centralizado para envío de correos electrónicos.
- Envía confirmaciones a usuarios
- Notifica al equipo de AndesGO sobre nuevas solicitudes

#### `/api/tiendas`
Proporciona información sobre tiendas disponibles en Chile.
- Catálogo de tiendas soportadas
- Información de productos y disponibilidad

#### `/api/test`
Endpoint de pruebas para desarrollo y debugging.

### Páginas

#### `/solicitar`
Formulario principal para solicitudes de compra:
- Datos personales del usuario
- Fecha de llegada a Chile
- Lista de productos deseados
- Preferencias de entrega

#### `/bodegaje`
Formulario de solicitud de bodegaje:
- Información de contacto
- Fechas de inicio y fin del almacenamiento
- Detalles del equipaje
- Instrucciones especiales

#### `/success`
Página de confirmación que se muestra después de:
- Envío exitoso de formulario de compras
- Confirmación de solicitud de bodegaje

---

## 🚀 Cómo Usar Este README con Claude

Este README está diseñado para ser usado como contexto en proyectos Claude. Puedes:

1. **Consultar sobre arquitectura**: "¿Cómo está estructurada la API de bodegaje?"
2. **Solicitar modificaciones**: "Agrega validación de formularios en /solicitar"
3. **Debugging**: "El endpoint /api/sendmail no está funcionando, ¿qué revisar?"
4. **Nuevas funcionalidades**: "Quiero agregar un sistema de seguimiento de pedidos"
5. **Optimizaciones**: "¿Cómo puedo mejorar el SEO de la página principal?"

### Ejemplos de Prompts Útiles
- "Explica el flujo completo desde que un usuario solicita una compra hasta que recibe confirmación"
- "¿Qué archivos necesito modificar para cambiar el diseño del formulario de bodegaje?"
- "Crea un nuevo endpoint para consultar el estado de una solicitud"
- "Agrega validación de TypeScript al formulario de solicitar"

---

## 🔧 Configuración y Desarrollo

### Prerequisitos
```bash
Node.js 18+
npm o yarn
```

### Instalación
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start
```

### Variables de Entorno
Crea un archivo `.env.local` con:
```env
# Configuración de email
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

# Otras configuraciones
NEXT_PUBLIC_API_URL=
```

---

## 📝 Notas de Desarrollo

### Convenciones de Código
- Usar TypeScript para type safety
- Componentes en PascalCase
- Funciones y variables en camelCase
- Interfaces prefijadas con `I` (opcional)

### Buenas Prácticas
- Validar datos en cliente y servidor
- Manejar errores con try-catch en APIs
- Usar loading states en formularios
- Implementar rate limiting en endpoints públicos

---

## 🤝 Flujo de Usuario

### Servicio de Compras
1. Usuario accede a `/solicitar`
2. Completa formulario con datos personales y productos
3. Submit del formulario → POST a `/api/sendmail`
4. Email de confirmación enviado
5. Redirección a `/success`

### Servicio de Bodegaje
1. Usuario accede a `/bodegaje`
2. Completa formulario con fechas y detalles
3. Submit del formulario → POST a `/api/bodegaje`
4. Confirmación por email
5. Redirección a `/success`

---

## 📧 Contacto y Soporte

Para preguntas sobre el código o funcionalidades, consulta este README con Claude y obtén asistencia inmediata sobre:
- Implementación de nuevas features
- Resolución de bugs
- Optimización de código
- Mejores prácticas de Next.js y TypeScript

---

## 🌟 Roadmap Futuro

- [ ] Sistema de autenticación de usuarios
- [ ] Dashboard para tracking de pedidos
- [ ] Integración con pasarelas de pago
- [ ] API de notificaciones push
- [ ] Panel administrativo
- [ ] Multi-idioma (i18n)

---

**Versión**: 1.0.0  
**Última actualización**: 2025