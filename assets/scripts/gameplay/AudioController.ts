import { AudioClip, AudioSource, Component, _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
  @property(AudioClip)
  choiceSoft: AudioClip | null = null;

  @property(AudioClip)
  choiceGain: AudioClip | null = null;

  @property(AudioClip)
  grassDamage: AudioClip | null = null;

  @property(AudioClip)
  rule: AudioClip | null = null;

  @property(AudioClip)
  conflict: AudioClip | null = null;

  @property(AudioClip)
  endingGood: AudioClip | null = null;

  @property(AudioClip)
  endingBad: AudioClip | null = null;

  private source!: AudioSource;

  build() {
    this.source = this.node.getComponent(AudioSource) ?? this.node.addComponent(AudioSource);
  }

  playCue(cue: string) {
    const clipMap: Record<string, AudioClip | null> = {
      choice_soft: this.choiceSoft,
      choice_gain: this.choiceGain,
      grass_damage: this.grassDamage,
      rule: this.rule,
      conflict: this.conflict,
      ending_good: this.endingGood,
      ending_bad: this.endingBad,
    };
    const clip = clipMap[cue];
    if (clip) {
      this.source.playOneShot(clip, 0.75);
    }
  }
}
