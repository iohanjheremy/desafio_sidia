/**
 * Shared code between client and server
 * Gamified Football-themed web app types
 */

/**
 * Team data
 */
export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo?: string;
  founded: number;
  stadium: string;
  city: string;
  league: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

/**
 * Player data
 */
export interface Player {
  id: string;
  name: string;
  age: number;
  position: 'GK' | 'DEF' | 'MID' | 'ATT';
  number: number;
  teamId: string;
  nationality: string;
  photo?: string;
  stats: {
    goals: number;
    assists: number;
    matches: number;
    yellowCards: number;
    redCards: number;
  };
}
