import type { GameCatalogItem, GameConfig } from '../data/types';
import { commonsTragedyConfig } from '../data/commonsTragedyConfig';
import { prisonersDilemmaConfig } from '../data/prisonersDilemmaConfig';

const gameConfigs: GameConfig[] = [
  commonsTragedyConfig,
  prisonersDilemmaConfig,
];

export class ConfigLoader {
  static listGames(): GameCatalogItem[] {
    return gameConfigs.map((config) => ({
      id: config.id,
      title: config.title,
      subtitle: config.subtitle,
      conceptName: config.conceptName,
      playerRole: config.playerRole,
    }));
  }

  static loadDefaultGame(): GameConfig {
    return gameConfigs[0];
  }

  static loadGame(gameId: string): GameConfig {
    return gameConfigs.find((config) => config.id === gameId) ?? this.loadDefaultGame();
  }
}
