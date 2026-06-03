import { Component, Label, Node, _decorator } from 'cc';
import type { AppliedEffect, GameValues, StateLabels } from '../data/types';
import { applySlicedSprite, spritePaths } from '../core/AssetLibrary';
import { createLabel, createNode, drawRect, hexToColor } from '../core/NodeFactory';

const { ccclass } = _decorator;

interface StatusRow {
  key: string;
  valueLabel: Label;
  deltaLabel: Label;
  barRoot: Node;
  barFill: Node;
}

const barColors = ['#4f7a3d', '#cda45a', '#5a3a25', '#a85f3c'];

@ccclass('StatusPanel')
export class StatusPanel extends Component {
  private labels!: StateLabels;
  private rows: StatusRow[] = [];

  build(parent: Node) {
    this.node.parent = parent;
    this.node.setPosition(0, 88, 0);
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
      drawRect(row.barRoot, 282, 12, hexToColor('#2d2119', 70));
      row.barFill.setPosition(-141 + (282 * percent) / 2, 0, 0);
      drawRect(row.barFill, 282 * percent, 12, hexToColor(barColors[index % barColors.length]));
    });
  }

  hide() {
    this.node.active = false;
  }

  private rebuild(values: GameValues) {
    [...this.node.children].forEach((child) => child.destroy());
    this.rows = [];

    const shadow = createNode('StatusShadow', this.node, 618, 222, 4, -4);
    drawRect(shadow, 618, 222, hexToColor('#17231b', 68));

    const panel = createNode('StatusPaper', this.node, 610, 216, 0, 0);
    drawRect(panel, 610, 216, hexToColor('#fff3d2', 232));
    applySlicedSprite(panel, spritePaths.panelBeige);
    createLabel('StatusTitle', panel, '状态', 120, 30, 19, hexToColor('#17231b'), -235, 78);

    Object.entries(this.labels).forEach(([key, label], index) => {
      const y = 44 - index * 40;
      createLabel(`Label_${key}`, panel, label.label, 150, 30, 17, hexToColor('#2d2119'), -220, y);
      const valueLabel = createLabel(`Value_${key}`, panel, '', 58, 30, 18, hexToColor('#17231b'), 244, y);
      const deltaLabel = createLabel(`Delta_${key}`, panel, '', 56, 30, 15, hexToColor('#a85f3c'), 194, y);
      const barRoot = createNode(`Bar_${key}`, panel, 282, 12, 0, y);
      const barFill = createNode(`BarFill_${key}`, barRoot, 1, 12, -141, 0);
      this.rows.push({ key, valueLabel, deltaLabel, barRoot, barFill });
    });

    this.refresh(values);
  }
}
