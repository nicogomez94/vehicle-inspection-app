import { useState } from 'react';

interface Step1Props {
  data: {
    ownerName: string;
    brandModel: string;
    plate: string;
  };
  onNext: (data: { ownerName: string; brandModel: string; plate: string }) => void;
}

const Step1: React.FC<Step1Props> = ({ data, onNext }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const isValid = formData.ownerName && formData.brandModel && formData.plate;

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Paso 1: Datos del Vehículo</h2>
      
      <div className="form-group">
        <label htmlFor="ownerName">
          Nombre del Propietario
          <span className="required">*</span>
        </label>
        <input
          type="text"
          id="ownerName"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
          placeholder="Ingrese el nombre del propietario"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="brandModel">
          Marca y Modelo
          <span className="required">*</span>
        </label>
        <input
          type="text"
          id="brandModel"
          name="brandModel"
          value={formData.brandModel}
          onChange={handleChange}
          placeholder="Ej: Toyota Corolla 2020"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="plate">
          Placa
          <span className="required">*</span>
        </label>
        <input
          type="text"
          id="plate"
          name="plate"
          value={formData.plate}
          onChange={handleChange}
          placeholder="Ej: ABC-123"
          required
        />
      </div>

      <div className="button-group">
        <button type="submit" className="btn btn-primary" disabled={!isValid}>
          Siguiente
        </button>
      </div>
    </form>
  );
};

export default Step1;
