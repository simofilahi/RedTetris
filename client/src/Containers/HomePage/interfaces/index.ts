export interface PlayerDataInt {
  roomId?: number;
  roomTitle?: string;
  playerName?: string;
  player?: any;
  multiplayer?: boolean;
  gravityInterval?: number;
  gameStatus?: string;
  playerRole?: string;
  gameResult?: string;
  socket?: any;
  gravityPropsIndex?: number;
  playerLand?: Array<Array<SquareInt>>;
  opponentSpecturmMap?: opponentSpecturmMapInt;
  loser?: boolean;
  winner?: boolean;
  score?: number;
  droppedLines?: number;
  playerNextShape?: ShapeInterface;
}

export interface opponentSpecturmMapInt {
  spectrum: Array<Array<SquareInt>>;
  playerName: string;
}

export interface Cords {
  row: number;
  col: number;
}

export interface ShapeInterface {
  cords: Cords;
  pieces: Array<Array<SquareInt>>;
}

export interface SquareInt {
  status: string;
  color: string;
  value: string;
}

export interface ContextInt {
  playerData: PlayerDataInt;
  updatePlayerData: Function;
  setPlaying: Function;
  playing: boolean;
  socket: any;
}
