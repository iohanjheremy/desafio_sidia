import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Trophy, Filter, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Player {
  sofifa_id: number;
  player_url: string;
  short_name: string;
  long_name: string;
  age: number;
  club_name: string;
  league_name: string;
  nationality: string;
  player_positions: string;
  overall: number;
  real_face: string;
  real_face_local?: string;
  potential: number;
  value_eur: number;
}

interface PlayerListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Player[];
}

// Sample data for fallback/demo purposes
const SAMPLE_PLAYERS: Player[] = [
  {
    sofifa_id: 158023,
    player_url: "https://sofifa.com/player/158023",
    short_name: "L. Messi",
    long_name: "Lionel Messi",
    age: 33,
    club_name: "FC Barcelona",
    league_name: "La Liga",
    nationality: "Argentina",
    player_positions: "RW, CF, ST",
    overall: 93,
    real_face: "https://cdn.sofifa.net/players/158/023/25_120.png",
    potential: 93,
    value_eur: 95500000
  },
  {
    sofifa_id: 20801,
    player_url: "https://sofifa.com/player/20801",
    short_name: "C. Ronaldo",
    long_name: "Cristiano Ronaldo",
    age: 35,
    club_name: "Juventus",
    league_name: "Serie A",
    nationality: "Portugal",
    player_positions: "ST, LW",
    overall: 92,
    real_face: "https://cdn.sofifa.net/players/020/801/25_120.png",
    potential: 92,
    value_eur: 76500000
  },
  {
    sofifa_id: 192985,
    player_url: "https://sofifa.com/player/192985",
    short_name: "K. Mbappé",
    long_name: "Kylian Mbappé",
    age: 21,
    club_name: "Paris Saint-Germain",
    league_name: "Ligue 1",
    nationality: "France",
    player_positions: "ST, LW",
    overall: 90,
    real_face: "https://cdn.sofifa.net/players/192/985/25_120.png",
    potential: 95,
    value_eur: 81000000
  }
];

const BASE_URL = '/api';

