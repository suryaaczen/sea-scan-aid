import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FishIcon, 
  SearchIcon, 
  CalendarIcon,
  TrendingUpIcon,
  TrashIcon,
  MapPinIcon,
  ClockIcon
} from 'lucide-react';
import { fishDatabase } from '@/services/fishDatabase';
import { FishIdentification } from '@/components/FishResults';

const RecordsHistory = () => {
  const [records, setRecords] = useState<FishIdentification[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FishIdentification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statistics, setStatistics] = useState({
    totalCaptures: 0,
    totalFish: 0,
    totalWeight: 0,
    speciesCount: 0,
    avgHealthScore: 0
  });

  useEffect(() => {
    loadRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm]);

  const loadRecords = () => {
    const allRecords = fishDatabase.getAllResults();
    setRecords(allRecords);
    setStatistics(fishDatabase.getStatistics());
  };

  const filterRecords = () => {
    if (!searchTerm) {
      setFilteredRecords(records);
      return;
    }

    const filtered = records.filter(record =>
      record.species.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecords(filtered);
  };

  const deleteRecord = async (id: string) => {
    try {
      await fishDatabase.deleteResult(id);
      loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

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
      {/* Statistics */}
      <Card className="p-6 bg-gradient-wave border-primary/20">
        <h2 className="text-xl font-bold text-foreground mb-4">Catch Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{statistics.totalCaptures}</div>
            <div className="text-sm text-muted-foreground">Captures</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">{statistics.totalFish}</div>
            <div className="text-sm text-muted-foreground">Fish</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-success">{statistics.totalWeight.toFixed(1)}kg</div>
            <div className="text-sm text-muted-foreground">Weight</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning">{statistics.speciesCount}</div>
            <div className="text-sm text-muted-foreground">Species</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{statistics.avgHealthScore.toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Avg Quality</div>
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by species name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <Card className="p-8 text-center border-muted">
          <FishIcon className="mx-auto w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {searchTerm ? 'No matching records' : 'No records yet'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm ? 'Try a different search term' : 'Start by capturing some fish!'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="p-4 border-l-4 border-l-primary">
              <div className="flex gap-4">
                {/* Fish Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-muted flex-shrink-0">
                  <img 
                    src={record.image} 
                    alt={record.species}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Record Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground truncate">
                        {record.species}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUpIcon className="w-3 h-3" />
                        {record.confidence.toFixed(1)}% confidence
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={getFreshnessBadgeVariant(record.freshness)}
                        className={getFreshnessColor(record.freshness)}
                      >
                        {record.freshness}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRecord(record.id)}
                        className="text-destructive hover:text-destructive/90 p-1"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Count: </span>
                      <span className="font-medium">{record.count}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Weight: </span>
                      <span className="font-medium">{record.estimatedWeight.toFixed(1)}kg</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Quality: </span>
                      <span className="font-medium">{record.healthScore}%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      {record.timestamp.toLocaleString()}
                    </div>
                    {record.location && (
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {record.location.latitude.toFixed(4)}, {record.location.longitude.toFixed(4)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecordsHistory;