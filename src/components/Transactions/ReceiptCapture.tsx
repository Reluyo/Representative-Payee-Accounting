import React, { useRef, useState } from 'react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { scanReceiptImage, imageToBase64 } from '../../utils/ocr';
import type { OCRResult } from '../../utils/ocr';

interface ReceiptCaptureProps {
  onReceiptScanned: (data: OCRResult, imageData: string) => void;
}

export function ReceiptCapture({ onReceiptScanned }: ReceiptCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [mode, setMode] = useState<'capture' | 'upload' | 'preview'>('capture');
  const [scanning, setScanning] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<OCRResult | null>(null);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
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

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const imageData = canvasRef.current.toDataURL('image/jpeg');
    await processImage(imageData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await imageToBase64(file);
      await processImage(imageData);
    } catch (err) {
      setError('Failed to process image');
      console.error(err);
    }
  };

  const processImage = async (imageData: string) => {
    setScanning(true);
    setError('');

    try {
      setScannedImage(imageData);
      const result = await scanReceiptImage(imageData);
      setScannedData(result);
      setMode('preview');
      stopCamera();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan receipt');
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const confirmScannedData = () => {
    if (scannedData && scannedImage) {
      onReceiptScanned(scannedData, scannedImage);
      resetCapture();
    }
  };

  const resetCapture = () => {
    setMode('capture');
    setScannedImage(null);
    setScannedData(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {mode === 'capture' && !cameraActive && (
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => {
              setMode('capture');
              startCamera();
            }}
          >
            📷 Take Photo
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setMode('upload');
              fileInputRef.current?.click();
            }}
          >
            📁 Upload Image
          </Button>
        </div>
      )}

      {cameraActive && (
        <div className="space-y-2">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg bg-gray-200 aspect-video"
          />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={capturePhoto}
              loading={scanning}
              className="flex-1"
            >
              Capture
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                stopCamera();
                setMode('capture');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {mode === 'upload' && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      )}

      {mode === 'preview' && scannedData && scannedImage && (
        <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
          <img src={scannedImage} alt="Receipt" className="w-full rounded-lg max-h-64 object-cover" />

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Scanned Data</h3>

            {scannedData.vendor && (
              <Input
                label="Vendor"
                type="text"
                value={scannedData.vendor}
                readOnly
                className="bg-white"
              />
            )}

            {scannedData.amount && (
              <Input
                label="Amount"
                type="number"
                value={scannedData.amount.toString()}
                readOnly
                className="bg-white"
              />
            )}

            {scannedData.date && (
              <Input
                label="Date"
                type="text"
                value={scannedData.date}
                readOnly
                className="bg-white"
              />
            )}

            {scannedData.items && scannedData.items.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                <ul className="text-sm text-gray-600 space-y-1">
                  {scannedData.items.map((item, idx) => (
                    <li key={idx} className="truncate">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-xs text-gray-500 pt-2">
              OCR Confidence: {(scannedData.confidence * 100).toFixed(0)}%
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="primary"
                onClick={confirmScannedData}
                className="flex-1"
              >
                Use This Data
              </Button>
              <Button
                variant="secondary"
                onClick={resetCapture}
                className="flex-1"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
