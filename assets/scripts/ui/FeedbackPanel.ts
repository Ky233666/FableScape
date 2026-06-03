import { Button, Color, Component, Label, Node, _decorator } from 'cc';
import type { AppliedEffect, ChoiceConfig } from '../data/types';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('FeedbackPanel')
export class FeedbackPanel extends Component {
  private feedbackLabel!: Label;
  private effectLabel!: Label;
  private continueHandler: (() => void) | null = null;

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(0, -390, 0);
    const panel = createNode('FeedbackPaper', this.node, 640, 260, 0, 0);
    drawRect(panel, 640, 260, hexToColor('#f4e7c4', 250));
    createLabel('FeedbackTitle', panel, '行动反馈', 180, 40, 22, hexToColor('#9b6c31'), -210, 92);
    this.feedbackLabel = createLabel('FeedbackText', panel, '', 560, 110, 22, hexToColor('#2d2119'), 0, 28);
    this.effectLabel = createLabel('EffectText', panel, '', 560, 38, 17, hexToColor('#5a3a25'), 0, -60);

    const continueButton = createNode('ContinueButton', panel, 240, 54, 0, -102);
    drawRect(continueButton, 240, 54, hexToColor('#203b2a'));
    continueButton.addComponent(Button).node.on(Button.EventType.CLICK, () => this.continueHandler?.());
    createLabel('ContinueLabel', continueButton, '继续', 220, 48, 22, Color.WHITE);
    this.hide();
  }

  setContinueHandler(handler: () => void) {
    this.continueHandler = handler;
  }

  show(choice: ChoiceConfig, changes: AppliedEffect[]) {
    this.node.active = true;
    this.feedbackLabel.string = choice.feedback;
    this.effectLabel.string = changes
      .filter((item) => item.delta !== 0)
      .map((item) => `${item.key} ${item.delta > 0 ? '+' : ''}${item.delta}`)
      .join('   ');
  }

  hide() {
    this.node.active = false;
  }
}
