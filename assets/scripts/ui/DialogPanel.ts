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
    const panel = createNode('DialogPaper', this.node, 640, 250, 0, 130);
    drawRect(panel, 640, 250, hexToColor('#fff3d2', 245));
    this.titleLabel = createLabel('RoundTitle', panel, '', 580, 48, 24, hexToColor('#9b6c31'), 0, 82);
    this.narrativeLabel = createLabel('Narrative', panel, '', 580, 150, 26, hexToColor('#2d2119'), 0, -10);
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
