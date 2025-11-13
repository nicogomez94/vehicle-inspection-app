import { useState } from 'react';

interface Step2Props {
  data: {
    photos: string[];
    notes: string;
  };
  onNext: (data: { photos: string[]; notes: string }) => void;
  onBack: () => void;
}

const Step2: React.FC<Step2Props> = ({ data, onNext, onBack }) => {
  const [photos, setPhotos] = useState<string[]>(data.photos);
  const [notes, setNotes] = useState(data.notes);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotos((prev) => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input to allow re-uploading the same file
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ photos, notes });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Paso 2: Fotos y Observaciones</h2>
      
      <div className="photo-upload">
        <label>
          Fotos del Vehículo
          <span className="required">*</span>
        </label>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
          Agregue fotos del vehículo (se permiten múltiples imágenes)
        </p>
        <input
          type="file"
          id="photo-input"
          className="photo-input"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <label htmlFor="photo-input" className="photo-upload-btn">
          📷 Seleccionar Fotos
        </label>

        {photos.length > 0 && (
          <div className="photo-preview-grid">
            {photos.map((photo, index) => (
              <div key={index} className="photo-preview-item">
                <img src={photo} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  className="photo-remove-btn"
                  onClick={() => handleRemovePhoto(index)}
                  title="Eliminar foto"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="notes">Observaciones (opcional)</label>
        <textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ingrese cualquier observación adicional sobre el vehículo"
        />
      </div>

      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Volver
        </button>
        <button type="submit" className="btn btn-primary" disabled={photos.length === 0}>
          Siguiente
        </button>
      </div>
    </form>
  );
};

export default Step2;
