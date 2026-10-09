import { UnitCategory, UnitDefinition } from '../types/calculator';

export interface CategoryInfo {
  id: UnitCategory;
  name: string;
  iconName: string;
  units: UnitDefinition[];
}

export const UNIT_CATEGORIES: CategoryInfo[] = [
  {
    id: 'length',
    name: 'Comprimento',
    iconName: 'Ruler',
    units: [
      { id: 'm', name: 'Metros', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', name: 'Quilômetros', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', name: 'Centímetros', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', name: 'Milímetros', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mi', name: 'Milhas', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'yd', name: 'Jardas', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'ft', name: 'Pés', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', name: 'Polegadas', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'nmi', name: 'Milhas Náuticas', symbol: 'NM', toBase: (v) => v * 1852, fromBase: (v) => v / 1852 },
    ],
  },
  {
    id: 'mass',
    name: 'Massa e Peso',
    iconName: 'Scale',
    units: [
      { id: 'kg', name: 'Quilogramas', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', name: 'Gramas', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mg', name: 'Miligramas', symbol: 'mg', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      { id: 't', name: 'Toneladas', symbol: 't', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'lb', name: 'Libras', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', name: 'Onças', symbol: 'oz', toBase: (v) => v * 0.028349523, fromBase: (v) => v / 0.028349523 },
      { id: 'ct', name: 'Quilates', symbol: 'ct', toBase: (v) => v * 0.0002, fromBase: (v) => v / 0.0002 },
    ],
  },
  {
    id: 'temperature',
    name: 'Temperatura',
    iconName: 'Thermometer',
    units: [
      { id: 'c', name: 'Graus Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', name: 'Graus Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    id: 'currency',
    name: 'Moedas (Câmbio)',
    iconName: 'Coins',
    // Base unit is USD
    units: [
      { id: 'usd', name: 'Dólar Americano', symbol: 'US$', toBase: (v) => v, fromBase: (v) => v },
      { id: 'brl', name: 'Real Brasileiro', symbol: 'R$', toBase: (v) => v / 5.42, fromBase: (v) => v * 5.42 },
      { id: 'eur', name: 'Euro', symbol: '€', toBase: (v) => v / 0.92, fromBase: (v) => v * 0.92 },
      { id: 'gbp', name: 'Libra Esterlina', symbol: '£', toBase: (v) => v / 0.78, fromBase: (v) => v * 0.78 },
      { id: 'jpy', name: 'Iene Japonês', symbol: '¥', toBase: (v) => v / 152.4, fromBase: (v) => v * 152.4 },
      { id: 'cad', name: 'Dólar Canadense', symbol: 'CA$', toBase: (v) => v / 1.38, fromBase: (v) => v * 1.38 },
      { id: 'btc', name: 'Bitcoin', symbol: '₿', toBase: (v) => v * 68000, fromBase: (v) => v / 68000 },
    ],
  },
  {
    id: 'area',
    name: 'Área',
    iconName: 'Square',
    units: [
      { id: 'm2', name: 'Metros Quadrados', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km2', name: 'Quilômetros Quadrados', symbol: 'km²', toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
      { id: 'ha', name: 'Hectares', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
      { id: 'ac', name: 'Acres', symbol: 'ac', toBase: (v) => v * 4046.856, fromBase: (v) => v / 4046.856 },
      { id: 'ft2', name: 'Pés Quadrados', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    ],
  },
  {
    id: 'volume',
    name: 'Volume & Capacidade',
    iconName: 'Droplet',
    units: [
      { id: 'l', name: 'Litros', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
      { id: 'ml', name: 'Mililitros', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'm3', name: 'Metros Cúbicos', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'gal', name: 'Galões (EUA)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      { id: 'cup', name: 'Xícaras (EUA)', symbol: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      { id: 'floz', name: 'Onças Fluidas', symbol: 'fl oz', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    ],
  },
  {
    id: 'speed',
    name: 'Velocidade',
    iconName: 'Gauge',
    units: [
      { id: 'kmh', name: 'Quilômetros por Hora', symbol: 'km/h', toBase: (v) => v, fromBase: (v) => v },
      { id: 'ms', name: 'Metros por Segundo', symbol: 'm/s', toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
      { id: 'mph', name: 'Milhas por Hora', symbol: 'mph', toBase: (v) => v * 1.609344, fromBase: (v) => v / 1.609344 },
      { id: 'knot', name: 'Nós Náuticos', symbol: 'kn', toBase: (v) => v * 1.852, fromBase: (v) => v / 1.852 },
    ],
  },
  {
    id: 'digital',
    name: 'Armazenamento Digital',
    iconName: 'HardDrive',
    units: [
      { id: 'b', name: 'Bytes', symbol: 'B', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kb', name: 'Kilobytes', symbol: 'KB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'mb', name: 'Megabytes', symbol: 'MB', toBase: (v) => v * 1024 ** 2, fromBase: (v) => v / (1024 ** 2) },
      { id: 'gb', name: 'Gigabytes', symbol: 'GB', toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / (1024 ** 3) },
      { id: 'tb', name: 'Terabytes', symbol: 'TB', toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / (1024 ** 4) },
    ],
  },
  {
    id: 'time',
    name: 'Tempo',
    iconName: 'Clock',
    units: [
      { id: 'sec', name: 'Segundos', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
      { id: 'min', name: 'Minutos', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { id: 'hr', name: 'Horas', symbol: 'h', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { id: 'day', name: 'Dias', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { id: 'wk', name: 'Semanas', symbol: 'sem', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      { id: 'yr', name: 'Anos', symbol: 'ano', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
    ],
  },
];

export function convertUnits(
  value: number,
  fromUnitId: string,
  toUnitId: string,
  categoryId: UnitCategory
): number {
  const cat = UNIT_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return value;
  const from = cat.units.find((u) => u.id === fromUnitId);
  const to = cat.units.find((u) => u.id === toUnitId);
  if (!from || !to) return value;

  const baseVal = from.toBase(value);
  const result = to.fromBase(baseVal);
  return result;
}
