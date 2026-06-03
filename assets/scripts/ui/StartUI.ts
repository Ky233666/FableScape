import { Button, Color, Component, Label, Node, _decorator } from 'cc';
import type { GameConfig } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import {
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  createLabel,
  createNode,
  drawCircle,
  drawEllipse,
  drawPolygon,
  drawRect,
  hexToColor,
} from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('StartUI')
export class StartUI extends Component {
  private titleLabel!: Label;
  private subtitleLabel!: Label;
  private roleLabel!: Label;
  private startHandler: (() => void) | null = null;

  build(parent: Node) {
    this.node.parent = parent;
    drawRect(this.node, DESIGN_WIDTH, DESIGN_HEIGHT, hexToColor('#17231b'));

    const sky = createNode('StartSky', this.node, DESIGN_WIDTH, 980, 0, 290);
    drawRect(sky, DESIGN_WIDTH, 980, hexToColor('#d8c08a'));

    const vignetteTop = createNode('StartVignetteTop', this.node, DESIGN_WIDTH, 260, 0, 650);
    drawRect(vignetteTop, DESIGN_WIDTH, 260, hexToColor('#17231b', 105));

    const sun = createNode('OchreSun', this.node, 150, 150, 220, 500);
    drawCircle(sun, 75, hexToColor('#cda45a', 225));

    const farHill = createNode('StartFarHill', this.node, 900, 300, 20, 190);
    drawEllipse(farHill, 900, 300, hexToColor('#6f7b3d'));
    const nearHill = createNode('StartNearHill', this.node, 980, 370, -120, 90);
    drawEllipse(nearHill, 980, 370, hexToColor('#2f5237'));

    const field = createNode('StartField', this.node, DESIGN_WIDTH, 610, 0, -475);
    drawRect(field, DESIGN_WIDTH, 610, hexToColor('#314d2d'));
    const path = createNode('StartPath', this.node, 290, 620, 80, -500);
    drawPolygon(
      path,
      [
        [-45, 310],
        [65, 310],
        [145, -310],
        [-155, -310],
      ],
      hexToColor('#8b6a3d', 205),
    );

    createLabel('GenreMark', this.node, '互动概念寓言', 260, 42, 20, hexToColor('#f4e7c4'), -160, 530);
    this.titleLabel = createLabel('Title', this.node, '', 620, 170, 58, hexToColor('#17231b'), 0, 330);
    this.subtitleLabel = createLabel('Subtitle', this.node, '', 580, 110, 24, hexToColor('#2d2119'), 0, 165);

    const rolePanel = createNode('RolePanel', this.node, 560, 76, 0, -360);
    drawRect(rolePanel, 560, 76, hexToColor('#f4e7c4', 230));
    applySlicedSprite(rolePanel, spritePaths.panelLight);
    this.roleLabel = createLabel('Role', rolePanel, '', 500, 46, 21, hexToColor('#5a3a25'), 0, 0);

    const startButtonNode = createNode('StartButton', this.node, 520, 86, 0, -510);
    drawRect(startButtonNode, 520, 86, hexToColor('#203b2a'));
    applySlicedSprite(startButtonNode, spritePaths.buttonBrown);
    startButtonNode.addComponent(Button).node.on(Button.EventType.CLICK, () => {
      this.startHandler?.();
    });
    createLabel('StartButtonLabel', startButtonNode, '开始体验', 480, 70, 30, Color.WHITE);

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
