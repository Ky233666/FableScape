import { Component, Node, Vec3, _decorator, tween } from 'cc';
import type { GameValues } from '../data/types';
import { createNode, drawCircle, drawEllipse, drawRect, hexToColor } from '../core/NodeFactory';

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
    const count = Math.max(2, Math.min(12, Math.round(3 + wealth / 13)));
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
      const sheep = createNode(`Sheep_${index}`, this.node, 88, 66, -276 + (index % 6) * 110, -126 - Math.floor(index / 6) * 88);
      this.drawSheep(sheep, false);
      this.sheepNodes.push(sheep);
    }

    this.sheepNodes.forEach((sheep, index) => {
      sheep.active = index < count;
    });
  }

  private drawSheep(sheep: Node, thin: boolean) {
    sheep.removeAllChildren();
    const wool = thin ? '#d8cfb6' : '#fff9ea';
    const woolAlpha = thin ? 190 : 235;
    const body = createNode('Body', sheep, thin ? 62 : 76, thin ? 38 : 48, -4, 0);
    drawEllipse(body, thin ? 62 : 76, thin ? 38 : 48, hexToColor(wool, woolAlpha));

    const puffs = [
      [-28, 6],
      [-12, 14],
      [6, 14],
      [24, 6],
      [-8, -8],
    ];
    puffs.forEach(([x, y], index) => {
      const puff = createNode(`Wool_${index}`, sheep, 24, 24, x, y);
      drawCircle(puff, thin ? 10 : 13, hexToColor(wool, woolAlpha));
    });

    const head = createNode('Head', sheep, 30, 30, 34, 8);
    drawCircle(head, thin ? 12 : 15, hexToColor('#5a3a25'));
    const ear = createNode('Ear', sheep, 12, 18, 44, 20);
    drawEllipse(ear, 12, 18, hexToColor('#5a3a25'));
    const eye = createNode('Eye', sheep, 5, 5, 39, 12);
    drawCircle(eye, 2.4, hexToColor('#f4e7c4'));

    const legColor = thin ? '#6b4a2e' : '#4a2f1e';
    const legA = createNode('LegA', sheep, 8, 25, -18, -28);
    const legB = createNode('LegB', sheep, 8, 25, 8, -28);
    drawRect(legA, 8, 25, hexToColor(legColor));
    drawRect(legB, 8, 25, hexToColor(legColor));
  }
}
