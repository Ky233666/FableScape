import { sys } from 'cc';

const STORAGE_KEY = 'fablescape_progress_v1';

interface StoredGameProgress {
  plays: number;
  endingIds: string[];
}

type StoredProgress = Record<string, StoredGameProgress>;

export interface GameProgressSummary {
  plays: number;
  seenEndings: number;
  totalEndings: number;
}

export interface EndingProgressUpdate extends GameProgressSummary {
  isNewEnding: boolean;
  isCollectionComplete: boolean;
}

const readProgress = (): StoredProgress => {
  try {
    const raw = sys.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as StoredProgress;
  } catch {
    return {};
  }
};

const writeProgress = (progress: StoredProgress) => {
  try {
    sys.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Local storage can be unavailable in some embedded previews. Progress is optional.
  }
};

export class ProgressStore {
  static recordEnding(gameId: string, endingId: string, totalEndings: number): EndingProgressUpdate {
    const progress = readProgress();
    const current = progress[gameId] ?? { plays: 0, endingIds: [] };
    const endingSet = new Set(current.endingIds);
    const isNewEnding = !endingSet.has(endingId);
    endingSet.add(endingId);
    const endingIds = [...endingSet];
    progress[gameId] = {
      plays: current.plays + 1,
      endingIds,
    };
    writeProgress(progress);
    return {
      plays: progress[gameId].plays,
      seenEndings: endingIds.length,
      totalEndings,
      isNewEnding,
      isCollectionComplete: endingIds.length >= totalEndings,
    };
  }

  static getGameProgress(gameId: string, totalEndings: number): GameProgressSummary {
    const progress = readProgress()[gameId];
    return {
      plays: progress?.plays ?? 0,
      seenEndings: progress?.endingIds.length ?? 0,
      totalEndings,
    };
  }
}
