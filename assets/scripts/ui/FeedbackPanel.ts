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
    this.node.setPosition(0, -235, 0);
    const panel = createNode('FeedbackPaper', this.node, 620, 220, 0, 0);
    drawRect(panel, 620, 220, hexToColor('#f4e7c4', 250));
    createLabel('FeedbackTitle', panel, '行动反馈', 180, 32, 19, hexToColor('#9b6c31'), -210, 78);
    this.feedbackLabel = createLabel('FeedbackText', panel, '', 560, 92, 19, hexToColor('#2d2119'), 0, 25);
    this.effectLabel = createLabel('EffectText', panel, '', 560, 28, 15, hexToColor('#5a3a25'), 0, -50);

    const continueButton = createNode('ContinueButton', panel, 260, 48, 0, -84);
    drawRect(continueButton, 260, 48, hexToColor('#203b2a'));
    continueButton.addComponent(Button).node.on(Button.EventType.CLICK, () => this.continueHandler?.());
    createLabel('ContinueLabel', continueButton, '继续', 220, 42, 20, Color.WHITE);
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
