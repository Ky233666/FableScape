import { Component, Label, Node, _decorator } from 'cc';
import type { AppliedEffect, GameValues, StateLabels } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import { Motion } from '../core/Motion';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

interface StatusRow {
  key: string;
  root: Node;
  valueLabel: Label;
  deltaLabel: Label;
  barRoot: Node;
  barFill: Node;
  barWidth: number;
}

const barColors = ['#4f7a3d', '#cda45a', '#5a3a25', '#a85f3c'];

@ccclass('StatusPanel')
export class StatusPanel extends Component {
  private labels!: StateLabels;
  private rows: StatusRow[] = [];

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(0, 92, 0);
    this.hide();
  }

  show(labels: StateLabels, values: GameValues) {
    this.node.active = true;
    this.labels = labels;
    this.rebuild(values);
  }

  refresh(values: GameValues, changes: AppliedEffect[] = []) {
    const changeMap = new Map(changes.map((item) => [item.key, item.delta]));
    this.rows.forEach((row, index) => {
      const config = this.labels[row.key];
      const value = values[row.key] ?? 0;
      const percent = Math.max(0, Math.min(1, (value - config.min) / (config.max - config.min)));
      row.valueLabel.string = `${Math.round(value)}`;
      const delta = changeMap.get(row.key) ?? 0;
      row.deltaLabel.string = delta === 0 ? '' : delta > 0 ? `+${delta}` : `${delta}`;
      row.deltaLabel.color = delta >= 0 ? hexToColor('#2f5237') : hexToColor('#a85f3c');
      drawRect(row.barRoot, row.barWidth, 10, hexToColor('#2d2119', 70));
      row.barFill.setPosition(-row.barWidth / 2 + (row.barWidth * percent) / 2, 0, 0);
      drawRect(row.barFill, row.barWidth * percent, 10, hexToColor(barColors[index % barColors.length]));
      if (delta !== 0) {
        Motion.pulse(row.root, 1.04, 0.1);
      }
    });
  }

  hide() {
    this.node.active = false;
  }

  private rebuild(values: GameValues) {
    [...this.node.children].forEach((child) => child.destroy());
    this.rows = [];

    const shadow = createNode('StatusShadow', this.node, 618, 178, 4, -4);
    drawRect(shadow, 618, 178, hexToColor('#17231b', 68));

    const panel = createNode('StatusPaper', this.node, 610, 172, 0, 0);
    drawRect(panel, 610, 172, hexToColor('#fff3d2', 232));
    applySlicedSprite(panel, spritePaths.panelBeige);
    createLabel('StatusTitle', panel, '状态', 90, 28, 17, hexToColor('#17231b'), -252, 64);

    Object.entries(this.labels).forEach(([key, label], index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const baseX = col === 0 ? -150 : 150;
      const baseY = 20 - row * 64;
      const barWidth = 250;
      const rowRoot = createNode(`StatusRow_${key}`, panel, 292, 58, baseX, baseY + 6);
      createLabel(`Label_${key}`, rowRoot, label.label, 122, 26, 15, hexToColor('#2d2119'), -64, 16);
      const valueLabel = createLabel(`Value_${key}`, rowRoot, '', 50, 26, 17, hexToColor('#17231b'), 74, 16);
      const deltaLabel = createLabel(`Delta_${key}`, rowRoot, '', 42, 26, 14, hexToColor('#a85f3c'), 122, 16);
      const barRoot = createNode(`Bar_${key}`, rowRoot, barWidth, 10, 0, -14);
      const barFill = createNode(`BarFill_${key}`, barRoot, 1, 10, -barWidth / 2, 0);
      this.rows.push({ key, root: rowRoot, valueLabel, deltaLabel, barRoot, barFill, barWidth });
    });

    this.refresh(values);
  }
}
