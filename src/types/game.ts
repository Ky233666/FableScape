export type GameState = Record<string, number>;

export type StateLabels = Record<
  string,
  {
    label: string;
    description?: string;
    min: number;
    max: number;
    lowText?: string;
    highText?: string;
  }
>;

export type ChoiceEffects = Record<string, number>;

export interface Choice {
  id: string;
  text: string;
  description: string;
  effects: ChoiceEffects;
  feedback: string;
  nextSceneId?: string;
  tags?: string[];
}

export interface Scene {
  id: string;
  title: string;
  narrative: string;
  choices: Choice[];
}

export interface ChoiceRecord {
  sceneId: string;
  choiceId: string;
  effects: ChoiceEffects;
  tags: string[];
}

export interface FeedbackState {
  choice: Choice;
  previousState: GameState;
  nextState: GameState;
}

export interface MetaphorItem {
  storyElement: string;
  realWorldMeaning: string;
}

export interface Ending {
  id: string;
  title: string;
  condition: (state: GameState, history: ChoiceRecord[]) => boolean;
  narrative: string;
  conceptReveal: string;
  explanation: string;
  metaphorMapping: MetaphorItem[];
}

export interface GameConfig {
  id: string;
  title: string;
  subtitle: string;
  conceptName: string;
  conceptShortExplanation: string;
  playerRole: string;
  intro: string;
  coverImage?: string;
  initialState: GameState;
  stateLabels: StateLabels;
  scenes: Scene[];
  endings: Ending[];
  metaphorExplanation: MetaphorItem[];
}
