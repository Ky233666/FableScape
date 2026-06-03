import { Component, Node, Vec3, _decorator } from 'cc';
import type { GameValues, WeatherMood } from '../data/types';
import { DESIGN_HEIGHT, DESIGN_WIDTH, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('GrasslandController')
export class GrasslandController extends Component {
  private sky!: Node;
  private field!: Node;
  private soilPatches: Node[] = [];
  private weatherMood: WeatherMood = 'clear';

  build(parent: Node) {
    this.node.parent = parent;
    this.sky = createNode('SkyMood', this.node, DESIGN_WIDTH, DESIGN_HEIGHT, 0, 0);
    this.field = createNode('GrassField', this.node, DESIGN_WIDTH, 720, 0, -270);

    for (let i = 0; i < 8; i += 1) {
      const patch = createNode(`SoilPatch_${i}`, this.node, 100 + i * 12, 40 + (i % 3) * 16, -280 + i * 82, -310 + (i % 2) * 80);
      this.soilPatches.push(patch);
    }
  }

  setWeatherMood(mood: WeatherMood) {
    this.weatherMood = mood;
  }

  applyState(values: GameValues) {
    const grassHealth = values.grassHealth ?? 100;
    const skyColor = this.getSkyColor();
    drawRect(this.sky, DESIGN_WIDTH, DESIGN_HEIGHT, skyColor);

    const grassColor =
      grassHealth >= 80
        ? '#4f7a3d'
        : grassHealth >= 50
          ? '#879345'
          : grassHealth >= 20
            ? '#b48a43'
            : '#82715a';
    drawRect(this.field, DESIGN_WIDTH, 720, hexToColor(grassColor));

    const visiblePatches = grassHealth >= 80 ? 0 : grassHealth >= 50 ? 2 : grassHealth >= 20 ? 5 : 8;
    this.soilPatches.forEach((patch, index) => {
      patch.active = index < visiblePatches;
      drawRect(patch, 100 + index * 12, 40 + (index % 3) * 16, hexToColor('#7d5a34', grassHealth < 20 ? 230 : 180));
      patch.setRotationFromEuler(0, 0, (index % 2 === 0 ? -1 : 1) * 8);
    });
  }

  private getSkyColor() {
    switch (this.weatherMood) {
      case 'clear':
        return hexToColor('#d8c08a');
      case 'warm':
        return hexToColor('#cda45a');
      case 'dry':
        return hexToColor('#a98452');
      case 'dusty':
        return hexToColor('#7b6f5a');
      default:
        return hexToColor('#d8c08a');
    }
  }
}
