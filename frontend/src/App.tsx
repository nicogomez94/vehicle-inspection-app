import React, { useState } from 'react';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import { inspeccionesApi } from './api/inspecciones';
import { InspeccionData } from './types/inspeccion';
import './index.css';

interface FormData {
  ownerName: string;
  brandModel: string;
  plate: string;
  notes: string;
  photos: string[];
  signature: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    ownerName: '',
    brandModel: '',
    plate: '',
    notes: '',
    photos: [],
    signature: '',
  });

  const handleStep1Next = (data: { ownerName: string; brandModel: string; plate: string }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (data: { photos: string[]; notes: string }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Finish = async (data: { signature: string }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const finalData: InspeccionData = {
        ownerName: formData.ownerName,
        brandModel: formData.brandModel,
        plate: formData.plate,
        notes: formData.notes || undefined,
        photos: formData.photos,
        signature: data.signature,
        createdAt: new Date().toISOString(),
      };

      const response = await inspeccionesApi.create(finalData);
      setSubmittedId(response.id!);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el formulario');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  if (submittedId) {
    return (
      <div className="wizard-container">
        <div className="success-message">
          <h2>✓ Inspección Registrada</h2>
          <p>La inspección del vehículo ha sido registrada exitosamente.</p>
          <p style={{ marginTop: '10px' }}>ID de inspección: {submittedId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h1>Registro de Inspección de Vehículo</h1>
        <div className="step-indicator">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}></div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="wizard-content">
        {currentStep === 1 && (
          <Step1
            data={{
              ownerName: formData.ownerName,
              brandModel: formData.brandModel,
              plate: formData.plate,
            }}
            onNext={handleStep1Next}
          />
        )}

        {currentStep === 2 && (
          <Step2
            data={{
              photos: formData.photos,
              notes: formData.notes,
            }}
            onNext={handleStep2Next}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <Step3
            data={{
              signature: formData.signature,
            }}
            onFinish={handleStep3Finish}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

export default App;
