import React from 'react';
import { HistoryItem } from '../types/calculator';
import { Trash2, Download, ArrowUpRight, Copy, Check } from 'lucide-react';
import { sound } from '../utils/soundEffects';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectCalculation: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelectCalculation,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const handleExport = () => {
    if (history.length === 0) return;
    const lines = history.map((h) => {
      const time = new Date(h.timestamp).toLocaleString('pt-BR');
      return `[${time}] ${h.expression} = ${h.result}`;
    });
    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calculadora_historico_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-200">
            Histórico de Cálculos
          </span>
          <span className="text-xs text-neutral-500 font-mono">
            ({history.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {history.length > 0 && (
            <>
              <button
                onClick={handleExport}
                title="Exportar histórico em arquivo de texto (.txt)"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exportar</span>
              </button>

              <button
                onClick={() => {
                  sound.playClear();
                  onClearHistory();
                }}
                title="Limpar todo o histórico"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 max-h-[480px]">
        {history.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center px-4 text-neutral-500 text-xs sm:text-sm">
            <span className="font-mono text-xl mb-1 text-neutral-600">∅</span>
            <p className="font-medium text-neutral-400">Nenhum cálculo registrado</p>
            <p className="text-neutral-500 text-xs mt-1">
              Os resultados dos seus cálculos aparecerão aqui para fácil consulta e reutilização.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                sound.playClick();
                onSelectCalculation(item);
              }}
              className="group p-3 rounded-xl bg-neutral-900/90 hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-neutral-700/80 transition-all cursor-pointer flex flex-col gap-1 relative"
            >
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span className="truncate max-w-[200px]" title={item.expression}>
                  {item.expression}
                </span>
                <span className="text-[10px] text-neutral-500 shrink-0">
                  {new Date(item.timestamp).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between mt-0.5">
                <span className="font-mono font-bold text-lg text-amber-400 tracking-tight tabular-nums">
                  = {item.result}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleCopy(item.id, item.result, e)}
                    title="Copiar resultado"
                    className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-700 cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    title="Usar este valor na calculadora"
                    className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-700 cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
