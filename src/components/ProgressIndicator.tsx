interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export const ProgressIndicator = ({ current, total }: ProgressIndicatorProps) => {
  return (
    <header>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-forest-950">
          第 {current} / {total} 轮
        </p>
        <p className="text-xs text-umber-700/70">选择会留下痕迹</p>
      </div>
      <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}>
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={
              index < current
                ? 'h-1.5 rounded-full bg-ochre-500'
                : 'h-1.5 rounded-full bg-umber-700/15'
            }
          />
        ))}
      </div>
    </header>
  );
};
