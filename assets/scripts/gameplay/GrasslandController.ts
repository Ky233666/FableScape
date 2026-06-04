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
  private libraryShelf!: Node;
  private libraryDesk!: Node;
  private recommendationLane!: Node;
  private echoWindow!: Node;
  private soilPatches: Node[] = [];
  private grassTufts: Node[] = [];
  private bridgeStones: Node[] = [];
  private libraryCards: Node[] = [];
  private echoRings: Node[] = [];
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
    this.libraryShelf = createNode('LibraryShelf', this.node, DESIGN_WIDTH, 520, 0, -80);
    this.libraryDesk = createNode('LibraryDesk', this.node, DESIGN_WIDTH, 210, 0, -455);
    this.recommendationLane = createNode('RecommendationLane', this.node, 260, 640, 70, -265);
    this.echoWindow = createNode('EchoWindow', this.node, 260, 260, -205, 120);
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

    for (let i = 0; i < 14; i += 1) {
      const card = createNode(`LibraryCard_${i}`, this.node, 54, 82, -300 + (i % 7) * 100, -100 - Math.floor(i / 7) * 118);
      this.libraryCards.push(card);
    }

    for (let i = 0; i < 4; i += 1) {
      const ring = createNode(`EchoRing_${i}`, this.node, 120 + i * 42, 120 + i * 42, -205, 120);
      this.echoRings.push(ring);
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
    } else if (world === 'library') {
      this.drawLibraryWorld(resourceHealth);
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
    this.setLibraryActive(false);
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
    this.setLibraryActive(false);
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

  private drawLibraryWorld(viewpointDiversity: number) {
    const shelfColor = viewpointDiversity >= 65 ? '#5a3a25' : viewpointDiversity >= 35 ? '#4a3325' : '#32241c';
    const deskColor = viewpointDiversity >= 45 ? '#8b6a3d' : '#5f4a34';
    drawEllipse(this.farHill, 920, 280, hexToColor('#7f6d4f'));
    drawEllipse(this.nearHill, 980, 320, hexToColor('#3e3a2b'));
    drawRect(this.field, DESIGN_WIDTH, 760, hexToColor('#2d2119'));
    drawRect(this.path, 260, 640, hexToColor(viewpointDiversity >= 50 ? '#6f5b3c' : '#4a3525', 210));

    this.soilPatches.forEach((patch) => {
      patch.active = false;
    });
    this.grassTufts.forEach((tuft) => {
      tuft.active = false;
    });

    this.setBridgeActive(false);
    this.setLibraryActive(true);
    drawRect(this.libraryShelf, DESIGN_WIDTH, 520, hexToColor(shelfColor, 235));
    drawRect(this.libraryDesk, DESIGN_WIDTH, 210, hexToColor(deskColor, 235));
    drawPolygon(
      this.recommendationLane,
      [
        [-74, 320],
        [74, 320],
        [146, -320],
        [-146, -320],
      ],
      hexToColor(viewpointDiversity < 35 ? '#a85f3c' : '#cda45a', viewpointDiversity < 35 ? 128 : 92),
    );
    drawCircle(this.echoWindow, 112, hexToColor(viewpointDiversity < 35 ? '#a85f3c' : '#f4e7c4', viewpointDiversity < 35 ? 120 : 95));

    const activeCards = Math.max(4, Math.ceil((viewpointDiversity / 100) * this.libraryCards.length));
    const colors = viewpointDiversity >= 55
      ? ['#f4e7c4', '#cda45a', '#7b8f62', '#a85f3c']
      : ['#f4e7c4', '#e5d09a'];
    this.libraryCards.forEach((card, index) => {
      card.active = index < activeCards;
      drawRect(card, 54, 82, hexToColor(colors[index % colors.length], 235));
      card.setRotationFromEuler(0, 0, (index % 3 - 1) * 4);
    });

    const ringCount = viewpointDiversity >= 65 ? 1 : viewpointDiversity >= 35 ? 3 : 4;
    this.echoRings.forEach((ring, index) => {
      ring.active = index < ringCount;
      drawEllipse(ring, 120 + index * 42, 120 + index * 42, hexToColor('#f4e7c4', 30 + index * 18));
    });
  }

  private setLibraryActive(active: boolean) {
    this.libraryShelf.active = active;
    this.libraryDesk.active = active;
    this.recommendationLane.active = active;
    this.echoWindow.active = active;
    this.libraryCards.forEach((card) => {
      card.active = active && card.active;
    });
    this.echoRings.forEach((ring) => {
      ring.active = active && ring.active;
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
