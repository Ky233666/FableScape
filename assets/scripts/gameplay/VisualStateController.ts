import { Component, Node, _decorator } from 'cc';
import type { GameConfig, GameValues, VisualReaction } from '../data/types';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';
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
    this.grassland = createNode('Grassland', this.node, 720, 1280).addComponent(GrasslandController);
    this.grassland.build(this.node);
    this.sheep = createNode('SheepLayer', this.node, 720, 500).addComponent(SheepController);
    this.sheep.build(this.node);
    this.player = createNode('PlayerLayer', this.node, 300, 300).addComponent(PlayerController);
    this.player.build(this.node);
    this.villagers = createNode('VillagerLayer', this.node, 360, 280).addComponent(VillagerController);
    this.villagers.build(this.node);

    this.ruleBoard = createNode('RuleBoard', this.node, 170, 92, 0, -95);
    drawRect(this.ruleBoard, 170, 92, hexToColor('#5a3a25'));
    createLabel('RuleBoardText', this.ruleBoard, '村规', 140, 54, 22, hexToColor('#f4e7c4'));
    this.ruleBoard.active = false;

    this.fence = createNode('Fence', this.node, 540, 28, 0, -245);
    drawRect(this.fence, 540, 28, hexToColor('#5a3a25', 210));
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
    this.ruleBoard.active = ruleSupport >= 35 || this.ruleBoard.active;
    this.fence.active = ruleSupport >= 70 || this.fence.active;
  }
}
