import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CameraIcon, HistoryIcon, FishIcon, WavesIcon } from 'lucide-react';
import CameraCapture from '@/components/CameraCapture';
import FishResults from '@/components/FishResults';
import RecordsHistory from '@/components/RecordsHistory';
import { fishAI } from '@/services/fishAI';
import { fishDatabase } from '@/services/fishDatabase';
import { FishIdentification } from '@/components/FishResults';
import { useToast } from '@/hooks/use-toast';
import heroBg from '@/assets/hero-bg.jpg';

interface CaptureData {
  image: string;
  timestamp: Date;
  location: { latitude: number; longitude: number } | null;
}

const Index = () => {
  const [currentResults, setCurrentResults] = useState<FishIdentification[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('capture');
  const { toast } = useToast();

  const handleCapture = async (captureData: CaptureData) => {
    try {
      setIsProcessing(true);
      setActiveTab('results');
      
      // Process the image with AI
      const results = await fishAI.identifyFish(captureData.image, captureData.location);
      setCurrentResults(results);
      
      toast({
        title: "Analysis complete",
        description: `Identified ${results.length} fish species`,
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
        title: "Results saved",
        description: "Your catch data has been stored locally",
      });
      setActiveTab('history');
    } catch (error) {
      toast({
        title: "Save failed",
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
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="min-h-screen bg-background/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-ocean flex items-center justify-center shadow-glow">
                <FishIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">AquaID</h1>
                <p className="text-sm text-muted-foreground">Fish Identification System</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Professional fish identification for maritime industry
            </p>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border border-primary/20">
              <TabsTrigger 
                value="capture" 
                className="data-[state=active]:bg-gradient-ocean data-[state=active]:text-primary-foreground"
              >
                <CameraIcon className="w-4 h-4 mr-2" />
                Capture
              </TabsTrigger>
              <TabsTrigger 
                value="results"
                className="data-[state=active]:bg-gradient-ocean data-[state=active]:text-primary-foreground"
              >
                <FishIcon className="w-4 h-4 mr-2" />
                Results
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-gradient-ocean data-[state=active]:text-primary-foreground"
              >
                <HistoryIcon className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="capture" className="space-y-6">
              <CameraCapture onCapture={handleCapture} />
            </TabsContent>

            <TabsContent value="results" className="space-y-6">
              {isProcessing ? (
                <Card className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-ocean flex items-center justify-center animate-pulse">
                      <WavesIcon className="w-8 h-8 text-primary-foreground animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Analyzing Fish...
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        AI is identifying species, quality, and quantity
                      </p>
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

            <TabsContent value="history" className="space-y-6">
              <RecordsHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
