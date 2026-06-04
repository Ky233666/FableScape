import { Component, Node, _decorator } from 'cc';
import type { GameValues, VisualTheme, WeatherMood } from '../data/types';
import {
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  createNode,
  drawCircle,
  drawEllipse,
  drawPolygon,
  drawRect,
  drawStroke,
  hexToColor,
} from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('GrasslandController')
export class GrasslandController extends Component {
  private sky!: Node;
  private sun!: Node;
  private farHill!: Node;
  private nearHill!: Node;
  private field!: Node;
  private path!: Node;
  private weatherOverlay!: Node;
  private bridgeDeck!: Node;
  private bridgeRailTop!: Node;
  private bridgeRailBottom!: Node;
  private bridgeCrack!: Node;
  private soilPatches: Node[] = [];
  private grassTufts: Node[] = [];
  private bridgeStones: Node[] = [];
  private weatherMood: WeatherMood = 'clear';

  build(parent: Node) {
    this.node.parent = parent;
    this.sky = createNode('SkyMood', this.node, DESIGN_WIDTH, DESIGN_HEIGHT, 0, 0);
    this.sun = createNode('Sun', this.node, 160, 160, 240, 520);
    this.farHill = createNode('FarHill', this.node, 920, 280, 60, 210);
    this.nearHill = createNode('NearHill', this.node, 980, 320, -90, 30);
    this.field = createNode('GrassField', this.node, DESIGN_WIDTH, 760, 0, -430);
    this.path = createNode('DirtPath', this.node, 300, 760, 75, -430);
    this.bridgeDeck = createNode('BridgeDeck', this.node, 560, 150, 0, -260);
    this.bridgeRailTop = createNode('BridgeRailTop', this.node, 560, 20, 0, -190);
    this.bridgeRailBottom = createNode('BridgeRailBottom', this.node, 560, 20, 0, -330);
    this.bridgeCrack = createNode('BridgeCrack', this.node, 220, 110, 62, -255);
    this.weatherOverlay = createNode('WeatherOverlay', this.node, DESIGN_WIDTH, DESIGN_HEIGHT, 0, 0);

    for (let i = 0; i < 8; i += 1) {
      const patch = createNode(`SoilPatch_${i}`, this.node, 110 + i * 10, 44 + (i % 3) * 14, -285 + i * 80, -305 + (i % 2) * 90);
      this.soilPatches.push(patch);
    }

    for (let i = 0; i < 18; i += 1) {
      const tuft = createNode(`GrassTuft_${i}`, this.node, 34, 50, -320 + (i % 9) * 78, -126 - Math.floor(i / 9) * 114);
      this.grassTufts.push(tuft);
    }

    for (let i = 0; i < 9; i += 1) {
      const stone = createNode(`BridgeStone_${i}`, this.node, 78, 42, -248 + (i % 5) * 124, -235 - Math.floor(i / 5) * 52);
      this.bridgeStones.push(stone);
    }
  }

  setWeatherMood(mood: WeatherMood) {
    this.weatherMood = mood;
  }

  applyState(values: GameValues, theme?: VisualTheme) {
    const world = theme?.world ?? 'grassland';
    const resourceKey = theme?.stateBindings?.resourceKey ?? 'grassHealth';
    const resourceHealth = values[resourceKey] ?? 100;
    const skyColor = this.getSkyColor();
    drawRect(this.sky, DESIGN_WIDTH, DESIGN_HEIGHT, skyColor);
    drawCircle(this.sun, 76, hexToColor(resourceHealth < 20 ? '#b78d55' : '#cda45a', 230));

    if (world === 'bridge') {
      this.drawBridgeWorld(resourceHealth);
    } else {
      this.drawGrasslandWorld(resourceHealth);
    }

    const overlayAlpha = resourceHealth >= 80 ? 0 : resourceHealth >= 50 ? 18 : resourceHealth >= 20 ? 42 : 86;
    drawRect(this.weatherOverlay, DESIGN_WIDTH, DESIGN_HEIGHT, hexToColor('#4f3f2e', overlayAlpha));
  }

