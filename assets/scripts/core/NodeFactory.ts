import { Color, Component, Graphics, Label, Node, UITransform, Vec3, _decorator } from 'cc';

const { ccclass } = _decorator;

export const DESIGN_WIDTH = 720;
export const DESIGN_HEIGHT = 1560;

export const hexToColor = (hex: string, alpha = 255) => {
  const normalized = hex.replace('#', '');
  const value = parseInt(normalized, 16);
  return new Color((value >> 16) & 255, (value >> 8) & 255, value & 255, alpha);
};

export const setNodeSize = (node: Node, width: number, height: number) => {
  const transform = node.getComponent(UITransform) ?? node.addComponent(UITransform);
  transform.setContentSize(width, height);
  return transform;
};

export const createNode = (name: string, parent: Node, width: number, height: number, x = 0, y = 0) => {
  const node = new Node(name);
  node.parent = parent;
  node.position = new Vec3(x, y, 0);
  setNodeSize(node, width, height);
  return node;
};

export const drawRect = (node: Node, width: number, height: number, color: Color) => {
  const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
  graphics.clear();
  graphics.fillColor = color;
  graphics.rect(-width / 2, -height / 2, width, height);
  graphics.fill();
  return graphics;
};

export const drawCircle = (node: Node, radius: number, color: Color) => {
  const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
  graphics.clear();
  graphics.fillColor = color;
  graphics.circle(0, 0, radius);
  graphics.fill();
  return graphics;
};

export const drawEllipse = (node: Node, width: number, height: number, color: Color) => {
  const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
  graphics.clear();
  graphics.fillColor = color;
  graphics.ellipse(0, 0, width / 2, height / 2);
  graphics.fill();
  return graphics;
};

export const drawPolygon = (node: Node, points: Array<[number, number]>, color: Color) => {
  const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
  graphics.clear();
  graphics.fillColor = color;
  if (points.length > 0) {
    graphics.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => graphics.lineTo(x, y));
    graphics.close();
    graphics.fill();
  }
  return graphics;
};

export const drawStroke = (node: Node, points: Array<[number, number]>, color: Color, lineWidth = 4) => {
  const graphics = node.getComponent(Graphics) ?? node.addComponent(Graphics);
  graphics.clear();
  graphics.strokeColor = color;
  graphics.lineWidth = lineWidth;
  if (points.length > 0) {
    graphics.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => graphics.lineTo(x, y));
    graphics.stroke();
  }
  return graphics;
};

export const createLabel = (
  name: string,
  parent: Node,
  text: string,
  width: number,
  height: number,
  fontSize: number,
  color: Color,
  x = 0,
  y = 0,
) => {
  const node = createNode(name, parent, width, height, x, y);
  const label = node.addComponent(Label);
  label.string = text;
  label.fontSize = fontSize;
  label.lineHeight = Math.round(fontSize * 1.35);
  label.color = color;
  label.overflow = Label.Overflow.CLAMP;
  label.enableWrapText = true;
  label.horizontalAlign = Label.HorizontalAlign.CENTER;
  label.verticalAlign = Label.VerticalAlign.CENTER;
  return label;
};

@ccclass('NodeFactoryMarker')
export class NodeFactoryMarker extends Component {}
