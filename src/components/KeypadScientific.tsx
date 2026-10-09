import React, { useState } from 'react';
import { sound } from '../utils/soundEffects';

interface KeypadScientificProps {
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onFunction: (funcName: string) => void;
  onClear: () => void;
  onClearAll: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onEquals: () => void;
  onDecimal: () => void;
  onBackspace: () => void;
  onInsertConstant: (constant: string) => void;
  onInsertParenthesis: (p: '(' | ')') => void;
}

export const KeypadScientific: React.FC<KeypadScientificProps> = ({
  onDigit,
  onOperator,
  onFunction,
  onClearAll,
  onToggleSign,
  onPercentage,
  onEquals,
  onDecimal,
  onBackspace,
  onInsertConstant,
  onInsertParenthesis,
}) => {
  const [isSecond, setIsSecond] = useState(false);

  const handleDigit = (d: string) => {
    sound.playClick();
    onDigit(d);
  };

  const handleOp = (op: string) => {
    sound.playOperator();
    onOperator(op);
  };

  const handleFunc = (fn: string) => {
    sound.playOperator();
    onFunction(fn);
  };

  const handleEq = () => {
    sound.playEquals();
    onEquals();
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 2nd toggle bar */}
      <div className="flex items-center justify-between pb-1 text-xs">
        <button
          onClick={() => {
            sound.playClick();
            setIsSecond(!isSecond);
          }}
          className={`px-3 py-1 rounded-lg font-mono font-semibold transition-all cursor-pointer ${
            isSecond
              ? 'bg-amber-500 text-neutral-950 shadow-sm'
              : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300 border border-neutral-700/50'
          }`}
          title="Alternar funções secundárias (inversas)"
        >
          2nd {isSecond ? 'ATIVADO' : ''}
        </button>

        <span className="text-[11px] text-neutral-500 font-mono">
          Funções Científicas
        </span>
      </div>

      {/* Grid: 5 columns on mobile, 5 or 6 on desktop */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Row 1: Advanced math */}
        <button
          onClick={() => handleFunc(isSecond ? 'asin' : 'sin')}
          className="h-12 sm:h-13 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-neutral-850 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          {isSecond ? 'sin⁻¹' : 'sin'}
        </button>
        <button
          onClick={() => handleFunc(isSecond ? 'acos' : 'cos')}
          className="h-12 sm:h-13 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-neutral-850 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          {isSecond ? 'cos⁻¹' : 'cos'}
        </button>
        <button
          onClick={() => handleFunc(isSecond ? 'atan' : 'tan')}
          className="h-12 sm:h-13 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-neutral-850 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          {isSecond ? 'tan⁻¹' : 'tan'}
        </button>
        <button
          onClick={() => handleFunc(isSecond ? 'exp' : 'ln')}
          className="h-12 sm:h-13 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-neutral-850 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          {isSecond ? 'eˣ' : 'ln'}
        </button>
        <button
          onClick={() => handleFunc(isSecond ? 'pow10' : 'log')}
          className="h-12 sm:h-13 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-neutral-850 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          {isSecond ? '10ˣ' : 'log'}
        </button>

        {/* Row 2: Powers, Roots, Fact */}
        <button
          onClick={() => handleFunc(isSecond ? 'cbrt' : 'sqrt')}
          className="h-12 sm:h-13 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-neutral-850 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          {isSecond ? '³√x' : '√x'}
        </button>
        <button
          onClick={() => handleFunc(isSecond ? 'cube' : 'sqr')}
          className="h-12 sm:h-13 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-neutral-850 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          {isSecond ? 'x³' : 'x²'}
        </button>
        <button
          onClick={() => handleOp('^')}
          className="h-12 sm:h-13 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-neutral-850 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          xʸ
        </button>
        <button
          onClick={() => handleFunc('fact')}
          className="h-12 sm:h-13 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-neutral-850 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          x!
        </button>
        <button
          onClick={() => handleFunc('inv')}
          className="h-12 sm:h-13 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-neutral-850 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          1/x
        </button>

        {/* Row 3: Constants & Parentheses */}
        <button
          onClick={() => { sound.playClick(); onInsertConstant('π'); }}
          className="h-12 sm:h-13 rounded-xl font-mono text-sm sm:text-base font-semibold bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          π
        </button>
        <button
          onClick={() => { sound.playClick(); onInsertConstant('e'); }}
          className="h-12 sm:h-13 rounded-xl font-mono text-sm sm:text-base font-semibold bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          e
        </button>
        <button
          onClick={() => { sound.playClick(); onInsertParenthesis('('); }}
          className="h-12 sm:h-13 rounded-xl font-mono text-sm sm:text-base font-semibold bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          (
        </button>
        <button
          onClick={() => { sound.playClick(); onInsertParenthesis(')'); }}
          className="h-12 sm:h-13 rounded-xl font-mono text-sm sm:text-base font-semibold bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          )
        </button>
        <button
          onClick={() => { sound.playClear(); onClearAll(); }}
          className="h-12 sm:h-13 rounded-xl font-mono text-xs sm:text-sm font-bold bg-neutral-800 hover:bg-neutral-750 text-rose-400 border border-neutral-700/40 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          AC
        </button>

        {/* Row 4: Digits 7,8,9 + Op / */}
        <button
          onClick={() => handleFunc('abs')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-neutral-850 hover:bg-neutral-800 text-cyan-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          |x|
        </button>
        <button
          onClick={() => handleDigit('7')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          7
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          8
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          9
        </button>
        <button
          onClick={() => handleOp('÷')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          ÷
        </button>

        {/* Row 5: Digits 4,5,6 + Op * */}
        <button
          onClick={() => { sound.playOperator(); onPercentage(); }}
          className="h-13 sm:h-14 rounded-xl font-mono text-sm sm:text-base font-semibold bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          %
        </button>
        <button
          onClick={() => handleDigit('4')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          4
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          5
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          6
        </button>
        <button
          onClick={() => handleOp('×')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          ×
        </button>

        {/* Row 6: Digits 1,2,3 + Op - */}
        <button
          onClick={() => { sound.playClick(); onToggleSign(); }}
          className="h-13 sm:h-14 rounded-xl font-mono text-base font-semibold bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          ±
        </button>
        <button
          onClick={() => handleDigit('1')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          1
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          2
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          3
        </button>
        <button
          onClick={() => handleOp('−')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          −
        </button>

        {/* Row 7: 0, ., Backspace, +, = */}
        <button
          onClick={() => { sound.playClick(); onBackspace(); }}
          className="h-13 sm:h-14 rounded-xl font-mono text-base font-semibold bg-neutral-850 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
          title="Apagar (Backspace)"
        >
          ⌫
        </button>
        <button
          onClick={() => handleDigit('0')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          0
        </button>
        <button
          onClick={() => { sound.playClick(); onDecimal(); }}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-100 border border-neutral-800 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          .
        </button>
        <button
          onClick={() => handleOp('+')}
          className="h-13 sm:h-14 rounded-xl font-mono text-xl sm:text-2xl font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 shadow-sm transition-all active:scale-[0.97] cursor-pointer"
        >
          +
        </button>
        <button
          onClick={handleEq}
          className="h-13 sm:h-14 rounded-xl font-mono text-2xl font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20 transition-all active:scale-[0.97] cursor-pointer"
        >
          =
        </button>
      </div>
    </div>
  );
};
