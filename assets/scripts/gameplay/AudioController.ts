import { AudioClip, AudioSource, Component, _decorator } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AudioController')
export class AudioController extends Component {
  @property(AudioClip)
  ambientLoop: AudioClip | null = null;

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
  private synthContext: any = null;
  private masterGain: any = null;
  private bgmGain: any = null;
  private bgmNodes: any[] = [];
  private bgmStarted = false;

  build() {
    this.source = this.node.getComponent(AudioSource) ?? this.node.addComponent(AudioSource);
  }

  startBgm() {
    this.unlock();

    if (this.ambientLoop) {
      this.source.clip = this.ambientLoop;
      this.source.loop = true;
      this.source.volume = 0.28;
      if (!this.source.playing) {
        this.source.play();
      }
      return;
    }

    this.startSyntheticBgm();
  }

  playCue(cue: string) {
    this.unlock();
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
      return;
    }

    this.playSyntheticCue(cue);
  }

  private unlock() {
    const context = this.ensureSynthContext();
    if (context?.state === 'suspended') {
      void context.resume();
    }
  }

  private ensureSynthContext() {
    if (this.synthContext) {
      return this.synthContext;
    }

    const audioGlobal = globalThis as any;
    const AudioContextCtor = audioGlobal.AudioContext ?? audioGlobal.webkitAudioContext;
    if (!AudioContextCtor) {
      return null;
    }

    const context = new AudioContextCtor();
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 12;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.18;
    this.masterGain = context.createGain();
    this.masterGain.gain.value = 0.8;
    this.masterGain.connect(compressor);
    compressor.connect(context.destination);
    this.synthContext = context;
    return this.synthContext;
  }

  private startSyntheticBgm() {
    const context = this.ensureSynthContext();
    if (!context || this.bgmStarted) {
      return;
    }

    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 680;
    filter.Q.value = 0.7;
    this.bgmGain = context.createGain();
    this.bgmGain.gain.setValueAtTime(0.0001, context.currentTime);
    this.bgmGain.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 1.6);
    filter.connect(this.bgmGain);
    this.bgmGain.connect(this.masterGain);

    const root = this.createBgmOscillator(context, 'sine', 110, 0.42, filter);
    const fifth = this.createBgmOscillator(context, 'triangle', 164.81, 0.18, filter);
    const low = this.createBgmOscillator(context, 'sine', 55, 0.26, filter);
    this.bgmNodes = [root, fifth, low, filter, this.bgmGain];
    this.bgmStarted = true;
  }

  private createBgmOscillator(context: any, type: OscillatorType, frequency: number, gainValue: number, output: any) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = gainValue;
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start();
    return oscillator;
  }

  private playSyntheticCue(cue: string) {
    switch (cue) {
      case 'choice_gain':
        this.playTone(392, 0.09, 'triangle', 0.12, 1.18);
        this.playTone(587.33, 0.11, 'sine', 0.08, 1.08, 0.04);
        break;
      case 'grass_damage':
        this.playNoise(0.22, 0.12, 720);
        this.playTone(130.81, 0.18, 'sawtooth', 0.05, 0.7);
        break;
      case 'rule':
        this.playTone(261.63, 0.08, 'square', 0.07, 1);
        this.playTone(523.25, 0.13, 'triangle', 0.1, 1, 0.055);
        break;
      case 'conflict':
        this.playTone(220, 0.11, 'sawtooth', 0.08, 0.85);
        this.playTone(196, 0.14, 'sawtooth', 0.06, 0.82, 0.045);
        break;
      case 'ending_good':
        this.playTone(329.63, 0.14, 'triangle', 0.1, 1.05);
        this.playTone(493.88, 0.18, 'sine', 0.09, 1.02, 0.11);
        this.playTone(659.25, 0.24, 'sine', 0.08, 1, 0.22);
        break;
      case 'ending_bad':
        this.playNoise(0.28, 0.1, 520);
        this.playTone(174.61, 0.34, 'sawtooth', 0.07, 0.62, 0.04);
        break;
      case 'choice_soft':
      default:
        this.playTone(330, 0.08, 'sine', 0.075, 1.08);
        break;
    }
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    slide = 1,
    delay = 0,
  ) {
    const context = this.ensureSynthContext();
    if (!context || !this.masterGain) {
      return;
    }

    const startTime = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, frequency * slide), startTime + duration);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain);
    gain.connect(this.masterGain);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.03);
  }

  private playNoise(duration: number, volume: number, filterFrequency: number) {
    const context = this.ensureSynthContext();
    if (!context || !this.masterGain) {
      return;
    }

    const sampleRate = context.sampleRate;
    const buffer = context.createBuffer(1, Math.max(1, Math.floor(sampleRate * duration)), sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.value = filterFrequency;
    gain.gain.value = volume;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start();
  }
}
