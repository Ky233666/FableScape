import { Component, Label, Node, _decorator } from 'cc';
import type { RoundConfig } from '../data/types';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('DialogPanel')
export class DialogPanel extends Component {
  private titleLabel!: Label;
  private narrativeLabel!: Label;

  build(parent: Node) {
    this.node.parent = parent;
    const panel = createNode('DialogPaper', this.node, 620, 170, 0, 185);
    drawRect(panel, 620, 170, hexToColor('#fff3d2', 248));
    this.titleLabel = createLabel('RoundTitle', panel, '', 560, 34, 20, hexToColor('#9b6c31'), 0, 56);
    this.narrativeLabel = createLabel('Narrative', panel, '', 560, 108, 22, hexToColor('#2d2119'), 0, -12);
    this.hide();
  }

  show(round: RoundConfig) {
    this.node.active = true;
    this.titleLabel.string = round.title;
    this.narrativeLabel.string = round.narrative;
  }

  hide() {
    this.node.active = false;
  }
}
