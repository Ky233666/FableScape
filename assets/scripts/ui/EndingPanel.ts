import { Button, Color, Component, Label, Node, _decorator } from 'cc';
import type { ChoiceHistoryItem, EndingConfig, GameConfig, GameValues } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import { DESIGN_HEIGHT, DESIGN_WIDTH, createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';
import type { EndingProgressUpdate } from '../core/ProgressStore';
import { StrategyProfileEvaluator } from '../core/StrategyProfileEvaluator';

const { ccclass } = _decorator;

type EndingPage = 'summary' | 'analysis';

@ccclass('EndingPanel')
export class EndingPanel extends Component {
  private titleLabel!: Label;
  private narrativeLabel!: Label;
  private collectionLabel!: Label;
  private summaryPage!: Node;
  private analysisPage!: Node;
  private summaryTabButton!: Button;
  private analysisTabButton!: Button;
  private summaryTabLabel!: Label;
  private analysisTabLabel!: Label;
  private stateLabel!: Label;
  private revealLabel!: Label;
  private explanationLabel!: Label;
  private profileTitleLabel!: Label;
  private profileSummaryLabel!: Label;
  private profileStatsLabel!: Label;
  private metaphorLabel!: Label;
  private journeyLabel!: Label;
  private activePage: EndingPage = 'summary';
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

    const collectionBadge = createNode('CollectionBadge', this.node, 520, 44, 0, 472);
    drawRect(collectionBadge, 520, 44, hexToColor('#cda45a', 230));
    applySlicedSprite(collectionBadge, spritePaths.panelBeige);
    this.collectionLabel = createLabel('CollectionLabel', collectionBadge, '', 480, 30, 18, hexToColor('#17231b'));

    const summaryTab = createNode('SummaryTab', this.node, 280, 56, -150, 404);
    drawRect(summaryTab, 280, 56, hexToColor('#203b2a'));
    applySlicedSprite(summaryTab, spritePaths.buttonBrown);
    this.summaryTabButton = summaryTab.addComponent(Button);
    this.summaryTabButton.node.on(Button.EventType.CLICK, () => this.setActivePage('summary'));
    this.summaryTabLabel = createLabel('SummaryTabLabel', summaryTab, '概念结果', 230, 40, 20, Color.WHITE);

    const analysisTab = createNode('AnalysisTab', this.node, 280, 56, 150, 404);
    drawRect(analysisTab, 280, 56, hexToColor('#5a3a25'));
    applySlicedSprite(analysisTab, spritePaths.buttonBrown);
    this.analysisTabButton = analysisTab.addComponent(Button);
    this.analysisTabButton.node.on(Button.EventType.CLICK, () => this.setActivePage('analysis'));
    this.analysisTabLabel = createLabel('AnalysisTabLabel', analysisTab, '隐喻轨迹', 230, 40, 20, Color.WHITE);

    this.summaryPage = createNode('SummaryPage', this.node, DESIGN_WIDTH, 900, 0, 0);
    this.analysisPage = createNode('AnalysisPage', this.node, DESIGN_WIDTH, 900, 0, 0);

    const statePanel = createNode('FinalStatePanel', this.summaryPage, 610, 104, 0, 292);
    drawRect(statePanel, 610, 104, hexToColor('#fff3d2', 238));
    applySlicedSprite(statePanel, spritePaths.panelLight);
    createLabel('FinalStateTitle', statePanel, '最终状态', 160, 30, 20, hexToColor('#9b6c31'), -200, 30);
    this.stateLabel = createLabel('FinalState', statePanel, '', 560, 54, 16, hexToColor('#5a3a25'), 0, -14);

    const conceptPanel = createNode('ConceptPanel', this.summaryPage, 610, 392, 0, 16);
    drawRect(conceptPanel, 610, 392, hexToColor('#203b2a'));
    applySlicedSprite(conceptPanel, spritePaths.panelBrown);
    this.revealLabel = createLabel('ConceptReveal', conceptPanel, '', 560, 76, 24, Color.WHITE, 0, 132);
    this.explanationLabel = createLabel('Explanation', conceptPanel, '', 548, 220, 19, hexToColor('#f4e7c4'), 0, -42);

    const profilePanel = createNode('ProfilePanel', this.summaryPage, 610, 204, 0, -286);
    drawRect(profilePanel, 610, 204, hexToColor('#fff3d2', 236));
    applySlicedSprite(profilePanel, spritePaths.panelBeige);
    createLabel('ProfileMark', profilePanel, '策略画像', 150, 30, 20, hexToColor('#9b6c31'), -205, 72);
    this.profileTitleLabel = createLabel('ProfileTitle', profilePanel, '', 240, 32, 24, hexToColor('#17231b'), 146, 72);
    this.profileSummaryLabel = createLabel('ProfileSummary', profilePanel, '', 540, 76, 17, hexToColor('#2d2119'), 0, 18);
    this.profileStatsLabel = createLabel('ProfileStats', profilePanel, '', 540, 48, 15, hexToColor('#5a3a25'), 0, -62);

    const metaphorPanel = createNode('MetaphorPanel', this.analysisPage, 610, 332, 0, 170);
    drawRect(metaphorPanel, 610, 332, hexToColor('#fff3d2', 236));
    applySlicedSprite(metaphorPanel, spritePaths.panelBeige);
    createLabel('MetaphorTitle', metaphorPanel, '故事隐喻', 160, 32, 20, hexToColor('#9b6c31'), -200, 126);
    this.metaphorLabel = createLabel('Metaphor', metaphorPanel, '', 540, 238, 17, hexToColor('#2d2119'), 0, -24);

    const journeyPanel = createNode('JourneyPanel', this.analysisPage, 610, 258, 0, -198);
    drawRect(journeyPanel, 610, 258, hexToColor('#fff3d2', 228));
    applySlicedSprite(journeyPanel, spritePaths.panelLight);
    createLabel('JourneyTitle', journeyPanel, '你的行动轨迹', 180, 32, 20, hexToColor('#9b6c31'), -190, 96);
    this.journeyLabel = createLabel('JourneyList', journeyPanel, '', 540, 174, 17, hexToColor('#2d2119'), 0, -24);

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

  show(
    config: GameConfig,
    ending: EndingConfig,
    values: GameValues,
    history: ChoiceHistoryItem[],
    progress?: EndingProgressUpdate,
  ) {
    this.node.active = true;
    this.titleLabel.string = ending.title;
    this.narrativeLabel.string = ending.narrative;
    this.collectionLabel.string = this.formatCollectionProgress(progress);
    this.stateLabel.string = Object.entries(config.stateLabels)
      .map(([key, label]) => `${label.label}: ${values[key] ?? 0}`)
      .join('   ');
    this.revealLabel.string = `${config.conceptName}\n${ending.conceptReveal}`;
    this.explanationLabel.string = ending.explanation.join('\n');
    const profile = StrategyProfileEvaluator.evaluate(config, history);
    this.profileTitleLabel.string = profile.title;
    this.profileSummaryLabel.string = profile.summary;
    this.profileStatsLabel.string = profile.stats.join('   ');
    this.metaphorLabel.string = ending.metaphorMapping
      .map((item) => `${item.storyElement}：${item.realWorldMeaning}`)
      .join('\n');
    this.journeyLabel.string = this.formatJourney(config, history);
    this.setActivePage('summary');
  }

  hide() {
    this.node.active = false;
  }

  private formatJourney(config: GameConfig, history: ChoiceHistoryItem[]) {
    if (history.length === 0) {
      return '还没有记录到行动。';
    }

    return history
      .map((item, index) => {
        const round = config.rounds.find((candidate) => candidate.id === item.roundId);
        const choice = round?.choices.find((candidate) => candidate.id === item.choiceId);
        const label = choice?.text ?? item.choiceId;
        return `${index + 1}. ${label}`;
      })
      .join('\n');
  }

  private formatCollectionProgress(progress?: EndingProgressUpdate) {
    if (!progress) {
      return '结局收集：本次未记录';
    }

    const base = `${progress.seenEndings}/${progress.totalEndings} 已收集 · 第 ${progress.plays} 次体验`;
    if (progress.isCollectionComplete) {
      return `全结局达成 · ${base}`;
    }

    return progress.isNewEnding ? `新结局发现 · ${base}` : `已见过该结局 · ${base}`;
  }

  private setActivePage(page: EndingPage) {
    this.activePage = page;
    const summaryActive = this.activePage === 'summary';
    this.summaryPage.active = summaryActive;
    this.analysisPage.active = !summaryActive;
    this.summaryTabButton.interactable = !summaryActive;
    this.analysisTabButton.interactable = summaryActive;
    this.summaryTabLabel.color = summaryActive ? Color.WHITE : hexToColor('#d8c08a');
    this.analysisTabLabel.color = summaryActive ? hexToColor('#d8c08a') : Color.WHITE;
  }
}
