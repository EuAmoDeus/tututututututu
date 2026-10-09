import React, { useState } from 'react';
import { Copy, Check, Delete } from 'lucide-react';
import { AngleMode } from '../types/calculator';

interface DisplayProps {
  expression: string;
  previewResult: string | null;
  result: string;
  error?: string;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  hasMemory: boolean;
  onBackspace: () => void;
  isScientific: boolean;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  previewResult,
  result,
  error,
  angleMode,
  onToggleAngleMode,
  hasMemory,
  onBackspace,
  isScientific,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = result || previewResult || expression || '0';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // Adjust font size dynamically based on length of displayed number
  const displayValue = error ? error : (result || expression || '0');
  const valueLength = displayValue.length;

  let fontSizeClass = 'text-4xl sm:text-5xl';
  if (valueLength > 16) {
    fontSizeClass = 'text-2xl sm:text-3xl';
  } else if (valueLength > 11) {
    fontSizeClass = 'text-3xl sm:text-4xl';
  }

  return (
    <div className="w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-inner relative select-text transition-all">
      {/* Top Status & Indicator Bar */}
      <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 gap-2">
        <div className="flex items-center gap-2">
          {isScientific && (
            <button
              onClick={onToggleAngleMode}
              title="Clique para alternar entre Graus (DEG) e Radianos (RAD)"
              className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700/60 cursor-pointer"
            >
              {angleMode}
            </button>
          )}

          {hasMemory && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-emerald-400 border border-neutral-700/50">
              M
            </span>
          )}
        </div>

        {/* Quick Actions (Copy & Backspace) */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            title="Copiar resultado"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copiar</span>
              </>
            )}
          </button>

          <button
            onClick={onBackspace}
            title="Apagar último caractere (Backspace)"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Apagar dígito"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expression line with scroll */}
      <div className="min-h-[26px] overflow-x-auto no-scrollbar text-right text-neutral-400 font-mono text-sm sm:text-base tracking-wide whitespace-nowrap mb-1">
        {expression ? (
          <span>{expression}</span>
        ) : (
          <span className="text-neutral-600">0</span>
        )}
      </div>

      {/* Main Result Line */}
      <div className="text-right flex items-baseline justify-end gap-2 overflow-x-auto no-scrollbar py-1">
        <span
          className={`font-mono font-bold tracking-tight transition-all tabular-nums ${fontSizeClass} ${
            error
              ? 'text-rose-400'
              : 'text-neutral-100'
          }`}
        >
          {displayValue}
        </span>
      </div>

      {/* Real-time Live Calculation Preview (when typing without pressing =) */}
      {previewResult && !error && !result && expression && (
        <div className="text-right text-xs sm:text-sm font-mono text-amber-400/80 mt-1 tabular-nums animate-fade-in">
          = {previewResult}
        </div>
      )}
    </div>
  );
};
