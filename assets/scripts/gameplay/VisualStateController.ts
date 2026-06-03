import { Component, Node, _decorator } from 'cc';
import type { GameConfig, GameValues, VisualReaction } from '../data/types';
import { DESIGN_HEIGHT, DESIGN_WIDTH, createLabel, createNode, drawRect, drawStroke, hexToColor } from '../core/NodeFactory';
import { GrasslandController } from './GrasslandController';
import { PlayerController } from './PlayerController';
import { SheepController } from './SheepController';
import { VillagerController } from './VillagerController';

const { ccclass } = _decorator;

@ccclass('VisualStateController')
export class VisualStateController extends Component {
  grassland!: GrasslandController;
  sheep!: SheepController;
  villagers!: VillagerController;
  player!: PlayerController;
  private ruleBoard!: Node;
  private fence!: Node;

  build(parent: Node) {
    this.node.parent = parent;
    this.grassland = createNode('Grassland', this.node, DESIGN_WIDTH, DESIGN_HEIGHT).addComponent(GrasslandController);
    this.grassland.build(this.node);
    this.sheep = createNode('SheepLayer', this.node, DESIGN_WIDTH, 500).addComponent(SheepController);
    this.sheep.build(this.node);
    this.player = createNode('PlayerLayer', this.node, 300, 300).addComponent(PlayerController);
    this.player.build(this.node);
    this.villagers = createNode('VillagerLayer', this.node, 360, 280).addComponent(VillagerController);
    this.villagers.build(this.node);

    this.ruleBoard = createNode('RuleBoard', this.node, 190, 108, 18, 92);
    drawRect(this.ruleBoard, 190, 108, hexToColor('#5a3a25'));
    const ruleBoardFace = createNode('RuleBoardFace', this.ruleBoard, 160, 78, 0, 10);
    drawRect(ruleBoardFace, 160, 78, hexToColor('#8b6a3d'));
    const ruleBoardPost = createNode('RuleBoardPost', this.ruleBoard, 22, 76, 0, -74);
    drawRect(ruleBoardPost, 22, 76, hexToColor('#5a3a25'));
    createLabel('RuleBoardText', this.ruleBoard, '村规', 140, 50, 24, hexToColor('#f4e7c4'), 0, 12);
    this.ruleBoard.active = false;

    this.fence = createNode('Fence', this.node, 560, 92, 0, -300);
    drawStroke(this.fence, [[-270, 12], [270, 12]], hexToColor('#5a3a25', 220), 10);
    const lowerRail = createNode('FenceLowerRail', this.fence, 560, 26, 0, -18);
    drawStroke(lowerRail, [[-270, 0], [270, 0]], hexToColor('#5a3a25', 200), 8);
    for (let i = 0; i < 6; i += 1) {
      const post = createNode(`FencePost_${i}`, this.fence, 22, 74, -250 + i * 100, 0);
      drawRect(post, 22, 74, hexToColor('#5a3a25', 220));
    }
    this.fence.active = false;
  }

  applyMood(_sceneMood: string) {
    // Scene mood is intentionally kept as config data for future art direction hooks.
  }

  applyState(config: GameConfig, values: GameValues) {
    this.grassland.applyState(values);
    this.sheep.applyState(values);
    this.villagers.applyState(values);
    this.player.applyState(values);
    this.applyRuleVisibility(values.ruleSupport ?? config.initialState.ruleSupport ?? 0);
  }

  applyReaction(reaction: VisualReaction, values: GameValues) {
    if (reaction.weatherMood) {
      this.grassland.setWeatherMood(reaction.weatherMood);
    }
    if (reaction.sheepDelta) {
      this.sheep.changeCount(reaction.sheepDelta);
    }
    if (reaction.villagerMood) {
      this.villagers.setMood(reaction.villagerMood);
    }
    if (reaction.playerMood) {
      this.player.setMood(reaction.playerMood);
    }
    if (reaction.showRuleBoard) {
      this.ruleBoard.active = true;
    }
    if (reaction.showFence) {
      this.fence.active = true;
    }
    this.grassland.applyState(values);
  }

  private applyRuleVisibility(ruleSupport: number) {
    this.ruleBoard.active = ruleSupport >= 35;
    this.fence.active = ruleSupport >= 70;
  }
}
