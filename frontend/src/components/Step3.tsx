import { useRef, useState, useEffect } from 'react';

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
  const [showModal, setShowModal] = useState(false);

  const [tempSignature, setTempSignature] = useState<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Load existing signature if any (prefer tempSignature over data.signature)
    const signatureToLoad = tempSignature || data.signature;
    if (signatureToLoad) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = signatureToLoad;
    }
  }, [data.signature, tempSignature, showModal]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent scrolling on touch devices
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
    e.preventDefault(); // Prevent scrolling on touch devices
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
    
    // Use the temporary signature if available, otherwise use data.signature
    const finalSignature = tempSignature || data.signature;
    if (!finalSignature) return;
    
    onFinish({ signature: finalSignature });
  };

  const saveSignatureTemp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL('image/png');
    setTempSignature(signatureData);
    setShowModal(false);
  };

  const currentSignature = tempSignature || data.signature;

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: '30px', color: '#00ff00', textShadow: '0 0 10px rgba(0, 255, 0, 0.5)' }}>Paso 3: Firma del Cliente</h2>
      
      <div className="signature-pad-container">
        <label>
          Firma
          <span className="required">*</span>
        </label>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
          {hasSignature ? 'Firma capturada. Click para editar.' : 'Click para abrir el panel de firma'}
        </p>
        
        {hasSignature && (
          <div className="signature-preview" onClick={() => setShowModal(true)}>
            <img src={currentSignature} alt="Firma" />
          </div>
        )}
        
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          style={{ marginTop: hasSignature ? '10px' : '0' }}
        >
          {hasSignature ? 'Editar Firma' : 'Abrir Panel de Firma'}
        </button>
      </div>

      {showModal && (
        <div className="signature-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="signature-modal" onClick={(e) => e.stopPropagation()}>
            <div className="signature-modal-header">
              <h3>Dibuje su firma</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="signature-modal-body">
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
            </div>
            <div className="signature-modal-footer">
              <button type="button" className="btn-clear" onClick={clearSignature}>
                Limpiar
              </button>
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={saveSignatureTemp}
                disabled={!hasSignature}
              >
                Guardar Firma
              </button>
            </div>
          </div>
        </div>
      )}

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
