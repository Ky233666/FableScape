import { Component, Node, _decorator } from 'cc';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('ProgressIndicator')
export class ProgressIndicator extends Component {
  private bars: Node[] = [];

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(0, 695, 0);
    this.hide();
  }

  show(current: number, total: number) {
    this.node.active = true;
    [...this.node.children].forEach((child) => child.destroy());
    this.bars = [];
    const plate = createNode('ProgressPlate', this.node, 610, 54, 0, 0);
    drawRect(plate, 610, 54, hexToColor('#17231b', 155));
    createLabel('RoundText', plate, `第 ${current} / ${total} 轮`, 180, 34, 18, hexToColor('#f4e7c4'), -210, 0);

    const width = 300 / total;
    for (let i = 0; i < total; i += 1) {
      const bar = createNode(`Progress_${i}`, plate, width - 8, 8, 140 + i * width - 150, 0);
      drawRect(bar, width - 8, 8, i < current ? hexToColor('#cda45a') : hexToColor('#f4e7c4', 95));
      this.bars.push(bar);
    }
  }

  hide() {
    this.node.active = false;
  }
}
