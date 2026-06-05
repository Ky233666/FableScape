import { Component, Node, Vec3, _decorator, tween } from 'cc';
import type { GameValues, VisualTheme, VisualTokenSkin } from '../data/types';
import { createNode, drawCircle, drawEllipse, drawPolygon, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

@ccclass('SheepController')
export class SheepController extends Component {
  private sheepNodes: Node[] = [];
  private targetCount = 5;
  private world: VisualTheme['world'] = 'grassland';
  private tokenSkin: VisualTokenSkin = 'sheep';

  build(parent: Node) {
    this.node.parent = parent;
    this.setCount(this.targetCount);
  }

  applyState(values: GameValues, theme?: VisualTheme) {
    this.world = theme?.world ?? 'grassland';
    this.tokenSkin = theme?.stateBindings?.tokenSkin ?? this.getDefaultTokenSkin(this.world);
    const wealthKey = theme?.stateBindings?.wealthKey ?? 'personalWealth';
    const resourceKey = theme?.stateBindings?.resourceKey ?? 'grassHealth';
    const wealth = values[wealthKey] ?? 40;
    const resourceHealth = values[resourceKey] ?? 100;
    const count = Math.max(2, Math.min(12, Math.round(3 + wealth / 13)));
    this.setCount(count);

    this.sheepNodes.forEach((sheep, index) => {
      const damaged = resourceHealth < 25;
      this.drawToken(sheep, damaged);
      const base = sheep.position.clone();
      tween(sheep)
        .to(0.28 + index * 0.02, { position: base.clone().add(new Vec3((index % 2 ? -1 : 1) * 8, 4, 0)) })
        .to(0.28 + index * 0.02, { position: base })
        .start();
    });
  }

  changeCount(delta: number) {
    this.setCount(Math.max(1, this.targetCount + delta));
  }

  private setCount(count: number) {
    this.targetCount = count;
    while (this.sheepNodes.length < count) {
      const index = this.sheepNodes.length;
      const sheep = createNode(`Sheep_${index}`, this.node, 88, 66, -276 + (index % 6) * 110, -126 - Math.floor(index / 6) * 88);
      this.drawToken(sheep, false);
      this.sheepNodes.push(sheep);
    }

    this.sheepNodes.forEach((sheep, index) => {
      sheep.active = index < count;
    });
  }

  private drawToken(sheep: Node, damaged: boolean) {
    if (this.tokenSkin === 'boat') {
      this.drawBoatToken(sheep, damaged);
      return;
    }
    if (this.tokenSkin === 'horse') {
      this.drawHorseToken(sheep, damaged);
      return;
    }
    if (this.tokenSkin === 'stone') {
      this.drawBridgeToken(sheep, damaged);
      return;
    }
    if (this.tokenSkin === 'page') {
      this.drawLibraryToken(sheep, damaged);
      return;
    }
    this.drawSheep(sheep, damaged);
  }

  private getDefaultTokenSkin(world: VisualTheme['world']): VisualTokenSkin {
    if (world === 'bridge') {
      return 'stone';
    }
    if (world === 'library') {
      return 'page';
    }
    return 'sheep';
  }

  private drawSheep(sheep: Node, thin: boolean) {
    sheep.removeAllChildren();
    const wool = thin ? '#d8cfb6' : '#fff9ea';
    const woolAlpha = thin ? 190 : 235;
    const body = createNode('Body', sheep, thin ? 62 : 76, thin ? 38 : 48, -4, 0);
    drawEllipse(body, thin ? 62 : 76, thin ? 38 : 48, hexToColor(wool, woolAlpha));

    const puffs = [
      [-28, 6],
      [-12, 14],
      [6, 14],
      [24, 6],
      [-8, -8],
    ];
    puffs.forEach(([x, y], index) => {
      const puff = createNode(`Wool_${index}`, sheep, 24, 24, x, y);
      drawCircle(puff, thin ? 10 : 13, hexToColor(wool, woolAlpha));
    });

    const head = createNode('Head', sheep, 30, 30, 34, 8);
    drawCircle(head, thin ? 12 : 15, hexToColor('#5a3a25'));
    const ear = createNode('Ear', sheep, 12, 18, 44, 20);
    drawEllipse(ear, 12, 18, hexToColor('#5a3a25'));
    const eye = createNode('Eye', sheep, 5, 5, 39, 12);
    drawCircle(eye, 2.4, hexToColor('#f4e7c4'));

    const legColor = thin ? '#6b4a2e' : '#4a2f1e';
    const legA = createNode('LegA', sheep, 8, 25, -18, -28);
    const legB = createNode('LegB', sheep, 8, 25, 8, -28);
    drawRect(legA, 8, 25, hexToColor(legColor));
    drawRect(legB, 8, 25, hexToColor(legColor));
  }

  private drawBridgeToken(node: Node, damaged: boolean) {
    node.removeAllChildren();
    const shadow = createNode('StoneShadow', node, 82, 22, 0, -28);
    drawEllipse(shadow, 82, 22, hexToColor('#17231b', 70));

    const stone = createNode('StoneBlock', node, damaged ? 68 : 78, damaged ? 38 : 46, 0, -4);
    drawPolygon(
      stone,
      [
        [-34, 18],
        [26, 22],
        [39, -10],
        [14, -24],
        [-38, -18],
      ],
      hexToColor(damaged ? '#8a7860' : '#b29b76', 230),
    );

    const lamp = createNode('WorkLamp', node, 22, 32, 26, 22);
    drawCircle(lamp, damaged ? 8 : 11, hexToColor(damaged ? '#b48a43' : '#f4e7c4', damaged ? 170 : 230));
    const handle = createNode('LampHandle', node, 10, 28, 26, 4);
    drawRect(handle, 6, 28, hexToColor('#5a3a25'));
  }

  private drawLibraryToken(node: Node, damaged: boolean) {
    node.removeAllChildren();
    const shadow = createNode('PageShadow', node, 78, 18, 0, -30);
    drawEllipse(shadow, 78, 18, hexToColor('#17231b', 65));

    const page = createNode('Page', node, damaged ? 58 : 66, damaged ? 72 : 80, 0, 0);
    drawPolygon(
      page,
      [
        [-30, 38],
        [24, 42],
        [34, -30],
        [-26, -40],
      ],
      hexToColor(damaged ? '#d8c08a' : '#f4e7c4', 235),
    );

    const markA = createNode('PageLineA', node, 36, 5, 0, 12);
    const markB = createNode('PageLineB', node, 28, 5, 2, -6);
    drawRect(markA, damaged ? 28 : 36, 5, hexToColor(damaged ? '#a85f3c' : '#5a3a25', damaged ? 180 : 130));
    drawRect(markB, damaged ? 20 : 28, 5, hexToColor(damaged ? '#a85f3c' : '#5a3a25', damaged ? 160 : 110));
  }

  private drawBoatToken(node: Node, damaged: boolean) {
    node.removeAllChildren();
    const shadow = createNode('BoatShadow', node, 88, 18, 0, -30);
    drawEllipse(shadow, 88, 18, hexToColor('#17231b', 70));

    const hull = createNode('Hull', node, damaged ? 76 : 84, damaged ? 38 : 42, 0, -8);
    drawPolygon(
      hull,
      [
        [-42, 10],
        [42, 10],
        [26, -20],
        [-28, -22],
      ],
      hexToColor(damaged ? '#6f5238' : '#8b6a3d', 238),
    );

    const cargoA = createNode('CargoA', node, 22, 20, -18, 18);
    const cargoB = createNode('CargoB', node, 22, 20, 8, 20);
    drawRect(cargoA, damaged ? 18 : 22, damaged ? 16 : 20, hexToColor(damaged ? '#a85f3c' : '#cda45a', 220));
    drawRect(cargoB, damaged ? 18 : 22, damaged ? 16 : 20, hexToColor(damaged ? '#a85f3c' : '#f4e7c4', 210));

    const mast = createNode('Mast', node, 6, 54, 22, 10);
    drawRect(mast, 5, damaged ? 42 : 54, hexToColor('#5a3a25', 230));
    const sail = createNode('Sail', node, 34, 42, 38, 12);
    drawPolygon(
      sail,
      [
        [-16, 18],
        [-16, -18],
        [18, -10],
      ],
      hexToColor(damaged ? '#d8c08a' : '#f4e7c4', damaged ? 190 : 235),
    );
  }

  private drawHorseToken(node: Node, damaged: boolean) {
    node.removeAllChildren();
    const shadow = createNode('HorseShadow', node, 86, 18, 0, -30);
    drawEllipse(shadow, 86, 18, hexToColor('#17231b', 70));

    const body = createNode('HorseBody', node, damaged ? 62 : 72, damaged ? 34 : 40, -6, -4);
    drawEllipse(body, damaged ? 62 : 72, damaged ? 34 : 40, hexToColor(damaged ? '#8b6a3d' : '#9b6c31', 235));

    const neck = createNode('HorseNeck', node, 24, 42, 22, 8);
    drawPolygon(
      neck,
      [
        [-10, -18],
        [6, -18],
        [14, 18],
        [-4, 22],
      ],
      hexToColor(damaged ? '#7a5434' : '#8b5a2f', 235),
    );

    const head = createNode('HorseHead', node, damaged ? 28 : 32, damaged ? 24 : 28, 42, 22);
    drawEllipse(head, damaged ? 28 : 32, damaged ? 24 : 28, hexToColor(damaged ? '#7a5434' : '#8b5a2f', 238));
    const ear = createNode('HorseEar', node, 12, 20, 48, 40);
    drawPolygon(
      ear,
      [
        [-5, -8],
        [1, 10],
        [7, -6],
      ],
      hexToColor('#5a3a25', 230),
    );

    const mane = createNode('HorseMane', node, 12, 48, 18, 12);
    drawPolygon(
      mane,
      [
        [-6, 24],
        [6, 18],
        [-4, 8],
        [6, -4],
        [-6, -24],
      ],
      hexToColor(damaged ? '#3d2a1d' : '#5a3a25', 230),
    );

    const legColor = damaged ? '#6b4a2e' : '#5a3a25';
    const legA = createNode('HorseLegA', node, 8, damaged ? 24 : 30, -26, -30);
    const legB = createNode('HorseLegB', node, 8, damaged ? 24 : 30, 8, -30);
    drawRect(legA, 8, damaged ? 24 : 30, hexToColor(legColor, 235));
    drawRect(legB, 8, damaged ? 24 : 30, hexToColor(legColor, 235));

    const tail = createNode('HorseTail', node, 24, 28, -46, 4);
    drawPolygon(
      tail,
      [
        [10, 12],
        [-14, -2],
        [-8, -14],
        [6, -4],
      ],
      hexToColor('#5a3a25', damaged ? 190 : 235),
    );
  }
}
