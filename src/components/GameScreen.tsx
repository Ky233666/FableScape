import type {
  Choice,
  FeedbackState,
  GameConfig,
  GameState,
  Scene,
} from '../types/game';
import { ChoiceButton } from './ChoiceButton';
import { FeedbackPanel } from './FeedbackPanel';
import { ProgressIndicator } from './ProgressIndicator';
import { StatusPanel } from './StatusPanel';

interface GameScreenProps {
  config: GameConfig;
  scene: Scene;
  roundIndex: number;
  totalRounds: number;
  state: GameState;
  feedback: FeedbackState | null;
  onChoose: (choice: Choice) => void;
  onContinue: () => void;
}

export const GameScreen = ({
  config,
  scene,
  roundIndex,
  totalRounds,
  state,
  feedback,
  onChoose,
  onContinue,
}: GameScreenProps) => {
  return (
    <section className="relative z-10 flex w-full flex-col px-5 py-5">
      <ProgressIndicator current={roundIndex + 1} total={totalRounds} />

      <div className="mt-4 rounded-lg border border-forest-900/15 bg-parchment-100/70 px-4 py-3 shadow-insetPaper">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold text-ochre-500">当前身份</p>
          <p className="text-right text-sm font-semibold text-forest-900">
            {config.playerRole}
          </p>
        </div>
      </div>

      <article className="mt-4">
        <p className="text-sm font-semibold text-ochre-500">{scene.title}</p>
        <p className="mt-2 font-story text-[1.7rem] font-semibold leading-10 text-forest-950">
          {scene.narrative}
        </p>
      </article>

      <StatusPanel
        state={state}
        labels={config.stateLabels}
        previousState={feedback?.previousState}
      />

      <div className="mt-auto pt-4">
        {feedback ? (
          <FeedbackPanel
            feedback={feedback}
            stateLabels={config.stateLabels}
            onContinue={onContinue}
          />
        ) : (
          <div className="space-y-3">
            {scene.choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                onChoose={onChoose}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
