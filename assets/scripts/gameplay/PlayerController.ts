import { Component, Label, Node, Vec3, _decorator, tween } from 'cc';
import type { GameValues, PlayerMood } from '../data/types';
import { createLabel, createNode, drawCircle, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
  private moodLabel!: Label;
  private bag!: Node;

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(-210, -40, 0);
    const body = createNode('PlayerBody', this.node, 70, 130, 0, 0);
    drawRect(body, 70, 130, hexToColor('#5a3a25'));
    const head = createNode('PlayerHead', this.node, 56, 56, 0, 88);
    drawCircle(head, 28, hexToColor('#cda45a'));
    this.bag = createNode('MoneyBag', this.node, 42, 46, 66, -28);
    drawCircle(this.bag, 22, hexToColor('#9b6c31'));
    this.moodLabel = createLabel('PlayerMood', this.node, '平静', 120, 34, 18, hexToColor('#f4e7c4'), 0, 132);
  }

  applyState(values: GameValues) {
    const wealth = values.personalWealth ?? 40;
    const scale = 0.75 + Math.min(0.45, wealth / 220);
    this.bag.setScale(scale, scale, 1);
  }

  setMood(mood: PlayerMood) {
    const textMap: Record<PlayerMood, string> = {
      calm: '克制',
      tempted: '动心',
      worried: '担忧',
      resolute: '决意',
    };
    this.moodLabel.string = textMap[mood];
    const base = this.node.scale.clone();
    tween(this.node)
      .to(0.18, { scale: new Vec3(base.x * 1.04, base.y * 1.04, base.z) })
      .to(0.18, { scale: base })
      .start();
  }
}
