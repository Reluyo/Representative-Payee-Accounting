import { useRef, useState, useEffect } from 'react';
import { colors } from '../../design/tokens';

interface ScanReceiptCameraProps {
  onCapture: (photoData: string) => void;
  onCancel: () => void;
}

export function ScanReceiptCamera({ onCapture, onCancel }: ScanReceiptCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (err) {
        setError('Unable to access camera. Please check permissions.');
        console.error(err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const photoData = canvasRef.current.toDataURL('image/jpeg');
    onCapture(photoData);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0E1726',
        color: 'white',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: '12px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '40px',
        }}
      >
        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
          Scan receipt
        </h2>
        <div style={{ fontSize: '14px', opacity: 0.5 }}>Flash</div>
      </div>

      {/* Hint */}
      <div
        style={{
          margin: '16px 22px',
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          borderRadius: '14px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 600,
        }}
      >
        Hold steady — we'll snap it for you
      </div>

      {/* Camera feed */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'relative' }}>
        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Corner brackets */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '236px',
                height: '330px',
                border: '2px solid white',
                borderRadius: '8px',
                opacity: 0.5,
              }}
            />
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <p>{error || 'Initializing camera...'}</p>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {cameraActive && (
        <div
          style={{
            padding: '20px 22px 40px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <button
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Photos
          </button>

          <button
            onClick={handleCapture}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '6px solid rgba(255, 255, 255, 0.25)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'white',
                border: '3px solid #0E1726',
              }}
            />
          </button>

          <button
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Type it
          </button>
        </div>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
