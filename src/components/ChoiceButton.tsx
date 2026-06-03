import type { Choice } from '../types/game';

interface ChoiceButtonProps {
  choice: Choice;
  onChoose: (choice: Choice) => void;
}

export const ChoiceButton = ({ choice, onChoose }: ChoiceButtonProps) => {
  return (
    <button
      type="button"
      className="choice-button group w-full text-left"
      onClick={() => onChoose(choice)}
    >
      <span className="block text-base font-bold text-forest-950">
        {choice.text}
      </span>
      <span className="mt-1 block text-sm leading-6 text-umber-700">
        {choice.description}
      </span>
    </button>
  );
};
