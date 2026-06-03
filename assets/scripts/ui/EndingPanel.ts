import { Button, Color, Component, Label, Node, _decorator } from 'cc';
import type { EndingConfig, GameConfig, GameValues } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
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
  private homeHandler: (() => void) | null = null;

  build(parent: Node) {
    this.node.parent = parent;
    drawRect(this.node, DESIGN_WIDTH, DESIGN_HEIGHT, hexToColor('#f4e7c4', 248));
    const topBand = createNode('EndingTopBand', this.node, DESIGN_WIDTH, 360, 0, 600);
    drawRect(topBand, DESIGN_WIDTH, 360, hexToColor('#17231b', 235));

    createLabel('EndingMark', this.node, '结局', 140, 36, 20, hexToColor('#cda45a'), 0, 690);
    this.titleLabel = createLabel('EndingTitle', this.node, '', 620, 72, 34, hexToColor('#f4e7c4'), 0, 626);
    this.narrativeLabel = createLabel('EndingNarrative', this.node, '', 600, 86, 20, hexToColor('#fff3d2'), 0, 548);

    const statePanel = createNode('FinalStatePanel', this.node, 610, 86, 0, 420);
    drawRect(statePanel, 610, 86, hexToColor('#fff3d2', 238));
    applySlicedSprite(statePanel, spritePaths.panelLight);
    this.stateLabel = createLabel('FinalState', statePanel, '', 560, 54, 16, hexToColor('#5a3a25'), 0, 0);

    const conceptPanel = createNode('ConceptPanel', this.node, 610, 292, 0, 214);
    drawRect(conceptPanel, 610, 292, hexToColor('#203b2a'));
    applySlicedSprite(conceptPanel, spritePaths.panelBrown);
    this.revealLabel = createLabel('ConceptReveal', conceptPanel, '', 560, 62, 24, Color.WHITE, 0, 92);
    this.explanationLabel = createLabel('Explanation', conceptPanel, '', 548, 162, 18, hexToColor('#f4e7c4'), 0, -34);

    const metaphorPanel = createNode('MetaphorPanel', this.node, 610, 250, 0, -82);
    drawRect(metaphorPanel, 610, 250, hexToColor('#fff3d2', 236));
    applySlicedSprite(metaphorPanel, spritePaths.panelBeige);
    createLabel('MetaphorTitle', metaphorPanel, '故事隐喻', 160, 32, 20, hexToColor('#9b6c31'), -200, 88);
    this.metaphorLabel = createLabel('Metaphor', metaphorPanel, '', 540, 166, 17, hexToColor('#2d2119'), 0, -18);

    const restartButton = createNode('RestartButton', this.node, 280, 64, -150, -612);
    drawRect(restartButton, 280, 64, hexToColor('#203b2a'));
    applySlicedSprite(restartButton, spritePaths.buttonBrown);
    restartButton.addComponent(Button).node.on(Button.EventType.CLICK, () => this.restartHandler?.());
    createLabel('RestartLabel', restartButton, '重新体验', 230, 50, 22, Color.WHITE);

    const homeButton = createNode('HomeButton', this.node, 280, 64, 150, -612);
    drawRect(homeButton, 280, 64, hexToColor('#5a3a25'));
    applySlicedSprite(homeButton, spritePaths.buttonBrown);
    homeButton.addComponent(Button).node.on(Button.EventType.CLICK, () => this.homeHandler?.());
    createLabel('HomeLabel', homeButton, '返回寓言册', 230, 50, 22, Color.WHITE);
    this.hide();
  }

  setRestartHandler(handler: () => void) {
    this.restartHandler = handler;
  }

  setHomeHandler(handler: () => void) {
    this.homeHandler = handler;
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
