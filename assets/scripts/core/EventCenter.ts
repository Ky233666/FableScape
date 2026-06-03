import { EventTarget } from 'cc';

export const GameEvents = {
  StateChanged: 'state-changed',
  RoundChanged: 'round-changed',
  ChoiceApplied: 'choice-applied',
  FeedbackReady: 'feedback-ready',
  EndingReached: 'ending-reached',
  Restarted: 'restarted',
} as const;

export class EventCenter {
  private static readonly target = new EventTarget();

  static on(eventName: string, callback: (...args: unknown[]) => void, target?: unknown) {
    EventCenter.target.on(eventName, callback, target);
  }

  static off(eventName: string, callback: (...args: unknown[]) => void, target?: unknown) {
    EventCenter.target.off(eventName, callback, target);
  }

  static emit(eventName: string, ...args: unknown[]) {
    EventCenter.target.emit(eventName, ...args);
  }
}
