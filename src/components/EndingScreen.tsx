import type { Ending, GameConfig, GameState } from '../types/game';
import { StatusPanel } from './StatusPanel';

interface EndingScreenProps {
  config: GameConfig;
  ending: Ending;
  finalState: GameState;
  onRestart: () => void;
}

export const EndingScreen = ({
  config,
  ending,
  finalState,
  onRestart,
}: EndingScreenProps) => {
  const metaphorItems =
    ending.metaphorMapping.length > 0
      ? ending.metaphorMapping
      : config.metaphorExplanation;

  return (
    <section className="relative z-10 flex w-full flex-col overflow-y-auto px-5 py-5">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ochre-500">
        结局
      </p>
      <h1 className="mt-2 font-story text-4xl font-semibold leading-tight text-forest-950">
        {ending.title}
      </h1>
      <p className="mt-4 text-base leading-8 text-umber-700">
        {ending.narrative}
      </p>

      <StatusPanel state={finalState} labels={config.stateLabels} />

      <div className="mt-4 rounded-lg border border-forest-900/15 bg-forest-900 px-4 py-4 text-parchment-50">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ochre-300">
          概念揭示
        </p>
        <h2 className="mt-2 text-2xl font-bold">{config.conceptName}</h2>
        <p className="mt-2 text-sm leading-7 text-parchment-100">
          {ending.conceptReveal}
        </p>
        <p className="mt-3 text-sm leading-7 text-parchment-100/90">
          {ending.explanation}
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-umber-700/15 bg-white/35 p-4">
        <h2 className="text-sm font-bold text-forest-950">故事隐喻</h2>
        <div className="mt-3 space-y-2">
          {metaphorItems.map((item) => (
            <div
              key={`${item.storyElement}-${item.realWorldMeaning}`}
              className="rounded-md bg-parchment-100/80 px-3 py-2"
            >
              <p className="text-sm font-bold text-umber-900">
                {item.storyElement}
              </p>
              <p className="mt-1 text-sm leading-6 text-umber-700">
                {item.realWorldMeaning}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button className="primary-button mt-5 w-full" type="button" onClick={onRestart}>
        重新体验
      </button>
    </section>
  );
};
