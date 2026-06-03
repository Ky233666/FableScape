import { Button, Color, Component, Label, Node, _decorator } from 'cc';
import type { AppliedEffect, ChoiceConfig, StateLabels } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('FeedbackPanel')
export class FeedbackPanel extends Component {
  private feedbackLabel!: Label;
  private effectLabel!: Label;
  private continueHandler: (() => void) | null = null;

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(0, -455, 0);
    const shadow = createNode('FeedbackShadow', this.node, 618, 294, 4, -4);
    drawRect(shadow, 618, 294, hexToColor('#17231b', 85));

    const panel = createNode('FeedbackPaper', this.node, 610, 286, 0, 0);
    drawRect(panel, 610, 286, hexToColor('#f4e7c4', 252));
    applySlicedSprite(panel, spritePaths.panelLight);
    createLabel('FeedbackTitle', panel, '行动反馈', 180, 34, 20, hexToColor('#9b6c31'), -205, 104);
    this.feedbackLabel = createLabel('FeedbackText', panel, '', 540, 116, 20, hexToColor('#2d2119'), 0, 34);
    this.effectLabel = createLabel('EffectText', panel, '', 540, 34, 16, hexToColor('#5a3a25'), 0, -56);

    const continueButton = createNode('ContinueButton', panel, 300, 58, 0, -104);
    drawRect(continueButton, 300, 58, hexToColor('#203b2a'));
    applySlicedSprite(continueButton, spritePaths.buttonBrown);
    continueButton.addComponent(Button).node.on(Button.EventType.CLICK, () => this.continueHandler?.());
    createLabel('ContinueLabel', continueButton, '继续', 240, 46, 22, Color.WHITE);
    this.hide();
  }

  setContinueHandler(handler: () => void) {
    this.continueHandler = handler;
  }

  show(choice: ChoiceConfig, changes: AppliedEffect[], labels: StateLabels) {
    this.node.active = true;
    this.feedbackLabel.string = choice.feedback;
    this.effectLabel.string = changes
      .filter((item) => item.delta !== 0)
      .map((item) => `${labels[item.key]?.label ?? item.key} ${item.delta > 0 ? '+' : ''}${item.delta}`)
      .join('  ·  ');
  }

  hide() {
    this.node.active = false;
  }
}
