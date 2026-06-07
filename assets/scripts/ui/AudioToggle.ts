import { Button, Color, Component, Label, Node, _decorator } from 'cc';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import { createLabel, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('AudioToggle')
export class AudioToggle extends Component {
  private label!: Label;
  private toggleHandler: (() => boolean) | null = null;
  private muted = false;

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(292, 714, 0);
    drawRect(this.node, 84, 42, hexToColor('#17231b', 185));
    applySlicedSprite(this.node, spritePaths.buttonBrown);
    this.node.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      const nextMuted = this.toggleHandler?.() ?? !this.muted;
      this.setMuted(nextMuted);
    });
    this.label = createLabel('AudioToggleLabel', this.node, '音', 62, 30, 17, Color.WHITE);
  }

  setToggleHandler(handler: () => boolean) {
    this.toggleHandler = handler;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    this.label.string = muted ? '静' : '音';
    this.label.color = muted ? hexToColor('#d8c08a') : Color.WHITE;
  }
}
