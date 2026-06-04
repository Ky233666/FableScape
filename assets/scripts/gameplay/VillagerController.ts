import { Component, Label, Node, Vec3, _decorator, tween } from 'cc';
import type { GameValues, VillagerMood, VisualTheme } from '../data/types';
import { createLabel, createNode, drawCircle, drawEllipse, drawPolygon, hexToColor } from '../core/NodeFactory';

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
      const shadow = createNode('Shadow', villager, 74, 24, 0, -66);
      drawEllipse(shadow, 74, 24, hexToColor('#17231b', 70));
      const body = createNode('Body', villager, 62, 86, 0, -18);
      drawPolygon(
        body,
        [
          [-26, 42],
          [24, 42],
          [36, -44],
          [-36, -44],
        ],
        hexToColor(index === 1 ? '#805739' : '#7b4a2c'),
      );
      const head = createNode('Head', villager, 44, 44, 0, 38);
      drawCircle(head, 21, hexToColor('#cda45a'));
      const hat = createNode('Hat', villager, 58, 18, 0, 62);
      drawEllipse(hat, 58, 18, hexToColor('#2d2119'));
      const label = createLabel('Mood', villager, '', 96, 30, 17, hexToColor('#2d2119'), 0, 86);
      this.villagers.push(villager);
      this.moodLabels.push(label);
      this.basePositions.push(villager.position.clone());
    });
  }

  applyState(values: GameValues, theme?: VisualTheme) {
    const trustKey = theme?.stateBindings?.trustKey ?? 'villageTrust';
    const trust = values[trustKey] ?? 60;
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
