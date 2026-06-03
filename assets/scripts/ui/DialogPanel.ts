import { Component, Label, Node, _decorator } from 'cc';
import type { RoundConfig } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('DialogPanel')
export class DialogPanel extends Component {
  private titleLabel!: Label;
  private narrativeLabel!: Label;

  build(parent: Node) {
    this.node.parent = parent;
    const shadow = createNode('DialogShadow', this.node, 618, 188, 4, 316);
    drawRect(shadow, 618, 188, hexToColor('#17231b', 80));

    const panel = createNode('DialogPaper', this.node, 610, 184, 0, 324);
    drawRect(panel, 610, 184, hexToColor('#fff3d2', 248));
    applySlicedSprite(panel, spritePaths.panelLight);
    const topRule = createNode('DialogTopRule', panel, 520, 4, 0, 52);
    drawRect(topRule, 520, 4, hexToColor('#cda45a', 160));
    this.titleLabel = createLabel('RoundTitle', panel, '', 540, 34, 20, hexToColor('#9b6c31'), 0, 66);
    this.narrativeLabel = createLabel('Narrative', panel, '', 542, 104, 22, hexToColor('#2d2119'), 0, -20);
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
