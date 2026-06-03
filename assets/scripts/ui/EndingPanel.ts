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
    this.titleLabel = createLabel('EndingTitle', this.node, '', 620, 54, 30, hexToColor('#17231b'), 0, 285);
    this.narrativeLabel = createLabel('EndingNarrative', this.node, '', 620, 74, 18, hexToColor('#2d2119'), 0, 230);
    this.stateLabel = createLabel('FinalState', this.node, '', 620, 44, 16, hexToColor('#5a3a25'), 0, 172);

    const conceptPanel = createNode('ConceptPanel', this.node, 620, 210, 0, 40);
    drawRect(conceptPanel, 620, 210, hexToColor('#203b2a'));
    this.revealLabel = createLabel('ConceptReveal', conceptPanel, '', 560, 48, 22, Color.WHITE, 0, 70);
    this.explanationLabel = createLabel('Explanation', conceptPanel, '', 560, 124, 17, hexToColor('#f4e7c4'), 0, -28);

    this.metaphorLabel = createLabel('Metaphor', this.node, '', 620, 135, 15, hexToColor('#2d2119'), 0, -145);

    const button = createNode('RestartButton', this.node, 320, 52, 0, -310);
    drawRect(button, 320, 52, hexToColor('#203b2a'));
    button.addComponent(Button).node.on(Button.EventType.CLICK, () => this.restartHandler?.());
    createLabel('RestartLabel', button, '重新体验', 280, 44, 20, Color.WHITE);
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
