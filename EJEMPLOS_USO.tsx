// 🚀 Ejemplo de uso completo desde el frontend

import { inspeccionesApi } from '../api/inspecciones';

// ============================================
// EJEMPLO 1: Crear nueva inspección
// ============================================
async function ejemploCrearInspeccion() {
  const nuevaInspeccion = {
    ownerName: 'Carlos Rodríguez',
    brandModel: 'Ford Focus 2020',
    plate: 'LMN456',
    notes: 'Vehículo en excelente estado. Sin daños visibles.',
    photos: [
      'data:image/jpeg;base64,/9j/4AAQSkZJRg...',  // Foto frontal
      'data:image/jpeg;base64,/9j/4AAQSkZJRg...',  // Foto lateral
      'data:image/jpeg;base64,/9j/4AAQSkZJRg...',  // Foto trasera
    ],
    signature: 'data:image/png;base64,iVBORw0KGgo...',
    createdAt: new Date().toISOString()
  };

  try {
    const resultado = await inspeccionesApi.create(nuevaInspeccion);
    console.log('✅ Inspección creada con ID:', resultado.id);
    return resultado;
  } catch (error) {
    console.error('❌ Error al crear inspección:', error);
    throw error;
  }
}

// ============================================
// EJEMPLO 2: Listar con filtros y paginación
// ============================================
async function ejemploListarConFiltros() {
  try {
    const resultado = await inspeccionesApi.getAll({
      search: 'Ford',           // Busca en owner, brand, plate y notes
      sortBy: 'created_at',     // Opciones: id, owner_name, brand_model, plate, created_at
      sortOrder: 'DESC',        // DESC para más recientes primero
      page: 1,
      limit: 20
    });

    console.log(`📋 Encontradas ${resultado.data.length} de ${resultado.pagination.total} inspecciones`);
    console.log(`📄 Página ${resultado.pagination.page} de ${resultado.pagination.totalPages}`);
    
    resultado.data.forEach(inspeccion => {
      console.log(`- ID: ${inspeccion.id} | ${inspeccion.brandModel} | ${inspeccion.plate}`);
    });

    return resultado;
  } catch (error) {
    console.error('❌ Error al listar:', error);
    throw error;
  }
}

// ============================================
// EJEMPLO 3: Obtener por ID específico
// ============================================
async function ejemploObtenerPorId(id: number) {
  try {
    const inspeccion = await inspeccionesApi.getById(id);
    
    console.log('🔍 Inspección encontrada:');
    console.log('  Propietario:', inspeccion.ownerName);
    console.log('  Vehículo:', inspeccion.brandModel);
    console.log('  Placa:', inspeccion.plate);
    console.log('  Fotos:', inspeccion.photos.length);
    console.log('  Fecha:', new Date(inspeccion.createdAt).toLocaleString());
    
    return inspeccion;
  } catch (error) {
    console.error('❌ Inspección no encontrada:', error);
    throw error;
  }
}

// ============================================
// EJEMPLO 4: Fetch directo (sin wrapper)
// ============================================
async function ejemploFetchDirecto() {
  // POST - Crear
  const responsePost = await fetch('/api/inspecciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ownerName: 'Ana López',
      brandModel: 'Chevrolet Spark',
      plate: 'QWE789',
      photos: ['data:image/jpeg;base64,...'],
      signature: 'data:image/png;base64,...'
    })
  });
  
  if (!responsePost.ok) {
    throw new Error('Error al crear inspección');
  }
  
  const nuevaInspeccion = await responsePost.json();
  console.log('✅ Creada:', nuevaInspeccion.id);

  // GET - Listar
  const responseGet = await fetch('/api/inspecciones?search=Chevrolet&page=1&limit=10');
  const lista = await responseGet.json();
  console.log('📋 Total:', lista.pagination.total);

  // GET - Por ID
  const responseById = await fetch(`/api/inspecciones/${nuevaInspeccion.id}`);
  const inspeccion = await responseById.json();
  console.log('🔍 Encontrada:', inspeccion.brandModel);
}

// ============================================
// EJEMPLO 5: En un componente React
// ============================================
import React, { useState, useEffect } from 'react';

function ListaInspecciones() {
  const [inspecciones, setInspecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    cargarInspecciones();
  }, [busqueda, pagina]);

  async function cargarInspecciones() {
    setLoading(true);
    try {
      const resultado = await inspeccionesApi.getAll({
        search: busqueda,
        page: pagina,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      });
      setInspecciones(resultado.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <input 
        type="text" 
        placeholder="Buscar..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {inspecciones.map(ins => (
            <li key={ins.id}>
              {ins.brandModel} - {ins.plate}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListaInspecciones;
