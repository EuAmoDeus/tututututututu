import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CalculatorMode, AngleMode, ThemeId, HistoryItem } from './types/calculator';
import { Header } from './components/Header';
import { Display } from './components/Display';
import { KeypadStandard } from './components/KeypadStandard';
import { KeypadScientific } from './components/KeypadScientific';
import { HistoryPanel } from './components/HistoryPanel';
import { UnitConverterPanel } from './components/UnitConverterPanel';
import { FinancialCalculatorPanel } from './components/FinancialCalculatorPanel';
import { ShortcutsModal } from './components/ShortcutsModal';
import { evaluateExpression, formatResult } from './utils/mathEngine';
import { sound } from './utils/soundEffects';

export default function App() {
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string | undefined>(undefined);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [memory, setMemory] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('calc_memory');
      return saved ? parseFloat(saved) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [theme, setTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem('calc_theme');
      return (saved as ThemeId) || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sound.enabled);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [showHistoryMobile, setShowHistoryMobile] = useState<boolean>(false);

  // Sync memory to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('calc_memory', memory.toString());
    } catch {
      // ignore
    }
  }, [memory]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('calc_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Sync theme
  const handleSelectTheme = (t: ThemeId) => {
    setTheme(t);
    try {
      localStorage.setItem('calc_theme', t);
    } catch {
      // ignore
    }
  };

  // Toggle sound
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sound.setEnabled(nextVal);
  };

  // Live preview evaluation
  const previewResult = useMemo(() => {
    if (!expression || result || error) return null;
    // Only calculate preview if expression has an operator or function
    if (!/[+\-×÷*/%^()]|[a-z]{2,}/i.test(expression)) return null;

    const { result: val, error: err } = evaluateExpression(expression, angleMode);
    if (err || Number.isNaN(val) || !Number.isFinite(val)) return null;
    return formatResult(val);
  }, [expression, result, error, angleMode]);

  // Digit input
  const handleDigit = useCallback((d: string) => {
    setError(undefined);
    if (result) {
      // Start fresh calculation
      setExpression(d);
      setResult('');
      return;
    }
    setExpression((prev) => prev + d);
  }, [result]);

  // Operator input (+, -, *, /)
  const handleOperator = useCallback((op: string) => {
    setError(undefined);
    let base = expression;
    if (result) {
      base = result;
      setResult('');
    }

    if (!base && op !== '−' && op !== '-') {
      return;
    }

    // If last char is an operator, replace it
    const lastChar = base.slice(-1);
    if (['+', '−', '-', '×', '*', '÷', '/', '^'].includes(lastChar)) {
      setExpression(base.slice(0, -1) + op);
    } else {
      setExpression(base + op);
    }
  }, [expression, result]);

  // Decimal point
  const handleDecimal = useCallback(() => {
    setError(undefined);
    if (result) {
      setExpression('0.');
      setResult('');
      return;
    }
    if (!expression) {
      setExpression('0.');
      return;
    }

    // Check if current number segment already has a dot
    const segments = expression.split(/[+\-×÷*/%^()]/);
    const currentSegment = segments[segments.length - 1];
    if (currentSegment && currentSegment.includes('.')) {
      return;
    }
    setExpression((prev) => prev + '.');
  }, [expression, result]);

  // Backspace
  const handleBackspace = useCallback(() => {
    setError(undefined);
    if (result) {
      setResult('');
      return;
    }
    setExpression((prev) => prev.slice(0, -1));
  }, [result]);

  // Clear current / Clear all
  const handleClear = useCallback(() => {
    setError(undefined);
    setExpression('');
    setResult('');
  }, []);

  const handleClearAll = useCallback(() => {
    setError(undefined);
    setExpression('');
    setResult('');
  }, []);

  // Sign toggle
  const handleToggleSign = useCallback(() => {
    if (result) {
      const val = parseFloat(result);
      if (!isNaN(val)) {
        setResult((-val).toString());
      }
      return;
    }
    if (!expression) return;

    // Check if wrapped in -(...)
    if (expression.startsWith('-(') && expression.endsWith(')')) {
      setExpression(expression.slice(2, -1));
    } else if (expression.startsWith('-')) {
      setExpression(expression.slice(1));
    } else {
      setExpression('-(' + expression + ')');
    }
  }, [expression, result]);

  // Percentage
  const handlePercentage = useCallback(() => {
    if (result) {
      const val = parseFloat(result) / 100;
      setResult(val.toString());
      return;
    }
    if (!expression) return;
    setExpression((prev) => prev + '%');
  }, [expression, result]);

  // Equals / Calculate
  const handleEquals = useCallback(() => {
    if (!expression) return;

    const { result: val, error: err } = evaluateExpression(expression, angleMode);

    if (err || Number.isNaN(val)) {
      setError(err || 'Erro no cálculo');
      return;
    }

    const formatted = formatResult(val);
    setResult(formatted);
    setError(undefined);

    // Save to history
    const newItem: HistoryItem = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      expression,
      result: formatted,
      timestamp: Date.now(),
      mode: mode === 'scientific' ? 'scientific' : 'standard',
    };
    setHistory((prev) => [newItem, ...prev.slice(0, 49)]); // keep up to 50 items
  }, [expression, angleMode, mode]);

  // Function insertion for scientific mode
  const handleFunction = useCallback((fn: string) => {
    setError(undefined);
    if (result) {
      setExpression('');
      setResult('');
    }

    switch (fn) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'asin':
      case 'acos':
      case 'atan':
      case 'sinh':
      case 'cosh':
      case 'tanh':
      case 'sqrt':
      case 'cbrt':
      case 'ln':
      case 'log':
      case 'abs':
      case 'exp':
        setExpression((prev) => prev + `${fn}(`);
        break;
      case 'sqr':
        setExpression((prev) => (prev ? `(${prev})^2` : '0^2'));
        break;
      case 'cube':
        setExpression((prev) => (prev ? `(${prev})^3` : '0^3'));
        break;
      case 'pow10':
        setExpression((prev) => prev + '10^(');
        break;
      case 'inv':
        setExpression((prev) => (prev ? `1/(${prev})` : '1/'));
        break;
      case 'fact':
        setExpression((prev) => prev + '!');
        break;
      default:
        break;
    }
  }, [result]);

  // Constants
  const handleInsertConstant = useCallback((constant: string) => {
    setError(undefined);
    if (result) {
      setExpression(constant);
      setResult('');
      return;
    }
    setExpression((prev) => prev + constant);
  }, [result]);

  // Parentheses
  const handleInsertParenthesis = useCallback((p: '(' | ')') => {
    setError(undefined);
    if (result && p === '(') {
      setExpression('(');
      setResult('');
      return;
    }
    setExpression((prev) => prev + p);
  }, [result]);

  // Memory functions
  const handleMemoryClear = () => {
    setMemory(0);
  };

  const handleMemoryRecall = () => {
    if (memory === 0) return;
    const formatted = formatResult(memory);
    if (result) {
      setExpression(formatted);
      setResult('');
    } else {
      setExpression((prev) => prev + formatted);
    }
  };

  const handleMemoryAdd = () => {
    const currentVal = parseFloat(result || previewResult || expression) || 0;
    setMemory((prev) => prev + currentVal);
  };

  const handleMemorySubtract = () => {
    const currentVal = parseFloat(result || previewResult || expression) || 0;
    setMemory((prev) => prev - currentVal);
  };

  const handleMemoryStore = () => {
    const currentVal = parseFloat(result || previewResult || expression) || 0;
    setMemory(currentVal);
  };

  // Select item from history
  const handleSelectCalculation = (item: HistoryItem) => {
    setExpression(item.result);
    setResult('');
    setError(undefined);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('calc_history');
    } catch {
      // ignore
    }
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or select
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        sound.playClick();
        handleDigit(e.key);
      } else if (e.key === '+' || e.key === '-') {
        e.preventDefault();
        sound.playOperator();
        handleOperator(e.key === '-' ? '−' : '+');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        sound.playOperator();
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        sound.playOperator();
        handleOperator('÷');
      } else if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        sound.playClick();
        handleDecimal();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        sound.playEquals();
        handleEquals();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        sound.playClick();
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        e.preventDefault();
        sound.playClear();
        handleClear();
      } else if (e.key === '%') {
        e.preventDefault();
        sound.playOperator();
        handlePercentage();
      } else if (e.key === '(' || e.key === ')') {
        e.preventDefault();
        sound.playClick();
        handleInsertParenthesis(e.key as '(' | ')');
      } else if (e.key === '^') {
        e.preventDefault();
        sound.playOperator();
        handleOperator('^');
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        sound.playClick();
        handleInsertConstant('π');
      } else if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        sound.playClick();
        handleInsertConstant('e');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleDigit,
    handleOperator,
    handleDecimal,
    handleEquals,
    handleBackspace,
    handleClear,
    handlePercentage,
    handleInsertParenthesis,
    handleInsertConstant,
  ]);

  // Theme container classes
  const getThemeWrapperClass = () => {
    switch (theme) {
      case 'light':
        return 'bg-zinc-100 text-zinc-900';
      case 'amoled':
        return 'bg-black text-cyan-400';
      case 'retro':
        return 'bg-[#18201a] text-[#86efac]';
      case 'dark':
      default:
        return 'bg-neutral-950 text-neutral-100';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${getThemeWrapperClass()}`}>
      {/* Top Bar following Top Bar Contract */}
      <Header
        currentMode={mode}
        onSelectMode={setMode}
        theme={theme}
        onSelectTheme={handleSelectTheme}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
        {/* Standard / Scientific Calculator View */}
        {(mode === 'standard' || mode === 'scientific') && (
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Calculator Card Container */}
            <div
              className={`w-full ${
                mode === 'scientific' ? 'lg:col-span-8 max-w-2xl mx-auto' : 'lg:col-span-7 max-w-md mx-auto'
              } flex flex-col gap-4 bg-neutral-925/80 border border-neutral-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl`}
            >
              {/* Display */}
              <Display
                expression={expression}
                previewResult={previewResult}
                result={result}
                error={error}
                angleMode={angleMode}
                onToggleAngleMode={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
                hasMemory={memory !== 0}
                onBackspace={handleBackspace}
                isScientific={mode === 'scientific'}
              />

              {/* Keypad */}
              {mode === 'standard' ? (
                <KeypadStandard
                  onDigit={handleDigit}
                  onOperator={handleOperator}
                  onClear={handleClear}
                  onClearAll={handleClearAll}
                  onToggleSign={handleToggleSign}
                  onPercentage={handlePercentage}
                  onEquals={handleEquals}
                  onDecimal={handleDecimal}
                  onBackspace={handleBackspace}
                  onMemoryClear={handleMemoryClear}
                  onMemoryRecall={handleMemoryRecall}
                  onMemoryAdd={handleMemoryAdd}
                  onMemorySubtract={handleMemorySubtract}
                  onMemoryStore={handleMemoryStore}
                  hasMemory={memory !== 0}
                />
              ) : (
                <KeypadScientific
                  onDigit={handleDigit}
                  onOperator={handleOperator}
                  onFunction={handleFunction}
                  onClear={handleClear}
                  onClearAll={handleClearAll}
                  onToggleSign={handleToggleSign}
                  onPercentage={handlePercentage}
                  onEquals={handleEquals}
                  onDecimal={handleDecimal}
                  onBackspace={handleBackspace}
                  onInsertConstant={handleInsertConstant}
                  onInsertParenthesis={handleInsertParenthesis}
                />
              )}
            </div>

            {/* Desktop History Panel (always visible on desktop, toggleable on mobile) */}
            <div
              className={`w-full ${
                mode === 'scientific' ? 'lg:col-span-4' : 'lg:col-span-5'
              } hidden lg:block`}
            >
              <HistoryPanel
                history={history}
                onSelectCalculation={handleSelectCalculation}
                onClearHistory={handleClearHistory}
              />
            </div>

            {/* Mobile History Accordion / Drawer Trigger */}
            <div className="lg:hidden w-full max-w-md mx-auto">
              <button
                onClick={() => setShowHistoryMobile(!showHistoryMobile)}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 flex items-center justify-between cursor-pointer"
              >
                <span>Histórico de Cálculos ({history.length})</span>
                <span className="font-mono text-amber-400">
                  {showHistoryMobile ? '▲ Ocultar' : '▼ Ver'}
                </span>
              </button>

              {showHistoryMobile && (
                <div className="mt-2">
                  <HistoryPanel
                    history={history}
                    onSelectCalculation={(item) => {
                      handleSelectCalculation(item);
                      setShowHistoryMobile(false);
                    }}
                    onClearHistory={handleClearHistory}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Unit Converter View */}
        {mode === 'converter' && (
          <div className="w-full max-w-4xl">
            <UnitConverterPanel />
          </div>
        )}

        {/* Financial View */}
        {mode === 'financial' && (
          <div className="w-full max-w-4xl">
            <FinancialCalculatorPanel />
          </div>
        )}
      </main>

      {/* Footer following Anti-Slop Cleanliness: quiet, clean human text */}
      <footer className="w-full border-t border-neutral-850/60 py-4 px-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Calculadora Pro · Precisão Decimal & Engenharia Financeira</p>
          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span>Atalhos: [0-9], [+-*/], [Enter], [Backspace], [Esc]</span>
          </div>
        </div>
      </footer>

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
