import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { scanDustbin } from '@/api/plantApi';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess?: (result: any) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      checkCameraPermission();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment' // Use back camera if available
        } 
      });
      setHasCamera(true);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError('Camera access denied or not available');
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  };

  const simulateQRScan = () => {
    // For demo purposes, we'll simulate scanning different types of QR codes
    const mockQRData = [
      {
        type: 'dustbin',
        dustbinId: 'dustbin-123',
        communityCode: 'ABC123',
        location: 'Main Street Park'
      },
      {
        type: 'dustbin',
        dustbinId: 'dustbin-456',
        communityCode: 'XYZ789',
        location: 'School Playground'
      }
    ];

    const randomData = mockQRData[Math.floor(Math.random() * mockQRData.length)];
    handleQRResult(JSON.stringify(randomData));
  };

  const handleQRResult = async (result: string) => {
    try {
      const qrData = JSON.parse(result);
      
      if (qrData.type === 'dustbin') {
        setScanning(true);
        
        try {
          const scanResult = await scanDustbin(qrData.dustbinId);
          
          toast({
            title: "Scan Successful! 🎉",
            description: scanResult.message,
          });

          if (onScanSuccess) {
            onScanSuccess(scanResult);
          }
          
          onClose();
        } catch (error: any) {
          toast({
            title: "Scan Error",
            description: error.message || "Failed to process dustbin scan",
            variant: "destructive"
          });
        } finally {
          setScanning(false);
        }
      } else {
        toast({
          title: "Invalid QR Code",
          description: "This QR code is not recognized by our system",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "Could not read QR code data",
        variant: "destructive"
      });
    }
  };

  const handleManualInput = () => {
    // For demo purposes, let's simulate a successful scan
    const mockResult = {
      type: 'dustbin',
      dustbinId: 'demo-dustbin-' + Date.now(),
      communityCode: 'DEMO123',
      location: 'Demo Location'
    };
    
    handleQRResult(JSON.stringify(mockResult));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="w-6 h-6" />
            QR Code Scanner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <Card className="border-destructive">
              <CardContent className="p-4 text-center">
                <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-destructive font-medium mb-2">Camera Error</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={checkCameraPermission} variant="outline">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : hasCamera ? (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                  
                  {scanning && (
                    <motion.div
                      className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-4 text-center">
                <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium mb-2">Initializing Camera...</p>
                <p className="text-sm text-muted-foreground">
                  Please allow camera access to scan QR codes
                </p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={simulateQRScan} 
              className="flex-1"
              disabled={scanning}
            >
              {scanning ? 'Processing...' : 'Demo Scan'}
            </Button>
            <Button 
              onClick={handleManualInput} 
              variant="outline" 
              className="flex-1"
              disabled={scanning}
            >
              Manual Input
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Point your camera at a dustbin QR code to scan
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRScanner;
