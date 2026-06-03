import type { GameConfig } from '../types/game';

interface StartScreenProps {
  config: GameConfig;
  onStart: () => void;
}

export const StartScreen = ({ config, onStart }: StartScreenProps) => {
  return (
    <section className="relative z-10 flex w-full flex-col">
      <div className="relative h-[42svh] min-h-[260px] overflow-hidden">
        {config.coverImage && (
          <img
            src={config.coverImage}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/10 via-transparent to-parchment-50" />
      </div>

      <div className="flex flex-1 flex-col px-6 pb-8 pt-2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-ochre-500">
          互动概念寓言
        </p>
        <h1 className="font-story text-5xl font-semibold leading-tight text-forest-950">
          {config.title}
        </h1>
        <p className="mt-4 text-base leading-8 text-umber-700">
          {config.subtitle}
        </p>
        <div className="mt-5 border-l-4 border-ochre-300 bg-parchment-100/70 px-4 py-3 text-sm leading-7 text-umber-700 shadow-insetPaper">
          {config.intro}
        </div>
        <div className="mt-auto pt-7">
          <button className="primary-button w-full" type="button" onClick={onStart}>
            开始体验
          </button>
          <p className="mt-4 text-center text-xs leading-6 text-umber-700/70">
            身份：{config.playerRole}
          </p>
        </div>
      </div>
    </section>
  );
};
