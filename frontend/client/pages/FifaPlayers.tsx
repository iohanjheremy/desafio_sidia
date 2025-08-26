import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Trophy, Filter } from "lucide-react";
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

// Sample fallback
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
    real_face: "https://cdn.sofifa.net/players/158/023/21_120.png",
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
    real_face: "https://cdn.sofifa.net/players/020/801/21_120.png",
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
    real_face: "https://cdn.sofifa.net/players/192/985/21_120.png",
    potential: 95,
    value_eur: 81000000
  }
];

export default function FifaPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [bestTeam, setBestTeam] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'top' | 'formation'>('list');
  const [apiError, setApiError] = useState<string | null>(null);

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

  const abortControllerRef = useRef<AbortController | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const normalizeUrl = (player?: Player) => {
    if (player?.real_face_local) return `/api/players/image/${player.sofifa_id}/`;
    return "/placeholder.svg";
  };

  const fetchPlayers = async (page = 1, query = '', filterParams = {}) => {
    setLoading(true);
    setApiError(null);
    try {
      let url = '/api/players/';
      const params: Record<string, string> = { page: page.toString(), page_size: '20' };

      if (query.trim()) {
        url = '/api/players/search/';
        params['q'] = query;
      } else if (Object.values(filterParams).some(val => val)) {
        url = '/api/players/filter/';
        Object.assign(params, filterParams);
      }

      const res = await axios.get<PlayerListResponse>(url, { params });
      const results = res.data.results.map(player => ({ ...player, real_face_local: normalizeUrl(player) }));
      setPlayers(results.length ? results : SAMPLE_PLAYERS.map(p => ({ ...p, real_face_local: normalizeUrl(p) })));
      setTotalCount(res.data.count || results.length || SAMPLE_PLAYERS.length);
    } catch (error) {
      console.error('Error fetching players:', error);
      setApiError('Failed to fetch players. Showing sample data.');
      setPlayers(SAMPLE_PLAYERS.map(p => ({ ...p, real_face_local: normalizeUrl(p) })));
      setTotalCount(SAMPLE_PLAYERS.length);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopPlayers = async (k = 10, criteria: Record<string, string> = {}) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await axios.get<PlayerListResponse>('/api/players/top-k/', { params: { k, ...criteria } });
      setTopPlayers(res.data.results.map(player => ({ ...player, real_face_local: normalizeUrl(player) })));
    } catch (error) {
      console.error('Error fetching top players:', error);
      setApiError('Failed to fetch top players. Showing sample data.');
      setTopPlayers(SAMPLE_PLAYERS.map(p => ({ ...p, real_face_local: normalizeUrl(p) })));
    } finally {
      setLoading(false);
    }
  };

  const fetchBestTeam = async (formation = '4-3-3', league = '') => {
    setLoading(true);
    setApiError(null);
    try {
      const params: Record<string, string> = { formation };
      if (league) params.league_name = league;
      const res = await axios.get<Player[]>('/api/players/best-team/', { params });
      setBestTeam(res.data.map(player => ({ ...player, real_face_local: normalizeUrl(player) })));
    } catch (error) {
      console.error('Error fetching best team:', error);
      setApiError('Failed to fetch best team. Showing sample data.');
      setBestTeam(SAMPLE_PLAYERS.map(p => ({ ...p, real_face_local: normalizeUrl(p) })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'list') fetchPlayers(currentPage, searchQuery, filters);
    else if (viewMode === 'top') fetchTopPlayers(10, { nationality: filters.nationality, player_positions: filters.position });
    else if (viewMode === 'formation') fetchBestTeam('4-3-3', filters.league);
  }, [viewMode, currentPage, searchQuery, filters]);

  const handleSearch = () => { setCurrentPage(1); fetchPlayers(1, searchQuery, filters); };
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
    if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `€${(value / 1_000).toFixed(0)}K`;
    return `€${value}`;
  };

  const PlayerCard = ({ player }: { player: Player }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-4 flex items-center space-x-4">
            <img
              src={player.real_face_local}
              alt={player.short_name}
              loading="lazy"
              className="w-16 h-16 rounded-full object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{player.short_name}</h3>
              <p className="text-sm text-muted-foreground truncate">{player.club_name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={player.overall >= 85 ? 'default' : player.overall >= 75 ? 'secondary' : 'outline'}>{player.overall}</Badge>
                <span className="text-xs text-muted-foreground">{player.nationality}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{formatValue(player.value_eur)}</p>
              <p className="text-xs text-muted-foreground">{player.player_positions}</p>
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
            <img src={player.real_face_local} alt={player.short_name} className="w-32 h-32 rounded-full object-cover mb-4" onError={(e) => e.currentTarget.src = "/placeholder.svg"} />
            <Badge className="mb-2" variant={player.overall >= 85 ? 'default' : 'secondary'}>Overall: {player.overall}</Badge>
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

  return (
    <div className={cn("min-h-screen p-6 transition-colors duration-300", isDarkMode ? "bg-gray-900 text-white" : "bg-background text-black")}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">FIFA 21 Players</h1>
          <p className="text-muted-foreground">Explore and discover football players from FIFA 21 database</p>



          {apiError && <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"><p className="text-yellow-800 text-sm">{apiError}</p></div>}
        </div>
        {/* Botão de Dark Mode */}
        <Button onClick={toggleDarkMode} className="fixed top-4 right-4 z-50">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </Button>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')} className="flex items-center space-x-2"><Search className="w-4 h-4" /><span>Players</span></Button>
          <Button variant={viewMode === 'top' ? 'default' : 'outline'} onClick={() => setViewMode('top')} className="flex items-center space-x-2"><Trophy className="w-4 h-4" /><span>Top Players</span></Button>
          <Button variant={viewMode === 'formation' ? 'default' : 'outline'} onClick={() => setViewMode('formation')} className="flex items-center space-x-2"><Users className="w-4 h-4" /><span>Best Formation</span></Button>
        </div>

        {/* Search & Filter */}
        {viewMode === 'list' && (
          <Card className="mb-6">
            <CardHeader><CardTitle className="flex items-center space-x-2"><Filter className="w-5 h-5" /><span>Search & Filter</span></CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input placeholder="Search players by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} className="flex-1" />
                <Button onClick={handleSearch}>Search</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Select value={filters.nationality || "all"} onValueChange={(value) => setFilters({ ...filters, nationality: value === "all" ? "" : value })}>
                  <SelectTrigger><SelectValue placeholder="Nationality" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Nations</SelectItem>
                    <SelectItem value="Brazil">Brazil</SelectItem>
                    <SelectItem value="Argentina">Argentina</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="England">England</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filters.position || "all"} onValueChange={(value) => setFilters({ ...filters, position: value === "all" ? "" : value })}>
                  <SelectTrigger><SelectValue placeholder="Position" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Positions</SelectItem>
                    <SelectItem value="GK">Goalkeeper</SelectItem>
                    <SelectItem value="CB">Center Back</SelectItem>
                    <SelectItem value="CM">Central Midfielder</SelectItem>
                    <SelectItem value="ST">Striker</SelectItem>
                    <SelectItem value="LW">Left Wing</SelectItem>
                    <SelectItem value="RW">Right Wing</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Min Overall" value={filters.minOverall} onChange={e => setFilters({ ...filters, minOverall: e.target.value })} type="number" min="40" max="99" />
                <Input placeholder="Max Overall" value={filters.maxOverall} onChange={e => setFilters({ ...filters, maxOverall: e.target.value })} type="number" min="40" max="99" />
              </div>
              <Button onClick={handleFilter} className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && <div className="flex justify-center items-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}

        {/* List View */}
        {viewMode === 'list' && !loading && (
          <div className="space-y-4">
            {players.map(player => <PlayerCard key={player.sofifa_id} player={player} />)}
            {/* Pagination */}
            {players.length > 0 && (
              <div className="flex justify-center space-x-2 mt-6">
                <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                <span className="flex items-center px-4">Page {currentPage} of {Math.ceil(totalCount / 20)}</span>
                <Button variant="outline" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= Math.ceil(totalCount / 20)}>Next</Button>
              </div>
            )}
          </div>
        )}

        {/* Top Players */}
        {viewMode === 'top' && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topPlayers.map((player, i) => (
              <div key={player.sofifa_id} className="relative">
                <Badge className="absolute top-2 right-2">#{i + 1}</Badge>
                <PlayerCard player={player} />
              </div>
            ))}
          </div>
        )}

        {/* Best Formation */}
        {viewMode === 'formation' && !loading && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Best 4-3-3 Formation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestTeam.map(player => <PlayerCard key={player.sofifa_id} player={player} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
