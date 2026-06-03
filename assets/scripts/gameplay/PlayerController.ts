import { Component, Label, Node, Vec3, _decorator, tween } from 'cc';
import type { GameValues, PlayerMood } from '../data/types';
import { createLabel, createNode, drawCircle, drawEllipse, drawPolygon, drawRect, drawStroke, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
  private moodLabel!: Label;
  private bag!: Node;

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(-230, 30, 0);
    const shadow = createNode('PlayerShadow', this.node, 110, 34, 0, -82);
    drawEllipse(shadow, 110, 34, hexToColor('#17231b', 80));

    const body = createNode('PlayerBody', this.node, 86, 136, 0, -12);
    drawPolygon(
      body,
      [
        [-36, 60],
        [28, 60],
        [48, -68],
        [-48, -68],
      ],
      hexToColor('#5a3a25'),
    );

    const scarf = createNode('PlayerScarf', this.node, 72, 16, -2, 40);
    drawRect(scarf, 72, 16, hexToColor('#cda45a'));

    const head = createNode('PlayerHead', this.node, 56, 56, 0, 82);
    drawCircle(head, 28, hexToColor('#cda45a'));
    const hat = createNode('PlayerHat', this.node, 86, 30, 0, 114);
    drawEllipse(hat, 86, 30, hexToColor('#2d2119'));
    const staff = createNode('Staff', this.node, 18, 164, -52, -4);
    drawStroke(staff, [[0, 76], [0, -76]], hexToColor('#2d2119'), 7);

    this.bag = createNode('MoneyBag', this.node, 42, 46, 66, -28);
    drawCircle(this.bag, 22, hexToColor('#9b6c31'));
    this.moodLabel = createLabel('PlayerMood', this.node, '平静', 120, 34, 17, hexToColor('#f4e7c4'), 0, 146);
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
