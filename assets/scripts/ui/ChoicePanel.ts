import { Button, Component, Label, Node, _decorator } from 'cc';
import type { ChoiceConfig, StateLabels } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

interface ChoiceButtonView {
  root: Node;
  title: Label;
  description: Label;
  badge: Label;
  impact: Label;
  button: Button;
}

interface ChoiceBadge {
  label: string;
  color: string;
}

const tagIncludes = (choice: ChoiceConfig, tags: string[]) => {
  return (choice.tags ?? []).some((tag) => tags.includes(tag));
};

const getChoiceBadge = (choice: ChoiceConfig): ChoiceBadge => {
  if (tagIncludes(choice, ['institution', 'rule', 'aligned', 'mechanism', 'quorum', 'screen', 'verify', 'switch'])) {
    return { label: '规则', color: '#203b2a' };
  }
  if (tagIncludes(choice, ['short_gain', 'easy', 'cheap', 'fast', 'slack', 'overuse', 'comfort'])) {
    return { label: '短利', color: '#a85f3c' };
  }
  if (tagIncludes(choice, ['careful', 'restraint', 'explore', 'confirm', 'negotiate', 'communicate', 'balance'])) {
    return { label: '稳健', color: '#4f7a3d' };
  }
  if (tagIncludes(choice, ['misaligned', 'gaming', 'single_point', 'anti_rule', 'defect', 'conflict', 'opaque'])) {
    return { label: '冒险', color: '#8b6a3d' };
  }
  return { label: '行动', color: '#5a3a25' };
};

const compactLabel = (label: string) => (label.length > 4 ? label.slice(0, 4) : label);

const formatImpactPreview = (choice: ChoiceConfig, labels: StateLabels) => {
  const impacts = Object.entries(choice.effects)
    .filter(([, delta]) => delta !== 0)
    .sort(([, left], [, right]) => Math.abs(right) - Math.abs(left))
    .slice(0, 2)
    .map(([key, delta]) => {
      const label = compactLabel(labels[key]?.label ?? key);
      return `${label}${delta > 0 ? '+' : ''}${delta}`;
    });

  return impacts.length > 0 ? impacts.join(' · ') : '无明显变化';
};

@ccclass('ChoicePanel')
export class ChoicePanel extends Component {
  private choiceHandler: ((choice: ChoiceConfig) => void) | null = null;
  private buttons: ChoiceButtonView[] = [];

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(0, -455, 0);
    this.hide();
  }

  setChoiceHandler(handler: (choice: ChoiceConfig) => void) {
    this.choiceHandler = handler;
  }

  show(choices: ChoiceConfig[], labels: StateLabels) {
    this.node.active = true;
    this.clearButtons();

    const deck = createNode('ChoiceDeck', this.node, 650, 440, 0, 0);
    drawRect(deck, 650, 440, hexToColor('#17231b', 118));
    createLabel('ChoicePanelTitle', this.node, '选择行动', 220, 34, 20, hexToColor('#fff3d2'), -190, 180);

    const spacing = 124;
    const startY = ((choices.length - 1) * spacing) / 2 - 8;
    choices.forEach((choice, index) => {
      const y = startY - index * spacing;
      const shadow = createNode(`ChoiceShadow_${choice.id}`, this.node, 604, 108, 4, y - 4);
      drawRect(shadow, 604, 108, hexToColor('#17231b', 75));

      const root = createNode(`Choice_${choice.id}`, this.node, 600, 104, 0, y);
      drawRect(root, 600, 104, hexToColor('#f4e7c4', 248));
      applySlicedSprite(root, spritePaths.buttonBeige);
      const stripe = createNode('ChoiceStripe', root, 8, 78, -276, 0);
      drawRect(stripe, 8, 78, hexToColor('#cda45a'));
      const button = root.addComponent(Button);
      const badgeInfo = getChoiceBadge(choice);
      const badgeNode = createNode('ChoiceBadge', root, 78, 30, -224, 26);
      drawRect(badgeNode, 78, 30, hexToColor(badgeInfo.color, 230));
      const badge = createLabel('ChoiceBadgeText', badgeNode, badgeInfo.label, 64, 22, 14, hexToColor('#fff3d2'));
      const title = createLabel('ChoiceTitle', root, choice.text, 310, 30, 20, hexToColor('#17231b'), 6, 26);
      const impact = createLabel('ChoiceImpact', root, formatImpactPreview(choice, labels), 156, 28, 14, hexToColor('#a85f3c'), 216, 26);
      const description = createLabel('ChoiceDesc', root, choice.description, 500, 40, 15, hexToColor('#5a3a25'), 30, -22);
      button.node.on(Button.EventType.CLICK, () => this.choiceHandler?.(choice));
      this.buttons.push({ root, title, description, badge, impact, button });
    });

    this.setInteractable(true);
  }

  setInteractable(interactable: boolean) {
    this.buttons.forEach((view) => {
      view.button.interactable = interactable;
      view.root.getComponent(Button)!.interactable = interactable;
      view.title.color = interactable ? hexToColor('#17231b') : hexToColor('#777777');
      view.description.color = interactable ? hexToColor('#5a3a25') : hexToColor('#777777');
      view.badge.color = interactable ? hexToColor('#fff3d2') : hexToColor('#c9c0a2');
      view.impact.color = interactable ? hexToColor('#a85f3c') : hexToColor('#777777');
    });
  }

  hide() {
    this.node.active = false;
  }

  private clearButtons() {
    [...this.node.children].forEach((child) => child.destroy());
    this.buttons = [];
  }
}
