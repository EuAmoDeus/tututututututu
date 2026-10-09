export type CalculatorMode = 'standard' | 'scientific' | 'converter' | 'financial';

export type AngleMode = 'DEG' | 'RAD';

export type ThemeId = 'dark' | 'light' | 'amoled' | 'retro';

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  mode: 'standard' | 'scientific';
}

export type UnitCategory = 
  | 'length'
  | 'mass'
  | 'temperature'
  | 'currency'
  | 'area'
  | 'volume'
  | 'speed'
  | 'digital'
  | 'time';

export interface UnitDefinition {
  id: string;
  name: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}
