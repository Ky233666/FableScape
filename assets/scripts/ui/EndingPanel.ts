import { Button, Color, Component, Label, Node, _decorator } from 'cc';
import type { EndingConfig, GameConfig, GameValues } from '../data/types';
import { DESIGN_HEIGHT, DESIGN_WIDTH, createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('EndingPanel')
export class EndingPanel extends Component {
  private titleLabel!: Label;
  private narrativeLabel!: Label;
  private stateLabel!: Label;
  private revealLabel!: Label;
  private explanationLabel!: Label;
  private metaphorLabel!: Label;
  private restartHandler: (() => void) | null = null;

  build(parent: Node) {
    this.node.parent = parent;
    drawRect(this.node, DESIGN_WIDTH, DESIGN_HEIGHT, hexToColor('#f4e7c4', 245));
    this.titleLabel = createLabel('EndingTitle', this.node, '', 640, 78, 40, hexToColor('#17231b'), 0, 430);
    this.narrativeLabel = createLabel('EndingNarrative', this.node, '', 620, 110, 22, hexToColor('#2d2119'), 0, 335);
    this.stateLabel = createLabel('FinalState', this.node, '', 620, 90, 20, hexToColor('#5a3a25'), 0, 240);

    const conceptPanel = createNode('ConceptPanel', this.node, 640, 330, 0, 35);
    drawRect(conceptPanel, 640, 330, hexToColor('#203b2a'));
    this.revealLabel = createLabel('ConceptReveal', conceptPanel, '', 580, 52, 30, Color.WHITE, 0, 115);
    this.explanationLabel = createLabel('Explanation', conceptPanel, '', 580, 190, 21, hexToColor('#f4e7c4'), 0, -20);

    this.metaphorLabel = createLabel('Metaphor', this.node, '', 620, 220, 19, hexToColor('#2d2119'), 0, -250);

    const button = createNode('RestartButton', this.node, 360, 64, 0, -535);
    drawRect(button, 360, 64, hexToColor('#203b2a'));
    button.addComponent(Button).node.on(Button.EventType.CLICK, () => this.restartHandler?.());
    createLabel('RestartLabel', button, '重新体验', 320, 56, 24, Color.WHITE);
    this.hide();
  }

  setRestartHandler(handler: () => void) {
    this.restartHandler = handler;
  }

  show(config: GameConfig, ending: EndingConfig, values: GameValues) {
    this.node.active = true;
    this.titleLabel.string = ending.title;
    this.narrativeLabel.string = ending.narrative;
    this.stateLabel.string = Object.entries(config.stateLabels)
      .map(([key, label]) => `${label.label}: ${values[key] ?? 0}`)
      .join('   ');
    this.revealLabel.string = `${config.conceptName}\n${ending.conceptReveal}`;
    this.explanationLabel.string = ending.explanation.join('\n');
    this.metaphorLabel.string = ending.metaphorMapping
      .map((item) => `${item.storyElement}：${item.realWorldMeaning}`)
      .join('\n');
  }

  hide() {
    this.node.active = false;
  }
}
