import type { FeedbackState, StateLabels } from '../types/game';

interface FeedbackPanelProps {
  feedback: FeedbackState;
  stateLabels: StateLabels;
  onContinue: () => void;
}

export const FeedbackPanel = ({
  feedback,
  stateLabels,
  onContinue,
}: FeedbackPanelProps) => {
  const changedEntries = Object.entries(feedback.choice.effects).filter(
    ([, delta]) => delta !== 0,
  );

  return (
    <div className="rounded-lg border border-ochre-300/60 bg-parchment-100 p-4 shadow-insetPaper">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-ochre-500">
        选择结果
      </p>
      <h3 className="mt-2 text-lg font-bold text-forest-950">
        {feedback.choice.text}
      </h3>
      <p className="mt-2 text-sm leading-7 text-umber-700">
        {feedback.choice.feedback}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {changedEntries.map(([key, delta]) => (
          <div
            key={key}
            className="rounded-md border border-umber-700/10 bg-parchment-50/70 px-3 py-2"
          >
            <p className="text-xs text-umber-700/65">
              {stateLabels[key]?.label ?? key}
            </p>
            <p
              className={
                delta > 0
                  ? 'text-sm font-bold text-forest-700'
                  : 'text-sm font-bold text-clay-500'
              }
            >
              {delta > 0 ? `+${delta}` : delta}
            </p>
          </div>
        ))}
      </div>
      <button
        className="primary-button mt-4 w-full"
        type="button"
        onClick={onContinue}
      >
        继续
      </button>
    </div>
  );
};
