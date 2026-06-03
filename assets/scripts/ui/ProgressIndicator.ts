import { Component, Node, _decorator } from 'cc';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('ProgressIndicator')
export class ProgressIndicator extends Component {
  private bars: Node[] = [];

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(0, 575, 0);
    this.hide();
  }

  show(current: number, total: number) {
    this.node.active = true;
    [...this.node.children].forEach((child) => child.destroy());
    this.bars = [];
    createLabel('RoundText', this.node, `第 ${current} / ${total} 轮`, 220, 40, 22, hexToColor('#f4e7c4'), -230, 0);

    const width = 300 / total;
    for (let i = 0; i < total; i += 1) {
      const bar = createNode(`Progress_${i}`, this.node, width - 8, 10, 110 + i * width - 150, 0);
      drawRect(bar, width - 8, 10, i < current ? hexToColor('#cda45a') : hexToColor('#f4e7c4', 80));
      this.bars.push(bar);
    }
  }

  hide() {
    this.node.active = false;
  }
}
