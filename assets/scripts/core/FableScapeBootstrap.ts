import { Canvas, Component, Node, ResolutionPolicy, UITransform, _decorator, view } from 'cc';
import { DESIGN_HEIGHT, DESIGN_WIDTH, createNode } from './NodeFactory';
import { GameManager } from './GameManager';
import { StartUI } from '../ui/StartUI';
import { DialogPanel } from '../ui/DialogPanel';
import { ChoicePanel } from '../ui/ChoicePanel';
import { StatusPanel } from '../ui/StatusPanel';
import { FeedbackPanel } from '../ui/FeedbackPanel';
import { EndingPanel } from '../ui/EndingPanel';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { AudioToggle } from '../ui/AudioToggle';
import { VisualStateController } from '../gameplay/VisualStateController';
import { AudioController } from '../gameplay/AudioController';
import { CameraController } from '../gameplay/CameraController';

const { ccclass } = _decorator;

@ccclass('FableScapeBootstrap')
export class FableScapeBootstrap extends Component {
  start() {
    view.setDesignResolutionSize(DESIGN_WIDTH, DESIGN_HEIGHT, ResolutionPolicy.FIXED_WIDTH);

    if (!this.node.getComponent(Canvas)) {
      this.node.addComponent(Canvas);
    }
    const transform = this.node.getComponent(UITransform) ?? this.node.addComponent(UITransform);
    transform.setContentSize(DESIGN_WIDTH, DESIGN_HEIGHT);

    const visualRoot = createNode('VisualRoot', this.node, DESIGN_WIDTH, DESIGN_HEIGHT);
    const uiRoot = createNode('UIRoot', this.node, DESIGN_WIDTH, DESIGN_HEIGHT);

    const visualStateController = createNode('VisualStateController', visualRoot, DESIGN_WIDTH, DESIGN_HEIGHT).addComponent(VisualStateController);
    visualStateController.build(visualRoot);

    const startUI = createNode('StartUI', uiRoot, DESIGN_WIDTH, DESIGN_HEIGHT).addComponent(StartUI);
    startUI.build(uiRoot);

    const dialogPanel = createNode('DialogPanel', uiRoot, DESIGN_WIDTH, DESIGN_HEIGHT).addComponent(DialogPanel);
    dialogPanel.build(uiRoot);

    const statusPanel = createNode('StatusPanel', uiRoot, DESIGN_WIDTH, DESIGN_HEIGHT).addComponent(StatusPanel);
    statusPanel.build(uiRoot);

    const choicePanel = createNode('ChoicePanel', uiRoot, DESIGN_WIDTH, DESIGN_HEIGHT).addComponent(ChoicePanel);
    choicePanel.build(uiRoot);

    const feedbackPanel = createNode('FeedbackPanel', uiRoot, DESIGN_WIDTH, DESIGN_HEIGHT).addComponent(FeedbackPanel);
    feedbackPanel.build(uiRoot);

    const endingPanel = createNode('EndingPanel', uiRoot, DESIGN_WIDTH, DESIGN_HEIGHT).addComponent(EndingPanel);
    endingPanel.build(uiRoot);

    const progressIndicator = createNode('ProgressIndicator', uiRoot, DESIGN_WIDTH, 80).addComponent(ProgressIndicator);
    progressIndicator.build(uiRoot);

    const audioController = createNode('AudioController', this.node, 1, 1).addComponent(AudioController);
    audioController.build();

    const audioToggle = createNode('AudioToggle', uiRoot, 84, 42).addComponent(AudioToggle);
    audioToggle.build(uiRoot);
    audioToggle.setMuted(audioController.isMuted());
    audioToggle.setToggleHandler(() => audioController.toggleMuted());

    const cameraController = createNode('CameraController', this.node, 1, 1).addComponent(CameraController);
    cameraController.build(visualRoot);

    const manager = createNode('GameManager', this.node, 1, 1).addComponent(GameManager);
    manager.bind({
      startUI,
      dialogPanel,
      choicePanel,
      statusPanel,
      feedbackPanel,
      endingPanel,
      progressIndicator,
      visualStateController,
      audioController,
      cameraController,
    });
  }
}
