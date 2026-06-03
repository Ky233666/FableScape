import { Component, Node, Vec3, _decorator, tween } from 'cc';
import type { VisualReaction } from '../data/types';

const { ccclass } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {
  private target: Node | null = null;
  private basePosition = new Vec3();

  build(target: Node) {
    this.target = target;
    this.basePosition = target.position.clone();
  }

  playReaction(reaction: VisualReaction) {
    if (!this.target) {
      return;
    }

    const scale = reaction.cameraZoom ?? 1;
    tween(this.target).to(0.22, { scale: new Vec3(scale, scale, 1) }).to(0.35, { scale: new Vec3(1, 1, 1) }).start();

    if (reaction.cameraShake) {
      const left = this.basePosition.clone().add3f(-14, 0, 0);
      const right = this.basePosition.clone().add3f(14, 0, 0);
      tween(this.target)
        .to(0.05, { position: left })
        .to(0.05, { position: right })
        .to(0.05, { position: left })
        .to(0.08, { position: this.basePosition })
        .start();
    }
  }
}
