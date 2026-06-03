# Scenes

Create these scenes in Cocos Creator 3.8.x:

- `Start.scene`
- `Game.scene`
- `Ending.scene`

The first prototype can run with a single scene:

1. Create `Start.scene`.
2. Add a `Canvas` node.
3. Attach `assets/scripts/core/FableScapeBootstrap.ts` to the `Canvas` node.
4. Press Preview.

`FableScapeBootstrap` builds the playable prototype UI and 2D scene at runtime. After the prototype flow is stable, replace the generated placeholder nodes with real Prefabs and art assets.
