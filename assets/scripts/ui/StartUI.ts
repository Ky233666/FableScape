import { Button, Color, Component, Label, Node, _decorator } from 'cc';
import type { GameConfig } from '../data/types';
import { DESIGN_HEIGHT, DESIGN_WIDTH, createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('StartUI')
export class StartUI extends Component {
  private titleLabel!: Label;
  private subtitleLabel!: Label;
  private roleLabel!: Label;
  private startHandler: (() => void) | null = null;

  build(parent: Node) {
    this.node.parent = parent;
    createNode('StartBackdrop', this.node, DESIGN_WIDTH, DESIGN_HEIGHT, 0, 0);
    drawRect(this.node, DESIGN_WIDTH, DESIGN_HEIGHT, hexToColor('#f4e7c4'));

    const topBand = createNode('StartTopBand', this.node, DESIGN_WIDTH, 500, 0, 390);
    drawRect(topBand, DESIGN_WIDTH, 500, hexToColor('#203b2a'));

    const sun = createNode('OchreSun', this.node, 120, 120, 210, 520);
    drawRect(sun, 120, 120, hexToColor('#cda45a', 210));

    this.titleLabel = createLabel('Title', this.node, '', 620, 150, 54, hexToColor('#17231b'), 0, 150);
    this.subtitleLabel = createLabel('Subtitle', this.node, '', 590, 130, 24, hexToColor('#5a3a25'), 0, 20);
    this.roleLabel = createLabel('Role', this.node, '', 560, 70, 20, hexToColor('#5a3a25', 210), 0, -318);

    const startButtonNode = createNode('StartButton', this.node, 520, 80, 0, -220);
    drawRect(startButtonNode, 520, 80, hexToColor('#203b2a'));
    startButtonNode.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      this.startHandler?.();
    });
    createLabel('StartButtonLabel', startButtonNode, '开始体验', 480, 68, 28, Color.WHITE);

    this.hide();
  }

  setStartHandler(handler: () => void) {
    this.startHandler = handler;
  }

  show(config: GameConfig) {
    this.node.active = true;
    this.titleLabel.string = `寓境\n${config.title}`;
    this.subtitleLabel.string = config.subtitle;
    this.roleLabel.string = `身份：${config.playerRole}`;
  }

  hide() {
    this.node.active = false;
  }
}
