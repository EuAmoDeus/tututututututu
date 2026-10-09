import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 - 9', desc: 'Digitar números' },
    { key: '+ - * /', desc: 'Operadores aritméticos básicos' },
    { key: '= ou Enter', desc: 'Calcular resultado' },
    { key: 'Backspace', desc: 'Apagar último caractere' },
    { key: 'Escape ou C', desc: 'Limpar tudo (All Clear)' },
    { key: '. ou ,', desc: 'Separador decimal' },
    { key: '%', desc: 'Calcular porcentagem' },
    { key: '( e )', desc: 'Abrir / fechar parênteses' },
    { key: '^', desc: 'Potenciação (ex: 2^3)' },
    { key: 'p', desc: 'Inserir constante Pi (π)' },
    { key: 'e', desc: 'Inserir número de Euler (e)' },
    { key: 's / c / t', desc: 'Funções seno, cosseno e tangente' },
    { key: 'r', desc: 'Raiz quadrada (sqrt)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-neutral-100 font-semibold text-base">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <span>Atalhos do Teclado</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar pr-1">
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-neutral-950/50 border border-neutral-850"
            >
              <kbd className="px-2 py-1 rounded bg-neutral-800 text-amber-400 font-mono text-xs font-bold border border-neutral-700/60 shadow-sm">
                {sc.key}
              </kbd>
              <span className="text-xs text-neutral-300">{sc.desc}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-neutral-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
