# Migración a Serverless Functions - Guía Completa

## ✅ Cambios Realizados

### 1. **Backend Refactorizado** (`backend/src/routes/inspecciones.ts`)
   - ✅ Convertido de Express Router a funciones handler puras
   - ✅ Exporta 3 handlers: `handlePost`, `handleGetById`, `handleGetAll`
   - ✅ Sin dependencias de Express en los handlers

### 2. **Serverless Function** (`backend/api/inspecciones.ts`)
   - ✅ Handler principal para Vercel
   - ✅ Maneja CORS automáticamente
   - ✅ Parsea JSON del body
   - ✅ Routing interno (POST, GET all, GET by ID)
   - ✅ Manejo centralizado de errores

### 3. **Configuración Vercel** (`vercel.json`)
   - ✅ Rutas configuradas correctamente
   - ✅ `/api/inspecciones` → serverless function
   - ✅ Frontend servido desde `/`

### 4. **Frontend** 
   - ✅ Ya configurado con `API_BASE_URL = '/api'`
   - ✅ No requiere cambios

---

## 🚀 Uso desde el Frontend

### Ejemplo 1: Crear Inspección (POST)

```typescript
// En tu componente React/TypeScript
import { inspeccionesApi } from '../api/inspecciones';

async function crearInspeccion() {
  try {
    const nuevaInspeccion = {
      ownerName: 'Juan Pérez',
      brandModel: 'Toyota Corolla',
      plate: 'ABC123',
      notes: 'Inspección rutinaria',
      photos: ['data:image/jpeg;base64,...', 'data:image/jpeg;base64,...'],
      signature: 'data:image/png;base64,...',
      createdAt: new Date().toISOString()
    };

    const resultado = await inspeccionesApi.create(nuevaInspeccion);
    console.log('Inspección creada:', resultado);
    // resultado.id → ID de la inspección creada
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Ejemplo 2: Obtener Todas las Inspecciones (GET)

```typescript
async function listarInspecciones() {
  try {
    const resultado = await inspeccionesApi.getAll({
      search: 'Toyota',      // Opcional: buscar por texto
      sortBy: 'created_at',  // Opcional: ordenar por campo
      sortOrder: 'DESC',     // Opcional: ASC o DESC
      page: 1,               // Opcional: página actual
      limit: 10              // Opcional: items por página
    });

    console.log('Inspecciones:', resultado.data);
    console.log('Total:', resultado.pagination.total);
    console.log('Páginas:', resultado.pagination.totalPages);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Ejemplo 3: Obtener por ID (GET)

```typescript
async function obtenerInspeccion(id: number) {
  try {
    const inspeccion = await inspeccionesApi.getById(id);
    console.log('Inspección encontrada:', inspeccion);
    // inspeccion.ownerName, inspeccion.photos, etc.
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Ejemplo 4: Fetch Directo (sin API wrapper)

```typescript
// POST - Crear inspección
const response = await fetch('/api/inspecciones', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ownerName: 'María García',
    brandModel: 'Honda Civic',
    plate: 'XYZ789',
    photos: ['data:image/jpeg;base64,...'],
    signature: 'data:image/png;base64,...'
  })
});
const data = await response.json();

// GET - Listar todas
const response = await fetch('/api/inspecciones?search=Honda&page=1&limit=10');
const data = await response.json();

// GET - Por ID
const response = await fetch('/api/inspecciones/123');
const data = await response.json();
```

---

## 📦 Deployment en Vercel

### Opción 1: Deploy desde CLI
```bash
npm install -g vercel
vercel --prod
```

### Opción 2: Deploy desde Git
1. Conecta tu repo en vercel.com
2. Push a main/master
3. Vercel hace auto-deploy

### Variables de Entorno en Vercel
Configura en el dashboard de Vercel:
- `DATABASE_URL` → Connection string de PostgreSQL
- `DEBUG_MODE` → `true` (opcional, para logs)

---

## 🧪 Testing Local

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

El frontend hace requests a `/api/inspecciones` y funciona tanto local como en producción.

---

## 🔍 Debugging

### Ver logs en Vercel:
```bash
vercel logs [deployment-url]
```

### Ver logs locales:
Los `console.log` en los handlers se muestran en la terminal del backend.

---

## ✨ Ventajas de esta Arquitectura

✅ **Serverless**: No necesitas mantener un servidor corriendo  
✅ **Escalable**: Vercel escala automáticamente según tráfico  
✅ **CORS**: Manejado automáticamente en el serverless function  
✅ **Sin cambios en Frontend**: La API sigue siendo `/api/inspecciones`  
✅ **Desarrollo Local**: Puedes seguir usando `npm run dev` normalmente  

---

## 📝 Estructura Final

```
vehicle-inspection-app/
├── backend/
│   ├── api/
│   │   ├── inspecciones.ts    ← 🆕 Serverless Function Principal
│   │   └── index.ts            ← Health check (opcional)
│   ├── src/
│   │   ├── routes/
│   │   │   └── inspecciones.ts ← 🔄 Handlers Puros (refactorizado)
│   │   ├── database/
│   │   │   └── db.ts
│   │   └── types/
│   │       └── inspeccion.ts
│   └── package.json
├── frontend/
│   └── src/
│       └── api/
│           └── inspecciones.ts  ← Sin cambios, funciona igual
├── vercel.json                  ← 🆕 Configuración de rutas
└── README.md
```

---

## 🎯 Next Steps

1. **Deploy a Vercel**: `vercel --prod`
2. **Configura variables de entorno** en el dashboard
3. **Prueba los endpoints** desde el frontend en producción
4. **Monitorea logs** con `vercel logs`

¡Listo! Tu backend ahora es 100% serverless y está optimizado para Vercel. 🚀
