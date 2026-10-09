import React from 'react';
import { CalculatorMode, ThemeId } from '../types/calculator';
import { Volume2, VolumeX, Keyboard, Sun, Moon, Sparkles, Monitor } from 'lucide-react';

interface HeaderProps {
  currentMode: CalculatorMode;
  onSelectMode: (mode: CalculatorMode) => void;
  theme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  theme,
  onSelectTheme,
  soundEnabled,
  onToggleSound,
  onOpenShortcuts,
}) => {
  const modes: { id: CalculatorMode; label: string }[] = [
    { id: 'standard', label: 'Padrão' },
    { id: 'scientific', label: 'Científica' },
    { id: 'converter', label: 'Conversor' },
    { id: 'financial', label: 'Financeira' },
  ];

  const nextTheme: Record<ThemeId, ThemeId> = {
    dark: 'light',
    light: 'amoled',
    amoled: 'retro',
    retro: 'dark',
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="w-4 h-4 text-slate-300" />;
      case 'light':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'amoled':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'retro':
        return <Monitor className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getThemeName = () => {
    switch (theme) {
      case 'dark':
        return 'Tema Escuro';
      case 'light':
        return 'Tema Claro';
      case 'amoled':
        return 'Tema AMOLED';
      case 'retro':
        return 'Tema Vintage';
    }
  };

  return (
    <header className="w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-lg font-mono">
            ±
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-100 whitespace-nowrap font-sans">
            Calculadora Pro
          </span>
        </div>

        {/* Zone 2: Navigation modes */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {modes.map((m) => {
            const isActive = currentMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-800 text-amber-400 border border-neutral-700/60 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Audio Click Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Silenciar cliques sonoros' : 'Ativar feedback sonoro'}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              soundEnabled
                ? 'border-neutral-800 text-neutral-300 hover:bg-neutral-850 hover:text-white bg-neutral-900/60'
                : 'border-neutral-800/50 text-neutral-500 hover:bg-neutral-900 bg-neutral-950'
            }`}
            aria-label="Alternar som"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={onOpenShortcuts}
            title="Atalhos do teclado"
            className="hidden sm:flex p-2 rounded-lg border border-neutral-800 text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
            aria-label="Atalhos do teclado"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Theme switcher */}
          <button
            onClick={() => onSelectTheme(nextTheme[theme])}
            title={`Mudar tema (${getThemeName()})`}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/70 hover:bg-neutral-850 text-xs text-neutral-300 transition-colors cursor-pointer shrink-0"
          >
            {getThemeIcon()}
            <span className="hidden md:inline font-mono text-[11px] uppercase tracking-wider text-neutral-400">
              {theme}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
