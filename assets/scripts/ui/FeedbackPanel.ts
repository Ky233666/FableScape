import { Button, Color, Component, Label, Node, _decorator } from 'cc';
import type { AppliedEffect, ChoiceConfig, GameConfig, StateLabels } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import { ChoiceMechanismNarrator } from '../core/ChoiceMechanismNarrator';
import { Motion } from '../core/Motion';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('FeedbackPanel')
export class FeedbackPanel extends Component {
  private panelRoot!: Node;
  private feedbackLabel!: Label;
  private mechanismLabel!: Label;
  private effectChipsRoot!: Node;
  private continueHandler: (() => void) | null = null;

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(0, -455, 0);
    const shadow = createNode('FeedbackShadow', this.node, 618, 404, 4, -4);
    drawRect(shadow, 618, 404, hexToColor('#17231b', 85));

    this.panelRoot = createNode('FeedbackPaper', this.node, 610, 396, 0, 0);
    drawRect(this.panelRoot, 610, 396, hexToColor('#f4e7c4', 252));
    applySlicedSprite(this.panelRoot, spritePaths.panelLight);
    createLabel('FeedbackTitle', this.panelRoot, '行动反馈', 180, 34, 20, hexToColor('#9b6c31'), -205, 162);
    this.feedbackLabel = createLabel('FeedbackText', this.panelRoot, '', 540, 88, 19, hexToColor('#2d2119'), 0, 94);
    createLabel('MechanismTitle', this.panelRoot, '机制说明', 180, 30, 18, hexToColor('#9b6c31'), -205, 28);
    this.mechanismLabel = createLabel('MechanismText', this.panelRoot, '', 540, 44, 17, hexToColor('#5a3a25'), 0, -8);
    createLabel('EffectTitle', this.panelRoot, '影响结算', 180, 30, 18, hexToColor('#9b6c31'), -205, -62);
    this.effectChipsRoot = createNode('EffectChips', this.panelRoot, 560, 76, 0, -114);

    const continueButton = createNode('ContinueButton', this.panelRoot, 300, 58, 0, -172);
    drawRect(continueButton, 300, 58, hexToColor('#203b2a'));
    applySlicedSprite(continueButton, spritePaths.buttonBrown);
    continueButton.addComponent(Button).node.on(Button.EventType.CLICK, () => this.continueHandler?.());
    createLabel('ContinueLabel', continueButton, '继续', 240, 46, 22, Color.WHITE);
    this.hide();
  }

  setContinueHandler(handler: () => void) {
    this.continueHandler = handler;
  }

  show(choice: ChoiceConfig, changes: AppliedEffect[], config: GameConfig) {
    this.node.active = true;
    this.feedbackLabel.string = choice.feedback;
    this.mechanismLabel.string = ChoiceMechanismNarrator.narrate(config, changes);
    this.renderEffectChips(changes, config.stateLabels);
    Motion.popIn(this.panelRoot, 0.18);
  }

  hide() {
    this.node.active = false;
  }

  private renderEffectChips(changes: AppliedEffect[], labels: StateLabels) {
    [...this.effectChipsRoot.children].forEach((child) => child.destroy());
    const visibleChanges = changes.filter((item) => item.delta !== 0);
    if (visibleChanges.length === 0) {
      createLabel('NoEffectChip', this.effectChipsRoot, '状态没有明显变化', 520, 34, 16, hexToColor('#5a3a25'), 0, 0);
      return;
    }

    visibleChanges.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const x = col === 0 ? -138 : 138;
      const y = 18 - row * 38;
      const positive = item.delta > 0;
      const chip = createNode(`EffectChip_${item.key}`, this.effectChipsRoot, 260, 32, x, y);
      drawRect(chip, 260, 32, hexToColor(positive ? '#2f5237' : '#a85f3c', 218));
      createLabel(
        'EffectChipLabel',
        chip,
        `${labels[item.key]?.label ?? item.key} ${positive ? '+' : ''}${item.delta}`,
        238,
        24,
        15,
        hexToColor('#fff3d2'),
      );
    });
  }
}
