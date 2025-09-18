import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CameraIcon, HistoryIcon, FishIcon, WavesIcon } from 'lucide-react';
import LiveCamera from '@/components/LiveCamera';
import FishResults from '@/components/FishResults';
import RecordsHistory from '@/components/RecordsHistory';
import { fishAI } from '@/services/fishAI';
import { fishDatabase } from '@/services/fishDatabase';
import { FishIdentification } from '@/components/FishResults';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import heroBg from '@/assets/hero-bg.jpg';

interface CaptureData {
  image: string;
  timestamp: Date;
  location: { latitude: number; longitude: number } | null;
}

const Index = () => {
  const { t } = useTranslation();
  const [currentResults, setCurrentResults] = useState<FishIdentification[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('capture');
  const { toast } = useToast();

  const handleCapture = async (imageData: string) => {
    try {
      setIsProcessing(true);
      setActiveTab('results');
      
      // Get location if available
      let location = null;
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000
          });
        });
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } catch (error) {
        console.warn('Location not available:', error);
      }
      
      // Process the image with AI
      const results = await fishAI.identifyFish(imageData, location);
      setCurrentResults(results);
      
      toast({
        title: t('analysisComplete'),
        description: `${t('fishDetected')}: ${results.length}`,
      });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Processing failed",
        description: "Please try capturing again",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveResults = async (results: FishIdentification[]) => {
    try {
      await fishDatabase.saveResults(results);
      toast({
        title: t('saveSuccess'),
        description: "Your catch data has been stored locally",
      });
      setActiveTab('history');
    } catch (error) {
      toast({
        title: t('saveFailed'),
        description: "Could not save results",
        variant: "destructive"
      });
    }
  };

  const handleNewCapture = () => {
    setCurrentResults([]);
    setActiveTab('capture');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Simple Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">{t('appTitle')}</h1>
          <p className="text-sm text-muted-foreground">{t('appDescription')}</p>
        </div>

        {/* Simple Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="capture">
              <CameraIcon className="w-4 h-4 mr-2" />
              {t('camera')}
            </TabsTrigger>
            <TabsTrigger value="results">
              <FishIcon className="w-4 h-4 mr-2" />
              {t('results')}
            </TabsTrigger>
            <TabsTrigger value="history">
              <HistoryIcon className="w-4 h-4 mr-2" />
              {t('history')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="capture">
            <LiveCamera onCapture={handleCapture} />
          </TabsContent>

          <TabsContent value="results">
            {isProcessing ? (
              <Card className="p-8 text-center">
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary flex items-center justify-center animate-pulse">
                    <WavesIcon className="w-6 h-6 text-primary-foreground animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t('processing')}</h3>
                    <p className="text-muted-foreground text-sm">{t('processingFish')}</p>
                  </div>
                </div>
              </Card>
            ) : (
              <FishResults 
                results={currentResults}
                onSave={handleSaveResults}
                onNewCapture={handleNewCapture}
              />
            )}
          </TabsContent>

          <TabsContent value="history">
            <RecordsHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
