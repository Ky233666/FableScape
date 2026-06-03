import { useMemo, useState } from 'react';
import { commonsTragedyConfig } from './data/commonsTragedyConfig';
import { applyEffects } from './engine/applyEffects';
import { getEnding } from './engine/getEnding';
import type {
  Choice,
  ChoiceRecord,
  Ending,
  FeedbackState,
  GameState,
  Scene,
} from './types/game';
import { EndingScreen } from './components/EndingScreen';
import { GameScreen } from './components/GameScreen';
import { StartScreen } from './components/StartScreen';

const gameConfig = commonsTragedyConfig;

type Phase = 'start' | 'playing' | 'ending';

const getSceneIndex = (scenes: Scene[], sceneId: string) => {
  return Math.max(
    scenes.findIndex((scene) => scene.id === sceneId),
    0,
  );
};

function App() {
  const [phase, setPhase] = useState<Phase>('start');
  const [state, setState] = useState<GameState>(gameConfig.initialState);
  const [currentSceneId, setCurrentSceneId] = useState(gameConfig.scenes[0].id);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [history, setHistory] = useState<ChoiceRecord[]>([]);
  const [ending, setEnding] = useState<Ending | null>(null);

  const currentSceneIndex = useMemo(
    () => getSceneIndex(gameConfig.scenes, currentSceneId),
    [currentSceneId],
  );

  const currentScene = gameConfig.scenes[currentSceneIndex];

  const resetGame = () => {
    setPhase('start');
    setState(gameConfig.initialState);
    setCurrentSceneId(gameConfig.scenes[0].id);
    setFeedback(null);
    setHistory([]);
    setEnding(null);
  };

  const startGame = () => {
    setPhase('playing');
    setState(gameConfig.initialState);
    setCurrentSceneId(gameConfig.scenes[0].id);
    setFeedback(null);
    setHistory([]);
    setEnding(null);
  };

  const handleChoose = (choice: Choice) => {
    const nextState = applyEffects(state, choice.effects, gameConfig.stateLabels);
    const record: ChoiceRecord = {
      sceneId: currentScene.id,
      choiceId: choice.id,
      effects: choice.effects,
      tags: choice.tags ?? [],
    };

    setState(nextState);
    setHistory((current) => [...current, record]);
    setFeedback({
      choice,
      previousState: state,
      nextState,
    });
  };

  const handleContinue = () => {
    if (!feedback) {
      return;
    }

    const nextSceneId =
      feedback.choice.nextSceneId ?? gameConfig.scenes[currentSceneIndex + 1]?.id;

    if (nextSceneId) {
      setCurrentSceneId(nextSceneId);
      setFeedback(null);
      return;
    }

    setEnding(getEnding(gameConfig, state, history));
    setFeedback(null);
    setPhase('ending');
  };

  return (
    <main className="min-h-screen bg-forest-950 text-umber-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] items-stretch bg-[radial-gradient(circle_at_top,#3f6845_0,#203b2a_44%,#17231b_100%)] px-3 py-4 sm:px-5">
        <div className="story-frame relative flex min-h-[calc(100svh-2rem)] w-full overflow-hidden rounded-[28px] border border-parchment-100/25 bg-parchment-50 shadow-story">
          <div className="paper-grain" />
          {phase === 'start' && (
            <StartScreen config={gameConfig} onStart={startGame} />
          )}
          {phase === 'playing' && (
            <GameScreen
              config={gameConfig}
              scene={currentScene}
              roundIndex={currentSceneIndex}
              totalRounds={gameConfig.scenes.length}
              state={state}
              feedback={feedback}
              onChoose={handleChoose}
              onContinue={handleContinue}
            />
          )}
          {phase === 'ending' && ending && (
            <EndingScreen
              config={gameConfig}
              ending={ending}
              finalState={state}
              onRestart={resetGame}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
