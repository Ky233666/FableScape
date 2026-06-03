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
    this.node.setPosition(0, -450, 0);
    this.hide();
  }

  setChoiceHandler(handler: (choice: ChoiceConfig) => void) {
    this.choiceHandler = handler;
  }

  show(choices: ChoiceConfig[]) {
    this.node.active = true;
    this.clearButtons();

    const spacing = 126;
    const startY = ((choices.length - 1) * spacing) / 2;
    choices.forEach((choice, index) => {
      const root = createNode(`Choice_${choice.id}`, this.node, 620, 104, 0, startY - index * spacing);
      drawRect(root, 620, 104, hexToColor('#f4e7c4', 245));
      const button = root.addComponent(Button);
      const title = createLabel('ChoiceTitle', root, choice.text, 560, 34, 24, hexToColor('#17231b'), 0, 24);
      const description = createLabel('ChoiceDesc', root, choice.description, 560, 46, 18, hexToColor('#5a3a25'), 0, -22);
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
    this.buttons.forEach((view) => view.root.destroy());
    this.buttons = [];
  }
}
