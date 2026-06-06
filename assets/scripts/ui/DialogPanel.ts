import { Component, Label, Node, _decorator } from 'cc';
import type { GameConfig, GameValues, RoundConfig } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';
import { SituationAdvisor } from '../core/SituationAdvisor';

const { ccclass } = _decorator;

@ccclass('DialogPanel')
export class DialogPanel extends Component {
  private titleLabel!: Label;
  private narrativeLabel!: Label;
  private hintRoot!: Node;
  private hintTitleLabel!: Label;
  private hintDetailLabel!: Label;

  build(parent: Node) {
    this.node.parent = parent;
    const shadow = createNode('DialogShadow', this.node, 618, 228, 4, 304);
    drawRect(shadow, 618, 228, hexToColor('#17231b', 80));

    const panel = createNode('DialogPaper', this.node, 610, 224, 0, 312);
    drawRect(panel, 610, 224, hexToColor('#fff3d2', 248));
    applySlicedSprite(panel, spritePaths.panelLight);
    const topRule = createNode('DialogTopRule', panel, 520, 4, 0, 76);
    drawRect(topRule, 520, 4, hexToColor('#cda45a', 160));
    this.titleLabel = createLabel('RoundTitle', panel, '', 540, 34, 20, hexToColor('#9b6c31'), 0, 90);
    this.narrativeLabel = createLabel('Narrative', panel, '', 542, 88, 21, hexToColor('#2d2119'), 0, 18);
    this.hintRoot = createNode('SituationHint', panel, 540, 40, 0, -72);
    drawRect(this.hintRoot, 540, 40, hexToColor('#203b2a', 225));
    this.hintTitleLabel = createLabel('SituationHintTitle', this.hintRoot, '', 116, 28, 17, hexToColor('#fff3d2'), -202, 0);
    this.hintDetailLabel = createLabel('SituationHintDetail', this.hintRoot, '', 392, 28, 16, hexToColor('#fff3d2'), 58, 0);
    this.hide();
  }

  show(round: RoundConfig, config: GameConfig, values: GameValues) {
    this.node.active = true;
    this.titleLabel.string = round.title;
    this.narrativeLabel.string = round.narrative;
    const hint = SituationAdvisor.evaluate(config, values);
    drawRect(this.hintRoot, 540, 40, hexToColor(hint.color, 225));
    this.hintTitleLabel.string = hint.title;
    this.hintDetailLabel.string = hint.detail;
  }

  hide() {
    this.node.active = false;
  }
}
