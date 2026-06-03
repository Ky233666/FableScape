import { Button, Component, Label, Node, _decorator } from 'cc';
import type { ChoiceConfig } from '../data/types';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

interface ChoiceButtonView {
  root: Node;
  title: Label;
  description: Label;
  button: Button;
}

@ccclass('ChoicePanel')
export class ChoicePanel extends Component {
  private choiceHandler: ((choice: ChoiceConfig) => void) | null = null;
  private buttons: ChoiceButtonView[] = [];

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(0, -245, 0);
    this.hide();
  }

  setChoiceHandler(handler: (choice: ChoiceConfig) => void) {
    this.choiceHandler = handler;
  }

  show(choices: ChoiceConfig[]) {
    this.node.active = true;
    this.clearButtons();

    createLabel('ChoicePanelTitle', this.node, '选择行动', 220, 28, 18, hexToColor('#fff3d2'), -195, 148);

    const spacing = 82;
    const startY = ((choices.length - 1) * spacing) / 2;
    choices.forEach((choice, index) => {
      const root = createNode(`Choice_${choice.id}`, this.node, 620, 72, 0, startY - index * spacing + 48);
      drawRect(root, 620, 72, hexToColor('#f4e7c4', 248));
      const button = root.addComponent(Button);
      const title = createLabel('ChoiceTitle', root, choice.text, 560, 26, 18, hexToColor('#17231b'), 0, 18);
      const description = createLabel('ChoiceDesc', root, choice.description, 560, 34, 14, hexToColor('#5a3a25'), 0, -14);
      button.node.on(Button.EventType.CLICK, () => this.choiceHandler?.(choice));
      this.buttons.push({ root, title, description, button });
    });

    this.setInteractable(true);
  }

  setInteractable(interactable: boolean) {
    this.buttons.forEach((view) => {
      view.button.interactable = interactable;
      view.root.getComponent(Button)!.interactable = interactable;
      view.title.color = interactable ? hexToColor('#17231b') : hexToColor('#777777');
      view.description.color = interactable ? hexToColor('#5a3a25') : hexToColor('#777777');
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
