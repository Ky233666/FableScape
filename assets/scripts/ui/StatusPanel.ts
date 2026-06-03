import { Component, Label, Node, _decorator } from 'cc';
import type { AppliedEffect, GameValues, StateLabels } from '../data/types';
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
    this.node.setPosition(0, -20, 0);
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
      row.valueLabel.string = `${value}`;
      const delta = changeMap.get(row.key) ?? 0;
      row.deltaLabel.string = delta === 0 ? '' : delta > 0 ? `+${delta}` : `${delta}`;
      drawRect(row.barRoot, 300, 12, hexToColor('#2d2119', 55));
      row.barFill.setPosition(-150 + (300 * percent) / 2, 0, 0);
      drawRect(row.barFill, 300 * percent, 12, hexToColor(barColors[index % barColors.length]));
    });
  }

  hide() {
    this.node.active = false;
  }

  private rebuild(values: GameValues) {
    [...this.node.children].forEach((child) => child.destroy());
    this.rows = [];

    const panel = createNode('StatusPaper', this.node, 640, 220, 0, 0);
    drawRect(panel, 640, 220, hexToColor('#fff3d2', 225));
    createLabel('StatusTitle', panel, '状态', 120, 40, 22, hexToColor('#17231b'), -260, 80);

    Object.entries(this.labels).forEach(([key, label], index) => {
      const y = 42 - index * 42;
      createLabel(`Label_${key}`, panel, label.label, 160, 34, 18, hexToColor('#2d2119'), -220, y);
      const valueLabel = createLabel(`Value_${key}`, panel, '', 58, 34, 18, hexToColor('#17231b'), 250, y);
      const deltaLabel = createLabel(`Delta_${key}`, panel, '', 54, 34, 16, hexToColor('#a85f3c'), 190, y);
      const barRoot = createNode(`Bar_${key}`, panel, 300, 12, 20, y);
      const barFill = createNode(`BarFill_${key}`, barRoot, 1, 12, -150, 0);
      this.rows.push({ key, valueLabel, deltaLabel, barRoot, barFill });
    });

    this.refresh(values);
  }
}
