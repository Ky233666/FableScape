import { Component, Node, Vec3, _decorator, tween } from 'cc';
import type { GameValues } from '../data/types';
import { createNode, drawCircle, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('SheepController')
export class SheepController extends Component {
  private sheepNodes: Node[] = [];
  private targetCount = 5;

  build(parent: Node) {
    this.node.parent = parent;
    this.setCount(this.targetCount);
  }

  applyState(values: GameValues) {
    const wealth = values.personalWealth ?? 40;
    const grassHealth = values.grassHealth ?? 100;
    const count = Math.max(2, Math.min(13, Math.round(3 + wealth / 12)));
    this.setCount(count);

    this.sheepNodes.forEach((sheep, index) => {
      const thin = grassHealth < 20;
      this.drawSheep(sheep, thin);
      const base = sheep.position.clone();
      tween(sheep)
        .to(0.28 + index * 0.02, { position: base.clone().add(new Vec3((index % 2 ? -1 : 1) * 8, 4, 0)) })
        .to(0.28 + index * 0.02, { position: base })
        .start();
    });
  }

  changeCount(delta: number) {
    this.setCount(Math.max(1, this.targetCount + delta));
  }

  private setCount(count: number) {
    this.targetCount = count;
    while (this.sheepNodes.length < count) {
      const index = this.sheepNodes.length;
      const sheep = createNode(`Sheep_${index}`, this.node, 72, 48, -250 + (index % 6) * 95, -190 - Math.floor(index / 6) * 70);
      this.drawSheep(sheep, false);
      this.sheepNodes.push(sheep);
    }

    this.sheepNodes.forEach((sheep, index) => {
      sheep.active = index < count;
    });
  }

  private drawSheep(sheep: Node, thin: boolean) {
    sheep.removeAllChildren();
    const body = createNode('Body', sheep, thin ? 48 : 64, thin ? 30 : 40, 0, 0);
    drawCircle(body, thin ? 23 : 30, hexToColor(thin ? '#d8cfb6' : '#fff9ea'));
    const head = createNode('Head', sheep, 22, 22, 30, 10);
    drawCircle(head, 12, hexToColor('#5a3a25'));
    const legA = createNode('LegA', sheep, 8, 24, -14, -22);
    const legB = createNode('LegB', sheep, 8, 24, 14, -22);
    drawRect(legA, 8, 24, hexToColor('#5a3a25'));
    drawRect(legB, 8, 24, hexToColor('#5a3a25'));
  }
}
