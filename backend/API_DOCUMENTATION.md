# FIFA 21 Players REST API Documentation

## Overview
This REST API provides comprehensive access to FIFA 21 player data with advanced filtering, ranking, and team formation capabilities.

## Base URL
```
http://localhost:8000/api/
```

## Endpoints

### 1. List All Players (with Pagination)
**GET** `/api/players/`
- **Description**: List all players with pagination support
- **Parameters**:
  - `page` (optional): Page number (default: 1)
  - `page_size` (optional): Items per page (default: 20, max: 100)
- **Example**: `/api/players/?page=2&page_size=50`

### 2. Get Player Details
**GET** `/api/players/{sofifa_id}/`
- **Description**: Get detailed information about a specific player including photo
- **Example**: `/api/players/158023/`

### 3. Filter Players
**GET** `/api/players/filter/`
- **Description**: Filter players by multiple criteria
- **Parameters**:
  - `short_name`: Filter by short name (partial match)
  - `long_name`: Filter by full name (partial match)
  - `club_name`: Filter by club name
  - `league_name`: Filter by league name
  - `nationality`: Filter by nationality
  - `player_positions`: Filter by position (e.g., "ST", "CM", "GK")
  - `age_min`: Minimum age
  - `age_max`: Maximum age
  - `overall_min`: Minimum overall rating
  - `overall_max`: Maximum overall rating
- **Example**: `/api/players/filter/?nationality=Brazil&player_positions=ST&overall_min=85`

### 4. Search Players by Name
**GET** `/api/players/search/`
- **Description**: Search players by name (searches both short and long names)
- **Parameters**:
  - `q`: Search query
- **Example**: `/api/players/search/?q=Messi`

### 5. Top K Players
**GET** `/api/players/top-k/`
- **Description**: Get top K players by overall rating with optional filtering
- **Parameters**:
  - `k`: Number of top players (default: 10)
  - `player_positions`: Filter by position
  - `nationality`: Filter by nationality
  - `league_name`: Filter by league
  - `club_name`: Filter by club
- **Example**: `/api/players/top-k/?k=5&nationality=Argentina`

### 6. Top Players by Criteria
**GET** `/api/players/top-by-criteria/`
- **Description**: Get top K players filtered by specific criteria
- **Parameters**:
  - `k`: Number of top players (default: 10)
  - `criteria`: Filter type ('position', 'nationality', 'league', 'club')
  - `value`: Filter value
- **Examples**:
  - `/api/players/top-by-criteria/?k=10&criteria=position&value=ST`
  - `/api/players/top-by-criteria/?k=5&criteria=league&value=Premier League`

### 7. Best Team Formation
**GET** `/api/players/best-team/`
- **Description**: Get the best possible team formation
- **Parameters**:
  - `formation`: Team formation (default: '4-3-3')
  - `league_name`: Filter by league (optional)
  - `nationality`: Filter by nationality (optional)
- **Example**: `/api/players/best-team/?league_name=La Liga`

## Response Format

All endpoints return JSON responses with the following structure:

### Player Object
```json
{
  "sofifa_id": 158023,
  "player_url": "https://sofifa.com/player/158023",
  "short_name": "L. Messi",
  "long_name": "Lionel Andrés Messi Cuccittini",
  "age": 34,
  "club_name": "Paris Saint-Germain",
  "league_name": "Ligue 1",
  "nationality": "Argentina",
  "player_positions": "RW, ST, CF",
  "overall": 93,
  "real_face": "https://cdn.sofifa.net/players/158/023/21_120.png",
  "potential": 93,
  "value_eur": 95500000.0
}
```

### Paginated Response
```json
{
  "count": 18945,
  "next": "http://localhost:8000/api/players/?page=2",
  "previous": null,
  "results": [...]
}
```

## Error Handling

- **404 Not Found**: When a player ID doesn't exist
- **400 Bad Request**: When invalid parameters are provided
- **500 Internal Server Error**: For server-side issues

## Usage Examples

### Get Top 5 Brazilian Players
```
GET /api/players/top-k/?k=5&nationality=Brazil
```

### Get Best Team from Premier League
```
GET /api/players/best-team/?league_name=Premier League
```

### Search for Players Named "Cristiano"
```
GET /api/players/search/?q=Cristiano
```

### Filter Young Talents (Age 18-22, Overall 75+)
```
GET /api/players/filter/?age_min=18&age_max=22&overall_min=75
