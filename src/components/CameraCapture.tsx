import { useState, useRef } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CameraIcon, MapPinIcon, ClockIcon, FishIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CaptureData {
  image: string;
  timestamp: Date;
  location: { latitude: number; longitude: number } | null;
}

interface CameraCaptureProps {
  onCapture: (data: CaptureData) => void;
}

const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastCapture, setLastCapture] = useState<CaptureData | null>(null);
  const { toast } = useToast();

  const captureImage = async () => {
    try {
      setIsLoading(true);
      
      // Get current location
      let location = null;
      try {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch (error) {
        console.warn('Could not get location:', error);
        toast({
          title: "Location unavailable",
          description: "Continuing without location data",
          variant: "default"
        });
      }

      // Capture image
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1024,
        height: 1024,
      });

      const captureData: CaptureData = {
        image: image.dataUrl!,
        timestamp: new Date(),
        location,
      };

      setLastCapture(captureData);
      onCapture(captureData);

      toast({
        title: "Image captured successfully",
        description: "Processing fish identification...",
      });

    } catch (error) {
      console.error('Error capturing image:', error);
      toast({
        title: "Capture failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Camera Interface */}
      <Card className="p-8 text-center bg-gradient-wave border-primary/20">
        <div className="space-y-6">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-ocean flex items-center justify-center shadow-glow">
            <CameraIcon className="w-12 h-12 text-primary-foreground" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Ready to Identify Fish
            </h2>
            <p className="text-muted-foreground">
              Point your camera at the catch and tap to capture
            </p>
          </div>

          <Button
            onClick={captureImage}
            disabled={isLoading}
            size="lg"
            className="bg-gradient-ocean hover:shadow-glow transition-all duration-300 px-12 py-6 text-lg font-semibold"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CameraIcon className="mr-2 w-6 h-6" />
                Capture Fish
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Last Capture Info */}
      {lastCapture && (
        <Card className="p-6 border-success/20 bg-success/5">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-success/20">
              <img 
                src={lastCapture.image} 
                alt="Last capture" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <FishIcon className="w-4 h-4 text-success" />
                <span className="font-medium text-success">Image Captured</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  {lastCapture.timestamp.toLocaleTimeString()}
                </div>
                
                {lastCapture.location && (
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="w-3 h-3" />
                    <span className="font-mono text-xs">
                      {lastCapture.location.latitude.toFixed(4)}, {lastCapture.location.longitude.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CameraCapture;