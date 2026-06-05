export type StateKey = string;

export type GameValues = Record<StateKey, number>;

export interface StateLabelConfig {
  label: string;
  min: number;
  max: number;
  lowText?: string;
  highText?: string;
}

export type StateLabels = Record<StateKey, StateLabelConfig>;

export type VisualWorld = 'grassland' | 'bridge' | 'library';
export type VisualTokenSkin = 'sheep' | 'stone' | 'page' | 'boat';

export interface VisualStateBindings {
  resourceKey: StateKey;
  wealthKey: StateKey;
  trustKey: StateKey;
  governanceKey: StateKey;
  tokenLabel: string;
  tokenSkin?: VisualTokenSkin;
  governanceLabel: string;
  fenceLabel: string;
}

export interface VisualTheme {
  palette: {
    forestDark: string;
    forest: string;
    grass: string;
    dryGrass: string;
    parchment: string;
    ochre: string;
    umber: string;
    warning: string;
  };
  world?: VisualWorld;
  stateBindings?: VisualStateBindings;
}

export type VillagerMood = 'calm' | 'watching' | 'anxious' | 'arguing';
export type WeatherMood = 'clear' | 'warm' | 'dry' | 'dusty';
export type PlayerMood = 'calm' | 'tempted' | 'worried' | 'resolute';

export interface VisualReaction {
  tokenDelta?: number;
  sheepDelta?: number;
  grassDamageDelta?: number;
  villagerMood?: VillagerMood;
  showRuleBoard?: boolean;
  showFence?: boolean;
  cameraShake?: boolean;
  cameraZoom?: number;
  weatherMood?: WeatherMood;
  playerMood?: PlayerMood;
}

export interface ChoiceConfig {
  id: string;
  text: string;
  description: string;
  effects: GameValues;
  feedback: string;
  visualReaction: VisualReaction;
  soundCue: string;
  animationCue: string;
  tags?: string[];
}

export interface RoundConfig {
  id: string;
  roundIndex: number;
  title: string;
  narrative: string;
  sceneMood: string;
  choices: ChoiceConfig[];
}

export type CompareOperator = '<' | '<=' | '>' | '>=' | '==' | '!=';

export interface StateCondition {
  key: StateKey;
  op: CompareOperator;
  value: number;
}

export interface TagCondition {
  tag: string;
  minCount: number;
}

export interface EndingCondition {
  state?: StateCondition[];
  tags?: TagCondition[];
}

export interface MetaphorMapping {
  storyElement: string;
  realWorldMeaning: string;
}

export interface EndingConfig {
  id: string;
  title: string;
  priority: number;
  condition: EndingCondition;
  narrative: string;
  conceptReveal: string;
  explanation: string[];
  metaphorMapping: MetaphorMapping[];
  finalVisualState: VisualReaction;
}

export interface GameConfig {
  id: string;
  title: string;
  subtitle: string;
  conceptName: string;
  playerRole: string;
  initialState: GameValues;
  stateLabels: StateLabels;
  rounds: RoundConfig[];
  endings: EndingConfig[];
  metaphorMapping: MetaphorMapping[];
  visualTheme: VisualTheme;
}

export interface GameCatalogItem {
  id: string;
  title: string;
  subtitle: string;
  conceptName: string;
  playerRole: string;
}

export interface ChoiceHistoryItem {
  roundId: string;
  choiceId: string;
  effects: GameValues;
  tags: string[];
}

export interface AppliedEffect {
  key: StateKey;
  before: number;
  after: number;
  delta: number;
}
