import React, { useState } from 'react';
import { UnitCategory } from '../types/calculator';
import { UNIT_CATEGORIES, convertUnits } from '../utils/unitConverter';
import { ArrowLeftRight, Copy, Check, Ruler, Scale, Thermometer, Coins, Square, Droplet, Gauge, HardDrive, Clock } from 'lucide-react';
import { cleanFloat } from '../utils/mathEngine';
import { sound } from '../utils/soundEffects';

export const UnitConverterPanel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<UnitCategory>('length');
  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [copied, setCopied] = useState<boolean>(false);

  const currentCat = UNIT_CATEGORIES.find((c) => c.id === selectedCategory) || UNIT_CATEGORIES[0];

  // When category changes, reset units
  const handleCategoryChange = (catId: UnitCategory) => {
    sound.playClick();
    setSelectedCategory(catId);
    const cat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.units.length >= 2) {
      setFromUnit(cat.units[0].id);
      setToUnit(cat.units[1].id);
    }
  };

  const numericFrom = parseFloat(fromValue) || 0;
  const convertedValue = convertUnits(numericFrom, fromUnit, toUnit, selectedCategory);
  const displayConverted = isNaN(convertedValue) ? '0' : cleanFloat(convertedValue).toString();

  const handleSwap = () => {
    sound.playOperator();
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(displayConverted);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const getCategoryIcon = (id: UnitCategory) => {
    const props = { className: 'w-4 h-4' };
    switch (id) {
      case 'length': return <Ruler {...props} />;
      case 'mass': return <Scale {...props} />;
      case 'temperature': return <Thermometer {...props} />;
      case 'currency': return <Coins {...props} />;
      case 'area': return <Square {...props} />;
      case 'volume': return <Droplet {...props} />;
      case 'speed': return <Gauge {...props} />;
      case 'digital': return <HardDrive {...props} />;
      case 'time': return <Clock {...props} />;
    }
  };

  const fromUnitObj = currentCat.units.find((u) => u.id === fromUnit);
  const toUnitObj = currentCat.units.find((u) => u.id === toUnit);

  return (
    <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
      {/* Category Pills/Tabs */}
      <div>
        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
          Categoria de Medida
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
          {UNIT_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40 shadow-sm'
                    : 'bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span className="truncate max-w-[70px] text-[11px]">{cat.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversion Dual Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
        {/* Source Unit Box */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Converter de:</span>
            <span className="font-mono text-amber-400 font-semibold">{fromUnitObj?.symbol}</span>
          </div>

          <input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            className="w-full bg-transparent font-mono text-2xl sm:text-3xl font-bold text-neutral-100 focus:outline-none tabular-nums"
            placeholder="0"
          />

          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700/60 rounded-lg py-2 px-3 text-sm text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {currentCat.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            title="Inverter unidades"
            className="p-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 hover:text-amber-400 border border-neutral-700/60 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* Target Unit Box */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 flex flex-col gap-2 relative">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Para:</span>
            <span className="font-mono text-amber-400 font-semibold">{toUnitObj?.symbol}</span>
          </div>

          <div className="w-full font-mono text-2xl sm:text-3xl font-bold text-amber-400 truncate tabular-nums min-h-[36px] flex items-center justify-between">
            <span>{displayConverted}</span>
            <button
              onClick={handleCopy}
              title="Copiar valor convertido"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700/60 rounded-lg py-2 px-3 text-sm text-neutral-200 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            {currentCat.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reference comparison table for this category */}
      <div className="border-t border-neutral-800/80 pt-3">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
          Equivalências diretas para {fromValue || '1'} {fromUnitObj?.symbol}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs font-mono">
          {currentCat.units.slice(0, 8).map((u) => {
            const eq = convertUnits(numericFrom, fromUnit, u.id, selectedCategory);
            return (
              <div
                key={u.id}
                className="p-2.5 rounded-lg bg-neutral-950/40 border border-neutral-800/60 flex flex-col"
              >
                <span className="text-neutral-500 text-[11px] truncate">{u.name}</span>
                <span className="text-neutral-200 font-bold tabular-nums truncate mt-0.5">
                  {cleanFloat(eq)} {u.symbol}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
