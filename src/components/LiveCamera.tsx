import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CameraIcon, StopCircleIcon, LanguagesIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

interface LiveCameraProps {
  onCapture: (imageData: string) => void;
}

const LiveCamera = ({ onCapture }: LiveCameraProps) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsStreaming(true);
      }
      
      toast({
        title: t('captureSuccess'),
        description: t('cameraReady'),
      });
      
    } catch (err) {
      console.error('Camera access error:', err);
      setError(t('cameraError'));
      toast({
        title: "Camera Error",
        description: t('cameraError'),
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setError(null);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    onCapture(imageData);
    
    toast({
      title: t('captureSuccess'),
      description: t('processingFish'),
    });
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <Card className="p-3">
        <div className="flex items-center gap-3">
          <LanguagesIcon className="w-5 h-5 text-primary" />
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="te">తెలుగు</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="ta">தமிழ்</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Camera View */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {isStreaming ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <CameraIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {error || t('cameraReady')}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {!isStreaming ? (
              <Button 
                onClick={startCamera} 
                className="flex-1 bg-gradient-ocean"
                size="lg"
              >
                <CameraIcon className="mr-2 w-5 h-5" />
                {t('startCamera')}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={captureImage}
                  className="flex-1 bg-gradient-ocean"
                  size="lg"
                >
                  <CameraIcon className="mr-2 w-5 h-5" />
                  {t('capture')}
                </Button>
                <Button 
                  onClick={stopCamera}
                  variant="outline"
                  size="lg"
                >
                  <StopCircleIcon className="mr-2 w-5 h-5" />
                  {t('stopCamera')}
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Captured Image Preview */}
      {capturedImage && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-3">{t('captureSuccess')}</h3>
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <img 
              src={capturedImage} 
              alt="Captured fish" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <div className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                Processing AI Detection...
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default LiveCamera;