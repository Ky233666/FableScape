import { Button, Color, Component, Label, Node, _decorator } from 'cc';
import type { ChoiceHistoryItem, ConceptCheck, EndingConfig, GameConfig, GameValues } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import { ConceptCheckBuilder } from '../core/ConceptCheckBuilder';
import { MechanismTraceEvaluator } from '../core/MechanismTraceEvaluator';
import { DESIGN_HEIGHT, DESIGN_WIDTH, createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';
import { Motion } from '../core/Motion';
import { ProgressStore, type EndingProgressUpdate } from '../core/ProgressStore';
import { ReplayAdvisor } from '../core/ReplayAdvisor';
import { StrategyProfileEvaluator } from '../core/StrategyProfileEvaluator';

const { ccclass } = _decorator;

type EndingPage = 'summary' | 'analysis' | 'check';

interface CheckOptionView {
  root: Node;
  button: Button;
  label: Label;
}

@ccclass('EndingPanel')
export class EndingPanel extends Component {
  private titleLabel!: Label;
  private narrativeLabel!: Label;
  private collectionLabel!: Label;
  private summaryPage!: Node;
  private analysisPage!: Node;
  private checkPage!: Node;
  private summaryTabButton!: Button;
  private analysisTabButton!: Button;
  private checkTabButton!: Button;
  private summaryTabLabel!: Label;
  private analysisTabLabel!: Label;
  private checkTabLabel!: Label;
  private stateLabel!: Label;
  private revealLabel!: Label;
  private explanationLabel!: Label;
  private profileTitleLabel!: Label;
  private profileSummaryLabel!: Label;
  private profileStatsLabel!: Label;
  private replayTitleLabel!: Label;
  private replayDetailLabel!: Label;
  private metaphorLabel!: Label;
  private journeyLabel!: Label;
  private turningPointTitleLabel!: Label;
  private turningPointDetailLabel!: Label;
  private checkQuestionLabel!: Label;
  private checkFeedbackLabel!: Label;
  private checkOptionViews: CheckOptionView[] = [];
  private conceptCheck: ConceptCheck | null = null;
  private currentConfig: GameConfig | null = null;
  private checkRecorded = false;
  private rewindButtonRoot!: Node;
  private activePage: EndingPage = 'summary';
  private restartHandler: (() => void) | null = null;
  private rewindHandler: (() => void) | null = null;
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

    const summaryTab = createNode('SummaryTab', this.node, 196, 56, -206, 404);
    drawRect(summaryTab, 196, 56, hexToColor('#203b2a'));
    applySlicedSprite(summaryTab, spritePaths.buttonBrown);
    this.summaryTabButton = summaryTab.addComponent(Button);
    this.summaryTabButton.node.on(Button.EventType.CLICK, () => this.setActivePage('summary'));
    this.summaryTabLabel = createLabel('SummaryTabLabel', summaryTab, '概念结果', 160, 40, 19, Color.WHITE);

    const analysisTab = createNode('AnalysisTab', this.node, 196, 56, 0, 404);
    drawRect(analysisTab, 196, 56, hexToColor('#5a3a25'));
    applySlicedSprite(analysisTab, spritePaths.buttonBrown);
    this.analysisTabButton = analysisTab.addComponent(Button);
    this.analysisTabButton.node.on(Button.EventType.CLICK, () => this.setActivePage('analysis'));
    this.analysisTabLabel = createLabel('AnalysisTabLabel', analysisTab, '隐喻轨迹', 160, 40, 19, Color.WHITE);

    const checkTab = createNode('CheckTab', this.node, 196, 56, 206, 404);
    drawRect(checkTab, 196, 56, hexToColor('#5a3a25'));
    applySlicedSprite(checkTab, spritePaths.buttonBrown);
    this.checkTabButton = checkTab.addComponent(Button);
    this.checkTabButton.node.on(Button.EventType.CLICK, () => this.setActivePage('check'));
    this.checkTabLabel = createLabel('CheckTabLabel', checkTab, '概念自检', 160, 40, 19, Color.WHITE);

    this.summaryPage = createNode('SummaryPage', this.node, DESIGN_WIDTH, 900, 0, 0);
    this.analysisPage = createNode('AnalysisPage', this.node, DESIGN_WIDTH, 900, 0, 0);
    this.checkPage = createNode('CheckPage', this.node, DESIGN_WIDTH, 900, 0, 0);

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

    const replayPanel = createNode('ReplayHintPanel', this.summaryPage, 610, 92, 0, -492);
    drawRect(replayPanel, 610, 92, hexToColor('#203b2a', 230));
    applySlicedSprite(replayPanel, spritePaths.panelBrown);
    this.replayTitleLabel = createLabel('ReplayHintTitle', replayPanel, '', 540, 28, 18, hexToColor('#cda45a'), 0, 22);
    this.replayDetailLabel = createLabel('ReplayHintDetail', replayPanel, '', 540, 38, 16, hexToColor('#f4e7c4'), 0, -20);

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

    const turningPointPanel = createNode('TurningPointPanel', this.analysisPage, 610, 132, 0, -452);
    drawRect(turningPointPanel, 610, 132, hexToColor('#203b2a', 232));
    applySlicedSprite(turningPointPanel, spritePaths.panelBrown);
    this.turningPointTitleLabel = createLabel(
      'TurningPointTitle',
      turningPointPanel,
      '',
      540,
      30,
      18,
      hexToColor('#cda45a'),
      0,
      42,
    );
    this.turningPointDetailLabel = createLabel(
      'TurningPointDetail',
      turningPointPanel,
      '',
      540,
      66,
      16,
      hexToColor('#f4e7c4'),
      0,
      -18,
    );

    const checkPanel = createNode('ConceptCheckPanel', this.checkPage, 610, 620, 0, -70);
    drawRect(checkPanel, 610, 620, hexToColor('#fff3d2', 242));
    applySlicedSprite(checkPanel, spritePaths.panelLight);
    createLabel('ConceptCheckTitle', checkPanel, '概念自检', 180, 34, 21, hexToColor('#9b6c31'), -196, 248);
    this.checkQuestionLabel = createLabel('ConceptCheckQuestion', checkPanel, '', 540, 92, 23, hexToColor('#17231b'), 0, 174);
    for (let index = 0; index < 3; index += 1) {
      const optionRoot = createNode(`ConceptCheckOption_${index}`, checkPanel, 520, 76, 0, 60 - index * 100);
      drawRect(optionRoot, 520, 76, hexToColor('#f4e7c4', 245));
      applySlicedSprite(optionRoot, spritePaths.buttonBeige);
      const optionButton = optionRoot.addComponent(Button);
      optionButton.node.on(Button.EventType.CLICK, () => this.answerConceptCheck(index));
      const optionLabel = createLabel('ConceptCheckOptionLabel', optionRoot, '', 470, 48, 18, hexToColor('#17231b'));
      this.checkOptionViews.push({ root: optionRoot, button: optionButton, label: optionLabel });
    }
    this.checkFeedbackLabel = createLabel('ConceptCheckFeedback', checkPanel, '', 540, 80, 18, hexToColor('#5a3a25'), 0, -246);

    this.rewindButtonRoot = createNode('RewindButton', this.node, 204, 64, -224, -612);
    drawRect(this.rewindButtonRoot, 204, 64, hexToColor('#8b6a3d'));
    applySlicedSprite(this.rewindButtonRoot, spritePaths.buttonBrown);
    this.rewindButtonRoot.addComponent(Button).node.on(Button.EventType.CLICK, () => this.rewindHandler?.());
    createLabel('RewindLabel', this.rewindButtonRoot, '回到转折点', 178, 50, 20, Color.WHITE);

    const restartButton = createNode('RestartButton', this.node, 204, 64, 0, -612);
    drawRect(restartButton, 204, 64, hexToColor('#203b2a'));
    applySlicedSprite(restartButton, spritePaths.buttonBrown);
    restartButton.addComponent(Button).node.on(Button.EventType.CLICK, () => this.restartHandler?.());
    createLabel('RestartLabel', restartButton, '重新体验', 178, 50, 20, Color.WHITE);

    const homeButton = createNode('HomeButton', this.node, 204, 64, 224, -612);
    drawRect(homeButton, 204, 64, hexToColor('#5a3a25'));
    applySlicedSprite(homeButton, spritePaths.buttonBrown);
    homeButton.addComponent(Button).node.on(Button.EventType.CLICK, () => this.homeHandler?.());
    createLabel('HomeLabel', homeButton, '返回寓言册', 178, 50, 20, Color.WHITE);
    this.hide();
  }

  setRestartHandler(handler: () => void) {
    this.restartHandler = handler;
  }

  setRewindHandler(handler: () => void) {
    this.rewindHandler = handler;
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
    this.currentConfig = config;
    this.titleLabel.string = ending.title;
    this.narrativeLabel.string = ending.narrative;
    this.collectionLabel.string = this.formatCollectionProgress(progress);
    this.rewindButtonRoot.active = history.length > 0;
    this.stateLabel.string = Object.entries(config.stateLabels)
      .map(([key, label]) => `${label.label}: ${values[key] ?? 0}`)
      .join('   ');
    this.revealLabel.string = `${config.conceptName}\n${ending.conceptReveal}`;
    this.explanationLabel.string = ending.explanation.join('\n');
    const profile = StrategyProfileEvaluator.evaluate(config, history);
    this.profileTitleLabel.string = profile.title;
    this.profileSummaryLabel.string = profile.summary;
    this.profileStatsLabel.string = profile.stats.join('   ');
    const replay = ReplayAdvisor.suggest(config, ending, values, history);
    this.replayTitleLabel.string = replay.title;
    this.replayDetailLabel.string = replay.detail;
    this.setupConceptCheck(config);
    this.metaphorLabel.string = ending.metaphorMapping
      .map((item) => `${item.storyElement}：${item.realWorldMeaning}`)
      .join('\n');
    this.journeyLabel.string = this.formatJourney(config, history);
    const trace = MechanismTraceEvaluator.evaluate(config, history);
    this.turningPointTitleLabel.string = trace.title;
    this.turningPointDetailLabel.string = trace.detail;
    this.setActivePage('summary');
  }

  private setupConceptCheck(config: GameConfig) {
    this.conceptCheck = ConceptCheckBuilder.build(config);
    this.checkRecorded = false;
    this.checkQuestionLabel.string = this.conceptCheck.question;
    this.checkFeedbackLabel.string = '选择一个答案，看看你是否抓住了寓言的隐喻。';
    this.checkFeedbackLabel.color = hexToColor('#5a3a25');
    this.checkOptionViews.forEach((view, index) => {
      const option = this.conceptCheck?.options[index];
      view.root.active = Boolean(option);
      view.button.interactable = Boolean(option);
      view.label.string = option?.text ?? '';
      view.label.color = hexToColor('#17231b');
    });
  }

  private answerConceptCheck(index: number) {
    const option = this.conceptCheck?.options[index];
    if (!option) {
      return;
    }

    this.checkFeedbackLabel.string = option.isCorrect
      ? this.conceptCheck!.correctFeedback
      : this.conceptCheck!.wrongFeedback;
    if (!this.checkRecorded && this.currentConfig) {
      const result = ProgressStore.recordConceptCheck(this.currentConfig.id, option.isCorrect);
      this.checkFeedbackLabel.string += `\n自检记录：${result.correct}/${result.attempts}`;
      this.checkRecorded = true;
    }
    this.checkFeedbackLabel.color = option.isCorrect ? hexToColor('#203b2a') : hexToColor('#a85f3c');
    this.checkOptionViews.forEach((view) => {
      view.button.interactable = false;
      view.label.color = hexToColor('#777777');
    });
    this.checkOptionViews[index].label.color = option.isCorrect ? hexToColor('#203b2a') : hexToColor('#a85f3c');
    Motion.pulse(this.checkOptionViews[index].root, 1.04, 0.1);
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
    const analysisActive = this.activePage === 'analysis';
    const checkActive = this.activePage === 'check';
    this.summaryPage.active = summaryActive;
    this.analysisPage.active = analysisActive;
    this.checkPage.active = checkActive;
    this.summaryTabButton.interactable = !summaryActive;
    this.analysisTabButton.interactable = !analysisActive;
    this.checkTabButton.interactable = !checkActive;
    this.summaryTabLabel.color = summaryActive ? Color.WHITE : hexToColor('#d8c08a');
    this.analysisTabLabel.color = analysisActive ? Color.WHITE : hexToColor('#d8c08a');
    this.checkTabLabel.color = checkActive ? Color.WHITE : hexToColor('#d8c08a');
  }
}
