import type { GameState, StateLabels } from '../types/game';

interface StatusPanelProps {
  state: GameState;
  labels: StateLabels;
  previousState?: GameState;
}

const barColors = ['#3f6845', '#9b6c31', '#5a3a25', '#a85f3c'];

const formatDelta = (delta: number) => {
  if (delta === 0) {
    return '0';
  }
  return delta > 0 ? `+${delta}` : `${delta}`;
};

export const StatusPanel = ({
  state,
  labels,
  previousState,
}: StatusPanelProps) => {
  const entries = Object.entries(labels);

  return (
    <section className="mt-4 rounded-lg border border-umber-700/15 bg-white/35 p-4 shadow-insetPaper">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-forest-950">当前状态</h2>
        <span className="text-xs text-umber-700/70">变化会影响最终结局</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {entries.map(([key, meta], index) => {
          const value = state[key] ?? 0;
          const percent = ((value - meta.min) / (meta.max - meta.min)) * 100;
          const previousValue = previousState?.[key];
          const delta =
            typeof previousValue === 'number' ? value - previousValue : undefined;

          return (
            <div key={key} className="status-row">
              <div className="mb-1 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-umber-900">
                    {meta.label}
                  </p>
                  {meta.description && (
                    <p className="text-xs leading-5 text-umber-700/70">
                      {meta.description}
                    </p>
                  )}
                </div>
                <div className="flex min-w-[64px] items-center justify-end gap-2">
                  {typeof delta === 'number' && delta !== 0 && (
                    <span
                      className={
                        delta > 0
                          ? 'text-xs font-bold text-forest-700'
                          : 'text-xs font-bold text-clay-500'
                      }
                    >
                      {formatDelta(delta)}
                    </span>
                  )}
                  <span className="text-sm font-bold text-forest-950">
                    {value}
                  </span>
                </div>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-umber-700/15">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(0, Math.min(100, percent))}%`,
                    backgroundColor: barColors[index % barColors.length],
                  }}
                />
              </div>
              {(meta.lowText || meta.highText) && (
                <div className="mt-1 flex justify-between text-[11px] text-umber-700/55">
                  <span>{meta.lowText}</span>
                  <span>{meta.highText}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