  private drawGrasslandWorld(grassHealth: number) {
    const grassColor =
      grassHealth >= 80
        ? '#4f7a3d'
        : grassHealth >= 50
          ? '#879345'
          : grassHealth >= 20
            ? '#b48a43'
            : '#82715a';
    const farColor = grassHealth >= 50 ? '#6f7b3d' : grassHealth >= 20 ? '#9a8240' : '#756b58';
    const nearColor = grassHealth >= 50 ? '#2f5237' : grassHealth >= 20 ? '#7f7438' : '#625b4f';
    drawEllipse(this.farHill, 920, 280, hexToColor(farColor));
    drawEllipse(this.nearHill, 980, 320, hexToColor(nearColor));
    drawRect(this.field, DESIGN_WIDTH, 760, hexToColor(grassColor));
    drawPolygon(
      this.path,
      [
        [-42, 380],
        [62, 380],
        [148, -380],
        [-160, -380],
      ],
      hexToColor(grassHealth < 35 ? '#8a6d42' : '#9b7b46', 205),
    );

    const visiblePatches = grassHealth >= 80 ? 0 : grassHealth >= 50 ? 2 : grassHealth >= 20 ? 5 : 8;
    this.soilPatches.forEach((patch, index) => {
      patch.active = index < visiblePatches;
      drawEllipse(patch, 110 + index * 10, 44 + (index % 3) * 14, hexToColor('#7d5a34', grassHealth < 20 ? 230 : 180));
      patch.setRotationFromEuler(0, 0, (index % 2 === 0 ? -1 : 1) * 8);
    });

    const tuftColor = grassHealth >= 80 ? '#d1c86a' : grassHealth >= 50 ? '#a9974d' : '#7d6d3d';
    this.grassTufts.forEach((tuft, index) => {
      tuft.active = grassHealth > 18 && index < Math.ceil((grassHealth / 100) * this.grassTufts.length);
      drawPolygon(
        tuft,
        [
          [-12, -22],
          [-4, 20],
          [2, -22],
          [10, 22],
          [16, -22],
        ],
        hexToColor(tuftColor, 190),
      );
    });
    this.setBridgeActive(false);
  }

  private drawBridgeWorld(bridgeSafety: number) {
    drawEllipse(this.farHill, 920, 280, hexToColor(bridgeSafety >= 50 ? '#6f7254' : '#76684f'));
    drawEllipse(this.nearHill, 980, 320, hexToColor(bridgeSafety >= 50 ? '#3b5140' : '#5f594a'));
    drawRect(this.field, DESIGN_WIDTH, 760, hexToColor('#2f5237'));
    drawPolygon(
      this.path,
      [
        [-360, 180],
        [360, 260],
        [360, -380],
        [-360, -380],
      ],
      hexToColor(bridgeSafety < 35 ? '#3c5e5a' : '#4b7468', 220),
    );

    this.soilPatches.forEach((patch, index) => {
      patch.active = bridgeSafety < 72 && index < (bridgeSafety < 25 ? 8 : bridgeSafety < 50 ? 5 : 3);
      drawEllipse(patch, 90 + index * 8, 34 + (index % 3) * 10, hexToColor('#7b6b58', 205));
      patch.setRotationFromEuler(0, 0, (index % 2 === 0 ? -1 : 1) * 6);
    });

    this.grassTufts.forEach((tuft) => {
      tuft.active = false;
    });

    this.setBridgeActive(true);
    drawRect(this.bridgeDeck, 560, 150, hexToColor(bridgeSafety < 35 ? '#7b6b58' : '#9b8766'));
    drawStroke(this.bridgeRailTop, [[-270, 0], [270, 0]], hexToColor('#5a3a25', 225), 9);
    drawStroke(this.bridgeRailBottom, [[-270, 0], [270, 0]], hexToColor('#5a3a25', 210), 8);

    this.bridgeStones.forEach((stone, index) => {
      stone.active = index < Math.ceil((bridgeSafety / 100) * this.bridgeStones.length);
      drawRect(stone, 78, 42, hexToColor(index % 2 === 0 ? '#b29b76' : '#9f8968', 230));
    });

    this.bridgeCrack.active = bridgeSafety < 58;
    const crackAlpha = bridgeSafety < 25 ? 255 : 180;
    drawStroke(
      this.bridgeCrack,
      [
        [-70, 48],
        [-22, 18],
        [-40, -10],
        [18, -34],
        [58, -54],
      ],
      hexToColor('#2d2119', crackAlpha),
      bridgeSafety < 25 ? 9 : 6,
    );
  }

  private setBridgeActive(active: boolean) {
    this.bridgeDeck.active = active;
    this.bridgeRailTop.active = active;
    this.bridgeRailBottom.active = active;
    this.bridgeCrack.active = active && this.bridgeCrack.active;
    this.bridgeStones.forEach((stone) => {
      stone.active = active && stone.active;
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
