import type { GameConfig } from '../data/types';
import { commonsTragedyConfig } from '../data/commonsTragedyConfig';

export class ConfigLoader {
  static loadDefaultGame(): GameConfig {
    return commonsTragedyConfig;
  }
}
