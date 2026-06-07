# Audio

Place Cocos `AudioClip` assets here.

`AudioController` currently has a procedural Web Audio fallback, so the prototype can make sound even before real audio files are imported. If you add actual clips here and bind them in Cocos Creator, the controller will prefer the real clips.

The procedural BGM is adaptive: `GameManager` sends a tension value derived from each story's configured resource, trust, and governance bindings. As the system becomes unstable, the fallback BGM becomes tighter and more dissonant.

Suggested cues:

- `ambientLoop`
- `choice_soft`
- `choice_gain`
- `grass_damage`
- `rule`
- `conflict`
- `ending_good`
- `ending_bad`