export default function FifaPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'top' | 'formation'>('list');
  const [apiError, setApiError] = useState<string | null>(null);


  // Filter states
  const [filters, setFilters] = useState({
    nationality: '',
    position: '',
    league: '',
    club: '',
    minOverall: '',
    maxOverall: '',
    minAge: '',
    maxAge: ''
  });

  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [bestTeam, setBestTeam] = useState<Player[]>([]);


  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPlayers = async (page = 1, query = '', filterParams = {}) => {
    setLoading(true);
    setApiError(null);

    try {
      let url = '/api/players/';
      const params = new URLSearchParams();

      if (query.trim()) {
        url = '/api/players/search/';
        params.append('q', query);
      } else if (Object.values(filterParams).some(val => val)) {
        url = '/api/players/filter/';
        Object.entries(filterParams).forEach(([key, value]) => {
          if (value) params.append(key, value as string);
        });
      } else {
        params.append('page', page.toString());
        params.append('page_size', '20');
      }

      console.log(`Fetching from: ${url}?${params.toString()}`);

      const response = await fetch(`${url}?${params.toString()}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data: PlayerListResponse = await response.json();
      console.log('API Response:', data);

      if (data.results && data.results.length > 0) {
        const playersWithImages = data.results.map(player => {
          const sofifaIdStr = player.sofifa_id.toString().padStart(6, '0');
          const year = sofifaIdStr.slice(0, 3);
          const rest = sofifaIdStr.slice(3);
          return {
            ...player,
            real_face_local: `https://cdn.sofifa.net/players/${year}/${rest}/25_120.png`,
          };
        });

        setPlayers(playersWithImages);
        setTotalCount(data.count || playersWithImages.length);
      } else {
        // No data from API, use sample data
        console.log('No players found in API response, using sample data');
        setApiError('API connection successful but no players found. Showing sample data.');
        const sampleWithImages = SAMPLE_PLAYERS.map(player => ({
          ...player,
          real_face_local: player.real_face
        }));
        setPlayers(sampleWithImages);
        setTotalCount(sampleWithImages.length);
      }

    } catch (error) {
      console.error('Error fetching players:', error);
      setApiError(`Failed to connect to API: ${error instanceof Error ? error.message : 'Unknown error'}. Showing sample data.`);

      // Use sample data as fallback
      const sampleWithImages = SAMPLE_PLAYERS.map(player => ({
        ...player,
        real_face_local: player.real_face
      }));
      setPlayers(sampleWithImages);
      setTotalCount(sampleWithImages.length);
    } finally {
      setLoading(false);
    }
  };


  const fetchTopPlayers = async (k = 10, criteria: Record<string, string> = {}) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setApiError(null);

    try {
      const params = new URLSearchParams();
      params.append('k', k.toString());
      Object.entries(criteria).forEach(([key, value]) => {
        if (value) params.append(key, value as string);
      });

      console.log(`Fetching top players from: ${BASE_URL}/players/top-k/?${params.toString()}`);

      const response = await fetch(`${BASE_URL}/players/top-k/?${params.toString()}`, {
        signal: controller.signal
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Top players API Error ${response.status}:`, errorText);
        throw new Error(`Top players API returned ${response.status}`);
      }

      const data = await response.json();
      console.log('Top players API Response:', data);

      const results = Array.isArray(data) ? data : data.results || [];

      if (results.length > 0) {
        const playersWithImages = results.map(player => {
          const sofifaIdStr = player.sofifa_id.toString().padStart(6, '0');
          const year = sofifaIdStr.slice(0, 3);
          const rest = sofifaIdStr.slice(3);
          return {
            ...player,
            real_face_local: `https://cdn.sofifa.net/players/${year}/${rest}/25_120.png`,
          };
        });

        setTopPlayers(playersWithImages);
      } else {
        console.log('No top players found, using sample data');
        setApiError('No top players found. Showing sample top players.');
        const sampleWithImages = SAMPLE_PLAYERS.map(player => ({
          ...player,
          real_face_local: player.real_face
        }));
        setTopPlayers(sampleWithImages);
      }
    } catch (error) {
      if ((error as any).name !== 'AbortError') {
        console.error('Error fetching top players:', error);
        setApiError(`Failed to fetch top players: ${error instanceof Error ? error.message : 'Unknown error'}. Showing sample data.`);

        // Use sample data as fallback
        const sampleWithImages = SAMPLE_PLAYERS.map(player => ({
          ...player,
          real_face_local: player.real_face
        }));
        setTopPlayers(sampleWithImages);
      }
    } finally {
      setLoading(false);
    }
  };


  const fetchBestTeam = async (formation = '4-3-3', league = '') => {
    setLoading(true);
    setApiError(null);

    try {
      const params = new URLSearchParams();
      params.append('formation', formation);
      if (league) params.append('league_name', league);

      console.log(`Fetching best team from: ${BASE_URL}/players/best-team/?${params.toString()}`);

      const response = await fetch(`${BASE_URL}/players/best-team/?${params.toString()}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Best team API Error ${response.status}:`, errorText);
        throw new Error(`Best team API returned ${response.status}`);
      }

      const data: Player[] = await response.json();
      console.log('Best team API Response:', data);

      if (Array.isArray(data) && data.length > 0) {
        const teamWithImages = data.map(player => {
          const sofifaIdStr = player.sofifa_id.toString().padStart(6, '0');
          const year = sofifaIdStr.slice(0, 3);
          const rest = sofifaIdStr.slice(3);
          return {
            ...player,
            real_face_local: `https://cdn.sofifa.net/players/${year}/${rest}/25_120.png`,
          };
        });
        setBestTeam(teamWithImages);
      } else {
        console.log('No best team found, using sample data');
        setApiError('No best team found. Showing sample players.');
        const sampleWithImages = SAMPLE_PLAYERS.map(player => ({
          ...player,
          real_face_local: player.real_face
        }));
        setBestTeam(sampleWithImages);
      }
    } catch (error) {
      console.error('Error fetching best team:', error);
      setApiError(`Failed to fetch best team: ${error instanceof Error ? error.message : 'Unknown error'}. Showing sample data.`);

      // Use sample data as fallback
      const sampleWithImages = SAMPLE_PLAYERS.map(player => ({
        ...player,
        real_face_local: player.real_face
      }));
      setBestTeam(sampleWithImages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'list') fetchPlayers(currentPage, searchQuery, filters);
    else if (viewMode === 'top') fetchTopPlayers(10, { nationality: filters.nationality, player_positions: filters.position });
    else if (viewMode === 'formation') fetchBestTeam('4-3-3', filters.league);
  }, [currentPage, viewMode, filters]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPlayers(1, searchQuery, filters);
  };

  const handleFilter = () => {
    setCurrentPage(1);
    const filterParams = {
      nationality: filters.nationality,
      player_positions: filters.position,
      league_name: filters.league,
      club_name: filters.club,
      overall_min: filters.minOverall,
      overall_max: filters.maxOverall,
      age_min: filters.minAge,
      age_max: filters.maxAge,
    };
    fetchPlayers(1, '', filterParams);
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value}`;
  };


  const PlayerCard = ({ player }: { player: Player }) => {
    const [imgSrc, setImgSrc] = player.real_face_local || player.real_face;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={imgSrc}
                    alt={player.short_name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                    onLoad={() => {
                      console.log("Imagem carregada com sucesso:", imgSrc);
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{player.short_name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{player.club_name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={player.overall >= 85 ? 'default' : player.overall >= 75 ? 'secondary' : 'outline'}>
                      {player.overall}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{player.nationality}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatValue(player.value_eur)}</p>
                  <p className="text-xs text-muted-foreground">{player.player_positions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{player.long_name}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <img
                src={imgSrc}
                alt={player.short_name}
                className="w-32 h-32 rounded-full object-cover mb-4"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />
              <Badge className="mb-2" variant={player.overall >= 85 ? 'default' : 'secondary'}>
                Overall: {player.overall}
              </Badge>
              <Badge variant="outline">Potential: {player.potential}</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Personal Info</h4>
                <p className="text-sm"><strong>Age:</strong> {player.age}</p>
                <p className="text-sm"><strong>Nationality:</strong> {player.nationality}</p>
                <p className="text-sm"><strong>Positions:</strong> {player.player_positions}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Club Info</h4>
                <p className="text-sm"><strong>Club:</strong> {player.club_name}</p>
                <p className="text-sm"><strong>League:</strong> {player.league_name}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Market Value</h4>
                <p className="text-lg font-bold text-primary">{formatValue(player.value_eur)}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const FifaPlayers: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

    useEffect(() => {
      let cancel = false;

      const fetchPlayers = async () => {
        try {
          const res = await fetch("/api/players/?page=1&page_size=20");
          if (!res.ok) throw new Error("Falha ao conectar à API");
          const data = await res.json();
          setPlayers(
            data.results.map((p: any) => ({
              ...p,
              real_face_local: `https://cdn.sofifa.net/players/${String(p.sofifa_id).padStart(6, "0")}/25_120.png`,
            }))
          );
        } catch (err) {
          console.error("Erro ao carregar jogadores:", err);
        }
      };

      fetchPlayers();
    }, []);

    if (loading) return <p>Carregando jogadores...</p>;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {players.map((player) => (
        <PlayerCard key={player.sofifa_id} player={player} />
      ))}
    </div>
    );
  }
};
