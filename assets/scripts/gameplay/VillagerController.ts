import { Component, Label, Node, Vec3, _decorator, tween } from 'cc';
import type { GameValues, VillagerMood } from '../data/types';
import { createLabel, createNode, drawCircle, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('VillagerController')
export class VillagerController extends Component {
  private villagers: Node[] = [];
  private moodLabels: Label[] = [];
  private basePositions: Vec3[] = [];

  build(parent: Node) {
    this.node.parent = parent;
    const positions = [
      [150, -10],
      [245, -70],
      [55, -95],
    ];

    positions.forEach(([x, y], index) => {
      const villager = createNode(`Villager_${index}`, this.node, 70, 115, x, y);
      const body = createNode('Body', villager, 52, 82, 0, -18);
      drawRect(body, 52, 82, hexToColor('#7b4a2c'));
      const head = createNode('Head', villager, 42, 42, 0, 36);
      drawCircle(head, 21, hexToColor('#cda45a'));
      const label = createLabel('Mood', villager, '', 96, 30, 17, hexToColor('#2d2119'), 0, 74);
      this.villagers.push(villager);
      this.moodLabels.push(label);
      this.basePositions.push(villager.position.clone());
    });
  }

  applyState(values: GameValues) {
    const trust = values.villageTrust ?? 60;
    const mood: VillagerMood = trust >= 70 ? 'calm' : trust >= 45 ? 'watching' : trust >= 25 ? 'anxious' : 'arguing';
    this.setMood(mood);
  }

  setMood(mood: VillagerMood) {
    const textMap: Record<VillagerMood, string> = {
      calm: '交流',
      watching: '观望',
      anxious: '焦虑',
      arguing: '争执',
    };
    this.moodLabels.forEach((label) => {
      label.string = textMap[mood];
      label.color = mood === 'arguing' ? hexToColor('#a85f3c') : hexToColor('#2d2119');
    });

    this.villagers.forEach((villager, index) => {
      const offset = mood === 'arguing' ? (index % 2 === 0 ? 18 : -18) : 0;
      tween(villager).to(0.25, { position: this.basePositions[index].clone().add3f(offset, 0, 0) }).start();
    });
  }
}
