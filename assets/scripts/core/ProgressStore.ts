import { sys } from 'cc';

const STORAGE_KEY = 'fablescape_progress_v1';

interface StoredGameProgress {
  plays: number;
  endingIds: string[];
  conceptCheckAttempts?: number;
  conceptCheckCorrect?: number;
}

type StoredProgress = Record<string, StoredGameProgress>;

export interface GameProgressSummary {
  plays: number;
  seenEndings: number;
  totalEndings: number;
  conceptCheckAttempts: number;
  conceptCheckCorrect: number;
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
      ...current,
      plays: current.plays + 1,
      endingIds,
    };
    writeProgress(progress);
    return {
      plays: progress[gameId].plays,
      seenEndings: endingIds.length,
      totalEndings,
      conceptCheckAttempts: progress[gameId].conceptCheckAttempts ?? 0,
      conceptCheckCorrect: progress[gameId].conceptCheckCorrect ?? 0,
      isNewEnding,
      isCollectionComplete: endingIds.length >= totalEndings,
    };
  }

  static recordConceptCheck(gameId: string, isCorrect: boolean) {
    const progress = readProgress();
    const current = progress[gameId] ?? { plays: 0, endingIds: [] };
    const attempts = (current.conceptCheckAttempts ?? 0) + 1;
    const correct = (current.conceptCheckCorrect ?? 0) + (isCorrect ? 1 : 0);
    progress[gameId] = {
      ...current,
      conceptCheckAttempts: attempts,
      conceptCheckCorrect: correct,
    };
    writeProgress(progress);
    return { attempts, correct };
  }

  static getGameProgress(gameId: string, totalEndings: number): GameProgressSummary {
    const progress = readProgress()[gameId];
    return {
      plays: progress?.plays ?? 0,
      seenEndings: progress?.endingIds.length ?? 0,
      totalEndings,
      conceptCheckAttempts: progress?.conceptCheckAttempts ?? 0,
      conceptCheckCorrect: progress?.conceptCheckCorrect ?? 0,
    };
  }

  static getSeenEndingIds(gameId: string): string[] {
    return [...(readProgress()[gameId]?.endingIds ?? [])];
  }
}
