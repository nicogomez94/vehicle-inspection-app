import React, { useRef, useState, useEffect } from 'react';

interface Step3Props {
  data: {
    signature: string;
  };
  onFinish: (data: { signature: string }) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const Step3: React.FC<Step3Props> = ({ data, onFinish, onBack, isSubmitting }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!data.signature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Load existing signature if any
    if (data.signature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = data.signature;
    }
  }, [data.signature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL('image/png');
    onFinish({ signature: signatureData });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Paso 3: Firma del Cliente</h2>
      
      <div className="signature-pad-container">
        <label>
          Firma
          <span className="required">*</span>
        </label>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
          Dibuje su firma en el área a continuación
        </p>
        <canvas
          ref={canvasRef}
          className="signature-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        <div className="signature-actions">
          <button type="button" className="btn-clear" onClick={clearSignature}>
            Limpiar
          </button>
        </div>
      </div>

      <div className="button-group">
        <button type="button" className="btn btn-secondary" onClick={onBack} disabled={isSubmitting}>
          Volver
        </button>
        <button type="submit" className="btn btn-success" disabled={!hasSignature || isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Finalizar'}
        </button>
      </div>
    </form>
  );
};

export default Step3;
