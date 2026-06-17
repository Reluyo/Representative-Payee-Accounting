import { useRef, useState, useEffect } from 'react';
import { colors, radius } from '../../design/tokens';
import { scanReceiptImage, type OCRResult } from '../../utils/ocr';

interface ScanReceiptCameraProps {
  onCapture: (photoData: string, ocrResult?: OCRResult) => void;
  onCancel: () => void;
}

export function ScanReceiptCamera({ onCapture, onCancel }: ScanReceiptCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError('Camera not supported on this browser. Use the upload option below.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });

        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch {
            // autoPlay should handle it
          }
          setCameraActive(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Unable to access camera. Check permissions, or upload a photo instead.');
          console.error('Camera error:', err);
        }
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const processImage = async (photoData: string) => {
    setScanning(true);
    try {
      const ocrResult = await scanReceiptImage(photoData);
      onCapture(photoData, ocrResult);
    } catch {
      onCapture(photoData);
    } finally {
      setScanning(false);
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const photoData = canvasRef.current.toDataURL('image/jpeg');
    await processImage(photoData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const photoData = reader.result as string;
      await processImage(photoData);
    };
    reader.readAsDataURL(file);
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
        zIndex: 1200,
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
        <div style={{ width: '58px' }} />
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
        {scanning ? 'Reading receipt...' : cameraActive ? 'Hold steady and tap the button to capture' : 'Upload a receipt photo'}
      </div>

      {/* Camera feed or upload fallback */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'relative' }}>
        {cameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
            />
            {/* Frame overlay */}
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
                opacity: scanning ? 1 : 0.5,
              }}
            />
            {scanning && (
              <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600,
              }}>
                Reading receipt...
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            {error && (
              <p style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '24px', lineHeight: 1.5 }}>
                {error}
              </p>
            )}
            {!error && !scanning && (
              <p style={{ fontSize: '15px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
                Initializing camera...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {!scanning && (
        <div
          style={{
            padding: '20px 22px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {cameraActive && (
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
          )}

          {/* Upload from gallery — always available */}
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '12px 24px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: `${radius.button}px`,
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Upload from gallery
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
