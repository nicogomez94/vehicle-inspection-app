import { useState, useEffect } from 'react';
import { inspeccionesApi, GetAllParams } from '../api/inspecciones';
import { InspeccionResponse } from '../types/inspeccion';
import '../styles/Admin.css';

const Admin: React.FC = () => {
  const [inspecciones, setInspecciones] = useState<InspeccionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [selectedInspection, setSelectedInspection] = useState<InspeccionResponse | null>(null);

  useEffect(() => {
    fetchInspecciones();
  }, [search, sortBy, sortOrder, page]);

  const fetchInspecciones = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: GetAllParams = {
        search,
        sortBy,
        sortOrder,
        page,
        limit
      };

      const response = await inspeccionesApi.getAll(params);
      setInspecciones(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar inspecciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleViewDetails = (inspeccion: InspeccionResponse) => {
    setSelectedInspection(inspeccion);
  };

  const closeModal = () => {
    setSelectedInspection(null);
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return '⇅';
    return sortOrder === 'ASC' ? '↑' : '↓';
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de Administración - Inspecciones</h1>
        <div className="admin-stats">
          <span>Total de inspecciones: {total}</span>
        </div>
      </div>

      <div className="admin-controls">
        <input
          type="text"
          placeholder="Buscar por propietario, marca, placa o notas..."
          value={search}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <>
          <div className="table-container">
            <table className="inspections-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('id')} className="sortable">
                    ID {getSortIcon('id')}
                  </th>
                  <th onClick={() => handleSort('owner_name')} className="sortable">
                    Propietario {getSortIcon('owner_name')}
                  </th>
                  <th onClick={() => handleSort('brand_model')} className="sortable">
                    Marca/Modelo {getSortIcon('brand_model')}
                  </th>
                  <th onClick={() => handleSort('plate')} className="sortable">
                    Placa {getSortIcon('plate')}
                  </th>
                  <th onClick={() => handleSort('created_at')} className="sortable">
                    Fecha {getSortIcon('created_at')}
                  </th>
                  <th>Fotos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inspecciones.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="no-data">No hay inspecciones</td>
                  </tr>
                ) : (
                  inspecciones.map((inspeccion) => (
                    <tr key={inspeccion.id}>
                      <td>{inspeccion.id}</td>
                      <td>{inspeccion.ownerName}</td>
                      <td>{inspeccion.brandModel}</td>
                      <td>{inspeccion.plate}</td>
                      <td>{new Date(inspeccion.createdAt).toLocaleString('es-ES')}</td>
                      <td>{inspeccion.photos.length}</td>
                      <td>
                        <button 
                          className="btn-view"
                          onClick={() => handleViewDetails(inspeccion)}
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-pagination"
              >
                ← Anterior
              </button>
              <span className="page-info">
                Página {page} de {totalPages}
              </span>
              <button 
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn-pagination"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal de detalles */}
      {selectedInspection && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de Inspección #{selectedInspection.id}</h2>
              <button className="btn-close" onClick={closeModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>Información del Vehículo</h3>
                <p><strong>Propietario:</strong> {selectedInspection.ownerName}</p>
                <p><strong>Marca/Modelo:</strong> {selectedInspection.brandModel}</p>
                <p><strong>Placa:</strong> {selectedInspection.plate}</p>
                <p><strong>Fecha:</strong> {new Date(selectedInspection.createdAt).toLocaleString('es-ES')}</p>
                {selectedInspection.notes && (
                  <p><strong>Notas:</strong> {selectedInspection.notes}</p>
                )}
              </div>

              <div className="detail-section">
                <h3>Fotos del Vehículo</h3>
                <div className="photos-grid">
                  {selectedInspection.photos.map((photo, index) => (
                    <img 
                      key={index} 
                      src={photo} 
                      alt={`Foto ${index + 1}`}
                      className="photo-thumbnail"
                    />
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Firma</h3>
                <img 
                  src={selectedInspection.signature} 
                  alt="Firma"
                  className="signature-image"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
