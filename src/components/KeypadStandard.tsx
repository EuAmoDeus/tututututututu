import React from 'react';
import { sound } from '../utils/soundEffects';

interface KeypadStandardProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onClear: () => void;
  onClearAll: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onEquals: () => void;
  onDecimal: () => void;
  onBackspace: () => void;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryStore: () => void;
  hasMemory: boolean;
}

export const KeypadStandard: React.FC<KeypadStandardProps> = ({
  onDigit,
  onOperator,
  onClear,
  onClearAll,
  onToggleSign,
  onPercentage,
  onEquals,
  onDecimal,
  onBackspace,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryStore,
  hasMemory,
}) => {
  const handleDigit = (d: string) => {
    sound.playClick();
    onDigit(d);
  };

  const handleOp = (op: string) => {
    sound.playOperator();
    onOperator(op);
  };

  const handleClear = () => {
    sound.playClear();
    onClear();
  };

  const handleClearAll = () => {
    sound.playClear();
    onClearAll();
  };

  const handleEq = () => {
    sound.playEquals();
    onEquals();
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Memory Bar */}
      <div className="grid grid-cols-5 gap-1.5 pb-1">
        <button
          onClick={() => { sound.playClick(); onMemoryClear(); }}
          disabled={!hasMemory}
          className="py-1.5 text-xs font-mono font-medium rounded-lg text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition-colors"
          title="Memory Clear (Limpar Memória)"
        >
          MC
        </button>
        <button
          onClick={() => { sound.playClick(); onMemoryRecall(); }}
          disabled={!hasMemory}
          className="py-1.5 text-xs font-mono font-medium rounded-lg text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 disabled:opacity-40 disabled:hover:text-neutral-400 disabled:cursor-not-allowed transition-colors"
          title="Memory Recall (Recuperar Memória)"
        >
          MR
        </button>
        <button
          onClick={() => { sound.playClick(); onMemoryAdd(); }}
          className="py-1.5 text-xs font-mono font-medium rounded-lg text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 transition-colors"
          title="Memory Add (Adicionar à Memória)"
        >
          M+
        </button>
        <button
          onClick={() => { sound.playClick(); onMemorySubtract(); }}
          className="py-1.5 text-xs font-mono font-medium rounded-lg text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 transition-colors"
          title="Memory Subtract (Subtrair da Memória)"
        >
          M-
        </button>
        <button
          onClick={() => { sound.playClick(); onMemoryStore(); }}
          className="py-1.5 text-xs font-mono font-medium rounded-lg text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 transition-colors"
          title="Memory Store (Armazenar na Memória)"
        >
          MS
        </button>
      </div>

      {/* Main Grid: 4 columns */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1 */}
        <button
          onClick={handleClearAll}
          onDoubleClick={handleClearAll}
          className="h-14 sm:h-16 rounded-xl font-mono text-base sm:text-lg font-semibold bg-neutral-800/80 hover:bg-neutral-750 text-rose-400 active:scale-[0.97] transition-all border border-neutral-700/40 shadow-sm cursor-pointer"
          title="Limpar Tudo (Escape)"
        >
          AC
        </button>
        <button
          onClick={() => { sound.playClick(); onToggleSign(); }}
          className="h-14 sm:h-16 rounded-xl font-mono text-base sm:text-lg font-semibold bg-neutral-800/80 hover:bg-neutral-750 text-neutral-200 active:scale-[0.97] transition-all border border-neutral-700/40 shadow-sm cursor-pointer"
          title="Alternar Sinal Positivo/Negativo (±)"
        >
          ±
        </button>
        <button
          onClick={() => { sound.playOperator(); onPercentage(); }}
          className="h-14 sm:h-16 rounded-xl font-mono text-base sm:text-lg font-semibold bg-neutral-800/80 hover:bg-neutral-750 text-neutral-200 active:scale-[0.97] transition-all border border-neutral-700/40 shadow-sm cursor-pointer"
          title="Porcentagem (%)"
        >
          %
        </button>
        <button
          onClick={() => handleOp('÷')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 active:scale-[0.97] transition-all border border-amber-500/30 shadow-sm cursor-pointer"
          title="Dividir (/)"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => handleDigit('7')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-100 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
        >
          7
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-100 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
        >
          8
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-100 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
        >
          9
        </button>
        <button
          onClick={() => handleOp('×')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 active:scale-[0.97] transition-all border border-amber-500/30 shadow-sm cursor-pointer"
          title="Multiplicar (*)"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => handleDigit('4')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-100 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
        >
          4
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-100 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
        >
          5
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-100 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
        >
          6
        </button>
        <button
          onClick={() => handleOp('−')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 active:scale-[0.97] transition-all border border-amber-500/30 shadow-sm cursor-pointer"
          title="Subtrair (-)"
        >
          −
        </button>

        {/* Row 4 */}
        <button
          onClick={() => handleDigit('1')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-100 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
        >
          1
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-100 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
        >
          2
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-100 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
        >
          3
        </button>
        <button
          onClick={() => handleOp('+')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 active:scale-[0.97] transition-all border border-amber-500/30 shadow-sm cursor-pointer"
          title="Somar (+)"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={() => handleDigit('0')}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-100 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
        >
          0
        </button>
        <button
          onClick={() => { sound.playClick(); onDecimal(); }}
          className="h-14 sm:h-16 rounded-xl font-mono text-xl sm:text-2xl font-semibold bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-100 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
          title="Separador decimal (, ou .)"
        >
          .
        </button>
        <button
          onClick={() => { sound.playClick(); onBackspace(); }}
          className="h-14 sm:h-16 rounded-xl font-mono text-lg sm:text-xl font-semibold bg-neutral-900/90 hover:bg-neutral-800/90 text-neutral-300 active:scale-[0.97] transition-all border border-neutral-800/80 shadow-sm cursor-pointer"
          title="Apagar dígito (Backspace)"
        >
          ⌫
        </button>
        <button
          onClick={handleEq}
          className="h-14 sm:h-16 rounded-xl font-mono text-2xl sm:text-3xl font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 active:scale-[0.97] transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          title="Calcular resultado (= ou Enter)"
        >
          =
        </button>
      </div>
    </div>
  );
};
