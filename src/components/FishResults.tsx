import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FishIcon, 
  ScaleIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon,
  TrendingUpIcon,
  MapPinIcon,
  ClockIcon,
  SaveIcon
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface FishIdentification {
  id: string;
  species: string;
  confidence: number;
  count: number;
  estimatedWeight: number;
  healthScore: number;
  freshness: 'excellent' | 'good' | 'fair' | 'poor';
  image: string;
  timestamp: Date;
  location: { latitude: number; longitude: number } | null;
}

interface FishResultsProps {
  results: FishIdentification[];
  onSave: (results: FishIdentification[]) => void;
  onNewCapture: () => void;
}

const FishResults = ({ results, onSave, onNewCapture }: FishResultsProps) => {
  if (results.length === 0) {
    return (
      <Card className="p-8 text-center border-muted">
        <FishIcon className="mx-auto w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No fish detected
        </h3>
        <p className="text-sm text-muted-foreground">
          Try capturing another image with better lighting
        </p>
      </Card>
    );
  }

  const totalWeight = results.reduce((sum, fish) => sum + fish.estimatedWeight, 0);
  const totalCount = results.reduce((sum, fish) => sum + fish.count, 0);
  const avgHealthScore = results.reduce((sum, fish) => sum + fish.healthScore, 0) / results.length;

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'fair': return 'text-warning';
      case 'poor': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getFreshnessBadgeVariant = (freshness: string) => {
    switch (freshness) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'fair': return 'outline';
      case 'poor': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="p-6 bg-gradient-wave border-primary/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{totalCount}</div>
            <div className="text-sm text-muted-foreground">Fish Detected</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">{totalWeight.toFixed(1)}kg</div>
            <div className="text-sm text-muted-foreground">Est. Weight</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">{avgHealthScore.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Avg. Quality</div>
          </div>
        </div>
      </Card>

      {/* Individual Fish Results */}
      <div className="space-y-4">
        {results.map((fish) => (
          <Card key={fish.id} className="p-6 border-l-4 border-l-primary">
            <div className="flex gap-4">
              {/* Fish Image */}
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-muted">
                <img 
                  src={fish.image} 
                  alt={fish.species}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Fish Details */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {fish.species}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUpIcon className="w-3 h-3" />
                      {fish.confidence.toFixed(1)}% confidence
                    </div>
                  </div>
                  
                  <Badge 
                    variant={getFreshnessBadgeVariant(fish.freshness)}
                    className={getFreshnessColor(fish.freshness)}
                  >
                    {fish.freshness}
                  </Badge>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Count</span>
                      <span className="font-medium">{fish.count}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-medium">{fish.estimatedWeight.toFixed(1)}kg</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Quality Score</span>
                      <span className="font-medium">{fish.healthScore}%</span>
                    </div>
                    <Progress value={fish.healthScore} className="h-2" />
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" />
                    {fish.timestamp.toLocaleString()}
                  </div>
                  {fish.location && (
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3" />
                      {fish.location.latitude.toFixed(4)}, {fish.location.longitude.toFixed(4)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          onClick={() => onSave(results)}
          className="flex-1 bg-gradient-ocean hover:shadow-glow transition-all duration-300"
        >
          <SaveIcon className="mr-2 w-4 h-4" />
          Save Results
        </Button>
        
        <Button 
          onClick={onNewCapture}
          variant="outline" 
          className="flex-1 border-primary/20 hover:bg-primary/5"
        >
          <FishIcon className="mr-2 w-4 h-4" />
          New Capture
        </Button>
      </div>
    </div>
  );
};

export default FishResults;